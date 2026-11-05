// External QA only. Use an externally installed Playwright via NODE_PATH.
// Az Agóra urai ellenőrzése: reszponzivitás, billentyűzet, fókusz, inert, dupla Enter, tárhely, sérült mentés, teljes játék 2/3/4 fővel.
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),http=require('http');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 const file=path.join(root,decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync(file));
});
const res=[];const ok=(n,c,d)=>res.push((c?'PASS ':'FAIL ')+n+(d?' – '+d:''));
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const U='http://127.0.0.1:'+server.address().port+'/games/agora.html';
 const b=await chromium.launch(process.env.QA_BROWSER?{channel:process.env.QA_BROWSER}:{});
 const mk=async(w,h,init)=>{const ctx=await b.newContext({viewport:{width:w,height:h}});if(init)await ctx.addInitScript(init);const pg=await ctx.newPage();const errs=[];
  pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('console',m=>{if(m.type()==='error'&&!/fonts\.g|ERR_|Failed to load/.test(m.text()))errs.push('CE '+m.text());});return{ctx,pg,errs};};
 const fi=pg=>pg.evaluate(()=>{const a=document.activeElement;return (a.id||a.tagName)+'|'+(a.textContent||'').trim().slice(0,22)});
 const waitIdle=async pg=>{for(let i=0;i<60;i++){const busy=await pg.evaluate(()=>S&&S.busy);if(!busy)return;await pg.waitForTimeout(150);}};
 // reszponzív
 for(const w of [360,768,1280]){const{ctx,pg,errs}=await mk(w,w<500?740:900);await pg.goto(U);await pg.waitForTimeout(300);
  const o=()=>pg.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  const a=await o();await pg.click('#bStart');await pg.waitForTimeout(200);const c=await o();
  ok(`${w}px nincs vízszintes görgetés`,a<=0&&c<=0,a+'/'+c);ok(`${w}px konzol`,!errs.length,errs.join(';'));await ctx.close();}
 // billentyűzetes kör + modal fókusz
 {const{ctx,pg,errs}=await mk(1280,900);await pg.goto(U);await pg.waitForTimeout(300);
  await pg.focus('#bStart');await pg.keyboard.press('Enter');await pg.waitForTimeout(250);
  ok('indítás után a fókusz érvényes elemen',!/BODY/.test(await fi(pg)),await fi(pg));
  await pg.focus('#bGo');await pg.keyboard.press('Enter');await pg.waitForTimeout(300);
  ok('az első dobás gomb fókuszt kap',/bRoll/.test(await fi(pg)),await fi(pg));
  // dobás Enterrel, majd kártya/mező
  let cardSeen=false;
  for(let t=0;t<12&&!cardSeen;t++){
    await pg.focus('#bRoll');await pg.keyboard.press('Enter');await waitIdle(pg);await pg.waitForTimeout(500);
    if(await pg.locator('#bAns').count()){cardSeen=true;break;}
    if(await pg.locator('#bSkip').count()){await pg.focus('#bSkip');await pg.keyboard.press('Enter');await pg.waitForTimeout(400);}
    else if(await pg.locator('#vMe,#vRoll').count()){break;}
    else if(await pg.locator('#bRoll').count()===0)await pg.waitForTimeout(400);
  }
  if(cardSeen){
   ok('kártya-ablak: fókusz az ablakban',await pg.evaluate(()=>document.querySelector('#overlay').contains(document.activeElement)),await fi(pg));
   ok('háttér inert kártyánál',await pg.evaluate(()=>document.querySelector('main.layout').hasAttribute('inert')));
   let leak=0;for(let i=0;i<25;i++){await pg.keyboard.press('Tab');if(await pg.evaluate(()=>{const o=document.querySelector('#overlay');const a=document.activeElement;return !o.hidden&&a!==document.body&&!o.contains(a)}))leak++;}
   ok('Tab nem lép ki a háttérbe',leak===0,'kilépés '+leak+'/25');
   await pg.focus('#bAns');await pg.keyboard.press('Enter');await pg.waitForTimeout(500);
   for(const row of await pg.locator('.rrow').all()){const bs=await row.locator('[data-r]').all();await bs[bs.length-1].focus();await pg.keyboard.press('Enter');}
   const before=await pg.evaluate(()=>S.players.map(p=>p.score).join());
   await pg.focus('#bSave');await pg.keyboard.down('Enter');await pg.keyboard.down('Enter');await pg.keyboard.up('Enter');await pg.waitForTimeout(1500);
   ok('mentés ismételt Enterrel egyszer rögzít',await pg.evaluate(()=>S.results.length)===1,String(await pg.evaluate(()=>S.results.length)));
   ok('kártya után a fókusz érvényes (nem BODY)',!/BODY/.test(await fi(pg)),await fi(pg));
  } else ok('kártyás mezőt nem értünk el 12 dobásból (nem hiba)',true);
  ok('élő régió tartalmaz szöveget',(await pg.evaluate(()=>document.querySelector('#sr').textContent)).length>0);
  // szabályablak Esc és fókusz
  await pg.focus('#bRules');await pg.keyboard.press('Enter');await pg.waitForTimeout(200);
  ok('szabályablak: fókusz benne',await pg.evaluate(()=>document.querySelector('#overlay').contains(document.activeElement)));
  await pg.keyboard.press('Escape');await pg.waitForTimeout(200);ok('Esc után fókusz a Szabályok gombon',/^bRules/.test(await fi(pg)),await fi(pg));
  await pg.focus('#bNew');await pg.keyboard.press('Enter');await pg.waitForTimeout(200);await pg.keyboard.press('Escape');await pg.waitForTimeout(200);
  ok('Új játék megerősítés Esc után fókusz a gombon',/^bNew/.test(await fi(pg)),await fi(pg));
  ok('konzol',!errs.length,errs.join(';'));await ctx.close();}
 // bSkip dupla kattintás: egy játékos kimarad csak egyszer
 {const{ctx,pg,errs}=await mk(1280,900);await pg.goto(U);await pg.waitForTimeout(300);await pg.click('#bStart');await pg.waitForTimeout(200);
  await pg.click('#bGo');await pg.waitForTimeout(300);
  await pg.evaluate(()=>{S.players[S.cur].skip=1;renderAll();});await pg.waitForTimeout(200);
  const t0=await pg.evaluate(()=>S.turn);await pg.dblclick('#bSkip');await pg.waitForTimeout(500);
  const t1=await pg.evaluate(()=>S.turn);ok('Tovább (száműzetés) dupla kattintásra egyszer lép',t1-t0===1,t0+'→'+t1);
  ok('konzol skip',!errs.length,errs.join(';'));await ctx.close();}
 // újrakezdés x3, mentés, tárhely, sérült mentés
 {const{ctx,pg,errs}=await mk(1280,900);await pg.goto(U);await pg.waitForTimeout(300);
  for(let k=0;k<3;k++){await pg.click('#bStart');await pg.waitForTimeout(150);await pg.click('#bNew');await pg.waitForTimeout(150);await pg.click('#okB');await pg.waitForTimeout(250);
   ok(`újrakezdés #${k+1}`,await pg.evaluate(()=>S===null&&!!document.querySelector('#bStart')&&localStorage.getItem(KEYQ)===null));}
  await pg.click('#bStart');await pg.waitForTimeout(150);await pg.reload();await pg.waitForTimeout(300);
  ok('mentés: újratöltés után folytatható',await pg.evaluate(()=>!!S&&S.v===2));ok('konzol D',!errs.length,errs.join(';'));await ctx.close();}
 {const{ctx,pg,errs}=await mk(1280,900,()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('x')}})});await pg.goto(U);await pg.waitForTimeout(300);await pg.click('#bStart');await pg.waitForTimeout(300);
  ok('tiltott tárhely mellett fut',await pg.evaluate(()=>S&&S.phase==='rolloff'));ok('konzol E',!errs.length,errs.join(';'));await ctx.close();}
 for(const bad of ['{"v":2}','{{{','{"v":2,"phase":"play","players":[]}','{"v":2,"n":3,"phase":"play","cur":9,"players":[{}]}','{"v":2,"n":2,"rounds":5,"turn":0,"phase":"play","cur":0,"start":0,"players":[{"name":"A","pos":99,"score":0,"stars":0,"skip":0,"color":"#000"},{"name":"B","pos":1,"score":0,"stars":0,"skip":0,"color":"#000"}],"decks":{},"log":[],"rolloff":[],"results":[]}']){
  const{ctx,pg,errs}=await mk(1280,900,`try{localStorage.setItem('agora-urai-online-v2',${JSON.stringify(bad)})}catch(e){}`);await pg.goto(U);await pg.waitForTimeout(400);
  ok('sérült mentés ('+bad.slice(0,26)+') → tiszta indulás',(await pg.locator('#bStart').count())===1&&!errs.length,errs.join(';'));await ctx.close();}
 // teljes játék, 2/3/4 fő
 for(const n of [2,3,4]){const{ctx,pg,errs}=await mk(1280,900);await pg.goto(U);await pg.waitForTimeout(300);await pg.click(`[data-n="${n}"]`);await pg.click('#bStart');await pg.click('#bGo');
  let g=0;while(g++<1500){try{
   const ph=await pg.evaluate(()=>S&&S.phase);if(ph==='end')break;
   const vis=async s=>{const l=pg.locator(s);return(await l.count())>0&&await l.first().isVisible();};
   if(await vis('#eClose')){if(await vis('#tbGo')){for(const i of await pg.locator('input[type=number]').all())await i.fill(String(Math.floor(Math.random()*7000)));await pg.click('#tbGo');continue;}break;}
   if(await vis('#bAns')){if(await pg.locator('#bAns').isEnabled()){await pg.click('#bAns');}else await pg.waitForTimeout(100);continue;}
   if(await vis('#bSave')){for(const row of await pg.locator('.rrow').all()){const bs=await row.locator('[data-r]').all();await bs[Math.floor(Math.random()*bs.length)].click();}await pg.click('#bSave');await pg.waitForTimeout(350);continue;}
   if(await vis('#vMe')){await pg.click('#vMe');continue;}
   if(await vis('.pts [data-v]')){await pg.locator('.pts [data-v]').first().click();continue;}
   if(await vis('#vRoll')){await pg.click('#vRoll');continue;}
   if(await vis('#vDone')){await pg.click('#vDone');continue;}
   if(await vis('#bSkip')){await pg.click('#bSkip');await pg.waitForTimeout(350);continue;}
   if(await vis('#bRoll')&&await pg.locator('#bRoll').isEnabled()){await pg.click('#bRoll');await pg.waitForTimeout(300);await waitIdle(pg);continue;}
   await pg.waitForTimeout(150);}catch(e){await pg.waitForTimeout(100);}}
  ok(`${n} fős teljes játék a végéig`,await pg.evaluate(()=>S.phase==='end'),'lépés '+g);ok(`${n} fős konzol`,!errs.length,errs.join(';'));await ctx.close();}
 console.log(res.join('\n'));console.log('FAILS',res.filter(r=>r.startsWith('FAIL')).length,'/',res.length);
 await b.close();server.close();if(res.some(r=>r.startsWith('FAIL')))process.exitCode=1;})();

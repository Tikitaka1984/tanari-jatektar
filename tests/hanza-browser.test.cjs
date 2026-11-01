// External QA only. Use an externally installed Playwright via NODE_PATH.
// A Hanza-játék ellenőrzése: reszponzivitás, billentyűzet, fókusz, dupla kattintás, újrakezdés, tárhely, sérült mentés.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream');
 res.end(fs.readFileSync(file));
});
let URL;
const {chromium}=require('playwright');
const res=[];const ok=(n,c,d)=>{res.push((c?'PASS ':'FAIL ')+n+(d?' – '+d:''));};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));URL='http://127.0.0.1:'+server.address().port+'/games/hanza.html';
 const b=await chromium.launch(process.env.QA_BROWSER?{channel:process.env.QA_BROWSER}:{});
 const mk=async(w,h,init)=>{const ctx=await b.newContext({viewport:{width:w,height:h}});if(init)await ctx.addInitScript(init);const pg=await ctx.newPage();const errs=[];
   pg.on('pageerror',e=>errs.push('PE '+e.message));pg.on('console',m=>{if(m.type()==='error'&&!/fonts\.g|ERR_|Failed to load resource/.test(m.text()))errs.push('CE '+m.text());});
   pg.on('requestfailed',r=>{if(!/fonts\.g/.test(r.url()))errs.push('RF '+r.url());});
   return {ctx,pg,errs};};
 const focusInfo=pg=>pg.evaluate(()=>{const a=document.activeElement;return a?(a.id||a.tagName)+'|'+(a.className||'')+'|'+(a.textContent||'').trim().slice(0,30):null;});
 // A reszponzív
 for(const w of [360,768,1280]){
  const {ctx,pg,errs}=await mk(w,w<500?740:900);await pg.goto(URL);await pg.waitForTimeout(300);
  const ov=await pg.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  ok(`setup ${w}px nincs vízszintes görgetés`,ov<=0,'túllógás '+ov);
  await pg.click('#bStart');await pg.waitForTimeout(200);
  const ov2=await pg.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  ok(`játék ${w}px nincs vízszintes görgetés (know fázis)`,ov2<=0,'túllógás '+ov2);
  await pg.click('#bKnow');await pg.waitForTimeout(150);
  const ov3=await pg.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  ok(`kártya-ablak ${w}px nincs vízszintes görgetés`,ov3<=0,'túllógás '+ov3);
  ok(`konzol ${w}px`,errs.length===0,errs.join(';'));
  await ctx.close();
 }
 // B billentyűzetes végigjátszás
 {
  const {ctx,pg,errs}=await mk(1280,900);await pg.goto(URL);await pg.waitForTimeout(300);
  // tab-sorrend a nyitóképernyőn
  const seq=[];for(let i=0;i<14;i++){await pg.keyboard.press('Tab');seq.push(await focusInfo(pg));}
  console.log('TAB sorrend (setup):',seq.map(x=>x&&x.split('|')[0]+':'+x.split('|')[2]).join(' > '));
  await pg.focus('#bStart');await pg.keyboard.press('Enter');await pg.waitForTimeout(250);
  let f=await focusInfo(pg);ok('indítás után a fókusz a kör címsorára kerül',/turnH/.test(f),f);
  await pg.focus('#bKnow');await pg.keyboard.press('Enter');await pg.waitForTimeout(250);
  f=await focusInfo(pg);ok('kártya-ablak megnyitásakor a fókusz az ablakban van',await pg.evaluate(()=>$('#overlay').contains(document.activeElement)),f);
  ok('háttér inert modal alatt',await pg.evaluate(()=>document.querySelector('main.layout').hasAttribute('inert')));
  await pg.keyboard.press('Enter');await pg.waitForTimeout(450);
  // pontozás billentyűvel
  const n=await pg.evaluate(()=>S.n);
  for(let i=0;i<n;i++){await pg.focus(`[data-p="${i}"][data-v="2"]`);await pg.keyboard.press('Space');}
  await pg.focus('#kSave');await pg.keyboard.press('Enter');await pg.waitForTimeout(300);
  f=await focusInfo(pg);ok('pontozás után a fókusz a kör címsorán',/turnH/.test(f),f);
  ok('act fázis, ablak bezárt, inert megszűnt',await pg.evaluate(()=>S.phase==='act'&&$('#overlay').hidden&&!document.querySelector('main.layout').hasAttribute('inert')));
  // lépés gombbal
  const mvCount=await pg.$$eval('.act.move',e=>e.length);ok('lépésgombok megjelennek',mvCount>0,mvCount+' db');
  const pos0=await pg.evaluate(()=>S.players[S.cur].pos);
  await pg.focus('.act.move');await pg.keyboard.press('Enter');await pg.waitForTimeout(400);
  const pos1=await pg.evaluate(()=>S.players[S.cur].pos);ok('lépés billentyűvel végrehajtva',pos0!==pos1,pos0+'→'+pos1);
  f=await focusInfo(pg);ok('lépés után a fókusz látható, érvényes elemen',/turnH|act/.test(f),f);
  ok('élő régió kapott szöveget',(await pg.evaluate(()=>$('#sr').textContent)).length>0,await pg.evaluate(()=>$('#sr').textContent));
  // szabályablak Esc + fókuszvisszaadás
  await pg.focus('#bRules');await pg.keyboard.press('Enter');await pg.waitForTimeout(200);
  ok('szabályablak fókusza benne',await pg.evaluate(()=>$('#overlay').contains(document.activeElement)));
  await pg.keyboard.press('Escape');await pg.waitForTimeout(200);
  f=await focusInfo(pg);ok('Esc után fókusz a Szabályok gombon',/^bRules/.test(f),f);
  await pg.focus('#bZoom');await pg.keyboard.press('Enter');await pg.waitForTimeout(200);await pg.keyboard.press('Escape');await pg.waitForTimeout(200);
  f=await focusInfo(pg);ok('nagyítás Esc után fókusz a Nagyítás gombon',/^bZoom/.test(f),f);
  // lezárás: confirm -> mégse
  await pg.focus('#bEnd');await pg.keyboard.press('Enter');await pg.waitForTimeout(200);
  await pg.keyboard.press('Escape');await pg.waitForTimeout(200);
  f=await focusInfo(pg);ok('lezárás-megerősítés Esc után fókusz a gombon',/^bEnd/.test(f),f);
  // Tab-csapda ellenőrzés: modalban 12-szer Tab nem megy ki
  await pg.focus('#bRules');await pg.keyboard.press('Enter');await pg.waitForTimeout(200);
  let inside=true;for(let i=0;i<20;i++){await pg.keyboard.press('Tab');inside=inside&&await pg.evaluate(()=>{const a=document.activeElement;return a===document.body||$('#overlay').contains(a);});}
  ok('Tab a modalon belül marad (vagy a böngészőre lép), nem a háttérre',inside);
  await pg.keyboard.press('Escape');
  ok('konzol B',errs.length===0,errs.join(';'));
  await ctx.close();
 }
 // C dupla kattintás / ismételt Enter
 {
  const {ctx,pg,errs}=await mk(1280,900);await pg.goto(URL);await pg.waitForTimeout(300);
  await pg.click('#bStart');await pg.click('#bKnow');await pg.click('#kFlip');await pg.waitForTimeout(400);
  const n=await pg.evaluate(()=>S.n);for(let i=0;i<n;i++)await pg.click(`[data-p="${i}"][data-v="1"]`);
  await pg.dblclick('#kSave');await pg.waitForTimeout(400);
  ok('kártya mentése dupla kattintásra egyszer fut (kör nem lép tovább kétszer)',await pg.evaluate(()=>S.phase==='act'&&S.results.length===1),await pg.evaluate(()=>S.results.length+''));
  const a0=await pg.evaluate(()=>S.players[S.cur].acts);
  await pg.dblclick('.act.move');await pg.waitForTimeout(400);
  const a1=await pg.evaluate(()=>S.players[S.cur].acts);ok('lépés dupla kattintásra 1 akciót (vagy a lépés költségét) von le',a0-a1<=1,a0+'→'+a1);
  const cur0=await pg.evaluate(()=>S.cur);
  await pg.dblclick('#bTurnEnd');await pg.waitForTimeout(400);
  const cur1=await pg.evaluate(()=>[S.cur,S.oi]);ok('Kör vége dupla kattintásra csak egyszer lép',cur1[1]===1,JSON.stringify(cur1));
  // ismételt Enter
  await pg.focus('#bTurnEnd');
  await pg.keyboard.down('Enter');await pg.keyboard.down('Enter');await pg.keyboard.down('Enter');await pg.keyboard.up('Enter');await pg.waitForTimeout(400);
  ok('ismételt Enter nem léptet több játékost',await pg.evaluate(()=>S.oi<=2),await pg.evaluate(()=>String(S.oi)));
  ok('konzol C',errs.length===0,errs.join(';'));await ctx.close();
 }
 // D újrakezdés ×3 + mentés
 {
  const {ctx,pg,errs}=await mk(1280,900);await pg.goto(URL);await pg.waitForTimeout(300);
  for(let k=0;k<3;k++){
    await pg.click('#bStart');await pg.waitForTimeout(150);
    await pg.click('#bNew');await pg.waitForTimeout(150);
    await pg.click('#okB');await pg.waitForTimeout(250);
    ok(`újrakezdés #${k+1}: állapot törölve, nyitóképernyő`,await pg.evaluate(()=>S===null&&!!document.querySelector('#bStart')&&localStorage.getItem(KEYQ)===null));
  }
  const f=await focusInfo(pg);ok('újrakezdés után a fókusz érvényes elemen',!/BODY/.test(f||''),f);
  await pg.click('#bStart');await pg.waitForTimeout(150);
  await pg.reload();await pg.waitForTimeout(300);
  ok('mentés: újratöltés után a játék folytatódik',await pg.evaluate(()=>S&&S.phase==='know'));
  ok('konzol D',errs.length===0,errs.join(';'));await ctx.close();
 }
 // E tiltott tárhely
 {
  const {ctx,pg,errs}=await mk(1280,900,()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}});});
  await pg.goto(URL);await pg.waitForTimeout(300);await pg.click('#bStart');await pg.waitForTimeout(200);await pg.click('#bKnow');await pg.click('#kFlip');await pg.waitForTimeout(400);
  const n=await pg.evaluate(()=>S.n);for(let i=0;i<n;i++)await pg.click(`[data-p="${i}"][data-v="1"]`);await pg.click('#kSave');await pg.waitForTimeout(300);
  ok('tiltott tárhely mellett is fut',await pg.evaluate(()=>S.phase==='act'));
  ok('konzol E (tiltott tárhely)',errs.length===0,errs.join(';'));await ctx.close();
 }
 // F sérült mentés
 for(const bad of ['{"v":1}','{{{nem json','{"v":1,"phase":"act","players":[],"n":3}']){
  const {ctx,pg,errs}=await mk(1280,900,`localStorage.setItem('hanza-kereskedoi-online-v1',${JSON.stringify(bad)});`);
  // fenti init: a nyers szöveget tesszük be
  await pg.goto(URL);await pg.waitForTimeout(400);
  ok('sérült mentés ('+bad.slice(0,18)+') nem állítja le a játékot',await pg.evaluate(()=>!!document.querySelector('#bStart')||!!S));
  ok('konzol F',errs.length===0,errs.join(';'));await ctx.close();
 }
 // G teljes lejátszás gyors tesztje + befejezés
 {
  const {ctx,pg,errs}=await mk(1280,900);await pg.goto(URL);await pg.waitForTimeout(300);
  await pg.click('[data-n="2"]');await pg.click('#bStart');let guard=0;
  while(guard++<400){
    const ph=await pg.evaluate(()=>S&&S.phase);if(ph==='end')break;
    if(ph==='know'){await pg.click('#bKnow');await pg.click('#kFlip');await pg.waitForTimeout(300);const n=await pg.evaluate(()=>S.n);for(let i=0;i<n;i++)await pg.click(`[data-p="${i}"][data-v="2"]`);await pg.click('#kSave');await pg.waitForTimeout(340);continue;}
    const arr=await pg.$$eval('#turn [data-ai]',els=>els.map(e=>JSON.parse(e.dataset.ai).a));
    const i=arr.indexOf('deliver');
    if(i>=0)await pg.click(`#turn [data-ai] >> nth=${i}`);else if(arr.length&&Math.random()<.85)await pg.click(`#turn [data-ai] >> nth=${Math.floor(Math.random()*arr.length)}`);else await pg.click('#bTurnEnd');
    await pg.waitForTimeout(340);
  }
  ok('a játék a végéig lejátszható billentyű/gomb-alapú vezérlőkkel',await pg.evaluate(()=>S.phase==='end'),'lépések '+guard);
  const f=await focusInfo(pg);ok('végső ablakban a fókusz benne van',await pg.evaluate(()=>$('#overlay').contains(document.activeElement)),f);
  await pg.click('#eNew');await pg.waitForTimeout(200);await pg.click('#okB');await pg.waitForTimeout(250);
  ok('befejezés után újrakezdés',await pg.evaluate(()=>S===null));
  ok('konzol G',errs.length===0,errs.join(';'));await ctx.close();
 }
 console.log(res.join('\n'));
 console.log('FAILS',res.filter(r=>r.startsWith('FAIL')).length,'/',res.length);
 await b.close();server.close();
 if(res.some(r=>r.startsWith('FAIL')))process.exitCode=1;
})();

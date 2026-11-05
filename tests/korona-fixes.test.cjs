'use strict';
/* A korona nyomában (games/korona.html) – technikai javítások regressziós ellenőrzése.
 * Lefedi: dupla aktiválás, hibaszám-felfúvódás, térkép frissítése panelzáráskor, elavult időzítők,
 * párbeszédablak (szerepkör, fókusz, Esc, inert háttér), billentyűzetes kerék és várhelyválasztás,
 * a teljesítés állapota a térképjelölő feliratában, érintési felület, a záró próba zsákutcája, újraindítás.
 * Külső fejlesztői függőség: playwright (nem a játék része).
 * Futtatás: NODE_PATH=<playwright mappa> node tests/korona-fixes.test.cjs
 * Más fájl vizsgálata (pl. eredeti verzió): KORONA_FILE=/út/korona.html node tests/korona-fixes.test.cjs
 */
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');

const FILE=path.resolve(process.env.KORONA_FILE||path.join(__dirname,'../games/korona.html'));
const URL=pathToFileURL(FILE).href;
const results=[];
const allErrors=[];

async function check(name,fn){
  try{await fn();results.push([true,name]);}
  catch(e){results.push([false,name+' — '+String(e&&e.message||e).split('\n')[0]]);}
}
function eq(actual,expected,msg){
  if(actual!==expected) throw new Error(msg+' (várt: '+expected+', kapott: '+actual+')');
}
function ok(cond,msg){ if(!cond) throw new Error(msg); }

async function fresh(browser,width,height){
  const ctx=await browser.newContext({viewport:{width:width||1280,height:height||850}});
  await ctx.route(/^https?:/,r=>r.abort());          /* külső betűtípus tiltása: hermetikus futás */
  const page=await ctx.newPage();
  page.on('pageerror',e=>allErrors.push(e.message));
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>goTo('map'));
  return {ctx,page};
}
async function withPage(browser,fn,w,h){
  const {ctx,page}=await fresh(browser,w,h);
  try{await fn(page);}finally{await ctx.close();}
}
const overlayActive=page=>page.evaluate(()=>document.getElementById('overlay').classList.contains('active'));
const errorsOf=page=>page.evaluate(()=>state.errors);

(async()=>{
  const browser=await chromium.launch();

  /* ---------- egyszeri végrehajtás ---------- */
  await check('Buda: dupla kattintás a „Sorrend ellenőrzése” gombon egyetlen tekercset ad',()=>withPage(browser,async page=>{
    await page.evaluate(()=>{state.topoDone.buda=true;startStation('buda');phaseOrder=[0,1,2,3,4];renderPyramid(5);});
    await page.click('text=Sorrend ellenőrzése');
    await page.click('text=Sorrend ellenőrzése');
    await page.waitForTimeout(2000);
    eq(await page.locator('#panel-body .kscroll').count(),1,'tekercsblokkok száma');
    eq(await errorsOf(page),0,'hibák száma');
  }));

  await check('Buda: ugyanazon rossz sorrend ismételt ellenőrzése nem növeli újra a hibaszámot',()=>withPage(browser,async page=>{
    await page.evaluate(()=>{state.topoDone.buda=true;startStation('buda');phaseOrder=[1,0,2,3,4];renderPyramid(0);});
    for(let i=0;i<3;i++) await page.click('text=Sorrend ellenőrzése');
    eq(await errorsOf(page),1,'hibák három azonos ellenőrzés után');
    await page.evaluate(()=>movePhase(3,1));
    await page.click('text=Sorrend ellenőrzése');
    eq(await errorsOf(page),2,'hibák új rossz sorrend után');
  }));

  await check('Feleletválasztó: a hibás opció letiltódik, ismételt kattintás nem számol újabb hibát',()=>withPage(browser,async page=>{
    await page.evaluate(()=>{state.topoDone.muhi=true;startStation('muhi');});
    const wrong=page.locator('#panel-body .opt[data-ok="0"]').first();
    await wrong.click();
    ok(await wrong.isDisabled(),'a hibás opció letiltva');
    eq(await errorsOf(page),1,'hibák');
    await wrong.dispatchEvent('click');
    eq(await errorsOf(page),1,'hibák ismételt kattintás után');
  }));

  /* ---------- panelzárás: térkép, időzítők ---------- */
  await check('Térkép: a teljesítés ✕-szel való bezárás után is látszik a jelölőn',()=>withPage(browser,async page=>{
    await page.evaluate(()=>{state.topoDone.esztergom=true;openPanel('t','t','<p>x</p>');finishLocation('esztergom');});
    await page.click('.panel-close');
    ok(await page.evaluate(()=>document.querySelector('#markers [data-loc="esztergom"]').classList.contains('done')),'done osztály');
  }));

  await check('Elavult időzítő: ✕ után a következő panel nem nyílik újra',()=>withPage(browser,async page=>{
    await page.evaluate(()=>{state.topoDone.muhi=true;startStation('muhi');});
    await page.click('#panel-body .opt[data-ok="1"]');
    await page.click('.panel-close');
    await page.waitForTimeout(3000);
    ok(!(await overlayActive(page)),'a panel zárva maradt');
  }));

  await check('Az utolsó helyes válasz után ✕-szel zárva az állomás mégis teljesül',()=>withPage(browser,async page=>{
    await page.evaluate(()=>{state.topoDone.muhi=true;renderCastleWhy();});
    await page.click('#panel-body .opt[data-ok="1"]');
    await page.click('.panel-close');
    ok(await page.evaluate(()=>state.completed.muhi&&state.glyphsWon.includes('R')&&state.scrolls.includes('muhi')),'teljesítve');
    ok(await page.evaluate(()=>document.querySelector('#markers [data-loc="muhi"]').classList.contains('done')),'jelölő frissítve');
  }));

  /* ---------- párbeszédablak ---------- */
  await check('Párbeszédablak: szerepkör, fókusz, inert háttér, Esc, fókusz visszaadása',()=>withPage(browser,async page=>{
    ok(await page.locator('#panel[role="dialog"][aria-modal="true"][aria-labelledby="panel-title"]').count()===1,'dialog szerepkör');
    await page.focus('#markers [data-loc="esztergom"]');
    await page.keyboard.press('Enter');
    ok(await overlayActive(page),'a panel megnyílt');
    eq(await page.evaluate(()=>document.activeElement.id),'panel','fókusz a panelen');
    ok(await page.evaluate(()=>document.getElementById('app').inert===true),'háttér inert');
    await page.keyboard.press('Escape');
    ok(!(await overlayActive(page)),'Esc bezárja');
    ok(await page.evaluate(()=>document.getElementById('app').inert===false),'háttér újra aktív');
    eq(await page.evaluate(()=>document.activeElement.dataset.loc),'esztergom','fókusz a jelölőre tért vissza');
  }));

  /* ---------- billentyűzet ---------- */
  await check('Év-kerék: billentyűzettel teljesíthető, a hibás szelet egyszer számít',()=>withPage(browser,async page=>{
    await page.evaluate(()=>{state.topoDone.esztergom=true;startStation('esztergom');});
    const keys=await page.evaluate(()=>({right:wheelTarget.key,wrong:['geza','koronazas','istvanhal'].find(k=>k!==wheelTarget.key)}));
    await page.focus('#seg-'+keys.wrong);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    eq(await errorsOf(page),1,'hibák kétszeri Enter után');
    await page.focus('#seg-'+keys.right);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2600);
    eq(await page.locator('#panel-title').innerText(),'Az államszervezés fogalmai','a következő lépés megnyílt');
    eq(await errorsOf(page),1,'hibák a végén');
  }));

  await check('Várhelyválasztás: billentyűzettel teljesíthető, a hibás pont egyszer számít, nincs dupla átmenet',()=>withPage(browser,async page=>{
    await page.evaluate(()=>{state.topoDone.muhi=true;renderCastleDecision();});
    await page.focus('#spot-a');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    eq(await errorsOf(page),1,'hibák');
    await page.focus('#spot-b');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await page.waitForTimeout(2800);
    eq(await page.locator('#panel-title').innerText(),'Miért működött a kővár?','a következő lépés megnyílt');
    eq(await errorsOf(page),1,'hibák a végén');
  }));

  /* ---------- hozzáférhetőség, érintési felület ---------- */
  await check('Térképjelölő: a teljesítés a feliratban szerepel, zárolt állapot jelezve',()=>withPage(browser,async page=>{
    await page.evaluate(()=>{state.topoDone.esztergom=true;state.completed.esztergom=true;renderMap();});
    const labels=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('#markers .marker')].map(m=>[m.dataset.loc,m.getAttribute('aria-label')])));
    ok(/teljesítve/.test(labels.esztergom),'teljesített jelölő felirata: '+labels.esztergom);
    ok(/zárolva/.test(labels.mohacs),'zárolt jelölő felirata: '+labels.mohacs);
  }));

  for(const w of [360,768,1280]){
    await check('Térkép '+w+' px: nincs vízszintes túlcsordulás, a jelölő érintési felülete elég nagy',()=>withPage(browser,async page=>{
      ok(!(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)),'vízszintes túlcsordulás');
      const box=await page.evaluate(()=>{const r=document.querySelector('#markers [data-loc="esztergom"] circle').getBoundingClientRect();return Math.round(r.width);});
      ok(box>=(w===360?28:36),'a találati felület csak '+box+' px');
      await page.evaluate(()=>{state.topoDone.esztergom=true;startStation('esztergom');});
      ok(!(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)),'túlcsordulás nyitott panelnél');
    },w,w===360?740:850));
  }

  /* ---------- zsákutca a záró próbához, újraindítás ---------- */
  await check('Záró próba: az utolsó állomás ✕-szel való bezárása után a térképről indítható',()=>withPage(browser,async page=>{
    await page.evaluate(()=>{
      ['esztergom','aranybulla','muhi','visegrad','buda'].forEach(k=>{state.topoDone[k]=true;state.completed[k]=true;});
      state.topoDone.mohacs=true;openPanel('t','t','<p>x</p>');finishLocation('mohacs');
    });
    await page.click('.panel-close');
    eq(await page.locator('#mapCta .btn').count(),1,'záró próba gomb a térképen');
    await page.click('#mapCta .btn');
    ok(/1\. kérdés/.test(await page.locator('#panel-title').innerText()),'a próba elindult');
    await page.click('#panel-body .opt[data-ok="0"]');
    eq(await errorsOf(page),1,'hiba a próbában');
    await page.click('.panel-close');
    await page.click('#mapCta .btn');
    eq(await errorsOf(page),0,'a megszakított próba hibái nem duplázódnak');
  }));

  await check('Teljes végigjátszás (gyorsítva): befejező képernyő, fókusz, újraindítás',()=>withPage(browser,async page=>{
    await page.evaluate(()=>{
      ['esztergom','aranybulla','muhi','visegrad','buda'].forEach(k=>{state.topoDone[k]=true;state.completed[k]=true;});
      state.topoDone.mohacs=true;openPanel('t','t','<p>x</p>');finishLocation('mohacs');startReview();
    });
    for(let i=0;i<8;i++){
      await page.click('#panel-body .opt[data-ok="1"]');
      await page.click('#panel-actions .btn');
    }
    ok(await page.evaluate(()=>document.getElementById('screen-ending').classList.contains('active')),'befejező képernyő');
    ok(await page.evaluate(()=>!!document.activeElement.closest('#screen-ending')),'a fókusz a befejező képernyőn van');
    await page.click('text=Új nyomozás indítása');
    ok(await page.evaluate(()=>!!document.activeElement.closest('#screen-cover')),'a fókusz a borítón van');
    eq(await page.evaluate(()=>JSON.stringify({e:state.errors,g:state.glyphsWon.length,s:state.scrolls.length,c:Object.values(state.completed).some(Boolean)})),
       '{"e":0,"g":0,"s":0,"c":false}','az állapot nullázva');
  }));

  await check('Újraindítás: a függő időzítők nem szivárognak át az új játékba',()=>withPage(browser,async page=>{
    await page.evaluate(()=>{state.topoDone.muhi=true;startStation('muhi');});
    await page.click('#panel-body .opt[data-ok="1"]');
    await page.evaluate(()=>{closePanel();restartGame();});
    await page.waitForTimeout(3000);
    ok(!(await overlayActive(page)),'nem nyílt meg panel');
  }));

  await check('Nincs JavaScript-hiba a vizsgált folyamatokban',async()=>{
    eq(allErrors.length,0,'hibák: '+allErrors.join(' | '));
  });

  await browser.close();
  let failed=0;
  for(const [pass,name] of results){ console.log((pass?'PASS  ':'FAIL  ')+name); if(!pass) failed++; }
  console.log('\n'+(results.length-failed)+'/'+results.length+' ellenőrzés sikeres');
  process.exit(failed?1:0);
})();

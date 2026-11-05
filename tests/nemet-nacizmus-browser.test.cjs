// External QA only. Use an externally installed Playwright via NODE_PATH.
// Covers games/nemet-nacizmus.html (practice) and demos/bemutato_nemet_nacizmus.html (presentation).
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream');
 res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port;
 const opts={headless:true};if(process.env.QA_BROWSER)opts.channel=process.env.QA_BROWSER;
 const browser=await chromium.launch(opts);
 try{
  /* ---- gyakorló játék ---- */
  const G=url+'/games/nemet-nacizmus.html';
  for(const width of [360,768,1280]){
   const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   const errors=[],failed=[];
   p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
   p.on('requestfailed',r=>failed.push(r.url()));
   for(const r of ['attekintes','idovonal','fogalmak','csoportositas','forrasok','kviz','kifejtes']){
    await p.goto(G+'#'+r);await p.reload();
    assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow '+r+' @'+width);
   }
   /* kvíz: egy válasz = egy pont, dupla kattintás/Enter nem pontoz kétszer */
   await p.goto(G+'#kviz');await p.reload();
   await p.click('button[data-n="10"]');
   for(let i=0;i<10;i++){
    await p.locator('.opt').first().click();
    assert(await p.locator('#nx').evaluate(e=>e===document.activeElement),'focus on next button');
    /* ismételt aktiválás (programozott kattintás): a „megválaszolt” védelem nem engedi újra pontozni */
    await p.evaluate(()=>document.querySelectorAll('.opt').forEach(o=>o.dispatchEvent(new MouseEvent('click',{bubbles:true}))));
    assert.equal(await p.locator('.opt.ok').count(),1,'exactly one correct marked (w='+width+', q='+i+')');
    assert(await p.locator('.opt:not(:disabled)').count()===0,'options locked after answer');
    await p.locator('#nx').focus();
    await p.keyboard.press('Enter');
   }
   const res=await p.textContent('#qq');
   const m=res.match(/Eredmény: (\d+) \/ 10/);assert(m,'result shown: '+res);
   const score=+m[1];assert(score>=0&&score<=10);
   /* újrakezdés többször: „Új kvíz”, majd nézetváltás és vissza; nincs duplikált kezelő */
   await p.click('#nw');
   for(let k=0;k<3;k++){
    await p.click('button[data-n="10"]');
    await p.locator('.opt').first().click();
    assert.equal(await p.locator('.opt:disabled').count(),await p.locator('.opt').count(),'locked after single answer');
    const wasRight=(await p.locator('.opt.no').count())===0;
    await p.click('#nx');
    assert.equal((await p.locator('.prog span').last().textContent()).trim(),'Pontszám: '+(wasRight?1:0),'score counted once');
    await p.click('a[href="#kifejtes"]');await p.click('a[href="#kviz"]');
   }
   /* idővonal: rendezés billentyűzettel */
   await p.goto(G+'#idovonal');await p.reload();
   const exp=['Sörpuccs','Az NSDAP a választásokon','Hindenburg kancellárrá','Felgyújtják','Választási győzelem','A „hosszú','A nürnbergi','Kristályéjszaka'];
   for(let k=0;k<60;k++){
    const order=await p.$$eval('#sl li span:nth-child(2)',els=>els.map(e=>e.textContent));
    const pos=exp.map(x=>order.findIndex(o=>o.startsWith(x)));const bad=pos.findIndex((v,i)=>v!==i);if(bad<0)break;
    await p.click(`#sl button[data-p="${pos[bad]}"][data-d="-1"]`);
   }
   await p.click('#chk');assert((await p.textContent('#sst')).startsWith('Hibátlan'),'sort solved');
   /* források: nézetváltás után sem fut kétszer a kezelő */
   await p.goto(G+'#forrasok');await p.reload();
   await p.click('details.dt summary');await p.click('button[data-m]');
   assert.equal(await p.$eval('[id^=m_]',e=>e.hidden),false);
   await p.click('a[href="#kifejtes"]');await p.click('a[href="#forrasok"]');
   await p.click('details.dt summary');await p.click('button[data-m]');
   assert.equal(await p.$eval('[id^=m_]',e=>e.hidden),false,'no duplicate listeners');
   assert.deepEqual(errors,[],'console errors @'+width);assert.deepEqual(failed,[],'failed requests');
   await p.close();
  }
  /* tiltott tárhely */
  {const c=await browser.newContext();await c.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})});
   const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.goto(G+'#kviz');await p.click('button[data-n="10"]');await p.locator('.opt').first().click();assert.deepEqual(errors,[],'storage blocked');await c.close();}
  /* Tab-sorrend: a fókusz látható és halad */
  {const p=await browser.newPage({viewport:{width:1280,height:900}});await p.goto(G+'#attekintes');
   const seen=new Set();for(let i=0;i<8;i++){await p.keyboard.press('Tab');seen.add(await p.evaluate(()=>document.activeElement.tagName+':'+(document.activeElement.textContent||'').slice(0,20)));}
   assert(seen.size>=6,'tab moves across controls');await p.close();}

  /* ---- bemutató ---- */
  const D=url+'/demos/bemutato_nemet_nacizmus.html';
  for(const [w,h] of [[360,740],[768,1024],[1280,720]]){
   const p=await browser.newPage({viewport:{width:w,height:h},reducedMotion:'reduce'});
   const errors=[],failed=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});p.on('requestfailed',r=>failed.push(r.url()));
   await p.goto(D);
   const n=await p.locator('.slide').count();assert.equal(n,17);
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'deck overflow @'+w);
   assert.equal((await p.textContent('#count')).trim(),'1 / 17');
   await p.keyboard.press('ArrowRight');await p.keyboard.press('Space');
   assert.equal((await p.textContent('#count')).trim(),'3 / 17');
   await p.keyboard.press('ArrowLeft');assert.equal((await p.textContent('#count')).trim(),'2 / 17');
   await p.keyboard.press('End');assert.equal((await p.textContent('#count')).trim(),'17 / 17');
   assert(await p.locator('#next').isDisabled());
   await p.keyboard.press('ArrowRight');assert.equal((await p.textContent('#count')).trim(),'17 / 17');
   await p.keyboard.press('Home');await p.keyboard.press('n');
   assert.equal(await p.getAttribute('#nt','aria-pressed'),'true');assert((await p.textContent('#notes')).length>40,'notes shown');
   for(let i=0;i<17;i++){assert(await p.locator('.slide.on').count()===1);await p.keyboard.press('ArrowRight');}
   /* a képek betöltődtek */
   assert(await p.evaluate(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)),'images decoded');
   assert.deepEqual(errors,[],'deck console @'+w);assert.deepEqual(failed,[]);
   await p.close();
  }
  console.log('nemet-nacizmus: OK');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});

// External QA only. Use an externally installed Playwright via NODE_PATH.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const output=process.env.QA_OUTPUT||path.join(root,'docs/qa');
const server=http.createServer((req,res)=>{
 let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',file.endsWith('.svg')?'image/svg+xml':file.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream');
 res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:process.env.QA_BROWSER||'chrome',headless:true});
 const results=[];
 try{
 fs.mkdirSync(output,{recursive:true});
 for(const width of [360,768,1280]){
  const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(url);await p.locator('#grid .card').first().waitFor();
  assert.equal(await p.locator('#grid .card').count(),9);
  assert.equal(await p.locator('#escapeGrid .card').count(),5);
  assert.equal(await p.locator('#demoGrid .card').count(),4);
  const artwork=p.locator('.card-visual img');
  assert.equal(await artwork.count(),18,'every catalog card has an illustration');
  const sources=await artwork.evaluateAll(es=>es.map(e=>e.getAttribute('src')));
  assert.equal(new Set(sources).size,18,'each card has its own thematic artwork');
  for(let i=0;i<18;i++){
   const image=artwork.nth(i);await image.scrollIntoViewIfNeeded();
   await image.evaluate(e=>e.decode());
   assert(await image.evaluate(e=>e.complete&&e.naturalWidth>0),'image decoded');
   assert.equal(await image.getAttribute('alt'),'','decorative image does not repeat the card title');
   assert(await image.evaluate(e=>Math.abs(e.getBoundingClientRect().top-e.closest('.card').getBoundingClientRect().top)<=2),'artwork aligned to card top');
   if(width===1280)await image.screenshot({path:path.join(output,`art-${i}.png`)});
  }
  for(const section of ['grid','escapeGrid','demoGrid'])await p.locator('#'+section).screenshot({path:path.join(output,`${section}-${width}.png`)});
  await p.evaluate(()=>scrollTo(0,0));
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
  await p.screenshot({path:path.join(output,`hub-${width}.png`),fullPage:true});
  if(width<=800){
   await p.locator('#menuToggle').focus();await p.keyboard.press('Enter');
   assert.equal(await p.locator('#menuToggle').getAttribute('aria-expanded'),'true');
   await p.keyboard.press('Tab');await p.keyboard.press('Escape');
   assert(await p.locator('#menuToggle').evaluate(e=>e===document.activeElement));
   await p.locator('#menuToggle').click();
  }
  await p.locator('#siteNav a[href="#escapesSection"]').click();
  assert.equal(new URL(p.url()).hash,'#escapesSection');
  if(width<=800)assert.equal(await p.locator('#menuToggle').getAttribute('aria-expanded'),'false');
  await p.getByRole('button',{name:'Földrajz',exact:true}).click();
  assert.equal(await p.locator('#grid .card').count(),0);
  assert.equal(await p.locator('#demoGrid .card').count(),1);
  assert.equal(await p.getByRole('button',{name:'Földrajz',exact:true}).getAttribute('aria-pressed'),'true');
  assert(await p.getByRole('button',{name:'Földrajz',exact:true}).evaluate(e=>e===document.activeElement));
  await p.getByRole('button',{name:'Minden tantárgy',exact:true}).click();
  await p.locator('#fGrade button').filter({hasText:'12.'}).click();
  await p.getByRole('button',{name:'Stratégia',exact:true}).click();
  assert.equal(await p.locator('#grid .card').count(),0);
  await p.locator('#fGrade button').first().click();
  assert.equal(await p.locator('#grid .card').count(),1);
  await p.locator('#fType button').first().click();
  for(const selector of ['.feature-card:first-child','.feature-card:nth-child(2)','#grid .card:first-child','#demoGrid .card:nth-child(2)']){
   const trigger=p.locator(selector);await trigger.focus();await p.keyboard.press('Enter');
   await p.waitForFunction(()=>document.querySelector('#pframe').contentDocument?.readyState==='complete'&&document.querySelector('#pframe').contentWindow.location.href!=='about:blank');
   assert(await p.locator('#player').isVisible());
   assert(await p.locator('#hub').evaluate(e=>e.inert));
   assert(await p.evaluate(()=>['pback','pframe'].includes(document.activeElement.id)),'focus stays in player (game may autofocus)');
   const popupPromise=p.waitForEvent('popup');await p.getByRole('button',{name:'Megnyitás külön lapon',exact:true}).click();
   const popup=await popupPromise;await popup.waitForLoadState('domcontentloaded');
   assert.equal(new URL(popup.url()).pathname,await p.locator('#pframe').getAttribute('src').then(x=>'/'+x));await popup.close();
   await p.locator('#pback').click();
   assert(await trigger.evaluate(e=>e===document.activeElement));
   assert.equal(await p.locator('#pframe').getAttribute('src'),'about:blank');
  }
  await p.locator('.feature-card').first().click();
  await p.waitForFunction(()=>document.querySelector('#pframe').contentDocument?.body?.textContent.includes('Róm'));
  await p.locator('#pback').focus();
  await p.keyboard.press('Escape');assert(!(await p.locator('#player').isVisible()));
  const links=await p.locator('#escapeGrid a').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
  for(const href of links){const response=await p.request.get(url+'/'+href.split('#')[0]);assert.equal(response.status(),200,href);}
  for(const asset of ['assets/hub-roma.svg','assets/hub-korona.svg'])assert.equal((await p.request.get(url+'/'+asset)).status(),200);
  assert.deepEqual(errors,[]);
  results.push({width,status:'PASS',checks:'layout, 18 unique decoded decorative card illustrations aligned to card tops, navigation, keyboard, filters, empty state, featured/game/demo iframe, return focus, new tab, player Escape, escape/teacher/download links, SVG, no JS errors'});
  await p.close();
 }
 fs.writeFileSync(path.join(output,'hub-browser-results.json'),JSON.stringify({browser:browser.version(),time:new Date().toISOString(),source_sha256:require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root,'index.html'))).digest('hex'),results},null,2));
 console.log(JSON.stringify(results));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});

'use strict';
// External QA tooling only; the static site has no added runtime dependency.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const crypto=require('node:crypto'),cp=require('node:child_process');
const assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const output=process.env.QA_OUTPUT||path.join(root,'docs/qa/cinematic-evidence');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/qa/cinematic-images-manifest.json')));
const sha256=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const git=(...args)=>cp.execFileSync('git',['-C',root,...args],{encoding:'utf8'}).trim();
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(match[1]);
const assets=Object.entries(manifest).map(([key,entry])=>{
 const bytes=fs.readFileSync(path.join(root,entry.file));
 assert.equal(bytes.length,entry.size_bytes,entry.file+' size');
 assert.equal(sha256(bytes),entry.sha256,entry.file+' SHA-256');
 return {key,...entry};
});
assert.equal(assets.length,10);
const svgFiles=fs.readdirSync(path.join(root,'assets')).filter(x=>x.endsWith('.svg'));
assert.equal(svgFiles.length,18);
const svgIntegrity=svgFiles.map(file=>{
 const p='assets/'+file;
 const baseline=cp.execFileSync('git',['-C',root,'show','HEAD:'+p]);
 const current=fs.readFileSync(path.join(root,p));
 assert.deepEqual(current,baseline,p+' preserved');
 return {file:p,sha256:sha256(current)};
});
fs.mkdirSync(output,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
const server=http.createServer((req,res)=>{
 const urlPath=decodeURIComponent(req.url.split('?')[0]);
 let file=path.resolve(root,'.'+urlPath);
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);return res.end();}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){res.writeHead(404);return res.end('Not found');}
 const bytes=fs.readFileSync(file);
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':bytes.length,'Cache-Control':'public, max-age=3600'});
 res.end(bytes);
});
let browser,base;
// This managed runner exposes outbound internet through its environment proxy.
// Chromium does not automatically inherit Node/Python HTTP proxy settings.
const proxyUrl=process.env.HTTPS_PROXY||process.env.https_proxy;
const proxy=proxyUrl?(()=>{const u=new URL(proxyUrl);return {server:u.protocol+'//'+u.host,bypass:'127.0.0.1,localhost',...(u.username?{username:decodeURIComponent(u.username),password:decodeURIComponent(u.password)}:{})};})():undefined;
const results=[];
const report={time_utc:new Date().toISOString(),base_commit:git('rev-parse','HEAD'),index_sha256:sha256(source),test_sha256:sha256(fs.readFileSync(__filename)),assets,asset_bytes:assets.reduce((n,x)=>n+x.size_bytes,0),svg_integrity:svgIntegrity,results};
function writeReport(){fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2)+'\n');}
async function noOverflow(page){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'hub horizontal overflow');}
async function loadedFrame(page){
 await page.waitForFunction(()=>{
  const f=document.getElementById('pframe');
  return f.contentDocument?.readyState==='complete'&&f.contentWindow.location.href!=='about:blank';
 });
 const frame=page.frames().find(f=>f!==page.mainFrame());
 assert(frame,'content iframe');
 assert((await frame.locator('body').innerText()).trim().length>80,'rendered content, not an empty shell');
 return frame;
}
async function featuredStart(frame,kind){
 if(kind==='roma'){
  await frame.locator('.imperial-enter').click();
  await frame.locator('#imperialSplash').waitFor({state:'hidden'});
  assert.equal(await frame.locator('#choices button').count(),3);
  assert((await frame.locator('#decisionTitle').innerText()).length>0);
  await frame.locator('#resetBtn').click();
  await frame.locator('#imperialSplash').waitFor({state:'visible'});
 }else{
  await frame.getByRole('button',{name:/A nyomozás kezdete/}).click();
  await frame.locator('#screen-map.active').waitFor({state:'visible'});
  assert.equal(await frame.locator('#hud').isVisible(),true);
 }
}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,...(process.env.QA_EXECUTABLE_PATH?{executablePath:process.env.QA_EXECUTABLE_PATH}:{}),...(proxy?{proxy}:{}),args:['--enable-unsafe-swiftshader']});
 report.browser='Chromium '+browser.version();report.mode='headless; software WebGL; fresh context for each width';report.environment_proxy=!!proxy;
 for(const width of [360,768,1280]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',ignoreHTTPSErrors:true});
  const page=await context.newPage();page.setDefaultTimeout(20000);
  const jsErrors=[],consoleErrors=[],failedRequests=[],cancelledRequests=[],httpErrors=[];
  page.on('pageerror',e=>jsErrors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push({text:m.text(),url:m.location().url});});
  page.on('requestfailed',r=>{const entry={url:r.url(),error:r.failure()?.errorText};(entry.error==='net::ERR_ABORTED'?cancelledRequests:failedRequests).push(entry);});
  page.on('response',r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()});});
  const row={width,height:900,status:'PASS',js_errors:jsErrors,console_errors:consoleErrors,failed_requests:failedRequests,navigation_cancelled_requests:cancelledRequests,http_errors:httpErrors,launches:[]};results.push(row);
  try{
   await page.goto(base,{waitUntil:'networkidle'});
   assert.equal(await page.locator('#grid .card').count(),9);
   assert.equal(await page.locator('#escapeGrid .card').count(),5);
   assert.equal(await page.locator('#demoGrid .card').count(),4);
   assert.equal(await page.locator('.feature-card').count(),2);
   const images=page.locator('.card-visual img');assert.equal(await images.count(),18);
   row.cards=[];
   for(let i=0;i<18;i++){
    const img=images.nth(i);await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());
    const info=await img.evaluate(e=>({src:e.getAttribute('src'),title:e.closest('.card').querySelector('h3').textContent,width:e.naturalWidth,height:e.naturalHeight,alt:e.alt,top_delta:Math.abs(e.getBoundingClientRect().top-e.closest('.card').getBoundingClientRect().top)}));
    assert(info.width>0&&info.height>0);assert.equal(info.alt,'');assert(info.top_delta<=2);
    row.cards.push(info);
   }
   assert.equal(new Set(row.cards.map(c=>c.src)).size,18);
   assert.equal(row.cards.filter(c=>c.src.endsWith('.webp')).length,10);
   assert.equal(row.cards.filter(c=>c.src.endsWith('.svg')).length,8);
   row.assets_http=[];
   for(const asset of assets){
    const response=await page.request.get(base+'/'+asset.file);assert.equal(response.status(),200);
    const bytes=await response.body();assert.equal(sha256(bytes),asset.sha256);
    assert.equal(response.headers()['content-type'],'image/webp');
    row.assets_http.push({file:asset.file,status:response.status(),bytes:bytes.length,sha256:sha256(bytes)});
   }
   row.backgrounds=await page.locator('.hero,.feature-art').evaluateAll(es=>es.map(e=>({class:e.className,image:getComputedStyle(e).backgroundImage})));
   assert(row.backgrounds[0].image.includes('hub-roma.webp'));
   assert(row.backgrounds[1].image.includes('hub-roma.webp'));
   assert(row.backgrounds[2].image.includes('hub-korona.webp'));
   await noOverflow(page);
   row.performance=await page.evaluate(()=>({navigation:performance.getEntriesByType('navigation').map(n=>({dom_content_loaded_ms:n.domContentLoadedEventEnd,load_ms:n.loadEventEnd})),images:performance.getEntriesByType('resource').filter(r=>/\/assets\/hub-/.test(r.name)).map(r=>({file:new URL(r.name).pathname.slice(1),duration_ms:r.duration,transfer_bytes:r.transferSize,encoded_bytes:r.encodedBodySize,initiator:r.initiatorType}))}));
   await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:path.join(output,'hub-'+width+'.jpg'),type:'jpeg',quality:80,fullPage:true});
   for(const selector of ['.featured','#grid','#escapeGrid','#demoGrid']){
    await page.locator(selector).screenshot({path:path.join(output,selector.replace(/[.#]/g,'')+'-'+width+'.jpg'),type:'jpeg',quality:80});
   }
   if(width<=800){
    await page.locator('#menuToggle').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Tab');await page.keyboard.press('Escape');
    assert(await page.locator('#menuToggle').evaluate(e=>e===document.activeElement));
    await page.locator('#menuToggle').click();
   }
   await page.locator('#siteNav a[href="#escapesSection"]').click();assert.equal(new URL(page.url()).hash,'#escapesSection');
   if(width<=800)assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'false');
   await page.getByRole('button',{name:'Földrajz',exact:true}).click();
   assert.equal(await page.locator('#grid .card').count(),0);assert.equal(await page.locator('#demoGrid .card').count(),1);
   assert.equal(await page.getByRole('button',{name:'Földrajz',exact:true}).getAttribute('aria-pressed'),'true');
   assert(await page.getByRole('button',{name:'Földrajz',exact:true}).evaluate(e=>e===document.activeElement));
   await page.getByRole('button',{name:'Minden tantárgy',exact:true}).click();
   await page.locator('#fGrade button').filter({hasText:'12.'}).click();await page.getByRole('button',{name:'Stratégia',exact:true}).click();
   assert.equal(await page.locator('#grid .card').count(),0);assert(await page.locator('#empty').isVisible());
   await page.locator('#fGrade button').first().click();assert.equal(await page.locator('#grid .card').count(),1);
   await page.locator('#fType button').first().click();row.filters_navigation_keyboard='PASS';
   for(const group of ['.feature-card','#grid .card','#demoGrid .card']){
    const count=await page.locator(group).count();
    for(let i=0;i<count;i++){
     const trigger=page.locator(group).nth(i);const title=await trigger.innerText();
     await trigger.focus();await page.keyboard.press(i%2?'Space':'Enter');
     const frame=await loadedFrame(page);const target=new URL(frame.url()).pathname;
     assert(await page.locator('#player').isVisible());assert(await page.locator('#hub').evaluate(e=>e.inert));
     if(group==='.feature-card'){
      await featuredStart(frame,i===0?'roma':'korona');
      const popupPromise=page.waitForEvent('popup');await page.getByRole('button',{name:'Megnyitás külön lapon',exact:true}).click();
      const popup=await popupPromise;await popup.waitForLoadState('load');assert.equal(new URL(popup.url()).pathname,target);await popup.close();
     }
     await page.locator('#pback').focus();await page.keyboard.press('Escape');
     assert(!(await page.locator('#player').isVisible()));assert(await trigger.evaluate(e=>e===document.activeElement));
     assert.equal(await page.locator('#pframe').getAttribute('src'),'about:blank');
     row.launches.push({type:group==='.feature-card'?'featured':'catalog',title:title.split('\n').slice(0,2).join(' '),target,status:'PASS',return_focus:true});
    }
   }
   const downloads=await page.locator('#escapeGrid a[download]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
   for(const href of downloads)assert.equal((await page.request.get(base+'/'+href)).status(),200);
   for(let i=0;i<5;i++){
    const trigger=page.locator('#escapeGrid .btn-start').nth(i),href=await trigger.getAttribute('href');
    await trigger.click();await page.waitForURL(base+'/'+href);await page.waitForLoadState('load');
    await page.locator('#goFull').waitFor({state:'visible'});
    const canvas=page.locator('canvas').first();assert(await canvas.isVisible());
    assert(await canvas.evaluate(e=>e.width>0&&e.height>0));
    await page.locator('#goFull').click();await page.locator('#modal').waitFor({state:'hidden'});
    // Next station turns the camera; it does not open a puzzle in full mode.
    // An active-game hint verifies a real started game without changing answers.
    await page.locator('#nextBtn').click();await page.locator('#hintBtn').click();await page.locator('#modal').waitFor({state:'visible'});
    assert((await page.locator('#mbox').innerText()).length>40);
    row.launches.push({type:'3d',target:'/'+href,status:'PASS',canvas:true,full_game_start:true,active_game_hint:true});
    await page.goBack();await page.locator('#escapeGrid .card').first().waitFor();
   }
   assert.equal(row.launches.length,20);await noOverflow(page);
   assert.deepEqual(jsErrors,[],'JavaScript errors');
   assert.deepEqual(consoleErrors,[],'console errors');
   assert.deepEqual(failedRequests,[],'failed requests');assert.deepEqual(httpErrors,[],'HTTP errors');
   row.broken_images=0;row.svg_preserved=18;
  }catch(e){row.status='FAIL';row.error=e.stack;}
  writeReport();console.log(width,row.status,row.error?.split('\n')[0]||'',JSON.stringify({js:jsErrors,console:consoleErrors,failed:failedRequests,http:httpErrors,launches:row.launches.length}));
  await context.close();
  if(row.status==='FAIL')break;
 }
 report.status=results.length===3&&results.every(r=>r.status==='PASS')?'PASS':'FAIL';writeReport();
 if(report.status!=='PASS')process.exitCode=1;
})().catch(e=>{report.status='FAIL';report.error=e.stack;writeReport();console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});

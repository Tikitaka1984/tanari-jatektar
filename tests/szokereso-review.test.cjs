'use strict';
// Independent M05 review: actual browser controls, read-only access to puzzle answers.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'games/szokereso.html'),'utf8');
const baseline=process.env.BASELINE_ROOT||root;
const report=process.env.REPORT_PATH||path.join(root,'docs/qa/szokereso-review-results.json');
const results=[];let browser,server,url;
let checks=0;
function check(ok,message){assert.ok(ok,message);checks++;}
async function run(name,width,mode,fn){checks=0;const r={name,width,mode,status:'PASS'};try{r.detail=await fn();}catch(e){r.status='FAIL';r.error=e.stack;}r.checks=checks;results.push(r);console.log(name,width,mode,r.status);fs.mkdirSync(path.dirname(report),{recursive:true});fs.writeFileSync(report,JSON.stringify({tested_commit:cp.execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),source_sha256:crypto.createHash('sha256').update(source).digest('hex'),browser:browser.version(),time_utc:new Date().toISOString(),results},null,2)+'\n');}
async function pageFor(width,mode,old=false){
 const p=await browser.newPage({viewport:{width,height:900}});p.failures=[];
 p.on('pageerror',e=>p.failures.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts\.(googleapis|gstatic)\.com/.test(m.location().url||''))p.failures.push(m.text());});
 await p.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
 await p.addInitScript(()=>{Date.now=()=>1791741600000;});
 await p.goto(url+(old?'/baseline':'')+'/games/szokereso.html');
 if(mode==='hard'){await p.locator('#modeSeg button').nth(1).focus();await p.keyboard.press('Enter');}
 await p.locator('#codeInput').fill('9AR-4821');await p.locator('#codeInput').press('Enter');
 return p;
}
async function navigate(p,r,c){await p.keyboard.press('Control+Home');for(let i=0;i<r;i++)await p.keyboard.press('ArrowDown');for(let i=0;i<c;i++)await p.keyboard.press('ArrowRight');}
async function select(p,a,b,mouse=false){if(mouse){await p.locator('#k'+a.join('-')).click();await p.locator('#k'+b.join('-')).click();}else{await navigate(p,...a);await p.keyboard.press('Space');const dr=b[0]-a[0],dc=b[1]-a[1];for(let i=0;i<Math.abs(dr);i++)await p.keyboard.press(dr>0?'ArrowDown':'ArrowUp');for(let i=0;i<Math.abs(dc);i++)await p.keyboard.press(dc>0?'ArrowRight':'ArrowLeft');await p.keyboard.press('Enter');}}
async function snapshot(p){return p.evaluate(()=>({hit:S.hit,err:S.err,hint:S.hint,run:S.run,best:S.best,done:S.done,seconds:secs(),code:S.code}));}
async function navigation(width,mode){const p=await pageFor(width,mode);try{
 check(await p.locator('#grid > [role="row"]').count()===16,'16 owned rows');check(await p.locator('#grid [role="gridcell"]').count()===256,'256 owned cells');
 check(await p.evaluate(()=>[...document.querySelectorAll('#grid [role="row"]')].every((r,i)=>r.children.length===16&&r.getAttribute('aria-rowindex')===String(i+1))),'row structure');
 check(await p.locator('#grid [tabindex="0"]').count()===1,'single Tab stop');
 for(const [key,id] of [['ArrowLeft','k0-0'],['ArrowUp','k0-0'],['ArrowDown','k1-0'],['End','k1-15'],['Home','k1-0'],['Control+End','k15-15'],['ArrowRight','k15-15'],['ArrowDown','k15-15'],['Control+Home','k0-0']]){await p.keyboard.press(key);check(await p.evaluate(()=>document.activeElement.id)===id,key);}
 // Visit every cell with real arrow presses, including reversed row traversal.
 for(let r=0;r<16;r++){for(let i=0;i<16;i++){const c=r%2?15-i:i;check(await p.evaluate(()=>document.activeElement.id)===`k${r}-${c}`,'reachable '+r+','+c);if(i<15)await p.keyboard.press(r%2?'ArrowLeft':'ArrowRight');}if(r<15)await p.keyboard.press('ArrowDown');}
 await p.keyboard.press('Tab');check(await p.evaluate(()=>document.activeElement.textContent.includes('Segítség')),'Tab leaves grid');await p.keyboard.press('Shift+Tab');check(await p.evaluate(()=>document.activeElement.closest('#grid')!==null),'Shift+Tab returns');
 check(await p.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle==='solid'),'visible focus');
 const aria=await p.locator('#grid').ariaSnapshot();check(aria.includes('row')&&aria.includes('gridcell'),'Chromium accessibility tree');
 const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);check(!overflow,'no document overflow');check(p.failures.length===0,p.failures.join(';'));
 return {all_cells_visited:256,document_overflow:overflow,aria_rows:16};
 }finally{await p.close();}}
async function gameplay(width,mode){const p=await pageFor(width,mode);try{
 check((await p.locator('#words .nm').count())===(mode==='hard'?0:10),'difficulty presentation');
 const words=await p.evaluate(()=>S.place.map(x=>({a:x.cells[0],b:x.cells.at(-1),label:x.it.label})));
 await p.keyboard.press('Enter');check(await p.locator('#grid [aria-selected="true"]').count()===1,'selected anchor');await p.keyboard.press('Escape');check(await p.evaluate(()=>S.anchor===null&&S.err===0),'Escape is free');
 await select(p,[0,0],[1,2]);check(await p.evaluate(()=>S.err===0&&S.anchor===null),'nonlinear selection is free');
 await select(p,[0,0],[0,1]);check(await p.evaluate(()=>S.err===1&&S.run===0),'invalid two-letter segment counted once');
 await p.keyboard.press('Tab');await p.keyboard.press('Enter');check(await p.evaluate(()=>S.hint===1&&secs()===20),'hint penalty 20 seconds');check((await p.locator('#gridStatus').textContent()).includes('Segítség'),'hint status');await p.keyboard.press('Shift+Tab');
 for(const w of words)await select(p,w.a,w.b);
 const final=await snapshot(p);check(final.done&&final.hit===words.length&&final.err===1&&final.hint===1,'complete score');check(await p.evaluate(()=>document.activeElement.matches('#sc-result h2')),'result focus');
 await p.keyboard.press('Enter');await p.keyboard.press('Space');check(JSON.stringify(await snapshot(p))===JSON.stringify(final),'no second evaluation on result title');
 await p.keyboard.press('Tab');check(await p.evaluate(()=>document.activeElement.matches('#sc-result .cta')),'result Tab order');await p.keyboard.press('Enter');
 check(await p.evaluate(()=>S.hit===0&&S.err===0&&S.hint===0&&S.anchor===null&&!S.done&&S.run===0&&S.best===0&&secs()===0),'restart states and clock');check(await p.evaluate(()=>document.activeElement.id==='k0-0'),'restart focus');check(await p.locator('#grid [aria-selected="true"]').count()===0,'selection reset');
 await p.locator('#sc-game button[onclick="goStart()"]').focus();await p.keyboard.press('Enter');check(await p.evaluate(()=>!!document.activeElement.closest('#sc-start')),'settings focus after return');
 check(p.failures.length===0,p.failures.join(';'));return {score:final,keyboard_only_solution:true};
 }finally{await p.close();}}
async function settingsFocus(){const p=await browser.newPage();try{await p.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await p.goto(url+'/games/szokereso.html');for(const id of ['rail','topicSeg','modeSeg','lenSeg','varSeg','keySeg']){await p.locator('#'+id+' button').last().focus();await p.keyboard.press('Enter');check(await p.evaluate(id=>document.activeElement.parentElement?.id===id,id),'focus retained in '+id);}return {controls:6};}finally{await p.close();}}
async function repeat(){const p=await pageFor(360,'classic');try{await p.keyboard.down('Enter');await p.keyboard.down('Enter');check(await p.evaluate(()=>S.anchor?.r===0&&S.anchor?.c===0),'held Enter must not cancel its own anchor');await p.keyboard.up('Enter');await p.keyboard.press('Escape');await p.keyboard.down('Space');await p.keyboard.down('Space');check(await p.evaluate(()=>S.anchor!==null),'held Space must not cancel anchor');await p.keyboard.up('Space');return {autorepeat:'ignored for activation'};}finally{await p.close();}}
async function comparison(){const p=await pageFor(1280,'classic'),q=await pageFor(1280,'classic',true);try{
 const buildMatrix=()=>{const out=[];for(const g of [9,10,11,12])for(const t of ['A','B','V'])for(const n of [10,16])for(const s of [4821,37]){const z=makePuzzle(g,t,n,s);out.push({g,t,n,s,code:z.code,grid:z.grid,place:z.place});}return out;};
 const a=await p.evaluate(buildMatrix),b=await q.evaluate(buildMatrix);check(JSON.stringify(a)===JSON.stringify(b),'48 deterministic puzzles match main');
 // Restore through the code input; sampling checks only mutate the PRNG, not gameplay data.
 const words=await p.evaluate(()=>S.place.map(x=>({a:x.cells[0],b:x.cells.at(-1)})));
 for(const page of [p,q]){await select(page,[0,0],[0,1],true);await page.locator('#sc-game button[onclick="useHint()"]').click();for(const w of words)await select(page,w.a,w.b,true);}
 const current=await snapshot(p),old=await snapshot(q);check(JSON.stringify(current)===JSON.stringify(old),'mouse outcome and scoring match main');
 check(p.failures.length===0&&q.failures.length===0,'no comparison errors');return {generated_puzzles:a.length,mouse_score:current};
 }finally{await p.close();await q.close();}}
(async()=>{
 server=http.createServer((req,res)=>{try{const old=req.url.startsWith('/baseline/'),r=old?baseline:root,rel=req.url.split(/[?#]/)[0].replace(/^\/baseline/,'');const f=path.resolve(r,'.'+rel);if(!f.startsWith(r+path.sep))throw Error();res.setHeader('Content-Type',f.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));url='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 for(const width of [360,768,1280])for(const mode of ['classic','hard']){await run('grid-navigation',width,mode,()=>navigation(width,mode));await run('gameplay',width,mode,()=>gameplay(width,mode));}
 await run('settings-focus',1280,'both',settingsFocus);await run('held-activation',360,'both',repeat);await run('main-comparison',1280,'classic',comparison);
 console.log(JSON.stringify({total:results.length,pass:results.filter(x=>x.status==='PASS').length,fail:results.filter(x=>x.status==='FAIL').length,checks:results.reduce((n,x)=>n+x.checks,0)}));if(results.some(x=>x.status==='FAIL'))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.close();});

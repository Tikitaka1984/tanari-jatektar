'use strict';
// External Playwright QA; no test hooks or dependencies are added to the game.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const {createModel,play,baseline,source,hash,baselineRef,legacyRef} = require('./roma-9-model.test.cjs');
const root = path.resolve(__dirname,'..');
let browser,server,url,checks = 0;
const results = [];
const reportPath = process.env.REPORT_PATH || path.join(root,'docs/qa/roma-9-browser-results.json');
const testedCommit = process.env.TESTED_COMMIT || cp.execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
function check(ok,msg) {assert.ok(ok,msg);checks++;}
function eq(a,b,msg) {assert.deepStrictEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b)),msg);checks++;}
async function run(name,width,mode,fn) {
  if (process.env.TEST_FILTER && !new RegExp(process.env.TEST_FILTER).test(name)) return;
  checks=0;const result={name,width,mode,status:'PASS'};
  try {result.detail=await fn();} catch(e) {result.status='FAIL';result.error=e.stack;}
  result.checks=checks;results.push(result);console.log(name,width,mode,result.status);
  fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify({
    tested_commit:testedCommit,source_sha256:hash(source),test_sha256:hash(fs.readFileSync(__filename)),
    baseline_commit:baselineRef,baseline_source_sha256:hash(baseline),legacy_commit:legacyRef,
    browser:browser.version(),time_utc:new Date().toISOString(),results},null,2)+'\n');
}
async function pageFor(width,old=false,hub=false) {
  const p=await browser.newPage({viewport:{width,height:900},acceptDownloads:true});
  p.failures=[];p.on('pageerror',e=>p.failures.push(e.message));
  p.on('console',m=>{if(m.type()==='error'&&!/fonts\.(googleapis|gstatic)\.com/.test(m.location().url||''))p.failures.push(m.text());});
  await p.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
  await p.goto(url+(hub?'/index.html':old?'/baseline.html':'/games/iranyitsd-romat.html'));
  return p;
}
async function active(p) {return p.evaluate(()=>document.activeElement.id||document.activeElement.tagName);}
async function tabUntil(p,selector,reverse=false,max=65) {
  for(let i=0;i<max;i++) {
    if(await p.evaluate(s=>document.activeElement.matches(s),selector))return;
    await p.keyboard.press(reverse?'Shift+Tab':'Tab');
  }
  throw Error('Tab did not reach '+selector);
}
async function start(p,mode,keyboard=false) {
  if(keyboard) {
    check(await active(p)==='imperialTitle','opening title focus');
    await p.keyboard.press('Tab');
    check(await p.evaluate(()=>document.activeElement.matches('input[name=difficulty]:checked')),'native radio Tab stop');
    const selected=await p.locator('input[name=difficulty]:checked').inputValue();
    const modes=['easy','normal','hard'];
    for(let n=modes.indexOf(selected);n!==modes.indexOf(mode);n+=Math.sign(modes.indexOf(mode)-n)) {
      await p.keyboard.press(n<modes.indexOf(mode)?'ArrowRight':'ArrowLeft');
    }
    check(await p.locator('input[name=difficulty]:checked').inputValue()===mode,'native arrow selection');
    await p.keyboard.press('Tab');check(await p.evaluate(()=>document.activeElement.matches('.imperial-enter')),'radio to entry Tab');
    await p.keyboard.press('Enter');
  } else {
    await p.locator('input[value='+mode+']').check();await p.locator('.imperial-enter').click();
  }
  await p.locator('#imperialSplash').waitFor({state:'hidden'});
  if(keyboard)check(await active(p)==='decisionTitle','entry transfers focus to session');
}
async function snapshot(p) {return p.evaluate(()=>JSON.parse(JSON.stringify({state,regions,idx,chosen,ended,chosenOption,selected,pending,history,
  score:ended?Number(document.querySelector('#decisionText .score').textContent.match(/Átfogó állapot: (\d+)\/100/)[1]):null,
  title:ended?document.getElementById('decisionTitle').textContent:null})));}
async function keyboardDecision(p,opt,reason,key) {
  check(await active(p)==='decisionTitle','session title before decision');
  for(let n=0;n<4;n++)await p.keyboard.press('Tab');
  check(await active(p)==='reason','Tab reaches reason after three choices');
  await p.keyboard.type(reason);
  for(let n=0;n<3-opt;n++)await p.keyboard.press('Shift+Tab');
  check(await p.evaluate(i=>document.activeElement.dataset.index===String(i),opt),'Shift+Tab reaches intended decision');
  await p.keyboard.press(key);check(await active(p)==='nextBtn','decision transfers focus to next');
}
const sampleSequence=[1,0,0,1,0,0,1,1];
const reasonFor=i=>`QA ${i+1}. tanácsülés: árvíztűrő <Róma> & történelmi érvelés`;
async function readDownload(p,keyboard=false) {
  const waiting=p.waitForEvent('download');
  if(keyboard) {await tabUntil(p,'#saveBtn');await p.keyboard.press('Enter');}
  else await p.locator('#saveBtn').click();
  const file=await waiting;check(file.suggestedFilename()==='roma_birodalmi_jelentes.txt','original export filename');
  const bytes=fs.readFileSync(await file.path());
  const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
  return {text,bytes:bytes.length,sha256:hash(bytes)};
}
async function fullGame(width,mode) {
  const p=await pageFor(width);try {
    check(await p.locator('#imperialSplash').getAttribute('role')==='dialog','named opening dialog');
    const contrast=await p.locator('.difficulty-select legend').evaluate(el=>{
      const css=getComputedStyle(el),lum=color=>{const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
      const a=lum(css.color),b=lum(css.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    });
    check(contrast>=4.5,'new difficulty legend text contrast');

    check(await p.evaluate(()=>document.querySelector('main').inert&&document.querySelector('header').inert),'opening background inert');
    await start(p,mode,true);
    const model=createModel(source);model.reset(mode);eq(await snapshot(p),model.snapshot(),'initial resources and regions');
    check((await p.locator('#choices .difficulty-help').count())===(mode==='easy'?3:0),'easy numeric assistance');
    check((await p.locator('#choices small').count())===(mode==='hard'?0:mode==='easy'?6:3),'distinct help levels');
    check((await p.locator('#difficultyStatus').textContent()).includes(await p.evaluate(()=>profile().name)),'visible difficulty');
    await p.evaluate(()=>{const before=difficulty;setDifficulty('invalid');setDifficulty('__proto__');setDifficulty(before==='easy'?'hard':'easy');});
    check(await p.evaluate(()=>difficulty)===mode,'difficulty locked outside opening');
    // Traverse all SVG map controls with Tab and activate their native key handler.
    await tabUntil(p,'#pins .pin');
    for(let i=0;i<6;i++) {
      await p.keyboard.press(i%2?'Space':'Enter');
      const selected=await p.evaluate(()=>selected);check(await p.evaluate(id=>document.activeElement.dataset.region===id,selected),'map focus preserved');
      check(await p.locator('#pins .pin[aria-pressed=true]').count()===1,'selected map state');
      if(i<5)await p.keyboard.press('Tab');
    }
    await tabUntil(p,'#provinceButtons button');await p.keyboard.press('Space');
    check(await p.evaluate(()=>document.activeElement.matches('#provinceButtons button')),'province button focus preserved');
    const aria=await p.locator('.mapbox svg').ariaSnapshot();check(aria.includes('button')&&aria.includes('Gallia'),'map controls in Chromium AX tree');
    await tabUntil(p,'#choices button');await p.keyboard.press('Shift+Tab');
    // A heading is not in Tab order: reach the reason through native navigation,
    // then select the desired choice; the first round starts from current controls.
    await tabUntil(p,'#reason');
    for(let turn=0;turn<8;turn++) {
      const opt=sampleSequence[turn],reason=reasonFor(turn);
      check((await p.locator('#teacherQuestion').textContent())===await p.evaluate(()=>rounds[idx].q),'historical question preserved');
      if(turn===0) {
        await p.keyboard.type(reason);for(let n=0;n<3-opt;n++)await p.keyboard.press('Shift+Tab');
        await p.keyboard.press('Enter');check(await active(p)==='nextBtn','first decision next focus');
      } else await keyboardDecision(p,opt,reason,turn%2?'Space':'Enter');
      model.choose(opt,reason);eq(await snapshot(p),model.snapshot(),'actual effects after decision '+(turn+1));
      const after=await snapshot(p);await p.keyboard.press('Enter');model.next();
      eq(await snapshot(p),model.snapshot(),'delayed effects at next session/end '+(turn+1));
      check(await active(p)==='decisionTitle','next/session result focus');
      check((await snapshot(p)).history.filter(x=>x.reason).length===turn+1,'one decision per session');
      check(Object.values(after.state).concat(Object.values(after.regions)).every(Number.isFinite),'finite state');
    }
    const end=await snapshot(p);check(end.ended&&end.idx===8,'eight rounds completed');
    check((await p.locator('#decisionText .score').textContent()).includes(await p.evaluate(()=>profile().name)),'end difficulty');
    check((await p.locator('#history').textContent()).includes(reasonFor(0)),'end reason text escaped and retained');
    for(let i=1;i<=3;i++){await tabUntil(p,'#ref'+i);await p.keyboard.type(`Reflexió ${i}: római döntések`);}
    const exported=await readDownload(p,true);
    check(exported.text.includes('Nehézség: '+await p.evaluate(()=>profile().name)),'export difficulty');
    check(exported.text.includes('Tanácsülés: 8 / 8')&&exported.text.includes('Átfogó állapot: '+end.score+'/100'),'export score');
    check(exported.text.includes('Végső értékelés: '+end.title),'export final verdict');
    for(let i=0;i<8;i++)check(exported.text.includes(reasonFor(i)),'export reason '+(i+1));
    for(const h of end.history)check(exported.text.includes(h.effect),'export consequence/delayed/crisis');
    for(let i=1;i<=3;i++)check(exported.text.includes(`Reflexió ${i}: római döntések`),'export reflection '+i);
    const unchanged=await snapshot(p);await p.evaluate(()=>{choose(2);next();});eq(await snapshot(p),unchanged,'synthetic late calls cannot re-evaluate');
    await tabUntil(p,'#resetBtn');await p.keyboard.press('Space');
    check(await active(p)==='imperialTitle','restart opening focus');
    const reset=await snapshot(p);model.reset(mode);eq(reset,model.snapshot(),'restart clears model/log/pending');
    check(await p.evaluate(()=>['ref1','ref2','ref3','reason'].every(id=>document.getElementById(id).value==='')),'restart clears student text');
    const overflow=await p.evaluate(()=>({document:document.documentElement.scrollWidth>innerWidth,opening:getComputedStyle(document.getElementById('imperialSplash')).overflowY}));
    check(!overflow.document&&overflow.opening==='auto','no document overflow; opening scrollable');
    check(p.failures.length===0,p.failures.join(';'));
    return {eight_rounds:true,keyboard_gameplay:true,final_state:end.state,final_regions:end.regions,score:end.score,
      export:{bytes:exported.bytes,sha256:exported.sha256},overflow,legend_contrast:contrast};
  } finally {await p.close();}
}
function comparisonSequences() {
  const all=[Array(8).fill(0),Array(8).fill(1),Array(8).fill(2)];let x=1707;
  while(all.length<20){const s=Array.from({length:8},()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x%3;});if(!all.some(a=>a.join('')===s.join('')))all.push(s);}
  return all;
}
async function normalComparison() {
  const p=await pageFor(1280),q=await pageFor(1280,true);let comparisons=0;const paths=[];
  try {
    await start(p,'normal');await q.locator('.imperial-enter').click();await q.locator('#imperialSplash').waitFor({state:'hidden'});
    for(const seq of comparisonSequences()) {
      if(paths.length) {await p.locator('#resetBtn').click();await start(p,'normal');await q.locator('#resetBtn').click();}
      eq(await snapshot(p),await snapshot(q),'normal initial');comparisons++;
      for(let turn=0;turn<8;turn++) {
        for(const page of [p,q]) {await page.locator('#reason').fill(reasonFor(turn));await page.locator('#choices button').nth(seq[turn]).click();}
        eq(await snapshot(p),await snapshot(q),'normal actual decision');comparisons++;
        for(const page of [p,q])await page.locator('#nextBtn').click();
        eq(await snapshot(p),await snapshot(q),'normal actual next/end');comparisons++;
      }
      paths.push({sequence:seq,score:(await snapshot(p)).score});
    }
    for(const page of [p,q])for(let i=1;i<=3;i++)await page.locator('#ref'+i).fill('Azonos reflexió '+i);
    const a=await readDownload(p),b=await readDownload(q);
    const stripped=a.text.split('\n').filter(l=>!l.startsWith('Nehézség: ')&&!l.startsWith('Végső értékelés: ')&&!l.startsWith('Átfogó állapot: ')).join('\n');
    eq(stripped,b.text,'TXT original format retained except difficulty and final summary');
    check(p.failures.length===0&&q.failures.length===0,'no normal comparison console errors');
    return {sequences:paths,comparisons,unintended_numeric_differences:0,export_compatibility:true};
  } finally {await p.close();await q.close();}
}
async function repeatedControls(width) {
  const p=await pageFor(width);try {
    await start(p,'normal');await p.locator('#choices button').first().dblclick();
    check(await p.evaluate(()=>idx===0&&chosen&&history.filter(h=>h.reason).length===1&&pending.length===1),'native double decision exactly once');
    await p.locator('#nextBtn').dblclick();check(await p.evaluate(()=>idx===1&&!chosen),'double next advances exactly one session');
    for(const key of ['Enter','Space']) {
      await p.locator('#choices button').first().focus();await p.keyboard.down(key);const after=await snapshot(p);
      await p.keyboard.down(key);await p.keyboard.up(key);
      if(key==='Enter')eq(await snapshot(p),after,'held Enter cannot activate newly focused next');
      check(await p.evaluate(()=>chosen&&history.filter(h=>h.reason).length===idx+1),'held button activation once');
      await p.locator('#nextBtn').click();
    }
    check(p.failures.length===0,p.failures.join(';'));return {native_double_click:true,native_key_repeat:true};
  } finally {await p.close();}
}
async function guides(width) {
  const p=await pageFor(width);try {
    await p.locator('.imperial-actions button').last().focus();await p.keyboard.press('Tab');
    check(await p.evaluate(()=>document.activeElement.matches('input[name=difficulty]:checked')),'opening Tab wraps');
    await p.keyboard.press('Shift+Tab');check(await p.evaluate(()=>document.activeElement.matches('.imperial-actions button:last-child')),'opening Shift+Tab wraps');
    await p.locator('.imperial-actions button').nth(1).focus();await p.keyboard.press('Enter');
    await p.locator('#imperialSplash').waitFor({state:'hidden'});
    check(await p.evaluate(()=>document.activeElement.matches('.guide-close')),'opening guide retains focus after animation');
    check(await p.evaluate(()=>document.querySelector('main').inert),'guide background inert');
    await p.keyboard.press('Tab');check(await active(p)==='guideRulesTab','guide active tab only');await p.keyboard.press('ArrowRight');
    check(await active(p)==='guideHistoryTab'&&await p.locator('#guideScroll').getAttribute('aria-labelledby')==='guideHistoryTab','history tab/panel relationship');
    await p.keyboard.press('Home');check(await active(p)==='guideRulesTab','tab Home');await p.keyboard.press('End');
    check(await active(p)==='guideHistoryTab','tab End');await p.keyboard.press('Tab');check(await active(p)==='guideSearch','tab to search');
    await p.keyboard.type('limes');check(await p.locator('#guideScroll').textContent().then(t=>t.includes('limes')),'historical guide search');
    await p.keyboard.press('Tab');check(await active(p)==='guideScroll','tabpanel reachable');await p.keyboard.press('Tab');
    check(await p.evaluate(()=>document.activeElement.matches('.guide-close')),'guide Tab wraps');
    await p.keyboard.press('Escape');check(await active(p)==='decisionTitle','closing hidden splash guide returns to session');
    await tabUntil(p,'.guide-actions button');const returnText=await p.evaluate(()=>document.activeElement.textContent);
    await p.keyboard.press('Space');await p.keyboard.press('Escape');
    check(await p.evaluate(()=>document.activeElement.textContent)===returnText,'main guide returns to trigger');
    check(p.failures.length===0,p.failures.join(';'));return {rules_and_history:true,focus_trap:true};
  } finally {await p.close();}
}
async function transitionRace() {
  const p=await pageFor(1280);try {
    await p.locator('.imperial-enter').focus();await p.keyboard.press('Enter');
    // Synthetic reset during the 520 ms closing animation must cancel the old timer.
    await p.evaluate(()=>{reset();openImperialSplash();});await p.waitForTimeout(600);
    check(await p.locator('#imperialSplash').isVisible(),'old animation cannot hide restarted opening');
    check(await active(p)==='imperialTitle','race retains opening focus');await start(p,'hard');
    check(p.failures.length===0,p.failures.join(';'));return {synthetic_timer_race:true};
  } finally {await p.close();}
}
async function partialExport() {
  const p=await pageFor(768);try {await start(p,'easy');const out=await readDownload(p);
    check(out.text.includes('Nehézség: Ifjú császár')&&out.text.includes('Tanácsülés: 1 / 8'),'partial export current mode/session');
    check(!out.text.includes('Végső értékelés:'),'partial report does not invent final result');
    check(p.failures.length===0,p.failures.join(';'));return {bytes:out.bytes,sha256:out.sha256};
  } finally {await p.close();}
}
async function hubIntegration() {
  const p=await pageFor(1280,false,true);try {
    const card=p.locator('#grid button').filter({hasText:'Irányítsd Rómát!'});await card.click();
    await p.waitForFunction(()=>document.querySelector('iframe')?.getAttribute('src')?.includes('games/iranyitsd-romat.html'));const frame=p.frames().find(f=>f.url().includes('/games/iranyitsd-romat.html'));await frame?.waitForLoadState('domcontentloaded');
    check(!!frame,'hub loads current local game');await frame.locator('input[value=hard]').check();await frame.locator('.imperial-enter').click();
    await frame.locator('#imperialSplash').waitFor({state:'hidden'});check(await frame.locator('#difficultyStatus').textContent().then(t=>t.includes('A birodalom sorsa')),'difficulty in hub iframe');
    await frame.locator('#choices button').first().click();check(await frame.evaluate(()=>chosen&&history.filter(x=>x.reason).length===1),'iframe actual decision');
    check(p.failures.length===0,p.failures.join(';'));return {local_hub_iframe:true};
  } finally {await p.close();}
}
(async()=>{
  server=http.createServer((req,res)=>{
    const rel=req.url.split(/[?#]/)[0];res.setHeader('Content-Type','text/html; charset=utf-8');
    if(rel==='/baseline.html')return res.end(baseline);
    if(rel==='/games/iranyitsd-romat.html')return res.end(source);
    const f=path.resolve(root,'.'+rel);if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404);return res.end();}
    res.end(fs.readFileSync(f));
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));url='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
  for(const width of [360,768,1280]) {
    for(const mode of ['easy','normal','hard'])await run('full-game-export-reset',width,mode,()=>fullGame(width,mode));
    await run('repeated-controls',width,'normal',()=>repeatedControls(width));
    await run('guides-and-opening',width,'all',()=>guides(width));
  }
  await run('normal-20-sequence-regression',1280,'normal',normalComparison);
  await run('transition-race',1280,'all',transitionRace);
  await run('partial-export',768,'easy',partialExport);
  await run('hub-integration',1280,'hard',hubIntegration);
  console.log(JSON.stringify({groups:results.length,pass:results.filter(x=>x.status==='PASS').length,
    fail:results.filter(x=>x.status==='FAIL').length,checks:results.reduce((n,x)=>n+x.checks,0)}));
  if(results.some(x=>x.status==='FAIL'))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.close();});

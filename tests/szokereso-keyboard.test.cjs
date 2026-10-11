'use strict';
// M05: Szókereső – valós billentyűzetes Chromium-regresszió.
// Futtatás (Playwright csak a QA környezetben):
// NODE_PATH=/tmp/tanari-qa/node_modules node tests/szokereso-keyboard.test.cjs
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');

async function exercise(browser,width){
  const page=await browser.newPage({viewport:{width,height:900}});
  const failures=[];
  page.on('pageerror',e=>failures.push('pageerror: '+e.message));
  page.on('console',msg=>{
    if(msg.type()!=='error')return;
    const source=msg.location().url||'';
    // Az opcionális külső betűtípus hálózati hibája nem alkalmazáshiba.
    if(source.startsWith('https://fonts.googleapis.com/')||source.startsWith('https://fonts.gstatic.com/'))return;
    failures.push('console: '+msg.text());
  });
  let checks=0;
  const check=(ok,msg)=>{assert.ok(ok,msg);checks++;};
  try{
    await page.goto(pathToFileURL(path.resolve(__dirname,'../games/szokereso.html')).href,{waitUntil:'domcontentloaded'});
    await page.evaluate(()=>startPuzzle(4821));
    check(await page.locator('#sc-game.on').count()===1,'game visible');
    check(await page.locator('#grid [role="row"]').count()===16,'16 ARIA rows');
    check(await page.locator('#grid [role="gridcell"]').count()===256,'256 ARIA cells');
    check(await page.locator('#grid [tabindex="0"]').count()===1,'one roving tab stop');
    check(await page.evaluate(()=>document.activeElement.id)==='k0-0','focus enters grid');

    await page.keyboard.press('ArrowRight');
    check(await page.evaluate(()=>document.activeElement.id)==='k0-1','ArrowRight moves focus');
    await page.keyboard.press('ArrowLeft');
    check(await page.evaluate(()=>document.activeElement.id)==='k0-0','ArrowLeft moves focus');
    await page.keyboard.press('ArrowUp');
    check(await page.evaluate(()=>document.activeElement.id)==='k0-0','boundary clamped');
    await page.keyboard.press('End');
    check(await page.evaluate(()=>document.activeElement.id)==='k0-15','End moves to row end');
    await page.keyboard.press('Control+Home');
    check(await page.evaluate(()=>document.activeElement.id)==='k0-0','Ctrl+Home moves to top left');

    await page.keyboard.press('Enter');
    check(await page.evaluate(()=>S.anchor?.r===0&&S.anchor?.c===0),'Enter anchors cell');
    await page.keyboard.press('Escape');
    check(await page.evaluate(()=>S.anchor===null&&S.err===0),'Escape cancels without penalty');

    const word=await page.evaluate(()=>{
      const p=S.place.find(p=>p.cells.length>1);
      return {label:p.it.label,start:p.cells[0],end:p.cells[p.cells.length-1]};
    });
    await page.evaluate(([r,c])=>moveGridCursor(r,c,true),word.start);
    await page.keyboard.press(' ');
    const dr=Math.sign(word.end[0]-word.start[0]),dc=Math.sign(word.end[1]-word.start[1]);
    const steps=Math.max(Math.abs(word.end[0]-word.start[0]),Math.abs(word.end[1]-word.start[1]));
    for(let i=0;i<steps;i++){
      if(dr)await page.keyboard.press(dr>0?'ArrowDown':'ArrowUp');
      if(dc)await page.keyboard.press(dc>0?'ArrowRight':'ArrowLeft');
    }
    await page.keyboard.press('Enter');
    check(await page.evaluate(label=>S.place.some(p=>p.it.label===label&&p.found),word.label),'word found using only keys');
    check(await page.evaluate(()=>S.hit)===1,'exactly one found');
    check(await page.locator('#gridStatus').textContent().then(s=>s.includes('Megtaláltad')),'accessible feedback');
    check(await page.locator('#grid [tabindex="0"]').count()===1,'one tab stop after solve');

    const second=await page.evaluate(()=>{
      const p=S.place.find(p=>!p.found);
      return p?{start:p.cells[0],end:p.cells[p.cells.length-1]}:null;
    });
    if(second){
      await page.locator('#k'+second.start.join('-')).click();
      await page.locator('#k'+second.end.join('-')).click();
      check(await page.evaluate(()=>S.hit)===2,'mouse selection unchanged');
    }
    const errs=await page.evaluate(()=>S.err);
    await page.evaluate(()=>startPuzzle(4821));
    check(await page.evaluate(()=>S.hit===0&&S.err===0&&S.anchor===null),'restart resets score and anchor');
    check(await page.locator('#grid [tabindex="0"]').count()===1,'restart resets roving focus');
    check(failures.length===0,'no browser or application console errors: '+failures.join('; '));
    return {width,status:'PASS',checks,errorsBeforeRestart:errs};
  }finally{await page.close();}
}
(async()=>{
  const browser=await chromium.launch({headless:true,
    ...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
  try{
    const results=[];
    for(const width of [360,768,1280])results.push(await exercise(browser,width));
    console.log(JSON.stringify({browser:browser.version(),results},null,2));
  }finally{await browser.close();}
})().catch(err=>{console.error(err.stack||err);process.exitCode=1;});

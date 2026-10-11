'use strict';
/* M04 – A titkos levéltár: panelváltás és fókuszregresszió.
 * Külső fejlesztői függőség: playwright (nem a játék része).
 * Futtatás: NODE_PATH=/tmp/tanari-qa/node_modules node tests/leveltar-panel-focus.test.cjs
 */
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');

async function testWidth(browser,width){
  const page=await browser.newPage({viewport:{width,height:850}});
  const errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  try{
    await page.goto(pathToFileURL(path.resolve(__dirname,'../games/leveltar.html')).href,{waitUntil:'domcontentloaded'});
    await page.evaluate(()=>startGame());
    assert.equal(await page.locator('#s-room.active').count(),1,'game started');
    await page.evaluate(()=>{openYearLock();openNameLock();});
    await page.waitForTimeout(170);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'nameCode','new input is focused after rapid switch');
    assert.equal(await page.locator('#ov[role="dialog"][aria-modal="true"].active').count(),1,'dialog semantics');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#ov.active').count(),0,'Escape closes dialog');
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.lock),'name','focus restored to name lock');

    await page.evaluate(()=>openYearLock());
    await page.waitForTimeout(170);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'yearCode','year input focused');
    await page.locator('#ov .panel-close').focus();
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'hb-year','Shift+Tab cycles to last dialog element');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('panel-close')),true,'Tab wraps to close button');
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.lock),'year','focus restored to year lock');

    await page.evaluate(()=>{openYearLock();closePanel();});
    await page.waitForTimeout(170);
    assert.equal(await page.locator('#ov.active').count(),0,'fast close leaves dialog hidden');

    await page.evaluate(()=>{openYearLock();endGame(false,'timeout');});
    await page.waitForTimeout(170);
    assert.equal(await page.locator('#s-end.active').count(),1,'end screen shown');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'endTitle','end heading receives focus');
    assert.deepEqual(errors,[],'no uncaught runtime errors');
    return {width,status:'PASS',cases:13,errors};
  }finally{await page.close();}
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
   const results=[];
   for(const width of [360,768,1280])results.push(await testWidth(browser,width));
   process.stdout.write(JSON.stringify({test:'M04 levéltár panel focus',browser:browser.version(),results},null,2)+'\n');
 }finally{await browser.close();}
})().catch(err=>{console.error(err.stack||err);process.exitCode=1;});

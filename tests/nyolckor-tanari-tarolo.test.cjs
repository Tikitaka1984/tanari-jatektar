/* Developer-only regression test. No runtime dependency is added to the game. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),cp=require('node:child_process');
const GAME='nyolckor-indul-a-busz';
const root=path.resolve(__dirname,'..'),file=path.join(root,'jatekok',GAME,'index.html');
const source=fs.readFileSync(file,'utf8'),key=source.match(/const TK='([^']+)'/)[1];
const runtimeModules=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
const {chromium}=runtimeModules?require(path.join(runtimeModules,'playwright')):require('playwright');
const baseline=process.argv.includes('--baseline'),filter=process.env.TEST_FILTER,reportPath=process.env.REPORT_PATH||path.join(root,'docs','qa',GAME+'-storage-results.json');
const validRow=(id,name,fin=60,v={m:0,h:0,dn:4,n:4})=>({id,name,fin,chk:'AAAA',v});
const state=(extra={})=>({round:1,code:'1231',byCode:{'1231':[]},...extra});
const good=state({byCode:{'1231':[validRow(1,'Régi eredmény')],'4562':[]}});
const fixtures=[
 ['missing',null,false],['valid',JSON.stringify(good),false],['legacy-no-code',JSON.stringify({round:2,byCode:{'4562':[]}}),false],
 ['invalid-json','{',true],['root-null','null',true],['root-array','[]',true],['root-number','3',true],['root-string','"old"',true],
 ['missing-fields','{}',true],['missing-round',JSON.stringify({byCode:{}}),true],['missing-byCode',JSON.stringify({round:1,code:'1231'}),true],
 ...[0,4,-1,1.5,'1',null,{},[]].map((v,i)=>['round-'+i,JSON.stringify(state({round:v})),true]),
 ...[1231,'1234','oops',{},null,'1232'].map((v,i)=>['code-'+i,JSON.stringify(state({code:v})),true]),
 ...[null,[],1,'rows'].map((v,i)=>['byCode-'+i,JSON.stringify(state({byCode:v})),true]),
 ['object-rows',JSON.stringify(state({byCode:{'1231':{}}})),true],
 ['null-row',JSON.stringify(state({byCode:{'1231':[null,validRow(2,'Megmarad')]}})),true],
 ['bad-row-name',JSON.stringify(state({byCode:{'1231':[validRow(2,{}),validRow(3,'Megmarad')]}})),true],
 ['bad-row-id',JSON.stringify(state({byCode:{'1231':[validRow('" onclick="alert(1)','Hibás'),validRow(3,'Megmarad')]}})),true],
 ['bad-row-time',JSON.stringify(state({byCode:{'1231':[validRow(2,'Hibás',-1),validRow(3,'Megmarad')]}})),true],
 ['bad-row-check',JSON.stringify(state({byCode:{'1231':[{...validRow(2,'Hibás'),chk:{}}]}})),true],
 ['bad-verification',JSON.stringify(state({byCode:{'1231':[validRow(2,'Megmarad',60,{dn:{},n:4})]}})),true],
 ['bad-other-code',JSON.stringify(state({byCode:{'1231':[validRow(2,'Megmarad')],'nope':[]}})),true],
 ['prototype-key',JSON.stringify({round:1,code:'1231',byCode:JSON.parse('{"__proto__":[],"1231":[]}')}),true],
 ['legacy-string-id',JSON.stringify(state({byCode:{'1231':[validRow('old-1','Régi sor',60,null)]}})),false],
 ['legacy-no-v',JSON.stringify(state({byCode:{'1231':[{id:1,name:'Régi sor',fin:60,chk:'AAAA'}]}})),false],
 ['many-valid-codes',JSON.stringify(state({byCode:Object.fromEntries(Array.from({length:12},(_,i)=>[String(i).padStart(3,'0')+'1',[]]))})),false],
 ['storage-denied',null,true],['storage-quota',null,true]
];
const results=[];let browser,server;
function instrument(html){
 return html.replace('/* ================= FŐ CIKLUS ================= */',`window.__storageTest={T,TK,ROUNDS,LIMIT,S,A,QA,W,EV,MAP_Q,closeModal,curKey,checkCode,verify,startQuick,getQ:()=>Q,getModal:()=>modalOpen,getProblem:()=>typeof tStorageProblem==='undefined'?'':tStorageProblem,activate(){const k=curKey(),o=targetObj(k);let act;o&&o.traverse(x=>{if(!act&&x.userData.act)act=x.userData.act;});act=act||({fog:'shelf'}[k]||k);if(Q)quickInteract(act,o);else if(A[act])A[act](o);else throw Error('No action for '+k+'/'+act);}};\n/* ================= FŐ CIKLUS ================= */`)
 .replace('function codeModal({title,prompt,answer,onOk}){','function codeModal({title,prompt,answer,onOk}){window.__codeAnswer=answer;')
 .replace('function timelineModal(onDone,list=EV){','function timelineModal(onDone,list=EV){window.__timelineIds=list.map(x=>x.id);')
 .replace('function mapModal(onDone,QS=MAP_Q){','function mapModal(onDone,QS=MAP_Q){window.__mapQuestions=QS;');
}
async function newPage(width,fixture){
 const p=await browser.newPage({viewport:{width,height:900}}),errors=[],consoleErrors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))consoleErrors.push(m.text());});
 await p.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:')?r.continue():r.abort());
 await p.addInitScript(({key,fixture})=>{
  if(fixture[0]==='storage-denied')Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Storage blocked','SecurityError');}});
  else if(fixture[0]==='storage-quota')Storage.prototype.setItem=function(){throw new DOMException('Storage full','QuotaExceededError');};
  else if(fixture[1]!==null&&localStorage.getItem(key)===null)localStorage.setItem(key,fixture[1]);
 },{key,fixture});
 await p.goto(url+'#tanar',{waitUntil:'domcontentloaded'});await p.waitForTimeout(100);
 return {p,errors,consoleErrors};
}
async function record(name,width,fn){if(filter&&!new RegExp(filter).test(name))return;let item={name,width,status:'PASS'};try{item.detail=await fn();}catch(e){item.status='FAIL';item.error=e.stack||String(e);}results.push(item);console.log(name,width,item.status);fs.writeFileSync(reportPath,JSON.stringify({game:GAME,baseline,time_utc:new Date().toISOString(),browser:browser.version(),source_sha256:require('node:crypto').createHash('sha256').update(source).digest('hex'),base_commit:cp.execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),results},null,2));}
async function storageCase(fixture,width){const {p,errors,consoleErrors}=await newPage(width,fixture);try{
 const snapshot=await p.evaluate(()=>{const h=window.__storageTest;return {teacher:!document.querySelector('#teacher').hidden,ready:!!h,round:h?.T.round,code:h?.T.code,byCode:h?Object.keys(h.T.byCode):[],names:[...document.querySelectorAll('#tBody tr td:nth-child(2)')].map(x=>x.textContent),warning:document.querySelector('#tStorageWarning')?.textContent||'',raw:(()=>{try{return localStorage.getItem(h?.TK||'hu-tanar');}catch{return 'DENIED';}})(),overflow:document.documentElement.scrollWidth>innerWidth};});
 assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);assert(snapshot.teacher&&snapshot.ready);assert([1,2,3].includes(snapshot.round));assert(/^\d{3}[123]$/.test(snapshot.code));
 if(fixture[2]){assert(snapshot.warning,'Missing warning');if(!fixture[0].startsWith('storage-')){assert.equal(snapshot.raw,fixture[1],'Damaged raw data overwritten');await p.locator('#tNew').click();await p.locator('#fName').fill('Munkamenet');await p.locator('#fTime').fill('1:00');await p.locator('#fChk').fill('AAAA');await p.locator('#tAdd').click();assert.equal(await p.evaluate(()=>localStorage.getItem(__storageTest.TK)),fixture[1]);assert(await p.locator('#tStorageWarning').isVisible());}}
 else {assert.equal(snapshot.warning,'');assert(snapshot.raw!==null);}
 if(fixture[0]==='valid')assert(snapshot.names.includes('Régi eredmény'));
 if(fixture[0]==='many-valid-codes')assert.equal(Object.keys(JSON.parse(snapshot.raw).byCode).length,12,'Stored result groups pruned');
 if(['null-row','bad-row-name','bad-row-id','bad-row-time','bad-verification','bad-other-code'].includes(fixture[0]))assert(snapshot.names.includes('Megmarad'),'Usable row lost');
 assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);return snapshot;
 }finally{await p.close();}}
async function teacherFlow(width){const {p,errors,consoleErrors}=await newPage(width,['flow',JSON.stringify(state()),false]);try{
 // Real form entry, ranking, deletion, code/round changes and timer keyboard controls.
 for(const [name,sec,dn] of [['Lassabb',120,4],['Gyorsabb',60,4],['Részleges',30,2]]){const chk=await p.evaluate(({sec,dn})=>__storageTest.checkCode(`1231|${sec}|0|0|${dn}`),{sec,dn});await p.locator('#fName').fill(name);await p.locator('#fTime').fill(`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`);await p.locator('#fChk').fill(chk);await p.locator('#fChk').press('Enter');await p.locator('#fChk').press('Enter');}
 let names=await p.locator('#tBody tr td:nth-child(2)').allTextContents();assert.deepEqual(names,['Gyorsabb','Lassabb','Részleges']);
 await p.locator('#tBody .t-del').nth(1).click();assert.equal(await p.locator('#tBody .t-del').count(),2);
 await p.locator('#tStart').focus();await p.keyboard.press('Space');await p.waitForTimeout(400);assert(await p.evaluate(()=>__storageTest.T.end!==null));await p.keyboard.press('Enter');assert(await p.evaluate(()=>__storageTest.T.end===null));await p.locator('#tReset').click();assert.equal(await p.evaluate(()=>__storageTest.T.left),await p.evaluate(()=>__storageTest.LIMIT));
 const overflow=await p.evaluate(()=>({document:document.documentElement.scrollWidth>innerWidth,teacher:document.querySelector('#teacher').scrollWidth>document.querySelector('#teacher').clientWidth}));
 await p.locator('[data-r="2"]').click();assert.equal(await p.evaluate(()=>__storageTest.T.round),2);assert.equal((await p.locator('#tCode').textContent()).slice(-1),'2');await p.locator('#tNew').focus();await p.keyboard.press('Enter');
 await p.locator('#tBack').click();assert(await p.locator('#teacher').isHidden());assert(await p.locator('#goFull').isVisible());assert(await p.evaluate(()=>!document.activeElement.closest('#teacher')));
 await p.locator('#goFull').click();assert(await p.evaluate(()=>__storageTest.S.playing));await p.reload();assert.equal(await p.evaluate(()=>__storageTest.S.mistakes),0);assert.equal(await p.evaluate(()=>__storageTest.T.byCode['1231'].length),2);
 assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);return {names,overflow,keyboard:'Enter and Space on teacher controls',back:'intro visible; focus outside hidden teacher',restart:'reload resets student state'};
 }finally{await p.close();}}
async function solveCurrentModal(p,wrong=false){
 if(await p.locator('#mbox [data-next]').count()){await p.locator('#mbox [data-next]').click();return;}
 if(await p.locator('#mbox .pad').count()){
  const ans=await p.evaluate(()=>window.__codeAnswer);if(wrong){for(const d of (ans==='0000'?'1111':'0000'))await p.locator(`#mbox [data-d="${d}"]`).click();await p.locator('#mbox [data-ok]').click();}
  for(const d of ans)await p.locator(`#mbox [data-d="${d}"]`).click();await p.locator('#mbox [data-ok]').click();return;
 }
 if(await p.locator('#mbox .slots').count()){const ids=await p.evaluate(()=>window.__timelineIds);for(const id of ids)await p.locator(`#mbox .cards [data-id="${id}"]`).click();return;}
 if(await p.locator('#mbox .match').count()){const ids=await p.locator('#mbox [data-s="L"]').evaluateAll(xs=>xs.filter(x=>!x.classList.contains('done')).map(x=>x.dataset.i));for(const id of ids){await p.locator(`#mbox [data-s="L"][data-i="${id}"]`).click();await p.locator(`#mbox [data-s="R"][data-i="${id}"]`).click();}return;}
 if(await p.locator('#mbox .opts').count()){await p.locator('#mbox [data-k="0"]').click();return;}
 if(await p.locator('#mbox .mapgrid').count()){const id=await p.evaluate(()=>window.__mapQuestions[__storageTest.S.qi.terkep||0].a);await p.locator(`#mbox [data-p="${id}"]`).press('Enter');return;}
 if(await p.locator('#mbox [data-next]').count()){await p.locator('#mbox [data-next]').click();return;}
 if(await p.locator('#mbox [data-close]').count()){await p.locator('#mbox [data-close]').click();return;}
 throw Error('Unsupported modal: '+(await p.locator('#mbox').innerText()).slice(0,200));
}
async function gameplay(round){const {p,errors,consoleErrors}=await newPage(1280,['game',null,false]);try{
 await p.locator('#tBack').click();await p.locator('#goFull').click();
 if(round)await p.evaluate(r=>{__storageTest.closeModal();__storageTest.startQuick(r,'123'+r);},round);
 let steps=0,wrongDone=false;
 while(steps++<160){const status=await p.evaluate(()=>({won:__storageTest.S.won,modal:__storageTest.getModal(),key:__storageTest.curKey()}));if(status.won)break;
 if(status.modal){const wrong=!wrongDone&&await p.locator('#mbox .pad').count();await solveCurrentModal(p,wrong);if(wrong)wrongDone=true;}
 else await p.evaluate(()=>__storageTest.activate());
 }
 assert(steps<160,'Game did not finish');await p.locator('#again').waitFor({state:'visible',timeout:60000});const ending=await p.evaluate(()=>({won:__storageTest.S.won,mistakes:__storageTest.S.mistakes,done:__storageTest.S.done,round:__storageTest.getQ()?.round,completed:__storageTest.getQ()?.i}));assert(ending.won);if(wrongDone)assert.equal(ending.mistakes,1);
 await p.locator('#again').click();await p.waitForLoadState('domcontentloaded');const reset=await p.evaluate(()=>({mistakes:__storageTest.S.mistakes,hints:__storageTest.S.hints,won:__storageTest.S.won,stage:__storageTest.S.stage,inventory:__storageTest.S.inv.length,done:Object.keys(__storageTest.S.done).length,quick:__storageTest.getQ()}));assert.equal(reset.mistakes,0);assert.equal(reset.hints,0);assert.equal(reset.won,false);assert.equal(reset.stage,0);assert.equal(reset.inventory,0);assert.equal(reset.done,0);assert.equal(reset.quick,null);
 assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);return {steps,ending,reset,navigation:'Room objects activated through test-only hook. Modal choices use actual controls. Physical 3D navigation not covered.'};
 }finally{await p.close();}}
let url;
(async()=>{fs.mkdirSync(path.dirname(reportPath),{recursive:true});server=http.createServer((req,res)=>{const rel=decodeURIComponent(req.url.split(/[?#]/)[0]);const target=path.resolve(root,'.'+rel);if(!target.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{let content=fs.readFileSync(target);if(target===file)content=Buffer.from(instrument(content.toString()));res.setHeader('Content-Type',target.endsWith('.html')?'text/html; charset=utf-8':target.endsWith('.js')?'text/javascript':'application/octet-stream');res.end(content);}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));url=`http://127.0.0.1:${server.address().port}/jatekok/${GAME}/index.html`;
 browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 for(const f of fixtures)await record(f[0],360,()=>storageCase(f,360));
 if(!baseline){for(const width of [768,1280])for(const f of [fixtures[1],fixtures.find(x=>x[0]==='object-rows')])await record(f[0],width,()=>storageCase(f,width));for(const w of [360,768,1280])await record('teacher-functions',w,()=>teacherFlow(w));for(const r of [0,1,2,3])await record(r?'quick-round-'+r:'full-game',1280,()=>gameplay(r));}
 console.log(JSON.stringify({game:GAME,baseline,total:results.length,pass:results.filter(x=>x.status==='PASS').length,fail:results.filter(x=>x.status==='FAIL').length}));if(!baseline&&results.some(x=>x.status==='FAIL'))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)server.close();});

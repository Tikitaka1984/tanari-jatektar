'use strict';
// External QA only: executes the game's actual model, with a minimal DOM stub.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const baselineRef = process.env.BASELINE_REF || 'a3669271da16286b164a8f395aa7814e236d8b47';
const legacyRef = process.env.LEGACY_REF || 'b05a5970a9b51a9c763962159608aafe52b8ccfc';
const git = (...args) => cp.execFileSync('git', ['-C', root, ...args], {encoding: 'utf8'}).trim();
const fromGit = ref => cp.execFileSync('git', ['-C', root, 'show', ref + ':games/iranyitsd-romat.html'], {encoding: 'utf8'});
const source = fs.readFileSync(process.env.GAME_SOURCE || path.join(root, 'games/iranyitsd-romat.html'), 'utf8');
const baseline = fromGit(baselineRef), legacy = fromGit(legacyRef);
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
function createModel(html) {
  const nodes = new Map();
  const document = {getElementById(id) {
    if (!nodes.has(id)) nodes.set(id, {value: '', textContent: '', innerHTML: '', style: {},
      classList: {add() {}, remove() {}, toggle() {}, contains: () => false}, querySelectorAll: () => [],
      addEventListener() {}, setAttribute() {}, focus() {}});
    return nodes.get(id);
  }};
  const context = vm.createContext({document, console, setTimeout: () => 0});
  const core = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)][0][1];
  // Rendering is suppressed only in this numeric test, after real initialization.
  // End scoring still runs the original endScreen(), not a copied scoring formula.
  vm.runInContext(core + `
    render = function(){ if(ended)endScreen(); };
    globalThis.api = {
      reset(mode){ if(typeof setDifficulty==='function')setDifficulty(mode);else reset(); },
      choose(i,reason){ $('reason').value=reason;choose(i); }, next, settle,
      snapshot(){ return JSON.parse(JSON.stringify({state,regions,idx,chosen,ended,chosenOption,selected,pending,history,
        score:ended?Number($('decisionText').innerHTML.match(/Átfogó állapot: (\\d+)\\/100/)[1]):null,
        title:ended?$('decisionTitle').textContent:null})); },
      inject(s,r,turn){state={...s};regions={...r};idx=turn;chosen=false;ended=false;pending=[];history=[];},
      delayed(turn,opt){const p=makeDelayed(turn,opt);if(p)pending.push(p);},
      regions(amount){applyRegions(['aegyptus','italia'],typeof scaled==='function'?scaled(amount):amount);},
      constants(){return JSON.parse(JSON.stringify({start,regionBase,rounds,regionEffects,
        difficulty:typeof DIFFICULTY==='undefined'?null:DIFFICULTY}));}
    };`, context);
  return context.api;
}
function sequences() {
  const out = [];
  for (let n = 0; n < 3 ** 8; n++) {
    let x = n, seq = Array(8).fill(0);
    for (let i = 7; i >= 0; i--) {seq[i] = x % 3; x = Math.floor(x / 3);}
    out.push(seq);
  }
  if (!process.env.SEQUENCE_LIMIT) return out;
  const count = Number(process.env.SEQUENCE_LIMIT);
  return [out[0], out[3280], out[6560], ...out.filter((_, i) => i % 241 === 17)].slice(0, count);
}
function inRange(s) {
  return [...Object.values(s.state), ...Object.values(s.regions)].every(n => Number.isFinite(n) && n >= 0 && n <= 100);
}
function same(a,b) {return JSON.stringify(a) === JSON.stringify(b);}
function play(model, mode, seq) {
  model.reset(mode);
  const stages = [model.snapshot()];
  seq.forEach((opt, turn) => {
    model.choose(opt, `QA ${turn + 1}. tanácsülés`);stages.push(model.snapshot());
    model.next();stages.push(model.snapshot());
  });
  return stages;
}
function main() {
  const current = createModel(source), old = createModel(baseline), previous = createModel(legacy);
  const list = sequences();
  const report = {tested_commit: process.env.TESTED_COMMIT || git('rev-parse', 'HEAD'),
    source_sha256: hash(source), test_sha256: hash(fs.readFileSync(__filename)),
    baseline_commit: git('rev-parse', baselineRef), baseline_sha256: hash(baseline),
    legacy_commit: git('rev-parse', legacyRef), legacy_sha256: hash(legacy),
    node: process.version, time_utc: new Date().toISOString(),
    method: 'Actual first inline script; DOM stub; rendering suppressed; original endScreen scoring executed',
    normal: {paths: list.length, comparisons: 0, mismatched_paths: 0, invalid_states: 0, samples: []},
    difficulty: {}, edge_cases: [], rounding: []};
  const scores = [];
  for (const seq of list) {
    const a = play(old, 'normal', seq), b = play(current, 'normal', seq);
    let differs = false;
    for (let i = 0; i < a.length; i++) {
      report.normal.comparisons++;
      if (!inRange(b[i])) report.normal.invalid_states++;
      if (!same(a[i], b[i])) {
        differs = true;
        if (report.normal.samples.length < 4) report.normal.samples.push({sequence: seq,
          stage: i, moment: i === 0 ? 'initial' : i % 2 ? 'after-decision' : 'next-session-or-end',
          baseline: a[i], candidate: b[i]});
      }
    }
    if (differs) report.normal.mismatched_paths++;
    scores.push(b.at(-1).score);
  }
  report.difficulty.normal = {paths: list.length, score_min: Math.min(...scores), score_max: Math.max(...scores),
    score_mean: scores.reduce((a,b) => a+b,0)/scores.length};
  for (const mode of ['easy','hard']) {
    const item = report.difficulty[mode] = {paths: list.length, comparisons: 0, mismatched_legacy_paths: 0,
      invalid_states: 0, incomplete: 0, score_min: 100, score_max: 0, score_sum: 0, sample_sequence: list[1]};
    current.reset(mode);item.initial = current.snapshot();
    for (const seq of list) {
      const a = play(previous, mode, seq), b = play(current, mode, seq);
      if (!same(a,b)) item.mismatched_legacy_paths++;
      item.comparisons += b.length;
      b.forEach(s => {if (!inRange(s)) item.invalid_states++;});
      const end = b.at(-1);if (!end.ended || end.idx !== 8 || end.history.filter(h => h.reason).length !== 8) item.incomplete++;
      item.score_min = Math.min(item.score_min, end.score);item.score_max = Math.max(item.score_max, end.score);item.score_sum += end.score;
    }
    item.score_mean = item.score_sum/list.length;delete item.score_sum;
    item.example_stages = play(current, mode, list[1]);
  }
  const constants = old.constants(), regionIds = constants.regionBase.map(r => r.id);
  const seeds = [
    {name:'all-zero',values:[0,0,0,0],region:0},
    {name:'all-ceiling',values:[100,100,100,100],region:100},
    {name:'below-crisis-thresholds',values:[24,29,29,29],region:34},
    {name:'exact-crisis-thresholds',values:[25,30,30,30],region:35},
    {name:'clamp-boundaries',values:[1,99,1,99],region:99}
  ];
  for (const seed of seeds) for (let turn = 0; turn < 8; turn++) for (let opt = 0; opt < 3; opt++) {
    const s = Object.fromEntries(['money','border','supply','loyalty'].map((k,i) => [k,seed.values[i]]));
    const r = Object.fromEntries(regionIds.map(k => [k,seed.region]));
    const snapshots = [];
    for (const model of [old,current]) {
      model.reset('normal');model.inject(s,r,turn);
      model.choose(opt,'Szélsőértékes QA');const chosen = model.snapshot();model.next();snapshots.push([chosen,model.snapshot()]);
    }
    report.edge_cases.push({name:seed.name,turn:turn+1,option:opt+1,status:same(...snapshots)&&snapshots[1].every(inRange)?'PASS':'FAIL'});
  }
  // Exercise all four crisis branches and due delayed effects directly at session start.
  for (const seed of seeds) {
    const stages = [];
    for (const model of [old,current]) {
      model.reset('normal');model.inject(Object.fromEntries(['money','border','supply','loyalty'].map((k,i)=>[k,seed.values[i]])),
        Object.fromEntries(regionIds.map(k=>[k,seed.region])),2);
      model.delayed(0,2);model.settle();stages.push(model.snapshot());
    }
    report.edge_cases.push({name:'settle-'+seed.name,status:same(...stages)&&inRange(stages[1])?'PASS':'FAIL'});
  }
  for (const amount of [12.18,-12.18,.49,.5,-.49,-.5,99.9,-99.9]) {
    const values = [];
    for (const model of [old,current]) {
      model.reset('normal');model.regions(amount);values.push(model.snapshot().regions);
    }
    report.rounding.push({amount,baseline:values[0],candidate:values[1],status:same(...values)?'PASS':'FAIL'});
  }
  report.normal.status = !report.normal.mismatched_paths && !report.normal.invalid_states ? 'PASS':'FAIL';
  for (const mode of ['easy','hard']) {
    const d = report.difficulty[mode];d.status = !d.mismatched_legacy_paths&&!d.invalid_states&&!d.incomplete?'PASS':'FAIL';
  }
  report.time_utc = new Date().toISOString();
  const out = process.env.REPORT_PATH || path.join(root,'docs/qa/roma-9-model-results.json');
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({normal:report.normal.status,paths:list.length,comparisons:report.normal.comparisons,
    mismatched_normal_paths:report.normal.mismatched_paths,easy:report.difficulty.easy.status,hard:report.difficulty.hard.status,
    edge_cases:report.edge_cases.length,edge_fail:report.edge_cases.filter(x=>x.status==='FAIL').length,
    rounding_fail:report.rounding.filter(x=>x.status==='FAIL').length}));
  assert.equal(report.normal.status,'PASS','Normal differs from the actual 8.0 model');
  assert.equal(report.difficulty.easy.status,'PASS');assert.equal(report.difficulty.hard.status,'PASS');
  assert.ok(report.edge_cases.every(x=>x.status==='PASS'));assert.ok(report.rounding.every(x=>x.status==='PASS'));
}
module.exports = {createModel,play,baseline,legacy,source,hash,baselineRef,legacyRef};
if (require.main === module) main();

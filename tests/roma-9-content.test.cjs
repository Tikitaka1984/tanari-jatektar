'use strict';
// Byte comparisons protect the original educational material and scoring rules.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const {source,baseline,legacy,hash,baselineRef}=require('./roma-9-model.test.cjs');
const root=path.resolve(__dirname,'..'),results=[];
const slice=(s,a,b)=>s.slice(s.indexOf(a),s.indexOf(b,s.indexOf(a)));
function same(name,a,b) {results.push({name,status:a===b?'PASS':'FAIL',baseline_sha256:hash(a),candidate_sha256:hash(b)});}
same('all_rounds_options_notes_reports_region_data_and_map_coordinates',
  slice(baseline,'const rounds=[','let state,'),slice(source,'const rounds=[','const DIFFICULTY='));
same('all_original_delayed_plans',slice(baseline,'function makeDelayed(','function settle(){'),slice(source,'function makeDelayed(','function settle(){'));
same('historical_guide_rules_material_and_sources',slice(baseline,'const guidePages=','let guideActive='),slice(source,'const guidePages=','let guideActive='));
same('unchanged_9_difficulty_profiles',slice(legacy,'const DIFFICULTY=','let difficulty='),slice(source,'const DIFFICULTY=','let difficulty='));
same('original_score_formula_and_verdict_thresholds',slice(baseline,'let all=keys.map',"$('roundLabel').textContent='VÉGSŐ"),slice(source,'let all=keys.map',"$('roundLabel').textContent='VÉGSŐ"));
same('original_province_weighting_and_clamp',slice(baseline,'function applyRegions(','function format('),slice(source,'function applyRegions(','function format('));
same('map_geographic_shapes_and_labels',baseline.match(/<svg viewBox="0 0 1100 670"[^>]*>([\s\S]*?)<\/svg>/)[1],source.match(/<svg viewBox="0 0 1100 670"[^>]*>([\s\S]*?)<\/svg>/)[1]);
const blocks=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
blocks.forEach((m,i)=>{new vm.Script(m[1],{filename:'games/iranyitsd-romat.html:inline-'+i});results.push({name:'inline_script_'+i+'_syntax',status:'PASS'});});
for(const f of ['roma-9-model.test.cjs','roma-9-browser.test.cjs','roma-9-content.test.cjs']) {
  new vm.Script(fs.readFileSync(path.join(root,'tests',f),'utf8'),{filename:f});results.push({name:f+'_syntax',status:'PASS'});
}
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
const original=JSON.parse(cp.execFileSync('git',['-C',root,'show',baselineRef+':manifest.json'],{encoding:'utf8'}));
const bytes=Buffer.from(source,'utf8'),md5=require('node:crypto').createHash('md5').update(bytes).digest('hex');
const entry=manifest['iranyitsd-romat'];
results.push({name:'manifest_utf8_bytes_and_md5',status:entry.path==='games/iranyitsd-romat.html'&&entry.bytes===bytes.length&&entry.md5===md5?'PASS':'FAIL',bytes:bytes.length,md5});
const untouched=Object.keys(original).filter(k=>k!=='iranyitsd-romat');
results.push({name:'other_manifest_entries_unchanged',status:JSON.stringify(Object.keys(original))===JSON.stringify(Object.keys(manifest))&&untouched.every(k=>JSON.stringify(original[k])===JSON.stringify(manifest[k]))?'PASS':'FAIL',entries:untouched.length});
const changed=cp.execFileSync('git',['-C',root,'diff','--name-only',baselineRef,'--','games/'],{encoding:'utf8'}).trim().split('\n');
results.push({name:'only_roma_game_source_changed',status:JSON.stringify(changed)===JSON.stringify(['games/iranyitsd-romat.html'])?'PASS':'FAIL',files:changed});
const report={tested_commit:cp.execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),baseline_commit:baselineRef,
  source_sha256:hash(source),test_sha256:hash(fs.readFileSync(__filename)),node:process.version,time_utc:new Date().toISOString(),results};
const out=process.env.REPORT_PATH||path.join(root,'docs/qa/roma-9-content-results.json');
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({checks:results.length,pass:results.filter(x=>x.status==='PASS').length,fail:results.filter(x=>x.status==='FAIL').length,bytes:bytes.length,md5}));
assert.ok(results.every(x=>x.status==='PASS'),'Protected content, syntax, manifest or scope check failed');

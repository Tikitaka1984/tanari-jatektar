'use strict';
// Standalone, dependency-free gate for the user-supplied Athenian escape room.
// Execute from any working directory: node tests/cserepszavazas-integrity.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const relativeFiles = [
  ['jatekok/cserepszavazas-napja/index.html', 129963, '04847419a9bbcff656128c3903f8b120fd8991230f3a323ac4d4464284bd15e4'],
  ['jatekok/cserepszavazas-napja/docs/tanari_kiseroanyag_athen_agora.docx', 12955, '104d17bdfcd5e4ae2e5158d10d6a666323da6e5bcf58af4fb7165a782bdf6f8d'],
  ['jatekok/cserepszavazas-napja/docs/tartalmi_terv_athen_agora.docx', 12826, '78af3e0d5b743c199078c347b33428bc679eaef01095287bd6084e712d54b5be']
];
for (const [rel, expectedSize, expectedHash] of relativeFiles) {
  const full = path.join(root, rel);
  assert.ok(fs.existsSync(full), 'MISSING GAME FILE: ' + rel);
  const content = fs.readFileSync(full);
  assert.equal(content.length, expectedSize, 'Unexpected file size: ' + rel);
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  assert.equal(hash, expectedHash, 'Package SHA-256 mismatch: ' + rel);
  if (rel.endsWith('.docx')) assert.equal(content.subarray(0, 2).toString(), 'PK', 'Invalid DOCX: ' + rel);
  console.log('PASS:', rel);
}
const html = fs.readFileSync(path.join(root, relativeFiles[0][0]), 'utf8');
assert.match(html, /A cserépszavazás napja/, 'Missing game title');
assert.match(html, /\.\.\/_lib\/three\.min\.js/, 'Expected local Three.js reference absent');
assert.ok(fs.existsSync(path.join(root, 'jatekok/_lib/three.min.js')), 'Missing local Three.js library');
for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) new vm.Script(match[1]);
console.log('PASS: all inline game scripts compile');
const entries = JSON.parse(fs.readFileSync(path.join(root, 'jatekok/jatekok.json'), 'utf8'));
assert.equal(entries.filter(x => x.slug === 'cserepszavazas-napja').length, 1, 'Missing or duplicate catalogue record');
const item = entries.find(x => x.slug === 'cserepszavazas-napja');
assert.equal(item.ut, '/jatekok/cserepszavazas-napja/');
assert.equal(item.tanari_anyag, '/jatekok/cserepszavazas-napja/docs/tanari_kiseroanyag_athen_agora.docx');
const hub = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.ok(hub.includes('slug:"cserepszavazas-napja"'), 'Hub escape-room card missing');
assert.ok(hub.includes('"cserepszavazas-napja": "cserepszavazas"'), 'Hub artwork mapping missing');
assert.ok(fs.existsSync(path.join(root, 'assets/hub-cserepszavazas.svg')), 'Hub artwork missing');
console.log('PASS: hub metadata, artwork and routing');
console.log('PASS: A cserépszavazás napja package integrity (3/3 files)');

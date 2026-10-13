'use strict';
/* Image package integrity, dependency-free: node tests/cinematic-v2-integrity.test.cjs */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'docs/qa/cinematic-images-v2-manifest.json'),'utf8'));
const expected = ['reformkor','szokereso','keresztrejtveny','eszperente','arpadok','iuti','demo-wwi','demo-legkor'];
assert.deepEqual(Object.keys(data), expected, 'Eight and only eight WebP files');
const html = fs.readFileSync(path.join(root, 'index.html'),'utf8');
for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(script[1]);
for (const key of expected) {
 const entry = data[key];
 assert.equal(entry.file, 'assets/hub-' + key + '.webp');
 const full=path.join(root,entry.file);
 assert.ok(fs.existsSync(full),'MISSING IMAGE: ' + entry.file);
 const body=fs.readFileSync(full);
 assert.equal(body.length,entry.bytes,'Image length: '+key);
 assert.equal(body.subarray(0,4).toString('latin1'),'RIFF','RIFF header: '+key);
 assert.equal(body.subarray(8,12).toString('latin1'),'WEBP','WebP magic: '+key);
 assert.equal(crypto.createHash('sha256').update(body).digest('hex'),entry.sha256,'Image hash: '+key);
 assert(html.includes("'" + key + "'"),'WebP registry: '+key);
 console.log('PASS',entry.file,body.length);
}
const records = JSON.parse(fs.readFileSync(path.join(root,'jatekok/jatekok.json'),'utf8'));
assert.equal(records.length,6,'Six 3D escape rooms');
assert(records.some(r=>r.slug==='cserepszavazas-napja'),'Athens remains registered');
assert(html.includes('"cserepszavazas-napja": "cserepszavazas"'), 'Athens SVG registry preserved');
assert(fs.existsSync(path.join(root,'assets/hub-cserepszavazas.svg')), 'Athens illustration preserved');
const first=JSON.parse(fs.readFileSync(path.join(root,'docs/qa/cinematic-images-manifest.json'),'utf8'));
assert.equal(Object.keys(first).length,10,'First batch of 10 untouched');
console.log('PASS: 8/8 new WebP SHA-256; original 10 manifest entries; 6 escape room routes');

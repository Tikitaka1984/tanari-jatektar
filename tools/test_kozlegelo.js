// Jsdom-szimuláció: A közlegelő tragédiája (games/kozlegelo_tragediaja.html)
// Futtatás a repó gyökeréből:  npm i --no-save jsdom && node tools/test_kozlegelo.js
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "games", "kozlegelo_tragediaja.html"), "utf8");
let errors = [], fails = 0;

function boot() {
  const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true });
  dom.window.addEventListener("error", e => errors.push(e.message));
  dom.window.scrollTo = () => {};
  return dom;
}
function play(mode, rules, targets) {
  const dom = boot(), w = dom.window, d = w.document;
  d.querySelector(`input[name=mode][value=${mode}]`).checked = true;
  d.querySelector(`input[name=rules][value=${rules ? "law" : "none"}]`).checked = true;
  d.getElementById("btn-start").click();
  if (rules) {
    d.getElementById("quota").value = String(rules.q);
    d.getElementById("quota").dispatchEvent(new w.Event("input"));
    d.getElementById("monitor").checked = rules.monitor;
    d.getElementById("btn-law").click();
  }
  const st = w.__kozlegelo.getState();
  st.families.forEach((f, i) => {
    if (!f.human) return;
    const t = targets[i];
    while (f.pending < t) d.querySelector(`button[data-i="${i}"][data-d="1"]`).click();
    while (f.pending > t) d.querySelector(`button[data-i="${i}"][data-d="-1"]`).click();
  });
  let guard = 0;
  while (!st.over && guard++ < 20) d.getElementById("btn-graze").click();
  d.getElementById("btn-results").click();
  if (!d.getElementById("screen-end").classList.contains("active")) { fails++; console.log("HIBA: nem jelent meg a végképernyő"); }
  return st;
}
function expect(name, cond) { console.log((cond ? "OK   " : "HIBA ") + name); if (!cond) fails++; }

let s = play("ai", null, [3]);
expect("Szabály nélkül, gépi szomszédokkal a legelő összeomlik", s.collapsedYear !== null);
s = play("ai", { q: 3, monitor: true }, [3]);
expect("Kvóta 3 + csősz: a legelő megmarad (>= 60%)", s.collapsedYear === null && s.grass >= 60);
s = play("ai", { q: 3, monitor: false }, [3]);
expect("Kvóta 3 csősz nélkül: a legelő nem marad dús", s.collapsedYear !== null || s.grass < 60);
s = play("groups", null, [3, 3, 3, 3]);
expect("4 csoport, mindenki 3 juh: fenntartható", s.collapsedYear === null && s.grass >= 60);
s = play("groups", null, [3, 3, 3, 6]);
expect("Potyautas többet keres, mint a többiek", s.families[3].wealth > s.families[0].wealth);
s = play("groups", { q: 3, monitor: true }, [3, 3, 3, 5]);
expect("Csősz: a szabályszegőt megbírságolja", s.families[3].fines > 0 && s.families[3].offenses > 0);
expect("Nincs futásidejű JS-hiba", errors.length === 0);
console.log(fails ? `\n${fails} hiba` : "\nMinden teszt sikeres.");
process.exit(fails ? 1 : 0);

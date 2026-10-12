# Minden katalóguskártya illusztrációja – QA

Dátum: 2026-10-12. Ág: feature/hub-all-card-illustrations.
Kiinduló főág: 551a3f0 (a #21 főoldali PR integrációja).
Chrome: 154.0.8037.99 / Playwright, helyi statikus HTTP-kiszolgáló.
Tesztelt index.html SHA-256: `71171f99f8703c06cd1266a8c0a84f754b3003feafcbd700ba92c62800b3e9d6`.

## Változás

A 18 katalóguskártya mindegyikén külön, témához illő illusztráció jelenik meg. A két meglévő SVG megmarad; 16 új helyi SVG készült. A csillagos hátterek és az azonos várképet használó szabadulószobák helyett saját jelenetek láthatók. A képek a kártyák tetejéhez igazodnak; a gyakorlófeladatok és demók megnyitásgombjai soronként azonos magasságban helyezkednek el.

Az SVG-k dekoratív, jelképes jelenetek: nem történelmi portrék, hiteles rekonstrukciók vagy oktatási térképek. A kártyák címe és szövege adja az akadálymentes tartalmat; a képek alt szövege üres és a képsáv aria-hidden. Helyi fájlok, lazy betöltés, nincs új külső függőség. A 18 SVG összmérete kb. 71 kB.

## Tesztek

| Szélesség | Eredmény |
| --- | --- |
| 360 px | PASS |
| 768 px | PASS |
| 1280 px | PASS |

Mindhárom méretben:

- 9 játék, 5 szabadulószoba, 4 bemutató; összesen 18 különböző képútvonal.
- Mind a 18 kép sikeresen dekódolódott; minden kép a saját kártya tetején jelenik meg.
- Nincs vízszintes túlcsordulás.
- Menü, billentyűzet, tantárgy-/évfolyam-/típusszűrés és üres állapot PASS.
- Kiemelt Róma/korona, normál játék és Róma-demó: iframe, külön lap, visszatérés, fókusz és lejátszó Escape PASS.
- Szabadulószoba-, tanári és Word-linkek HTTP 200.
- JavaScript pageerror nincs a tesztelt folyamatokban.

JavaScript szintaxis és git diff --check PASS. Mind a 18 SVG XML-formátuma érvényes; nincs beágyazott script vagy foreignObject. Mind a hat katalógus-adattömb változatlan. games/, demos/, jatekok/ módosítás nincs; M08 érintetlen.

A 18 képet kontaktlapon vizuálisan ellenőriztük; a három katalógusszekció képernyőképei és mobil/tablet elrendezése ellenőrizve. A képek nem fedik a szöveget; a kártyák megnyitásgombjai elérhetők.

## Reprodukció és bizonyíték

`node tests/hub-browser.test.cjs` külső Playwright-telepítésből (NODE_PATH szükség szerint). QA_OUTPUT a kimeneti mappa, QA_BROWSER alapérték chrome. Nem kell függőséget telepíteni a projektbe.
Gépi eredmény: docs/qa/hub-all-illustrations-results.json. Képernyőképek a Codex outputs/all-card-illustrations mappájában.

## Korlátok és átadás

Firefox/Safari, fizikai mobil és képernyőolvasó nem tesztelt. Játék-végigjátszás, pontozás és a belső 3D tanári működés nem változott és nem került újratesztelésre.
Külön Draft PR a main ágra; merge és deploy a korábbi felhasználói kérésnek megfelelően külön jóváhagyást igényel.

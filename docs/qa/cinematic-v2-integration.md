# Cinematic Edition 2.0 – integráció és Chromium QA

Dátum: 2026-10-13. PR: #28. Ág: `feature/cinematic-2-eight-webp-20261013`.

## Eredmény

**PASS – a kért képintegráció beolvasztásra javasolható.** Automatikus merge és kézi production élesítés nem történt.

| Ellenőrzés | 360 px | 768 px | 1280 px |
| --- | --- | --- | --- |
| 19 kártyakép: 18 WebP + 1 SVG | PASS | PASS | PASS |
| 2 kiemelt játék képe és indítása | PASS | PASS | PASS |
| 19 katalógusindítás + 2 kiemelt indítás | 21/21 PASS | 21/21 PASS | 21/21 PASS |
| 6 szabadulószoba: canvas, teljes játék indítása, aktív segítség | 6/6 PASS | 6/6 PASS | 6/6 PASS |
| Vízszintes kilógás | nincs | nincs | nincs |
| JavaScript-, konzol-, hálózati és HTTP-hiba | 0 | 0 | 0 |

Mindhárom nézet 900 CSS px magas, új böngészőprofilban futott. Összesen **63 sikeres indítás** történt. A képek dekódolhatók, természetes szélességük és magasságuk pozitív; mind a 19 kártya saját képútvonalat használ. A képernyőképeket vizuálisan is ellenőriztük.

## Feltöltött fájlok és hatókör

A csatolt `Tanari_Jatektar_Cinematic_2_8_WebP (3).zip` nyolc képe az eredeti `assets/` útvonalra került:

- `assets/hub-arpadok.webp`
- `assets/hub-demo-legkor.webp`
- `assets/hub-demo-wwi.webp`
- `assets/hub-eszperente.webp`
- `assets/hub-iuti.webp`
- `assets/hub-keresztrejtveny.webp`
- `assets/hub-reformkor.webp`
- `assets/hub-szokereso.webp`

Mind a nyolc fájl 1119 × 630 px méretű. Összméretük 538 274 bájt. A csomag és az ágon található `cinematic-images-v2-manifest.json` bájthűen egyezik; ezért a manifestet nem kellett felülírni.

A képcommit a korábbi **142 repository-fájl egyikét sem módosította vagy törölte**. Megmaradt a korábbi 10 WebP és mind a 19 SVG, köztük az athéni játék saját `assets/hub-cserepszavazas.svg` illusztrációja. A `games/`, `demos/`, `jatekok/` állományok, a játékregiszter, a történelmi tartalmak és a pontozás változatlanok. A főoldal nyolc képútvonalát a PR már korábban bekötötte; ebben a befejezési munkában az `index.html` nem változott.

A QA-teszt két célzott javítást kapott: a szabadulószobák indítási ciklusa 5 helyett mind a 6 játékot ellenőrzi; a `QA_TIMEOUT_MS` változó lehetővé teszi a lassú proxyhoz szükséges várakozási időt, az alapérték továbbra is 20 000 ms. Az 5 játékos ciklus csak 20 indítást végzett volna az elvárt 21 helyett, és kihagyta volna az athéni játékot.

## Lefuttatott ellenőrzések

```bash
node tests/cinematic-v2-integrity.test.cjs
node tests/cinematic-image-swap.test.cjs
```

- Integritásteszt: **PASS**, 8/8 fájl mérete, RIFF/WEBP fejléc és SHA-256 egyezik; 6 szabadulószoba és az athéni SVG-regisztráció megmaradt.
- Chromium-teszt: **PASS**, 360/768/1280 px; a korábbi 10 WebP mérete és SHA-256 értéke, illetve a 19 SVG változatlansága is ellenőrizve.
- Külön HTTP-próba: **PASS**, mind a 8 új kép HTTP 200, `image/webp`, megfelelő méret és SHA-256.
- Szűrők, navigáció, mobilmenü, Enter/Space, Escape és visszatérő fókusz: **PASS**.
- Mindkét kiemelt játék tényleges kezdése és külön böngészőlapon megnyitása: **PASS**. A római játék újrakezdése is ellenőrizve.
- A hat 3D játék látható, nem üres canvasszal indult; a teljes játékmód és az aktív segítség működött.
- A szabadulószobák tanári letöltéseinek HTTP-elérhetősége: **PASS**.
- JavaScript-szintaxis: **PASS**.
- A tesztelt forráscommit Vercel commit-státusza: **success**.

## Környezet és reprodukálhatóság

Böngésző: **Chromium 153.0.8010.0**, Playwright, headless, SwiftShader szoftveres WebGL. A tesztelt GitHub-forráscommit: `f39bfb4b8cc6d25a50ea3b45d80794554840a9f2`. A képcommit: `902a1fef1ee5a7db0eefaf1b754f037570980a82`.

A közvetlen Git-letöltés helyett a GitHub-bővítményből származó 61 tesztelési fájl alapján készült helyi QA-másolat. Minden letöltött fájl Git blob SHA-ja egyezett a kiinduló `e01e09a388a4b499cd836c699c5eeed84c3da77d` commit megfelelő fájljával. A `results.json` `base_commit` mezője a helyi QA-másolat commitja, nem GitHub-commit; a megfeleltetést a `provenance.json` rögzíti. A végső tesztfájl GitHubon és helyben azonos, blob SHA-ja `4200217d029882787039295dc03060af48f08e8d`.

A futtatókörnyezetben `NODE_PATH`, `QA_EXECUTABLE_PATH`, `QA_OUTPUT` és `QA_TIMEOUT_MS=90000` volt beállítva. A Chromium indítási jelzői: `--no-zygote --in-process-gpu --use-gl=angle --use-angle=swiftshader --disable-http2`, továbbá a teszt saját `--enable-unsafe-swiftshader` jelzője.

Az első próbák a proxy miatt lassú Google Fonts-betöltés 20 mp-es időkorlátján, illetve az egyszeres Chromium-folyamat következő profilnál történő leállásán akadtak el. A végső futás többfolyamatos böngészőt és 90 mp-es felső várakozási határt használt. Nem történt hálózati válaszok, betűkészletek vagy játékkód helyettesítése. A hosszabb timeout kizárólag a tesztkörnyezetre vonatkozik.

## Bizonyítékok

- [Részletes Chromium-eredmények](cinematic-v2-evidence/results.json)
- [Böngészős tesztnapló](cinematic-v2-evidence/browser-test.log)
- [Integritásteszt naplója](cinematic-v2-evidence/integrity-test.log)
- [Nyolc új kép HTTP-próbája](cinematic-v2-evidence/new-images-http.json)
- [Commitok, fájlvédelem és futtatási környezet](cinematic-v2-evidence/provenance.json)
- [360 px](cinematic-v2-evidence/viewport-360.jpg), [768 px](cinematic-v2-evidence/viewport-768.jpg), [1280 px](cinematic-v2-evidence/viewport-1280.jpg)
- [Kiemelt játékok mobilon](cinematic-v2-evidence/featured-360.jpg)
- [9 gyakorlójáték](cinematic-v2-evidence/grid-1280.jpg), [6 szabadulószoba](cinematic-v2-evidence/escapeGrid-1280.jpg), [4 szemléltetés](cinematic-v2-evidence/demoGrid-1280.jpg)

## A vizsgálat határa

A kért kép-, mobilnézet- és játékindítási QA teljesült. Ez a vizsgálat nem jelent minden játék teljes végigjátszását, minden válasz és pontozási ág újraminősítését, valódi mobilkészülékes vagy más böngészős tesztet, illetve éles domainen végzett utólagos tesztet. A játékok belső tartalma és logikája változatlan maradt.

A filmes képek oktatási célú hangulatképek, nem elsődleges történelmi források vagy hiteles rekonstrukciók.

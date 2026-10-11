# M05 – Szókereső: billentyűzetes rácsbeállítás és akadálymentesítés

## Kiinduló hiba és hatókör
A 2026-10-11-i audit T12 ellenőrzése szerint a 16×16-as (256 cellás) szókereső rácsban **0/256** cella volt billentyűzettel fókuszálható. A diák a feladatot egér nélkül nem tudta végigoldani.

Érintett fájl: `games/szokereso.html`. A célzott QA-eszköz: `tests/szokereso-keyboard.test.cjs`. Történelmi szöveg, a 428 elemes szóbank, rejtvénygenerálás, rejtvénykód, nehézségválasztás, megoldókulcs és pontozási szabály **változatlan**.

## Műszaki megoldás
- `role=grid` alatt szemantikailag jelölt 16 sor (`role=row`), soronként 16 cella (`role=gridcell`) jelenik meg.
- A **roving tabindex** módszerrel mindig pontosan egy cella van a Tab-sorrendben; a fókusz látható.
- Nyílbillentyűk: sor/oszlop léptetése, a széleken megállva; Home/End: sor eleje/vége; Ctrl+Home/Ctrl+End: teljes rács eleje/vége.
- **Enter vagy Szóköz**: kezdő- vagy végpont kijelölése, ugyanazt a meglévő `tap(r,c)` függvényt hívja, mint az egérkattintás.
- **Escape**: csak a folyamatban lévő kijelölést szünteti meg, hibapont nélkül.
- A cellák koordinátái, kijelöltsége, megtalált állapota és a feladat eredménye szövegesen is elérhető; `gridStatus` élő régió.
- Új rejtvénynél a fókusz az első cellára, befejezéskor az eredményoldal címére kerül.
- A rácsot leíró rövid billentyűzetes súgó látható, és a rácshoz `aria-describedby` kapcsolja.
- A meglévő egérkattintás, helyes/hibás útvonal, pontozás és időbüntetés hívási útja változatlan.

## Végrehajtott ellenőrzések
**PASS** – A módosított játék beágyazott JavaScript-blokkjának szintaktikai ellenőrzése (valódi `games/szokereso.html` fájltartalom).

**PASS – 15 célzott JS-szimulációs ellenőrzés** a módosított játék saját `drawGrid`, `gridKeydown`, `tap` és fókuszkezelő függvényeivel: 256 cella, egy Tab-megálló, nyílmozgás, szélek, Home/End, Ctrl+Home, Enter, Space, Escape hibapont nélkül, helyes szó megtalálása, elérhető állapotjelzés és befejezés utáni ismételt aktiválás tiltása. Ez nem teljes Chromium-böngészős teszt.

**Előkészítve, NEM FUTTATOTT:** külön Playwright böngészős regresszió `tests/szokereso-keyboard.test.cjs`: 360, 768 és 1280 CSS-pixel; 256 cella és 16 sor; egyetlen roving Tab-megálló; valódi billentyűleütések; kezdő- és végpont; eredmény; egérkompatibilitás; újraindítás; JavaScript-kivétel/konzolhiba figyelése.

## A Playwright-teszt futtatása

A Playwright külső QA-függőség; a statikus játék nem kap npm- vagy runtime-függőséget.

```sh
npm install --prefix /tmp/tanari-qa playwright@1.62.1
/tmp/tanari-qa/node_modules/.bin/playwright install chromium
NODE_PATH=/tmp/tanari-qa/node_modules node tests/szokereso-keyboard.test.cjs
```

## Elfogadási feltételek
1. A teljes játék megoldható egér nélkül; a célzott Chromium-teszt minden nézetméreten sikeres.
2. Egy cella fókuszálható Tabbal, nyilakkal az összes 256 elérhető.
3. Enter/Space végpontválasztás, Escape büntetés nélkül, hibaszámolás és segítségváltozások hibamentesek.
4. Az azonos rejtvénykód változatlan rácsot generál, a feladattartalom és pontozás egyezik a korábbi verzióval.
5. Külön rögzítendő a VoiceOver/NVDA, fizikai mobil, Firefox/Safari, 200%-os zoom és teljes tanórai próba eredménye.

## Kiadási állapot
A módosítás külön ágon és draft PR-ban van. A tananyagot, helyes válaszokat, pontozást, más játékokat és a `main` ágat nem módosítja. **Merge és éles publikálás kizárólag külön felhasználói jóváhagyással.**

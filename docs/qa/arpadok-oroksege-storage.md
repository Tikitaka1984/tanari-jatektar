# M02 – Az Árpádok öröksége: tanári tároló javítása

A betöltés a JSON szintaxisát és szerkezetét ellenőrzi, mielőtt a tanári tábla feldolgozná. A sérült tárolóérték változatlan marad; az új eredmények és a használható régi sorok ilyen esetben csak a munkamenetben használhatók. Ezt tartós szöveges figyelmeztetés jelzi. Tiltott vagy megtelt tárolónál is használható marad a tanári felület, a mentés hiánya látható.

## Hatókör és adattárolás

- Alkalmazásfájl: `jatekok/arpadok-oroksege/index.html`. Kizárólag a tanári JavaScript-blokk változott.
- Teszt: `tests/arpadok-tanari-tarolo.test.cjs`; külön Node.js/Playwright fejlesztői eszköz, nincs új játékfüggőség vagy buildfolyamat.
- Tárolókulcs: `arpad-tanar`. A meglévő JSON-formátum marad: `round`, opcionális `code`, `byCode`; kódonként eredménysortömb.
- Érvényes forduló: 1–3; kód: három számjegy és a fordulószám. A sor: biztonságos azonosító, nem üres név, 0–5999 másodperces egész végidő, négykarakteres ellenőrző kód, opcionális ellenőrzési eredmény (`v`). A határok a meglévő időbevitelt és ellenőrzést követik.
- A korábbi, kód nélküli tábla, szöveges azonosító és hiányzó/null `v` továbbra is kezelhető. A hibás `v` nem kap érvényes minősítést; a többi használható sor megmarad a munkamenetben.
- A fordulóhoz tartozó állomásszámot a játék saját `ROUNDS` adata adja. A meglévő rangsorolás és kódellenőrzés nem változott; ez a javítás nem ad kriptográfiai hitelesítést a helyi adatokhoz.
- Megszűnt a mentéskor végzett, figyelmeztetés nélküli tízkódos adatcsonkítás. Tizenkét érvényes kód megőrzését végrehajtott teszt ellenőrzi. Tárolókvóta esetén a korábban tárolt érték megmarad, és figyelmeztetés jelenik meg.
- A tanári blokk előtti és utáni teljes forrás bájtonként azonos a kiinduló main forrásával. Történelmi szöveg, megoldókulcs, pontozás, CSS és 3D látvány nem változott.

## Hibareprodukció

A javítás előtti forrás commitja: `0c07a071ded6b7d5976489ab2b2b395f7d97d6a2`. A `arpadok-oroksege-storage-baseline.json` a tényleges futtatás eredménye: 4 esetből 4 nem teljesítette az új biztonsági elvárást. Ez nem 4 JavaScript-összeomlást jelent: a hibák között hiányzó figyelmeztetés és hibás adatkezelés is szerepel.

Példa: a `arpad-tanar` kulcs alá `{"round":1,"code":"1231","byCode":{"1231":{}}}` kerüljön, majd az oldal `#tanar` nézettel nyíljon. Korábban a tábla az objektumként tárolt sorlistán tömbműveletet próbált végrehajtani. A javítás után megjelenik a tanári felület és a figyelmeztetés; az eredeti tárolóérték új kód és új eredmény felvétele után sem íródik felül.

## Végrehajtott ellenőrzések

- Eredmény: **54/54 PASS**, 0 FAIL; a részletek a `arpadok-oroksege-storage-results.json` fájlban vannak.
- Tesztelt forráscommit: `12491e19a7a44289b956544d6c9afb2d93ca549e`. A későbbi dokumentációs commit az alkalmazást és a tesztet nem módosítja. A JSON `base_commit` mezője a futtatáskor aktuális HEAD commitot jelenti.
- Alkalmazás SHA-256: `85cb83b4a000d8c32952bd593c10c3f17d65f5977460c44660b4ed578c5aeda5`.
- Utolsó mérés UTC időpontja: `2026-10-11T17:39:59.786Z`.
- Böngésző: headless Chromium `153.0.8010.0`, Playwright 1.62.1; szoftveres WebGL.
- 43 tárolási eset 360 px-en: helyes/hiányzó/hibás JSON, primitív gyökér, hiányzó mezők, hibás `round`, `code`, `byCode`, objektumként tárolt sorlista, hibás sorok, hibás ellenőrzési gyorsítótár, régi formátum, 12 kódcsoport, tiltott tároló és írási kvótahiba.
- További 4 betöltési eset 768 és 1280 px-en: helyes tábla és objektumként tárolt sorlista.
- Tanári funkciók 360, 768 és 1280 px-en: tényleges mezőbevitel, kódellenőrzés, teljes/részleges eredmények rendezése, sor törlése, ismételt Enter, időzítő indítása/szünete/visszaállítása, fordulóváltás, új kód, visszalépés, fókusz a rejtett tanári nézeten kívül, eredmények megőrzése újratöltés után.
- Teljes játék és mindhárom gyors kör: tényleges feladatvezérlők, helyes és hibás kód, befejező képernyő, újrakezdés; hibaszám, segítségszám, nyert állapot, szakasz, leltár, kész feladatok és gyors kör állapota visszaáll.
- A futtatott esetekben nem volt nem kezelt JavaScript-kivétel vagy váratlan alkalmazáskonzolhiba. Az online Google Fonts kérések szándékosan blokkoltak, a böngésző betűkészlet-helyettesítést használt; ezek hálózati hibajelzése nem alkalmazáskonzolhiba.
- A teljes dokumentum nem nyúlt túl a nézeten. A tanári panel 360 px-en jobbra túlér és vízszintesen is görgethető (`teacher: true`), 768/1280 px-en nem. Ez meglévő mobilos elrendezési korlát: a 360 px-es megjelenést nem minősítjük teljes körűen hibamentesnek. Az összehasonlító böngészőmérésben a kiinduló és a javított tanári panel görgetési szélessége egyaránt 505 px volt a 360 px-es nézetben. A javítás a CSS-t nem változtatja meg.

## Újrafuttatás

A Playwright kizárólag külső fejlesztői környezetbe telepítendő, például:

```sh
npm install --prefix /tmp/tanari-jatektar-qa playwright@1.62.1
/tmp/tanari-jatektar-qa/node_modules/.bin/playwright install chromium
NODE_PATH=/tmp/tanari-jatektar-qa/node_modules node tests/arpadok-tanari-tarolo.test.cjs
```

A teszt saját ideiglenes helyi HTTP-szervert és friss böngészőprofilokat indít. `CHROMIUM_PATH` megadásával más Chromium bináris használható; `REPORT_PATH` megadásával eltérő jegyzőkönyvútvonal választható. A javítás előtti munkafán `--baseline` csak a tárolási reprodukciót futtatja, a várható hibákat FAIL-ként dokumentálja. A teszt által a kiszolgált HTML-be illesztett vizsgálati hozzáférés nem kerül az alkalmazásfájlba.

## Elmaradt ellenőrzések és korlátok

- NEM FUTTATOTT: fizikai mobil eszközök és érintéses vezérlés; Firefox és Safari; képernyőolvasó; kézi fullscreen/hangjelzés-ellenőrzés. A rendelkezésre álló környezet headless Chromium.
- RÉSZLEGES: billentyűzetes működés és fókusz. A célzott tanári Enter/Space műveletek és visszalépés teszteltek; a teljes játék Tab/Shift+Tab sorrendje és minden vezérlő látható fókusza nincs kézzel végigellenőrizve.
- RÉSZLEGES: 3D játékmenet. A szobatárgyak aktiválása a csak a tesztben elérhető hozzáféréssel történik; a feladatok megoldása valódi képernyővezérlőkkel. A fizikai 3D bejárás nem tesztelt.
- RÉSZLEGES: dupla műveletek. A tanári ismételt Enter nem hozott létre duplikált sort; minden játékgomb gyors dupla kattintása és minden már értékelt válasz ismételt aktiválása nincs végigtesztelve.
- NEM FUTTATOTT: éles Vercel-oldal javítás utáni tesztje; az éles forrás nem módosult.
- Ismert működési korlát: sérült vagy nem írható tárolónál az új módosítások újratöltéskor elvesznek; erről a felület tartósan tájékoztat. A sérült adatok exportja vagy automatikus javítása nem része ennek a munkacsomagnak.

## Felülvizsgálat és kiadás

Az M01 54/54 tesztje és diff-felülvizsgálata után külön vizsgálat történt. A négy M02 játék tanári modulja a tárolókulcstól eltekintve azonos a kiinduló M01 modullal; saját tárolókulcsa, fordulóadatai és tényleges feladatai megmaradtak. Az M01 alkalmazásfájljának egésze nem került átmásolásra.

Külön fejlesztési ág és külön PR. Main merge, tároló-láthatóság módosítás és éles telepítés nem történt. Merge csak kifejezett felhasználói engedéllyel.

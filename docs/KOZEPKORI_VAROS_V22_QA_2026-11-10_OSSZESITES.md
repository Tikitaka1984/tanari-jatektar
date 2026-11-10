# „Építs középkori várost!” v2.2 – független regressziós tesztösszesítés
**Teszt napja:** 2026. november 10.  
**Eredeti, változatlan vizsgált játék:** `games/epits-kozepkori-varost-v22-dontesek.html` (`feature/kozepkori-varos-v22-dontesek-kovetkezmenyek`).  
**QA-fejlesztési ág:** `feature/kozepkori-varos-v22-qa-20261110`.  
**Besorolás:** nem élesíthető végleges kiadás; pilot előtti QA.

## 1. Regressziós teszt összefoglalása

| ID | Teszt | Minősítés | Bizonyíték/korlát |
|---|---|---|---|
| TC-01 | 6 történelmi fejezet/adat és 6 forráselemzés | **MEGFELELT (kódszinten)** | 6/6 téma, 6/6 forráskártya |
| TC-02 | 12 négyválaszos tudáskérdés, minden fejezetben elfogadható döntés | **MEGFELELT (kódszinten)** | 12/12, minden fejezetben legalább két történelmileg érvényes döntés, elsőben 3 |
| TC-03 | Tudáspontok: minden helyes / minden hibás / váltakozó válasz | **MEGFELELT (kódszinten)** | 60/60, 0/60, 30/60 |
| TC-04 | 1–4. fejezet: teljes, szokványos böngészős felhasználói út | **MEGFELELT** | Valós böngészős fázisváltások, 8 helyes válasz, 40/60 pont. Tesztfutam: `dfe35d4e-08b3-4df9-a387-0ffa353123c4` |
| TC-05 | 5–6. fejezet: valós böngészős felhasználói út | **MEGFELELT, TESZTADATOS ELŐFELTÉTELLEL** | Külön QA-tesztmásolaton 2 forráselemzés, 2 döntés, 2 indoklás és 4 helyes tesztválasz; 5. küldetés 10/10, 6. küldetés 10/10. Tesztfutam: `c8f5652a-8dee-47c3-8840-22d3f50894f0` |
| TC-06 | 60/60 pont és befejező jelentés | **MEGFELELT, TESZTADATOS ELŐFELTÉTELLEL** | Az 1–4. fejezet 40 pontja szintetikus fixture, az 5–6. fejezet 20 pontja valódi kattintás/kitöltés. A 6/6 végállapot és a jelentés megjelent |
| TC-07 | Minden 8 épülettípus alapszabálya, telek- és útkorlát | **MEGFELELT (kódszinten)** | 11/11 célzott, determinisztikus validációs teszt |
| TC-08 | Malom+ház → 6 ellátás, tartalékdöntés → 8, ház elvétele → 3 | **MEGFELELT (kódszinten és részben böngészőben)** | Korábbi valódi böngészőteszt és 11/11 logikai egységpróba |
| TC-09 | Mentés: épületek, pontszám, külön történelmi döntés | **RÉSZBEN MEGFELELT** | Az épületek és 10/60 pont böngészős újratöltés után megmaradtak. Egy aktív döntés megszakítás nélküli, változatlan megőrzését kódszinten igazoltuk, de külön böngészős bizonyítás szükséges |
| TC-10 | Új város indítása: minden pont/épület/döntés törlése | **NINCS LEZÁRVA** | A végső gomb megjelent, de a megerősített újrakezdést nem tudtuk tesztelni. A külön QA-reset fixture URL a Vercel előnézetben 404-et adott |
| TC-11 | Játék/Tananyag és 2D/3D nézetváltás | **MEGFELELT asztali tesztben** | 1440 px böngészős képernyő: működött; nincs igazolt CDN-kiesés-szimuláció |
| TC-12 | Billentyűzetes Tab és fókusz | **RÉSZBEN MEGFELELT** | Tab navigáció és látható fókusz megfigyelhető; Enter/Space közvetlen aktiválási regresszió nyitott |
| TC-13 | 360 / 768 / 1280 CSS px nézet | **NEM ELLENŐRIZHETŐ az adott böngészővel** | A tesztügynök nem tudta a viewport méretét átállítani; csak 1440 px ellenőrzött |
| TC-14 | WebGL-, Three.js- és Polyfork CDN-kiesés | **NINCS LEZÁRVA** | 2D alternatíva működik, de a tényleges külső függőségkiesést nem szimuláltuk |
| TC-15 | JavaScript blokk szintaxis és megőrzött régi verziók | **MEGFELELT** | Három JS blokk helyes; külön ág és külön HTML-tesztmásolatok; a v2.2 forráskód nem módosult |

## 2. Mit jelent a hatküldetéses teszt eredménye?

**Nem történt egyetlen megszakítás nélküli, emberi végigjátszás 0-tól 60 pontig.** Az első böngészős automatizálásban **4/6 küldetést** végeztünk el (40/60), utána az ügynök lépéskerete elfogyott. A teszteszköz saját záró beszámolójának „6/6 teljesítve” címe tehát **hibás**, nem tekinthető bizonyítéknak.

A későbbi QA-fájlban az első négy fejezet teljesítettségét **kifejezetten szintetikus tesztadatként** állítottuk be. Ezután az ötödik és hatodik fejezet összes szükséges lépését valóban végrehajtottuk a böngészőben. A fejlesztési funkciók mind a hat fejezetben kipróbálhatók voltak, és a játék 60/60 végállapotot mutatott. A „teljes regresszió egyetlen böngészőmenetben” továbbra is külön nyitott követelmény.

QA-másolat: `tests/kozepkori-varos-v22-qa-mission56.html?qa=mission5`.  
Az oldal figyelmeztető bannere deklarálja a szintetikus 1–4. küldetést. A tesztadatok **külön, QA-kezdetű localStorage-kulcsokon** tárolódnak.

## 3. Előzményként igazolt dinamikus következmények

A korábbi célzott böngészőpróbákon az A2 vízimalom és B2 lakóház 6 ellátási modellpontja, a 25 karakteres írásos indoklás hiányának helyes elutasítása, a tartalékolási döntés +2 mutatója és a visszavonás működése megfigyelhető volt. Az új, izolált kódszintű próba 11/11 ellenőrzésben megerősítette többek között:
- A2 malom elhelyezhető, B2 lakóház megközelíthető;
- A1 lakóház út nélkül tilos, B2 malom folyópart nélkül tilos;
- kapu az első küldetés után zárolt, a magasabb küldetésszinteknél mind a nyolc épülettípus elérhetővé válhat;
- 8 ellátás fennáll két közeli épület és az aktív tartalékolási döntés mellett; ház elvétele után a függő döntéshatás nem aktív, ellátás = 3;
- sérült vagy duplikált telekadatok alapvető formátumszűrése működik;
- mind az öt történelmi dilemma két választással rendelkezik.

A modellpontok **nem valódi középkori statisztikák**, nem képezik részét a 60 pontos történelmi tudásértékelésnek.

## 4. Asztali és mobilos ellenőrzés

Az automatizált böngészőben a 1440 px-es nézetben megfelelőnek bizonyult:
- Fejléc, fülváltás, fejezetszövegek és a forráselemző beviteli mező;
- 3D/2D nézetváltás, 2D ábra;
- építőműhely helyes zárolása 0/6 állapotnál;
- Tab fókusz és fókuszkeret.

**Nem mérhető ebből:** a 360, 768 és 1280 pixeles valódi megjelenés, mobil érintés és képernyőbillentyűzet, közvetlen Enter/Space billentyűteszt, WebGL-gyengeség vagy kikapcsolt CDN esete. A korábbi (V2.1/V2.2) reszponzív CSS létezése **nem bizonyítja** a mobilműködést.

Böngészős tesztfutam: `6bfe055a-5793-487a-8b9d-12dfcb6e85de`.

## 5. Újrakezdési teszt infrastruktúrahiba

Az új tesztfájl `tests/kozepkori-varos-v22-qa-reset.html?qa=reset` felkerült a GitHub QA fejlesztési ágra, és szintaktikailag ellenőrzött. A fájl szintetikus 6/6 teljesítést, 60/60 pontot, két épületet és aktív, mentett tartalékolási döntést inicializál a QA saját tárolójában.

Az ehhez használt, korábban létrejött **Vercel előnézet** azonban a teszteléskor még **404 NOT_FOUND** eredményt adott ezen az új elérési úton, ezért az újrakezdést és az esemény-újratöltést ebből a próbából **nem sikerült megfigyelni**. Ez a tesztoldal elérhetőségi akadálya; nem bizonyítja, hogy az eredeti játék újrakezdési funkciója hibás.

Tesztfutam: `d683486c-77ba-4afe-806e-95bc0ace59c4`.

## 6. Kötelező következő lépések, javítási prioritások

**P0 (stabil kiadás előtt feltétlenül):**
1. **Valódi mobilnézet-teszt** 360 / 768 / 1280 px szélességeken Playwright/Chromium vagy tényleges telefon/tablet használatával; vízszintes túlcsordulás, fókusz, érintés és 3D-megjelenítés.
2. **Újrakezdéses próba**: 6/6 befejezett állásból jóváhagyott teljes újraindítás; 0/60 és 0 építmény; frissítés után is maradjon.
3. **Eseménydöntés tartós mentése**: 8 modellpont + aktív döntés újratöltés után is változatlan, a napló és indoklás megmarad.
4. **Külső GLB/CDN/WebGL hiba**: a 2D nézet és a billentyűzettel használható építőrács legalább részlegesen működjön.
5. **Folyamatos teljes játékmenet**: 0/60-tól 6/6 végig, kontrollált hibásválasz- és visszalépéses utak, pontszám-kétszerezés kizárása.

**P1:** minden nyolc építmény interaktív feloldásának, valamennyi öt dilemma döntés-változtatásának és erőforrás-függőségeinek teljes böngészős tesztje; hosszabb Three.js WebGL memória-/teljesítményprofilozás.

## 7. Verzióvédelmi és publikálási nyilatkozat

- A vizsgált `games/epits-kozepkori-varost-v22-dontesek.html` **nem módosult** a QA során.
- A `feature/kozepkori-varos-v22-qa-20261110` ágon külön tesztoldalak és ez az új QA-jegyzőkönyv találhatók.
- A v2.1, v2.0, v1.x és a Tanári Játéktár eredeti HTML-jei nem módosultak.
- A tesztmásolatban használt szintetikus eredményeket minden esetben fel kell címkézni; nem használhatók tanulói teljesítményként.
- A GitHub PR **Draft**, nincs merge és nincs élesítés.

**Kiadási döntés:** _Fejlesztői prototípus: további QA szükséges. Pilot tanári felügyelettel; általános önálló tanulói kiadásra még nem kész._

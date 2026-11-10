# Építs középkori várost! – v2.0 szakmai és fejlesztési terv

**Verzió:** 2.0 / P0-alapváltozat  
**Állapot:** munkadokumentum és első javítási ütem  
**Célcsoport:** 9. évfolyam, 14–15 évesek  
**Kiindulási program:** \`games/epits-kozepkori-varost-teljes-v11.html\`  
**Új, önálló P0-prototípus:** \`games/epits-kozepkori-varost-v20-p0.html\`  
**Verzióvédelem:** a korábbi v0.x, v1.0, v1.1, a Hanza és a Tanári Játéktár főága sem módosulhat.

## 0. Cél és kizárások

**Fő cél:** a v1.1 működő, hatküldetéses szerkezetének megőrzése mellett történelmileg értékesebb, forrásalapú, kevésbé kijátszható, ellenőrizhető tanulási rendszert készíteni.

**A jelenlegi v2.0-P0 nem „kész városépítő játék”:** a valódi szabad épületelhelyezés, összetett gazdasági szimuláció, 3D-s ügynökök, többjátékos mód, tanári nyilvántartás és tanulói fiókok csak a későbbi ütemekbe kerülhetnek.

**Kor- és térbeli keret:** a fiktív közép-európai város a 13. század közepének történelmi jellegzetességeit szemlélteti. A beauvais-i 1182, brémai 1164, II. Frigyes 1238, Körmend 1244 és Hanza 1260 körüli források a korszak előzményei/környezete. Az 1345-ös frankfurti és 1361-es debreceni példa **későbbi összehasonlítás**, nem a 1250 körüli jelenet eseménye.

## 1. P0 – szakmai és technikai hibák

| P0 | Hibajelenség a v1.1-ben | Javítás / feladat | Elfogadási feltétel |
|---|---|---|---|
| P0.1a | 12 MC-kérdés helyes válasza [A,B] minden fejezetben | 12 új, kontextusra és ok-okozati kapcsolatra épülő kérdés; eredeti válaszpozíciók kiegyenlítése | Minden fejezet két kérdése valódi tény/értelmezés, nincs egyetlen előre megtanulható válaszminta |
| P0.1b | A helyes opció minden játékban ugyanott | Kérdésenként keveredő és localStorage-ban megőrzött sorrend | Új játékban más sorrend; visszatérés/újratöltés után azonos sorrend, pontozás ugyanarra a tartalomra |
| P0.1c | Első helyes döntés és abszurd téves opciók | Valós történelmi alternatívák, több elfogadható út és költség/korlát magyarázat | A feladatok között legyen több különböző történelmileg megvédhető döntés |
| P0.2 | Valódi forrás nélkül „forráselemzés” felirat | Mind a hat fejezetben pontosan azonosított eredeti forrás parafrázisa, dokumentált kép vagy tankönyvi magyarázatra épülő adatsor | Megjelenik a műfaj, az évszám, az eredet, a kérdés és az elvárt elemzési szempont; nem keverjük a szemléltető szöveget a történelmi idézettel |
| P0.3 | Kevés magyar helyszín | Körmend 1244, Lőcse, majd az 1361-es debreceni kitekintés | Legalább két ellenőrzött, időben és térben pontosan címkézett magyar példa |
| P0.4 | Csak 20 karakteres indoklásellenőrzés | Kötelező írásos forráselemzés, külön indoklás, önálló tanári rubrika | A gép csak a feleletválasztást pontozza; a forrás és az érvelés nem kap automatikusan pontot |
| P0.5a | Teljes regresszió hiánya | Valódi végigjátszás; rossz válaszok; újrakezdés; mentés; 2D/3D; CDN-hiba | A teljes tesztmátrix megfelelő bizonyítékkal zárul |
| P0.5b | 360/768/1280 px ellenőrzés hiánya | Valós viewport, kattinthatóság, overflow, fókusz, olvashatóság | Mindhárom méreten bizonyított működés |
| P0.6 | PR-lánc és verziók keveredése | Új V2 funkcióág, csak új P0 fájlok, draft PR | Egyetlen v1.x fájl sem változik; külön mentési kulcs |

### P0 alatti döntési szempontok

- A helyesen indokolt történelmi döntés nem feltétlenül csak egyetlen választási lehetőség.
- Az önkormányzati város és a gazdasági központ nem ugyanaz.
- Nem tekintünk általánosnak egy helyi kiváltságot.
- Az „eredeti történelmi forrás” és a **saját készítésű parafrázis** nem azonos: a játék utóbbit jelzi, az elsődleges azonosítást megadja.
- A nehezítés ne lexikális apróság legyen, hanem **több lépéses történelmi indoklás**.

## 2. Az egyes küldetések szakmai specifikációja

| Küldetés | Fogalom / kompetencia | Belső forrásfeladat | Magyar vonatkozás |
|---|---|---|---|
| 1. A város születése | árutermelés, munkamegosztás, településhely, városiasodás | OH, 108. o. technikai fejlődés, vízimalom – dokumentált szerkesztett adatsor | Körmend: Rába-átkelő, 1244-es kiváltság |
| 2. Városi kiváltságok | kommuna, tanács, kiváltságlevél, bíráskodás | Beauvais, 1182 – saját parafrázis | Körmend: IV. Béla 1244-es kiváltsága |
| 3. Városszerkezet | városfal, kapu, főtér, városháza | OH, 110. o., Carcassonne és a lőcsei városháza – dokumentált képi értelmezés | Lőcse / Szepesség |
| 4. Céhek | mester, legény, inas, remekmunka, versenykorlát | Frankfurt, posztókészítő céhszabályzat, 1345 – **későbbi** összehasonlítás | Debreceni és párizsi céhek OH 111. oldali összevetése csak kitekintésként |
| 5. Kereskedelem | Hanza, Levante, útvonalak, közös érdek | A Hanza közös határozatai, 1260 körül – saját parafrázis | Belső fekvésű fiktív közvetítő város |
| 6. Városi társadalom | polgár, patrícius, plebs, jogi különbségek | II. Frigyes 1238-as bécsi zsidóvédelmi rendelkezése – saját parafrázis | Debrecen: 1361-es bíróválasztási jog **későbbi kitekintés** |

**Forrásetika:** a tankönyvi szemelvények nem automatikusan szabad felhasználásúak. A játékban magyarázó, saját megfogalmazású, egyértelműen jelölt kivonatok és eredetmegjelölések szerepelnek, nem átvett egész oldalak vagy tankönyvi képek.

## 3. Az értékelés új szerkezete

**Automatikus, ellenőrizhető rész:** 6 × 2 = 12 feleletválasztós kérdés × 5 pont = 60 pont. A pontozás kizárólag a kiválasztott kérdés tartalmi azonosítóját használja, nem a képernyőn elfoglalt helyét.

**Tanári minőségi értékelés:** hat forráselemzés és hat döntési indoklás. Ajánlott **forrásonként 0–4, indoklásonként 0–4** pont, azaz 48 pont külön tanári minőségi értékelés. A tanár dönt a használatáról; ezeket a program nem összesíti az objektív 60 pontba.

| Kritérium | 0 pont | 1 pont |
|---|---|---|
| Történelmi fogalom | Hiányzik / téves | Helyesen használja |
| Forrásra vagy bizonyítékra hivatkozás | Nincs | Pontosan megjelöli a szöveg releváns elemét |
| Ok-okozati összefüggés | Nincs vagy ellentmondásos | Helyesen következtet |
| Tér- és időbeli korlát, ellenérv | Hiányzik | Megjelöl legalább egy releváns korlátot |

*A döntési indoklásokra ugyanilyen szerkezetben a bizonyíték helyét a választás várható következményének indoklása veheti át.*

**Érvényességi korlát:** a 30 karakteres mező kitöltése továbbra is csak formai minimum. Nem állítjuk, hogy ez önmagában a történelmi felkészültséget méri.

## 4. Regressziós tesztmátrix – P0.5

| Tesztazonosító | Lépések | Elvárt eredmény |
|---|---|---|
| QA-01 | 6 küldetés teljes végigjátszása | Mind a 6 lezárható |
| QA-02 | 12 helyes válasz kiválasztása a kevert listából | 60/60 objektív pont |
| QA-03 | 12 hibás válasz kiválasztása | 0/60, korrekt magyarázatok |
| QA-04 | Oldal frissítése egy félbehagyott tesztnél | Döntések, forrásjegyzet, pont és opciósorrend megmarad |
| QA-05 | Korábban ellenőrzött kérdésre visszatérés | A pontszám nem nő meg és a korábbi válasz látható |
| QA-06 | Teljes újrakezdés megerősítéssel | Minden pont és forrásjegyzet törlődik, új keverés |
| QA-07 | 2D–3D–2D nézetváltás tananyag közben | A játékállás megmarad; nem lesz üres vászon |
| QA-08 | 360/768/1280 px | Nincs elérhetetlen gomb, kritikus átfedés, vízszintes túlcsordulás |
| QA-09 | Billentyűzet: Tab, Enter, Space | Fókusz látható; kérdések megválaszolhatók egér nélkül |
| QA-10 | Polyfork vagy Three.js CDN-hiba | 2D játék továbbra is használható |
| QA-11 | Sérült, üres vagy letiltott localStorage | Nincs végzetes JS-hiba; új játék indul vagy figyelmeztetés jelenik meg |
| QA-12 | Mobilon görgetés és beviteli mezők | Billentyűzet és vezérlők nem akadályozzák a haladást |
| QA-13 | Tananyag fül, hat lecke, mintaválasz | A tartalmak elérhetők; a pontszám nem változik |
| QA-14 | Külső hivatkozások és verzióvédelem | Forráslinkek működnek; a korábbi GitHub-fájlok és mentések érintetlenek |

A QA-teszt **csak akkor „sikeres”**, ha tényleges böngészőben végrehajtottuk. A kódszintaktikai ellenőrzés és a Vercel build státusz **nem egyenértékű** a teljes felhasználói teszttel.

## 5. P1 – valódi városépítés (P0 után)

A következő külön másolatban:
1. **Telek- és útépítési térkép** (kezdetben pl. 8×8 logikai cella, 2D/3D szinkronban).
2. **Épületek elhelyezése**: piac csak járható úthoz csatlakozhat; malom megfelelő vízhez; műhely lakott övezet közelében; kapu a védővonal átjáróján.
3. **Transzparens szimulációs mutatók**: ellátás, forgalom, közösségi intézmények, biztonság és jogállás. Nem történelmi népesség- vagy gazdaságstatisztikák, hanem **kifejezetten oktatási modellértékek**.
4. **Több érvényes stratégia**: erős kereskedelmi város, kézműves központ, közepesen fejlett, de védettebb település. Egyik sem automatikusan „történelmileg legjobb”.
5. **Döntések és következmények naplója**, amely tanári megbeszélésre alkalmas.

## 6. P2 – bővítés (P1 validálása után)

- Lakosok, mesteremberek, szekerek és áruforgalom szinkronizált, visszafogott animációja.
- 3 nehézségi szint, differenciált forrásszövegek.
- Tanári vetítési nézet, feladatbank, saját pontozási beállítások.
- Akadálymentes, alacsony teljesítményű eszközökön is követhető 2D-megjelenítés.
- Opcionális export a tanárnak, **név és e-mail gyűjtése nélkül**.

## 7. Pilotértékelés

**Javasolt mérés, nem már megtörtént kutatás**: két 9. évfolyamos csoport, előzetes 6 kérdéses diagnózis és ugyanazon készségekre épülő utóteszt; a forráselemzés külön tanári rubrikája; befejezési arány; átlagos időigény; technikai hibák 360/768/1280 px.

Az objektív pontszám növekedése önmagában **nem bizonyítja** a játék oktatási hatását; az előzetes tudást és a játék ismétléseit is dokumentálni kell.

## 8. Verziókezelési szabály

- **NEM MÓDOSÍTHATÓ:** \`games/hanza.html\`, \`games/epits-kozepkori-varost-teljes-v11.html\`, a v1.0 és a v0.x változatok, az éles index vagy bármely más játék.
- **ÚJ ág:** \`feature/kozepkori-varos-v20-p0\`, a v1.1 ágról indítva.
- **ÚJ fájl:** \`games/epits-kozepkori-varost-v20-p0.html\`.
- **ÚJ mentési kulcs:** \`kozepkori-varos-v20-p0\`.
- **ÚJ dokumentum:** ez a fejlesztési terv.
- **KIADÁSI GÁT:** draft PR, csak ellenőrzött böngészős regresszió és explicit tanári jóváhagyás után készíthető stabil kiadás; nincs automatikus main-merge.

## 9. Felhasznált fő források

- Szent István Társulat: *Történelem 9.*, 15. **A polgárok világa**, 100–104. oldal (a korábban feltöltött tankönyv).
- Oktatási Hivatal: *Történelem 9.* (OH-TOR09TB), 13. **A polgárok világa**, 108–112. oldal (a korábban feltöltött tankönyv).
- Körmend Város Önkormányzata, *A városunk története*: https://www.kormend.hu/A_varos/A_varosunk_tortenete.html
- Magyar Nemzeti Levéltár: *Debrecen városi kiváltságai és 1361-es bíróválasztási joga*: https://mnl.gov.hu/mnl/hbml/hirek/neveztessek_es_cimeztessek_ezentul_a_mi_szabad_kiralyi_dobroczen_varosunknak
- ELTE HTK Történettudományi Kutatóintézet: *A városok Aranybullája*: https://tti.abtk.hu/kutatasok/lendulet/kozepkori-gazdasagtortenet/havi-szines/a-varosok-aranybullaja

*E dokumentum a fejlesztési követelményeket rögzíti; a tesztállapotot a PR és a külön QA-jegyzőkönyv mutatja. A P0-hoz tartozó fejlesztés részleges sikerét nem szabad összetéveszteni a teljes P0-lista lezárásával.*

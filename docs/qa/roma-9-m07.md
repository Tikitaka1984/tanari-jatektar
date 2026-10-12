# M07 – Irányítsd Rómát! 9.0: integrációs és regressziós QA

## Vezetői összefoglaló

A három nehézség az aktuális főágra épülő külön ágon integrálva. A normál mód tényleges 8.0 számítási modelljéhez képest **nulla eltérés**: mind a 6561 lehetséges nyolcfordulós döntéssorozat, 111 537 állapot-összevetés sikeres. A könnyű és nehéz mód megfelelő számításai szintén mind a 6561 útjukon azonosak a régi 9.0-val.

A végleges Chromium-próba **19/19 csoport PASS, 1738 ellenőrzési pont**. Mindhárom mód teljes billentyűs játéka, TXT-exportja és újrakezdése sikeres 360/768/1280 px-en. Húsz további normál sorozat mindkét verzióban natív gombokkal végrehajtva: 340 állapot-összevetés, nulla eltérés. A történelmi forrásrészek és pontozási feltételek védettek; csak az adott játék, annak manifestbejegyzése, saját tesztjei és QA-fájljai változtak.

A változtatás Draft PR-ban marad. **Merge és Vercel production telepítés nem történt.** A valódi képernyőolvasós és teljes WCAG-megfelelőség nincs igazolva; a pedagógiai profilok újraegyensúlyozása külön tanári döntés.

## Proveniencia és tesztkörnyezet

| Adat | Érték |
|---|---|
| Főági 8.0 alap | `a3669271da16286b164a8f395aa7814e236d8b47` |
| Régi 9.0 / PR #11 merge a fejlesztési ágba | `b05a5970a9b51a9c763962159608aafe52b8ccfc` |
| M07 ág | `feature/roma-9-main-integracio-m07` |
| **Ténylegesen tesztelt kód-/tesztcommit** | **`aae8a8d10d0a9459bc56d5772a29452308316477`** |
| Játék SHA-256 | `0fe04d35b1a741f5a2081c36a570cbf7ed95188cd6ef4c80fc6d5aa5c2037a6c` |
| Játék UTF-8 méret / MD5 | **106486 byte** / `a9b792a289094753c7a06b3e19c7370d` |
| Node | **v24.19.0** |
| Playwright / Chromium | **1.62.1 / 153.0.8010.0** |
| Nézetek | **360 / 768 / 1280 CSS-pixel**, 900 px magas nézet |
| Modellfutás vége | `2026-10-12T07:17:35.464Z` |
| Böngészős futás vége | `2026-10-12T07:20:28.336Z` |

A tesztek helyi HTTP-kiszolgálón futottak, a modellteszt külön DOM-stubban. A böngészőteszt minden csoportja friss böngészőkörnyezetet kapott; a húsz sorozatos összevetés szándékosan ugyanazt a két oldalt indítja újra húsz alkalommal. A Chromium valós billentyű- és egérműveleteket kap, és valódi TXT-letöltést hoz létre.

A későbbi commitok kizárólag QA-dokumentációt és mérési fájlokat tartalmazhatnak. A végső PR játékforrásának SHA-256-ja a fentivel egyezik; a GitHub-ág és a helyi Git-tree összevetése is megtörténik az átadás előtt. A tesztelt fájlok a publikált kódcommit tartalmával egyeztek, nem egy el nem mentett módosítással.

A kötelező `AGENTS.md`, `README.md`, `docs/DEVELOPMENT_RULES.md`, `docs/PEDAGOGICAL_RULES.md`, `docs/TESTING_CHECKLIST.md` elolvasva. Ezek nem változtak a korábban átvizsgált verzióhoz képest. A régi fejlesztési ágat nem merge-eltük; annak csak játékra szűkített diffjét integráltuk, megtartva a főág újabb fejlesztéseit.

## Hibajegyzék, reprodukció és javítás

| Azonosító | Eltérés / reprodukció | Javítás és bizonyíték |
|---|---|---|
| M07-R01 | Régi 9.0 normál: I. döntés az első két ülésen. Italia 81 helyett 80; a súlyozást megelőző kerekítés okozza. A 27 régi próba 24 útja eltér. | Normál `scaled()` identitás; az eredeti tartományi súlyozás/kerekítés megmarad. 6561 út és 125 szélsőértékes eset nulla eltéréssel. |
| M07-R02 | Kódvizsgálat: az easy `help=2` és normal `help=1` ugyanazt a rövid segítséget rajzolja, tényleges többletsegítség nélkül. A régi hard mód az eredeti tanári kérdést általános felszólításra cseréli. | Könnyű módban az eredeti adatok névleges birodalmi hatásai külön láthatók; minden mód az eredeti történelmi kérdést mutatja. 6/3/0 rövid segítőelem, fordulónkénti kérdésellenőrzés PASS. Szorzókat nem módosítottunk. |
| M07-R03 | Régi 9.0 360 px-en: a belépés gombja a nézeten kívül marad és nem görgethető oda. A Tab mindhárom nézetben kilép a nyitóablakból a háttérbe. | Görgethető nyitóablak, nevesített dialog, háttér `inert`, logikus kezdőfókusz és Tab-körbejárás. Mindhárom méreten natív belépés és teljes billentyűs játék PASS. |
| M07-R04 | Régi 9.0 térképen Enter, illetve döntésen Enter: az újrarajzolás után BODY-fókusz. | Térképi és tartománygomb-fókusz megőrzése, SVG group/button szemantika, döntés után Következő, új ülés/eredmény után címfókusz. Hat térképpont billentyűs aktiválása és Chromium AX-fája PASS. |
| M07-R05 | Kódvizsgálat: a nyitóablak általános Enter-kezelője a tudástári gombok natív aktiválását is elnyomhatja. A nyitóanimáció késleltetett bezárása újrakezdésnél vagy tudástárnyitásnál elronthatja a fókuszt. | Enter az adott vezérlő szerint működik; összehangolt modalitás, animáció-időzítő törlése, megfelelő fókuszcél. Tudástár és mesterséges animáció–reset verseny PASS. |
| M07-R06 | Fejlesztési 360 px-es próba: a döntés dupla kattintásának második kattintása a fókusz miatti görgetés után már a Következő gombra érkezett (`detail=2`), így az ülés véletlenül továbblépett. | A döntési és továbblépési kattintáskezelő csak az első aktiválást fogadja (`detail<=1`); a billentyűismétlés külön tiltott. Valódi dupla kattintás és nyomva tartott Enter/Space mindhárom nézeten PASS. |
| M07-R07 | A régi 9.0 TXT-je tartalmazza a nehézséget és végső mutatókat, de nem a már kiszámított végső értékelési címet/pontszámot. | Két záró összegzősor a meglévő UI-eredményből; a további TXT-szerkezet és fájlnév változatlan. Valódi letöltés mind a kilenc teljes játékban, nyolc indoklás és három reflexió ellenőrizve. |
| M07-R08 | Vizuális ellenőrzés: az új nehézségcsoport világos felirata a pergamen hátterén rosszul olvasható. | Sötét felirat saját pergamen háttéren; a tényleges számított kontraszt **8,38:1**, mind a kilenc mód/nézet kombináción mérve. Ez csak erre az új feliratra vonatkozó ellenőrzés. |

Előzetes bizonyítékok: [régi modell](roma-9-model-before.json), [régi böngészős megfigyelések](roma-9-old-browser-observations.json), [második kattintás célpontja](roma-9-double-click-before.json).

A [fejlesztési első böngészőreport](roma-9-browser-development-before.json) 8 PASS / 11 FAIL eredménye még nem a kiadási commitra vonatkozik. Kilenc csoport a tesztharness külön JavaScript-realmjeinek prototípusa miatt bukott az első adatszerkezet-összevetésnél; ezt adatszintű, az összes mezőt megtartó JSON-normalizálással javítottuk. Egy csoport a valódi mobilos R06 hibát mutatta; a hub-csoport első hibáját pontatlan tesztszelektor okozta. Ezeket nem tüntetjük fel tizenegy játékhibaként. A későbbi teljes futások már sikeresek.

## Végrehajtott modell- és tartalomtesztek

| Program / vizsgálat | Végrehajtás és eredmény |
|---|---|
| `tests/roma-9-model.test.cjs`, normál | **6561 nyolcfordulós út; 111 537 időpont; 0 eltérő út; 0 érvénytelen állapot** a tényleges 8.0-val összevetve |
| Ugyanez, könnyű és nehéz | **6561–6561 teljes út; 111 537–111 537 időpont; 0 eltérés** a régi 9.0 azonos nehézségéhez képest; minden út befejeződik |
| Szélsőértékek | **125/125 PASS**: 0/100, küszöb alatti/pontos küszöb, telítődés, késleltetés, tovagyűrűzés |
| Kerekítési próbák | **8/8 PASS**, pozitív/negatív törtértékek és felezőértékek |
| `tests/roma-9-content.test.cjs` | **18/18 PASS**: hét tartalom-/képletösszevetés, öt inline script és három teszt szintaxisa, manifest és hatókör |

A modellteszt a tényleges első inline játékscriptet futtatja. A renderelés ebben a harnessben elnyomott; az eredeti `choose`, `next`, `settle`, késleltetés és `endScreen` fut. Ez önmagában nem UI- vagy képernyőolvasós teszt. A böngészős program az összes inline scriptet és tényleges felületet ellenőrzi.

Részletes számítási elemzés és a módok eltérései: [roma-9-calculation-review.md](roma-9-calculation-review.md). Nyers eredmények: [modellreport](roma-9-model-results.json), [tartalomreport](roma-9-content-results.json).

## Végrehajtott böngészős QA

| Tesztcsoport | Terjedelem | Eredmény |
|---|---|---|
| `full-game-export-reset` | 360/768/1280 × könnyű/normál/nehéz; natív rádióválasztás, billentyűs térkép, nyolc ülés, indoklás, végső cím/pontszám, reflexió, TXT, reset | **9/9 PASS** |
| `repeated-controls` | Mindhárom nézet; valódi dupla kattintás döntésre és Következőre, nyomva tartott Enter/Space | **3/3 PASS** |
| `guides-and-opening` | Mindhárom nézet; nyitó Tab/Shift+Tab, natív Enter a tudástárra, tab/tabpanel kapcsolatok, nyilak/Home/End, keresés, Escape, visszatérés | **3/3 PASS** |
| `normal-20-sequence-regression` | 20 külön nyolcfordulós sorozat mindkét verzióban, natív egér/beviteli vezérlés; 340 összevetési pont; eredeti TXT szerkezeti összevetése | **PASS, 0 nem szándékolt számszerű eltérés** |
| `transition-race` | Mesterséges reset a 520 ms-os bezárási animáció alatt | **PASS**, a régi időzítő nem rejti el az új nyitóablakot |
| `partial-export` | Könnyű mód, első ülés; tényleges TXT-letöltés | **PASS**, nincs kitalált végső minősítés |
| `hub-integration` | Változatlan helyi hub; tényleges iframe-betöltés, nehéz mód indítása és egy döntés | **PASS** |

Összesen **19/19 csoport, 1738 ellenőrzési pont, 0 FAIL**. Az ellenőrzési pontok nem külön tanulói forgatókönyvek: az állapot-, mező-, fókusz- és exportellenőrzések is beleszámítanak. A kilenc teljes játék négy birodalmi mutatóját és mind a hat tartományát minden döntés és következő ülés/eredmény után a tényleges modellhez hasonlítja.

A szöveges/nevesített vezérlők, három segítségi megjelenítés, aktuális nehézség, aktív térképpont és látható fókusz ellenőrzött. A tudástár tartalma változatlan, a tablista egy aktív Tab-megállót és értelmezhető panelkapcsolatot kapott.

A figyelt `pageerror` és alkalmazáskonzol-hibák száma a lefutott forgatókönyvekben nulla. A nyitóablak saját függőleges görgetéssel kezelhető; a fő dokumentum a három méreten nem lóg túl. A döntési gombok és a három nézet nyitóképernyői képernyőképen is átnézve; a mért döntésfókusz 3 px-es folytonos keret. A cím kontrasztja célzottan mérve, nem általános színkontraszt-audit.

Nyers böngészős eredmények: [roma-9-browser-results.json](roma-9-browser-results.json). A húsz út pontos döntéssorozatai és végső pontszámai is ebben találhatók.

## Export és újrakezdés

Mind a kilenc teljes játék exportját tényleges letöltési eseményként fogtuk meg és szigorú UTF-8 dekódolással olvastuk. A fájlnév **`roma_birodalmi_jelentes.txt`** maradt. A report rögzíti a letöltött fájl byte-méretét és SHA-256 hashét.

Automatikusan ellenőrzött: nehézség, 8/8 tanácsülés, mind a nyolc egyedi indoklás, naplózott számítási és késleltetett következmények, végső cím/pontszám és három záróreflexió. A négy végső birodalmi érték és hat tartomány exportmezőinek változatlan adatforrását kódáttekintés igazolja; a normál teljes TXT bájtos összevetése ezeket a mezőket is lefedi. A tesztindoklások magyar ékezetet és HTML-ben különleges karaktereket is tartalmaznak; a napló szövegként jeleníti meg őket, az export megőrzi a karaktereket. A normál exportból csak a nehézség és két új összegzősor eltávolítása után a teljes TXT **bájtra azonos** a 8.0 exportjával ugyanazon döntések/indoklások/reflexiók mellett.

Újrakezdéskor a választott profil induló erőforrásai/tartományai, forduló, döntési őr, napló, várakozó hatások és tanulói szövegek visszaállnak; a nehézségválasztó címén van fókusz. A játékban nincs futásidejű pontozási óra és nincs tanulói localStorage-mentés. Ezek újrakezdési/folytatási tesztje **nem alkalmazható**, nem PASS-ként szerepel. A nyitóanimáció időzítőjének törlése külön ellenőrzött.

## Történelmi tartalom, értékelés és manifest védelme

Bájtra összevetett és változatlan:

- A nyolc szituáció, mind a 24 eredeti döntés/leírás/hatásadat, történelmi magyarázat és tanácsadói jelentés; régiónevek, koordináták, induló alapértékek.
- Minden eredeti késleltetett terv és leírás.
- A történelmi tudástár, játékszabályok és források teljes `guidePages` forrásrésze.
- A régi 9.0 nehézségi profilok teljes deklarációja.
- Az eredeti végső átlag-/minimumképlet és értékelési küszöbök, valamint az `applyRegions` súlyozása és korlátja.
- A térkép földrajzi SVG-alakzatai és feliratai; csak a körülvevő hozzáférhetőségi szerep változott.

A tartalomteszt a megváltoztatható UI-burkolatot és az új nehézségmetaadatot nem minősíti történelmi újraírásnak. Új történelmi adat vagy magyarázat nem készült. A profilok számértékeinek újraegyensúlyozása nem történt.

A `manifest.json` csak az **`iranyitsd-romat`** bejegyzés két értékében változott: UTF-8 byte-méret és MD5. Mind a **23 másik bejegyzés** azonos a kiinduló főágéval; nem állítjuk, hogy ezek teljes fájlleltárát külön újraauditáltuk. A `games/` mappában csak a Róma-játék forrása tér el a bázistól.

## Reprodukálható futtatás

A játék továbbra is statikus, keretrendszer és új runtime függőség nélkül. A Playwright külső QA-függőség; nem kell npm-telepítés a játék futtatásához.

A tároló gyökerében, az M07 ágon:

```sh
node tests/roma-9-model.test.cjs
node tests/roma-9-content.test.cjs
npm install --prefix /tmp/tanari-qa playwright@1.62.1
/tmp/tanari-qa/node_modules/.bin/playwright install chromium
NODE_PATH=/tmp/tanari-qa/node_modules node tests/roma-9-browser.test.cjs
```

A mostani futás parancsai:

```sh
"$CODEX_PRIMARY_RUNTIME_NODE" tests/roma-9-model.test.cjs
"$CODEX_PRIMARY_RUNTIME_NODE" tests/roma-9-content.test.cjs
CHROMIUM_PATH=/workspace/scratch/329af5744efa/browser-runtime/chromium NODE_PATH="$CODEX_PRIMARY_RUNTIME_NODE_MODULES" "$CODEX_PRIMARY_RUNTIME_NODE" tests/roma-9-browser.test.cjs
```

Más telepített Chromiumhoz a `CHROMIUM_PATH` teljes útvonala adható meg. A teszt mindig a tényleges verziót rögzíti. A beállítás nem kerül a játékba. A két rögzített Git-alapcommitnak helyben elérhetőnek kell lennie; sekély klónnál töltsd le a hiányzó refet/commitot.

A `REPORT_PATH` más kimeneti helyet választ; a normál futás a három QA JSON-t frissíti. A `BASELINE_REF` / `LEGACY_REF` eltérő alapot választhat, de a most igazolt futás a fenti rögzített commitokat használta. A `GAME_SOURCE` és `TESTED_COMMIT` csak elkülönített régi forrás diagnosztikájához való. A teljes modellfuttatásnál nincs `SEQUENCE_LIMIT`; a teljes böngészőfuttatásnál nincs `TEST_FILTER`.

A számítási harness nem kézzel újraírt játékmotort használ. A böngészőteszt néhány negatív őrpróbája tudatosan szintetikus (`choose/next` a játék vége után, reset az animáció alatt); ezek elkülönülnek a natív billentyű/egér alapú végigjátszásoktól. A böngészős nyolcfordulós játékban nem volt rögzített óra vagy tesztvéletlen; a játék determinisztikus döntéshatásokat használ.

Diff-ellenőrzés:

```sh
git diff a3669271da16286b164a8f395aa7814e236d8b47 -- games/iranyitsd-romat.html manifest.json
git diff --name-only a3669271da16286b164a8f395aa7814e236d8b47 -- games/
git diff aae8a8d10d0a9459bc56d5772a29452308316477 HEAD -- games/iranyitsd-romat.html manifest.json tests/
```

Az utolsó parancs a dokumentációs átadás után **üres diffet** kell adjon. A teszteredményekben található source/test hash mindegyik ténylegesen vizsgált fájlt azonosítja.

## Nem végrehajtott ellenőrzések és fennmaradó kockázat

| Ellenőrzés / kérdés | Állapot és ok |
|---|---|
| Valódi NVDA / VoiceOver | **NEM FUTTATOTT**: nincs valódi képernyőolvasós környezet. Az ARIA/Chromium AX-próba nem helyettesíti. |
| Firefox / Safari, fizikai mobil és érintés | **NEM FUTTATOTT**: csak headless Chromium állt rendelkezésre. A három szélesség böngészőnézet, nem fizikai eszközpróba. |
| Valódi 200%-os böngészőzoom / OS-nagyítás | **NEM FUTTATOTT**: külön nagyításos ellenőrzés nem történt. |
| Teljes WCAG-kontraszt-/mozgás-/megfelelőségi audit | **NEM FUTTATOTT**: csak az új nehézségi felirat kontrasztja és a célzott vezérlés ellenőrzött. A meglévő világos kiegészítő szövegek pergamenen alacsony kontrasztúak lehetnek; külön felülvizsgálat marad. |
| Betűkészletek/emoji minden platformon | **NEM IGAZOLT**: a helyi képeken néhány emoji hiányzó karakterként jelenik meg. A teljes szöveges gombnevek használhatók, az ikonok platformos megjelenítése külön ellenőrzendő. |
| Tanórai pilot, nehézségi profil pedagógiai validálása | **NEM FUTTATOTT**: nincs tanulói minta. A nehéz induló határvédelem/bizalom magasabb a normálnál; ezt nem egyensúlyoztuk újra jóváhagyás nélkül. |
| Éles Vercel / production integráció | **NEM FUTTATOTT, NEM MÓDOSÍTOTT**: a feladat csak külön ág/Draft PR létrehozására ad engedélyt. |
| Teljes, nyolcfordulós hub-végigjátszás minden módon | **NEM FUTTATOTT**: helyi iframe-betöltés, nehéz indítás és egy döntés tesztelve; a teljes játékok a saját HTML-ben futottak. |
| Mentés/folytatás sérült localStorage-ból | **NEM ALKALMAZHATÓ**: ez a játék nem tárol tanulói játékállapotot. |

A helyi HTTP-teszt külső hálózati kéréseket blokkol; az opcionális Google Fonts-konzolhibákat elkülöníti az alkalmazáshibáktól. Ez nem teljes külső erőforrás-letöltési igazolás. A játék és export a vizsgált környezetben működött.

A fenti célzott ellenőrzésben nincs nyitott számítási eltérés, dupla értékelés vagy megszakadt újrakezdés. **Teljes képernyőolvasós/WCAG-megfelelést nem állítunk.** A meglévő kontrasztkockázat és a pedagógiai profilrészlet külön döntési feladat.

Szakmai technikai támpontok: [WAI-ARIA Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [WAI-ARIA Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), [WCAG 2.2 Contrast Minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum). Ezek a célzott ellenőrzés szempontjai, nem tanúsítási nyilatkozat.

## Átadás

A forrás/manifest integráció, ismételt aktiválási és fókusz/exportjavítás, tesztcsomag és célzott feliratkontraszt külön commitokban rögzített. A mérési adatok és ez a dokumentáció külön követik őket.

A külön Draft PR a `main` ágra céloz. Az ág kizárólag az M07 hatókört tartalmazza. A végleges GitHub-link az átadásban szerepel; a beolvasztáshoz külön kifejezett felhasználói engedély szükséges.

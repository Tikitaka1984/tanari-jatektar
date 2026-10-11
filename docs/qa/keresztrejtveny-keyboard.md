# M06 – Keresztrejtvény: billentyűzetes működés és akadálymentességi fejlesztés

## Hatókör és ellenőrzött verzió

Az M06 az ellenőrzött M05 megoldás felülvizsgálata után, a főág aktuális állapotából indult, külön `fix/keresztrejtveny-billentyuzet-m06` ágon. Nem függ a még be nem olvasztott M05 forrásától.

- Kizárólagos játékforrás: `games/keresztrejtveny.html`.
- Kiinduló főág és összehasonlítási alap: `68d12ba33de612ed795605496cd09d9ce1373859`.
- Végleges tesztcommit: **`6b1f7289ee51de9910c6caf8ce894a27d38bb539`**.
- Chromium **153.0.8010.0**, Playwright **1.62.1**, headless, friss böngészőkörnyezet minden tesztesethez.
- Nézetek: **360, 768, 1280 CSS-pixel**, 900 px magas nézet.
- Teljes teszt vége: **2026-10-11 19:07:45 UTC**.
- Tesztelt HTML SHA-256: `ec86c2f5c8a67c943d76bab74fd816f58d745a0dd90eb056645fee66ba9b5b8a`.

A további QA-commit kizárólag dokumentációt és mérési eredményeket tartalmaz. A feladatbank, generálás, pontozás, nehézségi felépítés, történelmi szöveg és más játékok forrása nem változott. A projekt statikus HTML/CSS/JavaScript maradt, új futásidejű függőség nélkül.

## A jelenlegi játékszerkezethez igazított vezérlés

A rács a meglévő egybetűs natív válaszmezőket használja; a meghatározások natív gombok lettek. Nem került be új feladat- vagy játékmód.

| Billentyű / művelet | Működés |
|---|---|
| Tab / Shift+Tab | Évfolyam, témakör, indítás, egy aktuális rácsmező, eszközgombok, meghatározások. A rácsnak egy Tab-megállója van. |
| Nyilak | A meglévő szomszédos betűmezők között lépnek a korábbi mozgási szabály szerint. |
| Betűbevitel | A jelenlegi betűellenőrzés és automatikus továbblépés. Fókuszba kerüléskor a meglévő betű kijelölt, így a metszés felülírható. |
| Home / End | Az aktív szó első / utolsó betűje. |
| Ctrl+Home / Ctrl+End | A rács DOM-sorrendben első / utolsó válaszmezője. |
| Enter / Space a metszésben | Ugyanaz az irányváltás, mint a korábbi egérkattintás. Az automatikus billentyűismétlés nem vált újra. |
| Escape a rácsban | Az aktív meghatározásra lép. |
| Enter / Space a meghatározáson | A szó kezdőmezőjére lép. |
| Backspace | A korábbi törlés és visszalépés, a programozott állapotjelzés frissítésével. |
| Tab / Shift+Tab a megerősítésben | A két gomb között körbejár; a háttér ideiglenesen `inert`. |
| Escape a megerősítésben | Megszakítás művelet nélkül, fókusz vissza a megnyitó gombra. |

A válaszmezők 1-alapú koordinátát, a kapcsolódó meghatározásokat és a billentyűs súgót kapják elérhető névként/leírásként. A `grid → row → gridcell → input` szerkezet, az aktív cella, az aktív és megfejtett meghatározás, illetve a hibás betű `aria-invalid` állapota ellenőrizhető. A meglévő színjelzések mellett szöveges élő visszajelzés is megjelenik. A betűmezők sötét, 3 px-es belső fókuszkeretet kapnak; a téma megmarad.

Indításkor és újrakezdéskor az aktuális mező, befejezéskor az eredményoldal címe, beállításokhoz visszalépéskor a korábbi évfolyamgomb kap fókuszt. A korábbi 50 ms-os késleltetett fókuszkérés helyett a látható nézet azonnali fókuszt kap. A befejezés őre és az egyszer felhasznált megerősítési callback megakadályozza a késői újraértékelést.

## Hibajegyzék és javítások

| Azonosító | Főági reprodukció / kiinduló állapot | Javítás és ellenőrzés |
|---|---|---|
| M06-R01 | Tab: az évfolyamgombon Enter; az újrarajzolás után a fókusz BODY. A meghatározások kattintható `div` elemek, billentyűzettel nem aktiválhatók. | Stabil gombazonosítók és fókuszvisszaállítás; natív meghatározásgombok. Teljes billentyűzetes előkészítés és megfejtés PASS. |
| M06-R02 | A `role=grid` alatt nincsenek ARIA-sorok, a válaszmezők általános, 0-alapú nevet kaptak és minden mező Tab-megálló. | Sor/cella tulajdonosi szerkezet, kapcsolódó meghatározások, 1-alapú név, egy mozgó Tab-megálló, szöveges állapotok. Mindhárom nézet PASS. |
| M06-R03 | Írj be egy hibás betűt, majd kattints az Új elrendezésre. A modell `errors=0`, a felső hibaszám továbbra is 1. | Indításkor a HUD hibaszáma is nullázódik. Modell, HUD, óra, hibajelölések és fókusz újrakezdési tesztje PASS. A pontozási képlet nem változott. |
| M06-R04 | Nyomtatási megerősítésben kérj megoldókulcsot. Ezután nyisd meg a Megoldás megerősítését, és válaszd a megszakítást. A korábbi nyomtatási címke és callback megmarad; váratlan második nyomtatás indul. | Külön, minden bezáráskor törölt megerősítési/megszakítási callback. Nyomtatási ágak, Escape és az utána megnyitott megoldásablak PASS. |
| M06-R05 | Megerősítés megnyitásakor a fókusz a háttérgombon marad; nincs modalitás, Escape-kezelés és fókusz-visszatérés. | Megnevezett modal dialog, fókuszátadás, Tab-körbejárás, háttér `inert`, Escape és visszatérés. Mindhárom méret PASS. |
| M06-R06 | Egy kitöltött, egykarakteres mezőre visszalépve a meglévő betű nincs kijelölve, ezért a következő beírt betűt a `maxlength=1` blokkolja. A metszéseken végiggépelt teljes megfejtés megakad. | Fókuszba kerüléskor a meglévő karakter kijelölése. Mindhárom nézet teljes játéka és mind a nyolc témakör tisztán billentyűzetes megfejtése PASS. |
| M06-R07 | A befejező függvényben nincs egyszeri értékelési őr; a befejezett válaszmezők nem csak olvashatók. Ez kódáttekintéssel azonosított késői eseménykockázat. | `G.done` őr a bevitelnél, navigációnál és befejezésnél; válaszmezők lezárása. Szándékosan későn küldött input és újabb `finish(true)` nem módosítja az eredményt. |

Főági böngészős bizonyítékok:

- [keresztrejtveny-keyboard-baseline.json](keresztrejtveny-keyboard-baseline.json): az ARIA-szerkezet és a modal-fókusz új elfogadási tesztje **6/6 csoportban FAIL** a régi forráson; ez két hiányosság három méreten, nem hat külön hiba.
- [keresztrejtveny-baseline-diagnostics.json](keresztrejtveny-baseline-diagnostics.json): BODY-ra elvesző beállításfókusz; nullázott modell mellett 1-es HUD; blokkolt karakterfelülírás; egy nyomtatás helyett két stub-hívás a megerősítések egymásutánján.

Az első fejlesztési próbában 18 csoportból 14 PASS és 4 FAIL volt: a három teljes játék és a nyolc témakör megfejtése az R06 beviteli akadályon bukott el. A munkapéldány próba-naplója: [keresztrejtveny-first-development-run.txt](keresztrejtveny-first-development-run.txt). Ez előzetes fejlesztési állapot, nem a kiadási commit eredménye.

A dupla egérkattintás kezdeti tesztje tévesen eredménycím-fókuszt várt a második kattintás után is. A második kattintás már a bezárt modal mögötti oldalra érkezik, és a böngésző BODY-fókusza szabályos egérműködés. A tesztet úgy pontosítottam, hogy ilyenkor ne lehessen rejtett modalon fókusz, és ne legyen dupla értékelés. A billentyűzetes befejezés továbbra is kötelezően az eredménycímre fókuszál. Az előzetes 18 PASS / 1 FAIL futás megmaradt: [keresztrejtveny-pointer-focus-review.json](keresztrejtveny-pointer-focus-review.json). Játéklogikát e tesztpontosítás miatt nem módosítottam.

## Végrehajtott tesztek

A végleges eredmény: **19/19 csoport PASS, 235 ellenőrzési pont, 0 FAIL**.

| Tesztcsoport | Nézet / terjedelem | Eredmény |
|---|---|---|
| `aria-structure` | 360 / 768 / 1280: sorok, cellák, egy Tab-megálló, natív meghatározások, érvényes leíráskapcsolatok, Chromium AX-fa | **3/3 PASS** |
| `keyboard-workflow` | 360 / 768 / 1280: kizárólag billentyűzetes feladatválasztás; minden nyíl; Enter/Space; Escape; Home/End és Ctrl+Home/End; Tab/Shift+Tab; 3 px-es fókusz | **3/3 PASS** |
| `reset-display` | 360 / 768 / 1280: hibás/helyes/törölt betű, `aria-invalid`, azonos hibás bevitel egyszeri számlálása, Backspace, segítség és 20 mp büntetés, új elrendezés teljes állapot- és HUD-nullázása | **3/3 PASS** |
| `full-game` | 360 / 768 / 1280: natív meghatározásgombok és betűgépelés, teljes önálló megfejtés, eredményfókusz, lezárt bevitel, késői eseményőr és eredményoldali újrakezdés | **3/3 PASS** |
| `dialog-focus` | 360 / 768 / 1280: modal-szerep, háttér `inert`, Tab/Shift+Tab, Escape, fókusz-visszatérés, feladás és egyszeri callback | **3/3 PASS** |
| `print-and-transition-race` | 1280: feladatlap / megoldókulcs ág, Escape nem nyomtat, megszakítás nem örököl callbacket, gyors újrakezdés–beállításváltás | **PASS** |
| `all-eight-topics` | 1280: ókor, középkor, kora újkor, reformkor, dualizmus, világháborúk, hidegháború, jelenkor; teljes billentyűs megfejtés mindegyiken | **PASS, 8/8 témakör**, 13–14 bejegyzés/rejtvény |
| `double-activation` | 1280: valódi dupla egérkattintás, nyomva tartott natív Enter/Space, egyszeri segítség és értékelés | **PASS** |
| `main-comparison` | 1280: 8 azonos tesztmaggal generált teljes elrendezés; egér/beviteli vezérléses játék hibával és segítséggel a régi és új forráson | **PASS, azonos feladatok és eredmény** |
| Forrásszintaxis | Node v24.19.0 `vm.Script`: a játék inline JavaScriptje és a CJS teszt | **PASS** |
| Védett forrásrészek és hatókör | Összevetés a főággal | **6/6 PASS** |
| Képernyőképek vizuális átnézése, dokumentumszélesség | 360 / 768 / 1280 | **PASS, nincs dokumentumtúllógás** |

A rács szűk nézetben továbbra is a saját kártyáján belül vízszintesen görgethető; a fő dokumentum nem lóg túl. A nyílmozgás és a meghatározás kiválasztása az aktuális betűmezőre fókuszál. A megmaradt rácsméretet és a belső görgetést nem állítjuk teljes mobilos újratervezésnek.

A betöltés, játékmenet, nézetváltás, újrakezdés és befejezés során a teszt figyeli a `pageerror` eseményeket és az alkalmazás konzolhibáit: a figyelt folyamatokban nincs ilyen eltérés. A 235 ellenőrzési pont nem 235 külön tanulói forgatókönyv.

Nyers eredmények: [keresztrejtveny-keyboard-results.json](keresztrejtveny-keyboard-results.json), [keresztrejtveny-syntax-results.json](keresztrejtveny-syntax-results.json), [keresztrejtveny-content-integrity.json](keresztrejtveny-content-integrity.json).

## Tartalom, megoldókulcs és pontozás változatlansága

A `const WORDBANKS` és `const PICK` közötti teljes forrásrész **bájtra azonos** a főággal: mind a nyolc szóbank, a meghatározások, válaszok, évfolyamok, elhelyezési és generálási szabályok változatlanok. A nyomtatható feladatlap és megoldókulcs előállító függvényei is bájtra azonosak.

Külön forrásösszevetés igazolja a betűellenőrzés és hibaszámlálás magját, a segítség kiválasztását és 20 mp-es időbüntetését, valamint a végső eredmény és értékelési küszöbök változatlanságát. A `G.done` őr a már lezárt értékelést védi, pontozási szabályt nem változtat.

A futás közbeni főági összevetésben mind a nyolc generált rejtvény teljes adatszerkezete egyezett. Az egérrel elért összehasonlító eredmény mindkét forráson: **1 hiba, 1 segítség, 20 másodperc, 14 bejegyzés, önálló befejezés**. Az óra és a véletlen csak a tesztkörnyezetben rögzített; a játék nem kapott új magvetési vagy kódos funkciót.

Ezen az ágon a `games/` mappában csak a keresztrejtvény forrása változott. Ellenőrizhető diff:

```sh
git diff 68d12ba33de612ed795605496cd09d9ce1373859 -- games/keresztrejtveny.html
git diff --name-only 68d12ba33de612ed795605496cd09d9ce1373859 -- games/
```

## Reprodukálható tesztfuttatás

Az M06 ágon, a tároló gyökerében, külső QA-függőséggel:

```sh
npm install --prefix /tmp/tanari-qa playwright@1.62.1
/tmp/tanari-qa/node_modules/.bin/playwright install chromium
git fetch origin main
BASELINE_REF=68d12ba33de612ed795605496cd09d9ce1373859 NODE_PATH=/tmp/tanari-qa/node_modules node tests/keresztrejtveny-keyboard.test.cjs
```

A mostani futás saját Chromium-útvonallal:

```sh
CHROMIUM_PATH=/workspace/scratch/329af5744efa/browser-runtime/chromium NODE_PATH="$CODEX_PRIMARY_RUNTIME_NODE_MODULES" "$CODEX_PRIMARY_RUNTIME_NODE" tests/keresztrejtveny-keyboard.test.cjs
```

Az `origin/main` forrása a Gitből betöltött összehasonlítási alap; `BASELINE_REF` rögzítheti az alapcommitot. A JSON mindkét verzió hashét és a tényleges böngészőverziót tartalmazza. A főági elfogadási hiányosságok ismételt futtatása:

```sh
git show 68d12ba33de612ed795605496cd09d9ce1373859:games/keresztrejtveny.html > /tmp/keresztrejtveny-main.html
GAME_SOURCE=/tmp/keresztrejtveny-main.html TESTED_COMMIT=68d12ba33de612ed795605496cd09d9ce1373859 TEST_FILTER='^(aria-structure|dialog-focus)$' REPORT_PATH=/tmp/keresztrejtveny-baseline.json NODE_PATH=/tmp/tanari-qa/node_modules node tests/keresztrejtveny-keyboard.test.cjs
```

Ettől **szándékosan sikertelen** futás várható a régi forráson. A `GAME_SOURCE` a vizsgált HTML-t, a `TEST_FILTER` a csoportokat, a `REPORT_PATH` a kimenetet választja. Teljes ellenőrzéskor ezeket ne állítsd be. A `TESTED_COMMIT` csak ilyen elkülönített alapforrás-próbához szükséges; a szokásos futás automatikusan rögzíti a HEAD-et és a betöltött forrás hashét.

A teszt helyi HTTP-kiszolgálóról tölt be. A történelmi válaszokat csak a teszt olvassa ki; a megfejtés natív gombaktiválással és billentyűbevitellel történik. A késői input és közvetlen befejezési hívás szándékosan szintetikus őrteszt; a gyors átmeneti versenyhelyzet is szintetikus. A nyomtatás `window.print` stubbal ellenőrzött elágazás, nem operációs rendszeres nyomtatási próba. Az óra és a tesztmag a pontos összevetés miatt rögzített, valódi hosszú időzítőteszt nem futott.

## Nem végrehajtott ellenőrzések és fennmaradó kockázat

- **NEM FUTTATOTT:** valódi NVDA/VoiceOver felolvasás; Firefox/Safari; fizikai mobil és érintéses használat; valódi 200%-os zoom; operációs rendszeres nyomtatás/PDF; tanórai próba; teljes WCAG-megfelelőségi audit. Nincs megfelelő helyi eszköz vagy résztvevő ezek hiteles ellenőrzéséhez.
- Az ARIA/Chromium AX-struktúra ellenőrzése nem bizonyítja a felolvasás érthetőségét vagy az élő visszajelzések megfelelő gyakoriságát. Ezért a képernyőolvasós használhatóság nem tekinthető lezárt ellenőrzésnek.
- A külső Google Fonts-kérések a helyi próbákban blokkolva voltak, tartalék betűtípusokkal teszteltünk; az ilyen hálózati hibákat elkülönítettük az alkalmazás hibáitól.
- A meglévő színkontraszt, a 30 px-es betűmezők érintési mérete és a belső rácsgörgetés teljes WCAG/mobil-auditja nyitott. Az arculatot és a rácsméretezést a feladat nem írta elő áttervezni.
- A hub iframe-jén és az éles Vercel-oldalon külön integrációs teszt nem futott. Az éles oldalt nem módosítottuk.
- A keresztrejtvény nem ment tanulói állapotot; localStorage-mentés, folytatás és sérült mentés tesztje **nem alkalmazható**. Új tárolási formátum nem került be.

Módszertani támpontok: [WAI-ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), [Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/), [Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). A fejlesztés célzott akadálymentességi javítás, nem teljes WCAG-tanúsítás.

## Átadás

Az M06 külön **Draft Pull Requestben** marad felülvizsgálatra. A célzott tesztcsomagban nincs nyitott blokkoló hiba. Merge, közvetlen main-módosítás, Vercel-élesítés és tároló-láthatóság módosítása nem történt. A beolvasztás külön felhasználói engedélyhez kötött; a manuális képernyőolvasós ellenőrzés külön hátralévő feladat.

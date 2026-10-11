# M05 – Szókereső: független PR #18 felülvizsgálat

## Hatókör és ellenőrzött verzió

A meglévő [PR #18](https://github.com/Tikitaka1984/tanari-jatektar/pull/18) teljes diffjét ellenőriztem. Az alapfejlesztést nem készítettem el újra; a feltárt eltérések javítása ugyanazon a `fix/szokereso-billentyuzet-m05` ágon történt.

- Játék: `games/szokereso.html`.
- Kiinduló PR-commit: `7356989f98a61af606f81ae6da54626fac251d98`.
- Végleges böngészős tesztcommit: **`0f5d57016bb89096288ed96da028c640c51ef923`**.
- Összehasonlított főág: `68d12ba33de612ed795605496cd09d9ce1373859`.
- Chromium **153.0.8010.0**, Playwright **1.62.1**, headless, friss böngészőkörnyezet minden tesztesethez.
- Szélességek: **360, 768, 1280 CSS-pixel**, 900 px magas nézet.
- Független teszt vége: **2026-10-11 19:04:37 UTC**.
- A tesztelt HTML SHA-256: `b0926d80b135ca808b9d4e3d22e149a70c168c03e26cb11b90406c4f4885ef9a`.

A későbbi QA-commit kizárólag dokumentációt és mérési eredményeket tartalmaz; a fenti forrás- és tesztverziót nem módosítja.

## Hibajegyzék, reprodukció és javítás

| Azonosító | Reprodukció és tényleges eltérés a kiinduló PR-ben | Elvárt működés és javítás |
|---|---|---|
| M05-R01 | A nyitóoldalon fókuszálj egy évfolyam-, témakör-, nehézség-, hossz- vagy nyomtatási beállításgombra, majd Enter. Az újrarajzolt gomb eltűnik a DOM-ból, a fókusz a BODY-ra kerül. | A `paint()` megőrzi a vezérlőcsoportot és a gomb helyét, majd az új elemre visszaállítja a fókuszt. Mind a hat csoport ellenőrizve. |
| M05-R02 | Indíts rejtvényt, majd billentyűzettel aktiváld a Beállítások gombot. A fókusz a rejtett játékban maradhat vagy a BODY-ra kerül. | A visszatérés az aktív évfolyamgombra fókuszál. A teljes játék és újrakezdés után is ellenőrizve. |
| M05-R03 | A rácsban tartsd nyomva az Entert vagy a Space-t. Az automatikus ismétlés kiválasztja, majd megszakítja ugyanazt a kezdőpontot. | A `gridKeydown()` az aktiváló billentyűk `event.repeat` eseményeit figyelmen kívül hagyja. A nyilak ismétlését nem tiltja. |
| M05-R04 | 360 px széles nézetben indíts rejtvényt; mérd a dokumentum szélességét. A kiinduló PR-ben 362 px. | A mobilos egyoszlopos `.play` rács `minmax(0,1fr)` méretezést kapott. A dokumentum szélessége a javítás után 360 px. |

R01, R02 és R04 a korábbi főági felépítéshez is kapcsolódó technikai eltérés; R03 a PR billentyűzetes aktiválásának ismétlési hibája. A téma, színvilág, szólista és feladatszöveg nem változott.

Az első független futás: **15 tesztcsoportból 5 PASS, 10 FAIL**, 1733 elért ellenőrzési pont. A tíz sikertelen csoport a fenti négy ok több módban és méreten történő előfordulása, nem tíz külön hiba. Nyers bizonyíték: [szokereso-review-before.json](szokereso-review-before.json). Az eredeti, szűkebb PR-teszt már ekkor 60/60 ellenőrzést teljesített; a teljes játékmenet és a beállításfókusz ellenőrzése ezért külön tesztben szerepel.

## Végrehajtott ellenőrzések

| Ellenőrzés | Méret / mód | Eredmény |
|---|---|---|
| Az eredeti `tests/szokereso-keyboard.test.cjs` futtatása | 360 / 768 / 1280 | **PASS, 60/60 ellenőrzési pont** |
| 16 ARIA-sor, 256 cella, egy Tab-megálló, mind a 256 cella bejárása valódi nyílbillentyűkkel | Mindhárom méret, klasszikus és nehéz | **PASS, 6 csoport** |
| Nyilak és rácsszélek; Enter, Space, Escape; Home/End, Ctrl+Home/End; Tab és Shift+Tab; látható fókusz | Mindhárom méret, mindkét mód | **PASS** |
| Kezdőpont, helyes szó, hibás szakasz, nem egyenes szakasz, megszakítás, segítség, teljes megfejtés | Mindhárom méret, mindkét mód | **PASS, 6 teljes játékmenet** |
| Hibaszám, sorozat, 20 mp segítségbüntetés, végső eredmény, újrakezdés és visszatérés | Mindhárom méret, mindkét mód | **PASS** |
| Beállításgombok fókuszának megtartása | 6 vezérlőcsoport | **PASS** |
| Nyomva tartott Enter/Space, valódi dupla kattintás egy szó végpontjára | 360 px | **PASS: egy találat, nincs dupla pontozás** |
| Azonos kód, szólista és rács összevetése a főággal | 4 évfolyam × 3 témakör × 2 hossz × 2 mag = 48 rejtvény | **PASS, teljes adatszerkezet egyezése** |
| Egérrel megoldott játék hibával és segítséggel, összevetés a főági eredménnyel | 1280 px | **PASS, minden rögzített eredménymező egyezik** |
| ARIA tulajdonosi szerkezet és Chromium akadálymentességi fa | Mindhárom méret, mindkét mód | **PASS; nem valódi képernyőolvasó-próba** |
| JavaScript-kivételek és alkalmazáskonzol-hibák figyelése | Betöltés, játék, újrakezdés, befejezés | **PASS a figyelt folyamatokban** |
| Vízszintes dokumentumtúllógás; képernyőképek vizuális átnézése | 360 / 768 / 1280 | **PASS, nincs dokumentumtúllógás** |
| HTML-be ágyazott JS és mindkét teszt szintaxisa | Node v24.19.0 `vm.Script` | **PASS** |

A kibővített teszt végleges eredménye: **15/15 tesztcsoport PASS, 1759 ellenőrzési pont, 0 FAIL**. Ez nem 1759 külön tanulói forgatókönyv; az összes cella elérésének ellenőrzése is beleszámít.

Bizonyítékok:

- [szokereso-keyboard-results.json](szokereso-keyboard-results.json): az eredeti program stdout-eredménye, böngésző, commit és hash; a futás végét a napló fájlideje jelöli.
- [szokereso-review-results.json](szokereso-review-results.json): minden független csoport, részletes eredmény, forrás-, teszt- és főági hash.
- [szokereso-syntax-results.json](szokereso-syntax-results.json): tényleges szintaxisellenőrzés.
- [szokereso-content-integrity.json](szokereso-content-integrity.json): a védett tartalom ellenőrzése.

Az első alapértelmezett Chromium-indítás a helyi környezetből hiányzó Playwright-böngésző miatt meghiúsult, még a játékteszt előtt. Ez környezeti indítási hiba, nem játékhiba és nem PASS. Az eredeti program csak egy opcionális `CHROMIUM_PATH` indítási kapcsolót kapott; tesztlogikája változatlan.

## Tartalom- és pontozásvédelem

A főági HTML-lel összevetve **7/7 tartalmi ellenőrzés PASS**:

- A magvetéses generátor, a 428 elemes szóbank, az évfolyam-/témakör-/hosszbeállítások és a rejtvénykód teljes forrásrésze bájtra egyezik.
- A rácsgenerálási függvények és a nyomtatható feladatok/megoldókulcsok forrása bájtra egyezik.
- A végső eredmény és értékelési küszöbök változatlanok; az egyetlen hozzáadott eredményoldali művelet a cím fókuszálása.
- A segítség kiválasztási szabálya és 20 másodperces büntetése változatlan.
- A szófelismerés, találat-, hiba- és sorozatszámlálás öt lényegi utasítása pontosan egyezik.
- A `games/` mappában kizárólag `games/szokereso.html` módosult ezen az ágon.

Ezt a 48 generált feladat és az egérrel elért eredmény futás közbeni összehasonlítása is alátámasztja. A diff ismételt ellenőrzése:

```sh
git diff 68d12ba33de612ed795605496cd09d9ce1373859 -- games/szokereso.html
git diff 7356989f98a61af606f81ae6da54626fac251d98 -- games/szokereso.html
git diff --name-only 68d12ba33de612ed795605496cd09d9ce1373859 -- games/
```

## Reprodukálható futtatás

A Playwright külső QA-függőség, nem kerül a statikus alkalmazásba. A tároló gyökerében, az M05 ágon:

```sh
npm install --prefix /tmp/tanari-qa playwright@1.62.1
/tmp/tanari-qa/node_modules/.bin/playwright install chromium
git fetch origin main
NODE_PATH=/tmp/tanari-qa/node_modules node tests/szokereso-keyboard.test.cjs
BASELINE_REF=68d12ba33de612ed795605496cd09d9ce1373859 NODE_PATH=/tmp/tanari-qa/node_modules node tests/szokereso-review.test.cjs
```

Más telepített Chromium esetén mindkét parancshoz megadható `CHROMIUM_PATH=/abszolut/ut/chromium`. A mostani futás ezt használta:

```sh
CHROMIUM_PATH=/workspace/scratch/329af5744efa/browser-runtime/chromium NODE_PATH="$CODEX_PRIMARY_RUNTIME_NODE_MODULES" "$CODEX_PRIMARY_RUNTIME_NODE" tests/szokereso-keyboard.test.cjs
CHROMIUM_PATH=/workspace/scratch/329af5744efa/browser-runtime/chromium NODE_PATH="$CODEX_PRIMARY_RUNTIME_NODE_MODULES" "$CODEX_PRIMARY_RUNTIME_NODE" tests/szokereso-review.test.cjs
```

A független program alapértelmezetten a Gitből olvassa az `origin/main` játékforrását, és rögzíti az alapcommitot. A `BASELINE_REF` rögzítheti a fenti kiindulópontot. A `BASELINE_ROOT` egy másik Git-munkapéldányt választhat. A `REPORT_PATH` más kimeneti helyet jelölhet; alapértelmezetten a QA JSON frissül.

A program helyi HTTP-kiszolgálót használ. A válaszok elhelyezkedését csak a teszt olvassa ki, a játékot valós billentyű- és egérműveletekkel vezérli. Az óra rögzítése a büntetés és a főági pontozás pontos összevetését segíti; valódi hosszan futó időzítőmérés nem történt. Az eredeti kisebb teszt néhány előkészítési lépésben közvetlen játékfüggvényt hív, ezért a független teszt teljes billentyűzetes megoldása külön bizonyíték.

## Nem végrehajtott ellenőrzések és korlátok

- **NEM FUTTATOTT:** valódi NVDA/VoiceOver felolvasás, Firefox/Safari, fizikai mobil és érintéses használat, operációs rendszeres nyomtatás/PDF, valódi 200%-os böngészőzoom, tanórai próba és teljes WCAG-megfelelőségi audit. Ezekhez nem állt rendelkezésre megfelelő eszköz vagy résztvevő.
- A külső Google Fonts-kérések a helyi HTTP-tesztben szándékosan blokkolva voltak; a betűtípusok tartalékaival teszteltünk. Ezek hálózati hibáit a figyelő elkülöníti az alkalmazás hibáitól; az erőforrásletöltések teljes sikerét nem állítjuk.
- A hub iframe-jén és az éles Vercel-oldalon külön integrációs teszt nem futott. A teszt a játék saját HTML-jét ellenőrzi.
- Ez a játék nem ment tanulói állapotot a localStorage-ba; mentés/folytatás és sérült mentés tesztje **nem alkalmazható**, új tárolási működés nem került be.
- A jelenlegi arculat színkontrasztjának és a kis mobilos betűcellák érintési méretének teljes vizsgálata kívül esik ezen a célzott ellenőrzésen.

Szakmai támpontok: [WAI-ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), [Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/). A szerkezeti teszt nem jelent képernyőolvasóval igazolt vagy teljes WCAG-tanúsított megfelelést.

## Átadási döntés

**A PR #18 a célzott technikai hatókörben beolvasztásra javasolható.** A végrehajtott Chromium-tesztekben nincs fennmaradt blokkoló eltérés. A valós képernyőolvasós ellenőrzés nyitott feladat; teljes akadálymentességi megfelelőség nem állítható. A PR megmarad külön ágon; merge és éles kiadás nem történt, ezek külön felhasználói engedélyt igényelnek.

# M04 – A titkos levéltár: fókusz- és párbeszédpanel-javítás

## Hatókör
- Alkalmazás: `games/leveltar.html`
- Reprodukálható böngészős regressziós teszt: `tests/leveltar-panel-focus.test.cjs`
- Kizárólag technikai változtatás: a kérdések, megoldókulcsok, pontozási szabályok és történelmi szövegek nem módosultak.
- A dokumentált H01 önkéntes örökváltság tartalmi javítás **nem része** ennek a PR-nak.

## Hiba és javítás
A két korábbi `setTimeout(() => document.getElementById(...).focus(), 100)` akkor is lefuthatott, amikor a korábbi panel inputja már nem létezett. Ez gyors panelváltásnál `null.focus` kivételt okozott.

Az új `focusPanelField` időzítése panelváltáskor, bezáráskor és játékzáráskor megszakítható. A callback csak aktív panel, létező, engedélyezett és csatlakoztatott mező esetén fókuszál.

A panel `role="dialog"`, `aria-modal="true"` és a panel címéhez kötött név attribútumot kapott. Megnyitáskor fókusz kerül a bezáró gombra, az évszám-/névpanelen 100 ms után a célmezőre; megoldás után a következő teendő gombjára. Escape bezárja a panelt, Tab és Shift+Tab a látható panelvezérlők között marad. Bezáráskor a fókusz visszakerül a megfelelő (újrarenderelt) zárra vagy a vasajtóra. A befejező képernyő címe kap fókuszt.

## Elvégzett ellenőrzések
- **PASS:** a játék egyetlen beágyazott JavaScript-blokkjának szintaktikai ellenőrzése a létrehozott fájl tartalmából.
- **PASS:** izolált JavaScript-szimuláció a játék tényleges függvényeivel (8 célzott ellenőrzés): gyors évszám→név váltás; függőben maradt időzítő megszűnése; a névmező megfelelő fókusza; panelbezárás; a fókusz visszaadása; gyors bezárás; Escape viselkedés; dialógus-állapot. Ez **nem** Chromium-böngészős teszt.
- **Előkészítve, NEM FUTTATOTT ebben a környezetben:** Playwright böngészős teszt három nézetméreten (360, 768, 1280 px). Ellenőrzi a gyors panelváltást, évszám- és névfókuszt, Escape-et, Tab-körbeforgást, visszatérési fókuszt, gyors bezárást, befejező képernyőt és nem kezelt JavaScript-hibákat.

## Playwright újrafuttatás
A játék működéséhez nincs szükség npm-re vagy buildfolyamatra. Csak a különálló QA-környezetben:

```sh
npm install --prefix /tmp/tanari-qa playwright@1.62.1
/tmp/tanari-qa/node_modules/.bin/playwright install chromium
NODE_PATH=/tmp/tanari-qa/node_modules node tests/leveltar-panel-focus.test.cjs
```

## Hátralévő ellenőrzések
- A fenti Playwright-teszt tényleges futtatása, konzolhiba-monitorozással.
- Teljes négyzáras játékmenet, segélykérések, hibás válaszok, finálé és újrakezdés.
- Fizikai mobil, Safari/Firefox, VoiceOver/NVDA, manuális 200%-os zoom, teljes kézi billentyűzetes bejárás.
- A történelmi H01 hiba változatlanul nyitott; **külön, tanár által jóváhagyandó tartalmi csomag**.

## Kiadás
Külön technikai PR. Merge és éles Vercel publikálás csak külön felhasználói jóváhagyás után. A repo gyökér-manifesztjének integritásbejegyzése és teljes fájlleltára külön karbantartási feladat; ebben a PR-ban nem módosul.

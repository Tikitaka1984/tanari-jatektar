# A cserépszavazás napja – integrációs QA, 2026-10-13

## Állapot: feltöltés kész; böngészős elfogadás BLOCKED; még nem beolvasztható

PR: #26. Ág: `fix/cserepszavazas-missing-files-20261013`.
Tesztelt játékcommit: `95d728bede02ab1170343f5adec4bc6300881c6f`.
Összehasonlítási főág: `c81da1124cfcf1c9b10666b81971c3803c94e43e`.

## Feltöltés és tartalomvédelem

A felhasználói `cserepszavazas_potlas_3_fajl.zip` pontosan három fájlt tartalmazott; mindhárom bájthűen feltöltve a meglévő PR-ágra:

| Útvonal | Bájt | SHA-256 |
|---|---:|---|
| `jatekok/cserepszavazas-napja/index.html` | 129963 | `04847419a9bbcff656128c3903f8b120fd8991230f3a323ac4d4464284bd15e4` |
| `jatekok/cserepszavazas-napja/docs/tanari_kiseroanyag_athen_agora.docx` | 12955 | `104d17bdfcd5e4ae2e5158d10d6a666323da6e5bcf58af4fb7165a782bdf6f8d` |
| `jatekok/cserepszavazas-napja/docs/tartalmi_terv_athen_agora.docx` | 12826 | `78af3e0d5b743c199078c347b33428bc679eaef01095287bd6084e712d54b5be` |

A `jatekok/jatekok.json`, a hub, a közös Three.js és minden korábbi játék változatlan. A diff ezt igazolja. A történelmi tartalom és pontozás nem módosult.

## Ellenőrzési eredmények

| Vizsgálat | Eredmény | Bizonyíték / korlát |
|---|---|---|
| `node tests/cserepszavazas-integrity.test.cjs` | PASS | 3/3 fájl, méret, SHA-256, DOCX fejléc, inline JS fordítás, helyi Three.js, kártyaregisztráció, grafika és útvonal |
| Mindkét DOCX belső ZIP-struktúrája | PASS | ZIP CRC ellenőrzés és `word/document.xml` megléte |
| Új kártya az ág Vercel-előnézetében | PASS, 1363 × 936 px | 9 gyakorlófeladat + 6 szabadulószoba + 4 szemléltetés = 19 kártya |
| Tanári Word letöltése a kártyáról | PASS | A távoli Chrome letöltési API ténylegesen letöltötte a fájlt |
| Játékoldal betöltése | RÉSZLEGES | Cím és HUD megjelenik; korábbi 404 megszűnt, de a 3D indulás blokkolt |
| 3D-játék, gyors és teljes mód | BLOCKED | A távoli Chrome nem hoz létre WebGL-környezetet; a nyitó játékmódválasztóig sem jut |
| Tanári nézet `#tanar` | BLOCKED | Közvetlen megnyitás kipróbálva; ugyanaz a WebGL inicializációs hiba |
| Újrakezdés, billentyűzet, dupla aktiválás, teljes játékmenet | NEM IGAZOLT | A WebGL inicializáció megszakítja a játék indulását |
| Chromium 360 / 768 / 1280 px | NEM TELJESÍTETT | Helyi Chromium nincs telepítve; a hivatalos Playwright telepítés sikertelen. A távoli felület e munkamenetben nem biztosít dokumentált viewport-állítást |
| Korábbi játékok változatlansága | PASS, fájlszinten | Nincs diff a korábbi játékokban |
| 9 gyakorlójáték hub-megnyitása és visszatérés | PASS, hub-szinten | Mind a 9 kártya a helyes iframe útvonalat nyitotta meg; ez nem teljes játékmenet-regresszió |
| Irányítsd Rómát! tartalmi és modellteszt | PASS | 18/18 tartalmi ellenőrzés; 6561 útvonal, 111537 összehasonlítás, 0 eltérés, 125 szélső eset |
| Korábbi 3D-játék kontrolltesztje | BLOCKED | Az Árpádok öröksége ugyanebben a Chrome-ban ugyanazzal a WebGL hibával áll meg |
| `cinematic-image-swap.test.cjs` | FAIL, korábban is fennáll | 18 kártyát vár, a jelenlegi katalógus 19-et tartalmaz. A főágon is reprodukálva |
| További 9 meglévő böngészős teszt | BLOCKED | Hiányzó helyi Chromium futtatható fájl; nem tekinthető játékmeneti hibának |

## Reprodukált környezeti akadály

Előnézet: https://tanari-jatektar-git-fix-cserepsz-92c7e4-takacs-tamas-s-projects.vercel.app/

1. A játékoldal megnyitása távoli Chrome-ban.
2. A cím, a HUD és az üres háttér megjelenik.
3. A konzol: `THREE.WebGLRenderer: Error creating WebGL context.`
4. A hiba az új játék 439. során, a WebGLRenderer létrehozásakor jelentkezik.
5. Kontroll: `/jatekok/arpadok-oroksege/` ugyanebben a böngészőben a 437. soron ugyanígy megáll.

Ez környezeti WebGL-korlátra utal; nem bizonyítja, hogy a játék WebGL-képes Chromiumban hibás. A játékműködés sikerét sem bizonyítja. Az eredeti fájlokat nem módosítottuk a tesztkörnyezet kedvéért.

A helyi Node verziója v24.19.0. A Playwright Chromium-telepítése a hivatalos forrásról nem adott érvényes ZIP-et (`End of central directory record signature not found`); telepíthető helyi böngésző nem állt rendelkezésre. A távoli Chrome pontos verziója nem lett rögzítve.

## Beolvasztási kapu és következő ellenőrzések

A három hiányzó fájl pótlása elkészült. A PR draft marad, a teljes QA még nem PASS.

WebGL-képes Chromiumban le kell futtatni 360, 768 és 1280 CSS px szélességen:
- kártyáról indítás és tényleges 3D render;
- gyors mód mindhárom fordulója és teljes mód végigjátszása;
- tanári nézet, időzítő, kód és eredménytábla;
- Word-letöltés;
- WASD/nyilak/F/Enter, Tab/Shift+Tab/Space/Escape, fókusz;
- újrakezdés és állapot/idő/hibák visszaállítása;
- dupla aktiválás, egyszeri értékelés, konzolhibák;
- öt korábbi 3D-szabadulószoba és korábbi játékok regressziója.

A korábbi 18-kártyás cinematic tesztet a 19-kártyás katalógushoz külön igazítani és újrafuttatni szükséges. E feladatban nem írtuk át más funkció tesztjét.

Valódi iOS/Safari/VoiceOver ellenőrzés nem történt. Merge, automatikus merge, production élesítés nem történt. Az ág frissítését a már beállított Vercel-integráció előnézetté építette; külön deploy-művelet nem indult.

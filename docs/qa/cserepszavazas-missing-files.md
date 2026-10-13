# A cserépszavazás napja – hiányzó fájlok javítása

Dátum: 2026. október 13. – javítási ág: `fix/cserepszavazas-missing-files-20261013`.

## Megállapítás

A PR #25 a `main` ágba már beolvadt, de az éles `jatekok/cserepszavazas-napja/` mappa nem került feltöltésre. A hub 6. szabadulószoba-kártyája emiatt nem létező útvonalra mutat. A Vercel production a #25 merge commitját használta; ez nem igazolja, hogy a hiányzó oldalak elérhetők.

## Eredeti felhasználói ZIP-ből feltöltendő fájlok

| GitHub célútvonal | Méret | SHA-256 |
|---|---:|---|
| `jatekok/cserepszavazas-napja/index.html` | 129963 | `04847419a9bbcff656128c3903f8b120fd8991230f3a323ac4d4464284bd15e4` |
| `jatekok/cserepszavazas-napja/docs/tanari_kiseroanyag_athen_agora.docx` | 12955 | `104d17bdfcd5e4ae2e5158d10d6a666323da6e5bcf58af4fb7165a782bdf6f8d` |
| `jatekok/cserepszavazas-napja/docs/tartalmi_terv_athen_agora.docx` | 12826 | `78af3e0d5b743c199078c347b33428bc679eaef01095287bd6084e712d54b5be` |

**Forrás:** felhasználói `jatektar_kiegeszites_cserepszavazas.zip`. Az eredeti ZIP többi fájlját, különösen a `jatekok/jatekok.json` másolatát és az `offline/` könyvtárat ne töltsd fel a webes repóba.

## Elkészült ellenőrzések
- ZIP-fájllista, fájlméret és SHA-256: ellenőrizve.
- Mindhárom inline HTML script Node v22 szintaxisellenőrzése: PASS (0 JS szintaktikai hiba).
- Helyi Three.js-könyvtár a GitHubon: `jatekok/_lib/three.min.js` – létezik, a HTML helyesen a `../_lib/three.min.js` útvonalat használja.
- `index.html`, `jatekok/jatekok.json`, `assets/hub-cserepszavazas.svg`: a PR #25 óta a főágban szerepel, további módosításuk nem szükséges.
- Új integritási teszt: `node tests/cserepszavazas-integrity.test.cjs`. A teszt szándékosan FAIL-t ad mindaddig, amíg a három fájl nincs a branchben.

## Kötelező feltöltési, regressziós és átadási lépések
1. A ZIP-ből **bájthűen** helyezd el a fenti három fájlt a már létező javító branchben. Nem szabad a történelmi kérdéseket, válaszokat, megoldásokat, pontozást, állapotkezelést átírni.
2. Futtasd a `node tests/cserepszavazas-integrity.test.cjs` parancsot: 3/3 fájl és a hub-kapcsolat PASS.
3. Playwright/Chromium 360, 768, 1280 CSS px: a 6. szabadulószoba-kártya megjelenik, kattintás után a játék 200 OK, Three.js beolvas, 3D canvas renderel; teljes és gyors kör; billentyűzetes vezérlés és Escape; tanári nézet `#tanar`; tanári DOCX letöltése HTTP 200, MIME és DOCX struktúra; újrakezdés és konzolhibák.
4. Ellenőrizd, hogy a korábbi 5 szabadulószoba, 9 interaktív játék és 4 szemléltetés változatlanul elérhető; 19 kártya jelenik meg összesen.
5. Közöld a QA-jegyzőkönyvet és lehetőség szerint képernyőképeket a PR-ban. Valódi iOS/Safari/VoiceOver teszt hiányát külön jelezd.

## Kiadási korlát
A PR **nem merge-elhető** addig, amíg a három fájl nincs feltöltve és a QA PASS eredményű. A `main` / Vercel production élesítése nem történik meg automatikusan.

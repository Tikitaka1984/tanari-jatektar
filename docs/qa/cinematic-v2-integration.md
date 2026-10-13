# Cinematic Edition 2.0 – nyolc hiányzó illusztráció pótlása

Dátum: 2026-10-13. Fejlesztési ág: `feature/cinematic-2-eight-webp-20261013`.

## Cél és változtatási hatókör

A korábbi 18 katalóguskártyából megmaradt 8 SVG helyett önálló, tematikus WebP kerül a kártyákra. A cserépszavazás-napja azóta hozzáadott 19. kártya, **saját SVG-jével marad**. A végső katalógus célja **18 WebP + 1 SVG = 19 kártyakép**. A korábbi 10 WebP, a 19 SVG-fájl és a játéktartalmak nem változnak.

A nyolc kép: `assets/hub-reformkor.webp`, `assets/hub-szokereso.webp`, `assets/hub-keresztrejtveny.webp`, `assets/hub-eszperente.webp`, `assets/hub-arpadok.webp`, `assets/hub-iuti.webp`, `assets/hub-demo-wwi.webp`, `assets/hub-demo-legkor.webp`.

## Elkészült a GitHubon

- `index.html`: a fenti nyolc kulcsot hozzáadtuk a WebP képlistához.
- `docs/qa/cinematic-images-v2-manifest.json`: nyolc fájl neve, mérete és SHA-256 értéke.
- `tests/cinematic-v2-integrity.test.cjs`: bájthű WebP, korábbi képek és az athéni kártya helyben ellenőrizhető integritáskapuja.
- `tests/cinematic-image-swap.test.cjs`: korábbi, 18 kártyára épülő regressziós teszt javítása 19 kártyára, 6 szabadulószobára, 18 WebP-re és 1 SVG-re. A korábbi tíz WebP és az eredeti 19 SVG fájlintegritását továbbra is ellenőrzi.
- Módosított főoldali JavaScript, tesztforrás szintaxisa ellenőrizve.

## Kritikus blokk – HIÁNYZÓ BINÁRIS FÁJLOK

A nyolc optimalizált WebP még **nincs feltöltve** az ágra! A GitHub API itt a szöveges fájlokat írta, a bináris forráscsomag a beszélgetésből tölthető le: `Tanari_Jatektar_Cinematic_2_8_WebP.zip`. Feltöltés nélkül a PR **NEM MERGE-ELHETŐ**, mert a kártyákon törött képek lesznek.

A Work feltöltési feladata:
1. ZIP kibontása, az **egyetlen `assets/` mappa nyolc WebP-fájljának** feltöltése pontos útvonalra a meglévő fejlesztési ágon. Ne írja felül a 10 korábbi WebP-t, a SVG-ket vagy a játékok forrását.
2. A ZIP-ben található manifest bájthű egyezését ellenőrizze a GitHub-beli `docs/qa/cinematic-images-v2-manifest.json` fájllal.
3. `node tests/cinematic-v2-integrity.test.cjs` → PASS, 8/8 kép.
4. `node tests/cinematic-image-swap.test.cjs` → PASS, Chromium 360/768/1280 CSS px; legalább a 19 kártyakép, 2 kiemelt ajánló, 19 katalógusindítás, plusz 2 kiemelt indítás.
5. Valódi HTTP 200 és `image/webp` 8/8 új képen; valamennyi kártya `naturalWidth>0`; nincs 404, JS-hiba, vízszintes kilógás.
6. Az új athéni szabadulószoba indításának működését és az eredeti 5 szabadulószoba navigációját ellenőrizze. Ha nincs WebGL-képes Chromium, ne jelölje a 3D teljes QA-t PASS-nak.
7. Az eredményt, tesztnaplót, képernyőképeket rögzítse ezen a QA-lapon, és írja bele, hogy milyen vizsgálat maradt el.
8. Csak minden kritikus ellenőrzés után javasolja a merge-et. **Ne indítson automatikus merge-et vagy production élesítést.**

## Jelenlegi ellenőrzési eredmény

- A forrásmontázsból kivágott nyolc képet 1119 × 630 px méretű WebP-ként előállítottuk, 538 274 bájt összmérettel.
- Mindegyikhez SHA-256 készült.
- A GitHub `main` 19 kártyát tartalmaz; nyolc régi SVG-csere és egy továbbra is SVG-ként működő athéni játék a cél.
- **Teljes Chromium/browser QA még nem történt.** A tesztek a nyolc WebP hiányában szándékosan hibát adnának.

Történelmi-szakmai megjegyzés: a filmes képek oktatási célú hangulatképek, nem elsődleges történelmi források vagy hiteles rekonstrukciók.

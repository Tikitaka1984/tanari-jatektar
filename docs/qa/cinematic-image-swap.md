# Cinematic Edition – képpótlás és Chromium QA

## Eredmény: PASS – a javító PR beolvasztható

Ellenőrzés: 2026. október 13., Chromium 153.0.8010.0, Playwright, 360/768/1280 CSS px szélesség és 900 px nézetmagasság. A képfeltöltés, a főoldali integráció és a kért játékindítási smoke tesztek sikeresek.

A [PR #23](https://github.com/Tikitaka1984/tanari-jatektar/pull/23) **már 2026-10-12 19:32:36 UTC-kor beolvadt**, a `8dc01dccdd66a9309de35d8bc9ac4123eec4b4f4` merge committal, a hiányzó WebP-kre vonatkozó eredeti blokkoló ellenére. Ezért a #23 nem nyitható újra beolvasztásra. A pótlás az eredeti `feature/cinematic-webp-cards-20261012` fejlesztési ágon, külön javító PR-ban kerül átadásra.

- Képfeltöltési commit: [`a35081b1adbe02d9f551deb014817d5c3228dc65`](https://github.com/Tikitaka1984/tanari-jatektar/commit/a35081b1adbe02d9f551deb014817d5c3228dc65).
- A tesztelt munkapéldány **53 alkalmazás- és assetfájlja bájtról bájtra egyezik** ezzel a GitHub-committal. A gépi riport rögzíti az `index.html`, a teszt és minden kép hashét.
- Az `index.html`, a játékok, a történelmi szövegek, a pontozás és a 3D-játékok forrása nem változott ebben a pótlásban.
- A munka során nem történt merge, automerge-beállítás vagy production-élesítés. A feature ág commitjára automatikus Vercel-ellenőrzés futott, eredménye `success`.

## Képfájlok és integritás

Forrás: a felhasználó által csatolt `Tanari_Jatektar_Cinematic_Kepek_GitHub(1).zip`.

| Kártyakulcs | Feltöltött fájl | Méret, bájt | SHA-256-egyezés |
|---|---|---:|---|
| `roma` | `assets/hub-roma.webp` | 132,204 | PASS |
| `korona` | `assets/hub-korona.webp` | 134,302 | PASS |
| `leveltar` | `assets/hub-leveltar.webp` | 125,804 | PASS |
| `ketforras` | `assets/hub-ketforras.webp` | 149,262 | PASS |
| `kivagyok` | `assets/hub-kivagyok.webp` | 125,114 | PASS |
| `nyolckor` | `assets/hub-nyolckor.webp` | 147,260 | PASS |
| `junius` | `assets/hub-junius.webp` | 122,804 | PASS |
| `demo-felfedezesek` | `assets/hub-demo-felfedezesek.webp` | 161,698 | PASS |
| `demo-roma` | `assets/hub-demo-roma.webp` | 132,204 | PASS |
| `grof` | `assets/hub-grof.webp` | 116,400 | PASS |

Összesen **10 fájl, 1 347 052 bájt** (1,347 MB; 1,285 MiB), képenként **1119 × 630 px**. Mindegyik valódi, dekódolható WebP, nem átnevezett más formátum. A GitHub-ágat újra lekérve a `git show` által visszaadott bináris tartalmak SHA-256-értéke is 10/10 esetben egyezik a csatolt manifesttel.

A teljes manifest: [cinematic-images-manifest.json](cinematic-images-manifest.json). Az eredeti **18 SVG bájtról bájtra megmaradt**; az új katalógus 10 WebP-t és 8 SVG-t használ. A `hub-roma.webp` és `hub-demo-roma.webp` az átadott csomag szerint azonos kép, külön fájlnévvel; ez szándékos, nem feltöltési hiba.

## Elfogadási tesztek

| Szélesség | Dekódolt kártyaképek | Megnyitás/indítás | Törött kép | JS-/konzolhiba | HTTP-/hálózati hiba | Összesítés |
|---|---:|---:|---:|---:|---:|---|
| 360 px | 18/18 | 20/20 | 0 | 0 | 0 | PASS |
| 768 px | 18/18 | 20/20 | 0 | 0 | 0 | PASS |
| 1280 px | 18/18 | 20/20 | 0 | 0 | 0 | PASS |

Mindhárom méreten elvégzett ellenőrzések:

1. **Hero és két kiemelt játék:** a hero és a Róma-ajánló a `hub-roma.webp`, a Korona-ajánló a `hub-korona.webp` képet használja; a képek vizuálisan megfelelően illeszkednek.
2. **18 katalóguskártya:** 9 gyakorlófeladat + 5 3D-s szabadulószoba + 4 szemléltetés. Mind a 18 illusztráció betölt és dekódol; 18 külön útvonal, 10 WebP + 8 SVG; a dekoratív képek `alt=""` értékűek, és a kártyák tetejéhez igazodnak.
3. **10 WebP HTTP-teszt:** mindegyik HTTP 200, `image/webp` MIME-típus és pontos bináris hash. A CSS-háttérképek hivatkozásai szintén ellenőrizve.
4. **Reszponzív megjelenés:** nincs vízszintes oldalkilógás; a mobilmenü nyitható és Escape-pel bezárható; a kiemelt ajánlók 360 px-en egymás alatt, 768/1280 px-en egymás mellett jelennek meg. A képernyőképek kézi vizuális ellenőrzése sikeres.
5. **Navigáció és szűrés:** tantárgy-, évfolyam- és típusszűrés, üres találati állapot, szabadulószobákhoz ugró navigáció; helyes `aria-pressed`, megmaradó szűrőfókusz.
6. **13 iframe-es katalóguselem és két kiemelt ajánló:** Enter/Space megnyitás, ténylegesen renderelt tartalom, inert háttér, visszalépés/Escape, a megnyitó elemre visszatérő fókusz és az iframe ürítése. A két kiemelt játék külön lapon is a helyes útvonalon nyílik.
7. **Tényleges kiemelt játékindítás:** Róma belépés a tanácsterembe, három döntési lehetőség és újrakezdés; Korona nyomozásindítás és működő térképes kezdőállapot.
8. **Öt 3D-s szabadulószoba:** a főoldali indítógomb valódi navigációja, nem pusztán HTTP-lekérés; látható és nem üres méretű canvas, a Teljes játék mód indítása, következő állomás vezérlő és az aktív játék segítségpanelje. Visszatérés a főoldalra; a négy Word-letöltés HTTP 200.
9. **Hibamentesség:** nincs futási JavaScript-hiba, konzolhiba, HTTP 4xx/5xx vagy tényleges hálózati hiba a végső futásban. Méretenként hat, játékbezáráskor megszakított betűkészletkérés `ERR_ABORTED` állapota külön szerepel a riportban mint navigációs megszakítás; ezek nem sikertelen assetbetöltések.

Összesen **54 katalógusmegnyitás és 6 kiemelt megnyitás**, azaz **60 sikeres útvonal**.

## Betöltési méret és mérési korlát

| Szélesség | 18 hub-kép kódolt mérete, bájt | Képátvitel fejlécekkel, bájt | Leglassabb helyi képbetöltés | DOMContentLoaded | Teljes load |
|---|---:|---:|---:|---:|---:|
| 360 px | 1,378,499 | 1,383,899 | 5.7 ms | 6.90 s | 15.54 s |
| 768 px | 1,378,499 | 1,383,899 | 9.8 ms | 8.05 s | 16.75 s |
| 1280 px | 1,378,499 | 1,383,899 | 20.5 ms | 7.97 s | 17.62 s |

A mérés helyi statikus szerveren, friss böngészőprofilokkal, a külső betűkészletek és függőségek valódi hálózati elérésével történt. A teljes load idejét a tesztkörnyezet proxyján át érkező külső erőforrások is befolyásolják; ebből nem következtethető éles felhasználói betöltési sebesség. Nincs Lighthouse-pontszám vagy mobilhálózati teljesítményígéret.

Az első, proxy nélküli próbában a Google Fonts és a Róma-szemléltetés külső React-erőforrásai nem voltak elérhetők. Chromium nem örökölte automatikusan a runner proxybeállítását; ennek beállítása után a valós erőforrások betöltődtek, és a végső teszt teljes egészében sikeres lett. A teszt nem helyettesíti ezeket mock erőforrásokkal.

## Bizonyítékok és újrafuttatás

- [Gépi tesztjegyzőkönyv](cinematic-evidence/results.json): böngészőverzió, forrásazonosítók, 10 asset hash, 18 SVG hash, méretenként 18 kártya és 20 megnyitás, hálózati és teljesítményadatok.
- Főoldali képernyőképek: [360 px](cinematic-evidence/viewport-360.jpg), [768 px](cinematic-evidence/viewport-768.jpg), [1280 px](cinematic-evidence/viewport-1280.jpg).
- Teljes 1280 px-es kártyarácsok: [9 gyakorlófeladat](cinematic-evidence/grid-1280.jpg), [5 szabadulószoba](cinematic-evidence/escapeGrid-1280.jpg), [4 szemléltetés](cinematic-evidence/demoGrid-1280.jpg).
- [Futtatható célzott teszt](../../tests/cinematic-image-swap.test.cjs).

A projekt nem kapott buildfolyamatot vagy futásidejű függőséget. A teszthez külső Playwright-telepítés és Chromium szükséges:

```bash
NODE_PATH=/path/to/external/node_modules \
QA_EXECUTABLE_PATH=/path/to/chromium \
node tests/cinematic-image-swap.test.cjs
```

A `QA_EXECUTABLE_PATH` elhagyható, ha a Playwright saját Chromiumja telepítve van; a `QA_OUTPUT` az eredménykönyvtárat állítja. A teszt a környezetben megadott HTTPS-proxyt automatikusan használja, a helyi szervert közvetlenül éri el.

## A késznek minősítés határa

A képpótlás és a fenti Chromium-integrációs QA **beolvasztható**. Ez a jegyzőkönyv nem a teljes 18 alkalmazás minden kérdésének, pontozásának, befejezésének vagy képernyőolvasós működésének újraauditálása. A 360 px-es ellenőrzés Chromium-nézetteszt, nem fizikai iPhone/Safari-mérés. Production-kontroll csak később, külön engedélyezett merge után következhet.

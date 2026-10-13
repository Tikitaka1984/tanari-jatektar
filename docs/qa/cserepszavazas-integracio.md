# Új 3D-játék integrációja – A cserépszavazás napja

## Kiinduló csomag
Felhasználói feltöltés: `jatektar_kiegeszites_cserepszavazas.zip`.
A csomag tartalmazza a teljes önálló online játékot (129 963 bájt), a tanári kísérőanyagot, egy tartalmi tervet, egy önálló offline verziót és egy katalógus-javaslatot.

## Jelenleg elkészült, külön ágon
- `jatekok/jatekok.json`: a meglévő öt játék megtartásával hatodik bejegyzésként bekerült a cserépszavazás.
- Gyökér `index.html`: új szabadulószoba-kártya, tanári hivatkozás és társított képútvonal a korábbi működés megtartásával.
- `assets/hub-cserepszavazas.svg`: egyedi ókori athéni illusztráció.
- JavaScript-szintaxisellenőrzés a módosított főoldalhoz: PASS.

## BLOKKOLÓ – a PR nem merge-elhető
A játék HTML-je és két DOCX-dokumentuma **még nem került a GitHub fejlesztési ágába**; így az új kártya jelenleg hibás URL-re mutatna. A GitHub-kapcsolat ebben a környezetben közvetlenül a szöveges projektrészek módosítására használható, a csatolt DOCX bináris fájlok átadására nem.

A Work / integrációs környezet pontos feladata:
1. Csak a csomag `jatekok/cserepszavazas-napja/` mappáját töltse fel a PR fejlesztési ágára: `index.html` + `docs/tartalmi_terv_athen_agora.docx` + `docs/tanari_kiseroanyag_athen_agora.docx`.
2. A csomagban lévő `jatekok/jatekok.json` fájllal **ne írja felül** a tárolóét; a főági katalógus induláskor öt játékot tartalmazott, a hatodik bejegyzés már itt hozzá lett adva. A csomag OLVASS_EL.md szövege a meglévő bejegyzések számát pontatlanul írja le.
3. Ellenőrizze a játék `../_lib/three.min.js` relatív útvonalát és a CDN-es tartalékot; ne változtassa meg a már használt Three.js csomagot más játékok alatt.
4. Offline változatot a ZIP `offline/` könyvtárából **csak külön igény esetén** publikáljon; nem része a webes hubnak.
5. Bemenő ZIP-fájlt ellenőrizze biztonság és történelmi pontosság szempontjából; tartalmi problémánál dokumentáljon, de kérdés / megoldás / pontozás ne változzon tanári jóváhagyás nélkül.
6. 360, 768 és 1280 px Chromium: indulás, teljes és gyors mód, billentyűzet/érintés, tanári kivetítő, visszalépés, újraindítás, dupla kattintás, JS-hibák, csatolt tanári dokumentum, az eredeti játékok és kártyák működése.
7. Készítsen reprodukálható tesztet és aktualizálja ezt a QA-jegyzőkönyvet. A PR csak minden szükséges játékfájl feltöltése és a regresszió után lesz beolvasztható.

## Kiadás
Draft PR. A `main` és Vercel éles oldal változatlan; merge / deploy külön felhasználói jóváhagyás után.

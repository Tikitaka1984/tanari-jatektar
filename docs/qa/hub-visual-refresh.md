# Tanári Játéktár – vizuális főoldal (cinematic navy–gold)

## Cél
A jóváhagyott sötétkék–arany, történelmi digitális múzeum arculat gyakorlati megvalósítása. Ez **valódi webfelület**, nem állókép vagy külön design-koncepció.

## Hatókör
- `index.html`: új márkázott fejléc és mobilmenü, történelmi illusztrációjú nyitóképernyő, két képes kiemelt játék, új kártya- és szűrőstílus, új szabadulószoba-/bemutatókártyák, reszponzív és reduced-motion kezelés.
- `assets/hub-roma.svg`: önálló, tömöríthető római építészeti illusztráció.
- `assets/hub-korona.svg`: vár, korona és történelmi nyomozás illusztráció.

## Megőrzött jellemzők
- Eredeti `GAMES`, `ESCAPES`, `DEMOS`, `SUBJECTS`, `TYPES`, `GRADES` adatok, minden játék útvonala.
- Eredeti filter- és iframe-játékindító logika, teljes játékoldalak módosítás nélkül.
- A 3D-s játékok külön saját URL-ről indulnak; tanári nézet, Word-mellékletek és eredeti hibajelzés megmaradtak.
- Nem került be framework, build, futásidejű adatgyűjtés, analitika vagy külső képszolgáltatás. Az illusztrációk helyben lévő SVG-k.
- Az M08 szakmai Work-feladattal nem ütközik: játék és demó fájl változatlan.

## Végrehajtott ellenőrzés
- **PASS**: az `index.html` beágyazott JavaScript-jének szintaxisellenőrzése `new Function(script)` segítségével.
- **PASS**: a jelenlegi forrásban megvannak a kiemelt játékok valódi `openItem()`-hívásai, a mobilmenü állapotának `aria-expanded` frissítése, a meglevő szűrés és a relatív játékútvonalak.
- **PASS**: külön megnyitható SVG-k és relatív, külső függőség nélküli képhivatkozások.

## Következő kötelező tesztek – még nem végrehajtva
- Playwright/Chromium: 360, 768, 1280 px, sávok kilógása, képbetöltés, menü, billentyűzet és horgonylinkek.
- Játékkártyák és két kiemelt játék iframe indítás és visszalépés; 3D játék / tanári hash, dokumentumlink.
- Tantárgy-, évfolyam- és típusfilter, keresztellenőrzés a régi főoldallal.
- Firefox/Safari, VoiceOver/NVDA, 200% zoom és fizikai mobil.
- Vercel Preview smoke, utána felhasználói jóváhagyás a merge előtt.

## Kiadási szabály
Külön Draft PR. **Nem merge-elhető** addig, amíg a böngészős smoke nincs elvégezve és a tulajdonos nem hagyta jóvá. Production Vercel nem módosul.

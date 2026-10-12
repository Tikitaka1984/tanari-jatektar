# Tanári Játéktár – főoldal QA

Dátum: 2026-10-12. Ág: feature/hub-cinematic-navy-gold.
Böngésző: Google Chrome 154.0.8037.99 (Playwright, helyi statikus HTTP-kiszolgáló).
Tesztelt index.html SHA-256: `7d543a0ad26ab5ed7a67f888baf1ce063067fdd6d4401e872c1b73da40968321`.
Főági összehasonlítás: 62838df. Kiinduló feature-commit: 550da7a.

## Eredmény

| Szélesség | Eredmény | Elrendezés |
| --- | --- | --- |
| 360 px | PASS | Mobilmenü, egyoszlopos kiemelt kártyák és katalógus |
| 768 px | PASS | Mobilmenü, kétoszlopos kártyák |
| 1280 px | PASS | Teljes navigáció, háromoszlopos katalógus |

Mindhárom méret: nincs vízszintes túlcsordulás; 9 játék, 5 szabadulószoba és 4 bemutató megjelenik. A három képernyőméret nyitó szakasza vizuálisan ellenőrizve; teljes oldalas képernyőképek elkészültek.

## Végrehajtott ellenőrzések

- Menü megnyitás Enterrel, Tab, Escape, fókusz-visszaadás, horgonylink és menübezárás.
- Tantárgyszűrő: Földrajz → 0 játék és 1 bemutató; visszaállítás minden tantárgyra.
- Évfolyam és típus kombinációja: 12. + stratégia → üres állapot; minden évfolyam + stratégia → 1 játék; visszaállítás.
- Szűrők aria-pressed állapota és fókuszmegőrzése; találatszám élő régió.
- Mindkét kiemelt kaland, első normál játékkártya és Róma-demó: Enter → iframe, háttér inert, fókusz a lejátszóban, külön lap megfelelő URL-lel, visszalépés és eredeti fókusz, iframe ürítése.
- Escape a lejátszó fejlécéből bezár; a játék saját, preventDefault-dal kezelt Escape eseménye elsőbbséget élvez.
- Minden szabadulószoba-, tanári nézet- és Word-hivatkozás célja HTTP 200; mindkét helyi SVG HTTP 200.
- Nincs pageerror a fenti forgatókönyvekben.
- JavaScript szintaxis PASS; git diff --check PASS.
- GAMES, DEMOS, SUBJECTS, ESCAPES, GRADES, TYPES adattömbök a főágival azonosak.
- games/, demos/, jatekok/ különbség a főághoz képest: nincs. M08 fájl nem változott.

## Javított hibák

- 360 px-en túl kicsi kiemelt kártyák → teljes szélességű kártyák.
- Szűrés újrarajzolásakor elvesző fókusz → fókusz helyreállítása és programozott kijelölt állapot.
- Mobilon a külön lap ikon neve hiányos → explicit akadálymentes név.
- Látható literális visszaperjel-n a tanári segédletben → valódi sortörés.
- Mobil/tablet hero háttér képszél → teljes magasságú illusztráció.
- Kártyacímek címsorhierarchiája és csökkentett mozgás kezelése javítva.

## Hatókör és korlátok

A PR csak index.html, a két meglévő hub-SVG, a hub QA-jegyzőkönyv, eredményfájl és célzott böngészőteszt módosításait tartalmazza. Nincs framework vagy futásidejű függőség.
A teszt nem teljes játék-végigjátszás: pontozás, mentés, újrakezdés és az M08 történelmi tartalom kívül esik a feladaton. Firefox/Safari, fizikai mobil, 200%-os böngészőzoom és NVDA/VoiceOver ellenőrzés nem történt. A tanári hash-célok és dokumentumok elérhetősége ellenőrzött, a belső 3D tanári működés nem került újratesztelésre.
Az eredeti beszélgetés képi referenciája szolgáltatási korlát miatt nem volt hozzáférhető; a meglévő ágon megvalósított arculatot és a kért sötétkék–arany stílust folytattuk.

## Reprodukció

Külső Playwright-telepítésből: `node tests/hub-browser.test.cjs`.
Szükség szerint NODE_PATH a Playwright csomagkönyvtára; QA_BROWSER alapérték chrome; QA_OUTPUT a képernyőképek és JSON célmappája. Nem kell csomagot telepíteni a projektbe.

## Kiadás

Külön Draft PR a main ágra. Merge és deploy kizárólag külön tulajdonosi jóváhagyással. Ebben a munkában egyik műveletet sem indítottuk.

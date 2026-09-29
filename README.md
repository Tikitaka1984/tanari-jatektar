# Tanári játéktár

Önálló, böngészőben futtatható történelmi oktatójátékok és szemléltető animációk gyűjteménye, egy közös `index.html` hub-bal összefogva. A hub önálló fájlokat tölt be relatív útvonalról (`games/…`, `demos/…`) — nincs base64-be ágyazott tartalom, nincs futásidejű Blob URL generálás. Ez teszi lehetővé a normál git-alapú fejlesztést és a statikus Vercel-telepítést.

## Gyors indítás

1. Indíts helyi statikus webszervert a projekt gyökerében, például:

   ```bash
   python -m http.server 8000
   ```

2. Nyisd meg a `http://localhost:8000/` címet — ez a hub, amely kártyákra kattintva tölti be a játékokat és a szemléltető anyagokat egy beágyazott nézőben (iframe).
3. Egy játék vagy szemléltetés önmagában is megnyitható közvetlenül, pl. `http://localhost:8000/games/kivagyok.html`.

A projekt nem igényel telepítést, csomagkezelőt, buildfolyamatot vagy frontend keretrendszert.

## Gyakorlófeladatok

| Játék | Fájl | Évfolyam | Rövid leírás |
| --- | --- | --- | --- |
| A korona nyomában | `games/korona.html` | 9–10. | Térképes nyomozójáték a középkori magyar államon át. |
| Ki vagyok én? | `games/kivagyok.html` | 9–12. | Portréjáték, 42 történelmi személy, fokozatosan könnyülő nyomokkal. |
| A reformkor vitaterme | `games/reformkor.html` | 10–11. | Három vitatéma (Széchenyi–Kossuth, Dessewffy–Széchenyi, centralisták–Kossuth) témaválasztóval. |
| A titkos levéltár | `games/leveltar.html` | 11–12. | Szabadulószoba évszám-, fogalom-, személy- és térképfeladatokkal. |
| Szókereső | `games/szokereso.html` | 9–12. | 428 fogalom, név és helyszín, klasszikus és nehéz móddal, nyomtatható feladatlappal. |
| Két forrás, két igazság | `games/ketforras.html` | 9–12. | 21 esetpár forráselemzésre, mind a négy évfolyamról. |
| Keresztrejtvény | `games/keresztrejtveny.html` | 9–12. | Generált keresztrejtvény évfolyam és téma szerint. |
| Csak E! | `games/eszperente.html` | 9–12. | Eszperente nyelvi rejtvény — történelmi események és szereplők leírásában csak "e"/"é" magánhangzó szerepel, három nehézségi szinttel. |

## 3D szabadulószobák

Önálló oldalak a `jatekok/<azonosító>/index.html` útvonalon; a hub „Szabadulószobák” szekciójának kártyáiról ugyanazon a lapon nyílnak. Közös three.js (r128) a `jatekok/_lib/three.min.js` fájlban; a játékok relatív útvonalon (`../_lib/three.min.js`) hivatkozzák, ezért a `/jatekok/<azonosító>/` (záró perjeles) címen érhetők el. A tanári kivetítő nézet a cím végére írt `#tanar` hash-sel nyílik. A kártyák adatai: `jatekok/jatekok.json`.

| Játék | Mappa | Tantárgy | Évfolyam |
| --- | --- | --- | --- |
| Az Árpádok öröksége | `jatekok/arpadok-oroksege/` | Történelem | 11–12. |
| Iuti háza | `jatekok/iuti-haza/` | Történelem | 9. |
| Nyolckor indul a busz | `jatekok/nyolckor-indul-a-busz/` | Turizmus-vendéglátás | 9. (bevezető) |
| Június tizenhatodika | `jatekok/junius-tizenhatodika/` | Történelem | 11–12. |

A tanári kísérőanyagok (Word) a `jatekok/<azonosító>/docs/` mappában vannak (a „Június tizenhatodika” játékhoz nincs).

## Szemléltető animációk

| Anyag | Fájl | Téma |
| --- | --- | --- |
| A nagy földrajzi felfedezések | `demos/demo_felfedezesek.html` | Kora újkor |
| A Római Birodalom | `demos/demo_roma.html` | Ókor |
| Az első világháború frontjai | `demos/demo_wwi.html` | XX. század |
| A légkör rétegei | `demos/demo_legkor.html` | Földrajz |

Ezek kivetítéshez, tanári magyarázathoz készültek — nem önellenőrző gyakorlófeladatok.

## Projektstruktúra

```text
tanari-jatektar/
├── index.html              (hub — szűrhető katalógus, iframe-es beágyazott nézővel)
├── manifest.json            (fájlméret + MD5 leltár ellenőrzéshez)
├── games/
│   ├── korona.html
│   ├── kivagyok.html
│   ├── reformkor.html
│   ├── leveltar.html
│   ├── szokereso.html
│   ├── ketforras.html
│   ├── keresztrejtveny.html
│   └── eszperente.html
├── jatekok/                 (3D szabadulószobák)
│   ├── _lib/three.min.js
│   ├── jatekok.json
│   ├── arpadok-oroksege/    (index.html, docs/)
│   ├── iuti-haza/           (index.html, docs/)
│   ├── nyolckor-indul-a-busz/ (index.html, docs/)
│   └── junius-tizenhatodika/  (index.html)
├── demos/
│   ├── demo_felfedezesek.html
│   ├── demo_roma.html
│   ├── demo_wwi.html
│   └── demo_legkor.html
├── docs/
│   ├── DEVELOPMENT_RULES.md
│   ├── PEDAGOGICAL_RULES.md
│   └── TESTING_CHECKLIST.md
├── README.md
└── .gitignore
```

A hub (`index.html`) a `GAMES` és `DEMOS` metaadat-tömbök alapján generálja a katalógust; kattintáskor a megfelelő `games/<id>.html` vagy `demos/<id>.html` fájlt tölti be egy iframe-be (`resolvePath()`), a `Külön lapon` gomb pedig új böngészőlapon nyitja meg ugyanazt az útvonalat.

## Vercel-telepítés

A projekt tiszta statikus HTML/CSS/JS, build lépés nélkül — a repó gyökere közvetlenül kiszolgálható.

## Fejlesztési munkarend

- Kövesse a [`docs/DEVELOPMENT_RULES.md`](docs/DEVELOPMENT_RULES.md) előírásait.
- Tartalmi módosítás előtt ellenőrizze a [`docs/PEDAGOGICAL_RULES.md`](docs/PEDAGOGICAL_RULES.md) korlátait.
- Minden változtatást ellenőrizzen a [`docs/TESTING_CHECKLIST.md`](docs/TESTING_CHECKLIST.md) alapján.
- Új fejlesztéshez hozzon létre külön Git-ágat, például: `git switch -c feature/rovid-leiras`.

# Tanári játéktár

Önálló, böngészőben futtatható történelmi oktatójátékok rendezett helyi projektje. A játékok statikus HTML-, CSS- és JavaScript-állományok; minden játék saját `index.html` fájlból indul.

## Gyors indítás

1. Nyissa meg a kiválasztott játék `index.html` fájlját egy korszerű böngészőben.
2. Fejlesztéskor célszerű helyi statikus webszervert indítani a projekt gyökerében, például:

   ```bash
   python -m http.server 8000
   ```

3. Ezután a játék például a `http://localhost:8000/games/ki-vagyok-en/` címen érhető el.

A projekt nem igényel telepítést, csomagkezelőt, buildfolyamatot vagy frontend keretrendszert.

## Játékok

| Játék | Helye | Rövid leírás |
| --- | --- | --- |
| Ki vagyok én? | `games/ki-vagyok-en/index.html` | Érettségi portréjáték történelmi személyek felismeréséhez, fokozatosan könnyülő nyomokkal. |
| A reformkor vitaterme | `games/reformkor-vitaterme/index.html` | Széchenyi István és Kossuth Lajos reformprogramjának összehasonlítása és az állítások rendszerezése. |
| Két forrás, két igazság | `games/ket-forras-ket-igazsag/index.html` | Ellentérő történelmi nézőpontok és források összevetése, a közös tények és az értelmezési különbségek felismerése. |
| A titkos levéltár | `games/titkos-leveltar/index.html` | Reformkori szabadulószoba évszám-, fogalom-, személy-, térkép- és forráskritikai feladatokkal. |
| A korona nyomában | `games/korona-nyomaban/index.html` | A középkori magyar állam történetét feldolgozó térképes, kronológiai és forráselemző nyomozójáték. |
| Szókereső | `games/szokereso/index.html` | A 9–12. évfolyam történelmi fogalmainak, személyeinek és helyszíneinek gyakorlása. |

## Projektstruktúra

```text
tanari-jatektar/
├── games/
│   ├── ki-vagyok-en/
│   │   └── index.html
│   ├── reformkor-vitaterme/
│   │   └── index.html
│   ├── ket-forras-ket-igazsag/
│   │   └── index.html
│   ├── titkos-leveltar/
│   │   └── index.html
│   ├── korona-nyomaban/
│   │   └── index.html
│   └── szokereso/
│       └── index.html
├── docs/
│   ├── DEVELOPMENT_RULES.md
│   ├── PEDAGOGICAL_RULES.md
│   └── TESTING_CHECKLIST.md
├── README.md
└── .gitignore
```

## Forrásfájlok hozzárendelése

| Projektfájl | Felhasznált eredeti fájl |
| --- | --- |
| `games/ki-vagyok-en/index.html` | `ki_vagyok_en_v2(3).html` |
| `games/reformkor-vitaterme/index.html` | `reformkor_vitaterme(3).html` |
| `games/ket-forras-ket-igazsag/index.html` | `ket_forras_ket_igazsag (1)(2).html` |
| `games/titkos-leveltar/index.html` | `titkos_leveltar_reformkor(3).html` |
| `games/korona-nyomaban/index.html` | `korona_nyomaban_erettsegi_v2(3).html` |
| `games/szokereso/index.html` | `szokereso_tortenelem_9_12(3).html` |

A fájlok másolásakor a játékok működése és történelmi tartalma nem változott.

## Azonos nevű változatok és további bemenetek

Két, azonos játékhoz tartozó, de nem byte-azonos fájl érkezett:

| Fájl | Méret | SHA-256 | Kezelés |
| --- | ---: | --- | --- |
| `ket_forras_ket_igazsag (1)(2).html` | 198 755 bájt | `e88734ec7814c1fbeb0ef3bb8c0e5556473b3b3b05839def4c2108447e0d77e3` | A nagyobb, kibővített változat; ez került a projektbe. |
| `ket_forras_ket_igazsag(4).html` | 46 907 bájt | `fffdaee1729c77d2b231a3191043512e409244885ac8d998af20c15014fdceb0` | Külön változat; nem került felülírásra vagy törlésre. |

Az `index (8)(2).html` egy külön, „Tanári játéktár” című összefoglaló nyitóoldal. A jóváhagyott célstruktúra nem tartalmaz gyökérszintű `index.html` fájlt, ezért ezt a projekt nem másolja be. Az eredeti feltöltés változatlanul megmaradt.

## Fejlesztési munkarend

- Kövesse a [`docs/DEVELOPMENT_RULES.md`](docs/DEVELOPMENT_RULES.md) előírásait.
- Tartalmi módosítás előtt ellenőrizze a [`docs/PEDAGOGICAL_RULES.md`](docs/PEDAGOGICAL_RULES.md) korlátait.
- Minden változtatást ellenőrizzen a [`docs/TESTING_CHECKLIST.md`](docs/TESTING_CHECKLIST.md) alapján.
- Új fejlesztéshez hozzon létre külön Git-ágat, például: `git switch -c feature/rovid-leiras`.


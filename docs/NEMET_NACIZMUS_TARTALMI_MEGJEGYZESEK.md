# A nemzetiszocialista Németország – tartalmi és technikai megjegyzések

Érintett fájlok: `games/nemet-nacizmus.html` (gyakorló játék), `demos/bemutato_nemet_nacizmus.html` (17 diás órai bemutató).
Forrás: Történelem 11. tankönyv (OH-TOR11TB), 19. lecke „A nemzetiszocialista Németország”, 168–174. oldal. A tartalom a tankönyv szövegéhez és ábráihoz igazodik; a tankönyven kívüli történelmi adatot a két anyag szándékosan nem tartalmaz.

## 1. A két anyag

- A gyakorló játék hét nézetből áll: áttekintés, idővonal, fogalmak, csoportosítás, források, kvíz (26 kérdés), kifejtés.
- A bemutató 17 dia, diánként tanári jegyzettel; a tankönyvi ábrák beágyazott képként szerepelnek.
- Mindkettő önálló, külső erőforrást nem töltő fájl. A betűtípusok rendszerbetűk (Georgia / rendszer sans-serif), ezért a megjelenés kissé eltérhet a tervezett Spectral / IBM Plex Sans betűktől.

## 2. Ellenőrizendő állítások (tanári döntés)

| Állítás | Probléma | Ellenőrizendő |
| --- | --- | --- |
| NSDAP „37,8%” (1932), kommunisták „14,3%” | A tankönyv (170–171. o.) ezt közli, és a két anyag szó szerint átvette. A Német Történeti Múzeum (DHM, LeMO) „Ergebnis der Reichstagswahl am 31. Juli 1932” oldala az NSDAP-ra 37,3%-ot ad. A KPD értékét az átnézett oldal nem tartalmazza. | Tanári döntés: a tankönyvi érték megtartása (jelenleg így van), vagy megjegyzés / javítás hivatalos forrás alapján. A KPD 14,3%-ának külön ellenőrzése. |
| Saar-vidéki népszavazás: „kb. 90%” | A tankönyvben ábra szerepel (kb. 477 ezer szavazat a ~527 ezerből); az arány a közelítő ábraadatokból **számított** érték, nem szó szerinti tankönyvi szám. A dián és a jegyzetben jelölve van. | Pontos hivatalos eredmény ellenőrzése, vagy a „kb.” megfogalmazás jóváhagyása. |
| Nürnbergi törvények: „legalább két izraelita vallású nagyszülő” | A tankönyv egyszerűsítő megfogalmazása; a törvényi besorolás részletei ennél összetettebbek. A két anyag a tankönyvi szöveget követi. | Elég-e az egyszerűsítés érettségi felkészítéshez, vagy kell pontosító megjegyzés. |
| Weimari alkotmányra vonatkozó feladat (a bemutató 10. diáján; tankönyv 160. o., 18. téma) | A feladat a vizsgált PDF-en kívüli oldalra utal; a bemutató csak jelzi, tartalmilag nem dolgozza ki. | A kapcsolódó tananyag megléte az osztály számára; szükség esetén külön dia. |
| Kvízkérdések, rossz válaszlehetőségek, indoklások, kifejtési „mintaszempontok” | Tanári javaslatok a tankönyvi szöveg alapján, nem hivatalos érettségi feladatsorból. | Átnézés és jóváhagyás. Az érettségi (közép- vagy emelt szintű) témavázlatokkal ebben a munkában nem történt újraegyeztetés. |
| Mein Kampf-idézet („a tömeg befogadóképessége korlátolt…”) | A tankönyv tartalmi kivonata, nem szó szerinti idézet; a dián „tartalmi kivonat” jelzéssel szerepel. | A megfogalmazás jóváhagyása. |

## 3. Képek és jogok

- A bemutató nyolc képe a tankönyv (OH) ábráiból készült kivágás; kiadói anyag, a felhasználó birtokában lévő PDF-ből. Iskolai, órai használatra szánt; nyilvános terjesztés előtt a felhasználási feltételek ellenőrzendők.
- A náci jelképeket a két anyag nem jeleníti meg önálló grafikaként; a hub-illusztrációk absztrakt rajzok.
- A zsidóüldözéssel kapcsolatos dia érzékeny téma; a tanári jegyzet tárgyilagos, forrásalapú tárgyalást javasol.

## 4. Böngészőben tárolt adatok (localStorage)

| Kulcs | Tartalom | Törlés |
| --- | --- | --- |
| `nn_*` | A gyakorló haladása: idővonal-állapot, fogalomkártya-jelölések, kvíz legjobb eredménye (`quizBest`), kifejtési vázlatok (`drafts`) és az ellenőrző szempontok jelölései (`essayChecks`). | A böngésző adatainak törlésével; a nézetekben lévő „Újrakezdés” gombok a saját nézet állapotát állítják vissza. |

A tárhely tiltása vagy megtelése nem állítja le a játékot (a hozzáférés `try/catch`-ben van). A bemutató semmit nem tárol; csak az aktuális dia sorszámát írja az URL hash-ébe (`#d3`).

## 5. Technikai megjegyzés

A játék kizárólag egyszerre egy kvíz-kérdést enged megválaszolni; a már megválaszolt kérdés gombjai letiltottak, így dupla kattintás vagy ismételt Enter nem pontoz kétszer. Nincs mentett „folytatás”: a haladás (kvíz legjobb eredménye, vázlatok) mentődik, a félbehagyott kvíz nem.

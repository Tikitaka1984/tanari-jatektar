# M07 – Integrációs és ellenőrzési terv

## Engedélyezett cél és hatókör

A felhasználó részletes M07 feladatleírása alapján három nehézség célzott integrációja történik az aktuális főágból indított `feature/roma-9-main-integracio-m07` ágon. Nem történik régi ágmerge, történelmi újraírás, újraegyensúlyozás, main-módosítás vagy production telepítés.

Bázis: `a3669271da16286b164a8f395aa7814e236d8b47` (main; 8.0 játék). Korábbi 9.0: `b05a5970a9b51a9c763962159608aafe52b8ccfc` (PR #11 a `feature/iranyitsd-romat-jatek` ágba olvadt). A kötelező öt szabályfájlt elolvastam; a korábban vizsgált verzióhoz képest változatlanok.

Érinthető fájlok: `games/iranyitsd-romat.html`, ennek egyetlen `manifest.json` bejegyzése, saját `tests/roma-9-*` tesztek és `docs/qa/roma-9-*` bizonyítékok.

## Megoldási döntés

A célzott forrásdiff integrációja megtartja a jelenlegi főág összes korábbi fejlesztését. A normál mód `scaled()` függvénye identitásként adja vissza a helyi törtértéket; a meglévő `applyRegions()` végzi a súlyozás utáni kerekítést. A könnyű/nehezített profilok és kerekítések változatlanok. A régi ág teljes merge-e elavult fájlokat hozna vissza; a közös tartományi kerekítés átírása a könnyű és nehéz módot is önállóan újraegyensúlyozná, ezért egyik megoldást sem alkalmazzuk.

A nehézségválasztó a régi 9.0 natív rádiógombjait használja. Könnyű módban az eredeti adatokból számított névleges birodalmi hatások adnak tényleges többletsegítséget. A történelmi kérdés minden szinten az eredeti kérdés; nehéz módban a rövid választási segítség rejtett, a történelmi jelentés és tudástár változatlan.

A felület javításai a használhatóságra korlátozódnak: görgethető mobilos nyitóablak, névvel rendelkező modalitás és háttér `inert`, irányított fókusz, térképi vezérlők fókuszmegőrzése, tudástári Tab/nyílkezelés, a nehézségválasztó feliratának célzott kontrasztjavítása, ismételt billentyű és többszörös kattintás elleni őr. A meglévő 520 ms-os nyitóanimáció időzítője újrakezdéskor törlődik.

A TXT formátuma és fájlneve megmarad. A nehézség mellett csak a már kiszámított végső cím és pontszám kerül új sorként az exportba. Az eredeti napló, indoklások és reflexiók változatlanul szerepelnek.

## Ellenőrzési terv

1. A korábbi normál eltérés reprodukálása legalább 20 döntéssorozaton és kerekítési próbákon.
2. A tényleges első inline játékscript modelljének végrehajtása: mind a 6561 nyolcfordulós út, minden döntés után és következő ülés/eredmény kezdetén összevetve a valódi 8.0-val. A renderelés csak ebben a számítási harnessben elnyomott; az eredeti végső értékelő függvény fut.
3. Könnyű és nehéz mód mind a 6561 útjának összevetése a régi 9.0-val; véges, 0–100 közötti állapotok és teljes nyolcfordulós befejezés.
4. 125 szélsőértékes modellpróba és nyolc kerekítési teszt.
5. Valódi Chromium/Playwright: mindhárom mód teljes billentyűs játéka 360/768/1280 px-en; tényleges TXT-letöltés és reset. Ezenfelül 20 külön normál sorozat mindkét verzióban, natív egérvezérléssel, fordulónkénti összevetéssel.
6. Dupla kattintás, Enter/Space ismétlés, modalok, térkép, tudástár, gyors animáció–reset verseny, részleges export és helyi hub iframe.
7. Védett történelmi forrásrészek és értékelési képlet bájtos összevetése, inline/CJS szintaxis, a pontos UTF-8 méret/MD5 és más manifestbejegyzések változatlansága.
8. A kód- és tesztcommit után teljes futtatás, forrás/test SHA-256 bizonyíték. Csak dokumentációs commit követheti; a végleges PR forrása és a tesztelt forrás hash szerint egyezzen.

## Korlátok és jóváhagyást igénylő döntések

Valódi képernyőolvasó nélkül NVDA/VoiceOver PASS nem állítható; teljes WCAG-tanúsítás nem célzott. Fizikai mobil, Safari/Firefox, tényleges hosszú tanórai használat külön ellenőrzés marad.

A korábbi nehéz profil két birodalmi kezdőmutatója magasabb a normálnál (határvédelem 60 vs. 55; bizalom 60 vs. 57). A profilt nem módosítjuk automatikusan; a nehezítés a tartományi −12 induló stabilitásból és a döntési/válságszorzókból is adódik. Bármilyen profil- vagy pontozási újraegyensúlyozás tanári jóváhagyást igényel.

A terv önellenőrzése: nincs nyitott tervezési helyőrző; a számítási és böngészős bizonyíték külön szerepel; a történelmi tartalom védett; a végrehajtás a felhasználó által engedélyezett integrációra korlátozott. A végén külön Draft PR készül, beolvasztás csak további kifejezett engedéllyel.

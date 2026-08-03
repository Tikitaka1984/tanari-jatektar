# AGENTS.md

Ez a fájl a repository teljes területére érvényes, tartós Codex-fejlesztési szabályokat rögzíti.

## Projektcél és technológiai keretek

- A projekt önálló történelmi oktatójátékok gyűjteménye.
- A játékok maradjanak statikus HTML-, CSS- és JavaScript-alkalmazások.
- Ne kerüljön be frontend keretrendszer.
- Ne vezess be buildfolyamatot, csomagkezelőt vagy futásidejű szerverfüggőséget, ha azt a feladat külön nem engedélyezi.
- Minden játék közvetlenül a saját `games/<jatek-neve>/index.html` fájljából maradjon futtatható.

## Kötelező hatókörvédelem

- Egyszerre csak a feladatban egyértelműen kijelölt játék változhat.
- A kijelölt játékon kívüli játékfájlokhoz ne nyúlj.
- Más fájlt ne törölj külön felhasználói engedély nélkül.
- Ne nevezz át és ne helyezz át eredeti projektfájlt külön engedély nélkül.
- Kerüld az egész fájlt érintő automatikus újraformázást és a feladaton kívüli refaktorálást.
- Ha a kért módosítás több játékot vagy közös szabálydokumentumot is érintene, előbb kérj külön jóváhagyást a hatókör bővítésére.

## Történelmi és pedagógiai tartalom védelme

- A történelmi tartalom automatikusan nem módosítható.
- Ne írd át automatikusan a kérdéseket, válaszokat, helyes megoldásokat, magyarázatokat, évszámokat, neveket, fogalmakat, forrásrészleteket vagy pontozási szabályokat.
- Tartalmi változtatást csak kifejezett felhasználói kérésre, tanári jóváhagyással és ellenőrzött forrás alapján végezz.
- Technikai javítás nem változtathatja meg észrevétlenül a feladat jelentését, nehézségét, helyes válaszát vagy tanulási célját.
- Ha történelmi vagy pedagógiai bizonytalanság merül fel, ne dönts önállóan. A bizonytalanságot külön Markdown-dokumentumban rögzítsd a `docs/` mappában, az érintett állítás, a probléma és az ellenőrizendő kérdés pontos megadásával.
- Vitatott történelmi kérdést ne jeleníts meg egyetlen, vitathatatlan állításként.

## Fejlesztési munkafolyamat

1. A módosítás előtt olvasd el a `README.md`, a `docs/DEVELOPMENT_RULES.md`, a `docs/PEDAGOGICAL_RULES.md` és a `docs/TESTING_CHECKLIST.md` releváns részeit.
2. Ellenőrizd a Git-állapotot és azonosítsd pontosan a kijelölt játékot.
3. Fejlesztés előtt adj rövid tervet: érintett fájlok, tervezett változtatás, kockázatok és ellenőrzések.
4. Minden fejlesztést külön Git-ágon végezz.
5. A változtatásokat kis, ellenőrizhető commitokra bontsd.
6. Csak a jóváhagyott hatókör fájljait módosítsd és stage-eld.
7. A végén ellenőrizd a diffet, különösen a történelmi szövegek és a pontozási logika környezetében.

## Kötelező tesztelés fejlesztés után

Minden érintett játéknál legalább az alábbiakat ellenőrizd:

- mobilnézet 360, 768 és 1280 px szélességen;
- teljes billentyűzetes működés;
- logikus Tab-sorrend és látható fókuszkezelés;
- nézetváltás és párbeszédablak után helyes fókuszpozíció;
- újrakezdés: pontszám, állapot, időzítő és visszajelzések visszaállítása;
- gyors dupla kattintás, ismételt Enter vagy Space ne okozzon dupla műveletet vagy dupla pontozást;
- a már értékelt válasz ne módosíthassa újra a pontszámot;
- ne legyen JavaScript-konzolhiba a betöltés, játékmenet, újrakezdés és befejezés során.

Ha valamelyik ellenőrzés nem végezhető el, azt ne jelöld teljesítettnek: írd le pontosan a hiányzó ellenőrzést és annak okát.

## Átadás

- Sorold fel a módosított fájlokat.
- Röviden írd le, mi változott és mi maradt érintetlen.
- Add meg az elvégzett teszteket és azok eredményét.
- Jelezd a fennmaradó kockázatokat, tartalmi bizonytalanságokat és a szükséges felhasználói döntéseket.
- Ne hozz létre vagy ne publikálj weboldalt, ne aktiválj GitHub Pagest, és ne változtasd meg a repository láthatóságát külön felhasználói engedély nélkül.

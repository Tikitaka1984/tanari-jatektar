# Nagy Válság – kormányzati döntések: tartalmi és technikai megjegyzések

Dátum: 2026-10-31. Érintett fájlok: `games/nagy-valsag.html` (diákváltozat, telefonra optimalizált), `games/nagy-valsag-tanari.html` (tanári változat, eredménytáblával).

## 1. A két változat

- A két fájl ugyanazt a játékmotort és ugyanazt a tartalmat tartalmazza; a tanári változat annyiban több, hogy van benne „Tanári eredménytábla” fül (a csoportok eredménykódjainak beillesztésével rangsor).
- Mindkettő önálló, hálózati kapcsolat nélkül futó fájl (a betűtípusok és az ikonok beágyazottak); külső erőforrást nem tölt be. A fájlokban lévő külső hivatkozások (Federal Reserve History, U.S. Department of Labor) csak kattintható forrásmegjelölések.
- A hubon belül két külön kártyaként szerepelnek, mert a tanári tábla a diákok kezében nem kívánatos.

## 2. Tartalom forrása és ellenőrzöttsége

- A szimulátor **modellje didaktikai célú**: a számértékek (kiinduló pálya, hatások, pontozás) illusztratívak, nem valós adatokra illesztett előrejelzések. Ezt a játék maga is kiírja.
- A játék tartalma **nem a hivatalos érettségi témavázlatból** (`Tortenelem_erettsegi_temavazlatok_II__Emelt_szint.txt`) vagy az OH-tankönyvekből készült szó szerint, és ebben a munkában nem lett velük újra összevetve. Az emelt szintű (E) jelölés ezért nincs a játékban.
- A „Nagy gazdasági világválság – kattintható ábrák” kártya (`games/vilagvalsag.html`, az OH tankönyv 18. leckéje alapján) külön játék; a két játék témája átfed, de a mechanikájuk és a tartalmuk független. Egységesítésük nem történt meg.

## 3. Ellenőrizendő állítások (tanári döntés)

| Állítás a játékban | Probléma | Ellenőrizendő |
| --- | --- | --- |
| „Mintegy 9 000 amerikai bank csődje (1930–1933)” (hírsáv és okok-lánc) | Kerek, közkeletű szám; ebben a munkában elsődleges forrással nem lett újra megerősítve. | Hivatalos forrásból (pl. Federal Reserve History) a pontos érték és a meghatározás (megszűnt bankok száma) megerősítése. |
| „Világkereskedelem értéke kb. −66% (1929–1934)”; „volumene kb. −25%” | Gyakran idézett becslés; a módszertől függően eltér. Nem lett újra ellenőrizve. | Forrás megjelölése, vagy „becslések szerint” megfogalmazás jóváhagyása. |
| Dow Jones −13%, majd −12% (1929. okt. 28–29.) | Napi adatokra hivatkozik, kerekítve. | Forrásból (Federal Reserve History – Stock Market Crash of 1929) a pontos napi értékek összevetése. |
| „A Legfelsőbb Bíróság ítélete (1936. január)” – AAA | Az ítélet pontos dátuma és megfogalmazása a játékban hónap pontossággal szerepel. | A pontos dátum és az ítélet megnevezésének ellenőrzése. |
| „Győri Program (1938. március)” | A játékbeli döntési lehetőségek (nagyszabású / visszafogott) és hatásai a modell része, nem történelmi tény. | Annak tanári jóváhagyása, hogy a két opció pedagógiailag megfelelő egyszerűsítés. |
| Magyar forgatókönyv kiinduló értékei | A „Illusztratív kiinduló pálya (nem pontos történelmi adat)” felirat jelzi, hogy nem mért adatokról van szó. | Tanári döntés: elég-e ez a jelzés, vagy forrásos adatsor kell. |
| Amerikai munkanélküliség (1933: 24,9%, kb. 12,8 millió fő) | Kerekített, becslésen alapuló adat; ebben a munkában elsődleges forrással nem lett újra megerősítve. | Az érték és a mérési módszer ellenőrzése hivatalos statisztikai forrásból. |
| Németország (1932): munkanélküliség „kb. 6 millió fő (~30%)”; NSDAP szavazataránya 2,6% (1928) → 37,3% (1932. júl.) | Kerekített, közkeletű értékek; nem lettek újra ellenőrizve. A munkanélküliségi adat forrásonként eltérhet. | Forrásból a pontos értékek és a mutató meghatározásának ellenőrzése. |
| Magyarország: bolletta-rendszer (1930), a Creditanstalt csődje és a magyarországi bankpánik (1931. május) | A játék tájékoztató szövegében szerepel; nem lett újra összevetve a hivatalos témavázlattal. | A szöveg átnézése a témavázlat és az OH-tankönyv alapján. |
| Brit fordulat (1931): a font leértékelődése „kb. −25–30%” | Kerekített becslés. | Forrás megjelölése, vagy a megfogalmazás jóváhagyása. |

Megjegyzés: a játék nem tartalmaz történelmi szereplőknek tulajdonított idézetet. A táblázat a bizonytalanságokat rögzíti; a történelmi szövegeket ez a munka nem módosította.

## 4. Böngészőben tárolt adatok (localStorage)

| Kulcs | Tartalom | Törlés |
| --- | --- | --- |
| `nv_game_v1` | A folyamatban lévő játék: beállítások (forgatókönyv, osztálykód, csapatnév, szakértői becslések száma) és a műveletsor; betöltéskor a játék a műveletsor lejátszásával áll vissza. | „Újrakezdés” gomb |
| `nv_quiz_v1` | Az ellenőrző kvíz pontszáma (egyetlen szám; a megválaszolt kérdések nem kerülnek mentésre). | „Újrakezdés” gomb |
| `nv_lb_v1` | A tanári eredménytábla beillesztett eredménykódjai (csak a tanári változatban). | A táblán belüli törlés (megerősítéssel) |
| `nv_profile_v1` | A megjegyzett csapatnév és osztálykód a következő indításhoz (a diákváltozat nyitóképernyőjén). | Böngészőadatok törlése |

- Sérült vagy hiányzó mentés esetén a játék a nyitóképernyőre lép; tiltott tárhely esetén a játék tárolás nélkül, hibaüzenet nélkül játszható.
- A kulcsok verziószámot (`_v1`) viselnek; formátumváltozásnál új kulcs vagy migráció szükséges.

## 5. Biztonsági korlátok

- Az eredménykód (`NV1|` előtagú, base64 JSON és ellenőrző összeg) **csak a véletlen vagy gondatlan módosítást jelzi**; nem kriptográfiai védelem. Aki ismeri a formátumot, hamis kódot tud előállítani.
- A tanári fül **nincs hitelesítéssel védett**; a tanári változat fájlját nem szabad a diákoknak kiadni. Ezért van külön diákváltozat.
- A játék semmilyen személyes adatot nem küld el; az eredménykódot a diákok maguk másolják vagy küldik el a tanárnak.

## 6. Tesztelés (2026-10-31)

Automatizált böngészős ellenőrzés (Playwright/Chromium), mindkét fájlon, a `docs/TESTING_CHECKLIST.md` szempontjai szerint:

- 360, 768 és 1280 px: végigjátszható, nincs vízszintes túlcsordulás, nincs konzolhiba, nincs sikertelen erőforrás;
- teljes billentyűzetes működés (Tab, Enter, nyílbillentyű a csúszkán, Space a kapcsolókon), a fókusz nézetváltás után az új képernyő címére kerül, látható fókuszkeret;
- dupla kattintás és ismételt Enter: egy művelet (egy évlépés, egy rögzített döntés, egy szakértői becslés, legfeljebb 1 kvízpont);
- újrakezdés, mentés és folytatás, sérült mentés, érvénytelen műveletsor, tiltott tárhely;
- a hubon belül, iframe-ben is játszható; Esc bezárja a nézőt.

Nem végeztünk: valódi telefonon végzett kézi teszt, képernyőolvasós (NVDA/VoiceOver) próba, és nincs hozzá a repository tesztkészletébe (`tests/*.cjs`) felvett automatizált teszt.

## 7. Ismert, a munkán kívüli megjegyzés

- A `tests/hub-browser.test.cjs` már a jelen változtatás előtt sem egyezett a hub állapotával (a hub kártyáinak számát másképp várja); ezt a munka nem javította és nem módosította.
- A hub oldala a Google Fonts-ot külső forrásból tölti; internet nélküli környezetben ez a kérés meghiúsul, a játékfájlokra ez nem vonatkozik.

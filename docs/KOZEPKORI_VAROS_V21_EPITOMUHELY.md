# Építs középkori várost! – v2.1 szabad építőműhely (fejlesztői másolat)

**Dátum:** 2026-11-10 · **Állapot:** korlátozott, külön 2.1-es prototípus, még nem kiadásra kész.

## Mit változtat a v2.1?
- Új teljes HTML-másolat: `games/epits-kozepkori-varost-v21-epitomuhely.html`.
- A hat történelmi küldetés, 12 vizsgakérdés, 60 pontos tudásellenőrzés és a tananyag a v2.0 P0 szövegével és javításaival megmarad.
- Az **első küldetés teljesítése után** aktívvá válik a „Városépítő műhely”.
- **6×5 telek:** középső sorban meglévő főút. A diák saját maga választ üres telket, és ott épít.
- **Választható építmények:** út, lakóház, vízimalom, városkapu, piactér, céhes műhely, raktár, városháza.
- **Történelmi logikára épülő játékszabályok:** úthoz csatlakozás, vízimalom folyópart mellett, városkapu településszélen, küldetésekhez kötött építményfeloldás.
- **Játékgazdaság:** két egyszerű, nyíltan oktatási modellként jelölt erőforrás (faanyag és kereskedelmi keret); a választott épületnek költsége van, az erőforrások a küldetések előrehaladásával nőnek.
- **Azonos állás 2D és 3D nézetben:** telkenként kirajzolt épület/út; kijelölhető telkek a 2D képen és a 3D világban, valamint külön billentyűzettel kezelhető építési rács.
- **Visszavonás:** az utolsó építés törlése; az adott erőforrás visszakerül a keretbe.
- **Külön helyi mentések:** küldetések = `kozepkori-varos-v21-tanulas`, építménylista = `kozepkori-varos-v21-epitohelyek`. Az építmények külön mentése a v1.1/v2.0 tárolását nem érinti.
- **Új város építése:** a küldetések újrakezdése az építménylistát is kiüríti.

## Oktatási megkötések
A szabad építési rendszer **nem jelent városi jogállást**. A városkapu vagy városháza építése nem hoz létre kiváltságokat; a küldetések külön vizsgálják a jogi folyamatokat.

A bemutatott ellátás, áruforgalom, védelem és intézmények mutatói **önkényes, játéktechnikai indexek**, nem hitelesített középkori adatsorok vagy történelmi valószínűségek. A v2.1 ezek első, szemléltető modellje; a következményrendszer mélyítése a v2.2 feladata.

## Helyi játékmenet (példa)
1. Az 1. küldetés forráselemzésének és tudásellenőrzésének teljesítése.
2. A műhelyben „Összekötő út” kiválasztása; kattintás C2 telekre, amely a C3 főúthoz kapcsolódik.
3. „Lakóház” kiválasztása; kattintás C1 telekre, amely az új C2 útra kapcsolódik.
4. „Vízimalom” kiválasztása; kattintás A2 telekre, a folyópart mentén, a meglévő A3 úthoz kapcsolódva.
5. Nézetváltás 2D/3D között. A telek és az épületek megmaradnak.
6. Az „Utolsó építés visszavonása” gomb egy építményt eltávolít.

## Hozzáférhetőség
Minden telek külön, teljes billentyűzettel elérhető gomb a műhelyrácsban; a 3D-s és 2D-s közvetlen kiválasztás csak kényelmi alternatíva. Az aktuális építési visszajelzés `role=status` élő régióban jelenik meg. A valós WCAG-, fókusz- és 360/768/1280 px regresszió külön követelmény.

## Kiadás előtti tesztek (külön QA)
- [ ] Mind a 6 történelmi küldetés végigjátszása
- [ ] Építés feloldása csak az 1. küldetés után
- [ ] Helyes út/ház/malom/kapu/piac elhelyezés, megjelenítés mindkét térképen
- [ ] Hibás telek / hiányzó út / nem folyóparti malom / zárolt típus / elégtelen erőforrás blokkolása
- [ ] 2D és 3D térképen közvetlen telekkattintás
- [ ] Útvonal mentése oldalfrissítéskor; kétféle localStorage-kulcs izolációja
- [ ] Utolsó építés visszavonása és a helyes költségvisszatérítés
- [ ] Teljes újrakezdéskor minden épület, pont és küldetés törlése
- [ ] 360 / 768 / 1280 px, fókusz, Tab, Enter, Space, mobilérintés
- [ ] WebGL és CDN-hiba esetén 2D/HTML-rács működése
- [ ] Konzolhiba-mentesség és memóriahasználat ellenőrzése

## Verzióvédelmi megállapodás
**Nem módosulhat**: `games/hanza.html`, minden korábbi `epits-kozepkori-varost-*.html`, a v2.0 P0, az éles hub vagy más játék. A v2.1 egy új fájl a `feature/kozepkori-varos-v21-epitomuhely` ágon, önálló, összevonás nélküli draft PR-ban. Élesítése külön tanári döntést és befejezett QA-t igényel.

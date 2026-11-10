# Építs középkori várost! – v2.2: építési következmények és történelmi döntések

**Verzió:** V2.2 külön HTML tesztmásolat – `games/epits-kozepkori-varost-v22-dontesek.html`  
**Kiindulási állapot:** V2.1 eredeti fájlját nem módosítjuk.  
**Évfolyam:** 9. osztály, tananyag: középkori városfejlődés, városi jogok, céhek és kereskedelem.

## 1. Oktatásmódszertani cél

A V2.1 már lehetővé tette nyolc épülettípus önálló elhelyezését a 6×5-ös építési területen. A V2.2 továbbviszi ezt: a város szerkezete, az intézmények és a tanuló **külön megindokolt döntései** megváltoztatják az oktatási szimulációs mutatókat. A játék a **kontextusfüggő történelmi mérlegelést** fejleszti, nem egyetlen kötelező „optimális” várost építtet.

**A hat régi történelmi küldetés, a 12 kérdés, a külön Tananyag fül és a 60 pontos objektív értékelés változatlan.** A V2.2 következményei ettől teljesen elkülönített, önálló játékmodell-értékek.

## 2. Változatvédelem

- **Új GitHub-ág:** `feature/kozepkori-varos-v22-dontesek-kovetkezmenyek`, kiindulási ág: `feature/kozepkori-varos-v21-epitomuhely`.
- **Új fájl:** `games/epits-kozepkori-varost-v22-dontesek.html`.
- **Új mentési kulcsok:** `kozepkori-varos-v22-tanulas` és `kozepkori-varos-v22-epitohelyek`, mindkettő a böngésző localStorage tárolójában.
- A `main`, a Hanza, a v0.x, a v1.x, a V2.0 P0 és a V2.1 forrásai és mentései **változatlanul megmaradnak**.
- Csak Draft PR; semmi nem kerül összevonásra vagy élesítésre külön jóváhagyás nélkül.

## 3. Térbeli kapcsolatok – explicit oktatási szabályok

A játék továbbra is a v2.1 nyolc épületét használja, de a mutatókat a közelség is alakítja. A „közel” azt jelenti, hogy az épületek a rácson **legfeljebb két vízszintes/függőleges lépésre** vannak (Manhattan-távolság), és az adott építménytípusok legalább egy megfelelő párban előfordulnak.

| Kapcsolat | Szimulációs többlet | Tanulási értelmezés |
|---|---:|---|
| Vízimalom és lakóház | Ellátás +2 | Helyi munkaerő és feldolgozás szervezhetősége |
| Piactér és lakóház | Áruforgalom +1 | Helyi árucsere elérhetősége |
| Piactér és áruraktár | Áruforgalom +2 | Rövidebb árumozgatás |
| Piactér és céhes műhely | Áruforgalom +2 | Termelő és vevő kapcsolata |
| Városkapu és áruraktár | Védelem +1 | Árumozgás ellenőrzésének egyszerű szemléltetése |
| Három vagy több lakóház, malom nélkül | Ellátás –2 | Növekvő ellátási szükséglet szemléltetése |

**Valamennyi szám saját tervezésű játéktechnikai index**, nem középkori gazdasági statisztika, és nem állítható történelmi törvényszerűségként. A térbeli elhelyezkedéshez kapcsolódó hatás a kiváltó épület visszavonásakor automatikusan megszűnik.

## 4. Történelmi helyzetek – öt választható stratégiai kompromisszum

Minden helyzethez a tanuló **legalább 25 karakteres saját indoklást** ír. Az indoklás nem kap automatikus minőségi pontot. Két történelmileg mérlegelhető alternatívából választhat, amelyeknek eltérő következményei vannak:

| Helyzet | Feloldás | Alternatívák | Témakör |
|---|---|---|---|
| Gabonafelesleg felhasználása | 1. küldetés + malom és ház | Tartalékolás / piacra vitel | Terményfelesleg, árutermelés |
| Piacnap és közrend | 3. küldetés + piactér | Sűrűbb piacnap / őrzött piac | Vásárhely, útviszonyok, közbiztonság |
| Céhszabályok | 4. küldetés + műhely | Minőségellenőrzés / inasképzés | Céhrendszer, belépési korlát |
| Kereskedői utak | 5. küldetés + piactér és raktár | Őrzött út / gyorsabb út | Távolsági kereskedelem, veszélyek |
| Közösségi beruházás | 6. küldetés + városháza | Vízi ellátás / védművek | Városi tanács, közösségi döntés |

A választások nem adnak külön történelmi tudáspontot, és **nem teremtenek automatikusan városi kiváltságot**. Az egyik döntés nem univerzálisan jobb a másiknál. A történelmi magyarázat a döntés korlátját is bemutatja. A céhszabályok 1345-ös frankfurti forrása **későbbi összehasonlító példa**, nem egy 1250 körüli településből rekonstruált szabály.

## 5. Szimulációs működés és korrekció

- **Mutatók:** Ellátás, Áruforgalom, Védelem, Városi intézmények.
- A sorrend és hatás három összege: alap épülettípus-hatás + térbeli közelségi bónusz vagy terhelés + az **aktuálisan aktív** történelmi döntések következményei.
- Az esemény hatása csak akkor érvényesül, ha a szükséges épületek a városban megvannak. Ha például visszavonják a raktárt, a kereskedői útválasztás korábban rögzített eredménye megmarad a naplóban, de **átmenetileg nem hat** a mutatókra.
- A modellmutatók 0 alá nem mehetnek; az alakulásuk minden építés, visszavonás és döntés után újraszámolódik.
- A tanuló döntését külön gombbal újragondolhatja; ez a következmények újratervezésére alkalmas, nem ismételt pontszerzésre.
- A **Döntési napló** megmutatja az építkezés és a történelmi döntések legutóbbi hét eseményét; a külön szöveges összefoglaló másolható.
- A teljes játék végső visszajelzése külön tartalmazza az építési döntések és a modellkövetkezmények összegzését.

## 6. Pedagógiai megjegyzések és források

A városi jogállás, kommuna, polgárjog, céhek és az áruforgalom történelmi összefüggései továbbra is a hat tananyagfejezetben és forráselemző feladatban tanulhatók. A szimuláció e megértés **alkalmazását** gyakoroltatja.

- Szent István Társulat: *Történelem 9.*, „A polgárok világa”, 100–104. oldal.
- Oktatási Hivatal: *Történelem 9.* (OH-TOR09TB), 106–112. oldal.
- A döntési alternatívák tanári szakmai tervezések, **nem átvett középkori oklevélidézetek**.
- A játékban a szöveghossz csak technikai minimum, az érvelés történelmi minőségét a tanár értékeli.

## 7. Kötelező kiadás előtti ellenőrzés

- [ ] 6 történelmi küldetés végigjátszása, 60/60 és 0/60 próba.
- [ ] 6×5 építési rács, elhelyezés és úthálózati megközelítés.
- [ ] Közelségi bónusz ugyanazon és másik épülethelyzetnél; a megfelelő számítás és a kijelzett indok.
- [ ] Történelmi esemény indoklás nélkül blokkolt, indoklás után döntés rögzíthető.
- [ ] Mind az öt esemény feloldási feltétele, két választása és hatása.
- [ ] Korábbi döntés újragondolása: nincs duplázott hatás.
- [ ] Épület visszavonása: az attól függő bónusz és történelmi döntési hatás megszűnik.
- [ ] Mentés és oldalfrissítés: épület, döntés, indoklás, napló és mutatók visszaállnak.
- [ ] Teljes újrakezdés: minden építés, választás és forráseredmény törlődik, korábbi verzió érintetlen.
- [ ] 360/768/1280 px mobil-/tablet-/kivetítő tesztek, fókusz, billentyűzet, kontraszt.
- [ ] WebGL/CDN hiba esetén a 2D térkép és a billentyűzettel használható építési rács működik.
- [ ] Nincs JavaScript-konzolhiba, duplapontozás vagy rejtett, nem tájékoztatott adatküldés.

**Kiadási állapot:** csak teljes QA után, tanári jóváhagyással állítható stabilra. A Draft PR önmagában nem élesítés.

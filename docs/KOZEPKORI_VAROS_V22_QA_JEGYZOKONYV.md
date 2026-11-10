# V2.2 következményrendszer – tesztjegyzőkönyv

**Tesztelt fájl:** `games/epits-kozepkori-varost-v22-dontesek.html`  
**Fejlesztői ág:** `feature/kozepkori-varos-v22-dontesek-kovetkezmenyek`  
**Publikálás:** kizárólag feature branch előnézet, nem élesített főverzió.  
**Források és kérdések:** a v2.1 változat 6 történelmi küldetése és 12 kérdése megtartva.

## 1. Statikus és determinisztikus ellenőrzés

- A JavaScript három blokkja (játék, külön építőmotor, Three.js modul) szintaktikailag helyes.
- Az események száma 5, egyenként két történelmileg mérlegelendő alternatívával.
- A térbeli modell izolált számítási tesztjei:
  - Egymáshoz közel elhelyezett **malom (A2) + lakóház (B2)**: alap 3+1, közelségi bónusz +2 = **6 ellátás**.
  - **Piac + raktár** közelsége: saját épülethatásokkal együtt **7 áruforgalom**.
  - Piac és raktár aktív kereskedői eseményeivel a modellkimenet **13 áruforgalom**.
  - Raktár eltávolításával az ahhoz kötött kereskedői esemény hatása nem számít bele, így az említett példa **6 áruforgalom**.
- A mutatók oktatási szimulációs értékek, nem történeti statisztikák vagy a 60 pont részei.

## 2. Böngészős teszt 1 – hibás tesztfeltevés feltárása

**Futam:** `bdf2da5c-4fd0-40fa-a458-3a1a1c4d843c`.

- A játék betöltött, a 6/6 Polyfork modell sikeresen megjelent.
- A tanuló sikeresen teljesítette az első történelmi küldetést **10/60** ponttal.
- Az A2 malom építése sikerült.
- Az eredeti tesztutasítás **A1 házat** kért az A2 malom mellett. Ez **nem érvényes építési útvonal**, mert az A1 nem kapcsolódik közvetlenül a meglévő főúthoz vagy más kiépített úthoz.
- A helyes útkapcsolati elutasítás nem programhiba, hanem **teszttervezési hiba**. A játék útmutatóját ezután pontosítottuk: **A2 malom + B2 lakóház** mindkét építési feltételt teljesíti, és egymáshoz is közel van.
- A2 malom visszavonása és az erőforrás visszatérítése sikeres volt.
- Ebben a futamban az esemény nem volt feloldva; eseménypontozásról nem állítható eredmény.

## 3. Böngészős teszt 2 – működő következményrendszer

**Futam:** `2c1202a1-6133-47e6-93db-9e27d92faea1`.

| Ellenőrzés | Megfigyelt eredmény |
|---|---|
| 1. küldetés tananyag, indoklás, két helyes válasz | Sikeres, 10/60 pont |
| A2 malom + B2 lakóház felépítése | Mindkettő látszott az építési rácson |
| Közelségi hatás | „A malom és a lakóház közelsége...” szöveg, Ellátás +2 |
| Teljes ellátási index a két épület után | **6** |
| „Kié legyen az őrölt gabona?” döntés megnyílása | Sikeres |
| Döntés üres indoklással | Blokkolt; legalább 25 karaktert kért |
| „Tartalék a lakosságnak” döntés történelmi indoklással | Sikeresen rögzítve |
| Ellátási index aktív döntéssel | **8** |
| Döntési napló | A választás és az indoklás rögzítése látszott |
| Épületek, küldetéspontok oldalfrissítés után | Megmaradtak: 2 építmény, 10/60 pont |
| **A konkrét eseményválasztás megmaradása oldalfrissítés után** | **NEM BIZONYÍTOTT** – az ügynök tesztfolyamatában újragondolás történt, a frissítés után 6 ellátás látszott |
| Visszavonás | B2 ház visszavonható; ellátás 3-ra csökkent |
| 2D és 3D nézet elérhetősége | Mindkét nézet működőként szerepelt a próbában |

**Fontos értelmezési korlát:** az eseményválasztás mentése szerepel a forráskódban, és statikusan ellenőrizhető, de a böngészős futam során **nem bizonyított** az a szigorú állítás, hogy az adott aktív döntés változatlanul fennmaradt frissítés után. Nem jelölhető lezártnak.

## 4. További nyitott P0/P1 minőségbiztosítási pontok

- [ ] Aktív történelmi döntés oldalfrissítés után változatlanul fennmarad.
- [ ] Visszavont épület esetén a már elmentett döntés hatása szünetel, a döntés naplóbejegyzése megmarad.
- [ ] Az összes öt történelmi helyzet (3–6. küldetés) teljes végigtesztelése.
- [ ] 6 küldetés, 60/60 és 0/60 objektív pont regisztrálása.
- [ ] A 360/768/1280 px szélesség, billentyűzetes és mobilos használat.
- [ ] Közvetlen 2D/3D telekkattintás, mind a 8 épülettípus későbbi feloldással.
- [ ] Mentés, újrakezdés, rossz adat, tiltottt localStorage, 3D/CDN hibaforgatókönyv.
- [ ] A következmény- és opciószövegek szakmai tanári validálása.

**Kiadási besorolás:** külön, működő fejlesztői tesztmásolat. A PR továbbra is Draft; nem összevonandó a főággal a teljes QA és tanári jóváhagyás nélkül.

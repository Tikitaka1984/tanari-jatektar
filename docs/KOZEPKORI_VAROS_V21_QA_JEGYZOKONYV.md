# V2.1 építőműhely – valós böngészős tesztjegyzőkönyv

**Tesztelt alkalmazás:** `games/epits-kozepkori-varost-v21-epitomuhely.html`  
**Böngészős környezet:** Vercel automatikus GitHub feature branch előnézet, normál asztali böngésző.
**Ellenőrzés napja:** 2026-11-10.  
**Megjegyzés:** nincs végleges kiadás; a régi v2.0 P0, v1.x és az eredeti Hanza változatlan.

## Végrehajtott end-to-end teszt

| Teszt | Elvárt | Ténylegesen megfigyelt |
|---|---|---|
| E1 indulás | 0/60 pont, 0/6 küldetés, építőműhely zárva | Sikeres |
| E2 háromdimenziós betöltés | 6 külső Polyfork GLB betöltése | 6/6 betöltve |
| E3 első tananyag/forráselemzés | Jegyzet, döntés, ellenőrző kérdések | Sikeres |
| E4 első küldetés pontozása | Két helyes válasz = 10/10 | Sikeres |
| E5 építőműhely megnyílása | Első küldetés lezárása után | Sikeres, kezdő keret 16 fa/10 kereskedelmi egység |
| E6 útépítés | C2 telek, C3 főúthoz kapcsolódva | Sikeres, fa: 16→15, 1 építmény |
| E7 lakóház építése | C1 telek, C2 úthoz kapcsolódva | Sikeres, fa: 15→13, 2 építmény |
| E8 vízimalom építése | A2 folyóparti telek | Sikeres, fa: 13→10; kereskedelmi keret: 10→9; 3 építmény |
| E9 nem megfelelő vízimalom | D1 telekre nem építhető | Elutasítva, költségek nem változtak |
| E10 kétdimenziós megjelenítés | Út, ház, malom külön telken | Mindhárom látszott |
| E11 háromdimenziós megjelenítés | Út, ház, malom tényleges térbeli objektumként | Mindhárom megjelent |
| E12 oldalfrissítés | A korábbi állás és a tudáspont megmarad | 10/60 pont és építmények megmaradtak |
| E13 visszavonás | Legutóbbi épület eltűnik; költség visszajön | Malom eltűnt; fa 10→13, kereskedelmi keret 9→10 |

**Tesztfutam azonosító:** `49772c53-e1a4-46c9-b8b3-000745f3397a`.

## Feltárt és javított eltérés

**Hiba:** a D1 telekre elhelyezni próbált vízimalomnál a program az útkapcsolat hiányát jelezte először. Valójában a folyóparti A-oszlopra vonatkozó földrajzi korlátot kell először megmagyarázni.

**Javítás:** az építési ellenőrzés sorrendjét úgy módosítottuk, hogy először a vízimalom folyóparti és a városkapu szélső telekre vonatkozó szabálya legyen ellenőrizve, és csak utána az útkapcsolat. **A javítást kódszinten ellenőriztük**, a végleges új hibaszöveg ismételt böngészős tesztje még hátravan.

## Még nyitott elfogadási kritériumok

- [ ] A 2–6. küldetés teljes végigjátszása, magasabb építményszintek feloldása.
- [ ] Minden megengedett és tiltott épülettípus tesztje, 2D és 3D közvetlen telkekkel.
- [ ] Építés elutasítása elegendő erőforrás hiányában, dupla kattintás mellett.
- [ ] Mentés visszaállítása a későbbi küldetéseknél, az építőműhely újrakezdésének ellenőrzése.
- [ ] Telektípusok szerinti 2D/3D térbeli azonosság, saját határok menti építés.
- [ ] 360, 768 és 1280 px viewport; érintős böngészők; billentyűzetes Tab/Space/Enter tesztek.
- [ ] Polyfork/Three.js CDN hiba esetén használható 2D térkép és HTML építőrács.
- [ ] JavaScript konzol- és WebGL memóriaellenőrzés.
- [ ] A mérőszámok tanulói félreértésének vizsgálata, a döntéskövetkezmény-kapcsolatok további pedagógiai fejlesztése.

**Kiadási állapot:** nem kész stabil kiadás, a PR draft. Az új építőműhely alapfunkciói bizonyítottan használhatók, de a teljes regresszió és a tartalom pedagógiai validálása nem lezárt.

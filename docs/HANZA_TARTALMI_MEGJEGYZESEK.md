# A Hanza kereskedői – Hálózat és hatalom: tartalmi és technikai megjegyzések

Dátum: 2026-11-01. Érintett fájlok: `games/hanza.html`, `assets/hub-hanza.svg`; a hub-bejegyzés (`index.html`), a `manifest.json` és a `README.md` csak az új játék felvételét tartalmazza.

## 1. Mi ez a játék

- Hot-seat (egy eszközön, körbeadott) stratégiai társasjáték 2–4 játékosnak, 11–12. évfolyamra. A játék nyomtatható változata (társasjáték-csomag, PDF) külön készült, ez a repóban csak az online változat.
- A játékmenet: hanzavárosok közötti szállítás (út, rakodás, kiszállítás), megbízások teljesítése, kereskedőtelepek építése. Minden kör elején egy Hansetag-kártya (16 db) három kérdésére a játékosok papíron válaszolnak; a jó válaszok bónusz akciót adnak.
- A teljes szabályleírás a játékon belül, a „Szabályok” gombbal érhető el.
- Az állás a böngészőben (`localStorage`, kulcs: `hanza-kereskedoi-online-v1`) automatikusan mentődik. „Új játék” törli. Tiltott vagy megtelt tárhely, illetve sérült mentés esetén a játék mentés nélkül, tiszta kezdőállapotból fut tovább.

## 2. Tartalom forrása és ellenőrzöttsége – FONTOS

- **A játék tartalma nem a hivatalos érettségi témavázlatból vagy OH-tankönyvből készült.** A Hanza a témavázlatban nem önálló tétel, és az OH-tankönyvekhez ebben a munkában nem volt hozzáférés.
- A Hansetag-kártyák háttérszövegei, kérdései és válaszai **másodlagos, nyilvános forrásokból** készültek (Wikipedia, New World Encyclopedia, The Collector, UNESCO Világörökség, Deutsches Historisches Museum, Fazekas Gimnázium tanári anyaga). A pontos lista a nyomtatott csomag tanári útmutatójában szerepel. **Ezek nem hivatalos, ellenőrzött oktatási források**, ezért tanári jóváhagyás nélkül nem tekinthetők érettségi-szintű tartalomnak.
- A játék nem tartalmaz történelmi szereplőknek tulajdonított idézetet.
- Osztálytermi kipróbálás (pilot) még nem történt.

## 3. Ellenőrizendő állítások (tanári döntés)

| Állítás a játékban | Probléma | Ellenőrizendő |
| --- | --- | --- |
| Kölni Konföderáció, 1367 (C1 kártya) | A megalakulás évét a másodlagos források nem egységesen adják meg; ebben a munkában elsődleges forrással nem lett eldöntve. | Hivatalos tankönyv vagy tudományos forrás alapján a megfogalmazás jóváhagyása. |
| Stralsundi béke, 1370 – kiváltságok és „15 évre a skóniai erődök ellenőrzése” | Közkeletű összefoglalás, elsődleges forrással nem lett újra összevetve. | Forrás megjelölése vagy a megfogalmazás jóváhagyása. |
| A1–D4 kártyák évszámai (1159, 1241, 1350, 1356, 1392–1440, 1469–1474, 1494, 1669) | Másodlagos forrásból átvett évszámok, ebben a munkában elsődleges forrással nem lettek megerősítve. | Tanári ellenőrzés hivatalos forrásból. |
| Termelő városok és áruk (pl. Köln – bor, Lüneburg – só, Bergen – szárított tőkehal, Novgorod – szőrme és viasz) | **Játékbeli egyszerűsítés**; a Köln–bor párosítás nem történelmi állításként, hanem játékmechanikai döntésként szerepel. | Tanári döntés: elég-e, hogy a játék ezt egyszerűsítésként jelzi, vagy módosítandó. |
| Megbízások értékei, akciószámok, VP-értékek | Játékegyensúlyi (didaktikai) paraméterek, nem történelmi adatok. | – (szimulációval egyensúlyozva, nincs történelmi állításértékük) |
| „Kereskedőtelep” elnevezés | A játék a Hanza külföldi kereskedőtelepének, a történelmi *kontornak* megfelelőjeként használja. A kártyák szövegében a történelmi „kontor” szó szerepel. | Tanári döntés a magyar szakkifejezés használatáról. |
| Nagy kereskedőtelepek: Bergen, London, Brügge, Novgorod | A négy történelmi kontor kiválasztása a forrásokból következik, de a pontos státuszuk (pl. Brügge) forrással nem lett újra összevetve. | Ellenőrzés hivatalos forrásból. |

## 4. Térkép

- A tábla földrajzi vázlat: a partvonalak a Natural Earth (közkincs) adataiból készültek kúpos vetítéssel; a városok vetített földrajzi koordinátái a rajzolást szolgálják. **A játékbeli távolságok és költségek nem a tényleges távolságból, hanem a játék gráfjából következnek.**
- A tengeri útvonalak stilizáltak, nem tényleges történelmi útvonalak. A térkép nem tartalmaz korabeli politikai határokat.
- A térkép és a bélyegkép nem hivatalos tankönyvi térképek reprodukciói.

## 5. Technikai megjegyzések

- Az önálló fájl a keretrendszer nélküli, statikus HTML/CSS/JS; a játékmotor és az adatok beágyazottak.
- **Külső erőforrás:** a betűtípusok (Cinzel, EB Garamond, Source Sans 3) a Google Fontsról töltődnek (`fonts.googleapis.com`), ahogy a repó több másik játékánál is. Hálózat nélkül a böngésző tartalék betűtípusra vált, a játék működik. A `DEVELOPMENT_RULES.md` 1. pontja szerint külső függőséghez előzetes műszaki és adatvédelmi ellenőrzés kell: **ez a jóváhagyás még nem történt meg**, tanári/üzemeltetői döntés szükséges (alternatíva: beágyazott betűtípusok).
- Billentyűzet: a térképre kattintás mellett minden lépés külön gombbal is elérhető („Lépés szomszédos városba”); az állapotváltozásokat egy `role="status"` régió olvassa fel; az ablakok alatt a háttér `inert`, bezáráskor a fókusz a megnyitó vezérlőre tér vissza. A térkép maga képként (`role="img"`) van megjelölve, a tábla állása a panelekből és a naplóból olvasható.
- Dupla kattintás és ismételt Enter ellen 320 ms-os védelem van (akció, kör vége, visszavonás, kártyapontozás).
- Ismert hiányok: a játék nem mentés-verziózott a v1-en túl (a sérült vagy más verziójú mentést eldobja); képernyőolvasós kipróbálás (NVDA/VoiceOver) nem történt, csak automatizált böngészős ellenőrzés.

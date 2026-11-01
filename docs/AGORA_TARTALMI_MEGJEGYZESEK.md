# Az Agóra urai – A demokrácia próbája: tartalmi és technikai megjegyzések

Dátum: 2026-11-01. Érintett fájlok: `games/agora.html`, `assets/hub-agora.svg`; a hub-bejegyzés (`index.html`), a `manifest.json` és a `README.md` csak az új játék felvételét tartalmazza.

## 1. Mi ez a játék

- Hot-seat (egy eszközön, körbeadott) társasjáték 2–4 játékosnak, 9. évfolyamra (Ókor – az athéni demokrácia). A nyomtatható változat (társasjáték-csomag, PDF) külön készült; a repóban csak az online változat van.
- Játékmenet: dobás, lépés az athéni tábla 30 mezőjén; a mezőkhöz tartozó kártyák (A–F pakli) feladatait a soron lévő játékos papíron megoldja, a hátoldali megoldás alapján az „esküdt” szerepű másik játékos részszempontonként pontozza; népgyűlési döntés-mezők (szavazás) és kimaradás.
- A teljes szabályleírás a játékban, a „Szabályok” gombbal érhető el.
- Az állás a böngészőben (`localStorage`, kulcs: `agora-urai-online-v2`) automatikusan mentődik. „Új játék” törli. Tiltott vagy megtelt tárhely, illetve sérült vagy érvénytelen mentés esetén a játék tiszta kezdőállapotból fut tovább (a mentés szerkezeti ellenőrzése `validState()`).

## 2. Tartalom forrása és ellenőrzöttsége – FONTOS

- **A játék tartalma nem a hivatalos érettségi témavázlatból vagy OH-tankönyvből lett ellenőrizve.** A kártyák egyszerűsített átdolgozások; a hivatalos témavázlattal és az OH-tankönyvvel való összevetés ebben a munkában nem történt meg (a dokumentumok nem álltak rendelkezésre).
- A játék nem tartalmaz történelmi szereplőknek tulajdonított szó szerinti idézetet.
- Osztálytermi kipróbálás (pilot) még nem történt.

## 3. Ellenőrizendő állítások (tanári döntés; a játékban még nem módosítottuk)

| Kártya / elem | Probléma | Ellenőrizendő |
| --- | --- | --- |
| B4 – a cserépszavazás első alkalmazása (a tanári megjegyzésben: Kr. e. 488/487, „két évvel a marathóni győzelem után”); a „10 év” és a vagyon/polgárjog megtartása | Másodlagos forrásból átvett dátum és részletek; hivatalos forrással nem lettek összevetve. | Hivatalos tankönyv alapján a dátum és a részletek jóváhagyása. |
| C1 – a thétészek politikai súlyának növekedése (szalamiszi tengeri csata, Kr. e. 480) | A kártya ok-okozati értelmezést kér és ad meg; ez egyszerűsített, vitatható magyarázat is lehet. | Tanári döntés a megfogalmazásról és a pontozási szempontokról. |
| C2 – esküdtbíróság napidíja Periklész javaslatára | Egyszerűsített állítás, hivatalos forrással nem lett összevetve. | Hivatalos forrás alapján a megfogalmazás jóváhagyása. |
| C3 – polgárjogi törvény, Kr. e. 451/450 (mindkét szülő athéni) | Dátum és tartalom másodlagos forrásból; hivatalos forrással nem lett összevetve. | Hivatalos forrás alapján a megfogalmazás jóváhagyása. |
| D4 – a déloszi szövetség közös pénzének felhasználása az Akropolisz újjáépítésére („Kr. e. 5. század közepe”) | A szituáció egyszerűsített átdolgozás; pontos évszám nincs megadva, a tartalom hivatalos forrással nem lett összevetve. | Hivatalos forrás alapján a megfogalmazás jóváhagyása. |
| E4 – „Periklészt 15 alkalommal választották meg sztratégosszá” | A tanári megoldásban „a hagyományos adat szerint” szerepel; hivatalos forrással nem lett megerősítve. | Forrás megjelölése vagy az adat elhagyása. |
| Játékbeli pontozás, mezőértékek, kimaradás | Játékegyensúlyi (didaktikai) paraméterek, nincs történelmi állításértékük. | – |
| Egymás pontozása („esküdt” szerep) | A játékos nem a saját válaszát pontozza; a szabály didaktikai döntés. | Tanári döntés, hogy a szabály megfelel-e az osztálynak. |

Megjegyzés: a fenti tételek a játékban **még nem lettek módosítva**; a módosítás előfeltétele a hivatalos érettségi témavázlat vagy az OH-tankönyv megfelelő szakaszának megadása.

## 4. Technikai megjegyzések

- Önálló, statikus HTML/CSS/JS fájl; az adatok és a játékmotor beágyazottak; a hub-bélyegkép (`assets/hub-agora.svg`) saját rajz, nem tankönyvi illusztráció.
- **Külső erőforrás:** a betűtípusok (Cinzel, EB Garamond, Source Sans 3) a Google Fontsról töltődnek (`fonts.googleapis.com`). Hálózat nélkül a böngésző tartalék betűtípusra vált, a játék működik. A `DEVELOPMENT_RULES.md` szerint külső függőséghez előzetes műszaki és adatvédelmi ellenőrzés kell: **ez a jóváhagyás még nem történt meg**, döntés szükséges (alternatíva: beágyazott betűtípusok).
- Billentyűzet és akadálymentesítés: az állapotváltozásokat egy `role="status"` régió olvassa fel; az ablakok alatt a háttér `inert`, bezáráskor a fókusz a megnyitó vezérlőre tér vissza (visszaesési ponttal); a nem kötelező ablakok Esc-vel zárhatók.
- Dupla kattintás és ismételt Enter ellen védelem van (320 ms-os zár, `e.repeat` szűrés).
- Automatizált ellenőrzés: `tests/agora-browser.test.cjs` (38 vizsgálat: reszponzivitás 360/768/1280 px, fókusz és `inert`, Esc, ismételt Enter, újrakezdés, mentés-folytatás, tiltott tárhely, 5 féle sérült mentés, teljes játék 2/3/4 fővel). Csak Chromiumban futott.
- Ismert hiányok: képernyőolvasós (NVDA/VoiceOver), Firefox- és Safari-kipróbálás nem történt; a mentés verziója v2 (más verziójú mentést a játék eldob).

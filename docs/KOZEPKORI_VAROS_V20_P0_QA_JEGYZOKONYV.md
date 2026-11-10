# Építs középkori várost! V2.0 P0 – tesztjegyzőkönyv

**Állapot:** P0 megkezdve és részben funkcionálisan tesztelve; **nem kiadásra kész**.  
**Érintett új fájl:** \`games/epits-kozepkori-varost-v20-p0.html\`  
**Tesztpélda:** Vercel külön branch preview, a V2.0 P0 fájl elérési útjával.  
**Verzióvédelem:** kizárólag új v2.0 dokumentumok és új HTML fájl, main/v1.1/v1.0/v0.x/Hanza változatlan.

## Statikus ellenőrzés

- 6 történelmi fejezet; két kérdés/fejezet = **12** MC-feladat; négy válaszlehetőség/kérdés.
- A belső adatok helyes indexei A/B/C/D = **3/3/3/3**, és futáskor kérdésenként külön, tartalomfüggetlen válaszsorrend-keverés történik.
- A kérdésbank pontozása az eredeti, tartalmi indexekre épül; a kevert megjelenítés nem módosítja a helyes megoldást.
- 6 azonosított forráselemző blokk: műfaj, korszak, tankönyvi vagy levéltári hivatkozás, saját, nem szó szerinti kivonat, tanulói jegyzet és elrejthető mintaválasz.
- 6 magyar történeti kitekintő szöveg a játék forrásfeladataiban és a külön Tananyag fülön.
- A klasszikus és a moduláris JavaScript blokk szintaxisa ellenőrizhető. Ezen túl teljes regresszió szükséges.

## Valódi böngészős ellenőrzések (tesztfutam 1)

A külön V2.0 P0 böngészős előnézeten ellenőrzött:
- V2 verzió és 6/6 Polyfork modellbetöltés.
- 1. küldetés: forrásadatok és Körmend 1244 megjelenése.
- Forrásjegyzet beírása, helyszín kiválasztása, döntésindoklás és quiz.
- Két új, négyválaszos kérdés; tartalom szerinti választás és **10/10** pont.
- Oldalfrissítés: helyes válaszok, pontszám és kiválasztott nézet fennmaradt.
- Tananyag / Játék váltás és 2D megjelenítés működött.
- **Tanulság:** az első futam a Tananyag fülből még hiányolta a konkrét magyar példát; azt külön javítással bekerült az olvasófelületre.

## Valódi böngészős ellenőrzések (tesztfutam 2)

- Üres forrásjegyzettel az 1. küldetésből nem lehetett a döntés szakaszába lépni.
- 35+ karakteres, megfogalmazott forrásjegyzettel az előrelépés működött.
- A Tananyag fülben a „Magyar és történelmi példák” blokkban Körmend 1244 megjelent.
- **Megjegyzés:** a böngészőügynök a gomb vizuális megjelenése alapján nem tudta megbízhatóan bizonyítani a HTML \`disabled\` attribútumát. A forráskódban az állapotellenőrzés szerepel, emellett a legutóbbi javításban a szakaszváltásra is került explicit védelem. A végleges akadálymentességi ellenőrzés továbbra is nyitott.
- A második futam előtt/után a feladatok egyes félreérthető válaszlehetőségeit tovább javítottuk; emiatt a **friss végleges tartalom minden kérdésének** böngészős ismételt végigtesztelése még hátravan.

## Nyitott P0 release-gate tételek

| QA | Státusz | Hiányzó ellenőrzés |
|---|---|---|
| QA-01 hatküldetéses végigjátszás | NYITOTT | Az 1. küldetés ellenőrzött; a 2–6. még nincs teljesen végigtesztelve |
| QA-02 60/60 pont | NYITOTT | Teljes helyesválaszos próba |
| QA-03 0/60 pont | NYITOTT | Teljes hibásválaszos próba |
| QA-04 félbehagyott állás frissítése | RÉSZBEN | Az 1. küldetés teljesítése után sikeres; más szakaszban még nem |
| QA-05 dupla pontozás kizárása | RÉSZBEN | Kódszintű védelem; többküldetéses böngészőteszt hiányzik |
| QA-06 újrakezdés és újrakeverés | NYITOTT | Befejezett játék után újrakezdés |
| QA-07 2D/3D váltás | RÉSZBEN | Az 1. küldetésen tesztelt; későbbi szakaszokon nem |
| QA-08 360/768/1280 px | NYITOTT | Valós viewport teszt minden méreten |
| QA-09 billentyűzetes vezérlés | NYITOTT | Tab/Enter/Space és fókusz |
| QA-10 WebGL és CDN fallback | NYITOTT | Szimulált model/betöltési hiba |
| QA-11 sérült localStorage | RÉSZBEN | Védelmi kódot beépítettünk; böngészős szimuláció hátravan |
| QA-12 érintős, mobilbillentyűzetes használat | NYITOTT | Fizikai eszköz és kis viewport |
| QA-13 mind a hat tananyagfejezet és mintaválasz | RÉSZBEN | Első fejezet tesztelve; a többi teljesen nem |
| QA-14 külső források és verzióvédelem | RÉSZBEN | GitHub fájlváltozások ellenőrizhetők; az összes külső link egyenként még nem tesztelt |

## Kiadási szabály

Ne merge-eljük a P0 ágat a \`main\`-be és ne tegyük az éles oldalra, amíg a **14 QA-tétel** megfelelően dokumentáltan nem zárul, illetve a történelmi-pedagógiai tartalom tanári jóváhagyást nem kapott. A korábbi változatok külön fájlokban maradnak meg.

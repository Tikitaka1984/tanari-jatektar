# Építs középkori várost! – tanári segédlet (TESZT 1.0)

## Projektazonosítás
- **Célcsoport:** 9. évfolyam, 14–15 éves tanulók.
- **Tantárgy:** történelem, a középkori európai városok és polgárok világa.
- **Felhasznált tankönyvek:** Szent István Társulat, *Történelem 9.*, 15. „A polgárok világa”, 100–102. oldal; Oktatási Hivatal, *Történelem 9.* (OH-TOR09TB), 13. „A polgárok világa”, 106–112. oldal. Kapcsolódó előismeret: a parasztság, mezőgazdasági fejlődés és árutermelés.
- **Játék:** `games/epits-kozepkori-varost-teljes-v10.html`.
- **Állapot:** külön, megőrzött fejlesztői másolat a main érintése nélkül; nem tantervi hitelesítés és nem egyetlen konkrét középkori település rekonstrukciója.
- **Időkeret:** ajánlott 2×45 perc vagy 3×45 perc; a 6 fejezet mély elemzésére egyetlen 45 perces óra nem elegendő.

## A tanulási szerkezet
Minden küldetés a következő ciklust használja:
1. Tananyag – a két tankönyv alapján készített, önálló, rövid magyarázat.
2. Fogalom/forrás – történelmi összefüggés és tankönyvi oldalszám (a program nem reprodukál hosszú idézeteket).
3. Döntés – 3 alternatíva közül a megfelelő történelmi indoklás alapján választ.
4. Saját szavas indoklás – legalább 20 karakter; **a karakterlimit nem minőségi pontozás**. A tanár értékeli.
5. Aktív felidézés – 2 feleletválasztós történelmi kérdés; helyes válaszonként 5 pont.
6. Történelmi visszajelzés – a város új elemet kap, és a tanuló áttekintheti döntéseit.

## Hat küldetés és tanulási eredmény

| Küldetés | Ismeretek és fogalmak | Tudásbizonyíték | Tanári megfigyelés |
|---|---|---|---|
| 1. A város születése | árutermelés, terményfelesleg, kereskedelmi csomópont | településhely és pro-kontra indoklás | nem minden város ugyanott alakult ki |
| 2. Városi kiváltságok | kommuna, kiváltságlevél, városi önkormányzat, vásártartás, bíráskodás | jogi kiváltságok szükségessége | épületek ≠ jogállás |
| 3. Városszerkezet | piac, városkapu, utak, városháza, templom | közlekedési kapcsolat és helyszínek funkciója | Carcassonne példa: nem minden város egyforma |
| 4. Céh és kézműipar | céh, inas, legény, mester, remekmunka | minőség és versenykorlátozás mérlegelése | a céh összetett, nem csak pozitív intézmény |
| 5. Kereskedelem | helyi és távolsági piac, Hanza, levantei kereskedelem | útvonal- és árucsoport-összevetés | a fiktív település nem azonos Hanza-várossal |
| 6. Városi társadalom | patrícius, polgárjog, városi tanács, polgárjog nélküli lakók | társadalmi különbségek értelmezése | a középkor nem modern választójogi demokrácia |

## Kétórás megvalósítási javaslat
**1. tanóra:**
- 0–5. perc: indító vita: mitől lesz egy település város?
- 5–15. perc: 1. küldetés, gazdasági előfeltételek és indoklás.
- 15–27. perc: 2. küldetés, forrásértelmezés: kommuna és kiváltságlevél.
- 27–40. perc: 3. küldetés, a városszerkezet összevetése a tankönyvi ábrával.
- 40–45. perc: közös összegzés, fogalmak.

**2. tanóra:**
- 0–14. perc: 4. küldetés, céhszabályozás előnyei és korlátai.
- 14–28. perc: 5. küldetés, Hanza–Levante összehasonlítás.
- 28–40. perc: 6. küldetés, társadalmi jogállás és városvezetés.
- 40–45. perc: eredmény, döntések indoklása, önellenőrző kérdések.

## Értékelés
- **Objektív tanulói tudáspont:** 12 feleletválasztós kérdés, 5 pont/kérdés = 60 pont. A feladatok egységes tananyagegységekből vannak, a pontszám nem érettségi vizsgajegy.
- **Tanári értékelés külön:** minden küldetésnél max. 4 pont a szöveges indoklásért: 1 pont a releváns történelmi fogalomért, 1 az ok–okozati érvért, 1 a megfontolt korlátért/ellenérvért, 1 a pontos megfogalmazásért. Így az indoklások tanári maximuma 24 pont, **nem automatikusan számított játékpont**.
- **Javasolt tanári megfigyelés:** miért ismerhető fel a helyes válasz? Tudja-e a diák saját városát a két tankönyvi ábra alapján kritizálni?

## Tartalmi védőkorlátok
- Az 1182-es beauvais-i szabály, az 1164-es brémai kiváltság és a newcastle-i kereskedelmi szabály **helyhez és korhoz kötött dokumentum**: nem szabad automatikusan valamennyi középkori településre általánosítani.
- A „városi levegő szabaddá tesz” szabály nem volt mindenütt egységes.
- A városi kiváltságok és a gazdasági fejlettség nem ugyanazt mérik.
- A céhek a minőség mellett a konkurenciát is korlátozhatták.
- Nem minden városlakó rendelkezett polgárjoggal; nem alkalmazható a mai demokratikus választójog modellje.
- A 13. századi kiinduló környezetbe nem kerülhet modern gyár, Gutenberg nyomdája vagy 15. századi reneszánsz díszlet mint általános korszakjellemző.

## Technikailag mit tud?
- Teljesen önálló HTML/CSS/JavaScript-játék, framework és buildfolyamat nélkül.
- 2D SVG-térkép és forgatható Three.js 3D megjelenítés, Polyfork-medieval GLB eszközökkel. WebGL/CDN-hiba esetén a játék 2D módban használható.
- Helyi böngészős mentés `kozepkori-varos-teljes-v10`; adatokat nem küld saját szerverre, neveket és e-mailt nem kér.
- A v0.1–v0.4 korábbi verziókat azonos ágon, változatlan külön fájlokban megőrizzük. Élesítéshez külön tanári jóváhagyás és regressziós vizsgálat szükséges.
- 360/768/1280 px viewportok, billentyűzetes kezelés, kontraszt, WebGL-terhelés, teljes végigjátszás/újrakezdés külön tesztelendő.

## Következő szakmai felülvizsgálat
A teljes városépítő játékmenet tematikailag elkészült, de a felület **továbbra is oktatási prototípus**. Minden történelmi állítást és kérdést a tanár hagyjon jóvá; a fiktív gazdasági mutatókat ne kezeljük valós történelmi mérőszámként.

Forrásként kizárólag a két feltöltött tankönyvben szereplő témák és a már ismert tananyag-összefüggések szolgálnak; az automatikus pontozási és tanári értékelési skálák saját didaktikai tervezési javaslatok.

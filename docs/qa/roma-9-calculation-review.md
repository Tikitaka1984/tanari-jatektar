# M07 – A 8.0 és 9.0 számításainak összevetése

## Vizsgált források

- 8.0: a jelenlegi főág `a3669271da16286b164a8f395aa7814e236d8b47` commitjának `games/iranyitsd-romat.html` fájlja.
- Korábbi 9.0: `b05a5970a9b51a9c763962159608aafe52b8ccfc`, a PR #11 fejlesztési ágban létrejött merge-commitja.
- Javított 9.0 tesztcommit: `aae8a8d10d0a9459bc56d5772a29452308316477`.

A régi ágat nem olvasztottuk be. Kizárólag az adott játék célzott diffje került át a jelenlegi főágra; a főág M01–M06 fejlesztései megmaradtak.

## A kerekítési hiba oka

Az eredeti döntés helyi hatása:

```js
local = (o[2][1] + o[2][2] + o[2][3]) * .42;
```

A 8.0 ezt a törtértéket közvetlenül adja át az `applyRegions()` függvénynek. A fő tartomány súlya 1, a további érintett tartományoké 0,7; **csak a súlyozás után** kerekít:

```js
Math.round(local * (i === 0 ? 1 : .7))
```

A korábbi 9.0 normál módban is `Math.round(local)` értéket adott át. A másodlagos tartomány ezért ezt kapta:

```js
Math.round(Math.round(local) * .7)
```

A két kifejezés általában nem egyenértékű. A korai kerekítés önmagában ±1 eltérést okozhat, amely később is megmarad a tartományi állapotban, és befolyásolhatja a végső értékelést. Az előjelkezelés a JavaScript tényleges `Math.round` műveletét követi; nem cseréltük le más kerekítési szabályra.

| Helyi névleges hatás | 8.0, másodlagos tartomány | Régi 9.0 normál | Javított 9.0 normál |
|---|---:|---:|---:|
| +12,18 | +9 | +8 | +9 |
| −12,18 | −9 | −8 | −9 |

Konkrét teljes játékbeli reprodukció: az 1. és 2. tanácsülésen egyaránt az I. döntést választva a 2. döntés után a négy birodalmi erőforrás mindkét régi verzióban azonos: **32 / 79 / 74 / 63** (kincstár / határvédelem / ellátás / bizalom). Italia stabilitása viszont **8.0: 81, régi 9.0: 80**. A különbség a következő ülés kezdetén is megmarad. A nyers előzetes report első két eltérése ezt tartalmazza.

A régi 9.0-n 27 külön nyolcfordulós sorozatból **24 eltérő út** volt, 459 összevetési időponttal. A 125 szélsőértékes esetből 18 és a nyolc kerekítési próbából három eltért. Ez ténylegesen sikertelen futás, nem PASS. Bizonyíték: [roma-9-model-before.json](roma-9-model-before.json).

## A legkisebb számítási javítás

```js
function scaled(n) {
  return difficulty === 'normal'
    ? n
    : Math.round(n * (n < 0 ? profile().negative : profile().positive));
}
```

Normál módban a `scaled()` identitásként működik. Az `applyRegions(area, scaled(local))` hívás megmarad, de a 8.0 eredeti sorrendjében számol. Az egészértékű globális és késleltetett hatások ugyanazokat az értékeket adják, a normál válságszorzó 1. Az `applyRegions()` súlyozása, a 0–100-as korlát és a válságfeltételek sorrendje változatlan.

A könnyű és nehéz mód eredeti 9.0 skálázása, kerekítése és válságmodellje megmarad. Ezek átírása újraegyensúlyozás lenne; erre nem kaptunk tanári jóváhagyást.

## A három változat számszerű profilja

| Paraméter | Ifjú császár | Róma ura | A birodalom sorsa |
|---|---:|---:|---:|
| Kincstár | 85 | 65 | 55 |
| Határvédelem | 80 | 55 | 60 |
| Ellátás és utak | 85 | 56 | 55 |
| Tartományi bizalom | 90 | 57 | 60 |
| Minden tartomány induló módosítása | +12 | 0 | −12 |
| Pozitív döntéshatás szorzója | 1,15 | 1 | 0,85 |
| Negatív döntéshatás szorzója | 0,65 | 1 | 1,40 |
| Válságszorzó | 0,60 | 1 | 1,50 |
| Segítség | eredeti leírás + névleges birodalmi hatások | eredeti 8.0 leírás | rövid választási segítség rejtve |

A tartományok sorrendje Italia / Gallia / Hispania / Aegyptus / Asia / dunai térség. Induló értékek:

- Könnyű: **84 / 76 / 77 / 78 / 76 / 72**.
- Normál: **72 / 64 / 65 / 66 / 64 / 60**.
- Nehéz: **60 / 52 / 53 / 54 / 52 / 48**.

A történelmi tanácsadói jelentés, kérdés és tudástár minden módban az eredeti szöveg. A könnyű többletsegítség kizárólag a meglévő játékadatokból számított névleges hatás, új történelmi állítás nélkül. A névleges hatás telítődő, 0–100-as mutatón nem feltétlenül azonos a tényleges nettó változással.

## Teljes modellregresszió eredménye

A teszt a tényleges első inline scriptet futtatja minimális DOM-stubbal. A számítási próba renderelése elnyomott, de az eredeti döntés-, késleltetés-, válság- és `endScreen()` értékelő függvények futnak. Ez nem böngészős QA; azt külön program végzi.

Mind a **3⁸ = 6561** lehetséges nyolcfordulós döntéssorozatot ellenőriztük. Sorozatonként 17 összevetés: indulás, nyolc döntés utáni állapot, hét új tanácsülés kezdeti állapota és a végső eredmény. Összesen **111 537 normál összevetés, nulla eltérő sorozat, nulla érvénytelen állapot**.

Az összehasonlítás tartalmazza a négy birodalmi mutatót, hat tartományt, döntési állapotot, várakozó eseményeket, teljes naplót és annak számított hatásszövegét, végső címet és pontszámot. Nem közelítő tűréssel dolgozik: az összevetett adatszerkezet teljesen egyezik a 8.0-val.

Könnyű és nehéz módban külön-külön mind a 6561 út és 111 537 állapot egyezik a régi 9.0 megfelelő módjával. **Nincs NaN/végtelen, tartományon kívüli érték vagy befejezhetetlen út.** Mindkét mód mindegyik útján nyolc döntés és lezárt nyolcadik forduló keletkezett. A normál nyolcfordulós viselkedés teljesen egyezik a 8.0-val.

Ezenfelül **125/125 szélsőértékes eset** és **8/8 kerekítési próba PASS**. Az induló 0/100 értékek, a válságküszöbök alatti és pontos küszöbértékek, telítődő hatások, késleltetett esemény és mind a négy tovagyűrűző feltétel szerepel a próbákban.

| Mind a 6561 út végső pontszáma | Könnyű | Normál | Nehéz |
|---|---:|---:|---:|
| Minimum | 49 | 23 | 10 |
| Maximum | 97 | 89 | 81 |
| Átlag, két tizedesre közölve | 86,68 | 65,25 | 44,75 |

Ezek az összes lehetséges döntési út szimulált eredményei, nem tanulói teljesítményadatok és nem történelmi statisztikák. A végigjátszhatóság nem jelent minden út végén sikeres birodalmi minősítést.

Nyers bizonyíték: [roma-9-model-results.json](roma-9-model-results.json). A Chromium-próba emellett húsz külön normál utat natív gombokkal futtat mindkét verzióban, 340 állapot-összevetéssel; az is nulla eltérést mutat.

## Pedagógiai felülvizsgálati pont

A nehéz mód két birodalmi mutatója **magasabb** a normálnál: határvédelem +5, bizalom +3. A kincstár −10, az ellátás −1, a négy mutató összege 230 vs. 233. A nehezítés érdemi különbségét a tartományi −12, a kedvezőtlenebb döntéshatások és az erősebb válságok is adják; a teljes útvizsgálat pontszámai ezt mutatják.

Ez a korábbi 9.0 profiljának tulajdonsága, nem az integrációban bevezetett számítási hiba. Ha a tanári cél minden induló mutató következetes csökkentése, a profil külön jóváhagyott újraegyensúlyozást igényel. Ezt önállóan nem módosítottuk.

A végső értékelés feltételei változatlanok: minimum <20 válság; <40 törékeny; átlag ≥70 és minimum ≥50 virágzó; egyébként fenntartható, kihívásokkal küzdő. A minimális és átlagos érték számítását a forrásszintű tartalomteszt is védi.

## Reprodukció

Az ág gyökerében:

```sh
node tests/roma-9-model.test.cjs
```

A script a két rögzített commitot a Gitből olvassa; sekély klónból szükség lehet a két alapcommit letöltésére. A régi hiba ismételt reprodukálása:

```sh
git show b05a5970a9b51a9c763962159608aafe52b8ccfc:games/iranyitsd-romat.html > /tmp/roma-9-old.html
SEQUENCE_LIMIT=27 GAME_SOURCE=/tmp/roma-9-old.html TESTED_COMMIT=b05a5970a9b51a9c763962159608aafe52b8ccfc REPORT_PATH=/tmp/roma-9-before.json node tests/roma-9-model.test.cjs
```

A második parancs **szándékosan FAIL** a régi normál kerekítésen. A `SEQUENCE_LIMIT` csak gyors diagnosztikához való; a teljes végleges futásban nem volt beállítva. A jelentésben szereplő commit, forrás- és teszthash azonosítja a végrehajtott verziót.

Technikai hivatkozás: [ECMAScript Math.round](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.round). A játékadatok elsődleges ellenőrzési forrása a fenti két rögzített Git-verzió.

# Ki vagyok én? – technikai és pedagógiai audit

## 1. Vezetői összefoglaló

- **Jelenlegi állapot:** a játék egyetlen statikus `index.html` fájlban megvalósított, keretrendszer nélküli HTML/CSS/JavaScript alkalmazás. A fő játékmenet statikus kódelemzés alapján végigkövethető: kezdőképernyő, 8 véletlen kör, fokozatos nyomfelfedés, névbeírás vagy névtábla, pontszámítás, lezárás és összegzés.
- **Fő erősségek:**
  - világos, tanulási célt támogató játékszabály: a korai felismerés több pontot ér;
  - egyszerű, buildfolyamat nélküli statikus architektúra;
  - alapvető ékezet- és központozás-toleráns válasz-normalizálás;
  - körzár (`G.locked`) akadályozza a legtöbb dupla pontjóváírást;
  - a bizonytalan, nem felismert névalak nem von automatikusan pontot vagy nyomot;
  - a kör végi összegzés ismétlő, tanulást segítő szerepet tölt be.
- **Legfontosabb kockázatok:**
  - a `nextBtn()` inline állapotváltása statikusan azonosított, futtatással még nem igazolt kockázat: gyors ismételt aktiválás esetén potenciálisan több kör átugorható;
  - a képernyőváltások és dinamikus tartalmak fókuszkezelése részleges, az eredményképernyőre váltás után nincs fókuszmozgatás;
  - a feedback `innerHTML`-t használ, ezért a későbbi tartalombővítésnél XSS és képernyőolvasós bejelentési kockázatot hordoz;
  - nincs mentés/folytatás, verziózott `localStorage` séma vagy sérült mentés kezelése;
  - az elfogadott névalakok nem egységesek: több történelmi személy esetében nagyon rövid családnév vagy keresztnév is elfogadott, másoknál nem;
  - a tényleges 360/768/1280 px böngészős, billentyűzetes, fókusz- és konzolteszt ebben a futásban nem történt meg, ezért ezek csak statikus audit alapján minősíthetők.
- **Összesített fejlettségi minősítés:** **2.0 stabil prototípus / 2.5 felé tartó oktatási játék**. A játékmenet és a pedagógiai alaplogika erős, de a 3.0-s minőséghez tranzakcióbiztos állapotváltás, dokumentált mentési séma, teljesebb akadálymentesség, automatizálható tesztelési pontok és következetesebb névalak-kezelés szükséges.

## 2. Megállapítások

### KVE-001 – HTML fő landmark hiánya

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett kódrészlet:** `div id="app"`, majd három `section.screen`; nincs `main` elem.
- **Probléma leírása:** a fő alkalmazástartalom generikus `div` konténerben van. A `section` elemek címzett régióként csak részben működnek, mert nem mindegyik rendelkezik saját programozott névvel vagy `aria-labelledby` kapcsolattal.
- **Bizonyíték és ellenőrzési mód:** bizonyított hiba, statikus kód. A struktúra a `body > div#app > section` mintát használja.
- **Technikai következmény:** a dokumentum landmark-szerkezete kevésbé egyértelmű, automatikus a11y teszteken jelzés várható.
- **Felhasználói következmény:** képernyőolvasóval nehezebb gyorsan a fő játéktérre ugrani.
- **Pedagógiai következmény:** a tanulási feladat elérhetősége romlik azoknak, akik navigációs segédeszközzel használják a játékot.
- **Konkrét javítási javaslat:** a `#app` legyen `main id="app"`, a képernyők kapjanak `aria-labelledby` attribútumot a saját címükre.
- **Regressziós kockázat:** alacsony, de CSS szelektorokat ellenőrizni kell, ha `div#app`-ra épülne külső szabály.
- **Szükséges teszt:** képernyőolvasós landmark-lista, billentyűzetes navigáció, axe/Lighthouse jellegű statikus ellenőrzés.

### KVE-002 – Inline eseménykezelők és HTML-be ágyazott üzleti logika

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett kódrészlet:** `onclick="startGame()"`, `onclick="submitName()"`, `onclick="revealClue()"`, `onclick="openBoard()"`, `onkeydown="...submitName();"`, `nextBtn()` által generált inline `onclick`.
- **Probléma leírása:** az eseménykezelés a markupban és stringként generált HTML-ben van. Ez megnehezíti az automatikus tesztelést, a központi tranzakciózárat és a progresszív akadálymentesítést.
- **Bizonyíték és ellenőrzési mód:** bizonyított fejlesztési kockázat, statikus kód.
- **Technikai következmény:** nehezebb eseményeket mockolni, egyszer kezelni az Enter/Space/dupla kattintás védelmet, valamint biztonságos DOM-frissítést bevezetni.
- **Felhasználói következmény:** gyors ismételt interakcióknál nagyobb eséllyel keletkezik nem várt állapot.
- **Pedagógiai következmény:** a mérés torzulhat, ha a tanuló véletlenül átugrik kört vagy többször aktivál műveletet.
- **Konkrét javítási javaslat:** az interaktív elemek kapjanak stabil `id`-t, az eseménykezelők `addEventListener`-rel, egyszeri inicializáló függvényben kapcsolódjanak.
- **Regressziós kockázat:** közepes, mert minden fő interakciót érint.
- **Szükséges teszt:** kattintás, Enter, Space, dupla kattintás, ismételt újrakezdés, teljes játékmenet.

### KVE-003 – Következő kör gomb gyors ismételt aktiválással állapotot ugorhat

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett függvény:** `nextBtn()`; generált kód: `onclick="G.round++; startRound();"`.
- **Probléma leírása:** a következő körre lépés nem dedikált függvényben történik, és nem állít be azonnali, külön `transitioning` vagy `nextLocked` állapotot. Statikus kódelemzés alapján a gomb a DOM újraírásáig aktiválhatónak tűnhet, ezért gyors dupla kattintás vagy ismételt Enter esetén fennállhat annak kockázata, hogy a `G.round++` többször lefut; ezt tényleges böngészős futtatással még nem reprodukáltam.
- **Bizonyíték és ellenőrzési mód:** statikusan azonosított, futtatással még nem igazolt kockázat; tényleges böngészős reprodukció manuálisan ellenőrizendő.
- **Technikai következmény:** ha a kockázat manuálisan reprodukálható, körök kimaradhatnak, `cur()` rossz vagy nem várt rekordot adhat, szélsőséges esetben a befejezés előtti állapot inkonzisztens lehet.
- **Felhasználói következmény:** reprodukció esetén a játékos véletlenül kihagyhat feladatot, ami rontja a pontszám és élmény hitelességét.
- **Pedagógiai következmény:** reprodukció esetén a gyakorlásból kimaradhatnak történelmi személyek, az eredmény kevésbé a tudást mérné.
- **Konkrét javítási javaslat:** legyen `goNextRound()` függvény, amely az első sorban letiltja a gombot és ellenőrzi a körhatárt, majd egyszeri állapotváltással hívja a `startRound()`-ot.
- **Regressziós kockázat:** közepes.
- **Szükséges teszt:** gyors dupla kattintás a „Következő rejtőzködő” gombon, Enter nyomva tartása fókuszált gombon, utolsó kör után eredményre lépés.

### KVE-004 – Dupla pontjóváírás ellen a válaszkiértékelésben jó alapvédelem van

- **Súlyosság:** alacsony
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett függvény/változó:** `G.locked`, `resolveGuess(id)`, `lockRound()`.
- **Probléma leírása:** ez nem bizonyított hiba, hanem megtartandó működés. A `resolveGuess()` elején `if(G.locked) return;` szerepel, helyes válasz esetén pedig a pontjóváírás után `G.locked=true` és `lockRound()` fut.
- **Bizonyíték és ellenőrzési mód:** bizonyított pozitívum, statikus kód.
- **Technikai következmény:** egy körön belül a helyes válasz normál esetben csak egyszer ad pontot.
- **Felhasználói következmény:** a játékos nem tud egyszerű ismételt kattintással extra pontot szerezni ugyanarra a megoldásra.
- **Pedagógiai következmény:** a pontszám hitelesebb marad.
- **Konkrét javítási javaslat:** megőrzendő; kiegészítésként a `submitName()` és névtábla gombok első aktiváláskor rövid tranzakciózárat kaphatnak.
- **Regressziós kockázat:** alacsony, ha csak védelem bővül.
- **Szükséges teszt:** helyes válasz gombbal és Enterrel ismételve; névtábla helyes gomb gyors dupla kattintása.

### KVE-005 – Rossz tipp automatikusan nyomot éget, de korlátlan ismeretlen név próbálható

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett függvény:** `submitName()`, `resolveGuess(id)`, `revealClue()`.
- **Probléma leírása:** ha a normalizált beírás nem szerepel egyik `accept` listában sem, a játék információs visszajelzést ad és nem büntet. Ha viszont létező, de rossz történelmi személyre illeszkedik, a rendszer eléget egy nyomot. Ez megfelel a nyitóképernyő szövegének, de korlátlan, nem felismert próbálgatást enged.
- **Bizonyíték és ellenőrzési mód:** bizonyított működés, statikus kód.
- **Technikai következmény:** nincs próbálkozásszámláló, nincs diagnosztika az elgépelés és tudatos megkerülés megkülönböztetésére.
- **Felhasználói következmény:** barátságos az elgépelésekkel, de a játékos végtelenül próbálhat nem listázott alakokat kockázat nélkül.
- **Pedagógiai következmény:** a szabad felidézés mérését részben gyengítheti, ha a tanuló kizárásos, külső listán kívüli próbákkal kísérletezik.
- **Konkrét javítási javaslat:** bizonyított hibaként nem szükséges büntetni az ismeretlen nevet; fejlesztési javaslatként körönként naplózható vagy limitálható az ismeretlen próbák száma, tanári döntéssel.
- **Regressziós kockázat:** közepes, mert a túl szigorú limit elgépeléseket büntethet.
- **Szükséges teszt:** üres input, ismeretlen név, létező de rossz név, elgépelés, több egymás utáni ismeretlen próbálkozás.

### KVE-006 – Válasz-normalizálás alapvetően jó, de római szám és névalak-kezelés nem teljes

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett függvény/adat:** `norm(s)`, `FIGURES[].accept`.
- **Probléma leírása:** a normalizálás kisbetűsít, eltávolítja az ékezetet és a központozást, majd szóközöket rendez. Ez jó alap. Ugyanakkor a római számok ponttal vagy anélkül csak akkor működnek, ha az `accept` listában szerepelnek; több gyakori alak, például arab számos változat vagy név sorrendi variáció hiányozhat.
- **Bizonyíték és ellenőrzési mód:** bizonyított működés és fejlesztési javaslat, statikus kód.
- **Technikai következmény:** a helyes történelmi tudást hordozó, de nem listázott beírás információs „nem ismerem fel” választ kaphat.
- **Felhasználói következmény:** frusztráló lehet, ha a tanuló helyes személyre gondol, de nem pontosan a támogatott alakot írja.
- **Pedagógiai következmény:** a mérés a történelmi felismerés helyett részben a fejlesztő által felsorolt aliasokra érzékeny.
- **Konkrét javítási javaslat:** külön, tesztelt alias-normalizáló réteg: római szám ponttal/pont nélkül, arab számok, névelő nélküli rangjelölések, vezeték-keresztnév sorrend; történelmi tartalom módosítása nélkül, tanári ellenőrzéssel bővíthető aliaslista.
- **Regressziós kockázat:** magas, mert túl tág alias véletlenül rossz személyt tehet elfogadottá.
- **Szükséges teszt:** személyenként pozitív és negatív alias-mátrix, különösen az azonos keresztnevű személyeknél.

### KVE-007 – Elfogadott névalakok következetlen pontossága

- **Súlyosság:** magas
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett adat:** `FIGURES[].accept`.
- **Probléma leírása:** egyes személyeknél a családnév vagy keresztnév önmagában elfogadott (`bela`, `karoly`, `matyas`, `dozsa`, `rakoczi`, `szechenyi`, `kossuth`, `deak`), míg másoknál csak teljesebb alakok. Néhány rövid alak történelmi kontextusban félreérthető lehet, még ha az aktuális névtáblában csak egy konkrét személy szerepel is az adott körben.
- **Bizonyíték és ellenőrzési mód:** bizonyított kockázat, statikus kód.
- **Technikai következmény:** az elfogadási logika adatvezérelt, de nincs konzisztencia-ellenőrző teszt.
- **Felhasználói következmény:** a játékosok eltérő szigorral találkoznak személyenként.
- **Pedagógiai következmény:** a pontos névismeret mérése torzulhat; például a „Béla” önmagában kevésbé specifikus, mint az „IV. Béla”.
- **Konkrét javítási javaslat:** alias audit táblázat készítése tanári jóváhagyással: mely rövid alakok maradjanak elfogadottak, melyek legyenek `AMBIG` típusú pontosítást kérők.
- **Regressziós kockázat:** magas pedagógiai regresszió: szigorítás csökkentheti a korábbi játékosok pontszámát; lazítás téves elfogadást okozhat.
- **Szükséges teszt:** összes `accept` elem normalizált ütközésvizsgálata, tanári validációs lista, manuális próbák.

### KVE-008 – Félreérthető keresztnevek kezelése hasznos, de nem teljes körű

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett változó:** `AMBIG`.
- **Probléma leírása:** az `AMBIG` kezeli az `istvan`, `lajos`, `jozsef`, `ferenc`, `hunyadi` alakokat, és ezek nem számítanak hibás tippnek. Ugyanakkor a logika csak pontos normalizált kulcsra működik, és nem adatból számolja az azonos keresztneveket/családneveket.
- **Bizonyíték és ellenőrzési mód:** bizonyított működés és fejlesztési javaslat, statikus kód.
- **Technikai következmény:** új személy hozzáadásakor könnyű elfelejteni az `AMBIG` bővítését.
- **Felhasználói következmény:** egyes félreérthető alakoknál a játék rossz tippként vagy ismeretlenként reagálhat.
- **Pedagógiai következmény:** a pontosítás hasznos metakognitív támogatás, de következetlensége gyengíti a névismeret mérését.
- **Konkrét javítási javaslat:** generált vagy validált ambiguitási lista az aliasokból; kézi tanári felülbírálattal.
- **Regressziós kockázat:** közepes.
- **Szükséges teszt:** minden egytagú alias és keresztnév ellenőrzése: elfogadás, pontosítás vagy ismeretlen kategória.

### KVE-009 – Pontozás átlátható, de a nyomégetés visszajelzése felülírja az „új nyom” üzenetet

- **Súlyosság:** alacsony
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett függvények:** `potential()`, `revealClue()`, `resolveGuess()`.
- **Probléma leírása:** a pontszámítás képlete: `Math.max(1, 6 - G.revealed - boardPenalty())`. Rossz tippnél `revealClue()` előbb információs üzenetet ír, majd a `resolveGuess()` azonnal felülírja hibajelzéssel. Ez technikailag nem hiba, de felesleges állapotfrissítés.
- **Bizonyíték és ellenőrzési mód:** bizonyított működés, statikus kód.
- **Technikai következmény:** az élő régió potenciálisan két gyors bejelentést kapna, amelyekből csak a második látható.
- **Felhasználói következmény:** vizuálisan rendben, képernyőolvasónál zavaró vagy kihagyott bejelentés lehet.
- **Pedagógiai következmény:** a nyomégetés oka megjelenik, de a nyomérték-csökkenés külön bejelentése nem stabil.
- **Konkrét javítási javaslat:** `revealClue({silent:true})` opció rossz tippnél, majd egyetlen összetett feedback üzenet.
- **Regressziós kockázat:** alacsony.
- **Szükséges teszt:** rossz tipp több nyomszinten, képernyőolvasós live region ellenőrzés.

### KVE-010 – Névtábla hatása pontozásra technikailag következetes

- **Súlyosság:** alacsony
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett függvények:** `openBoard()`, `boardPenalty()`, `potential()`.
- **Probléma leírása:** ez megtartandó működés. A névtábla megnyitása `G.boardOpen=true` állapotot állít, a `boardPenalty()` pontosan 1 ponttal csökkenti a kör aktuális értékét. A pont minimuma továbbra is 1.
- **Bizonyíték és ellenőrzési mód:** bizonyított pozitívum, statikus kód.
- **Technikai következmény:** egyszerű és ellenőrizhető szabály.
- **Felhasználói következmény:** a segítség ára kiszámítható.
- **Pedagógiai következmény:** támogatja a szabad felidézés előnyben részesítését a felismeréssel szemben.
- **Konkrét javítási javaslat:** megőrzendő; a HUD-ban érdemes külön jelezni, hogy a névtábla büntetése már beleszámolt az aktuális pontba.
- **Regressziós kockázat:** alacsony.
- **Szükséges teszt:** névtábla nélkül/névtáblával, minden nyomszinten.

### KVE-011 – Dinamikus HTML beszúrás belső tartalomból is biztonsági és karbantarthatósági kockázat

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett kódrészlet:** `insertAdjacentHTML`, `innerHTML` használat a nyomoknál, névtáblánál, feedbacknél, eredményösszegzésnél.
- **Probléma leírása:** jelenleg a tartalom helyi konstansokból érkezik, ezért nincs külső inputból származó közvetlen XSS. Fejlesztési kockázat viszont, hogy későbbi tartalombővítésnél vagy importnál HTML-ként renderelődik a történelmi tartalom.
- **Bizonyíték és ellenőrzési mód:** fejlesztési kockázat, statikus kód.
- **Technikai következmény:** nehezebb garantálni, hogy tartalmi mezők nem törik meg a DOM-ot.
- **Felhasználói következmény:** hibás tartalmi adat esetén megjelenítési vagy hozzáférhetőségi hiba lehet.
- **Pedagógiai következmény:** egy sérült magyarázat félrevezetheti a tanulót.
- **Konkrét javítási javaslat:** tartalmi mezőket `textContent`-tel, strukturált DOM-építéssel renderelni; csak szándékos formázott visszajelzéshez használni kontrollált sablont.
- **Regressziós kockázat:** közepes, mert a jelenlegi `<b>` és `<i>` formázásokat meg kell őrizni vagy biztonságosan kiváltani.
- **Szükséges teszt:** nyomok, bio, feedback, recap megjelenésének összehasonlító manuális ellenőrzése.

### KVE-012 – Reszponzív CSS alapok jók, de tényleges 360/768/1280 px teszt nem történt

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett CSS:** `#app max-width:900px`, `.hud flex-wrap`, `.answer-row flex-wrap`, `.names auto-fill minmax(150px,1fr)`, `#nameInput min-width:190px`.
- **Probléma leírása:** a layout több helyen rugalmas, ami kedvező. Nincs viszont explicit breakpoint, és a hosszú magyar szövegek, `.stat-box` inline-block, lebegtetett `.pts` és a névtábla grid kis képernyőn manuális ellenőrzést igényel.
- **Bizonyíték és ellenőrzési mód:** statikus kód alapján részben igazolt; 360/768/1280 px tényleges böngészős ellenőrzés manuálisan szükséges.
- **Technikai következmény:** kis képernyőn előfordulhat sűrű vagy nehezen olvasható elrendezés.
- **Felhasználói következmény:** mobilon a virtuális billentyűzet és hosszú feedback szövegek miatt a beviteli mező vagy gombok kicsúszhatnak a látható tartományból.
- **Pedagógiai következmény:** mobilos tanulóknál a feladatmegoldást UI-kezelési nehézség befolyásolhatja.
- **Konkrét javítási javaslat:** célzott mobil CSS audit; szükség esetén `@media` szabályok a cím, kártyapadding, névtábla oszlopok, recap pontszám és gombsor kezelésére.
- **Regressziós kockázat:** alacsony-közepes.
- **Szükséges teszt:** manuális 360, 768, 1280 px szélességen, kezdő, játék, névtábla, feedback, eredmény képernyővel.

### KVE-013 – Látható fókusz főként inputon definiált, gombokon böngésző-alapértelmezésre támaszkodik

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett CSS:** `#nameInput:focus`; nincs `.btn:focus-visible` vagy `.nbtn:focus-visible`.
- **Probléma leírása:** az input fókuszállapota jól látható, de a gomboknál nincs kontrasztos, saját fókuszjelölés. A böngésző alapértelmezett outline-ja megjelenhet, de a dizájn és háttér miatt nem garantáltan elég erős.
- **Bizonyíték és ellenőrzési mód:** bizonyított hiány statikus kóddal; vizuális kontraszt manuálisan ellenőrizendő.
- **Technikai következmény:** WCAG 2.4.7/2.4.11 jellegű kockázat.
- **Felhasználói következmény:** billentyűzettel nehéz követni, hol van a fókusz.
- **Pedagógiai következmény:** nem a történelmi tudás, hanem az UI navigálhatósága korlátozhatja a teljesítményt.
- **Konkrét javítási javaslat:** `.btn:focus-visible`, `.nbtn:focus-visible` erős outline/box-shadow szabályok bevezetése.
- **Regressziós kockázat:** alacsony.
- **Szükséges teszt:** Tab/Shift+Tab teljes kör, világos és sötét háttéren fókusz láthatóság.

### KVE-014 – Képernyőváltáskor fókuszkezelés csak játékkezdésnél van

- **Súlyosság:** magas
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett függvények:** `startRound()`, `endGame()`, `openBoard()`, `nextBtn()`.
- **Probléma leírása:** `startRound()` az inputra fókuszál, ami jó. Ugyanakkor `endGame()` nem helyezi a fókuszt az eredményképernyő címére vagy új játék gombjára; a névtábla megnyitásakor nincs fókuszmozgatás a táblára; kör lezárásakor a fókusz maradhat letiltott inputon vagy gombon.
- **Bizonyíték és ellenőrzési mód:** bizonyított hiány statikus kóddal; tényleges fókuszviselkedés manuálisan ellenőrizendő.
- **Technikai következmény:** rejtett vagy letiltott elemre ragadt fókusz lehetősége.
- **Felhasználói következmény:** billentyűzettel és képernyőolvasóval nehezebb észlelni, hogy új állapotba jutott a játék.
- **Pedagógiai következmény:** a játék menete megszakadhat segítő technológiát használóknál.
- **Konkrét javítási javaslat:** állapotváltások után fókuszcélok: kezdéskor input, helyes/vesztett kör után következő/eredmény gomb, névtábla nyitásakor első releváns névgomb vagy táblacím, befejezéskor eredménycím `tabindex="-1"`.
- **Regressziós kockázat:** közepes.
- **Szükséges teszt:** teljes Tab-sorrend, körváltás, névtábla, eredményképernyő, Shift+Tab visszalépés.

### KVE-015 – `aria-live` visszajelzés van, de státuszváltozások nem teljes körűek

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett kódrészlet:** `<div class="feedback" id="feedback" role="status" aria-live="polite"></div>`.
- **Probléma leírása:** a helyes/hibás/info üzenetek élő régióban vannak, ami pozitívum. A pontszám, körszám és aktuális potenciális pont változásai viszont nem külön élő régiók, és a feedback gyors felülírásai képernyőolvasóval bizonytalanul érzékelhetők.
- **Bizonyíték és ellenőrzési mód:** részben bizonyított működés, részben manuálisan ellenőrizendő.
- **Technikai következmény:** állapotváltozások programozott bejelentése esetleges.
- **Felhasználói következmény:** képernyőolvasót használó játékos nem feltétlenül hallja a pontszám/potenciál változását.
- **Pedagógiai következmény:** kevésbé világos, hogy a segítség és hibázás milyen tanulási/pontozási következménnyel járt.
- **Konkrét javítási javaslat:** külön, vizuálisan rejtett státusz régió a kör/pont/potenciál változásoknak; feedback frissítés ütemezése egyetlen bejelentéssé.
- **Regressziós kockázat:** alacsony-közepes.
- **Szükséges teszt:** NVDA/VoiceOver manuális teszt, rossz tipp, új nyom, névtábla, helyes válasz, eredmény.

### KVE-016 – Újrakezdés teljes oldal-újratöltéssel működik, nem alkalmazásszintű állapot-visszaállítással

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett kódrészlet:** eredményképernyő gomb: `onclick="location.reload()"`.
- **Probléma leírása:** az új játék az oldal újratöltésével indul, amely erős, egyszerű állapot-resetet ad. Ugyanakkor nincs játék közbeni újrakezdés, nincs fókusz-visszaállítás kontroll, és a módszer későbbi mentés/folytatás mellett konfliktusos lehet.
- **Bizonyíték és ellenőrzési mód:** bizonyított működés statikus kóddal; tényleges újratöltés manuálisan ellenőrizendő.
- **Technikai következmény:** könnyű, de kevésbé finom állapotkezelés; minden runtime állapot böngésző újratöltésre van bízva.
- **Felhasználói következmény:** félbehagyott játékot nem lehet gyorsan újrakezdeni külön gombbal; eredmény után a teljes oldal villanva töltődik újra.
- **Pedagógiai következmény:** ismétlés lehetséges, de a gyakorlási ciklus kevésbé kontrollált.
- **Konkrét javítási javaslat:** `resetGame({reshuffle:true})` függvény, amely minden `G` mezőt, DOM állapotot és fókuszt visszaállít; az oldal újratöltés maradhat tartalék.
- **Regressziós kockázat:** közepes, mert teljes állapotmátrixot kell lefedni.
- **Szükséges teszt:** újrakezdés kezdés után, névtábla nyitása után, megoldott kör után, eredmény után, többször egymás után.

### KVE-017 – Mentés és folytatás jelenleg nincs

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett változó:** `G`; nincs `localStorage` használat.
- **Probléma leírása:** a játékállapot csak memóriában él. Oldalfrissítéskor a játék elveszik, kivéve az eredmény utáni szándékos újratöltést.
- **Bizonyíték és ellenőrzési mód:** bizonyított hiány statikus kóddal.
- **Technikai következmény:** nincs migrációs/verziózási kérdés, de nincs folytathatóság sem.
- **Felhasználói következmény:** hosszabb órai vagy otthoni gyakorlás megszakadáskor elvész.
- **Pedagógiai következmény:** a tanuló nem tudja ugyanonnan folytatni a felidézési folyamatot; tanári mérésben nehezebb a részállapot kezelése.
- **Konkrét javítási javaslat:** opcionális, verziózott séma: kulcs például `tanariJatektar.kiVagyokEn.v1`; mezők: `schemaVersion`, `savedAt`, `order`, `round`, `revealed`, `boardOpen`, `score`, `solved`, `results`, `locked`, `currentInput` nélkül vagy adatvédelmi döntéssel. Sérült/inkompatibilis mentés esetén biztonságos törlés és új játék.
- **Regressziós kockázat:** magasabb, mert a mentés a teljes állapotgépet érinti.
- **Szükséges teszt:** mentés, reload, folytatás, sérült JSON, régi séma, befejezett játék, újrakezdés mentés törléssel.

### KVE-018 – JavaScript állapotmodell egyszerű, de implicit állapotgép

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett változó:** `G={order,round,revealed,boardOpen,score,solved,results,locked}`.
- **Probléma leírása:** a globális `G` objektum jól átlátható, de nincs explicit állapotfázis (`cover`, `playing`, `roundLocked`, `ending`, `transitioning`). Emiatt több függvény saját feltételekre támaszkodik.
- **Bizonyíték és ellenőrzési mód:** fejlesztési kockázat, statikus kód.
- **Technikai következmény:** nehezebb kizárni az érvénytelen függvényhívási sorrendeket.
- **Felhasználói következmény:** ritka, gyors interakciós hibáknál inkonzisztens UI lehet.
- **Pedagógiai következmény:** az eredmény és előrehaladás megbízhatósága sérülhet.
- **Konkrét javítási javaslat:** minimális állapotgép mező: `G.phase`; központi `setPhase()` és guardok a fő akcióknál.
- **Regressziós kockázat:** közepes.
- **Szükséges teszt:** függvényhívások minden fázisban; körváltás és befejezés.

### KVE-019 – Névtábla minden még nem megoldott személyt mutat, nem csak az aktuális sorsolt 8-at

- **Súlyosság:** alacsony
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett függvény:** `renderBoard()`.
- **Probléma leírása:** a névtábla a teljes `FIGURES` listát rendereli, miközben a játék csak `ROUNDS=8` személyt sorsol. Ez lehet szándékos nehezítés, de nincs külön kimondva, hogy a táblán olyan személyek is vannak, akik az adott játékban nem biztosan szerepelnek.
- **Bizonyíték és ellenőrzési mód:** bizonyított működés statikus kóddal.
- **Technikai következmény:** a rossz táblaválasztás gyakori lehet, és nyomot éget.
- **Felhasználói következmény:** a segítség nagyobb kognitív terhelést ad, mint egy szűkített opciólista.
- **Pedagógiai következmény:** pozitívan mérheti a teljes névsor ismeretét, de frusztráló lehet gyengébb tanulóknál.
- **Konkrét javítási javaslat:** bizonyított hibaként nem kell módosítani. Fejlesztési javaslatként a szabályszöveg tegye egyértelművé, hogy a névtábla teljes arcképcsarnok-e vagy csak az aktuális játék szereplői.
- **Regressziós kockázat:** alacsony, ha csak szöveges pontosítás; magasabb, ha pedagógiai szabály változik.
- **Szükséges teszt:** névtábla használat, már megoldott személyek tiltása, nem sorsolt személy választása.

### KVE-020 – Konzolhibák tényleges böngészős ellenőrzése nem történt, statikusan nincs nyilvánvaló szintaktikai hiba

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett kód:** teljes inline JavaScript.
- **Probléma leírása:** a kód statikusan koherensnek tűnik, de Playwright vagy böngészőautomatizálás nem lett telepítve/futtatva. A Google Fonts külső erőforrás hálózati elérése is konzol/network figyelmeztetést okozhat környezettől függően.
- **Bizonyíték és ellenőrzési mód:** HTTP betöltés curl-lel ténylegesen ellenőrizve; JS konzol manuálisan ellenőrizendő.
- **Technikai következmény:** runtime hibák csak manuális böngészős futtatással zárhatók ki.
- **Felhasználói következmény:** nem ismert, hogy minden interakció hibamentes-e böngészőben.
- **Pedagógiai következmény:** konzolhiba esetén a játékmenet megszakadhat, a tanulási mérés érvénytelen lehet.
- **Konkrét javítási javaslat:** későbbi fejlesztéskor csomagtelepítés nélkül is készíthető kézi tesztjegyzőkönyv; ha engedélyezett, böngészőautomatizált smoke teszt.
- **Regressziós kockázat:** alacsony.
- **Szükséges teszt:** friss böngészőprofil, nyitott konzol, betöltés, teljes játékmenet, újrakezdés, eredmény.

### KVE-021 – Mobil és virtuális billentyűzet kezelés nincs külön támogatva

- **Súlyosság:** alacsony
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett kódrészlet:** `input type="text"`, `autocomplete="off"`, `spellcheck="false"`.
- **Probléma leírása:** a szövegmező mobilon várhatóan használható, de nincs `enterkeyhint`, nincs beviteli fókusz utáni scroll-kezelés, és a virtuális billentyűzet által okozott viewport-változás nincs tesztelve.
- **Bizonyíték és ellenőrzési mód:** statikus kód alapján fejlesztési javaslat; manuálisan ellenőrizendő mobilon.
- **Technikai következmény:** kis képernyőn a feedback vagy gomb eltakaródhat.
- **Felhasználói következmény:** több görgetés, nehezebb beadás.
- **Pedagógiai következmény:** mobilon lassabb felidézés, frusztráció.
- **Konkrét javítási javaslat:** `enterkeyhint="done"` vagy `send`, célzott scroll a feedbackhez vagy következő gombhoz, manuális mobilteszt.
- **Regressziós kockázat:** alacsony.
- **Szükséges teszt:** iOS/Android böngésző vagy DevTools mobil emuláció manuálisan.

### KVE-022 – Automatikus tesztelhetőség korlátozott, mert minden egy fájlban és globális függvényekben van

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett kód:** teljes inline script; `FIGURES`, `norm`, `potential`, `resolveGuess`.
- **Probléma leírása:** a hasznos tiszta függvények (`norm`, `shuffle`) inline scriptben vannak, DOM-függő függvényekkel keverve. Build és csomag nélkül is lehetne önellenőrző, de jelenleg nincs tesztharness.
- **Bizonyíték és ellenőrzési mód:** statikus kód.
- **Technikai következmény:** regressziók kézi tesztre maradnak.
- **Felhasználói következmény:** új fejlesztés után nagyobb eséllyel marad rejtett hiba.
- **Pedagógiai következmény:** pontozási vagy alias regresszió észrevétlenül torzíthatja a tanulói eredményt.
- **Konkrét javítási javaslat:** csomag nélkül futtatható, böngészőben megnyitható vagy konzolból indítható `selfTest()` csak fejlesztői módban; alias-ütközés és pontozás mátrix ellenőrzés.
- **Regressziós kockázat:** alacsony, ha nem változtat runtime viselkedést.
- **Szükséges teszt:** `norm()` minták, `potential()` minden nyomszinten, `accept` duplikációk, `AMBIG` ütközések.

### KVE-023 – Történelmi tartalom változatlanságának védelme jelenleg manuális diffre támaszkodik

- **Súlyosság:** magas
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett adat:** `FIGURES` tömb `name`, `accept`, `bio`, `clues` mezői.
- **Probléma leírása:** a tartalom és logika egy fájlban keveredik. Technikai javításkor könnyen módosulhat véletlenül egy történelmi állítás, nyom vagy elfogadott válasz.
- **Bizonyíték és ellenőrzési mód:** fejlesztési kockázat, statikus kód.
- **Technikai következmény:** diff review nélkül nehéz elkülöníteni a tartalmi és technikai módosítást.
- **Felhasználói következmény:** észrevétlen tartalmi változás tanári bizalmat ronthat.
- **Pedagógiai következmény:** hibás vagy megváltozott történelmi állítás félretaníthat, illetve módosíthatja a feladat nehézségét.
- **Konkrét javítási javaslat:** tartalom érintése nélkül, később ellenőrző hash vagy külön „tartalmi diff” jegyzőkönyv; bármely alias/tartalom változtatás tanári jóváhagyással.
- **Regressziós kockázat:** alacsony dokumentációval, magas tartalmi refaktorral.
- **Szükséges teszt:** commit előtt `git diff -- games/ki-vagyok-en/index.html`, külön figyelemmel `FIGURES` mezőkre.

### KVE-024 – A játék pedagógiailag elsősorban felismerést és aktív felidézést mér, nem történelmi jelentőség magyarázatát

- **Súlyosság:** alacsony
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett tartalom/logika:** nyomok, `bio`, pontozás és körvégi visszajelzés.
- **Probléma leírása:** ez nem hiba, hanem pedagógiai határ. A játék jól méri, hogy a tanuló nyomokból mennyire korán azonosít történelmi személyt. Nem méri önállóan, hogy a tanuló meg tudja-e fogalmazni a személy történelmi jelentőségét.
- **Bizonyíték és ellenőrzési mód:** statikus pedagógiai elemzés.
- **Technikai következmény:** nincs második válaszmező, rubric vagy értékelés.
- **Felhasználói következmény:** a tanuló sikeres lehet névfelismeréssel akkor is, ha a jelentőséget csak passzívan olvassa el.
- **Pedagógiai következmény:** érettségi kompetenciák közül az azonosítás erősödik, az indoklás/összefüggésmagyarázat kevésbé.
- **Konkrét javítási javaslat:** opcionális 3.0 pedagógiai modul tanári jóváhagyással: felismerés után rövid, nem automatikusan pontozott vagy tanári kulccsal ellenőrzött kérdés: „Miért jelentős ez a személy?” A történelmi tartalmat nem szabad automatikusan átírni.
- **Regressziós kockázat:** magas pedagógiai és UX kockázat, ha kötelezővé teszi és lassítja a játékot; ezért csak opcionális.
- **Szükséges teszt:** tanári tartalmi validáció, tanulói pilot, időráfordítás és frusztráció mérése.

### KVE-025 – Vizuális feedback erős, de szín mellett programozott állapot és kontraszt ellenőrzés kell

- **Súlyosság:** közepes
- **Pontos fájl:** `games/ki-vagyok-en/index.html`
- **Érintett CSS/HTML:** `.feedback.ok`, `.feedback.bad`, `.feedback.info`, `role="status"`.
- **Probléma leírása:** a feedback szövegesen is közli a helyes/hibás állapotot, ami jó. A színek és kontrasztok tényleges WCAG ellenőrzése nem történt meg, és az állapot ikon/előtag nélkül kevésbé gyorsan felismerhető lehet.
- **Bizonyíték és ellenőrzési mód:** statikus kód; kontraszt manuálisan vagy eszközzel ellenőrizendő.
- **Technikai következmény:** lehetséges kontraszt vagy nem színfüggő megkülönböztetés hiányosság.
- **Felhasználói következmény:** gyengénlátó vagy színtévesztő felhasználók lassabban észlelhetik a visszajelzést.
- **Pedagógiai következmény:** a hibából tanulást gyengíti, ha a visszajelzés nem elég észrevehető.
- **Konkrét javítási javaslat:** „Helyes:”, „Nem jó:”, „Információ:” prefixek következetesen; fókusz vagy scroll a feedbackre körzárás után.
- **Regressziós kockázat:** alacsony.
- **Szükséges teszt:** kontrasztmérés, screen reader, billentyűzetes körzárás.

## 3. Megtartandó működések

- A játék maradjon egy önállóan futtatható statikus HTML/CSS/JavaScript oldal.
- A nyomok nehéztől könnyű felé haladó sorrendje maradjon meg.
- A szabad felidézés legyen elsődleges; a névtábla segítségként, pontlevonással működjön.
- A helyes válaszért járó pont a felfedett nyomok számától függjön, minimum 1 ponttal.
- Az ékezet- és központozás-toleráns `norm()` működés maradjon meg.
- A félreérthető rövid nevek ne számítsanak automatikusan hibás tippnek.
- Az ismeretlennek minősített elgépelés jelenleg ne égessen nyomot; ennek szigorítása csak tanári döntéssel történjen.
- A `G.locked` jellegű körzár megőrzendő, mert csökkenti a dupla pontozás kockázatát.
- A kör végi életrajzi visszajelzés és az eredményképernyős áttekintés maradjon tanulást segítő funkció.
- A történelmi személyek nevei, nyomai, életrajzai és pontozási tartalmi szabályai automatikusan ne módosuljanak.

## 4. Javasolt 3.0 funkciók

### Kötelező

- Tranzakcióbiztos körváltás: `goNextRound()` egyszeri aktiválással és azonnali gombtiltással.
- Teljes fókuszkezelési terv: kezdés, nyomfelfedés, névtábla nyitás, körzár, következő kör, eredményképernyő, újrakezdés.
- Látható `:focus-visible` állapot minden gombon és névtáblaelemen.
- Alias- és ambiguitás audit tanári jóváhagyással, automatikus ütközésellenőrzéssel.
- Biztonságosabb DOM-renderelés tartalmi mezőknél `textContent`-alapú építéssel, ahol nincs szükség formázott HTML-re.
- Teljes manuális tesztjegyzőkönyv 360/768/1280 px, billentyűzet, fókusz, képernyőolvasó és konzol mentén.

### Ajánlott

- Alkalmazásszintű `resetGame()` teljes állapot-visszaállítással, nem csak `location.reload()`.
- Opcionális, verziózott `localStorage` mentés és folytatás: `tanariJatektar.kiVagyokEn.v1` kulccsal, sérült mentés biztonságos kezelésével.
- Fejlesztői önellenőrző tesztek csomagtelepítés nélkül: normalizálás, alias-ütközés, pontozási mátrix, állapotátmenetek.
- Mobil finomhangolás: `enterkeyhint`, feedbackhez görgetés, kis kijelzős recap és névtábla ellenőrzése.
- Képernyőolvasós státusz külön élő régióban: kör, pontszám, potenciális pont, segítség aktiválása.

### Későbbi fejlesztés

- Opcionális tanári mód: aliaslista vagy elfogadási szigor beállítása tartalmi jóváhagyással.
- Tanári export/import nélküli lokális eredményösszegzés, személyes adat tárolása nélkül.
- Gyakorló mód és vizsga mód különbsége: gyakorló módban több magyarázat, vizsga módban kevesebb segítség.
- Opcionális második pedagógiai kérdés felismerés után: „Miért jelentős ez a személy?” Ez csak tanári tartalmi jóváhagyással, külön értékelési rubrikával és történelmi forrásellenőrzéssel vezethető be; a meglévő történelmi tartalom automatikus átírása nélkül.

## 5. Prioritásos végrehajtási terv

1. **Cél:** tranzakcióbiztos körváltás.
   - **Érintett fájl:** `games/ki-vagyok-en/index.html`.
   - **Várható módosítás:** `nextBtn()` inline `onclick` helyett `goNextRound()` és `showEnding()` jellegű függvények; azonnali gombtiltás.
   - **Függőségek:** nincs.
   - **Tesztek:** dupla kattintás, Enter nyomva tartás, utolsó kör után eredmény.
   - **Becsült kockázat:** közepes.

2. **Cél:** fókusz és billentyűzetes használat stabilizálása.
   - **Érintett fájl:** `games/ki-vagyok-en/index.html`.
   - **Várható módosítás:** `focus-visible` CSS, fókuszcélok képernyőváltáskor, körzár után következő gomb fókuszálása.
   - **Függőségek:** 1. lépés ajánlott.
   - **Tesztek:** Tab/Shift+Tab, Enter/Space, névtábla, eredményképernyő.
   - **Becsült kockázat:** közepes.

3. **Cél:** képernyőolvasós státuszok javítása.
   - **Érintett fájl:** `games/ki-vagyok-en/index.html`.
   - **Várható módosítás:** külön státusz régió, egyszeres feedback frissítés, címek `aria-labelledby` kapcsolata.
   - **Függőségek:** 2. lépés.
   - **Tesztek:** NVDA/VoiceOver manuális teszt, feedback sorrend.
   - **Becsült kockázat:** alacsony-közepes.

4. **Cél:** alias- és ambiguitás audit.
   - **Érintett fájl:** `games/ki-vagyok-en/index.html`, esetleg külön dokumentált tanári jóváhagyás.
   - **Várható módosítás:** `accept` és `AMBIG` validáció, de történelmi tartalom csak jóváhagyással változhat.
   - **Függőségek:** tanári döntés.
   - **Tesztek:** alias mátrix, negatív tesztek, regressziós körök.
   - **Becsült kockázat:** magas.

5. **Cél:** reszponzív és mobil finomhangolás.
   - **Érintett fájl:** `games/ki-vagyok-en/index.html`.
   - **Várható módosítás:** kis képernyős CSS, recap és névtábla javítás, `enterkeyhint`.
   - **Függőségek:** manuális viewport audit.
   - **Tesztek:** 360/768/1280 px, virtuális billentyűzet, hosszú feedback.
   - **Becsült kockázat:** alacsony-közepes.

6. **Cél:** opcionális mentés és folytatás.
   - **Érintett fájl:** `games/ki-vagyok-en/index.html`.
   - **Várható módosítás:** verziózott `localStorage` séma, mentés-visszatöltés, sérült mentés kezelése.
   - **Függőségek:** explicit termékpedagógiai döntés.
   - **Tesztek:** reload, sérült JSON, régi séma, befejezett játék, reset.
   - **Becsült kockázat:** magas.

7. **Cél:** opcionális második pedagógiai kérdés tervezése.
   - **Érintett fájl:** később `games/ki-vagyok-en/index.html`, de csak külön jóváhagyással.
   - **Várható módosítás:** nem automatikus tartalmi átírás; tanári rubrika és pilot alapján bevezethető modul.
   - **Függőségek:** tanári tartalmi jóváhagyás, időkeret döntés.
   - **Tesztek:** tanulói próba, rubrika validáció, akadálymentességi ellenőrzés.
   - **Becsült kockázat:** magas pedagógiai kockázat.

## 6. Elfogadási kritériumok

- A játék továbbra is közvetlenül `games/ki-vagyok-en/index.html` fájlból futtatható, build és csomag nélkül.
- A történelmi tartalom (`name`, `bio`, `clues`) nem változik technikai javítás során.
- Egy kör helyes vagy elvesztett állapota után ugyanaz a kör nem pontozható újra.
- Gyors dupla kattintás vagy ismételt Enter/Space nem ugorhat át egynél több körre.
- A „Következő rejtőzködő” és „Eredmény” akció egyszer aktiválható állapotátmenetenként.
- A pontszám minden nyomszinten és névtábla-használat mellett a dokumentált képlet szerint frissül.
- A névtábla megnyitása körönként legfeljebb egyszer csökkenti az aktuális potenciális pontot.
- Üres vagy ismeretlen név nem éget nyomot; létező, de rossz személy választása a dokumentált szabály szerint éget nyomot.
- Minden interaktív elem billentyűzettel elérhető, látható fókuszjelzéssel.
- Képernyőváltáskor a fókusz az új állapot első hasznos elemére kerül.
- A visszajelzések képernyőolvasóval is érzékelhetők, és nem csak szín alapján különböznek.
- 360, 768 és 1280 px szélességen nincs kényszerű vízszintes görgetés, eltakarás vagy használhatatlan vezérlő.
- Újrakezdéskor a pontszám, kör, nyomok, névtábla, input, feedback, lezárt állapot és eredménylista visszaáll.
- Ha mentés/folytatás készül, verziózott séma, sérült mentés kezelés és reset-szabály dokumentált.
- Friss böngészőprofilban betöltés, játékmenet, újrakezdés és befejezés közben nincs JavaScript-konzolhiba.

## 7. Ellenőrzési jegyzőkönyv

### Statikus kódelemzéssel igazolt megállapítások

- A kötelező projekt- és pedagógiai dokumentumok elolvasva: `AGENTS.md`, `README.md`, `docs/DEVELOPMENT_RULES.md`, `docs/PEDAGOGICAL_RULES.md`, `docs/TESTING_CHECKLIST.md`.
- A vizsgált játékfájl: `games/ki-vagyok-en/index.html`.
- Igazolt pozitívumok: statikus HTML/CSS/JS felépítés, alap válasz-normalizálás, körzár, névtábla pontlevonása, kör végi és végső tanulási feedback.
- Statikusan azonosított kockázatok: inline eseménykezelők, `nextBtn()` gyors ismételt aktiválási kockázata, részleges fókuszkezelés, hiányzó gomb fókuszstílus, hiányzó mentés/folytatás, következetlen alias-szigor, tartalom és logika egy fájlban keveredése. Ezek közül a gyors interakciós, fókusz-, billentyűzetes, viewport-, képernyőolvasós és konzolviselkedések tényleges böngészős futtatással még nem igazoltak.
- A történelmi tartalomhoz nem nyúltam, és az audit nem állít tartalmi javítást ellenőrzött forrás nélkül.

### Ténylegesen futtatott ellenőrzések, pontos parancs és eredmény

- Parancs: `pwd && find .. -name AGENTS.md -print && git status --short && sed -n '1,220p' AGENTS.md && sed -n '1,220p' README.md && sed -n '1,260p' docs/DEVELOPMENT_RULES.md && sed -n '1,260p' docs/PEDAGOGICAL_RULES.md && sed -n '1,260p' docs/TESTING_CHECKLIST.md`
  - Eredmény: sikeres; a repository gyökere `/workspace/tanari-jatektar`, egy releváns `AGENTS.md` található, a kötelező dokumentumok beolvasása megtörtént.
- Parancs: `nl -ba games/ki-vagyok-en/index.html | sed -n '1,260p'; nl -ba games/ki-vagyok-en/index.html | sed -n '260,520p'`
  - Eredmény: sikeres; a kijelölt játék HTML/CSS/JS tartalma sorszámozva áttekintve.
- Parancs: `python3 -m http.server 8000 > /tmp/kve-http.log 2>&1 & echo $! > /tmp/kve-http.pid; sleep 1; curl -I -sS http://localhost:8000/games/ki-vagyok-en/; kill $(cat /tmp/kve-http.pid) 2>/dev/null || true; wait $(cat /tmp/kve-http.pid) 2>/dev/null || true`
  - Eredmény: sikeres; a `curl` válasz: `HTTP/1.0 200 OK`, `Content-type: text/html`, `Content-Length: 31596`.

### Nem futtatott, manuálisan szükséges ellenőrzések

- 360 px, 768 px és 1280 px tényleges böngészős viewport teszt.
- Teljes billentyűzetes játékmenet Tab, Shift+Tab, Enter és Space használatával.
- Látható fókusz vizuális ellenőrzése minden gombon, inputon és névtáblaelemen.
- Fókuszpozíció ellenőrzése kezdéskor, névtábla nyitásakor, körzáráskor, következő körnél és eredményképernyőn.
- Képernyőolvasós ellenőrzés `aria-live`, címhierarchia, státusz és visszajelzés bejelentéseire.
- JavaScript-konzolhiba ellenőrzése betöltés, játékmenet, újrakezdés és befejezés közben.
- Gyors dupla kattintás, ismételt Enter/Space és körátugrás tényleges reprodukciós tesztje.
- Mobil és virtuális billentyűzet teszt fizikai vagy emulált eszközön.
- Történelmi aliaslista tanári validációja.

### Megváltozott fájlok

- `docs/ki-vagyok-en-audit.md` létrejött.

### `git diff --name-only` és `git status --short` eredménye

- Parancs: `git diff --name-only`
  - Eredmény: nem adott ki fájlnevet, mert az auditfájl új, még nem stage-elt untracked fájl volt.
- Parancs: `git status --short`
  - Eredmény: `?? docs/ki-vagyok-en-audit.md`.
- Következtetés: kizárólag `docs/ki-vagyok-en-audit.md` jelent meg új fájlként; tiltott játék- vagy dokumentációs fájl nem módosult.

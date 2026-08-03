# Tesztelési ellenőrzőlista

Az ellenőrzést minden érintett játékon, friss böngészőprofilban és nyitott fejlesztői konzol mellett kell elvégezni.

## 1. Alapvető működés

- [ ] A játék helyi statikus webszerverről betöltődik.
- [ ] A nyitóképernyő, az utasítások és az első feladat teljesen megjelenik.
- [ ] Minden fő játéklépés végrehajtható.
- [ ] A helyes és hibás válasz visszajelzése megfelel a játék logikájának.
- [ ] A pontszám és az előrehaladás helyesen frissül.
- [ ] A befejező állapot és az összegzés elérhető.

## 2. Reszponzív mobilteszt

- [ ] Teszt 360 px szélességen.
- [ ] Teszt 768 px szélességen.
- [ ] Teszt 1280 px szélességen.
- [ ] Nincs vízszintes, kényszerű görgetés a játék fő felületein.
- [ ] A szövegek nem lógnak ki és nem takarják egymást.
- [ ] A gombok, mezők és egyéb vezérlők érintéssel is biztonságosan használhatók.
- [ ] A felugró ablakok és eredménypanelek kis képernyőn is bezárhatók.

## 3. Billentyűzet és fókuszkezelés

- [ ] A játék teljes egészében használható billentyűzettel.
- [ ] A Tab-sorrend logikus és követi a vizuális sorrendet.
- [ ] Minden interaktív elem elérhető Tab, Shift+Tab, Enter és szükség szerint Space használatával.
- [ ] A fókuszjelölés minden vezérlőn jól látható.
- [ ] Nézetváltás vagy felugró ablak megnyitása után a fókusz a megfelelő új elemre kerül.
- [ ] Felugró ablak bezárásakor a fókusz visszatér a megnyitó vezérlőre.
- [ ] A fókusz nem kerül rejtett, letiltott vagy nem interaktív elemre.
- [ ] Nincs billentyűzetcsapda.

## 4. Képernyőolvasós visszajelzések

- [ ] A játék címe, a feladatutasítás és a vezérlők neve érthetően felolvasásra kerül.
- [ ] A címhierarchia és a régiók logikusak.
- [ ] A képek és ikonok megfelelő alternatív szöveggel rendelkeznek, vagy dekoratívként vannak megjelölve.
- [ ] A helyes és hibás válasz visszajelzése képernyőolvasóval is érzékelhető.
- [ ] A pontszám, az idő, az előrehaladás és az állapotváltozás szükség szerint élő régióban jelenik meg.
- [ ] A vizuális színjelzés mellett szöveges vagy programozott visszajelzés is rendelkezésre áll.
- [ ] A felugró ablak neve, szerepe és bezárási lehetősége egyértelmű.

## 5. Újrakezdés

- [ ] Az újrakezdés minden játékállapotból elérhető, ahol a tervezés szerint szükséges.
- [ ] Az újrakezdés visszaállítja a pontszámot, a feladatállapotot, az időzítőt és az ideiglenes visszajelzéseket.
- [ ] Az előző játékból nem marad kijelölt vagy letiltott elem.
- [ ] Többszöri egymás utáni újrakezdés sem okoz hibát vagy többszörös eseménykezelést.

## 6. Mentés és folytatás

- [ ] Mentés után az oldal újratöltésével a megfelelő játékállapot folytatható.
- [ ] A mentett pontszám, előrehaladás és szükséges beállítások helyesen állnak vissza.
- [ ] Befejezett játék mentése nem indít hibás vagy duplán értékelt folytatást.
- [ ] Sérült, hiányos vagy régi formátumú mentés kezelése nem állítja le a játékot.
- [ ] Újrakezdéskor a mentett állapot a tervezett szabály szerint törlődik vagy felülíródik.
- [ ] Ha egy játék jelenleg nem támogat mentést, ezt dokumentált hiányként kell rögzíteni, nem teljesített tesztként megjelölni.

## 7. Dupla kattintás és dupla pontozás

- [ ] Gyors dupla kattintás nem indítja el kétszer ugyanazt a műveletet.
- [ ] Egy válasz egyetlen alkalommal módosítja a pontszámot.
- [ ] Enter vagy Space ismételt lenyomása nem okoz dupla pontozást.
- [ ] Következő feladatra lépéskor nem fut le kétszer az állapotváltás.
- [ ] A már értékelt válasz újbóli aktiválása nem ad további pontot és nem von le újra pontot.
- [ ] Többszöri újrakezdés után sincsenek duplikált eseménykezelők.

## 8. JavaScript-konzol és tárolás

- [ ] Az oldal betöltésekor nincs JavaScript-konzolhiba.
- [ ] Játékmenet közben nincs JavaScript-konzolhiba.
- [ ] Újrakezdéskor, mentéskor, folytatáskor és befejezéskor nincs JavaScript-konzolhiba.
- [ ] Nincs sikertelenül betöltődő szükséges erőforrás.
- [ ] A böngésző tárhelyének tiltása vagy megtelése kezelhető hibát eredményez.
- [ ] A konzol nem tartalmaz érzékeny vagy indokolatlanul részletes tanulói adatot.

## 9. Tesztjegyzőkönyv

- [ ] Rögzítve van a tesztelt játék és Git-commit azonosítója.
- [ ] Rögzítve van a böngésző neve és verziója.
- [ ] Rögzítve vannak a tesztelt képernyőszélességek.
- [ ] Minden eltéréshez tartozik reprodukciós lépés, várt eredmény és tényleges eredmény.
- [ ] A javítás után az érintett teszt és a kapcsolódó regressziós tesztek újra lefutottak.


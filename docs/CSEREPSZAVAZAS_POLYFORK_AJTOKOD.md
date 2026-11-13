# A cserépszavazás napja: Polyfork-modellek és ajtókód-elv

Állapot: javaslat tanári jóváhagyásra (külön ágon, nem került a `main` ágra).

## Mi változott

1. **Ajtókód csak a végén derül ki.** A játék fő útvonalán nincs olyan kérdés, amelynek a válasza az ajtó kódja. A végső kód az utolsó napló-/tekercsoldalon áll, amelyet a játékos a kulcs megszerzése után olvas el. A gyors fordulók (`ROUNDS`) változatlanok.
2. **Polyfork 3D-modellek.** A terem berendezésének egy része a Polyfork gyűjteményéből származó, alacsony poligonszámú (low poly) modell, base64-ként beágyazva. Licenc: CC BY 4.0; a forrásmegjelölés a nyitó- és a záróképernyőn, a „3D-modellek és licenc” szakaszban olvasható. A modellek általános berendezési tárgyak, nem korhű rekonstrukciók; ezt a szakasz is jelzi. Az interaktív (kattintható) tárgyak eljárásos modellként maradtak. Ha egy modell nem tölt be, a játék az eredeti eljárásos berendezéssel működik tovább.

## Tartalmi érintettség (ellenőrzendő)

- Az időrendi feladat „why” szövegéből kikerült a „Kr. e. 508” évszám (a kapu kódját árulta el); a tartalmi állítás egyébként nem változott.
- A kapu kérdése semleges; a kód (508, Kleiszthenész reformjai) a jegyzőkönyv utolsó lapján áll, a kamrában újra elolvasható.
- A láda fedele a Polyfork-modellben felnyílik (korábban oldalra csúszott); a szöveg „felnyílik”-ra módosult.
- Tartalmi megjegyzés: a Kr. e. 508/507 időpont a szakirodalomban kissé eltérően szerepel; a játék a tankönyvi 508-at használja, változatlanul.

## Nyitott döntés: integritás-teszt

A `tests/cserepszavazas-integrity.test.cjs` rögzíti a játékfájl méretét és SHA-256 értékét (129 963 bájt), ezért a módosított fájlon ez a teszt szándékosan elbukik („Unexpected file size”). A teszt értékeit nem módosítottuk; a tanári jóváhagyás után az új méret és hash rögzítése szükséges. A többi ellenőrzés (szkriptek fordítása, katalógus, hub) ugyanebben a tesztben a méret/hash-ellenőrzés után fut.


## Tesztek

`node tests/cserepszavazas-integrity.test.cjs` – lásd a hand-over összefoglalót. Kézi ellenőrzés: 360, 768 és 1280 px szélességen; billentyűzetes használat; konzolhiba nincs.

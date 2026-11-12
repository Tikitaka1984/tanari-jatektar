# Nyolckor indul a busz: Polyfork-modellek és ajtókód-elv

Állapot: javaslat tanári jóváhagyásra (külön ágon, nem került a `main` ágra).

## Mi változott

1. **Ajtókód csak a végén derül ki.** A játék fő útvonalán nincs olyan kérdés, amelynek a válasza az ajtó kódja. A végső kód az utolsó napló-/tekercsoldalon áll, amelyet a játékos a kulcs megszerzése után olvas el. A gyors fordulók (`ROUNDS`) változatlanok.
2. **Polyfork 3D-modellek.** A terem berendezésének egy része a Polyfork gyűjteményéből származó, alacsony poligonszámú (low poly) modell, base64-ként beágyazva. Licenc: CC BY 4.0; a forrásmegjelölés a nyitó- és a záróképernyőn, a „3D-modellek és licenc” szakaszban olvasható. A modellek általános berendezési tárgyak, nem korhű rekonstrukciók; ezt a szakasz is jelzi. Az interaktív (kattintható) tárgyak eljárásos modellként maradtak. Ha egy modell nem tölt be, a játék az eredeti eljárásos berendezéssel működik tovább.

## Tartalmi érintettség (ellenőrzendő)

- Az ajtókód kérdése (az első magyar világörökségi helyszínek felvétele, 1987) kikerült az útvonalról; új kérdés: „Melyik évben került fel a világörökségi listára a tokaji borvidék kultúrtája?” (2002; UNESCO: Tokaj Wine Region Historic Cultural Landscape, 2002).
- A kulcsot rejtő könyv „1987” helyett „2002” feliratú; a hozzá tartozó segítségek és a cédula szövege módosult.
- Az időrendi feladatban a „1987-ben” évszám a „b” állítás szövegéből elhagyva (a sorrend megmarad, az év nem árulja el a kódot).
- Az ajtó kódja (1987) az úti napló utolsó lapján áll; az ajtó kérdése semleges.


## Tesztek

`node tests/nyolckor-tanari-tarolo.test.cjs` – lásd a hand-over összefoglalót. Kézi ellenőrzés: 360, 768 és 1280 px szélességen; billentyűzetes használat; konzolhiba nincs.

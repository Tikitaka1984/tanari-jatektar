# A gróf dolgozószobája: Polyfork-modellek és ajtókód-elv

Állapot: javaslat tanári jóváhagyásra (külön ágon, nem került a `main` ágra).

## Mi változott

1. **Ajtókód csak a végén derül ki.** A játék fő útvonalán nincs olyan kérdés, amelynek a válasza az ajtó kódja. A végső kód az utolsó napló-/tekercsoldalon áll, amelyet a játékos a kulcs megszerzése után olvas el. A gyors fordulók (`ROUNDS`) változatlanok.
2. **Polyfork 3D-modellek.** A terem berendezésének egy része a Polyfork gyűjteményéből származó, alacsony poligonszámú (low poly) modell, base64-ként beágyazva. Licenc: CC BY 4.0; a forrásmegjelölés a nyitó- és a záróképernyőn, a „3D-modellek és licenc” szakaszban olvasható. A modellek általános berendezési tárgyak, nem korhű rekonstrukciók; ezt a szakasz is jelzi. Az interaktív (kattintható) tárgyak eljárásos modellként maradtak. Ha egy modell nem tölt be, a játék az eredeti eljárásos berendezéssel működik tovább.

## Tartalmi érintettség (ellenőrzendő)

- Az ajtókód kérdése (a Hitel megjelenése, 1830) kikerült az útvonalról; helyette új kérdés: „Melyik évben jelent meg Széchenyi Stádium című műve?” (1833; Széchenyi István: Stádium, 1833).
- A kulcsot rejtő könyv „1830” helyett „1833” feliratú; a hozzá tartozó segítségek és a cédula szövege módosult.
- Az ajtó kódja (1830, a Hitel megjelenése) a napló utolsó lapján áll; az ajtó kérdése semleges.
- A „Fogalmak” kérdéssor 4 eredeti kérdése változatlan.


## Tesztek

`node tests/grof-tanari-tarolo.test.cjs` – lásd a hand-over összefoglalót. Kézi ellenőrzés: 360, 768 és 1280 px szélességen; billentyűzetes használat; konzolhiba nincs.

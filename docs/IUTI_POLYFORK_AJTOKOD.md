# Iuti háza: Polyfork-modellek és ajtókód-elv

Állapot: javaslat tanári jóváhagyásra (külön ágon, nem került a `main` ágra).

## Mi változott

1. **Ajtókód csak a végén derül ki.** A játék fő útvonalán nincs olyan kérdés, amelynek a válasza az ajtó kódja. A végső kód az utolsó napló-/tekercsoldalon áll, amelyet a játékos a kulcs megszerzése után olvas el. A gyors fordulók (`ROUNDS`) változatlanok.
2. **Polyfork 3D-modellek.** A terem berendezésének egy része a Polyfork gyűjteményéből származó, alacsony poligonszámú (low poly) modell, base64-ként beágyazva. Licenc: CC BY 4.0; a forrásmegjelölés a nyitó- és a záróképernyőn, a „3D-modellek és licenc” szakaszban olvasható. A modellek általános berendezési tárgyak, nem korhű rekonstrukciók; ezt a szakasz is jelzi. Az interaktív (kattintható) tárgyak eljárásos modellként maradtak. Ha egy modell nem tölt be, a játék az eredeti eljárásos berendezéssel működik tovább.

## Tartalmi érintettség (ellenőrzendő)

- Az utolsó fogalomkérdés (az ókor kezdete) kikerült a fő útvonalról; a `FOG_Q` első négy kérdése marad.
- A tekercsdoboz-kulcs „Kr. e. 3000” helyett „Kr. e. 2950” jelű dobozban van (a láda csapzárjának kódja: Ménész egyesítése, Kr. e. 2950 körül, amelyet a játékos a láda feladatánál már megoldott).
- A „Fogalmak” segítség és a dobozra utaló cédula szövege ennek megfelelően módosult.
- Az ajtó kódja (Kr. e. 3000, az ókor kezdete) a tekercs utolsó lapján olvasható; az ajtó kérdése semleges.
- Az évszámok (Kr. e. 3000 körül, Kr. e. 2950 körül) a játék eredeti, tankönyvi kerek értékei; ezeket nem módosítottuk.


## Tesztek

`node tests/iuti-tanari-tarolo.test.cjs` – lásd a hand-over összefoglalót. Kézi ellenőrzés: 360, 768 és 1280 px szélességen; billentyűzetes használat; konzolhiba nincs.

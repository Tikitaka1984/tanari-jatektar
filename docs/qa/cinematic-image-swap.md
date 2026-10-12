# Cinematic Edition – feltöltési és elfogadási ellenőrzés (2026-10-12)

## Állapot: hiányzó bináris képfájlok miatt NEM MERGE-ELHETŐ

A `index.html` módosítása 10 új `assets/hub-*.webp` képfájlra mutat. Ezek a kapcsolódó, e beszélgetésben előállított `Tanari_Jatektar_Cinematic_Kepek_GitHub.zip` fájlban találhatók, **de még nincsenek feltöltve a GitHub ágra**. A ZIP nem teljes oldal és nem deploy-olható önállóan.

| Célkártya kulcsa | Elvárt képfájl |
|---|---|
| roma | assets/hub-roma.webp |
| korona | assets/hub-korona.webp |
| leveltar | assets/hub-leveltar.webp |
| ketforras | assets/hub-ketforras.webp |
| kivagyok | assets/hub-kivagyok.webp |
| nyolckor | assets/hub-nyolckor.webp |
| junius | assets/hub-junius.webp |
| demo-felfedezesek | assets/hub-demo-felfedezesek.webp |
| demo-roma | assets/hub-demo-roma.webp |
| grof | assets/hub-grof.webp |

A többi 8 katalóguskártya eredeti `hub-*.svg` képe megmarad, amíg azokhoz is készül megfelelő új illusztráció.

## Végső integráció
1. A ZIP `assets/` fájljait töltsd fel ugyanarra a `feature/cinematic-webp-cards-20261012` ágra.
2. Ellenőrizd a GitHubon az összes WebP jelenlétét és a manifest szerinti SHA-256 hash-egyezést.
3. Valódi Playwright Chromium ellenőrzés: 360/768/1280 px; főoldali hero, két kiemelt játék, 18 katalóguskártya; képek HTTP 200, 0 broken image; navigáció, szűrés, 3D és játék megnyitás/visszalépés, konzolhiba.
4. Ellenőrizd a betöltési teljesítményt és a mobilnézetet, a képátviteli méretet.
5. Csak a sikeres ellenőrzés után merge + Vercel production kontroll.

## Biztonsági korlát
A GitHub connector itt az `index.html` szöveges módosítását végrehajtotta, de a kész WebP-fájlok bináris feltöltését nem. A főág és Vercel production változatlan. A PR Draft marad mindaddig, amíg minden képfájl be nem került.

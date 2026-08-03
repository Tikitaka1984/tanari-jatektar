# Fejlesztési szabályok

## 1. Technológiai keretek

- Ne használjunk frontend keretrendszert.
- A projekt maradjon statikus HTML, CSS és JavaScript.
- Ne vezessünk be buildfolyamatot, csomagkezelőt vagy futásidejű szerverfüggőséget, ha az adott feladat ezt nem teszi elkerülhetetlenné.
- Egy játék továbbra is közvetlenül a saját `index.html` fájljából legyen futtatható.
- Külső függőség hozzáadása csak előzetes műszaki és adatvédelmi ellenőrzés után történhet.

## 2. Tartalomvédelem

- A történelmi tartalom nem módosítható automatikusan.
- Tilos tömeges keresés-cserével vagy generatív eszközzel átírni a kérdéseket, válaszokat, magyarázatokat, évszámokat, neveket, fogalmakat és forrásszövegeket.
- A tartalmi és technikai változtatásokat külön kell kezelni.
- Történelmi tartalmi módosítás csak tanári jóváhagyással, egyértelműen dokumentált indoklással és ellenőrizhető források alapján végezhető.
- A működést nem érintő formázás sem változtathatja meg a feladat jelentését, a helyes válaszokat vagy a pontozási logikát.

## 3. Git-munkafolyamat

- Minden fejlesztés külön Git-ágon történjen.
- Az ág neve jelezze a változtatás típusát és célját, például `fix/dupla-pontozas` vagy `feature/mentes-folytatas`.
- Közvetlenül a főágon ne történjen fejlesztés.
- A változtatások legyenek kis, ellenőrizhető commitokra bontva.
- Egy commit lehetőleg egyetlen logikai változtatást tartalmazzon.
- Ne kerüljön ugyanabba a commitba történelmi tartalmi módosítás és technikai refaktorálás.
- Commit előtt ellenőrizni kell a diffet, különösen a történelmi szövegek és a pontozás környezetében.

## 4. Módosítási elvek

- Először a legkisebb, visszafordítható változtatást kell megtervezni.
- A meglévő játéklogikát és adatstruktúrát csak a feladat által szükséges mértékben szabad módosítani.
- Kerülni kell az egész fájl automatikus újraformázását, mert elrejtheti a valódi változtatásokat.
- Új funkció nem ronthatja a billentyűzetes és képernyőolvasós használhatóságot.
- A böngészőben tárolt adatok kulcsait, formátumát és verziózását dokumentálni kell.
- Mentési formátum változtatásakor visszafelé kompatibilitást vagy biztonságos migrációt kell biztosítani.

## 5. Ellenőrzés és átadás

- Minden fejlesztéshez tartozzon célzott kézi vagy automatizált ellenőrzés.
- A teljes ellenőrzéshez a `TESTING_CHECKLIST.md` használata kötelező.
- JavaScript-konzolhibával, ismert dupla pontozással vagy megszakadt újrakezdéssel változtatás nem tekinthető késznek.
- Az átadáskor röviden dokumentálni kell, mi változott, mit nem érintett a fejlesztés, és hogyan történt az ellenőrzés.


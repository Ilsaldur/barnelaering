# Etappe V – Samlingen forklarer seg selv, og alle stiger gir kort (runde 5)

## Endret

- **Kort i alle stiger.** `src/data/kort.js` har fått `fag` på settene og kortene, og ett kort per nivå i Lese (12, bokstavdyr), Skrive riktig (4), Språk (3), Klokka (8, klokker og tider), Geografi (9, flagg som bilde fra `public/flagg/` og landemerker) og Engelsk (10, ord med bilde). Navn, bilde og én faktalinje, merket UTKAST. `kortForNivaa(nivaa, fag)`; gamle mattekort har samme id-er som før, så eksisterende profiler beholder alt.
- **Regelen gjelder overalt:** `nyeKort({ nivaa, fag, levelUp, stars })` gir kortet ved nivå opp eller tre stjerner, i alle stiger. Sjefsoppgave som gir hopp gir kortene for nivåene den hopper over, i alle stiger (`kortPerNivaa` er borte).
- **Samlingen:** reven sier «Du får et kort hver gang du klarer et nivå med tre stjerner, eller går opp et nivå.» Settene er gruppert per fag med fagnavn over, og tellingen «x av y kort» gjelder alle. Trykk på et grått kort åpner et vindu: fag og nivå («Geografi, nivå 3»), nivåets navn, hva som trengs, og en knapp «Til geografi nivå 3» som går til faget (Lese/Skrive riktig/Språk åpner riktig spor). Er nivået passert, sier vinduet at barnet kan spille det om igjen på kartet. Bonuskort får sin egen forklaring. Geografikort med flagg vises med flaggbildet.

## Testet

- `src/lib/__tests__/etappeV.test.js`: hver stige har ett kort per nivå med navn, bilde og fakta, alle flaggfiler finnes, id-ene er unike, gamle id-er finnes fortsatt; 1) nivå opp på Geografi 3 gir `geo-3`, tre stjerner på Lese 5 gir `lese-5`, aldri to ganger, matte som før, to stjerner gir ikke kort; 3) gamle kort-id-er er bevart.
- `src/__tests__/app/samling.app.test.jsx` (i appen): revens forklaring og tellingen; grått geografikort (passert nivå) åpner vinduet med «Geografi, nivå 3» og «passert», knappen kaller `onFag('geografi')`; grått lesekort åpner «Lese, nivå 7» med «tre stjerner», knappen kaller `onFag('lesing')`; settene for geografi og engelsk vises.

## Prøv selv

- Samlingen: trykk på et grått kort og følg knappen til faget.
- Gå opp et nivå i Klokka eller få tre stjerner i Lesing: nytt kort i det settet.
- Eksisterende profil: alle gamle kort er der.

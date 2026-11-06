# Etappe O – Still klokka (runde 4)

## Endret

- **Den korte viseren står der barnet slipper den**, rundet til 2,5 grader, og flyttes ikke når den lange viseren settes. `AnalogClock` har fått `hourDeg` (tegn den korte viseren på en vinkel) og `fasit` (tegner riktig timeviser grønn og stiplet etter svar). `onChange` sier hvilken viser som ble flyttet.
- **Rett svar:** den lange viseren på riktig minutt og den korte mindre enn 12 grader fra riktig plass (time × 30 + minutter × 0,5). Reglene ligger i `src/lib/klokke/vinkel.js`: `startKlokke`, `settTime`, `settMinutt`, `stillRiktig`, `stiltTid`, `timeviserTekst`.
- **Ved feil** står det hvor den korte viseren skal stå («midt mellom 6 og 7», «nesten på 2», «rett på 3», «litt forbi 12»), og den riktige viseren tegnes på klokka. «Du: …» regnes ut fra vinkelen.
- **Instruksen:** «Sett den lange viseren på minuttene og den korte på timen.»

## Testet

`src/lib/__tests__/etappeO.test.js`:
1. Alle 144 tider med fem minutters steg godtas med den korte viseren på riktig plass, både kort viser først og lang viser først. «Du:» viser riktig klokkeslett. Feil minutt godtas ikke.
2. «Halv 7» med den korte viseren rett på 7 eller rett på 6 godtas ikke (15 grader unna). «Fem på 2» rett på 2 godtas (2,5 grader unna).
3. Forklaringstekstene og den nye instruksen.

## Prøv selv

- Klokka nivå 6: still «halv 7» med den korte viseren først, så den lange. Den korte blir stående, og svaret godtas når den står midt mellom 6 og 7.
- Sett den korte rett på 7 og svar: feil, med grønn stiplet viser der den skulle stått.

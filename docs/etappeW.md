# Etappe W – Reven kan ha på flere ting (runde 5, løsning A)

Jon valgte A: en tegnet rev (SVG) med plasser.

## Endret

- **Ny rev** i `src/components/Rev.jsx`: tegnet i SVG med fem plasser: hode, øyne, hals, hånd og kropp. Fire stemninger (glad, jubel, tenker, oops) gjennom munn og øyne. Alle ti kostymene er tegnet som SVG-biter på sin plass: lue, flosshatt, krone og romhjelm på hodet; solbriller foran øynene; sløyfe og skjerf rundt halsen; tryllestav og gitar i hånda; superkappe på kroppen. Flere kan være på samtidig, høyst ett per plass.
- **Reven er maskot overalt:** `Mascot` (oppgaver, resultat, hage, samling), `Fox` i kartet, stor på forsiden og i garderoben, og på innloggingsskjermen (uten kostymer). Emoji-reven er borte som maskot.
- **Data:** `data.kostyme` (ett kostyme) er blitt lista `data.kostymerPaa`. `normalize` migrerer gamle profiler (kostyme «lue» → `['lue']`), og ved synk vinner den siste som byttet (`kostymeT`). Reglene ligger i `src/lib/kostyme.js`: `taPaa` tar av det som lå på samme plass, `taAv`, `harPaa`, `migrerKostyme`. `src/data/kostymer.js` har fått `plass` på hvert kostyme og `PLASSER` med tekst.
- **Garderoben:** reven vises stor med det den har på. Hvert kostyme viser plassen sin. Kjøp setter tingen på plassen og melder hva som ble byttet ut («Krone! Reven har den på hodet nå, i stedet for rød lue.»). Trykk på noe reven har på tar det av; trykk på noe eid tar det på. Teksten under forklarer plassene.
- `buyKostyme` i konteksten tar på via `taPaa`; `setKostyme(id, paa)` tar på eller av.

## Testet

- `src/lib/__tests__/etappeW.test.js`: alle kostymer har en gyldig plass; akseptansetesten rent (lue og briller gir begge på, krone tar av lua og ikke brillene, ta av); gammel profil med kostyme «lue» har lua på etter normalisering; fletting lar den siste vinne.
- `src/__tests__/app/garderobe.app.test.jsx` (i appen): kjøp lue, så briller → begge på; kjøp krone → briller og krone, meldingen sier «i stedet for rød lue», reven i garderoben har begge; trykk på brillene tar dem av. Gammel profil med `kostyme: 'lue'` viser lua på reven.
- Skjermbilder fra headless Chrome: forsiden med lue, briller, skjerf, tryllestav og kappe, og med romhjelm, sløyfe og gitar.

## Prøv selv

- Samlingen → garderoben: kjøp lue og briller, så krone. Reven øverst og på forsiden følger med.
- Et oppdrag: reven i oppgavekortet har kostymene på og skifter uttrykk ved riktig og galt svar.

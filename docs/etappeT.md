# Etappe T – Innføring i kunnskapsstigene (runde 5)

Gjelder geografi, engelsk og klokka (`kunnskap: true` i stigens cfg).

## Endret

- **Vis-oppgave** (form `vis`): ett bilde med navn, lest høyt, og én knapp «Neste». Flagg: «Dette er flagget til Sverige.» Kart: landet markert og «Dette er Sverige.» Hovedstad: flagget og «Stockholm er hovedstaden i Sverige.» Klokke: klokka tegnet og «Klokka er tre.» Engelsk: bildet, ordet (med norsk under) og engelsk stemme. Vis-oppgaver teller alltid som riktige (`counts`), og `tilVis(task)` i `src/lib/kunnskap.js` lager dem av et vanlig spørsmål.
- **Kjent-lista** `fag.kjent`: nøkler som «land:se», «hovedstad:se», «ord:cat», «setning:…», «tid:3:00», «digital:15:00». Normaliseres og flettes som union ved synk. `oppdaterKjent` etter hvert oppdrag: alt som ble vist blir kjent, riktig svar om noe ukjent blir kjent, bom på noe kjent fra før blir ukjent igjen (vist i dag forblir kjent).
- **Generatorene** tar `kjent` (Set), `foretrekkUkjent` og `kun`, og setter `kjent`, `visning` og `optionsKjent` på oppgaven. Feilsvar hentes blant kjente ting; er det færre enn fire kjente, blir det to eller tre alternativer. Hjelperne `velgKjent` og `kjenteFeil` ligger i `kunnskap.js`.
- **Oppdrag** (`byggKunnskapsOppdrag` i `oppdrag.js`): spørsmål om noe ukjent erstattes av vis + spørsmål om det samme rett etter, høyst tre nye per oppdrag. Har spørsmålet ingen kjente feilsvar i sin bunke (første gang, eller ny bunke som hovedsteder), vises to ting først: vis, vis, spørsmål, spørsmål. Resten er spørsmål om kjente ting. Er alt kjent, er oppdraget som i dag. Rekkefølgen beholdes, så en ting alltid vises før den spørres om.
- **Første oppdrag** (`src/lib/matte/forsteOppdrag.js`, brukt av `FinnNivaa`): i kunnskapsstigene starter det med én vis og ett spørsmål om det samme, så første svar blir riktig. Så går plasseringen som i etappe S. Bommer barnet på nivå 1, blir resten innføring (minst seks oppgaver med vis og spørsmål), og oppdraget gir tre stjerner.
- **«👀 Vis meg»** på kunnskapsoppgaver uten vanlig hjelp: viser svaret med navn (flagget, landet på kartet, ordet, klokka) og leser det. Teller som hjelp: oppgaven teller ikke, men barnet kommer videre.
- Sjefsoppgaver i kunnskapsstigene spør med kjente ting foretrukket (ingen vis).

## Testet

`src/lib/__tests__/etappeT.test.js`:
1. Geografi, ny profil, alle svar gale (20 frø): første svar riktig, bare spørsmål om viste land, innføring (tre stjerner), nivå 1, minst tre kjente land.
2. Geografi, alle riktige: nivå 9, første oppgave vis og andre spørsmål om samme land; ingen flere vis.
3. 500 oppdrag på geografi nivå 2 med kjent tom: høyst tre vis, hvert spørsmål om et kjent land, alle alternativer kjente (når minst to er kjent), hver vis følges av spørsmål innen to.
5. Klokka og engelsk: samme som 1 og 3.
Pluss: generatorene setter feltene, kjent-styrt valg og feilsvar, oppdaterKjent, normalisering og fletting, «alt kjent → ingen vis».

`src/__tests__/app/vismeg.app.test.jsx` (i appen): 4. «👀 Vis meg» på en flaggoppgave viser riktig flagg med navn, og oppgaven telles ikke (hjelp). En vis-oppgave har bare «Neste» og teller som riktig.

## Prøv selv

- Ny profil → Geografi: først «Dette er flagget til …» med Neste, så spørsmål om samme flagg. Svar feil på alt etterpå: resten blir visning og spørsmål, og du får tre stjerner.
- Geografi nivå 2 som gammel profil: nye hovedsteder vises før de spørres om.
- Trykk «👀 Vis meg» på en flaggoppgave.

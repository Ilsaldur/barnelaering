# Etappe AC – Uten nett (runde 6)

## Endret

- **Alle filene i /assets/ lagres ved installasjon.** Et lite Vite-tillegg (`build/assetsListe.js`, koblet inn i `vite.config.js`) skriver `/assets-liste.json` ved bygging med alle filene i `/assets/`. Service workeren (cache v5) leser lista ved `install` og lagrer alt – også delene som lastes først når de trengs (geografistigen, verdenskartet med kartdataene, Supabase). Mangler lista, brukes filene `index.html` peker på, som før. Dynamiske deler svarer derfor fra cachen uten nett selv om de aldri har vært åpnet.
- **Feilgrense** (`src/components/Feilgrense.jsx`): rundt hver skjerm og stige i `App.jsx` (med `nokkel={nav.view}`, så en ny skjerm nullstiller feilen) og rundt hele appen. En feil gir kortet «Noe gikk galt» med «🔁 Prøv igjen» (tegner innholdet på nytt) og «🏠 Hjem» (forsiden; i den ytterste grensen lastes appen på nytt). Uten nett sier kortet at nettet ser ut til å være borte. En dynamisk del som ikke kan hentes («Failed to fetch dynamically imported module») havner i samme kort.
- **Profilvalget uten nett.** `authReady` settes med én gang når nettet er borte, og etter 4 sekunder uansett, og «Laster …» vises bare med nett mens Supabase faktisk hentes. Og en ekte feil: uten nett (eller før Supabase hadde svart) tolket appen «ingen innlogging ennå» som «logget ut» og slettet barneprofilene fra enheten. Nå slettes de bare når Supabase faktisk har svart at ingen er innlogget (`sessionKjent`).

## Testet

- `src/lib/__tests__/etappeAC.test.js`: Vite-tillegget skriver lista med bare `/assets/`-filer; service workeren i sandkasse: ved `install` lagres alle filene i lista (også GeoStige, VerdensKart og Supabase-delen som aldri har vært åpnet), og når nettet så forsvinner, svarer `fetch`-håndtereren på `/assets/GeoStige-….js` og `/assets/VerdensKart-….js` fra cachen (akseptansetest 1 så langt det kan måles uten nettleser); uten lista brukes filene fra `index.html`; etter et bygg står alle filene `dist/index.html` peker på i `dist/assets-liste.json`, og lista inneholder geografidelen.
- `src/__tests__/app/utennett.app.test.jsx` (akseptansetest 2, i appen): geografistigen kaster «Failed to fetch dynamically imported module»: fra forsiden, trykk Geografi → kortet «Noe gikk galt» med «Prøv igjen» og «Hjem»; «Prøv igjen» når feilen er borte viser stigen; ny feil og «Hjem» gir forsiden, uten kort.
- `src/__tests__/app/profilvalg-nett.app.test.jsx`: med en Supabase som aldri svarer: uten nett vises den lokale profilen «Selma», «Bare spill!» og innloggingslenken med én gang, uten «Laster …»; med nett vises profilen og «Laster …» til svaret kommer.
- 382 tester grønne, bygget går og skriver `dist/assets-liste.json` (hovedpakken 180 kB gzip).

## Prøv selv

- Besøk forsiden én gang med nett (la den stå noen sekunder). Slå av nettet, last siden på nytt, åpne Geografi: kartoppgavene skal vises. Det er det testen ikke kan måle i jsdom.
- Uten nett, med familiekonto: profilene på enheten vises med én gang, ingen «Laster …».
- Trenger du å se feilkortet: slå av nettet rett etter at forsiden er lastet første gang på en ny enhet (før delene er lagret) og åpne Geografi. Kortet med «Prøv igjen» og «Hjem» skal komme, ikke hvit skjerm.

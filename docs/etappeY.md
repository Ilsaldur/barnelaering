# Etappe Y – Småfeil (runde 5)

## Endret

- **«Du har klart hele stigen!» vises én gang.** `applyResult` gir `toppKlart` bare første gang paaRad når to på toppnivået; faget husker det i `fag.toppKlart`. Startskjermen viser deretter merket «🏆 Hele stigen klart» ved siden av «Nivå 38 av 38».
- **Forsiden på 390:** kortet heter «Gave» (undertittelen sier hvilket fag), og overskriften «Dagens økt» kan ikke brytes (`whitespace-nowrap`); ukestripen legger seg under når det er trangt (`flex-wrap`).
- **Service workeren** (cache v4) henter skallet og skriptene i `install`. Flaggene hentes etter `activate`, uten at aktiveringen venter på dem, og flagg som mangler lagres når de brukes. Appen er klar uten nett etter noen sekunder også på dårlig nett.
- **Mindre hovedpakke.** Geografistigen og verdenskartet (med kartdataene) lastes først når de trengs: `GeoStige` med `lazy` i `App.jsx`, og `VerdensKart` med `lazy` + `Suspense` i oppgavekortet og i `TaskVisual`. Supabase-biblioteket var det største i pakken; `src/lib/supabase.js` laster det nå først når noe bruker det, med en lat klient som har samme form som før (`supabase.auth.…`, `supabase.from(…)…`, `supabase.rpc(…)` kan awaites, `onAuthStateChange` svarer synkront med et abonnement). Uten nøkler er klienten fortsatt `null`.

| Pakke | Før | Etter |
|---|---|---|
| Hovedpakken (gzip) | 275 kB | 176 kB |
| Verdenskart + kartdata (gzip, lastes ved behov) | i hovedpakken | 41 kB |
| Supabase (gzip, lastes ved behov) | i hovedpakken | 58 kB |

## Testet

- `src/lib/__tests__/etappeY.test.js`: 1) 8 av 8 fire ganger på toppnivået gir meldingen én gang og faget husker det; 3) service workeren kjøres i en sandkasse der alle kall mot `/flagg/` aldri svarer: både `install` og `activate` blir ferdige, skriptene er lagret, og flaggene er bedt om i bakgrunnen; 4) supabase-modulen importerer biblioteket dynamisk og App laster geografi lat.
- `src/__tests__/app/forside-y.app.test.jsx` (i appen): «Gave» finnes, «Overraskelse» ikke, overskriften har `whitespace-nowrap` i en rad som kan brytes; startskjermen viser merket når `toppKlart` er satt.
- Headless Chrome ved bredde 390: «Dagens økt» står på én linje (28 px høy), «Gave» på én linje, ingen vannrett rulling.
- Bygg: hovedpakken 175,8 kB gzip; geografi virker som før (alle geografitestene kjører mot de samme modulene).

## Prøv selv

- Forsiden på mobil: «Gave» og «Dagens økt» på én linje.
- Geografi: et kort øyeblikk «Henter kartet …» første gang, så som før.
- Besøk appen én gang med nett, slå av nettet etter noen sekunder: appen starter, og flaggene som rakk å bli hentet vises.
- Toppnivået: meldingen om hele stigen kommer én gang, deretter merket på startskjermen.

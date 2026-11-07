# Etappe R – Én dør per fag, og Dagens økt velger seg selv (runde 5)

## Endret

- **Fri lek** viser de fem stigene med samme navn og ikon som kortene i Dagens økt (`KORT_INFO` i `Home.jsx`): Matte 🔢, Lesing 📖, Klokka 🕐, Geografi 🌍, Engelsk 🇬🇧. Undertittelen er «Nivå x av y» eller «Ny!» når barnet ikke er plassert. Kortene i Dagens økt viser det samme. Knappen og kortet åpner samme dør (`aapne(fagId)`). «Eventyrkartet» er fortsatt navnet på skjermen inni matte (`kartTittel`). Nøttehula, Samlingen og Hagen min står som før. Ingenting er låst.
- **Dagens økt velger seg selv** (`src/lib/dagen.js`): `sistSpilt(log)` finner når hvert fag sist ble spilt (lesing teller skrive og språk, aldri spilt = 0). Kort 1 og 2 er de to fagene det er lengst siden; blant fag som aldri er spilt avgjør datoen rekkefølgen, så alle fem kommer i løpet av den første uka (test). Kort 3 er overraskelsen, trukket per dato blant de andre fagene og Nøttehula.
- **Innstillinger:** fagblanding og fast fag er fjernet fra `emptySettings`, `dagen.js` og voksensiden. Gamle profiler med feltene åpner som før; feltene ignoreres. `oppdragPerDag` står med 2 som standard, og voksensiden forklarer at reven velger kortene.
- **Tekster:** «Velg to av kortene i dag.» før, «Dagens økt er ferdig! 🎉 Stempel i boka.» etter. Setningen om at alt er åpent er borte.

## Testet

- `src/__tests__/app/forside.app.test.jsx` (i appen): nøyaktig én knapp per fag utenfor Dagens økt, med samme navn og ikon som kortet; ingen «Eventyrkartet» eller «…stigen» på forsiden; ny profil viser «Ny!» og «Velg to av kortene i dag»; teksten «åpent for fri lek» finnes ikke i noen fil under `src/`.
- `src/lib/__tests__/dagen.test.js`: akseptansetest 2 for 30 datoer (kort 1 og 2 er to av klokke, geografi og engelsk, overraskelsen er aldri en av dem, samme dag gir samme kort); alle fem stigene kommer i løpet av en uke; Nøttehula kan være overraskelse; sist spilt; dagstatus; ukestripe; innstillingene finnes ikke. To eldre tester er oppdatert til de nye knappenavnene.

## Prøv selv

- Forsiden: fem fagknapper under Fri lek med samme ikoner som kortene. En ny profil ser «Ny!».
- Spill matte og lesing i dag. I morgen er kort 1 og 2 to av klokke, geografi og engelsk.
- Voksensiden: innstillingene for fag og fast fag er borte, bare «oppdrag per dag» står.

# Etappe B – Opplesing (runde 2)

Status: ferdig på grenen `adaptiv-laering`. Bygg og tester grønne.

## Endret

- **Ny profil spør «Kan barnet lese selv?»** med «📖 Ja» og «🔊 Nei, les opp for meg». Knappen «Lag profil» er sperret til det er svart. Ved nei slås opplesing på for profilen (`settings.autoSpeak = true`, `autoSpeakSet = true`), lagret lokalt med en gang og synket.
- **Eksisterende profiler der innstillingen aldri er rørt** (`autoSpeakSet` er false, også for alle gamle profiler): opplesing er på til barnet er plassert i lesing på nivå 8 eller høyere. Regelen ligger i `effectiveAutoSpeak(data)` i `src/lib/profil.js` og brukes både når profilen velges og når lesenivået endrer seg. Så snart en voksen velger på voksensiden, eller noen trykker bryteren i en aktivitet, gjelder valget uansett nivå. Voksensiden viser «Ikke valgt ennå: reven leser opp til barnet er på nivå 8 i lesing» når innstillingen er urørt.
- **Oppgaver som ikke kan løses uten lyd** er merket `kreverLyd` og leses alltid opp, uavhengig av bryteren: «Hvilken bokstav hører du?», «Hvilket ord hører du?», «Skriv ordet du hører» og engelsk «Hvilket bilde er …» (hør ordet). Knappen «Hør ordet igjen» finnes fortsatt.

## Testet

- Regelen for urørt innstilling (ikke plassert, under 8, på 8), voksenvalg som overstyrer, og at gamle profiler uten feltet regnes som urørt.
- Røyktest av alle skjermer.

## Prøv selv

- Lag en ny profil, svar «Nei, les opp for meg». Start et matteoppdrag: hver oppgave leses opp automatisk.
- Velg en gammel profil som aldri har rørt bryteren og står under nivå 8 i lesing: opplesing er på.
- Slå av opplesing nederst i en aktivitet. Voksensiden viser «Av», og det holder seg av selv etter nivå opp.
- Lesing nivå 1 med opplesing av: «Hvilken bokstav hører du?» leses likevel opp.

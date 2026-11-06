# Etappe D – Tre spor i lesing (runde 2)

Status: ferdig på grenen `adaptiv-laering`. Bygg og tester grønne. **Tekstene til Lese 10–12 er UTKAST** (`src/data/lesing/tekster2.js`).

## Endret

- **Tre spor** (`src/data/lesing/nivaer.js`): **Lese** (`lesing`, nivå 1–12), **Skrive riktig** (`skrive`, nivå 1–4, de gamle 10–13) og **Språk** (`sprak`, nivå 1–3, de gamle 14–16). Hvert spor er et eget fag i profilen med eget nivå, egen bom-liste og egen sjefsoppgave, og bruker motoren fra etappe A gjennom den felles `Stige`-komponenten.
- **Plasseringstest bare i Lese**, med tak 9. Skrive riktig og Språk åpner når Lese er på nivå 8, og starter på nivå 1 med «Lær først»-kortet (kortene er flyttet til de nye sporene og nivåene).
- **Sporvelger** (`LeseStige.jsx`): Lesing viser tre kort. Låste spor viser 🔒 og «Åpner når Lese er på nivå 8». Reven foreslår sporet det er lengst siden barnet spilte (fra loggen). Dagens økt → Lesing går til samme velger. Fast fag «Lesing» på voksensiden regnes som oppfylt av alle tre sporene.
- **Voksensiden** har nivåvelger per spor (Lese, Skrive riktig, Språk) automatisk, og ukeoversikten viser sporene hver for seg.
- **Migrering** (`migrerLesingSpor`, dataversjon 3): gamle nivå 1–9 beholdes i Lese. 10–13 gir Lese 9 og Skrive riktig nivå − 9. 14–16 gir Lese 9, Skrive riktig 1 og Språk nivå − 13. Beste stjerner følger nivåene de ble tjent på. Kjører én gang per profil, også ved synk fra en enhet med gammel data.
- **Tre nye nivåer i Lese** (10–12) med 24 tekster på 120–200 ord: *Lese mellom linjene* (svaret må sluttes ut fra teksten), *Ordforråd* (synonymer og ord i sammenheng) og *Hovedtanken*. Åtte tekster per nivå, tre spørsmål hver, fem oppgaver per oppdrag.

## Testet

- Sporene har riktig antall nivåer. Migrering for 1–9, 10–13 og 14–16 med stjerner, og at den bare skjer én gang.
- Tekstene: minst åtte per type, 120–200 ord, svaret blant alternativene. Alle nivåer i alle tre spor gir gyldige oppgaver og rendrer.
- Fast fag «Lesing» i Dagens økt dekker alle sporene.

## Prøv selv

- Lesing på forsiden: tre kort, to av dem låst til Lese er på nivå 8. Sett Lese til 8 på voksensiden: Skrive riktig og Språk åpner, og starter med «Lær først» på nivå 1.
- Spill Skrive riktig, gå tilbake: reven foreslår nå Språk (lengst siden).
- Sett Lese til 10, 11 og 12 og prøv tekstene. Les korrektur på `src/data/lesing/tekster2.js`.
- En gammel profil som sto på lesing nivå 12: er nå Lese 9 og Skrive riktig 3, med stjernene på plass.

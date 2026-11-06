# Etappe A – Nivåmotoren (runde 2)

Status: ferdig på grenen `adaptiv-laering`. Bygg og 192 tester grønne, inkludert de åtte akseptansetestene som simuleringer (`src/lib/matte/__tests__/akseptanse.test.js`).

## Endret

- **Plasseringstest** (`src/lib/matte/plassering.js`): startnivå 1/6/13/21/29 med tak 7/15/23/31/38 etter valgt verden. To oppgaver per nivå, ett forsøk, uten hjelp. Begge riktige: to opp, aldri over taket; på taket: plasser der. Én feil: plasser ett over siste beståtte. Feil på startnivået: to ned og prøv igjen; bom på nivå 1 gir 1. Lesing har tak 9 uansett, og valget «Jeg leser godt og skriver» (nivå 11) er fjernet. Oppgaver til testen (`oppgaveTilPlassering`) er aldri sant/usant og aldri typer med fagord (merket `ikkePlassering` i nivådataene: partall/oddetall, ordklasser, bøying, tegnsetting, stor bokstav, «fakta eller mening»). Testen skriver ikke til bom-lista; nivået settes med `settNivaa`, som tømmer alt.
- **Regler etter oppdrag** (`src/lib/matte/stige.js`): 7–8 riktige gir paaRad + 1, to på rad gir ett nivå opp. 5–6 nullstiller. 0–4 gir hjelp neste gang; to på rad gir ett nivå ned (aldri under 1) med vennlig melding fra reven, og bom-lista tømmes. 8 av 8 tilbyr sjefsoppgaven på resultatskjermen hver gang, så lenge barnet ikke er på toppen. `perfektRad` og lagret `sjef` er borte; gamle profiler migreres i `normalize`.
- **Sjefsoppgaven**: mål = tre over nivået etter oppdraget (eller toppen). Fem oppgaver: én fra nivået over, to fra hvert av de to neste; færre nivåer igjen fordeles. Ett forsøk, uten hjelp (`attempts={1} noHelp`). Fire av fem gir hopp, ellers står barnet, uten straff og uten bom-liste.
- **Bom-lista** (`oppdaterSvake`): bare typer fra eget nivå og repetisjon (ikke smakebit, sjef eller plassering). Fjernes etter to riktige på første forsøk. Tømmes ved manuelt nivå på voksensiden, etter plassering og ved nedflytting. Oppdragsbyggeren tar aldri med typer som hører hjemme over barnets nivå. Ved synkronisering vinner lista fra siden som sist ble endret (`mergeFag`), ikke en sammenslåing.
- **Repetisjon** trekkes fra de fem siste nivåene under barnets nivå.

## Testet

- Nivåregler, sjefsoppgave, bom-liste, plassering (alle grener), fletting, oppdragsbygging.
- Akseptansetestene 1–8 fra prompten pluss «plasseringstesten skriver ikke til bom-lista».
- Røyktest av alle skjermer.

## Prøv selv

- Nullstill matte på voksensiden (velg «Ikke plassert»), ta plasseringstesten fra Det blå havet. To oppgaver per nivå; svar riktig på alt og se at du lander på 15, ikke 38.
- Få 8 av 8: resultatskjermen spør om du vil prøve sjefsoppgaven. Si nei, spill igjen med 8 av 8: tilbudet kommer igjen.
- Få under 5 riktige to ganger: reven tar deg ett nivå ned med en vennlig melding.
- Sett nivå 2 på voksensiden etter å ha bommet på nivå 38: oppdragene holder seg på nivå 1–3.

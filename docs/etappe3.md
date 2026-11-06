# Etappe 3 – Mattestigen

Status: kode ferdig på grenen `adaptiv-laering`. Bygg og tester grønne.

## Endringslogg

- **38 nivåer i fem verdener som data** (`src/data/matte/nivaer.js`): Trylleskogen 1–6, Det blå havet 7–14, Det høye fjellet 15–22, Det gylne slottet 23–30, Verdensrommet 31–38. Hvert nivå har tittel, trinn (vises bare på voksensiden), svarform (valg til og med nivå 6, talltastatur fra 7), oppgavetyper med parametre og vekt, og eventuelt kortstokk. Redigerbart uten kode.
- **Rundt 70 oppgavetyper** som rene generatorer (`src/lib/matte/gen_*.js`), alle med opplesingstekst, forklaring og der det passer en hjelp bak Hjelp-knappen (tellebilder, tallinje, tierblokker, tierramme, rutenett). Oppgaveformer: trykk på svaret, skriv svaret, sant/usant, sorter tallene, trykk på tallinja, ukjent på ulike plasser.
- **Oppdrag** (`src/lib/matte/oppdrag.js`): åtte oppgaver, fem fra eget nivå, to repetisjon, én fra neste nivå, sortert lett → vanskelig. Ingen like oppgaver. Etter et svakt oppdrag: hjelp på og fire oppgaver fra nivået under. Svake oppgavetyper erstatter repetisjonsplassene neste oppdrag og dagen etter.
- **To forsøk per oppgave** (`Oppdrag.jsx`): etter andre feil vises løsningen med en kort forklaring som også kan leses opp. Bare første forsøk uten hjelp teller mot nivået; åpnes hjelpen, teller ikke oppgaven.
- **Nivåregler** (`src/lib/matte/stige.js`): 7–8 riktige to ganger på rad gir nivå opp med feiring. 5–6 gir samme nivå. 0–4 gir hjelp neste gang, uten melding. 8 av 8 to ganger på rad tilbyr sjefsoppgave med fem oppgaver fra to–tre nivåer høyere; fire riktige gir hopp. Beste stjerner per nivå lagres (første forsøk).
- **Kort i fem bokser** (`src/lib/matte/kort.js`): tiervenner (nivå 9) og gangetabell (nivå 23–27). Riktig flytter kortet opp, feil sender det til boks 1, kort i høye bokser trekkes sjeldnere. To av de egne oppgavene i et oppdrag hentes fra kortstokken.
- **Plasseringstest** (`src/lib/matte/plassering.js`): barnet velger startverden, så 8–12 oppgaver med ett forsøk, tre nivåer opp ved riktig og to ned ved feil. Sluttnivå er det høyeste nivået barnet klarte blant de fire siste. Voksensiden kan overstyre nivået (nedtrekk med nivånavn).
- **Talltastatur** (`Keypad.jsx`) på skjermen som også tar vanlig tastatur (tall, Enter, Backspace, minus og komma der det trengs).
- **Nøttehula** (`Noettehula.jsx`, `src/lib/matte/noetter.js`): tallmønstre, magiske kvadrater, mini-sudoku 4 × 4 og «hvilket tall er jeg?» i tre grader. Påvirker ikke nivået.
- **Forsiden** har ett stort Matte-kort øverst. De gamle mattetemaene (telling, pluss/minus, gange, brøk) er fjernet fra temastigene; klokke, ord, bokstaver, former, farger, motsetninger og geografi ligger igjen til etappe 5 og 6 overtar.
- **Voksensiden** viser nå nivå per fag med navn, og «bommer mest på» bruker lesbare navn på oppgavetypene.
- Tester: alle 38 nivåer genererer gyldige oppgaver (fasit blant alternativene, aldri negative uten lov, tierovergang stemmer), nivåregler, sjefsoppgave, plassering, kortbokser, oppdragssammensetning, og en røyktest som rendrer hver oppgavetype.

## Prøv som 5-åring

- Trykk Matte, velg Trylleskogen. Svar så godt du kan på 8–12 oppgaver. Se hvilket nivå reven setter deg på.
- Start oppdrag. Trykk 🔊 på hver oppgave. Prøv «flest eller færrest», terningbilder og «trykk på tallene fra minst til størst».
- Svar feil med vilje: du får ett forsøk til. Svar feil igjen: reven viser svaret og forklarer.
- Trykk «💡 Hjelp» på et plusstykke: tellebilder og tallinje der du hopper selv.
- Få 0–4 riktige og start et nytt oppdrag: hjelpen er åpen fra start, og oppgavene er litt lettere, uten at noen sier det.

## Prøv som 8-åring

- Velg Det høye fjellet eller Det gylne slottet i plasseringstesten.
- Skriv svar på talltastaturet, eller bruk tastaturet på PC-en (Enter sender).
- Klar 7–8 to ganger på rad: «Nivå opp!» med feiring. Klar 8 av 8 to ganger: «Sjefsoppgave»-knappen dukker opp. Klar fire av fem: hopp to–tre nivåer.
- På nivå 23–27: legg merke til at gangestykker du bommer på kommer oftere tilbake.
- Nøttehula: prøv «Vanskelig».
- Voksensiden: sett nivået manuelt til 34 og prøv negative tall og termometer, eller 37 for koordinater.

## Kjente begrensninger

- «Dra til tallinja» er løst som «trykk på tallinja» (fungerer likt med finger, mus og tastatur).
- Nivåoversikten er en enkel liste. I etappe 4 blir Eventyrkartet selve framgangen.

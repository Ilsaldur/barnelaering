# Etappe C – «Lær først»-kort (runde 2)

Status: ferdig på grenen `adaptiv-laering`. Bygg og tester grønne. **Kortene er UTKAST** og ligger i `src/data/laerkort.js`.

## Endret

- **21 kort som data** (`src/data/laerkort.js`): matte 9, 10, 12, 13, 14, 20, 21, 23, 28, 34, 35, 36, 37, 38 og lesing 10–16. Hvert kort har tre–fire steg med én tanke, høyst to korte setninger, et eksempel og en figur der det hjelper (tierramme, tallinje, tierblokker, rutenett, grupper, brøk, termometer, koordinater, ordkort). Kortet sier hvilke oppgavetyper det dekker og hvilket steg som hører til hver type.
- **Kortvisning** (`src/components/LaerKort.jsx`): stegene leses alltid opp, med 🔊 for å høre igjen, framdriftsstriper, fram og tilbake. Siste skjerm er **«Prøv selv»**: tre oppgaver fra nivåets egen generator, ett forsøk, feil svar viser forklaringen med en gang. Ingenting teller: ingen stjerner, ingen bom-liste, ingen logg (`practice`-modus i `TaskCard`).
- **Vises første gang** barnet starter et oppdrag på et nivå med kort, uansett om barnet kom dit ved plassering, nivå opp, sjefsoppgave eller nivå satt av en voksen. «Jeg kan dette – til oppdraget» hopper over. Sette kort lagres per profil (`data.laerkort`) og synkes.
- **«📚 Lær»-knapp i oppdraget** for oppgavetypen barnet står på, også når oppgaven er repetisjon eller smakebit fra et annet nivå. Å åpne kortet regnes som hjelp, så oppgaven teller ikke mot nivået.
- **Etter to gale svar** vises det relevante steget fra kortet (tekst, figur og opplesing), med dagens korte setning under. Nivåer uten kort beholder setningen de har i dag.

## Testet

- Alle bestilte nivåer har kort, hvert kort har 3–4 steg, stegene er korte, og kortets typer finnes blant typene nivået faktisk lager.
- Oppslag per type og per steg. Alle 21 kort rendrer med figurene sine.

## Prøv selv

- Sett matte til nivå 12 på voksensiden og start et oppdrag: kortet «Pluss over tieren» kommer først, med tierramme og tallinje. Trykk «Prøv selv» og svar feil: forklaringen kommer med en gang og ingenting teller.
- Start et nytt oppdrag på samme nivå: kortet kommer ikke igjen.
- I et oppdrag på nivå 13: trykk «📚 Lær» på en oppgave. Kortet åpnes uten «Prøv selv», og oppgaven teller ikke etterpå.
- Svar feil to ganger på en tierovergangsoppgave: steget fra kortet vises i stedet for bare én setning.
- Lesing nivå 14 (ordklasser): kortet med substantiv, verb og adjektiv.

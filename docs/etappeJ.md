# Etappe J – Under panseret (runde 3)

Status: ferdig på grenen `adaptiv-laering`. Bygg og 233 tester grønne.

## Endret

- **J1 Migrering:** `migrerLesingSpor` beholder tidspunktet fra den gamle lesedataen i stedet for «nå». En enhet som åpner med data fra før oppdateringen, vinner ikke lenger over nivåer satt på en annen enhet etterpå.
- **J2 Bom-lista:** hver bom lagres med nivået den kom fra (`svake[type] = { bom, riktig, nivaa }`). Oppdragsbyggeren bruker det nivået og lager en oppgave av akkurat den typen, også når typen får et annet navn enn i nivålista (skriv_diftonger, les_analog_whole, flagg_norden, tekst_slutning, areal, parentes …). Nøkkelen som hindrer like oppgaver tar nå med svaret, så typer med likt spørsmål («Hvilket ord hører du?») ikke blir byttet ut.
- **J3 Plasseringstest nedover:** bom på startnivået går til startnivået i verdenen under (29 → 21 → 13 → 6 → 1) og klatrer derfra, med den verdenens tak. Prøven på taket hoppes over når barnet nettopp besto nivået rett under. I lesing brukes startvalgene (1, 4, 6, 8) som trapp.
- **J4 Nøttehula:** mini-sudokuen regner ut alle løsninger som passer med de viste tallene, og spør bare etter en rute der alle løsninger har samme tall.
- **J5 Uten nett:** service workeren henter `index.html` ved installasjon, finner skriptene og stilarkene den peker på, og lagrer dem. Appen starter uten nett etter første besøk. Cache-navnet er bumpet så gamle installasjoner oppdateres.

## Testet

- J1: enhet A (v3, nivåer satt i går) vinner over enhet B (v2 fra tre dager siden), begge veier.
- J2: for alle sju stiger og alle nivåer: en type bommet på nivå n kommer igjen som svak oppgave når barnet står på n eller n + 1 (unntatt når n + 1 er et tekstnivå, som ikke har repetisjon etter H2).
- J3: barn som kan til og med 5 og velger Verdensrommet plasseres på 6 med fem gale svar; hopp over taket; alt riktig fra havet gir fortsatt 15; alt feil gir 1 etter to gale.
- J4: 450 sudokuer over tre grader: alle løsninger gir samme tall i ruta det spørres om.
- J5 kan ikke testes i Vitest (service worker); prøv på enheten.

## Prøv selv

- Nullstill matte, velg Verdensrommet og svar feil på første oppgave: neste er fra nivå 21, så 13, så 6.
- Lesing nivå 6: bom på «Hvilket ord hører du?», start nytt oppdrag: typen kommer igjen.
- Klokkestigen: bom på «hele timer» på nivå 1, gå opp til 2: samme type kommer igjen som repetisjon.
- Nøttehula «Vanskelig»: sudoku-ruta har alltid bare ett riktig svar.
- Besøk appen én gang med nett, slå på flymodus, lukk og åpne: den starter.

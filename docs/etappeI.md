# Etappe I – Kort, klokke og kart (runde 3)

Status: ferdig på grenen `adaptiv-laering`. Bygg og 221 tester grønne.

## I1 «Lær først»

- Oppdraget starter først når kortet er lukket: `Stige` viser bare kortet (med topplinje) til barnet trykker «Prøv selv»-løpet ferdig eller «Jeg kan dette». Da monteres oppdraget, og ingen oppgave bak leser opp eller tar imot tastetrykk.
- Kortet fra «📚 Lær» fryser oppgaven bak (`frosset`): talltastaturets tastelytter er av, og alle svarknapper, tekstfelt, klokke og kart er låst til kortet lukkes. Å åpne kortet regnes fortsatt som hjelp.

## I2 Still klokka

- Timen regnes nå ut fra viserens vinkel minus minuttenes bidrag (minutt × 0,5 grader), i `src/lib/klokke/vinkel.js`. «Fem på 2» godtas når den korte viseren står nesten på 2.

## I3 Verdenskartet

- På verdenskartet spørres det bare etter land som er minst 24 × 24 punkter ved bredde 390 (målt på landets største sammenhengende del). Med den regelen er det de åtte største landene; små europeiske land hører til Europa-kartet. Feilsvarene i «hvilket land er markert?» hentes fortsatt fra alle landene.
- Russland er ute av spørsmålene om verdensdel. Hovedstaden i Romania skrives Bucuresti.

## Testet

- **I1 i appen** (`src/__tests__/app/laerkort.app.test.jsx`): nivå 12, «Start oppdrag» viser kortet uten oppgave bak, «99» + Enter endrer ingenting, og kortets første steg er det siste som leses opp. Etter «Jeg kan dette» starter oppdraget. Lær-knappen åpner kortet, og «99» + Enter gir verken svar eller tall på tastaturet.
- **I2:** for alle tider med fem minutters steg gir en ekte klokkes timeviservinkel riktig time, også med ±8 graders slingring.
- **I3:** 300 kartoppgaver på verdenskartet spør bare etter land ≥ 24 × 24 punkter; Danmark er ikke blant dem, USA er. Russland dukker aldri opp i verdensdel-spørsmål.

## Prøv selv

- Sett matte til nivå 12 (eller et annet nivå med kort du ikke har sett) og start oppdrag: kortet kommer alene, ingen stemme bak. Skriv tall på tastaturet: ingenting skjer. Lukk kortet: oppdraget starter.
- I et oppdrag: trykk «📚 Lær», skriv tall: tastaturet i oppgaven er tomt når kortet lukkes.
- Klokkestigen nivå 6: «Still klokka på fem på 2» med den korte viseren nesten på 2: riktig.
- Geografistigen nivå 9: kartoppgavene spør etter store land.

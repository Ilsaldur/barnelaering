# Etappe G – Resultatskjermen på nettbrett (runde 3)

Status: ferdig på grenen `adaptiv-laering`. Bygg og tester grønne.

## Endret

- `RoundDone` har nå to deler: **meldinger** (`before`: nivå opp, nivå ned, sjefsoppgave bestått/ikke, samlekort og sjefstilbudet) i en egen stablet blokk med maks bredde, og **knapperaden** under, som brytes over flere linjer (`flex-wrap`) på alle bredder. Tidligere lå alt i én rad som ble `sm:flex-row` fra 640 punkter.
- Sjefstilbudet står for seg selv, over knappene, med egen knapp.
- Alle store knapper har `max-w-full`, så ingen knapp kan bli bredere enn skjermen.

## Testet

- Strukturell akseptansetest (`src/__tests__/app/resultat.app.test.jsx`): med samlekort, sjefstilbud og melding om nivå ned til stede står meldingene i en stablet blokk over knapperaden, raden har `flex-wrap`, og ingen del av skjermen bruker klasser som tvinger bredde (`min-w-max`, `whitespace-nowrap`, `overflow-x-auto`). jsdom har ingen layoutmotor, så bredder (390–1280) kan ikke måles i testen; strukturen gjør at ingen rad kan bli bredere enn skjermen.

## Prøv selv

- På nettbrett (768–1024 punkter): få 8 av 8. Sjefstilbudet står øverst for seg selv, og knappene «Nytt oppdrag», «Til eventyrkartet» og «Tilbake» ligger innenfor skjermen, eventuelt på to linjer. Ingen vannrett rulling.
- Samme på mobil (390) og PC (1280).

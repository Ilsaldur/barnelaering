# Etappe F – Hjelpemodus (runde 3, haster)

Status: ferdig på grenen `adaptiv-laering`. Bygg og 210 tester grønne.

## Endret

- **Hjelp appen åpner selv teller ikke som hjelp.** `TaskCard` starter alltid med `usedHelp = false`, også når hjelpefiguren står åpen fra start (hjelpemodus). Oppgaven teller ikke bare når barnet selv trykker «💡 Hjelp» eller «📚 Lær».
- **Oppdrag i hjelpemodus** (`applyResult` med `hjelpModus`): gir aldri paaRad + 1 og aldri tilbud om sjefsoppgave. Er resultatet ikke svakt (5+ av 8), slås hjelpemodus av og svakRad nullstilles. Er det svakt, teller det som et svakt oppdrag som før.
- **Nedflytting slår hjelpemodus av.**
- **Resultatskjermen** tenner ingen stjerne ved null stjerner (`StarRating` hadde en tidsfeil som tente én).

## Testet

- Enhetstester for hjelpemodus (godt og svakt resultat, nedflytting).
- **F1 i appen** (`src/__tests__/app/hjelpemodus.app.test.jsx`, jsdom + Testing Library): rendrer mattestigen med en profil på nivå 18, trykker «Start oppdrag», svarer tre riktige og fem gale gjennom de ekte skjermene (flervalg, talltastatur, sant/usant, sorter, tallinje), trykker «Nytt oppdrag», svarer alle riktige på første forsøk. Sjekker «8 av 8», nivå 18, hjelpemodus av, paaRad 0 og at ingen sjefsoppgave tilbys.
- **F2 simulering:** 300 barn med 92 % til nivå 12, 55 % på 13 og 15 % over, 40 oppdrag hver. Under 5 % ender på nivå 9 eller lavere.
- **F3:** `StarRating` med 0 stjerner tenner ingen, også etter at tiden går.
- Nye dev-avhengigheter for komponenttester: `jsdom`, `@testing-library/react`, `@testing-library/dom`.

## Prøv selv

- Sett matte til nivå 18, få 3 riktige. Start nytt oppdrag: hjelpen er åpen. Svar riktig på alt: «8 av 8», nivået er 18, og ingen sjefsoppgave tilbys. Neste oppdrag starter uten hjelp.
- Få 0–4 riktige to ganger på rad: ett nivå ned, og hjelpen er av etterpå.
- Få 0 av 8: ingen stjerne lyser på resultatskjermen.

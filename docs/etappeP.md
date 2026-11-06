# Etappe P – Flagg, plassering og småfeil (runde 4)

## Endret

- **P1 Flagg.** `Flagg` har `avslort`: før oppgaven er besvart er alt og title «flagg», etter svaret landets navn. Gjelder bildet i spørsmålet og flaggene som svaralternativer. Service workeren (cache v3) henter `/flagg/liste.json` ved installasjon og lagrer alle flaggene (92 filer). `liste.json` lages fra `land.js`, og en test holder dem i takt.
- **P2 Plasseringstesten.** `maksOppgaver` regnes som tatt + det som gjenstår opp til taket, så «Oppgave n av m» aldri har n > m, også etter et fall. Etter et fall er taket nivået barnet falt fra (`stegPlassering`), i alle stiger.
- **P3 Toppnivået.** Startskjermen sier «Du er på toppnivået – her er det bare å øve videre!» i stedet for setningen om sjefsoppgave. Når barnet har klart toppnivået to ganger (to gode oppdrag på rad), gir `applyResult` `toppKlart`, og resultatskjermen viser «Du har klart hele stigen!».
- **P4 Tekster og bom-liste.** Etter en sjefsoppgave som ikke gikk, brukes lengden på nivåets oppdrag («alle åtte»/«alle fem»), og revens melding er «Sjefsoppgaven var vanskelig denne gangen. Du fortsetter der du var, og mister ingenting.» (`RoundDone` har fått `melding`). «Du starter på nivå …» får ikke punktum etter en tittel som slutter med spørsmålstegn (`medPunktum` i `src/lib/tekst.js`). Svake oppgaver lages fra riktig generator til typen stemmer (velg_regneart, tall_10000, likning gir ellers ofte en annen variant).

## Testet

- `src/__tests__/app/flagg.app.test.jsx` (i appen): før svaret har ingen flaggbilder landets navn i alt, title eller aria-label; etter svaret vises navnet. Både «Hvilket land har dette flagget?» og «Hvilket flagg er … sitt?».
- `src/lib/__tests__/etappeP.test.js`: liste.json = alle koder, service workeren henter dem; Geografi fra Europa, feil på første og så alt riktig → nivå 4, og nummeret er aldri over totalen (også 150 tilfeldige tester fra alle startvalg); taket etter fall i matte og uten trapp; toppnivået klart to ganger; punktum-regelen; svake oppgaver for velg_regneart, tall_10000 og likning har alltid riktig type. En eldre test er oppdatert til den nye takregelen.

## Prøv selv

- Geografi: start fra Europa, svar feil på den første, så riktig. Du lander på nivå 4, og telleren går aldri over totalen.
- Flaggoppgave uten nett (etter ett besøk med nett): flagget vises. Hold musepekeren over flagget før du svarer: «flagg».
- Matte nivå 38 to ganger 8 av 8: «Du har klart hele stigen!».

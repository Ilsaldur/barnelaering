# Etappe S – Usynlig plassering: det første oppdraget finner nivået (runde 5)

## Endret

- **Ny motor** `src/lib/matte/finnNivaa.js` (erstatter `plassering.js`, som er slettet): `startFinn`, `stegFinn`, `framdrift`, `simulerBarn`. Oppdraget starter på nivå 1 og hopper 1, 2, 4, 8, 16, 32 (begrenset av toppen eller taket), én oppgave per prøve. Ved første gale svar søkes det binært mellom siste riktige (lo) og første gale (hi) til de ligger inntil hverandre, og barnet lander på lo. Så to oppgaver på lo; går én galt, flyttes det ett nivå ned og prøves igjen, høyst to ganger, aldri under 1. Resten er vanlige oppgaver på nivået til oppdraget har minst 8 oppgaver (5 der nivået har lengde 5). Høyst 14 (9).
- **I appen** (`FinnNivaa` i `Stige.jsx`): en ny profil som trykker på et fag kommer rett inn i et vanlig utseende oppdrag med tittel «Eventyrkartet 🔢» (eller stigens navn), framdriftslinje uten tall, to forsøk og hjelp som vanlig. Bare svar på første forsøk uten hjelp teller for plasseringen. Oppgavene fra søket lages med `oppgaveTilPlassering` (aldri sant/usant), resten med `oppgaveFraNivaa`, og alt går inn i husk-lista. Nivået settes med `settNivaa`. Resultatskjermen er den vanlige med stjerner, pluss linja «Reven fant plassen din: Det blå havet, nivå 9! 🌊». Oppdraget teller i Dagens økt.
- **Borte:** valgskjermen med trinn, «Noen få oppgaver, to på hvert nivå», telleren «Oppgave n av m» i første oppdrag og skjermen «Du starter på nivå …». Startvalgene (`START`, `START_LESE`, `START_NIVAA`, `TAK_NIVAA`) er fjernet fra stigene. Lese har fortsatt tak 9 (`cfg.tak`), så reven plasserer ikke på tekstnivåene. Skrive riktig og Språk starter på nivå 1 som før.
- **Voksensiden:** «Sett nivå» står, og hvert plassert fag har «La reven finne nivået på nytt», som nullstiller plassert (stjerner, kort og bokser beholdes).
- **Eksisterende profiler** som er plassert, går rett til kartet som før (test). Profiler fra før kan ha gamle felt i innstillingene; de ignoreres.

## Testet

- `src/lib/__tests__/etappeS.test.js`: reglene (hoppene, binært søk, slå fast med nedflytting, aldri under 1, lengde 8–14 og 5–9, taket, framdriften), og akseptansetestene som simulering med fast frø: 1) 3000 barn på hvert av nivå 1–38 (92/55/15 %): innen ±1 ≥ 55 %, mer enn ett for høyt ≤ 15 %, 8–14 oppgaver, ≥ 70 % slutter med to riktige. 2) Stige med 9 nivåer og lengde 5: 5–9 oppgaver, ≥ 75 % innen ±1. Med frøet i testen: matte ca. 56 % innen ±1, 11 % for høyt, 82 % slutter med to riktige; geografi ca. 79 % innen ±1.
- `src/__tests__/app/finnNivaa.app.test.jsx` (i appen): ny profil, alle riktige → ni oppgaver på 1, 2, 4, 8, 16, 32, 38, 38, 38, nivå 38, «Reven fant plassen din», ingen «Oppgave n av m» og ingen av ordene test, plassering, trinn eller «av 10» i rammen rundt oppgavene; oppgavene står i husk-lista og oppdraget teller i Dagens økt. 4) En plassert profil går rett til kartet uten å få oppdraget.
- Eldre tester for den gamle testen er fjernet eller skrevet om (akseptanse A1–A3, J3, P2, L1/L3, render).

## Verdt å vite

Treffsikkerheten er begrenset av regelen om at ett tidlig feilsvar sender søket nedover: et barn på nivå 20 som bommer på nivå 8 (8 % sjanse) lander rundt 7. Omtrent en tredel plasseres mer enn ett nivå for lavt i simuleringen, men da flytter stigen barnet opp etter to gode oppdrag. Vil du heller ha en regel som tåler ett tidlig feilsvar (for eksempel én ny prøve på samme nivå før søket snur), er det en liten endring i `stegFinn`.

## Prøv selv

- Ny profil → Matte: oppdraget starter rett på, uten valg av trinn. Svar riktig på alt og se «Reven fant plassen din: Verdensrommet, nivå 38!».
- Lesing som ny profil: oppdraget plasserer aldri over nivå 9.
- Voksensiden: «La reven finne nivået på nytt» på et fag, og gå inn i faget igjen.

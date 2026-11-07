# Etappe AD – Matteplasseringen kan angre (runde 6)

## Endret

- **Angre** (`src/lib/matte/finnNivaa.js`): etter en bom i opp- eller søkefasen stilles ett nytt spørsmål på samme nivå. Går det riktig, regnes bommen som et glipp, og plasseringen går videre som om svaret var riktig. Høyst én gang per oppdrag. Taket på 14 oppgaver står.
- **Avvik fra prompten, med tall:** prompten sa «når barnet hadde minst tre riktige på rad før bommen». Målt med «kan til og med nivå k» på matte 10–30 gir det 56 % innenfor ±1 og 30 % for lavt – under kravet (60 % og 25 %). Grunnen: de fleste glippene som sender barnet for lavt, skjer tidlig i opp-fasen (på nivå 1, 2 eller 4), før barnet har tre riktige på rad. I matte og lesing får derfor det første bommet i opp-fasen alltid ett nytt spørsmål (`ANGRE_OPP_MATTE = 0`); i søkefasen kreves tre riktige på rad som i prompten (`ANGRE_KREVER = 3`). Det gir 62 % innenfor ±1 og 23 % for lavt.
- **Et godtatt glipp som ikke var et glipp:** et barn på nivå 10 som bommer på 16 og gjetter riktig på det nye spørsmålet, ville før blitt plassert på 16. Nå huskes nivået under det godtatte glippet som trygt (`angreLo`). Går slå fast galt på et nivå minst to over det trygge, søkes det på nytt mellom det trygge nivået og dette. Uten denne regelen steg andelen plassert for høyt fra 13 % til 22 %.
- **Kunnskapsstigene angrer ikke** (klokka, geografi, engelsk). Der har spørsmålene fire svar, og et heldig gjett på det nye spørsmålet (25 %) ville sendt barnet for høyt. Målt på engelsk steg «for høyt» fra 15 % til 19 % med angre på. Etappe Z sine tall står derfor uendret.

Målt (appens `simulerBarn`, 2000 barn per nivå):

| | Innenfor ±1 | For lavt (≥2) | For høyt (≥2) |
|---|---|---|---|
| Matte 10–30, før (runde 5) | 50 % | 37 % | 13 % |
| Matte 10–30, prompten (tre på rad) | 56 % | 30 % | 14 % |
| Matte 10–30, nå | 62 % | 23 % | 15 % |
| Matte 1–38, nå | 69 % | 19 % | 12 % |
| 9 nivåer med lengde 5 (lesing), nå | 88 % | 7 % | 5 % |

## Testet

- `src/lib/__tests__/etappeAD.test.js`: første bom i opp gir nytt spørsmål på samme nivå og riktig der regnes som glipp (1, 2, 4, 8, 8, 16, 32 …); galt på det nye spørsmålet: bommen gjelder og det angres ikke igjen; i søkefasen kreves tre på rad; et godtatt glipp som slår feil i slå fast gir nytt søk nedover og lander på ≤ 11 for et barn på 10; kunnskapsstigene angrer ikke. Akseptansetesten: matte 10–30, 2000 barn per nivå: 62 % innenfor ±1, 23 % for lavt, alle oppdrag 8–14 oppgaver. Og en kontroll: uten angre er det 50 % og 37 %.
- Oppdaterte sekvenstester i etappe S og etappe A (det nye spørsmålet på 32 og 16 er med). Etappe S sine akseptansetall holder fortsatt (minst 55 % innenfor ±1 over 1–38, høyst 15 % for høyt, minst 70 % slutter med to riktige).
- 389 tester grønne, bygget går.

## Prøv selv

- Ny profil, Matte: svar riktig på de første, bom med vilje på én oppgave, svar riktig på den neste på samme nivå: oppdraget går videre oppover som om du ikke bommet.
- Bom på to etter hverandre på samme nivå: søket går nedover som før.

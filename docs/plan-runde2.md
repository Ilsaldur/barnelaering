# Plan, runde 2 (tilbakemelding etter test 6. november 2026)

## Status

| Etappe | Status | Sist oppdatert |
|--------|--------|----------------|
| A – Nivåmotoren | Ferdig og pushet. Se `docs/etappeA.md`. | 2026-11-06 |
| B – Opplesing | Ferdig og pushet. Se `docs/etappeB.md`. | 2026-11-06 |
| C – «Lær først»-kort | Ferdig og pushet. Kortene i `src/data/laerkort.js` er UTKAST. Se `docs/etappeC.md`. | 2026-11-06 |
| D – Tre spor i lesing | Ferdig og pushet. Tekstene i `src/data/lesing/tekster2.js` er UTKAST. Se `docs/etappeD.md`. | 2026-11-06 |
| E – Synkronisering, konto og småfeil | Ikke startet | |

Merk: klokke, geografi og engelsk (etappe 6 i den opprinnelige planen) var allerede ferdig og slått sammen til `main` før denne runden startet.

---

## Oppdraget (originalmeldingen, uendret)

Du jobber videre på Selmas skole (selmasskole.vercel.app). Appen ble testet på nytt 6. november etter den store oppgraderingen. Det meste virker, men nivåsettingen har feil som barna merker nå. Denne prompten retter dem og legger til et læringssteg.

Du er fortsatt midt i den opprinnelige planen. Gjør etappe A først, for den haster. Ta så B–E i rekkefølge, og fortsett deretter med det som gjenstår av den opprinnelige planen (klokke, geografi, engelsk). Der denne prompten og den opprinnelige planen sier ulike ting, gjelder denne. To regler i den forrige prompten var dårlige og erstattes her: «tre nivåer opp, to ned» i plasseringstesten, og de to overlappende reglene for nivå opp og sjefsoppgave.

ARBEIDSMÅTE
- Les koden for nivåmotoren, plasseringstesten, oppdragsbyggeren, synkroniseringen og voksensiden før du endrer noe. Feltnavnene jeg bruker (svake, sjef, paaRad, perfektRad, hjelpNeste, plassert, autoSpeak) er hentet fra den publiserte koden. Bruk det som faktisk står i kilden.
- Stopp etter hver etappe med en kort oppsummering: hva som er endret, hva som er testet, og hva jeg bør prøve selv.
- Skriv enhetstester for alt i etappe A. Akseptansetestene står nederst i etappen.
- Eksisterende framgang skal ikke gå tapt. Migrer data, ikke nullstill.

ETAPPE A – NIVÅMOTOREN (haster)

A1. Plasseringstest
I dag går testen tre nivåer opp per riktige svar, med én oppgave per nivå. Et barn som svarer riktig på alt fra «Det blå havet», havner på nivå 38 av 38 etter 12 oppgaver. Ny regel:
- Valget på startskjermen bestemmer verdenen, og testen finner nivået innenfor den. Startnivå som i dag (1, 6, 13, 21, 29). Taket er første nivå i neste verden (7, 15, 23, 31), og 38 for den øverste.
- Hvert nivå prøves med to oppgaver, ett forsøk, uten hjelp.
- Begge riktige: gå to nivåer opp (aldri over taket) og prøv der. Begge riktige på taket: plasser på taket.
- Minst én feil: stopp, og plasser barnet ett nivå over det siste nivået det besto.
- Feil allerede på startnivået: gå to nivåer ned og prøv der på samme måte. Består barnet et nivå, plasseres det ett nivå over. Bommer det på nivå 1, plasseres det på 1.
- Bruk aldri sant/usant-oppgaver i testen, og aldri oppgaver som krever fagord barnet ikke har lært (substantiv, partall, diftong og lignende).
- Testen skal ikke skrive til bom-lista (svake).
- I lesing gjelder samme regel, med tak på nivå 9 uansett valg. Fjern valget som starter på nivå 11.

A2. Regler etter et oppdrag
«Riktig» betyr riktig på første forsøk uten hjelp, som i dag. Bruk disse reglene og ingen andre:
- 7 eller 8 riktige: paaRad + 1. Når paaRad er 2, går barnet ett nivå opp, og paaRad nullstilles.
- 5 eller 6 riktige: paaRad = 0.
- 0–4 riktige: paaRad = 0, og hjelp slås på i neste oppdrag, som i dag. Ny regel: to slike oppdrag på rad flytter barnet ett nivå ned, aldri under 1, med en vennlig melding fra reven.
- 8 av 8: i tillegg tilbys sjefsoppgaven på resultatskjermen, hver gang, så lenge barnet ikke står på toppnivået. Barnet kan si nei.
perfektRad trengs ikke lenger.

A3. Sjefsoppgaven
I dag nås den aldri, fordi nivå opp nullstiller telleren før den slår til.
- Målet er tre nivåer over nivået barnet står på etter at resultatet er regnet inn, eller toppnivået.
- Fem oppgaver: én fra nivået rett over og to fra hvert av de to neste. Er det færre enn tre nivåer igjen, fordeles oppgavene på de som finnes. Ett forsøk, uten hjelp.
- Minst 4 av 5 riktige: barnet hopper til målet. Ellers blir det stående, uten straff.
- Bom i sjefsoppgaven skal ikke på bom-lista.

A4. Bom-lista (svake)
I dag følger lista med når nivået settes ned for hånd, og et barn på nivå 2 får likninger fra nivå 38.
- Tøm svake og sjef og nullstill paaRad når nivået settes under For voksne, når plasseringstesten fullføres, og når barnet flyttes ned.
- Legg bare typer på lista fra oppgaver på eget nivå og fra repetisjon. Ikke fra smakebiten fra neste nivå, sjefsoppgaven eller plasseringstesten.
- Når et oppdrag bygges, tas aldri en type med som hører hjemme på et høyere nivå enn barnets.
- Fjern typen fra lista når barnet har svart riktig på den to ganger på første forsøk.
- Ved synkronisering brukes lista fra den siden som sist ble endret, sammen med nivået. Ikke slå listene sammen.

A5. Repetisjon
Repetisjonsoppgavene trekkes i dag tilfeldig fra alle tidligere nivåer. Trekk dem fra de fem siste nivåene under barnets nivå.

Akseptansetester for etappe A (skriv dem som simuleringer):
1. Barn som svarer riktig på alt og velger «Det blå havet»: plasseres på 15 etter høyst 12 oppgaver og møter aldri en oppgave over nivå 15.
2. Barn som kan alt til og med nivå 9 og velger «Det blå havet»: består 6 og 8, bommer på 10, plasseres på 9.
3. Barn som bommer på alt og velger «Det blå havet»: plasseres på 1.
4. Bom på et oppdrag på nivå 38, sett nivå 2 under For voksne, bygg 50 oppdrag: ingen oppgave over nivå 3.
5. Barn på nivå 2 med 8 av 8 og bestått sjefsoppgave: står på nivå 5 etter 13 oppgaver.
6. To oppdrag på rad med 7 riktige: ett nivå opp, ingen sjefsoppgave.
7. To oppdrag på rad med 3 riktige på nivå 10: barnet står på nivå 9.
8. I 1000 genererte oppdrag på tilfeldige nivåer finnes ingen oppgave fra et nivå over barnets nivå + 1.

ETAPPE B – OPPLESING
Opplesing er av som standard, og de yngste kan ikke lese oppgaveteksten.
- Når en profil lages, spør «Kan barnet lese selv?». Ved nei slås opplesing på.
- Eksisterende profiler der innstillingen aldri er rørt: slå på opplesing hvis barnet ikke er plassert i lesing eller står under nivå 8.
- Oppgaver som ikke kan løses uten lyd (for eksempel «Hvilken bokstav hører du?»), spiller alltid av lyden automatisk.

ETAPPE C – «LÆR FØRST»-KORT
Appen tester, men lærer ikke bort. I dag er den eneste forklaringen én setning etter to gale svar.
- Et kort er tre–fire korte skjermer: én tanke per skjerm, høyst to korte setninger, et konkret eksempel og en enkel figur der det hjelper. Kortene leses alltid opp.
- Eksempel, ordklasser: «Et substantiv er navn på ting, dyr og mennesker: hund, bok, Oslo. Du kan si en, ei eller et foran.» «Et verb er noe du gjør: løpe, spise, sove. Du kan si å foran.» «Et adjektiv forteller hvordan noe er: stor, rød, glad.»
- Siste skjerm er «Prøv selv»: tre oppgaver fra nivåets egen generator. Feil svar viser forklaringen med en gang. Ingenting teller: ingen stjerner, ingen bom-liste, ingen logg.
- Kortet vises første gang barnet starter et oppdrag på et nivå som har kort, uansett hvordan barnet kom dit. En knapp «Jeg kan dette» hopper rett til oppdraget. Lagre per profil hvilke kort som er sett.
- En «Lær»-knapp i oppdraget åpner kortet for oppgavetypen barnet står på, også når oppgaven er repetisjon eller smakebit fra et annet nivå.
- Etter to gale svar vises det relevante steget fra kortet. Nivåer uten kort beholder setningen de har i dag.
- Legg kortene i en egen datafil, så jeg kan lese korrektur. Skriv førsteutkast til disse:
  Lesing: diftonger (10), kj og skj (11), dobbel konsonant (12), stum h og g og sammensatte ord (13), ordklasser (14), bøying (15), motsetninger og tegnsetting (16).
  Matte: tiervenner og dobling (9), tiere og enere (10), tierovergang i pluss (12) og minus (13), partall og oddetall (14), veksling (20), likhetstegnet (21), gange som like grupper (23), deling (28), negative tall (34), brøk (35), desimaltall (36), areal og omkrets (37), likninger (38).

ETAPPE D – TRE SPOR I LESING
Lesestigen blander tre ferdigheter i én stige. Et barn som leser godt, blir plassert rett inn i fagord det aldri har lært.
- Del stigen i tre spor: Lese (dagens nivå 1–9), Skrive riktig (dagens 10–13, blir nivå 1–4) og Språk (dagens 14–16, blir nivå 1–3).
- Hvert spor har eget nivå, egen bom-liste og egen sjefsoppgave, med motoren fra etappe A.
- Plasseringstest finnes bare i Lese.
- Skrive riktig og Språk åpner når barnet har nådd nivå 8 i Lese. De starter på nivå 1 med «Lær først».
- Lesestigen viser tre spor. Når barnet velger Lesing i dagens økt, velger det spor selv, og reven foreslår sporet det er lengst siden barnet spilte.
- For voksne får en nivåvelger per spor.
- Migrering av dagens lesenivå: 1–9 gir samme nivå i Lese. 10–13 gir Lese 9 og Skrive riktig nivå minus 9. 14–16 gir Lese 9, Skrive riktig 1 og Språk nivå minus 13. Stjerner og beste resultat følger nivåene de ble tjent på.
- Lese tar slutt for tidlig for en sterk leser. Legg til tre nivåer øverst (10–12): tekster på 120–200 ord med spørsmål der svaret må sluttes ut fra teksten, ordforråd (synonymer og ord i sammenheng) og hovedtanke. Skriv minst åtte tekster per nivå. Jeg leser korrektur.

ETAPPE E – SYNKRONISERING, KONTO OG SMÅFEIL
- Nullstill: Sammenslåingen tar i dag høyeste verdi fra hver enhet, så en annen enhet kan legge gamle data tilbake. Lagre et tidspunkt for nullstilling i profilen. Ved sammenslåing vinner siden med nyest nullstilling for alt. Slå sammen som før bare når begge sider har samme tidspunkt. Skriv en test: nullstill på enhet A, slå sammen med gamle data fra enhet B, resultatet er fortsatt nullstilt.
- Hent fra skyen og slå sammen også når appen blir synlig igjen eller kommer på nett, ikke bare når profilen velges.
- Supabase: Funksjonen delete_my_account kan kalles uten innlogging. Fjern kjøretilgangen for public og anon, og gi den til authenticated.
- Jeg slår selv av åpen registrering i Supabase. Sørg for at appen viser en vennlig melding når registrering er stengt, og at innlogging virker som før.
- Appen starter ikke uten nett. Legg til en service worker som lagrer appskallet, eller rett teksten på personvernsiden.
- Småfeil:
  - Nivå 2 i matte er ensformig, med fem like «Hvor mange er det?» på rad. Bland inn terningbilder, fingre og «hvem har flest».
  - Fjern trivielle oppgaver som «10 + 0» og «0 + ? = 10» fra nivå 7 og opp.
  - Forklaringen til 20 − 8 sier «20 − 0 = 20, og så 8 til». Forklar via tieren: 20 − 10 = 10, og så 2 tilbake. Sjekk de andre forklaringene for samme mønster.
  - I Farger viser svaralternativene samme fargerute som oppgaven. Vis fargen og la barnet velge blant fargenavn, med opplesing.
  - Hagen har en gammel tekst om klistremerker. Fjern den.
  - Kartet viser nivåene i slangemønster uten tegnet sti. Tegn stien.
  - Rydd bort den gamle mattemotoren når ingenting bruker den lenger.

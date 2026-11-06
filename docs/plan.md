# Plan for Selmas skole

## Status (oppdateres etter hver etappe)

| Etappe | Status | Sist oppdatert |
|--------|--------|----------------|
| 0 – Les og planlegg | Ferdig. Svar fått: bygg på lokal `main`, Supabase-prosjektet `selmas-skole` er riktig, Vitest er greit, startverden i stedet for alder, nytt trinn som nivåer i stigene, stjerneregel for alle motorer, gammel framgang kan nullstilles. Se `docs/etappe0.md`. | 2026-11-05 |
| 1 – Rett opp det som er galt i dag | Ferdig og pushet. Endringslogg og prøveliste i `docs/etappe1.md`. | 2026-11-05 |
| 2 – Innlogging, profiler og synkronisering | Kode ferdig. Jon må sette Vercel-nøkler, stenge registrering og legge inn e-poster i Supabase (se `docs/etappe2.md`). | 2026-11-05 |
| 3 – Mattestigen | Kode ferdig og pushet. Se `docs/etappe3.md`. | 2026-11-06 |
| 4 – Dagens økt, kart og belønning | Ikke startet | |
| 5 – Lesestigen | Ikke startet | |
| 6 – Klokke, geografi og engelsk | Ikke startet | |

Arbeidsgren: `adaptiv-laering` (ikke push til `main` uten OK).

Viktige funn for en ny økt:
- Kjør `npm test` (Vitest) og `npm run build` før hver etappe avsluttes. Delt logikk ligger i `src/lib/` (rng, scoring, distractors, round, matte, klokke, quiz).
- Det finnes to utgaver av appen. Produksjon på Vercel kjører commit `2d5b097` (klassetrinn + Eventyrkart). Lokal `main` har en upushet commit `da2fcc1` (profiler, Supabase, temastiger, voksenside, opplesing, hage) som slettet Eventyrkartet. Se `docs/etappe0.md`.
- Supabase-prosjektet `selmas-skole` (eu-north-1) finnes med tabellene `children` og `progress`, RLS på, ingen rader.
- Vercel-prosjektet `selmasskole` har ingen miljøvariabler. `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` må legges inn der før etappe 2 rulles ut (Jon gjør det i Vercel-dashbordet, nøkler skal ikke i repoet).

---

## Oppdraget (originalmeldingen, uendret)

Du skal bygge videre på «Selmas skole», en læringsapp for barna mine (selmasskole.vercel.app). Koden ligger i dette repoet. Slik jeg kjenner den er det React, Vite og Tailwind, men les koden selv først.

LAGRE PLANEN FØRST
Lagre hele denne meldingen som docs/plan.md i repoet. Hold en statusliste øverst i fila oppdatert etter hver etappe, slik at en ny økt kan fortsette derfra.

HVEM APPEN ER FOR
- Et barn på 5 år som elsker matte, og som kanskje ikke leser selv ennå.
- Et barn på 8 år som er sterk i både matte og lesing.
- De bytter mellom flere enheter (nettbrett, mobil, PC).

PROBLEMET I DAG
- Nivå er klassetrinn (Barnehage, 1.–4. klasse) med én fast vanskelighetsgrad per aktivitet. Ingenting blir vanskeligere når barnet blir flinkere.
- Tallinja markerer riktig svar i gult før barnet har svart, i pluss- og minusoppgaver med svar opptil 20.
- Nesten alt er flervalg med fire svar, og feilsvarene ligger innen ±5 fra fasit, så siste siffer avslører svaret.
- Stjerner gis uansett: 0 av 8 riktige gir «Bra jobba!», konfetti og 1 stjerne. Eventyrkartet gir 2 stjerner selv med bare feil, og kan gjentas.
- Ingen opplesing. Mange oppgaver for de minste har tekst som svar.
- Ingen profiler. Bare én stjernesum i localStorage.

MÅLET
Nivået skal følge barnet, ikke klassetrinnet. Begge barna skal få oppgaver de må tenke på, klare omtrent seks–sju av åtte, og se at de går framover.

FASTE REGLER (gjelder alle etapper)
1. All tekst i appen er på norsk bokmål. Behold dagens utseende, reven og de store knappene.
2. Nivået endres bare av det barnet får til på første forsøk uten hjelp.
3. Ingen tidspress, ingen straff, ingen rekker som kan brytes, ingen topplister.
4. Belønning følger mestring, ikke oppmøte.
5. Ingen reklame, sporing eller analyseverktøy fra tredjepart.
6. Lagre lite om barna: kallenavn, figur, nivå og svarhistorikk. Ingen fødselsdato, ingen e-post for barn.
7. Alt innhold ligger i datafiler jeg kan redigere: nivåer, ordlister, tekster, kort, historier.
8. Skriv enhetstester for oppgavegeneratorer og nivålogikk.
9. Appen skal virke på nettbrett, mobil og PC, med berøring, mus og tastatur.

SLIK JOBBER DU
- Én etappe om gangen, i rekkefølgen under.
- Avslutt hver etappe med: bygg og tester kjører grønt, kort endringslogg, og en liste over hva jeg bør prøve som 5-åring og som 8-åring. Stopp så og vent på OK fra meg.
- Jobb på en egen gren. Ikke push til main og ikke rull ut før jeg har sagt OK.
- Spør meg før du legger til større avhengigheter, oppretter noe i Supabase eller trenger nøkler. Nøkler skal aldri inn i repoet.
- Er du i tvil om pedagogikken, velg det enkleste og si fra.

ETAPPE 0 – Les og planlegg
Les koden. Skriv en kort oppsummering av hvordan den er bygd, et forslag til datamodell og spørsmålene dine. Ikke endre noe før jeg har svart.

ETAPPE 1 – Rett opp det som er galt i dag
1. Tallinja skal aldri markere fasit. Flytt tellebildene (ballongene) og tallinja bak en «Hjelp»-knapp som er av som standard. Tallinja viser startpunktet og lar barnet hoppe selv.
2. Feilsvar i flervalg skal ligne ekte feil: ti for mye eller for lite, samme siste siffer, svar fra nabotabellen i gange. Aldri negative tall der de ikke hører hjemme.
3. Ingen like oppgaver i samme runde.
4. Stjerner etter resultat i en runde på åtte: 0–3 riktige gir ingen, 4–5 gir én, 6–7 gir to, 8 gir tre. Ingen konfetti eller «Bra jobba!» ved svakt resultat, bare en vennlig oppfordring til å prøve igjen.
5. Eventyrkartet: ingen stjerner ved feil svar, hvert sted gir stjerner bare én gang, og fullførte steder huskes.
6. Nytt trinn mellom Barnehage og 1. klasse: telle til 20, hva kommer før og etter, mer og mindre, pluss og minus til 10. Det ligger alt en ubrukt meny med Lett, Middels og Vanskelig i matte-koden.
7. Opplesing med nettleserens norske stemme (Web Speech API, nb-NO). Legg den bak én funksjon, slik at egne lydopptak kan erstatte stemmen senere uten andre endringer. Høyttalerknapp på hver oppgave, og automatisk opplesing som kan slås på.
8. Oppgaver for de minste skal kunne løses uten å lese: bruk farger, bilder og former som svar, eller les opp alternativene.
9. «Nullstill stjerner» flyttes bak en voksensperre: hold inne en knapp i tre sekunder og skriv et årstall.
10. Småfeil: «Tryllesskogen» skal være «Trylleskogen». «Bare 1 stjerner igjen!» skal være «stjerne». Klokkequizen skriver «Klokka er Klokka er 7!» og «Klokka er Halv 9!». Eventyrkartet sier «Bra jobba igjen!» første gang. Tallinja 0–20 vises for oppgaver som «3 + 90». Zoom er slått av i viewport.

ETAPPE 2 – Innlogging, profiler og synkronisering
- Bruk Supabase. Én voksen logger inn med e-postlenke. Barna er profiler under den voksne, med kallenavn og figur. Barna logger aldri inn selv, og enheten forblir innlogget.
- Slå av åpen registrering. Bare e-postadresser jeg oppgir, skal kunne logge inn. Slå på radnivåsikkerhet, så en voksen bare ser egne barn.
- Forsiden blir «Hvem skal spille?» med figurene. Hver profil har eget nivå per fag, egne stjerner, egen samling og egen ukestripe.
- Framgangen synkroniseres mellom enheter. Appen skal tåle å miste nettet midt i et oppdrag og synkronisere når nettet er tilbake.
- Voksenside bak voksensperren. Per barn: nivå per fag, oppdrag og minutter siste uke, og de tre oppgavetypene barnet bommer mest på. Her kan jeg sette nivå, velge fagblanding og antall oppdrag per dag, slå automatisk opplesing av og på, og nullstille.
- Legg til web-app-manifest, slik at appen kan legges på Hjem-skjermen.

ETAPPE 3 – Mattestigen
Bytt klassetrinnene i matte med 38 nivåer i fem verdener (stedene som finnes på Eventyrkartet). Klassetrinn vises bare på voksensiden. Hvert nivå er én smal ferdighet, definert som data.

Trylleskogen (før skolestart) – trykk på svaret, alt leses opp
1. Telle 1–5 ting, og kjenne igjen terningbilder uten å telle
2. Telle 6–10 ting og finne riktig tall
3. Tallrekka til 20: hva kommer før og etter, hvilket tall mangler
4. Mer, mindre og like mange, for mengder og tall til 20
5. Dele opp tall til 5 (3 = 2 + ?), pluss og minus innenfor 5
6. Dele opp tall til 10, pluss og minus innenfor 10 med hjelp tilgjengelig

Det blå havet (1. trinn og høsten i 2.) – herfra skriver barnet svaret
7. Pluss innenfor 10
8. Minus innenfor 10
9. Tiervenner (7 + ? = 10) og dobling opp til 10 + 10
10. Tallene 11–20 som tiere og enere (10 + 4, 17 − 7)
11. Pluss og minus innenfor 20 uten tierovergang (12 + 5, 18 − 3)
12. Pluss med tierovergang (8 + 5)
13. Minus med tierovergang (13 − 4)
14. Partall og oddetall, telle med 2, 5 og 10 til 100

Det høye fjellet (2. trinn)
15. Tall til 100: tiere og enere, plass på tallinja, større og mindre enn
16. Hele tiere (30 + 40, 70 − 20) og ti mer eller mindre (34 + 10)
17. Tosifret pluss og minus ensifret uten tierovergang (43 + 5)
18. Tosifret pluss og minus ensifret med tierovergang (47 + 5, 52 − 6)
19. Tosifret pluss og minus tosifret uten veksling (34 + 32)
20. Tosifret pluss og minus tosifret med veksling (47 + 38, 72 − 45)
21. Åpne oppgaver og likhetstegn (34 + ? = 50, 8 + 5 = ? + 6)
22. Dobling og halvering til 100, penger og enkle tekstoppgaver

Det gylne slottet (3.–4. trinn)
23. Gange som like grupper og rutenett, 2- og 10-gangen
24. 5- og 4-gangen
25. 3- og 6-gangen
26. 9-, 8- og 7-gangen
27. Blandet gangetabell til 10 × 10, også ? × 6 = 42
28. Deling som omvendt gange, med og uten rest
29. Tall til 1000, og tresifret pluss og minus
30. Tekstoppgaver med ett steg der barnet må velge regneart

Verdensrommet (4.–5. trinn)
31. Tall til 10 000, avrunding, firesifret pluss og minus
32. Tosifret ganger ensifret (7 × 14 = 70 + 28)
33. Tosifret delt på ensifret, med og uten rest
34. Negative tall på tallinje og termometer
35. Brøk av figur og mengde (¾ av 12), sammenligne enkle brøker
36. Tideler, desimaltall med én desimal, kroner og øre
37. Areal og omkrets av rektangler, koordinater
38. Likninger og tekstoppgaver med to steg, parenteser

Nøttehula (sidespor, åpen fra første dag, påvirker ikke nivået)
Tenkenøtter i tre vanskelighetsgrader: tallmønstre, magiske kvadrater, mini-sudoku 4 × 4, «hvilket tall er jeg?».

Regler for nivået
- Ett oppdrag er åtte oppgaver i ett fag: fem fra eget nivå, to repetisjon fra tidligere nivåer og én fra neste nivå. Lett før vanskelig.
- To forsøk per oppgave. Etter andre feil vises løsningen med en kort forklaring. Bare første forsøk uten hjelp teller.
- 7–8 riktige i to oppdrag på rad: nivå opp, med feiring.
- 5–6 riktige: samme nivå, nye oppgaver.
- 0–4 riktige: neste oppdrag har hjelp slått på og henter halvparten fra nivået under. Ikke vis noen melding om å rykke ned.
- 8 av 8 i to oppdrag på rad: tilby en sjefsoppgave med fem oppgaver fra to–tre nivåer høyere. Minst fire riktige gir hopp dit.
- Oppgavetyper barnet bommer på, kommer tilbake i neste oppdrag og dagen etter.
- Tiervenner og gangetabell øves som kort i fem bokser: riktig svar flytter kortet én boks opp, feil sender det til boks 1, og kort i høyere bokser kommer sjeldnere.
- Plasseringstest første gang et fag åpnes: 8–12 oppgaver. Start litt under det som er vanlig for alderen, gå tre nivåer opp ved riktig svar og to ned ved feil. Jeg kan overstyre på voksensiden.
- Talltastatur på skjermen fra nivå 7, som også tar imot vanlig tastatur. På nivå 1–6 er det flervalg med feilsvar tett på fasit (én for mye, én for lite).
- Varier oppgaveformen: ukjent på ulike plasser, sant eller usant, sorter, dra til tallinja.

ETAPPE 4 – Dagens økt, kart og belønning
- Barnets forside viser «Dagens økt» med tre oppdragskort: Matte, Lesing og en overraskelse (klokke, geografi eller en tenkenøtt). Barnet velger to. Jeg kan låse Matte eller Lesing som fast på voksensiden. Til lesestigen er klar, brukes matte, klokke og geografi.
- To oppdrag gjør dagen ferdig og gir et stempel i en ukestripe med sju ruter. Ingen premie for stempelet, og ingenting går tapt på en fridag. Etterpå er alt åpent for fri lek.
- Eventyrkartet blir selve framgangen: hvert nivå er et sted, og reven flytter seg når barnet går opp et nivå.
- Stjerner: 0–3 per nivå etter beste resultat på første forsøk. Kan forbedres.
- Samlekort erstatter de åtte klistremerkene: ett kort for hvert nivå barnet mestrer, i sett som norske dyr, dinosaurer og planeter, med én faktalinje per kort. Av og til et uventet ekstrakort.
- Reven kan få kostymer som kjøpes med stjerner, og som vises inne i oppgavene.
- En felles familiekiste som fylles av begge barnas stjerner. Appen lover ingen premie.
- En kort historiebit om reven mellom verdenene, som leses opp eller leses selv.

ETAPPE 5 – Lesestigen
Samme regler som i matte. Oppdrag med lengre tekster har færre oppgaver. Du skriver utkast til ordlister og tekster i enkelt bokmål, og merker dem tydelig så jeg kan lese gjennom før de tas i bruk.
1. Lyder og bokstaver: hør lyden og finn bokstaven, store og små, i rekkefølgen i s o l e v a t b ø m å j r d u g n p y h f k æ
2. Lydering: trekke sammen to og tre lyder til ord som sol og mus, og lese ord som skrives slik de høres ut, med små bokstaver
3. Ord og setninger: vanlige ord som jeg, er, og, det, de, som. Korte setninger: hvilket bilde passer?
4. Lese og forstå: tekster på 40–120 ord med to–tre spørsmål. Fakta eller mening?
5. Rettskriving: skriv ordet du hører. Diftonger, kj og skj, dobbel konsonant, stum h og g, sammensatte ord
6. Språk: ordklasser, bøying, motsetninger, tegnsetting

ETAPPE 6 – Klokke, geografi og engelsk
- Klokke som egen liten stige: hel, halv, kvart, fem minutter med norsk klokkespråk («fem over halv fire», «ti på halv»), digital mot analog, og tidsregning. Behold øvingen der barnet drar viserne. Ikke bland skrivemåter i samme oppgave.
- Geografi: Norden, Europa og verden, med flagg, hovedsteder og et ordentlig kart å trykke på.
- Engelsk til slutt: vanlige ord med bilde og lyd, og enkle setninger. Spør meg før du begynner.
- Ukeoversikt på voksensiden.

Begynn med etappe 0 nå.

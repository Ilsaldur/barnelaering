# Plan, runde 6 (tilbakemelding etter test 7. november 2026, etter runde 5)

## Status

| Etappe | Status | Sist oppdatert |
|--------|--------|----------------|
| Z – Plasseringen måler nivået | Ferdig og pushet. Se `docs/etappeZ.md`. AA2 (nøkler per ferdighet i geografi) ble tatt her fordi Z trenger det. | 2026-11-07 |
| AA – Nivå opp krever at nivået er lært, klokka ut av kunnskapslaget | Ferdig og pushet (Jon valgte A). Se `docs/etappeAA.md`. | 2026-11-07 |
| AB – Dagens økt står stille | Ferdig og pushet. Se `docs/etappeAB.md`. | 2026-11-07 |
| AC – Uten nett | Ferdig og pushet. Se `docs/etappeAC.md`. | 2026-11-07 |
| AD – Matteplasseringen kan angre | Ferdig og pushet. Se `docs/etappeAD.md` (avvik: første bom i opp-fasen angres uten krav om tre på rad). | 2026-11-07 |
| AE – Innhold og småting | Ferdig og pushet. Se `docs/etappeAE.md`. Seks nye tekster er UTKAST. | 2026-11-07 |

---

## Oppdraget (originalmeldingen, uendret)

Du jobber videre på Selmas skole (selmasskole.vercel.app). Runde 5 (etappe R–Y) er testet i den publiserte appen 7. november. Alt er bygget og virker teknisk: én dør per fag, usynlig plassering uten tall, vis-kort, former og farger inni matte, kort i alle stiger, tegnet rev med flere kostymer, nye tekster, Afrika med 12 land, «Hele stigen klart» én gang, service worker aktiv på under et sekund, hovedpakke 180 kB. 343 tester grønne.

Men kunnskapslaget (etappe T) har en feil i grunnmuren som gjør plasseringen i geografi, klokka og delvis engelsk nesten meningsløs, og som gjør stigene hule. Denne runden retter det, pluss Dagens økt, offline og noen småting. Målt med appens egne funksjoner (startForste/svarForste, buildMission, applyResult) og i den publiserte appen:

- Prøvene i plasseringen foretrekker ting barnet alt kjenner (velgKjent uten foretrekkUkjent) og henter feilsvar bare blant kjente ting (kjenteFeil gir ett feilsvar når ingenting er kjent). Et barn som bare kan hele timer, får «Hva er klokka? → 9» som prøve på nivå 4 og «Still klokka på 9» på nivå 6, og plasseres på Klokka 6 («Still klokka til fem minutter») – tre av tre ganger i appen, 85 % i simulering. Et barn som bare kan flaggene i Norden, får Danmarks flagg som prøve på Europa-nivået og havner på nivå 3 eller høyere i 48 %. Et barn som ikke kan noe, får spørsmål med to svaralternativer (50/50) hele veien opp og lander på nivå 7–8 «Hele verden» i en tredel av tilfellene.
- Når barnet kjenner én ting, handler alle spørsmålene om den. I appen fikk femåringen «Hvilket land har dette flagget? → Danmark» tre ganger på rad i sitt første oppdrag. I simulering kommer samme spørsmål minst tre ganger i 65 % av plasseringene i klokka.
- Vanlige oppdrag stiller bare spørsmål om kjente ting, høyst tre nye per oppdrag, og vis-kort teller som riktige. Da er 7 av 8 nesten automatisk, og nivå opp kommer annethvert oppdrag uansett. Et barn som ikke kan noe, men husker det som vises, står på nivå 8,9 i geografi etter 20 oppdrag og kan da 34 av 120 ting; toppen av klokka innen 20 oppdrag. Sjefsoppgaven tilbys etter 5 av 5 på Geografi 1, og består av to 50/50-spørsmål om hovedsteder, ett kartklikk og to flaggspørsmål barnet alt kan.
- Nøkkelen blander ferdigheter: «land:se» betyr flagg, kart og verdensdel; «tid:3:00» betyr lese, stille og finne. I klokka er hvert klokkeslett en «ting» (288 på nivå 7), så barnet må vises 12:20 før det kan spørres om 12:20.
- Dagens økt regner kortene ut fra loggen hver gang. Etter første oppdrag er kortene byttet (14 av 14 dager i simulering), ✓-merket vises nesten aldri, og gavekortet kan skifte fag midt på dagen.
- Service workeren lagrer bare filene index.html peker på. GeoStige, VerdensKart og Supabase lastes dynamisk og er ikke i cachen før de har vært åpnet med nett. Uten nett gir geografi hvit skjerm (Failed to fetch dynamically imported module), og profilvalget står på «Laster …».

Der denne prompten og tidligere prompter sier ulike ting, gjelder denne.

ARBEIDSMÅTE
- Ta etappene i rekkefølge. Stopp etter hver med en kort oppsummering: hva som er endret, hva som er testet, og hva jeg bør prøve selv.
- Skriv en test for hver akseptansetest. Simuleringene bruker appens egne funksjoner med fast frø og disse barnemodellene: «kan ingenting» (svarer riktig med 90 % på ting som er vist tidligere i samme oppdrag eller står i kjent, ellers gjetter det blant alternativene), og «kan til og med nivå k» (92 % på nivå ≤ k, 55 % på k + 1, 15 % over; i kunnskapsstigene regnes en ting som kjent når den først opptrer på nivå ≤ k).
- Eksisterende framgang skal ikke gå tapt. Profiler som er plassert, blir stående der de er.
- Nytt innhold merkes som utkast til jeg har lest det.
- Etappe AA har et valg om klokka. Spør meg før du bygger den.

ETAPPE Z – PLASSERINGEN MÅLER NIVÅET (viktigst)
Z1. Prøvene
- Første oppgave i en kunnskapsstige er fortsatt vis + spørsmål om det samme, og bom der gir innføring som i dag.
- Prøvene i fasene opp og søk er vanlige spørsmål fra nivået: ingen kjent-fortrinn og vanlige feilsvar (minst tre når bunken har nok). Prøven på nivå n handler om nivåets eget innhold: en ting som først opptrer på nivå n (kvart over og kvart på på Klokka 4, ikke hele timer; land utenfor Norden på Europa-nivåene; land utenfor Europa på verdensnivåene). Lag en funksjon som gir hvert nivås egne ting, med test.
- Et riktig svar på en prøve gjør tingen kjent.
Z2. Slå fast og fyll
- Ingen oppgave stilles to ganger i det første oppdraget. Når barnet kjenner færre enn tre ting på nivået, fylles resten med vis + spørsmål om nye ting (som byggKunnskapsOppdrag, høyst tre nye), ikke med spørsmål om den ene tingen om igjen.
Z3. Framdrift
- Linja uten tall skal ikke hoppe tilbake når oppdraget blir lengre enn anslått.
Akseptansetester (simulering, 300 barn per nivå, geografi, klokka og engelsk):
1. «Kan ingenting» plasseres på nivå 1 eller 2 i minst 90 % av tilfellene, og får innføring eller vis + spørsmål på alle ting det spørres om utenom prøvene.
2. «Kan til og med nivå k»: plassert innenfor ±1 i minst 60 % (klokka minst 70 %), for høyt (to eller flere nivåer) i høyst 20 %, snitt over alle k. Ingen prøve på nivå n handler om en ting som først opptrer på et lavere nivå.
3. Ingen oppgave kommer tre ganger i samme første oppdrag. Alle prøver har minst tre svaralternativer der bunken har minst fire ting.
4. I appen: et barn som svarer riktig bare på hele timer, plasseres på Klokka 1 eller 2.

ETAPPE AA – NIVÅ OPP KREVER AT NIVÅET ER LÆRT, OG KLOKKA UT AV KUNNSKAPSLAGET (spør meg først om klokka)
AA1. Nivå opp i kunnskapsstigene
- I tillegg til to gode oppdrag på rad kreves det at barnet kjenner minst tre firedeler av nivåets egne ting (alle når nivået har tolv eller færre). Kartet viser hvor mange av nivåets ting barnet kjenner («Du kjenner 7 av 10 land»), og teksten om neste nivå sier det samme.
- Vis-kort teller som riktige for stjernene, men ikke for grensen 7 av 8: grensen regnes av spørsmålene (7 av 8 blir «alle spørsmålene unntatt ett»).
- Sjefsoppgaven tilbys bare når nivåets ting er kjent, og bruker vanlige feilsvar.
- Når nivået har mer enn 20 egne ting og barnet svarte riktig på alle spørsmålene om nye ting i forrige oppdrag, kan neste oppdrag ha fire nye.
- Et barn som alt kan mye, skal ikke måtte sitte gjennom vis-kort for alt: én oppgave per oppdrag («prøv»-plassen, den gamle smakebiten) spør om en ukjent ting fra nivået med vanlige feilsvar og uten vis. Riktig gjør tingen kjent. Feil trekker ikke stjerner og teller ikke i grensen.
AA2. Nøkler per ferdighet i geografi
- «flagg:se», «kart:se», «hovedstad:se», «verdensdel:se». Vis-kortet viser tingen slik den spørres om (kart for kart, flagg for flagg). Gamle kjent-lister migreres: «land:xx» blir «flagg:xx».
AA3. Klokka – velg A eller B
- A (jeg anbefaler): Klokka går ut av kunnskapslaget. Nivåene er ferdigheter, ikke fakta. Første oppdrag på et nytt nivå starter med to vis-kort som viser nivåets nye ting («Klokka er kvart over 4» med klokke), deretter vanlige spørsmål med vanlige feilsvar. Plasseringen bruker Z1 uten kjent.
- B: Klokka blir i kunnskapslaget, men nøkkelen er minuttverdien per ferdighet («les:15», «still:45», «digital:20»), så det er 12 ting per nivå, ikke 144.
Akseptansetester:
1. Simulering: «kan ingenting» som husker det som vises, kjenner minst tre firedeler av Norden-tingene når det går opp til Geografi 4, og bruker minst 30 oppdrag til toppen. Et barn som kan alt (97 %) plasseres på nivå 7 eller høyere og når toppen innen 8 oppdrag.
2. Et barn som kjenner flagget til Sverige, får vis-kort før første kartspørsmål om Sverige.
3. I appen: etter to oppdrag med 8 av 8 på Geografi 4 der barnet kjenner 5 av 27 ting, står barnet fortsatt på nivå 4, og kartet sier hvor mange det kjenner.

ETAPPE AB – DAGENS ØKT STÅR STILLE
- Dagens tre kort regnes ut første gang forsiden vises den dagen og lagres (for eksempel dager[dato].kort). Resten av dagen vises de samme kortene, med ✓ på dem som er spilt. Gavekortet skifter ikke fag.
- Oppdrag gjort fra Fri lek teller fortsatt mot dagen.
Akseptansetest: Spill kortet lengst til venstre. Forsiden viser de samme tre kortene med ✓ på det første. Neste dag er kortene nye, og det spilte faget er ikke blant de to første.

ETAPPE AC – UTEN NETT
- Service workeren lagrer alle filene i /assets/ ved installasjon (les lista fra Vites manifest eller en liste som skrives ved bygging), ikke bare dem index.html peker på.
- En feilgrense (error boundary) rundt appen og rundt hver stige: en feil gir et kort med «Noe gikk galt» og knappene «Prøv igjen» og «Hjem», aldri hvit skjerm.
- Profilvalget uten nett viser de lokale profilene med én gang; «Laster …» vises bare mens det faktisk hentes.
Akseptansetester:
1. Etter ett besøk på forsiden, uten å ha åpnet geografi: uten nett åpner geografi og en kartoppgave vises.
2. En kastet feil i en stige viser kortet, og «Hjem» virker.

ETAPPE AD – MATTEPLASSERINGEN KAN ANGRE
I dag: ett glipp i søkefasen sender barnet nedover for godt; slå-fast-fasen går bare ned. Målt: innenfor ±1 i 56 % totalt, men 30–48 % plasseres to eller flere nivåer for lavt fra nivå 15 og oppover.
- Etter en bom i opp- eller søkefasen stilles ett nytt spørsmål på samme nivå når barnet hadde minst tre riktige på rad før bommen. Går det riktig, regnes bommen som glipp (høyst én gang per oppdrag).
- Taket på 14 oppgaver beholdes.
Akseptansetest: Simulering med «kan til og med nivå k» i matte: innenfor ±1 i minst 60 % og for lavt (to eller flere) i høyst 25 %, snitt over nivå 10–30. Ingen plassering over 14 oppgaver.

ETAPPE AE – INNHOLD OG SMÅTING
- Lese 9 har 6 tekster og to per oppdrag, så en tekst kommer igjen i fjerde oppdrag hver gang. Skriv minst 6 til (90–130 ord, tre spørsmål, like lange svaralternativer, utkast).
- Emneregelen (høyst to per oppdrag, aldri to på rad) gjelder også i byggKunnskapsOppdrag, med unntak for vis + spørsmål om det samme. I dag har 60–74 % av oppdragene på Geografi 2–3 samme land i tre eller flere oppgaver.
- Kortet «dyr-sel» heter «Ulv» og ligger i settet for havet. Gi det et havdyr.
- «Til matte nivå 6» fra et grått kort når barnet ikke er plassert, starter plasseringen. Vinduet skal si det: «Reven finner først nivået ditt.»
- Samlingen er 92 grå ruter under hverandre. Vis settet for faget barnet sist spilte øverst, og la de andre settene være sammenslått med «x av y» til man trykker.
Akseptansetester:
1. Fire oppdrag på rad på Lese 9: ingen tekst kommer igjen.
2. 500 oppdrag på Geografi 2 med alt kjent: samme land høyst to ganger per oppdrag, aldri to spørsmål på rad om samme land (vis + spørsmål unntatt).

# Plan, runde 5 (tilbakemelding etter test 7. november 2026, etter runde 4)

## Status

| Etappe | Status | Sist oppdatert |
|--------|--------|----------------|
| R – Én dør per fag, Dagens økt velger seg selv | Ferdig og pushet. Se `docs/etappeR.md`. | 2026-11-07 |
| S – Usynlig plassering | Ferdig og pushet. Se `docs/etappeS.md`. | 2026-11-07 |
| T – Innføring i kunnskapsstigene | Ikke startet. | |
| U – Former og farger inn i matte | Ikke startet. | |
| V – Samlingen forklarer seg selv, alle stiger gir kort | Ikke startet. | |
| W – Reven kan ha på flere ting (spør Jon først) | Ikke startet. | |
| X – Innhold | Ikke startet. | |
| Y – Småfeil | Ikke startet. | |

---

## Oppdraget (originalmeldingen, uendret)

Du jobber videre på Selmas skole (selmasskole.vercel.app). Runde 4 (etappe L–Q og engelsk 8–10) er testet i den publiserte appen 7. november. Gjentakelsene er borte, og alt fra forrige liste virker. Denne runden handler ikke om feil i motoren, men om det barna møter før og etter oppgavene: hvor de skal, hva de får, og at ingen skal måtte feile for å komme i gang. Tre prinsipper gjelder for hele runden: ingenting låses bak en voksen, barnet skal aldri få vite at det tar en test, og Dagens økt velger seg selv.

Der denne prompten og tidligere prompter sier ulike ting, gjelder denne.

ARBEIDSMÅTE
- Ta etappene i rekkefølge. Stopp etter hver med en kort oppsummering: hva som er endret, hva som er testet, og hva jeg bør prøve selv.
- Skriv en test for hver akseptansetest. Der det står «i appen», testes det gjennom komponentene.
- Eksisterende framgang skal ikke gå tapt. Profiler som finnes, skal åpne som før, og profiler som alt er plassert, skal ikke plasseres på nytt.
- Nytt innhold merkes som utkast til jeg har lest det.
- Etappe W har et valg jeg må ta først. Spør meg før du bygger den.

ETAPPE R – ÉN DØR PER FAG, OG DAGENS ØKT VELGER SEG SELV
I dag: «Matte» i Dagens økt og «Eventyrkartet» under Fri lek fører til samme skjerm med ulikt navn og ikon (🔢 og 🗺️). Dagens økt har to faste kort (matte og lesing) og en overraskelse som skifter med datoen, og voksensiden har innstillinger for fagblanding og fast fag. Når økta er ferdig, står det «Nå er alt åpent for fri lek», men ingenting har vært stengt.
- Fri lek viser de fem stigene med samme navn og ikon som kortene i Dagens økt: Matte 🔢, Lesing 📖, Klokka 🕐, Geografi 🌍, Engelsk 🇬🇧. Undertittelen er nivået («Nivå 24 av 38») eller «Ny!» når barnet ikke har vært der. «Eventyrkartet» er navnet på skjermen inni matte, ikke på knappen. Nøttehula, Samlingen og Hagen min står som før. Ingenting i Fri lek er låst.
- Dagens økt: reven velger. Kort 1 og 2 er de to fagene det er lengst siden barnet spilte (fag barnet aldri har åpnet, regnes som lengst siden, så alle stigene kommer i løpet av den første uka). Kort 3 er overraskelsen: trukket per dato blant de andre fagene og Nøttehula. Bruk loggen (data.log) for «sist spilt».
- Fjern innstillingene fagblanding og fast fag fra voksensiden og fra dagen.js. oppdragPerDag kan stå, med 2 som standard.
- Teksten etter ferdig økt: «Dagens økt er ferdig! 🎉 Stempel i boka.» Ikke noe om at alt er åpent. Hilsenen før: «Velg to av kortene i dag.»
Akseptansetester:
1. I appen: forsiden har nøyaktig én knapp per fag utenfor Dagens økt, med samme navn og ikon som kortet i Dagens økt.
2. dagensKort for en profil som spilte matte i går og lesing for tre dager siden, og aldri klokke, geografi eller engelsk: kort 1 og 2 er to av klokke, geografi og engelsk. Overraskelsen er aldri et av de to første. Samme dag gir samme kort hele dagen.
3. Teksten «åpent for fri lek» finnes ikke i koden.

ETAPPE S – USYNLIG PLASSERING: DET FØRSTE OPPDRAGET FINNER NIVÅET
I dag: Første gang i en stige kommer en valgskjerm med trinn («Før skolestart», «1. trinn og høsten i 2.» …), teksten «Noen få oppgaver, to på hvert nivå», telleren «Oppgave 3 av 10» og skjermen «Du starter på nivå 9». Alt dette går bort. Det første oppdraget i en stige ser ut som et vanlig oppdrag og finner nivået selv.
Slik:
- Oppdraget starter på nivå 1 og hopper lenger for hvert riktige svar: 1, 2, 4, 8, 16, 32 (begrenset av toppnivået). Én oppgave per prøve.
- Ved første gale svar søkes det binært mellom siste riktige nivå (lo) og første gale (hi) til de ligger inntil hverandre, én oppgave per prøve. Barnet lander på lo.
- Slå fast: to oppgaver på lo. Går én av dem galt, flytt ett nivå ned og prøv igjen, høyst to ganger. Aldri under nivå 1.
- Resten av oppdraget, opp til minst 8 oppgaver (5 på nivåer med lengde 5), er vanlige oppgaver på nivået barnet landet på, så oppdraget slutter med oppgaver barnet får til. Oppdraget kan bli opptil 14 oppgaver for de eldste. Framdriftslinja vises uten tall i dette oppdraget; «Oppgave n av m» kommer fra og med neste oppdrag.
- Resultatskjermen er den vanlige, med stjerner for riktige svar, pluss én linje: «Reven fant plassen din: Det blå havet, nivå 9! 🌊». Ordene «test» og «plassering» finnes ikke i noe barnet ser. Nivået settes med settNivaa som i dag, og oppgavene i oppdraget går inn i husk-lista.
- Gjelder alle fem stigene som har plassering i dag (matte, lesing, klokke, geografi, engelsk). Skrive riktig og Språk starter på nivå 1 som før.
- Voksensiden beholder «Sett nivå» og får «La reven finne nivået på nytt», som nullstiller plassert for faget.
- Simuler før du bygger i appen (det er plassering.js som byttes ut), og behold testene for stegPlassering bare om funksjonen fortsatt brukes.
Akseptansetester:
1. Simulering med fast frø, barn på hvert nivå 1–38 (92 % riktige til og med sitt nivå, 55 % på nivået over, 15 % høyere), 3000 barn per nivå: minst 55 % plasseres innen ±1 nivå, høyst 15 % mer enn ett nivå for høyt, oppdraget er 8–14 oppgaver, og minst 70 % av oppdragene slutter med to riktige.
2. Samme simulering for en stige med 9 nivåer og lengde 5: 5–9 oppgaver, minst 75 % innen ±1.
3. I appen: ny profil, trykk på Matte, svar riktig på alle: oppdraget slutter på nivå 38 og resultatskjermen sier «Reven fant plassen din». Ingen skjerm underveis inneholder «test», «plassering», «trinn» eller «av 10».
4. En profil som er plassert fra før, får ikke dette oppdraget.

ETAPPE T – INNFØRING I KUNNSKAPSSTIGENE (geografi, engelsk, klokka)
I dag: En femåring som åpner geografi, får fem flagg den aldri har sett, og 0 av 5. Geografi, engelsk og klokka har verken «Lær først»-kort eller hjelpeknapp (task.hjelp finnes bare i matte og lesing). Matte kan et barn resonnere seg til; flagg, hovedsteder, ord og klokkeslett må vises først.
- Ny oppgaveform «vis»: ett bilde med navn, lest høyt, og én knapp («Neste»). Flagg: flagget og «Dette er flagget til Sverige». Kart: landet markert og «Dette er Sverige». Hovedstad: flagget og «Stockholm er hovedstaden i Sverige». Klokke: klokka tegnet og «Klokka er tre». Engelsk: bildet, ordet og engelsk stemme. Vis-oppgaver teller alltid som riktige og gir ikke feil.
- Appen husker per fag hva barnet har fått vist (fag.kjent, en liste med nøkler som «land:se», «ord:cat», «tid:3:00»). Lista følger synkroniseringen.
- Når et oppdrag bygges på et nivå i en kunnskapsstige, erstattes spørsmål om ting barnet ikke kjenner med vis-oppgaver, høyst tre nye per oppdrag, og hver vis følges av et spørsmål om det samme innen to oppgaver. Spørsmål stilles bare om kjente ting, og svaralternativene hentes blant kjente ting; er det færre enn fire kjente, brukes to eller tre alternativer. Når alt på nivået er kjent, er oppdragene som i dag.
- Det første oppdraget i en kunnskapsstige (etappe S) starter med én vis og ett spørsmål om det samme, så første svar blir riktig uansett alder. Deretter går plasseringen som i etappe S. Bommer barnet på nivå 1, blir resten av oppdraget innføring etter reglene over, og oppdraget gir tre stjerner når det er fullført.
- Hjelpeknapp på kunnskapsoppgaver: «👀 Vis meg» viser svaret med navn (flagget, landet på kartet, ordet, klokka). Den teller som hjelp, som i matte: oppgaven teller ikke, men barnet kommer videre.
- Et barn som kan tingene fra før (åtteåringen), merker lite: to trykk i starten, og vis-oppgaver bare for det den faktisk bommer på senere (en bom på et ukjent kort markerer det som ukjent igjen, så det blir vist neste gang).
Akseptansetester:
1. Ny profil i geografi, alle svar gale: ingen oppgave i første oppdrag spør om et flagg barnet ikke har fått vist, første svar er riktig, oppdraget gir tre stjerner, og barnet står på nivå 1 med minst tre kjente land.
2. Ny profil i geografi, alle svar riktige: etter plasseringen har barnet nivå 9, og de to første oppgavene var vis og spørsmål om samme land.
3. 500 oppdrag på geografi nivå 2 med fag.kjent tom: hvert oppdrag har høyst tre vis-oppgaver, hvert spørsmål handler om et kjent land, og alle svaralternativer er kjente land.
4. I appen: «👀 Vis meg» på en flaggoppgave viser riktig flagg med navn, og oppgaven telles ikke.
5. Klokka og engelsk: samme som 1 og 3.

ETAPPE U – FORMER OG FARGER INN I MATTE
I dag: «Former og mønster» og «Farger» er rester av den første versjonen. De kjører på QuizEngine og Patterns med egen framgang (data.best), gir ingen kort, teller ikke i Dagens økt og vet ikke om stigene. Former nivå 1 viser svaret i svarknappen (spørsmålet viser ⚫, knappen «Sirkel» viser ⚫). Mønster og sortering er det eneste i appen som øver mønster og størrelse.
- Lag nye oppgavetyper i matte: monster_neste (hva kommer neste i et mønster av to eller tre figurer, svarform valg med bilder), sorter_storrelse (sorter tre–fire ting fra minst til størst, svarform sorter), form_navn (hvilken form, svaralternativene er bare navn, ikke bilder), farge_navn (hvilken farge, farget rute i spørsmålet og navn som svar), tell_former (hvor mange trekanter ser du).
- Legg dem inn på matte nivå 1–4 med passe vekt (høyst to av åtte oppgaver per oppdrag er form eller farge). Lag ett «Lær først»-kort om mønster.
- Fjern Former og Farger fra forsiden, topics.js, QuizEngine og Patterns når de nye typene er på plass. Stjernene barna har fått der, beholdes (de ligger i stars). Gamle data.best kan bli liggende i profilen; den skal ikke krasje noe.
Akseptansetester:
1. Ingen oppgave av typen form_navn eller farge_navn har et svaralternativ som inneholder samme bilde som spørsmålet.
2. 400 oppdrag på matte 1–4: høyst to oppgaver per oppdrag er mønster, sortering, form eller farge, og alle fem typene forekommer.
3. Forsiden har ingen knapp for Former eller Farger, og en profil med data.best åpner uten feil.

ETAPPE V – SAMLINGEN FORKLARER SEG SELV, OG ALLE STIGER GIR KORT
I dag: Kort gis bare for mattenivåer (kortPerNivaa i MatteStige). Grå kort gjør ingenting ved trykk, og «Nivå 1» betyr mattenivå 1 uten at det står noe sted. Lesing, klokke, geografi og engelsk gir bare bonuskort.
- Reven sier øverst i Samlingen: «Du får et kort hver gang du klarer et nivå med tre stjerner, eller går opp et nivå.»
- Trykk på et grått kort viser et lite vindu: hvilket fag og nivå kortet hører til, hva som trengs, og en knapp som tar barnet dit («Til matte nivå 1»). Er nivået passert, sier vinduet at barnet kan spille nivået om igjen på kartet.
- Hver stige får sitt sett, ett kort per nivå, med samme regel som matte: Lesing 12 kort (bokstaver og dyr), Skrive riktig 4, Språk 3, Klokka 8 (klokker og tider), Geografi 9 (flagg og landemerker, bruk flaggbildene), Engelsk 10 (ord med bilde). Kortene har navn, bilde og én faktalinje, merket utkast.
- Settene i Samlingen grupperes per fag. Tellingen «x av y kort» gjelder alle. Sjefsoppgave som gir hopp, gir kortene for nivåene den hopper over, i alle stiger.
Akseptansetester:
1. Nivå opp på Geografi 3 gir geografikortet for nivå 3. Tre stjerner på Lese 5 gir lesekortet for nivå 5. Ingen kort gis to ganger.
2. I appen: trykk på et grått kort åpner vinduet med riktig fag og nivå, og knappen navigerer dit.
3. Eksisterende profiler beholder kortene de har.

ETAPPE W – REVEN KAN HA PÅ FLERE TING (spør meg først)
I dag: Profilen har én plass for kostyme (data.kostyme). Kjøp tar av det forrige. Reven er emojien 🦊 med en mindre emoji oppå. Jeg vil velge mellom to løsninger. Legg fram begge med ett skjermbilde hver (kan være en skisse), så sier jeg hvilken:
A. Tegnet rev (SVG) med plasser: hode, øyne, hals, hånd og kropp. Alle ti kostymene har en plass, flere kan være på samtidig, og reven vises stor på forsiden, i Samlingen og i Hagen. Emoji-reven byttes ut der den er maskot (Mascot, Fox i Kart.jsx, forsiden).
B. Emoji-rev med to plasser: hode (lue, flosshatt, krone, romhjelm) og ansikt eller hånd (briller, sløyfe, skjerf, tryllestav, gitar, kappe). Kjøp setter tingen på sin plass og tar bare av det som lå på samme plass.
Felles: data.kostyme blir en liste (data.kostymerPaa). Gamle profiler med ett kostyme migreres. Teksten i garderoben sier hva som skjer ved kjøp.
Akseptansetest: Kjøp av lue og briller gir begge på. Kjøp av krone tar av lua, ikke brillene. Gammel profil med kostyme «lue» har lua på etter oppdatering.

ETAPPE X – INNHOLD
X1. Lesetekster
- Tekstnivåene (Lese 8–12 og Engelsk 8) husker tekstene som spørsmålene: tekst-id i husk-lista, og nye tekster velges før tekster barnet nettopp hadde.
- Skriv åtte nye tekster til hvert av Lese 10, 11 og 12 (merk utkast), med tre spørsmål hver og like lange svaralternativer. Lese 8 og 9 får hver sine tekster: nivå 8 bruker tekstene på 40–80 ord, nivå 9 bare dem over 80. Skriv seks nye på 90–130 ord til nivå 9.
X2. Kartene
- Afrika-kartet spør i dag etter 33 land, også Den sentralafrikanske republikk, Guinea og Kongo. Velg 10–12 kjente land per verdensdel for hånd (Afrika: Egypt, Marokko, Algerie, Nigeria, Etiopia, Kenya, Tanzania, Sør-Afrika, Madagaskar, Kongo-Kinshasa, Somalia, Mali; Asia og Amerika tilsvarende). Resten kan vises i «Utforsk kartet».
X3. Småting
- Skrive riktig: feilsvarene «egge» (egg) og «bukke» (bukk) er ekte ord, «sommar» og «dei» er nynorsk. Bytt dem.
- Engelsk fyll inn: «I put the key in the ___» viser 🔑, svaret er door. Bruk 🚪.
Akseptansetester:
1. Fire oppdrag på rad på Lese 10: ingen tekst kommer igjen før alle er brukt.
2. Lese 8 og 9 har ingen felles tekster. Lese 10–12 har minst 16 tekster hver.
3. Afrika-kartet spør etter høyst 12 land, og alle er minst 24 × 24 punkter ved bredde 390.
4. Ingen feilsvar i Skrive riktig står i ordlista over bokmålsord som brukes i testen fra etappe M, og listen utvides med egge, bukke, sommar og dei.

ETAPPE Y – SMÅFEIL
- «Du har klart hele stigen!» vises hver gang paaRad når to på toppnivået, altså annenhver gang. Vis den én gang (lagre toppKlart i faget) og vis deretter et lite merke på startskjermen («🏆 Hele stigen klart»).
- «Overraskelse» deles midt i ordet på kortet i Dagens økt på 390-skjerm, og overskriften «Dagens økt» brytes over to linjer. Mindre skrift på kortene, eller «Gave» som navn på kortet.
- Service workeren venter med å ta over til alle 92 flaggene er hentet (hentSkall i install). Hent skallet og skriptene i install, og flaggene etter activate, så appen er klar uten nett etter noen sekunder også på dårlig nett.
- Kartdataene ligger i hovedpakken (265 kB komprimert). Last topo.js og kartene først når geografi åpnes (dynamisk import).
Akseptansetester:
1. Toppnivået: 8 av 8 fire ganger gir meldingen én gang, og startskjermen viser merket etterpå.
2. Ved bredde 390 står «Overraskelse» på én linje eller er byttet ut, og «Dagens økt» står på én linje.
3. Service workeren er aktiv før flaggene er hentet (test med en fetch som venter).
4. Hovedpakken er mindre enn 200 kB komprimert, og geografi virker som før.

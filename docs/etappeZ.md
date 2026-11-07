# Etappe Z – Plasseringen måler nivået (runde 6)

## Endret

- **Hvert nivås egne ting** (`src/lib/nivaaTing.js`). En «ting» er kjent-nøkkelen på en oppgave. Et nivås egne ting er dem som først opptrer på nivået: Norden eier flaggene (nivå 1), hovedstedene (2) og kartet (3); Europa-nivåene eier landene utenfor Norden; verdensnivåene landene utenfor Europa og verdensdelene; Klokka 4 eier kvart over og kvart på, ikke hele timer. Kartleggingen trekker oppgaver fra hvert nivås generatorer med fast frø og huskes per stige. Nivåer uten egne nøkler (Klokka 2 «still på hele timer», Klokka 6 «still til fem minutter», Engelsk 9 «Spell it», Engelsk 10 «Make a sentence») kjennes på at de har nye oppgavetyper: der er en prøve egen når den kommer fra en ny type og ikke handler om noe eldre enn nivået under (Klokka 6 stiller til fem minutter, ikke til hele timer). `egneTing`, `alleTing`, `forsteNivaa`, `erEgen`, `kjenteAvNivaa`.
- **Nøkler per ferdighet i geografi** (AA2, tatt nå fordi Z trenger det): «flagg:se», «kart:se», «hovedstad:se», «verdensdel:se» i stedet for «land:se» for alt. Uten dette hadde Geografi 3, 6 og 9 (kartnivåene) ingen egne ting. Gamle kjent-lister migreres i `normalize` og `mergeData` (`migrerKjent`): «land:xx» blir «flagg:xx». Vis-kortet viser alt tingen slik den spørres om (kart for kart, flagg for flagg).
- **Prøvene** (`forsteOppdrag.js`, `oppgaveTilPlassering` med `egen: true`): vanlige spørsmål fra nivået uten kjent-fortrinn og med vanlige feilsvar (minst tre når bunken har nok), alltid om nivåets eget innhold. Gjelder fasene opp, søk og slå fast. Første oppgave er fortsatt vis + spørsmål om det samme, men spørsmålet har vanlige feilsvar (fire alternativer i stedet for 50/50). Et riktig svar på en prøve gjør tingen kjent med én gang, så fyllingen vet om det.
- **Slå fast og fyll** (Z2). Når nivået er funnet, fylles resten av oppdraget som et vanlig kunnskapsoppdrag på nivået (`byggKunnskapsOppdrag`): spørsmål om det barnet kjenner, og vis + spørsmål om høyst tre nye ting. `byggKunnskapsOppdrag` tar nå `foer` (oppgavene som alt er stilt), så ingen oppgave stilles to ganger, og følger emneregelen: høyst to spørsmål om samme ting, aldri to på rad (vis + spørsmål om det samme unntatt). Vis-kort teller ikke i de to, så en ting barnet bommet på i en prøve kan vises og spørres om igjen. Prøvene følger samme regel: helst et emne som ikke har vært med, aldri et emne tre ganger, aldri samme emne som oppgaven rett før. Finnes ingen oppgave som holder reglene, blir oppdraget heller kortere (Norden har fem land, så det første oppdraget på Geografi 1 blir 6–8 oppgaver).
- **Framdrift** (Z3): linja uten tall går aldri bakover. `svarForste` husker den høyeste verdien (`st.fram`), og `framdriftForste` gir aldri mindre.
- Klokkegeneratorene husker tidslistene (`tider`, `tider24`) i stedet for å bygge dem for hver oppgave; det gjorde simuleringene tjue ganger raskere.

## Testet

- `src/lib/__tests__/etappeZ.test.js`:
  - Egne ting: geografi (Norden-flaggene på 1, hovedstedene på 2, kartet på 3, 22 flagg utenfor Norden på 4, «kart:de» men ikke «kart:no» på 6, «flagg:us» og «verdensdel:no» men ikke «flagg:dk» på 7, «hovedstad:us» på 8, «kart:br» på 9), klokka (12 hele timer på 1, ingen på 2, bare :30 på 3, 24 kvarter på 4, 96 på 5, 288 på 7; «still på hele timer» er egen på nivå 2, «les hele timer» ikke; på nivå 6 bare still til fem minutter; på nivå 4 bare kvart over/på), engelsk (20 ord på 1, 16 på 2, setninger på 5, fyll inn på 6, spørsmål på 7, Spell it kjennes på typen). `oppgaveTilPlassering` med `egen` gir egne prøver med minst fire alternativer på alle nivåer i alle tre stigene.
  - Akseptansetest 1 (300 barn per stige, «kan ingenting»): nivå 1 eller 2 i minst 90 %; utenom prøvene bare innføring eller vis + spørsmål. Målt: geografi 97 %, klokka 99 %, engelsk 96 %.
  - Akseptansetest 2 (300 barn per nivå, «kan til og med nivå k»): innenfor ±1 geografi 77 %, klokka 79 %, engelsk 65 %; for høyt (to eller flere) 4 %, 4 % og 15 %. Ingen prøve på nivå n om en ting som først opptrer lavere (sjekket med `erEgen` og `forsteNivaa` for hver prøve i hvert oppdrag). Engelsk k = 7 og 8 er svakest (31 % og 20 %): barnemodellen regner ordene på Spell it som kjent fra nivå 1–4, så den «kan» stave, og plasseres på 9–10.
  - Akseptansetest 3: i hvert simulert oppdrag: ingen oppgave to ganger, høyst to spørsmål om samme ting, aldri to på rad, alle prøver med minst fire alternativer der bunken har minst fire ting. Pluss: et barn som kjenner én ting fra før, får ikke bare spørsmål om den.
  - Framdriften øker i hvert steg i alle simulerte oppdrag (Z3).
- `src/__tests__/app/klokkeplassering.app.test.jsx` (akseptansetest 4, i appen): ny profil åpner Klokka, svarer riktig bare på hele timer (klokka er tegnet som knapper i testen, så viserne kan «dras»): «Reven fant plassen din … nivå 1» eller 2, prøvene over nivå 2 handlet om halve timer eller kvarter, ingen oppgave to ganger, hele timer utenom prøvene var vist først.
- Runde 5-testene (etappe T) oppdatert til de nye geografinøklene. 355 tester grønne, bygget går (hovedpakken 177,8 kB gzip).

Målt før og etter (appens egne funksjoner, 1000 barn):

| Barn | Før | Etter |
|---|---|---|
| Kan bare hele timer, klokka | nivå 6 i 85 % | nivå 1: 28 %, nivå 2: 70 %, over 2: 3 % |
| Kan flaggene i Norden, geografi | nivå 3 eller høyere i 48 % | nivå 1: 93 %, nivå 3 eller høyere: 3 % |
| Kan ingenting, geografi | nivå 7–8 i en tredel | nivå 1–2 i 97 % |
| Samme spørsmål tre ganger i første oppdrag, klokka | 65 % | 0 % |

## Prøv selv

- Ny profil, Klokka: svar riktig bare når klokka viser hel time. Du skal lande på nivå 1 eller 2, og prøvene på vei opp skal være halve timer og kvarter, ikke «Hva er klokka? → 9».
- Ny profil, Geografi: etter «Dette er flagget til …» kommer spørsmålet med fire land å velge mellom, og hovedstad-prøven handler om et annet land.
- Følg linja uten tall gjennom et første oppdrag: den skal aldri gå bakover, heller ikke når oppdraget blir lengre fordi reven viser nye ting til slutt.
- En gammel profil med kjente land fra før: flaggene er fortsatt kjent (ingen vis-kort for dem), kartet over Norden viser landene først.

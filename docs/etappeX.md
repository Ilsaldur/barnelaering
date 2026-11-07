# Etappe X – Innhold (runde 5)

## X1 Lesetekster

- **Tekstene huskes som spørsmålene.** `huskOppgaver` legger også en hash av tekst-id-en («tekst:<id>») i fagets husk-liste. På tekstnivåene (Lese 8–12) velger `velgTekst` i `src/lib/lesing/generatorer.js` først tekster barnet ikke nettopp hadde, ellers den det er lengst siden. For vanlige oppgaver med `tekstId` (Engelsk 8) regner `velg` i `oppdrag.js` teksten som nylig brukt om tekst-hashen står i lista. Sjefsoppgaver på tekstnivåene bruker samme liste.
- **Lese 8 og 9 har hver sine tekster.** Nivå 8 bruker tekstene på 40–80 ord, nivå 9 bare dem over 80 (`minOrd: 81` i nivådataene; `tekst_sporsmaal` bruker nå samme `tekstPool` som tekstoppdragene). Seks nye tekster på 99–107 ord til nivå 9 (bever, sykkeltur, nordlys, bibliotek, maurtue, konsert), hver med tre faktaspørsmål og ett fakta-eller-mening-spørsmål. UTKAST.
- **Lese 10–12:** åtte nye tekster per nivå (slutning, ordforråd, hovedtanke), 120–135 ord, tre spørsmål hver med like lange svaralternativer. UTKAST. Nivåene har nå 16 tekster hver.

## X2 Kartene

- `KART_UTVALG` i `src/lib/geo/kart.js`: Afrika spør etter 12 land (Egypt, Marokko, Algerie, Nigeria, Etiopia, Kenya, Tanzania, Sør-Afrika, Madagaskar, Kongo, Somalia, Mali), Asia 12 (Kina, Japan, India, Russland, Thailand, Saudi-Arabia, Mongolia, Kasakhstan, Iran, Pakistan, Irak, Afghanistan), Amerika 10 (USA, Canada, Mexico, Brasil, Argentina, Chile, Peru, Colombia, Bolivia, Venezuela). Alle er minst 24 × 24 punkter ved bredde 390. «Utforsk kartet» viser fortsatt alle land som er store nok (`kartPool(region, { alle: true })`, `visAlle` på kartet).

## X3 Småting

- Skrive riktig: «egge» → «eggg», «bukke» → «bukh», «sommar» → «sommerr», «dei» → «deeg».
- Engelsk fyll inn: «I put the key in the ___» viser 🚪.

## Testet

`src/lib/__tests__/etappeX.test.js`: 1) fire oppdrag på rad på Lese 10 (ti frø): åtte ulike tekster, ingen kommer igjen; husk-lista inneholder tekst-hashen og `velgTekst` foretrekker ubrukte; Engelsk 8 husker tekstene; 2) Lese 8 og 9 har ingen felles tekster, nivå 9 bare over 80 ord, Lese 10–12 har minst 16 tekster med gyldige spørsmål, de seks nye nivå 9-tekstene er på 90–130 ord; 3) Afrika, Asia og Amerika spør etter 10–12 land, alle minst 24 × 24, og Utforsk har flere; 4) ingen feilsvar er et ekte ord; døra. Ordlista i M-testen er utvidet med egge, bukke, sommar og dei. Testen for Lese 10–12 fra runde 2 (120–200 ord) og K-testen for svarlengder gjelder også de nye tekstene.

## Prøv selv

- Lese 10 fire ganger på rad: nye tekster hver gang.
- Lese 9: lengre tekster med «fakta eller mening?».
- Geografi 9, Afrika: bare kjente land. «Utforsk kartet» viser alle.

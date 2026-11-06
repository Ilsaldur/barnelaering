# Plan, runde 4 (tilbakemelding etter test 6. november 2026, etter runde 3)

## Status

| Etappe | Status | Sist oppdatert |
|--------|--------|----------------|
| L – Gjentakelser (viktigst) | Ferdig og pushet. Se `docs/etappeL.md`. | 2026-11-06 |
| M – Mer innhold der bunken er liten | Ikke startet. | |
| N – Mobil og tallinje | Ikke startet. | |
| O – Still klokka | Ikke startet. | |
| P – Flagg, plassering og småfeil | Ikke startet. | |
| Q – Korrektur | Ikke startet. | |

---

## Oppdraget (originalmeldingen, uendret)

Du jobber videre på Selmas skole (selmasskole.vercel.app). Runde 3 (etappe F–K) er testet i den publiserte appen 6. november, og rettingene virker. Denne prompten retter det testen fant. Det viktigste: samme spørsmål kommer for ofte igjen, særlig i geografi og engelsk.

Der denne prompten og tidligere prompter sier ulike ting, gjelder denne.

ARBEIDSMÅTE
- Ta etappene i rekkefølge. Stopp etter hver med en kort oppsummering: hva som er endret, hva som er testet, og hva jeg bør prøve selv.
- Skriv en test for hver akseptansetest. Der det står «i appen», testes det gjennom komponentene.
- Eksisterende framgang skal ikke gå tapt.
- Nytt innhold merkes som utkast til jeg har lest det.

ETAPPE L – GJENTAKELSER (viktigst)
I dag: buildMission trekker hver oppgave tilfeldig. Filteret mot like oppgaver (nøkkel i oppdrag.js) har oppgavetypen med i nøkkelen, så samme spørsmål fra to nivåer regnes som ulike (flagg_norden og flagg_europa). oppgaveTilPlassering har ikke noe filter. Ingenting huskes fra oppdrag til oppdrag. På nivå 1 hentes repetisjonen fra nivå 1, så sju av åtte oppgaver kommer fra nivåets egen bunke. På toppnivået hentes smakebiten fra toppnivået. Målt med appens egne funksjoner: på Geografi 1 (ti ulike spørsmål) kommer ett spørsmål minst tre ganger på tre oppdrag i 100 % av øktene, på Engelsk 7 (atten ulike) i 73 %. Samme spørsmål står to ganger i samme oppdrag i 19 % av oppdragene på Klokka 3 og 12 % på Matte 5.

L1. Lik oppgave er det barnet ser
- Nøkkelen bygges av spørsmålstekst, bilde eller markering, fasit og ordet som leses opp. Oppgavetype og nivå er ikke med.
- Samme nøkkel brukes i oppdrag, sjefsoppgave, «Prøv selv» og plasseringstest.

L2. Emne
- Generatorene setter feltet emne der det gir mening: landet i geografi, ordet eller setningen i engelsk, lesing, Skrive riktig og Språk, klokkeslettet i Klokka. Matte trenger det ikke.
- Samme emne kommer høyst to ganger i ett oppdrag og aldri i to oppgaver på rad. I Skrive riktig kommer et ord høyst én gang per oppdrag. I dag kan «stein» først skrives og så komme som «Hvilket ord er riktig skrevet?».
- Regelen viker når nivået har for få emner til å fylle oppdraget.

L3. Husk det siste
- Hvert fag lagrer en kort hash av nøkkelen til de 40 siste oppgavene barnet har fått, også fra plasseringstest og sjefsoppgave. Lista følger med i synkroniseringen.
- Når en oppgave skal lages, prøves det opptil 30 ganger å finne en som ikke står på lista. Finnes ingen, velges den det er lengst siden barnet fikk.

L4. Små nivåer, nivå 1 og toppnivået
- Nivåer med færre enn 20 ulike spørsmål får fem oppgaver per oppdrag (lengde 5, grensene for fem finnes fra før): tre egne, én repetisjon og én smakebit. Regn antallet ut fra innholdet, så regelen følger med når innholdet vokser. I dag gjelder det Geografi 1, 2, 3 og 9, Språk 2 og Engelsk 7.
- På toppnivået byttes smakebiten med en repetisjonsoppgave fra et lavere nivå.

Akseptansetester (simulering med fast frø, alle stiger og nivåer):
1. Ingen oppdrag, sjefsoppgaver eller plasseringstester inneholder to oppgaver med samme nøkkel, så lenge nivåene som er med, har nok ulike spørsmål.
2. Tre oppdrag på rad på samme nivå: på nivåer med minst 30 ulike spørsmål kommer ingen oppgave to ganger. På mindre nivåer kommer ingen oppgave tre ganger før alle nivåets spørsmål er brukt.
3. Geografi nivå 1, plasseringstest fra Norden og tre oppdrag: ingen oppgave kommer mer enn to ganger.
4. Skrive riktig: samme ord står aldri to ganger i ett oppdrag.

ETAPPE M – MER INNHOLD DER BUNKEN ER LITEN
Skriv nytt innhold og merk det som utkast.
- Engelsk nivå 7: SPORSMAAL har 8 spørsmål. Skriv minst 30 til. Hvert spørsmål har ett svar som passer og tre som tydelig svarer på noe annet. Bruk ord fra ordlistene og vanlige småord.
- Engelsk nivå 6: FYLL_INN har 10 setninger. Skriv minst 30 til.
- Engelsk nivå 5: SETNINGER har 15. Skriv minst 25 til.
- Språk nivå 2: BOYING har 12 oppgaver. Skriv minst 30 til (entall og flertall, nåtid og fortid, gradbøying).
- Skrive riktig: 10–12 ord per gruppe. Skriv opp til minst 25 per gruppe. Feilsvar skal ikke være ekte ord.
- Geografi Norden (nivå 1–3): fem land gir 10–15 spørsmål per nivå. Legg til flere spørsmålsformer på nivå 2 og 3, for eksempel flagg → hovedstad, hovedstad → flagg og «Hva er hovedstaden i landet som er markert?».
- Geografi nivå 9: verdenskartet spør bare etter åtte land. Lag kart som zoomer inn på én verdensdel om gangen (Amerika, Afrika, Asia og Oseania), og spør etter alle land som er minst 24 × 24 punkter på det zoomede kartet ved bredde 390. Verdenskartet beholdes for de åtte store.
- Klokka nivå 1–2 og Matte 9, 10, 12 og 13 har også små bunker. Der er gjentakelse meningen, og de trenger bare etappe L.
- Engelsk slutter på nivå 7. Et barn som kan engelsk, kommer til topps etter åtte svar i plasseringstesten. Foreslå to–tre nye nivåer øverst, men ikke bygg dem før jeg har sagt ja.
Akseptansetest: Etter etappe M har Engelsk 5, 6 og 7, Språk 2, Skrive riktig 1–4 og Geografi 9 minst 40 ulike spørsmål hver, og Geografi 2 og 3 minst 20.

ETAPPE N – MOBIL OG TALLINJE
I dag: På skjermer smalere enn rundt 400 punkter stikker «Geografistigen» ut av knappen sin under Fri lek, og forsiden kan rulles sidelengs. Siden er 8 punkter for bred på 390 og 23 på 360. «Eventyrkartet», «Klokkestigen» og «Engelskstigen» klippes mot kanten av knappene. Menyen under Former og mønster («Hva kommer neste?» og «Sortér etter størrelse») er 24 punkter for bred på 390. Stripen med ti ruter i kortet «Desimaltall» klippes i kortet og stikker ut av skjermen når løsningen vises etter to feil.
- Ingen skjerm skal være bredere enn skjermen. Lange ord i knapper brytes eller krympes.
- Høyttalerknappen er 25–32 punkter på mobil. Gjør trykkflaten minst 44 × 44.
- Tallinja i hjelpen og i «Lær først»-kortene er bredere enn kortet og starter alltid på 0. På mobil synes 0–6 og på nettbrett 0–13, så hoppet som forklares (for eksempel 8 + 2 = 10 og så 3 til), ligger utenfor. Når tallinja åpnes, rulles den slik at starttallet står til venstre i det synlige feltet. Vis tydelig at linja fortsetter når ikke alt får plass.
Akseptansetester:
1. I appen ved bredde 320, 360, 390 og 412 har forsiden, alle stigenes startskjermer og kart, én oppgave av hver svarform med hjelpen åpen, løsningen etter to feil, resultatskjermen, menyene under Farger og Former og voksensiden scrollWidth lik clientWidth, og ingen knappetekst stikker ut av knappen sin.
2. Ved bredde 360 med hjelpen åpen på 7 + 4 er både 7 og 11 synlige uten rulling.

ETAPPE O – STILL KLOKKA
I dag: Timen regnes ut idet den korte viseren slippes, med minuttene som står der da (timeFraVinkel). Setter barnet den korte viseren først, slik instruksen sier, blir timen feil for alle tider fra halv og utover. 0 av 12 halve timer og 72 av 144 femminutterstider godtas, også når viseren står der en ekte klokke har den. Med den lange viseren først godtas alle.
- I «Still klokka» tegnes den korte viseren der barnet slipper den, i steg på 2,5 grader, og flyttes ikke av minuttviseren.
- Svaret er riktig når den lange viseren står på riktig minutt og den korte er mindre enn 12 grader fra riktig plass (time × 30 + minutter × 0,5).
- Ved feil viser forklaringen hvor den korte viseren skal stå. Klokkeslettet under «Du:» regnes ut fra vinkelen.
- Instruksen krever ingen rekkefølge: «Sett den lange viseren på minuttene og den korte på timen.»
Akseptansetester:
1. For alle 144 tider med fem minutters steg godtas den korte viseren på riktig plass, uansett hvilken viser som settes først.
2. «Halv 7» med den korte viseren rett på 7 eller rett på 6 godtas ikke. «Fem på 2» med den korte viseren rett på 2 godtas.

ETAPPE P – FLAGG, PLASSERING OG SMÅFEIL
P1. Flagg
- Flaggbildet i et spørsmål har landets navn som alt og title. Uten nett vises navnet der flagget skulle vært, og på PC viser musepekeren det. Bruk en nøytral tekst («flagg») til oppgaven er besvart. Det gjelder også flaggene som svaralternativer.
- Service workeren henter alle filene i /flagg/ når den installeres (53 filer, 424 kB).
Akseptansetest: Etter ett besøk og uten nett lastes flagget i en flaggoppgave. Før svaret finnes ikke landets navn i alt, title eller aria-label på flaggbildene.

P2. Plasseringstesten
- Etter et fall til et lavere startnivå viser telleren «Oppgave 11 av 10». maksOppgaver regnes ut på nytt, mens telleren fortsetter. Tallet etter «av» skal aldri være mindre enn oppgavenummeret.
- I klokke, geografi og engelsk har alle startvalg toppnivået som tak. Etter et fall kan testen derfor klatre forbi nivået barnet nettopp bommet på. Etter et fall er taket nivået barnet falt fra.
Akseptansetest: Geografi fra Europa, feil på første oppgave, deretter alt riktig: plasseringen blir nivå 4, og oppgavenummeret er aldri høyere enn totalen.

P3. Toppnivået
- På toppnivået sier kartet fortsatt at alle riktige gir tilbud om sjefsoppgave, og 8 av 8 gir ingen melding. Vis en egen melding når barnet har klart toppnivået to ganger («Du har klart hele stigen!»), og fjern setningen om sjefsoppgave der.

P4. Tekster og bom-liste
- Etter en sjefsoppgave som ikke gikk, står det «neste gang du klarer alle fem» også i stiger med åtte oppgaver. Bruk lengden på nivåets oppdrag. Meldingen over («Det var vanskelig … Vil du prøve en gang til?») passer ikke etter en sjefsoppgave.
- «Du starter på nivå 9: Lengre tekster: fakta eller mening?.» Ikke sett punktum etter en tittel som slutter med spørsmålstegn.
- Bom-lista: for velg_regneart (matte 30), tall_10000 (matte 31) og likning (matte 38) lages ofte en annen type enn den barnet bommet på. Lag oppgaven fra riktig generator direkte.

ETAPPE Q – KORREKTUR
- Matte 36: «1 tideler skrives som desimaltall». Matte 37: «4 ruter langt og 1 ruter bredt».
- Lese 8, «Veien til skolen»: «en bakeri» skal være «et bakeri».
- Skrive riktig: feilsvaret «kval» (for hval) er et ekte ord, og «hai» står som feilsvar for «hei». Bytt dem.
- Lese 12: riktig svar er alene lengst i 54 % av spørsmålene. Tilfeldig ville vært 25 %. Jevn ut lengdene.
- Stein, tau, tannbørste, hjul og sel bruker emojier fra 2020–21 som eldre nettbrett kan vise som tomme ruter. Bytt der det finnes et eldre bilde som passer.

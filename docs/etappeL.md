# Etappe L – Gjentakelser (runde 4)

Status: ferdig på grenen `adaptiv-laering`. Bygg og tester grønne.

## Endret

- **Nøkkel (L1).** `nokkel(task)` i `src/lib/matte/oppdrag.js` bygges av spørsmålstekst, bilde eller markering (`visual`, eller kartregionen for trykk-på-kartet), fasit og ordet som leses opp. Type og nivå er ikke med, så samme flagg fra «Norden» og «Europa» er samme oppgave. Samme nøkkel brukes i oppdrag, sjefsoppgave, «Prøv selv» (LaerKort) og plasseringstest.
- **Emne (L2).** Generatorene setter `emne`: landet (geografi), ordet eller setningen (engelsk, lesing, Skrive riktig, Språk), klokkeslettet (klokke). Samme emne høyst to ganger per oppdrag og aldri i to oppgaver på rad; står to like ved siden av hverandre etter sorteringen, byttes eller lages den andre på nytt. Skrive riktig har `emneMaks: 1`. Regelen viker når nivået ikke har nok emner.
- **Husk-lista (L3).** Hvert fag har `sett`: FNV-hash (base 36) av nøkkelen til de 40 siste oppgavene, eldst først. Fylles etter oppdrag, sjefsoppgave og plasseringstest (`huskOppgaver`). Når en oppgave lages, prøves det opptil 30 ganger å finne en som ikke er brukt i oppdraget, holder emne-regelen og ikke står på lista. Finnes ingen, tas den som står lengst bak; finnes ingen som holder emne-regelen, viker den. Lista normaliseres (`normalize`) og flettes (`mergeFag`: nyeste side sist, resten foran, kappet på 40).
- **Små nivåer (L4).** `antallUlike(stige, nivaa)` teller ulike nøkler ved å trekke oppgaver fra nivået med fast frø (stopper ved 60), og huskes per stige. `oppdragLengde` gir 5 når det er færre enn 20 ulike spørsmål: i dag Geografi 1, 2, 3 og 9, Språk 2 og Engelsk 7 (testen låser denne lista). Fem oppgaver: 3 egne, 1 repetisjon, 1 smakebit. Startskjermen sier «Fem oppgaver» der det gjelder.
- **Toppnivået.** Smakebiten byttes med en repetisjon fra et av de fem nivåene under. Repetisjonsnivået trekkes på nytt for hvert forsøk, så små nivåer under belastes mindre.
- **Nivå 1.** Repetisjonen må fortsatt komme fra nivå 1 (det er ingenting under), men nøkkel, emne og husk-liste hindrer at samme spørsmål kommer igjen.
- **Matte uendret i praksis.** Matte setter ikke emne. Kort i bokser (nivåer med kortstokk) er planlagt repetisjon og styres av boksene som før; de andre oppgavene i oppdraget unngår kortene.

## Testet

`src/lib/__tests__/etappeL.test.js`, alt med fast frø over alle sju stiger:

1. Ingen oppdrag, sjefsoppgaver eller plasseringstester (alt riktig, alt feil, annenhver, fra alle startvalg) har to oppgaver med samme nøkkel.
2. Tre oppdrag på rad: på nivåer der alle nivåene som er med har minst 30 ulike spørsmål, kommer ingen oppgave to ganger. På mindre nivåer kommer ingen oppgave tre ganger før alle nivåets spørsmål er brukt. Kort i bokser telles ikke.
3. Geografi 1: plasseringstest fra Norden og tre oppdrag, 20 frø: ingen oppgave mer enn to ganger.
4. Skrive riktig 1–4, 40 oppdrag hvert: samme ord aldri to ganger.

I tillegg: nøkkel uten type/nivå, husk-liste (40, flytt fram, normalisering, fletting), emne i generatorene, emne-regelen på alle nivåer, lista over fem-oppgave-nivåer, toppnivå uten smakebit, «Prøv selv» med tre ulike. To eldre tester er oppdatert til de nye reglene (fem oppgaver på små nivåer, repetisjon på toppen).

## Prøv selv

- Geografi 1: ta plasseringstesten og tre oppdrag. Ingen flaggspørsmål bør komme mer enn to ganger, og oppdragene har fem oppgaver.
- Engelsk 7: oppdragene har fem oppgaver, og spørsmålene varierer fra oppdrag til oppdrag.
- Skrive riktig: samme ord kommer ikke både som «skriv ordet» og «hvilket er riktig skrevet» i ett oppdrag.
- Klokka 3: samme klokkeslett står ikke to ganger i et oppdrag.
- Eksisterende profiler beholder alt; den nye husk-lista starter tom.

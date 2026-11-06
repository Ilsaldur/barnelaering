# Etappe 1 – Rett opp det som er galt i dag

Status: ferdig på grenen `adaptiv-laering`, venter på OK. Bygg og 43 tester er grønne.

## Endringslogg

Utgangspunkt: lokal `main` (`da2fcc1`). Eventyrkartet er hentet tilbake fra produksjonsutgaven og rettet.

1. **Tallinja viser aldri fasit.** Tellebilder og tallinje ligger bak en «💡 Hjelp»-knapp som er av for hver oppgave. Haren står på startpunktet, barnet trykker på tall for å hoppe, og antall hopp vises. Tallinja vises bare når alle tall er innenfor 0–20 (ikke for «3 + 90»).
2. **Feilsvar som ligner ekte feil** (`src/lib/distractors.js`): ti for mye eller for lite (samme siste siffer), glemt tierovergang, feil regneart, sifrene byttet om; nabotabellen i gange; nære tall i telling. Aldri negative, aldri like.
3. **Ingen like oppgaver i samme runde** (`src/lib/round.js`), i alle motorer. Alle runder er nå åtte oppgaver (klokke og geografi var seks).
4. **Stjerner etter resultat** (`src/lib/scoring.js`): 0–3 riktige gir ingen, 4–5 én, 6–7 to, 8 tre. Felles resultatskjerm (`RoundDone`) uten konfetti, fanfare eller «Bra jobba!» under to stjerner. Mønsterspillet teller nå riktige på første forsøk i stedet for fast 2 stjerner; sorteringen har fått en «Sjekk»-knapp.
5. **Eventyrkartet** (`src/data/eventyr.js`, `AdventureMap.jsx`): stjerner bare når alle tre svar er riktige, bare én gang per sted, og fullførte steder lagres i profilen og synkes. Kartet er synlig på forsiden igjen.
6. **Nytt trinn mellom barnehage og 1. klasse**, som nivåer i stigene: «Flest eller færrest?» (to mengder, trykk på bildet), «Tell 1 til 20», «Størst og minst», «Før og etter til 20», «Hvilket tall mangler?» og «Pluss og minus 1–10». Den ubrukte Lett/Middels/Vanskelig-menyen er fjernet.
7. **Opplesing bak én funksjon** (`speech.speak` i `src/speech.js`) med `speech.setProvider(fn)` for egne opptak senere. 🔊-knapp på hver oppgave i alle motorer, og bryter for automatisk opplesing (av som standard) i aktivitetene og på voksensiden.
8. **Oppgaver uten lesing:** farger og former svares med bilder, «Bokstaver og lyder» viser ord som bilder, og alternativene leses opp i telling, farger, former og bokstaver.
9. **Nullstill bak voksensperre:** hold inne en knapp i tre sekunder og skriv årstallet (`AdultGate`). Gjelder hele voksensiden. Nullstill er flyttet fra «Mine stjerner» til voksensiden, med bekreftelse.
10. **Småfeil:** «Trylleskogen», «Bare 1 stjerne igjen!», klokka sier «Klokka er halv 9» (ikke «Klokka er Halv 9» eller «Klokka er Klokka er 7»), riktig melding første gang et sted klares, zoom er tillatt igjen.

Annet: Vitest 3 som dev-avhengighet (`npm test`). Ryddet bort `Campaign.jsx`, `campaign.js`, `LevelMenu.jsx` og klassetrinn-lista. Ordlista ligger nå i `src/data/ord.js`. README er oppdatert.

Ikke gjort, med vilje: to forsøk per oppgave og nivåregler (etappe 3), e-postlenke og tillatelsesliste (etappe 2).

## Prøv som 5-åring

- Trykk «Bare spill!», så «Tall og telling». Prøv «Tell 1 til 5»: trykk 🔊 og hør at tallene leses opp. Slå på «Opplesing på» nederst, så leses hver oppgave automatisk.
- Prøv «Flest eller færrest?»: svaret er å trykke på bildet.
- Gå til «Farger» og «Former»: svarene er fargeruter og figurer, ikke ord.
- «Pluss og minus» → «Pluss og minus, 1–10»: svar feil med vilje og se at tallinja ikke dukker opp av seg selv. Trykk «💡 Hjelp», hopp med haren og se at ingen tall lyser gult.
- Svar bare feil i en runde: ingen konfetti, ingen stjerne, bare «Prøv igjen».
- Eventyrkartet: trykk Trylleskogen. Svar ett feil og se at det ikke gir stjerner. Klar alt og få 2 ⭐, prøv igjen og se at det ikke gir mer.

## Prøv som 8-åring

- «Pluss og minus, 1–100»: se at feilsvarene ikke avslører svaret (f.eks. 47, 57, 37, 48 for 47). Se at Hjelp-knappen ikke vises for store tall.
- «Gange og deling» → «Hele gangetabellen»: feilsvar fra nabotabellen (6 × 7 → 42, 36, 48, 49).
- «Klokka» → «Til 5 minutter»: feil svar gir «Klokka er kvart over 3»-meldinger uten dobbelt «Klokka er».
- Få 8 av 8: tre stjerner, konfetti og «Neste nivå!»-knapp. Få 6: to stjerner. Få 4: én.
- «Mønster og sortering»: sorter, trykk «Sjekk». Feil første gang teller ikke, selv om du retter.
- «For voksne» nederst på forsiden: hold inne knappen i tre sekunder, skriv årstallet. Nullstill-knappen ligger der nå, ikke i «Mine stjerner».
- Prøv å zoome med to fingre på nettbrett: det skal gå.

## Kjente begrensninger

- Opplesing krever at enheten har en norsk stemme. iPad og Mac har det; Chrome på Windows avhenger av Windows-språkpakke. Uten stemme er 🔊-knappen skjult.
- Nettleserutvidelsen var ikke tilkoblet, så jeg har ikke klikket gjennom i en ekte nettleser. Røyktesten rendrer alle skjermer og nivåer, men berøring, drag og lyd må prøves på enheten.

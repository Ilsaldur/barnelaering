# Etappe 5 – Lesestigen

Status: kode ferdig på grenen `adaptiv-laering`. Bygg og tester grønne. **Innholdet er utkast og må leses gjennom av Jon** (se nederst).

## Endringslogg

- **16 nivåer i seks områder** (`src/data/lesing/nivaer.js`): Lyder og bokstaver (1–3, bokstavene i rekkefølgen i s o l e v a t b ø m å j r d u g n p y h f k æ), Lydering (4–5), Ord og setninger (6–7), Lese og forstå (8–9, fem oppgaver per oppdrag), Rettskriving (10–13: diftonger, kj/skj, dobbel konsonant, stum h og g, sammensatte ord), Språk (14–16: ordklasser, bøying, motsetninger og tegnsetting).
- **Samme regler som matte.** Oppdragsbyggeren og nivåreglene er gjort generiske (`buildMission(fag, { stige })`, terskler som andel av oppdragslengden), så nivå opp, hjelp, svake typer, sjefsoppgave og plassering virker likt. Oppdrag med tekster har fem oppgaver.
- **Oppgavetyper** (`src/lib/lesing/generatorer.js`): hør lyden og finn bokstaven (store og små), første lyd i ordet, stor og liten bokstav, trekk lydene sammen og finn bildet, les ordet og finn bildet, finn ordet til bildet, hør vanlige ord og finn dem skrevet, setning → bilde, tekst med spørsmål (fakta, mening, «fakta eller mening?»), skriv ordet du hører, hvilket ord er riktig skrevet, ordklasser, bøying, motsetninger, tegnsetting og stor bokstav.
- **Ny svarform «skriv»** med tekstfelt og «Hør ordet igjen». Nye visninger: bokstav, lydkort, ordkort, tekst med tittel.
- **Plasseringstest** med fem startvalg i ord barnet forstår («Jeg lærer bokstavene» … «Jeg leser godt og skriver»), ingen alder lagres.
- **Kartet** er generisk og viser lesestigen som seks fargede områder med reven på nivået.
- **Dagens økt** har nå Lesing-kortet (dukket opp automatisk da stigen ble registrert), og voksensiden viser nivå per fag med navn for lesing også.
- De gamle temaene «Bokstaver og lyder», «Ord og lesing» og «Motsetninger» er fjernet fra fri lek; lesestigen dekker dem.
- Tester: bokstavrekkefølgen, tekster 40–130 ord med gyldige spørsmål, feilskrivinger, alle 16 nivåer genererer gyldige oppgaver, oppdragslengde fem for tekstnivåer, nivåregler ved fem oppgaver, og røyktest av alle oppgavetyper.

## Innhold du bør lese gjennom (merket UTKAST øverst i fila)

Alt ligger i `src/data/lesing/innhold.js`:

- `BOKSTAVER`: eksempelord og bilde per bokstav. «ærlig» for æ er svak, bytt gjerne.
- `LYDRETTE_ORD`: 44 ord med bilde til lydering. Noen bilder er omtrentlige (elv, vase, tå).
- `VANLIGE_ORD`: 25 helord.
- `SETNINGER`: 20 setninger med riktig og tre feil bilder.
- `TEKSTER`: åtte tekster (reven, Ida og sykkelen, pingviner, matpakken, regnbuen, hytta med bestefar, maur, Mias tann) med to–tre spørsmål hver. Navn: Ida, Noah, Sara, Leo, Mia. Bytt gjerne til navn barna kjenner.
- `RETTSKRIVING`: ti–tolv ord per gruppe med feilskrivinger.
- `ORDKLASSER`, `BOYING`, `MOTSETNINGER`, `TEGNSETTING`, `STOR_BOKSTAV`.

Opplesing: bokstavlydene leses med «sss», «mmm» osv. for de lydene det går, ellers bokstavnavnet. Egne opptak kan kobles på senere via `speech.setProvider`.

## Prøv som 5-åring

- Trykk Lesing, velg «Jeg lærer bokstavene». Trykk 🔊 på oppgavene: «Hvilken bokstav sier sss? Som i sol.»
- Nivå 1–3: trykk på bokstaven. Noen oppgaver viser store bokstaver, noen små.
- Nivå 4: lydkortene «s – o – l» og fire bilder. Trykk på sola.

## Prøv som 8-åring

- Velg «Jeg leser bøker selv». Les teksten om pingviner og svar på spørsmålene. Legg merke til «Fakta eller mening?».
- Nivå 10–13: «Skriv ordet du hører», trykk «Hør ordet igjen», skriv med tastaturet. Feil første gang gir ett forsøk til, så vises riktig skrivemåte.
- Nivå 14–16: ordklasser, «Én bil, to ___», tegnsetting.
- Få 7 av 8 to ganger: nivå opp, som i matte.

## Kjente begrensninger

- Rettskriving krever tastatur (nettbrettets skjermtastatur kommer opp).
- Åtte tekster er få; etter noen dager vil barnet kjenne dem igjen. Legg til flere i `TEKSTER` når du har lest gjennom.

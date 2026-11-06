# Etappe H – Lesing (runde 3)

Status: ferdig på grenen `adaptiv-laering`. Bygg og tester grønne.

## H1 Opplesing i leseoppgaver

- I oppgaver der barnet skal lese selv (setning → bilde, tekster på Lese 8–12) leser stemmen bare instruksjonen og spørsmålet («Les setningen og finn bildet som passer.», «Les teksten og svar: …»). Det gjelder både automatisk opplesing og 🔊 ved oppgaven.
- Ny knapp **«📖 Les teksten for meg»** leser teksten. Den regnes som hjelp, så oppgaven teller ikke mot nivået. Knappen finnes ikke i plasseringstesten.
- `speech.setAuto` kalt av appen selv (når profilen velges eller lesenivået endrer seg) varsler ikke lenger, så `autoSpeakSet` settes bare av bryteren i en aktivitet og av valget på voksensiden. Dermed virker regelen om nivå 8.
- Meningsspørsmål er fjernet fra tekstene (tre spørsmål skrevet om til faktaspørsmål), så verken plasseringstesten eller oppdragene får dem.

## H2 Oppdrag på fem oppgaver

- Grenser ved fem oppgaver: 4–5 godt (paaRad + 1), 3 nøytralt, 0–2 svakt. Sjefstilbud ved 5 av 5. Skjermtekstene sier «alle fem» der det gjelder.
- På tekstnivåene (Lese 8–12) består et oppdrag av **to ulike tekster**: tre spørsmål til den ene og to til den andre. Ingen repetisjon eller smakebit. Sjefsoppgaven følger samme mønster (tre fra en tekst på nivået over, to fra målnivået). Tekster må ha minst så mange spørsmål som det bes om; «Mias første tann» fikk et tredje spørsmål.

## Testet

- **H1.1 i appen** (`src/__tests__/app/lesing.app.test.jsx`): Lese nivå 7 og 8 med opplesing på; alt som sendes til stemmen fanges opp, og ingen opplest tekst inneholder setningen eller teksten. Også: «Les teksten for meg» leser teksten og gjør at oppgaven ikke teller.
- **H1.2:** profil der ingen har rørt bryteren har `autoSpeakSet = false` etter første oppdrag.
- **H2.3:** Lese 9: 4 av 5 to ganger gir nivå opp; 3 av 5 to ganger gir ingen nedflytting.
- **H2.4:** oppdrag på Lese 10 (og 8, 9, 11, 12) har nøyaktig to ulike tekster, 3 + 2, uten repetisjon; sjefsoppgaven likeså.
- Ingen meningsspørsmål finnes i tekstene.

## Prøv selv

- Lese nivå 7 med opplesing på: stemmen sier «Les setningen og finn bildet som passer», ikke setningen.
- Lese nivå 8: teksten vises, spørsmålet leses. Trykk «Les teksten for meg»: teksten leses, og oppgaven gir «Riktig! 👍» i stedet for 🎉 (teller ikke).
- Lese nivå 10: fem spørsmål, tre til første tekst og to til den andre.
- 4 av 5 to ganger: nivå opp.

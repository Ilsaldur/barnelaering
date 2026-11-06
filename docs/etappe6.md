# Etappe 6 – Klokke, geografi, engelsk og ukeoversikt

Status: kode ferdig på grenen `adaptiv-laering`. Bygg og 173 tester grønne. Engelsk-innholdet er UTKAST.

## Endringslogg

- **Én felles stige for alle fag** (`Stige.jsx`): plassering, oppdrag, nivåregler, sjefsoppgave, kart og resultat er nå samme kode for matte, lesing, klokke, geografi og engelsk. Hvert fag er en konfigurasjon (nivåer, områder, generator, startvalg, ekstra knapper).
- **Klokkestigen** (`src/data/klokke/nivaer.js`, `src/lib/klokke/generatorer.js`): åtte nivåer. Hele timer, still klokka, halve timer, kvart over og kvart på, fem minutter med norsk klokkespråk («fem over halv fire», «ti på halv fire»), still klokka til fem minutter, digital mot analog, og tidsregning. Oppgaveformer: les klokka, velg riktig klokke blant fire, **still klokka** ved å dra viserne, digital → analog og analog → digital. Norsk klokkespråk og digital skrivemåte blandes aldri i samme oppgave (testet). «Øv: dra viserne» er beholdt som fri øving med både norsk og digital visning.
- **Geografistigen** (`src/data/geo/nivaer.js`, `src/lib/geo/generatorer.js`): ni nivåer. Flagg, hovedsteder og **et ordentlig kart å trykke på** for Norden, Europa og verden, pluss verdensdeler. Kartet (`VerdensKart.jsx`) tegnes fra Natural Earth-data (world-atlas, fri lisens) som ligger i repoet, uten eksterne biblioteker: egen TopoJSON-utpakking og Mercator-projeksjon i `src/lib/geo/topo.js`. Virker uten nett. «Utforsk kartet» viser flagg og hovedstad når barnet trykker på et land. 54 land i `src/data/geo/land.js`.
- **Engelskstigen** (`src/data/engelsk/`, `src/lib/engelsk/generatorer.js`): sju nivåer. Farger og tall, dyr, mat og ting i huset, kropp og klær, enkle setninger, fyll inn ordet, spørsmål og svar. Engelske ord leses opp med engelsk stemme (`speech.speak(text, { lang: 'en-GB' })`), instruksjonene er på norsk, og engelske svaralternativer har en liten 🔊.
- **Dagens økt** kan nå inneholde klokke, geografi og engelsk som egne kort eller som overraskelse, og alle teller som oppdrag.
- **Ukeoversikt på voksensiden**: denne uka dag for dag (runder, minutter, fag) og de fire siste ukene samlet.
- De gamle klokke- og geografirundene og temaene er fjernet; «Former og mønster» og «Farger» er igjen som fri lek.
- Tester: klokkespråk, alle klokke-, geografi- og engelsknivåer gir gyldige oppgaver, alle land finnes i kartdataene, kartet gir SVG-stier, oppdrag bygges i alle stiger, og røyktest av alle nye skjermer og oppgavetyper.

## Innhold som bør leses gjennom

- `src/data/engelsk/innhold.js` (UTKAST): ordlister med emoji, 15 setninger, 10 fyll-inn og 8 spørsmål/svar.
- `src/data/geo/land.js`: 54 land med hovedstad. Legg gjerne til flere; kartet finner dem på ISO-koden.

## Prøv som 5-åring

- Klokkestigen: velg «Jeg lærer hele timer». Trykk på klokka som viser «Klokka er 3». Prøv «Still klokka på 5»: dra den korte viseren.
- Geografistigen: velg Norden. Trykk på Norge på kartet. Trykk «Utforsk kartet» og hør flaggene.
- Engelskstigen: trykk 🔊 og hør «cat», finn katten.

## Prøv som 8-åring

- Klokkestigen nivå 5–8: «ti på halv fire», velg riktig klokke, og «Klokka viser dette om kvelden, hva står på den digitale?».
- Geografistigen: Europa og verden på kartet, hovedsteder, verdensdeler.
- Engelsk nivå 5–7: setninger, fyll inn ordet, spørsmål og svar. Trykk 🔊 på alternativene.
- Voksensiden: ukeoversikten viser dagens runder og fag per dag.

## Kjente begrensninger

- Engelsk stemme må finnes på enheten (iPad og Mac har det). Uten finnes 🔊-knappen, men ingenting leses.
- Kartet er i 1:110 millioner. Små land som Luxembourg og Malta er ikke med; de 54 landene i lista er valgt så de synes.
- Klokka med fem minutters nøyaktighet bruker tall for timene («fem over 3»), ikke ord.

# Etappe M – Mer innhold der bunken er liten (runde 4)

Status: ferdig på grenen `adaptiv-laering`. Alt nytt innhold er merket UTKAST i filene til Jon har lest det.

## Nytt innhold

- **Engelsk 7 (SPORSMAAL):** 8 → 42 spørsmål. Ett svar passer, tre svarer tydelig på noe annet.
- **Engelsk 6 (FYLL_INN):** 10 → 42 setninger med bilde. Svarene er ord fra ordlistene eller vanlige småord (test).
- **Engelsk 5 (SETNINGER):** 15 → 41 setninger.
- **Språk 2 (BOYING):** 12 → 51 oppgaver: 22 entall/flertall, 16 nåtid/fortid, 13 gradbøying. Former som også er lovlige (kuer, øyer, høyst, dårligst, svømmet) er holdt unna feilsvarene.
- **Skrive riktig:** 25 ord i hver av de fem gruppene (diftonger, kj/skj, dobbel konsonant, stum h/g, sammensatte). Feilsvar er ikke ekte ord (test med en liste over fallgruver). «hai» for hei og «kval» for hval er byttet (fra etappe Q). «tau» og «tannbørste» er tatt ut fordi emojiene er for nye; «hjul» har fått ☸️.
- **Geografi Norden:** tre nye spørsmålsformer: flagg → hovedstad, hovedstad → flagg, og «Hva er hovedstaden i landet som er markert?». Nivå 2 og 3 har dem (også 5 og 6 i Europa). Nivå 2 har nå 25 ulike spørsmål, nivå 3 har 20.
- **Geografi 9:** fire nye kart som zoomer inn på én verdensdel (Amerika, Afrika, Asia, Oseania) i `UTSNITT` i `src/lib/geo/topo.js`. `kartPool(region)` i `src/lib/geo/kart.js` spør etter alle land i verdensdelen som er minst 24 × 24 punkter ved bredde 390: Amerika 10, Afrika 33, Asia 16, Oseania 3 (feilsvar fra hele verden der). Verdenskartet beholder de åtte store. 39 nye land ligger i `src/data/geo/land.js` med `bareKart: true`, så de brukes bare på kart og i verdensdel-spørsmål, ikke til flagg og hovedsteder. Flaggene ligger i `public/flagg/` (92 nå). «Utforsk kartet» har knapper for de nye kartene.
- **Lengde:** etter dette har bare Geografi 1 fem oppgaver; Geografi 2, 3 og 9, Språk 2 og Engelsk 7 har åtte igjen. Testen fra etappe L er oppdatert.

## Forslag: nye engelsknivåer (ikke bygget)

Engelsk slutter på nivå 7, så et barn som kan engelsk kommer til topps etter åtte svar. Forslag til tre nivåer øverst, i rekkefølge:

1. **Nivå 8 – «Read and choose»:** korte tekster på 20–40 ord (en kort e-post, en handleliste, en beskjed) med ett spørsmål hver, slik Lese 8 gjør det på norsk. Bruker ordene fra nivå 1–7.
2. **Nivå 9 – «Spell it»:** skriv det engelske ordet du hører (tastatur), først ord på 3–4 bokstaver (cat, dog, red), så lengre. Samme form som Skrive riktig.
3. **Nivå 10 – «Make a sentence»:** sett ordene i riktig rekkefølge («is / cat / The / sleeping» → «The cat is sleeping»), med brikker som trykkes i rekkefølge. Ny svarform, men gjenbruker setningene fra nivå 5–6.

Si ja til dem du vil ha, så bygger jeg.

## Testet

`src/lib/__tests__/etappeM.test.js`: antall per liste og ingen duplikater; bøyingstyper; ingen feilsvar er ekte ord; nye spørsmålsformer; kartpools er nøyaktig landene som er store nok; verdenskartet uendret; land merket bareKart kommer aldri i hovedstadsspørsmål; nivå 9 har alle kartene; akseptansetesten (≥ 40 ulike på Engelsk 5–7, Språk 2, Skrive 1–4, Geografi 9; ≥ 20 på Geografi 2 og 3); fyll-inn-svar fra ordlistene.

## Prøv selv

- Geografi 9: nye kart over Amerika, Afrika, Asia og Oseania. Spørsmålet sier hvilket kart.
- «Utforsk kartet»: trykk på Afrika og se 33 land.
- Engelsk 5–7 og Språk 2: mye mer variasjon.
- Korrektur: nye ord i Skrive riktig, bøyingsoppgavene og de engelske setningene.

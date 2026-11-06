# Engelsk 8–10 (runde 4, bygget etter ja fra Jon)

Innholdet er UTKAST til Jon har lest det (`TEKSTER_EN` i `src/data/engelsk/innhold.js`).

## Nye nivåer (område «Read and write» 📖)

- **8 – Read and choose:** 20 korte engelske tekster på 20–40 ord (e-post, handleliste, beskjed, plakat, dagbok) med to spørsmål hver og fire engelske svar. Som Lese 8: stemmen leser bare spørsmålet, «Les teksten for meg» leser teksten med engelsk stemme og regnes som hjelp. Blandet med spørsmål fra nivå 7.
- **9 – Spell it:** skriv det engelske ordet du hører (tastatur). To av tre oppgaver er ord på høyst fire bokstaver (cat, red, bus), én er lengre (banana, yellow). Ordene kommer fra ordlistene på nivå 1–4, så barnet har sett dem før. «Hør ordet igjen» bruker nå oppgavens språk, så engelske ord leses med engelsk stemme.
- **10 – Make a sentence:** sett ordene i riktig rekkefølge med brikker. Setningene er de 3–7 ord lange setningene fra nivå 5 der ingen ord går igjen (ellers blir rekkefølgen tvetydig), i dag 40 av 113. Gjenbruker svarformen «sorter» fra matte; brikker med lange ord får mindre skrift, og hintet er «Første ord først …».

Nytt startvalg i plasseringstesten: «Jeg leser engelsk og vil skrive selv» (nivå 8). Forsiden henter antall nivåer fra stigene, så «Nivå x av 10» stemmer.

## Testet

`src/lib/__tests__/engelsk8-10.test.js`: ti nivåer og områder; tekster 20–40 ord med fire ulike svar og svaret med; stemmen leser ikke teksten; staving med riktig lengde, lyd og engelsk stemme, ord fra ordlistene; brikker = ordene, ingen dobbeltord; nivåene har minst 30 ulike spørsmål og bygger oppdrag på åtte uten gjentakelser.

## Prøv selv

- Engelsk: velg «Jeg leser engelsk og vil skrive selv» i plasseringstesten.
- Nivå 9: hør ordet med engelsk stemme, skriv det. Prøv også «Hør ordet igjen».
- Nivå 10: trykk ordene i rekkefølge. Feil rekkefølge gir setningen i løsningen.

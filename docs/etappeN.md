# Etappe N – Mobil og tallinje (runde 4)

## Endret

- **Aldri bredere enn skjermen.** Rotelementet har `overflow-x-hidden`. Knappene under Fri lek stabler ikon og tekst under hverandre på mobil (`flex-col sm:flex-row`), teksten er mindre (`text-base`) og lange ord brytes (`break-words [overflow-wrap:anywhere]`, `min-w-0`). Samme ordbryting på dagens-kortene og temaknappene.
- **Menyen under Former og mønster:** mindre emoji og tekst på mobil, `min-w-0 flex-1` på teksten.
- **Brøkstripen** (Desimaltall-kortet, ti ruter) har ikke fast bredde lenger: rutene deler bredden (`flex-1`), så stripen holder seg i kortet.
- **Klokka og koordinatsystemet** bruker `w-full max-w-…` i stedet for faste bredder (256–320 px), så de krymper på 320.
- **Svarknapper** med lange ord (over ti tegn) får mindre skrift og bryter ord.
- **Høyttalerknappen** har trykkflate på minst 44 × 44 (`min-w-[44px] min-h-[44px]`), også der ikonet er lite.
- **Tallinja** (`NumberLine` i `src/components/ui.jsx`, brukt i hjelpen og i «Lær først»-kort): når den åpnes, rulles den slik at starttallet står til venstre i det synlige feltet. Når linja fortsetter utenfor feltet, vises en lys kant med pil (‹ ›) på den siden, og pilene oppdateres når barnet ruller. Reglene ligger i `src/lib/tallinje.js` (`rullTil`, `synligeTall`, `rullefeltBredde`).

## Testet

- `src/lib/__tests__/etappeN.test.js`: akseptansetest 2 som ren regning. Ved bredde 360 er rullefeltet 280 punkter (sidemarg 12 + kort 16 + hjelpeboks 12 på hver side), tallinja rulles til 7, og 7–12 er synlige, så både 7 og 11 er med. Det samme på 320, 390 og 412. Uten rulling ville 11 ligget utenfor på 320.
- `src/__tests__/app/mobil.app.test.jsx`: tallinja setter `scrollLeft` til starttallet og viser pil til høyre (og venstre når det er rullet); starter på 0 uten rulling; høyttalerknappen har 44-klassene; brøkstripen har ti `flex-1`-ruter og ingen `w-max`; Fri lek-knappene har ordbryting.
- **Akseptansetest 1 i ekte Chrome.** jsdom måler ikke layout (scrollWidth er alltid 0), så breddene er målt i headless Chrome mot `npm run dev` med DevTools-protokollen (skript i scratchpad, kjørt 7. november): ved 320, 360, 390 og 412 har forsiden, startskjermene til Klokke-, Geografi-, Engelsk- og Lesestigen, Eventyrkartet (hub), en oppgave, oppgaven med hjelpen åpen, løsningen etter to feil, resultatskjermen, menyene under Farger og Former og voksensiden `scrollWidth === clientWidth`, og ingen knapp eller tekst stikker utenfor skjermen eller sin knapp (48 skjermer, alle innenfor). Tallinja i hjelpen var rullet så starttallet sto til venstre, med pil til høyre.

## Prøv selv

- På en telefon: forsiden kan ikke rulles sidelengs, «Geografistigen» står inni knappen sin.
- Matte nivå 5: trykk Hjelp på en plussoppgave. Tallinja starter på det første tallet, og pila til høyre viser at den fortsetter.
- Lær først-kortet «Desimaltall»: stripen med ti ruter holder seg inni kortet.

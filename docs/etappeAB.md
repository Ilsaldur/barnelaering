# Etappe AB – Dagens økt står stille (runde 6)

## Endret

- **Dagens kort lagres** (`kortForDagen`, `lagreDagensKort`, `gyldigeKort` i `src/lib/dagen.js`). Første gang forsiden vises en dag, regnes de tre kortene ut som før (de to fagene det er lengst siden, pluss gaven) og lagres i `dager[dato].kort`. Resten av dagen leses de derfra, så kortene står stille selv om loggen endrer seg, og gavekortet skifter ikke fag. Forsiden lagrer med `updateData` i en `useEffect` når kortene er nye. Ugyldige lagrede kort (gammelt format, fag som ikke finnes) regnes ut på nytt.
- **✓ på det spilte kortet** kommer av dagens fagtelling (`dager[dato].fag`), som alt teller oppdrag fra Fri lek. Feilen som gjorde at ✓ nesten aldri kom: når et oppdrag ble telt på dagen i `addStars`, ble dagsobjektet bygget på nytt uten kortene, så forsiden regnet dem ut igjen fra loggen (og da var kortene byttet). Nå beholdes alt på dagen (`...dag`).
- **Fletting** av to enheter (`mergeData`) beholder dagens kort: den siden som har lagret dem, vinner.
- Kortene i Dagens økt har `data-testid="dagens-kort"`.

## Testet

- `src/lib/__tests__/etappeAB.test.js`: første visning regner ut og ber om lagring; etter et oppdrag brukes de lagrede kortene selv om `dagensKort` fra loggen ville gitt andre; lagring er idempotent; neste dag er kortene nye og det spilte faget ikke blant de to første; ugyldige lagrede kort regnes ut på nytt; fletting beholder kortene.
- `src/__tests__/app/dagensokt.app.test.jsx` (akseptansetesten, i appen): forsiden 7. november viser tre kort og lagrer dem; «spill» kortet lengst til venstre (et oppdrag i faget via `addStars`): samme tre kort med ✓ på det første og «1 av 2 gjort»; forsiden åpnet igjen om kvelden: samme kort, ✓ står; 8. november: tre nye kort uten ✓, det spilte faget er ikke blant de to første, og de nye er lagret. Og: et oppdrag fra Fri lek i faget på kort 2 teller på dagen og gir ✓ på kort 2.
- 375 tester grønne, bygget går (hovedpakken 180 kB gzip).

## Prøv selv

- Spill kortet lengst til venstre i Dagens økt. Tilbake på forsiden skal de samme tre kortene stå, med ✓ på det første, og gaven skal være samme fag som før.
- Spill et fag fra Fri lek som står på et av kortene: kortet får ✓ og telleren går opp.
- I morgen: nye kort, og dagens fag er ikke blant de to første.

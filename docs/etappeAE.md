# Etappe AE – Innhold og småting (runde 6)

## Endret

- **Seks tekster til Lese 9** (UTKAST, `src/data/lesing/innhold.js`, id `n9-isbjorn`, `n9-fotballcup`, `n9-vulkan`, `n9-besteforeldre`, `n9-honningbie`, `n9-roboten`): 114–126 ord, tre faktaspørsmål med fire like lange svar og ett fakta-eller-mening-spørsmål hver. Lese 9 har nå tolv tekster, så fire oppdrag på rad (to tekster per oppdrag) bruker åtte ulike.
- **Emneregelen i kunnskapsoppdragene** ble lagt inn i etappe Z (`byggKunnskapsOppdrag`): høyst to spørsmål om samme ting, aldri to på rad, vis + spørsmål om det samme unntatt. Prøv-plassen lages nå til slutt, så også den følger regelen; var det ingen prøve å stille, kommer ett kjent spørsmål til i stedet.
- **Kortet «dyr-sel»** heter Blåhval 🐳 og har fakta om blåhvalen (🦭 er på lista over emojier som ikke vises på eldre enheter, fra etappe Q).
- **Grått kort når barnet ikke er plassert:** vinduet sier «… Reven finner først nivået ditt.» Knappen «Til matte nivå 7» går til stigen, som starter det første oppdraget (plasseringen) som før.
- **Samlingen:** settet for faget barnet sist spilte (fra loggen; matte når loggen er tom) står øverst og er åpent. De andre settene er slått sammen til én linje med «x av y ▾» til man trykker; trykk igjen lukker. `data-testid="sett-<id>"` med `data-aapen`.

## Testet

- `src/lib/__tests__/etappeAE.test.js`: tolv Lese 9-tekster på 90–130 ord med tre faktaspørsmål og fire ulike svar; de seks nye har svaralternativer der det lengste er høyst 2,5 ganger det korteste; hvalkortet; `sistSpilteFag`. Akseptansetest 1: fire oppdrag på rad på Lese 9 med 20 ulike frø: to tekster per oppdrag, ingen tekst igjen. Akseptansetest 2: 500 oppdrag på Geografi 2 med alt kjent: ingen vis-kort, samme land høyst to ganger, aldri to på rad; og 300 oppdrag på Geografi 3 med ingenting kjent: høyst to spørsmål om samme land, bare vis + spørsmål står rett etter hverandre.
- `src/__tests__/app/samling-ae.app.test.jsx` (i appen): klokka sist spilt → klokkesettet først og åpent, alle andre sett sammenslått med «x av y» og uten ruter; trykk åpner og lukker. Ikke plassert: grått mattekort sier «Reven finner først nivået ditt.» og knappen kaller `onFag('matte')`; plassert: setningen er borte.
- Oppdatert: etappe V-testen åpner settene før den trykker på kortene; etappe X-testen teller tolv n9-tekster.
- 398 tester grønne, bygget går.

## Prøv selv

- Samlingen: settet for det du sist spilte ligger øverst og er åpent; de andre er én linje hver. Trykk på en linje for å se kortene.
- Les gjennom de seks nye tekstene i `src/data/lesing/innhold.js` (merket UTKAST runde 6).
- Ny profil, Samlingen, trykk på et grått mattekort: «Reven finner først nivået ditt.», og knappen starter det første oppdraget.

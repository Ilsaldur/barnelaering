# Etappe U – Former og farger inn i matte (runde 5)

## Endret

- **Fem nye oppgavetyper** i `src/lib/matte/gen_former.js`, med data (UTKAST) i `src/data/matte/former.js`:
  - `monster_neste`: mønster av to eller tre figurer, 5–7 vist og «?» sist; svaralternativene er bilder (figurene i mønsteret pluss én–to andre).
  - `sorter_storrelse`: tre–fire ting fra minst til størst (svarform sorter). Samme figur i ulik størrelse, eller dyr og frukt barn vet størrelsen på. Sorteringsformen tar nå elementer som `{ id, label, scale }`, så samme emoji kan vises i flere størrelser.
  - `form_navn`: hvilken form (bilde i spørsmålet, bare navn som svar).
  - `farge_navn`: hvilken farge (farget rute i spørsmålet, navn som svar).
  - `tell_former`: «Hvor mange trekanter ser du?» i en rekke med andre former.
- **Nivå 1–4** har fått typene med lav vekt (1 mot 2–3 for telling). Oppgavene er merket `formFarge`, og oppdragsbyggeren slipper høyst to av dem inn per oppdrag (samme mekanisme som for null-oppgavene).
- **«Lær først»-kort** om mønster på nivå 3 (`m3-monster`): mønsteret gjentar seg, finn biten som gjentar seg, si navnene høyt.
- **Fjernet:** Former og Farger fra forsiden, `topics.js`, `levels.js`, `QuizEngine.jsx`, `Patterns.jsx`, `TopicLadder.jsx`, `engines.js` og `progress.js`, samt «Temastiger» på voksensiden. Stjernene barna har fått der ligger i `stars` og beholdes. Gamle `data.best` og loggrader med `topic` blir liggende og krasjer ingenting; «Siste runder» viser dem fortsatt med navn.

## Testet

- `src/lib/__tests__/etappeU.test.js`: 1) form_navn og farge_navn har aldri et svaralternativ med bilde (300 av hver); generatorene gir gyldige oppgaver (mønsteret ender med «?», sortering har alle id-er, tellingen stemmer med bildet); 2) 400 oppdrag på matte 1–4: høyst to form-/fargeoppgaver per oppdrag og alle fem typene forekommer; kortet om mønster finnes; 3) de gamle filene er borte.
- `src/__tests__/app/formerfarger.app.test.jsx` (i appen): forsiden har ingen knapp for Former eller Farger, og en profil med `data.best` og en gammel logglinje åpner forsiden og voksensiden uten feil.
- Eldre tester er oppdatert: nivå 2 har seks typer, sorteringstesten godtar objektelementer, og de to hjelperne som svarer i appen trykker sorteringsbrikker via aria-label.

## Prøv selv

- Matte nivå 1: innimellom «Hvilken form er dette?» og «Hvilken farge er dette?» med navn som svar.
- Matte nivå 3: «Hva kommer neste i mønsteret?» (kortet om mønster kommer først) og «Trykk på tingene fra minst til størst».
- Forsiden: ingen Former- eller Farger-knapper. Voksensiden: ingen «Temastiger».

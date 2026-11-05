# 🦊 Selmas Skole

En fargerik, interaktiv læringsnettside for barn (ca. 7 år) – på norsk.
Bygget med **React + Vite + Tailwind CSS**. Lekent design, store knapper,
runde hjørner, klare farger, vennlige animasjoner og lyd-feedback.

## Kom i gang

```bash
npm install
npm run dev      # start utviklingsserver (åpne lenken i nettleseren)
```

Bygg for produksjon:

```bash
npm run build
npm run preview
```

## Slik er appen bygd

Forsiden er «Hvem skal spille?» (profiler), deretter velger barnet et **tema**
med en **nivåstige** (`src/data/topics.js`). Alt innhold er data:

- `src/data/topics.js` – temaer og nivåer (telling, pluss/minus, gange, klokke, ord …)
- `src/data/levels.js` – quiz-banker (farger, former, bokstaver, motsetninger, brøk)
- `src/data/ord.js` – ordlista til «Ord og bilder»
- `src/data/eventyr.js` – stedene på Eventyrkartet
- `src/data/countries.js` – land, flagg og hovedsteder

### Regler som gjelder overalt

- En runde er åtte oppgaver, uten gjentakelser (`src/lib/round.js`).
- Stjerner etter resultat: 0–3 riktige gir ingen, 4–5 gir én, 6–7 gir to, 8 gir tre
  (`src/lib/scoring.js`). Konfetti bare fra to stjerner.
- Feilsvar ligner ekte feil: ti for mye/lite, nabotabellen i gange, én for mye/lite
  i telling (`src/lib/distractors.js`). Aldri negative tall.
- Tallinja og tellebildene ligger bak en «Hjelp»-knapp og viser aldri fasit.
- Opplesing går gjennom én funksjon, `speech.speak()` i `src/speech.js`. Egne
  lydopptak kan kobles på med `speech.setProvider(fn)`.
- Voksensiden og nullstilling ligger bak en voksensperre (hold inne tre sekunder
  og skriv årstallet), `src/components/AdultGate.jsx`.

### Aktivitetsmotorer

Aktivitetene deler noen få gjenbrukbare «motorer» (`src/activities/engines.js`),
som hver tilpasses per nivå via en `config`:

- **`quiz`** – flervalgsquiz drevet av data (telling, farger, former, bokstaver, brøk …).
  Svar kan vises som bilder (`pictureOptions`, `optionPictures`) og leses opp (`readOptions`).
- **`math`** – regnestykker (`ops`, `max`, `mulFactors`, `divMax`), med hjelp bak knapp.
- **`clock`** – analog klokke; `minutes` velger hele/halve/kvarter/5-min.
- **`geography`** – land og flagg, låst til `region` (Norden/Europa/verden).
- **`words`** / **`patterns`** – ord-bilde-kobling og mønster/sortering.

### 🗺️ Eventyrkart

Fem steder (`src/activities/AdventureMap.jsx`). Et sted gir stjerner én gang, og
bare når alle svarene er riktige. Fullførte steder huskes i profilen.

### Tester

```bash
npm test
```

Enhetstester for oppgavegeneratorer, feilsvar, stjerneregler og klokkespråk, pluss
en røyktest som rendrer alle skjermer og nivåer (`src/**/__tests__/`).

## Teknisk

- **Lyd** lages i nettleseren med Web Audio API (`src/sound.js`) – ingen lydfiler.
- **Opplesing** med Web Speech API (`src/speech.js`), norsk stemme når den finnes.
- **Profiler og fremgang** håndteres med React Context + localStorage, og synkes til
  Supabase når en voksen er logget inn (`src/StarContext.jsx`).
- **Navigasjon** er enkel state i `src/App.jsx` (ingen ekstra router).

Planen for videre arbeid ligger i `docs/plan.md`.

## Veikart: lagring og kontoer

I dag lagres fremgang (stjerner + klistremerker) i nettleseren med `localStorage`
(`src/StarContext.jsx`). Det holder for **ett barn på ett nettbrett**, og overlever
omstart. Eneste reelle risiko: Safari sletter data for vanlige nettsider etter ca.
7 dager uten besøk – legg appen til på **hjem-skjermen** for å unngå det.

**Når trenger vi kontoer?** Først når ett av disse blir aktuelt:

- **Flere barn** deler appen og hver trenger sine egne stjerner → profiler.
- **Flere enheter** (nettbrett + PC) der fremgangen skal følge barnet → sky-synk.
- Fremgang skal overleve at nettleseren tømmes / barnet bytter enhet.

**Anbefalt rekkefølge (lettest først – ikke bygg før behovet er reelt):**

1. **Lokale profiler:** flere navngitte profiler lagret lokalt. Barnet trykker på
   navn/avatar – ingen innlogging. Løser «flere barn» umiddelbart.
2. **Sky-synk:** legg på en enkel synk-nøkkel eller forelder-innlogging *over*
   profilene når fremgang skal følge med på tvers av enheter.

**Viktig prinsipp:** et barn skal aldri logge inn med e-post/passord. Riktig form er
**forelder-konto** (den voksne logger inn én gang) med **lette barneprofiler** under
(barnet trykker bare på navnet sitt). Husk personvern/GDPR for barns data hvis
fremgang havner i skyen.

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

Forsiden er «Hvem skal spille?» (profiler under én voksen), deretter **Dagens økt**:
tre oppdragskort der barnet velger to. To oppdrag gir et stempel i ukestripen.
Resten er fri lek: Eventyrkartet (mattestigen), Lesestigen, Nøttehula, Samlingen,
Hagen og noen temaer (klokke, former, farger, geografi).

### Nivået følger barnet

- **Mattestigen**: 38 nivåer i fem verdener (`src/data/matte/nivaer.js`), hvert nivå én
  smal ferdighet. **Lesestigen**: 16 nivåer i seks områder (`src/data/lesing/nivaer.js`).
- Et oppdrag er åtte oppgaver (fem fra eget nivå, to repetisjon, én fra neste), to forsøk
  per oppgave, løsning med forklaring etter andre feil. Bare første forsøk uten hjelp teller.
- 7–8 riktige to ganger på rad gir nivå opp. 0–4 gir hjelp neste gang, uten melding.
  8 av 8 to ganger gir sjefsoppgave. Regler i `src/lib/matte/stige.js`, oppdrag i
  `src/lib/matte/oppdrag.js` (felles for alle stiger).
- Plasseringstest første gang: 8–12 oppgaver, tre opp ved riktig, to ned ved feil.
- Tiervenner og gangetabell øves som kort i fem bokser (`src/lib/matte/kort.js`).

### Innhold som data (redigér fritt)

- `src/data/matte/nivaer.js` – nivåer, oppgavetyper og parametre
- `src/data/lesing/nivaer.js` og `src/data/lesing/innhold.js` – lesenivåer, ordlister,
  setninger, tekster, rettskriving, språk (merket UTKAST til de er gjennomlest)
- `src/data/kort.js`, `src/data/kostymer.js`, `src/data/historier.js` – samlekort,
  kostymer til reven og historiebiter mellom verdenene
- `src/data/topics.js`, `src/data/levels.js`, `src/data/countries.js`, `src/data/ord.js`

### Regler som gjelder overalt

- Stjerner etter resultat: 0–3 riktige gir ingen, 4–5 én, 6–7 to, 8 tre (`src/lib/scoring.js`).
  Konfetti bare fra to stjerner. Ingen tidspress, ingen straff, ingen rekker som ryker.
- Feilsvar ligner ekte feil (`src/lib/distractors.js`). Aldri negative tall uten grunn.
- Hjelp (tellebilder, tallinje, tierblokker, rutenett) ligger bak en Hjelp-knapp og viser
  aldri fasit.
- Opplesing går gjennom én funksjon, `speech.speak()` i `src/speech.js`. Egne lydopptak kan
  kobles på med `speech.setProvider(fn)`.
- Voksensiden ligger bak en voksensperre (hold inne tre sekunder og skriv årstallet).

### Profiler og synk

Én voksen logger inn med e-postlenke (Supabase, registrering stengt). Barna er profiler
med kallenavn og figur. Fremgangen (`src/lib/profil.js`) lagres lokalt først og synkes
når det er nett; en kø i localStorage tømmes når nettet er tilbake. Fletting gjør at
ingenting går tapt.

### Tester

```bash
npm test
```

Enhetstester for alle oppgavegeneratorer, nivåregler, plassering, kortbokser, dagens økt,
samlekort og fletting, pluss en røyktest som rendrer alle skjermer og oppgavetyper.

## Teknisk

- React 18, Vite, Tailwind. Ingen router: navigasjon er state i `src/App.jsx`.
- Lyd med Web Audio (`src/sound.js`), opplesing med Web Speech (`src/speech.js`).
- Web-app-manifest og ikoner i `public/`, så appen kan legges på Hjem-skjermen.

Planen og loggen per etappe ligger i `docs/`.

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

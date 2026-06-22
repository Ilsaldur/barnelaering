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

## Nivåer

Startskjermen er en **nivåvelger** – ett barn velger sin egen alder/klasse, og får
en meny med aktiviteter tilpasset det nivået. Hele læreplanen ligger som data i
`src/data/levels.js` (legg til/endre aktiviteter der – ingen ny kode trengs).

| Nivå | Innhold (utvalg) |
|------|------------------|
| 🧸 **Barnehage** (4 år) | Telling 1–5, farger, former, første bokstav, stor/liten, ord og bilder |
| ✏️ **1. klasse** (6 år) | Telling til 10, pluss/minus til 20, bokstaver og lyder, mønster, hele klokketimer |
| 📐 **2. klasse** (7 år) | Pluss/minus til 100, gangetabell (2, 5, 10), hele/halve timer, motsetninger, Norden |
| 🔬 **3. klasse** (8 år) | Gangetabell 1–10, deling, klokka til 5 min, Europa, mønster og logikk |
| 🎓 **4. klasse** (9 år) | Gange og deling, brøk/halvparten, hele verden, klokka, lesing |

### Aktivitetsmotorer

Aktivitetene deler noen få gjenbrukbare «motorer» (`src/activities/engines.js`),
som hver tilpasses per nivå via en `config`:

- **`quiz`** – generisk flervalgsquiz drevet av data (telling, farger, former, bokstaver, brøk …).
- **`math`** – regnestykker (`ops`, `max`, `mulFactors`, `divMax`), med tallinje og emoji-mengder.
- **`clock`** – analog klokke; `minutes` velger hele/halve/kvarter/5-min.
- **`geography`** – land og flagg, låst til `region` (Norden/Europa/verden).
- **`words`** / **`patterns`** – ord-bilde-kobling og mønster/sortering.

### 🗺️ Eventyrkart (bonus)

En egen lekesone (`src/activities/AdventureMap.jsx`): barnet **drar opptjente stempler**
(klistremerker) ut på et kart – eller trykker på et sted – for å låse opp små quiz.
Hvert sted krever et visst antall stjerner, så kartet vokser etter hvert som man samler.

### 🏆 Mine stjerner

Belønningssystem: samle stjerner og lås opp klistremerker på tvers av alle nivåer.
Lagres i nettleseren (localStorage).

## Teknisk

- **Lyd** lages i nettleseren med Web Audio API (`src/sound.js`) – ingen lydfiler, fungerer uten internett.
- **Belønning** håndteres med React Context + localStorage (`src/StarContext.jsx`).
- **Navigasjon** (hjem → nivå → aktivitet, + kart/stjerner) er enkel state i `src/App.jsx` (ingen ekstra router).
- Alt er på norsk, med store, lesbare fonter og en positiv, oppmuntrende tone.

### Geografi-kart

Geografi-seksjonen bruker et klikkbart rutenett med flagg for å være 100 % offline-vennlig.
Ønsker du et ekte geografisk kart kan du bytte inn `react-simple-maps`
i `src/activities/Geography.jsx`.

### Utvide

- Nye aktiviteter eller nivåer: rediger `src/data/levels.js` (mest er ren data).
- Nye quiz-temaer: lag en `bank` i `levels.js` og bruk `engine: 'quiz'`.
- Flere steder/oppgaver på kartet: `NODES` i `src/activities/AdventureMap.jsx`.
- Flere land: legg til i `src/data/countries.js`.
- Flere ord: legg til i `WORDS`-lista i `src/activities/Words.jsx`.
- Flere klistremerker: legg til i `STICKERS` i `src/StarContext.jsx`.

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

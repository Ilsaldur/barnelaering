# 🦊 Lær og Lek!

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

## Aktiviteter

| Seksjon | Hva man lærer |
|--------|----------------|
| 🔢 **Matte** | Tre nivåer: Lett (1–10), Middels (1–20), Vanskelig (1–100 + gangetabell 1–5). Pluss/minus vises med emojis, tallinje som hjelpemiddel, quiz med poeng, stjerner og heiende maskot. |
| 🌍 **Land og flagg** | Klikkbart "kart" med flagg → navn + hovedstad. Quiz: «Hvilket land har hovedstaden Oslo?». Start med Norden, utvid til Europa og hele verden. |
| 🕐 **Klokka** | Lær å lese analog klokke ved å **dra viserne**. Quiz: «Hva er klokka?». |
| 🔺 **Mønster og sortering** | Fullfør mønstre, og **dra** former fra minst til størst. |
| 🔤 **Ord og bilder** | Koble bilde til riktig ord. |
| 🏆 **Mine stjerner** | Belønningssystem: samle stjerner og lås opp klistremerker på tvers av alle aktiviteter. Lagres i nettleseren (localStorage). |

## Teknisk

- **Lyd** lages i nettleseren med Web Audio API (`src/sound.js`) – ingen lydfiler, fungerer uten internett.
- **Belønning** håndteres med React Context + localStorage (`src/StarContext.jsx`).
- **Navigasjon** mellom seksjoner er enkel skjerm-state i `src/App.jsx` (ingen ekstra router).
- Alt er på norsk, med store, lesbare fonter og en positiv, oppmuntrende tone.

### Geografi-kart

Geografi-seksjonen bruker et klikkbart rutenett med flagg for å være 100 % offline-vennlig.
Ønsker du et ekte geografisk kart kan du bytte inn `react-simple-maps`
i `src/activities/Geography.jsx`.

### Utvide

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

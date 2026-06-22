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

# Etappe 0 – Oppsummering, datamodell og spørsmål

Skrevet 2026-11-05 på grenen `adaptiv-laering`. Ingen kode er endret.

## 1. Slik er appen bygd i dag

**Stabel.** React 18, Vite 5, Tailwind 3. Ingen router (navigasjon er en `nav`-tilstand i `src/App.jsx`), ingen tester, ingen lint, ingen TypeScript. Lyd lages med Web Audio (`src/sound.js`). Skrift er Baloo 2 fra Google Fonts. Ca. 4 500 linjer.

**To utgaver finnes.** Dette er det viktigste funnet:

| | Produksjon (selmasskole.vercel.app) | Lokal `main` |
|---|---|---|
| Commit | `2d5b097` (22. juni) | `da2fcc1` (1. sept, **ikke pushet**) |
| Forside | Velg klassetrinn (Barnehage, 1.–4.) | Velg profil → velg tema med nivåstige |
| Eventyrkart | `AdventureMap.jsx` med Tryllesskogen m.m. | Slettet. Erstattet av `Campaign.jsx` (Skogen, Enga, Fjellet, Byen, Verdensrommet), skjult bak `SHOW_EVENTYR = false` |
| Profiler | Nei | Ja: gjest + barneprofiler under Supabase-konto |
| Supabase | Nei | E-post + passord, åpen registrering, tabellene `children` og `progress` |
| Opplesing | Nei | `src/speech.js` (Web Speech, nb-NO), brukt bare i `QuizEngine` |
| Voksenside | Nei | `Parents.jsx` bak gangestykke-sperre |
| Hage (bruk stjerner) | Nei | Ja |

Problemlista i oppdraget beskriver produksjonsutgaven. Flere punkter er allerede delvis løst i lokal `main`, men den utgaven er ikke testet av barna og har også fjernet Eventyrkartet, som etappe 4 bygger videre på.

**Motorer.** Seks aktivitetsmotorer i `src/activities/`, koblet via navn i `engines.js`: `quiz` (datadrevet flervalg), `math`, `clock`, `words`, `patterns`, `geography`. Hver motor eier sin egen rundesløyfe, poengberegning, konfetti og «Bra jobba!». Logikken er kopiert inn i alle seks. Det er derfor det samme feilene går igjen overalt:

- Stjerner: `1` for alt under halvparten, `2` fra halvparten, `3` fra alle minus én. Aldri 0.
- Feilsvar i matte: `answer ± 5`, i telling `± 3`. Ingen sjekk på gjentatte oppgaver.
- Tallinja (`NumberLine` i `components/ui.jsx`) får `highlight={[answer]}` og lyser opp fasit.
- Klokkefeilen: `timeText()` returnerer «Klokka er 7», og meldingen pakker den inn i «Klokka er …» en gang til.
- `Patterns` gir alltid 2 stjerner ved fullført spill.

**Data.** `src/data/levels.js` (klassetrinn og quizbanker), `src/data/topics.js` (temaer med nivåstiger og noen generatorer), `src/data/campaign.js` (verdener som peker inn i levels.js), `src/data/countries.js`. Ordlista ligger i kode (`Words.jsx`), det samme gjør klistremerker (`StarContext.jsx`) og hagevarer (`Garden.jsx`).

**Tilstand.** `StarContext.jsx` holder aktiv profil og per profil: `stars`, `spent`, `best[tema][nivå]` (beste stjerner), `garden`, og `log` (siste 500 runder med `correct/total`). Lagres i localStorage og, for skyprofiler, som én JSON-blob i `progress.data`. Fletting ved konflikt: høyeste stjernetall vinner, mestring celle for celle, logg som union. Det er et godt grunnlag for offline-toleranse.

**Supabase i dag.** Prosjektet `selmas-skole` (eu-north-1) finnes og er friskt. Tabeller: `children (id, user_id, name, emoji, created_at)` og `progress (child_id, data jsonb, updated_at)`. RLS er på begge. Ingen rader. Nøklene ligger i `.env.local` (gitignorert, bra). Jeg har ikke sjekket om Vercel-prosjektet har de samme miljøvariablene.

## 2. Forslag til datamodell

Prinsipp: innhold er datafiler i repoet, barnets tilstand er én liten JSON per barn som tåler fletting, og svarhistorikk er en loggliste som bare vokser.

### Innhold (datafiler, redigerbare)

```
src/data/
  matte/nivaer.js      38 nivåer: { id: 'm12', verden: 'havet', tittel, trinn: '1',
                        svar: 'valg' | 'tastatur', oppgaver: [{ type: 'pluss_tierovergang',
                        param: { ... }, vekt: 1 }], hjelp: 'tallinje' | 'ting' | null,
                        kort: 'tiervenner' | 'gange' | null }
  matte/noetter.js     tenkenøtter i tre grader
  lesing/nivaer.js     seks nivåer, samme form
  lesing/ord.js        ordlister merket UTKAST til du har lest dem
  lesing/tekster.js    tekster 40–120 ord med spørsmål, merket UTKAST
  klokke/nivaer.js
  verdener.js          fem verdener med navn, farge, steder og posisjon på kartet
  kort.js              samlekort: { id, sett: 'dyr' | 'dino' | 'planeter', navn, bilde, fakta }
  kostymer.js          { id, navn, pris, emoji }
  historier.js         historiebiter mellom verdenene
  land.js              (dagens countries.js)
```

Oppgavegeneratorer blir rene funksjoner i `src/motor/generatorer/`. Hver tar `(rng, param)` og gir én oppgave:

```
{ id, type: 'pluss_tierovergang', sporsmaal: '8 + 5 = ?', tale: 'Hva er 8 pluss 5?',
  visuelt: { slag: 'mengde', a: 8, b: 5 } | null, svar: 13,
  valg: [13, 12, 14, 3] | null, forklaring: '8 + 2 = 10, og 10 + 3 = 13' }
```

Rene funksjoner med egen tilfeldighetskilde gjør dem enkle å enhetsteste (regel 8). Feilsvar-regler (ti for mye, samme siste siffer, nabotabell) ligger i én delt modul.

### Barnets tilstand (per profil, synkes som JSON)

```
{
  v: 2,
  fag: {
    matte: { nivaa: 12, plassert: true, paaRad: 1, hjelpNeste: false,
             beste: { m07: 3, m08: 2 }, bokser: { 'tiervenner:7': 3, 'gange:6x7': 1 },
             svake: { pluss_tierovergang: { bom: 2, til: '2026-11-06' } } },
    lesing: { ... }, klokke: { ... }
  },
  stjerner: 14, brukt: 4,
  kort: ['dyr-elg'], kostymer: ['lue'], kostyme: 'lue',
  dager: { '2026-11-05': 2 },           // oppdrag fullført per dag → ukestripe
  eventyr: { fullfort: { m07: true } }   // kartet husker steder
}
```

Svarhistorikk lagres for seg, som rader som bare legges til (lett å synke etter nettbrudd, og det voksensiden trenger):

```
{ t, barn, fag, nivaa, type, forsteForsok: true, riktig: true, hjelp: false, ms }
```

### Supabase (etappe 2, bare etter OK)

- `children`: beholdes, får kolonnen `innstillinger jsonb` (nivå overstyrt, fagblanding, oppdrag per dag, auto-opplesing, låst fag).
- `progress`: beholdes som flettbar blob (`data jsonb`), med flettefunksjonen som finnes i dag.
- Ny `attempts (id, child_id, t, fag, nivaa, type, forste_ok, hjelp)`, append-only, RLS via `children.user_id`.
- Innlogging: e-postlenke med `signInWithOtp({ shouldCreateUser: false })`, registrering skrudd av i Supabase, og brukere opprettes manuelt av deg i dashbordet. Da trengs ingen egen tillatelsesliste.

## 3. Spørsmål

1. **Hvilken utgave er utgangspunktet?** Jeg anbefaler lokal `main` (`da2fcc1`): profiler, Supabase, opplesing og voksenside finnes allerede, og det sparer etappe 2 mye arbeid. Da henter jeg Eventyrkartet tilbake fra `2d5b097` i etappe 1 og retter det der. Alternativet er å starte fra produksjonsutgaven og slette den upushede committen. Si hva du vil.

2. **Supabase-prosjektet.** Er `selmas-skole` det riktige, og kan jeg bruke det i etappe 2? Jeg gjør ingen endringer der før du sier ja. Vet du om Vercel har `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` satt?

3. **Testverktøy.** Regel 8 krever tester. Jeg vil legge til Vitest som dev-avhengighet, siden det bruker Vite-oppsettet som er der. Er det greit? Ingen andre avhengigheter er planlagt før etappe 6 (kart i geografi).

4. **Alder uten fødselsdato.** Plasseringstesten skal «starte litt under det som er vanlig for alderen», men regel 6 sier ingen fødselsdato. Forslag: når du lager profilen velger du en startverden (Trylleskogen, Det blå havet osv.). Det lagres bare som et nivå. Greit?

5. **Nytt trinn (etappe 1, punkt 6).** I lokal `main` finnes ikke klassetrinnene lenger. Hvis vi bygger på den, foreslår jeg å legge det nye innholdet (telle til 20, før og etter, mer og mindre, pluss og minus til 10) inn som egne nivåer i stigene for «Tall og telling» og «Pluss og minus», heller enn å gjenopprette klassetrinn som uansett forsvinner i etappe 3. Greit?

6. **Stjerneregelen for alle motorer.** Jeg antar at 0–3-regelen (0–3 riktige gir ingen stjerne osv.) skal gjelde klokke, geografi, ord og mønster også, og at mønsterspillet går fra fast 2 stjerner til å telle riktige. Si fra om noe skal være annerledes. Klokke og geografi har seks oppgaver per runde i dag. Jeg setter dem til åtte så regelen blir lik.

7. **Eksisterende framgang.** Supabase har ingen rader, så det eneste som finnes er stjerner i localStorage på enhetene. Forslag: stjernesummen flyttes over til profilen barnet velger første gang, resten starter på nytt med plasseringstest. Greit?

Når du har svart, starter jeg etappe 1.

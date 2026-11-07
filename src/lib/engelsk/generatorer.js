// Oppgavegeneratorer for engelsk. Engelske ord leses opp med engelsk stemme
// (task.lang = 'en-GB'); instruksjonene er på norsk.
import { pick, shuffle } from '../rng.js'
import { registerTypeLabels } from '../labels.js'
import { ORD, SETNINGER, FYLL_INN, SPORSMAAL, TEKSTER_EN } from '../../data/engelsk/innhold.js'

function pool(grupper) {
  return grupper.flatMap((g) => ORD[g] || [])
}
function andre(p, w, n, rng) {
  return shuffle(
    p.filter((x) => x.en !== w.en),
    rng,
  ).slice(0, n)
}

export const GEN_ENGELSK = {
  // Hør det engelske ordet, finn bildet.
  hor_finn_bilde: ({ grupper = ['dyr'] }, rng) => {
    const p = pool(grupper)
    const w = pick(p, rng)
    const feil = andre(p, w, 3, rng)
    return {
      type: 'hor_finn_bilde',
      emne: w.en,
      form: 'valg',
      kreverLyd: true,
      prompt: `Hvilket bilde er «${w.en}»?`,
      spoken: w.en,
      lang: 'en-GB',
      hørOrd: w.en,
      answer: w.emoji,
      options: shuffle([w.emoji, ...feil.map((x) => x.emoji)], rng),
      explain: `«${w.en}» betyr ${w.no}.`,
      stor: true,
    }
  },
  // Se bildet, finn det engelske ordet.
  bilde_finn_ord: ({ grupper = ['dyr'] }, rng) => {
    const p = pool(grupper)
    const w = pick(p, rng)
    const feil = andre(p, w, 3, rng)
    return {
      type: 'bilde_finn_ord',
      emne: w.en,
      form: 'valg',
      prompt: 'Hva heter dette på engelsk?',
      spoken: 'What is this?',
      lang: 'en-GB',
      visual: { kind: 'ikon', emoji: w.emoji },
      answer: w.en,
      options: shuffle([w.en, ...feil.map((x) => x.en)], rng),
      explain: `${w.emoji} er «${w.en}» på engelsk (${w.no}).`,
      readOptions: true,
    }
  },
  // Oversett: norsk ord → engelsk.
  oversett: ({ grupper = ['dyr'] }, rng) => {
    const p = pool(grupper)
    const w = pick(p, rng)
    const feil = andre(p, w, 3, rng)
    return {
      type: 'oversett',
      emne: w.en,
      form: 'valg',
      prompt: `Hva er «${w.no}» på engelsk?`,
      spoken: `Hva er ${w.no} på engelsk?`,
      answer: w.en,
      options: shuffle([w.en, ...feil.map((x) => x.en)], rng),
      explain: `${w.no} er «${w.en}» ${w.emoji}.`,
      readOptions: true,
      optionsLang: 'en-GB',
    }
  },
  // Engelsk setning → bilde.
  setning_bilde: (_, rng) => {
    const s = pick(SETNINGER, rng)
    return {
      type: 'setning_bilde_en',
      emne: s.en,
      form: 'valg',
      prompt: s.en,
      spoken: s.en,
      lang: 'en-GB',
      hørOrd: s.en,
      answer: s.svar,
      options: shuffle([s.svar, ...s.feil], rng),
      explain: `«${s.en}» betyr «${s.no}».`,
      stor: true,
    }
  },
  // Fyll inn ordet som mangler.
  fyll_inn: (_, rng) => {
    const f = pick(FYLL_INN, rng)
    return {
      type: 'fyll_inn',
      emne: f.en,
      form: 'valg',
      prompt: f.en,
      spoken: f.en.replace('___', 'hmm'),
      lang: 'en-GB',
      visual: { kind: 'ikon', emoji: f.emoji },
      answer: f.svar,
      options: shuffle([f.svar, ...f.feil], rng),
      explain: f.en.replace('___', f.svar),
      readOptions: true,
      optionsLang: 'en-GB',
    }
  },
  // Spørsmål og svar.
  sporsmaal: (_, rng) => {
    const q = pick(SPORSMAAL, rng)
    return {
      type: 'sporsmaal_en',
      emne: q.q,
      form: 'valg',
      prompt: q.q,
      spoken: q.q,
      lang: 'en-GB',
      hørOrd: q.q,
      answer: q.svar,
      options: shuffle([q.svar, ...q.feil], rng),
      explain: `${q.q} – ${q.svar}`,
      readOptions: true,
      optionsLang: 'en-GB',
    }
  },
}

// Setninger som kan settes sammen av brikker: 3–7 ord, ingen ord to ganger.
export function setningsBrikker(s) {
  const ord = s.en.trim().split(/\s+/)
  if (ord.length < 3 || ord.length > 7) return null
  const sett = new Set(ord.map((w) => w.toLowerCase().replace(/[.!?,]/g, '')))
  if (sett.size !== ord.length) return null
  return ord
}
export const SETNINGER_BRIKKER = SETNINGER.filter((s) => setningsBrikker(s))

Object.assign(GEN_ENGELSK, {
  // Nivå 8: les en kort engelsk tekst og svar. Stemmen leser bare spørsmålet;
  // «Les teksten for meg» leser teksten (regnes som hjelp).
  les_tekst_en: (_, rng) => {
    const t = pick(TEKSTER_EN, rng)
    const q = pick(t.sporsmaal, rng)
    return {
      type: 'les_tekst_en',
      emne: t.id,
      form: 'valg',
      prompt: q.q,
      spoken: q.q,
      lang: 'en-GB',
      lesTekst: `${t.tittel}. ${t.tekst}`,
      visual: { kind: 'tekst', tittel: t.tittel, tekst: t.tekst },
      answer: q.svar,
      options: shuffle(q.alternativer, rng),
      optionsLang: 'en-GB',
      explain: `The text says: «${q.svar}».`,
      tekstId: t.id,
    }
  },
  // Nivå 9: skriv det engelske ordet du hører. maks/min = antall bokstaver.
  stav_en: ({ maks = 99, min = 1, grupper = Object.keys(ORD) }, rng) => {
    const p = pool(grupper).filter((w) => w.en.length >= min && w.en.length <= maks && !w.en.includes(' '))
    const w = pick(p.length ? p : pool(grupper), rng)
    return {
      type: 'stav_en',
      emne: w.en,
      form: 'skriv',
      kreverLyd: true,
      prompt: 'Skriv det engelske ordet du hører.',
      spoken: `Spell the word: ${w.en}. ${w.en}.`,
      lang: 'en-GB',
      hørOrd: w.en,
      visual: { kind: 'ikon', emoji: w.emoji },
      answer: w.en,
      explain: `${w.emoji} skrives «${w.en}» (${w.no}).`,
    }
  },
  // Nivå 10: sett ordene i riktig rekkefølge.
  lag_setning: (_, rng) => {
    const s = pick(SETNINGER_BRIKKER, rng)
    const ord = setningsBrikker(s)
    return {
      type: 'lag_setning',
      emne: s.en,
      form: 'sorter',
      prompt: 'Sett ordene i riktig rekkefølge.',
      spoken: 'Sett ordene i riktig rekkefølge, så det blir en engelsk setning.',
      sorterHint: 'Første ord først …',
      items: shuffle(ord, rng),
      answer: ord,
      explain: `«${s.en}» – ${s.no}`,
      visual: { kind: 'ikon', emoji: s.svar },
    }
  },
})

export function genEngelsk(type, param = {}, rng = Math.random) {
  const g = GEN_ENGELSK[type]
  if (!g) throw new Error(`Ukjent oppgavetype i engelsk: ${type}`)
  const task = g(param, rng)
  task.type = task.type || type
  return task
}

registerTypeLabels({
  hor_finn_bilde: 'Høre engelsk ord og finne bildet',
  bilde_finn_ord: 'Finne engelsk ord til bildet',
  oversett: 'Oversette til engelsk',
  setning_bilde_en: 'Enkle engelske setninger',
  fyll_inn: 'Fylle inn ordet som mangler',
  sporsmaal_en: 'Spørsmål og svar på engelsk',
  les_tekst_en: 'Lese korte engelske tekster',
  stav_en: 'Stave engelske ord',
  lag_setning: 'Sette sammen engelske setninger',
})

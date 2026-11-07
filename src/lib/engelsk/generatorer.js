// Oppgavegeneratorer for engelsk. Engelske ord leses opp med engelsk stemme
// (task.lang = 'en-GB'); instruksjonene er på norsk.
import { pick, shuffle } from '../rng.js'
import { registerTypeLabels } from '../labels.js'
import { ORD, SETNINGER, FYLL_INN, SPORSMAAL, TEKSTER_EN } from '../../data/engelsk/innhold.js'
import { velgKjent, kjenteFeil } from '../kunnskap.js'

// Kunnskapsstige: nøkler «ord:cat», «setning:…», «fyll:…», «spm:…».
const keyOrd = (w) => `ord:${w.en}`
const keySetning = (s) => `setning:${s.en}`
const keyFyll = (f) => `fyll:${f.en}`
const keySpm = (q) => `spm:${q.q}`
const visOrd = (w) => ({ tekst: w.en, spoken: w.en, lang: 'en-GB', under: w.no, visual: { kind: 'ikon', emoji: w.emoji } })

function pool(grupper) {
  return grupper.flatMap((g) => ORD[g] || [])
}
function andre(p, w, n, rng, param) {
  return kjenteFeil(p, w, keyOrd, param, n, rng)
}

export const GEN_ENGELSK = {
  // Hør det engelske ordet, finn bildet.
  hor_finn_bilde: (param, rng) => {
    const { grupper = ['dyr'] } = param
    const p = pool(grupper)
    const w = velgKjent(p, keyOrd, param, rng)
    const feil = andre(p, w, 3, rng, param)
    return {
      type: 'hor_finn_bilde',
      emne: w.en,
      kjent: keyOrd(w),
      visning: visOrd(w),
      optionsKjent: Object.fromEntries([w, ...feil].map((x) => [x.emoji, keyOrd(x)])),
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
  bilde_finn_ord: (param, rng) => {
    const { grupper = ['dyr'] } = param
    const p = pool(grupper)
    const w = velgKjent(p, keyOrd, param, rng)
    const feil = andre(p, w, 3, rng, param)
    return {
      type: 'bilde_finn_ord',
      emne: w.en,
      kjent: keyOrd(w),
      visning: visOrd(w),
      optionsKjent: Object.fromEntries([w, ...feil].map((x) => [x.en, keyOrd(x)])),
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
  oversett: (param, rng) => {
    const { grupper = ['dyr'] } = param
    const p = pool(grupper)
    const w = velgKjent(p, keyOrd, param, rng)
    const feil = andre(p, w, 3, rng, param)
    return {
      type: 'oversett',
      emne: w.en,
      kjent: keyOrd(w),
      visning: visOrd(w),
      optionsKjent: Object.fromEntries([w, ...feil].map((x) => [x.en, keyOrd(x)])),
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
  setning_bilde: (param, rng) => {
    const s = velgKjent(SETNINGER, keySetning, param, rng)
    return {
      type: 'setning_bilde_en',
      emne: s.en,
      kjent: keySetning(s),
      visning: { tekst: s.en, spoken: s.en, lang: 'en-GB', under: s.no, visual: { kind: 'ikon', emoji: s.svar } },
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
  fyll_inn: (param, rng) => {
    const f = velgKjent(FYLL_INN, keyFyll, param, rng)
    return {
      type: 'fyll_inn',
      emne: f.en,
      kjent: keyFyll(f),
      visning: { tekst: f.en.replace('___', f.svar), spoken: f.en.replace('___', f.svar), lang: 'en-GB', visual: { kind: 'ikon', emoji: f.emoji } },
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
  sporsmaal: (param, rng) => {
    const q = velgKjent(SPORSMAAL, keySpm, param, rng)
    return {
      type: 'sporsmaal_en',
      emne: q.q,
      kjent: keySpm(q),
      visning: { tekst: `${q.q} – ${q.svar}`, spoken: `${q.q} ${q.svar}`, lang: 'en-GB', visual: { kind: 'ikon', emoji: '💬' } },
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
  stav_en: (param, rng) => {
    const { maks = 99, min = 1, grupper = Object.keys(ORD) } = param
    const p = pool(grupper).filter((w) => w.en.length >= min && w.en.length <= maks && !w.en.includes(' '))
    const w = velgKjent(p.length ? p : pool(grupper), keyOrd, param, rng)
    return {
      type: 'stav_en',
      emne: w.en,
      kjent: keyOrd(w),
      visning: visOrd(w),
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
  lag_setning: (param, rng) => {
    const s = velgKjent(SETNINGER_BRIKKER, keySetning, param, rng)
    const ord = setningsBrikker(s)
    return {
      type: 'lag_setning',
      emne: s.en,
      kjent: keySetning(s),
      visning: { tekst: s.en, spoken: s.en, lang: 'en-GB', under: s.no, visual: { kind: 'ikon', emoji: s.svar } },
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

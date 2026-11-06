// Oppgavegeneratorer for engelsk. Engelske ord leses opp med engelsk stemme
// (task.lang = 'en-GB'); instruksjonene er på norsk.
import { pick, shuffle } from '../rng.js'
import { registerTypeLabels } from '../labels.js'
import { ORD, SETNINGER, FYLL_INN, SPORSMAAL } from '../../data/engelsk/innhold.js'

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
      form: 'valg',
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
})

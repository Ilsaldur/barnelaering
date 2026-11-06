// Trylleskogen (nivå 1–6): telling, tallrekke, mer/mindre, dele opp tall,
// pluss og minus innenfor 5 og 10. Alt er flervalg med nære feilsvar.
import { EMOJIS, valg, santUsant, naer, randInt, pick, shuffle } from './felles.js'

const TERNING = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export const GEN_SKOG = {
  // Tell ting.
  tell: ({ min = 1, max = 5 }, rng) => {
    const n = randInt(min, max, rng)
    const em = pick(EMOJIS, rng)
    return valg(
      {
        type: 'tell',
        prompt: 'Hvor mange er det?',
        spoken: `Hvor mange ${em.navn} er det?`,
        visual: { kind: 'mengde', emoji: em.e, n },
        explain: `Tell én og én: det er ${n} ${em.navn}.`,
        readOptions: true,
      },
      n,
      naer(n, { min: Math.max(1, min - 1), max: max + 2, rng }),
      rng,
    )
  },

  // Kjenne igjen terningbilder uten å telle.
  terning: ({ max = 6 }, rng) => {
    const n = randInt(1, max, rng)
    return valg(
      {
        type: 'terning',
        prompt: 'Hvor mange prikker viser terningen?',
        spoken: 'Hvor mange prikker viser terningen?',
        visual: { kind: 'terning', n, tegn: TERNING[n - 1] },
        explain: `Terningen viser ${n}.`,
        readOptions: true,
      },
      n,
      naer(n, { min: 1, max: 6, rng }),
      rng,
    )
  },

  // Hvilket tall kommer etter / før?
  tallrekke_etter: ({ max = 20 }, rng) => {
    const n = randInt(0, max - 1, rng)
    return valg(
      {
        type: 'tallrekke_etter',
        prompt: `Hvilket tall kommer etter ${n}?`,
        spoken: `Hvilket tall kommer etter ${n}?`,
        visual: { kind: 'rekke', items: [String(n), '?'] },
        explain: `Etter ${n} kommer ${n + 1}.`,
        readOptions: true,
      },
      n + 1,
      naer(n + 1, { min: 0, max: max + 2, rng }),
      rng,
    )
  },
  tallrekke_for: ({ max = 20 }, rng) => {
    const n = randInt(1, max, rng)
    return valg(
      {
        type: 'tallrekke_for',
        prompt: `Hvilket tall kommer før ${n}?`,
        spoken: `Hvilket tall kommer før ${n}?`,
        visual: { kind: 'rekke', items: ['?', String(n)] },
        explain: `Før ${n} kommer ${n - 1}.`,
        readOptions: true,
      },
      n - 1,
      naer(n - 1, { min: 0, max: max + 2, rng }),
      rng,
    )
  },
  // Hvilket tall mangler i rekka?
  tallrekke_mangler: ({ max = 20, step = 1 }, rng) => {
    const len = 5
    const start = randInt(0, Math.max(0, max - step * (len - 1)), rng)
    const hole = randInt(1, len - 2, rng)
    const seq = Array.from({ length: len }, (_, i) => start + i * step)
    const answer = seq[hole]
    const items = seq.map((v, i) => (i === hole ? '?' : String(v)))
    return valg(
      {
        type: step === 1 ? 'tallrekke_mangler' : 'telle_med',
        prompt: 'Hvilket tall mangler?',
        spoken: `Hvilket tall mangler? ${items.map((x) => (x === '?' ? 'hva' : x)).join(', ')}`,
        visual: { kind: 'rekke', items },
        explain: step === 1 ? `Mellom ${seq[hole - 1]} og ${seq[hole + 1]} kommer ${answer}.` : `Vi teller med ${step}: ${seq[hole - 1]}, ${answer}, ${seq[hole + 1]}.`,
      },
      answer,
      step === 1 ? naer(answer, { min: 0, max: max + 2, rng }) : [answer + step, answer - step, answer + 1].filter((x) => x >= 0),
      rng,
    )
  },

  // Mer, mindre og like mange – for mengder.
  mer_mindre_mengder: ({ max = 10 }, rng) => {
    const [A, B] = shuffle(EMOJIS, rng).slice(0, 2)
    const a = randInt(1, max, rng)
    let b = randInt(1, max, rng)
    const variant = pick(['flest', 'faerrest', 'like'], rng)
    if (variant === 'like' && rng() < 0.5) b = a
    while (variant !== 'like' && b === a) b = randInt(1, max, rng)
    let prompt, answer, options
    if (variant === 'like') {
      prompt = 'Er det like mange?'
      return santUsant(
        {
          type: 'mer_mindre_mengder',
          prompt,
          spoken: `Er det like mange ${A.navn} som ${B.navn}?`,
          visual: { kind: 'mengder', groups: [{ emoji: A.e, n: a }, { emoji: B.e, n: b }] },
          explain: a === b ? `Ja, det er ${a} av hver.` : `Nei, det er ${a} ${A.navn} og ${b} ${B.navn}.`,
        },
        a === b,
      )
    }
    prompt = variant === 'flest' ? 'Hvor er det flest?' : 'Hvor er det færrest?'
    const winner = variant === 'flest' ? (a > b ? A : B) : a < b ? A : B
    answer = winner.e
    options = [A.e, B.e]
    return {
      type: 'mer_mindre_mengder',
      form: 'valg',
      prompt,
      spoken: `${prompt} ${A.navn} eller ${B.navn}?`,
      visual: { kind: 'mengder', groups: [{ emoji: A.e, n: a }, { emoji: B.e, n: b }] },
      explain: `Det er ${a} ${A.navn} og ${b} ${B.navn}. ${variant === 'flest' ? 'Flest' : 'Færrest'} er ${winner.navn}.`,
      answer,
      options,
    }
  },

  // Størst og minst – for tall.
  storst_minst: ({ max = 20 }, rng) => {
    const a = randInt(0, max, rng)
    let b = randInt(0, max, rng)
    while (b === a) b = randInt(0, max, rng)
    const big = rng() < 0.5
    const answer = big ? Math.max(a, b) : Math.min(a, b)
    return {
      type: 'storst_minst',
      form: 'valg',
      prompt: big ? 'Hvilket tall er størst?' : 'Hvilket tall er minst?',
      spoken: `${big ? 'Hvilket tall er størst' : 'Hvilket tall er minst'}: ${a} eller ${b}?`,
      visual: { kind: 'stor', text: `${a}   ${b}` },
      explain: `${answer} er ${big ? 'størst' : 'minst'}.`,
      answer,
      options: shuffle([a, b], rng),
    }
  },

  // Sant eller usant: «7 er mer enn 5».
  sammenlign: ({ max = 20 }, rng) => {
    const a = randInt(0, max, rng)
    let b = randInt(0, max, rng)
    while (b === a) b = randInt(0, max, rng)
    const mer = rng() < 0.5
    const claim = `${a} er ${mer ? 'mer' : 'mindre'} enn ${b}`
    const truth = mer ? a > b : a < b
    return santUsant(
      {
        type: 'sammenlign',
        prompt: `Sant eller usant: ${claim}?`,
        spoken: `Sant eller usant: ${claim}?`,
        visual: { kind: 'stor', text: `${a}  ${mer ? '>' : '<'}  ${b}` },
        explain: truth ? `Sant. ${claim}.` : `Usant. ${a} er ${a > b ? 'mer' : 'mindre'} enn ${b}.`,
      },
      truth,
    )
  },

  // Dele opp tall: 5 = 2 + ?
  dele_opp: ({ max = 5 }, rng) => {
    const total = randInt(2, max, rng)
    const a = randInt(0, total, rng)
    const answer = total - a
    const em = pick(EMOJIS, rng)
    return valg(
      {
        type: 'dele_opp',
        prompt: `${total} = ${a} + ?`,
        spoken: `${total} er ${a} pluss hva?`,
        visual: { kind: 'deling', total, a, emoji: em.e },
        explain: `${a} + ${answer} = ${total}.`,
        readOptions: true,
      },
      answer,
      naer(answer, { min: 0, max: max, rng }),
      rng,
    )
  },

  // Pluss innenfor max (flervalg, med tellebilder som hjelp).
  pluss_valg: ({ max = 5 }, rng) => {
    const a = randInt(0, max, rng)
    const b = randInt(0, max - a, rng)
    const em = pick(EMOJIS, rng)
    return valg(
      {
        type: 'pluss_innen_10',
        prompt: `${a} + ${b} = ?`,
        spoken: `${a} pluss ${b}?`,
        hjelp: { kind: 'pluss', a, b, emoji: em.e },
        explain: `${a} + ${b} = ${a + b}. Tell videre fra ${a}: ${b} til.`,
        readOptions: true,
      },
      a + b,
      naer(a + b, { min: 0, max: max + 2, rng }),
      rng,
    )
  },
  minus_valg: ({ max = 5 }, rng) => {
    const a = randInt(1, max, rng)
    const b = randInt(0, a, rng)
    const em = pick(EMOJIS, rng)
    return valg(
      {
        type: 'minus_innen_10',
        prompt: `${a} − ${b} = ?`,
        spoken: `${a} minus ${b}?`,
        hjelp: { kind: 'minus', a, b, emoji: em.e },
        explain: `${a} − ${b} = ${a - b}. Ta bort ${b} fra ${a}.`,
        readOptions: true,
      },
      a - b,
      naer(a - b, { min: 0, max: max + 2, rng }),
      rng,
    )
  },

  // Sorter tallene fra minst til størst (trykk i rekkefølge).
  sorter_tall: ({ max = 20, n = 4, min = 0 }, rng) => {
    const set = new Set()
    let guard = 0
    while (set.size < n && guard++ < 200) set.add(randInt(min, max, rng))
    const tall = [...set]
    const answer = [...tall].sort((a, b) => a - b)
    return {
      type: 'sorter_tall',
      form: 'sorter',
      prompt: 'Trykk på tallene fra minst til størst.',
      spoken: `Trykk på tallene fra minst til størst: ${shuffle(tall, rng).join(', ')}.`,
      items: shuffle(tall, rng),
      answer,
      explain: `Fra minst til størst: ${answer.join(', ')}.`,
    }
  },

  // Dra til tallinja: trykk der tallet hører hjemme.
  tallinje_plasser: ({ from = 0, to = 20, step = 1, labelEvery = 5 }, rng) => {
    const steg = Math.floor((to - from) / step)
    let n = from + step * randInt(0, steg, rng)
    // Ikke spør om tall som står skrevet på linja.
    let guard = 0
    while ((n - from) % labelEvery === 0 && guard++ < 50) n = from + step * randInt(0, steg, rng)
    const under = Math.floor((n - from) / labelEvery) * labelEvery + from
    return {
      type: 'tallinje_plasser',
      form: 'tallinje',
      prompt: `Hvor på tallinja er ${n}?`,
      spoken: `Trykk der ${n} er på tallinja.`,
      line: { from, to, step, labelEvery },
      answer: n,
      explain: `${n} ligger ${n - under} ${n - under === 1 ? 'strek' : 'streker'} til høyre for ${under}.`,
    }
  },
}

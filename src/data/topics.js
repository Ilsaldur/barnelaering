// Temaer med nivåstige. Hvert tema har en liste `levels` som blir gradvis
// vanskeligere. Nivåene kan alltid prøves (ingen stenges ute).
//
// Et nivå = { sub, engine, config }. Tall, telling og klokke GENERERES
// (uendelig variasjon); feilsvarene lages tett på fasit (én for mye, én for lite).
//
// Matte (telling, pluss/minus, gange, brøk) ligger ikke her lenger, men i
// mattestigen (src/data/matte/nivaer.js). Generatorene under brukes av tester
// og kan gjenbrukes.

import { COLORS, SHAPES } from './levels.js'
import { randInt, pick, shuffle } from '../lib/rng.js'
import { nearDistractors, makeOptions } from '../lib/distractors.js'

// ---- Generatorer (lager nye oppgaver hver gang) -----------------------------
const COUNT_EMOJIS = [
  { e: '🍎', navn: 'eplene' },
  { e: '🎈', navn: 'ballongene' },
  { e: '⭐', navn: 'stjernene' },
  { e: '🍓', navn: 'jordbærene' },
  { e: '🐠', navn: 'fiskene' },
  { e: '🌸', navn: 'blomstene' },
  { e: '🍪', navn: 'kjeksene' },
  { e: '🚗', navn: 'bilene' },
  { e: '🐶', navn: 'hundene' },
  { e: '🌳', navn: 'trærne' },
  { e: '🐝', navn: 'biene' },
  { e: '🦋', navn: 'sommerfuglene' },
  { e: '🐞', navn: 'marihønene' },
  { e: '🍒', navn: 'kirsebærene' },
]

const str = (arr) => arr.map(String)

// Tell ting (viser emojis) opp til maxN. Feilsvar: én for mye, én for lite …
function countingGen(maxN, minN = 1) {
  return () => {
    const n = randInt(minN, maxN)
    const show = pick(COUNT_EMOJIS).e
    return {
      key: `tell:${n}:${show}`,
      show,
      count: n,
      answer: String(n),
      prompt: 'Hvor mange er det?',
      options: str(makeOptions(n, nearDistractors(n, { min: 1, max: maxN + 2 }))),
    }
  }
}

// Flest eller færrest: to mengder side om side, svar ved å trykke på bildet.
function moreLessGen(maxN) {
  return () => {
    const [A, B] = shuffle(COUNT_EMOJIS).slice(0, 2)
    let a = randInt(1, maxN)
    let b = randInt(1, maxN)
    while (b === a) b = randInt(1, maxN)
    const most = Math.random() < 0.5
    const winner = most ? (a > b ? A : B) : a < b ? A : B
    const prompt = most ? 'Hvor er det flest?' : 'Hvor er det færrest?'
    return {
      key: `${most ? 'flest' : 'faerrest'}:${A.e}${a}:${B.e}${b}`,
      prompt,
      groups: [
        { emoji: A.e, count: a },
        { emoji: B.e, count: b },
      ],
      options: [A.e, B.e],
      answer: winner.e,
      say: `${prompt} ${A.navn} eller ${B.navn}?`,
    }
  }
}

// Hvilket tall er størst / minst?
function biggerGen(maxN) {
  return () => {
    let a = randInt(1, maxN)
    let b = randInt(1, maxN)
    while (b === a) b = randInt(1, maxN)
    const big = Math.random() < 0.5
    const prompt = big ? 'Hvilket tall er størst?' : 'Hvilket tall er minst?'
    const answer = big ? Math.max(a, b) : Math.min(a, b)
    return {
      key: `${big ? 'storst' : 'minst'}:${Math.min(a, b)}:${Math.max(a, b)}`,
      prompt,
      show: `${a}  eller  ${b}`,
      options: str(shuffle([a, b])),
      answer: String(answer),
      say: `${prompt} ${a} eller ${b}?`,
    }
  }
}

// Hvilket tall kommer før / etter?
function beforeAfterGen(maxN) {
  return () => {
    const after = Math.random() < 0.5
    const n = after ? randInt(0, maxN - 1) : randInt(1, maxN)
    const answer = after ? n + 1 : n - 1
    return {
      key: `${after ? 'etter' : 'for'}:${n}`,
      prompt: after ? `Hvilket tall kommer etter ${n}?` : `Hvilket tall kommer før ${n}?`,
      show: after ? `${n}, ?` : `?, ${n}`,
      answer: String(answer),
      options: str(makeOptions(answer, nearDistractors(answer, { min: 0, max: maxN + 2 }))),
    }
  }
}

// Hvilket tall mangler i rekka?
function missingGen(maxN) {
  return () => {
    const start = randInt(0, maxN - 4)
    const hole = randInt(1, 3)
    const seq = [0, 1, 2, 3, 4].map((i) => start + i)
    const answer = seq[hole]
    const shown = seq.map((v, i) => (i === hole ? '?' : String(v)))
    return {
      key: `mangler:${start}:${hole}`,
      prompt: 'Hvilket tall mangler?',
      show: shown.join('  '),
      answer: String(answer),
      options: str(makeOptions(answer, nearDistractors(answer, { min: 0, max: maxN + 2 }))),
      say: `Hvilket tall mangler? ${shown.map((x) => (x === '?' ? 'hva' : x)).join(', ')}`,
    }
  }
}

export const TOPICS = [
  {
    id: 'former',
    title: 'Former og mønster',
    emoji: '🔺',
    color: 'bg-orange-500',
    levels: [
      { sub: 'Hvilken form?', engine: 'quiz', config: { ...SHAPES } },
      { sub: 'Mønster og sortering', engine: 'patterns', config: {} },
    ],
  },
  {
    id: 'farger',
    title: 'Farger',
    emoji: '🎨',
    color: 'bg-fuchsia-500',
    levels: [
      { sub: 'Grunnfarger', engine: 'quiz', config: { ...COLORS, bank: COLORS.bank.slice(0, 8) } },
      { sub: 'Alle farger', engine: 'quiz', config: { ...COLORS } },
    ],
  },
]

export function topicById(id) {
  return TOPICS.find((t) => t.id === id) || null
}

// Eksportert til tester.
export const GENERATORS = { countingGen, moreLessGen, biggerGen, beforeAfterGen, missingGen }

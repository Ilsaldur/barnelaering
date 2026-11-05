// Temaer med nivåstige. Hvert tema har en liste `levels` som blir gradvis
// vanskeligere. Nivåene kan alltid prøves (ingen stenges ute).
//
// Et nivå = { sub, engine, config }. Tall, telling og klokke GENERERES
// (uendelig variasjon); feilsvarene lages tett på fasit (én for mye, én for lite).
//
// Mellomtrinnet mellom barnehage og 1. klasse ligger i «Tall og telling»
// (telle til 20, før og etter, mer og mindre) og «Pluss og minus» (til 10).

import { COLORS, SHAPES, FIRST_LETTER, LETTER_SOUNDS, OPPOSITES, FRACTIONS } from './levels.js'
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

const tellCfg = (sub, extra) => ({ title: 'Telling', emoji: '🔢', color: 'bg-rose-500', rounds: 8, readOptions: true, ...extra })

export const TOPICS = [
  {
    id: 'telling',
    title: 'Tall og telling',
    emoji: '🔢',
    color: 'bg-rose-500',
    levels: [
      { sub: 'Tell 1 til 5', engine: 'quiz', config: tellCfg('tell5', { prompt: 'Hvor mange er det?', generator: countingGen(5) }) },
      { sub: 'Tell 1 til 10', engine: 'quiz', config: tellCfg('tell10', { prompt: 'Hvor mange er det?', generator: countingGen(10, 3) }) },
      { sub: 'Flest eller færrest?', engine: 'quiz', config: tellCfg('flest', { title: 'Flest og færrest', emoji: '⚖️', readOptions: false, generator: moreLessGen(8) }) },
      { sub: 'Tell 1 til 20', engine: 'quiz', config: tellCfg('tell20', { prompt: 'Hvor mange er det?', generator: countingGen(20, 6) }) },
      { sub: 'Hvilket tall er størst og minst?', engine: 'quiz', config: tellCfg('storst', { title: 'Størst og minst', readOptions: false, generator: biggerGen(20) }) },
      { sub: 'Før og etter, til 20', engine: 'quiz', config: tellCfg('foretter20', { title: 'Før og etter', generator: beforeAfterGen(20) }) },
      { sub: 'Hvilket tall mangler? (til 20)', engine: 'quiz', config: tellCfg('mangler20', { title: 'Tallrekka', readOptions: false, generator: missingGen(20) }) },
      { sub: 'Før og etter, til 100', engine: 'quiz', config: tellCfg('foretter100', { title: 'Før og etter', readOptions: false, generator: beforeAfterGen(100) }) },
    ],
  },
  {
    id: 'pluss',
    title: 'Pluss og minus',
    emoji: '➕',
    color: 'bg-pink-500',
    levels: [
      { sub: 'Pluss, tall 1–10', engine: 'math', config: { title: 'Pluss', emoji: '➕', color: 'bg-pink-500', ops: ['add'], max: 10 } },
      { sub: 'Pluss og minus, 1–10', engine: 'math', config: { title: 'Pluss og minus', emoji: '➕', color: 'bg-pink-500', ops: ['add', 'sub'], max: 10 } },
      { sub: 'Pluss og minus, 1–20', engine: 'math', config: { title: 'Pluss og minus', emoji: '➕', color: 'bg-pink-500', ops: ['add', 'sub'], max: 20 } },
      { sub: 'Pluss og minus, 1–50', engine: 'math', config: { title: 'Pluss og minus', emoji: '➕', color: 'bg-pink-500', ops: ['add', 'sub'], max: 50 } },
      { sub: 'Pluss og minus, 1–100', engine: 'math', config: { title: 'Pluss og minus', emoji: '➕', color: 'bg-pink-500', ops: ['add', 'sub'], max: 100 } },
    ],
  },
  {
    id: 'gange',
    title: 'Gange og deling',
    emoji: '✖️',
    color: 'bg-rose-600',
    levels: [
      { sub: '2-, 5- og 10-gangen', engine: 'math', config: { title: 'Gangetabell', emoji: '✖️', color: 'bg-rose-600', ops: ['mul'], mulFactors: [2, 5, 10] } },
      { sub: 'Hele gangetabellen', engine: 'math', config: { title: 'Gangetabell', emoji: '✖️', color: 'bg-rose-600', ops: ['mul'], mulMax: 10 } },
      { sub: 'Deling', engine: 'math', config: { title: 'Deling', emoji: '➗', color: 'bg-rose-600', ops: ['div'], divMax: 10 } },
      { sub: 'Gange og deling', engine: 'math', config: { title: 'Gange og deling', emoji: '✖️', color: 'bg-rose-600', ops: ['mul', 'div'], mulMax: 10, divMax: 10 } },
    ],
  },
  {
    id: 'bokstaver',
    title: 'Bokstaver og lyder',
    emoji: '🅰️',
    color: 'bg-emerald-500',
    levels: [
      { sub: 'Første bokstav', engine: 'quiz', config: { ...FIRST_LETTER } },
      { sub: 'Finn ordet', engine: 'quiz', config: { ...LETTER_SOUNDS } },
    ],
  },
  {
    id: 'ord',
    title: 'Ord og lesing',
    emoji: '🔤',
    color: 'bg-violet-500',
    levels: [
      { sub: 'Korte ord', engine: 'words', config: { title: 'Ord', emoji: '🔤', maxLen: 4 } },
      { sub: 'Lengre ord', engine: 'words', config: { title: 'Ord', emoji: '🔤', maxLen: 6 } },
      { sub: 'Alle ord', engine: 'words', config: { title: 'Ord og lesing', emoji: '🔤' } },
    ],
  },
  {
    id: 'klokke',
    title: 'Klokka',
    emoji: '🕐',
    color: 'bg-indigo-500',
    levels: [
      { sub: 'Hele timer', engine: 'clock', config: { title: 'Hele timer', minutes: 'whole' } },
      { sub: 'Hele og halve timer', engine: 'clock', config: { title: 'Hele og halve', minutes: 'half' } },
      { sub: 'Kvarter', engine: 'clock', config: { title: 'Kvarter', minutes: 'quarter' } },
      { sub: 'Til 5 minutter', engine: 'clock', config: { title: 'Til 5 minutter', minutes: 'five' } },
    ],
  },
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
  {
    id: 'motsatt',
    title: 'Motsetninger',
    emoji: '↔️',
    color: 'bg-cyan-500',
    levels: [{ sub: 'Hva er motsatt?', engine: 'quiz', config: { ...OPPOSITES } }],
  },
  {
    id: 'geografi',
    title: 'Land og flagg',
    emoji: '🌍',
    color: 'bg-teal-500',
    levels: [
      { sub: 'Norden', engine: 'geography', config: { region: 'norden' } },
      { sub: 'Europa', engine: 'geography', config: { region: 'europa' } },
      { sub: 'Hele verden', engine: 'geography', config: { region: 'verden' } },
    ],
  },
  {
    id: 'brok',
    title: 'Brøk og halvparten',
    emoji: '🍕',
    color: 'bg-amber-600',
    levels: [{ sub: 'Halvparten og brøk', engine: 'quiz', config: { ...FRACTIONS } }],
  },
]

export function topicById(id) {
  return TOPICS.find((t) => t.id === id) || null
}

// Eksportert til tester.
export const GENERATORS = { countingGen, moreLessGen, biggerGen, beforeAfterGen, missingGen }

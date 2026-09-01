// Temaer med nivåstige. Hvert tema har en liste `levels` som blir gradvis
// vanskeligere. Nivåene er alltid prøvbare (ingen stenges ute), men det å klare
// dem i rekkefølge gir opplåsings-belønningen ("få nye ting").
//
// Et nivå = { sub, engine, config }. Repetisjon unngås ved at tall/telling/
// klokke GENERERES (uendelig variasjon).

import { COLORS, SHAPES, FIRST_LETTER, LETTER_SOUNDS, OPPOSITES, FRACTIONS } from './levels.js'

// ---- Generatorer (lager nye oppgaver hver gang) -----------------------------
const COUNT_EMOJIS = ['🍎', '🎈', '⭐', '🍓', '🐠', '🌸', '🍪', '🚗', '🐶', '🌳', '🐝', '🦋', '🐞', '🍒']

function ri(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function sh(a) {
  return [...a].sort(() => Math.random() - 0.5)
}

// Tell ting (viser emojis) opp til maxN.
function countingGen(maxN) {
  return () => {
    const n = ri(1, maxN)
    const show = COUNT_EMOJIS[ri(0, COUNT_EMOJIS.length - 1)]
    const opts = new Set([n])
    let guard = 0
    while (opts.size < 4 && guard < 40) {
      guard++
      const c = n + ri(-3, 3)
      if (c >= 1 && c <= maxN + 3) opts.add(c)
    }
    let k = 1
    while (opts.size < 4) opts.add(n + k++)
    return { show, count: n, answer: String(n), prompt: 'Hvor mange er det?', options: sh([...opts]).map(String) }
  }
}

// Hvilket tall er størst?
function biggerGen(maxN) {
  return () => {
    let a = ri(1, maxN)
    let b = ri(1, maxN)
    while (b === a) b = ri(1, maxN)
    return { prompt: 'Hvilket tall er størst?', show: `${a}  vs  ${b}`, options: sh([String(a), String(b)]), answer: String(Math.max(a, b)) }
  }
}

// Hvilket tall kommer etter?
function nextNumGen(maxN) {
  return () => {
    const n = ri(0, maxN - 1)
    const answer = n + 1
    const opts = new Set([answer])
    let guard = 0
    while (opts.size < 4 && guard < 40) {
      guard++
      const c = answer + ri(-3, 3)
      if (c >= 0) opts.add(c)
    }
    let k = 1
    while (opts.size < 4) opts.add(answer + k++)
    return { prompt: `Hvilket tall kommer etter ${n}?`, options: sh([...opts]).map(String), answer: String(answer) }
  }
}

const countCfg = (maxN, rounds) => ({
  title: 'Telling',
  emoji: '🔢',
  color: 'bg-rose-500',
  prompt: 'Hvor mange er det?',
  rounds,
  generator: countingGen(maxN),
})

export const TOPICS = [
  {
    id: 'telling',
    title: 'Tall og telling',
    emoji: '🔢',
    color: 'bg-rose-500',
    levels: [
      { sub: 'Tell 1 til 5', engine: 'quiz', config: countCfg(5, 6) },
      { sub: 'Tell 1 til 10', engine: 'quiz', config: countCfg(10, 7) },
      { sub: 'Tell 1 til 20', engine: 'quiz', config: countCfg(20, 8) },
      { sub: 'Hvilket tall er størst?', engine: 'quiz', config: { title: 'Størst', emoji: '🔢', color: 'bg-rose-500', rounds: 8, generator: biggerGen(20) } },
      { sub: 'Hvilket tall kommer etter?', engine: 'quiz', config: { title: 'Tallrekke', emoji: '🔢', color: 'bg-rose-500', rounds: 8, generator: nextNumGen(50) } },
    ],
  },
  {
    id: 'pluss',
    title: 'Pluss og minus',
    emoji: '➕',
    color: 'bg-pink-500',
    levels: [
      { sub: 'Pluss, tall 1–10', engine: 'math', config: { title: 'Pluss', emoji: '➕', color: 'bg-pink-500', ops: ['add'], max: 10 } },
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
      { sub: 'Første bokstav', engine: 'quiz', config: { ...FIRST_LETTER, rounds: 7 } },
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
      { sub: 'Grunnfarger', engine: 'quiz', config: { title: 'Farger', emoji: '🎨', color: 'bg-fuchsia-500', prompt: 'Hvilken farge er dette?', rounds: 6, bank: COLORS.bank.slice(0, 6) } },
      { sub: 'Alle farger', engine: 'quiz', config: { ...COLORS, rounds: 8 } },
    ],
  },
  {
    id: 'motsatt',
    title: 'Motsetninger',
    emoji: '↔️',
    color: 'bg-cyan-500',
    levels: [{ sub: 'Hva er motsatt?', engine: 'quiz', config: { ...OPPOSITES, rounds: 7 } }],
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
    levels: [{ sub: 'Halvparten og brøk', engine: 'quiz', config: { ...FRACTIONS, rounds: 7 } }],
  },
]

export function topicById(id) {
  return TOPICS.find((t) => t.id === id) || null
}

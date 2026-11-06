// Felles byggeklosser for oppgavegeneratorene.
import { shuffle, randInt, pick } from '../rng.js'
import { nearDistractors, mathDistractors } from '../distractors.js'

export { shuffle, randInt, pick, nearDistractors, mathDistractors }

export const EMOJIS = [
  { e: '🍎', navn: 'epler' },
  { e: '🎈', navn: 'ballonger' },
  { e: '⭐', navn: 'stjerner' },
  { e: '🍓', navn: 'jordbær' },
  { e: '🐠', navn: 'fisker' },
  { e: '🌸', navn: 'blomster' },
  { e: '🍪', navn: 'kjeks' },
  { e: '🚗', navn: 'biler' },
  { e: '🐶', navn: 'hunder' },
  { e: '🐝', navn: 'bier' },
  { e: '🦋', navn: 'sommerfugler' },
  { e: '🍒', navn: 'kirsebær' },
]

// Norsk tallformat: komma som desimaltegn.
export function fmt(n) {
  if (typeof n !== 'number') return String(n)
  return String(Math.round(n * 100) / 100).replace('.', ',')
}

// Flervalg: fasit pluss feilsvar i tilfeldig rekkefølge.
export function valg(task, answer, distractors, rng = Math.random) {
  const seen = new Set([String(answer)])
  const ds = []
  for (const d of distractors) {
    if (seen.has(String(d))) continue
    seen.add(String(d))
    ds.push(d)
  }
  return { ...task, form: 'valg', answer, options: shuffle([answer, ...ds], rng) }
}

// Svar skrives på talltastatur.
export function tast(task, answer, extra = {}) {
  return { ...task, form: 'tastatur', answer, ...extra }
}

export function santUsant(task, answer) {
  return { ...task, form: 'santusant', answer: !!answer }
}

// Tall-feilsvar nær fasit (én for mye, én for lite …), aldri negative.
export function naer(answer, { count = 3, min = 0, max = Infinity, rng = Math.random } = {}) {
  return nearDistractors(answer, { count, min, max, rng })
}

// Feilsvar for regnestykker.
export function regneFeil(type, a, b, answer, rng = Math.random) {
  return mathDistractors({ type, a, b, answer }, { rng })
}

// Oppgavetekst med en ukjent på ulike plasser. Gir { text, spoken }.
export function apen(a, op, b, c, hole) {
  const sym = { add: '+', sub: '−', mul: '×', div: '÷' }[op]
  const word = { add: 'pluss', sub: 'minus', mul: 'ganger', div: 'delt på' }[op]
  const parts = [a, b, c].map((v, i) => (i === hole ? '?' : fmt(v)))
  const spokenParts = [a, b, c].map((v, i) => (i === hole ? 'hva' : fmt(v)))
  return {
    text: `${parts[0]} ${sym} ${parts[1]} = ${parts[2]}`,
    spoken: `${spokenParts[0]} ${word} ${spokenParts[1]} er lik ${spokenParts[2]}`,
  }
}

export function tiere(n) {
  return Math.floor(n / 10) % 10
}
export function enere(n) {
  return n % 10
}

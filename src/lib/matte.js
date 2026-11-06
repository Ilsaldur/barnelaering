// Regnestykker som rene funksjoner (ingen React), så de kan testes.
import { randInt, pick } from './rng.js'
import { mathDistractors, makeOptions } from './distractors.js'
import { uniqueRound, ROUND_LENGTH } from './round.js'

// Fyll ut standardverdier for et sett regne-parametre.
export function fullParams(p = {}) {
  return {
    ops: p.ops || ['add', 'sub'],
    max: p.max || 20,
    mulMax: p.mulMax || 5,
    mulFactors: p.mulFactors || null,
    divMax: p.divMax || 10,
  }
}

// Lag ett regnestykke ut fra parametrene. Svar er aldri negativt.
export function makeProblem(params, rng = Math.random) {
  const op = pick(params.ops, rng)

  if (op === 'mul') {
    const a = params.mulFactors ? pick(params.mulFactors, rng) : randInt(1, params.mulMax, rng)
    const b = randInt(1, params.mulFactors ? 10 : params.mulMax, rng)
    return { type: 'mul', a, b, answer: a * b, text: `${a} × ${b}`, spoken: `${a} ganger ${b}` }
  }
  if (op === 'div') {
    const b = randInt(2, params.divMax, rng)
    const ans = randInt(2, params.divMax, rng)
    const a = b * ans
    return { type: 'div', a, b, answer: ans, text: `${a} ÷ ${b}`, spoken: `${a} delt på ${b}` }
  }
  if (op === 'add') {
    const a = randInt(1, Math.max(1, Math.floor(params.max / 2)), rng)
    const b = randInt(1, Math.max(1, params.max - a), rng)
    return { type: 'add', a, b, answer: a + b, text: `${a} + ${b}`, spoken: `${a} pluss ${b}` }
  }
  // sub
  const a = randInt(2, params.max, rng)
  const b = randInt(1, a, rng)
  return { type: 'sub', a, b, answer: a - b, text: `${a} − ${b}`, spoken: `${a} minus ${b}` }
}

export function problemKey(p) {
  return `${p.type}:${p.a}:${p.b}`
}

// Kan oppgaven vises med tellebilder og tallinje 0–20?
export function hasVisualHelp(p) {
  if (p.type !== 'add' && p.type !== 'sub') return false
  return p.a <= 20 && p.b <= 20 && p.answer <= 20
}

// En hel runde: unike oppgaver med svaralternativer.
export function makeMathRound(params, { n = ROUND_LENGTH, rng = Math.random } = {}) {
  const full = fullParams(params)
  const problems = uniqueRound(() => makeProblem(full, rng), n, { keyOf: problemKey })
  return problems.map((p) => ({
    ...p,
    options: makeOptions(p.answer, mathDistractors(p, { rng }), rng),
  }))
}

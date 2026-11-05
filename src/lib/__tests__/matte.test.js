import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { makeProblem, makeMathRound, fullParams, hasVisualHelp, problemKey } from '../matte.js'
import { uniqueRound, drawFromBank } from '../round.js'
import { shuffle } from '../rng.js'

describe('makeProblem', () => {
  it('holder seg innenfor max og gir aldri negative svar', () => {
    const rng = seeded(1)
    const p = fullParams({ ops: ['add', 'sub'], max: 10 })
    for (let i = 0; i < 500; i++) {
      const q = makeProblem(p, rng)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThanOrEqual(10)
      expect(q.a).toBeLessThanOrEqual(10)
    }
  })
  it('gange bruker oppgitte tabeller', () => {
    const rng = seeded(2)
    const p = fullParams({ ops: ['mul'], mulFactors: [2, 5, 10] })
    for (let i = 0; i < 100; i++) {
      const q = makeProblem(p, rng)
      expect([2, 5, 10]).toContain(q.a)
      expect(q.answer).toBe(q.a * q.b)
    }
  })
  it('deling går alltid opp', () => {
    const rng = seeded(3)
    const p = fullParams({ ops: ['div'], divMax: 10 })
    for (let i = 0; i < 100; i++) {
      const q = makeProblem(p, rng)
      expect(q.a % q.b).toBe(0)
      expect(q.answer).toBe(q.a / q.b)
    }
  })
})

describe('makeMathRound', () => {
  it('åtte unike oppgaver med fire alternativer der fasit er med', () => {
    const rng = seeded(4)
    for (let k = 0; k < 50; k++) {
      const round = makeMathRound({ ops: ['add', 'sub'], max: 20 }, { rng })
      expect(round).toHaveLength(8)
      expect(new Set(round.map(problemKey)).size).toBe(8)
      for (const q of round) {
        expect(q.options).toHaveLength(4)
        expect(q.options).toContain(q.answer)
        expect(new Set(q.options).size).toBe(4)
      }
    }
  })
})

describe('hasVisualHelp', () => {
  it('tallinje bare når alt er innenfor 0–20', () => {
    expect(hasVisualHelp({ type: 'add', a: 3, b: 4, answer: 7 })).toBe(true)
    expect(hasVisualHelp({ type: 'add', a: 3, b: 90, answer: 93 })).toBe(false)
    expect(hasVisualHelp({ type: 'mul', a: 2, b: 3, answer: 6 })).toBe(false)
  })
})

describe('uniqueRound og drawFromBank', () => {
  it('uniqueRound gir ingen like nøkler', () => {
    const rng = seeded(5)
    const r = uniqueRound(() => Math.floor(rng() * 20), 8, { keyOf: (x) => x })
    expect(new Set(r).size).toBe(8)
  })
  it('uniqueRound fyller på når mengden er for liten', () => {
    const r = uniqueRound(() => 1, 3, { keyOf: (x) => x, maxTries: 10 })
    expect(r).toHaveLength(3)
  })
  it('drawFromBank trekker uten gjentakelse når banken er stor nok', () => {
    const bank = Array.from({ length: 12 }, (_, i) => ({ id: i }))
    const r = drawFromBank(bank, 8, (a) => shuffle(a, seeded(6)))
    expect(new Set(r.map((x) => x.id)).size).toBe(8)
  })
})

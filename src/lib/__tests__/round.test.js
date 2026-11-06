import { describe, it, expect } from 'vitest'
import { uniqueRound, drawFromBank } from '../round.js'
import { shuffle, seeded } from '../rng.js'

describe('uniqueRound og drawFromBank', () => {
  it('uniqueRound gir ingen like nøkler', () => {
    const rng = seeded(5)
    const r = uniqueRound(() => Math.floor(rng() * 20), 8, { keyOf: (x) => x })
    expect(new Set(r).size).toBe(8)
  })
  it('uniqueRound fyller på når mengden er for liten', () => {
    expect(uniqueRound(() => 1, 3, { keyOf: (x) => x, maxTries: 10 })).toHaveLength(3)
  })
  it('drawFromBank trekker uten gjentakelse når banken er stor nok', () => {
    const bank = Array.from({ length: 12 }, (_, i) => ({ id: i }))
    const r = drawFromBank(bank, 8, (a) => shuffle(a, seeded(6)))
    expect(new Set(r.map((x) => x.id)).size).toBe(8)
  })
})

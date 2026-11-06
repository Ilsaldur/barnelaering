import { describe, it, expect } from 'vitest'
import { starsFor, celebrate, resultMessage } from '../scoring.js'

describe('starsFor (runde på åtte)', () => {
  it('0–3 riktige gir ingen stjerner', () => {
    for (const c of [0, 1, 2, 3]) expect(starsFor(c, 8)).toBe(0)
  })
  it('4–5 riktige gir én', () => {
    expect(starsFor(4, 8)).toBe(1)
    expect(starsFor(5, 8)).toBe(1)
  })
  it('6–7 riktige gir to', () => {
    expect(starsFor(6, 8)).toBe(2)
    expect(starsFor(7, 8)).toBe(2)
  })
  it('8 av 8 gir tre', () => {
    expect(starsFor(8, 8)).toBe(3)
  })
  it('tåler tomme runder', () => {
    expect(starsFor(0, 0)).toBe(0)
  })
})

describe('feiring og melding', () => {
  it('feirer bare fra to stjerner', () => {
    expect(celebrate(0)).toBe(false)
    expect(celebrate(1)).toBe(false)
    expect(celebrate(2)).toBe(true)
    expect(celebrate(3)).toBe(true)
  })
  it('sier ikke «Bra jobba» ved svakt resultat', () => {
    expect(resultMessage(0, 1, 8)).not.toMatch(/Bra jobba/)
    expect(resultMessage(1, 4, 8)).not.toMatch(/Bra jobba/)
    expect(resultMessage(2, 6, 8)).toMatch(/Bra jobba/)
  })
})

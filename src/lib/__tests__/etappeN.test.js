// Etappe N (runde 4): tallinja rulles til starttallet.
import { describe, it, expect } from 'vitest'
import { rullTil, synligeTall, rullefeltBredde, CELLE_PX, GAP_PX } from '../tallinje.js'

describe('N – tallinja', () => {
  it('rulles slik at starttallet står til venstre', () => {
    expect(rullTil(0)).toBe(0)
    expect(rullTil(null)).toBe(0)
    expect(rullTil(7)).toBe(7 * (CELLE_PX + GAP_PX))
    expect(synligeTall(rullTil(7), 280)[0]).toBe(7)
  })
  it('akseptansetest 2: ved bredde 360 med hjelpen åpen på 7 + 4 er både 7 og 11 synlige uten rulling', () => {
    const bredde = rullefeltBredde(360)
    const synlig = synligeTall(rullTil(7), bredde)
    expect(synlig).toContain(7)
    expect(synlig).toContain(11)
    // Og det samme på de andre mobilbreddene.
    for (const w of [320, 390, 412]) {
      const s = synligeTall(rullTil(7), rullefeltBredde(w))
      expect(s, `${w}`).toContain(7)
      expect(s, `${w}`).toContain(11)
    }
  })
  it('uten rulling ville 11 ligget utenfor på de smaleste skjermene', () => {
    expect(synligeTall(0, rullefeltBredde(320))).not.toContain(11)
  })
})

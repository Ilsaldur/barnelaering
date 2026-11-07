// Etappe S (runde 5): usynlig plassering – det første oppdraget finner nivået.
import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { startFinn, stegFinn, simulerBarn, minLengde, maksLengde, framdrift } from '../matte/finnNivaa.js'

const kjor = (svar, opts = { maks: 38 }) => {
  let s = startFinn(opts)
  const nivaaer = []
  while (!s.ferdig) {
    nivaaer.push(s.pos)
    s = stegFinn(s, svar(s.pos, nivaaer.length))
  }
  return { s, nivaaer }
}

describe('S – reglene', () => {
  it('hopper 1, 2, 4, 8, 16, 32, 38 ved riktige svar, så to på toppen', () => {
    const { s, nivaaer } = kjor(() => true)
    expect(nivaaer).toEqual([1, 2, 4, 8, 16, 32, 38, 38, 38])
    expect(s.nivaa).toBe(38)
    expect(s.steg).toHaveLength(9)
  })
  it('binært søk mellom siste riktige og første gale, så to på plassen, så vanlige oppgaver', () => {
    // Kan til og med 20. Første bom (32) gir ett nytt spørsmål på 32 (etappe AD).
    const { s, nivaaer } = kjor((n) => n <= 20)
    expect(nivaaer.slice(0, 11)).toEqual([1, 2, 4, 8, 16, 32, 32, 24, 20, 22, 21])
    expect(nivaaer.slice(11, 13)).toEqual([20, 20])
    expect(s.nivaa).toBe(20)
    expect(s.steg.length).toBe(13)
    expect(s.steg.slice(11).every((x) => x.ok)).toBe(true)
    // Uten angre: som i runde 5.
    const u = kjor((n) => n <= 20, { maks: 38, angre: false })
    expect(u.nivaaer.slice(0, 10)).toEqual([1, 2, 4, 8, 16, 32, 24, 20, 22, 21])
  })
  it('bom på første oppgave: lander på 1 og fyller opp til åtte', () => {
    const { s, nivaaer } = kjor(() => false)
    expect(nivaaer[0]).toBe(1)
    expect(s.nivaa).toBe(1)
    expect(s.steg).toHaveLength(8)
    expect(nivaaer.every((n) => n === 1)).toBe(true)
  })
  it('slå fast: én feil flytter ett ned, høyst to ganger, aldri under 1', () => {
    // Riktig på 1, 2, 4, 8; feil på 16 og på det nye spørsmålet på 16; feil på 12, 10, 9 → lander på 8; så feil på 8 → 7; feil på 7 → 6; så alt riktig.
    let teller = 0
    const svarListe = [true, true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true]
    const { s, nivaaer } = kjor(() => svarListe[teller++])
    expect(nivaaer.slice(0, 12)).toEqual([1, 2, 4, 8, 16, 16, 12, 10, 9, 8, 7, 6])
    expect(s.nivaa).toBe(6)
    expect(s.nedflytt).toBe(2)
    // Fra 1 går det ikke lenger ned.
    const u = kjor((n, i) => i === 1) // riktig på 1, så alt galt
    expect(u.s.nivaa).toBe(1)
  })
  it('lengde: minst 8 (5 der nivået har lengde 5), høyst 14 (9)', () => {
    const { s } = kjor(() => true)
    expect(minLengde(s)).toBe(8)
    expect(maksLengde(s)).toBe(14)
    const g = kjor(() => true, { maks: 9, lengdeFor: () => 5 })
    expect(g.s.steg.length).toBeGreaterThanOrEqual(5)
    expect(g.s.steg.length).toBeLessThanOrEqual(9)
    expect(g.s.nivaa).toBe(9)
    // Taket: aldri over (lesing plasserer ikke over 9).
    const l = kjor(() => true, { maks: 12, tak: 9 })
    expect(l.s.nivaa).toBe(9)
    expect(Math.max(...l.nivaaer)).toBe(9)
  })
  it('framdriften er mellom 0 og 1 og øker', () => {
    let s = startFinn({ maks: 38 })
    let f = framdrift(s)
    expect(f).toBeGreaterThanOrEqual(0)
    while (!s.ferdig) {
      s = stegFinn(s, true)
      expect(framdrift(s)).toBeGreaterThanOrEqual(f)
      f = framdrift(s)
    }
    expect(f).toBe(1)
  })
})

describe('Akseptansetester S (simulering med fast frø)', () => {
  it('1. matte: 3000 barn per nivå 1–38 – minst 55 % innen ±1, høyst 15 % mer enn ett for høyt, 8–14 oppgaver, minst 70 % slutter med to riktige', () => {
    const rng = seeded(5)
    let n = 0
    let innen = 0
    let forHoy = 0
    let toRiktige = 0
    for (let kan = 1; kan <= 38; kan++) {
      for (let i = 0; i < 3000; i++) {
        const s = simulerBarn(kan, { maks: 38, rng })
        n++
        const d = s.nivaa - kan
        if (Math.abs(d) <= 1) innen++
        if (d > 1) forHoy++
        const L = s.steg.length
        expect(L).toBeGreaterThanOrEqual(8)
        expect(L).toBeLessThanOrEqual(14)
        if (s.steg[L - 1].ok && s.steg[L - 2].ok) toRiktige++
      }
    }
    expect(innen / n).toBeGreaterThanOrEqual(0.55)
    expect(forHoy / n).toBeLessThanOrEqual(0.15)
    expect(toRiktige / n).toBeGreaterThanOrEqual(0.7)
  })
  it('2. stige med 9 nivåer og lengde 5: 5–9 oppgaver, minst 75 % innen ±1', () => {
    const rng = seeded(9)
    let n = 0
    let innen = 0
    for (let kan = 1; kan <= 9; kan++) {
      for (let i = 0; i < 3000; i++) {
        const s = simulerBarn(kan, { maks: 9, lengdeFor: () => 5, rng })
        n++
        if (Math.abs(s.nivaa - kan) <= 1) innen++
        expect(s.steg.length).toBeGreaterThanOrEqual(5)
        expect(s.steg.length).toBeLessThanOrEqual(9)
      }
    }
    expect(innen / n).toBeGreaterThanOrEqual(0.75)
  })
})

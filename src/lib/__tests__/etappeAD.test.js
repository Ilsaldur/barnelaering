// Etappe AD (runde 6): matteplasseringen kan angre.
import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { startFinn, stegFinn, simulerBarn, ANGRE_KREVER, ANGRE_OPP_MATTE } from '../matte/finnNivaa.js'
import { startForste, gjeldende, svarForste } from '../matte/forsteOppdrag.js'
import { NIVAER_GEO } from '../../data/geo/nivaer.js'
import { genGeo } from '../geo/generatorer.js'
import { emptyFag } from '../profil.js'

const kjor = (svar, opts = { maks: 38 }) => {
  let s = startFinn(opts)
  const nivaaer = []
  while (!s.ferdig) {
    nivaaer.push(s.pos)
    s = stegFinn(s, svar(s.pos, nivaaer.length, s))
  }
  return { s, nivaaer }
}

describe('AD – reglene', () => {
  it('første bom i opp-fasen gir ett nytt spørsmål på samme nivå; riktig der regnes bommen som glipp', () => {
    // Kan til og med 20, men glipper på 8 én gang.
    let glippet = false
    const { s, nivaaer } = kjor((n) => {
      if (n === 8 && !glippet) {
        glippet = true
        return false
      }
      return n <= 20
    })
    expect(nivaaer.slice(0, 7)).toEqual([1, 2, 4, 8, 8, 16, 32])
    expect(s.steg[4].fase).toBe('angre')
    expect(s.nivaa).toBe(20)
  })
  it('galt på det nye spørsmålet: bommen gjelder, og det angres ikke igjen i samme oppdrag', () => {
    const { s, nivaaer } = kjor((n) => n <= 10)
    // 16 galt, nytt spørsmål på 16 galt, så søk 12 (galt), 10, 11 (galt) → 10.
    expect(nivaaer.slice(0, 9)).toEqual([1, 2, 4, 8, 16, 16, 12, 10, 11])
    expect(s.steg.filter((x) => x.fase === 'angre')).toHaveLength(1)
    expect(s.nivaa).toBe(10)
    expect(s.angret).toBe(true)
  })
  it('i søkefasen kreves tre riktige på rad før bommen', () => {
    expect(ANGRE_KREVER).toBe(3)
    expect(ANGRE_OPP_MATTE).toBe(0)
    // Kan til og med 20; angre i opp er brukt opp på 32. Søk: 24 galt → ingen ny prøve (rad 0).
    const { nivaaer } = kjor((n) => n <= 20)
    expect(nivaaer.slice(5, 9)).toEqual([32, 32, 24, 20])
  })
  it('et godtatt glipp som ikke var et glipp: slå fast går galt, og det søkes på nytt nedover', () => {
    // Kan til og med 10, men gjetter riktig på det nye spørsmålet på 16.
    let teller = 0
    const svar = (n, i, st) => {
      teller++
      if (st.angrer) return true // det nye spørsmålet går «riktig»
      return n <= 10
    }
    const { s, nivaaer } = kjor(svar)
    // 16 galt, nytt på 16 riktig → 32 galt → søk 24, 20, 18, 17 galt → land 16 → slå fast 16 galt → søk på nytt mellom 8 og 16.
    expect(nivaaer.slice(0, 11)).toEqual([1, 2, 4, 8, 16, 16, 32, 24, 20, 18, 17])
    expect(nivaaer[11]).toBe(16)
    expect(nivaaer[12]).toBe(12)
    expect(s.nivaa).toBeLessThanOrEqual(11)
    expect(s.steg.length).toBeLessThanOrEqual(14)
    expect(teller).toBe(s.steg.length)
  })
  it('kunnskapsstigene angrer ikke: et heldig gjett ville sendt barnet for høyt', () => {
    const GEO = { nivaer: NIVAER_GEO, gen: genGeo, kunnskap: true }
    const st = startForste({ stige: GEO, fag: emptyFag(), rng: seeded(1) })
    expect(st.finn.angret).toBe(true) // «brukt opp» fra start = av
    let s = st
    const nivaaer = []
    for (let i = 0; i < 12 && !s.ferdig; i++) {
      const t = gjeldende(s)
      if (t.form !== 'vis' && t.tag === 'plassering') nivaaer.push(t.nivaa)
      s = svarForste(s, { ok: t.form === 'vis' || t.nivaa <= 2, forste: true, hjelp: false, vis: t.form === 'vis' })
    }
    expect(nivaaer.slice(0, 4)).toEqual([1, 2, 4, 3])
  })
})

describe('Akseptansetest AD (simulering, «kan til og med nivå k» i matte)', () => {
  it('nivå 10–30: innenfor ±1 i minst 60 %, for lavt (to eller flere) i høyst 25 %, ingen plassering over 14 oppgaver', () => {
    const rng = seeded(5)
    let n = 0
    let innen = 0
    let lav = 0
    let hoy = 0
    for (let kan = 10; kan <= 30; kan++) {
      for (let i = 0; i < 2000; i++) {
        const s = simulerBarn(kan, { maks: 38, rng })
        n++
        const d = s.nivaa - kan
        if (Math.abs(d) <= 1) innen++
        if (d <= -2) lav++
        if (d >= 2) hoy++
        expect(s.steg.length).toBeLessThanOrEqual(14)
        expect(s.steg.length).toBeGreaterThanOrEqual(8)
      }
    }
    // eslint-disable-next-line no-console
    console.log(`matte 10–30: innenfor ±1 ${Math.round((100 * innen) / n)} %, for lavt ${Math.round((100 * lav) / n)} %, for høyt ${Math.round((100 * hoy) / n)} %`)
    expect(innen / n).toBeGreaterThanOrEqual(0.6)
    expect(lav / n).toBeLessThanOrEqual(0.25)
  })
  it('uten angre (runde 5): 50 % innenfor ±1 og 37 % for lavt på samme nivåer – så regelen hjelper', () => {
    const rng = seeded(5)
    let n = 0
    let innen = 0
    let lav = 0
    for (let kan = 10; kan <= 30; kan++) {
      for (let i = 0; i < 1000; i++) {
        const s = simulerBarn(kan, { maks: 38, rng, angre: false })
        n++
        if (Math.abs(s.nivaa - kan) <= 1) innen++
        if (s.nivaa - kan <= -2) lav++
      }
    }
    expect(innen / n).toBeLessThan(0.55)
    expect(lav / n).toBeGreaterThan(0.3)
  })
})

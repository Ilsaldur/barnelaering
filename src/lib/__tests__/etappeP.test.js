// Etappe P (runde 4): flagg, plassering og småfeil.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { seeded } from '../rng.js'
import { startPlassering, stegPlassering, maksOppgaver, TRAPP_MATTE } from '../matte/plassering.js'
import { applyResult } from '../matte/stige.js'
import { buildMission, MATTE_STIGE } from '../matte/oppdrag.js'
import { emptyFag } from '../profil.js'
import { medPunktum } from '../tekst.js'
import { LAND } from '../../data/geo/land.js'
import { NIVAER_GEO } from '../../data/geo/nivaer.js'

describe('P1 – flagg uten nett', () => {
  it('liste.json har alle flaggkodene, og service workeren henter dem ved installasjon', () => {
    const liste = JSON.parse(readFileSync('public/flagg/liste.json', 'utf8'))
    const koder = [...new Set(LAND.map((l) => l.kode))].sort()
    expect(liste).toEqual(koder)
    const sw = readFileSync('public/sw.js', 'utf8')
    expect(sw).toContain("fetch('/flagg/liste.json'")
    expect(sw).toContain('c.add(`/flagg/${k}.svg`)')
    expect(sw).toContain("startsWith('/flagg/')")
  })
})

describe('P2 – plasseringstesten', () => {
  const GEO_TRAPP = [1, 4, 7].map((n) => ({ start: n, tak: NIVAER_GEO.length }))
  it('akseptansetest: Geografi fra Europa, feil på første, så alt riktig → nivå 4, og nummeret er aldri over totalen', () => {
    let s = startPlassering({ start: 4, tak: 9, maks: 9, trapp: GEO_TRAPP })
    const svar = [false, true, true, true, true, true, true, true, true]
    for (const ok of svar) {
      if (s.ferdig) break
      // Oppgavenummeret (steg + 1) er aldri høyere enn totalen.
      expect(s.steg.length + 1).toBeLessThanOrEqual(maksOppgaver(s))
      s = stegPlassering(s, ok)
    }
    expect(s.ferdig).toBe(true)
    expect(s.nivaa).toBe(4)
    expect(s.tak).toBe(4)
  })
  it('etter et fall er taket nivået barnet falt fra, også i matte og uten trapp', () => {
    let s = startPlassering({ start: 29, tak: 38, maks: 38, trapp: TRAPP_MATTE })
    s = stegPlassering(s, false)
    expect(s.pos).toBe(21)
    expect(s.tak).toBe(29)
    let u = startPlassering({ start: 5, tak: 9, maks: 9 })
    u = stegPlassering(u, false)
    expect(u.pos).toBe(3)
    expect(u.tak).toBe(5)
  })
  it('telleren «Oppgave n av m» har aldri n > m, for alle startvalg og svarmønstre', () => {
    const rng = seeded(7)
    for (const start of [1, 4, 7]) {
      for (let k = 0; k < 50; k++) {
        let s = startPlassering({ start, tak: 9, maks: 9, trapp: GEO_TRAPP })
        while (!s.ferdig) {
          expect(s.steg.length + 1).toBeLessThanOrEqual(maksOppgaver(s))
          s = stegPlassering(s, rng() < 0.6)
        }
        expect(maksOppgaver(s)).toBeGreaterThanOrEqual(s.steg.length)
      }
    }
    // Ved start er totalen som før (minst 8).
    expect(maksOppgaver(startPlassering({ start: 1, tak: 7, maks: 38 }))).toBe(8)
  })
})

describe('P3 – toppnivået', () => {
  it('to gode oppdrag på toppnivået gir «hele stigen klart», ikke nivå opp', () => {
    let fag = { ...emptyFag(), nivaa: 38, plassert: true }
    let r = applyResult(fag, { correct: 8, total: 8, nivaa: 38 }, 38)
    expect(r.events.toppKlart).toBe(false)
    expect(r.events.boss).toBeNull()
    r = applyResult(r.fag, { correct: 8, total: 8, nivaa: 38 }, 38)
    expect(r.events.toppKlart).toBe(true)
    expect(r.events.levelUp).toBe(false)
    expect(r.fag.nivaa).toBe(38)
    expect(r.fag.toppKlart).toBe(true)
  })
})

describe('P4 – tekster og bom-liste', () => {
  it('ikke punktum etter en tittel som slutter med spørsmålstegn', () => {
    expect(medPunktum('Du starter på nivå 9: Lengre tekster: fakta eller mening?')).toBe('Du starter på nivå 9: Lengre tekster: fakta eller mening?')
    expect(medPunktum('Du starter på nivå 3: Halve timer')).toBe('Du starter på nivå 3: Halve timer.')
    expect(medPunktum('Hurra!')).toBe('Hurra!')
  })
  it('svake oppgaver for velg_regneart, tall_10000 og likning lages med riktig type', () => {
    const rng = seeded(31)
    for (const [nivaa, type] of [
      [30, 'velg_regneart'],
      [31, 'tall_10000'],
      [38, 'likning'],
    ]) {
      let treff = 0
      let total = 0
      for (let k = 0; k < 40; k++) {
        const fag = { ...emptyFag(), nivaa, plassert: true, svake: { [type]: { bom: 1, riktig: 0, nivaa } } }
        const m = buildMission(fag, { rng, stige: MATTE_STIGE })
        for (const t of m.tasks.filter((x) => x.tag === 'svak')) {
          total++
          if (t.type === type) treff++
        }
      }
      expect(total, `${type}: ingen svake oppgaver`).toBeGreaterThan(0)
      expect(treff, `${type}: ${treff} av ${total}`).toBe(total)
    }
  })
})

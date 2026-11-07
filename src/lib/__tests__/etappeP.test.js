// Etappe P (runde 4): flagg, plassering og småfeil.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { seeded } from '../rng.js'
import { applyResult } from '../matte/stige.js'
import { buildMission, MATTE_STIGE } from '../matte/oppdrag.js'
import { emptyFag } from '../profil.js'
import { medPunktum } from '../tekst.js'
import { LAND } from '../../data/geo/land.js'

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

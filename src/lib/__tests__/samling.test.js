import { describe, it, expect } from 'vitest'
import { nyeKort, kisteStatus } from '../samling.js'
import { KORT, kortForNivaa, BONUSKORT } from '../../data/kort.js'
import { KOSTYMER } from '../../data/kostymer.js'
import { HISTORIER } from '../../data/historier.js'

describe('samlekort', () => {
  it('ett kort per nivå 1–38, med faktalinje', () => {
    for (let n = 1; n <= 38; n++) {
      const k = kortForNivaa(n)
      expect(k, `nivå ${n}`).toBeTruthy()
      expect(k.fakta.length).toBeGreaterThan(10)
    }
    expect(new Set(KORT.map((k) => k.id)).size).toBe(KORT.length)
    expect(BONUSKORT.length).toBeGreaterThan(3)
  })
  it('nivå opp gir kortet for nivået; tre stjerner også', () => {
    expect(nyeKort({ nivaa: 5, levelUp: true, stars: 2, rng: () => 0.9 })).toEqual([kortForNivaa(5).id])
    expect(nyeKort({ nivaa: 5, levelUp: false, stars: 3, rng: () => 0.9 })).toEqual([kortForNivaa(5).id])
    expect(nyeKort({ nivaa: 5, levelUp: false, stars: 2, rng: () => 0.9 })).toEqual([])
  })
  it('ingen dobbeltkort, bonuskort av og til ved godt resultat', () => {
    expect(nyeKort({ eier: [kortForNivaa(5).id], nivaa: 5, levelUp: true, stars: 3, rng: () => 0.9 })).toEqual([])
    const med = nyeKort({ nivaa: 5, levelUp: false, stars: 2, rng: () => 0.01 })
    expect(med).toHaveLength(1)
    expect(BONUSKORT.map((k) => k.id)).toContain(med[0])
    expect(nyeKort({ nivaa: 5, levelUp: false, stars: 1, rng: () => 0.01 })).toEqual([])
  })
  it('kostymer og historier er gyldige', () => {
    for (const k of KOSTYMER) expect(k.pris).toBeGreaterThan(0)
    expect(HISTORIER.map((h) => h.verden)).toEqual(['skog', 'hav', 'fjell', 'slott', 'rom'])
  })
  it('kisten viser fyllingsgrad uten å love noe', () => {
    expect(kisteStatus(0)).toMatchObject({ neste: 25, pct: 0 })
    expect(kisteStatus(30)).toMatchObject({ forrige: 25, neste: 50, pct: 20 })
    expect(kisteStatus(5000).neste).toBe(null)
  })
})

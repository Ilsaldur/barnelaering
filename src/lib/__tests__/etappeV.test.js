// Etappe V (runde 5): alle stiger gir kort, og samlingen forklarer seg selv.
import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { nyeKort } from '../samling.js'
import { KORT, SETT, kortForNivaa, fagForKort } from '../../data/kort.js'
import { STIGER } from '../../data/stiger.js'
import '../../data/matte/nivaer.js'
import '../../data/lesing/nivaer.js'
import '../../data/klokke/nivaer.js'
import '../../data/geo/nivaer.js'
import '../../data/engelsk/nivaer.js'

describe('V – kort i alle stiger', () => {
  it('hver stige har ett kort per nivå, med navn, bilde og faktalinje', () => {
    for (const [fag, nivaer] of Object.entries(STIGER)) {
      for (let n = 1; n <= nivaer.length; n++) {
        const k = kortForNivaa(n, fag)
        expect(k, `${fag} nivå ${n}`).toBeTruthy()
        expect(k.navn).toBeTruthy()
        expect(k.emoji || k.flagg, k.id).toBeTruthy()
        expect(k.fakta.length).toBeGreaterThan(10)
        expect(fagForKort(k)).toBe(fag)
      }
      expect(KORT.filter((k) => fagForKort(k) === fag && k.nivaa).length, fag).toBe(nivaer.length)
    }
    expect(new Set(KORT.map((k) => k.id)).size).toBe(KORT.length)
    for (const k of KORT.filter((k) => k.flagg)) expect(existsSync(`public/flagg/${k.flagg}.svg`), k.id).toBe(true)
    // Settene hører til et fag (bortsett fra bonus), og gamle matte-id-er er uendret.
    for (const s of SETT) if (s.id !== 'bonus') expect(Object.keys(STIGER)).toContain(s.fag)
    expect(kortForNivaa(1).id).toBe('dyr-ekorn')
  })
  it('1. nivå opp på Geografi 3 gir geografikortet for nivå 3; tre stjerner på Lese 5 gir lesekortet; aldri to ganger', () => {
    const geo = nyeKort({ nivaa: 3, fag: 'geografi', levelUp: true, stars: 2, rng: () => 0.9 })
    expect(geo).toEqual([kortForNivaa(3, 'geografi').id])
    expect(kortForNivaa(3, 'geografi').id).toBe('geo-3')
    const lese = nyeKort({ nivaa: 5, fag: 'lesing', levelUp: false, stars: 3, rng: () => 0.9 })
    expect(lese).toEqual(['lese-5'])
    expect(nyeKort({ eier: ['lese-5'], nivaa: 5, fag: 'lesing', levelUp: true, stars: 3, rng: () => 0.9 })).toEqual([])
    // Matte som før.
    expect(nyeKort({ nivaa: 3, levelUp: true, stars: 0, rng: () => 0.9 })).toEqual(['dyr-rev'])
    // To stjerner gir ikke kort.
    expect(nyeKort({ nivaa: 3, fag: 'klokke', levelUp: false, stars: 2, rng: () => 0.9 })).toEqual([])
  })
  it('3. eksisterende profiler beholder kortene: gamle id-er finnes fortsatt', () => {
    for (const id of ['dyr-ekorn', 'dyr-rev', 'dyr-sel', 'planet-merkur', 'bonus-drage']) expect(KORT.some((k) => k.id === id), id).toBe(true)
  })
})

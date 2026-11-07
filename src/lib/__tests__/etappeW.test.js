// Etappe W (runde 5): reven kan ha på flere ting – én per plass.
import { describe, it, expect } from 'vitest'
import { taPaa, taAv, migrerKostyme, harPaa } from '../kostyme.js'
import { KOSTYMER, PLASSER } from '../../data/kostymer.js'
import { normalize, mergeData, emptyData } from '../profil.js'

describe('W – kostymer på plasser', () => {
  it('alle kostymer har en plass som finnes', () => {
    for (const k of KOSTYMER) expect(Object.keys(PLASSER), k.id).toContain(k.plass)
    expect(KOSTYMER.filter((k) => k.plass === 'hode').map((k) => k.id).sort()).toEqual(['hatt', 'hjelm', 'krone', 'lue'])
  })
  it('akseptansetest: lue og briller gir begge på; krone tar av lua, ikke brillene', () => {
    let paa = taPaa([], 'lue')
    paa = taPaa(paa, 'briller')
    expect(paa.sort()).toEqual(['briller', 'lue'])
    paa = taPaa(paa, 'krone')
    expect(paa.sort()).toEqual(['briller', 'krone'])
    expect(harPaa(paa, 'lue')).toBe(false)
    paa = taAv(paa, 'briller')
    expect(paa).toEqual(['krone'])
    expect(taPaa(['krone'], 'tull')).toEqual(['krone'])
  })
  it('akseptansetest: gammel profil med kostyme «lue» har lua på etter oppdatering', () => {
    const d = normalize({ v: 3, kostymer: ['lue'], kostyme: 'lue', kostymeT: 5 })
    expect(d.kostymerPaa).toEqual(['lue'])
    expect(d).not.toHaveProperty('kostyme')
    expect(migrerKostyme({ kostyme: null })).toEqual([])
    expect(migrerKostyme({ kostymerPaa: ['briller', 'ukjent', 3] })).toEqual(['briller'])
  })
  it('fletting: den siste som byttet kostyme vinner', () => {
    const a = emptyData()
    a.kostymerPaa = ['lue']
    a.kostymeT = 2
    const b = emptyData()
    b.kostymerPaa = ['krone', 'briller']
    b.kostymeT = 1
    expect(mergeData(a, b).kostymerPaa).toEqual(['lue'])
    expect(mergeData(b, a).kostymerPaa).toEqual(['lue'])
  })
})

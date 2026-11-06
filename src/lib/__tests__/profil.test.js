import { describe, it, expect } from 'vitest'
import { emptyData, normalize, mergeData, weakestTypes, minutesLastWeek, todayKey, effectiveAutoSpeak, nullstiltData } from '../profil.js'

describe('normalize', () => {
  it('fyller ut en gammel profil uten å miste stjerner', () => {
    const d = normalize({ stars: 7, best: { pluss: { 0: 3 } }, log: [{ t: 1, stars: 2 }] })
    expect(d.stars).toBe(7)
    expect(d.best.pluss[0]).toBe(3)
    expect(d.fag.matte.nivaa).toBe(null)
    expect(d.settings.oppdragPerDag).toBe(2)
    expect(d.v).toBe(3)
  })
})

describe('mergeData', () => {
  it('høyeste stjerner, mestring celle for celle, logg som union', () => {
    const a = normalize({ stars: 5, best: { pluss: { 0: 2 } }, log: [{ t: 1, stars: 1, topic: 'pluss', level: 0 }] })
    const b = normalize({ stars: 3, best: { pluss: { 0: 3, 1: 1 } }, log: [{ t: 2, stars: 2, topic: 'pluss', level: 1 }, { t: 1, stars: 1, topic: 'pluss', level: 0 }] })
    const m = mergeData(a, b)
    expect(m.stars).toBe(5)
    expect(m.best.pluss).toEqual({ 0: 3, 1: 1 })
    expect(m.log).toHaveLength(2)
  })

  it('nivå følger den sist oppdaterte, beste stjerner per nivå tar maks', () => {
    const a = emptyData()
    a.fag.matte = { ...a.fag.matte, nivaa: 12, updatedAt: 100, beste: { 7: 3 } }
    const b = emptyData()
    b.fag.matte = { ...b.fag.matte, nivaa: 9, updatedAt: 200, beste: { 7: 1, 8: 2 } }
    const m = mergeData(a, b)
    expect(m.fag.matte.nivaa).toBe(9)
    expect(m.fag.matte.beste).toEqual({ 7: 3, 8: 2 })
  })

  it('innstillinger: sist oppdatert vinner', () => {
    const a = emptyData()
    a.settings = { ...a.settings, autoSpeak: true, updatedAt: 50 }
    const b = emptyData()
    b.settings = { ...b.settings, autoSpeak: false, updatedAt: 60 }
    expect(mergeData(a, b).settings.autoSpeak).toBe(false)
    expect(mergeData(b, a).settings.autoSpeak).toBe(false)
  })

  it('dager, kort og eventyr som union', () => {
    const a = emptyData()
    a.dager = { '2026-11-05': { oppdrag: 1 } }
    a.kort = ['dyr-elg']
    a.eventyr = { skog: 2 }
    const b = emptyData()
    b.dager = { '2026-11-05': { oppdrag: 2 }, '2026-11-04': { oppdrag: 2 } }
    b.kort = ['dyr-rev']
    const m = mergeData(a, b)
    expect(m.dager['2026-11-05'].oppdrag).toBe(2)
    expect(m.dager['2026-11-04'].oppdrag).toBe(2)
    expect(m.kort.sort()).toEqual(['dyr-elg', 'dyr-rev'])
    expect(m.eventyr.skog).toBe(2)
  })

  it('kort i bokser: nyeste vinner', () => {
    const a = emptyData()
    a.fag.matte.bokser = { 'gange:6x7': { boks: 1, t: 10 } }
    const b = emptyData()
    b.fag.matte.bokser = { 'gange:6x7': { boks: 3, t: 20 } }
    expect(mergeData(a, b).fag.matte.bokser['gange:6x7'].boks).toBe(3)
  })
})

describe('statistikk', () => {
  it('svakeste oppgavetyper teller bare første forsøk uten hjelp', () => {
    const now = Date.now()
    const attempts = [
      { t: now - 1000, fag: 'matte', type: 'minus_tierovergang', ok: false, forste: true, hjelp: false },
      { t: now - 2000, fag: 'matte', type: 'minus_tierovergang', ok: false, forste: true, hjelp: false },
      { t: now - 3000, fag: 'matte', type: 'minus_tierovergang', ok: true, forste: false, hjelp: false },
      { t: now - 4000, fag: 'matte', type: 'pluss', ok: true, forste: true, hjelp: false },
      { t: now - 5000, fag: 'matte', type: 'pluss', ok: false, forste: true, hjelp: true },
      { t: now - 6000, fag: 'matte', type: 'gange', ok: false, forste: true, hjelp: false },
    ]
    const w = weakestTypes(attempts, { now })
    expect(w[0].type).toBe('minus_tierovergang')
    expect(w[0].pct).toBe(100)
    expect(w.find((x) => x.type === 'pluss')).toBeUndefined()
    expect(w.find((x) => x.type === 'gange')).toBeUndefined() // bare ett forsøk
  })
  it('minutter siste uke', () => {
    const now = Date.now()
    const log = [
      { t: now - 1000, ms: 120000 },
      { t: now - 2000, ms: 60000 },
      { t: now - 10 * 24 * 3600 * 1000, ms: 600000 },
    ]
    expect(minutesLastWeek(log, now)).toBe(3)
  })
  it('todayKey', () => {
    expect(todayKey(new Date(2026, 10, 5))).toBe('2026-11-05')
  })
})

describe('opplesing (etappe B)', () => {
  it('aldri rørt: på til barnet er på nivå 8 i lesing', () => {
    const d = emptyData()
    expect(effectiveAutoSpeak(d)).toBe(true)
    d.fag.lesing = { ...d.fag.lesing, plassert: true, nivaa: 5 }
    expect(effectiveAutoSpeak(d)).toBe(true)
    d.fag.lesing = { ...d.fag.lesing, plassert: true, nivaa: 8 }
    expect(effectiveAutoSpeak(d)).toBe(false)
  })
  it('valgt av voksen: valget gjelder uansett nivå', () => {
    const d = emptyData()
    d.settings = { ...d.settings, autoSpeak: false, autoSpeakSet: true }
    expect(effectiveAutoSpeak(d)).toBe(false)
    d.fag.lesing = { ...d.fag.lesing, plassert: true, nivaa: 12 }
    d.settings = { ...d.settings, autoSpeak: true, autoSpeakSet: true }
    expect(effectiveAutoSpeak(d)).toBe(true)
  })
  it('gamle profiler uten autoSpeakSet regnes som aldri rørt', () => {
    const d = normalize({ settings: { autoSpeak: false } })
    expect(d.settings.autoSpeakSet).toBe(false)
    expect(effectiveAutoSpeak(d)).toBe(true)
  })
})

describe('nullstilling og synk (etappe E)', () => {
  it('nullstill på enhet A, flett med gamle data fra B: fortsatt nullstilt', () => {
    const gammel = normalize({ stars: 40, kort: ['dyr-elg'], fag: { matte: { nivaa: 20, plassert: true, updatedAt: 500 } } })
    const a = nullstiltData(gammel, 1000)
    expect(a.stars).toBe(0)
    expect(a.nullstiltT).toBe(1000)
    const m = mergeData(a, gammel)
    expect(m.stars).toBe(0)
    expect(m.kort).toEqual([])
    expect(m.fag.matte.nivaa).toBe(null)
    expect(m.nullstiltT).toBe(1000)
    expect(mergeData(gammel, a).stars).toBe(0)
  })
  it('samme nullstillingstidspunkt: flettes som før', () => {
    const a = normalize({ stars: 5 })
    const b = normalize({ stars: 9 })
    expect(mergeData(a, b).stars).toBe(9)
    const c = nullstiltData(a, 7)
    const d = { ...nullstiltData(b, 7), stars: 3 }
    expect(mergeData(c, d).stars).toBe(3)
  })
})

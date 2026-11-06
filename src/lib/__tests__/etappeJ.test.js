import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { normalize, mergeData, emptyData, emptyFag } from '../profil.js'
import { startPlassering, stegPlassering, TRAPP_MATTE } from '../matte/plassering.js'
import { buildMission, oppgaveTilPlassering, MATTE_STIGE } from '../matte/oppdrag.js'
import { oppdaterSvake } from '../matte/stige.js'
import { sudokuLosninger, NOTT_TYPER } from '../matte/noetter.js'
import { NIVAER_LESING, NIVAER_SKRIVE, NIVAER_SPRAK } from '../../data/lesing/nivaer.js'
import { NIVAER_KLOKKE } from '../../data/klokke/nivaer.js'
import { NIVAER_GEO } from '../../data/geo/nivaer.js'
import { NIVAER_ENGELSK } from '../../data/engelsk/nivaer.js'
import { genLesing, lagTekstOppgaver } from '../lesing/generatorer.js'
import { genKlokke } from '../klokke/generatorer.js'
import { genGeo } from '../geo/generatorer.js'
import { genEngelsk } from '../engelsk/generatorer.js'

const DAG = 24 * 3600 * 1000

describe('J1 migrering og fletting', () => {
  it('enhet A (v3, nivåer satt i går) vinner over enhet B (v2 fra tre dager siden)', () => {
    const now = Date.now()
    const a = emptyData()
    a.fag.lesing = { ...a.fag.lesing, nivaa: 9, plassert: true, updatedAt: now - DAG }
    a.fag.skrive = { ...a.fag.skrive, nivaa: 3, plassert: true, updatedAt: now - DAG }
    a.fag.sprak = { ...a.fag.sprak, nivaa: 2, plassert: true, updatedAt: now - DAG }
    const b = { v: 2, fag: { lesing: { nivaa: 11, plassert: true, updatedAt: now - 3 * DAG } } }
    for (const m of [mergeData(a, b), mergeData(b, a)]) {
      expect(m.fag.lesing.nivaa).toBe(9)
      expect(m.fag.skrive.nivaa).toBe(3)
      expect(m.fag.sprak.nivaa).toBe(2)
    }
    expect(normalize(b).fag.lesing.updatedAt).toBe(now - 3 * DAG)
  })
})

describe('J2 bom-lista med nivå', () => {
  const stiger = [
    { navn: 'matte', stige: MATTE_STIGE },
    { navn: 'lesing', stige: { nivaer: NIVAER_LESING, gen: genLesing, tekstOppgaver: lagTekstOppgaver } },
    { navn: 'skrive', stige: { nivaer: NIVAER_SKRIVE, gen: genLesing } },
    { navn: 'sprak', stige: { nivaer: NIVAER_SPRAK, gen: genLesing } },
    { navn: 'klokke', stige: { nivaer: NIVAER_KLOKKE, gen: genKlokke } },
    { navn: 'geografi', stige: { nivaer: NIVAER_GEO, gen: genGeo } },
    { navn: 'engelsk', stige: { nivaer: NIVAER_ENGELSK, gen: genEngelsk } },
  ]
  for (const { navn, stige } of stiger) {
    it(`${navn}: en type som bommes på nivå n kommer igjen som svak oppgave fra nivå n`, () => {
      const rng = seeded(42)
      for (const def of stige.nivaer) {
        const n = def.id
        const t = oppgaveTilPlassering(n, rng, stige)
        const svake = oppdaterSvake({}, [{ type: t.type, nivaa: n, tag: 'eget', ok: false, counts: false }], n)
        expect(svake[t.type].nivaa).toBe(n)
        for (const paa of [n, Math.min(stige.nivaer.length, n + 1)]) {
          // Tekstnivåene (Lese 8–12) har ingen repetisjon (etappe H2); der kommer
          // bare nivåets egne typer. Bommer fra lavere nivåer venter til neste ikke-tekstnivå.
          if (stige.nivaer[paa - 1].tekstOppdrag && !def.tekstOppdrag) continue
          const fag = { ...emptyFag(), nivaa: paa, plassert: true, svake }
          let funnet = false
          for (let i = 0; i < 6 && !funnet; i++) {
            const m = buildMission(fag, { rng, stige })
            funnet = m.tasks.some((x) => x.type === t.type && (x.tag === 'svak' || def.tekstOppdrag))
          }
          expect(funnet, `${navn} nivå ${n} (${t.type}) på nivå ${paa}`).toBe(true)
        }
      }
    })
  }
})

describe('J3 plasseringstest ned verden for verden', () => {
  it('kan til og med 5, velger Verdensrommet: plasseres på 5 eller 6 med høyst fem gale svar', () => {
    const rng = seeded(7)
    let s = startPlassering({ start: 29, tak: 38, maks: 38, trapp: TRAPP_MATTE })
    let gale = 0
    const spurt = []
    while (!s.ferdig) {
      spurt.push(s.pos)
      const ok = s.pos <= 5
      if (!ok) gale++
      s = stegPlassering(s, ok)
      void rng
    }
    expect([5, 6]).toContain(s.nivaa)
    expect(gale).toBeLessThanOrEqual(5)
    expect(spurt.slice(0, 4)).toEqual([29, 21, 13, 6])
  })
  it('hopper over prøven på taket når nivået rett under er bestått', () => {
    let s = startPlassering({ start: 1, tak: 7, maks: 38, trapp: TRAPP_MATTE })
    for (const ok of [true, true, true, true, true, true]) s = stegPlassering(s, ok) // 1, 3, 5 bestått
    expect(s.pos).toBe(7)
    s = stegPlassering(s, true)
    s = stegPlassering(s, true) // 7 er taket
    expect(s.ferdig).toBe(true)
    expect(s.nivaa).toBe(7)
    // Rett under taket: 6 bestått → 7 uten prøve.
    let u = startPlassering({ start: 6, tak: 7, maks: 38, trapp: TRAPP_MATTE })
    u = stegPlassering(u, true)
    u = stegPlassering(u, true)
    expect(u.ferdig).toBe(true)
    expect(u.nivaa).toBe(7)
  })
  it('alt riktig fra havet gir fortsatt 15, og alt feil gir 1', () => {
    let s = startPlassering({ start: 6, tak: 15, maks: 38, trapp: TRAPP_MATTE })
    while (!s.ferdig) s = stegPlassering(s, true)
    expect(s.nivaa).toBe(15)
    s = startPlassering({ start: 6, tak: 15, maks: 38, trapp: TRAPP_MATTE })
    let gale = 0
    while (!s.ferdig) {
      s = stegPlassering(s, false)
      gale++
    }
    expect(s.nivaa).toBe(1)
    expect(gale).toBe(2) // 6, så 1
  })
})

describe('J4 sudoku', () => {
  it('spør bare etter ruter der alle løsninger har samme tall', () => {
    const rng = seeded(11)
    for (const grad of [1, 2, 3]) {
      for (let i = 0; i < 150; i++) {
        const t = NOTT_TYPER.sudoku4(grad, rng)
        const idx = t.visual.grid.indexOf('?')
        const losninger = sudokuLosninger(t.vist)
        expect(losninger.length).toBeGreaterThan(0)
        for (const l of losninger) expect(l[idx]).toBe(t.answer)
      }
    }
  })
})

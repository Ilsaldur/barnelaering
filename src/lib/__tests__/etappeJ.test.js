import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { normalize, mergeData, emptyData, emptyFag } from '../profil.js'
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
          if (stige.nivaer[paa - 1].tekstOppdrag && paa !== n) continue
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

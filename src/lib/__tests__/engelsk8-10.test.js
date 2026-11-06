// Engelsk 8–10 (runde 4, bygget etter ja fra Jon): Read and choose, Spell it, Make a sentence.
import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { genEngelsk, SETNINGER_BRIKKER, setningsBrikker } from '../engelsk/generatorer.js'
import { NIVAER_ENGELSK, MAKS_ENGELSK, engelskOmraadeFor } from '../../data/engelsk/nivaer.js'
import { TEKSTER_EN, ORD } from '../../data/engelsk/innhold.js'
import { antallUlike, oppdragLengde, buildMission } from '../matte/oppdrag.js'
import { emptyFag } from '../profil.js'

const ENG = { nivaer: NIVAER_ENGELSK, gen: genEngelsk }

describe('Engelsk 8–10', () => {
  it('stigen har ti nivåer i tre områder', () => {
    expect(MAKS_ENGELSK).toBe(10)
    expect(engelskOmraadeFor(8).id).toBe('lese')
    expect(engelskOmraadeFor(10).id).toBe('lese')
    expect(engelskOmraadeFor(7).id).toBe('setninger')
  })
  it('nivå 8: minst 20 tekster på 20–40 ord, med spørsmål der svaret er med', () => {
    expect(TEKSTER_EN.length).toBeGreaterThanOrEqual(20)
    for (const t of TEKSTER_EN) {
      const ord = t.tekst.trim().split(/\s+/).length
      expect(ord, t.id).toBeGreaterThanOrEqual(20)
      expect(ord, t.id).toBeLessThanOrEqual(40)
      for (const q of t.sporsmaal) {
        expect(q.alternativer).toHaveLength(4)
        expect(q.alternativer).toContain(q.svar)
        expect(new Set(q.alternativer).size).toBe(4)
      }
    }
    expect(new Set(TEKSTER_EN.map((t) => t.id)).size).toBe(TEKSTER_EN.length)
    const task = genEngelsk('les_tekst_en', {}, seeded(1))
    expect(task.visual.kind).toBe('tekst')
    expect(task.lesTekst).toContain(task.visual.tekst)
    expect(task.spoken).not.toContain(task.visual.tekst) // stemmen leser bare spørsmålet
    expect(task.lang).toBe('en-GB')
  })
  it('nivå 9: korte ord først, lengre ord etterpå, med lyd og engelsk stemme', () => {
    const rng = seeded(9)
    for (let i = 0; i < 100; i++) {
      const a = genEngelsk('stav_en', { maks: 4 }, rng)
      expect(a.form).toBe('skriv')
      expect(a.kreverLyd).toBe(true)
      expect(a.hørOrd).toBe(a.answer)
      expect(a.answer.length).toBeLessThanOrEqual(4)
      expect(a.lang).toBe('en-GB')
      const b = genEngelsk('stav_en', { min: 5 }, rng)
      expect(b.answer.length).toBeGreaterThanOrEqual(5)
      expect(b.answer).not.toContain(' ')
    }
  })
  it('nivå 10: brikkene er ordene i setningen, ingen ord to ganger, 3–7 ord', () => {
    expect(SETNINGER_BRIKKER.length).toBeGreaterThanOrEqual(25)
    expect(setningsBrikker({ en: 'The cat is on the mat.' })).toBeNull()
    const rng = seeded(10)
    for (let i = 0; i < 100; i++) {
      const t = genEngelsk('lag_setning', {}, rng)
      expect(t.form).toBe('sorter')
      expect([...t.items].sort()).toEqual([...t.answer].sort())
      expect(t.answer.join(' ')).toBe(t.emne)
      expect(t.answer.length).toBeGreaterThanOrEqual(3)
      expect(t.answer.length).toBeLessThanOrEqual(7)
    }
  })
  it('nivåene har nok ulike spørsmål til åtte oppgaver, og oppdragene bygges uten gjentakelser', () => {
    for (const n of [8, 9, 10]) {
      expect(antallUlike(ENG, n, 60), `nivå ${n}`).toBeGreaterThanOrEqual(30)
      expect(oppdragLengde(ENG, n)).toBe(8)
      const m = buildMission({ ...emptyFag(), nivaa: n, plassert: true }, { rng: seeded(n), stige: ENG })
      expect(m.tasks).toHaveLength(8)
      expect(new Set(m.tasks.map((t) => `${t.prompt}|${JSON.stringify(t.answer)}|${t.hørOrd || ''}`)).size).toBe(8)
    }
    // Ordene til staving finnes i ordlistene.
    const alle = new Set(Object.values(ORD).flatMap((g) => g.map((w) => w.en)))
    for (let i = 0; i < 50; i++) expect(alle.has(genEngelsk('stav_en', {}, seeded(i)).answer)).toBe(true)
  })
})

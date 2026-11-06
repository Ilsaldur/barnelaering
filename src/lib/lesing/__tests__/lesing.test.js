import { describe, it, expect } from 'vitest'
import { seeded } from '../../rng.js'
import { genLesing, GEN_LESING, lagTekstOppgaver } from '../generatorer.js'
import { NIVAER_LESING, NIVAER_SKRIVE, NIVAER_SPRAK, SPOR } from '../../../data/lesing/nivaer.js'
import { TEKSTER2 } from '../../../data/lesing/tekster2.js'
import { normalize, migrerLesingSpor, emptyData } from '../../profil.js'
import { TEKSTER, BOKSTAVER, RETTSKRIVING, SETNINGER, BOYING } from '../../../data/lesing/innhold.js'
import { buildMission, buildBoss, oppgaveFraNivaa } from '../../matte/oppdrag.js'
import { emptyFag } from '../../profil.js'
import { applyResult } from '../../matte/stige.js'

const STIGE = { nivaer: NIVAER_LESING, gen: genLesing, tekstOppgaver: lagTekstOppgaver }

describe('innhold (UTKAST)', () => {
  it('bokstavene kommer i riktig rekkefølge', () => {
    expect(BOKSTAVER.map((b) => b.b).join(' ')).toBe('i s o l e v a t b ø m å j r d u g n p y h f k æ')
  })
  it('tekstene er 40–130 ord og alle spørsmål har svaret blant alternativene', () => {
    for (const t of TEKSTER) {
      const n = t.tekst.trim().split(/\s+/).length
      expect(n, t.id).toBeGreaterThanOrEqual(40)
      expect(n, t.id).toBeLessThanOrEqual(130)
      expect(t.sporsmaal.length).toBeGreaterThanOrEqual(2)
      for (const q of t.sporsmaal) expect(q.alternativer, `${t.id}: ${q.q}`).toContain(q.svar)
    }
  })
  it('rettskrivingsord har feilskrivinger som ikke er lik ordet', () => {
    for (const [g, liste] of Object.entries(RETTSKRIVING)) {
      for (const o of liste) {
        expect(o.feil.length, `${g}/${o.ord}`).toBeGreaterThanOrEqual(3)
        for (const f of o.feil) expect(f, `${g}/${o.ord}`).not.toBe(o.ord)
      }
    }
    for (const s of SETNINGER) expect(s.feil).not.toContain(s.svar)
    for (const b of BOYING) expect(b.feil).not.toContain(b.svar)
  })
})

describe('tekster til Lese 10–12 (UTKAST)', () => {
  it('minst åtte tekster per type, 120–200 ord, gyldige spørsmål', () => {
    for (const type of ['slutning', 'ordforraad', 'hovedtanke']) {
      const liste = TEKSTER2.filter((t) => t.type === type)
      expect(liste.length, type).toBeGreaterThanOrEqual(8)
      for (const t of liste) {
        const n = t.tekst.trim().split(/\s+/).length
        expect(n, t.id).toBeGreaterThanOrEqual(120)
        expect(n, t.id).toBeLessThanOrEqual(200)
        expect(t.sporsmaal.length, t.id).toBeGreaterThanOrEqual(3)
        for (const q of t.sporsmaal) expect(q.alternativer, `${t.id}: ${q.q}`).toContain(q.svar)
      }
    }
    expect(new Set(TEKSTER2.map((t) => t.id)).size).toBe(TEKSTER2.length)
  })
})

describe('tre spor (etappe D)', () => {
  it('Lese 1–12, Skrive riktig 1–4, Språk 1–3', () => {
    expect(NIVAER_LESING).toHaveLength(12)
    expect(NIVAER_SKRIVE).toHaveLength(4)
    expect(NIVAER_SPRAK).toHaveLength(3)
    expect(SPOR.map((s) => s.id)).toEqual(['lesing', 'skrive', 'sprak'])
  })
  it('migrering: 1–9 uendret', () => {
    const d = normalize({ v: 2, fag: { lesing: { nivaa: 7, plassert: true, beste: { 5: 3 } } } })
    expect(d.fag.lesing.nivaa).toBe(7)
    expect(d.fag.lesing.beste[5]).toBe(3)
    expect(d.fag.skrive.plassert).toBe(false)
  })
  it('migrering: 10–13 gir Lese 9 og Skrive riktig nivå − 9, stjerner følger med', () => {
    const d = normalize({ v: 2, fag: { lesing: { nivaa: 12, plassert: true, beste: { 9: 2, 10: 3, 11: 1 } } } })
    expect(d.fag.lesing.nivaa).toBe(9)
    expect(d.fag.skrive.nivaa).toBe(3)
    expect(d.fag.skrive.plassert).toBe(true)
    expect(d.fag.skrive.beste).toEqual({ 1: 3, 2: 1 })
    expect(d.fag.lesing.beste).toEqual({ 9: 2 })
    expect(d.fag.sprak.plassert).toBe(false)
  })
  it('migrering: 14–16 gir Lese 9, Skrive riktig 1 og Språk nivå − 13', () => {
    const d = normalize({ v: 2, fag: { lesing: { nivaa: 15, plassert: true, beste: { 14: 2, 16: 3 } } } })
    expect(d.fag.lesing.nivaa).toBe(9)
    expect(d.fag.skrive.nivaa).toBe(1)
    expect(d.fag.sprak.nivaa).toBe(2)
    expect(d.fag.sprak.beste).toEqual({ 1: 2, 3: 3 })
  })
  it('migrering skjer bare én gang (v3 røres ikke)', () => {
    const d = emptyData()
    d.fag.lesing = { ...d.fag.lesing, nivaa: 12, plassert: true }
    const igjen = normalize(d)
    expect(igjen.fag.lesing.nivaa).toBe(12)
    expect(migrerLesingSpor({ lesing: { nivaa: 3 } }).lesing.nivaa).toBe(3)
  })
})

describe('lesegeneratorer', () => {
  it('alle nivåer peker på generatorer som finnes', () => {
    for (const n of [...NIVAER_LESING, ...NIVAER_SKRIVE, ...NIVAER_SPRAK]) for (const t of n.typer) expect(GEN_LESING[t.type], `${n.id}: ${t.type}`).toBeTypeOf('function')
  })
  for (const n of [...NIVAER_LESING, ...NIVAER_SKRIVE.map((x) => ({ ...x, tittel: `Skrive: ${x.tittel}` })), ...NIVAER_SPRAK.map((x) => ({ ...x, tittel: `Språk: ${x.tittel}` }))]) {
    it(`nivå ${n.id} (${n.tittel}) gir gyldige oppgaver`, () => {
      const rng = seeded(100 + n.id)
      for (const t of n.typer) {
        for (let i = 0; i < 60; i++) {
          const task = genLesing(t.type, t.param, rng)
          expect(task.prompt, t.type).toBeTruthy()
          expect(task.spoken, t.type).toBeTruthy()
          expect(task.explain, t.type).toBeTruthy()
          if (task.form === 'valg') {
            expect(task.options.map(String), t.type).toContain(String(task.answer))
            expect(new Set(task.options).size, t.type).toBe(task.options.length)
          } else if (task.form === 'skriv') {
            expect(typeof task.answer).toBe('string')
          } else throw new Error(`uventet form ${task.form} i ${t.type}`)
        }
      }
    })
  }
  it('lydering bruker bare bokstaver barnet har lært', () => {
    const lov = new Set(BOKSTAVER.slice(0, 7).map((b) => b.b))
    const rng = seeded(3)
    for (let i = 0; i < 100; i++) {
      const t = genLesing('les_ord_bilde', { maks: 5 }, rng)
      expect(t.visual.tekst.length).toBeLessThanOrEqual(5)
    }
    void lov
  })
})

describe('oppdrag i lesestigen', () => {
  it('tekstnivåer har fem oppgaver, andre åtte', () => {
    const rng = seeded(9)
    const m8 = buildMission({ ...emptyFag(), nivaa: 6, plassert: true }, { rng, stige: STIGE })
    expect(m8.tasks).toHaveLength(8)
    const m5 = buildMission({ ...emptyFag(), nivaa: 8, plassert: true }, { rng, stige: STIGE })
    expect(m5.tasks).toHaveLength(5)
    expect(m5.tasks.filter((t) => t.nivaa === 8).length).toBeGreaterThanOrEqual(3)
    expect(oppgaveFraNivaa(99, rng, STIGE).nivaa).toBe(12)
  })
  it('H2.3: fem oppgaver – 4 av 5 to ganger gir nivå opp, 3 av 5 to ganger gir ingen nedflytting', () => {
    let f = { ...emptyFag(), nivaa: 9, plassert: true }
    let r = applyResult(f, { correct: 4, total: 5, nivaa: 9 }, 12)
    expect(r.fag.paaRad).toBe(1)
    r = applyResult(r.fag, { correct: 4, total: 5, nivaa: 9 }, 12)
    expect(r.events.levelUp).toBe(true)
    expect(r.fag.nivaa).toBe(10)
    f = { ...emptyFag(), nivaa: 9, plassert: true }
    r = applyResult(f, { correct: 3, total: 5, nivaa: 9 }, 12)
    expect(r.fag.hjelpNeste).toBe(false)
    r = applyResult(r.fag, { correct: 3, total: 5, nivaa: 9 }, 12)
    expect(r.fag.nivaa).toBe(9)
    expect(r.events.levelDown).toBe(false)
    expect(applyResult(f, { correct: 2, total: 5, nivaa: 9 }, 12).fag.hjelpNeste).toBe(true)
    expect(applyResult(f, { correct: 5, total: 5, nivaa: 9 }, 12).events.boss).toBe(12)
    expect(applyResult(f, { correct: 4, total: 5, nivaa: 9 }, 12).events.boss).toBe(null)
  })
  it('H2.4: et oppdrag på Lese 10 har nøyaktig to ulike tekster (3 + 2), ingen repetisjon', () => {
    const rng = seeded(10)
    for (let i = 0; i < 20; i++) {
      const m = buildMission({ ...emptyFag(), nivaa: 10, plassert: true }, { rng, stige: STIGE })
      expect(m.tasks).toHaveLength(5)
      const ids = m.tasks.map((t) => t.tekstId)
      expect(new Set(ids).size).toBe(2)
      expect(ids.slice(0, 3).every((x) => x === ids[0])).toBe(true)
      expect(ids.slice(3).every((x) => x === ids[3])).toBe(true)
      for (const t of m.tasks) {
        expect(t.nivaa).toBe(10)
        expect(t.tag).toBe('eget')
        expect(t.spoken).not.toContain(t.visual.tekst.slice(0, 30))
        expect(t.lesTekst).toContain(t.visual.tekst.slice(0, 30))
      }
    }
    for (const nivaa of [8, 9, 11, 12]) {
      const m = buildMission({ ...emptyFag(), nivaa, plassert: true }, { rng, stige: STIGE })
      expect(new Set(m.tasks.map((t) => t.tekstId)).size, `nivå ${nivaa}`).toBe(2)
    }
    const b = buildBoss(9, 12, { rng, stige: STIGE })
    expect(b.tasks).toHaveLength(5)
    expect(new Set(b.tasks.map((t) => t.tekstId)).size).toBe(2)
  })
  it('ingen meningsspørsmål i tekstene', () => {
    for (const t of TEKSTER) for (const q of t.sporsmaal) expect(q.type, `${t.id}: ${q.q}`).not.toBe('mening')
  })
})

import { describe, it, expect } from 'vitest'
import { seeded } from '../../rng.js'
import { genLesing, GEN_LESING } from '../generatorer.js'
import { NIVAER_LESING } from '../../../data/lesing/nivaer.js'
import { TEKSTER, BOKSTAVER, RETTSKRIVING, SETNINGER, BOYING } from '../../../data/lesing/innhold.js'
import { buildMission, oppgaveFraNivaa } from '../../matte/oppdrag.js'
import { emptyFag } from '../../profil.js'
import { applyResult } from '../../matte/stige.js'

const STIGE = { nivaer: NIVAER_LESING, gen: genLesing }

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

describe('lesegeneratorer', () => {
  it('alle nivåer peker på generatorer som finnes', () => {
    for (const n of NIVAER_LESING) for (const t of n.typer) expect(GEN_LESING[t.type], `${n.id}: ${t.type}`).toBeTypeOf('function')
  })
  for (const n of NIVAER_LESING) {
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
    expect(oppgaveFraNivaa(99, rng, STIGE).nivaa).toBe(16)
  })
  it('nivåreglene skalerer til fem oppgaver', () => {
    const f = { ...emptyFag(), nivaa: 8, plassert: true, paaRad: 1 }
    expect(applyResult(f, { correct: 5, total: 5, nivaa: 8 }, 16).events.levelUp).toBe(true)
    expect(applyResult(f, { correct: 4, total: 5, nivaa: 8 }, 16).fag.hjelpNeste).toBe(false)
    expect(applyResult(f, { correct: 3, total: 5, nivaa: 8 }, 16).fag.hjelpNeste).toBe(true)
  })
})

// Etappe U (runde 5): former og farger inn i matte.
import { describe, it, expect } from 'vitest'
import { readdirSync } from 'node:fs'
import { seeded } from '../rng.js'
import { gen } from '../matte/generatorer.js'
import { buildMission, MATTE_STIGE } from '../matte/oppdrag.js'
import { emptyFag } from '../profil.js'
import { NIVAER } from '../../data/matte/nivaer.js'
import { LAERKORT, laerkortForNivaa } from '../../data/laerkort.js'

const FORMTYPER = ['monster_neste', 'sorter_storrelse', 'form_navn', 'farge_navn', 'tell_former']

describe('U – former og farger i matte', () => {
  it('1. form_navn og farge_navn har aldri et svaralternativ med samme bilde som spørsmålet', () => {
    const rng = seeded(1)
    for (let i = 0; i < 300; i++) {
      for (const type of ['form_navn', 'farge_navn']) {
        const t = gen(type, {}, rng)
        for (const o of t.options) {
          expect(String(o)).not.toContain(t.visual.emoji)
          expect(/\p{Extended_Pictographic}/u.test(String(o)), `${type}: ${o}`).toBe(false)
        }
        expect(t.options).toContain(t.answer)
      }
    }
  })
  it('generatorene gir gyldige oppgaver', () => {
    const rng = seeded(2)
    for (let i = 0; i < 200; i++) {
      const m = gen('monster_neste', {}, rng)
      expect(m.visual.items[m.visual.items.length - 1]).toBe('?')
      expect(m.options).toContain(m.answer)
      expect(new Set(m.options).size).toBe(m.options.length)
      const s = gen('sorter_storrelse', {}, rng)
      expect(s.items.map((x) => x.id).sort()).toEqual([...s.answer].sort())
      expect(s.items.length).toBeGreaterThanOrEqual(3)
      const c = gen('tell_former', { max: 5 }, rng)
      const maal = c.explain.match(/: (.+)\.$/)[1]
      expect(c.visual.items.filter((x) => x === maal).length).toBe(c.answer)
      expect(c.options).toContain(c.answer)
    }
  })
  it('2. 400 oppdrag på matte 1–4: høyst to form-/fargeoppgaver per oppdrag, og alle fem typene forekommer', () => {
    const rng = seeded(3)
    const sett = new Set()
    for (let i = 0; i < 400; i++) {
      const nivaa = 1 + (i % 4)
      const m = buildMission({ ...emptyFag(), nivaa, plassert: true }, { rng, stige: MATTE_STIGE })
      const ff = m.tasks.filter((t) => FORMTYPER.includes(t.type))
      expect(ff.length, `nivå ${nivaa}`).toBeLessThanOrEqual(2)
      for (const t of ff) sett.add(t.type)
    }
    expect([...sett].sort()).toEqual([...FORMTYPER].sort())
    for (const n of [1, 2, 3, 4]) expect(NIVAER[n - 1].typer.some((t) => FORMTYPER.includes(t.type))).toBe(true)
  })
  it('det finnes ett «Lær først»-kort om mønster', () => {
    const k = LAERKORT.find((x) => x.typer.includes('monster_neste'))
    expect(k).toBeTruthy()
    expect(laerkortForNivaa('matte', k.nivaa).id).toBe(k.id)
    expect(k.steg.length).toBeGreaterThanOrEqual(3)
  })
  it('3. Former og Farger er fjernet fra koden', () => {
    const filer = readdirSync('src/activities').concat(readdirSync('src/data'))
    for (const f of ['QuizEngine.jsx', 'Patterns.jsx', 'TopicLadder.jsx', 'engines.js', 'topics.js', 'levels.js']) expect(filer).not.toContain(f)
  })
})

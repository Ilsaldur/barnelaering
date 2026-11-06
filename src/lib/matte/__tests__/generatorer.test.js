import { describe, it, expect } from 'vitest'
import { seeded } from '../../rng.js'
import { gen, GENERATORER } from '../generatorer.js'
import { NIVAER } from '../../../data/matte/nivaer.js'

function sjekk(task, type) {
  expect(task.prompt, type).toBeTruthy()
  expect(task.spoken, type).toBeTruthy()
  expect(task.explain, type).toBeTruthy()
  expect(['valg', 'tastatur', 'santusant', 'sorter', 'tallinje'], type).toContain(task.form)
  if (task.form === 'valg') {
    expect(task.options.length, type).toBeGreaterThanOrEqual(2)
    expect(task.options.map(String), type).toContain(String(task.answer))
    expect(new Set(task.options.map(String)).size, type).toBe(task.options.length)
    for (const o of task.options) if (typeof o === 'number') expect(o, type).toBeGreaterThanOrEqual(task.allowNegative ? -100 : 0)
  } else if (task.form === 'tastatur') {
    expect(typeof task.answer, type).toBe('number')
    expect(Number.isFinite(task.answer), type).toBe(true)
    if (!task.allowNegative) expect(task.answer, type).toBeGreaterThanOrEqual(0)
    if (!task.allowDecimal) expect(Number.isInteger(task.answer), type).toBe(true)
  } else if (task.form === 'sorter') {
    expect(task.items.length, type).toBe(task.answer.length)
    expect([...task.items].sort((a, b) => a - b), type).toEqual(task.answer)
  } else if (task.form === 'tallinje') {
    expect(task.answer, type).toBeGreaterThanOrEqual(task.line.from)
    expect(task.answer, type).toBeLessThanOrEqual(task.line.to)
    expect((task.answer - task.line.from) % task.line.step, type).toBe(0)
  } else {
    expect(typeof task.answer, type).toBe('boolean')
  }
}

describe('oppgavegeneratorer', () => {
  it('alle nivåer peker på generatorer som finnes', () => {
    for (const n of NIVAER) for (const t of n.typer) expect(GENERATORER[t.type], `${n.id}: ${t.type}`).toBeTypeOf('function')
  })

  for (const n of NIVAER) {
    it(`nivå ${n.id} (${n.tittel}) gir gyldige oppgaver`, () => {
      const rng = seeded(n.id * 7)
      for (const t of n.typer) {
        for (let i = 0; i < 150; i++) sjekk(gen(t.type, t.param, rng), `${n.id}/${t.type}`)
      }
    })
  }

  it('tierovergang stemmer', () => {
    const rng = seeded(3)
    for (let i = 0; i < 200; i++) {
      const p = gen('pluss_tierovergang', {}, rng)
      const [a, b] = p.prompt.match(/\d+/g).map(Number)
      expect((a % 10) + (b % 10)).toBeGreaterThanOrEqual(10)
      expect(a + b).toBeLessThanOrEqual(20)
      const m = gen('minus_tierovergang', {}, rng)
      const [c, d] = m.prompt.match(/\d+/g).map(Number)
      expect(c % 10).toBeLessThan(d % 10)
      expect(c - d).toBeGreaterThanOrEqual(0)
      const u = gen('pluss_uten_overgang_20', {}, rng)
      const [e, f] = u.prompt.match(/\d+/g).map(Number)
      expect((e % 10) + (f % 10)).toBeLessThan(10)
      expect(e + f).toBeLessThanOrEqual(20)
    }
  })

  it('tosifret med og uten veksling', () => {
    const rng = seeded(5)
    for (let i = 0; i < 200; i++) {
      const u = gen('tosifret_tosifret_uten', {}, rng)
      const [a, b] = u.prompt.match(/\d+/g).map(Number)
      if (u.prompt.includes('+')) expect((a % 10) + (b % 10)).toBeLessThan(10)
      else expect(a % 10).toBeGreaterThanOrEqual(b % 10)
      const m = gen('tosifret_tosifret_med', {}, rng)
      const [c, d] = m.prompt.match(/\d+/g).map(Number)
      if (m.prompt.includes('+')) expect((c % 10) + (d % 10)).toBeGreaterThanOrEqual(10)
      else expect(c % 10).toBeLessThan(d % 10)
    }
  })

  it('tiervenner gir riktig partner og kort-id', () => {
    for (let a = 0; a <= 10; a++) {
      const t = gen('tiervenner', { a })
      expect(t.answer).toBe(10 - a)
      expect(t.kortId).toBe(`tiervenner:${a}`)
    }
  })

  it('gangetabell med faste faktorer', () => {
    const t = gen('gange_tabell', { a: 6, b: 7, tabeller: [6] }, seeded(1))
    expect(t.answer).toBe(42)
    expect(t.kortId).toMatch(/gange:(6x7|7x6)/)
  })

  it('fra nivå 7: ingen trivielle oppgaver med 0 (10 + 0, 0 + ? = 10)', () => {
    const rng = seeded(77)
    for (const type of ['pluss_innen_10', 'pluss_apen', 'minus_innen_10', 'minus_apen', 'tiervenner']) {
      for (let i = 0; i < 200; i++) {
        const t = gen(type, { max: 10 }, rng)
        const tall = (t.prompt.match(/\d+/g) || []).map(Number)
        expect(tall, `${type}: ${t.prompt}`).not.toContain(0)
        expect(t.answer, `${type}: ${t.prompt}`).not.toBe(0)
        if (type === 'tiervenner') expect(t.answer).toBeLessThan(10)
      }
    }
  })
  it('20 − 8 forklares via tieren', () => {
    const rng = seeded(1)
    let sett = false
    for (let i = 0; i < 2000 && !sett; i++) {
      const t = gen('tosifret_ensifret_med', {}, rng)
      if (t.prompt.includes('−') && t.prompt.match(/^(\d+)0 −/)) {
        expect(t.explain).toMatch(/− 10 = \d+, og så \d+ tilbake/)
        expect(t.explain).not.toMatch(/− 0 =/)
        sett = true
      }
    }
    expect(sett).toBe(true)
    for (let i = 0; i < 500; i++) {
      const t = gen('tosifret_ensifret_med', {}, rng)
      expect(t.explain).not.toMatch(/− 0 =|\+ 0 =|og så 0 til/)
    }
  })
  it('nivå 2 blander telling, terning, fingre og flest', () => {
    const n = NIVAER[1]
    expect(n.typer.map((t) => t.type).sort()).toEqual(['fingre', 'mer_mindre_mengder', 'tell', 'terning'])
    const rng = seeded(2)
    for (let i = 0; i < 50; i++) {
      const t = gen('fingre', { min: 1, max: 10 }, rng)
      expect(t.visual.kind).toBe('fingre')
      expect(t.options).toContain(t.answer)
    }
  })
})

import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { genKlokke, klokkespraak, klokkeSetning, digital, GEN_KLOKKE } from '../klokke/generatorer.js'
import { NIVAER_KLOKKE } from '../../data/klokke/nivaer.js'
import { genGeo, GEN_GEO } from '../geo/generatorer.js'
import { NIVAER_GEO } from '../../data/geo/nivaer.js'
import { LAND, landFor } from '../../data/geo/land.js'
import { countries, pathFor, viewBoxFor, centroidFor } from '../geo/topo.js'
import { genEngelsk, GEN_ENGELSK } from '../engelsk/generatorer.js'
import { NIVAER_ENGELSK } from '../../data/engelsk/nivaer.js'
import { ORD, SETNINGER, FYLL_INN, SPORSMAAL } from '../../data/engelsk/innhold.js'
import { buildMission, oppdragLengde } from '../matte/oppdrag.js'
import { emptyFag } from '../profil.js'

function sjekkValg(task, navn) {
  expect(task.prompt, navn).toBeTruthy()
  expect(task.spoken, navn).toBeTruthy()
  expect(task.explain, navn).toBeTruthy()
  if (task.form === 'valg') {
    expect(task.options.map(String), navn).toContain(String(task.answer))
    expect(new Set(task.options.map(String)).size, navn).toBe(task.options.length)
  } else if (task.form === 'valgklokke') {
    expect(task.options.map((o) => o.value), navn).toContain(task.answer)
    expect(new Set(task.options.map((o) => o.value)).size, navn).toBe(task.options.length)
  }
}

describe('klokkespråk', () => {
  it('bruker norsk klokkespråk riktig', () => {
    expect(klokkespraak(3, 0)).toBe('3')
    expect(klokkespraak(3, 5)).toBe('fem over 3')
    expect(klokkespraak(3, 15)).toBe('kvart over 3')
    expect(klokkespraak(3, 20)).toBe('ti på halv 4')
    expect(klokkespraak(3, 25)).toBe('fem på halv 4')
    expect(klokkespraak(3, 30)).toBe('halv 4')
    expect(klokkespraak(3, 35)).toBe('fem over halv 4')
    expect(klokkespraak(3, 40)).toBe('ti over halv 4')
    expect(klokkespraak(3, 45)).toBe('kvart på 4')
    expect(klokkespraak(3, 50)).toBe('ti på 4')
    expect(klokkespraak(3, 55)).toBe('fem på 4')
    expect(klokkespraak(12, 30)).toBe('halv 1')
    expect(klokkeSetning(8, 30)).toBe('Klokka er halv 9')
    expect(digital(7, 5)).toBe('07:05')
  })
  for (const n of NIVAER_KLOKKE) {
    it(`klokke nivå ${n.id} (${n.tittel}) gir gyldige oppgaver`, () => {
      const rng = seeded(200 + n.id)
      for (const t of n.typer) {
        expect(GEN_KLOKKE[t.type], t.type).toBeTypeOf('function')
        for (let i = 0; i < 60; i++) {
          const task = genKlokke(t.type, t.param, rng)
          sjekkValg(task, `${n.id}/${t.type}`)
          // Digital og norsk klokkespråk blandes ikke i samme oppgave.
          const harDigital = /\d\d:\d\d/.test(task.prompt) || (task.form === 'valg' && task.options.some((o) => /^\d\d:\d\d$/.test(String(o))))
          const re = /\b(halv \d|kvart (over|på) \d|(fem|ti) (over|på) (halv )?\d)/
          const harSpraak = re.test(task.prompt) || (task.form === 'valg' && task.options.some((o) => re.test(String(o))))
          if (task.type !== 'tidsregning') expect(harDigital && harSpraak, `${t.type}: ${task.prompt}`).toBe(false)
          if (task.form === 'still') {
            expect(task.answer.h).toBeGreaterThanOrEqual(1)
            expect(task.answer.h).toBeLessThanOrEqual(12)
            expect(task.answer.m % task.step).toBe(0)
          }
        }
      }
    })
  }
})

describe('geografi', () => {
  it('alle land finnes i kartdataene', () => {
    const ids = new Set(countries().map((c) => c.id))
    for (const l of LAND) expect(ids.has(l.id), `${l.navn} (${l.id})`).toBe(true)
    expect(new Set(LAND.map((l) => l.id)).size).toBe(LAND.length)
    expect(landFor('norden')).toHaveLength(5)
    expect(landFor('europa').length).toBeGreaterThan(20)
  })
  it('kartet gir SVG-stier og utsnitt', () => {
    const no = countries().find((c) => c.id === '578')
    expect(pathFor(no)).toMatch(/^M/)
    const [x, y] = centroidFor(no)
    expect(x).toBeGreaterThan(0)
    expect(y).toBeLessThan(0)
    const vb = viewBoxFor('norden')
    expect(vb.w).toBeGreaterThan(0)
    expect(vb.h).toBeGreaterThan(0)
  })
  for (const n of NIVAER_GEO) {
    it(`geografi nivå ${n.id} (${n.tittel}) gir gyldige oppgaver`, () => {
      const rng = seeded(300 + n.id)
      for (const t of n.typer) {
        expect(GEN_GEO[t.type], t.type).toBeTypeOf('function')
        for (let i = 0; i < 60; i++) {
          const task = genGeo(t.type, t.param, rng)
          sjekkValg(task, `${n.id}/${t.type}`)
          if (task.form === 'kart') expect(LAND.map((l) => l.id)).toContain(task.answer)
        }
      }
    })
  }
})

describe('engelsk (UTKAST)', () => {
  it('innholdet er gyldig', () => {
    for (const [g, liste] of Object.entries(ORD)) for (const w of liste) expect(w.en && w.no && w.emoji, `${g}/${w.en}`).toBeTruthy()
    for (const s of SETNINGER) expect(s.feil).not.toContain(s.svar)
    for (const f of FYLL_INN) expect(f.feil).not.toContain(f.svar)
    for (const q of SPORSMAAL) expect(q.feil).not.toContain(q.svar)
  })
  for (const n of NIVAER_ENGELSK) {
    it(`engelsk nivå ${n.id} (${n.tittel}) gir gyldige oppgaver`, () => {
      const rng = seeded(400 + n.id)
      for (const t of n.typer) {
        expect(GEN_ENGELSK[t.type], t.type).toBeTypeOf('function')
        for (let i = 0; i < 60; i++) {
          const task = genEngelsk(t.type, t.param, rng)
          sjekkValg(task, `${n.id}/${t.type}`)
          if (task.lang) expect(task.lang).toBe('en-GB')
        }
      }
    })
  }
})

describe('oppdrag i de nye stigene', () => {
  it('bygger åtte unike oppgaver', () => {
    const rng = seeded(7)
    for (const [nivaer, gen] of [
      [NIVAER_KLOKKE, genKlokke],
      [NIVAER_GEO, genGeo],
      [NIVAER_ENGELSK, genEngelsk],
    ]) {
      for (const nivaa of [1, Math.ceil(nivaer.length / 2), nivaer.length]) {
        const m = buildMission({ ...emptyFag(), nivaa, plassert: true }, { rng, stige: { nivaer, gen } })
        // Nivåer med færre enn 20 ulike spørsmål får fem oppgaver (etappe L).
        expect(m.tasks).toHaveLength(oppdragLengde({ nivaer, gen }, nivaa))
        expect([5, 8]).toContain(m.tasks.length)
      }
    }
  })
})

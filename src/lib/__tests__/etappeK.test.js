import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { seeded } from '../rng.js'
import { LYDRETTE_ORD, RETTSKRIVING, ORDKLASSER, TEGNSETTING, TEKSTER, BOKSTAVER } from '../../data/lesing/innhold.js'
import { TEKSTER2 } from '../../data/lesing/tekster2.js'
import { LAERKORT } from '../../data/laerkort.js'
import { FARGER as COLORS } from '../../data/matte/former.js'
import { ORD } from '../../data/engelsk/innhold.js'
import { KORT } from '../../data/kort.js'
import { LAND } from '../../data/geo/land.js'
import { gen } from '../matte/generatorer.js'
import { buildMission } from '../matte/oppdrag.js'
import { emptyFag } from '../profil.js'
import { NIVAER } from '../../data/matte/nivaer.js'
import { genGeo } from '../geo/generatorer.js'

describe('K innhold', () => {
  it('lydrette ord uten ski, sky, hund, rød, kopp og gås', () => {
    const ord = LYDRETTE_ORD.map((o) => o.ord)
    for (const x of ['ski', 'sky', 'hund', 'rød', 'kopp', 'gås']) expect(ord).not.toContain(x)
  })
  it('«sten» og «ren» står ikke som feilsvar', () => {
    for (const liste of Object.values(RETTSKRIVING)) for (const o of liste) for (const f of o.feil) expect(['sten', 'ren']).not.toContain(f)
  })
  it('verb i ordklassene står i infinitiv (kan si «å» foran)', () => {
    for (const v of ORDKLASSER.verb) expect(v.endsWith('r'), v).toBe(false)
  })
  it('tegnsetting: hvert tegn har fire setninger', () => {
    for (const t of ['.', '?', '!']) expect(TEGNSETTING.filter((x) => x.svar === t)).toHaveLength(4)
  })
  it('kortet om stumme bokstaver nevner gj før deig', () => {
    const k = LAERKORT.find((x) => x.id === 'l13-stum-sammensatt')
    const tekst = k.steg[1].tekst
    expect(tekst.indexOf('gj')).toBeLessThan(tekst.indexOf('deig'))
  })
  it('Lese 10–12: riktig svar er ikke systematisk det lengste alternativet', () => {
    let lengst = 0
    let total = 0
    for (const t of TEKSTER2) {
      for (const q of t.sporsmaal) {
        total++
        const feil = q.alternativer.filter((a) => a !== q.svar)
        const maksFeil = Math.max(...feil.map((a) => a.length))
        if (q.svar.length > maksFeil) lengst++
        // Riktig svar høyst 40 % lengre enn det lengste feilsvaret.
        expect(q.svar.length, `${t.id}: ${q.q}`).toBeLessThanOrEqual(maksFeil * 1.4 + 2)
      }
    }
    expect(lengst / total).toBeLessThan(0.35)
  })
  it('Lese 8 har minst tretten tekster på 40–80 ord', () => {
    const korte = TEKSTER.filter((t) => t.tekst.trim().split(/\s+/).length <= 80 && t.tekst.trim().split(/\s+/).length >= 40)
    expect(korte.length).toBeGreaterThanOrEqual(13)
    for (const t of korte) for (const q of t.sporsmaal) expect(q.alternativer).toContain(q.svar)
  })
  it('matte nivå 5–6: høyst én av åtte oppgaver med 0 som ledd', () => {
    const rng = seeded(56)
    for (const nivaa of [5, 6]) {
      for (let i = 0; i < 100; i++) {
        const m = buildMission({ ...emptyFag(), nivaa, plassert: true }, { rng })
        expect(m.tasks.filter((t) => t.harNull).length, `nivå ${nivaa}`).toBeLessThanOrEqual(1)
      }
    }
    const t = gen('pluss_valg', { max: 5 }, () => 0) // a = 0, b = 0
    expect(t.explain).toMatch(/null/i)
  })
  it('forklaringer: ingen «1 biler», «1 tiere», «1 tredeler», «1/3 er 1 ×»', () => {
    const rng = seeded(99)
    const daarlig = /\b1 (biler|epler|tiere|enere|hundrere|tredeler|halvdeler|firedeler|grupper|rader)\b|1\/\d er 1 ×/
    for (const n of NIVAER) {
      for (const t of n.typer) {
        for (let i = 0; i < 80; i++) {
          const task = gen(t.type, t.param, rng)
          expect(task.explain, `${n.id}/${t.type}`).not.toMatch(daarlig)
          expect(task.prompt, `${n.id}/${t.type}`).not.toMatch(daarlig)
        }
      }
    }
  })
  it('matte nivå 32: aldri «… = 160 + ?» med svar 0', () => {
    const rng = seeded(32)
    for (let i = 0; i < 500; i++) {
      const t = gen('tosifret_ganger_ensifret', {}, rng)
      if (t.prompt.includes('+ ?')) expect(t.answer).toBeGreaterThan(0)
    }
  })
  it('ingen helt nye emojier (elg, gås, rosa hjerte, vedkubbe)', () => {
    const nye = ['🫎', '🪿', '🩷', '🩵', '🩶', '🪵']
    const tekst = JSON.stringify([COLORS, ORD, KORT, LAERKORT, BOKSTAVER, LYDRETTE_ORD])
    for (const e of nye) expect(tekst, e).not.toContain(e)
  })
  it('flagg finnes som SVG for alle land, og flaggoppgaver bruker bilder', () => {
    for (const l of LAND) expect(existsSync(`public/flagg/${l.kode}.svg`), l.navn).toBe(true)
    const rng = seeded(5)
    const a = genGeo('flagg_land', { region: 'norden' }, rng)
    expect(a.visual.kind).toBe('flagg')
    const b = genGeo('land_flagg', { region: 'norden' }, rng)
    expect(b.optionFlagg[b.answer]).toBeTruthy()
    expect(b.options).toContain(b.answer)
  })
})

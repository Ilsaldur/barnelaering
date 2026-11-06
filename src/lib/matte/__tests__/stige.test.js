import { describe, it, expect } from 'vitest'
import { emptyFag } from '../../profil.js'
import { applyResult, applyBoss, activeWeakTypes } from '../stige.js'
import { startPlassering, stegPlassering, sluttNivaa } from '../plassering.js'
import { kortstokk, trekkKort, oppdaterBoks, boksFor } from '../kort.js'
import { buildMission, buildBoss, oppgaveFraNivaa } from '../oppdrag.js'
import { seeded } from '../../rng.js'

const fagAt = (nivaa, extra = {}) => ({ ...emptyFag(), nivaa, plassert: true, ...extra })

describe('nivåregler', () => {
  it('7–8 riktige to ganger på rad gir nivå opp', () => {
    let f = fagAt(10)
    let r = applyResult(f, { correct: 7, nivaa: 10 }, 38)
    expect(r.events.levelUp).toBe(false)
    expect(r.fag.paaRad).toBe(1)
    r = applyResult(r.fag, { correct: 8, nivaa: 10 }, 38)
    expect(r.events.levelUp).toBe(true)
    expect(r.fag.nivaa).toBe(11)
    expect(r.fag.paaRad).toBe(0)
  })
  it('5–6 riktige: samme nivå, rekka nullstilles', () => {
    let r = applyResult(fagAt(10, { paaRad: 1 }), { correct: 6, nivaa: 10 }, 38)
    expect(r.fag.nivaa).toBe(10)
    expect(r.fag.paaRad).toBe(0)
    expect(r.fag.hjelpNeste).toBe(false)
  })
  it('0–4 riktige: hjelp på neste oppdrag, ingen nedrykk', () => {
    const r = applyResult(fagAt(10), { correct: 3, nivaa: 10 }, 38)
    expect(r.fag.nivaa).toBe(10)
    expect(r.fag.hjelpNeste).toBe(true)
    expect(r.events.stars).toBe(0)
  })
  it('8 av 8 to ganger: sjefsoppgave tilbys når det ikke er nivå opp', () => {
    // Første 8/8 teller også mot nivå opp (7–8). For å få sjef må paaRad ikke nå 2 først:
    let f = fagAt(10, { paaRad: 0, perfektRad: 1 })
    let r = applyResult(f, { correct: 8, nivaa: 10 }, 38)
    // paaRad blir 1, perfektRad 2 → sjef
    expect(r.events.levelUp).toBe(false)
    expect(r.events.boss).toBe(13)
  })
  it('sjefsoppgave: minst fire av fem gir hopp', () => {
    expect(applyBoss(fagAt(10), { correct: 4, target: 13 }).fag.nivaa).toBe(13)
    expect(applyBoss(fagAt(10), { correct: 3, target: 13 }).fag.nivaa).toBe(10)
  })
  it('stopper på toppen', () => {
    const r = applyResult(fagAt(38, { paaRad: 1 }), { correct: 8, nivaa: 38 }, 38)
    expect(r.fag.nivaa).toBe(38)
    expect(r.events.levelUp).toBe(false)
  })
  it('bommede typer blir svake til i morgen', () => {
    const r = applyResult(fagAt(12), { correct: 6, nivaa: 12, missedTypes: ['pluss_tierovergang'] }, 38)
    expect(activeWeakTypes(r.fag)).toContain('pluss_tierovergang')
  })
  it('beste stjerner per nivå tar maks', () => {
    let r = applyResult(fagAt(5, { beste: { 5: 3 } }), { correct: 4, nivaa: 5 }, 38)
    expect(r.fag.beste[5]).toBe(3)
  })
})

describe('plasseringstest', () => {
  it('går tre opp ved riktig og to ned ved feil', () => {
    let s = startPlassering('hav', 38)
    expect(s.pos).toBe(6)
    s = stegPlassering(s, true)
    expect(s.pos).toBe(9)
    s = stegPlassering(s, false)
    expect(s.pos).toBe(7)
  })
  it('varer 8–12 oppgaver og ender på et nivå', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const rng = seeded(seed)
      let s = startPlassering('skog', 38)
      let n = 0
      while (!s.ferdig) {
        s = stegPlassering(s, rng() < 0.6)
        n++
      }
      expect(n).toBeGreaterThanOrEqual(8)
      expect(n).toBeLessThanOrEqual(12)
      expect(s.nivaa).toBeGreaterThanOrEqual(1)
      expect(s.nivaa).toBeLessThanOrEqual(38)
    }
  })
  it('et barn som klarer alt havner på toppen, et som bommer på alt på 1', () => {
    let s = startPlassering('rom', 38)
    while (!s.ferdig) s = stegPlassering(s, true)
    expect(s.nivaa).toBe(38)
    s = startPlassering('skog', 38)
    while (!s.ferdig) s = stegPlassering(s, false)
    expect(s.nivaa).toBe(1)
  })
  it('sluttnivå er høyeste klarte blant de siste fire', () => {
    expect(sluttNivaa([{ nivaa: 6, ok: true }, { nivaa: 9, ok: true }, { nivaa: 12, ok: false }, { nivaa: 10, ok: true }, { nivaa: 13, ok: false }])).toBe(10)
  })
})

describe('kort i fem bokser', () => {
  it('riktig flytter opp, feil sender til boks 1', () => {
    let b = {}
    b = oppdaterBoks(b, 'tiervenner:3', true)
    b = oppdaterBoks(b, 'tiervenner:3', true)
    expect(boksFor(b, 'tiervenner:3')).toBe(3)
    b = oppdaterBoks(b, 'tiervenner:3', false)
    expect(boksFor(b, 'tiervenner:3')).toBe(1)
    for (let i = 0; i < 10; i++) b = oppdaterBoks(b, 'tiervenner:3', true)
    expect(boksFor(b, 'tiervenner:3')).toBe(5)
  })
  it('kort i høye bokser trekkes sjeldnere', () => {
    const stokk = kortstokk('tiervenner')
    let bokser = {}
    for (const k of stokk) bokser = oppdaterBoks(bokser, k.id, true)
    for (let i = 0; i < 4; i++) bokser = oppdaterBoks(bokser, 'tiervenner:7', true) // boks 5
    bokser = oppdaterBoks(bokser, 'tiervenner:2', false) // boks 1
    const rng = seeded(9)
    let lav = 0
    let hoy = 0
    for (let i = 0; i < 400; i++) {
      const ids = trekkKort(stokk, bokser, 2, rng).map((k) => k.id)
      if (ids.includes('tiervenner:2')) lav++
      if (ids.includes('tiervenner:7')) hoy++
    }
    expect(lav).toBeGreaterThan(hoy * 3)
  })
  it('gangekort dekker tabellene', () => {
    expect(kortstokk('gange', [2, 10])).toHaveLength(20)
  })
})

describe('oppdrag', () => {
  it('åtte unike oppgaver: fem egne, to repetisjon, én fra neste nivå, sortert lett → vanskelig', () => {
    const rng = seeded(11)
    for (const nivaa of [1, 7, 12, 20, 27, 38]) {
      const m = buildMission(fagAt(nivaa), { rng })
      expect(m.tasks).toHaveLength(8)
      const tags = m.tasks.map((t) => t.tag)
      expect(tags.filter((t) => t === 'eget' || t === 'kort').length).toBe(5)
      expect(tags.filter((t) => t === 'rep' || t === 'svak').length).toBe(2)
      expect(tags.filter((t) => t === 'neste').length).toBe(1)
      for (let i = 1; i < m.tasks.length; i++) expect(m.tasks[i].nivaa).toBeGreaterThanOrEqual(m.tasks[i - 1].nivaa)
      const keys = new Set(m.tasks.map((t) => `${t.type}|${t.prompt}|${JSON.stringify(t.visual || null)}`))
      expect(keys.size).toBe(8)
      if (nivaa < 38) expect(m.tasks.some((t) => t.nivaa === nivaa + 1)).toBe(true)
    }
  })
  it('hjelpemodus henter halvparten fra nivået under', () => {
    const m = buildMission(fagAt(12, { hjelpNeste: true }), { rng: seeded(2) })
    expect(m.hjelp).toBe(true)
    expect(m.tasks.filter((t) => t.nivaa === 11).length).toBe(4)
  })
  it('svake typer kommer tilbake', () => {
    const i_morgen = new Date()
    i_morgen.setDate(i_morgen.getDate() + 1)
    const til = i_morgen.toISOString().slice(0, 10)
    const m = buildMission(fagAt(20, { svake: { pluss_tierovergang: { bom: 1, til } } }), { rng: seeded(4) })
    expect(m.tasks.some((t) => t.type === 'pluss_tierovergang')).toBe(true)
  })
  it('nivåer med kortstokk bruker kort', () => {
    const m = buildMission(fagAt(9), { rng: seeded(6) })
    expect(m.kortIds).toHaveLength(2)
    expect(m.tasks.filter((t) => t.kortId).length).toBe(2)
  })
  it('sjefsoppgave har fem oppgaver fra to–tre nivåer høyere', () => {
    const b = buildBoss(13, { rng: seeded(8) })
    expect(b.tasks).toHaveLength(5)
    for (const t of b.tasks) expect(t.nivaa).toBeGreaterThanOrEqual(12)
  })
  it('oppgave fra nivå til plasseringstest', () => {
    expect(oppgaveFraNivaa(5, seeded(1)).nivaa).toBe(5)
    expect(oppgaveFraNivaa(99, seeded(1)).nivaa).toBe(38)
  })
})

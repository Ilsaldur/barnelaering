import { describe, it, expect } from 'vitest'
import { emptyFag, mergeData, emptyData } from '../../profil.js'
import { applyResult, applyBoss, settNivaa, oppdaterSvake, activeWeakTypes, sjefMaal } from '../stige.js'
import { startPlassering, stegPlassering, START_NIVAA, TAK_NIVAA, TRAPP_MATTE } from '../plassering.js'
import { kortstokk, trekkKort, oppdaterBoks, boksFor } from '../kort.js'
import { buildMission, buildBoss, oppgaveTilPlassering, oppgaveFraNivaa, nivaaForType } from '../oppdrag.js'
import { seeded } from '../../rng.js'

const fagAt = (nivaa, extra = {}) => ({ ...emptyFag(), nivaa, plassert: true, ...extra })
const perTask = (n, ok, { tag = 'eget', type = 'x', nivaa = 10 } = {}) => Array.from({ length: n }, () => ({ type, tag, nivaa, ok, forste: true, hjelp: false, counts: ok }))

describe('nivåregler etter et oppdrag (A2)', () => {
  it('7–8 riktige to ganger på rad gir ett nivå opp, paaRad nullstilles', () => {
    let r = applyResult(fagAt(10), { correct: 7, total: 8, nivaa: 10 }, 38)
    expect(r.events.levelUp).toBe(false)
    expect(r.fag.paaRad).toBe(1)
    r = applyResult(r.fag, { correct: 8, total: 8, nivaa: 10 }, 38)
    expect(r.events.levelUp).toBe(true)
    expect(r.fag.nivaa).toBe(11)
    expect(r.fag.paaRad).toBe(0)
  })
  it('5–6 riktige: samme nivå, paaRad = 0', () => {
    const r = applyResult(fagAt(10, { paaRad: 1 }), { correct: 6, total: 8, nivaa: 10 }, 38)
    expect(r.fag.nivaa).toBe(10)
    expect(r.fag.paaRad).toBe(0)
    expect(r.fag.hjelpNeste).toBe(false)
  })
  it('0–4 riktige: hjelp neste gang; to på rad gir ett nivå ned, aldri under 1', () => {
    let r = applyResult(fagAt(10), { correct: 3, total: 8, nivaa: 10 }, 38)
    expect(r.fag.hjelpNeste).toBe(true)
    expect(r.fag.nivaa).toBe(10)
    expect(r.events.levelDown).toBe(false)
    r = applyResult(r.fag, { correct: 2, total: 8, nivaa: 10 }, 38)
    expect(r.events.levelDown).toBe(true)
    expect(r.fag.nivaa).toBe(9)
    expect(r.fag.svakRad).toBe(0)
    let lav = applyResult(fagAt(1), { correct: 0, total: 8, nivaa: 1 }, 38)
    lav = applyResult(lav.fag, { correct: 0, total: 8, nivaa: 1 }, 38)
    expect(lav.fag.nivaa).toBe(1)
    expect(lav.events.levelDown).toBe(false)
  })
  it('et godt oppdrag bryter rekka av svake', () => {
    let r = applyResult(fagAt(10), { correct: 3, total: 8, nivaa: 10 }, 38)
    r = applyResult(r.fag, { correct: 6, total: 8, nivaa: 10 }, 38)
    r = applyResult(r.fag, { correct: 3, total: 8, nivaa: 10 }, 38)
    expect(r.fag.nivaa).toBe(10)
  })
  it('8 av 8 tilbyr sjefsoppgave hver gang, tre nivåer over nivået etter oppdraget, ikke på toppen', () => {
    expect(applyResult(fagAt(2), { correct: 8, total: 8, nivaa: 2 }, 38).events.boss).toBe(5)
    const r = applyResult(fagAt(10, { paaRad: 1 }), { correct: 8, total: 8, nivaa: 10 }, 38)
    expect(r.events.levelUp).toBe(true)
    expect(r.events.boss).toBe(14)
    expect(applyResult(fagAt(37), { correct: 8, total: 8, nivaa: 37 }, 38).events.boss).toBe(38)
    expect(applyResult(fagAt(38), { correct: 8, total: 8, nivaa: 38 }, 38).events.boss).toBe(null)
    expect(applyResult(fagAt(10), { correct: 7, total: 8, nivaa: 10 }, 38).events.boss).toBe(null)
    expect(sjefMaal(36, 38)).toBe(38)
  })
  it('perfektRad finnes ikke lenger', () => {
    const r = applyResult({ ...fagAt(5), perfektRad: 1 }, { correct: 8, total: 8, nivaa: 5 }, 38)
    expect(r.fag.perfektRad).toBeUndefined()
  })
  it('beste stjerner per nivå tar maks', () => {
    const r = applyResult(fagAt(5, { beste: { 5: 3 } }), { correct: 4, total: 8, nivaa: 5 }, 38)
    expect(r.fag.beste[5]).toBe(3)
  })
})

describe('sjefsoppgaven (A3)', () => {
  it('fire av fem gir hopp til målet, ellers ingen endring', () => {
    expect(applyBoss(fagAt(2), { correct: 4, target: 5 }).fag.nivaa).toBe(5)
    expect(applyBoss(fagAt(2), { correct: 5, target: 5 }).passed).toBe(true)
    const r = applyBoss(fagAt(2, { paaRad: 1, svake: { x: { bom: 1, riktig: 0 } } }), { correct: 3, target: 5 })
    expect(r.fag.nivaa).toBe(2)
    expect(r.passed).toBe(false)
    expect(r.fag.paaRad).toBe(1)
    expect(r.fag.svake).toEqual({ x: { bom: 1, riktig: 0 } })
  })
  it('fem oppgaver: én fra nivået over, to fra hvert av de to neste', () => {
    const b = buildBoss(10, 13, { rng: seeded(3) })
    expect(b.tasks).toHaveLength(5)
    expect(b.tasks.map((t) => t.nivaa).sort((a, c) => a - c)).toEqual([11, 12, 12, 13, 13])
    for (const t of b.tasks) expect(t.tag).toBe('sjef')
  })
  it('færre nivåer igjen: fordeles på de som finnes', () => {
    expect(buildBoss(36, 38, { rng: seeded(4) }).tasks.map((t) => t.nivaa).sort((a, c) => a - c)).toEqual([37, 37, 38, 38, 38])
    expect(buildBoss(37, 38, { rng: seeded(5) }).tasks.map((t) => t.nivaa)).toEqual([38, 38, 38, 38, 38])
  })
})

describe('bom-lista (A4)', () => {
  it('bare eget nivå og repetisjon havner på lista', () => {
    const svake = oppdaterSvake(
      {},
      [
        { type: 'a', tag: 'eget', nivaa: 10, ok: false, counts: false },
        { type: 'b', tag: 'rep', nivaa: 8, ok: false, counts: false },
        { type: 'c', tag: 'neste', nivaa: 11, ok: false, counts: false },
        { type: 'd', tag: 'sjef', nivaa: 13, ok: false, counts: false },
      ],
      10,
    )
    expect(Object.keys(svake).sort()).toEqual(['a', 'b'])
  })
  it('to riktige på første forsøk fjerner typen', () => {
    let svake = { a: { bom: 1, riktig: 0 } }
    svake = oppdaterSvake(svake, [{ type: 'a', tag: 'svak', nivaa: 10, ok: true, counts: true }], 10)
    expect(svake.a.riktig).toBe(1)
    svake = oppdaterSvake(svake, [{ type: 'a', tag: 'svak', nivaa: 10, ok: true, counts: true }], 10)
    expect(svake.a).toBeUndefined()
  })
  it('feil igjen nullstiller riktig-telleren', () => {
    let svake = { a: { bom: 1, riktig: 1 } }
    svake = oppdaterSvake(svake, [{ type: 'a', tag: 'svak', nivaa: 10, ok: false, counts: false }], 10)
    expect(svake.a).toMatchObject({ bom: 2, riktig: 0 })
  })
  it('nivå satt for hånd og nedflytting tømmer lista og rekkene', () => {
    const f = settNivaa(fagAt(38, { svake: { likning: { bom: 2, riktig: 0 } }, paaRad: 1, sjef: 40 }), 2)
    expect(f.nivaa).toBe(2)
    expect(f.svake).toEqual({})
    expect(f.paaRad).toBe(0)
    expect(f.sjef).toBe(null)
    let r = applyResult(fagAt(10, { svake: { x: { bom: 1, riktig: 0 } } }), { correct: 2, total: 8, nivaa: 10 }, 38)
    r = applyResult(r.fag, { correct: 2, total: 8, nivaa: 10 }, 38)
    expect(r.fag.svake).toEqual({})
  })
  it('oppdrag tar aldri med typer fra høyere nivå', () => {
    const f = fagAt(2, { svake: { likning: { bom: 3, riktig: 0 }, tell: { bom: 1, riktig: 0 } } })
    const m = buildMission(f, { rng: seeded(6) })
    expect(m.tasks.some((t) => t.type === 'likning')).toBe(false)
    for (const t of m.tasks) expect(t.nivaa).toBeLessThanOrEqual(3)
  })
  it('synkronisering tar lista fra siden som sist ble endret', () => {
    const a = emptyData()
    a.fag.matte = { ...a.fag.matte, nivaa: 2, updatedAt: 200, svake: {} }
    const b = emptyData()
    b.fag.matte = { ...b.fag.matte, nivaa: 38, updatedAt: 100, svake: { likning: { bom: 2, riktig: 0 } } }
    const m = mergeData(a, b)
    expect(m.fag.matte.nivaa).toBe(2)
    expect(m.fag.matte.svake).toEqual({})
    expect(mergeData(b, a).fag.matte.svake).toEqual({})
  })
})

describe('plasseringstest (A1)', () => {
  it('start og tak per verden', () => {
    expect(START_NIVAA).toEqual({ skog: 1, hav: 6, fjell: 13, slott: 21, rom: 29 })
    expect(TAK_NIVAA).toEqual({ skog: 7, hav: 15, fjell: 23, slott: 31, rom: 38 })
  })
  it('to riktige går to opp, aldri over taket; alt riktig fra havet gir 15 på høyst 12 oppgaver', () => {
    let s = startPlassering({ start: 6, tak: 15, maks: 38 })
    const sett = []
    let n = 0
    while (!s.ferdig) {
      sett.push(s.pos)
      s = stegPlassering(s, true)
      n++
    }
    expect(s.nivaa).toBe(15)
    expect(n).toBeLessThanOrEqual(12)
    // 14 bestått rett under taket 15: plasseringen er gitt uten prøve på taket.
    expect([...new Set(sett)]).toEqual([6, 8, 10, 12, 14])
  })
  it('kan alt til og med 9: består 6 og 8, bommer på 10, plasseres på 9', () => {
    let s = startPlassering({ start: 6, tak: 15, maks: 38 })
    const spurt = []
    while (!s.ferdig) {
      spurt.push(s.pos)
      s = stegPlassering(s, s.pos <= 9)
    }
    expect(spurt).toEqual([6, 6, 8, 8, 10])
    expect(s.nivaa).toBe(9)
  })
  it('bommer på alt: to ned om gangen, ender på 1', () => {
    let s = startPlassering({ start: 6, tak: 15, maks: 38 })
    const spurt = []
    while (!s.ferdig) {
      spurt.push(s.pos)
      s = stegPlassering(s, false)
    }
    expect(spurt).toEqual([6, 4, 2, 1])
    expect(s.nivaa).toBe(1)
  })
  it('bommer på start: ned til startnivået i verdenen under og klatrer derfra', () => {
    let s = startPlassering({ start: 13, tak: 23, maks: 38, trapp: TRAPP_MATTE })
    s = stegPlassering(s, false) // 13
    expect(s.pos).toBe(6)
    expect(s.tak).toBe(15)
    s = stegPlassering(s, true)
    s = stegPlassering(s, true) // besto 6
    expect(s.pos).toBe(8)
    s = stegPlassering(s, false) // bom på 8
    expect(s.ferdig).toBe(true)
    expect(s.nivaa).toBe(7)
  })
  it('én feil på andre oppgave stopper også', () => {
    let s = startPlassering({ start: 1, tak: 7, maks: 38 })
    s = stegPlassering(s, true)
    s = stegPlassering(s, true) // besto 1 → 3
    s = stegPlassering(s, true)
    s = stegPlassering(s, false) // bom på 3
    expect(s.ferdig).toBe(true)
    expect(s.nivaa).toBe(2)
  })
  it('lesing: tak 9 uansett start', () => {
    let s = startPlassering({ start: 8, tak: 9, maks: 16 })
    while (!s.ferdig) s = stegPlassering(s, true)
    expect(s.nivaa).toBe(9)
  })
  it('oppgaver til testen er aldri sant/usant eller fagord-typer', () => {
    const rng = seeded(8)
    for (let n = 1; n <= 38; n++) {
      for (let i = 0; i < 10; i++) {
        const t = oppgaveTilPlassering(n, rng)
        expect(t.form, `nivå ${n}`).not.toBe('santusant')
        expect(t.type, `nivå ${n}`).not.toBe('partall_oddetall')
        expect(t.hjelp).toBeUndefined()
        expect(t.tag).toBe('plassering')
      }
    }
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
  })
  it('kort i høye bokser trekkes sjeldnere', () => {
    const stokk = kortstokk('tiervenner')
    let bokser = {}
    for (const k of stokk) bokser = oppdaterBoks(bokser, k.id, true)
    for (let i = 0; i < 4; i++) bokser = oppdaterBoks(bokser, 'tiervenner:7', true)
    bokser = oppdaterBoks(bokser, 'tiervenner:2', false)
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
})

describe('oppdrag (A5)', () => {
  it('åtte unike oppgaver: fem egne, to repetisjon fra de fem siste nivåene under, én fra neste', () => {
    const rng = seeded(11)
    for (const nivaa of [1, 7, 12, 20, 27, 38]) {
      const m = buildMission(fagAt(nivaa), { rng })
      expect(m.tasks).toHaveLength(8)
      const tags = m.tasks.map((t) => t.tag)
      expect(tags.filter((t) => t === 'eget' || t === 'kort').length).toBe(5)
      expect(tags.filter((t) => t === 'rep' || t === 'svak').length).toBe(2)
      expect(tags.filter((t) => t === 'neste').length).toBe(1)
      for (const t of m.tasks.filter((x) => x.tag === 'rep')) {
        expect(t.nivaa).toBeGreaterThanOrEqual(Math.max(1, nivaa - 5))
        expect(t.nivaa).toBeLessThan(Math.max(2, nivaa))
      }
      for (let i = 1; i < m.tasks.length; i++) expect(m.tasks[i].nivaa).toBeGreaterThanOrEqual(m.tasks[i - 1].nivaa)
      for (const t of m.tasks) expect(t.nivaa).toBeLessThanOrEqual(Math.min(38, nivaa + 1))
    }
  })
  it('hjelpemodus henter halvparten fra nivået under', () => {
    const m = buildMission(fagAt(12, { hjelpNeste: true }), { rng: seeded(2) })
    expect(m.hjelp).toBe(true)
    expect(m.tasks.filter((t) => t.nivaa === 11).length).toBe(4)
  })
  it('svake typer kommer tilbake', () => {
    const m = buildMission(fagAt(20, { svake: { pluss_tierovergang: { bom: 1, riktig: 0 } } }), { rng: seeded(4) })
    expect(m.tasks.some((t) => t.type === 'pluss_tierovergang')).toBe(true)
  })
  it('nivåer med kortstokk bruker kort', () => {
    const m = buildMission(fagAt(9), { rng: seeded(6) })
    expect(m.kortIds).toHaveLength(2)
  })
  it('hjelpefunksjoner', () => {
    expect(oppgaveFraNivaa(5, seeded(1)).nivaa).toBe(5)
    expect(nivaaForType('likning')).toBe(38)
    expect(activeWeakTypes({ svake: { a: {} } })).toEqual(['a'])
  })
})

describe('hjelpemodus (etappe F)', () => {
  it('gir aldri paaRad + 1 eller sjefsoppgave; godt resultat slår hjelp av', () => {
    const f = fagAt(18, { hjelpNeste: true, svakRad: 1, paaRad: 0 })
    const r = applyResult(f, { correct: 8, total: 8, nivaa: 18, hjelpModus: true }, 38)
    expect(r.fag.nivaa).toBe(18)
    expect(r.fag.paaRad).toBe(0)
    expect(r.fag.hjelpNeste).toBe(false)
    expect(r.fag.svakRad).toBe(0)
    expect(r.events.boss).toBe(null)
    expect(r.events.levelUp).toBe(false)
    const r5 = applyResult(f, { correct: 5, total: 8, nivaa: 18, hjelpModus: true }, 38)
    expect(r5.fag.hjelpNeste).toBe(false)
    expect(r5.fag.svakRad).toBe(0)
  })
  it('svakt resultat i hjelpemodus teller som svakt; nedflytting slår hjelp av', () => {
    const f = fagAt(18, { hjelpNeste: true, svakRad: 1 })
    const r = applyResult(f, { correct: 3, total: 8, nivaa: 18, hjelpModus: true }, 38)
    expect(r.events.levelDown).toBe(true)
    expect(r.fag.nivaa).toBe(17)
    expect(r.fag.hjelpNeste).toBe(false)
    expect(r.fag.svakRad).toBe(0)
  })
  it('akseptansetest 2: 92 % til nivå 12, 55 % på 13, 15 % over – færre enn 5 % ender på ≤ 9', () => {
    const rng = seeded(2024)
    const BARN = 300
    let lave = 0
    for (let b = 0; b < BARN; b++) {
      let fag = fagAt(12)
      for (let m = 0; m < 40; m++) {
        const mission = buildMission(fag, { rng })
        const perTask = mission.tasks.map((t) => {
          const p = t.nivaa <= 12 ? 0.92 : t.nivaa === 13 ? 0.55 : 0.15
          const ok = rng() < p
          return { type: t.type, nivaa: t.nivaa, tag: t.tag, ok, forste: true, hjelp: false, counts: ok }
        })
        const correct = perTask.filter((x) => x.counts).length
        fag = applyResult(fag, { correct, total: mission.tasks.length, nivaa: mission.nivaa, perTask, hjelpModus: mission.hjelp }, 38).fag
      }
      if (fag.nivaa <= 9) lave++
    }
    expect(lave / BARN).toBeLessThan(0.05)
  })
})

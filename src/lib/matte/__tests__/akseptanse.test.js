// Akseptansetester for etappe A, skrevet som simuleringer av et barn som
// «kan alt til og med nivå K»: det svarer riktig på en oppgave hvis og bare hvis
// oppgavens nivå er ≤ K.
import { describe, it, expect } from 'vitest'
import { seeded } from '../../rng.js'
import { emptyFag } from '../../profil.js'
import { startFinn, stegFinn } from '../finnNivaa.js'
import { buildMission, buildBoss, oppgaveTilPlassering } from '../oppdrag.js'
import { applyResult, applyBoss, settNivaa } from '../stige.js'

const MAKS = 38

// Kjør det første oppdraget (reven finner nivået) med et barn som kan alt til og med `kan`.
function plasser(kan, rng) {
  let s = startFinn({ maks: MAKS })
  const oppgaver = []
  while (!s.ferdig) {
    const t = oppgaveTilPlassering(s.pos, rng)
    oppgaver.push(t)
    s = stegFinn(s, t.nivaa <= kan)
  }
  return { nivaa: s.nivaa, oppgaver }
}

// Spill ett oppdrag med gitt antall riktige (de første `riktige` oppgavene riktige).
function spill(fag, riktige, rng) {
  const m = buildMission(fag, { rng })
  const perTask = m.tasks.map((t, i) => {
    const ok = i < riktige
    return { type: t.type, nivaa: t.nivaa, tag: t.tag, kortId: t.kortId, ok, forste: true, hjelp: false, counts: ok }
  })
  return { mission: m, ...applyResult(fag, { correct: riktige, total: m.tasks.length, nivaa: m.nivaa, perTask }, MAKS) }
}

describe('akseptansetester etappe A', () => {
  it('1. svarer riktig på alt: nivå 38 etter høyst 14 oppgaver', () => {
    const { nivaa, oppgaver } = plasser(38, seeded(1))
    expect(nivaa).toBe(38)
    expect(oppgaver.length).toBeLessThanOrEqual(14)
  })
  it('2. kan alt til og med nivå 9: 1, 2, 4, 8, 16 (bom), 12 (bom), 10 (bom), 9, 9 → nivå 9', () => {
    const { nivaa, oppgaver } = plasser(9, seeded(2))
    expect(oppgaver.slice(0, 9).map((t) => t.nivaa)).toEqual([1, 2, 4, 8, 16, 12, 10, 9, 9])
    expect(nivaa).toBe(9)
  })

  it('3. bommer på alt: plasseres på 1 etter åtte oppgaver', () => {
    const { nivaa, oppgaver } = plasser(0, seeded(3))
    expect(nivaa).toBe(1)
    expect(oppgaver).toHaveLength(8)
  })

  it('4. bom på nivå 38, sett nivå 2 under For voksne, 50 oppdrag: ingen oppgave over nivå 3', () => {
    const rng = seeded(4)
    let fag = { ...emptyFag(), nivaa: 38, plassert: true }
    const r = spill(fag, 0, rng)
    fag = r.fag
    expect(Object.keys(fag.svake).length).toBeGreaterThan(0)
    fag = settNivaa(fag, 2)
    expect(fag.svake).toEqual({})
    for (let i = 0; i < 50; i++) {
      const m = buildMission(fag, { rng })
      for (const t of m.tasks) expect(t.nivaa).toBeLessThanOrEqual(3)
    }
  })

  it('5. nivå 2 med 8 av 8 og bestått sjefsoppgave: nivå 5 etter 13 oppgaver', () => {
    const rng = seeded(5)
    const fag = { ...emptyFag(), nivaa: 2, plassert: true }
    const r = spill(fag, 8, rng)
    expect(r.mission.tasks).toHaveLength(8)
    expect(r.fag.nivaa).toBe(2)
    expect(r.events.boss).toBe(5)
    const boss = buildBoss(r.fag.nivaa, r.events.boss, { rng })
    expect(boss.tasks).toHaveLength(5)
    const etter = applyBoss(r.fag, { correct: 4, target: boss.target })
    expect(etter.passed).toBe(true)
    expect(etter.fag.nivaa).toBe(5)
    expect(r.mission.tasks.length + boss.tasks.length).toBe(13)
  })

  it('6. to oppdrag på rad med 7 riktige: ett nivå opp, ingen sjefsoppgave', () => {
    const rng = seeded(6)
    let fag = { ...emptyFag(), nivaa: 10, plassert: true }
    let r = spill(fag, 7, rng)
    expect(r.events.boss).toBe(null)
    expect(r.fag.nivaa).toBe(10)
    r = spill(r.fag, 7, rng)
    expect(r.events.boss).toBe(null)
    expect(r.events.levelUp).toBe(true)
    expect(r.fag.nivaa).toBe(11)
  })

  it('7. to oppdrag på rad med 3 riktige på nivå 10: barnet står på nivå 9', () => {
    const rng = seeded(7)
    let r = spill({ ...emptyFag(), nivaa: 10, plassert: true }, 3, rng)
    expect(r.fag.nivaa).toBe(10)
    expect(r.fag.hjelpNeste).toBe(true)
    r = spill(r.fag, 3, rng)
    expect(r.fag.nivaa).toBe(9)
    expect(r.events.levelDown).toBe(true)
  })

  it('8. i 1000 oppdrag på tilfeldige nivåer finnes ingen oppgave over barnets nivå + 1', () => {
    const rng = seeded(8)
    for (let i = 0; i < 1000; i++) {
      const nivaa = 1 + Math.floor(rng() * MAKS)
      const svake = {}
      // Tilfeldige gamle bommer, også fra høye nivåer, skal ikke lekke inn.
      if (rng() < 0.5) svake.likning = { bom: 2, riktig: 0 }
      if (rng() < 0.5) svake.tell = { bom: 1, riktig: 0 }
      const fag = { ...emptyFag(), nivaa, plassert: true, hjelpNeste: rng() < 0.3, svake }
      const m = buildMission(fag, { rng })
      for (const t of m.tasks) expect(t.nivaa, `nivå ${nivaa}`).toBeLessThanOrEqual(Math.min(MAKS, nivaa + 1))
    }
  })

  it('plasseringstesten skriver ikke til bom-lista', () => {
    // Første oppdrag bruker bare stegFinn/settNivaa; svake er tom etterpå.
    // Kan alt til 14: 1, 2, 4, 8, 16 (bom), 12, 14, 15 (bom) → 14.
    const { nivaa } = plasser(14, seeded(9))
    const fag = settNivaa(emptyFag(), nivaa)
    expect(fag.svake).toEqual({})
    expect(fag.nivaa).toBe(14)
  })
})

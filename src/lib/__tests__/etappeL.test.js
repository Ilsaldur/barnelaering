// Etappe L (runde 4): gjentakelser. Simulering med fast frø over alle stiger.
import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { buildMission, buildBoss, oppgaveTilPlassering, oppgaveFraNivaa, nokkel, hashNokkel, huskOppgaver, antallUlike, oppdragLengde, MATTE_STIGE, SETT_MAKS } from '../matte/oppdrag.js'
import { startPlassering, stegPlassering } from '../matte/plassering.js'
import { sjefMaal } from '../matte/stige.js'
import { emptyFag, normalize, mergeData, emptyData } from '../profil.js'
import { NIVAER_GEO } from '../../data/geo/nivaer.js'
import { genGeo } from '../geo/generatorer.js'
import { NIVAER_ENGELSK } from '../../data/engelsk/nivaer.js'
import { genEngelsk } from '../engelsk/generatorer.js'
import { NIVAER_KLOKKE } from '../../data/klokke/nivaer.js'
import { genKlokke } from '../klokke/generatorer.js'
import { NIVAER_LESING, NIVAER_SKRIVE, NIVAER_SPRAK, LESE_TAK } from '../../data/lesing/nivaer.js'
import { genLesing, lagTekstOppgaver } from '../lesing/generatorer.js'

const STIGER = {
  matte: MATTE_STIGE,
  geografi: { nivaer: NIVAER_GEO, gen: genGeo },
  engelsk: { nivaer: NIVAER_ENGELSK, gen: genEngelsk },
  klokke: { nivaer: NIVAER_KLOKKE, gen: genKlokke },
  lesing: { nivaer: NIVAER_LESING, gen: genLesing, tekstOppgaver: lagTekstOppgaver },
  skrive: { nivaer: NIVAER_SKRIVE, gen: genLesing, emneMaks: 1 },
  sprak: { nivaer: NIVAER_SPRAK, gen: genLesing },
}
// Startvalgene i appen (nivå og tak), så plasseringstesten kan simuleres.
const START = {
  matte: [
    { nivaa: 1, tak: 7 },
    { nivaa: 6, tak: 15 },
    { nivaa: 13, tak: 23 },
    { nivaa: 21, tak: 31 },
    { nivaa: 29, tak: 38 },
  ],
  geografi: [{ nivaa: 1 }, { nivaa: 4 }, { nivaa: 7 }],
  engelsk: [{ nivaa: 1 }, { nivaa: 3 }, { nivaa: 5 }],
  klokke: [{ nivaa: 1 }, { nivaa: 3 }, { nivaa: 5 }, { nivaa: 7 }],
  lesing: [
    { nivaa: 1, tak: LESE_TAK },
    { nivaa: 4, tak: LESE_TAK },
    { nivaa: 6, tak: LESE_TAK },
    { nivaa: 8, tak: LESE_TAK },
  ],
}
const fagPaa = (nivaa, ekstra = {}) => ({ ...emptyFag(), nivaa, plassert: true, ...ekstra })
const nokler = (tasks) => tasks.map(nokkel)
const harDuplikat = (tasks) => new Set(nokler(tasks)).size !== tasks.length
// Nøkler som hører til nivåene i et oppdrag (og nivåene rundt): har de nok ulike spørsmål?
const nokUlike = (stige, nivaaer, trenger) => nivaaer.every((n) => antallUlike(stige, n, 60) >= trenger)

// Simulerer plasseringstesten med gitt svarmønster. Returnerer oppgavene som ble vist.
function simulerPlassering(stige, start, svar, rng, sett = []) {
  const trapp = (START[start.fag] || []).map((x) => ({ start: x.nivaa, tak: x.tak ?? stige.nivaer.length }))
  let pl = startPlassering({ start: start.nivaa, tak: start.tak ?? stige.nivaer.length, maks: stige.nivaer.length, trapp })
  const vist = []
  while (!pl.ferdig) {
    const t = oppgaveTilPlassering(pl.pos, rng, stige, { brukt: vist, sett })
    vist.push(t)
    pl = stegPlassering(pl, svar(vist.length - 1, t))
  }
  return { vist, nivaa: pl.nivaa }
}

describe('L1 – nøkkelen er det barnet ser', () => {
  it('samme flagg fra Norden og Europa er samme oppgave', () => {
    const a = { type: 'flagg_norden', nivaa: 1, prompt: 'Hvilket land har dette flagget?', visual: { kind: 'flagg', kode: 'no', navn: 'Norge' }, answer: 'Norge' }
    const b = { ...a, type: 'flagg_europa', nivaa: 4, options: ['x'] }
    expect(nokkel(a)).toBe(nokkel(b))
    expect(hashNokkel(a)).toBe(hashNokkel(b))
    expect(nokkel(a)).not.toContain('flagg_norden')
  })
  it('ulikt svar eller ulikt ord gir ulik nøkkel', () => {
    const a = { prompt: 'Hvilket ord hører du?', answer: 'og', hørOrd: 'og' }
    expect(nokkel(a)).not.toBe(nokkel({ ...a, answer: 'er', hørOrd: 'er' }))
  })
  it('husk-lista holder de 40 siste, nyeste sist, og flyttes fram når noe kommer igjen', () => {
    let fag = emptyFag()
    const tasks = Array.from({ length: 45 }, (_, i) => ({ prompt: `o${i}`, answer: i }))
    fag = huskOppgaver(fag, tasks)
    expect(fag.sett).toHaveLength(SETT_MAKS)
    expect(fag.sett[SETT_MAKS - 1]).toBe(hashNokkel(tasks[44]))
    fag = huskOppgaver(fag, [tasks[10]])
    expect(fag.sett[SETT_MAKS - 1]).toBe(hashNokkel(tasks[10]))
    expect(fag.sett.filter((h) => h === hashNokkel(tasks[10]))).toHaveLength(1)
  })
  it('husk-lista overlever normalisering og fletting', () => {
    const a = emptyData()
    a.fag.matte = { ...huskOppgaver(fagPaa(3), [{ prompt: 'a', answer: 1 }, { prompt: 'b', answer: 2 }]), updatedAt: 2000 }
    const b = emptyData()
    b.fag.matte = { ...huskOppgaver(fagPaa(3), [{ prompt: 'c', answer: 3 }]), updatedAt: 1000 }
    const m = mergeData(a, b)
    expect(m.fag.matte.sett).toEqual([hashNokkel({ prompt: 'c', answer: 3 }), hashNokkel({ prompt: 'a', answer: 1 }), hashNokkel({ prompt: 'b', answer: 2 })])
    expect(normalize({ fag: { matte: { sett: 'tull' } } }).fag.matte.sett).toEqual([])
    expect(normalize({}).fag.matte.sett).toEqual([])
  })
})

describe('L2 – emne', () => {
  it('generatorene setter emne i geografi, engelsk, lesing og klokke', () => {
    const rng = seeded(1)
    expect(genGeo('flagg_land', { region: 'norden' }, rng).emne).toBeTruthy()
    expect(genGeo('finn_paa_kart', { region: 'europa' }, rng).emne).toBeTruthy()
    expect(genEngelsk('sporsmaal', {}, rng).emne).toBeTruthy()
    expect(genLesing('skriv_ord', { gruppe: 'diftonger' }, rng).emne).toBeTruthy()
    expect(genLesing('boying', {}, rng).emne).toBeTruthy()
    expect(genKlokke('les_analog', { minutes: 'half' }, rng).emne).toMatch(/^\d+:\d+$/)
  })
  it('samme emne høyst to ganger i et oppdrag og aldri to på rad (alle stiger, alle nivåer)', () => {
    const rng = seeded(22)
    for (const [fag, stige] of Object.entries(STIGER)) {
      for (const def of stige.nivaer) {
        if (def.tekstOppdrag) continue
        for (let k = 0; k < 15; k++) {
          const m = buildMission(fagPaa(def.id), { rng, stige })
          const teller = {}
          for (const t of m.tasks) if (t.emne != null) teller[t.emne] = (teller[t.emne] || 0) + 1
          const maks = stige.emneMaks || 2
          // Regelen viker bare når nivået har for få emner.
          const emner = new Set()
          const r2 = seeded(def.id)
          for (let i = 0; i < 200; i++) emner.add(stige.gen(def.typer[0].type, def.typer[0].param, r2).emne)
          if (emner.size * maks >= m.tasks.length) {
            for (const [e, n] of Object.entries(teller)) expect(n, `${fag} ${def.id}: ${e}`).toBeLessThanOrEqual(maks)
            for (let i = 1; i < m.tasks.length; i++) if (m.tasks[i].emne != null) expect(m.tasks[i].emne, `${fag} ${def.id} plass ${i}`).not.toBe(m.tasks[i - 1].emne)
          }
        }
      }
    }
  })
})

describe('L4 – små nivåer og toppnivået', () => {
  it('nivåer med færre enn 20 ulike spørsmål får fem oppgaver: i dag Geografi 1, 2, 3 og 9, Språk 2 og Engelsk 7', () => {
    const smaa = []
    for (const [fag, stige] of Object.entries(STIGER)) for (const def of stige.nivaer) if (!def.tekstOppdrag && oppdragLengde(stige, def.id) === 5) smaa.push(`${fag} ${def.id}`)
    expect(smaa.sort()).toEqual(['engelsk 7', 'geografi 1', 'geografi 2', 'geografi 3', 'geografi 9', 'sprak 2'])
    const m = buildMission(fagPaa(1), { rng: seeded(3), stige: STIGER.geografi })
    expect(m.tasks).toHaveLength(5)
    expect(m.tasks.filter((t) => t.tag === 'eget')).toHaveLength(3)
    expect(m.tasks.filter((t) => t.tag === 'rep')).toHaveLength(1)
    expect(m.tasks.filter((t) => t.tag === 'neste')).toHaveLength(1)
    expect(oppdragLengde(MATTE_STIGE, 9)).toBe(8)
    expect(oppdragLengde(STIGER.klokke, 1)).toBe(8)
  })
  it('på toppnivået kommer en repetisjon i stedet for smakebiten', () => {
    for (const [fag, stige] of Object.entries(STIGER)) {
      const topp = stige.nivaer.length
      if (stige.nivaer[topp - 1].tekstOppdrag) continue
      const m = buildMission(fagPaa(topp), { rng: seeded(5), stige })
      expect(m.tasks.filter((t) => t.tag === 'neste'), fag).toHaveLength(0)
      expect(m.tasks.filter((t) => t.tag === 'rep').length, fag).toBeGreaterThanOrEqual(2)
      for (const t of m.tasks) expect(t.nivaa, fag).toBeLessThanOrEqual(topp)
    }
  })
})

describe('Akseptansetester L', () => {
  it('1. ingen oppdrag, sjefsoppgaver eller plasseringstester har to oppgaver med samme nøkkel', () => {
    const rng = seeded(101)
    for (const [fag, stige] of Object.entries(STIGER)) {
      const MAKS = stige.nivaer.length
      for (const def of stige.nivaer) {
        if (def.tekstOppdrag) continue
        for (let k = 0; k < 10; k++) {
          const m = buildMission(fagPaa(def.id), { rng, stige })
          expect(harDuplikat(m.tasks), `${fag} oppdrag nivå ${def.id}`).toBe(false)
          const maal = sjefMaal(def.id, MAKS)
          if (maal && !stige.nivaer[maal - 1].tekstOppdrag) {
            const b = buildBoss(def.id, maal, { rng, stige })
            expect(b.tasks).toHaveLength(5)
            expect(harDuplikat(b.tasks), `${fag} sjef ${def.id}→${maal}`).toBe(false)
          }
        }
      }
      for (const start of START[fag] || []) {
        for (let k = 0; k < 10; k++) {
          // Alt riktig, alt feil og annenhver.
          for (const svar of [() => true, () => false, (i) => i % 2 === 0]) {
            const { vist } = simulerPlassering(stige, { fag, ...start }, svar, rng)
            expect(harDuplikat(vist), `${fag} plassering fra ${start.nivaa}`).toBe(false)
          }
        }
      }
    }
  })

  it('2. tre oppdrag på rad: ≥30 ulike → ingen oppgave to ganger; små nivåer → ingen tre ganger før alt er brukt', () => {
    const rng = seeded(202)
    for (const [fag, stige] of Object.entries(STIGER)) {
      for (const def of stige.nivaer) {
        if (def.tekstOppdrag) continue
        for (let k = 0; k < 5; k++) {
          let f = fagPaa(def.id)
          const alle = []
          for (let o = 0; o < 3; o++) {
            const m = buildMission(f, { rng, stige })
            alle.push(...m.tasks)
            f = huskOppgaver(f, m.tasks)
          }
          // Kort i bokser (matte) er planlagt repetisjon og telles ikke.
          const teller = {}
          for (const t of alle) if (t.tag !== 'kort') teller[nokkel(t)] = (teller[nokkel(t)] || 0) + 1
          const maks = Math.max(...Object.values(teller))
          const nivaaer = [...new Set(alle.map((t) => t.nivaa))]
          if (nokUlike(stige, nivaaer, 30)) {
            expect(maks, `${fag} nivå ${def.id}`).toBe(1)
          } else {
            // Ingen oppgave tre ganger før alle nivåets spørsmål er brukt.
            const ulike = antallUlike(stige, def.id, 60)
            const egne = alle.filter((t) => t.nivaa === def.id).length
            if (egne <= 2 * ulike) expect(maks, `${fag} nivå ${def.id}`).toBeLessThanOrEqual(2)
          }
        }
      }
    }
  })

  it('3. Geografi nivå 1: plasseringstest fra Norden og tre oppdrag – ingen oppgave mer enn to ganger', () => {
    const stige = STIGER.geografi
    for (let k = 0; k < 20; k++) {
      const rng = seeded(300 + k)
      const { vist } = simulerPlassering(stige, { fag: 'geografi', nivaa: 1 }, (i) => i < 2, rng)
      let f = huskOppgaver(fagPaa(1), vist)
      const alle = [...vist]
      for (let o = 0; o < 3; o++) {
        const m = buildMission(f, { rng, stige })
        alle.push(...m.tasks)
        f = huskOppgaver(f, m.tasks)
      }
      const teller = {}
      for (const t of alle) teller[nokkel(t)] = (teller[nokkel(t)] || 0) + 1
      expect(Math.max(...Object.values(teller))).toBeLessThanOrEqual(2)
    }
  })

  it('4. Skrive riktig: samme ord står aldri to ganger i ett oppdrag', () => {
    const rng = seeded(404)
    for (const def of NIVAER_SKRIVE) {
      for (let k = 0; k < 40; k++) {
        const m = buildMission(fagPaa(def.id), { rng, stige: STIGER.skrive })
        const ord = m.tasks.map((t) => t.emne)
        expect(new Set(ord).size, `skrive ${def.id}: ${ord.join(',')}`).toBe(ord.length)
      }
    }
  })

  it('«Prøv selv» og plasseringstesten bruker husk-lista og gir tre ulike oppgaver', () => {
    const rng = seeded(7)
    const sett = huskOppgaver(fagPaa(1), Array.from({ length: 20 }, () => oppgaveFraNivaa(1, rng, STIGER.geografi))).sett
    const tasks = []
    for (let k = 0; k < 3; k++) tasks.push(oppgaveFraNivaa(1, rng, STIGER.geografi, { brukt: tasks, sett }))
    expect(harDuplikat(tasks)).toBe(false)
  })
})

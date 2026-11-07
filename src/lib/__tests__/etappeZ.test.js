// Etappe Z (runde 6): plasseringen måler nivået i kunnskapsstigene.
import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { emptyFag } from '../profil.js'
import { startForste, gjeldende, svarForste, resultatForste, framdriftForste } from '../matte/forsteOppdrag.js'
import { oppgaveTilPlassering, nokkel } from '../matte/oppdrag.js'
import { egneTing, alleTing, forsteNivaa, erEgen, kjenteAvNivaa } from '../nivaaTing.js'
import { NIVAER_GEO } from '../../data/geo/nivaer.js'
import { genGeo } from '../geo/generatorer.js'
import { NIVAER_ENGELSK } from '../../data/engelsk/nivaer.js'
import { genEngelsk } from '../engelsk/generatorer.js'
import { NIVAER_KLOKKE } from '../../data/klokke/nivaer.js'
import { genKlokke } from '../klokke/generatorer.js'
import { kartPool } from '../geo/kart.js'

const GEO = { nivaer: NIVAER_GEO, gen: genGeo, kunnskap: true }
const ENG = { nivaer: NIVAER_ENGELSK, gen: genEngelsk, kunnskap: true }
const KLO = { nivaer: NIVAER_KLOKKE, gen: genKlokke, kunnskap: true }
const STIGER = { geografi: GEO, klokke: KLO, engelsk: ENG }

// ---- Barnemodeller (fra oppdraget) --------------------------------------------

// Sjansen for å gjette riktig når barnet ikke kan tingen.
function gjett(task) {
  if (task.options) return 1 / task.options.length
  if (task.form === 'kart') return 1 / kartPool(task.region).length
  if (task.form === 'still') return 1 / 12
  if (task.form === 'skriv' || task.form === 'sorter') return 0.02
  if (task.form === 'tastatur') return 0.05
  return 0.25
}

// «Kan ingenting»: 90 % på ting som er vist tidligere i oppdraget eller står i kjent, ellers gjetting.
function kanIngenting(fag) {
  const vist = new Set(fag.kjent || [])
  return (task, rng) => {
    if (task.form === 'vis') {
      vist.add(task.kjent)
      return true
    }
    const p = task.kjent && vist.has(task.kjent) ? 0.9 : gjett(task)
    return rng() < p
  }
}

// «Kan til og med nivå k»: 92 % på nivå ≤ k, 55 % på k + 1, 15 % over. En ting
// regnes som kjent når den først opptrer på nivå ≤ k.
function kanTilOgMed(stige, k) {
  return (task, rng) => {
    if (task.form === 'vis') return true
    const n = (task.kjent && forsteNivaa(stige, task.kjent)) || task.nivaa
    const p = n <= k ? 0.92 : n === k + 1 ? 0.55 : 0.15
    return rng() < p
  }
}

function spill(stige, barn, rng, fag = emptyFag()) {
  let st = startForste({ stige, fag, rng })
  let i = 0
  let fram = 0
  while (!st.ferdig && i < 60) {
    const f = framdriftForste(st)
    expect(f).toBeGreaterThanOrEqual(fram)
    fram = f
    const t = gjeldende(st)
    const ok = barn(t, rng)
    st = svarForste(st, { ok, forste: true, hjelp: false, vis: t.form === 'vis' })
    i++
  }
  expect(st.ferdig).toBe(true)
  return { st, res: resultatForste(st) }
}

const prover = (st) => st.vist.filter((t) => t.tag === 'plassering' && t.form !== 'vis')

// Bunken en prøve kommer fra: hvor mange ting nivået kan spørre om.
const bunke = (stige, task) => alleTing(stige, task.nivaa).size

function sjekkForsteOppdrag(stige, st, fag) {
  // Ingen oppgave to ganger, og høyst to spørsmål om samme ting (vis-kort teller ikke).
  const nokler = st.vist.map(nokkel)
  expect(new Set(nokler).size, `oppgave to ganger: ${st.vist.map((t) => t.prompt).join(' | ')}`).toBe(nokler.length)
  const teller = {}
  for (const t of st.vist) if (t.emne != null && t.form !== 'vis') teller[t.emne] = (teller[t.emne] || 0) + 1
  for (const [e, n] of Object.entries(teller)) expect(n, `emne ${e} ${n} ganger`).toBeLessThanOrEqual(2)
  // Aldri to spørsmål på rad om samme ting (vis + spørsmål om det samme er greit).
  for (let i = 1; i < st.vist.length; i++) {
    const a = st.vist[i - 1]
    const b = st.vist[i]
    if (b.emne != null && a.emne === b.emne) expect(a.form, `${a.prompt} → ${b.prompt}`).toBe('vis')
  }
  // Prøvene: om nivåets eget innhold, med minst tre feilsvar der bunken har minst fire ting.
  for (const p of prover(st)) {
    expect(erEgen(stige, p.nivaa, p), `prøve på nivå ${p.nivaa} er ikke nivåets egen: ${p.kjent} (${p.prompt})`).toBe(true)
    if (p.kjent && egneTing(stige, p.nivaa).size) expect(forsteNivaa(stige, p.kjent), `${p.kjent} på nivå ${p.nivaa}`).toBe(p.nivaa)
    if (p.options && bunke(stige, p) >= 4) expect(p.options.length, `${p.type} på nivå ${p.nivaa}: ${p.options.length} alternativer`).toBeGreaterThanOrEqual(4)
  }
  // Utenom prøvene: bare spørsmål om ting som er vist eller kjent.
  const kjent = new Set(fag.kjent || [])
  for (const t of st.vist) {
    if (t.form === 'vis') kjent.add(t.kjent)
    else if (t.tag === 'plassering') {
      if (t.kjent) kjent.add(t.kjent) // riktig svar gjør tingen kjent; i sjekken antar vi ikke noe om svaret
    } else if (t.kjent) expect(kjent.has(t.kjent), `spørsmål om ukjent utenom prøvene: ${t.kjent} (${t.prompt})`).toBe(true)
  }
}

describe('Z – nivåets egne ting', () => {
  it('geografi: Norden eier flaggene, hovedstedene og kartet; Europa-nivåene eier landene utenfor Norden', () => {
    const n1 = egneTing(GEO, 1)
    expect([...n1].sort()).toEqual(['flagg:dk', 'flagg:fi', 'flagg:is', 'flagg:no', 'flagg:se'])
    expect([...egneTing(GEO, 2)].every((k) => k.startsWith('hovedstad:'))).toBe(true)
    expect(egneTing(GEO, 2).size).toBe(5)
    expect([...egneTing(GEO, 3)].sort()).toEqual(['kart:dk', 'kart:fi', 'kart:is', 'kart:no', 'kart:se'])
    const n4 = egneTing(GEO, 4)
    expect(n4.size).toBe(22)
    expect(n4.has('flagg:de')).toBe(true)
    expect(n4.has('flagg:dk')).toBe(false)
    expect(egneTing(GEO, 6).has('kart:de')).toBe(true)
    expect(egneTing(GEO, 6).has('kart:no')).toBe(false)
    // Verdensnivåene: land utenfor Europa (og verdensdelene).
    expect(egneTing(GEO, 7).has('flagg:us')).toBe(true)
    expect(egneTing(GEO, 7).has('flagg:dk')).toBe(false)
    expect(egneTing(GEO, 7).has('verdensdel:no')).toBe(true)
    expect(egneTing(GEO, 8).has('hovedstad:us')).toBe(true)
    expect(egneTing(GEO, 8).has('hovedstad:de')).toBe(false)
    expect(egneTing(GEO, 9).has('kart:br')).toBe(true)
    expect(egneTing(GEO, 9).has('kart:no')).toBe(false)
    expect(forsteNivaa(GEO, 'flagg:dk')).toBe(1)
    expect(forsteNivaa(GEO, 'kart:dk')).toBe(3)
    expect(forsteNivaa(GEO, 'finnes:ikke')).toBeNull()
  })
  it('klokka: Klokka 4 eier kvart over og kvart på, ikke hele timer; still-nivåene kjennes på ny type', () => {
    expect(egneTing(KLO, 1).size).toBe(12)
    expect(egneTing(KLO, 2).size).toBe(0)
    expect([...egneTing(KLO, 3)].every((k) => k.endsWith(':30'))).toBe(true)
    const n4 = egneTing(KLO, 4)
    expect(n4.size).toBe(24)
    expect([...n4].every((k) => k.endsWith(':15') || k.endsWith(':45'))).toBe(true)
    expect(egneTing(KLO, 5).size).toBe(96)
    expect(egneTing(KLO, 7).size).toBe(288)
    const rng = seeded(3)
    // Nivå 2: «still klokka på hele timer» er egen, lese hele timer er det ikke.
    const still = { ...genKlokke('still_klokka', { minutes: 'whole' }, rng), genType: 'still_klokka', genParam: { minutes: 'whole' } }
    expect(erEgen(KLO, 2, still)).toBe(true)
    const les = { ...genKlokke('les_analog', { minutes: 'whole' }, rng), genType: 'les_analog', genParam: { minutes: 'whole' } }
    expect(erEgen(KLO, 2, les)).toBe(false)
    // Nivå 6: still til fem minutter, men ikke til hele timer.
    for (let i = 0; i < 50; i++) {
      const t = { ...genKlokke('still_klokka', { minutes: 'five' }, rng), genType: 'still_klokka', genParam: { minutes: 'five' } }
      expect(erEgen(KLO, 6, t)).toBe(t.answer.m % 15 !== 0)
    }
    // Nivå 4: kvart over/på er egen, hele og halve ikke.
    for (let i = 0; i < 50; i++) {
      const t = { ...genKlokke('les_analog', { minutes: 'quarter' }, rng), genType: 'les_analog', genParam: { minutes: 'quarter' } }
      expect(erEgen(KLO, 4, t)).toBe(t.kjent.endsWith(':15') || t.kjent.endsWith(':45'))
    }
  })
  it('engelsk: hvert nivå eier sine ord og setninger; Spell it og Make a sentence kjennes på typen', () => {
    expect(egneTing(ENG, 1).size).toBe(20)
    expect(egneTing(ENG, 2).size).toBe(16)
    expect(egneTing(ENG, 4).has('ord:cat')).toBe(false)
    expect([...egneTing(ENG, 5)].every((k) => k.startsWith('setning:'))).toBe(true)
    expect([...egneTing(ENG, 6)].every((k) => k.startsWith('fyll:'))).toBe(true)
    expect([...egneTing(ENG, 7)].every((k) => k.startsWith('spm:'))).toBe(true)
    expect(egneTing(ENG, 9).size).toBe(0)
    const rng = seeded(4)
    const stav = { ...genEngelsk('stav_en', { maks: 4 }, rng), genType: 'stav_en', genParam: { maks: 4 } }
    expect(erEgen(ENG, 9, stav)).toBe(true)
    const fyll = { ...genEngelsk('fyll_inn', {}, rng), genType: 'fyll_inn', genParam: {} }
    expect(erEgen(ENG, 9, fyll)).toBe(false)
    expect(kjenteAvNivaa(GEO, 1, ['flagg:no', 'flagg:se', 'kart:no'])).toEqual({ kjent: 2, av: 5 })
  })
  it('prøvene fra oppgaveTilPlassering er nivåets egne, med vanlige feilsvar', () => {
    const rng = seeded(5)
    for (const stige of [GEO, KLO, ENG]) {
      for (const def of stige.nivaer) {
        for (let i = 0; i < 20; i++) {
          const t = oppgaveTilPlassering(def.id, rng, stige, { egen: true })
          expect(erEgen(stige, def.id, t), `${def.id}: ${t.type} ${t.kjent}`).toBe(true)
          if (t.options && alleTing(stige, t).size >= 4) expect(t.options.length).toBeGreaterThanOrEqual(4)
        }
      }
    }
  })
})

describe('Akseptansetester Z (simulering, 300 barn per nivå)', () => {
  const N = 300
  for (const [navn, stige] of Object.entries(STIGER)) {
    it(`1. ${navn}: «kan ingenting» plasseres på nivå 1 eller 2 i minst 90 %, og får innføring eller vis + spørsmål utenom prøvene`, () => {
      const rng = seeded(11)
      let lavt = 0
      for (let i = 0; i < N; i++) {
        const fag = emptyFag()
        const { st, res } = spill(stige, kanIngenting(fag), rng, fag)
        if (res.nivaa <= 2) lavt++
        sjekkForsteOppdrag(stige, st, fag)
      }
      expect(lavt / N).toBeGreaterThanOrEqual(0.9)
    })
    it(`2. ${navn}: «kan til og med nivå k» innenfor ±1 i minst ${navn === 'klokke' ? 70 : 60} %, for høyt (≥2) i høyst 20 %; ingen prøve om eldre ting`, () => {
      const rng = seeded(12)
      const MAKS = stige.nivaer.length
      let n = 0
      let innen = 0
      let forHoy = 0
      const perK = []
      for (let k = 1; k <= MAKS; k++) {
        let ik = 0
        for (let i = 0; i < N; i++) {
          const fag = emptyFag()
          const { st, res } = spill(stige, kanTilOgMed(stige, k), rng, fag)
          n++
          const d = res.nivaa - k
          if (Math.abs(d) <= 1) {
            innen++
            ik++
          }
          if (d >= 2) forHoy++
          sjekkForsteOppdrag(stige, st, fag)
        }
        perK.push(Math.round((100 * ik) / N))
      }
      // eslint-disable-next-line no-console
      console.log(`${navn}: innenfor ±1 ${Math.round((100 * innen) / n)} %, for høyt ${Math.round((100 * forHoy) / n)} %, per k: ${perK.join(' ')}`)
      expect(innen / n).toBeGreaterThanOrEqual(navn === 'klokke' ? 0.7 : 0.6)
      expect(forHoy / n).toBeLessThanOrEqual(0.2)
    })
  }
  it('3. ingen oppgave tre ganger i samme første oppdrag; alle prøver har minst tre feilsvar der bunken har minst fire ting (sjekkes i 1 og 2 for hvert oppdrag)', () => {
    // Direkte: et barn som kjenner én ting fra før, får ikke bare spørsmål om den.
    const rng = seeded(13)
    for (const stige of [GEO, KLO, ENG]) {
      for (let i = 0; i < 50; i++) {
        const fag = { ...emptyFag(), kjent: [[...egneTing(stige, 1)][0]] }
        const { st } = spill(stige, kanIngenting(fag), rng, fag)
        sjekkForsteOppdrag(stige, st, fag)
      }
    }
  })
})

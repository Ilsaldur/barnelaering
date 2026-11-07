// Etappe AA (runde 6): nivå opp krever at nivået er lært; klokka ut av kunnskapslaget (valg A).
import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { emptyFag } from '../profil.js'
import { startForste, gjeldende, svarForste, resultatForste } from '../matte/forsteOppdrag.js'
import { buildMission, buildBoss, huskOppgaver, visKort } from '../matte/oppdrag.js'
import { applyResult, settNivaa, nesteNivaaTekst, resultatNivaaTekst } from '../matte/stige.js'
import { etterOppdrag, tellOppdrag, kravForFag } from '../matte/etterOppdrag.js'
import { oppdaterKjent } from '../kunnskap.js'
import { egneTing, kravFor, forsteNivaa } from '../nivaaTing.js'
import { NIVAER_GEO } from '../../data/geo/nivaer.js'
import { genGeo } from '../geo/generatorer.js'
import { NIVAER_KLOKKE } from '../../data/klokke/nivaer.js'
import { genKlokke } from '../klokke/generatorer.js'
import { kartPool } from '../geo/kart.js'

const GEO = { nivaer: NIVAER_GEO, gen: genGeo, kunnskap: true }
const KLO = { nivaer: NIVAER_KLOKKE, gen: genKlokke, kunnskap: false, visFoerst: true, egneProver: true }

// Svar på én oppgave slik oppgavekortet rapporterer det.
const entry = (t, ok) => {
  const vis = t.form === 'vis'
  return { type: t.type, nivaa: t.nivaa, tag: t.tag, kjent: t.kjent, vis, ok: vis || ok, forste: true, hjelp: false, counts: vis || ok }
}

function gjett(task) {
  if (task.options) return 1 / task.options.length
  if (task.form === 'kart') return 1 / kartPool(task.region).length
  if (task.form === 'still') return 1 / 12
  return 0.02
}

// «Kan ingenting», men husker det som vises: 90 % på ting som er vist (i noe oppdrag), ellers gjetting.
function husker() {
  const vist = new Set()
  return (t, rng) => {
    if (t.form === 'vis') {
      vist.add(t.kjent)
      return true
    }
    return rng() < (t.kjent && vist.has(t.kjent) ? 0.9 : gjett(t))
  }
}
const kanAlt = () => (t, rng) => t.form === 'vis' || rng() < 0.97

// Plassering + oppdrag til toppen (eller `maksOppdrag`). Gir loggen per oppdrag.
function spillStige(stige, barn, rng, { maksOppdrag = 80, fagStart = emptyFag() } = {}) {
  const MAKS = stige.nivaer.length
  let st = startForste({ stige, fag: fagStart, rng })
  let i = 0
  while (!st.ferdig && i++ < 60) {
    const t = gjeldende(st)
    st = svarForste(st, { ok: barn(t, rng), forste: true, hjelp: false, vis: t.form === 'vis' })
  }
  const res0 = resultatForste(st)
  let fag = huskOppgaver(settNivaa(fagStart, res0.nivaa), res0.tasks)
  if (stige.kunnskap) fag.kjent = oppdaterKjent(fag.kjent, res0.perTask)
  const plassert = fag.nivaa
  const logg = []
  let n = 0
  while (fag.nivaa < MAKS && n < maksOppdrag) {
    const mission = buildMission(fag, { rng, stige })
    const perTask = mission.tasks.map((t) => entry(t, barn(t, rng)))
    const res = { correct: perTask.filter((r) => r.counts).length, total: perTask.length, perTask }
    const foer = fag.nivaa
    ;({ fag } = etterOppdrag(fag, { mission, res, stige, maks: MAKS }))
    logg.push({ nivaaFoer: foer, nivaaEtter: fag.nivaa, kjent: [...fag.kjent], tasks: mission.tasks })
    n++
  }
  return { plassert, fag, logg, oppdrag: n }
}

describe('AA – reglene', () => {
  it('grensen regnes av spørsmålene: vis-kort og prøv-plassen teller ikke, prøv-feil trekker ikke stjerner', () => {
    const perTask = [
      { vis: true, kjent: 'a', counts: true },
      { vis: true, kjent: 'b', counts: true },
      { kjent: 'a', counts: true },
      { kjent: 'b', counts: false, ok: false },
      { kjent: 'c', counts: true },
      { kjent: 'd', counts: true },
      { kjent: 'e', counts: true },
      { tag: 'prov', kjent: 'z', counts: false, ok: false },
    ]
    const t = tellOppdrag(perTask)
    expect(t.total).toBe(5)
    expect(t.correct).toBe(4) // alle unntatt ett → godt
    expect(t.stars).toBe(2) // 6 av 7 (prøv-feilen er tatt ut)
    expect(t.nyeAlleRiktige).toBe(false)
    const { fag, events } = applyResult({ ...emptyFag(), nivaa: 2, paaRad: 1 }, { correct: t.correct, total: t.total, nivaa: 2, perTask, stars: t.stars, krav: { ok: true, kjent: 5, av: 5, trengs: 5 } }, 9)
    expect(events.levelUp).toBe(true)
    expect(fag.nivaa).toBe(3)
    // 8 og 5 spørsmål gir samme grenser som før: 7 og 5, 4 og 3.
    expect(applyResult({ ...emptyFag(), nivaa: 2 }, { correct: 7, total: 8, nivaa: 2 }, 9).fag.paaRad).toBe(1)
    expect(applyResult({ ...emptyFag(), nivaa: 2 }, { correct: 6, total: 8, nivaa: 2 }, 9).fag.paaRad).toBe(0)
    expect(applyResult({ ...emptyFag(), nivaa: 2 }, { correct: 4, total: 8, nivaa: 2 }, 9).fag.hjelpNeste).toBe(true)
    expect(applyResult({ ...emptyFag(), nivaa: 2 }, { correct: 5, total: 8, nivaa: 2 }, 9).fag.hjelpNeste).toBe(false)
    expect(applyResult({ ...emptyFag(), nivaa: 2 }, { correct: 4, total: 5, nivaa: 2 }, 9).fag.paaRad).toBe(1)
    expect(applyResult({ ...emptyFag(), nivaa: 2 }, { correct: 3, total: 5, nivaa: 2 }, 9).fag.paaRad).toBe(0)
    expect(applyResult({ ...emptyFag(), nivaa: 2 }, { correct: 2, total: 5, nivaa: 2 }, 9).fag.hjelpNeste).toBe(true)
  })
  it('to gode på rad uten nok kjente ting: rekka holdes, ingen sjefsoppgave; med nok kjente: nivå opp og sjefsoppgave', () => {
    const krav = { ok: false, kjent: 5, av: 22, trengs: 17 }
    const a = applyResult({ ...emptyFag(), nivaa: 4, paaRad: 1 }, { correct: 8, total: 8, nivaa: 4, krav }, 9)
    expect(a.events.levelUp).toBe(false)
    expect(a.events.kravMangler).toBe(true)
    expect(a.fag.paaRad).toBe(2)
    expect(a.fag.nivaa).toBe(4)
    expect(a.events.boss).toBeNull()
    const b = applyResult(a.fag, { correct: 8, total: 8, nivaa: 4, krav: { ...krav, kjent: 17, ok: true } }, 9)
    expect(b.events.levelUp).toBe(true)
    expect(b.fag.nivaa).toBe(5)
    expect(b.events.boss).toBe(8)
  })
  it('kravet: alle når nivået har tolv eller færre, ellers tre firedeler; nivåer uten egne ting har ikke krav', () => {
    expect(kravFor(GEO, 1, ['flagg:no', 'flagg:se', 'flagg:dk', 'flagg:fi'])).toEqual({ kjent: 4, av: 5, trengs: 5, ok: false })
    expect(kravFor(GEO, 4, [...egneTing(GEO, 4)].slice(0, 17))).toEqual({ kjent: 17, av: 22, trengs: 17, ok: true })
    expect(kravForFag(KLO, { ...emptyFag(), nivaa: 4 })).toBeNull()
    expect(kravForFag(GEO, { ...emptyFag(), nivaa: 4, kjent: ['flagg:de', 'kart:de'] })).toMatchObject({ kjent: 1, av: 22 })
  })
  it('tekstene sier hvor mange barnet kjenner og hva som trengs', () => {
    const fag = { ...emptyFag(), nivaa: 4, paaRad: 2 }
    const krav = { ok: false, kjent: 7, av: 22, trengs: 17 }
    expect(nesteNivaaTekst(fag, 9, { krav, navn: 'land' })).toBe('Du kjenner 7 av 22 land. Nivå 5 åpner når du kjenner 17.')
    expect(nesteNivaaTekst({ ...fag, paaRad: 0 }, 9, { krav, navn: 'land' })).toBe('Du kjenner 7 av 22 land. Nivå 5 åpner når du kjenner 17 og har to gode oppdrag på rad.')
    expect(nesteNivaaTekst({ ...fag, paaRad: 1 }, 9, { krav: { ...krav, kjent: 20, ok: true }, navn: 'land' })).toContain('Du kjenner 20 av 22 land. Ett godt oppdrag til')
    expect(resultatNivaaTekst(fag, 9, { krav, navn: 'land' })).toBe('Du kjenner 7 av 22 land. To gode oppdrag på rad! Nivå 5 åpner når du kjenner 17.')
    expect(nesteNivaaTekst({ ...emptyFag(), nivaa: 4 }, 9)).toBe('To gode oppdrag på rad (7 eller 8 riktige) åpner nivå 5. Alle riktige gir sjefsoppgave.')
  })
  it('prøv-plassen: én oppgave om en ukjent ting fra nivået, vanlige feilsvar, uten vis', () => {
    const rng = seeded(31)
    const kjent = [...egneTing(GEO, 4)].slice(0, 10)
    let medProv = 0
    for (let i = 0; i < 200; i++) {
      const m = buildMission({ ...emptyFag(), nivaa: 4, plassert: true, kjent }, { rng, stige: GEO })
      const prov = m.tasks.filter((t) => t.tag === 'prov')
      expect(prov.length).toBeLessThanOrEqual(1)
      if (!prov.length) continue
      medProv++
      const p = prov[0]
      expect(kjent).not.toContain(p.kjent)
      expect(m.tasks.some((t) => t.form === 'vis' && t.kjent === p.kjent && m.tasks.indexOf(t) < m.tasks.indexOf(p))).toBe(false)
      expect(p.options.length).toBe(4)
      // Vanlige feilsvar: minst ett alternativ som ikke er kjent.
      expect(p.options.some((o) => !kjent.includes(p.optionsKjent[o]))).toBe(true)
      // Høyst tre nye (vis) i oppdraget.
      expect(m.tasks.filter((t) => t.form === 'vis').length).toBeLessThanOrEqual(3)
    }
    expect(medProv / 200).toBeGreaterThan(0.9)
  })
  it('fire nye når nivået har over 20 ting og alle spørsmål om nye ting var riktige i forrige oppdrag', () => {
    const rng = seeded(32)
    const fag = { ...emptyFag(), nivaa: 4, plassert: true, kjent: [] }
    const m = buildMission(fag, { rng, stige: GEO })
    const perTask = m.tasks.map((t) => entry(t, true))
    const { fag: nf } = etterOppdrag(fag, { mission: m, res: { correct: perTask.length, total: perTask.length, perTask }, stige: GEO, maks: 9 })
    expect(nf.nyeMaks).toBe(4)
    const m2 = buildMission(nf, { rng, stige: GEO })
    expect(m2.tasks.filter((t) => t.form === 'vis').length).toBe(4)
    // Én feil på et nytt spørsmål: tilbake til tre.
    const perTask2 = m2.tasks.map((t, i) => entry(t, !(t.form !== 'vis' && t.kjent && m2.tasks.some((v) => v.form === 'vis' && v.kjent === t.kjent) && i === m2.tasks.findIndex((x) => x.form !== 'vis' && x.kjent && m2.tasks.some((v) => v.form === 'vis' && v.kjent === x.kjent)))))
    const { fag: nf2 } = etterOppdrag(nf, { mission: m2, res: { correct: 0, total: 0, perTask: perTask2 }, stige: GEO, maks: 9 })
    expect(nf2.nyeMaks).toBe(3)
    // Nivå 1 har fem ting: aldri fire nye.
    const { fag: nf3 } = etterOppdrag({ ...emptyFag(), nivaa: 1, plassert: true, kjent: [] }, { mission: m, res: { correct: perTask.length, total: perTask.length, perTask }, stige: GEO, maks: 9 })
    expect(nf3.nyeMaks).toBe(3)
  })
  it('sjefsoppgaven i kunnskapsstigene bruker vanlige feilsvar', () => {
    const rng = seeded(33)
    const kjent = ['flagg:de', 'flagg:fr']
    for (let i = 0; i < 30; i++) {
      const b = buildBoss(4, 7, { rng, stige: GEO, fag: { ...emptyFag(), nivaa: 4, kjent } })
      for (const t of b.tasks) if (t.options) expect(t.options.length).toBeGreaterThanOrEqual(4)
    }
  })
  it('klokka (valg A): første oppdrag på et nytt nivå starter med to vis-kort om nivåets nye ting, så vanlige spørsmål med vanlige feilsvar', () => {
    const rng = seeded(34)
    for (let n = 1; n <= 8; n++) {
      const m = buildMission({ ...emptyFag(), nivaa: n, plassert: true }, { rng, stige: KLO })
      const vis = m.tasks.filter((t) => t.form === 'vis')
      expect(vis.length, `nivå ${n}`).toBe(2)
      expect(m.tasks[0].form).toBe('vis')
      expect(m.tasks[1].form).toBe('vis')
      expect(vis[0].kjent).not.toBe(vis[1].kjent)
      if (n === 4) for (const v of vis) expect(v.kjent).toMatch(/:(15|45)$/)
      if (n === 1) for (const v of vis) expect(v.kjent).toMatch(/:00$/)
      expect(m.tasks.length).toBe(10)
      for (const t of m.tasks) if (t.options) expect(t.options.length).toBe(4)
      // Har barnet spilt nivået før, kommer ingen vis-kort.
      const m2 = buildMission({ ...emptyFag(), nivaa: n, plassert: true, beste: { [n]: 1 } }, { rng, stige: KLO })
      expect(m2.tasks.filter((t) => t.form === 'vis').length).toBe(0)
    }
    // Grensen regnes av de åtte spørsmålene: 7 av 8 + to vis gir godt oppdrag og 2 stjerner.
    const m = buildMission({ ...emptyFag(), nivaa: 3, plassert: true }, { rng, stige: KLO })
    const perTask = m.tasks.map((t, i) => entry(t, i !== 4))
    const { fag, events } = etterOppdrag({ ...emptyFag(), nivaa: 3, plassert: true }, { mission: m, res: { correct: 9, total: 10, perTask }, stige: KLO, maks: 8 })
    expect(fag.paaRad).toBe(1)
    expect(events.stars).toBe(2)
    expect(fag.kjent).toEqual([])
  })
  it('klokka: plasseringen prøver nivåets eget innhold uten kjent, og starter med vis + spørsmål', () => {
    const rng = seeded(35)
    for (let i = 0; i < 50; i++) {
      let st = startForste({ stige: KLO, fag: emptyFag(), rng })
      expect(gjeldende(st).form).toBe('vis')
      let n = 0
      while (!st.ferdig && n++ < 40) {
        const t = gjeldende(st)
        st = svarForste(st, { ok: t.form === 'vis' || t.nivaa <= 4, forste: true, hjelp: false, vis: t.form === 'vis' })
      }
      expect(resultatForste(st).nivaa).toBeGreaterThanOrEqual(3)
      expect(resultatForste(st).nivaa).toBeLessThanOrEqual(5)
      for (const p of st.vist.filter((t) => t.tag === 'plassering' && t.form !== 'vis')) {
        if (p.options) expect(p.options.length).toBe(4)
        if (p.nivaa === 4) expect(p.kjent).toMatch(/:(15|45)$/)
      }
    }
  })
})

describe('Akseptansetester AA', () => {
  it('1a. «kan ingenting» som husker det som vises: kjenner minst tre firedeler av Norden-tingene når det går opp til Geografi 4, og bruker minst 30 oppdrag til toppen', () => {
    const rng = seeded(41)
    const norden = new Set([...egneTing(GEO, 1), ...egneTing(GEO, 2), ...egneTing(GEO, 3)])
    const antall = []
    let n = 0
    for (let i = 0; i < 40 && n < 20; i++) {
      const { plassert, logg, oppdrag, fag } = spillStige(GEO, husker(), rng, { maksOppdrag: 120 })
      // Et barn som gjetter seg til nivå 2 eller 3 i plasseringen, slipper kravet for nivåene under; her ser vi på dem som ble plassert på 1.
      if (plassert !== 1) continue
      n++
      const opp4 = logg.find((l) => l.nivaaFoer <= 3 && l.nivaaEtter === 4)
      expect(opp4, 'kom aldri til nivå 4').toBeTruthy()
      const kjente = opp4.kjent.filter((k) => norden.has(k)).length
      expect(kjente / norden.size).toBeGreaterThanOrEqual(0.75)
      expect(fag.nivaa).toBe(9)
      expect(oppdrag).toBeGreaterThanOrEqual(30)
      antall.push(oppdrag)
    }
    // eslint-disable-next-line no-console
    console.log(`geografi, kan ingenting men husker: oppdrag til toppen ${Math.min(...antall)}–${Math.max(...antall)}, snitt ${(antall.reduce((a, b) => a + b, 0) / antall.length).toFixed(1)}`)
  })
  it('1b. et barn som kan alt (97 %) plasseres på nivå 7 eller høyere og når toppen innen 8 oppdrag', () => {
    const rng = seeded(42)
    let hoyt = 0
    let raskt = 0
    let hoyt8 = 0
    let raskt8 = 0
    const N = 200
    const plasseringer = {}
    const oppdragTall = {}
    for (let i = 0; i < N; i++) {
      const { plassert, oppdrag, fag } = spillStige(GEO, kanAlt(), rng, { maksOppdrag: 40 })
      plasseringer[plassert] = (plasseringer[plassert] || 0) + 1
      if (plassert >= 7) hoyt++
      if (fag.nivaa === 9 && oppdrag <= 8) raskt++
      if (plassert >= 8) {
        hoyt8++
        if (fag.nivaa === 9 && oppdrag <= 8) raskt8++
      }
      if (plassert >= 7) oppdragTall[`${plassert}:${oppdrag}`] = (oppdragTall[`${plassert}:${oppdrag}`] || 0) + 1
    }
    // eslint-disable-next-line no-console
    console.log(`geografi, kan alt: plassert ${JSON.stringify(plasseringer)}, plassert:oppdrag til toppen ${JSON.stringify(oppdragTall)}, ≥7 ${Math.round((100 * hoyt) / N)} %, topp innen 8 ${Math.round((100 * raskt) / N)} %`)
    // Ett glipp (3 %) på den første eller andre prøven sender barnet til nivå 1–3; ellers 7–9.
    expect(hoyt / N).toBeGreaterThanOrEqual(0.85)
    // Plassert på 8 eller 9: toppen innen 8 oppdrag. Plassert på 7 (56 egne ting) tar lenger (se etappeAA.md).
    expect(raskt8 / hoyt8).toBeGreaterThanOrEqual(0.95)
    expect(raskt / N).toBeGreaterThanOrEqual(0.8)
  })
  it('2. et barn som kjenner flagget til Sverige, får vis-kort før første kartspørsmål om Sverige', () => {
    const rng = seeded(43)
    let spurt = 0
    for (let i = 0; i < 300; i++) {
      const m = buildMission({ ...emptyFag(), nivaa: 3, plassert: true, kjent: ['flagg:se'] }, { rng, stige: GEO })
      // Prøv-plassen er unntaket: den spør om én ukjent ting uten vis.
      const i0 = m.tasks.findIndex((t) => t.form !== 'vis' && t.tag !== 'prov' && t.kjent === 'kart:se')
      if (i0 < 0) continue
      spurt++
      expect(m.tasks.slice(0, i0).some((t) => t.form === 'vis' && t.kjent === 'kart:se'), m.tasks.map((t) => `${t.form}:${t.kjent}`).join(' ')).toBe(true)
    }
    expect(spurt).toBeGreaterThan(50)
  })
})

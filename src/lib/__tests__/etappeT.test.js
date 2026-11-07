// Etappe T (runde 5): innføring i kunnskapsstigene (geografi, engelsk, klokka).
import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { emptyFag, emptyData, mergeData, normalize } from '../profil.js'
import { buildMission } from '../matte/oppdrag.js'
import { startForste, gjeldende, svarForste, resultatForste } from '../matte/forsteOppdrag.js'
import { oppdaterKjent, tilVis, velgKjent, kjenteFeil } from '../kunnskap.js'
import { NIVAER_GEO } from '../../data/geo/nivaer.js'
import { genGeo } from '../geo/generatorer.js'
import { NIVAER_ENGELSK } from '../../data/engelsk/nivaer.js'
import { genEngelsk } from '../engelsk/generatorer.js'
import { NIVAER_KLOKKE } from '../../data/klokke/nivaer.js'
import { genKlokke } from '../klokke/generatorer.js'

const GEO = { nivaer: NIVAER_GEO, gen: genGeo, kunnskap: true }
const ENG = { nivaer: NIVAER_ENGELSK, gen: genEngelsk, kunnskap: true }
const KLO = { nivaer: NIVAER_KLOKKE, gen: genKlokke, kunnskap: true }

// Spill første oppdrag med et svarmønster: svar(task, i) → riktig?
function spillForste(stige, svar, rng, fag = emptyFag()) {
  let st = startForste({ stige, fag, rng })
  let i = 0
  while (!st.ferdig && i < 40) {
    const t = gjeldende(st)
    const ok = t.form === 'vis' ? true : svar(t, i)
    st = svarForste(st, { ok, forste: true, hjelp: false, vis: t.form === 'vis' })
    i++
  }
  return { st, res: resultatForste(st) }
}

// Sjekk et oppdrag: spørsmål bare om kjente ting, alternativer bare kjente, høyst `maksVis` vis.
function sjekkOppdrag(tasks, kjentStart, maksVis = 3) {
  const kjent = new Set(kjentStart)
  let vis = 0
  for (const t of tasks) {
    if (t.form === 'vis') {
      vis++
      kjent.add(t.kjent)
      continue
    }
    if (t.tag === 'prov') continue // prøv-plassen (runde 6, etappe AA) spør om en ukjent ting med vanlige feilsvar
    if (t.kjent) expect(kjent.has(t.kjent), `spørsmål om ukjent: ${t.kjent} (${t.type}: ${t.prompt})`).toBe(true)
    if (t.optionsKjent && t.options && kjent.size >= 2) {
      for (const o0 of t.options) {
        const o = o0 && typeof o0 === 'object' ? o0.value : o0
        const k = t.optionsKjent[o]
        expect(k, `alternativ uten nøkkel: ${o} i ${t.type}`).toBeTruthy()
        expect(kjent.has(k), `ukjent alternativ ${k} (${t.type}: ${t.prompt})`).toBe(true)
      }
      expect(t.options.length).toBeGreaterThanOrEqual(2)
    }
  }
  expect(vis).toBeLessThanOrEqual(maksVis)
  // Hver vis følges av et spørsmål om det samme innen to oppgaver.
  tasks.forEach((t, i) => {
    if (t.form !== 'vis') return
    const etter = tasks.slice(i + 1, i + 3)
    expect(etter.some((x) => x.form !== 'vis' && x.kjent === t.kjent), `vis ${t.kjent} uten spørsmål innen to`).toBe(true)
  })
  return { vis, kjent }
}

describe('T – kunnskapslaget', () => {
  it('generatorene setter kjent, visning og optionsKjent', () => {
    const rng = seeded(1)
    const g = genGeo('flagg_land', { region: 'norden' }, rng)
    expect(g.kjent).toMatch(/^flagg:[a-z]{2}$/)
    expect(g.visning.tekst).toContain('Dette er flagget til')
    expect(Object.keys(g.optionsKjent)).toEqual(expect.arrayContaining(g.options))
    const h = genGeo('hovedstad', { region: 'norden' }, rng)
    expect(h.kjent).toMatch(/^hovedstad:/)
    const e = genEngelsk('hor_finn_bilde', { grupper: ['dyr'] }, rng)
    expect(e.kjent).toMatch(/^ord:/)
    expect(e.visning.lang).toBe('en-GB')
    const k = genKlokke('les_analog', { minutes: 'whole' }, rng)
    expect(k.kjent).toMatch(/^tid:\d+:\d\d$/)
    expect(k.visning.tekst).toMatch(/^Klokka er/)
    const v = tilVis(g)
    expect(v.form).toBe('vis')
    expect(v.kjent).toBe(g.kjent)
    expect(v.visual.kind).toBe('flagg')
  })
  it('kjent styrer hva som velges og hvilke feilsvar som brukes', () => {
    const rng = seeded(2)
    const pool = [{ k: 'a' }, { k: 'b' }, { k: 'c' }, { k: 'd' }, { k: 'e' }]
    const key = (x) => x.k
    const kjent = new Set(['a', 'b'])
    for (let i = 0; i < 30; i++) {
      expect(kjent.has(velgKjent(pool, key, { kjent }, rng).k)).toBe(true)
      expect(kjent.has(velgKjent(pool, key, { kjent, foretrekkUkjent: true }, rng).k)).toBe(false)
    }
    expect(velgKjent(pool, key, { kun: 'd' }, rng).k).toBe('d')
    expect(kjenteFeil(pool, pool[0], key, { kjent }, 3, rng).map(key)).toEqual(['b'])
    expect(kjenteFeil(pool, pool[0], key, { kjent: new Set(['a']) }, 3, rng)).toHaveLength(1) // ingen kjente: ett vanlig feilsvar
    expect(kjenteFeil(pool, pool[0], key, {}, 3, rng)).toHaveLength(3)
  })
  it('oppdaterKjent: vist og riktig blir kjent, bom på noe kjent fra før blir ukjent, vist i dag forblir kjent', () => {
    const k = oppdaterKjent(['flagg:se'], [
      { kjent: 'flagg:no', vis: true, counts: true },
      { kjent: 'flagg:no', ok: false, forste: true, counts: false },
      { kjent: 'flagg:se', ok: false, forste: true, counts: false },
      { kjent: 'flagg:dk', ok: true, forste: true, counts: true },
    ])
    expect(k.sort()).toEqual(['flagg:dk', 'flagg:no'])
  })
  it('kjent-lista normaliseres og flettes som union', () => {
    expect(normalize({ fag: { geografi: { kjent: ['a', 'a', 3, 'land:se'] } } }).fag.geografi.kjent).toEqual(['a', 'flagg:se'])
    const a = emptyData()
    a.fag.geografi = { ...emptyFag(), kjent: ['land:se'], updatedAt: 2 }
    const b = emptyData()
    b.fag.geografi = { ...emptyFag(), kjent: ['land:no'], updatedAt: 1 }
    expect(mergeData(a, b).fag.geografi.kjent.sort()).toEqual(['flagg:no', 'flagg:se'])
  })
})

describe('Akseptansetester T', () => {
  it('1. geografi, ny profil, alle svar gale: bare spørsmål om viste flagg, første svar riktig, innføring med tre stjerner, nivå 1 og minst tre kjente land', () => {
    for (let k = 0; k < 20; k++) {
      const { st, res } = spillForste(GEO, () => false, seeded(100 + k))
      expect(res.perTask[0].counts).toBe(true)
      expect(res.innfoering).toBe(true)
      expect(res.nivaa).toBe(1)
      sjekkOppdrag(st.vist, [], 4)
      const kjent = oppdaterKjent([], res.perTask)
      expect(kjent.filter((x) => x.startsWith('flagg:')).length).toBeGreaterThanOrEqual(3)
    }
  })
  it('2. geografi, ny profil, alle riktige: nivå 9, og de to første oppgavene var vis og spørsmål om samme land', () => {
    for (let k = 0; k < 10; k++) {
      const { st, res } = spillForste(GEO, () => true, seeded(200 + k))
      expect(res.nivaa).toBe(9)
      expect(st.vist[0].form).toBe('vis')
      expect(st.vist[1].form).not.toBe('vis')
      expect(st.vist[1].kjent).toBe(st.vist[0].kjent)
      expect(res.innfoering).toBe(false)
    }
  })
  it('3. 500 oppdrag på geografi nivå 2 med kjent tom: høyst tre vis, spørsmål bare om kjente land, alle alternativer kjente', () => {
    const rng = seeded(300)
    for (let i = 0; i < 500; i++) {
      const m = buildMission({ ...emptyFag(), nivaa: 2, plassert: true, kjent: [] }, { rng, stige: GEO })
      sjekkOppdrag(m.tasks, [], 3)
      expect(m.tasks.length).toBeGreaterThanOrEqual(6)
    }
  })
  it('5a. klokka: som 1 og 3', () => {
    for (let k = 0; k < 10; k++) {
      const { st, res } = spillForste(KLO, () => false, seeded(500 + k))
      expect(res.perTask[0].counts).toBe(true)
      expect(res.innfoering).toBe(true)
      sjekkOppdrag(st.vist, [], 4)
      expect(oppdaterKjent([], res.perTask).filter((x) => x.startsWith('tid:')).length).toBeGreaterThanOrEqual(3)
    }
    const rng = seeded(501)
    for (let i = 0; i < 500; i++) sjekkOppdrag(buildMission({ ...emptyFag(), nivaa: 2, plassert: true, kjent: [] }, { rng, stige: KLO }).tasks, [], 3)
  })
  it('5b. engelsk: som 1 og 3', () => {
    for (let k = 0; k < 10; k++) {
      const { st, res } = spillForste(ENG, () => false, seeded(600 + k))
      expect(res.perTask[0].counts).toBe(true)
      expect(res.innfoering).toBe(true)
      sjekkOppdrag(st.vist, [], 4)
      expect(oppdaterKjent([], res.perTask).filter((x) => x.startsWith('ord:')).length).toBeGreaterThanOrEqual(3)
    }
    const rng = seeded(601)
    for (let i = 0; i < 500; i++) sjekkOppdrag(buildMission({ ...emptyFag(), nivaa: 2, plassert: true, kjent: [] }, { rng, stige: ENG }).tasks, [], 3)
  })
  it('når alt på nivået er kjent, er oppdraget som i dag (ingen vis)', () => {
    const rng = seeded(7)
    const alle = []
    for (let i = 0; i < 400; i++) {
      const t = genGeo('flagg_land', { region: 'norden' }, rng)
      alle.push(t.kjent, t.kjent.replace('flagg:', 'hovedstad:'))
    }
    const m = buildMission({ ...emptyFag(), nivaa: 1, plassert: true, kjent: [...new Set(alle)] }, { rng, stige: GEO })
    expect(m.tasks.filter((t) => t.form === 'vis')).toHaveLength(0)
    expect(m.tasks.length).toBe(5)
  })
  it('et barn som kan alt merker lite: ingen vis utover de to første i første oppdrag', () => {
    const { st } = spillForste(GEO, () => true, seeded(9))
    expect(st.vist.filter((t) => t.form === 'vis')).toHaveLength(1)
  })
})

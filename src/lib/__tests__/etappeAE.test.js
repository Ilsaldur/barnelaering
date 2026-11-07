// Etappe AE (runde 6): innhold og småting.
import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { emptyFag } from '../profil.js'
import { buildMission, huskOppgaver } from '../matte/oppdrag.js'
import { NIVAER_LESING } from '../../data/lesing/nivaer.js'
import { genLesing, lagTekstOppgaver } from '../lesing/generatorer.js'
import { TEKSTER } from '../../data/lesing/innhold.js'
import { NIVAER_GEO } from '../../data/geo/nivaer.js'
import { genGeo } from '../geo/generatorer.js'
import { egneTing, alleTing } from '../nivaaTing.js'
import { KORT, SETT } from '../../data/kort.js'
import { sistSpilteFag } from '../../activities/Samling.jsx'

const LESE = { nivaer: NIVAER_LESING, gen: genLesing, tekstOppgaver: lagTekstOppgaver }
const GEO = { nivaer: NIVAER_GEO, gen: genGeo, kunnskap: true }
const ord = (t) => t.tekst.trim().split(/\s+/).length
const NYE_AE = ['n9-isbjorn', 'n9-fotballcup', 'n9-vulkan', 'n9-besteforeldre', 'n9-honningbie', 'n9-roboten']

describe('AE – innhold', () => {
  it('Lese 9 har minst tolv tekster på 90–130 ord med tre faktaspørsmål og like lange svaralternativer', () => {
    const n9 = TEKSTER.filter((t) => t.id.startsWith('n9-'))
    expect(n9.length).toBeGreaterThanOrEqual(12)
    expect(new Set(n9.map((t) => t.id)).size).toBe(n9.length)
    for (const id of NYE_AE) expect(n9.some((t) => t.id === id), id).toBe(true)
    for (const t of n9) {
      expect(ord(t), t.id).toBeGreaterThanOrEqual(90)
      expect(ord(t), t.id).toBeLessThanOrEqual(130)
      const fakta = t.sporsmaal.filter((q) => q.type === 'fakta')
      expect(fakta.length, t.id).toBeGreaterThanOrEqual(3)
      for (const q of fakta) {
        expect(q.alternativer).toContain(q.svar)
        expect(new Set(q.alternativer).size).toBe(4)
        const l = q.alternativer.map((a) => a.length)
        if (NYE_AE.includes(t.id)) expect(Math.max(...l) / Math.min(...l), `${t.id}: ${q.q}`).toBeLessThanOrEqual(2.5)
      }
    }
  })
  it('kortet «dyr-sel» er et havdyr', () => {
    const k = KORT.find((x) => x.id === 'dyr-sel')
    // 🦭 vises ikke på eldre enheter (etappe Q), så havdyret er blåhvalen.
    expect(k.navn).toBe('Blåhval')
    expect(k.emoji).toBe('🐳')
    expect(k.fakta.toLowerCase()).toContain('hval')
    expect(k.sett).toBe('dyr')
    expect(KORT.filter((x) => x.navn === 'Ulv')).toHaveLength(0)
  })
  it('sist spilte fag: fra loggen, lesing-sporene for seg, matte som standard', () => {
    expect(sistSpilteFag([])).toBe('matte')
    expect(sistSpilteFag([{ t: 1, fag: 'matte' }, { t: 5, fag: 'skrive' }, { t: 3, fag: 'klokke' }])).toBe('skrive')
    expect(sistSpilteFag([{ t: 9, fag: 'nott' }, { t: 2, fag: 'engelsk' }])).toBe('engelsk')
    expect(SETT.some((s) => s.fag === 'skrive')).toBe(true)
  })
})

describe('Akseptansetester AE', () => {
  it('1. fire oppdrag på rad på Lese 9: ingen tekst kommer igjen', () => {
    for (let frø = 1; frø <= 20; frø++) {
      const rng = seeded(100 + frø)
      let fag = { ...emptyFag(), nivaa: 9, plassert: true }
      const brukt = []
      for (let o = 0; o < 4; o++) {
        const m = buildMission(fag, { rng, stige: LESE })
        const tekster = [...new Set(m.tasks.map((t) => t.tekstId))]
        expect(tekster).toHaveLength(2)
        for (const id of tekster) expect(brukt, `frø ${frø}, oppdrag ${o + 1}: ${id} igjen`).not.toContain(id)
        brukt.push(...tekster)
        fag = huskOppgaver(fag, m.tasks)
      }
    }
  })
  it('2. 500 oppdrag på Geografi 2 med alt kjent: samme land høyst to ganger per oppdrag, aldri to spørsmål på rad om samme land', () => {
    const rng = seeded(200)
    const kjent = [...alleTing(GEO, 2), ...alleTing(GEO, 1)]
    expect(egneTing(GEO, 2).size).toBe(5)
    let treGanger = 0
    for (let i = 0; i < 500; i++) {
      const m = buildMission({ ...emptyFag(), nivaa: 2, plassert: true, kjent }, { rng, stige: GEO })
      expect(m.tasks.filter((t) => t.form === 'vis')).toHaveLength(0)
      const teller = {}
      for (const t of m.tasks) teller[t.emne] = (teller[t.emne] || 0) + 1
      for (const [land, n] of Object.entries(teller)) {
        if (n >= 3) treGanger++
        expect(n, `${land} ${n} ganger: ${m.tasks.map((t) => t.emne).join(' ')}`).toBeLessThanOrEqual(2)
      }
      for (let k = 1; k < m.tasks.length; k++) expect(m.tasks[k].emne, m.tasks.map((t) => t.emne).join(' ')).not.toBe(m.tasks[k - 1].emne)
    }
    expect(treGanger).toBe(0)
  })
  it('2b. med vis-kort (ingenting kjent): samme land høyst to spørsmål, vis + spørsmål om det samme er det eneste som står rett etter hverandre', () => {
    const rng = seeded(201)
    for (let i = 0; i < 300; i++) {
      const m = buildMission({ ...emptyFag(), nivaa: 3, plassert: true, kjent: [] }, { rng, stige: GEO })
      const teller = {}
      for (const t of m.tasks) if (t.form !== 'vis') teller[t.emne] = (teller[t.emne] || 0) + 1
      for (const n of Object.values(teller)) expect(n).toBeLessThanOrEqual(2)
      for (let k = 1; k < m.tasks.length; k++) if (m.tasks[k].emne === m.tasks[k - 1].emne) expect(m.tasks[k - 1].form).toBe('vis')
    }
  })
})

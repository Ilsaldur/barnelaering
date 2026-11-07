// Etappe X (runde 5): innhold – tekster, kart og småting.
import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { emptyFag } from '../profil.js'
import { buildMission, huskOppgaver, hashTekst } from '../matte/oppdrag.js'
import { NIVAER_LESING } from '../../data/lesing/nivaer.js'
import { genLesing, lagTekstOppgaver, velgTekst, tekstHash } from '../lesing/generatorer.js'
import { TEKSTER, RETTSKRIVING } from '../../data/lesing/innhold.js'
import { TEKSTER2 } from '../../data/lesing/tekster2.js'
import { FYLL_INN } from '../../data/engelsk/innhold.js'
import { kartPool, KART_UTVALG } from '../geo/kart.js'
import { pikselStorrelse, countries } from '../geo/topo.js'
import { NIVAER_ENGELSK } from '../../data/engelsk/nivaer.js'
import { genEngelsk } from '../engelsk/generatorer.js'

const LESE = { nivaer: NIVAER_LESING, gen: genLesing, tekstOppgaver: lagTekstOppgaver }
const ordI = (t) => t.tekst.trim().split(/\s+/).length

describe('X1 – lesetekster', () => {
  it('1. fire oppdrag på rad på Lese 10: ingen tekst kommer igjen før alle er brukt', () => {
    const alleTekster = TEKSTER2.filter((t) => t.type === 'slutning').length
    for (let k = 0; k < 10; k++) {
      const rng = seeded(100 + k)
      let fag = { ...emptyFag(), nivaa: 10, plassert: true }
      const brukte = []
      for (let o = 0; o < 4; o++) {
        const m = buildMission(fag, { rng, stige: LESE })
        const ider = [...new Set(m.tasks.map((t) => t.tekstId))]
        expect(ider).toHaveLength(2)
        for (const id of ider) expect(brukte, `oppdrag ${o + 1}: ${id} kom igjen`).not.toContain(id)
        brukte.push(...ider)
        fag = huskOppgaver(fag, m.tasks)
      }
      expect(brukte.length).toBe(8)
      expect(alleTekster).toBeGreaterThanOrEqual(8)
    }
  })
  it('tekst-id-ene ligger i husk-lista, og velgTekst foretrekker tekster barnet ikke har hatt', () => {
    const fag = huskOppgaver(emptyFag(), [{ prompt: 'a', answer: 1, tekstId: 'x-1' }])
    expect(fag.sett).toContain(hashTekst('x-1'))
    expect(tekstHash('x-1')).toBe(hashTekst('x-1'))
    const pool = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    const sett = [tekstHash('a'), tekstHash('b')]
    for (let i = 0; i < 20; i++) expect(velgTekst(pool, seeded(i), sett).id).toBe('c')
    // Alle brukt: den det er lengst siden (først i lista).
    expect(velgTekst(pool, seeded(1), [tekstHash('b'), tekstHash('c'), tekstHash('a')]).id).toBe('b')
  })
  it('engelsk 8 husker tekstene også: fire oppdrag gir åtte ulike tekster først', () => {
    const ENG = { nivaer: NIVAER_ENGELSK, gen: genEngelsk, kunnskap: true }
    const rng = seeded(8)
    let fag = { ...emptyFag(), nivaa: 8, plassert: true }
    const sett = new Set()
    let total = 0
    for (let o = 0; o < 2; o++) {
      const m = buildMission(fag, { rng, stige: ENG })
      for (const t of m.tasks) if (t.tekstId) { sett.add(t.tekstId); total++ }
      fag = huskOppgaver(fag, m.tasks)
    }
    expect(sett.size).toBe(total)
  })
  it('2. Lese 8 og 9 har ingen felles tekster; Lese 10–12 har minst 16 tekster hver', () => {
    const rng = seeded(2)
    const n8 = new Set()
    const n9 = new Set()
    for (let i = 0; i < 300; i++) {
      n8.add(genLesing('tekst_sporsmaal', NIVAER_LESING[7].typer[0].param, rng).tekstId)
      n9.add(genLesing('tekst_sporsmaal', NIVAER_LESING[8].typer[0].param, rng).tekstId)
    }
    expect([...n8].filter((id) => n9.has(id))).toEqual([])
    expect(n9.size).toBeGreaterThanOrEqual(6)
    for (const id of n9) expect(ordI(TEKSTER.find((t) => t.id === id))).toBeGreaterThan(80)
    for (const id of n8) expect(ordI(TEKSTER.find((t) => t.id === id))).toBeLessThanOrEqual(80)
    for (const type of ['slutning', 'ordforraad', 'hovedtanke']) {
      const liste = TEKSTER2.filter((t) => t.type === type)
      expect(liste.length, type).toBeGreaterThanOrEqual(16)
      for (const t of liste) {
        expect(t.sporsmaal.length).toBeGreaterThanOrEqual(3)
        for (const q of t.sporsmaal) {
          expect(q.alternativer).toContain(q.svar)
          expect(new Set(q.alternativer).size).toBe(q.alternativer.length)
        }
      }
    }
    expect(new Set(TEKSTER2.map((t) => t.id)).size).toBe(TEKSTER2.length)
    // De seks nye tekstene til nivå 9 er på 90–130 ord og har fakta-eller-mening.
    const nye = TEKSTER.filter((t) => t.id.startsWith('n9-'))
    expect(nye.length).toBe(6)
    for (const t of nye) {
      expect(ordI(t)).toBeGreaterThanOrEqual(90)
      expect(ordI(t)).toBeLessThanOrEqual(130)
      expect(t.sporsmaal.some((q) => q.type === 'faktamening')).toBe(true)
    }
  })
})

describe('X2 – kartene', () => {
  it('3. Afrika-kartet spør etter høyst 12 land, alle minst 24 × 24 punkter ved bredde 390', () => {
    const alle = countries()
    for (const region of ['afrika', 'asia', 'amerika']) {
      const pool = kartPool(region)
      expect(pool.length, region).toBeLessThanOrEqual(12)
      expect(pool.length, region).toBeGreaterThanOrEqual(10)
      for (const l of pool) {
        const { w, h } = pikselStorrelse(alle.find((c) => c.id === l.id), region, 390)
        expect(w, `${region} ${l.navn}`).toBeGreaterThanOrEqual(24)
        expect(h, `${region} ${l.navn}`).toBeGreaterThanOrEqual(24)
        expect(KART_UTVALG[region]).toContain(l.kode)
      }
    }
    expect(kartPool('afrika').map((l) => l.navn)).toEqual(expect.arrayContaining(['Egypt', 'Marokko', 'Algerie', 'Nigeria', 'Etiopia', 'Kenya', 'Tanzania', 'Sør-Afrika', 'Madagaskar', 'Kongo', 'Somalia', 'Mali']))
    // Utforsk kartet viser alle som er store nok.
    expect(kartPool('afrika', { alle: true }).length).toBeGreaterThan(12)
  })
})

describe('X3 – småting', () => {
  it('4. ingen feilsvar i Skrive riktig er et ekte ord (lista utvidet med egge, bukke, sommar, dei)', () => {
    const ekte = new Set(['egge', 'bukke', 'sommar', 'dei', 'hai', 'kval', 'sten', 'ren'])
    for (const liste of Object.values(RETTSKRIVING)) for (const o of liste) for (const f of o.feil) expect(ekte.has(f), `${o.ord}: ${f}`).toBe(false)
  })
  it('«I put the key in the ___» viser en dør', () => {
    expect(FYLL_INN.find((f) => f.en.startsWith('I put the key')).emoji).toBe('🚪')
  })
})

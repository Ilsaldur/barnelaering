// Etappe M (runde 4): mer innhold der bunken er liten.
import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { antallUlike, oppdragLengde } from '../matte/oppdrag.js'
import { NIVAER_GEO } from '../../data/geo/nivaer.js'
import { genGeo } from '../geo/generatorer.js'
import { kartPool } from '../geo/kart.js'
import { LAND, landFor, landIKontinent } from '../../data/geo/land.js'
import { pikselStorrelse, countries } from '../geo/topo.js'
import { NIVAER_ENGELSK } from '../../data/engelsk/nivaer.js'
import { genEngelsk } from '../engelsk/generatorer.js'
import { SETNINGER, FYLL_INN, SPORSMAAL, ORD } from '../../data/engelsk/innhold.js'
import { NIVAER_SKRIVE, NIVAER_SPRAK } from '../../data/lesing/nivaer.js'
import { genLesing } from '../lesing/generatorer.js'
import { RETTSKRIVING, BOYING } from '../../data/lesing/innhold.js'

const GEO = { nivaer: NIVAER_GEO, gen: genGeo }
const ENG = { nivaer: NIVAER_ENGELSK, gen: genEngelsk }
const SKRIVE = { nivaer: NIVAER_SKRIVE, gen: genLesing }
const SPRAK = { nivaer: NIVAER_SPRAK, gen: genLesing }

describe('M – innhold', () => {
  it('Engelsk 7 har minst 38 spørsmål, 6 minst 40 fyll-inn, 5 minst 40 setninger', () => {
    expect(SPORSMAAL.length).toBeGreaterThanOrEqual(38)
    expect(FYLL_INN.length).toBeGreaterThanOrEqual(40)
    expect(SETNINGER.length).toBeGreaterThanOrEqual(40)
    for (const q of SPORSMAAL) {
      expect(q.feil).toHaveLength(3)
      expect(q.feil).not.toContain(q.svar)
    }
    for (const f of FYLL_INN) {
      expect(f.en).toContain('___')
      expect(f.feil).toHaveLength(3)
      expect(f.emoji).toBeTruthy()
    }
    for (const s of SETNINGER) {
      expect(s.feil).toHaveLength(3)
      expect(s.feil).not.toContain(s.svar)
    }
    // Ingen like spørsmål.
    expect(new Set(SPORSMAAL.map((q) => q.q)).size).toBe(SPORSMAAL.length)
    expect(new Set(FYLL_INN.map((q) => q.en)).size).toBe(FYLL_INN.length)
    expect(new Set(SETNINGER.map((q) => q.en)).size).toBe(SETNINGER.length)
  })
  it('Språk 2 (bøying) har minst 42 oppgaver med entall/flertall, nåtid/fortid og gradbøying', () => {
    expect(BOYING.length).toBeGreaterThanOrEqual(42)
    expect(BOYING.filter((b) => /^(Én|Ett) /.test(b.setning)).length).toBeGreaterThanOrEqual(15)
    expect(BOYING.filter((b) => b.setning.startsWith('I dag')).length).toBeGreaterThanOrEqual(12)
    expect(BOYING.filter((b) => !b.setning.startsWith('I dag') && !/^(Én|Ett) /.test(b.setning)).length).toBeGreaterThanOrEqual(10)
    for (const b of BOYING) {
      expect(b.setning).toContain('___')
      expect(b.feil).not.toContain(b.svar)
      expect(new Set(b.feil).size).toBe(3)
    }
    expect(new Set(BOYING.map((b) => b.setning)).size).toBe(BOYING.length)
  })
  it('Skrive riktig har minst 25 ord per gruppe, og ingen feilsvar er et ekte ord', () => {
    const alleOrd = new Set(Object.values(RETTSKRIVING).flatMap((g) => g.map((o) => o.ord)))
    const ekte = new Set([...alleOrd, 'hai', 'kval', 'sten', 'ren', 'bake', 'pen', 'gått', 'nøt', 'kuer', 'øyer', 'høyst', 'dårligst', 'svømmet', 'kjære', 'hope', 'bokhylla', 'hjemme'])
    for (const [gruppe, liste] of Object.entries(RETTSKRIVING)) {
      expect(liste.length, gruppe).toBeGreaterThanOrEqual(25)
      expect(new Set(liste.map((o) => o.ord)).size, gruppe).toBe(liste.length)
      for (const o of liste) {
        expect(o.feil.length, o.ord).toBeGreaterThanOrEqual(3)
        for (const f of o.feil) {
          expect(f, `${o.ord}: ${f}`).not.toBe(o.ord)
          expect(ekte.has(f), `${o.ord}: «${f}» er et ekte ord`).toBe(false)
        }
      }
    }
    // Bøying: feilsvar skal heller ikke være riktige former.
    for (const b of BOYING) for (const f of b.feil) expect(['kuer', 'øyer', 'høyst', 'dårligst', 'svømmet', 'gav', 'hoppa'], b.setning).not.toContain(f)
  })
  it('Geografi: Norden-nivåene har nye spørsmålsformer', () => {
    const rng = seeded(9)
    const a = genGeo('flagg_hovedstad', { region: 'norden' }, rng)
    expect(a.visual.kind).toBe('flagg')
    expect(landFor('norden').map((l) => l.hovedstad)).toContain(a.answer)
    const b = genGeo('hovedstad_flagg', { region: 'norden' }, rng)
    expect(b.optionFlagg[b.answer]).toBeTruthy()
    const c = genGeo('kart_hovedstad', { region: 'norden' }, rng)
    expect(c.visual.kind).toBe('kart')
    expect(c.prompt).toBe('Hva er hovedstaden i landet som er markert?')
    expect(NIVAER_GEO[1].typer.map((t) => t.type)).toEqual(expect.arrayContaining(['flagg_hovedstad', 'hovedstad_flagg']))
    expect(NIVAER_GEO[2].typer.map((t) => t.type)).toContain('kart_hovedstad')
  })
  it('Geografi 9: kart over hver verdensdel med alle land som er minst 24 × 24 punkter; verdenskartet beholder de store', () => {
    const alle = countries()
    for (const region of ['amerika', 'afrika', 'asia', 'oseania']) {
      const pool = kartPool(region)
      expect(pool.length, region).toBeGreaterThanOrEqual(3)
      const h = genGeo('hvilket_land', { region }, seeded(2))
      expect(h.options).toHaveLength(4)
      const ids = new Set(pool.map((l) => l.id))
      // Alle land i verdensdelen som er store nok er med, og ingen små.
      for (const l of landIKontinent(region)) {
        const c = alle.find((x) => x.id === l.id)
        const { w, h } = pikselStorrelse(c, region, 390)
        expect(ids.has(l.id), `${region}: ${l.navn} (${w | 0}×${h | 0})`).toBe(w >= 24 && h >= 24)
      }
      const t = genGeo('finn_paa_kart', { region }, seeded(1))
      expect(t.region).toBe(region)
      expect(ids.has(t.answer)).toBe(true)
    }
    expect(kartPool('verden').map((l) => l.navn).sort()).toEqual(['Australia', 'Brasil', 'Canada', 'India', 'Kina', 'Norge', 'Russland', 'USA'])
    // Land som bare brukes på kart, dukker ikke opp i flagg- og hovedstadsspørsmål.
    const rng = seeded(3)
    for (let i = 0; i < 300; i++) {
      const t = genGeo('hovedstad', { region: 'verden' }, rng)
      expect(LAND.find((l) => l.hovedstad === t.answer || l.navn === t.answer)?.bareKart).toBeFalsy()
    }
    const typer = NIVAER_GEO[8].typer.map((t) => `${t.type}:${t.param.region}`)
    for (const r of ['verden', 'amerika', 'afrika', 'asia', 'oseania']) expect(typer).toContain(`finn_paa_kart:${r}`)
  })
  it('Akseptansetest: Engelsk 5–7, Språk 2, Skrive riktig 1–4 og Geografi 9 har minst 40 ulike spørsmål; Geografi 2 og 3 minst 20', () => {
    for (const n of [5, 6, 7]) expect(antallUlike(ENG, n, 60), `engelsk ${n}`).toBeGreaterThanOrEqual(40)
    expect(antallUlike(SPRAK, 2, 60)).toBeGreaterThanOrEqual(40)
    for (const n of [1, 2, 3, 4]) expect(antallUlike(SKRIVE, n, 60), `skrive ${n}`).toBeGreaterThanOrEqual(40)
    expect(antallUlike(GEO, 9, 60)).toBeGreaterThanOrEqual(40)
    expect(antallUlike(GEO, 2, 60)).toBeGreaterThanOrEqual(20)
    expect(antallUlike(GEO, 3, 60)).toBeGreaterThanOrEqual(20)
    // Disse får derfor åtte oppgaver igjen; bare Geografi 1 har fem.
    for (const n of [2, 3, 9]) expect(oppdragLengde(GEO, n)).toBe(8)
    expect(oppdragLengde(GEO, 1)).toBe(5)
    expect(oppdragLengde(ENG, 7)).toBe(8)
    expect(oppdragLengde(SPRAK, 2)).toBe(8)
  })
  it('ordene i de nye engelske setningene finnes i ordlistene eller er vanlige småord', () => {
    const ord = new Set(Object.values(ORD).flatMap((g) => g.map((w) => w.en.toLowerCase())))
    const smaa = new Set('hands feet the a an i you he she it we they my your is are am can have has eat eats drink drinks see sleep sleeps like likes go goes to in on at and or of with by says say big small hot cold sweet red green yellow blue white black brown pink orange purple one two three four five six seven eight nine ten open please look kick count walk hear turn put wear read ride sit shines night morning summer good this that there do does not no yes what where who how many much old colour time name fingers legs ears eyes grass snow moon sun water school table ice cream long tail nose head bed door key cat dog cow pig horse bird fish frog mouse elephant monkey rabbit bear fox lion sheep apple banana carrot cake cheese milk bread pizza strawberry strawberries chair lamp car bus bike ball book hat shoes shoe sock socks dress clock house running sleeping raining snowing reading swim fly jump play strong round'.split(' '))
    for (const f of FYLL_INN) {
      const svar = f.svar.toLowerCase()
      expect(ord.has(svar) || smaa.has(svar), `fyll inn: ${svar}`).toBe(true)
    }
  })
})

import { describe, it, expect } from 'vitest'
import { dagensKort, dagStatus, ukestripe, overraskelseFor, nottGrad, sistSpilt } from '../dagen.js'
import { emptySettings } from '../profil.js'

const DAG = 1794009600000 // 2026-11-06 ca. kl. 12 UTC
const d = (dager) => DAG - dager * 24 * 3600 * 1000

describe('dagens økt', () => {
  it('tre kort, alle ulike, uten innstillinger', () => {
    const k = dagensKort({ log: [], dayKey: '2026-11-06' })
    expect(k).toHaveLength(3)
    expect(new Set(k.map((x) => x.fag)).size).toBe(3)
    expect(k[2].overraskelse).toBe(true)
  })
  it('sist spilt: lesing teller alle tre sporene, aldri spilt er 0', () => {
    const s = sistSpilt([{ t: 10, fag: 'skrive' }, { t: 20, fag: 'sprak' }, { t: 5, fag: 'matte' }])
    expect(s.lesing).toBe(20)
    expect(s.matte).toBe(5)
    expect(s.klokke).toBe(0)
  })
  it('overraskelsen er lik hele dagen og kan være Nøttehula', () => {
    expect(overraskelseFor('2026-11-06')).toBe(overraskelseFor('2026-11-06'))
    const sett = new Set()
    for (let i = 1; i <= 28; i++) sett.add(dagensKort({ log: [], dayKey: `2026-11-${String(i).padStart(2, '0')}` })[2].fag)
    expect(sett.has('nott')).toBe(true)
  })
  it('alle fem stigene kommer som kort 1 eller 2 i løpet av den første uka', () => {
    const sett = new Set()
    for (let i = 1; i <= 7; i++) for (const k of dagensKort({ log: [], dayKey: `2026-11-0${i}` }).slice(0, 2)) sett.add(k.fag)
    expect(sett.size).toBe(5)
  })
  it('dagen er ferdig etter to oppdrag', () => {
    expect(dagStatus({ dager: { '2026-11-06': { oppdrag: 2, fag: { klokke: 2 } } }, settings: emptySettings(), dayKey: '2026-11-06' }).ferdig).toBe(true)
    expect(dagStatus({ dager: {}, settings: emptySettings(), dayKey: '2026-11-06' })).toMatchObject({ gjort: 0, maal: 2, ferdig: false })
    expect(dagStatus({ dager: { '2026-11-06': { oppdrag: 1, fag: {} } }, settings: { oppdragPerDag: 1 }, dayKey: '2026-11-06' }).ferdig).toBe(true)
  })
  it('ukestripe: sju ruter, fridag mister ingenting', () => {
    const now = new Date(2026, 10, 6) // fredag
    const u = ukestripe({ dager: { '2026-11-03': { oppdrag: 2, fag: {} } }, settings: emptySettings(), now })
    expect(u).toHaveLength(7)
    expect(u[0].navn).toBe('Ma')
    expect(u[1].ferdig).toBe(true) // tirsdag
    expect(u[2].ferdig).toBe(false) // onsdag fri
    expect(u[4].idag).toBe(true)
    expect(u[5].framtid).toBe(true)
  })
  it('nøttegrad følger mattenivået', () => {
    expect(nottGrad(3)).toBe(1)
    expect(nottGrad(20)).toBe(2)
    expect(nottGrad(35)).toBe(3)
  })
  it('lesing teller alle tre sporene i dagstatus', () => {
    expect(dagStatus({ dager: { '2026-11-06': { oppdrag: 2, fag: { skrive: 1, matte: 1 } } }, settings: emptySettings(), dayKey: '2026-11-06' }).fag.lesing).toBe(1)
  })
  it('akseptansetest R2: matte i går, lesing for tre dager siden, aldri klokke, geografi, engelsk', () => {
    const log = [
      { t: d(1), fag: 'matte', oppdrag: true },
      { t: d(3), fag: 'lesing', oppdrag: true },
    ]
    for (let i = 1; i <= 30; i++) {
      const dayKey = `2026-11-${String(i).padStart(2, '0')}`
      const k = dagensKort({ log, dayKey })
      expect(['klokke', 'geografi', 'engelsk']).toContain(k[0].fag)
      expect(['klokke', 'geografi', 'engelsk']).toContain(k[1].fag)
      expect(k[0].fag).not.toBe(k[1].fag)
      expect([k[0].fag, k[1].fag]).not.toContain(k[2].fag)
      // Samme dag gir samme kort.
      expect(dagensKort({ log, dayKey })).toEqual(k)
    }
  })
  it('innstillingene fagblanding og fast finnes ikke lenger', () => {
    expect(emptySettings()).not.toHaveProperty('fagblanding')
    expect(emptySettings()).not.toHaveProperty('fast')
    expect(emptySettings().oppdragPerDag).toBe(2)
  })
})

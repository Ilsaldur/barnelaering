import { describe, it, expect } from 'vitest'
import { dagensKort, dagStatus, ukestripe, overraskelseFor, nottGrad } from '../dagen.js'
import { emptySettings } from '../profil.js'

describe('dagens økt', () => {
  it('tre kort: matte, overraskelse og et fast fag til lesing er klar', () => {
    const k = dagensKort({ settings: emptySettings(), dayKey: '2026-11-06', fagTilgjengelig: ['matte'] })
    expect(k).toHaveLength(3)
    expect(k[0].fag).toBe('matte')
    expect(k.map((x) => x.fag)).not.toContain('lesing')
    expect(new Set(k.map((x) => x.fag)).size).toBe(3)
  })
  it('lesing er med når stigen finnes', () => {
    const k = dagensKort({ settings: emptySettings(), dayKey: '2026-11-06', fagTilgjengelig: ['matte', 'lesing'] })
    expect(k.map((x) => x.fag)).toContain('lesing')
  })
  it('overraskelsen er lik hele dagen og kommer fra klokke, geografi eller nøtt', () => {
    expect(overraskelseFor('2026-11-06')).toBe(overraskelseFor('2026-11-06'))
    expect(['klokke', 'geografi', 'nott', 'engelsk']).toContain(overraskelseFor('2026-11-06'))
  })
  it('fast fag merkes', () => {
    const k = dagensKort({ settings: { ...emptySettings(), fast: 'matte' }, dayKey: '2026-11-06' })
    expect(k.find((x) => x.fag === 'matte').fast).toBe(true)
  })
  it('dagen er ferdig etter to oppdrag, og krever det faste faget', () => {
    const s = { ...emptySettings(), fast: 'matte' }
    expect(dagStatus({ dager: { '2026-11-06': { oppdrag: 2, fag: { klokke: 2 } } }, settings: s, dayKey: '2026-11-06' }).ferdig).toBe(false)
    expect(dagStatus({ dager: { '2026-11-06': { oppdrag: 2, fag: { klokke: 1, matte: 1 } } }, settings: s, dayKey: '2026-11-06' }).ferdig).toBe(true)
    expect(dagStatus({ dager: {}, settings: emptySettings(), dayKey: '2026-11-06' })).toMatchObject({ gjort: 0, maal: 2, ferdig: false })
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
})

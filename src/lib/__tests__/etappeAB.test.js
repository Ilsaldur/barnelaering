// Etappe AB (runde 6): Dagens økt står stille.
import { describe, it, expect } from 'vitest'
import { kortForDagen, lagreDagensKort, dagensKort, gyldigeKort } from '../dagen.js'
import { emptyData, mergeData } from '../profil.js'

const DAG = '2026-11-07'
const t = (iso) => new Date(iso).getTime()

describe('AB – dagens kort lagres', () => {
  it('første visning regner ut kortene og ber om lagring; etterpå brukes de lagrede selv om loggen endrer seg', () => {
    const d0 = emptyData()
    const forste = kortForDagen({ data: d0, dayKey: DAG })
    expect(forste.ny).toBe(true)
    expect(forste.kort).toHaveLength(3)
    const d1 = lagreDagensKort(d0, forste.kort, DAG)
    expect(d1.dager[DAG].kort).toEqual(forste.kort)
    // Barnet spiller kortet lengst til venstre: loggen får en ny post. Kortene står.
    const spilt = forste.kort[0].fag
    const d2 = { ...d1, log: [{ t: t(`${DAG}T10:00:00`), fag: spilt, oppdrag: true }], dager: { [DAG]: { ...d1.dager[DAG], oppdrag: 1, fag: { [spilt]: 1 } } } }
    const andre = kortForDagen({ data: d2, dayKey: DAG })
    expect(andre.ny).toBe(false)
    expect(andre.kort).toEqual(forste.kort)
    // Uten lagring ville kortene byttet (det var feilen).
    expect(dagensKort({ log: d2.log, dayKey: DAG })[0].fag).not.toBe(spilt)
    // Lagring er idempotent.
    expect(lagreDagensKort(d2, dagensKort({ log: d2.log, dayKey: DAG }), DAG)).toBe(d2)
  })
  it('neste dag er kortene nye, og faget som ble spilt er ikke blant de to første', () => {
    const d0 = emptyData()
    const { kort } = kortForDagen({ data: d0, dayKey: DAG })
    const spilt = kort[0].fag
    const d1 = { ...lagreDagensKort(d0, kort, DAG), log: [{ t: t(`${DAG}T10:00:00`), fag: spilt, oppdrag: true }] }
    const neste = kortForDagen({ data: d1, dayKey: '2026-11-08' })
    expect(neste.ny).toBe(true)
    expect(neste.kort.slice(0, 2).map((k) => k.fag)).not.toContain(spilt)
  })
  it('ugyldige lagrede kort (gammelt format, fag som ikke finnes) regnes ut på nytt', () => {
    expect(gyldigeKort([{ fag: 'matte' }, { fag: 'lesing' }])).toBe(false)
    expect(gyldigeKort([{ fag: 'matte' }, { fag: 'lesing' }, { fag: 'sjakk' }])).toBe(false)
    const d = { ...emptyData(), dager: { [DAG]: { oppdrag: 0, fag: {}, kort: [{ fag: 'tull' }] } } }
    expect(kortForDagen({ data: d, dayKey: DAG }).ny).toBe(true)
  })
  it('fletting av to enheter beholder dagens kort', () => {
    const a = emptyData()
    const { kort } = kortForDagen({ data: a, dayKey: DAG })
    const a1 = lagreDagensKort(a, kort, DAG)
    const b = { ...emptyData(), dager: { [DAG]: { oppdrag: 1, fag: { matte: 1 } } } }
    const m = mergeData(a1, b)
    expect(m.dager[DAG].kort).toEqual(kort)
    expect(m.dager[DAG].oppdrag).toBe(1)
    expect(mergeData(b, a1).dager[DAG].kort).toEqual(kort)
  })
})

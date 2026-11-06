// Etappe O (runde 4): still klokka – den korte viseren står der barnet slipper den.
import { describe, it, expect } from 'vitest'
import { startKlokke, settTime, settMinutt, stillRiktig, stiltTid, timeVinkel, rundVinkel, vinkelAvstand, timeviserTekst, TIME_TOLERANSE } from '../klokke/vinkel.js'
import { genKlokke } from '../klokke/generatorer.js'

describe('O – still klokka', () => {
  it('den korte viseren rundes til 2,5 grader og flyttes ikke av minuttviseren', () => {
    let k = settTime(startKlokke(), 61.3)
    expect(k.timeDeg).toBe(62.5)
    k = settMinutt(k, 45)
    expect(k.timeDeg).toBe(62.5)
    expect(rundVinkel(359.9)).toBe(0)
    expect(vinkelAvstand(5, 355)).toBe(10)
  })
  it('akseptansetest 1: alle 144 tider godtas med den korte viseren på riktig plass, uansett rekkefølge', () => {
    for (let h = 1; h <= 12; h++) {
      for (let m = 0; m < 60; m += 5) {
        const answer = { h, m }
        const riktigDeg = rundVinkel(timeVinkel(h, m))
        // Kort viser først, så lang.
        const a = settMinutt(settTime(startKlokke(), riktigDeg), m)
        expect(stillRiktig(a, answer), `${h}:${m} kort først`).toBe(true)
        // Lang viser først, så kort.
        const b = settTime(settMinutt(startKlokke(), m), riktigDeg)
        expect(stillRiktig(b, answer), `${h}:${m} lang først`).toBe(true)
        // «Du:» viser riktig klokkeslett regnet fra vinkelen.
        expect(stiltTid(a)).toEqual({ h, m })
        // Feil minutt godtas ikke.
        expect(stillRiktig(settMinutt(a, (m + 5) % 60), answer)).toBe(false)
      }
    }
  })
  it('akseptansetest 2: «halv 7» med den korte viseren rett på 7 eller 6 godtas ikke; «fem på 2» rett på 2 godtas', () => {
    const halvSju = { h: 6, m: 30 }
    expect(stillRiktig(settMinutt(settTime(startKlokke(), 7 * 30), 30), halvSju)).toBe(false)
    expect(stillRiktig(settMinutt(settTime(startKlokke(), 6 * 30), 30), halvSju)).toBe(false)
    expect(stillRiktig(settMinutt(settTime(startKlokke(), 195), 30), halvSju)).toBe(true)
    const femPaaTo = { h: 1, m: 55 }
    expect(stillRiktig(settMinutt(settTime(startKlokke(), 2 * 30), 55), femPaaTo)).toBe(true)
    expect(TIME_TOLERANSE).toBe(12)
  })
  it('forklaringen sier hvor den korte viseren skal stå, og instruksen krever ingen rekkefølge', () => {
    expect(timeviserTekst({ h: 6, m: 30 })).toBe('midt mellom 6 og 7')
    expect(timeviserTekst({ h: 1, m: 55 })).toBe('nesten på 2')
    expect(timeviserTekst({ h: 3, m: 0 })).toBe('rett på 3')
    expect(timeviserTekst({ h: 12, m: 10 })).toBe('litt forbi 12')
    const t = genKlokke('still_klokka', { minutes: 'five' }, () => 0.3)
    expect(t.spoken).toContain('Sett den lange viseren på minuttene og den korte på timen.')
    expect(t.spoken).not.toContain('Dra den korte viseren')
  })
})

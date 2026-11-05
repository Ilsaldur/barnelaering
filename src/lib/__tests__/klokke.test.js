import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { timePhrase, timeSentence, timeLabel, makeClockRound, MIN_POOLS } from '../klokke.js'

describe('klokkespråk', () => {
  it('skriver ikke «Klokka er» to ganger', () => {
    expect(timeSentence(7, 0)).toBe('Klokka er 7')
    expect(timeSentence(8, 30)).toBe('Klokka er halv 9')
    expect(timeSentence(3, 15)).toBe('Klokka er kvart over 3')
    expect(timeSentence(3, 45)).toBe('Klokka er kvart på 4')
    expect(timeSentence(12, 30)).toBe('Klokka er halv 1')
  })
  it('knappetekst har stor forbokstav', () => {
    expect(timeLabel(8, 30)).toBe('Halv 9')
    expect(timeLabel(7, 0)).toBe('Klokka er 7')
  })
  it('fem-minutter skrives digitalt', () => {
    expect(timePhrase(4, 5)).toBe('4:05')
  })
})

describe('makeClockRound', () => {
  for (const mode of Object.keys(MIN_POOLS)) {
    it(`${mode}: åtte unike oppgaver med fire ulike alternativer`, () => {
      const rng = seeded(42)
      const round = makeClockRound(mode, { rng })
      expect(round).toHaveLength(8)
      if (mode !== 'whole') expect(new Set(round.map((q) => `${q.hour}:${q.minute}`)).size).toBe(8)
      for (const q of round) {
        expect(q.options).toHaveLength(4)
        expect(new Set(q.options.map((o) => o.label)).size).toBe(4)
        expect(q.options.some((o) => o.h === q.hour && o.m === q.minute)).toBe(true)
        for (const o of q.options) expect(MIN_POOLS[mode]).toContain(o.m)
      }
    })
  }
})

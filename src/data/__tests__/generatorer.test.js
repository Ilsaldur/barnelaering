import { describe, it, expect } from 'vitest'
import { GENERATORS, TOPICS } from '../topics.js'
import { makeRound } from '../../lib/quiz.js'
import { COLORS, SHAPES, FIRST_LETTER, LETTER_SOUNDS, OPPOSITES, FRACTIONS, COUNTING_TO_5, COUNTING_TO_10 } from '../levels.js'

function checkItem(it) {
  expect(it.options).toContain(it.answer)
  expect(new Set(it.options).size).toBe(it.options.length)
  for (const o of it.options) expect(Number(o)).toBeGreaterThanOrEqual(0)
}

describe('generatorer for tall og telling', () => {
  it('telling: fasit er antallet, feilsvar er nære og aldri under 1', () => {
    const gen = GENERATORS.countingGen(10)
    for (let i = 0; i < 200; i++) {
      const it = gen()
      expect(it.answer).toBe(String(it.count))
      expect(it.options).toHaveLength(4)
      checkItem(it)
      for (const o of it.options) {
        expect(Number(o)).toBeGreaterThanOrEqual(1)
        expect(Math.abs(Number(o) - it.count)).toBeLessThanOrEqual(3)
      }
    }
  })
  it('før og etter: riktig nabo, ingen negative', () => {
    const gen = GENERATORS.beforeAfterGen(20)
    for (let i = 0; i < 200; i++) {
      const it = gen()
      checkItem(it)
      const n = Number(it.prompt.match(/\d+/)[0])
      expect(Number(it.answer)).toBe(it.prompt.includes('etter') ? n + 1 : n - 1)
    }
  })
  it('hvilket tall mangler: fasit er hullet i rekka', () => {
    const gen = GENERATORS.missingGen(20)
    for (let i = 0; i < 200; i++) {
      const it = gen()
      checkItem(it)
      const parts = it.show.split(/\s+/)
      const idx = parts.indexOf('?')
      const before = idx > 0 ? Number(parts[idx - 1]) : Number(parts[idx + 1]) - 1
      expect(Number(it.answer)).toBe(before + 1)
    }
  })
  it('flest/færrest: svaret er riktig gruppe', () => {
    const gen = GENERATORS.moreLessGen(8)
    for (let i = 0; i < 200; i++) {
      const it = gen()
      const [A, B] = it.groups
      expect(A.count).not.toBe(B.count)
      const most = it.prompt.includes('flest')
      const win = most ? (A.count > B.count ? A : B) : A.count < B.count ? A : B
      expect(it.answer).toBe(win.emoji)
      expect(it.options).toContain(it.answer)
    }
  })
  it('størst/minst', () => {
    const gen = GENERATORS.biggerGen(20)
    for (let i = 0; i < 100; i++) {
      const it = gen()
      const nums = it.options.map(Number)
      const exp = it.prompt.includes('størst') ? Math.max(...nums) : Math.min(...nums)
      expect(Number(it.answer)).toBe(exp)
    }
  })
})

describe('quiz-runder', () => {
  it('alle quiz-nivåer gir åtte ulike oppgaver med fasit blant alternativene', () => {
    for (const topic of TOPICS) {
      for (const lvl of topic.levels) {
        if (lvl.engine !== 'quiz') continue
        for (let k = 0; k < 5; k++) {
          const round = makeRound(lvl.config)
          expect(round.length, `${topic.id}/${lvl.sub}`).toBe(8)
          const keys = round.map((it) => it.key || `${it.prompt}|${it.show}|${it.count}|${it.answer}`)
          expect(new Set(keys).size, `${topic.id}/${lvl.sub}`).toBe(8)
          for (const it of round) {
            expect(it._options.map((o) => o.value)).toContain(it.answer)
            expect(new Set(it._options.map((o) => o.value)).size).toBe(it._options.length)
          }
        }
      }
    }
  })
  it('bankene har minst åtte oppgaver', () => {
    for (const b of [COLORS, SHAPES, FIRST_LETTER, LETTER_SOUNDS, OPPOSITES, FRACTIONS, COUNTING_TO_5, COUNTING_TO_10]) {
      expect(b.bank.length).toBeGreaterThanOrEqual(8)
    }
  })
  it('farger og former viser svaret som bilde', () => {
    for (const cfg of [COLORS, SHAPES]) {
      const round = makeRound(cfg)
      for (const it of round) for (const o of it._options) expect(o.show).toBeTruthy()
    }
    const round = makeRound(LETTER_SOUNDS)
    for (const it of round) for (const o of it._options) expect(o.show).toBeTruthy()
  })
})

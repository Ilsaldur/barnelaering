import { describe, it, expect } from 'vitest'
import { TOPICS } from '../topics.js'
import { makeRound } from '../../lib/quiz.js'
import { COLORS, SHAPES } from '../levels.js'

describe('quiz-runder (fri lek)', () => {
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
    for (const b of [COLORS, SHAPES]) expect(b.bank.length).toBeGreaterThanOrEqual(8)
  })
  it('former viser svaret som bilde, farger viser navn (med opplesing)', () => {
    for (const it of makeRound(SHAPES)) for (const o of it._options) expect(o.show).toBeTruthy()
    for (const it of makeRound(COLORS)) for (const o of it._options) expect(o.show).toBeFalsy()
    expect(COLORS.readOptions).toBe(true)
  })
})

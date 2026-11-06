import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { mathDistractors, nearDistractors, makeOptions } from '../distractors.js'

function check(list, answer) {
  expect(list).toHaveLength(3)
  expect(new Set(list).size).toBe(3)
  expect(list).not.toContain(answer)
  for (const x of list) {
    expect(Number.isInteger(x)).toBe(true)
    expect(x).toBeGreaterThanOrEqual(0)
  }
}

describe('nearDistractors', () => {
  it('gir én for mye / én for lite rundt fasit, aldri negativt', () => {
    const rng = seeded(3)
    for (let answer = 0; answer <= 20; answer++) {
      const d = nearDistractors(answer, { rng })
      check(d, answer)
      for (const x of d) expect(Math.abs(x - answer)).toBeLessThanOrEqual(3)
    }
  })
  it('respekterer maks', () => {
    const d = nearDistractors(5, { max: 5, rng: seeded(1) })
    for (const x of d) expect(x).toBeLessThanOrEqual(5)
  })
})

describe('mathDistractors', () => {
  it('pluss og minus: tre unike, ikke-negative feilsvar som ikke er fasit', () => {
    const rng = seeded(7)
    for (let i = 0; i < 300; i++) {
      const a = Math.floor(rng() * 50) + 1
      const b = Math.floor(rng() * 50) + 1
      check(mathDistractors({ type: 'add', a, b, answer: a + b }, { rng }), a + b)
      const [big, small] = a >= b ? [a, b] : [b, a]
      check(mathDistractors({ type: 'sub', a: big, b: small, answer: big - small }, { rng }), big - small)
    }
  })

  it('pluss og minus: minst ett feilsvar har samme siste siffer (ti for mye/lite) når det er mulig', () => {
    const rng = seeded(11)
    let withTen = 0
    const N = 200
    for (let i = 0; i < N; i++) {
      const a = Math.floor(rng() * 40) + 10
      const b = Math.floor(rng() * 40) + 10
      const d = mathDistractors({ type: 'add', a, b, answer: a + b }, { rng })
      if (d.some((x) => Math.abs(x - (a + b)) === 10)) withTen++
    }
    expect(withTen).toBe(N)
  })

  it('gange: bruker nabotabellen', () => {
    const rng = seeded(5)
    for (let a = 1; a <= 10; a++) {
      for (let b = 1; b <= 10; b++) {
        const d = mathDistractors({ type: 'mul', a, b, answer: a * b }, { rng })
        check(d, a * b)
        for (const x of d) expect(x).toBeGreaterThan(0)
        const neighbours = [(a + 1) * b, (a - 1) * b, a * (b + 1), a * (b - 1)].filter((x) => x > 0 && x !== a * b)
        if (neighbours.length) expect(d.some((x) => neighbours.includes(x))).toBe(true)
      }
    }
  })

  it('deling: positive feilsvar', () => {
    const rng = seeded(9)
    for (let b = 2; b <= 10; b++) {
      for (let ans = 2; ans <= 10; ans++) {
        const d = mathDistractors({ type: 'div', a: b * ans, b, answer: ans }, { rng })
        check(d, ans)
        for (const x of d) expect(x).toBeGreaterThan(0)
      }
    }
  })

  it('små svar (0, 1) gir fortsatt tre gyldige feilsvar', () => {
    check(mathDistractors({ type: 'sub', a: 3, b: 3, answer: 0 }, { rng: seeded(2) }), 0)
    check(mathDistractors({ type: 'add', a: 1, b: 1, answer: 2 }, { rng: seeded(2) }), 2)
  })
})

describe('makeOptions', () => {
  it('inneholder fasit og alle feilsvar', () => {
    const o = makeOptions(7, [6, 8, 17], seeded(1))
    expect(o.sort((x, y) => x - y)).toEqual([6, 7, 8, 17])
  })
})

// Feilsvar som ligner ekte feil. Alle funksjonene gir en liste med unike
// tall som er forskjellige fra fasit og aldri negative.
import { shuffle } from './rng.js'

function clean(cands, answer, { min = 0, max = Infinity } = {}) {
  const out = []
  for (const c of cands) {
    if (!Number.isInteger(c)) continue
    if (c === answer || c < min || c > max) continue
    if (out.includes(c)) continue
    out.push(c)
  }
  return out
}

// Fyll på med ±1, ±2, ±3 … til vi har nok.
function fill(list, answer, count, { min = 0, max = Infinity } = {}) {
  let k = 1
  while (list.length < count && k < 1000) {
    for (const c of [answer + k, answer - k]) {
      if (list.length >= count) break
      if (c !== answer && c >= min && c <= max && !list.includes(c)) list.push(c)
    }
    k++
  }
  return list
}

// Nære feilsvar (én for mye, én for lite, to for mye …). Til telling og
// de minste nivåene.
export function nearDistractors(answer, { count = 3, min = 0, max = Infinity, rng = Math.random } = {}) {
  const near = clean([answer + 1, answer - 1, answer + 2, answer - 2], answer, { min, max })
  const picked = shuffle(near, rng).slice(0, count)
  return fill(picked, answer, count, { min, max })
}

// Feilsvar for et regnestykke { type: 'add'|'sub'|'mul'|'div', a, b, answer }.
//  - pluss/minus: ti for mye eller for lite (samme siste siffer), glemt
//    tierovergang, feil regneart, én eller to feil
//  - gange: nabotabellen ((a±1)·b, a·(b±1)), én gang for mye/lite
//  - deling: én eller to feil, divisoren
export function mathDistractors(problem, { count = 3, rng = Math.random } = {}) {
  const { type, a, b, answer } = problem
  let cands = []
  let min = 0

  if (type === 'add' || type === 'sub') {
    cands = [answer + 10, answer - 10, answer + 1, answer - 1, answer + 2, answer - 2]
    // Feil regneart.
    cands.push(type === 'add' ? Math.abs(a - b) : a + b)
    // Byttet om sifrene (23 → 32).
    if (answer >= 10 && answer < 100 && answer % 10 !== 0 && answer % 11 !== 0) {
      cands.push(Number(String(answer).split('').reverse().join('')))
    }
    if (answer >= 100) cands.push(answer + 100, answer - 100)
  } else if (type === 'mul') {
    min = 1
    cands = [(a + 1) * b, (a - 1) * b, a * (b + 1), a * (b - 1), answer + a, answer - a, answer + b, answer - b]
    if (a + b !== answer) cands.push(a + b)
  } else if (type === 'div') {
    min = 1
    cands = [answer + 1, answer - 1, answer + 2, answer - 2, b, a - b, answer * 2]
  } else {
    cands = [answer + 1, answer - 1, answer + 2, answer - 2]
  }

  // Hold feilsvarene i samme størrelsesorden som fasit.
  const max = Math.max(answer * 2 + 10, 20)
  const cleaned = clean(cands, answer, { min, max })
  // De to første (ti for mye/lite eller nabotabell) er mest lærerike: ta én av
  // dem alltid, resten trekkes.
  const first = cleaned.slice(0, 2)
  const rest = cleaned.slice(2)
  const picked = []
  if (first.length) picked.push(shuffle(first, rng)[0])
  for (const c of shuffle([...first.filter((x) => !picked.includes(x)), ...rest], rng)) {
    if (picked.length >= count) break
    if (!picked.includes(c)) picked.push(c)
  }
  return fill(picked, answer, count, { min, max })
}

// Fasit og feilsvar i tilfeldig rekkefølge.
export function makeOptions(answer, distractors, rng = Math.random) {
  return shuffle([answer, ...distractors], rng)
}

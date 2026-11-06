// Nøttehula: tenkenøtter i tre vanskelighetsgrader. Påvirker ikke nivået.
//  - tallmønster: hva kommer neste?
//  - magisk kvadrat: fyll inn tallet som mangler (alle rader/kolonner har samme sum)
//  - mini-sudoku 4 × 4: hvilket tall skal stå i ruta?
//  - «hvilket tall er jeg?»: gåte med to–tre hint
import { randInt, pick, shuffle } from '../rng.js'

export const GRADER = [
  { id: 1, navn: 'Lett', emoji: '🌰' },
  { id: 2, navn: 'Middels', emoji: '🥜' },
  { id: 3, navn: 'Vanskelig', emoji: '🌳' },
]

function tallmonster(grad, rng) {
  let seq, regel
  if (grad === 1) {
    const start = randInt(1, 10, rng)
    const d = pick([1, 2, 5, 10], rng)
    seq = [0, 1, 2, 3, 4].map((i) => start + i * d)
    regel = `Det øker med ${d} hver gang.`
  } else if (grad === 2) {
    const v = pick(['ned', 'dobling', 'hopp'], rng)
    if (v === 'ned') {
      const start = randInt(30, 60, rng)
      const d = pick([2, 3, 4, 5], rng)
      seq = [0, 1, 2, 3, 4].map((i) => start - i * d)
      regel = `Det minker med ${d} hver gang.`
    } else if (v === 'dobling') {
      const start = pick([1, 2, 3], rng)
      seq = [0, 1, 2, 3, 4].map((i) => start * 2 ** i)
      regel = 'Tallet dobles hver gang.'
    } else {
      const start = randInt(1, 5, rng)
      seq = [start]
      for (let i = 1; i < 5; i++) seq.push(seq[i - 1] + i + 1)
      regel = 'Hoppene blir ett lengre hver gang: +2, +3, +4, +5.'
    }
  } else {
    const v = pick(['fib', 'kvadrat', 'vekslende'], rng)
    if (v === 'fib') {
      const a = randInt(1, 3, rng)
      const b = randInt(1, 4, rng)
      seq = [a, b]
      for (let i = 2; i < 5; i++) seq.push(seq[i - 1] + seq[i - 2])
      regel = 'Hvert tall er summen av de to foran.'
    } else if (v === 'kvadrat') {
      const s = randInt(1, 4, rng)
      seq = [0, 1, 2, 3, 4].map((i) => (s + i) ** 2)
      regel = `Kvadrattall: ${s}·${s}, ${s + 1}·${s + 1} …`
    } else {
      const start = randInt(2, 9, rng)
      const d1 = pick([3, 4, 5], rng)
      const d2 = pick([1, 2], rng)
      seq = [start]
      for (let i = 1; i < 5; i++) seq.push(seq[i - 1] + (i % 2 === 1 ? d1 : -d2))
      regel = `Vekslende: +${d1}, −${d2}, +${d1}, −${d2} …`
    }
  }
  const answer = seq[4]
  return { type: 'tallmonster', form: 'tastatur', prompt: 'Hva kommer neste?', spoken: `Hva kommer neste? ${seq.slice(0, 4).join(', ')}`, visual: { kind: 'rekke', items: [...seq.slice(0, 4).map(String), '?'] }, answer, explain: `${regel} Neste er ${answer}.`, allowNegative: answer < 0 }
}

function magiskKvadrat(grad, rng) {
  // Lo Shu-kvadratet skalert og forskjøvet: alle rader, kolonner og diagonaler har samme sum.
  const base = [
    [2, 7, 6],
    [9, 5, 1],
    [4, 3, 8],
  ]
  const k = grad === 1 ? 1 : grad === 2 ? pick([1, 2], rng) : pick([2, 3], rng)
  const off = grad === 1 ? 0 : randInt(0, 5, rng)
  const rot = randInt(0, 3, rng)
  let m = base.map((r) => r.map((v) => v * k + off))
  for (let i = 0; i < rot; i++) m = m[0].map((_, c) => m.map((r) => r[c]).reverse())
  const sum = m[0].reduce((s, v) => s + v, 0)
  const hul = grad === 1 ? 1 : grad === 2 ? 2 : 3
  const cells = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8], rng)
  const skjult = cells.slice(0, hul)
  const spør = skjult[0]
  const grid = m.flat().map((v, i) => (skjult.includes(i) ? (i === spør ? '?' : '·') : String(v)))
  const r = Math.floor(spør / 3)
  const kjente = m[r].filter((_, c) => !skjult.includes(r * 3 + c))
  return {
    type: 'magisk_kvadrat',
    form: 'tastatur',
    prompt: `Magisk kvadrat: hver rad og kolonne har summen ${sum}. Hvilket tall skal stå der det er ?`,
    spoken: `Magisk kvadrat. Hver rad og kolonne har summen ${sum}. Hvilket tall skal stå i ruta med spørsmålstegn?`,
    visual: { kind: 'kvadrat', grid },
    answer: m[r][spør % 3],
    explain: kjente.length === 2 ? `Raden har ${kjente[0]} og ${kjente[1]}. ${sum} − ${kjente[0]} − ${kjente[1]} = ${m[r][spør % 3]}.` : `Bruk radene og kolonnene som bare mangler ett tall. Svaret er ${m[r][spør % 3]}.`,
  }
}

// Alle løsninger av et 4 × 4-sudoku gitt de viste tallene (null = tomt).
export function sudokuLosninger(grid, maks = 50) {
  const g = grid.slice()
  const out = []
  const ok = (i, v) => {
    const r = Math.floor(i / 4)
    const c = i % 4
    for (let k = 0; k < 4; k++) {
      if (g[r * 4 + k] === v || g[k * 4 + c] === v) return false
    }
    const br = Math.floor(r / 2) * 2
    const bc = Math.floor(c / 2) * 2
    for (let rr = br; rr < br + 2; rr++) for (let cc = bc; cc < bc + 2; cc++) if (g[rr * 4 + cc] === v) return false
    return true
  }
  const gaa = (i) => {
    if (out.length >= maks) return
    while (i < 16 && g[i]) i++
    if (i === 16) {
      out.push(g.slice())
      return
    }
    for (let v = 1; v <= 4; v++) {
      if (ok(i, v)) {
        g[i] = v
        gaa(i + 1)
        g[i] = null
      }
    }
  }
  gaa(0)
  return out
}

function sudoku4(grad, rng) {
  const base = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1],
  ]
  const hul = grad === 1 ? 4 : grad === 2 ? 7 : 9
  for (let forsok = 0; forsok < 40; forsok++) {
    const perm = shuffle([1, 2, 3, 4], rng)
    let g = base.map((r) => r.map((v) => perm[v - 1]))
    if (rng() < 0.5) g = [g[1], g[0], g[3], g[2]]
    if (rng() < 0.5) g = g.map((r) => [r[1], r[0], r[3], r[2]])
    const flat = g.flat()
    const cells = shuffle(Array.from({ length: 16 }, (_, i) => i), rng)
    const skjult = cells.slice(0, hul)
    const vist = flat.map((v, i) => (skjult.includes(i) ? null : v))
    const losninger = sudokuLosninger(vist)
    // Spør bare om en rute der alle løsninger har samme tall.
    const entydige = skjult.filter((i) => losninger.every((l) => l[i] === losninger[0][i]))
    if (!entydige.length) continue
    const spør = pick(entydige, rng)
    const grid = flat.map((v, i) => (skjult.includes(i) ? (i === spør ? '?' : '·') : String(v)))
    const r = Math.floor(spør / 4)
    const c = spør % 4
    return {
      type: 'sudoku4',
      form: 'valg',
      prompt: 'Mini-sudoku: hvert tall 1–4 skal stå én gang i hver rad, kolonne og boks. Hva skal stå der det er ?',
      spoken: 'Mini-sudoku. Hvert tall fra 1 til 4 skal stå én gang i hver rad, kolonne og boks. Hva skal stå i ruta med spørsmålstegn?',
      visual: { kind: 'sudoku', grid },
      answer: flat[spør],
      options: [1, 2, 3, 4],
      explain: `I rad ${r + 1} og kolonne ${c + 1} mangler ${flat[spør]}.`,
      vist,
    }
  }
  // Reserve: få hull, alltid entydig.
  return sudoku4(1, rng)
}

function hvilketTall(grad, rng) {
  const maks = grad === 1 ? 20 : grad === 2 ? 50 : 100
  for (let forsøk = 0; forsøk < 200; forsøk++) {
    const n = randInt(grad === 1 ? 2 : 10, maks, rng)
    const hint = []
    const lo = Math.max(1, n - randInt(2, 6, rng))
    const hi = n + randInt(2, 6, rng)
    hint.push(`Jeg er større enn ${lo} og mindre enn ${hi}.`)
    hint.push(n % 2 === 0 ? 'Jeg er et partall.' : 'Jeg er et oddetall.')
    if (grad >= 2) {
      const d = pick([3, 4, 5], rng)
      hint.push(n % d === 0 ? `Du kan dele meg på ${d}.` : `Du kan ikke dele meg på ${d}.`)
    }
    if (grad === 3 && n >= 10) hint.push(`Sifrene mine blir ${String(n).split('').reduce((s, x) => s + Number(x), 0)} til sammen.`)
    // Sjekk at bare ett tall passer.
    const kandidater = []
    for (let k = lo + 1; k < hi; k++) {
      if ((k % 2 === 0) !== (n % 2 === 0)) continue
      if (grad >= 2) {
        const d = Number(hint[2].match(/\d+/)[0])
        if ((k % d === 0) !== (n % d === 0)) continue
      }
      if (grad === 3 && n >= 10) {
        const sum = String(k).split('').reduce((s, x) => s + Number(x), 0)
        if (sum !== String(n).split('').reduce((s, x) => s + Number(x), 0)) continue
      }
      kandidater.push(k)
    }
    if (kandidater.length === 1) {
      return { type: 'hvilket_tall', form: 'tastatur', prompt: `Hvilket tall er jeg? ${hint.join(' ')}`, spoken: `Hvilket tall er jeg? ${hint.join(' ')}`, visual: { kind: 'ikon', emoji: '🕵️' }, answer: n, explain: `Bare ${n} passer til alle hintene.` }
    }
  }
  return { type: 'hvilket_tall', form: 'tastatur', prompt: 'Hvilket tall er jeg? Jeg er større enn 6 og mindre enn 9, og jeg er et partall.', spoken: 'Hvilket tall er jeg? Jeg er større enn 6 og mindre enn 9, og jeg er et partall.', visual: { kind: 'ikon', emoji: '🕵️' }, answer: 8, explain: 'Mellom 6 og 9 er bare 8 et partall.' }
}

export const NOTT_TYPER = { tallmonster, magisk_kvadrat: magiskKvadrat, sudoku4, hvilket_tall: hvilketTall }

export function lagNoetter(grad, n = 4, rng = Math.random) {
  const typer = shuffle(Object.keys(NOTT_TYPER), rng)
  const out = []
  for (let i = 0; i < n; i++) {
    const t = typer[i % typer.length]
    out.push({ ...NOTT_TYPER[t](grad, rng), nivaa: 0, svarform: 'tastatur', tag: 'nott' })
  }
  return out
}

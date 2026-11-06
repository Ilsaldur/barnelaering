// Det blå havet (7–14) og Det høye fjellet (15–22): pluss og minus med
// talltastatur, tiervenner, tierovergang, tall til 100, åpne oppgaver,
// dobling og halvering, penger og enkle tekstoppgaver.
import { EMOJIS, valg, tast, santUsant, naer, regneFeil, apen, randInt, pick, shuffle, fmt } from './felles.js'

function plussTask(type, a, b, rng, extra = {}) {
  const em = pick(EMOJIS, rng)
  return tast(
    {
      type,
      prompt: `${a} + ${b} = ?`,
      spoken: `${a} pluss ${b}?`,
      hjelp: a + b <= 20 ? { kind: 'pluss', a, b, emoji: em.e } : { kind: 'tiere', a, b, op: 'add' },
      explain: extra.explain || `${a} + ${b} = ${a + b}.`,
      ...extra,
    },
    a + b,
  )
}
function minusTask(type, a, b, rng, extra = {}) {
  const em = pick(EMOJIS, rng)
  return tast(
    {
      type,
      prompt: `${a} − ${b} = ?`,
      spoken: `${a} minus ${b}?`,
      hjelp: a <= 20 ? { kind: 'minus', a, b, emoji: em.e } : { kind: 'tiere', a, b, op: 'sub' },
      explain: extra.explain || `${a} − ${b} = ${a - b}.`,
      ...extra,
    },
    a - b,
  )
}

// Tosifret ± ensifret/tosifret, med eller uten tierovergang.
function pair(rng, { aMin, aMax, bMin, bMax, carry, op }) {
  for (let i = 0; i < 500; i++) {
    const a = randInt(aMin, aMax, rng)
    const b = randInt(bMin, bMax, rng)
    if (op === 'add') {
      const hasCarry = (a % 10) + (b % 10) >= 10
      if (hasCarry === carry && a + b <= 100) return [a, b]
    } else {
      if (b > a) continue
      const hasBorrow = a % 10 < b % 10
      if (hasBorrow === carry) return [a, b]
    }
  }
  return op === 'add' ? [carry ? 47 : 43, 5] : [carry ? 52 : 48, 6]
}

export const GEN_HAV_FJELL = {
  // Nivå 7–8: pluss og minus innenfor 10 med tastatur, ukjent på ulike plasser.
  pluss_innen_10: ({ max = 10 }, rng) => {
    const a = randInt(1, max - 1, rng)
    const b = randInt(1, max - a, rng)
    return plussTask('pluss_innen_10', a, b, rng, { explain: `${a} + ${b} = ${a + b}. Tell ${b} videre fra ${a}.` })
  },
  pluss_apen: ({ max = 10 }, rng) => {
    const c = randInt(2, max, rng)
    const a = randInt(1, c - 1, rng)
    const b = c - a
    const hole = rng() < 0.5 ? 0 : 1
    const { text, spoken } = apen(a, 'add', b, c, hole)
    return tast(
      { type: 'pluss_apen', prompt: text, spoken: `${spoken}. Hva er det ukjente tallet?`, hjelp: { kind: 'tallinje', from: 0, to: 20, start: hole === 0 ? b : a }, explain: `${c} − ${hole === 0 ? b : a} = ${hole === 0 ? a : b}, så ${a} + ${b} = ${c}.` },
      hole === 0 ? a : b,
    )
  },
  minus_innen_10: ({ max = 10 }, rng) => {
    const a = randInt(2, max, rng)
    const b = randInt(1, a - 1, rng)
    return minusTask('minus_innen_10', a, b, rng, { explain: `${a} − ${b} = ${a - b}. Tell ${b} bakover fra ${a}.` })
  },
  minus_apen: ({ max = 10 }, rng) => {
    const a = randInt(2, max, rng)
    const b = randInt(1, a - 1, rng)
    const c = a - b
    const { text, spoken } = apen(a, 'sub', b, c, 1)
    return tast({ type: 'minus_apen', prompt: text, spoken: `${spoken}. Hva er det ukjente tallet?`, hjelp: { kind: 'tallinje', from: 0, to: 20, start: a }, explain: `${a} − ${c} = ${b}, så ${a} − ${b} = ${c}.` }, b)
  },

  // Nivå 9: tiervenner og dobling.
  tiervenner: ({ a: fixed } = {}, rng) => {
    const a = fixed != null ? fixed : randInt(1, 9, rng)
    const { text, spoken } = apen(a, 'add', 10 - a, 10, 1)
    return tast(
      { type: 'tiervenner', kortId: `tiervenner:${a}`, prompt: text, spoken: `${a} pluss hva er 10?`, hjelp: { kind: 'tiervenner', a }, explain: `${a} og ${10 - a} er tiervenner: ${a} + ${10 - a} = 10.` },
      10 - a,
    )
  },
  dobling: ({ max = 10 }, rng) => {
    const a = randInt(1, max, rng)
    const spør = rng() < 0.5
    return tast(
      {
        type: 'dobling',
        prompt: spør ? `Hva er dobbelt av ${a}?` : `${a} + ${a} = ?`,
        spoken: spør ? `Hva er dobbelt av ${a}?` : `${a} pluss ${a}?`,
        hjelp: { kind: 'pluss', a, b: a, emoji: '🔵' },
        explain: `Dobbelt av ${a} er ${a} + ${a} = ${2 * a}.`,
      },
      2 * a,
    )
  },

  // Nivå 10: tallene 11–20 som tiere og enere.
  tiere_enere_20: (_, rng) => {
    const e = randInt(1, 9, rng)
    const v = pick(['pluss', 'minus', 'navn'], rng)
    if (v === 'pluss') return tast({ type: 'tiere_enere_20', prompt: `10 + ${e} = ?`, spoken: `10 pluss ${e}?`, hjelp: { kind: 'tiere', a: 10, b: e, op: 'add' }, explain: `10 og ${e} enere er ${10 + e}.` }, 10 + e)
    if (v === 'minus') return tast({ type: 'tiere_enere_20', prompt: `${10 + e} − ${e} = ?`, spoken: `${10 + e} minus ${e}?`, hjelp: { kind: 'tiere', a: 10 + e, b: e, op: 'sub' }, explain: `${10 + e} er 10 og ${e}. Tar vi bort ${e}, står 10 igjen.` }, 10)
    return tast({ type: 'tiere_enere_20', prompt: `1 tier og ${e} enere = ?`, spoken: `Én tier og ${e} enere. Hvilket tall er det?`, hjelp: { kind: 'tiere', a: 10, b: e, op: 'add' }, explain: `1 tier er 10, og ${e} enere er ${e}: ${10 + e}.` }, 10 + e)
  },

  // Nivå 11–13: innenfor 20.
  pluss_uten_overgang_20: (_, rng) => {
    const a = randInt(10, 18, rng)
    const rom = 9 - (a % 10)
    const b = randInt(1, Math.max(1, rom), rng)
    return plussTask('pluss_uten_overgang_20', a, b, rng, { explain: `Bare enerne endrer seg: ${a % 10} + ${b} = ${(a % 10) + b}, så ${a + b}.` })
  },
  minus_uten_overgang_20: (_, rng) => {
    const a = randInt(11, 19, rng)
    const b = randInt(1, a % 10, rng)
    return minusTask('minus_uten_overgang_20', a, b, rng, { explain: `Bare enerne endrer seg: ${a % 10} − ${b} = ${(a % 10) - b}, så ${a - b}.` })
  },
  pluss_tierovergang: (_, rng) => {
    const a = randInt(5, 9, rng)
    const b = randInt(10 - a + 1, 9, rng)
    const til10 = 10 - a
    return plussTask('pluss_tierovergang', a, b, rng, { explain: `Fyll opp til 10 først: ${a} + ${til10} = 10, og så ${b - til10} til: ${a + b}.` })
  },
  minus_tierovergang: (_, rng) => {
    const a = randInt(11, 18, rng)
    const b = randInt(a % 10 + 1, 9, rng)
    const ned = a - 10
    return minusTask('minus_tierovergang', a, b, rng, { explain: `Gå ned til 10 først: ${a} − ${ned} = 10, og så ${b - ned} til: ${a - b}.` })
  },

  // Nivå 14: partall og oddetall, telle med 2, 5 og 10.
  partall_oddetall: ({ max = 100 }, rng) => {
    const n = randInt(1, max, rng)
    const spørPartall = rng() < 0.5
    const erPartall = n % 2 === 0
    if (rng() < 0.5) {
      return santUsant(
        { type: 'partall_oddetall', prompt: `Sant eller usant: ${n} er et ${spørPartall ? 'partall' : 'oddetall'}?`, spoken: `Sant eller usant: ${n} er et ${spørPartall ? 'partall' : 'oddetall'}?`, visual: { kind: 'stor', text: String(n) }, explain: `${n} er et ${erPartall ? 'partall' : 'oddetall'}, fordi det ender på ${n % 10}.` },
        spørPartall === erPartall,
      )
    }
    return {
      type: 'partall_oddetall',
      form: 'valg',
      prompt: `Er ${n} et partall eller et oddetall?`,
      spoken: `Er ${n} et partall eller et oddetall?`,
      visual: { kind: 'stor', text: String(n) },
      explain: `${n} er et ${erPartall ? 'partall' : 'oddetall'}, fordi det ender på ${n % 10}.`,
      answer: erPartall ? 'Partall' : 'Oddetall',
      options: ['Partall', 'Oddetall'],
    }
  },
  telle_med: ({ steps = [2, 5, 10], max = 100 }, rng) => {
    const step = pick(steps, rng)
    const len = 5
    const maxStart = max - step * (len - 1)
    const start = step * randInt(0, Math.floor(maxStart / step), rng)
    const hole = randInt(1, len - 1, rng)
    const seq = Array.from({ length: len }, (_, i) => start + i * step)
    const answer = seq[hole]
    const items = seq.map((v, i) => (i === hole ? '?' : String(v)))
    return tast(
      { type: 'telle_med', prompt: 'Hvilket tall mangler?', spoken: `Vi teller med ${step}. Hvilket tall mangler? ${items.map((x) => (x === '?' ? 'hva' : x)).join(', ')}`, visual: { kind: 'rekke', items }, explain: `Vi teller med ${step}: ${seq[hole - 1]}, ${answer}${seq[hole + 1] != null ? `, ${seq[hole + 1]}` : ''}.` },
      answer,
    )
  },

  // Nivå 15: tall til 100.
  tiere_enere_100: (_, rng) => {
    const t = randInt(1, 9, rng)
    const e = randInt(0, 9, rng)
    const n = t * 10 + e
    if (rng() < 0.5) return tast({ type: 'tiere_enere_100', prompt: `${t} tiere og ${e} enere = ?`, spoken: `${t} tiere og ${e} enere. Hvilket tall er det?`, hjelp: { kind: 'tiere', a: t * 10, b: e, op: 'add' }, explain: `${t} tiere er ${t * 10}, pluss ${e} enere: ${n}.` }, n)
    const spørTiere = rng() < 0.5
    return tast({ type: 'tiere_enere_100', prompt: `Hvor mange ${spørTiere ? 'tiere' : 'enere'} er det i ${n}?`, spoken: `Hvor mange ${spørTiere ? 'tiere' : 'enere'} er det i ${n}?`, visual: { kind: 'stor', text: String(n) }, explain: `${n} er ${t} tiere og ${e} enere.` }, spørTiere ? t : e)
  },
  tallinje_100: (_, rng) => {
    const n = randInt(1, 99, rng)
    return valg(
      { type: 'tallinje_100', prompt: 'Hvilket tall peker pila på?', spoken: 'Hvilket tall peker pila på?', visual: { kind: 'tallinje', from: 0, to: 100, step: 10, marker: n }, explain: `Pila står på ${n}: mellom ${Math.floor(n / 10) * 10} og ${Math.floor(n / 10) * 10 + 10}.` },
      n,
      [n + 10, n - 10, n + 1, n - 1, Number(String(n).split('').reverse().join(''))].filter((x) => x > 0 && x < 100 && x !== n).slice(0, 3),
      rng,
    )
  },
  storre_mindre_100: (_, rng) => {
    const a = randInt(10, 99, rng)
    let b = randInt(10, 99, rng)
    while (b === a) b = randInt(10, 99, rng)
    if (rng() < 0.5) {
      const mer = rng() < 0.5
      return santUsant({ type: 'storre_mindre_100', prompt: `Sant eller usant: ${a} ${mer ? '>' : '<'} ${b}?`, spoken: `Sant eller usant: ${a} er ${mer ? 'større' : 'mindre'} enn ${b}?`, visual: { kind: 'stor', text: `${a} ${mer ? '>' : '<'} ${b}` }, explain: `${a} er ${a > b ? 'større' : 'mindre'} enn ${b}. Se på tierne først.` }, mer ? a > b : a < b)
    }
    const big = rng() < 0.5
    return { type: 'storre_mindre_100', form: 'valg', prompt: big ? 'Hvilket tall er størst?' : 'Hvilket tall er minst?', spoken: `${big ? 'Hvilket tall er størst' : 'Hvilket tall er minst'}: ${a} eller ${b}?`, visual: { kind: 'stor', text: `${a}   ${b}` }, explain: `Se på tierne først. ${big ? Math.max(a, b) : Math.min(a, b)} er ${big ? 'størst' : 'minst'}.`, answer: big ? Math.max(a, b) : Math.min(a, b), options: shuffle([a, b], rng) }
  },

  // Nivå 16: hele tiere og ti mer/mindre.
  hele_tiere: (_, rng) => {
    const op = rng() < 0.5 ? 'add' : 'sub'
    if (op === 'add') {
      const a = 10 * randInt(1, 8, rng)
      const b = 10 * randInt(1, (100 - a) / 10, rng)
      return plussTask('hele_tiere', a, b, rng, { explain: `${a / 10} tiere + ${b / 10} tiere = ${(a + b) / 10} tiere = ${a + b}.` })
    }
    const a = 10 * randInt(2, 10, rng)
    const b = 10 * randInt(1, a / 10 - 1, rng)
    return minusTask('hele_tiere', a, b, rng, { explain: `${a / 10} tiere − ${b / 10} tiere = ${(a - b) / 10} tiere = ${a - b}.` })
  },
  ti_mer_mindre: (_, rng) => {
    const n = randInt(11, 89, rng)
    const mer = rng() < 0.5
    const answer = mer ? n + 10 : n - 10
    return tast({ type: 'ti_mer_mindre', prompt: mer ? `${n} + 10 = ?` : `${n} − 10 = ?`, spoken: mer ? `Hva er ti mer enn ${n}?` : `Hva er ti mindre enn ${n}?`, hjelp: { kind: 'tiere', a: n, b: 10, op: mer ? 'add' : 'sub' }, explain: `Bare tieren endrer seg: ${n} blir ${answer}.` }, answer)
  },

  // Nivå 17–20: tosifret pluss/minus.
  tosifret_ensifret_uten: (_, rng) => {
    const op = rng() < 0.5 ? 'add' : 'sub'
    const [a, b] = pair(rng, { aMin: 11, aMax: 89, bMin: 1, bMax: 8, carry: false, op })
    return op === 'add' ? plussTask('tosifret_ensifret_uten', a, b, rng, { explain: `Bare enerne endrer seg: ${a % 10} + ${b} = ${(a % 10) + b}, så ${a + b}.` }) : minusTask('tosifret_ensifret_uten', a, b, rng, { explain: `Bare enerne endrer seg: ${a % 10} − ${b} = ${(a % 10) - b}, så ${a - b}.` })
  },
  tosifret_ensifret_med: (_, rng) => {
    const op = rng() < 0.5 ? 'add' : 'sub'
    const [a, b] = pair(rng, { aMin: 11, aMax: 89, bMin: 2, bMax: 9, carry: true, op })
    if (op === 'add') {
      const til = 10 - (a % 10)
      if (b === til) return plussTask('tosifret_ensifret_med', a, b, rng, { explain: `${a} + ${b} fyller akkurat opp til neste tier: ${a + b}.` })
      return plussTask('tosifret_ensifret_med', a, b, rng, { explain: `Fyll opp til neste tier: ${a} + ${til} = ${a + til}, og så ${b - til} til: ${a + b}.` })
    }
    const ned = a % 10
    if (ned === 0) return minusTask('tosifret_ensifret_med', a, b, rng, { explain: `Ta en hel tier: ${a} − 10 = ${a - 10}, og så ${10 - b} tilbake: ${a - b}.` })
    return minusTask('tosifret_ensifret_med', a, b, rng, { explain: `Gå ned til tieren: ${a} − ${ned} = ${a - ned}, og så ${b - ned} til: ${a - b}.` })
  },
  tosifret_tosifret_uten: (_, rng) => {
    const op = rng() < 0.5 ? 'add' : 'sub'
    const [a, b] = pair(rng, { aMin: 11, aMax: 88, bMin: 11, bMax: 88, carry: false, op })
    return op === 'add' ? plussTask('tosifret_tosifret_uten', a, b, rng, { explain: `Tiere: ${Math.floor(a / 10)} + ${Math.floor(b / 10)} = ${Math.floor(a / 10) + Math.floor(b / 10)}. Enere: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}. Til sammen ${a + b}.` }) : minusTask('tosifret_tosifret_uten', a, b, rng, { explain: `Tiere: ${Math.floor(a / 10)} − ${Math.floor(b / 10)} = ${Math.floor(a / 10) - Math.floor(b / 10)}. Enere: ${a % 10} − ${b % 10} = ${(a % 10) - (b % 10)}. Svar ${a - b}.` })
  },
  tosifret_tosifret_med: (_, rng) => {
    const op = rng() < 0.5 ? 'add' : 'sub'
    const [a, b] = pair(rng, { aMin: 12, aMax: 88, bMin: 12, bMax: 88, carry: true, op })
    if (op === 'add') return plussTask('tosifret_tosifret_med', a, b, rng, { explain: `${a} + ${Math.floor(b / 10) * 10} = ${a + Math.floor(b / 10) * 10}, og så + ${b % 10} = ${a + b}.` })
    return minusTask('tosifret_tosifret_med', a, b, rng, { explain: `${a} − ${Math.floor(b / 10) * 10} = ${a - Math.floor(b / 10) * 10}, og så − ${b % 10} = ${a - b}.` })
  },

  // Nivå 21: åpne oppgaver og likhetstegn.
  apen_oppgave: (_, rng) => {
    const op = rng() < 0.5 ? 'add' : 'sub'
    if (op === 'add') {
      const c = randInt(20, 100, rng)
      const a = randInt(1, c - 1, rng)
      const b = c - a
      const hole = rng() < 0.5 ? 0 : 1
      const { text, spoken } = apen(a, 'add', b, c, hole)
      return tast({ type: 'apen_oppgave', prompt: text, spoken: `${spoken}. Hva er det ukjente tallet?`, hjelp: { kind: 'tiere', a: c, b: hole === 0 ? b : a, op: 'sub' }, explain: `Det ukjente er ${c} − ${hole === 0 ? b : a} = ${hole === 0 ? a : b}.` }, hole === 0 ? a : b)
    }
    const a = randInt(20, 100, rng)
    const b = randInt(1, a - 1, rng)
    const c = a - b
    const hole = rng() < 0.5 ? 0 : 1
    const { text, spoken } = apen(a, 'sub', b, c, hole)
    const answer = hole === 0 ? a : b
    return tast({ type: 'apen_oppgave', prompt: text, spoken: `${spoken}. Hva er det ukjente tallet?`, explain: hole === 0 ? `Det ukjente er ${b} + ${c} = ${a}.` : `Det ukjente er ${a} − ${c} = ${b}.` }, answer)
  },
  likhetstegn: (_, rng) => {
    const a = randInt(2, 15, rng)
    const b = randInt(2, 15, rng)
    const c = randInt(1, a + b - 1, rng)
    const d = a + b - c
    if (rng() < 0.5) {
      return tast({ type: 'likhetstegn', prompt: `${a} + ${b} = ? + ${d}`, spoken: `${a} pluss ${b} er lik hva pluss ${d}?`, explain: `Begge sider skal være like. ${a} + ${b} = ${a + b}, og ${a + b} − ${d} = ${c}.` }, c)
    }
    const feil = rng() < 0.5
    const dd = feil ? d + pick([-2, -1, 1, 2], rng) : d
    return santUsant({ type: 'likhetstegn', prompt: `Sant eller usant: ${a} + ${b} = ${c} + ${dd}?`, spoken: `Sant eller usant: ${a} pluss ${b} er lik ${c} pluss ${dd}?`, explain: `Venstre side er ${a + b}, høyre side er ${c + dd}. ${a + b === c + dd ? 'De er like.' : 'De er ikke like.'}` }, a + b === c + dd)
  },

  // Nivå 22: dobling og halvering til 100, penger, enkle tekstoppgaver.
  dobling_halvering_100: (_, rng) => {
    if (rng() < 0.5) {
      const a = randInt(6, 50, rng)
      return tast({ type: 'dobling_halvering_100', prompt: `Hva er dobbelt av ${a}?`, spoken: `Hva er dobbelt av ${a}?`, explain: `Dobbelt av ${a} er ${a} + ${a} = ${2 * a}.` }, 2 * a)
    }
    const a = 2 * randInt(6, 50, rng)
    return tast({ type: 'dobling_halvering_100', prompt: `Hva er halvparten av ${a}?`, spoken: `Hva er halvparten av ${a}?`, explain: `Halvparten av ${a} er ${a / 2}, fordi ${a / 2} + ${a / 2} = ${a}.` }, a / 2)
  },
  penger: (_, rng) => {
    const varer = [
      ['en is', 25],
      ['en bolle', 20],
      ['en saft', 15],
      ['en bok', 60],
      ['et viskelær', 10],
      ['en ball', 45],
    ]
    const [navn, pris] = pick(varer, rng)
    const har = pick([50, 100, 70, 80], rng)
    if (har < pris) return tast({ type: 'penger', prompt: `Du har ${pris - 5} kr og ${navn} koster ${pris} kr. Hvor mye mangler du?`, spoken: `Du har ${pris - 5} kroner og ${navn} koster ${pris} kroner. Hvor mye mangler du?`, explain: `${pris} − ${pris - 5} = 5 kr.` }, 5, { unit: 'kr' })
    return tast({ type: 'penger', prompt: `Du har ${har} kr og kjøper ${navn} til ${pris} kr. Hvor mye har du igjen?`, spoken: `Du har ${har} kroner og kjøper ${navn} til ${pris} kroner. Hvor mye har du igjen?`, explain: `${har} − ${pris} = ${har - pris} kr.` }, har - pris, { unit: 'kr' })
  },
  tekst_enkel: (_, rng) => {
    const em = pick(EMOJIS, rng)
    const a = randInt(3, 40, rng)
    const b = randInt(2, 30, rng)
    const v = pick(['faar', 'mister', 'tilsammen'], rng)
    if (v === 'faar') return tast({ type: 'tekst_enkel', prompt: `Du har ${a} ${em.navn} og får ${b} til. Hvor mange har du nå?`, spoken: `Du har ${a} ${em.navn} og får ${b} til. Hvor mange har du nå?`, visual: { kind: 'ikon', emoji: em.e }, explain: `${a} + ${b} = ${a + b}.` }, a + b)
    if (v === 'mister') {
      const big = Math.max(a, b)
      const small = Math.min(a, b)
      return tast({ type: 'tekst_enkel', prompt: `Du har ${big} ${em.navn} og gir bort ${small}. Hvor mange har du igjen?`, spoken: `Du har ${big} ${em.navn} og gir bort ${small}. Hvor mange har du igjen?`, visual: { kind: 'ikon', emoji: em.e }, explain: `${big} − ${small} = ${big - small}.` }, big - small)
    }
    return tast({ type: 'tekst_enkel', prompt: `Ida har ${a} ${em.navn} og Noah har ${b}. Hvor mange har de til sammen?`, spoken: `Ida har ${a} ${em.navn} og Noah har ${b}. Hvor mange har de til sammen?`, visual: { kind: 'ikon', emoji: em.e }, explain: `${a} + ${b} = ${a + b}.` }, a + b)
  },
}

export { fmt }

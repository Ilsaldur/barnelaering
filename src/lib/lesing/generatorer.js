// Oppgavegeneratorer for lesestigen. Samme oppgaveform som matte
// (valg, santusant, skriv), så Oppdrag/TaskCard brukes uendret.
import { randInt, pick, shuffle } from '../rng.js'
import { registerTypeLabels } from '../labels.js'
import { BOKSTAVER, LYDRETTE_ORD, VANLIGE_ORD, SETNINGER, TEKSTER, RETTSKRIVING, ORDKLASSER, ORDKLASSE_NAVN, BOYING, MOTSETNINGER, TEGNSETTING, STOR_BOKSTAV } from '../../data/lesing/innhold.js'

function valgFra(answer, pool, n, rng) {
  const others = shuffle(
    pool.filter((x) => x !== answer),
    rng,
  ).slice(0, n - 1)
  return shuffle([answer, ...others], rng)
}

function kjente(antall) {
  return BOKSTAVER.slice(0, Math.min(antall, BOKSTAVER.length))
}

// Ord som bare bruker bokstavene barnet har lært (og er korte nok).
function ordFor(maks, antallBokstaver = BOKSTAVER.length) {
  const lov = new Set(kjente(antallBokstaver).map((b) => b.b))
  return LYDRETTE_ORD.filter((o) => o.ord.length <= maks && [...o.ord].every((c) => lov.has(c)))
}

function antallOrd(tekst) {
  return tekst.trim().split(/\s+/).length
}

export const GEN_LESING = {
  // Hør lyden, finn bokstaven (stor eller liten).
  lyd_finn_bokstav: ({ antall = 7 }, rng) => {
    const pool = kjente(antall)
    const b = pick(pool, rng)
    const stor = rng() < 0.5
    const vis = (x) => (stor ? x.toUpperCase() : x)
    return {
      type: 'lyd_finn_bokstav',
      form: 'valg',
      prompt: 'Hvilken bokstav hører du?',
      spoken: `Hvilken bokstav sier ${b.lyd}? Som i ${b.ord}.`,
      visual: { kind: 'ikon', emoji: b.emoji },
      answer: vis(b.b),
      options: valgFra(b.b, pool.map((x) => x.b), 4, rng).map(vis),
      explain: `${b.ord} begynner med ${vis(b.b)}.`,
      stor: true,
    }
  },
  // Hvilken bokstav begynner ordet på?
  forste_lyd: ({ antall = 7 }, rng) => {
    const pool = kjente(antall)
    const b = pick(pool, rng)
    return {
      type: 'forste_lyd',
      form: 'valg',
      prompt: 'Hvilken bokstav begynner ordet på?',
      spoken: `Hvilken bokstav begynner ${b.ord} på?`,
      visual: { kind: 'ikon', emoji: b.emoji, tekst: b.ord },
      answer: b.b,
      options: valgFra(b.b, pool.map((x) => x.b), 4, rng),
      explain: `${b.ord} begynner med ${b.b}.`,
      stor: true,
    }
  },
  // Stor og liten bokstav hører sammen.
  stor_liten: ({ antall = 7 }, rng) => {
    const pool = kjente(antall)
    const b = pick(pool, rng)
    const spørLiten = rng() < 0.5
    const answer = spørLiten ? b.b : b.b.toUpperCase()
    const vist = spørLiten ? b.b.toUpperCase() : b.b
    return {
      type: 'stor_liten',
      form: 'valg',
      prompt: `Hvilken ${spørLiten ? 'liten' : 'stor'} bokstav hører sammen med ${vist}?`,
      spoken: `Her er ${spørLiten ? 'stor' : 'liten'} ${b.b}. Finn den ${spørLiten ? 'lille' : 'store'} bokstaven som hører sammen med den.`,
      visual: { kind: 'bokstav', tekst: vist },
      answer,
      options: valgFra(b.b, pool.map((x) => x.b), 4, rng).map((x) => (spørLiten ? x : x.toUpperCase())),
      explain: `${b.b.toUpperCase()} og ${b.b} er samme bokstav.`,
      stor: true,
    }
  },
  // Lydene leses én og én: hvilket bilde blir det?
  lydering_bilde: ({ maks = 3 }, rng) => {
    const pool = ordFor(maks)
    const o = pick(pool, rng)
    const others = shuffle(LYDRETTE_ORD.filter((x) => x.ord !== o.ord), rng).slice(0, 3)
    return {
      type: 'lydering_bilde',
      form: 'valg',
      prompt: 'Trekk lydene sammen. Hvilket bilde passer?',
      spoken: `Hør lydene: ${[...o.ord].join(', ')}. Hvilket ord blir det?`,
      visual: { kind: 'lyder', bokstaver: [...o.ord] },
      answer: o.emoji,
      options: shuffle([o.emoji, ...others.map((x) => x.emoji)], rng),
      explain: `${[...o.ord].join('-')} blir ${o.ord}.`,
      stor: true,
    }
  },
  // Les ordet, finn bildet.
  les_ord_bilde: ({ maks = 5 }, rng) => {
    const pool = ordFor(maks)
    const o = pick(pool, rng)
    const others = shuffle(LYDRETTE_ORD.filter((x) => x.ord !== o.ord), rng).slice(0, 3)
    return {
      type: 'les_ord_bilde',
      form: 'valg',
      prompt: 'Les ordet. Hvilket bilde passer?',
      spoken: 'Les ordet. Hvilket bilde passer?',
      visual: { kind: 'ordkort', tekst: o.ord },
      answer: o.emoji,
      options: shuffle([o.emoji, ...others.map((x) => x.emoji)], rng),
      explain: `Det står ${o.ord}.`,
      stor: true,
    }
  },
  // Se bildet, finn ordet.
  bilde_ord: ({ maks = 5 }, rng) => {
    const pool = ordFor(maks)
    const o = pick(pool, rng)
    const others = shuffle(pool.filter((x) => x.ord !== o.ord), rng).slice(0, 3)
    return {
      type: 'bilde_ord',
      form: 'valg',
      prompt: 'Hvilket ord passer til bildet?',
      spoken: `Hvilket ord er ${o.ord}?`,
      visual: { kind: 'ikon', emoji: o.emoji },
      answer: o.ord,
      options: shuffle([o.ord, ...others.map((x) => x.ord)], rng),
      explain: `Bildet viser ${o.ord}: ${[...o.ord].join('-')}.`,
    }
  },
  // Vanlige ord: hør ordet, finn det skrevet.
  vanlig_ord: (_, rng) => {
    const w = pick(VANLIGE_ORD, rng)
    return {
      type: 'vanlig_ord',
      form: 'valg',
      prompt: 'Hvilket ord hører du?',
      spoken: `Finn ordet: ${w}. ${w}.`,
      visual: { kind: 'ikon', emoji: '👂' },
      answer: w,
      options: valgFra(w, VANLIGE_ORD, 4, rng),
      explain: `Ordet var «${w}».`,
      hørOrd: w,
    }
  },
  // Setning → bilde.
  setning_bilde: (_, rng) => {
    const s = pick(SETNINGER, rng)
    return {
      type: 'setning_bilde',
      form: 'valg',
      prompt: s.tekst,
      spoken: `Les setningen og finn bildet som passer. ${s.tekst}`,
      visual: null,
      answer: s.svar,
      options: shuffle([s.svar, ...s.feil], rng),
      explain: `«${s.tekst}» passer til ${s.svar}.`,
      stor: true,
    }
  },
  // Tekst med spørsmål.
  tekst_sporsmaal: ({ maksOrd = 80 }, rng) => {
    const pool = TEKSTER.filter((t) => antallOrd(t.tekst) <= maksOrd)
    const t = pick(pool.length ? pool : TEKSTER, rng)
    const q = pick(t.sporsmaal, rng)
    return {
      type: q.type === 'faktamening' ? 'fakta_mening' : 'tekst_sporsmaal',
      form: 'valg',
      prompt: q.q,
      spoken: `${t.tittel}. ${t.tekst} Spørsmål: ${q.q}`,
      visual: { kind: 'tekst', tittel: t.tittel, tekst: t.tekst },
      answer: q.svar,
      options: shuffle(q.alternativer, rng),
      explain: q.type === 'mening' ? 'Dette er et meningsspørsmål. Det viktigste er at du kan si hvorfor.' : q.type === 'faktamening' ? (q.svar === 'Fakta' ? 'Det er fakta: det kan sjekkes og er sant for alle.' : 'Det er en mening: noen kan mene noe annet.') : `Svaret står i teksten: «${q.svar}».`,
      tekstId: t.id,
    }
  },
  // Skriv ordet du hører.
  skriv_ord: ({ gruppe = 'diftonger' }, rng) => {
    const o = pick(RETTSKRIVING[gruppe] || RETTSKRIVING.diftonger, rng)
    return {
      type: `skriv_${gruppe}`,
      form: 'skriv',
      prompt: 'Skriv ordet du hører.',
      spoken: `Skriv ordet: ${o.ord}. ${o.ord}.`,
      visual: { kind: 'ikon', emoji: o.emoji },
      answer: o.ord,
      explain: `Ordet skrives «${o.ord}».`,
      hørOrd: o.ord,
    }
  },
  // Hvilket ord er riktig skrevet?
  riktig_skrevet: ({ gruppe = 'diftonger' }, rng) => {
    const o = pick(RETTSKRIVING[gruppe] || RETTSKRIVING.diftonger, rng)
    return {
      type: `skriv_${gruppe}`,
      form: 'valg',
      prompt: 'Hvilket ord er riktig skrevet?',
      spoken: `Hvilket ord er riktig skrevet? Ordet er ${o.ord}.`,
      visual: { kind: 'ikon', emoji: o.emoji },
      answer: o.ord,
      options: shuffle([o.ord, ...o.feil.slice(0, 3)], rng),
      explain: `Riktig er «${o.ord}».`,
    }
  },
  // Hva slags ord er …?
  ordklasse: (_, rng) => {
    const klasse = pick(Object.keys(ORDKLASSER), rng)
    const w = pick(ORDKLASSER[klasse], rng)
    const navn = { substantiv: 'Substantiv', verb: 'Verb', adjektiv: 'Adjektiv' }
    return {
      type: 'ordklasse',
      form: 'valg',
      prompt: `Hva slags ord er «${w}»?`,
      spoken: `Hva slags ord er ${w}? Substantiv, verb eller adjektiv?`,
      visual: { kind: 'ordkort', tekst: w },
      answer: navn[klasse],
      options: shuffle(Object.values(navn), rng),
      explain: `«${w}» er et ${ORDKLASSE_NAVN[klasse]}.`,
    }
  },
  // Hvilket ord er et verb?
  finn_ordklasse: (_, rng) => {
    const klasse = pick(Object.keys(ORDKLASSER), rng)
    const w = pick(ORDKLASSER[klasse], rng)
    const andre = Object.keys(ORDKLASSER).filter((k) => k !== klasse)
    const feil = shuffle(andre.flatMap((k) => ORDKLASSER[k]), rng).slice(0, 3)
    return {
      type: 'ordklasse',
      form: 'valg',
      prompt: `Hvilket ord er et ${klasse}?`,
      spoken: `Hvilket ord er et ${klasse}?`,
      answer: w,
      options: shuffle([w, ...feil], rng),
      explain: `«${w}» er et ${ORDKLASSE_NAVN[klasse]}.`,
    }
  },
  // Bøying.
  boying: (_, rng) => {
    const b = pick(BOYING, rng)
    return {
      type: 'boying',
      form: 'valg',
      prompt: b.setning,
      spoken: `Fyll inn: ${b.setning.replace('___', 'hva')}`,
      answer: b.svar,
      options: shuffle([b.svar, ...b.feil], rng),
      explain: `${b.setning.replace('___', b.svar)}`,
    }
  },
  // Motsetninger.
  motsetning: (_, rng) => {
    const par = pick(MOTSETNINGER, rng)
    const [a, b] = rng() < 0.5 ? par : [par[1], par[0]]
    const alle = MOTSETNINGER.flat().filter((w) => w !== a && w !== b)
    return {
      type: 'motsetning',
      form: 'valg',
      prompt: `Hva er det motsatte av «${a}»?`,
      spoken: `Hva er det motsatte av ${a}?`,
      visual: { kind: 'ordkort', tekst: a },
      answer: b,
      options: shuffle([b, ...shuffle(alle, rng).slice(0, 3)], rng),
      explain: `Det motsatte av ${a} er ${b}.`,
    }
  },
  // Tegnsetting: hvilket tegn skal stå sist?
  tegnsetting: (_, rng) => {
    const t = pick(TEGNSETTING, rng)
    const navn = { '.': 'punktum', '?': 'spørsmålstegn', '!': 'utropstegn' }
    return {
      type: 'tegnsetting',
      form: 'valg',
      prompt: `Hvilket tegn skal stå sist? «${t.setning} _»`,
      spoken: `Hvilket tegn skal stå sist i setningen: ${t.setning}? Punktum, spørsmålstegn eller utropstegn?`,
      visual: { kind: 'ordkort', tekst: `${t.setning} _` },
      answer: t.svar,
      options: shuffle([t.svar, ...t.feil], rng),
      explain: `«${t.setning}${t.svar}» – ${t.svar === '?' ? 'det er et spørsmål' : t.svar === '!' ? 'det er et utrop' : 'det er en vanlig setning'}, så det skal være ${navn[t.svar]}.`,
      stor: true,
    }
  },
  // Stor bokstav: hvilken setning er riktig skrevet?
  stor_bokstav: (_, rng) => {
    const s = pick(STOR_BOKSTAV, rng)
    return {
      type: 'stor_bokstav',
      form: 'valg',
      prompt: 'Hvilken setning er riktig skrevet?',
      spoken: `Hvilken setning har stor bokstav på riktig sted? ${s.riktig}`,
      answer: s.riktig,
      options: shuffle([s.riktig, ...s.feil], rng),
      explain: 'Stor bokstav først i setningen og i navn på folk og steder.',
    }
  },
}

export function genLesing(type, param = {}, rng = Math.random) {
  const g = GEN_LESING[type]
  if (!g) throw new Error(`Ukjent oppgavetype i lesing: ${type}`)
  const task = g(param, rng)
  task.type = task.type || type
  return task
}

registerTypeLabels({
  lyd_finn_bokstav: 'Høre lyden og finne bokstaven',
  forste_lyd: 'Første lyd i ordet',
  stor_liten: 'Stor og liten bokstav',
  lydering_bilde: 'Trekke lyder sammen',
  les_ord_bilde: 'Lese lydrette ord',
  bilde_ord: 'Finne ordet til bildet',
  vanlig_ord: 'Vanlige ord',
  setning_bilde: 'Lese korte setninger',
  tekst_sporsmaal: 'Lese og forstå',
  fakta_mening: 'Fakta eller mening',
  skriv_diftonger: 'Diftonger',
  skriv_kj_skj: 'Kj og skj',
  skriv_dobbel_konsonant: 'Dobbel konsonant',
  skriv_stum_h_g: 'Stum h og g',
  skriv_sammensatte: 'Sammensatte ord',
  ordklasse: 'Ordklasser',
  boying: 'Bøying',
  motsetning: 'Motsetninger',
  tegnsetting: 'Tegnsetting',
  stor_bokstav: 'Stor bokstav',
})

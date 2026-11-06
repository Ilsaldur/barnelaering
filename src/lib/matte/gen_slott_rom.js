// Det gylne slottet (23–30) og Verdensrommet (31–38): gange og deling,
// tall til 1000 og 10 000, tekstoppgaver, negative tall, brøk, desimaltall,
// areal og omkrets, koordinater, likninger og parenteser.
import { EMOJIS, valg, tast, santUsant, regneFeil, randInt, pick, shuffle, fmt, antall, tall } from './felles.js'

function gangeTask(type, a, b, rng, extra = {}) {
  return tast({ type, prompt: `${a} × ${b} = ?`, spoken: `${a} ganger ${b}?`, kortId: `gange:${a}x${b}`, hjelp: { kind: 'rutenett', rader: a, kolonner: b }, explain: extra.explain || `${a} × ${b} = ${a * b}. Det er ${a} rader med ${b} i hver.`, ...extra }, a * b)
}

export const GEN_SLOTT_ROM = {
  // Nivå 23: gange som like grupper og rutenett.
  gange_grupper: ({ tabeller = [2, 10] }, rng) => {
    const b = pick(tabeller, rng)
    const a = randInt(1, 6, rng)
    const em = pick(EMOJIS, rng)
    return tast({ type: 'gange_grupper', prompt: `${tall(a, 'gruppe', 'grupper')} med ${b} i hver. Hvor mange til sammen?`, spoken: `${tall(a, 'gruppe', 'grupper')} med ${b} i hver. Hvor mange er det til sammen?`, visual: { kind: 'grupper', grupper: a, per: b, emoji: em.e }, explain: `${tall(a, 'gruppe', 'grupper')} med ${b} er ${a} × ${b} = ${a * b}.` }, a * b)
  },
  gange_rutenett: ({ max = 6 }, rng) => {
    const a = randInt(2, max, rng)
    const b = randInt(2, max, rng)
    return tast({ type: 'gange_rutenett', prompt: `${a} × ${b} = ?`, spoken: `${a} rader med ${b} ruter. ${a} ganger ${b}?`, visual: { kind: 'rutenett', rader: a, kolonner: b }, explain: `${a} rader med ${b} er ${a * b}.` }, a * b)
  },
  // Nivå 23–26: gangetabeller. `tabeller` er hvilke tabeller som øves.
  gange_tabell: ({ tabeller = [2, 10], a: fixedA, b: fixedB }, rng) => {
    const t = fixedA != null ? fixedA : pick(tabeller, rng)
    const k = fixedB != null ? fixedB : randInt(1, 10, rng)
    const [a, b] = rng() < 0.5 ? [t, k] : [k, t]
    return gangeTask('gange_tabell', a, b, rng, { explain: `${a} × ${b} = ${a * b}.${t === 9 ? ` I 9-gangen er sifrene til sammen 9.` : t === 5 ? ' 5-gangen ender alltid på 0 eller 5.' : ''}` })
  },
  // Nivå 27: blandet til 10 × 10, og ? × 6 = 42.
  gange_blandet: (_, rng) => {
    const a = randInt(2, 10, rng)
    const b = randInt(2, 10, rng)
    return gangeTask('gange_blandet', a, b, rng)
  },
  gange_apen: (_, rng) => {
    const a = randInt(2, 10, rng)
    const b = randInt(2, 10, rng)
    const hole = rng() < 0.5 ? 0 : 1
    const text = hole === 0 ? `? × ${b} = ${a * b}` : `${a} × ? = ${a * b}`
    return tast({ type: 'gange_apen', prompt: text, spoken: hole === 0 ? `Hva ganger ${b} er ${a * b}?` : `${a} ganger hva er ${a * b}?`, explain: `${a * b} ÷ ${hole === 0 ? b : a} = ${hole === 0 ? a : b}, for ${a} × ${b} = ${a * b}.` }, hole === 0 ? a : b)
  },
  // Nivå 28: deling som omvendt gange, med og uten rest.
  deling: ({ max = 10 }, rng) => {
    const b = randInt(2, max, rng)
    const q = randInt(2, max, rng)
    return tast({ type: 'deling', prompt: `${b * q} ÷ ${b} = ?`, spoken: `${b * q} delt på ${b}?`, hjelp: { kind: 'rutenett', rader: q, kolonner: b }, explain: `Tenk gange: ${b} × ${q} = ${b * q}, så ${b * q} ÷ ${b} = ${q}.` }, q)
  },
  deling_rest: (_, rng) => {
    const b = randInt(2, 9, rng)
    const q = randInt(2, 9, rng)
    const r = randInt(1, b - 1, rng)
    const a = b * q + r
    const spørRest = rng() < 0.5
    return tast(
      { type: 'deling_rest', prompt: `${a} ÷ ${b} = ? ${spørRest ? `Hva blir resten?` : `Hvor mange hele?`}`, spoken: `${a} delt på ${b}. ${spørRest ? 'Hva blir resten?' : 'Hvor mange hele blir det?'}`, explain: `${b} × ${q} = ${b * q}, og ${a} − ${b * q} = ${r}. Altså ${q} hele og ${r} i rest.` },
      spørRest ? r : q,
    )
  },
  // Nivå 29: tall til 1000.
  tall_1000: (_, rng) => {
    const h = randInt(1, 9, rng)
    const t = randInt(0, 9, rng)
    const e = randInt(0, 9, rng)
    const n = h * 100 + t * 10 + e
    if (rng() < 0.5) return tast({ type: 'tall_1000', prompt: `${tall(h, 'hundrer', 'hundrere')}, ${tall(t, 'tier', 'tiere')} og ${tall(e, 'ener', 'enere')} = ?`, spoken: `${tall(h, 'hundrer', 'hundrere')}, ${tall(t, 'tier', 'tiere')} og ${tall(e, 'ener', 'enere')}. Hvilket tall er det?`, explain: `${h * 100} + ${t * 10} + ${e} = ${n}.` }, n)
    const plass = pick(['hundrere', 'tiere', 'enere'], rng)
    const svar = { hundrere: h, tiere: t, enere: e }[plass]
    return tast({ type: 'tall_1000', prompt: `Hvor mange ${plass} er det i ${n}?`, spoken: `Hvor mange ${plass} er det i ${n}?`, visual: { kind: 'stor', text: String(n) }, explain: `${n} er ${tall(h, 'hundrer', 'hundrere')}, ${tall(t, 'tier', 'tiere')} og ${tall(e, 'ener', 'enere')}.` }, svar)
  },
  tresifret_pluss_minus: (_, rng) => {
    const op = rng() < 0.5 ? 'add' : 'sub'
    if (op === 'add') {
      const a = randInt(100, 800, rng)
      const b = randInt(100, 999 - a, rng)
      return tast({ type: 'tresifret_pluss_minus', prompt: `${a} + ${b} = ?`, spoken: `${a} pluss ${b}?`, explain: `Hundrere: ${Math.floor(a / 100) * 100} + ${Math.floor(b / 100) * 100}. Så tiere og enere. Svar ${a + b}.` }, a + b)
    }
    const a = randInt(200, 999, rng)
    const b = randInt(100, a - 1, rng)
    return tast({ type: 'tresifret_pluss_minus', prompt: `${a} − ${b} = ?`, spoken: `${a} minus ${b}?`, explain: `${a} − ${Math.floor(b / 100) * 100} = ${a - Math.floor(b / 100) * 100}, så − ${b % 100} = ${a - b}.` }, a - b)
  },
  // Nivå 30: tekstoppgaver med ett steg, der barnet velger regneart.
  velg_regneart: (_, rng) => {
    const em = pick(EMOJIS, rng)
    const a = randInt(3, 9, rng)
    const b = randInt(2, 9, rng)
    const v = pick(['mul', 'div', 'add', 'sub'], rng)
    const tekster = {
      mul: [`${a} barn har ${b} ${em.navn} hver. Hvor mange ${em.navn} er det til sammen?`, '×', a * b, `${a} × ${b} = ${a * b}`],
      div: [`${a * b} ${em.navn} deles likt på ${b} barn. Hvor mange får hver?`, '÷', a, `${a * b} ÷ ${b} = ${a}`],
      add: [`Noah har ${a * 4} ${em.navn} og får ${b * 3} til. Hvor mange har han nå?`, '+', a * 4 + b * 3, `${a * 4} + ${b * 3} = ${a * 4 + b * 3}`],
      sub: [`Ida har ${a * 5} ${em.navn} og gir bort ${Math.min(b * 2, a * 5 - 1)}. Hvor mange har hun igjen?`, '−', a * 5 - Math.min(b * 2, a * 5 - 1), `${a * 5} − ${Math.min(b * 2, a * 5 - 1)} = ${a * 5 - Math.min(b * 2, a * 5 - 1)}`],
    }
    const [tekst, sym, svar, regn] = tekster[v]
    if (rng() < 0.4) {
      return { type: 'velg_regneart', form: 'valg', prompt: `${tekst} Hvilken regneart bruker du?`, spoken: `${tekst} Hvilken regneart bruker du?`, visual: { kind: 'ikon', emoji: em.e }, explain: `Her regner vi ${regn}.`, answer: sym, options: shuffle(['+', '−', '×', '÷'], rng) }
    }
    return tast({ type: 'tekst_ett_steg', prompt: tekst, spoken: tekst, visual: { kind: 'ikon', emoji: em.e }, explain: `${regn}.` }, svar)
  },

  // Nivå 31: tall til 10 000, avrunding, firesifret pluss og minus.
  tall_10000: (_, rng) => {
    const n = randInt(1000, 9999, rng)
    const v = pick(['avrund10', 'avrund100', 'avrund1000', 'plass'], rng)
    if (v === 'plass') {
      const plass = pick(['tusener', 'hundrere', 'tiere', 'enere'], rng)
      const svar = { tusener: Math.floor(n / 1000), hundrere: Math.floor(n / 100) % 10, tiere: Math.floor(n / 10) % 10, enere: n % 10 }[plass]
      return tast({ type: 'tall_10000', prompt: `Hvilket siffer står på ${plass}-plassen i ${n}?`, spoken: `Hvilket siffer står på ${plass}plassen i ${n}?`, visual: { kind: 'stor', text: String(n) }, explain: `${n}: tusener ${Math.floor(n / 1000)}, hundrere ${Math.floor(n / 100) % 10}, tiere ${Math.floor(n / 10) % 10}, enere ${n % 10}.` }, svar)
    }
    const til = { avrund10: 10, avrund100: 100, avrund1000: 1000 }[v]
    const svar = Math.round(n / til) * til
    return tast({ type: 'avrunding', prompt: `Rund av ${n} til nærmeste ${til === 10 ? 'tier' : til === 100 ? 'hundrer' : 'tusen'}.`, spoken: `Rund av ${n} til nærmeste ${til === 10 ? 'tier' : til === 100 ? 'hundrer' : 'tusen'}.`, visual: { kind: 'stor', text: String(n) }, explain: `${n} ligger nærmest ${svar}. Se på sifferet til høyre for ${til === 10 ? 'tierne' : til === 100 ? 'hundrerne' : 'tusenerne'}: er det 5 eller mer, runder vi opp.` }, svar)
  },
  firesifret_pluss_minus: (_, rng) => {
    if (rng() < 0.5) {
      const a = randInt(1000, 6000, rng)
      const b = randInt(1000, 9999 - a, rng)
      return tast({ type: 'firesifret_pluss_minus', prompt: `${a} + ${b} = ?`, spoken: `${a} pluss ${b}?`, explain: `Legg sammen plass for plass, fra enerne. Svar ${a + b}.` }, a + b)
    }
    const a = randInt(2000, 9999, rng)
    const b = randInt(1000, a - 1, rng)
    return tast({ type: 'firesifret_pluss_minus', prompt: `${a} − ${b} = ?`, spoken: `${a} minus ${b}?`, explain: `Trekk fra plass for plass, fra enerne. Svar ${a - b}.` }, a - b)
  },
  // Nivå 32: tosifret ganger ensifret.
  tosifret_ganger_ensifret: (_, rng) => {
    const a = randInt(2, 9, rng)
    const b = randInt(11, 30, rng)
    const t = Math.floor(b / 10) * 10
    const e = b % 10
    if (e > 0 && rng() < 0.4) return tast({ type: 'tosifret_ganger_ensifret', prompt: `${a} × ${b} = ${a * t} + ?`, spoken: `${a} ganger ${b} er ${a * t} pluss hva?`, explain: `${b} er ${t} + ${e}. ${a} × ${e} = ${a * e}.` }, a * e)
    return tast({ type: 'tosifret_ganger_ensifret', prompt: `${a} × ${b} = ?`, spoken: `${a} ganger ${b}?`, explain: `Del opp ${b}: ${a} × ${t} = ${a * t} og ${a} × ${e} = ${a * e}. ${a * t} + ${a * e} = ${a * b}.` }, a * b)
  },
  // Nivå 33: tosifret delt på ensifret.
  tosifret_delt_ensifret: (_, rng) => {
    const b = randInt(2, 9, rng)
    const q = randInt(11, Math.floor(99 / b), rng)
    if (rng() < 0.5) return tast({ type: 'tosifret_delt_ensifret', prompt: `${b * q} ÷ ${b} = ?`, spoken: `${b * q} delt på ${b}?`, explain: `${b} × 10 = ${b * 10}, og ${b * q} − ${b * 10} = ${b * q - b * 10} = ${b} × ${q - 10}. Altså ${q}.` }, q)
    const r = randInt(1, b - 1, rng)
    const a = b * q + r
    if (a > 99) return tast({ type: 'tosifret_delt_ensifret', prompt: `${b * q} ÷ ${b} = ?`, spoken: `${b * q} delt på ${b}?`, explain: `${b} × ${q} = ${b * q}.` }, q)
    const spørRest = rng() < 0.5
    return tast({ type: 'tosifret_delt_ensifret', prompt: `${a} ÷ ${b} = ? ${spørRest ? 'Hva blir resten?' : 'Hvor mange hele?'}`, spoken: `${a} delt på ${b}. ${spørRest ? 'Hva blir resten?' : 'Hvor mange hele?'}`, explain: `${b} × ${q} = ${b * q}, rest ${a - b * q}.` }, spørRest ? r : q)
  },
  // Nivå 34: negative tall.
  negative_tall: (_, rng) => {
    const v = pick(['tallinje', 'termometer', 'regn'], rng)
    if (v === 'tallinje') {
      const n = randInt(-10, 10, rng)
      return valg({ type: 'negative_tall', allowNegative: true, prompt: 'Hvilket tall peker pila på?', spoken: 'Hvilket tall peker pila på?', visual: { kind: 'tallinje', from: -10, to: 10, step: 1, marker: n }, explain: `Pila står på ${n}. Tallene til venstre for 0 er negative.` }, n, [n + 1, n - 1, -n].filter((x) => x !== n && x >= -10 && x <= 10).slice(0, 3), rng)
    }
    if (v === 'termometer') {
      const start = randInt(-8, 5, rng)
      const d = randInt(2, 9, rng)
      const opp = rng() < 0.5
      const svar = opp ? start + d : start - d
      return tast({ type: 'negative_tall', prompt: `Det er ${start} grader. Så blir det ${d} grader ${opp ? 'varmere' : 'kaldere'}. Hvor mange grader er det da?`, spoken: `Det er ${start} grader. Så blir det ${d} grader ${opp ? 'varmere' : 'kaldere'}. Hvor mange grader er det da?`, visual: { kind: 'termometer', temp: start }, explain: `${start} ${opp ? '+' : '−'} ${d} = ${svar}.` }, svar, { allowNegative: true })
    }
    const a = randInt(0, 9, rng)
    const b = randInt(a + 1, 12, rng)
    return tast({ type: 'negative_tall', prompt: `${a} − ${b} = ?`, spoken: `${a} minus ${b}?`, hjelp: { kind: 'tallinje', from: -10, to: 10, start: a }, explain: `Gå ${b} steg til venstre fra ${a} på tallinja: ${a - b}.` }, a - b, { allowNegative: true })
  },
  // Nivå 35: brøk.
  brok: (_, rng) => {
    const v = pick(['figur', 'mengde', 'sammenlign'], rng)
    if (v === 'figur') {
      const deler = pick([2, 3, 4, 6, 8], rng)
      const farget = randInt(1, deler - 1, rng)
      const svar = `${farget}/${deler}`
      const feil = [`${deler - farget}/${deler}`, `${farget}/${deler + 1}`, `${farget + 1}/${deler}`].filter((x) => x !== svar)
      return valg({ type: 'brok', prompt: 'Hvor stor del er farget?', spoken: 'Hvor stor del av figuren er farget?', visual: { kind: 'brok', deler, farget }, explain: `${farget} av ${deler} deler er farget: ${farget}/${deler}.`, brok: true }, svar, feil, rng)
    }
    if (v === 'mengde') {
      const n = pick([2, 3, 4], rng)
      const t = randInt(1, n - 1, rng)
      const total = n * randInt(2, 6, rng)
      const em = pick(EMOJIS, rng)
      return tast({ type: 'brok', prompt: `Hva er ${t}/${n} av ${total}?`, spoken: `Hva er ${t === 1 ? (n === 2 ? 'en halv' : n === 3 ? 'en tredel' : 'en firedel') : `${t} ${n === 2 ? 'halvdeler' : n === 3 ? 'tredeler' : 'firedeler'}`} av ${total}?`, visual: { kind: 'mengde', emoji: em.e, n: total }, brok: true, explain: t === 1 ? `1/${n} av ${total} er ${total} ÷ ${n} = ${total / n}.` : `1/${n} av ${total} er ${total / n}. ${t}/${n} er ${t} × ${total / n} = ${(t * total) / n}.` }, (t * total) / n)
    }
    const paret = pick(
      [
        ['1/2', '1/3', true],
        ['1/4', '1/2', false],
        ['2/3', '1/3', true],
        ['3/4', '1/2', true],
        ['1/5', '1/4', false],
        ['2/4', '1/2', null],
      ],
      rng,
    )
    const [x, y, større] = paret
    if (større === null) return santUsant({ type: 'brok', prompt: `Sant eller usant: ${x} er like mye som ${y}?`, spoken: `Sant eller usant: ${x} er like mye som ${y}?`, visual: { kind: 'brokpar', x, y }, brok: true, explain: `${x} og ${y} er like store.` }, true)
    const spørStørre = rng() < 0.5
    return santUsant({ type: 'brok', prompt: `Sant eller usant: ${x} er ${spørStørre ? 'større' : 'mindre'} enn ${y}?`, spoken: `Sant eller usant: ${x} er ${spørStørre ? 'større' : 'mindre'} enn ${y}?`, visual: { kind: 'brokpar', x, y }, brok: true, explain: `${x} er ${større ? 'større' : 'mindre'} enn ${y}.` }, spørStørre === større)
  },
  // Nivå 36: tideler, desimaltall, kroner og øre.
  desimal: (_, rng) => {
    const v = pick(['tideler', 'pluss', 'penger'], rng)
    if (v === 'tideler') {
      const t = randInt(1, 9, rng)
      return tast({ type: 'desimal', prompt: `${t} tideler skrives som desimaltall: ?`, spoken: `${t} tideler. Hvordan skrives det som desimaltall?`, explain: `${t} tideler er ${fmt(t / 10)}.`, allowDecimal: true }, t / 10)
    }
    if (v === 'pluss') {
      const a = randInt(10, 60, rng) / 10
      const b = randInt(10, 39, rng) / 10
      return tast({ type: 'desimal', prompt: `${fmt(a)} + ${fmt(b)} = ?`, spoken: `${fmt(a)} pluss ${fmt(b)}?`, explain: `Legg sammen helene og tidelene: ${fmt(Math.round((a + b) * 10) / 10)}.`, allowDecimal: true }, Math.round((a + b) * 10) / 10)
    }
    const kr = randInt(2, 20, rng)
    const øre = pick([50], rng)
    const b = randInt(1, 10, rng)
    return tast({ type: 'desimal', prompt: `${kr} kr og ${øre} øre + ${b} kr = ? kr`, spoken: `${kr} kroner og ${øre} øre pluss ${b} kroner. Hvor mange kroner er det?`, explain: `${kr} kr og ${øre} øre er ${fmt(kr + øre / 100)} kr. Pluss ${b} kr: ${fmt(kr + b + øre / 100)} kr.`, allowDecimal: true, unit: 'kr' }, kr + b + øre / 100)
  },
  // Nivå 37: areal, omkrets og koordinater.
  areal_omkrets: (_, rng) => {
    const l = randInt(2, 9, rng)
    const b = randInt(1, 6, rng)
    if (rng() < 0.5) return tast({ type: 'areal', prompt: `Et rektangel er ${l} ruter langt og ${b} ruter bredt. Hva er arealet?`, spoken: `Et rektangel er ${l} ruter langt og ${b} ruter bredt. Hva er arealet?`, visual: { kind: 'rektangel', l, b }, explain: `Areal er lengde ganger bredde: ${l} × ${b} = ${l * b} ruter.` }, l * b)
    return tast({ type: 'omkrets', prompt: `Et rektangel er ${l} cm langt og ${b} cm bredt. Hva er omkretsen?`, spoken: `Et rektangel er ${l} centimeter langt og ${b} centimeter bredt. Hva er omkretsen?`, visual: { kind: 'rektangel', l, b }, explain: `Omkretsen er rundt hele: ${l} + ${b} + ${l} + ${b} = ${2 * (l + b)} cm.` }, 2 * (l + b), { unit: 'cm' })
  },
  koordinater: (_, rng) => {
    const size = 6
    const pts = []
    const brukt = new Set()
    const navn = ['A', 'B', 'C', 'D']
    while (pts.length < 4) {
      const x = randInt(0, size, rng)
      const y = randInt(0, size, rng)
      const k = `${x},${y}`
      if (brukt.has(k)) continue
      brukt.add(k)
      pts.push({ x, y, label: navn[pts.length] })
    }
    const m = pick(pts, rng)
    if (rng() < 0.5) return { type: 'koordinater', form: 'valg', prompt: `Hvilket punkt ligger på (${m.x}, ${m.y})?`, spoken: `Hvilket punkt ligger på ${m.x} komma ${m.y}?`, visual: { kind: 'koordinater', points: pts, size }, explain: `Gå ${m.x} bortover og ${m.y} oppover: der ligger ${m.label}.`, answer: m.label, options: navn }
    return { type: 'koordinater', form: 'valg', prompt: `Hva er koordinatene til ${m.label}?`, spoken: `Hva er koordinatene til punkt ${m.label}?`, visual: { kind: 'koordinater', points: pts, size }, explain: `${m.label} ligger ${m.x} bortover og ${m.y} oppover: (${m.x}, ${m.y}).`, answer: `(${m.x}, ${m.y})`, options: shuffle([`(${m.x}, ${m.y})`, `(${m.y}, ${m.x})`, `(${m.x + 1}, ${m.y})`, `(${m.x}, ${m.y + 1})`].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4), rng) }
  },
  // Nivå 38: likninger, tekst med to steg, parenteser.
  likning: (_, rng) => {
    const v = pick(['likning', 'parentes', 'tosteg'], rng)
    if (v === 'likning') {
      const x = randInt(2, 12, rng)
      const a = randInt(2, 5, rng)
      const b = randInt(1, 9, rng)
      if (rng() < 0.5) return tast({ type: 'likning', prompt: `${a} · x + ${b} = ${a * x + b}. Hva er x?`, spoken: `${a} ganger x pluss ${b} er lik ${a * x + b}. Hva er x?`, explain: `Trekk fra ${b}: ${a} · x = ${a * x}. Del på ${a}: x = ${x}.` }, x)
      return tast({ type: 'likning', prompt: `x − ${b} = ${x * 3}. Hva er x?`, spoken: `x minus ${b} er lik ${x * 3}. Hva er x?`, explain: `Legg til ${b} på begge sider: x = ${x * 3 + b}.` }, x * 3 + b)
    }
    if (v === 'parentes') {
      const a = randInt(2, 6, rng)
      const b = randInt(2, 9, rng)
      const c = randInt(1, 9, rng)
      if (rng() < 0.5) return tast({ type: 'parentes', prompt: `${a} × (${b} + ${c}) = ?`, spoken: `${a} ganger, parentes, ${b} pluss ${c}?`, explain: `Parentesen først: ${b} + ${c} = ${b + c}. Så ${a} × ${b + c} = ${a * (b + c)}.` }, a * (b + c))
      return tast({ type: 'parentes', prompt: `${a} × ${b} + ${c} = ?`, spoken: `${a} ganger ${b} pluss ${c}?`, explain: `Gange først: ${a} × ${b} = ${a * b}. Så + ${c} = ${a * b + c}.` }, a * b + c)
    }
    const em = pick(EMOJIS, rng)
    const pakker = randInt(2, 6, rng)
    const per = randInt(3, 9, rng)
    const bort = randInt(1, pakker * per - 1, rng)
    return tast({ type: 'tekst_to_steg', prompt: `Du kjøper ${pakker} pakker med ${per} ${em.navn} i hver, og gir bort ${bort}. Hvor mange har du igjen?`, spoken: `Du kjøper ${pakker} pakker med ${per} ${em.navn} i hver, og gir bort ${bort}. Hvor mange har du igjen?`, visual: { kind: 'ikon', emoji: em.e }, explain: `Først ${pakker} × ${per} = ${pakker * per}. Så ${pakker * per} − ${bort} = ${pakker * per - bort}.` }, pakker * per - bort)
  },
}

export { regneFeil }

// Usynlig plassering (runde 5, etappe S): det første oppdraget i en stige ser
// ut som et vanlig oppdrag og finner nivået selv.
//
//  - Starter på nivå 1 og hopper lenger for hvert riktige svar: 1, 2, 4, 8,
//    16, 32 (begrenset av toppen/taket). Én oppgave per prøve.
//  - Ved første gale svar søkes det binært mellom siste riktige (lo) og første
//    gale (hi) til de ligger inntil hverandre. Barnet lander på lo.
//  - Slå fast: to oppgaver på lo. Går én galt, flytt ett nivå ned og prøv
//    igjen, høyst to ganger. Aldri under nivå 1.
//  - Resten, opp til minst 8 oppgaver (5 på nivåer med lengde 5), er vanlige
//    oppgaver på nivået, så oppdraget slutter med oppgaver barnet får til.
//    Høyst 14 oppgaver (9 der lengden er 5).
//
// Ren tilstandsmaskin, så den kan simuleres. `lengdeFor(nivaa)` gir 8 eller 5.

export function startFinn({ maks, tak = maks, lengdeFor = () => 8 } = {}) {
  const t = Math.max(1, Math.min(maks, tak))
  return { fase: 'opp', pos: 1, lo: null, hi: null, nedflytt: 0, fast: [], steg: [], maks, tak: t, lengdeFor, nivaa: null, ferdig: false }
}

export function minLengde(state) {
  return state.lengdeFor(state.nivaa ?? state.lo ?? state.pos) === 5 ? 5 : 8
}
export function maksLengde(state) {
  return minLengde(state) === 5 ? 9 : 14
}

function land(state, n) {
  const lo = Math.max(1, Math.min(state.tak, n))
  return { ...state, fase: 'fast', lo, pos: lo, fast: [] }
}

function vanlig(state, n) {
  const s = { ...state, fase: 'vanlig', nivaa: n, pos: n, lo: n }
  return s.steg.length >= minLengde(s) ? { ...s, ferdig: true } : s
}

// Ett svar på oppgaven som står nå. `ok` = riktig på første forsøk uten hjelp.
export function stegFinn(state, ok) {
  if (state.ferdig) return state
  const steg = [...state.steg, { nivaa: state.pos, ok, fase: state.fase }]
  let s = { ...state, steg }

  if (s.fase === 'opp') {
    if (ok) {
      s.lo = s.pos
      if (s.pos >= s.tak) s = land(s, s.pos)
      else s.pos = Math.min(s.tak, s.pos * 2)
    } else {
      s.hi = s.pos
      if (s.lo == null) s = land(s, 1)
      else if (s.hi - s.lo <= 1) s = land(s, s.lo)
      else {
        s.fase = 'sok'
        s.pos = Math.floor((s.lo + s.hi) / 2)
      }
    }
  } else if (s.fase === 'sok') {
    if (ok) s.lo = s.pos
    else s.hi = s.pos
    if (s.hi - s.lo <= 1) s = land(s, s.lo)
    else s.pos = Math.floor((s.lo + s.hi) / 2)
  } else if (s.fase === 'fast') {
    const fast = [...s.fast, ok]
    s = { ...s, fast }
    if (!ok) {
      if (s.nedflytt < 2 && s.lo > 1) s = { ...land(s, s.lo - 1), nedflytt: s.nedflytt + 1 }
      else s = vanlig(s, s.lo)
    } else if (fast.length >= 2) {
      s = vanlig(s, s.lo)
    }
  } else if (s.fase === 'vanlig') {
    if (s.steg.length >= minLengde(s)) s.ferdig = true
  }

  // Aldri lenger enn taket for antall oppgaver.
  if (!s.ferdig && s.steg.length >= maksLengde(s)) {
    s = { ...s, fase: 'vanlig', nivaa: s.lo ?? 1, pos: s.lo ?? 1, ferdig: true }
  }
  return s
}

// Framdrift 0–1 til linja uten tall: det som er gjort, delt på det som minst gjenstår.
export function framdrift(state) {
  if (state.ferdig) return 1
  const n = state.steg.length
  const anslag = Math.max(minLengde(state), n + (state.fase === 'vanlig' ? 1 : 3))
  return Math.min(0.95, n / anslag)
}

// Simulering: et barn på nivå `kan` svarer riktig med 92 % til og med sitt
// nivå, 55 % på nivået over og 15 % høyere. Returnerer sluttilstanden.
export function simulerBarn(kan, { maks, tak = maks, lengdeFor = () => 8, rng = Math.random, p = [0.92, 0.55, 0.15] } = {}) {
  let s = startFinn({ maks, tak, lengdeFor })
  while (!s.ferdig) {
    const n = s.pos
    const sann = n <= kan ? p[0] : n === kan + 1 ? p[1] : p[2]
    s = stegFinn(s, rng() < sann)
  }
  return s
}

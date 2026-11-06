// Plasseringstest første gang et fag åpnes.
//
//  - Valget på startskjermen bestemmer startnivå og tak (første nivå i neste
//    verden, eller toppnivået).
//  - Hvert nivå prøves med to oppgaver, ett forsøk, uten hjelp.
//  - Begge riktige: to nivåer opp (aldri over taket). Begge riktige på taket:
//    plasser på taket.
//  - Minst én feil: stopp, og plasser ett nivå over det siste nivået barnet besto.
//  - Feil allerede på startnivået: to nivåer ned og prøv der. Består barnet et
//    nivå, plasseres det ett nivå over. Bommer det på nivå 1, plasseres det på 1.

export const OPPGAVER_PER_NIVAA = 2

// Startnivå og tak per startverden i matte.
export const START_NIVAA = { skog: 1, hav: 6, fjell: 13, slott: 21, rom: 29 }
export const TAK_NIVAA = { skog: 7, hav: 15, fjell: 23, slott: 31, rom: 38 }

// Trappa av startnivåer med tak (matte: verdenene). Bom på et startnivå går til
// startnivået under og klatrer derfra; taket er da den verdenens tak.
export const TRAPP_MATTE = [
  { start: 1, tak: 7 },
  { start: 6, tak: 15 },
  { start: 13, tak: 23 },
  { start: 21, tak: 31 },
  { start: 29, tak: 38 },
]

export function startPlassering({ start = 1, tak = 38, maks = 38, trapp = null } = {}) {
  const t = Math.min(maks, Math.max(1, tak))
  const s = Math.min(t, Math.max(1, start))
  const trinn = (trapp || []).map((x) => ({ start: Math.min(maks, x.start), tak: Math.min(maks, x.tak) })).sort((a, b) => a.start - b.start)
  return { start: s, tak: t, maks, trapp: trinn, pos: s, retning: null, paaNivaa: 0, sisteBestaatt: null, steg: [], ferdig: false, nivaa: null }
}

export function stegPlassering(state, ok) {
  if (state.ferdig) return state
  const steg = [...state.steg, { nivaa: state.pos, ok }]
  const next = { ...state, steg }
  const L = state.pos

  if (!ok) {
    // Bommet på dette nivået.
    if (state.retning === null && L === state.start && state.sisteBestaatt === null) {
      if (L <= 1) return { ...next, ferdig: true, nivaa: 1 }
      // Ned til startnivået i verdenen under (eller to ned uten trapp).
      // Taket er nivået barnet falt fra: testen klatrer ikke forbi det.
      const under = [...state.trapp].reverse().find((x) => x.start < L)
      if (under) return { ...next, start: under.start, tak: Math.min(under.tak, L), pos: under.start, paaNivaa: 0 }
      return { ...next, start: Math.max(1, L - 2), tak: L, pos: Math.max(1, L - 2), paaNivaa: 0 }
    }
    return { ...next, ferdig: true, nivaa: Math.min(state.tak, (state.sisteBestaatt ?? L - 1) + 1) }
  }

  const paaNivaa = state.paaNivaa + 1
  if (paaNivaa < OPPGAVER_PER_NIVAA) return { ...next, paaNivaa }

  // Besto nivået (begge riktige).
  if (L >= state.tak) return { ...next, ferdig: true, nivaa: state.tak, sisteBestaatt: L }
  // Besto nivået rett under taket: plasseringen er gitt, prøven på taket droppes.
  if (L + 1 === state.tak) return { ...next, ferdig: true, nivaa: state.tak, sisteBestaatt: L }
  return { ...next, retning: 'opp', pos: Math.min(state.tak, L + 2), paaNivaa: 0, sisteBestaatt: L }
}

// Høyeste antall oppgaver en test kan ta (til framdriftsviseren): det som er
// tatt, pluss det som gjenstår opp til taket. Aldri lavere enn oppgavenummeret,
// også etter et fall til et lavere startnivå.
export function maksOppgaver(state) {
  const tatt = state.steg?.length || 0
  if (state.ferdig) return Math.max(1, tatt)
  const igjen = (Math.ceil(Math.max(0, state.tak - state.pos) / 2) + 1) * OPPGAVER_PER_NIVAA - (state.paaNivaa || 0)
  return Math.max(tatt === 0 ? 8 : tatt + 1, tatt + igjen)
}

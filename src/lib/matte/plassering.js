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

export function startPlassering({ start = 1, tak = 38, maks = 38 } = {}) {
  const t = Math.min(maks, Math.max(1, tak))
  const s = Math.min(t, Math.max(1, start))
  return { start: s, tak: t, maks, pos: s, retning: null, paaNivaa: 0, sisteBestaatt: null, steg: [], ferdig: false, nivaa: null }
}

export function stegPlassering(state, ok) {
  if (state.ferdig) return state
  const steg = [...state.steg, { nivaa: state.pos, ok }]
  const next = { ...state, steg }
  const L = state.pos

  if (!ok) {
    // Bommet på dette nivået.
    if (state.retning === 'ned' || (state.retning === null && L === state.start && state.sisteBestaatt === null)) {
      if (L <= 1) return { ...next, ferdig: true, nivaa: 1 }
      return { ...next, retning: 'ned', pos: Math.max(1, L - 2), paaNivaa: 0 }
    }
    return { ...next, ferdig: true, nivaa: Math.min(state.tak, (state.sisteBestaatt ?? L - 1) + 1) }
  }

  const paaNivaa = state.paaNivaa + 1
  if (paaNivaa < OPPGAVER_PER_NIVAA) return { ...next, paaNivaa }

  // Besto nivået (begge riktige).
  if (state.retning === 'ned') return { ...next, ferdig: true, nivaa: Math.min(state.tak, L + 1), sisteBestaatt: L }
  if (L >= state.tak) return { ...next, ferdig: true, nivaa: state.tak, sisteBestaatt: L }
  return { ...next, retning: 'opp', pos: Math.min(state.tak, L + 2), paaNivaa: 0, sisteBestaatt: L }
}

// Høyeste antall oppgaver en test kan ta (til framdriftsviseren).
export function maksOppgaver(state) {
  return Math.max(8, Math.ceil((state.tak - state.start) / 2 + 1) * OPPGAVER_PER_NIVAA)
}

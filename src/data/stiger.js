// Oversikt over stigene per fag (brukes av voksensiden og «Dagens økt»).
// Selve nivåene ligger i egne datafiler per fag og registreres her.

export const STIGER = {}

export function registerStige(fag, nivaer) {
  STIGER[fag] = nivaer
}

export const MAKS_NIVAA = new Proxy(
  {},
  {
    get: (_, fag) => (STIGER[fag] ? STIGER[fag].length : 0),
  },
)

export function nivaaNavn(fag, n) {
  const lvl = STIGER[fag]?.[n - 1]
  return lvl ? lvl.tittel : `Nivå ${n}`
}

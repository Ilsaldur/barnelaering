// Små tekstregler.

// Avslutt en setning med punktum, men ikke etter en tittel som alt slutter med
// spørsmålstegn, utropstegn eller punktum.
export function medPunktum(s) {
  return /[.!?…]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`
}

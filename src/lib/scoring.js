// Stjerner etter resultat. For en runde på åtte:
//   0–3 riktige → 0, 4–5 → 1, 6–7 → 2, 8 → 3.
// Formelen skalerer til andre lengder (alle riktige = 3, ≥ 75 % = 2, ≥ 50 % = 1).
export function starsFor(correct, total) {
  if (!total || total <= 0) return 0
  if (correct >= total) return 3
  if (correct >= Math.ceil(total * 0.75)) return 2
  if (correct >= Math.ceil(total * 0.5)) return 1
  return 0
}

// Melding fra reven etter runden. Svakt resultat gir en vennlig oppfordring,
// ikke «Bra jobba!».
export function resultMessage(stars, correct, total) {
  const score = `${correct} av ${total} riktig.`
  if (stars === 3) return `Alle riktige! ${score} 🌟`
  if (stars === 2) return `Bra jobba! ${score} 🎉`
  if (stars === 1) return `Du er på vei! ${score} Vil du prøve igjen?`
  return `Det var vanskelig. ${score} Vil du prøve en gang til?`
}

// Overskrift på resultatskjermen.
export function resultTitle(stars) {
  if (stars >= 2) return 'Bra jobba! 🎉'
  if (stars === 1) return 'Godt forsøk! 💪'
  return 'Prøv igjen! 🦊'
}

// Feiring (konfetti og fanfare) bare ved godt resultat.
export function celebrate(stars) {
  return stars >= 2
}

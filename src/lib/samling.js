// Samlekort: hvilke kort får barnet etter et oppdrag? Ett kort for hvert
// nivå barnet mestrer (nivå opp, eller tre stjerner), og av og til et uventet
// bonuskort ved godt resultat.
import { kortForNivaa, BONUSKORT } from '../data/kort.js'

export const BONUS_SJANSE = 0.15

export function nyeKort({ eier = [], nivaa, levelUp = false, stars = 0, rng = Math.random }) {
  const out = []
  const legg = (k) => {
    if (k && !eier.includes(k.id) && !out.includes(k.id)) out.push(k.id)
  }
  if (levelUp || stars === 3) legg(kortForNivaa(nivaa))
  if (stars >= 2 && rng() < BONUS_SJANSE) {
    const ledige = BONUSKORT.filter((k) => !eier.includes(k.id))
    if (ledige.length) legg(ledige[Math.floor(rng() * ledige.length)])
  }
  return out
}

// Milepæler i familiekisten (bare til å vise fyllingsgrad – ingen premie loves).
export const KISTE_MILEPAELER = [25, 50, 100, 200, 350, 500, 750, 1000]

export function kisteStatus(sum) {
  const neste = KISTE_MILEPAELER.find((m) => sum < m) || null
  const forrige = [...KISTE_MILEPAELER].reverse().find((m) => sum >= m) || 0
  const pct = neste ? Math.round((100 * (sum - forrige)) / (neste - forrige)) : 100
  return { sum, neste, forrige, pct, nivaa: KISTE_MILEPAELER.filter((m) => sum >= m).length }
}

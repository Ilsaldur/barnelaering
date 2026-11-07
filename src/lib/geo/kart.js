// Hvilke land spørres det etter på hvert kart. Norden og Europa: alle landene i
// området. Verdenskartet: bare de store (minst 24 × 24 punkter på mobil).
// Kartene over én verdensdel (Amerika, Afrika, Asia, Oseania): alle land i
// verdensdelen som er minst 24 × 24 punkter på det zoomede kartet.
import { landFor, landIKontinent, KONTINENTER } from '../../data/geo/land.js'
import { storeNokPaaKart } from './topo.js'

// Landene det spørres etter på kartene over verdensdelene: 10–12 kjente land,
// valgt for hånd (runde 5, etappe X). Resten vises i «Utforsk kartet».
export const KART_UTVALG = {
  afrika: ['eg', 'ma', 'dz', 'ng', 'et', 'ke', 'tz', 'za', 'mg', 'cd', 'so', 'ml'],
  asia: ['cn', 'jp', 'in', 'ru', 'th', 'sa', 'mn', 'kz', 'ir', 'pk', 'iq', 'af'],
  amerika: ['us', 'ca', 'mx', 'br', 'ar', 'cl', 'pe', 'co', 'bo', 've'],
}

const cache = {}

// `alle`: alle land som er store nok (til utforsking), ikke bare utvalget.
export function kartPool(region, { alle = false } = {}) {
  const key = alle ? `${region}:alle` : region
  if (cache[key]) return cache[key]
  let pool
  if (region === 'norden' || region === 'europa') pool = landFor(region)
  else {
    const kandidater = KONTINENTER[region] ? landIKontinent(region) : landFor('verden')
    const ok = new Set(storeNokPaaKart(kandidater.map((l) => l.id), region))
    pool = kandidater.filter((l) => ok.has(l.id))
    if (!alle && KART_UTVALG[region]) pool = pool.filter((l) => KART_UTVALG[region].includes(l.kode))
  }
  cache[key] = pool
  return pool
}

export const KART_NAVN = { norden: 'Norden', europa: 'Europa', verden: 'verden', amerika: 'Amerika', afrika: 'Afrika', asia: 'Asia', oseania: 'Oseania' }

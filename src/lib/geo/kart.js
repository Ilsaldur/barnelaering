// Hvilke land spørres det etter på hvert kart. Norden og Europa: alle landene i
// området. Verdenskartet: bare de store (minst 24 × 24 punkter på mobil).
// Kartene over én verdensdel (Amerika, Afrika, Asia, Oseania): alle land i
// verdensdelen som er minst 24 × 24 punkter på det zoomede kartet.
import { landFor, landIKontinent, KONTINENTER } from '../../data/geo/land.js'
import { storeNokPaaKart } from './topo.js'

const cache = {}

export function kartPool(region) {
  if (cache[region]) return cache[region]
  let pool
  if (region === 'norden' || region === 'europa') pool = landFor(region)
  else {
    const kandidater = KONTINENTER[region] ? landIKontinent(region) : landFor('verden')
    const ok = new Set(storeNokPaaKart(kandidater.map((l) => l.id), region))
    pool = kandidater.filter((l) => ok.has(l.id))
  }
  cache[region] = pool
  return pool
}

export const KART_NAVN = { norden: 'Norden', europa: 'Europa', verden: 'verden', amerika: 'Amerika', afrika: 'Afrika', asia: 'Asia', oseania: 'Oseania' }

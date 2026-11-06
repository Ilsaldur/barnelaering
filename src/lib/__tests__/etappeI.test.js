import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { timeFraVinkel, timeVinkel } from '../klokke/vinkel.js'
import { genGeo } from '../geo/generatorer.js'
import { countries, pikselStorrelse, storeNokPaaVerdenskart } from '../geo/topo.js'
import { LAND, landById } from '../../data/geo/land.js'

describe('I2 still klokka', () => {
  it('for alle tider med fem minutters steg godtas timeviseren der en ekte klokke har den', () => {
    for (let h = 1; h <= 12; h++) {
      for (let m = 0; m < 60; m += 5) {
        const deg = timeVinkel(h, m)
        expect(timeFraVinkel(deg, m), `${h}:${m}`).toBe(h)
        // Litt unøyaktig fingerplassering (±8 grader) skal også gå bra.
        expect(timeFraVinkel(deg + 8, m), `${h}:${m} +8`).toBe(h)
        expect(timeFraVinkel(deg - 8, m), `${h}:${m} −8`).toBe(h)
      }
    }
    // «Fem på 2»: timeviseren nesten på 2 skal gi 1, ikke 2.
    expect(timeFraVinkel(timeVinkel(1, 55), 55)).toBe(1)
  })
})

describe('I3 verdenskartet', () => {
  it('bare land som er minst 24 × 24 punkter ved bredde 390 spørres på verdenskartet', () => {
    const rng = seeded(3)
    const alle = countries()
    for (let i = 0; i < 300; i++) {
      const t = genGeo(i % 2 ? 'finn_paa_kart' : 'hvilket_land', { region: 'verden' }, rng)
      const id = t.form === 'kart' ? t.answer : LAND.find((l) => l.navn === t.answer).id
      const c = alle.find((x) => x.id === id)
      const { w, h } = pikselStorrelse(c, 'verden', 390)
      expect(w, `${landById(id).navn} bredde`).toBeGreaterThanOrEqual(24)
      expect(h, `${landById(id).navn} høyde`).toBeGreaterThanOrEqual(24)
    }
    const store = storeNokPaaVerdenskart(LAND.map((l) => l.id))
    expect(store).not.toContain('208') // Danmark
    expect(store).toContain('840') // USA
    // Ved 390 punkters bredde er bare de største landene store nok; lista må ikke bli tom.
    expect(store.length).toBeGreaterThanOrEqual(6)
  })
  it('Russland spørres ikke om verdensdel; Bucuresti uten diakritiske tegn', () => {
    const rng = seeded(4)
    for (let i = 0; i < 300; i++) expect(genGeo('verdensdel', {}, rng).prompt).not.toContain('Russland')
    expect(landById('642').hovedstad).toBe('Bucuresti')
  })
})

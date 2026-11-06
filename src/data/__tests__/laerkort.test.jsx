import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { LAERKORT, laerkortForNivaa, laerkortForType, stegForType } from '../laerkort.js'
import { NIVAER } from '../matte/nivaer.js'
import { NIVAER_LESING, NIVAER_SKRIVE, NIVAER_SPRAK } from '../lesing/nivaer.js'
import { StarProvider } from '../../StarContext.jsx'
import LaerKort from '../../components/LaerKort.jsx'
import { MATTE_STIGE } from '../../lib/matte/oppdrag.js'
import { gen } from '../../lib/matte/generatorer.js'
import { genLesing } from '../../lib/lesing/generatorer.js'
import { seeded } from '../../lib/rng.js'

describe('«Lær først»-kort (UTKAST)', () => {
  it('finnes for alle nivåene i bestillingen', () => {
    const matte = [9, 10, 12, 13, 14, 20, 21, 23, 28, 34, 35, 36, 37, 38]
    for (const n of matte) expect(laerkortForNivaa('matte', n), `matte ${n}`).toBeTruthy()
    for (const n of [1, 2, 3, 4]) expect(laerkortForNivaa('skrive', n), `skrive ${n}`).toBeTruthy()
    for (const n of [1, 2, 3]) expect(laerkortForNivaa('sprak', n), `sprak ${n}`).toBeTruthy()
  })
  it('tre–fire steg, høyst to setninger-ish per steg, typer som finnes på nivået', () => {
    for (const k of LAERKORT) {
      expect(k.steg.length, k.id).toBeGreaterThanOrEqual(3)
      expect(k.steg.length, k.id).toBeLessThanOrEqual(4)
      const nivaer = k.fag === 'matte' ? NIVAER : k.fag === 'skrive' ? NIVAER_SKRIVE : NIVAER_SPRAK
      const g = k.fag === 'matte' ? gen : genLesing
      const def = nivaer[k.nivaa - 1]
      // Oppgavetypene nivået faktisk lager (generatorene kan gi undertyper).
      const rng = seeded(k.nivaa)
      const lagde = new Set()
      for (const t of def.typer) for (let i = 0; i < 30; i++) lagde.add(g(t.type, t.param, rng).type)
      expect(k.typer.some((t) => lagde.has(t)), `${k.id}: ${[...lagde].join(',')}`).toBe(true)
      for (const s of k.steg) {
        expect(s.tekst.length, k.id).toBeLessThanOrEqual(230)
        expect(s.tekst.trim().length).toBeGreaterThan(10)
      }
    }
    expect(new Set(LAERKORT.map((k) => k.id)).size).toBe(LAERKORT.length)
  })
  it('finner kort og steg per oppgavetype', () => {
    expect(laerkortForType('matte', 'pluss_tierovergang').id).toBe('m12-tierovergang-pluss')
    expect(stegForType('matte', 'dobling').index).toBe(2)
    expect(stegForType('matte', 'tiervenner').index).toBe(0)
    expect(stegForType('matte', 'tell')).toBe(null)
    expect(laerkortForType('sprak', 'ordklasse').nivaa).toBe(1)
  })
  it('kortene rendrer med figurene sine', () => {
    for (const k of LAERKORT) {
      const html = renderToString(
        <StarProvider>
          <LaerKort kort={k} stige={MATTE_STIGE} modus="forst" fag={k.fag} onDone={() => {}} />
        </StarProvider>,
      )
      expect(html, k.id).toContain(k.tittel)
    }
  })
})

// Etappe Q (runde 4): korrektur.
import { describe, it, expect } from 'vitest'
import { seeded } from '../rng.js'
import { gen } from '../matte/generatorer.js'
import { TEKSTER, RETTSKRIVING, LYDRETTE_ORD, BOKSTAVER } from '../../data/lesing/innhold.js'
import { TEKSTER2 } from '../../data/lesing/tekster2.js'
import { KORT } from '../../data/kort.js'
import { LAERKORT } from '../../data/laerkort.js'
import { ORD, SETNINGER, FYLL_INN } from '../../data/engelsk/innhold.js'

describe('Q – korrektur', () => {
  it('matte 36 og 37: «1 tidel» og «1 rute», ikke «1 tideler» og «1 ruter»', () => {
    const rng = seeded(36)
    for (let i = 0; i < 400; i++) {
      const a = gen('desimal', {}, rng)
      expect(`${a.prompt} ${a.explain}`).not.toMatch(/\b1 tideler\b/)
      const b = gen('areal_omkrets', {}, rng)
      expect(`${b.prompt} ${b.explain}`).not.toMatch(/\b1 ruter\b/)
    }
    expect(gen('desimal', {}, () => 0).prompt).toContain('1 tidel skrives')
  })
  it('«et bakeri» i Veien til skolen', () => {
    const t = TEKSTER.find((x) => x.id === 'skolevei')
    expect(t.tekst).toContain('et bakeri')
    expect(t.tekst).not.toContain('en bakeri')
  })
  it('«kval» og «hai» er ikke feilsvar lenger', () => {
    expect(RETTSKRIVING.stum_h_g.find((o) => o.ord === 'hval').feil).not.toContain('kval')
    expect(RETTSKRIVING.diftonger.find((o) => o.ord === 'hei').feil).not.toContain('hai')
  })
  it('Lese 12: riktig svar er alene lengst i omtrent en firedel av spørsmålene (10–35 %)', () => {
    const sp = TEKSTER2.filter((t) => t.id.startsWith('h-')).flatMap((t) => t.sporsmaal)
    expect(sp.length).toBeGreaterThanOrEqual(20)
    const lengst = sp.filter((q) => q.svar.length > Math.max(...q.alternativer.filter((a) => a !== q.svar).map((a) => a.length))).length
    const andel = lengst / sp.length
    expect(andel).toBeGreaterThanOrEqual(0.1)
    expect(andel).toBeLessThanOrEqual(0.35)
    for (const q of sp) expect(q.alternativer).toContain(q.svar)
  })
  it('emojier fra 2020–21 (stein, tau, tannbørste, hjul, sel) er byttet ut', () => {
    const tekst = JSON.stringify([RETTSKRIVING, LYDRETTE_ORD, BOKSTAVER, KORT, LAERKORT, ORD, SETNINGER, FYLL_INN])
    for (const e of ['🪨', '🪢', '🪥', '🛞', '🦭', '🫎', '🪿', '🩷', '🩵', '🩶', '🪵']) expect(tekst, e).not.toContain(e)
  })
})

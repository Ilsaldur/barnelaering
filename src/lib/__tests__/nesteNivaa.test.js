// Forklaring av hva som skal til for neste nivå (etter tilbakemelding 7. november).
import { describe, it, expect } from 'vitest'
import { nesteNivaaTekst, resultatNivaaTekst, applyResult } from '../matte/stige.js'
import { emptyFag } from '../profil.js'

describe('neste nivå i klartekst', () => {
  it('kartet: to gode, ett igjen, hjelp, toppen', () => {
    const f = { ...emptyFag(), nivaa: 7, plassert: true }
    expect(nesteNivaaTekst(f, 10)).toContain('To gode oppdrag på rad (7 eller 8 riktige) åpner nivå 8')
    expect(nesteNivaaTekst({ ...f, paaRad: 1 }, 10)).toContain('Ett godt oppdrag til')
    expect(nesteNivaaTekst({ ...f, paaRad: 1 }, 10)).toContain('nivå 8')
    expect(nesteNivaaTekst({ ...f, hjelpNeste: true }, 10)).toContain('med hjelp')
    expect(nesteNivaaTekst({ ...f, nivaa: 10 }, 10)).toBeNull()
    expect(nesteNivaaTekst(f, 10, { lengde: 5 })).toContain('4 eller 5 riktige')
  })
  it('resultatskjermen følger faget etter oppdraget', () => {
    let f = { ...emptyFag(), nivaa: 7, plassert: true }
    let r = applyResult(f, { correct: 8, total: 8, nivaa: 7 }, 10)
    expect(resultatNivaaTekst(r.fag, 10)).toContain('1 av 2 gode oppdrag på rad')
    r = applyResult(r.fag, { correct: 8, total: 8, nivaa: 7 }, 10)
    expect(r.events.levelUp).toBe(true) // da vises «Nivå opp» i stedet
    const svak = applyResult(f, { correct: 2, total: 8, nivaa: 7 }, 10)
    expect(resultatNivaaTekst(svak.fag, 10)).toContain('med hjelp')
    const midt = applyResult(f, { correct: 5, total: 8, nivaa: 7 }, 10)
    expect(resultatNivaaTekst(midt.fag, 10)).toContain('Nivå 8 åpner etter to gode oppdrag på rad')
  })
})

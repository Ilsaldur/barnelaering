// @vitest-environment jsdom
// Kartet sier hva som skal til for neste nivå, også når barnet har tre stjerner.
import './setup.js'
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import EngelskStige from '../../activities/EngelskStige.jsx'
import { egneTing } from '../../lib/nivaaTing.js'
import { NIVAER_ENGELSK } from '../../data/engelsk/nivaer.js'
import { genEngelsk } from '../../lib/engelsk/generatorer.js'
import { emptyData } from '../../lib/profil.js'
import { HISTORIER } from '../../data/historier.js'

afterEach(cleanup)
const DATA_KEY = `barnelaering_data_${GUEST_PROFILE.id}_v1`

describe('neste nivå på kartet', () => {
  it('tre stjerner på nivå 7 og paaRad 1: «Ett godt oppdrag til», og låst nivå forklarer det samme', () => {
    localStorage.clear()
    const d = emptyData()
    // Nivåets ting er kjent (runde 6, etappe AA), så bare rekka gjenstår.
    const kjent = [...egneTing({ nivaer: NIVAER_ENGELSK, gen: genEngelsk, kunnskap: true }, 7)]
    d.fag.engelsk = { ...d.fag.engelsk, nivaa: 7, plassert: true, paaRad: 1, beste: { 7: 3 }, kjent }
    d.historier = HISTORIER.map((h) => h.id)
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
    render(
      <StarProvider>
        <EngelskStige go={() => {}} />
      </StarProvider>,
    )
    const hint = screen.getByTestId('neste-nivaa')
    expect(hint.textContent).toContain('Ett godt oppdrag til')
    expect(hint.textContent).toContain('nivå 8')
    fireEvent.click(screen.getByLabelText(/Nivå 8:.*\(låst\)/))
    expect(document.body.textContent).toContain('Nivå 8 åpner seg når reven kommer dit.')
    expect(document.body.textContent).toContain(`Du kjenner ${kjent.length} av ${kjent.length} spørsmål. Ett godt oppdrag til`)
  })
  it('AA: paaRad 2 men nivåets ting ikke kjent: kartet sier hvor mange barnet kjenner og hva som trengs', () => {
    localStorage.clear()
    const d = emptyData()
    d.fag.engelsk = { ...d.fag.engelsk, nivaa: 7, plassert: true, paaRad: 2, beste: { 7: 3 }, kjent: [] }
    d.historier = HISTORIER.map((h) => h.id)
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
    render(
      <StarProvider>
        <EngelskStige go={() => {}} />
      </StarProvider>,
    )
    expect(screen.getByTestId('kjent-av').textContent).toContain('Du kjenner 0 av 42 spørsmål')
    const hint = screen.getByTestId('neste-nivaa')
    expect(hint.textContent).toContain('Nivå 8 åpner når du kjenner 32.')
    expect(hint.textContent).not.toContain('to gode oppdrag')
  })
})

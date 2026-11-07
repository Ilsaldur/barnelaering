// @vitest-environment jsdom
// Forsiden skal kjenne alle stigene selv om geografistigen lastes lat:
// «Nivå 9 av 9», ikke «Nivå 9 av 0». Testen importerer bare det App gjør.
import './setup.js'
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '../../data/alleStiger.js'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import Home from '../../activities/Home.jsx'
import { emptyData } from '../../lib/profil.js'
import { typeLabel } from '../../lib/labels.js'

afterEach(cleanup)
const DATA_KEY = `barnelaering_data_${GUEST_PROFILE.id}_v1`

describe('forsiden kjenner alle stigene', () => {
  it('geografi viser «Nivå 9 av 9», og typenavnene finnes uten kartet', () => {
    localStorage.clear()
    const d = emptyData()
    d.fag.geografi = { ...d.fag.geografi, nivaa: 9, plassert: true }
    d.fag.klokke = { ...d.fag.klokke, nivaa: 3, plassert: true }
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
    render(
      <StarProvider>
        <Home onSamling={() => {}} onGarden={() => {}} onParents={() => {}} onSwitchProfile={() => {}} onMatte={() => {}} onLesing={() => {}} onNoetter={() => {}} onDagens={() => {}} onFag={() => {}} />
      </StarProvider>,
    )
    expect(screen.getByText('Nivå 9 av 9')).toBeTruthy()
    expect(screen.getByText('Nivå 3 av 8')).toBeTruthy()
    expect(document.body.textContent).not.toContain('av 0')
    expect(typeLabel('flagg_norden')).toBe('Flagg i Norden')
  })
})

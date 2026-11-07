// @vitest-environment jsdom
// Etappe W «i appen»: kjøp av lue og briller gir begge på; kjøp av krone tar
// av lua, ikke brillene. Reven på forsiden viser det barnet har på.
import './setup.js'
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import Samling from '../../activities/Samling.jsx'
import Rev from '../../components/Rev.jsx'
import { emptyData } from '../../lib/profil.js'

afterEach(cleanup)
const DATA_KEY = `barnelaering_data_${GUEST_PROFILE.id}_v1`
const lesData = () => JSON.parse(localStorage.getItem(DATA_KEY))
const knapp = (navn) => screen.getAllByRole('button').find((b) => b.textContent.includes(navn))

describe('garderoben', () => {
  it('kjøp setter tingen på sin plass og tar bare av det på samme plass', () => {
    localStorage.clear()
    const d = emptyData()
    d.stars = 100
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
    render(
      <StarProvider>
        <Samling go={() => {}} onGarden={() => {}} onFag={() => {}} />
      </StarProvider>,
    )
    fireEvent.click(knapp('Rød lue'))
    fireEvent.click(knapp('Solbriller'))
    expect(lesData().kostymerPaa.sort()).toEqual(['briller', 'lue'])
    fireEvent.click(knapp('Krone'))
    expect(lesData().kostymerPaa.sort()).toEqual(['briller', 'krone'])
    expect(document.body.textContent).toContain('i stedet for rød lue')
    // Reven i garderoben har begge på.
    const rev = document.querySelector('svg[data-kostymer]')
    expect(rev.getAttribute('data-kostymer').split(' ').sort()).toEqual(['briller', 'krone'])
    // Ta av brillene ved å trykke på dem.
    fireEvent.click(knapp('Solbriller'))
    expect(lesData().kostymerPaa).toEqual(['krone'])
  })
  it('gammel profil med kostyme «lue» viser lua på reven', () => {
    localStorage.clear()
    const d = { ...emptyData(), kostymer: ['lue'], kostyme: 'lue', kostymeT: 1 }
    delete d.kostymerPaa
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
    render(
      <StarProvider>
        <Rev />
      </StarProvider>,
    )
    expect(document.querySelector('svg').getAttribute('data-kostymer')).toBe('lue')
  })
})

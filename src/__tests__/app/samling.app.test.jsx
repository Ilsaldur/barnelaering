// @vitest-environment jsdom
// Etappe V2 «i appen»: trykk på et grått kort åpner vinduet med riktig fag og
// nivå, og knappen navigerer dit. Reven forklarer regelen øverst.
import './setup.js'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import Samling from '../../activities/Samling.jsx'
import { emptyData } from '../../lib/profil.js'

afterEach(cleanup)
const DATA_KEY = `barnelaering_data_${GUEST_PROFILE.id}_v1`

describe('samlingen', () => {
  it('grått kort: vindu med fag og nivå, knapp som går dit; passert nivå sier spill om igjen', () => {
    localStorage.clear()
    const d = emptyData()
    d.kort = ['dyr-ekorn']
    d.fag.geografi = { ...d.fag.geografi, nivaa: 5, plassert: true }
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
    const onFag = vi.fn()
    render(
      <StarProvider>
        <Samling go={() => {}} onGarden={() => {}} onFag={onFag} />
      </StarProvider>,
    )
    expect(document.body.textContent).toContain('Du får et kort hver gang du klarer et nivå med tre stjerner, eller går opp et nivå.')
    expect(document.body.textContent).toMatch(/1 av \d+ kort/)
    // Settene for andre fag enn det sist spilte er slått sammen (etappe AE): åpne geografi først.
    fireEvent.click(screen.getByTestId('sett-geografi').querySelector('button'))
    // Grått geografikort for nivå 3 (passert: barnet står på 5).
    fireEvent.click(screen.getByTestId('kort-geo-3'))
    const vindu = screen.getByTestId('kort-vindu')
    expect(vindu.textContent).toContain('Geografi, nivå 3')
    expect(vindu.textContent).toContain('passert nivå 3')
    fireEvent.click(screen.getByText('Til geografi nivå 3'))
    expect(onFag).toHaveBeenCalledWith('geografi')
    // Grått lesekort for nivå 7 (ikke passert).
    fireEvent.click(screen.getByText('Lukk'))
    fireEvent.click(screen.getByTestId('sett-lesing').querySelector('button'))
    fireEvent.click(screen.getByTestId('kort-lese-7'))
    expect(screen.getByTestId('kort-vindu').textContent).toContain('Lese, nivå 7')
    expect(screen.getByTestId('kort-vindu').textContent).toContain('tre stjerner')
    fireEvent.click(screen.getByText('Til lese nivå 7'))
    expect(onFag).toHaveBeenCalledWith('lesing')
    // Grupperingen per fag og flaggbilde på et geografikort man eier.
    expect(document.body.textContent).toContain('Flagg og landemerker')
    expect(document.body.textContent).toContain('English words')
  })
})

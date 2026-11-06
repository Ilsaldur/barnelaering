// @vitest-environment jsdom
// Akseptansetest G: resultatskjermen med samlekort, sjefstilbud og nivåmelding
// skal ikke ha noen vannrett rad som kan bli bredere enn skjermen. jsdom har
// ingen layout, så testen sjekker strukturen: meldingene står i en egen
// stablet blokk over knappene, knapperaden brytes (flex-wrap), og ingenting
// i skjermen tvinger bredde (min-w-max, whitespace-nowrap, overflow-x).
import './setup.js'
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { StarProvider } from '../../StarContext.jsx'
import RoundDone from '../../components/RoundDone.jsx'
import { BigButton } from '../../components/ui.jsx'

function skjerm() {
  return render(
    <StarProvider>
      <RoundDone
        correct={8}
        total={8}
        stars={3}
        onAgain={() => {}}
        onHome={() => {}}
        before={
          <>
            <div data-testid="nivaa-ned">Reven tar deg med til nivå 17 en stund</div>
            <div data-testid="kort">Nytt samlekort! 🦌 Reinsdyr</div>
            <div data-testid="sjefstilbud">
              Alle åtte riktige! <BigButton onClick={() => {}}>👑 Ja, prøv sjefsoppgaven!</BigButton>
            </div>
          </>
        }
      >
        <BigButton onClick={() => {}}>▶️ Nytt oppdrag</BigButton>
      </RoundDone>
    </StarProvider>,
  )
}

describe('resultatskjermen (G)', () => {
  afterEach(cleanup)
  it('sjefstilbud, kort og nivåmelding står for seg selv over knappene', () => {
    const { getByTestId } = skjerm()
    const meldinger = getByTestId('resultat-meldinger')
    const knapper = getByTestId('resultat-knapper')
    expect(meldinger.contains(getByTestId('sjefstilbud'))).toBe(true)
    expect(meldinger.contains(getByTestId('kort'))).toBe(true)
    expect(meldinger.contains(getByTestId('nivaa-ned'))).toBe(true)
    expect(knapper.contains(getByTestId('sjefstilbud'))).toBe(false)
    // Meldingene kommer før knapperaden i dokumentet.
    expect(meldinger.compareDocumentPosition(knapper) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(meldinger.className).toContain('flex-col')
  })
  it('knapperaden brytes, og ingenting tvinger bredde (gjelder alle bredder 390–1280)', () => {
    const { getByTestId, container } = skjerm()
    const knapper = getByTestId('resultat-knapper')
    expect(knapper.className).toContain('flex-wrap')
    expect(knapper.className).not.toContain('sm:flex-row')
    expect(knapper.querySelectorAll('button').length).toBeGreaterThanOrEqual(3)
    const html = container.innerHTML
    for (const forbudt of ['min-w-max', 'whitespace-nowrap', 'overflow-x-auto', 'w-screen']) expect(html, forbudt).not.toContain(forbudt)
    for (const b of knapper.querySelectorAll('button')) expect(b.className).toContain('max-w-full')
  })
})

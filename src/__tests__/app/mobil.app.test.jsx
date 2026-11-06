// @vitest-environment jsdom
// Etappe N «i appen». jsdom måler ikke layout (scrollWidth er alltid 0), så
// her testes det som kan testes: tallinja ruller til starttallet og viser at
// den fortsetter, høyttalerknappen har stor trykkflate, og knappene på
// forsiden bryter lange ord. Selve breddemålingen (320–412) er gjort i Chrome,
// se docs/etappeN.md.
import './setup.js'
import { describe, it, expect, afterEach, beforeAll, afterAll } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { NumberLine } from '../../components/ui.jsx'
import { Visual } from '../../components/TaskVisual.jsx'
import { SpeakButton } from '../../components/Speak.jsx'
import { speech } from '../../speech.js'
import { StarProvider } from '../../StarContext.jsx'
import Home from '../../activities/Home.jsx'
import { TOPICS } from '../../data/topics.js'

afterEach(cleanup)

// Lat som rutene står 40 punkter fra hverandre og at feltet er 280 bredt.
const CELLE = 40
let scrollLeftVerdi = 0
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
    configurable: true,
    get() {
      const n = this.getAttribute?.('data-tall')
      return n != null ? 8 + Number(n) * CELLE : 0
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, get: () => 21 * CELLE + 16 })
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 280 })
  Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
    configurable: true,
    get: () => scrollLeftVerdi,
    set: (v) => {
      scrollLeftVerdi = v
    },
  })
})
afterAll(() => {
  delete HTMLElement.prototype.offsetLeft
  delete HTMLElement.prototype.scrollWidth
  delete HTMLElement.prototype.clientWidth
  delete HTMLElement.prototype.scrollLeft
})

describe('tallinja i hjelpen', () => {
  it('ruller til starttallet når den åpnes, og viser at linja fortsetter til høyre', () => {
    scrollLeftVerdi = 0
    render(<NumberLine from={0} to={20} start={7} />)
    expect(scrollLeftVerdi).toBe(7 * CELLE)
    expect(screen.getByTestId('tallinje-mer-hoyre')).toBeTruthy()
    expect(screen.getByTestId('tallinje-mer-venstre')).toBeTruthy()
  })
  it('starter på 0 uten rulling, og viser bare pil til høyre', () => {
    scrollLeftVerdi = 0
    render(<NumberLine from={0} to={20} start={0} />)
    expect(scrollLeftVerdi).toBe(0)
    expect(screen.queryByTestId('tallinje-mer-venstre')).toBeNull()
    expect(screen.getByTestId('tallinje-mer-hoyre')).toBeTruthy()
  })
})

describe('bredder', () => {
  it('høyttalerknappen har trykkflate på minst 44 × 44', () => {
    speech.supported = () => true
    render(<SpeakButton text="hei" size="text-xl" />)
    const b = screen.getByLabelText('Les høyt')
    expect(b.className).toContain('min-w-[44px]')
    expect(b.className).toContain('min-h-[44px]')
  })
  it('brøkstripen med ti ruter har ingen fast bredde', () => {
    const { container } = render(<Visual visual={{ kind: 'brok', deler: 10, farget: 1 }} />)
    const stripe = container.firstChild
    expect(stripe.className).not.toContain('w-max')
    expect(stripe.children).toHaveLength(10)
    for (const r of stripe.children) expect(r.className).toContain('flex-1')
  })
  it('knappene under Fri lek lar lange ord brytes', () => {
    render(
      <StarProvider>
        <Home topics={TOPICS} onPick={() => {}} onSamling={() => {}} onGarden={() => {}} onParents={() => {}} onSwitchProfile={() => {}} onMatte={() => {}} onLesing={() => {}} onNoetter={() => {}} onDagens={() => {}} onFag={() => {}} />
      </StarProvider>,
    )
    for (const navn of ['Geografistigen', 'Klokkestigen', 'Engelskstigen', 'Eventyrkartet']) {
      const tittel = screen.getByText(navn)
      expect(tittel.className).toContain('[overflow-wrap:anywhere]')
      const knapp = tittel.closest('button')
      expect(knapp.className).toContain('min-w-0')
    }
  })
})

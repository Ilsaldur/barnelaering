import { Component } from 'react'
import { BigButton } from './ui.jsx'

// Feilgrense (runde 6, etappe AC): en feil i en stige eller i appen gir et
// kort med «Noe gikk galt» og knappene «Prøv igjen» og «Hjem» – aldri hvit
// skjerm. «Prøv igjen» tegner innholdet på nytt; «Hjem» går til forsiden.
export default class Feilgrense extends Component {
  constructor(props) {
    super(props)
    this.state = { feil: null, forsok: 0 }
  }

  static getDerivedStateFromError(feil) {
    return { feil }
  }

  componentDidCatch(feil, info) {
    if (typeof console !== 'undefined' && !this.props.stille) console.error('Feil i appen:', feil, info?.componentStack)
  }

  componentDidUpdate(prev) {
    // Nytt innhold (f.eks. ny skjerm) nullstiller feilen.
    if (this.state.feil && prev.nokkel !== this.props.nokkel) this.setState({ feil: null })
  }

  render() {
    if (!this.state.feil) return this.props.children
    const utenNett = typeof navigator !== 'undefined' && navigator.onLine === false
    return (
      <div data-testid="feilkort" className="bg-white/95 rounded-3xl p-6 md:p-8 shadow-xl text-center max-w-lg mx-auto mt-6 animate-pop-in">
        <p className="text-6xl mb-2">🦊</p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">Noe gikk galt</h2>
        <p className="text-slate-600 font-bold mb-5">{utenNett ? 'Det ser ut som nettet er borte. Prøv igjen, eller gå hjem så lenge.' : 'Det var ikke din feil. Prøv igjen, eller gå hjem.'}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <BigButton color="bg-emerald-500" onClick={() => this.setState((s) => ({ feil: null, forsok: s.forsok + 1 }))}>
            🔁 Prøv igjen
          </BigButton>
          <BigButton color="bg-sky-500" onClick={() => this.props.onHome?.()}>
            🏠 Hjem
          </BigButton>
        </div>
      </div>
    )
  }
}

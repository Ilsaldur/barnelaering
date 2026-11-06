import { useEffect, useState } from 'react'
import { TopBar, Mascot, Confetti, StarRating, BigButton } from './ui.jsx'
import { SpeakButton } from './Speak.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { celebrate, resultMessage, resultTitle } from '../lib/scoring.js'

// Felles resultatskjerm etter en runde. Feirer bare ved godt resultat;
// ved svakt resultat får barnet en vennlig oppfordring til å prøve igjen.
// `before` legges over knapperaden (sjefstilbud, nivåmeldinger, samlekort);
// `children` er ekstra knapper. Raden brytes over flere linjer på smale skjermer.
export default function RoundDone({ correct, total, stars, onAgain, onHome, onNext, againLabel = '🔁 En gang til', before = null, melding = null, children }) {
  const [confetti, setConfetti] = useState(false)
  const message = melding || resultMessage(stars, correct, total)

  useEffect(() => {
    if (celebrate(stars)) {
      setConfetti(true)
      sound.fanfare()
      const id = setTimeout(() => setConfetti(false), 2500)
      speech.auto(message)
      return () => clearTimeout(id)
    }
    speech.auto(message)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="animate-pop-in">
      <Confetti show={confetti} />
      <TopBar title={resultTitle(stars)} onHome={onHome} />
      <div className="bg-white/90 rounded-3xl p-6 text-center shadow-xl mt-4">
        <div className="flex items-start justify-center gap-2">
          <Mascot mood={stars >= 2 ? 'cheer' : stars === 1 ? 'happy' : 'think'} message={message} />
          <SpeakButton text={message} />
        </div>
        <div className="my-6">
          <StarRating earned={stars} />
        </div>
        {before && (
          <div data-testid="resultat-meldinger" className="flex flex-col items-stretch gap-3 mb-4 max-w-xl mx-auto">
            {before}
          </div>
        )}
        <div data-testid="resultat-knapper" className="flex flex-wrap gap-3 justify-center">
          {onNext && stars === 3 && (
            <BigButton color="bg-fuchsia-500" className="max-w-full" onClick={onNext}>
              🚀 Neste nivå!
            </BigButton>
          )}
          <BigButton color="bg-emerald-500" className="max-w-full" onClick={onAgain}>
            {againLabel}
          </BigButton>
          {children}
          <BigButton color="bg-sky-500" className="max-w-full" onClick={onHome}>
            🏠 Tilbake
          </BigButton>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { TopBar, Mascot, NumberLine, BigButton } from '../components/ui.jsx'
import { SpeakButton, useAutoSpeak, AutoSpeakToggle } from '../components/Speak.jsx'
import RoundDone from '../components/RoundDone.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { pick } from '../lib/rng.js'
import { makeMathRound, hasVisualHelp } from '../lib/matte.js'
import { starsFor } from '../lib/scoring.js'
import { ROUND_LENGTH } from '../lib/round.js'

const EMOJIS = ['🍎', '🎈', '⭐', '🍓', '🐠', '🌸', '🍪', '🚗']

// Viser mengder med emojis for addisjon/subtraksjon (bak Hjelp-knappen).
function VisualCount({ problem, emoji }) {
  if (problem.type === 'add') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 text-3xl md:text-4xl">
        <span className="flex flex-wrap gap-1 max-w-[40%] justify-center">
          {Array.from({ length: problem.a }).map((_, i) => (
            <span key={i}>{emoji}</span>
          ))}
        </span>
        <span className="font-extrabold text-slate-500">+</span>
        <span className="flex flex-wrap gap-1 max-w-[40%] justify-center">
          {Array.from({ length: problem.b }).map((_, i) => (
            <span key={i}>{emoji}</span>
          ))}
        </span>
      </div>
    )
  }
  if (problem.type === 'sub') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-1 text-3xl md:text-4xl">
        {Array.from({ length: problem.a }).map((_, i) => (
          <span key={i} className={i >= problem.a - problem.b ? 'opacity-25 line-through' : ''}>
            {emoji}
          </span>
        ))}
      </div>
    )
  }
  return null
}

function newRound(config) {
  return makeMathRound(config, { n: ROUND_LENGTH }).map((p) => ({ ...p, emoji: pick(EMOJIS) }))
}

export default function MathActivity({ go, config = {}, onNextLevel }) {
  const { addStars } = useStars()
  const title = config?.title ? `${config.title} ${config.emoji || '🔢'}`.trim() : 'Matte 🔢'

  const [round, setRound] = useState(() => newRound(config))
  const [stage, setStage] = useState('play') // play | done
  const [qIndex, setQIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [help, setHelp] = useState(false) // Hjelp er av som standard

  const problem = round[qIndex]
  const spoken = problem ? `Hva er ${problem.spoken}?` : ''
  useAutoSpeak(spoken, [qIndex, stage])

  function start() {
    setRound(newRound(config))
    setQIndex(0)
    setCorrect(0)
    setPicked(null)
    setFeedback(null)
    setHelp(false)
    setStage('play')
  }

  function answer(opt) {
    if (feedback) return
    setPicked(opt)
    if (opt === problem.answer) {
      setFeedback('right')
      setCorrect((c) => c + 1)
      sound.correct()
      speech.auto('Riktig!')
    } else {
      setFeedback('wrong')
      sound.wrong()
      speech.auto(`Svaret er ${problem.answer}.`)
    }
  }

  function next() {
    if (qIndex + 1 >= round.length) {
      const stars = starsFor(correct, round.length)
      addStars(stars, { correct, total: round.length })
      setStage('done')
    } else {
      setQIndex((i) => i + 1)
      setPicked(null)
      setFeedback(null)
      setHelp(false)
    }
  }

  if (stage === 'done') {
    return (
      <RoundDone
        correct={correct}
        total={round.length}
        stars={starsFor(correct, round.length)}
        onAgain={start}
        onHome={() => go('home')}
        onNext={onNextLevel}
      />
    )
  }

  const canHelp = hasVisualHelp(problem)
  const lineStart = problem.type === 'add' ? problem.a : problem.type === 'sub' ? problem.a : null

  return (
    <div className="animate-pop-in">
      <TopBar title={title} onHome={() => go('home')} />

      <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
        <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${(qIndex / round.length) * 100}%` }} />
      </div>
      <p className="text-center text-white font-bold text-lg mb-2">
        Oppgave {qIndex + 1} av {round.length}
      </p>

      <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
        <div className="flex items-center justify-center gap-3 mb-2">
          <p className="text-center text-5xl md:text-6xl font-extrabold text-slate-700">{problem.text} = ?</p>
          <SpeakButton text={spoken} />
        </div>

        {canHelp && (
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={() => {
                sound.click()
                setHelp((h) => !h)
              }}
              className="kid-btn bg-sky-100 text-sky-700 text-base px-4 py-2 mb-1"
            >
              {help ? '🙈 Skjul hjelp' : '💡 Hjelp'}
            </button>
            {help && (
              <div className="mt-2">
                <VisualCount problem={problem} emoji={problem.emoji} />
                <NumberLine from={0} to={20} start={lineStart} />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
          {problem.options.map((opt) => {
            const isPicked = picked === opt
            const isAnswer = opt === problem.answer
            let color = 'bg-indigo-500'
            if (feedback) {
              if (isAnswer) color = 'bg-emerald-500'
              else if (isPicked) color = 'bg-rose-400'
              else color = 'bg-slate-300'
            }
            return (
              <button
                key={opt}
                disabled={!!feedback}
                onClick={() => answer(opt)}
                className={`kid-btn ${color} text-white text-4xl md:text-5xl py-6 ${
                  feedback && isAnswer ? 'animate-bouncey' : ''
                } ${feedback && isPicked && !isAnswer ? 'animate-shake' : ''}`}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {feedback && (
          <div className="mt-5 flex flex-col items-center gap-3">
            <Mascot
              mood={feedback === 'right' ? 'cheer' : 'oops'}
              message={feedback === 'right' ? 'Riktig! 🎉' : `Svaret er ${problem.answer}. Prøv neste!`}
              size="text-5xl"
            />
            <BigButton color="bg-amber-500" onClick={next}>
              {qIndex + 1 >= round.length ? '🏁 Se resultat' : '➡️ Neste'}
            </BigButton>
          </div>
        )}

        <AutoSpeakToggle current={spoken} />
      </div>
    </div>
  )
}

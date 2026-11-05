import { useState } from 'react'
import { TopBar, Mascot, BigButton } from '../components/ui.jsx'
import { SpeakButton, useAutoSpeak, AutoSpeakToggle } from '../components/Speak.jsx'
import RoundDone from '../components/RoundDone.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { ORD } from '../data/ord.js'
import { shuffle, pick } from '../lib/rng.js'
import { starsFor } from '../lib/scoring.js'
import { ROUND_LENGTH, uniqueRound } from '../lib/round.js'

const PROMPT = 'Hvilket ord passer til bildet?'

function makeRound(pool) {
  return uniqueRound(
    () => {
      const target = pick(pool)
      const wrong = shuffle(pool.filter((w) => w.word !== target.word)).slice(0, 3)
      return { target, options: shuffle([target, ...wrong]) }
    },
    Math.min(ROUND_LENGTH, pool.length),
    { keyOf: (q) => q.target.word },
  )
}

export default function Words({ go, config, onNextLevel }) {
  const { addStars } = useStars()
  // Yngre nivåer får bare korte ord (config.maxLen).
  const pool = config?.maxLen ? ORD.filter((w) => w.word.length <= config.maxLen) : ORD
  const [round, setRound] = useState(() => makeRound(pool))
  const [stage, setStage] = useState('play') // play | done
  const [qIndex, setQIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const question = round[qIndex]
  useAutoSpeak(PROMPT, [qIndex, stage])

  function answer(opt) {
    if (feedback) return
    setPicked(opt)
    if (opt.word === question.target.word) {
      setFeedback('right')
      setCorrect((c) => c + 1)
      sound.correct()
      speech.auto(`Riktig! ${question.target.word.toLowerCase()}.`)
    } else {
      setFeedback('wrong')
      sound.wrong()
      speech.auto(`Det er ${question.target.word.toLowerCase()}.`)
    }
  }

  function next() {
    if (qIndex + 1 >= round.length) {
      addStars(starsFor(correct, round.length), { correct, total: round.length })
      setStage('done')
    } else {
      setQIndex((i) => i + 1)
      setPicked(null)
      setFeedback(null)
    }
  }

  function restart() {
    setRound(makeRound(pool))
    setStage('play')
    setQIndex(0)
    setCorrect(0)
    setPicked(null)
    setFeedback(null)
  }

  if (stage === 'done') {
    return <RoundDone correct={correct} total={round.length} stars={starsFor(correct, round.length)} onAgain={restart} onHome={() => go('home')} onNext={onNextLevel} />
  }

  return (
    <div className="animate-pop-in">
      <TopBar title={config?.title ? `${config.title} ${config.emoji || '🔤'}` : 'Ord og bilder 🔤'} onHome={() => go('home')} />
      <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
        <div className="bg-violet-500 h-full transition-all duration-300" style={{ width: `${(qIndex / round.length) * 100}%` }} />
      </div>
      <p className="text-center text-white font-bold text-lg mb-2">
        Oppgave {qIndex + 1} av {round.length}
      </p>

      <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-center text-xl font-bold text-slate-500">{PROMPT}</p>
          <SpeakButton text={PROMPT} />
        </div>
        <div className="text-9xl text-center my-4 animate-pop-in">{question.target.emoji}</div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {question.options.map((opt) => {
            const isPicked = picked?.word === opt.word
            const isAnswer = opt.word === question.target.word
            let color = 'bg-violet-500'
            if (feedback) {
              if (isAnswer) color = 'bg-emerald-500'
              else if (isPicked) color = 'bg-rose-400'
              else color = 'bg-slate-300'
            }
            return (
              <button
                key={opt.word}
                disabled={!!feedback}
                onClick={() => answer(opt)}
                className={`kid-btn ${color} text-white text-3xl md:text-4xl py-6 tracking-wide ${feedback && isAnswer ? 'animate-bouncey' : ''} ${
                  feedback && isPicked && !isAnswer ? 'animate-shake' : ''
                }`}
              >
                {opt.word}
              </button>
            )
          })}
        </div>

        {feedback && (
          <div className="mt-5 flex flex-col items-center gap-3">
            <Mascot mood={feedback === 'right' ? 'cheer' : 'oops'} message={feedback === 'right' ? 'Riktig! 🎉' : `Det er ${question.target.word}!`} size="text-5xl" />
            <BigButton color="bg-amber-500" onClick={next}>
              {qIndex + 1 >= round.length ? '🏁 Se resultat' : '➡️ Neste'}
            </BigButton>
          </div>
        )}

        <AutoSpeakToggle current={PROMPT} />
      </div>
    </div>
  )
}

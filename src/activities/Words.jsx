import { useState } from 'react'
import { TopBar, Mascot, Confetti, StarRating, BigButton } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'

const QUESTIONS_PER_ROUND = 8

// Bilde (emoji) koblet til riktig norsk ord.
const WORDS = [
  { emoji: '🐶', word: 'HUND' },
  { emoji: '🐱', word: 'KATT' },
  { emoji: '🏠', word: 'HUS' },
  { emoji: '🚗', word: 'BIL' },
  { emoji: '🌞', word: 'SOL' },
  { emoji: '🐟', word: 'FISK' },
  { emoji: '🍎', word: 'EPLE' },
  { emoji: '🌳', word: 'TRE' },
  { emoji: '🚲', word: 'SYKKEL' },
  { emoji: '🐮', word: 'KU' },
  { emoji: '🌸', word: 'BLOMST' },
  { emoji: '⚽', word: 'BALL' },
  { emoji: '🐻', word: 'BJØRN' },
  { emoji: '🚀', word: 'RAKETT' },
  { emoji: '🍌', word: 'BANAN' },
  { emoji: '🐸', word: 'FROSK' },
  { emoji: '☂️', word: 'PARAPLY' },
  { emoji: '🐔', word: 'HØNE' },
  { emoji: '🌙', word: 'MÅNE' },
  { emoji: '🐝', word: 'BIE' },
]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function Words({ go, config }) {
  const { addStars } = useStars()
  // Yngre grader får bare korte ord (config.maxLen).
  const pool = config?.maxLen ? WORDS.filter((w) => w.word.length <= config.maxLen) : WORDS
  const [stage, setStage] = useState('play') // play | done
  const [question, setQuestion] = useState(() => makeQuestion())
  const [qIndex, setQIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [confetti, setConfetti] = useState(false)

  function makeQuestion() {
    const target = pool[randInt(0, pool.length - 1)]
    const wrong = shuffle(pool.filter((w) => w.word !== target.word)).slice(0, 3)
    return { target, options: shuffle([target, ...wrong]) }
  }

  function answer(opt) {
    if (feedback) return
    setPicked(opt)
    if (opt.word === question.target.word) {
      setFeedback('right')
      setCorrect((c) => c + 1)
      sound.correct()
    } else {
      setFeedback('wrong')
      sound.wrong()
    }
  }

  function next() {
    if (qIndex + 1 >= QUESTIONS_PER_ROUND) {
      setStage('done')
      let earned = 1
      if (correct >= QUESTIONS_PER_ROUND / 2) earned = 2
      if (correct >= QUESTIONS_PER_ROUND - 1) earned = 3
      setConfetti(true)
      sound.fanfare()
      addStars(earned)
      setTimeout(() => setConfetti(false), 2500)
    } else {
      setQIndex((i) => i + 1)
      setPicked(null)
      setFeedback(null)
      setQuestion(makeQuestion())
    }
  }

  function restart() {
    setStage('play')
    setQIndex(0)
    setCorrect(0)
    setPicked(null)
    setFeedback(null)
    setQuestion(makeQuestion())
  }

  if (stage === 'done') {
    let earned = 1
    if (correct >= QUESTIONS_PER_ROUND / 2) earned = 2
    if (correct >= QUESTIONS_PER_ROUND - 1) earned = 3
    return (
      <div className="animate-pop-in">
        <Confetti show={confetti} />
        <TopBar title="Bra jobba! 🎉" onHome={() => go('home')} />
        <div className="bg-white/90 rounded-3xl p-6 text-center shadow-xl mt-4">
          <Mascot mood="cheer" message={`Du fikk ${correct} av ${QUESTIONS_PER_ROUND} riktig!`} />
          <div className="my-6">
            <StarRating earned={earned} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BigButton color="bg-violet-500" onClick={restart}>
              🔁 En gang til
            </BigButton>
            <BigButton color="bg-sky-500" onClick={() => go('home')}>
              🏠 Hjem
            </BigButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-pop-in">
      <Confetti show={confetti} />
      <TopBar title={config?.title ? `${config.title} ${config.emoji || '🔤'}` : 'Ord og bilder 🔤'} onHome={() => go('home')} />
      <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
        <div
          className="bg-violet-500 h-full transition-all duration-300"
          style={{ width: `${(qIndex / QUESTIONS_PER_ROUND) * 100}%` }}
        />
      </div>

      <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
        <p className="text-center text-xl font-bold text-slate-500 mb-2">
          Hvilket ord passer til bildet?
        </p>
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
                className={`kid-btn ${color} text-white text-3xl md:text-4xl py-6 tracking-wide ${
                  feedback && isAnswer ? 'animate-bouncey' : ''
                } ${feedback && isPicked && !isAnswer ? 'animate-shake' : ''}`}
              >
                {opt.word}
              </button>
            )
          })}
        </div>

        {feedback && (
          <div className="mt-5 flex flex-col items-center gap-3">
            <Mascot
              mood={feedback === 'right' ? 'cheer' : 'oops'}
              message={feedback === 'right' ? 'Riktig! 🎉' : `Det er ${question.target.word}!`}
              size="text-5xl"
            />
            <BigButton color="bg-amber-500" onClick={next}>
              {qIndex + 1 >= QUESTIONS_PER_ROUND ? '🏁 Se resultat' : '➡️ Neste'}
            </BigButton>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { TopBar, Mascot, Confetti, StarRating, BigButton } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'

// Generisk flervalgsquiz drevet av data (config.bank).
// Hvert element: { show?, count?, caption?, prompt?, answer, options? }
//  - show:    stor emoji/bokstav som vises
//  - count:   vis `show` så mange ganger (for telling)
//  - caption: liten tekst under bildet (f.eks. ordet)
//  - prompt:  spørsmålstekst (faller tilbake på config.prompt)
//  - answer:  riktig svar (tekst)
//  - options: faste svaralternativer. Mangler de, lages de fra de andre svarene.

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildOptions(item, bank) {
  if (item.options) return shuffle(item.options)
  const others = [...new Set(bank.map((b) => b.answer))].filter((a) => a !== item.answer)
  const distract = shuffle(others).slice(0, 3)
  return shuffle([item.answer, ...distract])
}

// Trekk `rounds` oppgaver. Unngå å gjenta samme rett etter hverandre.
function makeRound(config) {
  const rounds = config.rounds || 6
  const bank = config.bank || []
  let pool = shuffle(bank)
  const items = []
  for (let i = 0; i < rounds; i++) {
    if (pool.length === 0) pool = shuffle(bank)
    const it = pool.shift()
    items.push({ ...it, _options: buildOptions(it, bank) })
  }
  return items
}

function starsFor(correct, total) {
  let earned = 1
  if (correct >= total / 2) earned = 2
  if (correct >= total - 1) earned = 3
  return earned
}

export default function QuizEngine({ go, config }) {
  const { addStars } = useStars()
  const [items, setItems] = useState(() => makeRound(config))
  const [stage, setStage] = useState('play') // play | done
  const [qIndex, setQIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [confetti, setConfetti] = useState(false)

  const total = items.length
  const item = items[qIndex]
  const baseColor = config.color || 'bg-indigo-500'
  const title = `${config.title || 'Quiz'} ${config.emoji || ''}`.trim()

  function answer(opt) {
    if (feedback) return
    setPicked(opt)
    if (opt === item.answer) {
      setFeedback('right')
      setCorrect((c) => c + 1)
      sound.correct()
    } else {
      setFeedback('wrong')
      sound.wrong()
    }
  }

  function next() {
    if (qIndex + 1 >= total) {
      setStage('done')
      setConfetti(true)
      sound.fanfare()
      addStars(starsFor(correct, total))
      setTimeout(() => setConfetti(false), 2500)
    } else {
      setQIndex((i) => i + 1)
      setPicked(null)
      setFeedback(null)
    }
  }

  function restart() {
    setItems(makeRound(config))
    setStage('play')
    setQIndex(0)
    setCorrect(0)
    setPicked(null)
    setFeedback(null)
  }

  if (stage === 'done') {
    return (
      <div className="animate-pop-in">
        <Confetti show={confetti} />
        <TopBar title="Bra jobba! 🎉" onHome={() => go('home')} />
        <div className="bg-white/90 rounded-3xl p-6 text-center shadow-xl mt-4">
          <Mascot mood="cheer" message={`Du fikk ${correct} av ${total} riktig!`} />
          <div className="my-6">
            <StarRating earned={starsFor(correct, total)} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BigButton color="bg-emerald-500" onClick={restart}>
              🔁 En gang til
            </BigButton>
            <BigButton color="bg-sky-500" onClick={() => go('home')}>
              🏠 Tilbake
            </BigButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-pop-in">
      <Confetti show={confetti} />
      <TopBar title={title} onHome={() => go('home')} />

      <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
        <div
          className="bg-amber-400 h-full transition-all duration-300"
          style={{ width: `${(qIndex / total) * 100}%` }}
        />
      </div>

      <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
        <p className="text-center text-xl md:text-2xl font-bold text-slate-600 mb-2">
          {item.prompt || config.prompt}
        </p>

        {/* Visuell del: én stor emoji, eller mange (telling), eller bokstav. */}
        {item.show &&
          (item.count ? (
            <div className="flex flex-wrap justify-center gap-1 md:gap-2 text-4xl md:text-6xl my-4 max-w-lg mx-auto">
              {Array.from({ length: item.count }).map((_, i) => (
                <span key={i}>{item.show}</span>
              ))}
            </div>
          ) : (
            <div className="text-8xl md:text-9xl text-center my-3 animate-pop-in">{item.show}</div>
          ))}

        {item.caption && (
          <p className="text-center text-2xl md:text-3xl font-extrabold tracking-widest text-slate-400 mb-2">
            {item.caption}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
          {item._options.map((opt) => {
            const isPicked = picked === opt
            const isAnswer = opt === item.answer
            let color = baseColor
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
                className={`kid-btn ${color} text-white text-2xl md:text-3xl py-5 md:py-6 ${
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
              message={feedback === 'right' ? 'Riktig! 🎉' : `Det riktige er ${item.answer}!`}
              size="text-5xl"
            />
            <BigButton color="bg-amber-500" onClick={next}>
              {qIndex + 1 >= total ? '🏁 Se resultat' : '➡️ Neste'}
            </BigButton>
          </div>
        )}
      </div>
    </div>
  )
}

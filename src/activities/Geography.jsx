import { useState } from 'react'
import { TopBar, Mascot, Confetti, StarRating, BigButton } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { COUNTRIES, REGIONS } from '../data/countries.js'

const QUESTIONS_PER_ROUND = 6

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// Hvilke land er med, ut fra valgt område (kumulativt).
function countriesFor(region) {
  if (region === 'norden') return COUNTRIES.filter((c) => c.region === 'norden')
  if (region === 'europa') return COUNTRIES.filter((c) => c.region === 'norden' || c.region === 'europa')
  return COUNTRIES
}

export default function Geography({ go }) {
  const { addStars } = useStars()
  const [region, setRegion] = useState('norden')
  const [mode, setMode] = useState('explore') // explore | quiz | done
  const [selected, setSelected] = useState(null)

  // Quiz-tilstand
  const [question, setQuestion] = useState(null)
  const [qIndex, setQIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [confetti, setConfetti] = useState(false)

  const pool = countriesFor(region)

  // Lag et quiz-spørsmål.
  function makeQuestion() {
    const target = pool[randInt(0, pool.length - 1)]
    const askCapital = Math.random() < 0.5
    const wrong = shuffle(pool.filter((c) => c.id !== target.id)).slice(0, 3)
    const options = shuffle([target, ...wrong])
    return {
      askCapital,
      target,
      options,
      text: askCapital
        ? `Hva er hovedstaden i ${target.name}? ${target.flag}`
        : `Hvilket land har hovedstaden ${target.capital}?`,
    }
  }

  function startQuiz() {
    setMode('quiz')
    setQIndex(0)
    setCorrect(0)
    setPicked(null)
    setFeedback(null)
    setQuestion(makeQuestion())
  }

  function answer(opt) {
    if (feedback) return
    setPicked(opt)
    if (opt.id === question.target.id) {
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
      setMode('done')
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

  // ---- Områdevelger (vises alltid øverst i utforsk) ----
  function RegionPicker() {
    return (
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {REGIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => {
              sound.click()
              setRegion(r.id)
              setSelected(null)
            }}
            className={`kid-btn px-5 py-3 text-lg md:text-xl ${
              region === r.id ? 'bg-white text-emerald-600 scale-105' : 'bg-emerald-700/40 text-white'
            }`}
          >
            {r.emoji} {r.label}
          </button>
        ))}
      </div>
    )
  }

  // ---- FERDIG ----
  if (mode === 'done') {
    let earned = 1
    if (correct >= QUESTIONS_PER_ROUND / 2) earned = 2
    if (correct >= QUESTIONS_PER_ROUND - 1) earned = 3
    return (
      <div className="animate-pop-in">
        <Confetti show={confetti} />
        <TopBar title="Geografi 🌍" onHome={() => go('home')} />
        <div className="bg-white/90 rounded-3xl p-6 text-center shadow-xl mt-4">
          <Mascot mood="cheer" message={`Du fikk ${correct} av ${QUESTIONS_PER_ROUND} riktig!`} />
          <div className="my-6">
            <StarRating earned={earned} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BigButton color="bg-emerald-500" onClick={startQuiz}>
              🔁 En gang til
            </BigButton>
            <BigButton color="bg-sky-500" onClick={() => setMode('explore')}>
              🗺️ Utforsk kartet
            </BigButton>
          </div>
        </div>
      </div>
    )
  }

  // ---- QUIZ ----
  if (mode === 'quiz') {
    return (
      <div className="animate-pop-in">
        <Confetti show={confetti} />
        <TopBar title="Geografi-quiz 🌍" onHome={() => go('home')} />
        <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(qIndex / QUESTIONS_PER_ROUND) * 100}%` }}
          />
        </div>

        <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
          <p className="text-center text-2xl md:text-3xl font-extrabold text-slate-700 mb-5">
            {question.text}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {question.options.map((opt) => {
              const isPicked = picked?.id === opt.id
              const isAnswer = opt.id === question.target.id
              let color = 'bg-teal-500'
              if (feedback) {
                if (isAnswer) color = 'bg-emerald-500'
                else if (isPicked) color = 'bg-rose-400'
                else color = 'bg-slate-300'
              }
              const label = question.askCapital ? opt.capital : `${opt.flag} ${opt.name}`
              return (
                <button
                  key={opt.id}
                  disabled={!!feedback}
                  onClick={() => answer(opt)}
                  className={`kid-btn ${color} text-white text-2xl md:text-3xl py-5 ${
                    feedback && isAnswer ? 'animate-bouncey' : ''
                  } ${feedback && isPicked && !isAnswer ? 'animate-shake' : ''}`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {feedback && (
            <div className="mt-5 flex flex-col items-center gap-3">
              <Mascot
                mood={feedback === 'right' ? 'cheer' : 'oops'}
                message={
                  feedback === 'right'
                    ? 'Riktig! 🎉'
                    : `Det er ${question.askCapital ? question.target.capital : question.target.name}!`
                }
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

  // ---- UTFORSK: klikkbart "kart" med flagg ----
  return (
    <div className="animate-pop-in">
      <TopBar title="Land og flagg 🌍" onHome={() => go('home')} />
      <RegionPicker />

      <div className="flex justify-center mb-4">
        <BigButton color="bg-rose-500" onClick={startQuiz}>
          🎯 Start quiz!
        </BigButton>
      </div>

      {/* Detaljpanel for valgt land */}
      {selected && (
        <div className="bg-white/95 rounded-3xl p-6 mb-4 shadow-xl text-center animate-pop-in">
          <div className="text-8xl mb-2">{selected.flag}</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-700">{selected.name}</h2>
          <p className="text-xl md:text-2xl text-slate-500 mt-1">
            Hovedstad: <span className="font-bold text-emerald-600">{selected.capital}</span>
          </p>
        </div>
      )}

      {/* Klikkbare land */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {pool.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              sound.click()
              setSelected(c)
            }}
            className={`kid-btn p-3 flex flex-col items-center hover:scale-105 ${
              selected?.id === c.id ? 'bg-white scale-105' : 'bg-white/80'
            }`}
          >
            <span className="text-5xl md:text-6xl">{c.flag}</span>
            <span className="text-base md:text-lg font-bold text-slate-700 mt-1">{c.name}</span>
          </button>
        ))}
      </div>
      <p className="text-center text-white font-bold text-lg mt-4">
        👆 Trykk på et land for å se hovedstaden!
      </p>
    </div>
  )
}

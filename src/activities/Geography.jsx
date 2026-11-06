import { useState } from 'react'
import { TopBar, Mascot, BigButton } from '../components/ui.jsx'
import { SpeakButton, useAutoSpeak, AutoSpeakToggle } from '../components/Speak.jsx'
import RoundDone from '../components/RoundDone.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { COUNTRIES, REGIONS } from '../data/countries.js'
import { shuffle, pick } from '../lib/rng.js'
import { starsFor } from '../lib/scoring.js'
import { ROUND_LENGTH, uniqueRound } from '../lib/round.js'

// Hvilke land er med, ut fra valgt område (kumulativt).
function countriesFor(region) {
  if (region === 'norden') return COUNTRIES.filter((c) => c.region === 'norden')
  if (region === 'europa') return COUNTRIES.filter((c) => c.region === 'norden' || c.region === 'europa')
  return COUNTRIES
}

function makeQuestion(pool) {
  const target = pick(pool)
  const askCapital = Math.random() < 0.5
  const wrong = shuffle(pool.filter((c) => c.id !== target.id)).slice(0, 3)
  return {
    askCapital,
    target,
    options: shuffle([target, ...wrong]),
    text: askCapital ? `Hva er hovedstaden i ${target.name}? ${target.flag}` : `Hvilket land har hovedstaden ${target.capital}?`,
    spoken: askCapital ? `Hva er hovedstaden i ${target.name}?` : `Hvilket land har hovedstaden ${target.capital}?`,
  }
}

function makeRound(pool) {
  // Norden har bare fem land: der kan samme land spørres om både land og hovedstad.
  return uniqueRound(() => makeQuestion(pool), ROUND_LENGTH, { keyOf: (q) => `${q.target.id}:${q.askCapital}` })
}

export default function Geography({ go, config, onNextLevel }) {
  const { addStars } = useStars()
  const locked = !!config?.region // nivået låser hvilket område som vises
  const [region, setRegion] = useState(config?.region || 'norden')
  const [mode, setMode] = useState('explore') // explore | quiz | done
  const [selected, setSelected] = useState(null)

  const [round, setRound] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const pool = countriesFor(region)
  const question = round[qIndex]
  const spoken = mode === 'quiz' && question ? question.spoken : ''
  useAutoSpeak(spoken, [qIndex, mode])

  function startQuiz() {
    setRound(makeRound(pool))
    setMode('quiz')
    setQIndex(0)
    setCorrect(0)
    setPicked(null)
    setFeedback(null)
  }

  function answer(opt) {
    if (feedback) return
    setPicked(opt)
    const facit = question.askCapital ? question.target.capital : question.target.name
    if (opt.id === question.target.id) {
      setFeedback('right')
      setCorrect((c) => c + 1)
      sound.correct()
      speech.auto('Riktig!')
    } else {
      setFeedback('wrong')
      sound.wrong()
      speech.auto(`Det er ${facit}.`)
    }
  }

  function next() {
    if (qIndex + 1 >= round.length) {
      addStars(starsFor(correct, round.length), { correct, total: round.length })
      setMode('done')
    } else {
      setQIndex((i) => i + 1)
      setPicked(null)
      setFeedback(null)
    }
  }

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
            className={`kid-btn px-5 py-3 text-lg md:text-xl ${region === r.id ? 'bg-white text-emerald-600 scale-105' : 'bg-emerald-700/40 text-white'}`}
          >
            {r.emoji} {r.label}
          </button>
        ))}
      </div>
    )
  }

  if (mode === 'done') {
    return (
      <RoundDone correct={correct} total={round.length} stars={starsFor(correct, round.length)} onAgain={startQuiz} onHome={() => go('home')} onNext={onNextLevel}>
        <BigButton color="bg-teal-500" onClick={() => setMode('explore')}>
          🗺️ Utforsk kartet
        </BigButton>
      </RoundDone>
    )
  }

  if (mode === 'quiz') {
    return (
      <div className="animate-pop-in">
        <TopBar title="Geografi-quiz 🌍" onHome={() => go('home')} />
        <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
          <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(qIndex / round.length) * 100}%` }} />
        </div>
        <p className="text-center text-white font-bold text-lg mb-2">
          Oppgave {qIndex + 1} av {round.length}
        </p>

        <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-5">
            <p className="text-center text-2xl md:text-3xl font-extrabold text-slate-700">{question.text}</p>
            <SpeakButton text={spoken} />
          </div>

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
                  className={`kid-btn ${color} text-white text-2xl md:text-3xl py-5 ${feedback && isAnswer ? 'animate-bouncey' : ''} ${
                    feedback && isPicked && !isAnswer ? 'animate-shake' : ''
                  }`}
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
                message={feedback === 'right' ? 'Riktig! 🎉' : `Det er ${question.askCapital ? question.target.capital : question.target.name}!`}
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

  // ---- UTFORSK: klikkbart «kart» med flagg ----
  return (
    <div className="animate-pop-in">
      <TopBar title="Land og flagg 🌍" onHome={() => go('home')} />
      {!locked && <RegionPicker />}

      <div className="flex justify-center mb-4">
        <BigButton color="bg-rose-500" onClick={startQuiz}>
          🎯 Start quiz!
        </BigButton>
      </div>

      {selected && (
        <div className="bg-white/95 rounded-3xl p-6 mb-4 shadow-xl text-center animate-pop-in">
          <div className="text-8xl mb-2">{selected.flag}</div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-700">{selected.name}</h2>
            <SpeakButton text={`${selected.name}. Hovedstaden er ${selected.capital}.`} />
          </div>
          <p className="text-xl md:text-2xl text-slate-500 mt-1">
            Hovedstad: <span className="font-bold text-emerald-600">{selected.capital}</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {pool.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              sound.click()
              setSelected(c)
              speech.auto(`${c.name}. Hovedstaden er ${c.capital}.`)
            }}
            className={`kid-btn p-3 flex flex-col items-center hover:scale-105 ${selected?.id === c.id ? 'bg-white scale-105' : 'bg-white/80'}`}
          >
            <span className="text-5xl md:text-6xl">{c.flag}</span>
            <span className="text-base md:text-lg font-bold text-slate-700 mt-1">{c.name}</span>
          </button>
        ))}
      </div>
      <p className="text-center text-white font-bold text-lg mt-4">👆 Trykk på et land for å se hovedstaden!</p>
    </div>
  )
}

import { useState } from 'react'
import { TopBar, Mascot, NumberLine, Confetti, StarRating, BigButton } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'

const QUESTIONS_PER_ROUND = 8

// Brukes når Math kjøres uten config (gammel 3-nivå-meny).
const LEVELS = {
  lett: { label: 'Lett', emoji: '🐣', color: 'bg-emerald-500', sub: 'Tall 1–10', params: { ops: ['add', 'sub'], max: 10 } },
  middels: { label: 'Middels', emoji: '🐥', color: 'bg-amber-500', sub: 'Tall 1–20', params: { ops: ['add', 'sub'], max: 20 } },
  vanskelig: { label: 'Vanskelig', emoji: '🦅', color: 'bg-rose-500', sub: '1–100 og gangetabell', params: { ops: ['add', 'sub', 'mul'], max: 100, mulMax: 5 } },
}

const EMOJIS = ['🍎', '🎈', '⭐', '🍓', '🐠', '🌸', '🍪', '🚗']

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)]
}

// Fyll ut standardverdier for et sett regne-parametre.
function fullParams(p) {
  return {
    ops: p.ops || ['add', 'sub'],
    max: p.max || 20,
    mulMax: p.mulMax || 5,
    mulFactors: p.mulFactors || null,
    divMax: p.divMax || 10,
  }
}

// Lag ett regnestykke ut fra parametrene.
function makeProblem(params) {
  const op = pick(params.ops)

  if (op === 'mul') {
    const a = params.mulFactors ? pick(params.mulFactors) : randInt(1, params.mulMax)
    const b = randInt(1, params.mulFactors ? 10 : params.mulMax)
    return { type: 'mul', a, b, answer: a * b, text: `${a} × ${b}`, visual: false }
  }
  if (op === 'div') {
    const b = randInt(2, params.divMax)
    const ans = randInt(2, params.divMax)
    const a = b * ans
    return { type: 'div', a, b, answer: ans, text: `${a} ÷ ${b}`, visual: false }
  }
  if (op === 'add') {
    const a = randInt(1, Math.max(1, Math.floor(params.max / 2)))
    const b = randInt(1, Math.max(1, params.max - a))
    return { type: 'add', a, b, answer: a + b, text: `${a} + ${b}`, visual: a + b <= 20 }
  }
  // sub
  const a = randInt(2, params.max)
  const b = randInt(1, a)
  return { type: 'sub', a, b, answer: a - b, text: `${a} − ${b}`, visual: a <= 20 }
}

// Lag 4 svaralternativer der ett er riktig.
function makeOptions(answer) {
  const ceil = Math.max(answer + 12, 25)
  const opts = new Set([answer])
  let guard = 0
  while (opts.size < 4 && guard < 50) {
    guard++
    const cand = answer + randInt(-5, 5)
    if (cand >= 0 && cand <= ceil) opts.add(cand)
  }
  let n = 0
  while (opts.size < 4) opts.add(answer + ++n)
  return [...opts].sort(() => Math.random() - 0.5)
}

// Viser mengder med emojis for addisjon/subtraksjon.
function VisualCount({ problem }) {
  const emoji = problem._emoji
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

export default function MathActivity({ go, config }) {
  const { addStars } = useStars()
  // Med config hopper vi over nivåmenyen og bruker gradens parametre direkte.
  const configured = !!(config && config.ops)
  const cfgParams = configured ? fullParams(config) : null
  const title = config?.title ? `${config.title} ${config.emoji || '🔢'}`.trim() : 'Matte 🔢'

  const [level, setLevel] = useState(null)
  const [stage, setStage] = useState(configured ? 'play' : 'menu') // menu | play | done
  const [problem, setProblem] = useState(() => (configured ? withEmoji(makeProblem(cfgParams)) : null))
  const [options, setOptions] = useState(() => (problem ? makeOptions(problem.answer) : []))
  const [qIndex, setQIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [showNumberLine, setShowNumberLine] = useState(true)
  const [confetti, setConfetti] = useState(false)

  function withEmoji(p) {
    p._emoji = pick(EMOJIS)
    return p
  }

  function activeParams() {
    return configured ? cfgParams : fullParams(LEVELS[level].params)
  }

  function nextProblem(params) {
    const p = withEmoji(makeProblem(params))
    setProblem(p)
    setOptions(makeOptions(p.answer))
    setPicked(null)
    setFeedback(null)
  }

  // Brukes både for valgt nivå (legacy) og for "en gang til" (config).
  function start(lvl) {
    if (lvl) setLevel(lvl)
    setQIndex(0)
    setCorrect(0)
    setStage('play')
    nextProblem(lvl ? fullParams(LEVELS[lvl].params) : activeParams())
  }

  function answer(opt) {
    if (feedback) return
    setPicked(opt)
    if (opt === problem.answer) {
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
      finish()
    } else {
      setQIndex((i) => i + 1)
      nextProblem(activeParams())
    }
  }

  function finish() {
    setStage('done')
    let earned = 1
    if (correct >= QUESTIONS_PER_ROUND / 2) earned = 2
    if (correct >= QUESTIONS_PER_ROUND - 1) earned = 3
    setConfetti(true)
    sound.fanfare()
    addStars(earned)
    setTimeout(() => setConfetti(false), 2500)
  }

  // ---- MENY: velg vanskelighetsnivå (kun uten config) ----
  if (stage === 'menu') {
    return (
      <div className="animate-pop-in">
        <TopBar title="Matte 🔢" onHome={() => go('home')} />
        <div className="flex justify-center my-4">
          <Mascot message="Velg hvor vanskelig du vil ha det!" />
        </div>
        <div className="grid gap-4 md:gap-6 mt-4">
          {Object.entries(LEVELS).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => {
                sound.click()
                start(key)
              }}
              className={`kid-btn ${cfg.color} text-white p-6 flex items-center justify-between hover:scale-[1.02]`}
            >
              <span className="text-5xl md:text-6xl">{cfg.emoji}</span>
              <span className="flex-1 text-left ml-4">
                <span className="block text-3xl md:text-4xl font-extrabold">{cfg.label}</span>
                <span className="block text-lg md:text-xl opacity-95">{cfg.sub}</span>
              </span>
              <span className="text-4xl">▶️</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ---- FERDIG: vis resultat og stjerner ----
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
            <BigButton color="bg-emerald-500" onClick={() => start(configured ? null : level)}>
              🔁 En gang til
            </BigButton>
            {configured ? (
              <BigButton color="bg-sky-500" onClick={() => go('home')}>
                🏠 Tilbake
              </BigButton>
            ) : (
              <BigButton color="bg-sky-500" onClick={() => setStage('menu')}>
                📊 Bytt nivå
              </BigButton>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ---- SPILL: selve quizen ----
  const showLine = problem.type === 'add' || problem.type === 'sub'
  const lineMax = Math.min(Math.max(problem.a, problem.answer, 10), 20)
  return (
    <div className="animate-pop-in">
      <Confetti show={confetti} />
      <TopBar title={title} onHome={() => go('home')} />

      <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
        <div
          className="bg-amber-400 h-full transition-all duration-300"
          style={{ width: `${(qIndex / QUESTIONS_PER_ROUND) * 100}%` }}
        />
      </div>
      <p className="text-center text-white font-bold text-lg mb-2">
        Oppgave {qIndex + 1} av {QUESTIONS_PER_ROUND}
      </p>

      <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
        {problem.visual && (
          <div className="mb-4">
            <VisualCount problem={problem} />
          </div>
        )}

        <p className="text-center text-5xl md:text-6xl font-extrabold text-slate-700 mb-2">
          {problem.text} = ?
        </p>

        {showLine && (
          <div className="mt-2">
            <button
              onClick={() => {
                sound.click()
                setShowNumberLine((s) => !s)
              }}
              className="kid-btn bg-sky-100 text-sky-700 text-base px-4 py-2 mb-1"
            >
              {showNumberLine ? '🙈 Skjul tallinje' : '📏 Vis tallinje'}
            </button>
            {showNumberLine && (
              <NumberLine
                from={0}
                to={lineMax}
                highlight={[problem.answer].filter((n) => n <= 20)}
                marker={problem.type === 'add' ? problem.a : undefined}
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
          {options.map((opt) => {
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
              {qIndex + 1 >= QUESTIONS_PER_ROUND ? '🏁 Se resultat' : '➡️ Neste'}
            </BigButton>
          </div>
        )}
      </div>
    </div>
  )
}

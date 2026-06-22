import { useRef, useState } from 'react'
import { TopBar, Mascot, Confetti, StarRating, BigButton } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'

const QUESTIONS_PER_ROUND = 6

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// Gjør om klokkeslett til vennlig norsk tekst.
function timeText(hour, minute) {
  const h12 = ((hour + 11) % 12) + 1 // 1..12
  const next = (h12 % 12) + 1
  if (minute === 0) return `Klokka er ${h12}`
  if (minute === 15) return `Kvart over ${h12}`
  if (minute === 30) return `Halv ${next}`
  if (minute === 45) return `Kvart på ${next}`
  return `${h12}:${minute.toString().padStart(2, '0')}`
}

// Selve den analoge klokka. Viserne kan dras med fingeren.
function AnalogClock({ hour, minute, onChange, interactive = true, size = 280 }) {
  const ref = useRef(null)
  const [active, setActive] = useState(null) // 'hour' | 'minute'

  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 10

  const minuteAngle = minute * 6 // grader
  const hourAngle = (hour % 12) * 30 + minute * 0.5

  function handAt(angleDeg, length) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + Math.cos(rad) * length, y: cy + Math.sin(rad) * length }
  }

  function pointerToTime(e) {
    const rect = ref.current.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * size
    const py = ((e.clientY - rect.top) / rect.height) * size
    let deg = (Math.atan2(px - cx, -(py - cy)) * 180) / Math.PI
    if (deg < 0) deg += 360
    if (active === 'minute') {
      const m = (Math.round(deg / 30) * 5) % 60 // snap til hele 5 min
      onChange(hour, m)
    } else if (active === 'hour') {
      let h = Math.round(deg / 30) % 12
      if (h === 0) h = 12
      onChange(h, minute)
    }
  }

  const minTip = handAt(minuteAngle, r * 0.82)
  const hourTip = handAt(hourAngle, r * 0.55)

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      className="w-64 h-64 md:w-80 md:h-80 mx-auto touch-none select-none"
      onPointerMove={(e) => interactive && active && pointerToTime(e)}
      onPointerUp={() => setActive(null)}
      onPointerLeave={() => setActive(null)}
    >
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#facc15" strokeWidth="10" />
      {/* Tall 1–12 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const n = i + 1
        const pos = handAt(n * 30, r * 0.82)
        return (
          <text
            key={n}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size * 0.1}
            fontWeight="800"
            fill="#475569"
          >
            {n}
          </text>
        )
      })}
      {/* Timeviser (kort, tykk) */}
      <line
        x1={cx}
        y1={cy}
        x2={hourTip.x}
        y2={hourTip.y}
        stroke="#6366f1"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Minuttviser (lang, tynnere) */}
      <line
        x1={cx}
        y1={cy}
        x2={minTip.x}
        y2={minTip.y}
        stroke="#ec4899"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Gripepunkt for timeviser */}
      {interactive && (
        <circle
          cx={hourTip.x}
          cy={hourTip.y}
          r="18"
          fill="#6366f1"
          opacity={active === 'hour' ? 0.5 : 0.85}
          onPointerDown={() => setActive('hour')}
          style={{ cursor: 'grab' }}
        />
      )}
      {/* Gripepunkt for minuttviser */}
      {interactive && (
        <circle
          cx={minTip.x}
          cy={minTip.y}
          r="18"
          fill="#ec4899"
          opacity={active === 'minute' ? 0.5 : 0.85}
          onPointerDown={() => setActive('minute')}
          style={{ cursor: 'grab' }}
        />
      )}
      <circle cx={cx} cy={cy} r="10" fill="#475569" />
    </svg>
  )
}

export default function Clock({ go }) {
  const { addStars } = useStars()
  const [mode, setMode] = useState('learn') // learn | quiz | done
  const [hour, setHour] = useState(3)
  const [minute, setMinute] = useState(0)

  // Quiz
  const [target, setTarget] = useState({ hour: 3, minute: 0 })
  const [options, setOptions] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [confetti, setConfetti] = useState(false)

  function makeQuestion() {
    const h = randInt(1, 12)
    const m = shuffle([0, 0, 15, 30, 30, 45])[0] // oftest hele og halve
    const correctText = timeText(h, m)
    const opts = new Set([correctText])
    let guard = 0
    while (opts.size < 4 && guard < 40) {
      guard++
      const hh = randInt(1, 12)
      const mm = shuffle([0, 15, 30, 45])[0]
      opts.add(timeText(hh, mm))
    }
    setTarget({ hour: h, minute: m, text: correctText })
    setOptions(shuffle([...opts]))
  }

  function startQuiz() {
    setMode('quiz')
    setQIndex(0)
    setCorrect(0)
    setPicked(null)
    setFeedback(null)
    makeQuestion()
  }

  function answer(opt) {
    if (feedback) return
    setPicked(opt)
    if (opt === target.text) {
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
      makeQuestion()
    }
  }

  if (mode === 'done') {
    let earned = 1
    if (correct >= QUESTIONS_PER_ROUND / 2) earned = 2
    if (correct >= QUESTIONS_PER_ROUND - 1) earned = 3
    return (
      <div className="animate-pop-in">
        <Confetti show={confetti} />
        <TopBar title="Klokka 🕐" onHome={() => go('home')} />
        <div className="bg-white/90 rounded-3xl p-6 text-center shadow-xl mt-4">
          <Mascot mood="cheer" message={`Du fikk ${correct} av ${QUESTIONS_PER_ROUND} riktig!`} />
          <div className="my-6">
            <StarRating earned={earned} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BigButton color="bg-indigo-500" onClick={startQuiz}>
              🔁 En gang til
            </BigButton>
            <BigButton color="bg-sky-500" onClick={() => setMode('learn')}>
              🖐️ Øv mer
            </BigButton>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'quiz') {
    return (
      <div className="animate-pop-in">
        <Confetti show={confetti} />
        <TopBar title="Hva er klokka? 🕐" onHome={() => go('home')} />
        <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
          <div
            className="bg-indigo-500 h-full transition-all duration-300"
            style={{ width: `${(qIndex / QUESTIONS_PER_ROUND) * 100}%` }}
          />
        </div>
        <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
          <AnalogClock hour={target.hour} minute={target.minute} interactive={false} />
          <p className="text-center text-2xl md:text-3xl font-extrabold text-slate-700 my-4">
            Hva er klokka? 🤔
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt) => {
              const isPicked = picked === opt
              const isAnswer = opt === target.text
              let color = 'bg-purple-500'
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
                  className={`kid-btn ${color} text-white text-xl md:text-2xl py-5 ${
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
                message={feedback === 'right' ? 'Riktig! 🎉' : `Klokka er ${target.text}!`}
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

  // ---- LÆR: dra viserne ----
  return (
    <div className="animate-pop-in">
      <TopBar title="Lær klokka 🕐" onHome={() => go('home')} />
      <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
        <p className="text-center text-lg md:text-xl font-bold text-slate-500 mb-2">
          Dra <span className="text-pink-500">den lange</span> og{' '}
          <span className="text-indigo-500">den korte</span> viseren! 🖐️
        </p>
        <AnalogClock
          hour={hour}
          minute={minute}
          onChange={(h, m) => {
            setHour(h)
            setMinute(m)
            sound.click()
          }}
        />
        <div className="text-center mt-4">
          <div className="inline-block bg-indigo-100 rounded-2xl px-6 py-3">
            <span className="text-3xl md:text-4xl font-extrabold text-indigo-600">
              {timeText(hour, minute)}
            </span>
          </div>
        </div>

        {/* Raske knapper for å sette vanlige klokkeslett */}
        <div className="flex flex-wrap gap-2 justify-center mt-5">
          {[
            { h: 7, m: 0, label: '🥣 7 (frokost)' },
            { h: 12, m: 0, label: '🍝 12 (lunsj)' },
            { h: 3, m: 30, label: '🍪 halv 4' },
            { h: 8, m: 0, label: '😴 8 (legge seg)' },
          ].map((t) => (
            <button
              key={t.label}
              onClick={() => {
                sound.click()
                setHour(t.h)
                setMinute(t.m)
              }}
              className="kid-btn bg-purple-400 text-white px-4 py-3 text-base md:text-lg"
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <BigButton color="bg-rose-500" onClick={startQuiz}>
            🎯 Start quiz!
          </BigButton>
        </div>
      </div>
    </div>
  )
}

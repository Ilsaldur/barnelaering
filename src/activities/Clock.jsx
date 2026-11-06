import { useRef, useState } from 'react'
import { TopBar, Mascot, BigButton } from '../components/ui.jsx'
import { SpeakButton, useAutoSpeak, AutoSpeakToggle } from '../components/Speak.jsx'
import RoundDone from '../components/RoundDone.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { starsFor } from '../lib/scoring.js'
import { makeClockRound, timeSentence } from '../lib/klokke.js'

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
      {Array.from({ length: 12 }).map((_, i) => {
        const n = i + 1
        const pos = handAt(n * 30, r * 0.82)
        return (
          <text key={n} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.1} fontWeight="800" fill="#475569">
            {n}
          </text>
        )
      })}
      <line x1={cx} y1={cy} x2={hourTip.x} y2={hourTip.y} stroke="#6366f1" strokeWidth="12" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={minTip.x} y2={minTip.y} stroke="#ec4899" strokeWidth="8" strokeLinecap="round" />
      {interactive && (
        <circle cx={hourTip.x} cy={hourTip.y} r="18" fill="#6366f1" opacity={active === 'hour' ? 0.5 : 0.85} onPointerDown={() => setActive('hour')} style={{ cursor: 'grab' }} />
      )}
      {interactive && (
        <circle cx={minTip.x} cy={minTip.y} r="18" fill="#ec4899" opacity={active === 'minute' ? 0.5 : 0.85} onPointerDown={() => setActive('minute')} style={{ cursor: 'grab' }} />
      )}
      <circle cx={cx} cy={cy} r="10" fill="#475569" />
    </svg>
  )
}

export default function Clock({ go, config, onNextLevel }) {
  const { addStars } = useStars()
  const mode = config?.minutes || 'quarter'
  const learnTitle = config?.title ? `${config.title} 🕐` : 'Lær klokka 🕐'
  const [view, setView] = useState('learn') // learn | quiz | done
  const [hour, setHour] = useState(3)
  const [minute, setMinute] = useState(0)

  // Quiz
  const [round, setRound] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const q = round[qIndex]
  const spoken = view === 'quiz' && q ? 'Hva er klokka?' : ''
  useAutoSpeak(spoken, [qIndex, view])

  function startQuiz() {
    setRound(makeClockRound(mode))
    setView('quiz')
    setQIndex(0)
    setCorrect(0)
    setPicked(null)
    setFeedback(null)
  }

  function answer(opt) {
    if (feedback) return
    setPicked(opt.label)
    if (opt.h === q.hour && opt.m === q.minute) {
      setFeedback('right')
      setCorrect((c) => c + 1)
      sound.correct()
      speech.auto(`Riktig! ${q.sentence}.`)
    } else {
      setFeedback('wrong')
      sound.wrong()
      speech.auto(`${q.sentence}.`)
    }
  }

  function next() {
    if (qIndex + 1 >= round.length) {
      addStars(starsFor(correct, round.length), { correct, total: round.length })
      setView('done')
    } else {
      setQIndex((i) => i + 1)
      setPicked(null)
      setFeedback(null)
    }
  }

  if (view === 'done') {
    return (
      <RoundDone correct={correct} total={round.length} stars={starsFor(correct, round.length)} onAgain={startQuiz} onHome={() => go('home')} onNext={onNextLevel}>
        <BigButton color="bg-indigo-500" onClick={() => setView('learn')}>
          🖐️ Øv mer
        </BigButton>
      </RoundDone>
    )
  }

  if (view === 'quiz') {
    return (
      <div className="animate-pop-in">
        <TopBar title="Hva er klokka? 🕐" onHome={() => go('home')} />
        <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
          <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${(qIndex / round.length) * 100}%` }} />
        </div>
        <p className="text-center text-white font-bold text-lg mb-2">
          Oppgave {qIndex + 1} av {round.length}
        </p>
        <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
          <AnalogClock hour={q.hour} minute={q.minute} interactive={false} />
          <div className="flex items-center justify-center gap-2 my-4">
            <p className="text-center text-2xl md:text-3xl font-extrabold text-slate-700">Hva er klokka? 🤔</p>
            <SpeakButton text={spoken} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt) => {
              const isPicked = picked === opt.label
              const isAnswer = opt.h === q.hour && opt.m === q.minute
              let color = 'bg-purple-500'
              if (feedback) {
                if (isAnswer) color = 'bg-emerald-500'
                else if (isPicked) color = 'bg-rose-400'
                else color = 'bg-slate-300'
              }
              return (
                <button
                  key={opt.label}
                  disabled={!!feedback}
                  onClick={() => answer(opt)}
                  className={`kid-btn ${color} text-white text-xl md:text-2xl py-5 ${feedback && isAnswer ? 'animate-bouncey' : ''} ${
                    feedback && isPicked && !isAnswer ? 'animate-shake' : ''
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
          {feedback && (
            <div className="mt-5 flex flex-col items-center gap-3">
              <Mascot mood={feedback === 'right' ? 'cheer' : 'oops'} message={feedback === 'right' ? 'Riktig! 🎉' : `${q.sentence}!`} size="text-5xl" />
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

  // ---- LÆR: dra viserne ----
  const shown = timeSentence(hour, minute)
  return (
    <div className="animate-pop-in">
      <TopBar title={learnTitle} onHome={() => go('home')} />
      <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
        <p className="text-center text-lg md:text-xl font-bold text-slate-500 mb-2">
          Dra <span className="text-pink-500">den lange</span> og <span className="text-indigo-500">den korte</span> viseren! 🖐️
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
        <div className="text-center mt-4 flex items-center justify-center gap-2">
          <div className="inline-block bg-indigo-100 rounded-2xl px-6 py-3">
            <span className="text-3xl md:text-4xl font-extrabold text-indigo-600">{shown}</span>
          </div>
          <SpeakButton text={shown} />
        </div>

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

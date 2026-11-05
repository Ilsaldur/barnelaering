import { useEffect, useRef, useState } from 'react'
import { sound } from '../sound.js'

// Voksensperre: hold inne en knapp i tre sekunder, og skriv så hvilket år det er.
const HOLD_MS = 3000

export default function AdultGate({ onPass, title = 'Kun for voksne' }) {
  const [held, setHeld] = useState(false)
  const [progress, setProgress] = useState(0)
  const [year, setYear] = useState('')
  const [wrong, setWrong] = useState(false)
  const timer = useRef(null)
  const startedAt = useRef(null)

  function start(e) {
    e.preventDefault()
    if (held) return
    startedAt.current = Date.now()
    timer.current = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - startedAt.current) / HOLD_MS) * 100)
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(timer.current)
        setHeld(true)
        sound.click()
      }
    }, 50)
  }

  function cancel() {
    if (held) return
    clearInterval(timer.current)
    setProgress(0)
  }

  useEffect(() => () => clearInterval(timer.current), [])

  function check(e) {
    e.preventDefault()
    if (Number(year) === new Date().getFullYear()) onPass()
    else {
      setWrong(true)
      setYear('')
    }
  }

  return (
    <div className="bg-white/95 rounded-3xl p-6 shadow-xl max-w-sm mx-auto mt-8 text-center">
      <p className="text-5xl mb-3">🔒</p>
      <h2 className="text-xl font-extrabold text-slate-700 mb-1">{title}</h2>

      {!held ? (
        <>
          <p className="text-slate-500 font-semibold mb-4">Hold inne knappen i tre sekunder.</p>
          <button
            type="button"
            onPointerDown={start}
            onPointerUp={cancel}
            onPointerLeave={cancel}
            onPointerCancel={cancel}
            onKeyDown={(e) => e.key === ' ' && start(e)}
            onKeyUp={cancel}
            onContextMenu={(e) => e.preventDefault()}
            className="relative kid-btn bg-slate-600 text-white w-full py-4 text-xl font-extrabold overflow-hidden select-none touch-none"
          >
            <span className="absolute inset-y-0 left-0 bg-sky-400/60 transition-none" style={{ width: `${progress}%` }} />
            <span className="relative">Hold inne …</span>
          </button>
        </>
      ) : (
        <form onSubmit={check}>
          <p className="text-slate-500 font-semibold mb-3">Hvilket år er det nå?</p>
          <input
            type="number"
            inputMode="numeric"
            autoFocus
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Årstall"
            className="w-40 text-center rounded-2xl border-2 border-slate-200 px-4 py-3 text-2xl font-extrabold focus:border-sky-400 outline-none"
          />
          {wrong && <p className="text-rose-500 font-bold text-sm mt-2">Det stemte ikke. Prøv igjen.</p>}
          <button type="submit" className="kid-btn bg-sky-500 text-white w-full py-3 text-xl font-extrabold mt-4">
            Åpne
          </button>
        </form>
      )}
    </div>
  )
}

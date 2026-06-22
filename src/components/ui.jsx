import { useEffect, useState } from 'react'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'

// Maskot – en glad rev som heier og reagerer på det som skjer.
// mood: 'happy' | 'cheer' | 'think' | 'oops'
export function Mascot({ mood = 'happy', message, size = 'text-7xl' }) {
  const face =
    mood === 'cheer' ? '🦊' : mood === 'oops' ? '🦊' : mood === 'think' ? '🦊' : '🦊'
  const anim =
    mood === 'cheer'
      ? 'animate-bouncey'
      : mood === 'oops'
        ? 'animate-shake'
        : 'animate-wiggle'
  const bubble =
    mood === 'cheer'
      ? '🎉 Bra jobba!'
      : mood === 'oops'
        ? '💪 Prøv igjen!'
        : mood === 'think'
          ? '🤔 Hmm...'
          : '👋 Hei!'
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${size} ${anim} drop-shadow-lg`}>{face}</div>
      <div className="bg-white text-slate-700 font-bold rounded-2xl px-4 py-2 shadow text-lg md:text-xl">
        {message || bubble}
      </div>
    </div>
  )
}

// Stor, fargerik knapp tilpasset små hender.
export function BigButton({ children, onClick, color = 'bg-sky-500', className = '', ...rest }) {
  return (
    <button
      onClick={(e) => {
        sound.click()
        onClick?.(e)
      }}
      className={`kid-btn ${color} text-white text-2xl md:text-3xl px-8 py-5 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

// Topplinje med "Hjem"-knapp og stjernetelling.
export function TopBar({ title, onHome }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <button
        onClick={() => {
          sound.click()
          onHome()
        }}
        className="kid-btn bg-white text-slate-700 text-xl md:text-2xl px-5 py-3 flex items-center gap-2"
      >
        🏠 <span className="hidden sm:inline">Hjem</span>
      </button>
      {title && (
        <h1 className="text-white font-extrabold text-2xl md:text-4xl drop-shadow text-center flex-1">
          {title}
        </h1>
      )}
      <StarCounter />
    </div>
  )
}

// Viser hvor mange stjerner barnet har samlet.
export function StarCounter() {
  const { stars, justEarned } = useStars()
  return (
    <div className="relative bg-white rounded-full px-4 py-2 shadow flex items-center gap-2 text-xl md:text-2xl font-extrabold text-amber-500">
      <span className={justEarned ? 'animate-sparkle' : ''}>⭐</span>
      <span className="text-slate-700">{stars}</span>
      {justEarned > 0 && (
        <span className="absolute -top-6 right-2 text-2xl animate-float-up text-amber-500">
          +{justEarned}⭐
        </span>
      )}
    </div>
  )
}

// Liten konfetti-eksplosjon (rene emojis, ingen bilder).
export function Confetti({ show }) {
  if (!show) return null
  const pieces = ['🎉', '⭐', '✨', '🎊', '🌟', '🎈', '💫']
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {Array.from({ length: 26 }).map((_, i) => {
        const left = (i * 37) % 100
        const delay = (i % 8) * 0.12
        const emoji = pieces[i % pieces.length]
        return (
          <span
            key={i}
            className="absolute text-3xl animate-float-up"
            style={{
              left: `${left}%`,
              bottom: '0%',
              animationDelay: `${delay}s`,
              animationDuration: `${1 + (i % 5) * 0.25}s`,
            }}
          >
            {emoji}
          </span>
        )
      })}
    </div>
  )
}

// En enkel tallinje som hjelpemiddel i matte.
export function NumberLine({ from = 0, to = 10, highlight = [], marker = null }) {
  const nums = []
  for (let n = from; n <= to; n++) nums.push(n)
  return (
    <div className="w-full overflow-x-auto py-3">
      <div className="flex items-end gap-1 min-w-max px-2">
        {nums.map((n) => {
          const isHi = highlight.includes(n)
          const isMarker = marker === n
          return (
            <div key={n} className="flex flex-col items-center w-9 md:w-11">
              {isMarker && <div className="text-2xl animate-bouncey">🐰</div>}
              <div
                className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-lg md:text-xl transition-all ${
                  isHi
                    ? 'bg-amber-400 text-white scale-110 shadow-lg'
                    : 'bg-white text-slate-600'
                }`}
              >
                {n}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Stjernebelønning som vises etter en quiz (0–3 stjerner ut fra resultat).
export function StarRating({ earned, total = 3 }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    setShown(0)
    let i = 0
    const id = setInterval(() => {
      i++
      setShown(i)
      if (i >= earned) clearInterval(id)
    }, 450)
    return () => clearInterval(id)
  }, [earned])
  return (
    <div className="flex justify-center gap-2 text-6xl">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={i < shown ? 'animate-pop-in' : 'opacity-25 grayscale'}
        >
          ⭐
        </span>
      ))}
    </div>
  )
}

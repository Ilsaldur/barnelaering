import { useEffect, useRef, useState } from 'react'
import { rullTil } from '../lib/tallinje.js'
import { useStars, useStarsOptional } from '../StarContext.jsx'
import { kostymeById } from '../data/kostymer.js'
import { sound } from '../sound.js'

// Maskot – en glad rev som heier og reagerer på det som skjer.
// mood: 'happy' | 'cheer' | 'think' | 'oops'
export function Mascot({ mood = 'happy', message, size = 'text-7xl' }) {
  const ctx = useStarsOptional()
  const kostyme = ctx?.data?.kostyme ? kostymeById(ctx.data.kostyme) : null
  const face = '🦊'
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
      <div className={`${size} ${anim} drop-shadow-lg relative inline-block`}>
        {face}
        {kostyme && (
          <span className="absolute -top-[0.35em] left-1/2 -translate-x-1/2 text-[0.55em]" title={kostyme.navn}>
            {kostyme.emoji}
          </span>
        )}
      </div>
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
      className={`kid-btn ${color} text-white text-2xl md:text-3xl px-8 py-5 max-w-full ${className}`}
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
        <h1 className="text-white font-extrabold text-lg sm:text-2xl md:text-4xl drop-shadow text-center flex-1 min-w-0 break-words leading-tight">
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

// Tallinje som hjelpemiddel i matte. Markerer ALDRI fasit: haren står på
// startpunktet, og barnet trykker på tall for å hoppe selv. Antall hopp vises.
export function NumberLine({ from = 0, to = 20, start = null }) {
  const [pos, setPos] = useState(start)
  const feltRef = useRef(null)
  const [kanter, setKanter] = useState({ venstre: false, hoyre: false })
  useEffect(() => setPos(start), [start, from, to])
  // Når tallinja åpnes, står starttallet til venstre i det synlige feltet.
  useEffect(() => {
    const el = feltRef.current
    if (!el) return
    const celle = el.querySelector(`[data-tall="${start ?? from}"]`)
    el.scrollLeft = celle && celle.offsetLeft > 0 ? Math.max(0, celle.offsetLeft - 8) : rullTil(start, from)
    oppdaterKanter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, from, to])
  function oppdaterKanter() {
    const el = feltRef.current
    if (!el) return
    const maks = el.scrollWidth - el.clientWidth
    setKanter({ venstre: el.scrollLeft > 2, hoyre: maks > 2 && el.scrollLeft < maks - 2 })
  }
  const nums = []
  for (let n = from; n <= to; n++) nums.push(n)
  const hops = pos != null && start != null ? pos - start : null
  const lo = Math.min(pos ?? start ?? from, start ?? from)
  const hi = Math.max(pos ?? start ?? from, start ?? from)
  return (
    <div className="w-full py-2">
      <div className="relative">
        <div ref={feltRef} data-testid="tallinje-felt" onScroll={oppdaterKanter} className="w-full overflow-x-auto scroll-smooth">
          <div className="flex items-end gap-1 min-w-max px-2 py-1">
          {nums.map((n) => {
            const isPos = pos === n
            const isStart = start === n
            const onPath = start != null && pos != null && n > lo && n < hi
            return (
              <div key={n} data-tall={n} className="flex flex-col items-center w-9 md:w-11">
                <div className="h-8 text-2xl leading-none">{isPos ? <span className="animate-bouncey inline-block">🐰</span> : ''}</div>
                <button
                  type="button"
                  onClick={() => setPos(n)}
                  className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-lg md:text-xl transition-all ${
                    isPos
                      ? 'bg-sky-500 text-white scale-110 shadow-lg'
                      : isStart
                        ? 'bg-sky-200 text-sky-800'
                        : onPath
                          ? 'bg-sky-100 text-slate-600'
                          : 'bg-white text-slate-600'
                  }`}
                >
                  {n}
                </button>
              </div>
            )
          })}
          </div>
        </div>
        {kanter.venstre && (
          <div data-testid="tallinje-mer-venstre" className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/95 to-transparent flex items-center justify-start pl-1 text-slate-400 font-extrabold text-2xl">
            ‹
          </div>
        )}
        {kanter.hoyre && (
          <div data-testid="tallinje-mer-hoyre" className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white/95 to-transparent flex items-center justify-end pr-1 text-slate-400 font-extrabold text-2xl">
            ›
          </div>
        )}
      </div>
      {hops != null && hops !== 0 && (
        <p className="text-center text-sky-700 font-bold mt-1">
          {Math.abs(hops)} hopp {hops > 0 ? 'fram' : 'tilbake'} fra {start}
        </p>
      )}
      {hops === 0 && <p className="text-center text-slate-400 font-bold mt-1">Trykk på et tall for å hoppe!</p>}
    </div>
  )
}

// Stjernebelønning som vises etter en quiz (0–3 stjerner ut fra resultat).
export function StarRating({ earned, total = 3 }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    setShown(0)
    if (!earned || earned <= 0) return undefined
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

import { useEffect, useState } from 'react'
import { speech } from '../speech.js'
import { sound } from '../sound.js'

// 🔊-knapp som leser opp en tekst.
export function SpeakButton({ text, lang, size = 'text-2xl md:text-3xl', className = '' }) {
  if (!speech.supported() || !text) return null
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        sound.click()
        speech.speak(text, { lang })
      }}
      className={`${size} hover:scale-110 active:scale-95 transition-transform ${className}`}
      title="Les høyt"
      aria-label="Les høyt"
    >
      🔊
    </button>
  )
}

// Les opp teksten automatisk når den endrer seg (hvis automatisk opplesing er på).
export function useAutoSpeak(text, deps = [], lang) {
  useEffect(() => {
    if (!text) return
    speech.auto(text, { lang })
    return () => speech.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

// Liten bryter for automatisk opplesing (brukes nederst i aktivitetene).
export function AutoSpeakToggle({ current }) {
  const [on, setOn] = useState(speech.autoEnabled())
  if (!speech.supported()) return null
  return (
    <div className="mt-4 text-center">
      <button
        type="button"
        onClick={() => {
          const next = !on
          setOn(next)
          speech.setAuto(next)
          if (next && current) speech.speak(current)
        }}
        className="text-sm font-bold text-slate-400 hover:text-slate-600"
      >
        {on ? '🔊 Opplesing på' : '🔇 Opplesing av'}
      </button>
    </div>
  )
}

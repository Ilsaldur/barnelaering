import { useState } from 'react'
import { BigButton } from './ui.jsx'
import { SpeakButton } from './Speak.jsx'
import { speech } from '../speech.js'
import { sound } from '../sound.js'

// En kort historiebit om reven, vist når barnet kommer til en ny verden.
// Kan leses opp eller leses selv.
export default function Historie({ historie, verden, onDone }) {
  const [lest, setLest] = useState(false)
  const tekst = `${historie.tittel}. ${historie.tekst}`
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className={`rounded-3xl p-6 shadow-2xl max-w-lg w-full animate-pop-in bg-gradient-to-br ${verden.gradient} max-h-[95vh] overflow-y-auto`}>
        <div className="text-center text-7xl mb-2">{verden.emoji}</div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 text-center mb-3">{historie.tittel}</h2>
        <div className="bg-white/90 rounded-2xl p-4">
          <p className="text-slate-700 font-semibold text-lg md:text-xl leading-relaxed">{historie.tekst}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <BigButton
            color="bg-violet-500"
            onClick={() => {
              speech.speak(tekst)
              setLest(true)
            }}
          >
            🔊 Les for meg
          </BigButton>
          <BigButton
            color="bg-emerald-500"
            onClick={() => {
              speech.stop()
              sound.click()
              onDone()
            }}
          >
            {lest ? '➡️ Fortsett' : '📖 Jeg leser selv – fortsett'}
          </BigButton>
        </div>
        <span className="hidden">
          <SpeakButton text={tekst} />
        </span>
      </div>
    </div>
  )
}

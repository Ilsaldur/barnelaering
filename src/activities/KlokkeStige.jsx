import { useState } from 'react'
import Stige from './Stige.jsx'
import AnalogClock from '../components/AnalogClock.jsx'
import { BigButton } from '../components/ui.jsx'
import { SpeakButton } from '../components/Speak.jsx'
import { sound } from '../sound.js'
import { NIVAER_KLOKKE, KLOKKE_OMRAADER, klokkeOmraadeFor } from '../data/klokke/nivaer.js'
import { genKlokke, klokkeSetning, digital } from '../lib/klokke/generatorer.js'

const START = [
  { id: 'hel', navn: 'Jeg lærer hele timer', emoji: '🕐', nivaa: 1, farge: 'bg-sky-500' },
  { id: 'halv', navn: 'Jeg kan hele og halve timer', emoji: '🕞', nivaa: 3, farge: 'bg-indigo-500' },
  { id: 'kvart', navn: 'Jeg kan kvart over og kvart på', emoji: '🕒', nivaa: 5, farge: 'bg-violet-500' },
  { id: 'digital', navn: 'Jeg kan klokka og vil øve digital og tidsregning', emoji: '⏱️', nivaa: 7, farge: 'bg-fuchsia-500' },
]

// Fri øving: dra viserne og se hva klokka er, på norsk og digitalt.
function Ovelse({ onClose }) {
  const [h, setH] = useState(3)
  const [m, setM] = useState(0)
  const [kveld, setKveld] = useState(false)
  const h24 = kveld ? (h % 12) + 12 : h % 12
  const tekst = klokkeSetning(h, m)
  return (
    <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl mb-4">
      <p className="text-center text-lg md:text-xl font-bold text-slate-500 mb-2">
        Dra <span className="text-pink-500">den lange</span> og <span className="text-indigo-500">den korte</span> viseren! 🖐️
      </p>
      <AnalogClock
        hour={h}
        minute={m}
        step={5}
        onChange={(hh, mm) => {
          setH(hh)
          setM(mm)
          sound.click()
        }}
      />
      <div className="text-center mt-4 flex flex-wrap items-center justify-center gap-2">
        <div className="inline-block bg-indigo-100 rounded-2xl px-6 py-3">
          <span className="text-2xl md:text-3xl font-extrabold text-indigo-600">{tekst}</span>
        </div>
        <SpeakButton text={tekst} />
        <div className="inline-block bg-slate-100 rounded-2xl px-6 py-3">
          <span className="text-2xl md:text-3xl font-extrabold text-slate-600 tabular-nums">{digital(h24, m)}</span>
        </div>
        <button onClick={() => setKveld((k) => !k)} className="kid-btn bg-slate-200 text-slate-600 px-4 py-2 text-base font-bold">
          {kveld ? '🌙 kveld' : '☀️ dag'}
        </button>
      </div>
      <div className="flex justify-center mt-5">
        <BigButton color="bg-sky-500" onClick={onClose}>
          ⬅️ Tilbake
        </BigButton>
      </div>
    </div>
  )
}

export default function KlokkeStige({ go }) {
  const [ov, setOv] = useState(false)
  const cfg = {
    id: 'klokke',
    tittel: 'Klokka',
    kartTittel: 'Klokkestigen',
    emoji: '🕐',
    nivaer: NIVAER_KLOKKE,
    verdener: KLOKKE_OMRAADER,
    gen: genKlokke,
    omraadeFor: klokkeOmraadeFor,
    start: START,
    ikoner: (n) => klokkeOmraadeFor(n.id).emoji,
    ekstra: (
      <BigButton color="bg-indigo-500" onClick={() => setOv(true)}>
        🖐️ Øv: dra viserne
      </BigButton>
    ),
    hubEkstra: ov ? <Ovelse onClose={() => setOv(false)} /> : null,
  }
  return <Stige cfg={cfg} go={go} />
}

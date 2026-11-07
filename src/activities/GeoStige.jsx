import { useState } from 'react'
import Stige from './Stige.jsx'
import VerdensKart from '../components/VerdensKart.jsx'
import Flagg from '../components/Flagg.jsx'
import { BigButton } from '../components/ui.jsx'
import { SpeakButton } from '../components/Speak.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { NIVAER_GEO, GEO_OMRAADER, geoOmraadeFor } from '../data/geo/nivaer.js'
import { genGeo } from '../lib/geo/generatorer.js'
import { REGIONER, landById } from '../data/geo/land.js'
import { kartPool } from '../lib/geo/kart.js'

// Utforsk kartet: trykk på et land og se flagg og hovedstad.
function Utforsk({ onClose }) {
  const [region, setRegion] = useState('norden')
  const [valgt, setValgt] = useState(null)
  const l = valgt ? landById(valgt) : null
  return (
    <div className="bg-white/95 rounded-3xl p-4 md:p-6 shadow-xl mb-4">
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        {REGIONER.map((r) => (
          <button
            key={r.id}
            onClick={() => {
              sound.click()
              setRegion(r.id)
              setValgt(null)
            }}
            className={`kid-btn px-4 py-2 text-base md:text-lg ${region === r.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            {r.emoji} {r.navn}
          </button>
        ))}
      </div>
      <VerdensKart
        region={region}
        visAlle
        picked={valgt}
        onPick={(id) => {
          sound.click()
          setValgt(id)
          const x = landById(id)
          if (x) speech.auto(`${x.navn}. Hovedstaden er ${x.hovedstad}.`)
        }}
      />
      <div className="text-center mt-3 min-h-[4rem]">
        {l ? (
          <div className="flex items-center justify-center gap-3">
            <Flagg kode={l.kode} navn={l.navn} className="w-20" />
            <div className="text-left">
              <p className="text-2xl font-extrabold text-slate-700">{l.navn}</p>
              <p className="text-slate-500 font-bold">Hovedstad: {l.hovedstad}</p>
            </div>
            <SpeakButton text={`${l.navn}. Hovedstaden er ${l.hovedstad}.`} />
          </div>
        ) : (
          <p className="text-slate-500 font-bold">👆 Trykk på et grønt land! {kartPool(region, { alle: true }).length} land å finne.</p>
        )}
      </div>
      <div className="flex justify-center mt-3">
        <BigButton color="bg-sky-500" onClick={onClose}>
          ⬅️ Tilbake
        </BigButton>
      </div>
    </div>
  )
}

export default function GeoStige({ go }) {
  const [ut, setUt] = useState(false)
  const cfg = {
    id: 'geografi',
    tittel: 'Geografi',
    kartTittel: 'Geografistigen',
    kunnskap: true, // ting vises før det spørres om dem
    emoji: '🌍',
    nivaer: NIVAER_GEO,
    verdener: GEO_OMRAADER,
    gen: genGeo,
    omraadeFor: geoOmraadeFor,
    ikoner: (n) => geoOmraadeFor(n.id).emoji,
    ekstra: (
      <BigButton color="bg-teal-500" onClick={() => setUt(true)}>
        🗺️ Utforsk kartet
      </BigButton>
    ),
    hubEkstra: ut ? <Utforsk onClose={() => setUt(false)} /> : null,
  }
  return <Stige cfg={cfg} go={go} />
}

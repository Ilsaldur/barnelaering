import { useEffect, useState } from 'react'
import { TopBar, Mascot, Confetti } from '../components/ui.jsx'
import { SpeakButton } from '../components/Speak.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { SETT, KORT, fagForKort } from '../data/kort.js'
import { FAG_LABELS } from '../lib/labels.js'
import { nivaaNavn } from '../data/stiger.js'
import Flagg from '../components/Flagg.jsx'
import { KOSTYMER, PLASSER } from '../data/kostymer.js'
import { harPaa } from '../lib/kostyme.js'
import Rev from '../components/Rev.jsx'
import { kisteStatus } from '../lib/samling.js'

// Faget barnet sist spilte (slik det står i loggen), til rekkefølgen på settene.
export function sistSpilteFag(log = []) {
  let best = null
  for (const e of log) if (e && e.fag && e.t && (!best || e.t > best.t) && SETT.some((s) => s.fag === e.fag)) best = e
  return best ? best.fag : 'matte'
}

// Samlingen: samlekort, revens garderobe og familiekisten.
export default function Samling({ go, onGarden, onFag }) {
  const { data, fag, balance, buyKostyme, setKostyme, familyStars, loadFamily, childProfiles, profile } = useStars()
  const [confetti, setConfetti] = useState(false)
  const [valgt, setValgt] = useState(null)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    loadFamily()
  }, [loadFamily])

  const kiste = kisteStatus(familyStars)
  const eier = new Set(data.kort)

  // Settet for faget barnet sist spilte står øverst og er åpent; de andre er
  // slått sammen til én linje med «x av y» til man trykker (runde 6, etappe AE).
  const sistFag = sistSpilteFag(data.log)
  const settRekkef = [...SETT].sort((a, b) => (a.fag === sistFag ? -1 : 0) - (b.fag === sistFag ? -1 : 0))
  const [aapne, setAapne] = useState(() => new Set())
  const erAapen = (sett) => sett.fag === sistFag || aapne.has(sett.id)

  const paa = data.kostymerPaa || []
  function kjop(k) {
    if (data.kostymer.includes(k.id)) {
      sound.click()
      setKostyme(k.id, !harPaa(paa, k.id))
      return
    }
    if (balance < k.pris) {
      sound.wrong()
      setMsg(`Du trenger ${k.pris - balance} stjerner til for ${k.navn.toLowerCase()}.`)
      return
    }
    // Saldoen er sjekket over, så kjøpet går gjennom.
    buyKostyme(k)
    sound.fanfare()
    setConfetti(true)
    const byttet = paa.map((id) => KOSTYMER.find((x) => x.id === id)).find((x) => x && x.plass === k.plass)
    setMsg(`${k.emoji} ${k.navn}! Reven har den ${PLASSER[k.plass]} nå${byttet ? `, i stedet for ${byttet.navn.toLowerCase()}` : ''}.`)
    setTimeout(() => setConfetti(false), 2000)
  }

  return (
    <div className="animate-pop-in">
      <Confetti show={confetti} />
      <TopBar title="Samlingen min 🏆" onHome={go} />

      <div className="flex justify-center mb-4">
        <Mascot message={msg || `Du får et kort hver gang du klarer et nivå med tre stjerner, eller går opp et nivå. Du har ${data.kort.length} av ${KORT.length} kort.`} />
      </div>

      {/* Samlekort, gruppert per fag. Sist spilte fag øverst og åpent, resten sammenslått. */}
      {settRekkef.map((sett, si) => {
        const kort = KORT.filter((k) => k.sett === sett.id)
        const har = kort.filter((k) => eier.has(k.id)).length
        const nyttFag = si === 0 || settRekkef[si - 1].fag !== sett.fag
        const aapen = erAapen(sett)
        return (
          <div key={sett.id} data-testid={`sett-${sett.id}`} data-aapen={aapen ? 'ja' : 'nei'} className={`bg-white/90 rounded-3xl shadow-xl ${aapen ? 'p-4 mb-4' : 'px-4 py-2 mb-2'}`}>
            {nyttFag && aapen && (
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400 mb-1">{sett.fag ? `${FAG_LABELS[sett.fag]?.emoji || ''} ${FAG_LABELS[sett.fag]?.navn || sett.fag}` : '✨ Bonus'}</p>
            )}
            <button
              type="button"
              aria-expanded={aapen}
              onClick={() => {
                sound.click()
                setAapne((a) => {
                  const n = new Set(a)
                  if (n.has(sett.id)) n.delete(sett.id)
                  else n.add(sett.id)
                  return n
                })
              }}
              className={`w-full flex items-center justify-between text-left ${aapen ? 'mb-3' : ''}`}
            >
              <h2 className={`font-extrabold text-slate-700 ${aapen ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
                {sett.emoji} {sett.navn}
              </h2>
              <span className="text-sm font-bold text-slate-400 whitespace-nowrap">
                {har} av {kort.length} {aapen ? '▴' : '▾'}
              </span>
            </button>
            {aapen && (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {kort.map((k) => {
                const have = eier.has(k.id)
                return (
                  <button
                    key={k.id}
                    data-testid={`kort-${k.id}`}
                    onClick={() => {
                      sound.click()
                      setValgt(k)
                      if (have) speech.auto(`${k.navn}. ${k.fakta}`)
                    }}
                    className={`rounded-2xl p-2 flex flex-col items-center shadow transition-transform ${have ? 'bg-white hover:scale-105' : 'bg-slate-100'}`}
                  >
                    <span className={`text-3xl md:text-4xl ${have ? '' : 'grayscale opacity-30'}`}>{have ? k.flagg ? <Flagg kode={k.flagg} navn={k.navn} className="w-10 md:w-12" /> : k.emoji : '❔'}</span>
                    <span className="text-[11px] md:text-xs font-bold text-slate-500 mt-1 text-center leading-tight">{have ? k.navn : k.nivaa ? `Nivå ${k.nivaa}` : '?'}</span>
                  </button>
                )
              })}
            </div>
            )}
          </div>
        )
      })}

      {valgt && eier.has(valgt.id) && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4" onClick={() => setValgt(null)}>
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center animate-pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-8xl mb-2 flex justify-center">{valgt.flagg ? <Flagg kode={valgt.flagg} navn={valgt.navn} className="w-32" /> : valgt.emoji}</div>
            <h3 className="text-2xl font-extrabold text-slate-700">{valgt.navn}</h3>
            <div className="flex items-start justify-center gap-2 mt-2">
              <p className="text-slate-600 font-semibold">{valgt.fakta}</p>
              <SpeakButton text={`${valgt.navn}. ${valgt.fakta}`} />
            </div>
            <button onClick={() => setValgt(null)} className="kid-btn bg-sky-500 text-white px-6 py-3 text-lg font-extrabold mt-4">
              Lukk
            </button>
          </div>
        </div>
      )}

      {/* Grått kort: hvor hører det til, og hva trengs? */}
      {valgt && !eier.has(valgt.id) && (() => {
        const f = fagForKort(valgt)
        const info = f ? FAG_LABELS[f] : null
        const staar = f ? fag?.[f]?.nivaa || 0 : 0
        const plassert = f && fag?.[f]?.plassert && fag?.[f]?.nivaa
        const passert = f && valgt.nivaa && plassert && staar > valgt.nivaa
        const tekst = !f
          ? 'Bonuskort dukker opp av og til når du gjør det godt i et oppdrag.'
          : passert
            ? `Du har passert nivå ${valgt.nivaa}. Spill det om igjen på kartet og klar det med tre stjerner, så er kortet ditt.`
            : `Klar nivå ${valgt.nivaa} med tre stjerner, eller gå opp fra nivået, så får du kortet.${!plassert && !['skrive', 'sprak'].includes(f) ? ' Reven finner først nivået ditt.' : ''}`
        return (
          <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4" onClick={() => setValgt(null)}>
            <div data-testid="kort-vindu" className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center animate-pop-in" onClick={(e) => e.stopPropagation()}>
              <div className="text-7xl mb-2">❔</div>
              {info && (
                <h3 className="text-2xl font-extrabold text-slate-700">
                  {info.emoji} {info.navn}, nivå {valgt.nivaa}
                </h3>
              )}
              {f && valgt.nivaa && <p className="text-sm font-bold text-slate-400 mt-1">{nivaaNavn(f, valgt.nivaa)}</p>}
              <div className="flex items-start justify-center gap-2 mt-3">
                <p className="text-slate-600 font-semibold">{tekst}</p>
                <SpeakButton text={tekst} />
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {f && onFag && (
                  <button
                    onClick={() => {
                      sound.click()
                      onFag(f)
                    }}
                    className="kid-btn bg-emerald-500 text-white px-6 py-3 text-lg font-extrabold"
                  >
                    Til {info.navn.toLowerCase()} nivå {valgt.nivaa}
                  </button>
                )}
                <button onClick={() => setValgt(null)} className="kid-btn bg-slate-200 text-slate-600 px-6 py-3 text-lg font-extrabold">
                  Lukk
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Garderobe */}
      <div className="bg-white/90 rounded-3xl p-4 shadow-xl mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-700">🎩 Revens garderobe</h2>
          <span className="bg-amber-100 text-amber-600 font-extrabold rounded-full px-4 py-1">Du kan bruke: {balance} ⭐</span>
        </div>
        <div className="flex justify-center mb-3">
          <Rev className="w-32 md:w-40 drop-shadow-lg" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-3">
          {KOSTYMER.map((k) => {
            const owned = data.kostymer.includes(k.id)
            const on = harPaa(paa, k.id)
            const affordable = balance >= k.pris
            return (
              <button
                key={k.id}
                onClick={() => kjop(k)}
                className={`rounded-2xl p-2 md:p-3 flex flex-col items-center shadow transition-transform ${on ? 'bg-amber-200 ring-4 ring-amber-400' : owned ? 'bg-emerald-50 hover:scale-105' : affordable ? 'bg-white hover:scale-105' : 'bg-slate-100 opacity-60'}`}
              >
                <span className="text-3xl md:text-4xl">{k.emoji}</span>
                <span className="text-xs md:text-sm font-bold text-slate-600">{k.navn}</span>
                <span className="text-[10px] font-bold text-slate-400">{PLASSER[k.plass]}</span>
                <span className={`text-sm font-extrabold ${on ? 'text-amber-600' : owned ? 'text-emerald-600' : 'text-amber-500'}`}>{on ? 'på' : owned ? 'ta på' : `${k.pris} ⭐`}</span>
              </button>
            )
          })}
        </div>
        <p className="text-center text-sm text-slate-400 font-semibold mt-3">Reven kan ha på én ting på hodet, én foran øynene, én rundt halsen, én i hånda og én på kroppen. Kjøper du noe nytt, tar det bare av det som lå på samme plass. Trykk på noe reven har på for å ta det av.</p>
      </div>

      {/* Familiekisten */}
      <div className="bg-white/90 rounded-3xl p-4 shadow-xl mb-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-700 mb-1">🧰 Familiekisten</h2>
        <p className="text-sm text-slate-500 font-semibold mb-3">
          Alle i familien fyller den samme kisten med stjernene sine{childProfiles.length > 1 ? ` (${childProfiles.map((c) => c.emoji).join(' ')})` : ''}.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-6xl">{kiste.nivaa >= 4 ? '💎' : kiste.nivaa >= 2 ? '🧰' : '📦'}</span>
          <div className="flex-1">
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>{kiste.forrige} ⭐</span>
              <span className="text-amber-600 text-lg">{kiste.sum} ⭐ til sammen</span>
              <span>{kiste.neste ? `${kiste.neste} ⭐` : '🌈'}</span>
            </div>
            <div className="bg-amber-100 rounded-full h-6 overflow-hidden mt-1">
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-full transition-all duration-700" style={{ width: `${kiste.pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <button onClick={onGarden} className="kid-btn bg-emerald-500 text-white w-full p-4 flex items-center justify-center gap-3 hover:scale-[1.02]">
        <span className="text-4xl">🌷</span>
        <span className="text-xl md:text-2xl font-extrabold">Hagen min</span>
      </button>
      {profile?.local && <p className="text-center text-xs text-white/80 font-semibold mt-3">Som gjest lagres samlingen bare på denne enheten.</p>}
    </div>
  )
}

import { StarCounter } from '../components/ui.jsx'
import { SpeakButton } from '../components/Speak.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { dagensKort, dagStatus, ukestripe, FAG_I_DAGEN } from '../lib/dagen.js'
import { STIGER } from '../data/stiger.js'

const KORT_INFO = {
  matte: { navn: 'Matte', emoji: '🔢', farge: 'bg-indigo-500' },
  lesing: { navn: 'Lesing', emoji: '📖', farge: 'bg-violet-500' },
  klokke: { navn: 'Klokka', emoji: '🕐', farge: 'bg-sky-500' },
  geografi: { navn: 'Geografi', emoji: '🌍', farge: 'bg-teal-500' },
  nott: { navn: 'Tenkenøtt', emoji: '🌰', farge: 'bg-amber-600' },
  engelsk: { navn: 'Engelsk', emoji: '🇬🇧', farge: 'bg-rose-500' },
}

// Barnets forside: «Dagens økt» øverst, fri lek under.
export default function Home({ onSamling, onGarden, onParents, onSwitchProfile, onMatte, onLesing, onNoetter, onDagens, onFag }) {
  const { profile, onLine, session, fag, data, settings } = useStars()
  const fagTilgjengelig = Object.keys(STIGER)
  const kort = dagensKort({ log: data.log, fagTilgjengelig })
  const status = dagStatus({ dager: data.dager, settings })
  const uke = ukestripe({ dager: data.dager, settings })

  const hilsen = status.ferdig
    ? 'Dagens økt er ferdig! 🎉 Stempel i boka.'
    : status.gjort === 0
      ? `Hei ${profile?.name || ''}! Velg ${status.maal === 1 ? 'ett' : status.maal === 2 ? 'to' : 'tre'} av kortene i dag.`
      : `${status.gjort} av ${status.maal} gjort. Ett til, så er dagen i boks!`

  // Samme dør fra kortet i Dagens økt og fra Fri lek.
  function aapne(fagId) {
    sound.click()
    if (fagId === 'matte') onMatte()
    else if (fagId === 'lesing') onLesing()
    else if (fagId === 'nott') onDagens('nott')
    else onDagens(fagId)
  }
  function velg(k) {
    aapne(k.fag)
  }

  return (
    <div className="animate-pop-in">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => {
            sound.click()
            onSwitchProfile()
          }}
          className="bg-white/90 rounded-full px-4 py-2 shadow flex items-center gap-2 text-lg font-extrabold text-slate-600 hover:scale-105 transition-transform"
        >
          <span className="text-2xl">{profile?.emoji || '🦊'}</span>
          {profile?.name || 'Spiller'}
        </button>
        <div className="flex items-center gap-2">
          {session && !onLine && (
            <span className="bg-white/90 rounded-full px-3 py-2 text-sm font-bold text-slate-500 shadow" title="Uten nett – fremgangen lagres her og synkes senere">
              📴
            </span>
          )}
          <StarCounter />
        </div>
      </div>

      <header className="text-center mb-4">
        <div className="text-6xl md:text-7xl animate-bouncey mb-1">🦊</div>
        <h1 className="text-white font-extrabold text-3xl md:text-5xl drop-shadow-lg">Selmas skole</h1>
      </header>

      {/* Dagens økt */}
      <section className="bg-white/95 rounded-3xl p-4 md:p-5 shadow-xl mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-700">📅 Dagens økt</h2>
          <div className="flex gap-1" title="Ukestripe: et stempel for hver dag du gjorde dagens økt">
            {uke.map((d) => (
              <div key={d.key} className={`w-7 h-9 md:w-8 md:h-10 rounded-lg flex flex-col items-center justify-center text-[10px] font-extrabold ${d.ferdig ? 'bg-emerald-400 text-white' : d.idag ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-300' : d.framtid ? 'bg-slate-50 text-slate-300' : 'bg-slate-100 text-slate-400'}`}>
                <span>{d.navn}</span>
                <span className="text-sm leading-none">{d.ferdig ? '✓' : d.idag ? '🦊' : ''}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-2 mb-3">
          <p className="text-slate-600 font-bold text-base md:text-lg">{hilsen}</p>
          <SpeakButton text={hilsen} size="text-xl" />
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {kort.map((k) => {
            const info = KORT_INFO[k.fag]
            const gjort = (status.fag[k.fag] || 0) > 0
            return (
              <button key={k.id} onClick={() => velg(k)} className={`kid-btn ${info.farge} text-white p-3 md:p-4 flex flex-col items-center gap-1 hover:scale-105 relative`}>
                {k.fast && <span className="absolute top-1 left-2 text-sm" title="Fast oppdrag">📌</span>}
                {gjort && <span className="absolute top-1 right-2 bg-white text-emerald-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-extrabold">✓</span>}
                <span className="text-4xl md:text-5xl">{k.overraskelse ? '🎁' : info.emoji}</span>
                <span className="text-base md:text-xl font-extrabold text-center leading-tight break-words [overflow-wrap:anywhere] max-w-full">{k.overraskelse ? 'Overraskelse' : info.navn}</span>
                {k.overraskelse && <span className="text-xs opacity-90">{info.emoji} {info.navn}</span>}
                {k.fag !== 'nott' && !k.overraskelse && <span className="text-xs opacity-90">{fag?.[k.fag]?.plassert && fag?.[k.fag]?.nivaa ? `nivå ${fag[k.fag].nivaa}` : 'Ny!'}</span>}
              </button>
            )
          })}
        </div>
      </section>

      {/* Fri lek: én dør per fag, samme navn og ikon som kortene i Dagens økt. */}
      <h2 className="text-white font-extrabold text-xl md:text-2xl drop-shadow mb-2 mt-5">🎈 Fri lek</h2>
      <div data-testid="fri-lek" className="grid grid-cols-2 gap-3 md:gap-4 mb-3">
        {FAG_I_DAGEN.map((id) => {
          const info = KORT_INFO[id]
          const f = fag?.[id]
          const maks = STIGER[id]?.length || 0
          const under = f?.plassert && f?.nivaa ? `Nivå ${f.nivaa} av ${maks}` : 'Ny!'
          return (
            <button key={id} onClick={() => aapne(id)} className={`kid-btn ${info.farge} text-white p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 min-w-0 hover:scale-[1.02]`}>
              <span className="text-4xl">{info.emoji}</span>
              <span className="text-center sm:text-left min-w-0 max-w-full">
                <span className="block text-base sm:text-lg md:text-xl font-extrabold break-words [overflow-wrap:anywhere] leading-tight">{info.navn}</span>
                <span className="block text-xs md:text-sm opacity-90 break-words [overflow-wrap:anywhere]">{under}</span>
              </span>
            </button>
          )
        })}
        <button onClick={() => { sound.click(); onNoetter() }} className="kid-btn bg-amber-700 text-white p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 min-w-0 hover:scale-[1.02]">
          <span className="text-4xl">🌰</span>
          <span className="text-center sm:text-left min-w-0 max-w-full">
            <span className="block text-base sm:text-lg md:text-xl font-extrabold break-words [overflow-wrap:anywhere] leading-tight">Nøttehula</span>
            <span className="block text-xs md:text-sm opacity-90 break-words [overflow-wrap:anywhere]">Tenkenøtter</span>
          </span>
        </button>
        <button onClick={() => { sound.click(); onSamling() }} className="kid-btn bg-amber-500 text-white p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 min-w-0 hover:scale-[1.02]">
          <span className="text-4xl">🏆</span>
          <span className="text-center sm:text-left min-w-0 max-w-full">
            <span className="block text-base sm:text-lg md:text-xl font-extrabold break-words [overflow-wrap:anywhere] leading-tight">Samlingen</span>
            <span className="block text-xs md:text-sm opacity-90 break-words [overflow-wrap:anywhere]">Kort, kostymer og kisten</span>
          </span>
        </button>
        <button onClick={() => { sound.click(); onGarden() }} className="kid-btn bg-emerald-500 text-white p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 min-w-0 hover:scale-[1.02]">
          <span className="text-4xl">🌷</span>
          <span className="text-center sm:text-left min-w-0 max-w-full">
            <span className="block text-base sm:text-lg md:text-xl font-extrabold break-words [overflow-wrap:anywhere] leading-tight">Hagen min</span>
            <span className="block text-xs md:text-sm opacity-90 break-words [overflow-wrap:anywhere]">Bruk stjernene</span>
          </span>
        </button>
      </div>

      <div className="mt-5 text-center">
        <button onClick={() => { sound.click(); onParents() }} className="text-white/70 text-sm font-bold underline hover:text-white">
          👨‍👩‍👧 For voksne
        </button>
      </div>
    </div>
  )
}

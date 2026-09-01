import { useEffect, useState } from 'react'
import { TopBar, BigButton } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { WORLDS, allStages, stageByKey, FIRST_STAGE } from '../data/campaign.js'

const AVATAR = '🦊'
const STORAGE = 'barnelaering_eventyr_v1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignorer */
  }
  return { pos: FIRST_STAGE, completed: {}, pending: null }
}

// Forrige bane i samme verden (for å låse opp i rekkefølge).
function prevKey(world, idx) {
  return idx === 0 ? null : `${world.id}-${idx}`
}

export default function Campaign({ go, onOpenStage }) {
  const { stars } = useStars()
  const [state, setState] = useState(loadState)
  const [msg, setMsg] = useState(null)

  function save(next) {
    setState(next)
    try {
      localStorage.setItem(STORAGE, JSON.stringify(next))
    } catch {
      /* ignorer */
    }
  }

  // Når man kommer tilbake fra en bane: tjente man stjerner, er banen fullført.
  useEffect(() => {
    if (!state.pending) return
    const gained = stars - state.pending.starsAt
    const next = { ...state, pending: null }
    if (gained > 0) {
      next.completed = { ...state.completed, [state.pending.key]: Math.min(3, gained) }
      next.pos = state.pending.key
    }
    save(next)
    // kjøres kun ved montering (retur fra aktivitet)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const worldUnlocked = (world) => stars >= world.gate
  const stageUnlocked = (world, idx) => {
    if (!worldUnlocked(world)) return false
    const pk = prevKey(world, idx)
    return pk === null || !!state.completed[pk]
  }

  function tapNode(s) {
    if (!stageUnlocked(s.world, s.idx)) {
      if (!worldUnlocked(s.world)) setMsg(`🔒 ${s.world.emoji} ${s.world.name} åpnes når du har ${s.world.gate} ⭐ (du har ${stars}).`)
      else setMsg('🔒 Fullfør banen før denne først!')
      sound.wrong()
      return
    }
    setMsg(null)
    if (state.pos !== s.key) {
      save({ ...state, pos: s.key }) // flytt avataren hit
      sound.click()
    } else {
      play(s.key) // står allerede her → spill
    }
  }

  function play(key) {
    const s = stageByKey(key)
    if (!s || !stageUnlocked(s.world, s.idx)) return
    save({ ...state, pos: key, pending: { key, starsAt: stars } })
    onOpenStage(key)
  }

  const stages = allStages()
  const posStage = stageByKey(state.pos)
  const posPlayable = posStage && stageUnlocked(posStage.world, posStage.idx)

  return (
    <div className="animate-pop-in">
      <TopBar title="Eventyret 🗺️" onHome={go} />

      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="bg-white rounded-full px-4 py-2 shadow font-extrabold text-xl text-amber-500">
          ⭐ {stars}
        </div>
      </div>

      <p className="text-center text-white font-bold text-base md:text-lg mb-3 drop-shadow">
        Trykk på en bane for å flytte {AVATAR} dit – trykk igjen for å spille!
      </p>

      {msg && (
        <div className="bg-white/95 rounded-2xl px-4 py-3 text-center font-bold text-slate-600 shadow mb-3 animate-pop-in">
          {msg}
        </div>
      )}

      {/* Verdener, hver med sin sti av baner */}
      <div className="space-y-4">
        {WORLDS.map((world) => {
          const wUnlocked = worldUnlocked(world)
          return (
            <div
              key={world.id}
              className={`rounded-3xl p-4 shadow-xl ${wUnlocked ? 'bg-white/85' : 'bg-white/40'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-700">
                  {world.emoji} Verden {world.id}: {world.name}
                </h2>
                {!wUnlocked && (
                  <span className="text-sm md:text-base font-bold text-slate-500">🔒 {world.gate} ⭐</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                {world.stages.map((stage, idx) => {
                  const key = `${world.id}-${idx + 1}`
                  const s = stages.find((x) => x.key === key)
                  const unlocked = stageUnlocked(world, idx)
                  const starsHere = state.completed[key] || 0
                  const isHere = state.pos === key
                  return (
                    <div key={key} className="flex items-center gap-2 md:gap-3">
                      {idx > 0 && <span className="text-slate-400 font-bold">···</span>}
                      <button
                        onClick={() => tapNode(s)}
                        className={`relative rounded-2xl w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center shadow transition-transform ${
                          unlocked ? `${s.activity?.color || 'bg-sky-500'} text-white hover:scale-105` : 'bg-slate-300 text-slate-500'
                        } ${isHere ? 'ring-4 ring-amber-400 scale-105' : ''}`}
                      >
                        <span className="text-[11px] md:text-xs font-extrabold opacity-90">{key}</span>
                        <span className="text-2xl md:text-3xl leading-none">
                          {unlocked ? s.activity?.emoji : '🔒'}
                        </span>
                        {starsHere > 0 && (
                          <span className="absolute -top-2 -right-1 bg-white rounded-full px-1.5 text-xs font-extrabold text-amber-500 shadow">
                            {'⭐'.repeat(starsHere)}
                          </span>
                        )}
                        {isHere && (
                          <span className="absolute -bottom-3 text-3xl md:text-4xl animate-bouncey z-10 drop-shadow">
                            {AVATAR}
                          </span>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Spill-knapp for banen avataren står på */}
      <div className="sticky bottom-3 mt-5 flex justify-center">
        <BigButton
          color={posPlayable ? 'bg-emerald-500' : 'bg-slate-400'}
          onClick={() => posPlayable && play(state.pos)}
        >
          {posPlayable ? `▶️ Spill bane ${state.pos}` : '🔒 Velg en åpen bane'}
        </BigButton>
      </div>
    </div>
  )
}

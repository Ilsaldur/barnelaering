import { useEffect, useState } from 'react'
import { TopBar, BigButton } from '../components/ui.jsx'
import AdultGate from '../components/AdultGate.jsx'
import { useStars, GUEST_PROFILE } from '../StarContext.jsx'
import { supabase } from '../lib/supabase.js'
import { speech } from '../speech.js'
import { TOPICS, recommendedIndex, topicProgress } from '../progress.js'
import { topicById } from '../data/topics.js'
import { emptyData, recentRounds, minutesLastWeek, weakestTypes, FAG, todayKey, effectiveAutoSpeak, nullstiltData } from '../lib/profil.js'
import { ukestripe } from '../lib/dagen.js'
import { FAG_LABELS, typeLabel } from '../lib/labels.js'
import { MAKS_NIVAA, nivaaNavn } from '../data/stiger.js'
import { settNivaa } from '../lib/matte/stige.js'

// Voksensiden: per barn – nivå per fag, oppdrag og minutter siste uke, de tre
// oppgavetypene barnet bommer mest på, og innstillinger. Bak voksensperren.

function Bar({ value, max, color = 'bg-emerald-400' }) {
  const pct = max > 0 ? Math.round((100 * value) / max) : 0
  return (
    <div className="bg-slate-100 rounded-full h-4 overflow-hidden flex-1">
      <div className={`${color} h-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white/95 rounded-3xl p-5 shadow-xl mb-4">
      <h2 className="text-lg md:text-xl font-extrabold text-slate-700 mb-3">{title}</h2>
      {children}
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`rounded-full px-4 py-2 text-base font-extrabold transition ${active ? 'bg-sky-500 text-white shadow' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
      {children}
    </button>
  )
}

// Denne uka dag for dag, og de fire siste ukene samlet.
function Ukeoversikt({ d }) {
  const uke = ukestripe({ dager: d.dager, settings: d.settings })
  const perDag = {}
  for (const e of d.log) {
    const k = todayKey(new Date(e.t))
    perDag[k] = perDag[k] || { runder: 0, oppdrag: 0, ms: 0, stars: 0, fag: {} }
    perDag[k].runder++
    if (e.oppdrag) perDag[k].oppdrag++
    perDag[k].ms += e.ms || 0
    perDag[k].stars += e.stars || 0
    if (e.fag) perDag[k].fag[e.fag] = (perDag[k].fag[e.fag] || 0) + 1
  }
  const uker = [0, 1, 2, 3].map((w) => {
    const now = new Date()
    const day = (now.getDay() + 6) % 7
    const monday = new Date(now)
    monday.setDate(now.getDate() - day - 7 * w)
    let runder = 0
    let min = 0
    let dager = 0
    let stars = 0
    for (let i = 0; i < 7; i++) {
      const dd = new Date(monday)
      dd.setDate(monday.getDate() + i)
      const k = todayKey(dd)
      const p = perDag[k]
      if (!p) continue
      runder += p.runder
      min += p.ms
      stars += p.stars
      if (p.runder) dager++
    }
    return { w, runder, min: Math.round(min / 60000), dager, stars }
  })
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-3">
        {uke.map((dag) => {
          const p = perDag[dag.key]
          return (
            <div key={dag.key} className={`rounded-xl p-1.5 text-center ${dag.ferdig ? 'bg-emerald-100' : dag.idag ? 'bg-amber-50 ring-2 ring-amber-300' : 'bg-slate-50'}`}>
              <p className="text-xs font-extrabold text-slate-500">{dag.navn}</p>
              <p className="text-lg leading-tight">{dag.ferdig ? '✅' : p?.runder ? '🟡' : dag.framtid ? '' : '·'}</p>
              <p className="text-[10px] font-bold text-slate-500">{p ? `${p.runder} r · ${Math.max(1, Math.round(p.ms / 60000))} min` : ''}</p>
              {p && Object.keys(p.fag).length > 0 && <p className="text-[10px] text-slate-400">{Object.entries(p.fag).map(([f, n]) => `${FAG_LABELS[f]?.emoji || '🎮'}${n}`).join(' ')}</p>}
            </div>
          )
        })}
      </div>
      <table className="w-full text-sm font-semibold text-slate-600">
        <thead>
          <tr className="text-xs text-slate-400">
            <th className="text-left">Uke</th>
            <th>Dager</th>
            <th>Runder</th>
            <th>Minutter</th>
            <th>Stjerner</th>
          </tr>
        </thead>
        <tbody>
          {uker.map((u) => (
            <tr key={u.w} className="border-t border-slate-100">
              <td className="py-1">{u.w === 0 ? 'Denne uka' : u.w === 1 ? 'Forrige uke' : `${u.w} uker siden`}</td>
              <td className="text-center">{u.dager}</td>
              <td className="text-center">{u.runder}</td>
              <td className="text-center">{u.min}</td>
              <td className="text-center">{u.stars} ⭐</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ChildPanel({ child, data, update, isActive }) {
  const [confirmReset, setConfirmReset] = useState(false)
  const d = data || emptyData()
  const week = recentRounds(d.log, 7)
  const oppdrag = week.filter((e) => e.oppdrag).length
  const minutter = minutesLastWeek(d.log)
  const weak = weakestTypes(d.attempts)
  const recent = [...d.log].reverse().slice(0, 8)
  const s = d.settings

  const setSettings = (partial) => update((cur) => ({ ...cur, settings: { ...cur.settings, ...partial, updatedAt: Date.now() } }))
  const setNivaa = (fag, nivaa) =>
    update((cur) => ({
      ...cur,
      fag: { ...cur.fag, [fag]: { ...settNivaa(cur.fag[fag], nivaa), updatedAt: Date.now() } },
    }))
  const toggleFag = (f) => {
    const cur = s.fagblanding || []
    const next = cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]
    if (next.length === 0) return
    setSettings({ fagblanding: next })
  }

  return (
    <>
      <Section title={`📊 ${child.emoji} ${child.name} – siste 7 dager`}>
        <div className="grid grid-cols-3 gap-3 text-center mb-2">
          <div className="bg-amber-50 rounded-2xl p-3">
            <p className="text-2xl font-extrabold text-amber-500">{d.stars} ⭐</p>
            <p className="text-xs font-bold text-slate-500">stjerner totalt</p>
          </div>
          <div className="bg-sky-50 rounded-2xl p-3">
            <p className="text-2xl font-extrabold text-sky-500">{oppdrag || week.length}</p>
            <p className="text-xs font-bold text-slate-500">{oppdrag ? 'oppdrag' : 'runder'} siste uke</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-3">
            <p className="text-2xl font-extrabold text-emerald-500">{minutter}</p>
            <p className="text-xs font-bold text-slate-500">minutter siste uke</p>
          </div>
        </div>
      </Section>

      <Section title="📆 Ukeoversikt">
        <Ukeoversikt d={d} />
      </Section>

      <Section title="🪜 Nivå per fag">
        <div className="space-y-3">
          {FAG.map((f) => {
            const info = FAG_LABELS[f]
            const fd = d.fag[f]
            const maks = MAKS_NIVAA[f] || 0
            return (
              <div key={f} className="flex flex-wrap items-center gap-3">
                <span className="text-2xl w-8">{info.emoji}</span>
                <span className="font-extrabold text-slate-600 w-20">{info.navn}</span>
                {maks > 0 ? (
                  <>
                    <select
                      value={fd.nivaa ?? ''}
                      onChange={(e) => setNivaa(f, e.target.value === '' ? null : Number(e.target.value))}
                      className="rounded-xl border-2 border-slate-200 px-3 py-2 font-bold text-slate-700 bg-white max-w-[60%]"
                    >
                      <option value="">Ikke plassert (plasseringstest først)</option>
                      {Array.from({ length: maks }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          Nivå {n}: {nivaaNavn(f, n)}
                        </option>
                      ))}
                    </select>
                    {fd.hjelpNeste && <span className="text-xs font-bold text-amber-500">hjelp på neste oppdrag</span>}
                  </>
                ) : (
                  <span className="text-sm font-bold text-slate-400">stigen kommer i en senere etappe</span>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      <Section title="🎯 Bommer mest på">
        {weak.length ? (
          <ul className="space-y-1">
            {weak.map((w) => (
              <li key={w.type} className="flex justify-between font-semibold text-slate-600">
                <span>
                  {FAG_LABELS[w.fag]?.emoji} {typeLabel(w.type)}
                </span>
                <span className="text-rose-400">
                  {w.miss} av {w.tries} feil
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 text-sm font-semibold">Ikke nok svar ennå. Vises når barnet har gjort noen oppdrag.</p>
        )}
      </Section>

      <Section title="⚙️ Innstillinger">
        <div className="space-y-4">
          <div>
            <p className="font-bold text-slate-600 mb-2">Automatisk opplesing</p>
            <div className="flex gap-2">
              <Chip active={effectiveAutoSpeak(d)} onClick={() => setSettings({ autoSpeak: true, autoSpeakSet: true })}>
                🔊 På
              </Chip>
              <Chip active={!effectiveAutoSpeak(d)} onClick={() => setSettings({ autoSpeak: false, autoSpeakSet: true })}>
                🔇 Av
              </Chip>
            </div>
            {!s.autoSpeakSet && <p className="text-xs text-slate-400 mt-1">Ikke valgt ennå: reven leser opp til barnet er på nivå 8 i lesing.</p>}
            {!speech.supported() && <p className="text-xs text-slate-400 mt-1">Denne enheten har ingen stemme. Innstillingen følger barnet til andre enheter.</p>}
          </div>
          <div>
            <p className="font-bold text-slate-600 mb-2">Oppdrag per dag i «Dagens økt»</p>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <Chip key={n} active={s.oppdragPerDag === n} onClick={() => setSettings({ oppdragPerDag: n })}>
                  {n}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold text-slate-600 mb-2">Fag i «Dagens økt»</p>
            <div className="flex flex-wrap gap-2">
              {['matte', 'lesing', 'klokke', 'geografi', 'engelsk', 'overraskelse'].map((f) => (
                <Chip key={f} active={(s.fagblanding || []).includes(f)} onClick={() => toggleFag(f)}>
                  {f === 'overraskelse' ? '🎁 Overraskelse' : `${FAG_LABELS[f].emoji} ${FAG_LABELS[f].navn}`}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold text-slate-600 mb-2">Fast oppdrag hver dag</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={!s.fast} onClick={() => setSettings({ fast: null })}>
                Barnet velger fritt
              </Chip>
              <Chip active={s.fast === 'matte'} onClick={() => setSettings({ fast: 'matte' })}>
                🔢 Alltid matte
              </Chip>
              <Chip active={s.fast === 'lesing'} onClick={() => setSettings({ fast: 'lesing' })}>
                📖 Alltid lesing
              </Chip>
            </div>
          </div>
        </div>
      </Section>

      <Section title="📚 Temastiger">
        <div className="space-y-3">
          {TOPICS.map((t) => {
            const p = topicProgress(t, d.best)
            const rec = recommendedIndex(t, d.best)
            return (
              <div key={t.id} className="flex items-center gap-3">
                <span className="text-2xl w-8 shrink-0">{t.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <p className="font-extrabold text-slate-600 truncate">{t.title}</p>
                    <p className="text-sm font-bold text-slate-400 shrink-0">
                      {p.done}/{p.total} nivåer
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Bar value={p.done} max={p.total} color={t.color} />
                    {rec >= 0 ? <span className="text-xs font-bold text-slate-400 shrink-0">øver på nivå {rec + 1}</span> : <span className="text-xs font-bold text-emerald-500 shrink-0">mestret! 🌟</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {recent.length > 0 && (
        <Section title="🕐 Siste runder">
          <div className="space-y-1">
            {recent.map((e, i) => {
              const t = e.topic ? topicById(e.topic) : null
              const dt = new Date(e.t)
              const when = `${dt.getDate()}.${dt.getMonth() + 1}. kl. ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
              const label = t
                ? `${t.emoji} ${t.title}${e.level != null ? ` · nivå ${e.level + 1}` : ''}`
                : e.eventyr
                  ? '🗺️ Eventyrkartet'
                  : e.fag
                    ? `${FAG_LABELS[e.fag]?.emoji || ''} ${FAG_LABELS[e.fag]?.navn || e.fag}${e.nivaa != null ? ` · nivå ${e.nivaa}` : ''}`
                    : '🎮 Aktivitet'
              return (
                <div key={i} className="flex justify-between gap-2 text-sm md:text-base font-semibold text-slate-600 border-b border-slate-100 py-1">
                  <span className="truncate">{label}</span>
                  <span className="shrink-0 text-slate-400">
                    {e.correct != null && `${e.correct}/${e.total} riktig · `}
                    {e.ms ? `${Math.max(1, Math.round(e.ms / 60000))} min · ` : ''}
                    {'⭐'.repeat(e.stars || 0)} {when}
                  </span>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      <Section title={`🧹 Nullstill ${child.name}`}>
        <p className="text-slate-500 font-semibold mb-3">Sletter stjerner, nivåer, samling, hagen og eventyrkartet for denne spilleren. Innstillingene beholdes. Kan ikke angres.</p>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="kid-btn bg-rose-100 text-rose-600 px-5 py-3 text-lg font-extrabold">
            Nullstill fremgang …
          </button>
        ) : (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-bold text-slate-600">Helt sikker?</span>
            <BigButton
              color="bg-rose-500"
              className="!text-lg !py-2 !px-4"
              onClick={() => {
                update((cur) => nullstiltData(cur))
                setConfirmReset(false)
              }}
            >
              Ja, nullstill
            </BigButton>
            <BigButton color="bg-slate-400" className="!text-lg !py-2 !px-4" onClick={() => setConfirmReset(false)}>
              Nei
            </BigButton>
          </div>
        )}
      </Section>
      {!isActive && <p className="text-center text-xs text-white/80 font-semibold mb-4">Endringer for {child.name} lagres og synkes selv om {child.name} ikke er valgt nå.</p>}
    </>
  )
}

export default function Parents({ go, onSwitchProfile, onPrivacy }) {
  const { profile, data, session, childProfiles, removeChild, signOutProfile, childrenData, loadChildData, updateChildData, syncState, onLine, deleteAccount } = useStars()
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmAccount, setConfirmAccount] = useState(false)
  const [accountMsg, setAccountMsg] = useState(null)
  const [selected, setSelected] = useState(profile?.id || null)

  const kids = session && childProfiles.length ? childProfiles : profile ? [{ ...profile }] : [GUEST_PROFILE]
  const current = kids.find((k) => k.id === selected) || kids[0]

  useEffect(() => {
    if (!open || !current) return
    if (profile && current.id === profile.id) return
    loadChildData(current.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, current?.id])

  if (!open) {
    return (
      <div className="animate-pop-in">
        <TopBar title="For voksne 👨‍👩‍👧" onHome={go} />
        <AdultGate onPass={() => setOpen(true)} />
      </div>
    )
  }

  const isActive = profile && current && current.id === profile.id
  const currentData = isActive ? data : childrenData[current?.id]
  const syncText = { lokal: 'lagres bare på denne enheten', synket: '✅ synket', venter: '⏳ venter på synk', frakoblet: '📴 uten nett, synkes senere' }[syncState]

  return (
    <div className="animate-pop-in">
      <TopBar title="For voksne 👨‍👩‍👧" onHome={go} />

      {kids.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {kids.map((k) => (
            <button key={k.id} onClick={() => setSelected(k.id)} className={`kid-btn px-5 py-3 text-lg font-extrabold flex items-center gap-2 ${current?.id === k.id ? 'bg-white text-slate-700 scale-105' : 'bg-white/50 text-slate-600'}`}>
              <span className="text-2xl">{k.emoji}</span> {k.name}
            </button>
          ))}
        </div>
      )}

      {current && <ChildPanel key={current.id} child={current} data={currentData} isActive={isActive} update={(fn) => updateChildData(current.id, fn)} />}

      <Section title="👨‍👩‍👧 Familiekonto">
        {!supabase ? (
          <p className="text-slate-500 font-semibold">Skykonto er ikke satt opp i denne utgaven – alt lagres lokalt på enheten.</p>
        ) : session ? (
          <>
            <p className="text-slate-600 font-semibold mb-3">
              Innlogget som <span className="font-extrabold">{session.user.email}</span>. Fremgangen til spillerne synkes mellom enheter ({syncText}
              {!onLine && syncState !== 'frakoblet' ? ', 📴 uten nett nå' : ''}).
            </p>
            {childProfiles.length > 0 && (
              <div className="space-y-2 mb-3">
                {childProfiles.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-2">
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="flex-1 font-extrabold text-slate-600">{c.name}</span>
                    {confirmDelete === c.id ? (
                      <>
                        <button
                          onClick={() => {
                            removeChild(c.id)
                            setConfirmDelete(null)
                          }}
                          className="text-sm font-bold text-rose-500"
                        >
                          Ja, slett profilen og alt
                        </button>
                        <button onClick={() => setConfirmDelete(null)} className="text-sm font-bold text-slate-400">
                          Avbryt
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmDelete(c.id)} className="text-sm font-bold text-slate-300 hover:text-rose-400" title="Slett profil">
                        🗑
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3 items-center">
              <button onClick={onSwitchProfile} className="kid-btn bg-sky-500 text-white px-5 py-3 text-lg font-extrabold">
                👤 Bytt spiller
              </button>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  signOutProfile()
                  go()
                }}
                className="text-sm font-bold text-slate-400 underline hover:text-slate-600"
              >
                Logg ut av familiekontoen på denne enheten
              </button>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 font-semibold mb-2">Vil du slutte helt? Da slettes kontoen, alle barneprofilene og all fremgang med en gang. Kan ikke angres.</p>
              {accountMsg && <p className="text-sm font-bold text-rose-500 mb-2">{accountMsg}</p>}
              {!confirmAccount ? (
                <button onClick={() => setConfirmAccount(true)} className="text-sm font-bold text-rose-400 underline hover:text-rose-600">
                  Slett familiekontoen og alt innhold
                </button>
              ) : (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-bold text-slate-600">Helt sikker?</span>
                  <BigButton
                    color="bg-rose-500"
                    className="!text-lg !py-2 !px-4"
                    onClick={async () => {
                      const { error } = await deleteAccount()
                      if (error) setAccountMsg(/delete_my_account|function|not find/i.test(error.message) ? 'Slettefunksjonen er ikke satt opp i Supabase ennå (se supabase/migrations/20261106_delete_my_account.sql).' : 'Kunne ikke slette: ' + error.message)
                      else go()
                    }}
                  >
                    Ja, slett alt
                  </BigButton>
                  <BigButton color="bg-slate-400" className="!text-lg !py-2 !px-4" onClick={() => setConfirmAccount(false)}>
                    Nei
                  </BigButton>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-slate-500 font-semibold mb-3">Logg inn eller lag familiekonto fra startskjermen («Bytt spiller») for å lagre fremgang i skyen og bruke appen på flere enheter.</p>
            <button onClick={onSwitchProfile} className="kid-btn bg-sky-500 text-white px-5 py-3 text-lg font-extrabold">
              👤 Bytt spiller / logg inn
            </button>
          </>
        )}
      </Section>
      <p className="text-center mb-4">
        <button onClick={onPrivacy} className="text-white/80 text-sm font-bold underline hover:text-white">
          🔒 Personvern: hva lagres, og hvordan slettes det
        </button>
      </p>
    </div>
  )
}

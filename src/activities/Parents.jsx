import { useState } from 'react'
import { TopBar } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { supabase } from '../lib/supabase.js'
import { speech } from '../speech.js'
import {
  TOPICS,
  recommendedIndex,
  topicProgress,
  strengthsAndPractice,
  accuracyByTopic,
  recentActivity,
} from '../progress.js'
import { topicById } from '../data/topics.js'

// Foreldresiden: fremgang, styrker og kontoadministrasjon.
// Bak en enkel voksengate (gangestykke) så barna ikke havner her ved et uhell.

function makeGate() {
  const a = 6 + Math.floor(Math.random() * 4)
  const b = 6 + Math.floor(Math.random() * 4)
  return { a, b, answer: a * b }
}

function Gate({ onPass }) {
  const [gate] = useState(makeGate)
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)

  function check(e) {
    e.preventDefault()
    if (Number(value) === gate.answer) onPass()
    else {
      setWrong(true)
      setValue('')
    }
  }

  return (
    <form onSubmit={check} className="bg-white/95 rounded-3xl p-6 shadow-xl max-w-sm mx-auto mt-8 text-center">
      <p className="text-5xl mb-3">🔒</p>
      <h2 className="text-xl font-extrabold text-slate-700 mb-1">Kun for voksne</h2>
      <p className="text-slate-500 font-semibold mb-4">
        Hva er {gate.a} × {gate.b}?
      </p>
      <input
        type="number"
        inputMode="numeric"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-32 text-center rounded-2xl border-2 border-slate-200 px-4 py-3 text-2xl font-extrabold focus:border-sky-400 outline-none"
      />
      {wrong && <p className="text-rose-500 font-bold text-sm mt-2">Prøv igjen! 😊</p>}
      <button type="submit" className="kid-btn bg-sky-500 text-white w-full py-3 text-xl font-extrabold mt-4">
        Åpne
      </button>
    </form>
  )
}

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

export default function Parents({ go, onSwitchProfile }) {
  const { profile, data, log, best, session, childProfiles, removeChild, signOutProfile } = useStars()
  const [open, setOpen] = useState(false)
  const [talking, setTalking] = useState(speech.enabled())
  const [confirmDelete, setConfirmDelete] = useState(null)

  if (!open) {
    return (
      <div className="animate-pop-in">
        <TopBar title="For voksne 👨‍👩‍👧" onHome={go} />
        <Gate onPass={() => setOpen(true)} />
      </div>
    )
  }

  const { strengths, practice } = strengthsAndPractice(log)
  const acc = accuracyByTopic(log)
  const week = recentActivity(log, 7)
  const recent = [...log].reverse().slice(0, 8)

  return (
    <div className="animate-pop-in">
      <TopBar title="For voksne 👨‍👩‍👧" onHome={go} />

      <Section title={`📊 Fremgang for ${profile?.name || 'spilleren'} ${profile?.emoji || ''}`}>
        <div className="grid grid-cols-3 gap-3 text-center mb-2">
          <div className="bg-amber-50 rounded-2xl p-3">
            <p className="text-2xl font-extrabold text-amber-500">{data.stars} ⭐</p>
            <p className="text-xs font-bold text-slate-500">stjerner totalt</p>
          </div>
          <div className="bg-sky-50 rounded-2xl p-3">
            <p className="text-2xl font-extrabold text-sky-500">{log.length}</p>
            <p className="text-xs font-bold text-slate-500">runder spilt</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-3">
            <p className="text-2xl font-extrabold text-emerald-500">{week.rounds}</p>
            <p className="text-xs font-bold text-slate-500">runder siste 7 dager</p>
          </div>
        </div>
      </Section>

      <Section title="📚 Temaer">
        <div className="space-y-3">
          {TOPICS.map((t) => {
            const p = topicProgress(t, best)
            const rec = recommendedIndex(t, best)
            const a = acc[t.id]
            const pct = a ? Math.round((100 * a.correct) / a.total) : null
            return (
              <div key={t.id} className="flex items-center gap-3">
                <span className="text-2xl w-8 shrink-0">{t.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <p className="font-extrabold text-slate-600 truncate">{t.title}</p>
                    <p className="text-sm font-bold text-slate-400 shrink-0">
                      {p.done}/{p.total} nivåer
                      {pct != null && ` · ${pct} % riktig`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Bar value={p.done} max={p.total} color={t.color} />
                    {rec >= 0 ? (
                      <span className="text-xs font-bold text-slate-400 shrink-0">øver på nivå {rec + 1}</span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-500 shrink-0">mestret! 🌟</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {(strengths.length > 0 || practice.length > 0) && (
        <Section title="💡 Styrker og øvingsområder">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <p className="font-bold text-emerald-500 mb-1">Sterk i:</p>
              {strengths.length ? (
                strengths.map((s) => (
                  <p key={s.topic.id} className="text-slate-600 font-semibold">
                    {s.topic.emoji} {s.topic.title} — {s.pct} % riktig
                  </p>
                ))
              ) : (
                <p className="text-slate-400 text-sm">Spill litt mer, så ser vi! 😊</p>
              )}
            </div>
            <div>
              <p className="font-bold text-rose-400 mb-1">Kan trenge litt hjelp med:</p>
              {practice.length ? (
                practice.map((s) => (
                  <p key={s.topic.id} className="text-slate-600 font-semibold">
                    {s.topic.emoji} {s.topic.title} — {s.pct} % riktig
                  </p>
                ))
              ) : (
                <p className="text-slate-400 text-sm">Ingenting å bekymre seg for! 🎉</p>
              )}
            </div>
          </div>
        </Section>
      )}

      {recent.length > 0 && (
        <Section title="🕐 Siste runder">
          <div className="space-y-1">
            {recent.map((e, i) => {
              const t = e.topic ? topicById(e.topic) : null
              const d = new Date(e.t)
              const when = `${d.getDate()}.${d.getMonth() + 1}. kl. ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
              return (
                <div key={i} className="flex justify-between gap-2 text-sm md:text-base font-semibold text-slate-600 border-b border-slate-100 py-1">
                  <span className="truncate">
                    {t ? `${t.emoji} ${t.title}` : '🎮 Aktivitet'}
                    {e.level != null && ` · nivå ${e.level + 1}`}
                  </span>
                  <span className="shrink-0 text-slate-400">
                    {e.correct != null && `${e.correct}/${e.total} riktig · `}
                    {'⭐'.repeat(e.stars || 0)} · {when}
                  </span>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      <Section title="⚙️ Innstillinger">
        <div className="flex flex-wrap gap-2">
          {speech.supported() && (
            <button
              onClick={() => {
                speech.setEnabled(!talking)
                setTalking(!talking)
              }}
              className="kid-btn bg-violet-500 text-white px-5 py-3 text-lg font-extrabold"
            >
              {talking ? '🔊 Opplesing: på' : '🔇 Opplesing: av'}
            </button>
          )}
          <button
            onClick={onSwitchProfile}
            className="kid-btn bg-sky-500 text-white px-5 py-3 text-lg font-extrabold"
          >
            👤 Bytt spiller
          </button>
        </div>
      </Section>

      <Section title="👨‍👩‍👧 Familiekonto">
        {!supabase ? (
          <p className="text-slate-500 font-semibold">
            Skykonto er ikke satt opp i denne utgaven – alt lagres lokalt på enheten.
          </p>
        ) : session ? (
          <>
            <p className="text-slate-600 font-semibold mb-3">
              Innlogget som <span className="font-extrabold">{session.user.email}</span>. Fremgangen til
              spillerne synkes automatisk mellom enheter.
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
                          Ja, slett alt
                        </button>
                        <button onClick={() => setConfirmDelete(null)} className="text-sm font-bold text-slate-400">
                          Avbryt
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmDelete(c.id)} className="text-sm font-bold text-slate-300 hover:text-rose-400">
                        🗑
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                signOutProfile()
                go()
              }}
              className="text-sm font-bold text-slate-400 underline hover:text-slate-600"
            >
              Logg ut av familiekontoen
            </button>
          </>
        ) : (
          <p className="text-slate-500 font-semibold">
            Logg inn fra startskjermen («Bytt spiller» → For voksne) for å lagre fremgang i skyen og
            bruke appen på flere enheter.
          </p>
        )}
      </Section>
    </div>
  )
}

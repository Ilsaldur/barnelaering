import { useState } from 'react'
import { Mascot } from '../components/ui.jsx'
import { useStars, GUEST_PROFILE } from '../StarContext.jsx'
import { supabase } from '../lib/supabase.js'
import { sound } from '../sound.js'

// Startskjerm: «Hvem skal spille?» – barnet velger sin profil.
// Den voksne logger inn med e-postlenke. Registrering er stengt: bare
// e-postadresser som finnes som brukere i Supabase, får lenke.

const AVATARS = ['🦊', '🐰', '🐱', '🦄', '🐸', '🐼', '🦁', '🐙', '🦖', '🐧', '🐨', '🦉']

function LoginForm({ onCancel }) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [msg, setMsg] = useState(null)

  async function submit(e) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setMsg(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: window.location.origin },
    })
    setBusy(false)
    if (error) {
      setMsg(
        /not allowed|signups|Signups not allowed/i.test(error.message)
          ? 'Denne e-postadressen har ikke tilgang.'
          : 'Kunne ikke sende lenke: ' + error.message,
      )
    } else setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-white/95 rounded-3xl p-5 shadow-xl max-w-md mx-auto mt-4 text-center">
        <p className="text-5xl mb-2">📬</p>
        <h2 className="text-xl font-extrabold text-slate-700 mb-2">Sjekk e-posten din</h2>
        <p className="text-slate-600 font-semibold">
          Vi har sendt en innloggingslenke til <span className="font-extrabold">{email}</span>. Åpne den på denne enheten, så er du inne.
          Enheten forblir innlogget etterpå.
        </p>
        <button onClick={onCancel} className="mt-4 text-sm font-bold text-slate-400 hover:text-slate-600">
          Lukk
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="bg-white/95 rounded-3xl p-5 shadow-xl max-w-md mx-auto mt-4">
      <h2 className="text-xl font-extrabold text-slate-700 text-center mb-1">👨‍👩‍👧 Logg inn (for voksne)</h2>
      <p className="text-center text-sm text-slate-500 font-semibold mb-3">Du får en lenke på e-post. Ingen passord.</p>
      <input
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-post"
        className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-lg mb-3 focus:border-sky-400 outline-none"
      />
      {msg && <p className="text-sm font-bold text-rose-500 text-center mb-2">{msg}</p>}
      <button type="submit" disabled={busy} className="kid-btn bg-sky-500 text-white w-full py-3 text-xl font-extrabold disabled:opacity-50">
        {busy ? '⏳ Sender …' : 'Send innloggingslenke'}
      </button>
      <button type="button" onClick={onCancel} className="w-full text-center text-sm font-bold text-slate-400 hover:text-slate-600 mt-3">
        Avbryt
      </button>
    </form>
  )
}

function NewChildForm({ onCreate, onCancel }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(AVATARS[0])
  const [busy, setBusy] = useState(false)

  return (
    <div className="bg-white/95 rounded-3xl p-5 shadow-xl max-w-md mx-auto mt-4">
      <h2 className="text-xl font-extrabold text-slate-700 text-center mb-1">Ny spiller 🎉</h2>
      <p className="text-center text-sm text-slate-500 font-semibold mb-3">Bare et kallenavn og en figur. Ingenting annet lagres om barnet.</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Kallenavn"
        maxLength={20}
        className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-lg mb-3 focus:border-sky-400 outline-none"
      />
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {AVATARS.map((a) => (
          <button
            key={a}
            onClick={() => {
              sound.click()
              setEmoji(a)
            }}
            className={`text-3xl md:text-4xl p-2 rounded-2xl transition-transform ${emoji === a ? 'bg-amber-200 scale-110 shadow' : 'bg-slate-100 hover:scale-105'}`}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          disabled={!name.trim() || busy}
          onClick={async () => {
            setBusy(true)
            await onCreate(name.trim(), emoji)
            setBusy(false)
          }}
          className="kid-btn bg-emerald-500 text-white flex-1 py-3 text-xl font-extrabold disabled:opacity-50"
        >
          {busy ? '⏳' : '✅ Lag profil'}
        </button>
        <button onClick={onCancel} className="kid-btn bg-slate-400 text-white px-6 py-3 text-xl font-extrabold">
          Avbryt
        </button>
      </div>
    </div>
  )
}

export default function Family({ onPicked }) {
  const { session, authReady, childProfiles, selectProfile, addChild, onLine } = useStars()
  const [showLogin, setShowLogin] = useState(false)
  const [showNewChild, setShowNewChild] = useState(false)

  async function pick(p) {
    sound.click()
    await selectProfile(p)
    onPicked()
  }

  return (
    <div className="animate-pop-in">
      <header className="text-center mb-6 mt-4">
        <div className="text-7xl md:text-8xl animate-bouncey mb-2">🦊</div>
        <h1 className="text-white font-extrabold text-4xl md:text-6xl drop-shadow-lg">Selmas skole</h1>
        <p className="text-white/95 font-bold text-2xl md:text-3xl mt-3">Hvem skal spille? 👇</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 max-w-2xl mx-auto">
        {childProfiles.map((c) => (
          <button key={c.id} onClick={() => pick({ id: c.id, name: c.name, emoji: c.emoji })} className="kid-btn bg-white/95 text-slate-700 p-5 md:p-7 flex flex-col items-center gap-2 hover:scale-105">
            <span className="text-6xl md:text-7xl">{c.emoji}</span>
            <span className="text-xl md:text-2xl font-extrabold">{c.name}</span>
          </button>
        ))}

        {session && (
          <button
            onClick={() => {
              sound.click()
              setShowNewChild(true)
            }}
            className="kid-btn bg-white/60 text-slate-500 p-5 md:p-7 flex flex-col items-center gap-2 hover:scale-105 border-4 border-dashed border-white"
          >
            <span className="text-6xl md:text-7xl">➕</span>
            <span className="text-xl md:text-2xl font-extrabold">Ny spiller</span>
          </button>
        )}

        {(!session || childProfiles.length === 0) && (
          <button onClick={() => pick(GUEST_PROFILE)} className="kid-btn bg-amber-400 text-white p-5 md:p-7 flex flex-col items-center gap-2 hover:scale-105">
            <span className="text-6xl md:text-7xl">{GUEST_PROFILE.emoji}</span>
            <span className="text-xl md:text-2xl font-extrabold">Bare spill!</span>
            <span className="text-sm font-bold opacity-90">lagres bare her</span>
          </button>
        )}
      </div>

      {showNewChild && (
        <NewChildForm
          onCreate={async (name, emoji) => {
            const row = await addChild(name, emoji)
            setShowNewChild(false)
            if (row) pick({ id: row.id, name: row.name, emoji: row.emoji })
          }}
          onCancel={() => setShowNewChild(false)}
        />
      )}

      {supabase && authReady && !session && (
        <div className="mt-6 text-center">
          {showLogin ? (
            <LoginForm onCancel={() => setShowLogin(false)} />
          ) : (
            <button
              onClick={() => {
                sound.click()
                setShowLogin(true)
              }}
              className="text-white/90 font-bold underline text-lg"
            >
              👨‍👩‍👧 For voksne: logg inn for å bruke appen på flere enheter
            </button>
          )}
        </div>
      )}

      {session && (
        <p className="text-center text-white/80 font-semibold mt-6 text-sm">
          Innlogget som {session.user.email}
          {!onLine && ' · 📴 uten nett – fremgangen synkes når nettet er tilbake'}
        </p>
      )}

      {supabase && !authReady && (
        <div className="flex justify-center mt-6">
          <Mascot mood="think" message="Laster …" />
        </div>
      )}
    </div>
  )
}

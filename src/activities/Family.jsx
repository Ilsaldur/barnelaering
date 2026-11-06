import { useState } from 'react'
import { Mascot } from '../components/ui.jsx'
import { useStars, GUEST_PROFILE } from '../StarContext.jsx'
import { supabase } from '../lib/supabase.js'
import { sound } from '../sound.js'

// Startskjerm: «Hvem skal spille?» – barnet velger sin profil.
// Den voksne lager en familiekonto med e-post og passord (bekreftes på e-post
// første gang). Alle kan lage konto; en konto ser bare sine egne barn.

const AVATARS = ['🦊', '🐰', '🐱', '🦄', '🐸', '🐼', '🦁', '🐙', '🦖', '🐧', '🐨', '🦉']
const MIN_PASSORD = 8

function feilTekst(error) {
  const m = error?.message || ''
  if (/Invalid login credentials/i.test(m)) return 'Feil e-post eller passord.'
  if (/Email not confirmed/i.test(m)) return 'E-posten er ikke bekreftet ennå. Sjekk innboksen (og søppelpost) for lenken.'
  if (/already registered|already been registered/i.test(m)) return 'Det finnes allerede en konto med denne e-posten. Logg inn, eller bruk «Glemt passord».'
  if (/rate limit|too many/i.test(m)) return 'For mange forsøk på kort tid. Vent litt og prøv igjen.'
  if (/Password should be|password/i.test(m)) return `Passordet er for svakt. Bruk minst ${MIN_PASSORD} tegn.`
  if (/signups not allowed/i.test(m)) return 'Registrering er stengt.'
  return 'Noe gikk galt: ' + m
}

function LoginForm({ onCancel, onPrivacy }) {
  const [mode, setMode] = useState('inn') // inn | ny | glemt
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const [done, setDone] = useState(null)

  async function submit(e) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setMsg(null)
    const mail = email.trim()
    if (mode === 'inn') {
      const { error } = await supabase.auth.signInWithPassword({ email: mail, password })
      if (error) setMsg(feilTekst(error))
      else onCancel()
    } else if (mode === 'ny') {
      if (password.length < MIN_PASSORD) setMsg(`Passordet må ha minst ${MIN_PASSORD} tegn.`)
      else {
        const { data, error } = await supabase.auth.signUp({ email: mail, password, options: { emailRedirectTo: window.location.origin } })
        if (error) setMsg(feilTekst(error))
        else if (data.session) onCancel()
        else if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          // Supabase svarer «ok» uten å sende e-post når adressen allerede har konto.
          setMsg('Det finnes allerede en konto med denne e-posten. Logg inn, eller bruk «Glemt passord».')
          setMode('inn')
        } else setDone({ tittel: 'Nesten ferdig!', tekst: `Vi har sendt en bekreftelseslenke til ${mail}. Trykk på den, og logg så inn her med passordet ditt.` })
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(mail, { redirectTo: window.location.origin })
      if (error) setMsg(feilTekst(error))
      else setDone({ tittel: 'Sjekk e-posten din', tekst: `Vi har sendt en lenke til ${mail}. Åpne den på denne enheten, så får du sette nytt passord.` })
    }
    setBusy(false)
  }

  if (done) {
    return (
      <div className="bg-white/95 rounded-3xl p-5 shadow-xl max-w-md mx-auto mt-4 text-center">
        <p className="text-5xl mb-2">📬</p>
        <h2 className="text-xl font-extrabold text-slate-700 mb-2">{done.tittel}</h2>
        <p className="text-slate-600 font-semibold">{done.tekst}</p>
        <button
          onClick={() => {
            setDone(null)
            setMode('inn')
          }}
          className="kid-btn bg-sky-500 text-white px-6 py-3 text-lg font-extrabold mt-4"
        >
          Til innlogging
        </button>
      </div>
    )
  }

  const titler = { inn: '👨‍👩‍👧 Logg inn (for voksne)', ny: '👨‍👩‍👧 Lag familiekonto', glemt: '🔑 Glemt passord' }
  return (
    <form onSubmit={submit} className="bg-white/95 rounded-3xl p-5 shadow-xl max-w-md mx-auto mt-4">
      <h2 className="text-xl font-extrabold text-slate-700 text-center mb-1">{titler[mode]}</h2>
      <p className="text-center text-sm text-slate-500 font-semibold mb-3">
        {mode === 'ny' ? 'Én konto per familie. Barna får profiler under kontoen og logger aldri inn selv.' : mode === 'glemt' ? 'Vi sender en lenke der du kan sette nytt passord.' : 'Fremgangen følger barna mellom enhetene dine.'}
      </p>
      <input
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-post"
        className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-lg mb-2 focus:border-sky-400 outline-none"
      />
      {mode !== 'glemt' && (
        <input
          type="password"
          required
          minLength={mode === 'ny' ? MIN_PASSORD : 1}
          autoComplete={mode === 'ny' ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'ny' ? `Passord (minst ${MIN_PASSORD} tegn)` : 'Passord'}
          className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-lg mb-3 focus:border-sky-400 outline-none"
        />
      )}
      {msg && <p className="text-sm font-bold text-rose-500 text-center mb-2">{msg}</p>}
      <button type="submit" disabled={busy} className="kid-btn bg-sky-500 text-white w-full py-3 text-xl font-extrabold disabled:opacity-50">
        {busy ? '⏳ Vent litt …' : mode === 'inn' ? 'Logg inn' : mode === 'ny' ? 'Lag konto' : 'Send lenke'}
      </button>
      <div className="flex flex-wrap justify-between gap-2 mt-3 text-sm font-bold text-slate-400">
        {mode !== 'ny' && (
          <button type="button" onClick={() => setMode('ny')} className="hover:text-slate-600">
            Ny her? Lag konto
          </button>
        )}
        {mode !== 'inn' && (
          <button type="button" onClick={() => setMode('inn')} className="hover:text-slate-600">
            Har konto? Logg inn
          </button>
        )}
        {mode === 'inn' && (
          <button type="button" onClick={() => setMode('glemt')} className="hover:text-slate-600">
            Glemt passord?
          </button>
        )}
      </div>
      <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
        <button type="button" onClick={onPrivacy} className="underline hover:text-slate-600">
          Personvern
        </button>
        <button type="button" onClick={onCancel} className="hover:text-slate-600">
          Avbryt
        </button>
      </div>
    </form>
  )
}

// Vises når brukeren kommer fra «glemt passord»-lenken.
function NewPasswordForm({ onDone }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  async function submit(e) {
    e.preventDefault()
    if (password.length < MIN_PASSORD) return setMsg(`Passordet må ha minst ${MIN_PASSORD} tegn.`)
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) setMsg(feilTekst(error))
    else onDone()
  }
  return (
    <form onSubmit={submit} className="bg-white/95 rounded-3xl p-5 shadow-xl max-w-md mx-auto mt-4">
      <h2 className="text-xl font-extrabold text-slate-700 text-center mb-3">🔑 Sett nytt passord</h2>
      <input type="password" required minLength={MIN_PASSORD} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={`Nytt passord (minst ${MIN_PASSORD} tegn)`} className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-lg mb-3 focus:border-sky-400 outline-none" />
      {msg && <p className="text-sm font-bold text-rose-500 text-center mb-2">{msg}</p>}
      <button type="submit" disabled={busy} className="kid-btn bg-sky-500 text-white w-full py-3 text-xl font-extrabold disabled:opacity-50">
        {busy ? '⏳' : 'Lagre passord'}
      </button>
    </form>
  )
}

function NewChildForm({ onCreate, onCancel }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(AVATARS[0])
  const [kanLese, setKanLese] = useState(null) // null | true | false
  const [busy, setBusy] = useState(false)

  return (
    <div className="bg-white/95 rounded-3xl p-5 shadow-xl max-w-md mx-auto mt-4">
      <h2 className="text-xl font-extrabold text-slate-700 text-center mb-1">Ny spiller 🎉</h2>
      <p className="text-center text-sm text-slate-500 font-semibold mb-3">Bare et kallenavn og en figur. Ingenting annet lagres om barnet.</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Kallenavn" maxLength={20} className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-lg mb-3 focus:border-sky-400 outline-none" />
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
      <p className="text-center font-extrabold text-slate-700 mb-2">Kan barnet lese selv?</p>
      <div className="flex gap-2 justify-center mb-4">
        <button onClick={() => setKanLese(true)} className={`kid-btn px-5 py-3 text-lg font-extrabold ${kanLese === true ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
          📖 Ja
        </button>
        <button onClick={() => setKanLese(false)} className={`kid-btn px-5 py-3 text-lg font-extrabold ${kanLese === false ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
          🔊 Nei, les opp for meg
        </button>
      </div>
      <div className="flex gap-2">
        <button
          disabled={!name.trim() || kanLese === null || busy}
          onClick={async () => {
            setBusy(true)
            await onCreate(name.trim(), emoji, kanLese)
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

export default function Family({ onPicked, onPrivacy }) {
  const { session, authReady, childProfiles, selectProfile, addChild, onLine, passwordRecovery, clearPasswordRecovery } = useStars()
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

      {passwordRecovery && session && <NewPasswordForm onDone={clearPasswordRecovery} />}

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
          onCreate={async (name, emoji, kanLese) => {
            const row = await addChild(name, emoji, kanLese)
            setShowNewChild(false)
            if (row) pick({ id: row.id, name: row.name, emoji: row.emoji })
          }}
          onCancel={() => setShowNewChild(false)}
        />
      )}

      {supabase && authReady && !session && (
        <div className="mt-6 text-center">
          {showLogin ? (
            <LoginForm onCancel={() => setShowLogin(false)} onPrivacy={onPrivacy} />
          ) : (
            <button
              onClick={() => {
                sound.click()
                setShowLogin(true)
              }}
              className="text-white/90 font-bold underline text-lg"
            >
              👨‍👩‍👧 For voksne: logg inn eller lag familiekonto
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

      <p className="text-center mt-8">
        <button onClick={onPrivacy} className="text-white/60 text-xs font-bold underline hover:text-white">
          Personvern
        </button>
      </p>
    </div>
  )
}

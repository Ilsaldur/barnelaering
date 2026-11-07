import { useEffect, useState } from 'react'
import { TopBar, Mascot, BigButton } from '../components/ui.jsx'
import { SpeakButton, AutoSpeakToggle } from '../components/Speak.jsx'
import Keypad, { parseAnswer } from '../components/Keypad.jsx'
import { Visual, Help } from '../components/TaskVisual.jsx'
import AnalogClock from '../components/AnalogClock.jsx'
import VerdensKart from '../components/VerdensKart.jsx'
import Flagg from '../components/Flagg.jsx'
import { landById } from '../data/geo/land.js'
import { laerkortForType, stegForType } from '../data/laerkort.js'
import { Visual as KortVisual, Help as KortHelp } from '../components/TaskVisual.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { fmt } from '../lib/matte/felles.js'
import LaerKort from '../components/LaerKort.jsx'
import { startKlokke, settTime, settMinutt, stillRiktig, stiltTid, timeviserTekst } from '../lib/klokke/vinkel.js'

// Sorteringsoppgaver: elementene er tall/tekst, eller { id, label, scale } når
// samme figur vises i ulik størrelse.
const sortId = (v) => (v && typeof v === 'object' ? v.id : v)
const sortLabel = (v) => (v && typeof v === 'object' ? v.label : v)
const sortScale = (v) => (v && typeof v === 'object' && v.scale) || ''

// Tallinje å trykke på: bare noen tall står skrevet, barnet finner plassen.
function TapLine({ line, picked, answer, disabled, onPick }) {
  const ticks = []
  for (let v = line.from; v <= line.to; v += line.step) ticks.push(v)
  return (
    <div className="overflow-x-auto py-2">
      <div className="flex items-end gap-0.5 min-w-max px-2 mx-auto w-max">
        {ticks.map((v) => {
          const labeled = (v - line.from) % line.labelEvery === 0
          const isPicked = picked === v
          const isAnswer = answer === v
          let color = 'bg-white border-slate-300 text-transparent'
          if (isAnswer) color = 'bg-emerald-500 border-emerald-600 text-white'
          else if (isPicked) color = answer == null ? 'bg-sky-500 border-sky-600 text-white' : 'bg-rose-400 border-rose-500 text-white'
          return (
            <button
              key={v}
              type="button"
              disabled={disabled}
              onClick={() => onPick(v)}
              aria-label={`${v}`}
              className="flex flex-col items-center w-7 md:w-9"
            >
              <span className={`rounded-full border-2 flex items-center justify-center text-xs md:text-sm font-extrabold transition-all ${labeled ? 'w-7 h-7 md:w-9 md:h-9' : 'w-4 h-4 md:w-5 md:h-5 mb-1.5 md:mb-2'} ${color}`}>
                {isPicked || isAnswer ? v : ''}
              </span>
              <span className={`text-xs md:text-sm font-bold mt-1 ${labeled ? 'text-slate-600' : 'text-transparent'}`}>{labeled ? v : '·'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Én oppgave: to forsøk, Hjelp-knapp, løsning med forklaring etter andre feil.
// onAnswer({ ok, forste, hjelp }) kalles når oppgaven er ferdig (riktig eller etter to feil).
// Bare første forsøk uten hjelp teller mot nivået; det regner den som kaller ut.
export function TaskCard({ task, onDone, attempts = 2, hjelpStart = false, index, total, fag = 'matte', noHelp = false, placement = false, practice = false, onLaer = null, frosset = false, siste = false }) {
  const { recordAttempt } = useStars()
  const [attempt, setAttempt] = useState(1)
  const [input, setInput] = useState('')
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null) // null | 'right' | 'retry' | 'solution'
  const [help, setHelp] = useState(hjelpStart && !!task.hjelp)
  // Hjelp som appen åpner selv (hjelpemodus) regnes ikke som brukt hjelp.
  const [usedHelp, setUsedHelp] = useState(false)
  const [result, setResult] = useState(null)
  const [seq, setSeq] = useState([]) // sortering: valgt rekkefølge
  const [visMeg, setVisMeg] = useState(false) // «👀 Vis meg» i kunnskapsoppgaver

  const spoken = task.spoken || task.prompt
  const lang = task.lang || 'nb-NO'
  const readOptions = task.form === 'valg' && task.readOptions && !task.optionsLang
  const spokenFull = readOptions ? `${spoken} Er det ${task.options.slice(0, -1).join(', ')} eller ${task.options[task.options.length - 1]}?` : spoken
  // Oppgaver som ikke kan løses uten lyd (kreverLyd) leses alltid opp.
  useEffect(() => {
    if (!spokenFull) return
    if (task.kreverLyd) speech.speak(spokenFull, { lang })
    else speech.auto(spokenFull, { lang })
    return () => speech.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task])
  const [klokke, setKlokke] = useState(startKlokke()) // { m, timeDeg }

  useEffect(() => {
    setAttempt(1)
    setInput('')
    setPicked(null)
    setFeedback(null)
    setHelp(hjelpStart && !!task.hjelp)
    setUsedHelp(false)
    setResult(null)
    setSeq([])
    setKlokke(startKlokke())
  }, [task, hjelpStart])

  const answerText =
    task.form === 'santusant'
      ? task.answer
        ? 'Sant'
        : 'Usant'
      : task.form === 'still'
        ? `${task.answer.h}:${String(task.answer.m).padStart(2, '0')}`
        : task.form === 'kart'
          ? landById(task.answer)?.navn || ''
          : task.form === 'valgklokke'
            ? (task.options.find((o) => o.value === task.answer) && `${task.options.find((o) => o.value === task.answer).h}:${String(task.options.find((o) => o.value === task.answer).m).padStart(2, '0')}`) || ''
            : Array.isArray(task.answer)
              ? task.answer.join(', ')
              : typeof task.answer === 'number'
                ? fmt(task.answer)
                : String(task.answer)

  function isCorrect(value) {
    if (task.form === 'tastatur') {
      const n = parseAnswer(value)
      return n != null && Math.abs(n - task.answer) < 1e-9
    }
    if (task.form === 'santusant') return value === task.answer
    if (task.form === 'sorter') return Array.isArray(value) && value.length === task.answer.length && value.every((v, i) => v === task.answer[i])
    if (task.form === 'tallinje') return Number(value) === task.answer
    if (task.form === 'skriv') return String(value).trim().toLowerCase().replace(/\s+/g, ' ') === String(task.answer).trim().toLowerCase()
    if (task.form === 'still') return stillRiktig(value, task.answer)
    return String(value) === String(task.answer)
  }

  function submit(value) {
    if (feedback === 'right' || feedback === 'solution' || frosset) return
    setPicked(value)
    const ok = isCorrect(value)
    const forste = attempt === 1
    if (!practice) recordAttempt({ fag, nivaa: task.nivaa, type: task.type, ok, forste, hjelp: usedHelp, plassering: placement || undefined })
    if (ok) {
      sound.correct()
      speech.auto('Riktig!')
      setFeedback('right')
      setResult({ ok: true, forste, hjelp: usedHelp })
    } else if (attempt < attempts) {
      sound.wrong()
      speech.auto('Ikke helt. Prøv en gang til!')
      setFeedback('retry')
      setAttempt(attempt + 1)
      setTimeout(() => {
        setFeedback((f) => (f === 'retry' ? null : f))
        setPicked(null)
        setInput('')
        setSeq([])
      }, 1200)
    } else {
      sound.wrong()
      const ks = stegForType(fag, task.type)
      speech.auto(`Svaret er ${answerText}. ${ks ? ks.steg.tekst : task.explain || ''}`)
      setFeedback('solution')
      setResult({ ok: false, forste: false, hjelp: usedHelp })
    }
  }

  const done = feedback === 'right' || feedback === 'solution'
  // Låst: ferdig, i «prøv igjen»-pausen, eller mens et kort ligger oppå.
  const laast = done || feedback === 'retry' || frosset
  const canHelp = !!task.hjelp && !noHelp
  const kanVisMeg = !!task.visning && !canHelp && !noHelp && !placement

  // Vis-oppgave: ett bilde med navn, lest høyt, og én knapp. Teller alltid som riktig.
  if (task.form === 'vis') {
    return (
      <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl" data-testid="vis-oppgave">
        <p className="text-center text-sm font-bold text-slate-400 mb-1">👀 Se her</p>
        {task.visual && (
          <div className="mb-3">
            <Visual visual={task.visual} avslort />
          </div>
        )}
        <div className="flex items-start justify-center gap-2 mb-1">
          <p className={`text-center font-extrabold text-slate-700 ${task.prompt.length > 30 ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`} lang={lang}>
            {task.prompt}
          </p>
          <SpeakButton text={spoken} lang={lang} />
        </div>
        {task.under && <p className="text-center text-lg font-bold text-slate-500 mb-2">{task.under}</p>}
        <div className="mt-5 flex justify-center">
          <BigButton color="bg-amber-500" onClick={() => onDone({ ok: true, forste: true, hjelp: false, vis: true })}>
            {siste ? '🏁 Se resultat' : '➡️ Neste'}
          </BigButton>
        </div>
        <AutoSpeakToggle current={spokenFull} />
      </div>
    )
  }

  return (
    <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
      {index != null && (
        <p className="text-center text-sm font-bold text-slate-400 mb-1">
          Oppgave {index + 1} av {total}
          {attempt === 2 && !done && <span className="text-amber-500"> · andre forsøk</span>}
        </p>
      )}
      <div className="flex items-start justify-center gap-2 mb-3">
        <p className={`text-center font-extrabold text-slate-700 ${task.prompt.length > 40 ? 'text-xl md:text-2xl' : 'text-4xl md:text-5xl'}`}>{task.prompt}</p>
        <SpeakButton text={spokenFull} lang={lang} />
      </div>

      {task.visual && (
        <div className="my-3">
          <Visual visual={task.visual} avslort={done} />
        </div>
      )}

      {task.lesTekst && !placement && !done && (
        <div className="text-center my-2">
          <button
            type="button"
            onClick={() => {
              sound.click()
              setUsedHelp(true)
              speech.speak(task.lesTekst, { lang })
            }}
            className="kid-btn bg-violet-100 text-violet-700 text-base px-4 py-2"
          >
            📖 Les teksten for meg
          </button>
        </div>
      )}

      {task.hørOrd && task.form !== 'skriv' && !done && (
        <div className="text-center my-2">
          <button type="button" onClick={() => speech.speak(`${task.hørOrd}. ${task.hørOrd}.`, { lang })} className="kid-btn bg-violet-500 text-white px-5 py-3 text-lg font-extrabold">
            🔊 Hør {task.lang ? 'igjen' : 'ordet'}
          </button>
        </div>
      )}

      {onLaer && !done && laerkortForType(fag, task.type) && (
        <div className="text-center my-2">
          <button
            type="button"
            onClick={() => {
              sound.click()
              setUsedHelp(true)
              onLaer(laerkortForType(fag, task.type))
            }}
            className="kid-btn bg-violet-100 text-violet-700 text-base px-4 py-2"
          >
            📚 Lær
          </button>
        </div>
      )}

      {kanVisMeg && !done && (
        <div className="text-center my-2">
          <button
            type="button"
            onClick={() => {
              sound.click()
              if (!visMeg) setUsedHelp(true)
              setVisMeg((v) => !v)
              if (!visMeg) speech.speak(task.visning.spoken || task.visning.tekst, { lang: task.visning.lang || lang })
            }}
            className="kid-btn bg-sky-100 text-sky-700 text-base px-4 py-2"
          >
            {visMeg ? '🙈 Skjul' : '👀 Vis meg'}
          </button>
          {visMeg && (
            <div data-testid="vis-meg" className="mt-3 bg-sky-50 rounded-2xl p-3">
              {task.visning.visual && <Visual visual={task.visning.visual} avslort />}
              <p className="mt-2 font-extrabold text-slate-700 text-xl" lang={task.visning.lang || lang}>
                {task.visning.tekst}
              </p>
              {task.visning.under && <p className="text-slate-500 font-bold">{task.visning.under}</p>}
            </div>
          )}
        </div>
      )}

      {canHelp && !done && (
        <div className="text-center my-2">
          <button
            type="button"
            onClick={() => {
              sound.click()
              if (!help) setUsedHelp(true)
              setHelp((h) => !h)
            }}
            className={`kid-btn text-base px-4 py-2 ${task.hjelpAlltid ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-700'}`}
          >
            {help ? '🙈 Skjul hjelp' : '💡 Hjelp'}
          </button>
          {help && (
            <div className="mt-3 bg-sky-50 rounded-2xl p-3">
              <Help hjelp={task.hjelp} />
            </div>
          )}
        </div>
      )}

      {/* Svar */}
      {task.form === 'valg' && (
        <div className={`grid gap-3 md:gap-4 mt-4 ${task.options.length === 2 ? 'grid-cols-2' : task.options.length === 3 ? 'grid-cols-3' : task.options.some((o) => String(o).length > 14) ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {task.options.map((opt) => {
            const isPicked = picked !== null && String(picked) === String(opt)
            const isAnswer = String(opt) === String(task.answer)
            let color = 'bg-indigo-500'
            if (done) {
              if (isAnswer) color = 'bg-emerald-500'
              else if (isPicked) color = 'bg-rose-400'
              else color = 'bg-slate-300'
            } else if (feedback === 'retry' && isPicked) color = 'bg-rose-400'
            const label = typeof opt === 'number' ? fmt(opt) : String(opt)
            const big = label.length <= 3 || task.stor
            const langLabel = label.length > 10
            return (
              <button
                key={String(opt)}
                disabled={laast}
                onClick={() => submit(opt)}
                className={`kid-btn ${color} text-white py-5 md:py-6 px-2 relative min-w-0 break-words [overflow-wrap:anywhere] ${big ? 'text-4xl md:text-5xl' : langLabel ? 'text-xl md:text-3xl' : 'text-2xl md:text-3xl'} ${done && isAnswer ? 'animate-bouncey' : ''} ${feedback === 'retry' && isPicked ? 'animate-shake' : ''}`}
              >
                {task.optionFlagg ? <Flagg kode={String(opt)} navn={task.optionFlagg[opt]} avslort={done} className="w-24 md:w-32 mx-auto" /> : label}
                {task.optionsLang && (
                  <span
                    role="button"
                    aria-label="Hør"
                    onClick={(e) => {
                      e.stopPropagation()
                      speech.speak(label, { lang: task.optionsLang })
                    }}
                    className="absolute top-1 right-2 text-base opacity-80 hover:opacity-100"
                  >
                    🔊
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {task.form === 'santusant' && (
        <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
          {[true, false].map((v) => {
            const isPicked = picked === v
            const isAnswer = v === task.answer
            let color = v ? 'bg-emerald-500' : 'bg-rose-500'
            if (done) color = isAnswer ? 'bg-emerald-500' : isPicked ? 'bg-rose-400' : 'bg-slate-300'
            return (
              <button key={String(v)} disabled={laast} onClick={() => submit(v)} className={`kid-btn ${color} text-white text-3xl md:text-4xl py-6 ${done && isAnswer ? 'animate-bouncey' : ''} ${feedback === 'retry' && isPicked ? 'animate-shake' : ''}`}>
                {v ? '✅ Sant' : '❌ Usant'}
              </button>
            )
          })}
        </div>
      )}

      {task.form === 'still' && (
        <div className="mt-2">
          <AnalogClock
            hour={stiltTid(klokke).h}
            minute={klokke.m}
            hourDeg={klokke.timeDeg}
            fasit={done && feedback !== 'right' ? task.answer : null}
            step={task.step || 5}
            interactive={!laast}
            onChange={(h, m, info) => setKlokke((k) => (info?.viser === 'hour' ? settTime(k, info.hourDeg) : settMinutt(k, m)))}
          />
          {done ? (
            <div className="flex flex-col items-center gap-1 mt-2 text-sm font-bold text-slate-500">
              <div className="flex justify-center gap-6">
                <span data-testid="stilt-tid">
                  Du: {stiltTid(klokke).h}:{String(klokke.m).padStart(2, '0')}
                </span>
                <span className="text-emerald-600">Riktig: {answerText}</span>
              </div>
              {feedback !== 'right' && <p className="text-slate-500">Den korte viseren skal stå {timeviserTekst(task.answer)} (grønn stiplet).</p>}
            </div>
          ) : (
            <div className="flex justify-center mt-3">
              <button type="button" disabled={feedback === 'retry'} onClick={() => submit(klokke)} className="kid-btn bg-emerald-500 text-white px-8 py-3 text-2xl font-extrabold disabled:opacity-50">
                ✓ Ferdig
              </button>
            </div>
          )}
        </div>
      )}

      {task.form === 'valgklokke' && (
        <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
          {task.options.map((opt) => {
            const isPicked = picked !== null && picked === opt.value
            const isAnswer = opt.value === task.answer
            let ring = 'ring-4 ring-transparent'
            if (done) ring = isAnswer ? 'ring-4 ring-emerald-500' : isPicked ? 'ring-4 ring-rose-400' : 'ring-4 ring-transparent opacity-50'
            else if (feedback === 'retry' && isPicked) ring = 'ring-4 ring-rose-400'
            return (
              <button key={opt.value} disabled={laast} onClick={() => submit(opt.value)} className={`rounded-3xl bg-white p-2 shadow hover:scale-105 transition-transform ${ring} ${done && isAnswer ? 'animate-bouncey' : ''}`}>
                <AnalogClock hour={opt.h} minute={opt.m} interactive={false} size={200} className="w-32 h-32 md:w-40 md:h-40" />
              </button>
            )
          })}
        </div>
      )}

      {task.form === 'kart' && (
        <div className="mt-3">
          <VerdensKart region={task.region} picked={picked} answer={done ? task.answer : null} disabled={laast} onPick={(id) => submit(id)} />
          {picked && !done && feedback === 'retry' && <p className="text-center text-sm font-bold text-slate-500 mt-1">Du trykket på {landById(picked)?.navn || 'et annet land'}.</p>}
        </div>
      )}

      {task.form === 'sorter' && (
        <div className="mt-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-3 min-h-[3.5rem]">
            {seq.length === 0 && <span className="text-slate-400 font-bold self-center">{task.sorterHint || 'Minst først …'}</span>}
            {seq.map((v, i) => {
              const it = task.items.find((x) => sortId(x) === v)
              return (
                <span key={i} className={`kid-btn px-3 py-2 ${sortScale(it) || (String(sortLabel(it)).length > 4 ? 'text-lg md:text-2xl' : 'text-2xl md:text-3xl')} text-white ${done ? (task.answer[i] === v ? 'bg-emerald-500' : 'bg-rose-400') : 'bg-sky-500'}`}>
                  {sortLabel(it)}
                </span>
              )
            })}
          </div>
          {done && feedback === 'solution' && <p className="text-center font-bold text-slate-500 mb-2">Riktig rekkefølge: {task.answer.map((id) => sortLabel(task.items.find((x) => sortId(x) === id))).join(task.sorterHint ? ' ' : ', ')}</p>}
          <div className="flex flex-wrap justify-center items-end gap-2 md:gap-3">
            {task.items.map((v, i) => {
              const id = sortId(v)
              const used = seq.includes(id)
              return (
                <button
                  key={i}
                  disabled={laast || used}
                  aria-label={typeof v === 'object' ? `${sortLabel(v)} ${id}` : undefined}
                  onClick={() => {
                    sound.click()
                    const next = [...seq, id]
                    setSeq(next)
                    if (next.length === task.items.length) submit(next)
                  }}
                  className={`kid-btn px-4 py-3 md:px-5 md:py-4 break-words ${sortScale(v) || (String(sortLabel(v)).length > 4 ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl')} ${used ? 'bg-slate-200 text-slate-400' : 'bg-indigo-500 text-white'}`}
                >
                  {sortLabel(v)}
                </button>
              )
            })}
          </div>
          {!done && seq.length > 0 && (
            <div className="text-center mt-3">
              <button type="button" onClick={() => setSeq([])} className="text-sm font-bold text-slate-400 underline">
                Begynn på nytt
              </button>
            </div>
          )}
        </div>
      )}

      {task.form === 'tallinje' && (
        <div className="mt-4">
          <TapLine line={task.line} picked={picked} answer={done ? task.answer : null} disabled={laast} onPick={(v) => submit(v)} />
        </div>
      )}

      {task.form === 'skriv' && !done && (
        <form
          className={`mt-4 max-w-sm mx-auto ${feedback === 'retry' ? 'animate-shake' : ''}`}
          onSubmit={(e) => {
            e.preventDefault()
            if (input.trim()) submit(input)
          }}
        >
          {task.hørOrd && (
            <div className="text-center mb-3">
              <button type="button" onClick={() => speech.speak(`${task.hørOrd}. ${task.hørOrd}.`, { lang })} className="kid-btn bg-violet-500 text-white px-5 py-3 text-lg font-extrabold">
                🔊 Hør ordet igjen
              </button>
            </div>
          )}
          <input
            type="text"
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={feedback === 'retry' || frosset}
            placeholder="skriv her"
            className="w-full text-center rounded-2xl border-4 border-slate-200 px-4 py-3 text-3xl font-extrabold text-slate-700 focus:border-sky-400 outline-none tracking-wide"
          />
          <button type="submit" disabled={!input.trim() || feedback === 'retry'} className="kid-btn bg-emerald-500 text-white w-full py-3 text-2xl font-extrabold mt-3 disabled:opacity-50">
            ✓ Ferdig
          </button>
        </form>
      )}

      {task.form === 'tastatur' && !done && (
        <div className={`mt-4 ${feedback === 'retry' ? 'animate-shake' : ''}`}>
          <Keypad value={input} onChange={setInput} onSubmit={() => submit(input)} allowNegative={!!task.allowNegative} allowDecimal={!!task.allowDecimal} disabled={feedback === 'retry' || frosset} unit={task.unit} />
        </div>
      )}

      {feedback === 'retry' && (
        <div className="mt-4 flex justify-center">
          <Mascot mood="think" message="Ikke helt. Prøv en gang til! 💪" size="text-5xl" />
        </div>
      )}

      {done && (
        <div className="mt-5 flex flex-col items-center gap-3">
          <Mascot mood={feedback === 'right' ? 'cheer' : 'oops'} message={feedback === 'right' ? (result?.forste && !result?.hjelp ? 'Riktig! 🎉' : 'Riktig! 👍') : `Svaret er ${answerText}${task.unit ? ' ' + task.unit : ''}.`} size="text-5xl" />
          {feedback === 'solution' && (() => {
            const ks = stegForType(fag, task.type)
            if (ks) {
              return (
                <div className="bg-violet-50 rounded-2xl px-4 py-3 max-w-lg w-full">
                  <p className="text-xs font-extrabold text-violet-500 mb-1">📚 {ks.kort.tittel}</p>
                  {ks.steg.figur?.visual && (
                    <div className="mb-2">
                      <KortVisual visual={ks.steg.figur.visual} />
                    </div>
                  )}
                  {ks.steg.figur?.hjelp && (
                    <div className="mb-2 bg-sky-50 rounded-xl p-2">
                      <KortHelp hjelp={ks.steg.figur.hjelp} />
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <p className="text-slate-700 font-semibold text-base md:text-lg flex-1">{ks.steg.tekst}</p>
                    <SpeakButton text={ks.steg.tekst} size="text-xl" />
                  </div>
                  {task.explain && <p className="text-sm text-slate-500 font-semibold mt-2">{task.explain}</p>}
                </div>
              )
            }
            return task.explain ? (
              <div className="flex items-start gap-2 bg-amber-50 rounded-2xl px-4 py-3 max-w-lg">
                <p className="text-slate-600 font-semibold text-base md:text-lg">{task.explain}</p>
                <SpeakButton text={task.explain} size="text-xl" />
              </div>
            ) : null
          })()}
          <BigButton color="bg-amber-500" onClick={() => onDone(result)}>
            {(index != null && index + 1 >= total) || siste ? '🏁 Se resultat' : '➡️ Neste'}
          </BigButton>
        </div>
      )}
      <AutoSpeakToggle current={spokenFull} />
    </div>
  )
}

// Kjører en liste oppgaver og samler resultatet.
// onDone({ correct, total, perTask, missedTypes })
export default function Oppdrag({ tasks, title, hjelpStart = false, onDone, onHome, fag = 'matte', attempts = 2, noHelp = false, stige = null }) {
  const [i, setI] = useState(0)
  const [perTask, setPerTask] = useState([])
  const [laer, setLaer] = useState(null)
  const task = tasks[i]

  function next(res) {
    const vis = task.form === 'vis'
    const entry = { type: task.type, nivaa: task.nivaa, tag: task.tag, kortId: task.kortId, kjent: task.kjent, vis, ...res, counts: vis || !!(res.ok && res.forste && !res.hjelp) }
    const all = [...perTask, entry]
    if (i + 1 >= tasks.length) {
      const correct = all.filter((r) => r.counts).length
      const missedTypes = [...new Set(all.filter((r) => !r.ok).map((r) => r.type))]
      onDone({ correct, total: tasks.length, perTask: all, missedTypes })
    } else {
      setPerTask(all)
      setI(i + 1)
    }
  }

  return (
    <div className="animate-pop-in">
      <TopBar title={title} onHome={onHome} />
      <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
        <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${(i / tasks.length) * 100}%` }} />
      </div>
      {laer && <LaerKort kort={laer} stige={stige} modus="laer" fag={fag} onDone={() => setLaer(null)} />}
      <TaskCard key={i} task={task} index={i} total={tasks.length} onDone={next} hjelpStart={hjelpStart} fag={fag} attempts={attempts} noHelp={noHelp} onLaer={stige ? (k) => setLaer(k) : null} frosset={!!laer} />
    </div>
  )
}

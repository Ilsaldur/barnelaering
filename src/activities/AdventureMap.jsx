import { useRef, useState } from 'react'
import { TopBar, Mascot, Confetti, BigButton } from '../components/ui.jsx'
import { SpeakButton, useAutoSpeak } from '../components/Speak.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { shuffle } from '../lib/rng.js'
import { STEDER, EVENTYR_BELONNING, eventyrStars } from '../data/eventyr.js'

// Eventyrkartet: dra et stempel til et sted (eller trykk på det) for å åpne en
// liten quiz. Et sted gir stjerner én gang, og bare når alt er riktig.
// Fullførte steder huskes i profilen.

function MiniGame({ node, alreadyDone, onFinish, onClose }) {
  const [qi, setQi] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [result, setResult] = useState(null) // { correct, stars }
  const options = useRef(node.questions.map((x) => shuffle(x.options))).current
  const q = node.questions[qi]
  const spoken = !result ? q.prompt : ''
  useAutoSpeak(spoken, [qi])

  function answer(opt) {
    if (feedback) return
    setPicked(opt)
    if (opt === q.answer) {
      setFeedback('right')
      setCorrect((c) => c + 1)
      sound.correct()
      speech.auto('Riktig!')
    } else {
      setFeedback('wrong')
      sound.wrong()
      speech.auto(`Det riktige er ${q.answer}.`)
    }
  }

  function next() {
    if (qi + 1 >= node.questions.length) {
      const total = node.questions.length
      const stars = eventyrStars(correct, total, alreadyDone)
      setResult({ correct, total, stars })
      onFinish(correct, total, stars)
    } else {
      setQi((i) => i + 1)
      setPicked(null)
      setFeedback(null)
    }
  }

  let message = ''
  if (result) {
    if (result.stars > 0) message = `Du klarte ${node.title}! +${result.stars} ⭐`
    else if (alreadyDone) message = result.correct === result.total ? 'Alle riktige igjen! Stedet er allerede klart.' : 'Dette stedet har du klart før. Bare øving nå!'
    else message = `${result.correct} av ${result.total} riktig. Alle må være riktige for å klare stedet. Prøv igjen!`
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 md:p-7 shadow-2xl max-w-lg w-full animate-pop-in max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-700">
            {node.emoji} {node.title}
          </h2>
          <button onClick={onClose} className="kid-btn bg-slate-200 text-slate-600 text-xl px-4 py-2" aria-label="Lukk">
            ✖️
          </button>
        </div>

        {result ? (
          <div className="text-center">
            <Mascot mood={result.stars > 0 ? 'cheer' : result.correct === result.total ? 'happy' : 'think'} message={message} />
            <div className="text-7xl my-4">{result.stars > 0 ? '🏅' : result.correct === result.total ? '✅' : '🦊'}</div>
            <BigButton color="bg-emerald-500" onClick={onClose}>
              🗺️ Tilbake til kartet
            </BigButton>
          </div>
        ) : (
          <>
            <p className="text-center text-base text-slate-400 mb-1">
              Oppgave {qi + 1} av {node.questions.length}
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="text-center text-xl md:text-2xl font-bold text-slate-700">{q.prompt}</p>
              <SpeakButton text={q.prompt} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {options[qi].map((opt) => {
                const isPicked = picked === opt
                const isAnswer = opt === q.answer
                let color = 'bg-cyan-500'
                if (feedback) {
                  if (isAnswer) color = 'bg-emerald-500'
                  else if (isPicked) color = 'bg-rose-400'
                  else color = 'bg-slate-300'
                }
                const pic = q.pictures?.[opt]
                return (
                  <button
                    key={opt}
                    disabled={!!feedback}
                    onClick={() => answer(opt)}
                    className={`kid-btn ${color} text-white text-xl md:text-2xl py-4 flex flex-col items-center gap-1 ${feedback && isAnswer ? 'animate-bouncey' : ''} ${
                      feedback && isPicked && !isAnswer ? 'animate-shake' : ''
                    }`}
                  >
                    {pic && <span className="text-4xl leading-none">{pic}</span>}
                    <span className={pic ? 'text-base font-bold' : ''}>{opt}</span>
                  </button>
                )
              })}
            </div>
            {feedback && (
              <div className="mt-4 flex justify-center">
                <BigButton color="bg-amber-500" onClick={next}>
                  {qi + 1 >= node.questions.length ? '🏁 Ferdig' : '➡️ Neste'}
                </BigButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function AdventureMap({ go }) {
  const { stars, unlocked, eventyr, completeEventyr } = useStars()
  const nodeRefs = useRef({})
  const [drag, setDrag] = useState(null) // { emoji, x, y }
  const [planted, setPlanted] = useState({}) // nodeId -> emoji
  const [active, setActive] = useState(null) // sted som spilles
  const [msg, setMsg] = useState(null)
  const [confetti, setConfetti] = useState(false)

  const tokens = unlocked.length > 0 ? unlocked.map((u) => u.emoji) : ['🦊']
  const doneCount = STEDER.filter((n) => eventyr[n.id]).length

  function hitTest(x, y) {
    for (const n of STEDER) {
      const el = nodeRefs.current[n.id]
      if (!el) continue
      const r = el.getBoundingClientRect()
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return n
    }
    return null
  }

  function tryOpen(node, emoji) {
    setMsg(null)
    if (stars < node.need) {
      const m = `Du trenger ${node.need} ⭐ for å åpne ${node.title}. Du har ${stars} ⭐.`
      setMsg(m)
      speech.auto(m)
      sound.wrong()
      return
    }
    if (emoji) setPlanted((p) => ({ ...p, [node.id]: emoji }))
    sound.click()
    setActive(node)
  }

  function beginDrag(e, emoji) {
    e.preventDefault()
    setDrag({ emoji, x: e.clientX, y: e.clientY })
  }
  function moveDrag(e) {
    if (!drag) return
    setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d))
  }
  function endDrag(e) {
    if (!drag) return
    const hit = hitTest(e.clientX, e.clientY)
    const emoji = drag.emoji
    setDrag(null)
    if (hit) tryOpen(hit, emoji)
  }

  function finished(node, correct, total, earned) {
    if (earned > 0) {
      completeEventyr(node.id, earned)
      setConfetti(true)
      sound.fanfare()
      setTimeout(() => setConfetti(false), 2500)
    }
  }

  return (
    <div className="animate-pop-in">
      <Confetti show={confetti} />
      <TopBar title="Eventyrkart 🗺️" onHome={() => go('home')} />

      <div className="flex justify-center mb-3">
        <Mascot
          message={doneCount === STEDER.length ? 'Du har klart alle stedene! 🌈' : 'Dra et stempel til et sted, eller trykk på det! 🖐️'}
          size="text-5xl"
        />
      </div>

      {msg && <div className="bg-white/95 rounded-2xl px-4 py-3 text-center font-bold text-slate-600 shadow mb-3 animate-pop-in">🔒 {msg}</div>}

      <div
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="relative w-full rounded-3xl shadow-xl overflow-hidden touch-none select-none bg-gradient-to-br from-emerald-200 via-teal-200 to-sky-200"
        style={{ height: '58vh', minHeight: 320 }}
      >
        <div className="absolute inset-0 text-3xl opacity-40 pointer-events-none">
          <span className="absolute" style={{ left: '8%', top: '70%' }}>🌿</span>
          <span className="absolute" style={{ left: '60%', top: '12%' }}>☁️</span>
          <span className="absolute" style={{ left: '30%', top: '40%' }}>🌼</span>
          <span className="absolute" style={{ left: '85%', top: '60%' }}>🐚</span>
          <span className="absolute" style={{ left: '50%', top: '85%' }}>🌷</span>
        </div>

        {STEDER.map((n) => {
          const locked = stars < n.need
          const isDone = !!eventyr[n.id]
          return (
            <button
              key={n.id}
              ref={(el) => (nodeRefs.current[n.id] = el)}
              onClick={() => tryOpen(n, planted[n.id])}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-transform hover:scale-110 ${locked ? 'opacity-70' : ''}`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <span className="relative">
                <span className="text-5xl md:text-6xl drop-shadow-lg">{n.emoji}</span>
                {planted[n.id] && <span className="absolute -top-2 -right-2 text-2xl">{planted[n.id]}</span>}
                {isDone && <span className="absolute -bottom-1 -right-1 text-2xl">✅</span>}
              </span>
              <span className="mt-1 bg-white/90 rounded-full px-3 py-0.5 text-xs md:text-sm font-bold text-slate-600 shadow whitespace-nowrap">
                {locked ? `🔒 ${n.need} ⭐` : n.title}
              </span>
            </button>
          )
        })}
      </div>

      <div className="bg-white/90 rounded-3xl p-4 mt-3 shadow-lg">
        <p className="text-center text-base font-bold text-slate-500 mb-2">
          Stemplene dine {unlocked.length === 0 && '(samle stjerner for å få flere!)'} · {doneCount} av {STEDER.length} steder klart
          {doneCount < STEDER.length && ` · alle riktige gir ${EVENTYR_BELONNING} ⭐`}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {tokens.map((emoji, i) => (
            <button key={i} onPointerDown={(e) => beginDrag(e, emoji)} className="text-4xl md:text-5xl bg-amber-100 rounded-2xl p-2 shadow cursor-grab active:scale-110 touch-none" style={{ touchAction: 'none' }}>
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {drag && (
        <span className="fixed text-5xl pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2" style={{ left: drag.x, top: drag.y }}>
          {drag.emoji}
        </span>
      )}

      {active && (
        <MiniGame
          key={active.id}
          node={active}
          alreadyDone={!!eventyr[active.id]}
          onFinish={(correct, total, earned) => finished(active, correct, total, earned)}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  )
}

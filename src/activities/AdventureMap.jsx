import { useRef, useState } from 'react'
import { TopBar, Mascot, Confetti, BigButton } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'

// Bonus-sone: dra et stempel til et sted på kartet (eller trykk på det)
// for å låse opp en liten quiz. Hvert sted krever et visst antall stjerner.

const REWARD = 2 // stjerner for å fullføre et sted

const NODES = [
  {
    id: 'skog',
    x: 20,
    y: 32,
    emoji: '🌳',
    title: 'Tryllesskogen',
    need: 0,
    questions: [
      { prompt: 'Hvor mange bein har en edderkopp? 🕷️', options: ['8', '6', '4', '10'], answer: '8' },
      { prompt: 'Hva blir 2 + 3?', options: ['5', '4', '6', '7'], answer: '5' },
      { prompt: 'Hvilken farge er et blad om sommeren? 🍃', options: ['Grønn', 'Blå', 'Rød', 'Svart'], answer: 'Grønn' },
    ],
  },
  {
    id: 'hav',
    x: 76,
    y: 30,
    emoji: '🌊',
    title: 'Det blå havet',
    need: 3,
    questions: [
      { prompt: 'Hvilket dyr bor i havet? 🐙', options: ['Blekksprut', 'Løve', 'Ku', 'Ulv'], answer: 'Blekksprut' },
      { prompt: 'Hva blir 4 + 4?', options: ['8', '6', '9', '7'], answer: '8' },
      { prompt: 'Hvor mange er et halvt dusin?', options: ['6', '12', '3', '5'], answer: '6' },
    ],
  },
  {
    id: 'fjell',
    x: 46,
    y: 18,
    emoji: '⛰️',
    title: 'Det høye fjellet',
    need: 6,
    questions: [
      { prompt: 'Hva er hovedstaden i Norge?', options: ['Oslo', 'Bergen', 'Stockholm', 'Tromsø'], answer: 'Oslo' },
      { prompt: 'Hva blir 5 × 2?', options: ['10', '7', '12', '8'], answer: '10' },
      { prompt: 'Hva er motsatt av høy?', options: ['Lav', 'Stor', 'Rask', 'Tung'], answer: 'Lav' },
    ],
  },
  {
    id: 'slott',
    x: 34,
    y: 64,
    emoji: '🏰',
    title: 'Det gylne slottet',
    need: 10,
    questions: [
      { prompt: 'Hva blir 10 + 5?', options: ['15', '14', '16', '12'], answer: '15' },
      { prompt: 'Hvor mange minutter er en halv time?', options: ['30', '15', '60', '45'], answer: '30' },
      { prompt: 'Hva blir 3 × 3?', options: ['9', '6', '12', '8'], answer: '9' },
    ],
  },
  {
    id: 'rakett',
    x: 72,
    y: 70,
    emoji: '🚀',
    title: 'Verdensrommet',
    need: 15,
    questions: [
      { prompt: 'Hvilken planet bor vi på? 🌍', options: ['Jorda', 'Mars', 'Månen', 'Sola'], answer: 'Jorda' },
      { prompt: 'Hva blir 6 × 5?', options: ['30', '25', '35', '11'], answer: '30' },
      { prompt: 'Hva er halvparten av 20?', options: ['10', '5', '15', '40'], answer: '10' },
    ],
  },
]

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// Liten quiz som vises når man åpner et sted.
function MiniGame({ node, onWin, onClose, alreadyDone }) {
  const [qi, setQi] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const q = node.questions[qi]
  const options = useRef(node.questions.map((x) => shuffle(x.options))).current[qi]

  function answer(opt) {
    if (feedback) return
    setPicked(opt)
    if (opt === q.answer) {
      setFeedback('right')
      setCorrect((c) => c + 1)
      sound.correct()
    } else {
      setFeedback('wrong')
      sound.wrong()
    }
  }

  function next() {
    if (qi + 1 >= node.questions.length) {
      setFinished(true)
      if (!alreadyDone) onWin(correct + (feedback === 'right' ? 0 : 0))
    } else {
      setQi((i) => i + 1)
      setPicked(null)
      setFeedback(null)
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 md:p-7 shadow-2xl max-w-lg w-full animate-pop-in">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-700">
            {node.emoji} {node.title}
          </h2>
          <button onClick={onClose} className="kid-btn bg-slate-200 text-slate-600 text-xl px-4 py-2">
            ✖️
          </button>
        </div>

        {finished ? (
          <div className="text-center">
            <Mascot
              mood="cheer"
              message={alreadyDone ? 'Bra jobba igjen! 🎉' : `Du klarte ${node.title}! +${REWARD} ⭐`}
            />
            <div className="text-7xl my-4">🏅</div>
            <BigButton color="bg-emerald-500" onClick={onClose}>
              🗺️ Tilbake til kartet
            </BigButton>
          </div>
        ) : (
          <>
            <p className="text-center text-base text-slate-400 mb-1">
              Oppgave {qi + 1} av {node.questions.length}
            </p>
            <p className="text-center text-xl md:text-2xl font-bold text-slate-700 mb-4">{q.prompt}</p>
            <div className="grid grid-cols-2 gap-3">
              {options.map((opt) => {
                const isPicked = picked === opt
                const isAnswer = opt === q.answer
                let color = 'bg-cyan-500'
                if (feedback) {
                  if (isAnswer) color = 'bg-emerald-500'
                  else if (isPicked) color = 'bg-rose-400'
                  else color = 'bg-slate-300'
                }
                return (
                  <button
                    key={opt}
                    disabled={!!feedback}
                    onClick={() => answer(opt)}
                    className={`kid-btn ${color} text-white text-xl md:text-2xl py-4 ${
                      feedback && isAnswer ? 'animate-bouncey' : ''
                    }`}
                  >
                    {opt}
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
  const { stars, unlocked, addStars } = useStars()
  const nodeRefs = useRef({})
  const [drag, setDrag] = useState(null) // { emoji, x, y }
  const [planted, setPlanted] = useState({}) // nodeId -> emoji
  const [done, setDone] = useState({}) // nodeId -> true
  const [active, setActive] = useState(null) // node som spilles
  const [msg, setMsg] = useState(null)
  const [confetti, setConfetti] = useState(false)

  // Stempler barnet kan dra: opptjente klistremerker (eller reven som standard).
  const tokens = unlocked.length > 0 ? unlocked.map((u) => u.emoji) : ['🦊']

  function hitTest(x, y) {
    for (const n of NODES) {
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
      setMsg(`Du trenger ${node.need} ⭐ for å åpne ${node.title}. Du har ${stars} ⭐.`)
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

  function winNode(node) {
    setDone((d) => ({ ...d, [node.id]: true }))
    addStars(REWARD)
    setConfetti(true)
    sound.fanfare()
    setTimeout(() => setConfetti(false), 2500)
  }

  return (
    <div className="animate-pop-in">
      <Confetti show={confetti} />
      <TopBar title="Eventyrkart 🗺️" onHome={() => go('home')} />

      <div className="flex justify-center mb-3">
        <Mascot message="Dra et stempel til et sted – eller trykk på det! 🖐️" size="text-5xl" />
      </div>

      {msg && (
        <div className="bg-white/95 rounded-2xl px-4 py-3 text-center font-bold text-slate-600 shadow mb-3 animate-pop-in">
          🔒 {msg}
        </div>
      )}

      {/* Selve kartet */}
      <div
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="relative w-full rounded-3xl shadow-xl overflow-hidden touch-none select-none bg-gradient-to-br from-emerald-200 via-teal-200 to-sky-200"
        style={{ height: '58vh', minHeight: 320 }}
      >
        {/* Litt pynt i bakgrunnen */}
        <div className="absolute inset-0 text-3xl opacity-40 pointer-events-none">
          <span className="absolute" style={{ left: '8%', top: '70%' }}>🌿</span>
          <span className="absolute" style={{ left: '60%', top: '12%' }}>☁️</span>
          <span className="absolute" style={{ left: '30%', top: '40%' }}>🌼</span>
          <span className="absolute" style={{ left: '85%', top: '60%' }}>🐚</span>
          <span className="absolute" style={{ left: '50%', top: '85%' }}>🌷</span>
        </div>

        {NODES.map((n) => {
          const locked = stars < n.need
          const isDone = done[n.id]
          return (
            <button
              key={n.id}
              ref={(el) => (nodeRefs.current[n.id] = el)}
              onClick={() => tryOpen(n, planted[n.id])}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-transform hover:scale-110 ${
                locked ? 'opacity-70' : ''
              }`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <span className="relative">
                <span className="text-5xl md:text-6xl drop-shadow-lg">{n.emoji}</span>
                {planted[n.id] && (
                  <span className="absolute -top-2 -right-2 text-2xl">{planted[n.id]}</span>
                )}
                {isDone && <span className="absolute -bottom-1 -right-1 text-2xl">✅</span>}
              </span>
              <span className="mt-1 bg-white/90 rounded-full px-3 py-0.5 text-xs md:text-sm font-bold text-slate-600 shadow whitespace-nowrap">
                {locked ? `🔒 ${n.need} ⭐` : n.title}
              </span>
            </button>
          )
        })}
      </div>

      {/* Stempel-skuff */}
      <div className="bg-white/90 rounded-3xl p-4 mt-3 shadow-lg">
        <p className="text-center text-base font-bold text-slate-500 mb-2">
          Stemplene dine {unlocked.length === 0 && '(samle stjerner for å få flere!)'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {tokens.map((emoji, i) => (
            <button
              key={i}
              onPointerDown={(e) => beginDrag(e, emoji)}
              className="text-4xl md:text-5xl bg-amber-100 rounded-2xl p-2 shadow cursor-grab active:scale-110 touch-none"
              style={{ touchAction: 'none' }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Stempelet som dras (følger fingeren) */}
      {drag && (
        <span
          className="fixed text-5xl pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: drag.x, top: drag.y }}
        >
          {drag.emoji}
        </span>
      )}

      {active && (
        <MiniGame
          node={active}
          alreadyDone={!!done[active.id]}
          onWin={() => winNode(active)}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  )
}

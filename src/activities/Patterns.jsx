import { useRef, useState } from 'react'
import { TopBar, Mascot, BigButton } from '../components/ui.jsx'
import { SpeakButton, useAutoSpeak, AutoSpeakToggle } from '../components/Speak.jsx'
import RoundDone from '../components/RoundDone.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { shuffle, pick, randInt } from '../lib/rng.js'
import { starsFor } from '../lib/scoring.js'
import { ROUND_LENGTH, uniqueRound } from '../lib/round.js'

const PATTERN_TILES = [
  ['🔴', '🔵'],
  ['🟢', '🟡'],
  ['⭐', '🌙'],
  ['🐶', '🐱'],
  ['🔺', '⬜'],
  ['🍎', '🍌', '🍇'],
  ['🟣', '🟠', '🟣'],
  ['🐸', '🐸', '🦋'],
]
const EXTRA = ['🟣', '🟠', '🟤', '⚫']

function makePattern() {
  const set = pick(PATTERN_TILES)
  const reps = randInt(2, 3)
  const seq = []
  for (let i = 0; i < reps; i++) seq.push(...set)
  const answer = set[seq.length % set.length]
  const distinct = [...new Set(set)]
  const options = [...distinct]
  for (const e of shuffle(EXTRA)) {
    if (options.length >= 4) break
    if (!options.includes(e)) options.push(e)
  }
  return { seq, answer, options: shuffle(options.slice(0, 4)), key: seq.join('') }
}

// ----- Spill 1: Hva kommer neste i mønsteret? (8 oppgaver, første forsøk teller) -----
function PatternGame({ onDone }) {
  const [round] = useState(() => uniqueRound(makePattern, ROUND_LENGTH, { keyOf: (p) => p.key }))
  const [qi, setQi] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const data = round[qi]
  const prompt = 'Hva kommer neste i mønsteret?'
  useAutoSpeak(prompt, [qi])

  function answer(opt) {
    if (feedback) return
    setPicked(opt)
    if (opt === data.answer) {
      setFeedback('right')
      setCorrect((c) => c + 1)
      sound.correct()
      speech.auto('Riktig!')
    } else {
      setFeedback('wrong')
      sound.wrong()
    }
  }

  function next() {
    if (qi + 1 >= round.length) onDone(correct, round.length)
    else {
      setQi((i) => i + 1)
      setPicked(null)
      setFeedback(null)
    }
  }

  return (
    <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
      <div className="flex items-center justify-center gap-2 mb-4">
        <p className="text-center text-xl md:text-2xl font-bold text-slate-600">
          Hva kommer neste? 🤔 ({qi + 1}/{round.length})
        </p>
        <SpeakButton text={prompt} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 text-5xl md:text-6xl mb-6">
        {data.seq.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
        <span className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-dashed border-slate-400 flex items-center justify-center animate-wiggle">
          {feedback ? data.answer : '❓'}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {data.options.map((opt, i) => {
          let color = 'bg-orange-400'
          if (feedback) {
            if (opt === data.answer) color = 'bg-emerald-500'
            else if (opt === picked) color = 'bg-rose-400'
            else color = 'bg-slate-300'
          }
          return (
            <button key={i} disabled={!!feedback} onClick={() => answer(opt)} className={`kid-btn ${color} text-white text-5xl py-5 ${feedback && opt === data.answer ? 'animate-bouncey' : ''}`}>
              {opt}
            </button>
          )
        })}
      </div>
      {feedback && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <Mascot mood={feedback === 'right' ? 'cheer' : 'oops'} message={feedback === 'right' ? 'Riktig! 🎉' : `Det riktige var ${data.answer}`} size="text-5xl" />
          <BigButton color="bg-amber-500" onClick={next}>
            {qi + 1 >= round.length ? '🏁 Se resultat' : '➡️ Neste'}
          </BigButton>
        </div>
      )}
      <AutoSpeakToggle current={prompt} />
    </div>
  )
}

// ----- Spill 2: Dra formene i riktig rekkefølge (minst → størst), 4 runder -----
const SIZE_SETS = [
  [
    { id: 'a', emoji: '🔵', size: 1, scale: 'text-3xl' },
    { id: 'b', emoji: '🔵', size: 2, scale: 'text-5xl' },
    { id: 'c', emoji: '🔵', size: 3, scale: 'text-7xl' },
  ],
  [
    { id: 'a', emoji: '⭐', size: 1, scale: 'text-3xl' },
    { id: 'b', emoji: '⭐', size: 2, scale: 'text-5xl' },
    { id: 'c', emoji: '⭐', size: 3, scale: 'text-6xl' },
    { id: 'd', emoji: '⭐', size: 4, scale: 'text-8xl' },
  ],
  [
    { id: 'a', emoji: '🐭', size: 1, scale: 'text-4xl' },
    { id: 'b', emoji: '🐰', size: 2, scale: 'text-5xl' },
    { id: 'c', emoji: '🐶', size: 3, scale: 'text-6xl' },
    { id: 'd', emoji: '🐘', size: 4, scale: 'text-8xl' },
  ],
  [
    { id: 'a', emoji: '🍒', size: 1, scale: 'text-3xl' },
    { id: 'b', emoji: '🍎', size: 2, scale: 'text-5xl' },
    { id: 'c', emoji: '🍉', size: 3, scale: 'text-7xl' },
  ],
]
const SORT_ROUNDS = 4

function isSorted(arr) {
  return arr.every((it, i) => i === 0 || arr[i - 1].size < it.size)
}
function scrambled(set) {
  let arr = shuffle(set)
  let guard = 0
  while (isSorted(arr) && guard++ < 10) arr = shuffle(set)
  return arr
}

function SortGame({ onDone }) {
  const [round, setRound] = useState(0)
  const [items, setItems] = useState(() => scrambled(SIZE_SETS[0]))
  const [checked, setChecked] = useState(null) // null | 'right' | 'wrong'
  const [firstTry, setFirstTry] = useState(true)
  const [correct, setCorrect] = useState(0)
  const dragIndex = useRef(null)
  const rowRef = useRef(null)
  const prompt = 'Dra fra minst til størst, og trykk Sjekk.'
  useAutoSpeak(prompt, [round])

  function loadRound(r) {
    setItems(scrambled(SIZE_SETS[r % SIZE_SETS.length]))
    setChecked(null)
    setFirstTry(true)
  }

  function check() {
    if (checked === 'right') return
    if (isSorted(items)) {
      setChecked('right')
      sound.correct()
      if (firstTry) setCorrect((c) => c + 1)
    } else {
      setChecked('wrong')
      setFirstTry(false)
      sound.wrong()
      setTimeout(() => setChecked(null), 900)
    }
  }

  function next() {
    if (round + 1 >= SORT_ROUNDS) onDone(correct, SORT_ROUNDS)
    else {
      setRound((r) => r + 1)
      loadRound(round + 1)
    }
  }

  function onPointerDown(i) {
    if (checked === 'right') return
    dragIndex.current = i
    sound.click()
  }
  function onPointerMove(e) {
    if (dragIndex.current === null || checked === 'right') return
    const children = [...rowRef.current.children]
    let overIndex = null
    children.forEach((child, i) => {
      const rect = child.getBoundingClientRect()
      if (e.clientX >= rect.left && e.clientX <= rect.right) overIndex = i
    })
    if (overIndex !== null && overIndex !== dragIndex.current) {
      setItems((prev) => {
        const arr = [...prev]
        const [moved] = arr.splice(dragIndex.current, 1)
        arr.splice(overIndex, 0, moved)
        dragIndex.current = overIndex
        return arr
      })
    }
  }
  function onPointerUp() {
    dragIndex.current = null
  }

  // Tastatur/berøring uten dra: trykk to brikker for å bytte plass.
  const [swapFrom, setSwapFrom] = useState(null)
  function tap(i) {
    if (checked === 'right') return
    if (swapFrom === null) setSwapFrom(i)
    else {
      setItems((prev) => {
        const arr = [...prev]
        ;[arr[swapFrom], arr[i]] = [arr[i], arr[swapFrom]]
        return arr
      })
      setSwapFrom(null)
    }
  }

  return (
    <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
      <div className="flex items-center justify-center gap-2 mb-1">
        <p className="text-center text-xl md:text-2xl font-bold text-slate-600">
          Dra fra minst til størst! ({round + 1}/{SORT_ROUNDS})
        </p>
        <SpeakButton text={prompt} />
      </div>
      <p className="text-center text-base text-slate-400 mb-4">👈 liten … stor 👉 (eller trykk på to for å bytte)</p>
      <div ref={rowRef} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} className="flex items-center justify-center gap-2 md:gap-4 min-h-[140px] touch-none flex-wrap">
        {items.map((it, i) => (
          <button
            key={it.id}
            onPointerDown={() => onPointerDown(i)}
            onClick={() => tap(i)}
            className={`${it.scale} ${checked === 'right' ? 'animate-bouncey' : 'active:scale-110'} ${
              swapFrom === i ? 'ring-4 ring-sky-400' : ''
            } cursor-grab bg-amber-100 rounded-2xl p-2 shadow transition-transform`}
            style={{ touchAction: 'none' }}
          >
            {it.emoji}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-col items-center gap-3">
        {checked === 'right' ? (
          <>
            <Mascot mood="cheer" message={firstTry ? 'Perfekt sortert! 🎉' : 'Nå ble det riktig! 👍'} size="text-5xl" />
            <BigButton color="bg-amber-500" onClick={next}>
              {round + 1 >= SORT_ROUNDS ? '🏁 Se resultat' : '➡️ Neste'}
            </BigButton>
          </>
        ) : (
          <>
            {checked === 'wrong' && <Mascot mood="oops" message="Ikke helt. Prøv igjen!" size="text-5xl" />}
            <BigButton color="bg-emerald-500" onClick={check}>
              ✅ Sjekk
            </BigButton>
          </>
        )}
      </div>
      <AutoSpeakToggle current={prompt} />
    </div>
  )
}

export default function Patterns({ go }) {
  const { addStars } = useStars()
  const [game, setGame] = useState(null) // null | 'pattern' | 'sort'
  const [result, setResult] = useState(null) // { correct, total }

  function done(correct, total) {
    addStars(starsFor(correct, total), { correct, total })
    setResult({ correct, total })
  }

  if (result) {
    const stars = starsFor(result.correct, result.total)
    return (
      <RoundDone
        correct={result.correct}
        total={result.total}
        stars={stars}
        onAgain={() => {
          const g = game
          setResult(null)
          setGame(null)
          setTimeout(() => setGame(g), 0)
        }}
        onHome={() => go('home')}
      >
        <BigButton
          color="bg-orange-500"
          onClick={() => {
            setResult(null)
            setGame(null)
          }}
        >
          🎮 Velg spill
        </BigButton>
      </RoundDone>
    )
  }

  if (game === 'pattern') {
    return (
      <div className="animate-pop-in">
        <TopBar title="Mønster 🔺" onHome={() => go('home')} />
        <PatternGame onDone={done} />
      </div>
    )
  }
  if (game === 'sort') {
    return (
      <div className="animate-pop-in">
        <TopBar title="Sortering 🔢" onHome={() => go('home')} />
        <SortGame onDone={done} />
      </div>
    )
  }

  return (
    <div className="animate-pop-in">
      <TopBar title="Mønster og sortering 🔺" onHome={() => go('home')} />
      <div className="flex justify-center my-4">
        <Mascot message="Hva vil du leke med?" />
      </div>
      <div className="grid gap-4 mt-4">
        <button
          onClick={() => {
            sound.click()
            setGame('pattern')
          }}
          className="kid-btn bg-orange-500 text-white p-4 md:p-6 flex items-center gap-3 md:gap-4 min-w-0 hover:scale-[1.02]"
        >
          <span className="text-3xl md:text-6xl shrink-0">🔴🔵🔴</span>
          <span className="text-left min-w-0 flex-1">
            <span className="block text-xl md:text-3xl font-extrabold break-words">Hva kommer neste?</span>
            <span className="block text-base md:text-lg opacity-95">Fullfør mønsteret</span>
          </span>
        </button>
        <button
          onClick={() => {
            sound.click()
            setGame('sort')
          }}
          className="kid-btn bg-rose-500 text-white p-4 md:p-6 flex items-center gap-3 md:gap-4 min-w-0 hover:scale-[1.02]"
        >
          <span className="text-3xl md:text-5xl shrink-0">🔵⭐🐘</span>
          <span className="text-left min-w-0 flex-1">
            <span className="block text-xl md:text-3xl font-extrabold break-words">Sortér etter størrelse</span>
            <span className="block text-base md:text-lg opacity-95">Dra fra minst til størst</span>
          </span>
        </button>
      </div>
    </div>
  )
}

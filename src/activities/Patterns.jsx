import { useRef, useState } from 'react'
import { TopBar, Mascot, Confetti, BigButton } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

const PATTERN_TILES = [
  ['🔴', '🔵'],
  ['🟢', '🟡'],
  ['⭐', '🌙'],
  ['🐶', '🐱'],
  ['🔺', '⬜'],
  ['🍎', '🍌', '🍇'],
]

// ----- Spill 1: Hva kommer neste i mønsteret? -----
function PatternGame({ onWin }) {
  const [round, setRound] = useState(0)
  const [data, setData] = useState(() => makePattern())
  const [feedback, setFeedback] = useState(null)

  function makePattern() {
    const set = PATTERN_TILES[randInt(0, PATTERN_TILES.length - 1)]
    const reps = randInt(2, 3)
    const seq = []
    for (let i = 0; i < reps; i++) seq.push(...set)
    // Spør om neste element i syklusen.
    const answer = set[seq.length % set.length]
    const options = shuffle([...new Set([...set, '🟣', '🟠'])]).slice(0, 4)
    if (!options.includes(answer)) options[0] = answer
    return { seq, answer, options: shuffle(options) }
  }

  function pick(opt) {
    if (feedback) return
    if (opt === data.answer) {
      setFeedback('right')
      sound.correct()
      setTimeout(() => {
        if (round + 1 >= 4) {
          onWin()
        } else {
          setRound((r) => r + 1)
          setData(makePattern())
          setFeedback(null)
        }
      }, 1100)
    } else {
      setFeedback('wrong')
      sound.wrong()
      setTimeout(() => setFeedback(null), 700)
    }
  }

  return (
    <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
      <p className="text-center text-xl md:text-2xl font-bold text-slate-600 mb-4">
        Hva kommer neste? 🤔 ({round + 1}/4)
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 text-5xl md:text-6xl mb-6">
        {data.seq.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
        <span className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-dashed border-slate-400 flex items-center justify-center animate-wiggle">
          ❓
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {data.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(opt)}
            className={`kid-btn bg-orange-400 text-white text-5xl py-5 ${
              feedback === 'right' && opt === data.answer ? 'animate-bouncey bg-emerald-500' : ''
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {feedback === 'right' && (
        <div className="mt-4 flex justify-center">
          <Mascot mood="cheer" message="Riktig! 🎉" size="text-5xl" />
        </div>
      )}
    </div>
  )
}

// ----- Spill 2: Dra formene i riktig rekkefølge (minst → størst) -----
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
]

function SortGame({ onWin }) {
  const [round, setRound] = useState(0)
  const [items, setItems] = useState(() => shuffle(SIZE_SETS[0]))
  const [solved, setSolved] = useState(false)
  const dragIndex = useRef(null)
  const rowRef = useRef(null)

  function loadRound(r) {
    const set = SIZE_SETS[r % SIZE_SETS.length]
    let arr = shuffle(set)
    // Sørg for at den ikke allerede er riktig sortert.
    if (arr.every((it, i) => i === 0 || arr[i - 1].size < it.size)) arr = shuffle(set)
    setItems(arr)
    setSolved(false)
  }

  function checkSolved(arr) {
    const ok = arr.every((it, i) => i === 0 || arr[i - 1].size < it.size)
    if (ok) {
      setSolved(true)
      sound.correct()
      setTimeout(() => {
        if (round + 1 >= 3) {
          onWin()
        } else {
          setRound((r) => r + 1)
          loadRound(round + 1)
        }
      }, 1300)
    }
  }

  function onPointerDown(i) {
    if (solved) return
    dragIndex.current = i
    sound.click()
  }

  function onPointerMove(e) {
    if (dragIndex.current === null || solved) return
    const children = [...rowRef.current.children]
    const x = e.clientX
    let overIndex = null
    children.forEach((child, i) => {
      const rect = child.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right) overIndex = i
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
    if (dragIndex.current !== null) {
      dragIndex.current = null
      checkSolved(items)
    }
  }

  return (
    <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
      <p className="text-center text-xl md:text-2xl font-bold text-slate-600 mb-1">
        Dra fra minst til størst! ({round + 1}/3)
      </p>
      <p className="text-center text-base text-slate-400 mb-4">👈 liten ... stor 👉</p>
      <div
        ref={rowRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="flex items-center justify-center gap-2 md:gap-4 min-h-[140px] touch-none flex-wrap"
      >
        {items.map((it, i) => (
          <button
            key={it.id}
            onPointerDown={() => onPointerDown(i)}
            className={`${it.scale} ${
              solved ? 'animate-bouncey' : 'active:scale-110'
            } cursor-grab bg-amber-100 rounded-2xl p-2 shadow transition-transform`}
            style={{ touchAction: 'none' }}
          >
            {it.emoji}
          </button>
        ))}
      </div>
      {solved && (
        <div className="mt-4 flex justify-center">
          <Mascot mood="cheer" message="Perfekt sortert! 🎉" size="text-5xl" />
        </div>
      )}
    </div>
  )
}

export default function Patterns({ go }) {
  const { addStars } = useStars()
  const [game, setGame] = useState(null) // null | 'pattern' | 'sort'
  const [confetti, setConfetti] = useState(false)
  const [won, setWon] = useState(false)

  function win() {
    setWon(true)
    setConfetti(true)
    sound.fanfare()
    addStars(2)
    setTimeout(() => setConfetti(false), 2500)
  }

  if (won) {
    return (
      <div className="animate-pop-in">
        <Confetti show={confetti} />
        <TopBar title="Bra jobba! 🎉" onHome={() => go('home')} />
        <div className="bg-white/90 rounded-3xl p-6 text-center shadow-xl mt-4">
          <Mascot mood="cheer" message="Du klarte alle! Du fikk 2 ⭐" />
          <div className="text-7xl my-4">🏆</div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BigButton
              color="bg-orange-500"
              onClick={() => {
                setWon(false)
                setGame(null)
              }}
            >
              🎮 Spill mer
            </BigButton>
            <BigButton color="bg-sky-500" onClick={() => go('home')}>
              🏠 Hjem
            </BigButton>
          </div>
        </div>
      </div>
    )
  }

  if (game === 'pattern') {
    return (
      <div className="animate-pop-in">
        <TopBar title="Mønster 🔺" onHome={() => go('home')} />
        <PatternGame onWin={win} />
      </div>
    )
  }
  if (game === 'sort') {
    return (
      <div className="animate-pop-in">
        <TopBar title="Sortering 🔢" onHome={() => go('home')} />
        <SortGame onWin={win} />
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
          className="kid-btn bg-orange-500 text-white p-6 flex items-center gap-4 hover:scale-[1.02]"
        >
          <span className="text-6xl">🔴🔵🔴</span>
          <span className="text-left">
            <span className="block text-3xl font-extrabold">Hva kommer neste?</span>
            <span className="block text-lg opacity-95">Fullfør mønsteret</span>
          </span>
        </button>
        <button
          onClick={() => {
            sound.click()
            setGame('sort')
          }}
          className="kid-btn bg-rose-500 text-white p-6 flex items-center gap-4 hover:scale-[1.02]"
        >
          <span className="text-5xl">🔵 ⭐ 🐘</span>
          <span className="text-left">
            <span className="block text-3xl font-extrabold">Sortér etter størrelse</span>
            <span className="block text-lg opacity-95">Dra fra minst til størst</span>
          </span>
        </button>
      </div>
    </div>
  )
}

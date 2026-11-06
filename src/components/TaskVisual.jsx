import { NumberLine } from './ui.jsx'
import AnalogClock from './AnalogClock.jsx'
import VerdensKart from './VerdensKart.jsx'
import Flagg from './Flagg.jsx'

// Tegner det visuelle i en oppgave (visual) og hjelpen bak Hjelp-knappen (hjelp).
// Alle «kind»-verdiene lages av generatorene i src/lib/matte/.

function Mengde({ emoji, n, className = '' }) {
  return (
    <div className={`flex flex-wrap justify-center gap-1 text-3xl md:text-4xl max-w-md mx-auto ${className}`}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i}>{emoji}</span>
      ))}
    </div>
  )
}

function Terning({ n }) {
  const dots = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] }[n] || []
  return (
    <div className="mx-auto w-28 h-28 md:w-32 md:h-32 bg-white rounded-2xl shadow-lg border-4 border-slate-200 grid grid-cols-3 grid-rows-3 p-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">{dots.includes(i) && <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-700" />}</div>
      ))}
    </div>
  )
}

function Rekke({ items }) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 text-3xl md:text-4xl font-extrabold text-slate-700">
      {items.map((it, i) => (
        <span key={i} className={`rounded-2xl px-4 py-2 ${it === '?' ? 'bg-amber-100 text-amber-500 border-4 border-dashed border-amber-300' : 'bg-slate-100'}`}>
          {it}
        </span>
      ))}
    </div>
  )
}

// Tallinje med pil på et tall (brukes i visual) – pila viser oppgavens tall, ikke fasit på noe annet.
function TallinjePil({ from, to, step, marker }) {
  const n = to - from
  const pct = ((marker - from) / n) * 100
  const ticks = []
  for (let v = from; v <= to; v += step) ticks.push(v)
  return (
    <div className="relative mx-4 mt-6 mb-2 h-16">
      <div className="absolute left-0 right-0 top-8 h-1 bg-slate-500 rounded" />
      {ticks.map((v) => {
        const p = ((v - from) / n) * 100
        const big = step === 1 ? v % 5 === 0 : true
        return (
          <div key={v} className="absolute" style={{ left: `${p}%`, top: big ? '1.5rem' : '1.75rem' }}>
            <div className={`-translate-x-1/2 bg-slate-600 ${big ? 'w-1 h-4' : 'w-0.5 h-2'}`} />
            {big && <div className="-translate-x-1/2 text-xs md:text-sm font-bold text-slate-600 text-center w-8 mt-1">{v}</div>}
          </div>
        )
      })}
      <div className="absolute -translate-x-1/2 text-3xl animate-bouncey" style={{ left: `${pct}%`, top: '-0.25rem' }}>
        🔻
      </div>
    </div>
  )
}

function Rutenett({ rader, kolonner }) {
  return (
    <div className="inline-grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${kolonner}, minmax(0, 1fr))` }}>
      {Array.from({ length: rader * kolonner }).map((_, i) => (
        <span key={i} className="w-6 h-6 md:w-8 md:h-8 rounded bg-sky-400" />
      ))}
    </div>
  )
}

function Grupper({ grupper, per, emoji }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {Array.from({ length: grupper }).map((_, g) => (
        <div key={g} className="bg-slate-100 rounded-2xl p-2 flex flex-wrap gap-1 max-w-[7rem] justify-center text-2xl">
          {Array.from({ length: per }).map((_, i) => (
            <span key={i}>{emoji}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

// Tierblokker: tiere som stenger, enere som prikker.
function Tiere({ a, b, op }) {
  const Tall = ({ n }) => (
    <div className="flex items-end gap-1 flex-wrap justify-center">
      {Array.from({ length: Math.floor(n / 10) }).map((_, i) => (
        <span key={`t${i}`} className="w-3 h-12 bg-sky-500 rounded" title="10" />
      ))}
      {Array.from({ length: n % 10 }).map((_, i) => (
        <span key={`e${i}`} className="w-3 h-3 bg-amber-400 rounded-full" title="1" />
      ))}
    </div>
  )
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      <Tall n={a} />
      <span className="text-3xl font-extrabold text-slate-500">{op === 'add' ? '+' : '−'}</span>
      <Tall n={b} />
      <p className="w-full text-center text-sm text-slate-400 font-bold">blå stang = 10, gul prikk = 1</p>
    </div>
  )
}

function Tiervenner({ a }) {
  return (
    <div className="grid grid-cols-5 gap-1 w-max mx-auto">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 ${i < a ? 'bg-sky-500 border-sky-600' : 'bg-white border-slate-300'}`} />
      ))}
    </div>
  )
}

function Brok({ deler, farget }) {
  return (
    <div className="flex gap-1 mx-auto w-max">
      {Array.from({ length: deler }).map((_, i) => (
        <span key={i} className={`w-8 h-16 md:w-10 md:h-20 border-2 border-slate-500 ${i < farget ? 'bg-fuchsia-400' : 'bg-white'}`} />
      ))}
    </div>
  )
}

function BrokPar({ x, y }) {
  const [xa, xb] = x.split('/').map(Number)
  const [ya, yb] = y.split('/').map(Number)
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="font-extrabold text-slate-600 w-10">{x}</span>
        <Brok deler={xb} farget={xa} />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-extrabold text-slate-600 w-10">{y}</span>
        <Brok deler={yb} farget={ya} />
      </div>
    </div>
  )
}

function Termometer({ temp }) {
  const min = -15
  const max = 15
  const pct = ((temp - min) / (max - min)) * 100
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="relative w-6 h-48 bg-slate-100 rounded-full border-2 border-slate-300 overflow-hidden">
        <div className={`absolute bottom-0 left-0 right-0 ${temp < 0 ? 'bg-sky-400' : 'bg-rose-400'}`} style={{ height: `${pct}%` }} />
        <div className="absolute left-0 right-0 border-t-2 border-slate-500" style={{ bottom: `${((0 - min) / (max - min)) * 100}%` }} />
      </div>
      <div className="text-left text-sm font-bold text-slate-500">
        <div>15°</div>
        <div className="mt-14">0°</div>
        <div className="mt-14">−15°</div>
      </div>
      <div className="text-3xl font-extrabold text-slate-700">{temp}°</div>
    </div>
  )
}

function Koordinater({ points, size }) {
  const cell = 32
  const w = (size + 1) * cell
  return (
    <svg viewBox={`-28 -10 ${w + 40} ${w + 36}`} className="w-72 h-72 md:w-80 md:h-80 mx-auto">
      {Array.from({ length: size + 1 }).map((_, i) => (
        <g key={i}>
          <line x1={i * cell} y1={0} x2={i * cell} y2={size * cell} stroke="#cbd5e1" strokeWidth="1" />
          <line x1={0} y1={i * cell} x2={size * cell} y2={i * cell} stroke="#cbd5e1" strokeWidth="1" />
          <text x={i * cell} y={size * cell + 18} textAnchor="middle" fontSize="12" fontWeight="700" fill="#475569">
            {i}
          </text>
          <text x={-10} y={size * cell - i * cell + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#475569">
            {i}
          </text>
        </g>
      ))}
      <line x1={0} y1={size * cell} x2={size * cell} y2={size * cell} stroke="#334155" strokeWidth="2" />
      <line x1={0} y1={0} x2={0} y2={size * cell} stroke="#334155" strokeWidth="2" />
      {points.map((p) => (
        <g key={p.label}>
          <circle cx={p.x * cell} cy={size * cell - p.y * cell} r="7" fill="#ec4899" />
          <text x={p.x * cell + 10} y={size * cell - p.y * cell - 8} fontSize="14" fontWeight="800" fill="#334155">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

function Rektangel({ l, b }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm font-bold text-slate-500">{l}</span>
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold text-slate-500">{b}</span>
        <div className="grid gap-px bg-slate-400 p-px" style={{ gridTemplateColumns: `repeat(${l}, 1.25rem)` }}>
          {Array.from({ length: l * b }).map((_, i) => (
            <span key={i} className="w-5 h-5 bg-amber-200" />
          ))}
        </div>
      </div>
    </div>
  )
}

function Grid({ grid, cols, boxes = false }) {
  return (
    <div className={`inline-grid gap-1 mx-auto ${boxes ? 'p-1 bg-slate-500 rounded-lg' : ''}`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {grid.map((v, i) => {
        const r = Math.floor(i / cols)
        const c = i % cols
        const thickR = boxes && r === 1
        const thickC = boxes && c === 1
        return (
          <span
            key={i}
            className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg text-2xl md:text-3xl font-extrabold ${
              v === '?' ? 'bg-amber-200 text-amber-600 border-4 border-dashed border-amber-400' : v === '·' ? 'bg-slate-100 text-slate-300' : 'bg-white text-slate-700'
            } ${thickR ? 'mb-1' : ''} ${thickC ? 'mr-1' : ''}`}
          >
            {v === '·' ? '' : v}
          </span>
        )
      })}
    </div>
  )
}

export function Visual({ visual }) {
  if (!visual) return null
  switch (visual.kind) {
    case 'fingre': {
      const n = visual.n
      const en = ['', '☝️', '✌️', '🤟', '🖖', '🖐️']
      const hender = n <= 5 ? [en[n]] : ['🖐️', en[n - 5]]
      return <div className="text-center text-7xl md:text-8xl tracking-widest">{hender.join(' ')}</div>
    }
    case 'flagg':
      return (
        <div className="text-center">
          <Flagg kode={visual.kode} navn={visual.navn} className="w-40 md:w-56 mx-auto" />
        </div>
      )
    case 'klokke':
      return <AnalogClock hour={visual.h} minute={visual.m} interactive={false} className="w-56 h-56 md:w-72 md:h-72" />
    case 'digital':
      return (
        <div className="text-center">
          <span className="inline-block bg-slate-800 text-emerald-300 rounded-2xl px-8 py-3 text-5xl md:text-6xl font-extrabold tabular-nums tracking-widest shadow-inner">{visual.tekst}</span>
        </div>
      )
    case 'kart':
      return <VerdensKart region={visual.region} highlight={visual.highlight} disabled />
    case 'kvadrat':
      return (
        <div className="text-center">
          <Grid grid={visual.grid} cols={3} />
        </div>
      )
    case 'sudoku':
      return (
        <div className="text-center">
          <Grid grid={visual.grid} cols={4} boxes />
        </div>
      )
    case 'mengde':
      return <Mengde emoji={visual.emoji} n={visual.n} />
    case 'mengder':
      return (
        <div className="flex items-stretch justify-center gap-3">
          {visual.groups.map((g, i) => (
            <div key={i} className="flex-1 max-w-[45%] bg-slate-50 rounded-2xl p-3 flex flex-wrap justify-center gap-1 text-3xl md:text-4xl content-start">
              {Array.from({ length: g.n }).map((_, k) => (
                <span key={k}>{g.emoji}</span>
              ))}
            </div>
          ))}
        </div>
      )
    case 'terning':
      return <Terning n={visual.n} />
    case 'rekke':
      return <Rekke items={visual.items} />
    case 'stor':
      return <p className="text-center text-5xl md:text-6xl font-extrabold text-slate-700 tracking-wide">{visual.text}</p>
    case 'deling':
      return (
        <div className="flex items-center justify-center gap-3 text-3xl md:text-4xl">
          <span className="bg-sky-100 rounded-2xl px-3 py-2">{visual.emoji.repeat(visual.a) || '·'}</span>
          <span className="font-extrabold text-slate-400">+</span>
          <span className="bg-amber-100 rounded-2xl px-3 py-2 min-w-[3rem] text-center text-amber-500 font-extrabold">?</span>
        </div>
      )
    case 'ikon':
      return (
        <div className="text-center">
          <div className="text-6xl md:text-7xl">{visual.emoji}</div>
          {visual.tekst && <div className="text-2xl md:text-3xl font-extrabold text-slate-500 tracking-widest mt-1">{visual.tekst}</div>}
        </div>
      )
    case 'bokstav':
      return <div className="text-center text-8xl md:text-9xl font-extrabold text-slate-700">{visual.tekst}</div>
    case 'ordkort':
      return (
        <div className="text-center">
          <span className="inline-block bg-amber-50 border-4 border-amber-200 rounded-3xl px-8 py-4 text-5xl md:text-6xl font-extrabold text-slate-700 tracking-wider">{visual.tekst}</span>
        </div>
      )
    case 'lyder':
      return (
        <div className="flex justify-center gap-3">
          {visual.bokstaver.map((b, i) => (
            <span key={i} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-sky-100 border-4 border-sky-300 flex items-center justify-center text-4xl md:text-5xl font-extrabold text-slate-700">
              {b}
            </span>
          ))}
        </div>
      )
    case 'tekst':
      return (
        <div className="bg-amber-50 rounded-2xl p-4 md:p-5 max-w-2xl mx-auto text-left">
          {visual.tittel && <h3 className="text-xl md:text-2xl font-extrabold text-slate-700 mb-2">{visual.tittel}</h3>}
          <p className="text-lg md:text-xl leading-relaxed font-semibold text-slate-700">{visual.tekst}</p>
        </div>
      )
    case 'tallinje':
      return <TallinjePil from={visual.from} to={visual.to} step={visual.step} marker={visual.marker} />
    case 'rutenett':
      return (
        <div className="text-center">
          <Rutenett rader={visual.rader} kolonner={visual.kolonner} />
        </div>
      )
    case 'grupper':
      return <Grupper grupper={visual.grupper} per={visual.per} emoji={visual.emoji} />
    case 'termometer':
      return <Termometer temp={visual.temp} />
    case 'brok':
      return <Brok deler={visual.deler} farget={visual.farget} />
    case 'brokpar':
      return <BrokPar x={visual.x} y={visual.y} />
    case 'koordinater':
      return <Koordinater points={visual.points} size={visual.size} />
    case 'rektangel':
      return <Rektangel l={visual.l} b={visual.b} />
    default:
      return null
  }
}

// Hjelpen bak Hjelp-knappen. Viser aldri fasit.
export function Help({ hjelp }) {
  if (!hjelp) return null
  switch (hjelp.kind) {
    case 'pluss':
      return (
        <div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-3xl md:text-4xl">
            <Mengde emoji={hjelp.emoji} n={hjelp.a} className="max-w-[40%]" />
            <span className="font-extrabold text-slate-500">+</span>
            <Mengde emoji={hjelp.emoji} n={hjelp.b} className="max-w-[40%]" />
          </div>
          {hjelp.a + hjelp.b <= 20 && <NumberLine from={0} to={20} start={hjelp.a} />}
        </div>
      )
    case 'minus':
      return (
        <div>
          <div className="flex flex-wrap items-center justify-center gap-1 text-3xl md:text-4xl">
            {Array.from({ length: hjelp.a }).map((_, i) => (
              <span key={i} className={i >= hjelp.a - hjelp.b ? 'opacity-25 line-through' : ''}>
                {hjelp.emoji}
              </span>
            ))}
          </div>
          {hjelp.a <= 20 && <NumberLine from={0} to={20} start={hjelp.a} />}
        </div>
      )
    case 'tallinje':
      return <NumberLine from={hjelp.from} to={hjelp.to} start={hjelp.start} />
    case 'tiere':
      return <Tiere a={hjelp.a} b={hjelp.b} op={hjelp.op} />
    case 'tiervenner':
      return (
        <div>
          <Tiervenner a={hjelp.a} />
          <p className="text-center text-sm text-slate-400 font-bold mt-2">Hvor mange tomme ruter er det?</p>
        </div>
      )
    case 'rutenett':
      return (
        <div className="text-center">
          <Rutenett rader={hjelp.rader} kolonner={hjelp.kolonner} />
          <p className="text-sm text-slate-400 font-bold mt-2">{hjelp.rader} rader med {hjelp.kolonner} i hver</p>
        </div>
      )
    default:
      return null
  }
}

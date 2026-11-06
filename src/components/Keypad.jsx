import { useEffect } from 'react'
import { sound } from '../sound.js'

// Talltastatur på skjermen som også tar imot vanlig tastatur.
// value er en tekststreng («-12», «3,5»). onSubmit kalles ved ✓ eller Enter.
export default function Keypad({ value, onChange, onSubmit, allowNegative = false, allowDecimal = false, disabled = false, unit = '' }) {
  function press(k) {
    if (disabled) return
    sound.click()
    if (k === 'slett') return onChange(value.slice(0, -1))
    if (k === 'ok') return value !== '' && value !== '-' && onSubmit()
    if (k === '-') {
      if (!allowNegative) return
      return onChange(value.startsWith('-') ? value.slice(1) : '-' + value)
    }
    if (k === ',') {
      if (!allowDecimal || value.includes(',')) return
      return onChange((value === '' || value === '-' ? value + '0' : value) + ',')
    }
    if (value.replace('-', '').length >= 6) return
    onChange(value + k)
  }

  useEffect(() => {
    if (disabled) return
    function onKey(e) {
      if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
      if (/^[0-9]$/.test(e.key)) press(e.key)
      else if (e.key === 'Backspace') press('slett')
      else if (e.key === 'Enter') press('ok')
      else if (e.key === '-' && allowNegative) press('-')
      else if ((e.key === ',' || e.key === '.') && allowDecimal) press(',')
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, disabled, allowNegative, allowDecimal])

  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3']
  const Btn = ({ k, label, color = 'bg-indigo-500', className = '' }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => press(k)}
      className={`kid-btn ${color} text-white text-3xl md:text-4xl py-3 md:py-4 disabled:opacity-50 ${className}`}
      aria-label={label || k}
    >
      {label || k}
    </button>
  )

  return (
    <div className="max-w-xs mx-auto">
      <div className="bg-slate-100 rounded-2xl px-4 py-3 mb-3 text-center min-h-[4rem] flex items-center justify-center gap-2">
        <span className={`text-4xl md:text-5xl font-extrabold ${value ? 'text-slate-700' : 'text-slate-300'}`}>{value || '?'}</span>
        {unit && value && <span className="text-2xl font-bold text-slate-400">{unit}</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((k) => (
          <Btn key={k} k={k} />
        ))}
        {allowNegative ? <Btn k="-" label="−" color="bg-slate-400" /> : allowDecimal ? <Btn k="," label="," color="bg-slate-400" /> : <Btn k="slett" label="⌫" color="bg-slate-400" />}
        <Btn k="0" />
        {allowNegative || allowDecimal ? <Btn k="slett" label="⌫" color="bg-slate-400" /> : <Btn k="ok" label="✓" color="bg-emerald-500" />}
        {allowNegative && allowDecimal && <Btn k="," label="," color="bg-slate-400" />}
        {(allowNegative || allowDecimal) && <Btn k="ok" label="✓" color="bg-emerald-500" className={allowNegative && allowDecimal ? 'col-span-2' : 'col-span-3'} />}
      </div>
    </div>
  )
}

// Gjør tekst fra tastaturet om til tall (norsk komma).
export function parseAnswer(text) {
  if (text == null) return null
  const t = String(text).trim().replace(',', '.')
  if (t === '' || t === '-' || t === '.') return null
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}

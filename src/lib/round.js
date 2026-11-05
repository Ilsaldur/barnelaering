// Lag en runde med oppgaver uten gjentakelser.

export const ROUND_LENGTH = 8

// Trekk `n` oppgaver fra `gen()` der ingen har samme nøkkel. Gir opp etter
// `maxTries` forsøk og fyller da på med det som finnes (små oppgavemengder).
export function uniqueRound(gen, n = ROUND_LENGTH, { keyOf = (x) => JSON.stringify(x), maxTries = 400 } = {}) {
  const out = []
  const seen = new Set()
  let tries = 0
  while (out.length < n && tries < maxTries) {
    tries++
    const item = gen()
    const key = keyOf(item)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  while (out.length < n) out.push(gen())
  return out
}

// Trekk `n` ulike elementer fra en fast liste (bank). Er lista kortere enn
// `n`, brukes hele lista én gang og så fylles det på uten to like etter hverandre.
export function drawFromBank(bank, n = ROUND_LENGTH, shuffleFn) {
  if (!bank.length) return []
  const out = [...shuffleFn(bank)].slice(0, n)
  while (out.length < n) {
    let pool = shuffleFn(bank)
    if (pool[0] === out[out.length - 1] && pool.length > 1) pool = [...pool.slice(1), pool[0]]
    for (const it of pool) {
      if (out.length >= n) break
      out.push(it)
    }
  }
  return out
}

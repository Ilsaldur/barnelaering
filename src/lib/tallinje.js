// Tallinja i hjelpen og i «Lær først»-kortene: hvor den skal rulles når den
// åpnes, og hvilke tall som er synlige. Rene funksjoner, så de kan testes.

export const CELLE_PX = 36 // bredden på en rute (w-9) på mobil
export const GAP_PX = 4 // mellomrom (gap-1)
export const KANT_PX = 8 // px-2 i rulleområdet

// Rull slik at starttallet står til venstre i det synlige feltet.
export function rullTil(start, from = 0, { celle = CELLE_PX, gap = GAP_PX, kant = KANT_PX } = {}) {
  if (start == null || start <= from) return 0
  return Math.max(0, (start - from) * (celle + gap))
}

// Hvilke tall som er synlige ved en gitt rulleposisjon og bredde.
export function synligeTall(scrollLeft, bredde, from = 0, to = 20, { celle = CELLE_PX, gap = GAP_PX, kant = KANT_PX } = {}) {
  const ut = []
  for (let n = from; n <= to; n++) {
    const venstre = kant + (n - from) * (celle + gap) - scrollLeft
    const hoyre = venstre + celle
    if (venstre >= 0 && hoyre <= bredde) ut.push(n)
  }
  return ut
}

// Omtrent hvor bredt rullefeltet er på en skjerm med gitt bredde: sidemarg
// (p-3), oppgavekortet (p-4) og hjelpeboksen (p-3) på hver side.
export function rullefeltBredde(skjermBredde) {
  return skjermBredde - 2 * (12 + 16 + 12)
}

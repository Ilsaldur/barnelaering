// Tilfeldighet samlet på ett sted, så generatorer kan testes med fast frø.
// `rng` er alltid en funksjon som gir et tall i [0, 1).

export function randInt(min, max, rng = Math.random) {
  return Math.floor(rng() * (max - min + 1)) + min
}

export function pick(arr, rng = Math.random) {
  return arr[randInt(0, arr.length - 1, rng)]
}

// Fisher–Yates: jevn blanding (sort(() => Math.random() - 0.5) er ikke jevn).
export function shuffle(arr, rng = Math.random) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Deterministisk generator (mulberry32) til tester.
export function seeded(seed = 1) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

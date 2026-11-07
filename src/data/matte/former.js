// UTKAST – former, farger, mønster og størrelse i matte nivå 1–4 (runde 5,
// etappe U). Erstatter de gamle temaene «Former og mønster» og «Farger».

export const FARGER = [
  { navn: 'Rød', emoji: '🟥' },
  { navn: 'Blå', emoji: '🟦' },
  { navn: 'Grønn', emoji: '🟩' },
  { navn: 'Gul', emoji: '🟨' },
  { navn: 'Oransje', emoji: '🟧' },
  { navn: 'Lilla', emoji: '🟪' },
  { navn: 'Svart', emoji: '⬛' },
  { navn: 'Brun', emoji: '🟫' },
  { navn: 'Hvit', emoji: '⬜' },
  { navn: 'Rosa', emoji: '💗' },
]

export const FORMER = [
  { navn: 'Sirkel', flertall: 'sirkler', emoji: '⚫' },
  { navn: 'Trekant', flertall: 'trekanter', emoji: '🔺' },
  { navn: 'Firkant', flertall: 'firkanter', emoji: '🟦' },
  { navn: 'Stjerne', flertall: 'stjerner', emoji: '⭐' },
  { navn: 'Hjerte', flertall: 'hjerter', emoji: '❤️' },
  { navn: 'Rombe', flertall: 'romber', emoji: '🔶' },
  { navn: 'Halvmåne', flertall: 'halvmåner', emoji: '🌙' },
  { navn: 'Oval', flertall: 'ovaler', emoji: '🥚' },
]

// Figurer til mønstre: sett med to eller tre som er lette å skille.
export const MONSTER_SETT = [
  ['🔴', '🔵'],
  ['🟥', '🟨'],
  ['⭐', '🌙'],
  ['🐱', '🐶'],
  ['🍎', '🍌'],
  ['🔴', '🔵', '🟢'],
  ['⭐', '🌙', '☀️'],
  ['🍎', '🍌', '🍇'],
  ['🔺', '🟦', '⚫'],
]
export const MONSTER_EKSTRA = ['🟣', '🟠', '🐸', '🍓', '💜', '⬛']

// Ting fra minst til størst. Samme figur i ulik størrelse, eller ting barn vet
// hvor store er.
export const STORRELSE_SETT = [
  [
    { id: 'a', label: '🔵', scale: 'text-3xl' },
    { id: 'b', label: '🔵', scale: 'text-5xl' },
    { id: 'c', label: '🔵', scale: 'text-7xl' },
  ],
  [
    { id: 'a', label: '⭐', scale: 'text-3xl' },
    { id: 'b', label: '⭐', scale: 'text-5xl' },
    { id: 'c', label: '⭐', scale: 'text-6xl' },
    { id: 'd', label: '⭐', scale: 'text-8xl' },
  ],
  [
    { id: 'a', label: '🐭', scale: 'text-4xl' },
    { id: 'b', label: '🐑', scale: 'text-5xl' },
    { id: 'c', label: '🐶', scale: 'text-6xl' },
    { id: 'd', label: '🐘', scale: 'text-7xl' },
  ],
  [
    { id: 'a', label: '🍒', scale: 'text-3xl' },
    { id: 'b', label: '🍎', scale: 'text-5xl' },
    { id: 'c', label: '🍉', scale: 'text-7xl' },
  ],
  [
    { id: 'a', label: '❤️', scale: 'text-3xl' },
    { id: 'b', label: '❤️', scale: 'text-5xl' },
    { id: 'c', label: '❤️', scale: 'text-7xl' },
  ],
  [
    { id: 'a', label: '🐜', scale: 'text-3xl' },
    { id: 'b', label: '🐱', scale: 'text-5xl' },
    { id: 'c', label: '🐴', scale: 'text-6xl' },
    { id: 'd', label: '🐘', scale: 'text-8xl' },
  ],
]

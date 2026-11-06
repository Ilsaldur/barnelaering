// Lesbare navn på fag og oppgavetyper (til voksensiden).
// Oppgavetypene fylles på etter hvert som stigene kommer til.

export const FAG_LABELS = {
  matte: { navn: 'Matte', emoji: '🔢' },
  lesing: { navn: 'Lesing', emoji: '📖' },
  klokke: { navn: 'Klokka', emoji: '🕐' },
  geografi: { navn: 'Geografi', emoji: '🌍' },
  engelsk: { navn: 'Engelsk', emoji: '🇬🇧' },
  nott: { navn: 'Tenkenøtt', emoji: '🌰' },
}

export const TYPE_LABELS = {}

export function registerTypeLabels(map) {
  Object.assign(TYPE_LABELS, map)
}

export function typeLabel(type) {
  if (TYPE_LABELS[type]) return TYPE_LABELS[type]
  return String(type || '')
    .replace(/[_:]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}

export function fagLabel(fag) {
  return FAG_LABELS[fag]?.navn || fag
}

// Læreplan: barnehage + 1.–4. klasse (norsk barneskole).
// Hver "level" har en liste aktiviteter. Hver aktivitet peker på en motor
// (engine) i src/activities/engines.js, med en `config` som tilpasser innholdet.
//
// Motorer:
//  - 'quiz'      generisk flervalgsquiz (config.bank eller config.options per spørsmål)
//  - 'math'      regnestykker (config: ops, max, mulMax, mulFactors, divMax)
//  - 'clock'     analog klokke (config: minutes = 'whole'|'half'|'quarter'|'five')
//  - 'words'     ord og bilder (config: maxLen for å begrense til korte ord)
//  - 'patterns'  mønster og sortering
//  - 'geography' land og flagg (config: region = 'norden'|'europa'|'verden')

// ---- Gjenbrukbare quiz-banker ----------------------------------------------

const COUNTING_TO_5 = {
  title: 'Tell tingene',
  emoji: '🍎',
  color: 'bg-rose-500',
  prompt: 'Hvor mange er det?',
  rounds: 6,
  bank: [
    { show: '🍎', count: 1, answer: '1' },
    { show: '🎈', count: 2, answer: '2' },
    { show: '⭐', count: 3, answer: '3' },
    { show: '🌸', count: 4, answer: '4' },
    { show: '🍓', count: 5, answer: '5' },
    { show: '🐠', count: 2, answer: '2' },
    { show: '🐝', count: 4, answer: '4' },
    { show: '🚗', count: 3, answer: '3' },
    { show: '🐶', count: 5, answer: '5' },
    { show: '🌳', count: 1, answer: '1' },
  ],
}

const COUNTING_TO_10 = {
  title: 'Tell til 10',
  emoji: '🔟',
  color: 'bg-rose-500',
  prompt: 'Hvor mange er det?',
  rounds: 7,
  bank: [
    { show: '🍎', count: 4, answer: '4' },
    { show: '🎈', count: 6, answer: '6' },
    { show: '⭐', count: 7, answer: '7' },
    { show: '🌸', count: 5, answer: '5' },
    { show: '🍓', count: 8, answer: '8' },
    { show: '🐠', count: 9, answer: '9' },
    { show: '🐝', count: 10, answer: '10' },
    { show: '🚗', count: 3, answer: '3' },
    { show: '🐶', count: 6, answer: '6' },
  ],
}

const COLORS = {
  title: 'Farger',
  emoji: '🎨',
  color: 'bg-fuchsia-500',
  prompt: 'Hvilken farge er dette?',
  rounds: 6,
  bank: [
    { show: '🟥', answer: 'Rød' },
    { show: '🟦', answer: 'Blå' },
    { show: '🟩', answer: 'Grønn' },
    { show: '🟨', answer: 'Gul' },
    { show: '🟧', answer: 'Oransje' },
    { show: '🟪', answer: 'Lilla' },
    { show: '⬛', answer: 'Svart' },
    { show: '🟫', answer: 'Brun' },
  ],
}

const SHAPES = {
  title: 'Former',
  emoji: '🔷',
  color: 'bg-amber-500',
  prompt: 'Hvilken form er dette?',
  rounds: 6,
  bank: [
    { show: '⚫', answer: 'Sirkel' },
    { show: '🔺', answer: 'Trekant' },
    { show: '🟦', answer: 'Firkant' },
    { show: '⭐', answer: 'Stjerne' },
    { show: '❤️', answer: 'Hjerte' },
    { show: '🔶', answer: 'Rombe' },
  ],
}

const FIRST_LETTER = {
  title: 'Første bokstav',
  emoji: '🔤',
  color: 'bg-emerald-500',
  prompt: 'Hvilken bokstav begynner ordet på?',
  rounds: 6,
  bank: [
    { show: '🐶', caption: 'HUND', answer: 'H' },
    { show: '🐱', caption: 'KATT', answer: 'K' },
    { show: '🌞', caption: 'SOL', answer: 'S' },
    { show: '🍎', caption: 'EPLE', answer: 'E' },
    { show: '🐟', caption: 'FISK', answer: 'F' },
    { show: '🌳', caption: 'TRE', answer: 'T' },
    { show: '🐮', caption: 'KU', answer: 'K' },
    { show: '🌙', caption: 'MÅNE', answer: 'M' },
    { show: '🐝', caption: 'BIE', answer: 'B' },
    { show: '🚗', caption: 'BIL', answer: 'B' },
  ],
}

const LETTER_SOUNDS = {
  title: 'Bokstaver og lyder',
  emoji: '🅰️',
  color: 'bg-emerald-500',
  prompt: 'Hvilket ord begynner med denne bokstaven?',
  rounds: 6,
  bank: [
    { show: 'S', options: ['SOL', 'MÅNE', 'TRE', 'BIL'], answer: 'SOL' },
    { show: 'H', options: ['HUND', 'KATT', 'FISK', 'EPLE'], answer: 'HUND' },
    { show: 'F', options: ['FISK', 'HUS', 'BALL', 'SOL'], answer: 'FISK' },
    { show: 'B', options: ['BIL', 'TRE', 'KU', 'EPLE'], answer: 'BIL' },
    { show: 'M', options: ['MÅNE', 'SOL', 'HUND', 'BALL'], answer: 'MÅNE' },
    { show: 'K', options: ['KATT', 'FISK', 'TRE', 'HUS'], answer: 'KATT' },
    { show: 'E', options: ['EPLE', 'BIL', 'SOL', 'KU'], answer: 'EPLE' },
    { show: 'T', options: ['TRE', 'HUND', 'MÅNE', 'BALL'], answer: 'TRE' },
  ],
}

const OPPOSITES = {
  title: 'Motsatt',
  emoji: '↔️',
  color: 'bg-cyan-500',
  prompt: 'Hva er det motsatte?',
  rounds: 6,
  bank: [
    { show: '☀️', caption: 'DAG', options: ['Natt', 'Sommer', 'Varm', 'Stor'], answer: 'Natt' },
    { show: '🔥', caption: 'VARM', options: ['Kald', 'Våt', 'Liten', 'Mørk'], answer: 'Kald' },
    { show: '⬆️', caption: 'OPP', options: ['Ned', 'Ut', 'Inn', 'Stor'], answer: 'Ned' },
    { show: '🐘', caption: 'STOR', options: ['Liten', 'Tung', 'Rask', 'Glad'], answer: 'Liten' },
    { show: '😀', caption: 'GLAD', options: ['Lei seg', 'Sint', 'Trøtt', 'Sulten'], answer: 'Lei seg' },
    { show: '🚀', caption: 'RASK', options: ['Sakte', 'Høy', 'Lett', 'Ny'], answer: 'Sakte' },
    { show: '🌳', caption: 'HØY', options: ['Lav', 'Bred', 'Tung', 'Kald'], answer: 'Lav' },
  ],
}

const FRACTIONS = {
  title: 'Brøk og halvparten',
  emoji: '🍕',
  color: 'bg-orange-500',
  prompt: 'Tenk litt!',
  rounds: 6,
  bank: [
    { prompt: 'Hva er halvparten av 10?', options: ['5', '2', '20', '8'], answer: '5' },
    { prompt: 'Hva er halvparten av 8?', options: ['4', '2', '6', '16'], answer: '4' },
    { prompt: 'Hvor mange halve trenger du for én hel?', options: ['2', '3', '4', '1'], answer: '2' },
    { prompt: 'Hvor mange fjerdedeler er én hel?', options: ['4', '2', '3', '8'], answer: '4' },
    { prompt: '½ av en pizza med 6 stykker er …', options: ['3', '2', '6', '4'], answer: '3' },
    { prompt: 'Hva er dobbelt av 6?', options: ['12', '8', '3', '10'], answer: '12' },
    { prompt: 'Hva er ¼ av 12?', options: ['3', '4', '6', '2'], answer: '3' },
  ],
}

// ---- Selve nivåene ----------------------------------------------------------

export const LEVELS = [
  {
    id: 'barnehage',
    title: 'Barnehage',
    age: '4 år',
    emoji: '🧸',
    color: 'bg-pink-500',
    gradient: 'from-pink-300 via-rose-300 to-orange-200',
    intro: 'Lek og lær med farger, tall og former!',
    activities: [
      { id: 'tell', title: 'Tell tingene', emoji: '🍎', color: 'bg-rose-500', engine: 'quiz', config: COUNTING_TO_5 },
      { id: 'farger', title: 'Farger', emoji: '🎨', color: 'bg-fuchsia-500', engine: 'quiz', config: COLORS },
      { id: 'former', title: 'Former', emoji: '🔷', color: 'bg-amber-500', engine: 'quiz', config: SHAPES },
      { id: 'bokstav', title: 'Første bokstav', emoji: '🔤', color: 'bg-emerald-500', engine: 'quiz', config: FIRST_LETTER },
      { id: 'storliten', title: 'Stor og liten', emoji: '🔵', color: 'bg-orange-500', engine: 'patterns' },
      { id: 'ord', title: 'Ord og bilder', emoji: '🐶', color: 'bg-violet-500', engine: 'words', config: { title: 'Ord og bilder', emoji: '🐶', maxLen: 5 } },
    ],
  },
  {
    id: 'klasse1',
    title: '1. klasse',
    age: '6 år',
    emoji: '✏️',
    color: 'bg-sky-500',
    gradient: 'from-sky-300 via-cyan-300 to-emerald-200',
    intro: 'Tall, bokstaver og de første regnestykkene.',
    activities: [
      { id: 'telling', title: 'Tell til 10', emoji: '🔟', color: 'bg-rose-500', engine: 'quiz', config: COUNTING_TO_10 },
      { id: 'plussminus', title: 'Pluss og minus', emoji: '➕', color: 'bg-pink-500', engine: 'math', config: { title: 'Pluss og minus', emoji: '➕', color: 'bg-pink-500', ops: ['add', 'sub'], max: 20 } },
      { id: 'bokstaver', title: 'Bokstaver og lyder', emoji: '🅰️', color: 'bg-emerald-500', engine: 'quiz', config: LETTER_SOUNDS },
      { id: 'ord', title: 'Ord og bilder', emoji: '🔤', color: 'bg-violet-500', engine: 'words', config: { title: 'Ord og bilder', emoji: '🔤', maxLen: 6 } },
      { id: 'monster', title: 'Mønster og former', emoji: '🔺', color: 'bg-orange-500', engine: 'patterns' },
      { id: 'klokke', title: 'Hele klokketimer', emoji: '🕐', color: 'bg-indigo-500', engine: 'clock', config: { title: 'Hele timer', minutes: 'whole' } },
    ],
  },
  {
    id: 'klasse2',
    title: '2. klasse',
    age: '7 år',
    emoji: '📐',
    color: 'bg-emerald-500',
    gradient: 'from-emerald-300 via-teal-300 to-sky-200',
    intro: 'Større tall, gangetabell og klokka.',
    activities: [
      { id: 'plussminus', title: 'Pluss og minus til 100', emoji: '➕', color: 'bg-pink-500', engine: 'math', config: { title: 'Pluss og minus', emoji: '➕', color: 'bg-pink-500', ops: ['add', 'sub'], max: 100 } },
      { id: 'gange', title: 'Gangetabell (2, 5, 10)', emoji: '✖️', color: 'bg-rose-500', engine: 'math', config: { title: 'Gangetabell', emoji: '✖️', color: 'bg-rose-500', ops: ['mul'], mulFactors: [2, 5, 10] } },
      { id: 'klokke', title: 'Hele og halve timer', emoji: '🕜', color: 'bg-indigo-500', engine: 'clock', config: { title: 'Hele og halve timer', minutes: 'half' } },
      { id: 'ord', title: 'Ord og lesing', emoji: '📖', color: 'bg-violet-500', engine: 'words', config: { title: 'Ord og lesing', emoji: '📖' } },
      { id: 'motsatt', title: 'Motsatt', emoji: '↔️', color: 'bg-cyan-500', engine: 'quiz', config: OPPOSITES },
      { id: 'norden', title: 'Land i Norden', emoji: '❄️', color: 'bg-teal-500', engine: 'geography', config: { region: 'norden' } },
    ],
  },
  {
    id: 'klasse3',
    title: '3. klasse',
    age: '8 år',
    emoji: '🔬',
    color: 'bg-indigo-500',
    gradient: 'from-indigo-300 via-violet-300 to-purple-200',
    intro: 'Gangetabell, deling og Europa.',
    activities: [
      { id: 'gange', title: 'Gangetabell 1–10', emoji: '✖️', color: 'bg-rose-500', engine: 'math', config: { title: 'Gangetabell', emoji: '✖️', color: 'bg-rose-500', ops: ['mul'], mulMax: 10 } },
      { id: 'deling', title: 'Deling', emoji: '➗', color: 'bg-pink-500', engine: 'math', config: { title: 'Deling', emoji: '➗', color: 'bg-pink-500', ops: ['div'], divMax: 10 } },
      { id: 'klokke', title: 'Klokka til 5 minutter', emoji: '🕔', color: 'bg-indigo-500', engine: 'clock', config: { title: 'Klokka til 5 minutter', minutes: 'five' } },
      { id: 'europa', title: 'Land i Europa', emoji: '🏰', color: 'bg-teal-500', engine: 'geography', config: { region: 'europa' } },
      { id: 'monster', title: 'Mønster og logikk', emoji: '🧩', color: 'bg-orange-500', engine: 'patterns' },
      { id: 'ord', title: 'Ord og lesing', emoji: '📖', color: 'bg-violet-500', engine: 'words', config: { title: 'Ord og lesing', emoji: '📖' } },
    ],
  },
  {
    id: 'klasse4',
    title: '4. klasse',
    age: '9 år',
    emoji: '🎓',
    color: 'bg-rose-600',
    gradient: 'from-rose-300 via-fuchsia-300 to-purple-200',
    intro: 'Gange og deling, brøk og hele verden.',
    activities: [
      { id: 'gangedeling', title: 'Gange og deling', emoji: '✖️', color: 'bg-rose-500', engine: 'math', config: { title: 'Gange og deling', emoji: '✖️', color: 'bg-rose-500', ops: ['mul', 'div'], mulMax: 10, divMax: 10 } },
      { id: 'brok', title: 'Brøk og halvparten', emoji: '🍕', color: 'bg-orange-500', engine: 'quiz', config: FRACTIONS },
      { id: 'verden', title: 'Hele verden', emoji: '🌍', color: 'bg-teal-500', engine: 'geography', config: { region: 'verden' } },
      { id: 'klokke', title: 'Klokka', emoji: '🕔', color: 'bg-indigo-500', engine: 'clock', config: { title: 'Klokka', minutes: 'five' } },
      { id: 'ord', title: 'Ord og lesing', emoji: '📖', color: 'bg-violet-500', engine: 'words', config: { title: 'Ord og lesing', emoji: '📖' } },
    ],
  },
]

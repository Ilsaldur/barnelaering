// Flagg som bilde (SVG fra flag-icons, MIT), ikke emoji – emoji-flagg vises som
// bokstaver på Windows. Filene ligger i public/flagg/<kode>.svg.
// `avslort` = false gir nøytral alt/title («flagg»), så navnet ikke røper svaret
// før oppgaven er besvart (uten nett vises alt-teksten der bildet skulle vært).
export default function Flagg({ kode, navn = '', avslort = true, className = 'w-16' }) {
  const tekst = avslort && navn ? navn : 'flagg'
  return <img src={`/flagg/${kode}.svg`} alt={tekst} title={tekst} draggable={false} className={`inline-block h-auto rounded-md shadow ring-1 ring-black/10 ${className}`} />
}

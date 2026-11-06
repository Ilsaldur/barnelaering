// Flagg som bilde (SVG fra flag-icons, MIT), ikke emoji – emoji-flagg vises som
// bokstaver på Windows. Filene ligger i public/flagg/<kode>.svg.
export default function Flagg({ kode, navn = '', className = 'w-16' }) {
  return <img src={`/flagg/${kode}.svg`} alt={navn} title={navn} draggable={false} className={`inline-block h-auto rounded-md shadow ring-1 ring-black/10 ${className}`} />
}

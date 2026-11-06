// Korte historiebiter om reven, én for hver verden. Vises første gang barnet
// kommer til verdenen, leses opp eller leses selv. Enkelt bokmål.
export const HISTORIER = [
  {
    id: 'skog',
    verden: 'skog',
    tittel: 'Reven våkner i Trylleskogen',
    tekst: 'Det er morgen i Trylleskogen. Reven strekker seg og gjesper. «I dag skal jeg telle alt jeg ser!» sier han. Fem kongler, tre sopp og én blå sommerfugl. Vil du telle sammen med reven?',
  },
  {
    id: 'hav',
    verden: 'hav',
    tittel: 'Reven finner en båt',
    tekst: 'Bak de siste trærne i skogen ligger havet, stort og blått. Reven finner en liten båt. «Ti årer? Nei, to!» ler han. Han ror ut, og en sel stikker hodet opp. «Kan du regne?» spør selen. «Snart kan jeg det!» svarer reven.',
  },
  {
    id: 'fjell',
    verden: 'fjell',
    tittel: 'Opp på Det høye fjellet',
    tekst: 'Båten kommer til land under et høyt fjell. Reven begynner å klatre. Han teller ti steg, så ti til. «Hundre steg! Jeg nærmer meg toppen.» Oppe i skyene bor en rype som kan alle tallene til hundre. Reven vil lære dem alle.',
  },
  {
    id: 'slott',
    verden: 'slott',
    tittel: 'Porten til Det gylne slottet',
    tekst: 'På den andre siden av fjellet skinner et slott av gull. Ved porten står en vakt. «Bare den som kan gangetabellen, får komme inn,» sier han. Reven smiler. «Tre ganger tre er ni!» Porten knirker opp.',
  },
  {
    id: 'rom',
    verden: 'rom',
    tittel: 'Reven reiser til verdensrommet',
    tekst: 'I slottets høyeste tårn står en rakett. Reven tar på seg romhjelm og teller ned: ti, ni, åtte … null! Raketten suser opp mellom planetene. Der ute er det store tall, brøker og minusgrader. Reven er ikke redd. Han har deg med seg.',
  },
]

export function historieForVerden(verdenId) {
  return HISTORIER.find((h) => h.verden === verdenId) || null
}

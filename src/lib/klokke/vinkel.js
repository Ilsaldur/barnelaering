// Viserne på «Still klokka». Rene funksjoner, så reglene kan testes.
//
// Den korte viseren tegnes der barnet slipper den, i steg på 2,5 grader, og
// flyttes ikke av minuttviseren. Svaret er riktig når den lange viseren står
// på riktig minutt og den korte er mindre enn 12 grader fra riktig plass
// (time × 30 + minutter × 0,5). Rekkefølgen barnet setter viserne i, spiller
// ingen rolle.

export const TIME_STEG = 2.5 // grader
export const TIME_TOLERANSE = 12 // grader

// Timen ut fra den korte viserens vinkel. På en ekte klokke står timeviseren
// mellom to tall: minuttene bidrar med 0,5 grader hver. «Fem på 2» har
// timeviseren nesten på 2, og da skal timen bli 1.
export function timeFraVinkel(deg, minute = 0) {
  const ren = (((deg - minute * 0.5) % 360) + 360) % 360
  let h = Math.round(ren / 30) % 12
  if (h === 0) h = 12
  return h
}

// Vinkelen en ekte klokke har timeviseren på.
export function timeVinkel(hour, minute) {
  return ((hour % 12) * 30 + minute * 0.5) % 360
}

// Rund en vinkel til nærmeste steg (2,5 grader) innenfor 0–360.
export function rundVinkel(deg, steg = TIME_STEG) {
  const r = Math.round(deg / steg) * steg
  return ((r % 360) + 360) % 360
}

// Minste avstand mellom to vinkler, 0–180.
export function vinkelAvstand(a, b) {
  const d = Math.abs((((a - b) % 360) + 360) % 360)
  return Math.min(d, 360 - d)
}

// Tilstanden til klokka barnet stiller: { m, timeDeg }.
export function startKlokke() {
  return { m: 0, timeDeg: 0 } // 12:00
}
// Barnet slipper den korte viseren på en vinkel: rund til 2,5 grader.
export function settTime(klokke, deg) {
  return { ...klokke, timeDeg: rundVinkel(deg) }
}
// Barnet slipper den lange viseren: minuttene endres, den korte står.
export function settMinutt(klokke, m) {
  return { ...klokke, m: ((m % 60) + 60) % 60 }
}
// Er klokka stilt riktig?
export function stillRiktig(klokke, answer) {
  return klokke.m === answer.m && vinkelAvstand(klokke.timeDeg, timeVinkel(answer.h, answer.m)) < TIME_TOLERANSE
}
// Klokkeslettet barnet har stilt, regnet ut fra vinkelen (til «Du: …»).
export function stiltTid(klokke) {
  return { h: timeFraVinkel(klokke.timeDeg, klokke.m), m: klokke.m }
}
// Hvor den korte viseren skal stå, i ord (til forklaringen).
export function timeviserTekst(answer) {
  const h = answer.h % 12 || 12
  const neste = (h % 12) + 1
  if (answer.m === 0) return `rett på ${h}`
  if (answer.m < 15) return `litt forbi ${h}`
  if (answer.m <= 30) return `midt mellom ${h} og ${neste}`
  return `nesten på ${neste}`
}

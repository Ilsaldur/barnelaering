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

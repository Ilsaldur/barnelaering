// Kart uten eksterne biblioteker: pakker ut TopoJSON (Natural Earth via
// world-atlas, fri lisens) og tegner SVG-stier med en enkel Mercator-projeksjon.
import topo from '../../data/geo/world-110m.json'

let cache = null

function decodeArcs(t) {
  const { scale, translate } = t.transform
  return t.arcs.map((arc) => {
    let x = 0
    let y = 0
    return arc.map(([dx, dy]) => {
      x += dx
      y += dy
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]]
    })
  })
}

function ring(arcs, idxs) {
  const pts = []
  for (const i of idxs) {
    let a = i < 0 ? [...arcs[~i]].reverse() : arcs[i]
    if (pts.length) a = a.slice(1)
    pts.push(...a)
  }
  return pts
}

// Alle land som liste: { id, name, rings: [[ [lon,lat], … ], …] }
export function countries() {
  if (cache) return cache
  const arcs = decodeArcs(topo)
  cache = topo.objects.countries.geometries.map((g) => {
    const rings = []
    if (g.type === 'Polygon') for (const r of g.arcs) rings.push(ring(arcs, r))
    else if (g.type === 'MultiPolygon') for (const poly of g.arcs) for (const r of poly) rings.push(ring(arcs, r))
    return { id: String(g.id), name: g.properties?.name || '', rings }
  })
  return cache
}

// Mercator i «grader-enheter»: x = lengdegrad, y = projisert breddegrad.
export function project([lon, lat]) {
  const phi = (Math.max(-85, Math.min(85, lat)) * Math.PI) / 180
  const y = -Math.log(Math.tan(Math.PI / 4 + phi / 2)) * (180 / Math.PI)
  return [lon, y]
}

// Utsnitt per område: [lonMin, latMin, lonMax, latMax].
export const UTSNITT = {
  norden: [-26, 53, 34, 72],
  europa: [-12, 34, 36, 72],
  verden: [-170, -56, 180, 78],
}

export function viewBoxFor(region) {
  const [lonMin, latMin, lonMax, latMax] = UTSNITT[region] || UTSNITT.verden
  const [x0, y1] = project([lonMin, latMin])
  const [x1, y0] = project([lonMax, latMax])
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}

// SVG-sti for et land. Store hopp (Russland over datolinja) splittes.
export function pathFor(country) {
  let d = ''
  for (const r of country.rings) {
    let prev = null
    r.forEach((pt, i) => {
      const [x, y] = project(pt)
      const jump = prev && Math.abs(pt[0] - prev[0]) > 180
      d += i === 0 || jump ? `M${x.toFixed(2)},${y.toFixed(2)}` : `L${x.toFixed(2)},${y.toFixed(2)}`
      prev = pt
    })
    d += 'Z'
  }
  return d
}

// Midtpunkt (til å plassere en markør), beregnet fra den største ringen.
export function centroidFor(country) {
  let best = null
  for (const r of country.rings) {
    if (!best || r.length > best.length) best = r
  }
  if (!best) return [0, 0]
  let sx = 0
  let sy = 0
  for (const p of best) {
    const [x, y] = project(p)
    sx += x
    sy += y
  }
  return [sx / best.length, sy / best.length]
}

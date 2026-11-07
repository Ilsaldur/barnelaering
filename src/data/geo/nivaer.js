// Geografistigen: ni nivåer. Norden, Europa og verden, med flagg,
// hovedsteder og et ordentlig kart å trykke på.
import { registerStige } from '../stiger.js'
import { registerTypeLabels } from '../../lib/labels.js'

export const GEO_OMRAADER = [
  { id: 'norden', navn: 'Norden', emoji: '❄️', farge: 'bg-sky-500', gradient: 'from-sky-300 via-cyan-200 to-blue-200', fra: 1, til: 3 },
  { id: 'europa', navn: 'Europa', emoji: '🏰', farge: 'bg-emerald-500', gradient: 'from-emerald-300 via-green-300 to-lime-200', fra: 4, til: 6 },
  { id: 'verden', navn: 'Hele verden', emoji: '🌍', farge: 'bg-amber-500', gradient: 'from-amber-300 via-orange-300 to-yellow-200', fra: 7, til: 9 },
]

const N = (id, verden, tittel, typer, extra = {}) => ({ id, verden, tittel, typer, svar: 'valg', lengde: 8, ...extra })
const T = (type, param = {}, vekt = 1) => ({ type, param, vekt })

export const NIVAER_GEO = [
  N(1, 'norden', 'Flaggene i Norden', [T('flagg_land', { region: 'norden' }, 2), T('land_flagg', { region: 'norden' }, 1)], { trinn: '2. trinn' }),
  N(2, 'norden', 'Hovedstedene i Norden', [T('hovedstad', { region: 'norden' }, 2), T('flagg_hovedstad', { region: 'norden' }, 1), T('hovedstad_flagg', { region: 'norden' }, 1), T('flagg_land', { region: 'norden' }, 1)], { trinn: '2. trinn' }),
  N(3, 'norden', 'Finn landene på kartet over Norden', [T('finn_paa_kart', { region: 'norden' }, 2), T('hvilket_land', { region: 'norden' }, 1), T('kart_hovedstad', { region: 'norden' }, 1), T('flagg_hovedstad', { region: 'norden' }, 1)], { trinn: '2. trinn' }),
  N(4, 'europa', 'Flagg i Europa', [T('flagg_land', { region: 'europa' }, 2), T('land_flagg', { region: 'europa' }, 1)], { trinn: '3. trinn' }),
  N(5, 'europa', 'Hovedsteder i Europa', [T('hovedstad', { region: 'europa' }, 2), T('flagg_hovedstad', { region: 'europa' }, 1), T('hovedstad_flagg', { region: 'europa' }, 1), T('flagg_land', { region: 'europa' }, 1)], { trinn: '3. trinn' }),
  N(6, 'europa', 'Finn landene på kartet over Europa', [T('finn_paa_kart', { region: 'europa' }, 2), T('hvilket_land', { region: 'europa' }, 1), T('kart_hovedstad', { region: 'europa' }, 1)], { trinn: '3. trinn' }),
  N(7, 'verden', 'Verdensdeler og flagg fra hele verden', [T('verdensdel', {}, 2), T('flagg_land', { region: 'verden' }, 1)], { trinn: '4. trinn' }),
  N(8, 'verden', 'Hovedsteder i verden', [T('hovedstad', { region: 'verden' }, 2), T('land_flagg', { region: 'verden' }, 1)], { trinn: '4. trinn' }),
  N(
    9,
    'verden',
    'Finn landene på verdenskartet og i hver verdensdel',
    [
      T('finn_paa_kart', { region: 'verden' }, 2),
      T('hvilket_land', { region: 'verden' }, 1),
      T('finn_paa_kart', { region: 'amerika' }, 2),
      T('hvilket_land', { region: 'amerika' }, 1),
      T('finn_paa_kart', { region: 'afrika' }, 2),
      T('hvilket_land', { region: 'afrika' }, 1),
      T('finn_paa_kart', { region: 'asia' }, 2),
      T('hvilket_land', { region: 'asia' }, 1),
      T('finn_paa_kart', { region: 'oseania' }, 1),
      T('hvilket_land', { region: 'oseania' }, 1),
    ],
    { trinn: '4. trinn' },
  ),
]

export const MAKS_GEO = NIVAER_GEO.length

export function geoOmraadeFor(id) {
  return GEO_OMRAADER.find((o) => id >= o.fra && id <= o.til) || GEO_OMRAADER[0]
}

registerStige('geografi', NIVAER_GEO)

// Lesbare navn på oppgavetypene (voksensiden), uavhengig av om kartet er lastet.
registerTypeLabels({
  flagg_norden: 'Flagg i Norden',
  flagg_europa: 'Flagg i Europa',
  flagg_verden: 'Flagg i verden',
  hovedstad_norden: 'Hovedsteder i Norden',
  hovedstad_europa: 'Hovedsteder i Europa',
  hovedstad_verden: 'Hovedsteder i verden',
  kart_norden: 'Kartet over Norden',
  kart_europa: 'Kartet over Europa',
  kart_verden: 'Verdenskartet',
  kart_amerika: 'Kartet over Amerika',
  kart_afrika: 'Kartet over Afrika',
  kart_asia: 'Kartet over Asia',
  kart_oseania: 'Kartet over Oseania',
  verdensdel: 'Verdensdeler',
})

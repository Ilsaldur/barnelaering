// Eventyret: en Overcooked-aktig "samlekategori" som plukker aktiviteter fra
// ALLE kategoriene og legger dem ut som baner (1-1, 1-2 …) langs en sti.
// Avataren reiser fra bane til bane. Hver verden låses opp med stjerner.
//
// En "stage" peker på en aktivitet i src/data/levels.js via { levelId, activityId }.
// Banenummer settes automatisk: verden 2, tredje bane => "2-3".

import { LEVELS } from './levels.js'

export const WORLDS = [
  {
    id: 1,
    name: 'Skogen',
    emoji: '🌳',
    gate: 0, // antall stjerner som trengs for å låse opp verdenen
    stages: [
      { levelId: 'barnehage', activityId: 'tell' },
      { levelId: 'barnehage', activityId: 'farger' },
      { levelId: 'barnehage', activityId: 'former' },
      { levelId: 'barnehage', activityId: 'bokstav' },
      { levelId: 'barnehage', activityId: 'storliten' },
      { levelId: 'barnehage', activityId: 'ord' },
    ],
  },
  {
    id: 2,
    name: 'Enga',
    emoji: '🌼',
    gate: 5,
    stages: [
      { levelId: 'klasse1', activityId: 'telling' },
      { levelId: 'klasse1', activityId: 'plussminus' },
      { levelId: 'klasse1', activityId: 'bokstaver' },
      { levelId: 'klasse1', activityId: 'ord' },
      { levelId: 'klasse1', activityId: 'monster' },
      { levelId: 'klasse1', activityId: 'klokke' },
    ],
  },
  {
    id: 3,
    name: 'Fjellet',
    emoji: '⛰️',
    gate: 13,
    stages: [
      { levelId: 'klasse2', activityId: 'plussminus' },
      { levelId: 'klasse2', activityId: 'gange' },
      { levelId: 'klasse2', activityId: 'klokke' },
      { levelId: 'klasse2', activityId: 'motsatt' },
      { levelId: 'klasse2', activityId: 'ord' },
      { levelId: 'klasse2', activityId: 'norden' },
    ],
  },
  {
    id: 4,
    name: 'Byen',
    emoji: '🏰',
    gate: 23,
    stages: [
      { levelId: 'klasse3', activityId: 'gange' },
      { levelId: 'klasse3', activityId: 'deling' },
      { levelId: 'klasse3', activityId: 'klokke' },
      { levelId: 'klasse3', activityId: 'monster' },
      { levelId: 'klasse3', activityId: 'ord' },
      { levelId: 'klasse3', activityId: 'europa' },
    ],
  },
  {
    id: 5,
    name: 'Verdensrommet',
    emoji: '🚀',
    gate: 35,
    stages: [
      { levelId: 'klasse4', activityId: 'gangedeling' },
      { levelId: 'klasse4', activityId: 'brok' },
      { levelId: 'klasse4', activityId: 'klokke' },
      { levelId: 'klasse4', activityId: 'ord' },
      { levelId: 'klasse4', activityId: 'verden' },
    ],
  },
]

// Slå opp aktiviteten en stage peker på.
export function resolveActivity(stage) {
  const lvl = LEVELS.find((l) => l.id === stage.levelId)
  return lvl?.activities.find((a) => a.id === stage.activityId) || null
}

// Flat liste over alle baner, med nøkkel (f.eks. "2-3") og posisjon.
export function allStages() {
  const out = []
  for (const world of WORLDS) {
    world.stages.forEach((stage, idx) => {
      out.push({ key: `${world.id}-${idx + 1}`, world, idx, stage, activity: resolveActivity(stage) })
    })
  }
  return out
}

export function stageByKey(key) {
  return allStages().find((s) => s.key === key) || null
}

export const FIRST_STAGE = '1-1'

// Runde-oppsett for den datadrevne quizen (ren logikk, ingen React).
import { shuffle } from './rng.js'
import { ROUND_LENGTH, uniqueRound, drawFromBank } from './round.js'

function optionView(value, item, config, bank) {
  let show = null
  if (config.optionPictures && config.optionPictures[value]) show = config.optionPictures[value]
  else if (config.pictureOptions) {
    const src = (item.options ? [] : bank).find((b) => b.answer === value) || null
    show = src?.show || null
  }
  return { value, show }
}

function buildOptions(item, bank, config) {
  let values
  if (item.options) values = shuffle(item.options)
  else {
    const others = [...new Set(bank.map((b) => b.answer))].filter((a) => a !== item.answer)
    values = shuffle([item.answer, ...shuffle(others).slice(0, 3)])
  }
  return values.map((v) => optionView(v, item, config, bank))
}

// Trekk en runde uten like oppgaver.
export function makeRound(config) {
  const rounds = config.rounds || ROUND_LENGTH
  if (config.generator) {
    const items = uniqueRound(config.generator, rounds, {
      keyOf: (it) => it.key || `${it.prompt || ''}|${it.show || ''}|${it.count || ''}|${it.answer}`,
    })
    return items.map((it) => ({ ...it, _options: buildOptions(it, [], config) }))
  }
  const bank = config.bank || []
  return drawFromBank(bank, Math.min(rounds, Math.max(bank.length, 1)), shuffle).map((it) => ({
    ...it,
    _options: buildOptions(it, bank, config),
  }))
}


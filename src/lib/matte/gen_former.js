// Former, farger, mønster og størrelse (matte nivå 1–4). Alle oppgavene er
// merket `formFarge`, så oppdraget aldri har mer enn to av dem.
import { randInt, pick, shuffle } from '../rng.js'
import { naer } from './felles.js'
import { FARGER, FORMER, MONSTER_SETT, MONSTER_EKSTRA, STORRELSE_SETT } from '../../data/matte/former.js'

const navnFeil = (liste, riktig, rng) => shuffle(liste.filter((x) => x.navn !== riktig.navn), rng).slice(0, 3)

export const GEN_FORMER = {
  // Hva kommer neste i mønsteret? Svaralternativene er bilder.
  monster_neste: (_, rng) => {
    const sett = pick(MONSTER_SETT, rng)
    const start = randInt(0, sett.length - 1, rng)
    const lengde = sett.length === 2 ? randInt(5, 6, rng) : randInt(6, 7, rng)
    const rekke = Array.from({ length: lengde }, (_, i) => sett[(start + i) % sett.length])
    const answer = sett[(start + lengde) % sett.length]
    const ekstra = shuffle(MONSTER_EKSTRA.filter((e) => !sett.includes(e)), rng).slice(0, 4 - sett.length)
    return {
      type: 'monster_neste',
      form: 'valg',
      formFarge: true,
      prompt: 'Hva kommer neste i mønsteret?',
      spoken: `Hva kommer neste i mønsteret? ${rekke.join(', ')}, og så?`,
      visual: { kind: 'rekke', items: [...rekke, '?'] },
      answer,
      options: shuffle([...sett, ...ekstra], rng),
      stor: true,
      explain: `Mønsteret gjentar seg: ${sett.join(' ')}. Neste er ${answer}.`,
    }
  },
  // Sorter fra minst til størst.
  sorter_storrelse: (_, rng) => {
    const sett = pick(STORRELSE_SETT, rng)
    return {
      type: 'sorter_storrelse',
      form: 'sorter',
      formFarge: true,
      prompt: 'Trykk på tingene fra minst til størst.',
      spoken: 'Trykk på tingene fra minst til størst. Den minste først.',
      items: shuffle(sett, rng),
      answer: sett.map((x) => x.id),
      explain: 'Fra minst til størst: den minste først, så den litt større, og den største sist.',
    }
  },
  // Hvilken form er dette? Svaralternativene er bare navn.
  form_navn: (_, rng) => {
    const f = pick(FORMER, rng)
    const feil = navnFeil(FORMER, f, rng)
    return {
      type: 'form_navn',
      form: 'valg',
      formFarge: true,
      prompt: 'Hvilken form er dette?',
      spoken: `Hvilken form er dette? ${[f, ...feil].map((x) => x.navn).join(', ')}?`,
      visual: { kind: 'ikon', emoji: f.emoji },
      answer: f.navn,
      options: shuffle([f.navn, ...feil.map((x) => x.navn)], rng),
      explain: `${f.emoji} er en ${f.navn.toLowerCase()}.`,
    }
  },
  // Hvilken farge er dette? Farget rute i spørsmålet, navn som svar.
  farge_navn: (_, rng) => {
    const f = pick(FARGER, rng)
    const feil = navnFeil(FARGER, f, rng)
    return {
      type: 'farge_navn',
      form: 'valg',
      formFarge: true,
      prompt: 'Hvilken farge er dette?',
      spoken: `Hvilken farge er dette? ${[f, ...feil].map((x) => x.navn).join(', ')}?`,
      visual: { kind: 'ikon', emoji: f.emoji },
      answer: f.navn,
      options: shuffle([f.navn, ...feil.map((x) => x.navn)], rng),
      explain: `${f.emoji} er ${f.navn.toLowerCase()}.`,
    }
  },
  // Hvor mange trekanter ser du?
  tell_former: ({ max = 5 }, rng) => {
    const former = shuffle(FORMER.filter((f) => f.emoji !== '🟦' || true), rng)
    const maal = former[0]
    const andre = former.slice(1, 3)
    const n = randInt(1, max, rng)
    const antAndre = randInt(2, 4, rng)
    const items = shuffle([...Array.from({ length: n }, () => maal.emoji), ...Array.from({ length: antAndre }, (_, i) => andre[i % andre.length].emoji)], rng)
    return {
      type: 'tell_former',
      form: 'valg',
      formFarge: true,
      prompt: `Hvor mange ${maal.flertall} ser du?`,
      spoken: `Hvor mange ${maal.flertall} ser du?`,
      visual: { kind: 'rekke', items },
      answer: n,
      options: shuffle([n, ...naer(n, { count: 3, min: 0, max: max + 2, rng })], rng),
      explain: `Det er ${n} ${n === 1 ? maal.navn.toLowerCase() : maal.flertall}: ${maal.emoji}.`,
    }
  },
}

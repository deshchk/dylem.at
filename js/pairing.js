// imports
import { id, r, getPair } from "./utility.js"
import { options } from "./options.js"



// timing variable to be replaced by performance.now() in pairUp()
export let voteStarted = 0

// create objects for keeping track of scores (votes and time)
export let scores
export let time_scores

export let pairs = []

// create pairs array from the list of options and initialize scoreboards
export function createPairs() {
  pairs = []
  options.forEach((option, i) => {
    options.slice(i + 1).forEach(nextOption => {
      pairs.push({ a: option, b: nextOption })
    })
  })

  // initialize scoreboards
  scores = Object.fromEntries(options.map(item => [item, 0]))
  time_scores = Object.fromEntries(options.map(item => [item, []]))
}



// pair two options against each other until all of the pairs are used
export function pairUp(array) {
  const unusedPairs = array.filter(pair => !pair.used)

  if (unusedPairs.length > 0) {
    const pair = getPair(unusedPairs)
    const shuffle = r(2)

    id('opt-a').textContent = shuffle === 0 ? pair.a : pair.b
    id('opt-b').textContent = shuffle === 0 ? pair.b : pair.a

    pair.used = true
    voteStarted = performance.now()
  }
}
// imports
import { id, getAvg } from "./utility.js"
import { pairs, pairUp, scores, time_scores, voteStarted, createPairs } from "./pairing.js"



// when voting is done sort the scores by points and time, disable the buttons and show the ranking
function votingFinished() {

  // sorting
  const scores_sorted = Object.entries(scores).sort(([x,a],[y,b]) => {
    if (a > b) { return -1 } else if (a < b) { return 1 } else {
      if (getAvg(time_scores[x]) < getAvg(time_scores[y])) { return -1 } else { return 1 }
    }
  })
  localStorage.setItem('votingScores', JSON.stringify(scores_sorted))

  readyToMoveOn()
}



// vote for the chosen option and keep track of time scores
function vote(opt) {
  scores[opt]++
  time_scores[opt].push(Math.round(performance.now() - voteStarted))

  if (!pairs.some(pair => !pair.used)) {
    votingFinished()
  }
}



// listen for clicks, vote and show another pair
id('opt-a').addEventListener('click', e => {
  vote(e.target.textContent)
  pairUp(pairs)
})

id('opt-b').addEventListener('click', e => {
  vote(e.target.textContent)
  pairUp(pairs)
})




// reset voting
export function resetVoting() {
  createPairs()
  pairUp(pairs)
}


// voting is finished, so I'm ready to move on
export function readyToMoveOn() {
  if (localStorage.getItem('votingScores')) {
    // changing text in btns and disabling them
    id('voting-section').style.top = '0'
    id('voting-legend').style.display = 'none'
    id('voting-title').hidden = true
    id('opt-a').hidden = true
    id('opt-b').hidden = true
    id('voters-post').hidden = false

    // allow to continue
    id('next-page').dataset.show = 1
  } else {
    id('next-page').dataset.show = 0
  }
}
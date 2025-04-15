// imports
import { id } from "./utility.js"
import { addEventListeners } from "./ddrop.js"
import { resetVoting } from "./voting.js"
import { processReset } from "../app.js";



// options list
export const options = JSON.parse(localStorage.getItem('options')) || []



// render options
export function renderOptions() {
  if (options.length > 3) { id('next-page').dataset.show = 1; id('four-to-start').hidden = true }
    else { id('next-page').dataset.show = 0 }
  // render nothing or values' list if there are some in the array/local storage
  if(options.length === 0) {
    id('opt-list').innerHTML = `
      <li class="nothing-yet">nic tu nie ma... <em>jeszcze</em></li>
    `
  } else {
    const listHtml = options.map((option, i) => {

      return `
        <li id="opt-${i}" class="list-option" data-over="false">

          <div class="opt-dragger"></div>

            <span class="opt-name">
              ${option}
            </span>

          <button id="remove-${i}" class="opt-remover">⨉</button>
        </li>
      `
    }).join('')

    id('opt-list').innerHTML = listHtml

    // add event listeners to each value for drag and drop
    options.forEach((opt, i) => {
      addEventListeners(id(`opt-${i}`))
    })
  }
}



// adding option
function addOption() {
  const input = id('add-opt').value

  if (
      input != '' && input.match(/\D{2,}/g) &&
      !options.find(opt => input.toLowerCase().replace(/\s+/g, ' ').trim() === opt.toLowerCase()) && 
      options.length < 6
    ) {
    options.push(input.replace(/\s+/g, ' ').trim())
    localStorage.setItem('options', JSON.stringify(options))
    id('add-opt').value = ''
  } else { id('add-opt').value = '' }
  if (options.length === 6) {id('add-opt').disabled = true}

  processReset()
}

// removing option
function removeOption(targetID) {
  options.splice(targetID.split('-')[1], 1)
  localStorage.setItem('options', JSON.stringify(options))

  processReset()
  id('add-opt').disabled = false
}



//   E V E N T   L I S T E N E R S
// add option on Enter
id('add-opt').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    if (document.activeElement === id('add-opt')) {
      addOption()
      resetVoting()
      renderOptions()
    }
  }
})

id('add-opt-btn').addEventListener('click', () => {
  addOption()
  resetVoting()
  renderOptions()
  id('add-opt').focus()
})

// remove option on click
id('opt-list').addEventListener('click', e => {
  if (e.target.id.includes('remove')) {
    removeOption(e.target.id)
    resetVoting()
    renderOptions()
  }
})


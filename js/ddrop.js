// imports
import { id } from "./utility.js"
import { options, renderOptions } from "./options.js"
import { resetVoting } from "./voting.js"



let draggedAt
let dropAt

function dragStart() {
  draggedAt = this.id.split('-')[1]
}

function dragOver(e) {
  e.preventDefault()
}

function dragDrop() {
  dropAt = this.id.split('-')[1]

  options.splice(dropAt, 0, options.splice(draggedAt, 1)[0])
  localStorage.setItem('options', JSON.stringify(options))
  resetVoting()
  renderOptions()
}

let counter = 0
function dragEnter() {
  counter++
  const listItems = id('opt-list').querySelectorAll('li')
  listItems.forEach(opt => {
    opt.dataset.over = false
  })
  this.dataset.over = true
}

function dragLeave() {
  counter--
  if (counter === 0) {
    this.dataset.over = false
  }
}

// adding event listeners to achieve drag and drop for options
export function addEventListeners(item) {
  item.addEventListener('dragstart', dragStart)
  item.addEventListener('dragover', dragOver)
  item.addEventListener('drop', dragDrop)
  item.addEventListener('dragenter', dragEnter)
  item.addEventListener('dragleave', dragLeave)
}

// D R A G   A N D   D R O P
const touchDevice = (navigator.maxTouchPoints & 0xFF || 'ontouchstart' in document.documentElement)
let dragging = false

function startDragging(e) {
  const draggables = id('opt-list').querySelectorAll('li > .opt-dragger')
  if (Array.from(draggables).includes(e.target)) {
    dragging = !dragging
    e.target.parentNode.setAttribute('draggable', true)
  }
}

if (touchDevice) {
  id('opt-list').addEventListener('touchstart', e => {  startDragging(e)  })
} else {
  id('opt-list').addEventListener('mousedown', e => {  startDragging(e)  })
}
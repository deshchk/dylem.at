import { id } from "./utility.js"

const easing = x => x >= .5 ? Math.pow(x-1, 3)+1 : (-.33*x)/(-.666+x)

export function updateRange (range) {
  const labels = range.nextElementSibling
  const label1 = labels.children[0]
  const label2 = labels.children[1]

  label1.style.opacity = easing((10+(-Number(range.value)))/20)
  label2.style.opacity = easing((10+Number(range.value))/20)
  if (Number(range.value) < -9) {
    label1.hidden = false
    label1.style.fontWeight = 600
    range.style.setProperty('--thumbColor', 'red')
    label2.hidden = true
  } else if (Number(range.value > 9)) {
    label2.hidden = false
    label2.style.fontWeight = 600
    range.style.setProperty('--thumbColor', 'green')
    label1.hidden = true
  } else {
    label1.style.fontWeight = 400
    label1.style.letterSpacing = '.5px'
    label1.hidden = false
    label2.style.fontWeight = 400
    label2.style.letterSpacing = '.5px'
    label2.hidden = false
    range.style.setProperty('--thumbColor', document.documentElement.dataset.theme === 'dark' ? 'whitesmoke' : 'black')
  }
  label1.style.fontSize = 1.0238 - easing((5+Number(range.value))/100) + 'rem'
  label2.style.fontSize = 1.0238 - easing((5+(-Number(range.value)))/100) + 'rem'
}

export function updateStars(target, block, type) {
  const stars = block.querySelectorAll('.star-opt')
  const value = target.previousElementSibling.value
  const idNum = el => Number(el.previousElementSibling.id.split('-')[1])

  if (type === 'mouseover') {
    stars.forEach(star => {
      if (idNum(star) <= value) {
        star.classList.add('colored')
      }
    })
  } else if (type === 'mouseout') {
    stars.forEach(star => {
      if (!star.classList.contains('clicked')) {
        star.classList.remove('colored')
      }
    })
  } else if (type === 'click') {
    stars.forEach(star => {
      if (idNum(star) < value) {
        star.classList.add('colored')
        star.classList.add('clicked')
      } else {
        star.classList.remove('colored')
        star.classList.remove('clicked')
      }
    })
  }
}










export function initializeInputListeners () {

  id('form-fieldset').addEventListener('click', e => {
    if (e.target.classList.contains('grad-label')) {
      const labelsUl = e.target.parentNode
      const range = labelsUl.previousElementSibling

      if (e.target === labelsUl.children[0]) { range.value = '-10'; updateRange(range) } 
      else if (e.target === labelsUl.children[1]) { range.value = '10'; updateRange(range) }
    }
    if (e.target.classList.contains('star-opt')) {
      updateStars(e.target, e.target.parentNode, 'click')
    }
  })

  id('form-fieldset').addEventListener('input', e => {
    if (e.target.classList.contains('range')) {
      updateRange(e.target)
    }
  })

  id('form-fieldset').addEventListener('dblclick', e => {
    if (e.target.classList.contains('range')) {
      e.target.value = 0; updateRange(e.target)
    }
  })

  id('form-fieldset').addEventListener('mouseover', e => {
    if (e.target.classList.contains('star-opt')) {
      updateStars(e.target, e.target.parentNode, 'mouseover')
    }
  })

  id('form-fieldset').addEventListener('mouseout', e => {
    if (e.target.classList.contains('star-opt')) {
      updateStars(e.target, e.target.parentNode, 'mouseout')
    }
  })
}
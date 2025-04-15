// import
import { initializeInputListeners } from "./js/updateInputs.js"
import { updateTestData, resetActivities } from "./js/testOperations.js"
import { options, renderOptions } from "./js/options.js"
import { renderForm } from "./js/renderForm.js"
import { id } from "./js/utility.js"
import { readyToMoveOn, resetVoting } from "./js/voting.js"
import { calculateResults, renderResults } from "./js/results.js"





// Airtable
const Airtable = require('airtable')
const base = new Airtable({apiKey: 'patjmq8wv5T4fsdfc.79a6a344584029a22c8a5f8ff44790ceefeee872cfef0842bef42fbb6c12a237'}).base('appR1srMw2HcMqzbo')

//    S e n d   R e s u l t s
function sendRes() {
  // get data from local
  const sendData = JSON.parse(localStorage.getItem('sendData'))
  // sending data
  base('main data').create(sendData, function(err, records) {
    if (err) { console.error(err); return }
    records.forEach(function (record) { console.log(record.getId()) })
  })
}



// WEBSITE START
setTimeout(() => {
  id('start-overlay').style.opacity = 0

  setTimeout(() => {
    document.body.style.overflow = 'auto'
  }, 350)
  setTimeout(() => {
    id('start-overlay').remove()
  }, 800)
}, 300)





// person
const person = JSON.parse(localStorage.getItem('person')) || {
  gender: 1,
  textGender: 0,
  wiek: '',
}

function validateWiek() {
  if ((id('wiek').checkValidity() && id('wiek').value != false)) { id('next-page').dataset.show = 1 }
  else { id('next-page').dataset.show = 0 }
}

id('wiek').addEventListener('input', () => { validateWiek() })

id('about-me').addEventListener('input', () => {
  person.gender = id('gender-select').value
  person.textGender = id('text-gender-select').value
  person.wiek = id('wiek').value
  localStorage.setItem('person', JSON.stringify(person))
})





// render sections and form
let sectionPage = Number(id('root').dataset.section)
let formPage = 1
let formType = localStorage.getItem('finished') ? Number(JSON.parse(localStorage.getItem('finished'))[1]) : 0    // 0 – shorter, 1 – longer
let formActivity = 0

function updateSection() {
  id('root').querySelectorAll('section[data-show="1"]').forEach(section => { section.dataset.show = 0 })

  if (sectionPage > 1) { id('previous-page').dataset.show = 1 }
  else { id('previous-page').dataset.show = 0 }

  if (sectionPage === 1) { id('about-me').dataset.show = 1; validateWiek() }
  if (sectionPage === 2) {
    id('voting-list-section').dataset.show = 1
    renderOptions()
    if (options.length < 4) { id('next-page').dataset.show = 0 } else { id('next-page').dataset.show = 1 }
  }
  if (sectionPage === 3) { id('pre-voting-section').dataset.show = 1; id('next-page').dataset.show = 1 }
  if (sectionPage === 4) { id('voting-section').dataset.show = 1; resetVoting(); readyToMoveOn() }
  if (sectionPage === 5) {
    id('post-voting-section').dataset.show = 1
    id('root').querySelectorAll('.choice-opis')[1].querySelectorAll('span')[0].innerHTML = `<b>${options.length}</b> aktywności <br> <b>34</b> zmienne`
    if (!(id('shorter-opt').checked || id('longer-opt').checked)) { id('next-page').dataset.show = 0 }
    else { id('next-page').dataset.show = 1 }
  }
  if (sectionPage === 6) {
    formType = Number(id('post-voting-section').querySelector('input[name="choice"]:checked')?.value)
    id('main-form-section').dataset.show = 1
    id('activity').textContent = JSON.parse(localStorage.getItem('votingScores'))?.map(arr => arr[0])[0]
    renderForm(formPage, formActivity, formType)
  }
  if (sectionPage === 7) {
    localStorage.setItem('finished', JSON.stringify(['true', formType]))
      id('finish-section').dataset.show = 1
      id('previous-page').dataset.show = 0
      id('next-page').dataset.show = 0
      id('reset-btn').dataset.show = 1
    renderResults()
  }
}





//    H E L P
// id('help-btn').addEventListener('click', () => {
//   alert('tu będzie okienko z dodatkowymi informacjami, kontaktem itd.')
// })



let sectionSeparator = false
//    P A G I N A T I O N
// PREVIOUS
id('previous-page').addEventListener('click', () => {
  if (sectionPage > 1 && formActivity === 0 && formPage === 1) {
    id('root').dataset.section = --sectionPage; updateSection()
  }
  if (sectionPage === 6 && formPage > 1) {
    if (sectionSeparator) {
      sectionSeparator = false
      id('form-fieldset').hidden = false
      id('form-separator').dataset.show = 0
    } else {
      updateTestData(formActivity, formType); formPage--; renderForm(formPage, formActivity, formType)
    }
  } else if (sectionPage === 6 && formPage === 1 && formActivity > 0) {
    if (!sectionSeparator) {
      id('form-separator').textContent = (JSON.parse(localStorage.getItem('votingScores'))?.map(arr => arr[0])[formActivity]).charAt(0).toUpperCase() + (JSON.parse(localStorage.getItem('votingScores'))?.map(arr => arr[0])[formActivity]).slice(1)
      id('form-separator').dataset.show = 1
      sectionSeparator = true
      id('form-fieldset').hidden = true
    } else {
      sectionSeparator = false
      id('form-fieldset').hidden = false
      id('form-separator').dataset.show = 0
      updateTestData(formActivity, formType); formActivity--; formPage = (formType === 1 ? 34 : 22); renderForm(formPage, formActivity, formType)
    }
  }
})
// NEXT
id('next-page').addEventListener('click', () => {
  if (sectionPage === 6 && formPage < (formType === 1 ? 34 : 22)) {
    if (sectionSeparator) {
      sectionSeparator = false
      id('form-fieldset').hidden = false
      id('form-separator').dataset.show = 0
    } else {
      updateTestData(formActivity, formType); formPage++; renderForm(formPage, formActivity, formType)
    }
  } else if (sectionPage === 6 && (formType === 0 ? formActivity < 1 : formActivity < (options.length - 1))) {
    if (!sectionSeparator) {
      id('form-separator').textContent = (JSON.parse(localStorage.getItem('votingScores'))?.map(arr => arr[0])[formActivity+1]).charAt(0).toUpperCase() + (JSON.parse(localStorage.getItem('votingScores'))?.map(arr => arr[0])[formActivity+1]).slice(1)
      id('form-separator').dataset.show = 1
      sectionSeparator = true
      id('form-fieldset').hidden = true
    } else {
      sectionSeparator = false
      id('form-fieldset').hidden = false
      id('form-separator').dataset.show = 0
      updateTestData(formActivity, formType); formActivity++; formPage = 1; renderForm(formPage, formActivity, formType)
    }
  } else {
    id('root').dataset.section = ++sectionPage; updateSection()
    if (sectionPage === 7) {
      calculateResults()
      sendRes()
    }
  }
})
//   R E S E T
id('reset-btn').addEventListener('click', () => {
  if (confirm('Czy na pewno chcesz dokonać resetu?')) {
    processReset()
  }
})





//   CHOOSING SHORTER OR LONGER TEST
id('choice-block').addEventListener('change', () => {
  id('next-page').dataset.show = 1
  if (localStorage.getItem('activities')) {
    localStorage.removeItem('activities')
  }
})





//   R E S E T I N G   F U N C
export function processReset() {
  localStorage.removeItem('activities')
  localStorage.removeItem('votingScores')
  localStorage.removeItem('finished')
  localStorage.removeItem('sendData')
  id('voters-post').hidden = true
  id('voting-legend').style.display = 'block'
  id('voting-title').hidden = false
  id('opt-a').hidden = false
  id('opt-b').hidden = false
  resetVoting()
  resetActivities()

  if (sectionPage !== 2) {
    id('root').dataset.section = 1
    sectionPage = 1
    formPage = 1
    formActivity = 0
    id('reset-btn').dataset.show = 0
    updateSection()
  }
}





// change theme – light/dark mode
id('theme-btn').addEventListener('click', () => {
  changeTheme()
})
function changeTheme() {
  const theme = document.documentElement.dataset.theme
  if (theme === 'dark') {
    id('d-theme').style.opacity = 0
    setTimeout(() => {id('l-theme').style.opacity = 1}, 150)
    document.documentElement.dataset.theme = 'light'
  } else {
    id('l-theme').style.opacity = 0
    setTimeout(() => {id('d-theme').style.opacity = 1}, 150)
    document.documentElement.dataset.theme = 'dark'
  }
}





// initialize
window.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('options')) {
    localStorage.setItem('options', JSON.stringify([]))
  } // INITIALIZE LOCALSTORAGE
  if (localStorage.getItem('finished')) {
    sectionPage = 7
  }

  id('gender-select').value = person.gender
  id('text-gender-select').value = person.textGender
  id('wiek').value = person.wiek
  if (options?.length === 6) {
    id('add-opt').disabled = true
  }

  initializeInputListeners()
  updateSection()

  if (window.matchMedia('(prefers-color-scheme: dark)')) {
    changeTheme()
  }
})
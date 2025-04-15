// import
import { id } from "./utility.js"

export const activitiesData = JSON.parse(localStorage.getItem('activities')) || []

export const templateData = [
  '',
  {name: 'satysfakcja', data: { sum: 0, sp: 0, se: 0 }},
  {name: 'wzmocnienia', data: { sum: 0, www: 0, wprs: 0, wpw: 0, wpwi: 0, wps: 0 }},
  {name: 'wartość', data: { sum: 0, do: 0, ds: 0, lu: 0 }},
  {name: 'autentyczność', data: { sum: 0, pps: 0, bps: 0, ae: 0 }},
  {name: 'ocena', data: { sum: 0, oon: 0, oos: 0, oow: 0 }},
  {name: 'poświęcenie', data: { sum: 0, am: 0, cl: 0, iz: 0 }},
  {name: 'dopasowanie', data: { sum: 0, dp: 0, dw: 0, dm: 0 }},
  {name: 'sensowność', data: { sum: 0, ddp: 0, sz: 0 }},
  {name: 'rozwojowość', data: { sum: 0, roz: 0 }},
  {name: 'potencjał', data: { sum: 0, pdo: 0, pds: 0 }},
  {name: 'obecność', data: { sum: 0, od: 0, on: 0, po: 0, co: 0 }},
  {name: 'flow', data: { sum: 0, eks: 0, chp: 0, sto: 0 }},
]

export function updateTestData (activityNum, formType) {
  const activity = JSON.parse(localStorage.getItem('votingScores')).map(arr => arr[0])[activityNum]
  const fieldset = id('form-fieldset')
  const fieldsetName = id('field-legend').textContent
  const range = fieldset.querySelector('.range') || false
  const rangeValue = fieldset.querySelector('.range')?.value
  const star = fieldset.querySelector('input[type=radio]:checked') || false
  const starValue = fieldset.querySelector('input[type=radio]:checked')?.value
  const fieldID = range ? range.getAttribute('name') : star ? star.getAttribute('name') : false
  const value = rangeValue ? Number(rangeValue) : Number(starValue)

  if (!activitiesData.some(act => act[0] === activity)) {
    const activityData = structuredClone(templateData)
    activityData[0] = activity
    activitiesData.push(activityData)
  }

  activitiesData.forEach(act => {
    if (act[0] === activity) {
      act.forEach(obj => {
        if (typeof obj === 'object' && obj !== null && obj.name === fieldsetName && fieldID) {
          obj.data[fieldID] = value
          obj.data.sum = Object.values(obj.data).slice(1).reduce((a, b) => a + b, 0)
        }
      })
      localStorage.setItem('activities', JSON.stringify(activitiesData))
    }
  })
}

export function resetActivities() {
  activitiesData.splice(0, activitiesData.length)
}
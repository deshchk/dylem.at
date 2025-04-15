import { id } from "./utility.js"
import { gradHtml, starHtml } from "./inputs.js"
import { formFieldsLonger, formFieldsShorter } from "./formfields.js"
import { activitiesData } from "./testOperations.js"
import { updateRange, updateStars } from "./updateInputs.js"

export function renderForm(fieldNum, activityNum, formType) {
  const field = `field${fieldNum}`
  for (const [k, value] of Object.entries((formType === 1 ? formFieldsLonger : formFieldsShorter))) {
    if (field in value) {
      id('activity-progress').style.setProperty('--percent', `${(fieldNum * 100) / (formType === 1 ? 34 : 22)}%`)
      
      id('field-legend').textContent = value.details.name
      id('field-num').innerHTML = `<b>${fieldNum}</b> / ${(formType === 1 ? '34' : '22')}`
      id('activity').textContent = JSON.parse(localStorage.getItem('votingScores'))?.map(arr => arr[0])[activityNum]

      id('form-section-pretitle').textContent = value.details.title ? value.details.title : ''
      id('form-section-pretitle').style.marginBottom = value.details.title ? '24px' : '0px'

      if (value.details.type === 'grad') {
        id('field-inside').innerHTML = gradHtml(
          value[field].id,
          value[field].title,
          value[field].a ? value[field].a : value.details.a,
          value[field].b ? value[field].b : value.details.b
        )
        activitiesData[activityNum]?.forEach(obj => {
          if (obj.name === value.details.name) {
            id('form-fieldset').querySelector('.range').value = obj.data[value[field].id]
          }
        })
        updateRange(id('form-fieldset').querySelector('.range'))

      } else {

        id('field-inside').innerHTML = starHtml(
          value[field].id,
          value[field].title
        )

        let inputID
        let inputValue

        activitiesData[activityNum].forEach(obj => {
          if (obj.name === value.details.name) {
            inputValue = obj.data[value[field].id]
            inputID = `input#${value[field].id}-${inputValue}`
            if (inputValue > 0) {
              id('form-fieldset').querySelector(inputID).checked = true
            }
          }
        })
        if (inputValue > 0) {
          updateStars(
            id('form-fieldset').querySelector(inputID).nextElementSibling,
            id('form-fieldset').querySelector('.star-block'), 'click'
          )
        }
      }
    }
  }
  RangeTouch.setup('input[type="range"]', { addCSS: false })
}
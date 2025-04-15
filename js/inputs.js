// import
import  { txtGender } from './utility.js'

export function gradHtml (id, title, a, b) {
  return `
    <section class="form-field flex-col">
      <h4 class="form-section-title">${Array.isArray(title)? txtGender(title) : title}</h4>

      <div class="range-grad-block flex-col">
        <input type="range" class="range grad" name="${id}" id="${id}" 
        min="-10" max="10" value="0" step="1">

        <ul id="${id}-opt" class="range-grad-labels">
          <li class="grad-label">${Array.isArray(a) ? txtGender(a) : a}</li>
          <li class="grad-label">${Array.isArray(b) ? txtGender(b) : b}</li>
        </ul>
      </div>
    </section>
  `
}

export function starHtml (id, title) {
  return `
    <section class="form-field flex-col">
      <h4 class="form-section-title">${title}</h4>
      
      <div class="star-block">
        ${starElement(id, true, 1)}

        ${starElement(id, false, 2)}

        ${starElement(id, true, 3)}

        ${starElement(id, false, 4)}

        ${starElement(id, true, 5)}

        ${starElement(id, false, 6)}

        ${starElement(id, true, 7)}

        ${starElement(id, false, 8)}

        ${starElement(id, true, 9)}

        ${starElement(id, false, 10)}
      </div>
    </section>
  `
}

function starElement (id, half, value) {
  return `
    <input type="radio" name="${id}" id="${id}-${value}" value="${value}">
    <label for="${id}-${value}" class="star-opt ${half ? 'half">&#xe801;' : '">&#xe800;'}</label>
  `
}
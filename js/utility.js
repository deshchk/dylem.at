// utility
export const id = DOMid => document.getElementById(DOMid)
export const q = selector => document.querySelector(selector)
export const qAll = (DOMid, classes) => id(DOMid).querySelectorAll(classes)
export const r = range => Math.floor(Math.random() * range)
export const getPair = array => array[r(array.length)]
export const getAvg = array => array.reduce((a, b) => a + b, 0) / array.length
export const txtGender = array => Number(JSON.parse(localStorage.getItem('person')).textGender) === 0 ? array[0] : array[1]
export const nbsps = el => el.replace(/(\b)([aAwWiIzZoOuU])(\s)/g, '$2\xa0')
export function quartile(arr, q) {
      arr.sort((a, b) => a - b)
      const index = (arr.length - 1) * q
      const lowerIndex = Math.floor(index)
      const fraction = index - lowerIndex;
      if (lowerIndex === arr.length - 1) {
          return arr[lowerIndex]
      } else {
          return arr[lowerIndex] + (arr[lowerIndex + 1] - arr[lowerIndex]) * fraction
      }
}
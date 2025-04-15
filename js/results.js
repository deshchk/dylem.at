// import
import { LineChart } from "./chartist.js"
import { id, q, qAll, nbsps, quartile } from "./utility.js"

// wyniki variables
const scalesEmoji = ['🎉','💪','💎','🎭','⭐️','🎖️','🧩','🤔','🌱','📈','👥','🌊']
const actColors = ['#fa8376', '#d066e3', '#dbaf00', '#349f59', '#2badca', '#6d62ff']
let wPage = 1
let wScale = 1

// Airtable
const Airtable = require('airtable')
const base = new Airtable({apiKey: 'patjmq8wv5T4fsdfc.79a6a344584029a22c8a5f8ff44790ceefeee872cfef0842bef42fbb6c12a237'}).base('appR1srMw2HcMqzbo')





// calculate results and save them in an array 'wyniki'
export function calculateResults() {
  const sD = []

  JSON.parse(localStorage.getItem('activities')).forEach(a => {
    const obj = {"fields": {}}
    obj.fields.time = new Intl.DateTimeFormat('pl-PL', {timeStyle: 'short', dateStyle: 'short'}).format(new Date())
    obj.fields.full = JSON.parse(localStorage.getItem('finished'))[1] === 1 ? true : false

    obj.fields.gender = Number(JSON.parse(localStorage.getItem('person')).gender) === 0 ? 'nb' : Number(JSON.parse(localStorage.getItem('person')).gender) === 1 ? 'k' : 'm'
    obj.fields.age = Number(JSON.parse(localStorage.getItem('person')).wiek)

    obj.fields.activity = a[0]
    obj.fields.votes = JSON.parse(localStorage.getItem('votingScores')).find(arr => arr[0] === a[0])[1]
    obj.fields.points = a.reduce((x, el) => x + (el.data ? el.data.sum : 0), 0) + (Number(obj.fields.votes) + 5)

    a.forEach(scale => {
      if (scale !== a[0]) {
        for (const x in scale.data) {
          if (x !== 'sum') {
            obj.fields[x] = scale.data[x]
          } else {
            obj.fields[scale.name] = scale.data.sum
          }
        }
      }
    })
    sD.push(obj)
  })
  localStorage.setItem('sendData', JSON.stringify(
    sD.sort((x,y) => {
      if (x.fields.points > y.fields.points)
      { return -1 } else { return 1 }
    })
  ))
}





//   C H A N G I N G    A C T I V I T Y    I N    W Y N I K I
function changeWpage(dir) {
  const sD = JSON.parse(localStorage.getItem('sendData'))

  if (dir === 'prev') {
    wPage--
    wPage === 1 && (id('w-prev-btn').disabled = true)
    wPage < sD.length && (id('w-next-btn').disabled = false)
  } else if (dir === 'next') {
    wPage++
    wPage === sD.length && (id('w-next-btn').disabled = true)
    wPage > 1 && (id('w-prev-btn').disabled = false)
  }
  if (dir) {
    qAll('w-linechart', '.ct-series').forEach(x => x.classList.remove('selected'))
    q(`.ct-series-${['a','b','c','d','e','f'][wPage-1]}`).classList.add('selected')
  }
  id('w-activity').textContent = sD[wPage-1].fields.activity
  document.body.style.setProperty('--w-color', actColors[wPage-1])
  id('w-pagination').style.setProperty('--w-points', `'(${sD[wPage-1].fields.points} pkt)'`)
}
//   WYNIKI PAGINATION
id('w-pagination').addEventListener('click', e => {
  function changeAct(dir) { changeWpage(dir); changeWscale(); renderActivityDesc() }
  if (e.target.closest('#w-prev-btn')) { changeAct('prev') }
  if (e.target.closest('#w-next-btn')) { changeAct('next') }
})




//   C H A N G I N G    S C A L E    I N    W Y N I K I 
function changeWscale(dir) {
  const sD = JSON.parse(localStorage.getItem('sendData'))
  const scaleNames = JSON.parse(localStorage.getItem('activities')).map(item => item.filter(item => typeof item === 'object').map((scale => scale.name)))[0]
  const scalesText = scaleNames.map((scale, i) => `${scalesEmoji[i]} ${scale}`)

  if (dir === 'prev') {
    wScale--
    wScale === 1 && (id('w-prev-scale-btn').disabled = true)
    wScale < scaleNames.length && (id('w-next-scale-btn').disabled = false)
  } else if (dir === 'next') {
    wScale++
    wScale === scaleNames.length && (id('w-next-scale-btn').disabled = true)
    wScale > 1 && (id('w-prev-scale-btn').disabled = false)
  }
  if (dir) {
    qAll('w-linechart', 'span.ct-label.ct-horizontal').forEach(x => x.classList.remove('selected'))
    qAll('w-linechart', 'span.ct-label.ct-horizontal')[wScale-1].classList.add('selected')
  }
  id('w-scale').textContent = scalesText[wScale-1]
  const currentScale = sD[wPage-1].fields[scaleNames[wScale-1]]
  const dividersArr = [2, 5, 3, 3, 3, 3, 3, 2, 1, 2, 4, 3]
  const scaleSumAvg = (((currentScale/dividersArr[wScale-1] + Number.EPSILON) * 100)/100).toFixed(2).replace('.00', '')
  id('w-scale-info').innerHTML = `
    <b class="mean">${scaleSumAvg}</b>/10<sub>pkt</sub>
  `
}
//   WYNIKI SCALE PAGINATION
id('w-scale-pagination').addEventListener('click', e => {
  if (e.target.closest('#w-prev-scale-btn')) { changeWscale('prev'); renderScaleDesc() }
  if (e.target.closest('#w-next-scale-btn')) { changeWscale('next'); renderScaleDesc() }
})





//   render activity description
function renderActivityDesc() {
  const sD = JSON.parse(localStorage.getItem('sendData'))

  base('main data').select({
    fields: ['points'],
  }).eachPage(res => {
    localStorage.setItem('pePoints', JSON.stringify(res.map(record => record.fields.points)))
    const pePoints = JSON.parse(localStorage.getItem('pePoints'))
    const peQuartiles = [quartile(pePoints, 0.25), quartile(pePoints, 0.75)]
    const points = sD.map(x => x.fields.points)
    const quartiles = [quartile(points, 0.25), quartile(points, 0.75)]
    const pkt = sD[wPage-1].fields.points

    id('w-description').innerHTML =`
      <p class="act-desc">
        Aktywność ta zdobyła <b>${wPage} miejsce</b> osiągając łącznie <b>${pkt}</b> punktów.
        Jest to wynik <b>${pkt > quartiles[1] ? 'wysoki' : pkt < quartiles[0] ? 'niski' : 'średni'}</b>
        względem innych Twoich aktywności i jednocześnie <b>${pkt > peQuartiles[1] ? 'wysoki' : pkt < peQuartiles[0] ? 'niski' : 'średni'}</b>
        w porównaniu z wynikami innych osób.
      </p>
    `
  })
}
//   render scale description
function renderScaleDesc() {
  const sD = JSON.parse(localStorage.getItem('sendData'))

  const scaleNames = JSON.parse(localStorage.getItem('activities')).map(item => item.filter(item => typeof item === 'object').map((scale => scale.name)))[0]
  id('w-differences').innerHTML = `
    <div id="w-diff-question">
      ${wScale === 1 ? 'Która aktywność dostarcza Ci najwięcej satysfakcji?'
      : wScale === 2 ? 'Co najsilniej pozytywnie Ciebie wzmacnia?'
      : wScale === 3 ? 'W czym dostrzegasz największą wartość?'
      : wScale === 4 ? `Co najsilniej pogłębia Twoją więź z ${+(JSON.parse(localStorage.getItem('person'))).textGender === 0 ? 'samą' : 'samym'} sobą?`
      : wScale === 5 ? 'Co wydaje się być najlepsze nie tylko z Twojej perspektywy?'
      : wScale === 6 ? `Czemu jesteś najbardziej ${+(JSON.parse(localStorage.getItem('person'))).textGender === 0 ? 'oddana' : 'oddany'}?`
      : wScale === 7 ? `Do robienia czego czujesz się najlepiej ${+(JSON.parse(localStorage.getItem('person'))).textGender === 0 ? 'dopasowana' : 'dopasowany'}?`
      : wScale === 8 ? 'Co zdaje się mieć najwięcej sensu?'
      : wScale === 9 ? 'W czym aktualnie najbardziej zauważasz swój postęp?'
      : wScale === 10 ? 'Która aktywność ma największy potencjał?'
      : wScale === 11 ? `Co najbardziej było, jest i ${+(JSON.parse(localStorage.getItem('person'))).textGender === 0 ? 'chciałabyś' : 'chciałbyś'} by pozostało w Twoim życiu?`
      : 'Co Ciebie najmocniej angażuje i ekscytuje?'}
    </div>
      <ul class="scale-ranking">
        ${[...sD].sort((x,y) => y.fields[scaleNames[wScale-1]] - x.fields[scaleNames[wScale-1]])
            .map((act, i) => `<li>
              <b style="background: color-mix(in srgb, ${actColors[sD.findIndex(a => a.fields.activity === act.fields.activity)]}, transparent 80%">${i+1}</b>
              <span style="background: color-mix(in srgb, ${actColors[sD.findIndex(a => a.fields.activity === act.fields.activity)]}, transparent 95%">${act.fields.activity}</span>
            </li>`).join('')}
      </ul>
  `
}
// render additional results
function renderAdditionalResults() {
  const sD = JSON.parse(localStorage.getItem('sendData'))

  const mwAct = [...sD]
    .map(a => [a.fields.activity, ((a.fields.satysfakcja + a.fields.autentyczność + a.fields.oow + a.fields.poświęcenie + a.fields.roz + a.fields.od + a.fields.po + a.fields.eks + a.fields.chp)/15)])
      .sort(([x,a],[y,b]) => b - a)
  const prospAct = [...sD]
    .map(a => [a.fields.activity, ((a.fields.wpwi + a.fields.ds + a.fields.oon + a.fields.oos + a.fields.ddp + a.fields.pds)/6)])
      .sort(([x,a],[y,b]) => b - a)
  const brakAct = [...sD]
    .map(a => [a.fields.activity, (((a.fields.sp*1.5) + a.fields.wzmocnienia + a.fields.do + (a.fields.autentyczność*2) + (a.fields.oow*1.5) + (a.fields.po*4) + a.fields.flow + (a.fields.roz*1.25) - (a.fields.iz*3) - (a.fields.se*1.25) - (a.fields.cl*1.25) - (a.fields.obecność*2.5)) - (a.fields.chp*2.25)/23)])
      .sort(([x,a],[y,b]) => b - a)
  const goodAct = [...sD]
    .map(a => [a.fields.activity, ((((a.fields.sp*3) + a.fields.www + (a.fields.wps*1.75) + (a.fields.do*2) + (a.fields.bps*1.5) + (a.fields.ae*1.25) + (a.fields.oow*1.5) + a.fields.dp + (a.fields.sz*1.35) + (a.fields.po*2) + (a.fields.eks*1.5) + (a.fields.chp*1.5)) - a.fields.ds - a.fields.oos - (a.fields.iz*4) - a.fields.pds)/16)-3])
      .sort(([x,a],[y,b]) => b - a)

  id('w-additional').innerHTML = `
    <span>Na podstawie uzyskanych wyników można też <u>przypuszczać</u>, że:</span>
    <ul>
      <li>
        <em class="green">${nbsps(mwAct[0][0])}</em> najsilniej <b>wewnętrznie motywuje</b> Cię do działania, a najsłabiej <em class="grey">${nbsps(mwAct[mwAct.length - 1][0])}</em>.
      </li>
      <li>
        Najbardziej <b>prospołeczną</b> z ocenionych aktywności jest <em class="green">${nbsps(prospAct[0][0])}</em>, najmniej zaś <em class="grey">${nbsps(prospAct[prospAct.length - 1][0])}</em>.
      </li>
      <li>
        <em class="green">${nbsps(brakAct[0][0])} <sup>1</sup></em> jest tym, czego najbardziej Ci w życiu <b>brakuje</b>,
        a <em class="grey">${nbsps(brakAct[brakAct.length - 1][0])} <sup>2</sup></em> tym, czego redukcja może Ci dać na to czas… 👀
        Wygląda po prostu na to, że Twoje zaangażowanie w <em class="green"><b>1</b></em>, gdy już do niego dojdzie, bardziej Ci się zwraca niż przy <em class="grey"><b>2</b></em>.
      </li>
      <li>
        ${goodAct.filter(act => act[1] > 3.5).length > 1 ? `<em class="green">${nbsps(goodAct[0][0])}</em> oraz
        <em class="green">${nbsps(goodAct[1][0])}</em> są tym, co najbardziej Cię <b>chroni przed wypaleniem</b>`
        : `<em class="green">${nbsps(goodAct[0][0])}</em> jest tym, co najbardziej Cię <b>chroni przed wypaleniem</b>`
        }${goodAct.filter(act => act[1] < 0.25).length > 1 ?
        `, natomiast <em class="grey">${nbsps(goodAct[goodAct.length - 1][0])}</em>
        i <em class="grey">${nbsps(goodAct[goodAct.length - 2][0])}</em> tym, co może najbardziej <b>wypalać</b>.`
        : goodAct.filter(act => act[1] < 0.25).length === 1 ?
        `, natomiast <em class="grey">${nbsps(goodAct[goodAct.length - 1][0])}</em> tym, co może najbardziej <b>wypalać</b>.`
        : '.'}
      </li>
    </ul>
  `
}





// render results
export function renderResults() {
  calculateResults()
  const sD = JSON.parse(localStorage.getItem('sendData'))
  const activities = JSON.parse(localStorage.getItem('activities'))
  const scaleSums = activities
    .sort((x,y) => sD.find(el => el.fields.activity === x[0]).fields.points > sD.find(el => el.fields.activity === y[0]).fields.points ? -1 : 1)
      .map(item => item.filter(item => typeof item === 'object')
        .map(({scale, data}) => Number(data.sum)))
  const dividersArr = [2, 5, 3, 3, 3, 3, 3, 2, 1, 2, 4, 3]
  const scaleSumsAvg = scaleSums.map(arr => arr.map((num, i) => Math.round((num/dividersArr[i] + Number.EPSILON) * 100)/100))

  // linechart
  const wChart = new LineChart(
    '#w-linechart',
    {
      labels: ['🎉','💪','💎','🎭','⭐️','🎖️','🧩','🤔','🌱','📈','👥','🌊'],
      series: scaleSumsAvg,
    },
    {
      high: 10,
      low: Math.min(scaleSumsAvg),
      fullWidth: true,
      axisY: {
        offset: 0,
        onlyInteger: true,
      }
    },
  )
  let now = false
  wChart.on('draw', data => {
    // console.log(sD)
    if (data.type === 'label' && data.axis.units.dir === 'vertical') {
      data.text === 0 && (now = true)
      data.element._node.style.display = 'none'
    }
    if (data.type === 'grid' && now) {
      const zeroLine = data.element._node.previousElementSibling
      zeroLine.style.setProperty('stroke-dasharray', '0')
      zeroLine.style.setProperty('stroke', '#999')
      now = false
    }
    if (data.type === 'line' && data.index === 0) {
      data.element._node.parentNode.classList.add('selected')
    }
    if (data.type === 'label' && data.axis.units.dir === 'horizontal' && data.index === 0) {
      data.element._node.children[0].classList.add('selected')
    }
  })
  renderActivityDesc()
  renderScaleDesc()
  renderAdditionalResults()
  changeWpage()
  changeWscale()
}
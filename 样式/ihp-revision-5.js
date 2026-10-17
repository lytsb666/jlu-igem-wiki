import './ihp-revision-5.css'
import data from '../assets/human-practice/revision-5-20261017/explorer-data.json'
import questionDisplay from '../assets/human-practice/revision-5-20261017/questions-display.svg'
import questionOriginal from '../assets/human-practice/revision-5-20261017/questions-original.svg'
import activityMapDisplay from '../assets/human-practice/revision-5-20261017/activity-map-display.svg'
import activityMapOriginal from '../assets/human-practice/revision-5-20261017/activity-map-original.svg'
import activityTypesDisplay from '../assets/human-practice/revision-5-20261017/activity-types-display.svg'
import activityTypesOriginal from '../assets/human-practice/revision-5-20261017/activity-types-original.svg'

const photos = import.meta.glob('../assets/human-practice/revision-5-20261017/activity-records/*.{jpeg,jpg,png}', {eager: true, query: '?url', import: 'default'})
const originals = import.meta.glob('../assets/human-practice/revision-5-20261017/requirements/image*.png', {eager: true, query: '?url', import: 'default'})
const photoUrl = file => photos[`../assets/human-practice/revision-5-20261017/activity-records/${file}`]
const records = new Map(data.records.map(record => [record.number, record]))
const hoverPointer = matchMedia('(hover: hover) and (pointer: fine)')

for (const [selector, display, original] of [
  ['.ihp-evolution-map', questionDisplay, questionOriginal],
  ['.ihp-activity-explorer', activityMapDisplay, activityMapOriginal],
  ['.ihp-activity-types', activityTypesDisplay, activityTypesOriginal],
]) {
  const root = document.querySelector(selector)
  if (!root) continue
  root.querySelector('img').src = display
  root.querySelector('[data-ihp-image]').href = original
}
for (const figure of document.querySelectorAll('[data-ihp-v5-image]')) {
  figure.querySelector('a').href = originals[`../assets/human-practice/revision-5-20261017/requirements/image${figure.dataset.ihpV5Image}.png`]
}

const explorer = document.querySelector('.ihp-activity-explorer')
if (explorer) {
  const canvas = explorer.querySelector('.ihp-activity-explorer__canvas')
  const mobile = explorer.querySelector('.ihp-activity-explorer__mobile')
  const status = explorer.querySelector('[data-ihp-activity-status]')
  const cards = new Map()
  const pointButtons = new Map()
  const place = (element, box) => {
    const {width, height} = data.geometry['activity-map']
    for (const [prop, field, total] of [['left', 'x', width], ['top', 'y', height], ['width', 'w', width], ['height', 'h', height]]) {
      element.style[prop] = `${box[field] / total * 100}%`
    }
  }

  function flip(card, showSummary) {
    card.classList.toggle('is-flipped', showSummary)
    card.setAttribute('aria-pressed', String(showSummary))
    card.querySelector('.ihp-activity-card__front').setAttribute('aria-hidden', String(showSummary))
    card.querySelector('.ihp-activity-card__back').setAttribute('aria-hidden', String(!showSummary))
  }

  function renderCard(card, record) {
    card.dataset.activityNumber = record.number
    card.setAttribute('aria-label', `Activity ${record.number}: ${record.title}. Show or hide summary`)
    const front = card.querySelector('.ihp-activity-card__front')
    front.replaceChildren()
    const photoGroup = document.createElement('div')
    photoGroup.className = 'ihp-activity-card__photos'
    for (const file of record.photos) {
      const image = document.createElement('img')
      image.src = photoUrl(file)
      image.alt = record.title
      image.loading = 'lazy'
      image.decoding = 'async'
      photoGroup.append(image)
    }
    const label = document.createElement('span')
    label.className = 'ihp-activity-card__number'
    label.textContent = String(record.number).padStart(2, '0')
    front.append(photoGroup, label)
    const back = card.querySelector('.ihp-activity-card__back')
    const heading = document.createElement('strong')
    heading.textContent = `Activity ${String(record.number).padStart(2, '0')}`
    heading.title = record.title
    back.replaceChildren(heading)
    for (const text of record.summaries) {
      const paragraph = document.createElement('p')
      paragraph.textContent = text
      back.append(paragraph)
    }
    flip(card, false)
  }

  function createCard(slot, isMobile) {
    const card = document.createElement('article')
    card.className = 'ihp-activity-card'
    card.dataset.activitySlot = slot.id
    card.id = `ihp-activity-card-${slot.id}${isMobile ? '-mobile' : ''}`
    card.tabIndex = 0
    card.setAttribute('role', 'button')
    card.setAttribute('aria-pressed', 'false')
    const inner = document.createElement('div')
    inner.className = 'ihp-activity-card__inner'
    for (const side of ['front', 'back']) {
      const face = document.createElement('div')
      face.className = `ihp-activity-card__${side}`
      inner.append(face)
    }
    card.append(inner)
    renderCard(card, records.get(slot.points.find(point => records.has(point.number)).number))
    card.addEventListener('pointerenter', event => {
      if (hoverPointer.matches && event.pointerType !== 'touch') flip(card, true)
    })
    card.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'touch') flip(card, false)
    })
    card.addEventListener('click', () => flip(card, card.getAttribute('aria-pressed') !== 'true'))
    card.addEventListener('keydown', event => {
      if (['Enter', ' '].includes(event.key)) {
        event.preventDefault()
        flip(card, card.getAttribute('aria-pressed') !== 'true')
      } else if (event.key === 'Escape') flip(card, false)
    })
    if (!cards.has(slot.id)) cards.set(slot.id, [])
    cards.get(slot.id).push(card)
    return card
  }

  function selectActivity(slot, number) {
    const record = records.get(number)
    if (!record) return
    cards.get(slot.id).forEach(card => renderCard(card, record))
    pointButtons.get(slot.id).forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.activityNumber) === number)))
    status.textContent = `Activity ${number} selected: ${record.title}`
  }

  function createPoint(slot, point, isMobile) {
    const record = records.get(point.number)
    const control = document.createElement(record ? 'button' : 'span')
    control.className = 'ihp-activity-point'
    control.textContent = point.number
    control.dataset.activityNumber = point.number
    control.style.setProperty('--ihp-point-color', point.color)
    if (record) {
      control.type = 'button'
      control.setAttribute('aria-label', `Activity ${point.number}: ${record.title}`)
      control.setAttribute('aria-controls', `ihp-activity-card-${slot.id}${isMobile ? '-mobile' : ''}`)
      const initial = slot.points.find(item => records.has(item.number)).number
      control.setAttribute('aria-pressed', String(point.number === initial))
      control.addEventListener('click', () => selectActivity(slot, point.number))
      for (const [event, highlight] of [['pointerenter', true], ['focus', true], ['pointerleave', false], ['blur', false]]) {
        control.addEventListener(event, () => cards.get(slot.id).forEach(card => card.classList.toggle('is-targeted', highlight)))
      }
      control.addEventListener('keydown', event => {
        const siblings = pointButtons.get(slot.id).filter(button => Boolean(button.closest('.ihp-activity-explorer__mobile')) === isMobile)
        const index = siblings.indexOf(control)
        const offset = {ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1}[event.key]
        if (!offset && !['Home', 'End'].includes(event.key)) return
        event.preventDefault()
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? siblings.length - 1 : (index + offset + siblings.length) % siblings.length
        siblings[next].focus()
      })
      if (!pointButtons.has(slot.id)) pointButtons.set(slot.id, [])
      pointButtons.get(slot.id).push(control)
    } else {
      // Keep the supplied numbers visible without guessing the duplicate 38 /
      // missing 39 association in the activity register.
      control.classList.add('ihp-activity-point--unmapped')
      control.setAttribute('aria-label', `Activity ${point.number}`)
    }
    return control
  }

  for (const stage of data.stages) {
    const mobileStage = document.createElement('section')
    mobileStage.className = 'ihp-activity-mobile-stage'
    const heading = document.createElement('h5')
    heading.textContent = stage.name
    mobileStage.append(heading)
    for (const slot of stage.slots) {
      const desktopCard = createCard(slot, false)
      place(desktopCard, slot.frame)
      canvas.append(desktopCard)
      const mobileSlot = document.createElement('div')
      mobileSlot.className = 'ihp-activity-mobile-slot'
      const controls = document.createElement('div')
      controls.className = 'ihp-activity-mobile-points'
      controls.setAttribute('role', 'group')
      controls.setAttribute('aria-label', `${stage.name} ${slot.side} activities`)
      const mobileCard = createCard(slot, true)
      for (const point of slot.points) {
        const desktopPoint = createPoint(slot, point, false)
        place(desktopPoint, point.box)
        canvas.append(desktopPoint)
        controls.append(createPoint(slot, point, true))
      }
      mobileSlot.append(controls, mobileCard)
      mobileStage.append(mobileSlot)
    }
    mobile.append(mobileStage)
  }
}

// The new question diagram uses the actual shape bounds. Keep each click
// aligned while nearby lazy media settle, and stop when the reader intervenes.
const questionLinks = [...document.querySelectorAll('[data-ihp-question-stage]')]
let cancelQuestionJump = () => {}
for (const link of questionLinks) {
  link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    const target = document.getElementById(link.hash.slice(1))
    if (!target) return
    event.preventDefault()
    cancelQuestionJump()
    const url = new URL(location.href)
    url.hash = link.hash
    history.pushState(null, '', url)
    document.querySelector('.ihp-evolution-map').dataset.selectedStage = link.dataset.ihpQuestionStage
    if (!target.hasAttribute('tabindex')) target.tabIndex = -1
    target.focus({preventScroll: true})
    let stopped = false
    const timers = []
    const inputEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown']
    const stop = () => {
      stopped = true
      timers.forEach(clearTimeout)
      inputEvents.forEach(type => document.removeEventListener(type, stop, true))
    }
    const align = () => {
      if (!stopped) window.scrollTo({top: target.getBoundingClientRect().top + scrollY - 100, behavior: 'instant'})
    }
    inputEvents.forEach(type => document.addEventListener(type, stop, {capture: true, passive: true}))
    align()
    for (const delay of [80, 250, 500, 850]) timers.push(setTimeout(align, delay))
    timers.push(setTimeout(stop, 1000))
    cancelQuestionJump = stop
  })
}
const diagramQuestionLinks = [...document.querySelectorAll('.ihp-question-link')]
for (const [index, link] of diagramQuestionLinks.entries()) {
  link.addEventListener('keydown', event => {
    const offset = {ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1}[event.key]
    if (!offset && !['Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 4 : (index + offset + 5) % 5
    diagramQuestionLinks[next].focus()
  })
}

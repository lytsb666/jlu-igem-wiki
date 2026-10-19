import './ihp-revision-5.css'
import './ihp-revision-7.css'
import './ihp-revision-8.css'
import './ihp-revision-10.css'
import data from '../assets/human-practice/revision-7-20261017/explorer-data.json'
import feedbackTables from '../assets/human-practice/revision-8-20261017/feedback-tables.json'
import photoDimensions from '../assets/human-practice/revision-6-20261017/activity-photo-dimensions.json'
import questionDisplay from '../assets/ihp-compatibility-20261019/five-questions.png'
import activityMapDisplay from '../assets/human-practice/revision-7-20261017/activity-map-display.svg'
import activityMapOriginal from '../assets/human-practice/revision-7-20261017/activity-map-original.svg'
import activityTypesDisplay from '../assets/human-practice/revision-5-20261017/activity-types-display.svg'
import activityTypesOriginal from '../assets/human-practice/revision-5-20261017/activity-types-original.svg'

const photos = import.meta.glob('../assets/human-practice/revision-5-20261017/activity-records/*.{jpeg,jpg,png}', {eager: true, query: '?url', import: 'default'})
const newPhotos = import.meta.glob('../assets/human-practice/revision-6-20261017/activity-records/*.{jpeg,jpg,png}', {eager: true, query: '?url', import: 'default'})
const displayPhotos = import.meta.glob('../assets/human-practice/revision-6-20261017/activity-photo-display/*.svg', {eager: true, query: '?url', import: 'default'})
const portraitBackgrounds = import.meta.glob('../assets/human-practice/revision-7-20261017/portrait-backgrounds/*.png', {eager: true, query: '?url', import: 'default'})
const portraitNumbers = new Set([4, 6, 13, 14, 18])
const portraitReferenceAspect = photoDimensions['image11.jpeg'].width / photoDimensions['image11.jpeg'].height
const originals = import.meta.glob('../assets/human-practice/revision-5-20261017/requirements/image*.png', {eager: true, query: '?url', import: 'default'})
const photoUrl = file => displayPhotos[`../assets/human-practice/revision-6-20261017/activity-photo-display/${photoDimensions[file].display}`] || newPhotos[`../assets/human-practice/revision-6-20261017/activity-records/${file}`] || photos[`../assets/human-practice/revision-5-20261017/activity-records/${file}`]
const records = new Map(data.records.map(record => [record.number, record]))
const hoverPointer = matchMedia('(hover: hover) and (pointer: fine)')

for (const [selector, display, original] of [
  ['.ihp-evolution-map', questionDisplay, questionDisplay],
  ['.ihp-activity-explorer', activityMapDisplay, activityMapOriginal],
  ['.ihp-activity-types', activityTypesDisplay, activityTypesOriginal],
]) {
  const root = document.querySelector(selector)
  if (!root) continue
  root.querySelector('img').src = display
  const originalLink = root.querySelector('[data-ihp-image]')
  if (originalLink) originalLink.href = original
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
  const slots = new Map(data.stages.flatMap(stage => stage.slots.map(slot => [slot.id, slot])))
  const initialActivity = slot => slot.points.some(point => point.number === 28)
    ? 28 : slot.points.find(point => records.has(point.number)).number
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
    // Fit the card to the complete photograph, rather than cropping faces to a
    // fixed landscape rectangle. Keep every desktop card inside its source slot.
    const photoAspect = record.photos.reduce((sum, file) => {
      const {width, height} = photoDimensions[file]
      return sum + width / height
    }, 0)
    const portrait = portraitNumbers.has(record.number)
    const aspect = portrait ? portraitReferenceAspect : photoAspect
    card.dataset.portraitStandard = String(portrait)
    card.style.setProperty('--ihp-photo-aspect', aspect)
    if (card.dataset.cardLayout === 'desktop') {
      const frame = slots.get(card.dataset.activitySlot).frame
      const width = Math.min(frame.w, frame.h * aspect)
      const height = width / aspect
      place(card, {x: frame.x + (frame.w - width) / 2, y: frame.y + (frame.h - height) / 2, w: width, h: height})
    }
    const front = card.querySelector('.ihp-activity-card__front')
    front.replaceChildren()
    const photoGroup = document.createElement('div')
    photoGroup.className = 'ihp-activity-card__photos'
    if (portrait) {
      photoGroup.classList.add('ihp-activity-card__photos--portrait')
      const background = document.createElement('img')
      background.className = 'ihp-activity-card__portrait-background'
      background.src = portraitBackgrounds[`../assets/human-practice/revision-7-20261017/portrait-backgrounds/portrait-${record.number}-background.png`]
      background.alt = ''
      background.setAttribute('aria-hidden', 'true')
      background.loading = 'lazy'
      background.decoding = 'async'
      photoGroup.append(background)
    }
    for (const file of record.photos) {
      const image = document.createElement('img')
      image.src = photoUrl(file)
      image.width = photoDimensions[file].width
      image.height = photoDimensions[file].height
      image.style.flexGrow = photoDimensions[file].width / photoDimensions[file].height / photoAspect
      image.alt = record.title
      image.loading = 'lazy'
      image.decoding = 'async'
      if (portrait) {
        const original = document.createElement('div')
        original.className = 'ihp-activity-card__portrait-original'
        const share = photoAspect / aspect
        original.style.width = `${share * 100}%`
        original.style.left = `${(1 - share) * 50}%`
        original.append(image)
        photoGroup.append(original)
      } else photoGroup.append(image)
    }
    front.append(photoGroup)
    const back = card.querySelector('.ihp-activity-card__back')
    const heading = document.createElement('strong')
    heading.textContent = record.title
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
    card.dataset.cardLayout = isMobile ? 'mobile' : 'desktop'
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
    renderCard(card, records.get(initialActivity(slot)))
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
    cards.get(slot.id).forEach(card => {
      renderCard(card, record)
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        card.animate([
          {boxShadow: '0 0 0 3px #d9a755b3', filter: 'brightness(1.06)'},
          {boxShadow: '0 0 0 0 #d9a75500', filter: 'brightness(1)'},
        ], {duration: 520, easing: 'ease-out'})
      }
    })
    pointButtons.get(slot.id).forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.activityNumber) === number)))
    status.textContent = `Activity ${number} selected: ${record.title}`
  }

  function createPoint(slot, point, isMobile) {
    const record = records.get(point.number)
    const control = document.createElement(record ? 'button' : 'span')
    control.className = 'ihp-activity-point'
    control.classList.add('ihp-activity-point--icon')
    control.dataset.activityNumber = point.number
    control.style.setProperty('--ihp-point-color', point.color)
    if (isMobile) {
      const {width, height} = data.geometry['activity-map']
      control.style.backgroundImage = `url("${activityMapDisplay}")`
      control.style.backgroundSize = `${width / point.box.w * 100}% ${height / point.box.h * 100}%`
      control.style.backgroundPosition = `${point.box.x / (width - point.box.w) * 100}% ${point.box.y / (height - point.box.h) * 100}%`
    }
    if (record) {
      control.type = 'button'
      control.setAttribute('aria-label', `Activity ${point.number}: ${record.title}`)
      control.setAttribute('aria-controls', `ihp-activity-card-${slot.id}${isMobile ? '-mobile' : ''}`)
      const label = document.createElement('span')
      label.className = 'ihp-activity-point__label'
      label.textContent = record.title
      label.setAttribute('aria-hidden', 'true')
      control.append(label)
      const initial = initialActivity(slot)
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
      // Preserve a supplied point if a future source omits its activity record.
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

  // These four module icons open the source document's exact feedback tables.
  // Keep the activity selector independent, and return focus to the same icon.
  const createFeedbackButton = (item, isMobile) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = `ihp-feedback-point${isMobile ? ' ihp-feedback-point--mobile' : ''}`
    button.dataset.ihpFeedback = item.id
    button.setAttribute('aria-label', `${item.label}: explore Human Practices feedback and improvements`)
    button.setAttribute('aria-haspopup', 'dialog')
    button.setAttribute('aria-controls', `ihp-feedback-${item.id}`)
    const label = document.createElement('span')
    label.className = 'ihp-feedback-point__label'
    label.textContent = `${item.label} · Explore feedback`
    if (isMobile) {
      const icon = document.createElement('span')
      icon.className = 'ihp-feedback-point__icon'
      icon.setAttribute('aria-hidden', 'true')
      const {width, height} = data.geometry['activity-map']
      icon.style.backgroundImage = `url("${activityMapDisplay}")`
      icon.style.backgroundSize = `${width / item.box.w * 100}% ${height / item.box.h * 100}%`
      icon.style.backgroundPosition = `${item.box.x / (width - item.box.w) * 100}% ${item.box.y / (height - item.box.h) * 100}%`
      button.append(icon)
    } else place(button, item.box)
    button.append(label)
    button.addEventListener('click', () => {
      const dialog = document.getElementById(`ihp-feedback-${item.id}`)
      dialog.showModal()
      dialog.scrollTop = 0
    })
    return button
  }
  for (const item of feedbackTables) canvas.append(createFeedbackButton(item, false))
  for (const [stageName, moduleIds] of [['BUILD', ['wet-lab', 'dry-lab']], ['ENGINEER', ['hardware', 'software']]]) {
    const stage = [...mobile.querySelectorAll('.ihp-activity-mobile-stage')]
      .find(element => element.querySelector('h5').textContent === stageName)
    const links = document.createElement('div')
    links.className = 'ihp-feedback-links'
    for (const id of moduleIds) links.append(createFeedbackButton(feedbackTables.find(item => item.id === id), true))
    stage.append(links)
  }
  for (const dialog of document.querySelectorAll('.ihp-feedback-dialog')) {
    dialog.querySelector('.ihp-feedback-dialog__close').addEventListener('click', () => dialog.close())
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect()
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close()
    })
  }
}

// Shared page navigation provides the glide and layout calibration.
const questionLinks = [...document.querySelectorAll('[data-ihp-question-stage]')]
for (const link of questionLinks) {
  link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    const target = document.getElementById(link.hash.slice(1))
    if (!target) return
    document.querySelector('.ihp-evolution-map').dataset.selectedStage = link.dataset.ihpQuestionStage
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

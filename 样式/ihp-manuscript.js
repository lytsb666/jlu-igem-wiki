import { createCarousel } from './carousel.js'
import './ihp-revision-5.js'
import './ihp-final-20261017.js'
import './ihp-revision-1018.js'
import stakeholderStrategy from '../assets/human-practice/revision-3-20261016/stakeholder-strategy.png'

// Show only the four original cards and connecting arrows. Keep the source
// artwork intact; the SVG window excludes its surrounding frame and canvas.
const strategyCanvas = document.querySelector('.ihp-strategy-diagram__canvas')
const strategyImage = strategyCanvas?.querySelector('img')
if (strategyImage) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '30 93 736 249')
  svg.setAttribute('width', '736')
  svg.setAttribute('height', '249')
  svg.setAttribute('role', 'img')
  svg.setAttribute('aria-label', strategyImage.alt)
  svg.innerHTML = `<defs><clipPath id="ihp-strategy-cards">${[31, 221, 411, 601].map(x => `<rect x="${x}" y="94" width="164" height="247" rx="12"/>`).join('')}${[198, 388, 578].map(x => `<rect x="${x}" y="200" width="21" height="27"/>`).join('')}</clipPath></defs><image href="${stakeholderStrategy}" width="796" height="448" clip-path="url(#ihp-strategy-cards)"/>`
  strategyImage.replaceWith(svg)
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
const trackButtons = [...document.querySelectorAll('[data-ihp-track]')]
const trackPanels = [...document.querySelectorAll('[data-ihp-track-panel]')]

function selectTrack(name, focus = false) {
  trackButtons.forEach(button => {
    const selected = button.dataset.ihpTrack === name
    button.setAttribute('aria-selected', String(selected))
    button.tabIndex = selected ? 0 : -1
    if (selected && focus) button.focus()
  })
  trackPanels.forEach(panel => { panel.hidden = panel.dataset.ihpTrackPanel !== name })
}
trackButtons.forEach((button, index) => {
  button.addEventListener('click', () => selectTrack(button.dataset.ihpTrack))
  button.addEventListener('keydown', event => {
    const offsets = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    if (!(event.key in offsets) && !['Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? trackButtons.length - 1 : (index + offsets[event.key] + trackButtons.length) % trackButtons.length
    selectTrack(trackButtons[next].dataset.ihpTrack, true)
  })
})

function revealTarget(target, scroll = true) {
  if (target.matches('.legacy-source-anchor')) {
    let visibleTarget = target.nextElementSibling
    while (visibleTarget?.matches('.legacy-source-anchor')) visibleTarget = visibleTarget.nextElementSibling
    if (visibleTarget) target = visibleTarget
  }
  const panel = target.closest('[data-ihp-track-panel]')
  if (panel) selectTrack(panel.dataset.ihpTrackPanel)
  const stakeholderCard = target.closest('.ihp-stakeholder-card')
  if (stakeholderCard) setStakeholderCard(stakeholderCard, true)
  for (let ancestor = target.parentElement; ancestor; ancestor = ancestor.parentElement) {
    if (ancestor.tagName === 'DETAILS') ancestor.open = true
  }
  if (target.tagName === 'DETAILS') target.open = true
  if (scroll) requestAnimationFrame(() => {
    const focusTarget = target.tagName === 'DETAILS' ? target.querySelector(':scope > summary') : target
    if (!focusTarget.matches('a, button, summary, input, [tabindex]')) focusTarget.tabIndex = -1
    focusTarget.focus({ preventScroll: true })
    target.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth' })
  })
}
function revealFragment() {
  let id
  try { id = decodeURIComponent(location.hash.slice(1)) } catch { return }
  const target = document.getElementById(id)
  if (target) revealTarget(target)
}
document.querySelectorAll('main .ihp-shell a[href^="#"], main .ihp-hero a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)))
    if (!target) return
    event.preventDefault()
    const url = new URL(location.href)
    url.hash = link.hash
    history.pushState(null, '', url)
    revealTarget(target, false)
  })
})
addEventListener('hashchange', revealFragment)
addEventListener('popstate', revealFragment)
if (location.hash) revealFragment()

function setStakeholderCard(card, expanded) {
  card.classList.toggle('is-flipped', expanded)
  const button = card.querySelector('.ihp-stakeholder-card__toggle')
  const heading = card.querySelector('h4')
  button.setAttribute('aria-expanded', String(expanded))
  button.setAttribute('aria-label', `${heading.textContent}: ${expanded ? 'show front' : 'show details'}`)
  card.querySelector('.ihp-stakeholder-card__front').setAttribute('aria-hidden', String(expanded))
  card.querySelector('.ihp-stakeholder-card__back').setAttribute('aria-hidden', String(!expanded))
}
document.querySelectorAll('.ihp-stakeholder-card').forEach(card => {
  const button = card.querySelector('.ihp-stakeholder-card__toggle')
  card.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') setStakeholderCard(card, true)
  })
  card.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' && !button.matches(':focus-visible')) setStakeholderCard(card, false)
  })
  button.addEventListener('focus', () => {
    if (button.matches(':focus-visible')) setStakeholderCard(card, true)
  })
  button.addEventListener('blur', () => {
    if (!card.matches(':hover')) setStakeholderCard(card, false)
  })
  button.addEventListener('click', event => {
    // A mouse already reveals the card on entry; retain tap and keyboard use.
    if (event.pointerType === 'mouse' && event.detail) return
    setStakeholderCard(card, button.getAttribute('aria-expanded') !== 'true')
  })
  button.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    setStakeholderCard(card, false)
  })
})

document.querySelectorAll('[data-ihp-gallery]').forEach(gallery => {
  gallery.querySelector('.ihp-gallery__controls')?.remove()
  createCarousel(gallery, { track: gallery.querySelector('.ihp-gallery__track') })
})

// Category names and people are transcribed from the supplied Word table.
const stakeholderData = document.querySelector('#ihp-stakeholder-data')
const stakeholderReader = document.querySelector('#ihp-stakeholder-reader')
if (stakeholderData && stakeholderReader) {
  const categories = JSON.parse(stakeholderData.textContent)
  const buttons = [...document.querySelectorAll('[data-stakeholder]')]
  function selectStakeholder(index) {
    const category = categories[index]
    if (!category) return
    buttons.forEach(other => other.setAttribute('aria-pressed', String(Number(other.dataset.stakeholder) === index)))
    stakeholderReader.querySelector('h4').textContent = category.label
    stakeholderReader.querySelector('ul').replaceChildren(...category.people.map(person => {
      const item = document.createElement('li')
      item.textContent = person
      return item
    }))
  }
  buttons.forEach(button => button.addEventListener('click', () => selectStakeholder(Number(button.dataset.stakeholder))))
  // Match the supplied screenshot on every fresh page load.
  selectStakeholder(5)
}

const lightbox = document.querySelector('.ihp-lightbox')
const lightboxImage = lightbox?.querySelector('img')
document.querySelectorAll('[data-ihp-image]').forEach(link => {
  link.addEventListener('click', event => {
    if (!lightbox || !lightboxImage || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return
    event.preventDefault()
    lightboxImage.src = link.href
    lightboxImage.alt = link.querySelector('img')?.alt || link.getAttribute('aria-label') || ''
    lightbox.showModal()
  })
})
lightbox?.querySelector('button')?.addEventListener('click', () => lightbox.close())
lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close() })

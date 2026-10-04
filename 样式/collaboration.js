import './main.js'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

document.querySelectorAll('[data-cl-gallery]').forEach(gallery => {
  const track = gallery.querySelector('.cl-gallery-track')
  const figures = [...track.querySelectorAll('figure')]
  const previous = gallery.querySelector('[data-gallery-prev]')
  const next = gallery.querySelector('[data-gallery-next]')
  const status = gallery.querySelector('[data-gallery-status]')

  function positionFor(figure) {
    const offset = figure.getBoundingClientRect().left - figures[0].getBoundingClientRect().left
    return Math.max(0, Math.min(offset, track.scrollWidth - track.clientWidth))
  }
  function nearestIndex() {
    return figures.reduce((best, figure, index) =>
      Math.abs(positionFor(figure) - track.scrollLeft) < best.distance
        ? {index, distance: Math.abs(positionFor(figure) - track.scrollLeft)} : best,
      {index: 0, distance: Infinity})
      .index
  }
  function update() {
    previous.disabled = track.scrollLeft <= 4
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4
    const message = track.scrollWidth <= track.clientWidth + 2
      ? `${figures.length} photos · Select a photo to enlarge.`
      : `Photo ${nearestIndex() + 1} of ${figures.length} · Select a photo to enlarge.`
    if (status.textContent !== message) status.textContent = message
  }
  function goTo(index) {
    track.scrollTo({left: positionFor(figures[index]), behavior: reducedMotion.matches ? 'auto' : 'smooth'})
  }
  function move(direction) {
    goTo(Math.max(0, Math.min(figures.length - 1, nearestIndex() + direction)))
  }
  previous.addEventListener('click', () => move(-1))
  next.addEventListener('click', () => move(1))
  track.addEventListener('scroll', update, {passive: true})
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Home') goTo(0)
    else if (event.key === 'End') goTo(figures.length - 1)
    else move(event.key === 'ArrowRight' ? 1 : -1)
  })
  new ResizeObserver(update).observe(track)
  update()
})

const dialog = document.querySelector('#cl-photo-dialog')
const dialogImage = dialog.querySelector('img')
const dialogCaption = dialog.querySelector('p')
let photoTrigger
document.querySelectorAll('[data-cl-photo]').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img')
    photoTrigger = button
    dialogImage.src = image.currentSrc || image.src
    dialogImage.alt = image.alt
    dialogCaption.textContent = button.closest('figure').querySelector('figcaption').textContent
    dialog.showModal()
  })
})
dialog.querySelector('button').addEventListener('click', () => dialog.close())
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect()
  if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close()
})
dialog.addEventListener('close', () => {
  dialogImage.removeAttribute('src')
  photoTrigger?.focus({preventScroll: true})
})

function revealHash(behavior, focus = false) {
  if (!window.location.hash) return
  let id
  try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
  const target = document.getElementById(id)
  if (!target || !target.closest('.cl-main, .cl-cover')) return
  for (let ancestor = target; ancestor; ancestor = ancestor.parentElement) {
    if (ancestor instanceof HTMLDetailsElement) ancestor.open = true
  }
  const disclosure = target.querySelector(':scope > .cl-disclosure')
  if (disclosure) disclosure.open = true
  if (focus) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({preventScroll: true})
  }
  target.scrollIntoView({block: 'start', behavior})
}
document.querySelectorAll('.cl-main a[href^="#"], .cl-cover a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (!document.getElementById(link.hash.slice(1))) return
    event.preventDefault()
    if (window.location.hash !== link.hash) history.pushState(null, '', link.hash)
    revealHash(reducedMotion.matches ? 'instant' : 'smooth', true)
  })
})
window.addEventListener('hashchange', () => revealHash('instant'))
requestAnimationFrame(() => revealHash('instant'))

const jumps = [...document.querySelectorAll('.cl-jumps a')]
const parts = jumps.map(link => document.querySelector(link.getAttribute('href')))
function trackSection() {
  const threshold = (parseFloat(getComputedStyle(parts[0]).scrollMarginTop) || 100) + 20
  const current = parts.reduce((active, part) => part.getBoundingClientRect().top <= threshold ? part : active, null)
  jumps.forEach(link => {
    if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location')
    else link.removeAttribute('aria-current')
  })
}
let framePending = false
window.addEventListener('scroll', () => {
  if (framePending) return
  framePending = true
  requestAnimationFrame(() => { framePending = false; trackSection() })
}, {passive: true})
window.addEventListener('resize', trackSection)
trackSection()

const knowledgeNodes = [...document.querySelectorAll('.cl-knowledge li')]
const knowledgeRails = [...document.querySelectorAll('.cl-knowledge-rail')]
const knowledgeChain = document.querySelector('.cl-knowledge-chain')
const knowledgeObserver = new IntersectionObserver(entries => {
  let lastReached = knowledgeNodes.reduce((last, node, index) => node.classList.contains('is-reached') ? index : last, -1)
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    lastReached = Math.max(lastReached, knowledgeNodes.indexOf(entry.target))
  })
  if (lastReached < 0) return
  knowledgeNodes.forEach((node, index) => {
    if (index > lastReached) return
    node.classList.add('is-reached')
    knowledgeRails.forEach(rail => rail.querySelectorAll('circle')[index].classList.add('is-reached'))
    knowledgeObserver.unobserve(node)
  })
  knowledgeChain.style.setProperty('--cl-chain-progress', lastReached / (knowledgeNodes.length - 1))
}, {threshold: .4})
knowledgeNodes.forEach(node => knowledgeObserver.observe(node))

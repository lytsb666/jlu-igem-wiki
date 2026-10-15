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
    revealTarget(target)
  })
})
addEventListener('hashchange', revealFragment)
addEventListener('popstate', revealFragment)
if (location.hash) revealFragment()

document.querySelectorAll('[data-ihp-gallery]').forEach(gallery => {
  const track = gallery.querySelector('.ihp-gallery__track')
  const slides = [...track.children]
  const previous = gallery.querySelector('[data-gallery-prev]')
  const next = gallery.querySelector('[data-gallery-next]')
  const position = gallery.querySelector('[data-gallery-position]')
  const currentIndex = () => Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / (slides[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap)))))
  function update() {
    const index = currentIndex()
    position.textContent = `${index + 1} / ${slides.length}`
    previous.disabled = index === 0
    next.disabled = index === slides.length - 1
  }
  function move(offset) {
    const index = Math.max(0, Math.min(slides.length - 1, currentIndex() + offset))
    track.scrollTo({ left: slides[index].offsetLeft, behavior: reducedMotion.matches ? 'instant' : 'smooth' })
  }
  previous.addEventListener('click', () => move(-1))
  next.addEventListener('click', () => move(1))
  track.addEventListener('scroll', update, { passive: true })
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    move(event.key === 'ArrowLeft' ? -1 : 1)
  })
  addEventListener('resize', update, { passive: true })
  update()
})

const lightbox = document.querySelector('.ihp-lightbox')
const lightboxImage = lightbox?.querySelector('img')
document.querySelectorAll('[data-ihp-image]').forEach(link => {
  link.addEventListener('click', event => {
    if (!lightbox || !lightboxImage || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return
    event.preventDefault()
    lightboxImage.src = link.href
    lightboxImage.alt = link.querySelector('img')?.alt || ''
    lightbox.showModal()
  })
})
lightbox?.querySelector('button')?.addEventListener('click', () => lightbox.close())
lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close() })

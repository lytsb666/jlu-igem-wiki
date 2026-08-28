const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const revealItems = document.querySelectorAll('.reveal')
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'))
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.15 })
  revealItems.forEach((item) => revealObserver.observe(item))
}

const toc = document.querySelector('.ihp-toc')
const tocLinks = [...document.querySelectorAll('.ihp-toc a')]
const observedSections = [...document.querySelectorAll('[data-section][id]')]
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (!visible) return
    tocLinks.forEach((link) => {
      link.classList.toggle('is-active', link.hash === `#${visible.target.id}`)
    })
  }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, .1, .35] })
  observedSections.forEach((section) => sectionObserver.observe(section))
}

function updateReadingProgress() {
  if (!toc) return
  const root = document.documentElement
  const scrollable = Math.max(1, root.scrollHeight - window.innerHeight)
  const progress = Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
  toc.style.setProperty('--progress', `${progress}%`)
}
updateReadingProgress()
window.addEventListener('scroll', updateReadingProgress, { passive: true })

const stakeholderMap = document.querySelector('.stakeholder-map')
function activateTier(tier) {
  if (stakeholderMap) stakeholderMap.dataset.activeTier = tier
}

function scrollToTarget(id) {
  const target = document.getElementById(id)
  if (!target) return
  if (target.tagName === 'DETAILS') target.open = true
  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
}

document.querySelectorAll('.stakeholder-node').forEach((button) => {
  button.addEventListener('mouseenter', () => activateTier(button.dataset.tier))
  button.addEventListener('focus', () => activateTier(button.dataset.tier))
  button.addEventListener('click', () => {
    activateTier(button.dataset.tier)
    scrollToTarget(button.dataset.target)
  })
})

document.querySelectorAll('[data-tier-link]').forEach((button) => {
  button.addEventListener('mouseenter', () => activateTier(button.dataset.tierLink))
  button.addEventListener('focus', () => activateTier(button.dataset.tierLink))
  button.addEventListener('click', () => {
    activateTier(button.dataset.tierLink)
    scrollToTarget(button.dataset.target)
  })
})

const trackButtons = [...document.querySelectorAll('[data-track]')]
const trackPanels = [...document.querySelectorAll('[data-track-panel]')]
function selectTrack(name, focus = false) {
  trackButtons.forEach((button) => {
    const selected = button.dataset.track === name
    button.setAttribute('aria-selected', String(selected))
    button.tabIndex = selected ? 0 : -1
    if (selected && focus) button.focus()
  })
  trackPanels.forEach((panel) => {
    const selected = panel.dataset.trackPanel === name
    panel.hidden = !selected
    panel.classList.toggle('is-active', selected)
  })
}

trackButtons.forEach((button, index) => {
  button.addEventListener('click', () => selectTrack(button.dataset.track))
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    const offset = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1
    const next = (index + offset + trackButtons.length) % trackButtons.length
    selectTrack(trackButtons[next].dataset.track, true)
  })
})

const lightbox = document.querySelector('.ihp-lightbox')
const lightboxImage = lightbox?.querySelector('img')
const lightboxClose = lightbox?.querySelector('button')
document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img')
    if (!lightbox || !lightboxImage || !image) return
    lightboxImage.src = image.currentSrc || image.src
    lightboxImage.alt = image.alt
    lightbox.showModal()
  })
})
lightboxClose?.addEventListener('click', () => lightbox.close())
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close()
})

activateTier('core')

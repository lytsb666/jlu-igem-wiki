const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const revealItems = document.querySelectorAll('.reveal')
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'))
} else {
  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      revealObserver.unobserve(entry.target)
    })
  }, { threshold: 0.12 })
  revealItems.forEach((item) => observer.observe(item))
}

const toc = document.querySelector('.ihp-toc')
const tocLinks = [...document.querySelectorAll('.ihp-toc a')]
const observedSections = [...document.querySelectorAll('[data-section][id], .stakeholder-part[id], .ethics[id]')]

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (!current) return
    tocLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${current.target.id}`))
  }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, 0.1, 0.4] })
  observedSections.forEach((section) => sectionObserver.observe(section))
}

function updateProgress() {
  if (!toc) return
  const page = document.documentElement
  const height = Math.max(1, page.scrollHeight - window.innerHeight)
  toc.style.setProperty('--progress', `${Math.min(100, Math.max(0, window.scrollY / height * 100))}%`)
}

updateProgress()
window.addEventListener('scroll', updateProgress, { passive: true })

const lightbox = document.querySelector('.ihp-lightbox')
const lightboxImage = lightbox?.querySelector('img')
document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    const source = button.querySelector('img')
    if (!lightbox || !lightboxImage || !source) return
    lightboxImage.src = source.currentSrc || source.src
    lightboxImage.alt = source.alt
    lightbox.showModal()
  })
})

lightbox?.querySelector('button')?.addEventListener('click', () => lightbox.close())
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close()
})

document.querySelectorAll('.map-links a').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.hash)
    if (!target) return
    target.classList.remove('is-map-target')
    window.requestAnimationFrame(() => target.classList.add('is-map-target'))
  })
})

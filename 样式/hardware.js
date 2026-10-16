import { enhanceSectionNavigation } from './instrument-navigation.js'
import { createCarousel } from './carousel.js'

const root = document.querySelector('.hardware-page .hw-main')
if (root) {
  for (const link of root.querySelectorAll('[data-hw-fullimage]')) {
    const image = link.querySelector('img')
    if (!image) continue
    const sync = () => { link.href = image.currentSrc || image.src }
    image.addEventListener('load', sync)
    sync()
  }
  enhanceSectionNavigation(root, '.hw-directory nav a[href^="#"]')

  const carousel = root.querySelector('.hw-results-carousel')
  if (carousel) {
    const track = carousel.querySelector('.hw-results-track')
    carousel.querySelector('.hw-results-controls').remove()
    track.setAttribute('aria-label', 'Pathogen figures')
    createCarousel(carousel, { track })
  }
}

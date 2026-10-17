import { enhanceSectionNavigation } from './instrument-navigation.js'
import { createCarousel } from './carousel.js'
import cropWindows from '../assets/hardware/crop-windows-20261016.json'

const root = document.querySelector('.hardware-page .hw-main')
if (root) {
  for (const image of root.querySelectorAll('img[data-hw-crop]')) {
    const crop = cropWindows[image.dataset.hwCrop]
    if (!crop) continue
    const [x, y, width, height] = crop.window
    const frame = document.createElement('span')
    frame.className = 'hw-crop-window'
    frame.style.setProperty('--hw-crop-ratio', width / height)
    frame.style.setProperty('--hw-crop-source-width', `${crop.sourceSize[0] / width * 100}%`)
    frame.style.setProperty('--hw-crop-left', `${-x / width * 100}%`)
    frame.style.setProperty('--hw-crop-top', `${-y / height * 100}%`)
    image.before(frame)
    frame.append(image)
  }
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

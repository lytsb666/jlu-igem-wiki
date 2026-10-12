import { enhanceSectionNavigation } from './instrument-navigation.js'

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
}

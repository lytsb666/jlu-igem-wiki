import { enhanceSectionNavigation } from './instrument-navigation.js'
// Enhancements are scoped to Software. The six chapters remain readable without JS.
const softwareRoot = document.querySelector('.software-page .sw-main')
if (softwareRoot) {
  // Match original-image links to Vite's emitted URLs in production.
  for (const link of softwareRoot.querySelectorAll('[data-sw-fullimage]')) {
    const image = link.querySelector('img')
    if (!image) continue
    const sync = () => { link.href = image.currentSrc || image.src }
    image.addEventListener('load', sync)
    sync()
  }

  const illustration = softwareRoot.querySelector('[data-sw-float]')
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')

  function updateMotion() {
    if (!illustration) return
    illustration.classList.toggle('is-paused', motionPreference.matches || document.hidden)
  }
  motionPreference.addEventListener('change', updateMotion)
  document.addEventListener('visibilitychange', updateMotion)
  updateMotion()

  enhanceSectionNavigation(softwareRoot, '.sw-toc ol a[href^="#"]')
}

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
  const pauseButton = illustration?.querySelector('[data-sw-float-pause]')
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  let paused = false

  function updateMotion() {
    if (!illustration || !pauseButton) return
    illustration.classList.toggle('is-paused', paused || document.hidden)
    pauseButton.hidden = motionPreference.matches
    pauseButton.setAttribute('aria-pressed', String(paused))
    pauseButton.textContent = paused ? 'Resume' : 'Pause'
    pauseButton.setAttribute('aria-label', paused ? 'Resume floating illustration' : 'Pause floating illustration')
  }
  pauseButton?.addEventListener('click', () => { paused = !paused; updateMotion() })
  motionPreference.addEventListener('change', updateMotion)
  document.addEventListener('visibilitychange', updateMotion)
  updateMotion()

  enhanceSectionNavigation(softwareRoot, '.sw-toc ol a[href^="#"]')
}

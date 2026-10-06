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

  const animation = softwareRoot.querySelector('[data-sw-animation]')
  const pauseButton = animation?.querySelector('[data-sw-pause]')
  const staticButton = animation?.querySelector('[data-sw-static]')
  const stages = [...(animation?.querySelectorAll('.sw-animation-steps li') || [])]
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  let animationTimer = null
  let stage = 0
  let paused = false
  let manualStatic = false

  function markStage() {
    stages.forEach((item, index) => item.classList.toggle('is-current', index === stage))
    if (animation) animation.dataset.stage = String(stage)
  }
  function stopTimer() {
    if (animationTimer !== null) window.clearInterval(animationTimer)
    animationTimer = null
  }
  function updateMotion() {
    stopTimer()
    if (!animation || !pauseButton) return
    const reduced = motionPreference.matches || manualStatic
    animation.classList.toggle('is-static', reduced)
    if (staticButton) {
      staticButton.hidden = motionPreference.matches
      staticButton.setAttribute('aria-pressed', String(manualStatic))
      staticButton.textContent = manualStatic ? 'Play workflow' : 'Show static diagram'
    }
    animation.classList.toggle('is-paused', paused && !reduced)
    pauseButton.hidden = reduced
    pauseButton.setAttribute('aria-pressed', String(paused))
    pauseButton.textContent = paused ? 'Resume animation' : 'Pause animation'
    stages.forEach((item) => item.classList.remove('is-current'))
    if (reduced) return
    markStage()
    if (!paused && !document.hidden) {
      animationTimer = window.setInterval(() => { stage = (stage + 1) % 5; markStage() }, 1600)
    }
  }
  pauseButton?.addEventListener('click', () => { paused = !paused; updateMotion() })
  staticButton?.addEventListener('click', () => { manualStatic = !manualStatic; if (!manualStatic) paused = false; stage = 0; updateMotion() })
  motionPreference.addEventListener('change', updateMotion)
  document.addEventListener('visibilitychange', updateMotion)
  updateMotion()

  enhanceSectionNavigation(softwareRoot, '.sw-toc ol a[href^="#"]')
  window.addEventListener('pagehide', stopTimer)
}

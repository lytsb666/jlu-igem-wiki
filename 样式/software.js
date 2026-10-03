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
  const originalConnection = softwareRoot.querySelector('[data-sw-connection-original]')
  if (originalConnection) originalConnection.href = new URL('../assets/software/originals/doc1-image5.jpeg', import.meta.url).href

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

  const tocLinks = [...softwareRoot.querySelectorAll('.sw-toc a[href^="#software-"]')]
  const sections = [...softwareRoot.querySelectorAll('.sw-section[id]')]
  const visible = new Map()
  function markSection(id) {
    for (const link of tocLinks) {
      if (link.getAttribute('href') === '#' + id) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    }
  }
  tocLinks.forEach((link) => link.addEventListener('click', () => markSection(link.hash.slice(1))))
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting))
      const firstVisible = sections.find((section) => visible.get(section.id))
      if (firstVisible) markSection(firstVisible.id)
    }, { rootMargin: '-150px 0px -55% 0px', threshold: 0 })
    sections.forEach((section) => observer.observe(section))
  }
  if (sections.some((section) => '#' + section.id === window.location.hash)) {
    markSection(window.location.hash.slice(1))
  }
  window.addEventListener('pagehide', stopTimer)
}

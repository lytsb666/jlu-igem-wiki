// Continuous manuscript; equipment and reagents keep their disclosures.
const directoryLinks = [...document.querySelectorAll('[data-protocol-link]')]
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

function scrollToProtocol(target, { smooth = true, block = 'start' } = {}) {
  requestAnimationFrame(() => {
    const rect = target.getBoundingClientRect()
    const offset = block === 'center'
      ? (window.innerHeight - rect.height) / 2
      : parseFloat(getComputedStyle(target).scrollMarginTop) || 90
    // Apply one offset: scrollIntoView would add the shared root padding to
    // the section margin and leave an unnecessarily large blank gap.
    window.scrollTo({
      top: Math.max(0, window.scrollY + rect.top - offset),
      behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant',
    })
  })
}

function markDirectory(id) {
  directoryLinks.forEach((link) => {
    const active = link.hash === `#${id}`
    link.classList.toggle('is-active', active)
    if (active) link.setAttribute('aria-current', 'location')
    else link.removeAttribute('aria-current')
  })
}

function revealFragment(smooth = true) {
  let id
  try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
  const target = document.getElementById(id)
  if (!target) return
  const panel = target.closest('.protocol-panel')
  for (let ancestor = target.parentElement; ancestor; ancestor = ancestor.parentElement) {
    if (ancestor.tagName === 'DETAILS') ancestor.open = true
  }
  markDirectory(panel?.id || target.id)
  if (smooth) {
    const focusTarget = target.matches('.protocol-panel') ? target.querySelector('.protocol-panel-header h3') : target
    focusTarget.setAttribute('tabindex', '-1')
    focusTarget.focus({ preventScroll: true })
  }
  scrollToProtocol(target, { smooth })
}

directoryLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return
    event.preventDefault()
    window.history.pushState(null, '', link.hash)
    revealFragment()
  })
})
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.find(entry => entry.isIntersecting)
    if (visible) markDirectory(visible.target.id)
  }, { rootMargin: '-90px 0px -60% 0px' })
  directoryLinks.forEach(link => {
    const target = document.getElementById(link.hash.slice(1))
    if (target) observer.observe(target)
  })
}
window.addEventListener('hashchange', () => revealFragment())
window.addEventListener('popstate', () => revealFragment())
revealFragment(false)

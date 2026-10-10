// Dedicated to the Software and Model pages. No global navigation is changed.
export function enhanceSectionNavigation(root, selector) {
  const links = [...root.querySelectorAll(selector)]
  const targets = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean)
  if (!targets.length) return
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let destination = null
  let settleTimer = null
  let animationFrame = null

  function mark(id) {
    let selected = links.find(link => link.hash === '#' + id)
    // Model hides subsection links in its mobile TOC; highlight their chapter.
    if (selected?.getClientRects && selected.getClientRects().length === 0) {
      selected = selected.closest('.wiki-toc-group, nav > div')?.querySelector(':scope > a') || selected
    }
    for (const link of links) {
      const active = link === selected
      link.classList.toggle('is-active', active)
      if (active) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    }
  }
  function updateFromScroll() {
    animationFrame = null
    if (destination) return
    const margin = parseFloat(getComputedStyle(targets[0]).scrollMarginTop) || 0
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
    const offset = margin + padding || 100
    let current = targets[0]
    for (const target of targets) {
      if (target.getBoundingClientRect().top <= offset + 24) current = target
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = targets.at(-1)
    mark(current.id)
  }
  function settle() {
    window.clearTimeout(settleTimer)
    settleTimer = null
    destination = null
    updateFromScroll()
  }
  function queueScroll() {
    if (destination) {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(settle, 160)
    } else if (animationFrame === null) {
      animationFrame = window.requestAnimationFrame(updateFromScroll)
    }
  }
  root.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]')
    if (!link || !root.contains(link) || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download')) return
    const target = document.getElementById(link.hash.slice(1))
    if (!target) return
    event.preventDefault()
    for (let ancestor = target.parentElement; ancestor && ancestor !== root; ancestor = ancestor.parentElement) {
      if (ancestor.tagName === 'DETAILS') ancestor.open = true
    }
    window.clearTimeout(settleTimer)
    destination = target
    mark(target.id)
    if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash)
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' })
    // Covers clicks to an already aligned destination, which generate no scroll.
    settleTimer = window.setTimeout(settle, 240)
  })
  window.addEventListener('scroll', queueScroll, { passive: true })
  window.addEventListener('scrollend', settle)
  window.addEventListener('resize', queueScroll, { passive: true })
  window.addEventListener('popstate', () => { destination = null; queueScroll() })
  for (const eventName of ['wheel', 'touchstart']) {
    window.addEventListener(eventName, () => { if (destination) settle() }, { passive: true })
  }
  window.addEventListener('keydown', event => {
    if (destination && ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) settle()
  })
  window.addEventListener('pagehide', () => {
    window.clearTimeout(settleTimer)
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
  })
  if (targets.some(target => '#' + target.id === window.location.hash)) mark(window.location.hash.slice(1))
  else updateFromScroll()
}

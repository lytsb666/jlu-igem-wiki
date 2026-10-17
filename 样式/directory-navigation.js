// Directory clicks share one final alignment after page-specific handlers have
// revealed their tabs and disclosures. Recalculate while nearby lazy media or
// the mobile directory changes height; do not leave a stale scroll destination.
let activeJump = null

export function activeDirectoryLink(toc) {
  return activeJump?.toc === toc ? activeJump.link : null
}

function visibleAnchor(target) {
  if (!target.matches('.legacy-source-anchor, .model-anchor-alias, .parts-anchor-alias')) return target
  let next = target.nextElementSibling
  while (next?.matches('.legacy-source-anchor, .model-anchor-alias, .parts-anchor-alias')) next = next.nextElementSibling
  return next || target
}

function reveal(target) {
  for (let ancestor = target; ancestor; ancestor = ancestor.parentElement) {
    if (ancestor.tagName === 'DETAILS') ancestor.open = true
    if (ancestor.matches('.collapsible-section:not(.is-open)')) {
      ancestor.querySelector(':scope > [data-collapsible="true"][aria-expanded="false"]')?.click()
    }
  }
}

function navigate(link, target, toc) {
  activeJump?.cancel()
  reveal(target)
  target = visibleAnchor(target)
  reveal(target)
  const started = performance.now()
  const images = [...document.querySelectorAll('main img')]
  let frame = 0, lastPosition = null, stableSince = started
  const inputs = ['wheel', 'touchstart', 'pointerdown', 'keydown']
  const cancel = () => {
    cancelAnimationFrame(frame)
    inputs.forEach(type => window.removeEventListener(type, cancel))
    activeJump = null
    window.dispatchEvent(new Event('wiki:directory-settled'))
  }
  activeJump = { link, toc, cancel }
  inputs.forEach(type => window.addEventListener(type, cancel, { passive: true }))
  if (!target.matches('a,button,summary,input,[tabindex]')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
  const align = now => {
    const position = scrollY + target.getBoundingClientRect().top
    if (lastPosition === null || Math.abs(position - lastPosition) > .5) {
      lastPosition = position
      stableSince = now
    }
    // Apply one offset; scrollIntoView adds root scroll-padding to the margin.
    const offset = Math.max(88, parseFloat(getComputedStyle(target).scrollMarginTop) || 0)
    const destination = Math.max(0, Math.min(position - offset, document.scrollingElement.scrollHeight - innerHeight))
    window.scrollTo({ top: destination, behavior: 'instant' })
    const elapsed = now - started
    if (elapsed >= 600 && now - stableSince >= 200) {
      const pending = images.some(image => {
        if (image.complete || !image.getClientRects().length) return false
        const box = image.getBoundingClientRect()
        return box.top < offset && box.bottom > -innerHeight * 3
      })
      if (!pending || elapsed >= 4000) { cancel(); return }
    }
    if (elapsed >= 4000) { cancel(); return }
    frame = requestAnimationFrame(align)
  }
  // Runs after the page's own click/reveal callbacks and cancels their older
  // smooth-scroll destination without scrolling the directory's inner panel.
  frame = requestAnimationFrame(align)
}

document.addEventListener('click', event => {
  const link = event.target.closest?.('.wiki-directory a[href], .team-jumps a[href]')
  if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || link.hasAttribute('download')) return
  const url = new URL(link.href, location.href)
  if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return
  let id
  try { id = decodeURIComponent(url.hash.slice(1)) } catch { return }
  const target = document.getElementById(id)
  if (!target) return
  event.preventDefault()
  if (location.hash !== url.hash) history.pushState(null, '', url)
  navigate(link, target, link.closest('.wiki-directory, .team-jumps'))
})
window.addEventListener('pagehide', () => activeJump?.cancel())

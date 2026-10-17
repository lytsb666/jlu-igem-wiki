// Same-page links share an animated alignment after page-specific handlers
// reveal tabs and disclosures. Retarget smoothly while lazy media settle.
let activeJump = null
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')

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
  const module = target.closest('[data-model-module][hidden]')
  if (module) {
    const address = location.href
    document.querySelector(`.model-module-tab[aria-controls="${CSS.escape(module.id)}"]`)?.click()
    if (location.href !== address) history.replaceState(null, '', address)
  }
  const track = target.closest('[data-ihp-track-panel][hidden]')
  if (track) document.querySelector(`[data-ihp-track="${CSS.escape(track.dataset.ihpTrackPanel)}"]`)?.click()
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
  const initialPosition = scrollY
  const images = [...document.querySelectorAll('main img')]
  let frame = 0, lastPosition = null, stableSince = started
  let segment = null
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
    if (!segment) {
      const distance = Math.abs(destination - initialPosition)
      segment = { from: initialPosition, to: destination, start: now, duration: Math.min(1050, Math.max(420, 360 + Math.sqrt(distance) * 4)) }
    } else if (Math.abs(destination - segment.to) > 1 && now - started < 4000) {
      const remaining = segment.start + segment.duration - now
      segment = { from: scrollY, to: destination, start: now, duration: Math.min(500, Math.max(180, remaining)) }
    }
    const progress = reducedMotion.matches ? 1 : Math.min(1, (now - segment.start) / segment.duration)
    const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
    // Individual frames are immediate; the eased frame positions form one
    // continuous glide and cancel competing native scroll destinations.
    window.scrollTo({ top: segment.from + (segment.to - segment.from) * eased, behavior: 'instant' })
    const elapsed = now - started
    if (progress === 1 && elapsed >= 600 && now - stableSince >= 200) {
      const pending = images.some(image => {
        if (image.complete || !image.getClientRects().length) return false
        const box = image.getBoundingClientRect()
        return box.top < offset && box.bottom > -innerHeight * 3
      })
      if (!pending || elapsed >= 4000) { cancel(); return }
    }
    if (elapsed >= 4000 && progress === 1) { cancel(); return }
    frame = requestAnimationFrame(align)
  }
  // Run after page-specific reveal callbacks, without moving the inner TOC.
  frame = requestAnimationFrame(align)
}

document.addEventListener('click', event => {
  const link = event.target.closest?.('a[href]')
  if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
  const url = new URL(link.href, location.href)
  const pagePath = path => path.replace(/(?:\/index)?\.html$/i, '').replace(/\/$/, '')
  if (url.origin !== location.origin || pagePath(url.pathname) !== pagePath(location.pathname) || url.search !== location.search || !url.hash) return
  let id
  try { id = decodeURIComponent(url.hash.slice(1)) } catch { return }
  const target = document.getElementById(id) || document.getElementsByName(id)[0]
  if (!target) return
  event.preventDefault()
  if (location.hash !== url.hash) history.pushState(null, '', url)
  navigate(link, target, link.closest('.wiki-directory, .team-jumps'))
})
window.addEventListener('pagehide', () => activeJump?.cancel())

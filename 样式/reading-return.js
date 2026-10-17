import './reading-return.css'

const reduced = matchMedia('(prefers-reduced-motion: reduce)')
const control = document.createElement('button')
control.type = 'button'
control.className = 'wiki-reading-return'
control.hidden = true
control.title = 'Back to where you were'
control.setAttribute('aria-label', 'Back to where you were')
control.innerHTML = '<span aria-hidden="true">↶</span><span>Back</span>'
if (document.body) document.body.append(control)
else document.addEventListener('DOMContentLoaded', () => document.body.append(control), { once: true })

let active = null, positionFrame = 0, returnFrame = 0, stopReturn = null, restoring = false
const inputs = ['wheel', 'touchstart', 'pointerdown', 'keydown']
const pagePath = path => path.replace(/(?:\/index)?\.html$/i, '').replace(/\/$/, '')

function readingSpot() {
  const article = document.querySelector('.ihp-content, .entre-content-flow, .article-flow, .edu-content, .sw-content, main')
  const box = article?.getBoundingClientRect()
  const x = box ? Math.min(innerWidth - 1, Math.max(1, box.left + box.width * .5)) : innerWidth * .65
  const node = document.elementFromPoint(x, Math.min(160, innerHeight / 3))
  const element = node?.closest('.ihp-walking-story') || node?.closest('main p, main figure, main h2, main h3, main h4, main li')
  return {
    y: scrollY, url: location.href, element, top: element?.getBoundingClientRect().top,
    link: document.activeElement,
    model: document.querySelector('.model-module-tab[aria-selected="true"]'),
    track: document.querySelector('[data-ihp-track][aria-selected="true"]'),
  }
}

function dismiss() {
  active?.slot?.remove()
  active = null
  control.hidden = true
}

function destinationBlock(target) {
  while (target.matches('.legacy-source-anchor, .model-anchor-alias, .parts-anchor-alias') && target.nextElementSibling) target = target.nextElementSibling
  if (target.matches('h1,h2,h3,h4,h5,h6,p,li,summary,figcaption')) return target
  return target.querySelector('h1,h2,h3,h4,summary')
    || [...target.querySelectorAll('p')].find(p => p.getClientRects().length)
    || target.closest('p,li,figure') || target
}

function overlapsText(element, area) {
  const range = document.createRange()
  range.selectNodeContents(element)
  return [...range.getClientRects()].some(r => r.width && r.height && r.left < area.right && r.right > area.left && r.top < area.bottom && r.bottom > area.top)
}

function position() {
  positionFrame = 0
  if (!active) return
  const block = destinationBlock(active.target)
  const box = block.getBoundingClientRect()
  const visibleBox = active.slot?.getBoundingClientRect() || box
  if (!box.width || block.closest('[hidden]')) { control.hidden = true; return }
  if (!active.ready || visibleBox.bottom < 76 || visibleBox.top > innerHeight) {
    control.hidden = true
    if (active.shown) dismiss()
    return
  }
  let left, top
  if (active.slot) {
    const row = active.slot.getBoundingClientRect()
    left = Math.min(innerWidth - 88, row.right - 82)
    top = row.top + 2
  } else {
    const style = getComputedStyle(block)
    left = box.right - (parseFloat(style.paddingRight) || 0) - 82
    top = box.top + Math.max(0, Math.min(14, (box.height - 36) / 2))
    const candidate = { left: left - 10, right: left + 82, top, bottom: top + 36 }
    if (left < 8 || overlapsText(block, candidate)) {
      // Prefer a true outside gutter; narrow pages get a reserved row so the
      // control never obscures prose, figures, directory entries or buttons.
      if (innerWidth - box.right >= 98) left = box.right + 8
      else {
        const row = document.createElement('div')
        row.className = 'wiki-return-slot'
        row.setAttribute('aria-hidden', 'true')
        const host = block.parentElement?.tagName === 'HEADER' ? block.parentElement : block
        if (host.tagName === 'LI') host.append(row)
        else host.after(row)
        active.slot = row
        schedulePosition()
        return
      }
    }
  }
  if (active.shown && (top + 36 < 76 || top > innerHeight)) { dismiss(); return }
  control.style.left = `${Math.max(8, left)}px`
  control.style.top = `${top}px`
  control.hidden = Boolean(document.fullscreenElement || document.querySelector('dialog[open]'))
  active.shown = !control.hidden
}
function schedulePosition() { if (!positionFrame) positionFrame = requestAnimationFrame(position) }

document.addEventListener('click', event => {
  if (restoring) return
  const link = event.target.closest?.('a[href]')
  if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
  let url, target
  try {
    url = new URL(link.href, location.href)
    if (url.origin !== location.origin || pagePath(url.pathname) !== pagePath(location.pathname) || url.search !== location.search || !url.hash) return
    target = document.getElementById(decodeURIComponent(url.hash.slice(1))) || document.getElementsByName(decodeURIComponent(url.hash.slice(1)))[0]
  } catch { return }
  if (!target) return
  stopReturn?.()
  const previous = readingSpot()
  dismiss()
  active = { target, previous, ready: false, shown: false, slot: null }
  const jump = active
  // Shared navigation signals settlement; this also covers page-owned links.
  setTimeout(() => { if (active === jump) { active.ready = true; schedulePosition() } }, reduced.matches ? 80 : 1200)
}, { capture: true })

addEventListener('wiki:directory-settled', () => { if (active) { active.ready = true; schedulePosition() } })
control.addEventListener('click', event => {
  event.preventDefault()
  event.stopPropagation()
  if (!active) return
  const previous = active.previous
  dismiss()
  restoring = true
  if (previous.model?.getAttribute('aria-selected') !== 'true') previous.model?.click()
  if (previous.track?.getAttribute('aria-selected') !== 'true') previous.track?.click()
  history.replaceState(null, '', previous.url)
  previous.link?.focus?.({ preventScroll: true })
  restoring = false
  const started = performance.now(), initialY = scrollY
  let stable = 0
  const cancel = () => {
    cancelAnimationFrame(returnFrame)
    inputs.forEach(type => removeEventListener(type, cancel, true))
    stopReturn = null
  }
  stopReturn = cancel
  inputs.forEach(type => addEventListener(type, cancel, { capture: true, passive: true }))
  const restore = now => {
    const destination = previous.element?.isConnected ? scrollY + previous.element.getBoundingClientRect().top - previous.top : previous.y
    const progress = reduced.matches ? 1 : Math.min(1, (now - started) / 450)
    scrollTo({ top: initialY + (destination - initialY) * (1 - (1 - progress) ** 3), behavior: 'instant' })
    stable = progress === 1 && Math.abs(scrollY - destination) < 2 ? stable + 1 : 0
    if ((now - started > 650 && stable >= 6) || now - started > 1600) cancel()
    else returnFrame = requestAnimationFrame(restore)
  }
  returnFrame = requestAnimationFrame(restore)
})
addEventListener('scroll', schedulePosition, { passive: true })
addEventListener('resize', schedulePosition, { passive: true })
document.addEventListener('toggle', schedulePosition, true)
document.addEventListener('load', schedulePosition, true)
document.addEventListener('close', schedulePosition, true)
document.addEventListener('fullscreenchange', schedulePosition)
if (document.body) new ResizeObserver(schedulePosition).observe(document.body)
addEventListener('pagehide', () => { stopReturn?.(); cancelAnimationFrame(positionFrame); dismiss() })

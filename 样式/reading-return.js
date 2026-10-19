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

let active = null, positionFrame = 0, returnFrame = 0, stopReturn = null, restoring = false, gutterFrame = 0
const inputs = ['wheel', 'touchstart', 'pointerdown', 'keydown']
const pagePath = path => path.replace(/(?:\/index)?\.html$/i, '').replace(/\/$/, '')
const panelSelector = '.lab-section,.hw-section,.sw-section,.edu-section,.hp-content,.protocol-pathogen,.engineering-content,.team-section'
const panels = new Set()
const panelObserver = new ResizeObserver(() => scheduleGutters())

function preparePanels() {
  document.querySelectorAll(`main :is(${panelSelector})`).forEach(panel => {
    if (panel.parentElement.closest(panelSelector) || panels.has(panel)) return
    panels.add(panel)
    panel.classList.add('wiki-return-panel')
    panelObserver.observe(panel)
  })
  scheduleGutters()
}

function scheduleGutters() {
  if (gutterFrame) return
  gutterFrame = requestAnimationFrame(() => {
    gutterFrame = 0
    const viewport = document.documentElement.clientWidth
    for (const panel of panels) {
      if (!panel.isConnected) { panelObserver.unobserve(panel); panels.delete(panel); continue }
      const box = panel.getBoundingClientRect()
      if (!box.width) continue
      const previous = parseFloat(panel.style.getPropertyValue('--wiki-return-reserve')) || 0
      // A resize can briefly expose the old desktop width. Reserve only the
      // button's gutter, never propagate that transient overflow into content.
      // Centered Team panels move their right edge by half the removed width.
      const limit = panel.matches('.team-section') ? 100 : 50
      const reserve = Math.max(0, Math.min(limit, Math.ceil(50 - (viewport - box.right - previous))))
      if (Math.abs(reserve - previous) > .5) panel.style.setProperty('--wiki-return-reserve', `${reserve}px`)
    }
    schedulePosition()
  })
}

preparePanels()

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

function position() {
  positionFrame = 0
  if (!active) return
  const block = destinationBlock(active.target)
  const box = block.getBoundingClientRect()
  const visibleBox = box
  if (!box.width || block.closest('[hidden]')) { control.hidden = true; return }
  if (!active.ready || visibleBox.bottom < 76 || visibleBox.top > innerHeight) {
    control.hidden = true
    if (active.shown) dismiss()
    return
  }
  const panel = block.closest('.wiki-return-panel') || active.target.closest('.wiki-return-panel')
  if (!panel) { control.hidden = true; return }
  const left = panel.getBoundingClientRect().right + 2
  const top = box.top + Math.max(0, Math.min(14, (box.height - 48) / 2))
  if (left + 44 > document.documentElement.clientWidth - 2) { control.hidden = true; scheduleGutters(); return }
  if (active.shown && (top + 48 < 76 || top > innerHeight)) { dismiss(); return }
  control.style.left = `${left}px`
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
  active = { target, previous, ready: false, shown: false }
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
addEventListener('resize', scheduleGutters, { passive: true })
document.addEventListener('toggle', () => { preparePanels(); schedulePosition() }, true)
document.addEventListener('load', schedulePosition, true)
document.addEventListener('close', schedulePosition, true)
document.addEventListener('fullscreenchange', schedulePosition)
if (document.body) new ResizeObserver(schedulePosition).observe(document.body)
if (document.body) new MutationObserver(preparePanels).observe(document.body, { childList: true, subtree: true })
addEventListener('pagehide', () => { stopReturn?.(); cancelAnimationFrame(positionFrame); dismiss() })

import './back-to-top.css'
import labRoles from '../assets/mascots/back-to-top-20261014/lab-roles-transparent.png'
import researchRoles from '../assets/mascots/back-to-top-20261014/research-roles-transparent.png'

// Keep the paired illustrations together. CSS frames the supplied cutout
// sheets; it does not crop, rewrite or replace the source artwork on disk.
const roles = {
  protocol: { sheet: labRoles, crop: [24, 24, 520, 442], motion: 'guide' },
  microscope: { sheet: labRoles, crop: [544, 24, 354, 432], motion: 'lens' },
  tubes: { sheet: labRoles, crop: [884, 24, 355, 422], motion: 'sample' },
  diagnostics: { sheet: labRoles, crop: [1254, 22, 389, 432], motion: 'sample' },
  books: { sheet: labRoles, crop: [20, 472, 468, 442], motion: 'writing' },
  recorder: { sheet: labRoles, crop: [496, 472, 337, 440], motion: 'writing' },
  handwashing: { sheet: labRoles, crop: [833, 467, 364, 453], motion: 'washing' },
  medical: { sheet: labRoles, crop: [1216, 472, 448, 452], motion: 'care' },
  pipette: { sheet: researchRoles, crop: [47, 31, 376, 431], motion: 'pipette' },
  surgeon: { sheet: researchRoles, crop: [432, 14, 425, 453], motion: 'care' },
  reactor: { sheet: researchRoles, crop: [887, 30, 756, 451], motion: 'bubbles', paired: true },
  beakers: { sheet: researchRoles, crop: [69, 473, 367, 445], motion: 'mixing' },
  computers: { sheet: researchRoles, crop: [483, 471, 720, 451], motion: 'computing', paired: true },
  researcher: { sheet: researchRoles, crop: [1212, 474, 431, 448], motion: 'lens' },
}

const pageRoles = {
  '/project/description.html': 'tubes',
  '/project/design.html': 'researcher',
  '/project/engineering.html': 'reactor',
  '/project/contribution.html': 'books',
  '/project/safety.html': 'handwashing',
  '/wet-lab/measurement.html': 'pipette',
  '/wet-lab/notebook.html': 'recorder',
  '/wet-lab/protocal.html': 'protocol',
  '/wet-lab/part.html': 'beakers',
  '/wet-lab/result.html': 'microscope',
  '/instrument/hardware.html': 'diagnostics',
  '/instrument/software.html': 'computers',
  '/instrument/model.html': 'computers',
  '/eagagement/ihp.html': 'medical',
  '/eagagement/education.html': 'books',
  '/eagagement/inclusity.html': 'surgeon',
  '/eagagement/entrepreneurship.html': 'books',
  '/eagagement/collaboration.html': 'reactor',
  '/team/member.html': 'reactor',
}

// Cloudflare Pages redirects .html pages to extensionless URLs.
const pagePath = decodeURI(location.pathname).toLowerCase().replace(/\/+$/, '')
const roleName = pageRoles[pagePath.endsWith('.html') ? pagePath : `${pagePath}.html`]
if (roleName) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => createBackToTop(roleName), { once: true })
  } else createBackToTop(roleName)
}

function createBackToTop(name) {
  const role = roles[name]
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'wiki-back-to-top'
  button.dataset.mascot = name
  button.dataset.motion = role.motion
  button.setAttribute('aria-label', 'Back to top')
  button.title = 'Back to top'
  button.hidden = true
  button.innerHTML = '<span class="wiki-back-to-top__scene" aria-hidden="true"><span class="wiki-back-to-top__art"></span><i></i><i></i><i></i></span><span class="wiki-back-to-top__arrow" aria-hidden="true">↑</span>'

  const [x, y, width, height] = role.crop
  const art = button.querySelector('.wiki-back-to-top__art')
  art.style.backgroundImage = `url("${role.sheet}")`
  art.style.backgroundSize = `${1679 / width * 100}% ${937 / height * 100}%`
  art.style.backgroundPosition = `${x / (1679 - width) * 100}% ${y / (937 - height) * 100}%`
  document.body.append(button)

  let imageReady = false
  let frame = 0
  let obstacles = []
  let obstaclesDirty = true
  let returning = false
  let returnTimer = 0
  const sceneRatio = height / width
  const sizes = role.paired ? [128, 108, 88] : [94, 80, 66]

  // Reserve the entire button, including its arrow, focus ring and motion.
  // Reject content cards as well as text/media, even if their padding is empty.
  const obstacleSelector = [
    'img', 'video', 'iframe', 'embed', 'object', 'canvas', 'svg', 'math',
    'table', 'figure', 'pre', 'hr', 'nav', 'aside', 'p', 'h1', 'h2', 'h3', 'h4',
    'h5', 'h6', 'li', 'dt', 'dd', 'blockquote', 'summary', 'a[href]',
    'button', 'input', 'textarea', 'select', 'label',
    '.wiki-headpage', '.team-hero', '.image-page-hero', '.page-hero', '.lab-hero',
    '.lab-section', '.lab-intro', '.sw-section', '.sw-intro',
    '[role="dialog"]', '[aria-modal="true"]', 'dialog[open]',
  ].join(',')
  const textTags = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'DT', 'DD', 'BLOCKQUOTE', 'LABEL'])

  function intersects(a, b) {
    return b.width > 0 && b.height > 0
      && a.left < b.right && a.right > b.left
      && a.top < b.bottom && a.bottom > b.top
  }

  function modalIsOpen() {
    return Boolean(document.fullscreenElement || document.querySelector('dialog[open]'))
      || [...document.querySelectorAll('[role="dialog"], [aria-modal="true"]')].some((element) => {
        const style = getComputedStyle(element)
        return element.getClientRects().length && style.visibility !== 'hidden' && style.display !== 'none'
      })
  }

  function textOverlaps(element, area) {
    const range = document.createRange()
    range.selectNodeContents(element)
    return [...range.getClientRects()].some((rect) => intersects(area, rect))
  }

  function areaIsEmpty(area) {
    if (obstaclesDirty) {
      obstacles = [...document.querySelectorAll(obstacleSelector)].filter((element) => !button.contains(element))
      obstaclesDirty = false
    }
    for (const element of obstacles) {
      if (!intersects(area, element.getBoundingClientRect())) continue
      const style = getComputedStyle(element)
      if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') continue
      if (!textTags.has(element.tagName) || textOverlaps(element, area)) return false
    }

    // Hit-test the canvas too: a new page-specific panel or decorative
    // background must not be covered just because it is absent from the list.
    for (const horizontal of [0, .5, 1]) {
      for (const vertical of [0, .5, 1]) {
        const px = area.left + horizontal * (area.right - area.left)
        const py = area.top + vertical * (area.bottom - area.top)
        const hits = document.elementsFromPoint(px, py)
        for (const element of hits) {
          if (button.contains(element) || element.id === 'igem-custom-cursor'
            || ['HTML', 'BODY', 'MAIN', 'FOOTER'].includes(element.tagName)) continue
          const style = getComputedStyle(element)
          if (style.visibility === 'hidden' || style.opacity === '0') continue
          const hasText = [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
          const hasBackground = style.backgroundImage !== 'none'
            || !/^(transparent|rgba\([^)]*,\s*0\))$/.test(style.backgroundColor)
          const hasBorder = ['Top', 'Right', 'Bottom', 'Left'].some((side) =>
            parseFloat(style[`border${side}Width`]) > 0 && style[`border${side}Style`] !== 'none')
          if ((hasText && textOverlaps(element, area)) || hasBackground || hasBorder || style.boxShadow !== 'none') return false
        }
      }
    }
    return true
  }

  function hide() {
    button.hidden = true
    button.dataset.corner = 'occupied'
  }

  function checkCorner() {
    frame = 0
    if (returning && scrollY < 1) {
      returning = false
      clearTimeout(returnTimer)
    }
    if (!imageReady || returning || scrollY < 240 || innerHeight < 320
      || document.body.classList.contains('loading-lock') || document.hidden || modalIsOpen()
      || (window.visualViewport && (visualViewport.scale > 1.05 || visualViewport.height < innerHeight - 100))) {
      hide()
      return
    }
    const placement = getComputedStyle(button)
    const right = parseFloat(placement.right) || 16
    const bottom = parseFloat(placement.bottom) || 16
    const safety = 6
    for (const size of sizes) {
      const sceneHeight = Math.ceil(size * sceneRatio)
      const buttonHeight = sceneHeight + 20
      const area = {
        left: document.documentElement.clientWidth - right - size - safety,
        right: document.documentElement.clientWidth - right + safety,
        top: innerHeight - bottom - buttonHeight - safety,
        bottom: innerHeight - bottom + safety,
      }
      if (!areaIsEmpty(area)) continue
      button.style.width = `${size}px`
      button.style.height = `${buttonHeight}px`
      button.style.setProperty('--mascot-scene-height', `${sceneHeight}px`)
      button.hidden = false
      button.dataset.corner = 'empty'
      return
    }
    hide()
  }

  function scheduleCheck() {
    if (frame) return
    // A scroll check uses the current layout before the next paint. The
    // button is never kept visible over newly arrived content during a delay.
    frame = requestAnimationFrame(checkCorner)
  }

  function returnToTop(event) {
    returning = true
    hide()
    const useKeyboard = event.detail === 0
    if (useKeyboard) {
      const target = document.querySelector('h1, main')
      if (target) {
        const previousTabindex = target.getAttribute('tabindex')
        target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
        target.addEventListener('blur', () => {
          if (previousTabindex === null) target.removeAttribute('tabindex')
          else target.setAttribute('tabindex', previousTabindex)
        }, { once: true })
      }
    }
    scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' })
    clearTimeout(returnTimer)
    returnTimer = setTimeout(() => { returning = false; scheduleCheck() }, 1600)
  }
  button.addEventListener('click', returnToTop)
  addEventListener('scroll', scheduleCheck, { passive: true })
  addEventListener('resize', scheduleCheck, { passive: true })
  addEventListener('pageshow', scheduleCheck)
  addEventListener('hashchange', scheduleCheck)
  document.addEventListener('fullscreenchange', scheduleCheck)
  document.addEventListener('visibilitychange', scheduleCheck)
  document.addEventListener('load', scheduleCheck, true)
  document.addEventListener('toggle', scheduleCheck, true)
  window.visualViewport?.addEventListener('resize', scheduleCheck)
  window.visualViewport?.addEventListener('scroll', scheduleCheck)
  new ResizeObserver(scheduleCheck).observe(document.body)
  new MutationObserver((records) => {
    const relevant = records.filter((record) => !button.contains(record.target))
    if (!relevant.length) return
    if (relevant.some((record) => record.type === 'childList')) obstaclesDirty = true
    scheduleCheck()
  }).observe(document.body, {
    childList: true, subtree: true, attributes: true,
    attributeFilter: ['class', 'style', 'hidden', 'inert', 'open', 'aria-hidden', 'aria-modal'],
  })

  const image = new Image()
  image.onload = () => { imageReady = true; scheduleCheck() }
  image.src = role.sheet
  scheduleCheck()
}

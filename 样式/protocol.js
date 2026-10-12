const categoryButtons = [...document.querySelectorAll('.protocol-card')]
const sectionButtons = [...document.querySelectorAll('.protocol-index-button')]
const panels = [...document.querySelectorAll('.protocol-panel')]
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

function hideContent() {
  panels.forEach((panel) => { panel.hidden = true })
  sectionButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'))
}

function selectCategory(button, open = true) {
  categoryButtons.forEach((categoryButton) => {
    const expanded = categoryButton === button && open
    categoryButton.setAttribute('aria-expanded', String(expanded))
    categoryButton.querySelector('.protocol-card-toggle').textContent = expanded ? '−' : '+'
    document.getElementById(categoryButton.getAttribute('aria-controls')).hidden = !expanded
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

function openPanel(panel) {
  const sectionButton = sectionButtons.find((button) => button.getAttribute('aria-controls') === panel.id)
  if (!sectionButton) return
  const category = categoryButtons.find((button) => document.getElementById(button.getAttribute('aria-controls')).contains(sectionButton))
  if (!category) return
  hideContent()
  selectCategory(category)
  panel.hidden = false
  sectionButton.setAttribute('aria-expanded', 'true')
  markDirectory(panel.id)
}

function revealFragment(smooth = true) {
  let id
  try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
  const target = document.getElementById(id)
  if (!target) return
  const panel = target.closest('.protocol-panel')
  if (panel) {
    openPanel(panel)
    for (let ancestor = target.parentElement; ancestor; ancestor = ancestor.parentElement) {
      if (ancestor.tagName === 'DETAILS') ancestor.open = true
    }
  } else {
    const category = target.closest('.protocol-category')?.querySelector('.protocol-card')
    if (category) { hideContent(); selectCategory(category); markDirectory(category.id) }
  }
  scrollToProtocol(target, { smooth })
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true'
    hideContent()
    selectCategory(button, open)
    markDirectory(open ? button.id : '')
    window.history.replaceState(null, '', open ? `#${button.id}` : window.location.pathname + window.location.search)
  })
})

sectionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-expanded') === 'true') {
      hideContent()
      markDirectory('')
      window.history.replaceState(null, '', `#${button.closest('.protocol-category').querySelector('.protocol-card').id}`)
      return
    }

    const panel = document.getElementById(button.getAttribute('aria-controls'))
    openPanel(panel)
    window.history.replaceState(null, '', `#${panel.id}`)
    panel.querySelector('h2').focus({ preventScroll: true })
    scrollToProtocol(panel)
  })
})

document.querySelectorAll('.protocol-back').forEach((button) => {
  button.addEventListener('click', () => {
    hideContent()
    const index = document.getElementById(button.dataset.index)
    const category = index.closest('.protocol-category').querySelector('.protocol-card')
    selectCategory(category)
    markDirectory(category.id)
    window.history.replaceState(null, '', `#${category.id}`)
    index.focus({ preventScroll: true })
    scrollToProtocol(index, { block: 'center' })
  })
})

directoryLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    window.history.pushState(null, '', link.hash)
    revealFragment()
  })
})
window.addEventListener('hashchange', () => revealFragment())
window.addEventListener('popstate', () => revealFragment())
revealFragment(false)

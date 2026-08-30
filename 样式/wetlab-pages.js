const tocLinks = [...document.querySelectorAll('[data-section-link]')]
const trackedSections = tocLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean)

if ('IntersectionObserver' in window && trackedSections.length) {
  const activateLink = (id) => {
    tocLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`
      link.classList.toggle('is-active', active)
      if (active) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    })
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    if (visible[0]) activateLink(visible[0].target.id)
  }, { rootMargin: '-16% 0px -68% 0px', threshold: [0, 0.02, 0.2] })

  trackedSections.forEach((section) => observer.observe(section))
  activateLink(trackedSections[0].id)
}

document.querySelectorAll('[data-module-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.module-card')
    const content = card?.querySelector('.module-card__content')
    if (!card || !content) return
    const expanded = button.getAttribute('aria-expanded') === 'true'
    button.setAttribute('aria-expanded', String(!expanded))
    content.hidden = expanded
  })
})

document.querySelectorAll('[data-pathogen-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.pathogen-card')
    const links = card?.querySelector('.pathogen-card__links')
    if (!links) return
    const expanded = button.getAttribute('aria-expanded') === 'true'

    document.querySelectorAll('[data-pathogen-toggle]').forEach((otherButton) => {
      otherButton.setAttribute('aria-expanded', 'false')
      const otherLinks = otherButton.closest('.pathogen-card')?.querySelector('.pathogen-card__links')
      if (otherLinks) otherLinks.hidden = true
    })

    if (!expanded) {
      button.setAttribute('aria-expanded', 'true')
      links.hidden = false
    }
  })
})

const experimentCards = [...document.querySelectorAll('.experiment-card')]
document.querySelector('[data-expand-experiments]')?.addEventListener('click', () => {
  experimentCards.forEach((card) => { card.open = true })
})
document.querySelector('[data-collapse-experiments]')?.addEventListener('click', () => {
  experimentCards.forEach((card) => { card.open = false })
})

document.querySelectorAll('.page-toc a[href^="#"], .pathogen-card__links a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'))
    const parentDetails = target?.closest('details')
    if (parentDetails) parentDetails.open = true
  })
})

const mobileNavigation = window.matchMedia('(max-width: 768px)')
const navigationDropdowns = [...document.querySelectorAll('.navbar .dropdown:has(.dropdown-content)')]

const closeMobileNavigation = (except = null) => {
  navigationDropdowns.forEach((dropdown) => {
    if (dropdown === except) return
    dropdown.classList.remove('is-mobile-open')
    dropdown.querySelector(':scope > .nav-link')?.setAttribute('aria-expanded', 'false')
  })
}

navigationDropdowns.forEach((dropdown) => {
  const parentLink = dropdown.querySelector(':scope > .nav-link')
  if (!parentLink) return
  parentLink.setAttribute('aria-haspopup', 'true')
  parentLink.setAttribute('aria-expanded', 'false')
  parentLink.addEventListener('click', (event) => {
    if (!mobileNavigation.matches) return
    const isOpen = dropdown.classList.contains('is-mobile-open')
    if (!isOpen) {
      event.preventDefault()
      closeMobileNavigation(dropdown)
      dropdown.classList.add('is-mobile-open')
      parentLink.setAttribute('aria-expanded', 'true')
    }
  })
})

document.addEventListener('click', (event) => {
  if (mobileNavigation.matches && !event.target.closest('.navbar .dropdown')) closeMobileNavigation()
})
mobileNavigation.addEventListener('change', () => closeMobileNavigation())

const printState = { details: [], hiddenPanels: [] }
window.addEventListener('beforeprint', () => {
  printState.details = [...document.querySelectorAll('details:not([open])')]
  printState.hiddenPanels = [...document.querySelectorAll('.module-card__content[hidden], .pathogen-card__links[hidden]')]
  printState.details.forEach((details) => { details.open = true })
  printState.hiddenPanels.forEach((panel) => { panel.hidden = false })
})
window.addEventListener('afterprint', () => {
  printState.details.forEach((details) => { details.open = false })
  printState.hiddenPanels.forEach((panel) => { panel.hidden = true })
  printState.details = []
  printState.hiddenPanels = []
})

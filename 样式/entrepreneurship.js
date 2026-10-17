import './entrepreneurship-final-20261017.css'
import { createCarousel } from './carousel.js'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

function enhanceCollapsibleSections() {
  const headings = Array.from(document.querySelectorAll('[data-collapsible="true"]'))
  headings.forEach((heading, index) => {
    if (!heading.parentElement || heading.parentElement.classList.contains('collapsible-section')) return

    const wrapper = document.createElement('section')
    wrapper.className = 'collapsible-section'
    const body = document.createElement('div')
    body.className = 'collapsible-section__body'
    const inner = document.createElement('div')
    body.append(inner)

    heading.before(wrapper)
    wrapper.append(heading, body)

    let cursor = wrapper.nextSibling
    while (cursor) {
      if (cursor.nodeType === Node.ELEMENT_NODE && cursor.matches('h2, h3, h4')) break
      const next = cursor.nextSibling
      inner.append(cursor)
      cursor = next
    }

    const isOpen = index === 0 || /Phase I\b/.test(heading.textContent)
    wrapper.classList.toggle('is-open', isOpen)
    heading.tabIndex = 0
    heading.setAttribute('role', 'button')
    heading.setAttribute('aria-expanded', String(isOpen))
    heading.setAttribute('aria-controls', `${heading.id}-panel`)
    body.id = `${heading.id}-panel`

    const toggle = () => {
      const nextState = !wrapper.classList.contains('is-open')
      wrapper.classList.toggle('is-open', nextState)
      heading.setAttribute('aria-expanded', String(nextState))
    }
    heading.addEventListener('click', toggle)
    heading.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      toggle()
    })
  })
}

function setupReveal() {
  const items = document.querySelectorAll('.doc-figure, .hp-h1')
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'))
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  )
  items.forEach((item) => {
    item.classList.add('reveal-on-scroll')
    observer.observe(item)
  })
}

function setupFigureLightbox() {
  const lightbox = document.querySelector('.figure-lightbox')
  const lightboxImage = lightbox?.querySelector('img')
  const lightboxCaption = lightbox?.querySelector('#figure-lightbox-caption')
  const closeButton = lightbox?.querySelector('.figure-lightbox__close')
  if (!lightbox || !lightboxImage || !lightboxCaption || !closeButton) return

  let trigger = null

  const close = () => {
    if (!lightbox.open) return
    lightbox.close()
    lightboxImage.removeAttribute('src')
    lightboxImage.alt = ''
    lightboxCaption.textContent = ''
    document.body.style.removeProperty('overflow')
    trigger?.focus()
    trigger = null
  }

  document.querySelectorAll('.figure-zoom').forEach((button) => {
    const image = button.querySelector('img')
    const syncFullSource = () => {
      const source = image?.currentSrc || image?.src
      if (source) button.dataset.fullSrc = source
    }

    syncFullSource()
    image?.addEventListener('load', syncFullSource, { once: true })

    button.addEventListener('click', () => {
      const caption = button.closest('figure')?.querySelector('figcaption')
      if (!image) return

      syncFullSource()
      trigger = button
      lightboxImage.src = button.dataset.fullSrc
      lightboxImage.alt = image?.alt || 'Expanded entrepreneurship figure'
      lightboxCaption.textContent = caption?.textContent || image.alt
      lightbox.showModal()
      document.body.style.overflow = 'hidden'
      closeButton.focus()
    })
  })
  closeButton.addEventListener('click', close)
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close()
  })
  lightbox.addEventListener('cancel', (event) => {
    event.preventDefault()
    close()
  })
}

function setupSwotCards() {
  document.querySelectorAll('.swot-flip-card').forEach((card) => {
    const front = card.querySelector('.swot-flip-card__front')
    const back = card.querySelector('.swot-flip-card__back')
    const returnButton = card.querySelector('.swot-flip-card__return')
    if (!front || !back || !returnButton) return

    card.classList.add('is-enhanced')
    back.inert = true

    const setFlipped = (flipped) => {
      card.classList.toggle('is-flipped', flipped)
      front.setAttribute('aria-expanded', String(flipped))
      front.inert = flipped
      back.inert = !flipped
      const focusTarget = flipped ? returnButton : front
      focusTarget.focus({ preventScroll: true })
    }
    front.addEventListener('click', () => setFlipped(true))
    returnButton.addEventListener('click', () => setFlipped(false))
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && card.classList.contains('is-flipped')) {
        event.preventDefault()
        setFlipped(false)
      }
    })
  })
}

enhanceCollapsibleSections()
setupSwotCards()
setupReveal()
document.querySelectorAll('.entre-final-photo').forEach(figure => {
  const image = figure.querySelector('img')
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'figure-zoom'
  button.setAttribute('aria-label', `Enlarge: ${image.alt}`)
  image.before(button)
  button.append(image)
})
document.querySelectorAll('.entre-final-device-gallery').forEach(root => {
  createCarousel(root, { track: root.querySelector('.entre-final-device-track') })
})
setupFigureLightbox()

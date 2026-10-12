const content = document.querySelector('#entrepreneurship-content')
const toc = document.querySelector('.hp-toc')
const tocLinks = Array.from(document.querySelectorAll('.toc-link'))
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

function setupToc() {
  const linkById = new Map(tocLinks.map((link) => [link.hash.slice(1), link]))
  const headings = tocLinks
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter(Boolean)
  if (!headings.length || !tocLinks.length) return

  const activate = (id) => {
    tocLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${id}`))
    const active = linkById.get(id)
    const nav = active?.closest('nav')
    if (nav?.clientHeight) {
      const linkBox = active.getBoundingClientRect()
      const navBox = nav.getBoundingClientRect()
      if (linkBox.top < navBox.top || linkBox.bottom > navBox.bottom) {
        nav.scrollTo({
          top: nav.scrollTop + linkBox.top - navBox.top - (nav.clientHeight - linkBox.height) / 2,
          behavior: reducedMotion.matches ? 'instant' : 'smooth',
        })
      }
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) activate(visible[0].target.id)
    },
    { rootMargin: '-18% 0px -70% 0px', threshold: 0 },
  )
  headings.forEach((heading) => observer.observe(heading))

  tocLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.hash)
      if (!target) return
      event.preventDefault()
      target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' })
      history.replaceState(null, '', link.hash)
      activate(target.id)
    })
  })
}

function setupReadingProgress() {
  if (!content) return
  let ticking = false
  const update = () => {
    const rect = content.getBoundingClientRect()
    const start = window.scrollY + rect.top - window.innerHeight * 0.18
    const distance = Math.max(content.offsetHeight - window.innerHeight * 0.64, 1)
    const progress = Math.min(1, Math.max(0, (window.scrollY - start) / distance))
    content.style.setProperty('--reading-progress', `${(progress * 100).toFixed(2)}%`)
    toc?.style.setProperty('--toc-progress', `${(progress * 100).toFixed(2)}%`)
    ticking = false
  }
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    },
    { passive: true },
  )
  window.addEventListener('resize', update, { passive: true })
  update()
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

enhanceCollapsibleSections()
setupToc()
setupReadingProgress()
setupReveal()
setupFigureLightbox()

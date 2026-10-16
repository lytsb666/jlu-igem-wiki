import './carousel.css'

// Shared, quiet slideshow: a two-second hold, dots and hover-only side arrows.
// All original slides stay in the document, with a stable height and no effects.
export function createCarousel(root, { track, slides = [...track.children], initial = 0, onChange } = {}) {
  if (!root || slides.length < 2) return null
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  root.classList.add('wiki-carousel')
  root.dataset.carouselDelay = '2000'
  track.classList.add('wiki-carousel__track')
  track.removeAttribute('tabindex')
  const viewport = document.createElement('div')
  viewport.className = 'wiki-carousel__viewport'
  track.before(viewport)
  viewport.append(track)
  slides.forEach(slide => slide.classList.add('wiki-carousel__slide'))
  const dots = document.createElement('div')
  dots.className = 'wiki-carousel__dots'
  dots.setAttribute('aria-label', 'Choose slide')
  const dotButtons = slides.map((slide, index) => {
    const dot = document.createElement('button')
    dot.type = 'button'
    dot.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`)
    dot.addEventListener('click', () => show(index))
    dots.append(dot)
    return dot
  })
  function arrow(direction, label) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = `wiki-carousel__arrow wiki-carousel__arrow--${direction < 0 ? 'previous' : 'next'}`
    button.setAttribute('aria-label', label)
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${direction < 0 ? 'M15 5 8 12 15 19' : 'M9 5 16 12 9 19'}"/></svg>`
    button.addEventListener('click', () => show(current + direction))
    viewport.append(button)
    return button
  }
  arrow(-1, 'Previous slide')
  arrow(1, 'Next slide')
  root.append(dots)
  let current = initial, visible = false, timer = 0, start = null, ignoreClick = false
  function schedule() {
    clearTimeout(timer)
    if (!visible || reduced.matches || document.hidden) return
    timer = setTimeout(() => {
      const modal = document.querySelector('dialog[open]')
      if (!root.closest('[inert]') && (!modal || modal.contains(root)) && !root.querySelector(':focus-visible')) show(current + 1)
      else schedule()
    }, 2000)
  }
  function show(index) {
    current = (index + slides.length) % slides.length
    root.dataset.carouselIndex = String(current)
    slides.forEach((slide, i) => {
      const active = i === current
      slide.classList.toggle('is-current', active)
      slide.inert = !active
      slide.setAttribute('aria-hidden', String(!active))
      dotButtons[i].setAttribute('aria-current', String(active))
    })
    for (const i of [current, (current + 1) % slides.length]) {
      const images = slides[i].matches('img') ? [slides[i]] : slides[i].querySelectorAll('img')
      images.forEach(image => { image.loading = 'eager' })
    }
    onChange?.(current)
    schedule()
  }
  // Touch swiping remains available while the side arrows are normally hidden.
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return
    start = { x: event.clientX, y: event.clientY }
    clearTimeout(timer)
  })
  viewport.addEventListener('pointerup', event => {
    if (!start) return
    const dx = event.clientX - start.x, dy = event.clientY - start.y
    start = null
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      ignoreClick = true
      show(current + (dx < 0 ? 1 : -1))
      setTimeout(() => { ignoreClick = false }, 300)
    } else schedule()
  })
  viewport.addEventListener('pointercancel', () => { start = null; schedule() })
  viewport.addEventListener('click', event => {
    if (!ignoreClick) return
    event.preventDefault()
    event.stopPropagation()
  }, true)
  document.addEventListener('visibilitychange', schedule)
  reduced.addEventListener('change', schedule)
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting
    schedule()
  }, { threshold: 0 })
  observer.observe(root)
  show(initial)
  return {
    show,
    destroy() {
      clearTimeout(timer)
      observer.disconnect()
      document.removeEventListener('visibilitychange', schedule)
      reduced.removeEventListener('change', schedule)
    },
  }
}

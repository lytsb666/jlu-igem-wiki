import './carousel.css'

// Hold each image for two seconds, then glide to the next. Original slides
// share a stable grid cell; only the incoming and outgoing slides can draw.
export function createCarousel(root, { track, slides = [...track.children], initial = 0, onChange } = {}) {
  if (!root || slides.length < 2) return null
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const events = new AbortController()
  const listen = (element, type, handler) => element.addEventListener(type, handler, { signal: events.signal })
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
    listen(dot, 'click', () => show(index))
    dots.append(dot)
    return dot
  })
  function arrow(direction, label) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = `wiki-carousel__arrow wiki-carousel__arrow--${direction < 0 ? 'previous' : 'next'}`
    button.setAttribute('aria-label', label)
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${direction < 0 ? 'M15 5 8 12 15 19' : 'M9 5 16 12 9 19'}"/></svg>`
    listen(button, 'click', () => show(requested + direction, direction))
    viewport.append(button)
  }
  arrow(-1, 'Previous slide')
  arrow(1, 'Next slide')
  root.append(dots)
  let current = -1, requested = initial, visible = false, hovered = false
  let timer = 0, start = null, ignoreClick = false, destroyed = false
  let animations = [], queued = null, transitioning = false
  const normalized = index => (index % slides.length + slides.length) % slides.length

  function schedule() {
    clearTimeout(timer)
    if (destroyed || transitioning || !visible || hovered || reduced.matches || document.hidden) return
    timer = setTimeout(() => {
      const modal = document.querySelector('dialog[open]')
      if (!root.closest('[inert]') && (!modal || modal.contains(root)) && !root.querySelector(':focus-visible')) show(current + 1, 1)
      else schedule()
    }, 2000)
  }
  function preload(index) {
    const slide = slides[normalized(index)]
    const images = slide.matches('img') ? [slide] : slide.querySelectorAll('img')
    images.forEach(image => { image.loading = 'eager' })
  }
  function settle() {
    if (destroyed) return
    animations = []
    transitioning = false
    root.dataset.carouselTransition = 'idle'
    slides.forEach(slide => slide.classList.remove('is-leaving'))
    const next = queued
    queued = null
    if (next && next.index !== current) show(next.index, next.direction)
    else schedule()
  }
  function show(index, direction) {
    if (destroyed) return
    const next = normalized(index)
    requested = next
    if (transitioning) { queued = { index: next, direction }; return }
    if (next === current) { schedule(); return }
    clearTimeout(timer)
    const previous = current
    if (!direction) direction = normalized(next - Math.max(0, current)) <= slides.length / 2 ? 1 : -1
    current = next
    root.dataset.carouselIndex = String(current)
    slides.forEach((slide, i) => {
      const active = i === current
      slide.classList.toggle('is-current', active)
      slide.inert = !active
      slide.setAttribute('aria-hidden', String(!active))
      dotButtons[i].setAttribute('aria-current', String(active))
    })
    for (const i of [current, current + 1, current - 1]) preload(i)
    onChange?.(current)
    if (previous >= 0 && !reduced.matches) {
      transitioning = true
      root.dataset.carouselTransition = 'sliding'
      slides[previous].classList.add('is-leaving')
      const options = { duration: 520, easing: 'cubic-bezier(.22,.7,.22,1)' }
      animations = [
        slides[previous].animate([{ transform: 'translateX(0)' }, { transform: `translateX(${-direction * 100}%)` }], options),
        slides[current].animate([{ transform: `translateX(${direction * 100}%)` }, { transform: 'translateX(0)' }], options),
      ]
      Promise.all(animations.map(animation => animation.finished.catch(() => undefined))).then(settle)
    } else { root.dataset.carouselTransition = 'idle'; schedule() }
  }
  listen(root, 'pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; schedule() } })
  listen(root, 'pointerleave', event => { if (event.pointerType === 'mouse') { hovered = false; schedule() } })
  listen(root, 'keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.target.closest('input,textarea,select')) return
    event.preventDefault()
    const direction = event.key === 'ArrowLeft' ? -1 : 1
    show(requested + direction, direction)
  })
  listen(viewport, 'pointerdown', event => {
    if (event.pointerType !== 'touch') return
    start = { x: event.clientX, y: event.clientY }
    clearTimeout(timer)
  })
  listen(viewport, 'pointerup', event => {
    if (!start) return
    const dx = event.clientX - start.x, dy = event.clientY - start.y
    start = null
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      ignoreClick = true
      show(requested + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1)
      setTimeout(() => { ignoreClick = false }, 300)
    } else schedule()
  })
  listen(viewport, 'pointercancel', () => { start = null; schedule() })
  viewport.addEventListener('click', event => {
    if (!ignoreClick) return
    event.preventDefault()
    event.stopPropagation()
  }, { capture: true, signal: events.signal })
  listen(document, 'visibilitychange', schedule)
  listen(reduced, 'change', () => { if (reduced.matches) animations.forEach(animation => animation.finish()); schedule() })
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule() }, { threshold: 0 })
  observer.observe(root)
  show(initial)
  return {
    show,
    destroy() {
      destroyed = true
      clearTimeout(timer)
      animations.forEach(animation => animation.cancel())
      slides.forEach(slide => slide.classList.remove('is-leaving'))
      observer.disconnect()
      events.abort()
    },
  }
}

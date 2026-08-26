const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const sections = [...document.querySelectorAll('[data-section]')]
const tocLinks = [...document.querySelectorAll('.inc-toc a')]
const progress = document.querySelector('.inc-toc__progress i')
const dialog = document.querySelector('.inc-lightbox')
const dialogImage = dialog?.querySelector('img')

if (!reducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      revealObserver.unobserve(entry.target)
    })
  }, { threshold: 0.16 })
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element))
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'))
}

const setActiveSection = () => {
  const marker = window.scrollY + window.innerHeight * 0.34
  let activeId = sections[0]?.id || ''
  sections.forEach((section) => {
    if (section.offsetTop <= marker && section.id) activeId = section.id
  })
  tocLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${activeId}`))

  if (progress) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    const amount = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0
    progress.style.setProperty('--progress', `${amount * 100}%`)
  }
}

let ticking = false
window.addEventListener('scroll', () => {
  if (ticking) return
  ticking = true
  window.requestAnimationFrame(() => {
    setActiveSection()
    ticking = false
  })
}, { passive: true })
setActiveSection()

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img')
    if (!dialog || !dialogImage || !image) return
    dialogImage.src = image.currentSrc || image.src
    dialogImage.alt = image.alt
    dialog.showModal()
  })
})

dialog?.querySelector('button')?.addEventListener('click', () => dialog.close())
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close()
})

const categoryButtons = [...document.querySelectorAll('.protocol-card')]
const sectionButtons = [...document.querySelectorAll('.protocol-index-button')]
const panels = [...document.querySelectorAll('.protocol-panel')]

function hideContent() {
  panels.forEach((panel) => { panel.hidden = true })
  sectionButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'))
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const shouldOpen = button.getAttribute('aria-expanded') !== 'true'
    hideContent()

    categoryButtons.forEach((categoryButton) => {
      const open = categoryButton === button && shouldOpen
      categoryButton.setAttribute('aria-expanded', String(open))
      categoryButton.querySelector('.protocol-card-toggle').textContent = open ? '−' : '+'
      document.getElementById(categoryButton.getAttribute('aria-controls')).hidden = !open
    })
  })
})

sectionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const shouldOpen = button.getAttribute('aria-expanded') !== 'true'
    hideContent()
    if (!shouldOpen) return

    const panel = document.getElementById(button.getAttribute('aria-controls'))
    panel.hidden = false
    button.setAttribute('aria-expanded', 'true')
    panel.querySelector('h2').focus({ preventScroll: true })
    panel.scrollIntoView({ behavior: 'instant', block: 'start' })
  })
})

document.querySelectorAll('.protocol-back').forEach((button) => {
  button.addEventListener('click', () => {
    hideContent()
    document.getElementById(button.dataset.index).focus()
  })
})

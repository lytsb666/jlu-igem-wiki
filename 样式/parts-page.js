document.querySelectorAll('.parts-toc-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const list = document.getElementById(button.getAttribute('aria-controls'))
    if (!list) return
    const expanded = button.getAttribute('aria-expanded') === 'true'
    button.setAttribute('aria-expanded', String(!expanded))
    list.hidden = expanded
  })
})

// Open the selected module for both table-of-contents navigation and deep links.
function revealModule(hash) {
  const target = document.getElementById(hash.slice(1))
  const module = target?.closest('.parts-module')
  if (module) module.open = true
}
document.querySelectorAll('.parts-toc a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => revealModule(link.hash))
})
window.addEventListener('hashchange', () => revealModule(window.location.hash))
revealModule(window.location.hash)

// Only actual Registry IDs become external links; pending values have no destination.
document.querySelectorAll('[data-source-cell]').forEach((cell) => {
  const id = cell.textContent.trim()
  if (!/^BBa_[A-Za-z]+\d+$/.test(id)) return
  const link = document.createElement('a')
  link.href = `https://parts.igem.org/Part:${encodeURIComponent(id)}`
  link.textContent = cell.textContent
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  cell.replaceChildren(link)
})

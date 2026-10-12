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

// Registry destinations are explicit links from the supplied Parts manuscript.
// Keep them in the HTML so the new Registry IDs remain usable without JavaScript.

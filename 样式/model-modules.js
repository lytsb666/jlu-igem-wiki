const tabs = [...document.querySelectorAll('.model-module-tab')]
const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')))
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
let current = panels[0]

function selectPanel(panel, updateAddress = false) {
  if (!panels.includes(panel)) return
  const changed = current !== panel
  panels.forEach((item, index) => {
    const active = item === panel
    item.hidden = !active
    item.inert = !active
    tabs[index].setAttribute('aria-selected', String(active))
    tabs[index].tabIndex = active ? 0 : -1
    item.classList.remove('is-arriving')
  })
  current = panel
  if (changed && !reducedMotion.matches) panel.classList.add('is-arriving')
  if (updateAddress) history.replaceState(null, '', `#${panel.id}`)
  // Shared directory trackers recalculate against the newly visible module.
  window.dispatchEvent(new Event('resize'))
}

function followHash(scroll = false) {
  if (!location.hash) { selectPanel(panels[0]); return }
  let id
  try { id = decodeURIComponent(location.hash.slice(1)) } catch { return }
  const target = document.getElementById(id)
  const panel = target?.closest('[data-model-module]')
  if (!panel) return
  selectPanel(panel)
  if (scroll) requestAnimationFrame(() => {
    target.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth' })
    if (target !== panel) {
      target.tabIndex = -1
      target.focus({ preventScroll: true })
    }
  })
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPanel(panels[index], true))
  tab.addEventListener('keydown', event => {
    let next
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    selectPanel(panels[next], true)
    tabs[next].focus({ preventScroll: true })
  })
})

panels.forEach(panel => panel.addEventListener('animationend', () => panel.classList.remove('is-arriving')))
window.addEventListener('hashchange', () => followHash(true))
window.addEventListener('popstate', () => followHash(true))
window.addEventListener('pageshow', () => followHash(Boolean(location.hash)))
selectPanel(current)
followHash(Boolean(location.hash))

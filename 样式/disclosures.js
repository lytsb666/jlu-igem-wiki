import './disclosures.css'

// Native and script-created content disclosures share a small inline cue.
// Directory toggles and portrait/flip-card interactions retain their own UI.
const selector = 'main details > summary, main [data-collapsible="true"], main [data-module-toggle], main [data-pathogen-toggle]'
function enhance(trigger) {
  if (trigger.classList.contains('wiki-disclosure-trigger') || trigger.closest('nav, aside')) return
  trigger.classList.add('wiki-disclosure-trigger')
  let label = trigger.querySelector('h2, h3, h4, h5, h6') || trigger.querySelector(':scope > span:not([aria-hidden="true"])')
  if (!label) {
    label = document.createElement('span')
    label.className = 'wiki-disclosure-label'
    label.append(...trigger.childNodes)
    trigger.append(label)
  }
  const arrow = document.createElement('span')
  arrow.className = 'wiki-disclosure-arrow'
  arrow.setAttribute('aria-hidden', 'true')
  label.append(arrow)
}
function scan(root) {
  if (root.nodeType !== Node.ELEMENT_NODE) return
  if (root.matches(selector)) enhance(root)
  root.querySelectorAll(selector).forEach(enhance)
}
scan(document.body)
new MutationObserver(records => {
  for (const record of records) for (const node of record.addedNodes) scan(node)
}).observe(document.body, { childList: true, subtree: true })

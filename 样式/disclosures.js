import './disclosures.css'

// Native and script-created content disclosures share a small inline cue.
// Directory toggles and portrait/flip-card interactions retain their own UI.
const selector = 'main details > summary, main [data-collapsible="true"], main [data-module-toggle], main [data-pathogen-toggle]'
function enhance(trigger) {
  if (!trigger.closest('nav, aside')) capitalizeLabel(trigger)
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
function capitalizeLabel(trigger) {
  const walker = document.createTreeWalker(trigger, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (node.parentElement.closest('[aria-hidden="true"],svg,math')) continue
    const match = node.data.match(/[a-z]/i)
    if (!match) continue
    const rest = node.data.slice(match.index)
    if (!/^(?:hMPV|iHP|iGEM|crRNA|gRNA|mRNA|cDNA|ompP6|lytA)\b/.test(rest)) {
      const value = node.data.slice(0, match.index) + rest[0].toUpperCase() + rest.slice(1)
      if (node.data !== value) node.data = value
    }
    break
  }
}
function scan(root) {
  if (root.nodeType !== Node.ELEMENT_NODE) return
  if (root.matches(selector)) enhance(root)
  root.querySelectorAll(selector).forEach(enhance)
}
scan(document.body)
new MutationObserver(records => {
  for (const record of records) {
    const parent = record.target.nodeType === Node.TEXT_NODE ? record.target.parentElement : record.target
    const trigger = parent.closest?.(selector)
    if (trigger) capitalizeLabel(trigger)
    for (const node of record.addedNodes) scan(node)
  }
}).observe(document.body, { childList: true, characterData: true, subtree: true })

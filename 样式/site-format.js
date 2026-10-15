// Public article decoration and nested directories. Page scripts continue to
// own section navigation, content disclosures, filters and module selection.
const directorySelector = '.page-toc, .ihp-toc, .edu-toc, .inc-toc, .hp-toc, .cl-toc'
const protectedHeading = 'aside, nav, .image-page-hero, .page-hero, .team-hero, .sw-intro, .home-story, .home-cover, .cover-stage, .story-stage, .member-card, .card'
document.querySelectorAll('main h2').forEach(heading => {
  if (!heading.closest(protectedHeading)) heading.classList.add('wiki-chapter-title')
})

let listNumber = 0
const directoryGroupControls = new WeakMap()

export function setDirectoryGroupOpen(group, open) {
  directoryGroupControls.get(group)?.(open)
}

function wireGroup(group, list, button, label) {
  if (group.dataset.wikiDirectoryGroup) return
  group.dataset.wikiDirectoryGroup = 'true'
  group.classList.add('wiki-toc-group')
  list.classList.add('wiki-toc-list')
  list.hidden = false
  if (!list.id) list.id = `wiki-directory-list-${++listNumber}`
  button.classList.remove('parts-toc-toggle')
  // Parts originally keeps its button in a two-column row. The shared
  // directory places toggles against the whole group, outside that old grid.
  if (button.parentElement !== group) group.append(button)
  button.classList.add('wiki-toc-toggle')
  button.type = 'button'
  button.setAttribute('aria-controls', list.id)
  button.setAttribute('aria-label', `Expand ${label}`)
  const show = open => {
    group.classList.toggle('is-open', open)
    button.setAttribute('aria-expanded', String(open))
    button.setAttribute('aria-label', `${open ? 'Collapse' : 'Expand'} ${label}`)
    button.textContent = open ? '−' : '+'
  }
  directoryGroupControls.set(group, show)
  show(false)
  button.addEventListener('click', event => {
    event.preventDefault()
    event.stopImmediatePropagation()
    show(!group.classList.contains('is-open'))
  }, { capture: true })
  group.addEventListener('keydown', event => {
    if (event.key === 'Escape') { button.focus({ preventScroll: true }); show(false) }
    if (event.target !== button && event.target !== group.querySelector(':scope > a, :scope > .parts-toc-row > a')) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      show(event.key === 'ArrowRight')
    }
  })
}

function enhanceDirectory(toc) {
  toc.classList.add('wiki-directory')
  toc.querySelectorAll('nav > div, nav > ol > li').forEach(group => {
    const anchor = group.querySelector(':scope > a, :scope > .parts-toc-row > a')
    const list = group.querySelector(':scope > ul')
    if (!anchor || !list) return
    let button = group.querySelector(':scope > .parts-toc-row > button, :scope > button')
    if (!button) { button = document.createElement('button'); group.append(button) }
    wireGroup(group, list, button, anchor.textContent.trim())
  })
  toc.querySelectorAll('.ihp-toc__subnav').forEach(list => {
    if (list.parentElement.dataset.wikiDirectoryGroup) return
    const anchor = list.previousElementSibling
    if (anchor?.tagName !== 'A') return
    const group = document.createElement('div')
    anchor.before(group)
    group.append(anchor, list)
    const button = document.createElement('button')
    group.append(button)
    wireGroup(group, list, button, anchor.textContent.trim())
  })
  toc.querySelectorAll('.engineering-toc-group').forEach(group => {
    if (group.dataset.wikiDirectoryGroup) return
    group.dataset.wikiDirectoryGroup = 'true'
    group.open = false
    directoryGroupControls.set(group, open => { group.open = open })
    const summary = group.querySelector(':scope > summary')
    // Native summary click / Enter / Space controls expansion. Hover and focus
    // leave the list geometry unchanged while a reader chooses a chapter.
    group.addEventListener('keydown', event => {
      if (event.key === 'Escape') { summary.focus({ preventScroll: true }); group.open = false }
      if (event.target === summary && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        event.preventDefault()
        group.open = event.key === 'ArrowRight'
      }
    })
  })
}

document.querySelectorAll(directorySelector).forEach(toc => {
  enhanceDirectory(toc)
  new MutationObserver(() => enhanceDirectory(toc)).observe(toc, { childList: true, subtree: true })
})

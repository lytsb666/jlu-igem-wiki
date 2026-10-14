// Enhance numeric prose in place, keeping the original nodes, text and anchors.
const excluded = 'nav, aside, table, figure, .wiki-directory, .team-jumps, .wiki-pdf-fold, .home-story, .cl-knowledge, [class*="eyebrow"], [class*="kicker"], [class*="date"]'
const prefix = /^\s*(?:(\d{1,2})[.、)]\s*(?!\d)|[（(](\d{1,2})[）)]\s*|([1-4])\s+(?=[A-Z]))(?=\S)/

function isReference(element) {
  if (element.closest('[id*="reference"], [class*="reference"], [id*="sources"]')) return true
  // Some imported manuscripts put references after a heading without a section.
  for (let node = element; node && !node.matches('main'); node = node.parentElement) {
    for (let previous = node.previousElementSibling; previous; previous = previous.previousElementSibling) {
      if (/^H[1-6]$/.test(previous.tagName)) return /references|bibliography|sources/i.test(previous.textContent)
    }
  }
  return false
}

function concealPrefix(element, length) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  let end, offset = length
  while ((end = walker.nextNode())) {
    if (offset <= end.length) break
    offset -= end.length
  }
  if (!end) return
  const range = document.createRange()
  range.setStart(element, 0)
  range.setEnd(end, offset)
  const sourceNumber = document.createElement('span')
  sourceNumber.className = 'wiki-step-source-number'
  sourceNumber.append(range.extractContents())
  element.prepend(sourceNumber)
}

function decorate(row, number, content) {
  row.style.setProperty('--wiki-step-background', getComputedStyle(row).backgroundColor)
  row.classList.add('wiki-numbered-item')
  row.dataset.wikiStep = number
  const badge = document.createElement('span')
  badge.className = 'wiki-step-number'
  badge.dataset.number = number
  badge.setAttribute('aria-hidden', 'true')
  const dots = document.createElement('span')
  dots.className = 'wiki-step-dots'
  dots.setAttribute('aria-hidden', 'true')
  for (let i = 0; i < 4; i++) dots.append(document.createElement('i'))
  content.classList.add('wiki-step-content')
  row.append(badge, dots, content)
}

for (const list of document.querySelectorAll('main ol')) {
  if (list.closest(excluded) || isReference(list) || (list.type && list.type !== '1')) continue
  list.classList.add('wiki-numbered-list')
  list.setAttribute('role', 'list')
  const items = [...list.children].filter(child => child.matches('li'))
  let number = list.hasAttribute('start') ? Number(list.start) : list.reversed ? items.length : 1
  for (const item of items) {
    if (item.hasAttribute('value')) number = item.value
    const content = document.createElement('div')
    content.append(...item.childNodes)
    const printed = content.querySelector(':scope > span, :scope > div > span:first-child')
    if (printed?.matches('span') && /^\s*\d+\s*$/.test(printed.textContent)) printed.classList.add('wiki-step-source-number')
    else if (printed?.matches('span')) {
      const labelPrefix = printed.textContent.match(/^\s*\d+\s*[·.、)]\s*/)
      if (labelPrefix) concealPrefix(printed, labelPrefix[0].length)
    }
    decorate(item, String(number), content)
    number += list.reversed ? -1 : 1
  }
}

for (const paragraph of document.querySelectorAll('main p, main ul > li')) {
  if (paragraph.closest(excluded) || isReference(paragraph)) continue
  const match = paragraph.textContent.match(prefix)
  if (!match) continue
  const row = document.createElement('div')
  const content = document.createElement('div')
  // Titled Measurement items include their explanatory paragraphs. Short
  // numbered survey labels also retain their following explanation in the box.
  const following = []
  let next = paragraph.nextElementSibling
  if (paragraph.matches('.measurement-box-heading')) {
    while (next?.matches('p') && !prefix.test(next.textContent)) { following.push(next); next = next.nextElementSibling }
  } else if (paragraph.textContent.trim().endsWith(':') && next?.matches('p') && !prefix.test(next.textContent)) {
    following.push(next)
  } else {
    while (next?.matches('.model-equation')) { following.push(next); next = next.nextElementSibling }
  }
  concealPrefix(paragraph, match[0].length)
  if (paragraph.matches('li')) {
    content.append(...paragraph.childNodes)
    decorate(paragraph, match[1] || match[2] || match[3], content)
  } else {
    paragraph.before(row)
    content.append(paragraph, ...following)
    decorate(row, match[1] || match[2] || match[3], content)
  }
}

// Standardize caption labels without flattening scientific markup or links.
const captionSelector = 'figcaption,caption,[data-wiki-caption],[class*="table-caption"],[class*="figure-caption"]'
const labelPrefix = /^\s*(Figures?|Fig\.?|Tables?|图|表)\s*(?:(\d+(?:[-.]\d+)*[a-z]?)(?=\s|[.:：·|—–-]|$))?\s*[.:：·|—–-]?\s*/i
const scopes = new Map()

function textNodes(caption) {
  const walker = document.createTreeWalker(caption, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) {
    const node = walker.currentNode
    const link = node.parentElement.closest('a')
    if (link && /\.(?:pdf|mp4|webm|png|jpe?g|webp|svg)(?:[?#]|$)/i.test(link.href) && /^(?:Open|View|Download|打开|查看|下载)/i.test(link.textContent.trim())) continue
    nodes.push(node)
  }
  return nodes
}

function record(caption) {
  const nodes = textNodes(caption)
  const text = nodes.map(node => node.data).join('')
  if (!text.trim() || caption.dataset.wikiCaptionFormatted) return
  const prefix = text.match(labelPrefix)
  const kind = prefix ? /^(?:Table|表)/i.test(prefix[1]) ? 'Table' : 'Figure'
    : caption.matches('caption,[class*="table-caption"]') ? 'Table' : 'Figure'
  const scope = caption.closest('[data-model-module]') || document.querySelector('main')
  if (!scopes.has(scope)) scopes.set(scope, new Map())
  const states = scopes.get(scope)
  if (!states.has(kind)) states.set(kind, {used: new Set(), next: 1, numbers: new WeakMap()})
  const state = states.get(kind)
  let subject = caption.closest('table,figure') || caption
  if (kind === 'Table' && !caption.closest('table')) {
    const next = caption.nextElementSibling
    if (next?.matches('table,.wiki-table-scroll')) subject = next.matches('table') ? next : next.querySelector('table') || subject
  }
  return {caption, nodes, prefix, kind, subject, state}
}

function format(captions) {
  const records = [...new Set(captions)]
    .filter(caption => !caption.parentElement.closest(captionSelector))
    .map(record).filter(Boolean)
  // Reserve manuscript numbers before assigning labels to unnumbered captions.
  for (const {prefix, subject, state} of records) if (prefix?.[2]) {
    state.used.add(prefix[2])
    if (!state.numbers.has(subject)) state.numbers.set(subject, prefix[2])
  }
  for (const {caption, nodes, prefix, kind, subject, state} of records) {
    let number = prefix?.[2] || state.numbers.get(subject)
    if (!number) {
      while (state.used.has(String(state.next))) state.next++
      number = String(state.next++)
      state.used.add(number)
      state.numbers.set(subject, number)
    }
    if (/^\d+$/.test(number)) state.next = Math.max(state.next, Number(number) + 1)
    caption.dataset.wikiCaption = 'true'
    caption.dataset.wikiCaptionFormatted = 'true'
    caption.dataset.wikiCaptionKind = kind
    caption.dataset.wikiCaptionNumber = number
    let remaining = prefix?.[0].length || nodes.map(node => node.data).join('').match(/^\s*/)[0].length
    for (const node of nodes) {
      const consumed = Math.min(remaining, node.length)
      node.data = node.data.slice(consumed)
      remaining -= consumed
      if (!remaining) break
    }
    caption.prepend(document.createTextNode(`${kind} ${number}. `))
    const last = [...textNodes(caption)].reverse().find(node => node.data.trim())
    if (last && !last.data.trimEnd().endsWith('.')) {
      const annotation = last.parentElement.closest('sup,sub,a')
      if (annotation && caption.contains(annotation)) annotation.after(document.createTextNode('.'))
      else last.data = last.data.trimEnd().replace(/。$/, '') + '.'
    }
  }
}

const main = document.querySelector('main')
if (main) {
  format(main.querySelectorAll(captionSelector))
  new MutationObserver(records => {
    const captions = new Set()
    for (const {target, addedNodes} of records) {
      if (target instanceof Element) {
        const caption = target.closest(captionSelector)
        if (caption) captions.add(caption)
      }
      for (const node of addedNodes) if (node instanceof Element) {
        if (node.matches(captionSelector)) captions.add(node)
        node.querySelectorAll(captionSelector).forEach(caption => captions.add(caption))
      }
    }
    format(captions)
  }).observe(main, {childList: true, subtree: true})
}

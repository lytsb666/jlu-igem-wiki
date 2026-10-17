import { scientificNames, latinTerms } from './scientific-terms.js'
import './scientific-typography.css'

const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')
const spellings = [...scientificNames.map(escape), ...latinTerms.map(term => escape(term).replaceAll('\\s+', '[\\s-]+'))]
const pattern = new RegExp(`(?<![a-z])(?:${spellings.join('|')})(?![a-z])`, 'gi')
const excluded = 'script,style,code,pre,textarea,input,svg,math,template,[contenteditable="true"]'
const blockSelector = 'p,h1,h2,h3,h4,h5,h6,li,th,td,figcaption,caption,summary,dt,dd,button,a'

function format(root) {
  if (!root?.isConnected || root.closest?.(excluded)) return
  // Collect complete text runs so a name split by <strong>/<span> still works.
  const runs = new Map()
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (!node.parentElement || node.parentElement.closest(excluded)) continue
    const block = node.parentElement.closest(blockSelector) || root
    if (!runs.has(block)) runs.set(block, [])
    runs.get(block).push(node)
  }
  for (const nodes of runs.values()) {
    const text = nodes.map(node => node.data).join('')
    const matches = [...text.matchAll(pattern)]
    if (!matches.length) continue
    let offset = 0
    for (const node of nodes) {
      const start = offset
      offset += node.length
      if (node.parentElement.closest('em,i,var')) continue
      const pieces = matches.map(match => [Math.max(0, match.index - start), Math.min(node.length, match.index + match[0].length - start)])
        .filter(([from, to]) => to > from)
      if (!pieces.length) continue
      const fragment = document.createDocumentFragment()
      let last = 0
      for (const [from, to] of pieces) {
        fragment.append(node.data.slice(last, from))
        const term = document.createElement('em')
        term.className = 'wiki-scientific-term'
        term.textContent = node.data.slice(from, to)
        fragment.append(term)
        last = to
      }
      fragment.append(node.data.slice(last))
      node.replaceWith(fragment)
    }
  }
}

format(document.body)
new MutationObserver(records => {
  const roots = new Set()
  for (const record of records) {
    if (record.type === 'characterData') roots.add(record.target.parentElement?.closest(blockSelector) || record.target.parentElement)
    for (const node of record.addedNodes) {
      const parent = node.nodeType === Node.TEXT_NODE ? node.parentElement : node
      if (parent instanceof Element) roots.add(parent.closest(blockSelector) || parent)
    }
  }
  roots.forEach(format)
}).observe(document.body, { childList: true, characterData: true, subtree: true })

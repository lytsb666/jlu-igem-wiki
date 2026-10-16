import { setDirectoryGroupOpen } from './site-format.js'

// Apply shared presentation while preserving manuscript text, anchors and data.
const isMeasurement = /\/wet-lab\/measurement(?:\.html)?\/?$/i.test(location.pathname)
const keepDownloadLinks = document.body.classList.contains('software-page')
const directorySelector = '.wiki-directory, .team-jumps'
const numberPrefix = /^\s*(?:\d+(?:\.\d+)*(?:[.)]\s*|\s+)|[IVX]+[.)]\s*)(?=\S)/

function stripHeadingNumber(element) {
  if (isMeasurement || element.dataset.wikiUnnumbered) return
  element.dataset.wikiUnnumbered = 'true'
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  let node
  while ((node = walker.nextNode())) {
    if (!node.textContent.trim() || node.parentElement.closest('button, .wiki-toc-toggle')) continue
    if (/^\s*\d+(?:\.\d+)*[.)]?\s*$/.test(node.textContent) && node.parentElement !== element) {
      node.parentElement.classList.add('wiki-number-label')
      continue
    }
    node.textContent = node.textContent.replace(numberPrefix, '')
    break
  }
}

function wrapTable(table) {
  table.querySelectorAll('th,td').forEach(cell => {
    if (cell.dataset.wikiWords) return
    cell.dataset.wikiWords = 'true'
    // A token may cross italic, link, subscript or superscript nodes. Keep the
    // whole token together instead of allowing a break at an inline boundary.
    const blocks = cell.querySelectorAll('p,li')
    for (const block of blocks.length ? blocks : [cell]) {
      const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT)
      const nodes = [], parts = []
      let offset = 0
      while (walker.nextNode()) {
        const text = walker.currentNode
        if (text.nodeType===Node.ELEMENT_NODE) {
          if (text.tagName==='BR') {parts.push('\n');offset+=1}
          continue
        }
        if (text.parentElement.closest('math,svg,script,style')) continue
        nodes.push({text,start:offset,end:offset+text.length})
        parts.push(text.textContent); offset += text.length
      }
      const tokens = [...parts.join('').matchAll(/\S+/g)].reverse()
      for (const token of tokens) {
        const start = nodes.find(n=>n.start<=token.index && n.end>token.index)
        const endOffset = token.index+token[0].length
        const end = nodes.find(n=>n.start<endOffset && n.end>=endOffset)
        if (!start || !end) continue
        const range = document.createRange()
        range.setStart(start.text,token.index-start.start)
        range.setEnd(end.text,endOffset-end.start)
        const word = document.createElement('span')
        word.className = 'wiki-table-token'
        word.append(range.extractContents())
        range.insertNode(word)
      }
    }
  })
  const headers = table.querySelectorAll('thead th, thead td')
  if (headers.length) headers.forEach(cell => { cell.classList.add('wiki-table-heading'); cell.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode(' '))) })
  else {
    const row = table.querySelector('tr')
    if (row && [...row.children].every(cell => cell.tagName === 'TH')) [...row.children].forEach(cell => cell.classList.add('wiki-table-heading'))
  }
  if (!table.parentElement.classList.contains('wiki-table-scroll')) {
    const parent = table.parentElement
    const existing = parent.matches('.table-wrap,.table-scroll,.research-table-wrap,.measurement-table-wrap,.hw-table-wrap,.drylab-table-wrap,.document-table-wrap,.notebook-table-wrap')
    const wrapper = existing ? parent : document.createElement('div')
    wrapper.className = 'wiki-table-scroll'
    wrapper.tabIndex = 0
    wrapper.setAttribute('role', 'region')
    wrapper.setAttribute('aria-label', table.getAttribute('aria-label') || 'Scrollable table')
    if (!existing) { table.before(wrapper); wrapper.append(table) }
  }
}

function enhanceReferences() {
  document.querySelectorAll('main ol').forEach(list => {
    if (!list.matches('[class*="reference"]') && !list.closest('[id*="reference"], [class*="reference"]')) return
    list.classList.add('wiki-bracket-references')
    for (const li of list.children) if (/^\s*\[\d+/.test(li.textContent)) li.classList.add('wiki-reference-prefixed')
  })
  document.querySelectorAll('main .reference-entry, main [id*="reference"] > p, main .research-reference > div > p').forEach((p,index) => {
    if (p.dataset.wikiReference || /^\s*\[[^\]]+\]/.test(p.textContent) || !p.textContent.trim()) return
    p.dataset.wikiReference = 'true'
    p.prepend(document.createTextNode(`[${index+1}] `))
  })
}

function makePdfFold(href, title) {
  const fold = document.createElement('details')
  fold.className = 'wiki-pdf-fold'
  fold.dataset.wikiPdfUrl = href
  const summary = document.createElement('summary')
  summary.textContent = title.replace(/\s*[↗↓]\s*$/,'').replace(/^Open\s+(?:the\s+)?/i,'') || 'PDF document'
  if (!keepDownloadLinks) summary.textContent = summary.textContent.replace(/^Download\s+(?:the\s+)?/i, '')
  const body = document.createElement('div')
  body.className = 'wiki-pdf-body'
  const reader = document.createElement('iframe')
  reader.className = 'wiki-pdf-reader'
  reader.title = `${summary.textContent} — PDF reader`
  const actions = document.createElement('p')
  actions.className = 'wiki-pdf-actions'
  const open = document.createElement('a')
  open.href = href
  open.target = '_blank'; open.rel = 'noopener'; open.textContent = 'Open original PDF'
  actions.append(open)
  if (keepDownloadLinks) {
    const download = document.createElement('a')
    download.href = href; download.download = ''; download.textContent = 'Download PDF'
    actions.append(download)
  }
  body.append(reader, actions); fold.append(summary,body)
  fold.addEventListener('toggle',()=>{ if (fold.open && !reader.src) reader.src = href.split('#')[0]+'#toolbar=1&navpanes=0&view=FitH' })
  return fold
}

function enhancePdfs() {
  // The two Software manuals become full-width disclosure readers; APK stays.
  document.querySelectorAll('.sw-manual-card').forEach(card => {
    const link = card.querySelector('a[href*=".pdf"]')
    if (!link) return
    const fold = makePdfFold(link.href, card.querySelector('h3')?.textContent || link.textContent)
    const description = card.querySelectorAll('p')[1]
    if (description) fold.querySelector('.wiki-pdf-body').prepend(description)
    card.querySelectorAll('.sw-manual-cover,.sw-actions,.sw-kicker,h3').forEach(el=>el.remove())
    card.prepend(fold)
  })
  document.querySelectorAll('main .hw-guides > .hw-guide').forEach(guide => {
    const link = guide.querySelector('a[href*=".pdf"]')
    if (!link) return
    const fold = makePdfFold(link.href,guide.querySelector('h3,h4')?.textContent || link.textContent)
    guide.replaceWith(fold)
  })
  const links = [...document.querySelectorAll('main a[href]')].filter(a => /\.pdf(?:[?#]|$)/i.test(a.href) && !a.closest('.wiki-pdf-fold'))
  const made = new Map()
  for (const link of links) {
    if (!link.isConnected) continue
    const section = link.closest('section,article') || document.querySelector('main')
    if (!made.has(section)) made.set(section,new Map())
    const existing = made.get(section).get(link.href)
    if (existing) { link.dataset.wikiPdfTarget = existing.dataset.wikiPdfUrl; link.addEventListener('click',e=>{e.preventDefault();existing.open=true;existing.scrollIntoView({behavior:'smooth',block:'start'})}); continue }
    const title = link.querySelector('h3,strong')?.textContent || link.textContent.trim() || link.getAttribute('aria-label')
    const fold = makePdfFold(link.href,title)
    made.get(section).set(link.href,fold)
    if (link.parentElement.matches('.resource-grid,.evidence-strip,.hw-crosslinks')) link.replaceWith(fold)
    else {
      const block = link.closest('p,.evidence-bridge')
      if (block && block.childElementCount===1 && block.textContent.trim()===link.textContent.trim()) block.replaceWith(fold)
      else if (block) { block.after(fold); link.dataset.wikiPdfTarget=fold.dataset.wikiPdfUrl; link.addEventListener('click',e=>{e.preventDefault();fold.open=true;fold.scrollIntoView({behavior:'smooth',block:'start'})}) }
      else link.replaceWith(fold)
    }
  }
  // Image-based Hardware readers are superseded by the native PDF disclosures.
  document.querySelectorAll('.hw-pdf-reader').forEach(reader=>reader.remove())
  // Activity plans in Open resources start expanded; B14 prototype guides keep
  // their deliberate disclosure so the green prototype panel stays compact.
  document.querySelectorAll('#resources .wiki-pdf-fold').forEach(fold => {
    if (!fold.closest('.gene-wars-guides')) fold.open = true
  })
}

function removeAuxiliaryDownloads() {
  if (keepDownloadLinks) return
  // PDF source links are converted first so their original readers remain.
  document.querySelectorAll('main a[href], footer a[href]').forEach(link => {
    if (!link.hasAttribute('download') && !/^(?:Download\b|下载)/i.test(link.textContent.trim())) return
    const parent = link.parentElement
    const previous = link.previousSibling, next = link.nextSibling
    if (previous?.nodeType === Node.TEXT_NODE) previous.textContent = previous.textContent.replace(/\s*[·|]\s*$/, '')
    else if (next?.nodeType === Node.TEXT_NODE) next.textContent = next.textContent.replace(/^\s*[·|]\s*/, '')
    link.remove()
    if (parent.matches('p,li') && !parent.children.length && !parent.textContent.trim()) parent.remove()
  })
}

function enhanceLinks() {
  document.querySelectorAll('main a[href], footer a[href]').forEach(link => {
    if (link.closest('.wiki-directory, .team-jumps, video') || link.matches('.team-scroll-cue') || !link.textContent.trim() || link.querySelector('img') || link.classList.contains('wiki-jump-link')) return
    link.style.setProperty('--wiki-link-size', `${(parseFloat(getComputedStyle(link).fontSize)||16)+2}px`)
    link.classList.add('wiki-jump-link')
    // Keep inline button labels and text arrows in one text run so the flex
    // gap cannot split the underline. Existing nodes and links stay intact.
    if (['flex', 'inline-flex'].includes(getComputedStyle(link).display) && link.children.length &&
        getComputedStyle(link).textDecorationLine.includes('underline') &&
        [...link.children].every(child => child.matches('span,strong,b,em,i,small') && !child.querySelector('svg,img,div,p,ul,ol'))) {
      const label = document.createElement('span')
      label.className = 'wiki-link-label'
      label.append(...link.childNodes)
      link.append(label)
    }
  })
}

const articleVideos = [...document.querySelectorAll('main video')]
for (const video of articleVideos) {
  const figure = video.closest('figure')
  figure?.querySelectorAll('figcaption a').forEach(a=>{if (/open video/i.test(a.textContent)) {const previous=a.previousSibling;if(previous?.nodeType===Node.TEXT_NODE)previous.textContent=previous.textContent.replace(/\s*·\s*$/,'');a.remove()}})
}

document.querySelectorAll('main table').forEach(wrapTable)
const articleMain=document.querySelector('main')
if(articleMain)new MutationObserver(records=>{
  const tables=new Set()
  for(const record of records){
    if(record.target instanceof Element){const table=record.target.closest('table');if(table)tables.add(table)}
    for(const node of record.addedNodes)if(node instanceof Element){if(node.matches('table'))tables.add(node);node.querySelectorAll('table').forEach(t=>tables.add(t))}
  }
  tables.forEach(wrapTable)
}).observe(articleMain,{childList:true,subtree:true})
document.querySelectorAll('main img').forEach(image=>image.parentElement.classList.add('wiki-image-host'))
document.querySelectorAll('main figcaption, main caption, main [class*="table-caption"], main [class*="figure-caption"]').forEach(el=>el.dataset.wikiCaption='true')
document.querySelectorAll('main h2,main h3,main h4,main h5,main h6,main details > summary').forEach(el=>{
  if (!el.closest('.home-story, .member-card, .wiki-pdf-fold')) stripHeadingNumber(el)
})
enhanceReferences()
enhancePdfs()
removeAuxiliaryDownloads()
enhanceLinks()

let scheduled = false, directoryEntries = []
const followedDirectoryGroups = new WeakMap()
const directoryMouse = window.matchMedia('(hover: hover) and (pointer: fine)')

function followCurrentChapter(toc, current, threshold) {
  // Let readers choose a destination without moving entries under the pointer
  // or keyboard focus. Apply the latest chapter when they leave the directory.
  if ((directoryMouse.matches && toc.matches(':hover')) || toc.querySelector(':focus-visible')) return
  const tocBox = toc.getBoundingClientRect()
  const narrow = innerWidth <= 900
  if (narrow && tocBox.bottom > threshold) return

  const targetTop = current.target.getBoundingClientRect().top
  const main = current.target.closest('main')
  const inArticle = targetTop < innerHeight && (!main || main.getBoundingClientRect().bottom > threshold)
  const group = inArticle ? current.link.closest('.wiki-toc-group, .engineering-toc-group') : null
  if (followedDirectoryGroups.has(toc) && followedDirectoryGroups.get(toc) === group) return

  followedDirectoryGroups.set(toc, group)
  toc.querySelectorAll('.wiki-toc-group, .engineering-toc-group').forEach(item => {
    setDirectoryGroupOpen(item, item === group)
  })

  // Mobile directories sit above the article. Preserve the reading position
  // when their expanded height changes, including browsers with scroll anchoring.
  if (narrow) {
    const shift = current.target.getBoundingClientRect().top - targetTop
    if (Math.abs(shift) > .5) window.scrollBy({ top: shift, behavior: 'instant' })
  }
}

function updateDirectories() {
  scheduled = false
  for (const {toc,links} of directoryEntries) {
    const candidates = links.filter(({target}) => target.getClientRects().length && !target.closest('[hidden]'))
    if (!candidates.length) continue
    const threshold = Math.min(240, innerHeight * .25)
    const passed = candidates.filter(({target})=>target.getBoundingClientRect().top<=threshold)
    const current = passed.length ? passed.reduce((last,item)=>item.target.getBoundingClientRect().top>=last.target.getBoundingClientRect().top?item:last) : candidates[0]
    links.forEach(({link})=>{
      link.classList.toggle('is-active',link===current.link)
      link.classList.toggle('active',link===current.link)
      if(link===current.link) { if(link.getAttribute('aria-current')!=='location') link.setAttribute('aria-current','location') }
      else if(link.hasAttribute('aria-current')) link.removeAttribute('aria-current')
    })
    toc.querySelectorAll('.wiki-toc-group').forEach(group=>group.classList.toggle('is-current',group.contains(current.link)))
    toc.querySelectorAll('.engineering-toc-group').forEach(group=>group.classList.toggle('is-current',group.contains(current.link)))
    followCurrentChapter(toc, current, threshold)
  }
}
function scheduleDirectories() { if (!scheduled) {scheduled=true;requestAnimationFrame(updateDirectories)} }
function refreshDirectories() {
  directoryEntries=[...document.querySelectorAll(directorySelector)].map(toc=>{
    const links=[...toc.querySelectorAll('a[href*="#"]')].flatMap(link=>{
      stripHeadingNumber(link)
      const url=new URL(link.href,location.href)
      if(url.pathname!==location.pathname||!url.hash)return []
      const target=document.getElementById(decodeURIComponent(url.hash.slice(1)))
      return target ? [{link,target}] : []
    })
    return {toc,links}
  })
  scheduleDirectories()
}
function centerDirectories() {
  for(const {toc} of directoryEntries){
    toc.style.setProperty('--wiki-directory-offset','0px')
    if(innerWidth<=900)continue
    const frame=toc.parentElement
    const siblings=[...frame.children].filter(el=>el!==toc&&!el.matches('script,style')&&el.getBoundingClientRect().width>0)
    const content=siblings.find(el=>el.getBoundingClientRect().left>toc.getBoundingClientRect().left)
    if(!content)continue
    const rect=toc.getBoundingClientRect(), left=content.getBoundingClientRect().left
    const offset=Math.max(8,(left-rect.width)/2)-rect.left
    toc.style.setProperty('--wiki-directory-offset',`${offset}px`)
  }
}
refreshDirectories()
requestAnimationFrame(centerDirectories)
document.querySelectorAll(directorySelector).forEach(toc=>{
  toc.addEventListener('pointerleave', scheduleDirectories)
  toc.addEventListener('focusout', () => requestAnimationFrame(scheduleDirectories))
  new MutationObserver(()=>{refreshDirectories();enhanceLinks()}).observe(toc,{childList:true,subtree:true})
  // Legacy page trackers still own their keyboard and disclosure behaviour;
  // settle their location attributes to the same visible-section convention.
  new MutationObserver(scheduleDirectories).observe(toc,{attributes:true,attributeFilter:['aria-current'],subtree:true})
})
window.addEventListener('scroll',scheduleDirectories,{passive:true})
window.addEventListener('resize',()=>{centerDirectories();scheduleDirectories()},{passive:true})
window.addEventListener('hashchange',scheduleDirectories)
document.addEventListener('toggle',scheduleDirectories,true)
document.addEventListener('click',()=>requestAnimationFrame(scheduleDirectories))

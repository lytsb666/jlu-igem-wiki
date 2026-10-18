// Standardize caption labels without flattening scientific markup or links.
const captionSelector = 'figcaption,caption,[data-wiki-caption],[class*="table-caption"],[class*="figure-caption"],.video-caption,[data-video-caption]'
const videoSelector = 'video,iframe[src*="video.igem.org/videos/embed/"]'
const labelPrefix = /^\s*(Figures?|Fig\.?|Tables?|图|表)\s*(?:(\d+(?:[-.]\d+)*[a-z]?)(?=\s|[.:：·|—–-]|$))?\s*[.:：·|—–-]?\s*/i
const scopes = new Map()

function captionSubject(caption) {
  const table = caption.closest('table')
  if (table) return {subject: table, kind: 'Table'}
  const figure = caption.closest('figure')
  if (figure) {
    // A supplied timetable or data grid may be stored as an image.
    if (figure.dataset.wikiMediaKind === 'table') return {subject: figure, kind: 'Table'}
    const tables = figure.querySelectorAll('table')
    const outsideMedia = [...figure.querySelectorAll('img,picture,svg,canvas,video,iframe')]
      .some(media => !media.closest('table'))
    if (tables.length === 1 && !outsideMedia) {
      return {subject: tables[0], kind: 'Table'}
    }
    if (!tables.length && figure.querySelector('img,picture,svg,canvas,[role="img"]')) return {subject: figure, kind: 'Figure'}
    return {subject: figure}
  }
  // Existing standalone table labels precede their actual table container.
  const next = caption.nextElementSibling
  if (next?.matches('table,.wiki-table-scroll,.table-scroll,.table-wrap')) {
    const table = next.matches('table') ? next : next.querySelector('table')
    if (table) return {subject: table, kind: 'Table'}
  }
  return {subject: caption}
}

function refreshImagePresentation(main) {
  if (document.body.classList.contains('ihp-manuscript-page')) return
  const plainHosts = new Set()
  const images = [...main.querySelectorAll('img')]
  for (const image of images) {
    const figure = image.closest('figure')
    const caption = figure?.querySelector(':scope > figcaption')
    const captioned = Boolean(caption?.textContent.trim() && caption.dataset.wikiCaptionKind !== 'Table')
    image.classList.toggle('wiki-captioned-image', captioned)
    image.classList.toggle('wiki-uncaptioned-image', !captioned)
  }
  for (const image of images) {
    // Only remove decoration from dedicated picture wrappers. Cards, controls,
    // scene positioning and carousel/portrait transforms keep their own roles.
    if (image.classList.contains('wiki-uncaptioned-image')) {
      let host = image.parentElement
      while (host && host !== main && host.matches('picture,figure,a,button,div,span')) {
        if (host.textContent.trim() || host.querySelector('figcaption,caption,video,iframe,table,input,select,textarea')) break
        if ([...host.querySelectorAll('img')].every(img => img.classList.contains('wiki-uncaptioned-image'))) plainHosts.add(host)
        host = host.parentElement
      }
    }
  }
  for (const host of main.querySelectorAll('.wiki-uncaptioned-image-host')) {
    if (!plainHosts.has(host)) host.classList.remove('wiki-uncaptioned-image-host')
  }
  plainHosts.forEach(host => host.classList.add('wiki-uncaptioned-image-host'))
}

function removeVideoCaptions(main) {
  const captions = new Set(main.querySelectorAll('.video-caption,[data-video-caption]'))
  for (const video of main.querySelectorAll(videoSelector)) {
    const figure = video.closest('figure')
    const container = figure && !figure.querySelector('img,picture,svg,canvas')
      ? figure : video.closest('.wiki-video-player,.home-promotion-player') || video
    // Cover labels above and below the player, including sibling captions.
    container.querySelectorAll(captionSelector).forEach(caption => captions.add(caption))
    for (const sibling of [container.previousElementSibling, container.nextElementSibling]) {
      if (sibling?.matches(captionSelector) && !sibling.querySelector('img,table,video,iframe')) captions.add(sibling)
    }
  }
  captions.forEach(caption => caption.remove())
}

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
  const {subject, kind: mediaKind} = captionSubject(caption)
  const kind = mediaKind || (prefix ? /^(?:Table|表)/i.test(prefix[1]) ? 'Table' : 'Figure'
    : caption.matches('caption,[class*="table-caption"]') ? 'Table' : 'Figure')
  const scope = caption.closest('[data-model-module]') || document.querySelector('main')
  if (!scopes.has(scope)) scopes.set(scope, new Map())
  const states = scopes.get(scope)
  if (!states.has(kind)) states.set(kind, {used: new Set(), next: 1, numbers: new WeakMap()})
  const state = states.get(kind)
  return {caption, nodes, prefix, kind, subject, state}
}

function format(captions) {
  const records = [...new Set(captions)]
    .filter(caption => caption.isConnected && !caption.parentElement.closest(captionSelector))
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
    if (last) last.data = last.data.replace(/[.。]\s*$/, '')
  }
}

const main = document.querySelector('main')
if (main) {
  removeVideoCaptions(main)
  format(main.querySelectorAll(captionSelector))
  refreshImagePresentation(main)
  let imageFrame = 0
  new MutationObserver(records => {
    // Media and labels can also arrive after the shared scripts initialize.
    if (records.some(({addedNodes}) => [...addedNodes].some(node => node instanceof Element))) removeVideoCaptions(main)
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
    if (!imageFrame) imageFrame = requestAnimationFrame(() => {
      imageFrame = 0
      refreshImagePresentation(main)
    })
  }).observe(main, {childList: true, subtree: true})
}

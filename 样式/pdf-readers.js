// In development this module lives in 样式/; in builds it lives in assets/.
const readerPath = '../pdf-viewer/index.htm'
const maxActiveReaders = 2

export function installPdfReaders() {
  const records = [...document.querySelectorAll('main .wiki-pdf-fold[data-wiki-pdf-url]')].map(fold => ({
    fold,
    frame: fold.querySelector('.wiki-pdf-reader'),
    file: new URL(fold.dataset.wikiPdfUrl, location.href),
    position: '',
    near: false,
  })).filter(record => record.frame)
  if (!records.length) return

  const byFold = new Map(records.map(record => [record.fold, record]))
  let scheduled = false
  function schedule() {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(() => { scheduled = false; update() })
  }
  function suspend(record) {
    if (!record.frame.hasAttribute('src')) return
    // Navigating to about:blank destroys the iframe's canvases and PDF worker.
    record.frame.removeAttribute('src')
    delete record.fold.dataset.pdfActive
  }
  function update() {
    const candidates = records.filter(record => record.fold.open && record.near).map(record => {
      const rect = record.frame.getBoundingClientRect()
      const visible = Math.max(0, Math.min(innerHeight, rect.bottom) - Math.max(0, rect.top))
      const focused = visible > 0 && document.activeElement === record.frame
      return { record, score: focused ? -Infinity : Math.abs((rect.top + rect.bottom) / 2 - innerHeight / 2) - visible * 2, rendered: rect.width > 0 && rect.height > 0 }
    }).filter(candidate => candidate.rendered).sort((a, b) => a.score - b.score)
    const selected = new Set(candidates.slice(0, maxActiveReaders).map(candidate => candidate.record))
    for (const record of records) if (!selected.has(record)) suspend(record)
    for (const record of selected) {
      if (record.frame.hasAttribute('src')) continue
      const url = new URL(readerPath, import.meta.url)
      url.searchParams.set('file', record.file.href)
      url.searchParams.set('title', record.fold.querySelector('summary').textContent.trim())
      url.hash = record.position
      record.frame.src = url.href
      record.fold.dataset.pdfActive = 'true'
    }
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) byFold.get(entry.target).near = entry.isIntersecting
    schedule()
  }, { rootMargin: '400px 0px', threshold: [0, .25, .75, 1] })
  for (const { fold } of records) {
    observer.observe(fold)
    fold.addEventListener('toggle', schedule)
  }
  // An enclosing disclosure can hide an otherwise open document.
  document.addEventListener('toggle', schedule, true)
  let scrollTimer
  addEventListener('scroll', () => {
    if (scrollTimer) return
    scrollTimer = setTimeout(() => { scrollTimer = null; schedule() }, 80)
  }, { passive: true })
  addEventListener('resize', schedule, { passive: true })
  addEventListener('message', event => {
    if (event.origin !== location.origin || event.data?.type !== 'wiki-pdf:position') return
    const record = records.find(item => item.frame.contentWindow === event.source)
    if (!record || event.data.file !== record.file.href || typeof event.data.hash !== 'string' || event.data.hash.length > 1024) return
    record.position = event.data.hash
  })
  addEventListener('pagehide', () => records.forEach(suspend))
  addEventListener('pageshow', schedule)
}

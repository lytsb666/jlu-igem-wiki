const status = document.querySelector('#status')
const input = document.querySelector('#page')
const previous = document.querySelector('#previous')
const next = document.querySelector('#next')
const toolbar = document.querySelector('.toolbar')
const container = document.querySelector('#container')
new ResizeObserver(() => document.body.style.setProperty('--toolbar-height', `${toolbar.offsetHeight}px`)).observe(toolbar)

let loadingTask
let viewer
let disposed = false
addEventListener('pagehide', event => {
  // Preserve a standalone reader restored by browser Back/Forward cache.
  if (event.persisted) return
  disposed = true
  viewer?.setDocument(null)
  loadingTask?.destroy()
})

try {
  const params = new URLSearchParams(location.search)
  const siteRoot = new URL('../', location.href)
  const file = new URL(params.get('file') || '', siteRoot)
  // The official wiki stores this team's documents on iGEM's media host.
  const localDocument = file.origin === location.origin && file.pathname.startsWith(siteRoot.pathname)
  const officialDocument = file.origin === 'https://static.igem.wiki' && file.pathname.startsWith('/teams/6074/wiki/')
  if ((!localDocument && !officialDocument) || !/\.pdf$/i.test(file.pathname) || file.search || file.hash) throw new Error('Invalid document address')
  document.title = params.get('title') || 'Document reader'
  container.setAttribute('aria-label', document.title)
  document.querySelector('#original').href = file.href
  const libraryUrl = './vendor/build/pdf.min.mjs'
  const pdfjs = await import(/* @vite-ignore */ libraryUrl)
  globalThis.pdfjsLib = pdfjs
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/build/pdf.worker.min.mjs', location.href).href
  loadingTask = pdfjs.getDocument({
    url: file.href,
    cMapUrl: new URL('./vendor/cmaps/', location.href).href,
    cMapPacked: true,
    standardFontDataUrl: new URL('./vendor/standard_fonts/', location.href).href,
    wasmUrl: new URL('./vendor/wasm/', location.href).href,
    isEvalSupported: false,
    disableAutoFetch: true,
    disableStream: true,
  })
  // Start fetching the PDF while the viewer module initializes.
  loadingTask.promise.catch(() => {})
  const componentsUrl = './vendor/web/pdf_viewer.mjs'
  const { EventBus, PDFLinkService, PDFViewer } = await import(/* @vite-ignore */ componentsUrl)
  if (disposed) throw new Error('Reader closed')
  const eventBus = new EventBus()
  const linkService = new PDFLinkService({ eventBus, externalLinkTarget: 2, externalLinkRel: 'noopener noreferrer' })
  viewer = new PDFViewer({
    container, viewer: document.querySelector('#viewer'), eventBus, linkService,
    // Bound HiDPI canvas allocations while retaining vector text and zoom.
    maxCanvasPixels: matchMedia('(max-width: 600px)').matches ? 4194304 : 8388608,
  })
  linkService.setViewer(viewer)
  const syncPage = () => {
    input.value = viewer.currentPageNumber
    previous.disabled = viewer.currentPageNumber <= 1
    next.disabled = viewer.currentPageNumber >= viewer.pagesCount
  }
  eventBus.on('pagesinit', () => {
    viewer.currentScaleValue = 'page-width'
    if (location.hash) linkService.setHash(location.hash.slice(1))
    toolbar.querySelectorAll('button,input').forEach(control => control.disabled = false)
    syncPage()
  })
  eventBus.on('pagechanging', syncPage)
  eventBus.on('updateviewarea', event => {
    if (parent !== window) parent.postMessage({ type: 'wiki-pdf:position', file: file.href, hash: event.location.pdfOpenParams }, location.origin)
  })
  eventBus.on('pagerendered', event => {
    if (event.error) { showError(event.error); return }
    status.hidden = true
    document.body.dataset.rendered = 'true'
  })
  previous.onclick = () => { if (viewer.currentPageNumber > 1) viewer.currentPageNumber-- }
  next.onclick = () => { if (viewer.currentPageNumber < viewer.pagesCount) viewer.currentPageNumber++ }
  input.onchange = () => { viewer.currentPageNumber = Math.max(1, Math.min(viewer.pagesCount, Number(input.value) || 1)); syncPage() }
  document.querySelector('#smaller').onclick = () => { viewer.currentScale = Math.max(.25, viewer.currentScale / 1.2) }
  document.querySelector('#larger').onclick = () => { viewer.currentScale = Math.min(4, viewer.currentScale * 1.2) }
  document.querySelector('#fit').onclick = () => { viewer.currentScaleValue = 'page-width' }
  let resizeTimer
  addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => { if (viewer.currentScaleValue === 'page-width') viewer.currentScaleValue = 'page-width' }, 100)
  })
  const pdf = await loadingTask.promise
  if (disposed) throw new Error('Reader closed')
  document.querySelector('#total').textContent = `/ ${pdf.numPages}`
  input.max = pdf.numPages
  linkService.setDocument(pdf)
  viewer.setDocument(pdf)
} catch (error) {
  if (!disposed) showError(error)
}

function showError(error) {
  status.hidden = false
  status.textContent = 'Unable to load this document. '
  const retry = document.createElement('button')
  retry.type = 'button'
  retry.textContent = 'Retry'
  retry.onclick = () => location.reload()
  status.append(retry)
  document.body.dataset.error = 'true'
  console.error('Document reader:', error)
}

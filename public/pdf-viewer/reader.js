const status = document.querySelector('#status')
const input = document.querySelector('#page')
const previous = document.querySelector('#previous')
const next = document.querySelector('#next')
const toolbar = document.querySelector('.toolbar')
new ResizeObserver(() => document.body.style.setProperty('--toolbar-height', `${toolbar.offsetHeight}px`)).observe(toolbar)

try {
  const params = new URLSearchParams(location.search)
  const file = new URL(params.get('file') || '', location.origin)
  if (file.origin !== location.origin || !/^\/ihp-resources\/.+\.pdf$/i.test(file.pathname)) throw new Error('Invalid document address')
  document.title = params.get('title') || 'Document reader'
  document.querySelector('#container').setAttribute('aria-label', document.title)
  document.querySelector('#original').href = file.href
  const libraryUrl = '/pdf-viewer/vendor/build/pdf.mjs'
  const pdfjs = await import(/* @vite-ignore */ libraryUrl)
  globalThis.pdfjsLib = pdfjs
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-viewer/vendor/build/pdf.worker.mjs'
  const componentsUrl = '/pdf-viewer/vendor/web/pdf_viewer.mjs'
  const { EventBus, PDFLinkService, PDFViewer } = await import(/* @vite-ignore */ componentsUrl)
  const eventBus = new EventBus()
  const linkService = new PDFLinkService({ eventBus })
  const viewer = new PDFViewer({ container: document.querySelector('#container'), viewer: document.querySelector('#viewer'), eventBus, linkService })
  linkService.setViewer(viewer)
  const syncPage = () => {
    input.value = viewer.currentPageNumber
    previous.disabled = viewer.currentPageNumber <= 1
    next.disabled = viewer.currentPageNumber >= viewer.pagesCount
  }
  eventBus.on('pagesinit', () => { viewer.currentScaleValue = 'page-width'; syncPage() })
  eventBus.on('pagechanging', syncPage)
  eventBus.on('pagerendered', () => { status.hidden = true; document.body.dataset.rendered = 'true' })
  previous.onclick = () => { if (viewer.currentPageNumber > 1) viewer.currentPageNumber-- }
  next.onclick = () => { if (viewer.currentPageNumber < viewer.pagesCount) viewer.currentPageNumber++ }
  input.onchange = () => { viewer.currentPageNumber = Math.max(1, Math.min(viewer.pagesCount, Number(input.value) || 1)); syncPage() }
  document.querySelector('#smaller').onclick = () => { viewer.currentScale = Math.max(.25, viewer.currentScale / 1.2) }
  document.querySelector('#larger').onclick = () => { viewer.currentScale = Math.min(4, viewer.currentScale * 1.2) }
  document.querySelector('#fit').onclick = () => { viewer.currentScaleValue = 'page-width' }
  let resizeTimer
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (viewer.currentScaleValue === 'page-width') viewer.currentScaleValue = 'page-width' }, 100) })
  const pdf = await pdfjs.getDocument({ url: file.href, cMapUrl: '/pdf-viewer/vendor/cmaps/', cMapPacked: true, standardFontDataUrl: '/pdf-viewer/vendor/standard_fonts/', wasmUrl: '/pdf-viewer/vendor/wasm/', isEvalSupported: false }).promise
  document.querySelector('#total').textContent = `/ ${pdf.numPages}`
  input.max = pdf.numPages
  viewer.setDocument(pdf)
  linkService.setDocument(pdf)
} catch (error) {
  status.hidden = false
  status.textContent = 'Unable to load this document. '
  const retry = document.createElement('button')
  retry.textContent = 'Retry'
  retry.onclick = () => location.reload()
  status.append(retry)
  document.body.dataset.error = 'true'
  console.error('Document reader:', error)
}

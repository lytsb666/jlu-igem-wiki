import './media-presentation.css'
import settings from '../assets/media-presentation-20261018/settings.json'
import entries from '../assets/media-presentation-20261018/entries.js'

const version = '20261018'
const originals = new Map(entries.map(entry => [new URL(entry.url, location.href).href, entry]))
const records = new Map(), marked = new Set()
let enabled = false, scanning = false
const protectedArea = '.wiki-headpage,.image-page-hero,.page-hero,.team-hero,.home-story,.home-cover,.cover-stage,.story-stage,.member-card,.activity-atlas,.sw-floating-illustration'
const frameSelector = '.research-plot-frame,.model-hardware-figure__frame,.hw-crop-window'

function mark(element, name) { element.setAttribute(name, ''); marked.add(element) }
function set(record, element, name, value) {
  if (!record.styles.some(s => s.element === element && s.name === name)) record.styles.push({element, name, value: element.style.getPropertyValue(name), priority: element.style.getPropertyPriority(name)})
  element.style.setProperty(name, value)
}
function restore(record) {
  for (const s of record.styles) {
    if (s.value) s.element.style.setProperty(s.name, s.value, s.priority)
    else s.element.style.removeProperty(s.name)
  }
  for (const element of record.attributes) for (const name of ['data-wiki-media-paper','data-wiki-media-cropped','data-wiki-media-window','data-wiki-media-adjusted']) element.removeAttribute(name)
}

function whiteFilter() {
  if (document.getElementById('wiki-paper-alpha-20261018')) return
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('aria-hidden', 'true')
  svg.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none'
  // Remove only pixels whose R, G and B are all exactly white. Every non-white
  // source pixel keeps its original colour, including faint scientific lines.
  svg.innerHTML = `<defs><filter id="wiki-paper-alpha-20261018" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feComponentTransfer in="SourceGraphic" result="channels"><feFuncR type="linear" slope="255" intercept="-254"/><feFuncG type="linear" slope="255" intercept="-254"/><feFuncB type="linear" slope="255" intercept="-254"/></feComponentTransfer>
    <feColorMatrix in="channels" result="red" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0"/>
    <feColorMatrix in="channels" result="green" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0"/>
    <feColorMatrix in="channels" result="blue" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0"/>
    <feComposite in="red" in2="green" operator="in" result="rg"/><feComposite in="rg" in2="blue" operator="in" result="paper"/>
    <feComposite in="SourceGraphic" in2="paper" operator="out"/>
  </filter></defs>`
  document.body.append(svg)
}

function preserveWhiteForeground(entry) {
  const id = `wiki-paper-preserve-${entry.index}`
  if (document.getElementById(id)) return `url(#${id})`
  const ns = 'http://www.w3.org/2000/svg'
  const filter = document.getElementById('wiki-paper-alpha-20261018').cloneNode(true)
  filter.id = id
  const image = document.createElementNS(ns, 'feImage')
  const rects = entry.protect.map(([x,y,w,h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="white"/>`).join('')
  const mask = `<svg xmlns="${ns}" viewBox="0 0 ${entry.size[0]} ${entry.size[1]}">${rects}</svg>`
  image.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(mask)}`)
  for (const [key,value] of Object.entries({x:'0',y:'0',width:'100%',height:'100%',preserveAspectRatio:'none',result:'foreground'})) image.setAttribute(key,value)
  const composite = document.createElementNS(ns, 'feComposite')
  for (const [key,value] of Object.entries({in:'paper',in2:'foreground',operator:'out',result:'background-only'})) composite.setAttribute(key,value)
  const final = filter.lastElementChild
  filter.insertBefore(image, final); filter.insertBefore(composite, final)
  final.setAttribute('in2', 'background-only')
  document.getElementById('wiki-paper-alpha-20261018').parentElement.append(filter)
  return `url(#${id})`
}

function nearWhiteFilter() {
  const id = 'wiki-near-white-paper-20261018'
  if (!document.getElementById(id)) {
    // This audited schematic has a 252–255 paper texture, rather than flat
    // white. Its grey strands and pale blue complex remain below this range.
    const filter = document.getElementById('wiki-paper-alpha-20261018').cloneNode(true)
    filter.id = id
    const values = Array.from({length:256}, (_, i) => i >= 250 ? 1 : 0).join(' ')
    for (const func of filter.querySelectorAll('feFuncR,feFuncG,feFuncB')) {
      func.setAttribute('type', 'discrete')
      func.setAttribute('tableValues', values)
    }
    document.getElementById('wiki-paper-alpha-20261018').parentElement.append(filter)
  }
  return `url(#${id})`
}

function cleanFrame(image) {
  const figure = image.closest('figure')
  if (!figure || figure.querySelector('table,video,iframe') || image.closest(protectedArea)) return false
  mark(figure, 'data-wiki-media-figure')
  let host = image.parentElement
  while (host && host !== figure && host.matches('a,button,picture,div,span')) {
    if (host.textContent.trim() || host.querySelector('figcaption,caption,video,iframe,table,input,select,textarea')) break
    mark(host, 'data-wiki-media-host')
    host = host.parentElement
  }
  return true
}

function oldViewport(frame, size) {
  if (frame.dataset.plotViewport) return frame.dataset.plotViewport.split(',').map(Number)
  const style = frame.style
  const width = size[0] / ((parseFloat(style.getPropertyValue('--image-width')) || 100) / 100)
  const height = size[1] / ((parseFloat(style.getPropertyValue('--image-height')) || 100) / 100)
  return [-parseFloat(style.getPropertyValue('--image-left') || 0) / 100 * width, -parseFloat(style.getPropertyValue('--image-top') || 0) / 100 * height, width, height]
}

function cropExisting(record, frame, entry) {
  // Existing viewport coordinates are intersected, never wrapped a second time.
  if (frame.matches('.hw-crop-window')) return false
  const old = oldViewport(frame, entry.size), crop = entry.window
  let x = Math.max(old[0], crop[0])
  const y = Math.max(old[1], crop[1])
  let width = Math.min(old[0] + old[2], crop[0] + crop[2]) - x
  const height = Math.min(old[1] + old[3], crop[1] + crop[3]) - y
  // Scientific plot bounds are x0,y0,x1,y1. Axis labels make the source
  // margins asymmetric; trim symmetrically around the plotted box so its
  // centre stays aligned with the article, while keeping every label.
  const bounds = frame.dataset.plotBounds?.split(',').map(Number)
  if (frame.matches('.research-plot-frame') && bounds?.length === 4 && bounds.every(Number.isFinite)) {
    const center = (bounds[0] + bounds[2]) / 2
    const half = Math.max(center - x, x + width - center)
    x = center - half
    width = half * 2
  }
  if (width <= 0 || height <= 0 || width * height > old[2] * old[3] * .985) return true
  const ratio = frame.matches('.research-plot-frame') ? '--plot-ratio' : '--figure-ratio'
  set(record, frame, ratio, `${width}/${height}`)
  for (const [key, value] of Object.entries({'--image-left':-x / width * 100,'--image-top':-y / height * 100,'--image-width':entry.size[0] / width * 100,'--image-height':entry.size[1] / height * 100})) set(record, frame, key, `${value}%`)
  mark(frame, 'data-wiki-media-adjusted')
  record.attributes.push(frame)
  return true
}

function cropPlain(record, image, entry) {
  const host = image.parentElement
  if (!host.matches('a,button') || host.querySelectorAll('img').length !== 1) return
  const style = getComputedStyle(image)
  const maxHeight = style.maxHeight === 'none' ? '100000px' : style.maxHeight
  const maxWidth = style.maxWidth === 'none' ? '100000px' : style.maxWidth
  const [x, y, width, height] = entry.window
  for (const [key, value] of Object.entries({
    '--wiki-media-native-width':`${width}px`, '--wiki-media-max-height':maxHeight, '--wiki-media-max-width':maxWidth,
    '--wiki-media-ratio':String(width / height), '--wiki-media-image-width':`${entry.size[0] / width * 100}%`,
    '--wiki-media-left':`${-x / width * 100}%`, '--wiki-media-top':`${-y / height * 100}%`,
  })) set(record, host, key, value)
  mark(host, 'data-wiki-media-window'); mark(image, 'data-wiki-media-cropped')
  record.attributes.push(host, image)
}

function apply(image) {
  if (!enabled || !image.isConnected || image.closest(protectedArea) || image.dataset.wikiMediaMeasure !== undefined) return
  if (!cleanFrame(image)) return
  const url = image.currentSrc || image.src
  const old = records.get(image)
  if (old?.url === url) return
  if (old) restore(old)
  const entry = originals.get(new URL(url, location.href).href)
  if (!entry) { records.delete(image); return }
  const record = {url, styles: [], attributes: []}
  records.set(image, record)
  if (entry.paper && getComputedStyle(image).filter === 'none') {
    if (entry.nearWhite) set(record, image, '--wiki-media-paper-filter', nearWhiteFilter())
    else if (entry.protect?.length) set(record, image, '--wiki-media-paper-filter', preserveWhiteForeground(entry))
    mark(image, 'data-wiki-media-paper'); record.attributes.push(image)
  }
  if (!entry.crop) return
  const frame = image.closest(frameSelector)
  if (frame) { cropExisting(record, frame, entry); return }
  cropPlain(record, image, entry)
}

function scan() {
  scanning = false
  if (enabled) document.querySelectorAll('main figure img').forEach(apply)
}
function scheduleScan() { if (!scanning && enabled) { scanning = true; requestAnimationFrame(scan) } }
function setEnabled(value) {
  enabled = Boolean(value)
  if (enabled) { whiteFilter(); document.documentElement.dataset.wikiMediaPresentation = version; scheduleScan() }
  else {
    delete document.documentElement.dataset.wikiMediaPresentation
    records.forEach(restore); records.clear()
    for (const element of marked) for (const name of ['data-wiki-media-host','data-wiki-media-figure','data-wiki-media-paper','data-wiki-media-window','data-wiki-media-cropped','data-wiki-media-adjusted']) element.removeAttribute(name)
    marked.clear()
  }
}
document.addEventListener('load', event => { if (event.target instanceof HTMLImageElement) apply(event.target) }, true)
new MutationObserver(scheduleScan).observe(document.body, {childList: true, subtree: true})
window.wikiMediaPresentation = {setEnabled, restore: () => setEnabled(false), version}
setEnabled(settings.enabled)

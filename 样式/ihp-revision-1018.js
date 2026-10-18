import './ihp-revision-1018.css'
import clickBaize from '../assets/human-practice/revision-1018-20261018/click-baize.png'

for (const button of document.querySelectorAll('button.ihp-activity-point[data-activity-number="4"]')) {
  const hint = document.createElement('span')
  hint.className = 'ihp-click-hint'
  hint.setAttribute('aria-hidden', 'true')
  const image = document.createElement('img')
  image.src = clickBaize; image.alt = ''; image.width = 145; image.height = 139
  const label = document.createElement('span')
  label.textContent = 'click'
  hint.append(image, label)
  button.append(hint)
}

// Preserve the existing quote box at every viewport. A hidden, unmodified
// quote measures its original height before the new internal layout is used.
const quote = document.querySelector('.ihp-health-quote')
let quoteWidth = 0
function sizeQuote(force = false) {
  if (!quote) return
  const width = quote.getBoundingClientRect().width
  if (!width || (!force && Math.abs(width - quoteWidth) < .5)) return
  quoteWidth = width
  const original = quote.cloneNode(true)
  original.classList.remove('ihp-health-quote--1018')
  original.querySelector('.ihp-quote-mascot')?.remove()
  original.querySelector('.ihp-source-quote').textContent = '“Health is a human right, not a privilege, for everyone, everywhere.”'
  original.setAttribute('aria-hidden', 'true')
  original.inert = true
  original.style.cssText = `position:absolute;left:-20000px;visibility:hidden;box-sizing:border-box;width:${width}px`
  original.style.setProperty('width', `${width}px`, 'important')
  original.style.setProperty('max-width', 'none', 'important')
  quote.parentElement.append(original)
  const height = original.getBoundingClientRect().height
  original.remove()
  quote.style.setProperty('--ihp-quote-original-height', `${height}px`)
  quote.classList.add('ihp-health-quote--1018')
}
if (quote) {
  sizeQuote(true)
  new ResizeObserver(() => sizeQuote()).observe(quote.parentElement)
  document.fonts.ready.then(() => sizeQuote(true))
  addEventListener('resize', () => sizeQuote())
}

import './ihp-revision-1019.css'
import hintImage from '../assets/revision-20261019/activity-click-mascot.png'
import quoteImage from '../assets/revision-20261019/quote-mascot.png'

document.querySelectorAll('.ihp-click-hint').forEach(hint => hint.remove())
const addHint = (button, name) => {
  if (!button) return
  const hint = document.createElement('span')
  hint.className = `ihp-click-hint-1019 ${name}`
  hint.setAttribute('aria-hidden', 'true')
  const image = new Image()
  image.src = hintImage
  image.alt = ''
  const label = document.createElement('span')
  label.textContent = 'Click'
  hint.append(image, label)
  button.append(hint)
}
addHint(document.querySelector('.ihp-activity-explorer__canvas [data-activity-number="4"]'), 'ihp-hint-listen')

const oldQuoteMascot = document.querySelector('.ihp-quote-mascot')
if (oldQuoteMascot) {
  const image = new Image()
  image.className = 'ihp-quote-mascot'
  image.src = quoteImage
  image.alt = ''
  image.setAttribute('aria-hidden', 'true')
  oldQuoteMascot.replaceWith(image)
}
dispatchEvent(new Event('resize'))

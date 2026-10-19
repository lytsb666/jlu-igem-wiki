import './ihp-revision-1019.css'
import hintImage from '../assets/revision-20261019/activity-click-mascot.png'
import quoteImage from '../assets/revision-20261019/quote-mascot.png'
import walkingImage from '../assets/revision-20261019/walking-mascot.png'

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
addHint(document.querySelector('.ihp-feedback-point[data-ihp-feedback="wet-lab"]:not(.ihp-feedback-point--mobile)'), 'ihp-hint-wetlab')

const oldQuoteMascot = document.querySelector('.ihp-quote-mascot')
if (oldQuoteMascot) {
  const image = new Image()
  image.className = 'ihp-quote-mascot'
  image.src = quoteImage
  image.alt = ''
  image.setAttribute('aria-hidden', 'true')
  oldQuoteMascot.replaceWith(image)
}
const walkingMascot = document.querySelector('.ihp-walking-story__traveller')
if (walkingMascot) {
  const image = new Image()
  image.src = walkingImage
  image.alt = ''
  walkingMascot.replaceChildren(image)
}
// The manuscript's older typography layers have competing important rules.
// This latest, explicit 16pt requirement applies only to these two lines.
document.querySelectorAll('.ihp-walking-story__message p').forEach(p => p.style.setProperty('font-size', '16pt', 'important'))
dispatchEvent(new Event('resize'))

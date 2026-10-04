import './main.js'
import { teamMembers, teamFaculty } from '../Team/member-data.js'

// Static glob resolves portraits in development and in Vite's hashed builds.
const portraits = import.meta.glob('../assets/team-member/portraits/*.{webp,jpg}', {
  eager: true, query: '?url', import: 'default',
})
const memberGrid = document.querySelector('#member-grid')
const advisorSection = document.querySelector('#advisor-section')
const resultStatus = document.querySelector('#team-results')
const filters = [...document.querySelectorAll('.team-filter')]
let openedCard = null

function element(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

function portrait(person) {
  const host = element('span', 'member-photo')
  const photo = person.framingPhoto || person.photo
  if (photo && portraits[photo]) {
    const image = element('img')
    image.src = portraits[photo]
    image.alt = `${person.name} portrait`
    image.width = 800
    image.height = 1000
    image.loading = 'lazy'
    image.decoding = 'async'
    host.append(image)
  } else {
    host.classList.add('member-photo--placeholder')
    const initials = person.name.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
    const monogram = element('span', 'member-photo__initials', initials)
    monogram.setAttribute('aria-hidden', 'true')
    host.append(monogram)
  }
  return host
}

function setFlipped(card, flipped, restoreFocus = true) {
  const front = card.querySelector('.member-card__front')
  const back = card.querySelector('.member-card__back')
  card.classList.toggle('is-flipped', flipped)
  front.setAttribute('aria-expanded', String(flipped))
  front.setAttribute('aria-hidden', String(flipped))
  front.inert = flipped
  back.setAttribute('aria-hidden', String(!flipped))
  back.inert = !flipped
  if (flipped) {
    if (openedCard && openedCard !== card) setFlipped(openedCard, false, false)
    openedCard = card
    card.querySelector('.member-card__return').focus({ preventScroll: true })
  } else {
    if (openedCard === card) openedCard = null
    if (restoreFocus) front.focus({ preventScroll: true })
  }
}

function addProfile(back, person) {
  const scroll = element('div', 'member-card__reading')
  scroll.tabIndex = 0
  scroll.setAttribute('role', 'region')
  scroll.setAttribute('aria-label', `${person.name} biography and contributions`)
  scroll.append(element('h3', 'member-card__back-name', person.name))
  scroll.append(element('p', 'member-card__back-role', person.role))
  if (person.introduction) {
    scroll.append(element('h4', 'profile-heading', 'About Me'), element('p', 'profile-text', person.introduction))
  }
  if (person.quote) scroll.append(element('blockquote', 'profile-quote', `“${person.quote}”`))
  if (person.profileStatus === 'basic-information-only') {
    scroll.append(element('p', 'profile-text', 'Biography and contributions to follow.'))
  } else {
    scroll.append(element('h4', 'profile-heading', 'Contributions'))
    const tags = element('div', 'profile-tags')
    person.contributionCategories.forEach((category) => tags.append(element('span', '', category)))
    scroll.append(tags)
    const details = element('details', 'profile-details')
    details.append(element('summary', 'profile-expand', 'Read full contribution'))
    if (person.generalTasks.length) {
      details.append(element('h4', 'profile-heading', 'General Tasks'))
      details.append(element('p', 'profile-text', `Source indices: ${person.generalTasks.join(' · ')}`))
    }
    details.append(element('h4', 'profile-heading', 'Specific Tasks'))
    person.tasks.forEach((task) => {
      const entry = element('section', 'profile-task')
      entry.append(element('h5', '', task.category), element('p', 'profile-text', task.detail))
      details.append(entry)
    })
    scroll.append(details)
  }
  scroll.append(element('p', 'profile-end', 'End of profile'))
  back.append(scroll)
}

function memberCard(person) {
  const card = element('article', 'member-card')
  card.dataset.memberId = person.id
  card.dataset.groups = person.groups.join('|')
  const rotor = element('div', 'member-card__rotor')
  const front = element('button', 'member-card__front')
  front.type = 'button'
  front.setAttribute('aria-label', `Flip ${person.name}'s card to read their profile`)
  front.setAttribute('aria-expanded', 'false')
  front.setAttribute('aria-controls', `profile-${person.id}`)
  front.setAttribute('aria-hidden', 'false')
  const body = element('span', 'member-card__body')
  body.append(element('span', 'member-card__name', person.name), element('span', 'member-card__role', person.role))
  if (person.groups.length > 1) body.append(element('span', 'member-card__groups', person.groups.join(' · ')))
  body.append(element('span', 'member-card__hint', 'Flip to explore ↻'))
  front.append(portrait(person), body)
  const back = element('section', 'member-card__back')
  back.id = `profile-${person.id}`
  back.setAttribute('aria-hidden', 'true')
  back.inert = true
  const returnButton = element('button', 'member-card__return', '↶ Back to photo')
  returnButton.type = 'button'
  returnButton.setAttribute('aria-label', `Return to ${person.name}'s photo`)
  back.append(returnButton)
  addProfile(back, person)
  front.addEventListener('click', () => setFlipped(card, true))
  returnButton.addEventListener('click', () => setFlipped(card, false))
  rotor.append(front, back)
  card.append(rotor)
  return card
}

function facultyCard(person) {
  const card = element('article', 'member-card faculty-card')
  card.dataset.memberId = person.id
  const front = element('div', 'member-card__front')
  const body = element('div', 'member-card__body')
  const name = element('span', 'member-card__name', person.name)
  name.setAttribute('role', 'heading')
  name.setAttribute('aria-level', '3')
  body.append(name, element('span', 'member-card__role', person.role))
  if (person.introduction) body.append(element('p', 'profile-text', person.introduction))
  front.append(portrait(person), body)
  card.append(front)
  return card
}

function render(group, host, makeCard = memberCard) {
  const fragment = document.createDocumentFragment()
  group.forEach((person) => fragment.append(makeCard(person)))
  host.append(fragment)
}
render(teamFaculty.filter((p) => p.groups.includes('PI')), document.querySelector('#pi-grid'), facultyCard)
render(teamFaculty.filter((p) => p.groups.includes('Secondary PI')), document.querySelector('#secondary-pi-grid'), facultyCard)
render(teamMembers.filter((p) => p.groups.includes('Team Leaders')), document.querySelector('#leader-grid'))
render(teamMembers.filter((p) => !p.groups.includes('Team Leaders') && !p.groups.includes('Advisors')), memberGrid)
render(teamMembers.filter((p) => p.groups.includes('Advisors')), document.querySelector('#advisor-grid'))
const advisorCount = teamMembers.filter((p) => p.groups.includes('Advisors')).length
document.querySelector('.team-hero__note').textContent = `${teamMembers.length + teamFaculty.length} people · one shared journey`

function applyFilter(filter) {
  // Synchronous filtering avoids stale animation completions hiding a new selection.
  if (openedCard) setFlipped(openedCard, false, false)
  filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)))
  let count = 0
  memberGrid.querySelectorAll('.member-card').forEach((card) => {
    const show = filter === 'All' || (filter !== 'Advisors' && card.dataset.groups.split('|').includes(filter))
    card.hidden = !show
    if (show) count++
  })
  advisorSection.hidden = filter !== 'All' && filter !== 'Advisors'
  resultStatus.textContent = filter === 'All'
    ? `Showing ${count} members · ${advisorCount} advisors. Team leaders and PIs appear above.`
    : filter === 'Advisors' ? `Showing ${advisorCount} advisors below. Team leaders and PIs appear above.`
      : `Showing ${count} ${filter} member${count === 1 ? '' : 's'}. Team leaders and PIs appear above.`
}
filters.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.filter)))
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && openedCard) {
    event.preventDefault()
    setFlipped(openedCard, false)
  }
})
document.querySelector('a[href="#advisors-title"]').addEventListener('click', () => {
  if (advisorSection.hidden) applyFilter('All')
})
applyFilter('All')

// Track the existing section anchors without replacing native hash navigation.
const sectionLinks = [...document.querySelectorAll('.team-jumps a')]
let sectionUpdatePending = false
function updateCurrentSection() {
  sectionUpdatePending = false
  const visible = sectionLinks.filter(link => !document.querySelector(link.hash).closest('[hidden]'))
  const current = visible.filter(link => document.querySelector(link.hash).getBoundingClientRect().top <= 150).at(-1) || visible[0]
  sectionLinks.forEach(link => {
    if (link === current) link.setAttribute('aria-current', 'location')
    else link.removeAttribute('aria-current')
  })
}
function requestSectionUpdate() {
  if (sectionUpdatePending) return
  sectionUpdatePending = true
  requestAnimationFrame(updateCurrentSection)
}
window.addEventListener('scroll', requestSectionUpdate, { passive: true })
window.addEventListener('resize', requestSectionUpdate)
filters.forEach(button => button.addEventListener('click', requestSectionUpdate))
updateCurrentSection()

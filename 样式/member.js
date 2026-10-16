import './main.js'
import { teamMembers, teamFaculty, memberPresentation } from '../Team/member-data.js'

// Eager URL imports let the same portraits resolve in development and hashed builds.
const portraits = import.meta.glob('../assets/team-member/portraits/*.{webp,jpg}', {
  eager: true, query: '?url', import: 'default',
})
const page = document.querySelector('.team-page')
const carousel = page.querySelector('.team-carousel')
const stage = page.querySelector('.team-avatar-stage')
const deck = page.querySelector('.team-deck')
const profile = page.querySelector('.team-profile')
const filters = [...page.querySelectorAll('.team-filter')]
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
const leaderRoles = new Map(memberPresentation.leaders.map(p => [p.id, p.role]))
const leaders = memberPresentation.leaders.map(p => teamMembers.find(member => member.id === p.id))
;[leaders[0], leaders[1]] = [leaders[1], leaders[0]]
const directory = teamMembers.filter(p => !p.groups.includes('Team Leaders') && !p.groups.includes('Advisors'))
const previousPageOrder = [
  ...teamMembers.filter(p => p.groups.includes('Team Leaders')),
  ...directory.filter(p => !p.groups.includes('Visual Design')),
  ...directory.filter(p => p.groups.includes('Visual Design')),
]
const allMembers = [...leaders, ...previousPageOrder.filter(p => !leaderRoles.has(p.id))]
let people = allMembers, buttons = [], selected = 0, phase = 0, pitch = 180, buttonWidth = 164
let hoveredPhoto = false, isVisible = false, frame = 0, lastTime = 0, openAdvisor = null

// Shared article decoration runs first. Only these four page-owned headings
// use the user's centered frames; public formatting remains untouched.
page.querySelectorAll('.team-section-heading h2').forEach(h => h.classList.remove('wiki-chapter-title'))

function element(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

function nameLabel(node, person, avatar = false) {
  node.textContent = `${person.name} `
  const chinese = memberPresentation.chineseNames[person.id]
  if (chinese) node.append(element('span', `team-name-chinese${avatar ? ' team-avatar-chinese' : ''}`, `(${chinese})`))
  return node
}

function photo(person, eager = false) {
  const host = element('span', 'member-photo')
  const path = person.framingPhoto || person.photo
  if (path && portraits[path]) {
    const image = element('img')
    image.src = portraits[path]
    image.alt = `${person.name} portrait`
    image.width = 800
    image.height = 1000
    image.loading = eager ? 'eager' : 'lazy'
    image.decoding = 'async'
    image.draggable = false
    host.append(image)
  } else {
    host.classList.add('member-photo--placeholder')
    host.append(element('span', '', person.name.split(/\s+/).map(p => p[0]).join('')))
  }
  return host
}

function biography(person, showRole = false) {
  const content = element('div', 'team-biography')
  if (showRole) {
    content.append(element('h4', 'team-profile-role', leaderRoles.get(person.id) || person.role))
    if (person.groups.length > 1) content.append(element('p', 'team-profile-groups', person.groups.join(' · ')))
  }
  if (person.introduction) content.append(element('p', 'team-profile-bio', person.introduction))
  if (person.quote) content.append(element('blockquote', 'team-profile-quote', `“${person.quote}”`))
  return content
}

function contribution(person) {
  const details = element('details', 'team-contribution')
  details.append(element('summary', '', 'Read full contribution'))
  const content = element('div', 'team-contribution-body')
  if (person.contributionCategories.length) {
    const tags = element('div', 'team-contribution-tags')
    person.contributionCategories.forEach(category => tags.append(element('span', '', category)))
    content.append(tags)
  }
  if (person.generalTasks.length) {
    content.append(element('h4', '', 'General Tasks'), element('p', '', `Source indices: ${person.generalTasks.join(' · ')}`))
  }
  content.append(element('h4', '', 'Specific Tasks'))
  person.tasks.forEach(task => {
    const entry = element('section', 'team-task')
    entry.append(element('h5', '', task.category), element('p', '', task.detail))
    content.append(entry)
  })
  content.append(element('p', 'team-profile-end', 'End of profile'))
  details.append(content)
  return details
}

function draw() {
  if (!buttons.length) return
  const avatar = buttons[0].querySelector('.member-photo').getBoundingClientRect().width
  buttonWidth = avatar + 32
  pitch = avatar + 48
  const width = carousel.clientWidth, origin = (width - buttonWidth) / 2
  const cycle = people.length * pitch
  // Start the new group's first portrait at the center, with empty space to
  // its left. Recycle a portrait only after it has exited, preserving order.
  const positions = buttons.map((button, index) => {
    let x = origin + index * pitch - phase
    if (x < -buttonWidth) x += Math.ceil((-buttonWidth - x) / cycle) * cycle
    return { button, x, index }
  })
  const visible = new Set(positions.filter(p => p.x > -buttonWidth && p.x < width)
    .sort((a, b) => a.x - b.x).slice(0, 6).map(p => p.index))
  positions.forEach(({ button, x, index }) => {
    button.style.transform = `translateX(${x}px)`
    button.style.visibility = visible.has(index) ? 'visible' : 'hidden'
    button.tabIndex = visible.has(index) ? 0 : -1
  })
}

function choose(index, animate = true, moveFocus = false) {
  selected = (index % people.length + people.length) % people.length
  const person = people[selected]
  deck.hidden = false
  profile.dataset.memberId = person.id
  page.querySelector('.team-profile-photo').replaceWith(Object.assign(photo(person, true), { className: 'member-photo team-profile-photo' }))
  page.querySelector('#selected-member-name').textContent = person.name
  page.querySelector('.team-profile-copy').replaceChildren(biography(person, true))
  page.querySelector('.team-contribution-host').replaceChildren(contribution(person))
  buttons.forEach((button, i) => {
    button.setAttribute('aria-pressed', String(i === selected))
    button.setAttribute('aria-expanded', String(i === selected))
  })
  page.querySelector('.team-member-index').textContent = `${String(selected + 1).padStart(2, '0')} / ${people.length}`
  page.querySelector('#team-selection-status').textContent = `${person.name}, ${leaderRoles.get(person.id) || person.role}. Profile displayed below the portraits.`
  profile.getAnimations().forEach(animation => animation.cancel())
  if (animate && !reduce.matches) {
    profile.animate([
      { transform: 'translate(-38px, 12px) rotate(-2.5deg)', opacity: .4 },
      { transform: 'translate(5px, -2px) rotate(.4deg)', opacity: 1, offset: .8 },
      { transform: 'none', opacity: 1 },
    ], { duration: 440, easing: 'cubic-bezier(.2,.75,.2,1)' })
  }
  if (moveFocus) page.querySelector('.team-profile-return').focus({ preventScroll: true })
}

function centerSelected() {
  phase = selected * pitch
  draw()
}

function closeMember() {
  deck.hidden = true
  buttons.forEach(button => {
    button.setAttribute('aria-expanded', 'false')
    button.setAttribute('aria-pressed', 'false')
  })
  centerSelected()
  buttons[selected].focus({ preventScroll: true })
  page.querySelector('#team-selection-status').textContent = 'Returned to portraits.'
}

function tick(time) {
  if (lastTime) {
    phase += Math.min(time - lastTime, 50) * .035
    draw()
  }
  lastTime = time
  frame = requestAnimationFrame(tick)
}

function syncMotion() {
  cancelAnimationFrame(frame)
  frame = 0
  lastTime = 0
  if (isVisible && !hoveredPhoto && !reduce.matches && !document.hidden) frame = requestAnimationFrame(tick)
}

function applyFilter(group) {
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === group)))
  people = allMembers.filter(person => group === 'All' || person.groups.includes(group))
  stage.replaceChildren()
  hoveredPhoto = false
  phase = 0
  buttons = people.map((person, index) => {
    const button = element('button', 'team-avatar')
    button.type = 'button'
    button.dataset.memberId = person.id
    button.setAttribute('aria-label', `View ${person.name}'s profile`)
    button.setAttribute('aria-controls', 'selected-member')
    const image = photo(person, true)
    const imageNode = image.querySelector('img')
    if (imageNode) imageNode.alt = ''
    image.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') { hoveredPhoto = true; syncMotion() }
    })
    image.addEventListener('pointerleave', () => { hoveredPhoto = false; syncMotion() })
    const name = nameLabel(element('span', 'team-avatar-name'), person, true)
    button.append(image, name)
    if (leaderRoles.has(person.id)) button.append(element('span', 'team-avatar-leader', leaderRoles.get(person.id)))
    button.addEventListener('click', () => choose(index, true, true))
    stage.append(button)
    return button
  })
  page.querySelector('#team-results').textContent = `${people.length} ${group === 'All' ? 'members' : `${group} members`} · select a portrait to explore`
  draw()
  choose(0, false)
  syncMotion()
}

filters.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)))
page.querySelector('.team-profile-return').addEventListener('click', closeMember)
function step(direction, focusPhoto = false) {
  choose(selected + direction)
  centerSelected()
  if (focusPhoto) buttons[selected].focus({ preventScroll: true })
}
page.querySelector('.team-previous').addEventListener('click', () => step(-1))
page.querySelector('.team-next').addEventListener('click', () => step(1))
carousel.addEventListener('keydown', event => {
  if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    if (event.key === 'Home' || event.key === 'End') {
      choose(event.key === 'Home' ? 0 : people.length - 1)
      centerSelected()
      buttons[selected].focus({ preventScroll: true })
    } else step(event.key === 'ArrowRight' ? 1 : -1, true)
  }
})

function staticPerson(person, isAdvisor = false) {
  const card = element('article', 'team-static-person')
  card.dataset.memberId = person.id
  if (isAdvisor) {
    card.classList.add('team-advisor-card')
    const rotor = element('div', 'team-advisor-rotor')
    const front = element('div', 'team-advisor-front')
    const button = element('button', 'team-advisor-photo')
    button.type = 'button'
    button.setAttribute('aria-label', `View ${person.name}'s profile`)
    button.setAttribute('aria-expanded', 'false')
    button.setAttribute('aria-controls', `advisor-profile-${person.id}`)
    button.append(photo(person))
    const reading = element('section', 'team-advisor-reading')
    reading.id = `advisor-profile-${person.id}`
    reading.inert = true
    reading.setAttribute('aria-hidden', 'true')
    const back = element('button', 'team-advisor-return', '↶ Back to photo')
    back.type = 'button'
    reading.append(back, nameLabel(element('h3'), person), biography(person), contribution(person))
    const close = () => {
      card.classList.remove('is-flipped')
      reading.inert = true
      reading.setAttribute('aria-hidden', 'true')
      front.inert = false
      front.removeAttribute('aria-hidden')
      button.setAttribute('aria-expanded', 'false')
      openAdvisor = null
      button.focus({ preventScroll: true })
    }
    back.addEventListener('click', close)
    button.addEventListener('click', () => {
      if (card.classList.contains('is-flipped')) { close(); return }
      if (openAdvisor) openAdvisor.close()
      card.classList.add('is-flipped')
      front.inert = true
      front.setAttribute('aria-hidden', 'true')
      reading.inert = false
      reading.removeAttribute('aria-hidden')
      button.setAttribute('aria-expanded', 'true')
      openAdvisor = { close }
      back.focus({ preventScroll: true })
    })
    front.append(button, nameLabel(element('h3'), person))
    rotor.append(front, reading)
    card.append(rotor)
  } else {
    card.append(photo(person), nameLabel(element('h3'), person))
    const note = memberPresentation.facultyNotes[person.id]
    if (note) card.append(element('p', 'team-faculty-note', note.text))
  }
  return card
}
function renderPeople(list, id, advisors = false) {
  page.querySelector(id).replaceChildren(...list.map(person => staticPerson(person, advisors)))
}
const principalInvestigators = teamFaculty.filter(p => p.groups.includes('PI'))
renderPeople([...principalInvestigators.slice(1), principalInvestigators[0]], '#pi-grid')
renderPeople(teamFaculty.filter(p => p.groups.includes('Secondary PI')), '#secondary-pi-grid')
renderPeople(memberPresentation.advisors.map(id => teamMembers.find(p => p.id === id)), '#advisor-grid', true)

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return
  if (openAdvisor) { event.preventDefault(); openAdvisor.close() }
  else if (!deck.hidden && page.querySelector('.team-directory').contains(document.activeElement)) {
    event.preventDefault()
    closeMember()
  }
})
new IntersectionObserver(entries => {
  isVisible = entries[0].isIntersecting
  syncMotion()
}).observe(carousel)
document.addEventListener('visibilitychange', syncMotion)
reduce.addEventListener('change', () => {
  if (reduce.matches) profile.getAnimations().forEach(animation => animation.cancel())
  syncMotion()
})

// Native page scrolling lets the photo shrink from one screen to half a screen.
let heroFrame = 0
function renderHero() {
  heroFrame = 0
  const height = window.innerHeight
  const progress = Math.min(1, Math.max(0, window.scrollY / (height * .8)))
  page.style.setProperty('--team-screen-height', `${height}px`)
  page.style.setProperty('--team-navigation-height', `${document.querySelector('.navbar')?.getBoundingClientRect().height || 60}px`)
  page.style.setProperty('--team-hero-height', `${height * (1 - progress * .5)}px`)
}
function requestHero() {
  if (!heroFrame) heroFrame = requestAnimationFrame(renderHero)
}
window.addEventListener('scroll', requestHero, { passive: true })
window.addEventListener('resize', () => { renderHero(); draw() })
new ResizeObserver(draw).observe(carousel)
applyFilter('All')
renderHero()

import './main.js'
import { teamMembers } from '../Team/member-data.js'

const leaderGrid = document.querySelector('#leader-grid')
const memberGrid = document.querySelector('#member-grid')
const advisorGrid = document.querySelector('#advisor-grid')
const advisorSection = document.querySelector('#advisor-section')
const resultStatus = document.querySelector('#team-results')
const filterButtons = [...document.querySelectorAll('.team-filter')]
const dialog = document.querySelector('#profile-dialog')
const closeButton = dialog.querySelector('.profile-close')
const expandButton = dialog.querySelector('#profile-expand')
const detailsPanel = dialog.querySelector('#profile-details')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const leaders = teamMembers.filter((member) => member.groups.includes('Team Leaders'))
const advisors = teamMembers.filter((member) => member.groups.includes('Advisors'))
const members = teamMembers.filter((member) => (
  !member.groups.includes('Team Leaders') && !member.groups.includes('Advisors')
))

let lastProfileTrigger = null
let filterRevision = 0

function createElement(tag, className, text) {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (text !== undefined) element.textContent = text
  return element
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function createPortrait(member, variant = 'card') {
  const portrait = createElement('div', `member-photo member-photo--${variant}`)
  if (member.photo) {
    const image = document.createElement('img')
    image.src = new URL(member.photo, import.meta.url).href
    image.alt = `${member.name} portrait`
    image.loading = variant === 'profile' ? 'eager' : 'lazy'
    image.decoding = 'async'
    portrait.append(image)
    return portrait
  }

  portrait.classList.add('member-photo--placeholder')
  const initials = createElement('span', 'member-photo__initials', getInitials(member.name))
  initials.setAttribute('aria-hidden', 'true')
  portrait.append(initials)
  return portrait
}

function createMemberCard(member, variant) {
  const card = createElement('button', `member-card member-card--${variant}`)
  card.type = 'button'
  card.dataset.memberId = member.id
  card.dataset.groups = member.groups.join('|')
  card.setAttribute('aria-label', `View ${member.name}'s profile`)

  const portrait = createPortrait(member, variant)
  const hoverLayer = createElement('span', 'member-card__hover')
  const quote = createElement(
    'span',
    'member-card__quote',
    member.quote || 'Discover this team member’s work.',
  )
  const view = createElement('span', 'member-card__view', 'View profile →')
  hoverLayer.append(quote, view)
  portrait.append(hoverLayer)

  const body = createElement('span', 'member-card__body')
  const name = createElement('span', 'member-card__name', member.name)
  const role = createElement('span', 'member-card__role', member.role)
  body.append(name, role)

  if (member.groups.length > 1) {
    const groups = createElement('span', 'member-card__groups')
    member.groups.forEach((group) => groups.append(createElement('span', '', group)))
    body.append(groups)
  }

  card.append(portrait, body)
  card.addEventListener('click', () => openProfile(member, card))
  return card
}

function renderCards() {
  const leaderFragment = document.createDocumentFragment()
  leaders.forEach((member) => leaderFragment.append(createMemberCard(member, 'leader')))
  leaderGrid.append(leaderFragment)

  const memberFragment = document.createDocumentFragment()
  members.forEach((member) => memberFragment.append(createMemberCard(member, 'member')))
  memberGrid.append(memberFragment)

  const advisorFragment = document.createDocumentFragment()
  advisors.forEach((member) => advisorFragment.append(createMemberCard(member, 'advisor')))
  advisorGrid.append(advisorFragment)
}

function fillProfile(member) {
  const portraitHost = dialog.querySelector('#profile-portrait')
  portraitHost.replaceChildren(createPortrait(member, 'profile'))
  dialog.querySelector('#profile-group').textContent = member.groups.join(' · ')
  dialog.querySelector('#profile-name').textContent = member.name
  dialog.querySelector('#profile-role').textContent = member.role

  const quote = dialog.querySelector('#profile-quote')
  quote.textContent = member.quote ? `“${member.quote}”` : ''
  quote.hidden = !member.quote
  dialog.querySelector('#profile-introduction').textContent = member.introduction

  const tagHost = dialog.querySelector('#profile-tags')
  tagHost.replaceChildren()
  const categories = member.contributionCategories.length
    ? member.contributionCategories
    : ['Contribution details']
  categories.forEach((category) => tagHost.append(createElement('span', '', category)))

  const generalTaskHost = dialog.querySelector('#profile-general-tasks')
  generalTaskHost.replaceChildren()
  if (member.generalTasks.length) {
    generalTaskHost.append(
      createElement('h4', '', 'General Tasks'),
      createElement('p', '', `Source indices: ${member.generalTasks.join(' · ')}`),
    )
  }

  const taskHost = dialog.querySelector('#profile-task-list')
  taskHost.replaceChildren()
  taskHost.append(createElement('h4', '', 'Specific Tasks'))
  member.tasks.forEach((task) => {
    const item = createElement('article', 'profile-task')
    item.append(
      createElement('h5', '', task.category),
      createElement('p', '', task.detail),
    )
    taskHost.append(item)
  })

  detailsPanel.hidden = true
  expandButton.setAttribute('aria-expanded', 'false')
  expandButton.firstElementChild.textContent = 'View full contribution'
  expandButton.lastElementChild.textContent = '＋'
}

function openProfile(member, trigger) {
  lastProfileTrigger = trigger
  fillProfile(member)
  document.documentElement.classList.add('profile-open')
  document.body.classList.add('profile-open')
  dialog.showModal()
  requestAnimationFrame(() => closeButton.focus())
}

function closeProfile() {
  if (dialog.open) dialog.close()
}

function unlockPage() {
  document.documentElement.classList.remove('profile-open')
  document.body.classList.remove('profile-open')
  if (lastProfileTrigger?.isConnected) lastProfileTrigger.focus({ preventScroll: true })
}

function toggleDetails() {
  const willOpen = detailsPanel.hidden
  detailsPanel.hidden = !willOpen
  expandButton.setAttribute('aria-expanded', String(willOpen))
  expandButton.firstElementChild.textContent = willOpen
    ? 'Hide full contribution'
    : 'View full contribution'
  expandButton.lastElementChild.textContent = willOpen ? '−' : '＋'
  if (willOpen && !reduceMotion.matches) {
    detailsPanel.animate(
      [
        { opacity: 0, transform: 'translateY(-8px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 240, easing: 'cubic-bezier(.2,.7,.2,1)' },
    )
  }
}

async function applyFilter(filter) {
  const revision = ++filterRevision
  filterButtons.forEach((button) => {
    const active = button.dataset.filter === filter
    button.classList.toggle('is-active', active)
    button.setAttribute('aria-pressed', String(active))
  })

  const cards = [...memberGrid.querySelectorAll('.member-card')]
  const visibleCards = filter === 'All' || filter === 'Advisors'
    ? (filter === 'All' ? cards : [])
    : cards.filter((card) => card.dataset.groups.split('|').includes(filter))
  const visibleSet = new Set(visibleCards)
  const cardsToHide = cards.filter((card) => !card.hidden && !visibleSet.has(card))

  if (!reduceMotion.matches && cardsToHide.length) {
    await Promise.all(cardsToHide.map((card) => card.animate(
      [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(8px)' },
      ],
      { duration: 130, easing: 'ease-in', fill: 'forwards' },
    ).finished.catch(() => undefined)))
  }
  if (revision !== filterRevision) return

  cards.forEach((card) => { card.hidden = !visibleSet.has(card) })
  const showAdvisors = filter === 'All' || filter === 'Advisors'
  advisorSection.hidden = !showAdvisors

  if (!reduceMotion.matches) {
    visibleCards.forEach((card, index) => {
      card.getAnimations().forEach((animation) => animation.cancel())
      card.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: 260,
          delay: Math.min(index * 22, 180),
          easing: 'cubic-bezier(.2,.7,.2,1)',
        },
      )
    })
    if (showAdvisors) {
      advisorSection.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 280, easing: 'ease-out' },
      )
    }
  }

  if (filter === 'All') {
    resultStatus.textContent = `Showing all ${teamMembers.length} people.`
  } else if (filter === 'Advisors') {
    resultStatus.textContent = `Showing ${advisors.length} advisors.`
  } else {
    resultStatus.textContent = `Showing ${visibleCards.length} ${filter} member${visibleCards.length === 1 ? '' : 's'}.`
  }
}

function observeCards() {
  if (reduceMotion.matches || !('IntersectionObserver' in window)) return
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-revealed')
      observer.unobserve(entry.target)
    })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  document.querySelectorAll('.member-card').forEach((card) => observer.observe(card))
}

renderCards()
observeCards()
resultStatus.textContent = `Showing all ${teamMembers.length} people.`

filterButtons.forEach((button) => {
  button.addEventListener('click', () => applyFilter(button.dataset.filter))
})

closeButton.addEventListener('click', closeProfile)
dialog.addEventListener('close', unlockPage)
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeProfile()
})
expandButton.addEventListener('click', toggleDetails)

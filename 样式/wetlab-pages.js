document.querySelectorAll('[data-auto-toc]').forEach((toc) => {
  const content = toc.closest('.lab-layout')?.querySelector('[data-notebook-document], [data-document-content]')
  const headings = [...(content?.querySelectorAll('[data-toc-level]') || [])]
  let currentGroup = null
  let currentSubitem = null

  toc.replaceChildren()
  headings.forEach((heading) => {
    const level = Number(heading.dataset.tocLevel || 1)
    const target = heading.id || heading.closest('[id]')?.id
    if (!target) return

    const link = document.createElement('a')
    link.href = `#${target}`
    link.dataset.sectionLink = ''
    link.textContent = heading.textContent.trim()

    if (level === 1 || !currentGroup) {
      currentGroup = document.createElement('div')
      currentGroup.append(link)
      toc.append(currentGroup)
      currentSubitem = null
      return
    }

    let list = currentGroup.querySelector(':scope > ul')
    if (!list) {
      list = document.createElement('ul')
      currentGroup.append(list)
    }

    const item = document.createElement('li')
    item.append(link)
    if (level === 2 || !currentSubitem) {
      list.append(item)
      currentSubitem = item
      return
    }

    let nestedList = currentSubitem.querySelector(':scope > ul')
    if (!nestedList) {
      nestedList = document.createElement('ul')
      currentSubitem.append(nestedList)
    }
    nestedList.append(item)
  })
})

const tocLinks = [...document.querySelectorAll('[data-section-link]')]
const trackedSections = tocLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean)

if ('IntersectionObserver' in window && trackedSections.length) {
  const activateLink = (id) => {
    tocLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`
      link.classList.toggle('is-active', active)
      if (active) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    })
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    if (visible[0]) activateLink(visible[0].target.id)
  }, { rootMargin: '-16% 0px -68% 0px', threshold: [0, 0.02, 0.2] })

  trackedSections.forEach((section) => observer.observe(section))
  activateLink(trackedSections[0].id)
}

document.querySelectorAll('[data-module-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.module-card')
    const content = card?.querySelector('.module-card__content')
    if (!card || !content) return
    const expanded = button.getAttribute('aria-expanded') === 'true'
    button.setAttribute('aria-expanded', String(!expanded))
    content.hidden = expanded
  })
})

document.querySelectorAll('[data-pathogen-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.pathogen-card')
    const links = card?.querySelector('.pathogen-card__links')
    if (!links) return
    const expanded = button.getAttribute('aria-expanded') === 'true'

    document.querySelectorAll('[data-pathogen-toggle]').forEach((otherButton) => {
      otherButton.setAttribute('aria-expanded', 'false')
      const otherLinks = otherButton.closest('.pathogen-card')?.querySelector('.pathogen-card__links')
      if (otherLinks) otherLinks.hidden = true
    })

    if (!expanded) {
      button.setAttribute('aria-expanded', 'true')
      links.hidden = false
    }
  })
})

const experimentCards = [...document.querySelectorAll('.experiment-card')]

const calendarGrid = document.querySelector('[data-calendar-grid]')
const calendarTitle = document.querySelector('[data-calendar-title]')
const calendarWeekdays = document.querySelector('[data-calendar-weekdays]')

if (calendarGrid && calendarTitle && calendarWeekdays && experimentCards.length) {
  const events = experimentCards.flatMap((card) => {
    const title = card.querySelector('summary strong')?.textContent.trim() || ''
    const pathogen = title.match(/^([1-5])\./)?.[1] || '1'
    return [...card.querySelectorAll('time[datetime]')].map((time) => ({
      date: time.dateTime,
      title,
      target: card.id,
      pathogen,
    }))
  }).filter((event) => /^\d{4}-\d{2}-\d{2}$/.test(event.date))

  const eventsByDate = new Map()
  events.forEach((event) => {
    const grouped = eventsByDate.get(event.date) || []
    grouped.push(event)
    eventsByDate.set(event.date, grouped)
  })

  const earliest = [...events].sort((a, b) => a.date.localeCompare(b.date))[0]?.date
  const [initialYear, initialMonth] = (earliest || new Date().toISOString().slice(0, 7)).split('-').map(Number)
  const calendarMonth = new Date(Date.UTC(initialYear, initialMonth - 1, 1))
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const fullDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  ;['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((weekday) => {
    const label = document.createElement('span')
    label.textContent = weekday
    calendarWeekdays.append(label)
  })

  const openExperiment = (event) => {
    const card = document.getElementById(event.target)
    if (!card) return
    card.open = true
    card.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' })
    card.querySelector('summary')?.focus({ preventScroll: true })
    window.history.replaceState(null, '', `#${card.id}`)
  }

  const renderCalendar = () => {
    const year = calendarMonth.getUTCFullYear()
    const month = calendarMonth.getUTCMonth()
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    const leadingDays = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7
    const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7

    calendarTitle.textContent = monthFormatter.format(calendarMonth)
    calendarGrid.setAttribute('aria-label', calendarTitle.textContent)
    calendarGrid.replaceChildren()

    for (let cellIndex = 0; cellIndex < totalCells; cellIndex += 1) {
      const day = cellIndex - leadingDays + 1
      const cell = document.createElement('div')
      cell.className = 'notebook-calendar__day'
      cell.setAttribute('role', 'gridcell')

      if (day < 1 || day > daysInMonth) {
        cell.classList.add('is-empty')
        cell.setAttribute('aria-hidden', 'true')
        calendarGrid.append(cell)
        continue
      }

      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dateObject = new Date(Date.UTC(year, month, day))
      const dayNumber = document.createElement('span')
      dayNumber.className = 'notebook-calendar__date'
      dayNumber.textContent = String(day)
      cell.append(dayNumber)

      const dayEvents = eventsByDate.get(date) || []
      if (dayEvents.length) cell.classList.add('has-events')
      dayEvents.forEach((event) => {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'notebook-calendar__event'
        button.dataset.pathogen = event.pathogen
        button.textContent = event.title
        button.setAttribute('aria-label', `${event.title}, ${fullDateFormatter.format(dateObject)}`)
        button.addEventListener('click', () => openExperiment(event))
        cell.append(button)
      })
      calendarGrid.append(cell)
    }
  }

  document.querySelector('[data-calendar-prev]')?.addEventListener('click', () => {
    calendarMonth.setUTCMonth(calendarMonth.getUTCMonth() - 1)
    renderCalendar()
  })
  document.querySelector('[data-calendar-next]')?.addEventListener('click', () => {
    calendarMonth.setUTCMonth(calendarMonth.getUTCMonth() + 1)
    renderCalendar()
  })
  renderCalendar()
}
document.querySelector('[data-expand-experiments]')?.addEventListener('click', () => {
  experimentCards.forEach((card) => { card.open = true })
})
document.querySelector('[data-collapse-experiments]')?.addEventListener('click', () => {
  experimentCards.forEach((card) => { card.open = false })
})

document.querySelectorAll('.page-toc a[href^="#"], .pathogen-card__links a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'))
    const parentDetails = target?.closest('details')
    if (parentDetails) parentDetails.open = true
  })
})

const mobileNavigation = window.matchMedia('(max-width: 768px)')
const navigationDropdowns = [...document.querySelectorAll('.navbar .dropdown:has(.dropdown-content)')]

const closeMobileNavigation = (except = null) => {
  navigationDropdowns.forEach((dropdown) => {
    if (dropdown === except) return
    dropdown.classList.remove('is-mobile-open')
    dropdown.querySelector(':scope > .nav-link')?.setAttribute('aria-expanded', 'false')
  })
}

navigationDropdowns.forEach((dropdown) => {
  const parentLink = dropdown.querySelector(':scope > .nav-link')
  if (!parentLink) return
  parentLink.setAttribute('aria-haspopup', 'true')
  parentLink.setAttribute('aria-expanded', 'false')
  parentLink.addEventListener('click', (event) => {
    if (!mobileNavigation.matches) return
    const isOpen = dropdown.classList.contains('is-mobile-open')
    if (!isOpen) {
      event.preventDefault()
      closeMobileNavigation(dropdown)
      dropdown.classList.add('is-mobile-open')
      parentLink.setAttribute('aria-expanded', 'true')
    }
  })
})

document.addEventListener('click', (event) => {
  if (mobileNavigation.matches && !event.target.closest('.navbar .dropdown')) closeMobileNavigation()
})
mobileNavigation.addEventListener('change', () => closeMobileNavigation())

const printState = { details: [], hiddenPanels: [] }
window.addEventListener('beforeprint', () => {
  printState.details = [...document.querySelectorAll('details:not([open])')]
  printState.hiddenPanels = [...document.querySelectorAll('.module-card__content[hidden], .pathogen-card__links[hidden]')]
  printState.details.forEach((details) => { details.open = true })
  printState.hiddenPanels.forEach((panel) => { panel.hidden = false })
})
window.addEventListener('afterprint', () => {
  printState.details.forEach((details) => { details.open = false })
  printState.hiddenPanels.forEach((panel) => { panel.hidden = true })
  printState.details = []
  printState.hiddenPanels = []
})

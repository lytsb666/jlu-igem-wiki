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

document.querySelectorAll('.model-figure__link').forEach((link) => {
  const image = link.querySelector('img')
  if (!image) return

  const syncImageLink = () => {
    const source = image.currentSrc || image.src
    if (source) link.href = source
  }

  syncImageLink()
  image.addEventListener('load', syncImageLink, { once: true })
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
    const title = card.querySelector('.experiment-heading, summary strong')?.textContent.trim() || ''
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

  const firstMonth = Date.UTC(2026, 2, 1)
  const lastMonth = Date.UTC(2026, 8, 1)
  const calendarMonth = new Date(firstMonth)
  const previousMonthButton = document.querySelector('[data-calendar-prev]')
  const nextMonthButton = document.querySelector('[data-calendar-next]')
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const fullDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  const tooltip = document.createElement('div')
  tooltip.id = 'notebook-calendar-tooltip'
  tooltip.className = 'notebook-calendar__tooltip'
  tooltip.setAttribute('role', 'tooltip')
  tooltip.hidden = true
  document.body.append(tooltip)
  let tooltipDay = null
  let tooltipTimer
  const hideTooltip = () => {
    clearTimeout(tooltipTimer)
    tooltip.hidden = true
    tooltipDay?.removeAttribute('aria-describedby')
    tooltipDay = null
  }
  const delayHideTooltip = () => {
    clearTimeout(tooltipTimer)
    tooltipTimer = setTimeout(hideTooltip, 180)
  }
  const showTooltip = (cell, dayEvents, dateObject) => {
    hideTooltip()
    tooltipDay = cell
    tooltip.replaceChildren()
    const dateLabel = document.createElement('div')
    dateLabel.className = 'notebook-calendar__tooltip-date'
    dateLabel.textContent = fullDateFormatter.format(dateObject)
    tooltip.append(dateLabel)
    dayEvents.forEach((event) => {
      const label = document.createElement('div')
      label.className = 'notebook-calendar__tooltip-event'
      label.textContent = event.title
      tooltip.append(label)
    })
    tooltip.hidden = false
    cell.setAttribute('aria-describedby', tooltip.id)
    const rect = cell.getBoundingClientRect()
    const panel = tooltip.getBoundingClientRect()
    const left = Math.max(12, Math.min(rect.left, window.innerWidth - panel.width - 12))
    const below = rect.bottom + 8
    const top = below + panel.height <= window.innerHeight - 12
      ? below : Math.max(12, rect.top - panel.height - 8)
    tooltip.style.left = `${left}px`
    tooltip.style.top = `${top}px`
  }
  tooltip.addEventListener('pointerenter', () => clearTimeout(tooltipTimer))
  tooltip.addEventListener('pointerleave', delayHideTooltip)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideTooltip()
  })
  document.addEventListener('pointerdown', (event) => {
    if (!tooltip.contains(event.target) && !tooltipDay?.contains(event.target)) hideTooltip()
  })
  window.addEventListener('resize', hideTooltip)
  window.addEventListener('scroll', hideTooltip)

  ;['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((weekday) => {
    const label = document.createElement('span')
    label.textContent = weekday
    calendarWeekdays.append(label)
  })

  const openExperiment = (event) => {
    hideTooltip()
    const card = document.getElementById(event.target)
    if (!card) return
    if (card.tagName === 'DETAILS') card.open = true
    card.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' })
    card.querySelector('.experiment-heading, summary')?.focus({ preventScroll: true })
    window.history.replaceState(null, '', `#${card.id}`)
  }

  const renderCalendar = () => {
    hideTooltip()
    const year = calendarMonth.getUTCFullYear()
    const month = calendarMonth.getUTCMonth()
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    const leadingDays = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7
    const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7

    calendarTitle.textContent = monthFormatter.format(calendarMonth)
    if (previousMonthButton) previousMonthButton.disabled = calendarMonth.getTime() <= firstMonth
    if (nextMonthButton) nextMonthButton.disabled = calendarMonth.getTime() >= lastMonth
    calendarGrid.style.setProperty('--calendar-weeks', String(totalCells / 7))
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
      if (dayEvents.length) {
        cell.classList.add('has-events')
        cell.tabIndex = 0
        cell.setAttribute('aria-label', `${fullDateFormatter.format(dateObject)}, ${dayEvents.length} experiments`)
        cell.addEventListener('pointerenter', () => showTooltip(cell, dayEvents, dateObject))
        cell.addEventListener('pointerleave', delayHideTooltip)
        cell.addEventListener('focusin', () => showTooltip(cell, dayEvents, dateObject))
        cell.addEventListener('focusout', delayHideTooltip)
        cell.addEventListener('click', (event) => {
          if (!event.target.closest('button')) showTooltip(cell, dayEvents, dateObject)
        })
      }
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

  previousMonthButton?.addEventListener('click', () => {
    if (calendarMonth.getTime() <= firstMonth) return
    calendarMonth.setUTCMonth(calendarMonth.getUTCMonth() - 1)
    renderCalendar()
  })
  nextMonthButton?.addEventListener('click', () => {
    if (calendarMonth.getTime() >= lastMonth) return
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

const navbar = document.querySelector('.navbar')
let dismissNavigation
let revealNavigationAtTop

const navigationSchema = [
  {
    label: 'Project',
    items: [
      ['Description', '../Project/description.html'],
      ['Design', '../Project/design.html'],
      ['Engineering', '../Project/engineering.html'],
      ['Safety', '../Project/safety.html'],
      ['Contribution', '../Project/contribution.html'],
    ],
  },
  {
    label: 'Engagement',
    items: [
      ['iHP', '../Eagagement/iHP.html'],
      ['Education', '../Eagagement/education.html'],
      ['Entrepreneurship', '../Eagagement/entrepreneurship.html'],
    ],
  },
  {
    label: 'Wetlab',
    items: [
      ['Protocol', '../Wet-lab/protocal.html'],
      ['Notebook', '../Wet-lab/notebook.html'],
      ['Measurement', '../Wet-lab/measurement.html'],
      ['Parts', '../Wet-lab/part.html'],
      ['Results', '../Wet-lab/result.html'],
    ],
  },
  {
    label: 'Instrument',
    items: [
      ['Hardware', '../Instrument/hardware.html'],
      ['Software', '../Instrument/software.html'],
      ['Model', '../Instrument/model.html'],
    ],
  },
  {
    label: 'Team',
    href: '../Team/member.html',
  },
  {
    label: 'Judging',
    items: [
      ['iHP', '../Eagagement/iHP.html?nav=judging'],
      ['Measurement', '../Wet-lab/measurement.html?nav=judging'],
      ['Hardware', '../Instrument/hardware.html?nav=judging'],
    ],
  },
]

if (navbar) {
  const navLinks = navbar.querySelector('.nav-links')
  if (navLinks) {
    navLinks.innerHTML = `
      <div class="dropdown nav-home"><a href="../homepage/index.html" class="nav-link">Home</a></div>
      ${navigationSchema.map(({ label, items, href }) => {
        if (href) return `<div class="dropdown nav-direct" data-navigation-section="${label.toLowerCase()}"><a href="${href}" class="nav-link">${label}</a></div>`
        const menuId = `navigation-menu-${label.toLowerCase()}`
        return `
        <div class="dropdown" data-navigation-section="${label.toLowerCase()}">
          <button type="button" class="nav-link" aria-haspopup="true" aria-expanded="false" aria-controls="${menuId}">${label}</button>
          <div class="dropdown-content" id="${menuId}">
            ${items.map(([itemLabel, href]) => `<a href="${href}">${itemLabel}</a>`).join('')}
          </div>
        </div>`
      }).join('')}`
  }
}

if (navbar) {
  const TOP_EDGE = 4
  const DIRECTION_THRESHOLD = 10
  const POINTER_TOP_ZONE = 72
  const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

  // Only movement of the document changes visibility. Wheel events also fire
  // inside cards/directories and at scroll boundaries without moving the page.
  const documentScrollY = () => Math.min(Math.max(window.scrollY, 0),
    Math.max(0, document.documentElement.scrollHeight - document.documentElement.clientHeight))
  let lastScrollY = documentScrollY()
  let lastDirection = 0
  let directionDistance = 0
  let ticking = false
  let manuallyDismissed = false
  let topRevealArmed = true

  const navigationIsEngaged = () => (
    (precisePointer.matches && navbar.matches(':hover'))
    || navbar.matches(':focus-within')
    || Boolean(navbar.querySelector('.dropdown.is-open'))
  )

  const setHidden = (hidden) => {
    if (hidden && navigationIsEngaged()) return
    if (!hidden) {
      manuallyDismissed = false
      topRevealArmed = true
    }
    navbar.classList.toggle('hide', hidden)
  }

  dismissNavigation = (event) => {
    manuallyDismissed = true
    // Clicking the bar's own empty space must not immediately reveal it again.
    topRevealArmed = event.clientY > POINTER_TOP_ZONE
    lastScrollY = documentScrollY()
    lastDirection = 0
    directionDistance = 0
    navbar.classList.add('hide')
  }

  revealNavigationAtTop = (event) => {
    if (event.clientY > POINTER_TOP_ZONE || !navbar.classList.contains('hide')) return false
    setHidden(false)
    return true
  }

  const reactToDirection = (direction, distance) => {
    if (!direction) return

    if (direction !== lastDirection) {
      lastDirection = direction
      directionDistance = 0
    }

    directionDistance += distance
    if (directionDistance < DIRECTION_THRESHOLD) return

    setHidden(direction > 0)
    directionDistance = 0
  }

  const updateFromScroll = () => {
    ticking = false

    const currentScrollY = documentScrollY()
    const deltaY = currentScrollY - lastScrollY

    if (currentScrollY <= Math.max(TOP_EDGE, navbar.offsetHeight)) {
      if (!manuallyDismissed || deltaY < 0) setHidden(false)
      lastDirection = 0
      directionDistance = 0
    } else {
      reactToDirection(Math.sign(deltaY), Math.abs(deltaY))
    }

    lastScrollY = currentScrollY
  }

  window.addEventListener('scroll', () => {
    if (ticking) return
    ticking = true
    window.requestAnimationFrame(updateFromScroll)
  }, { passive: true })

  window.addEventListener('pointermove', (event) => {
    if (!precisePointer.matches || (event.pointerType && event.pointerType !== 'mouse')) return

    if (event.clientY > POINTER_TOP_ZONE) topRevealArmed = true
    else if (topRevealArmed) {
      setHidden(false)
    }
  }, { passive: true })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') setHidden(false)
  })

  navbar.addEventListener('focusin', () => setHidden(false))
  navbar.addEventListener('pointerenter', () => {
    if (topRevealArmed) setHidden(false)
  })
  const resetScrollTracking = () => {
    lastScrollY = documentScrollY()
    lastDirection = 0
    directionDistance = 0
    if (!manuallyDismissed) setHidden(false)
  }
  window.addEventListener('pageshow', resetScrollTracking)
  window.addEventListener('resize', resetScrollTracking, { passive: true })
}

function normalizePath(pathname) {
  const decodedPath = decodeURIComponent(pathname)
    .replaceAll('\\', '/')
    .replace(/\/index\.html$/i, '/')
    .replace(/\.html$/i, '')
    .replace(/\/+$/, '')
    .toLowerCase()

  return decodedPath || '/'
}

const currentPath = normalizePath(window.location.pathname)
const currentSection = currentPath.split('/').filter(Boolean)[0] || 'homepage'
const sectionLabels = {
  homepage: 'home',
  project: 'project',
  eagagement: 'engagement',
  'wet-lab': 'wetlab',
  instrument: 'instrument',
  team: 'team',
  judging: 'judging',
}
// Carry shared pages' menu context through refresh, history and new tabs.
const activeSection = ['/eagagement/ihp', '/instrument/hardware', '/wet-lab/measurement'].some(path => currentPath.endsWith(path))
  && new URLSearchParams(window.location.search).get('nav') === 'judging'
  ? 'judging'
  : sectionLabels[currentSection]

document.querySelectorAll('.navbar .dropdown').forEach((group) => {
  const primaryLink = group.querySelector(':scope > .nav-link')
  const groupLabel = primaryLink?.textContent.trim().toLowerCase()
  const isCurrentGroup = groupLabel === activeSection

  primaryLink?.classList.toggle('active', isCurrentGroup)
  if (isCurrentGroup) primaryLink?.setAttribute('aria-current', 'page')
  else primaryLink?.removeAttribute('aria-current')

  group.querySelectorAll('.dropdown-content a[href]').forEach((link) => {
    const targetPath = normalizePath(new URL(link.href, window.location.href).pathname)
    link.classList.toggle('active', isCurrentGroup && targetPath === currentPath)
    if (isCurrentGroup && targetPath === currentPath) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  })
})

const homeLink = document.querySelector('.navbar .nav-home > a[href]')
const homepagePaths = new Set(['/homepage', '/'])

homeLink?.addEventListener('click', (event) => {
  const targetPath = normalizePath(new URL(homeLink.href, window.location.href).pathname)
  if (!homepagePaths.has(currentPath) || !homepagePaths.has(targetPath)) return

  event.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

if (navbar) {
  const MENU_CLOSE_DELAY = 200
  const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
  const menuGroups = [...navbar.querySelectorAll('.dropdown:has(.dropdown-content)')]
  let closeTimer = null

  function setMenuOpen(group, open, { focusTrigger = false } = {}) {
    const trigger = group?.querySelector(':scope > .nav-link')
    if (!group || !trigger) return

    group.classList.toggle('is-open', open)
    trigger.setAttribute('aria-expanded', String(open))

    if (open) {
      menuGroups.forEach((otherGroup) => {
        if (otherGroup === group) return
        otherGroup.classList.remove('is-open')
        otherGroup.querySelector(':scope > .nav-link')?.setAttribute('aria-expanded', 'false')
      })
    }

    navbar.classList.toggle('is-interacting', menuGroups.some((item) => item.classList.contains('is-open')))
    if (focusTrigger) trigger.focus()
  }

  function closeAllMenus(options) {
    menuGroups.forEach((group) => setMenuOpen(group, false, options))
  }

  function cancelScheduledClose() {
    window.clearTimeout(closeTimer)
    closeTimer = null
  }

  function scheduleClose(group) {
    cancelScheduledClose()
    closeTimer = window.setTimeout(() => {
      if (!group.matches(':hover, :focus-within')) setMenuOpen(group, false)
    }, MENU_CLOSE_DELAY)
  }

  menuGroups.forEach((group, index) => {
    const trigger = group.querySelector(':scope > .nav-link')
    const menu = group.querySelector(':scope > .dropdown-content')
    if (!trigger || !menu) return

    const menuId = menu.id || `navigation-menu-${index + 1}`
    menu.id = menuId
    trigger.setAttribute('aria-haspopup', 'true')
    trigger.setAttribute('aria-expanded', 'false')
    trigger.setAttribute('aria-controls', menuId)

    if (!trigger.querySelector('.nav-caret')) {
      const caret = document.createElement('span')
      caret.className = 'nav-caret'
      caret.setAttribute('aria-hidden', 'true')
      caret.textContent = '▾'
      trigger.append(caret)
    }

    trigger.addEventListener('click', (event) => {
      event.preventDefault()
      cancelScheduledClose()
      setMenuOpen(group, true)
    })

    trigger.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
        event.preventDefault()
        cancelScheduledClose()
        setMenuOpen(group, true)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setMenuOpen(group, true)
        menu.querySelector('a')?.focus()
      }
    })

    group.addEventListener('pointerenter', () => {
      cancelScheduledClose()
      if (precisePointer.matches) setMenuOpen(group, true)
    })

    group.addEventListener('pointerleave', () => {
      if (precisePointer.matches) scheduleClose(group)
    })

    group.addEventListener('focusin', () => {
      cancelScheduledClose()
      setMenuOpen(group, true)
    })

    group.addEventListener('focusout', (event) => {
      if (!group.contains(event.relatedTarget)) scheduleClose(group)
    })

    menu.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => closeAllMenus())
    })
  })

  navbar.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    const openGroup = menuGroups.find((group) => group.classList.contains('is-open'))
    if (!openGroup) return

    event.preventDefault()
    openGroup.querySelector(':scope > .nav-link')?.focus()
    setMenuOpen(openGroup, false)
  })

  document.addEventListener('pointerdown', (event) => {
    const target = event.target
    if (event.button !== 0 || !(target instanceof Element)) return
    if (revealNavigationAtTop(event)) return
    if (!navbar.contains(target)) closeAllMenus()

    // Only dismiss on empty page space; keep media and content controls intact.
    if (target.closest('a, button, input, select, textarea, label, summary, [tabindex]:not([tabindex="-1"]), [role="button"], [role="tab"], [contenteditable], video, audio, iframe, img, svg, canvas, math, dialog, .wiki-toc')) return
    for (const node of target.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue
      const range = document.createRange()
      range.selectNodeContents(node)
      const onText = [...range.getClientRects()].some(rect => (
        event.clientX >= rect.left && event.clientX <= rect.right
        && event.clientY >= rect.top && event.clientY <= rect.bottom
      ))
      if (onText) return
    }

    cancelScheduledClose()
    closeAllMenus()
    if (navbar.contains(document.activeElement)) document.activeElement.blur()
    dismissNavigation(event)
  }, { capture: true, passive: true })
}

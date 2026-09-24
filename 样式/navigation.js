const navbar = document.querySelector('.navbar')

if (navbar) {
  const TOP_EDGE = 4
  const DIRECTION_THRESHOLD = 10
  const POINTER_REVEAL_DISTANCE = 40
  const POINTER_TOP_ZONE = 72
  const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

  let lastScrollY = Math.max(window.scrollY, 0)
  let lastDirection = 0
  let directionDistance = 0
  let lastPointerY = null
  let upwardPointerDistance = 0
  let ticking = false

  const navigationIsEngaged = () => (
    navbar.matches(':hover, :focus-within')
    || Boolean(navbar.querySelector('.dropdown.is-open'))
  )

  const setHidden = (hidden) => {
    if (hidden && navigationIsEngaged()) return
    navbar.classList.toggle('hide', hidden)
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

    const currentScrollY = Math.max(window.scrollY, 0)
    const deltaY = currentScrollY - lastScrollY

    if (currentScrollY <= TOP_EDGE) {
      setHidden(false)
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

  window.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) < 3) return
    reactToDirection(Math.sign(event.deltaY), Math.abs(event.deltaY))
  }, { passive: true })

  window.addEventListener('pointermove', (event) => {
    if (!precisePointer.matches || (event.pointerType && event.pointerType !== 'mouse')) return

    if (event.clientY <= POINTER_TOP_ZONE) {
      setHidden(false)
      upwardPointerDistance = 0
    }

    if (lastPointerY === null) {
      lastPointerY = event.clientY
      return
    }

    const deltaY = event.clientY - lastPointerY
    lastPointerY = event.clientY

    if (deltaY < -2) {
      upwardPointerDistance += Math.abs(deltaY)
      if (navbar.classList.contains('hide') && upwardPointerDistance >= POINTER_REVEAL_DISTANCE) {
        setHidden(false)
        upwardPointerDistance = 0
      }
    } else if (deltaY > 2) {
      upwardPointerDistance = 0
    }
  }, { passive: true })

  navbar.addEventListener('focusin', () => setHidden(false))
  navbar.addEventListener('pointerenter', () => setHidden(false))
  window.addEventListener('pageshow', () => setHidden(false))
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

document.querySelectorAll('.navbar .dropdown').forEach((group) => {
  const primaryLink = group.querySelector(':scope > .nav-link')
  const groupLabel = primaryLink?.textContent.trim().toLowerCase()
  const isCurrentGroup = groupLabel === sectionLabels[currentSection]

  primaryLink?.classList.toggle('active', isCurrentGroup)

  group.querySelectorAll('.dropdown-content a[href]').forEach((link) => {
    const targetPath = normalizePath(new URL(link.href, window.location.href).pathname)
    link.classList.toggle('active', isCurrentGroup && targetPath === currentPath)
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

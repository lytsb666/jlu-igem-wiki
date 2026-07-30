const navbar = document.querySelector('.navbar')

if (navbar) {
  const TOP_EDGE = 4
  const DIRECTION_THRESHOLD = 10

  let lastScrollY = Math.max(window.scrollY, 0)
  let lastDirection = 0
  let directionDistance = 0
  let ticking = false

  const setHidden = (hidden) => navbar.classList.toggle('hide', hidden)

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

  navbar.addEventListener('focusin', () => setHidden(false))
  window.addEventListener('pageshow', () => setHidden(false))
}

const currentPath = decodeURIComponent(window.location.pathname).toLowerCase()

document.querySelectorAll('.navbar a[href]').forEach((link) => {
  const targetPath = decodeURIComponent(new URL(link.href, window.location.href).pathname).toLowerCase()
  if (targetPath === currentPath) link.classList.add('active')
})

document.querySelectorAll('.navbar .dropdown').forEach((group) => {
  if (group.querySelector('.dropdown-content a.active')) {
    group.querySelector(':scope > .nav-link')?.classList.add('active')
  }
})

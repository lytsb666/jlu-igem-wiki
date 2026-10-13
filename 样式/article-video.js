// Article videos start with sound when reached, and pause outside the viewport.
// Loading artwork is outside main and retains its separate silent behavior.
const states = new Map()

function isVisible(video) {
  const rect = video.getBoundingClientRect()
  const top = Math.max(rect.top, 68), bottom = Math.min(rect.bottom, innerHeight)
  return !document.hidden && !document.body.classList.contains('loading-lock') &&
    rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.left < innerWidth &&
    bottom - top >= Math.min(rect.height, innerHeight - 68) * .35
}

function pauseOutside(video, state) {
  if (!video.paused) { state.visibilityPause = true; video.pause() }
  state.button.hidden = true
}

function start(video, state) {
  if (!isVisible(video) || state.userPaused || state.pending || !video.paused || video.ended) return
  state.pending = true
  video.play().then(() => {
    state.blocked = false
    state.button.hidden = true
    if (!isVisible(video)) pauseOutside(video, state)
  }).catch(error => {
    // Keep native controls usable if the browser requires a gesture for sound.
    state.blocked = error.name === 'NotAllowedError'
    state.button.hidden = !state.blocked || !isVisible(video)
  }).finally(() => { state.pending = false })
}

for (const video of document.querySelectorAll('main video')) {
  video.autoplay = false
  video.removeAttribute('autoplay')
  video.removeAttribute('muted')
  video.defaultMuted = false
  video.muted = false
  video.playsInline = true
  video.preload = 'metadata'
  video.pause()
  const player = document.createElement('div')
  player.className = 'wiki-video-player'
  video.before(player)
  player.append(video)
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'wiki-video-play'
  button.textContent = 'Play with sound'
  button.hidden = true
  player.append(button)
  const state = {button, userPaused: false, visibilityPause: false, pending: false, blocked: false}
  states.set(video, state)
  button.addEventListener('click', () => { state.userPaused = false; start(video, state) })
  video.addEventListener('play', () => {
    state.userPaused = false
    state.button.hidden = true
    if (!isVisible(video)) pauseOutside(video, state)
  })
  video.addEventListener('pause', () => {
    if (state.visibilityPause) state.visibilityPause = false
    else if (isVisible(video) && !video.ended) state.userPaused = true
  })
  video.addEventListener('loadeddata', () => start(video, state))
}

function refresh() {
  for (const [video, state] of states) {
    if (isVisible(video)) start(video, state)
    else pauseOutside(video, state)
  }
}

if (states.size) {
  const observer = new IntersectionObserver(refresh, {threshold: [0, .15, .35, .5, 1]})
  states.forEach((_, video) => observer.observe(video))
  document.addEventListener('visibilitychange', refresh)
  window.addEventListener('resize', refresh, {passive: true})
  new MutationObserver(refresh).observe(document.body, {attributes: true, attributeFilter: ['class']})
  // Retry only the visible blocked video in a real gesture; never override
  // deliberate pauses or start videos further down the page.
  for (const event of ['pointerdown', 'keydown']) document.addEventListener(event, e => {
    if (!e.isTrusted || e.target.closest('video, .wiki-video-play') || e.repeat) return
    for (const [video, state] of states) if (state.blocked) start(video, state)
  })
}

import './ihp-final-20261017.css'

const reduced = matchMedia('(prefers-reduced-motion: reduce)')
const stats = document.querySelector('.ihp-final-numbers')
const counters = [...document.querySelectorAll('[data-ihp-counter]')]
const story = document.querySelector('.ihp-walking-story')
const stage = story?.querySelector('.ihp-walking-story__stage')
const row = story?.querySelector('.ihp-walking-story__row')
let frame = 0, walkingTimer = 0, counterProgress = 0
const clamp = value => Math.min(1, Math.max(0, value))

function update() {
  frame = 0
  if (stats) {
    const box = stats.getBoundingClientRect()
    // Every card shares the same scroll progress: first entrance to screen centre.
    counterProgress = Math.max(counterProgress, reduced.matches ? 1 : clamp((innerHeight - box.top) / (innerHeight / 2)))
    counters.forEach(counter => {
      counter.textContent = `${Math.round(Number(counter.dataset.ihpCounter) * counterProgress)}${counter.dataset.counterSuffix}`
    })
  }
  if (story && stage && row) {
    const box = story.getBoundingClientRect()
    const progress = reduced.matches ? 1 : clamp((innerHeight * .95 - box.top) / (innerHeight * .5))
    const start = stage.clientWidth + 8
    const end = Math.min(0, stage.clientWidth - row.offsetWidth)
    story.style.setProperty('--walk-progress', progress)
    story.style.setProperty('--walk-offset', `${reduced.matches ? 0 : start + (end - start) * progress}px`)
    story.dataset.walkProgress = progress.toFixed(3)
    story.classList.toggle('is-walking', !reduced.matches && progress > 0 && progress < 1)
    clearTimeout(walkingTimer)
    walkingTimer = setTimeout(() => story.classList.remove('is-walking'), 140)
  }
}
function schedule() { if (!frame) frame = requestAnimationFrame(update) }
addEventListener('scroll', schedule, { passive: true })
addEventListener('resize', schedule, { passive: true })
reduced.addEventListener('change', schedule)
new ResizeObserver(schedule).observe(document.querySelector('.ihp-content'))
update()

addEventListener('pagehide', () => { cancelAnimationFrame(frame); clearTimeout(walkingTimer) })

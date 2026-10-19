import './ihp-final-20261017.css'

const reduced = matchMedia('(prefers-reduced-motion: reduce)')
const stats = document.querySelector('.ihp-final-numbers')
const counters = [...document.querySelectorAll('[data-ihp-counter]')]
let frame = 0, counterProgress = 0
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
}
function schedule() { if (!frame) frame = requestAnimationFrame(update) }
addEventListener('scroll', schedule, { passive: true })
addEventListener('resize', schedule, { passive: true })
reduced.addEventListener('change', schedule)
new ResizeObserver(schedule).observe(document.querySelector('.ihp-content'))
update()

addEventListener('pagehide', () => cancelAnimationFrame(frame))

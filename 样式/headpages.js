import './headpages.css'

// Shared Judging destinations keep their navigation context without duplicating pages.
const path = location.pathname.toLowerCase().replace(/(?:\.html)?\/?$/, '')
const judgingPages = ['/eagagement/ihp', '/wet-lab/measurement', '/instrument/hardware']
if (new URLSearchParams(location.search).get('nav') === 'judging' && judgingPages.includes(path)) {
  const kicker = document.querySelector('.wiki-headpage__kicker')
  if (kicker) kicker.textContent = 'JLU-SPH iGEM 2026 · Judging'
}

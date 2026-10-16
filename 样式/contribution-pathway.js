document.querySelectorAll('[data-pathway-card]').forEach(card => {
  const front = card.querySelector('.contribution-flip-card__front')
  const back = card.querySelector('.contribution-flip-card__back')
  function flip(showBack) {
    card.classList.toggle('is-flipped', showBack)
    card.setAttribute('aria-pressed', String(showBack))
    front.setAttribute('aria-hidden', String(showBack))
    back.setAttribute('aria-hidden', String(!showBack))
  }
  card.addEventListener('click', () => flip(!card.classList.contains('is-flipped')))
  card.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    flip(false)
  })
})

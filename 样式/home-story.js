const story = document.querySelector('#home-story')

if (story) {
  const stage = story.querySelector('.story-stage')
  const cover = story.querySelector('.instrument-scene')
  const coverFrames = [...story.querySelectorAll('.cover-keyframe')]
  const chapters = [...story.querySelectorAll('[data-chapter]')]
  const progressIndicator = story.querySelector('.home-story-progress')
  const progressOutput = progressIndicator?.querySelector('output')
  const scrollCue = story.querySelector('.cover-scroll-cue')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
  const range = (value, start, end) => clamp((value - start) / Math.max(.0001, end - start))
  const smoothstep = (value) => value * value * (3 - 2 * value)

  function setCover(progress) {
    const frameProgress = clamp(progress * coverFrames.length)
    const activeIndex = Math.min(coverFrames.length - 1, Math.floor(frameProgress))
    const localProgress = frameProgress - activeIndex

    coverFrames.forEach((frame, index) => {
      const distance = Math.abs(index - activeIndex)
      frame.classList.toggle('is-cover-active', distance < 2)
      frame.style.setProperty('--cover-frame-opacity', index === activeIndex ? 1 : index === activeIndex + 1 ? localProgress : 0)
      frame.style.setProperty('--cover-frame-scale', String(1 + progress * .055))
      frame.style.setProperty('--cover-frame-brightness', String(1 - progress * .08))
    })
    cover?.style.setProperty('--instrument-scene-opacity', String(1 - smoothstep(range(progress, .92, 1))))
  }

  function setChapter(chapter, localProgress, isFinalChapter) {
    const entered = smoothstep(range(localProgress, .04, .22))
    const leaving = isFinalChapter ? 1 : 1 - smoothstep(range(localProgress, .82, .99))
    const opacity = entered * leaving
    const layerReveal = smoothstep(range(localProgress, .24, .66))
    chapter.style.setProperty('--chapter-opacity', opacity.toFixed(3))
    chapter.style.setProperty('--chapter-scale', (1.055 - entered * .045).toFixed(3))
    chapter.style.setProperty('--chapter-y', `${((1 - entered) * 22).toFixed(1)}px`)
    chapter.style.setProperty('--chapter-layer-opacity', layerReveal.toFixed(3))
    chapter.style.setProperty('--chapter-layer-rise', `${((1 - layerReveal) * 38).toFixed(1)}px`)
    chapter.style.setProperty('--chapter-layer-scale', (0.955 + layerReveal * .045).toFixed(3))
    chapter.style.setProperty('--chapter-mascot-x', `${(8 + smoothstep(range(localProgress, .28, .82)) * 84).toFixed(2)}%`)
    chapter.style.setProperty('--chapter-mascot-y', `${((1 - entered) * 12).toFixed(1)}%`)
    chapter.style.setProperty('--chapter-door-opacity', smoothstep(range(localProgress, .18, .38)).toFixed(3))
    chapter.style.setProperty('--chapter-open-opacity', smoothstep(range(localProgress, .45, .72)).toFixed(3))
    chapter.style.setProperty('--chapter-mascot-walk', `${(-26 + smoothstep(range(localProgress, .18, .72)) * 22).toFixed(1)}vw`)
    chapter.style.setProperty('--chapter-device-scale', (0.64 + smoothstep(range(localProgress, .28, .78)) * .25).toFixed(3))
    const processionMotion = smoothstep(range(localProgress, .18, .82))
    chapter.style.setProperty('--procession-people-x', `${(-4 + processionMotion * 8).toFixed(2)}vw`)
    chapter.style.setProperty('--procession-mascot-x', `${(18 - processionMotion * 56).toFixed(2)}vw`)

    const reachReveal = smoothstep(range(localProgress, .26, .82))
    chapter.style.setProperty('--reach-opacity', reachReveal.toFixed(3))
    chapter.style.setProperty('--reach-scale', (0.48 + reachReveal * .52).toFixed(3))
    chapter.classList.toggle('is-visible', opacity > .001)
  }

  function update() {
    const rect = story.getBoundingClientRect()
    const distance = Math.max(1, story.offsetHeight - window.innerHeight)
    const progress = clamp(-rect.top / distance)
    const coverLength = .155
    const chapterLength = (1 - coverLength) / chapters.length

    setCover(clamp(progress / coverLength))
    chapters.forEach((chapter, index) => setChapter(
      chapter,
      range(progress, coverLength + index * chapterLength, coverLength + (index + 1) * chapterLength),
      index === chapters.length - 1,
    ))

    if (scrollCue) scrollCue.style.opacity = String(1 - smoothstep(range(progress, .02, .07)))
    if (progressIndicator) {
      const percent = Math.round(progress * 100)
      progressIndicator.style.setProperty('--home-story-progress', progress.toFixed(4))
      progressIndicator.setAttribute('aria-valuenow', String(percent))
      if (progressOutput) progressOutput.textContent = `${percent}%`
    }
  }

  story.querySelectorAll('.home-flip-card').forEach((card) => {
    card.addEventListener('click', () => {
      const flipped = card.classList.toggle('is-flipped')
      card.setAttribute('aria-pressed', String(flipped))
    })
  })

  let pending = false
  const requestUpdate = () => {
    if (pending) return
    pending = true
    window.requestAnimationFrame(() => {
      pending = false
      update()
    })
  }

  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
  window.addEventListener('pageshow', requestUpdate)
  reducedMotion.addEventListener?.('change', requestUpdate)
  stage?.addEventListener('load', requestUpdate, true)
  update()
}

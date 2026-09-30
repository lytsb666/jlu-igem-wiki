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
  const workflowChapter = story.querySelector('.home-chapter--workflow')
  const workflowTimer = workflowChapter?.querySelector('.workflow-timer')
  const workflowPathogens = [...(workflowChapter?.querySelectorAll('.workflow-pathogen') ?? [])]
  const chapterProgressCache = new WeakMap()
  const chapterReady = new WeakSet()

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
  const range = (value, start, end) => clamp((value - start) / Math.max(.0001, end - start))
  const smoothstep = (value) => value * value * (3 - 2 * value)

  const originalCoverLength = .155
  const coverWeight = chapters.length * originalCoverLength / (1 - originalCoverLength)
  const chapterWeights = chapters.map((chapter) => {
    if (chapter.classList.contains('home-chapter--reach')) return 2.25
    if (chapter.classList.contains('home-chapter--cards')) return 1.15
    return 1
  })
  const totalWeight = coverWeight + chapterWeights.reduce((total, weight) => total + weight, 0)
  const coverLength = coverWeight / totalWeight
  let runningChapterStart = coverLength
  const chapterRanges = chapterWeights.map((weight) => {
    const start = runningChapterStart
    const end = start + weight / totalWeight
    runningChapterStart = end
    return { start, end }
  })

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

  function setChapter(chapter, localProgress, isFinalChapter, force = false) {
    localProgress = clamp(localProgress)
    const previousProgress = chapterProgressCache.get(chapter)
    if (!force && previousProgress !== undefined && Math.abs(previousProgress - localProgress) < .0005) return
    chapterProgressCache.set(chapter, localProgress)

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
    const reachFinal = smoothstep(range(localProgress, .64, .78))
    chapter.style.setProperty('--reach-final-opacity', reachFinal.toFixed(3))
    chapter.style.setProperty('--reach-final-scale', (1.025 - reachFinal * .025).toFixed(3))
    chapter.classList.toggle('is-visible', opacity > .001)
    chapter.classList.toggle('is-interactive', entered > .55 && leaving > .7)

    if (chapter === workflowChapter) {
      const backgroundArrival = smoothstep(range(localProgress, .12, .34))
      chapter.style.setProperty('--workflow-background-brightness', (.66 + backgroundArrival * .34).toFixed(3))
      chapter.style.setProperty('--workflow-background-scale', (1.045 - backgroundArrival * .045).toFixed(4))

      const setWorkflowLayer = (layer, reveal) => {
        if (!layer) return
        const resolvedReveal = reducedMotion.matches ? entered : reveal
        layer.style.setProperty('--workflow-layer-opacity', resolvedReveal.toFixed(3))
        layer.style.setProperty('--workflow-layer-rise', `${((1 - resolvedReveal) * 28).toFixed(2)}px`)
        layer.style.setProperty('--workflow-layer-scale', (.8 + resolvedReveal * .2).toFixed(4))
        layer.style.setProperty('--workflow-layer-blur', `${((1 - resolvedReveal) * 8).toFixed(2)}px`)
      }

      setWorkflowLayer(workflowTimer, smoothstep(range(localProgress, .28, .46)))
      workflowPathogens.forEach((pathogen, index) => {
        const start = .38 + index * .065
        setWorkflowLayer(pathogen, smoothstep(range(localProgress, start, start + .17)))
      })
      chapter.classList.toggle('is-motion-live', opacity > .5 && !reducedMotion.matches)
    }
  }

  function update() {
    const rect = story.getBoundingClientRect()
    const distance = Math.max(1, story.offsetHeight - window.innerHeight)
    const progress = clamp(-rect.top / distance)

    setCover(clamp(progress / coverLength))
    chapters.forEach((chapter, index) => {
      const { start, end } = chapterRanges[index]
      setChapter(chapter, range(progress, start, end), index === chapters.length - 1)
    })

    const targetIndex = chapterRanges.findIndex(({ start, end }, index) => (
      progress >= start && (progress < end || index === chapters.length - 1)
    ))
    if (targetIndex >= 0 && !chapterReady.has(chapters[targetIndex])) {
      const targetChapter = chapters[targetIndex]
      targetChapter.style.setProperty('--chapter-opacity', '0')
      targetChapter.classList.remove('is-visible', 'is-interactive')

      let fallbackIndex = targetIndex - 1
      while (fallbackIndex >= 0 && !chapterReady.has(chapters[fallbackIndex])) fallbackIndex -= 1
      if (fallbackIndex >= 0) {
        setChapter(chapters[fallbackIndex], .72, false, true)
      } else {
        setCover(.9)
      }
    }

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
      if (card.classList.contains('is-turning')) return
      card.classList.add('is-turning')
      const flipped = card.classList.toggle('is-flipped')
      card.setAttribute('aria-pressed', String(flipped))
      window.setTimeout(() => card.classList.remove('is-turning'), reducedMotion.matches ? 20 : 740)
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

  chapters.forEach((chapter) => {
    const images = [...chapter.querySelectorAll('img')]
    if (!images.length) {
      chapterReady.add(chapter)
      return
    }

    Promise.all(images.map((image) => {
      const loaded = image.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true })
            image.addEventListener('error', resolve, { once: true })
          })
      return loaded.then(() => (
        image.naturalWidth && typeof image.decode === 'function'
          ? image.decode().catch(() => undefined)
          : undefined
      ))
    })).then(() => new Promise((resolve) => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(resolve))
    })).then(() => {
      chapterReady.add(chapter)
      chapterProgressCache.delete(chapter)
      chapter.classList.add('is-ready')
      requestUpdate()
    })
  })

  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
  window.addEventListener('pageshow', requestUpdate)
  reducedMotion.addEventListener?.('change', () => {
    chapters.forEach((chapter) => chapterProgressCache.delete(chapter))
    requestUpdate()
  })
  stage?.addEventListener('load', requestUpdate, true)
  update()
}

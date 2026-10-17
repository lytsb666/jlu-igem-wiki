const story = document.querySelector('#home-story')

if (story) {
  const stage = story.querySelector('.story-stage')
  const ribbon = story.querySelector('.story-ribbon')
  const worldScene = story.querySelector('.world-scene')
  const world = story.querySelector('.story-world')
  const worldIntro = story.querySelector('.world-intro')
  const pcrButton = story.querySelector('.world-pcr')
  const pcrScene = story.querySelector('.world-pcr-scene')
  const lighthouseGlow = story.querySelector('.world-lighthouse-glow')
  const pcrStatus = pcrButton.querySelector('.world-pcr-status')
  let pcrStep = 0
  let pcrManual = false
  const campfirePeople = story.querySelector('.campfire-people')
  const campfirePeopleSource = story.querySelector('.campfire-people-source')
  const instrumentScene = story.querySelector('.instrument-scene')
  const coverKeyframes = [...story.querySelectorAll('.cover-keyframe')]
  const coverFrameReady = coverKeyframes.map(image => image.complete && image.naturalWidth > 0)
  const chapters = [...story.querySelectorAll('[data-chapter]')]
  // Neighboring scenes meet at a shared tone, feathered over their own art.
  // Separate decoration avoids replacing scene-specific background layers.
  const seamTones = ['#3b3025', '#493422', '#342331', '#4c494b', '#abb0af', '#c7b7a2', '#827c63', '#6f4e37']
  chapters.forEach((chapter, index) => {
    const seams = document.createElement('div')
    seams.className = 'home-scene-seams'
    seams.setAttribute('aria-hidden', 'true')
    seams.style.setProperty('--seam-entry', seamTones[index])
    seams.style.setProperty('--seam-exit', seamTones[index + 1])
    chapter.append(seams)
  })
  const worldSeam = document.createElement('div')
  worldSeam.className = 'home-scene-seams home-scene-seams--exit'
  worldSeam.setAttribute('aria-hidden', 'true')
  worldSeam.style.setProperty('--seam-exit', seamTones[0])
  worldScene.append(worldSeam)
  const frame = story.querySelector('.world-frame-overlay')
  const progressIndicator = story.querySelector('.home-story-progress')
  const progressOutput = progressIndicator?.querySelector('output')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const compactViewport = window.matchMedia('(max-width: 720px)')
  const chapterReady = new WeakSet()
  const chapterProgressCache = new WeakMap()
  const worldActions = new Set()
  const hoveredActions = new Set()
  const worldButtons = [...worldScene.querySelectorAll('[data-world-action]')]
  const worldNotes = [
    { element: worldScene.querySelector('[data-world-note="village"]'), enter: [0, .06], leave: [.27, .35] },
    { element: worldScene.querySelector('[data-world-note="pcr"]'), enter: [.27, .34], leave: [.62, .70] },
    { element: worldScene.querySelector('[data-world-note="care"]'), enter: [.70, .78], leave: [1.01, 1.02] },
  ]
  const workflowChapter = story.querySelector('.home-chapter--workflow')
  const workflowTimer = workflowChapter.querySelector('.workflow-timer')
  const countdown = workflowTimer.querySelector('[data-countdown]')
  // A single digital face follows the perspective of the original timer artwork.
  const segmentShapes = [
    'M10 4H54L61 11L54 18H10L3 11Z',
    'M57 17L64 10L70 17V52L63 59L57 52Z',
    'M57 68L64 61L70 68V103L63 110L57 103Z',
    'M10 104H54L61 111L54 118H10L3 111Z',
    'M0 68L7 61L13 68V103L6 110L0 103Z',
    'M0 17L7 10L13 17V52L6 59L0 52Z',
    'M10 54H54L61 61L54 68H10L3 61Z',
  ]
  const digitSegments = ['012345', '12', '01346', '01236', '1256', '02356', '023456', '012', '0123456', '012356']
  const svgNS = 'http://www.w3.org/2000/svg'
  const display = document.createElementNS(svgNS, 'svg')
  display.classList.add('workflow-digital-face')
  display.setAttribute('viewBox', '0 0 925 693')
  display.setAttribute('aria-hidden', 'true')
  const digits = []
  const face = document.createElementNS(svgNS, 'g')
  face.setAttribute('transform', 'matrix(2.3 1.24 -1.1 2.4 154 0)')
  for (const x of [0, 80, 180, 260]) {
    const group = document.createElementNS(svgNS, 'g')
    group.setAttribute('transform', `translate(${x} 0)`)
    const paths = segmentShapes.map(d => { const p = document.createElementNS(svgNS, 'path'); p.setAttribute('d', d); group.append(p); return p })
    digits.push(paths); face.append(group)
  }
  for (const y of [43, 83]) {
    const dot = document.createElementNS(svgNS, 'circle')
    dot.setAttribute('cx', '164'); dot.setAttribute('cy', String(y)); dot.setAttribute('r', '6'); face.append(dot)
  }
  display.append(face)
  workflowTimer.append(display)
  const countdownDuration = 30 * 60
  const countdownRate = 3
  let countdownStarted
  let countdownText
  const drawCountdown = () => {
    const elapsed = countdownStarted === undefined ? 0 : Math.floor((Date.now() - countdownStarted) * countdownRate / 1000) % countdownDuration
    const remaining = countdownDuration - elapsed
    const text = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`
    if (text === countdownText) return
    countdownText = text
    if (countdown) countdown.textContent = text
    const value = text.replace(':', '')
    digits.forEach((paths, index) => paths.forEach((p, segment) => p.classList.toggle('is-lit', digitSegments[Number(value[index])].includes(String(segment)))))
  }
  // The story timeline owns arrival. An adjacent panel can stay at the exact
  // viewport edge for a long hold, without another IntersectionObserver entry.
  const startCountdown = () => {
    if (countdownStarted !== undefined) return
    countdownStarted = Date.now()
    drawCountdown()
    setInterval(drawCountdown, 100)
  }
  drawCountdown()
  const workflowCaption = workflowChapter.querySelector('.workflow-caption')
  const workflowPathogens = [...workflowChapter.querySelectorAll('.workflow-pathogen')]
  const cardsChapter = story.querySelector('.home-chapter--cards')
  const cards = [...cardsChapter.querySelectorAll('.home-flip-card')]
  const cardStates = new Map(cards.map(card => [card, { handled: false, autoCompleted: false, timer: null }]))
  let cardsProgress = 0
  let cardsOnscreen = false
  const coverUnits = 4.55
  const chapterWeights = chapters.map(chapter => Number(chapter.dataset.weight))
  const coverFrameMotion = [
    { start: 0, end: .53, from: 1, to: 2.48, focus: [45, 63.1], target: [50, 50], exponent: 1.7 },
    { start: .59, end: .665, from: 1, to: 1.05, focus: [50, 46.5], target: [50, 50], exponent: 1.18 },
    { start: .725, end: .82, from: 1, to: 3.30, focus: [50.3, 44.1], target: [50, 50], exponent: 1.35 },
    { start: .88, end: .94, from: 1, to: 1.35, focus: [50.4, 48.2], target: [50, 50], exponent: 1.18 },
    { start: .98, end: 1, from: 1, to: 1.12, focus: [51.9, 47.4], target: [50, 50], exponent: 1.12 },
  ]
  const coverFrameBlends = [[.53, .59], [.665, .725], [.82, .88], [.94, .98]]
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
  const range = (value, start, end) => clamp((value - start) / Math.max(.0001, end - start))
  const smoothstep = value => { const p = clamp(value); return p * p * (3 - 2 * p) }
  const smootherstep = value => { const p = clamp(value); return p * p * p * (p * (p * 6 - 15) + 10) }
  let viewportHeight = window.innerHeight
  let viewportWidth = window.innerWidth
  let worldHeight = viewportHeight
  let worldUnits = 2.2
  let totalUnits = 1
  let chapterRanges = []
  let worldReady = false
  let pcrRevealStart = .42
  let pending = false
  let renderedCoverProgress = null
  let lastCoverFrameTime = null

  function refreshLayout() {
    viewportHeight = window.innerHeight
    viewportWidth = window.innerWidth
    stage.style.setProperty('--story-viewport-height', viewportHeight + 'px')
    worldHeight = Math.max(viewportHeight, world.offsetHeight)
    worldScene.style.height = worldHeight + 'px'
    worldUnits = Math.max(3, (worldHeight - viewportHeight) / viewportHeight * 4.6)
    // Reveal while the lighthouse sky enters, before the PCR illustration
    // reaches the top of the screen. Waiting for the panel bottom hid the art.
    pcrRevealStart = Math.max(.10, compactViewport.matches ? .30 : clamp((worldHeight / 3 - viewportHeight * .66) / Math.max(1, worldHeight - viewportHeight)))
    totalUnits = coverUnits + worldUnits + chapterWeights.reduce((sum, weight) => sum + weight, 0)
    story.style.height = (totalUnits + 1) * viewportHeight + 'px'
    let start = coverUnits + worldUnits
    chapterRanges = chapterWeights.map((weight, index) => {
      const segment = { start, end: start + weight }
      start += weight
      chapters[index].dataset.storyStart = (segment.start / totalUnits).toFixed(6)
      chapters[index].dataset.storyEnd = (segment.end / totalUnits).toFixed(6)
      return segment
    })
    stage.style.setProperty('--story-world-width', world.offsetWidth + 'px')
    worldNotes.forEach(({ element, enter, leave }) => {
      element.dataset.storyStart = ((coverUnits + worldUnits * enter[0]) / totalUnits).toFixed(6)
      element.dataset.storyFull = ((coverUnits + worldUnits * enter[1]) / totalUnits).toFixed(6)
      element.dataset.storyHoldEnd = ((coverUnits + worldUnits * leave[0]) / totalUnits).toFixed(6)
      element.dataset.storyEnd = ((coverUnits + worldUnits * Math.min(1, leave[1])) / totalUnits).toFixed(6)
    })
    pcrButton.dataset.storyStart = ((coverUnits + worldUnits * pcrRevealStart) / totalUnits).toFixed(6)
    pcrButton.dataset.storyFull = ((coverUnits + worldUnits * (pcrRevealStart + .09)) / totalUnits).toFixed(6)
    pcrButton.dataset.storySample = ((coverUnits + worldUnits * (compactViewport.matches ? .50 : clamp((worldHeight / 3 - viewportHeight * .18) / Math.max(1, worldHeight - viewportHeight)))) / totalUnits).toFixed(6)
    const worldLeft = (viewportWidth - world.offsetWidth) / 2
    campfirePeople.style.setProperty('--campfire-x', worldLeft + world.offsetWidth * .780317 + 'px')
    campfirePeople.style.setProperty('--campfire-y', world.offsetWidth * (1080 / 1935) * .958 + 'px')
    campfirePeople.style.setProperty('--campfire-people-width', world.offsetWidth * (compactViewport.matches ? .37 : .44) + 'px')
    chapters.forEach(chapter => chapterProgressCache.delete(chapter))
  }

  function setWorld(progress, coverProgress, ribbonY) {
    const active = name => worldActions.has(name) || hoveredActions.has(name)
    const peopleReveal = active('campfire') ? 1 : smoothstep(range(coverProgress, .915, .985)) * .88
    campfirePeople.style.setProperty('--campfire-people-opacity', peopleReveal.toFixed(3))
    campfirePeople.style.setProperty('--campfire-people-scale', reducedMotion.matches ? '1' : (0.965 + peopleReveal * .035).toFixed(4))
    worldIntro.style.setProperty('--world-intro-opacity', (1 - smoothstep(range(progress, .02, .20))).toFixed(3))
    worldScene.classList.toggle('is-campfire-lit', active('campfire'))
    worldScene.classList.toggle('is-room-lit', active('room'))
    const lights = [
      { element: story.querySelector('.story-world-light-lighthouse'), start: .06, end: .47, action: 'lighthouse' },
      { element: story.querySelector('.story-world-light-houses'), start: .52, end: .94, action: 'room' },
    ]
    lights.forEach(({element, start, end, action}) => {
      const reveal = reducedMotion.matches || active(action) ? 1 : smootherstep(range(progress, start, end))
      const edge = clamp(reveal * 1.08)
      element.style.setProperty('--world-light-opacity', smoothstep(range(reveal, 0, .20)).toFixed(3))
      if (action === 'lighthouse') {
        lighthouseGlow.style.setProperty('--lighthouse-glow-opacity', smoothstep(range(reveal, 0, .20)).toFixed(3))
      }
      element.style.setProperty('--world-light-clip-bottom', (1 - edge) * 100 + '%')
      element.style.setProperty('--world-light-mask-solid', clamp(edge - .08) * 100 + '%')
      element.style.setProperty('--world-light-mask-edge', edge * 100 + '%')
    })
    const visible = coverProgress > .88 && ribbonY < worldHeight
    worldScene.inert = !visible
    // Each paragraph follows the existing camera pan. No observer or
    // one-shot timer is involved, so scrolling back restores the same reveal.
    const noteEntrance = smoothstep(range(coverProgress, .94, 1))
    const worldExit = 1 - smoothstep(range(ribbonY, worldHeight - viewportHeight, worldHeight - viewportHeight * .80))
    worldScene.style.setProperty('--world-note-pan', ribbonY + 'px')
    worldNotes.forEach(({ element, enter, leave }) => {
      const arrive = smoothstep(range(progress, ...enter))
      const depart = 1 - smoothstep(range(progress, ...leave))
      const revealed = noteEntrance * arrive * depart * worldExit
      const resolved = reducedMotion.matches ? Number(revealed > .05) : revealed
      element.style.setProperty('--world-note-opacity', resolved.toFixed(4))
      const follow = range(progress, enter[1], leave[0])
      element.style.setProperty('--world-note-rise', (reducedMotion.matches ? 0 : -(1 - arrive) * 14 + follow * Math.min(76, viewportHeight * .09)) + 'px')
      element.style.setProperty('--world-note-scale', String(reducedMotion.matches ? 1 : .985 + arrive * .015))
      element.dataset.noteProgress = resolved.toFixed(4)
      element.setAttribute('aria-hidden', String(!visible || resolved <= .01))
    })
    const pcrReveal = smoothstep(range(progress, pcrRevealStart, pcrRevealStart + .09))
    const pcrOpacity = noteEntrance * pcrReveal * worldExit * (1 - smoothstep(range(progress, .62, .70)))
    pcrButton.style.setProperty('--pcr-mark-opacity', String(reducedMotion.matches ? Number(pcrOpacity > .05) : pcrOpacity))
    pcrScene.style.setProperty('--pcr-mark-opacity', String(reducedMotion.matches ? Number(pcrOpacity > .05) : pcrOpacity))
    pcrButton.style.setProperty('--pcr-mark-scale', String(reducedMotion.matches ? 1 : .90 + pcrReveal * .10))
    pcrButton.disabled = !visible || pcrOpacity < .1
    pcrButton.setAttribute('aria-hidden', String(pcrButton.disabled))
    if (!pcrManual) {
      const step = Math.min(3, Math.floor(range(progress, pcrRevealStart + .09, pcrRevealStart + .30) * 4))
      setPcrStep(step, false)
    }
    frame.classList.toggle('is-visible', visible)
    frame.classList.toggle('is-clock-live', visible && !reducedMotion.matches)
    frame.style.opacity = String(visible ? 1 - range(ribbonY, worldHeight - viewportHeight, worldHeight) : 0)
  }

  function setChapter(chapter, localProgress, isOnscreen) {
    const previous = chapterProgressCache.get(chapter)
    if (previous?.progress === localProgress && previous?.onscreen === isOnscreen) return
    chapterProgressCache.set(chapter, {progress: localProgress, onscreen: isOnscreen})
    const reduce = reducedMotion.matches
    const entered = smoothstep(range(localProgress, .04, .22))
    const layerReveal = smoothstep(range(localProgress, .24, .66))
    chapter.style.setProperty('--chapter-layer-opacity', layerReveal.toFixed(3))
    chapter.style.setProperty('--chapter-layer-rise', (reduce ? 0 : (1 - layerReveal) * 38) + 'px')
    chapter.style.setProperty('--chapter-layer-scale', String(reduce ? 1 : .955 + layerReveal * .045))
    chapter.classList.toggle('is-interactive', isOnscreen && entered > .55)
    chapter.inert = !isOnscreen || entered <= .55
    const travel = smootherstep(range(localProgress, .22, .88))
    // The crowd walks right while the lower mascot walks left. Both positions
    // depend on the scroll timeline so reversing the journey retraces them.
    chapter.style.setProperty('--procession-people-x', (reduce ? -30 : -60 + travel * 160) + 'vw')
    chapter.style.setProperty('--procession-mascot-x', (reduce ? 0 : 86 - travel * 86) + 'vw')
    // The question shares the mascot's moving container, so the viewport
    // reveals the two lines behind it and reverse scrolling draws them back.
    chapter.style.setProperty('--procession-question-opacity', String(reduce ? entered : 1))

    if (chapter === cardsChapter) {
      cardsProgress = localProgress
      cardsOnscreen = isOnscreen && entered > .55 && chapterReady.has(chapter)
      updateAutomaticCards()
    }

    if (chapter.classList.contains('home-chapter--door')) {
      const walk = smootherstep(range(localProgress, .145, .49))
      const arrival = smootherstep(range(localProgress, .14, .19))
      const swap = smootherstep(range(localProgress, .49, .56))
      const open = smootherstep(range(localProgress, .50, .65))
      const step = Math.sin(walk * Math.PI * 10) * Math.sin(walk * Math.PI)
      chapter.style.setProperty('--detector-entry-opacity', '1')
      chapter.style.setProperty('--detector-entry-brightness', String(.75 + entered * .25))
      chapter.style.setProperty('--detector-entry-scale', String(reduce ? 1 : 1.018 - entered * .018))
      chapter.style.setProperty('--detector-character-travel', (reduce ? 0 : -180.451 * (1 - walk)) + '%')
      chapter.style.setProperty('--detector-character-bob', (reduce ? 0 : -Math.abs(step) * .52) + '%')
      chapter.style.setProperty('--detector-character-roll', (reduce ? 0 : step * 1.2) + 'deg')
      chapter.style.setProperty('--detector-walking-opacity', String(reduce ? 0 : arrival * (1 - swap)))
      chapter.style.setProperty('--detector-standing-opacity', String(reduce ? entered : swap))
      chapter.style.setProperty('--detector-door-open-opacity', String(open))
      chapter.style.setProperty('--detector-door-clip-left', (76.74 - open * 12.97) + '%')
    }

    if (chapter === workflowChapter) {
      if (isOnscreen && chapterReady.has(chapter)) startCountdown()
      const backgroundArrival = smoothstep(range(localProgress, .12, .34))
      chapter.style.setProperty('--workflow-background-brightness', (.66 + backgroundArrival * .34).toFixed(3))
      chapter.style.setProperty('--workflow-background-scale', String(reduce ? 1 : 1.045 - backgroundArrival * .045))
      const caption = smoothstep(range(localProgress, .24, .36)) * (1 - smoothstep(range(localProgress, .54, .62)))
      const captionOpacity = reduce ? Number(caption > .05) : caption
      workflowCaption.style.setProperty('--workflow-caption-opacity', String(captionOpacity))
      workflowCaption.style.setProperty('--workflow-caption-rise', (reduce ? 0 : (1 - smoothstep(range(localProgress, .24, .36))) * 14) + 'px')
      workflowCaption.setAttribute('aria-hidden', String(!isOnscreen || captionOpacity <= .01))
      const setWorkflowLayer = (layer, reveal) => {
        const resolved = reduce ? Number(reveal > .05) : reveal
        layer.style.setProperty('--workflow-layer-opacity', resolved.toFixed(3))
        layer.style.setProperty('--workflow-layer-rise', (reduce ? 0 : (1 - resolved) * 28) + 'px')
        layer.style.setProperty('--workflow-layer-scale', String(reduce ? 1 : .8 + resolved * .2))
        layer.style.setProperty('--workflow-layer-blur', (reduce ? 0 : (1 - resolved) * 8) + 'px')
      }
      // The screen is live from arrival; it does not wait for a later scroll cue.
      setWorkflowLayer(workflowTimer, 1)
      workflowPathogens.forEach((pathogen, index) => {
        const start = .62 + index * .045
        setWorkflowLayer(pathogen, smoothstep(range(localProgress, start, start + .12)))
      })
      chapter.classList.toggle('is-motion-live', isOnscreen && !reduce)
    }

    if (chapter.classList.contains('home-chapter--reach')) {
      const background = smoothstep(range(localProgress, .18, .36))
      const ensemble = smoothstep(range(localProgress, .38, .56))
      const device = smoothstep(range(localProgress, .58, .72))
      const effect = smoothstep(range(localProgress, .74, .90))
      const message = smoothstep(range(localProgress, .76, .94))
      chapter.style.setProperty('--legacy-background-brightness', String(.64 + background * .36))
      chapter.style.setProperty('--legacy-background-scale', String(reduce ? 1 : 1.025 - background * .025))
      chapter.style.setProperty('--legacy-ensemble-opacity', String(ensemble))
      chapter.style.setProperty('--legacy-device-opacity', String(device))
      chapter.style.setProperty('--legacy-effect-opacity', String(effect))
      chapter.style.setProperty('--reach-message-opacity', String(message))
      chapter.style.setProperty('--reach-message-rise', (reduce ? 0 : (1 - message) * 28) + 'px')
      chapter.classList.toggle('is-device-live', isOnscreen && device > .05 && !reduce)
      chapter.classList.toggle('is-effect-live', isOnscreen && effect > .05 && !reduce)
    }
  }

  function setSceneVisibility(scene, visible) {
    scene.classList.toggle('is-visible', visible)
    scene.setAttribute('aria-hidden', String(!visible))
  }
  function prepareCampfirePeople() {
    if (!campfirePeople || !campfirePeopleSource) return

    const render = () => {
      const width = campfirePeopleSource.naturalWidth
      const height = campfirePeopleSource.naturalHeight
      if (!width || !height) return

      try {
        const sourceCanvas = document.createElement('canvas')
        sourceCanvas.width = width
        sourceCanvas.height = height
        const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true })
        const outputContext = campfirePeople.getContext('2d')
        if (!sourceContext || !outputContext) return

        sourceContext.drawImage(campfirePeopleSource, 0, 0)
        const pixels = sourceContext.getImageData(0, 0, width, height)
        const data = pixels.data
        const visited = new Uint8Array(width * height)
        const queue = new Int32Array(width * height)
        let head = 0
        let tail = 0

        const enqueue = (index) => {
          if (visited[index]) return
          const offset = index * 4
          const red = data[offset]
          const green = data[offset + 1]
          const blue = data[offset + 2]
          const maximum = Math.max(red, green, blue)
          const minimum = Math.min(red, green, blue)
          if (minimum <= 205 || maximum - minimum >= 38) return
          visited[index] = 1
          queue[tail] = index
          tail += 1
        }

        for (let x = 0; x < width; x += 1) {
          enqueue(x)
          enqueue((height - 1) * width + x)
        }
        for (let y = 1; y < height - 1; y += 1) {
          enqueue(y * width)
          enqueue(y * width + width - 1)
        }

        while (head < tail) {
          const index = queue[head]
          head += 1
          const x = index % width
          if (x > 0) enqueue(index - 1)
          if (x < width - 1) enqueue(index + 1)
          if (index >= width) enqueue(index - width)
          if (index < width * (height - 1)) enqueue(index + width)
        }

        for (let index = 0; index < visited.length; index += 1) {
          if (!visited[index]) continue
          const offset = index * 4
          const luminance = (data[offset] + data[offset + 1] + data[offset + 2]) / 3
          data[offset + 3] = Math.round(clamp((250 - luminance) / 35) * 255)
        }

        sourceContext.putImageData(pixels, 0, 0)
        const split = Math.round(width * 0.563)
        // Keep the two illustrated groups close to the fire while preserving
        // their original scale and left/right arrangement.
        const gap = Math.round(width * 0.14)
        campfirePeople.width = width + gap
        campfirePeople.height = height
        outputContext.clearRect(0, 0, campfirePeople.width, height)
        outputContext.drawImage(sourceCanvas, 0, 0, split, height, 0, 0, split, height)
        outputContext.drawImage(
          sourceCanvas,
          split,
          0,
          width - split,
          height,
          split + gap,
          0,
          width - split,
          height,
        )
        campfirePeople.classList.add('is-ready')
        requestUpdate()
      } catch {
        campfirePeople.classList.remove('is-ready')
      }
    }

    const scheduleRender = () => {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(render, { timeout: 800 })
      } else {
        window.setTimeout(render, 0)
      }
    }

    if (campfirePeopleSource.complete && campfirePeopleSource.naturalWidth) scheduleRender()
    else campfirePeopleSource.addEventListener('load', scheduleRender, { once: true })
  }

  function setCoverScene(progress) {
    if (!instrumentScene) return

    const worldReveal = smoothstep(range(progress, 0.90, 0.98))
    const sceneOpacity = 1 - worldReveal
    const cueExit = smoothstep(range(progress, 0.018, 0.08))
    const shadeIn = smoothstep(range(progress, 0.88, 0.96))
    const reduce = reducedMotion.matches
    const motionProgress = range(progress, 0.02, 0.90)

    // The two reference clips are one accelerating camera move. Each supplied
    // key image keeps moving for its whole interval; blends happen only after
    // the shared lens, iris or virus has been centred and matched in scale.
    let currentFrame = 0
    let incomingFrame = -1
    let incomingMix = 0
    let activeBlendProgress = 0

    if (!reduce) {
      for (let index = 0; index < coverFrameBlends.length; index += 1) {
        const [start, end] = coverFrameBlends[index]
        if (motionProgress < start) break
        if (motionProgress < end) {
          incomingFrame = index + 1
          const blendProgress = range(motionProgress, start, end)
          activeBlendProgress = smootherstep(blendProgress)
          incomingMix = smootherstep(range(blendProgress, 0.16, 0.92))
          break
        }
        currentFrame = index + 1
      }
    }

    coverKeyframes.forEach((frame, index) => {
      const motion = coverFrameMotion[index]
      const rawMotion = range(motionProgress, motion.start, motion.end)
      const easedMotion = Math.pow(rawMotion, motion.exponent)
      const sharedBlendScale = incomingFrame >= 0 && (index === currentFrame || index === incomingFrame)
        ? 1 + activeBlendProgress * 0.045
        : 1
      const scale = reduce
        ? 1
        : (motion.from + (motion.to - motion.from) * easedMotion) * sharedBlendScale
      const travelStart = index === 0 ? 0.70 : 0
      const travel = reduce ? 0 : index === 0
        ? smoothstep(range(rawMotion, travelStart, 1))
        : 1
      const translateX = (motion.target[0] - motion.focus[0]) * travel
      const translateY = (motion.target[1] - motion.focus[1]) * travel
      const currentIsReady = coverFrameReady[currentFrame] !== false
      const incomingIsReady = incomingFrame >= 0 && coverFrameReady[incomingFrame] !== false
      const safeCurrentFrame = currentIsReady ? currentFrame : Math.max(0, currentFrame - 1)
      const isCurrent = index === safeCurrentFrame
      const isIncoming = incomingIsReady && index === incomingFrame
      const isVisible = reduce ? index === 0 : isCurrent || isIncoming
      const opacity = reduce ? (index === 0 ? 1 : 0) : isCurrent ? 1 : isIncoming ? incomingMix : 0
      const usesOpticalMask = isIncoming && incomingFrame >= 2
      const maskInner = usesOpticalMask ? 12 + incomingMix * 94 : 100
      const maskOuter = usesOpticalMask ? maskInner + 12 : 140
      const irisToneDown = index === 2 ? smoothstep(range(rawMotion, 0.76, 1)) : 0
      const brightness = reduce ? 1 : index === 3 ? 1.06 : 1 - irisToneDown * 0.12
      const saturation = reduce ? 1 : 1 - irisToneDown * 0.05

      frame.style.setProperty('--cover-frame-opacity', opacity.toFixed(4))
      frame.style.setProperty('--cover-frame-scale', scale.toFixed(4))
      frame.style.setProperty('--cover-frame-x', `${translateX.toFixed(3)}%`)
      frame.style.setProperty('--cover-frame-y', `${translateY.toFixed(3)}%`)
      frame.style.setProperty('--cover-frame-focus-x', `${motion.focus[0]}%`)
      frame.style.setProperty('--cover-frame-focus-y', `${motion.focus[1]}%`)
      frame.style.setProperty('--cover-frame-brightness', brightness.toFixed(3))
      frame.style.setProperty('--cover-frame-saturation', saturation.toFixed(3))
      const mask = usesOpticalMask
        ? `radial-gradient(circle at 50% 50%, #000 0 ${maskInner.toFixed(2)}%, transparent ${maskOuter.toFixed(2)}%)`
        : 'none'
      frame.style.setProperty('--cover-frame-mask', mask)
      frame.style.visibility = isVisible ? 'visible' : 'hidden'
      frame.classList.toggle('is-cover-active', isVisible)
    })

    instrumentScene.style.setProperty('--instrument-scene-opacity', sceneOpacity.toFixed(3))
    instrumentScene.style.setProperty('--cover-shade-opacity', (reduce ? 0 : shadeIn * 0.42).toFixed(3))
    instrumentScene.style.setProperty('--cover-cue-opacity', (1 - cueExit).toFixed(3))
    instrumentScene.style.setProperty('--cover-cue-rise', `${(cueExit * 10).toFixed(2)}px`)
    stage.style.setProperty('--cover-cue-opacity', (1 - cueExit).toFixed(3))
    stage.style.setProperty('--cover-cue-rise', `${(cueExit * 10).toFixed(2)}px`)
    setSceneVisibility(instrumentScene, sceneOpacity > 0.001)
  }


  function update(frameTime = performance.now()) {
    const rect = story.getBoundingClientRect()
    const distance = Math.max(1, story.offsetHeight - viewportHeight)
    const progress = clamp(-rect.top / distance)
    const units = progress * totalUnits
    const coverProgress = clamp(units / coverUnits)
    const worldProgress = range(units, coverUnits, coverUnits + worldUnits)
    const maxPan = Math.max(0, worldHeight - viewportHeight)
    let ribbonY = maxPan * worldProgress
    let activeIndex = -1
    chapterRanges.forEach(({start, end}, index) => {
      const local = range(units, start, end)
      if (units >= start && (units < end || index === chapters.length - 1)) {
        activeIndex = index
        // The panels share one vertical strip: no opacity handoff or blank
        // inter-scene frame, even when a wheel gesture skips several scenes.
        ribbonY = maxPan + (index + range(local, 0, .22)) * viewportHeight
      }
      setChapter(chapters[index], local, units >= start && units <= end)
    })
    if (activeIndex >= 0 && !chapterReady.has(chapters[activeIndex])) {
      let readyIndex = activeIndex - 1
      while (readyIndex >= 0 && !chapterReady.has(chapters[readyIndex])) readyIndex -= 1
      ribbonY = readyIndex >= 0 ? worldHeight + readyIndex * viewportHeight : maxPan
      if (readyIndex >= 0) setChapter(chapters[readyIndex], .72, true)
    }
    ribbon.style.setProperty('--ribbon-y', -ribbonY + 'px')
    setWorld(worldProgress, coverProgress, ribbonY)

    const elapsed = lastCoverFrameTime === null ? 16 : clamp(frameTime - lastCoverFrameTime, 8, 32)
    lastCoverFrameTime = frameTime
    const gap = Math.abs(coverProgress - (renderedCoverProgress ?? coverProgress))
    if (renderedCoverProgress === null || reducedMotion.matches || gap > .15 || rect.top > 0) {
      renderedCoverProgress = coverProgress
    } else {
      const responseTime = gap > .012 ? 52 : 76
      renderedCoverProgress += (coverProgress - renderedCoverProgress) * (1 - Math.exp(-elapsed / responseTime))
      if (Math.abs(coverProgress - renderedCoverProgress) < .00025) renderedCoverProgress = coverProgress
    }
    // Keep the original first frame until the underlying long image can draw.
    setCoverScene(worldReady ? renderedCoverProgress : Math.min(.88, renderedCoverProgress))
    const percent = Math.round(progress * 100)
    progressIndicator.style.setProperty('--home-story-progress', progress.toFixed(4))
    progressIndicator.setAttribute('aria-valuenow', String(percent))
    progressOutput.textContent = percent + '%'
    story.dataset.storyPhase = units < coverUnits ? 'cover' : activeIndex < 0 ? 'world' : chapters[activeIndex].className.split(' ').find(name => name.startsWith('home-chapter--')).slice(14)
    if (Math.abs(coverProgress - renderedCoverProgress) >= .00025) requestUpdate()
  }

  function requestUpdate() {
    if (pending) return
    pending = true
    window.requestAnimationFrame(time => {
      pending = false
      update(time)
    })
  }

  function decodeImage(image) {
    const loaded = image.complete ? Promise.resolve() : new Promise(resolve => {
      image.addEventListener('load', resolve, {once: true})
      image.addEventListener('error', resolve, {once: true})
    })
    return loaded.then(() => image.naturalWidth && image.decode ? image.decode().catch(() => undefined) : undefined)
  }

  worldButtons.forEach(button => {
    const action = button.dataset.worldAction
    const enter = () => { hoveredActions.add(action); requestUpdate() }
    const leave = () => { hoveredActions.delete(action); requestUpdate() }
    button.addEventListener('pointerenter', enter)
    button.addEventListener('pointerleave', leave)
    button.addEventListener('focus', enter)
    button.addEventListener('blur', leave)
    button.addEventListener('click', () => {
      if (worldActions.has(action)) worldActions.delete(action)
      else worldActions.add(action)
      button.setAttribute('aria-pressed', String(worldActions.has(action)))
      requestUpdate()
    })
  })

  function setPcrStep(step, announce) {
    pcrStep = step
    pcrButton.dataset.pcrStep = String(step)
    const descriptions = ['Click to explore amplification', 'DNA strands separate', 'Primers bind to the target', 'DNA is copied · 1 copy → 2 copies']
    pcrButton.setAttribute('aria-label', 'PCR: ' + descriptions[step] + '. Click for the next step.')
    if (announce) pcrStatus.textContent = descriptions[step]
  }

  pcrButton.addEventListener('click', () => {
    pcrManual = true
    setPcrStep((pcrStep + 1) % 4, true)
  })

  function finishCardTurn(card) {
    const state = cardStates.get(card)
    window.clearTimeout(state.timer)
    state.timer = null
    card.classList.remove('is-turning')
  }

  function turnCard(card, flipped, source) {
    if (card.classList.contains('is-flipped') === flipped) return false
    card.classList.add('is-turning')
    card.classList.toggle('is-flipped', flipped)
    card.dataset.flipSource = source
    card.setAttribute('aria-pressed', String(flipped))
    card.setAttribute('aria-label', card.dataset.cardLabel + (flipped ? ': show front' : ': show application'))
    // transitionend normally releases the turn; the fallback also covers a
    // reduced-motion change or an offscreen transition cancelled by navigation.
    cardStates.get(card).timer = window.setTimeout(() => finishCardTurn(card), reducedMotion.matches ? 20 : 900)
    return true
  }

  function updateAutomaticCards() {
    if (!cardsOnscreen) return
    const progress = reducedMotion.matches ? Number(cardsProgress >= .48) : smootherstep(range(cardsProgress, .32, .64))
    cards.forEach(card => {
      const state = cardStates.get(card)
      if (state.handled || state.autoCompleted) return
      // All untouched cards follow the same scroll angle. Completed or manually
      // chosen cards retain their state when the reader revisits the chapter.
      const flipped = progress >= .5
      card.classList.add('is-scroll-turning')
      card.style.setProperty('--scroll-flip-angle', `${(progress * 180).toFixed(3)}deg`)
      card.classList.toggle('is-flipped', flipped)
      card.dataset.flipSource = 'automatic'
      card.setAttribute('aria-pressed', String(flipped))
      card.setAttribute('aria-label', card.dataset.cardLabel + (flipped ? ': show front' : ': show application'))
      if (progress === 1) {
        state.autoCompleted = true
        card.classList.remove('is-scroll-turning')
        card.style.removeProperty('--scroll-flip-angle')
      }
    })
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('is-turning')) return
      // A user's choice, including turning a card back, takes precedence over
      // subsequent automatic thresholds and reverse scrolling.
      cardStates.get(card).handled = true
      card.classList.remove('is-scroll-turning')
      card.style.removeProperty('--scroll-flip-angle')
      turnCard(card, !card.classList.contains('is-flipped'), 'manual')
    })
    card.querySelector('.home-flip-card__inner').addEventListener('transitionend', event => {
      if (event.propertyName === 'transform' && event.target === event.currentTarget) finishCardTurn(card)
    })
  })

  const cardsFront = new Image()
  cardsFront.src = new URL('../a  图片/home-story/final-20261012/card-hospital.webp', import.meta.url).href
  const cardsFrontOthers = [
    new URL('../a  图片/home-story/final-20261012/card-care-home.webp', import.meta.url),
    new URL('../a  图片/home-story/final-20261012/card-kindergarten.webp', import.meta.url),
    new URL('../a  图片/home-story/final-20261012/card-home.webp', import.meta.url),
  ].map(url => { const image = new Image(); image.src = url.href; return image })
  const cardsBack = new Image()
  cardsBack.src = new URL('../a  图片/home-story/cards/cards-back.jpg', import.meta.url).href
  chapters.forEach(chapter => {
    const images = [...chapter.querySelectorAll('img')]
    if (chapter.classList.contains('home-chapter--cards')) images.push(cardsFront, ...cardsFrontOthers, cardsBack)
    Promise.all(images.map(decodeImage)).then(() => {
      if (!images.every(image => image.naturalWidth > 0)) chapter.classList.add('is-media-error')
      chapterReady.add(chapter)
      chapter.classList.add('is-ready')
      chapterProgressCache.delete(chapter)
      requestUpdate()
    })
  })
  Promise.all([...worldScene.querySelectorAll('img')].map(decodeImage)).then(() => {
    worldReady = world.naturalWidth > 0
    refreshLayout()
    requestUpdate()
  })
  coverKeyframes.forEach((image, index) => {
    decodeImage(image).then(() => { coverFrameReady[index] = image.naturalWidth > 0; requestUpdate() })
  })
  window.addEventListener('scroll', requestUpdate, {passive: true})
  window.addEventListener('resize', () => {
    // Ignore a compact browser's address-bar-only resize to keep the timeline steady.
    if (compactViewport.matches && viewportWidth === window.innerWidth && Math.abs(viewportHeight - window.innerHeight) < 120) return
    const oldDistance = Math.max(1, story.offsetHeight - viewportHeight)
    const storyTop = story.getBoundingClientRect().top + window.scrollY
    const previousProgress = clamp((window.scrollY - storyTop) / oldDistance)
    const pinned = window.scrollY >= storyTop && window.scrollY <= storyTop + oldDistance
    refreshLayout()
    chapters.forEach(chapter => chapterProgressCache.delete(chapter))
    if (pinned) window.scrollTo({top: storyTop + previousProgress * (story.offsetHeight - viewportHeight), behavior: 'instant'})
    requestUpdate()
  })
  window.addEventListener('pageshow', requestUpdate)
  window.addEventListener('pagehide', () => {
    cardsOnscreen = false
    cards.forEach(card => {
      window.clearTimeout(cardStates.get(card).timer)
      cardStates.get(card).timer = null
      card.classList.remove('is-turning')
    })
    chapterProgressCache.delete(cardsChapter)
  })
  window.addEventListener('blur', () => { hoveredActions.clear(); requestUpdate() })
  reducedMotion.addEventListener?.('change', () => {
    chapters.forEach(chapter => chapterProgressCache.delete(chapter))
    requestUpdate()
  })
  stage.addEventListener('load', requestUpdate, true)
  refreshLayout()
  prepareCampfirePeople()
  update()
}

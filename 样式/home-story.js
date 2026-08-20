const story = document.querySelector('#home-story')

if (story) {
  const stage = story.querySelector('.story-stage')
  const worldScene = story.querySelector('.world-scene')
  const world = story.querySelector('.story-world')
  const worldLightLayers = [
    { element: story.querySelector('.story-world-light-lighthouse'), start: 0.06, end: 0.47 },
    { element: story.querySelector('.story-world-light-houses'), start: 0.52, end: 0.94 },
  ].filter(({ element }) => element)
  const worldIntro = story.querySelector('.world-intro')
  const campfirePeople = story.querySelector('.campfire-people')
  const campfirePeopleSource = story.querySelector('.campfire-people-source')
  const instrumentScene = story.querySelector('.instrument-scene')
  const processionScene = story.querySelector('.procession-scene')
  const processionCanvas = story.querySelector('.procession-canvas')
  const processionBackground = story.querySelector('.procession-background')
  const processionCharacter = story.querySelector('.procession-character')
  const detectorScene = story.querySelector('.detector-scene')
  const familyScene = story.querySelector('.family-scene')
  const careScene = story.querySelector('.care-scene')
  const legacyScene = story.querySelector('.legacy-scene')
  const finaleScene = story.querySelector('.finale-scene')
  const compactViewport = window.matchMedia('(max-width: 720px)')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
  const objects = {
    elderly: story.querySelector('.story-elderly'),
  }
  const instrumentImages = instrumentScene
    ? [...instrumentScene.querySelectorAll('img')]
    : []
  const coverKeyframes = instrumentScene
    ? [...instrumentScene.querySelectorAll('.cover-keyframe')]
    : []
  const processionImages = processionScene
    ? [...processionScene.querySelectorAll('img')]
    : []
  const processionBackgroundImages = processionBackground ? [processionBackground] : []
  const processionCharacterImages = processionCharacter ? [processionCharacter] : []
  const detectorImages = detectorScene
    ? [...detectorScene.querySelectorAll('img')]
    : []
  const familyImages = familyScene
    ? [...familyScene.querySelectorAll('img')]
    : []
  const careImages = careScene
    ? [...careScene.querySelectorAll('img')]
    : []
  const legacyImages = legacyScene
    ? [...legacyScene.querySelectorAll('img')]
    : []
  const finaleImages = finaleScene
    ? [...finaleScene.querySelectorAll('img')]
    : []
  const sceneReadiness = {
    processionBackground: !processionBackground,
    processionCharacter: !processionCharacter,
    detector: detectorImages.length === 0,
    family: familyImages.length === 0,
    care: careImages.length === 0,
    legacy: legacyImages.length === 0,
    finale: finaleImages.length === 0,
  }
  const scenePreparation = {}

  let ticking = false
  let renderedCoverProgress = null
  let lastCoverFrameTime = null
  let worldIntroInteractive = false
  let worldIntroPointerFrame = null
  let worldIntroPointerX = 0
  let worldIntroPointerY = 0
  let timelineViewportWidth = window.innerWidth
  let timelineViewportHeight = Math.max(1, window.innerHeight)
  let timelineOrientation = window.innerWidth >= window.innerHeight ? 'landscape' : 'portrait'
  const storyPace = 0.7
  const coverFrameMotion = [
    { start: 0, end: 0.53, from: 1, to: 2.48, focus: [45, 63.1], target: [50, 50], exponent: 1.7 },
    { start: 0.59, end: 0.665, from: 1, to: 1.05, focus: [50, 46.5], target: [50, 50], exponent: 1.18 },
    { start: 0.725, end: 0.82, from: 1, to: 3.30, focus: [50.3, 44.1], target: [50, 50], exponent: 1.35 },
    { start: 0.88, end: 0.94, from: 1, to: 1.35, focus: [50.4, 48.2], target: [50, 50], exponent: 1.18 },
    { start: 0.98, end: 1, from: 1, to: 1.12, focus: [51.9, 47.4], target: [50, 50], exponent: 1.12 },
  ]
  const coverFrameBlends = [[0.53, 0.59], [0.665, 0.725], [0.82, 0.88], [0.94, 0.98]]
  const coverFrameReady = coverKeyframes.map((frame) => frame.complete && frame.naturalWidth > 0)

  const anchors = {
    // X values come directly from the WPS composition. Y values are mapped
    // onto the taller source background using matched landscape landmarks.
    elderly: [0.759547, 0.889220],
  }

  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value))
  }

  function range(progress, start, end) {
    return clamp((progress - start) / (end - start))
  }

  function smoothstep(value) {
    const progress = clamp(value)
    return progress * progress * (3 - 2 * progress)
  }

  function smootherstep(value) {
    const progress = clamp(value)
    return progress * progress * progress * (progress * (progress * 6 - 15) + 10)
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
        const gap = Math.round(width * 0.348)
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

  function setWorldLights(progress) {
    worldLightLayers.forEach(({ element, start, end }) => {
      const reveal = reducedMotion.matches ? 1 : smootherstep(range(progress, start, end))
      const maskEdge = clamp(reveal * 1.08)
      const maskSolid = clamp(reveal * 1.08 - 0.08)
      const opacity = reducedMotion.matches ? 1 : smoothstep(range(reveal, 0, 0.20))

      element.style.setProperty('--world-light-opacity', opacity.toFixed(3))
      element.style.setProperty('--world-light-clip-bottom', `${((1 - maskEdge) * 100).toFixed(2)}%`)
      element.style.setProperty('--world-light-mask-solid', `${(maskSolid * 100).toFixed(2)}%`)
      element.style.setProperty('--world-light-mask-edge', `${(maskEdge * 100).toFixed(2)}%`)
    })
  }

  function setSceneVisibility(scene, visible) {
    if (!scene) return
    scene.classList.toggle('is-visible', visible)
    if (visible) scene.removeAttribute('aria-hidden')
    else scene.setAttribute('aria-hidden', 'true')
  }

  function setMotionState(scene, className, amount, allowed = true) {
    if (!scene) return

    const isActive = scene.classList.contains(className)
    if (!allowed || amount <= 0.002) {
      scene.classList.remove(className)
    } else if (!isActive && amount >= 0.05) {
      scene.classList.add(className)
    }
  }

  function refreshTimelineViewport(force = false) {
    const width = window.innerWidth
    const height = Math.max(1, window.innerHeight)
    const orientation = width >= height ? 'landscape' : 'portrait'
    const widthChanged = Math.abs(width - timelineViewportWidth) > 8
    const orientationChanged = orientation !== timelineOrientation

    // Mobile browser chrome frequently changes only innerHeight while the user
    // scrolls. Keeping the timeline height stable prevents opacity thresholds
    // from jumping back and forth as the address bar expands or collapses.
    if (force || !compactViewport.matches || widthChanged || orientationChanged) {
      timelineViewportWidth = width
      timelineViewportHeight = height
      timelineOrientation = orientation
    }
  }

  function decodeImage(image) {
    image.loading = 'eager'
    if (image.fetchPriority !== 'high') image.fetchPriority = 'low'

    const loaded = image.complete
      ? Promise.resolve()
      : new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true })
          image.addEventListener('error', resolve, { once: true })
        })

    return loaded.then(() => {
      if (!image.naturalWidth) return false
      if (typeof image.decode !== 'function') return true
      return image.decode().then(() => true).catch(() => image.naturalWidth > 0)
    })
  }

  async function prepareSceneImages(name, scene, images) {
    if (!scene || images.length === 0) {
      sceneReadiness[name] = true
      return true
    }

    const results = await Promise.all(images.map(decodeImage))
    const ready = results.every(Boolean)
    sceneReadiness[name] = ready
    scene.classList.toggle('is-images-ready', ready)
    requestUpdate()
    return ready
  }

  function ensureScenePrepared(name, scene, images) {
    if (sceneReadiness[name]) return Promise.resolve(true)
    if (scenePreparation[name]) return scenePreparation[name]

    scenePreparation[name] = prepareSceneImages(name, scene, images)
    return scenePreparation[name]
  }

  function revealFromViewportBottom(element, anchorY, scale, stageTop, viewportHeight) {
    const objectTop = stageTop + anchorY - element.offsetHeight * scale * 0.5
    const revealDistance = Math.max(240, viewportHeight * 0.52)
    return smoothstep((viewportHeight - objectTop) / revealDistance)
  }

  function setObject(element, x, y, opacity, scale = 1, rise = 0) {
    element.style.setProperty('--object-x', `${x}px`)
    element.style.setProperty('--object-y', `${y}px`)
    element.style.setProperty('--object-opacity', opacity.toFixed(3))
    element.style.setProperty('--object-scale', scale.toFixed(3))
    element.style.setProperty('--object-rise', `${rise}px`)
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
    setSceneVisibility(instrumentScene, sceneOpacity > 0.001)
  }

  function setWorldScene(coverProgress, processionProgress) {
    if (!worldScene) return

    const worldReveal = smoothstep(range(coverProgress, 0.90, 0.98))
    const processionReady = sceneReadiness.processionBackground ? 1 : 0
    const processionCover = smoothstep(range(processionProgress, 0.26, 0.30)) * processionReady
    const reduce = reducedMotion.matches
    const sceneScale = reduce ? 1 : 1.018 - worldReveal * 0.018
    // The world is fully opaque underneath both fades. Only the foreground
    // scene fades, avoiding the 75%-opacity dip created by two crossfades.
    const worldIsPrimed = coverProgress >= 0.88 ? 1 : 0
    const sceneOpacity = worldIsPrimed * (1 - processionCover)

    worldScene.style.setProperty('--world-scene-opacity', sceneOpacity.toFixed(3))
    worldScene.style.setProperty('--world-scene-scale', sceneScale.toFixed(4))
    worldScene.style.setProperty('--world-scene-brightness', '1')
    worldScene.style.setProperty('--world-scene-blur', '0px')
    worldScene.style.setProperty('--world-scene-radius', '0px')
    setSceneVisibility(worldScene, sceneOpacity > 0.001)
  }

  function clearWorldIntroPointer() {
    if (worldIntroPointerFrame !== null) {
      window.cancelAnimationFrame(worldIntroPointerFrame)
      worldIntroPointerFrame = null
    }
    worldIntro?.classList.remove('is-pointer-lit')
  }

  function setWorldIntro(progress, coverProgress) {
    if (!worldIntro) return

    const reduce = reducedMotion.matches
    const fadeEnd = reduce ? 0.07 : 0.16
    const fade = smootherstep(range(progress, reduce ? 0 : 0.015, fadeEnd))
    const opacity = 1 - fade
    const peopleReveal = reduce ? 1 : smootherstep(range(coverProgress, 0.915, 0.985))

    worldIntro.style.setProperty('--world-intro-opacity', opacity.toFixed(3))
    worldIntro.style.setProperty('--campfire-people-opacity', peopleReveal.toFixed(3))
    worldIntro.style.setProperty('--campfire-people-scale', (0.965 + peopleReveal * 0.035).toFixed(4))
    worldIntro.style.visibility = opacity > 0.001 ? 'visible' : 'hidden'
    worldIntroInteractive = !reduce && coverProgress >= 0.88 && opacity > 0.08
    if (!worldIntroInteractive) clearWorldIntroPointer()
  }

  function handleWorldIntroPointer(event) {
    if (!worldIntro || !worldIntroInteractive || !precisePointer.matches) return

    const rect = stage.getBoundingClientRect()
    worldIntroPointerX = clamp(event.clientX - rect.left, 0, rect.width)
    worldIntroPointerY = clamp(event.clientY - rect.top, 0, rect.height)

    if (worldIntroPointerFrame !== null) return
    worldIntroPointerFrame = window.requestAnimationFrame(() => {
      if (worldIntroInteractive && precisePointer.matches) {
        worldIntro.style.setProperty('--world-intro-light-x', `${worldIntroPointerX.toFixed(1)}px`)
        worldIntro.style.setProperty('--world-intro-light-y', `${worldIntroPointerY.toFixed(1)}px`)
        worldIntro.classList.add('is-pointer-lit')
      }
      worldIntroPointerFrame = null
    })
  }

  function setProcessionScene(progress, detectorProgress, canvasWidth) {
    if (!processionScene) return

    const sceneReady = sceneReadiness.processionBackground ? 1 : 0
    const characterReady = sceneReadiness.processionCharacter ? 1 : 0
    const nextSceneReady = sceneReadiness.detector ? 1 : 0
    const backgroundReveal = smootherstep(range(progress, 0.005, 0.30)) * sceneReady
    const detectorExit = 1 - smoothstep(range(detectorProgress, 0.04, 0.08)) * nextSceneReady
    const characterReveal = smoothstep(range(progress, 0.17, 0.25)) * sceneReady
    const travel = smootherstep(range(progress, 0.18, 0.88))
    const reduce = reducedMotion.matches
    const characterTravel = reduce ? 0 : -0.81 * canvasWidth * travel
    const sceneOpacity = backgroundReveal * detectorExit

    processionScene.style.setProperty('--procession-scene-opacity', sceneOpacity.toFixed(3))
    processionScene.style.setProperty('--procession-background-brightness', (0.72 + backgroundReveal * 0.28).toFixed(3))
    processionScene.style.setProperty('--procession-background-saturation', (0.88 + backgroundReveal * 0.12).toFixed(3))
    processionScene.style.setProperty('--procession-background-scale', (reduce ? 1 : 1.018 - backgroundReveal * 0.018).toFixed(4))
    processionScene.style.setProperty('--procession-character-travel', `${characterTravel.toFixed(2)}px`)
    processionScene.style.setProperty('--procession-character-opacity', (characterReveal * characterReady * detectorExit).toFixed(3))
    setSceneVisibility(processionScene, sceneOpacity > 0.001)
  }

  function setDetectorScene(progress, familyProgress) {
    if (!detectorScene) return

    const sceneReady = sceneReadiness.detector ? 1 : 0
    const nextSceneReady = sceneReadiness.family ? 1 : 0
    const sceneReveal = smoothstep(range(progress, 0.002, 0.045)) * sceneReady
    const familyExit = 1 - smoothstep(range(familyProgress, 0.18, 0.22)) * nextSceneReady
    const backgroundArrival = smootherstep(range(progress, 0.055, 0.155)) * sceneReady
    const walkProgress = smootherstep(range(progress, 0.145, 0.49))
    const characterArrival = smootherstep(range(progress, 0.14, 0.19)) * sceneReady
    const poseSwap = smootherstep(range(progress, 0.49, 0.56))
    const doorOpen = smootherstep(range(progress, 0.50, 0.65))
    const entryExit = smoothstep(range(progress, 0.76, 0.82))
    const blackoutIn = smootherstep(range(progress, 0.70, 0.79))
    const blackoutOut = 1 - smootherstep(range(progress, 0.82, 0.94))
    const blackout = blackoutIn * blackoutOut
    const instrumentPrepare = smootherstep(range(progress, 0.78, 0.82)) * sceneReady
    const instrumentReveal = smootherstep(range(progress, 0.82, 0.94)) * sceneReady
    const reduce = reducedMotion.matches
    const characterTravel = reduce ? 0 : -180.451 * (1 - walkProgress)
    const stepPhase = Math.sin(walkProgress * Math.PI * 10)
    const stepEnvelope = Math.sin(walkProgress * Math.PI)
    const characterBob = reduce ? 0 : -Math.abs(stepPhase) * stepEnvelope * 0.52
    const characterRoll = reduce ? 0 : stepPhase * stepEnvelope * 1.2
    const walkingOpacity = reduce
      ? 0
      : characterArrival * (1 - poseSwap) * (1 - entryExit)
    const standingOpacity = (reduce ? backgroundArrival : poseSwap) * (1 - entryExit)
    const entryScale = reduce ? 1 : 1.018 - backgroundArrival * 0.018
    const entryBrightness = reduce ? 1 : 0.58 + backgroundArrival * 0.42
    const instrumentScale = reduce ? 1 : 1.035 - instrumentReveal * 0.035
    const instrumentBrightness = reduce ? 1 : 0.62 + instrumentReveal * 0.38
    const instrumentBlur = reduce ? 0 : (1 - instrumentReveal) * 7
    const doorClipLeft = 76.74 - doorOpen * 12.97
    const sceneOpacity = sceneReveal * familyExit

    detectorScene.style.setProperty('--detector-scene-opacity', sceneOpacity.toFixed(3))
    detectorScene.style.setProperty('--detector-entry-opacity', (backgroundArrival * (1 - entryExit)).toFixed(3))
    detectorScene.style.setProperty('--detector-entry-scale', entryScale.toFixed(4))
    detectorScene.style.setProperty('--detector-entry-brightness', entryBrightness.toFixed(3))
    detectorScene.style.setProperty('--detector-door-open-opacity', doorOpen.toFixed(3))
    detectorScene.style.setProperty('--detector-door-clip-left', `${doorClipLeft.toFixed(3)}%`)
    detectorScene.style.setProperty('--detector-character-travel', `${characterTravel.toFixed(3)}%`)
    detectorScene.style.setProperty('--detector-character-bob', `${characterBob.toFixed(3)}%`)
    detectorScene.style.setProperty('--detector-character-roll', `${characterRoll.toFixed(3)}deg`)
    detectorScene.style.setProperty('--detector-walking-opacity', walkingOpacity.toFixed(3))
    detectorScene.style.setProperty('--detector-standing-opacity', standingOpacity.toFixed(3))
    detectorScene.style.setProperty('--detector-blackout-opacity', blackout.toFixed(3))
    detectorScene.style.setProperty('--detector-instrument-opacity', instrumentPrepare.toFixed(3))
    detectorScene.style.setProperty('--detector-instrument-scale', instrumentScale.toFixed(4))
    detectorScene.style.setProperty('--detector-instrument-brightness', instrumentBrightness.toFixed(3))
    detectorScene.style.setProperty('--detector-instrument-blur', `${instrumentBlur.toFixed(2)}px`)
    setSceneVisibility(detectorScene, sceneOpacity > 0.001)
  }

  function setFamilyScene(progress, careProgress) {
    if (!familyScene) return

    const sceneReady = sceneReadiness.family ? 1 : 0
    const nextSceneReady = sceneReadiness.care ? 1 : 0
    const sceneReveal = smoothstep(range(progress, 0, 0.18)) * sceneReady
    const furnishingReveal = smoothstep(range(progress, 0.18, 0.40)) * sceneReady
    const deviceReveal = smoothstep(range(progress, 0.42, 0.64)) * sceneReady
    const careExit = 1 - smoothstep(range(careProgress, 0.12, 0.18)) * nextSceneReady
    const reduce = reducedMotion.matches
    const sceneOpacity = sceneReveal * careExit

    familyScene.style.setProperty('--family-scene-opacity', sceneOpacity.toFixed(3))
    familyScene.style.setProperty('--family-background-brightness', (0.78 + sceneReveal * 0.22).toFixed(3))
    familyScene.style.setProperty('--family-background-scale', (reduce ? 1 : 1.035 - sceneReveal * 0.035).toFixed(4))
    familyScene.style.setProperty('--family-furnish-opacity', furnishingReveal.toFixed(3))
    familyScene.style.setProperty('--family-furnish-rise', `${(reduce ? 0 : (1 - furnishingReveal) * 24).toFixed(2)}px`)
    familyScene.style.setProperty('--family-furnish-scale', (reduce ? 1 : 0.96 + furnishingReveal * 0.04).toFixed(4))
    familyScene.style.setProperty('--family-device-opacity', deviceReveal.toFixed(3))
    familyScene.style.setProperty('--family-device-rise', `${(reduce ? 0 : (1 - deviceReveal) * 30).toFixed(2)}px`)
    familyScene.style.setProperty('--family-device-scale', (reduce ? 1 : 0.82 + deviceReveal * 0.18).toFixed(4))
    familyScene.style.setProperty('--family-glow-opacity', deviceReveal.toFixed(3))
    familyScene.style.setProperty('--family-glow-soft-opacity', (deviceReveal * 0.74).toFixed(3))
    setSceneVisibility(familyScene, sceneOpacity > 0.001)
    setMotionState(familyScene, 'is-ambient-live', deviceReveal * careExit, !reduce)
  }

  function setCareScene(progress, legacyProgress) {
    if (!careScene) return

    const sceneReady = sceneReadiness.care ? 1 : 0
    const nextSceneReady = sceneReadiness.legacy ? 1 : 0
    const sceneReveal = smoothstep(range(progress, 0, 0.18)) * sceneReady
    const peopleReveal = smoothstep(range(progress, 0.20, 0.44)) * sceneReady
    const deviceReveal = smoothstep(range(progress, 0.46, 0.70)) * sceneReady
    const careDarken = smoothstep(range(legacyProgress, 0, 0.16)) * nextSceneReady
    const legacyExit = 1 - smoothstep(range(legacyProgress, 0.16, 0.22)) * nextSceneReady
    const reduce = reducedMotion.matches
    const sceneOpacity = sceneReveal * legacyExit

    careScene.style.setProperty('--care-scene-opacity', sceneOpacity.toFixed(3))
    careScene.style.setProperty('--care-black-opacity', careDarken.toFixed(3))
    careScene.style.setProperty('--care-background-brightness', (0.80 + sceneReveal * 0.20).toFixed(3))
    careScene.style.setProperty('--care-background-scale', (reduce ? 1 : 1.035 - sceneReveal * 0.035).toFixed(4))
    careScene.style.setProperty('--care-background-blur', `${(reduce ? 0 : (1 - sceneReveal) * 7).toFixed(2)}px`)
    careScene.style.setProperty('--care-person-opacity', peopleReveal.toFixed(3))
    careScene.style.setProperty('--care-device-opacity', deviceReveal.toFixed(3))
    setSceneVisibility(careScene, sceneOpacity > 0.001)
    setMotionState(careScene, 'is-ambient-live', deviceReveal * (1 - careDarken), !reduce)
  }

  function setLegacyScene(progress, finaleProgress) {
    if (!legacyScene) return

    const sceneReady = sceneReadiness.legacy ? 1 : 0
    const nextSceneReady = sceneReadiness.finale ? 1 : 0
    const backgroundReveal = smoothstep(range(progress, 0.18, 0.36)) * sceneReady
    const ensembleReveal = smoothstep(range(progress, 0.38, 0.56)) * sceneReady
    const deviceReveal = smoothstep(range(progress, 0.58, 0.72)) * sceneReady
    const effectReveal = smoothstep(range(progress, 0.74, 0.90)) * sceneReady
    const legacyDarken = smoothstep(range(finaleProgress, 0, 0.16)) * nextSceneReady
    const finaleExit = 1 - smoothstep(range(finaleProgress, 0.16, 0.22)) * nextSceneReady
    const reduce = reducedMotion.matches
    const sceneOpacity = backgroundReveal * finaleExit

    legacyScene.style.setProperty('--legacy-scene-opacity', sceneOpacity.toFixed(3))
    legacyScene.style.setProperty('--legacy-black-opacity', legacyDarken.toFixed(3))
    legacyScene.style.setProperty('--legacy-background-brightness', (0.64 + backgroundReveal * 0.36).toFixed(3))
    legacyScene.style.setProperty('--legacy-background-scale', (reduce ? 1 : 1.025 - backgroundReveal * 0.025).toFixed(4))
    legacyScene.style.setProperty('--legacy-background-blur', `${(reduce ? 0 : (1 - backgroundReveal) * 6).toFixed(2)}px`)
    legacyScene.style.setProperty('--legacy-ensemble-opacity', ensembleReveal.toFixed(3))
    legacyScene.style.setProperty('--legacy-device-opacity', deviceReveal.toFixed(3))
    legacyScene.style.setProperty('--legacy-effect-opacity', effectReveal.toFixed(3))
    setSceneVisibility(legacyScene, sceneOpacity > 0.001)
    setMotionState(legacyScene, 'is-device-live', deviceReveal * finaleExit, !reduce)
    setMotionState(legacyScene, 'is-effect-live', effectReveal * finaleExit, !reduce)
  }

  function setFinaleScene(progress, storyIsPinned) {
    if (!finaleScene) return

    const sceneReady = sceneReadiness.finale ? 1 : 0
    const backgroundReveal = smoothstep(range(progress, 0.18, 0.36)) * sceneReady
    const continentReveal = smoothstep(range(progress, 0.38, 0.60)) * sceneReady
    const messageReveal = smoothstep(range(progress, 0.62, 0.82)) * sceneReady
    const reduce = reducedMotion.matches

    finaleScene.style.setProperty('--finale-scene-opacity', backgroundReveal.toFixed(3))
    finaleScene.style.setProperty('--finale-background-brightness', (0.58 + backgroundReveal * 0.42).toFixed(3))
    finaleScene.style.setProperty('--finale-background-scale', (reduce ? 1 : 1.025 - backgroundReveal * 0.025).toFixed(4))
    finaleScene.style.setProperty('--finale-continent-opacity', continentReveal.toFixed(3))
    finaleScene.style.setProperty('--finale-continent-rise', `${(reduce ? 0 : (1 - continentReveal) * 22).toFixed(2)}px`)
    finaleScene.style.setProperty('--finale-continent-scale', (reduce ? 1 : 0.97 + continentReveal * 0.03).toFixed(4))
    finaleScene.style.setProperty('--finale-message-opacity', messageReveal.toFixed(3))
    finaleScene.style.setProperty('--finale-message-rise', `${(reduce ? 0 : (1 - messageReveal) * 18).toFixed(2)}px`)
    finaleScene.style.setProperty('--finale-message-scale', (reduce ? 1 : 0.965 + messageReveal * 0.035).toFixed(4))
    finaleScene.style.setProperty('--finale-halo-opacity', (messageReveal * 0.92).toFixed(3))
    setSceneVisibility(finaleScene, backgroundReveal > 0.001)
    setMotionState(finaleScene, 'is-continent-live', continentReveal, !reduce && storyIsPinned)
  }

  function updateStory(frameTime = performance.now()) {
    const rect = story.getBoundingClientRect()
    const scrollDistance = Math.max(1, story.offsetHeight - window.innerHeight)
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const timelineHeight = timelineViewportHeight
    const scrolled = clamp(-rect.top, 0, scrollDistance)
    const storyIsPinned = rect.top <= 0 && rect.bottom >= viewportHeight
    // Keep every chapter's internal choreography, but use 30% less wheel
    // distance across the complete story.
    const coverScrollDistance = Math.min(scrollDistance, timelineHeight * 6.5 * storyPace)
    const remainingAfterCover = Math.max(1, scrollDistance - coverScrollDistance)
    const firstSceneScrollDistance = Math.min(
      remainingAfterCover,
      timelineHeight * (compactViewport.matches ? 7.2 : 8.8) * storyPace,
    )
    const remainingAfterFirst = Math.max(
      1,
      scrollDistance - coverScrollDistance - firstSceneScrollDistance,
    )
    const processionSceneScrollDistance = Math.min(remainingAfterFirst, timelineHeight * 5.2 * storyPace)
    const remainingAfterProcession = Math.max(
      1,
      remainingAfterFirst - processionSceneScrollDistance,
    )
    const detectorSceneScrollDistance = Math.min(remainingAfterProcession, timelineHeight * 6 * storyPace)
    const remainingAfterDetector = Math.max(
      1,
      remainingAfterProcession - detectorSceneScrollDistance,
    )
    const familySceneScrollDistance = Math.min(remainingAfterDetector, timelineHeight * 5.2 * storyPace)
    const remainingAfterFamily = Math.max(1, remainingAfterDetector - familySceneScrollDistance)
    const careSceneScrollDistance = Math.min(remainingAfterFamily, timelineHeight * 5.2 * storyPace)
    const remainingAfterCare = Math.max(1, remainingAfterFamily - careSceneScrollDistance)
    const legacySceneScrollDistance = Math.min(remainingAfterCare, timelineHeight * 5.2 * storyPace)
    const finaleSceneScrollDistance = Math.max(1, remainingAfterCare - legacySceneScrollDistance)
    const firstSceneStart = coverScrollDistance
    const processionSceneStart = firstSceneStart + firstSceneScrollDistance
    const detectorSceneStart = processionSceneStart + processionSceneScrollDistance
    const familySceneStart = detectorSceneStart + detectorSceneScrollDistance
    const careSceneStart = familySceneStart + familySceneScrollDistance
    const legacySceneStart = careSceneStart + careSceneScrollDistance
    const finaleSceneStart = legacySceneStart + legacySceneScrollDistance
    const coverProgress = clamp(scrolled / Math.max(1, coverScrollDistance))
    const firstSceneProgress = clamp(
      (scrolled - firstSceneStart) / Math.max(1, firstSceneScrollDistance),
    )
    const processionSceneProgress = clamp(
      (scrolled - processionSceneStart) / processionSceneScrollDistance,
    )
    const detectorSceneProgress = clamp(
      (scrolled - detectorSceneStart) / detectorSceneScrollDistance,
    )
    const familySceneProgress = clamp(
      (scrolled - familySceneStart) / familySceneScrollDistance,
    )
    const careSceneProgress = clamp(
      (scrolled - careSceneStart) / careSceneScrollDistance,
    )
    const legacySceneProgress = clamp(
      (scrolled - legacySceneStart) / legacySceneScrollDistance,
    )
    const finaleSceneProgress = clamp(
      (scrolled - finaleSceneStart) / finaleSceneScrollDistance,
    )

    if (processionSceneProgress > 0.50 || detectorSceneProgress > 0) {
      ensureScenePrepared('family', familyScene, familyImages)
    }
    if (detectorSceneProgress > 0.50 || familySceneProgress > 0) {
      ensureScenePrepared('care', careScene, careImages)
    }
    if (familySceneProgress > 0.50 || careSceneProgress > 0) {
      ensureScenePrepared('legacy', legacyScene, legacyImages)
    }
    if (careSceneProgress > 0.50 || legacySceneProgress > 0) {
      ensureScenePrepared('finale', finaleScene, finaleImages)
    }

    const stageTop = stage.getBoundingClientRect().top
    const worldWidth = world.offsetWidth
    const worldHeight = world.offsetHeight
    const processionCanvasWidth = processionCanvas ? processionCanvas.offsetWidth : viewportWidth
    const worldLeft = (viewportWidth - worldWidth) / 2
    const maximumPan = Math.max(0, worldHeight - viewportHeight)
    const worldJourneyProgress = range(firstSceneProgress, reducedMotion.matches ? 0.07 : 0.16, 1)
    const worldTop = -maximumPan * worldJourneyProgress

    world.style.setProperty('--world-y', `${worldTop}px`)
    stage.style.setProperty('--world-y', `${worldTop}px`)
    stage.style.setProperty('--story-world-width', `${worldWidth}px`)
    setWorldLights(worldJourneyProgress)
    if (worldIntro) {
      const introHeight = worldWidth * (1080 / 1935)
      worldIntro.style.setProperty('--campfire-x', `${worldLeft + worldWidth * 0.780317}px`)
      worldIntro.style.setProperty('--campfire-y', `${introHeight * 0.958}px`)
      worldIntro.style.setProperty(
        '--campfire-people-width',
        `${worldWidth * (compactViewport.matches ? 0.44 : 0.52)}px`,
      )
    }

    const anchorPosition = (name) => ({
      x: worldLeft + anchors[name][0] * worldWidth,
      y: worldTop + anchors[name][1] * worldHeight,
    })

    const elderlyAnchor = anchorPosition('elderly')
    const elderlyReveal = revealFromViewportBottom(objects.elderly, elderlyAnchor.y, 0.96, stageTop, viewportHeight)
    setObject(objects.elderly, elderlyAnchor.x, elderlyAnchor.y, elderlyReveal, 0.96 + elderlyReveal * 0.04, (1 - elderlyReveal) * 48)

    const elapsed = lastCoverFrameTime === null
      ? 16
      : clamp(frameTime - lastCoverFrameTime, 8, 32)
    lastCoverFrameTime = frameTime

    if (renderedCoverProgress === null || reducedMotion.matches || !storyIsPinned) {
      renderedCoverProgress = coverProgress
    } else {
      const inertia = 1 - Math.exp(-elapsed / 125)
      renderedCoverProgress += (coverProgress - renderedCoverProgress) * inertia
      if (Math.abs(coverProgress - renderedCoverProgress) < 0.00025) {
        renderedCoverProgress = coverProgress
      }
    }

    const coverNeedsAnotherFrame = !reducedMotion.matches
      && storyIsPinned
      && Math.abs(coverProgress - renderedCoverProgress) >= 0.00025

    setCoverScene(renderedCoverProgress)
    setWorldIntro(firstSceneProgress, renderedCoverProgress)
    setWorldScene(renderedCoverProgress, processionSceneProgress)
    setProcessionScene(processionSceneProgress, detectorSceneProgress, processionCanvasWidth)
    setDetectorScene(detectorSceneProgress, familySceneProgress)
    setFamilyScene(familySceneProgress, careSceneProgress)
    setCareScene(careSceneProgress, legacySceneProgress)
    setLegacyScene(legacySceneProgress, finaleSceneProgress)
    setFinaleScene(finaleSceneProgress, storyIsPinned)

    document.body.classList.toggle('story-cinematic-active', storyIsPinned)
    ticking = false
    if (coverNeedsAnotherFrame) requestUpdate()
  }

  function requestUpdate() {
    if (ticking) return
    ticking = true
    window.requestAnimationFrame(updateStory)
  }

  function handleResize() {
    refreshTimelineViewport()
    requestUpdate()
  }

  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', handleResize)
  window.addEventListener('pageshow', requestUpdate)
  stage.addEventListener('pointermove', handleWorldIntroPointer, { passive: true })
  stage.addEventListener('pointerleave', clearWorldIntroPointer)
  window.addEventListener('blur', clearWorldIntroPointer)
  world.addEventListener('load', requestUpdate, { once: true })
  worldLightLayers.forEach(({ element }) => element.addEventListener('load', requestUpdate, { once: true }))
  Object.values(objects).forEach((object) => object.addEventListener('load', requestUpdate, { once: true }))
  instrumentImages.forEach((image) => image.addEventListener('load', requestUpdate, { once: true }))
  processionImages.forEach((image) => image.addEventListener('load', requestUpdate, { once: true }))
  coverKeyframes.forEach((image, index) => {
    const updateFrameReadiness = () => {
      coverFrameReady[index] = image.naturalWidth > 0
      requestUpdate()
    }
    image.addEventListener('load', updateFrameReadiness, { once: true })
    image.addEventListener('error', updateFrameReadiness, { once: true })
  })
  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', requestUpdate)
  }
  if (typeof compactViewport.addEventListener === 'function') {
    compactViewport.addEventListener('change', () => {
      refreshTimelineViewport(true)
      requestUpdate()
    })
  }

  Promise.all(instrumentImages.map(decodeImage)).catch(() => requestUpdate())
  ensureScenePrepared('processionBackground', processionScene, processionBackgroundImages).catch(() => requestUpdate())
  ensureScenePrepared('processionCharacter', processionScene, processionCharacterImages).catch(() => requestUpdate())
  ensureScenePrepared('detector', detectorScene, detectorImages).catch(() => requestUpdate())
  prepareCampfirePeople()

  refreshTimelineViewport(true)
  updateStory()
}

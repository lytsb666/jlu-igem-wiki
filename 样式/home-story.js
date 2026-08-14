const story = document.querySelector('#home-story')

if (story) {
  const stage = story.querySelector('.story-stage')
  const worldScene = story.querySelector('.world-scene')
  const world = story.querySelector('.story-world')
  const instrumentScene = story.querySelector('.instrument-scene')
  const detectorScene = story.querySelector('.detector-scene')
  const familyScene = story.querySelector('.family-scene')
  const careScene = story.querySelector('.care-scene')
  const legacyScene = story.querySelector('.legacy-scene')
  const finaleScene = story.querySelector('.finale-scene')
  const compactViewport = window.matchMedia('(max-width: 720px)')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const objects = {
    crowd: story.querySelector('.story-crowd'),
    bacteria: story.querySelector('.story-bacteria'),
    lighthouse: story.querySelector('.story-lighthouse'),
    tree: story.querySelector('.story-tree'),
    graves: story.querySelector('.story-graves'),
    elderly: story.querySelector('.story-elderly'),
  }
  const instrumentImages = instrumentScene
    ? [...instrumentScene.querySelectorAll('img')]
    : []
  const coverKeyframes = instrumentScene
    ? [...instrumentScene.querySelectorAll('.cover-keyframe')]
    : []
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
    crowd: [0.750170, 0.228310],
    bacteria: [0.528533, 0.087800],
    lighthouse: [0.260017, 0.385360],
    tree: [0.739438, 0.571760],
    graves: [0.229167, 0.716220],
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

  function setWorldScene(coverProgress, detectorProgress) {
    if (!worldScene) return

    const worldReveal = smoothstep(range(coverProgress, 0.90, 0.98))
    const detectorReady = sceneReadiness.detector ? 1 : 0
    const detectorCover = smoothstep(range(detectorProgress, 0.002, 0.055)) * detectorReady
    const reduce = reducedMotion.matches
    const sceneScale = reduce ? 1 : 1.018 - worldReveal * 0.018
    // The world is fully opaque underneath both fades. Only the foreground
    // scene fades, avoiding the 75%-opacity dip created by two crossfades.
    const worldIsPrimed = coverProgress >= 0.88 ? 1 : 0
    const sceneOpacity = worldIsPrimed * (1 - detectorCover)

    worldScene.style.setProperty('--world-scene-opacity', sceneOpacity.toFixed(3))
    worldScene.style.setProperty('--world-scene-scale', sceneScale.toFixed(4))
    worldScene.style.setProperty('--world-scene-brightness', '1')
    worldScene.style.setProperty('--world-scene-blur', '0px')
    worldScene.style.setProperty('--world-scene-radius', '0px')
    setSceneVisibility(worldScene, sceneOpacity > 0.001)
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
    const detectorSceneScrollDistance = Math.min(remainingAfterFirst, timelineHeight * 6 * storyPace)
    const remainingAfterDetector = Math.max(
      1,
      scrollDistance - coverScrollDistance - firstSceneScrollDistance - detectorSceneScrollDistance,
    )
    const familySceneScrollDistance = Math.min(remainingAfterDetector, timelineHeight * 5.2 * storyPace)
    const remainingAfterFamily = Math.max(1, remainingAfterDetector - familySceneScrollDistance)
    const careSceneScrollDistance = Math.min(remainingAfterFamily, timelineHeight * 5.2 * storyPace)
    const remainingAfterCare = Math.max(1, remainingAfterFamily - careSceneScrollDistance)
    const legacySceneScrollDistance = Math.min(remainingAfterCare, timelineHeight * 5.2 * storyPace)
    const finaleSceneScrollDistance = Math.max(1, remainingAfterCare - legacySceneScrollDistance)
    const coverProgress = clamp(scrolled / Math.max(1, coverScrollDistance))
    const firstSceneProgress = clamp(
      (scrolled - coverScrollDistance) / Math.max(1, firstSceneScrollDistance),
    )
    const detectorSceneProgress = clamp(
      (scrolled - coverScrollDistance - firstSceneScrollDistance) / detectorSceneScrollDistance,
    )
    const familySceneProgress = clamp(
      (scrolled - coverScrollDistance - firstSceneScrollDistance - detectorSceneScrollDistance)
        / familySceneScrollDistance,
    )
    const careSceneProgress = clamp(
      (
        scrolled
        - coverScrollDistance
        - firstSceneScrollDistance
        - detectorSceneScrollDistance
        - familySceneScrollDistance
      ) / careSceneScrollDistance,
    )
    const legacySceneProgress = clamp(
      (
        scrolled
        - coverScrollDistance
        - firstSceneScrollDistance
        - detectorSceneScrollDistance
        - familySceneScrollDistance
        - careSceneScrollDistance
      ) / legacySceneScrollDistance,
    )
    const finaleSceneProgress = clamp(
      (
        scrolled
        - coverScrollDistance
        - firstSceneScrollDistance
        - detectorSceneScrollDistance
        - familySceneScrollDistance
        - careSceneScrollDistance
        - legacySceneScrollDistance
      ) / finaleSceneScrollDistance,
    )

    if (firstSceneProgress > 0.65 || detectorSceneProgress > 0) {
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
    const worldLeft = (viewportWidth - worldWidth) / 2
    const maximumPan = Math.max(0, worldHeight - viewportHeight)
    const worldTop = -maximumPan * firstSceneProgress

    world.style.setProperty('--world-y', `${worldTop}px`)
    stage.style.setProperty('--story-world-width', `${worldWidth}px`)

    const anchorPosition = (name) => ({
      x: worldLeft + anchors[name][0] * worldWidth,
      y: worldTop + anchors[name][1] * worldHeight,
    })

    const crowdAnchor = anchorPosition('crowd')
    const crowdReveal = revealFromViewportBottom(objects.crowd, crowdAnchor.y, 1.35, stageTop, viewportHeight)
    const crowdOpacity = crowdReveal * (1 - range(firstSceneProgress, 0.24, 0.33))
    setObject(objects.crowd, crowdAnchor.x, crowdAnchor.y, crowdOpacity, 1.35 + crowdOpacity * 0.12, (1 - crowdOpacity) * 48)

    const bacteriaAnchor = anchorPosition('bacteria')
    const bacteriaReveal = revealFromViewportBottom(objects.bacteria, bacteriaAnchor.y, 0.88, stageTop, viewportHeight)
    const bacteriaOpacity = bacteriaReveal * (1 - range(firstSceneProgress, 0.22, 0.31)) * 0.72
    const bacteriaSpread = Math.max(bacteriaReveal, range(firstSceneProgress, 0, 0.30))
    setObject(objects.bacteria, bacteriaAnchor.x, bacteriaAnchor.y, bacteriaOpacity, 0.88 + bacteriaSpread * 0.22, (1 - bacteriaSpread) * 92)
    objects.bacteria.style.setProperty('--bacteria-blur', `${12 - bacteriaSpread * 11}px`)

    const lighthouseAnchor = anchorPosition('lighthouse')
    const lighthouseEnter = range(firstSceneProgress, 0.31, 0.44)
    // The final position is bound to the long illustration, not to the
    // viewport. Once the rise finishes it behaves like part of the artwork.
    const lighthouseY = lighthouseAnchor.y + (1 - lighthouseEnter) * viewportHeight * 0.58
    setObject(objects.lighthouse, lighthouseAnchor.x, lighthouseY, lighthouseEnter, 1.0 + lighthouseEnter * 0.1)

    const treeAnchor = anchorPosition('tree')
    const treeEnter = range(firstSceneProgress, 0.56, 0.69)
    const treeY = treeAnchor.y + (1 - treeEnter) * viewportHeight * 0.54
    setObject(objects.tree, treeAnchor.x, treeY, treeEnter, 1.3 + treeEnter * 0.08)

    const gravesAnchor = anchorPosition('graves')
    const gravesReveal = revealFromViewportBottom(objects.graves, gravesAnchor.y, 0.96, stageTop, viewportHeight)
    setObject(objects.graves, gravesAnchor.x, gravesAnchor.y, gravesReveal, 0.96 + gravesReveal * 0.04, (1 - gravesReveal) * 48)

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
    setWorldScene(renderedCoverProgress, detectorSceneProgress)
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
  world.addEventListener('load', requestUpdate, { once: true })
  Object.values(objects).forEach((object) => object.addEventListener('load', requestUpdate, { once: true }))
  instrumentImages.forEach((image) => image.addEventListener('load', requestUpdate, { once: true }))
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
  ensureScenePrepared('detector', detectorScene, detectorImages).catch(() => requestUpdate())

  refreshTimelineViewport(true)
  updateStory()
}

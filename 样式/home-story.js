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
  const detectorViruses = detectorScene
    ? [...detectorScene.querySelectorAll('.detector-virus')]
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
  let timelineViewportWidth = window.innerWidth
  let timelineViewportHeight = Math.max(1, window.innerHeight)
  let timelineOrientation = window.innerWidth >= window.innerHeight ? 'landscape' : 'portrait'
  const storyPace = 0.7

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

    const frameWindows = [
      [0.065, 0.18],
      [0.16, 0.275],
      [0.255, 0.37],
      [0.35, 0.465],
      [0.445, 0.56],
      [0.54, 0.655],
      [0.635, 0.75],
      [0.73, 0.845],
    ]
    const frameReveals = frameWindows.map(([start, end]) => smoothstep(range(progress, start, end)))
    const worldReveal = smoothstep(range(progress, 0.90, 0.98))
    const sceneOpacity = 1 - worldReveal
    const reduce = reducedMotion.matches
    // Each opaque frame stays beneath the next one. Fading only the incoming
    // frame prevents a dark dip halfway through a crossfade.
    const coverOpacity = 1
    const openingShade = smoothstep(range(progress, 0.07, 0.15))
      * (1 - smoothstep(range(progress, 0.16, 0.25)))
    const exitShade = smoothstep(range(progress, 0.88, 0.96))
    const shadeOpacity = reduce ? 0 : Math.max(openingShade * 0.24, exitShade * 0.28)
    const cueExit = smoothstep(range(progress, 0.025, 0.12))

    instrumentScene.style.setProperty('--instrument-scene-opacity', sceneOpacity.toFixed(3))
    instrumentScene.style.setProperty('--cover-composite-opacity', coverOpacity.toFixed(3))
    instrumentScene.style.setProperty('--cover-composite-brightness', (1 - frameReveals[0] * 0.08).toFixed(3))
    instrumentScene.style.setProperty('--cover-composite-scale', (reduce ? 1 : 1 + frameReveals[0] * 0.03).toFixed(4))
    frameReveals.forEach((reveal, index) => {
      const nextStart = frameWindows[index + 1]?.[0] ?? 0.845
      const localPush = range(progress, frameWindows[index][0], nextStart)
      const scale = reduce ? 1 : 1.008 + localPush * (index > 4 ? 0.018 : 0.012)
      instrumentScene.style.setProperty(`--magnify-frame-${index + 1}-opacity`, reveal.toFixed(3))
      instrumentScene.style.setProperty(`--magnify-frame-${index + 1}-scale`, scale.toFixed(4))
    })
    instrumentScene.style.setProperty('--magnify-frame-brightness', (1 - exitShade * 0.12).toFixed(3))
    instrumentScene.style.setProperty('--cover-shade-opacity', shadeOpacity.toFixed(3))
    instrumentScene.style.setProperty('--cover-cue-opacity', (1 - cueExit).toFixed(3))
    instrumentScene.style.setProperty('--cover-cue-rise', `${(cueExit * 10).toFixed(2)}px`)
    setSceneVisibility(instrumentScene, sceneOpacity > 0.001)
  }

  function setWorldScene(coverProgress, detectorProgress) {
    if (!worldScene) return

    const worldReveal = smoothstep(range(coverProgress, 0.90, 0.98))
    const detectorReady = sceneReadiness.detector ? 1 : 0
    const detectorShrink = smoothstep(range(detectorProgress, 0, 0.16)) * detectorReady
    const detectorFade = smoothstep(range(detectorProgress, 0.08, 0.16)) * detectorReady
    const reduce = reducedMotion.matches
    const entryScale = 1.025 - worldReveal * 0.025
    const sceneScale = reduce ? 1 : entryScale * (1 - detectorShrink * 0.92)
    const entryBrightness = 0.28 + worldReveal * 0.72
    const exitBrightness = reduce ? 1 : 1 - detectorShrink * 0.48
    const sceneBrightness = entryBrightness * exitBrightness
    const sceneBlur = reduce ? 0 : detectorShrink * 4
    const sceneRadius = reduce ? 0 : detectorShrink * 48
    const sceneOpacity = worldReveal * (1 - detectorFade)

    worldScene.style.setProperty('--world-scene-opacity', sceneOpacity.toFixed(3))
    worldScene.style.setProperty('--world-scene-scale', sceneScale.toFixed(4))
    worldScene.style.setProperty('--world-scene-brightness', sceneBrightness.toFixed(3))
    worldScene.style.setProperty('--world-scene-blur', `${sceneBlur.toFixed(2)}px`)
    worldScene.style.setProperty('--world-scene-radius', `${sceneRadius.toFixed(2)}px`)
    setSceneVisibility(worldScene, sceneOpacity > 0.001)
  }

  function setDetectorScene(progress, familyProgress) {
    if (!detectorScene) return

    const sceneReady = sceneReadiness.detector ? 1 : 0
    const nextSceneReady = sceneReadiness.family ? 1 : 0
    const sceneReveal = smoothstep(range(progress, 0.22, 0.30)) * sceneReady
    const familyExit = 1 - smoothstep(range(familyProgress, 0.18, 0.22)) * nextSceneReady
    const backgroundArrival = smoothstep(range(progress, 0.22, 0.38)) * sceneReady
    const timerReveal = smoothstep(range(progress, 0.38, 0.50)) * sceneReady
    const virusReveal = smoothstep(range(progress, 0.50, 0.66)) * sceneReady
    const impactRise = smoothstep(range(progress, 0.23, 0.28))
    const impactFall = 1 - smoothstep(range(progress, 0.28, 0.38))
    const impact = reducedMotion.matches ? 0 : impactRise * impactFall
    const backgroundBlur = reducedMotion.matches ? 0 : (1 - backgroundArrival) * 12
    const arrivalOvershoot = Math.sin(backgroundArrival * Math.PI) * backgroundArrival * 0.11
    const backgroundScale = reducedMotion.matches
      ? 1
      : 1 + (1 - backgroundArrival) * 0.22 - arrivalOvershoot
    const timerRise = reducedMotion.matches ? 0 : (1 - timerReveal) * 18
    const timerScale = reducedMotion.matches ? 1 : 0.88 + timerReveal * 0.12
    const timerBlur = reducedMotion.matches ? 0 : (1 - timerReveal) * 7
    const sceneOpacity = sceneReveal * familyExit

    detectorScene.style.setProperty('--detector-scene-opacity', sceneOpacity.toFixed(3))
    detectorScene.style.setProperty('--detector-background-brightness', (0.62 + backgroundArrival * 0.38 + impact * 0.28).toFixed(3))
    detectorScene.style.setProperty('--detector-background-blur', `${backgroundBlur.toFixed(2)}px`)
    detectorScene.style.setProperty('--detector-background-scale', backgroundScale.toFixed(4))
    detectorScene.style.setProperty('--detector-impact-opacity', (impact * 0.9).toFixed(3))
    detectorScene.style.setProperty('--detector-impact-scale', (0.72 + backgroundArrival * 0.46).toFixed(4))
    detectorScene.style.setProperty('--detector-timer-opacity', timerReveal.toFixed(3))
    detectorScene.style.setProperty('--detector-timer-rise', `${timerRise.toFixed(2)}px`)
    detectorScene.style.setProperty('--detector-timer-scale', timerScale.toFixed(4))
    detectorScene.style.setProperty('--detector-timer-blur', `${timerBlur.toFixed(2)}px`)
    setSceneVisibility(detectorScene, sceneOpacity > 0.001)
    setMotionState(detectorScene, 'is-motion-live', sceneOpacity, !reducedMotion.matches)

    detectorViruses.forEach((virus) => {
      const rise = reducedMotion.matches ? 0 : (1 - virusReveal) * 28
      const scale = reducedMotion.matches ? 1 : 0.8 + virusReveal * 0.2
      const blur = reducedMotion.matches ? 0 : (1 - virusReveal) * 8

      virus.style.setProperty('--detector-virus-opacity', virusReveal.toFixed(3))
      virus.style.setProperty('--detector-virus-rise', `${rise.toFixed(2)}px`)
      virus.style.setProperty('--detector-virus-scale', scale.toFixed(4))
      virus.style.setProperty('--detector-virus-blur', `${blur.toFixed(2)}px`)
    })
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

  function updateStory() {
    const rect = story.getBoundingClientRect()
    const scrollDistance = Math.max(1, story.offsetHeight - window.innerHeight)
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const timelineHeight = timelineViewportHeight
    const scrolled = clamp(-rect.top, 0, scrollDistance)
    const storyIsPinned = rect.top <= 0 && rect.bottom >= viewportHeight
    // Keep every chapter's internal choreography, but use 30% less wheel
    // distance across the complete story.
    const coverScrollDistance = Math.min(scrollDistance, timelineHeight * 5.5 * storyPace)
    const remainingAfterCover = Math.max(1, scrollDistance - coverScrollDistance)
    const firstSceneScrollDistance = Math.min(
      remainingAfterCover,
      timelineHeight * (compactViewport.matches ? 7.2 : 8.8) * storyPace,
    )
    const remainingAfterFirst = Math.max(
      1,
      scrollDistance - coverScrollDistance - firstSceneScrollDistance,
    )
    const detectorSceneScrollDistance = Math.min(remainingAfterFirst, timelineHeight * 4.48 * storyPace)
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

    setCoverScene(coverProgress)
    setWorldScene(coverProgress, detectorSceneProgress)
    setDetectorScene(detectorSceneProgress, familySceneProgress)
    setFamilyScene(familySceneProgress, careSceneProgress)
    setCareScene(careSceneProgress, legacySceneProgress)
    setLegacyScene(legacySceneProgress, finaleSceneProgress)
    setFinaleScene(finaleSceneProgress, storyIsPinned)

    document.body.classList.toggle('story-cinematic-active', storyIsPinned)
    ticking = false
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
  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', requestUpdate)
  }
  if (typeof compactViewport.addEventListener === 'function') {
    compactViewport.addEventListener('change', () => {
      refreshTimelineViewport(true)
      requestUpdate()
    })
  }

  // Warm the complete opening sequence immediately; the shared loader also
  // waits for these same images to decode before it leaves.
  Promise.all(instrumentImages.map(decodeImage)).catch(() => requestUpdate())
  ensureScenePrepared('detector', detectorScene, detectorImages).catch(() => requestUpdate())

  refreshTimelineViewport(true)
  updateStory()
}

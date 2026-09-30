import './navigation.js'
import './cursor-overlay.js'

const MINIMUM_VISIBLE_TIME = 320

function pageMarkupIsReady() {
  if (document.readyState !== 'loading') return Promise.resolve()
  return new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve, { once: true }))
}

function minimumVisibleTime() {
  return new Promise((resolve) => window.setTimeout(resolve, MINIMUM_VISIBLE_TIME))
}

function pageOpeningIsReady() {
  const firstFrame = document.querySelector('.instrument-scene .cover-keyframe:first-child')
  const images = firstFrame ? [firstFrame] : []

  return Promise.all(images.map((image) => {
    const loaded = image.complete
      ? Promise.resolve()
      : new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true })
          image.addEventListener('error', resolve, { once: true })
        })

    return loaded.then(() => {
      if (!image.naturalWidth || typeof image.decode !== 'function') return undefined
      return image.decode().catch(() => undefined)
    })
  }))
}

function dismissLoader(loader) {
  if (!loader || loader.classList.contains('is-leaving')) return
  loader.classList.add('is-leaving')
  document.body.classList.remove('loading-lock')
  window.setTimeout(() => loader.remove(), 700)
}

document.body.classList.add('loading-lock')
const loader = document.querySelector('#igem-loader')
const loaderVideo = loader?.querySelector('.loading-video')

if (loaderVideo) {
  loaderVideo.play().catch(() => undefined)
}

// The supplied video is a looping visual, not a progress gate. Fade away as
// soon as the opening artwork is ready instead of waiting for a full loop.
Promise.all([
  pageMarkupIsReady(),
  minimumVisibleTime(),
  pageOpeningIsReady(),
]).then(() => dismissLoader(loader))

import './navigation.js'
import './cursor-overlay.js'

const MINIMUM_VISIBLE_TIME = 320

function pageHasLoaded() {
  if (document.readyState === 'complete') return Promise.resolve()
  return new Promise((resolve) => window.addEventListener('load', resolve, { once: true }))
}

function minimumVisibleTime() {
  return new Promise((resolve) => window.setTimeout(resolve, MINIMUM_VISIBLE_TIME))
}

function pageOpeningIsReady() {
  const images = [...document.querySelectorAll('.instrument-scene img')]

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
  pageHasLoaded(),
  minimumVisibleTime(),
  pageOpeningIsReady(),
]).then(() => dismissLoader(loader))

import './loading.css'
import './navigation.js'
import './cursor-overlay.js'

const MINIMUM_VISIBLE_TIME = 320
const LOADING_VIDEO_TIMEOUT = 5000

function createLoader() {
  const existingLoader = document.querySelector('#igem-loader')
  if (existingLoader) return existingLoader

  const loader = document.createElement('div')
  loader.id = 'igem-loader'
  loader.className = 'igem-loader'
  loader.setAttribute('role', 'status')
  loader.setAttribute('aria-live', 'polite')
  loader.setAttribute('aria-label', 'Loading page')
  loader.innerHTML = `
    <video class="loading-video" autoplay muted playsinline preload="auto">
      <source src="../b%20%20%E8%A7%86%E9%A2%91/loading.mp4" type="video/mp4">
    </video>
    <div class="loading-overlay"></div>
    <div class="loading-content">
      <p class="loading-kicker">JLU-SPH - iGEM 2026</p>
      <div class="loading-wordmark">LOADING</div>
      <div class="loading-progress" aria-hidden="true"><span></span></div>
      <p class="loading-message">Preparing the experiment...</p>
    </div>`

  document.body.prepend(loader)
  return loader
}

function pageHasLoaded() {
  if (document.readyState === 'complete') return Promise.resolve()
  return new Promise((resolve) => window.addEventListener('load', resolve, { once: true }))
}

function minimumVisibleTime() {
  return new Promise((resolve) => setTimeout(resolve, MINIMUM_VISIBLE_TIME))
}

function loadingVideoHasFinished(video) {
  if (!video || video.ended || video.error) return Promise.resolve()

  return new Promise((resolve) => {
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      window.clearTimeout(timeoutId)
      video.removeEventListener('ended', finish)
      video.removeEventListener('error', finish)
      resolve()
    }
    const timeoutId = window.setTimeout(finish, LOADING_VIDEO_TIMEOUT)

    video.addEventListener('ended', finish, { once: true })
    video.addEventListener('error', finish, { once: true })
  })
}

function pageOpeningIsReady() {
  const coverVideo = document.querySelector('.cover-scroll-video')
  if (!coverVideo || coverVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      window.clearTimeout(timeoutId)
      coverVideo.removeEventListener('loadeddata', finish)
      coverVideo.removeEventListener('error', finish)
      resolve()
    }
    const timeoutId = window.setTimeout(finish, LOADING_VIDEO_TIMEOUT)

    coverVideo.addEventListener('loadeddata', finish, { once: true })
    coverVideo.addEventListener('error', finish, { once: true })
    coverVideo.load()
  })
}

function dismissLoader(loader) {
  if (!loader || loader.classList.contains('is-leaving')) return
  loader.classList.add('is-leaving')
  document.body.classList.remove('loading-lock')
  setTimeout(() => loader.remove(), 700)
}

document.body.classList.add('loading-lock')
const loader = createLoader()
const loaderVideo = loader.querySelector('.loading-video')
if (loaderVideo) loaderVideo.play().catch(() => loaderVideo.dispatchEvent(new Event('error')))

Promise.all([
  pageHasLoaded(),
  minimumVisibleTime(),
  loadingVideoHasFinished(loaderVideo),
  pageOpeningIsReady(),
]).then(() => dismissLoader(loader))

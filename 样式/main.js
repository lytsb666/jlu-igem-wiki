import './typography.css'
import './loading.css'
import './navigation.js'
import './cursor-overlay.js'
import './site-format.js'
import './site-format.css'
import './preview-format.css'
import './preview-format.js'
import './numbered-content.css'
import './numbered-content.js'
import './article-video.css'
import './article-video.js'
import './headpages.js'
import './captions.js'
import './references.js'
import './disclosures.js'
import './footer.js'
import './back-to-top.js'
import './reading-return.js'
import './scientific-typography.js'
import './media-presentation.js'
import './deferred-media.js'

const MINIMUM_VISIBLE_TIME = 320
const MAXIMUM_OPENING_WAIT = 5500
const LOADING_POSTER_URL = new URL('../b  视频/loading-poster.webp', import.meta.url).href

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
    <img class="loading-video" src="${LOADING_POSTER_URL}" alt="" aria-hidden="true">
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

function pageMarkupIsReady() {
  if (document.readyState !== 'loading') return Promise.resolve()
  return new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve, { once: true }))
}

function minimumVisibleTime() {
  return new Promise((resolve) => setTimeout(resolve, MINIMUM_VISIBLE_TIME))
}

function pageOpeningIsReady() {
  const openingFrame = document.querySelector('#home-story .cover-keyframe-0')
  const candidates = document.querySelectorAll([
    'main img[fetchpriority="high"]',
    '.ihp-hero img',
    '.image-page-hero img',
  ].join(','))
  const images = openingFrame ? [openingFrame] : [...new Set(candidates)].slice(0, 3)

  return Promise.all(images.map((image) => {
    const loaded = image.complete
      ? Promise.resolve()
      : new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true })
          image.addEventListener('error', resolve, { once: true })
        })

    return loaded.then(() => {
      if (!image.naturalWidth || typeof image.decode !== 'function') return
      return image.decode().catch(() => undefined)
    })
  }))
}

function dismissLoader(loader) {
  if (!loader || loader.classList.contains('is-leaving')) return
  loader.classList.add('is-leaving')
  document.body.classList.remove('loading-lock')
  setTimeout(() => loader.remove(), 700)
}

document.body.classList.add('loading-lock')
const loader = createLoader()
Promise.all([
  pageMarkupIsReady(),
  minimumVisibleTime(),
  Promise.race([pageOpeningIsReady(), new Promise(resolve => setTimeout(resolve, Math.max(0, MAXIMUM_OPENING_WAIT - performance.now())))]),
]).then(() => dismissLoader(loader))

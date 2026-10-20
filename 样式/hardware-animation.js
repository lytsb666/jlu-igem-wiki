import clips from '../assets/hardware/animations-20261020/clips.js'
import './hardware-animation.css'

const players = new Set()
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
let warmup = Promise.resolve()
const warmed = new Set()

function preloadFollowing(player) {
  for (const next of players) {
    if (next.clip.id <= player.clip.id || warmed.has(next)) continue
    warmed.add(next)
    warmup = warmup.then(() => next.bytes(0, 'low')).catch(() => {})
  }
}

const time = frame => `${Math.floor(frame / 30 / 60)}:${String(Math.floor(frame / 30) % 60).padStart(2, '0')}`

class Demonstration {
  constructor(figure, clip) {
    this.figure = figure
    this.clip = clip
    this.position = 0
    this.playing = false
    this.manualPause = reducedMotion
    this.epoch = 0
    this.cache = new Map()
    this.queue = Promise.resolve()
    const poster = figure.querySelector('img')
    figure.innerHTML = `<div class="hw-animation-stage"><canvas width="1280" height="720" hidden aria-label="${clip.label}"></canvas><img class="hw-animation-native" width="1280" height="720" hidden alt="${clip.label}"></div><div class="hw-animation-controls"><button type="button" data-action="play">Play</button><button type="button" data-action="restart">Restart</button><input type="range" min="0" max="${clip.frames - 1}" value="0" step="1" aria-label="Position in ${clip.label}"><output>0:00 / ${time(clip.frames)}</output><button type="button" data-action="fullscreen" aria-label="View ${clip.label} in full screen">Full screen</button></div><p class="hw-animation-status" role="alert" hidden></p>`
    this.stage = figure.querySelector('.hw-animation-stage')
    if (poster) { poster.className = 'hw-animation-poster'; this.stage.prepend(poster) }
    this.poster = poster
    this.canvas = figure.querySelector('canvas')
    this.context = this.canvas.getContext('2d', {alpha: false})
    this.native = figure.querySelector('.hw-animation-native')
    this.slider = figure.querySelector('input')
    this.output = figure.querySelector('output')
    this.button = figure.querySelector('[data-action="play"]')
    this.status = figure.querySelector('.hw-animation-status')
    figure.querySelector('[data-action="fullscreen"]').onclick = () => this.figure.requestFullscreen?.()
    this.button.onclick = () => this.playing ? this.pause(true) : this.play()
    figure.querySelector('[data-action="restart"]').onclick = () => { this.pause(false); this.position = 0; this.play() }
    this.slider.oninput = () => this.seek(Number(this.slider.value))
    players.add(this)
    this.sync()
  }
  seek(frame) {
    this.position = frame
    this.finished = false
    this.status.textContent = ''
    this.status.hidden = true
    this.nativePart = -1
    const epoch = ++this.epoch
    if (this.playing) this.run(epoch)
    else this.enqueue(frame, epoch).then(() => {
      if (epoch === this.epoch && this.fallback) this.pause()
    }).catch(error => { if (epoch === this.epoch) this.fail(error) })
    this.sync()
  }
  sync() {
    this.button.textContent = this.playing ? 'Pause' : 'Play'
    this.slider.value = this.position
    this.output.textContent = `${time(this.position)} / ${time(this.clip.frames)}`
  }
  partAt(frame) {
    return this.clip.parts.findIndex(part => frame >= part.start && frame < part.start + part.count)
  }
  async bytes(index, priority = 'auto') {
    if (index < 0 || index >= this.clip.parts.length) return
    if (!this.cache.has(index)) {
      const pending = fetch(this.clip.parts[index].src, {priority}).then(response => {
        if (!response.ok) throw Error('The next section could not be loaded. Please try Play again.')
        return response.arrayBuffer()
      }).catch(error => { this.cache.delete(index); throw error })
      this.cache.set(index, pending)
    }
    for (const key of this.cache.keys()) if (key < index - 1 || key > index + 1) this.cache.delete(key)
    return this.cache.get(index)
  }
  enqueue(frame, epoch) {
    this.queue = this.queue.catch(() => {}).then(() => this.render(frame, epoch))
    return this.queue
  }
  async render(frame, epoch) {
    if (epoch !== this.epoch) return
    const index = this.partAt(frame)
    if (index < 0) throw Error('The demonstration section is unavailable.')
    const part = this.clip.parts[index]
    const data = await this.bytes(index)
    if (epoch !== this.epoch) return
    if (typeof ImageDecoder === 'undefined' || !await ImageDecoder.isTypeSupported(part.type)) {
      this.fallback = true
      return this.renderNative(index, data, epoch)
    }
    if (this.decoderPart !== index) {
      this.decoder?.close()
      this.decoder = new ImageDecoder({data, type: part.type, preferAnimation: true})
      await this.decoder.tracks.ready
      this.decoderPart = index
      this.lastDecoded = -1
    }
    const coded = part.map ? part.map[frame - part.start] : frame - part.start
    if (coded !== this.lastDecoded) {
      const {image} = await this.decoder.decode({frameIndex: coded, completeFramesOnly: true})
      try { if (epoch === this.epoch) { this.context.drawImage(image, 0, 0); this.lastDecoded = coded } }
      finally { image.close() }
    }
    if (epoch !== this.epoch) return
    this.figure.dataset.animationFrame = String(frame)
    this.canvas.hidden = false
    this.native.hidden = true
    if (this.poster) this.poster.hidden = true
    this.status.textContent = ''
    this.status.hidden = true
    this.bytes(index + 1)?.catch(() => {})
    preloadFollowing(this)
  }
  async renderNative(index, data, epoch) {
    if (this.nativePart === index) return
    const part = this.clip.parts[index]
    URL.revokeObjectURL(this.objectURL)
    this.objectURL = URL.createObjectURL(new Blob([data], {type: part.type}))
    const loaded = new Promise((resolve, reject) => { this.native.onload = resolve; this.native.onerror = () => reject(Error('This demonstration could not be displayed.')) })
    this.native.src = this.objectURL
    await loaded
    if (epoch !== this.epoch) return
    this.nativePart = index
    this.figure.dataset.animationFrame = String(part.start)
    this.native.hidden = false
    this.canvas.hidden = true
    if (this.poster) this.poster.hidden = true
    this.position = part.start
    this.status.textContent = ''
    this.status.hidden = true
    this.bytes(index + 1)?.catch(() => {})
    preloadFollowing(this)
  }
  pause(manual = false) {
    this.playing = false
    this.status.textContent = ''
    this.status.hidden = true
    this.epoch++
    if (manual) this.manualPause = true
    if (this.fallback) {
      if (this.native.naturalWidth && !this.native.hidden) {
        this.context.drawImage(this.native, 0, 0)
        this.canvas.hidden = false
        if (this.poster) this.poster.hidden = true
      }
      this.native.hidden = true
      this.nativePart = -1
    }
    this.sync()
  }
  async play() {
    if (this.playing) return
    for (const player of players) if (player !== this) player.pause()
    this.manualPause = false
    this.finished = false
    if (this.position >= this.clip.frames - 1) this.position = 0
    this.playing = true
    const epoch = ++this.epoch
    this.sync()
    await this.run(epoch)
  }
  async run(epoch) {
    let deadline = performance.now()
    try {
      while (this.playing && epoch === this.epoch && this.position < this.clip.frames) {
        const before = performance.now()
        await this.enqueue(this.position, epoch)
        if (epoch !== this.epoch) break
        if (performance.now() - before > 100) deadline = performance.now()
        this.sync()
        const part = this.clip.parts[this.partAt(this.position)]
        const advance = this.fallback ? part.start + part.count - this.position : 1
        deadline += advance / 30 * 1000
        await new Promise(resolve => setTimeout(resolve, Math.max(0, deadline - performance.now())))
        if (epoch !== this.epoch) break
        this.position += advance
      }
      if (epoch === this.epoch) {
        this.position = Math.min(this.position, this.clip.frames - 1)
        this.finished = true
        this.pause()
      }
    } catch (error) { if (epoch === this.epoch) this.fail(error) }
  }
  fail(error) {
    this.pause()
    this.status.textContent = error.message || 'Please try Play again.'
    this.status.hidden = false
  }
}

for (const figure of document.querySelectorAll('[data-hardware-animation]')) {
  const clip = clips.find(clip => String(clip.id) === figure.dataset.hardwareAnimation)
  if (clip) new Demonstration(figure, clip)
}
const nearby = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const player = [...players].find(player => player.figure === entry.target)
    if (entry.isIntersecting && player) player.bytes(player.partAt(player.position), 'low').catch(() => {})
  }
}, {rootMargin: '450px 0px', threshold: 0})
const visible = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const player = [...players].find(player => player.figure === entry.target)
    if (!player) continue
    player.visible = entry.isIntersecting && entry.intersectionRatio >= .4
    if (!player.visible) player.pause()
    else if (!reducedMotion && !document.hidden && !player.manualPause && !player.finished) player.play()
  }
}, {threshold: [0, .4]})
players.forEach(player => { nearby.observe(player.figure); visible.observe(player.figure) })

document.addEventListener('visibilitychange', () => {
  for (const player of players) {
    if (document.hidden) player.pause()
    else if (!reducedMotion && player.visible && !player.manualPause && !player.finished) player.play()
  }
})

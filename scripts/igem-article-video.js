// Official PeerTube embed API: https://docs.joinpeertube.org/api/embed-player
// This small transport implements only the messages used by the article player.
// The homepage promotion retains its independent, click-to-play player.
(() => {
  for (const frame of document.querySelectorAll('iframe[data-wiki-article-video]')) {
    const embed = new URL(frame.dataset.igemEmbedSrc)
    if (embed.origin !== 'https://video.igem.org') continue
    const panel = document.createElement('div')
    panel.style.cssText = `width:min(100%,380px);aspect-ratio:${frame.width}/${frame.height};max-height:38rem;margin:auto;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;padding:1rem;box-sizing:border-box;background:#fffaf5;border:1px solid #d9c4b4;border-radius:12px;text-align:center;color:#6f4e37`
    const message = document.createElement('p')
    message.setAttribute('role', 'status')
    message.textContent = frame.hasAttribute('data-igem-review-pending')
      ? 'This video is awaiting approval on iGEM Video Universe.'
      : 'The video will load when you reach this section.'
    const retry = document.createElement('button')
    retry.type = 'button'
    retry.textContent = 'Check video availability'
    retry.style.cssText = 'font:inherit;color:#fffaf5;background:#6f4e37;border:0;border-radius:8px;padding:10px 14px;cursor:pointer'
    panel.append(message, retry)
    frame.before(panel)
    frame.style.display = 'none'
    const play = retry.cloneNode(true)
    play.textContent = 'Play with sound'
    play.hidden = true
    frame.after(play)
    let checking = false, checked = false, mounted = false, channel = false, ready = false
    let playing = false, userPaused = false, pauseCommand = false, starting = false, blocked = false
    let nextId = 1000000
    const calls = new Map()
    const visible = () => {
      const box = frame.getBoundingClientRect()
      return mounted && !document.hidden && !document.body.classList.contains('loading-lock') &&
        box.width > 0 && box.right > 0 && box.left < innerWidth &&
        Math.min(box.bottom, innerHeight) - Math.max(box.top, 68) >= Math.min(box.height, innerHeight - 68) * .35
    }
    const send = packet => frame.contentWindow.postMessage(JSON.stringify(packet), embed.origin)
    function call(method, params) {
      return new Promise((resolve, reject) => {
        const id = ++nextId
        const timer = setTimeout(() => { calls.delete(id); reject(Error('Player response timed out')) }, 8000)
        calls.set(id, {resolve, reject, timer})
        send({id, method: `peertube::${method}`, params})
      })
    }
    async function pause() {
      if (!ready || (!playing && !starting)) return
      pauseCommand = true
      playing = false
      play.hidden = true
      try { await call('pause') } catch { /* Native controls remain available. */ }
    }
    async function start() {
      if (!ready || !visible() || playing || starting || userPaused || blocked) return
      starting = true
      try {
        await call('play')
        playing = true
        blocked = false
        play.hidden = true
        if (!visible()) await pause()
      } catch {
        blocked = true
        play.hidden = !visible()
      } finally { starting = false }
    }
    function playback(state) {
      if (state === 'playing') {
        playing = true
        userPaused = false
        blocked = false
        play.hidden = true
        if (!visible()) pause()
      } else if (state === 'paused' || state === 'ended') {
        if (pauseCommand) pauseCommand = false
        else if (playing && visible()) userPaused = true
        playing = false
      }
    }
    async function playerReady() {
      if (ready) return
      ready = true
      try { await call('setVolume', 1) } catch { /* Keep the player's sound controls. */ }
      refresh()
    }
    function connected() {
      if (channel) return
      channel = true
      call('isReady').then(value => { if (value) playerReady() }).catch(() => { play.hidden = false })
    }
    window.addEventListener('message', event => {
      if (!mounted || event.origin !== embed.origin || event.source !== frame.contentWindow) return
      let packet
      try { packet = typeof event.data === 'string' ? JSON.parse(event.data) : event.data } catch { return }
      if (!packet || typeof packet !== 'object') return
      if (packet.method === 'peertube::__ready') {
        if (!channel) {
          if (packet.params?.type === 'publish-request') send({method: 'peertube::__ready', params: {type: 'publish-reply', publish: []}})
          else if (packet.params === 'ping') send({method: 'peertube::__ready', params: 'pong'})
          connected()
        }
        return
      }
      const pending = calls.get(packet.id)
      if (!packet.method && pending) {
        clearTimeout(pending.timer)
        calls.delete(packet.id)
        if (packet.error) pending.reject(Error(String(packet.error)))
        else pending.resolve(packet.result)
        return
      }
      const method = packet.method?.replace(/^peertube::/, '')
      if (!packet.method?.startsWith('peertube::')) return
      if (method === 'ready') playerReady()
      else if (method === 'play') playback('playing')
      else if (method === 'pause') playback('paused')
      else if (method === 'playbackStatusUpdate' || method === 'playbackStatusChange') playback(packet.params?.playbackState || packet.params)
      else return
      if (packet.id != null) send({id: packet.id, result: null})
    })
    frame.addEventListener('load', () => {
      if (mounted && !channel) send({method: 'peertube::__ready', params: {type: 'publish-request', publish: []}})
    })
    async function availability() {
      if (checking || mounted) return
      checked = true
      checking = true
      retry.disabled = true
      try {
        const response = await fetch(`${embed.origin}/api/v1/videos/${encodeURIComponent(frame.dataset.igemVideoId)}`, {credentials: 'omit', signal: AbortSignal.timeout(10000)})
        if (!response.ok) return
        const info = await response.json()
        if (info.blacklisted || info.privacy?.id !== 1 || info.state?.id !== 1) return
        mounted = true
        panel.hidden = true
        panel.style.display = 'none'
        frame.style.display = 'block'
        frame.src = embed.href
      } catch { /* A retry remains available; no broken iframe replaces the status. */ }
      finally { checking = false; retry.disabled = false }
    }
    function refresh() {
      if (visible()) { play.hidden = !blocked; start() }
      else { play.hidden = true; pause() }
    }
    retry.addEventListener('click', availability)
    play.addEventListener('click', () => { blocked = false; userPaused = false; start() })
    const near = new IntersectionObserver(entries => {
      if (!checked && entries.some(entry => entry.isIntersecting)) availability()
    }, {rootMargin: '800px'})
    near.observe(panel)
    const observer = new IntersectionObserver(refresh, {threshold: [0, .15, .35, .5, 1]})
    observer.observe(frame)
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('resize', refresh, {passive: true})
    window.addEventListener('scroll', refresh, {passive: true})
    new MutationObserver(refresh).observe(document.body, {attributes: true, attributeFilter: ['class']})
    for (const event of ['pointerdown', 'keydown']) document.addEventListener(event, action => {
      if (action.isTrusted && !action.repeat && blocked && !action.target.closest('button,iframe')) {
        blocked = false
        start()
      }
    })
  }
})()

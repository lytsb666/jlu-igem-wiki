import defaultCursor from '../a  图片/cursors/正常选择.png'
import linkCursor from '../a  图片/cursors/链接选择.png'
import textCursor from '../a  图片/cursors/文本选择.png'
import busyCursor from '../a  图片/cursors/忙.png'
import moveCursor from '../a  图片/cursors/移动.png'
import disabledCursor from '../a  图片/cursors/不可用.png'
import nwseCursor from '../a  图片/cursors/对角线调整.png'
import neswCursor from '../a  图片/cursors/对角线调整2.png'

const cursors = {
  default: { src: defaultCursor, hotspotX: 58, hotspotY: 44 },
  link: { src: linkCursor, hotspotX: 52, hotspotY: 33 },
  text: { src: textCursor, hotspotX: 42, hotspotY: 42 },
  busy: { src: busyCursor, hotspotX: 32, hotspotY: 32 },
  move: { src: moveCursor, hotspotX: 32, hotspotY: 32 },
  disabled: { src: disabledCursor, hotspotX: 32, hotspotY: 32 },
  nwse: { src: nwseCursor, hotspotX: 32, hotspotY: 32 },
  nesw: { src: neswCursor, hotspotX: 32, hotspotY: 32 },
}

const interactiveSelector = [
  'a',
  'button',
  'summary',
  'select',
  '[role="button"]',
  '[role="link"]',
  '[type="button"]',
  '[type="submit"]',
  '[type="reset"]',
  '[type="checkbox"]',
  '[type="radio"]',
  '.scroll-hint',
  '.survey-option',
  '.cursor-pointer',
].join(',')

const textSelector = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'dt',
  'dd',
  'label',
  'td',
  'th',
  'blockquote',
  'figcaption',
  'textarea',
  '[contenteditable="true"]',
  '.cursor-text',
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"])',
].join(',')

/* 触控笔记本可能把主指针报告为 coarse，因此按实际 pointerType 判断。 */
{
  Object.values(cursors).forEach(({ src }) => {
    const preload = new Image()
    preload.src = src
  })

  const cursorElement = document.createElement('img')
  cursorElement.id = 'igem-custom-cursor'
  cursorElement.alt = ''
  cursorElement.draggable = false
  cursorElement.setAttribute('aria-hidden', 'true')
  cursorElement.src = defaultCursor
  document.documentElement.append(cursorElement)

  let cursorName = 'default'
  let pointerX = 0
  let pointerY = 0
  let frameId = 0
  let nativePointerSurface = false

  function syncNativeSurface() {
    const nativeSurface = nativePointerSurface || Boolean(document.fullscreenElement) ||
      Boolean(document.querySelector('dialog[open], [popover]:popover-open'))
    document.documentElement.classList.toggle('surface-cursor-native', nativeSurface)
    if (nativeSurface) cursorElement.classList.remove('is-visible')
    else if (document.documentElement.classList.contains('custom-cursor-active')) {
      cursorElement.classList.add('is-visible')
      scheduleRender()
    }
    return nativeSurface
  }

  // Track top-layer state once rather than using a document-wide CSS :has()
  // selector during the many layout updates on long scientific pages.
  new MutationObserver(records => {
    if (records.some(record => record.target.tagName === 'DIALOG')) syncNativeSurface()
  }).observe(document.documentElement, {attributes: true, attributeFilter: ['open'], subtree: true})
  document.addEventListener('toggle', event => {
    if (event.target.matches?.('dialog, [popover]')) syncNativeSurface()
  }, true)
  document.addEventListener('fullscreenchange', syncNativeSurface)
  document.addEventListener('pointerover', event => {
    if (event.target instanceof Element && event.target.closest('iframe, object, embed')) {
      nativePointerSurface = true
      syncNativeSurface()
    }
  }, {capture: true, passive: true})
  syncNativeSurface()

  function findCursorName(target) {
    if (document.body.classList.contains('loading-lock')) return 'busy'
    if (!(target instanceof Element)) return 'default'

    if (target.closest(':disabled, [disabled], [aria-disabled="true"], .cursor-not-allowed')) return 'disabled'
    if (target.closest('.cursor-nwse-resize, [style*="cursor: nwse-resize"], [style*="cursor:nwse-resize"]')) return 'nwse'
    if (target.closest('.cursor-nesw-resize, [style*="cursor: nesw-resize"], [style*="cursor:nesw-resize"]')) return 'nesw'
    if (target.closest('[draggable="true"], .cursor-move')) return 'move'
    if (target.closest(interactiveSelector)) return 'link'
    if (target.closest(textSelector)) return 'text'
    return 'default'
  }

  function renderCursor() {
    frameId = 0
    const cursor = cursors[cursorName]
    cursorElement.style.transform = `translate3d(${pointerX - cursor.hotspotX}px, ${pointerY - cursor.hotspotY}px, 0)`
  }

  function scheduleRender() {
    if (!frameId) frameId = window.requestAnimationFrame(renderCursor)
  }

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return

    pointerX = event.clientX
    pointerY = event.clientY

    nativePointerSurface = event.target instanceof Element && Boolean(event.target.closest('iframe, object, embed'))
    const nativeSurface = syncNativeSurface()
    const navigationUsesNativeCursor = event.target instanceof Element && Boolean(event.target.closest('.navbar, .wiki-back-to-top'))
    document.documentElement.classList.toggle('navigation-cursor-native', navigationUsesNativeCursor)

    if (navigationUsesNativeCursor || nativeSurface) {
      cursorElement.classList.remove('is-visible')
      return
    }

    const nextCursorName = findCursorName(event.target)
    if (nextCursorName !== cursorName) {
      cursorName = nextCursorName
      cursorElement.src = cursors[cursorName].src
    }

    if (cursorElement.complete && !cursorElement.naturalWidth) {
      document.documentElement.classList.remove('custom-cursor-active')
      cursorElement.classList.remove('is-visible')
      return
    }
    document.documentElement.classList.add('custom-cursor-active')
    cursorElement.classList.add('is-visible')
    scheduleRender()
  }, { capture: true, passive: true })

  document.addEventListener('pointerleave', () => {
    nativePointerSurface = false
    document.documentElement.classList.remove('custom-cursor-active', 'navigation-cursor-native', 'surface-cursor-native')
    cursorElement.classList.remove('is-visible')
  })

  window.addEventListener('blur', () => {
    nativePointerSurface = false
    document.documentElement.classList.remove('custom-cursor-active', 'navigation-cursor-native', 'surface-cursor-native')
    cursorElement.classList.remove('is-visible')
  })

  cursorElement.addEventListener('error', () => {
    document.documentElement.classList.remove('custom-cursor-active')
    cursorElement.classList.remove('is-visible')
  })
}

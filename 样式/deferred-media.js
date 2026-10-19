// Reserve image geometry in HTML, then request original media near its place.
const selector = 'img[data-media-src]'
function reveal(image) {
  if (!image.dataset.mediaSrc) return
  image.loading = 'eager'
  image.src = image.dataset.mediaSrc
  delete image.dataset.mediaSrc
}
const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    reveal(entry.target)
    observer.unobserve(entry.target)
  }
}, {rootMargin: '450px 0px'}) : null
function watch(root) {
  const images = [...(root.matches?.(selector) ? [root] : []), ...root.querySelectorAll(selector)]
  images.forEach(image => observer ? observer.observe(image) : reveal(image))
}
watch(document)
new MutationObserver(records => {
  for (const record of records) for (const node of record.addedNodes) if (node.nodeType === 1) watch(node)
}).observe(document.body, {subtree: true, childList: true})

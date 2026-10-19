import { createCarousel } from './carousel.js';

// Match the natural height of neighboring Open resources headers without
// shortening titles or changing any PDF's expanded state.
const resources = document.querySelector('#resources');
if (resources) {
  const lists = [...resources.querySelectorAll('.resource-download-group > ul, .gene-wars-guides > ul')];
  let headerFrame = 0;
  const alignResourceHeaders = () => {
    headerFrame = 0;
    const cards = lists.flatMap(list => [...list.children].map(card => ({
      list, card, summary: card.querySelector('.wiki-pdf-fold > summary'),
    })).filter(item => item.summary));
    cards.forEach(({summary}) => summary.style.removeProperty('--edu-resource-header-height'));
    const rows = new Map();
    for (const {list, card, summary} of cards) {
      if (!rows.has(list)) rows.set(list, new Map());
      const top = Math.round(card.getBoundingClientRect().top);
      const listRows = rows.get(list);
      if (!listRows.has(top)) listRows.set(top, []);
      listRows.get(top).push({summary, height: summary.getBoundingClientRect().height});
    }
    for (const listRows of rows.values()) for (const row of listRows.values()) {
      if (row.length < 2) continue;
      const height = Math.ceil(Math.max(...row.map(item => item.height)));
      row.forEach(({summary}) => summary.style.setProperty('--edu-resource-header-height', `${height}px`));
    }
  };
  const scheduleResourceHeaders = () => {
    if (!headerFrame) headerFrame = requestAnimationFrame(alignResourceHeaders);
  };
  const widths = new WeakMap();
  const resourceResize = new ResizeObserver(entries => {
    for (const entry of entries) {
      const width = Math.round(entry.contentRect.width * 100) / 100;
      if (widths.get(entry.target) === width) continue;
      widths.set(entry.target, width);
      scheduleResourceHeaders();
    }
  });
  lists.forEach(list => resourceResize.observe(list));
  new MutationObserver(scheduleResourceHeaders).observe(resources, {childList: true, subtree: true, characterData: true});
  document.fonts.ready.then(scheduleResourceHeaders);
  scheduleResourceHeaders();
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems = [...document.querySelectorAll('.reveal:not(.is-visible)')];
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const tocLinks = [...document.querySelectorAll('.edu-toc a[href^="#"]')];
const sections = [...document.querySelectorAll('[data-section]')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    tocLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -58% 0px', threshold: [0, 0.15, 0.4] });
  sections.forEach((section) => sectionObserver.observe(section));
}

const progressBar = document.querySelector('.edu-toc__progress i');
let progressTicking = false;
function updateProgress() {
  const main = document.querySelector('main');
  if (!main || !progressBar) return;
  const maxScroll = Math.max(1, main.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  progressBar.style.transform = `scaleY(${progress})`;
  progressTicking = false;
}
window.addEventListener('scroll', () => {
  if (progressTicking) return;
  progressTicking = true;
  requestAnimationFrame(updateProgress);
}, { passive: true });
updateProgress();

const dbtlTabs = [...document.querySelectorAll('[data-dbtl]')];
const dbtlPanels = [...document.querySelectorAll('[data-dbtl-panel]')];
const dbtlWheel = document.querySelector('.dbtl-wheel');

function activateDbtl(tab, moveFocus = false) {
  if (!tab) return;
  const stage = tab.dataset.dbtl;
  dbtlTabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-selected', String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });
  dbtlPanels.forEach((panel) => {
    const isActive = panel.dataset.dbtlPanel === stage;
    panel.hidden = !isActive;
    panel.classList.toggle('is-active', isActive);
  });
  if (dbtlWheel) dbtlWheel.dataset.active = stage;
  if (moveFocus) tab.focus();
}

dbtlTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateDbtl(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % dbtlTabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + dbtlTabs.length) % dbtlTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = dbtlTabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    activateDbtl(dbtlTabs[nextIndex], true);
  });
});
activateDbtl(dbtlTabs.find((tab) => tab.classList.contains('is-active')) || dbtlTabs[0]);

document.querySelectorAll('.tree-branch__leaves a').forEach((link) => {
  const target = document.querySelector(link.getAttribute('href'));
  const title = target?.querySelector('h3')?.textContent?.trim();
  const location = target?.querySelector('.activity-card__location')?.textContent?.trim();
  const community = link.closest('.tree-branch')?.querySelector('h4')?.textContent?.trim();
  const code = link.querySelector('span')?.textContent?.trim();
  if (!title || !location || !community || !code) return;
  const description = `${code}: ${title}. ${community}. ${location}. Jump to activity.`;
  link.setAttribute('aria-label', description);
  link.title = description;
});

document.querySelectorAll('.activity-card').forEach((card) => {
  const media = card.querySelector('.activity-media');
  const code = card.id.replace('activity-', '').toUpperCase();
  if (media) media.dataset.photoCode = code;
});

// The three opening filmstrips retain their original continuous photo bands.
// Activity-card photos stay visible in a static vertical stack. Their original
// lightbox links and the separate feedback slideshow remain available.
document.querySelectorAll('.activity-card .activity-photo img').forEach(image => {
  const width = Number(image.getAttribute('width'));
  const height = Number(image.getAttribute('height'));
  if (width > 0 && height > 0) image.style.aspectRatio = `${width} / ${height}`;
});
const feedbackViewport = document.querySelector('.feedback-viewport');
if (feedbackViewport) {
  document.querySelector('.feedback-controls')?.remove();
  const host = document.createElement('div');
  feedbackViewport.before(host);
  host.append(feedbackViewport);
  createCarousel(host, { track: feedbackViewport, initial: 2 });
}

const lightbox = document.querySelector('.edu-lightbox');
const lightboxImages = lightbox?.querySelector('.edu-lightbox__image');
const lightboxClose = lightbox?.querySelector('.edu-lightbox__close');
const lightboxCaption = lightbox?.querySelector('#lightbox-caption');
const photoTriggers = [...document.querySelectorAll('[data-lightbox]')];
let photoCarousel = null;
lightbox?.querySelector('.edu-lightbox__controls')?.remove();
photoTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    if (!lightbox || !lightboxImages || !trigger.querySelector('img')) return;
    photoCarousel?.destroy();
    const group = trigger.dataset.photoGroup;
    const photos = group ? photoTriggers.filter(photo => photo.dataset.photoGroup === group) : [trigger];
    const track = document.createElement('div');
    track.className = 'edu-lightbox-photo-track';
    const captions = photos.map(photo => photo.querySelector('img').alt);
    photos.forEach(photo => {
      const figure = document.createElement('figure');
      const original = photo.querySelector('img');
      const image = original.cloneNode();
      image.src = original.dataset.mediaSrc || original.currentSrc || original.src;
      delete image.dataset.mediaSrc;
      image.loading = 'eager';
      figure.append(image);
      track.append(figure);
    });
    lightboxImages.replaceChildren(track);
    const initial = photos.indexOf(trigger);
    if (lightboxCaption) lightboxCaption.textContent = captions[initial];
    photoCarousel = createCarousel(lightboxImages, {
      track, initial,
      onChange: index => { if (lightboxCaption) lightboxCaption.textContent = captions[index]; },
    });
    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
      lightboxClose?.focus();
    }
  });
});
lightbox?.addEventListener('close', () => { photoCarousel?.destroy(); photoCarousel = null; });
lightboxClose?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

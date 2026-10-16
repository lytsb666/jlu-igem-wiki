import { createCarousel } from './carousel.js';

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

// Replace continuous film strips and the feedback scroller with the same slideshow.
document.querySelectorAll('.filmstrip__window').forEach(root => {
  const track = root.querySelector('.filmstrip__track');
  const originals = [...track.querySelector('.filmstrip__group').children];
  track.replaceChildren(...originals);
  root.removeAttribute('tabindex');
  createCarousel(root, { track });
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
      image.src = original.currentSrc || original.src;
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

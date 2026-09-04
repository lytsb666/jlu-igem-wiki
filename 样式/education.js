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
  const body = card.querySelector('.activity-card__body');
  const media = card.querySelector('.activity-media');
  const image = media?.querySelector('img');
  const code = card.id.replace('activity-', '').toUpperCase();

  if (media) media.dataset.photoCode = code;
  if (media && image) {
    media.dataset.photoSrc = 'true';
    media.style.setProperty('--activity-photo', `url("${image.src}")`);
  }
  if (!body || body.querySelector('.activity-card__stories')) return;

  const location = body.querySelector('.activity-card__location');
  const paragraphs = [...body.children].filter((child) => child.matches('p:not(.activity-card__location)'));
  if (!location || paragraphs.length === 0) return;

  const stories = document.createElement('div');
  stories.className = 'activity-card__stories';
  location.after(stories);

  const addStory = (labels, copy) => {
    if (copy.length === 0) return;
    const story = document.createElement('section');
    story.className = 'activity-story';
    const labelRow = document.createElement('div');
    labelRow.className = 'activity-story__labels';
    labels.forEach((label) => {
      const span = document.createElement('span');
      span.textContent = label;
      labelRow.append(span);
    });
    story.append(labelRow, ...copy);
    stories.append(story);
  };

  addStory(['Design', 'Build & Test'], paragraphs.slice(0, 1));
  addStory(['Feedback & Learn'], paragraphs.slice(1));

  const toolkit = document.createElement('div');
  toolkit.className = 'activity-toolkit';
  const toolkitLabel = document.createElement('span');
  toolkitLabel.textContent = 'Open toolkit';
  const toolkitStatus = document.createElement(card.id === 'activity-b14' ? 'strong' : 'a');
  if (toolkitStatus instanceof HTMLAnchorElement) {
    toolkitStatus.href = '#resources';
    toolkitStatus.textContent = 'View reusable format →';
  } else {
    toolkitStatus.textContent = 'In development · not yet released';
  }
  toolkit.append(toolkitLabel, toolkitStatus);
  body.append(toolkit);
});

const feedbackViewport = document.querySelector('.feedback-viewport');
const feedbackCards = [...document.querySelectorAll('.feedback-card')];
const feedbackCurrent = document.querySelector('[data-feedback-current]');
let feedbackIndex = Math.max(0, feedbackCards.findIndex((card) => card.classList.contains('is-current')));

function updateFeedback(index, shouldScroll = true) {
  if (!feedbackViewport || feedbackCards.length === 0) return;
  feedbackIndex = (index + feedbackCards.length) % feedbackCards.length;
  feedbackCards.forEach((card, cardIndex) => card.classList.toggle('is-current', cardIndex === feedbackIndex));
  if (feedbackCurrent) feedbackCurrent.textContent = String(feedbackIndex + 1);
  if (shouldScroll) {
    const card = feedbackCards[feedbackIndex];
    const left = card.offsetLeft - (feedbackViewport.clientWidth - card.offsetWidth) / 2;
    feedbackViewport.scrollTo({ left, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }
}

document.querySelector('[data-feedback-prev]')?.addEventListener('click', () => updateFeedback(feedbackIndex - 1));
document.querySelector('[data-feedback-next]')?.addEventListener('click', () => updateFeedback(feedbackIndex + 1));

let feedbackTicking = false;
feedbackViewport?.addEventListener('scroll', () => {
  if (feedbackTicking) return;
  feedbackTicking = true;
  requestAnimationFrame(() => {
    const centre = feedbackViewport.scrollLeft + feedbackViewport.clientWidth / 2;
    let closest = feedbackIndex;
    let distance = Number.POSITIVE_INFINITY;
    feedbackCards.forEach((card, index) => {
      const cardCentre = card.offsetLeft + card.offsetWidth / 2;
      const nextDistance = Math.abs(cardCentre - centre);
      if (nextDistance < distance) {
        distance = nextDistance;
        closest = index;
      }
    });
    if (closest !== feedbackIndex) updateFeedback(closest, false);
    feedbackTicking = false;
  });
}, { passive: true });

requestAnimationFrame(() => updateFeedback(feedbackIndex));

const lightbox = document.querySelector('.edu-lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('button');
document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const image = trigger.querySelector('img');
    if (!image || !lightbox || !lightboxImage) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
  });
});
lightboxClose?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

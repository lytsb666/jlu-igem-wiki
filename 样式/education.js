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

const filterButtons = [...document.querySelectorAll('.activity-filter [data-filter]')];
const jumpLinks = [...document.querySelectorAll('.activity-jump-grid [data-community]')];
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    jumpLinks.forEach((link) => {
      link.hidden = filter !== 'all' && link.dataset.community !== filter;
    });
  });
});

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

import { navigationSchema } from './navigation.js'
import './footer.css'
import universitySeal from '../assets/site-footer/revision-20261016-followup/jilin-university-seal.jpg'

const footer = document.querySelector('.site-footer .footer-content')
const media = import.meta.glob('../assets/site-footer/revision-20261016/*.png', {
  eager: true, query: '?url', import: 'default',
})
const source = n => media[`../assets/site-footer/revision-20261016/image${n}.png`]
const sponsorMedia = import.meta.glob('../assets/site-footer/restored-20261016/*.svg', {
  eager: true, query: '?url', import: 'default',
})
const sponsorSource = name => sponsorMedia[`../assets/site-footer/restored-20261016/${name}.svg`]
if (footer) {
  const map = document.createElement('nav')
  map.className = 'footer-sitemap'
  map.setAttribute('aria-label', 'Explore the wiki')
  const groups = [{label: 'Home', items: [['Homepage', '../homepage/index.html']]}, ...navigationSchema.filter(({label}) => label !== 'Team')]
  map.innerHTML = groups.map(({label, items, href}) => `<div class="footer-sitemap-row"><h2>${label}</h2><div role="group" aria-label="${label} pages">${(items || [['Member', href]]).map(([name,url]) => `<a href="${url}">${name}</a>`).join('')}</div></div>`).join('')
  const mapTitle = document.createElement('span')
  mapTitle.className = 'footer-map-title'
  mapTitle.textContent = 'Explore the wiki'
  map.prepend(mapTitle)
  footer.prepend(map)
  footer.parentElement.id ||= 'site-footer'
  const brand = footer.querySelector('.school-info')
  if (brand) {
    const seal = document.createElement('img')
    seal.className = 'school-logo'
    seal.src = universitySeal
    seal.alt = 'Jilin University emblem'
    seal.width = 76
    seal.height = 76
    brand.querySelector('.school-logo')?.replaceWith(seal)
    brand.querySelectorAll('h3').forEach(heading => {
      if (/^jilin\s+university$/i.test(heading.textContent.trim())) heading.remove()
    })
    const wordmark = document.createElement('span')
    wordmark.className = 'footer-wordmark'
    wordmark.textContent = 'ByeGerm'
    brand.prepend(wordmark)
  }
  const social = footer.querySelector('.qr-container')
  const qrItems = [
    [1, 'WeChat Official Account', 368, 368, '0 0 368 368'],
    [3, 'Xiaohongshu', 339, 339, '0 0 339 339'],
    [4, 'Bilibili', 353, 353, '0 0 353 353'],
    [5, 'Instagram', 385, 307, '79 43 223 187'],
  ]
  if (social) social.innerHTML = qrItems.map(([id,label,width,height,crop],i) => {
    // Preserve the original code pixels inside equal square white canvases.
    // Instagram gains white space, without stretching or regenerating its code.
    const [x,y,w,h] = crop.split(' ').map(Number)
    const side = Math.max(w,h)
    const viewBox = `${x-(side-w)/2} ${y-(side-h)/2} ${side} ${side}`
    const shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`
    const clip = `<defs><clipPath id="footer-qr-window-${i+1}">${shape}</clipPath></defs>`
    return `<figure class="qr-item"><a class="qr-original" href="${source(id)}" target="_blank" rel="noopener" aria-label="Open original ${label} QR code"><svg class="qr-code" viewBox="${viewBox}" width="144" height="144" role="img" aria-label="${label} QR code" preserveAspectRatio="xMidYMid meet"><rect x="${x-(side-w)/2}" y="${y-(side-h)/2}" width="${side}" height="${side}" fill="white"/>${clip}<image href="${source(id)}" width="${width}" height="${height}" clip-path="url(#footer-qr-window-${i+1})"/></svg></a></figure>`
  }).join('')
  // Match the sketch: brand above, contact in the left half, directory in the
  // right half, then the shared full-width sponsor strip and copyright.
  const main = document.createElement('div')
  main.className = 'footer-main'
  const contact = document.createElement('section')
  contact.className = 'footer-contact'
  contact.setAttribute('aria-label', 'Contact with us')
  const contactTitle = footer.querySelector('.contact-title')
  if (contactTitle) contact.append(contactTitle)
  if (social) contact.append(social)
  main.append(contact, map)
  if (brand) brand.after(main)
  else footer.prepend(main)
  const sponsors = footer.querySelector('.sponsors')
  const sponsorItems = [
    [6, 'School of Public Health, Jilin University'],
    [7, 'Jilin University'],
    [9, 'School of Life Sciences, Jilin University'],
    [10, 'University of Alberta'],
    [11, 'DLAB'],
    [12, 'Sangon Biotech'],
    ['health-inspection', 'Department of Health Inspection, School of Public Health, Jilin University'],
  ]
  if (sponsors) {
    sponsors.className = 'sponsor-marquee'
    sponsors.tabIndex = 0
    sponsors.setAttribute('aria-label', 'Sponsors and cooperators; focus or hover to pause')
    const cards = sponsorItems.map(([id,label]) => `<div class="sponsor-card"><img src="${sponsorSource(typeof id === 'number' ? `image${id}` : id)}" alt="${label}" width="240" height="100" loading="eager"></div>`).join('')
    sponsors.innerHTML = `<div class="sponsor-marquee-track"><div class="sponsor-marquee-group">${cards}</div><div class="sponsor-marquee-group" aria-hidden="true">${cards}</div></div>`
  }
}

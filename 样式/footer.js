import { navigationSchema } from './navigation.js'
import './footer.css'
import { createCarousel } from './carousel.js'

const footer = document.querySelector('.site-footer .footer-content')
const media = import.meta.glob('../assets/site-footer/revision-20261016/*.png', {
  eager: true, query: '?url', import: 'default',
})
const source = n => media[`../assets/site-footer/revision-20261016/image${n}.png`]
if (footer) {
  const map = document.createElement('nav')
  map.className = 'footer-sitemap'
  map.setAttribute('aria-label', 'Explore the wiki')
  const groups = [{label: 'Home', items: [['Homepage', '../homepage/index.html']]}, ...navigationSchema]
  map.innerHTML = groups.map(({label, items, href}) => `<div class="footer-sitemap-row"><h2>${label}</h2><div>${(items || [['Member', href]]).map(([name,url]) => `<a href="${url}">${name}</a>`).join('')}</div></div>`).join('')
  footer.prepend(map)
  footer.parentElement.id ||= 'site-footer'
  const social = footer.querySelector('.qr-container')
  if (social) social.innerHTML = ['WeChat Official Account','TikTok','Xiaohongshu','Bilibili','Instagram'].map((label,i) => `<figure class="qr-item"><a class="qr-original" href="${source(i+1)}" target="_blank" rel="noopener" aria-label="Open original ${label} QR code"><img class="qr-code" src="${source(i+1)}" alt="${label} QR code" width="144" height="144" loading="lazy"></a><figcaption>${label}</figcaption></figure>`).join('')
  const sponsors = footer.querySelector('.sponsors')
  const labels = ['School of Public Health, Jilin University','Jilin University','Harbin Institute of Technology','School of Life Sciences, Jilin University','University of Alberta','DLAB','Sangon Biotech','Sangon Biotech']
  if (sponsors) {
    sponsors.className = 'sponsor-marquee'
    sponsors.tabIndex = 0
    sponsors.setAttribute('aria-label', 'Sponsors and cooperators; focus or hover to pause')
    const cards = labels.map((label,i) => `<div class="sponsor-card"><img src="${source(i+6)}" alt="${label}" width="240" height="100" loading="eager"></div>`).join('')
    sponsors.innerHTML = `<div class="sponsor-marquee-track"><div class="sponsor-marquee-group">${cards}</div><div class="sponsor-marquee-group" aria-hidden="true">${cards}</div></div>`
    if (!document.body.classList.contains('team-page-body')) {
      sponsors.removeAttribute('tabindex')
      sponsors.setAttribute('aria-label', 'Sponsors and cooperators')
      sponsors.classList.add('wiki-carousel--sponsors')
      const track = sponsors.querySelector('.sponsor-marquee-track')
      const originals = [...track.querySelector('.sponsor-marquee-group').children]
      track.replaceChildren()
      for (let index = 0; index < originals.length; index += 4) {
        const slide = document.createElement('div')
        slide.className = 'sponsor-marquee-group'
        slide.append(...originals.slice(index, index + 4))
        track.append(slide)
      }
      createCarousel(sponsors, { track })
    }
  }
}

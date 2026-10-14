// URLs are taken from manuscript identifiers or verified records for named works.
// Do not turn an unidentifiable citation into a guessed paper or search-result link.
const namedSources = [
  ['The 14th Five-Year Plan for National Health', 'https://app.www.gov.cn/govdata/gov/202205/20/485135/article.html'],
  ['Healthy Children Action Enhancement Plan', 'https://www.nhc.gov.cn/wjw/c100175/202111/3e4447a30f3a4862b4c31056326ee90d.shtml'],
  ['Intelligent Multi-Point Trigger Surveillance', 'https://app.www.gov.cn/govdata/gov/202408/31/518844/article.html'],
  ['Characteristics of SARS-CoV-2 and COVID-19', 'https://doi.org/10.1038/s41579-020-00459-7'],
  ['Comprehensive Review of COVID-19', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11312261/'],
  ['Human Metapneumovirus: A Review of Its Epidemiology', 'https://doi.org/10.1002/rmv.70043'],
  ['Respiratory Syncytial Virus: A Narrative Review', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12156131/'],
  ['Human Influenza Epidemiology', 'https://perspectivesinmedicine.cshlp.org/content/11/12/a038356.full'],
  ['Epidemiological characteristics and antibiotic resistance mechanisms', 'https://doi.org/10.1016/j.micres.2022.127221'],
  ['Mitchell, Agle & Wood (1997)', 'https://doi.org/10.5465/AMR.1997.9711022105'],
  ['Cronbach (1951)', 'https://www.ets.org/research/policy_research_reports/publications/article/1951/dblr.html'],
  ['Pfeffer & Salancik (1978)', 'https://www.gsb.stanford.edu/faculty-research/books/external-control-organizations-resource-dependence-perspective'],
  ['Lawrence & Lorsch (1967)', 'https://books.google.com/books/about/Organization_and_Environment.html?id=-SZHAAAAMAAJ'],
  ['Patton (1990)', 'https://books.google.com/books?id=XRO2AAAAIAAJ'],
  ['Denzin (1978)', 'https://books.google.com/books/about/The_Research_Act.html?id=gfS1AAAAIAAJ'],
  ['Linstone & Turoff (1975)', 'https://web.njit.edu/~turoff/pubs/delphibook/index.html'],
  ['Rowe & Wright (1999)', 'https://www.sciencedirect.com/science/article/pii/S0169207099000187'],
]

const entries = [...document.querySelectorAll([
  'main .reference-entry', 'main .research-reference p',
  'main .reference-list > li', 'main .model-references li',
  'main .edu-references li', 'main .hw-references li',
  'main details.references li',
].join(','))].filter(entry => entry.textContent.trim())

const bibliographies = new Map()
for (const [index, entry] of entries.entries()) {
  const text = entry.textContent.trim()
  const explicit = text.match(/^\[(\d+)\]/)
  const list = entry.closest('ol')
  const number = explicit ? Number(explicit[1]) : list
    ? [...list.children].indexOf(entry) + Number(list.getAttribute('start') || 1)
    : index + 1
  entry.dataset.wikiReferenceNumber = String(number)
  entry.id ||= `wiki-reference-${number}`
  const scope = entry.closest('[data-model-module]') || document.querySelector('main')
  if (!bibliographies.has(scope)) bibliographies.set(scope, new Map())
  bibliographies.get(scope).set(number, entry.id)

  const existing = entry.querySelector('a[href^="https://"], a[href^="http://"]')
  const doi = text.match(/\b10\.\d{4,9}\/[^\s<>]+/i)?.[0]?.replace(/[.,;]+$/, '')
  const url = existing?.href || (doi ? `https://doi.org/${doi}` :
    namedSources.find(([name]) => text.toLowerCase().includes(name.toLowerCase()))?.[1])
  if (!url) {
    entry.dataset.wikiReferenceMissing = 'true'
    continue
  }
  if ([...entry.querySelectorAll('a')].some(a => a.textContent.trim() === url)) continue
  const source = document.createElement('a')
  source.className = 'wiki-reference-source wiki-jump-link'
  source.href = url
  source.textContent = url
  source.target = '_blank'
  source.rel = 'noopener'
  source.setAttribute('aria-label', `Source for reference ${number}: ${url}`)
  entry.append(document.createTextNode(' '), source)
}

document.querySelectorAll('main a[href^="#"]').forEach(link => {
  const target = document.getElementById(link.getAttribute('href').slice(1))
  if (!target?.hasAttribute('data-wiki-reference-number')) return
  if (/^\d+$/.test(link.textContent.trim())) link.textContent = `[${link.textContent.trim()}]`
  link.classList.add('wiki-citation')
})

// Link only bracketed citation numbers that have an actual bibliography entry.
// Years, measurements, tables, formula indices and existing links are untouched.
const walker = document.createTreeWalker(document.querySelector('main') || document.body, NodeFilter.SHOW_TEXT)
const texts = []
while (walker.nextNode()) {
  const node = walker.currentNode
  if (!node.parentElement.closest('p, li, figcaption, blockquote')) continue
  if (node.parentElement.closest('a, nav, aside, table, math, pre, code, script, style, [data-wiki-reference-number], .wiki-headpage, .home-story, .team-page')) continue
  if (/\[\d+(?:\s*[,–-]\s*\d+)*\]/.test(node.textContent)) texts.push(node)
}
for (const text of texts) {
  const scope = text.parentElement.closest('[data-model-module]') || document.querySelector('main')
  const numbered = bibliographies.get(scope) || new Map()
  const fragment = document.createDocumentFragment()
  let offset = 0
  for (const match of text.textContent.matchAll(/\[(\d+)\]/g)) {
    const destination = numbered.get(Number(match[1]))
    if (!destination) continue
    fragment.append(document.createTextNode(text.textContent.slice(offset, match.index)))
    const link = document.createElement('a')
    link.className = 'wiki-citation'
    link.href = `#${destination}`
    link.textContent = match[0]
    link.setAttribute('aria-label', `Reference ${match[1]}`)
    fragment.append(link)
    offset = match.index + match[0].length
  }
  if (offset) {
    fragment.append(document.createTextNode(text.textContent.slice(offset)))
    text.replaceWith(fragment)
  }
}

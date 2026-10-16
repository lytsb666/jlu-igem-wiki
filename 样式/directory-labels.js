// Sentence case is a display rule for directories only. Preserve the original
// article headings, inline scientific notation, link targets and section IDs.
const terms = [
  'JLU-SPH', 'iGEM', 'iHP', 'ByeGerm', 'C.A.R.E.S.', 'CARES', 'HEART-Edu Loop', 'HEART-Edu',
  'LbCas12a', 'Cas12a', 'DNABERT-6', 'DNABERT', 'BERT', 'CRISPR', 'RPA',
  'DBTL', 'D-B-T-L', 'RNP', 'crRNAs', 'gRNAs', 'crRNA', 'gRNA', 'mRNA', 'cDNA', 'RNA', 'DNA', 'N gene',
  'qPCR', 'PCR', 'RT', 'RSV-N', 'RSV', 'hMPV-B', 'hMPV', 'SPN', 'BP', 'HI', 'HP',
  'IS1663', 'ompP6', 'P6', 'lytA', 'COVID-19', 'SARS-CoV-2',
  'Streptococcus pneumoniae', 'Bordetella pertussis', 'Haemophilus influenzae',
  'Escherichia coli', 'E. coli', 'Michaelis–Menten', 'Michaelis-Menten',
  'Hill', 'Gompertz', 'Arrhenius', 'Fourier', 'Laplace', 'Bayesian',
  'Python', 'GitHub', 'Android', 'iOS', 'Bluetooth', 'Wi-Fi',
  'Jilin', 'Changchun', 'Alberta', 'China', 'WHO', 'CDC', 'POCT', 'LFA',
  'NCBI', 'BLAST', 'SOPs', 'SOP', 'PDF', 'RFU', 'OD', 'T7', 'LB',
  'MgCl2', 'Mg2+', 'Mg', 'KCl', 'NaCl', 'ATP', 'NADH', 'dNTP', 'dNTPs',
  'PID', 'ODEs', 'ODE', 'PDE', '3D', 'CAD', 'LED', 'USB',
  'LASSO', 'MCMC', 'AUC', 'ROC', 'LOD', 'Cq', 'Ct', 'R²',
]
const escapePattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const canonical = new Map(terms.map(term => [term.toLowerCase(), term]))
const specialTerm = new RegExp(`(?<![a-z0-9])(?:${terms.sort((a, b) => b.length - a.length).map(escapePattern).join('|')})(?![a-z0-9])`, 'gi')

export function sentenceCaseDirectory(value) {
  let result = value.toLowerCase()
  result = result.replace(specialTerm, match => canonical.get(match.toLowerCase()))
  // Preserve source identifiers and the five named stages without changing
  // ordinary headings such as "Build & test" into uppercase.
  for (const match of value.matchAll(/\b[A-J][1-4]\b|\b[A-J](?=\s*[:→–])|\b(?:LISTEN|DEFINE|BUILD|ENGINEER|EXTEND)\b/g)) {
    result = result.slice(0, match.index) + match[0] + result.slice(match.index + match[0].length)
  }
  const prefix = result.match(/^\s*(?:(?:\d+(?:\.\d+)*[.)]?|[a-z]+[.)])\s+)*/i)[0].length
  const initial = result.slice(prefix).search(/[a-z]/i)
  if (initial !== -1) {
    const index = prefix + initial
    // A scientific name at the beginning still keeps its canonical spelling.
    const protectedStart = [...result.matchAll(specialTerm)].some(match => match.index === index)
    if (!protectedStart) result = result.slice(0, index) + result[index].toUpperCase() + result.slice(index + 1)
  }
  return result
}

export function formatDirectoryLabel(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (!node.parentElement.closest('button, .wiki-number-label, svg, math')) nodes.push(node)
  }
  const original = nodes.map(node => node.nodeValue).join('')
  const formatted = sentenceCaseDirectory(original)
  if (original === formatted) return
  let offset = 0
  for (const node of nodes) {
    const length = node.nodeValue.length
    node.nodeValue = formatted.slice(offset, offset + length)
    offset += length
  }
}

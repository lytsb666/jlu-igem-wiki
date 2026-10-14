import { enhanceSectionNavigation } from './instrument-navigation.js'

const modelPanels = document.querySelectorAll('.model-revision-page [data-model-module]')
if (modelPanels.length) {
  modelPanels.forEach(panel => enhanceSectionNavigation(panel, '.page-toc nav a[href^="#"]'))
} else {
  const modelRoot = document.querySelector('.model-revision-page .lab-main')
  if (modelRoot) enhanceSectionNavigation(modelRoot, '.page-toc nav a[href^="#"]')
}

import { enhanceSectionNavigation } from './instrument-navigation.js'

const modelRoot = document.querySelector('.model-revision-page .lab-main')
if (modelRoot) enhanceSectionNavigation(modelRoot, '.page-toc nav a[href^="#"]')

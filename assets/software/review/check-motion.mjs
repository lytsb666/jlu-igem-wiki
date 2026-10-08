import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
const code = readFileSync(new URL('../../../样式/software.js', import.meta.url), 'utf8').replace(/^\uFEFF/, '').replace(/^import .*$/m, '')
const makeElement = () => ({
  hidden: true, textContent: '', attrs: {}, events: {},
  classList: { values: new Set(), toggle(name,on) { on ? this.values.add(name) : this.values.delete(name) }, remove(name) { this.values.delete(name) } },
  setAttribute(name,value) { this.attrs[name]=value },
  addEventListener(name,callback) { this.events[name]=callback }
})
const illustration=makeElement(), pause=makeElement()
illustration.querySelector=()=>pause
const root={querySelector:(selector)=>selector==='[data-sw-float]' ? illustration : null,querySelectorAll:()=>[]}
const media={matches:true,events:{},addEventListener(name,callback){this.events[name]=callback}}
const document={hidden:false,events:{},querySelector:()=>root,addEventListener(name,callback){this.events[name]=callback}}
const window={matchMedia:()=>media}
vm.runInNewContext(code,{document,window,enhanceSectionNavigation(){}})
assert.equal(pause.hidden,true)
media.matches=false
media.events.change()
assert.equal(pause.hidden,false)
assert.equal(pause.attrs['aria-label'],'Pause floating illustration')
pause.events.click()
assert.equal(pause.attrs['aria-pressed'],'true')
assert.equal(pause.attrs['aria-label'],'Resume floating illustration')
assert(illustration.classList.values.has('is-paused'))
pause.events.click()
assert.equal(pause.attrs['aria-pressed'],'false')
assert(!illustration.classList.values.has('is-paused'))
document.hidden=true
document.events.visibilitychange()
assert(illustration.classList.values.has('is-paused'))
document.hidden=false
document.events.visibilitychange()
assert(!illustration.classList.values.has('is-paused'))
media.matches=true
media.events.change()
assert.equal(pause.hidden,true)
console.log('Floating illustration pause/resume, accessible labels, reduced-motion preference and background pause passed.')

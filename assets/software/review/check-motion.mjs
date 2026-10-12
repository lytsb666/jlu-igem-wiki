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
const illustration=makeElement()
const root={querySelector:(selector)=>selector==='[data-sw-float]' ? illustration : null,querySelectorAll:()=>[]}
const media={matches:true,events:{},addEventListener(name,callback){this.events[name]=callback}}
const document={hidden:false,events:{},querySelector:()=>root,addEventListener(name,callback){this.events[name]=callback}}
const window={matchMedia:()=>media}
vm.runInNewContext(code,{document,window,enhanceSectionNavigation(){}})
assert(illustration.classList.values.has('is-paused'))
media.matches=false
media.events.change()
assert(!illustration.classList.values.has('is-paused'))
document.hidden=true
document.events.visibilitychange()
assert(illustration.classList.values.has('is-paused'))
document.hidden=false
document.events.visibilitychange()
assert(!illustration.classList.values.has('is-paused'))
media.matches=true
media.events.change()
assert(illustration.classList.values.has('is-paused'))
document.hidden=true
document.events.visibilitychange()
media.matches=false
media.events.change()
assert(illustration.classList.values.has('is-paused'))
document.hidden=false
document.events.visibilitychange()
assert(!illustration.classList.values.has('is-paused'))
console.log('Floating illustration reduced-motion preference and background pause passed without a visible control.')

import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
const code = readFileSync(new URL('../../../样式/software.js', import.meta.url), 'utf8').replace(/^\uFEFF/, '').replace(/^import .*$/m, '').replaceAll('import.meta.url', JSON.stringify(new URL('../../../样式/software.js', import.meta.url).href))
const makeElement = () => ({
  hidden: true, textContent: '', dataset: {}, attrs: {}, events: {},
  classList: { values: new Set(), toggle(name,on) { on ? this.values.add(name) : this.values.delete(name) }, remove(name) { this.values.delete(name) } },
  setAttribute(name,value) { this.attrs[name]=value },
  addEventListener(name,callback) { this.events[name]=callback }
})
const animation=makeElement(), pause=makeElement(), staticButton=makeElement()
const stages=Array.from({length:5},makeElement)
animation.querySelector=(selector)=>selector==='[data-sw-pause]' ? pause : staticButton
animation.querySelectorAll=()=>stages
const root={querySelector:(selector)=>selector==='[data-sw-animation]' ? animation : null,querySelectorAll:()=>[]}
const media={matches:true,events:{},addEventListener(name,callback){this.events[name]=callback}}
const timers=new Set()
const document={hidden:false,querySelector:()=>root,addEventListener(){}}
const window={matchMedia:()=>media,setInterval(){timers.add(1);return 1},clearInterval(id){timers.delete(id)},location:{hash:''},addEventListener(){}}
vm.runInNewContext(code,{document,window,enhanceSectionNavigation(){}})
assert.equal(timers.size,0)
assert.equal(pause.hidden,true)
assert.equal(staticButton.hidden,true)
assert(animation.classList.values.has('is-static'))
media.matches=false
media.events.change()
assert.equal(timers.size,1)
assert.equal(pause.hidden,false)
pause.events.click()
assert.equal(timers.size,0)
assert.equal(pause.attrs['aria-pressed'],'true')
assert(animation.classList.values.has('is-paused'))
staticButton.events.click()
assert(animation.classList.values.has('is-static'))
assert.equal(pause.hidden,true)
staticButton.events.click()
assert.equal(timers.size,1,'Play workflow resumes after a previously paused/static view')
assert.equal(pause.attrs['aria-pressed'],'false')
media.matches=true
media.events.change()
assert.equal(timers.size,0)
assert(animation.classList.values.has('is-static'))
console.log('Reduced-motion initialization/change, pause, static view and resume checks passed.')

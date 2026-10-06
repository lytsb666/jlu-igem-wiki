import {readFileSync} from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
const code = readFileSync(new URL('../../../样式/instrument-navigation.js', import.meta.url),'utf8').replace('export function', 'function')
const events = {}, rootEvents = {}, history = [], timers = new Map(), scrolls = []
let reduced = false, focused = '', timerId = 0
const targets = ['one','two','three'].map((id,index) => ({id,top:index*1000+100, parentElement:null, attrs:{},
  getBoundingClientRect(){return {top:this.top}}, hasAttribute(key){return key in this.attrs},
  setAttribute(key,value){this.attrs[key]=value},focus(options){assert.equal(options.preventScroll,true);focused=id},
  scrollIntoView(options){scrolls.push(options);this.top=100}}))
const links = targets.map(target => ({hash:'#'+target.id, attrs:{}, classList:{toggle(){}},
  setAttribute(key,value){this.attrs[key]=value},removeAttribute(key){delete this.attrs[key]},
  closest(){return this},hasAttribute(){return false}}))
const root = {querySelectorAll(){return links},contains(){return true},addEventListener(name,fn){rootEvents[name]=fn}}
targets.forEach(t => t.parentElement=root)
const window = {matchMedia(){return {get matches(){return reduced}}},location:{hash:''},
  history:{pushState(_,__,hash){history.push(hash);window.location.hash=hash}},
  setTimeout(fn){timers.set(++timerId,fn);return timerId},clearTimeout(id){timers.delete(id)},
  addEventListener(name,fn){events[name]=fn},requestAnimationFrame(fn){fn();return 1},cancelAnimationFrame(){},
  innerHeight:1000,scrollY:0}
const document = {getElementById(id){return targets.find(t=>t.id===id)},documentElement:{scrollHeight:5000}}
const ctx = {window,document,getComputedStyle(){return {scrollMarginTop:'100px'}}}
vm.runInNewContext(code,ctx)
ctx.enhanceSectionNavigation(root,'a')
function click(index,options={}) {
  let prevented=false
  rootEvents.click({target:links[index],button:0,preventDefault(){prevented=true},...options})
  return prevented
}
assert.equal(links[0].attrs['aria-current'],'location')
assert(click(1));assert.equal(focused,'two');assert.equal(scrolls.at(-1).behavior,'smooth')
assert.equal(links[1].attrs['aria-current'],'location')
events.scroll();assert.equal(links[1].attrs['aria-current'],'location','Scrolling past intermediate chapters retains the chosen target')
assert(!click(0,{ctrlKey:true}));assert.equal(history.length,1)
reduced=true
assert(click(2));assert.equal(focused,'three');assert.equal(scrolls.at(-1).behavior,'instant')
assert.equal(history.length,2)
assert(click(2));assert.equal(history.length,2,'Repeated clicks do not duplicate history')
events.scrollend()
assert.equal(links[2].attrs['aria-current'],'location')
events.pagehide();assert.equal(timers.size,0)
console.log('Smooth/reduced-motion navigation, focus, active-state lock, modified clicks, history and timer cleanup passed.')

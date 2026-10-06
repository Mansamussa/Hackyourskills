// Exercise the actual guide event handlers without a browser or network.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
class Element {
  constructor(text = '') { this.attrs = {}; this.events = {}; this.style = {}; this.textContent = text; this.hidden = false; this.inert = false; this.children = {}; this.classes = new Set(); this.classList = { toggle: (key, on) => on ? this.classes.add(key) : this.classes.delete(key) }; }
  setAttribute(key, value) { this.attrs[key] = value; }
  addEventListener(key, handler) { this.events[key] = handler; }
  querySelector(key) { return this.children[key]; }
  focus() { this.focused = true; }
  closest() { return null; }
  fire(key, event = {}) { this.events[key]?.({ preventDefault() {}, target: this, ...event }); }
}
const root = new Element(), stage = new Element(), prev = new Element(), next = new Element();
const tabs = ['Coach', 'Agency', 'Service'].map(name => new Element(name));
const slides = tabs.map(() => { const slide = new Element(), details = new Element(); details.children['summary > span'] = new Element(); details.children['.approach-details-body'] = new Element(); slide.children.details = details; slide.children.img = new Element(); return slide; });
root.children = { '.approach-stage': stage, '[data-slide-prev]': prev, '[data-slide-next]': next, '.approach-count': new Element(), '[data-slide-status]': new Element() };
root.querySelectorAll = key => key === '.approach-tab' ? tabs : slides;
const pending = [];
const tween = (target, values, duration, options = {}) => { const job = { stopped: false, stop() { this.stopped = true; }, finish() { if (!this.stopped) options.onComplete?.(); } }; pending.push(job); return job; };
const media = { matches: true, addEventListener() {} };
const source = readFileSync(new URL('../src/guide.js', import.meta.url), 'utf8').replace(/^import .*;\n/, '').replace('export function', 'function');
new Function('document', 'matchMedia', 'tween', 'reduced', 'scroll', 'animate', source + '\ninitGuide();')({ querySelector: () => root }, () => media, tween, media, () => () => {}, () => ({ stop() {} }));
const finish = () => { pending.splice(0).forEach(job => job.finish()); };
const expect = index => {
  assert.equal(slides.filter(slide => !slide.inert).length, 1);
  assert.equal(slides[index].inert, false);
  assert.equal(tabs[index].attrs['aria-selected'], 'true');
  assert.equal(tabs.filter(tab => tab.attrs['aria-selected'] === 'true').length, 1);
  assert.equal(slides.filter(slide => !slide.hidden).length, 1);
};
next.fire('click'); finish(); expect(1);
next.fire('click'); next.fire('click'); prev.fire('click'); finish(); expect(2);
tabs[2].fire('keydown', { key: 'Home' }); finish(); expect(0); assert(tabs[0].focused);
tabs[0].fire('keydown', { key: 'ArrowLeft' }); finish(); expect(2);
tabs[1].fire('click'); finish(); expect(1);
stage.fire('pointerdown', { pointerType: 'touch', pointerId: 1, clientX: 240, clientY: 100 });
stage.fire('pointerup', { pointerId: 1, clientX: 50, clientY: 105 }); finish(); expect(2);
stage.fire('pointerdown', { pointerType: 'touch', pointerId: 1, clientX: 240, clientY: 100 });
stage.fire('pointerup', { pointerId: 1, clientX: 200, clientY: 350 }); finish(); expect(2);
assert.match(root.children['[data-slide-status]'].textContent, /Example 3 of 3/);
console.log('Guide checks passed: buttons, keyboard wrapping, rapid reversals, touch swipe, vertical scroll, inactive-panel accessibility, announcements.');

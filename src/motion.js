import { animate, hover, inView, scroll, press } from 'framer-motion/dom';

export const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const ease = [0.25, 0.7, 0.3, 1];
const running = new Set();
export function tween(target, values, duration = 0.3, options = {}) {
  const controls = animate(target, values, { duration: reduced.matches ? 0 : duration * 1.6, ease, ...options });
  running.add(controls);
  controls.then(() => running.delete(controls));
  const stop = controls.stop.bind(controls);
  controls.stop = () => { running.delete(controls); stop(); };
  return controls;
}
reduced.addEventListener('change', () => {
  if (!reduced.matches) return;
  running.forEach(control => control.complete());
  document.querySelectorAll('[data-motion-reveal]').forEach(el => {
    animate(el, { opacity: 1, y: 0 }, { duration: 0 });
  });
});
const kebab = key => key.startsWith('--') ? key : key.replace(/[A-Z]/g, c => '-' + c.toLowerCase());

// A single Motion gesture adapter owns hover entry, reversal and cleanup.
// Resolve resting styles again on exit so selected controls retain their state.
export function bindHover(selector, targets) {
  const states = new WeakMap();
  return hover(selector, element => {
    if (element.matches(':disabled')) return;
    const previous = states.get(element);
    previous?.records.forEach(record => record.control.stop());
    const state = { records: [], revision: (previous?.revision || 0) + 1 };
    states.set(element, state);
    const records = targets(element).filter(record => record.element).map(record => {
      const values = { ...record.values };
      if (reduced.matches) Object.keys(values).forEach(key => {
        if (['x', 'y', 'scale', 'rotate', '--hover-y'].includes(key)) delete values[key];
      });
      const previousRecord = previous?.records.find(old => old.element === record.element);
      const original = previousRecord?.original || new Map(Object.keys(values).map(key => [kebab(key), record.element.style.getPropertyValue(kebab(key))]));
      const control = tween(record.element, values, 0.24);
      return { ...record, values, original, control };
    });
    state.records = records;
    return () => records.forEach(record => {
      record.control.stop();
      const values = {};
      Object.keys(record.values).forEach(key => {
        if (['x', 'y', 'rotate'].includes(key)) values[key] = 0;
        else if (key === 'scale') values[key] = 1;
        else {
          const prop = kebab(key);
          const current = getComputedStyle(record.element).getPropertyValue(prop);
          const original = record.original.get(prop);
          if (original) record.element.style.setProperty(prop, original);
          else record.element.style.removeProperty(prop);
          const rest = getComputedStyle(record.element).getPropertyValue(prop).trim();
          record.element.style.setProperty(prop, current);
          values[key] = rest || (key === '--hover-y' ? '0px' : '0');
        }
      });
      record.control = tween(record.element, values, 0.22, { onComplete: () => {
        if (states.get(element) !== state) return;
        record.original.forEach((value, prop) => {
          if (['x', 'y', 'scale', 'rotate'].includes(prop)) return;
          if (value) record.element.style.setProperty(prop, value);
          else record.element.style.removeProperty(prop);
        });
      } });
    });
  });
}

export function initHovers() {
  const one = (element, values) => [{ element, values }];
  bindHover('.btn', element => {
    const dark = element.matches('.btn-dark');
    const outline = element.matches('.btn-secondary,.navbar .btn');
    return one(element, { y: -2, backgroundColor: dark ? '#3a4f29' : outline ? '#232b1c' : '#bce47f', borderColor: outline ? '#ADDB66' : getComputedStyle(element).borderColor });
  });
  bindHover('.language-switch a', el => one(el, { color: '#c3e999', backgroundColor: '#addb6626' }));
  bindHover('.nav-links a,.footer-col a,.footer-minimal a,.skip-link', el => one(el, { color: '#ADDB66' }));
  bindHover('.legal-content a', el => one(el, { color: '#46652c', borderBottomColor: '#46652c' }));
  bindHover('.menu-toggle,.approach-arrow', el => one(el, { backgroundColor: '#ADDB66', color: '#20251d', borderColor: '#ADDB66' }));
  bindHover('.approach-tab,.faq-toggle,.approach-details summary', el => one(el, { color: '#ADDB66' }));
  bindHover('.accordion-btn', el => one(el.querySelector('.accordion-title'), { color: '#46652c' }));
  bindHover('.issue', el => [
    ...one(el, { '--hover-fill': 1, '--hover-line': 1 }),
    ...one(el.querySelector('strong'), { x: 6 }),
    ...one(el.querySelector('span'), { x: 2 })
  ]);
  bindHover('.visual-item', el => [
    ...one(el, { '--hover-fill': 1 }),
    ...one(el.querySelector('img'), { scale: 1.025 }),
    ...one(el.querySelector('.visual-caption-text'), { x: 4 })
  ]);
  bindHover('.outcome-item', el => one(el, { '--hover-y': '-4px', '--hover-line': 1, backgroundColor: '#ffffff0b' }));
  bindHover('.pricing-card,.design-package', el => one(el, { '--hover-y': '-4px', borderColor: el.matches('.featured,.design-featured') ? '#ADDB66' : '#829b64' }));
  bindHover('.approach-steps li', el => one(el, { x: 4, backgroundColor: '#addb6608' }));
  bindHover('.design-photo', el => one(el.querySelector('img'), { scale: 1.025 }));
  bindHover('.approach-visual', el => one(el.querySelector('img'), { scale: 1.035 }));
  bindHover('.process-step', el => [ ...one(el, { x: 4, borderColor: '#addb6633' }), ...one(el.querySelector('.step-num'), { scale: 1.06 }) ]);
  bindHover('.deliverable-item', el => one(el, { y: -3, borderColor: '#addb6644' }));
  bindHover('.teardown-preview,.quiz-container', el => one(el, { borderColor: '#addb6677' }));
  bindHover('.btn-teardown', el => one(el, { x: 4, borderColor: '#ADDB66' }));
  bindHover('.btn-return', el => one(el, { x: -4, borderColor: '#ADDB66' }));
  bindHover('.q-option', el => one(el, { borderColor: '#ADDB66', backgroundColor: '#addb6614' }));
  bindHover('.btn-next', el => one(el, { y: -2, backgroundColor: '#bce47f' }));
  bindHover('.btn-prev', el => one(el, { color: '#ADDB66' }));
  bindHover('.diagnostic-step', el => one(el, { color: '#ADDB66' }));
  press('.btn,.approach-arrow,.menu-toggle', element => {
    if (reduced.matches) return;
    tween(element, { scale: 0.98 }, 0.12);
    return () => tween(element, { scale: 1 }, 0.18);
  });
}

export function initReveals() {
  document.querySelectorAll('.process-step,.deliverable-item,.teardown-preview,.quiz-container,.return-section').forEach(el => el.setAttribute('data-motion-reveal', ''));
  document.querySelectorAll('[data-motion-reveal]').forEach(el => {
    if (!reduced.matches && el.getBoundingClientRect().top >= innerHeight) animate(el, { opacity: 0, y: 18 }, { duration: 0 });
    inView(el, () => {
      tween(el, { opacity: 1, y: 0 }, 0.5);
      return () => {
        if (!reduced.matches && el.getBoundingClientRect().top >= innerHeight - 1) tween(el, { opacity: 0, y: 18 }, 0.22);
      };
    });
    el.addEventListener('focusin', () => tween(el, { opacity: 1, y: 0 }, 0));
  });
}

export function initAnchorScroll() {
  let navigation;
  const cancel = () => navigation?.stop();
  addEventListener('wheel', cancel, { passive: true });
  addEventListener('touchstart', cancel, { passive: true });
  addEventListener('keydown', cancel);
  addEventListener('pointerdown', cancel, { passive: true });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || link.target) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    let target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (target && !target.getClientRects().length) target = document.getElementById(target.id + '-mobile') || target;
    if (!target) return;
    event.preventDefault(); cancel();
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 24;
    const end = Math.min(document.documentElement.scrollHeight - innerHeight, Math.max(0, target.getBoundingClientRect().top + scrollY - padding));
    navigation = animate(scrollY, end, { duration: reduced.matches ? 0 : 1.15, ease, onUpdate: y => window.scrollTo(0, y), onComplete: () => {
      history.pushState(null, '', url.hash);
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    } });
  });
}

export { animate, scroll };

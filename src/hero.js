import { scroll } from 'framer-motion/dom';

export function initHero() {
  'use strict';
  const hero = document.querySelector('.hero');
  if (!hero || !CSS.supports('mask-image', 'conic-gradient(#000, transparent)')) return;

  const stage = hero.querySelector('.hero-stage');
  const art = hero.querySelector('.hero-art');
  const plane = hero.querySelector('.hero-art-plane');
  const support = hero.querySelector('.hero-support');
  const supportText = support.textContent.trim();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const layers = Object.fromEntries(['funnel', 'signal', 'orbit', 'block', 'rise']
    .map(name => [name, hero.querySelector(`.hero-trace-${name}`)]));
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => { const p = clamp(value); return p * p * (3 - 2 * p); };
  const between = (time, start, end) => ease((time - start) / (end - start));
  let start = 0;
  let pinActive = false;
  let distance = 1;
  let stopScroll;
  let layoutFrame = 0;
  let lastProgress = -1;
  let copy = [];

  const prepareCopy = () => {
    // Measure actual wrapped lines again after fonts or viewport width change.
    // The paragraph stays a real paragraph, with its original reading order.
    support.textContent = supportText;
    const node = support.firstChild;
    const range = document.createRange();
    const lines = [];
    for (const word of supportText.matchAll(/\S+/g)) {
      range.setStart(node, word.index);
      range.setEnd(node, word.index + word[0].length);
      const top = range.getBoundingClientRect().top;
      const previous = lines[lines.length - 1];
      if (previous && Math.abs(previous.top - top) < 2) previous.words.push(word[0]);
      else lines.push({top, words: [word[0]]});
    }
    support.replaceChildren(...lines.map((line, index) => {
      const span = document.createElement('span');
      span.className = 'hero-copy-line';
      span.dataset.heroReveal = 'support';
      span.textContent = line.words.join(' ') + (index < lines.length - 1 ? ' ' : '');
      return span;
    }));

    copy = [];
    const add = (element, from, to, x = 0, y = 14) => copy.push({element, from, to, x, y});
    add(hero.querySelector('[data-hero-reveal="eyebrow"]'), -.5, .65);
    hero.querySelectorAll('[data-hero-reveal="headline"]').forEach((line, index) =>
      add(line, .2 + index * .95, 1.6 + index * .95));
    [...support.children].forEach((line, index) => {
      const from = 3.15 + index * 1.55 / Math.max(1, lines.length - 1);
      add(line, from, from + 1.3, 0, 10);
    });
    const travel = innerWidth <= 600 ? 32 : 48;
    add(hero.querySelector('[data-hero-reveal="action-left"]'), 5.8, 7.4, -travel, 0);
    add(hero.querySelector('[data-hero-reveal="action-right"]'), 5.8, 7.4, travel, 0);
    add(hero.querySelector('[data-hero-reveal="assurance"]'), 6.4, 7.7, 0, 8);
    hero.querySelectorAll('[data-hero-reveal="footnote"]').forEach(line => add(line, 6.4, 7.9, 0, 8));
  };

  const paint = position => {
    const progress = reduced.matches ? 0 : typeof position === "number" ? position : clamp((scrollY - start) / distance);
    if (progress === lastProgress) return;
    lastProgress = progress;
    const time = progress * 8;
    hero.dataset.heroComplete = String(progress >= 1);
    const settle = between(time, 7, 8);
    const glow = .9 - settle * .2;
    const introFade = between(time, .05, 1.15);
    hero.style.setProperty('--hero-intro-opacity', (reduced.matches || !pinActive) ? '0' : (1 - introFade).toFixed(4));
    hero.style.setProperty('--hero-intro-scale', (1 - introFade * .025).toFixed(4));
    // As the message arrives, let the artwork recede behind its reading area.
    hero.style.setProperty('--hero-reading-shade', (reduced.matches || !pinActive) ? '1' : between(time, .65, 2.3).toFixed(4));

    // Eight connected beats: rim, neck, signal, inner orbit, outer orbit/base,
    // block, growth line, then a quiet finish. Scroll position is the only clock.
    plane.style.setProperty('--funnel-edge', `${18 + 17 * between(time, 0, 1) + 31 * between(time, 1, 2)}%`);
    plane.style.setProperty('--signal-edge', `${54 + 32 * between(time, 2, 3)}%`);
    plane.style.setProperty('--orbit-angle', `${180 * between(time, 3, 4) + 180 * between(time, 4, 5)}deg`);
    plane.style.setProperty('--block-edge', `${12 * between(time, 4, 5) + 40 * between(time, 5, 6)}%`);
    plane.style.setProperty('--rise-edge', `${28 + 36 * between(time, 6, 7)}%`);
    layers.funnel.style.opacity = String(glow * between(time, 0, .45));
    layers.signal.style.opacity = String(glow * between(time, 2, 2.3));
    layers.orbit.style.opacity = String(glow * between(time, 3, 3.3));
    layers.block.style.opacity = String(glow * between(time, 4, 4.3));
    layers.rise.style.opacity = String(glow * between(time, 6, 6.3));
    hero.dataset.heroPhase = String(Math.min(8, Math.floor(time) + 1));

    // Hand the opening frame from the centered brand to the existing copy
    // sequence, completing every reveal within the same eight scroll stages.
    const copyTime = Math.max(0, (time - .9) * 8 / 7.1);
    const copyGate = between(time, .65, 1.15);
    copy.forEach(({element, from, to, x, y}) => {
      const visible = (reduced.matches || !pinActive) ? 1 : between(copyTime, from, to) * copyGate;
      element.style.setProperty('--hero-copy-opacity', visible.toFixed(4));
      element.style.setProperty('--hero-copy-x', `${((1 - visible) * x).toFixed(2)}px`);
      element.style.setProperty('--hero-copy-y', `${((1 - visible) * y).toFixed(2)}px`);
      element.toggleAttribute('data-hero-unrevealed', visible < .15);
      if (element.matches('a,button')) element.inert = visible < .15;
    });
  };

  const measure = () => {
    layoutFrame = 0;
    hero.removeAttribute('data-hero-pinned');
    prepareCopy();
    const viewport = document.documentElement.clientHeight;
    // Never pin when copy grows beyond the screen, including zoomed text.
    // offsetHeight excludes the decorative artwork's intentional overscan.
    const pin = !reduced.matches && stage.querySelector('.hero-content').offsetHeight + parseFloat(getComputedStyle(stage).paddingTop) + parseFloat(getComputedStyle(stage).paddingBottom) <= viewport + 2;
    pinActive = pin;
    hero.toggleAttribute('data-hero-pinned', pin);
    const stageHeight = stage.offsetHeight;
    distance = pin ? (innerWidth > 900 ? Math.min(1500, Math.max(1000, viewport * 1.35)) : Math.min(1500, Math.max(900, viewport * 1.6)))
      : Math.max(220, Math.min(stageHeight * .65, viewport * .7));
    hero.style.setProperty('--hero-stage-height', `${stageHeight}px`);
    hero.style.setProperty('--hero-scroll-distance', `${distance}px`);
    // Give the portrait artwork enough height to avoid a narrow decorative strip.
    const artWidth = innerWidth <= 600 ? Math.max(art.clientWidth * 1.5, Math.min(art.clientHeight * 1.1, art.clientWidth * 2.1))
      : Math.max(art.clientWidth, art.clientHeight * 1672 / 941);
    plane.style.setProperty('--hero-art-width', `${artWidth}px`);
    start = hero.getBoundingClientRect().top + scrollY;
    lastProgress = -1;
    paint();
    stopScroll?.();
    if (!reduced.matches) stopScroll = scroll(paint, { target: hero, offset: ["start start", `${distance}px start`] });
  };
  const scheduleMeasure = () => {
    if (!layoutFrame) layoutFrame = requestAnimationFrame(measure);
  };

  // Set text states synchronously, avoiding a late visible-to-hidden flash.
  // Without JavaScript or with reduced motion the full copy remains readable.
  try {
    measure();
    hero.setAttribute('data-hero-text-ready', '');
    addEventListener('resize', scheduleMeasure, {passive: true});
    addEventListener('pageshow', scheduleMeasure);
    reduced.addEventListener('change', scheduleMeasure);
    document.fonts?.ready.then(scheduleMeasure);
    if ('ResizeObserver' in window) new ResizeObserver(scheduleMeasure).observe(stage);
  } catch {
    hero.removeAttribute('data-hero-text-ready');
    hero.removeAttribute('data-hero-pinned');
    return;
  }

  // Keep the original complete poster until the white tracing layers are ready.
  const source = new Image();
  source.src = 'images/hero-bg-clean.webp';
  source.decode().then(() => {
    hero.setAttribute('data-hero-ready', '');
  }).catch(() => {
    hero.removeAttribute('data-hero-ready');
  });
}

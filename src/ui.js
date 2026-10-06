import { tween, scroll, reduced } from './motion.js';

function disclosures(groupSelector, itemSelector, buttonSelector, panelSelector, openClass, readyAttribute, angle) {
  document.querySelectorAll(groupSelector).forEach(group => {
    const entries = [...group.querySelectorAll(itemSelector)].map(item => ({ item, button: item.querySelector(buttonSelector), panel: item.querySelector(panelSelector), control: null }));
    const setOpen = (entry, open, initial = false) => {
      entry.control?.stop();
      const current = entry.panel.getBoundingClientRect().height;
      entry.item.classList.toggle(openClass, open);
      entry.button.setAttribute('aria-expanded', String(open));
      entry.panel.setAttribute('aria-hidden', String(!open));
      entry.panel.inert = !open;
      const icon = entry.button.querySelector('.accordion-icon') || entry.button.lastElementChild;
      tween(icon, { rotate: open ? angle : 0 }, initial ? 0 : 0.4);
      if (initial) {
        entry.panel.style.height = open ? 'auto' : '0px';
        entry.panel.style.opacity = open ? '1' : '0';
        return;
      }
      entry.panel.style.height = `${current}px`;
      const height = open ? entry.panel.firstElementChild.scrollHeight : 0;
      entry.control = tween(entry.panel, { height: `${height}px`, opacity: open ? 1 : 0 }, 0.45, { onComplete: () => {
        if (entry.item.classList.contains(openClass)) entry.panel.style.height = 'auto';
      } });
    };
    entries.forEach(entry => {
      setOpen(entry, entry.item.classList.contains(openClass), true);
      entry.button.addEventListener('click', () => {
        const next = !entry.item.classList.contains(openClass);
        entries.forEach(other => { const open = other === entry && next; if (other.item.classList.contains(openClass) !== open) setOpen(other, open); });
      });
    });
    group.setAttribute(readyAttribute, '');
  });
}

export function initUI() {
  document.documentElement.classList.add('js');
  const nav = document.querySelector('.navbar');
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  const setMenu = (open, restore = false) => {
    if (!nav || !menu) return;
    nav.classList.toggle('menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', document.documentElement.lang === 'nl' ? (open ? 'Menu sluiten' : 'Menu openen') : (open ? 'Close menu' : 'Open menu'));
    if (open && links) tween(links, { opacity: [0, 1], y: [reduced.matches ? 0 : -6, 0] }, 0.22);
    if (restore) menu.focus();
  };
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav?.classList.contains('menu-open')) setMenu(false, true); });
  document.addEventListener('click', e => { if (nav && !nav.contains(e.target)) setMenu(false); });
  matchMedia('(min-width: 1025px)').addEventListener('change', () => setMenu(false));
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  disclosures('.accordion', '.accordion-item', '.accordion-btn', '.accordion-panel', 'active', 'data-accordion-ready', 180);
  disclosures('.faq-list', '.faq-item', '.faq-toggle', '.faq-answer', 'open', 'data-faq-ready', 45);

  for (const diagnostic of document.querySelectorAll('.growth-strip')) {
  const mobile = diagnostic.id === 'diagnostic-mobile';
  const stages = [...diagnostic.querySelectorAll('.diagnostic-step')];
  if (diagnostic && stages.length) {
    let manual = false;
    let current = -1;
    const select = (index, user = false) => {
      if (user) manual = true;
      if (index === current) return;
      current = index;
      tween(diagnostic, { '--path-progress': index / (stages.length - 1) }, 0.4);
      stages.forEach((button, i) => {
        button.classList.toggle('active', i === index);
        button.classList.toggle('reached', i <= index);
        button.setAttribute('aria-selected', String(i === index));
        button.tabIndex = i === index ? 0 : -1;
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        panel.hidden = i !== index;
        if (mobile && i === index) tween(panel, { opacity: [0, 1], y: [reduced.matches ? 0 : 6, 0] }, .3);
      });
    };
    stages.forEach((button, i) => {
      button.addEventListener('click', () => select(i, true));
      button.addEventListener('keydown', event => {
        const index = event.key === 'ArrowRight' ? (i + 1) % stages.length : event.key === 'ArrowLeft' ? (i + stages.length - 1) % stages.length : event.key === 'Home' ? 0 : event.key === 'End' ? stages.length - 1 : -1;
        if (index < 0) return;
        event.preventDefault(); select(index, true); stages[index].focus();
      });
    });
    select(0);
    if (!mobile) scroll(progress => {
      if (!manual && !reduced.matches) select(Math.min(stages.length - 1, Math.floor(progress * stages.length)));
    }, { target: diagnostic, offset: ['start 88%', 'start 28%'] });
    diagnostic.querySelector('.diagnostic-next')?.addEventListener('click', () => select((current + 1) % stages.length, true));

  }
  }
  disclosures('.mobile-redesign .outcome-strip-container', '.outcome-item', '.outcome-toggle', '.outcome-panel', 'open', 'data-outcomes-ready', 45);
  const redirect = document.querySelector('#audit-form [name="redirectTo"]');
  if (redirect && /^https?:$/.test(location.protocol)) redirect.value = new URL(document.documentElement.lang === 'nl' ? 'nl-thank-you.html' : 'thank-you.html', location.href).href;
  const quiz = document.querySelector('.quiz-container');
  if (quiz) {
    new MutationObserver(records => {
      records.forEach(({ target }) => {
        if (target.matches('.quiz-step.active,.quiz-thanks.show')) tween(target, { opacity: [0, 1], y: [reduced.matches ? 0 : 8, 0] }, 0.25);
      });
    }).observe(quiz, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }
}

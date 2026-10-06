(() => {
  const current = document.documentElement.lang === 'nl' ? 'nl' : 'en';
  // Explicit language URLs always win over a saved preference.
  try {
    if (location.pathname === '/' && localStorage.getItem('hys-language') === 'nl') {
      location.replace('nl-index.html' + location.search + location.hash);
    }
  } catch {}
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-language]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    try { localStorage.setItem('hys-language', link.dataset.language); } catch {}
    if (link.dataset.language !== current) location.assign(link.getAttribute('href') + location.search + location.hash);
  });
})();

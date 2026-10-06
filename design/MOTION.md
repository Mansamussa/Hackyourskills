# Motion implementation

All four routes load the locally bundled `site-motion.js`, built from `src/site.js` using Framer Motion 13.2.0's DOM API. No React conversion or external animation CDN is required. `npm ci` and `npm run build` reproduce the bundle from the committed lockfile.

- `hero.js` preserves the original eight-beat trace and copy timing. Framer Motion `scroll` supplies its progress. Resize measurement remains separate from animation.
- `motion.js` owns hover/press gestures, reversible viewport entrances and anchor scrolling. Reduced-motion changes complete active animations and reveal content.
- `ui.js` preserves menus, service/FAQ disclosures, diagnostic selection and form routing, with Motion-driven expansion and quiz entrances.
- `guide.js` owns the three full-width approach slides, tab/arrow navigation, touch swipes, image parallax and optional original diagnoses. No automatic slide advance.

The six approach WebP files are optimized versions of three generated editorial photographs. They depict illustrative fictional scenarios, not real customers or evidence of results.

`node scripts/check-guide.mjs` checks navigation and interrupted transitions with a DOM harness. Static checks cover routes, ARIA references, assets and CSS/JS parsing. No browser visual QA was performed for this update.

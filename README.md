# Hack Your Skills

Source and ready-to-publish website exported from HYS Modern Scroll, published version 57.

## Run locally

Requires Node.js and Python 3 available as `python`.

```sh
npm ci
npm run build
python -m http.server 8080 --directory dist
```

Open http://localhost:8080. The `dist` folder includes the published HTML, styles, images, and bundled animations; it can also be served directly without rebuilding.

## Hosting

Publish `dist` as the static website root. No hosting deployment is configured by this export. Existing form destinations, booking links, and canonical URLs are preserved; review them before changing domains. `site-config.json` defines the public and production origins.

Source snapshot: `cae8d6e14f35790194e9e084aff8d9f1013270ac`.

# Four Paths — Sekiro ending tracker

A checklist app for the four endings of Sekiro: Shadows Die Twice. Pick an ending and tick off each step in play order. Progress is saved in the browser.

## Files
- `index.html` – the app
- `support.js` – runtime (must sit next to index.html)
- `vendor/` – React 18.3.1 (production UMD builds, MIT). Bundled so the app doesn't need a CDN; `support.js` falls back to unpkg if they're missing
- `sw.js` – service worker so the app opens offline after the first visit (network first, cache as fallback)
- `manifest.json`, `apple-touch-icon.png`, `icon-512.png`, `icon-1024.png`, `favicon.png` – icons

## GitHub Pages
1. Upload all files to the repo root.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Open `https://<user>.github.io/<repo>/` in Safari → Share → Add to Home Screen.

# House History Pack — repair handoff

## Release repair

This repair addresses every finding in the independent verifier report for
candidate `3d5e19b73f11af62e82e2e1ace2b0d8b67b988e9`:

- Added the mandatory `.factory/claims.json` with six tagged regression tests.
- Added `/demo`: it seeds Juniper House (two systems, two records, two tasks,
  and a receipt) into `demo:house-history-pack`, never the real
  `house-history-pack` database.
- Added the first-screen **Try it with sample data** action, the persistent
  demo banner, Reset demo, and Start for real. Starting for real deletes the
  demo database before loading the empty real workspace.
- Added `.factory/demo.md`, README demo instructions, and the copy audit.
- Made the target user explicit on the first screen and added concise local,
  offline, and price facts.
- Added `robots.txt`, `sitemap.xml`, an original on-theme 404 page, and
  `staticwebapp.config.json` with SPA fallback, CSP, Permissions-Policy,
  manifest media type, immutable asset caching, and a revalidated service
  worker. The worker/manifest caches are versioned to v3/v2.

## Verification evidence

Run from a clean checkout:

```sh
npm ci
npm test
npm run build
npm audit --omit=dev
```

Completed on 2026-08-28:

- `npm ci` completed successfully.
- `npm test` passed: **6 Vitest tests** and **20 Playwright executions** (all
  desktop Chromium and 390 px mobile). It covers the established real workflow,
  PDF download, keyboard skip-link/dialog escape, service-worker offline
  reload, and axe serious/critical scans on both the real workflow and `/demo`.
- Every declared demo claim passed in both browser profiles: isolated/resettable
  demo data, offline reload, same-origin-only requests, PDF/ZIP exports,
  encrypted PBKDF2/AES-GCM backup envelope, and $29 one-time Pack Plus price
  with free exports enabled.
- `npm run build` passed and emitted `dist/index.html`. Initial app JavaScript
  is **45.74 KB** (14.55 KB gzip); CSS is **24.95 KB** (6.09 KB gzip). PDF and
  ZIP code remain lazy chunks. The 64.8 KB hero WebP remains below budget.
- `npm audit --omit=dev` reported **0 production vulnerabilities**.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo …` passed against a
  production preview: HTTP 200, title `Demo — House History Pack`, `lang=en`,
  exactly one h1, main landmark, zero images without alt text, no unlabeled
  buttons, and no console/page errors. The Playwright axe scan reported zero
  serious/critical violations.
- Production-preview review included desktop and 390 px mobile. The demo banner
  wraps above the phone dock, actions retain 44 px targets, and the existing
  reduced-motion policy remains covered by CSS.

## Deployment

Build command: `npm run build`
Publish directory: `dist/`

The repair source was pushed to `main` as
`c51e08b916fa4b34bac54d6fc4bf87e16c1a47e8`. The static host must publish
`dist/staticwebapp.config.json`; this supplies the SPA fallback and response
policy. At 2026-08-28 10:19 UTC the public hostname still served the preceding
artifact (`index-DsPIurQt.js`; `/robots.txt` was HTTP 404), so the factory's
static publication has not yet picked up the pushed commit. No deployment
command, host credential, or per-site host mapping is present in this
repository, and shared hosting infrastructure is deliberately out of scope.
On publication, verify deployed `/`, `/demo`, `/robots.txt`, `/sitemap.xml`,
`/manifest.webmanifest`, and `/404.html`, including the configured headers.

## Known limits

- The app intentionally supports one property and no cloud sync or contractor
  marketplace.
- Browser storage quotas vary; individual attachments are limited to 25 MB.
  Keep a tested encrypted backup.
- PDF text uses compact built-in fonts; non-Latin script remains intact in the
  app, JSON, and ZIP but is simplified in PDF output.

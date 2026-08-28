# House History Pack — polish round 3 handoff

## Status

Released repair commit: `7622e8266b287f122894a498c3a4e26a35399726`
(`fix: close mobile and demo metadata review findings`). It is deployed to
<https://house-history-pack.sociobot.in> through the static work-order command
`/opt/fleet/lib/deploy-static.sh house-history-pack dist`.

The repair keeps the local-first PWA, the IndexedDB demo namespace, the
archival glass visual system, and the static deployment class. It adds a
dedicated built `/demo` HTML shell, so crawlers receive demo metadata before
JavaScript runs. On phones, the three first-screen facts are lifted above the
fixed dock and covered by a geometry regression.

## Verification

### Clean clone

Clean clone: `/tmp/house-history-pack-polish-3-clean.K4uDGF`.

- `npm ci` completed with zero vulnerabilities.
- Every exact command declared in `.factory/claims.json` passed:
  `@claim:browser-local-storage`, `@claim:demo-isolated`,
  `@claim:offline-reload`, `@claim:local-only`,
  `@claim:portable-exports`, `@claim:encrypted-backup`,
  `@claim:pack-plus-price`, `@claim:maintenance-tracking`,
  `@claim:no-account-tracking`, and `@claim:license-verification`.
- `npm test` passed: 11 Vitest tests and 40 Playwright executions. The final
  Playwright record is `{"status":"passed","failedTests":[]}`.
- `npm run lint`, `npm run typecheck`, `npm run build`, and
  `npm audit --omit=dev --audit-level=high` passed. `dist/index.html` and the
  new `dist/demo.html` are present.

### Live deployment

- `/opt/fleet/lib/verify-url.sh` passed cold for `/` and `/demo`: HTTP 200,
  no console/page errors, `lang=en`, exactly one h1, a main landmark, no
  missing image alt text, and no unnamed buttons. Screenshots and reports:
  `/work/.evidence/house-history-pack-polish-3/live-root/` and
  `/work/.evidence/house-history-pack-polish-3/live-demo/`.
- Cold raw `GET /demo` returns title `Demo — House History Pack`, canonical
  `https://house-history-pack.sociobot.in/demo`, and matching Open Graph and
  Twitter metadata.
- The live route/Axe sweep at `/`, `/?demo=1`, `/demo`, `/privacy/`,
  `/terms/`, and `/not-a-real-route` recorded zero Axe violations. The final
  route report is `/work/.evidence/house-history-pack-polish-3/live-recheck.json`.
  The unknown route returns HTTP 404 with the designed 404 page.
- Cold 390 × 844 verification recorded all hero facts above the dock:
  702.6px, 730.1px, and 777.1px bottoms; dock top is 778px. Screenshot:
  `/work/.evidence/house-history-pack-polish-3/live-root/mobile-first-screen.png`.
- The live one-click `?demo=1` flow displayed Juniper House, the persistent
  demo banner, Water heater warranty, and a successful Reset demo state.
- Live Lighthouse mobile: Performance 100, Accessibility 100, LCP 1503ms,
  CLS 0, TBT 65ms. Raw result:
  `/work/.evidence/house-history-pack-polish-3/live-lighthouse.json`.

## Run locally

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/demo` to verify the built demo shell locally, or
open `/?demo=1` for the one-click sample flow.

## Known gaps

None. Every finding in `.factory/review-1.md`, `.factory/review-2.md`, and
`.factory/review-3.md` is mapped with evidence in `.factory/polish-3.md`.

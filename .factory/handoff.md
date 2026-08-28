# House History Pack — review-1 handoff

## Status

Reviewer-only documentation was added; product source, assets, deployment, and
configuration were not changed. The adversarial first-read review is **FAIL**
with one blocking and three minor findings in .factory/review-1.md.

## What was verified

- Fresh live desktop (1280 × 720) and mobile (390 × 844) first reads, demo
  entry, reset/start-real controls, offline reload, same-origin request
  capture, route links, metadata, and designed HTTP 404.
- Every command declared by .factory/claims.json from a clean clone:
  demo-isolated, offline-reload, local-only, portable-exports,
  encrypted-backup, pack-plus-price, maintenance-tracking,
  no-account-tracking, and license-verification.
- npm ci, npm test, npm run build, npm run typecheck, and npm run lint in the
  clean clone.

## Remaining work

1. Add and test a claims.json entry for the browser-local-storage promises
   (F-1-1).
2. Complete 404 and legal social metadata (F-1-2).
3. Apply the plain-language heading and README copy fixes (F-1-3, F-1-4).

## Re-run

    npm ci
    npm test
    npm run build
    npm run typecheck
    npm run lint

Open https://house-history-pack.sociobot.in/demo for the isolated sample.

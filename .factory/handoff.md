# House History Pack — polish-1 handoff

## Status

Released and verified. Repair commit
`c05194582fee68780ca319a0fde3be3269737b9b` is pushed to `main` and deployed
to <https://house-history-pack.sociobot.in>. Azure Static Web Apps deployment:
`d83614d4-5178-4908-8148-63e4db4944d7`.

The query demo URL is <https://house-history-pack.sociobot.in/?demo=1>; `/demo`
remains an equivalent short route. Demo records use `demo:house-history-pack`;
real records use `house-history-pack`.

## What changed

- Added a browser-storage/isolation claim and fresh-context proof.
- Made `?demo=1` the one-click demo destination while retaining `/demo`.
- Completed 404, Privacy, and Terms social metadata and made the 404 skip link
  target its focusable main landmark.
- Replaced the three vague landing labels and tightened README Pack Plus and
  test-summary copy.
- Added the required verb-first catalog description.

See `.factory/polish-1.md` for a finding-by-finding closure map.

## Verification

From `/work/repo`:

    npm run typecheck
    npm run lint
    npm run test:unit
    npm test
    npm run build

All passed. `npm test` reports 10 unit/release-contract checks and 37 browser
checks passing, with one browser-specific boundary case skipped in the mobile
project.

From fresh clone `/tmp/house-history-pack-clean` at the repair commit:

    npm ci
    npm run test:e2e -- --grep @claim:browser-local-storage
    npm run test:e2e -- --grep @claim:demo-isolated
    npm run test:e2e -- --grep @claim:offline-reload
    npm run test:e2e -- --grep @claim:local-only
    npm run test:e2e -- --grep @claim:portable-exports
    npm run test:e2e -- --grep @claim:encrypted-backup
    npm run test:e2e -- --grep @claim:pack-plus-price
    npm run test:e2e -- --grep @claim:maintenance-tracking
    npm run test:e2e -- --grep @claim:no-account-tracking
    npm run test:e2e -- --grep @claim:license-verification

Every exact claim command passed in both desktop Chromium and the 390 px mobile
project. They cover demo isolation, offline reload, same-origin privacy,
PDF/ZIP export, encrypted backup recovery, price/free exports, maintenance,
no-tracking, and license failure behavior.

Post-deploy, `verify-url.sh` passed for `/` and `/?demo=1`. Live Playwright
Axe reported zero violations for `/`, `/?demo=1`, `/privacy/`, `/terms/`, and
`/404.html`. An unknown live URL returned the designed page with HTTP 404.
Live mobile Lighthouse scored Performance 100 and Accessibility 100 (LCP 1202
ms, CLS 0, TBT 0). Evidence is in `.factory/evidence/polish-1/`.

## Known gaps and next steps

None. The product remains a static, offline PWA; deployment is handled by the
factory workflow.

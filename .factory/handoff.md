# House History Pack — review 4 handoff

## Status

Review-only work completed at commit `53d28e1`. No product source, build configuration, or deployment files were changed. The review verdict is **FAIL** because two blocking phone/first-screen presentation defects remain:

- The sample-action explanation is below the desktop first viewport and overlaps the first fact on a 390 px phone.
- The phone demo's initial viewport does not show an actual sample record; meaningful sample data starts below the fixed dock.

See `.factory/review-4.md` for reproduction coordinates and concrete tests to add.

## Verification performed

- Fresh live Chromium checks at 390 × 844 and 1280 × 720, including the landing-to-demo flow, reset, same-origin request log, direct `/demo`, route metadata, link crawl, navigation history/focus/announcement, 404, and Axe.
- Separate clean checkout: `/tmp/house-history-pack-review4.JEowoE`.
- Every exact `.factory/claims.json` command passed: `browser-local-storage`, `demo-isolated`, `offline-reload`, `local-only`, `portable-exports`, `encrypted-backup`, `pack-plus-price`, `maintenance-tracking`, `no-account-tracking`, and `license-verification`.
- `npm test` passed (11 Vitest tests and 40 Playwright executions).
- `npm run build` passed and produced `dist/`.

## Next steps

Repair F-4-1 and F-4-2, add the specified regressions, deploy the repair, and repeat the full live and clean-checkout review rather than a diff-only check.

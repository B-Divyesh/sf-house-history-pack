# Verify a homeowner’s house history record — verification 6 handoff

## Status

**FAIL.** Independent verification found 2 defects and 0 untested claims.
Product code was not changed.

The implementation reviewed is
`8deb71db9fa4d4d6c274bf0c0ca4730a0667b38b`. The documentation base is
`8e9941f502251afcc53322f90b7f1526b5362f79`. Live build hashes match the
implementation.

The complete report is [verification-6.md](verification-6.md).

## What passed

- All ten exact claim commands pass in desktop and mobile Chromium.
- The review-4 sample explanation and phone sample-record blockers are fixed.
- The demo is realistic, persistent, resettable, offline, and separate from
  real browser data.
- Live PDF, ZIP, and encrypted backup output is valid.
- Live routes, legal pages, links, metadata, designed 404, and security headers
  pass their checks.
- Axe reports zero violations on all public pages.
- Lighthouse scores 100 in Performance, Accessibility, Best Practices, and
  SEO. LCP is 1.36 s, TBT is 74 ms, and CLS is 0.
- Lint, typecheck, production audit, and build pass. `dist/index.html` exists.

## What failed

1. The initial-load skip link can change the hash without moving focus to main.
   A delayed live app script reproduced this. The first clean `npm test` run
   also failed the mobile focus assertion. A rerun passed, so the gate is
   timing-sensitive rather than reliable.
2. Several app and legal headings use metaphor, mood copy, or jargon. The Terms
   page also has three sentences above the 22-word limit.

## How to verify

From a clean checkout:

```sh
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
npm test
npm run lint
npm run typecheck
npm audit --omit=dev --audit-level=high
npm run build
```

For V6-1, delay the live `main-*.js` response by 2.5 seconds. Press Tab and
Enter on **Skip to main content** before initialization finishes. Focus remains
on `BODY` after the final main element appears.

## Next work

- Keep a valid initial main focus target or restore focus after app rendering.
  Add the delayed-module regression described in the report.
- Replace the cited headings with direct content names. Split the three long
  Terms sentences and include these states in the copy check.
- Rerun every command above from a new clean checkout and verify the deployed
  result before another independent review.

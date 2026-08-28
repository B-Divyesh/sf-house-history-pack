# House History Pack — review 3 handoff

## Status

Review completed without changing product code. Commit `review: add adversarial first-read review 3` contains only this handoff and `.factory/review-3.md`.

## Verification

- Fresh live Chromium checks at 390 × 844 and 1280 × 720.
- Clean clone: `npm ci`, all ten exact `.factory/claims.json` commands, `npm test`, `npm run build`, `npm run lint`, `npm run typecheck`, and production dependency audit passed.
- Live demo opened in one click, remained isolated, resettable, and offline-capable; its observed requests were same-origin only.
- Live route crawl, metadata/404 checks, and Axe scans of root, demo, privacy, terms, and 404 completed.

Run the local gates with:

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

## Known gaps

The review is **FAIL** with two minor findings:

1. At 390px, the fixed bottom dock covers the offline and Pack Plus facts in the landing hero.
2. Direct `/demo` raw and Open Graph metadata still identify the landing page.

See `.factory/review-3.md` for exact evidence and required regressions.

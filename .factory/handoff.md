# House History Pack — repair handoff

## Status

Repair of verifier candidate `e10878db45a6238a7924a51001973e08b4683fd6`.
This change repairs the release blockers and every high/medium/low finding in
`.factory/verification-3.md` without changing the researched job: a private,
portable house-service record PWA.

## What changed

- Pack Plus is now locked until the Sociobot billing endpoint has returned a
  positive verdict. A new, offline, or rate-limited arbitrary token cannot
  unlock it; a previously verified verdict still supports offline use.
- Mobile retains the footer, including **Import backup**, Privacy, and Terms.
  The hidden import control is inside the footer landmark.
- Service-worker updates wait for an explicit reload. The update listener
  retains the installing worker before it becomes `null`, then shows “A new
  version is ready. Reload”; Reload tells the waiting worker to skip waiting.
- History evidence is first fully validated, then the event and attachments are
  written in one IndexedDB transaction. A rejected mixed upload leaves no
  attachment behind.
- Backup import resets its file input after every attempt, so the same file can
  be retried after a wrong password. Malformed JSON now explains what to choose.
- View changes now use push-state, restore correctly with Back, focus the h1,
  update the title, and announce the view.
- Unknown static routes are configured to return the designed 404 instead of
  rewriting to the app. The manifest, metadata, footer skeleton, response
  headers, and package audit updates address the remaining release findings.
- The claims manifest now covers maintenance/repeating work, no-account/privacy
  guarantees, and license verification. Existing claim tests now inspect ZIP
  contents, exercise a full privacy flow, and complete encrypted restore.

## Regression coverage

`tests/e2e/app.spec.ts` includes exact reproductions for invalid offline/429
licenses, 390px backup/legal access, mixed 25 MB uploads, same-file encrypted
backup retry, malformed JSON, browser history/focus/announcement, and the
expanded claimed outcomes. `tests/utils.test.ts` reproduces the service-worker
`registration.installing` race. `tests/release-contract.test.ts` asserts the
static 404 and claim-tag contract. All declared claims have exactly one
`@claim:<id>` test and run from `/demo`.

## Verification — 2026-08-28

Completed from a clean dependency install:

```sh
npm ci                       # 159 packages, 0 vulnerabilities
npm test                     # 10 Vitest passed; 33 Playwright passed, 1 mobile-only boundary skip
npm run typecheck            # pass
npm run lint                 # pass
npm run build                # pass; dist/ produced
npm audit --omit=dev         # 0 vulnerabilities
npm audit --audit-level=high # 0 vulnerabilities
```

Browser coverage includes desktop Chromium and iPhone 13/390px profiles,
keyboard skip-link/dialog Escape, reduced motion, privacy request capture,
offline demo reload, PDF/ZIP/encrypted export and restore, route history, and
mobile touch-target checks. Axe integration found zero violations on `/`,
`/demo`, `/privacy/`, `/terms/`, and `/404.html`.

`verify-url.sh http://127.0.0.1:4173/demo` reported 200, title `Demo — House
History Pack`, `lang=en`, exactly one h1, a main landmark, zero images without
alt text, zero unlabeled buttons, and zero page/console errors.

Local mobile Lighthouse against the production build: Performance **100**,
Accessibility **100**, Best Practices **100**, SEO **100**; LCP **1.4 s**,
CLS **0**, TBT **0 ms**. Initial app JS is 47.74 KB (15.20 KB gzip), CSS is
25.12 KB (6.12 KB gzip), and the hero is 64 KB. PDF/ZIP code remains lazy.

The product is a private static PWA, not a package or backend service, so a
package-consumer test and backend identity/concurrency checks do not apply.

## Deploy and live evidence

Deploy target: Azure Static Web App `house-history-pack.sociobot.in`, static
`dist/` output. Commit, push, deployment, public response-policy, and live
artifact identity evidence are recorded below after the deployment step.

## Remaining limitations

No known product-QA blockers. Browser local storage can still be cleared by the
browser or device; the product continues to provide JSON and encrypted backups
for user-controlled recovery.

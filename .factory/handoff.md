# House History Pack — polish round 2 handoff

## Status

Complete. All findings in reviews 1 and 2 and the earlier verification reports
are repaired or rechecked as working. There are no known unresolved findings.

## Repair

- Commit: `f629cb4c36d1ca054100b06ad0ecf241656fbf71` (`fix: close landing review findings`), pushed to `main`.
- Deploy: Static Web Apps deployment `06b6d48e-9d2f-4db5-b16d-78a20aee521b` to <https://house-history-pack.sociobot.in>.
- Replaced the landing h1 with the homeowner job, aligned root title/social metadata, and retained the one-click `?demo=1` sandbox.
- Replaced metaphorical record headings; added the required three-step house-history-pack explanation; clarified the $29 Pack Plus boundary and its exact presentation features.
- Removed the untestable public image-provenance statement while preserving internal source provenance in `.factory/design.md`.
- Updated `.factory/claims.json`, its Pack Plus observable regression, the copy audit, catalog sentence, and local desktop/mobile evidence.

## How to run and verify

```sh
npm ci
npm test
npm run lint
npm run build
```

Every command named in `.factory/claims.json` was also run individually from a
fresh clone at `/tmp/house-history-pack-polish-2.LHaB44`; all passed. That
clone's last Playwright report is `{"status":"passed","failedTests":[]}`.

`npm run build` produces `dist/index.html`. The app's demo is
<https://house-history-pack.sociobot.in/?demo=1>; it is an isolated
`demo:house-history-pack` IndexedDB database with a persistent banner, Reset
demo, and Start for real controls.

## Evidence

- Full suite: 10 Vitest tests and 38 Playwright executions passed.
- Production build: initial app JS 48.55 KB (15.39 KB gzip), CSS 26.13 KB
  (6.29 KB gzip); the PDF/ZIP exporters stay lazy-loaded.
- Privacy/dependency: `npm audit --omit=dev --audit-level=high` reported 0
  vulnerabilities. Claim tests captured only same-origin requests in normal
  demo workflows.
- Offline: `@claim:offline-reload` passed using `context.setOffline(true)`
  after service-worker installation.
- Accessibility: the route Axe sweep on live `/`, `/?demo=1`, `/privacy/`,
  `/terms/`, and `/404.html` found 0 serious/critical issues. `verify-url.sh`
  found title, `lang=en`, one h1, a main landmark, alt text, named buttons,
  and no console/page errors.
- Live first screen: the root h1 is “Keep your home history ready to share.”;
  desktop action boxes are `605.5–653.5px` and `663.5–711.5px` in a 1280 ×
  720 viewport. The live 390px demo has no horizontal overflow.
- Live routing: Privacy and Terms return 200; `/not-a-real-route` returns 404.
- Screenshots and machine reports: `.factory/evidence/polish-2-local-first-screen.png`,
  `.factory/evidence/polish-2-local-mobile.png`, and
  `/work/.evidence/house-history-pack-polish-2-live-verify/`.

## Known gaps / next steps

None. The app remains a static, local-first PWA with no runtime AI feature,
account, tracking, cloud sync, or third-party font/script dependency.

# Independent verification — FAIL

**Candidate:** `3d5e19b73f11af62e82e2e1ace2b0d8b67b988e9`  
**Live URL:** https://house-history-pack.sociobot.in/  
**Verified:** 2026-08-28  
**Scope:** independent verifier; product code was not changed.

## Release decision

**FAIL — do not release.** The mandatory claims contract is absent and the
product has no one-click, isolated sample-data demo. Either condition is an
explicit release blocker in the work order.

## Required first checks

### Claims contract — BLOCKER

`.factory/claims.json` does not exist in the clean candidate. Therefore there
were no declared claim tests to run through the required demo entry point, and
no way to establish the required one-test-per-claim coverage. This also leaves
observable claims such as local/offline operation, privacy, PDF/ZIP export,
and encrypted backup unregistered. `.factory/demo.md` is also absent.

### Cold first read — BLOCKER

Fresh desktop and 390 px mobile contexts loaded the same screen, with no
console errors. It says that the product is a private property record that
keeps appliances, repairs, permits, warranties, and evidence together. The
only first action is **“Set up your home.”** There is no **“Try it with sample
data”** action, no description of what happens after such an action, no
sample data, and no persistent “Demo — sample data, nothing is saved” banner
with Reset/Start-for-real controls.

`/demo` returns the normal `index.html` (HTTP 200, 1,037 bytes) and starts an
empty real IndexedDB record, not a demo namespace. Repository search found no
demo/sample implementation. This independently fails the plain-words and
demo-sandbox acceptance conditions, regardless of the otherwise functional
application.

## Checks that passed

| Check | Fresh evidence |
| --- | --- |
| Clean install | `npm ci` completed; `npm audit --omit=dev` reported 0 production vulnerabilities. |
| Repository suite | `npm test` passed: 5 Vitest tests and 4 Playwright desktop/mobile executions (32.2 s). |
| Production build | `npm run build` passed and produced `dist/`. Initial app JS is 42,416 bytes / 13.36 KB gzip; CSS is 23,984 bytes / 5.92 KB gzip; the 435,389-byte PDF library and 97,148-byte ZIP library are lazy chunks; hero WebP is 64,782 bytes. |
| Deployment identity | SHA-256 matched every file in `dist/` to the corresponding live URL, including index, JS, CSS, service worker, legal pages, manifest, icons, and image. |
| Main job, live | In a clean browser: created Maple House, Water heater, a service event with a receipt, and a repeating task; downloaded `maple-house-pack.pdf`, `maple-house-pack.zip`, and an encrypted `.hhpack`. ZIP contained `house-history-report.pdf`, `records.json`, `evidence/...service-receipt.txt`, and `README.txt`. |
| Validation/recovery, live | Blank required home/asset fields remained invalid with “Please fill out this field”; cost `-1` was rejected by the `min=0` constraint; malformed backup showed “This backup is missing required records or uses an unsupported version.” IndexedDB was present and an asset survived reload. |
| Privacy, live | During the normal no-license flow, all captured browser requests were same-origin (`https://house-history-pack.sociobot.in`); no console/page errors occurred. Source inspection found only the documented Sociobot license API as a possible external origin. |
| PWA/offline, live | Service worker was active and controlling the page. After first load and reload, a fresh context set offline successfully reloaded the shell with `Your home, documented.` and `Offline & ready`. |
| Accessibility | Live 390 px axe scan: 0 serious/critical violations. Keyboard first Tab reaches Skip to main content; Enter focuses `#main`; the primary button has a visible 3 px aqua focus outline; a dialog initially focuses its field and Escape closes it. Reduced-motion context applies near-zero transition duration. |
| Performance smoke | Lighthouse 12 mobile output recorded Performance 91 and Accessibility 100, LCP 1.5 s, CLS 0, TBT 370 ms. The browser tab crashed during Lighthouse’s final screenshot, so this is useful telemetry, not a clean Lighthouse pass; axe and manual browser checks above completed cleanly. |
| API rate limit | The static product has no server endpoint. Against its documented invalid-token Sociobot verify endpoint, a 100-request concurrent burst received 24 × 200 and 76 × 429 with `Retry-After: 2`; a subsequent bucket-affected 50-request burst first returned 429 at request 2 with `Retry-After: 3`. Thus 429 protection is present; the shared API bucket prevents a stable per-product threshold measurement. |

## Defects by severity

### BLOCKER

1. **Required `.factory/claims.json` is missing.** No contract tests can be
   run from a clean demo sandbox, while product/README copy makes multiple
   reliance-worthy privacy, offline, export, and encryption claims.
2. **No one-click isolated sample-data demo.** Landing has no required button;
   `/demo` is empty real mode; no banner/reset/start-for-real controls,
   separate `demo:` storage namespace, shipped sample data, or demo
   documentation exists.

### HIGH

3. **Claims are unlisted and untestable under the required scheme.** In
   particular, visible “Private by default”, “Local & ready”, local export,
   and README offline/privacy/export claims have no `@claim:` test tied to a
   demo entry point. This is a direct consequence of defect 1 but must be
   resolved claim-by-claim before acceptance.

### MEDIUM

4. **Required public-site delivery artifacts are missing:** `/robots.txt` and
   `/sitemap.xml` both return HTTP 404; the repository has no
   `staticwebapp.config.json` or designed 404 route.
5. **Response policy/caching is incomplete.** Live HTML, JS, CSS, service
   worker, and manifest have only `Cache-Control: public, must-revalidate,
   max-age=30`; hashed assets are not immutable/long-lived. Headers include
   HSTS, Referrer-Policy, and X-Content-Type-Options, but no CSP or
   Permissions-Policy. `manifest.webmanifest` is served as
   `application/octet-stream` rather than a web-manifest media type.
6. **The first screen does not explicitly identify the target user in plain
   words.** It describes “your property,” but not homeowners preparing a
   durable handover/service record. The missing demo alone already makes this
   first-read test fail.

## Reproduction

```sh
npm ci
npm test
npm run build
```

For acceptance, add the claims file and tagged tests, then verify every listed
command from `/demo` or `?demo=1` in a fresh browser context. Implement the
sample sandbox before re-submitting; re-run the cold first-read and all claim
tests after deployment.

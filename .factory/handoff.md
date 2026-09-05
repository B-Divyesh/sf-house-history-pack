# House History Pack — repair 4 handoff

## Status

The two review-4 blockers are repaired and deployed. The implementation is
commit `8deb71db9fa4d4d6c274bf0c0ca4730a0667b38b`.

The job is to keep a homeowner's appliances, repairs, permits, warranties,
and evidence ready for a service visit or handover. The audience is homeowners
building that durable record. Before scrolling, the first action is **Try it
with sample data**.

The deployed static PWA is live at
<https://house-history-pack.sociobot.in>. Deployment
`197a0b40-1614-49bc-8377-ed2c89033238` succeeded. It reused the existing
single static-site product and did not add a backend, replica, account, or
external storage service.

## Repairs

- F-4-1: The sample explanation now has a reserved action-grid position. On
  desktop it sits beside the sample button; on phones it sits directly below
  that button and above the fact rail. The old translated mobile fact rail is
  removed. The desktop and phone regression measures every action, helper,
  and fact rectangle, checks the viewport/dock boundary, and rejects overlap.
- F-4-2: The first demo screen now contains a real sample record card:
  **Water heater** with its warranty date. It remains inside the phone viewport
  above the dock, beside the persistent **Demo — sample data, nothing is
  saved** label, Reset demo, and Start for real controls.
- The `demo-isolated` claim now checks that the one-click entry immediately
  shows the named asset and warranty, not only data after navigating away.
- `.factory/demo.md` and the copy audit describe the changed first screen.

## Verification

### Clean checkout

Clean checkout: `/tmp/house-history-pack-repair-4-clean` at implementation
commit `8deb71d`.

- `npm ci` passed with 0 audit vulnerabilities.
- Every exact command in `.factory/claims.json` passed from the demo entry
  point: `browser-local-storage`, `demo-isolated`, `offline-reload`,
  `local-only`, `portable-exports`, `encrypted-backup`, `pack-plus-price`,
  `maintenance-tracking`, `no-account-tracking`, and `license-verification`.
- `npm test` passed: 11 Vitest tests and 40 desktop/mobile Playwright runs.
- `npm run lint`, `npm run typecheck`, `npm audit --omit=dev --audit-level=high`,
  and `npm run build` passed. `dist/index.html` exists.
- Initial JavaScript is 49.28 kB (15.60 kB gzip) and CSS is 27.34 kB
  (6.53 kB gzip). PDF and ZIP code remains lazy loaded.

### Live HTTPS

- `/opt/fleet/lib/verify-url.sh` passed for `/` and `/demo`: title, `lang=en`,
  one h1, one main landmark, image alt text, named buttons, and no console or
  page errors. Evidence: `.factory/evidence/repair-4-live-root/` and
  `.factory/evidence/repair-4-live-demo/`.
- Fresh 1280 × 720 desktop: the sample action ends at y=477.4, its explanation
  ends at y=462.7, and all three facts end at y=609.9. None intersect.
- Fresh 390 × 844 phone: the helper ends at y=591.4; facts end at y=682.9,
  y=710.4, and y=757.4; the fixed dock begins at y=778. The one-click demo
  card ends at y=659.4. Screenshots are in the live evidence directories.
- The live sample flow showed the banner and Water heater warranty, Reset demo
  restored the sample, and a real `Live Cedar House` record remained unchanged
  after demo reset and Start for real. A demo PDF workflow made only
  same-origin requests.
- After service-worker installation, `/demo` reloaded offline with the banner
  and Water heater record. The existing browser suite also covers update
  notification/reload behavior.
- Playwright Axe found zero violations on `/`, `/demo`, `/privacy/`, `/terms/`,
  and `/404.html`. Reduced motion resolves to `0.001s` transition duration.
- Lighthouse mobile: Performance 100, Accessibility 100, LCP 1203 ms,
  CLS 0, TBT 0. Raw result:
  `.factory/evidence/repair-4-live-lighthouse.json`.
- The live index SHA-256 is
  `2816f6ce90383cd6c117d3ddf2f1df68db90502020b8a813685d27da80d568f4`,
  identical to local `dist/index.html`; both reference `main-BrT3_vqp.js`.
  `/not-a-real-route` returns the designed HTTP 404. Landing links, legal
  links, the manifest, robots, sitemap, and the Param Factory link returned
  expected 200 responses.

## Earlier finding disposition

| Earlier finding(s) | Current disposition and proof |
| --- | --- |
| F-1-1; V1-1 to V1-3; V3-1 | Fixed. The declared browser-storage, demo-isolation, local-only, export, encrypted-backup, maintenance, no-account, and license claim tests all pass from a clean checkout. |
| F-1-2; V1-4; V3-8, V3-9, V3-12, V3-13 | Fixed. Public-route metadata, history/focus announcements, headers, robots/sitemap, manifest/icons, and the intentional designed HTTP 404 remain in the complete route and live checks. |
| F-1-3, F-1-4; F-2-1 to F-2-5 | Fixed. The job-focused h1, concrete headings, paid boundary, three-step section, internal-only art provenance, and short copy remain in the copy audit and browser suite. |
| V1-5, V3-4 | Fixed. Demo offline reload and the service-worker update/reload path remain covered; live offline demo reload also passed. |
| V1-6; V3-3; V3-11; V4-1; V4-2 | Fixed. The audience, first actions, legal/import access, and 44 px control regressions remain in the browser suite; current first-screen coordinates are recorded above. |
| V3-2 | Fixed. The rate-limited/offline arbitrary-token claim keeps Pack Plus locked. The static app has no product backend; the optional Sociobot verification request only occurs after an explicit license action. |
| V3-5 to V3-7 | Fixed. Full tests retain atomic oversize-upload rejection, same-file password retry, and plain malformed-backup recovery. |
| V3-10 | Fixed. Clean `npm ci` and the production audit report 0 vulnerabilities. |
| F-3-1 and F-3-2 | Fixed. All phone facts clear the dock; the direct demo's static and rendered metadata remains covered by route tests. |
| F-4-1 | Fixed by the reserved helper/action layout and desktop/phone geometry regression. |
| F-4-2 | Fixed by the initial Water heater warranty card and the one-click phone demo visibility regression. |

## Known gaps and next steps

There are no known product defects from this repair. The product intentionally
has no account, cloud sync, contractor marketplace, home valuation, smart-home
controls, automated compliance advice, or runtime AI feature; those are out of
scope for the researched local-first history-pack job. The optional Sociobot
license verification remains the only external request and is not needed for
core records or exports.

The catalog description is plain, verb-first, and 61 characters long:
`Keep every home record ready for service calls and handovers.` It is copied to
`/work/.evidence/catalog-description.txt`.

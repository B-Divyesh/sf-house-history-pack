# Polish round 1 — cumulative finding closure

**Base reviewed:** `6d693d511de7e495abc492e1d35d93cdcc16afff`  
**Repair:** `c05194582fee68780ca319a0fde3be3269737b9b`  
**Live:** <https://house-history-pack.sociobot.in/?demo=1>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added the `browser-local-storage` claim and an observable fresh-context test. It writes a real home, enters `?demo=1`, changes and resets sample data, proves the two IndexedDB names are distinct, proves the real home is unchanged, and proves Start for real deletes the demo database. | `npm run test:e2e -- --grep @claim:browser-local-storage` passed from `/tmp/house-history-pack-clean`; live browser check preserved `Live Cedar House`; `.factory/evidence/polish-1/live-demo/screenshot-desktop.png`. |
| F-1-2 | Completed 404, Privacy, and Terms metadata: description, canonical, Open Graph type/title/description/url/image, and Twitter card/title/description/image. The 404 now has a skip link with a focusable main target. | Public-route metadata regression and live Axe scan passed for `/`, `/?demo=1`, `/privacy/`, `/terms/`, and `/404.html`; `.factory/evidence/polish-1/live-root/verify.json`. |
| F-1-3 | Rewrote the three context-dependent labels as “Keep your home history ready to share,” “Recent home history,” and “Upcoming tasks and warranties.” | `npm test` passed; updated word counts in `.factory/copy-audit.md`; live root screenshot at `.factory/evidence/polish-1/live-root/screenshot-desktop.png`. |
| F-1-4 | Split the Pack Plus sentence and test-summary sentence into short, plain sentences. | `.factory/copy-audit.md`; `npm test` passed. |
| V1-1 / V1-3 / V3-1 | Claims contract, demo sandbox, and all published reliance claims are present. Added the final browser-storage claim missing from review 1. | All ten exact commands in `.factory/claims.json` passed from a clean clone. |
| V1-2 | The landing action now opens the required `?demo=1` direct entry, with the existing `/demo` alias retained. Both choose `demo:house-history-pack`, seed Juniper House, show Reset demo and Start for real, and discard demo storage on exit. | `@claim:demo-isolated`, `@claim:offline-reload`, and `@claim:browser-local-storage` passed; live demo validator output has title, banner, and seeded record. |
| V1-4 / V1-5 / V3-8 / V3-9 / V3-12 / V3-13 | Public delivery remains complete: robots, sitemap, static-web-app config, restrictive headers, cache policy, real unknown-route 404, route titles/canonical/social cards, apple icon, and accessible history/focus announcement are covered by regression tests. Completed the remaining 404/legal Twitter fields in this repair. | `npm test`; live route/metadata/Axe check; `curl` returned HTTP 404 and designed content for `/not-a-real-route`; `.factory/evidence/polish-1/live-unknown.headers`. |
| V1-6 / V4-1 | The first screen identifies homeowners and keeps both first actions fully visible. | Live 1280×720 boxes: sample action `604.64–652.64 px`; setup action `662.64–710.64 px`; browser regression passed. |
| V3-2 | Pack Plus remains locked until verification succeeds, including offline and 429 outcomes. | `@claim:license-verification` passed in clean clone. |
| V3-3 / V3-11 / V4-2 | Footer/legal/import controls remain reachable on mobile; brand and cited controls meet the 44 px target. | Browser mobile regression passed; live Reset demo `83.36×44`, Start for real `111.25×46`. |
| V3-4 | Service-worker update notice and reload path remain covered. | Unit suite and full browser suite passed; offline reload claim passed. |
| V3-5 / V3-6 / V3-7 | Upload validation is atomic, same-file password retry works, and malformed JSON uses a plain recovery message. | Full `npm test` browser regressions passed. |
| V3-10 | Dependency remediation remains in the release lockfile. | Clean `npm ci` completed with 0 audit vulnerabilities; `npm test` and build passed. |

## Live evidence

- `verify-url.sh` passed for `/` and `/?demo=1`, with no console/page errors,
  one h1, a main landmark, `lang=en`, and no missing image alt text or unnamed
  buttons. Screenshots: `.factory/evidence/polish-1/live-root/` and
  `.factory/evidence/polish-1/live-demo/`.
- Playwright Axe had zero violations on all five public routes above.
- Mobile Lighthouse: Performance 100, Accessibility 100, LCP 1202 ms, CLS 0,
  TBT 0. Raw result: `.factory/evidence/polish-1/live-lighthouse.json`.

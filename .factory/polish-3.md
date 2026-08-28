# Polish round 3 — cumulative zero-finding closure

**Base reviewed:** `3127f5953f9038e3fdc8ee36b65eaf4f146f2dc4`  
**Repair commit:** `7622e8266b287f122894a498c3a4e26a35399726`  
**Live:** <https://house-history-pack.sociobot.in>  
**Evidence root:** `/work/.evidence/house-history-pack-polish-3/`

All findings in the three adversarial reviews and both prior polish records
were rechecked. “Evidence” names the focused test where one exists; the clean
clone ran every claim command and `npm test`, and the live recheck is
`live-recheck.json` unless another path is named.

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the explicit browser-local storage claim and real/demo IndexedDB namespace separation. | `@claim:browser-local-storage`; live `/?demo=1` reset check. |
| F-1-2 | Kept complete 404 and legal description, canonical, OG, Twitter, favicon, and footer metadata. | `public routes have complete titles…`; live `/privacy/`, `/terms/`, and 404 sweep. |
| F-1-3 | Kept the plain “Recent home history” and “Upcoming tasks and warranties” labels. | `npm test`; live root screenshot. |
| F-1-4 | Kept README price and test sentences below the 22-word cap. | `.factory/copy-audit.md`; clean-clone `npm test`. |
| F-2-1 | Kept the job-focused h1 “Keep your home history ready to share.” | `first actions and mobile first-screen facts…`; live root. |
| F-2-2 | Kept concrete home-record headings instead of “chapter” and “chain.” | `npm test`; live root. |
| F-2-3 | Kept the $29 fact with custom cover text and saved pack settings. | `@claim:pack-plus-price`; live root. |
| F-2-4 | Kept the semantic three-step house-history-pack section. | `first actions and mobile first-screen facts…`; live root. |
| F-2-5 | Kept AI-art provenance in the internal design record and out of public claim copy. | `npm test`; live root text check. |
| F-3-1 | Raised the mobile hero facts 52px as a single archival fact rail; all three now clear the fixed dock. | `first actions and mobile first-screen facts…`; `live-root/mobile-first-screen.png`; live bottoms 702.6/730.1/777.1px vs dock 778px. |
| F-3-2 | Added `demo.html`, a `/demo → /demo.html` static rewrite, dynamic canonical/OG/Twitter synchronization, and a static-preview server that tests the real rewrite. | `direct demo serves its own metadata without JavaScript`; raw live `GET /demo`; live `/demo` metadata sweep. |
| V1-1 | Retained a ten-entry claims contract with one tagged test per entry. | Clean-clone execution of all ten exact claim commands. |
| V1-2 | Retained one-click `?demo=1`, the demo namespace, banner, Reset demo, and Start for real. | `@claim:demo-isolated`; live demo flow. |
| V1-3 | Retained observable tests for every published reliance claim. | `.factory/claims.json`; clean-clone claim run. |
| V1-4 | Retained robots, sitemap, security policy, cache policy, and designed unknown-route 404. | `npm test`; live `/not-a-real-route` returns 404. |
| V1-5 | Retained offline-capable sample data after first visit. | `@claim:offline-reload`; full suite. |
| V1-6 | Retained a clear homeowner audience and visible first actions. | `first actions and mobile first-screen facts…`; live root. |
| V3-1 | Retained separate local-only, export, encrypted backup, tracking, and storage proofs. | Corresponding `@claim:` tests in clean clone. |
| V3-2 | Retained fail-closed license behavior for rate-limited or offline verification. | `@claim:license-verification`. |
| V3-3 | Retained mobile Privacy, Terms, and Import backup access. | `backup errors are plain and importing remains available at 390px`. |
| V3-4 | Retained service-worker update and reload coverage. | Full unit/browser suite; `@claim:offline-reload`. |
| V3-5 | Retained atomic mixed-upload rejection with no orphan attachment. | `mixed oversized evidence is rejected without leaving an orphaned file`. |
| V3-6 | Retained retry of the same encrypted backup after a wrong password. | `@claim:encrypted-backup`. |
| V3-7 | Retained the plain malformed-JSON recovery message. | `backup errors are plain and importing remains available at 390px`. |
| V3-8 | Retained hash-history navigation, h1 focus transfer, and polite announcements. | `section navigation preserves history, moves focus, and announces the view`. |
| V3-9 | Retained the designed real HTTP 404. | `public routes have complete titles…`; live `/not-a-real-route`. |
| V3-10 | Retained resolved production dependencies. | Clean `npm ci`; `npm audit --omit=dev --audit-level=high`. |
| V3-11 | Retained 44px mobile targets for brand, demo actions, and Edit controls. | `first actions and mobile first-screen facts…`. |
| V3-12 | Kept metadata on every public route and added raw direct-demo metadata, not merely client-side title updates. | `direct demo serves its own metadata without JavaScript`; live route sweep. |
| V3-13 | Retained manifest, icons, and install links; advanced the cache/start URL version with this PWA release. | `npm test`; `dist/manifest.json`; offline claim. |
| V4-1 | Retained desktop first-screen action visibility at 1280 × 720. | `first actions and mobile first-screen facts…`. |
| V4-2 | Retained 44px demo and timeline Edit controls on mobile. | `first actions and mobile first-screen facts…`. |

## Final evidence

- Clean clone `/tmp/house-history-pack-polish-3-clean.K4uDGF`: all ten exact
  claim commands, `npm test` (11 Vitest / 40 Playwright), lint, typecheck,
  build, and production dependency audit passed.
- Live `/`, `/?demo=1`, `/demo`, `/privacy/`, `/terms/`, and designed 404 all
  have one h1, a main landmark, expected titles/canonicals/OG fields, no
  console errors (apart from the browser’s expected navigation-status message
  for the intentional 404), and zero Axe violations.
- `/demo` raw HTML now identifies Demo before JavaScript. The query sample
  still opens in one click and canonicalizes to the shareable `/demo` shell.
- Lighthouse mobile is 100 Performance / 100 Accessibility; LCP is 1503ms,
  CLS 0, and TBT 65ms.

# Independent verification 5 — PASS

**Candidate:** `5206545b92d4c0b0ed0be25c2afe0a0258cc50d5`  
**Live URL:** <https://house-history-pack.sociobot.in>  
**Verified:** 2026-08-28 UTC  
**Scope:** clean-checkout independent QA; no product source changed.

## Release decision

**PASS.** The candidate meets the researched brief and the release contract.
The previous first-screen and mobile touch-target findings are repaired.

## Cold first read

The cold page says **“Your home, documented.”** It says it is for homeowners
building a durable service and handover record, keeping appliances, repairs,
permits, warranties, and evidence together. The first action is plainly
labelled **“Try it with sample data”**. At 1280 × 720 its box is
`x=276.2, y=604.6, 209.6 × 48`; the real first action is also fully visible at
`y=662.6`. One click opens `/demo` with a persistent “Demo — sample data,
nothing is saved” banner, Reset demo, and Start for real.

## Claims contract

`.factory/claims.json` exists and contains nine claims. After `npm ci`, every
exact declared command was run through the shipped `/demo` entry point and
passed in Chromium and the 390 px mobile project.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolated` | PASS | `/demo` uses `demo:house-history-pack`, seeds Juniper House, and resets temporary records. |
| `offline-reload` | PASS | Sample banner and Water heater warranty reload offline. |
| `local-only` | PASS | Create-and-export demo flow makes only same-origin requests. |
| `portable-exports` | PASS | PDF begins `%PDF-`; ZIP includes PDF, JSON, README, and receipt evidence. |
| `encrypted-backup` | PASS | PBKDF2-SHA256/AES-GCM backup rejects a wrong password and restores with the correct one. |
| `pack-plus-price` | PASS | One-time $29 copy is present; PDF/ZIP remain enabled. |
| `maintenance-tracking` | PASS | Warranty is visible and completing a repeat schedules the next occurrence. |
| `no-account-tracking` | PASS | No account, CDN, analytics, cloud-sync, or tracking request in demo flow. |
| `license-verification` | PASS | Arbitrary tokens stay locked for both 429 and offline verification. |

## Clean checkout and functional tests

- `npm ci`: PASS — 159 packages installed; zero audit vulnerabilities.
- `npm run test:unit`: PASS — 10 tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: PASS — 10 Vitest tests plus 36 Playwright desktop/mobile tests;
  `test-results/.last-run.json` records `status: "passed"` with no failures.
- `npm run build`: PASS; generated `dist/`.
- `npm audit --omit=dev --audit-level=high`: PASS — zero vulnerabilities.

The browser suite covers normal record creation with evidence and selected PDF
export; 25 MB + 1 byte attachment rejection without an orphaned file;
malformed-backup recovery; wrong-password encrypted restore; repeating tasks;
license failures; routing; keyboard Escape; and desktop/mobile regressions. A
separate live demo check added an asset with warranty details and built a ZIP
without console errors.

## Deployment, PWA, privacy, and accessibility

- Fresh local production output exactly matches live SHA-256 for `index.html`,
  app JS, CSS, and `sw.js`. HTML hash:
  `4fb6600f6877a9086f3c69d7fdf31e1c1620fbeff0851b676964cfcc7a06b0c3`.
- Live `/demo` reloads offline with its demo banner, seeded warranty, “Offline
  & ready,” and an active service-worker controller. The installed-replacement
  update notification behavior is covered by the passing unit test.
- At 390 × 844: Reset demo is `83.4 × 44`, Start for real `111.3 × 46`, and
  Edit `44 × 44`; there is no horizontal overflow. Reduced motion yields `0s`
  animation. Tab reaches skip link and Enter moves focus to main.
- `verify-url.sh` passed live `/demo`: HTTP 200, title, `lang=en`, one h1,
  main landmark, zero missing image alts/unnamed buttons, and no page or
  console errors. Evidence: `.factory/evidence/verification-5-live/`.
- Playwright Axe found zero violations on live `/`, `/demo`, `/privacy/`,
  `/terms/`, and `/404.html`. The standalone axe CLI could not launch its
  Selenium Chrome binary in this container; repository-pinned Playwright Axe
  was used instead.
- Normal demo requests were all same-origin. There is no sign-in, analytics,
  advertising, cloud sync, runtime AI, or CDN font. The only designed
  off-origin request is explicit license verification to `api.sociobot.in`.
- `/`, `/demo`, and `/sw.js` are no-cache; hashed assets are one-year
  immutable. CSP, HSTS, `nosniff`, strict-origin referrer policy, and a
  restrictive Permissions-Policy are present. Unknown routes return designed
  404 with HTTP 404.
- The standalone manifest includes 192 px, 512 px, and maskable icons. No
  account exists, so Entra verification is not applicable.

## Rate limit and performance

A concurrent burst of 50 unique invalid calls to the optional Sociobot license
verify endpoint returned **30 × 200** and **20 × 429**. Every observed 429 had
`Retry-After: 2`; accepted burst threshold: 30.

Exact production build output: initial app JS **47.74 KB** (15.20 KB gzip) and
CSS **25.20 KB** (6.13 KB gzip). Export chunks are lazy-loaded; assets/fonts
are self-hosted. These meet the static-PWA JavaScript and CSS budgets.

## Defects by severity

None found. Verification-4’s desktop first-action blocker and mobile
touch-target medium finding are resolved.

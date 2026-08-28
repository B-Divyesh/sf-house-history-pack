# Independent verification 4 — FAIL

**Candidate:** `797caede1034c1afe63181fcfebcdeaafed183d9`  
**Live URL:** <https://house-history-pack.sociobot.in>  
**Verified:** 2026-08-28 UTC  
**Scope:** clean-checkout, independent QA. No product code was changed.

## Release decision

**FAIL — do not release this candidate unchanged.**

All declared claim tests and repository quality gates pass. The live files are
byte-identical to a fresh candidate build, and the core local-first PWA flow
works. The candidate nevertheless fails the explicit first-screen acceptance
rule: its required one-click demo action is below a standard desktop viewport.

## Mandatory checks

### Claims contract

`.factory/claims.json` exists and contains nine claims. After `npm ci`, I ran
every exact command named in it from the shipped demo entry point. All nine
completed successfully; the same tagged tests were also part of the passing
full Playwright run.

| Claim | Result | Evidence |
| --- | --- | --- |
| `demo-isolated` | PASS | `/demo`, `demo:house-history-pack`, and reset behavior asserted. |
| `offline-reload` | PASS | Demo banner and seeded warranty reload offline after first visit. |
| `local-only` | PASS | Normal create/export sample flow made only same-origin requests. |
| `portable-exports` | PASS | PDF magic is `%PDF-`; ZIP has PDF, JSON, README, and receipt evidence. |
| `encrypted-backup` | PASS | PBKDF2/AES-GCM envelope, wrong-password rejection, and restore asserted. |
| `pack-plus-price` | PASS | $29 one-time copy and free PDF/ZIP controls asserted. |
| `maintenance-tracking` | PASS | Warranty and repeating task schedule are asserted. |
| `no-account-tracking` | PASS | No account, CDN, or tracking request in the demo flow. |
| `license-verification` | PASS | Arbitrary tokens remain locked on 429 and offline verification. |

### Cold first read

The landing copy clearly says what it does (a durable service and handover
record), for whom (homeowners), and it has **Try it with sample data**. That
button opens the isolated Juniper House demo in one click.

It still **fails on desktop**: in a fresh live 1280 × 720 viewport, the sample
button's box was `x=292, y=801.7, 209.6 × 48`; **Set up your home** began at
`y=859.7`. Neither first action is visible without scrolling. At 390 × 844,
the sample button is visible at `y=539.1`; this does not satisfy the desktop
first-screen requirement.

## Clean gates

| Gate | Result |
| --- | --- |
| Candidate checkout | Clean at the tested commit before verifier documentation. |
| `npm ci` | PASS — 159 packages installed; audit reported 0 vulnerabilities. |
| Nine claims commands | PASS. |
| `npm test` | PASS — 10 Vitest tests and 34 scheduled Playwright desktop/mobile executions; final status `passed`. |
| `npm run typecheck` | PASS. |
| `npm run lint` | PASS. |
| `npm run build` | PASS; produced `dist/`. |
| Production and full high-severity audit | PASS — 0 vulnerabilities. |

Build output: initial app JS 47.74 KB / 15.20 KB gzip, CSS 25.12 KB / 6.12 KB
gzip, no downloaded fonts, hero WebP 64.8 KB. The PDF and ZIP libraries are
lazy-loaded.

## Product, deployment, and PWA evidence

- Locally built `index.html`, app JS, CSS, and `sw.js` exactly matched their
  live responses by SHA-256; the live deployment is this candidate.
- Direct live QA created a home, asset, local-invoice service record, and ZIP.
  The ZIP was `verifier-house-pack.zip` and contained the history record and
  invoice evidence. A blank asset form failed required-field validation.
- The full suite also passed 25 MB+ evidence rejection, malformed-backup
  recovery, repeated task scheduling, encrypted backup, and license cases.
- Live `/demo` gained a service-worker controller and reloaded offline with its
  banner, seeded warranty, and **Offline & ready** intact. Using a temporary
  copy of exact `dist/`, a changed worker triggered **A new version is ready.
  Reload** and Reload successfully changed controller.
- `/opt/fleet/lib/verify-url.sh` passed live `/demo`: HTTP 200, 726 ms, title,
  `lang=en`, one h1, main landmark, zero missing image alts, zero unnamed
  buttons, and no console/page errors.
- Axe found zero serious/critical issues on `/`, `/demo`, `/privacy/`,
  `/terms/`, and `/404.html`. Keyboard testing reached skip/main, showed the
  solid aqua focus ring, reached Add record, opened it with Enter, and closed
  it with Escape. Reduced motion removed animation; 390 px had no horizontal
  overflow.
- Lighthouse 12.8.2 live mobile: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, CLS 0, TBT 80 ms, 119 KiB.
- The manifest is standalone with 192, 512, and maskable 512 icons. No sign-in
  exists, so Entra tenant verification is not applicable.

## Privacy, policies, and rate limiting

- Captured normal demo requests, including local creation and PDF/ZIP export,
  were all same-origin. The only designed off-origin request is optional,
  explicit Sociobot license verification. No analytics, ads, cloud sync, CDN
  font, or Azure AI call is present.
- Live headers include CSP, HSTS, nosniff, strict-origin referrer policy, and
  Permissions-Policy. `/`, `/demo`, and `/sw.js` are no-cache; hashed assets
  use one-year immutable caching. Unknown routes return the designed 404 with
  HTTP 404. Discovered non-mail links returned 200.
- A concurrent burst of 50 calls to the optional license verify endpoint gave
  30 × 200 then 20 × 429. Every 429 had `Retry-After: 2`; observed accepted
  burst threshold: 30.

## Defects by severity

### BLOCKER

1. **The required demo action is not in the desktop first screen.** At the
   independently tested 1280 × 720 live viewport, **Try it with sample data**
   begins 82 px below the viewport. This violates the explicit first-read rule
   requiring the cold first screen to immediately show what to do first.

### MEDIUM

2. **Several 390 px touch targets are below 44 × 44 px.** **Reset demo** is
   83 × 38, **Start for real** 111 × 40, and timeline **Edit** controls 34 ×
   44. These demo and record-editing targets violate the touch-target contract.

## Retest

Move both landing actions into the visible desktop hero (or reduce its vertical
demand) and make the cited controls at least 44 × 44 px. Then rerun all claim
commands, `npm test`, the production build, and the 1280 × 720 cold read.

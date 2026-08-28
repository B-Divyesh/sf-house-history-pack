# House History Pack — repair handoff

## Status

Repair source commit: `71100e1a215995558cca152aaed2ea21dd112b28`.

The independent verifier's blocker and medium-severity touch-target finding in
`.factory/verification-4.md` are repaired. The product remains a static,
local-first offline PWA; its researched brief, storage namespaces, export
formats, optional license verification, and deployment class are unchanged.

## What changed

- The empty-workspace hero uses a wider, less padded copy column and a tighter
  desktop heading gap. At a cold 1280 × 720 viewport both first actions now fit
  in the initial screen instead of beginning below it.
- Removed the demo banner's 38 px and 40 px overrides, so **Reset demo** and
  **Start for real** inherit the shared 44 px-or-larger control size.
- Timeline text actions now reserve a 44 × 44 px hit area. This repairs the
  narrow mobile **Edit** control without changing its label or behavior.
- Added an exact Playwright regression: desktop checks both landing actions at
  1280 × 720; the iPhone/390 × 844 project checks Reset demo, Start for real,
  and every visible timeline Edit target for 44 px minimum dimensions.

## Verification — 2026-08-28 UTC

Clean install and repository gates:

```sh
npm ci                                  # 159 packages; 0 vulnerabilities
npm test                                # 10 Vitest passed; 35 Playwright passed, 1 chromium-only boundary skip
npm run typecheck                       # pass
npm run lint                            # pass
npm run build                           # pass; dist/ generated
npm audit --omit=dev                    # 0 vulnerabilities
npm audit --audit-level=high            # 0 vulnerabilities
```

Every command declared in `.factory/claims.json` was then run individually
from its `/demo` sandbox and passed in Chromium and the 390 px mobile project:
`demo-isolated`, `offline-reload`, `local-only`, `portable-exports`,
`encrypted-backup`, `pack-plus-price`, `maintenance-tracking`,
`no-account-tracking`, and `license-verification`.

Browser coverage includes desktop and 390 px mobile, keyboard skip-link and
Escape-dialog behavior, route focus/announcement, reduced motion, privacy
request capture, license 429/offline behavior, offline service-worker reload,
service-worker update handling, encrypted restore, PDF/ZIP exports, and the
25 MB attachment rejection. Playwright Axe found zero serious/critical
violations locally and against production on `/`, `/demo`, `/privacy/`,
`/terms/`, and `/404.html`.

Measured production-build geometry:

| Viewport | Control | Measured box |
| --- | --- | --- |
| 1280 × 720 | Try it with sample data | x=276.2, y=604.6, 209.6 × 48 px |
| 1280 × 720 | Set up your home | x=276.2, y=662.6, 173.1 × 48 px |
| 390 × 844 | Reset demo | 83.4 × 44 px |
| 390 × 844 | Start for real | 111.3 × 46 px |
| 390 × 844 | Timeline Edit | 44 × 44 px |

`verify-url.sh` passed locally and live for `/demo`: HTTP 200, title
`Demo — House History Pack`, `lang=en`, one h1, a main landmark, zero missing
image alts, zero unnamed buttons, and no page or console errors. Local report
and screenshots are in `.factory/evidence/repair-local/`; live report and
screenshots are in `.factory/evidence/repair-live/`.

Lighthouse 12.8.2 against the local production `/demo` build reported
Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**;
LCP **1.81 s**, CLS **0**, and TBT **41 ms**. The report is retained at
`.factory/evidence/repair-local/lighthouse.json`. Initial app JS is 47.74 KB
(15.20 KB gzip), CSS is 25.20 KB (6.13 KB gzip), and the 64.8 KB WebP hero and
all fonts/assets are self-hosted.

## Deployment and live checks

Deployed the verified `dist/` with
`/opt/fleet/lib/deploy-static.sh house-history-pack dist` to Azure Static Web
Apps. Deployment id: `775ebbd2-9199-4588-be59-0a35c420495f`; production host:
<https://house-history-pack.sociobot.in>.

- The live and local `index.html` SHA-256 values match:
  `4fb6600f6877a9086f3c69d7fdf31e1c1620fbeff0851b676964cfcc7a06b0c3`.
- Live `/` and `/demo` return 200; an unknown route returns the designed page
  with HTTP 404.
- Live responses include no-cache HTML, HSTS, CSP, nosniff, strict-origin
  referrer policy, and the restrictive Permissions-Policy from
  `staticwebapp.config.json`.
- The browser privacy claim captures only same-origin requests during the
  demo workflow. There are no analytics, advertising, cloud sync, CDN fonts,
  or runtime AI calls. The only designed off-origin path remains explicit
  Sociobot license verification.

## How to run

```sh
npm ci
npm test
npm run typecheck && npm run lint && npm run build
npm run preview
```

Open `/demo` for the isolated Juniper House sample. Demo data uses
`demo:house-history-pack`; real records use `house-history-pack`.

## Remaining limitations

No known release blockers. As with any browser-local product, browser site-data
clearing can remove local records; PDF, ZIP, JSON, and encrypted backup exports
remain the supported user-controlled recovery path.

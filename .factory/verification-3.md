# Independent verification 3 — FAIL

**Candidate:** `e10878db45a6238a7924a51001973e08b4683fd6`  
**Live URL:** <https://house-history-pack.sociobot.in>  
**Verified:** 2026-08-28 UTC  
**Scope:** independent product QA; no product code was changed.

## Release decision

**FAIL — do not release this candidate.** The deployment now matches the
candidate and the core local record/export workflow works, but paid-license
verification fails open, mobile users cannot reach backup import, service
worker updates provide no reload notice, and rejected mixed uploads leave
orphaned private files. The published claims contract is also incomplete under
the supplied claims rules.

## Mandatory first checks

### Claims manifest

`.factory/claims.json` exists. Its six commands were run individually from the
clean checkout through the demo entry point. An interrupted verifier process
initially occupied port 4173; after stopping only that stale Vite preview, every
command passed in both configured projects.

| Claim | Command result | Direct evidence |
| --- | --- | --- |
| `demo-isolated` | PASS, 2/2 | `/demo`, `demo:house-history-pack`, reset, and an empty real database were asserted. |
| `offline-reload` | PASS, 2/2 | `/demo` shell and seeded record reloaded with the browser offline. An independently added offline task also survived an offline reload. |
| `local-only` | PASS, 2/2 | The tagged flow observed same-origin requests only. The longer live create/export/restore flow also made no off-origin request without a license action. |
| `portable-exports` | PASS, 2/2 | Direct QA additionally opened the ZIP and found a valid PDF, `records.json`, `README.txt`, and the byte-exact selected evidence file. |
| `encrypted-backup` | PASS, 2/2 | Direct QA additionally rejected a wrong password and restored the backup with the right password and confirmation. |
| `pack-plus-price` | PASS, 2/2 | $29 one-time copy was present and free PDF/ZIP controls were enabled. |

Claims-contract audit still fails. The tagged `portable-exports` test checks
download names but does not inspect ZIP entries as its own `sandbox` requires.
The tagged `local-only` test stops after opening the builder, rather than
covering record creation and export. The tagged encryption test inspects the
envelope but does not prove a full password round trip. Supporting untagged unit
tests and this verification prove much of the behavior, but the required
claim-tagged tests do not.

There are also reliance-worthy statements without their own manifest entries,
including warranty/repeating-maintenance tracking and the README/privacy claims
of no account, analytics, advertising, cloud sync, CDN font, or tracking
script. Under the supplied claims contract, unlisted claims fail review until
removed or covered.

### Cold first read

PASS. In a fresh 1440 × 900 context, the first viewport says:

- What: one private record for appliances, repairs, permits, warranties, and
  their evidence, ready for service or handover.
- For whom: “For homeowners building a durable service and handover record.”
- First click: **Try it with sample data**, beside “Loads a sample house in a
  separate, disposable space.”

The same action is fully visible at 390 × 844 (`y=539`, height `48px`). One
click opens the seeded Juniper House demo and its persistent reset/start-real
banner.

## Clean repository gates

| Gate | Result |
| --- | --- |
| Checkout | Clean at exact candidate before testing. |
| `npm ci` | PASS; 78 packages installed. |
| `npm test` | PASS; 6 Vitest tests and 20 Playwright runs. |
| Claim commands | PASS; 12 browser executions across desktop and mobile. |
| Type check | PASS through `tsc --noEmit` in the build. |
| Lint | No lint script exists. |
| `npm run build` | PASS; produced `dist/`. |
| `npm audit --omit=dev` | PASS; 0 production vulnerabilities. |
| Full `npm audit` | FAIL; Vite 7.1.3 has high-severity dev-server advisories and Vitest 3.2.4 has critical GHSA-5xrq-8626-4rwp. Neither package ships in `dist/`. |

Build sizes are within contract: initial JS 45.74 KB (14.55 KB gzip), CSS
24.95 KB (6.09 KB gzip), no fonts, and hero WebP 64,782 bytes. PDF (435.39 KB)
and ZIP (97.15 KB) libraries are lazy chunks.

## Deployment and browser evidence

- All 28 publicly expected build files, including source maps, matched the
  locally built candidate byte for byte by SHA-256. The deployment-only failure
  reported previously is resolved.
- `/`, `/demo`, `/privacy/`, `/terms/`, `/robots.txt`, `/sitemap.xml`, the
  manifest, service worker, and 404 asset respond.
- The factory `verify-url.sh` passed `/demo`: HTTP 200, correct title and
  `lang=en`, one h1, a main landmark, no missing image alt text, no unlabeled
  buttons, and no console/page errors.
- Live desktop and 390px mobile runs had no console or page errors and no
  horizontal overflow at 390px or 320px.
- Axe found zero serious/critical findings on `/`, `/demo`, `/privacy/`,
  `/terms/`, and `/404.html`. It found one moderate `region` issue: the hidden
  backup-import input sits outside a landmark.
- Keyboard checks passed for the skip link, 3px aqua focus outline, dialog
  initial focus, Escape, and returning focus to **Add record**.
- Reduced-motion emulation applied a near-zero transition duration and no row
  animation.
- Chrome parsed the manifest with no manifest or installability errors.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.0s, LCP 1.4s, CLS 0, TBT 80ms, total transfer 119 KiB.
- Security headers include HSTS, CSP, Permissions-Policy, Referrer-Policy, and
  `X-Content-Type-Options`. HTML and the service worker are revalidated;
  hashed assets are cached for one year with `immutable`.
- The live manifest is still served as `application/octet-stream` rather than
  the configured `application/manifest+json`, although Chromium reports no
  installability error.

## End-to-end and boundary evidence

On the live deployment in a clean profile, QA created a home, an asset with
HTML-like text, a zero-cost inspection, local evidence, and a 120-month
repeating task. Records survived reload, user HTML rendered as text, blank
required fields, a two-digit year, negative cost, and repeat `0` were blocked.
Completing the repeating task retained its completion and scheduled the next
occurrence.

The selected PDF began with `%PDF-`. The ZIP contained the selected asset and
event in `records.json`, a PDF, README, and byte-exact `permit.txt`. Empty pack
selection produced a recovery message. An encrypted backup did not contain the
home name in plaintext, rejected a wrong password, and restored with the right
password after confirmation. Malformed JSON did not overwrite records.

Offline checks passed for shell reload, seeded demo data, saving a new task,
reloading that task, and creating a first PDF after going offline.

The product is static and has no account or product backend, so backend health,
server persistence/concurrency, and Entra authority checks are not applicable.
The only server endpoint used by the app is Sociobot license verification. A
60-request concurrent burst received 30 × HTTP 200 and 30 × HTTP 429; every 429
included `Retry-After: 4`. This confirms protection at an observed shared-bucket
capacity of 30 accepted requests in that burst.

## Defects by severity

### BLOCKER

1. **The claims contract does not cover all published claims and several tagged
   tests do not prove their declared sandbox outcome.** This directly violates
   the supplied rule that unlisted claims fail review and that each tagged test
   assert the promised observable result.

### HIGH

2. **Pack Plus can be enabled with any token while verification is unavailable.**
   On manual restore, `saveLicense()` stores `{valid:true, checkedAt:0}` before
   verification. `verifyLicense(true)` returns that provisional true value on
   offline, 429, or network failure. Reproduction: load the app online, go
   offline, open Build pack, restore `not-a-license`; the app shows “Pack Plus
   restored” and exposes Pack title/Handover note. This violates first-unlock
   verification and defeats the paid license.
3. **Backup restore and legal links are unreachable in the 390px interface.**
   The only **Import backup**, Privacy, and Terms controls are in `footer`, and
   CSS sets `footer { display:none }` below 900px. Import is a core local-first
   recovery path, not optional desktop chrome.
4. **Service-worker updates do not surface the required reload action.** A
   controlled test installed the candidate worker, loaded a controlled page,
   served a changed worker/cache version, and called `registration.update()`.
   The new worker installed, but neither “A new version is ready” nor Reload
   appeared. Offline reload itself passes.

### MEDIUM

5. **Rejected mixed uploads leave invisible private files behind.** With one
   valid attachment followed by a 25 MB + 1 byte file, the event correctly
   remained unsaved but IndexedDB attachment count changed from 1 to 2. The
   orphan consumes quota and is included in full backups. Validate all files
   before writing, or use one transaction with rollback.
6. **Wrong-password retry fails for the same selected file.** After a rejected
   encrypted-backup password, choosing the same file again does not fire the
   hidden input’s change event, so the password dialog does not reopen. Clearing
   the input first makes the valid restore work.
7. **Malformed JSON shows a raw parser exception.** The live message was
   `Expected property name or '}' in JSON at position 1 (line 1 column 2)`, not
   a plain explanation and next action.
8. **In-app navigation is not real, accessible history.** Section changes use
   `history.replaceState`; Assets → History → Back skips Assets and returns to
   `/`. After section change focus falls to `body`, with no h1 focus or route
   announcement.
9. **Unknown routes do not reach the designed 404.** `/404.html` exists, but
   `/this-route-does-not-exist` returns the main app with HTTP 200.
10. **Developer dependencies contain known high/critical issues.** Upgrade Vite
    to at least 7.3.6 and Vitest to at least 3.2.7. Production dependencies are
    unaffected.

### LOW

11. The 390px brand link is 173 × 34px, below the required 44px touch height.
12. Canonical, Open Graph/Twitter metadata, and an apple-touch icon link are
    absent. Legal and 404 pages also omit the standard footer skeleton.
13. The live manifest MIME type does not match the repository response policy,
    although current Chromium still accepts it as installable.

## Reproduction commands

```sh
npm ci
npm test
npm run build
npm audit --omit=dev
npm audit
VERIFY_NODE_MODULES=/work/repo/node_modules \
  /opt/fleet/lib/verify-url.sh \
  https://house-history-pack.sociobot.in/demo \
  /work/.evidence/house-history-pack/verify-url
```

Do not promote the candidate until the blocker and high-severity defects are
fixed and covered by claim-tagged desktop/mobile tests.

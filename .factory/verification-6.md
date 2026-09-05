# Verify a homeowner’s house history record — FAIL

**Verdict:** **FAIL**  
**Findings:** 2  
**Untested claims:** 0  
**Implementation reviewed:** `8deb71db9fa4d4d6c274bf0c0ca4730a0667b38b`  
**Documentation reviewed:** `8e9941f502251afcc53322f90b7f1526b5362f79`  
**Live URL:** <https://house-history-pack.sociobot.in>  
**Verified:** 5 September 2026 UTC

## Verdict

The review-4 layout and sample-record blockers are fixed. Every declared claim
command passes, and no claim is untested. The release still fails because two
new findings remain. The skip link can fail during initial loading, and some
public copy breaks the required plain-words rules.

No product code was changed during this verification.

## Job, audience, and first action

Before scrolling, the page describes one home-history record for appliances,
repairs, permits, warranties, tasks, and supporting files. It is for homeowners
who need that record for service work or a handover. The first action is
**Try it with sample data**.

At 1280 × 720, the sample action ends at y=477.4. Its explanation ends at
y=462.7. All three facts end at y=609.9. They are visible and do not overlap.

At 390 × 844, the explanation ends at y=591.4. The facts end at y=682.9,
y=710.4, and y=757.4. The fixed dock starts at y=778. The sample action,
explanation, and facts are visible and do not overlap.

## Findings

### MEDIUM — V6-1: The skip link loses focus while the app is opening

The raw HTML shows **Skip to main content** before the module finishes loading.
Its initial `<main>` has no `tabindex`. The module then replaces that element
with a new `<main tabindex="-1">`.

With the live main script delayed by 2.5 seconds, the first Tab focused the skip
link. Enter changed the URL to `#main`, but focus stayed on `BODY`. Focus still
remained on `BODY` after the app finished opening. A keyboard or screen-reader
user who acts during this window does not reach the main content.

This also affected the required clean gate. The first `npm test` run failed its
mobile keyboard test at `expect(page.locator('#main')).toBeFocused()`: 38 passed,
1 failed, and 1 was skipped by design. A rerun passed 39 with 1 designed skip.
The focused test passed 20 repeated runs after normal loading, confirming a
timing-sensitive failure rather than a permanent failure after load.

Fix the initial focus target or preserve focus when the app replaces the main
element. Add a regression that delays the app module and activates the skip
link before initialization completes.

### MINOR — V6-2: Some public headings and legal sentences are not plain enough

The main job title and the first screen pass. Other reachable states still use
metaphor, mood copy, or product jargon as headings:

- **Turn the calendar into a durable record.** in the empty Tasks view.
- **Proof over time** in History.
- **The primary artifact** and **Make the handover feel finished.** in Build pack.
- **A durable record, maintained by you.** as the Terms h1.

The Terms page also has three sentences of 23, 25, and 23 words. The supplied
plain-words contract sets a 22-word maximum and forbids metaphor or mood
headings on every page. These states are absent from the current copy audit.

The long sentences begin **Pack Plus is a $29 one-time license**, **To the
extent permitted by law**, and **Do not use the service to violate law**.

Replace the cited headings with direct names for their content. Split the three
long Terms sentences, then extend the copy check to these routes and empty
states.

## Declared claims

The clean checkout was `/tmp/house-history-pack-verify6.HG2SA4` at documentation
commit `8e9941f`. That commit contains the implementation from `8deb71d` plus
report-only evidence. `npm ci` installed 159 packages and found no
vulnerabilities.

Every exact command from `.factory/claims.json` passed in desktop Chromium and
the 390 px mobile project:

| Claim | Result | Observable check |
| --- | --- | --- |
| `browser-local-storage` | PASS | Real and demo IndexedDB records remain separate. |
| `demo-isolated` | PASS | One click seeds Juniper House, shows the Water heater, and resets the demo. |
| `offline-reload` | PASS | The demo banner and sample warranty survive an offline reload. |
| `local-only` | PASS | Record creation and PDF/ZIP export make only same-origin requests. |
| `portable-exports` | PASS | PDF header and ZIP contents, JSON, README, and receipt are checked. |
| `encrypted-backup` | PASS | AES-GCM backup rejects a wrong password and restores with the right password. |
| `pack-plus-price` | PASS | The $29 one-time price and free core exports are present. |
| `maintenance-tracking` | PASS | Warranty dates and the next repeating task are checked. |
| `no-account-tracking` | PASS | No account, analytics, ads, cloud sync, CDN font, or tracking request appears. |
| `license-verification` | PASS | Arbitrary tokens stay locked after 429 and offline responses. |

The landing page, app views, README, Privacy page, and Terms page were checked
for reliance claims. No unlisted or untested public claim was found.

## Clean checkout commands

| Command | Result |
| --- | --- |
| `npm ci` | PASS; 159 packages; 0 vulnerabilities. |
| Ten exact claim commands | PASS; 2 browser runs per claim. |
| First `npm test` | FAIL; V6-1, 38 passed, 1 failed, 1 designed skip. |
| Second `npm test` | PASS; 11 Vitest tests, 39 Playwright tests, 1 designed skip. |
| Mobile keyboard test with `--repeat-each=20` | PASS after normal loading. |
| `npm run lint` | PASS. |
| `npm run typecheck` | PASS. |
| `npm audit --omit=dev --audit-level=high` | PASS; 0 vulnerabilities. |
| `npm run build` | PASS; `dist/index.html` exists. |

The build emits 49.28 kB of initial JavaScript, 27.34 kB of CSS, and no web
font. Gzip sizes are 15.60 kB and 6.53 kB. PDF and ZIP code stays lazy loaded.

## Live product checks

- Fresh desktop and phone browsers show the required job, audience, sample
  action, explanation, and three facts before scrolling.
- One click opens the disposable Juniper House record. The banner remains
  visible, and the phone immediately shows **Water heater** and its warranty.
- The sample contains two assets, two history records, two repeating tasks,
  and the Northline service receipt.
- Reset removed a temporary sample record and restored the shipped sample.
  **Start for real** deleted the demo database and preserved the separately
  created **Verifier Cedar House** record.
- Live PDF, ZIP, and encrypted backup downloads completed. The PDF starts with
  `%PDF-`. The ZIP contains its PDF, `records.json`, `README.txt`, and the
  Northline receipt. The encrypted file contains no sample name in plaintext.
- Normal sample use and all three downloads made same-origin requests only.
  The optional checkout link returned an expected 303 to hosted checkout.
- `/demo` reloaded offline with the banner, Water heater record, and
  **Offline & ready** status. The service-worker replacement notice has unit
  coverage; no replacement worker was available on the unchanged live build.
- Keyboard navigation passes after normal load. Dialog focus, Escape, route
  focus, Back, and polite route announcements work. Reduced motion reports no
  animation, a near-zero transition, and automatic scrolling.
- Playwright Axe found zero violations on `/`, `/demo`, `/privacy/`, `/terms/`,
  and `/404.html`. Both factory URL checks passed with no console or page
  errors.
- All discovered links resolve. Mail links are explicit. The unknown route
  returns the designed page with HTTP 404. `/404.html` itself returns 200 as a
  direct asset, which is expected.
- Lighthouse mobile scores are Performance 100, Accessibility 100, Best
  Practices 100, and SEO 100. LCP is 1.36 s, TBT is 74 ms, and CLS is 0.
- This is a static PWA with IndexedDB storage. Backend tenant, restart,
  persistence, health, and server rate-limit checks do not apply. The optional
  license path is covered by its fail-closed 429 claim test.

## Earlier findings

| Earlier finding | Current disposition |
| --- | --- |
| V1-1, V1-3, V3-1, F-1-1 | Fixed. Ten declared, observable claims pass, including browser storage and demo separation. |
| V1-2 | Fixed. One-click demo entry, banner, reset, start-real, and separate database work live. |
| V1-4, V3-8, V3-9, V3-12, V3-13, F-1-2, F-3-2 | Fixed. Titles, metadata, history/focus announcements, manifest, icons, links, and designed 404 pass. |
| V1-5, V3-4 | Fixed. Offline demo reload passes; update-notice behavior remains covered by the unit test. |
| V1-6, V4-1, F-3-1, F-4-1 | Fixed. Desktop and phone geometry proves the actions, explanation, and facts remain visible without overlap. |
| V3-2 | Fixed. A 429 or offline verification result keeps Pack Plus locked. |
| V3-3, V3-11, V4-2 | Fixed. Mobile legal/import controls are reachable, and the cited controls meet their size checks. |
| V3-5, V3-6, V3-7 | Fixed. Oversize upload rollback, same-file password retry, and plain malformed-backup recovery pass. |
| V3-10 | Fixed. The clean install and production audit report no vulnerability. |
| F-1-3, F-1-4, F-2-1 to F-2-5 | Their cited landing and README defects remain fixed. V6-2 covers different app and legal copy. |
| F-4-2 | Fixed. The first phone demo screen shows the Water heater warranty above the dock. |
| Verification 5 findings | None were listed. Its passing paths still pass, apart from the newly exposed initial-load timing case. |

## Implementation and live files

The live build matches implementation commit `8deb71d`. Fresh local and live
SHA-256 values match for `index.html`, `sw.js`, `main-BrT3_vqp.js`, and
`main-CltwCXBf.css`. The live index hash is
`2816f6ce90383cd6c117d3ddf2f1df68db90502020b8a813685d27da80d568f4`.

Documentation commit `8e9941f` only adds evidence and handoff changes after
the implementation. It does not require a different product image.

## Evidence

- `/work/.evidence/verify6-desktop-cold.png`
- `/work/.evidence/verify6-phone-cold.png`
- `/work/.evidence/verify6-desktop-demo.png`
- `/work/.evidence/verify6-phone-demo.png`
- `/work/.evidence/verify6-juniper-pack.pdf`
- `/work/.evidence/verify6-juniper-pack.zip`
- `/work/.evidence/verify6-juniper-encrypted.hhpack`
- `/work/.evidence/verify6-lighthouse.json`
- `/work/.evidence/verify6-live-root/`
- `/work/.evidence/verify6-live-demo/`

## Required next work

Repair V6-1 and V6-2 without weakening their checks. Then run every claim
command and the full quality gates from a new clean checkout. Repeat the slow
initial-load keyboard check on the deployed build before requesting another
verification.

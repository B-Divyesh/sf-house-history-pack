# Adversarial first-read review 3 — FAIL

**Reviewed:** 2026-08-28 UTC  
**Live URL:** <https://house-history-pack.sociobot.in>  
**Method:** fresh Chromium contexts at 390 × 844 and 1280 × 720; clean clone
of `3127f5953f9038e3fdc8ee36b65eaf4f146f2dc4`; no product source changed.

## Verdict

**FAIL.** The product is clear, tryable, and honest in its core flow. All ten
declared claim commands passed from a clean clone. Two minor, reproducible
mobile/metadata defects remain. The requested acceptance standard is zero
findings.

## Cold first read

Before scrolling, I understood this as a local record for homeowners to keep
appliances, repairs, permits, warranties, and their evidence ready for a
service person or handover. It is for **“homeowners building a durable service
and handover record.”** I would first click **“Try it with sample data.”** The
page says it **“Loads a sample house in a separate, disposable space.”**

This passes the three-answer first-read test; it is not a blocking clarity
failure. The page loaded without console or page errors in either fresh
context. The h1 is **“Keep your home history ready to share.”**

## Findings

### MINOR — F-3-1: The mobile bottom dock covers two of the three required first-screen facts

**Quote / location:** Landing hero facts, live 390 × 844 viewport:
**“Works offline after the first visit”** and **“Pack Plus is $29 once for
custom cover text and saved pack settings.”**

**Evidence:** At `scrollY=0`, the fixed dock starts at y=778. The offline fact
occupies y=762.6–782.1, so its bottom is covered. The price fact occupies
y=790.1–829.1 and is entirely behind the dock. Only **“Stored on this device”**
is fully visible. The sample action remains visible at y=557.1–605.1.

**Why this fails:** The mobile first screen has the required job, audience, and
sample action, but not all three required plain privacy/offline/price facts.
A phone visitor must scroll before seeing the pricing boundary. This is a
landing-structure defect, not a clarity blocker.

**Concrete fix:** Reserve the bottom-dock height in the hero's first viewport,
or move/condense the facts so all three end above y=778 at 390 × 844. Add a
390px regression that asserts each `.hero-facts li` is entirely above the fixed
dock before scrolling.

### MINOR — F-3-2: The direct demo URL publishes landing metadata rather than demo metadata

**Quote / location:** `GET https://house-history-pack.sociobot.in/demo` returns
`<title>House History Pack — Keep home history ready</title>`, canonical
`https://house-history-pack.sociobot.in/`, Open Graph title **“House History
Pack — Keep home history ready”**, and Open Graph URL
`https://house-history-pack.sociobot.in/`.

**Evidence:** After JavaScript runs, the visible browser title becomes
**“Demo — House History Pack”**, but its canonical is
`https://house-history-pack.sociobot.in/?demo=1` while its `og:url` and
`og:title` still identify the landing page. Social crawlers and other
non-JavaScript consumers receive the raw landing metadata.

**Why this fails:** `/demo` is a real, documented entry point. Its title and
canonical/Open Graph identity do not consistently describe that route, so a
shared or indexed demo link is misidentified as the landing page.

**Concrete fix:** Serve a demo shell with raw title, canonical, description,
Open Graph, and Twitter metadata for `/demo` (or make `/?demo=1` the only
documented/canonical demo route and redirect `/demo`). Add a non-JavaScript
HTTP metadata regression for `/demo`, plus a browser assertion that route
metadata remains aligned after navigation.

## Copy audit

Counts use whitespace-separated words. This covers every visible landing
sentence, heading, fact, and user-facing action in the empty landing state,
plus every README sentence. Navigation-only labels, counts, and code commands
are included where a cold visitor can read them. No text exceeds 22 words;
there are no banned marketing adjectives, jargon findings, inconsistent terms,
or non-result-naming buttons. Claim-like product statements map to the listed
claim IDs below; no additional unlisted landing/README claim was found.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| House History Pack | 3 | pass |
| Add record | 2 | pass |
| Overview / Assets / History / Tasks / Build pack | 5 | pass |
| Home details | 2 | pass |
| A private record for your property | 6 | pass |
| Keep your home history ready to share. | 7 | pass |
| For homeowners building a durable service and handover record. | 9 | pass |
| Home overview | 2 | pass |
| Keep your home history ready to share | 7 | pass |
| Keep every home record together. | 5 | pass |
| Keep appliances, repairs, permits, warranties, and the evidence behind them together—ready for the next service call or handover. | 18 | pass |
| Try it with sample data | 5 | pass |
| Set up your home | 4 | pass |
| Loads a sample house in a separate, disposable space. | 9 | covered by `demo-isolated` |
| Stored on this device | 4 | covered by `browser-local-storage` |
| Works offline after the first visit | 6 | covered by `offline-reload`; F-3-1 visibility |
| Pack Plus is $29 once for custom cover text and saved pack settings | 13 | covered by `pack-plus-price`; F-3-1 visibility |
| Assets / History records / Open tasks / Evidence files | 8 | pass |
| Add appliances & systems / Log your first event / Seasonal & next-due work / Receipts, manuals & permits | 17 | pass |
| A clear path from receipt to record | 7 | pass |
| How to make a house history pack | 7 | pass |
| Add systems | 2 | pass |
| Name the appliances and systems you need to identify later. | 10 | pass |
| Log work and attach evidence | 5 | pass |
| Save repairs, service dates, permits, and the files behind them. | 10 | pass |
| Export a pack | 3 | pass |
| Choose the records to share, then download a PDF or ZIP. | 11 | covered by `portable-exports` |
| Recent home history / Recent history / View all history | 8 | pass |
| Add your first home record | 5 | pass |
| Record a service visit, repair, permit, inspection, or contractor note. | 10 | pass |
| Log history | 2 | pass |
| Upcoming tasks and warranties / Local & ready / Nothing urgent | 9 | pass |
| Due work and warranty dates will surface here. | 8 | covered by `maintenance-tracking` |
| Add a task | 3 | pass |
| Private by default | 3 | pass |
| Your records and files stay in this browser unless you export them. | 12 | covered by `browser-local-storage` |
| Private home records for service and handover. | 7 | pass |
| Privacy / Terms / Built by Param Factory / Import backup | 9 | pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| House History Pack is a local property ledger for homeowners preparing a durable service and handover record. | 17 | pass |
| It keeps appliance and system details, repairs, service visits, permits, contractor notes, warranties, seasonal work, and original evidence files together. | 20 | covered by storage, maintenance, and export claims |
| Keeps home, asset, history, task, and attachment records in this browser. | 11 | covered by `browser-local-storage` |
| Tracks warranty dates and upcoming or repeating maintenance. | 8 | covered by `maintenance-tracking` |
| Creates a PDF for selected assets, or a ZIP containing the PDF, structured JSON, and original evidence. | 17 | covered by `portable-exports` |
| Downloads a password-protected full backup. | 5 | covered by `encrypted-backup` |
| Works after the first visit when the network is disconnected. | 10 | covered by `offline-reload` |
| Pack Plus costs $29 once. | 5 | covered by `pack-plus-price` |
| It adds custom cover text and reusable pack settings. | 9 | covered by `pack-plus-price` |
| Core records and all exports stay free. | 7 | covered by `pack-plus-price` |
| The app provides record keeping, not legal, regulatory, safety, valuation, or building-compliance advice. | 13 | scope disclaimer; pass |
| Users are responsible for document rights and accuracy. | 8 | scope disclaimer; pass |
| Requirements: Node.js 20+ and npm. | 5 | setup instruction; pass |
| Open the local URL printed by Vite. | 7 | setup instruction; pass |
| No environment variables or external database are required. | 8 | setup instruction; pass |
| Billing verification uses the public Sociobot API only when a license is entered. | 13 | covered by `license-verification` |
| Playwright 1.58.2 is pinned because the factory image provides that browser version. | 12 | setup instruction; pass |
| npm test runs unit and browser checks. | 7 | test instruction; pass |
| It covers demo exports, backups, privacy, accessibility, and offline reload. | 10 | test instruction; pass |
| The production build command is npm run build; deploy the generated dist/ directory. | 13 | deployment instruction; pass |
| Its index.html is at the root. | 6 | deployment instruction; pass |
| Choose Try it with sample data or open ?demo=1. | 9 | covered by `demo-isolated` |
| Juniper House is a separate, disposable sample with systems, service history, due work, and a receipt. | 16 | covered by `demo-isolated` |
| The banner can reset it or discard it before opening the real workspace. | 13 | covered by `demo-isolated` and `browser-local-storage` |
| There is no account, analytics, advertising, cloud sync, CDN font, or runtime tracking script. | 14 | covered by `no-account-tracking` |
| Browser site-data controls can erase local records. | 7 | browser warning; pass |
| Unencrypted PDFs, ZIPs, and JSON backups may contain sensitive addresses, serial numbers, invoices, or permits. | 15 | safety warning; pass |
| See the in-product privacy policy and terms. | 7 | pass |
| MIT. / See LICENSE. | 3 | pass |

## Demo, sandbox, claims, and quality gates

One landing click opened `/?demo=1`. Its first screen already showed Juniper
House and a Water heater warranty, plus the persistent **“Demo — sample data,
nothing is saved”** banner, **Reset demo**, and **Start for real**. Reset
restored the shipped sample. In a fresh context, the demo used
`demo:house-history-pack`; real `house-history-pack` had no home records.
After service-worker installation, the demo reloaded offline with the banner
and warranty visible. Captured demo requests were only to
`https://house-history-pack.sociobot.in`.

Every exact command in `.factory/claims.json` passed in the clean clone:

| Claim ID | Result |
| --- | --- |
| `browser-local-storage` | PASS |
| `demo-isolated` | PASS |
| `offline-reload` | PASS |
| `local-only` | PASS |
| `portable-exports` | PASS |
| `encrypted-backup` | PASS |
| `pack-plus-price` | PASS |
| `maintenance-tracking` | PASS |
| `no-account-tracking` | PASS |
| `license-verification` | PASS |

`npm ci`, `npm test` (10 Vitest tests and 38 Playwright executions), `npm run
build`, `npm run lint`, `npm run typecheck`, and `npm audit --omit=dev
--audit-level=high` passed in that clean clone. The final Playwright record is
`{"status":"passed","failedTests":[]}`. Live Axe scans of `/`, `/?demo=1`,
`/privacy/`, `/terms/`, and `/404.html` returned no violations.

## Structure, routing, and visual check

The live root, query demo, `/demo`, privacy, terms, and 404 page each rendered
one h1, a main landmark, `lang=en`, description, canonical, social-card
fields, favicon, and no browser errors. Unknown routes return the designed
404 with HTTP 404. All discovered live links returned HTTP 200, except explicit
`mailto:` links. Back navigation, h1 focus, and the polite route announcement
are covered by the passing navigation test. The dark archival/glass interface
and original house-ledger art are distinct from a generic SaaS template.

F-3-2 is the remaining metadata-content exception: presence checks pass, but
the direct demo route's metadata identifies the landing page.

The brief's implied import/export leverage is present: JSON import/export,
encrypted backup, PDF, and ZIP with evidence. An AI feature is not required
for this local record and portable-pack task; no decorative AI feature or
provider key was found.

## Earlier-finding recheck

Each earlier finding was checked on the live site and against current source
or test coverage. None regressed.

| Earlier finding | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 | IndexedDB namespace and real/demo separation are asserted by `browser-local-storage`. | fixed |
| F-1-2 | 404, Privacy, and Terms have complete route metadata and social fields. | fixed |
| F-1-3 | Current labels say “Recent home history” and “Upcoming tasks and warranties.” | fixed |
| F-1-4 | README price and test sentences are under 22 words. | fixed |
| F-2-1 | Current h1 names the homeowner job. | fixed |
| F-2-2 | “Chapter” and “chain” were replaced by concrete record headings. | fixed |
| F-2-3 | Landing price includes its $29 boundary and named unlocks. | fixed |
| F-2-4 | A semantic three-step “How to make a house history pack” section exists. | fixed |
| F-2-5 | No public AI-art provenance claim remains. | fixed |
| V1-1 | Ten declared claims have matching tagged tests. | fixed |
| V1-2 | One-click sample, banner, reset, start-real, and namespace isolation work. | fixed |
| V1-3 | Published reliance claims have observable sandbox tests. | fixed |
| V1-4 | Robots, sitemap, headers, and designed unknown-route response are live. | fixed |
| V1-5 | Demo survives an offline reload after first visit. | fixed |
| V1-6 | Audience and both initial actions are visible in the checked viewports. | fixed |
| V3-1 | Local-only, export, backup, tracking, and storage claims pass separately. | fixed |
| V3-2 | Rate-limited/offline arbitrary license tokens stay locked. | fixed |
| V3-3 | Mobile legal and import controls are reachable. | fixed |
| V3-4 | Service-worker update coverage remains in the test suite. | fixed |
| V3-5 | Oversize mixed upload rejects without an orphaned attachment. | fixed |
| V3-6 | Same encrypted file can be retried after a wrong password. | fixed |
| V3-7 | Malformed backup error gives a plain recovery message. | fixed |
| V3-8 | Route history restores focus and announces the view. | fixed |
| V3-9 | Unknown routes return the designed HTTP 404. | fixed |
| V3-10 | Clean install audit reports no production vulnerability. | fixed |
| V3-11 | Checked mobile brand, demo, and Edit controls meet target sizing. | fixed |
| V3-12 | Root/legal/404 route metadata fields are present. | fixed |
| V3-13 | Manifest and PWA icons remain shipped. | fixed |
| V4-1 | Desktop initial actions remain visible. | fixed |
| V4-2 | Demo controls and Edit retain their mobile size regression. | fixed |

## What would make this perfect

Make all three first-screen facts visible above the mobile dock, correct the
direct demo route's raw and rendered metadata, and add the two focused
regressions described in F-3-1 and F-3-2. Then rerun the ten claim commands,
the full suite, build, and live route crawl.

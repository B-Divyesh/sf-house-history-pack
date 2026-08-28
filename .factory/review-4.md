# Adversarial first-read review 4 — FAIL

**Reviewed:** 2026-08-28 UTC  
**Live URL:** <https://house-history-pack.sociobot.in>  
**Method:** fresh Chromium contexts at 390 × 844 and 1280 × 720; separate clean checkout at `53d28e1`; no product source changed.

## Verdict

**FAIL.** The declared claims, routing, local-only demo storage, and previous finding repairs verify. Two blocking first-screen/demo presentation failures remain. The required standard is zero findings.

## Cold first read

Before scrolling, on both viewports, this reads as a local record for homeowners to keep appliances, repairs, permits, warranties, and supporting files ready for a service person or handover. It is for **“homeowners building a durable service and handover record.”** I would click **“Try it with sample data”** first.

That answers what it does, who it is for, and what to click. The page has one h1, no console/page errors, and the action is visible on both sizes. It still fails the first-screen contract because the adjacent explanation is not legible/visible as documented in F-4-1.

| Viewport | Sample action | Real action | Result |
| --- | --- | --- | --- |
| 390 × 844 | x=42, y=557.1, 209.6 × 48 px | x=42, y=615.1, 173.1 × 48 px | visible |
| 1280 × 720 | x=276.2, y=605.5, 209.6 × 48 px | x=276.2, y=663.5, 173.1 × 48 px | visible |

## Findings

### BLOCKING — F-4-1: The required explanation of the sample action is hidden on desktop and overlaps privacy copy on mobile

**Quote / location:** Landing helper below **“Try it with sample data”**: “Loads a sample house in a separate, disposable space.”

**Evidence:** At 1280 × 720, the helper begins at y=721.5, below the viewport; the real-action button ends at y=711.5. At 390 × 844, the helper occupies y=673.1–713.1 while the first fact, **“Stored on this device,”** occupies y=683.1–702.6. The two texts visibly render over one another.

**Why this fails:** The mandatory first screen puts a primary action beside a plain statement of what happens after it. Desktop visitors do not see that statement without scrolling. Phone visitors receive a collision between it and the storage fact, so neither is reliably readable. A visitor cannot clearly confirm that sample use is separate/disposable before entering it.

**Concrete fix:** Keep the helper and all three facts within the first viewport without overlap at both required sizes. Give the helper its own reserved block above the fact rail, or reduce/reflow the hero deliberately rather than using the current translated fact rail. Add a 390 px and 1280 × 720 regression that asserts the helper is fully in the viewport, does not intersect any fact, and the facts remain above the fixed dock.

### BLOCKING — F-4-2: The phone demo does not initially show realistic sample records

**Quote / location:** After the one-click mobile demo entry, the only visible sample-specific text is **“JUNIPER HOUSE”** and **“Your home records are ready to use.”** The promised sample records, such as **“Water heater warranty,”** are below the first screen.

**Evidence:** At 390 × 844, the first visible metric count starts at y=815.4 and is covered by the dock. “Replace heat-pump filter” is at y=2497.3 and “Water heater warranty” is at y=2645.3. The initial screen shows the banner, a home name, and decorative hero art, but no sample asset, history event, task, warranty, or evidence file.

**Why this fails:** The demo is isolated and does load realistic data, but the first screen after clicking must already show the product being used with that data. On a phone it instead resembles an empty welcome state. This is a weak demo under the required one-click sandbox rule.

**Concrete fix:** Put at least one concrete sample record in the initial mobile viewport—for example a Water Heater asset, its warranty date, or the Northline service receipt—while retaining the persistent demo banner. Add a mobile demo regression that clicks the landing action and asserts a named sample asset/event/task/evidence item is visible before scrolling.

## Copy audit

Counts are whitespace-separated words. All landing and README sentences, headings, facts, and visitor-facing action labels are included. No audited copy exceeds 22 words. No banned marketing adjective, inconsistent core term, context-free heading, or non-result-naming action was found. `Pack Plus` is defined beside its price; `evidence` is made concrete as receipts, manuals, and permits. The two findings above are layout/demo findings, not wording flags.

### Landing page

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| wordmark | House History Pack | 3 | pass |
| header action | Add record | 2 | pass |
| navigation | Overview / Assets / History / Tasks / Build pack | 5 | pass |
| navigation | Home details | 2 | pass |
| eyebrow | A private record for your property | 6 | pass |
| h1 | Keep your home history ready to share. | 7 | pass |
| audience | For homeowners building a durable service and handover record. | 9 | pass |
| label | Home overview | 2 | pass |
| hero label | Keep your home history ready to share | 7 | pass |
| hero h2 | Keep every home record together. | 5 | pass |
| hero body | Keep appliances, repairs, permits, warranties, and the evidence behind them together—ready for the next service call or handover. | 18 | covered by storage, maintenance, and export claims |
| action | Try it with sample data | 5 | pass |
| action | Set up your home | 4 | pass |
| helper | Loads a sample house in a separate, disposable space. | 9 | `demo-isolated`; F-4-1 layout |
| fact | Stored on this device | 4 | `browser-local-storage`; F-4-1 layout |
| fact | Works offline after the first visit | 6 | `offline-reload` |
| fact | Pack Plus is $29 once for custom cover text and saved pack settings | 13 | `pack-plus-price` |
| metric | Assets / Add appliances & systems | 5 | pass |
| metric | History records / Log your first event | 6 | pass |
| metric | Open tasks / Seasonal & next-due work | 5 | pass |
| metric | Evidence files / Receipts, manuals & permits | 5 | pass |
| eyebrow | A clear path from receipt to record | 7 | pass |
| h2 | How to make a house history pack | 7 | pass |
| step | Add systems | 2 | pass |
| step body | Name the appliances and systems you need to identify later. | 10 | pass |
| step | Log work and attach evidence | 5 | pass |
| step body | Save repairs, service dates, permits, and the files behind them. | 10 | pass |
| step | Export a pack | 3 | pass |
| step body | Choose the records to share, then download a PDF or ZIP. | 11 | `portable-exports` |
| eyebrow | Recent home history | 3 | pass |
| h2 / action | Recent history / View all history | 5 | pass |
| empty h3 | Add your first home record | 5 | pass |
| empty body | Record a service visit, repair, permit, inspection, or contractor note. | 10 | pass |
| action | Log history | 2 | pass |
| label | Upcoming tasks and warranties | 4 | pass |
| status / h2 | Local & ready / Nothing urgent | 5 | pass |
| status body | Due work and warranty dates will surface here. | 8 | `maintenance-tracking` |
| action | Add a task | 3 | pass |
| privacy label | Private by default | 3 | pass |
| privacy body | Your records and files stay in this browser unless you export them. | 12 | `browser-local-storage` |
| footer | Private home records for service and handover. | 7 | pass |
| footer links | Privacy / Terms / Built by Param Factory / Import backup | 8 | pass |

### README

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| title | House History Pack | 3 | pass |
| introduction | House History Pack is a local property ledger for homeowners preparing a durable service and handover record. | 17 | pass |
| introduction | It keeps appliance and system details, repairs, service visits, permits, contractor notes, warranties, seasonal work, and original evidence files together. | 20 | covered by storage, maintenance, and export claims |
| What it does | Keeps home, asset, history, task, and attachment records in this browser. | 11 | `browser-local-storage` |
| What it does | Tracks warranty dates and upcoming or repeating maintenance. | 8 | `maintenance-tracking` |
| What it does | Creates a PDF for selected assets, or a ZIP containing the PDF, structured JSON, and original evidence. | 17 | `portable-exports` |
| What it does | Downloads a password-protected full backup. | 5 | `encrypted-backup` |
| What it does | Works after the first visit when the network is disconnected. | 10 | `offline-reload` |
| What it does | Pack Plus costs $29 once. | 5 | `pack-plus-price` |
| What it does | It adds custom cover text and reusable pack settings. | 9 | `pack-plus-price` |
| What it does | Core records and all exports stay free. | 7 | `pack-plus-price` |
| scope | The app provides record keeping, not legal, regulatory, safety, valuation, or building-compliance advice. | 13 | disclaimer; pass |
| scope | Users are responsible for document rights and accuracy. | 8 | disclaimer; pass |
| development | Requirements: Node.js 20+ and npm. | 5 | pass |
| development | Open the local URL printed by Vite. | 7 | pass |
| development | No environment variables or external database are required. | 8 | pass |
| development | Billing verification uses the public Sociobot API only when a license is entered. | 13 | `license-verification` / `no-account-tracking` |
| test | Playwright 1.58.2 is pinned because the factory image provides that browser version. | 12 | pass |
| test | npm test runs unit and browser checks. | 7 | pass |
| test | It covers demo exports, backups, privacy, accessibility, and offline reload. | 10 | pass |
| deployment | The production build command is npm run build; deploy the generated dist/ directory. | 13 | pass |
| deployment | Its index.html is at the root. | 6 | pass |
| demo | Choose Try it with sample data or open ?demo=1. | 9 | `demo-isolated` |
| demo | Juniper House is a separate, disposable sample with systems, service history, due work, and a receipt. | 16 | `demo-isolated`; F-4-2 presentation |
| demo | The banner can reset it or discard it before opening the real workspace. | 13 | `demo-isolated` / `browser-local-storage` |
| privacy | There is no account, analytics, advertising, cloud sync, CDN font, or runtime tracking script. | 13 | `no-account-tracking` |
| privacy | Browser site-data controls can erase local records. | 7 | browser warning; pass |
| privacy | Unencrypted PDFs, ZIPs, and JSON backups may contain sensitive addresses, serial numbers, invoices, or permits. | 15 | safety warning; pass |
| privacy | See the in-product privacy policy and terms. | 7 | pass |
| license | MIT. / See LICENSE. | 3 | pass |

## Demo, sandbox, claims, and privacy

The visible landing action reached `/?demo=1` in one click. The live page showed the persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real**. Reset produced the announced **“Sample data reset.”** state. The direct `/demo` route served dedicated demo metadata before JavaScript.

A fresh live-browser request log during landing-to-demo use contained only same-origin requests: `/`, the product artwork, `main-BHEdHjDD.js`, `main-Cf7aiWmV.css`, and `/?demo=1`. The clean-checkout `@claim:browser-local-storage` test passed, including real/demo IndexedDB namespace separation; the demo's reset did not touch real data. The clean checkout's offline claim also passed after first visit.

All exact commands from `.factory/claims.json` passed in the separate clean checkout (`/tmp/house-history-pack-review4.JEowoE`):

| Claim id | Result |
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

`npm test` passed (11 Vitest tests and 40 Playwright executions) and `npm run build` passed in that checkout. The build emitted `dist/`, with an initial main JavaScript gzip size of 15.54 kB. No unlisted reliance claim was found in the landing or README copy audit.

## Structure, accessibility, and routing

The live `/`, `/demo`, `/privacy/`, `/terms/`, and `/not-a-real-route` routes were checked at 390 px. The first four returned 200; the unknown route returned the designed HTTP 404. Every checked route has one h1, one main, `lang=en`, a title, description, canonical, OG image, favicon, and no Axe violations. The expected 404 network-console message was the only error while checking the intentional missing route.

All discovered landing links returned 200, including the Param Factory link. The demo navigation changed to `/demo#assets`, moved focus to the h1, announced **“Assets view,”** and Back restored `/demo`, h1 focus, and **“Overview view.”** The archival dark-glass interface, custom house-ledger art, and mobile dock are visually distinct from a generic SaaS template. The brief's implied import/export leverage is present (backup import/export, encrypted backup, PDF, and ZIP evidence pack); no additional AI feature is required, and no runtime provider key was found.

## Earlier-finding recheck

Each earlier finding was observed on the live site and checked against current source or passing regression coverage. “Fixed” means verified repaired, not merely listed as repaired.

| Earlier id | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 | Declared browser-storage claim and fresh-context real/demo namespace test pass. | fixed |
| F-1-2 | 404 and legal pages publish description, canonical, OG, Twitter, and favicon fields. | fixed |
| F-1-3 | Labels are “Recent home history” and “Upcoming tasks and warranties.” | fixed |
| F-1-4 | README price/test sentences are below 22 words. | fixed |
| F-2-1 | The h1 names the homeowner job. | fixed |
| F-2-2 | Concrete record headings replaced “chapter” and “chain.” | fixed |
| F-2-3 | The landing price names $29 and its unlocks. | fixed |
| F-2-4 | The landing has a three-step house-history-pack section. | fixed |
| F-2-5 | No public AI-art provenance assertion remains. | fixed |
| F-3-1 | All three facts are above the 390 px dock (last bottom y=777.1; dock top y=778). | fixed |
| F-3-2 | Raw `/demo` metadata identifies Demo and uses `/demo` canonical/OG URL. | fixed |
| V1-1 | Ten declared claims each have tagged browser coverage. | fixed |
| V1-2 | One-click query demo, banner, reset, start-real, and demo namespace work. | fixed |
| V1-3 | Published reliance claims map to observable sandbox tests. | fixed |
| V1-4 | robots, sitemap, CSP/headers, and designed unknown-route response are live. | fixed |
| V1-5 | The sample survives offline reload after first visit. | fixed |
| V1-6 | Audience and both initial actions are visible on the required viewports. | fixed |
| V3-1 | Separate storage, local-only, export, backup, tracking, and maintenance claims pass. | fixed |
| V3-2 | Unverified Pack Plus tokens remain locked under offline/429 conditions. | fixed |
| V3-3 | Mobile privacy, terms, and import controls are reachable. | fixed |
| V3-4 | Service-worker update/reload behavior remains in the suite. | fixed |
| V3-5 | Mixed oversized evidence is rejected without an orphan. | fixed |
| V3-6 | The same encrypted file can be retried after a wrong password. | fixed |
| V3-7 | Malformed backup uses a plain recovery error. | fixed |
| V3-8 | Hash history, focus transfer, and polite announcements work live. | fixed |
| V3-9 | Unknown routes return the designed HTTP 404. | fixed |
| V3-10 | Clean `npm ci` reported no vulnerabilities. | fixed |
| V3-11 | Checked mobile brand, demo, and Edit controls meet target size. | fixed |
| V3-12 | Root, legal, 404, and direct-demo route metadata are complete. | fixed |
| V3-13 | Manifest and application icons remain shipped. | fixed |
| V4-1 | Desktop first actions remain visible at 1280 × 720. | fixed |
| V4-2 | Demo and timeline actions retain mobile target-size coverage. | fixed |

## What would make this perfect

Repair the hero's desktop/mobile layout so the sample explanation and all facts are plainly visible without collision, then make one named sample record visible in the first 390 px demo screen. Add the two focused mobile/desktop geometry and demo-content regressions described above, rerun every declared claim command from a clean checkout, `npm test`, `npm run build`, and the live route/Axe crawl. Only then would this review reach PASS.

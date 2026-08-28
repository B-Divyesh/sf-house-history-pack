# Adversarial first-read review 2 — FAIL

**Reviewed:** 2026-08-28 UTC  
**Live URL:** <https://house-history-pack.sociobot.in>  
**Repository:** clean clone of `b816da0b78d6e76a04cbb4296ba2fecdeaf8bb96`; no product code changed.

## Verdict

**FAIL.** The real job works, the demo is isolated, and every declared claim test passes. Five minor copy and landing-structure findings remain. This is not a blocking first-screen or demo failure: the product is understandable in 30 seconds. It fails because the requested standard is zero findings.

## Cold first read

Fresh Chromium contexts loaded the live root at 390 × 844 and 1280 × 720, without scrolling or browser errors.

In my own words: this is a local home-history record for a homeowner to keep appliances, repairs, permits, warranties, and supporting files ready for a service person or handover. It is for homeowners who need that durable record. I would first click **Try it with sample data**.

This is answerable from the first screen, so there is no first-read blocker. The supporting text is explicit: “For homeowners building a durable service and handover record.”, “Keep appliances, repairs, permits, warranties, and the evidence behind them together—ready for the next service call or handover.”, and “Loads a sample house in a separate, disposable space.”

| Viewport | Sample action box | Real action box | Result |
| --- | --- | --- | --- |
| 390 × 844 | x=42, y=557.1, 209.6 × 48 px | x=42, y=615.1, 173.1 × 48 px | both visible |
| 1280 × 720 | x=276.2, y=604.6, 209.6 × 48 px | x=276.2, y=662.6, 173.1 × 48 px | both visible |

## Findings

### MINOR — F-2-1: The h1 is a status line, not the plain-language job

**Quote / location:** Landing h1, `src/main.ts:63`: “Your home, documented.”

**Why this fails:** The surrounding copy rescues the first read, but the one h1 does not itself state what the visitor can do. It is a result/status line, not the required job in the visitor's words. This weakens the page outline for screen-reader heading navigation as well as cold scanning.

**Concrete fix:** Change the h1 to **“Keep your home history ready to share.”** Keep the existing audience sentence beneath it. Update the h1 regression test and title/metadata copy if needed.

### MINOR — F-2-2: Two landing headings use metaphors instead of naming content

**Quote / location:** Landing h2/h3, `src/main.ts:103` and `src/main.ts:115`: “One record for every chapter of the house.” and “The first entry starts the chain”.

**Why this fails:** “Chapter” and “chain” do not name the content a visitor will find. In an out-of-context heading list, neither tells a homeowner that this area is about their records or how to begin.

**Concrete fix:** Use **“Keep every home record together.”** and **“Add your first home record.”** respectively. The existing following sentence can then remain the concrete explanation.

### MINOR — F-2-3: The landing pricing fact names a paid tier without saying what it unlocks

**Quote / location:** Landing fact, `src/main.ts:105`: “Core pack free; Pack Plus is $29 once”. The actual value explanation only appears after opening **Build pack**: “Add a custom cover title, handover note, and reusable selection preset.”

**Why this fails:** A first-time visitor sees a price and a product tier name but not the purchase boundary. That is not the required paid-tier explanation, and “Core pack” is not introduced elsewhere on the first screen.

**Concrete fix:** Replace the fact with **“Pack Plus is $29 once for custom cover text and saved pack settings.”** Add a landing assertion to `@claim:pack-plus-price` for the exact price and named unlocks.

### MINOR — F-2-4: The landing omits the required three-step “How it works” explanation

**Quote / location:** Landing structure in `src/main.ts:99-117` moves from the hero directly to the live overview, recent history, and upcoming tasks; there is no “How it works” heading or three steps.

**Why this fails:** The interactive empty workspace is useful, but it does not give a scanning visitor the promised concise path from a receipt or repair to a shareable history pack. The standard landing skeleton requires this section.

**Concrete fix:** Add an h2 such as **“How to make a house history pack”** with three terse, verb-led steps: **Add systems**, **Log work and attach evidence**, and **Export a pack**. Use the existing UI or original product art, not generic feature cards.

### MINOR — F-2-5: Illustration provenance is a public claim with no claims-manifest entry

**Quote / location:** Landing footer, `src/main.ts:78`: “AI-assisted original illustration”.

**Why this fails:** “Original” and “AI-assisted” are verifiable provenance claims. They are not represented in `.factory/claims.json`, despite the review rule requiring every claim-like landing or README sentence to be listed and tested (or removed). The design document contains provenance, but that is not an observable claim test.

**Concrete fix:** Either remove the public provenance assertion and retain the documented source record, or add a narrowly scoped provenance claim with a test that checks the shipped asset's prompt/provenance manifest and the footer's exact disclosure. Do not present it as a runtime AI feature.

## Copy audit

Counts are whitespace-separated words. The tables include sentence-like headings, facts, and action labels so a cold scan is covered. No sentence exceeds 22 words and no banned marketing adjective appears. Findings are identified above; all buttons use result-naming verbs.

### Landing

| Copy | Words | Result |
| --- | ---: | --- |
| A private record for your property | 6 | pass |
| Your home, documented. | 3 | F-2-1 |
| For homeowners building a durable service and handover record. | 9 | pass |
| Home overview | 2 | pass |
| Keep your home history ready to share | 7 | pass |
| One record for every chapter of the house. | 8 | F-2-2 |
| Keep appliances, repairs, permits, warranties, and the evidence behind them together—ready for the next service call or handover. | 18 | pass |
| Try it with sample data | 5 | pass |
| Set up your home | 4 | pass |
| Loads a sample house in a separate, disposable space. | 9 | pass |
| Stored on this device | 4 | covered by `browser-local-storage` |
| Works offline after the first visit | 6 | covered by `offline-reload` |
| Core pack free; Pack Plus is $29 once | 8 | F-2-3; price is covered, unlocks are absent |
| Assets | 1 | pass |
| Add appliances & systems | 4 | pass |
| History records | 2 | pass |
| Log your first event | 5 | pass |
| Open tasks | 2 | pass |
| Seasonal & next-due work | 4 | pass |
| Evidence files | 2 | pass |
| Receipts, manuals & permits | 3 | pass |
| Recent home history | 3 | pass |
| Recent history | 2 | pass |
| View all history | 3 | pass |
| The first entry starts the chain | 6 | F-2-2 |
| Record a service visit, repair, permit, inspection, or contractor note. | 10 | pass |
| Log history | 2 | pass |
| Upcoming tasks and warranties | 4 | pass |
| Local & ready | 3 | pass |
| Nothing urgent | 2 | pass |
| Due work and warranty dates will surface here. | 8 | pass |
| Add a task | 3 | pass |
| Private by default | 3 | pass |
| Your records and files stay in this browser unless you export them. | 12 | covered by `browser-local-storage` |
| House records stored on this device | 6 | covered by `browser-local-storage` |
| AI-assisted original illustration | 3 | F-2-5 |
| Privacy | 1 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| Import backup | 2 | pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| House History Pack | 3 | pass |
| House History Pack is a local property ledger for homeowners preparing a durable service and handover record. | 17 | pass |
| It keeps appliance and system details, repairs, service visits, permits, contractor notes, warranties, seasonal work, and original evidence files together. | 20 | covered by storage/tracking/export claims |
| Keeps home, asset, history, task, and attachment records in this browser. | 11 | covered by `browser-local-storage` |
| Tracks warranty dates and upcoming or repeating maintenance. | 8 | covered by `maintenance-tracking` |
| Creates a PDF for selected assets, or a ZIP containing the PDF, structured JSON, and original evidence. | 17 | covered by `portable-exports` |
| Downloads a password-protected full backup. | 5 | covered by `encrypted-backup` |
| Works after the first visit when the network is disconnected. | 10 | covered by `offline-reload` |
| Pack Plus costs $29 once. | 5 | covered by `pack-plus-price` |
| It adds custom cover text and reusable pack settings. | 9 | covered by `pack-plus-price` |
| Core records and all exports stay free. | 7 | covered by `pack-plus-price` |
| The app provides record keeping, not legal, regulatory, safety, valuation, or building-compliance advice. | 13 | disclaimer; pass |
| Users are responsible for document rights and accuracy. | 8 | disclaimer; pass |
| Requirements: Node.js 20+ and npm. | 5 | pass |
| Open the local URL printed by Vite. | 7 | pass |
| No environment variables or external database are required. | 8 | developer setup instruction; pass |
| Billing verification uses the public Sociobot API only when a license is entered. | 13 | covered by license/no-account claims |
| Playwright 1.58.2 is pinned because the factory image provides that browser version. | 12 | pass |
| npm test runs unit and browser checks. | 7 | pass |
| It covers demo exports, backups, privacy, accessibility, and offline reload. | 10 | pass |
| The production build command is npm run build; deploy the generated dist/ directory. | 13 | pass |
| Its index.html is at the root. | 6 | pass |
| Choose Try it with sample data or open ?demo=1. | 9 | pass |
| Juniper House is a separate, disposable sample with systems, service history, due work, and a receipt. | 16 | covered by `demo-isolated` |
| The banner can reset it or discard it before opening the real workspace. | 13 | covered by demo/storage claims |
| There is no account, analytics, advertising, cloud sync, CDN font, or runtime tracking script. | 14 | covered by `no-account-tracking` |
| Browser site-data controls can erase local records. | 7 | browser behavior warning; pass |
| Unencrypted PDFs, ZIPs, and JSON backups may contain sensitive addresses, serial numbers, invoices, or permits. | 15 | safety warning; pass |
| MIT. | 1 | pass |
| See LICENSE. | 2 | pass |

## Demo and sandbox verification

The visible landing action opened `/?demo=1` in one click. Its first screen already showed Juniper House, a Water heater warranty, history/tasks, and the persistent **“Demo — sample data, nothing is saved”** banner. **Reset demo** removed a newly created “Reset-only review asset”. The live browser had no console/page errors, captured only `https://house-history-pack.sociobot.in` requests, and the demo reloaded with the banner and warranty after `context.setOffline(true)`.

The fresh-clone `@claim:browser-local-storage` test also created a real home, then demo data, reset it, and confirmed separate `house-history-pack` and `demo:house-history-pack` IndexedDB databases; **Start for real** removed the demo database. This confirms the demo did not write to real storage.

## Claims contract

`.factory/claims.json` contains ten entries, each with exactly one matching `@claim:` test. From the fresh clone, all exact commands passed in desktop Chromium and the 390 px mobile project.

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

A transient local port collision interrupted one duplicate command loop; the commands were rerun with a clean port. The first three and final seven exact commands all exited 0. The only claims-manifest gap found by the live copy audit is F-2-5.

## Structure, accessibility, and routing

- `/`, `/?demo=1`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` all had a title, exactly one h1, `lang=en`, description, canonical, Open Graph image, Twitter image, favicon, and footer. Their title pattern is appropriate for their route.
- An unknown route returned HTTP 404 with the designed 404 page. All discovered internal links returned 200; mailto links were explicit. The wordmark returns home. `/demo#assets` supported Back and restored the h1 focus and polite “Assets view” announcement.
- Live Axe reported no violations on the checked demo page; the cold live checks logged no console/page errors. The dark archival interface and purpose-made house-ledger art follow the recorded product-specific visual direction rather than a generic SaaS template.
- `npm test` passed (10 Vitest tests and 38 browser executions; final run status `passed`) and `npm run build` produced `dist/`.

F-2-3 and F-2-4 are the remaining landing-skeleton failures.

## Earlier-finding recheck

Every earlier defect was checked on the live site and against its current test or source coverage; none regressed. “Fixed” below means observed repaired, not merely marked complete.

| Earlier finding | Live/code confirmation | Result |
| --- | --- | --- |
| V1-1, V1-3; V3-1; F-1-1 | Ten-entry claims manifest; tagged storage/isolation and all other claims pass. | fixed |
| V1-2; V1-4; V1-5 | One-click `?demo=1`, reset/start-real banner, offline sample, and documented namespace work. | fixed |
| V1-6; V4-1 | Audience, sample action, and both actions are visible at 390 px and 1280 × 720. | fixed |
| V3-2 | 429/offline license test leaves paid controls locked. | fixed |
| V3-3; V3-11; V4-2 | Mobile Privacy, Terms, Import backup, brand, reset/start-real, and Edit controls are reachable and sized by regression tests. | fixed |
| V3-4 | Worker-update behavior remains covered by the unit/browser suite. | fixed |
| V3-5 | Mixed oversize upload regression asserts no attachment orphan. | fixed |
| V3-6 | Encrypted-backup regression retries the same file after a wrong password. | fixed |
| V3-7 | Malformed JSON regression asserts the plain recovery message. | fixed |
| V3-8 | Hash navigation uses history, moves h1 focus, and announces the view; Back restores it live. | fixed |
| V3-9 | `/not-a-real-route` returned HTTP 404 and the designed page. | fixed |
| V3-10 | Clean `npm ci` reported zero vulnerabilities; current Vite/Vitest pins meet the cited versions. | fixed |
| V3-12; F-1-2 | Route metadata regression and live route checks find complete canonical, OG, Twitter, and favicon fields. | fixed |
| V3-13 | Current manifest was accepted by the app/browser test suite; no installability error observed. | fixed |
| F-1-3 | “Recent home history” and “Upcoming tasks and warranties” are now plain labels. | fixed |
| F-1-4 | README Pack Plus copy is split into 5-, 9-, and 7-word sentences. | fixed |

## Missed leverage

No additional AI, sync, or import/export feature is required by the brief. The core useful loop is present: create assets/history/tasks, attach evidence, export PDF/ZIP, and make an encrypted backup. Adding receipt AI extraction would be optional scope expansion, not an implied requirement. No runtime AI feature, provider key, or Azure endpoint was found.

## What would make this perfect

Apply F-2-1 through F-2-5, add their focused regressions where specified, and rerun the ten exact claim commands plus `npm test` and `npm run build`. The result would retain the strong local-first demo while making the landing page fully plain, self-explanatory, and contract-complete.


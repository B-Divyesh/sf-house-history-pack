# Adversarial first-read review 1 — FAIL

**Reviewed:** 2026-08-28 UTC  
**Live URL:** https://house-history-pack.sociobot.in  
**Method:** fresh Chromium contexts at 390 × 844 and 1280 × 720; a clean clone
at commit e983a10; no product code changed.

## Verdict

**FAIL.** The product is clear and tryable, and its declared claim tests pass,
but four findings remain. F-1-1 is blocking because reliance-worthy
local-storage promises are not covered by a claims entry and observable test.

## First screen, cold

**390 × 844 and 1280 × 720, before scrolling:** “Your home, documented.” is
supported by “For homeowners building a durable service and handover record.”
and “Keep appliances, repairs, permits, warranties, and the evidence behind
them together—ready for the next service call or handover.”

In my own words: it is a browser-based record for a homeowner to collect home
systems, repairs, permits, warranties, and their files into a service/handover
history. The intended visitor is a homeowner preparing that record. The first
click is **Try it with sample data**; the adjacent explanation says it “Loads a
sample house in a separate, disposable space.”

The required action was visible without scrolling:

| Viewport | Try sample data | Set up your home |
| --- | --- | --- |
| 390 × 844 | x=42, y=539.1, 209.6 × 48 px | x=42, y=597.1, 173.1 × 48 px |
| 1280 × 720 | x=276.2, y=604.6, 209.6 × 48 px | x=276.2, y=662.6, 173.1 × 48 px |

This part passes. No console or page errors occurred in either context.

## Findings

### BLOCKING — F-1-1: Local browser storage is promised without a matching claim

**Quote / location:** Landing header and fact: “Stored on this device.” Landing
privacy note: “Your records and files stay in this browser unless you export
them.” Footer: “House records stored on this device.” README: “Keeps home,
asset, history, task, and attachment records in this browser.”

**Why this fails:** These are concrete privacy/storage promises a homeowner can
rely on. claims.json has no claim for browser-local persistence. Its
local-only claim is narrower: “Records are not sent off this origin during the
sample workflow,” and its tagged test only captures request origins. It does
not assert the stated storage location or that the real and demo databases use
their intended namespaces. The existing demo-isolated test proves the demo
namespace but is not declared for these landing/README claims.

**Concrete fix:** Add a claim such as “Records are stored in this browser and
the demo cannot write to the real record.” List every cited location in its
where field. Add one tagged test from a fresh context that creates a real
record and asserts it is in IndexedDB house-history-pack, then enters demo,
creates/resets sample data, and asserts the real record is unchanged and demo
data is only in demo:house-history-pack. Alternatively remove or narrow the
storage-location promises to the already-tested no-off-origin claim.

### MINOR — F-1-2: The designed 404 and legal routes do not have the required complete social metadata

**Quote / location:** Live /404.html has “This record does not exist.” but no
meta description, canonical link, Open Graph title/description/image, or
Twitter card fields. Live /privacy/ and /terms/ have a twitter:card only; they
lack twitter:title, twitter:description, and twitter:image.

**Why this fails:** A deep-linked missing page or legal page produces an
incomplete social preview and fails the route metadata contract. The 404 is
otherwise designed and returns HTTP 404, so this is a metadata omission rather
than a routing failure.

**Concrete fix:** Give 404.html a short description, self canonical,
og:type/title/description/url/image, and Twitter card/title/description/image.
Add the missing Twitter title, description, and image fields to privacy and
terms. Add a route-metadata regression test that visits all public routes.

### MINOR — F-1-3: Three landing headings are not plain, stand-alone labels

**Quote / location:** “THE PROOF TRAVELS WITH THE HOME”; “THE PROPERTY
LEDGER”; “NEXT SIGNALS.”

**Why this fails:** These phrases require product context and introduce
legal-adjacent or product-jargon language. A first-time visitor scanning
headings cannot tell that they mean service/handover history, recent records,
and upcoming tasks/warranties.

**Concrete fix:** Replace them respectively with “Keep your home history ready
to share,” “Recent home history,” and “Upcoming tasks and warranties.” These
retain the visual rhythm while naming the content.

### MINOR — F-1-4: README pricing sentence exceeds the 22-word hard cap

**Quote / location:** README, What it does: “Offers an optional $29 one-time
Pack Plus license for custom cover text and reusable pack settings. Core
records and every export format remain free.” The first sentence is 24 words.

**Why this fails:** The sentence combines price, product name, two paid
features, and the free boundary. It is harder to scan than necessary.

**Concrete fix:** Replace the two-sentence item with: “Pack Plus costs $29
once. It adds custom cover text and reusable pack settings. Core records and
all exports stay free.”

## Copy audit

Counts use whitespace-separated words. Sentence-like headings and facts are
included so their first-read meaning can be checked. Labels that are only
navigation, field names, dates, counts, or file names are audited separately
below.

### Landing page

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| eyebrow | A private record for your property | 6 | pass |
| h1 | Your home, documented. | 3 | pass |
| audience | For homeowners building a durable service and handover record. | 9 | pass |
| h2 | Home overview | 2 | pass |
| eyebrow | The proof travels with the home | 6 | F-1-3 |
| h2 | One record for every chapter of the house. | 8 | pass |
| body | Keep appliances, repairs, permits, warranties, and the evidence behind them together—ready for the next service call or handover. | 18 | pass |
| helper | Loads a sample house in a separate, disposable space. | 10 | pass |
| fact | Stored on this device | 4 | F-1-1 |
| fact | Works offline after the first visit | 7 | covered by offline-reload |
| fact | Core pack free; Pack Plus is $29 once | 8 | covered by pack-plus-price |
| eyebrow | The property ledger | 3 | F-1-3 |
| h2 | Recent history | 2 | pass |
| empty-state h3 | The first entry starts the chain | 7 | pass |
| empty-state body | Record a service visit, repair, permit, inspection, or contractor note. | 10 | pass |
| signal label | Next signals | 2 | F-1-3 |
| signal state | Local & ready | 3 | pass |
| signal h2 | Nothing urgent | 2 | pass |
| signal body | Due work and warranty dates will surface here. | 8 | pass |
| privacy label | Private by default | 3 | pass |
| privacy body | Your records and files stay in this browser unless you export them. | 12 | F-1-1 |
| footer | House records stored on this device | 6 | F-1-1 |
| footer | AI-assisted original illustration | 3 | pass; provenance disclosure |

### README

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| intro | House History Pack is a local property ledger for homeowners preparing a durable service and handover record. | 17 | pass |
| intro | It keeps appliance and system details, repairs, service visits, permits, contractor notes, warranties, seasonal work, and original evidence files together. | 20 | pass |
| What it does | Keeps home, asset, history, task, and attachment records in this browser. | 11 | F-1-1 |
| What it does | Tracks warranty dates and upcoming or repeating maintenance. | 8 | covered by maintenance-tracking |
| What it does | Creates a PDF for selected assets, or a ZIP containing the PDF, structured JSON, and original evidence. | 17 | covered by portable-exports |
| What it does | Downloads a password-protected full backup. | 4 | covered by encrypted-backup |
| What it does | Works after the first visit when the network is disconnected. | 10 | covered by offline-reload |
| What it does | Offers an optional $29 one-time Pack Plus license for custom cover text and reusable pack settings. | 24 | F-1-4 |
| What it does | Core records and every export format remain free. | 8 | covered by pack-plus-price |
| scope | The app provides record keeping, not legal, regulatory, safety, valuation, or building-compliance advice. | 13 | pass |
| scope | Users are responsible for document rights and accuracy. | 8 | pass |
| Develop | Requirements: Node.js 20+ and npm. | 5 | developer instruction; pass |
| Develop | Open the local URL printed by Vite. | 8 | developer instruction; pass |
| Develop | No environment variables or external database are required. | 9 | developer instruction; pass |
| Develop | Billing verification uses the public Sociobot API only when a license is entered. | 13 | developer instruction; pass |
| Test and build | Playwright 1.58.2 is pinned because the factory image provides that browser version. | 13 | developer instruction; pass |
| Test and build | npm test runs unit coverage plus desktop/mobile browser flows, an axe serious/critical scan, claimed export/backup/privacy checks from /demo, and an offline service-worker reload. | 25 | F-1-4: over 22; rewrite below |
| Test and build | The exact production build command is npm run build; deploy the generated dist/ directory. | 15 | developer instruction; pass |
| Test and build | Its index.html is at the root. | 6 | developer instruction; pass |
| Sample demo | Choose Try it with sample data or open /demo. | 9 | pass |
| Sample demo | Juniper House is a separate, disposable sample with systems, service history, due work, and a receipt. | 16 | covered by demo-isolated |
| Sample demo | The banner can reset it or discard it before opening the real workspace. | 13 | covered by demo-isolated |
| Data and privacy | There is no account, analytics, advertising, cloud sync, CDN font, or runtime tracking script. | 13 | covered by no-account-tracking |
| Data and privacy | Browser site-data controls can erase local records. | 7 | F-1-1 |
| Data and privacy | Unencrypted PDFs, ZIPs, and JSON backups may contain sensitive addresses, serial numbers, invoices, or permits. | 14 | pass |
| Data and privacy | See the in-product privacy policy and terms. | 7 | pass |
| License | MIT. | 1 | pass |
| License | See LICENSE. | 2 | pass |

The README test sentence is a second instance of the hard-cap issue. Rewrite it
as: “npm test runs unit and browser checks. It covers demo exports, backups,
privacy, accessibility, and offline reload.” No prohibited marketing adjectives
were found. “Ledger” is product-specific language but is contextualized
immediately and is not separately flagged. The terminology table in
.factory/copy-audit.md is consistent: record, history pack, evidence, and
demo/sample data are used consistently.

### Buttons and link actions

Primary and relevant actions were checked: “Try it with sample data,” “Set up
your home,” “Add record,” “Add appliances & systems,” “Log your first event,”
“View all history,” “Add a task,” “Import backup,” “Reset demo,” “Start for
real,” “Create PDF,” “Create ZIP + evidence,” and “Encrypted full backup.”
They are verbs that name the result or an adequately specific next action. No
non-result-naming button finding was found.

## Demo, sandbox, privacy, and claims

The one-click demo passes: the first click reached /demo, immediately displayed
Juniper House, Water heater warranty, a persistent “Demo — sample data, nothing
is saved” banner, Reset demo, and Start for real. Reset restored the shipped
sample. A fresh live context captured only the house-history-pack.sociobot.in
origin while entering and using demo. After service-worker installation, the
same demo reloaded offline with the banner and Water heater warranty visible.
A direct IndexedDB check found zero homes in house-history-pack while in demo.

All nine exact commands declared in claims.json were run from a clean clone and
passed in Chromium and the 390 px project:

| Claim id | Result |
| --- | --- |
| demo-isolated | pass |
| offline-reload | pass |
| local-only | pass |
| portable-exports | pass |
| encrypted-backup | pass |
| pack-plus-price | pass |
| maintenance-tracking | pass |
| no-account-tracking | pass |
| license-verification | pass |

The clean-clone gates also pass: npm ci (zero vulnerabilities), npm test (10
Vitest tests and 36 Playwright executions), npm run build (dist generated),
npm run typecheck, and npm run lint.

## History re-check

Every earlier review/polish/handoff record was read. The earlier findings were
confirmed fixed on both live output and source/test coverage:

| Earlier finding | Re-check result |
| --- | --- |
| Missing claims contract and isolated demo | fixed: claims.json, demo.md, /demo, demo namespace, banner, reset, and exact tagged tests are present |
| Claim test coverage gaps | fixed: all nine declared tests pass and inspect the stated export, encryption, maintenance, privacy, and licensing outcomes |
| License could fail open | fixed: the 429/offline license-verification claim test keeps paid controls locked |
| Mobile import/privacy/terms unreachable and targets too small | fixed: live mobile footer controls are visible; Reset demo is 83.4 × 44 px, Start for real 111.3 × 46 px, and Edit is 44 × 44 px |
| Service-worker update notice, mixed upload orphan, password retry, and raw malformed JSON error | fixed: passing regression coverage exists for each |
| History/back/focus/announcement and unknown-route 404 | fixed: live unknown path is designed HTTP 404; passing navigation regression checks hash history, h1 focus, and announcement |
| Missing core metadata/favicon/artifacts | fixed for landing; the residual 404/legal metadata gap is recorded as new F-1-2 |
| Desktop sample action below 1280 × 720 | fixed: both initial actions are fully visible at the measured positions above |

## Structure and leverage check

The live landing, demo, privacy, terms, robots.txt, sitemap.xml, manifest,
social-card image, and all discovered internal/external links returned expected
responses (200, or explicit mailto). An unknown path returned the designed
HTTP 404. The demo uses real URLs and hash view history; its passing browser
regression confirms back navigation, focus transfer to h1, and an aria-live
announcement. There is one h1 per checked route, visible focus behavior,
landmarks, and a distinct archival dark-glass visual identity rather than a
generic SaaS hero.

The brief’s obvious import/export leverage is present: JSON, encrypted backup,
PDF, ZIP with evidence, and restore. An AI feature is not required for the
brief’s local record/portable-pack job and none is decorative or key-bearing.

## What would make this perfect

Ship the local-storage claim test and manifest entry, complete social metadata
on every public route, then use the plain-language heading and README rewrites.
After those changes, rerun every declared claim command, npm test, and a
fresh-context live route metadata crawl.

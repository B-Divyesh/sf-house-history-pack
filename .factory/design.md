# House History Pack — visual thesis

## Direction: luminous glass data landscape

This product turns scattered, private evidence into a durable property record. The interface therefore feels like an illuminated archive table at night: deep ink-blue space, translucent panes, fine cyan indexing lines, and one warm amber signal for work that needs attention. The glass is functional—layers separate the home summary, evidence, and upcoming work—rather than decorative blur. The generated hero depicts the *artifact* the product creates, not a fantasy smart home.

## Palette

- `night-950 #07131A` — fixed page background; a calm archival dark with less glare than pure black.
- `night-900 #0B1D26` — elevated shell and navigation.
- `glass #102B36` / `glass-strong #173B48` — translucent records and active surfaces.
- `paper #F4FAF8` — primary text, 15.2:1 on the background.
- `mist #B9CDD0` — secondary text, 9.6:1 on the background.
- `aqua #67E8D5` — primary action and focus signal; `#06211F` is its contrast text.
- `amber #FFC56D` — due-soon and warranty attention.
- `mint #75E0A7` — complete/current.
- `coral #FF8F82` — destructive/error.
- `line rgba(185, 224, 226, .18)` — quiet boundaries; meaningful UI outlines use a stronger token.

The thesis is deliberately single-mode. A dark archival workspace makes document thumbnails and evidence surfaces readable, keeps the luminous indexing metaphor coherent, and avoids an ornamental theme toggle in a utility. Every text and control pairing is checked for WCAG AA contrast.

## Type and spacing

The interface uses the local system sans stack (`Inter` where installed, then `Avenir Next`, `Segoe UI`, sans-serif) for resilient, zero-request delivery. Numeric metadata uses the same family with tabular figures. Display headings use `Georgia`, a system serif, to evoke property ledgers without adding font weight. Scale: 14, 16, 20, 28, and clamp(40–66) px. Body text is never below 16 px. Reading measure is 68 characters.

Spacing follows an 8 px base with 4 px for tight metadata: 4, 8, 12, 16, 24, 32, 48, 64. Corners are 12 px for controls, 18 px for independent records, and 28 px only for the hero landscape.

## Layout and interaction grammar

The desktop opens as a landscape: a slim left rail, a broad record canvas, and a 320 px “next signals” column. On phones, the rail becomes a four-action bottom dock and signals join the flow. The current property and the primary “Add record” action are visible immediately. Independent assets are panes; timelines and task rows group by proximity instead of becoming nested cards.

Actions originate close to their result: adding opens a centered sheet, record details expand in place, and successful changes briefly illuminate the affected count. Destructive actions name the record and require confirmation. Toasts announce persistence, import, export, offline state, and update availability. All targets are at least 44 px.

## Motion

State transitions use 180–240 ms opacity and translate changes. Sheets rise from the action area; rows fade in where they were added. The hero has one very slow parallax-like sheen that does not loop visibly. Under `prefers-reduced-motion: reduce`, transforms, smooth scrolling, and decorative animation are removed; state remains legible through borders, labels, and opacity.

## Asset plan and provenance

- `public/assets/house-ledger.webp`: original AI-generated editorial still used in the welcome/empty landscape. It shows a glass architectural cutaway holding document layers and maintenance traces. It clarifies the product’s promise—one property history assembled from evidence—without pretending to scan or automate the home.
- `public/assets/social-card.jpg`: a 1200 × 630 center crop derived locally from the same original house-ledger artwork for link previews; no new source imagery was introduced.
- App icons and interface symbols are hand-authored SVG/CSS using simple geometric forms. No third-party icon library or stock art.

### Prompt sheet

Use case: `stylized-concept`. Asset type: responsive PWA hero illustration. Subject: a precise small-house architectural cutaway transformed into a floating archival ledger, with transparent glass rooms, a water heater, boiler, roof line, paper repair receipts, a permit folder, tiny date tabs, and fine maintenance paths assembling into one ordered record. World/materials: museum-grade glass, vellum, etched acrylic, brushed dark metal, subtle paper fibers. Composition: wide 3:2, house centered slightly right, generous calm dark negative space at left and edges, no user-interface mockup. Light/lens: low-angle cyan internal illumination, one warm amber task beacon, controlled editorial studio light, orthographic/isometric lens, crisp macro detail. Palette words: midnight ink, deep teal glass, luminous aqua, parchment white, sparing amber. Negative list: people, brands, logos, readable text, letters, watermark, signatures, distorted architecture, excessive glow, neon cyberpunk city, generic gradient, photoreal estate marketing.

Generated with the factory Azure image deployment (`factory-image`) on 2026-08-28 using `/opt/fleet/lib/gen-image.sh`. The output is original for this product; the optimized WebP is shipped in the repository. The footer discloses AI-assisted imagery.

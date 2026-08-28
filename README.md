# House History Pack

House History Pack is a local property ledger for homeowners preparing a durable service and handover record. It keeps appliance and system details, repairs, service visits, permits, contractor notes, warranties, seasonal work, and original evidence files together.

Live product: <https://house-history-pack.sociobot.in>

Try the isolated sample record: <https://house-history-pack.sociobot.in/?demo=1>

## What it does

- Keeps home, asset, history, task, and attachment records in this browser.
- Tracks warranty dates and upcoming or repeating maintenance.
- Creates a PDF for selected assets, or a ZIP containing the PDF, structured JSON, and original evidence.
- Downloads a password-protected full backup.
- Works after the first visit when the network is disconnected.
- Pack Plus costs $29 once. It adds custom cover text and reusable pack settings.
- Core records and all exports stay free.

The app provides record keeping, not legal, regulatory, safety, valuation, or building-compliance advice. Users are responsible for document rights and accuracy.

## Develop

Requirements: Node.js 20+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. No environment variables or external database are required. Billing verification uses the public Sociobot API only when a license is entered.

## Test and build

Playwright 1.58.2 is pinned because the factory image provides that browser version.

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm run preview
```

`npm test` runs unit and browser checks. It covers demo exports, backups,
privacy, accessibility, and offline reload. The production build command is
`npm run build`; deploy the generated `dist/` directory. Its `index.html` is
at the root.

## Sample demo

Choose **Try it with sample data** or open `?demo=1`. Juniper House is a
separate, disposable sample with systems, service history, due work, and a
receipt. The banner can reset it or discard it before opening the real
workspace. See [`.factory/demo.md`](.factory/demo.md) and
[`.factory/claims.json`](.factory/claims.json) for the sandbox and exact
claim-test commands.

## Data and privacy

There is no account, analytics, advertising, cloud sync, CDN font, or runtime tracking script. Browser site-data controls can erase local records. Unencrypted PDFs, ZIPs, and JSON backups may contain sensitive addresses, serial numbers, invoices, or permits.

See the in-product [privacy policy](https://house-history-pack.sociobot.in/privacy/) and [terms](https://house-history-pack.sociobot.in/terms/).

## Repository map

- `src/` — TypeScript UI, IndexedDB storage, encryption, licensing, and lazy-loaded exporters.
- `public/` — manifest, service worker, legal/offline pages, icons, and optimized original imagery.
- `assets/src/` — source artwork and generation prompt/provenance.
- `tests/` — Vitest units and Playwright end-to-end coverage.
- `.factory/design.md` — product-specific visual system and asset direction.
- `.factory/handoff.md` — verification record and known gaps.

## License

MIT. See [LICENSE](LICENSE).

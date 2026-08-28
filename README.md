# House History Pack

House History Pack is a private, offline-first property ledger for homeowners. It keeps appliance and system details, repairs, service visits, permits, contractor notes, warranties, seasonal work, and original evidence files together. The primary output is a selectable PDF or ZIP packet that can be handed to a buyer or service person.

Live product: <https://house-history-pack.sociobot.in>

## What it does

- Stores home, asset, history, task, and attachment records locally in IndexedDB.
- Tracks warranty dates and upcoming or repeating maintenance.
- Creates a PDF for selected assets, or a ZIP containing the PDF, structured JSON, and original evidence.
- Exports and restores full portable JSON backups, with optional AES-GCM encryption and a password-derived key.
- Installs as a PWA and works after the network is disconnected.
- Offers an optional $29 one-time Pack Plus license for custom cover text and reusable pack settings. Core records and every export format remain free.

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
npm run build
npm run preview
```

`npm test` runs unit coverage plus desktop/mobile browser flows, an axe serious/critical scan, a real PDF download, and an offline service-worker reload. The exact production build command is `npm run build`; deploy the generated `dist/` directory. Its `index.html` is at the root.

## Data and privacy

There is no account, analytics, advertising, cloud sync, CDN font, or runtime tracking script. Browser site-data controls can erase local records, so encrypted backups should be created regularly and tested. Unencrypted PDFs, ZIPs, and JSON backups may contain sensitive addresses, serial numbers, invoices, or permits.

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

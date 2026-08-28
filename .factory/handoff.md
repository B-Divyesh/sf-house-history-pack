# House History Pack — build handoff

## Shipped

- Complete local property record: editable home identity and assets; service, repair, permit, inspection, and contractor-note history; warranty signals; one-off and repeating next-due tasks; locally stored attachments with download.
- Primary artifact workflow: select assets and whole-property records, include tasks and evidence, then download a generated PDF or ZIP. ZIPs include the PDF, structured selected records, original files, and a privacy README.
- Data ownership: full JSON export/import plus password-protected `.hhpack` backup/import using PBKDF2-SHA256 (250,000 iterations) and AES-256-GCM. Import explicitly confirms replacement.
- Offline PWA: versioned shell/asset caches, generated 192/512/maskable icons, manifest shortcuts, offline fallback, hashed production asset precache, runtime cache, update notice, and mobile safe-area navigation.
- Optional Pack Plus: production Sociobot checkout URL, returned-token capture, local license cache, once-daily verification, offline optimistic unlock, revocation handling, and paste-to-restore. The $29 one-time unlock adds a custom cover title, handover note, and reusable selection preset. Core records, exports, encryption, and accessibility are not gated.
- Product-specific luminous-glass landscape UI, responsive at 390 px, full keyboard/focus treatment, reduced-motion behavior, error/empty/offline/loading states, privacy and terms pages, and original generated hero art with source prompt and provenance.

## Verification

Run from a clean checkout:

```sh
npm install
npm test
npm run build
```

- `npm test`: **5/5 unit tests and 4/4 Playwright flows passed** on Chromium desktop and a Chromium mobile profile. Coverage includes create home → asset → history event → local attachment → selected PDF download; axe serious/critical scan; and an explicit service-worker reload under `context.setOffline(true)`.
- `npm run build`: passed; `dist/index.html` is at the required deploy root.
- Production initial payload: **42.4 KB JS** and **24.0 KB CSS** uncompressed; export-only PDF (435 KB) and ZIP (97 KB) chunks load on demand. Hero WebP: **64.8 KB**. No runtime CDN resources or fonts.
- Lighthouse 12.8.2 mobile-class run against the production preview on 2026-08-28: **Performance 99, Accessibility 100, Best Practices 100**. FCP 1.0 s, LCP 1.8 s, TBT 110 ms, CLS 0. Console-errors audit passed.
- `npm audit --omit=dev`: 0 production vulnerabilities.
- Manual visual review completed at 1440×1000 and 390×844. The generated illustration was checked for anatomy/architecture, seams, unwanted branding, and text artifacts before its optimized derivative was shipped.

## Deployment

Static deploy command: `npm run build`

Publish: `dist/`

The host should use `index.html` as the SPA fallback for application hashes. `/privacy/`, `/terms/`, and `/offline.html` are physical static outputs and do not need rewriting. Do not add CDN cache rules for `sw.js`; it must be revalidated so app updates are discovered.

## Known gaps / next steps

- This v1 intentionally supports one property and no cloud sync or contractor marketplace.
- PDF text uses a compact built-in font to keep runtime and font payloads low. Latin accents are normalized; scripts outside the built-in font range are simplified in PDF output while remaining intact in the app, JSON, and ZIP records. A later release can embed a licensed Unicode subset on demand.
- Browser storage quotas vary. Each attachment is limited to 25 MB, but the browser controls the total available storage; users should keep encrypted backups.
- The factory still needs to register the production paid product and confirm the configured $29 price/return URL in the Sociobot billing catalog before promoting Pack Plus.
- Lighthouse no longer emits the legacy PWA category; installability and offline behavior were therefore verified through manifest inspection and the Playwright offline test.

# Polish round 2 — complete finding closure

**Base reviewed:** `b816da0b78d6e76a04cbb4296ba2fecdeaf8bb96`  
**Repair commit:** `f629cb4c36d1ca054100b06ad0ecf241656fbf71`  
**Deployment:** `06b6d48e-9d2f-4db5-b16d-78a20aee521b`  
**Live:** <https://house-history-pack.sociobot.in/?demo=1>

| Finding id | Change made / current verification | Evidence |
| --- | --- | --- |
| F-1-1 | Browser-local storage and demo isolation remain an explicit claim with an IndexedDB namespace test. | `@claim:browser-local-storage`; live demo check in `recheck.json`. |
| F-1-2 | 404, Privacy, and Terms retain complete description, canonical, OG, Twitter, favicon, and standard footer metadata. | `public routes have complete titles…`; live Axe route sweep. |
| F-1-3 | Earlier plain labels remain in place: “Recent home history” and “Upcoming tasks and warranties.” | `npm test`; live cold root. |
| F-1-4 | README's Pack Plus and test-summary sentences remain under the copy limit. | `.factory/copy-audit.md`; `npm test`. |
| F-2-1 | Replaced the status h1 with “Keep your home history ready to share.” Updated root title, social title, loading h1, and title regression. | `first actions remain visible…`; live root screenshot `root-desktop.png`. |
| F-2-2 | Replaced “chapter” and “chain” headings with “Keep every home record together.” and “Add your first home record.” | `first actions remain visible…`; live `recheck.json`. |
| F-2-3 | Landing fact now states the one-time $29 price plus custom cover text and saved pack settings. The claim regression checks that fact and free PDF/ZIP controls. | `@claim:pack-plus-price`; live `recheck.json`. |
| F-2-4 | Added a three-step, semantic ordered “How to make a house history pack” section: Add systems, Log work and attach evidence, Export a pack. It uses the archive-line layout rather than generic cards. | `first actions remain visible…`; live `recheck.json`. |
| F-2-5 | Removed the public “AI-assisted original illustration” provenance assertion; provenance stays in the internal design record. | `public routes…`; live `recheck.json` confirms absent text. |
| V1-1 | Claims contract remains present with ten one-to-one tagged claim tests. | All ten commands from clean clone; final `test-results/.last-run.json` status `passed`. |
| V1-2 | One-click sample action still enters `?demo=1`; demo uses `demo:house-history-pack`, banner, reset, and Start for real. | `@claim:demo-isolated`; live `recheck.json`. |
| V1-3 | Published reliance claims remain covered by observable demo tests. | Every command in `.factory/claims.json` passed from clean clone. |
| V1-4 | Robots, sitemap, security policy, cache policy, and designed unknown-route response remain shipped. | `public routes…`; live `/not-a-real-route` returns 404. |
| V1-5 | Demo remains isolated and offline-capable after the first visit. | `@claim:offline-reload`; full `npm test`. |
| V1-6 | First screen still identifies homeowners and shows both actions. | Live desktop boxes: sample `605.5–653.5`, real `663.5–711.5`; `root-desktop.png`. |
| V3-1 | Local-only, export, encrypted-backup, tracking, and storage claims remain separately proved. | Corresponding eight `@claim:` commands; clean clone. |
| V3-2 | An arbitrary license token remains locked under 429/offline verification. | `@claim:license-verification`. |
| V3-3 | Mobile Privacy, Terms, and Import backup controls remain accessible. | `backup errors are plain and importing remains available at 390px`. |
| V3-4 | Service-worker update notice/reload coverage remains in the suite. | `npm test` service-worker regression. |
| V3-5 | Mixed oversized upload remains atomic, with no orphan attachment. | `mixed oversized evidence is rejected without leaving an orphaned file`. |
| V3-6 | Same-file encrypted-backup retry remains available after a wrong password. | `@claim:encrypted-backup`. |
| V3-7 | Malformed JSON still returns the plain recovery message. | `backup errors are plain and importing remains available at 390px`. |
| V3-8 | Hash navigation keeps browser history, h1 focus, and polite route announcement. | `section navigation preserves history, moves focus, and announces the view`. |
| V3-9 | Unknown routes still return the designed 404 with HTTP 404. | `public routes…`; live `/not-a-real-route` 404. |
| V3-10 | Dependency remediation remains in lockfile. | Clean `npm ci`; `npm audit --omit=dev --audit-level=high` reports 0 vulnerabilities. |
| V3-11 | Brand, demo controls, and timeline Edit targets remain at least 44px on mobile. | `first actions remain visible at 1280 × 720 and cited mobile controls meet the 44px target`. |
| V3-12 | Route titles and social metadata remain covered. Root title now reflects the repaired job wording. | `public routes have complete titles, social metadata, touch targets, and install links`. |
| V3-13 | Manifest, app icons, and PWA install links remain present. | `public routes…`; full `npm test`. |
| V4-1 | The desktop first-screen action regression remains passing after the copy and structure changes. | Live `root-desktop.png`; bounding boxes in `recheck.json`. |
| V4-2 | Demo controls and timeline edit targets remain mobile-sized. | `first actions remain visible…`; full `npm test`. |

## Evidence summary

- Clean clone: `/tmp/house-history-pack-polish-2.LHaB44`; `npm ci`, then every exact `claims.json` command passed. The final Playwright record is `{"status":"passed","failedTests":[]}`.
- Repository gates: `npm test` (10 Vitest + 38 browser executions), `npm run lint`, `npm run build`, and `npm audit --omit=dev --audit-level=high` passed.
- Build output: initial app JS 48.55 KB (15.39 KB gzip), CSS 26.13 KB (6.29 KB gzip); lazy PDF/ZIP chunks remain outside first load.
- Live checks: `verify-url.sh` output and screenshots are in `/work/.evidence/house-history-pack-polish-2-live-verify/`; it recorded title, `lang=en`, one h1, main landmark, no missing alt text, no unnamed buttons, and no console/page errors. The live route Axe sweep found 0 serious/critical issues for `/`, `/?demo=1`, `/privacy/`, `/terms/`, and `/404.html`.

# House History Pack — independent verification handoff

## Status

**FAIL — candidate `e10878db45a6238a7924a51001973e08b4683fd6` is not
release-ready.** Verified on 2026-08-28 against
<https://house-history-pack.sociobot.in>. No product code was changed.

The previous deployment lag is resolved: 28 public build artifacts match the
candidate byte for byte. The clean install, 6 unit tests, 20 Playwright runs,
all six claim commands, TypeScript check, production build, production audit,
offline reload, axe serious/critical scans, and Lighthouse budgets pass.

## Release blockers and high-severity defects

- The claims manifest omits published claims, and some tagged tests do not
  assert their declared result (notably ZIP contents and full privacy flow).
- Any token enables Pack Plus when verification is offline or rate-limited.
- At 390px, the only Import backup, Privacy, and Terms controls are hidden.
- A changed service worker installs without the required update/Reload notice.

Medium defects include an orphaned attachment after a mixed oversized upload,
same-file retry failure after a wrong backup password, a raw JSON parser error,
broken section history/focus, unknown routes returning the app with HTTP 200,
and high/critical advisories in Vite/Vitest development dependencies.

Full evidence, exact reproduction, response policy, performance figures, API
rate-limit results, and severity details are in
`.factory/verification-3.md`.

## Verification commands

```sh
npm ci
npm test
npm run build
npm audit --omit=dev
npm audit
```

Build output is `dist/`. Initial JS is 45.74 KB (14.55 KB gzip), CSS is
24.95 KB (6.09 KB gzip), and the hero is 64,782 bytes. Lighthouse mobile scored
100 in Performance, Accessibility, Best Practices, and SEO (LCP 1.4s, CLS 0,
TBT 80ms).

## Next steps

Fix the paid-license fail-open and restore mobile access first. Make attachment
writes atomic, reset the import input after every attempt, repair service-worker
update notification, use push-state navigation with focus/announcement, serve
real 404s, and expand the claims manifest/tests before re-verification.

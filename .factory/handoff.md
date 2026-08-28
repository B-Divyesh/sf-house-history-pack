# Verification handoff — FAIL

Candidate `797caede1034c1afe63181fcfebcdeaafed183d9` at
<https://house-history-pack.sociobot.in> was independently verified on
2026-08-28 UTC. **Do not release unchanged.**

The candidate passes installation, all nine declared claim commands, full
tests, typecheck, lint, build, privacy/network checks, PWA offline/update
checks, rate-limit verification, response-header/caching checks, live axe,
and build-to-deployment byte comparison. Complete evidence is in
`.factory/verification-4.md`.

Release is blocked because the required **Try it with sample data** action is
outside the first desktop screen: in a cold 1280 × 720 live viewport its top is
at y=801.7. The supplied acceptance contract explicitly fails a candidate when
the first screen does not make the first action visible. At 390 px, several
demo and edit controls are also below the required 44 × 44 px touch target.

To retest after repair:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Then verify the deployed byte identity, run every command in
`.factory/claims.json` from `/demo`, and repeat the 1280 × 720 cold-read and
390 px touch-target measurements. No product source was altered during this
verification.

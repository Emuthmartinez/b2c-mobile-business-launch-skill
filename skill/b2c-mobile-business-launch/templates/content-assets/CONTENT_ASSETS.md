# Content Assets

This packet records generated, rendered, edited, and source-backed launch media. Use it for Remotion videos/stills, Higgsfield assets, store screenshot frames, app previews, UGC overlays, ad variants, social posts, and local recordings.

## Route Matrix

| Asset family | Intended route | Selected route | Founder approval | License status | Limitation |
| --- | --- | --- | --- | --- | --- |
| App preview and social demo clips | Remotion from real app UI | Remotion draft route | Blocked until approved for public use | Remotion license status must be checked before commercial use | Local render proves layout, not campaign performance |
| Mascot, icon, photoreal, or presenter creative | Higgsfield | Blocked or deferred | Founder approval required before paid generation or fallback | Higgsfield account/credit route required | Remotion is not equivalent for net-new generated visuals |

## Remotion Route

- Use Remotion when assets should be reproducible from screenshots, recordings, `DESIGN.md` tokens, copy, captions, data, and local media.
- Load `references/remotion-content-assets.md` and the `remotion-best-practices` skill before writing Remotion code.
- Record current Remotion docs checked date, CLI version or package version, and license decision before commercial output.
- Do not add Remotion dependencies to the skill package; scaffold a launch-local `content-assets/remotion/` project only when needed.

## Higgsfield Route

- Use Higgsfield for net-new AI visuals, mascots, app icons, image-to-video, presenter ads, Marketing Studio, Soul ID, and Virality Predictor.
- If Higgsfield was intended but unavailable, stop for founder approval before using Remotion, raw screenshots, local recordings, public-domain media, or hand-authored graphics as a fallback.
- Record the fallback in `TOOL_DECISIONS.md` and in this packet.

## Source Inputs

| Input | Source | Rights/status | Used by | Notes |
| --- | --- | --- | --- | --- |
| `screenshots/raw/onboarding.png` | MobAI, XcodeBuildMCP, simulator/device, or founder-owned capture | Must be verified before production | App preview and social demo | Real app UI must remain visible |
| `11_STAR_EXPERIENCE.md` | Product experience contract | Required | Store, ads, UGC, demo clips | Use the V1 scalable slice and stay inside the line of feasibility |
| `DESIGN.md` | Project design system | Required | All rendered assets | Tokens, type, voice, motion, banned aesthetics |
| `copy/hooks.json` | Founder-approved or research-backed copy | Draft | Social and ad variants | Claims must match listing, revenue, privacy, and legal docs |

## Composition Manifest

Primary machine-readable manifest: `content-assets/manifest.json`.

Required fields per asset:
- `asset_id`
- `surface`
- `route`
- `status`
- `composition_id`
- `dimensions`
- `inputs`
- `outputs`
- `truth_constraints`
- `approvals`
- `render_proof`
- `license_status`

## Render Commands

Preview:

```bash
cd content-assets/remotion
npm run studio
```

One-frame check:

```bash
cd content-assets/remotion
npx remotion still VerticalHookDemo --scale=0.25 --frame=30 --output ../out/vertical-hook-frame30.png
```

Video render:

```bash
cd content-assets/remotion
npx remotion render VerticalHookDemo --output ../out/vertical-hook-demo.mp4
```

Still render:

```bash
cd content-assets/remotion
npx remotion still SquareAdStill --output ../out/square-ad-still.png
```

## Claim Review

- Real app UI is visible wherever the asset claims to show the app.
- The hook, storyboard, screenshot, or preview expresses the V1 scalable slice from `11_STAR_EXPERIENCE.md`.
- Store screenshots and app previews do not show mock UI as production UI.
- Pricing, trials, subscription copy, and offers match `APP_STORE_LISTING.md`, `REVENUE_OPS.md`, and legal docs.
- Health, financial, urgency, scarcity, endorsement, and outcome claims are either supported or removed.
- Captions, silent playback, safe areas, text fit, and mobile readability are checked.

## Output Registry

| Asset ID | Surface | Route | Output | Status | QA |
| --- | --- | --- | --- | --- | --- |
| `vertical-hook-demo` | TikTok/Reels/Shorts | Remotion | `content-assets/out/vertical-hook-demo.mp4` | draft | Requires real UI capture, license check, render proof, and founder approval before public use |

## Public Use Gates

Founder approval is required before:
- paid Higgsfield generation or paid render infrastructure
- Remotion company-license purchase
- public posting, scheduling, or creator distribution
- store screenshot/app-preview upload
- paid ad campaign launch
- creator payments or usage-rights commitments

## Blockers

- Remotion license status must be checked for commercial use.
- Real app screenshots/recordings must be captured before final store or product-claim assets.
- Public posting, scheduling, store upload, and paid spend require founder approval.

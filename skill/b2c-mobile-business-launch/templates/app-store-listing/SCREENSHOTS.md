# {{APP_NAME}} Store Screenshots Packet

Docs refreshed: Pending
Status: partial
Owner: design-guru + marketing-guru + orchestrator

Raw device captures prove the product exists. Final store screenshots are composed marketing assets that combine real app UI, copy, device framing, current device wells, and visual QA.

## Source Ledger

| Source | Role | Status | Notes |
| --- | --- | --- | --- |
| `DESIGN.md` | tokens, type, color, frame style, App Icon direction | Pending | Required before production composition |
| `design.md` | screen inventory and screenshot-critical states | Pending | Use real or faithful production screens |
| `11_STAR_EXPERIENCE.md` | V1 scalable slice and line of feasibility | Pending | Screenshot claims must stay inside this line |
| `APP_STORE_LISTING.md` | metadata, privacy, pricing, CPP/event alignment | Pending | Copy and offers must match listing truth |
| `CONTENT_ASSETS.md` | Higgsfield/Remotion route, license, outputs, approvals | Pending | Required when generated/rendered assets are used |
| MobAI raw captures | real app proof layer | Pending | Use approved fallback only after founder approval |
| ParthJadhav/app-store-screenshots | production screenshot editor and bulk export board | Pending | Use for copy-led iPhone/iPad/Play decks when installed or approved |
| `asc-screenshot-resize` | device wells, size, alpha, color space | Pending | Refresh current ASC sizing first |

## Narrative

| Slot | Purpose | Headline | Copy overlay | Source screen | Claim/risk check | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | hook and main outcome | Pending | Pending | onboarding/value | no unsupported outcome claim | blocked |
| 2 | differentiated proof | Pending | Pending | core loop | real UI required | blocked |
| 3 | conversion/revenue moment | Pending | Pending | paywall/result | pricing/trial must match `REVENUE_OPS.md` | blocked |
| 4 | secondary feature | Pending | Pending | feature state | one idea only | optional |
| 5 | trust or breadth | Pending | Pending | settings/proof | no fake ratings/endorsement | optional |

## Raw Capture Matrix

| Slot | Platform | Device | Locale | Source screen | Capture tool | Raw path | Version localization ID | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | iOS | iPhone 6.9 | en-US | Pending | MobAI or approved fallback | `screenshots/raw/iphone-69-slot-1.png` | Pending | blocked |
| 1 | iOS | iPad 13 | en-US | Pending | MobAI or approved fallback | `screenshots/raw/ipad-13-slot-1.png` | Pending | blocked |
| 1 | Google Play | phone | en-US | Pending | MobAI or approved fallback | `screenshots/raw/play-phone-slot-1.png` | n/a | optional |

## Production Composition Matrix

| Slot | Target | Headline | Copy overlay | Layout | Supporting asset | Route | Final upload path | Dimensions | Alpha/color space | Visual QA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | iPhone 6.9 | Pending | Pending | framed App Store screenshot | Higgsfield background or design-system frame | Remotion/HTML composition from real UI | `screenshots/final/iphone-69-slot-1.png` | current ASC size | alpha removed, sRGB color space | thumbnail pending |
| 1 | iPad 13 | Pending | Pending | framed iPad App Store screenshot | design-system frame | Remotion/HTML composition from real UI | `screenshots/final/ipad-13-slot-1.png` | current ASC size | alpha removed, sRGB color space | iPad QA pending |
| Feature graphic | Google Play | Pending | Pending | wide brand/product frame | Higgsfield or design-system artwork | content asset route | `screenshots/final/google-play-feature-graphic.png` | current Play size | sRGB color space | optional |

## Composition And Export Route

Preferred local route: ParthJadhav/app-store-screenshots.

Inputs:
- real app captures from `screenshots/raw/`
- `app-icon/app-icon-1024.png`
- `DESIGN.md`, `design.md`, and `11_STAR_EXPERIENCE.md`
- headline/copy story from `APP_STORE_LISTING.md`
- Higgsfield supporting art only when recorded in `CONTENT_ASSETS.md`

Outputs:
- screenshot editor or board: `screenshots/index.html` or generated app-store-screenshots workspace
- reusable deck state: `app-store-screenshots.json` when the external skill is used
- final no-alpha PNGs under `screenshots/final/<locale>/<device-well>/`
- ASC validation output and `asc-shots-pipeline` upload dry-run output in `STORE_CONSOLE.md`

## Device Wells

Run current sizing before export. Record ready, blocked, or not needed for each target.

| Platform | Well | Required/scaled decision | ASC device_type | Screenshot count | Current Apple size basis | Target file | Validation proof | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| iOS | iPhone 6.9 | required for current iPhone coverage when provided | Pending | 1-10 screenshots | from `asc screenshots sizes --all`; Apple currently accepts 1320x2868 portrait for this class | Pending | `asc-screenshot-resize` pending | blocked |
| iOS | iPhone 6.5 | required if 6.9 is not provided, otherwise scaled when allowed | Pending | 1-10 screenshots | Apple currently accepts 1284x2778 or 1242x2688 portrait | Pending | `asc-screenshot-resize` pending | blocked |
| iOS | iPhone 6.3 | scaled from accepted larger wells when allowed by current ASC spec | Pending | 1-10 screenshots | current ASC size matrix | Pending | `asc-screenshot-resize` pending | blocked |
| iOS | iPhone 6.1 | scaled from accepted larger wells when allowed by current ASC spec | Pending | 1-10 screenshots | current ASC size matrix | Pending | `asc-screenshot-resize` pending | blocked |
| iPadOS | iPad 13 | required when iPad is supported | Pending | 1-10 screenshots | Apple currently accepts 2064x2752 or 2048x2732 portrait | Pending | `asc-screenshot-resize` pending | blocked |
| iPadOS | iPad 12.9 | scaled from 13 inch when allowed by current ASC spec | Pending | 1-10 screenshots | current ASC size matrix | Pending | `asc-screenshot-resize` pending | blocked |
| iPadOS | iPad 11/10.5/9.7 | explicit, scaled, or not needed based on current device-family support | Pending | 1-10 screenshots | current ASC size matrix | Pending | `asc-screenshot-resize` pending | blocked |
| Google Play | phone screenshots | required for Play listing | n/a | screenshot count from Play Console spec | Pending | Pending | Play Console spec check pending | optional |
| Google Play | tablet screenshots | optional or required based on distribution target | n/a | screenshot count from Play Console spec | Pending | Pending | Play Console spec check pending | optional |
| Google Play | feature graphic | required for many Play acquisition surfaces | n/a | one graphic | Pending | Pending | Play Console spec check pending | optional |

## App Icon

| Asset | Source | Route | Output | QA | Status |
| --- | --- | --- | --- | --- | --- |
| 1024x1024 App Icon | `DESIGN.md` + competitor icon context | Higgsfield or designer/founder-owned asset | `app-icon/app-icon-1024.png` | no alpha, no rounded corners, thumbnail test, category differentiation | blocked |

## App Preview

| Preview | Source footage | Route | Poster frame | Captions/silent playback | Output | Status |
| --- | --- | --- | --- | --- | --- | --- |
| iOS Preview 1 | real in-app footage | MobAI recording + Remotion edit or approved route | Pending | required if audio carries meaning | `previews/ios-preview-1.mp4` | optional |
| Google Play promo | real app footage or approved marketing video | Remotion/Higgsfield/owned media | Pending | recommended | YouTube URL pending | optional |

Produce the required Apple/Play preview resolution variants by `reframe`-ing one master (9:16 / 1:1 / 16:9) rather than re-rendering per size; the source must be real app footage, never generated UI. See the Master → All Platforms recipe in `references/tool-recipes.md`.

## Visual QA

- [ ] Headlines are readable at App Store search thumbnail size.
- [ ] Copy overlay uses one idea per slide and matches `APP_STORE_LISTING.md`.
- [ ] Real app UI remains visible and truthful in every production composition.
- [ ] Generated Higgsfield assets are supporting visuals, not fake product proof.
- [ ] Remotion or HTML compositions record source inputs, license status, render proof, and outputs in `CONTENT_ASSETS.md`.
- [ ] ParthJadhav/app-store-screenshots deck state or equivalent export board is saved when used, including app icon, locale, iPhone/iPad deck, and final PNG paths.
- [ ] Pricing, trial, renewal, subscription, and feature claims match `REVENUE_OPS.md`, paywall copy, and legal docs.
- [ ] Alpha transparency is removed and color space is acceptable for upload.
- [ ] iPhone and iPad safe areas, text fit, overlap, and contrast are checked.
- [ ] Localized screenshot copy is reviewed for each shipped locale.
- [ ] Founder approval is recorded before screenshot upload, App Icon replacement, App Preview upload, CPP/event media submission, or paid asset generation.

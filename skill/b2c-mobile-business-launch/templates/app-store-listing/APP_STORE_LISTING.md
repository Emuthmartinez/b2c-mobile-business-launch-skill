# {{APP_NAME}} App Store Listing Packet

Docs refreshed: Pending
ASC app ID: Pending
Bundle ID: {{IOS_BUNDLE_ID}}
Primary locale: en-US
Status: partial

This packet is the Apple listing source of truth. It connects ASO, App Store Connect fields, App Privacy, pricing, RevenueCat, web funnels, screenshots, localization, and marketing surfaces.

## Source Ledger

| Source | Checked at | Decision affected | Notes |
| --- | --- | --- | --- |
| Apple App information docs | Pending | name, subtitle, privacy URL | Refresh before final paste |
| Apple Platform version docs | Pending | promo text, description, keywords, review notes | Refresh before final paste |
| Apple App Privacy docs | Pending | privacy questionnaire | Refresh before final paste |
| Apple IAP/pricing docs | Pending | products, prices, trials | Refresh before final paste |
| ASO research | Pending | keywords, metadata, screenshots | AppKittie/ASO skill/App Store evidence |
| RevenueCat/Stripe docs | Pending | entitlement and web funnel | Refresh before final pricing |

## Default Product Page

| ASC page | Field | Limit | Paste value | Source | Status |
| --- | --- | ---: | --- | --- | --- |
| App Information | Name | 30 chars | Pending | brand | blocked |
| App Information | Subtitle | 30 chars | Pending | ASO keyword map | blocked |
| App Information | Category | n/a | Pending | category research | blocked |
| App Information | Privacy Policy URL | URL | Pending | public legal page | blocked |
| App Information | Privacy Choices URL | URL | Pending | account/data deletion page | blocked |
| iOS App Version | Promotional Text | 170 chars | Pending | launch angle | blocked |
| iOS App Version | Description | 4000 chars | Pending | metadata optimization | blocked |
| iOS App Version | Keywords | 100 bytes | Pending | keyword research | blocked |
| iOS App Version | Support URL | URL | Pending | support page | blocked |
| iOS App Version | Marketing URL | URL | Pending | landing page | blocked |
| Review Information | Notes | 4000 bytes | Pending | reviewer path | blocked |

## App Privacy Questionnaire

Worksheet: `app-privacy-questionnaire.html`

| Apple data type | Collected | Linked | Tracking | Purposes | Source/vendor | Proof |
| --- | --- | --- | --- | --- | --- | --- |
| Email Address | Pending | Pending | Pending | account, support, email | auth/email provider | `PRIVACY.md` |
| User ID | Pending | Pending | Pending | account, entitlement | backend/RevenueCat | `ANALYTICS.md`, `REVENUE_OPS.md` |
| Purchase History | Pending | Pending | Pending | entitlement, support | Apple/RevenueCat/Stripe | `REVENUE_OPS.md` |
| Product Interaction | Pending | Pending | Pending | analytics, personalization | PostHog | `ANALYTICS.md` |
| Crash Data | Pending | Pending | Pending | diagnostics | Sentry/Apple | `PRODUCTION_READINESS.md` |

Do not publish App Privacy answers until this table matches `PRIVACY.md`, `ANALYTICS.md`, `REVENUE_OPS.md`, SDK manifests, backend schema, and vendor behavior.

## Pricing And Revenue Matrix

| Product | ASC product ID | Type | Price | Trial/intro | RevenueCat entitlement | Offering/package | Web funnel/Stripe | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Monthly | Pending | auto-renewable subscription | Pending | Pending | `premium` | `default/monthly` | Pending | blocked |
| Annual | Pending | auto-renewable subscription | Pending | Pending | `premium` | `default/annual` | Pending | blocked |
| Lifetime | Pending | non-consumable | Pending | n/a | `premium` | `default/lifetime` | Pending | optional |

Founder approval required before creating live products, changing prices, changing trial or intro offers, publishing purchase links, submitting IAP/subscriptions, or enabling external purchase calls to action.

## Screenshots And App Previews

| Slot | Device well | Locale | Headline | Source screen | Supporting asset | Tool | Final path | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | iPhone 6.9 | en-US | Pending | onboarding/value | optional Higgsfield background or Remotion frame | MobAI or fallback | `screenshots/final/` | blocked |
| 2 | iPhone 6.9 | en-US | Pending | core feature | optional Higgsfield visual or Remotion frame | MobAI or fallback | `screenshots/final/` | blocked |
| 3 | iPhone 6.9 | en-US | Pending | paywall/result | optional Higgsfield visual or Remotion frame | MobAI or fallback | `screenshots/final/` | blocked |

Rules:
- Real app UI capture is the proof layer.
- Higgsfield may create supporting visuals, icons, backgrounds, mascots, CPP/event media, or thumbnails only when tied to `DESIGN.md`.
- Remotion may render screenshot frames, app previews, captioned demo clips, CPP/event variants, or social/store cuts from real UI only after `CONTENT_ASSETS.md` records route approval, license status, source inputs, render proof, and output paths.
- Generated or rendered visuals must not imply unsupported features, claims, prices, or endorsements.

## Custom Product Pages

| Page | Audience/channel | Keyword set | Screens/previews | Deep link | Campaign | Measurement | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Pending | Pending | Pending | Pending | Pending | Pending | App Analytics/ASA | not needed |

Do not create a custom product page without a traffic source, measurement plan, and founder approval.

## In-App Events

| Event | Purpose/badge | Name | Short desc | Long desc | Schedule | Deep link | Media | IAP required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | not needed |

Only use In-App Events for real time-bound in-app content with working deep links and review-ready media.

## Localization

| Locale | Market reason | Metadata | Keywords | Screenshots | Privacy/support URLs | Reviewer | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| en-US | primary | Pending | Pending | Pending | Pending | Pending | blocked |

## Approval Gates

- [ ] Official Apple docs refreshed.
- [ ] App Privacy answers reviewed from actual data inventory.
- [ ] Pricing/products approved by founder.
- [ ] RevenueCat/Stripe/web funnel mapping verified.
- [ ] Screenshots/app previews approved and dimension-checked.
- [ ] Custom product pages and In-App Events marked ready or not needed.
- [ ] Localized metadata and screenshots reviewed for each target locale.
- [ ] `STORE_CONSOLE.md` and `app-store-listing.html` show exact click paths and paste values.

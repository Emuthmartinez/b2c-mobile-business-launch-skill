# {{APP_NAME}} Store Console Packet

Status: scaffold

This packet is the copy-paste operator surface for App Store Connect and Google Play. Keep values aligned with `PROJECT_STATE.yaml`, `APP_STORE_LISTING.md`, `SCREENSHOTS.md`, `PRIVACY.md`, `TERMS.md`, `REVENUE_OPS.md`, and founder approval.

## Console Routes

| Surface | Click path | Values to record | Proof | Gate |
| --- | --- | --- | --- | --- |
| App Store Connect app information | Apps > {{APP_NAME}} > App Information | name, subtitle, SKU, primary locale, bundle ID, category, privacy policy URL | `APP_STORE_LISTING.md` | founder approval before save |
| App Store Connect App Privacy | Apps > {{APP_NAME}} > App Privacy | data types, linked status, tracking status, privacy purposes | `app-privacy-questionnaire.html` | founder approval before publish |
| App Store Connect pricing | Apps > {{APP_NAME}} > Pricing and Availability | base territory, price, trial or intro offer, subscription groups | `REVENUE_OPS.md`, RevenueCat catalog diff | founder approval before price changes |
| App Store Connect localization | Apps > {{APP_NAME}} > Localizations | metadata, keywords, screenshots, App Preview, review notes | `APP_STORE_LISTING.md`, `SCREENSHOTS.md` | founder approval before upload |
| App Store Connect marketing | Apps > {{APP_NAME}} > Product Page Optimization, Custom Product Pages, In-App Events | custom product page plan, In-App Event plan, campaign measurement | ASO research, App Analytics plan | founder approval before create |
| Google Play main listing | Play Console > {{APP_NAME}} > Store presence > Main store listing | package name, short description, full description, graphics, screenshots | Play listing artifact | founder approval before save |
| Google Play Data safety | Play Console > {{APP_NAME}} > Policy > App content > Data safety | collected data, sharing, security practices, deletion route | `PRIVACY.md`, vendor inventory | founder approval before submit |

## Store Asset Rules

- Screenshots use `SCREENSHOTS.md` as the canonical packet; raw MobAI captures are proof inputs, while final iPhone, iPad, and Google Play assets need copy overlay, production composition, validation, and visual QA.
- Higgsfield can support app icons, backgrounds, CPP media, In-App Event media, and thumbnails when tied to `DESIGN.md` and `11_STAR_EXPERIENCE.md`.
- App Icon output records `app-icon/app-icon-1024.png`, thumbnail contrast, no alpha, no rounded corners, and category differentiation.
- App Preview and Google Play promo video output use real in-app footage, Remotion or owned media, captions, poster frame review, and current platform policy checks.

## Review Packet

- Review notes describe account setup, demo credentials route, entitlement test path, purchase restoration, account deletion, and support contact.
- If the app name is already in use, stop for founder approval before using any fallback name.
- Founder approval is required before App Store submission, Google Play submission, pricing edits, subscription edits, custom product page creation, In-App Event creation, paid Higgsfield generation, or public asset upload.

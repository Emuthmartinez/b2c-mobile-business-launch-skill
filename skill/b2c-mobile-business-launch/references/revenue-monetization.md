# Revenue, Monetization, And Purchase Funnels

Use this before setting up RevenueCat, Stripe, App Store/Google Play products, web billing, web purchase links, web funnels, paywalls, subscriptions, taxes, webhooks, pricing, entitlement identity, or purchase validation.

This is not a payment approval. Founder approval is required before changing prices, creating live billing products, enabling paid checkout, spending on ads, publishing subscription terms, or submitting store builds with monetization changes.

Load `paid-tool-routing.md` before replacing RevenueCat, Stripe, app-store product setup, paid RevenueCat features, tax tooling, or provider dashboards with local mocks or free-tier-only planning. Mock purchases are implementation proof only; they are not live entitlement proof.

Load `viral-growth-loops.md` before using referral unlocks, share rewards, creator codes, closing offers, or viral paywall timing as part of monetization. A growth spike is only useful if the paywall, entitlement, analytics, refund/restore, and abuse controls are ready to catch it.

Load `paid-user-acquisition.md` before using paid ads, Apple Search Ads, web-to-app campaigns, paid creative tests, or custom product pages to drive purchases. A paid campaign is only launch-ready when CPA can be evaluated against RevenueCat LTV/cohorts, trial conversion, payback window, and entitlement proof.

## Contents

- 1. Official Sources To Refresh
- 2. Monetization Decision Matrix
- 3. RevenueCat Required Setup
- 4. App Store And Play Product Gates
- 4b. Paywall Timing, Plans, Trials, And Offers
- 5. Stripe Required Setup
- 6. RevenueCat Web Billing, Purchase Links, And Funnels
- 7. Pricing And Disclosure Rules
- 8. Backend And Analytics Contract
- 9. Founder-Only Gates

## 1. Official Sources To Refresh

Refresh current docs before acting because payment, tax, and app-store rules change:
- RevenueCat product configuration: https://www.revenuecat.com/docs/projects/configuring-products
- RevenueCat store/provider connection and server notifications: https://www.revenuecat.com/docs/projects/connect-a-store
- RevenueCat Web overview: https://www.revenuecat.com/docs/web/web-billing/overview
- RevenueCat Web Purchase Links: https://www.revenuecat.com/docs/web/web-billing/web-purchase-links
- RevenueCat Redemption Links: https://www.revenuecat.com/docs/web/web-billing/redemption-links
- RevenueCat State of Subscription Apps: https://www.revenuecat.com/state-of-subscription-apps/
- RevenueCat solo UA system article: https://www.revenuecat.com/blog/growth/how-to-build-a-ua-system-when-youre-a-one-person-team
- Stripe subscriptions and webhooks: https://docs.stripe.com/billing/subscriptions/webhooks
- Stripe customer portal: https://docs.stripe.com/customer-management
- Stripe go-live checklist: https://docs.stripe.com/get-started/checklist/go-live
- Stripe Tax or tax rates when selling web subscriptions: https://docs.stripe.com/payments/advanced/tax
- Apple App Review Guideline 3.1.1 and external purchase rules: https://developer.apple.com/app-store/review/guidelines/
- Apple App Store Connect IAP setup and pricing docs from `app-store-listing-prep.md` when App Store products or subscriptions are in scope.
- Google Play payments policy: https://support.google.com/googleplay/android-developer/answer/9858738?hl=en
- Google Play subscription lifecycle and RTDNs: https://developer.android.com/google/play/billing/lifecycle/subscriptions

Record checked dates, links, and resulting decisions in `REVENUE_OPS.md` or `LEGAL_REVIEW.md`.

## 2. Monetization Decision Matrix

Choose the smallest reliable monetization path for the current phase:

- **Pre-build validation**: waitlist, pricing page, preorder interest, or non-charging web funnel. Do not imply paid access is active.
- **Mobile-only app subscription**: App Store/Google Play products, RevenueCat products/entitlements/offerings, in-app paywall, restore purchases, sandbox testing, store submission.
- **Web-to-app acquisition**: RevenueCat Web Billing or Stripe Billing through RevenueCat Web, Web Purchase Links or Web Funnels, Redemption Links, deep-link redemption, app entitlement validation.
- **Existing Stripe web business**: Stripe Billing remains billing engine, RevenueCat imports/syncs entitlements, Stripe webhooks and customer portal stay authoritative for billing management.
- **Direct Stripe without RevenueCat**: only use when the app does not need mobile store entitlements or cross-platform entitlement sync. For digital goods unlocked inside iOS/Android apps, review Apple/Google rules first.

Default for B2C mobile subscriptions: RevenueCat owns entitlements and cross-platform subscription state. Stripe may be the web payment rail or billing engine, but a successful Stripe payment is not launch-ready until it unlocks the correct RevenueCat entitlement in the app.

## 3. RevenueCat Required Setup

Required concepts:
- Product: what a user buys, created in Test Store for development or imported from App Store Connect, Play Console, Stripe, or Paddle for production.
- Entitlement: what access the product unlocks; default to `premium` unless the product truly has multiple access tiers.
- Offering: what the paywall displays; default to `default` and read `currentOffering` in the app rather than hardcoding product IDs.

Setup:
- create RevenueCat project
- add app configurations for iOS/Android and web configuration when needed
- keep Test Store separate from production store products
- create/import products with stable identifiers and durations
- create `premium` entitlement and attach all products that unlock it
- create `default` offering and packages for monthly/annual/lifetime or approved product mix
- configure App Store Connect shared secret/IAP key/API key and Google Play service credentials when production stores are in scope
- configure platform server notifications so subscription changes reach RevenueCat promptly
- configure RevenueCat webhooks when the backend, CRM, analytics, or lifecycle emails need server-side subscription events
- add SDK public API keys to the product app only through the app's environment/secrets pattern; keep secret API keys server-side only

Validation:
- fetch offerings in the app
- make a sandbox/Test Store purchase
- verify entitlement active in app, RevenueCat customer view, backend projection if one exists, and analytics events
- restore purchases on a fresh install
- test cancellation/expiration path where sandbox supports it
- verify no mock RevenueCat gateway is enabled in release builds

## 4. App Store And Play Product Gates

**CRITICAL — App container price vs IAP distinction (surface this before any store pricing work begins):**
Subscription and IAP-based apps must remain **Free** at the App Store container level (Pricing and Availability > Price: Free). The container price is the upfront download fee — setting it to $79.99 means every user pays $79.99 just to install the app before seeing the paywall. A Lifetime access offer is a **NON_CONSUMABLE** in-app purchase product created in App Store Connect > In-App Purchases, attached to the app version and mapped to a RevenueCat entitlement/offering. Never set the app container price to the lifetime price. Surface this distinction proactively at the start of any store pricing work; do not wait for the founder to make the error. If `STORE_CONSOLE.md` or `REVENUE_OPS.md` includes a Lifetime offer, verify a NON_CONSUMABLE IAP SKU exists before marking pricing ready.

iOS:
- set app container price to **Free** for any app that monetizes via subscriptions, IAP, or in-app paywalls
- create subscription group and products in App Store Connect
- create NON_CONSUMABLE products for any Lifetime offer; do not use the container price or a consumable/subscription for this purpose
- complete product localization, screenshot/metadata, review information, and pricing
- attach IAP/subscription products to the app version where required
- configure StoreKit testing or sandbox testers
- include restore purchases and clear subscription management/cancellation paths
- do not add external web checkout calls to action without checking current storefront eligibility and Apple rules

Android:
- create subscriptions/base plans/offers in Play Console
- configure license testers and closed/internal testing tracks
- support restore and account hold/grace-period behavior through RevenueCat or backend state
- if handling Play directly, use RTDN and Play Developer API as source of truth; with RevenueCat, confirm notifications reach RevenueCat
- review Google Play Billing and alternative billing eligibility before linking to external checkout

Gate:
- store products must match paywall copy, screenshots, app metadata, privacy/terms, RevenueCat products, and analytics event names.
- App Store listing work must produce an `APP_STORE_LISTING.md` or `STORE_CONSOLE.md` pricing section that ties each App Store product/subscription to RevenueCat entitlement/offering/package, web funnel/Stripe route when used, review status, sandbox proof, and founder approval.

## 4a. Subscription MISSING_METADATA, RevenueCat Product-Type, And Paywall Smoke Proof

These three gaps repeatedly shipped a broken paywall ("Purchases unavailable" / zero packages) across multiple TestFlight builds. Treat each as a hard gate before any build is called paywall-ready.

**Apple MISSING_METADATA resolution.** Every App Store subscription product needs a **subscription-group localization** (display name + description per language) before it leaves the `MISSING_METADATA` state — this is separate from app metadata. Until it clears, RevenueCat returns an empty offering. Resolve it: list products and localizations (`asc subscriptions list --app <APP_ID> --output json`, then the subscriptions localizations list/create verbs — confirm exact flags with `asc subscriptions --help`), create the missing localization, then resubmit for review (founder-approved, with `--confirm`). **Gate:** do not map a product into the RevenueCat catalog or claim paywall-ready while any product is in `MISSING_METADATA`. (Failure card: `revenuecat-missing-metadata-unresolved`.)

**RevenueCat product-type reconciliation.** The product *type inside the RevenueCat dashboard* must match its App Store counterpart: App Store non-consumable IAP → RC `non_consumable`; App Store auto-renewable subscription → RC `auto_renewable_subscription`. A lifetime/one-time unlock mapped as RC `non_renewing_subscription` behaves like a timed unlock and can silently expire. Verify type alignment before attaching to an entitlement/offering, and use `asc-revenuecat-catalog-sync` to surface mismatches. (Failure card: `revenuecat-product-type-mismatch`. This is the RC-dashboard mapping, distinct from the App Store NON_CONSUMABLE rule in section 4.)

**Debug-preview masking + Release smoke proof.** Debug builds often seed preview packages when RevenueCat returns nil/empty, which hides a broken *production* paywall from developer testing. Before any TestFlight upload is marked paywall-ready, run a **Release-scheme** smoke check (MobAI or XcodeBuildMCP against sandbox) confirming `currentOffering?.packages` is non-empty, and confirm no code path seeds packages when the RC fetch is empty in the Release target. Also confirm the RevenueCat public key actually injected into the compiled binary (`plutil -p <archive>/Products/Applications/<App>.app/Info.plist | grep -i revenuecat`) — a raw `$(VAR)` placeholder means the key never expanded. (Failure cards: `revenuecat-debug-preview-masking`; key injection is covered by `apple-pre-upload-preflight-skipped`.)

## 4b. Paywall Timing, Plans, Trials, And Offers

Load `onboarding-conversion.md` when paywall placement is part of the first-session flow.
Load `viral-growth-loops.md` when the paywall is paired with referral/share alternatives, creator-code entry, social proof loops, or content-driven impulse purchase timing.

Required decisions:
- hard paywall, soft paywall/freemium, reverse trial, web funnel, or no paywall yet
- value moment shown before paywall: personalized plan, analysis, preview, product demo, or completed setup
- paywall placement in onboarding and fallback if offerings fail to load
- closing offer or reverse-trial behavior after paywall dismissal
- package mix: weekly/monthly entry, annual recommended, lifetime optional only if sustainable
- trial duration hypothesis and experiment plan
- paid UA hypothesis when in scope: target event, CPA/LTV/payback window, selected channel, baseline window, and blended reporting owner

Evidence rules:
- RevenueCat's 2026 report shows hard paywalls materially outperform freemium on Day 35 download-to-paid conversion, but freemium can still be correct when free users drive word of mouth, network effects, UGC, or trust-building.
- RevenueCat's 2026 report shows longer trials can convert better, while shorter trials can speed learning and cash-flow feedback. Treat trial length as an experiment, not dogma.
- RevenueCat's 2026 report identifies the moment after paywall dismissal as a high-leverage conversion point. Test transparent downsells, reverse trials, or shorter commitments without fake scarcity or unclear renewal terms.
- Day 0 is the cancellation-risk window. The first session must prove value, explain billing clearly, and route users to the first activation task.

## 5. Stripe Required Setup

Use Stripe directly only for web checkout, physical/outside-app goods, B2B invoices, or a chosen web billing engine. For mobile app digital subscriptions, Stripe alone is not enough.

Setup:
- create/verify Stripe account, business profile, branding, support email, statement descriptor, and payout bank
- decide Checkout/Payment Links/Customer Portal vs custom Payment Element; prefer hosted Stripe surfaces for speed and lower risk
- create products and recurring prices if using Stripe Billing
- configure Stripe Tax or explicit tax posture before live subscription sales
- configure customer portal for billing details, invoices, cancellation, and plan changes
- configure webhooks and verify signatures; handle subscription status, invoice paid/failed/finalization failures, payment action required, and cancellation
- use Stripe CLI/sandbox to test all lifecycle events before live mode
- switch to live API keys only after Stripe go-live checklist, webhook endpoint, domain, and terms/privacy pages are ready

Validation:
- test subscription signup
- test failed payment and action-required path
- test customer portal cancellation/update
- verify webhook processing updates the app/backend entitlement source
- verify receipts/emails/support/refund path
- verify public pricing matches Stripe/RevenueCat configured prices

## 6. RevenueCat Web Billing, Purchase Links, And Funnels

RevenueCat Web can support:
- Web Billing with Stripe as payment gateway and RevenueCat managing billing lifecycle
- Stripe Billing connected into RevenueCat Web, where Stripe owns products, subscriptions, emails, and management
- Web Purchase Links for no-code hosted checkout
- Web SDK for custom logged-in web apps
- Web Paywalls and Web Funnels for hosted multi-step web acquisition
- Redemption Links so anonymous web purchasers can redeem access inside the mobile app

Choose:
- **Web Purchase Link** for fastest static landing page checkout.
- **Web Funnel** when paid ads need quiz/onboarding steps before checkout.
- **Web SDK** when the user is logged into a web app and needs a custom checkout UI.
- **Stripe Billing integration** when Stripe products/subscriptions already exist.
- **RevenueCat Web Billing** when starting fresh and wanting RevenueCat-centered subscription lifecycle and reporting.

Required for anonymous web-to-app:
- enable Redemption Links
- register RevenueCat custom URL scheme/deep link in iOS/Android app
- test purchase on a mobile device with the app installed
- show desktop fallback with QR code or install instructions
- handle expired redemption links and support recovery
- verify final entitlement in the mobile app after redemption

Do not publish sandbox purchase links. Keep production and sandbox URLs clearly labeled.

## 7. Pricing And Disclosure Rules

Before publishing pricing:
- founder approves price, trial, intro offer, renewal price, cancellation language, and refund posture
- paywall, landing page, app metadata, screenshots, terms, privacy, store products, RevenueCat offerings, Stripe prices, and analytics all match
- App Store Connect pricing, RevenueCat offering/package IDs, Stripe/web funnel prices, screenshots/app previews, custom product pages, In-App Events, and localized metadata all use the same approved price/trial/renewal facts
- if showing an annual intro offer, keep first-year price, renewal price, and monthly option visible together on direct funnel pages
- avoid fake scarcity, hidden renewal mechanics, or unsupported savings claims
- include platform billing caveats: App Store/Google Play manage in-app purchases; Stripe/RevenueCat/Paddle manage web purchases depending on chosen engine

## 8. Backend And Analytics Contract

Create or update `ANALYTICS.md` and backend docs with:
- stable user ID strategy across app, web, RevenueCat, Stripe, Supabase/Firebase, analytics, and support
- anonymous web purchase and redemption behavior
- purchase events: paywall viewed, product selected, checkout started, purchase completed, entitlement active, restore started/succeeded/failed, cancellation, refund, renewal, billing issue
- revenue source dimensions: platform, store, product_id, offering_id, price, currency, intro/trial state, campaign/source/medium
- webhook events and idempotency keys
- support lookup path for Apple Hide My Email or anonymous purchases

Acceptance:
- a support agent can find a user by app UID, RevenueCat App User ID, Stripe customer ID, store transaction ID, email, or anonymous redemption path.

## 9. Founder-Only Gates

Always ask before:
- creating live Stripe/RevenueCat/Apple/Google products
- changing prices, trials, discounts, intro offers, renewal terms, tax settings, or billing engine
- enabling live checkout or publishing purchase links
- submitting IAP/subscriptions for review
- enabling external purchase links/calls to action in app
- changing refund/cancellation/legal language
- switching from Test Store/sandbox to production

Agents may self-resolve doc organization, sandbox validation sequencing, and which non-live checklist to run first.

# ASO And Store Operations

Use this before writing App Store or Google Play metadata, producing screenshots, running paid-search experiments, submitting builds, handling review issues, or monitoring growth after launch.

This is an orchestration reference. Prefer specialist ASO skills and live store data when available; use this file to decide which lane to run and what evidence must be left behind.

For founder-facing App Store Connect or Google Play Console work, load `store-console-workflow.md` too. ASO decides what to say; the store-console workflow decides exactly where the user clicks, what they paste, which privacy answers are selected, and which screenshots/assets satisfy each upload well.

Load `paid-tool-routing.md` before replacing paid ASO, AppKittie, MobAI, creator-marketplace, or MMP/ad tooling with a free fallback. Load `app-store-connect-cli.md` before using the Rork `asc` CLI or App Store Connect CLI skills for metadata, screenshots, TestFlight, release validation, signing, subscriptions, or RevenueCat catalog sync.

## Contents

- 1. Specialist Skill Delegation
- 2. Required ASO Context
- 3. Metadata And Keyword Gates
- 4. Screenshot And Creative Gates
- 5. Store Console Readiness
- 6. App Store Connect CLI Routing
- 7. Support, Privacy, And Email Routing
- 8. Review And Rejection Playbook
- 9. Post-Launch Growth Loop

## 1. Specialist Skill Delegation

If an ASO skill pack is installed, delegate narrow work instead of re-creating its frameworks:

- `app-marketing-context` - create or refresh the shared context doc before any ASO work.
- `keyword-research` - discover and prioritize App Store or Play Store keywords by market.
- `metadata-optimization` - write title/name, subtitle, keyword field, short description, long description, promotional text, and character-counted variants.
- `screenshot-optimization` - design screenshot slots, app preview strategy, visual hierarchy, and competitor creative teardown.
- `aso-audit` - score the current listing and prioritize fixes.
- `app-launch` - build the launch timeline and channel sequence.
- `apple-search-ads` - structure ASA campaigns, match types, bids, budgets, and custom product page routing.
- `localization` - choose international markets, localized metadata, screenshot localization, and translation posture.
- `review-management` and `rating-prompt-strategy` - analyze reviews, response patterns, prompt timing, and rating recovery.
- `monetization-strategy` and `subscription-lifecycle` - benchmark pricing, trials, paywall timing, churn, dunning, and win-back.
- `app-analytics` and `asc-metrics` - inspect first-party App Store Connect metrics when connected, or define dashboards when not.
- `competitor-analysis` and `competitor-tracking` - run one-time competitor teardown and recurring watchlists.
- `android-aso` - branch to Google Play-specific listing, Data safety, graphics, and store experiments.

If these skills are not directly discoverable in the current runtime, search installed skill/plugin paths for the names above, read the matching `SKILL.md`, and proceed with the same output contract manually. Do not assume Claude and Codex expose the same installed plugin surface.

Before handing work back to the founder, produce or update `STORE_CONSOLE.md`, `store-console.html`, and `SCREENSHOTS.md` when a store submission is in scope.

## 2. Required ASO Context

Create or refresh `app-marketing-context.md` or an equivalent section in `LAUNCH.md` before metadata or screenshots.

Include:
- app name, bundle/platform, target country, category, subcategory, and launch status
- one-line promise, target user, core job, and monetization model
- top 5-10 competitors with app IDs/package names when possible
- primary, secondary, long-tail, competitor, and defensive keyword candidates
- category economics and audience language evidence
- current listing fields, screenshots, ratings, reviews, price, and IAP/subscription state if the app already exists
- public URLs: landing page, support URL, privacy URL, terms URL, account deletion/privacy choices URL

Acceptance:
- Metadata, screenshots, ads, and landing copy all draw from the same context.
- A future agent can identify which market/country the ASO work targets.

## 3. Metadata And Keyword Gates

Before locking metadata:
- run keyword and name collision checks in the target country
- separate brand language from search language
- preserve App Store character counts and Play Store indexed-description strategy
- avoid unsupported health, financial, legal, earnings, urgency, scarcity, endorsement, or superiority claims
- ensure pricing, trial, subscription, and cancellation language matches the paywall, store metadata, terms, and checkout behavior
- create 2-3 variants when uncertainty is real, with a recommendation and rationale

Output:
- final fields ready for App Store Connect/Play Console
- rejected alternatives with reasons
- keyword map showing where each target appears
- source URLs or data snapshots used for evidence

## 4. Screenshot And Creative Gates

Screenshots must sell the product and satisfy platform rules.

Checklist:
- define the first 3 screenshots as the search/product-page conversion set
- show actual app UI or faithful production screens; do not rely on generic generated art
- capture real app UI with MobAI or an equivalent simulator/device workflow when a local build exists
- use XcodeBuildMCP for Apple-platform screenshot capture only after the founder confirms fallback from MobAI
- make the value proposition readable at thumbnail size
- use device sizes and upload slots required for the current platform and app targets
- ensure screenshots do not imply unavailable features, unsupported claims, free trials, prices, competitor comparisons, or endorsements without approval
- localize screenshot copy when localized metadata is shipped
- mark reference art separately from production upload assets

Output:
- screenshot frame table: slot, headline, source screen, visual asset, proof constraint, production file path, locale/device target
- MobAI/raw capture paths, composed asset paths, final upload paths, and the device/display wells each file satisfies
- final image dimensions and upload status
- visual QA notes from desktop and mobile inspection where applicable

## 5. Store Console Readiness

Do not treat ASO as copy only. App Store Connect or Play Console readiness is part of launch.

Load `store-console-workflow.md` and refresh official Apple/Google docs before producing final console packets. Console fields, privacy categories, screenshot wells, target API rules, and review tasks change over time.

Apple checklist:
- bundle ID, SKU, category, age rating, availability, pricing, IAP/subscriptions, review notes, demo credentials, export compliance, and build status are known
- privacy policy URL and optional privacy choices/account deletion URL are live
- App Privacy responses match the actual data inventory and third-party SDKs
- privacy manifest and required-reason API declarations are valid for the app and bundled SDKs
- Accessibility Nutrition Labels are answered or intentionally deferred, and any claimed support is backed by common-task testing on each supported device
- account deletion is available in-app when accounts can be created
- Sign in with Apple token revocation is handled when Sign in with Apple is used
- screenshots and app previews match current App Store Connect specs
- phased release/manual release/automatic release choice is explicit
- final submission or resubmission is founder-approved

Google Play checklist:
- package name, category, content rating, target countries, pricing, subscriptions/IAP, testing track, and release status are known
- privacy policy URL is active, public, non-geofenced, non-editable, and not a PDF
- Data safety answers match actual collection, sharing, retention, deletion, security, and vendor behavior
- account deletion web resource exists when accounts can be created
- feature graphic, screenshots, short description, long description, and store listing experiments are prepared
- App content declarations, app access instructions, sensitive-permission declarations, and pre-launch report status are tracked before production release
- staged rollout/managed publishing choice is explicit

Output:
- `STORE_CONSOLE.md` with click paths, field limits, paste-ready values, evidence, statuses, and blockers
- `store-console.html` with copyable fields grouped by ASC/Play Console page
- `SCREENSHOTS.md` with device capture, dimension, locale, proof, and upload state
- required links and which console fields use them
- final founder-only approval list

## 6. App Store Connect CLI Routing

Use `app-store-connect-cli.md` when the ASC CLI or skill pack can reduce manual work.

Good uses:
- read app/build/version/review status
- resolve IDs
- export or dry-run metadata
- audit keywords
- validate release readiness
- plan screenshots
- inspect TestFlight feedback/crashes
- reconcile ASC products with RevenueCat before applying changes

Founder-gated uses:
- app creation
- metadata apply/push
- screenshot upload/replace
- product/subscription/pricing changes
- signing asset changes
- external TestFlight distribution
- final submission/release/cancel actions

Even when `asc` is used, produce `STORE_CONSOLE.md` and `store-console.html` with manual click paths, paste values, and founder-only approvals.

## 7. Support, Privacy, And Email Routing

Every launch needs working contact routes before public listing, legal pages, or review submission.

Minimum aliases:
- `support@domain` for app support, store review contact, refunds/help, and public footer
- `privacy@domain` for privacy policy, data rights, account deletion, and regulator/store disclosures
- `security@domain` when the app handles accounts, payments, sensitive data, or user content
- `hello@domain` or `contact@domain` for partnerships, press, and general inbound
- founder alias only when the founder wants a public personal route

Cloudflare Email Routing checklist:
- verify destination addresses first
- create custom address rules for each alias
- connect/enable Email Routing at the zone level; individual rules can appear active while global status or DNS records are still disabled
- add or let Cloudflare add the required `MX` and `TXT` DNS records
- keep catch-all disabled/drop unless the founder intentionally wants it monitored; catch-all can increase spam and accidental PII intake
- send tests from an external email account, not the same destination inbox
- verify delivery to inbox and spam, record timestamps and destination
- document outbound behavior separately: Cloudflare Email Routing is inbound forwarding; use a real mailbox, SMTP provider, Cloudflare Email Service, or transactional email provider for sending as the domain

Output:
- alias table: address, purpose, destination, status, last tested, source page/store field
- DNS/routing status evidence
- any send-as or transactional email gap

## 8. Review And Rejection Playbook

When a store review issue occurs:
- read the exact rejection/message and store-console status
- map it to binary behavior, metadata, screenshots, privacy labels, data deletion, IAP/subscription setup, review notes, or account credentials
- reproduce the reviewer path on a clean install where possible
- patch the smallest correct surface
- update `LEGAL_REVIEW.md`, `LAUNCH.md`, screenshots, metadata, or app code as needed
- verify final console state after resubmission because wrapper/API tools can report noisy intermediate errors

Do not stop at advice when the user asks to take care of a rejection end to end. Operationalize the fix, verify the console state, and leave handoff notes.

## 9. Post-Launch Growth Loop

Run a weekly loop for the first 6-8 weeks after launch:
- keyword rank deltas and new keyword opportunities
- conversion rate by product page and screenshot set
- ASA search term mining and negative keywords
- ratings, review themes, and response queue
- crash-free sessions and support volume
- subscription funnel: trial starts, conversion, cancels, refunds, yearly/monthly mix
- competitor metadata, screenshot, ranking, ad, pricing, and review changes
- localization opportunities by country revenue/downloads

Output:
- weekly change log
- prioritized experiments
- decision list for founder-only spend/pricing/submission calls

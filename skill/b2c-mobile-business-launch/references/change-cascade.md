# Change Cascade

A change to a launched (or near-launch) B2C app rarely lives on one surface. Rename a feature and the App Store description, screenshots, landing page, JSON-LD, paywall copy, and RevenueCat product names can all go stale at once. This reference is the **impact-propagation checklist**: given a change, enumerate every surface it touches, update each (or record why it is unaffected), and reconcile before calling the change done.

Use this **after any change to the app, product, brand, pricing, or data behavior** once an App Store listing, landing page, or store assets exist. It pairs with the "Lexicon Lock" in [`flow-traceability.md`](flow-traceability.md) (one vocabulary across every surface).

## Surface Inventory

The full set of surfaces a B2C mobile launch maintains. A cascade check walks the relevant rows of this list.

- **App (in-app):** onboarding copy/flow, core feature UI + copy, paywall copy + plan labels, settings, empty/error states, push/notification copy.
- **App Store Connect listing:** app name, subtitle, promotional text, description, keyword field, "What's New", **screenshots + caption overlays**, **App Preview** video, **App Icon**, **in-app events**, **custom product pages**, and **every localization** of all of the above.
- **App Store Connect products:** IAP/subscription **display names + descriptions**, **promoted-IAP promotional images** (unique per product, never the app icon — see `app-store-connect-cli.md`), pricing, intro/trial offers, **App Review Information notes**.
- **RevenueCat / billing:** offering/package/product display names, paywall configuration, entitlement identifiers, Stripe/web-funnel product copy and prices.
- **Landing / web:** hero, method/how-it-works, FAQ, pricing section, footer, **`<meta>` description + Open Graph**, **JSON-LD / structured data** (description, FAQ, product schema), `robots.txt`/`llms.txt`/`sitemap.xml`.
- **SEO / GEO:** target keywords, citability content, brand-entity signals.
- **Lifecycle email:** transactional + lifecycle templates, brand tokens, plan/price/feature mentions.
- **Analytics:** event names, funnel/dashboard definitions, attribution sources.
- **Legal:** privacy policy, terms, App Privacy answers, Data safety — when data collection, third-party SDKs, or account behavior changes.
- **Content / UGC / ads:** ad creative, demo videos, screenshots reused in ads, creator scripts.

## Change Cascade Map

For each change type, the surfaces most likely to need an update. Treat these as "check and update or justify," not "always edit."

| Change type | Cascade to |
| --- | --- |
| **Feature added / changed / removed** | in-app copy → App Store description + keywords + "What's New" + screenshots/captions + App Preview + in-app events → custom product pages → landing (hero/method/FAQ + meta + JSON-LD) → SEO/GEO keywords → lifecycle email feature mentions → analytics events → privacy/Data safety (if new data/SDK) → ad creative |
| **Core copy / feature name / brand vocabulary change** (lexicon) | **every** surface that names it: in-app, onboarding, paywall, App Store name/subtitle/description/keywords + all localizations, landing hero/method/FAQ + meta description + JSON-LD/FAQ schema, RevenueCat product/offering names, email, ad copy. Run the Lexicon Lock sweep — grep all surfaces, update together. |
| **Onboarding flow change** | onboarding screenshots + App Store screenshot set (if it shows onboarding) → App Preview → activation analytics events/funnels → review-prompt timing → landing "how it works" |
| **Paywall / pricing / plan / trial change** | paywall copy → App Store screenshots that show pricing → IAP/subscription display names + prices + intro offers → RevenueCat offering/packages → Stripe/web funnel → landing pricing section → terms (auto-renew/price disclosure) → lifecycle email (trial/renewal/win-back) → analytics revenue events |
| **Visual / UI / design-token change** | App Store screenshots (re-render) → App Preview → App Icon (if brand mark changed) → landing UI → email brand tokens → ad creative → `DESIGN.md` |
| **New / renamed IAP or subscription product** | RevenueCat product+entitlement+offering → App Store product display name/description/**promo image** → paywall copy → pricing/terms → analytics product IDs → review notes |
| **Privacy / data / SDK change** | `PrivacyInfo.xcprivacy` + required-reason APIs → App Privacy answers → Play Data safety → privacy policy + terms → App Review notes (external services) → analytics/attribution |
| **Domain / brand / company-name change** | everything in "lexicon" + email sender domains + legal entity references + landing footer + App Store seller/marketing URLs |

## Process

1. **Classify the change** against the map above (a change can be more than one type).
2. **Enumerate impacted surfaces.** List each surface from the matching rows. For surfaces with localizations, the cascade applies to **every locale**.
3. **Update or justify each.** Edit the surface, or record one line of why it is unaffected. A surface left stale by omission is the `change-cascade-incomplete` failure card.
4. **Re-render derived assets.** Copy or UI changes that appear in App Store screenshots, App Preview, or ad creative require a **re-render**, not just a doc edit — old screenshots showing old copy will drift and can draw a Guideline 2.3 metadata rejection.
5. **Reconcile the lexicon.** Confirm the canonical terms (from `DESIGN.md`/`BRAND.md`) read identically across in-app, store, landing, schema, RevenueCat, and email.
6. **Record the cascade.** Note the change and the surfaces touched in `LAUNCH_TRACE.md` (or a `CHANGE_LOG.md` for a live app), update `PROJECT_STATE.yaml` lane evidence, and re-render `launch-cockpit.html`.
7. **Gate the public surfaces.** App Store metadata/screenshot/product changes, landing deploys, public posting, pricing, and legal edits remain founder-approved.

## Done Definition

A change is not "done" until: every impacted surface is updated or explicitly marked unaffected; derived assets (screenshots, App Preview, ad creative) are re-rendered where copy/UI changed; the lexicon is consistent across all surfaces; the cascade is recorded in `LAUNCH_TRACE.md`/`CHANGE_LOG.md` and `PROJECT_STATE.yaml`; and public-surface updates are founder-approved.

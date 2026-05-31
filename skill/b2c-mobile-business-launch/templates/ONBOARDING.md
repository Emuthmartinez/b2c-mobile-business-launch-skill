# Onboarding

Status: partial until the flow is product-specific and visually verified.

## Goal

- Target user state before onboarding: define the user's current problem, motivation, and skepticism.
- Desired state after onboarding: the user has seen first value, understands why the app fits them, and knows the next action.
- 11-star mapping: tie the first value/value-reveal moment to `11_STAR_EXPERIENCE.md` and `LAUNCH_TRACE.md`.

## Screen Sequence

| Step | Purpose | Copy / question | State | Visual / motion | Analytics | Back / skip |
| --- | --- | --- | --- | --- | --- | --- |
| Promise | Show what the app does | Product-specific value promise | visible | product demo or truthful prototype | `onboarding_started`, `onboarding_step_viewed` | back allowed |
| Attribution | Capture launch learning | How did you hear about us? | required unless not applicable | simple source list with Other text | `attribution_source_selected` | no skip unless documented |
| Personalization | Collect useful setup | Product-specific question | optional or required per matrix | accessible form controls | `onboarding_answer_selected` | back allowed |
| First value / value-reveal | Show the personalized plan, analysis, demo result, aha moment, or first win | Product-specific first value | visible before paywall | stable mounted screen | `personalized_plan_viewed` | continue allowed |
| App Review popup | Immediately after the first value/value-reveal screen | Native App Review request | eligible only after value is visible | automatic 1-2 second delay while mounted | `review_prompt_eligible`, `review_prompt_requested` | flow continues if suppressed |
| Paywall or activation | Convert or complete first action | Product-specific offer or task | after first value and review request | RevenueCat or activation UI | `paywall_viewed`, `activation_task_completed` | restore/support visible |

## Data Collection Matrix

| Question | Answer options | Personalization use | Attribution use | Lifecycle use | Privacy note | Required |
| --- | --- | --- | --- | --- | --- | --- |
| How did you hear about us? | stable source keys plus `other` text | none | source key, label, UTM/referrer context | segmentation | avoid sensitive data | yes |

## App Review Popup

- Placement: immediately after the first value/value-reveal screen, before paywall or activation detours.
- Native API: iOS uses `SKStoreReviewController.requestReview(in:)`; Android uses Google Play In-App Review / `ReviewManager`.
- Timing: automatically request after the value screen is fully displayed and visible with a 1-2 second async delay.
- Trigger guard: do not bind the request to an acceptance tap or navigation action that dismisses the screen.
- Cooldown: respect platform frequency caps and app-level eligibility rules.
- Analytics: emit `review_prompt_eligible` before the request and `review_prompt_requested` when the native API is called.
- Fallback: the platform may not show the review sheet; continue the onboarding flow without blocking, inferring rating content, or incentivizing reviews.

## Build Handoff Gates

- `onboarding.html` shows the value-reveal screen followed by the App Review popup placeholder.
- `ANALYTICS.md` includes all onboarding, attribution, review prompt, paywall, and activation events.
- `REVENUE_OPS.md`, `PRIVACY.md`, `TERMS.md`, and support links match the flow before implementation.
- `npm run check:onboarding -- --root <app>` passes.

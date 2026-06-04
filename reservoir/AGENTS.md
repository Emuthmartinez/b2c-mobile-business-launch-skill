# Reservoir Agent Guide

This repo is the operating home for Reservoir, a B2C mobile app business.

> Workspace note: Reservoir currently lives in the `reservoir/` folder inside the `b2c-mobile-business-launch` **skill maintainer repo** as a temporary incubation workspace. Before app build, it will be moved into its own repository. Do **not** copy the skill's maintainer `AGENTS.md`/`CLAUDE.md` (at the skill repo root) into this business — this file is the business entrypoint.

Continue using the `b2c-mobile-business-launch` skill for launch, store, revenue, analytics, security, growth, and production-readiness work. Once the skill is active, do not ask the founder to re-invoke it; load the next needed skill reference, update `PROJECT_STATE.yaml`, rerender `launch-cockpit.html`, and run the relevant validators until a founder-only gate is reached.

## 60-Second Brief

- Product: A calm, defensive home emergency-fund app. Homeowners inventory their major systems/appliances; Reservoir computes a recommended cash reserve (a % band of total replacement value), shows how covered they already are, ranks what is most likely to break first, and tracks spend, manuals, spare parts, and trusted pros per item.
- Target user: New / recent homeowners (first ~5 years) blindsided by — or dreading — major repair costs, who want one defensible number instead of vague anxiety.
- Business model: Freemium subscription. Free: inventory + Reserve Number + coverage. Reserve+ (paid): failure-probability ranking, "what breaks first," parts-on-hand, ongoing recommendations. Pricing is founder-gated and not yet set.
- Platforms: iOS first (V1). Android deferred pending founder confirmation.
- Current phase: read `PROJECT_STATE.yaml` and `launch-cockpit.html` (currently `phase_1_research`).
- Primary repos or apps: `reservoir/` workspace (this folder); a dedicated app repo will be created before build.

## Read First

- State and cockpit: `PROJECT_STATE.yaml`, `launch-cockpit.html`
- Design Room: `state/business.json`, `state/theme.tokens.json`, `design-room.html`
- Product and trace: `SPEC.md`, `LAUNCH_TRACE.md`, `11-star-experience/11_STAR_EXPERIENCE.md`, `EMOTIONAL_DESIGN.md`, `BRAND.md`
- Build and operations: `TECH_SPEC.md`, `DESIGN.md`, `ANALYTICS.md`, `SECRETS.md`, `SECURITY.md`
- Orchestration and readiness: `ORCHESTRATION.md`, `PRODUCTION_READINESS.md`, `APP_AGENTS.md`

If a listed file does not exist yet, create or update it through the relevant `b2c-mobile-business-launch` reference instead of inventing a one-off replacement. (Most are not created yet — see `PROJECT_STATE.yaml` for which lanes are scheduled.)

## Session Continuity

- At the start of every new session, resume, status check, or handoff, reconstruct state from `AGENTS.md`, `PROJECT_STATE.yaml`, `launch-cockpit.html`, `ORCHESTRATION.md`, `PRODUCTION_READINESS.md`, `FAILURE_CARDS.md`, and `git status --short` before choosing work.
- Do not rely on chat memory or prior transcripts as source truth; if they conflict with repo state, repo state wins.
- For broad work, route through `APP_AGENTS.md` and role prompts, or record why subagents are unavailable or unsafe in `ORCHESTRATION.md` and `PROJECT_STATE.yaml`.
- After material changes, update state/readiness/failure cards and rerender `launch-cockpit.html` before pausing.

## Source Of Truth

This file is a map, not a product spec. Keep durable product truth in the files below, keep active plans in `PROJECT_STATE.yaml` and `ORCHESTRATION.md`, and keep mechanical enforcement in validators, LaunchBench, and failure cards.

- State and blockers: `PROJECT_STATE.yaml`, `launch-cockpit.html`, `FAILURE_CARDS.md`
- Design Room state: `state/business.json`, `state/theme.tokens.json`, `design-room.html`
- Product and evidence: `RESEARCH.md`, `SPEC.md`, `LAUNCH_TRACE.md`, `11-star-experience/11_STAR_EXPERIENCE.md`, `11-star-experience/11-star-experience.html`, `EMOTIONAL_DESIGN.md`
- Implementation: `TECH_SPEC.md`, `ENGINEERING_PLAN.md`, `ORCHESTRATION.md`, `PRODUCTION_READINESS.md`
- Design and content: `BRAND.md`, `DESIGN.md`, `design.md`, `UX_PATTERNS.md`, `CONTENT_ASSETS.md`, `DEMO_VIDEO.md`
- Growth and stores: `growth/PAID_UA.md`, `growth/VIRAL_GROWTH.md`, `growth/LAUNCH_NARRATIVE.md`, `APP_STORE_LISTING.md`, `APPLE_APP_STORE_REQUIREMENTS.md`, `SCREENSHOTS.md`, `STORE_CONSOLE.md`, `APPLE_SIGNING.md`
- Revenue, lifecycle, and trust: `REVENUE_OPS.md`, `ANALYTICS.md`, `EMAIL_OPS.md`, `PRIVACY.md`, `TERMS.md`, `SECRETS.md`, `SECURITY.md`
- Role routing: `APP_AGENTS.md` and `agents/`

## Scope

V1 scope: iOS app delivering the inventory → Reserve Number → "what breaks first" + parts-on-hand slice (see `11-star-experience/11_STAR_EXPERIENCE.md`), with per-item spend log, manuals, and trusted-pro assignment, freemium with a Reserve+ paywall after the free value lands.

Future scope: live data-source integrations (utility/warranty/permit/MLS), automated valuation refresh, vetted-pro marketplace, true actuarial failure probabilities, Android.

Banned scope (founder-locked): mascot/characters, gamified points/badges/streaks, alarmist "you're at risk" framing, countdown-timer urgency, and any paywall that hides the user's own inventory data.

Do not let builders or agents add product behavior that is not traced from `LAUNCH_TRACE.md`, the 11-star V1 scalable slice, or an explicit founder-approved scope change.

## Engineering

- Stack: not yet locked. Leaning iOS-native (SwiftUI) with local-first persistence and read-only reference tables; RevenueCat for entitlements; PostHog for analytics. Confirm at the Phase 1f/5b engineering checkpoint and record in `TECH_SPEC.md`.
- Run commands through the repo's package manager and scripts when available. Record exact verification in `PRODUCTION_READINESS.md`.
- Use Compound Engineering routes when available: `ce-update` or latest-release fallback, `ce-brainstorm` for unresolved product shape, `ce-plan`, `ce-work`, `ce-worktree`, `ce-code-review`, applicable CE test skills, and `ce-proof`/`ce-demo-reel` before readiness claims. Record the route in `PROJECT_STATE.yaml` `compound_engineering`, `ORCHESTRATION.md`, `ENGINEERING_PLAN.md`, and `PRODUCTION_READINESS.md`. If unavailable, record the fallback reason and keep the lane partial.
- Use `ORCHESTRATION.md` before parallel work. Parallel agents are for independent audits or isolated file ownership only; serialize shared files, migrations, provider/account mutations, device control, git, releases, pricing/legal/public posting, submissions, and final readiness.
- Backend/frontend proof must show real data, provider state, analytics events, entitlement state, email delivery, or store/signing state where those lanes are in scope.

## Design And UX

- All design work follows STATE -> MUTATE -> VERSION -> RENDER. Mutate `state/business.json` and `state/theme.tokens.json`, render `design-room.html`, and version/baseline with git instead of creating one-off design proposal files.
- `DESIGN.md` owns tokens, voice, components, visual rules, and the tokenized `motion.*` scale. Motion communicates steadiness, never excitement; honor reduced motion on every surface. Web surfaces use framer-motion/`motion` from the promoted `--motion-*` variables; the mobile binary uses native animation from `DesignTokens.Motion` and must never import framer-motion.
- HTML proofs must be opened and checked on mobile and desktop before visual work is called ready.
- Onboarding, paywall, review prompt, empty/loading/error/offline states, screenshots, and content assets must trace to the 11-star V1 scalable slice.
- When the 11-star target is 6-star or higher, `EMOTIONAL_DESIGN.md` owns the Experience Card map, ethics guardrails, PostHog events, reduced-motion fallbacks, and counter-metrics. Run `npm run check:emotional-design -- --root .` before build or store handoff. Note: Reservoir's brand explicitly bans dark patterns and gamification — engineered emotion here means *calm and trust*, not extraction.
- `BRAND.md` owns voice, owned words, banned language, and claim boundaries.
- Store screenshots need `SCREENSHOTS.md`; demo/app-preview video needs `DEMO_VIDEO.md`; iOS upload readiness needs `APPLE_APP_STORE_REQUIREMENTS.md`.

## Store Ops

- Use `app-store-connect-cli.md` before all App Store Connect work. ASC CLI/skill routes can cover app creation, app-record inspection, metadata, screenshots, TestFlight, review/status reads, products/subscriptions, and RevenueCat catalog reconciliation.
- Do not answer that an agent cannot create the app until ASC CLI auth, account role, agreements, current `asc --help`, and the ASC skill pack have been checked. Blocked auth or unapproved sticky fields are founder gates.

## Analytics, Revenue, And Secrets

- `ANALYTICS.md` owns event names, identity, attribution, funnels, dashboards, and QA proof. Attribution is a data contract (stable source keys, `attribution_source_selected`, PostHog `self_reported_source`, persistence, anonymous-to-identified reconciliation).
- `REVENUE_OPS.md` owns products, prices, entitlements, webhooks, restore/refund flows, and purchase proof.
- `SECRETS.md` owns all secret names, locations, command wrappers, and CI/deploy injection. Use Doppler by default. Never commit, print, screenshot, or log raw secret values.

## Security And Compliance

- `SECURITY.md` and `security-review.html` are release-lane artifacts, not optional polish. Note: Reservoir stores a user's home inventory and rough valuations — treat that as sensitive personal/financial data in the threat model and privacy answers.
- Public privacy, terms, pricing, subscription, financial, and security claims require source truth and founder approval.

## Founder-Only Gates

Ask before: locking the business name / buying a domain (name "Reservoir" is provisional pending collision check), credentials, account access, paid signups or spend, pricing changes, billing/subscription moves, DNS/MX changes, legal approval, public posting or scheduling, app-store submission, destructive actions, force pushes, production data mutations, or final release decisions.

## Common Mistakes

- Do not replace the launch skill with a generic app-build prompt.
- Do not copy maintainer instructions from the skill repo into this business repo.
- Do not treat simulator success, mocked data, local-only UI events, or prose-only plans as production proof.
- Do not silently downgrade paid/account-gated tooling to free fallbacks; record approval or blockers in `TOOL_DECISIONS.md`.
- Do not introduce gamification, a mascot, or alarmist framing — they are founder-banned for this brand.

## Verification

Run installed-skill validators against this folder. From the installed skill (or this maintainer repo's `skill/b2c-mobile-business-launch`):

```bash
npm run validate:launch-state -- --root /path/to/reservoir --state PROJECT_STATE.yaml
npm run validate:design-state -- --root /path/to/reservoir
npm run check:11-star -- --root /path/to/reservoir --state PROJECT_STATE.yaml
npm run render:launch-cockpit -- --root /path/to/reservoir --state PROJECT_STATE.yaml --out /path/to/reservoir/launch-cockpit.html
```

Add lane-specific checks for secrets, security, onboarding, attribution, store, and emotional design whenever those lanes are in scope.

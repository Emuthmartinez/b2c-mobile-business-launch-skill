---
name: b2c-mobile-business-launch
description: Use when launching or preparing to launch a B2C mobile app business from an idea, transcript, spec, or early repo. Covers research, paid-tool fallback routing, Doppler/secret management, traceability, PostHog analytics and attribution, DESIGN.md and HTML proofs, onboarding/paywalls, ASO/store-console packets, App Store Connect CLI, MobAI or XcodeBuildMCP testing, RevenueCat/Stripe, privacy/terms, Resend, GEO/SEO, UGC, Fastlane AI, funnels, technical specs, APP_AGENTS.md, and builder handoff. Use for launch packages, store submission prep, pre-launch funnels, UGC/social growth, or post-launch marketing; not narrow one-off code fixes.
metadata:
  short-description: Launch a B2C mobile app business end to end
---

# B2C Mobile Business Launch

This skill turns an app idea into a launchable business package: evidence, positioning, design, ASO, implementation handoff, pre-launch funnel, analytics, and verification.

The model case is the Ocho launch session: AppKittie economics first, social-language research second, canonical docs third, then a Rork-ready bundle and a live waitlist funnel. Keep the workflow generic; do not copy Ocho-specific names, prices, tokens, domains, or credentials unless the current project explicitly owns them.

## Start Here

1. **Recover source truth.** Read the user-provided transcript/spec/repo artifacts and identify the current business name, product wedge, target platform, monetization intent, and current phase.
2. **Resolve paid-tool routing before fallbacks.** Use [`references/paid-tool-routing.md`](references/paid-tool-routing.md) before replacing AppKittie, XPOZ, Firecrawl, Higgsfield, MobAI, Fastlane, paid ASO/MMP tools, creator marketplaces, RevenueCat/Stripe/PostHog/Resend account features, or any other paid/account-gated tool with a free route. Missing runtime access is not permission to spend tokens on a fallback.
3. **Route secrets before service setup.** Use [`references/secrets-management.md`](references/secrets-management.md) and [`templates/secrets/`](templates/secrets/) before adding API keys, tokens, OAuth credentials, webhook signing secrets, service-account files, CI/deploy env vars, or local `.env` files. Default to Doppler and `doppler run --` unless the founder approves another secret path. Refresh current Doppler official docs and local CLI help before install/setup/service-token commands, and record the docs/version basis in `SECRETS.md`.
4. **Map the phase and coverage gaps.** Use [`references/launch-phases.md`](references/launch-phases.md) to decide where the work starts, and [`references/launch-coverage.md`](references/launch-coverage.md) when auditing whether all B2C launch bases are covered.
5. **Create/refresh canonical artifacts.** Use [`references/artifact-contracts.md`](references/artifact-contracts.md) for required docs, acceptance criteria, and handoff shape.
6. **Keep evidence connected to build decisions.** Use [`references/flow-traceability.md`](references/flow-traceability.md) before moving from research to brand/design or from design to implementation. Create `LAUNCH_TRACE.md` for multi-artifact launches and `TECH_SPEC.md` when data, API, state, permissions, platform, or integration behavior must be built.
7. **Plan analytics and attribution before locking surfaces.** Use [`references/analytics-attribution.md`](references/analytics-attribution.md) before onboarding, paywalls, funnels, app-store CTAs, referrals, email lifecycle, UGC/Fastlane campaigns, or builder prompts. Produce `ANALYTICS.md` and a founder-visible `analytics-plan.html` early so measurement is inspectable before launch work hardens.
8. **Plan engineering orchestration before app build.** Use [`references/engineering-orchestration.md`](references/engineering-orchestration.md) before actual app implementation, backend/frontend work, Compound Engineering routing, parallel agents, worktrees, `AGENTS.md`/`CLAUDE.md`, `ENGINEERING_PLAN.md`, `PRODUCTION_READINESS.md`, MobAI/XcodeBuildMCP E2E, or production-readiness claims. For XcodeBuildMCP, refresh live official docs and local CLI/tool help before setup, command examples, or proof claims.
9. **Ship app-local agent roles.** Use [`references/app-agent-roster.md`](references/app-agent-roster.md) and [`templates/app-agent-roster/`](templates/app-agent-roster/) before creating app handoffs, builder-ready bundles, `AGENTS.md`, `CLAUDE.md`, or post-launch operating docs. Real app builds should include `APP_AGENTS.md` and six simple role prompts under `agents/`: orchestrator, marketing, engineering, product, design, and customer success.
10. **Make the visual system inspectable.** Use [`references/design-visual-system.md`](references/design-visual-system.md) before brand/design work, `DESIGN.md`, lowercase `design.md`, generated visual concepts, Higgsfield assets, screenshot mockups, landing UI, animations, icons, or mobile app screen specs. All visual outputs should be rendered as HTML that uses the project design tokens.
11. **Treat onboarding as the sales surface.** Use [`references/onboarding-conversion.md`](references/onboarding-conversion.md) before onboarding quizzes, personalization, attribution questions, mascots, demo videos, review prompts, paywall timing, closing offers, trials, or first-session activation work.
12. **Treat ASO and store operations as a specialist lane.** Use [`references/aso-store-ops.md`](references/aso-store-ops.md) before App Store/Google Play metadata, screenshots, Apple Search Ads, launch reviews, or post-launch growth loops. Use [`references/store-console-workflow.md`](references/store-console-workflow.md) before App Store Connect/Google Play Console setup, privacy forms, screenshot upload/capture, review notes, or founder-facing console instructions. Use [`references/app-store-connect-cli.md`](references/app-store-connect-cli.md) before automating App Store Connect with the Rork `asc` CLI or CLI skill pack.
13. **Make the public funnel AI-search visible.** Use [`references/geo-seo.md`](references/geo-seo.md) before publishing, auditing, or materially changing landing pages, policy pages, documentation, blog/content, `robots.txt`, `llms.txt`, sitemap, schema, metadata, or AI-crawler access.
14. **Set up monetization as purchase-to-access infrastructure.** Use [`references/revenue-monetization.md`](references/revenue-monetization.md) before RevenueCat, Stripe, app-store products, web billing, web purchase links, funnels, paywalls, subscriptions, webhooks, taxes, pricing, or entitlement validation.
15. **Handle privacy and terms deliberately.** Use [`references/privacy-terms.md`](references/privacy-terms.md) before drafting or publishing privacy policy, terms of service, EULA, subscription, data deletion, or app-store privacy disclosures.
16. **Set up outbound and lifecycle email deliberately.** Use [`references/resend-email-ops.md`](references/resend-email-ops.md) before Resend domains, API keys, transactional email, lifecycle automations, broadcasts, contacts/topics, webhook events, inbound email, unsubscribe handling, deliverability work, or starter email templates. Use [`templates/resend/email-templates.ts`](templates/resend/email-templates.ts) for common waitlist, support, entitlement-grant, restore-purchase, billing, trial, and deletion messages when Resend is selected. Populate email brand/design tokens from the project's `DESIGN.md` before production sends.
17. **Turn launch proof into a post-launch content engine.** Use [`references/ugc-creator-engine.md`](references/ugc-creator-engine.md) before creator-led organic growth, founder-led TikTok/Reels/Shorts, UGC sourcing, creator contracts, or format-discovery tests. Use [`references/fastlane-growth-ops.md`](references/fastlane-growth-ops.md) after launch approval, public beta, or when the user asks for Fastlane/usefastlane.ai setup, social account connections, Blitz campaigns, generated organic content, scheduling, or short-form analytics.
18. **Use live research and deployment truth.** Use [`references/tool-recipes.md`](references/tool-recipes.md) for AppKittie, XPOZ/social research, Doppler/secrets, domain, analytics, Cloudflare Email Routing, Cloudflare/Supabase/PostHog, Higgsfield visual/motion, MobAI, XcodeBuildMCP, Fastlane, Compound Engineering, parallel agents, and Resend recipes. Any setup path with fast-moving CLIs or docs must record the current documentation basis instead of relying on stored examples.
19. **Stop only at real gates.** Ask the founder for access, payments, domain purchases, credential changes, pricing approval, legal approval, destructive repo actions, connecting social accounts, public posting/scheduling, or final ship/merge decisions. Resolve bounded strategy/design choices yourself, preferably with `llm-council` when available.

## Operating Posture

- Evidence beats taste. Category, pricing, keywords, social language, and moat claims need App Store, competitor, review, XPOZ/social, or live funnel evidence.
- Lock phase outputs before depending on them. Do not build design from an unlocked spec, ASO from an unlocked name, or a landing page from drifting pricing/voice.
- Do not silently downgrade paid/account-gated tooling. Missing runtime access means ask, wait for access/export, or use a founder-approved fallback.
- Preserve a clear source of truth. Every launch should leave an `AGENTS.md` or equivalent agent entrypoint, plus product, brand, design, analytics, launch, and prompt/handoff docs where appropriate.
- Treat public claims as liabilities. Avoid unsupported endorsement, revenue, neuroscience, health, urgency, scarcity, and pricing claims.
- Verify what shipped. For landing and funnel work, run local build, deploy checks, live HTTP checks, form submission smoke tests, analytics event verification, Firecrawl/web-crawl checks where useful, GEO/SEO and AI-crawler checks, and mobile/desktop visual QA.

## Default Phase Flow

1. **Phase 0: orient and scaffold** - repo/source inventory, constraints, phase tasks, current blockers.
2. **Phase 0b: paid-tool access and fallback routing** - identify paid/account-gated lanes, ask before free fallbacks, record `TOOL_DECISIONS.md`, and separate blocked access from approved fallback work.
3. **Phase 0c: secrets baseline** - create `SECRETS.md`, select Doppler or approved alternative, map local/staging/production secret locations, add `doppler.yaml` and `.env.example` names only when useful, and route new secrets as they appear.
4. **Phase 1: research-backed spec** - category economics, competitor deep dives, review/social language, keyword scan, name collision, revised spec with evidence ledger.
5. **Phase 1b: analytics and attribution blueprint** - current PostHog doc map, identity plan, UTM/referrer/deep-link/self-reported attribution, event catalog, dashboards, experiment plan, privacy guardrails, QA plan, `analytics-plan.html`.
6. **Phase 1c: product brainstorm checkpoint** - use Compound Engineering `ce-brainstorm` when research leaves multiple valid product shapes before specs become implementation plans.
7. **Phase 1d: launch trace and build contracts** - `LAUNCH_TRACE.md` maps evidence to product, brand/design, build, analytics, revenue, privacy, store, and verification decisions; `TECH_SPEC.md` is created when implementation needs data/API/state contracts.
8. **Phase 2: brand and design** - brand rules, `DESIGN.md` token/prose system, Higgsfield-backed visuals/motion/icons/mascots, lowercase `design.md` screen spec, rendered HTML visual proofs, key generated or sourced assets, outreach drafts if partnerships matter.
9. **Phase 3: launch dossier and store ops** - ASO context, App Store/Play metadata, screenshots, paid/social ad library, Apple Search Ads, App Store Connect/Play Console readiness, optional `asc` CLI routing, `STORE_CONSOLE.md`, `store-console.html`, MobAI or confirmed XcodeBuildMCP screenshot matrix, review/rejection playbook, launch calendar, monetization metrics, open founder decisions.
10. **Phase 3b: revenue and monetization ops** - RevenueCat, app-store products, Stripe/Web Billing choice, web purchase links/funnels, paywall, entitlement identity, webhooks, pricing/legal gates, sandbox and production purchase validation.
11. **Phase 4: pre-launch funnel** - landing page, waitlist/referral loop, optional web monetization funnel, domain, routed support/privacy email aliases, Resend outbound/lifecycle email, Supabase/RPC or equivalent backend, PostHog/GA/Sentry, security headers, GEO/SEO, AI crawler access, robots/sitemap/llms/schema, live deploy verification.
12. **Phase 5: builder/agent handoff** - Rork/agent prompt sequence, `AGENTS.md`, `CLAUDE.md`, `APP_AGENTS.md`, `agents/`, `SECRETS.md`, `LAUNCH_TRACE.md`, `TECH_SPEC.md`, analytics catalog, V1/V2 scope locks, asset bundle, push/commit instructions, audit prompt.
13. **Phase 5b: engineering orchestration and production readiness** - Compound Engineering `ce-plan`/`ce-work`, safe parallel agents/worktrees, MobAI or confirmed XcodeBuildMCP device/simulator E2E, backend/frontend proof, secret injection proof, review, `ENGINEERING_PLAN.md`, and `PRODUCTION_READINESS.md`.
14. **Phase 6: post-launch UGC/Fastlane growth engine** - UGC fit check, 90-day creator format-discovery plan, Fastlane workspace setup, social account connections, API key handling, Blitz angles/preferences, MobAI/XcodeBuildMCP/Higgsfield media inputs, generated content QA, scheduling approvals, analytics snapshots, weekly iteration loop.

## Deliverable Standard

A launch package is not complete until a future agent can pick it up without re-deciding the business:

- what the app is and who it is for
- what paid/account-gated tools were intended, whether the founder confirmed paid access or fallback use, and what `TOOL_DECISIONS.md` says
- what `SECRETS.md` says about Doppler or approved secret-provider routing, local/staging/production configs, service tokens, command wrappers, and new-secret handling
- what category it competes in and why
- what the app must ship in V1, what is explicitly V2/V3, and what is banned
- what `LAUNCH_TRACE.md` says about how research became product, brand, design, build, store, legal, revenue, analytics, and verification decisions
- what the brand sounds and looks like
- what `DESIGN.md` tokens/components govern the UI, and what HTML proofs demonstrate the system in use
- what analytics and attribution plan will be visible to the founder upfront, which current PostHog docs informed it, and what `analytics-plan.html` shows
- what self-reported attribution data contract exists: early screen, stable source keys, `other` free text, PostHog person property, backend/profile persistence, anonymous-to-identified reconciliation, and verification evidence
- what product decisions were resolved after research, and whether Compound Engineering `ce-brainstorm` produced the requirements source before implementation planning
- what onboarding sequence sells the value, collects personalization/attribution data, times review prompts, and routes to the right paywall/offer
- what analytics events, identity links, attribution properties, funnels, dashboards, experiments, session replay/survey settings, and QA probes define activation, conversion, retention, and growth
- what App Store listing, screenshot, ad, and launch sequence to use
- what exact App Store Connect and Google Play Console pages the founder must visit, what to paste in each field, which `asc` CLI commands can safely assist, and which items require founder approval
- what store-console, screenshot, ASO, ratings/reviews, localization, and post-launch monitoring loops are required
- what device screenshots must be captured with MobAI, confirmed XcodeBuildMCP fallback, or equivalent tooling, which final upload wells they satisfy, and which screenshots are still blocked
- what RevenueCat/Stripe/app-store products unlock, how purchases map to entitlements, and how web purchases redeem in app
- what privacy, terms, account deletion, subscription, and app-store data disclosures say
- what support/privacy/security email addresses exist, route to, and have been tested
- what transactional, lifecycle, broadcast, unsubscribe, and inbound/reply email paths exist, how Resend is configured, which starter templates were copied or adapted, and how those templates map to `DESIGN.md`
- what public pages are crawlable, citeable, schema-marked, and discoverable by AI/search systems
- what Fastlane workspace, social connections, content angles, Blitz preferences, approved media inputs, schedule, and analytics loop exist after launch
- what UGC fit decision, 90-day creator plan, creator budget, sourcing approach, script/format loop, disclosure rules, and stop/scale thresholds exist
- what repo/docs/assets a builder should read first
- what `TECH_SPEC.md` says about data model, API contracts, app states, permissions, integrations, feature flags, app integrity, and fixtures when implementation is in scope
- what `AGENTS.md`, `CLAUDE.md`, `APP_AGENTS.md`, and `agents/` say, what `ENGINEERING_PLAN.md` and `PRODUCTION_READINESS.md` require, what Compound Engineering plan/execution path applies, where parallel agents/worktrees are safe, and what production-readiness proof is required
- what is live, what was verified, and what still requires founder action

## When To Load References

- Load `launch-phases.md` for any multi-phase launch or continuation.
- Load `paid-tool-routing.md` before using or replacing any paid/account-gated third-party tool, before running a free fallback, or when a service is missing from the current runtime.
- Load `secrets-management.md` before adding API keys, environment variables, Doppler setup, service tokens, OAuth credentials, webhook signing secrets, store credentials, CI/deploy secrets, `.env` files, or any command that needs secret injection. Refresh current Doppler docs and local CLI help before install/setup/live-environment instructions.
- Load `launch-coverage.md` when the user asks "what else is missing", "are all bases covered", "launch readiness", or when moving from planning to build/submission.
- Load `artifact-contracts.md` when writing docs, handoff bundles, or acceptance criteria.
- Load `flow-traceability.md` before crossing phase boundaries, creating `LAUNCH_TRACE.md`, deciding whether `TECH_SPEC.md` is needed, or auditing whether research flows into design/brand and implementation specs.
- Load `analytics-attribution.md` before analytics planning, PostHog setup, event catalogs, dashboards, attribution, campaign links, deep links, referral loops, funnels, feature flags, experiments, session replay, surveys, or any build prompt that names events.
- Load `engineering-orchestration.md` before actual app build work, backend/frontend implementation, `AGENTS.md`/`CLAUDE.md`, `ENGINEERING_PLAN.md`, `PRODUCTION_READINESS.md`, Compound Engineering routing, parallel subagents, worktrees, MobAI E2E, backend/frontend proof, production-readiness docs, or app handoff prompts that lead to implementation.
- Load `app-agent-roster.md` before creating `APP_AGENTS.md`, app-local `agents/`, builder-ready bundles, post-launch role prompts, or specialist audit routing.
- Load [`references/xcodebuildmcp-testing.md`](references/xcodebuildmcp-testing.md) when MobAI is unavailable and the founder confirms an Apple-platform free/open-source testing fallback, or when XcodeBuildMCP install/setup/client/CLI/config/tool/privacy/skills guidance is needed. Refresh official docs plus local `xcodebuildmcp --help`/tool lists before writing commands or proof.
- Load `design-visual-system.md` before creating or changing `DESIGN.md`, lowercase `design.md`, visual systems, UI mockups, screenshot frames, design audits, or HTML visual artifacts.
- Load `onboarding-conversion.md` before onboarding flows, personalization quizzes, mascot guidance, demo videos, review prompts, hard/soft paywall timing, closing offers, trial strategy, first-session conversion, or onboarding analytics.
- Load `aso-store-ops.md` before App Store/Play metadata, screenshot planning, ASO audits, keyword research, Apple Search Ads, release/rejection handling, ratings/reviews, localization, or post-launch monitoring.
- Load `store-console-workflow.md` before App Store Connect or Google Play Console setup, privacy labels/Data safety, screenshot capture/upload, reviewer notes, account deletion console work, MobAI store-screenshot capture, or any user-facing "where do I click and what do I paste" handoff.
- Load `app-store-connect-cli.md` before using the Rork `asc` CLI, the App Store Connect CLI skill pack, ASC metadata sync, screenshot upload, TestFlight orchestration, release validation, signing, or RevenueCat catalog sync.
- Load `geo-seo.md` before publishing or auditing public pages, SEO metadata, `robots.txt`, `sitemap.xml`, `llms.txt`, schema, AI crawler access, brand/entity signals, citability, or AI-search visibility.
- Load `revenue-monetization.md` before subscription strategy, RevenueCat setup, Stripe setup, web billing/funnels, app-store products, paywall implementation, entitlement identity, webhooks, taxes, pricing disclosure, restore purchases, or purchase validation.
- Load `privacy-terms.md` before drafting legal/public policy pages, App Store privacy answers, Google Play Data safety answers, subscription terms, account deletion pages, or data deletion flows.
- Load `resend-email-ops.md` before Resend setup, transactional email, lifecycle automations, broadcasts, audiences/contacts/topics/segments, sender-domain DNS, webhooks, inbound receiving, unsubscribe handling, deliverability checks, or common email-template creation.
- Load `ugc-creator-engine.md` before founder-led organic social, TikTok/Reels/Shorts UGC, creator sourcing, creator contracts, creator payments, Sideshift/creator marketplace use, format-discovery tests, or UGC-to-Fastlane planning.
- Load `fastlane-growth-ops.md` after launch approval/public beta or before usefastlane.ai setup, Fastlane guide/API work, social account connection, Blitz angle/preference changes, content generation, scheduling, canceling posts, or social analytics.
- Load `tool-recipes.md` when running research, setting up the funnel, configuring domain/email routing, checking analytics, choosing stack, or verifying deployment.

# B2C Launch Coverage Audit

Use this when auditing whether a B2C mobile app launch is complete. The goal is to find missing launch lanes before they become store rejections, failed payments, weak acquisition, support chaos, or unmeasurable growth.

Classify each lane as `done`, `partial`, `blocked`, `not needed`, or `deferred with reason`. Do not mark a lane done unless there is an artifact, live dashboard, code path, or verification note.

## Contents

- Coverage Matrix
- Must-Have For Any Real Launch
- Optional But High-Leverage
- Common Missing Pieces
- Audit Output

## Coverage Matrix

| Lane | Required Evidence | Primary Tools |
| --- | --- | --- |
| Project state/cockpit | `PROJECT_STATE.yaml` phase/mode/lanes/providers/proof/failure cards, rendered `launch-cockpit.html`, validator status | `project-state.md`, `autonomy-modes.md`, bundled TS scripts |
| Paid-tool routing | intended paid/account-gated tools, founder confirmation, selected fallback or blocked state, limitations | `TOOL_DECISIONS.md`, `paid-tool-routing.md` |
| Secrets/config | Doppler or approved provider, `SECRETS.md`, command wrappers, CI/deploy injection, secret scan, public/server-only classification | Doppler CLI, `SECRETS.md`, platform secret stores |
| Market/category selection | category economics, competitor map, revenue/download ranges, winning wedge | AppKittie, ASO skills |
| Social/user language | pain language, creator formats, objections, screenshots/posts summarized | XPOZ, reviews, web search |
| Competitor web intelligence | competitor landing pages, pricing, funnels, claims, policies, changelog | Firecrawl map/scrape/crawl/extract |
| Product spec | V1/V2/V3, core loop, activation, scope exclusions, risks | `SPEC.md` |
| Evidence-to-build trace | evidence IDs, decision trace, build contracts, verification map, rejected decisions | `LAUNCH_TRACE.md`, `flow-traceability.md` |
| Engineering orchestration | product brainstorm decision, `AGENTS.md`, `CLAUDE.md` when needed, implementation plan, parallel-agent map, E2E readiness proof | Compound Engineering, MobAI, `ENGINEERING_PLAN.md`, `PRODUCTION_READINESS.md` |
| Technical build contracts | data model, API/RPC/webhooks, auth/session, app states, permissions, integrations, app integrity, fixtures | `TECH_SPEC.md`, `ENGINEERING_PLAN.md` |
| Brand/design | voice, `DESIGN.md` token system, screen spec, rendered HTML proofs, asset rules, accessibility | `BRAND.md`, `DESIGN.md`, `design.md`, `design.html` |
| Onboarding/conversion | personalization, mascot/demo, attribution, review prompt, paywall timing, closing offer, activation | `ONBOARDING.md`, `onboarding.html`, `ANALYTICS.md` |
| ASO/store listing | metadata, keyword map, screenshots, category, localization, review strategy | ASO skills, AppKittie |
| Store-console readiness | `STORE_CONSOLE.md`, `store-console.html`, build/version, IAP/subscriptions, privacy labels/Data safety, review notes, account deletion, screenshots, optional `asc` CLI dry-runs | App Store Connect, Play Console, App Store Connect CLI, MobAI, XcodeBuildMCP fallback |
| Apple signing/release | Apple Developer membership, Team ID, bundle ID/App ID, app record, capabilities, certificates/profiles, archive/export/upload/TestFlight status, founder-only gates | `APPLE_SIGNING.md`, Xcode, XcodeBuildMCP, ASC CLI, App Store Connect |
| Revenue | RevenueCat/Stripe/app-store products, entitlement mapping, web checkout, restore, webhooks | `revenue-monetization.md` |
| Funnel | landing, waitlist/preorder/checkout, referral, support/privacy email, analytics | Cloudflare, Supabase, PostHog, Resend |
| GEO/SEO | metadata, schema, robots, sitemap, `llms.txt`, AI crawler access, citability | GEO skills, Firecrawl |
| Privacy/legal | privacy, terms, EULA, data deletion, subscription disclosures, source URLs | `privacy-terms.md` |
| Analytics/attribution | current PostHog doc map, identity model, event catalog, attribution matrix, dashboards, experiments, replay/survey posture, QA | `ANALYTICS.md`, `analytics-plan.html`, PostHog, GA4, RevenueCat, ASC |
| Crash/performance | crash reporting, release health, logs, alert routing, performance budget | Sentry, store crash reports |
| Email/deliverability | Resend domains, SPF/DKIM/DMARC, API keys, sends, webhooks, contacts/topics, unsubscribe, inbound | `EMAIL_OPS.md`, Resend docs |
| Lifecycle messaging | transactional email, push, onboarding nudges, trial/renewal/win-back, unsubscribe rules | Resend, provider docs, PostHog/Customer.io/Loops/FCM/APNs |
| Support/reputation | support inbox, refund path, review responses, help docs, incident escalation | email routing, support tool |
| QA/beta/release | TestFlight/internal testing, smoke tests, device matrix, rollback/kill switch | store consoles, test skills, MobAI, XcodeBuildMCP fallback |
| Security/abuse | RLS/auth rules, rate limits, secrets, PII minimization, admin access, bot defenses | repo audit, Supabase/Cloudflare |
| Organic social growth | UGC fit/90-day creator plan, Fastlane workspace, connected accounts, campaign angles, media inputs, polished demo videos, schedule, QA, analytics loop | UGC playbook, Fastlane AI, MobAI recorder skills, XcodeBuildMCP fallback, Higgsfield, PostHog |
| Post-launch loop | weekly ASO, reviews, rankings, conversion, retention, revenue, competitor deltas | AppKittie, ASO skills, RevenueCat, PostHog |
| LaunchBench/failure cards | known failure scenarios checked, active cards tracked, deterministic validators run where available | `launchbench-evals.md`, `failure-cards.md`, `PROJECT_STATE.yaml`, bundled TS scripts |

## Must-Have For Any Real Launch

Required unless explicitly marked not applicable:
- `PROJECT_STATE.yaml` and `launch-cockpit.html` for multi-lane launches, handoffs, continuations, or readiness audits; current phase, autonomy mode, lane status, provider state, proof, blockers, and active failure cards must be visible
- research-backed spec and category choice
- paid/account-gated tool decisions recorded before free fallbacks are used
- `SECRETS.md` when any API key, token, OAuth credential, webhook signing secret, store credential, service-account file, CI/deploy env var, or `.env` file is needed; default to Doppler unless the founder approves another provider
- `LAUNCH_TRACE.md` or equivalent trace section for any multi-artifact launch, so research decisions flow into product, brand/design, build, analytics, revenue, privacy, store, and verification work
- product brainstorm checkpoint after research and before engineering plans when multiple product shapes remain viable
- canonical `DESIGN.md` and rendered HTML visual proof when visual design, screenshots, or landing UI are in scope
- `TECH_SPEC.md` when implementation includes backend APIs, database/storage, auth, subscriptions, email, analytics, AI, push, account deletion, app integrity, or non-trivial platform behavior
- `AGENTS.md` for any real app build or builder handoff, plus `CLAUDE.md` when Claude/Rork/tooling expects it
- `ENGINEERING_PLAN.md` before implementation when actual frontend/backend/app build work is in scope
- `PRODUCTION_READINESS.md` with frontend, backend, provider, mobile-device, and release evidence before beta, store submission, or launch is called ready
- onboarding/paywall flow proof when the app asks setup questions, uses a paywall, or depends on first-session conversion
- public privacy and terms pages when collecting data or payments
- support and privacy contact routes tested from external sender
- upfront analytics/attribution plan rendered for the founder, plus event catalog and at least one verified event when implementation exists
- self-reported attribution data contract when onboarding/signup/waitlist exists: early visible screen, stable source keys, `other` free text, `attribution_source_selected`, PostHog person property, backend/profile persistence, and anonymous-to-identified reconciliation
- Resend or equivalent email path verified when the launch sends confirmation, lifecycle, marketing, billing, support, or admin email
- App Store/Play product and privacy disclosure mapping when submitting
- copy-paste App Store Connect/Google Play packet with exact click paths, field values, privacy answers, screenshot upload matrix, and founder-only gates when submitting
- `APPLE_SIGNING.md` when Apple distribution, TestFlight, physical-device signing, or first upload readiness is in scope; simulator builds alone are not release proof
- RevenueCat/Stripe/store products only if monetization is active, with purchase-to-entitlement validation
- live domain checks: HTTP 200, HTTPS, metadata, security headers, robots/sitemap/`llms.txt`, schema where public site exists
- release health: crash/error monitoring or a documented no-Sentry reason
- support path for account deletion, refunds, restore purchases, and billing issues
- UGC/Fastlane or equivalent post-launch organic content engine when the launch depends on social distribution, marked deferred if not yet needed
- `DEMO_VIDEO.md` or equivalent when launch/store/social/support work needs app-flow demo videos, with MobAI recorder or desktop recorder artifacts linked
- LaunchBench or deterministic validator evidence for known failure modes before a launch is described as complete

## Optional But High-Leverage

Add when the launch depends on paid acquisition, creators, web checkout, or rapid iteration:
- Firecrawl crawl of competitor sites, pricing pages, onboarding funnels, policies, and blog/FAQ content
- XPOZ creator list with handles, platform, proof angle, outreach status, and content format
- AppKittie app watchlist with keywords, ads, reviews, screenshots, revenue/download deltas
- RevenueCat Web Purchase Links or Web Funnels for direct web acquisition
- PostHog feature flags/experiments or RevenueCat experiments for paywall, onboarding, offer, referral, lifecycle, and landing variants
- safe parallel agents/worktrees for independent research, static audits, frontend/backend units, fixtures, and test lanes, with the orchestrator owning integration, git, and full suites
- `launch-cockpit.html` refreshed after each material provider, store, analytics, revenue, email, or readiness change
- Compound Engineering `ce-proof` or `ce-demo-reel` artifacts for founder/reviewer inspection of shipped app behavior
- Higgsfield-generated mascot, app icon, demo video, screenshot art, ad creative, and animation clips constrained by `DESIGN.md`
- MobAI-backed screenshot capture matrix for real app screens before final store compositions
- MobAI `mobile-recorder-skill` or `desktop-recorder-skill` for polished reproducible app-flow demos: `.mob` or `screenplay.json`, raw capture, edited export, captions, and upload copy
- XcodeBuildMCP-backed Apple screenshot/test/video fallback after founder confirmation when MobAI is unavailable
- UGC Day 0 experiment with 3-5 creators, founder-written scripts, creator contracts, payment model, disclosure rules, tracker, and stop/scale thresholds
- Fastlane workspace setup with connected social accounts, Blitz angles/preferences, MobAI/Higgsfield media inputs, sanitized API logs, and a 30-day organic content plan
- Push/email lifecycle plan for onboarding, trial reminders, billing issues, cancellation, win-back, and review prompts
- Resend Automations for waitlist, welcome, onboarding resume, trial reminders, payment recovery, and win-back when email is the right channel
- Resend Broadcasts/Contacts/Topics for product updates and launch announcements with preference handling
- MMP/SKAdNetwork/ASA attribution decision for paid channels
- TestFlight or closed beta cohort and feedback tracker
- FAQ/help center seeded from reviews, support questions, and objections
- Impeccable/Taste/Layers-informed design audit before public screenshots, landing pages, or generated-app handoff

## Common Missing Pieces

Flag these aggressively:
- `PROJECT_STATE.yaml` is missing, stale, or inconsistent with actual docs/provider state.
- `launch-cockpit.html` is missing, so the founder cannot see lane status, blockers, proof, or approval gates in one place.
- Autonomy mode is not recorded, and the agent mutates provider/store/public state without a named approval scope.
- A known miss happened again but no LaunchBench scenario, validator, or failure card was added.
- A paid/account-gated tool is missing in the runtime and the agent silently starts the free fallback without founder confirmation.
- Doppler or the approved secret provider is not selected before API keys, webhook secrets, CI/deploy env vars, service-account files, or local `.env` files appear.
- Doppler setup, service-token, or CI/live secret instructions were copied from memory without refreshing current official docs and local CLI help.
- A new secret-bearing variable appears in code, CI, mobile build config, provider setup, or docs without a matching `SECRETS.md` entry.
- Secret-bearing commands run from a developer shell but are not documented through `doppler run --` or the approved provider wrapper.
- Production uses a personal Doppler/CLI token instead of a service token, provider integration, OIDC, or platform-native secret store.
- `.env.example` contains real-looking values, or `.env`, service-account JSON, `.p8`, `.p12`, OAuth refresh tokens, provisioning files, or raw keys are committed.
- A public client variable such as `NEXT_PUBLIC_*`, `PUBLIC_*`, or `EXPO_PUBLIC_*` contains a server secret.
- AppKittie was used for category only, not competitor reviews, screenshots, ads, creator signals, or keyword batches.
- XPOZ was skipped, so copy is based on founder language instead of market/user language.
- Firecrawl was not used to inspect competitor landing pages, pricing, policy pages, or funnel claims.
- Product research left multiple viable wedges, onboarding shapes, or monetization paths, but no `ce-brainstorm` or equivalent requirements source resolved them before engineering.
- No `AGENTS.md` exists, or it fails to point agents to canonical docs, Compound Engineering routing, MobAI rules, analytics, revenue, privacy, and E2E gates.
- No lightweight app-local agent roster exists for continuing the app after bootstrap, or the roster lacks orchestrator, marketing, engineering, product, design, and customer-success ownership.
- `CLAUDE.md` duplicates product truth instead of pointing to `AGENTS.md`, causing builder/runtime drift.
- App-local agents/subagents are used as uncoordinated implementers instead of scoped reviewers or isolated workers under an orchestrator.
- Parallel subagents were launched without a file-overlap check, worktree isolation, or an orchestrator owning git, integration, and full test suites.
- MobAI/device automation ran in parallel on the same simulator/device or produced screenshots without backend/provider verification.
- Demo video was recorded by improvising during capture instead of using recorder-skill choreography/screenplay, dry-run, raw capture, final export, captions, and rerenderable artifacts.
- XcodeBuildMCP was used as a MobAI fallback without founder confirmation, or Android coverage was implied even though XcodeBuildMCP is Apple-only.
- XcodeBuildMCP commands, MCP tool names, setup snippets, privacy settings, or screenshot/test proof were copied from stale local skills without checking official docs and `xcodebuildmcp --help`/tool listings.
- Engineering was declared done from unit/widget tests only; no frontend-to-backend, provider, entitlement, analytics, email, or database proof exists.
- `PRODUCTION_READINESS.md` is missing, or it lacks command outcomes, fixture/account details, evidence paths, blocked E2E flows, and founder-only gates.
- `DESIGN.md` is missing, unlinted, or duplicated by conflicting design-token docs.
- Visual direction exists only as prose, screenshots, or image files; no rendered HTML proof uses the design system.
- Higgsfield was skipped for visuals/motion, or generated assets ignore the design system.
- Onboarding has questions but no reason matrix, attribution capture, review-prompt gate, paywall timing, closing-offer decision, or activation event.
- Stripe checkout works but does not grant a RevenueCat entitlement.
- Store products exist but are not attached to the app version, offering, entitlement, or review notes.
- App Store Connect or Google Play values exist only in prose; no click paths, field limits, copyable packet, or HTML mock console exists.
- ASC CLI automation exists but no `store-console.html`, manual click path, dry-run/applied distinction, or founder approval list exists.
- Simulator build succeeds, but Apple Developer membership, Team ID, `DEVELOPMENT_TEAM`, bundle ID/App ID, app record, distribution signing, certificates/profiles, archive/export/upload, or TestFlight processing are unknown.
- The local Mac only has an `Apple Development` identity, but the launch is described as App Store/TestFlight-ready without Xcode cloud-managed signing, an Apple Distribution identity/profile, or a CI/cloud signing route.
- A bundle ID/app record/SKU is created from provisional naming before founder approval, domain ownership, seller-name implications, and RevenueCat/push/OAuth/associated-domain dependencies are considered.
- ASC CLI auth is missing or interactive, but the agent keeps attempting mutating app-record commands instead of recording the auth blocker and asking for the approved credential path.
- Apple App Privacy and Google Play Data safety answers are not traceable to the same data inventory.
- Screenshots are planned but not tied to actual device captures, display wells, final dimensions, locale, and upload status.
- Web pricing mentions an intro offer but omits renewal price or monthly option.
- Privacy/terms pages exist but contact emails are untested.
- Resend domain exists but SPF/DKIM/DMARC, API key scope, webhook verification, idempotency keys, or unsubscribe handling are missing.
- Lifecycle email is implemented as one-off sends with no Contacts/Topics/Broadcasts/Automations decision.
- Analytics exists but purchase, restore, referral, and onboarding events are missing.
- Analytics is planned only as PostHog install steps, with no identity model, attribution matrix, dashboard plan, privacy mapping, or founder-visible `analytics-plan.html`.
- Technical attribution exists but no self-reported "How did you hear about us?" source is captured early in onboarding/signup.
- Self-reported attribution exists as UI or a one-off event only, with no stable stored key, no `other` free text, no PostHog person property, no backend/profile persistence, or no anonymous-to-identified reconciliation.
- Attribution options are persisted as display labels instead of stable keys such as `x_twitter`, `friend`, `app_store_search`, or `creator`.
- An agent describes attribution as "wired" even though `self_reported_source` is not visible in PostHog person properties or the backend/profile record.
- PostHog events exist but initial/latest UTM, referrer, click IDs, creator/referral codes, Fastlane content angle, and store/deep-link context are not preserved where possible.
- Feature flags, experiments, session replay, or surveys are enabled without privacy controls, sampling/consent posture, and store/privacy disclosure mapping.
- Sentry/crash reporting is absent or not connected to alerts.
- No `LAUNCH_TRACE.md` exists, so research, brand, design, store, privacy, revenue, and implementation decisions drift across docs.
- `TECH_SPEC.md` is missing even though the app needs backend schema, API contracts, state machines, permissions, provider webhooks, app integrity, or fixtures.
- App Store Accessibility Nutrition Labels are ignored, or accessibility support is claimed without testing common tasks on each supported device.
- Google Play pre-launch report, App content declarations, sensitive permission forms, or reviewer access instructions are not planned before release.
- App integrity/abuse controls such as Apple App Attest/DeviceCheck, Google Play Integrity, rate limits, idempotency, and replay protections are skipped for paid or backend-mutating flows.
- No support/refund/delete-account path exists before public users arrive.
- Fastlane account connections or API keys exist but are undocumented, unverified, or not tied to approved campaign angles and real product media.
- UGC is planned as generic content ideas instead of a 90-day fit-gated format-discovery experiment with creator sourcing, rights, payment, tracking, and stop/scale rules.
- Short-form content is scheduled without founder approval, warmup, platform limits, or app-store/legal claim review.
- No post-launch weekly monitoring loop is assigned.

## Audit Output

Return:
- coverage table with lane, status, evidence path, and blocker
- top 5 launch blockers
- top 5 high-leverage optional improvements
- founder-only decisions
- exact files/docs to create or patch next

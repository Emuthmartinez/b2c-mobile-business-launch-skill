# Launch Flow Traceability And Build Contracts

Use this for any multi-phase B2C app launch, especially before moving from research to brand/design or from design to implementation. The goal is to keep evidence, product decisions, visual decisions, build specs, and verification tied together.

Create `LAUNCH_TRACE.md` when the launch has more than one serious artifact. Create `TECH_SPEC.md` when actual app/backend/web implementation is in scope and data, API, state, permissions, integrations, or platform behavior need to be precise.

## Contents

- 1. Traceability Rule
- 2. `LAUNCH_TRACE.md`
- 3. Flow Gates
- 4. `TECH_SPEC.md`
- 5. Build-Ready Checklist
- 6. Common Failures

## 1. Traceability Rule

Every major launch decision should answer:

- What evidence caused this decision?
- Which paid/account-gated tool or confirmed fallback produced the evidence?
- What product behavior does it create or reject?
- What brand/design expression carries it?
- What analytics, revenue, privacy, ASO, or legal surface does it affect?
- What must a builder implement?
- How will we prove it works?

Do not move a claim, screen, onboarding question, paywall behavior, pricing statement, data collection, or store-console answer forward unless it has a trace row or a clearly documented founder-only decision.

## 2. `LAUNCH_TRACE.md`

Use this compact table shape:

```text
ID: EVID-001
Source: AppKittie competitor reviews, XPOZ TikTok query, Firecrawl pricing crawl, founder transcript, official docs, user export, or approved fallback
Tool route: paid tool | user export | free fallback | blocked | founder decision
Research finding: what we learned
Product decision: what changes in SPEC.md or ONBOARDING.md
Brand/design decision: what changes in BRAND.md, DESIGN.md, design.md, or HTML proofs
Build contract: screen/component/API/data/state/task that must exist
Analytics/revenue/privacy/store impact: event, entitlement, data disclosure, screenshot, console field, or legal note
Verification: test, MobAI path, backend/provider proof, browser proof, dashboard check, or founder approval
Status: planned | implemented | verified | blocked | rejected
```

Required sections:
- evidence index: source, date, tool, query/URL, and confidence
- tool-decision pointer when evidence came from a paid/account-gated tool or approved fallback
- decision trace table
- rejected decisions and why
- founder-only decisions
- implementation blockers
- verification map

Small launches can keep this inside `RESEARCH.md`, but the section must be easy to find and must be copied into builder handoffs.

## 3. Flow Gates

### Research To Spec

Pass only when:
- category, target user, competitor set, user language, pricing posture, and V1/V2/V3 scope are evidence-backed
- unsupported claims are removed or marked founder-only/legal-review
- each core feature has a reason: demand, differentiation, monetization, retention, compliance, or operational need
- open product alternatives are resolved through `ce-brainstorm` or documented as explicit assumptions

### Spec To Brand And Design

Pass only when:
- brand voice uses actual user/category language instead of founder-only phrasing
- core loop, aha moment, onboarding, paywall, support/privacy, settings, and error states have screen implications
- each public claim has an evidence/proof constraint
- `DESIGN.md`, `design.md`, `design.html`, and `onboarding.html` cite the trace IDs they express
- accessibility and localization constraints are visible before screenshots or implementation prompts

### Design To Build

Pass only when:
- every build-critical screen has states, copy, components, analytics hooks, permissions, and backend/data expectations
- every onboarding question maps to personalization, attribution, lifecycle messaging, privacy, or setup
- paywall and pricing surfaces match `REVENUE_OPS.md`, `TERMS.md`, store products, and analytics events
- account deletion, privacy choices, restore purchases, support, and settings paths are specified
- `TECH_SPEC.md` or `ENGINEERING_PLAN.md` contains data/API/state contracts for every non-static flow

### Build To Proof

Pass only when:
- frontend actions are proven against backend/provider state
- MobAI or browser E2E covers critical user paths
- analytics, entitlement, email, deletion, restore, and support paths are verified where in scope
- `PRODUCTION_READINESS.md` records command outputs, fixtures, evidence paths, blockers, and founder-only gates

## 4. `TECH_SPEC.md`

Create this when the app has backend APIs, database/storage, auth, subscriptions, email, analytics, AI, push, account deletion, or non-trivial platform behavior.

For small builder handoffs, `TECH_SPEC.md` may be folded into `ENGINEERING_PLAN.md`, but the same sections must exist.

Must include:
- source docs and trace IDs
- architecture overview and repo boundaries
- auth/session model, roles, anonymous-to-known transition, logout/reset behavior
- data model: entities, fields, ownership, retention, deletion, indexes, migrations, and seed fixtures
- API/RPC/webhook contracts: route, method, auth, request, response, errors, idempotency, rate limits, and provider retries
- state machines: onboarding, account, entitlement, subscription, restore, deletion, support, lifecycle messaging, and offline/cache state where relevant
- permissions and platform capabilities: push, camera/photos, contacts, location, HealthKit/Health Connect, microphone, calendar, files, notifications, ATT/ad IDs, background modes
- integration contracts: PostHog, RevenueCat, Stripe, Resend, Sentry, Supabase/Firebase/Postgres, Fastlane, App Store/Play server notifications, AI providers, push providers
- app integrity and abuse posture when backend/paid/sensitive flows exist: Apple App Attest/DeviceCheck decision, Google Play Integrity decision, rate limits, bot defenses, replay/idempotency protection
- remote config, feature flags, kill switches, and staged/phased rollout controls
- error taxonomy and user-facing recovery copy
- logging/observability, alerting, dashboards, and privacy-safe debug data
- test fixtures and non-production accounts

Acceptance:
- a builder can implement without inventing schema, endpoint, state, permission, or integration behavior
- backend/provider truth can be tested from a real frontend or device action
- privacy/store disclosures can be traced to actual data and SDK behavior

## 5. Build-Ready Checklist

Before sending to Rork, Claude, Codex, or another builder:
- `LAUNCH_TRACE.md` exists or equivalent trace section exists in `RESEARCH.md`
- `TOOL_DECISIONS.md` exists when paid/account-gated tools or fallbacks shaped evidence, screenshots, testing, store ops, or growth
- `SPEC.md`, `BRAND.md`, `DESIGN.md`, `design.md`, `ANALYTICS.md`, `ONBOARDING.md`, `REVENUE_OPS.md`, `PRIVACY.md`, and `STORE_CONSOLE.md` are internally consistent for in-scope surfaces
- `TECH_SPEC.md` exists when data/API/integration/state behavior is non-trivial
- `ENGINEERING_PLAN.md` references trace IDs and breaks work into implementation units
- `AGENTS.md` points builders to trace, design, analytics, technical contracts, and readiness gates
- `PRODUCTION_READINESS.md` defines the proof expected before launch-ready is claimed

## 6. Common Failures

- Research exists, but design and copy do not cite the evidence that shaped them.
- `design.md` lists screens, but no data model or API contract explains how they work.
- Analytics events are named, but no screen/API owner emits them.
- Privacy and store-console answers are traceable to legal copy, not actual SDKs, data tables, and backend behavior.
- Paywall copy, RevenueCat products, Stripe prices, terms, screenshots, and store metadata drift apart.
- Paid-tool evidence and free-fallback evidence are mixed together without confidence or limitation notes.
- MobAI verifies a visual path, but no provider/dashboard/database proof confirms the action landed.
- XcodeBuildMCP is used as a MobAI fallback without founder confirmation or without recording Apple-only coverage limits.
- A builder prompt references many docs but does not state the trace IDs or contracts that define done.

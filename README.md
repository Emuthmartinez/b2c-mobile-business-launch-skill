# B2C Mobile Business Launch Skill

A reusable Codex and Claude skill for turning a B2C mobile app idea, transcript, early repo, or half-built product into a launch-ready business package.

This is a launch operating system for consumer apps: research, positioning, design system, secrets, analytics, attribution, onboarding, paywalls, store ops, legal pages, revenue infrastructure, email, UGC/Fastlane growth, implementation handoff, device testing, and production-readiness proof.

## Core Idea

The skill now has two layers:

- Human-readable launch playbooks in `references/`.
- Machine-checkable launch state and validators through `PROJECT_STATE.yaml`, `launch-cockpit.html`, LaunchBench scenarios, and TypeScript scripts.

That means future agents do not just "remember" the launch process. They can inspect state, render a founder-facing cockpit, run checks, and keep known failure modes visible as failure cards.

## What It Produces

| Lane | Output |
| --- | --- |
| State | `PROJECT_STATE.yaml`, `launch-cockpit.html`, autonomy mode, lane statuses, provider state, proof, and failure cards |
| Research | AppKittie, XPOZ, Firecrawl, ASO, GEO/SEO, review mining, competitor positioning, and launch evidence |
| Product | `SPEC.md`, `TECH_SPEC.md`, `LAUNCH_TRACE.md`, scope locks, acceptance criteria, and builder prompts |
| Design | `DESIGN.md`, lowercase `design.md`, HTML visual proofs, Higgsfield visual guidance, screenshot systems, and audit gates |
| Analytics | `ANALYTICS.md`, `analytics-plan.html`, PostHog event catalog, attribution contract, dashboards, and QA probes |
| Monetization | RevenueCat, Stripe, app-store products, web funnels, entitlement validation, webhooks, restore/refund flows, and proof |
| Email | Resend DNS, sender map, webhooks, audiences, lifecycle automations, inbound handling, unsubscribe rules, and starter templates |
| Store Ops | App Store Connect and Google Play copy-paste packets, Apple signing/release readiness, privacy answers, screenshots, review notes, and ASC CLI routing |
| Demo Media | MobAI mobile/desktop recorder routing, `.mob` or `screenplay.json`, raw capture, edited export, captions, upload copy, and rerender notes |
| Engineering | `AGENTS.md`, `CLAUDE.md`, `APP_AGENTS.md`, role prompts, Compound Engineering routing, MobAI/XcodeBuildMCP E2E, and production readiness |
| Evals | LaunchBench scenarios and deterministic checks for attribution, signing, store console, secrets, and launch state |

## Non-Negotiables

- `PROJECT_STATE.yaml` is the compact state contract for phase, autonomy, lane status, provider setup, proof, blockers, and failure cards.
- `launch-cockpit.html` is the founder-visible dashboard over that state.
- Research must flow into product, brand, design, implementation, store copy, revenue, privacy, and verification through `LAUNCH_TRACE.md`.
- Secrets route through `SECRETS.md`, Doppler by default, live docs checks, `doppler run --`, names-only `.env.example`, and production service-token/provider-integration gates.
- Attribution is a data contract, not a screen: stable keys, `other` free text, PostHog person properties, backend persistence, anonymous-to-identified reconciliation, and proof.
- Visual work must produce tokenized design docs and rendered HTML proofs, not prose-only direction.
- Paid/account-gated tooling requires explicit fallback routing; missing runtime access is not permission to silently downgrade.
- Apple distribution readiness must be proven through `APPLE_SIGNING.md`; a simulator build alone is not enough.
- Launch-readiness claims should run LaunchBench or deterministic validators where available.

## TypeScript Tooling

The skill ships small TypeScript utilities for generated app repos and skill audits:

```bash
npm install
npm run validate:launch-state -- --root /path/to/app
npm run check:attribution -- --root /path/to/app
npm run check:secrets -- --root /path/to/app
npm run check:apple-signing -- --root /path/to/app
npm run check:store-console -- --root /path/to/app
npm run render:launch-cockpit -- --root /path/to/app
npm run launchbench
```

When running from an installed skill instead of this repo:

```bash
cd ~/.codex/skills/b2c-mobile-business-launch
npm install
npm run validate:launch-state -- --root /path/to/app
```

The scripts are intentionally simple:

- `validate-project-state.ts` checks `PROJECT_STATE.yaml` structure, statuses, provider fields, evidence, blockers, and failure cards.
- `check-attribution-contract.ts` blocks launch-ready attribution unless event, person property, backend persistence, stable keys, `other`, reconciliation, and proof are represented.
- `check-secret-routing.ts` checks `SECRETS.md`, names-only secret routing, forbidden local secret files, and raw secret patterns.
- `check-apple-signing-packet.ts` checks Apple Developer, Team ID, bundle ID/App ID, app record, signing, archive/export/upload, TestFlight, and founder gates.
- `check-store-console-packet.ts` checks App Store Connect/Google Play packet coverage and founder-facing console requirements.
- `render-launch-cockpit.ts` renders `launch-cockpit.html` from `PROJECT_STATE.yaml`.
- `run-launchbench.ts` validates reusable regression scenarios under `evals/launchbench/`.

## Resend Starter Templates

The skill includes `templates/resend/email-templates.ts`, a TypeScript starter pack for common B2C app email tasks:

- waitlist confirmation
- support request received
- support reply
- entitlement granted
- restore purchases help
- payment failed
- trial expiring
- account deletion confirmed

Each template returns subject, preview, HTML, text, tags, reply-to, optional unsubscribe headers, and an idempotency-key hint. The pack requires `LaunchEmailBrand.designSystem`, so production templates inherit logo, sender identity, colors, typography, radius, spacing, footer rules, support SLA, and legal links from the app's `DESIGN.md`.

## Install

Clone the repo, then link the skill into the runtimes you use:

```bash
mkdir -p ~/.codex/skills ~/.claude/skills ~/.agents/skills
ln -sfn "$PWD/skill/b2c-mobile-business-launch" ~/.codex/skills/b2c-mobile-business-launch
ln -sfn "$PWD/skill/b2c-mobile-business-launch" ~/.claude/skills/b2c-mobile-business-launch
ln -sfn "$PWD/skill/b2c-mobile-business-launch" ~/.agents/skills/b2c-mobile-business-launch
```

## Layout

```text
skill/
  b2c-mobile-business-launch/
    SKILL.md
    package.json
    agents/openai.yaml
    evals/launchbench/
    references/
    scripts/
    templates/
      PROJECT_STATE.yaml
      app-agent-roster/
      resend/
      secrets/
```

## Validate

```bash
npm install
npm exec tsc -- --noEmit
npm run launchbench
npm run validate:launch-state -- --root skill/b2c-mobile-business-launch/templates --state PROJECT_STATE.yaml
npm run render:launch-cockpit -- --root skill/b2c-mobile-business-launch/templates --state PROJECT_STATE.yaml --out /tmp/b2c-launch-cockpit.html
npm run validate:skill
```

This skill is intentionally guardrail-heavy. Its job is to prevent launch drift across research, design, build, revenue, legal, store, email, growth, and verification surfaces.

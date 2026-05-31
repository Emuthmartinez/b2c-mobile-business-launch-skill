# B2C Mobile Business Launch Skill

A reusable Codex and Claude skill for turning a B2C mobile app idea, transcript, early repo, or half-built product into a launch-ready business package.

This is a launch operating system for consumer apps: research, positioning, 11-star experience design, design system, secrets, security hardening, analytics, attribution, onboarding, paywalls, store ops, legal pages, revenue infrastructure, email, UGC/Fastlane growth, implementation handoff, device testing, and production-readiness proof.

## Core Idea

The skill now has two layers:

- Human-readable launch playbooks in `skill/b2c-mobile-business-launch/references/`.
- Machine-checkable launch state and validators through `PROJECT_STATE.yaml`, `launch-cockpit.html`, LaunchBench scenarios, and TypeScript scripts.

That means future agents do not just "remember" the launch process. They can inspect state, render a founder-facing cockpit, run checks, and keep known failure modes visible as failure cards.

## Autopilot Usage

Give one broad launch request and let the skill run. Good prompts look like:

- "Take this transcript and turn it into a business I can launch."
- "I have a half-built B2C app; get it launch-ready and stop only for real approval or access blockers."
- "Get this iOS app ready for TestFlight, App Store Connect, RevenueCat, PostHog, Resend, and launch."

The skill should not require repeated "now use this skill" prompts. Once activated, it routes itself through the right references, tools, artifacts, and validators, then pauses only for founder-only gates such as credentials, spend, legal/pricing approval, public posting, destructive actions, or final submission/release.

## What It Produces

| Lane | Output |
| --- | --- |
| State | `PROJECT_STATE.yaml`, `launch-cockpit.html`, `skill-version.json`, runtime freshness checks, autonomy mode, lane statuses, provider state, proof, and failure cards |
| Design Room | `state/business.json`, `state/theme.tokens.json`, `design-room.html`, React/Vite `dist/design-room/`, git-backed versions, baselines, diffs, restores, and wipe-slate operations |
| Research | AppKittie, XPOZ, Firecrawl, ASO, GEO/SEO, review mining, competitor positioning, and launch evidence |
| Experience | `11_STAR_EXPERIENCE.md`, `11-star-experience.html`, 1/2/5/6/7/10/11-star ladder, line of feasibility, V1 scalable slice, and surface translation |
| Product | `SPEC.md`, `TECH_SPEC.md`, `LAUNCH_TRACE.md`, scope locks, acceptance criteria, and builder prompts |
| Security | `SECURITY.md`, `security-review.html`, threat model, paid/free security-tool routing, OWASP MASVS/ASVS basis, platform hardening, app integrity, abuse controls, scanner/review proof, and accepted risks |
| Design | `DESIGN.md`, lowercase `design.md`, `UX_PATTERNS.md`, HTML visual proofs, Refero/fallback UX pattern research, Higgsfield visual guidance, Remotion content assets, screenshot systems, and audit gates |
| Analytics | `ANALYTICS.md`, `analytics-plan.html`, PostHog event catalog, attribution contract, dashboards, and QA probes |
| Paid UA | `PAID_UA.md`, one-channel paid acquisition system, creative cadence, tracking baseline, blended report, RevenueCat LTV/CPA review, weekly schedule, and founder-only spend gates |
| Monetization | RevenueCat, Stripe, app-store products, web funnels, entitlement validation, webhooks, restore/refund flows, and proof |
| Viral Growth | `VIRAL_GROWTH.md`, product-led referral/share loops, content format lab, monetization timing, abuse controls, analytics proof, and stop/scale rules |
| Email | Resend DNS, sender map, webhooks, audiences, lifecycle automations, inbound handling, unsubscribe rules, and starter templates |
| Store Ops | App Store listing packets, Apple pre-ASC requirements, App Privacy worksheets, App Store Connect and Google Play copy-paste packets, Apple signing/release readiness, privacy manifest/required-reason API proof, pricing/subscription mapping, CPP/In-App Event plans, localization, ParthJadhav/app-store-screenshots production boards for iPhone/iPad screenshot compositions, App Icon/App Preview routing, review notes, and ASC CLI routing |
| Demo Media | MobAI mobile/desktop recorder routing, Remotion rendered clips/stills, `.mob` or `screenplay.json`, raw capture, edited export, captions, upload copy, and rerender notes |
| Orchestration | `ORCHESTRATION.md`, parallel-agent preflight, candidate units, serialized resources, worktree routing, subagent forbidden actions, collision checks, and integration proof |
| Engineering | business-specific `AGENTS.md`, `CLAUDE.md`, `APP_AGENTS.md`, role prompts, continued skill routing, Compound Engineering routing, MobAI/XcodeBuildMCP E2E, and production readiness |
| Source Freshness | `source-registry.yaml`, weekly upstream docs/tool checks, source-refresh reports, and candidate-source PRs for third-party drift |
| Evals | LaunchBench scenarios and deterministic checks for attribution, signing, store console, UX patterns, secrets, security, source freshness, and launch state |

## Non-Negotiables

- `PROJECT_STATE.yaml` is the compact state contract for phase, autonomy, lane status, provider setup, proof, blockers, and failure cards.
- `launch-cockpit.html` is the founder-visible dashboard over that state.
- Research must flow into product, brand, design, implementation, store copy, revenue, privacy, and verification through `LAUNCH_TRACE.md`.
- Every real product needs an 11-star experience contract before build handoff: the visual ladder, line of feasibility, V1 scalable slice, and surface translation must shape `SPEC.md`, `DESIGN.md`, `ONBOARDING.md`, `TECH_SPEC.md`, ads, screenshots, and content.
- Secrets route through `SECRETS.md`, Doppler by default, live docs checks, `doppler run --`, names-only `.env.example`, and production service-token/provider-integration gates.
- Security is a release lane: `SECURITY.md`, `security-review.html`, threat model, security tool routing, mobile/backend/revenue hardening, scanner/review proof, incident response, and accepted risks.
- Attribution is a data contract, not a screen: stable keys, `other` free text, PostHog person properties, backend persistence, anonymous-to-identified reconciliation, and proof.
- Visual work must produce tokenized design docs and rendered HTML proofs, not prose-only direction.
- Content assets route through `CONTENT_ASSETS.md`; Higgsfield fallbacks, Remotion license status, source inputs, render proof, and public-use gates must be explicit.
- Parallel agents are considered by default for broad work, but `ORCHESTRATION.md` and `PROJECT_STATE.yaml` must record the strategy, safe units, serialized resources, forbidden actions, collision checks, integration, and validation proof.
- Third-party docs and tool references are tracked in `source-registry.yaml`; new URLs must be registered and weekly source-refresh PRs should be reviewed before becoming launch policy.
- Paid/account-gated tooling requires explicit fallback routing; missing runtime access is not permission to silently downgrade.
- Apple distribution readiness must be proven through `APPLE_SIGNING.md`; a simulator build alone is not enough.
- Apple App Store submission readiness must be proven through `APPLE_APP_STORE_REQUIREMENTS.md`; privacy manifests, required reason APIs, third-party SDK manifest/signature status, App Privacy answers, protected-resource purpose strings, ATT, account deletion, review notes, and archive/upload warnings must be accounted for before pushing a build into App Store Connect.
- Launch-readiness claims should run LaunchBench or deterministic validators where available.

## TypeScript Tooling

The skill ships small TypeScript utilities for generated app repos and skill audits:

```bash
npm install
npm run validate:launch-state -- --root /path/to/app
npm run check:attribution -- --root /path/to/app
npm run check:secrets -- --root /path/to/app
npm run check:security -- --root /path/to/app
npm run check:content-assets -- --root /path/to/app
npm run check:store-screenshots -- --root /path/to/app
npm run check:orchestration -- --root /path/to/app
npm run check:apple-signing -- --root /path/to/app
npm run check:apple-requirements -- --root /path/to/app
npm run check:store-console -- --root /path/to/app
npm run check:ux-patterns -- --root /path/to/app
npm run check:onboarding -- --root /path/to/app
npm run check:11-star -- --root /path/to/app
npm run check:viral-growth -- --root /path/to/app
npm run check:paid-ua -- --root /path/to/app
npm run check:agent-entrypoints
npm run check:workflow-adherence
npm run check:skill-version -- --source skill/b2c-mobile-business-launch --installed ~/.codex/skills/b2c-mobile-business-launch
npm run check:compound-engineering -- --root /path/to/app
npm run validate:design-state -- --root /path/to/app
npm run render:design-room -- --root /path/to/app
npm run check:design-room -- --root /path/to/app
npm run design:version -- baseline onboarding-v1 --root /path/to/app
npm run check:source-registry
npm run refresh:source-freshness
npm run check:autopilot
npm run audit:links
npm run render:launch-cockpit -- --root /path/to/app
npm run launchbench
npm run test:validators
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
- `check-security-release.ts` checks `SECURITY.md`, security-review routing, OWASP/platform basis, mobile hardening, entitlement/webhook abuse controls, privacy/analytics/email controls, supply-chain checks, incident response, and accepted risks.
- `check-content-assets.ts` checks `CONTENT_ASSETS.md`, Remotion/Higgsfield route decisions, fallback approval, license status, source inputs, render proof, claim review, and manifest shape.
- `check-viral-growth-loop.ts` checks `VIRAL_GROWTH.md`, product/referral/content loops, monetization timing, analytics proof, abuse controls, stop/scale rules, and format-lab evidence.
- `check-paid-user-acquisition.ts` checks `PAID_UA.md`, one-channel paid acquisition focus, creative cadence, tracking baseline, blended report, RevenueCat LTV/CPA review, weekly schedule, stop/scale rules, and founder-only spend gates.
- `check-store-screenshots.ts` checks `SCREENSHOTS.md`, raw-vs-composed screenshot separation, ParthJadhav/app-store-screenshots or equivalent export routing, iPhone/iPad/Play wells, App Icon/App Preview routing, copy overlays, validation, and visual QA proof.
- `check-parallel-orchestration.ts` checks `ORCHESTRATION.md`, top-level orchestration state, strategy, candidate units, overlapping files, spawned-agent forbidden actions, output review, collision checks, and state reconciliation.
- `check-apple-signing-packet.ts` checks Apple Developer, Team ID, bundle ID/App ID, app record, signing, archive/export/upload, TestFlight, and founder gates.
- `check-apple-app-store-requirements.ts` checks `APPLE_APP_STORE_REQUIREMENTS.md`, privacy manifests, required reason APIs, third-party SDK manifests/signatures, Xcode privacy report reconciliation, App Privacy URLs/labels, protected-resource purpose strings, ATT, account deletion, review notes, and archive/upload gates before ASC readiness.
- `check-store-console-packet.ts` checks App Store Connect/Google Play packet coverage and founder-facing console requirements.
- `check-ux-patterns.ts` checks Refero or approved-fallback UX pattern packets, flow maps, state matrices, and HTML proof routing.
- `check-onboarding-conversion.ts` checks `ONBOARDING.md` for the native App Review popup immediately after first value, native API timing, cooldown, analytics, and suppressed-prompt fallback.
- `check-eleven-star-experience.ts` checks the 11-star experience ladder, line of feasibility, V1 scalable slice, surface matrix, visual board, and trace/build links.
- `check-source-freshness.ts` checks that external docs, tools, and websites referenced by the skill are registered for weekly freshness tracking.
- `check-agent-entrypoints.ts` checks maintainer-only root docs and shipped business-repo `AGENTS.md`/`CLAUDE.md` templates stay separated and keep future agents on the launch skill workflow.
- `check-workflow-adherence.ts` checks harness-style agent maps, subagent availability gates, Compound Engineering routing, and LaunchBench coverage for workflow adherence.
- `check-skill-version.ts` checks whether the installed runtime is behind the latest local source copy and emits the AskUserQuestion upgrade gate when stale.
- `check-compound-engineering-routing.ts` blocks core engineering readiness when CE freshness, plan, work, review, test, and proof routing are missing or silently skipped.
- `refresh-source-freshness.ts` fetches registered sources, writes a Markdown/HTML/JSON report, and lets the weekly workflow open a reviewable PR.
- `check-autopilot-contract.ts` checks Anthropic-style trigger coverage, negative trigger guards, and the hands-off run contract.
- `audit-skill-links.ts` checks bundled Markdown files for broken local links.
- `render-launch-cockpit.ts` renders `launch-cockpit.html` from `PROJECT_STATE.yaml`.
- `run-launchbench.ts` validates reusable regression scenarios under `evals/launchbench/` and runs deterministic validator fixtures.
- `run-validator-fixtures.ts` exercises positive and negative fixtures so validator false negatives become audit failures.

## Resend Starter Templates

The skill includes `skill/b2c-mobile-business-launch/templates/resend/email-templates.ts`, a TypeScript starter pack for common B2C app email tasks:

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
    tsconfig.json
    agents/openai.yaml
    evals/launchbench/
    state/
      business.json
      theme.tokens.json
      schema/business.schema.json
    render/
      index.html
      src/
    references/
      source-registry.yaml
    scripts/
    templates/
      PROJECT_STATE.yaml
      state/
      11-star-experience/
      repo-agent-entrypoints/
      orchestration/
      content-assets/
      growth/
      app-agent-roster/
      resend/
      SECURITY.md
      security-review.html
      secrets/
```

## Validate

```bash
npm install
npm run audit
```

Before broad launch/design work, compare the installed runtime to the source skill:

```bash
npm run check:skill-version -- --source skill/b2c-mobile-business-launch --installed ~/.codex/skills/b2c-mobile-business-launch
```

This skill is intentionally guardrail-heavy. Its job is to prevent launch drift across research, design, build, revenue, legal, store, email, growth, and verification surfaces.

# {{APP_NAME}} Agent Guide

This repo is the operating home for {{APP_NAME}}, a B2C mobile app business by {{BUSINESS_NAME}}.

Continue using the `b2c-mobile-business-launch` skill for launch, store, revenue, analytics, security, growth, and production-readiness work. Once the skill is active, do not ask the founder to re-invoke it; load the next needed skill reference, update `PROJECT_STATE.yaml`, rerender `launch-cockpit.html`, and run the relevant validators until a founder-only gate is reached.

## 60-Second Brief

- Product: {{PRODUCT_BRIEF}}
- Target user: {{TARGET_USER}}
- Business model: {{BUSINESS_MODEL}}
- Platforms: {{PLATFORMS}}
- Current phase: read `PROJECT_STATE.yaml` and `launch-cockpit.html`
- Primary repos or apps: {{SOURCE_REPO_PATHS}}

## Read First

1. `PROJECT_STATE.yaml`
2. `launch-cockpit.html`
3. `SPEC.md`
4. `LAUNCH_TRACE.md`
5. `11_STAR_EXPERIENCE.md`
6. `TECH_SPEC.md`
7. `DESIGN.md`
8. `ANALYTICS.md`
9. `SECRETS.md`
10. `SECURITY.md`
11. `ORCHESTRATION.md`
12. `PRODUCTION_READINESS.md`
13. `APP_AGENTS.md`

If a listed file does not exist yet, create or update it through the relevant `b2c-mobile-business-launch` reference instead of inventing a one-off replacement.

## Source Of Truth

This file is a map, not a product spec. Keep durable product truth in the files below, keep active plans in `PROJECT_STATE.yaml` and `ORCHESTRATION.md`, and keep mechanical enforcement in validators, LaunchBench, and failure cards.

- State and blockers: `PROJECT_STATE.yaml`, `launch-cockpit.html`, `FAILURE_CARDS.md`, `LAUNCHBENCH.md`
- Product and evidence: `RESEARCH.md`, `SPEC.md`, `LAUNCH_TRACE.md`, `11_STAR_EXPERIENCE.md`, `11-star-experience.html`
- Implementation: `TECH_SPEC.md`, `ENGINEERING_PLAN.md`, `ORCHESTRATION.md`, `PRODUCTION_READINESS.md`
- Design and content: `DESIGN.md`, `design.md`, `design.html`, `UX_PATTERNS.md`, `CONTENT_ASSETS.md`
- Growth and stores: `LAUNCH.md`, `GEO_SEO.md`, `UGC_PLAYBOOK.md`, `FASTLANE_OPS.md`, `APP_STORE_LISTING.md`, `STORE_CONSOLE.md`, `APPLE_SIGNING.md`
- Revenue, lifecycle, and trust: `REVENUE_OPS.md`, `ANALYTICS.md`, `EMAIL_OPS.md`, `PRIVACY.md`, `TERMS.md`, `SECRETS.md`, `SECURITY.md`, `security-review.html`
- Role routing: `APP_AGENTS.md` and `agents/`

## Skill Workflow

- Use `b2c-mobile-business-launch` as the default workflow for broad launch/business work, business-side setup, App Store or Google Play readiness, RevenueCat/Stripe/PostHog/Resend setup, MobAI/XcodeBuildMCP proof, security release work, GEO/SEO, UGC/Fastlane, and production-readiness claims.
- Keep `PROJECT_STATE.yaml` current before crossing phases, claiming a lane is done, spawning agents, changing provider state, or pausing at a blocker.
- Rerender `launch-cockpit.html` whenever state, blockers, provider status, proof, or launch-readiness changes.
- Use `references/engineering-orchestration.md`, `references/parallel-agent-orchestration.md`, and `references/app-agent-roster.md` from the skill before editing `AGENTS.md`, `CLAUDE.md`, `APP_AGENTS.md`, `ORCHESTRATION.md`, `ENGINEERING_PLAN.md`, or `PRODUCTION_READINESS.md`.
- For broad launch/build work, either use `APP_AGENTS.md` and the role prompts under `agents/` for read-only specialist audits or record why subagents are unavailable or unsafe in `ORCHESTRATION.md` and `PROJECT_STATE.yaml`. The orchestrator owns integration, state, git, releases, and final readiness.

## Scope

- V1 scope: {{V1_SCOPE}}
- V2/V3 scope: {{FUTURE_SCOPE}}
- Banned scope: {{BANNED_SCOPE}}

Do not let builders or agents add product behavior that is not traced from `LAUNCH_TRACE.md`, the 11-star V1 scalable slice, or an explicit founder-approved scope change.

## Engineering

- Stack: {{STACK_SUMMARY}}
- Run commands through the repo's package manager and scripts when available. Record exact verification in `PRODUCTION_READINESS.md`.
- Use Compound Engineering routes when available: `ce-brainstorm` for unresolved product shape, `ce-plan` for implementation planning, `ce-work` for bounded execution, `ce-worktree` for isolated lanes, and review/proof skills before readiness claims. If unavailable, record the fallback reason in `ORCHESTRATION.md` and keep the lane partial until equivalent plan/work/review proof exists.
- Use `ORCHESTRATION.md` before parallel work. Parallel agents are for independent audits or isolated file ownership only; serialize shared files, migrations, provider/account mutations, device control, git, releases, pricing/legal/public posting, submissions, and final readiness.
- Backend/frontend proof must show real data, provider state, analytics events, entitlement state, email delivery, or store/signing state where those lanes are in scope.

## Design And UX

- `DESIGN.md` owns tokens, voice, components, and visual rules.
- HTML proofs must be opened and checked on mobile and desktop before visual work is called ready.
- Onboarding, paywall, review prompt, empty/loading/error/offline states, screenshots, and content assets must trace to the 11-star V1 scalable slice.

## Analytics, Revenue, And Secrets

- `ANALYTICS.md` owns event names, identity, attribution, funnels, dashboards, and QA proof.
- Attribution is a data contract: stable source keys, `other` free text when used, `attribution_source_selected`, PostHog `self_reported_source`, backend/profile persistence when identity exists, and anonymous-to-identified reconciliation.
- `REVENUE_OPS.md` owns products, prices, entitlements, webhooks, restore/refund flows, and purchase proof.
- `SECRETS.md` owns all secret names, locations, command wrappers, CI/deploy injection, and founder-only blockers. Use Doppler by default or the approved provider. Never commit, print, screenshot, or log raw secret values.

## Security And Compliance

- `SECURITY.md` and `security-review.html` are release-lane artifacts, not optional polish.
- Security work must cover threat model, data classification, mobile platform hardening, app integrity, entitlement/webhook abuse controls, supply chain, monitoring, incident response, accepted risks, and security-tool routing.
- Public privacy, terms, pricing, subscription, endorsement, medical, legal, financial, urgency, and security claims require source truth and founder approval when policy or liability changes.

## Founder-Only Gates

Ask before credentials, account access, paid signups or spend, pricing changes, billing/subscription moves, domain purchases, DNS/MX changes, legal approval, public posting or scheduling, app-store submission, destructive actions, force pushes, production data mutations, or final release decisions.

## Common Mistakes

- Do not replace the launch skill with a generic app-build prompt.
- Do not copy maintainer instructions from the skill repo into this business repo.
- Do not treat simulator success, mocked data, local-only UI events, or prose-only plans as production proof.
- Do not let `CLAUDE.md`, `APP_AGENTS.md`, role prompts, or builder prompts duplicate product truth that belongs in this file and the source docs.
- Do not silently downgrade paid/account-gated tooling to free fallbacks; record approval or blockers in `TOOL_DECISIONS.md`.

## Verification

Run the relevant repo-local commands plus installed-skill validators. From the installed skill, use:

```bash
cd ~/.codex/skills/b2c-mobile-business-launch
npm run validate:launch-state -- --root /path/to/{{APP_SLUG}} --state PROJECT_STATE.yaml
npm run check:orchestration -- --root /path/to/{{APP_SLUG}} --state PROJECT_STATE.yaml
npm run check:secrets -- --root /path/to/{{APP_SLUG}} --state PROJECT_STATE.yaml
npm run check:security -- --root /path/to/{{APP_SLUG}} --state PROJECT_STATE.yaml
npm run render:launch-cockpit -- --root /path/to/{{APP_SLUG}} --state PROJECT_STATE.yaml --out /path/to/{{APP_SLUG}}/launch-cockpit.html
```

Add lane-specific checks for attribution, UX patterns, content assets, 11-star experience, Apple signing, store console, LaunchBench, and app tests whenever those lanes are in scope.

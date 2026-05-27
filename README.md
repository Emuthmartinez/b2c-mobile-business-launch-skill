# B2C Mobile Business Launch Skill

A reusable Codex/Claude skill for turning a B2C mobile app idea, transcript, early repo, or half-built app into a launch-ready business package.

It is built for the full path: research, positioning, design system, analytics, onboarding, paywalls, store ops, legal pages, revenue infrastructure, email, UGC/Fastlane growth, implementation handoff, device testing, and production-readiness proof.

## What This Skill Forces

- Research flows into product, brand, design, implementation specs, store copy, revenue, privacy, and verification through `LAUNCH_TRACE.md`.
- Visual work produces `DESIGN.md`, lowercase `design.md`, and rendered HTML proofs instead of prose-only design direction.
- Analytics and PostHog attribution are planned upfront with founder-visible `analytics-plan.html`.
- Self-reported attribution is a data contract, not a screen: early prompt, stable source keys, `other` free text, PostHog person properties, backend/profile persistence, anonymous-to-identified reconciliation, and live proof.
- Store ops produce copy-paste App Store Connect and Google Play packets, privacy answers, screenshot matrices, and founder-only gate lists.
- Paid third-party tooling has explicit fallback routing; agents must ask before silently downgrading to free/manual paths.
- App handoffs include `APP_AGENTS.md` plus simple app-local role prompts for orchestrator, marketing, engineering, product, design, and customer success.

## Included Skill Areas

- AppKittie, XPOZ, Firecrawl, ASO, GEO/SEO, and competitive research
- Google `design.md`, Impeccable/Taste/Layers-inspired design gates, HTML visual proofs, and Higgsfield visual/motion workflows
- Onboarding conversion, mascot/demo guidance, review prompts, hard/soft paywalls, closing offers, and trial strategy
- PostHog analytics, attribution, identity stitching, dashboards, experiments, session replay, surveys, and privacy mapping
- RevenueCat, Stripe, app-store products, web funnels, entitlements, webhooks, restore, refund, and subscription proof
- App Store Connect, Google Play Console, ASC CLI routing, screenshots, privacy labels, data safety, and review notes
- Resend setup, sender DNS, transactional email, lifecycle automations, broadcasts, contacts/topics, webhooks, inbound, and unsubscribe handling
- MobAI with XcodeBuildMCP fallback, device screenshots, E2E proof, backend/provider verification, and production readiness
- Fastlane AI and UGC creator-engine planning for post-launch organic growth

## Repo Layout

```text
skill/
  b2c-mobile-business-launch/
    SKILL.md
    references/
    templates/
```

`skill/b2c-mobile-business-launch/SKILL.md` is the actual installable skill. The README lives outside the skill folder so the skill stays clean.

## Local Install

Codex:

```bash
mkdir -p ~/.codex/skills
ln -sfn "$PWD/skill/b2c-mobile-business-launch" ~/.codex/skills/b2c-mobile-business-launch
```

Claude:

```bash
mkdir -p ~/.claude/skills
ln -sfn "$PWD/skill/b2c-mobile-business-launch" ~/.claude/skills/b2c-mobile-business-launch
```

Shared agent skills:

```bash
mkdir -p ~/.agents/skills
ln -sfn "$PWD/skill/b2c-mobile-business-launch" ~/.agents/skills/b2c-mobile-business-launch
```

## Validation

```bash
uv run --with pyyaml python ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py skill/b2c-mobile-business-launch
```

The skill is intentionally documentation-heavy because its job is to prevent launch drift across research, design, build, revenue, legal, store, and marketing surfaces.

# B2C Mobile Business Launch Skill

A reusable Codex and Claude skill for turning a B2C mobile app idea, transcript, early repo, or half-built app into a launch-ready business package.

This is the launch operating system: research, positioning, design system, secrets, analytics, onboarding, paywalls, store ops, legal pages, revenue infrastructure, email, UGC/Fastlane growth, implementation handoff, device testing, and production-readiness proof.

## What It Produces

| Lane | Output |
| --- | --- |
| Research | AppKittie, XPOZ, Firecrawl, ASO, GEO/SEO, review mining, competitor positioning, and launch evidence |
| Product | `SPEC.md`, `TECH_SPEC.md`, `LAUNCH_TRACE.md`, scope locks, acceptance criteria, and builder prompts |
| Design | `DESIGN.md`, lowercase `design.md`, HTML visual proofs, Higgsfield visual guidance, screenshot systems, and audit gates |
| Analytics | `ANALYTICS.md`, `analytics-plan.html`, PostHog event catalog, attribution contract, dashboards, and QA probes |
| Monetization | RevenueCat, Stripe, app-store products, web funnels, entitlement validation, webhooks, restore/refund flows, and proof |
| Email | Resend DNS, sender map, webhooks, audiences, lifecycle automations, inbound handling, unsubscribe rules, and starter templates |
| Store Ops | App Store Connect and Google Play copy-paste packets, privacy answers, screenshots, review notes, and ASC CLI routing |
| Engineering | `AGENTS.md`, `CLAUDE.md`, `APP_AGENTS.md`, role prompts, Compound Engineering routing, MobAI/XcodeBuildMCP E2E, and production readiness |

## Non-Negotiables

- Research must flow into product, brand, design, implementation, store copy, revenue, privacy, and verification through `LAUNCH_TRACE.md`.
- Secrets route through `SECRETS.md`, Doppler by default, live Doppler documentation checks, `doppler run --`, names-only `.env.example`, and production service-token/provider-integration gates.
- Attribution is a data contract, not a screen: stable keys, `other` free text, PostHog person properties, backend persistence, anonymous-to-identified reconciliation, and proof.
- Visual work must produce tokenized design docs and rendered HTML proofs, not prose-only direction.
- Paid/account-gated tooling requires explicit fallback routing; missing runtime access is not permission to silently downgrade.
- Store and legal work must become founder-facing copy-paste packets with exact console fields, blocked approvals, and current docs basis.
- XcodeBuildMCP and Doppler setup must refresh official docs plus local CLI/tool help before commands or readiness proof.

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

Each template returns subject, preview, HTML, text, tags, reply-to, optional unsubscribe headers, and an idempotency-key hint. The pack is designed to be copied into an app repo and adapted to the app's brand, legal posture, support SLA, and Resend strategy.

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
    references/
    templates/
      app-agent-roster/
      resend/
      secrets/
```

## Validate

```bash
uv run --with pyyaml python ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py skill/b2c-mobile-business-launch
```

This skill is intentionally guardrail-heavy. Its job is to prevent launch drift across research, design, build, revenue, legal, store, email, growth, and verification surfaces.

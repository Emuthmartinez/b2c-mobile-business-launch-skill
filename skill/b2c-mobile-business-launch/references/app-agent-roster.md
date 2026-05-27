# App-Local Agent Roster

Use this when creating `AGENTS.md`, `CLAUDE.md`, `PROMPTS.md`, `ENGINEERING_PLAN.md`, builder-ready bundles, or any real app handoff that should continue after bootstrap.

Load `engineering-orchestration.md` first for orchestration rules. Load `artifact-contracts.md` for accepted file names and handoff structure.

## Required Output

Every real B2C app build or builder-ready package should include:

```text
APP_AGENTS.md
agents/
  orchestrator.md
  marketing-guru.md
  engineering-leader.md
  product-leader.md
  design-guru.md
  customer-success.md
```

Use `templates/app-agent-roster/` as the starting point when available. Fill placeholders with the current app's source-of-truth docs, stack, paid-tool decisions, and launch gates.

## Role Model

The app-local roster is not a replacement for `AGENTS.md`, `TECH_SPEC.md`, `DESIGN.md`, `ANALYTICS.md`, `ONBOARDING.md`, or `PRODUCTION_READINESS.md`. It is a lightweight routing layer for future agents.

- Orchestrator owns sequencing, source truth, subagent routing, file-overlap checks, integration, git/release coordination, and final production-readiness proof.
- Marketing guru owns ASO, GEO/SEO, UGC, Fastlane, reviews, launch calendar, claims, channel tests, and attribution learning.
- Engineering leader owns architecture, implementation plans, backend/frontend/provider proof, observability, tests, and readiness gates.
- Product leader owns ICP, scope, onboarding, activation, retention, roadmap, and evidence-to-product traceability.
- Design guru owns the design system, HTML visual proofs, screenshots, icons, motion, accessibility, and Higgsfield asset fit.
- Customer success owns support, FAQ/help, privacy/delete/refund/restore paths, lifecycle copy, review responses, and feedback triage.

## Subagent Audit Pattern

For non-trivial launches, use the roster to run independent review lanes before declaring the build or launch package complete:

- Product leader reviews `SPEC.md`, `LAUNCH_TRACE.md`, `ONBOARDING.md`, and activation/retention assumptions.
- Marketing guru reviews `RESEARCH.md`, `LAUNCH.md`, `STORE_CONSOLE.md`, `GEO_SEO.md`, `UGC_PLAYBOOK.md`, `FASTLANE_OPS.md`, and attribution-channel learning.
- Design guru reviews `DESIGN.md`, `design.md`, `design.html`, `onboarding.html`, screenshots, accessibility, and visual consistency.
- Engineering leader reviews `TECH_SPEC.md`, `ENGINEERING_PLAN.md`, analytics/revenue/email/backend contracts, and test coverage.
- Customer success reviews `PRIVACY.md`, `TERMS.md`, support routes, refund/restore/delete paths, lifecycle email, FAQ, and review-response readiness.
- Orchestrator merges findings, resolves conflicts, updates source-of-truth docs, and records proof or blockers in `PRODUCTION_READINESS.md`.

Specialist agents should review and propose by default. They may implement only when the orchestrator assigns an isolated unit with file paths, acceptance checks, and a verification method. Specialists must not stage, commit, release, change pricing, connect accounts, spend money, submit store builds, or publish social posts.

## Attribution Audit Gate

The product, engineering, and marketing roles must all check self-reported attribution when onboarding, signup, waitlist, or account creation exists:

- visible "How did you hear about us?" screen appears after the promise/demo but within the first third of onboarding/signup
- source options use stable stored keys instead of display labels
- `other` includes sanitized free text or a documented follow-up field
- `attribution_source_selected` includes the stable key and technical context where available
- PostHog person properties include `self_reported_source`
- backend/profile storage persists the selected source when identity exists
- anonymous attribution is reconciled after signup/login
- tests or live smoke proof show event, person property, and backend/profile write

If any item is missing, do not call attribution wired, complete, or launch-ready.

## Acceptance

- `APP_AGENTS.md` points to canonical docs and states the orchestrator is the integration owner.
- Six role files exist and remain short enough to be used.
- Each role has clear responsibilities, forbidden actions, founder-only gates, and output shape.
- The roster gives future agents a clean way to audit and continue the app without duplicating product truth.

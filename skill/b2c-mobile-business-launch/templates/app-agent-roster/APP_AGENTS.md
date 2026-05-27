# {{APP_NAME}} App Agents

`AGENTS.md` is canonical. These role files are lightweight entrypoints for continuing the app after bootstrap. Do not duplicate product truth here; point back to the source docs.

## Source Docs

- Product: `SPEC.md`, `LAUNCH_TRACE.md`, `RESEARCH.md`
- Design: `DESIGN.md`, `design.md`, `design.html`
- Onboarding and analytics: `ONBOARDING.md`, `onboarding.html`, `ANALYTICS.md`, `analytics-plan.html`
- Revenue, email, legal, store, secrets: `REVENUE_OPS.md`, `EMAIL_OPS.md`, `SECRETS.md`, `PRIVACY.md`, `TERMS.md`, `APPLE_SIGNING.md`, `STORE_CONSOLE.md`
- Engineering: `TECH_SPEC.md`, `ENGINEERING_PLAN.md`, `PRODUCTION_READINESS.md`

## Roles

- `agents/orchestrator.md`: integration owner and final readiness gate.
- `agents/marketing-guru.md`: ASO, GEO/SEO, UGC, Fastlane, reviews, launch calendar, claims, and channel learning.
- `agents/engineering-leader.md`: architecture, implementation, backend/frontend/provider proof, Apple signing/release gates, tests, and readiness.
- `agents/product-leader.md`: ICP, scope, onboarding, activation, retention, roadmap, and traceability.
- `agents/design-guru.md`: design system, HTML visual proofs, screenshots, accessibility, icons, motion, and Higgsfield fit.
- `agents/customer-success.md`: support, FAQ, privacy/delete/refund/restore, lifecycle copy, reviews, and feedback triage.

## Operating Rules

- The orchestrator owns sequencing, file-overlap checks, integration, git/release coordination, and `PRODUCTION_READINESS.md`.
- Specialists review and propose by default. They implement only when assigned an isolated unit with paths and verification.
- No role may stage, commit, release, submit app-store builds, publish social posts, spend money, change pricing, or connect accounts without founder approval and orchestrator assignment.
- No role may print, paste, commit, screenshot, or log raw secret values. New secrets must be routed through `SECRETS.md` and Doppler or the approved provider before work is called complete.
- Use parallel agents only for independent audits or isolated work; serialize shared files, migrations, device automation, git, and releases.

## Required Audit Before Launch-Ready

- Product: scope, onboarding, activation, and retention match evidence.
- Marketing: ASO, store console, claims, UGC/Fastlane, GEO/SEO, and attribution channels are ready.
- Design: HTML proofs match `DESIGN.md`, no mobile clipping/overlap, screenshots are device-backed.
- Engineering: app, backend, revenue, email, analytics, provider, Apple signing/release, and device paths are verified.
- Secrets: new env vars, webhook secrets, provider keys, CI/deploy secrets, and store credentials are listed in `SECRETS.md` and injected through Doppler or the approved provider.
- Customer success: support, privacy, terms, delete, refund, restore, lifecycle, and review-response paths are ready.
- Attribution: stable source key, `other` free text, `attribution_source_selected`, PostHog `self_reported_source`, backend/profile persistence, and anonymous-to-identified reconciliation are proven when onboarding/signup/waitlist exists.

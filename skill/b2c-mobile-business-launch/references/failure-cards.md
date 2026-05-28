# Failure Cards

Use failure cards when a blocker or recurring launch risk needs to survive the current conversation. They are small, explicit, and testable.

## Card Shape

```yaml
id: "posthog-person-property-missing"
severity: "high"
owner: "engineering-leader"
status: "open"
detected_at: "YYYY-MM-DD"
evidence:
  - "ANALYTICS.md"
impact: "Attribution cannot be used in cohorts, dashboards, or lifecycle messaging."
next_action: "Persist self_reported_source to PostHog person properties and backend profile, then verify."
validator: "npm run check:attribution -- --root ."
```

Store active cards in `PROJECT_STATE.yaml` and optionally mirror longer cards in `FAILURE_CARDS.md` when the launch is large.

## Provider Failure Cards

Use these as defaults and specialize them to the current app.

| ID | Trigger | Required Fix |
| --- | --- | --- |
| `doppler-docs-stale` | Doppler setup or service-token instructions rely on memory | Refresh official docs and local CLI help, then update `SECRETS.md` with docs/version basis |
| `secret-routing-missing` | new env var/key/webhook secret appears without `SECRETS.md` update | classify public/server-only, provider location, command wrapper, CI injection, and rotation note |
| `security-release-lane-missing` | launch-ready claim exists without `SECURITY.md`, threat model, scanner/review route, platform hardening, incident response, and accepted-risk proof | create `SECURITY.md`, render `security-review.html`, route paid/free security tools, run `check:security`, attach scanner/review proof or founder-approved blocked route |
| `security-tool-fallback-unapproved` | Claude Security, Codex Security, GitHub Advanced Security, Snyk/Semgrep/Socket, MobSF Cloud, or commercial app-integrity route is replaced by a free route without approval | stop, record route in `TOOL_DECISIONS.md` and `PROJECT_STATE.yaml`, ask for access/approval, then run the approved route |
| `posthog-person-property-missing` | attribution only emits event | set person property, backend/profile persistence, anonymous-to-identified reconciliation, and proof |
| `revenuecat-entitlement-unproven` | products/offering exist but app access is not validated | sandbox purchase/restore proves entitlement in app, RevenueCat, and backend/profile |
| `stripe-webhook-unproven` | Stripe checkout exists without webhook/idempotency proof | verify webhook signature, idempotency, entitlement projection, and failure recovery |
| `resend-template-unbranded` | email templates ignore `DESIGN.md` or legal footer | map brand tokens, sender, support reply-to, unsubscribe, idempotency, and provider log proof |
| `sentry-unverified` | SDK configured but no non-production event or alert proof | send test event, verify release/environment tags, PII scrubbing, and alert routing |
| `asc-name-fallback-unapproved` | ASC CLI proposes fallback app name | stop, record collision, ask founder, update brand/store/screenshots/revenue docs if approved |
| `asc-command-guidance-stale` | upstream ASC CLI or skill pack changes but references keep stale command families | refresh Rork skill pack, local `asc --help`, official Apple docs, then update references/templates/evals |
| `source-registry-url-untracked` | new external docs/tool URL appears without `source-registry.yaml` entry | run `check:source-freshness -- --write-discovered`, review candidate source, and commit registry update |
| `weekly-source-refresh-unreviewed` | weekly bot treats discovered or changed sources as accepted policy without review | keep PR blocked until capability analysis, reference/template updates, and LaunchBench pass |
| `eleven-star-experience-missing` | product/spec/design/build work starts without `11_STAR_EXPERIENCE.md`, visual ladder, line of feasibility, and V1 scalable slice | create the experience contract, render `11-star-experience.html`, update `SPEC.md`, `LAUNCH_TRACE.md`, `DESIGN.md`, `ONBOARDING.md`, and `TECH_SPEC.md`, then run `npm run check:11-star -- --root .` |
| `orchestration-preflight-missing` | broad launch, multi-lane build, or subagent-assisted work starts without `ORCHESTRATION.md` and top-level `PROJECT_STATE.yaml` orchestration state | write the preflight, critical-path split, candidate units, strategy, serialized resources, and validator plan before dispatch or readiness claims |
| `parallel-file-overlap-unsafe` | two parallel units edit the same file or shared resource without worktree isolation and serial integration | serialize the units or isolate them in worktrees, then run actual file collision checks before integration |
| `subagent-forbidden-action-gap` | a subagent is allowed to stage, commit, push, mutate providers, control devices, run full suites, submit builds, post publicly, or make founder-only decisions | revise prompts, keep those actions orchestrator-owned, and record forbidden actions in `ORCHESTRATION.md` and `PROJECT_STATE.yaml` |
| `subagent-findings-unintegrated` | specialists return findings but state, failure cards, readiness docs, or validators are not updated | accept/reject each finding, update source docs and failure cards, then run focused validators plus the full suite |
| `apple-signing-simulator-only` | simulator build is treated as release readiness | prove Team ID, signing, bundle ID/App ID, app record, certificate/profile, archive/export/upload/TestFlight |
| `google-play-data-safety-untraced` | Data safety answers do not trace to actual SDK/data behavior | map SDKs, data types, purposes, sharing, deletion, security, and Play Console fields |
| `cloudflare-routing-unverified` | domain/email routing exists without DNS/HTTP/email proof | verify HTTPS, DNS, security headers, routes, MX/TXT, and external email delivery |
| `mobai-fallback-unapproved` | MobAI missing and agent uses XcodeBuildMCP without approval | record paid-tool decision and Apple-only fallback limitations before continuing |
| `design-proof-missing` | visual work exists without rendered HTML using tokens | render `design.html`, screenshot proofs, and update `PROJECT_STATE.yaml` evidence |

## Closing A Card

A card can move to `resolved` only when:

- the fix is implemented or the lane is explicitly deferred/not needed
- evidence path or command proof is attached
- downstream docs and `PROJECT_STATE.yaml` are updated
- any founder approval is recorded

Do not close a card by saying the issue is "noted."

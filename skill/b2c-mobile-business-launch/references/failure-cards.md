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
| `posthog-person-property-missing` | attribution only emits event | set person property, backend/profile persistence, anonymous-to-identified reconciliation, and proof |
| `revenuecat-entitlement-unproven` | products/offering exist but app access is not validated | sandbox purchase/restore proves entitlement in app, RevenueCat, and backend/profile |
| `stripe-webhook-unproven` | Stripe checkout exists without webhook/idempotency proof | verify webhook signature, idempotency, entitlement projection, and failure recovery |
| `resend-template-unbranded` | email templates ignore `DESIGN.md` or legal footer | map brand tokens, sender, support reply-to, unsubscribe, idempotency, and provider log proof |
| `sentry-unverified` | SDK configured but no non-production event or alert proof | send test event, verify release/environment tags, PII scrubbing, and alert routing |
| `asc-name-fallback-unapproved` | ASC CLI proposes fallback app name | stop, record collision, ask founder, update brand/store/screenshots/revenue docs if approved |
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

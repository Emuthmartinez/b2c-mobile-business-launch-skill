# Autonomy Modes

Use this before mutating repos, provider state, store records, DNS, social schedules, paid tools, or public surfaces. The agent should declare the current mode in `PROJECT_STATE.yaml` and adjust behavior to the least-powerful mode that can complete the task.

## Modes

| Mode | Agent May Do | Agent Must Not Do |
| --- | --- | --- |
| `scout` | read files, inspect docs, research, list blockers, run non-mutating checks | edit files, create accounts, mutate provider state |
| `draft` | create local docs, specs, packets, HTML mocks, screenshots plans | run provider mutations, publish, submit, spend |
| `prepare` | stage local setup, write scripts, add names-only env schema, create preflight packets | execute account, billing, secret, store, DNS, or public-post mutations |
| `apply` | make repo changes, run tests, update non-secret config, create local artifacts | perform founder-only external mutations without approval |
| `mutate` | run approved provider/API/CLI mutations inside the named scope | widen scope, accept fallback names, rotate secrets, submit stores, post publicly |
| `ship` | perform approved release/submission/posting steps and record proof | skip final founder approval, bypass legal/platform gates, hide blockers |

## Founder-Only Gates

Always ask before:

- spending money or signing up for paid tools
- handling passwords, 2FA, API private keys, OAuth refresh tokens, or secret values
- creating or mutating App Store/Google Play app records, bundle IDs, products, pricing, subscriptions, domains, DNS, email routing, or social account connections
- accepting fallback app names, package names, SKUs, bundle IDs, or public brand names
- publishing pages, scheduling content, submitting builds, launching campaigns, or changing pricing
- destructive git, database, provider, storage, or account operations

## Mode Selection Heuristic

- Start in `scout` when source truth is unknown.
- Move to `draft` for research/design/store/legal packets.
- Move to `prepare` for service setup plans, secrets maps, and console preflights.
- Move to `apply` for ordinary repo edits and app implementation.
- Move to `mutate` only after the founder approves a named provider action.
- Move to `ship` only after production-readiness proof exists and the founder approves final release/posting/submission.

## Acceptance

- `PROJECT_STATE.yaml` records the current mode and latest founder approval.
- Provider and store commands cite the approval scope before they run.
- Agents do not turn missing runtime access into unapproved fallbacks.
- App-record, signing, product, pricing, and public-posting decisions stop for founder approval.

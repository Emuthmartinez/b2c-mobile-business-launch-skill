# Business Access And Operator Bootstrap

Status: not started. The agent assumes the founder is new to business operations and leads one plain-language step at a time.

Structured source: `operations/business-access.json`

## Founder-Zero Promise

The agent runs setup and ongoing operations. The founder keeps ownership, account recovery, 2FA, money, legal identity, and final public/release authority. Never make the founder manage the checklist or learn platform jargon before progress can happen.

## One Next Action

- What this is: Establish the founder-owned business identity that every account will use.
- Why now: It prevents scattered personal logins and makes later operator access revocable.
- Founder action: Tell me the working business or app name you want to use; I will explain and handle the rest one step at a time.
- Agent action next: Inspect current repo and public identity state, then guide the first secure business account step.
- Success proof: Business identity and the next account are recorded in BUSINESS_ACCESS.md and this ledger.
- Next business operation: After the identity gate clears, continue into secure account setup, research, social profiles, content, support, analytics, store work, and launch operations in priority order.

## Business Identity

| Item | Current value | Owner | Status | Next action |
| --- | --- | --- | --- | --- |
| Working business/app name | Pending | founder | not started | confirm one working name |
| Founder-owned business email | Pending | founder | not started | create or confirm before account sprawl |
| Recovery email/phone | private; never record value here | founder | not started | founder confirms it exists |
| Legal entity | unknown | founder | not evaluated | defer unless a provider or launch gate needs it |
| Region/country | Pending | founder | not started | confirm when store, tax, or provider setup needs it |

## Doppler Setup

Doppler stores automation secrets such as API keys, OAuth tokens, service tokens, and webhook credentials. Browser passwords/passkeys stay in delegated platform access, the founder's password manager, or an authenticated browser session; never in chat or this repo.

| Check | Status | Safe evidence | Next action |
| --- | --- | --- | --- |
| Official docs and local CLI help refreshed | pending | date/version only | agent checks before commands |
| Founder/operator authentication | pending | safe account label only | founder completes browser login when prompted |
| Workspace ownership + recovery | pending | founder-owned label; no personal recovery values | agent verifies founder remains owner/recovery/MFA custodian |
| Durable operator identity + role | pending | safe identity label and exact role | agent prefers delegated role, service token, OIDC, or integration |
| Revocation path | pending | exact menu/integration route | agent verifies access can be removed without risking founder ownership |
| Business project and real configs | pending | project/config names | agent inventories or creates after login |
| Secret names routed | pending | `SECRETS.md` | agent records names, founder enters values securely |
| Safe injection smoke test | pending | command and pass/fail, no values | agent runs `doppler run --` proof |

## Account And Social Access

| Platform | Purpose | Exact account/asset | Owner | Operator identity + route/role | Granted scopes + action boundary | Recovery + 2FA owner | Revocation path | Proof | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Business email | ownership spine | pending | founder | pending | none observed; public action gated | founder | pending | pending | create or confirm first |
| Domain/DNS | public identity | pending | founder | pending | none observed; purchase/DNS gated | founder | pending | pending | evaluate after name |
| Apple/App Store Connect | iOS distribution | pending | founder | pending | none observed; submission/release gated | founder | pending | pending | inventory account |
| Google/Play Console | Android/YouTube identity | pending | founder | pending | none observed; submission/release gated | founder | pending | pending | inventory account |
| X | organic social/support | pending | founder | X Delegate preferred | none observed; publishing/reply gated | founder | pending | pending | inventory or create |
| Meta/Instagram | organic social/support/ads | pending | founder | Business Portfolio/task access preferred | none observed; publishing/reply/spend gated | founder | pending | pending | inventory or create |
| TikTok | organic social/ads | pending | founder | Business Center standard role preferred | none observed; publishing/reply/spend gated | founder | pending | pending | inventory or create |
| YouTube | demos/education/support | pending | founder | channel permissions preferred | none observed; publishing/reply gated | founder | pending | pending | inventory or create |

## Delegated Access First

Prefer platform roles, business portfolios, channel permissions, OAuth, or a dedicated business operator identity. Do not share a founder's personal login when a revocable route exists. If a founder-authenticated browser session is the only practical route, the founder signs in and retains recovery/2FA; the agent records the session capability without inspecting cookies or stored credentials.

## Recovery And 2FA

- Founder remains owner of record and controls recovery factors.
- Use unique credentials, passkeys or strong 2FA, and at least one founder-controlled recovery path.
- Do not store passwords, passkeys, 2FA codes, recovery codes, cookies, or browser sessions in Doppler, chat, screenshots, or repo artifacts.
- Doppler holds automation secrets; production uses config-scoped service tokens, integrations, or OIDC rather than a personal CLI token.

## Authorization Boundaries

Working access does not automatically authorize posting, replying publicly, spending, changing pricing, changing legal/business identity, managing payment methods, submitting an app, releasing, deleting, or widening permissions. Those actions use the exact approval envelope in `operations/agent-operations.json`.

## Operator Handoff

The agent owns the complete operating plan and always leaves:

- one plain-language founder action
- the agent's immediate next action
- exact account/access status
- proof or blocker
- the next business operation after access is ready

Do not end with setup instructions alone. Continue into research, profile completion, content drafting, support, analytics, store work, or the next launch lane as soon as the founder gate clears.

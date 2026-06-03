# Ballast — Paid / Account-Gated Tool Decisions

Status: **partial** (Phase 0b). Records which paid or account-gated tools the launch intends to use, what is currently unavailable, and which fallbacks were used so nothing is silently downgraded.

## Decisions

| Tool | Intended role | Runtime status (2026-06-03) | Decision / fallback | Founder action |
| --- | --- | --- | --- | --- |
| **AppKittie** | Category economics: download/revenue estimates, keyword popularity/difficulty for home-management & personal-finance utilities. | **Not available** in this runtime. | Used **public web search + vendor pricing pages + Reddit social** as an interim, founder-visible fallback for the pricing anchor and competitor map (`RESEARCH.md`). This is *directional*, not download/revenue truth. | Confirm whether to provision AppKittie/XPOZ access before pricing and ASO are locked, or approve the web/social fallback as sufficient for now. |
| **XPOZ / social research** | Deep social-language and trend mining. | Partial: a social search tool was available and used for Reddit homeowner language (`RESEARCH.md`). | Used directly for qualitative signal. No paid XPOZ features invoked. | None now. |
| **Doppler** | Secrets management. | Not yet set up. | Deferred to Phase 0c (`SECRETS.md`). Default plan is Doppler. | Approve secret-provider choice before any service tokens. |
| **PostHog** | Product analytics + attribution. | Account not connected. | Deferred to Phase 1b (`ANALYTICS.md`). | Provide/approve account before live events. |
| **RevenueCat** | Subscription entitlements (Reserve+). | Account not connected. | Deferred to Phase 3b (`REVENUE_OPS.md`). | Provide/approve account; pricing is founder-gated. |
| **Resend** | Waitlist + lifecycle email. | Account not connected. | Deferred to Phase 4 (`EMAIL_OPS.md`). | Provide/approve sender domain + account. |
| **App Store Connect** | App record, TestFlight, submission. | No Apple Developer access provided. | Deferred to Phase 3. iOS-first confirmed by founder. | Provide Apple Developer membership + Team ID. |

## Principles applied

- Missing runtime access to a paid tool is **not** permission to silently substitute a free tool as if equivalent. The AppKittie gap is recorded as **blocked**, the fallback is labeled directional, and the real pass is still listed as owed in `RESEARCH.md`.
- No paid signups, spend, or account connections have been made. All such steps are founder-only gates (`PROJECT_STATE.yaml`).

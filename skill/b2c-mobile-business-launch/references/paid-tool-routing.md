# Paid Tool Routing And Free Fallbacks

Use this before using, skipping, or replacing any paid third-party tool in the launch workflow.

The rule is simple: tool access missing from the current runtime does not mean the founder lacks the tool, refuses to pay for it, or wants a weaker free fallback. Ask before spending tokens on a fallback path.

## Contents

- Decision Protocol
- Confirmation Prompt
- Tool Map
- Artifact Requirements
- Founder Gates
- Common Failure Modes

## Decision Protocol

1. Identify the preferred paid tool and why it is useful for the lane.
2. Check whether the tool is callable in the current runtime or whether the user already supplied access, exports, screenshots, CSVs, PDFs, API keys, or prior results.
3. If the tool is unavailable, expired, unauthenticated, or blocked, stop before running the free fallback.
4. Ask the founder whether to use/provision the paid tool, provide access or exports, or continue with the fallback.
5. Continue only after the user confirms the paid path or the free fallback.
6. Record the decision in `TOOL_DECISIONS.md` or in the relevant ops doc when the launch is small.

Do not present a fallback artifact as equivalent to the paid-tool artifact. Label fallback outputs with confidence, limitations, and what the paid tool would have improved.

## Confirmation Prompt

Use a short direct prompt:

```text
This lane is designed to use <paid tool> for <job>. I do not currently have usable access in this runtime. Do you want me to use/provision <paid tool>, wait for access/export, or continue with the free fallback <fallback>? I will not spend time on the fallback unless you confirm.
```

If the founder says they have the tool, ask only for the minimum access/export needed. If the founder says to use the free path, proceed and record the limitation.

## Tool Map

| Paid or account-gated tool | Preferred use | Free or lower-cost fallback after confirmation |
| --- | --- | --- |
| AppKittie | app-store economics, competitor intelligence, downloads/revenue estimates, keyword difficulty, reviews, ad/creator signals | public App Store/Google Play pages, store search, public reviews, app websites, manual competitor spreadsheet, Apple/Google console data if the app exists |
| XPOZ | Reddit, TikTok, X/Twitter, Instagram social-language and creator research | public web search, platform-native search in browser, Reddit search, YouTube comments, App Store/Play reviews, founder-provided screenshots/exports |
| Firecrawl | competitor site crawling, pricing/policy/funnel extraction, SEO/GEO page discovery | browser inspection, web search, `curl`, `sitemap.xml`, `robots.txt`, Playwright/browser snapshots, manual page notes |
| Higgsfield | generated visuals, app icons, mascots, mockups, animations, ad creative, demo clips | Remotion code-rendered videos/stills after license check, real app screenshots, founder-owned assets, hand-authored HTML/CSS/SVG/canvas, local screen recordings, free/public-domain assets with license notes |
| MobAI | paid mobile device automation, cross-device UI observation, screenshots, recordings, local testing | XcodeBuildMCP for Apple simulator/device build, run, UI automation, screenshots, logs, and video after confirmation; `xcodebuild`/`simctl` only if XcodeBuildMCP is unavailable; Android emulator/ADB for Android-only fallback |
| Fastlane AI | post-launch organic content engine, Blitz generation, scheduling, analytics | manual content calendar, spreadsheet/JSON schedule, local prompts, platform-native drafts, no automated posting unless founder approves |
| Paid ASO/MMP/ad tools | keyword ranks, paid attribution, SKAdNetwork/ad-network reporting, competitor tracking | AppKittie if available, public store search, store-console analytics, manual keyword sheet, Apple Search Ads/Google Ads native reports when accounts exist |
| Sideshift or creator marketplace | creator sourcing, payouts, view tracking for UGC | manual TikTok sourcing, direct outreach, spreadsheet tracker, Stripe/Wise/Venmo payout records, creator-provided platform analytics screenshots |
| RevenueCat paid features | subscriptions, entitlements, experiments, web purchase links/funnels, webhooks | free RevenueCat tier when sufficient; local/mock purchase tests only for implementation, never as proof of live entitlement |
| Stripe paid/account features | web checkout, billing, tax, portal, webhooks | Stripe test mode when account exists; no real substitute for live payments and tax decisions |
| PostHog paid features | product analytics, experiments, session replay, surveys, data pipelines | PostHog free tier if sufficient; static event catalog and local logging only as pre-implementation planning |
| Resend paid/account features | verified sender domain, transactional/lifecycle email, broadcasts, webhooks, inbound | Resend free tier if sufficient; local email preview/logging for implementation only; Cloudflare Email Routing/Gmail for inbound support forwarding |

## Artifact Requirements

Create `TOOL_DECISIONS.md` when more than one paid or account-gated tool affects the launch.

Include:
- tool
- lane
- ideal paid workflow
- access status
- founder confirmation
- selected route: paid, export, free fallback, blocked, deferred
- fallback limitation
- license or rights status when a fallback uses Remotion, open-source media, public-domain assets, or founder-owned content
- downstream artifacts affected
- date checked

Small launches can add a "Tool decisions" section to `RESEARCH.md`, `ENGINEERING_PLAN.md`, `STORE_CONSOLE.md`, `SCREENSHOTS.md`, `FASTLANE_OPS.md`, or `PRODUCTION_READINESS.md`.

## Founder Gates

Always ask before:
- signing up for a paid tool or starting a trial
- upgrading a plan
- using a paid API/credit budget
- creating paid cloud resources
- connecting social accounts
- changing billing, pricing, subscriptions, or live checkout
- publishing, submitting, scheduling, or posting
- entering credentials, API keys, or account sessions not already available

If the founder approves a fallback, do not keep re-asking for the same lane unless the fallback limitations change.

## Common Failure Modes

- Treating a missing MCP tool as proof the founder does not own the service.
- Running hours of manual free research when the founder would have provided an export or paid access.
- Replacing MobAI with XcodeBuildMCP without saying that Android coverage and some cross-device automation are no longer covered.
- Calling local mocks "validated" for RevenueCat, Stripe, PostHog, or Resend when provider dashboards were never checked.
- Generating visual assets with free local methods or Remotion after Higgsfield was intended, without asking whether the founder wants to use Higgsfield or approve the fallback.
- Treating Remotion as universally free for commercial work without checking the current Remotion license and recording eligibility or founder approval.
- Creating a store-console or ASO packet from public pages alone when App Store Connect or Google Play Console access was available but not requested.

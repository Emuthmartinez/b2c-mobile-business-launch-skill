# LaunchBench Evals

LaunchBench is the skill's regression harness. It exists to keep future agents from repeating known launch-grade mistakes after the prose has grown.

## What To Evaluate

Use LaunchBench for failure modes that have happened before or would be expensive to miss:

- attribution screen emits an event but does not persist a stable key, PostHog person property, backend/profile value, or `other` free text
- simulator build passes but Apple distribution signing, Team ID, bundle ID, app record, certificate/profile, archive/export/upload, or TestFlight state is unknown
- iOS readiness ignores Codex Desktop native iOS/XcodeBuildMCP tools when exposed, or CLI proof names SnapshotPreviews/serve-sim without exported PNG/JSON paths, simulator URL/port, provider-proof pairing, and simulator/preview/distribution limitations
- App Store Connect app name is taken and the CLI proposes a fallback name without founder approval
- MobAI is unavailable and the agent silently switches to XcodeBuildMCP
- RevenueCat products exist but entitlement grant, restore, webhook, or backend projection is unproven
- Resend templates ignore `DESIGN.md`, unsubscribe rules, sender-domain proof, or support reply paths
- a new API key/env var appears but `SECRETS.md`, Doppler, CI injection, or public/server-only classification is not updated
- a new third-party docs/tooling URL appears but is not added to `source-registry.yaml`
- upstream App Store Connect CLI skills or provider docs change but stale command snippets remain in references/templates
- iOS ASC upload readiness is claimed from metadata/privacy prose while `APPLE_APP_STORE_REQUIREMENTS.md`, `PrivacyInfo.xcprivacy`, required reason APIs, SDK manifests/signatures, Xcode privacy report, protected-resource purpose strings, ATT, account deletion, review notes, or upload-warning proof is missing
- store screenshot work treats raw device captures as final App Store upload artwork without composed iPhone/iPad assets, copy overlays, device-well validation, icon/preview routing, and visual QA
- weekly source refresh treats auto-discovered links as accepted launch policy without review
- product/design/build handoff starts without `11_STAR_EXPERIENCE.md`, `11-star-experience.html`, a line of feasibility, and a V1 scalable slice
- product, onboarding, core-loop, or paywall work proceeds without `EMOTIONAL_DESIGN.md` when the 11-star target is 6-star or higher; or a HIGH-risk card (variable reward, streak, scarcity, urgency, social proof) ships without an Ethics Attestation, a `user_control_escape_hatch`, a `counter_metric`, and a truthfulness proof; or an emotional/UX audit returns prose with no per-journey card mapping or pathway to a better state
- onboarding reaches first value, a personalized plan, or a value-reveal screen but omits the native App Review popup immediately after that first-value moment
- design work produces a freeform `design-proposal.html`, mood board, or Markdown version label instead of mutating `state/business.json`/`state/theme.tokens.json`, rendering `design-room.html`, and versioning state with git
- monetization defaults are locked by reflex — soft paywall, ≤4-day trial, monthly-only, low price, English-only, ads before the paywall is proven, day-30 win-back as the retention plan — without surfacing the RevenueCat 2026 anti-pattern trade-offs (`revenue-monetization.md` §10 digest, `onboarding-conversion.md` Conversion Anti-Patterns, `paid-user-acquisition.md` Anti-Patterns) as founder-gated decisions to test
- paid growth is marked ready from ad-channel ideas without `PAID_UA.md`, one-channel focus, creative cadence, tracking baseline, blended report, RevenueCat LTV/CPA review, stop/scale rules, and founder spend approval
- social growth is marked ready from UGC ideas, views, or TikTok hooks without `VIRAL_GROWTH.md`, product-loop contract, abuse controls, monetization timing, analytics proof, and stop/scale rules
- a primary paid tool (AppKittie, XPOZ, Higgsfield, Refero, MobAI) is bypassed or replaced with a free fallback without first using ToolSearch to confirm the MCP path is absent, asking the founder, and recording the decision in TOOL_DECISIONS.md with tool, lane, access status, founder confirmation, selected route, and fallback limitation
- XPOZ MCP tools are listed in the system-reminder but the agent declares XPOZ unavailable and runs curl or web search without a ToolSearch verification step
- AppKittie MCP tools are available in the session but ASO keyword difficulty or competitor data is produced without calling them
- Higgsfield is authenticated and MCP tools are present but the agent does not invoke them and does not ask the founder to confirm the lane is deferred
- Refero "not found" is silently dropped with no TOOL_DECISIONS.md entry and no founder prompt
- fallback output is presented as equivalent to paid-tool quality without a confidence label, limitation note, and TOOL_DECISIONS.md entry
- Higgsfield is unavailable and the agent silently uses Remotion or local media without founder-approved fallback routing
- Remotion content assets are marked ready without license status, source inputs, manifest entries, render proof, or claim review
- paid video creatives move to distribution without a Virality Predictor (`brain_activity`) score and a recorded `virality_score`/`hook_dmn_risk` in `PAID_UA.md`
- a Higgsfield/Marketing Studio manifest asset is generated without a `prompt_brief` carrying the `DESIGN.md` tokens, or the Click-to-Ad `--url` shortcut is used without injecting the brief into `--prompt`
- a Soul identity is retrained from scratch while `PROJECT_STATE.yaml` `tools.higgsfield.identity` already holds a usable `soul_reference_id`/`avatar_id`, without checking `show_characters` first
- broad launch work starts without an orchestration preflight, critical-path/sidecar split, or `ORCHESTRATION.md`
- parallel agents are marked safe while sharing files, provider accounts, devices, migrations, git actions, or final readiness decisions
- spawned agents are allowed to stage, commit, push, mutate providers, control devices, run project-wide suites, or make founder-only decisions
- subagent findings are not reviewed, reconciled into `PROJECT_STATE.yaml`, converted into failure cards, or verified by focused and full-suite validators
- core engineering starts without a Compound Engineering freshness check, `ce-plan`, `ce-work`, review, test, and proof routing or an unavailable-with-reason fallback
- landing page is declared ready after a curl/API test while the live URL was never opened in a browser, a form field was never filled and submitted, and the success state was never visually confirmed
- wrangler deploy runs with an uncommitted working tree, an outdated major version, or a token whose scope was never verified with `wrangler whoami`
- Alpine.js is used with a strict CSP but the @alpinejs/csp build and x-model elimination are not confirmed before deploy, causing browser-only form failures that curl cannot detect
- landing copy is rewritten (hero, pricing, layout components) without loading `geo-seo.md` first; ranked-cohort claims, unshipped-feature promises, unverifiable authority endorsements, or lifetime-access promises ship without a pre-edit compliance scan
- JSON-LD schema blocks are added or modified in landing pages without parsing/validating the JSON before deploy
- contact email addresses (`@yourdomain.com`) are written into privacy/legal pages before MX records exist for the domain
- a waitlist form is live but duplicate-email idempotency (HTTP 200 for repeated submits) is undocumented

## Harness Shape

Scenario files live under `evals/launchbench/*.yaml` and should include:

- `id`
- `title`
- `prompt`
- `expected_guardrail`
- `validators`
- `must_catch`
- `should_say`

Run:

```bash
npm run launchbench
npm run test:validators
```

The bundled LaunchBench harness validates scenario structure, maps scenarios to deterministic validators, and runs the validator-fixture harness for positive and negative launch-state examples. Neither is a full LLM judge. For live agent behavior, use these scenarios as prompts for a fresh agent or subagent and compare the answer to `must_catch` and `should_say`.

## Independent Audit Use

After major skill edits or before declaring a launch complete:

- run deterministic validators against the current app repo
- run LaunchBench scenario checks
- run source freshness checks when the skill itself or third-party references changed
- use parallel audit agents only for independent review, not for final integration
- pass each audit agent the minimum scenario and artifact paths, not the intended answer
- write failures into `PROJECT_STATE.yaml` as active failure cards

## Acceptance

- At least the known failure scenarios remain represented.
- New real-world misses become new scenarios or failure cards.
- Deterministic validators are preferred over vague review prompts whenever a condition can be checked from files.

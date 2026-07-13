# Production Readiness

Status: partial until provider proof, mobile proof, store proof, security proof, and founder-only gates are resolved.

Do not mark this app launch-ready until `PROVIDER_PROOF.md`, `PROJECT_STATE.yaml`, and focused validators agree.

Compound Engineering readiness: record `ce-code-review`, the applicable CE test route such as `ce-test-browser` or `ce-test-xcode`, MobAI or equivalent E2E proof, and a `ce-proof` proof artifact before the engineering lane is done.

## MobAI Cross-Platform Proof

Keep component versions separate and replace every Pending value with live evidence before using MobAI to close engineering readiness.

- Docs checked: Pending
- Desktop app: Pending
- MCP server: Pending
- CLI package: Pending
- Selected tier: Pending (`Free`, `Plus`, `Pro`, blocked, or not needed)
- AI-healed flow: Pending (not used, or reviewed diff + passing rerun + evidence)
- Host-side script safety: Pending (not used, or endpoint allowlist + no embedded secrets + cleanup + backend proof)

| Platform | Device / OS | `.mob` flow | Evidence path | Provider correlation | Result |
| --- | --- | --- | --- | --- | --- |
| iOS | pending | pending | pending | pending | Pending |
| Android | pending | pending | pending | pending | Pending |

Run `npm run check:mobai-proof -- --root . --state PROJECT_STATE.yaml` and attach the result before MobAI closes a mobile engineering lane. A generated or AI-healed flow is not proof until its diff is reviewed and the edited flow reruns successfully. Predicate/condition loops need an explicit cap; parameterized counted loops need a validated bound. Host scripts must stay on allowlisted test/staging endpoints and keep secrets outside `.mob`/embedded JavaScript.

## Native iOS Proof

Use this section for iOS/iPadOS implementation proof when native Apple tooling is in scope. Simulator, preview, and browser-stream proof must be paired with `PROVIDER_PROOF.md` when app actions depend on RevenueCat, PostHog, Stripe, Resend, Sentry, databases, or store-console state. A simulator build alone is not distribution readiness and does not prove App Store signing, archive, export, upload, TestFlight, or founder approval; keep those gates in `APPLE_SIGNING.md`.

| Route | Required evidence | Output path | Limitation | Status |
| --- | --- | --- | --- | --- |
| Codex Desktop native iOS / XcodeBuildMCP | `session_show_defaults`; MCP tool route such as `build_run_sim`, `test_sim`, screenshot, UI snapshot, or logs; project/workspace; scheme; simulator/device; OS/runtime; configuration | screenshots/logs/xcresult path pending | Apple simulator/device proof only; does not replace MobAI Android proof, provider proof, or distribution readiness | Pending |
| XcodeBuildMCP CLI | docs checked date; `xcodebuildmcp --help` or `xcodebuildmcp tools`; project/workspace; scheme; simulator/device or destination; command output | CLI output path pending | Apple-only CLI proof; record docs-vs-skill mismatch and missing MobAI coverage | Pending |
| SnapshotPreviews | package URL/version/commit; `SnapshotTest` or `PreviewLayoutTest`; `TEST_RUNNER_SNAPSHOTS_EXPORT_DIR`; exported `.png` and `.json` under `snapshot-images`; deterministic preview fixtures | `snapshot-images/` pending | preview-only coverage; not runtime E2E and not real app E2E/provider proof | Pending |
| serve-sim | package/version or `npx serve-sim` resolution; booted simulator/device; preview URL/port such as `http://localhost:3200`; actions from `serve-sim gesture`/`button`/`type`; stream/log evidence | browser capture/log path pending | simulator stream only; does not replace backend/provider proof or App Store signing readiness | Pending |

Run `npm run check:native-ios -- --root .` and attach the result before marking iOS engineering, screenshot, app-preview, or production-readiness lanes done.

### Native iOS Launch-Critical Test Matrix

Name the prerelease `.xctestplan`, its unit/integration/UI/performance targets, release configuration, and the real evidence path for every applicable row. A done engineering lane needs existing `.xcresult`, screenshot/video, log, metrics JSON, or provider-correlation artifacts rather than prose-only claims.

| Risk / journey | Required variants | Runtime route | Evidence path | Provider correlation | Result |
| --- | --- | --- | --- | --- | --- |
| cold launch and core value journey | smallest/largest supported device, supported OS matrix | XcodeBuildMCP or MobAI runtime E2E | pending | backend/PostHog pending | Pending |
| account lifecycle | create/login/logout plus account deletion | UI + integration tests | pending | auth/backend pending | Pending |
| purchase lifecycle | StoreKit local purchase, sandbox/TestFlight entitlement, restore, refund/cancel state | StoreKit + real provider read-back | pending | RevenueCat/store pending | Pending |
| permissions | allowed and denied paths with alternate UX | UI tests on device/simulator | pending | analytics pending | Pending |
| resilience | offline, timeout, server error, retry, background/foreground, notification/deep link, interruption | integration + UI tests | pending | backend/Sentry pending | Pending |
| accessibility and presentation | `XCUIApplication.performAccessibilityAudit` or equivalent accessibility audit, VoiceOver task, Dynamic Type, light/dark appearance | accessibility tree + screenshots | pending | n-a | Pending |
| localization | supported locale/region matrix, truncation, RTL where applicable | `.xctestplan` configurations | pending | n-a | Pending |
| performance | cold-start, memory, FPS/jank, network, battery, crash/log budget | XCTest performance + MobAI metrics | pending | Sentry/performance pending | Pending |
| release device | Release configuration on a physical device, or explicit blocked/not-applicable reason | signed device build | pending | APPLE_SIGNING.md/TestFlight pending | Pending |

Record device/OS/locale/appearance/account-fixture coverage, skipped conditions, and the limitation of each route. SnapshotPreviews remains preview-only; simulator proof does not replace provider, signing, TestFlight, or physical-device release behavior.

## Experience Cards (Bright-Line Evidence)

Required when `EMOTIONAL_DESIGN.md` applies Experience Cards — proof, not prose, for each card's bright line. The emotional_design lane is not done until every applicable row is verified on a real device with evidence attached.

| Card | Bright-line claim | Evidence required | Verified |
| --- | --- | --- | --- |
| Commitment | editable by the user at any time | screenshot of Settings edit flow on device | Pending |
| Variable Reward | variation is real (≥30% content differentiation) or personalization convergence documented | `reward_variant` returns ≥2 distinct values in PostHog; or convergence rationale | Pending |
| Perceived Effort Delay | ≥50% of displayed steps map to real operations | step-to-operation map from `TECH_SPEC.md`; `real_step_ratio` value | Pending |
| Intent Mirroring | sources only user-provided fields; never on cancel/downgrade | source-field log; cancel-flow walk shows no mirror | Pending |
| HIGH-risk cards | counter-metric monitored | PostHog "Dark-Pattern Watch" dashboard live with alerts | Pending |

Run `npm run check:emotional-design -- --root .` and attach the result. Any unproven bright-line row blocks the emotional_design lane and mirrors to `lanes.emotional_design.blockers`.

# Production Readiness

Status: partial until provider proof, mobile proof, store proof, security proof, and founder-only gates are resolved.

Do not mark this app launch-ready until `PROVIDER_PROOF.md`, `PROJECT_STATE.yaml`, and focused validators agree.

Compound Engineering readiness: record `ce-code-review`, the applicable CE test route such as `ce-test-browser` or `ce-test-xcode`, MobAI or equivalent E2E proof, and a `ce-proof` proof artifact before the engineering lane is done.

## Native iOS Proof

Use this section for iOS/iPadOS implementation proof when native Apple tooling is in scope. Simulator, preview, and browser-stream proof must be paired with `PROVIDER_PROOF.md` when app actions depend on RevenueCat, PostHog, Stripe, Resend, Sentry, databases, or store-console state. A simulator build alone is not distribution readiness and does not prove App Store signing, archive, export, upload, TestFlight, or founder approval; keep those gates in `APPLE_SIGNING.md`.

| Route | Required evidence | Output path | Limitation | Status |
| --- | --- | --- | --- | --- |
| Codex Desktop native iOS / XcodeBuildMCP | `session_show_defaults`; MCP tool route such as `build_run_sim`, `test_sim`, screenshot, UI snapshot, or logs; project/workspace; scheme; simulator/device; OS/runtime; configuration | screenshots/logs/xcresult path pending | Apple simulator/device proof only; does not replace MobAI Android proof, provider proof, or distribution readiness | Pending |
| XcodeBuildMCP CLI | docs checked date; `xcodebuildmcp --help` or `xcodebuildmcp tools`; project/workspace; scheme; simulator/device or destination; command output | CLI output path pending | Apple-only CLI proof; record docs-vs-skill mismatch and missing MobAI coverage | Pending |
| SnapshotPreviews | package URL/version/commit; `SnapshotTest` or `PreviewLayoutTest`; `TEST_RUNNER_SNAPSHOTS_EXPORT_DIR`; exported `.png` and `.json` under `snapshot-images`; deterministic preview fixtures | `snapshot-images/` pending | preview-only coverage; not runtime E2E and not real app E2E/provider proof | Pending |
| serve-sim | package/version or `npx serve-sim` resolution; booted simulator/device; preview URL/port such as `http://localhost:3200`; actions from `serve-sim gesture`/`button`/`type`; stream/log evidence | browser capture/log path pending | simulator stream only; does not replace backend/provider proof or App Store signing readiness | Pending |

Run `npm run check:native-ios-proof -- --root .` and attach the result before marking iOS engineering, screenshot, app-preview, or production-readiness lanes done.

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

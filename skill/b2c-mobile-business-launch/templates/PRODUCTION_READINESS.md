# Production Readiness

Status: partial until provider proof, mobile proof, store proof, security proof, and founder-only gates are resolved.

Do not mark this app launch-ready until `PROVIDER_PROOF.md`, `PROJECT_STATE.yaml`, and focused validators agree.

Compound Engineering readiness: record `ce-code-review`, the applicable CE test route such as `ce-test-browser` or `ce-test-xcode`, MobAI or equivalent E2E proof, and a `ce-proof` proof artifact before the engineering lane is done.

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

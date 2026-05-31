# Technical Spec

Status: partial until implementation contracts, data model, provider boundaries, and test proof are complete.

## Compound Engineering Route

For core engineering work, check Compound Engineering freshness, route through CE skills when available, and record plan, work, review, test, and proof evidence.

## Experience Card Frontstage / Backstage

Required when `EMOTIONAL_DESIGN.md` applies Experience Cards. For each card-carrying screen, name the frontstage (what the user sees) and the backstage (the real operation behind it). This is what makes the Perceived Effort Delay honest and the Variable Reward genuinely variable — the bright-line proof lives here and in `PRODUCTION_READINESS.md`.

| Screen / Moment | Card | Frontstage (user sees) | Backstage (real operation) | State / data | Reduced-motion path |
| --- | --- | --- | --- | --- | --- |
| Goal question | Commitment | echoed goal on later screens | persist commitment to profile; editable from Settings | `commitment` record | instant text, no fade |
| Plan generation | Perceived Effort Delay | narrated processing steps | real fetch + personalization + format pass | step-to-operation map | static step list |
| Result reveal | Variable Reward | anticipation → reveal | content that genuinely varies by inputs/prior actions | `reward_variant` value | instant plain result |
| Pre-paywall pause | Intent Mirroring | user's own goal reflected | render only user-provided fields, sanitized | source field id | static block |

**Perceived Effort Delay — step-to-operation map (required):** list each displayed step and the real operation behind it; compute `real_step_ratio` (must be ≥ 0.50). No artificial sleep timer appended after computation completes; honor the `max_delay_ms` cap. `computation_type` ∈ {real_api_call, real_data_processing, ui_composition}.

# Analytics

Status: partial until live provider proof is recorded in `PROVIDER_PROOF.md`.

## Event Contract

| Event | When | Properties | Provider proof |
| --- | --- | --- | --- |
| attribution_source_selected | early onboarding source screen | self_reported_source, self_reported_source_label | PostHog event and person property evidence |
| review_prompt_eligible | after first value is visible | first_value_id, surface | onboarding proof |
| review_prompt_requested | native review API called | platform, surface | onboarding proof |

## Emotion Card Events

Required when the Emotional Experience System is in scope (`EMOTIONAL_DESIGN.md`). Every card applied in the Card Application Map must name one of these events here before implementation; see `references/emotional-experience-measurement.md` for the full per-card catalog and counter-metrics. Do not invent new names — extend this table.

| Event | When | Properties | Counter-metric role |
| --- | --- | --- | --- |
| emotion_card_fired | any Experience Card activates | card_id, surface, screen_id, flow_id, step_id, variant_id, session_id | system baseline |
| emotion_card_completed | user advances past the card moment | + completion_latency_ms | drop-off signal |
| emotion_card_abandoned | user exits during/just after a card fires | + abandon_reason, rage_tap_detected | dark-pattern watch |
| emotion_card_opt_out | user disables an emotional feature | card_id, opt_out_surface, opt_out_reason_shown | compulsion signal |
| commitment_made | commitment captured | commitment_type, commitment_value, flow_id, step_id | primary |
| variable_reward_revealed | reward shown after anticipation | surface, reward_type, reward_variant, anticipation_duration_ms, is_reduced_motion_fallback | primary + counter |
| perceived_effort_started / perceived_effort_completed | processing UI begins / ends | surface, effort_type, step_count, computation_type, real_step_ratio | labor-illusion proof |
| intent_mirror_shown / intent_mirror_continued | mirror pause displayed / user continues | surface, mirror_type, source_field, trigger_context | primary + conversion |

**Dark-Pattern Watch insight:** build a PostHog dashboard tile combining `emotion_card_abandoned` where `rage_tap_detected = true`, `emotion_card_opt_out` rate, sub-500ms reveal dismissals, `notification_disabled` (48h cohort), and `subscription_cancelled` within 24h of any card fire. Alert if any breaches its threshold for two consecutive weeks.

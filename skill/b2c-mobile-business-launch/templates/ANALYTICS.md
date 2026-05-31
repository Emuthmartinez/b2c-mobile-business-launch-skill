# Analytics

Status: partial until live provider proof is recorded in `PROVIDER_PROOF.md`.

## Event Contract

| Event | When | Properties | Provider proof |
| --- | --- | --- | --- |
| attribution_source_selected | early onboarding source screen | self_reported_source, self_reported_source_label | PostHog event and person property evidence |
| review_prompt_eligible | after first value is visible | first_value_id, surface | onboarding proof |
| review_prompt_requested | native review API called | platform, surface | onboarding proof |

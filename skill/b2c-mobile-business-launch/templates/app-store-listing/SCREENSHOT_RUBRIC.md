# Screenshot Rubric

Version: 1.1
Status: active
Owner: design-guru + marketing-guru + founder (override authority)

This rubric is the scored taste layer for the PRESENT/PROVEN/OPTIMIZED framework defined in SCREENSHOTS.md. Rubric scores fire as WARNINGS with a logged override; technical-correctness and Proven-existence checks are HARD ERRORS. Taste stays human.

## Dimensions

Each dimension is scored 0–3 per slot per locale. Weighted-high dimensions must each reach >= 2 for a slot to auto-pass. The overall weighted score must reach the stated threshold.

| # | Dimension | Weight | Score 0 | Score 1 | Score 2 (threshold) | Score 3 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **Thumbnail legibility** | HIGH | headline or key UI is unreadable at 60 px wide; text overlaps UI beyond recognition | legible at 120 px but not 60 px; marginal contrast | legible at 60 px; key text and icon clear at App Store search size | instantly clear at 40 px; headline dominates; zero ambiguity |
| 2 | **Hook-first ordering** | HIGH | slot 1 shows a splash, logo, or secondary feature; no clear payoff | slot 1 hints at value but does not show the magical V1 moment | slot 1 shows the 11-star V1 payoff; emotional beat lands | slot 1 is so compelling a user stops scrolling; ordering tells a complete narrative across all slots |
| 3 | **Truthfulness** | HIGH | shows UI that does not exist in the shipped build; outcome claims unsupported; fake ratings or endorsements | shows real UI but adds unsupported superlatives ("best", "#1") | shows real app UI; every visible claim matches `REVENUE_OPS.md` and legal docs; no bait-and-switch | real UI AND claim-checked against `REVENUE_OPS.md`; reviewer note drafted; no edge case that could trigger Guideline 5.2 |
| 4 | **One-idea-per-slot** | MEDIUM | multiple unrelated ideas compete in one slot; visual noise | two ideas present but one dominates | one clear idea per slot; supporting elements reinforce not distract | single idea, zero visual noise; a user can state the idea in four words |
| 5 | **Brand-token fidelity** | MEDIUM | colors, type, or motion diverge from `state/theme.tokens.json` without a recorded override | minor variance (one secondary color off-token) | all primary colors, type scale, and frame style match `state/theme.tokens.json` | pixel-perfect token adherence; composition would pass a design-system audit |
| 6 | **ASO keyword reinforcement** | MEDIUM | no visible keyword from `APP_STORE_LISTING.md` appears in any headline or copy overlay | one keyword present, buried in body copy | primary keyword and one secondary keyword visible in headlines across the deck | every headline reinforces a targeted keyword naturally; copy reads human, not stuffed |
| 7 | **Emotional North Star** | LOW | screenshot evokes no recognizable emotion; neutral or cold | some warmth or aspiration but the target emotion is not clearly landed | the target Emotional North Star from `EMOTIONAL_DESIGN.md` is felt within 2 seconds | shot is emotionally decisive; an independent viewer can name the exact emotion without context |
| 8 | **Localization quality** | LOW (only for non-en-US locales) | machine-translated copy with obvious errors; RTL layout broken | human-reviewed copy but awkward phrasing; RTL partially correct | natural-sounding translated copy; RTL layout correct; no truncation | native-speaker-approved; locale-specific cultural references used; RTL pixel-checked on device |

### Weighted Score Formula

```
weighted_score = (legibility * 3 + hook_first * 3 + truthfulness * 3
               + one_idea * 2 + brand_token * 2 + aso_keyword * 2
               + emotional_north_star * 1 + localization * 1)
             / (3+3+3+2+2+2+1+1)   # denominator = 17

pass_threshold = 0.65   # 65% of max weighted score = 11.05 out of 17
high_dimension_minimum = 2  # all three HIGH dimensions must reach >= 2
```

For non-en-US locales the localization dimension is included. For en-US it is excluded and the denominator drops to 16.

## Grader Protocol

### CRITICAL: Producer != Verifier Requirement

**The agent or session that builds the screenshot deck MUST NOT be the same agent or session that grades it.**

This separation exists because the builder has motivated reasoning to pass their own work. A grader with no stake in the outcome notices copy that is too small at thumbnail size, hooks that bury the payoff, and claims that are slightly broader than the shipped UI — the builder reads over these because the work feels familiar. The validator enforces this by reading `builder` and `grader` identity fields and erroring if they are identical or missing.

Workflow:

1. **Builder session** writes final PNGs to `screenshots/final/` and records `"builder": "<agent-id>/<session-id>"` in the ledger header.
2. **A separate grader session** (different agent name or session token) is spawned after the final PNGs are committed.
3. **Grader session** reads the PNGs, scores every dimension, writes non-empty `grader_notes` per slot, and records `"grader": "<agent-id>/<session-id>"` in the ledger header.
4. No agent should write both `builder` and `grader` with the same value.

The settings.json hook `post-screenshot-export` in this repo routes grading to a distinct agent after final PNGs are written; do not collapse that into the builder step.

### Inputs

- Final PNGs under `screenshots/final/<locale>/<device-well>/`
- `APP_STORE_LISTING.md` (keyword list)
- `state/theme.tokens.json` (brand tokens)
- `EMOTIONAL_DESIGN.md` (Emotional North Star)
- `REVENUE_OPS.md` (pricing/claim truth-check source)
- This rubric file (current version)

### Steps

1. For each required slot and locale, load the final PNG.
2. Score each dimension 0–3 using the criteria above.
3. Compute the weighted score and the pass boolean.
4. Write non-empty `grader_notes` for every slot — at minimum one sentence explaining the score for each dimension that could plausibly change. Empty or missing `grader_notes` is treated by the validator as a grading skip.
5. If pass is false AND the founder has not yet filed an override: emit a WARNING with the slot identifier, the failing dimension(s), and the score. Do NOT block launch from this alone.
6. Write the score record to `screenshot-rubric-scores.json` (see schema in `screenshot-rubric-scores.example.json`). Include `builder` and `grader` identity fields in the ledger root.
7. If a founding override is provided: log `override.by`, `override.reason`, and `override.at` in the same record.

### Identity Fields

The ledger root MUST contain:

```json
{
  "builder": "<agent-name-or-role>/<session-id-or-commit>",
  "grader": "<agent-name-or-role>/<session-id-or-commit>",
  ...
}
```

These can be agent names, roles, or any token that uniquely identifies the session. They must be non-empty strings and must differ from each other. Using human-readable labels like `"design-guru/session-abc123"` or `"marketing-guru/grading-pass-2026-06-05"` is encouraged.

### Suspicious Perfect Score

When all high-dimension scores are 3 and `grader_notes` is very short (fewer than 50 characters), the validator fires a `store_screenshots.suspicious_perfect` warning. A perfect score requires proportionally detailed justification — it should be harder to explain than an average score, not easier. If scores are genuinely all-3s, write at least one sentence per dimension explaining what specific visual evidence supports the score.

### Auto-Pass Threshold

A slot passes auto-grading when ALL of the following are true:

- `legibility >= 2`
- `hook_first >= 2`
- `truthfulness >= 2`
- `weighted_score >= 0.65`

### Founder Override

When auto-pass is false, the founder may override by recording:

```json
"override": {
  "by": "founder",
  "reason": "<one-sentence human rationale>",
  "at": "<ISO-8601 timestamp>"
}
```

An override with an empty or null `reason` is treated by the validator as no override (still emits WARNING).

## Improve-Over-Time Loop

The rubric is versioned. Each graded deck becomes a permanent fixture.

### Fixture Accumulation

Every time a deck is graded, the `screenshot-rubric-scores.json` is committed alongside the final PNGs. This creates a growing fixture corpus: scores + PNG paths + founder accept/override. The fixture corpus is the basis for future calibration.

### Rubric Versioning

When any dimension definition or threshold changes:

1. Increment the `rubric_version` field (semver patch for threshold tweaks, minor for new dimensions).
2. Re-grade any fixture that was graded under an older version and update `rubric_version` in the record (or mark it `stale: true`).
3. Old fixtures with `stale: true` are excluded from threshold enforcement but kept for historical comparison.

### Conversion Tuning (deferred)

Linking rubric scores to downstream conversion metrics (PPO results, App Analytics impression-to-install) is deferred until the first 90-day post-launch window produces sufficient data. When that data is available: correlate per-dimension scores with conversion lift, re-weight accordingly, and commit a new `rubric_version`.

## Notes for Maintainers

- This rubric is the reference implementation for the PRESENT/PROVEN/OPTIMIZED pattern. Every other lane that adds an OPTIMIZED layer should mirror this structure: versioned rubric, scored fixture ledger, founder override path, improve-over-time loop.
- The validator `check:store-screenshots` reads `screenshot-rubric-scores.json` and enforces this rubric. When the lane is "partial" a missing score is a WARNING. When the lane is "done" a missing score is an ERROR.
- Do not collapse PROVEN checks into OPTIMIZED. A missing file on disk is always a hard error regardless of scores.
- The ledger schema is at `rubric_version: 1.1`. Version 1.1 added `builder`, `grader`, and per-slot `grader_notes` fields. Ledgers graded under v1.0 that lack these fields will fire `store_screenshots.grader_missing` warnings; re-grade them before marking the lane "done".
- Tier-1 anti-gaming: the validator rejects `screenshot-rubric-scores.json` that is byte-identical to `screenshot-rubric-scores.example.json` or below 200 bytes. The example file is the scaffold; it must be replaced with real scores, not copied.
- Tier-3 PNG reality checks: for every `final_png` path in the ledger the validator reads the PNG IHDR header bytes and checks that the declared device-well dimensions and alpha-removal claim are true. A final PNG that carries an alpha channel after `alpha removed` is claimed is a hard error when the lane is "done".

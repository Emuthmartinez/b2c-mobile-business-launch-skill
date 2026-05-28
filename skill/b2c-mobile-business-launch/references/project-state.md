# Project State And Launch Cockpit

Use this when starting, continuing, auditing, or handing off a launch. The goal is to keep one compact, machine-readable state file that a future agent can validate before it mutates the app or claims launch readiness.

## Required Artifacts

- `PROJECT_STATE.yaml`: compact source of truth for phase, autonomy mode, orchestration strategy, lane statuses, paid-tool routing, secrets, provider setup, proof, open questions, and active failure cards.
- `launch-cockpit.html`: founder-visible rendered view of the same state.
- `LAUNCHBENCH.md` or `proof.launchbench` in `PROJECT_STATE.yaml`: eval/check history for known failure modes.

Use `templates/PROJECT_STATE.yaml` as the starting point. Keep it names-only for secrets and credentials.

## Status Contract

Lane statuses must be one of:

- `done`: artifact, live dashboard, code path, provider state, or verification note exists.
- `partial`: work exists but the lane cannot be relied on yet.
- `blocked`: explicit blocker, owner, and next action exist.
- `not_needed`: reason is recorded and traceable to product scope.
- `deferred`: owner, reason, and revisit condition exist.

Never mark a lane `done` from prose alone. It needs evidence paths or live proof.

## Update Cadence

Update `PROJECT_STATE.yaml`:

- at the start of a new session after source-truth recovery
- before using a paid/account-gated fallback
- before dispatching subagents, worktrees, or parallel specialist audits
- when a new secret, provider, bundle ID, app record, product, entitlement, analytics event, email route, or store field appears
- before crossing research -> 11-star experience, experience -> design, design -> build, build -> proof, or proof -> submission
- after validation or LaunchBench runs
- before final handoff or commit

## State Rules

- `autonomy.mode` controls what the agent may do without founder approval. See `autonomy-modes.md`.
- top-level `orchestration` records preflight, strategy, candidate units, parallel-safe units, serialized units, spawned agents, collision checks, output review, state reconciliation, and validators.
- top-level `compound_engineering` records whether Compound Engineering skills were available, used, blocked, or replaced with an equivalent fallback.
- `tools.*.docs_checked_at` records current-doc refresh dates for fast-moving CLIs and providers.
- `tools.*.required_secrets` lists names only. Values belong in Doppler or the approved provider.
- `lanes.security` tracks `SECURITY.md`, `security-review.html`, security tool routing, accepted risks, and release proof.
- `lanes.experience` tracks `11_STAR_EXPERIENCE.md`, `11-star-experience.html`, the line of feasibility, and the V1 scalable slice.
- `lanes.analytics_attribution.attribution_contract` is a hard data contract, not a UI note.
- `lanes.growth` tracks `VIRAL_GROWTH.md`, product-led referral/share mechanics, content format evidence, UGC/Fastlane state, and growth proof.
- `proof.commands` should include command, expected result, actual result, and evidence path.
- `failure_cards.active` should point to concrete risks, not generic reminders.

## Validation Commands

When the app repo has this skill's scripts copied or callable from the skill path:

```bash
npm run validate:launch-state -- --root /path/to/app
npm run check:attribution -- --root /path/to/app
npm run check:secrets -- --root /path/to/app
npm run check:security -- --root /path/to/app
npm run check:11-star -- --root /path/to/app
npm run check:viral-growth -- --root /path/to/app
npm run check:orchestration -- --root /path/to/app
npm run check:apple-signing -- --root /path/to/app
npm run check:store-console -- --root /path/to/app
npm run render:launch-cockpit -- --root /path/to/app
```

If the scripts are executed directly from the installed skill, run them with `tsx` and pass `--root` to the app repo.

## Launch Cockpit

Render `launch-cockpit.html` whenever state changes materially. It should show:

- project, phase, platform, bundle IDs, and autonomy mode
- orchestration strategy, serialized resources, spawned-agent status, and collision/reconciliation proof
- lane statuses and evidence paths
- 11-star experience status, visual proof, and V1 scalable slice blockers
- paid-tool/provider route, docs checked date, required secret names, preflight, validation, and fallback
- attribution contract completeness
- security lane, accepted risks, and security-tool routing
- active failure cards and founder-only gates
- latest proof commands and blocked next actions

The cockpit is not a replacement for canonical docs. It is a dashboard over them.

## Acceptance

- A future agent can tell what to work on next without rereading every artifact.
- The founder can see blockers, proof, and approvals in one rendered HTML file.
- Validators catch the known failure modes before a launch is called ready.
- State never contains raw secrets, passwords, private keys, credential file contents, or real-looking placeholder secrets.

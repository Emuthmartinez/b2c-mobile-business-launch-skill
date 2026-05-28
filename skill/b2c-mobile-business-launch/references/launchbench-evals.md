# LaunchBench Evals

LaunchBench is the skill's regression harness. It exists to keep future agents from repeating known launch-grade mistakes after the prose has grown.

## What To Evaluate

Use LaunchBench for failure modes that have happened before or would be expensive to miss:

- attribution screen emits an event but does not persist a stable key, PostHog person property, backend/profile value, or `other` free text
- simulator build passes but Apple distribution signing, Team ID, bundle ID, app record, certificate/profile, archive/export/upload, or TestFlight state is unknown
- App Store Connect app name is taken and the CLI proposes a fallback name without founder approval
- MobAI is unavailable and the agent silently switches to XcodeBuildMCP
- RevenueCat products exist but entitlement grant, restore, webhook, or backend projection is unproven
- Resend templates ignore `DESIGN.md`, unsubscribe rules, sender-domain proof, or support reply paths
- a new API key/env var appears but `SECRETS.md`, Doppler, CI injection, or public/server-only classification is not updated
- a new third-party docs/tooling URL appears but is not added to `source-registry.yaml`
- upstream App Store Connect CLI skills or provider docs change but stale command snippets remain in references/templates
- weekly source refresh treats auto-discovered links as accepted launch policy without review
- product/design/build handoff starts without `11_STAR_EXPERIENCE.md`, `11-star-experience.html`, a line of feasibility, and a V1 scalable slice
- social growth is marked ready from UGC ideas, views, or TikTok hooks without `VIRAL_GROWTH.md`, product-loop contract, abuse controls, monetization timing, analytics proof, and stop/scale rules
- Higgsfield is unavailable and the agent silently uses Remotion or local media without founder-approved fallback routing
- Remotion content assets are marked ready without license status, source inputs, manifest entries, render proof, or claim review
- broad launch work starts without an orchestration preflight, critical-path/sidecar split, or `ORCHESTRATION.md`
- parallel agents are marked safe while sharing files, provider accounts, devices, migrations, git actions, or final readiness decisions
- spawned agents are allowed to stage, commit, push, mutate providers, control devices, run project-wide suites, or make founder-only decisions
- subagent findings are not reviewed, reconciled into `PROJECT_STATE.yaml`, converted into failure cards, or verified by focused and full-suite validators

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

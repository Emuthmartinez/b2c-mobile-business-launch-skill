# AGENTS.md

This repo maintains the `b2c-mobile-business-launch` skill: source skill files, references, templates, validators, LaunchBench evals, package metadata, and installed runtime sync.

This file is for maintaining this skill repo itself. Do not copy these instructions into a launched business or generated app repo. Business repos created through the skill must get their own product-specific `AGENTS.md` and `CLAUDE.md` from the shipped templates, filled with the current app, stack, launch state, and source-of-truth docs.

## Repo Map

- `README.md`: public overview and maintainer commands.
- `skill/b2c-mobile-business-launch/SKILL.md`: skill entrypoint and progressive-disclosure routing.
- `skill/b2c-mobile-business-launch/references/`: detailed launch, provider, source freshness, and maintenance references.
- `skill/b2c-mobile-business-launch/templates/`: reusable launch artifacts copied into app repos.
- `skill/b2c-mobile-business-launch/templates/repo-agent-entrypoints/`: business-repo `AGENTS.md` and `CLAUDE.md` templates that keep future agents on the launch skill workflow.
- `skill/b2c-mobile-business-launch/scripts/`: deterministic validators, renderers, LaunchBench harness, and source freshness tooling.
- `skill/b2c-mobile-business-launch/evals/launchbench/`: known failure-mode scenarios.
- `skill/b2c-mobile-business-launch/agents/openai.yaml`: UI metadata.

## First Reads

1. `README.md`
2. `skill/b2c-mobile-business-launch/SKILL.md`
3. Any directly relevant reference under `skill/b2c-mobile-business-launch/references/`
4. The script/template/eval files you will change

Use the skill-creator guidance when changing skill structure, trigger text, references, bundled scripts, or validation behavior.

When changing generated business-repo guidance, edit the shipped templates and validators under `skill/b2c-mobile-business-launch/` first; only update this root file for repo-maintenance practices.

## Agent Legibility

Keep this file as a concise map, not a duplicate manual. Put detailed launch policy in `SKILL.md` and `references/`, reusable generated output in `templates/`, and deterministic enforcement in `scripts/` plus LaunchBench. When an agent miss repeats, add or tighten a validator/eval instead of relying on a longer reminder.

## Commands

From repo root:

```bash
npm install
npm run audit
npm run launchbench
npm run test:validators
npm run check:source-registry
npm run check:agent-entrypoints
npm run check:workflow-adherence
npm pack --dry-run --json
```

Runtime copy:

```bash
repo_root="$PWD"

rsync -a --delete --exclude node_modules \
  "$repo_root/skill/b2c-mobile-business-launch/" \
  /Users/eduardomuthmartinez/.codex/skills/b2c-mobile-business-launch/

(
  cd /Users/eduardomuthmartinez/.codex/skills/b2c-mobile-business-launch
  npm install
  npm run audit
  npm pack --dry-run --json
)

diff -qr --exclude node_modules \
  "$repo_root/skill/b2c-mobile-business-launch" \
  /Users/eduardomuthmartinez/.codex/skills/b2c-mobile-business-launch

ls -ld ~/.codex/skills/b2c-mobile-business-launch \
  ~/.claude/skills/b2c-mobile-business-launch \
  ~/.agents/skills/b2c-mobile-business-launch
```

## Runtime Sync

Edit the repo source first. Before claiming the skill is installed, mirror the current checkout's `skill/b2c-mobile-business-launch/` into `~/.codex/skills/b2c-mobile-business-launch/`, run the runtime audit there, and verify Claude/Agents symlinks. On this machine, `~/.claude/skills/b2c-mobile-business-launch` and `~/.agents/skills/b2c-mobile-business-launch` point to the Codex runtime copy.

## Source Freshness

New external URLs must be tracked in `skill/b2c-mobile-business-launch/references/source-registry.yaml`.

Use:

```bash
npm run check:source-registry
npm run refresh:source-freshness
```

For Doppler, PostHog, RevenueCat, Stripe, Resend, Apple/App Store Connect, Google Play, XcodeBuildMCP, MobAI, Refero, Higgsfield, Fastlane, Remotion, and similar fast-moving tools, do not trust memory or old transcripts for command syntax. Refresh official docs or local CLI `--help`/version output before changing setup guidance.

The weekly freshness workflow may auto-add candidate URLs, but candidates are not accepted launch policy until reviewed and backed by reference/template/validator/eval updates when relevant.

## Subagents

Use subagents for independent bounded audits and disjoint implementation slices. The orchestrator owns integration, final edits, git, runtime sync, and final verification. Do not let subagent findings alone mark the skill ready.

Useful subagent lanes:

- source freshness scout
- ASC capability auditor
- validator/eval auditor
- template consistency auditor
- runtime install auditor

## Guardrails

- Do not commit secrets, provider keys, screenshots of credentials, `.p8`, `.p12`, `.mobileprovision`, or local `.env` values.
- Do not silently downgrade paid/account-gated tooling to free fallbacks.
- Do not update third-party command examples from memory.
- Do not add a new known miss as prose only; add a validator or LaunchBench scenario when deterministic coverage is possible.
- Do not call repo work complete until source audit, LaunchBench, validator fixtures, runtime sync, and git status are clean or blockers are explicit.

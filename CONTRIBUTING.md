# Contributing

Thanks for your interest in improving the **B2C Mobile Business Launch Skill**. This guide is for **humans and AI agents alike** — both are first-class contributors here, and both are held to the same gates.

This repo is unusual: it is a *skill* (markdown launch playbooks plus deterministic TypeScript validators), not an app. The validators are the contract. If your change matters, it should be reflected in a validator, a LaunchBench eval, a template, or a reference — not just prose.

---

## TL;DR

1. Fork / branch from `main`.
2. `npm install` (and `npm install --prefix skill/b2c-mobile-business-launch`).
3. Make your change. **Edit the source under `skill/b2c-mobile-business-launch/`** — never the installed runtime copy.
4. If you touched anything under `skill/`, bump the version manifest (see [Versioning discipline](#versioning-discipline)).
5. Run the gate: **`npm run audit:ci` must pass green.**
6. Open a **draft PR** with a clear description. Mark it ready once CI is green.

---

## Project layout

Read these first, in order:

1. [`README.md`](README.md) — what the skill is and who it's for.
2. [`AGENTS.md`](AGENTS.md) — the maintainer guide and repo map (canonical for how the repo is organized and maintained).
3. [`CLAUDE.md`](CLAUDE.md) — Claude-specific maintainer notes.
4. `skill/b2c-mobile-business-launch/SKILL.md` — the skill entrypoint and routing.
5. The specific `references/`, `templates/`, `scripts/`, or `evals/` file you intend to change.

> **Source of truth:** all real content lives under `skill/b2c-mobile-business-launch/`. The author's machine mirrors that into an installed runtime (`~/.codex/skills/...`); that sync is maintainer-only and **not** something external contributors need to do. Always edit the repo source.

---

## Local setup

Requires **Node.js 22** (matches CI).

```bash
npm install
npm install --prefix skill/b2c-mobile-business-launch
```

Run the full local audit (this is the gate, plus a maintainer-only skill lint that auto-skips if its tooling isn't installed):

```bash
npm run audit
```

To run exactly what CI runs (no maintainer-only steps):

```bash
npm run audit:ci
```

You can also run individual validators while iterating, e.g.:

```bash
npm run test:validators        # validator unit fixtures
npm run launchbench            # known failure-mode scenarios
npm run audit:links            # internal link integrity
npm run check:security -- --root skill/b2c-mobile-business-launch/templates --state PROJECT_STATE.yaml
```

---

## The rules that CI enforces

These are not style preferences — `npm run audit:ci` will fail your PR if you skip them.

### Versioning discipline
Any change under `skill/b2c-mobile-business-launch/` must bump `skill/b2c-mobile-business-launch/skill-version.json` **in the same commit**:

- `version` — semver, increment it.
- `updatedAt` — `YYYY-MM-DD`.
- `releaseNotes` — add at least one concrete note for what changed (the file requires ≥2 notes total).

Keep versions in **parity** across `package.json` (root), `skill/b2c-mobile-business-launch/package.json`, `skill-version.json`, and both `package-lock.json` files. After bumping, run `npm install --package-lock-only` in both locations so the lockfiles match. `check:package-parity` and `check:version-discipline` verify this.

### Source freshness
Any **new external URL** you reference in docs must be registered in `skill/b2c-mobile-business-launch/references/source-registry.yaml` with an `id`, `url`, `owner`, and the `locations` it appears in. `check:source-registry` enforces this. For fast-moving third-party tools (Doppler, RevenueCat, Stripe, PostHog, Resend, Apple/App Store Connect, Google Play, Fastlane, Remotion, etc.), **refresh the official docs or local CLI `--help` before changing command guidance** — do not rely on memory or old transcripts.

### Secrets
Never commit secrets. `.env.example` files are **names-only**. State files, cockpits, and templates must not contain real or real-looking secret values; the secret/template-safety validators check for this.

### Prefer enforcement over reminders
This repo's philosophy: when a mistake can recur, **add or tighten a validator or LaunchBench eval** rather than adding a longer paragraph of instructions. If you're changing generated business-repo guidance, edit the **shipped templates and validators** under `skill/b2c-mobile-business-launch/` first — not the root maintainer files.

---

## Pull request expectations

- **Scope:** keep PRs focused and reviewable. One concern per PR. Large refactors should be discussed in an issue first.
- **Draft first:** open as a draft, mark ready once CI is green. Don't request a merge on red CI.
- **Green gate:** `npm run audit:ci` must pass locally before you push. CI runs the same thing on Node 22.
- **Description:** explain *what* changed and *why*, and note which validators/evals you added or ran. If you changed behavior, point to the validator or eval that now covers it.
- **Commits:** clear, descriptive messages. Reference the issue if there is one.
- **No drift:** if you change a command, reference, or template, update every place that mirrors it (the audit will usually catch divergence).
- **Tests for behavior:** behavior changes should come with validator-fixture and/or LaunchBench coverage, not just doc edits.

A good PR is one a reviewer can verify by reading the diff and watching CI go green.

---

## Notes for AI-agent contributors

If you are an agent working in this repo:

- **Read `AGENTS.md` and `CLAUDE.md` before editing.** They are the canonical maintainer contracts.
- **Edit the repo source, not the installed runtime**, and do not perform the maintainer-only runtime sync unless you are the maintainer on the author's machine.
- **Run the validators yourself.** Do not mark a change ready based on subagent findings alone — the orchestrator owns integration, the version bump, git, and final verification.
- **Bump `skill-version.json`** in the same change when you touch `skill/`, and keep package/lockfile parity.
- **Refresh upstream docs/CLI help** before changing any third-party command guidance.
- When a recurring miss shows up, **encode the fix as a validator or eval**, not a longer prompt.

---

## Scope of the project

This skill is intentionally **opinionated** and targets **subscription / freemium consumer mobile apps**. It does not currently cover one-time purchases or ad-based monetization. Contributions that deepen the existing lanes (research, design, onboarding, paywalls, store ops, growth, verification) are very welcome. Proposals to expand scope (e.g. ads) are best opened as an issue for discussion first.

---

## Licensing

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE) that covers this repository.

# CLAUDE.md

Read `AGENTS.md` first; it is the canonical operating guide for {{APP_NAME}}.

Claude-specific notes:

- Continue using the `b2c-mobile-business-launch` skill for launch, revenue, analytics, store, security, growth, and production-readiness work. Do not ask the founder to say "use the skill" again once the lane is active.
- Use `APP_AGENTS.md` and `agents/` for role routing, but keep product truth in `AGENTS.md` and the source docs it names. For broad work, use subagents or record why they are unavailable or unsafe.
- Use Compound Engineering skills when available for brainstorm, plan, work, worktree, review, and proof stages; record unavailable routes rather than skipping them silently.
- Use subagents only for scoped independent audits or isolated file ownership recorded in `ORCHESTRATION.md`.
- Do not stage, commit, push, release, submit builds, connect accounts, spend money, change pricing, mutate credentials, or mark readiness from subagent findings alone.
- Refresh official docs and local CLI help before changing third-party command guidance for Doppler, PostHog, RevenueCat, Stripe, Resend, Apple/App Store Connect, Google Play, XcodeBuildMCP, MobAI, Refero, Higgsfield, Fastlane, Remotion, or similar fast-moving tools.

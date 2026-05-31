# CLAUDE.md

Read `AGENTS.md` first; it is the canonical operating guide for {{APP_NAME}}.

Claude-specific notes:

- Continue using the `b2c-mobile-business-launch` skill for launch, revenue, analytics, paid UA, store, security, growth, and production-readiness work. Do not ask the founder to say "use the skill" again once the lane is active.
- For design work, use the Design Room state loop: mutate `state/business.json` and `state/theme.tokens.json`, render `design-room.html`, and version/baseline with git instead of creating one-off design proposal files.
- Use `APP_AGENTS.md` and `agents/` for role routing, but keep product truth in `AGENTS.md` and the source docs it names. For broad work, use subagents or record why they are unavailable or unsafe.
- Use Compound Engineering skills when available for `ce-update`, brainstorm, plan, work, worktree, review, test, and proof stages; record unavailable routes rather than skipping them silently.
- Use subagents only for scoped independent audits or isolated file ownership recorded in `ORCHESTRATION.md`.
- Use ASC CLI/skills for App Store Connect work by default, including app creation, metadata, screenshots, TestFlight, review/status, products/subscriptions, and RevenueCat catalog sync. Manual console-only instructions are a fallback after CLI/auth/capability blockers or founder approval.
- Do not stage, commit, push, release, submit builds, connect accounts, spend money, change pricing, mutate credentials, or mark readiness from subagent findings alone.
- Refresh official docs and local CLI help before changing third-party command guidance for Doppler, PostHog, RevenueCat, Stripe, Resend, Apple/App Store Connect, Google Play, XcodeBuildMCP, MobAI, Refero, Higgsfield, Fastlane, Remotion, or similar fast-moving tools.

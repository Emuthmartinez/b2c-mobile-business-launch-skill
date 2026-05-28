# CLAUDE.md

Read `AGENTS.md` first; it is the canonical maintainer guide for this repo.

Claude-specific notes:

- Use subagents only for scoped independent audits or isolated file ownership assigned by the orchestrator.
- Do not stage, commit, push, sync runtime copies, or mark readiness from subagent findings alone.
- Refresh official docs and local CLI help before changing third-party command guidance.
- After any skill change, ensure the Codex installed runtime is synced and audited because Claude and Agents consume that installed copy through symlinks on this machine.

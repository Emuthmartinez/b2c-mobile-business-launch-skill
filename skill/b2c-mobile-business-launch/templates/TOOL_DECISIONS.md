# Tool Decisions

Record paid, account-gated, and fallback tooling decisions before using or downgrading tools.

| Tool | Lane | Access status | Founder confirmation | Selected route | Fallback limitation |
| --- | --- | --- | --- | --- | --- |
| Compound Engineering | engineering | check current install | required for core engineering work | ce-update, ce-plan, ce-work, ce-code-review, ce-proof | fallback requires a written reason |
| AppKittie | research / ASO | not checked | required before paid/account access | AppKittie MCP | public research only after approval |
| Refero | design | not checked | required before paid/account access | Refero MCP | bundled patterns only after approval |
| Higgsfield | content assets | not checked | required before paid generation | Higgsfield MCP | Remotion fallback requires approval |
| MobAI | mobile proof | tier and desktop/MCP/CLI versions not checked | Free needs no spend approval; Plus/Pro and coverage-changing fallback require confirmation | Free / Plus / Pro plus active MCP/CLI route | XcodeBuildMCP is Apple-only; record missing Android/cross-platform proof |
| Codex Desktop native iOS / XcodeBuildMCP | iOS proof | use when exposed or configured | not required for exposed local tools; required when replacing MobAI | session_show_defaults, build_run_sim/test/screenshot/log tools or CLI | Apple-only proof; not Android, provider, or distribution readiness |
| SnapshotPreviews | iOS preview proof | not checked | not required unless introducing new dependency | SnapshotTest or PreviewLayoutTest with TEST_RUNNER_SNAPSHOTS_EXPORT_DIR | preview-only PNG/JSON proof; not runtime E2E |
| serve-sim | iOS simulator stream | not checked | not required unless introducing new dependency or public tunnel | npx serve-sim / localhost preview | simulator stream; not provider or App Store signing proof |

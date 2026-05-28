# XcodeBuildMCP Testing Fallback

Use this when iOS, iPadOS, macOS, tvOS, watchOS, or visionOS build/test/run/UI automation is needed, especially when MobAI is unavailable and the founder confirms a free/open-source Apple workflow fallback.

XcodeBuildMCP is not a full MobAI replacement. It is excellent for Apple simulator/device workflows, Xcode builds, tests, screenshots, UI automation, logs, debugging, and video capture. It does not cover Android device automation.

For Apple distribution, TestFlight, physical-device signing, archives, exports, or uploads, load `apple-signing-release.md` too. XcodeBuildMCP simulator proof does not by itself prove App Store signing readiness.

## Contents

- Current Sources To Refresh
- Live Documentation Gate
- When To Use
- Setup Flow
- MCP Client Routing
- CLI Routing
- Testing And Screenshot Workflow
- Privacy And Telemetry
- Troubleshooting
- Evidence Requirements

## Current Sources To Refresh

Refresh these before implementation because XcodeBuildMCP versions, tool names, and client snippets change:
- GitHub: `https://github.com/getsentry/XcodeBuildMCP`
- Installation: `https://xcodebuildmcp.com/docs/installation`
- Setup: `https://xcodebuildmcp.com/docs/setup`
- MCP clients: `https://xcodebuildmcp.com/docs/clients`
- CLI usage: `https://xcodebuildmcp.com/docs/cli`
- Configuration: `https://xcodebuildmcp.com/docs/configuration`
- Tools reference: `https://xcodebuildmcp.com/docs/tools`
- Workflows: `https://xcodebuildmcp.com/docs/workflows`
- Troubleshooting: `https://xcodebuildmcp.com/docs/troubleshooting`
- Privacy: `https://xcodebuildmcp.com/docs/privacy`
- Skills: `https://xcodebuildmcp.com/docs/skills`
- Local skill when installed: `xcodebuildmcp-cli`

## Live Documentation Gate

Before installation, setup, client configuration, CLI commands, tool names, privacy settings, skills, or screenshot/test proof, refresh the official docs above and the local CLI help when available. Do not treat this reference, the local `xcodebuildmcp-cli` skill, old transcripts, or project memory as version authority.

Record in `PRODUCTION_READINESS.md` or `SCREENSHOTS.md`:
- docs checked date
- docs URLs used
- official docs version/tag when shown
- installed version or install route: Homebrew, npm/npx, or existing binary
- `xcodebuildmcp --help`, `xcodebuildmcp tools`, or MCP tool-list snapshot
- Xcode version, macOS version, simulator/device runtime, project/workspace, scheme, and configuration
- command or tool-name differences between live docs, CLI help, MCP tools, and local skills

When docs, CLI help, and MCP tool names disagree:
- official docs plus the installed CLI help decide CLI syntax
- exposed MCP tool schemas decide MCP tool-call names
- local skill examples are only orientation
- record the chosen command/tool route and mismatch in proof docs

If current official docs or CLI help cannot be reached, mark setup as `blocked: docs refresh needed` or `provisional: docs unavailable`. Do not use memory-only command names for launch proof.

## When To Use

Use XcodeBuildMCP after the founder confirms the fallback when:
- MobAI is intended but not available in the runtime
- the task is Apple-platform only
- the app needs simulator build/run/test proof
- UI automation, accessibility tree snapshots, screenshots, videos, or logs are needed
- LLDB/debugging or crash/log triage is needed
- the repo needs deterministic Xcode project discovery and session defaults

Do not silently switch from MobAI to XcodeBuildMCP. Use `paid-tool-routing.md` first.

For Android:
- use MobAI if available and approved
- otherwise use Android emulator/ADB/UIAutomator/Appium-style project tooling if the repo already uses it
- mark Android device proof blocked if no equivalent exists

## Setup Flow

Refresh the Live Documentation Gate first. Preferred install options below are examples from current docs, not permanent requirements:

```bash
brew tap getsentry/xcodebuildmcp
brew install xcodebuildmcp
```

or:

```bash
npm install -g xcodebuildmcp@latest
xcodebuildmcp --help
```

Verify the environment using the current docs:

```bash
npx --package xcodebuildmcp@latest xcodebuildmcp-doctor
```

or:

```bash
xcodebuildmcp-doctor
```

Run setup in the project root:

```bash
xcodebuildmcp setup
```

The setup wizard creates or updates `.xcodebuildmcp/config.yaml` with enabled workflows, project/workspace path, scheme, configuration, simulator defaults, and debug options. Commit this config only when it contains repo-safe defaults and no secrets.

Record whether setup used Homebrew, npm/npx, an existing binary, or an MCP client-managed `npx` command. If `xcodebuildmcp upgrade` or another update route is needed, use the current official docs before running it.

## MCP Client Routing

When MCP tools are exposed, prefer the tools over raw shell.

Important sequence:
1. Call `session_show_defaults` before the first XcodeBuildMCP build, run, or test in a session.
2. If project/workspace, scheme, and simulator defaults are set, call `build_run_sim` or the relevant one-shot tool directly.
3. Use discovery tools only when defaults are missing or wrong.
4. Do not manually boot/open Simulator as a prerequisite for `build_run_sim`; the tool handles it where needed.
5. Enable only required workflows to control tool-list context: simulator by default, then device, debugging, ui-automation, swift-package, macos, coverage, or xcode-ide when needed.

Current client snippets include:
- Claude Code: `claude mcp add XcodeBuildMCP -- npx -y xcodebuildmcp@latest mcp`
- Codex CLI: `codex mcp add XcodeBuildMCP -- npx -y xcodebuildmcp@latest mcp`
- Codex config: `[mcp_servers.XcodeBuildMCP]` with `command = "npx"` and `args = ["-y", "xcodebuildmcp@latest", "mcp"]`

If Codex or Xcode agent tools time out, current docs recommend raising `tool_timeout_sec`.

## CLI Routing

Use the CLI when MCP tools are not exposed or when scripting/CI is simpler. Load the local `xcodebuildmcp-cli` skill when available, but let live docs and local `--help` override stale examples.

Discovery:

```bash
xcodebuildmcp --help
xcodebuildmcp tools
xcodebuildmcp simulator --help
xcodebuildmcp ui-automation --help
```

Common commands:

```bash
xcodebuildmcp setup
xcodebuildmcp simulator build --scheme MyApp --project-path ./MyApp.xcodeproj --simulator-name "iPhone 17 Pro"
xcodebuildmcp simulator build-and-run --scheme MyApp --project-path ./MyApp.xcodeproj
xcodebuildmcp simulator test --scheme MyApp --project-path ./MyApp.xcodeproj --simulator-name "iPhone 17 Pro"
xcodebuildmcp simulator record-video --simulator-id <UDID> --output-path ./session.mp4
xcodebuildmcp ui-automation snapshot-ui --simulator-id <UDID>
xcodebuildmcp ui-automation screenshot --simulator-id <UDID> --return-format path
```

Use `--json` for complex arguments and `--output jsonl` for long-running operations that should stream machine-readable progress.

If the CLI shows commands such as `simulator build-and-run` while an MCP tool or local skill uses names such as `build_run_sim`, do not mix the forms. Use CLI names only in shell commands and MCP tool names only in MCP calls.

## Testing And Screenshot Workflow

For production-readiness proof:
1. Run doctor and setup if the environment is new.
2. Confirm session defaults or CLI config.
3. Build and run the app on the target simulator/device.
4. Run unit and UI tests where available.
5. Use UI automation snapshots before gestures.
6. Capture screenshots/video only after the target state is reached.
7. Pair device proof with backend/provider proof: database, RevenueCat, Stripe, PostHog, Resend, Sentry, or store-console evidence when in scope.
8. Record command/tool output paths, simulator/device, OS, scheme, build config, account fixture, and result in `PRODUCTION_READINESS.md` and `SCREENSHOTS.md`.

For App Store screenshot work:
- use real app UI from XcodeBuildMCP captures when MobAI is not approved/available
- compose final screenshots through `DESIGN.md` tokens and screenshot HTML
- keep raw captures separate from final upload assets
- map each final image to Apple display wells and Google device classes

## Privacy And Telemetry

Current XcodeBuildMCP docs state that it uses Sentry for internal runtime error telemetry only. They state that project build/test failures, tool inputs/outputs, environment variables, source code, build artifacts, certificates, and provisioning profiles are not sent.

Opt out when the launch/privacy posture requires it:

```bash
export XCODEBUILDMCP_SENTRY_DISABLED=true
```

or add:

```yaml
sentryDisabled: true
```

to `.xcodebuildmcp/config.yaml`.

Record the telemetry decision in `TOOL_DECISIONS.md` or `PRODUCTION_READINESS.md`.

## Troubleshooting

Current docs recommend:
- run `xcodebuildmcp-doctor` or the MCP `doctor` tool
- confirm Xcode and Command Line Tools are installed
- verify required workflows in `.xcodebuildmcp/config.yaml`
- check simulator/device availability and permissions
- enable workflows such as `["simulator", "device", "debugging", "ui-automation"]` when tools are missing
- use a `zsh -lc` wrapper and known `PATH` for Xcode/Codex agent environments that cannot find `npx`
- open Xcode and configure signing when device builds fail with signing errors
- restart stale simulators or the XcodeBuildMCP daemon when stateful tools get stuck

Do not flatten these into "Xcode is broken". Record the exact doctor finding and next action.

## Evidence Requirements

`PRODUCTION_READINESS.md` should include:
- XcodeBuildMCP version or install route
- docs refreshed date, official docs URLs, and docs version/tag when shown
- CLI/help or `xcodebuildmcp tools` snapshot used to choose commands
- any local skill/docs mismatch and the selected command/tool route
- doctor status or blocker
- MCP or CLI route
- enabled workflows
- project/workspace, scheme, simulator/device, OS, configuration
- command/tool names and outcomes
- logs, screenshots, videos, UI snapshots, and test result paths
- backend/provider proof paired to app actions
- Apple signing proof when distribution is in scope: Team ID, `DEVELOPMENT_TEAM`, bundle ID/App ID, app record, signing style, local signing identity class, provisioning strategy, archive/export/upload/TestFlight status, and any `APPLE_SIGNING.md` blocker
- telemetry decision
- remaining blocked flows

`SCREENSHOTS.md` should include:
- raw capture path
- final composition path
- device/display well
- headline/copy overlay and App Icon/App Preview route when store creative is in scope
- locale, theme, fixture, screen path
- upload readiness

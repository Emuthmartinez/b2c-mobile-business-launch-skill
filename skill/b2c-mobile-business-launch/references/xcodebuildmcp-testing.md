# Native iOS Proof: Codex Desktop, XcodeBuildMCP, SnapshotPreviews, And serve-sim

Use this when iOS, iPadOS, macOS, tvOS, watchOS, or visionOS build/test/run/UI automation is needed, when Codex Desktop exposes native Apple tooling, or when CLI users need open-source simulator and preview proof routes.

XcodeBuildMCP and Codex Desktop native iOS tooling are not full MobAI replacements. They are excellent for Apple simulator/device workflows, Xcode builds, tests, screenshots, UI automation, logs, debugging, and video capture. SnapshotPreviews adds preview-to-PNG/JSON coverage from XCTest. serve-sim exposes a booted simulator through a local browser stream/control surface. None of these cover Android device automation, and none of them replace App Store signing/distribution proof.

For Apple distribution, TestFlight, physical-device signing, archives, exports, or uploads, load `apple-signing-release.md` too. XcodeBuildMCP simulator proof does not by itself prove App Store signing readiness.

## Contents

- Current Sources To Refresh
- Live Documentation Gate
- When To Use
- Codex Desktop Native iOS Route
- Setup Flow
- MCP Client Routing
- CLI Routing
- SnapshotPreviews CLI Proof
- serve-sim CLI Proof
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
- SnapshotPreviews: `https://github.com/getsentry/SnapshotPreviews`
- serve-sim: `https://github.com/EvanBacon/serve-sim`

## Live Documentation Gate

Before installation, setup, client configuration, CLI commands, tool names, privacy settings, skills, or screenshot/test proof, refresh the official docs above and the local CLI help when available. Do not treat this reference, the local `xcodebuildmcp-cli` skill, old transcripts, or project memory as version authority.

Record in `PRODUCTION_READINESS.md` or `SCREENSHOTS.md`:
- docs checked date
- docs URLs used
- official docs version/tag when shown
- installed version or install route: Homebrew, npm/npx, or existing binary
- `xcodebuildmcp --help`, `xcodebuildmcp tools`, or MCP tool-list snapshot
- SnapshotPreviews package URL/version/commit when used
- serve-sim package version or `npx serve-sim` resolution when used
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

Use Codex Desktop native iOS tooling when:
- the current runtime is Codex Desktop
- XcodeBuildMCP/native Apple MCP tools are exposed in the active tool list
- the task needs Apple simulator/device build, run, test, screenshot, UI snapshot, log, or debug proof
- a local native iOS/macOS app exists and simulator/device proof is relevant

Do not silently switch from MobAI to XcodeBuildMCP. Use `paid-tool-routing.md` first.

Do not treat SnapshotPreviews or serve-sim as distribution proof. SnapshotPreviews proves deterministic preview rendering and exports; serve-sim proves a booted simulator can be observed/controlled through a browser stream. Production-readiness still needs runtime app flow proof, backend/provider proof, signing proof when distribution is in scope, and founder-only gates.

For Android:
- use MobAI if available and approved
- otherwise use Android emulator/ADB/UIAutomator/Appium-style project tooling if the repo already uses it
- mark Android device proof blocked if no equivalent exists

## Codex Desktop Native iOS Route

When Codex Desktop exposes native Apple/XcodeBuildMCP tools, prefer those tools over shell commands. This is the fastest path for Codex Desktop users because tool schemas define the current command surface and keep simulator/build/log state visible in the agent runtime.

Required sequence:

1. Call `session_show_defaults` before the first build, run, or test.
2. If project/workspace, scheme, and simulator defaults are set, call `build_run_sim`, `test_sim`, screenshot, UI snapshot, or log tools directly.
3. Use discovery tools only when defaults are missing, wrong, or stale.
4. Do not manually boot/open Simulator as a prerequisite for `build_run_sim`; the tool handles that where supported.
5. Record the exposed tool names, project/workspace, scheme, simulator/device, OS/runtime, build configuration, screenshots/log paths, and any fallback in `PRODUCTION_READINESS.md`.

Codex Desktop native iOS proof can satisfy Apple simulator/device implementation proof when paired with the relevant backend/provider proof. It does not replace MobAI for Android coverage, App Store signing readiness, archive/export/upload proof, TestFlight proof, or founder approval gates.

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

## SnapshotPreviews CLI Proof

Use SnapshotPreviews when a SwiftUI/UIKit/AppKit app has Xcode previews and CLI/CI needs deterministic visual proof without writing one-off screenshot tests. SnapshotPreviews is preview coverage: it exercises previews through XCTest, exports PNG and JSON sidecars, and can feed Sentry Snapshots or another visual diffing service. It is not runtime E2E proof and does not prove navigation, network, entitlement, analytics, or provider behavior.

Refreshed source summary:
- Repository URL in docs: `https://github.com/EmergeTools/SnapshotPreviews`; the requested GitHub location is `https://github.com/getsentry/SnapshotPreviews`.
- Link the XCTest target to `SnapshottingTests`.
- Create a test class inheriting from `SnapshotTest` for PNG/JSON snapshot export, or `PreviewLayoutTest` for preview rendering checks without PNGs.
- Set `TEST_RUNNER_SNAPSHOTS_EXPORT_DIR` on `xcodebuild test` to write the images and sidecars to disk.

Example shape, after refreshing the repository README and local Xcode/project details:

```bash
TEST_RUNNER_SNAPSHOTS_EXPORT_DIR="$PWD/snapshot-images" \
xcodebuild test \
  -scheme MyApp \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 15 Pro'
```

Record in `PRODUCTION_READINESS.md`:
- package URL/version/commit
- target and test class: `SnapshotTest` or `PreviewLayoutTest`
- preview module filter, excluded previews, fixtures, and deterministic-data controls
- export directory such as `snapshot-images`
- PNG/JSON output paths and diff/upload result if Sentry Snapshots is used
- limitation: preview-only coverage; does not replace runtime E2E, provider proof, or App Store signing readiness

SnapshotPreviews is especially useful before screenshot composition because it catches broken SwiftUI preview states and can generate reusable UI evidence for component states. It is not a substitute for raw real-app captures for App Store screenshots unless the asset is explicitly a preview/component proof and the limitation is recorded.

## serve-sim CLI Proof

Use serve-sim when CLI users need a booted iOS Simulator visible and controllable through a browser surface, especially for Codex CLI, Claude Code, Cursor, or remote Mac flows where the agent needs a URL instead of a local Simulator window.

Refreshed source summary:
- Run with `npx serve-sim`; the default preview is `http://localhost:3200`.
- Requires macOS with Xcode command line tools (`xcrun simctl`) and Node.js 18+.
- Works with any booted iOS Simulator and does not require app instrumentation.
- Streams simulator framebuffer through MJPEG plus a WebSocket control channel and forwards simulator logs to the browser UI.
- CLI supports gestures, button presses, typing, rotation, CoreAnimation debug flags, memory warnings, and camera injection.

Common commands from the current README:

```bash
npx serve-sim
npx serve-sim "iPhone 16 Pro"
npx serve-sim --detach
npx serve-sim --list
npx serve-sim --kill
npx serve-sim type "Hello, world!"
npx serve-sim button home
```

Record in `PRODUCTION_READINESS.md` or `SCREENSHOTS.md`:
- package/version or `npx serve-sim` resolution
- simulator/device name or UDID and proof it was booted
- preview URL/port such as `http://localhost:3200`
- browser screenshot/video/log capture path
- actions run through `serve-sim gesture`, `serve-sim button`, `serve-sim type`, or camera injection when used
- limitation: browser-visible simulator proof does not replace backend/provider proof, MobAI Android proof, App Store signing, archive/export/upload, or TestFlight proof

If serve-sim is used for app-preview or store screenshot source footage, keep raw simulator captures separate from final composed assets and still run the store screenshot validator. Generated art can support the frame, but real app UI must remain visible and truthful.

## Testing And Screenshot Workflow

For production-readiness proof:
1. Run doctor and setup if the environment is new.
2. Confirm session defaults or CLI config.
3. Build and run the app on the target simulator/device.
4. Run unit and UI tests where available.
5. Use UI automation snapshots before gestures.
6. Capture screenshots/video only after the target state is reached.
7. Use SnapshotPreviews for preview coverage when previews exist, and record that it is preview-only coverage.
8. Use serve-sim when a browser-visible simulator/control surface is useful for CLI agents or remote Mac workflows.
9. Pair device proof with backend/provider proof: database, RevenueCat, Stripe, PostHog, Resend, Sentry, or store-console evidence when in scope.
10. Record command/tool output paths, simulator/device, OS, scheme, build config, account fixture, and result in `PRODUCTION_READINESS.md` and `SCREENSHOTS.md`.

### Test Triage Protocol

When UI tests crash with signal kill, time out, or flake, escalate in order — do not loop the full suite on a crashing run:

1. **Unit tests first**, in isolation (`-only-testing:<Scheme>Tests`). A clean unit run proves logic but NOT paywall entitlement, RevenueCat offering load, or attribution persistence.
2. **Short isolated UI tests second.** Keep each XCUITest interaction under ~20s of wall-clock; longer sequences hit `signal kill` from simulator memory pressure.
3. **Full suite last**, once — only after units + isolated UI pass.
4. **A green suite is not contract proof.** If the suite passes while RevenueCat returns zero packages, the paywall shows "Purchases unavailable", or PostHog person properties lack `self_reported_source`, open a `test-suite-green-contracts-unproven` failure card and require backend/provider proof before any paywall/attribution-ready claim.

**120s MCP tool timeout — manual fallback.** XcodeBuildMCP MCP tools time out at ~120s; post-clean-cache builds exceed it. When `test_sim`/`build_run_sim` times out: `build_sim` (build only) → `install_app_sim` (built `.app`) → `launch_app_sim` → `get_simulator_logs`/`tail_logs`. Record the fallback route in `PRODUCTION_READINESS.md`.

**xcresulttool syntax (Xcode 16 / 26).** `xcresulttool get --path <bundle> --format json` was deprecated in Xcode 16 and needs `--legacy` in Xcode 26. Prefer `xcresulttool get test-results summary --path <bundle.xcresult>`; refresh `xcresulttool --help` before scripting result parsing.

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
- Codex Desktop native iOS route when used: `session_show_defaults`, exposed MCP tool names, project/workspace, scheme, simulator/device, and screenshot/log/test paths
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
- SnapshotPreviews package URL/version/commit, `SnapshotTest` or `PreviewLayoutTest` target, `TEST_RUNNER_SNAPSHOTS_EXPORT_DIR`, exported PNG/JSON paths, and preview-only limitation when used
- serve-sim package/version, booted simulator/device, preview URL/port, gesture/type/button commands, stream/log evidence paths, and limitation when used
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

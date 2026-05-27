# MobAI Toolbelt

Use this before MobAI device automation, screenshots, screen recordings, polished demo videos, app-preview clips, bug reproductions, mobile harness work, or MobAI-adjacent build/test tooling.

MobAI is paid/account-gated for device automation. Load `paid-tool-routing.md` before using free fallbacks or assuming missing runtime access means the founder does not have or want MobAI.

## Contents

- Live Sources To Refresh
- Toolbelt Catalog
- Recorder Skills
- Mobile Recorder Workflow
- Desktop Recorder Workflow
- Launch Outputs
- Evidence Requirements

## Live Sources To Refresh

Refresh current sources before install, setup, command syntax, recording workflow, or tool routing:
- MobAI website: `https://mobai.run/`
- MobAI GitHub org: `https://github.com/MobAI-App`
- MobAI org repos API: `https://api.github.com/orgs/MobAI-App/repos?per_page=100&type=public&sort=updated`
- Mobile recorder skill: `https://github.com/MobAI-App/mobile-recorder-skill`
- Desktop recorder skill: `https://github.com/MobAI-App/desktop-recorder-skill`
- MobAI MCP: `https://github.com/MobAI-App/mobai-mcp`
- Mobile harness: `https://github.com/MobAI-App/mobile-harness`
- iOS builder: `https://github.com/MobAI-App/ios-builder`

When a recorder skill is needed, read the repo `README.md`, `install.md`, and installable `SKILL.md` from the current default branch. Do not rely on copied command names from this reference when the upstream skill changed.

Record in `TOOL_DECISIONS.md`, `SCREENSHOTS.md`, `FASTLANE_OPS.md`, `PRODUCTION_READINESS.md`, or `DEMO_VIDEO.md`:
- docs/repos checked date
- repo URLs and commit or default-branch date
- selected MobAI tool or skill
- install path and runtime: Claude, Codex, Cursor, local skill folder, or one-off repo use
- device/app/window target
- paid access/fallback decision
- proof artifacts and limitations

## Toolbelt Catalog

Refresh the MobAI org before relying on this list. As of the May 2026 public GitHub snapshot, relevant MobAI-App repos include:

| Repo | Use In This Launch Skill |
| --- | --- |
| `mobile-recorder-skill` | Polished, reproducible iOS/Android app demo videos from MobAI capture plus Node/ffmpeg editing. |
| `desktop-recorder-skill` | Polished macOS/web app screencasts with deterministic replay, click ripples, cursor sprite, captions, zoom, speed, and export. |
| `mobai-mcp` | MobAI MCP server/device-control layer for mobile screenshots, UI trees, taps, swipes, typing, and recording support. |
| `mobile-harness` | App-specific mobile harness/API layer when a mobile app lacks a clean external API for repeated workflows. |
| `ios-builder` | Build/debug iOS apps from non-macOS hosts through GitHub Actions workflows when relevant. |
| `simtime` | Control the wall-clock time seen by iOS Simulator apps for time-sensitive tests and demos. |
| `iosbox` | Experimental iOS build-in-Docker path; use only after current docs review and clear fit. |
| `mobai-marketplace` | Marketplace/catalog routing for MobAI skills and integrations. |
| `homebrew-tap` | Homebrew distribution for MobAI tools such as desktop recorder dependencies. |
| `aibridge`, `aibridge-extension`, `context-box` | Context/desktop bridge helpers; use only when current repo docs show they fit the requested workflow. |
| `chatgpt-auth-kit`, `chatgpt-auth-kit-rn`, `chatgpt-auth-kit-flutter` | ChatGPT subscription auth kits for iOS, React Native, and Flutter apps; route through product/security review before use. |

## Recorder Skills

Use recorder skills when the user asks for:
- App Store/Google Play app-preview clips
- launch or landing-page demo videos
- Fastlane/social media inputs
- investor/customer walkthroughs
- bug reproduction videos
- internal onboarding/training clips

Mobile recorder skill promise:
- turn an app flow into a polished demo video from one prompt
- capture native iOS/Android pixels through MobAI
- add tap ripples, moving finger overlay, phone bezel, background, zoom, variable speed, trimming, captions, and upload-ready exports
- save a reproducible `.mob` choreography script so the demo can be re-rendered

Desktop recorder skill promise:
- macOS/web flow recording through `deskagent`
- explore -> screenplay -> dry-run -> record -> edit -> export
- add click ripples, cursor sprite, captions, zoom, variable speed, and upload-ready exports

Do not use recorder skills as a replacement for E2E testing. They are proof and marketing artifacts; still verify backend/provider state separately.

## Mobile Recorder Workflow

Use `mobile-recorder-skill` for iOS or Android app demos. Current upstream guidance enforces:

```text
explore -> script -> dry-run -> record -> edit/export
```

Default launch prompt shape:

```text
Record a 30s vertical demo of the onboarding flow on iPhone 16 Pro.
Use the app's DESIGN.md for background, captions, bezel treatment, and export copy.
Save the .mob choreography, raw recording, final mp4, captions, and upload copy.
```

Required behavior:
- read MobAI device automation and testing references before device interaction
- explore the target flow with UI tree, screenshots, OCR, and manual reasoning
- write deterministic `.mob` choreography with `record_start` and `record_stop`
- keep final recording actions pre-decided and timed; never observe/think/tap during final recording
- dry-run until clean before starting native recording
- record native device/simulator pixels
- export vertical 9:16 by default for mobile launch/social usage
- save `.mob`, `editor.json` or timeline metadata, raw video, final video, captions, and upload copy

Common final artifacts:
- `demo.mob`
- `editor.json`
- `demo.raw.mp4`
- `demo.vertical.mp4` or named final export
- `*.captions.json`
- `copy.md`

## Desktop Recorder Workflow

Use `desktop-recorder-skill` for macOS or web demos. Current upstream guidance enforces:

```text
explore -> screenplay -> dry-run -> record -> edit -> export
```

Default launch prompt shape:

```text
Record a polished 30s product demo of the web onboarding flow.
Use the app's DESIGN.md for background, captions, cursor/ripple styling, and export copy.
Save screenplay.json, raw recording, final mp4, captions, and upload copy.
```

Required behavior:
- macOS only
- ask before choosing background/layout/export decisions when the user did not specify them
- explore target windows/web app first
- write deterministic `screenplay.json`
- dry-run and verify state before final take
- record native pixels and deterministic input replay
- export with click ripples, cursor sprite, captions, zoom, speedups, trim, and copy

Common final artifacts:
- `screenplay.json`
- `timeline.json`
- `demo.raw.mp4`
- `demo.final.mp4`
- `*.captions.json`
- `copy.md`

## Launch Outputs

Create `DEMO_VIDEO.md` when demo videos are part of the launch package.

`DEMO_VIDEO.md` should include:
- selected recorder skill and repo commit/date checked
- app flow, target platform/device/window, fixture account, locale/theme, and build
- design-system source: `DESIGN.md`, `design.html`, or screenshot frame spec
- choreography path: `.mob` or `screenplay.json`
- dry-run outcome
- raw recording path
- edit pipeline summary: ripples, finger/cursor overlay, bezel/background, zoom, speed, trim, captions
- final exports with dimensions/duration
- upload copy path
- privacy/sensitive-screen review
- limitations and rerender command

Use the project design system for:
- background or stage treatment
- phone bezel/frame style
- tap ripple/finger or cursor/click styling where configurable
- caption tone, placement, and color
- thumbnail/screenshot frame
- upload copy voice

## Evidence Requirements

Before calling a demo video launch-ready:
- raw capture comes from the real app or approved target fixture
- choreography file is committed or stored in the handoff bundle
- dry-run passed before final recording
- final recording has no private data, secrets, accidental notifications, or unapproved screens
- output dimensions and duration match target channel: store preview, website, social, support bug repro, or internal walkthrough
- backend/provider proof exists separately when the demo shows a state-changing flow
- `TOOL_DECISIONS.md` records MobAI access or fallback route
- `DEMO_VIDEO.md`, `SCREENSHOTS.md`, `FASTLANE_OPS.md`, or `PRODUCTION_READINESS.md` links final artifacts

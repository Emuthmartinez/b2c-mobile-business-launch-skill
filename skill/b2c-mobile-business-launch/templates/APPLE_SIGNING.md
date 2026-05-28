# {{APP_NAME}} Apple Signing Packet

Status: scaffold

This packet records distribution readiness for iOS. Keep it aligned with the Xcode project, App Store Connect app record, CI signing setup, `APPLE_APP_STORE_REQUIREMENTS.md`, and founder approval before TestFlight or App Store submission.

## Account And Identifiers

| Gate | Value | Proof |
| --- | --- | --- |
| Apple Developer account | {{APPLE_DEVELOPER_ACCOUNT}} | membership screenshot or account note kept outside git |
| Team ID | {{APPLE_TEAM_ID}} | Apple Developer Membership page |
| DEVELOPMENT_TEAM | {{DEVELOPMENT_TEAM}} | Xcode build setting or CI variable name |
| Bundle ID | {{IOS_BUNDLE_ID}} | Xcode target and Apple Developer identifier |
| App ID | {{APPLE_APP_ID}} | Apple Developer identifier record |
| App Store Connect app record | {{ASC_APP_RECORD_URL}} | App Information URL |
| ASC CLI auth status | Pending | `asc auth status --validate` or blocked reason without secrets |

## App Record Creation Preflight

- Confirm name, SKU, primary locale, bundle ID, category, privacy URL, support URL, and ownership before creating or editing the App Store Connect app record.
- Record the ASC CLI or skill-pack app creation route (`asc-app-create-ui` when browser automation is required) before falling back to manual-only instructions.
- Stop for founder approval before any App Store Connect mutation, app record creation, SKU change, bundle ID change, capability change, or signing account change.

## Signing Assets

| Asset | Source | Proof |
| --- | --- | --- |
| Distribution certificate | Apple Developer Certificates | certificate common name and expiry recorded here |
| Provisioning profile | Apple Developer Profiles or Xcode managed signing | profile name, bundle ID, Team ID, and expiry recorded here |
| Capabilities and entitlements | Xcode target and Apple Developer App ID | entitlement diff recorded here |
| CI export method | ExportOptions.plist or CI workflow | archive, export, upload, and TestFlight command proof recorded here |

## Apple App Store Requirements Gate

`APPLE_APP_STORE_REQUIREMENTS.md` must be ready before a build is pushed into App Store Connect. Record:

- bundled `PrivacyInfo.xcprivacy` path and target-resource proof
- required reason API categories/reasons and `NSPrivacyAccessedAPITypeReasons`
- third-party SDK privacy manifest/signature status
- Xcode privacy report status and App Privacy label reconciliation
- `Info.plist` purpose strings, `NSUserTrackingUsageDescription`, and ATT route when tracking is in scope
- account deletion, review notes, privacy URLs, archive/upload warnings, and founder approval

## Release Proof

- Archive proof records Xcode version, scheme, configuration, archive path, and signing identity.
- Export proof records export method, provisioning profile mapping, and output IPA path.
- Upload proof records Transporter, Xcode organizer, Fastlane, or App Store Connect API command output.
- TestFlight proof records build number, processing status, tester group route, and review notes route.
- A simulator build alone is not distribution readiness.

## Founder Approval

Founder approval is required before paid account changes, certificate replacement, provisioning profile replacement, App Store Connect app record mutation, TestFlight external testing, App Store submission, phased release, or manual release.

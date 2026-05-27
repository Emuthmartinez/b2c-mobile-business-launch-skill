# App Store Connect CLI Routing

Use this before automating App Store Connect work with the Rork `asc` CLI or the Rork App Store Connect CLI skills.

The goal is to reduce App Store Connect clicking while preserving founder control over credentials, pricing, products, privacy answers, screenshots, and final submission.

## Contents

- Current Sources To Refresh
- When To Use
- Skill Pack Routing
- CLI Routing
- Safe Automation Boundaries
- Store Packet Integration
- Evidence Requirements
- Common Failure Modes

## Current Sources To Refresh

Refresh these before running or writing commands:
- App Store Connect CLI skills: `https://github.com/rorkai/app-store-connect-cli-skills`
- App Store Connect CLI: `https://github.com/rorkai/App-Store-Connect-CLI`
- Official Apple App Store Connect docs referenced in `store-console-workflow.md`

As of the May 2026 GitHub README, the CLI is a scriptable, JSON-first App Store Connect API tool for TestFlight, builds, submissions, signing, analytics, screenshots, subscriptions, and related workflows. The skills repo is a community-maintained, unofficial agent-skill pack and is not affiliated with Apple.

## When To Use

Use the CLI route when:
- the user wants App Store Connect work reduced to commands instead of clicks
- app IDs, build IDs, version IDs, localizations, TestFlight groups, or screenshot localization IDs need deterministic resolution
- metadata, localizations, keywords, screenshots, or review status need repeatable audit/apply flows
- TestFlight distribution, build upload, or release readiness must be preflighted
- RevenueCat catalog/subscription mapping needs reconciliation against ASC products

Still create `STORE_CONSOLE.md` and `store-console.html`. The CLI can automate or verify pieces, but the founder-facing copy-paste packet remains the durable handoff.

## Skill Pack Routing

When installed, route to these skill areas:
- `asc-cli-usage`: canonical commands, flags, output, pagination, auth
- `asc-workflow`: repo-local `.asc/workflow.json`, dry-run, validation, hooks, conditionals
- `asc-app-create-ui`: app record creation by browser automation when API coverage is missing
- `asc-xcode-build`: archive/export/build-number workflows
- `asc-shots-pipeline`: simulator screenshot capture, framing, staged upload
- `asc-release-flow`: readiness, staging, validation, submission blockers
- `asc-signing-setup`: bundle IDs, capabilities, certificates, profiles
- `asc-id-resolver`: app/build/version/group/tester ID resolution
- `asc-metadata-sync`: metadata/localization pull, validate, dry-run, apply
- `asc-localize-metadata`: locale-aware metadata translation and review-before-upload
- `asc-aso-audit`: offline ASO audit against canonical metadata
- `asc-whats-new-writer`: release notes and localization
- `asc-submission-health`: preflight, digital-goods readiness, review monitoring
- `asc-testflight-orchestration`: groups, testers, beta distribution
- `asc-build-lifecycle`: build processing and retention
- `asc-ppp-pricing`: purchasing-power-pricing workflows
- `asc-subscription-localization`: IAP/subscription display-name localization
- `asc-revenuecat-catalog-sync`: reconcile ASC products with RevenueCat
- `asc-crash-triage`: TestFlight crashes and beta feedback

Install only with founder approval if it is not already available:

```bash
npx skills add rorkai/app-store-connect-cli-skills
```

## CLI Routing

Use JSON output for agent automation:

```bash
asc auth status --validate
asc auth doctor
asc apps list --output json --pretty
asc apps info view --app "123456789" --output json --pretty
asc versions list --app "123456789" --output json
asc localizations list --app "123456789" --type app-info --output json
```

Common workflows from the current README:

```bash
asc validate --app "123456789" --version "1.2.3"
asc review status --app "123456789"
asc review doctor --app "123456789"
asc metadata init --dir "./metadata" --version "1.2.3" --locale "en-US"
asc metadata apply --app "123456789" --version "1.2.3" --dir "./metadata" --dry-run
asc metadata keywords audit --app "123456789" --version "1.2.3"
asc screenshots plan --app "123456789" --version "1.2.3" --review-output-dir "./screenshots/review"
asc screenshots apply --app "123456789" --version "1.2.3" --review-output-dir "./screenshots/review" --confirm
asc testflight feedback list --app "123456789" --paginate
asc testflight crashes list --app "123456789" --sort -createdDate --limit 10
asc workflow validate
asc workflow run --dry-run testflight_beta VERSION:1.2.3
```

Use `--dry-run` and read commands first. Do not use `--confirm`, `--submit`, pricing changes, screenshot replacement, metadata apply, TestFlight external distribution, or release actions without explicit founder approval.

## Safe Automation Boundaries

Safe without new approval when credentials are already configured and the user asked for ASC work:
- read app/build/version/review status
- resolve IDs
- run validators and doctors
- export metadata or screenshots for review
- run dry-runs
- produce diffs and plans

Founder approval required:
- authentication or credential creation
- keychain bypass or repo-local credential storage
- app creation
- bundle ID/capability/certificate/profile creation or rotation
- metadata apply/push
- screenshot upload/replace
- IAP/subscription creation, pricing, localization, or attachment
- TestFlight external distribution
- final submit, cancel, release, phased release, or managed publishing changes
- Wall of Apps submission or any public PR/post

If ASC CLI is missing, use `paid-tool-routing.md` before falling back to manual App Store Connect instructions. The user may want to install or use the CLI rather than receive a manual-only packet.

## Store Packet Integration

`STORE_CONSOLE.md` should show both routes when ASC CLI is in scope:
- CLI route: command, dry-run/apply status, JSON artifact path, blocker
- Console route: click path, field, paste value, source, founder gate

`store-console.html` should still show the founder where values live in App Store Connect. When a CLI command can update a value, show a "CLI available" note and the exact dry-run/apply distinction.

For screenshot upload:
- plan screenshots with `SCREENSHOTS.md`
- use real app captures from MobAI or confirmed XcodeBuildMCP fallback
- use design-system frames for final compositions
- use ASC CLI screenshot planning/upload only after the screenshot matrix is approved

For RevenueCat:
- use `asc-revenuecat-catalog-sync` or equivalent audit before creating products or mappings
- do not create products, change prices, or map entitlements without founder approval and `REVENUE_OPS.md`

## Evidence Requirements

Record in `STORE_CONSOLE.md`:
- CLI version/source checked
- auth status without secrets
- app ID, version ID, localization IDs, build IDs, and TestFlight group IDs resolved
- commands run
- output paths
- dry-run vs applied status
- founder approvals
- remaining manual console steps
- official Apple doc refresh date

Record in `PRODUCTION_READINESS.md` when release work is in scope:
- build upload or processing status
- validation/review doctor result
- TestFlight status
- screenshot upload status
- metadata apply status
- final submission blocker list

## Common Failure Modes

- Using `asc` to mutate metadata or screenshots without a dry-run and founder approval.
- Treating a CLI success response as proof the App Store product page is ready without checking privacy, age rating, IAP, accessibility, review notes, screenshots, and build attachment.
- Losing track of localization IDs and uploading screenshots to the wrong locale.
- Storing App Store Connect credentials in committed files.
- Using unofficial skill-pack guidance without refreshing official Apple docs for the current required fields.
- Skipping `store-console.html` because CLI automation exists.

# Store Console Workflow And User Handoff

Use this before App Store Connect or Google Play Console setup, store submission, privacy labels, Data safety, screenshot capture, screenshot upload, app review notes, or founder-facing store-console guidance.

The goal is to produce a console-ready packet that tells the user exactly where to click, what to paste, what still needs their approval, and what was verified.

## Contents

- Current Sources To Refresh
- Required Outputs
- Store Console Packet Shape
- App Store Connect Packet
- App Store Connect CLI Route
- Google Play Packet
- Screenshot And Device Workflow
- HTML Mock Requirements
- Common Failure Modes

## Current Sources To Refresh

Refresh official docs before producing final packets because console fields, screenshot specs, and privacy requirements change:

Apple:
- Add a new app: `https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app/`
- App information fields: `https://developer.apple.com/help/app-store-connect/reference/app-information`
- Platform version information: `https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/`
- Manage app privacy: `https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/`
- App privacy details: `https://developer.apple.com/app-store/app-privacy-details/`
- Screenshot specs: `https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications`
- Upload previews and screenshots: `https://developer.apple.com/help/app-store-connect/manage-app-information/upload-app-previews-and-screenshots/`
- Age rating: `https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating`
- Export compliance: `https://developer.apple.com/help/app-store-connect/manage-app-information/overview-of-export-compliance`
- Privacy manifests and required reason APIs: `https://developer.apple.com/documentation/bundleresources/privacy-manifest-files`, `https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api`
- Accessibility Nutrition Labels overview: `https://developer.apple.com/help/app-store-connect/manage-app-accessibility/overview-of-accessibility-nutrition-labels/`
- Manage Accessibility Nutrition Labels: `https://developer.apple.com/help/app-store-connect/manage-app-accessibility/manage-accessibility-nutrition-labels`
- Submit an app: `https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app`

ASC CLI:
- Rork App Store Connect CLI skills: `https://github.com/rorkai/app-store-connect-cli-skills`
- Rork App Store Connect CLI: `https://github.com/rorkai/App-Store-Connect-CLI`
- Load `app-store-connect-cli.md` before using `asc`, installing CLI skills, syncing metadata, planning/uploading screenshots, TestFlight orchestration, release validation, signing, or RevenueCat catalog sync.

Google Play:
- Create and set up app: `https://support.google.com/googleplay/android-developer/answer/9859152?hl=en`
- Prepare app for review/App content: `https://support.google.com/googleplay/android-developer/answer/9859455?hl=en`
- Data safety form: `https://support.google.com/googleplay/android-developer/answer/10787469?hl=en`
- User Data policy and account deletion: `https://support.google.com/googleplay/android-developer/answer/10144311?hl=en`, `https://support.google.com/googleplay/android-developer/answer/13327111?hl=en`
- Pre-launch reports: `https://support.google.com/googleplay/android-developer/answer/9842757?hl=en`
- Preview assets and screenshot requirements: `https://support.google.com/googleplay/android-developer/answer/9866151?hl=en`
- Metadata policy: `https://support.google.com/googleplay/android-developer/answer/9898842?hl=en`
- Target audience/content: `https://support.google.com/googleplay/android-developer/answer/9867159?hl=en`
- Content ratings: `https://support.google.com/googleplay/android-developer/answer/9898843?hl=en`

## Required Outputs

Create these when a store submission is in scope:

- `STORE_CONSOLE.md`: agent-readable source of truth for App Store Connect and Google Play Console fields, click paths, blockers, and evidence.
- `store-console.html`: founder-facing mock console with copy buttons or clearly copyable fields grouped by exact ASC/Play Console page.
- `SCREENSHOTS.md`: screenshot capture, composition, dimensions, device targets, locale, proof constraints, upload status, and source image paths.
- `screenshots/`: final upload assets plus raw MobAI/device captures and intermediate compositions.
- `TOOL_DECISIONS.md` or an embedded tool-decision section when ASC CLI, paid ASO tools, MobAI, XcodeBuildMCP fallback, Higgsfield, or paid screenshot/creator tooling affects the packet.

Small launches can merge `SCREENSHOTS.md` into `STORE_CONSOLE.md`, but keep `store-console.html` as the human-facing copy-paste surface.

Each output must state the documentation refresh date. If current docs cannot be reached, mark the packet `blocked: docs refresh needed` instead of relying on old console memory.

## Store Console Packet Shape

Each console field should use this format:

```text
Platform: App Store Connect
Click path: Apps > <App Name> > App Store > iOS App <Version> > App Information
Field: Subtitle
Limit: 30 characters
Paste value: <exact value>
Source: LAUNCH.md#app-store-fields
Evidence: keyword research, competitor review, or founder approval
Status: ready | blocked | founder approval needed | verified in console
Notes: any policy/risk caveat
```

For `store-console.html`, group fields by console page and make the user path visually obvious:
- page title matching the console page
- click path breadcrumb
- field label
- character count
- paste-ready value
- blocker/approval badge
- source doc path
- "last verified against official docs" date

Do not require the founder to infer where a field belongs from a long Markdown list.

When ASC CLI is in scope, include the CLI route beside the manual route:

```text
CLI route: asc metadata apply --app <id> --version <version> --dir ./metadata --dry-run
CLI status: dry-run ready | applied | blocked | founder approval needed
Console route: Apps > <App Name> > App Store > iOS App <Version> > ...
Founder gate: apply metadata / upload screenshots / submit for review
```

## App Store Connect Packet

### App Record

Click path:
- App Store Connect > Apps > plus button > New App

Fields:
- Platforms: iOS, iPadOS, macOS, tvOS, visionOS, or watchOS as applicable.
- Name: app name, 2-30 characters.
- Primary language: default locale.
- Bundle ID: must match the app build.
- SKU: internal immutable ID. Use a stable slug such as `<app-slug>-ios`.
- User Access: Full Access unless a team needs Limited Access.
- Developer Name: organization accounts may set this when adding the first app; individual accounts cannot customize it.

Founder gates:
- developer account access
- final app name
- developer name/trade name
- bundle ID if not already created

### App Information

Click path:
- Apps > <App Name> > App Information

Fields:
- Name
- Subtitle, up to 30 characters
- Privacy Policy URL
- Category and secondary category
- Content Rights
- Age Rating
- License Agreement, Apple standard EULA or custom EULA
- Availability/compliance fields shown for relevant countries, DSA, China mainland, Korea, or regulated categories
- App Store Server Notifications URL when IAP/subscriptions are used

Packet should include:
- recommended answer
- exact value to paste
- whether value is editable after submission or version-gated
- source evidence or policy source

### App Privacy

Click path:
- Apps > <App Name> > App Privacy

Process:
1. Enter Privacy Policy URL and optional Privacy Choices URL.
2. Start or edit app privacy responses.
3. Select every data type collected by the app or third-party partners.
4. For each data type, answer whether it is linked to the user, used for tracking, and the purposes for collection.
5. Compare the final answers against `PRIVACY.md`, `ANALYTICS.md`, `EMAIL_OPS.md`, `REVENUE_OPS.md`, SDK list, backend schema, and vendor docs.
6. Preview the product-page privacy label and record any mismatch before publishing responses.

Packet sections:
- data type table: Apple data type, source, collected yes/no, linked yes/no, tracking yes/no, purposes, notes
- tracking decision: IDFA/ad attribution/retargeting/data broker/third-party ad SDK status
- third-party partner inventory: analytics, crash, auth, payments, email, AI, ads, backend, push, support
- optional disclosure rationale, if a data type is intentionally omitted
- privacy manifest/required reason API status from the built app

Never answer App Privacy from generic policy text alone. Use the real data inventory and SDK/vendor behavior.

### Version Page

Click path:
- Apps > <App Name> > App Store > iOS App <Version>

Fields:
- version number
- screenshots and app previews by device/localization
- promotional text, up to 170 characters
- description, up to 4000 characters, plain text
- keywords, up to 100 bytes, no competitor names or duplicate app/company terms
- support URL
- marketing URL, optional
- build
- app review information: contact info, demo account, notes, attachments where relevant
- version release option

Packet should show:
- exact paste values
- character/byte counts
- screenshot slots with file paths
- build number and bundle version
- review-note script for the reviewer path

### Pricing, Availability, IAP, And Subscriptions

Click paths vary by app setup. The packet must show:
- app price/free status and territory availability
- subscription group, products, localizations, prices, intro/trial offers, review notes, and family sharing status where applicable
- App Store Server Notification URL, shared secret/API keys where needed by RevenueCat, and sandbox tester status
- product mapping to `REVENUE_OPS.md` and RevenueCat offering/package IDs

Founder gates:
- price, trial, discount, intro offer, tax/compliance, territory, final submission

### App Accessibility

Click path:
- Apps > <App Name> > App Accessibility

Packet should include:
- whether Accessibility Nutrition Labels are in scope for each supported Apple device type
- common-task matrix: first launch, login, purchase, primary app task, settings, restore purchase, account deletion, and any app-specific critical task
- feature support decision by device: VoiceOver, Voice Control, Larger Text, Dark Interface, Differentiate without Color Alone, Sufficient Contrast, Reduced Motion, Captions, Audio Descriptions, or current App Store Connect feature set
- accessibility URL value when the app has public accessibility notes
- evidence path: `DESIGN.md`, `design.html`, MobAI/manual device test notes, screenshots/video proof, and `PRODUCTION_READINESS.md`
- exact publish status and founder approval

Rules:
- Do not claim support for an accessibility feature unless users can complete all common tasks with that feature on the device being declared.
- If accessibility support differs by iPhone, iPad, Mac, Watch, TV, or Vision target, answer per device.
- Treat accessibility labels as product-page metadata. They must stay accurate as the app changes.

### Submission

Click path:
- Apps > <App Name> > App Store > iOS App <Version> > Add for Review > Draft Submissions > Submit for Review

Before clicking:
- build is selected
- all metadata has no unresolved errors
- screenshots uploaded and visually inspected
- privacy answers match data inventory
- age rating/export compliance answered
- IAP/subscriptions are submitted separately where required
- review notes and demo account work on a clean install
- founder approves final submission

## App Store Connect CLI Route

Use the Rork `asc` CLI to reduce clicking and make App Store Connect state inspectable, but do not let CLI automation replace the founder-facing store packet.

Safe read/dry-run uses:
- auth status and auth doctor
- app, build, version, localization, TestFlight group, screenshot, and review-status reads
- metadata export/init
- keyword audit
- validation and review doctor
- screenshot plan
- workflow validate and dry-run

Founder approval required:
- auth changes or repo-local credential storage
- app creation
- bundle ID, signing, certificate, profile, capability changes
- metadata apply/push
- screenshot upload/replace
- IAP/subscription creation, pricing, localization, or attachment
- TestFlight external distribution
- final submit, release, cancel, phased release, managed publishing, or any public Wall of Apps submission

`STORE_CONSOLE.md` must record:
- CLI version/source checked
- official Apple docs refresh date
- auth status without secrets
- IDs resolved
- dry-run commands and output paths
- mutating commands still waiting on approval
- manual App Store Connect pages still required

Use `paid-tool-routing.md` if the CLI or skill pack is unavailable. The founder may prefer installing or authorizing the CLI over receiving a manual-only packet.

## Google Play Packet

### App Creation

Click path:
- Play Console > Home or All apps > Create app

Fields:
- default language
- app name, 30 characters
- app or game
- free or paid
- contact email
- declarations: Developer Program Policies, US export laws, Play App Signing terms

Founder gates:
- developer account access
- free/paid status, because paid app status has important constraints
- contact email

### Main Store Listing

Click path:
- Grow users > Store presence > Main store listing

Fields:
- app name, 30 characters
- short description, 80 characters
- full description, 4000 characters
- app icon
- feature graphic
- screenshots by device class
- preview video, optional
- phone/tablet/Chromebook/Wear/TV/Auto assets when applicable

Rules:
- avoid all-caps unless brand, emojis/special-character spam, ranking claims, price/promo claims in metadata where prohibited, anonymous testimonials, misleading icons, and irrelevant keyword blocks
- keep listing suitable for general audience even if app content rating is mature
- add alt text where Play Console supports it for graphic assets

### Store Settings

Click path:
- Grow users > Store presence > Store settings

Fields:
- app category and tags
- contact details: email required, website recommended, phone optional
- external marketing checkbox decision

### App Content

Click path:
- Policy > App content

Packet sections:
- privacy policy URL: active, public, non-geofenced, not a PDF
- App access: reviewer instructions, demo account, restricted-feature access
- Ads declaration
- Content rating questionnaire
- Target audience and content
- Data safety form
- Account deletion web URL and in-app deletion path when accounts can be created
- sensitive permissions and APIs declarations
- News, health, financial, government, families, or other special declarations when applicable

### Data Safety

Process:
1. Determine whether the app collects or shares user data.
2. For each data type, answer collection, sharing, purpose, optional/required, processing, encryption, deletion, and user control.
3. Align answers with privacy policy, SDK list, backend schema, analytics, ads, AI, payments, email, crash, and support vendors.
4. Preview the Play Store disclosure before submitting.
5. Use Play Console CSV export/import only when it reduces manual errors, and keep the exported/imported CSV path in `STORE_CONSOLE.md`.

Packet table:
- Google data type
- source/vendor
- collected yes/no
- shared yes/no
- purpose
- optional/required
- encrypted in transit
- deletion/user control
- privacy-policy section
- evidence path

Even apps that collect no user data still need a completed Data safety form and privacy policy.

### Release, Testing, And Production

Click paths:
- Test and release > Testing
- Test and release > Production
- Test and release > App bundle explorer

Packet should include:
- package name
- version code/name
- AAB path
- signing status
- target API status
- internal/closed/open testing state
- pre-launch report status, crawler credentials, deep links, language selection, issue summary, and launch recommendation
- country availability
- managed publishing decision
- release notes
- known review notes and credentials

## Screenshot And Device Workflow

### Source Of Truth

Screenshots should start from real app UI captured locally, then be composed with design-system frames, text overlays, generated characters/backgrounds, or store-specific templates.

Use:
- `DESIGN.md` for visual rules
- `design.html` or screenshot HTML for framed concepts
- MobAI for real app screenshots from simulator/device
- MobAI `mobile-recorder-skill` for polished iOS/Android app-preview or launch demo videos when video assets are in scope
- XcodeBuildMCP for Apple-platform screenshots, videos, logs, and UI automation only after the founder confirms fallback from MobAI
- Higgsfield for supporting visual assets only after the real UI is clear
- `SCREENSHOTS.md` for final slot table
- `DEMO_VIDEO.md` for app-preview/demo-video choreography, raw capture, edited export, captions, and upload copy

### MobAI Capture

Use MobAI when local app testing or screenshot capture is in scope.

Preferred MCP flow when available:
- read the MobAI device automation reference before device interaction
- install or launch the app on the target iOS/Android device
- use observe -> act -> wait stable -> observe
- use `save_screenshot` for full-quality PNGs
- store raw captures under `screenshots/raw/<platform>/<device>/`

MobAI CLI route:
- Check current CLI first: `npm view @mobai-app/cli dist-tags.latest`; prefer `npx @mobai-app/cli@latest` or a verified global install when exact flags matter.
- `mobai devices list`
- set `MOBAI_DEVICE`
- `mobai observe --include ui_tree`
- navigate with stable selectors, preferring accessibility IDs
- `mobai wait --stable --timeout-ms 3000`
- `mobai screenshot --full --path ./screenshots/raw --name <slot-name>`

MobAI recorder route:
- Load `mobai-toolbelt.md` before recording polished demo or app-preview videos.
- Refresh `https://github.com/MobAI-App/mobile-recorder-skill` before install or command syntax.
- Follow upstream flow: explore -> `.mob` choreography -> dry-run -> native record -> edit/export.
- Save `.mob`, raw video, final video, captions, upload copy, target device, fixture, duration, dimensions, and rerender instructions.
- Use `DESIGN.md` for phone bezel/background, captions, thumbnail/frame treatment, and upload copy voice.

### XcodeBuildMCP Fallback

MobAI is a paid third-party tool. If MobAI is unavailable, do not silently switch. Load `paid-tool-routing.md`, ask the founder to confirm XcodeBuildMCP as the free/open-source Apple-platform fallback, then load `xcodebuildmcp-testing.md`.

Use XcodeBuildMCP for:
- Apple simulator/device build, run, test, logs, screenshots, UI snapshots, and video
- screenshot-critical iOS/iPadOS flows when Android is not in scope
- production-readiness evidence paired with backend/provider proof

Limitations:
- not an Android automation fallback
- not proof of MobAI-specific device coverage
- physical device workflows still depend on Xcode signing and local hardware

Record in `SCREENSHOTS.md`:
- selected tool: MobAI, XcodeBuildMCP, manual simulator, or blocked
- founder confirmation for fallback
- raw capture path
- device/simulator, OS, locale, theme, fixture, screen path
- final composition and upload well
- coverage limitations

Rules:
- do not use screenshots alone for decisions; observe UI tree first
- add accessibility IDs for important screenshot paths when app code is under control
- use OCR only when UI tree is thin
- end capture scripts with wait-stable and observe
- record device, OS, app build, locale, theme, account state, and data fixture

### Apple Screenshot Packet

Apple accepts one to ten screenshots per device size/localization. If UI is the same across device sizes/localizations, highest resolution screenshots can scale down, but the packet must say whether scaled screenshots are acceptable or whether each well gets explicit assets.

Common iOS targets to check against current Apple specs:
- iPhone 6.9 inch display, including current Pro Max/Plus/Air class sizes
- iPhone 6.5 inch display fallback when 6.9 inch is not provided
- iPad 13 inch display, if iPad is supported
- any watchOS, macOS, tvOS, or visionOS target actually supported

`SCREENSHOTS.md` table:
- platform
- device class
- Apple display well or Play device type
- required/optional
- dimensions
- locale
- slot number
- headline
- raw MobAI capture path
- frame/composition path
- final upload path
- visual proof path
- upload status

### Google Play Screenshot Packet

Google Play requires at least two screenshots across device types to publish a store listing. Current constraints include JPEG or 24-bit PNG with no alpha, minimum dimension 320px, maximum dimension 3840px, and the longest side not more than twice the shortest side.

Packet should cover:
- phone screenshots
- 7 inch tablet and 10 inch tablet screenshots when tablet distribution or quality is relevant
- Chromebook, Wear OS, TV, or Auto screenshots only when supported
- feature graphic and app icon
- preview video if used

## HTML Mock Requirements

`store-console.html` should be a working, local file with:
- tabs or sections for App Store Connect and Google Play
- ASC page cards in click-path order
- Play Console page cards in click-path order
- paste-ready fields with limits and counts
- privacy/Data safety tables
- screenshot matrix with thumbnails or file links
- founder-only gates highlighted
- latest official-doc refresh date and source links

Do not make this a marketing page. It should feel like an operator console: dense, copyable, and clear.

## Common Failure Modes

- Metadata exists in `LAUNCH.md` but no click path tells the founder where to paste it.
- ASC CLI exists but `store-console.html` and manual click paths were skipped.
- A missing ASC CLI/MobAI/paid ASO runtime was treated as permission to use a free fallback without asking.
- Privacy answers are copied from a policy generator instead of data inventory and SDK behavior.
- Google Play Data safety and Apple App Privacy disagree.
- App screenshots use generated art but do not show the real app UI.
- MobAI or XcodeBuildMCP captures are raw but never converted into platform-specific dimensions.
- Store products exist but are not attached to the app version or review/submission state.
- Reviewer credentials are stale or cannot reach the paywalled/restricted flow.
- Apple screenshot wells changed and old dimensions were reused from memory.
- Play Console App content tasks remain incomplete even though listing copy is done.

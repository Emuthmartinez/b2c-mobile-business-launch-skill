#!/usr/bin/env node
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

interface FixtureResult {
  label: string;
  ok: boolean;
  expectedCode: number;
  actualCode: number | null;
  expectedText?: string;
  output: string;
}

type MutableRecord = Record<string, unknown>;

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDir, "..");
const tempRoot = mkdtempSync(path.join(tmpdir(), "b2c-validator-fixtures-"));
const results: FixtureResult[] = [];

function resolveTsxBin(): string {
  const candidates = [
    path.join(skillRoot, "node_modules/.bin/tsx"),
    path.resolve(skillRoot, "../../..", "node_modules/.bin/tsx"),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? "tsx";
}

const tsxBin = resolveTsxBin();

function makeFixture(name: string): string {
  const fixtureRoot = path.join(tempRoot, name);
  cpSync(path.join(skillRoot, "templates"), fixtureRoot, { recursive: true });
  cpSync(path.join(skillRoot, "templates", "secrets", "SECRETS.md"), path.join(fixtureRoot, "SECRETS.md"));
  return fixtureRoot;
}

function makeEmptyFixture(name: string): string {
  const fixtureRoot = path.join(tempRoot, name);
  mkdirSync(fixtureRoot, { recursive: true });
  return fixtureRoot;
}

function expectRecord(value: unknown, label: string): MutableRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
  return value as MutableRecord;
}

function readState(root: string): MutableRecord {
  return expectRecord(parseYaml(readFileSync(path.join(root, "PROJECT_STATE.yaml"), "utf8")), "PROJECT_STATE.yaml");
}

function writeState(root: string, state: MutableRecord): void {
  writeFileSync(path.join(root, "PROJECT_STATE.yaml"), stringifyYaml(state), "utf8");
}

function getLane(state: MutableRecord, name: string): MutableRecord {
  const lanes = expectRecord(state.lanes, "PROJECT_STATE.yaml lanes");
  return expectRecord(lanes[name], `PROJECT_STATE.yaml lanes.${name}`);
}

function getTools(state: MutableRecord): MutableRecord {
  return expectRecord(state.tools, "PROJECT_STATE.yaml tools");
}

function writeCompleteAttribution(root: string): void {
  const state = readState(root);
  const contract = expectRecord(getLane(state, "analytics_attribution").attribution_contract, "attribution_contract");
  contract["screen_early"] = true;
  contract["other_free_text"] = true;
  contract["backend_persistence"] = true;
  contract["anonymous_reconciliation"] = true;
  contract["verified"] = true;
  writeState(root, state);
  writeFileSync(
    path.join(root, "ANALYTICS.md"),
    [
      "# Analytics",
      "Event: attribution_source_selected",
      "PostHog person property: self_reported_source",
      "Backend profile field persists the stable source key.",
    ].join("\n"),
    "utf8",
  );
}

function writeCompleteAppleSigning(root: string): void {
  writeFileSync(
    path.join(root, "APPLE_SIGNING.md"),
    [
      "# Apple Signing",
      "Apple Developer account and Team ID are confirmed.",
      "Xcode DEVELOPMENT_TEAM is set for the Bundle ID and App ID.",
      "App Store Connect app record exists.",
      "App Record Creation Preflight stops for founder approval before mutations.",
      "ASC CLI auth status is validated without secrets, and the app creation route is asc-app-create-ui when browser automation is required.",
      "Distribution certificate and provisioning profile are present.",
      "Archive, export, upload, and TestFlight proof are recorded.",
      "A simulator build alone is not distribution readiness.",
      "Pre-Archive/Export/Upload Preflight sign-off:",
      "SDK key injection into Info.plist verified with plutil -p on the compiled archive: pass.",
      "plutil -lint on PrivacyInfo.xcprivacy: ok.",
      "exportArchive uses -authenticationKeyPath, -authenticationKeyID, and -authenticationKeyIssuerID: ready.",
      "Screenshot dimension floor check (raw capture meets device well minimum, no upscaling): pass.",
    ].join("\n"),
    "utf8",
  );
}

function writeCompleteAppleRequirements(root: string): void {
  mkdirSync(path.join(root, "ios", "App"), { recursive: true });
  writeFileSync(
    path.join(root, "ios", "App", "PrivacyInfo.xcprivacy"),
    [
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
      "<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">",
      "<plist version=\"1.0\">",
      "<dict>",
      "  <key>NSPrivacyCollectedDataTypes</key>",
      "  <array/>",
      "  <key>NSPrivacyAccessedAPITypes</key>",
      "  <array/>",
      "  <key>NSPrivacyTracking</key>",
      "  <false/>",
      "</dict>",
      "</plist>",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    path.join(root, "APPLE_APP_STORE_REQUIREMENTS.md"),
    [
      "# Apple App Store Requirements",
      "Status: ready for founder approval.",
      "Source Basis: Privacy manifest files, Adding a privacy manifest, Describing data use in privacy manifests, Describing use of required reason API, Third-party SDK requirements, App Privacy Details, Protected resources, App Tracking Transparency, Upload builds, and App Review Guidelines were refreshed.",
      "Privacy Manifest: PrivacyInfo.xcprivacy exists at ios/App/PrivacyInfo.xcprivacy and is included in app target resources.",
      "Manifest keys: NSPrivacyCollectedDataTypes is empty for this fixture, NSPrivacyAccessedAPITypes is empty for this fixture, NSPrivacyAccessedAPITypeReasons is not used because no required reason API category is present, NSPrivacyTracking is false, and NSPrivacyTrackingDomains is empty.",
      "Third-party SDK Inventory: third-party SDK entries are checked against Apple's listed SDKs; SDK signatures and bundled manifests are verified or the SDK is excluded from the build.",
      "Xcode privacy report: generated from archive and reconciled with App Privacy, Privacy Nutrition Labels, PRIVACY.md, SECURITY.md, APP_STORE_LISTING.md, STORE_CONSOLE.md, and review notes.",
      "App Privacy: Privacy Policy URL and Privacy Choices URL are verified, account deletion is present, and data collection answers match vendors and app behavior.",
      "Protected resources: Info.plist UsageDescription purpose strings are audited for protected resources. NSUserTrackingUsageDescription and App Tracking Transparency are recorded when tracking or advertising identifiers are in scope.",
      "Archive and upload: APPLE_SIGNING.md records archive, export, upload, App Store Connect delivery warnings, processing status, and founder approval before submission.",
    ].join("\n"),
    "utf8",
  );
}

function writeCompleteStoreConsole(root: string): void {
  writeFileSync(
    path.join(root, "STORE_CONSOLE.md"),
    [
      "# Store Console",
      "App Store Connect click path and ASC CLI routes cover app creation, asc-id-resolver ID resolution, app info, SKU, primary locale, bundle ID, App Privacy, pricing, RevenueCat, asc-revenuecat-catalog-sync, subscription setup, localization, custom product page strategy, In-App Event planning, Higgsfield-backed marketing assets, screenshots, TestFlight, review status, review notes, and account deletion.",
      "App Review Information notes cover purpose and target audience, setup and access instructions, the demo account decision (including an explicit no-login confirmation when there is no account system), the list of test devices and OS versions, and the external services used.",
      "Google Play click path covers package name, Data safety, screenshots, review notes, privacy, and account deletion.",
      "If the app name is already in use, stop for founder approval before using any fallback name.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(root, "store-console.html"), "<!doctype html><html><body>Store console packet</body></html>", "utf8");
  writeFileSync(
    path.join(root, "APP_STORE_LISTING.md"),
    [
      "# App Store Listing",
      "App Privacy answers are derived from data inventory and third-party partners.",
      "Pricing, RevenueCat entitlement mapping, asc-revenuecat-catalog-sync, subscription setup, localization, custom product page strategy, In-App Event planning, App Icon direction, App Preview routing, SCREENSHOTS.md, iPad screenshot wells, copy overlay rules, ParthJadhav/app-store-screenshots, and Higgsfield-backed marketing assets are ready for founder approval.",
      "ASC route proof includes app creation, asc-app-create-ui, asc-id-resolver, asc-metadata-sync, asc-localize-metadata, asc-screenshot-resize, asc-shots-pipeline, asc-ppp-pricing, asc-subscription-localization, asc-testflight-orchestration, asc-submission-health, and asc-release-flow.",
      "Every screenshot row records version localization ID and every pricing row records base territory.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(root, "app-store-listing.html"), "<!doctype html><html><body>App Store listing packet</body></html>", "utf8");
  writeFileSync(path.join(root, "app-privacy-questionnaire.html"), "<!doctype html><html><body>App Privacy questionnaire</body></html>", "utf8");
}

function writeCompleteStoreScreenshots(root: string): void {
  writeFileSync(
    path.join(root, "SCREENSHOTS.md"),
    [
      "# Store Screenshots",
      "Status: partial until founder approval for upload.",
      "Source Ledger: DESIGN.md, design.md, 11_STAR_EXPERIENCE.md, APP_STORE_LISTING.md, CONTENT_ASSETS.md, MobAI raw captures, Higgsfield supporting visuals, Remotion rendered frames, ParthJadhav/app-store-screenshots export board, app-store-screenshots.json state, and asc-screenshot-resize validation.",
      "Narrative: Slot 1 sells the core outcome; slots 2-3 prove the V1 scalable slice; later slots show one benefit per frame.",
      "App Icon: 1024x1024 PNG, no alpha, no rounded corners, tested at App Store search thumbnail size, with Higgsfield route recorded when generated.",
      "App Preview: App Store Preview or Google Play promo video route is recorded, with poster frame, muted captions, real in-app footage, and founder approval before upload.",
      "Composition And Export Route: ParthJadhav/app-store-screenshots writes app-store-screenshots.json and a reusable screenshots/index.html board from real UI, app icon, design tokens, localized copy, and optional Higgsfield support assets.",
      "Raw Capture Matrix",
      "| Slot | Platform | Device | Locale | Source screen | Capture tool | Raw path | Version localization ID | Status |",
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
      "| 1 | iOS | iPhone 6.9 | en-US | onboarding/value | MobAI | screenshots/raw/iphone-slot-1.png | 123 | captured |",
      "| 2 | iOS | iPad 13 | en-US | core feature | MobAI | screenshots/raw/ipad-slot-2.png | 123 | captured |",
      "| 3 | Google Play | phone | en-US | paywall/result | MobAI | screenshots/raw/play-slot-3.png | n/a | captured |",
      "Production Composition Matrix",
      "| Slot | Headline | Copy overlay | Layout | Supporting asset | Route | Final upload path | Dimensions | Alpha/color space | Visual QA |",
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
      "| 1 | See the win fast | yes | framed iPhone app store screenshot | Higgsfield background tied to DESIGN.md | ParthJadhav/app-store-screenshots composition from real UI | screenshots/final/iphone-69-slot-1.png | 1320x2868 | alpha removed, sRGB color space | thumbnail and mobile proof passed |",
      "| 2 | Built for big screens | yes | framed iPad app store screenshot | DESIGN.md gradient panel | ParthJadhav/app-store-screenshots composition from real UI | screenshots/final/ipad-13-slot-2.png | 2064x2752 | alpha removed, sRGB color space | iPad well proof passed |",
      "Device Wells",
      "| Platform | Well | Required/scaled decision | ASC device_type | Screenshot count | Dimensions | Target file | Validation proof | Status |",
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
      "| iOS | iPhone 6.9 | required or scaled | IPHONE_69 | screenshot count: 3 | 1320x2868 | screenshots/final/iphone-69/ | asc-screenshot-resize and asc-shots-pipeline dry-run | blocked |",
      "| iPadOS | iPad 13 | required if iPad supported | IPAD_13 | screenshot count: 2 | 2064x2752 | screenshots/final/ipad-13/ | asc-screenshot-resize and asc-shots-pipeline dry-run | blocked |",
      "Device Wells: iPhone 6.9, iPhone 6.5, iPhone 6.3, iPhone 6.1, iPad 13, iPad 12.9, Google Play phone, tablet, and feature graphic are listed with required, scaled, ready, or blocked status.",
      "Export And Validation: run asc-screenshot-resize for size, alpha, sRGB color space, current device wells, ASC device_type, and screenshot count; record asc-shots-pipeline dry-run before upload.",
      "Visual QA: check thumbnail readability, text fit, safe areas, overlap, color contrast, actual UI truth, pricing/trial consistency, and no unsupported claims.",
      "Founder approval is required before screenshot upload, App Preview upload, CPP/event media submission, paid Higgsfield generation, or replacing Higgsfield with a fallback.",
    ].join("\n"),
    "utf8",
  );
}

function writeCompleteElevenStar(root: string): void {
  const state = readState(root);
  const experienceLane = getLane(state, "experience");
  experienceLane["status"] = "done";
  experienceLane["evidence"] = ["11_STAR_EXPERIENCE.md", "11-star-experience.html"];
  experienceLane["blockers"] = [];
  writeState(root, state);
  writeFileSync(
    path.join(root, "11_STAR_EXPERIENCE.md"),
    [
      "# 11-Star Experience",
      "Experience Thesis: The user moves from anxious uncertainty to a confident next step they want to retell.",
      "Star Ladder",
      "| Stars | Label | User scene | Product behavior implied | Emotional reaction | What we learn |",
      "| --- | --- | --- | --- | --- | --- |",
      "| 1 | Refund me | The app gives generic advice and breaks trust. | Block unsupported claims and bad recovery. | Regret. | Never ship this. |",
      "| 2 | It technically works | The result appears after friction and confusion. | Reduce wait, explain state, add recovery. | Tolerance. | Baseline usability. |",
      "| 5 | Expected experience | The core loop works. | Deliver the promised task reliably. | Neutral. | Category floor. |",
      "| 6 | Better than expected | The app reflects the user's input in a useful summary. | Personalize the output and next step. | Relief. | First feasible delight. |",
      "| 7 | Way beyond | The app prepares the next best action from the user's context. | Connect state, copy, and timing. | Made for me. | V1 magic candidate. |",
      "| 10 | Impossible concierge | A human expert manually creates the perfect outcome. | Identify the unscalable service blueprint. | Amazement. | What to productize. |",
      "| 11 | Absurd extreme | The user's problem disappears like a movie scene. | Reveal the true ambition. | Evangelism. | What users would tell everyone about. |",
      "Line Of Feasibility: V1 lives between 6 and 7 stars; 10 and 11 stay deferred inspiration.",
      "V1 Scalable Slice: produce the first context-aware result, explain why it matters, and route the next step.",
      "Surface Matrix",
      "| Surface | 11-star question | Product-specific answer | Artifact owner | Proof |",
      "| --- | --- | --- | --- | --- |",
      "| Product | What result would the user retell? | Context-aware next step. | SPEC.md, LAUNCH_TRACE.md | EXP-001 |",
      "| Onboarding | What makes the user feel understood early? | Reflect answers before paywall. | ONBOARDING.md | EXP-001 |",
      "| Paywall | What unlocks momentum? | Show the next unlocked action. | REVENUE_OPS.md | EXP-001 |",
      "| Ad | What tiny experience can the ad deliver? | Show the before/after moment. | CONTENT_ASSETS.md | EXP-001 |",
      "| App Store | What three frames prove the magic? | Problem, personalized result, next step. | APP_STORE_LISTING.md | EXP-001 |",
      "| Engineering | What must be real? | State, API, analytics, and fixture proof. | TECH_SPEC.md | EXP-001 |",
      "Visual Storyboard: 11-star-experience.html renders the ladder.",
      "Traceability",
      "| Trace ID | Experience decision | Source evidence | Product impact | Design impact | Build contract | Verification |",
      "| --- | --- | --- | --- | --- | --- | --- |",
      "| EXP-001 | Context-aware result is the magical moment. | RESEARCH.md | SPEC.md | DESIGN.md | TECH_SPEC.md | PRODUCTION_READINESS.md |",
      "Engineering Contract: TECH_SPEC.md owns the state machine, data model, API/RPC/webhook contracts, permissions, offline/error states, analytics events, test fixture, and E2E proof path.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    path.join(root, "11-star-experience.html"),
    "<!doctype html><html><body><h1>11-Star Experience Board</h1><p>Line Of Feasibility</p><p>V1 Scalable Slice</p><p>Surface Translation</p></body></html>",
    "utf8",
  );
  for (const [file, text] of [
    ["SPEC.md", "# Spec\n\n## 11-Star Experience\n\nSource: 11_STAR_EXPERIENCE.md. Trace: EXP-001.\n"],
    ["DESIGN.md", "# Design\n\nThis design expresses the 11-star V1 slice from 11_STAR_EXPERIENCE.md. Trace: EXP-001.\n"],
    ["ONBOARDING.md", "# Onboarding\n\nThe onboarding preview carries the 11-star magical moment from 11_STAR_EXPERIENCE.md. Trace: EXP-001.\n"],
    ["TECH_SPEC.md", "# Tech Spec\n\nThe state, API, analytics, and fixture contracts implement EXP-001 from 11_STAR_EXPERIENCE.md.\n"],
    ["LAUNCH_TRACE.md", "# Launch Trace\n\nEXP-001 maps research to 11_STAR_EXPERIENCE.md, SPEC.md, DESIGN.md, ONBOARDING.md, TECH_SPEC.md, and proof.\n"],
  ] as const) {
    writeFileSync(path.join(root, file), text, "utf8");
  }
}

function writeCompleteSecurity(root: string): void {
  writeFileSync(
    path.join(root, "SECURITY.md"),
    [
      "# Security Release Plan",
      "Source Basis: OWASP MASVS, OWASP ASVS, Apple Platform Security, Android security best practices, Claude Security, Codex Security, MobSF, Doppler, Sentry, and local security skills.",
      "Security Review Tool Routing: paid or account-gated scanners require founder approval before any free fallback is used.",
      "Claude Security, Codex Security, GitHub Advanced Security, Snyk, Semgrep, Socket, and MobSF Cloud are optional paid or account-gated routes.",
      "Free fallback: security-threat-model, security-best-practices, MobSF local, gitleaks, trufflehog, npm audit, osv-scanner, and semgrep community rules.",
      "Threat Model: Assets, Trust Boundaries, Attacker Capabilities, and abuse paths cover account, attribution, API, revenue, support, and store release flows.",
      "Data Classification separates public copy, user personal data, purchase data, Secrets, signing material, and CI credentials.",
      "Mobile Hardening: iOS uses Keychain, App Transport Security, App Attest, DeviceCheck, entitlements, and APPLE_SIGNING.md release proof. Android uses Android Keystore, Network Security Config, and Play Integrity.",
      "Authentication and Authorization are backend-owned; client checks are not access control.",
      "Backend and API controls include validation, rate limits, idempotency, webhook signature verification, RLS, audit logging, and admin least privilege.",
      "Revenue, Entitlements, RevenueCat, Stripe, restore, webhook, and idempotency controls prevent entitlement spoofing and replay.",
      "Privacy and Analytics cover PostHog, session replay, PII, PII scrubbing, self-reported attribution, privacy disclosures, and data deletion alignment.",
      "Email and Domain Security cover SPF, DKIM, DMARC, unsubscribe, Resend, support, privacy, security aliases, security.txt, and security headers.",
      "Supply Chain covers SDK inventory, dependency review, lockfiles, secret scan, build scripts, signing material, and no raw secrets.",
      "Monitoring and Incident Response cover Sentry, release health, alerts, support escalation, rollback, and vulnerability disclosure.",
      "Release Proof requires check:security, check:secrets, mobile proof, webhook proof, scanner or blocked-route evidence, and security-review.html.",
      "Accepted Risks list owner, reason, expiry, compensating control, evidence, and founder approval.",
      "Founder Approval gates paid scanners, hosted security tools, repo connections, public disclosure routes, and blocking App Attest, DeviceCheck, or Play Integrity enforcement.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(root, "security-review.html"), "<!doctype html><html><body>Security review board</body></html>", "utf8");
}

function writeCompleteContentAssets(root: string): void {
  mkdirSync(path.join(root, "content-assets"), { recursive: true });
  writeFileSync(
    path.join(root, "content-assets", "CONTENT_ASSETS.md"),
    [
      "# Content Assets",
      "Route Matrix",
      "Higgsfield is the intended paid visual route for net-new AI imagery. If Higgsfield is unavailable, stop for founder approval before Remotion fallback.",
      "Remotion is approved for local rendered product-demo assets from real app UI.",
      "Founder approval is required before public posting, store upload, paid generation, paid render infrastructure, or scheduling.",
      "License status: Remotion license eligibility for commercial use is checked or founder-approved before production output.",
      "Source Inputs: screenshots/raw/onboarding.png, 11_STAR_EXPERIENCE.md, DESIGN.md, content-assets/copy/hooks.json, owned or licensed media.",
      "Composition Manifest: content-assets/manifest.json records asset IDs, composition IDs, dimensions, inputs, outputs, truth constraints, approvals, render proof, and license status.",
      "Render Commands: cd content-assets/remotion && npx remotion render VerticalHookDemo --output ../out/vertical-hook-demo.mp4.",
      "Claim Review: real app UI remains visible, no unsupported pricing, endorsement, medical, financial, urgency, scarcity, or unavailable UI claims.",
      "Output Registry: vertical-hook-demo -> content-assets/out/vertical-hook-demo.mp4.",
      "Public Use Gates: founder approval required before posting, store upload, paid ads, or creator distribution.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    path.join(root, "content-assets", "content-assets.html"),
    "<!doctype html><html><body>Content asset route and output proof board</body></html>",
    "utf8",
  );
  writeFileSync(
    path.join(root, "content-assets", "manifest.json"),
    JSON.stringify(
      {
        schema_version: "1",
        assets: [
          {
            asset_id: "vertical-hook-demo",
            surface: "tiktok_reels_shorts",
            route: "remotion",
            status: "draft",
            composition_id: "VerticalHookDemo",
            dimensions: "1080x1920",
            duration_seconds: 12,
            inputs: ["screenshots/raw/onboarding.png", "11_STAR_EXPERIENCE.md", "DESIGN.md", "content-assets/copy/hooks.json"],
            outputs: ["content-assets/out/vertical-hook-demo.mp4"],
            truth_constraints: ["real app UI remains visible", "V1 scalable slice from 11_STAR_EXPERIENCE.md remains truthful", "no unsupported claims"],
            approvals: ["founder approval before public posting", "fallback approval before replacing Higgsfield"],
            render_proof: "cd content-assets/remotion && npx remotion render VerticalHookDemo --output ../out/vertical-hook-demo.mp4",
            license_status: "Remotion license status checked before commercial use",
          },
        ],
      },
      null,
      2,
    ),
    "utf8",
  );
}

function writeCompleteViralGrowth(root: string): void {
  mkdirSync(path.join(root, "growth"), { recursive: true });
  const state = readState(root);
  const growthLane = getLane(state, "growth");
  growthLane["status"] = "done";
  growthLane["evidence"] = ["growth/VIRAL_GROWTH.md", "growth/format-lab.csv", "UGC_PLAYBOOK.md", "FASTLANE_OPS.md"];
  growthLane["blockers"] = [];
  writeState(root, state);
  writeFileSync(
    path.join(root, "growth", "VIRAL_GROWTH.md"),
    [
      "# Viral Growth",
      "Fit Gate: the app has a visible personal result, a shareable emotional moment, and no privacy or policy blocker.",
      "Growth Thesis: the 11_STAR_EXPERIENCE.md V1 slice becomes a truthful product loop, a creator-visible content loop, and a measurable conversion path.",
      "Product Loop: users can share or invite from the result preview after onboarding. Referral Or Share Mechanic: stable referral code, recipient value, backend entitlement validation, duplicate handling, self-referral prevention, rate limits, support recovery, and abuse controls.",
      "Content Loop: TikTok/Reels/Shorts formats show real app UI, product visibility, a clear CTA, creator_code mapping, and claim constraints.",
      "Format Lab: growth/format-lab.csv records format ID, hook, first frame, product insertion, CTA, variables, signal windows, and status.",
      "Monetization Timing: ONBOARDING.md previews value before paywall, REVENUE_OPS.md owns RevenueCat and Stripe package rules, paywall timing, purchase proof, restore purchases, and transparent terms.",
      "Measurement Plan: ANALYTICS.md and analytics-plan.html define PostHog events, dashboard proof, referral_invite_started, referral_invite_completed, referral_unlock_earned, share_started, share_completed, creator_code_applied, viral_format_signal_detected, paywall_viewed, purchase_completed, entitlement_active, and retention checks.",
      "Stop And Scale Rules: one viral post is not a format; scale after 2-3 repeatable hits plus downstream app opens, paywall reach, purchases, and retention evidence.",
      "Founder-Only Gates: creator payments, paid tools, public posting, social account connections, pricing changes, legal approval, and platform-policy approval.",
      "Traceability: LAUNCH_TRACE.md maps GROW-001 from research to SPEC.md, 11_STAR_EXPERIENCE.md, ONBOARDING.md, UGC_PLAYBOOK.md, CONTENT_ASSETS.md, FASTLANE_OPS.md, REVENUE_OPS.md, ANALYTICS.md, PRIVACY.md, TERMS.md, and PRODUCTION_READINESS.md.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    path.join(root, "growth", "format-lab.csv"),
    "format_id,hook_structure,first_frame,product_insertion,cta,signal_window,status\nFMT-001,personal reveal,real app result,result preview,share referral code,24h/72h/7d,active\n",
    "utf8",
  );
  writeFileSync(path.join(root, "UGC_PLAYBOOK.md"), "# UGC Playbook\n\nCreator scripts use GROW-001 and the format lab.\n", "utf8");
  writeFileSync(path.join(root, "FASTLANE_OPS.md"), "# Fastlane Ops\n\nFastlane reuses approved format IDs after launch approval.\n", "utf8");
}

function writeCompletePaidUserAcquisition(root: string): void {
  mkdirSync(path.join(root, "growth"), { recursive: true });
  const state = readState(root);
  const paidUaLane = getLane(state, "paid_user_acquisition");
  paidUaLane["status"] = "done";
  paidUaLane["evidence"] = ["growth/PAID_UA.md", "growth/paid-ua-report.csv"];
  paidUaLane["blockers"] = [];
  writeState(root, state);
  writeFileSync(
    path.join(root, "growth", "PAID_UA.md"),
    [
      "# Paid User Acquisition",
      "Fit Gate: store destination, privacy, support, onboarding, paywall, RevenueCat entitlement, and founder-approved spend are ready for a limited test.",
      "Channel Choice: one-channel rule selects Meta Ads for the first test while TikTok, Google web-to-app, Apple Ads, and Apple Search Ads are rejected until one channel works.",
      "Creative Production: CONTENT_ASSETS.md owns 3-5 weekly creative assets, angle IDs, real app UI, product visibility, claim constraints, and the 11_STAR_EXPERIENCE.md V1 slice.",
      "Tracking Baseline: ANALYTICS.md records PostHog events, ad-network SDK or native report route, App Store Connect or Google Play store metrics, self-reported attribution, and baseline uplift rules.",
      "RevenueCat Economics: REVENUE_OPS.md uses RevenueCat LTV, cohorts, trial starts, purchases, and entitlement data to compare CPA, CPI, ROAS, and payback window.",
      "Blended Report: growth/paid-ua-report.csv records spend, impressions, clicks, installs or app opens, paywall views, trials, purchases, entitlement active count, revenue, CPA, LTV window, winning angle, and next action.",
      "Weekly Schedule: Monday report review, Tuesday 3-5 asset production, Wednesday delivery check, Thursday anomaly check, Friday scale/hold/reduce/pause decision, and daily 15-minute pacing checks.",
      "Stop And Scale Rules: stop when baseline is missing, CPA cannot fit LTV, paywall or retention quality drops, or only clicks/installs improve; scale after one channel and repeatable creative angles show downstream revenue evidence.",
      "Founder-Only Gates: founder approval is required for ad account connection, budget, spend, automated rules, paid MMP/ad tooling, ad-network SDK privacy changes, custom product pages, public creative, pricing, trials, offers, and legal copy.",
      "Traceability: LAUNCH_TRACE.md maps PUA-001 from RESEARCH.md to CONTENT_ASSETS.md, REVENUE_OPS.md, ANALYTICS.md, APP_STORE_LISTING.md, PRIVACY.md, TERMS.md, and PRODUCTION_READINESS.md.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    path.join(root, "growth", "paid-ua-report.csv"),
    "date,channel,campaign,spend,impressions,clicks,installs_or_opens,paywall_views,trials,purchases,entitlement_active,revenue,ltv_window,cpa,roas_or_payback,winning_angle,next_action\n2026-05-28,meta,launch_v1,100,10000,300,80,40,10,3,3,90,d7,10,watch,UA-001,hold\n",
    "utf8",
  );
}

function writeCompleteOrchestration(root: string): void {
  mkdirSync(path.join(root, "orchestration"), { recursive: true });
  const state = readState(root);
  state["orchestration"] = {
    preflight_done: true,
    strategy: "hybrid",
    rationale: "Parallel read-only specialist audits are safe while implementation and state integration remain orchestrator-owned.",
    integration_owner: "orchestrator",
    manager_pattern: true,
    file_overlap_checked: true,
    actual_file_collision_check: true,
    agent_outputs_reviewed: true,
    state_reconciled: true,
    candidate_units: [
      {
        id: "product-audit",
        role: "product leader",
        objective: "Audit scope, onboarding, activation, and traceability.",
        mode: "read_only",
        files: ["SPEC.md", "11_STAR_EXPERIENCE.md", "ONBOARDING.md", "LAUNCH_TRACE.md"],
        shared_resources: [],
        parallel_safe: true,
        output: "findings",
        status: "completed",
      },
      {
        id: "security-audit",
        role: "security architect",
        objective: "Audit threat model, app integrity, entitlement abuse, and incident response.",
        mode: "read_only",
        files: ["SECURITY.md", "security-review.html"],
        shared_resources: [],
        parallel_safe: true,
        output: "findings",
        status: "completed",
      },
      {
        id: "state-integration",
        role: "orchestrator",
        objective: "Update state, failure cards, launch cockpit, git, and final proof.",
        mode: "serialized",
        files: ["PROJECT_STATE.yaml", "launch-cockpit.html", "PRODUCTION_READINESS.md"],
        shared_resources: ["git index"],
        parallel_safe: false,
        output: "integrated proof",
        status: "completed",
      },
    ],
    parallel_safe_units: ["product-audit", "security-audit"],
    serialized_units: [
      "PROJECT_STATE.yaml updates",
      "launch-cockpit.html rendering",
      "git staging, commits, merges, pushes, and releases",
      "provider/account mutations",
      "MobAI or simulator/device control",
      "state-integration",
    ],
    spawned_agents: [
      {
        id: "agent-security-audit",
        role: "security architect",
        objective: "Audit security release hardening.",
        mode: "read_only",
        allowed_files: [],
        forbidden_actions: ["stage", "commit", "push", "provider mutation", "device control"],
        status: "completed",
        output_path: "orchestration/security-audit.md",
      },
    ],
    focused_validators_run: ["npm run check:security -- --root .", "npm run check:orchestration -- --root ."],
    full_suites_run: ["npm run audit"],
  };
  const orchestrationLane = getLane(state, "orchestration");
  orchestrationLane["status"] = "done";
  orchestrationLane["evidence"] = ["orchestration/ORCHESTRATION.md", "orchestration/orchestration.html", "orchestration/security-audit.md"];
  orchestrationLane["blockers"] = [];
  writeState(root, state);
  writeFileSync(
    path.join(root, "orchestration", "ORCHESTRATION.md"),
    [
      "# Orchestration",
      "Orchestration Preflight: the orchestrator keeps state integration local while product and security audits run in parallel.",
      "Strategy: hybrid manager pattern with one orchestrator.",
      "Candidate Units: product-audit includes SPEC.md, 11_STAR_EXPERIENCE.md, ONBOARDING.md, and LAUNCH_TRACE.md; security-audit is read-only; state-integration is serialized.",
      "Parallel Safety Check: file-overlap check passed; actual modified files were compared after agent outputs returned.",
      "File Ownership: the orchestrator owns PROJECT_STATE.yaml, launch-cockpit.html, PRODUCTION_READINESS.md, git, and releases.",
      "Serialized Work: provider/account mutations, credentials, device control, git, commits, pushes, public posting, and release decisions stay serialized.",
      "Subagent Instructions: do not stage files, do not commit, do not push, do not mutate providers, do not control devices, and do not make founder-only decisions.",
      "Integration Plan: the orchestrator reviews outputs, accepts or rejects findings, updates failure cards and state, then runs focused validators and the full suite.",
      "Verification: npm run check:orchestration -- --root . and npm run audit passed.",
      "Founder-Only Gates: pricing, legal, credentials, spending, public posting, app-store submission, and destructive repo actions.",
      "State Updates: PROJECT_STATE.yaml and launch-cockpit.html were reconciled after integration.",
      "Failure Cards: no active orchestration failure cards remain.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(root, "orchestration", "orchestration.html"), "<!doctype html><html><body>Orchestration board</body></html>", "utf8");
  writeFileSync(path.join(root, "orchestration", "security-audit.md"), "# Security Audit\n\nNo orchestration blocker remains.\n", "utf8");
}

function writeCompletePaidToolDecisions(root: string): void {
  writeFileSync(
    path.join(root, "TOOL_DECISIONS.md"),
    [
      "# Tool Decisions",
      "| Tool | Lane | Access status | Founder confirmation | Selected route | Fallback limitation |",
      "| --- | --- | --- | --- | --- | --- |",
      "| AppKittie | research/aso | access confirmed | founder approved paid use | AppKittie MCP | n/a |",
      "| XPOZ | research | access confirmed | founder approved paid use | XPOZ MCP | n/a |",
      "| Higgsfield | content_assets | access confirmed | founder approved; Remotion fallback approved if Higgsfield is unavailable | Higgsfield MCP | Remotion fallback is founder-approved |",
      "| Refero | design | access confirmed | founder approved | Refero MCP | bundled ux-patterns fallback approved |",
      "| MobAI | engineering | access confirmed | founder approved | MobAI MCP | XcodeBuildMCP fallback approved when MobAI is unavailable |",
    ].join("\n"),
    "utf8",
  );
}

function writeSourceRegistryFixture(root: string, includeUrl = true): void {
  mkdirSync(path.join(root, "references"), { recursive: true });
  writeFileSync(
    path.join(root, "README.md"),
    [
      "# Source Fixture",
      "Use current docs from https://docs.doppler.com/docs/cli before setup.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    path.join(root, "references", "source-registry.yaml"),
    stringifyYaml({
      schema_version: 1,
      sources: includeUrl
        ? [
            {
              id: "example-source-current",
              name: "Example Source",
              source_type: "docs",
              url: "https://docs.doppler.com/docs/cli",
              refresh_cadence_days: 7,
              owner: "source-freshness",
              locations: ["README.md"],
            },
          ]
        : [],
    }),
    "utf8",
  );
}

function runFixture(label: string, root: string, script: string, expectedCode: number, expectedText?: string, extraArgs: string[] = []): void {
  const result = spawnSync(tsxBin, [path.join("scripts", script), "--root", root, ...extraArgs], {
    cwd: skillRoot,
    encoding: "utf8",
  });
  const output = `${result.stdout}\n${result.stderr}`;
  results.push({
    label,
    ok: result.status === expectedCode && (!expectedText || output.includes(expectedText)),
    expectedCode,
    actualCode: result.status,
    expectedText,
    output,
  });
}

try {
  const clean = makeFixture("clean");
  writeCompleteAttribution(clean);
  writeCompleteAppleSigning(clean);
  writeCompleteAppleRequirements(clean);
  writeCompleteStoreConsole(clean);
  writeCompleteStoreScreenshots(clean);
  writeCompleteElevenStar(clean);
  writeCompleteSecurity(clean);
  writeCompleteContentAssets(clean);
  writeCompleteViralGrowth(clean);
  writeCompletePaidUserAcquisition(clean);
  writeCompleteOrchestration(clean);
  runFixture("complete project state passes", clean, "validate-project-state.ts", 0);
  runFixture("complete attribution contract passes", clean, "check-attribution-contract.ts", 0);
  runFixture("clean secret routing passes", clean, "check-secret-routing.ts", 0);
  runFixture("complete security release packet passes", clean, "check-security-release.ts", 0);
  runFixture("complete content assets packet passes", clean, "check-content-assets.ts", 0);
  runFixture("complete viral growth packet passes", clean, "check-viral-growth-loop.ts", 0);
  runFixture("complete paid UA packet passes", clean, "check-paid-user-acquisition.ts", 0);
  runFixture("complete orchestration packet passes", clean, "check-parallel-orchestration.ts", 0);
  runFixture("complete Apple signing packet passes", clean, "check-apple-signing-packet.ts", 0);
  runFixture("complete Apple App Store requirements packet passes", clean, "check-apple-app-store-requirements.ts", 0);
  runFixture("complete store console packet passes", clean, "check-store-console-packet.ts", 0);
  runFixture("complete store screenshots packet passes", clean, "check-store-screenshots.ts", 0);
  runFixture("complete UX pattern packet passes", clean, "check-ux-patterns.ts", 0);
  runFixture("complete 11-star experience packet passes", clean, "check-eleven-star-experience.ts", 0);
  runFixture("aso metadata packet passes", clean, "check-aso-metadata.ts", 0);
  runFixture("landing funnel skips without landing scope", clean, "check-landing-funnel.ts", 0);
  writeCompletePaidToolDecisions(clean);
  runFixture("complete paid-tool decisions packet passes", clean, "check-paid-tool-decisions.ts", 0);

  const asoMissingListing = makeFixture("aso-missing-listing");
  rmSync(path.join(asoMissingListing, "app-store-listing"), { recursive: true, force: true });
  rmSync(path.join(asoMissingListing, "APP_STORE_LISTING.md"), { force: true });
  runFixture("aso metadata without APP_STORE_LISTING fails", asoMissingListing, "check-aso-metadata.ts", 1, "aso_metadata.app_store_listing_missing");

  const paidToolMissing = makeFixture("paid-tool-missing-decisions");
  rmSync(path.join(paidToolMissing, "TOOL_DECISIONS.md"), { force: true });
  runFixture("missing TOOL_DECISIONS.md fails when paid tools in scope", paidToolMissing, "check-paid-tool-decisions.ts", 1, "paid_tool_decisions.file_missing");

  const wranglerCreds = makeFixture("wrangler-toml-credentials");
  writeFileSync(
    path.join(wranglerCreds, "wrangler.toml"),
    ["name = \"app-landing\"", "[vars]", "SUPABASE_ANON = \"sb_publishable_abcdefghijklmnopqrstuvwx\""].join("\n"),
    "utf8",
  );
  runFixture("wrangler.toml committed credential warns", wranglerCreds, "check-secret-routing.ts", 0, "secrets.wrangler_toml_credentials");

  const sourceRegistryClean = makeEmptyFixture("source-registry-clean");
  writeSourceRegistryFixture(sourceRegistryClean);
  runFixture("source registry with registered URL passes", sourceRegistryClean, "check-source-freshness.ts", 0);
  runFixture("template secret docs pass from bundled template path", path.join(skillRoot, "templates"), "check-secret-routing.ts", 0);
  const cockpitPath = path.join(clean, "launch-cockpit.html");
  runFixture("launch cockpit renders", clean, "render-launch-cockpit.ts", 0, undefined, ["--out", cockpitPath]);
  if (!existsSync(cockpitPath)) {
    results.push({
      label: "launch cockpit output exists",
      ok: false,
      expectedCode: 0,
      actualCode: null,
      output: `Missing ${cockpitPath}`,
    });
  }

  const missingEvidence = makeFixture("missing-evidence");
  const missingEvidenceState = readState(missingEvidence);
  const missingEvidenceDesign = getLane(missingEvidenceState, "design");
  missingEvidenceDesign["status"] = "done";
  missingEvidenceDesign["evidence"] = ["MISSING.md"];
  writeState(missingEvidence, missingEvidenceState);
  runFixture("done lane with missing local evidence fails", missingEvidence, "validate-project-state.ts", 1, "done_evidence_missing");

  const blankEvidence = makeFixture("blank-evidence");
  const blankEvidenceState = readState(blankEvidence);
  const blankEvidenceDesign = getLane(blankEvidenceState, "design");
  blankEvidenceDesign["status"] = "done";
  blankEvidenceDesign["evidence"] = [""];
  writeState(blankEvidence, blankEvidenceState);
  runFixture("done lane with blank evidence fails", blankEvidence, "validate-project-state.ts", 1, "evidence.0.blank");

  const placeholderDate = makeFixture("placeholder-date");
  const placeholderDateState = readState(placeholderDate);
  placeholderDateState["updated_at"] = "YYYY-MM-DD";
  writeState(placeholderDate, placeholderDateState);
  runFixture("placeholder updated_at fails", placeholderDate, "validate-project-state.ts", 1, "updated_at.placeholder");

  const unreasonedNotNeeded = makeFixture("unreasoned-not-needed");
  const unreasonedState = readState(unreasonedNotNeeded);
  const unreasonedRevenue = getLane(unreasonedState, "revenue");
  unreasonedRevenue["status"] = "not_needed";
  unreasonedRevenue["evidence"] = [];
  unreasonedRevenue["blockers"] = [];
  writeState(unreasonedNotNeeded, unreasonedState);
  runFixture("not_needed lane without evidence or blocker fails", unreasonedNotNeeded, "validate-project-state.ts", 1, "not_needed_without_reason");

  const partialAttribution = makeFixture("partial-attribution");
  runFixture("partial attribution contract fails", partialAttribution, "check-attribution-contract.ts", 1, "attribution.screen_early.incomplete");

  const attributionAlias = makeFixture("attribution-alias");
  const attributionAliasState = readState(attributionAlias);
  const aliasContract = expectRecord(getLane(attributionAliasState, "analytics_attribution").attribution_contract, "attribution_contract");
  aliasContract["screen_early"] = true;
  aliasContract["other_free_text"] = true;
  aliasContract["backend_persistence"] = true;
  aliasContract["anonymous_reconciliation"] = true;
  aliasContract["verified"] = true;
  aliasContract["event_name"] = "signup_attribution_selected";
  aliasContract["event_alias_reason"] = "Existing production dashboards map signup_attribution_selected to attribution_source_selected.";
  writeState(attributionAlias, attributionAliasState);
  writeFileSync(
    path.join(attributionAlias, "ANALYTICS.md"),
    [
      "# Analytics",
      "signup_attribution_selected is the app event alias for attribution_source_selected.",
      "PostHog person property: self_reported_source.",
    ].join("\n"),
    "utf8",
  );
  runFixture("documented attribution event alias passes with warning", attributionAlias, "check-attribution-contract.ts", 0, "attribution.event_name.alias");

  const attributionMissingImplementation = makeFixture("attribution-code-missing");
  const attributionMissingState = readState(attributionMissingImplementation);
  const missingContract = expectRecord(getLane(attributionMissingState, "analytics_attribution").attribution_contract, "attribution_contract");
  const missingAttributionLane = getLane(attributionMissingState, "analytics_attribution");
  missingAttributionLane["status"] = "done";
  missingAttributionLane["evidence"] = ["ANALYTICS.md"];
  missingContract["screen_early"] = true;
  missingContract["other_free_text"] = true;
  missingContract["backend_persistence"] = true;
  missingContract["anonymous_reconciliation"] = true;
  missingContract["verified"] = true;
  writeState(attributionMissingImplementation, attributionMissingState);
  runFixture("done attribution without implementation text fails", attributionMissingImplementation, "check-attribution-contract.ts", 1, "attribution.text.self_reported_source.not_found");

  const attributionNotNeeded = makeFixture("attribution-not-needed");
  const attributionNotNeededState = readState(attributionNotNeeded);
  const attributionNotNeededLane = getLane(attributionNotNeededState, "analytics_attribution");
  attributionNotNeededLane["status"] = "not_needed";
  attributionNotNeededLane["evidence"] = [];
  attributionNotNeededLane["blockers"] = ["No onboarding, signup, or user identity surface exists in this app."];
  writeState(attributionNotNeeded, attributionNotNeededState);
  runFixture("attribution not_needed with reason passes attribution check", attributionNotNeeded, "check-attribution-contract.ts", 0);

  const nestedEnv = makeFixture("nested-env");
  mkdirSync(path.join(nestedEnv, "config"), { recursive: true });
  writeFileSync(path.join(nestedEnv, "config", ".env"), "POSTHOG_PROJECT_API_KEY=example\n", "utf8");
  runFixture("nested .env fails secret routing", nestedEnv, "check-secret-routing.ts", 1, "secrets.forbidden_file..env");

  const rawEnvExample = makeFixture("raw-env-example");
  writeFileSync(path.join(rawEnvExample, "secrets", ".env.example"), "STRIPE_SECRET_KEY=sk_test_1234567890abcdef\n", "utf8");
  runFixture("raw-looking test key in .env.example fails", rawEnvExample, "check-secret-routing.ts", 1, "secrets.raw_secret_pattern");

  const missingSecretEntry = makeFixture("missing-secret-entry");
  const missingSecretState = readState(missingSecretEntry);
  const missingSecretTools = getTools(missingSecretState);
  expectRecord(missingSecretTools["resend"], "tools.resend")["required_secrets"] = [];
  writeState(missingSecretEntry, missingSecretState);
  writeFileSync(path.join(missingSecretEntry, "SECRETS.md"), "# Secrets\n\nNo raw secrets. Provider: Doppler. CI and production use `doppler run --`.\n", "utf8");
  mkdirSync(path.join(missingSecretEntry, "src"), { recursive: true });
  writeFileSync(path.join(missingSecretEntry, "src", "email.ts"), "export const resendKey = process.env.RESEND_API_KEY;\n", "utf8");
  runFixture("code secret reference missing from state and secrets doc fails", missingSecretEntry, "check-secret-routing.ts", 1, "secrets.RESEND_API_KEY.unrouted");

  const missingSecurity = makeFixture("missing-security");
  rmSync(path.join(missingSecurity, "SECURITY.md"), { force: true });
  runFixture("missing security packet fails", missingSecurity, "check-security-release.ts", 1, "security.markdown_missing");

  const thinSecurity = makeFixture("thin-security");
  writeFileSync(
    path.join(thinSecurity, "SECURITY.md"),
    [
      "# Security",
      "We will be secure.",
      "Sentry is planned.",
    ].join("\n"),
    "utf8",
  );
  runFixture("thin security packet fails", thinSecurity, "check-security-release.ts", 1, "security.source_basis.missing");

  const unresolvedSecurity = makeFixture("unresolved-security");
  writeCompleteSecurity(unresolvedSecurity);
  writeFileSync(
    path.join(unresolvedSecurity, "SECURITY.md"),
    [
      "# Security Release Plan",
      "Source Basis: OWASP MASVS, OWASP ASVS, Apple Platform Security, Android security best practices, Claude Security, Codex Security, MobSF, Doppler, Sentry.",
      "Security Review Tool Routing: free fallback requires founder approval.",
      "Threat Model: Assets, Trust Boundaries, Attacker Capabilities, and Data Classification are present.",
      "Mobile Hardening: Keychain, App Transport Security, App Attest, DeviceCheck, entitlements, APPLE_SIGNING.md, Android Keystore, Network Security Config, and Play Integrity are listed.",
      "Authentication and Authorization protect Backend and API routes. Secrets use Doppler.",
      "Revenue, Entitlements, RevenueCat, Stripe, restore, webhook, and idempotency are covered.",
      "Privacy and Analytics include PostHog, session replay, PII, PII scrubbing, and self-reported attribution.",
      "Email security includes SPF, DKIM, DMARC, unsubscribe, and Resend. Public web uses security.txt and security headers.",
      "Supply Chain, Monitoring, Incident Response, Release Proof, Accepted Risks, Founder Approval, Sentry, release health, and MobSF are covered.",
      "App Attest is pending.",
    ].join("\n"),
    "utf8",
  );
  runFixture("security packet with unresolved platform gate fails", unresolvedSecurity, "check-security-release.ts", 1, "security.placeholder_or_unknown");

  const simulatorOnly = makeFixture("simulator-only");
  writeFileSync(
    path.join(simulatorOnly, "APPLE_SIGNING.md"),
    [
      "# Apple Signing",
      "Apple Developer Team ID DEVELOPMENT_TEAM Bundle ID App ID App Store Connect ASC CLI auth status app creation route App Record Creation Preflight certificate provisioning archive export upload TestFlight founder approval.",
      "Simulator build passed.",
    ].join("\n"),
    "utf8",
  );
  runFixture("simulator-only Apple signing claim fails", simulatorOnly, "check-apple-signing-packet.ts", 1, "simulator_only_risk");

  const androidOnly = makeFixture("apple-android-only");
  const androidOnlyState = readState(androidOnly);
  expectRecord(androidOnlyState.project, "project")["platforms"] = ["android"];
  expectRecord(expectRecord(androidOnlyState.project, "project")["bundle_ids"], "project.bundle_ids")["ios"] = "";
  const androidAppleLane = getLane(androidOnlyState, "apple_signing");
  androidAppleLane["status"] = "not_needed";
  androidAppleLane["evidence"] = [];
  androidAppleLane["blockers"] = ["Android-only launch; no Apple distribution path."];
  writeState(androidOnly, androidOnlyState);
  runFixture("Android-only app does not require Apple signing packet", androidOnly, "check-apple-signing-packet.ts", 0);

  const appleMissingState = makeFixture("apple-missing-state");
  const appleMissingStateValue = readState(appleMissingState);
  const appleMissingLane = getLane(appleMissingStateValue, "apple_signing");
  appleMissingLane["status"] = "done";
  writeState(appleMissingState, appleMissingStateValue);
  writeFileSync(
    path.join(appleMissingState, "APPLE_SIGNING.md"),
    [
      "# Apple Signing",
      "Apple Developer membership missing.",
      "Team ID unknown and DEVELOPMENT_TEAM blank.",
      "Bundle ID and App ID are not configured.",
      "App Store Connect app record missing.",
      "ASC CLI auth status missing and app creation route blocked until founder approval.",
      "App Record Creation Preflight requires founder approval.",
      "Distribution certificate and provisioning profile missing.",
      "Archive, export, upload, and TestFlight are not configured.",
    ].join("\n"),
    "utf8",
  );
  runFixture("Apple signing packet with unresolved distribution gates fails", appleMissingState, "check-apple-signing-packet.ts", 1, "apple_signing.unresolved_distribution_gate");

  const missingAppleRequirements = makeFixture("apple-requirements-missing");
  rmSync(path.join(missingAppleRequirements, "APPLE_APP_STORE_REQUIREMENTS.md"), { force: true });
  runFixture(
    "missing Apple App Store requirements packet fails",
    missingAppleRequirements,
    "check-apple-app-store-requirements.ts",
    1,
    "apple_requirements.missing",
  );

  const thinAppleRequirements = makeFixture("apple-requirements-thin");
  writeFileSync(
    path.join(thinAppleRequirements, "APPLE_APP_STORE_REQUIREMENTS.md"),
    [
      "# Apple App Store Requirements",
      "Privacy is handled in the policy.",
      "The app can be uploaded to App Store Connect.",
    ].join("\n"),
    "utf8",
  );
  runFixture(
    "thin Apple App Store requirements packet fails",
    thinAppleRequirements,
    "check-apple-app-store-requirements.ts",
    1,
    "apple_requirements.privacyinfo_xcprivacy.missing",
  );

  const readyAppleRequirementsNoManifest = makeFixture("apple-requirements-no-manifest-file");
  writeCompleteAppleRequirements(readyAppleRequirementsNoManifest);
  rmSync(path.join(readyAppleRequirementsNoManifest, "ios"), { recursive: true, force: true });
  runFixture(
    "ready Apple requirements without PrivacyInfo file fails",
    readyAppleRequirementsNoManifest,
    "check-apple-app-store-requirements.ts",
    1,
    "apple_requirements.privacy_manifest_file_missing",
  );

  const iosOnlyStore = makeFixture("store-ios-only");
  const iosOnlyStoreState = readState(iosOnlyStore);
  expectRecord(iosOnlyStoreState.project, "project")["platforms"] = ["ios"];
  expectRecord(expectRecord(iosOnlyStoreState.project, "project")["bundle_ids"], "project.bundle_ids")["android"] = "";
  writeState(iosOnlyStore, iosOnlyStoreState);
  writeFileSync(
    path.join(iosOnlyStore, "STORE_CONSOLE.md"),
    [
      "# Store Console",
      "App Store Connect click path and ASC CLI routes cover app creation, asc-id-resolver ID resolution, app info, SKU, primary locale, bundle ID, App Privacy, pricing, RevenueCat, asc-revenuecat-catalog-sync, subscription setup, localization, custom product page strategy, In-App Event planning, Higgsfield-backed marketing assets, screenshots, TestFlight, review status, review notes, and account deletion.",
      "App Review Information notes cover purpose and target audience, setup and access instructions, the demo account decision (including an explicit no-login confirmation when there is no account system), the list of test devices and OS versions, and the external services used.",
      "If the app name is already in use, stop for founder approval before using any fallback name.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(iosOnlyStore, "store-console.html"), "<!doctype html><html><body>iOS store packet</body></html>", "utf8");
  writeFileSync(
    path.join(iosOnlyStore, "APP_STORE_LISTING.md"),
    [
      "# App Store Listing",
      "App Privacy, pricing, RevenueCat, asc-revenuecat-catalog-sync, subscription setup, localization, custom product page strategy, In-App Event planning, App Icon direction, App Preview routing, SCREENSHOTS.md, iPad screenshot wells, copy overlay rules, ParthJadhav/app-store-screenshots, Higgsfield-backed marketing assets, and founder approval are documented.",
      "ASC route proof includes app creation, asc-app-create-ui, asc-id-resolver, asc-metadata-sync, asc-localize-metadata, asc-screenshot-resize, asc-shots-pipeline, asc-ppp-pricing, asc-subscription-localization, asc-testflight-orchestration, asc-submission-health, and asc-release-flow.",
      "Every screenshot row records version localization ID and every pricing row records base territory.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(iosOnlyStore, "app-store-listing.html"), "<!doctype html><html><body>iOS listing packet</body></html>", "utf8");
  writeFileSync(path.join(iosOnlyStore, "app-privacy-questionnaire.html"), "<!doctype html><html><body>iOS privacy questionnaire</body></html>", "utf8");
  writeCompleteStoreScreenshots(iosOnlyStore);
  runFixture("iOS-only store packet does not require Google Play fields", iosOnlyStore, "check-store-console-packet.ts", 0);

  const missingListingArtifacts = makeFixture("store-missing-listing-artifacts");
  rmSync(path.join(missingListingArtifacts, "app-store-listing"), { recursive: true, force: true });
  writeFileSync(
    path.join(missingListingArtifacts, "STORE_CONSOLE.md"),
    [
      "# Store Console",
      "App Store Connect click path covers app info, SKU, primary locale, bundle ID, App Privacy, pricing, RevenueCat, subscription setup, localization, custom product page strategy, In-App Event planning, Higgsfield-backed marketing assets, screenshots, review notes, and account deletion.",
      "Google Play click path covers package name, Data safety, screenshots, review notes, privacy, and account deletion.",
      "If the app name is already in use, stop for founder approval before using any fallback name.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(missingListingArtifacts, "store-console.html"), "<!doctype html><html><body>Store console only</body></html>", "utf8");
  runFixture("iOS store packet without App Store listing artifacts fails", missingListingArtifacts, "check-store-console-packet.ts", 1, "store_console.app_store_listing.markdown_missing");

  const unresolvedListing = makeFixture("store-unresolved-listing");
  writeCompleteStoreConsole(unresolvedListing);
  const unresolvedListingState = readState(unresolvedListing);
  const unresolvedStoreLane = getLane(unresolvedListingState, "store_console");
  unresolvedStoreLane["status"] = "done";
  writeState(unresolvedListing, unresolvedListingState);
  writeFileSync(
    path.join(unresolvedListing, "APP_STORE_LISTING.md"),
    [
      "# App Store Listing",
      "App Privacy answers are Pending.",
      "Pricing, RevenueCat, subscription setup, localization, custom product page strategy, In-App Event planning, Higgsfield-backed marketing assets, and founder approval are documented.",
    ].join("\n"),
    "utf8",
  );
  runFixture("iOS App Store listing packet with unresolved placeholders fails", unresolvedListing, "check-store-console-packet.ts", 1, "store_console.placeholder_or_unknown");

  const thinAscMarketing = makeFixture("thin-asc-marketing");
  writeFileSync(
    path.join(thinAscMarketing, "STORE_CONSOLE.md"),
    [
      "# Store Console",
      "App Store Connect click path covers app info, SKU, primary locale, bundle ID, privacy, screenshots, review notes, and account deletion.",
      "Google Play click path covers package name, Data safety, screenshots, review notes, privacy, and account deletion.",
      "If the app name is already in use, stop for founder approval before using any fallback name.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(thinAscMarketing, "store-console.html"), "<!doctype html><html><body>Thin store packet</body></html>", "utf8");
  runFixture("thin ASC listing packet without App Privacy and marketing surfaces fails", thinAscMarketing, "check-store-console-packet.ts", 1, "store_console.app_privacy.missing");

  const unsafeFallback = makeFixture("unsafe-store-fallback");
  writeCompleteStoreConsole(unsafeFallback);
  writeFileSync(
    path.join(unsafeFallback, "STORE_CONSOLE.md"),
    [
      "# Store Console",
      "App Store Connect click path covers app info, SKU, primary locale, bundle ID, App Privacy, pricing, RevenueCat, subscription setup, localization, custom product page strategy, In-App Event planning, Higgsfield-backed marketing assets, screenshots, review notes, and account deletion.",
      "Google Play click path covers package name, Data safety, screenshots, review notes, privacy, and account deletion.",
      "Founder approval is required before submission.",
      "If the app name is already in use, retry with fallback name App - app.",
    ].join("\n"),
    "utf8",
  );
  runFixture("unsafe ASC fallback-name retry fails", unsafeFallback, "check-store-console-packet.ts", 1, "unapproved_name_fallback");

  const ascAppCreationUnderclaimed = makeFixture("asc-app-creation-underclaimed");
  writeCompleteStoreConsole(ascAppCreationUnderclaimed);
  writeFileSync(
    path.join(ascAppCreationUnderclaimed, "STORE_CONSOLE.md"),
    [
      "# Store Console",
      "App Store Connect click path and ASC CLI routes cover app creation, asc-id-resolver ID resolution, app info, SKU, primary locale, bundle ID, App Privacy, pricing, RevenueCat, asc-revenuecat-catalog-sync, subscription setup, localization, custom product page strategy, In-App Event planning, Higgsfield-backed marketing assets, screenshots, TestFlight, review status, review notes, and account deletion.",
      "App Review Information notes cover purpose and target audience, setup and access instructions, the demo account decision (including an explicit no-login confirmation when there is no account system), the list of test devices and OS versions, and the external services used.",
      "The founder must manually create the app record in App Store Connect.",
      "Google Play click path covers package name, Data safety, screenshots, review notes, privacy, and account deletion.",
      "If the app name is already in use, stop for founder approval before using any fallback name.",
    ].join("\n"),
    "utf8",
  );
  runFixture(
    "manual-only ASC app creation underclaim fails",
    ascAppCreationUnderclaimed,
    "check-store-console-packet.ts",
    1,
    "store_console.asc_app_creation_underclaimed",
  );

  const phraseOnlyStore = makeFixture("store-phrase-only");
  const phraseOnlyStoreState = readState(phraseOnlyStore);
  const phraseOnlyStoreLane = getLane(phraseOnlyStoreState, "store_console");
  phraseOnlyStoreLane["status"] = "done";
  writeState(phraseOnlyStore, phraseOnlyStoreState);
  writeFileSync(
    path.join(phraseOnlyStore, "STORE_CONSOLE.md"),
    [
      "# Store Console",
      "App Store Connect click path TODO.",
      "Google Play click path unknown.",
      "Privacy not configured.",
      "Data safety unknown.",
      "Screenshots TODO.",
      "Review notes TODO.",
      "Account deletion unknown.",
      "SKU placeholder.",
      "Primary locale unknown.",
      "Bundle ID unknown.",
      "Package name unknown.",
      "If the app name is already in use, continue with fallback name automatically without founder approval.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(phraseOnlyStore, "store-console.html"), "<!doctype html><html><body>Store packet</body></html>", "utf8");
  runFixture("store packet with placeholders and unapproved fallback fails", phraseOnlyStore, "check-store-console-packet.ts", 1, "store_console.unapproved_name_fallback");

  const rawOnlyScreenshots = makeFixture("raw-only-screenshots");
  writeCompleteStoreConsole(rawOnlyScreenshots);
  writeFileSync(
    path.join(rawOnlyScreenshots, "SCREENSHOTS.md"),
    [
      "# Store Screenshots",
      "Status: ready for upload.",
      "Raw Capture Matrix",
      "| Slot | Platform | Device | Locale | Source screen | Capture tool | Raw path | Version localization ID | Status |",
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
      "| 1 | iOS | iPhone | en-US | Home | MobAI | screenshots/raw/home.png | 123 | ready |",
      "Production Composition Matrix",
      "Device Wells: iPhone and iPad wells are covered.",
      "headline and copy overlay are not needed because raw screenshots are ready.",
      "DESIGN.md, 11_STAR_EXPERIENCE.md, Higgsfield, Remotion, App Icon, App Preview, asc-screenshot-resize, alpha, color space, thumbnail, visual QA, Google Play, feature graphic, and founder approval are mentioned.",
    ].join("\n"),
    "utf8",
  );
  runFixture("raw-only store screenshots fail", rawOnlyScreenshots, "check-store-screenshots.ts", 1, "store_screenshots.raw_capture_as_final");

  const appStoreScreenshotsUnvalidated = makeFixture("app-store-screenshots-unvalidated");
  writeCompleteStoreConsole(appStoreScreenshotsUnvalidated);
  writeFileSync(
    path.join(appStoreScreenshotsUnvalidated, "SCREENSHOTS.md"),
    [
      "# Store Screenshots",
      "Status: ready for upload.",
      "Raw Capture Matrix",
      "Production Composition Matrix",
      "Device Wells",
      "headline, copy overlay, DESIGN.md, 11_STAR_EXPERIENCE.md, MobAI, Higgsfield, Remotion, ParthJadhav/app-store-screenshots, App Icon, App Preview, asc-screenshot-resize, ASC device_type, screenshot count, required, scaled, version localization ID, alpha, color space, sRGB, thumbnail, visual QA, founder approval, iPhone, iPad, Google Play, and feature graphic are mentioned.",
      "Production artwork was styled with the external screenshot skill, but no saved board state or upload orchestration proof is recorded.",
    ].join("\n"),
    "utf8",
  );
  runFixture(
    "app-store-screenshots mention without board or upload orchestration fails",
    appStoreScreenshotsUnvalidated,
    "check-store-screenshots.ts",
    1,
    "store_screenshots.app-store-screenshots.json.missing",
  );

  const uxFallbackUnapproved = makeFixture("ux-fallback-unapproved");
  writeFileSync(
    path.join(uxFallbackUnapproved, "UX_PATTERNS.md"),
    [
      "# UX Patterns",
      "Refero Route",
      "Refero unavailable, using free baseline route.",
      "Pattern Inventory",
      "Flow Map",
      "State Matrix",
      "Bug Traps",
      "Onboarding Playbook",
      "Do not copy one app directly.",
    ].join("\n"),
    "utf8",
  );
  runFixture("Refero fallback without founder approval fails", uxFallbackUnapproved, "check-ux-patterns.ts", 1, "ux_patterns.refero_fallback_unapproved");

  const elevenStarMissing = makeFixture("eleven-star-missing");
  rmSync(path.join(elevenStarMissing, "11-star-experience"), { recursive: true, force: true });
  runFixture("missing 11-star experience packet fails", elevenStarMissing, "check-eleven-star-experience.ts", 1, "eleven_star.markdown_missing");

  const elevenStarThin = makeFixture("eleven-star-thin");
  writeFileSync(
    path.join(elevenStarThin, "11-star-experience", "11_STAR_EXPERIENCE.md"),
    [
      "# 11-Star Experience",
      "Experience Thesis: Make it feel magical.",
      "Star Ladder",
      "| Stars | Label | User scene | Product behavior implied | Emotional reaction | What we learn |",
      "| --- | --- | --- | --- | --- | --- |",
      "| 5 | Expected | It works. | Build it. | Fine. | Baseline. |",
    ].join("\n"),
    "utf8",
  );
  runFixture("thin 11-star experience packet fails", elevenStarThin, "check-eleven-star-experience.ts", 1, "eleven_star.line_of_feasibility.missing");

  const elevenStarDonePlaceholder = makeFixture("eleven-star-done-placeholder");
  const elevenStarDonePlaceholderState = readState(elevenStarDonePlaceholder);
  const doneExperienceLane = getLane(elevenStarDonePlaceholderState, "experience");
  doneExperienceLane["status"] = "done";
  doneExperienceLane["evidence"] = ["11-star-experience/11_STAR_EXPERIENCE.md", "11-star-experience/11-star-experience.html"];
  writeState(elevenStarDonePlaceholder, elevenStarDonePlaceholderState);
  runFixture(
    "done 11-star experience with placeholders fails",
    elevenStarDonePlaceholder,
    "check-eleven-star-experience.ts",
    1,
    "eleven_star.placeholder_complete",
  );

  const contentFallbackUnapproved = makeFixture("content-fallback-unapproved");
  mkdirSync(path.join(contentFallbackUnapproved, "content-assets"), { recursive: true });
  writeFileSync(
    path.join(contentFallbackUnapproved, "content-assets", "CONTENT_ASSETS.md"),
    [
      "# Content Assets",
      "Route Matrix",
      "Higgsfield unavailable, using Remotion fallback.",
      "Remotion",
      "License status: Remotion license status checked before commercial use.",
      "Source Inputs",
      "Composition Manifest",
      "Render Commands",
      "Claim Review",
      "Output Registry",
      "Public Use Gates",
    ].join("\n"),
    "utf8",
  );
  runFixture("Higgsfield content fallback without founder approval fails", contentFallbackUnapproved, "check-content-assets.ts", 1, "content_assets.higgsfield_fallback_unapproved");

  const remotionLicenseUnchecked = makeFixture("remotion-license-unchecked");
  mkdirSync(path.join(remotionLicenseUnchecked, "content-assets"), { recursive: true });
  writeFileSync(
    path.join(remotionLicenseUnchecked, "content-assets", "CONTENT_ASSETS.md"),
    [
      "# Content Assets",
      "Route Matrix",
      "Higgsfield",
      "Remotion",
      "Founder approval recorded for Remotion fallback.",
      "License status: unchecked.",
      "Source Inputs",
      "Composition Manifest",
      "Render Commands",
      "Claim Review",
      "Output Registry",
      "Public Use Gates",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    path.join(remotionLicenseUnchecked, "content-assets", "manifest.json"),
    JSON.stringify(
      {
        assets: [
          {
            asset_id: "license-thin",
            surface: "ad",
            route: "remotion",
            status: "draft",
            composition_id: "Ad",
            dimensions: "1080x1080",
            inputs: ["DESIGN.md"],
            outputs: ["content-assets/out/ad.mp4"],
            truth_constraints: ["real app UI visible"],
            approvals: ["founder approval before public use"],
            render_proof: "npx remotion render Ad --output ../out/ad.mp4",
            license_status: "unchecked",
          },
        ],
      },
      null,
      2,
    ),
    "utf8",
  );
  runFixture("Remotion asset without license status fails", remotionLicenseUnchecked, "check-content-assets.ts", 1, "content_assets.manifest.assets.0.license_status.unchecked");

  const thinContentManifest = makeFixture("content-manifest-thin");
  mkdirSync(path.join(thinContentManifest, "content-assets"), { recursive: true });
  writeFileSync(
    path.join(thinContentManifest, "content-assets", "CONTENT_ASSETS.md"),
    [
      "# Content Assets",
      "Route Matrix",
      "Higgsfield",
      "Remotion",
      "Founder approval recorded for fallback.",
      "License status: Remotion license status checked before commercial use.",
      "Source Inputs",
      "Composition Manifest",
      "Render Commands",
      "Claim Review",
      "Output Registry",
      "Public Use Gates",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    path.join(thinContentManifest, "content-assets", "manifest.json"),
    JSON.stringify({ assets: [{ asset_id: "thin", route: "remotion", status: "draft" }] }, null, 2),
    "utf8",
  );
  runFixture("thin Remotion content manifest fails", thinContentManifest, "check-content-assets.ts", 1, "content_assets.manifest.assets.0.surface.missing");

  const viralGrowthMissing = makeFixture("viral-growth-missing");
  rmSync(path.join(viralGrowthMissing, "growth"), { recursive: true, force: true });
  runFixture("missing viral growth packet fails", viralGrowthMissing, "check-viral-growth-loop.ts", 1, "viral_growth.markdown_missing");

  const viralGrowthThin = makeFixture("viral-growth-thin");
  mkdirSync(path.join(viralGrowthThin, "growth"), { recursive: true });
  writeFileSync(
    path.join(viralGrowthThin, "growth", "VIRAL_GROWTH.md"),
    [
      "# Viral Growth",
      "Fit Gate",
      "Growth Thesis: post on TikTok and see what happens.",
    ].join("\n"),
    "utf8",
  );
  runFixture("thin viral growth packet fails", viralGrowthThin, "check-viral-growth-loop.ts", 1, "viral_growth.product_loop.missing");

  const viralGrowthDonePlaceholder = makeFixture("viral-growth-done-placeholder");
  writeCompleteViralGrowth(viralGrowthDonePlaceholder);
  writeFileSync(
    path.join(viralGrowthDonePlaceholder, "growth", "VIRAL_GROWTH.md"),
    readFileSync(path.join(viralGrowthDonePlaceholder, "growth", "VIRAL_GROWTH.md"), "utf8") + "\nTODO: choose final creator CTA.\n",
    "utf8",
  );
  runFixture("done viral growth with placeholders fails", viralGrowthDonePlaceholder, "check-viral-growth-loop.ts", 1, "viral_growth.placeholder_complete");

  const paidUaMissing = makeFixture("paid-ua-missing");
  rmSync(path.join(paidUaMissing, "growth", "PAID_UA.md"), { force: true });
  runFixture("missing paid UA packet fails", paidUaMissing, "check-paid-user-acquisition.ts", 1, "paid_ua.markdown_missing");

  const paidUaThin = makeFixture("paid-ua-thin");
  mkdirSync(path.join(paidUaThin, "growth"), { recursive: true });
  writeFileSync(
    path.join(paidUaThin, "growth", "PAID_UA.md"),
    [
      "# Paid User Acquisition",
      "Fit Gate",
      "Channel Choice: try Meta, TikTok, Google, and Apple Ads at the same time.",
    ].join("\n"),
    "utf8",
  );
  runFixture("thin paid UA packet fails", paidUaThin, "check-paid-user-acquisition.ts", 1, "paid_ua.creative_production.missing");

  const paidUaDonePlaceholder = makeFixture("paid-ua-done-placeholder");
  writeCompletePaidUserAcquisition(paidUaDonePlaceholder);
  writeFileSync(
    path.join(paidUaDonePlaceholder, "growth", "PAID_UA.md"),
    readFileSync(path.join(paidUaDonePlaceholder, "growth", "PAID_UA.md"), "utf8") + "\nTODO: choose final weekly budget.\n",
    "utf8",
  );
  runFixture("done paid UA with placeholders fails", paidUaDonePlaceholder, "check-paid-user-acquisition.ts", 1, "paid_ua.placeholder_complete");

  const paidUaDoneReportMissing = makeFixture("paid-ua-done-report-missing");
  writeCompletePaidUserAcquisition(paidUaDoneReportMissing);
  rmSync(path.join(paidUaDoneReportMissing, "growth", "paid-ua-report.csv"), { force: true });
  runFixture("done paid UA without report fails", paidUaDoneReportMissing, "check-paid-user-acquisition.ts", 1, "paid_ua.report_missing_done");

  const orchestrationNoPreflight = makeFixture("orchestration-no-preflight");
  const orchestrationNoPreflightState = readState(orchestrationNoPreflight);
  const noPreflightLane = getLane(orchestrationNoPreflightState, "orchestration");
  noPreflightLane["status"] = "done";
  noPreflightLane["evidence"] = ["orchestration/ORCHESTRATION.md", "orchestration/orchestration.html"];
  writeState(orchestrationNoPreflight, orchestrationNoPreflightState);
  runFixture("orchestration done without preflight fails", orchestrationNoPreflight, "check-parallel-orchestration.ts", 1, "orchestration.done_without_preflight");

  const orchestrationOverlap = makeFixture("orchestration-overlap");
  const orchestrationOverlapState = readState(orchestrationOverlap);
  orchestrationOverlapState["orchestration"] = {
    preflight_done: true,
    strategy: "parallel_subagents",
    rationale: "Attempted two parallel implementation units.",
    integration_owner: "orchestrator",
    manager_pattern: true,
    file_overlap_checked: true,
    actual_file_collision_check: false,
    agent_outputs_reviewed: false,
    state_reconciled: false,
    candidate_units: [
      {
        id: "analytics-doc",
        role: "engineering leader",
        objective: "Update analytics plan.",
        mode: "edit",
        files: ["ENGINEERING_PLAN.md"],
        shared_resources: [],
        parallel_safe: true,
        status: "pending",
      },
      {
        id: "revenue-doc",
        role: "engineering leader",
        objective: "Update revenue plan.",
        mode: "edit",
        files: ["ENGINEERING_PLAN.md"],
        shared_resources: [],
        parallel_safe: true,
        status: "pending",
      },
    ],
    parallel_safe_units: ["analytics-doc", "revenue-doc"],
    serialized_units: ["PROJECT_STATE.yaml updates", "git staging, commits, merges, pushes, and releases"],
    spawned_agents: [],
    focused_validators_run: [],
    full_suites_run: [],
  };
  writeState(orchestrationOverlap, orchestrationOverlapState);
  runFixture("parallel units with same file fail orchestration check", orchestrationOverlap, "check-parallel-orchestration.ts", 1, "orchestration.parallel_file_overlap");

  const orchestrationAgentGit = makeFixture("orchestration-agent-git");
  const orchestrationAgentGitState = readState(orchestrationAgentGit);
  orchestrationAgentGitState["orchestration"] = {
    preflight_done: true,
    strategy: "parallel_subagents",
    rationale: "A spawned worker is assigned an isolated patch.",
    integration_owner: "orchestrator",
    manager_pattern: true,
    file_overlap_checked: true,
    actual_file_collision_check: false,
    agent_outputs_reviewed: false,
    state_reconciled: false,
    candidate_units: [
      {
        id: "worker-doc",
        role: "worker",
        objective: "Patch one isolated doc.",
        mode: "edit",
        files: ["docs/worker.md"],
        shared_resources: [],
        parallel_safe: true,
        status: "pending",
      },
    ],
    parallel_safe_units: ["worker-doc"],
    serialized_units: ["PROJECT_STATE.yaml updates", "git staging, commits, merges, pushes, and releases"],
    spawned_agents: [
      {
        id: "agent-worker",
        role: "worker",
        objective: "Patch one isolated doc.",
        mode: "edit",
        status: "running",
        forbidden_actions: ["provider mutation"],
      },
    ],
    focused_validators_run: [],
    full_suites_run: [],
  };
  writeState(orchestrationAgentGit, orchestrationAgentGitState);
  runFixture(
    "spawned agent without git forbidden actions fails",
    orchestrationAgentGit,
    "check-parallel-orchestration.ts",
    1,
    "orchestration.spawned_agents.0.forbidden_actions.git_missing",
  );

  const orchestrationUnreviewed = makeFixture("orchestration-unreviewed");
  writeCompleteOrchestration(orchestrationUnreviewed);
  const orchestrationUnreviewedState = readState(orchestrationUnreviewed);
  expectRecord(orchestrationUnreviewedState["orchestration"], "orchestration")["agent_outputs_reviewed"] = false;
  expectRecord(orchestrationUnreviewedState["orchestration"], "orchestration")["actual_file_collision_check"] = false;
  writeState(orchestrationUnreviewed, orchestrationUnreviewedState);
  runFixture("done spawned-agent orchestration without review fails", orchestrationUnreviewed, "check-parallel-orchestration.ts", 1, "orchestration.done_without_agent_review");

  const orchestrationPermissivePrompt = makeFixture("orchestration-permissive-prompt");
  writeFileSync(
    path.join(orchestrationPermissivePrompt, "orchestration", "ORCHESTRATION.md"),
    [
      "# Orchestration",
      "Orchestration Preflight",
      "Strategy",
      "Candidate Units",
      "Parallel Safety Check",
      "File Ownership",
      "Serialized Work",
      "Subagent Instructions: subagents may stage and commit their changes after they finish.",
      "Integration Plan",
      "Verification",
      "Founder-Only Gates",
      "State Updates",
      "Failure Cards",
    ].join("\n"),
    "utf8",
  );
  runFixture("subagent git authority in prompt fails", orchestrationPermissivePrompt, "check-parallel-orchestration.ts", 1, "orchestration.subagent_git_authority");

  const sourceRegistryMissing = makeEmptyFixture("source-registry-missing-url");
  writeSourceRegistryFixture(sourceRegistryMissing, false);
  runFixture("unregistered external source fails source freshness", sourceRegistryMissing, "check-source-freshness.ts", 1, "source_freshness.url_unregistered");
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

const failed = results.filter((result) => !result.ok);
console.log("Validator fixture tests");
console.log(`${failed.length} failure(s), ${results.length - failed.length} passed`);
for (const result of results) {
  console.log(`${result.ok ? "PASS" : "FAIL"} ${result.label}`);
  if (!result.ok) {
    console.log(`  expected exit ${result.expectedCode}, got ${result.actualCode}`);
    if (result.expectedText) {
      console.log(`  expected text: ${result.expectedText}`);
    }
    console.log(result.output.trim());
  }
}

if (failed.length > 0) {
  process.exitCode = 1;
}

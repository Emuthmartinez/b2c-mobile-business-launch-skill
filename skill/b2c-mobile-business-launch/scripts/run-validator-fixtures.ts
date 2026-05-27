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
const tsxBin = path.join(skillRoot, "node_modules/.bin/tsx");
const tempRoot = mkdtempSync(path.join(tmpdir(), "b2c-validator-fixtures-"));
const results: FixtureResult[] = [];

function makeFixture(name: string): string {
  const fixtureRoot = path.join(tempRoot, name);
  cpSync(path.join(skillRoot, "templates"), fixtureRoot, { recursive: true });
  cpSync(path.join(skillRoot, "templates", "secrets", "SECRETS.md"), path.join(fixtureRoot, "SECRETS.md"));
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
      "Distribution certificate and provisioning profile are present.",
      "Archive, export, upload, and TestFlight proof are recorded.",
      "A simulator build alone is not distribution readiness.",
    ].join("\n"),
    "utf8",
  );
}

function writeCompleteStoreConsole(root: string): void {
  writeFileSync(
    path.join(root, "STORE_CONSOLE.md"),
    [
      "# Store Console",
      "App Store Connect click path covers app info, SKU, primary locale, bundle ID, App Privacy, pricing, RevenueCat, subscription setup, localization, custom product page strategy, In-App Event planning, Higgsfield-backed marketing assets, screenshots, review notes, and account deletion.",
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
      "Pricing, RevenueCat entitlement mapping, subscription setup, localization, custom product page strategy, In-App Event planning, and Higgsfield-backed marketing assets are ready for founder approval.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(root, "app-store-listing.html"), "<!doctype html><html><body>App Store listing packet</body></html>", "utf8");
  writeFileSync(path.join(root, "app-privacy-questionnaire.html"), "<!doctype html><html><body>App Privacy questionnaire</body></html>", "utf8");
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
      "Source Inputs: screenshots/raw/onboarding.png, DESIGN.md, content-assets/copy/hooks.json, owned or licensed media.",
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
            inputs: ["screenshots/raw/onboarding.png", "DESIGN.md", "content-assets/copy/hooks.json"],
            outputs: ["content-assets/out/vertical-hook-demo.mp4"],
            truth_constraints: ["real app UI remains visible", "no unsupported claims"],
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
  writeCompleteStoreConsole(clean);
  writeCompleteSecurity(clean);
  writeCompleteContentAssets(clean);
  runFixture("complete project state passes", clean, "validate-project-state.ts", 0);
  runFixture("complete attribution contract passes", clean, "check-attribution-contract.ts", 0);
  runFixture("clean secret routing passes", clean, "check-secret-routing.ts", 0);
  runFixture("complete security release packet passes", clean, "check-security-release.ts", 0);
  runFixture("complete content assets packet passes", clean, "check-content-assets.ts", 0);
  runFixture("complete Apple signing packet passes", clean, "check-apple-signing-packet.ts", 0);
  runFixture("complete store console packet passes", clean, "check-store-console-packet.ts", 0);
  runFixture("complete UX pattern packet passes", clean, "check-ux-patterns.ts", 0);
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
      "Apple Developer Team ID DEVELOPMENT_TEAM Bundle ID App ID App Store Connect App Record Creation Preflight certificate provisioning archive export upload TestFlight founder approval.",
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
      "App Record Creation Preflight requires founder approval.",
      "Distribution certificate and provisioning profile missing.",
      "Archive, export, upload, and TestFlight are not configured.",
    ].join("\n"),
    "utf8",
  );
  runFixture("Apple signing packet with unresolved distribution gates fails", appleMissingState, "check-apple-signing-packet.ts", 1, "apple_signing.unresolved_distribution_gate");

  const iosOnlyStore = makeFixture("store-ios-only");
  const iosOnlyStoreState = readState(iosOnlyStore);
  expectRecord(iosOnlyStoreState.project, "project")["platforms"] = ["ios"];
  expectRecord(expectRecord(iosOnlyStoreState.project, "project")["bundle_ids"], "project.bundle_ids")["android"] = "";
  writeState(iosOnlyStore, iosOnlyStoreState);
  writeFileSync(
    path.join(iosOnlyStore, "STORE_CONSOLE.md"),
    [
      "# Store Console",
      "App Store Connect click path covers app info, SKU, primary locale, bundle ID, App Privacy, pricing, RevenueCat, subscription setup, localization, custom product page strategy, In-App Event planning, Higgsfield-backed marketing assets, screenshots, review notes, and account deletion.",
      "If the app name is already in use, stop for founder approval before using any fallback name.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(iosOnlyStore, "store-console.html"), "<!doctype html><html><body>iOS store packet</body></html>", "utf8");
  writeFileSync(
    path.join(iosOnlyStore, "APP_STORE_LISTING.md"),
    [
      "# App Store Listing",
      "App Privacy, pricing, RevenueCat, subscription setup, localization, custom product page strategy, In-App Event planning, Higgsfield-backed marketing assets, and founder approval are documented.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(iosOnlyStore, "app-store-listing.html"), "<!doctype html><html><body>iOS listing packet</body></html>", "utf8");
  writeFileSync(path.join(iosOnlyStore, "app-privacy-questionnaire.html"), "<!doctype html><html><body>iOS privacy questionnaire</body></html>", "utf8");
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

  const phraseOnlyStore = makeFixture("store-phrase-only");
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

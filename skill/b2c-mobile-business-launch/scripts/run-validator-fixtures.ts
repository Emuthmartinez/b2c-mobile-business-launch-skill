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
      "App Store Connect click path covers app info, SKU, primary locale, bundle ID, privacy, screenshots, review notes, and account deletion.",
      "Google Play click path covers package name, Data safety, screenshots, review notes, privacy, and account deletion.",
      "If the app name is already in use, stop for founder approval before using any fallback name.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(root, "store-console.html"), "<!doctype html><html><body>Store console packet</body></html>", "utf8");
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
  runFixture("complete project state passes", clean, "validate-project-state.ts", 0);
  runFixture("complete attribution contract passes", clean, "check-attribution-contract.ts", 0);
  runFixture("clean secret routing passes", clean, "check-secret-routing.ts", 0);
  runFixture("complete Apple signing packet passes", clean, "check-apple-signing-packet.ts", 0);
  runFixture("complete store console packet passes", clean, "check-store-console-packet.ts", 0);
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
  runFixture("done attribution without implementation text fails", attributionMissingImplementation, "check-attribution-contract.ts", 1, "attribution.text.attribution_source_selected.not_found");

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
      "App Store Connect click path covers app info, SKU, primary locale, bundle ID, privacy, screenshots, review notes, and account deletion.",
      "If the app name is already in use, stop for founder approval before using any fallback name.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(path.join(iosOnlyStore, "store-console.html"), "<!doctype html><html><body>iOS store packet</body></html>", "utf8");
  runFixture("iOS-only store packet does not require Google Play fields", iosOnlyStore, "check-store-console-packet.ts", 0);

  const unsafeFallback = makeFixture("unsafe-store-fallback");
  writeCompleteStoreConsole(unsafeFallback);
  writeFileSync(
    path.join(unsafeFallback, "STORE_CONSOLE.md"),
    [
      "# Store Console",
      "App Store Connect click path covers app info, SKU, primary locale, bundle ID, privacy, screenshots, review notes, and account deletion.",
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

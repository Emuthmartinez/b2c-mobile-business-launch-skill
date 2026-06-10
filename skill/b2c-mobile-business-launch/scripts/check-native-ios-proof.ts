#!/usr/bin/env node
import { existsSync } from "node:fs";
import path from "node:path";
import { asArray, asString, getPath, issue, loadProjectState, parseCliArgs, readText, reportAndExit, type Issue } from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const loaded = loadProjectState(args);
const issues: Issue[] = [...loaded.issues];
const state = loaded.state;

const readiness = firstExistingText(["PRODUCTION_READINESS.md", "engineering/PRODUCTION_READINESS.md"]);
const screenshots = firstExistingText(["SCREENSHOTS.md", "screenshots/SCREENSHOTS.md", "app-store-listing/SCREENSHOTS.md"]);

const platforms = state
  ? asArray(getPath(state, "project.platforms"))
      .map((item) => asString(item)?.toLowerCase())
      .filter(Boolean)
  : [];
const iosBundleId = state ? asString(getPath(state, "project.bundle_ids.ios")) : undefined;
const hasIos = state ? platforms.includes("ios") || platforms.includes("ipados") || Boolean(iosBundleId?.trim()) : true;
const engineeringStatus = state ? asString(getPath(state, "lanes.engineering.status"))?.toLowerCase() : undefined;

if (hasIos && engineeringStatus === "done" && !readiness) {
  issues.push(
    issue(
      "error",
      "native_ios_proof.readiness_missing",
      "Done iOS engineering requires PRODUCTION_READINESS.md with native iOS proof.",
      "PRODUCTION_READINESS.md",
    ),
  );
}

if (hasIos && readiness && shouldValidateReadiness(readiness.text, engineeringStatus)) {
  validateReadiness(readiness.text, readiness.relativePath);
}

if (hasIos && screenshots && hasReadyClaim(screenshots.text)) {
  validateScreenshotCaptureRoute(screenshots.text, screenshots.relativePath);
}

reportAndExit("Native iOS proof check", issues);

function validateReadiness(text: string, file: string): void {
  requireAny(
    text,
    ["Native iOS Proof", "native iOS proof", "iOS proof", "Apple simulator/device proof"],
    "native_ios_proof.section_missing",
    "PRODUCTION_READINESS.md must include a native iOS proof section before iOS readiness claims.",
    file,
  );
  requireAny(
    text,
    ["Codex Desktop", "XcodeBuildMCP", "MobAI", "SnapshotPreviews", "serve-sim"],
    "native_ios_proof.route_missing",
    "Native iOS readiness must name the actual proof route: Codex Desktop/XcodeBuildMCP, MobAI, SnapshotPreviews, or serve-sim.",
    file,
  );
  requireAny(
    text,
    ["screenshot", "video", "UI snapshot", "test result", "xcresult", "snapshot-images", "logs"],
    "native_ios_proof.evidence_path_missing",
    "Native iOS proof must record tangible evidence paths such as screenshots, video, UI snapshots, logs, xcresults, or snapshot image outputs.",
    file,
  );
  requireAny(
    text,
    ["PROVIDER_PROOF.md", "backend/provider proof", "RevenueCat", "PostHog", "Stripe", "Resend", "Sentry"],
    "native_ios_proof.provider_pairing_missing",
    "Native iOS app proof must be paired with backend/provider proof when provider-backed behavior is in scope.",
    file,
  );
  requireAny(
    text,
    ["simulator build alone is not distribution readiness", "does not prove App Store signing", "not distribution readiness", "APPLE_SIGNING.md"],
    "native_ios_proof.distribution_limit_missing",
    "Native iOS proof must state that simulator/preview proof does not replace Apple signing, archive, upload, or distribution readiness.",
    file,
  );

  if (includesAny(text, ["Codex Desktop", "native iOS capabilities in Codex", "Codex native iOS"])) {
    requireAny(
      text,
      ["session_show_defaults"],
      "native_ios_proof.codex_desktop_session_defaults_missing",
      "Codex Desktop native iOS proof must record session_show_defaults before first build/run/test tool use.",
      file,
    );
    requireAny(
      text,
      ["build_run_sim", "test_sim", "screenshot", "UI snapshot", "logs"],
      "native_ios_proof.codex_desktop_tool_proof_missing",
      "Codex Desktop native iOS proof must record the exposed MCP tool route used for build/run/test/capture.",
      file,
    );
  }

  if (includesAny(text, ["XcodeBuildMCP", "xcodebuildmcp"])) {
    requireAny(
      text,
      ["session_show_defaults", "build_run_sim", "xcodebuildmcp --help", "xcodebuildmcp tools", "xcodebuildmcp simulator"],
      "native_ios_proof.xcodebuildmcp_route_missing",
      "XcodeBuildMCP proof must record either MCP tool names or live CLI help/tool discovery used for the run.",
      file,
    );
    requireAny(
      text,
      ["project", "workspace", "scheme"],
      "native_ios_proof.xcodebuildmcp_project_scheme_missing",
      "XcodeBuildMCP proof must record the project/workspace and scheme used.",
      file,
    );
    requireAny(
      text,
      ["simulator", "device", "UDID", "destination"],
      "native_ios_proof.xcodebuildmcp_target_missing",
      "XcodeBuildMCP proof must record the simulator/device target.",
      file,
    );
  }

  if (includesAny(text, ["SnapshotPreviews", "SnapshotTest", "PreviewLayoutTest"])) {
    requireAny(
      text,
      ["TEST_RUNNER_SNAPSHOTS_EXPORT_DIR", "snapshot-images", ".png", ".json"],
      "native_ios_proof.snapshot_previews_export_missing",
      "SnapshotPreviews proof must record exported PNG/JSON output, usually through TEST_RUNNER_SNAPSHOTS_EXPORT_DIR.",
      file,
    );
    requireAny(
      text,
      ["preview-only", "preview coverage", "does not replace runtime E2E", "not runtime E2E", "not real app E2E"],
      "native_ios_proof.snapshot_previews_limit_missing",
      "SnapshotPreviews proof must state that preview snapshots do not replace runtime E2E/device proof.",
      file,
    );
  }

  if (includesAny(text, ["serve-sim", "serve sim"])) {
    requireAny(
      text,
      ["localhost:3200", "--port", "port", "preview URL", "MJPEG", "WebSocket"],
      "native_ios_proof.serve_sim_url_missing",
      "serve-sim proof must record the preview URL/port or stream/control channel.",
      file,
    );
    requireAny(
      text,
      ["booted simulator", "booted iOS Simulator", "simctl", "device"],
      "native_ios_proof.serve_sim_booted_target_missing",
      "serve-sim proof must identify the booted simulator/device it streamed.",
      file,
    );
    requireAny(
      text,
      ["does not replace backend/provider proof", "does not replace App Store signing", "not distribution readiness", "not provider proof"],
      "native_ios_proof.serve_sim_limit_missing",
      "serve-sim proof must state that a simulator stream does not replace provider proof or App Store signing readiness.",
      file,
    );
  }
}

function validateScreenshotCaptureRoute(text: string, file: string): void {
  requireAny(
    text,
    ["MobAI", "Codex Desktop", "XcodeBuildMCP", "serve-sim", "on-device", "device capture", "real app capture"],
    "native_ios_proof.screenshot_capture_route_missing",
    "Ready iOS screenshot work must name the real app, simulator, or device capture route used for raw UI.",
    file,
  );
  if (includesAny(text, ["SnapshotPreviews", "SnapshotTest", "PreviewLayoutTest"])) {
    requireAny(
      text,
      ["preview-only", "preview/component proof", "does not replace runtime", "not runtime", "not raw real-app UI"],
      "native_ios_proof.screenshot_snapshot_previews_limit_missing",
      "Ready iOS screenshot work that mentions SnapshotPreviews must state that it is preview-only support proof, not raw real-app UI.",
      file,
    );
  }
}

function shouldValidateReadiness(text: string, laneStatus?: string): boolean {
  return laneStatus === "done" || hasReadyClaim(text) || includesAny(text, ["Native iOS Proof", "Codex Desktop", "SnapshotPreviews", "serve-sim"]);
}

function hasReadyClaim(text: string): boolean {
  if (!text.trim() || /Status:\s*partial until/i.test(text)) {
    return false;
  }
  return /\b(done|ready|production[- ]ready|launch[- ]ready|implementation proof|ce-work completed|upload-ready)\b/i.test(text);
}

function firstExistingText(candidates: string[]): { relativePath: string; text: string } | undefined {
  for (const candidate of candidates) {
    const fullPath = path.join(args.root, candidate);
    if (existsSync(fullPath)) {
      const text = readText(args.root, candidate);
      if (text !== undefined) {
        return { relativePath: candidate, text };
      }
    }
  }
  return undefined;
}

function requireAny(text: string, terms: string[], code: string, message: string, file: string): void {
  if (!includesAny(text, terms)) {
    issues.push(issue("error", code, message, file));
  }
}

function includesAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

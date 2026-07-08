#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { asString, getPath, isRecord, issue, loadProjectState, parseCliArgs, reportAndExit, type Issue } from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const loaded = loadProjectState(args);
const issues: Issue[] = [...loaded.issues];
const proofPath = path.join(args.root, "PROVIDER_PROOF.md");
const proofText = existsSync(proofPath) ? readFileSync(proofPath, "utf8") : "";

const proofRequiredLanes = ["analytics_attribution", "revenue", "email", "store_console", "apple_signing", "security", "engineering"];

/**
 * Providers whose Proof Ledger row must be grounded on disk once a mapped lane
 * is done. MobAI/Doppler rows are not mapped: engineering and secrets proof
 * have their own validators and legitimately route through non-MobAI tooling.
 */
const providerLaneMap: Array<{ provider: string; lanes: string[] }> = [
  { provider: "PostHog", lanes: ["analytics_attribution"] },
  { provider: "RevenueCat", lanes: ["revenue"] },
  { provider: "Resend", lanes: ["email"] },
  { provider: "App Store Connect", lanes: ["store_console", "apple_signing"] },
  { provider: "Sentry", lanes: ["security"] },
];

function laneStatus(lane: string): string | undefined {
  return loaded.state && isRecord(loaded.state) ? asString(getPath(loaded.state, `lanes.${lane}.status`)) : undefined;
}

/** Markdown table body rows as trimmed cell arrays (header and separator rows excluded). */
const ledgerRows: string[][] = proofText
  .split("\n")
  .filter((line) => line.trim().startsWith("|"))
  .map((line) =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim()),
  )
  .filter((cells) => cells.length >= 4 && !/^-+$/.test(cells[0] ?? "") && !/provider/i.test(cells[0] ?? ""));

let requiresProof = false;
if (loaded.state && isRecord(loaded.state)) {
  for (const lane of proofRequiredLanes) {
    if (laneStatus(lane) === "done") {
      requiresProof = true;
    }
  }
}

const readinessText = readOptional("PRODUCTION_READINESS.md");
if (readinessText && /\b(ready|done|verified|launch[- ]ready|production[- ]ready)\b/i.test(readinessText)) {
  requiresProof = true;
}

if (!proofText.trim()) {
  if (requiresProof) {
    issues.push(
      issue(
        "error",
        "provider_proof.file_missing",
        "Provider-backed readiness requires PROVIDER_PROOF.md with live evidence or explicit founder-only blockers.",
        "PROVIDER_PROOF.md",
      ),
    );
  }
} else {
  for (const keyword of [
    "PostHog",
    "RevenueCat",
    "Resend",
    "App Store Connect",
    "Sentry",
    "MobAI",
    "Doppler",
    "current status",
    "proof command",
    "evidence path",
    "founder-only",
  ]) {
    if (!proofText.toLowerCase().includes(keyword.toLowerCase())) {
      issues.push(issue("error", `provider_proof.${slug(keyword)}.missing`, `PROVIDER_PROOF.md must include ${keyword}.`, "PROVIDER_PROOF.md"));
    }
  }

  const claimsReady = /\b(verified|ready|launch[- ]ready|production[- ]ready|live proof complete)\b/i.test(proofText);
  const containsOpenBlocker = /\b(not verified|pending|todo|unknown|placeholder|blocked|founder-only blocker)\b/i.test(proofText);
  if (claimsReady && containsOpenBlocker) {
    issues.push(
      issue(
        "error",
        "provider_proof.ready_claim_with_blocker",
        "Do not claim provider proof is ready while unresolved placeholders, pending items, or founder-only blockers remain.",
        "PROVIDER_PROOF.md",
      ),
    );
  }

  // Ground the ledger in reality once a lane claims done: the provider's row
  // must exist, its status must read as captured evidence (not still-planned
  // work), and at least one path in its evidence-path cell must exist on disk.
  // Keyword presence alone cannot mark a provider-backed lane done.
  for (const mapping of providerLaneMap) {
    const doneLanes = mapping.lanes.filter((lane) => laneStatus(lane) === "done");
    if (doneLanes.length === 0) {
      continue;
    }
    const row = ledgerRows.find((cells) => cells[0]?.toLowerCase().includes(mapping.provider.toLowerCase()));
    if (!row) {
      issues.push(
        issue(
          "error",
          `provider_proof.${slug(mapping.provider)}.row_missing`,
          `lanes.${doneLanes[0]} is done but PROVIDER_PROOF.md has no ledger row for ${mapping.provider}.`,
          "PROVIDER_PROOF.md",
        ),
      );
      continue;
    }
    const statusCell = row[1] ?? "";
    if (/\b(needs|pending|todo|tbd|unknown|placeholder|planned)\b/i.test(statusCell)) {
      issues.push(
        issue(
          "error",
          `provider_proof.${slug(mapping.provider)}.status_unproven`,
          `lanes.${doneLanes[0]} is done but the ${mapping.provider} ledger status still reads as planned work ("${statusCell.trim()}"). Capture the live evidence or keep the lane partial/blocked.`,
          "PROVIDER_PROOF.md",
        ),
      );
    }
    const evidenceCell = row[3] ?? "";
    const evidencePaths = evidenceCell.match(/[A-Za-z0-9_@-]+(?:\/[A-Za-z0-9_.@-]+)*\.[A-Za-z0-9]+/g) ?? [];
    if (evidencePaths.length === 0) {
      issues.push(
        issue(
          "error",
          `provider_proof.${slug(mapping.provider)}.evidence_path_unrecorded`,
          `lanes.${doneLanes[0]} is done but the ${mapping.provider} evidence-path cell names no file path. Record the captured artifact's path.`,
          "PROVIDER_PROOF.md",
        ),
      );
    } else if (!evidencePaths.some((relative) => existsSync(path.join(args.root, relative)))) {
      issues.push(
        issue(
          "error",
          `provider_proof.${slug(mapping.provider)}.evidence_path_missing`,
          `lanes.${doneLanes[0]} is done but none of the ${mapping.provider} evidence paths exist on disk (${evidencePaths.join(", ")}). Run the live probe/capture so the artifact exists before marking the lane done.`,
          evidencePaths[0],
        ),
      );
    }
  }
}

reportAndExit("Live provider proof check", issues);

function readOptional(relativePath: string): string | undefined {
  const filePath = path.join(args.root, relativePath);
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : undefined;
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

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

let requiresProof = false;
if (loaded.state && isRecord(loaded.state)) {
  for (const lane of proofRequiredLanes) {
    if (asString(getPath(loaded.state, `lanes.${lane}.status`)) === "done") {
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

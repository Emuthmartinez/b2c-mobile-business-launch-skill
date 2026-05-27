#!/usr/bin/env node
import { existsSync } from "node:fs";
import path from "node:path";
import { issue, parseCliArgs, readText, reportAndExit } from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const issues = [];
const relative = "APPLE_SIGNING.md";
const filePath = path.join(args.root, relative);
const text = readText(args.root, relative);

if (!existsSync(filePath) || !text) {
  issues.push(issue("error", "apple_signing.missing", "APPLE_SIGNING.md is required before TestFlight/App Store readiness is claimed.", relative));
} else {
  const requiredPhrases = [
    "Apple Developer",
    "Team ID",
    "DEVELOPMENT_TEAM",
    "Bundle ID",
    "App ID",
    "App Store Connect",
    "App Record Creation Preflight",
    "certificate",
    "provisioning",
    "archive",
    "export",
    "upload",
    "TestFlight",
    "founder approval",
  ];

  for (const phrase of requiredPhrases) {
    if (!text.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(issue("error", `apple_signing.${phrase.replaceAll(" ", "_").toLowerCase()}.missing`, `APPLE_SIGNING.md should cover ${phrase}.`, relative));
    }
  }

  if (/simulator build (succeeded|passes|passed)/i.test(text) && !/simulator build alone is not|not release proof|distribution readiness/i.test(text)) {
    issues.push(issue("error", "apple_signing.simulator_only_risk", "If simulator build success is mentioned, the doc must explicitly state it is not distribution readiness.", relative));
  }
}

reportAndExit("Apple signing packet check", issues);


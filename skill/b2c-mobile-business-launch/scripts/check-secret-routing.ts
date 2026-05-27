#!/usr/bin/env node
import path from "node:path";
import {
  asArray,
  asString,
  collectAllFiles,
  collectFiles,
  getPath,
  issue,
  loadProjectState,
  parseCliArgs,
  readText,
  reportAndExit,
} from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const loaded = loadProjectState(args);
const issues = [...loaded.issues];
const state = loaded.state;
const secretsPath = "SECRETS.md";
const secretsText = readText(args.root, secretsPath);

if (!secretsText) {
  issues.push(issue("error", "secrets.doc_missing", "SECRETS.md is required when the launch uses API keys, tokens, webhooks, store credentials, CI secrets, or local env files.", secretsPath));
} else {
  for (const phrase of ["Doppler", "provider", "doppler run --", "CI", "production", "no raw secrets"]) {
    if (!secretsText.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(issue("warning", `secrets.${phrase.replaceAll(" ", "_").toLowerCase()}.missing`, `SECRETS.md should mention ${phrase}.`, secretsPath));
    }
  }
}

if (state) {
  const tools = getPath(state, "tools");
  if (tools && typeof tools === "object" && !Array.isArray(tools)) {
    for (const [toolName, value] of Object.entries(tools)) {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        continue;
      }
      const requiredSecrets = asArray((value as Record<string, unknown>).required_secrets).map((item) => asString(item)).filter((item): item is string => Boolean(item));
      for (const secretName of requiredSecrets) {
        if (/key|token|secret|password|private/i.test(secretName) && !/^[A-Z0-9_]+$/.test(secretName)) {
          issues.push(issue("error", `secrets.${toolName}.name_format`, `${secretName} should be a names-only env var, not a value or prose.`, "PROJECT_STATE.yaml"));
        }
      }
    }
  }
}

const forbiddenFilePatterns = [
  /^\.env$/,
  /^\.env\..*\.local$/,
  /^\.env\.local$/,
  /^service-account.*\.json$/i,
  /^.*serviceAccount.*\.json$/,
  /^.*\.p8$/,
  /^.*\.p12$/,
  /^.*\.mobileprovision$/,
  /^.*\.pem$/,
];

for (const file of collectAllFiles(args.root, 10000)) {
  const relative = path.relative(args.root, file);
  const basename = path.basename(file);
  if (forbiddenFilePatterns.some((pattern) => pattern.test(basename))) {
    issues.push(
      issue(
        "error",
        `secrets.forbidden_file.${basename}`,
        `${relative} should not be committed or treated as a launch artifact. Route secrets through Doppler or the approved provider.`,
        relative,
      ),
    );
  }
}

const secretLike = /(sk_live_[A-Za-z0-9]{12,}|rk_live_[A-Za-z0-9]{12,}|ghp_[A-Za-z0-9]{20,}|-----BEGIN (PRIVATE|RSA|EC) PRIVATE KEY-----)/;
for (const file of collectFiles(args.root, new Set([".md", ".yaml", ".yml", ".json", ".ts", ".tsx", ".js", ".jsx"]), 2000)) {
  const relative = path.relative(args.root, file);
  if (relative.includes("node_modules")) {
    continue;
  }
  const text = readText(args.root, relative);
  if (text && secretLike.test(text)) {
    issues.push(issue("error", "secrets.raw_secret_pattern", `Potential raw secret pattern found in ${relative}.`, relative));
  }
}

reportAndExit("Secret routing check", issues);

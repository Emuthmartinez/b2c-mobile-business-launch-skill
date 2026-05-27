#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { asArray, asString, isRecord, issue, reportAndExit } from "./lib/launch-state.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDir, "..");
const scenarioDir = path.resolve(scriptDir, "../evals/launchbench");
const issues = [];
const knownValidators = new Set([
  "validate-project-state",
  "check-attribution-contract",
  "check-apple-signing-packet",
  "check-store-console-packet",
  "check-secret-routing",
  "check-security-release",
  "check-content-assets",
  "check-ux-patterns",
  "check-autopilot-contract",
  "render-launch-cockpit",
]);

if (!existsSync(scenarioDir)) {
  issues.push(issue("error", "launchbench.scenario_dir_missing", `Scenario directory is missing: ${scenarioDir}`));
} else {
  const files = readdirSync(scenarioDir).filter((file) => file.endsWith(".yaml")).sort();
  if (files.length === 0) {
    issues.push(issue("error", "launchbench.no_scenarios", "No LaunchBench scenarios exist."));
  }

  for (const file of files) {
    const fullPath = path.join(scenarioDir, file);
    const parsed = parseYaml(readFileSync(fullPath, "utf8"));
    if (!isRecord(parsed)) {
      issues.push(issue("error", "launchbench.invalid_yaml", `${file} must parse to an object.`, fullPath));
      continue;
    }

    for (const field of ["id", "title", "prompt", "expected_guardrail"]) {
      if (!asString(parsed[field])?.trim()) {
        issues.push(issue("error", `launchbench.${file}.${field}.missing`, `${file} is missing ${field}.`, fullPath));
      }
    }

    const validators = asArray(parsed.validators).map((item) => asString(item)).filter((item): item is string => Boolean(item));
    if (validators.length === 0) {
      issues.push(issue("error", `launchbench.${file}.validators.missing`, `${file} must name at least one deterministic validator.`, fullPath));
    }
    for (const validator of validators) {
      if (!knownValidators.has(validator)) {
        issues.push(issue("error", `launchbench.${file}.validator.unknown`, `${validator} is not a known validator.`, fullPath));
      }
    }

    if (asArray(parsed.must_catch).length === 0) {
      issues.push(issue("error", `launchbench.${file}.must_catch.missing`, `${file} should list the failure facts the agent must catch.`, fullPath));
    }
    if (asArray(parsed.should_say).length === 0) {
      issues.push(issue("warning", `launchbench.${file}.should_say.missing`, `${file} should list the high-level response behavior expected from the agent.`, fullPath));
    }
  }
}

reportAndExit("LaunchBench scenario validation", issues);

if (issues.some((item) => item.severity === "error")) {
  process.exitCode = 1;
} else {
  const fixtureRunner = path.join(scriptDir, "run-validator-fixtures.ts");
  const tsxBin = path.join(skillRoot, "node_modules/.bin/tsx");
  const result = spawnSync(tsxBin, [fixtureRunner], { cwd: skillRoot, encoding: "utf8" });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  }
}

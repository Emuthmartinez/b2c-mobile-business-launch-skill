#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { issue, reportAndExit, type Issue } from "./lib/launch-state.js";

interface PackageJson {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface Args {
  repoRoot: string;
  skillRoot: string;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSkillRoot = path.resolve(scriptDir, "..");
const defaultRepoRoot = path.resolve(defaultSkillRoot, "../..");
const args = parseArgs(process.argv.slice(2));
const issues: Issue[] = [];

const rootPackage = readJson<PackageJson>(path.join(args.repoRoot, "package.json"), "root_package");
const runtimePackage = readJson<PackageJson>(path.join(args.skillRoot, "package.json"), "runtime_package");
const rootLock = readJson<Record<string, unknown>>(path.join(args.repoRoot, "package-lock.json"), "root_package_lock");
const runtimeLock = readJson<Record<string, unknown>>(path.join(args.skillRoot, "package-lock.json"), "runtime_package_lock");
const skillVersion = readJson<{ version?: string }>(path.join(args.skillRoot, "skill-version.json"), "skill_version");

if (rootPackage.value && runtimePackage.value && skillVersion.value) {
  const expectedVersion = skillVersion.value.version;
  for (const [label, pkg] of [
    ["root package.json", rootPackage.value],
    ["runtime package.json", runtimePackage.value],
  ] as const) {
    if (pkg.version !== expectedVersion) {
      issues.push(issue("error", `package_parity.${code(label)}.version_mismatch`, `${label} version ${pkg.version ?? "(missing)"} must match skill-version.json ${expectedVersion}.`, "package.json"));
    }
  }
}

checkLockVersion("root", rootPackage.value, rootLock.value, path.join(args.repoRoot, "package-lock.json"));
checkLockVersion("runtime", runtimePackage.value, runtimeLock.value, path.join(args.skillRoot, "package-lock.json"));

if (rootPackage.value && runtimePackage.value) {
  const rootScripts = rootPackage.value.scripts ?? {};
  const runtimeScripts = runtimePackage.value.scripts ?? {};
  for (const scriptName of requiredScriptNames(runtimeScripts)) {
    if (!rootScripts[scriptName]) {
      issues.push(issue("error", "package_parity.root_script_missing", `Root package.json must expose runtime script ${scriptName}.`, "package.json"));
    }
  }

  const runtimeAuditCommands = npmRunCommands(runtimeScripts.audit ?? "");
  const rootAuditCommands = npmRunCommands(rootScripts.audit ?? "");
  const rootCiCommands = npmRunCommands(rootScripts["audit:ci"] ?? "");
  for (const command of runtimeAuditCommands) {
    if (!rootAuditCommands.has(command)) {
      issues.push(issue("error", "package_parity.root_audit_missing_command", `Root audit must include npm run ${command} to match runtime audit coverage.`, "package.json"));
    }
    if (command !== "validate:skill" && !rootCiCommands.has(command)) {
      issues.push(issue("error", "package_parity.root_audit_ci_missing_command", `Root audit:ci must include npm run ${command} to match runtime audit coverage.`, "package.json"));
    }
  }

  const rootDevDeps = rootPackage.value.devDependencies ?? {};
  const runtimeDevDeps = runtimePackage.value.devDependencies ?? {};
  for (const [dep, version] of Object.entries(rootDevDeps)) {
    if (!runtimeDevDeps[dep]) {
      issues.push(issue("error", "package_parity.runtime_dependency_missing", `Runtime package.json is missing devDependency ${dep}, present in root package.json.`, "skill/b2c-mobile-business-launch/package.json"));
    } else if (runtimeDevDeps[dep] !== version) {
      issues.push(issue("warning", "package_parity.runtime_dependency_version_drift", `Runtime devDependency ${dep} (${runtimeDevDeps[dep]}) differs from root (${version}).`, "skill/b2c-mobile-business-launch/package.json"));
    }
  }
}

issues.push(...rootPackage.issues, ...runtimePackage.issues, ...rootLock.issues, ...runtimeLock.issues, ...skillVersion.issues);
reportAndExit("Package parity check", issues);

function parseArgs(argv: string[]): Args {
  let repoRoot = defaultRepoRoot;
  let skillRoot = defaultSkillRoot;
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];
    if (token === "--repo-root" && value) {
      repoRoot = path.resolve(expandHome(value));
      index += 1;
    } else if ((token === "--skill-root" || token === "--root") && value) {
      skillRoot = path.resolve(expandHome(value));
      index += 1;
    }
  }
  return { repoRoot, skillRoot };
}

function readJson<T>(filePath: string, label: string): { value?: T; issues: Issue[] } {
  if (!existsSync(filePath)) {
    return { issues: [issue("error", `package_parity.${label}.missing`, `${label} is missing at ${filePath}.`, filePath)] };
  }
  try {
    return { value: JSON.parse(readFileSync(filePath, "utf8")) as T, issues: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { issues: [issue("error", `package_parity.${label}.invalid_json`, `${label} is not valid JSON: ${message}`, filePath)] };
  }
}

function requiredScriptNames(runtimeScripts: Record<string, string>): string[] {
  return Object.keys(runtimeScripts)
    .filter((name) => name.startsWith("check:") || name.startsWith("validate:") || name.startsWith("render:") || ["test:validators", "launchbench", "audit:links"].includes(name))
    .sort();
}

function npmRunCommands(script: string): Set<string> {
  const commands = new Set<string>();
  for (const match of script.matchAll(/\bnpm\s+run\s+([^\s&]+)/g)) {
    commands.add(match[1] ?? "");
  }
  return commands;
}

function checkLockVersion(label: string, pkg?: PackageJson, lock?: Record<string, unknown>, filePath?: string): void {
  const packages = lock?.packages;
  const rootPackage = isRecord(packages) ? packages[""] : undefined;
  const lockVersion = isRecord(rootPackage) && typeof rootPackage.version === "string" ? rootPackage.version : undefined;
  if (pkg?.version && lockVersion !== pkg.version) {
    issues.push(issue("error", `package_parity.${label}_lock_version_mismatch`, `${label} package-lock root version ${lockVersion ?? "(missing)"} must match package.json ${pkg.version}.`, filePath));
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function code(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function expandHome(value: string): string {
  if (value === "~") {
    return process.env.HOME ?? value;
  }
  if (value.startsWith("~/")) {
    return path.join(process.env.HOME ?? "", value.slice(2));
  }
  return value;
}

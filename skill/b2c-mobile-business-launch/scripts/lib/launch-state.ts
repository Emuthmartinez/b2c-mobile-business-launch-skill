import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export type Severity = "error" | "warning";

export interface Issue {
  severity: Severity;
  code: string;
  message: string;
  file?: string;
}

export interface CliArgs {
  root: string;
  statePath: string;
  outputPath?: string;
}

export const statusValues = new Set(["done", "partial", "blocked", "not_needed", "deferred"]);

export const autonomyModes = new Set(["scout", "draft", "prepare", "apply", "mutate", "ship"]);

export const requiredLanes = [
  "paid_tool_routing",
  "secrets",
  "security",
  "research",
  "traceability",
  "experience",
  "product",
  "design",
  "emotional_design",
  "content_assets",
  "analytics_attribution",
  "paid_user_acquisition",
  "onboarding",
  "revenue",
  "store_console",
  "apple_signing",
  "privacy_legal",
  "email",
  "orchestration",
  "engineering",
  "growth",
];

const ignoredDirs = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "DerivedData",
  ".expo",
  ".turbo",
  "coverage",
]);

export function parseCliArgs(argv: string[]): CliArgs {
  let root = process.cwd();
  let statePath = "PROJECT_STATE.yaml";
  let outputPath: string | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];
    if (token === "--root" && value) {
      root = path.resolve(value);
      index += 1;
    } else if (token === "--state" && value) {
      statePath = value;
      index += 1;
    } else if ((token === "--out" || token === "--output") && value) {
      outputPath = value;
      index += 1;
    }
  }

  return {
    root,
    statePath: path.isAbsolute(statePath) ? statePath : path.join(root, statePath),
    outputPath: outputPath ? (path.isAbsolute(outputPath) ? outputPath : path.join(root, outputPath)) : undefined,
  };
}

export function issue(severity: Severity, code: string, message: string, file?: string): Issue {
  return { severity, code, message, file };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function getPath(value: unknown, dottedPath: string): unknown {
  return dottedPath.split(".").reduce<unknown>((current, segment) => {
    if (!isRecord(current)) {
      return undefined;
    }
    return current[segment];
  }, value);
}

export function readText(root: string, relativePath: string): string | undefined {
  const filePath = path.join(root, relativePath);
  if (!existsSync(filePath)) {
    return undefined;
  }
  return readFileSync(filePath, "utf8");
}

export function loadProjectState(args: CliArgs): { state?: unknown; raw?: string; issues: Issue[] } {
  if (!existsSync(args.statePath)) {
    return {
      issues: [
        issue(
          "error",
          "project_state.missing",
          "PROJECT_STATE.yaml is missing. Copy templates/PROJECT_STATE.yaml and update it before claiming launch readiness.",
          path.relative(args.root, args.statePath),
        ),
      ],
    };
  }

  const raw = readFileSync(args.statePath, "utf8");
  try {
    return { state: parseYaml(raw), raw, issues: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      raw,
      issues: [
        issue("error", "project_state.invalid_yaml", `PROJECT_STATE.yaml is not valid YAML: ${message}`, path.relative(args.root, args.statePath)),
      ],
    };
  }
}

export function requireString(state: unknown, dottedPath: string, issues: Issue[]): void {
  const value = getPath(state, dottedPath);
  if (!asString(value)?.trim()) {
    issues.push(issue("error", `${dottedPath}.missing`, `${dottedPath} must be a non-empty string.`, "PROJECT_STATE.yaml"));
  }
}

export function requireStatus(state: unknown, dottedPath: string, issues: Issue[]): void {
  const value = asString(getPath(state, dottedPath));
  if (!value || !statusValues.has(value)) {
    issues.push(
      issue(
        "error",
        `${dottedPath}.invalid_status`,
        `${dottedPath} must be one of ${Array.from(statusValues).join(", ")}.`,
        "PROJECT_STATE.yaml",
      ),
    );
  }
}

export function requireBoolean(state: unknown, dottedPath: string, issues: Issue[]): void {
  if (asBoolean(getPath(state, dottedPath)) === undefined) {
    issues.push(issue("error", `${dottedPath}.missing_boolean`, `${dottedPath} must be true or false.`, "PROJECT_STATE.yaml"));
  }
}

export function collectFiles(root: string, extensions: Set<string>, maxFiles = 5000): string[] {
  const files: string[] = [];

  function visit(directory: string): void {
    if (files.length >= maxFiles) {
      return;
    }
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (ignoredDirs.has(entry.name)) {
        continue;
      }
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile() && extensions.has(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  }

  if (existsSync(root) && statSync(root).isDirectory()) {
    visit(root);
  }

  return files;
}

export function collectAllFiles(root: string, maxFiles = 10000): string[] {
  const files: string[] = [];

  function visit(directory: string): void {
    if (files.length >= maxFiles) {
      return;
    }
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (ignoredDirs.has(entry.name)) {
        continue;
      }
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  if (existsSync(root) && statSync(root).isDirectory()) {
    visit(root);
  }

  return files;
}

export function findText(root: string, needles: string[], extensions = new Set([".md", ".ts", ".tsx", ".js", ".jsx", ".swift", ".kt", ".java", ".dart", ".yaml", ".yml", ".html"])): Map<string, string[]> {
  const found = new Map<string, string[]>();
  for (const file of collectFiles(root, extensions)) {
    const text = readFileSync(file, "utf8");
    for (const needle of needles) {
      if (text.includes(needle)) {
        const relative = path.relative(root, file);
        const matches = found.get(needle) ?? [];
        matches.push(relative);
        found.set(needle, matches);
      }
    }
  }
  return found;
}

export function reportAndExit(title: string, issues: Issue[]): void {
  const errors = issues.filter((item) => item.severity === "error");
  const warnings = issues.filter((item) => item.severity === "warning");

  console.log(title);
  console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);

  for (const item of issues) {
    const where = item.file ? ` [${item.file}]` : "";
    console.log(`- ${item.severity.toUpperCase()} ${item.code}${where}: ${item.message}`);
  }

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

export function writeText(filePath: string, contents: string): void {
  writeFileSync(filePath, contents, "utf8");
}

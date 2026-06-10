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

export const statusValues = new Set(["done", "partial", "blocked", "not_needed", "deferred", "not_started"]);

/**
 * Phase ordering used for phase-gated coverage checks.
 * A project is "past orient" once it claims a phase at or beyond phase_1.
 * During phase_0, phase_0a, phase_0b, and phase_0c, lanes may be not_started
 * because scaffolding is still happening.  From phase_1 onward every required
 * lane must show at least some intentional state.
 *
 * The ordering mirrors launch-phases.md.  Phases not listed here fall into the
 * "orient" bucket (i.e. no coverage enforcement yet).
 */
export const phaseOrder: string[] = [
  "phase_0_orient",
  "phase_0a",
  "phase_0b",
  "phase_0c",
  "phase_1",
  "phase_1b",
  "phase_1c",
  "phase_1d",
  "phase_1e",
  "phase_1f",
  "phase_1g",
  "phase_2",
  "phase_3",
  "phase_3b",
  "phase_4",
  "phase_5",
  "phase_5b",
  "phase_5c",
  "phase_6",
];

/** Index in phaseOrder at which the orient/scaffold window ends. */
export const PHASE_ORIENT_LAST_INDEX = 3; // phase_0c is the last "orient" phase

/**
 * Returns true when the project is past the orient/scaffold phase window and
 * coverage enforcement for not_started lanes should be active.
 */
export function isPastOrientPhase(phase: string): boolean {
  const idx = phaseOrder.indexOf(phase.toLowerCase().trim());
  // Unknown phase strings are treated conservatively as "past orient" so they
  // do not silently exempt a project from coverage checks.
  if (idx === -1) {
    return true;
  }
  return idx > PHASE_ORIENT_LAST_INDEX;
}

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

const ignoredDirs = new Set([".git", "node_modules", ".next", "dist", "build", "DerivedData", ".expo", ".turbo", "coverage"]);

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

/** Expands a leading `~`/`~/` to $HOME, mirroring shell behavior for CLI path flags. */
export function expandHome(value: string): string {
  if (value === "~") {
    return process.env.HOME ?? value;
  }
  if (value.startsWith("~/")) {
    return path.join(process.env.HOME ?? "", value.slice(2));
  }
  return value;
}

export type FlagValue = string | number | boolean;

export interface FlagSpec {
  /** Flag aliases that set this key, e.g. ["--skill-root", "--root"]. */
  flags: string[];
  /** Key in the returned record. */
  key: string;
  /**
   * - "path" (default): consumes a value, expands `~`, resolves to an absolute path.
   * - "string": consumes a raw value.
   * - "number": consumes a value via Number().
   * - "boolean": consumes no value; presence sets true.
   */
  kind?: "path" | "string" | "number" | "boolean";
  /** When true, a matched flag without a value throws instead of being skipped. */
  strict?: boolean;
}

/**
 * Shared token/value CLI flag parser used by the validator scripts.
 * Last occurrence wins; unknown tokens are ignored (callers pass positional
 * arguments through their own handling when needed).
 */
export function parseFlags(argv: string[], specs: FlagSpec[]): Partial<Record<string, FlagValue>> {
  const byFlag = new Map<string, FlagSpec>();
  for (const spec of specs) {
    for (const flag of spec.flags) {
      byFlag.set(flag, spec);
    }
  }

  const out: Partial<Record<string, FlagValue>> = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === undefined) {
      continue;
    }
    const spec = byFlag.get(token);
    if (!spec) {
      continue;
    }
    if (spec.kind === "boolean") {
      out[spec.key] = true;
      continue;
    }
    const value = argv[index + 1];
    if (value === undefined || value === "") {
      if (spec.strict) {
        throw new Error(`${token} requires a value`);
      }
      continue;
    }
    index += 1;
    if (spec.kind === "number") {
      out[spec.key] = Number(value);
    } else if (spec.kind === "string") {
      out[spec.key] = value;
    } else {
      out[spec.key] = path.resolve(expandHome(value));
    }
  }
  return out;
}

export function flagString(flags: Partial<Record<string, FlagValue>>, key: string): string | undefined {
  const value = flags[key];
  return typeof value === "string" ? value : undefined;
}

export function flagNumber(flags: Partial<Record<string, FlagValue>>, key: string): number | undefined {
  const value = flags[key];
  return typeof value === "number" ? value : undefined;
}

export function flagBoolean(flags: Partial<Record<string, FlagValue>>, key: string): boolean {
  return flags[key] === true;
}

/** Case-insensitive substring check shared by phrase-gated validators. */
export function normalizedIncludes(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

/** Stable issue-code suffix for a missing phrase, shared by phrase-gated validators. */
export function missingPhraseCode(prefix: string, phrase: string): string {
  return `${prefix}.${phrase
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")}.missing`;
}

/** Trimmed non-empty strings from an unknown array value. */
export function normalizedStringArray(value: unknown): string[] {
  return asArray(value)
    .map((item) => asString(item))
    .filter((item): item is string => Boolean(item?.trim()))
    .map((item) => item.trim());
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
      issues: [issue("error", "project_state.invalid_yaml", `PROJECT_STATE.yaml is not valid YAML: ${message}`, path.relative(args.root, args.statePath))],
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
    issues.push(issue("error", `${dottedPath}.invalid_status`, `${dottedPath} must be one of ${Array.from(statusValues).join(", ")}.`, "PROJECT_STATE.yaml"));
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

export function findText(
  root: string,
  needles: string[],
  extensions = new Set([".md", ".ts", ".tsx", ".js", ".jsx", ".swift", ".kt", ".java", ".dart", ".yaml", ".yml", ".html"]),
): Map<string, string[]> {
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

// ---------------------------------------------------------------------------
// Tier-1 anti-gaming helpers
// ---------------------------------------------------------------------------

/**
 * Minimum byte length for a reason/rationale string to be considered non-trivial.
 * A bare one-word reason like "skip" or "later" or "N/A" is insufficient signal.
 */
export const REASON_MIN_LENGTH = 20;

/**
 * Maximum age in days for a stall/skip reason date before it is flagged stale.
 * A reason dated more than STALL_STALE_DAYS before today means the stall has
 * been sitting untouched for at least that long.
 */
export const STALL_STALE_DAYS = 60;

/**
 * Returns the first ISO YYYY-MM-DD date string found inside `text`, or
 * undefined if none is present.
 *
 * Matches the plain date form (2024-01-15) and the datetime prefix form
 * (2024-01-15T...).  Only the YYYY-MM-DD portion is returned.
 */
export function extractIsoDate(text: string): string | undefined {
  const match = /\b(\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]))\b/.exec(text);
  return match?.[1];
}

/**
 * Returns true when `text` contains a parseable ISO date AND the text's length
 * meets the non-trivial threshold.
 *
 * This guards against trivially gaming the date check with an appended "2099-01-01"
 * on a one-word reason.
 */
export function hasIsoDate(text: string): boolean {
  return extractIsoDate(text) !== undefined;
}

/**
 * Returns true when `text` meets the minimum non-trivial length threshold.
 */
export function isReasonSubstantive(text: string): boolean {
  return text.trim().length >= REASON_MIN_LENGTH;
}

/**
 * Returns true if the ISO date found inside `text` is more than STALL_STALE_DAYS
 * before the supplied `asOf` date (defaults to today).
 *
 * Returns false when no date is found (caller decides how to handle that
 * separately via hasIsoDate).
 */
export function isReasonStale(text: string, asOf: Date = new Date()): boolean {
  const dateStr = extractIsoDate(text);
  if (!dateStr) {
    return false;
  }
  const reasonDate = new Date(dateStr + "T00:00:00Z");
  const msPerDay = 1000 * 60 * 60 * 24;
  const ageInDays = (asOf.getTime() - reasonDate.getTime()) / msPerDay;
  return ageInDays > STALL_STALE_DAYS;
}

/**
 * Validate a reason/rationale string and push appropriate issues.
 *
 * - If the string is missing or below the trivial threshold → WARN reason_undated_or_trivial
 * - If the string passes the length check but has no ISO date → WARN reason_undated_or_trivial
 * - If the string has a parseable date that is more than STALL_STALE_DAYS old → WARN stall_reason_stale
 *
 * @param reason   The reason/rationale string to validate (may be undefined).
 * @param lanePath Dotted lane path for issue code prefixes (e.g. "lanes.revenue").
 * @param context  A short phrase for the human-readable message (e.g. "partial stall" or "deferred").
 * @param issues   Mutable array to push warnings into.
 */
export function validateReason(reason: string | undefined, lanePath: string, context: string, issues: Issue[]): void {
  if (!reason || !isReasonSubstantive(reason)) {
    issues.push(
      issue(
        "warning",
        `${lanePath}.reason_undated_or_trivial`,
        `${lanePath} ${context} reason is missing, too short (< ${REASON_MIN_LENGTH} chars), or lacks an ISO date (YYYY-MM-DD). ` +
          `Record a dated rationale so future passes can verify the stall is intentional and not stale.`,
        "PROJECT_STATE.yaml",
      ),
    );
    return;
  }
  if (!hasIsoDate(reason)) {
    issues.push(
      issue(
        "warning",
        `${lanePath}.reason_undated_or_trivial`,
        `${lanePath} ${context} reason does not contain an ISO date (YYYY-MM-DD). ` +
          `Add the date the stall/skip was recorded so a future pass can detect if it has gone stale.`,
        "PROJECT_STATE.yaml",
      ),
    );
    return;
  }
  if (isReasonStale(reason)) {
    issues.push(
      issue(
        "warning",
        `${lanePath}.stall_reason_stale`,
        `${lanePath} ${context} reason is dated more than ${STALL_STALE_DAYS} days ago. ` + `Revisit and update the rationale or advance the lane status.`,
        "PROJECT_STATE.yaml",
      ),
    );
  }
}

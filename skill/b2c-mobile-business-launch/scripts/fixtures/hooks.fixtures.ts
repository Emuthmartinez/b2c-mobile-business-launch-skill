/**
 * Executes the shipped Claude Code hooks from
 * templates/repo-agent-entrypoints/settings.json with sample tool payloads.
 * These hooks are the enforcement layer copied into generated business repos;
 * before this module nothing tested them, and their documented failure modes
 * (missing jq, missing SKILL_ROOT) used to be silent. Asserts:
 *   - the blocking final-PNG gates fire (exit 1) with and without SKILL_ROOT
 *   - benign payloads pass through (exit 0)
 *   - missing SKILL_ROOT and missing jq warn loudly instead of no-opping
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { skillRoot, type Harness } from "./_harness.js";

interface HookSettings {
  hooks: { PostToolUse: Array<{ matcher: string; hooks: Array<{ command: string }> }> };
}

function loadHookCommands(): { writeEditDepth: string; bashHook: string; finalPng: string } {
  const settingsPath = path.join(skillRoot, "templates", "repo-agent-entrypoints", "settings.json");
  const parsed = JSON.parse(readFileSync(settingsPath, "utf8")) as HookSettings;
  const postToolUse = parsed.hooks.PostToolUse;
  const command = (index: number): string => {
    const entry = postToolUse[index]?.hooks[0]?.command;
    if (!entry) {
      throw new Error(`settings.json PostToolUse[${index}] hook command is missing.`);
    }
    return entry;
  };
  return { writeEditDepth: command(0), bashHook: command(1), finalPng: command(2) };
}

function runHook(
  harness: Harness,
  label: string,
  command: string,
  toolInput: Record<string, unknown>,
  expectedCode: number,
  expectedText: string | undefined,
  cwd: string,
  env: Record<string, string | undefined>,
): void {
  const result = spawnSync("/bin/bash", ["-c", command], {
    cwd,
    encoding: "utf8",
    env: { ...env, CLAUDE_TOOL_INPUT: JSON.stringify(toolInput) } as NodeJS.ProcessEnv,
  });
  const output = `${result.stdout}\n${result.stderr}`;
  harness.results.push({
    label,
    ok: result.status === expectedCode && (!expectedText || output.includes(expectedText)),
    expectedCode,
    actualCode: result.status,
    expectedText,
    output,
  });
}

export function register(harness: Harness): void {
  const commands = loadHookCommands();
  // A cwd without scripts/run-audit.ts, so the SKILL_ROOT local-dev sentinel does not apply.
  const businessRepo = harness.makeEmptyFixture("hooks-business-repo");
  const baseEnv: Record<string, string | undefined> = { ...process.env, SKILL_ROOT: undefined };

  runHook(
    harness,
    "hook final-PNG Write blocks with grading-pass instructions",
    commands.finalPng,
    { file_path: "screenshots/final/hero.png" },
    1,
    "SEPARATE GRADING PASS",
    businessRepo,
    baseEnv,
  );

  runHook(harness, "hook final-PNG Write ignores benign file paths", commands.finalPng, { file_path: "src/App.tsx" }, 0, undefined, businessRepo, baseEnv);

  runHook(
    harness,
    "hook Bash cp into screenshots/final blocks without SKILL_ROOT",
    commands.bashHook,
    { command: "cp /tmp/raw.png screenshots/final/hero.png" },
    1,
    "SEPARATE GRADING PASS",
    businessRepo,
    baseEnv,
  );

  runHook(
    harness,
    "hook depth-check warns loudly when SKILL_ROOT is unset",
    commands.writeEditDepth,
    { file_path: "docs/ANALYTICS.md" },
    0,
    "SKILL_ROOT is not set",
    businessRepo,
    baseEnv,
  );

  runHook(
    harness,
    "hook Bash benign command warns loudly when SKILL_ROOT is unset",
    commands.bashHook,
    { command: "ls -la" },
    0,
    "SKILL_ROOT is not set",
    businessRepo,
    baseEnv,
  );

  // PATH without jq: the guard must warn and exit 0 instead of silently no-opping.
  runHook(
    harness,
    "hook depth-check warns loudly when jq is missing",
    commands.writeEditDepth,
    { file_path: "docs/ANALYTICS.md" },
    0,
    "jq is not on PATH",
    businessRepo,
    { ...baseEnv, PATH: "/nonexistent-bin" },
  );
}

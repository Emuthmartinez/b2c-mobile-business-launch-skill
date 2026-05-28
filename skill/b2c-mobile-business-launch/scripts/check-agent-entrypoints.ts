#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type Issue, issue, reportAndExit } from "./lib/launch-state.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSkillRoot = path.resolve(scriptDir, "..");

function parseArgs(argv: string[]): { skillRoot: string; repoRoot?: string } {
  let skillRoot = defaultSkillRoot;
  let repoRoot: string | undefined;
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];
    if ((token === "--skill-root" || token === "--root") && value) {
      skillRoot = path.resolve(value);
      index += 1;
    } else if (token === "--repo-root" && value) {
      repoRoot = path.resolve(value);
      index += 1;
    }
  }
  return { skillRoot, repoRoot };
}

function readIfExists(filePath: string): string | undefined {
  if (!existsSync(filePath)) {
    return undefined;
  }
  return readFileSync(filePath, "utf8");
}

function requireFile(filePath: string, label: string, issues: Issue[]): string | undefined {
  const text = readIfExists(filePath);
  if (text === undefined) {
    issues.push(issue("error", `agent_entrypoints.${label}.missing`, `${label} is missing.`, filePath));
  }
  return text;
}

function requireTerms(text: string, terms: string[], label: string, filePath: string, issues: Issue[]): void {
  for (const term of terms) {
    if (!text.includes(term)) {
      issues.push(issue("error", `agent_entrypoints.${label}.term_missing`, `${label} should include: ${term}`, filePath));
    }
  }
}

function rejectTerms(text: string, terms: string[], label: string, filePath: string, issues: Issue[]): void {
  for (const term of terms) {
    if (text.includes(term)) {
      issues.push(issue("error", `agent_entrypoints.${label}.maintainer_leak`, `${label} should not include skill-maintainer-only text: ${term}`, filePath));
    }
  }
}

const { skillRoot, repoRoot } = parseArgs(process.argv.slice(2));
const issues: Issue[] = [];

const templateRoot = path.join(skillRoot, "templates", "repo-agent-entrypoints");
const templateAgentsPath = path.join(templateRoot, "AGENTS.md");
const templateClaudePath = path.join(templateRoot, "CLAUDE.md");
const templateAgents = requireFile(templateAgentsPath, "template_agents", issues);
const templateClaude = requireFile(templateClaudePath, "template_claude", issues);

if (templateAgents) {
  requireTerms(
    templateAgents,
    [
      "{{APP_NAME}}",
      "{{BUSINESS_NAME}}",
      "{{PRODUCT_BRIEF}}",
      "{{STACK_SUMMARY}}",
      "b2c-mobile-business-launch",
      "do not ask the founder to re-invoke it",
      "PROJECT_STATE.yaml",
      "launch-cockpit.html",
      "APP_AGENTS.md",
      "ORCHESTRATION.md",
      "PRODUCTION_READINESS.md",
      "SECRETS.md",
      "SECURITY.md",
      "LaunchBench",
      "founder-only",
      "Doppler",
      "Compound Engineering",
      "MobAI",
      "RevenueCat",
      "PostHog",
    ],
    "template_agents",
    templateAgentsPath,
    issues,
  );
  rejectTerms(
    templateAgents,
    ["This repo maintains the `b2c-mobile-business-launch` skill", "runtime sync", "npm pack --dry-run"],
    "template_agents",
    templateAgentsPath,
    issues,
  );
}

if (templateClaude) {
  requireTerms(
    templateClaude,
    [
      "{{APP_NAME}}",
      "Read `AGENTS.md` first",
      "b2c-mobile-business-launch",
      "Do not ask the founder to say \"use the skill\" again",
      "APP_AGENTS.md",
      "ORCHESTRATION.md",
    ],
    "template_claude",
    templateClaudePath,
    issues,
  );
  rejectTerms(
    templateClaude,
    ["This repo maintains the `b2c-mobile-business-launch` skill", "runtime sync", "npm pack --dry-run"],
    "template_claude",
    templateClaudePath,
    issues,
  );
}

if (repoRoot) {
  const repoAgentsPath = path.join(repoRoot, "AGENTS.md");
  const repoClaudePath = path.join(repoRoot, "CLAUDE.md");
  const repoAgents = requireFile(repoAgentsPath, "repo_agents", issues);
  const repoClaude = requireFile(repoClaudePath, "repo_claude", issues);

  if (repoAgents) {
    requireTerms(
      repoAgents,
      [
        "This file is for maintaining this skill repo itself",
        "Do not copy these instructions into a launched business or generated app repo",
        "templates/repo-agent-entrypoints",
        "Runtime Sync",
        "Source Freshness",
      ],
      "repo_agents",
      repoAgentsPath,
      issues,
    );
  }

  if (repoClaude) {
    requireTerms(
      repoClaude,
      [
        "maintainer-only",
        "Do not copy it into businesses created by the skill",
        "templates/repo-agent-entrypoints/CLAUDE.md",
      ],
      "repo_claude",
      repoClaudePath,
      issues,
    );
  }
}

reportAndExit("Agent entrypoint template check", issues);

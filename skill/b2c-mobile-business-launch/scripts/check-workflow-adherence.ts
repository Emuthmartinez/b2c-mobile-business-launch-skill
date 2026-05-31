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

function readRequired(filePath: string, label: string, issues: Issue[]): string {
  if (!existsSync(filePath)) {
    issues.push(issue("error", `workflow.${label}.missing`, `${label} is missing.`, filePath));
    return "";
  }
  return readFileSync(filePath, "utf8");
}

function requireTerms(text: string, terms: string[], label: string, filePath: string, issues: Issue[]): void {
  for (const term of terms) {
    if (!text.includes(term)) {
      issues.push(issue("error", `workflow.${label}.term_missing`, `${label} should include: ${term}`, filePath));
    }
  }
}

function warnIfTooLong(text: string, maxLines: number, label: string, filePath: string, issues: Issue[]): void {
  const lineCount = text.trimEnd().split("\n").length;
  if (lineCount > maxLines) {
    issues.push(issue("warning", `workflow.${label}.too_long`, `${label} is ${lineCount} lines; keep AGENTS-style files concise and map-like.`, filePath));
  }
}

const { skillRoot, repoRoot } = parseArgs(process.argv.slice(2));
const issues: Issue[] = [];

const parallelPath = path.join(skillRoot, "references", "parallel-agent-orchestration.md");
const engineeringPath = path.join(skillRoot, "references", "engineering-orchestration.md");
const toolRecipesPath = path.join(skillRoot, "references", "tool-recipes.md");
const compoundEngineeringPath = path.join(skillRoot, "references", "compound-engineering-routing.md");
const templateAgentsPath = path.join(skillRoot, "templates", "repo-agent-entrypoints", "AGENTS.md");
const templateClaudePath = path.join(skillRoot, "templates", "repo-agent-entrypoints", "CLAUDE.md");
const orchestrationTemplatePath = path.join(skillRoot, "templates", "orchestration", "ORCHESTRATION.md");
const projectStateTemplatePath = path.join(skillRoot, "templates", "PROJECT_STATE.yaml");
const launchbenchDir = path.join(skillRoot, "evals", "launchbench");

const parallel = readRequired(parallelPath, "parallel_agent_reference", issues);
const engineering = readRequired(engineeringPath, "engineering_orchestration_reference", issues);
const toolRecipes = readRequired(toolRecipesPath, "tool_recipes_reference", issues);
const compoundEngineering = readRequired(compoundEngineeringPath, "compound_engineering_reference", issues);
const templateAgents = readRequired(templateAgentsPath, "business_agents_template", issues);
const templateClaude = readRequired(templateClaudePath, "business_claude_template", issues);
const orchestrationTemplate = readRequired(orchestrationTemplatePath, "orchestration_template", issues);
const projectStateTemplate = readRequired(projectStateTemplatePath, "project_state_template", issues);

requireTerms(
  parallel,
  [
    "OpenAI harness engineering",
    "subagents_unavailable",
    "Default for broad B2C launch work is `hybrid`",
    "Do not silently run broad multi-lane work fully inline",
    "mechanical checks or LaunchBench scenarios",
  ],
  "parallel_agent_reference",
  parallelPath,
  issues,
);

requireTerms(
  engineering,
  [
    "Load `compound-engineering-routing.md` first",
    "If Compound Engineering skills are unavailable",
    "do not silently skip them",
    "ce-brainstorm",
    "ce-plan",
    "ce-work",
    "ce-worktree",
    "dispatch read-only or isolated specialist audits",
  ],
  "engineering_orchestration_reference",
  engineeringPath,
  issues,
);

requireTerms(
  compoundEngineering,
  [
    "Required Loop",
    "ce-update",
    "ce-plan",
    "ce-work",
    "ce-code-review",
    "ce-proof",
    "https://github.com/EveryInc/compound-engineering-plugin/releases",
    "compound_engineering:",
  ],
  "compound_engineering_reference",
  compoundEngineeringPath,
  issues,
);

requireTerms(
  toolRecipes,
  [
    "Load `compound-engineering-routing.md` before core engineering",
    "CE availability, latest-version check, skills considered",
    "If Compound Engineering is unavailable",
    "do not let agents skip directly from docs to readiness",
    "active plans, validators, and failure cards",
  ],
  "tool_recipes_reference",
  toolRecipesPath,
  issues,
);

requireTerms(
  templateAgents,
  [
    "This file is a map, not a product spec",
    "mechanical enforcement",
    "validators, LaunchBench, and failure cards",
    "record why subagents are unavailable or unsafe",
    "record the fallback reason in `ORCHESTRATION.md`",
    "PROJECT_STATE.yaml` `compound_engineering`",
  ],
  "business_agents_template",
  templateAgentsPath,
  issues,
);

requireTerms(
  templateClaude,
  [
    "For broad work, use subagents or record why they are unavailable or unsafe.",
    "Use Compound Engineering skills when available",
    "record unavailable routes rather than skipping them silently",
  ],
  "business_claude_template",
  templateClaudePath,
  issues,
);

requireTerms(
  orchestrationTemplate,
  ["Subagent availability", "Compound Engineering Routing", "CE freshness check", "ce-code-review", "ce-proof", "Fallback reason if unavailable"],
  "orchestration_template",
  orchestrationTemplatePath,
  issues,
);

requireTerms(
  projectStateTemplate,
  ["compound_engineering:", "availability:", "latest_check:", "skills_considered:", "test_status:", "fallback_reason:"],
  "project_state_template",
  projectStateTemplatePath,
  issues,
);

for (const scenario of ["compound-routing-skipped.yaml", "compound-freshness-not-checked.yaml", "subagent-dispatch-skipped.yaml"]) {
  const scenarioPath = path.join(launchbenchDir, scenario);
  if (!existsSync(scenarioPath)) {
    issues.push(issue("error", `workflow.launchbench.${scenario}.missing`, `${scenario} is required to cover workflow-adherence regressions.`, scenarioPath));
  } else {
    requireTerms(readFileSync(scenarioPath, "utf8"), ["check-workflow-adherence", "must_catch", "should_say"], `launchbench_${scenario}`, scenarioPath, issues);
  }
}

warnIfTooLong(templateAgents, 140, "business_agents_template", templateAgentsPath, issues);
warnIfTooLong(templateClaude, 40, "business_claude_template", templateClaudePath, issues);

if (repoRoot) {
  const repoAgentsPath = path.join(repoRoot, "AGENTS.md");
  const repoClaudePath = path.join(repoRoot, "CLAUDE.md");
  const repoAgents = readRequired(repoAgentsPath, "repo_agents", issues);
  const repoClaude = readRequired(repoClaudePath, "repo_claude", issues);
  requireTerms(repoAgents, ["concise map", "validator/eval", "templates/"], "repo_agents", repoAgentsPath, issues);
  requireTerms(repoClaude, ["Claude-specific pointer", "validators, and LaunchBench"], "repo_claude", repoClaudePath, issues);
  warnIfTooLong(repoAgents, 140, "repo_agents", repoAgentsPath, issues);
  warnIfTooLong(repoClaude, 40, "repo_claude", repoClaudePath, issues);
}

reportAndExit("Workflow adherence check", issues);

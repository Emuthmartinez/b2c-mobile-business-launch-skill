#!/usr/bin/env node
/**
 * check-app-archetype.ts — skill-integrity gate for the app-archetype prompt-pack layer.
 *
 * Every archetype pack under templates/app-archetypes/ must be structurally
 * complete so a future agent (or a new archetype contributor) can rely on the
 * same shape:
 *
 *   - each archetype dir has a README.md and a prompts/ dir with >=1 prompt
 *   - every prompt file (except README.md) carries a fenced copy-paste block
 *   - the shipped `social-network` pack has its required core prompts
 *   - the social-network lane is wired: references/social-network-lane.md exists,
 *     SKILL.md routes to it, and the agent-behavior eval is present
 *
 * Runs against the skill root (not a generated business repo). The harness may
 * also pass a stray --root; only --skill-root is authoritative here.
 *
 * npm script: check:app-archetype
 * Usage: tsx scripts/check-app-archetype.ts --skill-root /path/to/skill
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { issue, reportAndExit, type Issue } from "./lib/launch-state.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSkillRoot = path.resolve(scriptDir, "..");

// The shipped pack and its non-negotiable wiring. Extend this when a new
// archetype is promoted from optional to shipped.
const REQUIRED_PACK = "social-network";
const REQUIRED_PROMPTS = [
  "01-database-schema.md",
  "02-auth-system.md",
  "03-feed-and-posts.md",
  "04-profiles-and-follow.md",
];
const REQUIRED_REFERENCE = "references/social-network-lane.md";
const REQUIRED_EVAL = "evals/agent-behavior/social-network-archetype-prompt-pack.yaml";

const args = parseArgs(process.argv.slice(2));
const issues: Issue[] = [];
const archetypesDir = path.join(args.skillRoot, "templates", "app-archetypes");

if (!existsSync(archetypesDir)) {
  issues.push(
    issue(
      "error",
      "app_archetype.dir_missing",
      `templates/app-archetypes is missing at ${archetypesDir}. The app-archetype prompt-pack layer must exist.`,
      "templates/app-archetypes",
    ),
  );
} else {
  const archetypes = readdirSync(archetypesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  if (archetypes.length === 0) {
    issues.push(
      issue(
        "error",
        "app_archetype.no_archetypes",
        "templates/app-archetypes has no archetype packs. Add at least one (e.g. social-network).",
        "templates/app-archetypes",
      ),
    );
  }

  for (const name of archetypes) {
    const packDir = path.join(archetypesDir, name);
    const rel = `templates/app-archetypes/${name}`;

    if (!existsSync(path.join(packDir, "README.md"))) {
      issues.push(issue("error", `app_archetype.${name}.readme_missing`, `${rel} must have a README.md index.`, rel));
    }

    const promptsDir = path.join(packDir, "prompts");
    if (!existsSync(promptsDir) || !statSync(promptsDir).isDirectory()) {
      issues.push(issue("error", `app_archetype.${name}.prompts_missing`, `${rel} must have a prompts/ directory.`, rel));
      continue;
    }

    const promptFiles = collectMarkdown(promptsDir);
    const promptBasenames = new Set(promptFiles.map((file) => path.basename(file)));
    if (promptFiles.length === 0) {
      issues.push(issue("error", `app_archetype.${name}.prompts_empty`, `${rel}/prompts contains no prompt files.`, `${rel}/prompts`));
    }

    // Every prompt (not the README) must carry a fenced copy-paste block.
    for (const file of promptFiles) {
      if (path.basename(file).toLowerCase() === "readme.md") {
        continue;
      }
      const text = readFileSync(file, "utf8");
      if (!text.includes("```")) {
        const fileRel = path.relative(args.skillRoot, file);
        issues.push(
          issue(
            "error",
            `app_archetype.${name}.prompt_block_missing`,
            `${fileRel} has no fenced copy-paste prompt block. Each archetype prompt must ship a runnable prompt in a fenced block.`,
            fileRel,
          ),
        );
      }
    }

    // Required-pack contract: the shipped pack must carry its core prompts.
    if (name === REQUIRED_PACK) {
      for (const required of REQUIRED_PROMPTS) {
        if (!promptBasenames.has(required)) {
          issues.push(
            issue(
              "error",
              `app_archetype.${name}.required_prompt_missing`,
              `${rel}/prompts is missing the required core prompt ${required}.`,
              `${rel}/prompts`,
            ),
          );
        }
      }
    }
  }
}

// Wiring for the shipped pack: reference, SKILL.md routing, and the eval.
const referencePath = path.join(args.skillRoot, REQUIRED_REFERENCE);
if (!existsSync(referencePath)) {
  issues.push(issue("error", "app_archetype.reference_missing", `${REQUIRED_REFERENCE} must exist for the shipped social-network lane.`, REQUIRED_REFERENCE));
}

const skillPath = path.join(args.skillRoot, "SKILL.md");
if (!existsSync(skillPath)) {
  issues.push(issue("error", "app_archetype.skill_missing", "SKILL.md is missing.", "SKILL.md"));
} else if (!readFileSync(skillPath, "utf8").includes(REQUIRED_REFERENCE)) {
  issues.push(
    issue(
      "error",
      "app_archetype.skill_routing_missing",
      `SKILL.md must route to ${REQUIRED_REFERENCE} so the archetype lane is discoverable.`,
      "SKILL.md",
    ),
  );
}

if (!existsSync(path.join(args.skillRoot, REQUIRED_EVAL))) {
  issues.push(
    issue(
      "error",
      "app_archetype.eval_missing",
      `${REQUIRED_EVAL} must exist so the detect -> AskUserQuestion -> load-pack behavior is enforced, not prose-only.`,
      REQUIRED_EVAL,
    ),
  );
}

reportAndExit("App archetype prompt-pack check", issues);

interface Args {
  skillRoot: string;
}

function parseArgs(argv: string[]): Args {
  let skillRoot = defaultSkillRoot;
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];
    // Only --skill-root is authoritative; ignore a stray --root from the fixture harness.
    if (token === "--skill-root" && value) {
      skillRoot = path.resolve(expandHome(value));
      index += 1;
    }
  }
  return { skillRoot };
}

function collectMarkdown(root: string): string[] {
  const files: string[] = [];
  function visit(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === ".git") {
        continue;
      }
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }
  visit(root);
  return files.sort();
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

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { type Harness, skillRoot } from "./_harness.js";
import { auditExcludedScripts, buildAuditPlan, type AuditLayout } from "../lib/audit-plan.js";

/**
 * Fixtures for the repo/skill-level gates that previously had zero fixture
 * coverage: the live audit pipeline only ever exercised their PASS path, so
 * nothing proved they could fail. Each gate gets at least one failing input
 * here so a regression that makes it always-pass is caught by test:validators.
 */

/** Scripts object that satisfies checkAuditPlanCoverage for a layout: every plan step resolves, no extra gate scripts. */
function planScripts(layout: AuditLayout): Record<string, string> {
  const scripts: Record<string, string> = {};
  for (const step of buildAuditPlan(layout)) {
    if (step.kind === "tsc") {
      continue;
    }
    scripts[step.id] = step.id === "audit" ? "tsx scripts/run-audit.ts" : `tsx scripts/${step.id.replace(/:/g, "-")}.ts`;
  }
  for (const name of Object.keys(auditExcludedScripts)) {
    scripts[name] = `tsx scripts/${name.replace(/:/g, "-")}.ts`;
  }
  return scripts;
}

function lockFor(name: string, version: string): string {
  return JSON.stringify({ name, version, lockfileVersion: 3, packages: { "": { name, version } } }, null, 2);
}

/** Write a minimal synthetic repo-root + skill-root pair that check-package-parity accepts. */
function writeParityPair(root: string, options: { rootVersion: string; skillVersion: string }): { repoRoot: string; parityScriptRoot: string } {
  const repoRoot = path.join(root, "repo");
  const parityScriptRoot = path.join(repoRoot, "skill", "pkg");
  mkdirSync(parityScriptRoot, { recursive: true });

  const rootScripts = {
    ...planScripts("repo"),
    audit: "tsx skill/pkg/scripts/run-audit.ts",
    "audit:ci": "tsx skill/pkg/scripts/run-audit.ts --ci",
  };
  const runtimeScripts = {
    ...planScripts("skill"),
    audit: "tsx scripts/run-audit.ts",
  };

  writeFileSync(
    path.join(repoRoot, "package.json"),
    JSON.stringify({ name: "parity-root", version: options.rootVersion, scripts: rootScripts, devDependencies: {} }, null, 2),
    "utf8",
  );
  writeFileSync(path.join(repoRoot, "package-lock.json"), lockFor("parity-root", options.rootVersion), "utf8");
  writeFileSync(
    path.join(parityScriptRoot, "package.json"),
    JSON.stringify({ name: "parity-runtime", version: options.skillVersion, scripts: runtimeScripts, devDependencies: {} }, null, 2),
    "utf8",
  );
  writeFileSync(path.join(parityScriptRoot, "package-lock.json"), lockFor("parity-runtime", options.skillVersion), "utf8");
  writeFileSync(path.join(parityScriptRoot, "skill-version.json"), JSON.stringify({ version: options.skillVersion }, null, 2), "utf8");
  return { repoRoot, parityScriptRoot };
}

export function register(h: Harness): void {
  const { makeEmptyFixture, runFixture, runScriptArgs } = h;

  // --- check-autopilot-contract ---
  runScriptArgs("autopilot contract passes on the shipped skill", "check-autopilot-contract.ts", ["--skill-root", skillRoot], 0);
  const autopilotEmpty = makeEmptyFixture("autopilot-empty-skill-root");
  runScriptArgs(
    "autopilot contract fails when SKILL.md is missing",
    "check-autopilot-contract.ts",
    ["--skill-root", autopilotEmpty],
    1,
    "autopilot.skill_missing",
  );

  // --- check-agent-entrypoints ---
  runScriptArgs("agent entrypoints pass on the shipped skill", "check-agent-entrypoints.ts", ["--skill-root", skillRoot], 0);
  const entrypointsEmpty = makeEmptyFixture("agent-entrypoints-empty-skill-root");
  runScriptArgs(
    "agent entrypoints fail when the shipped templates are missing",
    "check-agent-entrypoints.ts",
    ["--skill-root", entrypointsEmpty],
    1,
    "agent_entrypoints.template_agents.missing",
  );

  // --- check-workflow-adherence ---
  runScriptArgs("workflow adherence passes on the shipped skill", "check-workflow-adherence.ts", ["--skill-root", skillRoot], 0);
  const workflowEmpty = makeEmptyFixture("workflow-adherence-empty-skill-root");
  runScriptArgs(
    "workflow adherence fails when orchestration references are missing",
    "check-workflow-adherence.ts",
    ["--skill-root", workflowEmpty],
    1,
    "workflow.parallel_agent_reference.missing",
  );

  // --- check-package-parity ---
  const parityClean = makeEmptyFixture("package-parity-clean");
  const cleanPair = writeParityPair(parityClean, { rootVersion: "0.0.1", skillVersion: "0.0.1" });
  runScriptArgs(
    "package parity passes on a version-aligned synthetic pair",
    "check-package-parity.ts",
    ["--repo-root", cleanPair.repoRoot, "--skill-root", cleanPair.parityScriptRoot],
    0,
  );

  const parityDrift = makeEmptyFixture("package-parity-version-drift");
  const driftPair = writeParityPair(parityDrift, { rootVersion: "0.0.1", skillVersion: "0.0.2" });
  runScriptArgs(
    "package parity fails when versions drift from skill-version.json",
    "check-package-parity.ts",
    ["--repo-root", driftPair.repoRoot, "--skill-root", driftPair.parityScriptRoot],
    1,
    "must match skill-version.json",
  );

  // --- audit-skill-links ---
  const wireLinkRoot = (root: string): void => {
    mkdirSync(path.join(root, "references"), { recursive: true });
    mkdirSync(path.join(root, "templates"), { recursive: true });
    writeFileSync(path.join(root, "references", "guide.md"), "See [the template](../templates/artifact.md) for the artifact contract.\n", "utf8");
    writeFileSync(path.join(root, "templates", "artifact.md"), "# Artifact\nRouted from references/guide.md — keep both sides linked.\n", "utf8");
  };

  const linksClean = makeEmptyFixture("skill-links-clean");
  wireLinkRoot(linksClean);
  runScriptArgs("link audit passes on a wired reference/template pair", "audit-skill-links.ts", ["--skill-root", linksClean], 0);

  const linksBroken = makeEmptyFixture("skill-links-broken");
  wireLinkRoot(linksBroken);
  writeFileSync(path.join(linksBroken, "references", "guide.md"), "See [the template](../templates/missing.md); artifact.md still routes.\n", "utf8");
  runScriptArgs("link audit fails on a broken local link", "audit-skill-links.ts", ["--skill-root", linksBroken], 1, "skill_links.broken_local_link");

  const linksOrphan = makeEmptyFixture("skill-links-orphan");
  wireLinkRoot(linksOrphan);
  writeFileSync(path.join(linksOrphan, "references", "unrouted.md"), "No other file mentions this reference, so no agent can load it.\n", "utf8");
  runScriptArgs("link audit fails on an orphaned reference file", "audit-skill-links.ts", ["--skill-root", linksOrphan], 1, "skill_links.orphan_file");

  const linksDuplicate = makeEmptyFixture("skill-links-duplicate");
  wireLinkRoot(linksDuplicate);
  const duplicateBody =
    "# Duplicate body\nThis exact content is shipped twice under templates/, which will drift apart silently over time once one copy is edited and the other is forgotten.\n";
  writeFileSync(path.join(linksDuplicate, "templates", "copy-one.md"), duplicateBody, "utf8");
  writeFileSync(path.join(linksDuplicate, "templates", "copy-two.md"), duplicateBody, "utf8");
  writeFileSync(
    path.join(linksDuplicate, "references", "guide.md"),
    "See [the template](../templates/artifact.md), plus copy-one.md and copy-two.md.\n",
    "utf8",
  );
  runScriptArgs(
    "link audit fails on byte-identical template duplicates",
    "audit-skill-links.ts",
    ["--skill-root", linksDuplicate],
    1,
    "skill_links.duplicate_template",
  );

  // --- check-template-safety ---
  const templateSafetyClean = makeEmptyFixture("template-safety-clean");
  writeFileSync(path.join(templateSafetyClean, "component.tsx"), 'import { View } from "react-native";\nexport const Ok = View;\n', "utf8");
  runFixture("template safety passes on native-animation-only code", templateSafetyClean, "check-template-safety.ts", 0);

  const templateSafetyBad = makeEmptyFixture("template-safety-framer-motion");
  writeFileSync(path.join(templateSafetyBad, "component.tsx"), 'import { motion } from "framer-motion";\nexport const Bad = motion.div;\n', "utf8");
  runFixture(
    "template safety fails on a framer-motion import in template code",
    templateSafetyBad,
    "check-template-safety.ts",
    1,
    "template_safety.framer_motion_in_template",
  );
}

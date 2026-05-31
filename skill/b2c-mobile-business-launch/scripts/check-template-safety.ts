#!/usr/bin/env node
/**
 * check-template-safety
 *
 * Fails if a web-only animation library (framer-motion / the `motion` package)
 * is imported from a shipped template CODE file. framer-motion is web-only; a
 * launched business repo's mobile binary (SwiftUI/Flutter/React Native) must use
 * native animation from DesignTokens.Motion, so these imports must never ship in
 * templates copied into business repos. Markdown/HTML docs are excluded so that
 * documentation examples remain allowed.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { collectAllFiles, issue, reportAndExit, type Issue } from "./lib/launch-state.js";
import { skillRoot } from "./lib/design-state.js";

function parseRoot(argv: string[]): string {
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index + 1];
    if (argv[index] === "--root" && value) {
      return path.resolve(value);
    }
  }
  return path.join(skillRoot, "templates");
}

const root = parseRoot(process.argv.slice(2));
const issues: Issue[] = [];
const codeExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".swift", ".kt", ".dart", ".vue", ".svelte"]);
const forbidden = /(?:import[^;\n]*?from\s*|require\(\s*)['"](?:framer-motion|motion|motion\/react)['"]/;

for (const file of collectAllFiles(root)) {
  if (file.split(path.sep).includes("node_modules")) {
    continue;
  }
  if (!codeExtensions.has(path.extname(file))) {
    continue;
  }
  if (forbidden.test(readFileSync(file, "utf8"))) {
    issues.push(
      issue(
        "error",
        "template_safety.framer_motion_in_template",
        `framer-motion / motion import found in a shipped template code file: ${path.relative(root, file)}. framer-motion is web-only; the mobile binary must use native animation from DesignTokens.Motion.`,
        path.relative(root, file),
      ),
    );
  }
}

reportAndExit("Template safety check", issues);

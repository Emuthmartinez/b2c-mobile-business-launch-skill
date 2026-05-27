#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { collectFiles, issue, reportAndExit } from "./lib/launch-state.js";

let skillRoot = process.cwd();
const argv = process.argv.slice(2);

for (let index = 0; index < argv.length; index += 1) {
  const token = argv[index];
  const value = argv[index + 1];
  if ((token === "--skill-root" || token === "--root") && value) {
    skillRoot = path.resolve(value);
    index += 1;
  }
}

const issues = [];
const markdownFiles = collectFiles(skillRoot, new Set([".md"]), 2000);
const linkPattern = /\[[^\]]*]\(([^)]+)\)/g;

for (const file of markdownFiles) {
  const text = readFileSync(file, "utf8");
  let match: RegExpExecArray | null;
  while ((match = linkPattern.exec(text)) !== null) {
    const rawHref = match[1]?.trim();
    if (!rawHref || rawHref.startsWith("#") || /^[a-z]+:/i.test(rawHref)) {
      continue;
    }

    const href = rawHref.split("#")[0];
    if (!href) {
      continue;
    }

    const target = path.resolve(path.dirname(file), href);
    if (!existsSync(target)) {
      issues.push(
        issue(
          "error",
          "skill_links.broken_local_link",
          `Broken local markdown link: ${rawHref}`,
          path.relative(skillRoot, file),
        ),
      );
    }
  }
}

reportAndExit("Skill local-link audit", issues);


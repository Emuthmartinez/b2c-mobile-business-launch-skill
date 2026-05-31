#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  loadDesignState,
  parseDesignCliArgs,
  rel,
} from "./lib/design-state.js";
import { collectAllFiles, issue, reportAndExit, type Issue } from "./lib/launch-state.js";

const args = parseDesignCliArgs(process.argv.slice(2));
const issues: Issue[] = [];
const designArtifacts = collectDesignArtifacts(args.root);
const hasDesignState = existsSync(args.statePath) && existsSync(args.tokensPath);

if (designArtifacts.length > 0 && !hasDesignState) {
  issues.push(
    issue(
      "error",
      "design_room.state_missing_for_artifacts",
      `Design artifacts exist without state/business.json and state/theme.tokens.json: ${designArtifacts.slice(0, 6).join(", ")}`,
      args.root,
    ),
  );
}

if (hasDesignState) {
  const loaded = loadDesignState(args);
  issues.push(...loaded.issues);

  if (loaded.state && loaded.stateHash) {
    const renderPath = path.join(args.root, "design-room.html");
    if (!existsSync(renderPath)) {
      issues.push(issue("error", "design_room.render_missing", "design-room.html must be rendered from state before design is claimed ready.", rel(args.root, renderPath)));
    } else {
      const html = readFileSync(renderPath, "utf8");
      const match = html.match(/<meta name="design-state-hash" content="([^"]+)"/);
      if (!match) {
        issues.push(issue("error", "design_room.render_hash_missing", "design-room.html must include the design-state-hash meta tag.", rel(args.root, renderPath)));
      } else if (match[1] !== loaded.stateHash) {
        issues.push(
          issue(
            "error",
            "design_room.render_stale",
            `design-room.html hash ${match[1]} does not match current state hash ${loaded.stateHash}. Re-run render-design-room.ts.`,
            rel(args.root, renderPath),
          ),
        );
      }
    }
  }
}

for (const artifact of designArtifacts) {
  if (/design[-_ ]?(proposal|concept)|visual[-_ ]?proof|mood[-_ ]?board|design-v\d+/i.test(path.basename(artifact))) {
    issues.push(
      issue(
        "error",
        "design_room.freeform_design_artifact",
        "Design proposal artifacts must be represented as state mutations and rendered through Design Room, not one-off proposal files.",
        artifact,
      ),
    );
  }
}

reportAndExit("Design Room contract validation", issues);

function collectDesignArtifacts(root: string): string[] {
  const ignoredSegments = new Set(["node_modules", ".git", "dist", "state", "render"]);
  return collectAllFiles(root)
    .map((filePath) => path.relative(root, filePath))
    .filter((relativePath) => !relativePath.split(path.sep).some((segment) => ignoredSegments.has(segment)))
    .filter((relativePath) => {
      const normalized = relativePath.replaceAll(path.sep, "/");
      return [
        /(^|\/)DESIGN\.md$/i,
        /(^|\/)design\.md$/i,
        /(^|\/)design\.html$/i,
        /(^|\/)UX_PATTERNS\.md$/i,
        /(^|\/)ux-patterns\.html$/i,
        /(^|\/)design[-_ ]?(proposal|concept|v\d+).*\.(md|html)$/i,
        /(^|\/)visual[-_ ]?proof.*\.(md|html)$/i,
        /(^|\/)mood[-_ ]?board.*\.(md|html)$/i,
      ].some((pattern) => pattern.test(normalized));
    });
}

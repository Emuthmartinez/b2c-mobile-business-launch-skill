#!/usr/bin/env node
/**
 * check-research-evidence.ts — content floor for the research lane.
 *
 * RESEARCH.md is the evidence root every downstream lane traces back to, yet
 * the lane previously had no dedicated validator: only the generic
 * lane-coverage status floor saw it. Structure follows the RESEARCH.md
 * contract in references/artifact-contracts.md.
 *
 * npm script: check:research
 * Usage: tsx scripts/check-research-evidence.ts --root <app-repo-root>
 */
import { asString, getPath, issue, loadProjectState, parseCliArgs, readText, reportAndExit } from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const loaded = loadProjectState(args);
const issues = [...loaded.issues];
const state = loaded.state;

const laneStatus = state ? asString(getPath(state, "lanes.research.status"))?.toLowerCase() : undefined;
const skip = laneStatus === "not_needed" || laneStatus === "deferred";
const done = laneStatus === "done";
const text = readText(args.root, "RESEARCH.md");

if (!skip && !text) {
  issues.push(
    issue(
      "error",
      "research.markdown_missing",
      "RESEARCH.md is required: it is the evidence root that SPEC.md, brand, ASO, pricing, and funnel decisions trace back to. Seed it from templates/RESEARCH.md.",
      "RESEARCH.md",
    ),
  );
}

if (text) {
  for (const phrase of ["Source Ledger", "Decision Inputs", "Decision Log", "Rejected Claims"]) {
    if (!text.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(
        issue(
          done ? "error" : "warning",
          `research.${phrase.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.missing`,
          `RESEARCH.md should include a ${phrase} section (see the RESEARCH.md contract in artifact-contracts.md).`,
          "RESEARCH.md",
        ),
      );
    }
  }

  if (!text.includes("LAUNCH_TRACE")) {
    issues.push(
      issue(
        done ? "error" : "warning",
        "research.trace_pointer.missing",
        "RESEARCH.md should give major decisions trace IDs or LAUNCH_TRACE.md pointers so evidence stays connected to build decisions.",
        "RESEARCH.md",
      ),
    );
  }

  if (done) {
    if (/\bYYYY-MM-DD\b|\breplace with\b|\b(TODO|TBD|placeholder)\b/i.test(text)) {
      issues.push(
        issue(
          "error",
          "research.placeholder_complete",
          "Research cannot be done while template placeholders (YYYY-MM-DD, 'replace with', TODO/TBD) remain in RESEARCH.md.",
          "RESEARCH.md",
        ),
      );
    }
    if (!/\b20\d{2}-\d{2}-\d{2}\b/.test(text)) {
      issues.push(
        issue(
          "error",
          "research.no_dated_evidence",
          "A done research lane needs at least one dated evidence row (a real YYYY-MM-DD date) so freshness is checkable.",
          "RESEARCH.md",
        ),
      );
    }
  }
}

reportAndExit("Research evidence check", issues);

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
  for (const phrase of ["Source Ledger", "Evidence Capture Protocol", "Untrusted Content", "Decision Inputs", "Decision Log", "Rejected Claims"]) {
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
    for (const column of ["URL / source ID", "Observed at", "Tool / backend / query", "Transcript / visual", "Observation", "Inference", "Artifact / trace"]) {
      if (!text.toLowerCase().includes(column.toLowerCase())) {
        issues.push(
          issue(
            "error",
            `research.source_ledger_${column.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.missing`,
            `Done research needs the ${column} provenance column so browser/social/video evidence is reproducible.`,
            "RESEARCH.md",
          ),
        );
      }
    }
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
    const rows = sourceLedgerRows(text);
    const completeRows = rows.filter((row) => {
      if (row.length < 10) return false;
      const [source, , identity, observedAt, backendQuery, transcriptVisual, observation, inference, confidence, artifactTrace] = row;
      return Boolean(
        source?.trim() &&
        identity?.trim() &&
        isDateTime(observedAt) &&
        backendQuery?.trim() &&
        transcriptVisual?.trim() &&
        observation?.trim() &&
        inference?.trim() &&
        /^(low|medium|high)$/i.test(confidence?.trim() ?? "") &&
        artifactTrace?.trim() &&
        !/\b(pending|todo|tbd|n\/a without reason)\b/i.test(row.join(" ")),
      );
    });
    if (completeRows.length === 0) {
      issues.push(
        issue(
          "error",
          "research.source_ledger_row_missing",
          "Done research needs at least one complete Source Ledger evidence row; headers and an unrelated date are not proof.",
          "RESEARCH.md",
        ),
      );
    }
  }
}

reportAndExit("Research evidence check", issues);

function sourceLedgerRows(value: string): string[][] {
  const lines = value.split(/\r?\n/);
  const header = lines.findIndex((line) => line.includes("URL / source ID") && line.includes("Artifact / trace"));
  if (header < 0) return [];
  const rows: string[][] = [];
  for (const line of lines.slice(header + 1)) {
    if (!line.trim().startsWith("|")) break;
    if (/^\|\s*:?-+/.test(line)) continue;
    rows.push(
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    );
  }
  return rows;
}

function isDateTime(value: string | undefined): boolean {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) && !Number.isNaN(new Date(value).getTime()));
}

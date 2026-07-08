#!/usr/bin/env node
/**
 * check-product-spec.ts — content floor for the product lane.
 *
 * SPEC.md is where research becomes a product decision; the lane previously
 * had no dedicated validator. Structure follows the SPEC.md contract in
 * references/artifact-contracts.md: the spec must explain why the app can
 * win, name the magical V1 moment, and bound V1 before engineering planning.
 *
 * npm script: check:product-spec
 * Usage: tsx scripts/check-product-spec.ts --root <app-repo-root>
 */
import { asString, getPath, issue, loadProjectState, parseCliArgs, readText, reportAndExit } from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const loaded = loadProjectState(args);
const issues = [...loaded.issues];
const state = loaded.state;

const laneStatus = state ? asString(getPath(state, "lanes.product.status"))?.toLowerCase() : undefined;
const skip = laneStatus === "not_needed" || laneStatus === "deferred";
const done = laneStatus === "done";
const text = readText(args.root, "SPEC.md");

if (!skip && !text) {
  issues.push(
    issue(
      "error",
      "product_spec.markdown_missing",
      "SPEC.md is required before design, store, or engineering work hardens. Seed it from templates/SPEC.md.",
      "SPEC.md",
    ),
  );
}

if (text) {
  const requiredSections = [
    "Promise",
    "11-Star Experience",
    "Category And Competitors",
    "Core Product Loop",
    "V1 Scalable Slice",
    "Monetization Posture",
    "Metrics",
    "Acceptance Contract",
    "Risks And Open Questions",
  ];
  for (const phrase of requiredSections) {
    if (!text.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(
        issue(
          done ? "error" : "warning",
          `product_spec.${phrase.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.missing`,
          `SPEC.md should include a ${phrase} section (see the SPEC.md contract in artifact-contracts.md).`,
          "SPEC.md",
        ),
      );
    }
  }

  for (const ref of ["11_STAR_EXPERIENCE.md", "RESEARCH.md"]) {
    if (!text.includes(ref)) {
      issues.push(
        issue(
          done ? "error" : "warning",
          `product_spec.ref_${ref.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.missing`,
          `SPEC.md should reference ${ref} so the spec stays traced to experience and evidence.`,
          "SPEC.md",
        ),
      );
    }
  }

  if (done && /\breplace with\b|\b(TODO|TBD|placeholder)\b/i.test(text)) {
    issues.push(
      issue(
        "error",
        "product_spec.placeholder_complete",
        "The product lane cannot be done while template placeholders ('replace with', TODO/TBD) remain in SPEC.md.",
        "SPEC.md",
      ),
    );
  }
}

reportAndExit("Product spec check", issues);

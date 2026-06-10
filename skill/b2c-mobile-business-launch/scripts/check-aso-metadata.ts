#!/usr/bin/env node
/**
 * check-aso-metadata
 *
 * Validates that APP_STORE_LISTING.md and any keyword/description fields:
 * 1. Record AppKittie keyword-difficulty/volume evidence for the proposed keyword set.
 * 2. Do not leave the description field severely undersized (< 2500 chars) without
 *    an explicit rationale comment.
 * 3. Do not source live ASC metadata from build logs instead of a live `asc metadata`
 *    pull when an ASC audit is being conducted.
 * 4. Confirm APP_STORE_LISTING.md exists when the store_console lane is in scope.
 *
 * Run:
 *   npm run check:aso-metadata -- --root <app-repo-root>
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { asArray, asString, getPath, issue, loadProjectState, parseCliArgs, readText, reportAndExit } from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const loaded = loadProjectState(args);
const issues = [...loaded.issues];
const state = loaded.state;

function firstExistingText(candidates: string[]): { relativePath: string; text: string } | undefined {
  for (const candidate of candidates) {
    const text = readText(args.root, candidate);
    if (text) {
      return { relativePath: candidate, text };
    }
  }
  return undefined;
}

function includes(text: string, phrase: string): boolean {
  return text.toLowerCase().includes(phrase.toLowerCase());
}

// ── Lane guards ─────────────────────────────────────────────────────────────

const platforms = state
  ? asArray(getPath(state, "project.platforms"))
      .map((item) => asString(item)?.toLowerCase())
      .filter((item): item is string => Boolean(item))
  : [];
const iosBundleId = state ? asString(getPath(state, "project.bundle_ids.ios")) : undefined;
const hasIos = state ? platforms.includes("ios") || Boolean(iosBundleId?.trim()) : true;
const storeStatus = state ? asString(getPath(state, "lanes.store_console.status"))?.toLowerCase() : undefined;
const storeSkipped = ["not_needed", "deferred"].includes(storeStatus ?? "");

if (storeSkipped) {
  reportAndExit("ASO metadata packet check", issues);
  process.exit(0);
}

// ── File discovery ────────────────────────────────────────────────────────

const appListing = firstExistingText(["APP_STORE_LISTING.md", "app-store-listing/APP_STORE_LISTING.md"]);
const storeConsole = firstExistingText(["STORE_CONSOLE.md"]);

if (hasIos && !appListing) {
  issues.push(
    issue(
      "error",
      "aso_metadata.app_store_listing_missing",
      "APP_STORE_LISTING.md is required for iOS ASO metadata, keyword evidence, description copy, and AppKittie validation.",
      "APP_STORE_LISTING.md",
    ),
  );
}

// ── Check 1: AppKittie keyword-difficulty evidence ────────────────────────
//
// The keyword field must be backed by AppKittie batch_keyword_difficulty or
// get_keyword_difficulty data, not assembled from intuition alone.

function checkAppKittieEvidence(text: string, file: string): void {
  const hasKeywordField =
    includes(text, "keyword") &&
    (includes(text, "100 bytes") || includes(text, "100 chars") || includes(text, "keyword field") || includes(text, "keywords field"));

  if (!hasKeywordField) {
    // Not producing keyword metadata in this doc — skip.
    return;
  }

  const hasAppKittieEvidence =
    includes(text, "appkittie") ||
    includes(text, "batch_keyword_difficulty") ||
    includes(text, "get_keyword_difficulty") ||
    includes(text, "keyword difficulty") ||
    includes(text, "keyword volume") ||
    includes(text, "difficulty score") ||
    includes(text, "search volume");

  if (!hasAppKittieEvidence) {
    issues.push(
      issue(
        "error",
        "aso_metadata.appkittie_evidence_missing",
        `${file} includes a keyword field but records no AppKittie keyword-difficulty or volume evidence. ` +
          "Invoke mcp__appkittie__batch_keyword_difficulty (or get_keyword_difficulty) on the proposed keyword set " +
          "and record difficulty scores, volumes, and rationale before locking metadata.",
        file,
      ),
    );
  }
}

// ── Check 2: Description fill-rate floor ─────────────────────────────────
//
// The 4000-char description field is the largest conversion surface on the
// product page. Descriptions < 2500 chars (62.5% fill) with no rationale
// comment are flagged as a conversion gap.

function checkDescriptionLength(text: string, file: string): void {
  // Look for a description length marker such as "Description (1151/4000)"
  // or "Description: 1151 chars" or "1151/4000" near the word "description".
  const lengthPattern = /description[^`\n]{0,120}?(\d{3,4})\s*\/\s*4000/i;
  const match = text.match(lengthPattern);
  if (!match) {
    // No char-count annotation found — check for a raw description section
    // that looks very short relative to the field limit.
    // If there is no explicit annotation we cannot measure; skip numeric check
    // but ensure the doc at least mentions the 4000-char limit.
    const mentions4000 = includes(text, "4000");
    if (!mentions4000 && includes(text, "description")) {
      issues.push(
        issue(
          "warning",
          "aso_metadata.description_limit_unmentioned",
          `${file} includes a description section but does not reference the 4000-character limit. ` +
            "Record the character count (e.g. 'Description (1151/4000)') so conversion gaps are visible.",
          file,
        ),
      );
    }
    return;
  }

  const charCount = parseInt(match[1] ?? "0", 10);
  if (charCount < 2500) {
    // Check whether there is an intentional-brevity note nearby.
    const intentionalNote =
      includes(text, "intentionally brief") ||
      includes(text, "intentionally short") ||
      includes(text, "deliberately brief") ||
      includes(text, "founder approved") ||
      includes(text, "rationale: ") ||
      includes(text, "note: ") ||
      includes(text, "conversion gap accepted");

    if (!intentionalNote) {
      issues.push(
        issue(
          "error",
          "aso_metadata.description_severely_undersized",
          `${file} shows Description at ${charCount}/4000 chars (${Math.round((charCount / 4000) * 100)}% fill) with no rationale. ` +
            "Descriptions below 2500 chars miss conversion: add keyword-rich body copy, secondary benefit paragraphs, and social proof. " +
            "If brevity is intentional, add a rationale comment or 'conversion gap accepted' note.",
          file,
        ),
      );
    }
  }
}

// ── Check 3: Stale build log as ASC metadata source ──────────────────────
//
// Using build/*.log files as the source of truth for live ASC metadata
// bypasses any changes made directly in App Store Connect. The correct
// read path is `asc metadata pull` (or equivalent ASC CLI read).

function checkStaleLogMetadataSource(text: string, file: string): void {
  // Detect patterns that suggest a build log was cited as ASC metadata truth.
  const logSourcePattern = /\b(found|read|source|using|from|in)\b[^`\n]{0,80}?build\/[^\s`'"]*\.log[^\n]{0,120}?(?:metadata|asc|app store|payload|field)/i;
  const reversePattern = /\b(?:metadata|asc|app store|payload|field)\b[^`\n]{0,80}?build\/[^\s`'"]*\.log/i;

  if (logSourcePattern.test(text) || reversePattern.test(text)) {
    issues.push(
      issue(
        "error",
        "aso_metadata.stale_log_as_metadata_source",
        `${file} appears to reference a build log file as the source of live ASC metadata. ` +
          "Build logs capture a past snapshot and may not reflect the current App Store Connect state. " +
          "Run 'asc metadata pull' (or the equivalent asc-metadata-sync read route) to fetch live metadata before any audit or diff.",
        file,
      ),
    );
  }
}

// ── Check 4: Dimension/folder name mismatch note ─────────────────────────
//
// When SCREENSHOTS.md or APP_STORE_LISTING.md names screenshot output folders
// that embed a device suffix (e.g. iphone-67-*) but the path or adjacent text
// reveals a different pixel dimension, flag it for manual sips verification.

function checkScreenshotFolderDimensionAlignment(text: string, file: string): void {
  // Pattern: folder name contains "67" but dimension suggests 69 (1320x2868),
  // or folder contains "69" but dimension suggests 67 (1290x2796).
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") && !/\b(folder|path|dir)\b/i.test(trimmed)) {
      continue;
    }
    const has67Folder = /iphone[-_]?67/i.test(trimmed);
    const has69Folder = /iphone[-_]?69/i.test(trimmed);
    const dimension = trimmed.match(/\b(\d{3,4})x(\d{3,4})\b/);
    if (!dimension) {
      continue;
    }
    const [, w, h] = dimension.map(Number);
    // 6.7-inch: 1290x2796; 6.9-inch: 1320x2868
    const is69Dimension = (w === 1320 && h === 2868) || (w === 2868 && h === 1320);
    const is67Dimension = (w === 1290 && h === 2796) || (w === 2796 && h === 1290);

    if (has67Folder && is69Dimension) {
      issues.push(
        issue(
          "error",
          "aso_metadata.screenshot_folder_dimension_mismatch",
          `${file}: folder name suggests 6.7-inch (iphone-67) but dimension ${w}x${h} is the 6.9-inch size (APP_IPHONE_69). ` +
            "Rename the folder or correct the dimension to avoid uploading screenshots to the wrong device well. " +
            "Verify with: sips -g pixelWidth -g pixelHeight <file>",
          file,
        ),
      );
    }
    if (has69Folder && is67Dimension) {
      issues.push(
        issue(
          "error",
          "aso_metadata.screenshot_folder_dimension_mismatch",
          `${file}: folder name suggests 6.9-inch (iphone-69) but dimension ${w}x${h} is the 6.7-inch size (APP_IPHONE_67). ` +
            "Rename the folder or correct the dimension to avoid uploading screenshots to the wrong device well. " +
            "Verify with: sips -g pixelWidth -g pixelHeight <file>",
          file,
        ),
      );
    }
  }
}

// ── Run checks ────────────────────────────────────────────────────────────

if (appListing) {
  checkAppKittieEvidence(appListing.text, appListing.relativePath);
  checkDescriptionLength(appListing.text, appListing.relativePath);
  checkStaleLogMetadataSource(appListing.text, appListing.relativePath);
  checkScreenshotFolderDimensionAlignment(appListing.text, appListing.relativePath);
}

if (storeConsole) {
  checkStaleLogMetadataSource(storeConsole.text, storeConsole.relativePath);
  checkScreenshotFolderDimensionAlignment(storeConsole.text, storeConsole.relativePath);
}

// Also check any SCREENSHOTS.md for folder/dimension mismatches.
const screenshotPacket = firstExistingText(["SCREENSHOTS.md", "screenshots/SCREENSHOTS.md", "app-store-listing/SCREENSHOTS.md"]);
if (screenshotPacket) {
  checkScreenshotFolderDimensionAlignment(screenshotPacket.text, screenshotPacket.relativePath);
}

reportAndExit("ASO metadata packet check", issues);

#!/usr/bin/env node
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

function existsAny(candidates: string[]): string | undefined {
  return candidates.find((candidate) => existsSync(path.join(args.root, candidate)));
}

function missingPhraseCode(prefix: string, phrase: string): string {
  return `${prefix}.${phrase.replaceAll(" ", "_").toLowerCase()}.missing`;
}

function includes(text: string, phrase: string): boolean {
  return text.toLowerCase().includes(phrase.toLowerCase());
}

function requirePhrases(text: string, phrases: string[], prefix: string, file: string): void {
  for (const phrase of phrases) {
    if (!includes(text, phrase)) {
      issues.push(issue("error", missingPhraseCode(prefix, phrase), `${file} should include ${phrase}.`, file));
    }
  }
}

function checkReadyDeviceRows(text: string, file: string): void {
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || !/\b(iPhone|iPad|IPHONE_|IPAD_)\b/i.test(trimmed)) {
      continue;
    }
    const ready = /\b(ready|done|uploaded|upload-ready)\b/i.test(trimmed);
    if (!ready) {
      continue;
    }
    if (!/\b\d{3,4}x\d{3,4}\b/.test(trimmed)) {
      issues.push(issue("error", "store_screenshots.ready_well_dimensions_missing", `Ready Apple screenshot row needs exact dimensions: "${trimmed}"`, file));
    }
    if (!/\b(ASC device_type|device_type|IPHONE_[A-Z0-9_]+|IPAD_[A-Z0-9_]+)\b/i.test(trimmed)) {
      issues.push(issue("error", "store_screenshots.ready_well_device_type_missing", `Ready Apple screenshot row needs ASC device_type or equivalent: "${trimmed}"`, file));
    }
    const countMatch = trimmed.match(/\b(\d{1,2})\s+screenshots?\b|\b(?:count|screenshots?)\s*:?\s*(\d{1,2})\b/i);
    if (!countMatch) {
      issues.push(issue("error", "store_screenshots.ready_well_count_missing", `Ready Apple screenshot row needs screenshot count between 1 and 10: "${trimmed}"`, file));
    } else {
      const count = Number(countMatch[1] ?? countMatch[2]);
      if (!Number.isInteger(count) || count < 1 || count > 10) {
        issues.push(issue("error", "store_screenshots.ready_well_count_invalid", `Apple screenshot count must be 1-10: "${trimmed}"`, file));
      }
    }
  }
}

function hasProductionComposition(text: string): boolean {
  return /\b(production composition|composed|framed|device frame|copy overlay|headline|export matrix|final upload|mockup|screenshot html|app store screenshot)\b/i.test(
    text,
  );
}

function checkRawOnlyReadiness(text: string, file: string, storeStatus?: string): void {
  const claimsReady = storeStatus === "done" || /\b(done|complete|launch-ready|ready|upload-ready|production-ready)\b/i.test(text);
  const rawMentions = /\b(raw|plain)\s+(device\s+)?screenshots?\b/i.test(text);

  if (claimsReady && rawMentions && !hasProductionComposition(text)) {
    issues.push(
      issue(
        "error",
        "store_screenshots.raw_only_ready",
        "Screenshot work cannot be marked ready from raw/plain captures alone; final App Store compositions need copy, frames, dimensions, and QA proof.",
        file,
      ),
    );
  }

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    const rawUploadClaim = /\b(raw|plain)\s+(device\s+)?screenshots?\b/i.test(trimmed) && /\b(upload|ready|final|complete|done)\b/i.test(trimmed);
    if (rawUploadClaim && !/\b(compos|frame|proof|source layer|intermediate)\b/i.test(trimmed)) {
      issues.push(
        issue(
          "error",
          "store_screenshots.raw_capture_as_final",
          `Raw screenshot line appears to treat capture as final upload art: "${trimmed}"`,
          file,
        ),
      );
    }
  }
}

function checkFinalPaths(text: string, file: string): void {
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || !/\b(final upload|screenshots\/final|upload path)\b/i.test(trimmed)) {
      continue;
    }
    if (/screenshots\/raw\//i.test(trimmed)) {
      issues.push(issue("error", "store_screenshots.raw_path_used_as_final", `Final upload row should not point at a raw capture path: "${trimmed}"`, file));
    }
  }
}

const platforms = state ? asArray(getPath(state, "project.platforms")).map((item) => asString(item)?.toLowerCase()).filter((item): item is string => Boolean(item)) : [];
const iosBundleId = state ? asString(getPath(state, "project.bundle_ids.ios")) : undefined;
const androidBundleId = state ? asString(getPath(state, "project.bundle_ids.android")) : undefined;
const hasIos = state ? platforms.includes("ios") || Boolean(iosBundleId?.trim()) : true;
const hasAndroid = state ? platforms.includes("android") || Boolean(androidBundleId?.trim()) : true;
const storeStatus = state ? asString(getPath(state, "lanes.store_console.status"))?.toLowerCase() : undefined;
const storeSkipped = ["not_needed", "deferred"].includes(storeStatus ?? "");
const shouldCheck = !storeSkipped && (hasIos || hasAndroid || !state);

const screenshotPacket = firstExistingText(["SCREENSHOTS.md", "screenshots/SCREENSHOTS.md", "app-store-listing/SCREENSHOTS.md"]);
const appListing = firstExistingText(["APP_STORE_LISTING.md", "app-store-listing/APP_STORE_LISTING.md"]);
const contentAssets = firstExistingText(["CONTENT_ASSETS.md", "content-assets/CONTENT_ASSETS.md"]);
const screenshotHtml = existsAny(["screenshots/index.html", "screenshots/screenshots.html", "app-store-listing/screenshots.html"]);
const appStoreScreenshotsState = existsAny(["app-store-screenshots.json", "screenshots/app-store-screenshots.json", "app-store-listing/app-store-screenshots.json"]);

if (shouldCheck && !screenshotPacket) {
  issues.push(
    issue(
      "error",
      "store_screenshots.markdown_missing",
      "SCREENSHOTS.md is required for store screenshot capture, composition, device wells, copy, dimensions, and upload proof.",
      "SCREENSHOTS.md",
    ),
  );
}

if (screenshotPacket) {
  const required = [
    "Raw Capture Matrix",
    "Production Composition Matrix",
    "Device Wells",
    "headline",
    "copy overlay",
    "DESIGN.md",
    "11_STAR_EXPERIENCE.md",
    "MobAI",
    "Higgsfield",
    "Remotion",
    "ParthJadhav/app-store-screenshots",
    "app-store-screenshots.json",
    "App Icon",
    "App Preview",
    "App Preview Video",
    "autoplay",
    "poster frame",
    "Asset Knowledge Brief",
    "app-preview-video",
    "RESEARCH.md",
    "EMOTIONAL_DESIGN.md",
    "asc-screenshot-resize",
    "asc-shots-pipeline",
    "ASC device_type",
    "screenshot count",
    "required",
    "scaled",
    "version localization ID",
    "alpha",
    "color space",
    "sRGB",
    "thumbnail",
    "visual QA",
    "founder approval",
  ];

  if (hasIos) {
    required.push("iPhone", "iPad");
  }
  if (hasAndroid) {
    required.push("Google Play", "feature graphic");
  }

  requirePhrases(screenshotPacket.text, required, "store_screenshots", screenshotPacket.relativePath);
  checkRawOnlyReadiness(screenshotPacket.text, screenshotPacket.relativePath, storeStatus);
  checkReadyDeviceRows(screenshotPacket.text, screenshotPacket.relativePath);
  checkFinalPaths(screenshotPacket.text, screenshotPacket.relativePath);

  const usesAppStoreScreenshots = /ParthJadhav\/app-store-screenshots|app-store-screenshots/i.test(screenshotPacket.text);
  if (storeStatus === "done" && usesAppStoreScreenshots && !appStoreScreenshotsState && !screenshotHtml) {
    issues.push(
      issue(
        "error",
        "store_screenshots.app_store_screenshots_board_missing",
        "A done screenshot lane that uses ParthJadhav/app-store-screenshots must have a saved board/state file present (app-store-screenshots.json or screenshots/index.html), not just a reference to it.",
        screenshotPacket.relativePath,
      ),
    );
  }

  const usesGeneratedOrRenderedRoute = /\b(Higgsfield|Remotion)\b/i.test(screenshotPacket.text);
  if (storeStatus === "done" && usesGeneratedOrRenderedRoute && !contentAssets) {
    issues.push(
      issue(
        "error",
        "store_screenshots.content_assets_missing",
        "Done screenshot packets that use Higgsfield or Remotion must link to CONTENT_ASSETS.md for route, license, source input, output, and approval proof.",
        screenshotPacket.relativePath,
      ),
    );
  }

  if (storeStatus === "done" && !screenshotHtml) {
    issues.push(
      issue(
        "warning",
        "store_screenshots.html_missing",
        "Done screenshot packets should include screenshots/index.html or an equivalent screenshot composition/export board.",
        "screenshots/index.html",
      ),
    );
  }
}

if (shouldCheck && appListing) {
  requirePhrases(
    appListing.text,
    ["SCREENSHOTS.md", "App Icon", "App Preview", "iPad", "copy overlay", "ParthJadhav/app-store-screenshots", "asc-shots-pipeline"],
    "app_store_listing.screenshot_contract",
    appListing.relativePath,
  );
}

reportAndExit("Store screenshots packet check", issues);

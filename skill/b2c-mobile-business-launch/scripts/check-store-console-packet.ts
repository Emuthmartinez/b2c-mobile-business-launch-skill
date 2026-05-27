#!/usr/bin/env node
import { existsSync } from "node:fs";
import path from "node:path";
import { asArray, asString, getPath, issue, loadProjectState, parseCliArgs, readText, reportAndExit } from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const loaded = loadProjectState(args);
const issues = [...loaded.issues];
const state = loaded.state;
const markdownPath = "STORE_CONSOLE.md";
const htmlPath = "store-console.html";
const markdown = readText(args.root, markdownPath);
const htmlExists = existsSync(path.join(args.root, htmlPath));

function collisionFallbackLines(markdownText: string): string[] {
  return markdownText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /(fallback name|name already in use|app name already in use|name collision)/i.test(line));
}

function hasFounderStopGuard(line: string): boolean {
  if (/\b(without|no)\s+founder approval\b/i.test(line)) {
    return false;
  }
  return /(founder approval|founder-approved|stop|do not continue|do not retry|must not retry|requires approval|ask the founder|confirm with the founder)/i.test(line);
}

const platforms = state ? asArray(getPath(state, "project.platforms")).map((item) => asString(item)?.toLowerCase()).filter((item): item is string => Boolean(item)) : [];
const iosBundleId = state ? asString(getPath(state, "project.bundle_ids.ios")) : undefined;
const androidBundleId = state ? asString(getPath(state, "project.bundle_ids.android")) : undefined;
const hasIos = state ? platforms.includes("ios") || Boolean(iosBundleId?.trim()) : true;
const hasAndroid = state ? platforms.includes("android") || Boolean(androidBundleId?.trim()) : true;

if (!markdown) {
  issues.push(issue("error", "store_console.markdown_missing", "STORE_CONSOLE.md is required for copy-paste App Store Connect and Google Play guidance.", markdownPath));
} else {
  const requiredPhrases = [
    "click path",
    "privacy",
    "screenshots",
    "review notes",
    "account deletion",
    "founder approval",
  ];
  if (hasIos) {
    requiredPhrases.push(
      "App Store Connect",
      "SKU",
      "primary locale",
      "bundle ID",
    );
  }
  if (hasAndroid) {
    requiredPhrases.push("Google Play", "Data safety", "package name");
  }

  for (const phrase of requiredPhrases) {
    if (!markdown.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(issue("error", `store_console.${phrase.replaceAll(" ", "_").toLowerCase()}.missing`, `STORE_CONSOLE.md should include ${phrase}.`, markdownPath));
    }
  }

  for (const line of collisionFallbackLines(markdown)) {
    if (!hasFounderStopGuard(line)) {
      issues.push(
        issue(
          "error",
          "store_console.unapproved_name_fallback",
          `Name collision or fallback-name instruction must stop for founder approval on the same line: "${line}"`,
          markdownPath,
        ),
      );
    }
  }

  const guardedTerms = ["App Store Connect", "Google Play", "privacy", "Data safety", "screenshots", "review notes", "account deletion", "SKU", "primary locale", "bundle ID", "package name"];
  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || /^(if|when|before|after)\b/i.test(trimmed)) {
      continue;
    }
    const mentionsStoreTerm = guardedTerms.some((term) => trimmed.toLowerCase().includes(term.toLowerCase()));
    const unresolved = /\b(TODO|TBD|unknown|missing|not configured|not set|placeholder|fill in|to fill|N\/A)\b/i.test(trimmed);
    if (mentionsStoreTerm && unresolved) {
      issues.push(issue("error", "store_console.placeholder_or_unknown", `Store console packet contains unresolved placeholder state: "${trimmed}"`, markdownPath));
    }
  }
}

if (!htmlExists) {
  issues.push(issue("warning", "store_console.html_missing", "store-console.html should render the copy-paste console packet for the founder.", htmlPath));
}

reportAndExit("Store console packet check", issues);

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
const appListingPath = "APP_STORE_LISTING.md";
const appListingHtmlPath = "app-store-listing.html";
const appPrivacyQuestionnairePath = "app-privacy-questionnaire.html";
const markdown = readText(args.root, markdownPath);
const htmlExists = existsSync(path.join(args.root, htmlPath));

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

const appListingMarkdown = firstExistingText([appListingPath, `app-store-listing/${appListingPath}`]);
const appListingHtml = existsAny([appListingHtmlPath, `app-store-listing/${appListingHtmlPath}`]);
const appPrivacyQuestionnaire = existsAny([appPrivacyQuestionnairePath, `app-store-listing/${appPrivacyQuestionnairePath}`]);

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

function missingPhraseCode(prefix: string, phrase: string): string {
  return `${prefix}.${phrase.replaceAll(" ", "_").toLowerCase()}.missing`;
}

function requirePhrases(text: string, phrases: string[], prefix: string, file: string): void {
  for (const phrase of phrases) {
    if (!text.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(issue("error", missingPhraseCode(prefix, phrase), `${file} should include ${phrase}.`, file));
    }
  }
}

function checkUnresolvedStoreLines(text: string, file: string, terms: string[]): void {
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || /^(if|when|before|after)\b/i.test(trimmed)) {
      continue;
    }
    const mentionsStoreTerm = terms.some((term) => trimmed.toLowerCase().includes(term.toLowerCase()));
    const unresolved = /\b(TODO|TBD|unknown|missing|not configured|not set|placeholder|fill in|to fill|pending|blocked|N\/A)\b/i.test(trimmed);
    if (mentionsStoreTerm && unresolved) {
      issues.push(issue("error", "store_console.placeholder_or_unknown", `Store packet contains unresolved placeholder state: "${trimmed}"`, file));
    }
  }
}

const platforms = state ? asArray(getPath(state, "project.platforms")).map((item) => asString(item)?.toLowerCase()).filter((item): item is string => Boolean(item)) : [];
const iosBundleId = state ? asString(getPath(state, "project.bundle_ids.ios")) : undefined;
const androidBundleId = state ? asString(getPath(state, "project.bundle_ids.android")) : undefined;
const hasIos = state ? platforms.includes("ios") || Boolean(iosBundleId?.trim()) : true;
const hasAndroid = state ? platforms.includes("android") || Boolean(androidBundleId?.trim()) : true;
const revenueStatus = state ? asString(getPath(state, "lanes.revenue.status"))?.toLowerCase() : undefined;
const revenueInScope = !state || !["not_needed", "deferred"].includes(revenueStatus ?? "");

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
      "App Privacy",
      "SKU",
      "primary locale",
      "bundle ID",
      "pricing",
      "localization",
      "custom product page",
      "In-App Event",
      "Higgsfield",
    );
    if (revenueInScope) {
      requiredPhrases.push("RevenueCat", "subscription");
    }
  }
  if (hasAndroid) {
    requiredPhrases.push("Google Play", "Data safety", "package name");
  }

  requirePhrases(markdown, requiredPhrases, "store_console", markdownPath);

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

  const guardedTerms = [
    "App Store Connect",
    "Google Play",
    "privacy",
    "App Privacy",
    "Data safety",
    "pricing",
    "RevenueCat",
    "subscription",
    "custom product page",
    "In-App Event",
    "localization",
    "Higgsfield",
    "screenshots",
    "review notes",
    "account deletion",
    "SKU",
    "primary locale",
    "bundle ID",
    "package name",
  ];
  checkUnresolvedStoreLines(markdown, markdownPath, guardedTerms);
}

if (!htmlExists) {
  issues.push(issue("warning", "store_console.html_missing", "store-console.html should render the copy-paste console packet for the founder.", htmlPath));
}

if (hasIos) {
  if (!appListingMarkdown) {
    issues.push(issue("error", "store_console.app_store_listing.markdown_missing", "APP_STORE_LISTING.md is required for iOS listing, privacy, pricing, localization, and App Store marketing prep.", appListingPath));
  } else {
    const appListingRequiredPhrases = [
      "App Privacy",
      "pricing",
      "localization",
      "custom product page",
      "In-App Event",
      "Higgsfield",
      "founder approval",
    ];
    if (revenueInScope) {
      appListingRequiredPhrases.push("RevenueCat", "subscription");
    }
    requirePhrases(appListingMarkdown.text, appListingRequiredPhrases, "app_store_listing", appListingMarkdown.relativePath);
    checkUnresolvedStoreLines(appListingMarkdown.text, appListingMarkdown.relativePath, appListingRequiredPhrases);
  }

  if (!appListingHtml) {
    issues.push(issue("error", "store_console.app_store_listing.html_missing", "app-store-listing.html should render the iOS listing packet as a copy-paste founder surface.", appListingHtmlPath));
  }
  if (!appPrivacyQuestionnaire) {
    issues.push(issue("error", "store_console.app_privacy_questionnaire.html_missing", "app-privacy-questionnaire.html should render the interactive Apple App Privacy worksheet.", appPrivacyQuestionnairePath));
  }
}

reportAndExit("Store console packet check", issues);

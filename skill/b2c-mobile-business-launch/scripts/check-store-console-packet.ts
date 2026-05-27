#!/usr/bin/env node
import { existsSync } from "node:fs";
import path from "node:path";
import { issue, parseCliArgs, readText, reportAndExit } from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const issues = [];
const markdownPath = "STORE_CONSOLE.md";
const htmlPath = "store-console.html";
const markdown = readText(args.root, markdownPath);
const htmlExists = existsSync(path.join(args.root, htmlPath));

if (!markdown) {
  issues.push(issue("error", "store_console.markdown_missing", "STORE_CONSOLE.md is required for copy-paste App Store Connect and Google Play guidance.", markdownPath));
} else {
  const requiredPhrases = [
    "App Store Connect",
    "Google Play",
    "click path",
    "privacy",
    "Data safety",
    "screenshots",
    "review notes",
    "account deletion",
    "founder approval",
    "SKU",
    "primary locale",
    "bundle ID",
    "package name",
  ];

  for (const phrase of requiredPhrases) {
    if (!markdown.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(issue("error", `store_console.${phrase.replaceAll(" ", "_").toLowerCase()}.missing`, `STORE_CONSOLE.md should include ${phrase}.`, markdownPath));
    }
  }

  if (/fallback name|name already in use/i.test(markdown) && !/founder approval|stop/i.test(markdown)) {
    issues.push(issue("error", "store_console.unapproved_name_fallback", "Name collisions or fallback app names must stop for founder approval.", markdownPath));
  }
}

if (!htmlExists) {
  issues.push(issue("warning", "store_console.html_missing", "store-console.html should render the copy-paste console packet for the founder.", htmlPath));
}

reportAndExit("Store console packet check", issues);


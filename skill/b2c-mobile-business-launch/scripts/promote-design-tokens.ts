#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { asString, isRecord, reportAndExit, type Issue } from "./lib/launch-state.js";
import { getToken, loadDesignState, parseDesignCliArgs, rel } from "./lib/design-state.js";

const args = parseDesignCliArgs(process.argv.slice(2));
const loaded = loadDesignState(args);
const issues: Issue[] = [...loaded.issues];

if (loaded.tokens) {
  const outputDir = path.join(args.root, "design-system");
  const tokenHash = hashTokens(loaded.tokens);
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(path.join(outputDir, "tokens.json"), `${JSON.stringify({ tokenHash, source: "state/theme.tokens.json", ...asObject(loaded.tokens) }, null, 2)}\n`, "utf8");
  writeFileSync(path.join(outputDir, "tokens.css"), renderCss(loaded.tokens, tokenHash), "utf8");
  writeFileSync(path.join(outputDir, "DesignTokens.swift"), renderSwift(loaded.tokens, tokenHash), "utf8");
  console.log(`Promoted design tokens to ${rel(args.root, outputDir)} with hash ${tokenHash}`);
}

reportAndExit("Design token promotion", issues);

function asObject(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function hashTokens(tokens: unknown): string {
  return createHash("sha256").update(JSON.stringify(tokens)).digest("hex").slice(0, 16);
}

function renderCss(tokens: unknown, tokenHash: string): string {
  const cssVars: Array<readonly [string, string]> = [
    ["color-background", "color.background"],
    ["color-surface", "color.surface"],
    ["color-surface-elevated", "color.surfaceElevated"],
    ["color-primary", "color.primary"],
    ["color-accent", "color.accent"],
    ["color-text", "color.text"],
    ["color-muted", "color.muted"],
    ["color-border", "color.border"],
    ["color-success", "color.success"],
    ["color-warning", "color.warning"],
    ["color-danger", "color.danger"],
    ["font-display", "font.display.family"],
    ["font-body", "font.body.family"],
    ["radius-sm", "radius.sm"],
    ["radius-md", "radius.md"],
    ["radius-lg", "radius.lg"],
    ["space-xs", "space.xs"],
    ["space-sm", "space.sm"],
    ["space-md", "space.md"],
    ["space-lg", "space.lg"],
    ["space-xl", "space.xl"],
    ["motion-duration-fast", "motion.durationFast"],
    ["motion-duration-base", "motion.durationBase"],
    ["motion-easing", "motion.easing"],
  ];

  return [
    `/* design-token-hash: ${tokenHash} */`,
    ":root {",
    ...cssVars.map(([name, tokenPath]) => `  --${name}: ${String(getToken(tokens, tokenPath) ?? "")};`),
    "}",
    "",
  ].join("\n");
}

function renderSwift(tokens: unknown, tokenHash: string): string {
  const displayFont = stringLiteral(asString(getToken(tokens, "font.display.family")) ?? "");
  const bodyFont = stringLiteral(asString(getToken(tokens, "font.body.family")) ?? "");
  return [
    `// design-token-hash: ${tokenHash}`,
    "import Foundation",
    "",
    "enum DesignTokens {",
    "  enum Color {",
    `    static let background = "${String(getToken(tokens, "color.background") ?? "")}"`,
    `    static let surface = "${String(getToken(tokens, "color.surface") ?? "")}"`,
    `    static let primary = "${String(getToken(tokens, "color.primary") ?? "")}"`,
    `    static let accent = "${String(getToken(tokens, "color.accent") ?? "")}"`,
    `    static let text = "${String(getToken(tokens, "color.text") ?? "")}"`,
    "  }",
    "  enum Font {",
    `    static let displayFamily = ${displayFont}`,
    `    static let bodyFamily = ${bodyFont}`,
    "  }",
    "  enum Radius {",
    `    static let sm = "${String(getToken(tokens, "radius.sm") ?? "")}"`,
    `    static let md = "${String(getToken(tokens, "radius.md") ?? "")}"`,
    `    static let lg = "${String(getToken(tokens, "radius.lg") ?? "")}"`,
    "  }",
    "}",
    "",
  ].join("\n");
}

function stringLiteral(value: string): string {
  return JSON.stringify(value);
}

#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  asArray,
  asBoolean,
  asString,
  collectFiles,
  getPath,
  issue,
  loadProjectState,
  parseCliArgs,
  reportAndExit,
} from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const loaded = loadProjectState(args);
const issues = [...loaded.issues];
const state = loaded.state;
const canonicalEventName = "attribution_source_selected";

function findImplementationText(root: string, needles: string[]): Map<string, string[]> {
  const found = new Map<string, string[]>();
  const ignoredFiles = new Set(["PROJECT_STATE.yaml", "PROJECT_STATE.yml", "launch-cockpit.html"]);
  const extensions = new Set([".md", ".ts", ".tsx", ".js", ".jsx", ".swift", ".kt", ".java", ".dart", ".yaml", ".yml", ".html"]);

  for (const file of collectFiles(root, extensions)) {
    const relative = path.relative(root, file);
    if (
      ignoredFiles.has(relative) ||
      relative.startsWith("templates/") ||
      relative.startsWith("repo-agent-entrypoints/") ||
      relative.startsWith("agents/") ||
      relative.startsWith("app-agent-roster/") ||
      ["APP_AGENTS.md", "AGENTS.md", "CLAUDE.md"].includes(relative)
    ) {
      continue;
    }
    const text = readFileSync(file, "utf8");
    for (const needle of needles) {
      if (text.includes(needle)) {
        const matches = found.get(needle) ?? [];
        matches.push(relative);
        found.set(needle, matches);
      }
    }
  }

  return found;
}

if (state) {
  const base = "lanes.analytics_attribution.attribution_contract";
  const laneStatus = asString(getPath(state, "lanes.analytics_attribution.status"));
  if (laneStatus !== "not_needed") {
    const requiredBooleans = [
      "screen_early",
      "other_free_text",
      "backend_persistence",
      "anonymous_reconciliation",
      "verified",
    ];

    for (const field of requiredBooleans) {
      if (asBoolean(getPath(state, `${base}.${field}`)) !== true) {
        issues.push(issue("error", `attribution.${field}.incomplete`, `${base}.${field} must be true before attribution is launch-ready.`, "PROJECT_STATE.yaml"));
      }
    }

    const eventName = asString(getPath(state, `${base}.event_name`));
    const found = findImplementationText(args.root, [canonicalEventName, eventName ?? "", "self_reported_source"].filter((item): item is string => Boolean(item)));
    if (eventName !== canonicalEventName) {
      const aliasReason = asString(getPath(state, `${base}.event_alias_reason`));
      const aliasDocumented = Boolean(
        eventName &&
          found.get(eventName)?.length &&
          found.get(canonicalEventName)?.length &&
          Array.from(found.values()).flat().some((file) => /analytics|attribution|launch_trace|tech_spec/i.test(file)),
      );
      if (!aliasReason?.trim() && !aliasDocumented) {
        issues.push(issue("error", "attribution.event_name.invalid", "Use attribution_source_selected as the canonical event name unless the docs record a deliberate alias.", "PROJECT_STATE.yaml"));
      } else {
        issues.push(issue("warning", "attribution.event_name.alias", `Using documented attribution event alias ${eventName}; keep dashboards mapped to ${canonicalEventName}.`, "PROJECT_STATE.yaml"));
      }
    }

    const stableKeys = asArray(getPath(state, `${base}.stable_source_keys`)).map((item) => asString(item)).filter((item): item is string => Boolean(item));
    for (const requiredKey of ["friend", "app_store_search", "creator", "ai_search", "other"]) {
      if (!stableKeys.includes(requiredKey)) {
        issues.push(issue("error", `attribution.stable_key.${requiredKey}.missing`, `Stable attribution key ${requiredKey} is missing.`, "PROJECT_STATE.yaml"));
      }
    }

    const personProperties = asArray(getPath(state, `${base}.person_properties`)).map((item) => asString(item)).filter((item): item is string => Boolean(item));
    if (!personProperties.includes("self_reported_source")) {
      issues.push(issue("error", "attribution.person_property.missing", "PostHog person properties must include self_reported_source.", "PROJECT_STATE.yaml"));
    }

    const requiresImplementationProof = laneStatus === "done" || asBoolean(getPath(state, `${base}.verified`)) === true;
    for (const needle of [eventName ?? canonicalEventName, "self_reported_source"]) {
      if (!found.has(needle)) {
        issues.push(
          issue(
            requiresImplementationProof ? "error" : "warning",
            `attribution.text.${needle}.not_found`,
            `${needle} was not found in implementation docs or code outside PROJECT_STATE.yaml. If this is generated later, keep the lane partial.`,
            args.root,
          ),
        );
      }
    }
  }
}

reportAndExit("Attribution contract check", issues);

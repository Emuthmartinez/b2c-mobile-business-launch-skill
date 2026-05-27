#!/usr/bin/env node
import {
  asArray,
  asBoolean,
  asString,
  findText,
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

if (state) {
  const base = "lanes.analytics_attribution.attribution_contract";
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
  if (eventName !== "attribution_source_selected") {
    issues.push(issue("error", "attribution.event_name.invalid", "Use attribution_source_selected as the canonical event name unless the docs record a deliberate alias.", "PROJECT_STATE.yaml"));
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

  const found = findText(args.root, ["attribution_source_selected", "self_reported_source"]);
  for (const needle of ["attribution_source_selected", "self_reported_source"]) {
    if (!found.has(needle)) {
      issues.push(issue("warning", `attribution.text.${needle}.not_found`, `${needle} was not found in docs or code. If this is generated later, keep the lane partial.`, args.root));
    }
  }
}

reportAndExit("Attribution contract check", issues);


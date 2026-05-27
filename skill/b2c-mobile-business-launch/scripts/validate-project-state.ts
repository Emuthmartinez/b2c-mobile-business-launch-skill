#!/usr/bin/env node
import { existsSync } from "node:fs";
import path from "node:path";
import {
  asArray,
  asString,
  autonomyModes,
  getPath,
  isRecord,
  issue,
  loadProjectState,
  parseCliArgs,
  reportAndExit,
  requiredLanes,
  requireStatus,
  requireString,
} from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const loaded = loadProjectState(args);
const issues = [...loaded.issues];
const state = loaded.state;

if (state) {
  requireString(state, "schema_version", issues);
  requireString(state, "updated_at", issues);
  const updatedAt = asString(getPath(state, "updated_at"));
  if (updatedAt && !/^\d{4}-\d{2}-\d{2}(?:T[\d:.+-]+Z?)?$/.test(updatedAt)) {
    issues.push(issue("error", "updated_at.placeholder", "updated_at must be a concrete ISO date, not a placeholder.", "PROJECT_STATE.yaml"));
  }
  requireString(state, "project.name", issues);
  requireString(state, "project.slug", issues);
  requireString(state, "project.phase", issues);

  const mode = asString(getPath(state, "autonomy.mode"));
  if (!mode || !autonomyModes.has(mode)) {
    issues.push(issue("error", "autonomy.mode.invalid", `autonomy.mode must be one of ${Array.from(autonomyModes).join(", ")}.`, "PROJECT_STATE.yaml"));
  }

  for (const lane of requiredLanes) {
    const lanePath = `lanes.${lane}`;
    if (!isRecord(getPath(state, lanePath))) {
      issues.push(issue("error", `${lanePath}.missing`, `${lanePath} is required.`, "PROJECT_STATE.yaml"));
      continue;
    }
    requireStatus(state, `${lanePath}.status`, issues);
    const evidence = asArray(getPath(state, `${lanePath}.evidence`));
    const nonEmptyEvidence = evidence.filter((item) => typeof item === "string" ? item.trim().length > 0 : Boolean(item));
    for (const [index, evidenceItem] of evidence.entries()) {
      if (typeof evidenceItem === "string" && evidenceItem.trim().length === 0) {
        issues.push(issue("error", `${lanePath}.evidence.${index}.blank`, `${lanePath}.evidence entries must not be blank.`, "PROJECT_STATE.yaml"));
      }
    }
    const status = asString(getPath(state, `${lanePath}.status`));
    if (status === "done" && nonEmptyEvidence.length === 0) {
      issues.push(issue("error", `${lanePath}.done_without_evidence`, `${lanePath} cannot be done without evidence paths.`, "PROJECT_STATE.yaml"));
    }
    const blockers = asArray(getPath(state, `${lanePath}.blockers`));
    const nonEmptyBlockers = blockers.filter((item) => typeof item === "string" ? item.trim().length > 0 : Boolean(item));
    for (const [index, blocker] of blockers.entries()) {
      if (typeof blocker === "string" && blocker.trim().length === 0) {
        issues.push(issue("error", `${lanePath}.blockers.${index}.blank`, `${lanePath}.blockers entries must not be blank.`, "PROJECT_STATE.yaml"));
      }
    }
    if (status === "blocked" && nonEmptyBlockers.length === 0) {
      issues.push(issue("error", `${lanePath}.blocked_without_blocker`, `${lanePath} is blocked but has no blocker.`, "PROJECT_STATE.yaml"));
    }
    if ((status === "deferred" || status === "not_needed") && nonEmptyBlockers.length === 0 && nonEmptyEvidence.length === 0) {
      issues.push(
        issue(
          "error",
          `${lanePath}.${status}_without_reason`,
          `${lanePath} is ${status} but has no evidence or blocker/reason explaining why.`,
          "PROJECT_STATE.yaml",
        ),
      );
    }
    if (status === "done") {
      for (const evidenceItem of evidence) {
        const evidencePath = asString(evidenceItem);
        if (!evidencePath || /^[a-z]+:/i.test(evidencePath) || evidencePath.startsWith("#")) {
          continue;
        }
        const localEvidencePath = path.join(args.root, evidencePath);
        if ((evidencePath.includes("/") || evidencePath.includes(".")) && !existsSync(localEvidencePath)) {
          issues.push(
            issue(
              "error",
              `${lanePath}.done_evidence_missing`,
              `${lanePath} is done but local evidence path does not exist: ${evidencePath}.`,
              "PROJECT_STATE.yaml",
            ),
          );
        }
      }
    }
  }

  const tools = getPath(state, "tools");
  if (!isRecord(tools)) {
    issues.push(issue("error", "tools.missing", "tools must map provider names to route, docs, secrets, preflight, validation, and fallback state.", "PROJECT_STATE.yaml"));
  } else {
    for (const [toolName, value] of Object.entries(tools)) {
      if (!isRecord(value)) {
        issues.push(issue("error", `tools.${toolName}.invalid`, `tools.${toolName} must be an object.`, "PROJECT_STATE.yaml"));
        continue;
      }
      for (const field of ["route", "preflight", "validation", "fallback"]) {
        if (!asString(value[field])?.trim()) {
          issues.push(issue("warning", `tools.${toolName}.${field}.missing`, `tools.${toolName}.${field} should be recorded.`, "PROJECT_STATE.yaml"));
        }
      }
      const requiredSecrets = asArray(value.required_secrets);
      for (const secretName of requiredSecrets) {
        if (!asString(secretName)?.trim()) {
          issues.push(issue("error", `tools.${toolName}.required_secrets.invalid`, `tools.${toolName}.required_secrets must contain names only.`, "PROJECT_STATE.yaml"));
        }
      }
    }
  }

  const activeCards = asArray(getPath(state, "failure_cards.active"));
  for (const [index, card] of activeCards.entries()) {
    if (!isRecord(card)) {
      issues.push(issue("error", `failure_cards.active.${index}.invalid`, "Each active failure card must be an object.", "PROJECT_STATE.yaml"));
      continue;
    }
    for (const field of ["id", "severity", "owner", "status", "next_action"]) {
      if (!asString(card[field])?.trim()) {
        issues.push(issue("error", `failure_cards.active.${index}.${field}.missing`, `Active failure card ${index} is missing ${field}.`, "PROJECT_STATE.yaml"));
      }
    }
  }
}

reportAndExit("PROJECT_STATE validation", issues);

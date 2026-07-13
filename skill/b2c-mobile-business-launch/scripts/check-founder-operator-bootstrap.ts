#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { Ajv2020, type AnySchema, type ErrorObject } from "ajv/dist/2020.js";
import { asArray, asString, getPath, isRecord, issue, loadProjectState, parseCliArgs, readText, reportAndExit, type Issue } from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const loaded = loadProjectState(args);
const issues: Issue[] = [...loaded.issues];
const stateOperator = loaded.state ? getPath(loaded.state, "business_operator") : undefined;
const humanPath = "BUSINESS_ACCESS.md";
const ledgerRelative = "operations/business-access.json";
const schemaRelative = "operations/business-access.schema.json";
const ledgerPath = path.join(args.root, ledgerRelative);
const schemaPath = path.join(args.root, schemaRelative);
const human = readText(args.root, humanPath);
const cockpit = readText(args.root, "launch-cockpit.html");

if (!isRecord(stateOperator)) {
  issues.push(issue("error", "founder_operator.state_missing", "PROJECT_STATE.yaml must include business_operator state.", "PROJECT_STATE.yaml"));
} else {
  requireStateValue("founder_experience", "beginner_assumed");
  requireStateValue("agent_role", "business_operator");
  requireStateValue("human_log", humanPath);
  requireStateValue("structured_ledger", ledgerRelative);
}

if (!human) {
  issues.push(issue("error", "founder_operator.human_log_missing", "Seed BUSINESS_ACCESS.md before broad business setup.", humanPath));
} else {
  for (const phrase of [
    "Founder-Zero Promise",
    "One Next Action",
    "Business Identity",
    "Doppler Setup",
    "Account And Social Access",
    "Delegated Access First",
    "Recovery And 2FA",
    "Authorization Boundaries",
    "Operator Handoff",
  ]) {
    if (!human.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(issue("error", `founder_operator.human_${code(phrase)}_missing`, `BUSINESS_ACCESS.md must include ${phrase}.`, humanPath));
    }
  }
  for (const phrase of ["agent runs setup", "one plain-language step at a time", "Doppler stores automation secrets", "Browser passwords/passkeys"]) {
    if (!human.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(issue("error", `founder_operator.promise_${code(phrase)}_missing`, `BUSINESS_ACCESS.md must state: ${phrase}.`, humanPath));
    }
  }
  scanForSecrets(human, humanPath);
}

for (const [relative, codeValue, message] of [
  [ledgerRelative, "founder_operator.ledger_missing", "operations/business-access.json is required."],
  [schemaRelative, "founder_operator.schema_missing", "operations/business-access.schema.json is required."],
] as const) {
  if (!existsSync(path.join(args.root, relative))) issues.push(issue("error", codeValue, message, relative));
}

let ledger: Record<string, unknown> | undefined;
if (existsSync(ledgerPath)) {
  try {
    const parsed: unknown = JSON.parse(readFileSync(ledgerPath, "utf8"));
    if (isRecord(parsed)) ledger = parsed;
    else issues.push(issue("error", "founder_operator.ledger_not_object", "Business access ledger must be a JSON object.", ledgerRelative));
  } catch (error) {
    issues.push(issue("error", "founder_operator.ledger_invalid_json", `Business access ledger is invalid JSON: ${errorMessage(error)}`, ledgerRelative));
  }
}

if (ledger && existsSync(schemaPath)) {
  validateSchema(ledger);
  validateSemantics(ledger);
  scanForSecrets(readFileSync(ledgerPath, "utf8"), ledgerRelative);
}

reportAndExit("Founder-zero business operator check", issues);

function requireStateValue(key: string, expected: string): void {
  if (isRecord(stateOperator) && asString(stateOperator[key]) !== expected) {
    issues.push(issue("error", `founder_operator.state_${key}_invalid`, `business_operator.${key} must be ${expected}.`, "PROJECT_STATE.yaml"));
  }
}

function validateSchema(value: Record<string, unknown>): void {
  try {
    const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as AnySchema;
    const ajv = new Ajv2020({ allErrors: true, strict: false, validateFormats: true });
    ajv.addFormat("date-time", { type: "string", validate: isDateTime });
    const validate = ajv.compile(schema);
    if (!validate(value)) {
      for (const error of validate.errors ?? []) {
        issues.push(issue("error", "founder_operator.schema_invalid", `${error.instancePath || "/"} ${formatSchemaError(error)}`, ledgerRelative));
      }
    }
  } catch (error) {
    issues.push(issue("error", "founder_operator.schema_unreadable", `Business access schema could not be compiled: ${errorMessage(error)}`, schemaRelative));
  }
}

function validateSemantics(value: Record<string, unknown>): void {
  const founder = isRecord(value.founderModel) ? value.founderModel : {};
  const doppler = isRecord(value.doppler) ? value.doppler : {};
  const accounts = asArray(value.accounts).filter(isRecord);
  const requiredIds = ["business_email", "domain", "apple", "google", "x", "meta", "tiktok", "youtube"];
  const canonicalKinds: Record<string, string> = {
    business_email: "support",
    domain: "infrastructure",
    apple: "store",
    google: "store",
    x: "social",
    meta: "social",
    tiktok: "social",
    youtube: "social",
  };
  const ids = accounts.map((entry) => asString(entry.id) ?? "");

  if (new Set(ids).size !== ids.length) {
    issues.push(issue("error", "founder_operator.account_id_duplicate", "Business access account IDs must be unique.", ledgerRelative));
  }
  for (const id of requiredIds) {
    if (!ids.includes(id))
      issues.push(issue("error", `founder_operator.account_${id}_missing`, `Business access inventory must include ${id}.`, ledgerRelative));
  }
  for (const [index, account] of accounts.entries()) {
    const id = asString(account.id) ?? "";
    if (canonicalKinds[id] && account.kind !== canonicalKinds[id]) {
      issues.push(issue("error", `founder_operator.account_${index}.kind_invalid`, `${id} must use canonical kind ${canonicalKinds[id]}.`, ledgerRelative));
    }
  }

  if (
    founder.assumedExperience !== "beginner" ||
    founder.agentRole !== "business_operator" ||
    founder.interactionMode !== "plain_language_one_step_at_a_time" ||
    founder.founderOwnsBusiness !== true ||
    founder.agentDrivesExecution !== true ||
    founder.neverDumpChecklist !== true
  ) {
    issues.push(
      issue(
        "error",
        "founder_operator.founder_zero_contract_invalid",
        "Assume a beginner founder, lead execution, preserve founder ownership, and present one plain-language action at a time.",
        ledgerRelative,
      ),
    );
  }

  const activeGate = isRecord(founder.activeFounderGate) ? founder.activeFounderGate : {};
  const gateFields = ["id", "actionType", "target", "whatThisIs", "whyNow", "founderAction", "agentActionNext", "successProof"];
  if (gateFields.some((key) => !asString(activeGate[key])?.trim())) {
    issues.push(
      issue(
        "error",
        "founder_operator.active_gate_incomplete",
        "The single active founder gate needs what this is, why now, one founder action, the agent's next action, and success proof.",
        ledgerRelative,
      ),
    );
  }
  if (activeGate.founderAction !== founder.nextFounderAction || activeGate.agentActionNext !== founder.nextAgentAction) {
    issues.push(issue("error", "founder_operator.active_gate_drift", "Active founder gate actions must match the canonical next actions.", ledgerRelative));
  }
  validateSingleFounderAction(asString(founder.nextFounderAction));
  const nextAgentAction = asString(founder.nextAgentAction) ?? "";
  const nextBusinessOperation = asString(founder.nextBusinessOperation) ?? "";
  if (
    !nextBusinessOperation.trim() ||
    /\b(?:wait for|come back|tell me when|let me know when|ask the founder to|founder (?:finishes|completes|sets up)|manually (?:set up|complete)|before work continues)\b/i.test(
      nextAgentAction,
    )
  ) {
    issues.push(
      issue(
        "error",
        "founder_operator.agent_dead_end",
        "The agent must own the immediate execution step and name the business operation that follows access; it cannot stop at instructions.",
        ledgerRelative,
      ),
    );
  }
  if (value.status !== "not_started" && !isDateTime(asString(value.updatedAt))) {
    issues.push(issue("error", "founder_operator.updated_at_missing", "Active, blocked, or ready operator state needs updatedAt.", ledgerRelative));
  }

  validateDoppler(doppler);
  for (const [index, account] of accounts.entries()) validateAccount(account, index);
  validateState(value, founder, doppler, accounts);
}

function validateDoppler(doppler: Record<string, unknown>): void {
  if (doppler.status === "not_needed" && !isMeaningfulReason(asString(doppler.statusReason))) {
    issues.push(issue("error", "founder_operator.doppler_not_needed_unreasoned", "Doppler not_needed needs a traceable reason.", ledgerRelative));
  }
  if (doppler.status !== "ready") return;
  const required = [
    asString(doppler.cliVersion),
    asString(doppler.authenticatedAccountLabel),
    asString(doppler.project),
    asString(doppler.operatorIdentityLabel),
    asString(doppler.operatorRole),
    asString(doppler.revocationPath),
  ];
  if (required.some((value) => !value?.trim()) || asArray(doppler.configs).length === 0 || !isDateTime(asString(doppler.docsCheckedAt))) {
    issues.push(
      issue(
        "error",
        "founder_operator.doppler_ready_unproven",
        "Ready Doppler needs current docs/CLI version, safe authenticated account label, exact project, and real config names.",
        ledgerRelative,
      ),
    );
  }
  if (
    doppler.workspaceOwner !== "founder" ||
    doppler.recoveryOwner !== "founder" ||
    doppler.mfaOwner !== "founder" ||
    !["delegated_role", "service_token", "oidc", "integration"].includes(asString(doppler.authenticationMethod) ?? "")
  ) {
    issues.push(
      issue(
        "error",
        "founder_operator.doppler_ownership_invalid",
        "Ready Doppler must be founder-owned and recoverable, with a named scoped operator identity and revocable authentication route.",
        ledgerRelative,
      ),
    );
  }
  requireProof(asString(doppler.proofPath), "founder_operator.doppler_proof_missing", "Ready Doppler needs a safe repo-relative smoke-proof artifact.");
}

function validateAccount(account: Record<string, unknown>, index: number): void {
  if (account.status === "not_needed" && !isMeaningfulReason(asString(account.statusReason))) {
    issues.push(issue("error", `founder_operator.account_${index}.not_needed_unreasoned`, "Account not_needed needs a traceable reason.", ledgerRelative));
  }
  if (account.status !== "access_ready") return;
  const prefix = `founder_operator.account_${index}`;
  for (const key of [
    "exactAccount",
    "businessAsset",
    "owner",
    "operatorIdentityLabel",
    "operatorRole",
    "delegatedBy",
    "revocationPath",
    "recoveryOwner",
    "mfaOwner",
  ]) {
    if (!asString(account[key])?.trim()) issues.push(issue("error", `${prefix}.${code(key)}_missing`, `Access-ready account needs ${key}.`, ledgerRelative));
  }
  if (
    !["founder", "founder_controlled_business"].includes(asString(account.owner) ?? "") ||
    account.recoveryOwner !== "founder" ||
    account.mfaOwner !== "founder"
  ) {
    issues.push(issue("error", `${prefix}.founder_recovery_control_missing`, "Founder must retain recovery and 2FA ownership.", ledgerRelative));
  }
  if (["not_selected", "manual_founder_only"].includes(asString(account.accessMethod) ?? "")) {
    issues.push(issue("error", `${prefix}.operator_access_missing`, "Access-ready account needs a working revocable operator access route.", ledgerRelative));
  }
  if (!isDateTime(asString(account.checkedAt))) {
    issues.push(issue("error", `${prefix}.checked_at_missing`, "Access-ready account needs a checkedAt timestamp.", ledgerRelative));
  }
  const grantedScopes = asArray(account.grantedScopes)
    .map(asString)
    .filter((value): value is string => Boolean(value));
  if (grantedScopes.length === 0) {
    issues.push(issue("error", `${prefix}.granted_scopes_missing`, "Access-ready account needs explicit observed operator scopes.", ledgerRelative));
  }
  const booleanScopeMap: Record<string, string> = {
    canObserve: "observe",
    canDraft: "draft",
    canPublish: "publish",
    canReply: "reply",
    canModerate: "moderate",
    canViewAnalytics: "analytics",
    canSpend: "spend",
    canChangeIdentity: "identity_change",
    canDelete: "delete",
  };
  for (const [flag, scope] of Object.entries(booleanScopeMap)) {
    if ((account[flag] === true) !== grantedScopes.includes(scope)) {
      issues.push(issue("error", `${prefix}.${code(flag)}_scope_mismatch`, `${flag} and grantedScopes.${scope} must agree exactly.`, ledgerRelative));
    }
  }
  requireProof(asString(account.proofPath), `${prefix}.proof_missing`, "Access-ready account needs sanitized proof.");

  if (account.kind === "social" && account.accessMethod === "authenticated_browser_session" && asArray(account.limitations).length === 0) {
    issues.push(
      issue(
        "error",
        `${prefix}.browser_session_limit_missing`,
        "Social browser-session access needs the delegation gap and session limitation recorded.",
        ledgerRelative,
      ),
    );
  }
  if (account.kind === "social" && ["api_token", "service_account"].includes(asString(account.accessMethod) ?? "")) {
    if (
      asArray(account.limitations).length === 0 ||
      asArray(account.secretNames).length === 0 ||
      !isMeaningfulReason(asString(account.delegationGapReason)) ||
      !asString(account.tokenScopeSource)?.trim() ||
      !asString(account.rotationOrExpiry)?.trim()
    ) {
      issues.push(
        issue(
          "error",
          `${prefix}.exceptional_social_access_unproven`,
          "Exceptional token/service social access needs the delegation gap, scoped secret names, limitations, and revocation proof.",
          ledgerRelative,
        ),
      );
    }
  }
  if (
    ["canPublish", "canReply", "canModerate", "canSpend", "canChangeIdentity", "canDelete"].some((flag) => account[flag] === true) &&
    account.approvalRequired !== true
  ) {
    issues.push(
      issue(
        "error",
        `${prefix}.approval_boundary_missing`,
        "Externally mutating capability must still require an Agent Operations approval envelope.",
        ledgerRelative,
      ),
    );
  }
}

function validateState(
  value: Record<string, unknown>,
  founder: Record<string, unknown>,
  doppler: Record<string, unknown>,
  accounts: Record<string, unknown>[],
): void {
  if (!isRecord(stateOperator)) return;
  const readyCount = accounts.filter((entry) => entry.status === "access_ready").length;
  const socialStatus = deriveSocialStatus(accounts.filter((entry) => entry.kind === "social"));
  const expected: Record<string, unknown> = {
    status: value.status,
    doppler_status: doppler.status,
    social_access_status: socialStatus,
    access_ready_count: readyCount,
    next_founder_action: founder.nextFounderAction,
    next_agent_action: founder.nextAgentAction,
    next_business_operation: founder.nextBusinessOperation,
  };
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (stateOperator[key] !== expectedValue) {
      issues.push(
        issue(
          "error",
          `founder_operator.state_${key}_mismatch`,
          `PROJECT_STATE business_operator.${key} must match the structured ledger.`,
          "PROJECT_STATE.yaml",
        ),
      );
    }
  }

  const founderAction = asString(founder.nextFounderAction) ?? "";
  const agentAction = asString(founder.nextAgentAction) ?? "";
  const nextBusinessOperation = asString(founder.nextBusinessOperation) ?? "";
  const activeGate = isRecord(founder.activeFounderGate) ? founder.activeFounderGate : {};
  const humanGateValues = [
    founderAction,
    agentAction,
    nextBusinessOperation,
    ...["whatThisIs", "whyNow", "successProof"].map((key) => asString(activeGate[key]) ?? ""),
  ];
  if (!human || humanGateValues.some((value) => !value || !human.includes(value))) {
    issues.push(
      issue("error", "founder_operator.human_next_action_stale", "BUSINESS_ACCESS.md must mirror the current founder and agent next actions.", humanPath),
    );
  }
  const cockpitSection = cockpit?.split("<h2>Business Operator Bootstrap</h2>")[1]?.split("</section>")[0] ?? "";
  if (
    !cockpitSection.includes(`>${asString(value.status) ?? ""}</span>`) ||
    !cockpitSection.includes(`Doppler: ${asString(doppler.status) ?? ""}`) ||
    !cockpitSection.includes(`Social access: ${socialStatus}`) ||
    !cockpitSection.includes(escapeHtml(founderAction)) ||
    !cockpitSection.includes(escapeHtml(agentAction)) ||
    !cockpitSection.includes(escapeHtml(nextBusinessOperation))
  ) {
    issues.push(
      issue("error", "founder_operator.cockpit_stale", "launch-cockpit.html must mirror founder-zero bootstrap state and next actions.", "launch-cockpit.html"),
    );
  }

  if (stateOperator.state_reconciled !== true) {
    issues.push(
      issue("error", "founder_operator.state_not_reconciled", "PROJECT_STATE business_operator.state_reconciled must be true.", "PROJECT_STATE.yaml"),
    );
  }

  if (value.status === "ready") {
    const unresolvedAccounts = accounts.filter((entry) => !["access_ready", "not_needed"].includes(asString(entry.status) ?? ""));
    const businessEmail = accounts.find((entry) => entry.id === "business_email");
    const gate = isRecord(founder.activeFounderGate) ? founder.activeFounderGate : {};
    if (asString(gate.id) === "confirm-working-name") {
      issues.push(
        issue("error", "founder_operator.ready_with_stale_gate", "Ready state cannot retain the initial business-name founder gate.", ledgerRelative),
      );
    }
    if (!["ready", "not_needed"].includes(asString(doppler.status) ?? "") || unresolvedAccounts.length > 0 || businessEmail?.status !== "access_ready") {
      issues.push(
        issue(
          "error",
          "founder_operator.ready_with_setup_gaps",
          "Ready operator bootstrap needs a founder-owned business email, Doppler ready/not-needed, and every inventoried account ready or explicitly not_needed.",
          ledgerRelative,
        ),
      );
    }
  }
}

function deriveSocialStatus(accounts: Record<string, unknown>[]): string {
  const statuses = accounts.map((entry) => asString(entry.status) ?? "not_evaluated");
  if (statuses.every((status) => status === "not_evaluated")) return "not_started";
  if (statuses.every((status) => ["access_ready", "not_needed"].includes(status))) return "ready";
  if (statuses.some((status) => status === "blocked")) return "blocked";
  return "partial";
}

function requireProof(value: string | undefined, codeValue: string, message: string): void {
  if (!value?.trim() || path.isAbsolute(value) || value.split(/[\\/]/).includes("..") || !existsSync(path.join(args.root, value))) {
    issues.push(issue("error", codeValue, message, ledgerRelative));
    return;
  }
  const fullPath = path.join(args.root, value);
  const stat = statSync(fullPath);
  if (!stat.isFile() || stat.size < 20) {
    issues.push(issue("error", codeValue, `${message} Proof must be a non-empty regular file.`, value));
    return;
  }
  if (/\.(?:txt|log|json|md|csv|ya?ml)$/i.test(value)) {
    scanForSecrets(readFileSync(fullPath, "utf8"), value);
  } else if (/\.(?:png|jpe?g|mp4|mov)$/i.test(value)) {
    issues.push(
      issue(
        "error",
        `${codeValue}.binary_requires_operations_ledger`,
        "Binary browser evidence belongs in Agent Operations with a redaction attestation; use a secret-scannable read-back log for access readiness.",
        value,
      ),
    );
  } else {
    issues.push(issue("error", `${codeValue}.unsupported_type`, "Access readiness proof must be a secret-scannable text artifact.", value));
  }
}

function scanForSecrets(text: string, file: string): void {
  const secretPattern =
    /(-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:dp\.(?:st|sa|ct)\.[A-Za-z0-9_.-]+|sk_(?:live|test)|rk_live|whsec_|phc_|gsk_|xox[baprs]-|ghp_|github_pat_|AKIA|ASIA|AIza)[A-Za-z0-9_.-]{8,}|(?:^|[^A-Za-z0-9_])["']?(?:password|passkey|access[_-]?token|refresh[_-]?token|token|secret|private[_-]?key|cookie|session|2fa(?:[_-]?code)?|mfa(?:[_-]?code)?|recovery[_-]?code|verification[_-]?code)["']?\s*[:=]\s*(?:["'](?!["'])[^"'\n]{4,}["']|[A-Za-z0-9_./+=-]{4,}))/i;
  if (secretPattern.test(text)) {
    issues.push(
      issue(
        "error",
        "founder_operator.raw_secret_detected",
        "Business access artifacts may record secret names and routes only, never passwords, tokens, cookies, sessions, 2FA, recovery codes, or private keys.",
        file,
      ),
    );
  }
}

function validateSingleFounderAction(value: string | undefined): void {
  const action = value ?? "";
  const checklistMarkers = action.match(/(?:^|\n)\s*(?:[-*]|\d+[.)])\s+/g) ?? [];
  const imperativeCount = (action.match(/\b(?:create|set up|connect|configure|open|login|log in|add|invite|verify|confirm|approve|buy|publish|send)\b/gi) ?? [])
    .length;
  const coordinatedSecondTask =
    /\b(?:and then|then|, and|and)\s+(?:approve|create|set up|connect|configure|open|log in|add|invite|verify|confirm|buy|publish|send)\b/i.test(action);
  if (!action.trim() || action.length > 240 || checklistMarkers.length > 0 || imperativeCount > 2 || coordinatedSecondTask) {
    issues.push(
      issue(
        "error",
        "founder_operator.multiple_founder_actions",
        "Present one short plain-language founder action, not a multi-step checklist.",
        ledgerRelative,
      ),
    );
  }
}

function isMeaningfulReason(value: string | undefined): boolean {
  const reason = value?.trim() ?? "";
  return reason.length >= 30 && !/^(?:n\/?a|none|not needed|x)$/i.test(reason);
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function isDateTime(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) && !Number.isNaN(new Date(value).getTime()));
}

function formatSchemaError(error: ErrorObject): string {
  return error.message ?? "is invalid";
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function code(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

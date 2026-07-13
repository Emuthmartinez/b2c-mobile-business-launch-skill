import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { type Harness, readState, writeState } from "./_harness.js";

export function register(h: Harness): void {
  const { makeFixture, runFixture } = h;

  const baseline = makeFixture("founder-operator-baseline");
  runFixture("shipped founder-zero operator bootstrap passes", baseline, "check-founder-operator-bootstrap.ts", 0);

  const missingLedger = makeFixture("founder-operator-missing-ledger");
  rmSync(path.join(missingLedger, "operations", "business-access.json"), { force: true });
  runFixture(
    "founder operator bootstrap without structured access state fails",
    missingLedger,
    "check-founder-operator-bootstrap.ts",
    1,
    "founder_operator.ledger_missing",
  );

  const expertAssumption = makeFixture("founder-operator-expert-assumption");
  const expertValue = readLedger(expertAssumption);
  (expertValue.founderModel as Record<string, unknown>).assumedExperience = "expert";
  writeLedger(expertAssumption, expertValue);
  runFixture("operator cannot assume founder expertise", expertAssumption, "check-founder-operator-bootstrap.ts", 1, "founder_zero_contract_invalid");

  const checklistDump = makeFixture("founder-operator-checklist-dump");
  const checklistValue = readLedger(checklistDump);
  (checklistValue.founderModel as Record<string, unknown>).neverDumpChecklist = false;
  writeLedger(checklistDump, checklistValue);
  runFixture(
    "operator must present one founder action instead of dumping a checklist",
    checklistDump,
    "check-founder-operator-bootstrap.ts",
    1,
    "founder_zero_contract_invalid",
  );

  const rawPassword = makeFixture("founder-operator-raw-password");
  const humanPath = path.join(rawPassword, "BUSINESS_ACCESS.md");
  writeFileSync(humanPath, `${readFileSync(humanPath, "utf8")}\npassword: \"do-not-store-this\"\n`, "utf8");
  runFixture("business access artifact with raw password fails", rawPassword, "check-founder-operator-bootstrap.ts", 1, "founder_operator.raw_secret_detected");

  const rawUnquotedToken = makeFixture("founder-operator-raw-unquoted-token");
  const rawUnquotedTokenPath = path.join(rawUnquotedToken, "BUSINESS_ACCESS.md");
  writeFileSync(rawUnquotedTokenPath, `${readFileSync(rawUnquotedTokenPath, "utf8")}\naccess_token=secretvalue123456\n`, "utf8");
  runFixture(
    "business access artifact with an unquoted token fails",
    rawUnquotedToken,
    "check-founder-operator-bootstrap.ts",
    1,
    "founder_operator.raw_secret_detected",
  );

  const shortMfa = makeFixture("founder-operator-short-mfa");
  const shortMfaPath = path.join(shortMfa, "BUSINESS_ACCESS.md");
  writeFileSync(shortMfaPath, `${readFileSync(shortMfaPath, "utf8")}\nmfa_code=123456\n`, "utf8");
  runFixture("six-digit MFA values fail secret scanning", shortMfa, "check-founder-operator-bootstrap.ts", 1, "founder_operator.raw_secret_detected");

  const recoveryCodeProof = makeFixture("founder-operator-recovery-code-proof");
  const recoveryValue = completeValue(recoveryCodeProof);
  writeFileSync(path.join(recoveryCodeProof, "operations", "proof", "x-access.log"), "recovery_code: ABCD-EFGH-IJKL-MNOP\n", "utf8");
  writeLedger(recoveryCodeProof, recoveryValue);
  reconcileFixture(recoveryCodeProof, recoveryValue);
  runFixture(
    "recovery or MFA values in access proof fail",
    recoveryCodeProof,
    "check-founder-operator-bootstrap.ts",
    1,
    "founder_operator.raw_secret_detected",
  );

  const multipleFounderActions = makeFixture("founder-operator-multiple-actions");
  const multipleValue = readLedger(multipleFounderActions);
  const multipleAction = "Create the business email, set up Doppler, connect X, invite the operator, and publish the first post.";
  (multipleValue.founderModel as Record<string, unknown>).nextFounderAction = multipleAction;
  ((multipleValue.founderModel as Record<string, unknown>).activeFounderGate as Record<string, unknown>).founderAction = multipleAction;
  writeLedger(multipleFounderActions, multipleValue);
  runFixture(
    "founder receives one action instead of a multi-task setup dump",
    multipleFounderActions,
    "check-founder-operator-bootstrap.ts",
    1,
    "founder_operator.multiple_founder_actions",
  );

  const twoFounderTasks = makeFixture("founder-operator-two-actions");
  const twoTaskValue = readLedger(twoFounderTasks);
  const twoTaskAction = "Confirm the working business name and approve the domain purchase.";
  (twoTaskValue.founderModel as Record<string, unknown>).nextFounderAction = twoTaskAction;
  ((twoTaskValue.founderModel as Record<string, unknown>).activeFounderGate as Record<string, unknown>).founderAction = twoTaskAction;
  writeLedger(twoFounderTasks, twoTaskValue);
  runFixture(
    "two coordinated founder tasks do not count as one action",
    twoFounderTasks,
    "check-founder-operator-bootstrap.ts",
    1,
    "founder_operator.multiple_founder_actions",
  );

  const agentDeadEnd = makeFixture("founder-operator-agent-dead-end");
  const deadEndValue = readLedger(agentDeadEnd);
  const deadEndFounder = deadEndValue.founderModel as Record<string, unknown>;
  deadEndFounder.nextAgentAction = "Wait for the founder to finish setup and tell me when it is done.";
  (deadEndFounder.activeFounderGate as Record<string, unknown>).agentActionNext = deadEndFounder.nextAgentAction;
  deadEndFounder.nextBusinessOperation = "";
  writeLedger(agentDeadEnd, deadEndValue);
  runFixture("operator cannot stop at a wait-for-me instruction", agentDeadEnd, "check-founder-operator-bootstrap.ts", 1, "founder_operator.agent_dead_end");

  const paraphrasedDeadEnd = makeFixture("founder-operator-paraphrased-dead-end");
  const paraphrasedValue = readLedger(paraphrasedDeadEnd);
  const paraphrasedFounder = paraphrasedValue.founderModel as Record<string, unknown>;
  paraphrasedFounder.nextAgentAction = "Ask the founder to complete all account setup manually before work continues.";
  (paraphrasedFounder.activeFounderGate as Record<string, unknown>).agentActionNext = paraphrasedFounder.nextAgentAction;
  writeLedger(paraphrasedDeadEnd, paraphrasedValue);
  runFixture(
    "paraphrased manual handoff cannot stop business operation",
    paraphrasedDeadEnd,
    "check-founder-operator-bootstrap.ts",
    1,
    "founder_operator.agent_dead_end",
  );

  const kindBypass = makeFixture("founder-operator-social-kind-bypass");
  const kindValue = readLedger(kindBypass);
  (kindValue.accounts as Array<Record<string, unknown>>).find((entry) => entry.id === "x")!.kind = "store";
  writeLedger(kindBypass, kindValue);
  runFixture("social accounts cannot be reclassified around readiness", kindBypass, "check-founder-operator-bootstrap.ts", 1, "kind_invalid");

  const incompleteDoppler = makeFixture("founder-operator-incomplete-doppler");
  const incompleteDopplerValue = readLedger(incompleteDoppler);
  (incompleteDopplerValue.doppler as Record<string, unknown>).status = "ready";
  writeLedger(incompleteDoppler, incompleteDopplerValue);
  reconcileFixture(incompleteDoppler, incompleteDopplerValue);
  runFixture(
    "Doppler cannot be ready without account project config and proof",
    incompleteDoppler,
    "check-founder-operator-bootstrap.ts",
    1,
    "founder_operator.doppler_ready_unproven",
  );

  const accessNoProof = makeFixture("founder-operator-access-no-proof");
  const accessNoProofValue = completeValue(accessNoProof);
  (accessNoProofValue.accounts as Array<Record<string, unknown>>).find((entry) => entry.id === "x")!.proofPath = "";
  writeLedger(accessNoProof, accessNoProofValue);
  reconcileFixture(accessNoProof, accessNoProofValue);
  runFixture("social access cannot be ready without sanitized proof", accessNoProof, "check-founder-operator-bootstrap.ts", 1, "proof_missing");

  const directoryProof = makeFixture("founder-operator-directory-proof");
  const directoryProofValue = completeValue(directoryProof);
  (directoryProofValue.accounts as Array<Record<string, unknown>>).find((entry) => entry.id === "x")!.proofPath = "operations/proof";
  writeLedger(directoryProof, directoryProofValue);
  reconcileFixture(directoryProof, directoryProofValue);
  runFixture("access proof must be a regular file", directoryProof, "check-founder-operator-bootstrap.ts", 1, "proof_missing");

  const emptyProof = makeFixture("founder-operator-empty-proof");
  const emptyProofValue = completeValue(emptyProof);
  writeFileSync(path.join(emptyProof, "operations", "proof", "x-access.log"), "", "utf8");
  writeLedger(emptyProof, emptyProofValue);
  reconcileFixture(emptyProof, emptyProofValue);
  runFixture("access proof cannot be empty", emptyProof, "check-founder-operator-bootstrap.ts", 1, "proof_missing");

  const binaryProof = makeFixture("founder-operator-binary-proof");
  const binaryProofValue = completeValue(binaryProof);
  writeFileSync(path.join(binaryProof, "operations", "proof", "x-access-sanitized.png"), "not a reviewed binary proof artifact", "utf8");
  (binaryProofValue.accounts as Array<Record<string, unknown>>).find((entry) => entry.id === "x")!.proofPath = "operations/proof/x-access-sanitized.png";
  writeLedger(binaryProof, binaryProofValue);
  reconcileFixture(binaryProof, binaryProofValue);
  runFixture(
    "binary access proof is routed through the Agent Operations redaction contract",
    binaryProof,
    "check-founder-operator-bootstrap.ts",
    1,
    "binary_requires_operations_ledger",
  );

  const wrongOwner = makeFixture("founder-operator-wrong-owner");
  const wrongOwnerValue = completeValue(wrongOwner);
  (wrongOwnerValue.accounts as Array<Record<string, unknown>>).find((entry) => entry.id === "x")!.owner = "agent";
  writeLedger(wrongOwner, wrongOwnerValue);
  reconcileFixture(wrongOwner, wrongOwnerValue);
  runFixture("access-ready business assets remain founder-owned", wrongOwner, "check-founder-operator-bootstrap.ts", 1, "founder_recovery_control_missing");

  const dopplerWrongOwner = makeFixture("founder-operator-doppler-wrong-owner");
  const dopplerWrongOwnerValue = completeValue(dopplerWrongOwner);
  (dopplerWrongOwnerValue.doppler as Record<string, unknown>).workspaceOwner = "agent";
  writeLedger(dopplerWrongOwner, dopplerWrongOwnerValue);
  reconcileFixture(dopplerWrongOwner, dopplerWrongOwnerValue);
  runFixture(
    "ready Doppler remains founder-owned and recoverable",
    dopplerWrongOwner,
    "check-founder-operator-bootstrap.ts",
    1,
    "founder_operator.doppler_ownership_invalid",
  );

  const founderCliReady = makeFixture("founder-operator-doppler-founder-cli-ready");
  const founderCliValue = completeValue(founderCliReady);
  (founderCliValue.doppler as Record<string, unknown>).authenticationMethod = "founder_authenticated_cli";
  writeLedger(founderCliReady, founderCliValue);
  reconcileFixture(founderCliReady, founderCliValue);
  runFixture(
    "founder personal CLI authentication is bootstrap-only",
    founderCliReady,
    "check-founder-operator-bootstrap.ts",
    1,
    "founder_operator.doppler_ownership_invalid",
  );

  const unreasonedNotNeeded = makeFixture("founder-operator-unreasoned-not-needed");
  const unreasonedValue = readLedger(unreasonedNotNeeded);
  (unreasonedValue.accounts as Array<Record<string, unknown>>).find((entry) => entry.id === "youtube")!.status = "not_needed";
  writeLedger(unreasonedNotNeeded, unreasonedValue);
  runFixture("not-needed account decisions require a reason", unreasonedNotNeeded, "check-founder-operator-bootstrap.ts", 1, "not_needed_unreasoned");

  const trivialNotNeeded = makeFixture("founder-operator-trivial-not-needed");
  const trivialNotNeededValue = readLedger(trivialNotNeeded);
  const trivialYoutube = (trivialNotNeededValue.accounts as Array<Record<string, unknown>>).find((entry) => entry.id === "youtube")!;
  trivialYoutube.status = "not_needed";
  trivialYoutube.statusReason = "n/a";
  writeLedger(trivialNotNeeded, trivialNotNeededValue);
  runFixture("not-needed account reasons must be traceable", trivialNotNeeded, "check-founder-operator-bootstrap.ts", 1, "not_needed_unreasoned");

  const hiddenScope = makeFixture("founder-operator-hidden-scope");
  const hiddenScopeValue = completeValue(hiddenScope);
  const hiddenScopeX = (hiddenScopeValue.accounts as Array<Record<string, unknown>>).find((entry) => entry.id === "x")!;
  hiddenScopeX.grantedScopes = [...(hiddenScopeX.grantedScopes as string[]), "publish"];
  hiddenScopeX.canPublish = false;
  writeLedger(hiddenScope, hiddenScopeValue);
  reconcileFixture(hiddenScope, hiddenScopeValue);
  runFixture("granted scopes cannot hide dangerous permissions", hiddenScope, "check-founder-operator-bootstrap.ts", 1, "scope_mismatch");

  const weakTokenException = makeFixture("founder-operator-weak-token-exception");
  const weakTokenValue = completeValue(weakTokenException);
  const weakTokenX = (weakTokenValue.accounts as Array<Record<string, unknown>>).find((entry) => entry.id === "x")!;
  weakTokenX.accessMethod = "api_token";
  weakTokenX.secretNames = ["X_ACCESS_TOKEN"];
  weakTokenX.limitations = ["No role available."];
  writeLedger(weakTokenException, weakTokenValue);
  reconcileFixture(weakTokenException, weakTokenValue);
  runFixture(
    "exceptional token access needs a real delegation gap and rotation contract",
    weakTokenException,
    "check-founder-operator-bootstrap.ts",
    1,
    "exceptional_social_access_unproven",
  );

  const staleState = makeFixture("founder-operator-stale-state");
  const staleStateValue = completeValue(staleState);
  writeLedger(staleState, staleStateValue);
  runFixture("operator ledger cannot drift from project state and cockpit", staleState, "check-founder-operator-bootstrap.ts", 1, "state_status_mismatch");

  const unreconciledState = makeFixture("founder-operator-unreconciled-state");
  const unreconciledProject = readState(unreconciledState);
  (unreconciledProject.business_operator as Record<string, unknown>).state_reconciled = false;
  writeState(unreconciledState, unreconciledProject);
  runFixture("operator state must be explicitly reconciled", unreconciledState, "check-founder-operator-bootstrap.ts", 1, "state_not_reconciled");

  const missingUpdatedAt = makeFixture("founder-operator-missing-updated-at");
  const missingUpdatedValue = completeValue(missingUpdatedAt);
  missingUpdatedValue.updatedAt = "";
  writeLedger(missingUpdatedAt, missingUpdatedValue);
  reconcileFixture(missingUpdatedAt, missingUpdatedValue);
  runFixture("active operator state needs an update timestamp", missingUpdatedAt, "check-founder-operator-bootstrap.ts", 1, "updated_at_missing");

  const prematureReady = makeFixture("founder-operator-premature-ready");
  const prematureReadyValue = completeValue(prematureReady);
  prematureReadyValue.status = "ready";
  writeLedger(prematureReady, prematureReadyValue);
  reconcileFixture(prematureReady, prematureReadyValue);
  runFixture(
    "operator bootstrap cannot be ready before the ownership spine and account inventory are resolved",
    prematureReady,
    "check-founder-operator-bootstrap.ts",
    1,
    "founder_operator.ready_with_setup_gaps",
  );
  runFixture(
    "ready state cannot retain the initial founder-name gate",
    prematureReady,
    "check-founder-operator-bootstrap.ts",
    1,
    "founder_operator.ready_with_stale_gate",
  );

  const complete = makeFixture("founder-operator-complete");
  const value = completeValue(complete);
  writeLedger(complete, value);
  reconcileFixture(complete, value);
  runFixture("founder-zero operator with Doppler and delegated social proof passes", complete, "check-founder-operator-bootstrap.ts", 0);

  const ready = makeFixture("founder-operator-ready");
  const readyLedger = readyValue(ready);
  writeLedger(ready, readyLedger);
  reconcileFixture(ready, readyLedger);
  runFixture("resolved founder-owned operator bootstrap passes ready state", ready, "check-founder-operator-bootstrap.ts", 0);

  const escapedAction = makeFixture("founder-operator-escaped-action");
  const escapedValue = readLedger(escapedAction);
  const escapedFounder = escapedValue.founderModel as Record<string, unknown>;
  const escapedGate = escapedFounder.activeFounderGate as Record<string, unknown>;
  escapedGate.target = "X & Instagram profile choice";
  escapedGate.founderAction = "Confirm X & Instagram as the first social profile target.";
  escapedFounder.nextFounderAction = escapedGate.founderAction;
  writeLedger(escapedAction, escapedValue);
  reconcileFixture(escapedAction, escapedValue);
  runFixture("HTML-escaped founder actions reconcile with the cockpit", escapedAction, "check-founder-operator-bootstrap.ts", 0);
}

function readLedger(root: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path.join(root, "operations", "business-access.json"), "utf8")) as Record<string, unknown>;
}

function writeLedger(root: string, value: Record<string, unknown>): void {
  writeFileSync(path.join(root, "operations", "business-access.json"), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function completeValue(root: string): Record<string, unknown> {
  const value = readLedger(root);
  const now = "2026-07-12T18:00:00.000Z";
  value.status = "active";
  value.updatedAt = now;
  const proofDir = path.join(root, "operations", "proof");
  mkdirSync(proofDir, { recursive: true });
  writeFileSync(path.join(proofDir, "doppler.log"), "Doppler identity, project/config, and safe injection smoke test passed; values not printed.\n", "utf8");
  writeFileSync(path.join(proofDir, "x-access.log"), "X Delegate contributor access read back for @example; recovery and 2FA remain founder-owned.\n", "utf8");
  Object.assign(value.doppler as Record<string, unknown>, {
    status: "ready",
    cliVersion: "v3.76.0",
    docsCheckedAt: now,
    authenticatedAccountLabel: "founder business workspace",
    workspaceOwner: "founder",
    operatorIdentityLabel: "launch operator",
    operatorRole: "collaborator with config read access",
    authenticationMethod: "delegated_role",
    recoveryOwner: "founder",
    mfaOwner: "founder",
    revocationPath: "Doppler workplace members: remove launch operator",
    project: "example-app",
    configs: ["dev_personal", "stg", "prd"],
    secretNames: ["X_OAUTH_ACCESS_TOKEN"],
    proofPath: "operations/proof/doppler.log",
  });
  const x = (value.accounts as Array<Record<string, unknown>>).find((entry) => entry.id === "x")!;
  Object.assign(x, {
    status: "access_ready",
    exactAccount: "@example",
    businessAsset: "Example App X account",
    owner: "founder",
    accessMethod: "delegated_role",
    operatorIdentityLabel: "launch operator X identity",
    operatorRole: "contributor",
    delegatedBy: "founder",
    revocationPath: "X Delegate: remove contributor access",
    grantedScopes: ["observe", "draft", "analytics"],
    canObserve: true,
    canDraft: true,
    canPublish: false,
    canReply: false,
    canModerate: false,
    canViewAnalytics: true,
    canSpend: false,
    canChangeIdentity: false,
    canDelete: false,
    recoveryOwner: "founder",
    mfaOwner: "founder",
    secretNames: [],
    checkedAt: now,
    proofPath: "operations/proof/x-access.log",
    limitations: ["Publishing remains founder-gated through the Agent Operations approval envelope."],
  });
  return value;
}

function readyValue(root: string): Record<string, unknown> {
  const value = completeValue(root);
  value.status = "ready";
  const founder = value.founderModel as Record<string, unknown>;
  const activeGate = founder.activeFounderGate as Record<string, unknown>;
  Object.assign(activeGate, {
    id: "approve-first-social-draft",
    actionType: "approval",
    target: "first social content draft",
    whatThisIs: "Review the first social content draft before any public publishing is authorized.",
    whyNow: "It lets the agent begin the operating rhythm while the founder retains final public voice control.",
    founderAction: "Approve or revise the first social content draft; nothing will be published until you approve it.",
    agentActionNext: "Finalize the approved draft, verify the exact account and approval envelope, then prepare the scheduled publishing action.",
    successProof: "The approved content digest and scoped publish envelope are recorded in Agent Operations before execution.",
  });
  founder.nextFounderAction = activeGate.founderAction;
  founder.nextAgentAction = activeGate.agentActionNext;
  founder.nextBusinessOperation = "Continue the weekly social, support, analytics, store, and launch operating rhythm with proof after each action.";
  const proofDir = path.join(root, "operations", "proof");
  writeFileSync(
    path.join(proofDir, "business-email.log"),
    "Founder-owned business email and recovery custody read back; operator access is revocable and values are not recorded.\n",
    "utf8",
  );
  const accounts = value.accounts as Array<Record<string, unknown>>;
  const email = accounts.find((entry) => entry.id === "business_email")!;
  Object.assign(email, {
    status: "access_ready",
    exactAccount: "founder-owned business inbox",
    businessAsset: "Example App business email",
    owner: "founder",
    accessMethod: "delegated_role",
    operatorIdentityLabel: "launch operator email identity",
    operatorRole: "mailbox delegate",
    delegatedBy: "founder",
    revocationPath: "Business email admin: remove mailbox delegate",
    grantedScopes: ["observe", "draft"],
    canObserve: true,
    canDraft: true,
    recoveryOwner: "founder",
    mfaOwner: "founder",
    checkedAt: value.updatedAt,
    proofPath: "operations/proof/business-email.log",
  });
  for (const account of accounts) {
    if (!["business_email", "x"].includes(String(account.id))) {
      account.status = "not_needed";
      account.statusReason = `Not required for the current platform and launch scope; revisit when ${String(account.platform)} enters scope.`;
    }
  }
  return value;
}

function reconcileFixture(root: string, value: Record<string, unknown>): void {
  const accounts = value.accounts as Array<Record<string, unknown>>;
  const founder = value.founderModel as Record<string, unknown>;
  const gate = founder.activeFounderGate as Record<string, unknown>;
  const state = readState(root);
  const operator = state.business_operator as Record<string, unknown>;
  operator.status = value.status;
  operator.doppler_status = (value.doppler as Record<string, unknown>).status;
  operator.social_access_status = deriveSocialStatus(accounts);
  operator.access_ready_count = accounts.filter((entry) => entry.status === "access_ready").length;
  operator.next_founder_action = founder.nextFounderAction;
  operator.next_agent_action = founder.nextAgentAction;
  operator.next_business_operation = founder.nextBusinessOperation;
  writeState(root, state);

  const humanPath = path.join(root, "BUSINESS_ACCESS.md");
  const human = readFileSync(humanPath, "utf8")
    .replace(/^- What this is:.*$/m, `- What this is: ${String(gate.whatThisIs)}`)
    .replace(/^- Why now:.*$/m, `- Why now: ${String(gate.whyNow)}`)
    .replace(/^- Founder action:.*$/m, `- Founder action: ${String(founder.nextFounderAction)}`)
    .replace(/^- Agent action next:.*$/m, `- Agent action next: ${String(founder.nextAgentAction)}`)
    .replace(/^- Success proof:.*$/m, `- Success proof: ${String(gate.successProof)}`)
    .replace(/^- Next business operation:.*$/m, `- Next business operation: ${String(founder.nextBusinessOperation)}`);
  writeFileSync(humanPath, human, "utf8");

  const cockpitPath = path.join(root, "launch-cockpit.html");
  const source = readFileSync(cockpitPath, "utf8");
  const marker = "<h2>Business Operator Bootstrap</h2>";
  const markerIndex = source.indexOf(marker);
  const head = source.slice(0, markerIndex + marker.length);
  const tail = source
    .slice(markerIndex + marker.length)
    .replace(/<span class="status [^"]+">[^<]+<\/span>/, `<span class="status ${String(value.status)}">${String(value.status)}</span>`)
    .replace("Doppler: not_started", `Doppler: ${String((value.doppler as Record<string, unknown>).status)}`)
    .replace("Social access: not_started", `Social access: ${deriveSocialStatus(accounts)}`)
    .replace("Ready accounts: 0", `Ready accounts: ${accounts.filter((entry) => entry.status === "access_ready").length}`)
    .replace(
      escapeHtml("Tell me the working business or app name you want to use; I will explain and handle the rest one step at a time."),
      escapeHtml(String(founder.nextFounderAction)),
    )
    .replace(
      escapeHtml("Inspect current repo and public identity state, then guide the first secure business account step."),
      escapeHtml(String(founder.nextAgentAction)),
    )
    .replace(
      escapeHtml(
        "After the identity gate clears, continue into secure account setup, research, social profiles, content, support, analytics, store work, and launch operations in priority order.",
      ),
      escapeHtml(String(founder.nextBusinessOperation)),
    );
  writeFileSync(cockpitPath, `${head}${tail}`, "utf8");
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function deriveSocialStatus(accounts: Array<Record<string, unknown>>): string {
  const statuses = accounts.filter((entry) => entry.kind === "social").map((entry) => String(entry.status));
  if (statuses.every((status) => status === "not_evaluated")) return "not_started";
  if (statuses.every((status) => ["access_ready", "not_needed"].includes(status))) return "ready";
  if (statuses.some((status) => status === "blocked")) return "blocked";
  return "partial";
}

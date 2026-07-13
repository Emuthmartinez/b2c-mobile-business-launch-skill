export function renderFounderGateMarkup(founderModel: Record<string, unknown>, businessOperator: Record<string, unknown>): string {
  const activeFounderGateValue = founderModel.activeFounderGate;
  const hasActiveFounderGate = isRecord(activeFounderGateValue);
  const activeFounderGate: Record<string, unknown> = hasActiveFounderGate ? activeFounderGateValue : {};
  const activePhase = isRecord(founderModel.currentPhase) ? founderModel.currentPhase : isRecord(activeFounderGate.phase) ? activeFounderGate.phase : {};
  const activeQuestion = isRecord(activeFounderGate.question) ? activeFounderGate.question : {};
  const activeOptions = asArray(activeQuestion.options).filter(isRecord);
  const activeDefinitions = asArray(activeFounderGate.definitions).filter(isRecord);
  const activeBypass = isRecord(activeFounderGate.bypassPolicy) ? activeFounderGate.bypassPolicy : {};
  const activeLifecycle = isRecord(activeFounderGate.lifecycle) ? activeFounderGate.lifecycle : {};
  const founderOptionMarkup = activeOptions
    .map(
      (option) =>
        `<article class="card"><h3>${escapeHtml(option.label)}${option.recommended === true ? " (Recommended)" : ""}</h3><p>${escapeHtml(option.description)}</p><p><strong>Consequence:</strong> ${escapeHtml(option.consequence)}</p><p><strong>Agent next:</strong> ${escapeHtml(option.agentActionNext)}</p><p class="muted">Evidence: ${escapeHtml(option.evidenceEffect)}</p></article>`,
    )
    .join("");
  const founderDefinitionsMarkup =
    activeDefinitions.length > 0
      ? activeDefinitions.map((entry) => `<p><strong>${escapeHtml(entry.term)}:</strong> ${escapeHtml(entry.meaning)}</p>`).join("")
      : hasActiveFounderGate
        ? '<p class="muted">No unfamiliar terms are needed for this decision.</p>'
        : '<p class="muted">No founder decision is pending, so no definitions are needed.</p>';

  return `<div class="grid">
    <article class="card"><h3>Status</h3><p><span class="status ${escapeHtml(businessOperator.status ?? "not_started")}">${escapeHtml(businessOperator.status ?? "not_started")}</span></p><p class="muted">Founder model: ${escapeHtml(businessOperator.founder_experience ?? "beginner_assumed")}</p><p>Agent role: ${escapeHtml(businessOperator.agent_role ?? "business_operator")}</p></article>
    <article class="card"><h3>Access</h3><p>Doppler: ${escapeHtml(businessOperator.doppler_status ?? "not_started")}</p><p>Social access: ${escapeHtml(businessOperator.social_access_status ?? "not_started")}</p><p>Ready accounts: ${escapeHtml(businessOperator.access_ready_count ?? 0)}</p></article>
    <article class="card"><h3>Current Phase</h3><p><strong>${escapeHtml(activePhase.label ?? businessOperator.current_phase_label ?? "Not recorded")}</strong></p><p>${escapeHtml(activePhase.outcome ?? businessOperator.current_phase_outcome ?? "Not recorded")}</p><p class="muted">${escapeHtml(activePhase.id ?? businessOperator.current_phase ?? "unknown")}${hasActiveFounderGate ? ` | Decision type: ${escapeHtml(gateClassLabel(activeFounderGate.gateClass))} | Requested by: ${escapeHtml(gateOriginLabel(activeFounderGate.origin))}` : " | Agent is continuing without a founder decision"}</p></article>
    <article class="card"><h3>Definitions</h3>${founderDefinitionsMarkup}</article>
    <article class="card"><h3>Founder: One Decision</h3>${hasActiveFounderGate ? `<p>${escapeHtml(activeQuestion.prompt ?? businessOperator.next_founder_action ?? "Not recorded")}</p><p class="muted">AskUserQuestion when available; an explicit selection is required. Status: ${escapeHtml(activeLifecycle.status ?? businessOperator.active_gate_status ?? "unknown")}</p>` : "<p>No founder decision is pending. The agent continues the recorded next action.</p>"}</article>
    ${founderOptionMarkup}
    ${hasActiveFounderGate ? `<article class="card"><h3>Skip Or Defer</h3><p><strong>${escapeHtml(bypassModeLabel(activeBypass.mode))}</strong></p><p><strong>Why safe:</strong> ${escapeHtml(activeBypass.reason ?? "Not recorded")}</p><p>${escapeHtml(activeBypass.fallbackAction ?? "Not recorded")}</p><p><strong>Revisit:</strong> ${escapeHtml(activeBypass.revisitTrigger ?? "Not recorded")}</p><p class="muted">${escapeHtml(activeFounderGate.safeWorkWhileWaiting ?? "No safe work recorded")}</p></article>` : ""}
    <article class="card"><h3>Agent: Immediate Next Action</h3><p>${escapeHtml(businessOperator.next_agent_action ?? "Not recorded")}</p><p><strong>Then operate:</strong> ${escapeHtml(businessOperator.next_business_operation ?? "Not recorded")}</p><p class="muted">${escapeHtml(businessOperator.human_log ?? "BUSINESS_ACCESS.md")} | ${escapeHtml(businessOperator.structured_ledger ?? "operations/business-access.json")}</p></article>
  </div>`;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function gateClassLabel(value: unknown): string {
  const labels: Record<string, string> = {
    access: "Account access",
    spend: "Money or paid credits",
    legal: "Legal approval",
    pricing: "Pricing decision",
    public_action: "Public action",
    release: "Release decision",
    destructive: "Destructive action",
    research: "Research approach",
    scope: "Working scope",
    provider_route: "Tool route",
    other: "Other founder decision",
  };
  return labels[String(value ?? "")] ?? "Founder decision";
}

function gateOriginLabel(value: unknown): string {
  const labels: Record<string, string> = {
    user_request: "Your request",
    platform_requirement: "Platform requirement",
    legal_requirement: "Legal requirement",
    skill_requirement: "Launch workflow",
    agent_proposal: "Agent recommendation",
  };
  return labels[String(value ?? "")] ?? "Current work";
}

function bypassModeLabel(value: unknown): string {
  return value === "fallback_allowed" ? "A safe fallback is available" : value === "defer_only" ? "This can be deferred, not bypassed" : "Not recorded";
}

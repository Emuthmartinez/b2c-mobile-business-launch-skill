#!/usr/bin/env node
import { asArray, asString, getPath, isRecord, loadProjectState, parseCliArgs, reportAndExit, writeText } from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const loaded = loadProjectState(args);
const issues = [...loaded.issues];

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function list(items: unknown[]): string {
  if (items.length === 0) {
    return '<span class="muted">None recorded</span>';
  }
  return `<ul>${items.map((item) => `<li>${escapeHtml(typeof item === "string" ? item : JSON.stringify(item))}</li>`).join("")}</ul>`;
}

if (!loaded.state) {
  reportAndExit("Launch cockpit render", issues);
} else {
  const state = loaded.state;
  const projectName = asString(getPath(state, "project.name")) ?? "Untitled app";
  const phase = asString(getPath(state, "project.phase")) ?? "unknown";
  const mode = asString(getPath(state, "autonomy.mode")) ?? "unknown";
  const updatedAt = asString(getPath(state, "updated_at")) ?? "unknown";
  const lanes = isRecord(getPath(state, "lanes")) ? (getPath(state, "lanes") as Record<string, unknown>) : {};
  const tools = isRecord(getPath(state, "tools")) ? (getPath(state, "tools") as Record<string, unknown>) : {};
  const orchestration = isRecord(getPath(state, "orchestration")) ? (getPath(state, "orchestration") as Record<string, unknown>) : {};
  const cards = asArray(getPath(state, "failure_cards.active"));
  const gates = asArray(getPath(state, "autonomy.founder_only_gates"));
  const proofCommands = asArray(getPath(state, "proof.commands"));

  const laneRows = Object.entries(lanes)
    .map(([name, value]) => {
      const status = isRecord(value) ? (asString(value.status) ?? "unknown") : "unknown";
      const evidence = isRecord(value) ? asArray(value.evidence) : [];
      const blockers = isRecord(value) ? asArray(value.blockers) : [];
      return `<tr><td>${escapeHtml(name)}</td><td><span class="status ${escapeHtml(status)}">${escapeHtml(status)}</span></td><td>${list(evidence)}</td><td>${list(blockers)}</td></tr>`;
    })
    .join("");

  const toolRows = Object.entries(tools)
    .map(([name, value]) => {
      const record = isRecord(value) ? value : {};
      return `<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(record.route)}</td><td>${escapeHtml(record.docs_checked_at)}</td><td>${list(asArray(record.required_secrets))}</td><td>${escapeHtml(record.preflight)}</td><td>${escapeHtml(record.validation)}</td></tr>`;
    })
    .join("");

  const cardMarkup = cards
    .map((card) => {
      const record = isRecord(card) ? card : {};
      return `<article class="card"><h3>${escapeHtml(record.id)}</h3><p><strong>${escapeHtml(record.severity)}</strong> | ${escapeHtml(record.owner)} | ${escapeHtml(record.status)}</p><p>${escapeHtml(record.next_action)}</p></article>`;
    })
    .join("");

  const commandMarkup = proofCommands
    .map((command) => {
      const record = isRecord(command) ? command : {};
      return `<article class="proof"><strong>${escapeHtml(record.command)}</strong><p>Expected: ${escapeHtml(record.expected)}</p><p>Actual: ${escapeHtml(record.actual)}</p><p>Evidence: ${escapeHtml(record.evidence)}</p></article>`;
    })
    .join("");

  const orchestrationMarkup = `<div class="grid">
    <article class="card"><h3>Strategy</h3><p>${escapeHtml(orchestration.strategy ?? "not recorded")}</p><p class="muted">${escapeHtml(orchestration.rationale ?? "")}</p></article>
    <article class="card"><h3>Owner</h3><p>${escapeHtml(orchestration.integration_owner ?? "not recorded")}</p><p class="muted">Manager pattern: ${escapeHtml(orchestration.manager_pattern ?? "unknown")}</p></article>
    <article class="card"><h3>Safety</h3><p>File overlap checked: ${escapeHtml(orchestration.file_overlap_checked ?? "unknown")}</p><p>Actual collision check: ${escapeHtml(orchestration.actual_file_collision_check ?? "unknown")}</p></article>
    <article class="card"><h3>Integration</h3><p>Outputs reviewed: ${escapeHtml(orchestration.agent_outputs_reviewed ?? "unknown")}</p><p>State reconciled: ${escapeHtml(orchestration.state_reconciled ?? "unknown")}</p></article>
  </div>`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(projectName)} Launch Cockpit</title>
  <style>
    :root {
      --bg: #f7f3ec;
      --ink: #161512;
      --muted: #686159;
      --line: #d8d0c3;
      --panel: #fffdfa;
      --accent: #0c7c59;
      --warn: #a05a00;
      --bad: #b3261e;
      --radius: 8px;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.45 ui-sans-serif, system-ui, sans-serif; }
    header { padding: 32px; border-bottom: 1px solid var(--line); background: linear-gradient(120deg, #fffdfa, #e5f1ea); }
    h1 { margin: 0 0 8px; font-size: clamp(28px, 5vw, 56px); line-height: 0.95; letter-spacing: 0; }
    h2 { margin: 0 0 14px; font-size: 20px; }
    h3 { margin: 0 0 8px; }
    main { padding: 24px; display: grid; gap: 18px; }
    section { background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: 18px; overflow: auto; }
    .meta { display: flex; gap: 10px; flex-wrap: wrap; color: var(--muted); }
    .pill { border: 1px solid var(--line); border-radius: 999px; padding: 6px 10px; background: #fff; }
    table { width: 100%; border-collapse: collapse; min-width: 760px; }
    th, td { text-align: left; vertical-align: top; border-bottom: 1px solid var(--line); padding: 10px; }
    th { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
    ul { margin: 0; padding-left: 18px; }
    .muted { color: var(--muted); }
    .status { display: inline-block; border-radius: 999px; padding: 3px 8px; background: #eee5d9; }
    .done { background: #d8eee2; color: #06472f; }
    .blocked { background: #f8d7d4; color: var(--bad); }
    .partial { background: #f7ead5; color: var(--warn); }
    .deferred, .not_needed { background: #e8e5df; color: #514b45; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
    .card, .proof { border: 1px solid var(--line); border-radius: var(--radius); padding: 14px; background: #fff; }
    @media (max-width: 720px) { header, main { padding: 18px; } table { min-width: 640px; } }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(projectName)}</h1>
    <div class="meta">
      <span class="pill">Phase: ${escapeHtml(phase)}</span>
      <span class="pill">Mode: ${escapeHtml(mode)}</span>
      <span class="pill">Updated: ${escapeHtml(updatedAt)}</span>
    </div>
  </header>
  <main>
    <section>
      <h2>Lane Status</h2>
      <table><thead><tr><th>Lane</th><th>Status</th><th>Evidence</th><th>Blockers</th></tr></thead><tbody>${laneRows}</tbody></table>
    </section>
    <section>
      <h2>Orchestration</h2>
      ${orchestrationMarkup}
    </section>
    <section>
      <h2>Provider State</h2>
      <table><thead><tr><th>Provider</th><th>Route</th><th>Docs Checked</th><th>Secret Names</th><th>Preflight</th><th>Validation</th></tr></thead><tbody>${toolRows}</tbody></table>
    </section>
    <section>
      <h2>Founder Gates</h2>
      ${list(gates)}
    </section>
    <section>
      <h2>Active Failure Cards</h2>
      <div class="grid">${cardMarkup || '<p class="muted">None recorded</p>'}</div>
    </section>
    <section>
      <h2>Proof</h2>
      <div class="grid">${commandMarkup || '<p class="muted">No proof commands recorded yet</p>'}</div>
    </section>
  </main>
</body>
</html>
`;

  const output = args.outputPath ?? `${args.root}/launch-cockpit.html`;
  writeText(output, html);
  console.log(`Launch cockpit written to ${output}`);
  reportAndExit("Launch cockpit render", issues);
}

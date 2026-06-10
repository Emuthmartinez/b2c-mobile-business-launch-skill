import { type Harness } from "./_harness.js";

/**
 * Behavioral eval harness fixtures: only the deterministic surfaces are
 * exercised here (subset discovery and the credential gate). Live agent runs
 * stay in the manually-triggered behavioral-evals workflow, never in the
 * PR-gating pipeline.
 */
export function register(h: Harness): void {
  const { runScriptArgs } = h;

  runScriptArgs("behavioral subset discovery lists the flagship scenarios", "run-behavioral-evals.ts", ["--list"], 0, "stale-installed-skill-runtime");
  runScriptArgs("behavioral run without credentials fails loudly", "run-behavioral-evals.ts", [], 1, "ANTHROPIC_API_KEY is required", {
    ANTHROPIC_API_KEY: "",
  });
}

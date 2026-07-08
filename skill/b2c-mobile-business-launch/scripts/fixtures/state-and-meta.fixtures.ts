import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  type Harness,
  type MutableRecord,
  expectRecord,
  getLane,
  getTools,
  readState,
  skillRoot,
  writeBusinessEntrypoints,
  writeCompleteAppleRequirements,
  writeCompleteAppleSigning,
  writeCompleteAttribution,
  writeCompleteCompoundEngineering,
  writeCompleteContentAssets,
  writeCompleteElevenStar,
  writeCompleteOrchestration,
  writeCompletePaidToolDecisions,
  writeCompletePaidUserAcquisition,
  writeCompleteProviderProof,
  writeCompleteSecurity,
  writeCompleteStoreConsole,
  writeCompleteStoreScreenshots,
  writeCompleteViralGrowth,
  writeSourceRegistryFixture,
  writeState,
} from "./_harness.js";

export function register(h: Harness): void {
  const { makeFixture, makeEmptyFixture, runFixture, runScriptArgs, results } = h;

  const clean = makeFixture("clean");
  writeBusinessEntrypoints(clean);
  writeCompleteAttribution(clean);
  writeCompleteAppleSigning(clean);
  writeCompleteAppleRequirements(clean);
  writeCompleteStoreConsole(clean);
  writeCompleteStoreScreenshots(clean);
  writeCompleteElevenStar(clean);
  writeCompleteSecurity(clean);
  writeCompleteContentAssets(clean);
  writeCompleteViralGrowth(clean);
  writeCompletePaidUserAcquisition(clean);
  writeCompleteOrchestration(clean);
  writeCompleteProviderProof(clean);
  runFixture("complete project state passes", clean, "validate-project-state.ts", 0);
  runFixture("complete attribution contract passes", clean, "check-attribution-contract.ts", 0);
  runFixture("clean secret routing passes", clean, "check-secret-routing.ts", 0);
  runFixture("complete security release packet passes", clean, "check-security-release.ts", 0);
  runFixture("complete content assets packet passes", clean, "check-content-assets.ts", 0);
  runFixture("complete viral growth packet passes", clean, "check-viral-growth-loop.ts", 0);
  runFixture("complete paid UA packet passes", clean, "check-paid-user-acquisition.ts", 0);
  runFixture("complete orchestration packet passes", clean, "check-parallel-orchestration.ts", 0);
  runFixture("complete Design Room state passes", clean, "validate-state.ts", 0);
  runFixture("complete Design Room contract passes", clean, "check-design-room-contract.ts", 0);
  runFixture("complete Control Plane contract passes", clean, "check-control-plane-contract.ts", 0);
  runFixture("complete token promotion passes", clean, "check-token-promotion.ts", 0);
  runFixture("complete provider proof passes", clean, "check-live-provider-proof.ts", 0);
  runFixture("complete Apple signing packet passes", clean, "check-apple-signing-packet.ts", 0);
  runFixture("complete Apple App Store requirements packet passes", clean, "check-apple-app-store-requirements.ts", 0);
  runFixture("complete store console packet passes", clean, "check-store-console-packet.ts", 0);
  runFixture("complete store screenshots packet passes", clean, "check-store-screenshots.ts", 0);
  runFixture("complete native iOS proof packet passes", clean, "check-native-ios-proof.ts", 0);
  runFixture("complete UX pattern packet passes", clean, "check-ux-patterns.ts", 0);
  runFixture("complete onboarding conversion packet passes", clean, "check-onboarding-conversion.ts", 0);
  runFixture("complete 11-star experience packet passes", clean, "check-eleven-star-experience.ts", 0);
  runFixture("complete emotional design packet passes", clean, "check-emotional-design.ts", 0);
  runFixture("aso metadata packet passes", clean, "check-aso-metadata.ts", 0);
  runFixture("localization market research packet passes", clean, "check-localization-research.ts", 0);
  runFixture("landing funnel skips without landing scope", clean, "check-landing-funnel.ts", 0);
  runFixture("current skill version passes", skillRoot, "check-skill-version.ts", 0, undefined, ["--source", skillRoot, "--installed", skillRoot]);
  runFixture("current version discipline passes", skillRoot, "check-version-discipline.ts", 0, undefined, [
    "--repo-root",
    path.resolve(skillRoot, "../.."),
    "--skill-root",
    skillRoot,
  ]);
  runFixture("artifact template coverage passes", path.join(skillRoot, "templates"), "check-artifact-templates.ts", 0, undefined, ["--skill-root", skillRoot]);
  runFixture("continuity contract templates pass", skillRoot, "check-continuity-contract.ts", 0, undefined, ["--skill-root", skillRoot]);
  runFixture("generated business continuity contract passes", clean, "check-continuity-contract.ts", 0);
  const emptyBusinessForContinuity = makeEmptyFixture("continuity-empty-business");
  runScriptArgs(
    "continuity root override after skill-root checks business root",
    "check-continuity-contract.ts",
    ["--skill-root", skillRoot, "--root", emptyBusinessForContinuity],
    1,
    "continuity.file_missing",
  );
  runFixture("agent behavior eval definitions pass", path.join(skillRoot, "evals/agent-behavior"), "run-agent-evals.ts", 0);
  runFixture("app archetype packs pass", skillRoot, "check-app-archetype.ts", 0, undefined, ["--skill-root", skillRoot]);
  const archetypeMissing = makeEmptyFixture("app-archetype-missing");
  runScriptArgs("app archetype layer missing fails", "check-app-archetype.ts", ["--skill-root", archetypeMissing], 1, "app_archetype.dir_missing");
  runFixture("compound engineering not in scope passes", clean, "check-compound-engineering-routing.ts", 0);
  writeCompletePaidToolDecisions(clean);
  runFixture("complete paid-tool decisions packet passes", clean, "check-paid-tool-decisions.ts", 0);

  const asoMissingListing = makeFixture("aso-missing-listing");
  rmSync(path.join(asoMissingListing, "app-store-listing"), { recursive: true, force: true });
  rmSync(path.join(asoMissingListing, "APP_STORE_LISTING.md"), { force: true });
  runFixture("aso metadata without APP_STORE_LISTING fails", asoMissingListing, "check-aso-metadata.ts", 1, "aso_metadata.app_store_listing_missing");

  const paidToolMissing = makeFixture("paid-tool-missing-decisions");
  rmSync(path.join(paidToolMissing, "TOOL_DECISIONS.md"), { force: true });
  runFixture(
    "missing TOOL_DECISIONS.md fails when paid tools in scope",
    paidToolMissing,
    "check-paid-tool-decisions.ts",
    1,
    "paid_tool_decisions.file_missing",
  );

  const localizationTranslateFirst = makeFixture("localization-translate-first");
  rmSync(path.join(localizationTranslateFirst, "localization-market-research"), { recursive: true, force: true });
  writeFileSync(
    path.join(localizationTranslateFirst, "APP_STORE_LISTING.md"),
    ["# App Store Listing", "Localization matrix: target locales ja, de, pt-BR.", "Localized keywords prepared for all locales."].join("\n"),
    "utf8",
  );
  runFixture(
    "localization without market research fails as translate-first",
    localizationTranslateFirst,
    "check-localization-research.ts",
    1,
    "localization_research.translate_first",
  );

  const wranglerCreds = makeFixture("wrangler-toml-credentials");
  writeFileSync(
    path.join(wranglerCreds, "wrangler.toml"),
    ['name = "app-landing"', "[vars]", 'SUPABASE_ANON = "sb_publishable_abcdefghijklmnopqrstuvwx"'].join("\n"),
    "utf8",
  );
  runFixture("wrangler.toml committed credential warns", wranglerCreds, "check-secret-routing.ts", 0, "secrets.wrangler_toml_credentials");

  const sourceRegistryClean = makeEmptyFixture("source-registry-clean");
  writeSourceRegistryFixture(sourceRegistryClean);
  runFixture("source registry with registered URL passes", sourceRegistryClean, "check-source-freshness.ts", 0);
  runFixture("template secret docs pass from bundled template path", path.join(skillRoot, "templates"), "check-secret-routing.ts", 0);
  const cockpitPath = path.join(clean, "launch-cockpit.html");
  runFixture("launch cockpit renders", clean, "render-launch-cockpit.ts", 0, undefined, ["--out", cockpitPath]);
  if (!existsSync(cockpitPath)) {
    results.push({
      label: "launch cockpit output exists",
      ok: false,
      expectedCode: 0,
      actualCode: null,
      output: `Missing ${cockpitPath}`,
    });
  }

  const continuityMissingAgents = makeFixture("continuity-missing-agents");
  writeBusinessEntrypoints(continuityMissingAgents);
  writeFileSync(
    path.join(continuityMissingAgents, "AGENTS.md"),
    readFileSync(path.join(continuityMissingAgents, "AGENTS.md"), "utf8").replace(/## Session Continuity[\s\S]*?## Source Of Truth/, "## Source Of Truth"),
    "utf8",
  );
  runFixture("generated business without continuity entrypoint fails", continuityMissingAgents, "check-continuity-contract.ts", 1, "continuity.term_missing");

  const continuityMissingState = makeFixture("continuity-missing-state");
  writeBusinessEntrypoints(continuityMissingState);
  const stateWithoutContinuity = readState(continuityMissingState);
  delete stateWithoutContinuity.continuity;
  writeState(continuityMissingState, stateWithoutContinuity);
  runFixture("project state without continuity block fails", continuityMissingState, "check-continuity-contract.ts", 1, "continuity.project_state_missing");

  const continuityMissingSourceFile = makeFixture("continuity-missing-source-file");
  writeBusinessEntrypoints(continuityMissingSourceFile);
  rmSync(path.join(continuityMissingSourceFile, "PRODUCTION_READINESS.md"), { force: true });
  runFixture("business continuity without source file fails", continuityMissingSourceFile, "check-continuity-contract.ts", 1, "continuity.source_file_missing");

  const continuityMissingGitStatus = makeFixture("continuity-missing-git-status");
  writeBusinessEntrypoints(continuityMissingGitStatus);
  const stateWithoutGitStatus = readState(continuityMissingGitStatus);
  const continuityWithoutGitStatus = expectRecord(stateWithoutGitStatus.continuity, "continuity");
  delete continuityWithoutGitStatus.git_status_reviewed;
  writeState(continuityMissingGitStatus, stateWithoutGitStatus);
  runFixture(
    "project state without git status continuity field fails",
    continuityMissingGitStatus,
    "check-continuity-contract.ts",
    1,
    "continuity.project_state_git_status_missing",
  );

  const missingEvidence = makeFixture("missing-evidence");
  const missingEvidenceState = readState(missingEvidence);
  const missingEvidenceDesign = getLane(missingEvidenceState, "design");
  missingEvidenceDesign["status"] = "done";
  missingEvidenceDesign["evidence"] = ["MISSING.md"];
  writeState(missingEvidence, missingEvidenceState);
  runFixture("done lane with missing local evidence fails", missingEvidence, "validate-project-state.ts", 1, "done_evidence_missing");

  const blankEvidence = makeFixture("blank-evidence");
  const blankEvidenceState = readState(blankEvidence);
  const blankEvidenceDesign = getLane(blankEvidenceState, "design");
  blankEvidenceDesign["status"] = "done";
  blankEvidenceDesign["evidence"] = [""];
  writeState(blankEvidence, blankEvidenceState);
  runFixture("done lane with blank evidence fails", blankEvidence, "validate-project-state.ts", 1, "evidence.0.blank");

  const placeholderDate = makeFixture("placeholder-date");
  const placeholderDateState = readState(placeholderDate);
  placeholderDateState["updated_at"] = "YYYY-MM-DD";
  writeState(placeholderDate, placeholderDateState);
  runFixture("placeholder updated_at fails", placeholderDate, "validate-project-state.ts", 1, "updated_at.placeholder");

  const unreasonedNotNeeded = makeFixture("unreasoned-not-needed");
  const unreasonedState = readState(unreasonedNotNeeded);
  const unreasonedRevenue = getLane(unreasonedState, "revenue");
  unreasonedRevenue["status"] = "not_needed";
  unreasonedRevenue["evidence"] = [];
  unreasonedRevenue["blockers"] = [];
  writeState(unreasonedNotNeeded, unreasonedState);
  runFixture("not_needed lane without evidence or blocker fails", unreasonedNotNeeded, "validate-project-state.ts", 1, "not_needed_without_reason");

  const missingStateEmotionalLane = makeFixture("state-missing-emotional-lane");
  {
    const state = readState(missingStateEmotionalLane);
    const lanes = expectRecord(state.lanes, "PROJECT_STATE.yaml lanes");
    delete lanes.emotional_design;
    writeState(missingStateEmotionalLane, state);
  }
  runFixture("project state without emotional design lane fails", missingStateEmotionalLane, "validate-project-state.ts", 1, "lanes.emotional_design.missing");

  const unreasonedDeferredEmotional = makeFixture("unreasoned-deferred-emotional");
  const unreasonedDeferredState = readState(unreasonedDeferredEmotional);
  const unreasonedDeferredLane = getLane(unreasonedDeferredState, "emotional_design");
  unreasonedDeferredLane["status"] = "deferred";
  unreasonedDeferredLane["evidence"] = [];
  unreasonedDeferredLane["blockers"] = [];
  writeState(unreasonedDeferredEmotional, unreasonedDeferredState);
  runFixture("deferred emotional design lane without reason fails", unreasonedDeferredEmotional, "validate-project-state.ts", 1, "deferred_without_reason");

  // not_started lanes are exempt from the attribution contract (nothing to attribute yet);
  // a "partial" lane with an incomplete contract is a WARNING (WIP), and only "done" hard-errors.
  const partialAttribution = makeFixture("partial-attribution");
  const partialAttributionState = readState(partialAttribution);
  getLane(partialAttributionState, "analytics_attribution")["status"] = "partial";
  writeState(partialAttribution, partialAttributionState);
  runFixture("partial attribution contract warns", partialAttribution, "check-attribution-contract.ts", 0, "attribution.screen_early.incomplete");

  const attributionAlias = makeFixture("attribution-alias");
  const attributionAliasState = readState(attributionAlias);
  getLane(attributionAliasState, "analytics_attribution")["status"] = "partial";
  const aliasContract = expectRecord(getLane(attributionAliasState, "analytics_attribution").attribution_contract, "attribution_contract");
  aliasContract["screen_early"] = true;
  aliasContract["other_free_text"] = true;
  aliasContract["backend_persistence"] = true;
  aliasContract["anonymous_reconciliation"] = true;
  aliasContract["verified"] = true;
  aliasContract["event_name"] = "signup_attribution_selected";
  aliasContract["event_alias_reason"] = "Existing production dashboards map signup_attribution_selected to attribution_source_selected.";
  writeState(attributionAlias, attributionAliasState);
  writeFileSync(
    path.join(attributionAlias, "ANALYTICS.md"),
    [
      "# Analytics",
      "signup_attribution_selected is the app event alias for attribution_source_selected.",
      "PostHog person property: self_reported_source.",
    ].join("\n"),
    "utf8",
  );
  runFixture("documented attribution event alias passes with warning", attributionAlias, "check-attribution-contract.ts", 0, "attribution.event_name.alias");

  const attributionMissingImplementation = makeFixture("attribution-code-missing");
  const attributionMissingState = readState(attributionMissingImplementation);
  const missingContract = expectRecord(getLane(attributionMissingState, "analytics_attribution").attribution_contract, "attribution_contract");
  const missingAttributionLane = getLane(attributionMissingState, "analytics_attribution");
  missingAttributionLane["status"] = "done";
  missingAttributionLane["evidence"] = ["ANALYTICS.md"];
  missingContract["screen_early"] = true;
  missingContract["other_free_text"] = true;
  missingContract["backend_persistence"] = true;
  missingContract["anonymous_reconciliation"] = true;
  missingContract["verified"] = true;
  writeState(attributionMissingImplementation, attributionMissingState);
  writeFileSync(
    path.join(attributionMissingImplementation, "ANALYTICS.md"),
    "# Analytics\n\nAnalytics implementation details are intentionally absent in this fixture.\n",
    "utf8",
  );
  runFixture(
    "done attribution without implementation text fails",
    attributionMissingImplementation,
    "check-attribution-contract.ts",
    1,
    "attribution.text.self_reported_source.not_found",
  );

  const attributionNotNeeded = makeFixture("attribution-not-needed");
  const attributionNotNeededState = readState(attributionNotNeeded);
  const attributionNotNeededLane = getLane(attributionNotNeededState, "analytics_attribution");
  attributionNotNeededLane["status"] = "not_needed";
  attributionNotNeededLane["evidence"] = [];
  attributionNotNeededLane["blockers"] = ["No onboarding, signup, or user identity surface exists in this app."];
  writeState(attributionNotNeeded, attributionNotNeededState);
  runFixture("attribution not_needed with reason passes attribution check", attributionNotNeeded, "check-attribution-contract.ts", 0);

  // --- check-lane-coverage ---
  const laneCoverageBaseline = makeFixture("lane-coverage-baseline");
  runFixture("shipped template lane set passes coverage", laneCoverageBaseline, "check-lane-coverage.ts", 0);

  const laneCoverageMissingLane = makeFixture("lane-coverage-missing-lane");
  const laneCoverageState = readState(laneCoverageMissingLane);
  delete expectRecord(laneCoverageState.lanes, "PROJECT_STATE.yaml lanes")["revenue"];
  writeState(laneCoverageMissingLane, laneCoverageState);
  runFixture("state missing a required lane fails coverage", laneCoverageMissingLane, "check-lane-coverage.ts", 1, "lane_coverage.revenue.missing");
}

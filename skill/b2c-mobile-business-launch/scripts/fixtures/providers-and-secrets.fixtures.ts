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

  const nestedEnv = makeFixture("nested-env");
  mkdirSync(path.join(nestedEnv, "config"), { recursive: true });
  writeFileSync(path.join(nestedEnv, "config", ".env"), "POSTHOG_PROJECT_API_KEY=example\n", "utf8");
  runFixture("nested .env fails secret routing", nestedEnv, "check-secret-routing.ts", 1, "secrets.forbidden_file..env");

  const rawEnvExample = makeFixture("raw-env-example");
  writeFileSync(path.join(rawEnvExample, "secrets", ".env.example"), "STRIPE_SECRET_KEY=sk_test_1234567890abcdef\n", "utf8");
  runFixture("raw-looking test key in .env.example fails", rawEnvExample, "check-secret-routing.ts", 1, "secrets.raw_secret_pattern");

  const missingSecretEntry = makeFixture("missing-secret-entry");
  const missingSecretState = readState(missingSecretEntry);
  const missingSecretTools = getTools(missingSecretState);
  expectRecord(missingSecretTools["resend"], "tools.resend")["required_secrets"] = [];
  writeState(missingSecretEntry, missingSecretState);
  writeFileSync(
    path.join(missingSecretEntry, "SECRETS.md"),
    "# Secrets\n\nNo raw secrets. Provider: Doppler. CI and production use `doppler run --`.\n",
    "utf8",
  );
  mkdirSync(path.join(missingSecretEntry, "src"), { recursive: true });
  writeFileSync(path.join(missingSecretEntry, "src", "email.ts"), "export const resendKey = process.env.RESEND_API_KEY;\n", "utf8");
  runFixture(
    "code secret reference missing from state and secrets doc fails",
    missingSecretEntry,
    "check-secret-routing.ts",
    1,
    "secrets.RESEND_API_KEY.unrouted",
  );

  const missingSecurity = makeFixture("missing-security");
  rmSync(path.join(missingSecurity, "SECURITY.md"), { force: true });
  runFixture("missing security packet fails", missingSecurity, "check-security-release.ts", 1, "security.markdown_missing");

  const thinSecurity = makeFixture("thin-security");
  writeFileSync(path.join(thinSecurity, "SECURITY.md"), ["# Security", "We will be secure.", "Sentry is planned."].join("\n"), "utf8");
  runFixture("thin security packet fails", thinSecurity, "check-security-release.ts", 1, "security.source_basis.missing");

  const unresolvedSecurity = makeFixture("unresolved-security");
  writeCompleteSecurity(unresolvedSecurity);
  writeFileSync(
    path.join(unresolvedSecurity, "SECURITY.md"),
    [
      "# Security Release Plan",
      "Source Basis: OWASP MASVS, OWASP ASVS, Apple Platform Security, Android security best practices, Claude Security, Codex Security, MobSF, Doppler, Sentry.",
      "Security Review Tool Routing: free fallback requires founder approval.",
      "Threat Model: Assets, Trust Boundaries, Attacker Capabilities, and Data Classification are present.",
      "Mobile Hardening: Keychain, App Transport Security, App Attest, DeviceCheck, entitlements, APPLE_SIGNING.md, Android Keystore, Network Security Config, and Play Integrity are listed.",
      "Authentication and Authorization protect Backend and API routes. Secrets use Doppler.",
      "Revenue, Entitlements, RevenueCat, Stripe, restore, webhook, and idempotency are covered.",
      "Privacy and Analytics include PostHog, session replay, PII, PII scrubbing, and self-reported attribution.",
      "Email security includes SPF, DKIM, DMARC, unsubscribe, and Resend. Public web uses security.txt and security headers.",
      "Supply Chain, Monitoring, Incident Response, Release Proof, Accepted Risks, Founder Approval, Sentry, release health, and MobSF are covered.",
      "App Attest is pending.",
    ].join("\n"),
    "utf8",
  );
  runFixture("security packet with unresolved platform gate fails", unresolvedSecurity, "check-security-release.ts", 1, "security.placeholder_or_unknown");

  // --- check-revenue ---
  const revenueBaseline = makeFixture("revenue-baseline");
  runFixture("shipped revenue template passes before the lane is claimed", revenueBaseline, "check-revenue.ts", 0);

  const revenueDoneNoProof = makeFixture("revenue-done-no-proof");
  const revenueDoneNoProofState = readState(revenueDoneNoProof);
  getLane(revenueDoneNoProofState, "revenue")["status"] = "done";
  writeState(revenueDoneNoProof, revenueDoneNoProofState);
  runFixture("done revenue lane without a live probe artifact fails", revenueDoneNoProof, "check-revenue.ts", 1, "revenue.proof_json.missing");

  // Example-copy evasion: pasting the shipped example's content as "proof"
  // must fail even when the app repo never seeded the example file (the old
  // comparison only looked at the app repo's copy).
  const revenueExampleCopy = makeFixture("revenue-example-copy-unseeded");
  const revenueExampleCopyState = readState(revenueExampleCopy);
  getLane(revenueExampleCopyState, "revenue")["status"] = "done";
  writeState(revenueExampleCopy, revenueExampleCopyState);
  const shippedExample = readFileSync(path.join(skillRoot, "templates", "revenue", "revenuecat-proof.example.json"), "utf8");
  writeFileSync(path.join(revenueExampleCopy, "revenue", "revenuecat-proof.json"), shippedExample, "utf8");
  rmSync(path.join(revenueExampleCopy, "revenue", "revenuecat-proof.example.json"), { force: true });
  runFixture(
    "done revenue lane with pasted example proof fails even when the example was never seeded",
    revenueExampleCopy,
    "check-revenue.ts",
    1,
    "revenue.proof_json.tier1_example_copy",
  );
}

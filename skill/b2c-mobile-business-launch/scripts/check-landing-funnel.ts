#!/usr/bin/env node
/**
 * check-landing-funnel
 *
 * Statically validates that the Phase 4 pre-launch funnel landing package
 * documents the five pre-deploy gates and the browser-rendered form smoke test.
 *
 * Checks README.md, PRODUCTION_READINESS.md, and the landing lane state in
 * PROJECT_STATE.yaml. Does NOT execute git, wrangler, or a browser — it
 * verifies that the agent has recorded the gate results in the right artifacts.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { asString, collectFiles, getPath, issue, loadProjectState, parseCliArgs, readText, reportAndExit } from "./lib/launch-state.js";

const args = parseCliArgs(process.argv.slice(2));
const loaded = loadProjectState(args);
const issues = [...loaded.issues];
const state = loaded.state;

function includes(text: string, phrase: string): boolean {
  return text.toLowerCase().includes(phrase.toLowerCase());
}

function mentionsAny(text: string, terms: string[]): boolean {
  return terms.some((t) => includes(text, t));
}

// Determine whether a landing/funnel lane is in scope
function laneStatus(name: string): string | undefined {
  return state ? asString(getPath(state, `lanes.${name}.status`))?.toLowerCase() : undefined;
}

// The funnel lane may be tracked under different names across projects.
const landingStatus = laneStatus("landing") ?? laneStatus("funnel");
// Only enforce when a landing site is actually in scope: either a lane explicitly
// marks it in progress/done, or landing artifacts exist on disk. Skip cleanly
// otherwise so the validator never false-positives on a non-landing repo.
const hasLandingArtifacts =
  existsSync(path.join(args.root, "landing")) || existsSync(path.join(args.root, "public")) || existsSync(path.join(args.root, "landing", "README.md"));
const explicitlyOut = landingStatus === "not_needed" || landingStatus === "deferred";
const inScope = !explicitlyOut && (Boolean(landingStatus) || hasLandingArtifacts);

if (!inScope) {
  reportAndExit("Landing funnel check (skipped — no landing/funnel lane or artifacts in scope)", issues);
  // No argument: honor the exit code reportAndExit set (errors still fail on the skip path).
  process.exit();
}

// Collect the candidate docs where gate evidence should be recorded
const candidateDocs = ["README.md", "landing/README.md", "PRODUCTION_READINESS.md", "landing/PRODUCTION_READINESS.md", "LAUNCH_TRACE.md"];

const docTexts: Array<{ path: string; text: string }> = [];
for (const rel of candidateDocs) {
  const text = readText(args.root, rel);
  if (text) {
    docTexts.push({ path: rel, text });
  }
}

const combinedText = docTexts.map((d) => d.text).join("\n");
const primaryDoc = docTexts.find((d) => d.path === "README.md" || d.path === "landing/README.md")?.path ?? candidateDocs[0];

if (docTexts.length === 0) {
  issues.push(
    issue(
      "warning",
      "landing_funnel.docs_missing",
      "No README.md or PRODUCTION_READINESS.md found under the project root or landing/. " +
        "Create at least one to document deploy gate results and smoke test evidence.",
      primaryDoc,
    ),
  );
}

// ── Gate 1: git clean before deploy ──────────────────────────────────────────
if (!mentionsAny(combinedText, ["git clean", "uncommitted", "working tree", "git status", "committed before deploy", "no uncommitted"])) {
  issues.push(
    issue(
      "error",
      "landing_funnel.git_clean_gate.missing",
      "Docs do not confirm that the working tree was clean (no uncommitted changes) before the last wrangler deploy. " +
        "Record 'git status --porcelain' was clean before deploy in README.md or PRODUCTION_READINESS.md.",
      primaryDoc,
    ),
  );
}

// ── Gate 2: wrangler version current ─────────────────────────────────────────
if (!mentionsAny(combinedText, ["wrangler version", "wrangler v4", "wrangler@4", "wrangler upgrade", "wrangler current", "updated wrangler"])) {
  issues.push(
    issue(
      "error",
      "landing_funnel.wrangler_version_gate.missing",
      "Docs do not confirm the wrangler major version was checked and current before deploy. " +
        "Record the wrangler version used and that it is not a major version behind in README.md or PRODUCTION_READINESS.md.",
      primaryDoc,
    ),
  );
}

// ── Gate 3: wrangler whoami / token scope ─────────────────────────────────────
if (!mentionsAny(combinedText, ["wrangler whoami", "pages:edit", "workers:edit", "api token", "token scope", "cloudflare token"])) {
  issues.push(
    issue(
      "error",
      "landing_funnel.token_scope_gate.missing",
      "Docs do not confirm 'wrangler whoami' was run to verify the Cloudflare API token has Pages:Edit or Workers:Edit scope before the first deploy. " +
        "Record the token scope check in README.md or PRODUCTION_READINESS.md.",
      primaryDoc,
    ),
  );
}

// ── Gate 4: Alpine CSP / x-model awareness ───────────────────────────────────
// Only enforce when Alpine or a CSP header is referenced anywhere in the project
const usesAlpine =
  mentionsAny(combinedText, ["alpine", "x-model", "x-data", "@alpinejs"]) ||
  (() => {
    // Also check any HTML files in landing/
    const landingDir = path.join(args.root, "landing");
    if (!existsSync(landingDir)) return false;
    const tryFiles = ["landing/index.html", "public/index.html"];
    return tryFiles.some((f) => {
      const t = readText(args.root, f);
      return t ? mentionsAny(t, ["alpine", "x-model", "@alpinejs"]) : false;
    });
  })();

if (
  usesAlpine &&
  !mentionsAny(combinedText, ["alpinejs/csp", "@alpinejs/csp", "csp-safe", "csp build", "alpine csp", "x-model csp", "inline expression", "csp alpine"])
) {
  issues.push(
    issue(
      "error",
      "landing_funnel.alpine_csp_gate.missing",
      "Alpine.js is referenced but docs do not confirm the @alpinejs/csp build is used and x-model/inline expressions have been replaced with method calls. " +
        "Alpine's CSP-safe build forbids inline assignment expressions including x-model; failure surfaces only in a browser with a strict CSP, not in curl. " +
        "Record the CSP/Alpine audit result in README.md or PRODUCTION_READINESS.md.",
      primaryDoc,
    ),
  );
}

// ── Gate 5: browser-rendered form smoke test ─────────────────────────────────
if (
  !mentionsAny(combinedText, [
    "browser",
    "playwright",
    "puppeteer",
    "mobai",
    "form smoke test",
    "browser smoke",
    "browser-rendered",
    "browser rendered",
    "browser test",
    "opened in browser",
    "browser form",
    "filled the form",
    "submitted the form",
    "success panel",
    "success state",
    "success screen",
    "form submission",
  ])
) {
  issues.push(
    issue(
      "error",
      "landing_funnel.browser_form_smoke_test.missing",
      "Docs do not confirm a browser-rendered form smoke test was completed on the live URL. " +
        "A curl/API test does not catch Alpine rendering bugs, CSP violations, or JS event-binding errors. " +
        "Open the live URL in a real browser, fill the form, click submit, and assert the success state is visible. " +
        "Record the result in README.md or PRODUCTION_READINESS.md.",
      primaryDoc,
    ),
  );
}

// ── Done state guard ──────────────────────────────────────────────────────────
if (landingStatus === "done" && /\b(TODO|TBD|unknown|placeholder|pending)\b/i.test(combinedText)) {
  issues.push(
    issue(
      "error",
      "landing_funnel.placeholder_complete",
      "Landing lane is marked done but docs contain TODO/TBD/unknown/placeholder/pending language. " +
        "Resolve all placeholders before marking the landing lane done.",
      primaryDoc,
    ),
  );
}

// ── GEO/SEO: robots.txt, llms.txt, sitemap ───────────────────────────────────
const publicRoots = ["public", "static", "dist", "out", "."];
function findStaticFile(filename: string): boolean {
  return publicRoots.some((root) => existsSync(path.join(args.root, root, filename)));
}

if (!findStaticFile("robots.txt")) {
  issues.push(
    issue(
      "error",
      "landing_funnel.geo_seo.robots_txt.missing",
      "robots.txt is missing from the public directory. AI and search crawlers need explicit access rules. See references/geo-seo.md section 5.",
      "public/robots.txt",
    ),
  );
}

if (!findStaticFile("llms.txt")) {
  issues.push(
    issue(
      "error",
      "landing_funnel.geo_seo.llms_txt.missing",
      "llms.txt is missing. Add it so AI answer engines can discover and cite the product. See references/geo-seo.md section 1 (geo-llmstxt skill).",
      "public/llms.txt",
    ),
  );
}

if (!findStaticFile("sitemap.xml")) {
  issues.push(
    issue(
      "error",
      "landing_funnel.geo_seo.sitemap.missing",
      "sitemap.xml is missing from the public directory. Required for search-engine discovery.",
      "public/sitemap.xml",
    ),
  );
}

// ── GEO/SEO: JSON-LD parseability ────────────────────────────────────────────
const htmlExtensions = new Set([".html", ".astro"]);
const htmlFiles = collectFiles(args.root, htmlExtensions);
const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

for (const filePath of htmlFiles) {
  const relativePath = path.relative(args.root, filePath);
  let fileText: string;
  try {
    fileText = readFileSync(filePath, "utf8");
  } catch {
    continue;
  }
  jsonLdRegex.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = jsonLdRegex.exec(fileText)) !== null) {
    const jsonContent = (match[1] ?? "").trim();
    try {
      JSON.parse(jsonContent);
    } catch (parseError) {
      const msg = parseError instanceof Error ? parseError.message : String(parseError);
      issues.push(
        issue(
          "error",
          "landing_funnel.geo_seo.json_ld.parse_error",
          `JSON-LD in ${relativePath} is not valid JSON: ${msg}. Invalid schema blocks structured-data rich results silently. See references/geo-seo.md section 4.`,
          relativePath,
        ),
      );
    }
  }
}

// ── Copy compliance scan ──────────────────────────────────────────────────────
// Patterns that have shipped to production and required founder corrections.
// Sourced from failure evidence in geo-seo-landing-copy-validators-absent.
const bannedCopyPatterns: Array<[RegExp, string, string]> = [
  [
    /top\s+\d+\s+(unlock|get|receive|earn|referr)/i,
    "landing_funnel.copy.ranked_cohort_claim",
    "Landing copy contains a ranked-cohort claim (e.g. 'Top 10 unlock', 'Top 100 referrers get'). Remove or ensure the waitlist system actively enforces the cutoff. See references/geo-seo.md section 4.",
  ],
  [
    /free\s+(first\s+year|lifetime|forever|always)\s+(of\s+)?(pro|premium|plus|access)/i,
    "landing_funnel.copy.unverified_free_tier_promise",
    "Landing copy promises free or lifetime access not reflected in REVENUE_OPS.md. Cross-check before shipping. See references/geo-seo.md section 4.",
  ],
  [
    /lifetime\s+(access|membership|pro|premium)/i,
    "landing_funnel.copy.lifetime_promise",
    "Landing copy promises lifetime access. Verify against REVENUE_OPS.md pricing and entitlement design. See references/geo-seo.md section 4.",
  ],
  [
    /tested\s+by\s+(applied\s+)?(performance\s+)?researcher/i,
    "landing_funnel.copy.unverified_authority_claim",
    "Landing copy includes an implied researcher/authority endorsement without a citable source. Remove or add a verifiable citation. See references/geo-seo.md section 4.",
  ],
  [
    /clinically\s+validated|clinically\s+proven|neuroscience.backed|scientifically\s+proven/i,
    "landing_funnel.copy.unverified_clinical_claim",
    "Landing copy includes a clinical/neuroscience claim. Remove or supply verifiable citations for legal review. See references/geo-seo.md section 4.",
  ],
  [
    /when\s+they\s+ship/i,
    "landing_funnel.copy.unshipped_feature_promise",
    "Landing copy promises a device/integration that has not shipped yet ('when they ship'). Move to a clearly labeled roadmap section or remove. See references/geo-seo.md section 4.",
  ],
  [
    /spots?\s+(are\s+)?(almost\s+)?gone|limited\s+(availability|spots?)/i,
    "landing_funnel.copy.unverified_scarcity_claim",
    "Landing copy uses scarcity language without a live enforcement mechanism. Remove or wire to real inventory logic. See references/geo-seo.md section 4.",
  ],
];

const landingCopyExtensions = new Set([".html", ".astro", ".jsx", ".tsx", ".mdx", ".svelte", ".vue"]);
const landingSourceFiles = collectFiles(args.root, landingCopyExtensions);
const alreadyFlaggedCodes = new Set<string>();

for (const filePath of landingSourceFiles) {
  const relativePath = path.relative(args.root, filePath);
  let srcText: string;
  try {
    srcText = readFileSync(filePath, "utf8");
  } catch {
    continue;
  }
  for (const [pattern, code, message] of bannedCopyPatterns) {
    if (!alreadyFlaggedCodes.has(code) && pattern.test(srcText)) {
      issues.push(issue("error", code, `${message} [found in ${relativePath}]`, relativePath));
      alreadyFlaggedCodes.add(code); // one issue per pattern across the whole repo is enough signal
    }
  }
}

// ── Waitlist idempotency ──────────────────────────────────────────────────────
const hasWaitlistSurface = landingSourceFiles.some((f) => {
  try {
    return /waitlist|join.+list|notify.+me/i.test(readFileSync(f, "utf8"));
  } catch {
    return false;
  }
});

if (hasWaitlistSurface) {
  const geoSeoText = readText(args.root, "GEO_SEO.md") ?? readText(args.root, "LAUNCH.md") ?? "";
  const hasIdempotencyNote =
    includes(combinedText, "idempotent") ||
    includes(combinedText, "duplicate email") ||
    includes(combinedText, "already signed up") ||
    includes(geoSeoText, "idempotent") ||
    includes(geoSeoText, "duplicate email");

  if (!hasIdempotencyNote) {
    issues.push(
      issue(
        "error",
        "landing_funnel.waitlist.idempotency_undocumented",
        "A waitlist surface exists but docs do not confirm duplicate-email idempotency (HTTP 200 for repeated submits). Add idempotency proof or a test note before marking the funnel ready. See references/geo-seo.md section 4.",
        primaryDoc,
      ),
    );
  }
}

// ── Landing motion craft ──────────────────────────────────────────────────────
// When a landing surface carries motion, enforce the progressive-enhancement
// contract from references/landing-motion-craft.md: a prefers-reduced-motion
// fallback, above-the-fold text that is real static HTML (not a client-only
// shell), and tokenized (--motion-*) timing rather than hard-coded magic numbers.
const motionExtensions = new Set([".html", ".astro", ".jsx", ".tsx", ".mdx", ".svelte", ".vue", ".css"]);
const motionFiles = collectFiles(args.root, motionExtensions);
const motionFileTexts: Array<{ path: string; text: string }> = [];
let motionCombined = "";
for (const filePath of motionFiles) {
  let text: string;
  try {
    text = readFileSync(filePath, "utf8");
  } catch {
    continue;
  }
  motionFileTexts.push({ path: path.relative(args.root, filePath), text });
  motionCombined += `\n${text}`;
}

const hasMotion =
  /@keyframes|animation\s*:|animation-name|transition\s*:|transition-property|framer-motion|motion\/react|whileinview|usescroll|usetransform|requestanimationframe|\.animate\(/i.test(
    motionCombined,
  );

if (hasMotion) {
  // Gate: a reduced-motion fallback must exist once the surface carries motion.
  if (!/prefers-reduced-motion|usereducedmotion/i.test(motionCombined)) {
    issues.push(
      issue(
        "error",
        "landing_funnel.motion.reduced_motion_missing",
        "Landing surfaces carry motion (animation/transition/motion library) but no reduced-motion fallback was found. " +
          "Add an `@media (prefers-reduced-motion: reduce)` block (or `useReducedMotion()`) that collapses non-essential motion to a static, legible state. " +
          "See references/landing-motion-craft.md.",
        primaryDoc,
      ),
    );
  }

  // Gate (warning): motion timing should read the tokenized --motion-* scale.
  if (!/--motion-/i.test(motionCombined)) {
    issues.push(
      issue(
        "warning",
        "landing_funnel.motion.hardcoded_timing",
        "Landing motion timing does not reference the tokenized `--motion-*` variables. Read durations/easings from design-system/tokens.css so the landing page and Remotion assets share one timing system. " +
          "See references/landing-motion-craft.md.",
        primaryDoc,
      ),
    );
  }
}

// Gate: above-the-fold hero text must exist in the static HTML of a landing
// entry page (not a JS-injected SPA shell), so crawlers, AI answer engines, and
// no-JS users see it and LCP is not gated behind an animation.
for (const { path: relFile, text } of motionFileTexts) {
  if (!/(^|\/)index\.(html|astro)$/i.test(relFile)) {
    continue;
  }
  const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(text);
  const body = bodyMatch?.[1] ?? text;
  const looksLikeSpaShell = /<(?:div|main)[^>]+id=["'](?:root|app|__next)["']/i.test(body);
  const staticText = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (looksLikeSpaShell && staticText.length < 40) {
    issues.push(
      issue(
        "error",
        "landing_funnel.motion.hero_text_not_static",
        `${relFile} renders as a client-only shell with no above-the-fold text in the static HTML. ` +
          "Server-render or statically render the hero headline, subhead, and CTA so crawlers and no-JS users see them and motion stays progressive enhancement. " +
          "See references/landing-motion-craft.md.",
        relFile,
      ),
    );
  }
}

reportAndExit("Landing funnel check", issues);

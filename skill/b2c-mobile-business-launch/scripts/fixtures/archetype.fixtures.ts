import { appendFileSync, cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { type Harness, skillRoot } from "./_harness.js";

/**
 * Archetype fixtures: the runnable starter scaffolds shipped inside the
 * archetype packs (check-archetype-starter) and their routing in
 * check-app-archetype.
 */
export function register(h: Harness): void {
  const { makeEmptyFixture, runScriptArgs } = h;

  // The shipped starters themselves must satisfy the full contract.
  runScriptArgs("archetype starter scaffolds pass", "check-archetype-starter.ts", ["--skill-root", skillRoot], 0);

  // Build a fake skill root carrying only the archetype packs, then break it.
  function makeArchetypeSkillRoot(name: string): string {
    const fakeRoot = makeEmptyFixture(name);
    mkdirSync(path.join(fakeRoot, "templates"), { recursive: true });
    cpSync(path.join(skillRoot, "templates", "app-archetypes"), path.join(fakeRoot, "templates", "app-archetypes"), { recursive: true });
    return fakeRoot;
  }

  const noLockfile = makeArchetypeSkillRoot("archetype-starter-no-lockfile");
  rmSync(path.join(noLockfile, "templates", "app-archetypes", "social-network", "starter", "package-lock.json"));
  runScriptArgs(
    "starter without lockfile fails",
    "check-archetype-starter.ts",
    ["--skill-root", noLockfile],
    1,
    "archetype_starter.social-network.lockfile_missing",
  );

  const envWithValue = makeArchetypeSkillRoot("archetype-starter-env-value");
  appendFileSync(
    path.join(envWithValue, "templates", "app-archetypes", "ai-chat-companion", "starter", ".env.example"),
    "STRIPE_SECRET_KEY=sk_test_fixtureonlyfixtureonly\n",
    "utf8",
  );
  runScriptArgs(
    "starter env.example with a value fails",
    "check-archetype-starter.ts",
    ["--skill-root", envWithValue],
    1,
    "archetype_starter.ai-chat-companion.env_not_names_only",
  );

  // ── Reference context budget ──────────────────────────────────────────────

  runScriptArgs("references within context budget pass", "check-reference-size.ts", ["--skill-root", skillRoot], 0);

  const oversizedRef = makeEmptyFixture("reference-size-over-budget");
  mkdirSync(path.join(oversizedRef, "references"), { recursive: true });
  writeFileSync(path.join(oversizedRef, "references", "huge-lane.md"), `# Huge\n${"x".repeat(70 * 1024)}\n`, "utf8");
  runScriptArgs("oversized reference fails the context budget", "check-reference-size.ts", ["--skill-root", oversizedRef], 1, "reference_size.over_budget");

  const untestedRls = makeArchetypeSkillRoot("archetype-starter-untested-rls");
  rmSync(path.join(untestedRls, "templates", "app-archetypes", "social-network", "starter", "supabase", "tests"), { recursive: true });
  runScriptArgs(
    "starter without RLS tests fails",
    "check-archetype-starter.ts",
    ["--skill-root", untestedRls],
    1,
    "archetype_starter.social-network.rls_tests_missing",
  );
}

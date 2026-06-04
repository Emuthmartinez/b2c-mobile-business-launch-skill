# Reservoir (incubation workspace)

**Reservoir** — know exactly how much cash to keep on hand so a dead furnace is an annoyance, not a crisis.

A calm, defensive home emergency-fund app for new homeowners: inventory your major systems and appliances, get one recommended cash reserve (a % band of total replacement value), see how covered you already are, learn what's most likely to break first, and track spend, manuals, spare parts, and trusted pros per item. Explicitly non-gamified — no mascot, no streaks, no alarmism.

## Status

Phase 1 (research/scaffold). This folder was generated with the `b2c-mobile-business-launch` skill and **will be moved into its own repository before app build**. The working name "Reservoir" is provisional pending a name-collision / trademark / domain check.

Start with `AGENTS.md`, then `PROJECT_STATE.yaml` and `launch-cockpit.html`.

## What's here so far

| File | Purpose |
| --- | --- |
| `AGENTS.md` / `CLAUDE.md` | Agent operating guide; keeps future sessions on the launch skill workflow. |
| `PROJECT_STATE.yaml` | Machine-readable launch state: phase, lanes, tools, gates, failure cards. |
| `launch-cockpit.html` | Founder-facing rendered status of all lanes. |
| `RESEARCH.md` | Evidence ledger grounded in real homeowner language (Reddit, 2026-06-03). |
| `11-star-experience/` | The product's 11-star experience and the V1 scalable slice + HTML proof. |
| `state/` + `design-room.html` | Design Room state (brand, theme tokens, core screens/flows) and its render. |

## Next steps (scheduled)

Deepen research (category economics, competitors, keywords), run the name-collision check, lock the 11-star V1 slice with the founder, then `SPEC.md`, `BRAND.md`/`DESIGN.md`, analytics plan, and the rest of the launch lanes per `PROJECT_STATE.yaml`.

## Working with this folder

From the skill maintainer repo root, validators can target this folder:

```bash
npx tsx skill/b2c-mobile-business-launch/scripts/validate-project-state.ts --root reservoir --state PROJECT_STATE.yaml
npx tsx skill/b2c-mobile-business-launch/scripts/validate-state.ts --root reservoir
npx tsx skill/b2c-mobile-business-launch/scripts/check-eleven-star-experience.ts --root reservoir --state PROJECT_STATE.yaml
npx tsx skill/b2c-mobile-business-launch/scripts/render-launch-cockpit.ts --root reservoir --state PROJECT_STATE.yaml --out reservoir/launch-cockpit.html
```

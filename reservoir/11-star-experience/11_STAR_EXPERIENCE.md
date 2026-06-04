# Reservoir 11-Star Experience

This artifact defines the product's extreme experience, the feasible V1 slice, and how the same magic translates across product, onboarding, ads, store, engineering, lifecycle, and support. Status: **partial** — the V1 slice is proposed and pending founder confirmation at the Phase 1c checkpoint.

## Experience Thesis

- Target user: New / recent homeowners (first ~5 years) who have already felt — or dread — the sucker-punch of an unexpected major repair (furnace, AC, water heater, roof, garage door).
- Ordinary world: They "can afford the mortgage" but have no idea how much cash they should keep on hand for the things that *will* break. The fear is vague and unbounded, so they either ignore it (and get blindsided) or worry about it constantly.
- Desired transformation: Replace vague dread with **one defensible number** and a calm sense that they are covered — and a plan for what to do when something fails.
- One magical moment V1 must prove: After a 3-minute inventory, Reservoir shows the user a single recommended **Reserve Number** ("Keep about $X on hand") grounded in *their* actual systems and ages — and the feeling shifts from "I have no idea" to "okay, I know the number, and I'm most of the way there."
- Why a user would retell it: "I spent three minutes listing my stuff and it told me I should have $9k set aside — turns out I'm only $3k short, not bankrupt. I finally stopped low-key panicking about the furnace."

## Star Ladder

| Stars | Label | User scene | Product behavior implied | Emotional reaction | What we learn |
| --- | --- | --- | --- | --- | --- |
| 1 | Refund me | Reservoir spits out a scary number with no explanation, feels like a fear-sales funnel, or hides the user's own data behind a paywall. | Identify the trust-breakers: alarmism, opacity, hostage data. | Manipulated, resentful. | What must never ship. |
| 2 | It technically works | The user can list appliances and gets *a* number, but it's generic (national averages only), slow, and forgettable. | Remove friction; make the number feel like theirs, not a brochure stat. | Indifference. | Minimum usability bar. |
| 5 | Expected experience | The user inventories their systems and gets a clear recommended reserve as a % of replacement value, and can track items and spend. | Deliver the core loop reliably: inventory -> value -> Reserve Number -> manage. | "Okay, that's useful." | The baseline competitors/spreadsheets already imply. |
| 6 | Better than expected | Smart defaults pre-fill typical replacement costs and lifespans, so the user moves fast; the Reserve Number comes with a plain-English "why," and a coverage meter shows how close they already are. | Reflect user input, reduce uncertainty, show progress toward "covered." | Relief, trust. | The first feasible delight. |
| 7 | Way beyond | Reservoir orders the user's items by *what is most likely to break first* given age/type and tells them the two cheap spare parts worth keeping on hand for their specific units — so a future failure is shorter and cheaper. | Use item age/type data, failure-probability modeling, and parts knowledge to prepare the next best step. | "This was made for me — it's actually thinking ahead." | **The V1 magic candidate.** |
| 10 | Impossible concierge | A seasoned home inspector and a financial planner personally walk your house, hand you a binder: every system's remaining life, the exact reserve to hold, the parts pre-bought and labeled on a shelf, and a vetted tech on call for each item. | Reveal the hidden service blueprint Reservoir is compressing into software. | Amazement; total calm. | Which unscalable pieces (vetted pros, parts pre-buy) can become product later. |
| 11 | Absurd extreme | Nothing in the home ever surprises you again: failures are predicted, funded, and fixed before they ruin a weekend — the "emergency" stops existing. | Reveal the emotional north star: the unexpected becomes expected and handled. | They tell every new homeowner they know. | The true ambition, not the V1 scope. |

## Line Of Feasibility

- Feasible for V1: appliance/system inventory with smart defaults; total replacement value; recommended Reserve Number as a % of replacement value with a transparent "why"; coverage meter; per-item spend log, manuals link, spare-parts suggestions, and trusted-pro assignment; a rules-based "what breaks first" ordering from item age + typical lifespan.
- Feasible with light manual/concierge help: curated replacement-cost and lifespan tables per appliance category and region; a hand-built starter list of "two parts worth keeping" for the most common units.
- Deferred inspiration: live data-source hookups (utility/warranty/permit/MLS), automated valuation refresh, in-app vetted-pro marketplace, true actuarial failure probabilities from real outcome data.
- Explicitly not in scope (V1, founder-locked): mascot/characters, gamified points/badges/streaks, alarmist "you're at risk" framing, countdown-timer urgency, or any paywall that hides the user's own inventory.

## V1 Scalable Slice

- Experience slice to ship: **Inventory -> Reserve Number reveal -> "what breaks first" + parts-on-hand.** This is the smallest thing that delivers the 7-star "it's thinking ahead for me" moment.
- Product behavior: user adds major systems/appliances (type, approximate age, optional model) with smart-default replacement costs; app totals replacement value and computes a recommended reserve (a transparent % band of replacement value, refined by item age/condition); a coverage meter compares the user's stated current savings to the target; items are ranked by failure likelihood; each high-risk item suggests 1–2 cheap spare parts to keep on hand.
- Data/state/API requirements: appliance/category reference table (typical cost + lifespan), reserve-percentage model, per-item failure-likelihood heuristic, parts-suggestion mapping, local persistence of the user's inventory and spend log. See `TECH_SPEC.md`.
- Design and motion requirements:
  - Web delight (landing, funnel, web paywall, preview): tokenized framer-motion / `motion` micro-interactions; the Reserve Number counts up once to its target on first reveal; the coverage meter fills toward "covered."
  - Mobile delight (shipped binary): native animation from `DesignTokens.Motion` (SwiftUI) — no framer-motion; the same count-up and meter-fill, expressed natively.
  - Reduced-motion fallback for every delight moment (`prefers-reduced-motion` / OS reduce-motion): the number and meter appear in their final state instantly, with no count-up.
- Analytics proof: events for `inventory_item_added`, `replacement_value_revealed`, `reserve_number_revealed`, `coverage_meter_viewed`, `what_breaks_first_viewed`, `parts_suggestion_viewed`, plus the activation funnel from first item to Reserve Number. See `ANALYTICS.md`.
- Production-readiness proof: a real device run from cold start through the Reserve Number reveal with seeded inventory, the reference tables populated, and the events firing. See `PRODUCTION_READINESS.md`.

## Surface Matrix

| Surface | 11-star question | Product-specific answer | Artifact owner | Proof |
| --- | --- | --- | --- | --- |
| Product core loop | What result would the user retell? | "Three minutes in, it told me my number and that I'm most of the way there." | `SPEC.md`, `LAUNCH_TRACE.md` | Pending |
| Onboarding | What makes the user feel understood early? | The inventory *is* onboarding: each item they add visibly moves the reserve number, so they feel the picture forming. Native App Review prompt fires right after the first Reserve Number reveal. | `ONBOARDING.md`, `onboarding.html` | Pending |
| Paywall | What makes purchase feel like unlocking momentum? | Free: your Reserve Number and inventory. Reserve+: failure-probability ranking, what-breaks-first ordering, parts-on-hand, and ongoing recommendations — shown *after* the free value lands. | `REVENUE_OPS.md`, `design.md` | Pending |
| Paid UA | What tiny paid creative can truthfully preview the V1 magic and be measured against revenue? | A 10-second clip: "Type in your furnace, AC, and water heater — here's how much cash you should actually keep on hand." Ends on the number. | `PAID_UA.md`, `CONTENT_ASSETS.md`, `ANALYTICS.md`, `REVENUE_OPS.md` | Pending |
| Viral growth loop | What product moment would make sharing or referral feel natural? | "Send a new-homeowner friend their starting checklist" — the reserve concept is inherently advice friends give each other. | `VIRAL_GROWTH.md`, `ANALYTICS.md`, `LAUNCH_TRACE.md` | Pending |
| Ad or creator hook | What tiny experience can the ad deliver by itself? | The viewer does the math in their head and realizes they don't know their number — the ad creates the itch the app scratches. | `UGC_PLAYBOOK.md`, `CONTENT_ASSETS.md` | Pending |
| App Store screenshots | What three frames prove the magic? | (1) The Reserve Number hero, (2) the coverage meter near "covered," (3) "what breaks first" ranking with a parts suggestion. | `APP_STORE_LISTING.md`, `SCREENSHOTS.md` | Pending |
| Landing page | What scene makes the promise instantly clear? | "Know exactly how much cash to keep for when something breaks." One number, calm, above the fold. | landing page, `GEO_SEO.md` | Pending |
| Lifecycle email | What would feel like the product remembered the goal? | "Your water heater just crossed 10 years — here's the part to keep on the shelf and the pro you saved." | `EMAIL_OPS.md` | Pending |
| Support | What recovery would increase trust? | When a real failure happens, a calm "here's your saved pro, your part, and the money you set aside for exactly this" flow. | support docs, customer-success role | Pending |
| Engineering | What must be real in state, data, API, permissions, and fixtures? | Reference tables, reserve model, failure heuristic, parts map, local persistence, and the seeded fixture that reaches the Reserve Number. | `TECH_SPEC.md`, `ENGINEERING_PLAN.md` | Pending |

## Visual Storyboard

- Visual proof: `11-star-experience.html`
- Design-system source: `DESIGN.md`
- Screen spec source: `design.md`
- Content asset source: `CONTENT_ASSETS.md`
- Paid UA source: `PAID_UA.md`
- Viral growth source: `VIRAL_GROWTH.md`

## Traceability

| Trace ID | Experience decision | Source evidence | Product impact | Design impact | Build contract | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| EXP-001 | The hero is one Reserve Number, not a dashboard of anxiety. | `RESEARCH.md` (homeowners describe vague, unbounded dread about "what breaks next") | `SPEC.md` | `DESIGN.md` | `TECH_SPEC.md` | `PRODUCTION_READINESS.md` |
| EXP-002 | Reserve is framed as % of replacement value, mirroring the homeowner "1–4% of home value/year" rule people already cite. | `RESEARCH.md` (recurring maintenance-budget rule of thumb) | `SPEC.md` | `DESIGN.md` | `TECH_SPEC.md` | `PRODUCTION_READINESS.md` |
| EXP-003 | "What breaks first" + parts-on-hand is the 7-star differentiator that justifies Reserve+. | `RESEARCH.md` (HVAC/plumbing pro: age-based replacement is the real shock) | `SPEC.md`, `REVENUE_OPS.md` | `DESIGN.md` | `TECH_SPEC.md` | `PRODUCTION_READINESS.md` |

## Engineering Contract

- State machine: `empty -> inventorying -> value_revealed -> reserve_revealed -> managing` (item edits re-derive value, reserve, coverage, and ranking).
- Data model: `Home`, `Item {category, age, model?, replacementCost, lifespan, spendLog[], manualUrl?, partsSuggested[], proId?}`, `Pro`, `ReserveResult {targetAmount, percentBand, coverageRatio}`.
- API/RPC/webhook contracts: V1 is local-first; reference tables shipped with the binary or fetched read-only. RevenueCat entitlement check for Reserve+. See `TECH_SPEC.md`.
- Permissions: none required for the core loop (no location/contacts/notifications needed to reach the Reserve Number); any later additions are justified per `APPLE_APP_STORE_REQUIREMENTS.md`.
- Offline/error states: full inventory + Reserve Number work offline; missing reference data falls back to category averages with a visible "estimated" tag.
- Analytics events: as listed in V1 Scalable Slice; defined canonically in `ANALYTICS.md`.
- Test fixture: a seeded 6-item home (furnace, AC, water heater, roof, garage door, dishwasher) that deterministically produces a known Reserve Number for snapshot tests.
- E2E proof path: cold start -> add seeded items -> reach `reserve_revealed` -> view "what breaks first" on a real device.

## Acceptance Checklist

- [x] 1, 2, 5, 6, 7, 10, and 11-star levels are product-specific.
- [x] `Line Of Feasibility` separates V1, manual assist, deferred inspiration, and not-in-scope ideas.
- [x] `V1 Scalable Slice` names the magical moment the app will actually prove.
- [x] Surface matrix covers product, onboarding, paywall, ad, App Store, landing, email, support, and engineering.
- [ ] `SPEC.md`, `DESIGN.md`, `ONBOARDING.md`, `TECH_SPEC.md`, and `LAUNCH_TRACE.md` reference this artifact before build handoff. (Those docs are not created yet — scheduled.)
- [ ] `11-star-experience.html` renders a visual ladder that the founder can inspect. (Created this turn; founder review pending.)

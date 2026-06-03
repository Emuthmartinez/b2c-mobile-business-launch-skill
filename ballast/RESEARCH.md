# Ballast — Research & Evidence Ledger

Status: **partial** (Phase 1). This captures the social-language and problem evidence gathered at kickoff. It does **not** yet contain category economics (AppKittie), competitor deep dives, keyword difficulty, or name-collision results — those are the next research tasks before the spec is treated as evidence-backed.

## Problem Thesis

New and recent homeowners are repeatedly blindsided by the cost of major systems and appliances failing (HVAC, water heater, roof, garage door, plumbing). The dominant emotion is **unbounded dread**: they know "something will break" but have no defensible figure for how much cash to keep on hand, so they either ignore it and get blindsided, or worry chronically. Ballast converts that dread into one number (a recommended reserve as a % of total replacement value) plus a plan for what fails first and what to keep on hand.

## Evidence (social language)

Source: public Reddit posts and comments, retrieved 2026-06-03 via social search across r/personalfinance, r/homeowners, r/HomeImprovement, r/RealEstate, r/AskReddit, r/Fire, r/MoneyDiariesACTIVE. These are **qualitative signals of language and intensity**, not statistics. Quotes are lightly trimmed.

### Signal 1 — The surprise is a named, recurring genre

- Post: *"New Homeowners: Expect (High) Unanticipated Repair Costs for the First Two Years"* (r/homeowners).
- Post: *"What surprised you most about owning a home (maintenance-wise)?"* — author opens *"Been in plumbing/HVAC about 12 years, and I swear the biggest shock for [new owners is]…"* (the trade pro frames age-based replacement as the core shock).
- Post: *"What do you regret buying (so soon) as a new homeowner?"*
- Takeaway: "unexpected homeowner repair cost" is an established, searchable conversation — not a niche worry. **Ballast's wedge is pre-validated as a felt problem.**

### Signal 2 — Homeowners already reach for a "% of value per year" rule of thumb

Repeatedly, commenters cite a maintenance-reserve heuristic — and disagree on the exact number, which is the gap Ballast fills with a *personalized* figure:

- *"everyone told me to budget like 1-2% of home value annually for maintenance."* (r/homeowners)
- *"you also need to set aside around 2–4% of the home value every year for maintenance and repairs. On a $500k house that is another $10k–20k per year… Because yes something will break. Will it be the water heater, hvac, plumbing, roof, oven, window, dishwasher[?]"* (r/AskReddit)
- *"need to earn a little more to be able to set aside 1% of my house's value each year for maintenance."* (r/MoneyDiariesACTIVE)
- *"a Repair/Maintenance Fund, which is supposed to be 1 percent annually of the total value of your property."* (r/Fire)
- Takeaway: the **% -of-value mental model already exists** but is (a) generic, (b) about the *house*, not the *appliances*, and (c) a guess. Ballast reframes it around the user's actual inventory and ages — and notably, the homeowner pain is about **replacement of specific items**, which argues for Ballast anchoring on replacement value of inventoried systems rather than whole-home value. (Open question to resolve in spec: which denominator converts best — see EXP-002.)

### Signal 3 — The dread is specific and emotional

- *"Having that much leftover monthly cash flow gives you good cushion for unexpected stuff too. AC units love to die in summer when you least expect it, trust me on that one."* (r/homeowners)
- *"hope nothing major like a roof needs to be repaired, there's a job loss, or interest rates spike."* (r/CanadaPersonalFinance)
- *"Be prepared to spend more than you thought on home maintenance. Washing your dishes in the outside garden hose while you save for a plumber is a humbling experience."* (r/homeowners)
- *"what's to prevent the county from busting the water main and saying it's your problem and now you have to come up with $3k for the fix? (A real story… and it's actually happened twice…)"* (r/financialindependence)
- Takeaway: the emotional north star ("the unexpected becomes expected and handled") is the right one; copy should mirror this lived, slightly weary voice — **calm reassurance, not fear-selling.** This supports the founder's no-alarmism, no-gamification constraint.

### Signal 4 — Adjacent behaviors that hint at willingness-to-pay & retention

- Heavy use of **sinking funds** / per-category savings buckets (*"Everything else has been allocated to various sinking funds: $800 for car maintenance…"*) — users already manually do a worse version of Ballast.
- Skepticism of **home warranties** (*"Home warranty's are a waste of money"*) — there's an under-served middle between "ignore it" and "buy a warranty"; Ballast is the self-insurance planning layer.
- Garage-door spring, HVAC at ~15 years, roof at ~9–10 years recur as concrete trigger items — good candidates for the "what breaks first" reference table.

## Implications for the product

1. Lead with the **felt surprise**, then resolve it with one number — confirms the 11-star thesis (`11_STAR_EXPERIENCE.md`, EXP-001).
2. Anchor the reserve on **% of replacement value of inventoried items**, echoing the rule of thumb people already cite but making it personal (EXP-002). Validate the denominator choice in `SPEC.md`.
3. The **age-based "what breaks first"** ordering is what a 12-year HVAC pro intuitively does — a credible, differentiating V1 feature (EXP-003) and the Reserve+ hook.
4. Voice = calm, lived-in, non-alarmist. Banned: fear-selling, gamification, mascot (founder-locked; carry into `BRAND.md`).

## Category economics & competitor landscape

Source: public web search, retrieved 2026-06-03. Note: **AppKittie/XPOZ (the skill's paid category-economics tools) were not available in this runtime** — these figures come from vendor pricing pages and review roundups, not download/revenue estimators. See `TOOL_DECISIONS.md`. A proper AppKittie pass is still owed before pricing is locked.

### Pricing anchor (willingness to pay)

- **HomeZada** (home-management incumbent): Free *Essential*; **$99/yr** (or $15.95/mo) *Premium* (single property); **$189/yr** *Deluxe* (up to 3 properties). Source: HomeZada pricing page.
- Implication: home-management consumers already sustain **~$100/yr** subscriptions. A Ballast Reserve+ tier in roughly the **$40–$100/yr** band is defensible; exact pricing stays founder-gated (`REVENUE_OPS.md`).

### Competitor map & positioning gap

| Player | What it is | Gap vs. Ballast |
| --- | --- | --- |
| **HomeZada** | Comprehensive home management: inventory, maintenance reminders, project finances. Mature, broad. | Tracks *records and tasks*. Does **not** compute a recommended emergency-fund reserve or rank failure likelihood. Broad/heavy; Ballast is a focused financial-preparedness wedge. |
| **Centriq** | Photo-to-manual appliance identification, manuals, parts, recall alerts. | **Shut down January 2026** — tight export window, CSV without photos/docs, then data deleted. Left users burned on portability. **Opening:** a trustworthy successor for "know your appliances + what to do," with data-portability as an explicit promise. |
| **DomiDocs** | Bank-level secure document vault + home-title monitoring. | Security/vault + title fraud angle; not a reserve calculator. |
| **Dwellin / HomeBox / micasa / Shelf.nu** | Home inventory / maintenance / cost tracking, some sustainability tips. | Inventory/maintenance trackers; none frames the **"how much cash should I hold"** question. |
| **Home warranties** (e.g. Select Home Warranty) | Pay a premium; they cover some repairs. | Reddit signal: widely seen as "a waste of money." Ballast is the **self-insurance planning** layer between "ignore it" and "buy a warranty." |
| **Spreadsheets / sinking funds** | DIY per-category savings buckets. | Users already do a worse, manual version of Ballast (Signal 4). Direct evidence of the job-to-be-done. |

**Positioning gap (the wedge, restated):** every incumbent is an *inventory/maintenance/records* tool or a *warranty*. **None turns the inventory into a single recommended cash reserve + a what-breaks-first plan.** Ballast owns the "financial preparedness number," using inventory as the means, not the end. Centriq's shutdown is a timely trust-and-acquisition opening.

## Open research tasks (next)

- [ ] **AppKittie / XPOZ category economics** — real download/revenue/keyword-difficulty estimates (currently blocked: paid tools unavailable in this runtime; see `TOOL_DECISIONS.md`). Confirm pricing bands before `REVENUE_OPS.md`.
- [x] Competitor deep dives — done above (HomeZada, Centriq, DomiDocs, Dwellin/HomeBox, warranties, spreadsheets).
- [x] Category pricing anchor — done above (HomeZada tiers).
- [ ] Keyword popularity/difficulty scan; `LOCALIZATION_MARKET_RESEARCH.md` (likely US-first given the % -of-value norms vary by market).
- [~] Name-collision scan — first pass done in `NAMING.md` (Ballast has an App Store finance namesake; Backstop/Holdfast cleaner). Founder selection + USPTO/domain clearance still owed; `ballast-name-unverified` stays open.
- [ ] Quantify replacement-cost & lifespan reference tables per appliance category from a citable source (not memory).

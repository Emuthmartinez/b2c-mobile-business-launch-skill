# Ethics And Dark-Pattern Guardrail

Use this before designing, implementing, or shipping any emotionally persuasive mechanism —
Commitment Cards, Variable Reward Cards, Perceived Effort Delay Cards, Intent Mirroring Cards,
streaks, social proof, scarcity/urgency, ratings prompts, or any onboarding/paywall sequence
that targets the user's emotional state.

This reference is both policy and machine-checkable contract. Every applied Experience Card
must satisfy the Guardrail Contract in section 5. The validator (`check:emotional-design`)
enforces the required section phrases and per-card attestation fields in artifact docs.

Cross-references (do NOT duplicate; integrate):
- `references/eleven-star-experience.md` — star-ladder mapping required for every finding
- `references/analytics-attribution.md` — every emotional moment must emit a named PostHog event
- `references/onboarding-conversion.md` — paywall timing, App Review popup placement, consent
- `references/failure-cards.md` — dark-pattern violations become failure cards
- `references/design-room.md` / `references/design-visual-system.md` — motion fallbacks required

## Contents

- 1. Bright-Line Vs Dark-Line Distinction
- 2. Regulatory And Platform Landscape
- 3. Per-Mechanism Risk Table
- 4. Children And Vulnerable Populations
- 5. Guardrail Contract
- 6. Failure Cards
- 7. Acceptance Checklist

---

## 1. Bright-Line Vs Dark-Line Distinction

The four required Experience Cards — Commitment, Variable Reward, Perceived Effort Delay, and
Intent Mirroring — rely on mechanisms that have a known dual-use character. Each can serve the
user's genuine goal or extract value against the user's interest. This section names the line.

### Definitional Basis

**Genuine resonance (bright-line)**: the mechanism makes the user more likely to achieve the
goal they came to the app to achieve. The signal, reward, or pause is truthful, the benefit
accrues to the user, and the user could describe what happened and feel good about it in
retrospect. Source basis: Fogg Behavior Model — behavior as a function of Motivation,
Ability, and Prompt (B=MAP); mechanisms that raise M and A toward a user-owned goal are
prosocial. BJ Fogg, *Tiny Habits*, 2019.

**Extraction / compulsion (dark-line)**: the mechanism makes the user do something that
primarily benefits the product at the user's expense — spending money they did not intend to,
continuing a session when they want to stop, consenting without understanding, or believing
something that is not true. Source basis: the FTC defines "dark patterns" as design practices
that trick or manipulate consumers into choices they would not otherwise make; EU Digital
Services Act (DSA) Art. 25 prohibits "deceptive or manipulative techniques" that distort
autonomous decision-making.

### The Operational Test

Before shipping any emotionally persuasive mechanism, apply this three-question test. All
three must be YES for bright-line classification:

1. **Goal alignment**: does the mechanism help the user move toward the goal they stated or
   implied when they opened the app? (If unclear, check the Intent Mirroring Card — did you
   pause to confirm the goal first?)
2. **Truthfulness**: is every claim, number, progress signal, scarcity signal, social-proof
   signal, and effort-display true and verifiable at the time it is shown?
3. **Informed exit**: can the user stop, dismiss, pause, or undo without penalty and without
   the app making it harder than starting? (EU Consumer Rights Directive Art. 9 requires
   cancellation to be as easy as subscription.)

If any answer is NO, the mechanism is dark-line and must be redesigned or removed. A
validator attestation field must record the test result for each applied card.

### Card-By-Card Bright/Dark Examples

**Commitment Card** (basis: Robert Cialdini, *Influence*, 1984 — commitment/consistency
principle; foot-in-the-door technique)
- Bright: user sets a goal in plain language; app reflects it back at key moments; user feels
  ownership of their own stated intent.
- Dark: app locks the user's stated goal to prevent cancellation ("you said you'd do this
  every day — are you sure you want to quit?"); confirmshaming exit copy; phantom opt-in that
  pre-ticks a paid tier.

**Variable Reward Card** (basis: B.F. Skinner, operant conditioning, variable-ratio
reinforcement schedules; Wolfram Schultz, dopamine reward-prediction-error — reward signal
fires on anticipation, not receipt, *Neuron*, 1997; Nir Eyal, *Hooked*, 2014 — Hook Model
rewards of tribe/hunt/self)
- Bright: unpredictable positive feedback varies the emotional quality of app interactions,
  keeping the user curious and engaged with their own progress. The user can always see what
  they are working toward.
- Dark: infinite scroll designed to prevent stopping; loot-box spending mechanics targeting
  compulsive behavior; engineered near-miss signals. Belgium and Netherlands have classified
  loot boxes as gambling (attribution-uncertain: exact statutory cite; known enforcement
  precedent from 2018-2020). UK Gambling Commission has published guidance on loot-box risks.

**Perceived Effort Delay Card** (basis: Ryan Buell and Michael Norton, "Operational
Transparency," *Harvard Business Review*, 2011; *Management Science*, 2011 — the Labor
Illusion: users value results more when they observe effort being expended; Michael Norton,
Daniel Mochon, and Dan Ariely, IKEA Effect, *Journal of Consumer Psychology*, 2012 — effort
invested raises perceived value)
- Bright: show real work being done (actual computation, data fetch, personalization pass).
  The display is honest about what is happening. User's perceived value is higher because
  real effort was invested.
- Dark: fake loading spinners with no underlying computation; artificially inflated wait
  times to manufacture value perception; deceptive "analyzing your data" screens that show
  random personalization copied from a template.

**Intent Mirroring Card** (basis: Don Norman, *The Design of Everyday Things*, 1988 —
affordances and signifiers; Alan Cooper, goal-directed design; Rosalind Picard, *Affective
Computing*, 1997 — emotional feedback loops)
- Bright: a deliberate pause that mirrors the user's stated intent back to them before a
  consequential action. The pause is for the user's benefit — it confirms they are about to
  do what they meant to do.
- Dark: a "are you sure?" prompt engineered not to confirm intent but to add friction to
  cancellation or downgrade paths (router anti-pattern); confirmshaming copy ("No thanks, I
  prefer to stay bad at this").

---

## 2. Regulatory And Platform Landscape

Agents must not cross these lines. Attribute-uncertain items are flagged.

### FTC — United States

- FTC Act Section 5 prohibits unfair or deceptive acts in commerce.
- FTC "Bringing Dark Patterns to Light" (September 2022): enforcement staff report naming
  subscription traps, difficult cancellation, hidden fees, misleading urgency, and misleading
  social proof as enforcement targets.
- FTC "Click-to-Cancel" Rule (final rule, October 2024, 16 CFR Part 425): subscription
  cancellation must be as easy as sign-up; negative-option marketing requires clear, informed
  consent before charging.
- FTC Children's Online Privacy Protection Act (COPPA, 15 U.S.C. §§ 6501-6506) and
  implementing Rule (16 CFR Part 312): verifiable parental consent before collecting
  personal data from children under 13; no behavioral advertising to under-13 users.

### EU — European Union

- Digital Services Act (DSA, Regulation (EU) 2022/2065), Art. 25: very large online
  platforms and online search engines must not use "dark patterns" — interface designs that
  "deceive, manipulate or otherwise impair or impair the ability of recipients of the service
  to make free and informed decisions." Mobile apps with significant EU reach should treat
  Art. 25 as the operational standard even when not formally a VLOP.
- Digital Markets Act (DMA, Regulation (EU) 2022/1925), Art. 13: gatekeepers must not use
  dark patterns in consent management for tracking or advertising.
- EU Consumer Rights Directive (CRD, Directive 2011/83/EU as amended): right of withdrawal
  (14 days for digital purchases), cancellation must be as easy as subscription (Art. 9,
  enforced from 2022 via national implementing law).
- GDPR (Regulation (EU) 2016/679): consent for data processing must be freely given,
  specific, informed, and unambiguous — pre-ticked boxes, consent bundled with ToS
  acceptance, and dark-pattern cookie banners are illegal (EDPB Guidelines 05/2020 on
  consent).
- EU Omnibus Directive (Directive (EU) 2019/2161), amending CRD and other directives:
  fake reviews, misleading personalized pricing not disclosed as personalized, false scarcity
  claims are unfair commercial practices.

### Apple App Store

- App Review Guidelines §2.3 (Accurate Metadata): screenshots, copy, and previews must
  not mislead users. Fake social proof, inflated download counts, and fabricated review
  excerpts are grounds for rejection.
- App Review Guidelines §3.2.2(b): apps must not manipulate users into purchasing
  subscriptions or in-app purchases through confusing or deceptive pricing presentation.
- App Review Guidelines §4.0 (Design): apps that create false urgency, exploit emotions
  (including grief, fear, or loneliness), use addictive or compulsive mechanics to extract
  money, or employ other manipulative patterns will be rejected.
- App Review Guidelines §5.1.1 (Data Collection and Storage): permission requests must
  clearly state the purpose; apps must not access permissions beyond stated purpose.
- App Review Guidelines §5.1.2 and §3.2.1: rating/review prompts must use the native
  StoreKit API only; must not solicit only positive reviews; must not interrupt users mid-
  task. Maximum three prompts per 365-day period.
- Apple Human Interface Guidelines on Ratings and Reviews (attribution-uncertain: exact
  HIG version; stable guideline): prompt only after demonstrated value.

### Google Play

- Google Play Developer Policy — Deceptive Behavior: prohibits false information, deceptive
  ads, fake social proof, and misleading subscription presentations.
- Google Play Billing Policy: subscription cancellation flow must not use dark patterns;
  downgrade or cancellation paths must be as accessible as upgrade paths.
- Google Play Families Policy: additional restrictions for apps that target children — no
  behavioral advertising, no social pressure mechanics, no loot boxes.

### Children And Teens — Additional Duty

See section 4 for the full children/teen guardrail.

---

## 3. Per-Mechanism Risk Table

For each mechanism, the risk tier is based on enforcement history and regulatory attention.
Required attestation fields are listed — these are enforced by the validator.

| Mechanism | Risk Tier | Primary Risk | Bright-Line Test | Required Attestation Fields |
|---|---|---|---|---|
| Variable Reward | HIGH | Compulsion loop, gambling-adjacent | User can always stop; no near-miss engineering; no spend compulsion | `bright_line`, `dark_line`, `guardrail`, `user_control_escape_hatch`, `ethics_attestation` |
| Streak / Loss Aversion | HIGH | Coercive retention; grief/fear exploitation | Streak break is recoverable; no punitive streak-loss spend gates | `bright_line`, `dark_line`, `guardrail`, `user_control_escape_hatch`, `ethics_attestation` |
| Scarcity / Urgency | HIGH | Fake scarcity; countdown clock manipulation | Scarcity is real and enforced; countdown reflects actual offer end | `bright_line`, `dark_line`, `guardrail`, `scarcity_enforcement_proof`, `ethics_attestation` |
| Social Proof | HIGH | Fabricated counts; review solicitation manipulation | Every count is real; no soliciting only positive reviews | `bright_line`, `dark_line`, `guardrail`, `social_proof_truthfulness_proof`, `ethics_attestation` |
| Commitment Card | MEDIUM | Confirmshaming; phantom opt-in; cancellation friction | Exit path is frictionless; commitment is user-owned, not app-owned | `bright_line`, `dark_line`, `guardrail` |
| Perceived Effort Delay | MEDIUM | Fake labor illusion; deceptive spinner | Display reflects real computation or real personalization work | `bright_line`, `dark_line`, `guardrail`, `effort_truthfulness_attestation` |
| Intent Mirroring | LOW-MEDIUM | Cancellation friction disguised as confirmation | Pause serves the user's interest, not the app's retention metric | `bright_line`, `dark_line`, `guardrail` |
| Rating Prompt | MEDIUM | Platform policy violation; coercive placement | Native API only; post-value; not mid-task; max 3/year | `bright_line`, `dark_line`, `guardrail`, `platform_api_used` |
| Endowed Progress | LOW | Manufactured progress on fake tasks | Starting progress reflects real user investment | `bright_line`, `dark_line`, `guardrail` |
| Goal Gradient | LOW | False urgency on manufactured milestones | Milestones reflect real user goals | `bright_line`, `dark_line`, `guardrail` |

Basis for risk tiers: FTC 2022 dark-patterns report; DSA Art. 25; Apple §4.0 and §3.2.2(b);
Kahneman and Tversky, prospect theory / loss aversion (*Econometrica*, 1979); Thaler,
endowment effect (attribution-uncertain: primary cite; well-established); Hull, goal-gradient
(attribution-uncertain: primary cite); Kivetz, Urminsky, and Zheng, endowed progress effect,
*Journal of Marketing Research*, 2006.

---

## 4. Children And Vulnerable Populations

Apply additional scrutiny when the app may be used by, or marketed toward, children or teens.

### COPPA (US — under 13)

- Do not collect personal data from users under 13 without verifiable parental consent.
- Do not use behavioral advertising targeting under-13 users.
- Do not use social pressure mechanics (leaderboards, peer comparison, public shame) with
  under-13 users.
- Age-gate must be meaningful, not a single-field birth-year honesty check with no
  enforcement.

### UK Age-Appropriate Design Code (Children's Code, ICO, 2021)

- "Best interests of the child" standard overrides commercial interest.
- Nudge techniques that encourage children to provide more data or weaken privacy settings
  are prohibited.
- Profiling for behavioral advertising is off by default for users the service knows or
  should know are under 18.
- High privacy by default for all users who may be under 18.
- (attribution-uncertain: exact statutory provision number; published code is publicly
  available from ICO.)

### General Vulnerable-Population Duty

- Do not target emotionally exhausted states (grief, loneliness, health anxiety) with
  spend prompts.
- Do not use the dopamine anticipation window (Wolfram Schultz, 1997) to time spend prompts
  immediately after a streak-progress display. This combination is the highest-risk pattern
  in subscription fitness and habit apps.
- Apple §4.0 names "exploit emotions (including grief, fear, or loneliness)" as a rejection
  criterion.

---

## 5. Guardrail Contract

This section defines the machine-checkable contract. Every artifact that declares an applied
Experience Card (Commitment, Variable Reward, Perceived Effort Delay, Intent Mirroring) or
any mechanism in the risk table must satisfy all fields in this contract.

### Required Card Attestation Block

Every applied card must include an attestation block in the artifact doc
(`ONBOARDING.md`, `11_STAR_EXPERIENCE.md`, `SPEC.md`, or a dedicated `ETHICS.md`).
The validator checks for these stable phrase keys.

```yaml
# Example attestation block — paste and fill for each applied card
experience_card:
  id: "variable-reward-card"                   # stable id, one per card instance
  mechanism: "variable_reward"                  # must match mechanism column in risk table
  applied_to: "post-session result reveal"      # screen/moment where the card fires
  star_level: "7"                               # 11-star ladder level this elevates
  posthog_event: "variable_reward_triggered"    # named PostHog event (from ANALYTICS.md)
  bright_line: >
    The result reveal varies in quality and surprise to keep the user curious about
    their own progress. The user always knows what metric they are working toward.
  dark_line: >
    Would cross into dark territory if: near-miss engineering were used; if the reward
    pulse were timed to a spend prompt; if the variability were designed to prevent
    the user from stopping rather than to celebrate progress.
  guardrail: >
    No near-miss mechanics. Reward fires on real data. No spend prompt within the
    same screen or 30s after the reward reveal. Prefers-reduced-motion fallback present.
  user_control_escape_hatch: >
    User can disable animated results in Settings > Accessibility. Plain text summary
    always available.
  ethics_attestation: >
    This card serves the user's stated goal of improving at [domain]. The three-question
    operational test: (1) goal alignment YES, (2) truthfulness YES, (3) informed exit YES.
    Bright-line classification: confirmed.
  effort_truthfulness_attestation: ""            # fill if mechanism is perceived_effort_delay
  scarcity_enforcement_proof: ""                 # fill if mechanism is scarcity/urgency
  social_proof_truthfulness_proof: ""            # fill if mechanism is social_proof
  platform_api_used: ""                          # fill if mechanism is rating_prompt
```

### Validator-Enforced Rules

The `check:emotional-design` script enforces the following. Any violation is an `error`
unless marked as `warning`.

| Rule ID | Level | Description |
|---|---|---|
| `ethics.card_missing_bright_line` | error | Applied card block is present but `bright_line` field is empty or absent |
| `ethics.card_missing_dark_line` | error | Applied card block is present but `dark_line` field is empty or absent |
| `ethics.card_missing_guardrail` | error | Applied card block is present but `guardrail` field is empty or absent |
| `ethics.high_risk_missing_ethics_attestation` | error | HIGH-tier mechanism card (variable_reward, streak, scarcity, social_proof) lacks `ethics_attestation` field |
| `ethics.high_risk_missing_escape_hatch` | error | HIGH-tier variable_reward or streak card lacks `user_control_escape_hatch` field |
| `ethics.scarcity_missing_enforcement_proof` | error | Scarcity/urgency card lacks `scarcity_enforcement_proof` field |
| `ethics.social_proof_missing_truthfulness_proof` | error | Social proof card lacks `social_proof_truthfulness_proof` field |
| `ethics.effort_display_missing_truthfulness_attestation` | error | Perceived effort delay card lacks `effort_truthfulness_attestation` field |
| `ethics.rating_prompt_missing_platform_api` | error | Rating prompt card lacks `platform_api_used` field |
| `ethics.fake_scarcity_phrase` | error | Artifact text contains `limited spots`, `only X left`, `selling out`, or similar countdown language without a corresponding `scarcity_enforcement_proof` in a card block |
| `ethics.fake_social_proof_phrase` | error | Artifact text contains `thousands of users`, `millions of people`, `join X users` without a `social_proof_truthfulness_proof` card block |
| `ethics.confirmshaming_phrase` | error | Artifact text contains confirmshaming patterns: `No thanks, I prefer`, `No, I don't want`, `I'll stay bad at` or equivalent self-deprecating opt-out labels |
| `ethics.children_tracking_unreviewed` | warning | App targets under-18 audience (per `business.json` `audience.age_range`) and no COPPA/Children's Code review is noted in `ETHICS.md` or `PRIVACY.md` |
| `ethics.spend_prompt_after_reward` | warning | An artifact documents a spend prompt (paywall, IAP, upgrade) on the same screen or within a single user flow step as a variable reward reveal — highest-risk pattern |
| `ethics.reduced_motion_missing` | error | A motion-bearing delight moment is specified in a card but no prefers-reduced-motion or OS reduce-motion fallback is declared |
| `ethics.no_ethics_doc` | warning | Experience card blocks are present in artifacts but no `ETHICS.md` or `ETHICS_ATTESTATION.md` exists in the project root |
| `ethics.card_posthog_event_missing` | error | Applied card block specifies `applied_to` but `posthog_event` is empty — every emotional moment must be measurable |

### Non-Negotiable Prohibitions (Automatic Compliance Veto)

The following patterns are unconditional blocks. No founder approval overrides them. If found
in a live artifact, the engineering lane is blocked until removed.

1. **Fake scarcity**: countdown timers, "X spots left", or "offer expires" claims that reset
   on reload or are not enforced by real inventory or time-based backend logic.
2. **Fake social proof**: fabricated user counts, invented testimonials, stock-photo
   attributed reviews, or review excerpts not sourced from real App Store / Play reviews.
3. **Fake effort**: loading spinners or "analyzing your data" displays where no real
   computation or personalization is occurring.
4. **Spend prompts inside streak-break grief screens**: any IAP/paywall prompt displayed on
   the same screen as a streak-loss notification.
5. **Confirmshaming exit copy**: opt-out labels written in first-person self-deprecation
   designed to make the user feel bad for declining.
6. **Ratings solicitation outside native API**: any custom "rate us" prompt that routes to
   the App Store only for positive responses, or any prompt that violates the platform's
   three-per-year cap.
7. **Pre-ticked subscription boxes**: any UI where a paid tier or auto-renewing subscription
   is selected by default without affirmative user action.
8. **Hidden subscription terms**: any paywall or checkout screen where price, renewal
   cadence, trial terms, or cancellation instructions are not visible before confirmation tap.

---

## 6. Failure Cards

Dark-pattern violations become failure cards using the shape in `failure-cards.md`. Default
cards for the most common violations are provided here.

```yaml
id: "ethics-fake-scarcity"
severity: "critical"
owner: "product-lead"
status: "open"
evidence:
  - "ONBOARDING.md or SPEC.md — section containing the claim"
impact: >
  Fake scarcity claims violate FTC Click-to-Cancel/deceptive-design enforcement,
  EU Omnibus Directive unfair commercial practices, and Apple §2.3 Accurate Metadata.
  App Store rejection and FTC investigation risk.
next_action: >
  Remove the claim or add real backend enforcement (actual inventory limit or
  true time-limited pricing with a `scarcity_enforcement_proof` card block).
  Run `npm run check:emotional-design -- --root .` after fix.
validator: "npm run check:emotional-design -- --root ."
```

```yaml
id: "ethics-confirmshaming"
severity: "high"
owner: "product-lead"
status: "open"
evidence:
  - "ONBOARDING.md — opt-out copy"
impact: >
  Confirmshaming is a named dark pattern under EU DSA Art. 25 and FTC deceptive-design
  enforcement. Apple §4.0 (manipulative patterns) is grounds for rejection.
next_action: >
  Replace opt-out label with a neutral, non-self-deprecating alternative.
  Run `npm run check:emotional-design -- --root .` after fix.
validator: "npm run check:emotional-design -- --root ."
```

```yaml
id: "ethics-spend-prompt-in-grief-screen"
severity: "critical"
owner: "engineering-lead"
status: "open"
evidence:
  - "ONBOARDING.md or SPEC.md — streak-break screen spec"
impact: >
  Combining loss-aversion grief with a spend prompt is the highest-risk dark pattern in
  habit/fitness apps. Violates Apple §4.0 (exploit emotions). FTC enforcement target.
next_action: >
  Move any IAP/paywall prompt to a separate screen, minimum one user interaction after
  the streak-break notification resolves. Add `ethics_attestation` to the Variable Reward
  and Streak cards documenting the separation.
validator: "npm run check:emotional-design -- --root ."
```

```yaml
id: "ethics-variable-reward-missing-escape-hatch"
severity: "high"
owner: "engineering-lead"
status: "open"
evidence:
  - "Experience card block — missing user_control_escape_hatch"
impact: >
  Variable reward without a user-accessible off-switch creates compulsion risk.
  Required by Guardrail Contract for HIGH-tier cards.
next_action: >
  Add Settings > Accessibility toggle to disable animated reward reveals.
  Declare the escape hatch in the card block `user_control_escape_hatch` field.
  Run `npm run check:emotional-design -- --root .`.
validator: "npm run check:emotional-design -- --root ."
```

---

## 7. Acceptance Checklist

Before any emotionally persuasive mechanism ships:

- [ ] Every applied Experience Card has a complete attestation block with `bright_line`,
      `dark_line`, and `guardrail` fields.
- [ ] HIGH-tier cards (variable_reward, streak, scarcity, social_proof) have `ethics_attestation`
      and `user_control_escape_hatch` filled.
- [ ] Scarcity/urgency cards have `scarcity_enforcement_proof` — real inventory or real
      time-bound backend logic confirmed.
- [ ] Social proof cards have `social_proof_truthfulness_proof` — every count sourced and
      verifiable.
- [ ] Perceived effort delay cards have `effort_truthfulness_attestation` — real computation
      confirmed.
- [ ] Rating prompt cards have `platform_api_used` — native StoreKit or Play In-App Review
      API only.
- [ ] Three-question operational test (goal alignment, truthfulness, informed exit) is
      answered YES for every applied card.
- [ ] No confirmshaming copy in any opt-out label.
- [ ] No fake scarcity phrases without backend enforcement.
- [ ] No spend prompt on the same screen as a streak-loss or variable-reward reveal.
- [ ] Every emotional moment emits a named PostHog event from `ANALYTICS.md`.
- [ ] Every motion-bearing delight moment has a prefers-reduced-motion / OS reduce-motion
      fallback declared.
- [ ] App targets under-18 audience: COPPA and UK Children's Code review noted in `ETHICS.md`
      or `PRIVACY.md`.
- [ ] `npm run check:emotional-design -- --root .` passes with zero errors.

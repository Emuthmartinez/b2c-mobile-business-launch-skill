# Experience Cards

Use this when designing, auditing, or implementing emotionally charged moments in a B2C mobile
app. These cards are the canonical deck for the b2c-mobile-business-launch skill. Each card
names a psychological mechanism, draws a bright/dark line, and gives you a deterministic
checklist for audit and ship.

**Pre-requisites.** Load these references before applying any card; do not duplicate their
content here:
- `references/eleven-star-experience.md` — star-ladder; every card maps to a level
- `references/quality-lens.md` — emotional job, not a generic SaaS wrapper
- `references/onboarding-conversion.md` — paywall timing, App Review popup, consent
- `references/analytics-attribution.md` — every emotional moment needs a named PostHog event
- `references/design-room.md` / `references/design-visual-system.md` — motion tokens and
  reduced-motion rules; every delight animation needs an OS-level fallback
- `references/failure-cards.md` — dark-pattern violations become failure cards
- `references/ethics-guardrail.md` — Guardrail Contract, regulatory landscape, risk table

---

## Card Shape

Every card in this deck uses the same field set. Audit tools and validators check for these
stable headers.

| Field | Meaning |
|---|---|
| **One-liner** | Single-sentence description of what the card does |
| **Emotional beat** | The precise feeling the card engineers, in the user's voice |
| **Psychology + canonical research** | Mechanism explanation with named sources; `attribution-uncertain` flags where replication is partial |
| **Mechanism steps** | Numbered implementation sequence |
| **Real app examples** | Named apps, named moments, why it works |
| **When to use / When NOT to use** | Trigger conditions and explicit exclusions |
| **Producer recipe** | Step-by-step instructions for applying the card to a feature |
| **Auditor signals — Present / Missing / Misused** | Three-bucket checklist for review |
| **Measurement events** | Named PostHog events, required properties, what each proves |
| **Mobile implementation + reduced-motion** | Platform-specific code notes; OS reduce-motion fallback is mandatory |
| **Bright line / Dark line / Guardrail** | Ethics contract; deterministic ship-gate |
| **Pairs with** | Other cards or references this card composes with |
| **11-star level** | Star-ladder position from `eleven-star-experience.md` |

---

## Summary Table

| Card | Emotional beat | Primary research | 11-star level | Dark-line to refuse |
|---|---|---|---|---|
| Commitment | Ownership — "I said this matters to me" | Cialdini 1984; Locke & Latham 1990; Gollwitzer 1999 | 6–7 | Commitment used to manufacture guilt at paywall |
| Variable Reward | Anticipation-then-surprise — "I wonder what I'll get" | Skinner 1938; Schultz 1997; Berridge 1996 | 6–7 | Spend prompt on the same screen as the reveal |
| Perceived Effort Delay | Anticipatory trust — "It's working hard for me" | Buell & Norton 2011; Norton, Mochon & Ariely 2012 | 6–7 | Artificial sleep timer with no real computation |
| Intent Mirroring | Being seen — "This product understands what I want" | Norman 2004; Gollwitzer 1999; Cialdini 1984 | 7 | Mirror on cancel/unsubscribe flow as retention friction |
| Endowed Progress | Momentum — "I'm already partway there" | Kivetz, Urminsky & Zheng 2006; Hull 1932 | 6–7 | Phantom credits with no real product operation |
| Peak-End | Elation-then-completeness | Kahneman & Fredrickson 1993; Norman 2004 | 6–7 | Manufactured ranking on day one |
| Streak & Loss Aversion | Protective urgency — "I can't let this die" | Kahneman & Tversky 1979; Thaler 1980; Hull 1932 | 5–7 | Paid-only forgiveness with no free grace period |
| Reciprocity | Surprised gratitude — "They gave me something I didn't ask for" | Cialdini 1984; Eyal 2014; Fogg 2019 | 6–7 | Gift withholds real value behind paywall |
| Identity & Self-Expression | Ownership-pride — "This is mine; it reflects who I am" | Norman 2004; Cialdini 1984; Norton, Mochon & Ariely 2012 | 7 | Identity anchor held hostage on subscription lapse |
| Fresh Start | Clean-slate optimism — "This is a new chapter" | Dai, Milkman & Riis 2014; Gollwitzer 1999 | 6–7 | Temporal-landmark frame leads directly to paywall |
| Mastery & Status | Earned pride — "I've become someone who is good at this" | Locke & Latham 1990; Eyal 2014; Deci & Ryan 1985 | 6–7 | Level-up reveal coupled with paywall CTA same screen |
| Recovery & Trust Repair | Relieved loyalty — "They handled that quickly and fairly" | Kahneman & Fredrickson 1993; Norman 2004; Buell & Norton 2011 | 5–7 | Spend prompt inside failure/grief screen |

---

## Ethics Ladder

**Variable Reward, Streak / Loss Aversion, Scarcity / Urgency, and Social Proof** are
HIGH-risk mechanisms per the risk table in `references/ethics-guardrail.md`. Before any of
these cards ships, the artifact doc (`ONBOARDING.md`, `SPEC.md`, or `ETHICS.md`) must contain
an experience-card attestation block with all five HIGH-tier fields filled:

```yaml
experience_card:
  id: "<card-slug>"
  mechanism: "<mechanism name>"
  applied_to: "<screen or feature name>"
  star_level: <int>
  posthog_event: "<primary event name>"
  bright_line: "<one sentence>"
  dark_line: "<one sentence>"
  guardrail: "<one sentence>"
  user_control_escape_hatch: "<where the user can disable or opt out>"
  ethics_attestation: "<reviewer name and date>"
```

Run `npm run check:emotional-design -- --root .` before marking any HIGH-risk card
launch-ready. The validator enforces that no required field is empty and that no
`spend_prompt_after_reward` pattern appears in the same screen scope.

All other cards require the four MEDIUM-tier fields: `bright_line`, `dark_line`, `guardrail`,
and (for Perceived Effort Delay) `effort_truthfulness_attestation`.

---

## Commitment Card

**One-liner.** Elicit one small, voluntary choice early in onboarding — then echo it
throughout the product — so users feel ownership over their goal rather than obligation to an
app.

**Emotional beat.** Ownership — "I said this matters to me; I should follow through."

### Psychology + Canonical Research

The consistency drive is one of the most stable forces in human motivation. Robert Cialdini's
_Influence_ (1984) identifies commitment and consistency as the second principle of influence:
once a person has actively committed to a position, they experience psychological pressure to
behave consistently — not because someone is watching, but because identity coherence is
intrinsically rewarding. The key amplifiers are: the commitment was active (chosen, not
passaged), written or stated, and voluntary (coerced commitments produce backlash, not
consistency). The foot-in-the-door technique (Freedman & Fraser, 1966, _Journal of Personality
and Social Psychology_) demonstrates that a small initial commitment dramatically increases
compliance with later, larger requests — mapping directly to the onboarding-to-subscription
conversion arc.

Goal-setting theory (Locke & Latham, 1990) adds the specificity dimension: vague intentions
produce far less behavioral change than specific, challenging goals. The commitment step
converts a vague user hope into a bounded goal the product can reflect back.
Implementation intentions (Gollwitzer, 1999, _American Psychologist_) complete the mechanism:
when a user specifies an if-then plan — "When I open the app in the morning, I will log my
first meal" — follow-through rates approximately double. BJ Fogg's Behavior Model (B=MAP,
_Tiny Habits_, 2019) adds the motivational amplification lens: a user who has declared intent
is already in a higher motivation state; the product's job is to match it with low friction
and well-timed prompts.

| Source | Finding | Confidence |
|---|---|---|
| Cialdini, _Influence_ (1984) Ch. 3 | Commitment and consistency: active, public, voluntary commitments create internal pressure to behave consistently; foot-in-the-door compounds the effect. | solid |
| Locke & Latham, _A Theory of Goal Setting_ (1990) | Specific, difficult goals produce significantly higher performance than vague intentions. | solid |
| Gollwitzer, _American Psychologist_ (1999) | If-then implementation intentions approximately double follow-through vs. goal statements alone. | solid |
| Fogg, _Tiny Habits_ (2019) — B=MAP | Declared intent raises baseline motivation; matched with high ability and a well-timed prompt, behavior is far more likely. | solid |
| Freedman & Fraser, _JPSP_ (1966) | Small, active, voluntary initial commitment makes subsequent larger compliance significantly more likely. | solid |
| Norman, _Emotional Design_ (2004) | Reflective design — products that help users reflect on their own values and goals — produces the strongest and most durable emotional engagement. | solid |

### Mechanism Steps

1. Surface a single, low-stakes, voluntary choice early in onboarding — a goal statement, a
   target, a schedule, or a preference — framed as the user's own decision, not a required
   form field.
2. Confirm the commitment with a quiet visual acknowledgment (~150 ms), not a
   congratulations. The acknowledgment should feel like the product heard the user.
3. Persist `commitment_type` and `commitment_value` to the user profile and PostHog person
   properties. This is the data backbone for every downstream echo.
4. Echo the commitment throughout the product: plan summary screens use the user's exact
   words, push notification copy references the stated goal, coach or guide responses invoke
   it, milestone headers reflect it, and paywall framing positions the subscription as
   unlocking the user's declared intent.
5. Prompt the user to specify when and where they will act: "When do you usually have 10
   minutes for yourself?" converts a goal into a trigger-anchored habit plan
   (Gollwitzer implementation intention).
6. Surface the commitment echo at session starts, at natural friction points, and at milestone
   moments.

### Real App Examples

**Duolingo.** Day 1 onboarding — user selects a daily goal (5–20 min/day) and immediately
sees a streak calendar initialized around that choice. Every session opens with that goal
visually present. Notifications say "You're just [X] minutes away from your goal today." The
choice is active, voluntary, and immediately reflected in the product's core metric. Cialdini
consistency pressure fires every time the user sees the streak counter under their stated goal.

**Noom.** A 10–15 question onboarding quiz culminating in a "Your plan is ready" screen that
reflects the user's exact answers — current weight, target weight, timeline, biggest obstacle
— back as a personalized plan with a projected date. The paywall immediately follows. The quiz
creates a series of small, active commitments that compound into one large one. By the time the
paywall appears, the user has made 10+ small voluntary choices. This is Gollwitzer's
implementation intention made visual.

**Headspace.** Onboarding asks the user to select their reason for meditating (Stress, Sleep,
Focus, Anxiety, Personal Growth) and set a daily reminder time. Both choices appear in the
home screen header — "Good morning, [Name]. Ready to work on [Focus] today?" — for the
duration of the subscription. The "reason" selection is a reflective-tier commitment; every
session that opens with the user's stated reason is an implementation intention reminder.

**Strava.** After adding a first activity, Strava prompts the user to set a weekly distance
goal. The goal appears as a progress ring on the home tab throughout the week, and the
week-end summary email uses the user's exact goal number as its anchor. The commitment
provides the reference point the goal-gradient effect requires.

### When to Use / When NOT to Use

**Use** when the app's value is tied to a user behavior change, habit, or goal pursuit:
fitness, language learning, finance, wellness, productivity, diet, creative practice, therapy.
Most effective in the first 3 screens of onboarding, before any friction or data-entry burden.

**Do NOT use** when: the product is a pure utility where goal-declaration would feel forced;
when the commitment cannot be echoed downstream (a commitment captured and never referenced is
worse than no commitment — it feels like the product ignored the user); or in distress/crisis
contexts where consistency pressure could become coercive.

### Producer Recipe

1. **Identify** the one commitment most predictive of long-term retention in your category. If
   the answer will never appear in another screen, do not collect it.
2. **Place** the commitment step after the value-promise screen, before any significant
   friction. Onboarding step 2–4 of typically 8–12.
3. **Frame** as the user's decision: "What are you here to do?" not "Set your goal."
4. **Add** an implementation intention prompt immediately after: "When do you usually have
   [X] minutes free?" + "Where will you typically be?"
5. **Confirm** with a minimal visual acknowledgment — a soft highlight, a 150 ms fade of the
   commitment value into the next screen's header. Not a celebration animation.
6. **Persist** `commitment_type` and `commitment_value` to user profile, PostHog person
   properties, and the push-notification personalization layer before onboarding completes.
   Emit `commitment_made` with all required properties.
7. **Echo** the commitment in: (a) personalized plan/summary screen immediately after
   onboarding, (b) home screen header or widget on every session, (c) push notification copy,
   (d) milestone celebration copy, (e) paywall framing. Each echo emits `commitment_echoed`
   with its surface.
8. **Verify editability:** the commitment must be modifiable from Settings or Profile without
   a support ticket. Test on device before marking this card complete.

### Auditor Signals

**Present**
- Onboarding contains at least one screen asking the user for a specific goal, target,
  frequency, or reason — not just demographic data
- The commitment value appears verbatim on the plan/summary screen immediately after the
  question
- Push notifications and lifecycle emails reference the user's stated goal, not generic copy
- Home screen or persistent UI element shows the user's commitment and current progress
- The commitment is editable from a Settings or Profile screen (verify on device)
- `commitment_made` and `commitment_echoed` PostHog events appear in the activity view after
  onboarding completion
- The commitment step appears before the paywall, not after it

**Missing**
- Onboarding asks about goals but answers are never reflected back in any downstream screen
- Plan/summary screen uses generic category language instead of the user's specific answer
- Push notifications use the same copy for all users regardless of stated commitment
- `commitment_made` event absent from PostHog after onboarding
- No editable commitment field in Settings or Profile
- Commitment step is placed after the paywall

**Misused**
- Commitment step is framed as a mandatory form required to proceed — removes voluntariness
- Commitment value used to manufacture urgency or guilt in paywall copy ("You said this was
  important — don't let yourself down")
- Commitment elicited and then immediately ignored — never echoed
- Commitment used to imply fabricated social proof ("10,000 people with your goal started
  today")
- Multiple commitment questions stacked on the same screen — commitment fatigue
- Commitment editable only by contacting support — editability gating is a compliance
  violation

### Measurement Events

| Event | What it proves | Required properties |
|---|---|---|
| `commitment_made` | User actively selected a goal during onboarding | `commitment_type`, `commitment_value`, `flow_id`, `step_id`, `platform` |
| `commitment_echoed` | Product surfaced the commitment on a downstream screen or notification | `surface`, `commitment_type`, `commitment_value` |
| `commitment_edited` | User updated their stated commitment from Settings | `old_commitment_value`, `new_commitment_value`, `surface` |
| `onboarding_step_viewed` | Commitment step was reached and rendered | filter by `step_id` matching the commitment screen to measure drop-off |
| `return_session_started` | User returned | segment by `commitment_type` to measure D1/D7/D30 return rates |
| `core_action_completed` | User completed an action aligned with their commitment | segment by `commitment_type` to validate Gollwitzer mechanism |
| `paywall_viewed` | Reach paywall | segment by whether `commitment_made` fired before `paywall_viewed` |

### Mobile Implementation + Reduced-Motion

**Web (motion/react).** `import { motion } from "motion/react" }`. Use `whileTap` scale pulse
on selection tile (scale 0.97 → 1.0, duration: `--motion-fast` ~150 ms), then
`AnimatePresence` to transition the selected value into the next screen's header (y: 8px → 0,
opacity 0 → 1, duration: `--motion-base` ~200 ms, easing: ease-out). Reduced-motion: use
`useReducedMotion()` hook; when true, skip the scale pulse and apply an instant opacity swap
— no translate, no scale.

**SwiftUI.** Wrap the commitment tile in a `Button` with `.buttonStyle(.plain)`. On selection,
animate the confirmation with `.animation(.easeOut(duration: DesignTokens.Motion.durationFast),
value: selectedCommitment)` — a background color transition. The commitment value fades into
the next view's header via the standard `NavigationStack` transition with a custom `.opacity`
modifier driven by `DesignTokens.Motion.durationBase`. Reduce-motion: check
`@Environment(\.accessibilityReduceMotion)` and replace transition with
`.transaction { $0.animation = nil }`. No spring effects on the confirmation.

**Flutter.** `AnimatedContainer` for the color-fill transition (duration:
`DesignTokens.Motion.durationFast`). `FadeTransition` with
`CurvedAnimation(curve: Curves.easeOut)` for the value into the summary header. Reduce-motion:
check `MediaQuery.of(context).disableAnimations` and substitute `duration: Duration.zero`.

**React Native / Reanimated.** `withTiming` (duration: `DesignTokens.Motion.durationFast`) for
the selection fill; `withTiming` with `Easing.out(Easing.ease)` for the value fade. Check
`AccessibilityInfo.isReduceMotionEnabled()` and set duration to 0 when true. All durations
must read from `DesignTokens.Motion` constants, not hardcoded milliseconds.

### Bright Line / Dark Line / Guardrail

**Bright line.** The commitment reflects the user's real intent and the product uses it
exclusively to serve that intent better — personalizing plan copy, push timing, coach
responses, milestone framing, and paywall positioning around what the user said they actually
wanted to achieve.

**Dark line.** Using the commitment to manufacture guilt, urgency, or loss-aversion in service
of a purchase decision the user would not otherwise make; using a vague commitment to imply
the user agreed to a subscription they did not explicitly understand; fabricating social proof
from commitment data. All three are compliance vetoes.

**Guardrail.** Before this card is marked launch-ready, verify two things on a real device:
(1) navigate to Settings or Profile and confirm the user can update or delete their stated
commitment without a support ticket; (2) review every copy surface that echoes the commitment
and confirm none uses the commitment value to manufacture guilt, urgency, or loss-aversion.
Run `npm run check:emotional-design -- --root .` and verify zero errors on
commitment-echoed copy surfaces.

### Pairs With

- Intent Mirroring Card — reflects the commitment back at a meaningful moment
- Variable Reward Card — the commitment provides the reference frame for variation to feel
  personally meaningful
- Perceived Effort Delay Card — echoing the commitment during plan-generation amplifies the
  IKEA effect
- `references/onboarding-conversion.md` — the commitment step is an onboarding-conversion
  surface; placement and framing directly affect paywall conversion rate
- `references/eleven-star-experience.md` — maps to 6-star (product remembers me) and 7-star
  (made for me)

### 11-Star Level

**6-star (Better than Expected).** The product remembers the user's stated commitment and
surfaces it consistently — in plan summaries, push copy, milestone headers, and coach
responses — without the user having to repeat themselves. The product acts like a
knowledgeable partner who listened.

**7-star (Way Beyond — Made for Me).** The product adapts its cadence, copy, coach tone,
push timing, and paywall framing precisely to the user's stated commitment AND the
implementation intention context (when and where they said they would act) — so every
touchpoint feels authored for this specific person's goal, not drawn from a template.

---

## Variable Reward Card

**One-liner.** Unpredictable positive outcomes delivered after an anticipation window produce
the highest engagement rate of any reinforcement schedule — because dopamine fires on the
wait, not the receipt.

**Emotional beat.** Anticipation-then-surprise: "I wonder what I'll get this time." The user
leans in during the wait. The reveal is secondary; the lean-in is the lever.

### Psychology + Canonical Research

B.F. Skinner's variable-ratio reinforcement schedule (_The Behavior of Organisms_, 1938) is
the mechanism: an action rewarded on an unpredictable interval produces a higher response rate
than any fixed schedule, and the behavior is the most resistant to extinction. Wolfram
Schultz's dopamine reward-prediction-error signal (_Science_, 1997) explains the neuroscience:
dopamine neurons fire maximally not when the reward is delivered but when an unexpected reward
is anticipated. When the reward is fully predicted, the dopamine signal moves earlier to the
cue — which means the app interaction (the tap, the completion) becomes the dopamine trigger,
not the reward itself.

Kent Berridge's wanting-vs-liking dissociation (_Neuroscience & Biobehavioral Reviews_, 1996)
adds the critical nuance: the dopamine-driven "wanting" system is anatomically and
functionally distinct from the opioid-driven "liking" system. A user can experience intense
wanting (compulsive check-back behavior) with modest liking (mild satisfaction at the result).
This dissociation is what makes variable reward the most potent — and most ethically
high-risk — card in the deck. Nir Eyal's Hook Model (_Hooked_, 2014) operationalizes all
three: Variable Reward is step 3 of the Trigger → Action → Variable Reward → Investment loop,
with three reward types — rewards of the tribe (social validation), rewards of the hunt
(information, content), and rewards of the self (mastery, progress).

| Source | Finding | Confidence |
|---|---|---|
| Skinner, _The Behavior of Organisms_ (1938) | Variable-ratio schedules produce highest response rates and greatest resistance to extinction. | solid |
| Schultz, _Science_ (1997) | Dopamine neurons fire on anticipation of uncertain reward, not its receipt; unexpected rewards produce largest spikes. | solid |
| Berridge et al., _Current Opinion in Pharmacology_ (2009) | Wanting (dopamine/incentive salience) and liking (opioid/hedonic pleasure) are dissociable; high wanting can coexist with low liking. | solid |
| Eyal, _Hooked_ (2014) | Variable Reward is step 3 of the Hook Model; three reward types map to user motivation: tribe, hunt, self. | solid |
| Fogg, _Tiny Habits_ (2019) | Variable reward increases effective motivation; card must be timed to naturally high-motivation, low-friction moments. | solid |
| Kahneman & Tversky, _Econometrica_ (1979) | The possibility of a positive surprise is weighted disproportionately to its probability — inflating perceived value of uncertain outcomes. | solid |
| Belgium/Netherlands gambling authority rulings on loot boxes, 2018–2019 | Paid money → uncertain outcome classified as gambling in multiple EU jurisdictions. | attribution-uncertain |

### Mechanism Steps

1. The user completes a meaningful action in the core loop.
2. The app introduces an anticipation window: 1.5–3 seconds of visible motion (pulsing,
   breathing, assembling) before the result is revealed. This is the dopamine trigger per
   Schultz 1997 — the wait is the emotional peak, not the result.
3. The result is revealed and it genuinely varies across a meaningful positive range. Not
   cosmetic variation (same outcome, different label color) but real variation: a different
   insight, a higher-quality match, a more detailed analysis, a surprising recommendation, a
   personal best, a new unlock.
4. The product reinforces the wanting loop by ending the reveal screen cleanly, without a
   spend prompt.
5. The investment phase begins: the user adds data, rates a result, continues a streak, or
   refines their profile — each investment makes the next variable reward more personally
   calibrated.

### Real App Examples

**Duolingo — lesson completion reveal.** Results screen shows animated XP count, streak flame
check, and occasionally a league position change or special achievement badge. The variation is
real: some sessions yield routine XP, others trigger a league promotion or rare badge. The
anticipation window (animated XP counter) fires the dopamine prediction-error signal before
the result is known. No spend prompt follows the reveal.

**Spotify Discover Weekly / Wrapped.** Discover Weekly's value proposition is variable reward:
every Monday the user opens a playlist they did not curate and discovers whether the algorithm
found something they love. The anticipation ("I wonder what my top artist will be") is the
product moment. Variation is real and personalized — two users get radically different
playlists. No spend is attached to the reveal.

**AI-generated personalized plans (Future, Freeletics).** After onboarding questions, the user
sees an animated "building your plan" sequence followed by a personalized training plan reveal.
Variation is real: different exercise mixes, volume prescriptions, and focus weeks. This shows
the Variable Reward Card layered with the Perceived Effort Delay Card. The variation must be
real — if every user gets the same template plan with name substitution, the mechanic collapses
into fake effort and the guardrail is violated.

### When to Use / When NOT to Use

**Use** at: the first result or insight reveal after onboarding effort; core-loop completions
where the outcome is legitimately variable (match quality, recommendation novelty, AI analysis
depth, plan personalization, streak milestone check); any surface where the user has invested
effort and does not know what quality of output they will receive.

**Do NOT use** on: transactional, predictable confirmations; any screen directly coupled to a
spend prompt or paywall — this combination is the highest-risk dark pattern in the
ethics-guardrail reference and a compliance veto; routine CRUD operations; surfaces targeting
children.

### Producer Recipe

1. Identify the core-loop action where the outcome is or could be genuinely variable.
   Document the variation space in `TECH_SPEC.md`: what is the range of possible outputs, what
   makes each output different, what percentage of consecutive completions will produce
   observably different content (target: ≥30%).
2. Design the anticipation window before building the reveal animation. 1.5–3 seconds — long
   enough for the dopamine cue to fire, short enough not to feel like a load error. Use a
   breathing or pulsing animation driven by `DesignTokens.Motion`. Implement prefers-reduced-
   motion fallback: collapse to a single static state with no animation.
3. Design the reveal animation with a spring easing at `motion.expressive` timing. The reveal
   should feel like an arrival. Use scale + opacity entrance for the result card; for milestone
   unlocks, add a particle or confetti burst using native canvas or SwiftUI Canvas.
4. Add the escape hatch in Settings > Accessibility: a toggle that disables animated reward
   reveals and shows results immediately as plain text. Document the toggle in `TECH_SPEC.md`
   and in the Guardrail Contract attestation block (`user_control_escape_hatch`).
5. Emit PostHog events: `variable_reward_anticipation_started` (when the window opens, with
   `surface`, `reward_type`, `flow_id`) and `variable_reward_revealed` (when the result
   appears, with `surface`, `reward_type`, `reward_variant`, `anticipation_duration_ms`). Add
   both to `ANALYTICS.md` before implementation.
6. Write the Guardrail Contract attestation block in `ONBOARDING.md`, `SPEC.md`, or a
   dedicated `ETHICS.md`. Fill all HIGH-tier fields: `bright_line`, `dark_line`, `guardrail`,
   `user_control_escape_hatch`, `ethics_attestation`. Run `npm run check:emotional-design
   -- --root .`.
7. Verify variation is real on device: run the same core-loop action twice in succession.
   Confirm the backend returns observably different content at least 30% of the time, or
   document why personalization convergence makes consecutive variation unlikely. Record proof
   in `PRODUCTION_READINESS.md`.

### Auditor Signals

**Present**
- Anticipation window of 1.5–3 s precedes result reveal with visible animation
- Reveal animation uses spring easing (expressive timing), not a linear fade
- `variable_reward_anticipation_started` and `variable_reward_revealed` events appear in
  PostHog with required properties including `anticipation_duration_ms` and `reward_variant`
- Result content observably differs across sessions for the same user (documented in
  `PRODUCTION_READINESS.md`)
- Settings > Accessibility contains a toggle to disable animated reward reveals
- prefers-reduced-motion / OS reduce-motion fallback is implemented
- No spend prompt or paywall CTA appears on the same screen as the variable reward reveal
- Guardrail Contract attestation block exists with all HIGH-tier fields filled
- `reward_variant` property is populated with a meaningful category, not null

**Missing**
- No anticipation window — result appears instantly with no emotional beat
- `variable_reward_revealed` fires but `variable_reward_anticipation_started` is absent
- `reward_variant` is null, empty, or always the same value
- Settings > Accessibility has no escape hatch for animated reveals
- prefers-reduced-motion fallback is absent
- Guardrail Contract attestation block is missing or has empty required fields
- `anticipation_duration_ms` not recorded

**Misused**
- Spend prompt (paywall, IAP, upgrade) appears on the same screen as the reveal — highest-risk
  dark pattern, compliance veto
- Near-miss engineering: result artificially degraded to "almost good enough" to increase
  retry behavior
- Variation is cosmetic only: same backend result, different animation or label color
- Anticipation window artificially inflated beyond 3 s with no real computation
- Variable reward coupled to paid spend: loot-box mechanic, classified as gambling in EU
- The escape hatch toggle exists but disabling it still shows the animation

### Measurement Events

| Event | What it proves | Required properties |
|---|---|---|
| `variable_reward_anticipation_started` | Anticipation window triggered and measured | `surface`, `reward_type` (tribe/hunt/self), `flow_id` |
| `variable_reward_revealed` | Result delivered after anticipation | `surface`, `reward_type`, `reward_variant`, `anticipation_duration_ms` |
| `core_action_completed` | Upstream action that triggered the loop completed | join with `anticipation_started` to measure drop-off |
| `return_session_started` | User returned | segment by `reward_variant` tier in last session vs. D1 return rate |

### Mobile Implementation + Reduced-Motion

**SwiftUI.** Anticipation: `.scaleEffect(isAnticipating ? 1.05 : 1.0).animation(.easeInOut(duration: DesignTokens.Motion.moderate).repeatForever(autoreverses: true), value: isAnticipating)`. Reveal: `.spring(response: DesignTokens.Motion.expressive, dampingFraction: 0.6)`. Reduced-motion: check `UIAccessibility.isReduceMotionEnabled` before setting up the repeat animation; if true, skip directly to the reveal state with a 0-duration transition.

**Flutter.** `AnimationController` with `CurvedAnimation(curve: Curves.easeInOut)` for
anticipation; `AnimatedContainer` or `AnimatedScale` for reveal. Check
`MediaQuery.of(context).disableAnimations` for the reduced-motion gate.

**React Native (Reanimated 2).** `useSharedValue + withRepeat(withTiming(1.05, { duration: DesignTokens.Motion.moderate }), -1, true)` for anticipation; `withSpring` for reveal. Check `AccessibilityInfo.isReduceMotionEnabled` async on mount; skip the `withRepeat` call when true.

**Web (motion/react).** `animate={{ scale: [1, 1.05, 1] }}` with `transition={{ repeat: Infinity, duration: motion.moderate }}` for anticipation; `whileInView` + spring for reveal. Wrap in `useReducedMotion()` from motion/react — if true, use `animate={{ opacity: [0, 1] }}` with duration 0 as fallback. All durations reference promoted `--motion-*` CSS variables.

### Bright Line / Dark Line / Guardrail

**Bright line.** The variation is real and every possible result serves the user's stated goal.
The user could receive any result in the range and feel the app worked for them. The mechanic
keeps users curious about their own progress, not anxious about an outcome they paid for.

**Dark line.** Applying variable reward to paid spend (loot boxes); engineering near-miss
signals to increase retry behavior; coupling the dopamine anticipation window to a spend prompt
on the same screen; using cosmetic variation to manufacture engagement without genuine
personalization.

**Guardrail.** Before ship: (1) Run the core-loop action twice in succession on a test account;
if the backend returns identical content both times with no documented reason, the card is
non-compliant. (2) Confirm no paywall CTA or IAP prompt appears on the same screen or within
one navigation step of the reveal screen. (3) Confirm Settings > Accessibility contains a
functional toggle that disables animated reveals and falls back to static text. Test with OS
Reduce Motion enabled. (4) Run `npm run check:emotional-design -- --root .` and confirm zero
errors.

### Pairs With

- Perceived Effort Delay Card — show effort being done, then reveal a variable result
- Commitment Card — the commitment provides the personalization signal that makes variation
  real and personal
- Intent Mirroring Card — mirror intent before a high-stakes reveal to prime the wanting state

### 11-Star Level

**6-star (Better Than Expected).** The result lands with more emotional weight than a plain
data display — the user feels surprised and pleased, not just informed.

**7-star (Way Beyond).** The result feels personally discovered rather than algorithmically
generated — the user tells someone else what they found. Requires `reward_variant` to be
genuinely personalized to the user's commitment and history.

---

## Perceived Effort Delay Card

**One-liner.** Show the system working through the user's specific inputs — a narrated
processing moment that converts wait time into perceived craftsmanship and raises willingness
to pay.

**Emotional beat.** Anticipatory trust — "It's working hard for me; this result must be worth
it."

### Psychology + Canonical Research

Ryan Buell and Michael Norton demonstrated in "The Labor Illusion: How Operational Transparency
Increases Perceived Value" (_Management Science_, 2011) that users rate service quality higher
and value outputs more when they can observe the effort expended on their behalf — even when
the underlying delay is partly artificial. In their canonical experiment, a travel-search site
that revealed its search process step-by-step was rated significantly better than one that
returned results instantly, despite identical result quality.

Norton, Mochon, and Ariely's IKEA Effect (_Journal of Consumer Psychology_, 2012) compounds
this: when a user participates in or witnesses the construction of their output — especially
when the system visibly processes their own inputs — the perceived value of that output
inflates because the user has psychological skin in the game. On mobile, the combination
produces a double lift: the labor signal raises the service's perceived quality (Buell/Norton
axis) and the user's involvement raises the output's perceived personal value (IKEA axis).

Gollwitzer's implementation intentions research (_American Psychologist_, 1999) adds a third
layer: when the system makes the user's stated inputs explicit during the build phase, it
strengthens the user's mental ownership of the result before they have even seen it.

| Source | Finding | Confidence |
|---|---|---|
| Buell & Norton, _Management Science_ (2011) | Users value outcomes more and rate service quality higher when they observe the effort behind them — even when delay is partly artificial. | solid |
| Norton, Mochon & Ariely, _Journal of Consumer Psychology_ (2012) | IKEA Effect: users place higher value on outputs they participated in creating; perceived effort delay elevates this when users see the system working through their specific inputs. | solid |
| Gollwitzer, _American Psychologist_ (1999) | When the processing screen names the user's own inputs, it converts them into an implementation intention for the revealed result. | solid |
| Buell, attribution-uncertain follow-on work circa 2016–2019 | Extensions of operational transparency to algorithmic/mobile contexts; narration of algorithmic steps produces similar quality-perception lifts. | attribution-uncertain |

### Mechanism Steps

1. User completes the input phase (onboarding quiz, goal-setting, content upload, or query
   submission).
2. The app enters a processing state. The UI does NOT show a generic spinner. It opens with a
   scene-setting line tied to the user's context: "Building your plan, [name]…" or "Analyzing
   your answers…"
3. A sequence of 3–6 narration steps fires at paced intervals (not random). Each step names a
   dimension of the user's own input: "Matching your goal: sleep 8 hours…", "Calibrating for
   your schedule: 5 mornings a week…" Each step has a stable `copy_key` for analytics.
4. A visible progress indicator (bar, count, or stepped dots) advances with each narration
   step — not continuously — so the user reads each step before the next replaces it.
5. When real computation finishes, the final narration step resolves: "Your plan is ready."
   The transition to the result screen is a designed reveal moment, not an abrupt swap.
6. The revealed result screen immediately shows the user's own language back: their goal, their
   schedule, their named preferences.
7. An opt-out or cancel affordance is always present. A visible "Skip ahead" or "Cancel"
   ensures the mechanic serves users who do not want the wait.

### Real App Examples

**Noom.** After the onboarding quiz (~16 questions), Noom shows a multi-step "Creating your
personal plan" screen that ticks through named dimensions — BMI analysis, behavior change
strategy, pace recommendation — before revealing the program. The processing screen lasts 8–12
seconds and explicitly names the user's goal weight and timeline in the narration. Noom's
paywall conversion is among the highest in the health category; this mechanic is cited by
growth analysts as a primary lever.

**Headspace.** During initial setup, Headspace shows a "Preparing your session" state that
references the session type and duration the user chose. Even when content is pre-recorded and
instantaneous to serve, the processing state communicates deliberate matching. The user
perceives a matching act, not a random playlist.

**Lensa / AI avatar apps.** Show a prominently timed processing sequence — often 30–90 seconds
with visible step labels ("Training your model…", "Generating styles…") and a real progress
bar — before delivering the generated image set. Users who see the steps rate the output
quality higher than users shown a featureless progress bar for the same duration, even when
the images are identical.

### When to Use / When NOT to Use

**Use** at any moment where the app transitions from user input to a personalized output. The
card has the highest impact immediately before the paywall or the first-value reveal screen.
Canonical trigger points: (1) after the onboarding quiz, before the personalized plan reveal;
(2) after a user submits a goal for AI/algorithmic processing; (3) after a workout or session
completes while the summary is being composed; (4) after a file/photo upload while analysis
runs.

**Do NOT use:** (1) when there is no real computation, data processing, or UI composition
happening and the delay would be entirely synthetic — this crosses the dark line; (2) on error
or payment-failure screens; (3) on cancel, unsubscribe, or downgrade flows; (4) for repeat
actions after the user has already seen the card multiple times in the same session.

### Producer Recipe

1. **Identify the input boundary.** Locate the exact screen or event where the user's inputs
   are complete and the app transitions to output. Name it in `ONBOARDING.md` as the "effort
   delay trigger point." Document what real computation occurs here. If the answer is "none,"
   the card cannot be applied — stop here and record the blocker.
2. **Audit your inputs.** List every user answer, selection, or preference the system now
   holds. Map each to a plain-language template phrase.
3. **Design the step sequence.** Write 3–6 narration steps. First step references the user's
   primary goal. Middle steps reference supporting inputs. Final step: "Your [plan/result] is
   ready." Assign a stable `step_copy_key` to each step. The displayed copy can be A/B tested;
   the key must never change.
4. **Implement the timing contract.** Duration is real computation time, minimum 2 seconds,
   maximum 15 seconds for onboarding flows, 90 seconds for legitimate AI/GPU workloads. If
   real computation finishes before the minimum, hold the UI until the minimum elapses — but
   document this in code comments as a UX hold, not a fake delay. Never add arbitrary sleep
   timers beyond the UX hold minimum.
5. **Build the reveal transition.** Fade or upward-reveal animation using `DesignTokens.Motion`
   on native; framer-motion/motion on web. Result screen must surface the user's own language
   in its hero copy.
6. **Add the opt-out affordance.** Include a visible "Skip" or "Continue without waiting"
   control. Log skip events as `effort_delay_cancelled`.
7. **Instrument all events.** Wire `effort_delay_started` (with `computation_type`),
   `effort_delay_step_shown` (per step, with `step_copy_key` and `inputs_personalized: bool`),
   `effort_delay_completed`, `effort_delay_cancelled`, `effort_delay_result_engaged`, and
   `effort_delay_result_dismissed`. Set person properties `plan_built_at`,
   `plan_inputs_count`, `plan_effort_steps_seen`.
8. **Implement reduced-motion fallback.** Read the OS-level preference before starting any
   animation. When reduce-motion is active: remove all transitions and step-fade animations;
   display narration steps as a static list that auto-advances via text change only.
9. **Validate computation type.** Before any experiment is enabled, a code reviewer must
   confirm every `effort_delay_started` event tagged `computation_type: ui_composition` or
   `real_data_processing` has a corresponding real operation — not a sleep timer. Log in
   `TECH_SPEC.md`. This is the guardrail gate.
10. **Run the A/B experiment.** Deploy the `exp_effort_delay_<app_slug>_<YYYYMM>` flag with
    three variants: control (generic spinner), personalized steps, personalized steps + visible
    progress count. Primary metric: `paywall_viewed → trial_started` or `purchase_completed`.

### Auditor Signals

**Present**
- Processing screen shows narration steps that reference the user's own inputs by name or
  category — not generic steps like "Loading…" or "Please wait…"
- Each narration step has a stable `copy_key` in the codebase
- `effort_delay_started` event fires with `computation_type` populated and
  `user_inputs_referenced_count > 0`
- `effort_delay_step_shown` fires per step with `inputs_personalized: true` for at least the
  first step
- A visible Skip or Cancel affordance exists on the processing screen
- Result reveal screen surfaces the user's own language in the hero copy
- `reduce_motion_active` property is set in `effort_delay_started` and fallback rendering is
  verified in device accessibility settings
- `computation_type` is documented in `TECH_SPEC.md` with no arbitrary sleep timers beyond
  a documented UX hold minimum

**Missing**
- Processing screen shows a generic spinner with no narration
- Narration steps reference system-internal steps ("Connecting to servers…") rather than user
  inputs
- `effort_delay_started` fires but `user_inputs_referenced_count = 0`
- No Skip / Cancel affordance on the processing screen
- Result reveal screen shows a generic output header with no user-language echo
- No reduced-motion fallback
- `plan_effort_steps_seen` person property not set
- `TECH_SPEC.md` has no `computation_type` documentation

**Misused**
- Delay implemented with an arbitrary sleep timer that fires even when the API response has
  already returned — pure theater, crosses the dark line
- Processing screen fires on the cancel or unsubscribe flow — adds friction to exit,
  compliance veto
- Processing screen fires on a payment-failure or error screen — compliance veto
- The same processing screen fires on every subsequent session for repeat actions
- Progress bar advances continuously and randomly regardless of actual computation stages —
  fake progress bar, canonical dark-line example
- `computation_type` tagged `real_api_call` in analytics but implementation uses `setTimeout`
- Narration steps reference user's inputs but those inputs were never used in the computation

### Measurement Events

| Event | What it proves | Required properties |
|---|---|---|
| `effort_delay_started` | Card fired; `computation_type` confirms delay is honest | `computation_type`, `user_inputs_referenced_count`, `flow_id`, `variant_id` |
| `effort_delay_step_shown` | Each narration step reached the user | `step_copy_key`, `inputs_personalized: bool`, `step_index` |
| `effort_delay_completed` | User saw the full processing sequence | `actual_duration_ms`, `target_duration_ms`, `reduce_motion_active: bool` |
| `effort_delay_cancelled` | User chose to skip | `time_to_cancel_ms`, `step_at_cancel` |
| `effort_delay_result_engaged` | User found the result worth acting on | `time_to_first_engagement_ms` |
| `effort_delay_result_dismissed` | Counter-metric | `time_to_dismiss_ms` (< 1000 ms is the clearest signal wait wasn't worth it) |
| `emotion_card_fired` | System-level card registry event | `card_id: perceived_effort_delay` |
| `emotion_card_abandoned` | User exited during or immediately after the card | `rage_tap_detected: bool` |

### Mobile Implementation + Reduced-Motion

**SwiftUI.** Full-screen overlay with a `VStack` of narration labels that fade in sequentially
using `withAnimation(.easeInOut(duration: DesignTokens.Motion.stepFadeDuration))`. Advance
steps using a timer tied to real async task state, not a fixed `DispatchQueue.asyncAfter`
chain. Reduced-motion: check `UIAccessibility.isReduceMotionEnabled`; when true, render all
steps as a static list with instant text replacement, no opacity transitions, no progress bar
animation. The step auto-advance timer still runs.

**Flutter.** `AnimatedSwitcher` with `FadeTransition` for each step label; drive step index
from a `StreamController` that emits on real computation milestones. Check
`MediaQuery.of(context).disableAnimations` for the reduced-motion gate.

**React Native (Reanimated 3).** `useSharedValue + withTiming` for step opacity; drive from a
`useEffect` that listens to real Promise resolution events. Reduced-motion gate:
`AccessibilityInfo.isReduceMotionEnabled`.

**Web (motion/react).** Use the motion library with variants for step entry (opacity: 0 → 1,
y: 8 → 0, transition: { duration: 0.3, ease: 'easeOut' }). Gate all variants behind the
`prefers-reduced-motion` media query via `useReducedMotion()` from motion/react. Progress bar:
use a stepped indicator that advances only when a real step fires — not an indeterminate
spinner. Each segment lights up with a short fill animation (`DesignTokens.Motion.progressSegmentDuration`, typically 300–500 ms).

### Bright Line / Dark Line / Guardrail

**Bright line.** The processing delay shows the user evidence of real work — a real API call,
real data processing, or real UI composition — narrated in the user's own language. The user
can cancel at any time. Accuracy of the steps is upheld: if the system says "Analyzing your 5
goals," it used all 5 goals in the computation.

**Dark line.** An artificial delay added by a sleep timer or arbitrary `setTimeout` with no
underlying computation — pure theater. Equally: a progress bar that advances randomly
regardless of real computation stages (a fake progress bar). A discovered fake delay produces
a trust collapse worse than no delay at all, triggers "just a spinner" and "doesn't actually
analyze" review clusters, and is a compliance veto.

**Guardrail.** Before any `effort_delay_started` event is instrumented, the code reviewer
must confirm in `TECH_SPEC.md`: (1) `computation_type` is one of `real_api_call`,
`real_data_processing`, or `ui_composition` — no sleep-timer-only path; (2) the minimum UX
hold (if any) is documented with exact milliseconds and a code comment; (3) narration steps
are driven by real async milestones, not a fixed timer sequence; (4) at least one narration
step references a real user input by value or category. Run `npm run check:emotional-design
-- --root .`. If `computation_type = ui_composition` and `effort_delay_cancelled` rate exceeds
10% in any variant, halt the experiment and file the emotional-card-dark-line-crossed failure
card immediately.

### Pairs With

- Variable Reward Card — effort delay builds anticipation that the variable reward card
  delivers into
- Commitment Card — the processing screen can echo the user's committed goal, reinforcing
  commitment and activating the IKEA effect simultaneously
- Intent Mirroring Card — the result reveal screen that follows is the natural placement for a
  brief intent mirror

### 11-Star Level

**6-star (Better than expected).** A loading screen that narrates what the system is doing
converts wait into perceived work — users arrive at the result trusting it more than they would
from an instant response. Minimum viable Labor Illusion application; baseline target for V1.

**7-star (Way beyond).** The narration names user-specific details drawn from their actual
inputs — their stated goal, their selected schedule, their named obstacle — so the processing
screen feels like watching a skilled practitioner read their file before prescribing. At this
level, the IKEA effect and implementation-intention mechanisms are both active, and the result
reveal feels co-created rather than retrieved.

---

## Intent Mirroring Card

**One-liner.** A deliberate pause that reflects the user's declared goal back in their own
words — before effort or payment — turning a transactional interaction into a moment of
self-recognition that deepens motivation and perceived fit.

**Emotional beat.** Being seen — "This product understands what I actually want."

### Psychology + Canonical Research

The Intent Mirroring Card operates at Norman's reflective tier of emotional design — the level
where identity, meaning, and values are processed, not just usability or appearance (Don
Norman, _Emotional Design_, 2004). The reflective tier is where loyalty beyond usability is
formed. Most consumer apps reach the behavioral tier (they work smoothly), and a few reach
the visceral tier (they look right). Almost none reach the reflective tier in onboarding,
which is precisely why Intent Mirroring is differentiating.

The mechanism has two interlocking psychological components. First, Gollwitzer's implementation
intentions research (1999) shows that an explicit if-then plan dramatically increases follow-
through compared to a vague goal statement. Reading one's own goal back in a concrete,
contextual form reinforces the plan structure. When the product mirrors the goal in the user's
own phrasing rather than a generic paraphrase, it also activates Cialdini's commitment and
consistency principle (_Influence_, 1984): seeing your stated goal reflected back creates a
subtle but real pressure to behave consistently with it, because the goal now feels externally
witnessed and therefore more binding.

Alan Cooper's goal-directed design framework (_The Inmates Are Running the Asylum_, 1999)
provides the engineering frame: the product's onboarding must serve the user's actual goal —
the outcome they are trying to achieve in their life — not the task the app instructs them to
perform. Kahneman and Fredrickson's peak-end rule (_Psychological Science_, 1993) supplies the
conversion mechanic: the mirror is engineered to be the emotional peak of the onboarding curve,
positioned before the paywall so the subscription decision is made from a peak emotional state.

| Source | Finding | Confidence |
|---|---|---|
| Norman, _Emotional Design_ (2004) | The reflective tier — where self-image and values are processed — produces loyalty beyond usability; most apps never reach it. | solid |
| Gollwitzer, _American Psychologist_ (1999) | Explicit if-then plan dramatically increases follow-through; reading one's goal back in concrete, contextual language strengthens goal representation. | solid |
| Cialdini, _Influence_ (1984) — commitment and consistency | Seeing one's own stated goal reflected back by a third party increases consistency pressure; the goal now feels socially real. | solid |
| Cooper, _The Inmates Are Running the Asylum_ (1999) | Design from the user's final goal — the outcome they want in their life — and work backward. Products that make the user's actual goal visible create significantly stronger perceived fit. | solid |
| Picard, _Affective Computing_ (1997) | Systems that recognize and respond to a user's emotional state create significantly stronger engagement and trust; the recognition itself is a meaningful emotional event. | solid |
| Kahneman & Fredrickson, _Psychological Science_ (1993) — peak-end rule | Overall memory of an experience is dominated by the emotional peak and the end. Intent Mirroring is engineered to be the peak of the onboarding emotional curve. | solid |

### Mechanism Steps

1. Collect explicit goal data during onboarding — gather the user's goal, current state,
   biggest obstacle, or desired outcome as a discrete, queriable field (not free text embedded
   in a paragraph).
2. Select the mirror trigger moment — choose one of: (a) after commitment is captured and
   before the paywall, (b) at the start of a return session, or (c) immediately after the
   first value reveal. Do not use all three in the same session.
3. Compose the mirror in the user's own language — use the exact phrasing from their selection
   or, if free text, their verbatim words. Do not paraphrase, generalize, or psychologically
   escalate.
4. Design a deliberate pause — animate the mirror text with a slow fade-in using
   `motion.deliberate` (~600 ms) so the screen has a quiet, considered energy distinct from
   transition screens.
5. Confirm forward motion — after the mirror, provide a single, goal-aligned CTA: "Let's
   build your plan" / "Start your first session." The CTA must NOT be a paywall trigger on
   the same screen.
6. Emit the PostHog event — fire `intent_mirror_shown` when the mirror screen is fully
   visible; fire `intent_mirror_continued` when the user taps the CTA.
7. Apply the reduced-motion fallback — when prefers-reduced-motion is active, render the
   mirror text as instantly visible, styled text with no animation.
8. Limit to 1–2 triggers per session maximum.

### Real App Examples

**Duolingo.** After language-and-why onboarding questions, before the first lesson, Duolingo
surfaces: "Your goal is to hold a basic conversation in French in 3 months. We'll do 10
minutes a day." The user's own selections — language, goal type, daily time — are reflected
back as a concrete plan. The mirror activates Gollwitzer's implementation intention: the if-
then plan ('10 minutes a day / French / 3 months') is more cognitively activating than a
vague "learn French" goal. The user is deciding to purchase from a peak of felt alignment.

**Noom.** After 15+ onboarding questions, Noom presents: "Based on what you told us, you're
most likely struggling with emotional eating triggered by stress at work. Here's how we'll
address it." The user's specific obstacle — not a generic category — is named back. Noom's
mirror operates at Norman's reflective tier: the user feels understood at the level of identity
and emotional pattern. The mirror is placed immediately before the paywall — the emotional peak
of the onboarding curve (Kahneman and Fredrickson peak-end rule).

**Headspace.** At the start of every session after initial onboarding, Headspace briefly
surfaces the user's stated reason for meditating — "You're here to reduce anxiety before
sleep" — and names the session type that addresses it. This return-session mirror is the
10-star implementation of Intent Mirroring: a human advisor would restate your goal at the
beginning of every session. Headspace makes this scalable by storing the user's stated reason
and surfacing it as a contextual opener. It activates Cialdini's consistency on each return.

**Calm.** After selecting a sleep story, Calm briefly shows a screen that connects the
selection to the user's stated sleep goal: "You said you want to fall asleep faster. Sleep
stories are one of the most effective tools our members use for that." The mechanism is brief
(one sentence) but operates at Norman's reflective tier by connecting the immediate action to
the user's self-concept.

### When to Use / When NOT to Use

**Use** in consumer mobile apps that collect personalization data in onboarding — goal-setting,
health, fitness, education, habit, finance, creativity, and coaching apps. Trigger at one of
three moments: (1) after commitment is captured and before the paywall — canonical placement,
making it the emotional peak that precedes the purchase decision; (2) at the beginning of a
return session — concierge-level implementation; (3) immediately after the first value reveal.

**Do NOT use** in: (a) utility apps where the user has no declared goal beyond task completion;
(b) apps where no onboarding questions were asked; (c) more than 1–2 times per session; (d) on
the same screen as a paywall CTA; (e) crisis, mental health, or grief contexts where reflecting
a user's stated distress back to them without clinical support could cause harm.

### Producer Recipe

1. **Map the mirror sources in `ONBOARDING.md`** — identify every question whose answer will
   be used in a mirror. For each: record the field name, data type, stored key in the backend
   profile, and PostHog person property.
2. **Choose the mirror trigger moment** — select one primary trigger. Document the trigger in
   `ONBOARDING.md` with the screen ID, the step that precedes it, and the step that follows.
   Confirm the paywall does not appear on the same screen.
3. **Write the mirror template using the user's own language.** Use the user's exact selection
   text, not a paraphrase. Test every combination of onboarding answers.
4. **Design the motion spec** — slow fade-in using `motion.deliberate` (~600 ms) with a brief
   pause before the CTA appears (~300 ms after text is fully visible). Specify the reduced-
   motion fallback in `TECH_SPEC.md`.
5. **Implement the PostHog events** — add `intent_mirror_shown` (with `surface`,
   `mirror_type`, `source_field`, `trigger_context`, `has_free_text`, `user_goal_category`)
   and `intent_mirror_continued` (with `surface`, `next_action`, `time_on_screen_ms`) to
   `ANALYTICS.md` before implementation.
6. **Write the guardrail attestation block** — in `ONBOARDING.md` or `ETHICS.md`, add the
   experience card attestation block: `id`, `mechanism (intent_mirroring)`, `applied_to`,
   `star_level (7)`, `posthog_event`, `bright_line`, `dark_line`, `guardrail`. Record the
   content source (field names from the data collection matrix).
7. **Verify on device before build handoff:** (a) mirror text uses exact words from user's
   selections, (b) CTA follows the mirror and does not trigger a paywall on the same screen,
   (c) reduced-motion fallback renders correctly with Accessibility > Reduce Motion enabled,
   (d) both PostHog events appear in the PostHog activity view, (e) mirror is absent from any
   screen where the paywall is present.
8. **Record evidence in `PRODUCTION_READINESS.md`** — document the content source (field
   names and stored keys), the trigger context, the screen ID, and the result of the bright-
   line three-question test.

### Auditor Signals

**Present**
- Onboarding includes a dedicated screen that displays the user's stated goal or obstacle in
  their own words before the paywall or first core action
- Mirrored text uses the user's exact phrasing, not a generic paraphrase like "your goal"
- Mirror screen has a distinct visual treatment with a deliberate pace — slow fade-in or a
  brief pause
- CTA on the mirror screen is goal-aligned ("Let's build your plan"), not purchase-oriented
  ("Start your free trial") — paywall appears on a subsequent screen
- `intent_mirror_shown` and `intent_mirror_continued` events are present in PostHog with
  `source_field` and `trigger_context` properties
- Reduced-motion fallback is implemented — text renders instantly with no animation when OS
  reduce-motion is enabled, verified on device
- Mirror fires at most once or twice per session
- `ETHICS.md` or `ONBOARDING.md` contains the experience card attestation block with
  `bright_line`, `dark_line`, and `guardrail` fields filled

**Missing**
- No mirror screen in onboarding — onboarding collects personalization data but never reflects
  it back before the paywall
- Mirror is present but generic — "Here is your personalized plan" without the user's actual
  words
- Mirror fires on the same screen as the paywall CTA
- Mirror is implemented as a subtitle or small caption, not as a deliberate, prominent pause
- `intent_mirror_shown` event missing from PostHog
- Reduced-motion fallback absent
- No `source_field` property on the PostHog event
- Attestation block missing or has empty required fields

**Misused**
- Mirror reflects an inferred or computed emotional state the user did not explicitly state
- Mirror escalates the user's stated obstacle into anxiety language
- Mirror used immediately before a paywall on the same screen — recognition moment primes
  the purchase rather than serving the user's goal
- Mirror fires on every screen transition throughout onboarding — 3+ times in a single flow
- Confirmshaming applied in the same flow ("No thanks, I prefer to stay stuck")
- Mirror used in a streak-break grief screen combining loss-aversion with the mirror to
  manufacture urgency
- Free-text content from the user used verbatim in the mirror without sanitization

### Measurement Events

| Event | What it proves | Required properties |
|---|---|---|
| `intent_mirror_shown` | Mirror fired — user saw their stated goal reflected back | `surface`, `mirror_type`, `source_field`, `trigger_context`, `has_free_text`, `user_goal_category` |
| `intent_mirror_continued` | User tapped the goal-aligned CTA | `surface`, `next_action`, `time_on_screen_ms` |
| `paywall_viewed` | Downstream cohort split | segment users who saw `intent_mirror_shown` before `paywall_viewed` vs. those who did not |
| `return_session_started` | When mirror fires on return sessions | measure `core_action_completed` rates for sessions with mirror shown vs. without |

### Mobile Implementation + Reduced-Motion

**SwiftUI.** Implement the mirror screen as a dedicated `SwiftUI View` with
`@State var isVisible = false` and `.opacity(isVisible ? 1 : 0)` animated with
`withAnimation(.easeInOut(duration: 0.6)) { isVisible = true }` in `onAppear`. Use
`UIAccessibility.isReduceMotionEnabled` to gate: if reduce-motion is on, set
`isVisible = true` immediately in `onAppear` with no animation. Text fades in first; CTA
appears after a 0.9 s delay. Token: `DesignTokens.Motion.deliberate` (600 ms).

**Flutter.** `AnimatedOpacity(opacity: _visible ? 1.0 : 0.0, duration: const Duration(milliseconds: 600), curve: Curves.easeInOut)`. Reduced-motion gate: `MediaQuery.of(context).disableAnimations`.

**React Native (Reanimated).** `withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })`. Gate on `AccessibilityInfo.isReduceMotionEnabled()`; if true, set opacity to 1 immediately.

**Web (motion/react).** `motion.div` with `initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: 'easeInOut' }}`. Use `useReducedMotion()` from motion/react to gate. Typography: use the product's heading-level type token for the mirrored goal text. Layout: full-screen or nearly full-screen, centered vertically, ample breathing room — the screen should feel like a pause, not a slide.

### Bright Line / Dark Line / Guardrail

**Bright line.** The mirror reflects the user's own stated words or explicit selections — their
actual goal, obstacle, or declared intent — back to them, at a quiet moment, before asking for
effort or payment, in service of making them more likely to achieve what they came to the app
to achieve. The user feels recognized, not analyzed.

**Dark line.** Mirroring an inferred, escalated, or manufactured emotional state the user did
not explicitly express — to manufacture anxiety, urgency, or guilt that primes a purchase.
Using the mirror on a cancellation or downgrade path as a confirmshaming device. Both are the
mirror mechanism weaponized as a retention dark pattern.

**Guardrail.** Verify all five conditions before ship: (1) Content source check — every word
in the mirror text traces to an explicit user input field documented in `ONBOARDING.md`.
(2) Paywall separation check — mirror screen and paywall screen are distinct, separate screens.
Verify in the rendered `onboarding.html` and on device. (3) Frequency check — count mirror
triggers per session in PostHog; max 2 per `session_id`. (4) Tone check — review mirror copy
against `BRAND.md §Voice`; any phrase that could be read as guilt-inducing, crisis-escalating,
or confirmshaming is a veto. (5) Reduced-motion check — enable OS reduce-motion on a real
device and run the onboarding flow; confirm the mirror screen is still present and readable.
Record all five check results in `PRODUCTION_READINESS.md`.

### Pairs With

- Commitment Card — the commitment is the source data for the mirror; these two fire in
  sequence
- Perceived Effort Delay Card — mirror sets the emotional frame; effort delay builds
  anticipation; reveal is the paywall-adjacent emotional peak
- Variable Reward Card — mirror anchors the session to a meaningful goal; variable reward
  provides moment-to-moment engagement
- `references/onboarding-conversion.md` — canonical mirror trigger is pre-paywall; mirror
  must appear before the App Review popup

### 11-Star Level

**7-star (Way Beyond).** The mirror is not a generic recap. It uses the user's exact phrasing
and reflects back their motivation, not a product description. The user recognizes themselves
in the product's output — the moment that produces the 7-star label "made for me" in
`11_STAR_EXPERIENCE.md`. The return-session mirror is the scalable implementation of the
10-star concierge behavior (a human advisor who restates your goal at the beginning of every
session).

---

## Endowed Progress Card

**One-liner.** Pre-credit users with partial progress at enrollment so completion feels like
finishing something already started, not beginning something from zero.

**Emotional beat.** Momentum — "I'm already partway there; walking away now would waste what
I've built."

### Psychology + Canonical Research

Kivetz, Urminsky, and Zheng's 2006 _Journal of Marketing Research_ study established the
endowed progress effect: loyalty-card holders given 2 pre-stamped slots on a 10-stamp card
outperformed holders given a blank 8-stamp card at the same real task requirement. The
pre-stamps did not reduce effort — they reframed the user's position on the goal-gradient.
Clark Hull's 1932 goal-gradient hypothesis provides the underlying drive mechanism: locomotion
toward a goal accelerates as the distance to the endpoint shrinks. Together: endowment moves
the user off the zero-position (which feels inert) onto the gradient (which feels alive).

Locke and Latham's goal-setting theory (1990) supplies the third layer: specific, proximal
sub-goals sustain motivation more reliably than vague distal ones. When an onboarding quiz
question is framed as "step 2 of 8" and two steps have already been pre-completed, the
sub-goal (finish the remaining six) is specific and proximal. This is not a trick — every
answer the user provided during onboarding, every permission they granted, every piece of
setup work they completed genuinely advances the product's ability to serve them. Pre-crediting
these real contributions is accurate and honest. The deception failure mode is pre-crediting
phantom work that contributes nothing to the product's ability to serve the user.

| Source | Finding | Confidence |
|---|---|---|
| Kivetz, Urminsky & Zheng, _JMR_ (2006) | Loyalty-card holders given 2 free stamps on a 10-stamp card outperformed holders given a blank 8-stamp card despite identical real effort — pre-credited progress increases goal completion rates. | solid |
| Clark Hull (1932) | Goal-gradient hypothesis: effort and motivation toward a goal accelerate as the distance to goal completion decreases. | solid |
| Locke & Latham (1990) | Specific, proximal goals sustain motivation better than vague or distal goals. | solid |

### Mechanism Steps

1. User arrives at the onboarding or feature enrollment entry point. The progress indicator is
   already partially filled — typically 20–30% — reflecting real contributions: account
   creation, permissions granted, onboarding answers, device locale, referral code scanned, or
   any system-level data the product has already collected.
2. Each completed step is labeled with its real contribution ("You answered 3 questions — your
   profile is taking shape"). The label must name what was earned, not just show a number.
3. As the user advances through remaining steps, the progress indicator updates with each
   action. Steps remaining, not steps taken, is the headline number on the final stretch.
4. When the user completes the final step, the progress bar completes with a distinct
   animation — a brief fill-and-pulse on mobile that signals the transition from "building" to
   "ready." This is the emotional peak for this card.
5. The completed progress is echoed in downstream surfaces: the plan summary header, the first
   session greeting, and the paywall context line ("Your personalized plan is ready").

### Real App Examples

**Duolingo.** When a returning user opens a new skill, their existing XP and streak history
pre-populate the course-level progress indicator so they enter the new unit already above zero,
feeling momentum from the broader learning arc rather than facing a blank start. The
pre-populated progress represents real prior work (vocabulary learned, streaks maintained), so
the endowment is honest.

**Noom.** During onboarding, Noom's multi-step quiz uses a progress bar that begins visually
advanced before the user has answered all questions — partially credited for signing up, for
providing their goal, and for granting notification permission — so by question 5 of a
10-question quiz the bar is already past the halfway mark. Each credited action is real setup
work the product used to personalize the plan.

**Headspace.** New users who link an existing Apple Health record or import sleep data see a
"foundations" progress indicator that begins at 1 of 5 rather than 0 of 5, with the pre-
credited step labeled "Sleep data connected" — before they have listened to a single session.
The connected health data is genuinely used to personalize the first session recommendation.

### When to Use / When NOT to Use

**Use** during onboarding when the product has already collected real inputs from the user
(account creation, device locale, permissions granted, referral source, prior usage data,
connected health/calendar/social accounts, quiz answers already given). Use at feature
enrollment when prior in-app behavior constitutes genuine groundwork for the new feature. Use
at subscription upgrade when the user's free-tier history can be honestly represented as a
head-start on the paid-tier progress arc.

**Do NOT use** at the start of a genuinely blank-slate task where no real prior contribution
exists — the pre-fill must represent actual work done, not fabricated credits. Do NOT use when
the progress indicator tracks a safety-critical or legally significant completion (medical
intake, legal agreement, financial setup) where partial-completion framing could mislead. Do
NOT apply to paywall progress indicators that imply the user is "almost there" toward a paid
feature they have not yet earned — this crosses into manufactured urgency. Do NOT combine with
fabricated scarcity copy.

### Producer Recipe

1. **Audit the user's state** at the enrollment entry point. List every real contribution
   already made: account/device setup, permissions granted, locale/language selected, onboarding
   answers provided, referral code scanned, calendar/health/social data connected, prior
   free-tier activity. Each item is a candidate credit. Discard any item that does not actually
   improve the product's ability to serve the user.
2. **Map candidate credits to named steps.** Each credit must have a one-line label ("You set
   a goal: run 3x per week", "Notifications enabled — we can remind you", "We detected your
   timezone"). Step labels are shown in a completed-step list below or beside the progress bar.
3. **Choose a pre-fill percentage:** 20% for a light onboarding (1–2 real prior contributions);
   30–40% for a rich prior state (3+ real contributions). Do not exceed 40% pre-fill on
   first-time onboarding.
4. **Implement the progress component** with two visual states: (a) pre-credited segments
   rendered in a slightly lower-opacity or "banked" fill color; (b) real-time fill as the user
   advances. Pre-credited fill animates in on screen-mount using `DesignTokens.Motion`.
   Implement prefers-reduced-motion: fallback is instant fill with no animation.
5. **Wire the "named head-start" label.** At the top of the progress surface: "You've already
   [N action labels] — here's your head start." This label must populate from real user state,
   never from static copy.
6. **Emit PostHog events.** Fire `endowed_progress_shown` on screen mount with:
   `credits_count`, `credits_labeled` (array of credit label keys), `total_steps`,
   `pre_fill_pct`, `surface`, `flow_id`. Fire `endowed_progress_completed` when the user
   finishes the remaining steps, with: `credits_count`, `steps_completed_by_user`,
   `total_duration_ms`, `completion_pct_at_mount`.
7. **Verify the bright line before shipping:** open `TECH_SPEC.md`, confirm every pre-credited
   step has a documented mapping to a real product operation. If any credit cannot be mapped,
   remove it. Record the step-to-operation map in `TECH_SPEC.md` and reference it in
   `PRODUCTION_READINESS.md`.

### Auditor Signals

**Present**
- Progress indicator is partially filled on first appearance at the enrollment entry point
- Each pre-filled step has a visible text label explaining what was earned
- A "named head-start" summary line appears near the progress indicator
- Pre-credited fill is visually distinguishable from steps the user completes in the current
  session (different fill opacity, color, or icon state)
- Fill animation respects prefers-reduced-motion / OS reduce-motion
- `endowed_progress_shown` PostHog event fires with `credits_count`, `pre_fill_pct`, and
  `surface` properties
- `endowed_progress_completed` fires with `steps_completed_by_user` and `total_duration_ms`

**Missing**
- Progress indicator starts at 0% despite the user having completed real prior steps
- No labeled explanation for pre-filled steps — the bar is partially filled but the user
  cannot tell why
- No "named head-start" summary — the pre-fill is silent
- No PostHog events for the progress surface
- Progress indicator on the paywall surface implies proximity to unlocking paid features
  without the user having earned that proximity
- No prefers-reduced-motion fallback on the fill animation

**Misused**
- Pre-filled steps represent phantom work ("Welcome!" or "Account type: Free") that
  contributes nothing to product personalization
- Pre-fill percentage exceeds 70% at onboarding entry, simulating near-completion before any
  real work
- Progress indicator is placed on the paywall screen with copy implying the user is "almost
  there" toward a subscription benefit — manufactured urgency
- Pre-credited step list includes future actions not yet taken, framed as completed
- Progress bar is reset to 0% on re-entry after the user leaves and returns, erasing the
  endowment
- Pre-fill applied to safety-critical or legally significant completion steps

### Measurement Events

| Event | What it proves | Required properties |
|---|---|---|
| `endowed_progress_shown` | Card rendering with non-zero pre-fill at enrollment entry point | `credits_count`, `pre_fill_pct`, `total_steps`, `surface`, `flow_id` |
| `endowed_progress_completed` | User finished the remaining steps | `credits_count`, `steps_completed_by_user`, `total_duration_ms`, `completion_pct_at_mount` |
| `onboarding_step_viewed` | Step-level dropout after the endowed progress surface | compare dropout rates by step for users who saw the pre-filled indicator vs. those who did not |
| `paywall_viewed` | Endowed-progress completers reach the paywall at a higher rate than non-completers | segment by `credits_count` |

### Mobile Implementation + Reduced-Motion

**SwiftUI.** Custom `ProgressView` or `HStack` of step-segment capsules. Pre-credited segments
fill using `withAnimation(.easeOut(duration: DesignTokens.Motion.durationBase))` on `onAppear`.
Check `UIAccessibility.isReduceMotionEnabled` before animating; if true, render the pre-
credited fill instantly. Each step segment carries a label below it using the named credit key
resolved to a localized string.

**Flutter.** `AnimatedContainer` or `TweenAnimationBuilder` for fill segments. Wrap inside
`MediaQuery.of(context).disableAnimations` check; when true, use `duration: Duration.zero`.

**React Native (Reanimated / Moti).** `Moti's useAnimationState` to drive fill width from
0 → `pre_fill_pct` on mount. Guard with `useReducedMotion()`.

**Web (motion/react).** `motion.div` with `transition={{ duration: var(--motion-base), ease: 'easeOut' }}`. Use `useReducedMotion()` from motion/react; when true, set `animate={{ width: pre_fill_pct + '%' }}` without a transition. Credit labels in a `<ul>` with `role="list"` and `aria-label="Your head-start steps"`.

Token references: `--motion-fast` (~150 ms) for step-by-step user-progress fill; `--motion-base` (~250 ms) for the initial pre-credit fill on mount; `--motion-slow` (~400 ms) for the completion pulse animation. Completion fill-and-pulse uses a spring (stiffness 200, damping 20) on mobile and `motion.div whileInView={{ scale: [1, 1.03, 1] }}` on web.

### Bright Line / Dark Line / Guardrail

**Bright line.** Pre-credit only real contributions the user has already made (setup actions,
answered questions, granted permissions, connected data sources) that the product actually uses
to personalize or configure the experience. The progress label and completion rate must be
truthful representations of work done and work remaining.

**Dark line.** Fabricating pre-credited steps that correspond to no real user action or product
operation, in order to manufacture completion anxiety and pressure the user to finish onboarding,
reach the paywall, or stay subscribed.

**Guardrail.** Before ship: open `TECH_SPEC.md` and verify that every pre-credited step has a
documented one-to-one mapping to a real product operation. Count the mapped steps. The ratio
of mapped-to-total credited steps must be 100% — unlike the Perceived Effort Delay Card's 50%
threshold, the Endowed Progress Card represents completed work (past tense), so every credit
must be real. Record the step-to-operation map in `TECH_SPEC.md` and attest compliance in
`PRODUCTION_READINESS.md` before any build is marked experience-card-ready. Run
`npm run check:emotional-design -- --root .` to verify the attestation block exists.

### Pairs With

- Commitment Card — the user's stated goal becomes the first pre-credited step ("Goal set:
  feel confident before your presentation"), anchoring the endowment in the user's own words
- Perceived Effort Delay Card — the effort display in plan generation can be the final step
  that completes the endowed progress bar
- Intent Mirroring Card — the "named head-start" summary can double as an intent mirror in a
  single screen, as long as the content sources only from user-provided fields
- Variable Reward Card — the completion animation when the progress bar fills can transition
  directly into the variable reward anticipation window

### 11-Star Level

**6-star (Better than expected).** Onboarding answers automatically count as completed steps;
the user arrives at the product's first real screen already mid-journey, not at a blank start.
Minimum correct implementation.

**7-star (Way beyond).** The system names what was already earned in the user's own language
("You set a goal to run 3x per week — that's step 1, done"), making the head-start feel
personally curated rather than automatically applied. The named variant produces the "made for
me" recognition that maps to 7-star in the eleven-star ladder.

---

## Peak-End Card

**One-liner.** Engineer one unforgettable in-session peak and a strong close; the remembering
self makes every re-engagement decision based on those two moments, not the average.

**Emotional beat.** Elation-then-completeness — the user experiences one moment of genuine
surprise or delight, then the session closes with a micro-celebration that confirms they
accomplished something real.

### Psychology + Canonical Research

Kahneman and Fredrickson (1993, _Psychological Science_) established that the remembered
utility of an experience is determined almost entirely by its peak affect and its end affect —
not by duration, not by the average valence across the session. The implication for consumer
mobile is stark: a session that is mediocre for five minutes and excellent for thirty seconds
is remembered as a good session. A session that is good for five minutes but ends neutrally is
remembered as a mediocre session.

The remembering self — Kahneman's term for the narrative-constructing self that makes all
future decisions about whether to return, subscribe, or recommend — is not the same as the
experiencing self. Designing for the experiencing self (reducing average friction) is necessary
but insufficient; designing for the remembering self requires deliberately engineering where
the peak falls and how the session closes.

Don Norman's emotional design tiers are directly relevant: the visceral tier (the first
sensory impression of a peak moment) fires immediately; the behavioral tier (interaction
fluency of the closing state) sustains it; and the reflective tier (the meaning the user
assigns after the fact) is what the remembering self encodes into memory and word-of-mouth. A
peak that reaches the reflective tier — "You saved 12 minutes this week; that's time back with
your family" — creates the kind of emotional memory that drives retention and organic sharing.

| Source | Finding | Confidence |
|---|---|---|
| Kahneman & Fredrickson, _Psychological Science_ (1993) | Remembered utility of an experience is dominated by the peak affect and the end affect, not by duration or average valence. | solid |
| Kahneman, _Thinking, Fast and Slow_ (2011) | The experiencing self and the remembering self are dissociated; the remembering self makes all future behavioral decisions based on peak-end encoding. | solid |
| Norman, _Emotional Design_ (2004) | Three tiers of emotional design — visceral, behavioral, reflective — each contribute to peak moments. Reflective-level design creates lasting emotional memory. | solid |
| Fredrickson, _American Psychologist_ (2001); _Review of General Psychology_ (1998) — broaden-and-build | Positive emotions broaden thought-action repertoires. Applying this to peak design-moment value expansion is an extrapolation. | attribution-uncertain: closest basis Fredrickson 2001 |
| Csikszentmihalyi, flow states | Flow states produce the most intense positive peaks and are disproportionately represented in retrospective reports of best experiences. | attribution-uncertain |

### Mechanism Steps

1. Identify the single highest-value result moment in the core loop — the moment the user
   first sees their personalized output, progress milestone, or earned insight. This is the
   engineered peak candidate.
2. Personalize the peak to the user's actual result. Reference the user's own data, goal, or
   commitment (from the Commitment Card) in the peak reveal copy and visual. Generic confetti
   is visceral-tier only; personalized result copy with motion reaches the reflective tier.
3. Time the peak correctly: it must occur before or at the paywall / primary CTA, never after.
4. Engineer the session close as a second deliberate moment — not a neutral dismiss. A close-
   state micro-celebration, summary card, or progress stamp confirms the session was complete
   and worthwhile. The close should feel like a period at the end of a sentence, not a door
   slamming.
5. Control the emotional valley before the peak: reduce friction, cognitive load, and ambiguity
   in the steps immediately preceding the peak so that contrast amplifies the emotional
   response.
6. Emit the PostHog peak and close events immediately at each trigger.

### Real App Examples

**Duolingo.** Lesson completion screen: animated celebration with XP earned, streak count, and
league-progress bar — all personalized to the user's current standing. The peak (animated
result reveal) is reflective-tier because it references the user's streak and league rank —
their identity. The close reinforces the session narrative before returning to home.

**Strava.** Activity summary screen after a run or ride: personal-record badges, relative
effort score, segment comparisons, and a shareable visual card. The peak is personalized (PRs
and segment ranks are unique to each athlete) and reaches the reflective tier — the user sees
their performance in the context of their history. The shareable card extends the peak into a
word-of-mouth mechanic, converting the remembering-self experience into organic growth.

### When to Use / When NOT to Use

**Use** on any B2C mobile app where the core loop produces a result the user cares about —
fitness, language learning, financial insights, creative output, health coaching, productivity.
Apply during: first-value reveal in onboarding (the peak before the paywall), recurring session
completion (the close that drives return), and milestone or streak moments.

**Do NOT apply** to: transactional confirmation screens (payment received, item added to cart);
error or failure recovery states where an upbeat close would feel tone-deaf; mid-task modals
where a forced celebration interrupts the user's actual task. One engineered peak per session
and one deliberate close per session is the ceiling for most apps.

### Producer Recipe

1. **Map the core-loop result moment:** identify exactly which screen shows the user their
   personalized output for the first time in a session. This is the peak candidate. It must
   occur before or at the paywall. If no such screen exists, the product has a peak design
   gap — open the `peak-end-peak-missing` failure card.
2. **Personalize the peak copy:** the reveal text must reference the user's actual result,
   name, goal, or commitment value. Pull from the Commitment Card value if available. "You
   translated 47 words in 4 minutes — your fastest session yet." is reflective-tier. "Great
   job!" is visceral-tier only.
3. **Animate the peak at the reflective tier:** use a spring reveal (`DesignTokens.Motion`
   expressive easing on mobile; motion/react with the tokenized `motion.expressive` value on
   web) for the result number or badge. Follow with a brief (`motion.brief`, ~150 ms) ambient
   glow or particle emission. Implement OS reduce-motion fallback: static result text with no
   animation, identical copy.
4. **Design the session close:** after the primary action (save, share, continue), the close
   screen or modal must include a single completion signal — a progress stamp, a streak
   confirmation, a summary card. Copy confirms the session was complete. Avoid filler
   ("Thanks for using [App]!") and avoid launching into the next CTA immediately.
5. **Validate contrast before the peak:** run Lens 3 (Emotional Journey) from the Six-Lens
   Design Review on the steps immediately preceding the peak. Reduce cognitive load and
   friction in the two steps before the peak.
6. **Emit PostHog events:** fire `peak_moment_reached` at the peak screen and
   `session_close_shown` at the close screen. Confirm both events appear in the PostHog
   activity view before build-ready status is claimed.
7. **Document in `PRODUCTION_READINESS.md`:** the peak screen name, the personalization field
   sourced (must be a user-provided value), the close screen copy, and the reduce-motion
   fallback state for each animation. Map both moments to the star-ladder level in
   `11_STAR_EXPERIENCE.md`.

### Auditor Signals

**Present**
- Core-loop result screen includes personalized copy referencing the user's actual result,
  goal, or data — not a generic congratulations string
- Peak moment is animated with a spring or expressive easing sourced from `DesignTokens.Motion`
- Session close screen contains a completion signal (streak count, progress stamp, summary
  card) rather than a neutral dismiss or immediate next-CTA
- PostHog events `peak_moment_reached` and `session_close_shown` are present in `ANALYTICS.md`
  and firing in the PostHog activity view
- The emotional peak in the Emotional Curve artifact (Lens 3) occurs at or before the paywall
  marker
- prefers-reduced-motion / OS reduce-motion fallback is documented in `TECH_SPEC.md` for both
  the peak animation and the close animation
- Peak copy references a field the user explicitly provided or a result the product computed
  from their data — traceable to a real source field in `PRODUCTION_READINESS.md`

**Missing**
- No peak moment is engineered — the result screen is a plain text confirmation with no
  personalization and no animation
- Session ends with a neutral dismiss ("Done") or an immediate re-engagement CTA with no
  completion signal
- Peak occurs after the paywall — the user buys before experiencing the moment that would
  justify the purchase
- PostHog events are absent or fire on the wrong trigger
- Emotional Curve artifact is missing or not rendered in `design.html`
- Close screen copy is identical across all users regardless of their result

**Misused**
- Confetti animation fires on every screen transition regardless of whether the user
  accomplished anything — scarcity is destroyed
- Peak copy uses manufactured urgency or framing not grounded in the user's actual result
  ("You almost lost your streak!") — crosses the bright line into anxiety exploitation
- Close screen launches a paywall immediately after the peak with no breathing room
- Peak animation has no reduce-motion fallback — vestibular distress risk for users with motion
  sensitivity — accessibility violation and failure-card trigger
- Peak timed to a generic milestone (every 5 app-opens) rather than an earned result

### Measurement Events

| Event | What it proves | Required properties |
|---|---|---|
| `peak_moment_reached` | User experienced the engineered peak in this session | `surface`, `personalization_field`, `result_value` (hashed), `session_id`, `time_since_session_start_ms`, `star_level` |
| `session_close_shown` | Deliberate session-close moment surfaced to the user | `surface`, `close_type` (streak_stamp/summary_card/progress_milestone/generic), `completion_signal_present: bool`, `session_duration_ms` |
| `session_close_shared` | Close state generated a share action | `surface`, `share_destination`, `result_value` |
| `peak_end_return_session` | User opened the app again within 24 hours of a session that fired `peak_moment_reached` | computed as a derived PostHog insight — measures the remembering-self re-engagement effect |

### Mobile Implementation + Reduced-Motion

**SwiftUI.** Wrap the peak result view in `.transition(.scale(scale: 0.85).combined(with: .opacity))` with a spring animation using `DesignTokens.Motion.expressive` spring (response ~0.45, dampingFraction ~0.7). For ambient glow, use a `.shadow` modifier animated with `withAnimation(.spring(response: 0.45, dampingFraction: 0.7))`. Detect reduce-motion with `@Environment(\.accessibilityReduceMotion)` and skip the spring/glow entirely if true — render result text statically. The close-state streak stamp uses `.transition(.opacity)` with `motion.brief` (~150 ms linear).

**Flutter.** `AnimatedContainer` with `Curves.elasticOut` for the peak reveal; `FadeTransition` for the close stamp. Check `MediaQuery.of(context).disableAnimations`.

**React Native.** `withSpring(value, { damping: 14, stiffness: 180 })` for the peak; fade `withTiming` for the close. Gate on `useReducedMotion()` from the react-native-reanimated API.

**Web (motion/react).** `motion.div` with `initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}` driven by the `--motion-spring-expressive` token. Close stamp uses a simple `opacity` transition with `--motion-duration-brief`. Wrap with `useReducedMotion()` from motion/react; when true, set `transition={{ duration: 0 }}`. Record both native and web fallback states in `TECH_SPEC.md`.

### Bright Line / Dark Line / Guardrail

**Bright line.** The peak moment celebrates the user's actual earned result — a computation,
milestone, or insight grounded in their real actions and data — and the session close confirms
their genuine accomplishment. Every personalization field referenced in peak or close copy must
trace to a field the user explicitly provided or a result the product computed from their real
activity.

**Dark line.** Manufacturing an emotional peak from fabricated or inflated results ("You're in
the top 5% of users!" on day one with no real comparison basis); using the peak as a warm-up
for an immediate hard-sell paywall on the same screen; triggering the peak animation on every
tap regardless of earned result; using the close state to inject anxiety ("Don't lose your
progress — subscribe now") rather than completing the session with satisfaction.

**Guardrail.** Before any peak-end implementation ships: (1) Confirm the peak copy references
only fields the user explicitly provided or results computed from their real session data — no
manufactured rankings, no fabricated statistics. Document the personalization field source in
`PRODUCTION_READINESS.md`. (2) Confirm the peak screen and the paywall/primary CTA are not on
the same screen view — there must be at least one navigation step or a deliberate breathing
pause between them. (3) Confirm the peak animation has a documented reduce-motion fallback in
`TECH_SPEC.md`. (4) Run `npm run check:emotional-design -- --root . --dark-pattern-audit` and
verify no peak-end dark-pattern flag is raised.

### Pairs With

- Commitment Card — peak copy that references the user's stated goal is only possible if the
  Commitment Card captured and stored that value
- Perceived Effort Delay Card — labor illusion that precedes the result reveal amplifies the
  peak by making the outcome feel earned
- Variable Reward Card — the anticipation window is the setup; the Peak-End Card governs the
  reveal and the close
- Intent Mirroring Card — a session close that mirrors back the user's stated intent operates
  at the reflective tier and is a peak-end close combined with an intent mirror

### 11-Star Level

**6-star (Better than expected).** Every session closes with a deliberate completion signal
rather than a neutral dismiss — the user reliably ends sessions feeling the product acknowledged
their effort.

**7-star (Way beyond).** The peak moment is personalized to the user's specific result, goal
language, and current milestone — it feels made for them. The peak at 7-star reaches Norman's
reflective tier: it makes the user think about their identity and progress, not just react to
a visual stimulus. The `11_STAR_EXPERIENCE.md` star-ladder entry for 6 and 7 must map to the
specific peak screen and close-state screen names in the product, not to a generic description.

---

## Streak and Loss Aversion Card

**One-liner.** Turn an earned run of days into a possession the user refuses to surrender —
driving daily return visits through the asymmetric pain of losing something already owned.

**Emotional beat.** Protective urgency — the user feels "I can't let this die; I've put too
much in." The streak is no longer an app metric; it is a personal object.

### Psychology + Canonical Research

Kahneman and Tversky's prospect theory (_Econometrica_, 1979) established that losses loom
approximately twice as large as equivalent gains in psychological weight — a three-day streak
lost hurts roughly twice as much as a three-day streak gained feels good. Thaler's endowment
effect (_Journal of Economic Behavior and Organization_, 1980) compounds this: people overvalue things they
already possess simply because they possess them. A streak at day 12 is not valued at twelve
repetitions of day-1 value; it is valued at whatever the user imagines would be lost by
breaking it — momentum, identity, social status, progress toward a goal.

The goal-gradient effect (Hull, 1932; confirmed for loyalty programs by Kivetz, Urminsky & Zheng,
_JMR_, 2006) adds a second lever: as the user approaches a milestone within the streak (day 7,
day 30, day 100), effort and visit frequency accelerate. The streak thus creates two
simultaneous motivational forces — loss aversion pulling the user back daily to protect the
accumulated asset, and goal-gradient urgency pulling them forward toward the next milestone.
The ethical boundary is sharp: when streak mechanics are decoupled from the user's actual goal
and serve only app-engagement metrics, the user is being exploited. Streak forgiveness
mechanics — shields, grace periods, streak freeze — are the required bright-line protection
that converts a potentially punitive pattern into a generous one.

| Source | Finding | Confidence |
|---|---|---|
| Kahneman & Tversky, _Econometrica_ (1979) | Losses loom approximately twice as large as equivalent gains. The pain of losing something outweighs the pleasure of gaining it by roughly 2:1. | solid |
| Thaler, _Journal of Economic Behavior and Organization_ (1980) | Endowment effect: people overvalue objects they already possess; ownership itself inflates perceived value. | solid |
| Hull (1932); Kivetz, Urminsky & Zheng, _JMR_ (2006) | Goal-gradient effect: effort and return frequency increase as a goal approaches. | solid |
| Empirical streak literature (Duolingo, Snapchat) | Industry-reported retention uplift from streak mechanics widely cited; peer-reviewed replication studies specific to mobile app streaks sparse as of 2025. | attribution-uncertain |
| Fogg, _Tiny Habits_ (2019) | A streak notification fires at high motivation (loss aversion) and high ability (habitual action) — placing the day's return in the highest-probability zone of B=MAP. | solid |
| Eyal, _Hooked_ (2014) | Each day added to a streak is stored value that increases the probability of a return trigger. The streak is the investment that loads the next trigger. | solid |

### Mechanism Steps

1. **Earn.** User completes the day's core action. The streak counter increments with a
   satisfying micro-animation.
2. **Possession signal.** The streak is made visually prominent on the home screen or
   dashboard — not buried in stats. The user must see the number without hunting for it. Visual
   weight is proportional to streak length: a 30-day streak looks materially different from a
   3-day streak.
3. **Anticipation window.** As the day's completion window approaches (typically evening), the
   app delivers a contextual reminder that names the streak length and the specific goal the
   streak is serving: "Day 14 of your Spanish goal — 10 minutes keeps it alive."
4. **Loss-aversion prime.** If the user has not yet completed the day's action by a threshold
   time, the streak display shifts to an endangered state — a visual cue (fading color,
   countdown, "At risk" label) that activates the endowment effect. The user is now protecting
   a possession, not pursuing a reward.
5. **Completion relief.** When the user completes the action, the streak counter animates back
   to full health. The relief of preservation is the emotional peak — not the achievement of
   a new number, but the relief of not losing the old one.
6. **Milestone amplification.** At key milestones (7, 14, 30, 60, 100 days), the app delivers
   an amplified celebration anchored to the user's stated goal: "You've practiced Spanish every
   day for 30 days — your stated goal was to speak before your trip in August."
7. **Streak forgiveness (required).** The app offers at least one grace-period mechanism — a
   streak shield, freeze, or recovery path — that the user can access without paying. Paid
   shield upgrades may exist, but the first protection must be earned or freely given.

### Real App Examples

**Duolingo.** The streak counter on the home screen is the most prominent metric. The "Streak
Society" and streak freeze features make forgiveness accessible. When a streak is at risk, the
owl mascot changes expression and a countdown appears. The streak notification names the streak
length and the language goal. Forgiveness mechanics (streak freeze, streak repair) are visible
and accessible, keeping the pattern on the bright side of the loss-aversion line.

**Snapchat.** Streak counters appear directly on friend tiles, making the streak a social
possession shared between two people. The fire emoji and number degrade toward expiry with a
countdown. Social streaks amplify the endowment effect by adding a second owner — breaking the
streak is letting down another person, activating social norm pressure on top of loss aversion.
The dark-line risk is high: Snapchat streaks are often criticized for creating anxiety detached
from the user's real social goal.

**Headspace / Calm.** Meditation streak on the home screen, with a calm visual indicator (flame
softens to a glow, not an alarm) when the streak approaches risk. Forgiveness is built in via
the "Rest Day" feature. The streak is framed around the user's wellness goal, not engagement.
Wellness apps face the highest ethical risk with streak mechanics — manufacturing anxiety in a
product sold to reduce it.

**Wordle / NYT Games.** The streak counter is a simple number, no animation pressure, no
notifications. Despite minimal UX investment, the streak drives daily return because the game
is one-a-day by design. Demonstrates that loss aversion operates even without aggressive UX.

### When to Use / When NOT to Use

**Use** when the app's core value is delivered through repeated daily or near-daily actions —
language learning, fitness, journaling, meditation, skill practice, habit tracking, nutrition
logging, or any product where a consistent return visit produces compounding real-world value.
The streak must be tied to the user's stated goal captured in the Commitment Card, not to
arbitrary app-engagement metrics.

**Do NOT use** when: (1) the core value is episodic or asynchronous and daily return is not
meaningful; (2) the product cannot deliver genuine daily value — a streak without value
delivery is pure extraction; (3) the user's emotional job is relaxation or stress relief and a
daily urgency prompt would contradict the product's therapeutic promise; (4) the user base
skews toward vulnerability populations (minors, people with anxiety disorders, compulsive
behavior histories); (5) the team cannot implement streak forgiveness mechanics in V1 — the
card must ship with forgiveness or not at all.

### Producer Recipe

1. **Anchor to the Commitment Card:** confirm the Commitment Card has fired and a named goal
   is stored. The streak must visually reference the goal ("Day 14 of your daily Spanish
   practice"). Without the commitment anchor, the streak is gamification noise.
2. **Define the daily action precisely:** one completable action per day, achievable in under
   10 minutes at minimum so ability is never the blocker. Confirm this maps to a real event in
   `ANALYTICS.md`.
3. **Build the streak state machine:** four states required — (a) healthy: completed today;
   (b) at-risk: not yet completed, within active window; (c) endangered: within 2 hours of
   expiry; (d) broken: window closed without completion. Each state must have a distinct visual
   representation using `DesignTokens.Motion`.
4. **Make the streak a visible possession:** place the streak counter at the primary visual
   anchor of the home/dashboard screen. Use a dedicated visual treatment (flame, ring, badge)
   that scales or changes character as the streak grows. A 100-day streak should look
   materially different from a 3-day streak. Use `DesignTokens.Motion` spring animation on the
   number increment.
5. **Design the at-risk notification:** a single contextual push notification naming the streak
   length and the user's goal. Template: "Day [N] of [goal] — [action] keeps your streak
   alive." No guilt language, no countdown panic. One notification per day maximum. Emit
   `streak_at_risk_notification_sent` with `streak_length`, `goal_id`, `notification_time`.
6. **Implement streak forgiveness (non-negotiable):** minimum viable forgiveness is a 24-hour
   grace period after a missed day, visible to the user as "Streak at risk — complete today to
   recover." At least one freely earned streak shield must be available before any paid shield
   is offered. The forgiveness mechanic must be discoverable without a support ticket. Emit
   `streak_forgiveness_applied` with `forgiveness_type` and `streak_length_preserved`.
7. **Build milestone celebrations:** at 7, 14, 30, 60, 100 days, trigger an amplified
   celebration moment with goal-progress reflection. Milestone copy must reference the user's
   committed goal, not the streak number alone. Emit `streak_milestone_reached` with
   `milestone_day`, `goal_id`, `share_initiated`.
8. **Emit all required PostHog events:** `streak_started`, `streak_incremented`,
   `streak_at_risk_shown`, `streak_at_risk_notification_sent`, `streak_broken`,
   `streak_forgiveness_applied`, `streak_milestone_reached`. Wire before build handoff. Record
   event names in `ANALYTICS.md` before implementation.
9. **Record bright-line compliance:** in `PRODUCTION_READINESS.md`, document (a) the goal
   field anchoring the streak, (b) the forgiveness mechanic available without payment, (c) the
   copy review confirming no guilt or manufactured anxiety language, (d) the Commitment Card
   cross-reference. The streak card is not build-ready until all four are recorded.

### Auditor Signals

**Present**
- Streak counter is visible on the primary home or dashboard screen without navigation
- Streak display references the user's stated goal or commitment, not only a number
- At least one freely accessible forgiveness mechanic exists (grace period, earned shield,
  rest day)
- Streak at-risk state has a distinct visual treatment from the healthy state
- Push notification copy names both the streak length and the user's goal
- Streak milestones trigger a celebration moment with goal-progress context
- `streak_incremented` and `streak_broken` PostHog events are present in the analytics
  activity view
- `streak_forgiveness_applied` event fires when forgiveness is used
- Reduced-motion fallback exists for streak animation states

**Missing**
- Streak counter is buried in a stats or profile screen
- Streak is tied to "days active in app" rather than a specific user-defined goal action
- No forgiveness mechanic exists — one missed day resets to zero with no recovery path
- Milestone celebrations absent or identical to regular daily completions
- Streak at-risk notification fires multiple times per day or uses guilt/countdown panic
  language
- PostHog events for `streak_incremented`, `streak_broken`, and `streak_forgiveness_applied`
  absent from `ANALYTICS.md`
- Streak length does not visually scale — a 100-day streak looks identical to a 3-day streak

**Misused**
- Streak shield is sold but not earned — no freely accessible forgiveness path exists
- Streak counter increments on any app open rather than core action completion
- At-risk notification fires before the user's active window has closed
- Streak milestone copy references only the streak number without connecting to the user's
  stated goal
- Streak repair purchase surfaced immediately after a break with no grace period — pure
  loss-aversion extraction
- Streak mechanics in a wellness/meditation app use high-urgency visual language (red
  countdown, alarm framing) that contradicts the product's anxiety-reduction promise
- Streak is visually designed to look like a social proof metric when no social element exists

### Measurement Events

| Event | What it proves | Required properties |
|---|---|---|
| `streak_started` | User initiated their first streak | baseline for cohort retention analysis |
| `streak_incremented` | Core action completed for the day and streak state advanced — primary daily retention signal | `streak_length`, `goal_id`, `action_type` |
| `streak_at_risk_shown` | At-risk UI state was surfaced in-app | `streak_length`, `hours_until_expiry` |
| `streak_at_risk_notification_sent` | Loss-aversion push notification was delivered | pairs with `streak_incremented` next-day to measure notification-driven recovery rate |
| `streak_broken` | User missed a day and streak reset | segment by `streak_length_at_break` to find the loss-value threshold |
| `streak_forgiveness_applied` | Forgiveness mechanic was used | `forgiveness_type`, `streak_length_preserved` — measures bright-line compliance |
| `streak_milestone_reached` | User hit a milestone day | `milestone_day`, `goal_id`, `share_initiated` |
| `streak_repair_offered` | Paid or earned streak repair was surfaced after a break | needed to detect if repair is offered before grace period expires = dark pattern |
| `streak_repair_accepted` | User accepted a repair offer | `repair_type`, `streak_length_at_break`, `days_since_break` |

### Mobile Implementation + Reduced-Motion

Streak state is a four-value enum (`healthy`, `atRisk`, `endangered`, `broken`) stored in app
state and persisted to the backend. Each state maps to a distinct visual token from
`DesignTokens.Motion`.

**Healthy.** Streak counter pulse spring on increment: duration `DesignTokens.Motion.brief`
~150 ms, spring response 0.4, damping 0.7.

**At-risk.** Flame or badge icon transitions to muted color via cross-fade (duration
`DesignTokens.Motion.moderate` ~300 ms); no animation loop — urgency is conveyed through color
and copy, not motion.

**Endangered.** Streak container softly breathes (opacity oscillates 1.0 to 0.7, loop,
duration `DesignTokens.Motion.moderate`, easing: `easeInOut`) — one pulse every 2 seconds
maximum.

**Broken.** Counter resets with a deflate spring (scale 1.0 to 0.85 to 1.0, duration
`DesignTokens.Motion.brief`).

**Milestone celebration.** Spring scale-up on the milestone badge (scale 0.8 to 1.15 to 1.0,
duration `DesignTokens.Motion.expressive` ~500 ms) followed by a particle or confetti burst
using the app's primary palette tokens.

**Web (motion/react).** Use tokenized `--motion-brief`, `--motion-moderate`,
`--motion-expressive` CSS variables. Drive the counter increment with a spring animation.
At-risk breathing uses `animate` with `repeat: Infinity, repeatType: 'mirror'`.

**Reduced-motion fallback (REQUIRED).** Wrap every animated streak state change in a
`UIAccessibility.isReduceMotionEnabled` check (SwiftUI), `MediaQuery.of(context).disableAnimations` (Flutter), `AccessibilityInfo.isReduceMotionEnabled` (React Native), or `prefers-reduced-motion` media query / `useReducedMotion()` hook (web). Fallback: static
color-only state transition with no animation. The streak counter increments instantly.
Document fallback behavior for each of the four states in `TECH_SPEC.md`.

### Bright Line / Dark Line / Guardrail

**Bright line.** The streak is anchored to the user's stated goal (captured by the Commitment
Card) and measures completion of a core action that delivers real value toward that goal.
Forgiveness mechanics are freely accessible — at minimum a grace period, without requiring
payment. Notification copy names the goal, not just the streak length. The streak serves the
user's retention of their habit, not the app's engagement metrics.

**Dark line.** The streak is anchored to any app open or passive action rather than the user's
goal-relevant core behavior. Forgiveness is exclusively paid. A repair purchase is surfaced
immediately after a break with no grace period. Notification copy uses guilt, countdown panic,
or manufactured shame ("You're failing your goal — don't break now"). In a wellness app, streak
mechanics produce the anxiety the product is sold to reduce.

**Guardrail.** Before the streak card ships, `PRODUCTION_READINESS.md` must contain all four
of: (1) the exact goal or commitment field (from the Commitment Card) that the streak action
is anchored to; (2) documentation of at least one freely accessible forgiveness mechanic
(grace period or earned shield) that does not require payment; (3) copy review attestation
confirming no guilt, countdown panic, or shame language appears in at-risk notifications or
broken-streak screens, verified against `BRAND.md §Voice`; (4) confirmation that the
`streak_incremented` event fires on core action completion, not on app open. If any of the
four entries is absent, the streak card is non-compliant and must not ship. Run:
`npm run check:emotional-design -- --root . --dark-pattern-audit`

### Pairs With

- Commitment Card — the streak must be anchored to a commitment captured there; without a
  named goal the streak is gamification noise
- Variable Reward Card — milestone celebrations can incorporate a variable reward reveal to
  amplify the milestone emotional peak
- Intent Mirroring Card — after a milestone is reached, a mirror moment ("You said you wanted
  to feel confident in Spanish — 30 days in, you're on track") converts a number celebration
  into a meaningful moment
- Perceived Effort Delay Card — a streak recovery or repair flow can show the user's
  accumulated effort before the repair mechanic is offered, reinforcing the endowment effect

### 11-Star Level

**5-star (Expected).** A visible streak counter that increments on daily core action completion
and resets on a missed day. Table stakes in any habit or learning app; users expect it.

**6-star (Better than expected).** Streak-repair and forgiveness options that feel generous
rather than monetization pressure — a visible grace period, an earned shield the user can bank,
a "rest day" that counts as maintenance. The generosity signals that the product is on the
user's side.

**7-star (Way beyond).** The streak is explicitly tied to the user's verbatim stated goal,
milestone celebrations reflect goal-progress context ("30 days in — your trip to Spain is in
60 days, and you've now completed 200 lessons"), and the streak dashboard shows a projection
of where their current pace takes them relative to their stated outcome. The user does not see
a streak; they see evidence that they are becoming who they said they wanted to become.

---

## Reciprocity Card

**One-liner.** Deliver unexpected value before asking for anything in return — a free
capability, a personalised insight, a gift — so the user feels genuinely obligated to give
back: an upgrade, a permission grant, a share.

**Emotional beat.** Surprised gratitude — "They gave me something I didn't ask for; I feel
like I owe them a chance."

### Psychology + Canonical Research

Reciprocity is the first and most universal principle of social influence: when someone does
something for us, we feel a deep psychological obligation to return the favour. The obligation
is strongest when the gift is uninvited, personalised, and meaningful — not a transactional
sample (Robert Cialdini, _Influence_, 1984). Uninvited gifts create stronger obligation than
requested ones because they cannot be reframed as a quid-pro-quo exchange; the receiver has
no script for refusing a gift they did not seek, and social norms around reciprocity are
cross-cultural and deeply pre-cognitive.

Nir Eyal's Hook Model (_Hooked_, 2014): the Investment phase creates reciprocity in reverse —
the user invests time and data, the app owes them a useful result. The Reciprocity Card runs
this logic forward: the app invests first, so the user feels the obligation to invest (upgrade,
share, grant permissions) next. BJ Fogg's Behavior Model (B=MAP, _Tiny Habits_, 2019):
motivation spikes briefly around unexpected positive events — the moment after receiving an
unexpected gift is a peak-motivation window for prompting an action that would otherwise
require significant persuasion. The prompt must fire inside this window, not minutes later.
If the gift is personalised to the user's stated goal (captured via the Commitment Card or
Intent Mirroring Card), the obligation intensifies further, because the user recognises the
product understood them — elevating the gift from a marketing tactic to a relational signal.

| Source | Finding | Confidence |
|---|---|---|
| Cialdini, _Influence_ (1984) | Reciprocity is the first and most universal principle of social influence; uninvited gifts create stronger obligation than requested ones. | solid |
| Eyal, _Hooked_ (2014) | The Hook Model's Investment phase creates reciprocity obligations — the app investing in the user first accelerates the user's willingness to invest back. | solid |
| Fogg, _Tiny Habits_ (2019); B=MAP | Motivation spikes briefly around unexpected positive events; the window immediately after a gift reveal is the highest-leverage moment for a prompt-to-action. | solid |
| Berridge, _Neuroscience & Biobehavioral Reviews_ (1996) | Wanting (dopamine) and liking (hedonic) are dissociable systems. Applying this to distinguish a genuine gift (wanting + liking) from a manipulative freebie (wanting alone) is a design-domain extrapolation, not a direct finding. | attribution-uncertain: Berridge 1996 framework applied to gift-vs-manipulation context |
| Buell & Norton, _Management Science_ (2011) | Users value outcomes more when they can observe effort being made on their behalf; a reciprocity gift that visibly represents work done for this specific user produces stronger obligation. | solid |
| Dai, Milkman & Riis, _Management Science_ (2014) — fresh-start effect | Delivering a reciprocity gift at a natural restart moment amplifies the obligatory response because the user is already primed for new commitments. | solid |

### Mechanism Steps

1. Identify the highest-value capability or insight the app can genuinely deliver before any
   payment or permission request — it must be complete and useful on its own, not a teaser.
2. Tie the gift to the user's stated goal or recent input (from the Commitment Card or Intent
   Mirroring Card): a generic freebie creates transactional obligation; a personalised gift
   creates relational obligation.
3. Deliver the gift without warning or announcement — no "here is your free trial" banner.
   The surprise is load-bearing; announced gifts are perceived as marketing, not generosity.
4. Let the value land: give the user 2–4 seconds to experience or read the gift before any
   CTA appears. The emotional peak must register before the ask.
5. Make the request immediately after the gift lands — inside the BJ Fogg motivation spike
   window. The request must be proportional: do not ask for payment inside the gift reveal;
   ask for a permission grant, a share, or a soft upgrade prompt.
6. Name the gift explicitly when making the ask: "We just gave you your full first plan —
   want to keep this momentum going?" The explicit reference closes the reciprocity loop.
7. Emit the named PostHog events and verify the gift was personalised (not generic) before
   recording the card as compliant.

### Real App Examples

**Duolingo.** The app completes a full lesson and awards the user an XP streak badge on the
first session — before any paywall mention — then surfaces the Plus upgrade prompt on the
celebration screen. The user already has something to protect. The completed lesson is a
genuine, self-contained gift; the streak badge personalises the obligation; the upgrade ask
follows immediately on the emotional peak, inside the BJ Fogg motivation window.

**Calm.** On first open, Calm plays a full, uninterrupted 10-minute Sleep Story — no account
required, no paywall — then asks for notification permission on the gratitude screen after the
story ends. The story is complete and premium-quality, not a teaser. The notification
permission ask is proportional and arrives at the emotional low-arousal moment after
relaxation, when compliance is highest (Fogg B=MAP).

**Spotify.** Discover Weekly delivers a personalised 30-track playlist every Monday before the
subscription ask — free-tier users receive a genuine, curated gift that feels bespoke, then
encounter the premium upgrade prompt when they try to skip a track or go offline. The playlist
is personalised to listening history (relational, not transactional), delivered without
announcement (surprise intact), and the upgrade ask is proportional and contextual.

**MyFitnessPal.** After completing food logging for one day, the app reveals a full macro and
micronutrient breakdown — a genuinely useful analysis — before any premium gate. The premium
ask surfaces only when the user tries to view the weekly trend. The day-one breakdown is
complete and personalised to what the user actually ate. The reciprocity obligation from the
free daily value makes the upgrade feel like a natural continuation.

### When to Use / When NOT to Use

**Use** at: (1) end of first session, before any paywall mention; (2) immediately after the
user's first personalised plan or result is revealed (pairs with Perceived Effort Delay Card);
(3) at the point where a permission is about to be requested — deliver value first, then ask;
(4) at re-engagement after a multi-day absence — deliver an insight the user missed while away,
then prompt return to the core loop.

**Do NOT use** when: the "gift" is actually a watered-down teaser that withholds the promised
value behind a paywall; the ask immediately follows the gift on the same screen with no
breathing room; the gift is generic and not tied to the user's stated goal; the user is in a
distressed state (failed payment, subscription lapse, error screen).

### Producer Recipe

1. **Identify the single highest-value capability** your app can deliver fully and completely
   without a subscription. If nothing qualifies, redesign the free tier before adding the
   reciprocity trigger; a teaser does not activate the norm.
2. **Personalise the gift** to the user's stated goal or recent input. Query the commitment
   value or onboarding answer captured by the Commitment Card. Render the gift copy with the
   user's own words.
3. **Deliver the gift without announcement or framing as a free trial.** No banner reading
   "Try premium free." The gift must appear as a natural product action. The surprise is
   load-bearing.
4. **Insert a 2–4 second no-CTA hold** after the gift is fully visible. Implement as an async
   delay on the CTA element mount, not as a blocking overlay.
5. **Surface a proportional, low-cost ask** immediately after the hold expires — inside the
   BJ Fogg motivation spike window. Proportional means: permission grant, soft upgrade prompt,
   or share action — not a hard paywall.
6. **Name the gift explicitly** in the ask copy: "We just built your complete plan — want to
   keep building on it?"
7. **Emit `reciprocity_gift_delivered`** immediately when the gift is shown. Emit
   `reciprocity_ask_shown` when the CTA appears. Emit `reciprocity_ask_accepted` or
   `reciprocity_ask_dismissed` on user action. Verify all three events appear in PostHog
   activity before calling the card implemented.
8. **Add the card attestation block** to `ONBOARDING.md` or `11_STAR_EXPERIENCE.md` with
   `bright_line`, `dark_line`, and `guardrail` fields filled. Run
   `npm run check:emotional-design -- --root .` and confirm zero errors.
9. **Document the gift in `PRODUCTION_READINESS.md`** with the completeness proof: confirm
   the gift is a self-contained, usable output — not a truncated sample. Record that no paywall
   appears on the same screen as the gift.

### Auditor Signals

**Present**
- A distinct, personalised, complete capability or insight is delivered before the first
  paywall or permission request in the onboarding flow
- The gift is tied to the user's stated goal or input — references their own words, goal, or
  data
- The gift appears without announcement as a marketing move — no "free trial" banner on the
  gift screen
- A visible CTA-free hold of 2–4 seconds exists between gift reveal and the ask CTA mounting
- The ask is proportional — a permission grant, soft upgrade, or share prompt — not a hard
  paywall on the same screen
- PostHog events `reciprocity_gift_delivered`, `reciprocity_ask_shown`, and
  `reciprocity_ask_accepted` / `reciprocity_ask_dismissed` are all present in `ANALYTICS.md`
  and firing in production
- `reciprocity_gift_is_complete: true` is set in the event properties

**Missing**
- The free capability is a watered-down teaser that withholds core value
- The gift is generic (not personalised to the user's stated goal or data)
- No breathing room between gift reveal and ask — the CTA appears simultaneously with the
  gift
- The ask is disproportionate — a full hard paywall immediately follows the gift on the same
  screen
- PostHog events are absent or only partially implemented
- No `ANALYTICS.md` entry for `reciprocity_gift_delivered` before implementation

**Misused**
- The "gift" is framed as a free trial with a countdown timer — converts the reciprocity norm
  into a scarcity dark pattern
- The reciprocity ask fires on a distressed screen (failed payment, subscription lapse, error
  state)
- The gift is announced as "FREE gift inside!" during onboarding — announcement destroys the
  surprise (Cialdini)
- The card fires more than once in a session — repeated "unexpected gifts" in a single session
  are perceived as manipulation
- The gift is used on the cancel or unsubscribe flow as a retention dark pattern

### Measurement Events

| Event | What it proves | Required properties |
|---|---|---|
| `reciprocity_gift_delivered` | The gift was shown | `surface`, `gift_type`, `gift_is_personalised: bool`, `gift_is_complete: bool`, `user_goal_referenced: bool`, `flow_id`, `step_id`, `variant_id`, `reduce_motion_active: bool` |
| `reciprocity_gift_engaged` | User interacted with the gift before the ask appeared | `gift_type`, `time_to_engage_ms`, `engagement_action` |
| `reciprocity_ask_shown` | The proportional ask was surfaced after the hold period | `ask_type`, `time_since_gift_ms`, `gift_type`, `surface`, `variant_id` |
| `reciprocity_ask_accepted` | User accepted the ask — primary conversion signal | `ask_type`, `time_to_accept_ms`, `gift_type`, `gift_is_personalised` |
| `reciprocity_ask_dismissed` | User dismissed the ask — counter-metric | `ask_type`, `time_to_dismiss_ms`, `gift_type`, `dismiss_reason` |
| `emotion_card_fired` | System-level card activation | `card_id: reciprocity` |
| `emotion_card_abandoned` | User exited during or immediately after the card | `rage_tap_detected: bool` |

### Mobile Implementation + Reduced-Motion

**Native mobile (SwiftUI / Flutter / React Native Reanimated).** The gift reveal uses a spring
entrance animation driven by `DesignTokens.Motion.expressive` easing (same token as the
Variable Reward Card reveal). The CTA hold is implemented as an async `Task.sleep` in SwiftUI
or `Future.delayed` in Flutter — a fixed 2–4 second delay before the CTA view mounts. The CTA
fades in with `DesignTokens.Motion.brief` (~150 ms). The full gift card enters with a vertical
spring (offset Y from +40 to 0, spring stiffness 300, damping 28 in SwiftUI `withSpring`).

**Reduced-motion fallback.** When `UIAccessibility.isReduceMotionEnabled` (iOS) or
`SemanticsService.disableAnimations` (Flutter) is true, suppress all spring and fade
animations; the gift card and CTA appear instantly at full opacity with no motion. Record
`reduce_motion_active: true` in all emitted events.

**Web (motion/react).** Read `state/theme.tokens.json` `motion.expressive` and `motion.brief`
tokens promoted to `--motion-expressive-*` CSS variables. Drive the gift card entrance with
`<motion.div initial={{opacity:0, y:40}} animate={{opacity:1, y:0}} transition={{type:'spring', stiffness:300, damping:28}}>`. CTA mount uses `<motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: var(--motion-brief-duration, 0.15s)}} style={{transitionDelay: '2.5s'}}>`. Implement `prefers-reduced-motion` via `useReducedMotion()` from motion/react.

### Bright Line / Dark Line / Guardrail

**Bright line.** The gift is a complete, self-contained, genuinely useful capability or insight
derived from the user's own inputs — delivered without announcement, before any ask — so the
user's obligation flows naturally from gratitude. The ask that follows is proportional
(permission, soft upgrade, or share) and occurs at least 2 seconds after the gift lands. The
user can dismiss the ask without losing the gift they already received.

**Dark line.** The Reciprocity Card crosses into manipulation when: (1) the "gift" withholds
the genuinely useful part behind a paywall — the user receives a teaser, not a complete value;
(2) the ask fires on a distressed screen; (3) the gift is deployed on the cancel or unsubscribe
flow as a retention tactic; (4) the gift is announced as a marketing tactic rather than
delivered as a surprise.

**Guardrail.** Before the card is called compliant, a deterministic check must pass: the
artifact doc must contain a Reciprocity Card attestation block with all required fields
including `gift_is_complete: true`, `ask_is_proportional: true`, `distress_state_excluded: true`,
and `surprise_preserved: true`. Run `npm run check:emotional-design -- --root .` — the
validator must find zero errors for the reciprocity card instance. Additionally:
`reciprocity_gift_delivered` with `gift_is_complete: false` appearing in PostHog production
events is an immediate blocker — the card is shipping a teaser and must be redesigned before
the experiment continues.

### Pairs With

- Commitment Card — captures the user's stated goal; the Reciprocity Card personalises the
  gift to that goal, making the obligation relational rather than transactional
- Perceived Effort Delay Card — makes the gift feel crafted and effortful; when both fire in
  sequence (visible effort → gift reveal → ask), the Labor Illusion amplifies the reciprocity
  obligation
- Intent Mirroring Card — confirms the user's intent before the ask; pairing after the
  reciprocity gift creates a three-step arc: gift → gratitude peak → mirror confirmation →
  ask
- Variable Reward Card — the Variable Reward Card creates anticipation before a reveal; the
  Reciprocity Card can be layered on top of the reveal moment — but the ask must be separated
  by at least one screen to avoid collapsing the emotional stack into a single extraction
  moment

### 11-Star Level

**6-star (Better than expected).** The free gift is complete and polished — it delivers the
full value promise, not a teaser. The user did not expect to receive this before paying.

**7-star (Way beyond).** The free gift is personally relevant to the user's exact stated goal
— it uses their own words, their own inputs, their own timeline — and it arrives as a genuine
surprise at the moment it is most useful. At 7-star, the user does not say "I got a free
thing"; they say "this product already knows what I need."

---

## Identity and Self-Expression Card

**One-liner.** When users author their own experience — naming a goal, choosing an avatar,
labeling a streak, customizing a theme — they conflate their identity with the product's
success, making abandonment feel like self-contradiction.

**Emotional beat.** Ownership-pride — "This is mine; it reflects who I am."

### Psychology + Canonical Research

Don Norman's three-tier emotional design model (_Emotional Design_, 2004) identifies the
reflective level as the deepest tier — the layer where self-image, personal narrative, and
identity are processed. Visceral (appearance) and behavioral (usability) tiers set the stage,
but only the reflective tier produces lasting loyalty. A product that enters this tier makes
the user feel that the object says something true about who they are: it becomes an extension
of the self, not a utility. Norman explicitly distinguishes reflective-level attachment from
mere satisfaction — it is pride, not pleasure.

Cialdini's commitment and consistency principle (_Influence_, 1984): once a person has
actively labeled themselves — "I am someone who runs before breakfast," "I am building my
savings" — they experience internal pressure to behave consistently with that self-label.
Alan Cooper's goal-directed design framework (_The Inmates Are Running the Asylum_, 1999):
design for the user's self-image goal — not just their instrumental goal — and the product
earns a place in identity rather than remaining a mere tool. Norton, Mochon, and Ariely's
IKEA Effect (_Journal of Consumer Psychology_, 2012): when a user authors or witnesses the
construction of their output, the perceived value of that output inflates.

| Source | Finding | Confidence |
|---|---|---|
| Norman, _Emotional Design_ (2004) | Reflective design level produces the deepest and most durable product loyalty; products that engage it become extensions of the self. | solid |
| Cialdini, _Influence_ (1984) | Commitment and consistency: once a person actively labels themselves, internal pressure to behave consistently with that label activates. | solid |
| Picard, _Affective Computing_ (1997) | Systems that recognize, interpret, and adapt to personal affect create significantly stronger emotional bonds and trust. | solid |
| Cooper, _The Inmates Are Running the Asylum_ (1999) | Goal-directed design: design for the user's self-image goal; products that target self-image goals earn deeper engagement. | solid |
| Norton, Mochon & Ariely, _Journal of Consumer Psychology_ (2012) | IKEA effect: people value outcomes they helped produce more than identical outcomes delivered to them. | solid |
| Kahneman & Tversky / Thaler (1979–1980) | Endowment effect: people value things more once they own or personalize them; losing a personalized artifact feels worse than never having it — raising switching cost proportionally to expressed identity investment. | solid |
| Attribution-uncertain: closest basis is Cialdini (1984) foot-in-the-door and self-perception research | Publicly visible or shared self-expression amplifies consistency pressure beyond private commitment alone. | attribution-uncertain |

### Mechanism Steps

1. **Identity Anchor.** Early in onboarding (before the paywall), present one low-friction
   identity choice: name a goal, choose a persona or archetype, select an avatar or color
   theme, or write a short self-statement. This is the authorship moment. The product accepts
   it as authored content, not a preference.
2. **Persistent Echo.** Every subsequent screen that is reasonably related references the
   identity anchor explicitly: plan headers use the user's goal name, push notifications
   address the persona, streak labels reflect the chosen archetype, empty states speak to the
   self-image. The product never lapses back to generic copy once the anchor is set.
3. **Visible Ownership Signals.** Surface the user's identity choices as visible artifacts:
   a named profile card, a custom theme that affects every screen, a goal badge displayed on
   completion screens, or an avatar that appears in milestone moments.
4. **Milestone Reflection.** At key achievement moments (day-7 streak, first goal met, plan
   completion), pause to reflect the identity anchor back: "You said you wanted to [goal]. You
   did it." Reflective-level moment, not a gamification reward.
5. **Shareability of Authorship.** Make the identity artifact shareable: a named goal card, a
   progress summary with the chosen theme, a streak milestone that displays the persona label.
   Sharing doubles the identity investment.
6. **Re-commitment Gate (optional, session restart).** On returning sessions where engagement
   has lapsed, offer a brief re-anchor: "You chose [goal]. Still the right direction?" Not
   guilt — a genuine check that creates a fresh commitment and activates the fresh-start effect.

### Real App Examples

**Duolingo.** Choosing a streak name and a custom league avatar; the streak counter and the
league leaderboard display the user's chosen identity token on every return visit, making
missing a day feel like abandoning a self-declared commitment. The identity anchor (streak
name, avatar) is publicly visible inside the league, creating Cialdini consistency pressure
reinforced by social proof.

**Nike Run Club.** Naming a run (a personal race, a route, a goal challenge) and receiving a
personalized achievement card with the user's name, photo frame, and goal language after
completion — shareable as a social card. The IKEA effect is triggered by co-authoring the
achievement: the user named the goal, ran it, and now receives a card that is theirs.

**Notion.** Creating and naming a personal workspace, choosing a cover image, setting a page
icon — the product visually becomes "yours" before you have entered a single piece of real
content. Visible ownership signals appear immediately at setup (Norman reflective tier: the
space looks like me). The endowment effect kicks in before any functional value is delivered.

**Strava.** The user names their training goal ("Sub-4 Marathon — Spring 2026"), which then
appears as a header on every weekly summary and feed card, referenced in auto-generated workout
context ("On track for your goal"). Cialdini consistency: the named public goal creates
commitment. Cooper's self-image goal design: the product targets who the user wants to be.

### When to Use / When NOT to Use

**Use** when the product has any of the following: a personalized plan, a goal declaration, a
profile name or avatar, a selectable theme or persona, a named streak, a community or league
membership, a shared achievement surface, or any repeating loop where the user's stated
identity is the frame for progress.

**Do NOT use** when: the product collects identity information for algorithmic targeting
without surfacing it back to the user as authored content; there is no mechanism to echo the
identity anchor back in subsequent screens; during high-stakes purchase flows where identity
pressure could coerce a transaction; or when the product cannot store and surface the identity
information reliably.

### Producer Recipe

1. **Map the identity anchor point.** Identify the single strongest identity declaration
   available in your product — the one that best answers "who does the user want to become by
   using this?" Do not collect more than one anchor in onboarding unless they serve distinct
   product surfaces.
2. **Implement the anchor screen in onboarding.** Place it after the value-promise step but
   before the paywall. One tap or a short text field, feel like authorship not a settings form.
   Log `identity_anchor_set` with `anchor_type`, `anchor_value`, `flow_id`, `step_id`.
3. **Persist the anchor everywhere it can be echoed.** Store as a user property in PostHog
   (`identity_anchor_type`, `identity_anchor_value`), in your backend user record, and in your
   push/email personalization layer.
4. **Build echo surfaces.** Audit every repeating screen in the core loop and identify where
   the anchor can appear as authored copy. Plan summary headers, streak labels, milestone
   messages, coach prompts, and push notifications are all echo surfaces. Implement echo on at
   least three distinct surfaces before calling the card active.
5. **Create a visible ownership artifact.** Produce at least one visual element the user can
   see as "theirs": a named plan card, a color-themed screen, a goal badge, a profile tile.
6. **Add a milestone reflection moment.** At the first significant achievement (day-7, first
   goal milestone, plan completion), show a full-screen reflective moment that names the
   anchor: "You said you wanted [anchor_value]. Here is what you did." Log
   `identity_milestone_reflected` with `anchor_type`, `anchor_value`, `milestone_id`.
7. **Implement the shareability surface.** Make the ownership artifact shareable as a card or
   image. Include the user's goal name, their theme/avatar, and their progress stat. Log
   `identity_artifact_shared` with `share_surface`, `anchor_type`.
8. **Implement the re-commitment gate on lapse.** When a user returns after a configurable
   inactivity gap (e.g., 3+ days), show a single-screen re-anchor: their original goal, a
   brief "still on track?" prompt, and a one-tap re-commit. Log
   `identity_recommitment_shown` and `identity_recommitment_confirmed`. Do not guilt-trip.
9. **Implement the reduced-motion fallback.** Every animated reveal of an ownership artifact
   must degrade to an opacity-only or instant change when prefers-reduced-motion / OS
   reduce-motion is active. Document the fallback in `TECH_SPEC.md`.
10. **Verify editability.** The identity anchor must be editable from a settings or profile
    screen with no friction. Run on device before calling the card launch-ready and record
    evidence in `PRODUCTION_READINESS.md`.

### Auditor Signals

**Present**
- Onboarding contains a visible identity-declaration step (goal name, persona, avatar, or
  theme selection) placed before the paywall
- The declared identity anchor appears in at least three distinct in-app surfaces after
  onboarding
- A visible ownership artifact exists — something the user can identify as "theirs"
- Milestone reflection moments use the user's own anchor language, not generic achievement
  copy
- The identity anchor is editable from settings or profile without a support ticket
- `identity_anchor_set` and `identity_anchor_echoed` PostHog events fire with expected
  properties
- Shareability surface exists for at least one ownership artifact
- Reduced-motion fallback is implemented for animated ownership reveals

**Missing**
- Onboarding collects a name or avatar but never echoes it in any subsequent screen
- No visible ownership artifact exists; the product looks and behaves identically for all
  users after onboarding
- Milestone messages are generic ("Great job!") rather than anchored to the user's declared
  goal or persona
- The identity anchor is stored but not persisted to PostHog person properties or backend
  profile
- No re-commitment gate on lapse
- `identity_anchor_set` event missing from `ANALYTICS.md` or fires without `anchor_type`
  and `anchor_value` properties

**Misused**
- Identity pressure applied immediately before or on a paywall screen — "You chose [goal].
  Don't let yourself down — upgrade now." Cialdini consistency exploit against the user's
  interest. Dark pattern, compliance veto.
- Identity anchor fabricated or suggested ("Most users like you choose Achiever") rather than
  freely chosen
- Avatar or theme customization placed behind a paywall with no free equivalent — makes
  identity expression a purchase
- Product deletes or resets the identity anchor after a subscription lapse as a retention
  tactic ("Your goal was removed. Resubscribe to restore it.") — endowment-effect hostage
  dark pattern
- Re-commitment gate uses guilt language ("Remember why you started?", "Don't give up now")
  rather than neutral fresh-start language

### Measurement Events

| Event | What it proves | Required properties |
|---|---|---|
| `identity_anchor_set` | User completed the identity-declaration step | `anchor_type`, `anchor_value`, `flow_id`, `step_id` |
| `identity_anchor_echoed` | The declared anchor was surfaced back to the user on a named screen | `surface`, `anchor_type`, `anchor_value`, `echo_position` |
| `identity_milestone_reflected` | A milestone reflection moment fired and named the user's anchor | `anchor_type`, `anchor_value`, `milestone_id`, `milestone_label` |
| `identity_artifact_shared` | User shared an ownership artifact | `share_surface`, `anchor_type`, `anchor_value` |
| `identity_recommitment_shown` | Re-commitment gate displayed to a lapsed user | `anchor_type`, `anchor_value`, `days_inactive`, `trigger_surface` |
| `identity_recommitment_confirmed` | Lapsed user tapped re-commit | `anchor_type`, `anchor_value`, `days_inactive` |
| `identity_anchor_edited` | User updated their identity anchor from settings | `anchor_type`, `old_value_hash`, `new_value_hash`, `edit_surface` |

### Mobile Implementation + Reduced-Motion

**SwiftUI.** Render the identity anchor capture screen as a full-bleed card stack. On
selection, use a spring animation referencing `DesignTokens.Motion.expressive` (scale from
0.95 to 1.0, opacity 0 to 1, duration `DesignTokens.Motion.durationBase` ~300 ms) to confirm
authorship. Apply the chosen theme token immediately to the navigation bar and background so
the user sees the ownership effect in real time. For the milestone reflection full-screen, use
a slow fade-in with `DesignTokens.Motion.deliberate` (~600 ms) plus a one-line text reveal
with a stagger. Reduced-motion fallback: check `UIAccessibility.isReduceMotionEnabled` and
fall back to `.easeIn(duration: 0.1)` opacity only, no scale or stagger.

**Flutter.** `AnimatedContainer` or `Hero` transition for avatar/persona card selection. Check
`MediaQuery.of(context).disableAnimations` for reduced-motion.

**React Native (Reanimated).** `useSharedValue + withSpring` for card selection. Respect
`AccessibilityInfo.isReduceMotionEnabled()`.

**Web (motion/react).** Drive durations from `--motion-duration-base` and
`--motion-easing-expressive` CSS variables. Use `useReducedMotion()` hook; when true, set
`transition={{ duration: 0 }}` on all identity-reveal animations. The ownership artifact
share card should use `AnimatePresence` for mount/unmount.

### Bright Line / Dark Line / Guardrail

**Bright line.** The identity anchor is collected, stored, echoed, and reflected back for the
sole purpose of helping the user pursue the goal or self-image they explicitly declared. Every
surface that uses the anchor makes the user more likely to achieve what they said they wanted.

**Dark line.** Using the identity anchor as a coercion lever: placing it immediately before a
paywall CTA with copy that ties abandonment to self-betrayal; holding the ownership artifact
hostage behind a subscription; manufacturing the anchor through suggested identities with false
social proof; using guilt-loaded language in the re-commitment gate. All are compliance vetoes.

**Guardrail.** Before shipping any screen or copy that uses the identity anchor, answer all of
the following; a single "no" blocks ship:
1. Is the identity anchor freely chosen by the user with no suggested default that benefits
   the product's conversion rate?
2. Is the anchor editable from a settings or profile screen without friction or a support
   ticket? (Verify on device.)
3. Does the anchor echo appear on surfaces that genuinely serve the user's goal — not on the
   paywall or a purchase CTA?
4. Does the re-commitment gate use neutral fresh-start language, not guilt or loss framing?
5. Is the ownership artifact available to free-tier users (at least a baseline version) before
   any purchase?
6. Is the anchor's content sourced exclusively from fields the user explicitly provided —
   never inferred, manufactured, or suggested?
7. Are all animated reveals guarded by a prefers-reduced-motion / OS reduce-motion check with
   a documented fallback in `TECH_SPEC.md`?
8. Are `identity_anchor_set`, `identity_anchor_echoed`, and `identity_milestone_reflected`
   events present in `ANALYTICS.md` with required properties and verified in PostHog activity
   view?

Record pass/fail for each item in `PRODUCTION_READINESS.md`. Run
`npm run check:emotional-design -- --root .`.

### Pairs With

- Commitment Card — the Commitment Card captures the behavioral pledge; the Identity Card
  captures the self-image anchor. They are complementary: the commitment drives action, the
  identity creates the self-label that makes breaking the commitment feel wrong.
- Intent Mirroring Card — the mirror reflects the user's stated intent back at a specific
  moment; the Identity Card operates at the persistent-artifact level. Pair them so the mirror
  uses the identity anchor's language.
- Variable Reward Card — when the identity anchor is a goal, each session's result is a
  variable reward relative to that named goal. The anchor makes the variable outcome personally
  meaningful.
- `references/viral-growth-loops.md` — the ownership artifact (named goal card, achievement
  summary with theme) is the highest-trust shareable unit for organic growth.

### 11-Star Level

**7-star (Way beyond).** Every screen feels authored by the user, not served to them: their
goal name is in the header, their chosen theme is in the palette, their persona label is in
the coach's voice. The product has no generic fallback copy once the identity anchor is set.

**10-star (Impossible concierge).** A personal coach who had read the user's journal for a year
would know not just their goal but the exact framing, the setbacks they fear, and the milestone
language that resonates with their self-image. The 7-star V1 scalable slice is: named goal
anchor + three echo surfaces + one milestone reflection moment. The 10-star inspiration drives
the copy depth and personalization ambition for V2.

---

## Fresh Start Card

**One-liner.** Surface time-based reset opportunities — new year, new month, Monday, birthday,
post-lapse — so re-engagement feels like a new chapter rather than a failed attempt.

**Emotional beat.** Clean-slate optimism — "That was before; this is a new chapter."

### Psychology + Canonical Research

Hengchen Dai, Katherine Milkman, and Jason Riis (_Management Science_, 2014) documented the
fresh-start effect: aspirational behaviors — gym attendance, diet searches, goal-setting —
spike measurably at temporal landmarks such as the new year, a new week, a birthday, and the
start of a semester. The mechanism is mental account separation: users psychologically close
the ledger on past failures at these boundaries and open a clean account for future
performance.

Gollwitzer's work on implementation intentions (_American Psychologist_, 1999): "when-then"
plans produce dramatically higher follow-through than vague intentions. Fresh-start moments are
the natural if-then anchor: the temporal landmark supplies the "when" automatically, which
means the product only needs to supply a frictionless "then." Delivering a concrete,
pre-personalized re-entry action at the moment the mental account resets converts the
peak-aspiration moment into a behavioral contract before the motivation dissipates.

| Source | Finding | Confidence |
|---|---|---|
| Dai, Milkman & Riis, _Management Science_ (2014) | Aspirational behaviors spike measurably at temporal landmarks (new year, new week, birthdays, semester starts) because people mentally separate past failures from future performance at these boundaries. | solid |
| Gollwitzer, _American Psychologist_ (1999) | When-then plans significantly increase follow-through vs. stated intentions alone; fresh-start moments supply the "when" automatically. | solid |
| Kahneman & Fredrickson, _Psychological Science_ (1993) — peak-end rule | A well-designed re-entry moment at a temporal landmark can become the emotional peak the user associates with the product, overwriting the memory of the lapse that preceded it. | solid |
| Cialdini, _Influence_ (1984) | A fresh-start prompt that captures a re-commitment ("I'm starting again") activates consistency pressure for the session that follows. | solid |
| Fogg, _Tiny Habits_ (2019) | Temporal landmarks supply peak motivation; a fresh-start prompt converts motivation into action before it dissipates. Attribution-uncertain: specific mobile re-engagement studies using Fogg framing post-2019 exist but exact authors not confirmed. | attribution-uncertain |

### Mechanism Steps

1. Detect the temporal landmark: new year, new month, new week (Monday), user birthday,
   N-day lapse (configurable threshold, typically 3–14 days), post-payment failure recovery,
   or app version first-open after a dormant period.
2. Personalise the frame using the user's stored commitment (from the Commitment Card): surface
   their own stated goal, not a generic category message. "You wanted to run 3x a week. New
   week starts today."
3. Present a low-friction re-entry action — a single tap or swipe — that begins the first core
   action of the new chapter. Do NOT present a summary of missed days, a streak reset count,
   or a lost-progress screen first.
4. Optionally anchor with a new implementation intention: offer a "when-then" micro-plan for
   the current cycle ("Tap to set your first session for this week") that takes under 10
   seconds to complete.
5. Emit the re-entry event and update streak/progress state from this moment forward, treating
   it as Day 1 of a new cycle.
6. Deliver a light acknowledgment of the reset at the end of the first completed action — not
   at the start — to reinforce that the chapter is now open, not just announced.

### Real App Examples

**Duolingo.** Monday morning push: "New week, fresh start. Your streak is protected — let's
make this one count." The app does not lead with the number of missed days; it leads with the
temporal landmark and a single CTA that begins a lesson immediately. The streak-shield mechanic
reduces the punishment signal, leaving only the aspiration signal active.

**Headspace / Calm (meditation category).** New Year and first-of-month re-engagement push:
"January 1. A fresh start. Your [pack name] is still here, exactly where you left it." The
app re-surfaces the user's last chosen content as the re-entry point. Surfacing the specific
content the user chose previously activates the Commitment Card echo — combined with fresh-
start aspiration and Gollwitzer implementation-intention specificity.

**Noom / MyFitnessPal.** Post-lapse re-engagement at 7 days of no logging: "No streak
pressure. Just today. What did you have for breakfast?" — a single minimal-friction logging
prompt that does not reference the gap. The lapse itself is a personal temporal landmark.
Removing the gap-shame and offering a single concrete action applies Fogg B=MAP.

**Fabulous.** Birthday in-app screen: full-screen illustrated moment, user's name, a message
framing the new year of their life as a fresh chapter, a single CTA to set one habit for this
year — no data-entry form, no paywall. The birthday is the strongest personal temporal landmark
in Dai et al.'s data.

### When to Use / When NOT to Use

**Use** in any consumer mobile app where the user's core value loop requires repeated behavior
over time — health, fitness, learning, meditation, journaling, finance habits, diet, language,
productivity. Most potent at: (1) post-lapse re-engagement flows, (2) Monday and first-of-month
push/in-app notifications, (3) new year in-app experiences, (4) birthday personalization
moments, (5) post-payment-failure recovery flows.

**Do NOT use** on every session open — overuse destroys the specialness of the temporal
landmark; on transactional surfaces where no behavioral loop exists; as a disguise for a
paywall (the fresh-start moment must never be the screen immediately before a hard paywall
CTA); or to manufacture false urgency by inventing a landmark that does not correspond to a
real calendar or personal event.

### Producer Recipe

1. **Map the temporal landmarks** available for your app's user base: (a) universal calendar
   events the product can detect; (b) personal user events the product already knows (sign-up
   anniversary, birthday from profile, subscription renewal date, return after N-day lapse —
   set your lapse threshold in `ONBOARDING.md` and `TECH_SPEC.md`); (c) personal achievement
   thresholds that create a "new level" sense.
2. **Pull the user's stored `commitment_value` and `commitment_type`** from the Commitment
   Card data layer. The fresh-start message MUST use the user's own language. If commitment
   data is absent, surface the user's most recently completed core action as the re-entry
   anchor instead.
3. **Design the re-entry screen or notification** with this constraint: no mention of the gap,
   missed sessions, broken streak, or lost progress on the initial screen. Record this copy
   rule in `BRAND.md` or `design.md §Copy Rules`.
4. **Implement a single, immediate re-entry action:** a button that begins the first core
   action of the new cycle — not a settings screen, not a recap, not a paywall.
5. **Wire the push notification or in-app trigger:** for calendar landmarks, use a scheduled
   notification at the user's historically active time-of-day (derived from
   `session_start_time` distribution in PostHog). For lapse landmarks, fire at the same time-
   of-day the user was historically active. If time-of-day data is unavailable, default to
   mid-morning (9–10 AM local).
6. **Instrument PostHog events:** `fresh_start_triggered`, `fresh_start_cta_tapped`,
   `fresh_start_core_action_completed`, `fresh_start_dismissed`. Add to `ANALYTICS.md` before
   implementation. Set person properties: `last_fresh_start_landmark_type`,
   `last_fresh_start_at`, `fresh_start_activations_total`.
7. **Implement reduced-motion fallback:** fresh-start screen typically uses a full-screen
   animated transition (spring or fade, `DesignTokens.Motion.durationSlow` on native;
   motion/react `AnimatePresence` on web). Fallback: instant opacity transition — no spring,
   no transform. Document in `TECH_SPEC.md`.
8. **Verify the bright-line compliance check** before ship: confirm the fresh-start screen is
   not followed by a paywall in the same screen, the user can dismiss freely, and no language
   implies the user "lost" anything during the gap. Record attestation in
   `PRODUCTION_READINESS.md`.

### Auditor Signals

**Present**
- Push notification copy or in-app screen opens with a temporal-landmark frame ("New week",
  "New month", "New year", "New chapter") rather than a gap-shame frame ("You missed X days",
  "Your streak is broken")
- Re-entry message references the user's stored commitment or last core action
- A single, immediate, low-friction CTA begins the core action without a form or settings
  step in between
- `fresh_start_triggered` event fires in PostHog with `landmark_type`, `days_since_last_session`,
  and `commitment_type` properties
- Product does not mention the gap duration, missed-session count, or streak-break count on
  the initial fresh-start screen
- Landmark detection covers at least two types: calendar and lapse-based
- Notification delivery time is personalized to the user's historical active hour
- Reduced-motion fallback exists for the fresh-start screen transition

**Missing**
- No post-lapse re-engagement flow: after N days of inactivity the app sends a generic "we
  miss you" notification with no temporal framing and no direct re-entry action
- Fresh-start message uses generic copy unconnected to the user's stored commitment
- The fresh-start screen requires multiple taps or a settings/profile update before the user
  can begin their first action
- `fresh_start_triggered` event absent from `ANALYTICS.md` and PostHog
- No calendar landmark detection
- No birthday or anniversary landmark implemented despite the product having the user's
  birthdate or sign-up date
- Lapse threshold hard-coded and never tuned

**Misused**
- Fresh-start screen opens directly into a paywall or subscription offer — weaponizing the
  peak-aspiration moment for extraction. Primary dark pattern, compliance veto.
- Gap duration or missed-session count is displayed prominently on the fresh-start screen —
  converts the clean-slate frame into a shame frame
- Card fires on every session open — every day — destroying temporal-landmark scarcity
- A manufactured temporal landmark is used: a countdown timer with no real calendar basis
- Fresh-start frame used on a cancel or unsubscribe flow as retention friction
- Commitment echoed in the fresh-start message is stale or inaccurate (12+ months old)

### Measurement Events

| Event | What it proves | Required properties |
|---|---|---|
| `fresh_start_triggered` | Product detected a temporal or lapse landmark and surfaced a fresh-start moment | `landmark_type`, `days_since_last_session`, `commitment_type`, `has_stored_commitment: bool`, `notification_channel`, `surface`, `variant_id` |
| `fresh_start_cta_tapped` | User accepted the clean-slate frame and initiated re-entry — primary conversion event | `landmark_type`, `days_since_last_session`, `commitment_type`, `time_to_tap_ms` |
| `fresh_start_core_action_completed` | User completed their first core action in the new chapter | `landmark_type`, `days_since_last_session`, `core_action_type`, `session_duration_ms`, `is_first_action_in_new_cycle: bool` |
| `fresh_start_dismissed` | User saw the fresh-start screen and chose not to engage — counter-metric | `landmark_type`, `dismiss_reason`, `time_to_dismiss_ms` |
| `fresh_start_implementation_intention_set` | User completed the optional when-then micro-plan | `landmark_type`, `intention_type`, `commitment_type` |

### Mobile Implementation + Reduced-Motion

**Native mobile.** Full-bleed, low-information layout — landmark label at top, one line of
personalized commitment echo, and a single primary action button. Animate entry with a spring
transition reading `DesignTokens.Motion.durationSlow` (~400 ms) and
`DesignTokens.Motion.easingExpressive`; the screen fades in from slight scale-up (1.04 → 1.0)
to signal a meaningful arrival. Exit on CTA tap uses `DesignTokens.Motion.durationBase`
(~250 ms) with a dissolve.

**iOS.** Implement prefers-reduced-motion by checking `UIAccessibility.isReduceMotionEnabled`;
fallback is an instant opacity transition with no scale transform.

**Flutter.** Check `MediaQuery.of(context).disableAnimations`.

**React Native.** Use `AccessibilityInfo.isReduceMotionEnabled()` from the react-native
accessibility API.

**Push notification.** Use the user's historically active hour from PostHog session data.
On iOS, schedule via `UNUserNotificationCenter` with a `UNCalendarNotificationTrigger` for
predictable landmarks; use a server-side scheduled push (Resend + backend job or RevenueCat
push) for lapse-based triggers. Notification copy must fit in 65 characters for the title and
110 characters for the body. Include a deep link that opens directly to the fresh-start screen
via a Universal Link / App Link.

**Web (motion/react).** Use `AnimatePresence` for the fresh-start section entry. Duration
values must read from promoted `--motion-slow` CSS variable (from `state/theme.tokens.json`).
Add `@media (prefers-reduced-motion: reduce) { transition: none; animation: none; }` at the
global level.

### Bright Line / Dark Line / Guardrail

**Bright line.** The fresh-start frame is delivered at a real temporal or personal landmark,
uses the user's own stored commitment language to create recognition, and immediately offers a
value-delivering action so the re-engagement moment serves the user's stated goal.

**Dark line.** Using the peak-aspiration moment of a temporal landmark to surface a paywall,
a guilt-laden lapse summary, a manufactured countdown with no real calendar basis, or a
cancellation-retention screen. The fresh-start frame on a cancel or unsubscribe flow is
explicitly prohibited — it is the Intent Mirroring Card dark pattern applied to an exit path.

**Guardrail.** Before any fresh-start screen or notification ships, answer all three: (1) Does
the landmark correspond to a real calendar event or a real lapse event (N days configurable
and documented in `TECH_SPEC.md`)? Manufactured countdown timers are blocked. (2) Is the next
screen after the fresh-start CTA the first core action of the app — not a paywall, not a
settings form, not a gap-summary screen? (3) Does the fresh-start copy avoid mentioning the
gap duration, missed-session count, or streak-break count on the initial screen? All three
must be yes. Record attestation in `PRODUCTION_READINESS.md`. Run
`npm run check:emotional-design -- --root .`.

### Pairs With

- Commitment Card — `commitment_value` captured during onboarding is the source material for
  the personalized fresh-start echo; these two cards share a data dependency:
  `commitment_captured` must precede `fresh_start_triggered` in the user's lifecycle
- Intent Mirroring Card — a fresh-start re-entry moment is a natural trigger for an intent
  mirror; constraint: the intent mirror must fire after the fresh-start CTA is tapped, not as
  a gate before the CTA
- Variable Reward Card — the first core action of the new chapter is a candidate trigger for a
  variable reward reveal, making the re-engagement session memorable rather than routine
- Perceived Effort Delay Card — when the fresh-start session involves a plan rebuild, the
  Perceived Effort Delay Card can be applied to the plan-generation step; only appropriate
  when real re-personalization computation occurs

### 11-Star Level

**6-star (Better Than Expected).** The lapse notification and re-entry screen frame the return
as a fresh chapter rather than a guilt trip — the user expected punishment and received
permission instead. Minimum viable implementation of the card.

**7-star (Way Beyond).** The product proactively detects a temporal landmark — Monday, first
of month, the user's birthday — and surfaces a personalized reset offer using the user's own
commitment language before the user has thought to open the app. Requires: (a) server-side
landmark detection with push delivery, (b) `commitment_value` stored and retrievable per user,
(c) a single-tap re-entry action that begins value delivery within 10 seconds of opening the
notification. Map both levels explicitly in `11_STAR_EXPERIENCE.md`.

---

## Mastery and Status Card

**One-liner.** Earned status through visible skill levels, domain-vocabulary badges, and
social proof of progress gives users an intrinsic and social reason to continue beyond the
functional goal — because earned identity is self-reinforcing and publicly displayable.

**Emotional beat.** Earned pride — "I've become someone who is good at this."

### Psychology + Canonical Research

Locke and Latham's goal-setting theory (1990): status and level labels function as a form of
concrete feedback — they make abstract improvement legible. When a user sees "Intermediate
Runner" replace "Beginner," the label sets a new internal standard and raises the
self-regulatory bar for what counts as slipping backward. This creates a forward-pull
structurally different from streak mechanics (which create loss aversion) because it operates
on identity, not loss.

Nir Eyal's Hook Model (_Hooked_, 2014) identifies "rewards of self" — mastery, competence,
achievement — as the most psychologically durable category of variable reward precisely because
they are internal and not dependent on external validation. Deci and Ryan's Self-Determination
Theory (1985; attribution-uncertain for specific mobile-app study citations beyond the
theoretical framework) identifies competence as one of three core psychological needs;
satisfying it produces intrinsic motivation categorically more stable than extrinsic
motivation. The combination means a well-designed mastery system is self-sustaining: the user
is not chasing a carrot the app controls, but experiencing genuine growth. The social display
layer adds a tribe-reward signal: a user who shares their "Advanced Meditator" badge is
publicly adopting an identity, which Cialdini's consistency principle predicts will increase
follow-through on future sessions.

| Source | Finding | Confidence |
|---|---|---|
| Locke & Latham, _A Theory of Goal Setting_ (1990) | Specific, challenging goals with explicit feedback produce significantly higher performance; status and level labels serve as a concrete feedback mechanism. | solid |
| Eyal, _Hooked_ (2014) | Rewards of self — mastery, competence, achievement — are the most durable category of variable reward in the Hook Model. | solid |
| Deci & Ryan, Self-Determination Theory (1985) | Competence is one of three core psychological needs; satisfying it through visible skill progress produces intrinsic motivation more stable than extrinsic reward-based engagement. | attribution-uncertain |
| Cialdini, _Influence_ (1984) | Public commitment to an identity (sharing a badge or level label) increases behavioral consistency. | solid |
| Kivetz, Urminsky & Zheng, _JMR_ (2006); Hull (1932) | Users accelerate effort as they approach a visible goal; showing a partially-filled mastery bar creates an endowed-progress effect. | solid |
| Cooper, _The Inmates Are Running the Asylum_ (1999) | Mastery vocabulary must map to the user's actual skill domain, otherwise the label is decorative, not identity-forming. | solid |

### Mechanism Steps

1. User completes a meaningful domain action (session, exercise, quiz, challenge, or
   core-loop completion).
2. The app accumulates progress toward the next skill level using a transparent, user-legible
   metric (sessions, minutes, accuracy, streaks, or composite score).
3. When a threshold is crossed, a level-up moment fires: a deliberate, celebratory reveal
   using domain vocabulary that reflects the user's actual competence, not generic game tiers.
4. The new level label propagates visually across the product — profile screen, dashboard
   header, streak surface — so the user encounters their earned identity on return visits.
5. An optional social-display surface (badge share, leaderboard rank, profile card) makes the
   status externally legible, adding a tribe-reward signal without requiring it.
6. Near-level progress is surfaced as an endowed-progress element (e.g., "3 sessions to
   Intermediate") to exploit the goal-gradient effect at level boundaries.

### Real App Examples

**Duolingo.** League placement at end-of-week: Bronze → Silver → Gold with a fanfare animation
and social leaderboard showing the user's exact rank among peers. Domain vocabulary
(language-learning leagues) maps to a real skill ladder. The weekly cadence creates a fresh-
start temporal landmark that resets competition and re-engages dormant users.

**Nike Run Club.** Earning a Coach milestone badge ("First 5K", "Consistent Runner", "Speed
Demon") after hitting a threshold, with a full-screen badge reveal and a share CTA. Badge
labels use domain vocabulary the running community already values. Share CTA converts internal
mastery into public identity commitment (Cialdini).

**Headspace.** Reaching a meditation streak milestone that unlocks a "Mindful Month"
achievement and surfaces a personalized stat ("You've meditated X hours — that's more than
most people ever do"). Combines mastery identity with social-proof framing without a
competitive leaderboard, suitable for the app's calm emotional register.

**Brilliant (math/science).** Course completion unlocks a topic-specific "Mastery" indicator
on the user's profile, visible to anyone who sees their public learning path. Mastery is the
product's core value proposition; the label is literally what the app claims to deliver.
Profile visibility makes the status externally legible and creates a referral signal.

### When to Use / When NOT to Use

**Use** when the product has a genuine skill dimension — the user can objectively become better
at something over time — AND the app can measure that improvement with a real metric, not a
proxy gamification score. Fire the level-up reveal on the moment of completion, not on the
next app open.

**Do NOT use** on products with no real skill dimension; on purely transactional outcomes; when
the social leaderboard sub-feature cannot populate meaningful peer comparisons (an empty or
static leaderboard signals abandonment).

### Producer Recipe

1. **Define the skill ladder in domain vocabulary first.** Write out 4–6 level names using
   the actual language of the user's skill domain (e.g., for a language app: "Phrase Learner
   → Conversationalist → Fluent Speaker", not "Level 1 → Level 2"). Record the ladder and
   thresholds in `SPEC.md` and `TECH_SPEC.md` before any implementation.
2. **Define the mastery metric.** Identify the single real-world competence signal the app can
   measure. Document it in `ANALYTICS.md` as the canonical mastery metric. Do not use a
   composite gamification score as the sole input.
3. **Implement the near-level progress surface.** Show "X actions to [next level]" or a
   partially-filled progress bar always visible near the level boundary (within 20% of the
   threshold). Emit `mastery_progress_shown` with `current_level`, `next_level`,
   `progress_pct`, `surface`.
4. **Build the level-up reveal moment** as a designed emotional peak — a full-screen or
   sheet-level moment with domain-vocabulary congratulation copy, the new level name
   prominently displayed, and at least one motion transition. The reveal must fire on the
   completion action, not deferred. Emit `mastery_level_up` with `previous_level`,
   `new_level`, `mastery_metric_value`, `session_count`.
5. **Propagate the level label across the product.** Update the profile screen, dashboard
   header or greeting, and any streak or progress surface. The user should encounter their
   level label on every return visit.
6. **Add the optional social-display surface** — a shareable badge card or a leaderboard —
   only after the core identity layer is working and only if the user base or design register
   supports it. Emit `mastery_badge_shared` or `mastery_leaderboard_viewed`.
7. **Wire the reduced-motion fallback.** Level-up reveal animation must check OS reduce-motion
   preference. Fallback: a static screen with the same copy, the new level name, and a CTA.
8. **Record the Guardrail Contract attestation block** in `PRODUCTION_READINESS.md` before
   ship: mastery metric traces to real skill behavior, level labels use domain vocabulary from
   `SPEC.md`, opt-out path exists, social features are optional, no fake-mastery proxy score
   used as the sole input.

### Auditor Signals

**Present**
- Level labels use domain vocabulary specific to the app's skill area, not generic "Level N"
  or "Rank N" labels
- Progress toward next level is visible in at least one persistent surface (dashboard,
  profile, streak card)
- Level-up fires as a designed moment (full-screen, sheet, or equivalent) — not a passive
  badge in a notification center
- The level label appears on the profile screen and at least one return-visit surface
- `mastery_level_up` PostHog event exists in `ANALYTICS.md` with required properties
- The mastery metric traces to a real skill behavior documented in `ANALYTICS.md` and
  `TECH_SPEC.md`
- Level-up animation has a prefers-reduced-motion / OS reduce-motion fallback documented in
  `TECH_SPEC.md`

**Missing**
- No visible near-level progress indicator
- Level labels are generic game tiers with no connection to the app's skill domain
- Level-up fires as a silent counter increment or a toast — no designed emotional peak moment
- Level label does not persist across sessions
- `mastery_level_up` event absent from `ANALYTICS.md` or `TECH_SPEC.md`
- No domain-vocabulary skill ladder defined in `SPEC.md`
- Social sharing or leaderboard features present but there is no opt-out

**Misused**
- Mastery metric is a proxy engagement score (page views, taps, time-in-app) that does not
  reflect real skill improvement — fake mastery, dark-line violation
- Level labels used as a paywall gate: user must subscribe to see their current level
- Near-level progress bar resets or hides after subscription cancellation, manufacturing
  artificial loss to drive re-subscription
- Leaderboard compares absolute totals instead of normalized or cohort-relative performance,
  permanently advantaging early users
- Level-up moment fires during or immediately before a paywall CTA on the same screen —
  compliance veto

### Measurement Events

| Event | What it proves | Required properties |
|---|---|---|
| `mastery_progress_shown` | Near-level progress surface live and visible near a level boundary | `current_level`, `next_level`, `progress_pct`, `surface` |
| `mastery_level_up` | Level-up moment fires on genuine skill-threshold crossing | `previous_level`, `new_level`, `mastery_metric_value`, `session_count` |
| `mastery_level_up_engaged` | User interacted with the level-up reveal | `engagement_action` |
| `mastery_badge_shared` | Social display layer generating organic sharing events | `share_surface`, `anchor_type`, `new_level` |
| `mastery_leaderboard_viewed` | Social comparison surface being used | segment by rank position to detect learned-helplessness signal in bottom-quartile users |
| `mastery_level_dismissed` | Counter-metric: user closed the level-up reveal without engaging | `time_to_dismiss_ms` |

### Mobile Implementation + Reduced-Motion

**SwiftUI.** Level-up reveal is a full-screen or sheet-level modal. Use
`withAnimation(.spring(response: 0.5, dampingFraction: 0.7))` from
`DesignTokens.Motion.expressive` for the badge scale-in, and a soft fade
(`DesignTokens.Motion.brief`, ~150 ms) for the level-label text appearance.

**Flutter.** `AnimationController` with `CurvedAnimation(curve: Curves.elasticOut)` reading
`durationBase` from the token map.

**React Native.** Reanimated `withSpring` with the exported motion token values.

**Web (motion/react).** Drive the reveal with motion/react using the promoted
`--motion-expressive` CSS variable for spring easing and `--motion-base` for the text reveal.
`AnimatePresence` wraps the level-up sheet.

**Reduced-motion fallback (mandatory).** Check `UIAccessibility.isReduceMotionEnabled`
(SwiftUI), `MediaQuery.of(context).disableAnimations` (Flutter), `useReducedMotion()` (React
Native / web). Fallback: static screen with level badge rendered at final scale, copy fully
visible, no transition animations. The fallback must still deliver the full copy — domain
vocabulary, new level name, progress stat — because the identity signal is in the words, not
the motion. Document the fallback per card in `TECH_SPEC.md`.

### Bright Line / Dark Line / Guardrail

**Bright line.** The level label reflects genuine skill improvement measured by a real
behavioral metric documented in `ANALYTICS.md` and `TECH_SPEC.md`; the vocabulary is drawn
from the user's skill domain and feels earned; progress is always visible; and social display
is optional, with a clear opt-out.

**Dark line.** The mastery metric is a proxy engagement score with no relationship to real
skill improvement; level-up reveals gated behind a subscription paywall; near-level progress
bars hidden or reset on cancellation; the level-up reveal fires on the same screen as a
paywall CTA, weaponizing earned pride as a purchase trigger.

**Guardrail.** Before any mastery-status surface ships, verify all of the following in
`PRODUCTION_READINESS.md`: (1) the mastery metric is documented in `ANALYTICS.md` and traces
to a real skill behavior in `TECH_SPEC.md` — not a proxy engagement score; (2) the skill-level
vocabulary is defined in `SPEC.md` using domain language, reviewed by the founder, and does
not use generic game tiers; (3) the level-up reveal is not on the same screen as a paywall CTA
(same-screen coupling is a hard veto); (4) the near-level progress bar and level label do not
reset or hide on subscription cancellation or downgrade; (5) social sharing and leaderboard
features have a visible user-controlled opt-out; (6) the `mastery_level_up` PostHog event is
in `ANALYTICS.md` with all required properties before implementation; (7) prefers-reduced-
motion / OS reduce-motion fallback is implemented and documented. Run
`npm run check:emotional-design -- --root .`.

### Pairs With

- Variable Reward Card — layer the anticipation mechanic onto the level-up reveal when the
  exact threshold-crossing moment is not trivially predictable
- Commitment Card — a user who stated a specific goal in onboarding should see their level
  label echoed in downstream surfaces as progress confirmation
- Intent Mirroring Card — at a milestone level-up, an intent mirror ("You said you wanted to
  become fluent — you just crossed into Advanced") turns a functional threshold into a
  reflective identity moment

### 11-Star Level

**6-star (Better than expected).** Level-up is celebrated, not just incremented — a designed
emotional peak replaces a silent counter.

**7-star (Way beyond).** The level label maps to the user's actual skill domain vocabulary and
reflects their real competence; users feel the product tracked their genuine growth, not a
gamification proxy. The Mastery and Status Card is the primary mechanism for reaching the
7-star "made for me" identity claim in the experience ladder.

---

## Recovery and Trust Repair Card

**One-liner.** A product that handles errors, lapses, failed payments, and crashes with speed,
transparency, and a restorative offer builds more durable trust than one that simply never
fails, because users remember the recovery more vividly than the failure itself.

**Emotional beat.** Relieved loyalty — "They handled that quickly and fairly; I trust them
more than before."

### Psychology + Canonical Research

The peak-end rule (Kahneman and Fredrickson, _Psychological Science_, 1993): a crash mid-
session is a valley; an immediate, warm recovery path that restores the user's progress is a
late peak. The memory encoded is of resolution, not failure. This is why the service recovery
paradox — documented by McCollough and Bharadwaj (1992, attribution-uncertain: well-supported
directional effect with mixed replication) — holds in the consumer mobile context: users who
experienced a failure and received an excellent recovery sometimes report higher satisfaction
than users who never failed at all, because the recovery proves the product's character under
stress.

Don Norman's emotional design framework (_Emotional Design_, 2004): visceral distress from a
failure activates the visceral tier immediately and forcefully. Recovery must respond at the
same tier first — fast, sensory, reassuring — before addressing the behavioral tier (restore
the state, replay the action) or the reflective tier (acknowledge what happened, offer
something forward-looking). Skipping visceral acknowledgment and jumping straight to a
technical explanation feels cold.

Fogg's Behavior Model (B=MAP, _Tiny Habits_, 2019): the recovery moment is a high-motivation,
low-ability crisis. The app must raise the user's ability (re-route the path) and validate
their motivation (confirm their goal still matters) before asking for any further action.

| Source | Finding | Confidence |
|---|---|---|
| Kahneman & Fredrickson, _Psychological Science_ (1993) | Peak-end rule: the overall memory of an experience is disproportionately shaped by its emotional peak and its final moment. A vivid, warm recovery is a late peak that overwrites the failure in memory. | solid |
| McCollough & Bharadwaj (1992) | Service recovery paradox: after a failure followed by an excellent recovery, customer satisfaction can exceed pre-failure baseline. | attribution-uncertain |
| Norman, _Emotional Design_ (2004) | Visceral distress from failure is recoverable if the behavioral and reflective design layers receive an adequate, staged response. | solid |
| Fogg, _Tiny Habits_ (2019) | A failure moment is a high-motivation, low-ability state. Recovery design must restore ability (re-route the path) before issuing any prompt. | solid |
| Buell & Norton, _Management Science_ (2011) | Showing the user what the system is doing to repair the situation raises perceived fairness and satisfaction, even when the actual fix time is identical to a silent repair. | solid |

### Mechanism Steps

1. Detect the failure class — crash, network error, payment decline, server timeout, lapse,
   or entitlement interruption — before choosing a recovery path. Each class requires a
   different tone and restoration offer.
2. Respond at the visceral layer first: within 300 ms of failure detection, surface a calm,
   on-brand signal (icon, color, single line of copy) that says the system knows something
   went wrong. No technical error codes visible at this stage.
3. Acknowledge at the behavioral layer: restore whatever user state is recoverable (in-
   progress form data, last screen position, cached plan state) and surface the clearest
   single action the user can take next. Limit to one CTA. If recovery is automatic, show the
   progress of the repair using real steps (operational transparency, Buell and Norton, 2011).
4. Offer a restorative gesture at the reflective layer when the failure was severe or
   repeated: a session credit, a grace period, a streak restore, or a plain written
   acknowledgment that names what happened and what the product is doing about it. The gesture
   must be proportionate and unconditional — not a coupon requiring a purchase.
5. Log the recovery event with failure class, time-to-recovery, restoration offer shown, and
   whether the user continued or churned.

### Real App Examples

**Duolingo — streak repair.** When a user misses a day, the app surfaces a calm streak-repair
screen that acknowledges the miss, shows the streak-freeze mechanic if available, or offers a
repair purchase — but critically separates the emotional acknowledgment screen from any spend
prompt by at least one deliberate interaction. The copy is warm, not shaming. The final moment
of the lapse experience is a warm offer, not a failure state.

**Apple Health / HealthKit-connected apps — background sync failure.** When a connected device
stops syncing, well-implemented health apps surface a single-sentence status card in the feed
("Last synced 2 hours ago — tap to reconnect") rather than a modal error. The status is
visible but non-blocking, and the repair path is one tap. Operational transparency (Buell and
Norton): the user can see the system's state and initiate repair without a crisis response.

### When to Use / When NOT to Use

**Use** on any feature or journey where the product can fail in a way the user will notice:
crash recovery, network timeout, failed payment or subscription lapse, missed streak or goal,
app update breaking state, server error during a value-reveal moment.

**Do NOT use** as a template for normal empty states (no content yet, first session), loading
states with no prior error, or cancellation confirmation flows. Do not apply to errors the
user caused intentionally (e.g., entering an invalid promo code deliberately) — those need
standard validation copy, not a restorative gesture. The restorative gesture is reserved for
failures the system or infrastructure caused.

### Producer Recipe

1. **Map every failure class** the product can produce before writing recovery copy: crash/ANR,
   network timeout, payment decline, subscription lapse, sync failure, permission revoked, data
   corruption, server error. Each class gets its own recovery entry in `TECH_SPEC.md` with:
   failure detection signal, time-to-detection target, visceral-layer response, behavioral-
   layer action, reflective-layer gesture (if severity warrants it), and PostHog event.
2. **Write recovery copy** in the product's brand voice for each class: name what happened in
   plain language, state what the product is doing about it, and offer one clear action. No
   technical error codes on the primary surface. No stack traces.
3. **Implement state preservation** before implementing recovery UI: cache the user's last
   known good state at every high-stakes moment. Recovery from a crash must restore to the
   last cached state, not to the app home screen. Document the cache points in `TECH_SPEC.md`.
4. **Add proactive detection** for the most common failure precursors: subscription payment
   failure webhook from RevenueCat (fire a push or in-app banner before the grace period ends,
   not after the entitlement is revoked); sync gap exceeding a product-defined threshold.
5. **For payment-failure recovery specifically:** wire the RevenueCat grace-period webhook to
   trigger a push notification and an in-app banner within the grace window. The banner must
   show the failure reason, the remaining grace period in plain language, and one tap to the
   platform's native subscription management or a web payment update link.
6. **Add a restorative gesture decision tree** to `SPEC.md`: if the failure is the product's
   fault (server error, sync failure, crash), offer a proportionate gesture unconditionally.
   If the failure is the user's (missed session, skipped goal), acknowledge warmly without
   guilt and offer a recovery path, but hold the restorative gesture for repeat occurrences.
7. **Emit recovery events:** `recovery_initiated`, `recovery_completed`, and
   `recovery_offer_shown` PostHog events with `failure_class`, `time_to_recovery_ms`,
   `restoration_offer_type`, and `user_continued: bool` before calling any recovery surface
   build-ready.

### Auditor Signals

**Present**
- Error screens have a single clear CTA that routes the user to the next recoverable action,
  not to the app home screen
- Payment failure surfaces show the reason in plain language and link to the platform's native
  subscription management within a grace period, not after entitlement is revoked
- Crash recovery restores the user's last known state (cached form data, screen position,
  partial progress) rather than restarting from scratch
- A proactive in-app banner or push appears for subscription payment failure before the grace
  period expires
- Recovery copy is in the product's brand voice — warm, specific, not generic
- PostHog shows `recovery_initiated` and `recovery_completed` events with `failure_class`
  and `time_to_recovery_ms` properties
- Recovery UI has a prefers-reduced-motion fallback for any animation
- Restorative gestures (session credit, streak restore, grace period extension) are
  unconditional and do not require a purchase to activate
- Lapse recovery (missed streak, skipped goal) is separated from any spend prompt by at
  least one distinct screen or user interaction

**Missing**
- No error states for key failure classes — the app shows a blank screen, spinner that never
  resolves, or crashes to home without acknowledgment
- Payment failure is only detected after the entitlement is already revoked
- Recovery screens show a generic error code or "Unknown error" with no product-specific
  context
- No state caching at high-stakes moments — crash recovery always restarts from app home
- PostHog has no recovery-specific events
- Restorative gesture absent even for severe or repeated failures caused by the product's
  infrastructure
- Recovery UI uses animated transitions with no reduced-motion fallback

**Misused**
- Recovery screen is used as a paywall entry point — a spend prompt appears on the same
  screen as the failure acknowledgment — compliance veto
- Restorative gesture is conditional on a purchase or subscription upgrade ("Restore your
  streak for $2.99")
- Recovery copy uses confirmshaming language ("Don't give up now") that exploits the user's
  emotional state at the failure moment
- The "proactive" detection banner fires on every session regardless of actual failure state
- Operational transparency steps during automatic repair show fake progress with no
  relationship to the actual repair operations

### Measurement Events

| Event | What it proves | Required properties |
|---|---|---|
| `recovery_initiated` | App detected a failure and entered a recovery path | `failure_class`, `failure_detected_at_ms`, `surface` |
| `recovery_completed` | User successfully continued past the failure state | `failure_class`, `time_to_recovery_ms`, `user_continued: bool` |
| `recovery_offer_shown` | A restorative gesture was presented to the user | `failure_class`, `restoration_offer_type`, `is_conditional: bool` |
| `recovery_offer_accepted` | User accepted the restorative gesture | `restoration_offer_type`, `failure_class` |
| `recovery_churned` | User did not continue past the failure state after recovery was offered | `failure_class`, `time_to_churn_ms` |
| `proactive_recovery_triggered` | Product detected a failure precursor and acted before the user hit a wall | `failure_precursor_type`, `hours_before_impact` |

### Mobile Implementation + Reduced-Motion

**iOS (SwiftUI).** Use a custom error view modifier presenting recovery UI as a bottom sheet
(`.sheet` with `.presentationDetents([.medium])`) rather than a full-screen modal. The sheet
preserves the underlying content view in context, signaling continuity rather than failure.
Animate the sheet presentation using `DesignTokens.Motion.spring`. For prefers-reduced-motion:
check `UIAccessibility.isReduceMotionEnabled`; if true, present the sheet instantly with
`animation: nil`. For payment-failure banners, use a pinned top banner with
`DesignTokens.Motion.brief` fade-in (~150 ms). Reduced-motion: instant alpha swap, no fade.

**Flutter.** `showModalBottomSheet` with `useSafeArea: true`. Check
`MediaQuery.of(context).disableAnimations` and pass `Duration.zero` when true.

**React Native (Reanimated).** Use `useAnimatedStyle` with a spring config sourced from the
project's design token map. Check `AccessibilityInfo.isReduceMotionEnabled()`. Recovery
banners use `react-native-toast-message` or an equivalent overlay — never a navigation push.

**Web (motion/react).** Drive recovery banners with `motion.div` using the `--motion-brief`
CSS variable. Wrap the animation in `useReducedMotion()` from motion/react; when true,
substitute `initial={false}` and `animate={false}` to produce an instant, accessible state
change.

### Bright Line / Dark Line / Guardrail

**Bright line.** Use this card to restore the user's path toward their stated goal as quickly
and honestly as possible. A recovery that names what happened, restores what can be restored,
and offers an unconditional gesture when the failure was the product's fault serves the user's
real interest. The peak-end rule ensures the memory of the recovery — not the failure —
becomes the dominant emotional impression, which aligns user benefit with product retention.

**Dark line.** Exploiting the user's distress at a failure moment to drive a spend action:
surfacing a paywall, an IAP offer, or a streak-restore purchase inside or immediately after
the failure/grief screen. This is the recovery equivalent of the prohibited pattern in
`ethics-guardrail.md` (spend prompt inside a grief screen). It is a non-negotiable prohibited
pattern under Apple App Store Review Guidelines §4.0 (exploit emotions) and FTC dark-patterns
enforcement. A second dark-pattern variant: using operational transparency theatrics during a
fake repair — showing animated "fixing your account" steps when no actual repair is occurring.

**Guardrail.** Before any recovery surface ships, verify: (1) no spend prompt (paywall, IAP,
upgrade CTA) appears on the same screen as the failure acknowledgment or within a single user
interaction of the failure notification — enforce a minimum one full screen separation;
(2) any restorative gesture is unconditional and does not require payment to activate;
(3) operational transparency steps shown during automatic repair correspond to real system
operations — document the step-to-operation map in `TECH_SPEC.md` with the same ≥50%
real-operation ratio required by the Perceived Effort Delay Card; (4) recovery copy contains
no confirmshaming language, no manufactured urgency, and no fabricated social proof. Run
`npm run check:emotional-design -- --root .` before calling any recovery surface build-ready.

### Pairs With

- Commitment Card — the commitment made early is the anchor that makes recovery copy
  meaningful without manufacturing emotional urgency
- Perceived Effort Delay Card — when automatic repair requires real computation, operational
  transparency during the repair is the honest version of effort display
- Intent Mirroring Card — after a lapse recovery, a single intent-mirror moment before the
  next action converts a recovery into a recommitment without guilt or pressure
- Variable Reward Card — do NOT chain a variable reward reveal immediately after a recovery
  gesture; that sequence (failure → recovery offer → reward reveal) can look like manufactured
  anticipation and approaches the spend-prompt-after-reward dark pattern; separate them by at
  least one session

### 11-Star Level

**5-star (Expected).** Errors are handled without dead ends — every failure class has an error
view with a single recovery CTA and the user is never left on a blank screen or forced to
force-quit.

**6-star (Better than expected).** The recovery path acknowledges what specifically went wrong
in plain language, restores the user's last known good state, and offers a proportionate
restorative gesture when the failure was the product's fault.

**7-star (Way beyond).** The product detects failure precursors proactively — a subscription
payment about to fail, a sync gap widening, offline mode approaching a data-loss threshold —
and surfaces a resolution path before the user notices any degradation. The user's first
awareness of the problem is the product's offer to solve it, not the failure itself.

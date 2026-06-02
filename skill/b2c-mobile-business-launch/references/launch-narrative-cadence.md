# Launch Narrative & Cadence

Use this reference when planning how a B2C mobile launch shows up in public: the tentpole
announcement, the weekly feature-launch heartbeat, the launch-day run-of-show, and the copy
craft that decides whether a release lands or dies on arrival. It produces
[`growth/LAUNCH_NARRATIVE.md`](../templates/growth/LAUNCH_NARRATIVE.md) and is enforced by
`npm run check:launch-narrative`.

It is a peer reference to [`viral-growth-loops.md`](viral-growth-loops.md) (in-product sharing
loops), [`ugc-creator-engine.md`](ugc-creator-engine.md) (creator-led organic), [`paid-user-acquisition.md`](paid-user-acquisition.md)
(paid amplification), [`remotion-content-assets.md`](remotion-content-assets.md) (the hero video and
post assets), [`emotional-design-system.md`](emotional-design-system.md) (the feeling the launch
must carry), and [`aso-store-ops.md`](aso-store-ops.md) (the store launch calendar). Do not
duplicate those; cross-reference them.

## Why This Lane Exists

The fastest-growing consumer-AI companies treat **every release as an event** and run a
**deliberate cadence**, so they are always in the conversation. That is a system, not luck —
each beat is planned weeks out, down to post order and who replies to what. This reference
encodes that system so a launch package ships with a real narrative and cadence instead of a
pretty 30-second animation and a blog post written the day before.

The core reframe: **a launch is not the end of building a product; it is the reason to build it
a certain way.** Use rare big moments to earn a standing audience, then feed that audience so it
never goes cold.

## Evidence Base (and what is NOT verified)

This lane is informed by a specific NYC launch agency and by public launches it and its peers
ran. Keep the verifiable facts; do not repeat the marketing claims.

- **Shown Media** ([shownmedia.com](https://shownmedia.com), [shownmedia.com/tech](https://shownmedia.com/tech))
  is a NYC creative agency that runs viral go-to-market launches for tech/AI and DTC brands.
  Its public thesis: "we turn companies into internet moments," "going viral is skill based,"
  reverse-engineer the X/LinkedIn algorithms (sourcing signals + reply chains), a **4–6 week**
  launch process (Week 1 scripting/positioning; Weeks 2–6 production + revision), and a stated
  outcome band of roughly **2–10M views with a ~48-hour peak** before decline. A founder, Mitchell
  Rusitzky, surfaces this playbook publicly. The agency also describes a Claude Code multi-agent
  "script factory" (research phase sets the ceiling; specialist hook/body agents; a manager layer
  and a final quality gate) — "the system doesn't invent taste, it encodes it." See the
  [AI Corner profile](https://www.the-ai-corner.com/p/20-agent-ai-script-factory-10m-revenue).
- **Verified launch artifacts** (X impressions read off the live posts):
  - **Koji by Brilliant** — Sue Khim, [@suekhim, May 29 2026](https://x.com/suekhim/status/2060378988606878147),
    ~**4.71M** impressions. Hook: "AI is making kids dumber. It should be making them geniuses.
    Introducing Koji, the first AI tutor that gets kids to actually think." (See also Brilliant's
    [launch post](https://blog.brilliant.org/a-world-class-tutor-in-every-home/).) Textbook
    feeling-first copy: indictment → hopeful reframe → product, no hashtags, no emojis, no link in
    the post.
  - **Moda** — Anvisha Pai, [@anvisha funding launch, Mar 24 2026](https://x.com/anvisha/status/2036474296353411290),
    ~**4.50M** impressions. "We raised $7.5M to kill AI slop. Introducing Moda: the world's first
    design agent with taste." Note the optional engagement mechanic ("RT + comment 'Moda' and we'll
    design your brand for free") that manufactures reply/RT signals.
  - **ChatGPT feature post** — [@ChatGPTapp, May 22 2026](https://x.com/ChatGPTapp/status/2057908052968521902),
    ~**2.66M** impressions. "Paperwork is better when you can just talk through it…" — the model for a
    single small feature framed as a moment (the weekly heartbeat).
- **Do NOT repeat as fact** (could not be verified): any "MrBeast alumni" claim, a "10B+ views"
  figure, attributing an Emmy to the agency's CEO, the "many startups just died today" post, or the
  agency's self-reported aggregate view/revenue numbers (they are inconsistent across the agency's
  own pages). When writing a real launch's public copy, follow the skill rule that public claims are
  liabilities: cite only what is true and attributable.

## The Two Launch Types

Think in two buckets that feed each other.

### Tentpole Launch (the "Super Bowl")

Rare, expensive, planned weeks out. For ~48 hours you take over the timeline. It must feel special
and be backed by a heavy product moment (flagship feature/model, funding round, category-defining
repositioning). Prerequisites:

- **Genuine novelty + correct positioning.** Virality amplifies a real wedge; it does not
  manufacture one. If there is no heavy moment yet, do not fake a tentpole — run the heartbeat only.
- **Lead time of ~4–6 weeks** end to end. Do not expect a tentpole on a 3-day turnaround.
- **A credible human principal**, not the faceless brand handle. Koji = Sue Khim; Moda = Anvisha.
  The principal's face/voice is the trust anchor.
- **A hero asset** (video/clip) from [`content-assets/CONTENT_ASSETS.md`](../templates/content-assets/CONTENT_ASSETS.md)
  / `DEMO_VIDEO.md`.

### Feature Launch Cadence (the heartbeat)

Small, sharp, consistent releases packaged like events. This — not the tentpole — keeps you in the
conversation. Target a steady weekly beat of releases worth talking about (the @ChatGPTapp
"Paperwork" post is the model: one feature, framed as a moment, with a use-case hook).

### How they compound (Algorithm Compounding)

A tentpole does not end when the views stop. A meaningful slice of that reach keeps getting served
your posts for months — that is your **standing audience**. You stop fighting a cold start every
time you post, and the weekly heartbeat rides the wave of the last big moment. High cadence
compounds: an active account keeps getting re-served, and a long tail of each post's reach lands
days later via re-serve to that standing audience. (A "~10% long-tail" figure is a useful planning
heuristic, not a published number — label it as such.)

## Marketing At The Table

The companies that own attention flipped the usual order: instead of engineering shipping a feature
and handing marketing a day to "make it look good," **marketing has a say over what ships and when.**

- Hold a roadmap review with marketing in the room (monthly is a reasonable default).
- Pick the next release by what people will find interesting and what is trendy now — ship small,
  sharp releases against what is sitting in the zeitgeist this week. (Koji rode the "AI is making
  kids dumber / cheating" discourse; Moda rode "AI slop.")
- Treat sequencing and naming as partly a content calendar: every release should have a postable
  hook.

## Launch-Copy Craft

Most good companies fail here. The animation is clean and the product is fine, but the copy makes
you feel nothing — you read it, think "okay," and scroll. No reaction reads to the algorithm as no
value. **Shape every launch around a feeling first, the feature second.**

- **Lead with the emotional state or the broken status quo, then name the product/mechanism.**
  Koji: "AI is making kids dumber" (indictment) → "should be making them geniuses" (hope) → product.
  ChatGPT: "Paperwork is better when you can just talk through it" (use-case feeling) → feature.
- **A strong hook + POV is the whole game.** Have a thesis, name an enemy/broken thing, or reframe
  the category ("the first design agent *with taste*", "the first AI tutor that gets kids to
  *actually think*").
- **Emotional angles that work:** a glimmer of hope; pointing at something broken and saying we are
  fixing it; a genuinely new take that reframes the whole category.

### The 2026 DO-NOT-DO list (deterministically enforced)

`check:launch-narrative` scans the post copy (fenced code blocks in `LAUNCH_NARRATIVE.md`) for these:

- **No hashtags.** They read as marketing and depress reach.
- **No emojis carrying the message.** The verified high-performers use essentially none; let the
  hook and the video do the work.
- **No link in the main/root post.** Put the link in the first self-reply — off-platform links in
  the root post get deprioritized.
- **No generic "okay" copy** that earns a scroll; make it lovable or hateable.
- **No "congrats!" seeded replies** — every pre-briefed reply must add a distinct angle.
- **Don't lead with the spec, don't bury the POV, and don't post a tentpole from the brand handle.**

## Launch-Day Run-of-Show

Plan every beat weeks out — down to post order and who replies to what. A workable sequence:

1. **T-0:** Principal posts the hero post (hook + reframe + product + one visible asset/video).
2. **T+~2m:** Principal self-replies with the link and how to try it (link lives here, not in the root).
3. **T+~5m:** Co-founders / team / investors quote-tweet and reply, each with a distinct angle, to
   seed the reply chain.
4. **T+~1h:** Pre-warmed amplifiers (creators, "BREAKING…" accounts) post their own framed takes,
   staggered (not simultaneous) to extend the live window.
5. **T+~1d:** Principal replies to top replies and posts a "what people are saying" follow-up to feed
   the long tail.

Optional engagement mechanic (use sparingly — it reads growth-hacky if overused): "RT + comment 'X'
and we'll do Y for free," which manufactures the reply/RT signals the algorithm rewards.

## Measurement & Claims Hygiene

- Tie attention to product behavior via [`analytics-attribution.md`](analytics-attribution.md): post
  impressions → reply-link clicks (UTM'd) → install → activation event. Record the self-reported
  attribution source key per the `ANALYTICS.md` attribution contract.
- Watch a standing-audience metric weekly (followers gained, profile-served impressions, returning
  viewers), not just per-post views.
- Use exact, attributable numbers when you cite anyone (Koji ~4.71M, Moda funding ~4.50M, ChatGPT
  Paperwork ~2.66M). Do not launder rounded or unverifiable view/revenue claims into your own copy.

## Founder-Only Gates

Public posting and scheduling are founder-only. Pause for: the launch go-live decision, connecting
or posting from brand/founder social accounts, any paid amplification or creator spend (route through
[`paid-user-acquisition.md`](paid-user-acquisition.md)), and any public claim about views, revenue, or
"fastest-growing" that is not provably true.

## Traceability

The launch narrative is downstream of the product and brand decisions and upstream of the store
calendar and paid amplification:

- Feeling the launch must carry: [`emotional-design-system.md`](emotional-design-system.md) → `EMOTIONAL_DESIGN.md`.
- Magical V1 moment the launch sells: [`eleven-star-experience.md`](eleven-star-experience.md) → `11_STAR_EXPERIENCE.md`.
- Hero video and post assets: [`remotion-content-assets.md`](remotion-content-assets.md) → `CONTENT_ASSETS.md`.
- In-product loop the launch rides: [`viral-growth-loops.md`](viral-growth-loops.md) → `VIRAL_GROWTH.md`.
- Store launch calendar/listing alignment: [`aso-store-ops.md`](aso-store-ops.md) → `APP_STORE_LISTING.md`.
- Cross-surface launch decisions: `LAUNCH_TRACE.md`.

## Acceptance Checklist

Before calling the launch-narrative lane ready:

- [ ] `growth/LAUNCH_NARRATIVE.md` exists with Fit Gate, Launch Thesis (Feeling-First), Emotional
      Angle, Two Launch Types, Algorithm Compounding (standing audience), Marketing At The Table,
      Launch Day Run-of-Show, Tentpole Announcement Post, Copy Guardrails, Feature Launch Post,
      Measurement Plan, Stop And Scale Rules, Founder-Only Gates, and Traceability.
- [ ] The dominant emotional angle (hope / something broken we fix / category reframe) is named.
- [ ] All post copy lives in fenced code blocks and passes the copy guardrails (no hashtags, no
      emojis, no link in the main post).
- [ ] Public claims are limited to what is true and attributable; no unverified view/revenue/credential claims.
- [ ] `npm run check:launch-narrative -- --root .` passes.

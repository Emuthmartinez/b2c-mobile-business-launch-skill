# Landing Motion Craft

Use this before building or auditing a launch landing page or web funnel that should feel like a premium, motion-rich marketing site (the "motionsites-grade" bar) instead of a static form page. It is the craft layer above [`geo-seo.md`](geo-seo.md) §3a and [`design-visual-system.md`](design-visual-system.md): those decide what the page says and that motion must not hurt discoverability; this decides how the motion is built so it reads as senior-grade and still ships fast, crawlable, and accessible.

Landing pages and funnels are web surfaces. Everything here is for web only. Do **not** apply these libraries or techniques to the shipped mobile binary — that is governed by [`premium-mobile-craft.md`](premium-mobile-craft.md) and stays framework-native.

## Contents

- Two-Lane Model
- Section Catalog
- The Progressive-Enhancement Contract
- Motion Tokens
- Build Routing
- Template
- Performance And Accessibility Gates
- Artifacts
- Common Failure Modes

## Two-Lane Model

Premium landing motion is two lanes that share one timing system, not one tool. Do not try to make one lane do the other's job.

- **Live lane — `motion` (`motion/react`, framer-motion's successor).** Owns everything the visitor drives: scroll-linked reveals, sticky "scrollytelling" pins, parallax, staggered entrances, marquees, count-ups, cursor spotlights, 3D tilt, glass/gradient morphing. This is ~85% of the perceived polish. Server-render or statically render the content; hydrate motion after.
- **Baked lane — Remotion.** Owns deterministic *media* embedded into the page: the looping hero background video, section media tiles, and reusable ad/store clips. Render once to `.webm`/`.mp4` + a poster still, then embed like any other asset. Route all Remotion work through [`remotion-content-assets.md`](remotion-content-assets.md) (license gates, founder approval, truthful source inputs). Remotion cannot drive live scroll/hover/cursor interaction; do not reach for it there.

Both lanes read the same `--motion-*` tokens (see Motion Tokens), so a Remotion ad and the landing page it drives to feel like one brand. Never import `motion`/framer-motion into a Remotion composition or into the shipped mobile binary.

```
        shared --motion-* tokens (durations + easings)
               │                         │
   Remotion (bake & embed)      motion/react (live choreography)
   • hero loop .webm + poster   • whileInView stagger reveals
   • section media tiles        • useScroll / useTransform parallax
   • ad / store clips           • sticky scrollytelling, count-up,
                                  cursor spotlight, 3D tilt, marquee
```

## Section Catalog

Build sections from this vocabulary. Each maps to a `motion/react` primitive; none requires a heavyweight scroll framework, though a smooth-scroll layer (e.g. Lenis) may be added as progressive enhancement if it degrades cleanly and respects reduced motion.

| Section | Motion | `motion/react` primitive |
| --- | --- | --- |
| Hero | gradient-mesh / baked-video background, scroll parallax, word-stagger headline, cursor glow, device 3D tilt | `useScroll` + `useTransform`, staggered `animate`, optional Remotion loop |
| Trust marquee | seamless infinite scroll, pause-on-hover, edge mask | CSS keyframe or `animate` loop; duplicate the track for a clean `-50%` wrap |
| Bento / features | in-view stagger, hover lift, live mini-widgets | `whileInView` + `staggerChildren`, `whileHover` |
| Scrollytelling | sticky-pinned media, scroll-linked step activation, cross-fading screens | `useScroll({offset})` → step index → `AnimatePresence` |
| Stats | count-up on enter | `whileInView` + animated number (rAF/`animate`) |
| Testimonials | stagger reveal, cursor spotlight | `whileInView`, pointer-driven CSS var |
| Pricing | glassmorphism, animated billing toggle | `layout` animation, `whileHover` |
| CTA | gradient morph, cursor spotlight, glass | keyframed background, pointer-driven radial |
| Footer | reveal-on-enter | `whileInView` |

## The Progressive-Enhancement Contract

This is the load-bearing rule and the reason landing motion does not have to trade against GEO/performance. `check:landing-funnel` enforces it when a landing site is in scope.

1. **Content is real HTML, present without JS.** Hero headline, subhead, primary CTA, and every answer-style section body exist as server-rendered/static text. Splitting a headline into per-word spans for a stagger is done *after* a `js`/hydration flag is set, so crawlers and no-JS users see the whole sentence.
2. **Motion never gates first paint.** Entrance animations are progressive enhancement layered after LCP. Do not hide above-the-fold text behind an animation that only reveals on scroll or on a JS timer — that both hurts LCP/INP and hides copy from AI answer engines.
3. **`prefers-reduced-motion: reduce` collapses everything to a calm static state.** A reduced-motion block is required: parallax, tilt, cursor effects, marquees, and long entrances resolve to their final, fully legible state; nothing depends on motion to be readable.
4. **Coarse-pointer / touch skips pointer effects.** Cursor glow, spotlight, and 3D tilt are gated on `(pointer: fine)`.

## Motion Tokens

Live and baked lanes both read the tokenized motion scale from [`../design-system/tokens.css`](../design-system/tokens.css) (and `tokens.json`). In-app micro-motion uses the base scale (`--motion-duration-fast/base/slow`, 120–360ms). Landing choreography adds longer, more expressive tokens for cinematic entrances and scroll pacing:

- `--motion-duration-reveal` — entrance reveals (~600ms)
- `--motion-duration-cinematic` — hero / large scroll moments (~1s+)
- `--motion-easing-emphasis` — expo-out for confident entrances
- `--motion-easing-spring` — gentle overshoot for interactive elements
- `--motion-stagger` — per-child delay for staggered groups

Read these as CSS custom properties or feed them into `motion/react` transitions; do not hard-code magic-number durations/easings in landing components. Cinematic length is fine because perceived snap comes from the easing, not a short duration — but the *content* is already painted (see the contract), so the length never delays first meaningful paint.

## Build Routing

1. Generate senior-grade section layouts with the `ui-ux-pro-max` skill when available (reference-only; adapt, do not copy its data), per [`design-visual-system.md`](design-visual-system.md).
2. Implement with `motion/react`; refresh current API through Context7 or the official docs before setup or API-sensitive guidance (`https://motion.dev/docs/react`).
3. Server-render/statically render (Next.js App Router or Astro); hydrate motion after. Keep copy answer-style and self-contained per [`geo-seo.md`](geo-seo.md) §3.
4. For any baked video/media, hand off to [`remotion-content-assets.md`](remotion-content-assets.md) and record the route in `CONTENT_ASSETS.md`.
5. Keep section copy inside the copy-compliance rules in [`geo-seo.md`](geo-seo.md) §4 (no invented scarcity, ranked-cohort, lifetime, or authority claims).

## Template

Seed from [`../templates/landing-page/`](../templates/landing-page/README.md): a runnable, dependency-free section library — tokenized CSS reading the promoted `--motion-*` scale plus progressive-enhancement JS — covering the catalog above, shipping `robots.txt` / `llms.txt` / `sitemap.xml` and a Remotion baked-hero-video slot. It is buildless on purpose (so it drops into any stack and passes `check:template-safety`, which forbids animation-library imports in shipped templates); its README carries the `motion/react` upgrade snippets and the Remotion handoff. Copy it to `landing/` in the business repo and customize — it is the floor, not a replacement for the section-by-section craft here.

## Performance And Accessibility Gates

Before calling a landing funnel launch-ready, in addition to the [`geo-seo.md`](geo-seo.md) §5 technical gates:

- above-the-fold text is in the static HTML and not animation-gated
- a `prefers-reduced-motion: reduce` path exists and fully de-animates the page
- animation timing reads `--motion-*` tokens, not hard-coded values
- no animation library is imported into the shipped mobile binary
- keyboard focus order and visible focus states survive the motion
- LCP/INP are not regressed by entrance motion (measure, don't assume)

## Artifacts

- The landing repo owns the section library and any baked media (never bundle a Remotion project inside this skill).
- Record the motion route (motion/react + any Remotion media) in `CONTENT_ASSETS.md` and `TOOL_DECISIONS.md`.
- Update `PROJECT_STATE.yaml` `lanes.landing` (or `lanes.funnel`) evidence with the reduced-motion and browser smoke-test proof `check:landing-funnel` expects.

## Common Failure Modes

- Reaching for Remotion to animate the live page, or importing `motion`/framer-motion into a Remotion composition or the mobile binary.
- Hiding hero copy until scroll or a JS timer — hurts LCP and hides text from crawlers and AI answer engines.
- Shipping cinematic motion with no `prefers-reduced-motion` fallback.
- Hard-coding durations/easings instead of reading `--motion-*`, so the landing page and Remotion ads drift out of one timing system.
- Cursor/tilt/parallax effects that fire on touch devices or steal keyboard focus.
- Treating motion polish as a reason to skip the copy-compliance scan.

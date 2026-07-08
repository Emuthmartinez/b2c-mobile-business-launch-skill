# Landing page — motion section library

A runnable, **dependency-free** landing page you customize into your launch's web funnel. It ships the "motionsites-grade" section vocabulary (hero, marquee, bento, scrollytelling, stats, testimonials, pricing, CTA) using **tokenized CSS + progressive-enhancement JS** — no build step, no external fonts/scripts, and no animation library.

Read [`../../references/landing-motion-craft.md`](../../references/landing-motion-craft.md) first — it carries the two-lane model, the section catalog, and the progressive-enhancement contract this template implements.

## Why buildless

`check:template-safety` forbids importing `motion` / `framer-motion` in any shipped template code file (that import would break a launched Flutter/SwiftUI repo if it ever leaked into the binary). So the shipped sections animate with vanilla, tokenized motion. In **your web app**, upgrade the live choreography to `motion/react` — the snippets below show how. The motion *feel* is identical because both read the same `--motion-*` scale from `design-system/tokens.css`.

## Files

```
landing-page/
  index.html          # the runnable reference page — open it directly in a browser
  public/
    robots.txt        # crawler + AI-answer-engine access (replace example.com)
    llms.txt          # AI-citable product summary
    sitemap.xml       # search discovery
  remotion/
    README.md         # optional baked hero-video background (Remotion lane)
```

## Use it

1. **Brand + copy.** Replace `Northstar`, the tokens in `index.html` `:root` (swap for your `DESIGN.md` tokens), and every placeholder string. Keep copy answer-style and inside the [`../../references/geo-seo.md`](../../references/geo-seo.md) §4 rules (no invented scarcity, ranked-cohort, lifetime, or authority claims).
2. **Truthful media.** The device/screens are placeholders — drop in real V1 screenshots or a Remotion-baked frame (see `remotion/README.md`). Do not present mock UI as shipped functionality.
3. **GEO/SEO.** Edit `public/robots.txt`, `public/llms.txt`, `public/sitemap.xml` for your domain, per [`../../references/geo-seo.md`](../../references/geo-seo.md).
4. **Waitlist idempotency.** If you add an email capture, duplicate submits must return HTTP 200 (de-duplicated), per `geo-seo.md` §4.
5. **Deploy gates + browser smoke test.** Before marking the landing lane ready, run `check:landing-funnel` from your business repo and record the five deploy gates and the browser-rendered form smoke test.

```bash
npm run check:landing-funnel -- --root .
```

## The progressive-enhancement contract (what `check:landing-funnel` enforces)

- Hero headline, subhead, and CTA are **real static text**. The headline splits into staggered words only after `<html>` gets the `js` class — crawlers and no-JS users see the whole sentence. Never gate above-the-fold text behind an animation.
- A `@media (prefers-reduced-motion: reduce)` block collapses all motion to a calm static state.
- Motion timing reads `--motion-*` tokens, not hard-coded values.
- Pointer effects (tilt, spotlight) are gated on `(pointer: fine)`; entrance motion never delays LCP.

## Upgrade to `motion/react` in your web app

Same tokens, spring physics, cleaner interruption handling. Read durations from the CSS variables so the timing stays branded.

Staggered in-view reveal:

```tsx
import { motion } from "motion/react";

const reveal = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 },
  }),
};

export function Feature({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <motion.div variants={reveal} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-8%" }}>
      {children}
    </motion.div>
  );
}
```

Scroll parallax (hero device) and sticky scrollytelling:

```tsx
import { useScroll, useTransform, motion } from "motion/react";

// Hero parallax
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 600], [0, -48]);
// <motion.div style={{ y }}>...</motion.div>

// Scrollytelling: map a pinned section's progress to an active step index
const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
const step = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 2]);
// swap screens with <AnimatePresence>, honoring useReducedMotion()
```

Always branch on `useReducedMotion()` and render the copy server-side; hydrate motion after.

## Baked hero video (Remotion lane)

For a cinematic looping background rendered deterministically from product truth, see `remotion/README.md` and [`../../references/remotion-content-assets.md`](../../references/remotion-content-assets.md). Render once to `.webm` + a poster still and embed it behind the hero — do not reach for Remotion to drive live scroll/hover motion.

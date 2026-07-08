# Baked hero video (Remotion lane)

Optional. For a cinematic looping hero background — the motionsites-style video backdrop — render it **deterministically** with Remotion from product truth, then embed the file behind the hero. This is the "baked" lane; the live scroll/hover/cursor motion stays in `index.html` (or `motion/react`).

Do not reach for Remotion to drive live interaction — it renders frames, not live DOM.

## Route first

Before creating any video, load [`../../../references/remotion-content-assets.md`](../../../references/remotion-content-assets.md) and [`../../../references/paid-tool-routing.md`](../../../references/paid-tool-routing.md): confirm the Higgsfield-vs-Remotion route, record the Remotion license status, and get founder approval for the fallback if Higgsfield was intended. Keep the composition truthful to the shipped V1 (`11_STAR_EXPERIENCE.md`).

## Shape

Create the Remotion project in the launch repo (never inside the skill), per `remotion-content-assets.md`:

- Composition `HeroLoop`, e.g. 1920x1080 (or 1080x1350 for a tall hero), 30fps, 4–8s seamless loop.
- Drive timing from the same `--motion-*` values used on the page so the loop and the live page feel like one brand.
- Render to a web-friendly `.webm` (+ `.mp4` fallback) and a poster still.

```bash
cd content-assets/remotion
npx remotion still HeroLoop --frame=0 --output ../out/hero-poster.jpg
npx remotion render HeroLoop --codec=vp8 --output ../out/hero-loop.webm
```

## Embed behind the hero

```html
<video class="hero-bg" autoplay muted loop playsinline poster="/hero-poster.jpg" aria-hidden="true">
  <source src="/hero-loop.webm" type="video/webm" />
  <source src="/hero-loop.mp4" type="video/mp4" />
</video>
```

- Keep the poster as the first meaningful paint; the video is progressive enhancement.
- Under `prefers-reduced-motion: reduce`, do not autoplay — show the poster still.
- Record the render command, dimensions, and license status in `CONTENT_ASSETS.md`.

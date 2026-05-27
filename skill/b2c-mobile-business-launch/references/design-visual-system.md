# Design System And HTML Visual Proofs

Use this reference before any brand, UI, screenshot, landing-page, paywall, onboarding, or generated-app handoff work. The goal is to make visual decisions durable for agents and inspectable by humans.

## Contents

- Source Tooling
- Routing Order
- Required Artifacts
- Naming Contract
- Higgsfield Production Routing
- HTML Implementation Rules
- Design Gates
- Common Failures

## Source Tooling

Treat these repositories as live source material when the work depends on their details:
- Google Labs `design.md`: `https://github.com/google-labs-code/design.md`
- Impeccable: `https://github.com/pbakaus/impeccable`
- Taste Skill: `https://github.com/Leonxlnx/taste-skill`
- Layers Skills: `https://github.com/jamiemill/layers-skills`
- Refero MCP and Refero Styles: `https://doc.refero.design/llms.txt`, `https://api.refero.design/mcp`, `https://styles.refero.design/`
- Higgsfield local skills: `higgsfield-generate`, `higgsfield-product-photoshoot`, `higgsfield-soul-id`, `higgsfield-marketplace-cards`

If matching local skills are installed, load and use them. If Refero or Higgsfield is unavailable, load `paid-tool-routing.md` and ask before replacing it with local HTML/CSS/SVG/canvas, founder-owned assets, public-domain assets, public UX pattern libraries, bundled pattern templates, or real app screenshots. If the design-system source skills are not installed, apply the source workflow directly and cite the repository URL in the design notes.

## Routing Order

1. **Trace first.** Load `flow-traceability.md` and identify the research/product trace rows the brand and visual system must express.
2. **Layers first when product clarity is weak.** Use Layers-style thinking to verify observed behavior, domain language, user needs, product strategy, conceptual model, interaction flow, and surface decisions before locking screens.
3. **Refero or baseline UX patterns for real flow shape.** Use `refero-ux-patterns.md` to study styles, screens, and flows before locking interaction structure. If Refero is unavailable, use the bundled `templates/ux-patterns/` pack only after founder-approved fallback routing.
4. **Google `design.md` for token truth.** Produce `DESIGN.md` as the canonical machine-readable and human-readable design system: YAML tokens first, Markdown rationale second.
5. **Taste for direction.** Use Taste-style review to avoid generic output, set variance/motion/density, and choose a design language that fits the category instead of default SaaS patterns.
6. **Impeccable for audit and polish.** Use Impeccable-style checks for typography, color/contrast, spatial design, motion, interaction states, responsive behavior, and UX writing.
7. **Higgsfield for visual production.** Use Higgsfield for generated visuals, mockups, app icons, mascots, brand imagery, screenshot art, demo videos, onboarding animation clips, ad creative, and UGC/presenter videos unless production assets already exist.
8. **Fallback only after confirmation.** If Refero, Higgsfield, or another paid visual/UX tool is unavailable, get founder confirmation before using the free/local route and label limitations in `TOOL_DECISIONS.md`.
9. **HTML proof before handoff.** Render the visual system, UX pattern board, and key screens in HTML using the same tokens. Do not leave visual work only as Markdown, screenshots, Figma notes, or generated images.

## Required Artifacts

### `DESIGN.md`

Follow the Google Labs format:
- YAML front matter with `name`, `description`, `colors`, `typography`, `rounded`, `spacing`, and `components`
- Markdown sections in this order when present: Overview, Colors, Typography, Layout/Spacing, Elevation/Depth, Shapes, Components, Do's and Don'ts
- component tokens for primary/secondary buttons, inputs, tabs/segmented controls, cards/lists, sheets/modals, nav, paywall, store screenshot frames, and share/referral surfaces when relevant
- implementation notes for CSS variables, Tailwind, SwiftUI, React Native, Flutter, or generated-app prompts

Validate when possible:

```bash
npx @google/design.md lint DESIGN.md
```

If the CLI is unavailable or the package registry fails, record the exact blocker and manually check token references, contrast, section order, and duplicate headings.

### `design.md`

Use lowercase `design.md` for the screen implementation spec. It must reference `DESIGN.md` for tokens and include:
- surface inventory and navigation model
- trace IDs from `LAUNCH_TRACE.md` for build-critical screens, claims, onboarding questions, paywall choices, and store screenshot concepts
- onboarding, aha moment, core loop, paywall/revenue surface, settings/account, share/referral, and support/privacy surfaces when relevant
- state matrix: empty, loading, error, permission denied, offline, success, premium locked, restored purchase
- animation and transition specs with reduced-motion behavior
- copy calibration and analytics hooks by screen
- path to the corresponding HTML proof for each key surface

### `design.html`

Create a rendered proof that uses the design system, not a separate visual language. It should include:
- token swatches, type specimens, spacing/radius examples, motion samples, and component states
- mobile app frames for the main product sequence and edge states
- responsive landing/funnel/legal/support/page examples when the launch includes web surfaces
- App Store/Play screenshot concepts when store creative is in scope
- generated images or external assets embedded with `direction`, `draft`, or `production` labels
- source notes for image/model/reference inputs and any license or permission caveats

All visual artifacts created by this skill should appear in HTML. This includes brand books, asset boards, icon directions, mascot sheets, onboarding storyboards, screenshot frames, paywall explorations, landing sections, and app-screen mocks.

### `UX_PATTERNS.md` And `ux-patterns.html`

Use `UX_PATTERNS.md` for the product-specific pattern inventory and flow decisions. It must include:
- Refero route: docs checked, MCP availability, query pack, selected style/screen/flow records, and what each changed
- founder-approved fallback route when Refero is unavailable, with limitations and the bundled baseline patterns used
- pattern inventory for onboarding, signup/login, permissions, paywall, restore purchases, settings/account, support/privacy/legal, empty/loading/error/offline, search/filter, referral/share, and account deletion when relevant
- flow maps that preserve the onboarding conversion playbook in `onboarding-conversion.md`
- state matrix and bug traps for each critical flow
- source ledger that summarizes references instead of copying paid screenshots or protected material into the repo

Render the same material in `ux-patterns.html` or inside `design.html` so the founder can inspect the flow architecture visually.

## Naming Contract

Keep both names unless the project already has a strong conflicting convention:

- `DESIGN.md` is the canonical design-system source of truth. It stores tokens, component rules, rationale, and implementation notes.
- lowercase `design.md` is the screen implementation spec. It maps flows, states, copy, analytics hooks, and HTML proof paths back to `DESIGN.md`.

Renaming either file usually does not break the running app by itself, but it does break launch-package convention unless all skill references, app-local agents, `AGENTS.md`, `CLAUDE.md`, builder prompts, validators, and handoff docs are updated together.

Do not merge them unless the launch is tiny and no builder handoff is expected. If a target repo already uses `DESIGN_SYSTEM.md`, make it an appendix that explicitly defers token truth to `DESIGN.md`.

## Higgsfield Production Routing

Before generating assets, translate `DESIGN.md` into the generation brief: palette names and hexes, type mood, shape/radius language, illustration style, motion energy, forbidden aesthetics, and intended surface.

Higgsfield is paid/account-gated. Do not infer that the founder lacks access because the current runtime cannot call it.

Use local Higgsfield skills by intent:
- `higgsfield-product-photoshoot` for brand/product visuals, hero banners, lifestyle shots, Pinterest pins, social carousels, and paid-social static packs.
- `higgsfield-generate` with GPT Image 2 for app icons, graphic UI imagery, text-forward visual concepts, and high-fidelity general images.
- `higgsfield-generate` with Nano Banana 2/Pro for mascots, character sheets, expressive icon-like illustrations, and reference-driven character work.
- `higgsfield-generate` with Seedance 2.0 for 4-15 second product demo clips, onboarding motion, image-to-video, and multi-shot product moments.
- `higgsfield-generate` Marketing Studio for UGC-style ads, presenter videos, unboxing/review formats, product demos, hooks, settings, and avatar/product workflows.
- `higgsfield-soul-id` only when the app needs a consistent human face, founder avatar, presenter identity, or recurring character based on owned reference photos.
- Virality Predictor (`brain_activity`) for finished demo/ad/onboarding clips before publishing or using them in a launch funnel.

Rules:
- Do not generate visuals that ignore `DESIGN.md`; every prompt or backend brief must explicitly carry the design-system constraints.
- Do not rely on generated art as the only proof. Embed final candidates in `design.html`, `onboarding.html`, screenshot HTML, or landing HTML and verify them in layout.
- Label each asset as `direction`, `draft`, or `production`, with source model/tool, date, prompt summary, and permission/license caveats.
- For app-store screenshots, combine real app UI with generated backgrounds/characters only when the underlying app screen remains truthful and readable.
- For animations, create a storyboard in HTML first, generate the Higgsfield clip second, then include the clip or keyframes in the HTML proof with reduced-motion fallback notes.

## HTML Implementation Rules

- Use CSS variables derived from `DESIGN.md` token names.
- Keep the HTML self-contained unless the target repo already has an asset pipeline.
- Build mobile-first frames with stable dimensions and responsive desktop variants where relevant.
- Avoid placeholder-only UI. Real copy, real state labels, and realistic content density expose design problems earlier.
- Do not hide important visuals in remote-only assets. If images are required, embed local assets or include clear fallbacks.
- Use accessible text, semantic structure, alt text for meaningful images, focus states, reduced-motion CSS, and contrast checks.
- Serve locally for browser validation when the tool cannot open `file://` URLs. Choose an open port and record it in the verification notes.

## Design Gates

Before moving to ASO, landing implementation, or builder handoff:
- `LAUNCH_TRACE.md` shows which research/product decisions the visual system expresses.
- `DESIGN.md` exists and is the token source of truth.
- lowercase `design.md` maps screens to tokens, states, analytics hooks, and HTML proof paths.
- `UX_PATTERNS.md` exists, records Refero or founder-approved fallback research, and preserves the onboarding playbook.
- `ux-patterns.html` or a dedicated `design.html` section renders the pattern inventory, flow maps, and state matrix.
- `design.html` or equivalent loads locally and shows mobile plus relevant desktop states.
- mobile and desktop visual checks pass for text fit, overlap, contrast, tappable size, and responsive framing.
- Impeccable/Taste/Layers routing is documented: which checks were used, skipped, or blocked.
- generated visuals are labeled as direction or production, with source and permission caveats.

## Common Failures

- `DESIGN_SYSTEM.md` and `DESIGN.md` disagree; fix by making `DESIGN.md` canonical and reducing the other doc to an appendix.
- screenshot or landing visuals look good as images but are impossible to build because tokens/components were never specified.
- generated images carry the brand while the actual app UI stays generic; require HTML app frames using the same design language.
- Phase 2 jumps straight to surface style even though user needs, conceptual model, or flow are unresolved; run Layers-style orientation first.
- no browser/mobile proof exists, so cramped copy, broken contrast, and clipped controls are discovered during implementation or store screenshot production.

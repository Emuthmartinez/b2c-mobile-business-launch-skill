# Design System

Status: partial until Design Room state has been mutated, versioned, rendered, and promoted.

## Canonical Medium

Design proposals must use STATE -> MUTATE -> VERSION -> RENDER. Edit `state/business.json` and `state/theme.tokens.json`; render `design-room.html`; do not hand-author one-off visual proposals.

## Token Source

Shared tokens live in `state/theme.tokens.json` and promote into `design-system/` after acceptance.

## Starter Tokens

| Token | Value | Notes |
| --- | --- | --- |
| color.background | `#f7f3ec` | page and app shell background |
| color.primary | `#0c7c59` | primary actions and emphasis |
| color.accent | `#ff6f5c` | conversion accents and highlights |
| color.text | `#161512` | primary readable text |
| radius.md | `8px` | default card and control radius |

## Motion

Motion is tokenized in `state/theme.tokens.json` under `motion.*` and promoted to every platform. Use one scale everywhere; do not hand-pick durations.

| Token | Value | Web (CSS var) | iOS (`DesignTokens.Motion`) |
| --- | --- | --- | --- |
| motion.durationFast | `120ms` | `--motion-duration-fast` | `durationFast` (0.12s) |
| motion.durationBase | `220ms` | `--motion-duration-base` | `durationBase` (0.22s) |
| motion.durationSlow | `360ms` | `--motion-duration-slow` | `durationSlow` (0.36s) |
| motion.reducedMotionDuration | `0ms` | `--motion-duration-reduced` | `reducedMotionDuration` (0s) |
| motion.easing | `cubic-bezier(0.2, 0, 0, 1)` | `--motion-easing` | `easing` |

Per-surface implementation:

- **Web surfaces ship motion** — landing pages, funnels, web paywall, and the Design Room preview animate with framer-motion / the `motion` library (`import { motion } from "motion/react"`), reading durations from the promoted `--motion-*` variables. This is the primary place framer-motion and the `ui-ux-pro-max` skill apply.
- **The mobile binary does not use framer-motion** — SwiftUI uses `DesignTokens.Motion` with `.animation`; Flutter uses implicit/explicit animations; React Native uses Reanimated/Moti. All read the same token values.
- **Reduced motion is required everywhere** — honor `prefers-reduced-motion` on web and the OS reduce-motion setting on device; fall back to opacity-only or instant changes.

## Screen Spec

Screen-level implementation guidance lives in `screen-design/design.md` so this case-insensitive filesystem can still ship both the canonical visual-system file and the lowercase screen spec convention.

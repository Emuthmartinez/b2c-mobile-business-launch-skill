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

## Screen Spec

Screen-level implementation guidance lives in `screen-design/design.md` so this case-insensitive filesystem can still ship both the canonical visual-system file and the lowercase screen spec convention.

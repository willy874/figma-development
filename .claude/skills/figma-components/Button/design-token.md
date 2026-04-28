---
name: figma-component-button-design-token
description: Component-scoped design tokens for `<Button>` (MerakButton v2). Defined here because they're either MUI-Button-specific runtime constants (the `inherit-contained` grey, the `outlined-inherit` border, icon layout deltas) or fixed dimensions that don't fit the shared `merak/seed/*` or `merak/alias/*` namespaces. Bind Button paints / strokes / effects to these names rather than literal values; for shared tokens used by Button (seed colors, alias colors, MD shadows), see `.claude/skills/figma-operator-guide/design-token.md`.
parent_skill: figma-components
---

# `<Button>` Component Tokens

Tokens scoped to `<Button>` and its variants in `apps/console/src/components/Button/Button.tsx`. Reach for these only inside the Button component set; for everything else (semantic colors, action overlays, MD elevations, typography), bind to the shared `merak/*` and `material-design/*` tokens documented in [`design-token.md`](../../figma-operator-guide/design-token.md).

## Why these are component-scoped

These values are either:

1. **MUI-Button-specific runtime constants** that don't reuse a shared semantic — e.g. the `Color=Default, Variant=Contained` grey is `palette.grey.300`, not `seed/tertiary/main` (`grey.500`); the `Color=Default, Variant=Outlined` border is `palette.text.primary` (full 87% black, used as `currentColor`), not the 50%-α `outlineBorder` pattern that themed colors follow.
2. **Layout deltas peculiar to Button's `startIcon` / `endIcon` slots** that don't generalize to other components (IconButton, Chip, ListItem icon spacing all differ).

Anything that turns out to be reused by another component should be promoted to `merak/*` and removed from this file.

## Tokens

| Token                                     | Type   | Resolves to                                | Used by                                                            |
| ----------------------------------------- | ------ | ------------------------------------------ | ------------------------------------------------------------------ |
| `component/button/contained-default-bg`   | COLOR  | `palette/grey/300` = `#E0E0E0`             | `Color=Default, Variant=Contained, State=Enabled`                  |
| `component/button/contained-default-fg`   | COLOR  | `palette/text/primary` = `#000000DE`       | `Color=Default, Variant=Contained` foreground (label + icon)       |
| `component/button/outlined-default-border`| COLOR  | `palette/text/primary` = `#000000DE`       | `Color=Default, Variant=Outlined, State ∈ {Enabled, Focused}` border (MUI's `outlinedInherit` uses `currentColor`, not the `0.5α` `outlineBorder` pattern) |
| `component/button/elevation-rest`         | EFFECT | `material-design/shadows/shadows-2`        | `Variant=Contained, State ∈ {Enabled, Hovered, Pressed, Disabled-spec*}` (Disabled actually clears shadow at runtime — see `figma.spec.md` §7) |
| `component/button/elevation-focused`      | EFFECT | `material-design/shadows/shadows-6`        | `Variant=Contained, State=Focused`                                 |
| `component/button/focus-ring-width`       | FLOAT  | `3` (px)                                   | All variants, `State=Focused` outer ring (Figma enhancement; runtime renders no ring on the box, see `storybook.render.md` §3) |
| `component/button/icon-gap`               | FLOAT  | `8` (px)                                   | Gap between `Icon Left` / `Icon Right` slot and the label          |
| `component/button/icon-edge-offset`       | FLOAT  | `-4` (px)                                  | Negative margin on the outer edge of the icon slot — bleeds the icon `4 px` toward the button edge so visual side-padding becomes `16 − 4 = 12 px` |

## Notes

- **Why the `inherit` color carves out two tokens** — MUI's `Button` resolves the `inherit` color path against `theme.palette.Button.inheritContainedBg` (= `grey.300`) and `currentColor` (= `text.primary`) rather than going through the same `palette.<color>.{main, contrastText, …}` resolver as the themed colors. We can't reuse `seed/tertiary/*` because that family aliases `grey.500` (`#9E9E9E`), which is a darker fill than what MUI actually paints. Defining the two grey-300 / text-primary values as Button tokens keeps the binding honest and lets a future redesign point them at a refreshed `seed/tertiary/*` ramp without rewriting the Button component.
- **Why `elevation-{rest,focused}` are aliased instead of inlined** — the MUI Button uses MD elevation 2 at rest and elevation 6 on `:focus-visible` (contained only). Pointing these at the shared `material-design/shadows/shadows-{2,6}` styles keeps a single source of truth for the shadow ramp; the Button just decides which step to use. If MUI changes its elevation choice, only this file updates.
- **Why icon gap / edge-offset live here** — MUI sets `.MuiButton-startIcon { margin-left: -4px; margin-right: 8px }` (and the mirror for `endIcon`). The `-4 / 8` pair is specific to Button; IconButton, Chip, ListItem all use different icon spacing rules. Keeping these as Button tokens lets Auto Layout in Figma reproduce the visual `12 px` side-padding without hard-coding magic numbers.

---
name: figma-component-iconbutton-design-token
description: Component-scoped design tokens for `<IconButton>` (MerakIconButton v1). Covers IconButton-specific layout constants (focus-ring width, elevation aliases). The two `Default`-color resolver tokens (`contained-default-bg`, `outlined-default-border`) are NOT redefined here — `<IconButton>` borrows them from `<Button>`'s `component/button/*` namespace because the values and resolver path are byte-identical. See `figma.spec.md` §5.5 for the borrow list.
parent_skill: figma-components
---

# `<IconButton>` Component Tokens

Tokens scoped to `<IconButton>`. Reach for these only inside the IconButton component set; for everything else (semantic colors, action overlays, MD elevations), bind to the shared `merak/*` and `material-design/*` tokens documented in [`design-token.md`](../../figma-design-guide/design-token.md).

## Borrowed from `<Button>`

The `Default`-color resolver path is identical between Button and IconButton (both go through MUI's `inherit` color branch — `palette.grey.300` for contained-fill, `palette.text.primary` for outlined-border). To avoid duplication, IconButton binds directly to Button's tokens:

| Token                                       | Used by IconButton                                     |
| ------------------------------------------- | ------------------------------------------------------ |
| `component/button/contained-default-bg`     | `Color=Default, Variant=Contained` fill                |
| `component/button/outlined-default-border`  | `Color=Default, Variant=Outlined` border               |

If a third consumer (Chip, ListItem, …) appears, promote both to `merak/alias/colors/*` and remove the borrow.

## IconButton-scoped tokens

| Token                                            | Type   | Resolves to                                | Used by                                                                                          |
| ------------------------------------------------ | ------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `component/icon-button/elevation-rest`           | EFFECT | `material-design/shadows/shadows-2`        | `Variant=Contained, State ∈ {Enabled, Hovered}`                                                  |
| `component/icon-button/elevation-focused`        | EFFECT | `material-design/shadows/shadows-6`        | `Variant=Contained, State=Focused`                                                               |
| `component/icon-button/elevation-pressed`        | EFFECT | `material-design/shadows/shadows-8`        | `Variant=Contained, State=Pressed`                                                               |
| `component/icon-button/focus-ring-width`         | FLOAT  | `3` (px)                                   | All variants, `State=Focused` outer ring                                                         |

## Notes

- **Why `elevation-{rest,focused,pressed}` are aliased** — pointing them at the shared `material-design/shadows/shadows-{2,6,8}` styles keeps a single source of truth for the shadow ramp; IconButton just decides which step to use. If MUI changes its elevation choice, only this file updates.
- **No typography tokens** — `<IconButton>` has no text. The icon glyph inherits its fill from the variant's foreground token via `currentColor`.

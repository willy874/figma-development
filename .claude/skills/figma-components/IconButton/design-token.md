---
name: figma-component-iconbutton-design-token
description: Component-scoped design tokens for `<IconButton>` (MUIIconButton v1). Four tokens live in the MUI Library Figma file today — one FLOAT variable (focus-ring width) and three EFFECT styles (`elevation-rest` cloned from `shadows-2`, `elevation-focused` cloned from `shadows-6`, `elevation-pressed` cloned from `shadows-8`). The two `Default`-color resolver tokens (`contained-default-bg`, `outlined-default-border`) are NOT redefined here — `<IconButton>` borrows them from `<Button>`'s `component/button/*` namespace because the values and resolver path are byte-identical. See `figma.spec.md` §5.5 for the borrow list.
parent_skill: figma-components
---

# `<IconButton>` Component Tokens

Tokens scoped to `<IconButton>`. Reach for these only inside the IconButton component set; for everything else (semantic colors, action overlays, MD elevations), bind to the shared `mui/*` and `material-design/*` tokens documented in [`design-token.md`](../../figma-create-component/library-tokens.md).

## Borrowed from `<Button>`

The `Default`-color resolver path is identical between Button and IconButton (both go through MUI's `inherit` color branch — `palette.grey.300` for contained-fill, `palette.text.primary` for outlined-border). To avoid duplication, IconButton binds directly to Button's tokens:

| Token                                       | Used by IconButton                                     |
| ------------------------------------------- | ------------------------------------------------------ |
| `component/button/contained-default-bg`     | `Color=Default, Variant=Contained` fill                |
| `component/button/outlined-default-border`  | `Color=Default, Variant=Outlined` border               |

If a third consumer (Chip, ListItem, …) appears, promote both to `mui/alias/colors/*` and remove the borrow.

## IconButton-scoped tokens

### Variables — `mui` collection (1)

| Token                                            | Type   | Resolves to                                | Used by                                                                                          |
| ------------------------------------------------ | ------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `component/icon-button/focus-ring-width`         | FLOAT  | `3` (px), scope `STROKE_FLOAT`             | All variants, `State=Focused` outer ring                                                         |

### Effect styles (3)

Effect styles cannot alias other styles in Figma — these are independent clones of the `material-design/shadows/*` source. If the source shadow ramp changes, this file's three styles must be re-cloned.

| Style                                            | Cloned from                                | Used by                                                                                          |
| ------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `component/icon-button/elevation-rest`           | `material-design/shadows/shadows-2`        | `Variant=Contained, State ∈ {Enabled, Hovered}`                                                  |
| `component/icon-button/elevation-focused`        | `material-design/shadows/shadows-6`        | `Variant=Contained, State=Focused`                                                               |
| `component/icon-button/elevation-pressed`        | `material-design/shadows/shadows-8`        | `Variant=Contained, State=Pressed`                                                               |

## Notes

- **Why `elevation-{rest,focused,pressed}` are aliased** — pointing them at the shared `material-design/shadows/shadows-{2,6,8}` styles keeps a single source of truth for the shadow ramp; IconButton just decides which step to use. If MUI changes its elevation choice, only this file updates.
- **No typography tokens** — `<IconButton>` has no text. The icon glyph inherits its fill from the variant's foreground token via `currentColor`.

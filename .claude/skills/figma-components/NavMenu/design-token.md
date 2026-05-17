---
name: figma-component-navmenu-design-token
description: Component-scoped design token for `<NavMenu>` / `<NavMenuItem>`. Covers the single themed `Selected` background tint minted to match MUI's runtime `alpha(palette.primary.main, palette.action.selectedOpacity = 0.08)` overlay. The shared `mui` family ships an 8 %-α **black** alias (`alias/colors/bg-selected`) but no 8 %-α primary token — hence one component-scoped local. The token lives in the **MUI Library Figma file's local `mui` collection** — NavMenu binds only to local variables; nothing reaches into a published library. For shared semantic tokens used by NavMenu (`alias/colors/*`, `seed/primary/*`), see `figma.spec.md` §5 and `../../figma-create-component/library-tokens.md`.
parent_skill: figma-components
---

# `<NavMenu>` Component Tokens

Tokens scoped to `<NavMenu>` / `<NavMenuItem>` and authored in the **local `mui` collection** of the MUI Library Figma file (`<FIGMA_FILE_KEY>`). Reach for these only inside the NavMenu component sets; for everything else (semantic colors, action overlays, MD typography), bind to the shared `mui/seed/*` and `mui/alias/*` tokens documented in [`../../figma-create-component/library-tokens.md`](../../figma-create-component/library-tokens.md).

## Why this is component-scoped

MUI runtime renders `<ListItemButton>`'s `&.Mui-selected` background as `theme.alpha(palette.primary.main, palette.action.selectedOpacity)`, where `selectedOpacity = 0.08` — an **8 %-α primary** tint. The shared `mui` family does not ship a token at this exact alpha + hue:

- `alias/colors/bg-selected` is **8 %-α black** (`#00000014`) — same alpha, wrong hue. Used by Pagination Default-color Selected. Binding NavMenu Selected here would render a neutral grey instead of the primary-tinted blue MUI actually paints.
- `seed/primary/hover-bg` is **4 %-α primary** (`#1976D20A`). Two stacked layers tops out at `~7.84 %` — close to 8 % but visibly lighter. Pagination uses this stacking pattern at the Hovered state, not Selected.
- No `seed/primary/selected` or `seed/primary/selected-bg` token exists in the catalogue today; the closest neighbour `seed/primary/main` is fully opaque, so it cannot stand in for the overlay.

To hit MUI's exact 8 %-α primary without inflating the shared seed family, NavMenu owns one 8 %-α primary token locally. `Color=Default` does not exist as an axis on NavMenu (see `figma.spec.md` §1 — there is no Color variant), so only the primary color is needed.

If a future product requirement adds a Color axis to `<NavMenuItem>` (e.g. a Danger-themed nav highlight), per-color `component/navmenu/selected-bg-<c>` tokens may need minting — same pattern as Pagination's `component/pagination/selected-bg-{primary,danger,warning,info,success}`.

## Tokens

Bound at the cell level via `setBoundVariableForPaint`. Hex values are reference resolutions; bind to the variable, do not paste hex.

| Token name                              | Type  | Resolved value             | Hex          | Used by                                     |
| --------------------------------------- | ----- | -------------------------- | ------------ | ------------------------------------------- |
| `component/navmenu/selected-bg`         | COLOR | `rgba(25, 118, 210, 0.08)` | `#1976D214`  | `<NavMenuItem>` `State=Selected` fill (every cell — top-level + nested) |

`scopes`: `["FRAME_FILL", "SHAPE_FILL"]` so the token only appears in fill pickers — never on borders or text.

## Notes

- **Why 8 % isn't a `seed/primary/selected-bg`**: the existing `seed/primary/*` family is shared across all components (Button, IconButton, Chip, etc.) and standardises on a 4 %-α `hover-bg` token. Adding a `seed/primary/selected-bg @ α=0.08` would require auditing every consumer (Pagination's Default-color Selected currently binds to the 8 %-α **black** `alias/colors/bg-selected`; switching to a primary-tinted token changes its appearance). Keeping the 8 % primary token in `component/navmenu/*` lets NavMenu opt in without changing the shared family. **If a future audit promotes 8 %-α primary as the design-system standard for selected-row highlights, migrate this token into `seed/primary/selected-bg` in a single PR and delete this doc** — see `figma.spec.md` §7 issue 1.
- **Why not paint opacity?** Figma stores a fill's `paint.opacity` correctly on the variant, but when a top-level instance of the wrapper set is created on a screen, any `paint.opacity < 1` combined with a bound variable is flattened back to `opacity = 1` in the instance. Binding to a variable whose **resolved value already carries alpha** (8 % in `component/navmenu/selected-bg`) avoids that flattening — the instance reads the variable's alpha directly at render time. Same pattern as Pagination's `component/pagination/selected-bg-*` family.
- **Why one token, not five (one per Color)**: NavMenu has no `Color` variant axis (`figma.spec.md` §1). The primary-themed Selected paint is the only Color expression in the component. If `Color` is later added (`figma.spec.md` §8 sync trigger), this token expands into `component/navmenu/selected-bg-{primary,danger,warning,info,success}` — five tokens, mirroring Pagination's pattern.
- **Local-only binding rule**: per the project directive, the NavMenu Figma cells bind exclusively to the MUI Library file's **local** `mui` collection — never to the published library copy. If the published library renames or removes a token, the local file does not break automatically; track the divergence in `figma.spec.md` §8.
- **Disabled is rendered via wrapper opacity, not a per-fill token**: `<ListItemButton>` runtime applies `opacity: palette.action.disabledOpacity = 0.38` on the root element. Figma reproduces this by setting `opacity = 0.38` on the entire Auto Layout cell — every fill keeps its normal token binding. No `component/navmenu/disabled-*` tokens are needed.
- **Active is design-only**: MUI runtime emits no static `:active` paint (Touch Ripple instead). The Figma `State=Active` cell binds to the shared `alias/colors/bg-filled-hover` (12 %-α black, `palette.action.focus`-equivalent) so designers can mock a "pressed" snapshot — no NavMenu-scoped token needed for this state.

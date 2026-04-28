---
name: figma-component-pagination-design-token
description: Component-scoped design tokens for `<Pagination>` / `<PaginationItem>`. Covers the 5 themed `Selected` background tints minted to match MUI's runtime `12 %` overlay (the shared `seed/<C>/hover-bg` family is only `4 %`, so a dedicated 12 %-α token per family is required). All tokens live in the **MUI Library Figma file's local `merak` collection** — Pagination binds only to local variables; nothing reaches into a published library. For shared semantic tokens used by Pagination (`alias/colors/*`, `seed/<C>/{main, outlineBorder, hover-bg | outline-hover}`), see `figma.spec.md` §5 and `../../figma-design-guide/design-token.md`.
parent_skill: figma-components
---

# `<Pagination>` Component Tokens

Tokens scoped to `<Pagination>` and authored in the **local `merak` collection** of the MUI Library Figma file (`KQjP6W9Uw1PN0iipwQHyYn`). Reach for these only inside the Pagination component sets; for everything else (semantic colors, action overlays), bind to the shared `merak/seed/*` and `merak/alias/*` tokens documented in [`../../figma-design-guide/design-token.md`](../../figma-design-guide/design-token.md).

## Why these are component-scoped

MUI native `outlinedPrimary` / `outlinedSecondary` / `outlinedStandard` `<PaginationItem>` paints `State=Selected` background as `alpha(palette.<color>.main, 0.12)` — a **12 %-α** themed overlay. The shared `merak` collection only ships a 4 %-α `hover-bg` per family (`seed/<C>/hover-bg` for primary / info / success and `seed/<C>/outline-hover` for danger / warning), and stacking two of those layers tops out at `~7.84 %` — visibly lighter than the MUI runtime. The Merak Pagination spec was previously aligned with the 8 % stacked-fill pattern; per the runtime-truth directive, it now consumes pre-alpha'd **12 %** tokens defined here.

The five tokens cover the five themed colors in the `Color` axis. `Color=Default` falls back to the shared `alias/colors/bg-selected` (8 %-α black) — no Pagination-scoped token needed, because MUI's `colorStandard` selected bg is also 8 %-α (matches the alias).

## Tokens

All bound at the cell level via `setBoundVariableForPaint`. Hex values are reference resolutions; bind to the variable, do not paste hex.

| Token name                                       | Type  | Resolved value             | Hex          | Used by                                              |
| ------------------------------------------------ | ----- | -------------------------- | ------------ | ---------------------------------------------------- |
| `component/pagination/selected-bg-primary`       | COLOR | `rgba(25, 118, 210, 0.12)` | `#1976D21F`  | `Color=Primary, Type=Page, State=Selected` fill      |
| `component/pagination/selected-bg-danger`        | COLOR | `rgba(211, 47, 47, 0.12)`  | `#D32F2F1F`  | `Color=Danger, Type=Page, State=Selected` fill       |
| `component/pagination/selected-bg-warning`       | COLOR | `rgba(237, 108, 2, 0.12)`  | `#ED6C021F`  | `Color=Warning, Type=Page, State=Selected` fill      |
| `component/pagination/selected-bg-info`          | COLOR | `rgba(2, 136, 209, 0.12)`  | `#0288D11F`  | `Color=Info, Type=Page, State=Selected` fill         |
| `component/pagination/selected-bg-success`       | COLOR | `rgba(46, 125, 50, 0.12)`  | `#2E7D321F`  | `Color=Success, Type=Page, State=Selected` fill      |

`scopes`: all five tokens scope to `["FRAME_FILL", "SHAPE_FILL"]` so they only appear in fill pickers — never on borders or text.

## Notes

- **Why 12 % isn't a `seed/<C>/selected-bg`**: the existing `seed/<C>/*` family is shared across all components (Button, IconButton, Chip, etc.) and standardises on a 4 %-α overlay token. Adding a `seed/<C>/selected-bg @ α=0.12` would require auditing every consumer to know whether they want 8 % (current standard via `alias/colors/bg-selected` or stacked `hover-bg`) or 12 % (MUI's outlined-Selected baseline). Keeping the 12 % tokens in `component/pagination/*` lets Pagination opt in without changing the shared family. If a future audit promotes 12 %-α as the design-system standard, migrate these into `seed/<C>/selected-bg` in a single PR and delete this doc.
- **Default-color Selected uses `alias/colors/bg-selected`** (`#00000014` = 8 %-α black). This matches MUI native `colorStandard` (`alpha(action.selected, 1)` resolves to the same 8 %-α black via `palette/action/selected`). No Pagination-scoped Default-color token needed.
- **Local-only binding rule**: per the project directive, the Pagination Figma cells bind exclusively to the MUI Library file's **local** `merak` collection — never to the published library copy. The local collection holds 50 variables (45 shared aliases + seed colors + 5 Pagination-scoped). If the published library renames or removes a token, the local file does not break automatically; track the divergence in `figma.spec.md` §8.
- **Disabled fg / outlined-border ↔ runtime divergence is preserved on purpose**. Figma uses `alias/colors/text-disabled` (38 %-α) for Disabled foreground and `alias/colors/bg-disabled` (12 %-α) for outlined-disabled stroke; MUI runtime keeps `text.primary` (87 %-α) and `0.23 black` respectively. The Figma values were *not* changed in the runtime-alignment pass because they offer better disabled-state legibility and the resulting visual difference is small. See `figma.spec.md` §6.5 note.

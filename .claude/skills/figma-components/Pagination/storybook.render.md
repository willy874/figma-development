---
name: figma-component-pagination-storybook-render
description: Computed-style matrix for `<Pagination>` and `<PaginationItem>` (MerakPagination v1) measured against `src/stories/Pagination.stories.tsx` via Chrome DevTools MCP. Documents per-cell box / paint / typography numbers across the Color × Type × Size × State surface, the wrapper layout, and the divergences between MUI's stock paint values and the Merak Figma component-set bindings. Companion to `figma.spec.md` (the contract).
parent_skill: figma-components
---

# `<Pagination>` Storybook Render Measurements (v1)

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/Pagination.stories.tsx`. Stories used: `Default` (wrapper, color=default, page=5/10), `ColorSizeMatrix` (6 colors × 3 sizes wrappers), `ItemTypeStateMatrix` (4 types × 4 states for color=primary, size=medium), `ItemSelectedColorSizeMatrix` (6 colors × 3 sizes selected page items). The Storybook is hard-coded to MUI Pagination's `variant="outlined"` + `shape="rounded"` (per Merak design decision); these are not runtime variant axes — every measurement below is for that fixed treatment.

The themed colors danger / warning / info / success are **not** native to MUI Pagination (only `standard | primary | secondary` are). The story applies them via PaginationItem `sx` so every Figma cell has a runtime equivalent. Where the Merak `sx` diverges from MUI's native primary path (notably the Selected bg %), this file records both numbers so authoring can pick.

## 1. Item-axis invariants (Medium, Enabled, color=primary)

The 4 `Type` values × 4 `State` values × the same `(color, size)` share these properties. Numbers come from the Page column unless noted; Previous / Next swap the inner text node for a 20×20 SVG (MUI ships `NavigateBeforeIcon` / `NavigateNextIcon`).

| Property                        | Page                             | Previous (icon)                                   | Next (icon)                                   | Ellipsis                              |
| ------------------------------- | -------------------------------- | ------------------------------------------------- | --------------------------------------------- | ------------------------------------- |
| outer box (W × H)               | `32 × 32 px`                     | `32 × 32 px`                                      | `32 × 32 px`                                  | `32 × 20.02 px` (no fixed height — text only) |
| `min-width`                     | `32 px`                          | `32 px`                                           | `32 px`                                       | `32 px`                               |
| `padding`                       | `0 6 px`                         | `0 6 px`                                          | `0 6 px`                                      | `0 6 px`                              |
| `margin`                        | `0 3 px` (so visible inter-item gap = 6 px) | same                                   | same                                          | same                                  |
| `border-radius`                 | `4 px`                           | `4 px`                                            | `4 px`                                        | `4 px`                                |
| `border` (Enabled / Hovered / Disabled) | `1 px solid rgba(0, 0, 0, 0.23)` | same                                      | same                                          | same                                  |
| `box-shadow`                    | `none`                           | `none`                                            | `none`                                        | `none`                                |
| `font` (label / glyph)          | `14 / 20.02 px Roboto Regular`, `letter-spacing: 0.14994 px` | same | same                                          | same (renders the literal `…` U+2026 character) |
| icon glyph (Previous / Next)    | n/a                              | inline 20×20 SVG `NavigateBeforeIcon`, `fill: currentColor` | 20×20 SVG `NavigateNextIcon`         | n/a                                   |
| `cursor` (Enabled / Selected)   | `pointer`                        | `pointer`                                         | `pointer`                                     | `default` (MUI sets ellipsis non-interactive) |
| `pointer-events` (Disabled)     | `none`                           | `none`                                            | `none`                                        | n/a                                   |

> The `0.23 black` outlined-border value is **not** a Merak alias token — MUI hard-codes it inside PaginationItem.js as `theme.palette.mode === 'light' ? 'rgba(0,0,0,0.23)' : 'rgba(255,255,255,0.23)'`. The Figma component binds the border to `alias/colors/border-defalt` (`rgba(0,0,0,0.12)`) instead, so dark mode flips automatically. This is a deliberate Figma ↔ runtime divergence, not a measurement bug — see §6 drift checks.

## 2. State axis (Page type, color=primary, size=medium)

Probed via `ItemTypeStateMatrix`. `Hovered` cannot render statically without `storybook-addon-pseudo-states`; the matrix uses `Mui-focusVisible` as a visual stand-in (MUI happens to apply the same 12 % overlay for both `:hover` and `.Mui-focusVisible` on outlined items). The numbers below treat Hovered as the Mui-focusVisible reading.

| Property         | Enabled                          | Hovered (Mui-focusVisible stand-in) | Selected                                         | Disabled                          |
| ---------------- | -------------------------------- | ----------------------------------- | ------------------------------------------------ | --------------------------------- |
| `background`     | `rgba(0, 0, 0, 0)` (transparent) | `rgba(0, 0, 0, 0.12)` (12 % black)  | `rgba(25, 118, 210, 0.12)` (12 % primary main)   | `rgba(0, 0, 0, 0)` (transparent)  |
| `border-color`   | `rgba(0, 0, 0, 0.23)`            | `rgba(0, 0, 0, 0.23)` (unchanged)   | `rgba(25, 118, 210, 0.5)` (50 % primary main)    | `rgba(0, 0, 0, 0.23)` (unchanged) |
| `color` (foreground) | `rgba(0, 0, 0, 0.87)`        | `rgba(0, 0, 0, 0.87)` (unchanged)   | `rgb(25, 118, 210)` (primary main)               | `rgba(0, 0, 0, 0.87)` (MUI doesn't dim text on outlined disabled — leaves at text.primary; opacity comes from `pointer-events: none` + cursor change, no paint shift) |
| `cursor`         | `pointer`                        | `pointer`                           | `pointer`                                        | `default`                         |
| `pointer-events` | `auto`                           | `auto`                              | `auto`                                           | `none`                            |

Notes:

- **Hovered does not tint border or foreground** — only the background overlay changes. Figma `Color=Default, State=Hovered` (1:5109) matches: bg = `alias/colors/bg-outline-hover`, border + text stay neutral.
- **Selected raises border to 50 % main + foreground to solid main** — Figma matches this for themed colors via `seed/<C>/outlineBorder` (50 %) and `seed/<C>/main` (solid).
- **Selected bg is 12 % primary** at runtime, but Figma renders it as **~8 % via stacked 4 % fills** (`seed/primary/hover-bg` × 2). That is a 4 % shortfall — see §3 and §6.

## 3. Color axis (Selected page, all sizes)

`ItemSelectedColorSizeMatrix` — 6 colors × 3 sizes = 18 selected-page cells. Selected bg / border / fg are the only axis where `Color` matters; every other (Type × State) cell paints identically across colors (per spec §4.2).

| Color (story stand-in)    | `palette.<color>.main` | Selected bg                          | Selected border                   | Selected fg          |
| ------------------------- | ---------------------- | ------------------------------------ | --------------------------------- | -------------------- |
| `default` (MUI standard)  | n/a (uses `text.primary` for fg) | `rgba(0, 0, 0, 0.08)`        | `rgba(0, 0, 0, 0.23)`             | `rgba(0, 0, 0, 0.87)` |
| `primary` (MUI primary)   | `#1976d2`              | `rgba(25, 118, 210, 0.12)` ¹         | `rgba(25, 118, 210, 0.5)`         | `rgb(25, 118, 210)`  |
| `danger` (story sx, error)| `#d32f2f`              | `rgba(211, 47, 47, 0.08)` ²          | `rgba(211, 47, 47, 0.5)`          | `rgb(211, 47, 47)`   |
| `warning` (story sx)      | `#ed6c02`              | `rgba(237, 108, 2, 0.08)` ²          | `rgba(237, 108, 2, 0.5)`          | `rgb(237, 108, 2)`   |
| `info` (story sx)         | `#0288d1`              | `rgba(2, 136, 209, 0.08)` ²          | `rgba(2, 136, 209, 0.5)`          | `rgb(2, 136, 209)`   |
| `success` (story sx)      | `#2e7d32`              | `rgba(46, 125, 50, 0.08)` ²          | `rgba(46, 125, 50, 0.5)`          | `rgb(46, 125, 50)`   |

¹ **MUI native primary path is 12 % main**. Selected = `alpha(palette.primary.main, 0.12)`. This is hard-coded in PaginationItem.js for `outlinedPrimary` / `outlinedSecondary` / `outlinedStandard` (selected) — see `node_modules/@mui/material/PaginationItem/PaginationItem.js` style block keyed on `selected: true`.

² **Story sx hard-codes 8 %** for danger / warning / info / success because the Merak Figma component bakes 8 % across all themed colors via the stacked-fill pattern (`seed/<C>/hover-bg` × 2 ≈ 7.84 %). Standardising on 8 % is a deliberate Merak design decision — the `primary` MUI 12 % is off-pattern and not reproduced for the other themed colors.

## 4. Size axis (Default color, Enabled / Selected)

Probed via `ColorSizeMatrix` (default row) and `ItemSelectedColorSizeMatrix`.

| Size   | item box     | `min-width` | `padding`   | `margin` (visible inter-item gap) | page font-size / line-height | icon SVG size (Previous/Next) | ellipsis font-size |
| ------ | ------------ | ----------- | ----------- | --------------------------------- | ---------------------------- | ----------------------------- | ------------------ |
| small  | `26 × 26 px` | `26 px`     | `0 4 px`    | `0 1 px` (gap **2 px**)           | `14 / 20.02 px`              | `18 × 18 px`                  | `14 px`            |
| medium | `32 × 32 px` | `32 px`     | `0 6 px`    | `0 3 px` (gap **6 px**)           | `14 / 20.02 px`              | `20 × 20 px`                  | `14 px`            |
| large  | `40 × 40 px` | `40 px`     | `0 10 px`   | `0 3 px` (gap **6 px**)           | `15 / 21.45 px`              | `22 × 22 px`                  | `15 px`            |

Notes vs the existing spec's §4.1 (now superseded by these runtime numbers — `figma.spec.md` §4 has been updated to match):

- **Padding**: spec said `4 / 6 / 8`; runtime is `4 / 6 / 10`. Large is 10 px, not 8 px.
- **Page font-size**: spec said `13 / 14 / 15`; runtime is `14 / 14 / 15`. Small is 14 px, not 13 px.
- **Icon SVG size**: spec said `18 / 22 / 26`; runtime is `18 / 20 / 22`.
- **Inter-item gap**: spec said `4 px` flat across all sizes; runtime is `2 / 6 / 6` derived from item `margin: 0 (1|3|3) px`. Figma wrapper auto-layout gap is currently authored at `4 px` — a compromise that's correct for none of the sizes. See §6 drift check 3.

## 5. Wrapper layout (`<Pagination>` root, color=default, size=medium)

Probed via `Default` story (count=10, page=5).

| Property                   | Value                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| `<nav>` root               | `display: block`, padding `0`, margin `0`, `aria-label="pagination navigation"`                |
| `<ul>` (`MuiPagination-ul`) | `display: flex`, `flex-wrap: wrap`, `padding: 0`, `gap: normal` (i.e. unset — gap comes from item margins) |
| Item count                 | 9 — `Previous · 1 · Ellipsis · 4 · 5* · 6 · Ellipsis · 10 · Next` (count=10, page=5; matches MUI default `siblingCount=1, boundaryCount=1`) |
| Inter-item visible gap     | `6 px` (each item carries `margin: 0 3 px`)                                                    |
| Total wrapper width        | grows with content; the `flex-wrap: wrap` lets it line-break on narrow surfaces                |

Item ordering matches the Figma wrapper composition (§6.2 of `figma.spec.md`) one-to-one. The Figma wrapper is a static composition keyed to `Total Pages ≥ 7` with a middle-page Selected — no runtime variability is encoded.

## 6. Drift checks

If a Storybook re-measure produces values that disagree with the tables above, treat the difference as one of these cases — do not silently update the spec:

1. **MUI upgrade** — `@mui/material` major bumps may change the hard-coded `0.23` outlined-border, the `0.12` selected overlay, the icon SVG sizes (`18/20/22`), or the padding ramp (`4/6/10`). Update `figma.spec.md` §1 MUI version row alongside this file.
2. **Theme override** — if `mui-theme.ts` introduces a `MuiPagination` / `MuiPaginationItem` `defaultProps` / `styleOverrides` block (this project has none today), document it in §1 and re-derive §1–§4 values.
3. **Outlined border token mismatch** — `0.23 black` (runtime) vs `0.12 black` (Figma `alias/colors/border-defalt`). Intentional Figma binding for dark-mode correctness; resolved alpha simply differs. If MUI migrates `PaginationItem` to `theme.palette.divider`, the runtime would then resolve to `0.12` and the divergence closes — record the alignment in §1.
4. **Disabled foreground / outlined-border** — runtime keeps `text.primary` (87 %-α) and `0.23 black` for outlined-disabled cells. Figma uses `alias/colors/text-disabled` (38 %-α) and `alias/colors/bg-disabled` (12 %-α) for better legibility. Acceptable design divergence (`figma.spec.md` §7 currently-open issue 3).

### Resolved (2026-04-28 runtime-truth pass)

The following drift items were resolved when the Figma cells were re-authored to match runtime — they no longer diverge:

5. ~~**Inter-item gap reconciliation** (Figma `4 px` flat → runtime `2 / 6 / 6 px`).~~ **Resolved.** Wrapper auto-layout `itemSpacing` is now per-Size (`Small=2`, `Medium=6`, `Large=6`).
6. ~~**Selected bg %** (Figma stacked ~8 % → MUI native 12 %).~~ **Resolved.** Themed `Page/<C>/Selected` cells now bind to `component/pagination/selected-bg-<c>` at 12 %-α.
7. ~~**Icon glyph identity** (Figma unicode `‹` / `›` text → MUI SVG chevrons).~~ **Resolved.** Previous / Next cells now hold INSTANCE of dedicated `<NavigateBefore>` / `<NavigateNext>` icon component sets at `18 / 20 / 22 px` per Size. Ellipsis stays as TEXT (matches MUI runtime).
8. ~~**Padding Large** (Figma `0 8` → runtime `0 10`).~~ **Resolved.** All `Size=Large` cells re-authored to `paddingLeft = paddingRight = 10`.
9. ~~**Page font Small** (Figma `13 px` → runtime `14 px`).~~ **Resolved.** All `Color=*, Type=Page, Size=Small` cells re-authored to `font-size: 14 px`, `letter-spacing: 0.1499 px`.
10. ~~**Ellipsis font Medium / Large** (Figma `16 / 18 px` → runtime `14 / 15 px`).~~ **Resolved.** All `Type=Ellipsis` cells re-authored to runtime ramp (`Small=14`, `Medium=14`, `Large=15`).

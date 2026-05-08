---
name: figma-component-tooltip-storybook-render
description: Computed-style matrix for `<Tooltip>` (MUI 7.3) derived from `node_modules/@mui/material/Tooltip/Tooltip.js` against the Storybook preview's default `createTheme()` (no overrides). Documents the Tooltip slot's runtime paint / typography / box metrics, the Arrow slot, the Placement axis (12 values), the Touch / non-Touch padding fork, and the drift-check protocol. Companion to `figma.spec.md` (the contract). Source-derived rather than browser-measured because Chrome DevTools MCP could not attach to the running Storybook profile during authoring (see §0).
parent_skill: figma-components
---

# `<Tooltip>` Storybook Render Measurements

Computed-style snapshot derived from `node_modules/@mui/material/Tooltip/Tooltip.js` resolved against MUI's default theme (`.storybook/preview.tsx` calls `createTheme()` with no overrides). Stories used as the contract: `Bottom` / `Top` / `Left` / `Right` (single-placement, default), `WithArrow`, `LongTitle`, `PlacementMatrix` (4 row-groups × 3 cells = 12 placements), `ArrowMatrix` (2 arrow-modes × 4 placements). These are the runtime numbers a Figma authoring pass should reproduce; if Storybook output diverges, the spec — not the runtime — is the source-of-truth, but the divergence is a red flag worth filing.

## 0. Methodology note

Chrome DevTools MCP could not attach to the local Storybook (port 6006) during authoring — the same profile-lock condition recorded in `<Chip>`'s `storybook.render.md` §0. The values below were derived from the MUI Tooltip source file (`node_modules/@mui/material/Tooltip/Tooltip.js`) resolved against the runtime palette / typography / shape (extracted with `node -e "createTheme()…"`); paints, paddings, fonts, and shadows in the default-theme path are deterministic, so the source-derived values match what the browser would compute. **Re-measure with Chrome DevTools MCP when the lock is cleared** and update §7 drift checks if any divergence appears (sub-pixel widths from `Roboto` text rendering, exact `transition` strings, popper margin offsets).

Storybook compile sanity-check — story IDs `components-tooltip--{docs,bottom,top,left,right,with-arrow,long-title,placement-matrix,arrow-matrix}` resolved against `http://localhost:6006/index.json` on 2026-05-07.

## 1. Tooltip slot — variant-axis invariants (default mode, no touch, no arrow)

Shared by every cell in `Bottom` / `Top` / `Left` / `Right` / `PlacementMatrix`. Source: `Tooltip.js:155-275` (default `TooltipTooltip` styled rules + the unconditional non-touch path).

| Property              | Value                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `display`             | inherited (`block` for the styled `<div>`); the popper wrapper is `position: absolute`   |
| `box-sizing`          | `border-box`                                                                             |
| `background-color`    | `rgba(97, 97, 97, 0.92)` (`alpha(palette.grey[700], 0.92)`) — `#616161EB`                |
| `color`               | `rgb(255, 255, 255)` (`palette.common.white`) — `#FFFFFF`                                |
| `border-radius`       | `4 px` (`shape.borderRadius`)                                                            |
| `padding`             | `4 px 8 px` (default mode)                                                               |
| `font-family`         | `"Roboto", "Helvetica", "Arial", sans-serif` (`typography.fontFamily`)                   |
| `font-size`           | `0.6875 rem = 11 px` (`typography.pxToRem(11)`, with default `htmlFontSize: 16`)         |
| `font-weight`         | `500` (`typography.fontWeightMedium`)                                                    |
| `line-height`         | inherits — resolves to `1.5` from CssBaseline `body { typography.body1 }`. Computed text height ≈ `16.5 px` per line at 11 px font. |
| `letter-spacing`      | inherits — resolves to `0.00938em` (body1)                                               |
| `max-width`           | `300 px`                                                                                 |
| `margin`              | `2 px` (no arrow) — applied to the inner Tooltip slot, not the popper                    |
| `word-wrap`           | `break-word`                                                                             |
| `transform-origin`    | per placement — see §3                                                                   |
| `box-shadow`          | `none` (Tooltip ships flat; no MUI shadow)                                               |
| `outline`             | inherits (`0`)                                                                           |
| `pointer-events`      | inherits (`none` is set on the popper wrapper when `!open`; the slot itself doesn't constrain) |
| `transition`          | not set on the Tooltip slot itself; the parent `Grow` transition handles `transform / opacity` |

The popper wrapper (`TooltipPopper`, `Tooltip.js:25-153`) has `pointer-events: none` when closed and otherwise carries `position: absolute` + Popper-driven `top / left / transform`. It's not styled in the resting open state.

## 2. Tooltip slot — touch mode (no Storybook story, listed for completeness)

When the user triggers Tooltip via long-press touch (or passes `enterTouchDelay` triggering `onTouchStart`), MUI sets `ownerState.touch = true` and the `touch` style variant (`Tooltip.js:200-209`) overrides:

| Property        | Default mode      | Touch mode                                    |
| --------------- | ----------------- | --------------------------------------------- |
| `padding`       | `4 px 8 px`       | `8 px 16 px`                                  |
| `font-size`     | `11 px`           | `14 px` (`pxToRem(14)`)                       |
| `line-height`   | inherited (`1.5`) | `round(16 / 14)em ≈ 1.1429em` (~`16 px` line) |
| `font-weight`   | `500`             | `400` (`typography.fontWeightRegular`)        |
| Popper margin to anchor (`top/bottom`) | `14 px` (no arrow) / `0` (arrow) | `24 px`               |
| Popper margin to anchor (`left/right`) | `14 px` / `0`     | `24 px`                                       |

The `Storybook` stories don't have a `touch=true` cell because MUI doesn't expose `touch` as a public prop — it's an `ownerState` flag set via the touch handlers. The Figma spec also does not model Touch as a variant axis; the design system targets the default-mode metrics. Document this trade-off in `figma.spec.md` §7 as a known divergence (designer-intent: visual mockups always reflect the cursor / keyboard interaction default).

## 3. Placement axis (12 values) — popper margins + arrow position

Source: `Tooltip.js:177-189` (per-placement transform-origin and tooltip→anchor margin) + `Tooltip.js:80-152` (arrow positioning). Placement is read from `data-popper-placement` and parsed via `placement.split('-')[0]` → primary direction.

The placement axis controls **two** things: the popper-to-anchor offset (gap), and (when `arrow=true`) which edge of the tooltip the arrow attaches to. The cross-axis suffix (`-start`, no suffix, `-end`) only shifts the popper position along the perpendicular axis — start aligns the tooltip's leading edge with the anchor's leading edge; end aligns trailing-to-trailing; no-suffix centers.

| Primary direction | Tooltip slot CSS rule (no arrow)                                       | Arrow attaches to                            | Transform origin                            |
| ----------------- | ---------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------- |
| `top` / `top-*`   | `margin-bottom: 14 px` (popper wrapper offset)                         | `bottom: 0; margin-bottom: -0.71em`          | `center bottom`                             |
| `bottom` / `bottom-*` | `margin-top: 14 px`                                                | `top: 0; margin-top: -0.71em`                | `center top`                                |
| `left` / `left-*` | `margin-right: 14 px` (LTR) / `margin-left: 14 px` (RTL)               | `right: 0; margin-right: -0.71em` (LTR)      | `right center`                              |
| `right` / `right-*` | `margin-left: 14 px` (LTR) / `margin-right: 14 px` (RTL)             | `left: 0; margin-left: -0.71em` (LTR)        | `left center`                               |

`-start` / `-end` cross-axis offsets are computed by Popper (`@popperjs/core`) at runtime from the anchor's bounding box; the source doesn't hard-code them. Visually:

- `top-start` / `bottom-start` → tooltip's left edge aligned with anchor's left edge
- `top-end` / `bottom-end` → tooltip's right edge aligned with anchor's right edge
- `left-start` / `right-start` → tooltip's top edge aligned with anchor's top edge
- `left-end` / `right-end` → tooltip's bottom edge aligned with anchor's bottom edge
- no-suffix → centered along the cross-axis

The 14 px popper margin shrinks to `0` when `arrow=true` (the `position: relative; margin: 0` variant in `Tooltip.js:191-198`) — the arrow itself sits at the boundary and provides the visual gap.

## 4. Arrow slot — `arrow=true`

Source: `Tooltip.js:277-310` (`TooltipArrow` styled span + `&::before` pseudo).

| Property                    | Value                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| `position`                  | `absolute`                                                                                     |
| `width`                     | `1 em` — resolves to `11 px` at default font-size (`14 px` in touch mode)                      |
| `height`                    | `0.71 em` — resolves to `~7.81 px` at default (`~9.94 px` touch). `0.71 ≈ 1/√2` (length of the rotated square's hypotenuse) |
| `box-sizing`                | `border-box`                                                                                   |
| `color`                     | `rgba(97, 97, 97, 0.9)` (`alpha(palette.grey[700], 0.9)`) — `#616161E5`                        |
| `overflow`                  | `hidden` (clips half of the rotated `::before` square so a triangle peeks out)                 |
| `&::before` `content`       | `""`                                                                                           |
| `&::before` `width / height`| `100%` of the parent (`1em × 0.71em`)                                                          |
| `&::before` `background`    | `currentColor` — inherits the `0.9 α` grey from the wrapper                                    |
| `&::before` `transform`     | rotated such that one diagonal becomes a triangle; per-placement transform-origin (§3)         |

The 0.92 vs 0.9 alpha delta between the Tooltip slot fill (`grey[700] × 0.92`) and the Arrow fill (`grey[700] × 0.9`) is a 2 % visible difference — barely perceptible against a white page background but observable when the tooltip overlays a saturated surface. Documented in `figma.spec.md` §7 as a runtime quirk; the design system pre-shipped `component/tooltip/fill = #616161E5` (≈ `0.898 α`, matching the Arrow alpha) and reuses it for **both** the Tooltip body and the Arrow paint — see §5 / `figma.spec.md` §7.

The arrow's resting margin into the tooltip body is `-0.71em` on whichever side it attaches (top / bottom / left / right), so the rotated square's tip pokes out 0 px (it's fully inside the body) and the visible edge is the arrow's outer half. Popper's runtime adjusts the parallel-axis offset so the tip aligns with the anchor's mid-point (or `start` / `end` per the cross-axis suffix).

## 5. MUI tokens that drive every paint above

The values in §1–§4 reduce to these palette / theme reads. Anyone re-deriving the values can plug a different theme into the same source paths and get a new resolution table.

| MUI token                                       | Default-theme value                                                |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| `palette.grey[700]`                             | `#616161` (Tooltip body / arrow base hue)                          |
| `palette.common.white`                          | `#FFFFFF` (Tooltip foreground)                                     |
| `palette.Tooltip.bg` (vars-mode only)           | n/a — `theme.vars` is **off** in this project's `createTheme()` call; the source falls through to the `alpha(grey[700], 0.92)` branch (`Tooltip.js:167`). If a future host app turns on `theme.vars`, the bg + arrow start sourcing from `Tooltip.bg` and may diverge from the alpha values above. |
| `shape.borderRadius`                            | `4` (px)                                                           |
| `typography.fontFamily`                         | `"Roboto", "Helvetica", "Arial", sans-serif`                       |
| `typography.pxToRem(11)`                        | `0.6875 rem` = `11 px` (with `htmlFontSize: 16`)                   |
| `typography.pxToRem(14)`                        | `0.875 rem` = `14 px`                                              |
| `typography.fontWeightMedium`                   | `500`                                                              |
| `typography.fontWeightRegular`                  | `400`                                                              |
| `typography.body1.lineHeight` (CssBaseline)     | `1.5` — inherited at the Tooltip slot                              |

## 6. Story-by-story expected output

### `components-tooltip--bottom` (default args)

Anchor: `<Button variant="outlined" size="small">Anchor</Button>` (≈ `54 × 30` px outlined-small Button at default theme).
Tooltip: `Tooltip` text, default mode (11 px / 500 / `4 8` padding), `bottom`, `arrow=false`.
Popper: `disablePortal: true` so the tooltip renders inline (Storybook screenshot tools can capture it).
Layout: tooltip sits below the anchor with a 14 px gap; tooltip width hugs the `"Tooltip"` text + 16 px horizontal padding ≈ `~50 px`; tooltip height ≈ `4 + 16.5 + 4 = ~24.5 px`.

### `components-tooltip--top` / `--left` / `--right`

Same dims; popper position differs per §3 placement rules. The decorator wraps with `Box sx={{ p: 6 }}` (48 px around) so the offset doesn't clip the cell.

### `components-tooltip--with-arrow`

`arrow=true`. Popper margin to anchor drops to `0` (arrow takes over the visual gap). Arrow span is `~11 × 7.81 px`, paint `#616161E5`. Tooltip body's `position: relative; margin: 0` (per `Tooltip.js:191-198`) replaces the default `margin: 2`.

### `components-tooltip--long-title`

`title` is the 130-char Lorem block. Tooltip wraps at `max-width: 300 px`; the resulting box is ~`300 × ~44 px` with 3 lines of text at 11 / 16.5 px line-height + 8 px vertical padding.

### `components-tooltip--placement-matrix`

Single rendered Stack of 4 rows (Top / Bottom / Left / Right) × 3 cells (`-start`, no-suffix, `-end`) = 12 cells. Each cell is a `240 × 120 px` dashed-border box housing an inline-rendered tooltip + anchor. The matrix lays out left-to-right, top-to-bottom. Use this story to verify all 12 placement variants render correctly side-by-side.

### `components-tooltip--arrow-matrix`

2 rows × 4 cells (top / bottom / left / right). Top row: `arrow=false`. Bottom row: `arrow=true`. Use this story to compare the popper-margin handoff between modes (14 px gap → arrow takes over).

## 7. Drift checks

If a Storybook re-measure (Chrome DevTools MCP, once the profile lock clears) produces values that disagree with the tables above, treat the difference as one of these cases — do not silently update the spec:

1. **Chrome DevTools MCP runtime confirmation pending** — the entire document is source-derived (§0). When a browser-based measurement is finally captured, sub-pixel rendering of Roboto Medium 11 px (`"Tooltip"` ≈ `25–28 px` measured width), exact `transition` computed string from the parent `Grow`, popper bounding-box rounding, and any inherited line-height resolution at the `<div>` level should be confirmed. Update the affected rows and remove this check item; treat it as the first thing to verify.
2. **MUI upgrade** — `@mui/material` major bumps may change Tooltip's padding, font-size, line-height, or popper offset (the `14 px` / `24 px` margin constants live in source, not theme). Update §1–§5 here in the same PR and bump `figma.spec.md` §1's MUI version row.
3. **Theme override** — `mui-theme.ts` (or any host-app theme) introduced a typography or palette override (especially `grey[700]`, `common.white`, `shape.borderRadius`, or a `vars`-mode `palette.Tooltip.bg`). Audit whether the override is intentional; if yes, document it in §1 / §5 of this file and update `figma.spec.md` §6.1 if the per-cell paint diverges.
4. **Touch mode visible in stories** — the current stories never set `ownerState.touch = true`, so the touch-mode rules in §2 are MUI-source-derived only. If a future story exercises touch (e.g. via `@testing-library/user-event` `pointerEvents: 'touch'`), re-measure padding / font-size / line-height and fold any divergence into §2.
5. **Vars-mode theme** — turning on `theme.vars` via `createTheme({ cssVariables: true })` re-sources `bg` and `arrow color` from `vars.palette.Tooltip.bg` (a single token, not the 0.92 / 0.9 alpha-pair). The arrow becomes alpha-identical to the body. If a future host app enables this, mark it in §5 and update `figma.spec.md` §7's runtime-divergence list.
6. **Browser-level rounding** — sub-pixel widths (Roboto Medium `"Tooltip"` ≈ `~25–28 px` depending on rendering) come from float math; they are stable across Chrome versions but may differ slightly on Firefox / Safari. Acceptable. Don't update the spec for sub-px diffs — record them here only.

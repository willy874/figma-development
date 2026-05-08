---
name: figma-component-pin-input-storybook-render
description: Computed-style snapshot for `<PinInput>` (project-local composer, MUI 7.3.10) measured against the Storybook preview's default `createTheme()` (no overrides). Documents the row layout (Stack with 8 px margin-left between children), the per-cell `<TextField variant="outlined" size="small">` paint / typography / box metrics, the `-` separator span typography, and the Label / Helper text styles. Companion to `figma.spec.md` (the contract).
parent_skill: figma-components
---

# `<PinInput>` Storybook Render Measurements

Computed-style snapshot of the project-local `PinInput` composer defined inline in `src/stories/PinInput.stories.tsx`. `@mui/material` ships **no** `<PinInput>` runtime; the composer assembles `<FormControl>` + optional `<FormLabel component="legend">` + `<Stack direction="row" spacing={1}>` of N `<TextField variant="outlined" size="small">` cells (per-cell `inputProps.style.padding: '8px 0'` + `textAlign: center` + `inputProps.maxLength: 1`) separated by an `-` span + optional `<FormHelperText>`. The PinInput-level state surface (`error` / `disabled` / `focusedIndex`) propagates to each cell as an MUI prop on the underlying TextField. Stories used as the contract: `FourCharacters` / `SixCharacters` / `Filled` / `Focused` / `Disabled` / `ErrorState` / `PartialEntry` / `CharacterMatrix` / `PropertyMatrix` / `StateMatrix`.

## 0. Methodology note

Captured via Chrome DevTools MCP against `http://localhost:6006/iframe.html?id=components-pininput--*` on 2026-05-08 with the `default createTheme()` palette / typography from `.storybook/preview.tsx`. The probe queried `MuiTextField-root`, `MuiOutlinedInput-notchedOutline`, the `<input>` element, the FormLabel `<legend>`, the FormHelperText, and the row Stack's direct children for `getComputedStyle` + `getBoundingClientRect`. Storybook compile sanity-check — story IDs `components-pininput--{four-characters,six-characters,with-label,without-label,with-helper,without-helper,filled,focused,disabled,error-state,partial-entry,character-matrix,property-matrix,state-matrix}` resolved against `http://localhost:6006/index.json` on 2026-05-08.

## 1. Row layout (shared by every variant)

Source: `PinInput.stories.tsx` composer + MUI `Stack` resolution against the default theme. The row Stack uses `direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ py: 0.5 }}` — Stack lays out children with `marginLeft: 8 px` on every child past the first (no CSS `gap`).

| Property                    | Value                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `display`                   | `flex` (Stack default)                                                                               |
| `flex-direction`            | `row`                                                                                                |
| `align-items`               | `center`                                                                                             |
| `justify-content`           | `center`                                                                                             |
| `gap`                       | `normal` (Stack uses `marginLeft` per child, **not** CSS `gap`)                                      |
| `padding-top` / `padding-bottom` | `4 px` (`sx={{ py: 0.5 }}` resolves to `theme.spacing(0.5)` = `4 px`)                           |
| Per-child `margin-left`     | First child = `0`; every subsequent direct child (cell or separator) = `8 px`                        |
| Direct children, `Character=4` | 4 `<TextField>` + 3 `<span aria-hidden>-</span>` separators = **7 children**, in alternating order |
| Direct children, `Character=6` | 6 `<TextField>` + 5 separators = **11 children**                                                  |
| Total row width, `Character=4` | `4×40 + 6×8 (margins on items 2…7) + 3×9.84 (separator natural width) ≈ 237.5 px`                |
| Total row width, `Character=6` | `6×40 + 10×8 + 5×9.84 ≈ 369.2 px`                                                                |

The natural width of a separator span (text-only, `display: inline`) at the typography in §3 is `~9.84 px` measured. The visible glyph centers itself in that span; visually there's `8 px (margin-left) + ~3 px (glyph half-leading) = ~11 px` between cell-edge and glyph-center, then the same on the trailing side.

## 2. Cell — `<TextField variant="outlined" size="small">` (Enabled, no value)

Source: MUI `OutlinedInput` resolved at `size="small"` against default theme + the per-cell `inputProps.style.padding: '8px 0'` + `textAlign: 'center'` + `width: 40` overrides from the composer.

| Layer                   | Property                       | Value                                                                                  |
| ----------------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| `MuiTextField-root`     | `width`                        | `40 px` (composer `sx={{ width: 40 }}`)                                                |
|                         | `min-width`                    | `0 px`                                                                                 |
|                         | rendered box                   | `40 × 39 px` (visible)                                                                 |
| `MuiOutlinedInput-root` (`MuiInputBase-root`) | `padding-*`     | `0 px` on all four sides (composer pushes padding onto `<input>`)                      |
|                         | `border-radius`                | `4 px` (`shape.borderRadius`)                                                          |
|                         | `background-color`             | `rgba(0, 0, 0, 0)` (transparent — outlined paint comes from the notched fieldset)      |
| `MuiOutlinedInput-notchedOutline` (the `<fieldset>`) | rendered box | `40 × 44 px` — extends `5 px` above the input row to reserve space for a floated label notch (PinInput never floats one, so the 5 px is dead space the design must accept) |
|                         | `border-style`                 | `solid`                                                                                |
|                         | `border-width`                 | `1 px`                                                                                 |
|                         | `border-color`                 | `rgba(0, 0, 0, 0.23)` — `_components/input/outlined/enabledborder`                     |
|                         | `border-radius`                | `4 px`                                                                                 |
| `<input>`               | `font-family`                  | `Roboto, Helvetica, Arial, sans-serif`                                                 |
|                         | `font-size`                    | `16 px`                                                                                |
|                         | `font-weight`                  | `400`                                                                                  |
|                         | `line-height`                  | `23 px` (≈ `1.4375` em — MUI `OutlinedInput` resolved height)                          |
|                         | `letter-spacing`               | `0.15008 px` ≈ `0.15 px` (`typography.body1.letterSpacing` in em → px)                 |
|                         | `color`                        | `rgba(0, 0, 0, 0.87)` — `alias/colors/text-default`                                    |
|                         | `text-align`                   | `center` (composer `inputProps.style.textAlign`)                                       |
|                         | `padding-top` / `padding-bottom` | `8 px` each (composer `inputProps.style.padding: '8px 0'`)                          |
|                         | `padding-left` / `padding-right` | `0 px` each (composer override; MUI default would be `14 px` for outlined-small)    |
|                         | `min-height`                   | `auto`                                                                                 |
|                         | `maxLength` attribute          | `1` (single character per cell)                                                        |

Computed cell-content height = `8 + 23 + 8 = 39 px`; the fieldset's outer box (`44 px`) overlaps the `5 px` reserved for the floated-label notch. Designers should treat the **visible** cell box as `40 × 40 px` (rounded from the runtime `40 × 39`); the notch overlap is invisible against a white surface and is captured in `figma.spec.md` §7 as a documented runtime divergence (the reference Figma painted the cell as a flat `40 × 40` without the notch overlap).

## 3. Separator span typography (`-` glyph)

The separator is a plain `<span style={SEPARATOR_STYLE} aria-hidden>-</span>` rendered inline between cells.

| Property         | Value                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------- |
| `font-family`    | `Roboto, Helvetica, Arial, sans-serif`                                                 |
| `font-size`      | `16 px`                                                                                |
| `font-weight`    | `400`                                                                                  |
| `line-height`    | `24 px` declared in the inline `SEPARATOR_STYLE`; computed `11 px` (the `<span>` is inline-laid-out and its measured `getBoundingClientRect` height collapses to the leading box) — for vertical alignment purposes treat as `24 px` matching the input |
| `letter-spacing` | `0.15008 px` ≈ `0.15 px`                                                               |
| `color`          | `rgba(0, 0, 0, 0.87)` — `alias/colors/text-default`                                    |
| Natural width    | `~9.84 px` (Roboto Regular 16 / 24, single `-` glyph)                                  |

## 4. Label — `<FormLabel component="legend">` (only when `label` prop is set)

Source: MUI `FormLabel` resolved against default theme. The composer passes `component="legend"` so the rendered tag is `<legend>` inside the FormControl's `<fieldset>` wrapper; the typography is identical to MUI's default `<FormLabel>` `<label>`.

| Property         | Enabled                                       | Disabled                                  | Error                                       |
| ---------------- | --------------------------------------------- | ----------------------------------------- | ------------------------------------------- |
| `font-family`    | `Roboto, Helvetica, Arial, sans-serif`        | same                                      | same                                        |
| `font-size`      | `16 px`                                       | same                                      | same                                        |
| `font-weight`    | `400`                                         | same                                      | same                                        |
| `line-height`    | `23 px` (≈ `1.4375` em — `MuiFormLabel` resolved) | same                                  | same                                        |
| `letter-spacing` | `0.15008 px` ≈ `0.15 px`                      | same                                      | same                                        |
| `color`          | `rgba(0, 0, 0, 0.6)` — MUI runtime resolves to `text.secondary` (no `text-secondary` token in this file's local collection — published Figma cell rebinds to `alias/colors/text-default`; see `figma.spec.md` §7 #5) | `rgba(0, 0, 0, 0.38)` — `alias/colors/text-disabled` | `rgb(211, 47, 47)` — `seed/danger/main` |
| Default text     | `"Label"`                                     | `"Label"`                                 | `"Label"`                                   |

> **Project-convention rebind.** MUI runtime resolves the resting FormLabel to `text.secondary` (`60 % α`). The local `merak` collection ships no `text-secondary` token; the reference Figma 天璇 file used `text-default` (`87 % α`), and so does the published `<PinInput>` here. The `text-secondary` reference above describes the **runtime resolution**, not a Figma binding. Captured in `figma.spec.md` §7 #5.

## 5. Helper text — `<FormHelperText>` (only when `helperText` prop is set)

Source: MUI `FormHelperText` resolved against default theme; sits below the row and inherits the FormControl's `error` / `disabled` flags.

| Property         | Enabled                                                  | Disabled                                | Error                                       |
| ---------------- | -------------------------------------------------------- | --------------------------------------- | ------------------------------------------- |
| `font-family`    | `Roboto, Helvetica, Arial, sans-serif`                   | same                                    | same                                        |
| `font-size`      | `12 px`                                                  | same                                    | same                                        |
| `font-weight`    | `400`                                                    | same                                    | same                                        |
| `line-height`    | `19.92 px` (≈ `1.66` em)                                 | same                                    | same                                        |
| `letter-spacing` | `0.39996 px` ≈ `0.4 px`                                  | same                                    | same                                        |
| `color`          | `rgba(0, 0, 0, 0.6)` — MUI runtime `text.secondary` (no `text-secondary` token in local collection; Figma cell rebinds to `alias/colors/text-default` per §4 callout) | `rgba(0, 0, 0, 0.38)` — `text-disabled` | `rgb(211, 47, 47)` — `seed/danger/main` |
| `margin-top`     | `3 px`                                                   | same                                    | same                                        |
| `margin-left` / `margin-right` | `14 px` each (MUI default)                 | same                                    | same                                        |
| Default text     | `"Helper text"`                                          | `"Helper text"`                         | `"Helper text"`                             |

## 6. State paints (per-cell — `<TextField>` outlined / small)

The `error` / `disabled` props propagate from PinInput → each TextField; `focusedIndex` only paints **one** cell at a time (the rest stay at the resting paint).

| State    | `MuiOutlinedInput-notchedOutline` border-color    | `MuiOutlinedInput-notchedOutline` border-width | `<input>` color                       |
| -------- | -------------------------------------------------- | --------------------------------------------- | ------------------------------------- |
| Enabled  | `rgba(0, 0, 0, 0.23)` — `_components/input/outlined/enabledborder` | `1 px`                            | `rgba(0, 0, 0, 0.87)` — `text-default`|
| Hovered  | `rgba(0, 0, 0, 0.87)` — `text-default` (the `:hover` rule on `MuiOutlinedInput-root`) | `1 px`     | `rgba(0, 0, 0, 0.87)` — unchanged     |
| Focused  | `rgb(25, 118, 210)` — `seed/primary/main` (light theme reference resolution) | `2 px`             | `rgba(0, 0, 0, 0.87)` — unchanged     |
| Disabled | `rgba(0, 0, 0, 0.26)` — `_components/input/outlined/disabledborder` | `1 px`                          | `rgba(0, 0, 0, 0.38)` (also `-webkit-text-fill-color`) — `text-disabled` |
| Error    | `rgb(211, 47, 47)` — `seed/danger/main` (light theme)| `1 px`                                       | `rgba(0, 0, 0, 0.87)` — unchanged     |

> **Hovered captured by source-derivation.** The `Focused` story (`focusedIndex=0`) and `Disabled` story (`disabled: true, values: [...]`) were measured in-browser; `Hovered` is a per-cell `:hover` pseudo-class and was not captured statically — the value above comes from `node_modules/@mui/material/OutlinedInput/OutlinedInput.js` (`&:hover .MuiOutlinedInput-notchedOutline { borderColor: theme.palette.text.primary }`). Hovered stacks with Disabled or Error: MUI's source caps Hovered at `text.primary` only when not disabled / not focused; on Error the Hovered border-color stays `seed/danger/main`. PinInput never models a "Hovered" axis at the row level; designers express it by switching the nested cell instance state.
>
> **`Focused` ≠ row-level focus.** Each cell focuses independently at runtime. The `Focused` story renders exactly one cell with the `focused` prop forced — mirrors a real keyboard caret on cell `i`. The Figma component should not introduce a row-level `Focused` axis; designers paint focus by overriding individual cells (see `figma.spec.md` §3 / §6).

## 7. Story-by-story expected output

### `components-pininput--four-characters` (default args: `length=4, label="Label"`)

Row of 4 cells × `box.cell.width` separated by 3 `-` glyphs. Total row width = `row4.width`. Top label "Label" at `type.label.*` typography, color = MUI runtime `text.secondary` (Figma cell rebinds to `alias/colors/text-default`); no helper. Cell border = `border.cell.width-resting` / `paint.cell.border.enabled`; input value = empty (placeholder character is the `​` zero-width-space the composer renders when `value === ''`).

### `components-pininput--six-characters`

Row width = `row6.width`. 6 cells + 5 separators. Otherwise identical to `FourCharacters`.

### `components-pininput--filled`

`length=4, values=['1','2','3','4']`. Same border / typography as `FourCharacters` (Filled doesn't change Outlined border-color); each `<input>` carries its single character centered.

### `components-pininput--focused`

`focusedIndex=0`. Cell `0` border = `border.cell.width-focused` and `paint.cell.border.focused`; cells 1-3 stay at the resting `border.cell.width-resting` and `paint.cell.border.enabled`.

### `components-pininput--disabled`

`disabled=true, values=['1','2','3','4']`. Every cell: border = `paint.cell.border.disabled`; `<input>` color + `-webkit-text-fill-color` = `paint.input.text.disabled`. FormLabel color shifts to `paint.label.disabled`.

### `components-pininput--error-state`

`error=true, helperText="Helper text"`. Every cell border = `paint.cell.border.error`. FormLabel color = `paint.label.error`. FormHelperText below the row at `type.helper.*` typography, color `paint.helper.error`, with `box.helper.margin-top` top spacing and `box.helper.margin-x` horizontal margin.

### `components-pininput--partial-entry`

`length=6` with `cellOverrides: [{value:'1', disabled:true}, {value:'2', disabled:true}, {value:'3', disabled:true}, {focused:true}, {}, {}]`. Mirrors the reference Figma's "Use Case > Example 01" row 3: three filled-disabled cells, one focused-empty cell, two resting-empty cells. Each cell renders independent state per the `<TextField>` overrides — the Figma counterpart is a `<PinInput Character=6>` instance with three nested `<TextField>` instances overridden to `State=Disabled, Has Value=True, Value=1/2/3`, one to `State=Focused, Has Value=False`, and two left at default.

### `components-pininput--character-matrix`

2 rows (`with label` / `no label`) × 2 columns (length=4 / length=6) = 4 cells. Each cell renders the row layout from §1 with the corresponding props.

### `components-pininput--property-matrix`

2 rows (`helper = true / false`) × 2 columns (`label = true / false`) = 4 cells. Each cell renders with `length=4`.

### `components-pininput--state-matrix`

5 rows (Default / Filled / Focused / Disabled / Error) × 2 columns (length=4 / length=6) = 10 cells. State combinations applied to **every** cell in the row (except `Focused`, which only paints index 0 to mimic real keyboard interaction).

## 8. Drift checks

If a Storybook re-measure produces values that disagree with the tables above, treat the difference as one of these cases — do not silently update the spec:

1. **MUI upgrade** — `@mui/material` major bumps may change OutlinedInput's border-color resolution, default padding (`8.5 px 14 px` for outlined-small), or FormHelperText's `mt: 3 px` constant. Update §1–§6 here in the same PR and bump `figma.spec.md` §1's MUI version row (currently `^7.3.10`).
2. **Theme override** — `mui-theme.ts` (or any host-app theme) introduced a typography or palette override (especially `palette.text.primary` / `text.secondary` / `text.disabled`, `palette.primary.main`, `palette.error.main`, `shape.borderRadius`). Audit whether the override is intentional; if yes, document in §6 / §5 and update `figma.spec.md` §6.1 if the per-cell paint diverges.
3. **Composer override drift** — the per-cell `inputProps.style.padding: '8px 0'` + `textAlign: 'center'` lives in `src/stories/PinInput.stories.tsx`. If a future change reverts to MUI's outlined-small default (`8.5 px 14 px`), the visible glyph shifts left of center because there's only `40 - 28 = 12 px` of horizontal room — re-measure §2 and update both the spec and the Figma cell padding.
4. **FormLabel paint divergence** — captured in §4: MUI runtime resolves to `text.secondary` (60 % α). The local design system has no `text-secondary` token, so the published Figma cell follows the project convention and binds to `alias/colors/text-default` (87 % α — matches the reference Figma 天璇). If a future MUI upgrade shifts the runtime resting color **or** the local collection grows a `text-secondary` token, update §4 / §5 / §9 here and `figma.spec.md` §7 #5 / §10.2.
5. **`@mui/material` no longer ships `<TextField variant="outlined" size="small">` with the same internal layer hierarchy** (e.g. removes `MuiOutlinedInput-notchedOutline` `<fieldset>` in favor of a `<div>` with `box-shadow: inset 0 0 0 1px`). Re-derive §2 and update the Figma authoring layer names in `figma.spec.md` §6.
6. **Focused border-width tweak** — MUI 7.x ships `border-width: 2 px` on the `Mui-focused` outlined fieldset. If the runtime shifts to a `box-shadow`-based focus ring (or to `1 px + outline-offset`), the Figma cell's Focused state must be re-authored — currently a `2 px` stroke is the published value.

## 9. Canonical Constants

The single source of truth for every distinct numeric / hex value above. `figma.spec.md` §6.1 lifts this block verbatim; per-variant tables cite by name.

```text
# box.* — geometry
box.cell.width                = 40 px
box.cell.height               = 40 px      (visible — runtime is 40 × 39; round to 40 in Figma)
box.cell.notch-overhang       = 5 px       (MuiOutlinedInput-notchedOutline extends 5 px above the input — captured as a §7 spec divergence; Figma flattens to 0)
box.row.gap                   = 8 px       (Stack marginLeft between every direct child past the first)
box.row.padding-y             = 4 px       (Stack sx py:0.5 → theme.spacing(0.5) = 4 px)
box.row.padding-x             = 0 px
box.input.padding-y           = 8 px       (composer inputProps.style.padding '8px 0')
box.input.padding-x           = 0 px       (composer override; MUI default for outlined-small would be 14 px)
box.input.min-height          = auto
box.helper.margin-top         = 3 px
box.helper.margin-x           = 14 px      (MUI FormHelperText default)
box.label.margin-top          = 0 px
box.label.margin-bottom       = 0 px       (FormControl flex-direction: column; label sits directly above the row)

# radius.*
radius.cell                   = 4 px       (shape.borderRadius)

# border.*
border.cell.width-resting     = 1 px
border.cell.width-focused     = 2 px

# paint.*
paint.cell.fill               = transparent (rgba 0,0,0,0 — outlined paint = stroke only)
paint.cell.border.enabled     = rgba(0, 0, 0, 0.23)   # _components/input/outlined/enabledborder
paint.cell.border.hovered     = rgba(0, 0, 0, 0.87)   # alias/colors/text-default (MUI :hover rule)
paint.cell.border.focused     = #1976D2               # seed/primary/main (light theme)
paint.cell.border.disabled    = rgba(0, 0, 0, 0.26)   # _components/input/outlined/disabledborder
paint.cell.border.error       = #D32F2F               # seed/danger/main (light theme)
paint.input.text.enabled      = rgba(0, 0, 0, 0.87)   # alias/colors/text-default
paint.input.text.disabled     = rgba(0, 0, 0, 0.38)   # alias/colors/text-disabled
paint.separator.text          = rgba(0, 0, 0, 0.87)   # alias/colors/text-default
paint.label.enabled           = rgba(0, 0, 0, 0.6)    # MUI runtime: text.secondary. Project convention rebinds Figma cell to alias/colors/text-default (no text-secondary token in local collection — see figma.spec.md §7 #5)
paint.label.disabled          = rgba(0, 0, 0, 0.38)   # alias/colors/text-disabled
paint.label.error             = #D32F2F               # seed/danger/main
paint.helper.enabled          = rgba(0, 0, 0, 0.6)    # MUI runtime: text.secondary. Project convention rebinds Figma cell to alias/colors/text-default (see figma.spec.md §7 #5)
paint.helper.disabled         = rgba(0, 0, 0, 0.38)   # alias/colors/text-disabled
paint.helper.error            = #D32F2F               # seed/danger/main

# shadow.*
shadow.cell                   = none

# type.* — typography (Roboto Regular, Helvetica/Arial fallback)
type.input.font-family        = "Roboto, Helvetica, Arial, sans-serif"
type.input.font-size          = 16 px
type.input.font-weight        = 400
type.input.line-height        = 23 px      (≈ 1.4375 em — MuiOutlinedInput resolved)
type.input.letter-spacing     = 0.15 px    (0.15008 px in computed)
type.input.text-align         = center     (composer override)
type.label.font-family        = "Roboto, Helvetica, Arial, sans-serif"
type.label.font-size          = 16 px
type.label.font-weight        = 400
type.label.line-height        = 23 px
type.label.letter-spacing     = 0.15 px
type.helper.font-family       = "Roboto, Helvetica, Arial, sans-serif"
type.helper.font-size         = 12 px
type.helper.font-weight       = 400
type.helper.line-height       = 19.92 px   (≈ 1.66 em)
type.helper.letter-spacing    = 0.4 px     (0.39996 px in computed)
type.separator.font-family    = "Roboto, Helvetica, Arial, sans-serif"
type.separator.font-size      = 16 px
type.separator.font-weight    = 400
type.separator.line-height    = 24 px      (declared in SEPARATOR_STYLE — Figma cell renders text style input/value)
type.separator.letter-spacing = 0.15 px
type.separator.glyph          = "-"
type.separator.natural-width  = 9.84 px    (Roboto Regular 16/24 single "-" glyph; measured via getBoundingClientRect — used by figma.spec.md §6.1 row-width math)

# rowN.* — derived row widths (cited by figma.spec.md §6.1)
row4.width                    = 237.5 px   (≈ 4 × box.cell.width + 3 × type.separator.natural-width + 6 × box.row.gap + 2 × box.row.padding-x)
row6.width                    = 369.2 px   (≈ 6 × box.cell.width + 5 × type.separator.natural-width + 10 × box.row.gap + 2 × box.row.padding-x)

# header.* — vertical contributions of optional rows (cited by figma.spec.md §6.1)
header.label.height           = 23 px      (= type.label.line-height — FormLabel TEXT box)
header.helper.height          = 22.92 px   (= type.helper.line-height + box.helper.margin-top — FormHelperText TEXT box + its top padding)
```

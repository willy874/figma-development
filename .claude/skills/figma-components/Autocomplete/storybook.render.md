---
name: figma-component-autocomplete-storybook-render
description: Computed-style matrix for `<Autocomplete>` measured against `src/stories/Autocomplete.stories.tsx` via Chrome DevTools MCP. Documents runtime per-variant box / paint / typography numbers across the Variant × Size × State × Multiple surface, plus the popper / listbox / option geometry exposed when `open` is true. Companion to `figma.spec.md` (the contract) and (optionally) `design-token.md` for any component-scoped tokens minted by the spec.
parent_skill: figma-components
---

# `<Autocomplete>` Storybook Render Measurements

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/Autocomplete.stories.tsx`. Stories used: `StateMatrix` (4 states × 3 variants, Size=Medium, Has Value=True), `OpenMatrix` (3 variants × {single, multiple}, Size=Medium, popper rendered inline via `disablePortal`), `MultipleMatrix` (3 variants × 2 sizes × {has-value, empty}), `OpenWithValue` (selected option + manually-applied `Mui-focused` class for hover paint).

Autocomplete is a wrapper around `<TextField>` (via `renderInput`), so every paint / typography number on the **input row** matches `<TextField>`'s `storybook.render.md` at the same `(Variant, Size, State, Has Value)` coordinate. This document only enumerates the deltas Autocomplete adds:

- **End adornment** — popup-arrow icon (always) + clear icon (visible when has value, hidden but layout-occupying otherwise).
- **Tag chips** — when `multiple={true}`, selected values render as `<Chip size="small|medium">` inside the input; the wrapper grows to fit a wrapping flex row.
- **Popper / listbox / option** — when `open={true}`, the dropdown lists each option in a `<ul>` rendered via `Paper`; portaled by default, inlined via `disablePortal`.

If a Storybook re-measure produces values that disagree with the tables below, treat the difference as one of the cases in §6.

## 1. Input row deltas vs `<TextField>`

The input row reuses every TextField paint / stroke / typography. Autocomplete adds an **end-adornment column** holding the popup arrow (and the clear icon when has value):

| Property                                    | Standard       | Filled         | Outlined       |
| ------------------------------------------- | -------------- | -------------- | -------------- |
| Wrapper height — Medium · Single            | `32 px`        | `56 px`        | `56 px`        |
| Wrapper height — Medium · Multiple (1 chip) | `40 px`        | `56 px`        | `56 px`        |
| Wrapper padding-right (Single, has value)   | `30 px`        | `39 px`        | `39 px`        |
| Wrapper padding-right (Multiple, has value) | `56 px`        | `65 px`        | `65 px`        |

> **Small probe deferred.** Only `Size=Medium` was sampled in this snapshot. Spec §4.1 lists Size=Small wrapper heights as Figma-only projections (Standard `29 px`, Filled `48 px`, Outlined `40 px`) inferred from the `<TextField>` storybook.render.md §3 — Autocomplete adds no wrapper-height delta over TextField at the same Variant × Size, so the projections are mechanical. Re-measure via `SizeMatrix` when expanding the published Figma set to Size=Small.
| End-adornment position                      | absolute, `top: 16` (Std-Md) / `28` (Fld-Md, Out-Md), `right: 0` (Std) / `9` (Fld, Out) | same | same |
| End-adornment width (Single)                | `26 px` (1 button: popup arrow only when no value; popup + reserved clear slot when has value but clear hidden) | same | same |
| End-adornment width (Multiple)              | `52 px` (popup arrow + clear icon, both visible when has value) | same | same |

Notes:

- Wrapper padding-right grows by **`+30 px`** (single) or **`+56 px`** (multiple) over the TextField baseline to make room for the icon buttons. Standard's underline / Filled's underline / Outlined's fieldset border are unaffected.
- The end-adornment is `position: absolute` so it stays vertically centered regardless of how many tag-chip rows the wrapper holds. `top: 16 px` (Standard medium) / `28 px` (Filled medium, Outlined medium) places it at the input's vertical midline.
- Outlined wrapper padding stays `9 / 9 / 9 / 9 px` even when adornments are present (different from `<TextField>`'s adornment-aware padding redistribution); the absolute-positioned end adornment uses `right: 9 px` to clear the fieldset stroke.

## 2. End adornment (popup + clear icon buttons)

| Property                       | Resting              | Disabled             | Open (popper visible)                   |
| ------------------------------ | -------------------- | -------------------- | --------------------------------------- |
| Button size (`<IconButton>`)   | `28 × 28 px`         | `28 × 28 px`         | `28 × 28 px`                            |
| Button padding                 | `2 px` (popup), `4 px` (clear) | same       | same                                    |
| Button color                   | `rgba(0,0,0,0.54)` (`action.active`) | `rgba(0,0,0,0.26)` (`action.disabled`) | unchanged |
| Popup arrow rotation           | `none`               | `none`               | `matrix(-1, 0, 0, -1, 0, 0)` (180°)     |
| Popup arrow SVG fill           | `currentColor` → button color | `currentColor` → button color | unchanged |
| Clear icon visibility          | `visible` when `has value && !disabled && !disableClearable`; `hidden` (occupies layout) otherwise | `hidden` | `visible` if has value |
| Clear icon SVG dimensions      | `1em` × `1em` (`16 × 16` px at default font, but inherits parent line-height) | same | same |

Notes:

- **Popup arrow icon** is `<ArrowDropDownIcon>` from `@mui/icons-material` at runtime (`24 × 24 viewBox`, fill = `currentColor`). The Figma equivalent is the shared `<Icon>` set's `SelectArrow` glyph (`3:2900`).
- **Clear icon** is `<ClearIcon>` (`24 × 24 viewBox`, fill = `currentColor`). The Figma equivalent is the shared `<Icon>` set's `Close` glyph (`3:2759`).
- Clear icon's `visibility: hidden` (not `display: none`) means it occupies layout space whenever has-value applies — the wrapper's `padding-right` already accounts for both buttons.

## 3. Tag chips (multiple={true}, has value)

Tag chips are MUI `<Chip>` instances scoped to the input wrapper. Autocomplete forwards its own `size` prop to the chip — `small` (default Autocomplete size from MUI) renders 24-px chips; passing `size="medium"` to Autocomplete renders 32-px chips.

| Property                   | Autocomplete `size="small"`         | Autocomplete `size="medium"`        |
| -------------------------- | ----------------------------------- | ----------------------------------- |
| Chip height                | `24 px`                             | `32 px`                             |
| Chip border-radius         | `16 px` (pill — `Chip.size="small"`'s 16 px shape, not the 16 px from medium) | `16 px` |
| Chip background            | `rgba(0, 0, 0, 0.08)`               | `rgba(0, 0, 0, 0.08)`               |
| Chip margin (per-chip)     | `2 px`                              | `3 px`                              |
| Chip label font            | Roboto 400, `13 / 19.5 px`          | same                                |
| Chip label color           | `rgba(0, 0, 0, 0.87)`               | same                                |
| Chip label padding         | `0 8 px`                            | `0 12 px`                           |
| Chip delete-icon size      | `16 × 16 px`                        | `22 × 22 px`                        |
| Chip delete-icon margin    | `-4 / 4 px` (left / right)          | `-6 / 5 px`                         |
| Chip delete-icon color     | `rgba(0, 0, 0, 0.26)`               | same                                |

Notes:

- Tag chips are always **filled, default-color** Chips — Autocomplete does not expose a way to pick the Variant or Color axis of the underlying Chip. Background `rgba(0, 0, 0, 0.08)` matches MUI `<Chip color="default" variant="filled">` resting.
- The wrapper has `flex-wrap: wrap`, so multiple chips that exceed the width grow the wrapper vertically (`min-height: auto` is hoisted to fit the flex children).
- Pixel-perfect chip heights match the standalone `<Chip>` Figma spec (`.claude/skills/figma-components/Chip/figma.spec.md`); the only delta is the surrounding `MuiAutocomplete-tag` wrapper's `margin: 2|3 px`.

## 4. Popper / listbox / option

Captured from `OpenMatrix` (medium · single, all three variants) with `disablePortal` so the popper renders as a sibling of the autocomplete.

| Property                          | Value                                   | Notes                                                         |
| --------------------------------- | --------------------------------------- | ------------------------------------------------------------- |
| Popper position                   | `absolute`                              | Anchors below the input wrapper.                              |
| Popper width                      | matches input wrapper width (`242 px` for `width=240` autocomplete; +2 px for the border) | Auto-sized via Popper.js. |
| Popper z-index                    | `1300`                                  | MUI default `theme.zIndex.modal` — Figma: paint above sibling content. |
| Paper background                  | `rgb(255, 255, 255)`                    | `palette.background.paper`.                                   |
| Paper border-radius               | `4 px`                                  | `theme.shape.borderRadius`.                                   |
| Paper box-shadow                  | `0 2 1 -1 rgba(0,0,0,0.2), 0 1 1 0 rgba(0,0,0,0.14), 0 1 3 0 rgba(0,0,0,0.12)` | MUI `shadows[1]` (Material Design elevation 1). |
| Listbox padding (T / B)           | `8 / 8 px`                              | Top / bottom inset on the `<ul>`.                             |
| Listbox max-height                | `196 px`                                | Hard-coded by MUI; scrolls past 5–6 options at default 36 px row. |
| Listbox overflow                  | `auto`                                  | Vertical scroll when options exceed max-height.               |
| Option min-height                 | `0 px` (intrinsic; height = `36 px` from line-height + padding) | |
| Option padding                    | `6 16 6 16 px`                          | T R B L. The `16 px` left padding aligns with `palette.divider` MUI defaults. |
| Option font                       | Roboto 400, `16 / 24 px`, ls `0.15 px`  | `body1` typography — same family/size as input value.         |
| Option color (resting)            | `rgba(0, 0, 0, 0.87)`                   | `text.primary`.                                               |
| Option background (resting)       | transparent                             |                                                               |
| Option background (hover / focused) | `rgba(0, 0, 0, 0.04)`                 | `action.hover`. Applied via `.Mui-focused` class on the option (Autocomplete only highlights one option at a time — `:hover` and keyboard arrow share the same class). |
| Option background (selected, not focused) | `rgba(25, 118, 210, 0.08)`        | `primary.main × selectedOpacity (0.08)`. (`palette.action.selectedOpacity`.) |
| Option background (selected + focused)    | `rgba(25, 118, 210, 0.12)`        | `primary.main × (selectedOpacity 0.08 + focusOpacity 0.04) = 0.12`. |
| Option font-weight (selected)     | `400`                                   | MUI does **not** bold the selected option text — the bg tint is the only selected cue. |

Notes:

- **`Mui-focused` ≠ `:focus`.** Autocomplete maintains a "highlighted option" via the `Mui-focused` class on the `<li role="option">` — keyboard arrow keys move it, mouse hover sets it. The class shares paint with hover. There is no separate `:hover` selector for options.
- **Selected vs focused stack.** `aria-selected="true" + Mui-focused` paints `0.12α` of `primary.main`; the document's `OpenWithValue` story renders the matched option with both classes (the selected option auto-receives `Mui-focused` on open).
- **No focus ring.** Options have `outline: none` in MUI; the bg tint is the only visual cue for keyboard navigation.

## 5. Has Value × Multiple matrix (medium, enabled)

Combining §1 / §3 measurements into a single grid:

| Variant   | Multiple | Has Value | Wrapper height | Wrapper padding-right | End-adornment width |
| --------- | -------- | --------- | -------------- | --------------------- | ------------------- |
| Standard  | false    | false     | `32 px`        | `30 px`               | `26 px` (popup only)|
| Standard  | false    | true      | `32 px`        | `30 px`               | `26 px` (popup + reserved hidden clear) |
| Standard  | true     | false     | `40 px` (1 row, 0 chips → label height) | `30 px` | `26 px` |
| Standard  | true     | true      | grows by `+34 px` per chip row (`32 + n × 34`) | `56 px` | `52 px` (popup + clear) |
| Filled    | false    | false     | `56 px`        | `39 px`               | `26 px`             |
| Filled    | false    | true      | `56 px`        | `39 px`               | `26 px`             |
| Filled    | true     | false     | `56 px`        | `39 px`               | `26 px`             |
| Filled    | true     | true      | `56 + n × 34 px` | `65 px`             | `52 px`             |
| Outlined  | false    | false     | `56 px`        | `39 px`               | `26 px`             |
| Outlined  | false    | true      | `56 px`        | `39 px`               | `26 px`             |
| Outlined  | true     | false     | `56 px`        | `39 px`               | `26 px`             |
| Outlined  | true     | true      | `56 + n × 34 px` | `65 px`             | `52 px`             |

Where `n` is the number of chip rows once chips wrap. With one chip and the default 280 px width, chips fit on a single row → wrapper retains its single-line height; once chips overflow, each new row adds `~34 px` (chip height `32 px` + chip vertical margin `2 × 1 px`).

## 6. Drift checks

If a re-measure disagrees with the tables above, treat the difference as one of:

1. **MUI upgrade** — major bumps to `@mui/material` (`^7.3.10` resolved 2026-04-29) often retune `popper.zIndex`, `Mui-focused` opacity (currently `0.04`), or the `selectedOpacity` (`0.08`). Update §3 / §4 in the same PR and bump the version row in `figma.spec.md` §1.
2. **Theme override** — `.storybook/preview.tsx` currently uses `createTheme()` with no overrides. Adding `MuiAutocomplete.defaultProps` / palette retints / a custom `shadows[1]` forces a re-measure of every column above.
3. **Listbox max-height bump** — MUI's hard-coded `196 px` matches roughly 5 option rows at the default 36 px height. If a host overrides `slotProps.listbox.style.maxHeight`, the popper height changes but option geometry stays.
4. **Selected paint stack** — `0.08α + 0.04α = 0.12α` for selected+focused is the MUI primary tint × `palette.action.selectedOpacity + palette.action.focusOpacity`. Custom palettes (`primary` set to a non-blue) only change the hue, not the alpha math.
5. **Disabled option** — disabled options (rare, set via `getOptionDisabled`) inherit `Mui-disabled` paint: `pointer-events: none`, `opacity: 0.38`. Not measured here because the stories don't exercise it; if a host needs it, add a `getOptionDisabled` row to `OpenMatrix` and re-measure.

## 7. Linkage to `<TextField>` measurements

Every paint / size / typography number for the input row that is **not** listed in §1–§5 here is inherited from `<TextField>` and documented in `.claude/skills/figma-components/TextField/storybook.render.md`. Specifically:

- §1 Variant invariants (wrapper bg, underline / fieldset, label translate) — `TextField` §1.
- §2 State axis (Enabled / Focused / Disabled / Error label / underline / fieldset paints) — `TextField` §2.
- §3 Size axis (small vs medium wrapper height + input padding) — `TextField` §3.
- §4 Has Value (un-shrunk vs floated label) — `TextField` §4.
- §5 Adornment (start-adornment behaviour) — `TextField` §5. Autocomplete does not surface a start-adornment slot; if a host application drops one in via `slotProps.input.startAdornment`, treat it as the same surface as TextField's start adornment.
- §6 Helper text — `TextField` §6.
- §7 Multiline — n/a here (Autocomplete does not support `multiline`; the input row is always single-line, and chips wrap by growing the wrapper rather than the input element).

When updating either spec, propagate visual deltas across both files in the same change.

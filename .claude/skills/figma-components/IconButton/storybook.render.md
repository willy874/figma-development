---
name: figma-component-iconbutton-storybook-render
description: Computed-style matrix for `<IconButton>` (MerakIconButton v1) measured against `src/stories/IconButton.stories.tsx` via Chrome DevTools MCP. Documents the runtime per-variant box / paint / shadow numbers, the color × state grid, the icon glyph size, and the divergence between MUI's native IconButton (no `variant` prop) and the Merak Figma extension that adds Text / Outlined / Contained. Companion to `figma.spec.md` (the contract).
parent_skill: figma-components
---

# `<IconButton>` Storybook Render Measurements (v1)

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/IconButton.stories.tsx`. Stories used: `ColorMatrix` (6 colors × 3 variants, Enabled) and `StateMatrix` (3 states × 3 variants, Primary). MUI's native `IconButton` exposes no `variant` prop; the story injects Contained / Outlined visuals via `sx` overrides so every Figma cell has a runtime equivalent — this is faithful to the Merak design extension Figma encodes, **not** to MUI default behavior. Where the Merak `<IconButton>` borrows a behavior from `<Button>` (e.g. shadow ramp, darker `hover` background on Contained), we cite the Button render doc rather than duplicating numbers.

## 1. Variant-axis invariants (Medium, Enabled)

The columns differ on padding / border / fill / shadow. Everything else is shared across all 18 (color × variant) cells in `ColorMatrix`.

| Property                | Text                              | Outlined                                   | Contained                                                                              |
| ----------------------- | --------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------- |
| `display` / `cursor`    | `inline-flex` / `pointer`         | same                                       | same                                                                                   |
| `box-sizing`            | `border-box`                      | `border-box`                               | `border-box`                                                                           |
| outer width × height    | `40 × 40 px`                      | `42 × 42 px` (1 px border on each side)    | `40 × 40 px`                                                                           |
| `padding`               | `8 px`                            | `8 px`                                     | `8 px`                                                                                 |
| `border-radius`         | `50 %`                            | `50 %`                                     | `50 %`                                                                                 |
| `border`                | none                              | `1 px solid <color × 0.5α>`                | none                                                                                   |
| `box-shadow` (Enabled)  | `none`                            | `none`                                     | shadows-2: `0 3 1 -2 rgba(0,0,0,.20), 0 2 2 0 rgba(0,0,0,.14), 0 1 5 0 rgba(0,0,0,.12)` |
| `font-size`             | `24 px`                           | `24 px`                                    | `24 px`                                                                                |
| `transition`            | `background-color 0.15s cubic-bezier(0.4,0,0.2,1)` | same                       | same                                                                                   |
| icon glyph              | inline `24 × 24` SVG, `fill: currentColor` | same                              | same                                                                                   |

**Sizing divergence vs Figma (`1:4571`).** Every cell on the editable Figma frame is `36 × 36 px` (4 px smaller than runtime, except Outlined which is 6 px smaller). The runtime numbers above derive from MUI's defaults: `padding: 8`, `font-size: pxToRem(24)` ⇒ `8 + 24 + 8 = 40 px`. The Figma frame appears to have been authored against a `20 px` icon (`8 + 20 + 8 = 36 px`). Step 5 of the figma-create-component pipeline must reconcile this — preferred resolution is to bring Figma to `40 × 40` with a 24 px icon slot to match runtime.

## 2. Color axis — palette resolution (Enabled)

Each Merak color resolves to a documented MUI palette hex. Per-variant paint rules are mechanical and align with `<Button>`'s mapping:

- **contained** → `background = palette.<color>.main` (or `grey.300` for Default), `color = palette.<color>.contrastText` (`text.primary` for Default).
- **outlined** → `background = transparent`, `color = palette.<color>.main` (or `text.primary` for Default), `border = 1 px solid palette.<color>.main × 0.5α` (Default uses solid `text.primary`).
- **text** → `background = transparent`, `color = palette.<color>.main` (or `text.primary` for Default), no border.

| Merak (MUI key)  | `palette.<color>.main` | contained bg          | outlined / text fg    | outlined border (`.5α`)         |
| ---------------- | ---------------------- | --------------------- | --------------------- | ------------------------------- |
| default (inherit)| n/a (uses `grey-300`)  | `rgb(224, 224, 224)`  | `rgba(0, 0, 0, 0.87)` | `rgba(0, 0, 0, 0.87)` (no α)¹  |
| primary          | `#1976d2`              | `rgb(25, 118, 210)`   | `rgb(25, 118, 210)`   | `rgba(25, 118, 210, 0.5)`       |
| danger (error)   | `#d32f2f`              | `rgb(211, 47, 47)`    | `rgb(211, 47, 47)`    | `rgba(211, 47, 47, 0.5)`        |
| warning          | `#ed6c02`              | `rgb(237, 108, 2)`    | `rgb(237, 108, 2)`    | `rgba(237, 108, 2, 0.5)`        |
| info             | `#0288d1`              | `rgb(2, 136, 209)`    | `rgb(2, 136, 209)`    | `rgba(2, 136, 209, 0.5)`        |
| success          | `#2e7d32`              | `rgb(46, 125, 50)`    | `rgb(46, 125, 50)`    | `rgba(46, 125, 50, 0.5)`        |

¹ `Default` outlined uses solid `currentColor` (no `0.5α` blend) — same divergence as `<Button>`'s `outlinedInherit`. Documented as `component/button/outlined-default-border` and reused conceptually here (component-scoped token under `component/icon-button/outlined-default-border` if Figma needs a separate token; otherwise borrow from Button — see `figma.spec.md` §5).

## 3. State axis — `Mui-focusVisible` / `Mui-disabled` (Primary)

`StateMatrix` asserts `state ∈ {Enabled, Focused, Disabled}`. `Hovered` / `Pressed` are pseudo-class (`:hover` / `:active`) and don't render statically without `storybook-addon-pseudo-states`.

| Property        | Variant   | Enabled                             | Focused (`Mui-focusVisible`)                                                              | Disabled                          |
| --------------- | --------- | ----------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------- |
| `box-shadow`    | text      | `none`                              | `none`                                                                                    | `none`                            |
|                 | outlined  | `none`                              | `none`                                                                                    | `none`                            |
|                 | contained | shadows-2 (see §1)                  | **shadows-6**: `0 3 5 -1 rgba(0,0,0,.20), 0 6 10 0 rgba(0,0,0,.14), 0 1 18 0 rgba(0,0,0,.12)` | `none`                            |
| `background`    | text      | transparent                         | transparent                                                                               | transparent                       |
|                 | outlined  | transparent                         | transparent                                                                               | transparent                       |
|                 | contained | `rgb(25, 118, 210)`                 | `rgb(25, 118, 210)`                                                                       | `rgba(0, 0, 0, 0.12)`             |
| `color`         | text      | `rgb(25, 118, 210)`                 | `rgb(25, 118, 210)`                                                                       | `rgba(0, 0, 0, 0.26)`             |
|                 | outlined  | `rgb(25, 118, 210)`                 | `rgb(25, 118, 210)`                                                                       | `rgba(0, 0, 0, 0.26)`             |
|                 | contained | `#fff`                              | `#fff`                                                                                    | `rgba(0, 0, 0, 0.26)`             |
| `border-color`  | outlined  | `rgba(25, 118, 210, 0.5)`           | `rgba(25, 118, 210, 0.5)`                                                                 | `rgba(0, 0, 0, 0.12)`             |
| `cursor`        | all       | `pointer`                           | `pointer`                                                                                 | `default`                         |
| `pointer-events`| all       | `auto`                              | `auto`                                                                                    | `none`                            |

Notes:

- **Focus on text / outlined is computed-style-identical to Enabled** — same as `<Button>`. The visible focus cue comes from the ripple subtree, not the box. The Figma `State=Focused` variants paint a 3 px ring (Figma enhancement) using `seed/<C>/focusVisible` to surface the state visually; this is faithful to Button's spec, not MUI's default IconButton.
- **Focus on contained** raises elevation 2 → 6 (the only variant with a paint delta on focus). Numbers above are exact computed values.
- **Disabled** collapses every color to greyscale alias tokens (`action.disabled = rgba(0,0,0,0.26)` for fg/border, `action.disabledBackground = rgba(0,0,0,0.12)` for contained bg). `Color=Primary, State=Disabled` renders identically to `Color=Danger, State=Disabled`.

## 4. Hover / Pressed (derived, not statically probed)

Both states require `:hover` / `:active` pseudo-classes. The Merak Figma variants treat them as documented states; the runtime applies them via CSS only. Mirror `<Button>`'s state model:

| Variant   | Hovered                                                      | Pressed                                                      |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| text      | bg = `palette.<color>.main × 0.04α` (themed) or `rgba(0,0,0,0.04)` (default) | identical paint to Hovered                       |
| outlined  | bg = same overlay; border drops `0.5α` → solid `palette.<color>.main` (themed) or stays `text.primary` (default) | identical paint to Hovered |
| contained | bg = `palette.<color>.dark` (themed) or `darken(grey.300, 0.08)` (default); shadow → shadows-4 | bg as Hovered; shadow → shadows-8 |

**MUI native IconButton diverges here** — its CSS `:hover` rule applies the 0.04 overlay to **all** variants (including contained) on top of the existing background. The Merak Figma extension follows `<Button>`'s convention of swapping to `palette.<color>.dark` for Contained hover/pressed, which the story's `sx` overrides do not currently emulate (Contained hover keeps the same `main` bg and only raises shadow). When the spec is authored against Figma, treat the Button-style behavior as source-of-truth and file a follow-up to align the story `sx`.

## 5. Size axis (Contained, Primary, Enabled)

Spec ships **Medium only**. `argTypes.size` exposes `small | medium | large` for prop parity with MUI.

| Size   | outer width × height    | padding | font-size | icon slot |
| ------ | ----------------------- | ------- | --------- | --------- |
| small  | `30 × 30 px` (text/contained), `32 × 32 px` (outlined) | `5 px`  | `18 px`   | 18 × 18   |
| medium | `40 × 40 px`, `42 × 42 px` (outlined) | `8 px`  | `24 px`   | 24 × 24   |
| large  | `48 × 48 px`, `50 × 50 px` (outlined) | `12 px` | `28 px`   | 28 × 28   |

(Numbers derive from `node_modules/@mui/material/IconButton/IconButton.js` — only Medium is probed live in `StateMatrix`.)

## 6. Drift checks

If a Storybook re-measure produces values that disagree with the tables above, treat the difference as one of these cases — do not silently update the spec:

1. **MUI upgrade** — `@mui/material` major bumps may change the `8 / 24 px` padding+font default, the shadow ramp, or the `action.disabled*` tokens. Update `figma.spec.md` §1's MUI version row alongside this file.
2. **Theme override** — if `mui-theme.ts` introduces a `MuiIconButton` `defaultProps` / `styleOverrides` block, document it in §1 and re-derive §3 values.
3. **Story `sx` drift** — the variant-applying `sx` in `IconButton.stories.tsx` is the runtime stand-in for the Merak `Variant` axis. Any change there (e.g. switching Contained hover from "keep main bg" to `palette.dark`) is a real spec-impacting change — update §4 here and audit `figma.spec.md` §6.
4. **Figma sizing reconciliation** — if Figma cells stay at `36 × 36`, document the smaller icon convention as a Figma-side decision in §1 of `figma.spec.md` rather than treating it as a runtime divergence.

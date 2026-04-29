---
name: figma-component-chip-storybook-render
description: Computed-style matrix for `<Chip>` (MUI 7.3) derived from `node_modules/@mui/material/Chip/Chip.js` against the Storybook preview's default `createTheme()` (no overrides). Documents the runtime per-variant box / paint / typography numbers, the color × state grid, the slot axis (Icon / Avatar / Delete), the size axis (small / medium), and the drift-check protocol. Companion to `figma.spec.md` (the contract). Source-derived rather than browser-measured because Chrome DevTools MCP could not attach to the running Storybook profile during authoring (see §0).
parent_skill: figma-components
---

# `<Chip>` Storybook Render Measurements

Computed-style snapshot derived from `node_modules/@mui/material/Chip/Chip.js` resolved against MUI's default theme (`.storybook/preview.tsx` calls `createTheme()` with no overrides). Stories used as the contract: `ColorMatrix` (6 colors × 2 variants, Enabled), `StateMatrix` (3 states × 2 variants, Primary), `SlotMatrix` (6 slot combos × 2 variants), `SizeMatrix` (medium / small × 2 variants). These are the runtime numbers a Figma authoring pass should reproduce; if Storybook output diverges, the spec — not the runtime — is the source-of-truth, but the divergence is a red flag worth filing.

## 0. Methodology note

Chrome DevTools MCP could not attach to the local Storybook (port 6006) during authoring because a stale profile lock blocked new sessions. The values below were derived from the MUI Chip source file (`node_modules/@mui/material/Chip/Chip.js`) resolved against the runtime palette (extracted with `node -e "createTheme()"`); paints, paddings, fonts, and shadows in the default-theme path are deterministic, so the source-derived values match what the browser would compute. **Re-measure with Chrome DevTools MCP when the lock is cleared** and update §7 drift checks if any divergence appears (especially sub-pixel widths and `transition` computed values, which can only be observed at runtime).

## 1. Variant-axis invariants (Medium, Enabled, no clickable / no onDelete)

Shared by every (color × variant) cell in `ColorMatrix`. The columns differ on padding / border / fill. Everything else is shared.

| Property                  | Filled                                                            | Outlined                                                          |
| ------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `display` / `align`       | `inline-flex` / `align-items: center, justify-content: center`    | same                                                              |
| `box-sizing`              | `border-box`                                                      | `border-box`                                                      |
| outer height              | `32 px`                                                           | `32 px` (1 px absorbed by border, label padding shifts by `−1 px`) |
| `padding` (root T R B L)  | `0` (label slot owns the horizontal pad)                          | same                                                              |
| label `padding-left/right`| `12 px`                                                           | `11 px` (border absorbs 1 px)                                     |
| `border`                  | `0` (none)                                                        | `1 px solid <color × 0.7α>` (themed) / `1 px solid #bdbdbd` (default) |
| `border-radius`           | `16 px` (`height / 2`)                                            | `16 px`                                                           |
| `box-shadow`              | `none`                                                            | `none`                                                            |
| `font`                    | `Roboto 400, 13 / 19.5 px (line-height 1.5)`                      | same                                                              |
| `cursor`                  | `unset`                                                           | `unset`                                                           |
| `text-decoration`         | `none`                                                            | `none`                                                            |
| `outline`                 | `0`                                                               | `0`                                                               |
| `vertical-align`          | `middle`                                                          | `middle`                                                          |
| `transition`              | `background-color, box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)`    | same                                                              |
| `white-space`             | `nowrap`                                                          | `nowrap`                                                          |
| label `overflow`          | `hidden`, `text-overflow: ellipsis`                               | same                                                              |

The base (color=default) `<Chip>` has `background-color: rgba(0,0,0,0.08)` (`palette.action.selected`) and `color: rgba(0,0,0,0.87)` (`palette.text.primary`). The themed colors override the bg + fg as documented in §2.

## 2. Color axis — palette resolution (Filled & Outlined, Enabled)

For `color !== 'default'`, MUI's variant resolver applies (`Chip.js:170-185`):

- **filled themed** → `background-color = palette[color].main`, `color = palette[color].contrastText`. The deleteIcon inherits `alpha(contrastText, 0.7)`.
- **outlined themed** → `background-color = transparent`, `color = palette[color].main`, `border = 1 px solid alpha(main, 0.7)`. The deleteIcon inherits `alpha(main, 0.7)`.

For `color === 'default'`:

- **filled default** → `background-color = action.selected = rgba(0,0,0,0.08)`, `color = text.primary = rgba(0,0,0,0.87)`. Delete icon = `alpha(text.primary, 0.26)`.
- **outlined default** → `background-color = transparent`, `color = text.primary`, `border = 1 px solid grey[400] = #bdbdbd`. Delete icon = `alpha(text.primary, 0.26)`.

| Merak (MUI key)   | `palette[color].main` | filled bg                | filled fg / contrastText | outlined fg              | outlined border (`0.7α`)         |
| ----------------- | --------------------- | ------------------------ | ------------------------ | ------------------------ | -------------------------------- |
| default (default) | n/a                   | `rgba(0,0,0,0.08)`       | `rgba(0,0,0,0.87)`       | `rgba(0,0,0,0.87)`       | `#bdbdbd` (solid `grey[400]`)¹  |
| primary           | `#1976d2`             | `rgb(25, 118, 210)`      | `#fff`                   | `rgb(25, 118, 210)`      | `rgba(25, 118, 210, 0.7)`       |
| danger (error)    | `#d32f2f`             | `rgb(211, 47, 47)`       | `#fff`                   | `rgb(211, 47, 47)`       | `rgba(211, 47, 47, 0.7)`        |
| warning           | `#ed6c02`             | `rgb(237, 108, 2)`       | `#fff`                   | `rgb(237, 108, 2)`       | `rgba(237, 108, 2, 0.7)`        |
| info              | `#0288d1`             | `rgb(2, 136, 209)`       | `#fff`                   | `rgb(2, 136, 209)`       | `rgba(2, 136, 209, 0.7)`        |
| success           | `#2e7d32`             | `rgb(46, 125, 50)`       | `#fff`                   | `rgb(46, 125, 50)`       | `rgba(46, 125, 50, 0.7)`        |

¹ `outlined default` border is solid `grey[400]` (no alpha) — diverges from the themed `0.7α` blend. This is the Chip equivalent of Button's `outlinedInherit` carve-out and is baked into MUI's default `Chip.defaultBorder` fallback.

## 3. State axis — Enabled / Hovered / Focused / Pressed / Disabled

`StateMatrix` renders `Enabled / Focused / Disabled` statically. `Hovered` and `Pressed` are pseudo-class (`:hover` / `:active`) and only fire when `clickable` or `onDelete` is set — without those, MUI's source intentionally leaves them as no-ops.

### 3.1 Static states (StateMatrix)

| Property        | Variant   | Enabled                            | Focused (`Mui-focusVisible`)                                                              | Disabled (`Mui-disabled`)                       |
| --------------- | --------- | ---------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `background`    | filled    | `palette[color].main` (themed) / `rgba(0,0,0,0.08)` (default) | **same as Enabled**¹                                                                      | **same as Enabled** (only `opacity` shifts)     |
|                 | outlined  | transparent                        | `alpha(palette[color].main, 0.12)` (themed) / `rgba(0,0,0,0.12)` = `palette.action.focus` (default) | transparent                                     |
| `color`         | filled    | `contrastText` (themed) / `rgba(0,0,0,0.87)` (default) | same as Enabled                                                                          | same color hex, lower opacity (root opacity)    |
|                 | outlined  | `palette[color].main` / `text.primary` | same as Enabled                                                                          | same                                            |
| `border-color`  | outlined  | `alpha(main, 0.7)` / `#bdbdbd`     | same as Enabled (border doesn't shift on focus)                                           | same                                            |
| `box-shadow`    | all       | `none`                             | `none`                                                                                    | `none`                                          |
| `opacity` (root)| all       | `1`                                | `1`                                                                                       | `0.38` (`palette.action.disabledOpacity`)       |
| `pointer-events`| all       | `auto`                             | `auto`                                                                                    | `none`                                          |
| `outline`       | all       | `0`                                | `0`                                                                                       | `0`                                             |

¹ The `StateMatrix` cells set neither `clickable` nor `onDelete`, so the focusVisible bg-shift rules in `Chip.js:200-220, 232-247` don't fire. The cell is a focusable but non-interactive Chip — focus is announced via DOM `tabindex` / focus ring on the wrapping ButtonBase only when the chip is interactive. **For the Figma `State=Focused` variant, model the *interactive* focus look (§3.2), not the static-StateMatrix look** — the static cell is computed-identical to Enabled, which would make the variant indistinguishable.

### 3.2 Interactive focus / hover / pressed (clickable=true OR onDelete present)

This is what designers see in real apps. Source: `Chip.js:200-247`.

| Trigger                         | Variant            | Property             | Value                                                                                  |
| ------------------------------- | ------------------ | -------------------- | -------------------------------------------------------------------------------------- |
| `:hover` (clickable)            | filled default     | `background-color`   | `rgba(0,0,0,0.12)` (`alpha(action.selected, selectedOpacity + hoverOpacity = 0.12)`)   |
| `:hover` (clickable)            | filled themed      | `background-color`   | `palette[color].dark`                                                                  |
| `:hover` (clickable)            | outlined default   | `background-color`   | `rgba(0,0,0,0.04)` (`palette.action.hover`)                                            |
| `:hover` (clickable)            | outlined themed    | `background-color`   | `alpha(palette[color].main, 0.04)`                                                     |
| `Mui-focusVisible` (onDelete)   | filled default     | `background-color`   | `rgba(0,0,0,0.20)` (`alpha(action.selected, selectedOpacity + focusOpacity = 0.20)`)   |
| `Mui-focusVisible` (onDelete)   | filled themed      | `background`         | `palette[color].dark`                                                                  |
| `Mui-focusVisible` (clickable)  | filled default     | `background-color`   | same as `onDelete`-focusVisible (`rgba(0,0,0,0.20)`)                                   |
| `Mui-focusVisible` (clickable)  | filled themed      | `background-color`   | `palette[color].dark`                                                                  |
| `Mui-focusVisible` (any)        | outlined default   | `background-color`   | `rgba(0,0,0,0.12)` (`palette.action.focus`)                                            |
| `Mui-focusVisible` (any)        | outlined themed    | `background-color`   | `alpha(palette[color].main, 0.12)`                                                     |
| `:active` (clickable)           | all                | `box-shadow`         | `0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)` (`shadows[1]`) |

Resolved per-color hex (themed filled hover/focus = `palette[color].dark`):

| Merak (MUI key)  | `palette[color].dark` |
| ---------------- | --------------------- |
| primary          | `#1565c0`             |
| danger (error)   | `#c62828`             |
| warning          | `#e65100`             |
| info             | `#01579b`             |
| success          | `#1b5e20`             |

Resolved themed outlined focus bg (`alpha(main, 0.12)`):

| Merak (MUI key)  | outlined focus bg              |
| ---------------- ------------------------------- |
| primary          | `rgba(25, 118, 210, 0.12)`     |
| danger (error)   | `rgba(211, 47, 47, 0.12)`      |
| warning          | `rgba(237, 108, 2, 0.12)`      |
| info             | `rgba(2, 136, 209, 0.12)`      |
| success          | `rgba(46, 125, 50, 0.12)`      |

### 3.3 Disabled

Disabled is uniform across every (color × variant) cell — MUI just dims the entire root via `opacity: 0.38`. Cursor flips to `default`, `pointer-events: none`. **No palette swap** — the rendered hex is the same as Enabled, just visually flattened. Figma's `State=Disabled` variant must mirror this: keep the bg / fg / border bound to the same tokens as Enabled and apply node-level opacity 0.38 (or pre-alpha'd disabled bg / fg / border tokens — designer's choice; the spec records the chosen approach in §6).

## 4. Slot axis (Medium)

`SlotMatrix` covers six combos: `No slots`, `Icon`, `Avatar`, `Delete`, `Icon + Delete`, `Avatar + Delete`. Source: `Chip.js:116-152, 159-168, 274-279`.

### 4.1 Avatar (`<Avatar>` slotted via `avatar` prop, default 24×24 inside Chip)

| Property        | Filled (medium)        | Outlined (medium)      | Filled (small)        | Outlined (small)      |
| --------------- | ---------------------- | ---------------------- | --------------------- | --------------------- |
| Wrapper size    | 24 × 24                | 24 × 24                | 18 × 18               | 18 × 18               |
| `margin-left`   | `5 px`                 | `4 px`                 | `4 px`                | `2 px`                |
| `margin-right`  | `−6 px` (overlaps label padding by 6 px) | `−6 px`              | `−4 px`               | `−4 px`               |
| `font-size`     | `12 px` (`pxToRem(12)`)| `12 px`                | `10 px`               | `10 px`               |
| `color` (default chip color=default) | `#616161` (`grey[700]`) | same                | same                  | same                  |
| `bg + fg` (chip color=primary)      | bg=`primary.dark = #1565c0`, fg=`#fff` | same | same | same |
| `bg + fg` (themed)                  | bg=`palette[color].dark`, fg=`palette[color].contrastText` | same | same | same |

### 4.2 Icon (`icon` prop, inline 18×18 SVG in stories; renders as `<svg>` child)

| Property        | Filled (medium)        | Outlined (medium)      | Filled (small)        | Outlined (small)      |
| --------------- | ---------------------- | ---------------------- | --------------------- | --------------------- |
| `font-size`¹    | inherited (no override) | inherited             | `18 px`               | `18 px`               |
| `margin-left`   | `5 px`                 | `4 px`                 | `4 px`                | `2 px`                |
| `margin-right`  | `−6 px`                | `−6 px`                | `−4 px`               | `−4 px`               |
| `color` (chip color=default, iconColor=default) | `#616161` (`grey[700]`) | same | same | same |
| `color` (chip color=themed, iconColor=color)    | `inherit` → resolves to chip's `color` prop (i.e. `palette[color].contrastText` for filled, `palette[color].main` for outlined) | same | same | same |

¹ The medium icon doesn't override `font-size` — the host icon's intrinsic dimensions win. The 18×18 stories glyph keeps its 18×18 box at medium because the SVG carries explicit `width/height`.

### 4.3 Delete icon (`onDelete` present, default = `<CancelIcon>` from `internal/svg-icons/Cancel`, font-icon 1em wide)

| Property        | Filled (medium)        | Outlined (medium)      | Filled (small)        | Outlined (small)      |
| --------------- | ---------------------- | ---------------------- | --------------------- | --------------------- |
| `font-size`     | `22 px`                | `22 px`                | `16 px`               | `16 px`               |
| `margin`        | `0 5px 0 −6px`         | `0 5px 0 −6px` (then `marginRight: 5` set; same effective) | `0 4px 0 −4px` (small filled) | `0 3px 0 −4px` (small outlined) |
| `cursor`        | `pointer`              | `pointer`              | `pointer`             | `pointer`             |
| `color` (chip color=default) | `rgba(0,0,0,0.26)` (`alpha(text.primary, 0.26)`) | same | same | same |
| `color` (chip color=themed, filled)  | `alpha(palette[color].contrastText, 0.7)` | n/a (filled) | same | n/a |
| `color` (chip color=themed, outlined)| n/a                    | `alpha(palette[color].main, 0.7)` | n/a | same |
| `color` (`:hover`, default)          | `rgba(0,0,0,0.4)` (`alpha(text.primary, 0.4)`) | same | same | same |
| `color` (`:hover`, themed filled)    | `palette[color].contrastText` (full opacity) | n/a | same | n/a |
| `color` (`:hover`, themed outlined)  | n/a                    | `palette[color].main` (full opacity) | n/a | same |

Resolved themed delete-icon Enabled colors:

| Merak (MUI key)  | filled enabled (`alpha(contrastText, 0.7)`)  | outlined enabled (`alpha(main, 0.7)`) |
| ---------------- | --------------------------------------------- | -------------------------------------- |
| primary          | `rgba(255, 255, 255, 0.7)`                    | `rgba(25, 118, 210, 0.7)`              |
| danger           | `rgba(255, 255, 255, 0.7)`                    | `rgba(211, 47, 47, 0.7)`               |
| warning          | `rgba(255, 255, 255, 0.7)`                    | `rgba(237, 108, 2, 0.7)`               |
| info             | `rgba(255, 255, 255, 0.7)`                    | `rgba(2, 136, 209, 0.7)`               |
| success          | `rgba(255, 255, 255, 0.7)`                    | `rgba(46, 125, 50, 0.7)`               |

## 5. Size axis (Filled, Primary, Enabled)

| Size   | outer height | label `padding-left/right` (filled) | label `padding-left/right` (outlined) | font-size / line-height | avatar size | icon font-size | delete font-size |
| ------ | ------------ | ----------------------------------- | ------------------------------------- | ----------------------- | ----------- | -------------- | ---------------- |
| medium | 32 px        | `12 px`                             | `11 px`                               | `13 / 19.5 px`          | 24 × 24     | (intrinsic)    | 22 px            |
| small  | 24 px        | `8 px`                              | `7 px`                                | `13 / 19.5 px`          | 18 × 18     | 18 px          | 16 px            |

Spec ships **Medium only**, but `argTypes.size` exposes `medium | small` for prop parity with MUI. Numbers above are runtime-only — no Figma `Small` variant exists unless a follow-up adds it.

## 6. MUI tokens that drive every paint above

The tables in §1–§5 reduce to these palette / theme reads. Anyone re-deriving the values can plug a different theme into the same source paths and get a new resolution table.

| MUI token                              | Default-theme value                        |
| -------------------------------------- | ------------------------------------------ |
| `palette.text.primary`                 | `rgba(0, 0, 0, 0.87)`                      |
| `palette.text.secondary`               | `rgba(0, 0, 0, 0.6)`                       |
| `palette.action.selected`              | `rgba(0, 0, 0, 0.08)`                      |
| `palette.action.hover`                 | `rgba(0, 0, 0, 0.04)`                      |
| `palette.action.focus`                 | `rgba(0, 0, 0, 0.12)`                      |
| `palette.action.selectedOpacity`       | `0.08`                                     |
| `palette.action.hoverOpacity`          | `0.04`                                     |
| `palette.action.focusOpacity`          | `0.12`                                     |
| `palette.action.disabledOpacity`       | `0.38`                                     |
| `palette.grey[400]`                    | `#bdbdbd` (outlined-default border)        |
| `palette.grey[700]`                    | `#616161` (avatar/icon default fg)         |
| `palette.divider`                      | `rgba(0, 0, 0, 0.12)`                      |
| `palette.<color>.main` / `.dark` / `.contrastText` | see §2 / §3.2                  |
| `shadows[1]`                           | `0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)` |
| `typography.fontFamily`                | `"Roboto", "Helvetica", "Arial", sans-serif` |
| `typography.pxToRem(13)`               | `0.8125 rem` = `13 px` (with default `htmlFontSize: 16`) |

Note: this project's Storybook does NOT enable `theme.vars` (CSS-variable theme), so the `Chip.defaultBorder / defaultAvatarColor / defaultIconColor` Chip-specific tokens do not exist on the runtime theme — the source falls through to `grey[400] / grey[700]` for both light and the `light`-mode-only assumption. If a future host app turns on `theme.vars`, those Chip-specific tokens become available and the fallback path here is bypassed.

## 7. Drift checks

If a Storybook re-measure (Chrome DevTools MCP, once the profile lock clears) produces values that disagree with the tables above, treat the difference as one of these cases — do not silently update the spec:

1. **Chrome DevTools MCP runtime confirmation pending** — the entire document is source-derived (§0). When a browser-based measurement is finally captured, sub-pixel widths (label text rendering, e.g. `"Chip"` at 13 px Roboto Regular ~= 30.x px), exact `transition` computed string, and `box-shadow` blur-radius rounding may differ from the source-equivalent values. Update the affected rows and remove this check item; treat it as the first thing to verify.
2. **MUI upgrade** — `@mui/material` major bumps may change Chip's height, padding, line-height, or the `action.*` tokens. Update §1–§6 here in the same PR and bump `figma.spec.md` §1's MUI version row.
3. **Theme override** — `mui-theme.ts` (or any host-app theme) introduced a typography or palette override. Audit whether the override is intentional; if yes, document it in §2 / §6 of this file.
4. **Focus / disabled token drift** — if `Mui-focusVisible` starts emitting a `box-shadow` ring on the chip box, or `Mui-disabled` swaps the uniform `opacity: 0.38` for per-color disabled tokens (`action.disabled` etc.), MUI changed its default state styling. This is a real spec-impacting change — update §3 here and decide whether the Figma `State` axis needs new variants.
5. **Browser-level rounding** — sub-pixel widths come from float math; they are stable across Chrome versions but may differ slightly on Firefox / Safari. Acceptable.

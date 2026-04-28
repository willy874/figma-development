---
name: figma-component-button-storybook-render
description: Computed-style matrix for `<Button>` (MerakButton v2) measured against `src/stories/Button.stories.tsx` via Chrome DevTools MCP. Documents the runtime per-variant box / paint / typography numbers, the color × state grid, icon spacing, the size axis (small/medium/large), the MUI theme custom properties exposed on `.MuiButton-root`, and the drift-check protocol that decides whether a divergence is a spec bug, a MUI upgrade, or browser rounding. Companion to `figma.spec.md` (the contract) and `figma.render.md` (Figma-side rendering).
parent_skill: figma-components
---

# `<Button>` Storybook Render Measurements (v2)

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/Button.stories.tsx`. Stories used: `ColorMatrix` (6 colors × 3 variants, Enabled), `StateMatrix` (3 states × 3 variants, Primary), `WithStartIcon` / `WithEndIcon` (Contained Medium + 20×20 inline SVG), and `Contained` rendered with `args=size:small|large` for the size axis. These are the runtime numbers a Figma authoring pass should reproduce; if Storybook output diverges, the spec — not the runtime — is the source-of-truth, but the divergence is a red flag worth filing.

## 1. Variant-axis invariants (Medium, Enabled)

The columns differ on padding / border / fill / shadow. Everything else is shared across all 18 (color × variant) cells in `ColorMatrix`.

| Property                     | Contained                                                                    | Outlined                          | Text                |
| ---------------------------- | ---------------------------------------------------------------------------- | --------------------------------- | ------------------- |
| `display` / `position`       | `inline-flex` / `relative`                                                   | same                              | same                |
| `box-sizing`                 | `border-box`                                                                 | `border-box`                      | `border-box`        |
| `min-width` / outer height   | `64 px` / `36.5 px`                                                          | `64 px` / `36.5 px`               | `64 px` / `36.5 px` |
| `padding` (T R B L)          | `6 16 6 16`                                                                  | `5 15 5 15` (1 px absorbed by border) | `6 8 6 8`       |
| `border`                     | none                                                                         | `1 px solid <color × 0.5α>`       | none                |
| `border-radius`              | `4 px`                                                                       | `4 px`                            | `4 px`              |
| `box-shadow` (Enabled)       | `0 3 1 -2 rgba(0,0,0,.20), 0 2 2 0 rgba(0,0,0,.14), 0 1 5 0 rgba(0,0,0,.12)` (elevation 2) | `none`             | `none`              |
| `font`                       | `Roboto 500, 14 / 24.5 px, ls 0.4 px, uppercase`                             | same                              | same                |
| `align` / `justify`          | `center` / `center`, `vertical-align: middle`                                | same                              | same                |
| `transition`                 | `background-color, box-shadow, border-color 0.25s cubic-bezier(0.4,0,0.2,1)` | same                              | same                |
| `cursor` / `user-select`     | `pointer` / `none`                                                           | `pointer` / `none`                | `pointer` / `none`  |
| `appearance`                 | `none`                                                                       | `none`                            | `none`              |

Reference per-color widths at label `"BUTTON"` (sub-pixel float math, FYI):

| color   | text     | outlined | contained |
| ------- | -------- | -------- | --------- |
| default | 80.79 px | 96.79 px | 96.79 px  |
| primary | 82.34 px | 98.34 px | 98.34 px  |
| danger  | 78.30 px | 94.30 px | 94.30 px  |
| warning | 85.95 px | 101.95 px | 101.95 px |
| info    | 64.00 px | 67.05 px | 67.05 px  |
| success | 86.48 px | 102.48 px | 102.48 px |

`text` is 16 px narrower than `outlined`/`contained` because of the 8 px-vs-16 px horizontal padding. `info` floors to `min-width: 64 px` (label "INFO" + 16 px padding < 64 px) on the `text` variant.

## 2. Color axis — palette resolution (Enabled)

`ColorMatrix` confirms each Merak color resolves to the documented MUI palette hex; the per-variant paint rules are mechanical:

- **contained** → `background-color = palette.<color>.main`, `color = palette.<color>.contrastText` (always `#fff` for the 5 themed colors, `rgba(0,0,0,0.87)` for `inherit`).
- **outlined** → `background-color = transparent`, `color = palette.<color>.main`, `border = 1 px solid palette.<color>.main × 0.5α`.
- **text** → `background-color = transparent`, `color = palette.<color>.main`, no border.

| Merak (MUI key) | `palette.<color>.main` | contained bg          | outlined / text fg    | outlined border (`.5α`)         |
| --------------- | ---------------------- | --------------------- | --------------------- | ------------------------------- |
| default (inherit) | n/a (uses `grey-300`)| `rgb(224, 224, 224)`  | `rgba(0, 0, 0, 0.87)` | `rgba(0, 0, 0, 0.87)` (no α)¹  |
| primary         | `#1976d2`              | `rgb(25, 118, 210)`   | `rgb(25, 118, 210)`   | `rgba(25, 118, 210, 0.5)`       |
| danger (error)  | `#d32f2f`              | `rgb(211, 47, 47)`    | `rgb(211, 47, 47)`    | `rgba(211, 47, 47, 0.5)`        |
| warning         | `#ed6c02`              | `rgb(237, 108, 2)`    | `rgb(237, 108, 2)`    | `rgba(237, 108, 2, 0.5)`        |
| info            | `#0288d1`              | `rgb(2, 136, 209)`    | `rgb(2, 136, 209)`    | `rgba(2, 136, 209, 0.5)`        |
| success         | `#2e7d32`              | `rgb(46, 125, 50)`    | `rgb(46, 125, 50)`    | `rgba(46, 125, 50, 0.5)`        |

¹ `inherit` outlined uses solid `currentColor` (no `0.5α` blend) — that's a real divergence from the themed colors and is baked into the MUI default `outlinedInherit` style.

## 3. State axis — `Mui-focusVisible` / `Mui-disabled` (Primary)

`StateMatrix` asserts `state ∈ {Enabled, Focused, Disabled}`. `Hovered` / `Pressed` are pseudo-class (`:hover` / `:active`) and don't render statically without `storybook-addon-pseudo-states`, so this matrix omits them.

| Property        | Variant   | Enabled                             | Focused (`Mui-focusVisible`)                                                              | Disabled (`Mui-disabled` + `disabled`) |
| --------------- | --------- | ----------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------- |
| `box-shadow`    | text      | `none`                              | `none`                                                                                    | `none`                                 |
|                 | outlined  | `none`                              | `none`                                                                                    | `none`                                 |
|                 | contained | elevation 2 (see §1)                | **elevation 6**: `0 3 5 -1 rgba(0,0,0,.20), 0 6 10 0 rgba(0,0,0,.14), 0 1 18 0 rgba(0,0,0,.12)` | `none`                                 |
| `background`    | text      | transparent                         | transparent                                                                               | transparent                            |
|                 | outlined  | transparent                         | transparent                                                                               | transparent                            |
|                 | contained | `rgb(25, 118, 210)`                 | `rgb(25, 118, 210)`                                                                       | `rgba(0, 0, 0, 0.12)` (action.disabledBackground) |
| `color`         | text      | `rgb(25, 118, 210)`                 | `rgb(25, 118, 210)`                                                                       | `rgba(0, 0, 0, 0.26)` (action.disabled) |
|                 | outlined  | `rgb(25, 118, 210)`                 | `rgb(25, 118, 210)`                                                                       | `rgba(0, 0, 0, 0.26)`                  |
|                 | contained | `#fff`                              | `#fff`                                                                                    | `rgba(0, 0, 0, 0.26)`                  |
| `border-color`  | outlined  | `rgba(25, 118, 210, 0.5)`           | `rgba(25, 118, 210, 0.5)`                                                                 | `rgba(0, 0, 0, 0.12)`                  |
| `cursor`        | all       | `pointer`                           | `pointer`                                                                                 | `default`                              |
| `pointer-events`| all       | `auto`                              | `auto`                                                                                    | `none`                                 |
| `outline`       | all       | `0px none`                          | `0px none`                                                                                | `0px none`                             |
| `opacity`       | all       | `1`                                 | `1`                                                                                       | `1`                                    |

Notes:

- **Focused on text / outlined is computed-style-identical to Enabled.** The visible focus cue lives entirely in the ripple subtree (`.MuiTouchRipple-root > .MuiTouchRipple-rippleVisible.MuiTouchRipple-pulsate`), not on the button box. A Figma frame won't show a focus ring for these two variants — that is faithful to the runtime, not a missing detail.
- **Focused on contained** raises elevation 2 → 6 (the only variant with a paint delta on focus). The shadow numbers above are exact computed values.
- **Disabled** uses two action tokens (`action.disabled = rgba(0,0,0,0.26)` for fg/border, `action.disabledBackground = rgba(0,0,0,0.12)` for contained bg / outlined border). Color does not shift per palette in disabled — every color collapses to these greyscale tokens, which is the MUI default.

## 4. Icon axis (Contained Medium)

`WithStartIcon` / `WithEndIcon` use a 20 × 20 inline SVG. The icon wrapper (`.MuiButton-startIcon` / `.MuiButton-endIcon`) is `display: flex` with negative margin on the outside edge:

| Property        | startIcon                    | endIcon                      |
| --------------- | ---------------------------- | ---------------------------- |
| Wrapper size    | 20 × 20                      | 20 × 20                      |
| `margin-left`   | `-4 px`                      | `8 px`                       |
| `margin-right`  | `8 px`                       | `-4 px`                      |
| Effective gap   | 8 px between icon and label  | 8 px between label and icon  |
| Visual side-padding | 16 − 4 = **12 px** on the icon side | 16 − 4 = **12 px** on the icon side |
| Button outer width @ "BUTTON" | 115.71 px (vs 98.34 px no-icon) | 115.71 px |

Both-icon (`WithBothIcons`) just composes the two side effects: −4 px on the leading edge, −4 px on the trailing edge, +8 px between icon and label on each side, button width grows by ~24 px per icon side.

## 5. Size axis (Contained, Primary, Enabled)

Spec ships **Medium only**, but `argTypes.size` exposes `small | medium | large` for prop parity with MUI. Numbers below are runtime-only — no Figma variant exists.

| Size   | outer height | padding (T R B L) | font-size / line-height | min-width |
| ------ | ------------ | ----------------- | ----------------------- | --------- |
| small  | 30.75 px     | `4 10 4 10`       | 13 / 22.75 px           | 64 px     |
| medium | 36.50 px     | `6 16 6 16`       | 14 / 24.5 px            | 64 px     |
| large  | 42.25 px     | `8 22 8 22`       | 15 / 26.25 px           | 64 px     |

## 6. Theme custom properties exposed on `.MuiButton-root`

The MUI runtime appends these CSS custom properties to every `.MuiButton-root`. The Figma spec does not consume them (Figma binds straight to `seed/*` variables), but they're a useful proof that the theme palette resolves the same hex on the runtime side. Verified across all 6 colors in `ColorMatrix`:

| color   | `--variant-containedBg` | `--variant-containedColor` | `--variant-outlinedColor` | `--variant-outlinedBorder`         | `--variant-textColor` |
| ------- | ----------------------- | -------------------------- | ------------------------- | ---------------------------------- | --------------------- |
| default | `#e0e0e0`               | (empty)                    | (empty)                   | (empty)                            | (empty)               |
| primary | `#1976d2`               | `#fff`                     | `#1976d2`                 | `rgba(25, 118, 210, 0.5)`          | `#1976d2`             |
| danger  | `#d32f2f`               | `#fff`                     | `#d32f2f`                 | `rgba(211, 47, 47, 0.5)`           | `#d32f2f`             |
| warning | `#ed6c02`               | `#fff`                     | `#ed6c02`                 | `rgba(237, 108, 2, 0.5)`           | `#ed6c02`             |
| info    | `#0288d1`               | `#fff`                     | `#0288d1`                 | `rgba(2, 136, 209, 0.5)`           | `#0288d1`             |
| success | `#2e7d32`               | `#fff`                     | `#2e7d32`                 | `rgba(46, 125, 50, 0.5)`           | `#2e7d32`             |

`inherit` (Merak `default`) intentionally leaves the themed slots blank because MUI's `colorInherit` style branch reads from `currentColor` rather than these vars. This is why §2 calls out `outlinedInherit` as the one variant whose border is solid (no `0.5α` blend).

## 7. Drift checks

If a Storybook re-measure produces values that disagree with the tables above, treat the difference as one of these cases — do not silently update the spec:

1. **MUI upgrade** — `@mui/material` major bumps may change padding, shadow elevation steps, line-height, or the `action.disabled*` tokens. Update `figma.render.md` §1 and this file in the same PR and bump `figma.spec.md` §1's MUI version row.
2. **Theme override** — `mui-theme.ts` introduced a typography or palette override (e.g. raised primary from `#1976d2` to a brand hex). Audit whether the override is intentional; if yes, document it in `figma.render.md` §1 and §2 of this file.
3. **Focus / disabled token drift** — if `Mui-focusVisible` starts emitting a `box-shadow` ring on text/outlined, or `Mui-disabled` swaps `rgba(0,0,0,0.26)` for a palette-specific token, MUI changed its default state styling. This is a real spec-impacting change — update §3 here and decide whether the Figma `State` axis needs new variants.
4. **Browser-level rounding** — sub-pixel widths (e.g. `91.7109 px`) and the `24.5 px` line-height come from float math; they are stable across Chrome versions but may differ slightly on Firefox / Safari. Acceptable.

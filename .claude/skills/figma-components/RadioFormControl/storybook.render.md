---
name: figma-component-radio-form-control-storybook-render
description: Computed-style matrix for `<RadioFormControl>` measured against `src/stories/RadioFormControl.stories.tsx` via Chrome DevTools MCP. Runtime numbers for the `LabelPlacement × Color × Checked × Size × State` matrix wrapping a single Radio + label. Companion to `figma.spec.md`; the inner Radio's runtime numbers live in `../Radio/storybook.render.md`.
parent_skill: figma-components
---

# `<RadioFormControl>` Storybook Render Measurements

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/RadioFormControl.stories.tsx`. The runtime equivalent is `<FormControlLabel control={<Radio/>} label="Label" labelPlacement={…} />`. Stories used: `PlacementMatrix` (4 placements × 2 value combos at Color=Primary, Size=Medium), `ColorMatrix` (7 colors × 2 value combos at LabelPlacement=End, Size=Medium), `SizeMatrix` (2 sizes × 2 value combos at Color=Primary, LabelPlacement=End), `StateMatrix` (Enabled / Disabled × 2 value combos). Mirrors the structure of `../CheckboxFormControl/storybook.render.md`.

## 1. Wrapper invariants (FormControlLabel)

`FormControlLabel` is a flex container that lays out the inner `<Radio>` and a sibling `<span>` with the label text.

| Property                              | LabelPlacement=End  | LabelPlacement=Start  | LabelPlacement=Top    | LabelPlacement=Bottom |
| ------------------------------------- | ------------------- | --------------------- | --------------------- | --------------------- |
| `display`                             | `flex`              | `flex`                | `flex`                | `flex`                |
| `flex-direction`                      | `row`               | `row-reverse`         | `column-reverse`      | `column`              |
| `align-items`                         | `center`            | `center`              | `center`              | `center`              |
| `gap`                                 | `normal`            | `normal`              | `normal`              | `normal`              |
| `margin-left`                         | `-11 px`            | `-11 px`              | `0 px` _(MUI shifts axis-perpendicular)_ | `0 px`     |
| `margin-right`                        | `16 px`             | `16 px`               | `16 px`               | `16 px`               |
| `margin-top` / `margin-bottom`        | `0 px` / `0 px`     | `0 px` / `0 px`       | `0 px` / `0 px`       | `0 px` / `0 px`       |

Notes:

- The `marginLeft: -11 px` cancels the inner `<Radio>`'s `9 px` padding so the visible glyph aligns with the host container's left edge instead of the hit-target. The `marginRight: 16 px` is a hard-coded spacing constant from MUI that visually sits ~5 px from the label.
- No background, no border, no shadow on the wrapper itself.
- The wrapper is **not auto-layout** in the Figma sense — there is no explicit `gap`. MUI relies on the inner Radio's `9 px` padding to space the indicator from the label. The Figma cell normalises this to `itemSpacing 4 px` (matching the project's `gap-1`); see `../CheckboxFormControl/figma.spec.md` §7 issue 1 for the same normalisation on the Checkbox side.

## 2. Label typography (Color=Primary, Enabled, value combos)

The label text is a `<span>` (`MuiFormControlLabel-label`) inheriting MUI's `body1` typography.

| Property                         | Value                                |
| -------------------------------- | ------------------------------------ |
| Font family (runtime)            | `Roboto, Helvetica, Arial, sans-serif` |
| Font weight                      | `400`                                |
| Font size                        | `16 px`                              |
| Line height                      | `24 px`                              |
| Letter spacing                   | `0.15008 px` (≈ `0.00938em × 16 px`) |
| Text transform                   | none                                 |
| Color — Enabled                  | `rgba(0, 0, 0, 0.87)` (`palette.text.primary`) |
| Color — Disabled                 | `rgba(0, 0, 0, 0.38)` (`palette.text.disabled`) |

The label text color is **color-agnostic** — every `Color` row paints `text-primary` regardless of the inner `<Radio>`'s `color` prop. Only the indicator glyph picks up the brand color.

## 3. State coverage

| State    | Wrapper background | Inner Radio glyph          | Label text color           |
| -------- | ------------------ | -------------------------- | -------------------------- |
| Enabled  | transparent        | per `Color × Checked` (see `../Radio/storybook.render.md` §2) | `rgba(0, 0, 0, 0.87)` |
| Disabled | transparent        | `rgba(0, 0, 0, 0.26)` (any color, any value)             | `rgba(0, 0, 0, 0.38)` |

`Hovered / Focused / Pressed` are not republished here — the inner Radio still paints its halo on real interaction, but the wrapper exposes no own interaction state.

## 4. Inner Radio

The wrapping cell carries an inner `<Radio>` whose runtime numbers are recorded in `../Radio/storybook.render.md`. The wrapper does not override any Radio prop.

## 5. Drift checks (Storybook ↔ Figma)

Open divergences flagged for the `figma.spec.md` §7 list (mirror `../CheckboxFormControl/storybook.render.md` §6):

1. **Wrapper outer margins.** MUI runtime applies `-11 px / 16 px` outer margins on `FormControlLabel`; the Figma cells use auto-layout `itemSpacing 4 px` instead. Visual delta is small (~5 px tighter than runtime).
2. **Letter-spacing differs.** MUI runtime applies `0.15008 px`; the Figma `body1` text style ships with `letterSpacing: 0%`. Inherited drift from `<CheckboxFormControl>` §7 issue 2.
3. **Font family differs.** Figma's `body1` text style uses `Noto Sans TC Regular`; MUI runtime renders `Roboto`. Accepted-as-is.
4. **`Size=Large` falls back to Medium at runtime.** Inherited from `../Radio/storybook.render.md` §4 / `../Radio/figma.spec.md` §7 issue 1.
5. **`Hovered / Focused / Pressed` are not published in this set.** Drop a bare `<Radio>` and compose the label manually until those variants are added.

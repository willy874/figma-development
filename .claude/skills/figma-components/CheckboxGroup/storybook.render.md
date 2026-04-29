---
name: figma-component-checkbox-group-storybook-render
description: Computed-style matrix for `<CheckboxGroup>` measured against `src/stories/CheckboxGroup.stories.tsx` via Chrome DevTools MCP. Runtime numbers for the composed `FormControl + FormLabel + FormGroup + FormHelperText` pattern, including label / helper typography and the Enabled / Disabled / Error tone surface. Inner indicator numbers come from `../Checkbox/storybook.render.md`; per-option-row layout numbers come from `../CheckboxFormControl/storybook.render.md`.
parent_skill: figma-components
---

# `<CheckboxGroup>` Storybook Render Measurements

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/CheckboxGroup.stories.tsx`. The runtime composes `FormControl > FormLabel + FormGroup + FormHelperText` with multiple `<FormControlLabel><Checkbox/></FormControlLabel>` children. Stories used: `DirectionMatrix` (column / row × small / medium), `ColorMatrix` (7 colors × 2 directions), `StateMatrix` (Enabled / Disabled / Error × 2 directions), `HelperMatrix` (helper × label combinations).

## 1. Outer FormControl + FormLabel + FormGroup + FormHelperText

The wrapping pattern stacks four nodes vertically inside a `<FormControl component="fieldset">`:

```
FormControl (FIELDSET, display: flex, flex-direction: column)
├── FormLabel (LEGEND) — "Label" (optional)
├── FormGroup (display: flex; flex-direction: column / row, flex-wrap: wrap)
│   ├── FormControlLabel — Checkbox + label span (option A — unchecked)
│   ├── FormControlLabel — Checkbox + label span (option B — checked)
│   └── FormControlLabel — Checkbox + label span (option C — indeterminate)
└── FormHelperText — helper / error message (optional)
```

| Property                      | Value                       |
| ----------------------------- | --------------------------- |
| `FormControl.display`         | `flex`                      |
| `FormControl.flex-direction`  | `column`                    |
| `FormControl.padding`         | `0 px`                      |
| `FormControl.margin`          | `0 px`                      |
| `FormControl.min-width`       | `0 px`                      |
| `FormGroup.flex-direction`    | `column` (default) / `row` (when `row` prop) |
| `FormGroup.flex-wrap`         | `wrap`                      |
| `FormGroup.gap`               | `normal` (no explicit gap; spacing comes from inner `FormControlLabel.marginRight: 16px`) |
| `FormControlLabel.flex-direction` | `row`                   |
| `FormControlLabel.margin`     | `0 16px 0 -11px` (T R B L; pulls indicator back so 9 px inner padding aligns with the surrounding text column) |

The Figma cell normalises the wrapper to a real auto-layout `gap` (typically `8 px` between rows / `16 px` between row-direction items) — see `figma.spec.md` §4.1.

## 2. FormLabel typography

| Property                | Value                                |
| ----------------------- | ------------------------------------ |
| Font family (runtime)   | `Roboto, Helvetica, Arial, sans-serif` |
| Font weight             | `400`                                |
| Font size               | `16 px`                              |
| Line height             | `23 px` _(rounded down from `1.4375em × 16 = 23 px`)_ |
| Letter spacing          | `0.15008 px`                         |
| Padding                 | `0 px`                               |
| Margin-bottom           | `0 px`                               |
| Color — Enabled         | `rgba(0, 0, 0, 0.6)` (`palette.text.secondary`) |
| Color — Disabled        | `rgba(0, 0, 0, 0.38)` (`palette.text.disabled`) |
| Color — Error           | `rgb(211, 47, 47)` (`palette.error.main`) |
| Required asterisk color | `rgb(211, 47, 47)` (matches Error)   |

The line-height differs from `body1` (24 px); FormLabel uses MUI's `subtitle1`-derived `1.4375em` ratio. Treat this as a label-specific text style in Figma rather than reusing `body1`.

## 3. Inner Checkbox + label

Each option is a `<FormControlLabel><Checkbox/></FormControlLabel>` row:

| Property                          | Value                            |
| --------------------------------- | -------------------------------- |
| Inner `<Checkbox>` hit-target     | `42 × 42 px` (Medium) / `38 × 38 px` (Small) |
| Inner `<Checkbox>` padding        | `9 px`                           |
| FormControlLabel `margin-left`    | `-11 px`                         |
| FormControlLabel `margin-right`   | `16 px`                          |
| Label text — Enabled              | `rgba(0, 0, 0, 0.87)` (`text.primary`) |
| Label text — Disabled             | `rgba(0, 0, 0, 0.38)` (`text.disabled`) |
| Label text — Error                | `rgba(0, 0, 0, 0.87)` (Error tone applies to FormLabel + helper, **not** to per-option labels) |
| Label font family                 | `Roboto, Helvetica, Arial, sans-serif` |
| Label font size                   | `16 px`                          |
| Label line height                 | `24 px`                          |
| Label letter spacing              | `0.15008 px`                     |

Inner Checkbox glyph fills follow `../Checkbox/storybook.render.md` §2 — color-agnostic for unchecked; brand-themed for checked / indeterminate; `palette.action.disabled` for disabled.

The `StateMatrix` story fixture pre-sets the three options to `unchecked / checked / indeterminate` so the runtime fill values measured here cover all three glyph testids in a single cell:

| Combo                               | Glyph testid                  | Enabled fill (Color=Primary) | Disabled fill        |
| ----------------------------------- | ----------------------------- | ---------------------------- | -------------------- |
| `checked=false, indeterminate=false` | `CheckBoxOutlineBlankIcon`   | `rgba(0, 0, 0, 0.6)`         | `rgba(0, 0, 0, 0.26)` |
| `checked=true, indeterminate=false`  | `CheckBoxIcon`               | `rgb(25, 118, 210)` (`#1976D2`) | `rgba(0, 0, 0, 0.26)` |
| `checked=false, indeterminate=true`  | `IndeterminateCheckBoxIcon`  | `rgb(25, 118, 210)`          | `rgba(0, 0, 0, 0.26)` |

## 4. FormHelperText

| Property                | Enabled                         | Error                           |
| ----------------------- | ------------------------------- | ------------------------------- |
| Font family             | `Roboto, Helvetica, Arial, sans-serif` | same                     |
| Font weight             | `400`                           | `400`                           |
| Font size               | `12 px`                         | `12 px`                         |
| Line height             | `1.66em` (`≈ 19.92 px`)         | same                            |
| Letter spacing          | `0.4 px` _(`0.03333em × 12 px`)_ | same                           |
| Color                   | `rgba(0, 0, 0, 0.6)` (`text.secondary`) | `rgb(211, 47, 47)` (`palette.error.main`) |
| Margin-top              | `4 px` (`MuiFormHelperText-contained`) | same                       |
| Margin-right            | `14 px` (`MuiFormHelperText-contained`) | `14 px`                    |

The helper text is hidden by default (story pattern shows it only when `showHelper` is true or in `Error` mode). The `Mui-required` class adds an `*` to the FormLabel; the Error class repaints both FormLabel and FormHelperText to `palette.error.main` while leaving option labels and inner Checkbox glyphs unchanged.

## 5. State coverage

| State    | FormLabel color           | Helper color            | Per-option label color | Inner Checkbox glyph                          |
| -------- | ------------------------- | ----------------------- | ---------------------- | --------------------------------------------- |
| Enabled  | `rgba(0, 0, 0, 0.6)`      | `rgba(0, 0, 0, 0.6)`    | `rgba(0, 0, 0, 0.87)`  | per Color × Checked / Indeterminate (see `../Checkbox/storybook.render.md` §2) |
| Disabled | `rgba(0, 0, 0, 0.38)`     | `rgba(0, 0, 0, 0.38)`   | `rgba(0, 0, 0, 0.38)`  | `rgba(0, 0, 0, 0.26)` (any color, any value)  |
| Error    | `rgb(211, 47, 47)` + `*`  | `rgb(211, 47, 47)`      | `rgba(0, 0, 0, 0.87)` _(unchanged)_ | per Color × Checked / Indeterminate (the inner Checkbox's `color` prop is independent of FormControl error state — it does not auto-tint to `error`) |

**Important runtime quirk**: Setting `<FormControl error>` does not propagate `color="error"` onto the inner `<Checkbox>`. The Error tone repaints the FormLabel + FormHelperText only — the checkboxes themselves stay on whatever `color` they were given. To get red glyphs in the Error state, the consumer must also pass `color="error"` to each `<Checkbox>`. Document this in spec §3 / §7 so designers don't expect cascading. Same behavior as `<RadioGroup>` (`../RadioGroup/storybook.render.md` §5).

## 6. Drift checks (Storybook ↔ Figma)

Open divergences flagged for the `figma.spec.md` §7 list:

1. **Wrapper gap is `normal`, not numeric — Figma normalises both directions.** FormGroup spaces options via `FormControlLabel.marginRight: 16px` (row direction) and natural line breaks via `line-height: 24px` rows (column direction). The Figma cell normalises this to `itemSpacing 8 px` (column) / `itemSpacing 16 px` (row). The column value is a **fabrication** — runtime emits no vertical flex gap; the visible inter-row breathing room comes from the inner `<Checkbox>`'s `9 px` padding plus the row's `24 px` line-height. Visual delta: ~5 px tighter than runtime in row direction; ~8 px taller per row in column direction.
2. **Letter-spacing differs.** Same as `<CheckboxFormControl>` §2 issue 2 — `body1` text style ships at `letterSpacing: 0%` while runtime is `0.15008 px`.
3. **Font family differs.** Same as `<CheckboxFormControl>` §2 issue 3 — Figma uses `Noto Sans TC Regular`, runtime uses `Roboto`.
4. **`Size=Large` is Figma-only.** Inherited from `../Checkbox/figma.spec.md` §7 issue 1.
5. **Error state does not cascade to inner Checkboxes.** Setting `<FormControl error>` repaints FormLabel + FormHelperText only; the inner `<Checkbox>` retains its `color` prop. The Figma `State=Error` cell publishes the same neutral indicator as `State=Enabled` for `Color=Default` — designers who want red glyphs must explicitly pick `Color=Error` on the inner Checkbox (or a future revision can add an "Error cascade" toggle).
6. **FormLabel line-height differs from `body1`.** Runtime ships FormLabel at `1.4375em` (≈ 23 px at `16 px`); the project's `body1` text style is `24 px`. If Figma applies `body1` to the FormLabel by mistake, the row will stand 1 px taller than runtime — bind FormLabel to a dedicated `subtitle1` (or new `form-label`) text style instead.
7. **Tri-state fixture vs. Radio's off/on/off.** The Checkbox group renders the third option as `Indeterminate=True` on purpose — multi-select fields naturally surface a tri-state. The Figma cell mirrors this so designers can read all three glyph styles at a glance; consumers who want a uniform on/off cell should compose manually with three nested `<CheckboxFormControl>` instances.
8. **Option C does not grey out under wrapper `State=Disabled`.** Inherited from `../CheckboxFormControl/figma.spec.md` §3 — the nested set excludes `(Indeterminate=True, State=Disabled)`. In `<CheckboxGroup>` Disabled cells, Option C's nested instance falls back to `State=Enabled`, so its dash glyph keeps its enabled paint while Options A and B grey out correctly. Tracked in `figma.spec.md` §7 issue 9.

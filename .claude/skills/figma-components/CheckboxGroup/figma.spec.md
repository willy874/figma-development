---
name: figma-component-checkbox-group-spec
description: Figma component specification for `<CheckboxGroup>` — design counterpart of MUI's composed `<FormControl>` + `<FormLabel>` + `<FormGroup>` + `<FormHelperText>` consumed by `src/stories/CheckboxGroup.stories.tsx`. Documents the Direction × Color × Size × State variant matrix, the multi-row composition, the FormLabel / helper text token bindings, and the Error-state cascade limits. For runtime measurements see `storybook.render.md`; for the per-row indicator see `../Checkbox/figma.spec.md` and the per-row label see `../CheckboxFormControl/figma.spec.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '306:6886'
figma_component_set_id: '306:6886'
---

# `<CheckboxGroup>` Figma Component Specification

## 1. Overview

`<CheckboxGroup>` is the Figma counterpart of the composed pattern MUI ships as:

```tsx
<FormControl component="fieldset" error={...} disabled={...} required={...}>
  <FormLabel component="legend">Label</FormLabel>          // → Figma `FormLabel` text override
  <FormGroup row={...}>
    <FormControlLabel control={<Checkbox />}                        label="Option A" />
    <FormControlLabel control={<Checkbox checked />}                label="Option B" />
    <FormControlLabel control={<Checkbox indeterminate />}          label="Option C" />
  </FormGroup>
  <FormHelperText>Helper text</FormHelperText>             // → Figma `Helper` text override
</FormControl>
```

There is no in-repo wrapper — the project's `<CheckboxGroup>` is a wrapper-side label for this composed pattern. The Figma component contains:

- one **`FormLabel`** TEXT (legend, optional via boolean prop)
- one auto-layout **`Group`** FRAME holding three nested **`<CheckboxFormControl>` instances** (Option A / B / C)
- one **`FormHelperText`** TEXT (helper / error message, optional via boolean prop)

inside an outer auto-layout `FormControl` frame whose direction is always vertical. The inner `Group`'s direction is `Horizontal` or `Vertical` per the `Direction` axis. Each option row is a `<CheckboxFormControl>` instance whose axes (`Color`, `Size`, `Checked`, `Indeterminate`, `State`) are pre-set to match the wrapping variant. The default fixture pre-bakes a tri-state surface (Option A unchecked, Option B checked, Option C indeterminate) so a single cell shows all three checkbox glyphs; designers can override per-option by reaching into the nested instance.

| Aspect            | Value                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| Source story      | `src/stories/CheckboxGroup.stories.tsx`                                                |
| Underlying source | `@mui/material@^7.3.10` `FormControl` + `FormLabel` + `FormGroup` + `FormHelperText` (re-exported by this package, no wrapper) |
| Figma file        | [MUI-Library](https://www.figma.com/design/KQjP6W9Uw1PN0iipwQHyYn) (`KQjP6W9Uw1PN0iipwQHyYn`) |
| Figma frame       | `<CheckboxGroup>` (`306:6886`, `850 × 4853 px`) at `(40, 3231)` inside the `Checkbox` section frame (`1:7227`) at `(1482, 9543)`, sibling to `<Checkbox>` (`1:7228`) and `<CheckboxFormControl>` (`1:7367`) above |
| Component Set     | `<CheckboxGroup>` (`306:6886`)                                                          |
| Total variants    | **54** (2 Direction × ((Color (7) × Size (3) at State=Enabled = 21) + (Color=Default × Size (3) at State=Disabled = 3) + (Color=Default × Size (3) at State=Error = 3)) = 2 × 27 = 54). See §3 for the count math. |
| Nested component  | `<CheckboxFormControl>` instance (one per option row) — axes mirror the outer set, plus `Indeterminate` per option |
| Typography (label) | `body1` style — `Roboto Regular 16 / 24 px`, ls `0.15 px` (no text-transform)         |
| Typography (FormLabel) | `subtitle1`-derived line-height (`23 px` runtime). Use the project's existing `material-design/typography/subtitle1` (or a dedicated `form-label` style); do **not** apply `body1` (line-height drift, see §7 issue 6). |
| Typography (FormHelperText) | MUI `caption`-equivalent (`12 / 1.66 em`). Apply `material-design/typography/caption`. |

The component is **self-contained** — every paint binds to a variable in the local `merak` collection in `KQjP6W9Uw1PN0iipwQHyYn`. The same local-only rule established in `../Checkbox/figma.spec.md` §7 issue 9 applies here.

## 2. Source-to-Figma Property Mapping

| MUI prop                                                   | Figma property            | Type    | Notes                                                                                                                                                                                              |
| ---------------------------------------------------------- | ------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FormGroup.row`                                            | `Direction`               | VARIANT | `Column` (default, `row=false`) / `Row` (`row=true`). Controls the inner Group's auto-layout direction.                                                                                            |
| `Checkbox.color` _(per option)_                            | `Color`                   | VARIANT | `Default` / `Primary` / `Secondary` / `Error` / `Warning` / `Info` / `Success`. Cascaded to every nested `<CheckboxFormControl>` instance.                                                         |
| `Checkbox.size` _(per option)_                             | `Size`                    | VARIANT | `Small` / `Medium` / `Large`. Cascaded to every nested instance.                                                                                                                                   |
| `FormControl.disabled`                                     | `State` _(when set)_      | VARIANT | `disabled=true` → `State=Disabled`. Recolors FormLabel + FormHelperText + every nested option to disabled tones.                                                                                   |
| `FormControl.error`                                        | `State` _(when set)_      | VARIANT | `error=true` → `State=Error`. Repaints **only** FormLabel + FormHelperText to `palette.error.main`; per-option labels and inner Checkbox glyphs are unchanged. See §3 / §7 issue 5.                |
| `FormControl.required`                                     | _baked into Error_         | —       | The Figma `State=Error` row publishes a required asterisk after the FormLabel; outside of Error the asterisk is hidden. To represent a non-error required field, override the FormLabel's text node manually. |
| `FormLabel.children`                                       | `FormLabel` text override | TEXT    | Default `Label`. Override per-instance via the wrapper's text node `characters`.                                                                                                                   |
| `FormHelperText.children`                                  | `Helper` text override    | TEXT    | Default `Helper text` (Enabled/Disabled) / `Pick at least one option` (Error preset). Override per-instance.                                                                                       |
| `FormGroup` itself has no `value` / `name`; selection lives on per-option `<Checkbox>` `checked` / `onChange` | — | — | Behavior-only. `<CheckboxGroup>` is not a controlled component on the React side — each `<Checkbox>` carries its own state. |
| `Checkbox.checked` / `Checkbox.indeterminate` _(per option)_ | _baked into nested instance_ | —    | The three nested options carry `Checked=False, Indeterminate=False` (Option A), `Checked=True, Indeterminate=False` (Option B), `Checked=False, Indeterminate=True` (Option C) by default. Designers can override the per-option Checked / Indeterminate via the nested instance's variant axes.    |
| `FormControlLabel.label` _(per option)_                    | _baked into nested instance text_ | — | Default `Option A` / `Option B` / `Option C`. Override via the nested instance's `Label` text node `characters`.                                                                                |

> **No interaction-state axis on the wrapper.** The wrapper publishes `Enabled / Disabled / Error` only — `Hovered` / `Focused` / `Pressed` live on the nested `<Checkbox>`. To preview those, drop a bare `<Checkbox>` instance.
>
> **Figma property ids** (`#NNNN:N` suffix) are not stable across re-publishes; reference variants by axis values, never by the suffix.

## 3. Variant Property Matrix

```
Direction × Color × Size × State
Theoretical: 2 × 7 × 3 × 3  =  126 variants
Published  : 54 variants (sparse — see exclusions)
```

Per `Direction`:

- **Enabled** — `Color × Size`. `Color (7) × Size (3) = 21 cells`.
- **Disabled** — limited to `Color=Default × Size`. `1 × 3 = 3 cells`.
- **Error** — limited to `Color=Default × Size`. `1 × 3 = 3 cells`. (FormControl `error` does not cascade to inner Checkbox color, so a themed Error row would render identically to Default Error — keep it color-agnostic.)

`21 + 3 + 3 = 27 cells` per `Direction` × 2 directions = **54 cells**.

| Property       | Default value | Options                                                                  |
| -------------- | ------------- | ------------------------------------------------------------------------ |
| `Direction`    | `Column`      | `Column`, `Row`                                                          |
| `Color`        | `Primary`     | `Default`, `Primary`, `Secondary`, `Error`, `Warning`, `Info`, `Success` |
| `Size`         | `Medium`      | `Small`, `Medium`, `Large`                                               |
| `State`        | `Enabled`     | `Enabled`, `Disabled`, `Error`                                           |

Published-set exclusions (intentional):

- **`State=Disabled` is published only with `Color=Default`.** Disabled is color-agnostic in MUI; designers should pick `Color=Default, State=Disabled` regardless of the surrounding flow's brand color.
- **`State=Error` is published only with `Color=Default`.** MUI's Error state repaints FormLabel + FormHelperText only — the inner Checkbox's `color` prop does not cascade. A themed Error row (e.g. `Color=Primary × State=Error`) would render identically to `Color=Default × State=Error` for the FormLabel + helper, while the inner Checkbox retains its `color="primary"` paint. Publishing only `Color=Default × State=Error` keeps the matrix tight; consumers who need both an error helper AND themed checkboxes should compose manually with a bare `<Checkbox>` per option. See §7 issue 5.
- **`Hovered / Focused / Pressed` are not published.** Reach into the nested `<Checkbox>` set for those states.
- **Option C under `State=Disabled` falls back to `State=Enabled` on the nested instance.** The `<CheckboxFormControl>` set (`1:7367`) does not publish `(Indeterminate=True, State=Disabled)` — see `../CheckboxFormControl/figma.spec.md` §3 exclusion. Under a `State=Disabled` wrapper, Options A and B cascade `State=Disabled` to their nested instance correctly, but Option C (`Indeterminate=True`) cannot — it remains at `State=Enabled` on the nested instance, so its glyph paints the brand-tinted indeterminate dash instead of `palette.action.disabled`. Adopters who care about a fully-disabled tri-state row should override Option C's `Indeterminate` to `False` (or Adopters can wait for the nested set to publish the missing combo). See §7 issue 8.

### 3.1 Component (non-variant) properties

`<CheckboxGroup>` exposes two designer-facing booleans:

| Property        | Default | Effect                                                                        |
| --------------- | ------- | ----------------------------------------------------------------------------- |
| `WithLabel`     | `True`  | Toggles the `FormLabel` text node visibility (boolean component property).    |
| `WithHelper`    | `False` | Toggles the `FormHelperText` text node visibility.                            |

Plus two `TEXT` overrides:

| Override        | Default          | Notes                                                            |
| --------------- | ---------------- | ---------------------------------------------------------------- |
| `FormLabel`     | `Label`          | Override per-instance via the wrapper's text node `characters`.  |
| `Helper`        | `Helper text` _(Enabled / Disabled)_ · `Pick at least one option` _(Error preset)_ | Override per-instance.                                          |

The three nested `<CheckboxFormControl>` instances expose their own per-option label overrides (Option A / B / C) and per-option `Checked` / `Indeterminate` axes. To rename / re-order options, override the nested instances directly; do not bake additional option counts into the variant matrix.

## 4. Design Tokens

All paints, strokes, and surfaces bind to local variables in the MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`). The component is **self-contained** — every binding resolves to a variable in this file's local collection.

### 4.1 Layout

| Property                              | Value                            |
| ------------------------------------- | -------------------------------- |
| Outer `FormControl` direction         | Vertical (column)                |
| Outer `FormControl` `itemSpacing`     | `4 px` (between FormLabel ↔ Group ↔ FormHelperText) |
| Outer `FormControl` padding           | `0 px`                           |
| Inner `Group` direction               | `Vertical` _(Direction=Column)_ / `Horizontal` _(Direction=Row)_ |
| Inner `Group` `itemSpacing`           | `8 px` _(Column)_ / `16 px` _(Row)_ |
| Inner `Group` padding                 | `0 px`                           |
| Per-option row direction              | `Horizontal` (label end-aligned to indicator)   |
| Per-option row `itemSpacing`          | `4 px` _(matches `<CheckboxFormControl>` §4.1)_ |

> **MUI runtime spaces options via `FormControlLabel.marginRight: 16px` and natural line breaks.** The Figma cell normalises this to a real auto-layout `itemSpacing` (`8 px` vertical, `16 px` horizontal). Drift in §7 issue 1.

### 4.2 Token bindings

| Role                              | Token                                                  | Notes                                                                          |
| --------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `FormLabel` text — Enabled        | **`alias/colors/text-sub`** _(`#000000 0.6α`)_         | MUI `palette.text.secondary`. Color-agnostic.                                   |
| `FormLabel` text — Disabled       | **`alias/colors/text-disabled`** _(`#000000 0.38α`)_   | MUI `palette.text.disabled`.                                                    |
| `FormLabel` text — Error          | **`seed/danger/main`** _(`#D32F2F`)_                   | MUI `palette.error.main`.                                                       |
| `FormLabel` required asterisk     | **`seed/danger/main`** _(`#D32F2F`)_                   | The `*` character paints the same red as the Error label.                       |
| `FormHelperText` — Enabled        | **`alias/colors/text-sub`** _(`#000000 0.6α`)_         | Same as FormLabel Enabled.                                                      |
| `FormHelperText` — Disabled       | **`alias/colors/text-disabled`** _(`#000000 0.38α`)_   |                                                                                 |
| `FormHelperText` — Error          | **`seed/danger/main`** _(`#D32F2F`)_                   |                                                                                 |
| Per-option label / inner Checkbox | _(inherits from nested `<CheckboxFormControl>` instance)_ | See `../CheckboxFormControl/figma.spec.md` §4.2. Important: Error state does **not** cascade to nested instances — see §7 issue 5. |
| Outer `FormControl` frame fill    | _(transparent)_                                        | The wrapper paints nothing of its own.                                          |

### 4.3 Typography

Three text styles are consumed:

| Slot               | Style                                              | Notes                                                                |
| ------------------ | -------------------------------------------------- | -------------------------------------------------------------------- |
| `FormLabel`        | `material-design/typography/subtitle1` _(or a dedicated `form-label`)_ | Runtime line-height is `1.4375em` (≈ `23 px`). `body1` would stand `1 px` taller — see §7 issue 6. |
| Per-option label   | `material-design/typography/body1`                 | `Roboto Regular 16 / 24 px`. Inherited from `<CheckboxFormControl>`. |
| `FormHelperText`   | `material-design/typography/caption`               | `Roboto Regular 12 / 1.66 em`, ls `0.4 px`. MUI's `MuiFormHelperText` shape. |

> Apply text styles by id; do not hand-set `fontName` / `fontSize` / `lineHeight`.

### 4.4 Nested `<CheckboxFormControl>` token bindings

Each option row carries a nested `<CheckboxFormControl>` instance (see `../CheckboxFormControl/figma.spec.md` §4). Each `<CheckboxGroup>` variant pre-sets the nested instances' `Color / Size / Checked / Indeterminate` axes:

| Option   | `Checked` | `Indeterminate` | Glyph rendered                  |
| -------- | --------- | --------------- | ------------------------------- |
| Option A | `False`   | `False`         | `CheckBoxOutlineBlankIcon` (unchecked square) |
| Option B | `True`    | `False`         | `CheckBoxIcon` (filled + ✓)    |
| Option C | `False`   | `True`          | `IndeterminateCheckBoxIcon` (filled + dash) |

The `State` axis on each nested instance is pinned to `Enabled` (or `Disabled` when the wrapper is `State=Disabled` and the option's nested combo is published) — Error state is **not** cascaded to the nested checkboxes. Under `State=Disabled`, Option C falls back to nested `State=Enabled` because `<CheckboxFormControl>` doesn't publish `(Indeterminate=True, State=Disabled)` — see §3 exclusion list and §7 issue 8.

## 5. Icons

`<CheckboxGroup>` does not consume icons directly — the indicator glyphs come from the nested `<Checkbox>` instances inside each `<CheckboxFormControl>` row. See [`../Checkbox/figma.spec.md`](../Checkbox/figma.spec.md) §5.

## 6. Layout

The Component Set is laid out as a **2-column × multi-row grid** inside its outer frame (`306:6886`):

- **Columns** (left → right) — `Direction`: Column, Row.
- **Rows** (top → bottom) — `Color × Size × State`:
  - For each Color (Default → Primary → Secondary → Error → Warning → Info → Success) at `State=Enabled`: Small / Medium / Large.
  - Disabled / Error rows: Color=Default × Size × State.

`WithLabel` and `WithHelper` are **boolean component properties** (per §3.1), not variant axes — they do **not** multiply the published-variant count. Every cell ships with both the `FormLabel` and `FormHelperText` text nodes present; the booleans toggle their visibility per-instance.

Cell composition:

- `FormControl` (FRAME, vertical auto-layout, `itemSpacing 4 px`).
  - `FormLabel` (TEXT, `subtitle1` style, fill bound per §4.2). Visible when `WithLabel=True`.
  - `Group` (FRAME, auto-layout, direction per `Direction` axis, `itemSpacing 8 / 16 px`).
    - `Option A` (INSTANCE of `<CheckboxFormControl>`, `Checked=False, Indeterminate=False`).
    - `Option B` (INSTANCE of `<CheckboxFormControl>`, `Checked=True, Indeterminate=False`).
    - `Option C` (INSTANCE of `<CheckboxFormControl>`, `Checked=False, Indeterminate=True`).
  - `FormHelperText` (TEXT, `caption` style, fill bound per §4.2). Visible when `WithHelper=True`.

Surrounding documentation in the outer frame:

- **Header** — title `<CheckboxGroup>`, source story path, behavior summary, the Error-cascade note.
- **Sibling sets** — `<Checkbox>` (`1:7228`) and `<CheckboxFormControl>` (`1:7367`) sit above on the same page.

## 7. Usage Guidelines

### 7.1 Picking a variant

1. Pick `Direction`: `Column` for traditional vertical lists, `Row` for short horizontal selections (e.g. yes/no/maybe combinations).
2. Map the runtime `color` / `size` / `disabled` per `../Checkbox/figma.spec.md` §7.1 — every option row follows.
3. For the Error state, pick `Color=Default × State=Error` — the Error tone is FormLabel + helper only, **not** a per-option recolor. To get red glyphs in the Error case, also override the nested instances' `Color` axis to `Error`.
4. Toggle `WithLabel` / `WithHelper` based on whether the form needs a question / explanation.
5. Override the FormLabel + FormHelperText `characters` to the runtime question / message.
6. Override per-option label text via the nested `<CheckboxFormControl>` instance's text node.
7. Override per-option `Checked` / `Indeterminate` via the nested instance's variant axes — the cell ships A unchecked / B checked / C indeterminate as a representative sample, not a contract.

### 7.2 Don'ts

- ❌ Don't detach `<CheckboxGroup>` to add a fourth option — for variable option counts, compose manually with `<CheckboxFormControl>` instances inside an auto-layout frame.
- ❌ Don't manually override the nested `<CheckboxFormControl>`'s variant axes for `Color` / `Size` — the wrapper already cascades them. Manual overrides produce inconsistencies between the wrapper variant name and the visible options.
- ❌ Don't paste a hex value for the FormLabel / helper color — bind to the §4.2 token.
- ❌ Don't apply `paint.opacity < 1` on a `text-sub` paint to fake the disabled tone — Figma flattens to `opacity = 1` on instance creation. Bind `text-disabled` directly.
- ❌ Don't combine `Color ≠ Default` with `State ∈ {Disabled, Error}`. The non-Default themed rows would render identically to Default for the FormLabel + helper, and the inner Checkbox's `color` would not cascade in the Error case.
- ❌ Don't reach for `body1` on the FormLabel — its line-height (24 px) is taller than runtime (23 px). Use `subtitle1` (or a dedicated `form-label`).
- ❌ Don't bake a fourth option / fifth option / etc. into the variant matrix. The published cell ships exactly three options as a representative sample; consumers extend with extra `<CheckboxFormControl>` instances inside their own auto-layout.

### 7.3 Open issues (drift)

Tracked here so the next runtime-truth pass has a punch list:

1. **Wrapper gap is `normal`, not numeric — Figma normalises both directions.** FormGroup spaces options via `FormControlLabel.marginRight: 16px` (row direction) and natural line breaks via `line-height: 24px` rows + Checkbox `9 px` padding (column direction). The Figma cell normalises this to `itemSpacing 8 px` (column) / `itemSpacing 16 px` (row). The column value is a **fabrication** — runtime emits no vertical flex gap at all; the visible inter-row breathing room comes from the inner `<Checkbox>`'s 9 px padding plus the row's 24 px line-height. The Figma `8 px` is a layout-convenience choice that adds about ~8 px of extra height per option vs. runtime. Visual delta is small (~5 px tighter than runtime in row direction; ~8 px taller per row in column direction). Resolve by accepting the simplified Figma layout or setting `itemSpacing` to `0` in column direction (and adding the runtime-style margins as wrapper-frame padding) at the next runtime-truth pass.
2. **Letter-spacing differs.** Same as `<CheckboxFormControl>` §7 issue 2 — `body1` text style ships at `letterSpacing: 0%` while runtime is `0.15008 px`.
3. **Font family differs.** Same as `<CheckboxFormControl>` §7 issue 3 — Figma uses `Noto Sans TC Regular`, runtime uses `Roboto`. Accepted-as-is.
4. **`Size=Large` is Figma-only.** Inherited from `../Checkbox/figma.spec.md` §7 issue 1.
5. **Error state does not cascade to inner Checkboxes.** Setting `<FormControl error>` repaints FormLabel + FormHelperText only; the inner `<Checkbox>` retains its `color` prop. The Figma `State=Error` cell is published only at `Color=Default` — designers who want red glyphs must explicitly override the nested `<CheckboxFormControl>` instances' `Color` axis to `Error` (or compose manually with a bare `<Checkbox>` per option). Resolve by either (a) accepting the documented limitation (current decision) or (b) baking a separate `ErrorThemed` axis that auto-sets nested `Color=Error`.
6. **FormLabel line-height differs from `body1`.** Runtime ships FormLabel at `1.4375em` (≈ 23 px at `16 px`); the project's `body1` text style is `24 px`. If Figma applies `body1` to the FormLabel by mistake, the row will stand 1 px taller than runtime — bind FormLabel to `subtitle1` (or mint a dedicated `form-label`) instead.
7. **`Mui-required` asterisk position.** MUI appends the `*` after the label text with a leading space; the Figma cell encodes the `*` inline in the `FormLabel` text override. If the text is overridden without the `*`, the Required marker is lost — document the convention so designers don't accidentally drop it.
8. **Tri-state fixture vs. `<RadioGroup>`'s off/on/off.** The Checkbox group renders Option C as `Indeterminate=True` so a single cell surfaces all three glyph styles. `<RadioGroup>` keeps off/on/off because radio is single-select. Designers comparing the two cells should expect the asymmetry.
9. **Option C does not grey out under `State=Disabled`.** The `<CheckboxFormControl>` set (`1:7367`) excludes the `(Indeterminate=True, State=Disabled)` combo — see [`../CheckboxFormControl/figma.spec.md`](../CheckboxFormControl/figma.spec.md) §3. As a result, every `<CheckboxGroup>` Disabled wrapper variant (6 cells: 2 Direction × 3 Sizes) leaves Option C's nested instance at `State=Enabled`, so its dash glyph keeps the brand-tinted (`Color=Default` → `bg-active`) paint instead of `palette.action.disabled`. Adopters who need a uniformly-disabled tri-state row must either (a) override Option C's `Indeterminate` axis to `False` (collapsing to off/on/off), or (b) wait for the nested set to publish the missing combo. Resolve at the next runtime-truth pass by extending `<CheckboxFormControl>` rather than detaching here.

## 8. Source Sync Rule

This document and the source must move together. When **any** of the following changes:

1. `src/stories/CheckboxGroup.stories.tsx` (variants, args, `row` / `disabled` / `error` / `required` / per-option `checked` / `indeterminate` wiring)
2. The Figma `<CheckboxGroup>` component set (variants, properties, token bindings)
3. The Figma `<CheckboxFormControl>` component set (`1:7367`) — any change to its variant matrix or naming forces the nested instance mirroring contract to be re-validated, and the published axis options here may need to follow
4. The Figma `<Checkbox>` component set (`1:7228`) — same as above (transitively)
5. `src/stories/Checkbox.stories.tsx` / `src/stories/CheckboxFormControl.stories.tsx` — any new state / size / color introduced upstream forces a follow-up here
6. The shared `merak/alias/colors/{text-sub,text-disabled}` and `merak/seed/danger/main` tokens — these are the wrapper's only direct color dependencies
7. `material-design/typography/{body1,subtitle1,caption}` text styles — typography changes flow into §4.3 / §7 drift
8. `.storybook/preview.tsx` (theme overrides via `createTheme`) — today this is an empty `createTheme()`; introducing typography / palette / `MuiFormControl.defaultProps` overrides forces a re-measure
9. `package.json` `@mui/material` peer / dev version (currently `^7.3.10` / peer `>=7`)

…this spec **must be updated in the same change**. Specifically:

- Adding a `Hovered / Focused / Pressed` State here → expand §3 exclusions list, add §4 halo bindings (mirror `../Checkbox/figma.spec.md` §4.2), regenerate the published variants.
- Promoting per-option label text to a top-level `TEXT` component property → update §3.1 and §7.1.
- Replacing the auto-layout `itemSpacing 8 / 16 px` with runtime-faithful `0 / 16 px` margins → update §4.1 / §7 issue 1.
- Adding a themed Error cascade (auto-setting nested `Color=Error`) → drop §7 issue 5, expand §3 to cover `Color × State=Error` for every Color, regenerate variants.
- Token rename / removal in `merak/alias/colors/*` or `seed/danger/*` → update every reference in §4.2 and rename the matching variable in the local Figma collection.
- Changing the per-option fixture (e.g. uniform on/on/on) → update §1, §4.4, §6, and §7.1.
- `@mui/material` major bump → re-run `storybook.render.md` measurements; bump the version row in §1; reconcile any new computed-style values against §4.

## 9. Quick Reference

```ts
// Source surface (composing @mui/material's FormControl + FormLabel + FormGroup + FormHelperText)
type CheckboxGroupComposedProps = {
  row?: boolean;                                          // → Figma `Direction`
  disabled?: boolean;                                     // → Figma `State=Disabled`
  error?: boolean;                                        // → Figma `State=Error`
  required?: boolean;                                     // → Figma `*` asterisk after FormLabel
  label?: React.ReactNode;                                // → Figma `FormLabel` text override
  helperText?: React.ReactNode;                           // → Figma `Helper` text override
  options: Array<{
    label: React.ReactNode;                               // → nested `<CheckboxFormControl>.Label`
    checked?: boolean;                                    // → nested `<Checkbox>.Checked`
    indeterminate?: boolean;                              // → nested `<Checkbox>.Indeterminate`
  }>;                                                     // → nested `<CheckboxFormControl>` instances
  // Per-option color / size cascade to every nested instance:
  color?: CheckboxProps['color'];                         // → Figma `Color`
  size?: CheckboxProps['size'];                           // → Figma `Size`
};
```

```
Figma Component Set: <CheckboxGroup>  (306:6886)
  Variant axes : Direction × Color × Size × State
  Properties   : WithLabel (BOOL, default True),
                 WithHelper (BOOL, default False),
                 FormLabel (TEXT, default "Label"),
                 Helper (TEXT, default "Helper text" / "Pick at least one option" for Error)
  Default      : Direction=Column, Color=Primary, Size=Medium, State=Enabled,
                 WithLabel=True, WithHelper=False
  Total        : 54 published variants
                 (per Direction: 21 Enabled + 3 Disabled + 3 Error = 27; × 2 = 54)
  Sparse       : Disabled / Error limited to Color=Default;
                 Hovered/Focused/Pressed not published
  Nested       : 3 × <CheckboxFormControl> instances per cell — axes mirror the outer variant
                 (Option A unchecked, B checked, C indeterminate)
  Override     : FormLabel / Helper text node `characters`; per-option label / Checked / Indeterminate
                 via nested instance
```

## 10. Token Glossary

The complete set of tokens consumed by `<CheckboxGroup>` directly. Names are **Figma variable paths**; the nested `<CheckboxFormControl>` and `<Checkbox>` carry their own catalogues.

### 10.1 Alias and seed tokens

| Token                          | Used by                       | Role                                                      |
| ------------------------------ | ----------------------------- | --------------------------------------------------------- |
| `alias/colors/text-sub`        | FormLabel + helper, Enabled   | MUI `palette.text.secondary` (`#000000 0.6α`).            |
| `alias/colors/text-disabled`   | FormLabel + helper, Disabled  | MUI `palette.text.disabled` (`#000000 0.38α`).            |
| `seed/danger/main`             | FormLabel + helper + asterisk, Error | MUI `palette.error.main` (`#D32F2F`).              |

### 10.2 Component-scoped tokens

`<CheckboxGroup>` does **not** mint any component-scoped tokens. If a future divergence requires one (e.g. a per-direction gap that differs from `gap-2 / gap-4`), mint it as a `component/checkbox-group/*` local in the MUI-Library file and document it in `design-token.md`.

### 10.3 Typography

| Style                                       | Used by              |
| ------------------------------------------- | -------------------- |
| `material-design/typography/subtitle1`      | FormLabel            |
| `material-design/typography/body1`          | Per-option label _(inherited via `<CheckboxFormControl>`)_ |
| `material-design/typography/caption`        | FormHelperText       |

### 10.4 Nested component tokens

See [`../CheckboxFormControl/figma.spec.md`](../CheckboxFormControl/figma.spec.md) §10 for per-row label tokens, and [`../Checkbox/figma.spec.md`](../Checkbox/figma.spec.md) §10 for the indicator's full catalogue.

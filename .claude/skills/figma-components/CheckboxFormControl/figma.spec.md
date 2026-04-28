---
name: figma-component-checkbox-form-control-spec
description: Figma component specification for `<CheckboxFormControl>` — design counterpart of MUI's composed `<FormControlLabel>` + `<Checkbox>` consumed by `src/stories/CheckboxFormControl.stories.tsx`. Wraps a `<Checkbox>` instance and a sibling `Label` text node in auto-layout. Documents the LabelPlacement × Color × Checked × Indeterminate × Size × State variant matrix, the nested-instance mirroring contract, and source-to-Figma mapping rules. For runtime measurements see `storybook.render.md`; for the inner-indicator spec see `../Checkbox/figma.spec.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '1:7367'
figma_component_set_id: '1:7367'
---

# `<CheckboxFormControl>` Figma Component Specification

## 1. Overview

`<CheckboxFormControl>` is the Figma counterpart of the composed pattern MUI ships as `<FormControlLabel>` + `<Checkbox>`:

```tsx
<FormControlLabel
  labelPlacement="end"  // → Figma `LabelPlacement`
  label="Label"         // → Figma Text override
  control={<Checkbox color={...} size={...} checked={...} indeterminate={...} />}
/>
```

There is no separate `<CheckboxFormControl>` runtime component; the project's name is the wrapper-side label for the composed pattern. The Figma component wraps:

- one **`<Checkbox>` instance** (`1:7228`) — the indicator
- one sibling **Text** node (the `Label`, bound to `alias/colors/text-default`)

inside an auto-layout frame whose direction encodes `labelPlacement`. The set ships the full `LabelPlacement × Color × Checked × Indeterminate × Size × State` matrix and mirrors the relevant axes onto the nested `<Checkbox>` instance automatically — designers do **not** need to override the inner instance to retint or resize. State is limited to `Enabled` and `Disabled`; `Hovered` / `Focused` / `Pressed` are reachable on the inner `<Checkbox>` set but are not republished here.

| Aspect            | Value                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| Source story      | `src/stories/CheckboxFormControl.stories.tsx`                                          |
| Underlying source | `@mui/material@^7.3.10` `FormControlLabel` + `Checkbox` (re-exported by this package, no wrapper) |
| Figma file        | [MUI-Library](https://www.figma.com/design/KQjP6W9Uw1PN0iipwQHyYn) (`KQjP6W9Uw1PN0iipwQHyYn`) |
| Figma frame       | `<CheckboxFormControl>` (`1:7367`, `1620 × 1987 px`) on the same page as `<Checkbox>` |
| Component Set     | `<CheckboxFormControl>` (`1:7367`)                                                     |
| Total variants    | **276** (4 LabelPlacement × 7 Color × 3 Checked/Indeterminate combos × 3 Sizes × Enabled = 252; + 4 LabelPlacement × 1 Color (Default) × 2 (Checked F/F, T/F) × 3 Sizes × Disabled = 24) |
| Nested component  | `<Checkbox>` (`1:7228`) — instance, axes mirror the outer set                          |
| Typography (label) | `body1` style — `Roboto Regular 16 / 24 px`, ls `0.15 px` (no text-transform)         |

## 2. Source-to-Figma Property Mapping

| MUI prop                                                   | Figma property            | Type    | Notes                                                                                                                                                                                              |
| ---------------------------------------------------------- | ------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FormControlLabel.labelPlacement`                          | `LabelPlacement`          | VARIANT | `End` (default) / `Start` / `Top` / `Bottom`. Controls auto-layout direction (`row` / `row-reverse` / `column-reverse` / `column`).                                                                |
| `Checkbox.color`                                           | `Color`                   | VARIANT | `Default` / `Primary` / `Secondary` / `Error` / `Warning` / `Info` / `Success`. Mirrors the inner `<Checkbox>`. Label text remains color-agnostic — only the indicator picks up the brand color.   |
| `Checkbox.size`                                            | `Size`                    | VARIANT | `Small` / `Medium` (MUI native) / `Large` (Figma-only — see `../Checkbox/figma.spec.md` §7 issue 1). Mirrors the inner `<Checkbox>`.                                                                |
| `Checkbox.checked` _(true)_                                | `Checked`                 | VARIANT | `true` → `Checked=True, Indeterminate=False`. Mirrored onto the nested `<Checkbox>`.                                                                                                              |
| `Checkbox.checked` _(false)_                               | `Checked` + `Indeterminate` | VARIANT | `false` → `Checked=False, Indeterminate=False`. Mirrored.                                                                                                                                       |
| `Checkbox.indeterminate`                                   | `Indeterminate`           | VARIANT | `true` → `Indeterminate=True, Checked=False`. MUI suppresses the check glyph; the `Checked=True, Indeterminate=True` combo is **not** published.                                                  |
| `FormControlLabel.disabled`                                | `State`                   | VARIANT | `Enabled` / `Disabled`. Disabled is published only with `Color=Default`. Mirrored onto the nested `<Checkbox>` and recolors the label text.                                                       |
| `FormControlLabel.label`                                   | `Label` text override     | TEXT    | Default `Label`. Override per-instance via the wrapper's Text node `characters`.                                                                                                                   |
| `FormControlLabel.componentsProps` / `slotProps`           | —                         | —       | Not represented today.                                                                                                                                                                             |
| `Checkbox.onChange`                                        | —                         | —       | Behavior-only.                                                                                                                                                                                     |
| `className`                                                | —                         | —       | Not represented in Figma.                                                                                                                                                                          |

Each variant carries a nested `<Checkbox>` instance whose axes are pre-set to match the wrapping variant. Designers should **not** manually override the nested instance — pick the `<CheckboxFormControl>` variant directly and the indicator follows.

> **No interaction-state axis on the wrapper.** MUI runtime never paints a wrapper-level hover / focus / pressed surface — the only visible interaction state is the inner Checkbox's halo. The Figma set publishes `Enabled / Disabled` only; if a flow needs an interaction-state checkbox-with-label, drop a bare `<Checkbox>` and compose the label manually until those variants are added here.
>
> **Figma property ids** (`#NNNN:N` suffix) are not stable across re-publishes; reference variants by axis values, never by the suffix.

## 3. Variant Property Matrix

```
LabelPlacement × Color × (Checked × Indeterminate, 3 published combos) × Size × State
Theoretical: 4 × 7 × 4 × 3 × 2  =  672 variants
Published  : 276 variants (sparse — see exclusions)
```

Per `LabelPlacement`:

- **Enabled** — `Color × Size × (Checked × Indeterminate, 3 published combos)`. `Color (7) × Size (3) × Combo (3) = 63 cells`.
- **Disabled** — limited to `Color=Default × Size × {Checked=False, True}` (i.e. 2 combos: F/F and T/F; the F/T combo with `Indeterminate=True` is excluded under Disabled). `1 × 3 × 2 = 6 cells`.

`63 + 6 = 69 cells` per `LabelPlacement`, × 4 placements = **276 published variants**.

| Property         | Default value | Options                                                                  |
| ---------------- | ------------- | ------------------------------------------------------------------------ |
| `LabelPlacement` | `End`         | `End`, `Start`, `Top`, `Bottom`                                          |
| `Color`          | `Primary`     | `Default`, `Primary`, `Secondary`, `Error`, `Warning`, `Info`, `Success` |
| `Checked`        | `False`       | `False`, `True`                                                          |
| `Indeterminate`  | `False`       | `False`, `True`                                                          |
| `Size`           | `Medium`      | `Small`, `Medium`, `Large`                                               |
| `State`          | `Enabled`     | `Enabled`, `Disabled`                                                     |

Published-set exclusions (intentional — keep them in mind when picking instances):

- **`Indeterminate=True` is published only with `Checked=False`.** MUI suppresses the check glyph whenever `indeterminate` is set.
- **`State=Disabled` is published only with `Color=Default`.** Disabled is color-agnostic in MUI; designers should pick `Color=Default, State=Disabled` regardless of the surrounding flow's brand color.
- **`Indeterminate=True, State=Disabled` is not published.** Mirrors `../Checkbox/figma.spec.md` §3 exclusion.
- **`State ∈ {Hovered, Focused, Pressed}` is not published in `<CheckboxFormControl>`.** Use the bare `<Checkbox>` set + a manually composed label until those variants land here.

### 3.1 Component (non-variant) properties

`<CheckboxFormControl>` exposes a structural `Slot` that holds the nested `<Checkbox>` composition; it is not designer-facing. The label text is overridden by editing the wrapper's Text node `characters` directly. If repeated overrides become noisy, promote `Text.characters` to a top-level `TEXT` component property in a follow-up.

## 4. Design Tokens

All paints, strokes, and surfaces bind to local variables in the MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`). The component is **self-contained** — every binding resolves to a variable in this file's local collection. _(Local-only sweep completed 2026-04-29 — see §7 issue 6 and `../Checkbox/figma.spec.md` §7 issue 9.)_

### 4.1 Layout

| Property                              | LabelPlacement=End  | LabelPlacement=Start  | LabelPlacement=Top   | LabelPlacement=Bottom |
| ------------------------------------- | ------------------- | --------------------- | -------------------- | --------------------- |
| Auto-layout direction                 | Horizontal (row)    | Horizontal-reverse    | Vertical-reverse     | Vertical              |
| Cross-axis alignment                  | `Center`            | `Center`              | `Center`             | `Center`              |
| Item spacing (`itemSpacing`)          | `4 px`              | `4 px`                | `4 px`               | `4 px`                |
| Outer left/right margin (Figma cell)  | `0 px` (no extra)   | `0 px`                | `0 px`               | `0 px`                |

> **MUI runtime uses `-11 / 16 px` outer margins, not auto-layout `gap`.** See `storybook.render.md` §1 — MUI relies on the inner Checkbox's `9 px` padding to space the indicator from the label and applies `-11 px / 16 px` outer margins on the wrapper. The Figma cells normalise this to a real auto-layout `itemSpacing` (`4 px`, matching the project's `gap-1`) and drop the outer margins; consumers who need the runtime offsets should add them at the surrounding layout. Drift in §7 issue 1.

### 4.2 Token bindings

| Role                              | Token                                                  | Notes                                                                          |
| --------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Label text — Enabled              | **`alias/colors/text-default`** _(`#000000 0.87α`)_    | MUI `palette.text.primary`. Color-agnostic — every Color value paints the same label color. |
| Label text — Disabled             | **`alias/colors/text-disabled`** _(`#000000 0.38α`)_   | MUI `palette.text.disabled`. The Figma set binds the disabled tone via a token swap, **not** via `paint.opacity = 0.38` on a `text-default` paint (that would flatten on instance creation). |
| Inner `<Checkbox>` glyph          | _(inherits from nested instance)_                      | See [`../Checkbox/figma.spec.md`](../Checkbox/figma.spec.md) §4.2.              |
| Inner `<Checkbox>` halo           | _(not painted — wrapper publishes Enabled / Disabled only)_ | Drop a bare `<Checkbox>` for Hovered / Focused / Pressed.                  |
| Auto-layout frame fill            | _(transparent)_                                        | The wrapper paints nothing of its own.                                         |

### 4.3 Typography

Label text uses MUI's `body1` Typography. The Figma cells apply the published `material-design/typography/body1` text style (`Noto Sans TC Regular 16 / 24 px`, `letter-spacing 0%`); MUI runtime renders Roboto at the same size. Sub-pixel and font-family differences are accepted (`storybook.render.md` §2 records the runtime numbers).

| Property                         | Value                                               |
| -------------------------------- | --------------------------------------------------- |
| Font family (Figma)              | `Noto Sans TC Regular` _(applied via text style)_   |
| Font family (runtime)            | `Roboto, Helvetica, Arial, sans-serif`              |
| Font weight                      | `400`                                               |
| Font size                        | `16 px`                                             |
| Line height                      | `24 px`                                             |
| Letter spacing                   | `0 %` Figma cell · `0.15 px` runtime — see §7 issue 2 |
| Text transform                   | none                                                |

> Apply text styles by id; do not hand-set `fontName` / `fontSize` / `lineHeight`.

### 4.4 Nested `<Checkbox>` token bindings

The nested instance carries its own bindings (see `../Checkbox/figma.spec.md` §4). Each `<CheckboxFormControl>` variant pre-sets the nested instance to the matching `Color / Size / Checked / Indeterminate / State` so the indicator's tokens resolve correctly without manual override.

## 5. Icons

`<CheckboxFormControl>` does not consume icons directly — the indicator glyphs come from the nested `<Checkbox>` instance. See [`../Checkbox/figma.spec.md`](../Checkbox/figma.spec.md) §5.

## 6. Layout

The Component Set is laid out as a **4-column × multi-row grid** inside the `<CheckboxFormControl>` frame (`1:7367`, `1620 × 1987 px`):

- **Columns** (left → right) — `LabelPlacement`: End, Start, Top, Bottom. Column origins x = `{40, 460, 880, 1300}`; column stride `420 px`.
- **Rows** (top → bottom) — `Color × Size × (Checked, Indeterminate)`:
  - For each Color (Default → Primary → Secondary → Error → Warning → Info → Success):
    - Small × (F/F, T/F, F/T)
    - Medium × (F/F, T/F, F/T)
    - Large × (F/F, T/F, F/T)
  - Disabled rows: Color=Default × Size × (F/F, T/F).
- Row stride matches the auto-layout cell height (`33 px` Small / `36 px` Medium / `39 px` Large for End/Start; `61 px` Small / `64 px` Medium / `67 px` Large for Top/Bottom).

Cell composition:

- `Wrapper` (FRAME, auto-layout) — direction per `LabelPlacement`, `itemSpacing 4 px`, cross-axis `Center`.
  - `Checkbox` (INSTANCE of `1:7228`) — axes mirrored from the wrapping variant.
  - `Label` (TEXT) — `body1` text style, fill bound per §4.2.

Surrounding documentation in the outer frame:

- **Header** — title `<CheckboxFormControl>`, source story path, behavior summary.
- **Sibling sets** — `<Checkbox>` (`1:7228`) sits above on the same page.

## 7. Usage Guidelines

### 7.1 Picking a variant

1. Pick `LabelPlacement` to match the source `labelPlacement` prop — `End` for the most common left-to-right form layout.
2. Map the runtime `value` and `color` / `size` / `disabled` per `../Checkbox/figma.spec.md` §7.1 — the inner instance follows the wrapper.
3. Override the **Text** node's characters for the label content.
4. **Do not override** the nested `<Checkbox>` instance manually — picking the right wrapper variant cascades the axes.

### 7.2 Don'ts

- ❌ Don't detach `<CheckboxFormControl>` to swap the indicator — pick the right outer variant.
- ❌ Don't manually override the nested `<Checkbox>`'s variant axes. The wrapper already mirrors them; manual overrides produce inconsistencies between the wrapper variant name and the visible indicator.
- ❌ Don't paste a hex value for the label color — bind to `alias/colors/text-default` (Enabled) or `alias/colors/text-disabled` (Disabled).
- ❌ Don't apply `paint.opacity < 1` on a `text-default` paint to fake the disabled tone — Figma flattens to `opacity = 1` on instance creation. Bind the token directly.
- ❌ Don't model multi-checkbox groups as `<CheckboxFormControl>` variants. Use multiple instances inside an auto-layout (`<FormGroup>` / `<RadioGroup>` recipes are tracked separately).
- ❌ Don't pair `Checked=True` with `Indeterminate=True`. MUI suppresses the check glyph; the combo is **not** published.
- ❌ Don't combine `Color ≠ Default` with `State=Disabled`. Pick `Color=Default, State=Disabled`.

### 7.3 Open issues (drift)

Tracked here so the next runtime-truth pass has a punch list:

1. **Wrapper outer margins.** MUI runtime applies `-11 px / 16 px` outer margins on `FormControlLabel`; the Figma cells use auto-layout `itemSpacing 4 px` instead. Visual delta is small (~5 px tighter than runtime). Resolve by either (a) accepting the simplified Figma layout and documenting the offset on the consumer side, or (b) adding the runtime margins as a wrapper-frame `padding` value.
2. **Letter-spacing differs.** MUI runtime applies `0.15 px` (`0.00938em × 16 px`); the Figma `body1` text style ships with `letterSpacing: 0%`. Resolve by repointing the Figma `body1` text style to `0.94 %` or by minting a `material-design/typography/body1-mui` companion.
3. **Font family differs.** Figma's `body1` text style uses `Noto Sans TC Regular`; MUI runtime renders `Roboto`. Accepted-as-is — locale-driven defaults; the visual height / spacing is identical.
4. **`Size=Large` falls back to Medium at runtime.** Inherited from `../Checkbox/figma.spec.md` §7 issue 1 — do not duplicate the resolution here.
5. **`Hovered / Focused / Pressed` are not published in this set.** Drop a bare `<Checkbox>` and compose the label manually until those variants are added.
6. **~~Wrapper-direct paints (label text fills) bind to external library variables, violating the local-only rule.~~ Resolved 2026-04-29.** Phase 3 of the local-only sweep rebound 276 fill paints (label text Enabled / Disabled) on this set from external `text-default` / `text-disabled` to the local `merak` equivalents. Verification confirmed 0 external bindings remain (648 paints local + 2 unbound). Inner `<Checkbox>` instances inherit the rebind from the master at `1:7228` (see [`../Checkbox/figma.spec.md`](../Checkbox/figma.spec.md) §7 issue 9). Closed.

## 8. Source Sync Rule

This document and the source must move together. When **any** of the following changes:

1. `src/stories/CheckboxFormControl.stories.tsx` (variants, args, `labelPlacement` / `disabled` wiring)
2. The Figma `<CheckboxFormControl>` component set at `1:7367` (variants, properties, token bindings)
3. The Figma `<Checkbox>` component set at `1:7228` — any change to its variant matrix or naming forces the nested instance mirroring contract to be re-validated, and the published axis options here may need to follow
4. `src/stories/Checkbox.stories.tsx` — any new state / size / color introduced upstream forces a follow-up here
5. The shared `merak/alias/colors/{text-default,text-disabled}` tokens — these are the wrapper's only direct dependencies
6. `material-design/typography/body1` text style — typography changes flow into §4.3 / §7 drift
7. `.storybook/preview.tsx` (theme overrides via `createTheme`) — today this is an empty `createTheme()`; introducing typography / palette / `MuiFormControlLabel.defaultProps` overrides forces a re-measure
8. `package.json` `@mui/material` peer / dev version (currently `^7.3.10` / peer `>=7`)

…this spec **must be updated in the same change**. Specifically:

- Adding `Hovered` / `Focused` / `Pressed` cells here → expand §3 exclusions list, add §4.X halo bindings (mirror the `../Checkbox/figma.spec.md` §4.2 rows), regenerate the published variants.
- Promoting label text to a `TEXT` component property → update §3.1 and §7.1.
- Replacing the auto-layout `itemSpacing 4 px` with runtime-faithful `-11 / 16 px` margins → update §4.1 / §7 issue 1.
- Adding `Indeterminate=True, State=Disabled` cells here → update §3 exclusions; mirror `../Checkbox/figma.spec.md`.
- Token rename / removal in `merak/alias/colors/*` → update every reference in §4.2 and rename the matching variable in the local Figma collection.
- `@mui/material` major bump → re-run `storybook.render.md` measurements; bump the version row in §1; reconcile any new computed-style values against §4.

## 9. Quick Reference

```ts
// Source surface (composing @mui/material's FormControlLabel + Checkbox)
type CheckboxFormControlProps = {
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';      // → Figma `LabelPlacement`
  label: React.ReactNode;                                    // → Figma `Label` text override
  disabled?: boolean;                                        // → Figma `State=Disabled`
  // The `control` slot carries a `<Checkbox>` whose props mirror Figma axes:
  control: React.ReactElement<CheckboxProps>;                // → nested `<Checkbox>` instance
};
```

```
Figma Component Set: <CheckboxFormControl>  (1:7367)
  Variant axes : LabelPlacement × Color × Checked × Indeterminate × Size × State
  Properties   : (none designer-facing — Label is a Text node override)
  Default      : LabelPlacement=End, Color=Primary, Checked=False, Indeterminate=False,
                 Size=Medium, State=Enabled
  Total        : 276 published variants
                 (per LabelPlacement: 63 Enabled + 6 Disabled = 69; × 4 = 276)
  Sparse       : Checked=True+Indeterminate=True excluded;
                 Disabled limited to Color=Default;
                 Indeterminate=True+Disabled not published;
                 Hovered/Focused/Pressed not published
  Nested       : <Checkbox> instance (1:7228) — axes mirror the outer variant automatically
  Override     : Text node `characters` for the label text
```

## 10. Token Glossary

The complete set of tokens consumed by `<CheckboxFormControl>` directly. Names are **Figma variable paths**; the nested `<Checkbox>` carries its own catalogue (see [`../Checkbox/figma.spec.md`](../Checkbox/figma.spec.md) §10).

### 10.1 Alias tokens (`merak/alias/colors/*`)

| Token                          | Used by                  | Role                                                      |
| ------------------------------ | ------------------------ | --------------------------------------------------------- |
| `alias/colors/text-default`    | Label text on Enabled    | MUI `palette.text.primary` (`#000000 0.87α`).             |
| `alias/colors/text-disabled`   | Label text on Disabled   | MUI `palette.text.disabled` (`#000000 0.38α`).            |

### 10.2 Component-scoped tokens

`<CheckboxFormControl>` does **not** mint any component-scoped tokens. If a future divergence requires one (e.g. a per-placement gap that differs from `gap-1`), mint it as a `component/checkbox-form-control/*` local in the MUI-Library file and document it in `design-token.md`.

### 10.3 Typography

| Style                         | Used by    |
| ----------------------------- | ---------- |
| `material-design/typography/body1` | Label text |

### 10.4 Inner `<Checkbox>` tokens

See [`../Checkbox/figma.spec.md`](../Checkbox/figma.spec.md) §10 for the indicator's full catalogue (`seed/<color>/{main, hover-bg, outline-hover}`, `alias/colors/{text-sub, fg-disabled, bg-outline-hover}`).

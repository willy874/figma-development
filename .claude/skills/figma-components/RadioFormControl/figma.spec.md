---
name: figma-component-radio-form-control-spec
description: Figma component specification for `<RadioFormControl>` — design counterpart of MUI's composed `<FormControlLabel>` + `<Radio>` consumed by `src/stories/RadioFormControl.stories.tsx`. Wraps a `<Radio>` instance and a sibling `Label` text node in auto-layout. Documents the LabelPlacement × Color × Checked × Size × State variant matrix, the nested-instance mirroring contract, and source-to-Figma mapping rules. For runtime measurements see `storybook.render.md`; for the inner-indicator spec see `../Radio/figma.spec.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '295:5573'
figma_component_set_id: '295:5573'
---

# `<RadioFormControl>` Figma Component Specification

## 1. Overview

`<RadioFormControl>` is the Figma counterpart of the composed pattern MUI ships as `<FormControlLabel>` + `<Radio>`:

```tsx
<FormControlLabel
  labelPlacement="end"  // → Figma `LabelPlacement`
  label="Label"         // → Figma Text override
  control={<Radio color={...} size={...} checked={...} />}
/>
```

There is no separate `<RadioFormControl>` runtime component; the project's name is the wrapper-side label for the composed pattern (mirror of `<CheckboxFormControl>`). The Figma component wraps:

- one **`<Radio>` instance** (the indicator — see `../Radio/figma.spec.md`)
- one sibling **Text** node (the `Label`, bound to `alias/colors/text-default`)

inside an auto-layout frame whose direction encodes `labelPlacement`. The set ships the full `LabelPlacement × Color × Checked × Size × State` matrix and mirrors the relevant axes onto the nested `<Radio>` instance automatically — designers do **not** need to override the inner instance to retint or resize. State is limited to `Enabled` and `Disabled`; `Hovered` / `Focused` / `Pressed` are reachable on the inner `<Radio>` set but are not republished here.

| Aspect            | Value                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| Source story      | `src/stories/RadioFormControl.stories.tsx`                                             |
| Underlying source | `@mui/material@^7.3.10` `FormControlLabel` + `Radio` (re-exported by this package, no wrapper) |
| Figma file        | [MUI-Library](https://www.figma.com/design/KQjP6W9Uw1PN0iipwQHyYn) (`KQjP6W9Uw1PN0iipwQHyYn`) |
| Figma frame       | `<RadioFormControl>` (`295:5572`) at `(1482, 18100)` on the `Foundation Components` page, sibling to `<Radio>` (`286:5441`) above |
| Component Set     | `<RadioFormControl>` (`295:5573`)                                                        |
| Total variants    | **192** (4 LabelPlacement × 7 Color × 2 Checked × 3 Sizes × Enabled = 168; + 4 LabelPlacement × 1 Color (Default) × 2 Checked × 3 Sizes × Disabled = 24) |
| Nested component  | `<Radio>` — instance, axes mirror the outer set                                         |
| Typography (label) | `body1` style — `Roboto Regular 16 / 24 px`, ls `0.15 px` (no text-transform)         |

## 2. Source-to-Figma Property Mapping

| MUI prop                                                   | Figma property            | Type    | Notes                                                                                                                                                                                              |
| ---------------------------------------------------------- | ------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FormControlLabel.labelPlacement`                          | `LabelPlacement`          | VARIANT | `End` (default) / `Start` / `Top` / `Bottom`. Controls auto-layout direction (`row` / `row-reverse` / `column-reverse` / `column`).                                                                |
| `Radio.color`                                              | `Color`                   | VARIANT | `Default` / `Primary` / `Secondary` / `Error` / `Warning` / `Info` / `Success`. Mirrors the inner `<Radio>`. Label text remains color-agnostic — only the indicator picks up the brand color.      |
| `Radio.size`                                               | `Size`                    | VARIANT | `Small` / `Medium` (MUI native) / `Large` (Figma-only — see `../Radio/figma.spec.md` §7 issue 1). Mirrors the inner `<Radio>`.                                                                       |
| `Radio.checked` _(true)_                                   | `Checked`                 | VARIANT | `true` → `Checked=True`. Mirrored onto the nested `<Radio>`.                                                                                                                                       |
| `Radio.checked` _(false)_                                  | `Checked`                 | VARIANT | `false` → `Checked=False`. Mirrored.                                                                                                                                                               |
| `FormControlLabel.disabled`                                | `State`                   | VARIANT | `Enabled` / `Disabled`. Disabled is published only with `Color=Default`. Mirrored onto the nested `<Radio>` and recolors the label text.                                                          |
| `FormControlLabel.label`                                   | `Label` text override     | TEXT    | Default `Label`. Override per-instance via the wrapper's Text node `characters`.                                                                                                                   |
| `FormControlLabel.componentsProps` / `slotProps`           | —                         | —       | Not represented today.                                                                                                                                                                             |
| `Radio.onChange`                                           | —                         | —       | Behavior-only.                                                                                                                                                                                     |
| `className`                                                | —                         | —       | Not represented in Figma.                                                                                                                                                                          |

Each variant carries a nested `<Radio>` instance whose axes are pre-set to match the wrapping variant. Designers should **not** manually override the nested instance — pick the `<RadioFormControl>` variant directly and the indicator follows.

> **No interaction-state axis on the wrapper.** MUI runtime never paints a wrapper-level hover / focus / pressed surface — the only visible interaction state is the inner Radio's halo. The Figma set publishes `Enabled / Disabled` only; if a flow needs an interaction-state radio-with-label, drop a bare `<Radio>` and compose the label manually until those variants are added here.
>
> **Figma property ids** (`#NNNN:N` suffix) are not stable across re-publishes; reference variants by axis values, never by the suffix.

## 3. Variant Property Matrix

```
LabelPlacement × Color × Checked × Size × State
Theoretical: 4 × 7 × 2 × 3 × 2  =  336 variants
Published  : 192 variants (sparse — see exclusions)
```

Per `LabelPlacement`:

- **Enabled** — `Color × Size × Checked`. `Color (7) × Size (3) × Checked (2) = 42 cells`.
- **Disabled** — limited to `Color=Default × Size × Checked`. `1 × 3 × 2 = 6 cells`.

`42 + 6 = 48 cells` per `LabelPlacement` × 4 placements = **192 cells** total.

| Property         | Default value | Options                                                                  |
| ---------------- | ------------- | ------------------------------------------------------------------------ |
| `LabelPlacement` | `End`         | `End`, `Start`, `Top`, `Bottom`                                          |
| `Color`          | `Primary`     | `Default`, `Primary`, `Secondary`, `Error`, `Warning`, `Info`, `Success` |
| `Checked`        | `False`       | `False`, `True`                                                          |
| `Size`           | `Medium`      | `Small`, `Medium`, `Large`                                               |
| `State`          | `Enabled`     | `Enabled`, `Disabled`                                                     |

Published-set exclusions (intentional):

- **`State=Disabled` is published only with `Color=Default`.** Disabled is color-agnostic in MUI; designers should pick `Color=Default, State=Disabled` regardless of the surrounding flow's brand color.
- **`State ∈ {Hovered, Focused, Pressed}` is not published in `<RadioFormControl>`.** Use the bare `<Radio>` set + a manually composed label until those variants land here.

### 3.1 Component (non-variant) properties

`<RadioFormControl>` exposes a structural `Slot` that holds the nested `<Radio>` composition; it is not designer-facing. The label text is overridden by editing the wrapper's Text node `characters` directly. If repeated overrides become noisy, promote `Text.characters` to a top-level `TEXT` component property in a follow-up.

## 4. Design Tokens

All paints, strokes, and surfaces bind to local variables in the MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`). The component is **self-contained** — every binding resolves to a variable in this file's local collection. Mirror of `<CheckboxFormControl>` token strategy.

### 4.1 Layout

| Property                              | LabelPlacement=End  | LabelPlacement=Start  | LabelPlacement=Top   | LabelPlacement=Bottom |
| ------------------------------------- | ------------------- | --------------------- | -------------------- | --------------------- |
| Auto-layout direction                 | Horizontal (row)    | Horizontal-reverse    | Vertical-reverse     | Vertical              |
| Cross-axis alignment                  | `Center`            | `Center`              | `Center`             | `Center`              |
| Item spacing (`itemSpacing`)          | `4 px`              | `4 px`                | `4 px`               | `4 px`                |
| Outer left/right margin (Figma cell)  | `0 px` (no extra)   | `0 px`                | `0 px`               | `0 px`                |

> **MUI runtime uses `-11 / 16 px` outer margins, not auto-layout `gap`.** See `storybook.render.md` §1 — MUI relies on the inner Radio's `9 px` padding to space the indicator from the label and applies `-11 px / 16 px` outer margins on the wrapper. The Figma cells normalise this to a real auto-layout `itemSpacing` (`4 px`, matching the project's `gap-1`) and drop the outer margins; consumers who need the runtime offsets should add them at the surrounding layout. Drift in §7 issue 1.

### 4.2 Token bindings

| Role                              | Token                                                  | Notes                                                                          |
| --------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Label text — Enabled              | **`alias/colors/text-default`** _(`#000000 0.87α`)_    | MUI `palette.text.primary`. Color-agnostic — every Color value paints the same label color. |
| Label text — Disabled             | **`alias/colors/text-disabled`** _(`#000000 0.38α`)_   | MUI `palette.text.disabled`. The Figma set binds the disabled tone via a token swap, **not** via `paint.opacity = 0.38` on a `text-default` paint (that would flatten on instance creation). |
| Inner `<Radio>` glyph             | _(inherits from nested instance)_                      | See [`../Radio/figma.spec.md`](../Radio/figma.spec.md) §4.2.                    |
| Inner `<Radio>` halo              | _(not painted — wrapper publishes Enabled / Disabled only)_ | Drop a bare `<Radio>` for Hovered / Focused / Pressed.                    |
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

### 4.4 Nested `<Radio>` token bindings

The nested instance carries its own bindings (see `../Radio/figma.spec.md` §4). Each `<RadioFormControl>` variant pre-sets the nested instance to the matching `Color / Size / Checked / State` so the indicator's tokens resolve correctly without manual override.

## 5. Icons

`<RadioFormControl>` does not consume icons directly — the indicator glyphs come from the nested `<Radio>` instance. See [`../Radio/figma.spec.md`](../Radio/figma.spec.md) §5.

## 6. Layout

The Component Set is laid out as a **4-column × multi-row grid** inside its outer frame (id assigned at step-5 publish; placed adjacent to `<Radio>` (`286:5441`) on the same page):

- **Columns** (left → right) — `LabelPlacement`: End, Start, Top, Bottom.
- **Rows** (top → bottom) — `Color × Size × Checked`:
  - For each Color (Default → Primary → Secondary → Error → Warning → Info → Success):
    - Small × (F, T)
    - Medium × (F, T)
    - Large × (F, T)
  - Disabled rows: Color=Default × Size × (F, T).

Cell composition:

- `Wrapper` (FRAME, auto-layout) — direction per `LabelPlacement`, `itemSpacing 4 px`, cross-axis `Center`.
  - `Radio` (INSTANCE of `<Radio>`) — axes mirrored from the wrapping variant.
  - `Label` (TEXT) — `body1` text style, fill bound per §4.2.

Surrounding documentation in the outer frame:

- **Header** — title `<RadioFormControl>`, source story path, behavior summary.
- **Sibling sets** — `<Radio>` sits above on the same page; `<RadioGroup>` sits below.

## 7. Usage Guidelines

### 7.1 Picking a variant

1. Pick `LabelPlacement` to match the source `labelPlacement` prop — `End` for the most common left-to-right form layout.
2. Map the runtime `value` and `color` / `size` / `disabled` per `../Radio/figma.spec.md` §7.1 — the inner instance follows the wrapper.
3. Override the **Text** node's characters for the label content.
4. **Do not override** the nested `<Radio>` instance manually — picking the right wrapper variant cascades the axes.

### 7.2 Don'ts

- ❌ Don't detach `<RadioFormControl>` to swap the indicator — pick the right outer variant.
- ❌ Don't manually override the nested `<Radio>`'s variant axes. The wrapper already mirrors them; manual overrides produce inconsistencies between the wrapper variant name and the visible indicator.
- ❌ Don't paste a hex value for the label color — bind to `alias/colors/text-default` (Enabled) or `alias/colors/text-disabled` (Disabled).
- ❌ Don't apply `paint.opacity < 1` on a `text-default` paint to fake the disabled tone — Figma flattens to `opacity = 1` on instance creation. Bind the token directly.
- ❌ Don't model multi-radio groups as `<RadioFormControl>` variants. Use `<RadioGroup>` for the composed group; `<RadioFormControl>` is the per-row primitive.
- ❌ Don't combine `Color ≠ Default` with `State=Disabled`. Pick `Color=Default, State=Disabled`.

### 7.3 Open issues (drift)

Tracked here so the next runtime-truth pass has a punch list (mirror of `<CheckboxFormControl>` drift list):

1. **Wrapper outer margins.** MUI runtime applies `-11 px / 16 px` outer margins on `FormControlLabel`; the Figma cells use auto-layout `itemSpacing 4 px` instead. Visual delta is small (~5 px tighter than runtime). Resolve by either (a) accepting the simplified Figma layout and documenting the offset on the consumer side, or (b) adding the runtime margins as a wrapper-frame `padding` value.
2. **Letter-spacing differs.** MUI runtime applies `0.15 px` (`0.00938em × 16 px`); the Figma `body1` text style ships with `letterSpacing: 0%`. Resolve by repointing the Figma `body1` text style to `0.94 %` or by minting a `material-design/typography/body1-mui` companion.
3. **Font family differs.** Figma's `body1` text style uses `Noto Sans TC Regular`; MUI runtime renders `Roboto`. Accepted-as-is — locale-driven defaults; the visual height / spacing is identical.
4. **`Size=Large` falls back to Medium at runtime.** Inherited from `../Radio/figma.spec.md` §7 issue 1 — do not duplicate the resolution here.
5. **`Hovered / Focused / Pressed` are not published in this set.** Drop a bare `<Radio>` and compose the label manually until those variants are added.

## 8. Source Sync Rule

This document and the source must move together. When **any** of the following changes:

1. `src/stories/RadioFormControl.stories.tsx` (variants, args, `labelPlacement` / `disabled` wiring)
2. The Figma `<RadioFormControl>` component set (variants, properties, token bindings)
3. The Figma `<Radio>` component set inside `286:5441` — any change to its variant matrix or naming forces the nested instance mirroring contract to be re-validated, and the published axis options here may need to follow
4. `src/stories/Radio.stories.tsx` — any new state / size / color introduced upstream forces a follow-up here
5. The shared `merak/alias/colors/{text-default,text-disabled}` tokens — these are the wrapper's only direct dependencies
6. `material-design/typography/body1` text style — typography changes flow into §4.3 / §7 drift
7. `.storybook/preview.tsx` (theme overrides via `createTheme`) — today this is an empty `createTheme()`; introducing typography / palette / `MuiFormControlLabel.defaultProps` overrides forces a re-measure
8. `package.json` `@mui/material` peer / dev version (currently `^7.3.10` / peer `>=7`)

…this spec **must be updated in the same change**. Specifically:

- Adding `Hovered` / `Focused` / `Pressed` cells here → expand §3 exclusions list, add §4.X halo bindings (mirror the `../Radio/figma.spec.md` §4.2 rows), regenerate the published variants.
- Promoting label text to a `TEXT` component property → update §3.1 and §7.1.
- Replacing the auto-layout `itemSpacing 4 px` with runtime-faithful `-11 / 16 px` margins → update §4.1 / §7 issue 1.
- Token rename / removal in `merak/alias/colors/*` → update every reference in §4.2 and rename the matching variable in the local Figma collection.
- `@mui/material` major bump → re-run `storybook.render.md` measurements; bump the version row in §1; reconcile any new computed-style values against §4.

## 9. Quick Reference

```ts
// Source surface (composing @mui/material's FormControlLabel + Radio)
type RadioFormControlProps = {
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';      // → Figma `LabelPlacement`
  label: React.ReactNode;                                    // → Figma `Label` text override
  disabled?: boolean;                                        // → Figma `State=Disabled`
  // The `control` slot carries a `<Radio>` whose props mirror Figma axes:
  control: React.ReactElement<RadioProps>;                   // → nested `<Radio>` instance
};
```

```
Figma Component Set: <RadioFormControl>  (id assigned at step-5 publish)
  Variant axes : LabelPlacement × Color × Checked × Size × State
  Properties   : (none designer-facing — Label is a Text node override)
  Default      : LabelPlacement=End, Color=Primary, Checked=False,
                 Size=Medium, State=Enabled
  Total        : 192 published variants
                 (per LabelPlacement: 42 Enabled + 6 Disabled = 48; × 4 = 192)
  Sparse       : Disabled limited to Color=Default;
                 Hovered/Focused/Pressed not published
  Nested       : <Radio> instance — axes mirror the outer variant automatically
  Override     : Text node `characters` for the label text
```

## 10. Token Glossary

The complete set of tokens consumed by `<RadioFormControl>` directly. Names are **Figma variable paths**; the nested `<Radio>` carries its own catalogue (see [`../Radio/figma.spec.md`](../Radio/figma.spec.md) §10).

### 10.1 Alias tokens (`merak/alias/colors/*`)

| Token                          | Used by                  | Role                                                      |
| ------------------------------ | ------------------------ | --------------------------------------------------------- |
| `alias/colors/text-default`    | Label text on Enabled    | MUI `palette.text.primary` (`#000000 0.87α`).             |
| `alias/colors/text-disabled`   | Label text on Disabled   | MUI `palette.text.disabled` (`#000000 0.38α`).            |

### 10.2 Component-scoped tokens

`<RadioFormControl>` does **not** mint any component-scoped tokens. If a future divergence requires one (e.g. a per-placement gap that differs from `gap-1`), mint it as a `component/radio-form-control/*` local in the MUI-Library file and document it in `design-token.md`.

### 10.3 Typography

| Style                         | Used by    |
| ----------------------------- | ---------- |
| `material-design/typography/body1` | Label text |

### 10.4 Inner `<Radio>` tokens

See [`../Radio/figma.spec.md`](../Radio/figma.spec.md) §10 for the indicator's full catalogue (`seed/<color>/{main, hover-bg, outline-hover, focusVisible}`, `alias/colors/{bg-active, text-disabled, bg-outline-hover}`, `seed/neutral/focusVisible`).

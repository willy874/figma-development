---
name: figma-component-checkbox-form-control
description: Figma component specification for `<CheckboxFormControl>` — the design counterpart of the composed `<Checkbox>` rendering in `apps/console/src/components/Checkbox/Checkbox.tsx` (Indicator + Label + Text). Wraps a `<Checkbox>` instance and a sibling Text label in auto-layout. Documents the LabelPlacement × Checked × Indeterminate × Color × Size × State variant matrix, the nested-instance mirroring contract, design tokens, and source-to-Figma mapping rules.
parent_skill: figma-components
---

# `<CheckboxFormControl>` Figma Component Specification

## 1. Overview

`<CheckboxFormControl>` is the Figma counterpart of the composed rendering produced by the default `Checkbox` export in `apps/console/src/components/Checkbox/Checkbox.tsx`:

```tsx
<Checkbox.Root>
  <Checkbox.Label inline={inline} className={...labelPlacementFlex}>
    <Checkbox.Indicator />
    <Checkbox.Text>{children}</Checkbox.Text>
  </Checkbox.Label>
</Checkbox.Root>
```

The Figma component wraps:

- one **`<Checkbox>` instance** (the indicator — see `Checkbox.md`)
- one sibling **Text** node (the label, bound to `alias/colors/text-default`)

inside an auto-layout frame whose direction encodes `labelPlacement`. There is no separate React `<CheckboxFormControl>` component — the source `Checkbox` itself plays this role; the Figma split exists only because the indicator-only `<Checkbox>` set is reusable for ad-hoc compositions (e.g., table cells).

The set ships the full `LabelPlacement × Checked × Indeterminate × Color × Size × State` matrix and mirrors each axis onto the nested `<Checkbox>` instance automatically — designers do **not** need to override the inner instance to retint or resize. State is limited to `Enabled` and `Disabled`; `Hovered` / `Focused` / `Pressed` are reachable on the inner `<Checkbox>` set but are not republished here.

| Aspect                    | Value                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Source files              | `apps/console/src/components/Checkbox/Checkbox.tsx` (the `Checkbox` default export)                                    |
| Figma frame               | Inside the `Checkbox` frame, below the `<Checkbox>` set                                                                |
| Component Set             | `<CheckboxFormControl>` — node `1:7367`                                                                                |
| Total published variants  | **276** (see §3 — sparse exclusions: `Indeterminate=True` paired only with `Checked=False`; `State=Disabled` limited to `Color=Default`; `Indeterminate=True, State=Disabled` not published) |
| Nested component          | `<Checkbox>` (indicator) — instance, axes mirror the outer set                                                         |
| Typography (label)        | `Roboto Regular`, `16 / 24 px`, letter-spacing `0.15 px` (no text-transform)                                           |

## 2. Source-to-Figma Property Mapping

| Source prop                                             | Figma property            | Type    | Notes                                                                                                                                                                                              |
| ------------------------------------------------------- | ------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `labelPlacement: 'start' \| 'end' \| 'top' \| 'bottom'` | `LabelPlacement`          | VARIANT | `End` (default) / `Start` / `Top` / `Bottom`. Controls auto-layout direction (`row` / `row-reverse` / `column-reverse` / `column`).                                                                |
| `value: boolean \| 'indeterminate'` _(true)_            | `Checked`                 | VARIANT | `true` → `Checked=True, Indeterminate=False`. Mirrored onto the nested `<Checkbox>` instance.                                                                                                      |
| `value: boolean \| 'indeterminate'` _(false)_           | `Checked` + `Indeterminate` | VARIANT | `false` → `Checked=False, Indeterminate=False`. Mirrored onto the nested `<Checkbox>` instance.                                                                                                  |
| `value: boolean \| 'indeterminate'` _('indeter…')_      | `Indeterminate`           | VARIANT | `'indeterminate'` → `Indeterminate=True, Checked=False`. Mirrored onto the nested `<Checkbox>` instance.                                                                                           |
| _(future `color` prop)_                                 | `Color`                   | VARIANT | `Default` / `Primary` / `Secondary` / `Error` / `Warning` / `Info` / `Success`. Source today hard-codes Primary; non-default values still signal a request for a `color` prop — see `Checkbox.md` §8. Mirrored onto the nested `<Checkbox>`. |
| _(future `size` prop)_                                  | `Size`                    | VARIANT | `Small` (15 px) / `Medium` (18 px) / `Large` (21 px) — measured by indicator box edge. Mirrored onto the nested `<Checkbox>`.                                                                      |
| _(future `disabled` prop)_                              | `State`                   | VARIANT | `Enabled` / `Disabled`. Disabled is published only with `Color=Default` (see §3). Mirrored onto the nested `<Checkbox>`.                                                                            |
| `children: React.ReactNode`                             | `Text` node text override | —       | Override the nested `Text` node's characters. Default: `"Label"`.                                                                                                                                  |
| `inline?: boolean`                                      | _(designer-composed)_     | —       | Layout-only. Source uses `inline-flex` when `true`, `flex` otherwise. Switch the parent auto-layout if needed.                                                                                     |
| `onValueChange`                                         | —                         | —       | Behavior-only.                                                                                                                                                                                     |
| `className`                                             | —                         | —       | Not represented in Figma.                                                                                                                                                                          |

Each variant carries a nested `<Checkbox>` instance whose axes are pre-set to match the wrapping variant. Designers should **not** manually override the nested instance — pick the `<CheckboxFormControl>` variant directly and the indicator follows.

## 3. Variant Property Matrix

```
Axes      : LabelPlacement × Checked × Indeterminate × Color × Size × State
Full grid : 4 × 2 × 2 × 7 × 3 × 2 = 672 variants (theoretical)
Published : 276 variants (sparse — see exclusions)
```

| Property         | Default value | Options                                                                  |
| ---------------- | ------------- | ------------------------------------------------------------------------ |
| `LabelPlacement` | `End`         | `End`, `Start`, `Top`, `Bottom`                                          |
| `Checked`        | `False`       | `False`, `True`                                                          |
| `Indeterminate`  | `False`       | `False`, `True`                                                          |
| `Color`          | `Primary`     | `Default`, `Primary`, `Secondary`, `Error`, `Warning`, `Info`, `Success` |
| `Size`           | `Medium`      | `Small` (15 px), `Medium` (18 px), `Large` (21 px)                       |
| `State`          | `Enabled`     | `Enabled`, `Disabled`                                                     |

Per `LabelPlacement` value the published cells are:

- **Enabled** — `Color × Size × (Checked, Indeterminate)` minus the `Checked=True, Indeterminate=True` combo. `7 × 3 × 3 = 63` cells.
- **Disabled** — limited to `Color=Default × Size × (Checked, Indeterminate)` and excludes `Indeterminate=True`. `1 × 3 × 2 = 6` cells.

`63 + 6 = 69` cells per `LabelPlacement`, × `4` placements = **276 published variants**.

Published-set exclusions (intentional — keep them in mind when picking instances):

- `Indeterminate=True` is published only with `Checked=False`. The check + dash visual is never both — the source forces `checked=false` whenever `value === 'indeterminate'`.
- `State=Disabled` is published only with `Color=Default`. Disabled is color-agnostic in the source (`alias/colors/text-disabled`), so designers should always pick `Color=Default, State=Disabled` regardless of the surrounding flow's brand color.
- `Indeterminate=True, State=Disabled` is **not** published. If a feature needs it, request the variant via `Checkbox.md` §8 first; the wrapper here will follow.
- `State ∈ {Hovered, Focused, Pressed}` — **not** published in `<CheckboxFormControl>`. The inner `<Checkbox>` set publishes them; if a flow needs an interaction-state checkbox label, drop a bare `<Checkbox>` and compose the label manually until those variants are added here.

### 3.1 Component (non-variant) properties

`<CheckboxFormControl>` exposes a `Slot` (`Slot#3161:5`, type `SLOT`) that holds the nested `<DirectionFormControl>` / `<Checkbox>` composition; the slot is a structural detail and is not designer-facing. There is no `TEXT` component property for the label — the label text is overridden by editing the nested `Text` node directly. If repeated overrides become noisy, promote `Text.characters` to a top-level `TEXT` property in a follow-up.

> Figma property ids (the `#1234:5` suffix) are assigned by the editor and are not guaranteed stable across re-publishes — always reference variants by axis values, never by raw property ids.

## 4. Design Tokens

### 4.1 Layout

| Property            | Value                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Auto-layout gap     | `4 px` (matches `gap-1` in source)                                                          |
| Cross-axis align    | `Center` (mirrors `items-center` in `Checkbox.Label`)                                       |
| Padding             | `0 px` on every side — the indicator's hit-target frame already absorbs spacing             |
| Direction (`End`)   | Horizontal (indicator → text)                                                               |
| Direction (`Start`) | Horizontal-reverse (text → indicator)                                                       |
| Direction (`Top`)   | Vertical-reverse (text above indicator)                                                     |
| Direction (`Bottom`)| Vertical (indicator above text)                                                             |

### 4.2 Typography

Label text:

- Font family `Roboto, Helvetica, Arial, sans-serif`
- Weight `Regular (400)`
- Size / line-height `16 / 24 px`
- Letter-spacing `0.15 px`
- No text-transform
- Color bound to `alias/colors/text-default`

These match `MerakTypographyByThemeColors.body1` defaults — same as `<Checkbox.Text>` in source.

### 4.3 Nested `<Checkbox>` token bindings

The nested instance carries its own bindings (see `Checkbox.md` §4). Each `<CheckboxFormControl>` variant pre-sets the nested instance to the matching `Checked / Indeterminate / Color / Size / State` so the indicator's tokens resolve correctly without manual override.

## 5. Usage Guidelines

### 5.1 Picking a variant

1. Pick `LabelPlacement` to match the source `labelPlacement` prop — `End` for the most common left-to-right form layout.
2. Map the runtime `value`:
   - `value === true` → `Checked=True, Indeterminate=False`
   - `value === false` → `Checked=False, Indeterminate=False`
   - `value === 'indeterminate'` → `Checked=False, Indeterminate=True`
3. Pick `Color`. Today the source only renders `Primary` — choosing any other option signals a request for the source change tracked in `Checkbox.md` §8. Use `Default` for a neutral/grey checkbox (e.g., disabled flows, list selectors with no brand emphasis).
4. Pick `Size=Medium` to match the source's `1.5rem` indicator. Small / Large are reference-only until a `size` prop ships.
5. Use `State=Enabled` for production screens. Use `State=Disabled, Color=Default` when the runtime renders `disabled` (Disabled is color-agnostic in the source). `Hovered` / `Focused` / `Pressed` are not published here — drop a bare `<Checkbox>` and compose the label manually if you need them.
6. Override the **Text** node's characters for the label content.

### 5.2 Don'ts

- ❌ Don't detach `<CheckboxFormControl>` to swap to a custom indicator — pick the right outer variant; the nested `<Checkbox>` follows automatically.
- ❌ Don't manually override the nested `<Checkbox>`'s variant axes. The wrapper already mirrors them; manual overrides produce inconsistencies between the wrapper variant name and the visible indicator.
- ❌ Don't paste a hex value for the label color — bind to `alias/colors/text-default`.
- ❌ Don't model multi-checkbox groups as `<CheckboxFormControl>` variants. Use multiple instances inside an auto-layout (see `<CheckboxGroup>` in `Checkbox.md` §2.2).
- ❌ Don't pair `Checked=True` with `Indeterminate=True`. The source forces `checked=false` whenever `value === 'indeterminate'`; this combo is **not** published.
- ❌ Don't combine `Color ≠ Default` with `State=Disabled`. Disabled is color-agnostic in the source — pick `Color=Default, State=Disabled`.

## 6. Source Sync Rule

This document and the source must move together (per the project's **Features Sync Rule** spirit). When **any** of the following changes:

1. `apps/console/src/components/Checkbox/Checkbox.tsx` (the default `Checkbox` export's compose order, `labelPlacement` mapping, gap, label text styling)
2. The Figma `<CheckboxFormControl>` component set (variants, properties, token bindings)
3. The Figma `<Checkbox>` component set — any change to its variant matrix or naming forces the nested instance mirroring contract to be re-validated, and the published axis options here may need to follow
4. `apps/console/src/themes/alias.css` — the `text-default` token consumed by the label
5. The `<CheckboxText>` / `<CheckboxLabel>` styling in `Checkbox.tsx` — if these diverge from `body1` defaults (e.g., gain a typography token), bind the new token here

…this spec **must be updated in the same change**. Specifically:

- Adding a `size` prop in `Checkbox.tsx` → drop the "_future `size` prop_" tag in §2 and re-validate the Size axis cell coverage here.
- Adding a `color` prop in `Checkbox.tsx` → drop the "_future `color` prop_" tag in §2 and reconcile the Color axis with `Checkbox.md` §2.1.1.
- Adding a `disabled` prop or interaction-state styling → drop the "_future `disabled` prop_" tag and consider publishing `Hovered` / `Focused` / `Pressed` cells here once the inner `<Checkbox>` set ships them (currently excluded — see §3).
- Promoting label text to a `TEXT` component property → update §3.1 and §5.1.
- Replacing `gap-1` (4 px) in `Checkbox.tsx` → update §4.1.
- Adding `Indeterminate=True, State=Disabled` cells (currently not published in either set) → expand §3 exclusions list once `Checkbox.md` adds them.

## 7. Quick Reference

```
Figma Component Set: <CheckboxFormControl> (1:7367)
  Variant axes : LabelPlacement × Checked × Indeterminate × Color × Size × State
  Default      : LabelPlacement=End, Checked=False, Indeterminate=False, Color=Primary, Size=Medium, State=Enabled
  Total        : 276 published variants
                  (per LabelPlacement: 63 Enabled + 6 Disabled = 69; × 4 = 276)
  Sparse       : Checked=True+Indeterminate=True excluded; Disabled limited to Color=Default;
                 Indeterminate=True+Disabled not published; Hovered/Focused/Pressed not published
  Nested       : <Checkbox> instance — axes mirror the outer variant automatically; do not override manually
  Override     : Text node `characters` for the label text
```

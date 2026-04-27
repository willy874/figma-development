---
name: figma-component-checkbox-form-control
description: Figma component specification for `<CheckboxFormControl>` — the design counterpart of the composed `<Checkbox>` rendering in `apps/console/src/components/Checkbox/Checkbox.tsx` (Indicator + Label + Text). Wraps a `<Checkbox>` instance and a sibling Text label in auto-layout. Documents the `LabelPlacement` axis, the nested-instance override surface, design tokens, and source-to-Figma mapping rules.
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

| Aspect                    | Value                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Source files              | `apps/console/src/components/Checkbox/Checkbox.tsx` (the `Checkbox` default export)                                    |
| Figma frame               | Inside the `Checkbox` frame, below the `<Checkbox>` set                                                                |
| Component Set             | `<CheckboxFormControl>` (single set, 4 variants — one per `LabelPlacement` value)                                      |
| Total published variants  | **4**                                                                                                                  |
| Nested component          | `<Checkbox>` (indicator) — instance, fully overridable                                                                 |
| Typography (label)        | `Roboto Regular`, `16 / 24 px`, letter-spacing `0.15 px` (no text-transform)                                           |

## 2. Source-to-Figma Property Mapping

| Source prop                                             | Figma property            | Type    | Notes                                                                                                            |
| ------------------------------------------------------- | ------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `labelPlacement: 'start' \| 'end' \| 'top' \| 'bottom'` | `LabelPlacement`          | VARIANT | `End` (default) / `Start` / `Top` / `Bottom`. Controls auto-layout direction (`row` / `row-reverse` / `column-reverse` / `column`). |
| `children: React.ReactNode`                             | `Text` node text override | —       | Override the nested `Text` node's characters. Default: `"Label"`.                                                 |
| `value: boolean \| 'indeterminate'`                     | nested `<Checkbox>` axes  | —       | Override the nested `<Checkbox>` instance's `Checked` / `Indeterminate` axes — see `Checkbox.md` §2.1.            |
| _(future `color` prop)_                                 | nested `<Checkbox>` axis  | —       | Override the nested instance's `Color` axis.                                                                      |
| _(future `disabled` prop)_                              | nested `<Checkbox>` axis  | —       | Override the nested instance's `State=Disabled`.                                                                  |
| `inline?: boolean`                                      | _(designer-composed)_     | —       | Layout-only. Source uses `inline-flex` when `true`, `flex` otherwise. Switch the parent auto-layout if needed.    |
| `onValueChange`                                         | —                         | —       | Behavior-only.                                                                                                    |
| `className`                                             | —                         | —       | Not represented in Figma.                                                                                         |

## 3. Variant Property Matrix

```
Axes      : LabelPlacement
Published : 4 variants
```

| Property         | Default value | Options                              |
| ---------------- | ------------- | ------------------------------------ |
| `LabelPlacement` | `End`         | `End`, `Start`, `Top`, `Bottom`      |

The other axes that exist in `<Checkbox>` (Checked × Indeterminate × Color × State) are reached through the **nested instance**, not via duplicated `<CheckboxFormControl>` variants — keep this set narrow to avoid a 4 × 23 explosion.

### 3.1 Component (non-variant) properties

`<CheckboxFormControl>` does not yet expose a `TEXT` component property for the label. The label is overridden by editing the nested `Text` node directly. If repeated overrides become noisy, promote `Text.characters` to a top-level `TEXT` property in a follow-up.

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

The nested instance carries its own bindings (see `Checkbox.md` §4). Overriding the `Color` / `Checked` / `State` axes is enough to retint without detaching.

## 5. Usage Guidelines

### 5.1 Picking a variant

1. Pick `LabelPlacement` to match the source `labelPlacement` prop — `End` for the most common left-to-right form layout.
2. Override the **nested `<Checkbox>` instance**:
   - `Checked` / `Indeterminate` to match runtime `value`
   - `Color` for non-`Primary` checkboxes (still a future-source change — see `Checkbox.md` §8)
   - `State=Disabled, Color=Default` when the field is disabled
3. Override the **Text** node's characters for the label content.

### 5.2 Don'ts

- ❌ Don't detach `<CheckboxFormControl>` to swap to a custom indicator — override the nested `<Checkbox>` instance instead.
- ❌ Don't paste a hex value for the label color — bind to `alias/colors/text-default`.
- ❌ Don't model multi-checkbox groups as `<CheckboxFormControl>` variants. Use multiple instances inside an auto-layout (see `<CheckboxGroup>` in `Checkbox.md` §2.2).
- ❌ Don't expand the variant axes here to include `Checked` / `Color` / `State`. That's a 4 × 23 = 92-variant explosion that the nested instance already covers.

## 6. Source Sync Rule

This document and the source must move together (per the project's **Features Sync Rule** spirit). When **any** of the following changes:

1. `apps/console/src/components/Checkbox/Checkbox.tsx` (the default `Checkbox` export's compose order, `labelPlacement` mapping, gap, label text styling)
2. The Figma `<CheckboxFormControl>` component set (variants, properties, token bindings)
3. The Figma `<Checkbox>` component set — any change to its variant matrix or naming forces the nested instance overrides to be re-validated
4. `apps/console/src/themes/alias.css` — the `text-default` token consumed by the label
5. The `<CheckboxText>` / `<CheckboxLabel>` styling in `Checkbox.tsx` — if these diverge from `body1` defaults (e.g., gain a typography token), bind the new token here

…this spec **must be updated in the same change**. Specifically:

- Adding a `size` axis to `<Checkbox>` → consider whether `<CheckboxFormControl>` should mirror it or stay narrow (a `Size` axis would also affect the label's font size, making the "narrow set + nested override" pattern leaky).
- Promoting label text to a TEXT component property → update §3.1 and §5.1.
- Replacing `gap-1` (4 px) in `Checkbox.tsx` → update §4.1.

## 7. Quick Reference

```
Figma Component Set: <CheckboxFormControl>
  Variant axes : LabelPlacement
  Default      : LabelPlacement=End
  Total        : 4 published variants
  Nested       : <Checkbox> instance (override its variants for state)
  Override     : Text node `characters` for the label text
```

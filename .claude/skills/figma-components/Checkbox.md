---
name: figma-component-checkbox
description: Figma component specification for `<Checkbox>` and `<CheckboxGroup>` — the design counterparts of `apps/console/src/components/Checkbox/Checkbox.tsx` and `apps/console/src/components/Checkbox/CheckboxGroup.tsx`. Documents the variant matrix (Checked × Indeterminate × Size × Color × State), the source compound-component slot surface (`Checkbox.Root` / `Checkbox.Label` / `Checkbox.Indicator` / `Checkbox.Text`), design tokens, the indicator glyph, and source-to-Figma mapping rules — including the axes that the source wrapper does not yet expose.
parent_skill: figma-components
---

# `<Checkbox>` Figma Component Specification

## 1. Overview

`<Checkbox>` is the Figma counterpart of the `Checkbox` foundation component in `apps/console/src/components/Checkbox/Checkbox.tsx`. The source is a thin wrapper around `@base-ui/react`'s `Checkbox.Root` that:

- Models its value as `boolean | 'indeterminate'` rather than a plain checked boolean.
- Composes a `<label>` + indicator + text into a single `<Checkbox>` and also re-exports the parts as `Checkbox.Root` / `Checkbox.Label` / `Checkbox.Indicator` / `Checkbox.Text` for ad-hoc layouts.
- Hard-codes the visual treatment to a single styling: `seed/primary` filled when checked, `alias/bg-input` + `alias/border-default` when unchecked, with the check glyph in `alias/text-contrast-default`.
- Exposes `labelPlacement` (`start | end | top | bottom`) and an `inline` switch for label flow.

A sibling `<CheckboxGroup>` (`apps/console/src/components/Checkbox/CheckboxGroup.tsx`) renders an array of options as a flex-wrapping group with an optional group label and a `direction` (`row | column`) flow.

The Figma component encodes a **richer** surface than the React wrapper: it ships the full Color × Size × State × Checked × Indeterminate matrix that designers expect from an MUI-style checkbox, even though the source today only renders the `Primary` color at one size. Synthetic axes (Color, Size, State) are flagged in §2 as "not exposed by wrapper today" — using a non-default option in Figma is a request for a source change tracked through §8.

| Aspect                   | Value                                                                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source files             | `apps/console/src/components/Checkbox/Checkbox.tsx`, `apps/console/src/components/Checkbox/CheckboxGroup.tsx`                                                        |
| Figma frame              | `<Checkbox>`                                                                                                                                                          |
| Component Set            | `<Checkbox>` (single set; `<CheckboxGroup>` is layout-only and is not a published component set)                                                                     |
| Total published variants | **69** (see §3 — Color × Size × Checked × Indeterminate; Disabled limited to `Color=Default`; Indeterminate=True paired only with Checked=False; Hovered/Focused/Pressed not yet published) |
| Underlying runtime       | `@base-ui/react` Checkbox primitive                                                                                                                                  |
| Typography (label)       | `Roboto Regular`, `16 / 24 px`, letter-spacing `0.15 px` (no text-transform) — matches `MerakTypographyByThemeColors.body1` defaults                                 |

## 2. Source-to-Figma Property Mapping

`<Checkbox>` is a compound component: the root `Checkbox` renders `Label → Indicator + Text` and also re-exports each piece. The Figma set models the **indicator** (the `1.5rem` square box). Label / text / placement are layout that designers compose around the instance — the Figma node sits inside an outer auto-layout the designer builds, mirroring `Checkbox.Label` from the source.

### 2.1 `<Checkbox>` (`apps/console/src/components/Checkbox/Checkbox.tsx`)

| Source prop                                         | Figma property                | Type    | Notes                                                                                                                                                    |
| --------------------------------------------------- | ----------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value: boolean \| 'indeterminate'` _(true)_        | `Checked`                     | VARIANT | `true` → `Checked=True`. Use with `Indeterminate=False`.                                                                                                 |
| `value: boolean \| 'indeterminate'` _(false)_       | `Checked`                     | VARIANT | `false` → `Checked=False`, `Indeterminate=False`.                                                                                                        |
| `value: boolean \| 'indeterminate'` _('indeter…')_  | `Indeterminate`               | VARIANT | `'indeterminate'` → `Indeterminate=True`. The source forces `checked=false` underneath, so always pair with `Checked=False`.                             |
| _(not exposed by wrapper today)_ size               | `Size`                        | VARIANT | `Small` (15 px) / `Medium` (18 px) / `Large` (21 px) — measured by indicator box edge. The source hard-codes `1.5rem` (≈ Medium). Picking another value implies adding a `size` prop — see §8. |
| _(not exposed by wrapper today)_ color              | `Color`                       | VARIANT | `Default` / `Primary` / `Secondary` / `Error` / `Warning` / `Info` / `Success`. The source hard-codes Primary fill — use of any other option needs §8.   |
| _(not exposed by wrapper today)_ interaction state  | `State`                       | VARIANT | `Enabled` / `Hovered` / `Focused` / `Pressed` / `Disabled`. The source today renders Enabled; the others are reference-only until a `disabled` prop ships. |
| `children: React.ReactNode`                         | _(designer-composed)_         | —       | Rendered inside `Checkbox.Text`. Place the label as a sibling text node; not a property of the indicator instance.                                       |
| `labelPlacement: 'start' \| 'end' \| 'top' \| 'bottom'` | _(designer-composed)_     | —       | Designer controls by choosing the wrapping auto-layout direction (`row` / `row-reverse` / `column` / `column-reverse`).                                  |
| `inline?: boolean`                                  | _(designer-composed)_         | —       | Layout-only. The wrapping label uses `inline-flex` when `true`, `flex` otherwise.                                                                        |
| `onValueChange`                                     | —                             | —       | Behavior-only, no design representation.                                                                                                                 |

### 2.1.1 Color value mapping

The source today does not expose a color prop; the Figma `Color` axis pre-models what an MUI-aligned color prop **would** map onto. Token names below are **Figma variable paths** in the `merak` collection.

| `MerakColorTheme` (future source) | MUI palette equivalent | Figma token family                                                              | Figma `Color` value |
| --------------------------------- | ---------------------- | ------------------------------------------------------------------------------- | ------------------- |
| `default`                         | `default`              | `alias/colors/bg-active` _(border)_ / `alias/colors/text-disabled` _(unchecked fill ref)_ | **Default**         |
| `primary`                         | `primary`              | `seed/primary/*`                                                                | **Primary**         |
| _(no source key today)_           | `secondary`            | `seed/secondary/*`                                                              | **Secondary**       |
| `danger`                          | `error`                | `seed/danger/*`                                                                 | **Error**           |
| `warning`                         | `warning`              | `seed/warning/*`                                                                | **Warning**         |
| `info`                            | `info`                 | `seed/info/*`                                                                   | **Info**            |
| `success`                         | `success`              | `seed/success/*`                                                                | **Success**         |

> Figma uses the MUI palette name `Error` for the family Merak's tokens call `danger`, and ships a `Secondary` family (`seed/secondary/*`) that has no `MerakColorTheme` key today. When a `color` prop is added to `Checkbox.tsx`, route `MerakColorTheme.danger → Color=Error` and decide whether to introduce a `secondary` Merak key (most likely deferred — see §8).

### 2.2 `<CheckboxGroup>` (`apps/console/src/components/Checkbox/CheckboxGroup.tsx`)

`<CheckboxGroup>` does **not** ship as a Figma component set; it is a layout primitive that designers reproduce with auto-layout around multiple `<Checkbox>` instances. Mapping the source surface to the canvas:

| Source prop                                     | Figma representation                                                                                                            | Notes                                                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `label?: React.ReactNode`                       | A sibling text node above (column) or before (row) the auto-layout of options.                                                  | Token: `alias/colors/text-sub`, `Roboto Regular 16 / 24 px`, letter-spacing `0.15 px`.         |
| `direction: 'row' \| 'column'`                  | The wrapping auto-layout's `layoutMode` (`HORIZONTAL` / `VERTICAL`) and `wrap=true`.                                            | Default `column`. Item gap `8 px` (`gap-2` in source).                                         |
| `options[i].label` / `options[i].labelNode`     | Text / nodes placed next to each `<Checkbox>` instance.                                                                         | One `<Checkbox>` instance per option.                                                          |
| `labelPlacement`                                | Per-instance label flow — see `<Checkbox>` §2.1 row.                                                                            | All children share the same placement.                                                         |
| `value`, `defaultValue`, `onValueChange`        | —                                                                                                                               | Behavior-only.                                                                                 |

## 3. Variant Property Matrix

```
Axes      : Checked × Indeterminate × Size × Color × State
Full grid : 2 × 2 × 3 × 7 × 2   =   168 variants (theoretical)
Published :                                  69 variants (sparse — see exclusions)
```

| Property        | Default value | Options                                                                |
| --------------- | ------------- | ---------------------------------------------------------------------- |
| `Checked`       | `False`       | `False`, `True`                                                        |
| `Indeterminate` | `False`       | `False`, `True`                                                        |
| `Size`          | `Medium`      | `Small` (15 px), `Medium` (18 px), `Large` (21 px)                     |
| `Color`         | `Primary`     | `Default`, `Primary`, `Secondary`, `Error`, `Warning`, `Info`, `Success` |
| `State`         | `Enabled`     | `Enabled`, `Disabled`                                                   |

Published-set exclusions (intentional — keep them in mind when picking instances):

- `Indeterminate=True` is published only with `Checked=False`. The check + dash visual is never both — the source forces `checked=false` whenever `value === 'indeterminate'`.
- `State=Disabled` is published only with `Color=Default` (Checked ∈ {False, True}). Disabled is color-agnostic in the source (`alias/colors/text-disabled`), so designers should always pick `Color=Default, State=Disabled` regardless of the underlying brand color.
- `Indeterminate=True, State=Disabled` is **not** published. If a feature needs it, request the variant via §8.
- `Hovered` / `Focused` / `Pressed` states are **not** published — the source today has no halo / hover styling. Once an interaction-state pass lands, add these via §8.

### 3.1 Component (non-variant) properties

`<Checkbox>` does not expose any non-variant Figma properties. The check / dash glyph is part of the indicator and is not swappable; the label is a sibling text node owned by the designer's wrapping auto-layout (see §2.1). If a future revision adds an `INSTANCE_SWAP` slot for the glyph, document it here.

> Figma property ids (the `#1234:5` suffix) are assigned by the editor and are not guaranteed stable across re-publishes — always reference variants by axis values, never by raw property ids.

## 4. Design Tokens

All colors and surfaces are bound to Merak design tokens declared in:

- `apps/console/src/themes/seed.css` — `--merak-seed-{family}-{token}` (palette by color family)
- `apps/console/src/themes/alias.css` — `--merak-alias-{group}-{token}` (semantic, color-agnostic)
- `apps/console/src/themes/light.ts` / `dark.ts` — JS values that produce the CSS variables above
- `apps/console/src/themes/constants.tsx` — JS-side mapping (`CssVarByThemeColors`, `ClassNameByThemeColors`)
- `apps/console/src/themes/mui-theme.ts` — `theme.shape.borderRadius`, palette, typography

In Figma, every paint **must** be bound to a Variable that mirrors one of these tokens. Hex values are never pasted.

### 4.1 Sizing

Sizing is driven by the **internal check / dash icon vector** stored alongside the component set in the same Figma frame. The indicator box equals the icon edge: 15 / 18 / 21 px for Small / Medium / Large. The source today hard-codes `1.5rem` (≈ Medium). Picking Small / Large in a mockup is a request for a `size` prop in `Checkbox.tsx` (track via §8).

| Property         | Small               | Medium (source ≈ today) | Large               |
| ---------------- | ------------------- | ----------------------- | ------------------- |
| Indicator box    | `15 × 15 px`        | `18 × 18 px`            | `21 × 21 px`        |
| Hit-target frame | `33 × 33 px`        | `36 × 36 px`            | `39 × 39 px`        |
| Internal icon    | `15 px` (Checked / Indeterminate vector) | `18 px`     | `21 px`             |
| Border width     | `1 px` (unchecked Rectangle only)        | `1 px`      | `1 px`              |
| Corner radius    | `3 px`              | `4 px` (`theme.shape.borderRadius`) | `5 px`  |

- `Checked=True` and `Indeterminate=True, Checked=False` variants render the icon vector clone as the indicator (no separate Rectangle). The icon paths include the rounded-square outline; corner radius is baked into the geometry.
- `Checked=False, Indeterminate=False` variants use a Rectangle indicator with the `corner radius` above and a 1 px border bound to a token.
- Hit-target frame keeps `~9 px` padding around the indicator on every size.

### 4.2 Color token bindings (indicator)

For each `Color` axis value, the indicator's border / fill / glyph paints map to a Merak token family. Names below are Figma variable paths.

| Figma `Color` | Border (unchecked)                       | Fill (checked / indeterminate)         | Glyph (check / dash)                      | Hover halo _(4 % tint)_                  | Focus halo _(30 % tint)_              |
| ------------- | ---------------------------------------- | -------------------------------------- | ----------------------------------------- | ---------------------------------------- | ------------------------------------- |
| Default       | **`alias/colors/bg-active`**             | **`alias/colors/bg-active`**           | **`alias/colors/on-text-focus`**          | **`alias/colors/bg-outline-hover`**      | **`alias/colors/bg-outline-hover`**   |
| Primary       | **`alias/colors/bg-active`** _(unchecked)_ / **`seed/primary/main`** _(checked)_ | **`seed/primary/main`** | **`alias/colors/on-text-focus`** | **`seed/primary/hover-bg`**              | **`seed/primary/focusVisible`**       |
| Secondary     | **`alias/colors/bg-active`** / **`seed/secondary/main`**                          | **`seed/secondary/main`** | **`alias/colors/on-text-focus`** | **`seed/secondary/outline-hover`**       | **`seed/secondary/focusVisible`**     |
| Error         | **`alias/colors/bg-active`** / **`seed/danger/main`**                             | **`seed/danger/main`**    | **`alias/colors/on-text-focus`** | **`seed/danger/outline-hover`**          | **`seed/danger/focusVisible`**        |
| Warning       | **`alias/colors/bg-active`** / **`seed/warning/main`**                            | **`seed/warning/main`**   | **`alias/colors/on-text-focus`** | **`seed/warning/outline-hover`**         | **`seed/warning/focusVisible`**       |
| Info          | **`alias/colors/bg-active`** / **`seed/info/main`**                               | **`seed/info/main`**      | **`alias/colors/on-text-focus`** | **`seed/info/hover-bg`**                 | **`seed/info/focusVisible`**          |
| Success       | **`alias/colors/bg-active`** / **`seed/success/main`**                            | **`seed/success/main`**   | **`alias/colors/on-text-focus`** | **`seed/success/hover-bg`**              | **`seed/success/focusVisible`**       |

> The unchecked indicator's interior fill is `alias/colors/bg-input` (matches `var(--merak-alias-bg-input)` in the source). The Default color uses `alias/colors/bg-active` for the **border** and falls back to neutral for the focus halo (`alias/colors/bg-outline-hover` rather than a `seed/{color}/focusVisible`), since `Default` has no seed family of its own.
>
> Secondary, Error (Danger), and Warning use `outline-hover` (not `hover-bg`) for the 4 % tint — this matches how the `merak` collection names the token for those families. Primary, Info, and Success use `hover-bg`.
>
> The glyph token is `alias/colors/on-text-focus` (white at 100 % when on a colored fill); for the Default color it resolves identically since the fill is also a dark neutral.

### 4.3 State rules

Across all colors, paints stack as follows. `bg-input` is the unchecked interior. The "halo" is a same-size circle behind the indicator that absorbs hover / focus paint — bind it as a fill and let it inherit the `Color`-axis tint above.

| State        | Unchecked indicator                                                               | Checked indicator                                                                              | Indeterminate indicator                                              | Halo                                                      |
| ------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| **Enabled**  | border `bg-active` _(Default)_ / `seed/{color}/main` _(other)_ · fill `bg-input`  | border `seed/{color}/main` · fill `seed/{color}/main` · glyph `on-text-focus`                  | border + fill `seed/{color}/main` · dash glyph `on-text-focus`       | transparent                                               |
| **Hovered**  | unchanged from Enabled                                                            | unchanged from Enabled                                                                         | unchanged from Enabled                                               | `seed/{color}/hover-bg` _(or `outline-hover`)_            |
| **Focused**  | unchanged from Enabled                                                            | unchanged from Enabled                                                                         | unchanged from Enabled                                               | `seed/{color}/focusVisible`                               |
| **Pressed**  | unchanged from Enabled                                                            | unchanged from Enabled                                                                         | unchanged from Enabled                                               | `seed/{color}/hover-bg` _(or `outline-hover`)_ — same as Hovered |
| **Disabled** | border **`alias/colors/text-disabled`** · fill `bg-input`                         | border **`alias/colors/text-disabled`** · fill **`alias/colors/text-disabled`** · glyph `on-text-focus` | (not published — see §3 exclusions)                                  | transparent                                               |

Notes:

- **Pressed = Hovered** in this generation: the indicator paint does not change, only the halo opacity matches the same `hover-bg` / `outline-hover` token. Kept as a separate variant entry so a future tighter pressed binding (e.g., a darker `seed/{color}/hover`) can land without a variant explosion.
- **Disabled is color-agnostic.** The token `alias/colors/text-disabled` applies regardless of `Color`, which is why the published set covers Disabled only under `Color=Default`. Designers should pick `Color=Default, State=Disabled` even when the surrounding flow is, e.g., Error-themed.
- **Halo is Figma-only.** The source `Checkbox.tsx` does not yet render a hover / focus halo — the visual exists in Figma to pre-model an `:hover` / `:focus-visible` ring that will land alongside an interaction-state pass. Picking `State ∈ {Hovered, Focused, Pressed}` in a mockup signals that future work; flag in §8 when introduced.
- The check glyph (path `M9.16 1.12 …`) and the dash glyph (centered horizontal bar) are inlined SVGs in the source, not `<Icon>` instances — see §5.

## 5. Icons

`<Checkbox>` does **not** consume the shared `<Icon>` component set. The two indicator glyphs are inlined as SVG paths inside the indicator:

| Glyph     | Source                                                                                                                                                                                                                          | Rendered when                                                                              | Token (fill)                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------- |
| Check (✓) | Figma vector (filled rounded-square + check, single path) stored alongside the component set. Replaces the indicator rectangle entirely on `Checked=True` variants — fill is rebound per `Color` axis to `seed/{color}/main` (or `alias/colors/text-disabled` for State=Disabled). Source code still uses the inline `<svg viewBox="0 0 10 10">` `CheckboxIndicatorIcon` in `Checkbox.tsx`; the Figma side diverges to a single shape for visual fidelity. | `Checked=True, Indeterminate=False`                                                        | Per-`Color` brand fill (see §4.2)        |
| Dash (–)  | Figma vector (filled rounded-square + dash, single path) stored alongside the component set. Replaces the indicator entirely on `Indeterminate=True, Checked=False` variants — fill is rebound per `Color` axis to `seed/{color}/main`. Source code still uses `@base-ui/react`'s built-in indeterminate dash; the Figma side diverges to a single shape for visual fidelity. | `Indeterminate=True, Checked=False`                                                        | Per-`Color` brand fill (see §4.2)        |

- **No `INSTANCE_SWAP` slot** is exposed for the glyph — designers must not detach to swap to a custom mark. If a feature needs a different mark (e.g., partial-success ✓), extend `Checkbox.tsx` first and add a new `Indeterminate` axis option, not an inline override.
- **Visibility coupling**: `Checked=False, Indeterminate=False` hides both glyphs; `Checked=True` shows the check; `Indeterminate=True` shows the dash. The Figma variants pre-bake this — there is no separate `Glyph` BOOLEAN property.
- **Color**: the glyph fill is bound to `alias/colors/on-text-focus` so it renders white on every colored fill and stays legible in dark mode. Disabled state keeps the same glyph token over the disabled fill (`alias/colors/text-disabled`) — the contrast is sufficient because the fill also resolves to a neutral grey.

## 6. Layout

The Component Set is laid out as a flat grid inside the `<Checkbox>` frame. Cell size is the hit-target frame (§4.1): `42 × 42 px` with the indicator box centered inside.

- **Enabled rows** — Color × Checked/Indeterminate combo (`F/F`, `T/F`, `F/T`) for each of the seven Color values (`Default`, `Primary`, `Secondary`, `Error`, `Warning`, `Info`, `Success`).
- **Disabled row** — `Color=Default` only, Checked ∈ {False, True}.

Surrounding documentation in the outer frame:

- **Header** — title "`<Checkbox>`", source path, behavior summary.
- **Use Case** panel — curated examples: a `<CheckboxGroup>` with column flow + `label`, a row flow with `labelPlacement="end"`, indeterminate parent / determinate child pattern, disabled row.
- **Sibling sets** — none in the same frame; `<Radio>` and `<Switch>` live in their own frames on the same page.

Composing a `<Checkbox>` on a screen:

1. Drop a `<Checkbox>` instance (the indicator box) into an auto-layout frame with `direction = row | row-reverse | column | column-reverse` matching the desired `labelPlacement`.
2. Add a sibling text node bound to `alias/colors/text-default`, `Roboto Regular 16 / 24 px`, `letter-spacing 0.15 px` for the label.
3. Pick `Indeterminate=True, Checked=False` for the parent toggle in a tri-state group; pick `Checked=True, Indeterminate=False` for fully-checked children.
4. For `<CheckboxGroup>`: wrap N instances in a `flex-wrap` auto-layout with `gap 8 px` and an optional sibling label bound to `alias/colors/text-sub`.

## 7. Usage Guidelines

### 7.1 Picking a variant

1. Map the runtime value: `value === true` → `Checked=True, Indeterminate=False`; `value === false` → `Checked=False, Indeterminate=False`; `value === 'indeterminate'` → `Checked=False, Indeterminate=True`.
2. Pick `Color`. Today the source only renders `Primary` — choosing any other option signals a request for the source change tracked in §8. Use `Default` for a neutral/grey checkbox (e.g., disabled flows, list selectors with no brand emphasis).
3. Pick `Size=Medium` to match the source's `1.5rem` indicator. Small / Large are reference-only until a `size` prop ships.
4. Use `State=Enabled` for production screens. Use `Disabled` (`Color=Default`) when the runtime renders `disabled`. `Hovered` / `Focused` / `Pressed` are not published yet (see §3 / §8).
5. Compose the label and placement in your own auto-layout — there is no Figma `Label` text property on the indicator instance.

### 7.2 Tri-state semantics (recommended pairing)

| Intent                                       | `Checked` | `Indeterminate` | Notes                                                            |
| -------------------------------------------- | --------- | --------------- | ---------------------------------------------------------------- |
| Fully unchecked                              | `False`   | `False`         | Default state of a fresh checkbox.                               |
| Fully checked                                | `True`    | `False`         | All children selected.                                           |
| Mixed / partial selection (parent of group)  | `False`   | `True`          | Use the dash glyph to signal "some, not all" in a group.         |
| Disabled unchecked                           | `False`   | `False`         | + `State=Disabled, Color=Default`.                               |
| Disabled checked                             | `True`    | `False`         | + `State=Disabled, Color=Default`.                               |

### 7.3 Don'ts

- ❌ Don't pair `Checked=True` with `Indeterminate=True`. The source forces `checked=false` whenever `value === 'indeterminate'`; the published combo on the canvas is a doc artifact (§3) and will not match runtime.
- ❌ Don't detach the instance to recolor. Pick the matching `Color` axis value — and if the source doesn't expose that color yet, file a §8 change instead of customizing the instance.
- ❌ Don't draw a hand-rolled check or dash glyph. The variants already encode them; swapping to a custom mark requires extending `Checkbox.tsx` first.
- ❌ Don't combine `Color ≠ Default` with `State=Disabled`. Disabled is color-agnostic in the source — pick `Color=Default, State=Disabled`.
- ❌ Don't paste a hex value for the halo. Bind to `seed/{color}/hover-bg` (or `/outline-hover`) and `seed/{color}/focusVisible` so dark mode resolves correctly.
- ❌ Don't model `<CheckboxGroup>` as a single Figma component — it is layout. Reproduce it with auto-layout around N `<Checkbox>` instances.

## 8. Source Sync Rule

This document and the source must move together (per the project's **Features Sync Rule** spirit, applied here to design-system components):

When **any** of the following changes:

1. `apps/console/src/components/Checkbox/Checkbox.tsx` (props, indicator markup, default values, `labelPlacement` mapping, `Checkbox.Root` / `Checkbox.Label` / `Checkbox.Indicator` / `Checkbox.Text` surface)
2. `apps/console/src/components/Checkbox/CheckboxGroup.tsx` (options shape, `direction`, `labelPlacement`, group label tokens)
3. The Figma `<Checkbox>` component set (variants, properties, token bindings)
4. `apps/console/src/themes/constants.tsx` (`MerakThemeColors`, `MuiThemeByThemeColors`, `CssVarByThemeColors`, `ClassNameByThemeColors`)
5. `apps/console/src/themes/seed.css` / `alias.css` / `component.css` (CSS variable surface — note: `bg-active`, `bg-input`, `bg-outline-hover`, `text-default`, `text-sub`, `text-contrast-default`, `text-disabled`, `border-default`, `on-text-focus` are all consumed by Checkbox)
6. `apps/console/src/themes/light.ts` / `dark.ts` (alias token JS values feeding the CSS vars)
7. `apps/console/src/themes/mui-theme.ts` (`shape.borderRadius`, palette, typography overrides)
8. The `@base-ui/react` Checkbox primitive — major upgrades to `Checkbox.Root`, `Checkbox.Indicator`, or `indeterminate` semantics

…this spec **must be updated in the same change**. Specifically:

- New `color` prop on `Checkbox.tsx` → update §2.1 (drop the "_not exposed by wrapper today_" tag), update §2.1.1 with the `MerakColorTheme → Color` mapping, regenerate the `Color` axis in Figma if any value changed, and reconcile §4.2 / §10.1.
- New `size` prop → re-introduce a `Size` axis in §2.1 / §3, expand §4.1 with per-size rows, and re-publish the Figma component set.
- New `disabled` prop or interaction-state styling → flesh out the published Disabled / Hovered / Focused / Pressed cells in §3 (extend beyond `Color=Default` for Disabled; add hover / focus halo paints to the source rather than only Figma).
- Shifting the indicator glyph from inline SVG to an `<Icon>` instance → introduce an `INSTANCE_SWAP` slot in §3.1 and §5, and re-publish the variants.
- Renaming any consumed alias token (e.g., `bg-input` → `bg-form-input`) in `seed.css`/`alias.css` → update every reference in §4.2, §4.3, §5, §10. A token **value** change in `light.ts`/`dark.ts` does **not** require a spec edit (variables resolve through the same name); only re-publish the Figma library.
- Changes to `theme.shape.borderRadius` → update the §4.1 corner radius row.
- Adding `Indeterminate=True, State=Disabled` cells (currently not published) → expand §3 exclusions list and §4.3 row.
- Token rename `border-defalt` ↔ `border-default` in the `merak` Figma collection — the typo is preserved across the design system; do not silently normalize without renaming the variable.

## 9. Quick Reference

```ts
// Source prop surface (Checkbox.tsx)
interface CheckboxProps {
  value?: boolean | 'indeterminate'; // → Figma `Checked` × `Indeterminate`
  onValueChange?: (value: boolean | 'indeterminate') => void; // behavior-only
  children: React.ReactNode; // sibling text node in Figma (not a property)
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom'; // designer's auto-layout direction
  inline?: boolean; // designer's flex / inline-flex choice
  className?: string; // not represented in Figma
}

// Compound surface — re-exported as static members
Checkbox.Root;     // CheckboxContext provider
Checkbox.Label;    // <label> with cursor-pointer + flex flow
Checkbox.Indicator; // 1.5rem square — the only piece encoded as a Figma variant
Checkbox.Text;     // <span> for the label text

// Group wrapper (CheckboxGroup.tsx) — layout-only in Figma
interface CheckboxGroupProps<Value> {
  options?: Array<{ label: string; value: Value; labelNode?: React.ReactNode }>;
  label?: React.ReactNode;
  value?: Value[];
  defaultValue?: Value[];
  direction?: 'row' | 'column';
  labelPlacement?: CheckboxProps['labelPlacement'];
  onValueChange?: (value: Value[]) => void;
}
```

```
Figma Component Set: <Checkbox>
  Variant axes : Checked × Indeterminate × Size × Color × State
  Properties   : (none — glyph & label are not Figma component properties)
  Default      : Checked=False, Indeterminate=False, Color=Primary, State=Enabled, Size=Medium
  Total        : 69 published variants (sparse — Disabled limited to Color=Default; Indeterminate=True paired with Checked=False; Hovered/Focused/Pressed not yet published)
  Size px      : Small=15 / Medium=18 / Large=21 (indicator edge, matches internal icon)
```

## 10. Token Glossary

The complete set of Merak design tokens consumed by `<Checkbox>`. Names below are **Figma variable paths** in the `merak` collection. Bind every Figma paint to one of these — never to a literal value.

### 10.1 Seed color tokens (`seed/*`)

For each color family `{primary | secondary | danger | warning | info | success}` the following tokens are consumed:

| Token suffix      | Used by                                                | Role                                                                                         |
| ----------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `/main`           | Checked / indeterminate fill + border                  | Brand color filling the indicator and tinting its border when checked                        |
| `/hover-bg`       | Halo on Primary / Info / Success at Hovered / Pressed  | 4 % tinted overlay behind the indicator                                                      |
| `/outline-hover`  | Halo on Secondary / Danger / Warning at Hovered / Pressed | Family-specific name for the same 4 % overlay role                                           |
| `/focusVisible`   | Halo at `State=Focused`                                | Larger halo (~30 % opacity) drawn behind the indicator                                       |

Full names: `seed/primary/main`, `seed/primary/hover-bg`, `seed/primary/focusVisible`, `seed/secondary/main`, `seed/secondary/outline-hover`, `seed/secondary/focusVisible`, `seed/danger/main`, `seed/danger/outline-hover`, `seed/danger/focusVisible`, `seed/warning/main`, `seed/warning/outline-hover`, `seed/warning/focusVisible`, `seed/info/main`, `seed/info/hover-bg`, `seed/info/focusVisible`, `seed/success/main`, `seed/success/hover-bg`, `seed/success/focusVisible`. The `Color=Default` axis does not consume any seed family — its border + fill resolve to alias tokens (see §10.2).

### 10.2 Alias tokens (`alias/colors/*`)

| Token                               | Used by                                                                | Role                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `alias/colors/bg-active`            | `Color=Default` border + fill (checked)                                | Neutral active surface for the default-color indicator                |
| `alias/colors/bg-input`             | All `Checked=False` indicators                                         | Interior fill of an unchecked checkbox                                |
| `alias/colors/border-defalt` _(sic)_ | `Color=Default, Checked=False` border                                  | Border color for the unchecked default-color indicator                |
| `alias/colors/bg-outline-hover`     | `Color=Default, State ∈ {Hovered, Focused, Pressed}` halo              | 4 % black overlay halo for the default-color hover / focus / pressed state |
| `alias/colors/on-text-focus`        | Check + dash glyph fill (all colors)                                   | White-at-100 % glyph paint, legible on every colored fill             |
| `alias/colors/text-contrast-default` | `Checkbox.Indicator` glyph color in source (`color: …`)                | Source-side equivalent of `on-text-focus`; light-mode neutral on white |
| `alias/colors/text-default`         | Sibling label text (`Checkbox.Text`)                                   | Default body text color                                               |
| `alias/colors/text-sub`             | `<CheckboxGroup>` group label                                          | Subdued label color for the surrounding group title                   |
| `alias/colors/text-disabled`        | `State=Disabled` border + fill                                         | Color-agnostic disabled paint                                         |
| `alias/colors/bg-disabled`          | _(reserved)_ — not currently used by `Checkbox.tsx`; available for a future "disabled fill" if the design diverges from `text-disabled` | 12 % black surface alias                                              |

> Preserve the typo `border-defalt` _(sic)_ — it matches the `merak` variable collection. Renaming it would break bindings.

### 10.3 Shape & elevation

- Corner radius: `theme.shape.borderRadius = 4` (`mui-theme.ts`). The Figma component hard-codes `cornerRadius = 4` until a dedicated radius scale token lands.
- Elevation: not used by `<Checkbox>`. The Figma `shadows/*` effect styles are available if a future raised variant is introduced.
- Indicator border width: `1 px`, hard-coded until a dedicated stroke-width token exists.
- Halo: a same-size circle behind the indicator — not yet published; bind paint to the `Color`-family token and modulate opacity per `State` once Hovered / Focused / Pressed variants land.

### 10.4 Typography

`Checkbox.tsx` and `CheckboxGroup.tsx` resolve label typography through `font-sans` + Tailwind utilities that fall back to MUI's defaults:

- Label (`Checkbox.Text`): font family `Roboto, Helvetica, Arial, sans-serif`, weight `Regular (400)`, size / line-height `16 / 24 px`, letter-spacing `0.15 px`, no text-transform, color bound to `alias/colors/text-default`.
- Group label (`<CheckboxGroup label>`): same family / weight / size / spacing, color bound to `alias/colors/text-sub`.
- These constants live in MUI's defaults; if the project later introduces typography tokens (e.g. `--merak-typography-body1-*`), update §4.1 and §10.4 to bind to them.

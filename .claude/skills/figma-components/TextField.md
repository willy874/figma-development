---
name: figma-component-text-field
description: Figma component specification for `<TextField>` — the design counterpart of `apps/console/src/components/Input/TextInput.tsx` (and consumed by `PasswordInput.tsx` / `SearchInput.tsx`). Documents variant matrix (Variant × Size × State × Has Value), component properties (Label, Placeholder, Value, adornment slot properties, helper text), design tokens, and source-to-Figma mapping rules.
parent_skill: figma-components
figma_file_key: stse2CgIzOugynEdDSexS4
figma_node_id: '3025:2363'
figma_component_set_id: '3025:2363'
---

# `<TextField>` Figma Component Specification

## 1. Overview

`<TextField>` is the Figma counterpart of the `TextInput` foundation component in `apps/console/src/components/Input/TextInput.tsx`. The source is a thin wrapper around MUI `<TextField>` that forwards `variant`, `size`, `color`, `label`, `helperText`, `error`, `placeholder`, plus two wrapper-defined slots (`prefixNode` / `suffixNode`) routed to MUI's `InputProps.startAdornment` / `endAdornment`. The wrapper does **not** remap color semantics — `color` is passed through to MUI verbatim, so there is no `MerakColorTheme` indirection to document.

Two sibling wrappers in the same directory share this Figma component as their visual contract:

- `PasswordInput.tsx` — adds an `InputAdornment` with an `EyeIcon` toggle on the `suffix` slot.
- `SearchInput.tsx` — wraps MUI `Autocomplete` + `TextField`, pinning a `SearchIcon` to the `prefix` slot.

Both reuse the same variant / size / state surface; designers should drop an instance of this component set and set the prefix/suffix adornment accordingly.

The Figma component encodes the surface as a single Component Set with four variant axes (Variant × Size × State × Has Value) plus component properties covering label / placeholder text, the two adornment slots, helper text visibility, and an optional number-stepper affordance.

> **Adornments are slot properties.** The leading / trailing glyph slots are exposed on the `<TextField>` component set as two **INSTANCE_SWAP** slot properties (`Adorn. Start` / `Adorn. End`) whose defaults point at the shared `<Icon>` component set. A slot property lets designers swap the glyph from the right sidebar directly, with no intermediate wrapper component to detach or maintain. We accept the Figma limitation that INSTANCE_SWAP defaults are shared across every variant of the host set — the default is a benign placeholder, and per-instance overrides on a screen are unaffected.

| Aspect                 | Value                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Source file            | `apps/console/src/components/Input/TextInput.tsx`                                       |
| Related wrappers       | `Input/PasswordInput.tsx`, `Input/SearchInput.tsx`                                      |
| Figma file             | [天璇](https://www.figma.com/design/stse2CgIzOugynEdDSexS4) (`stse2CgIzOugynEdDSexS4`)  |
| Figma frame            | `<TextField>` (`3025:2363`, `1448 × 780 px`) on the Utils Component page                |
| Component Set          | `<TextField>` (`3025:2363`)                                                             |
| Sibling Multiline Set  | `<TextField>                                                                            | Multiline` (21 variants) — documented separately |
| Total variants         | **61** (3 variants × 2 sizes × 5 states × 2 has-value = 60, plus 1 `StandardMuti` stub) |
| Underlying MUI version | `@mui/material@5+`                                                                      |
| Typography             | Roboto Regular, value `16 / 24 px` letter-spacing `0.15 px`; label `12 / 12 px`         |

## 2. Source-to-Figma Property Mapping

| Source prop (`TextInput.tsx`)                                        | Figma property                   | Type          | Notes                                                                                                                                             |
| -------------------------------------------------------------------- | -------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant: MuiTextFieldProps['variant']`                              | `Variant`                        | VARIANT       | `standard` / `filled` / `outlined`. `StandardMuti` is a multiline stub — see §3 note.                                                             |
| `size: MuiTextFieldProps['size']`                                    | `Size`                           | VARIANT       | `small` / `medium`                                                                                                                                |
| (interaction / validation state)                                     | `State`                          | VARIANT       | `Enabled` / `Hovered` / `Focused` / `Disabled` / `Error`                                                                                          |
| (controlled value present)                                           | `Has Value`                      | VARIANT       | `True` = rendered `Value`; `False` = placeholder / empty label                                                                                    |
| `label: MuiTextFieldProps['label']`                                  | `Label`                          | TEXT          | Default `Label`. Floats above the input.                                                                                                          |
| `placeholder: MuiTextFieldProps['placeholder']`                      | `Placeholder`                    | TEXT          | Default `Placeholder`. Rendered only when `Has Value=False` and `Placeholder` toggle is on.                                                       |
| (input value)                                                        | `Value`                          | TEXT          | Default `Value`. Rendered only when `Has Value=True`.                                                                                             |
| `prefixNode: React.ReactNode`                                        | `Adorn. Start`                   | INSTANCE_SWAP | Slot property — swap the leading glyph to any variant of the shared `<Icon>` set. Pair with the `Show Adorn. Start` boolean to toggle visibility. |
| `suffixNode: React.ReactNode`                                        | `Adorn. End`                     | INSTANCE_SWAP | Slot property — swap the trailing glyph to any variant of the shared `<Icon>` set. Pair with the `Show Adorn. End` boolean to toggle visibility.  |
| `helperText: MuiTextFieldProps['helperText']`                        | `Helper Text`                    | BOOLEAN       | Show the `<FormHelperText>` row below the input. Fill the inner text via the nested text override.                                                |
| `error: MuiTextFieldProps['error']`                                  | use `State=Error`                | —             | `error={true}` ⇒ pick the `State=Error` variant; helper text + label + underline recolor to `seed/danger/main`.                                   |
| `color: MuiTextFieldProps['color']`                                  | _(not exposed by wrapper today)_ | —             | Wrapper forwards to MUI but Figma only ships the neutral/primary palette; flag a §8 sync edit when adding other colors.                           |
| _(number `<input type="number">` stepper)_                           | `type: number`                   | BOOLEAN       | Synthetic axis — shows the native number stepper glyph; no source flag maps to it, set when the consumer passes `type="number"`.                  |
| `children`, `onChange`, `onBlur`, `ref`, rest native `<input>` props | —                                | —             | Behavior-only, no design representation.                                                                                                          |

> **No Color axis.** `TextInput.tsx` does not remap `color` onto `MerakColorTheme`, and the Figma component set exposes only the neutral + primary-tint surface. §2.1 (color value mapping) is therefore intentionally omitted; revisit §8 if a `Color` axis is ever introduced.

## 3. Variant Property Matrix

```
Variant × Size × State × Has Value   =   3 × 2 × 5 × 2   =   60 variants
                                   + 1 StandardMuti stub  =   61 variants published
```

| Property    | Default value | Options                                                         |
| ----------- | ------------- | --------------------------------------------------------------- |
| `Variant`   | `Standard`    | `Standard`, `Filled`, `Outlined` _(plus legacy `StandardMuti`)_ |
| `Size`      | `Medium`      | `Small`, `Medium`                                               |
| `State`     | `Enabled`     | `Enabled`, `Hovered`, `Focused`, `Disabled`, `Error`            |
| `Has Value` | `True`        | `True`, `False`                                                 |

> **`Value` and `Placeholder` — at least one must render.** When `Has Value=True` the `Value` text node is shown and `Placeholder` is hidden; when `Has Value=False` the `Placeholder` text node is shown and `Value` is hidden. There is no variant in which both are hidden simultaneously — an empty field always falls back to the placeholder paint so the input never renders as a blank stroke.

> **`StandardMuti` is a one-off.** The component set publishes a single `Variant=StandardMuti, Size=Medium, State=Enabled, Has Value=True` variant to preview the multiline surface. The full multiline matrix lives in the sibling `<TextField> | Multiline` set (21 variants) — designers wanting multiline should pull from there, not from this set. Remove or promote `StandardMuti` per §8 once the two sets are consolidated.
>
> **`Pressed` is omitted.** MUI treats `:active` identically to `:focus` for text fields; adding it would double the matrix to 120 variants with no visual delta. Re-add per §8 if a distinct pressed paint is introduced.

### 3.1 `<TextField>` component (non-variant) properties

| Property key        | Type          | Default              | Purpose                                                                                                                             |
| ------------------- | ------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `Label`             | TEXT          | `Label`              | Label string bound to the label text node's `characters`.                                                                           |
| `Placeholder`       | TEXT          | `Placeholder`        | Placeholder string. Rendered only when `Has Value=False`.                                                                           |
| `Value`             | TEXT          | `Value`              | Entered value string. Rendered only when `Has Value=True`.                                                                          |
| `Show Adorn. Start` | BOOLEAN       | `false`              | Show the leading adornment slot. When `true`, the `Adorn. Start` slot property renders.                                             |
| `Adorn. Start`      | INSTANCE_SWAP | `<Icon>` placeholder | Slot property — swap to any variant of the shared `<Icon>` set.                                                                     |
| `Show Adorn. End`   | BOOLEAN       | `false`              | Show the trailing adornment slot. When `true`, the `Adorn. End` slot property renders.                                              |
| `Adorn. End`        | INSTANCE_SWAP | `<Icon>` placeholder | Slot property — swap to any variant of the shared `<Icon>` set.                                                                     |
| `Helper Text`       | BOOLEAN       | `false`              | Show the `<FormHelperText>` row. Its inner text node is an overridable `TEXT` (default `Helper text`). Container uses `Hug` height. |
| `type: number`      | BOOLEAN       | `false`              | Show the native number-stepper glyph alongside an adornment; set when `type="number"`.                                              |

> Adornments ship as **slot properties on `<TextField>` itself** — no intermediate `<Adornment>` wrapper component. Each slot pairs a visibility BOOLEAN (`Show Adorn. Start` / `Show Adorn. End`) with an INSTANCE_SWAP that targets the shared `<Icon>` set, giving designers a one-step glyph swap directly from the right sidebar. Figma's INSTANCE_SWAP defaults are shared across every variant of the component set, which is acceptable — the default is a benign placeholder, and per-instance overrides are free to diverge.
>
> Figma property ids (the `#1234:5` suffix) are not guaranteed stable across re-publishes — always reference by the human-readable key.

## 4. Design Tokens

All paints, strokes, and surfaces bind to Merak design tokens declared in:

- `apps/console/src/themes/seed.css` — `--merak-seed-{family}-{token}` (palette by color family)
- `apps/console/src/themes/alias.css` — `--merak-alias-{group}-{token}` (semantic, color-agnostic)
- `apps/console/src/themes/light.ts` / `dark.ts` — JS values that produce the CSS variables above
- `apps/console/src/themes/constants.tsx` — JS-side mapping
- `apps/console/src/themes/mui-theme.ts` — MUI palette / shape / typography overrides

In Figma, every paint **must** be bound to a Variable that mirrors one of these tokens. Hex values are never pasted — bind to the token so light / dark themes resolve correctly.

### 4.1 Sizing

`TextInput.tsx` does not override MUI's default TextField metrics; the Figma component mirrors MUI's defaults. Until dedicated spacing / radius / typography-size tokens exist, these values are the source of truth (see §8).

| Property                              | Small                                                                            | Medium                   |
| ------------------------------------- | -------------------------------------------------------------------------------- | ------------------------ |
| Container width (default)             | `220 px` (preview)                                                               | `220 px` (preview)       |
| Label font size / line-height         | `12 / 12 px`                                                                     | `12 / 12 px`             |
| Value font size / line-height         | `16 / 24 px`                                                                     | `16 / 24 px`             |
| Label-to-input gap                    | `6 px`                                                                           | `6 px`                   |
| Adornment slot                        | `24 × 24 px`                                                                     | `24 × 24 px`             |
| Adornment → value spacing             | `8 px` (start pad-right)                                                         | `8 px` (start pad-right) |
| Helper text padding-top               | `3 px`                                                                           | `3 px`                   |
| Helper text container height          | `Hug`                                                                            | `Hug`                    |
| Helper text font size / line-ht       | `12 / 1.66`                                                                      | `12 / 1.66`              |
| Standard underline height             | `1 px`                                                                           | `1 px`                   |
| Filled padding (X / Y)                | `12 / 4 px`                                                                      | `12 / 8 px`              |
| Filled cell height (Has Value=True)   | `44 px`                                                                          | `52 px`                  |
| Filled corner radius (top only)       | `4 px 4 px 0 0`                                                                  | `4 px 4 px 0 0`          |
| Outlined padding (X / Y)              | `8 / 8 px`                                                                       | `14 / 8 px`              |
| Outlined cell height (Has Value=True) | `52 px`                                                                          | `52 px`                  |
| Standard cell height (Has Value=True) | `36 px`                                                                          | `36 px`                  |
| Outlined corner radius                | `4 px`                                                                           | `4 px`                   |
| Outlined stroke                       | `1 px`, `strokeAlign = INSIDE` (thickens to `2 px` on `State=Focused` / `Error`) |

- Corner radius matches `theme.shape.borderRadius = 4` from `mui-theme.ts`.
- Letter-spacing: label `0.15 px`, value `0.15 px`, helper text `0.4 px`.

### 4.2 Token bindings

One row per paint role. Bind the Figma fill / stroke to the variable name in **bold**. Names are Figma variable paths in the `merak` collection.

| Role                                     | Token                                                                                                             | Notes                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Label text                               | **`alias/colors/text-sub`**                                                                                       | Floating / resting label color.                                                               |
| Label text (Focused, non-Error)          | **`seed/primary/main`**                                                                                           | Label inherits the MUI primary accent on focus.                                               |
| Label text (Error)                       | **`seed/danger/main`**                                                                                            | Applies to label, helper text, underline/outline.                                             |
| Value text                               | **`alias/colors/text-default`**                                                                                   | Rendered when `Has Value=True`.                                                               |
| Placeholder text                         | **`alias/colors/text-disabled`** _(resolves `#00000061`, 38 % black)_                                             | MUI's `text/disabled` role — same token family as disabled text.                              |
| Disabled text / label                    | **`alias/colors/text-disabled`**                                                                                  | Applies across all variants on `State=Disabled`.                                              |
| Standard underline (Enabled)             | **`_components/input/standard/enabledBorder`** _(resolves `#0000001f`, 12 % black)_                               | Hairline underline.                                                                           |
| Standard underline (Hovered)             | **`_components/input/standard/hoverBorder`** _(resolves `#000000de`, 87 % black via `alias/colors/text-default`)_ | Near-full-opacity black.                                                                      |
| Standard underline (Focused)             | **`seed/primary/main`**                                                                                           | Thickens to `2 px`.                                                                           |
| Standard underline (Error)               | **`seed/danger/main`**                                                                                            | `2 px` on focus, `1 px` otherwise.                                                            |
| Filled surface (Enabled)                 | **`_components/input/filled/enabledFill`** _(resolves `#0000000f`, 6 % black)_                                    | Bind to the component-scoped token; do not stack alphas.                                      |
| Filled surface (Hovered)                 | **`_components/input/filled/hoverFill`** _(resolves `#00000017`, 9 % black)_                                      | Slightly darker hover fill.                                                                   |
| Filled surface (Focused)                 | **`_components/input/filled/hoverFill`**                                                                          | MUI reuses the hover fill on focus.                                                           |
| Filled surface (Disabled)                | **`alias/colors/bg-disabled`**                                                                                    | 12 % black.                                                                                   |
| Filled bottom border (Enabled / Hovered) | same tokens as Standard underline                                                                                 | Filled retains an underline; Focused uses `seed/primary/main`, Error uses `seed/danger/main`. |
| Outlined border (Enabled)                | **`_components/input/outlined/enabledBorder`** _(resolves `#0000001f`, 12 % black)_                               | `1 px` hairline.                                                                              |
| Outlined border (Hovered)                | **`_components/input/outlined/hoverBorder`** _(resolves `#000000de`, 87 % black via `alias/colors/text-default`)_ | `1 px` near-full-opacity black.                                                               |
| Outlined border (Focused)                | **`seed/primary/main`**                                                                                           | `2 px`.                                                                                       |
| Outlined border (Disabled)               | **`alias/colors/bg-disabled`**                                                                                    | 12 % black, `1 px`.                                                                           |
| Outlined border (Error)                  | **`seed/danger/main`**                                                                                            | `1 px` resting, `2 px` on focus.                                                              |
| Background (Outlined / Standard fill)    | **`background/paper-elevation-0`**                                                                                | Explicit `#ffffff` surface token — required for dark-mode resolution.                         |
| Adornment icon fill                      | **`alias/colors/text-sub`** _(resolves `#00000099`, 60 % black)_                                                  | Adornment tone.                                                                               |
| Adornment icon fill (Disabled)           | **`alias/colors/text-disabled`**                                                                                  |                                                                                               |
| Helper text (non-Error)                  | **`alias/colors/text-sub`**                                                                                       |                                                                                               |
| Helper text (Error)                      | **`seed/danger/main`**                                                                                            |                                                                                               |

> The `_components/input/*` tokens are component-scoped aliases that already carry alpha; never pair them with a paint `opacity < 1` — Figma flattens on instance creation. See §4 of [`figma-spec-guide`](../figma-spec-guide/SKILL.md) for the stacking rule.

### 4.3 State rules

One row per state. Token paths shown are `merak` collection paths; bind paints, do not paste hex.

| State        | Standard                                                                                         | Filled                                                                                                               | Outlined                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Enabled**  | label `text-sub` · value `text-default` · underline `standard/enabledBorder` _(1 px)_            | label `text-sub` · value `text-default` · surface `filled/enabledFill` · underline `standard/enabledBorder` _(1 px)_ | label `text-sub` · value `text-default` · border `outlined/enabledBorder` _(1 px)_            |
| **Hovered**  | underline → `standard/hoverBorder` _(1 px)_                                                      | surface → `filled/hoverFill` · underline unchanged                                                                   | border → `outlined/hoverBorder` _(1 px)_                                                      |
| **Focused**  | label → `seed/primary/main` · underline → `seed/primary/main` _(2 px)_                           | label → `seed/primary/main` · surface `filled/hoverFill` · underline → `seed/primary/main` _(2 px)_                  | label → `seed/primary/main` · border → `seed/primary/main` _(2 px)_                           |
| **Disabled** | label + value `text-disabled` · underline `bg-disabled` _(1 px, dashed in MUI)_                  | label + value `text-disabled` · surface `bg-disabled` · underline `bg-disabled`                                      | label + value `text-disabled` · border `bg-disabled` _(1 px)_                                 |
| **Error**    | label + helper `seed/danger/main` · underline `seed/danger/main` _(1 px enabled / 2 px focused)_ | label + helper `seed/danger/main` · surface unchanged · underline `seed/danger/main`                                 | label + helper `seed/danger/main` · border `seed/danger/main` _(1 px enabled / 2 px focused)_ |

Notes:

- `text-disabled` / `bg-disabled` are color-family agnostic and identical across every `Variant` — this is why disabled rows are visually interchangeable.
- `Error` does **not** combine with `Hovered` / `Focused` in separate variants; the `State=Error` variant represents the resting error paint. Focused-error (2 px stroke) is rendered under `State=Error` and designers should not stack `Focused + Error`.
- The adornment `<Icon>` fill tracks the label / value color: it uses `text-sub` in Enabled / Hovered / Focused, `seed/primary/main` on Focused (only for icons intended to accent focus, such as SearchInput's leading icon — override per screen), and `text-disabled` on Disabled. Error state does **not** recolor the adornment icon (MUI keeps adornments neutral).
- When `PasswordInput` renders the trailing eye toggle, its `<IconButton>` ripple overlay is **not** part of this spec — the Figma slot only carries the glyph.

## 5. Icons

| Slot            | Visibility prop     | Swap prop      | Default visibility | Frame dims | Node name      |
| --------------- | ------------------- | -------------- | ------------------ | ---------- | -------------- |
| Start adornment | `Show Adorn. Start` | `Adorn. Start` | `false`            | `24 × 24`  | `Adorn. Start` |
| End adornment   | `Show Adorn. End`   | `Adorn. End`   | `false`            | `24 × 24`  | `Adorn. End`   |
| Number stepper  | `type: number`      | —              | `false`            | `~16 × 25` | `type: number` |

- **Glyph source**: each adornment slot is an Instance of the shared `<Icon>` component set (`798:7408`), exposed directly on `<TextField>` as an INSTANCE_SWAP slot property. The default placeholder is a benign glyph so the slot renders while un-overridden.
- **Swapping the glyph**: select the `<TextField>` instance on the canvas — `Adorn. Start` / `Adorn. End` INSTANCE_SWAP controls appear in the right sidebar next to the visibility booleans.
- **Shared default caveat**: Figma INSTANCE_SWAP defaults are shared across every variant of the host set, so the two slot defaults are a single pair for the whole 60-variant matrix. This is acceptable — the default is a placeholder; screen-level overrides are per-instance and unaffected.
- **Size**: both slots are always `24 × 24`. `Size=Small` and `Size=Medium` host the same adornment size — MUI reduces only the input height, not the adornment.
- **Color**: the inner Vector fill is token-bound per §4.3 (`alias/colors/text-sub` by default, `alias/colors/text-disabled` on Disabled). Rebind the variable per state — never hard-code a fill.
- **Number stepper** (`type: number`) is a vector glyph baked into the variant; it is not routed through the `Adorn. End` slot because MUI ships the UA-native spinner. Hide it in mockups when `type !== "number"`.

## 6. Layout

The Component Set is laid out as a dense 6-column grid inside the `<TextField>` frame (`3025:2363`, `1448 × 780 px`):

- **Columns** = 6 cells wide at `x = {24, 260, 496, 732, 968, 1204}` (236 px column stride, 220 px cell width + 16 px gap). The grid wraps variant tuples in declaration order, so each row combines different `State` / `Has Value` permutations rather than a strict axis mapping.
- **Row bands** (top-to-bottom) = Standard Small → Standard Medium → Filled Small → Filled Medium → Outlined Small → Outlined Medium → `StandardMuti` stub at the bottom.
- **Cell heights** (Has Value=True): Standard `36 px`, Filled Small `44 px`, Filled Medium `52 px`, Outlined Small / Medium `52 px`. `Has Value=False` rows collapse to label-only height (`12 / 20 / 28 px`) in the current Figma — the "at least one of Value/Placeholder renders" rule in §3 will normalize these to the True-row heights once applied.
- The `StandardMuti` stub is published as a single variant `Variant=StandardMuti, Size=Medium, State=Enabled, Has Value=True` at `(24, 720)`, `220 × 36 px`.

Surrounding documentation frame on the Utils Component page:

- **Header** — title `<TextField>`, source path, MUI docs link (`https://mui.com/components/text-fields`).
- **Use Case** panel — curated examples: with start/end adornments, with chips in the input, helper text, error, password toggle (via `PasswordInput` recipe), search (via `SearchInput` recipe).
- **Sibling sets housed nearby** — `<TextField> | Multiline`, `<PinInput>`, `<InputLabel>`. Each has its own spec.

## 7. Usage Guidelines

### 7.1 Picking a variant

1. Match `variant` from the source prop to the Figma `Variant` axis (`standard` → `Standard`, etc.).
2. Match `size` to the Figma `Size` axis.
3. Pick `State`:
   - `Enabled` for resting production screens.
   - `Hovered` / `Focused` only when illustrating interaction flows.
   - `Disabled` for disabled inputs (`disabled={true}` on the source).
   - `Error` when the source passes `error={true}` — do **not** stack `Error` with `Focused`; the `Error` variant already encodes the focused-error paint at the 2 px stroke level where applicable.
4. Pick `Has Value`:
   - `True` when the field carries a value — override the `Value` text property. `Value` renders; `Placeholder` is hidden.
   - `False` when the field is empty — override the `Placeholder` text property. `Placeholder` renders; `Value` is hidden. The input always shows one of the two, never neither.
5. Toggle `Show Adorn. Start` / `Show Adorn. End` only when the source passes `prefixNode` / `suffixNode` (or when using the `PasswordInput` / `SearchInput` wrappers, which bake fixed adornments in). With the slot visible, use the `Adorn. Start` / `Adorn. End` INSTANCE_SWAP controls to pick the glyph from the shared `<Icon>` set.
6. Toggle `Helper Text` only when the source passes `helperText`. Override the inner text via the nested text property.

### 7.2 Wrapper recipes

| Wrapper         | Variant | Size | Adornments                                                                            | Notes                                                          |
| --------------- | ------- | ---- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `TextInput`     | any     | any  | optional `prefixNode` / `suffixNode`                                                  | Generic wrapper — no baked-in adornment.                       |
| `PasswordInput` | any     | any  | trailing eye toggle (enable `Show Adorn. End`, swap `Adorn. End` → `EyeIcon`)         | Toggle visibility via `showPasswordToggle` on source.          |
| `SearchInput`   | any     | any  | leading search glyph (enable `Show Adorn. Start`, swap `Adorn. Start` → `SearchIcon`) | Wraps MUI `<Autocomplete>`; dropdown is not part of this spec. |

### 7.3 Don'ts

- ❌ Don't detach the instance to recolor the underline / border — pick the matching `State` variant.
- ❌ Don't stack alpha on top of `_components/input/filled/*` tokens — they already carry the fill alpha.
- ❌ Don't use the `StandardMuti` variant for production multiline — pull from the dedicated `<TextField> | Multiline` set.
- ❌ Don't paint the adornment icon with a hard-coded hex — rebind the Vector's fill variable, never the paint.
- ❌ Don't detach the instance to change the adornment glyph — use the `Adorn. Start` / `Adorn. End` INSTANCE_SWAP slot controls.
- ❌ Don't hide `Placeholder` and `Value` simultaneously — one of them must always render to prevent a blank input stroke.
- ❌ Don't combine `State=Error` with `State=Focused`; choose `Error` and rely on its encoded focused-error paint.
- ❌ Don't rely on the `color` prop from source to change the focus accent in Figma today — no Color axis exists. Raise a §8 sync before implementing.
- ❌ Don't hand-draw the number stepper glyph — toggle `type: number` so it resolves via the baked vector.

## 8. Source Sync Rule

This document and the source must move together (per the project's **Features Sync Rule** spirit, applied here to design-system components):

When **any** of the following changes:

1. `apps/console/src/components/Input/TextInput.tsx` (props, adornment wiring, default values)
2. `apps/console/src/components/Input/PasswordInput.tsx` / `SearchInput.tsx` (when a recipe changes the fixed adornment or label)
3. The Figma `<TextField>` component set (variants, properties, token bindings) — and the sibling `<TextField> | Multiline` set when multiline consolidates
4. The default `Adorn. Start` / `Adorn. End` INSTANCE_SWAP targets on `<TextField>` (keep them pointing at a safe placeholder in the shared `<Icon>` set — remember the default is shared across all 60 variants)
5. `apps/console/src/themes/seed.css` / `alias.css` / `component.css` (CSS variable surface — especially `_components/input/*`)
6. `apps/console/src/themes/light.ts` / `dark.ts` (alias token JS values feeding the CSS vars)
7. `apps/console/src/themes/mui-theme.ts` (`shape.borderRadius`, palette, typography overrides, MUI `components.MuiTextField` overrides)
8. `apps/console/src/themes/constants.tsx` (should the wrapper ever introduce a `MerakColorTheme` Color axis)
9. The shared `<Icon>` component set — variants added/removed/renamed, or the size-to-pixel mapping changes

…this spec **must be updated in the same change**. Specifically:

- Introducing a `Color` axis on `TextInput` (e.g. `color="success"`) → add §2.1 mapping, add the `Color` variant in Figma, add token rows in §4.2 for the new focus / helper / border paints, and multiply the variant count in §3.
- New MUI variant (e.g. bringing `standard-multiline` into the main set, or a `tonal` variant) → update §3 matrix and regenerate affected variants.
- Adding `Pressed` to the State axis → update §3 and §4.3; add a row to the state rules table.
- Token rename / removal in `seed.css` / `alias.css` / the `_components/input/*` namespace → update every Figma token reference in §2, §4, §10, and rename the matching variable in the `merak` Figma collection.
- Token value change in `light.ts` / `dark.ts` → no edit to this spec needed (Figma variables resolve through the same token name); only re-publish the Figma library.
- New component property (e.g. `clearable`, `loading`) → add to §3.1 with key, type, default, purpose.
- Renaming / repointing the `Adorn. Start` / `Adorn. End` default target, or changing the adornment frame size (e.g. `16 × 16` for dense form rows) → update §3.1, §5, and §9. If dense rows need a smaller adornment, add a dedicated `Adorn Size` axis rather than stacking sizes inside the slot.
- Consolidating or removing `StandardMuti` / the Multiline set → update §3 and §6.

## 9. Quick Reference

```ts
// Source prop surface (TextInput.tsx)
interface TextInputProps extends Omit<NativeInputProps, 'size'> {
  variant?: MuiTextFieldProps['variant']; // → Figma `Variant`
  size?: MuiTextFieldProps['size']; // → Figma `Size`
  color?: MuiTextFieldProps['color']; // not exposed in Figma today
  label?: MuiTextFieldProps['label']; // → Figma `Label` (TEXT)
  helperText?: MuiTextFieldProps['helperText']; // → Figma `Helper Text` (BOOLEAN + nested TEXT)
  error?: MuiTextFieldProps['error']; // → Figma `State=Error`
  placeholder?: MuiTextFieldProps['placeholder']; // → Figma `Placeholder` (TEXT)
  prefixNode?: React.ReactNode; // → Figma `Show Adorn. Start` (BOOLEAN) + `Adorn. Start` (INSTANCE_SWAP → <Icon>)
  suffixNode?: React.ReactNode; // → Figma `Show Adorn. End` (BOOLEAN)   + `Adorn. End` (INSTANCE_SWAP → <Icon>)
}
```

```
Figma Component Set: <TextField>
  Variant axes : Variant × Size × State × Has Value
  Properties   : Label (TEXT), Placeholder (TEXT), Value (TEXT),
                 Show Adorn. Start (BOOLEAN), Adorn. Start (INSTANCE_SWAP → <Icon>),
                 Show Adorn. End   (BOOLEAN), Adorn. End   (INSTANCE_SWAP → <Icon>),
                 Helper Text (BOOLEAN), type: number (BOOLEAN)
  Default      : Variant=Standard, Size=Medium, State=Enabled, Has Value=True
  Constraint   : exactly one of {Value, Placeholder} renders per variant (driven by Has Value)
  Helper       : Helper Text container is Hug height
  Total        : 61 variants (60 grid + 1 StandardMuti stub)

Sibling Set  : <TextField> | Multiline  (21 variants)
```

## 10. Token Glossary

The complete set of Merak design tokens consumed by `<TextField>`. Names below are **Figma variable paths** in the `merak` collection (see `.claude/skills/figma-design-guide/design-token.md`). Bind every Figma paint / stroke / effect to one of these — never to a literal value.

### 10.1 Seed tokens (`seed/*`)

`<TextField>` only consumes the `primary` and `danger` color families today — it has no Color axis.

| Token               | Used by                                                    | Role                              |
| ------------------- | ---------------------------------------------------------- | --------------------------------- |
| `seed/primary/main` | Label + underline + outline on `State=Focused` (non-Error) | Focus accent                      |
| `seed/danger/main`  | Label + helper text + underline + outline on `State=Error` | Error accent (resolves `#d32f2f`) |

### 10.2 Alias tokens (`alias/colors/*`)

| Token                                | Used by                                                                        | Role                              |
| ------------------------------------ | ------------------------------------------------------------------------------ | --------------------------------- |
| `alias/colors/text-default`          | Value text (Enabled / Hovered / Focused)                                       | Primary value foreground          |
| `alias/colors/text-sub`              | Label text, helper text, adornment icon fill                                   | Secondary / supporting copy       |
| `alias/colors/text-disabled`         | Placeholder, disabled label / value / icon                                     | Disabled + placeholder foreground |
| `alias/colors/bg-disabled`           | Disabled fills / borders (all variants)                                        | 12 % black surface                |
| `alias/colors/border-defalt` _(sic)_ | Underline / outline enabled (resolved via `_components/input/*/enabledBorder`) | Default hairline color            |

### 10.3 Component-scoped tokens (`_components/input/*`)

| Token                                      | Used by                               | Role                                       |
| ------------------------------------------ | ------------------------------------- | ------------------------------------------ |
| `_components/input/standard/enabledBorder` | Standard + Filled underline (Enabled) | 12 % black hairline (resolves `#0000001f`) |
| `_components/input/standard/hoverBorder`   | Standard + Filled underline (Hovered) | 87 % black (resolves `#000000de`)          |
| `_components/input/filled/enabledFill`     | Filled surface (Enabled)              | 6 % black fill (resolves `#0000000f`)      |
| `_components/input/filled/hoverFill`       | Filled surface (Hovered / Focused)    | 9 % black fill (resolves `#00000017`)      |
| `_components/input/outlined/enabledBorder` | Outlined border (Enabled)             | 12 % black stroke (resolves `#0000001f`)   |
| `_components/input/outlined/hoverBorder`   | Outlined border (Hovered)             | 87 % black stroke (resolves `#000000de`)   |

### 10.4 Surface + typography tokens

| Token / style                      | Used by                              | Role                                                   |
| ---------------------------------- | ------------------------------------ | ------------------------------------------------------ |
| `background/paper-elevation-0`     | Outlined / Standard surface fallback | Resolves `#ffffff` — required for dark-mode swap       |
| `input/label` (Font variable)      | Label text                           | Roboto Regular, `12 / 12 px`, letter-spacing `0.15 px` |
| `input/value` (Font variable)      | Value + placeholder text             | Roboto Regular, `16 / 24 px`, letter-spacing `0.15 px` |
| `fontFamily` / `fontWeightRegular` | All text nodes                       | `Roboto` / `400`                                       |

### 10.5 Shape & elevation

- Corner radius: `theme.shape.borderRadius = 4` (from `mui-theme.ts`). The Figma component hard-codes `cornerRadius = 4` on Outlined; Filled is `4 4 0 0`. Standard has no radius.
- Elevation: not used (text fields sit flush on the surface).
- Focused stroke thickness: `2 px`, hard-coded until a dedicated focus-ring token exists.

### 10.6 Typography

`TextInput.tsx` does not override MUI typography. Resolved values:

- Font family: `Roboto, Helvetica, Arial, sans-serif`
- Font weight: `Regular (400)`
- Label size / line-height: `12 / 12 px` · letter-spacing `0.15 px`
- Value size / line-height: `16 / 24 px` · letter-spacing `0.15 px`
- Helper size / line-height: `12 px` / `1.66` · letter-spacing `0.4 px`

These live in MUI's defaults; if the project introduces typography tokens (e.g. `--merak-typography-input-*`), update §4.1 and §10.6 to bind to them.

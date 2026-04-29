---
name: figma-component-text-field-spec
description: Figma component specification for `<TextField>` — design counterpart of the MUI `<TextField>` consumed by `src/stories/TextField.stories.tsx`. Documents the variant matrix (Variant × Size × State × Has Value × Multiline), component properties (Label / Placeholder / Value / Helper Text Content + adornment / autocomplete slots), source-to-Figma mapping, and the token bindings that pin every fill / stroke / underline to a named token. For component-scoped tokens see `design-token.md` in this directory; for runtime measurements see `storybook.render.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '1:6266'
figma_component_set_id: '1:6266'
---

# `<TextField>` Figma Component Specification

## 1. Overview

`<TextField>` is the Figma counterpart of the MUI `<TextField>` consumed in `src/stories/TextField.stories.tsx`. The package re-exports MUI directly — there is no in-repo wrapper — so the Figma component encodes the MUI prop surface (`variant`, `size`, `disabled`, `error`, `focused`, `value`, `label`, `placeholder`, `helperText`, `InputProps.startAdornment` / `endAdornment`) plus a native `Autocomplete` slot for SearchInput-style children.

The Figma cells already match this contract — every paint, stroke, text fill, and underline is bound to a named variable in the MUI-Library file's local collection (`KQjP6W9Uw1PN0iipwQHyYn`). The `component/input/*` family of tokens (documented in [`design-token.md`](./design-token.md)) carries MUI-specific resting alphas; semantic tokens come from the published `merak/seed/*` and `merak/alias/*` namespaces (see [`figma-design-guide`](../../figma-design-guide/design-token.md)).

| Aspect            | Value                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| Source story      | `src/stories/TextField.stories.tsx`                                                    |
| Underlying source | `@mui/material@^7.3.10` `TextField` (re-exported by this package, no wrapper)          |
| Figma file        | [MUI-Library](https://www.figma.com/design/KQjP6W9Uw1PN0iipwQHyYn) (`KQjP6W9Uw1PN0iipwQHyYn`) |
| Figma frame       | `TextField` (`1:6156`) on page **Foundation Components** (`0:1`) — outer documentation frame (`2928.91 × 3606.33 px`) housing both the variant grid (`1:6266`) at `x=24` and the `UseCase` panel (`1:6157`) at `x=1575.96`. Frame height grows with the multiline block; Auto Layout determines the actual value. |
| Component Set     | `<TextField>` (`1:6266`) — variant grid (`1449.14 × 2088.32 px`)                       |
| UseCase panel     | `UseCase` (`1:6157`) — curated examples (`1260 × 2137.12 px`); see §6.2                |
| Total variants    | **120** (3 Variants × 2 Sizes × 5 States × 2 Has Value × 2 Multiline)                  |
| Typography        | Roboto Regular, value `16 / 24 px` ls `0.15 px`; floated label text style `input/label` (`12 / 12 px`, ls `0.15 px`) |

## 2. Source-to-Figma Property Mapping

| MUI prop                                                  | Figma property         | Type             | Notes                                                                                                              |
| --------------------------------------------------------- | ---------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `variant`                                                 | `Variant`              | VARIANT          | `Standard` / `Filled` / `Outlined`                                                                                 |
| `size`                                                    | `Size`                 | VARIANT          | `Medium` / `Small`                                                                                                 |
| _(`disabled` / `error` / `focused` / interaction)_        | `State`                | VARIANT          | `Enabled` / `Hovered` / `Focused` / `Disabled` / `Error`                                                           |
| _(controlled `value` present)_                            | `Has Value`            | VARIANT          | `True` = label floated + value rendered; `False` = label sits inside input.                                        |
| `label`                                                   | `Label`                | TEXT             | Default `Label`. Bound to the floated label text node's `characters`.                                              |
| `placeholder`                                             | `Placeholder`          | TEXT             | Default `Label`. Bound to a separate placeholder text node inside `Content`. Note §4.3 — runtime suppresses it whenever the un-shrunk label is showing, so the Figma cells never visibly render this property today. The slot exists so a future `<TextField>` variant without a label can surface placeholder copy. |
| `value` / `defaultValue`                                  | `Value`                | TEXT             | Default `Value`. Rendered only when `Has Value=True`.                                                              |
| `helperText`                                              | `Helper Text` + `Helper Text Content` | BOOLEAN + TEXT | `Helper Text` toggles visibility of the `<FormHelperText>` row; `Helper Text Content` overrides the inner text (default `Helper text`). |
| `InputProps.startAdornment`                               | `Adorn. Start` + `Start Adorn` | BOOLEAN + SLOT  | `Adorn. Start` (note the period) toggles the leading slot; `Start Adorn` is a native Figma SLOT — designers drop any node into it at instance level. |
| `InputProps.endAdornment`                                 | `Adorn. End` + `End Adorn`     | BOOLEAN + SLOT  | Same shape as Start.                                                                                               |
| _(SearchInput-style autocomplete dropdown anchor)_        | `Autocomplete`         | SLOT             | Native slot below the input row; renders nothing in `<TextField>` itself. Intended for wrapper composers (e.g. a future `<SearchInput>` / `<Autocomplete>` recipe). |
| `color`                                                   | —                      | —                | Wrapper forwards to MUI; Figma ships only the neutral + primary-tint surface today. Adding a `Color` axis is a §8 trigger. |
| `multiline`                                               | `Multiline`            | VARIANT          | `True` swaps the input row for a 3-row textarea. **`minRows=3` is fixed in Figma**; runtime keeps `maxRows` unset so the textarea can still grow vertically past 3 rows — the cell only encodes the minimum. |
| `minRows`, `maxRows`                                      | —                      | —                | Not modelled as variants. Figma fixes `minRows=3` for every `Multiline=True` cell; if a host overrides `minRows` / `maxRows` the rendered height will diverge from the cell — treat as a known omission, not a drift. |
| `select`, `type`                                          | —                      | —                | Behavior-only; Figma has no `Select` or `type=number` axis today.                                                  |
| `onChange`, `onBlur`, `inputRef`, rest native props        | —                      | —                | Behavior-only, no design representation.                                                                           |

> **Slots are native `SLOT`, not `INSTANCE_SWAP`.** `Start Adorn`, `End Adorn`, and `Autocomplete` are native Figma SLOTs — designers drop any node (an `<Icon>` instance, an `<IconButton>`, a popper child, etc.) into them at instance level. There is no shared default to maintain at the component-set level, and the `INSTANCE_SWAP` shared-default caveat does **not** apply here.
>
> **No Color axis.** The component set publishes only the neutral + MUI-primary-tint paint surface. Adding `color="success"` (or other palette keys) requires introducing a `Color` axis; track in §8.

## 3. Variant Property Matrix

```
Variant × Size × State × Has Value × Multiline   =   3 × 2 × 5 × 2 × 2   =   120 variants
```

| Property    | Default value | Options                                                         |
| ----------- | ------------- | --------------------------------------------------------------- |
| `Variant`   | `Standard`    | `Standard`, `Filled`, `Outlined`                                |
| `Size`      | `Medium`      | `Medium`, `Small`                                               |
| `State`     | `Enabled`     | `Enabled`, `Hovered`, `Focused`, `Disabled`, `Error`            |
| `Has Value` | `True`        | `True`, `False`                                                 |
| `Multiline` | `False`       | `False`, `True` — `True` fixes a 3-row (`69 px`) textarea content area; the wrapper grows by `+46 px` (= `(minRows−1) × 23 px`) over the single-line height. No paint / token differs from single-line. |

> **`Pressed` is omitted.** MUI treats `:active` identically to `:focus` for TextField; adding it would double the matrix to 120 variants with no visual delta. Re-add per §8 if a distinct pressed paint is introduced.
>
> **`Error` does not stack with `Focused`.** MUI repaints the focus underline / outline at 2 px when `error && focused` — the `State=Error` Figma variant already encodes the resting error paint. Designers should not stack `Focused + Error`.

### 3.1 Component (non-variant) properties

Property names below are the human-readable keys; Figma's internal property ids carry a `#NNNN:N` suffix (e.g. `Label#3025:0`) that is not stable across re-publishes — never reference the suffix outside frontmatter.

| Property key          | Type    | Default              | Purpose                                                                                                                                          |
| --------------------- | ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Label`               | TEXT    | `Label`              | Label string bound to the floated label text node.                                                                                               |
| `Placeholder`         | TEXT    | `Label`              | Placeholder string bound to a separate placeholder text node. See §4.3 — currently never rendered by any cell because MUI suppresses placeholder while a label is showing. |
| `Value`               | TEXT    | `Value`              | Entered value string. Rendered only when `Has Value=True`.                                                                                       |
| `Adorn. Start`        | BOOLEAN | `false`              | Toggle the leading adornment slot.                                                                                                               |
| `Start Adorn`         | SLOT    | empty                | Native Figma slot for the leading adornment. Designers drop any node (`<Icon>` instance is the convention).                                      |
| `Adorn. End`          | BOOLEAN | `false`              | Toggle the trailing adornment slot.                                                                                                              |
| `End Adorn`           | SLOT    | empty                | Native Figma slot for the trailing adornment.                                                                                                    |
| `Helper Text`         | BOOLEAN | `false`              | Toggle the `<FormHelperText>` row below the input.                                                                                               |
| `Helper Text Content` | TEXT    | `Helper text`        | Inner text of the helper-text row. Overridable per instance.                                                                                     |
| `Autocomplete`        | SLOT    | empty                | Bottom slot for wrapper composers. Renders nothing in `<TextField>` itself.                                                                      |

## 4. Design Tokens

All paints, strokes, and surfaces bind to local variables in the MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`). Hex values appear in this document only as reference resolutions of the light theme — bind to the token, not the hex.

### 4.1 Sizing

`<TextField>` does not override MUI defaults; the Figma cell heights mirror the runtime `getBoundingClientRect()` of `src/stories/TextField.stories.tsx` (see `storybook.render.md` §3 for single-line, §7 for multiline).

| Property                              | Standard   | Filled      | Outlined    |
| ------------------------------------- | ---------- | ----------- | ----------- |
| Cell width (preview)                  | `220 px`   | `220 px`    | `220 px`    |
| Cell height — Small                   | `45 px`    | `48 px`     | `40 px`     |
| Cell height — Medium                  | `48 px`    | `56 px`     | `56 px`     |
| Cell height — Small · Multiline       | `91 px`    | `94 px`     | `86 px`     |
| Cell height — Medium · Multiline      | `94 px`    | `102 px`    | `102 px`    |
| Wrapper height — Small                | `29 px`    | `48 px`     | `40 px`     |
| Wrapper height — Medium               | `32 px`    | `56 px`     | `56 px`     |
| Wrapper height — Small · Multiline    | `75 px`    | `94 px`     | `86 px`     |
| Wrapper height — Medium · Multiline   | `78 px`    | `102 px`    | `102 px`    |
| Textarea content height (Multiline)   | `69 px`    | `69 px`     | `69 px`     |
| Wrapper corner radius                 | `0`        | `4 4 0 0`   | `4`         |
| Resting underline / border thickness  | `1 px`     | `1 px`      | `1 px`      |
| Focused underline / border thickness  | `2 px`     | `2 px`      | `2 px`      |
| Adornment slot (Figma)                | `24 × 24`  | `24 × 24`   | `24 × 24`   |
| Adornment → input gap                 | `8 px`     | `8 px`      | `8 px`      |
| Helper text padding-top               | `3 px`     | `3 px`      | `3 px`      |
| Helper text font / line-ht / ls       | `12 / 16.6 px / 0.4 px` Figma cell · `12 / 19.92 px / 0.4 px` runtime | same | same |
| Floated label text style              | `input/label` (`12 / 12 px`, ls `0.15 px`) | same | same |
| Value font / line-ht / ls             | `16 / 24 px / 0.15 px` Figma cell · `16 / 23 px / 0.15 px` runtime | same | same |

Notes:

- The Figma adornment slot is `24 × 24 px` for both sizes; MUI does not constrain adornment size at runtime, but the `<Icon>` set ships at `24 × 24` so the slot stays uniform.
- Filled rounds only the top corners (`4 4 0 0`); the bottom is the underline. Outlined rounds all four corners (`4`). Standard has no radius.
- Floated label uses the published `input/label` text style (Roboto Regular `12 / 12 px`, ls `0.15 px`); Value uses `16 / 24 px`. Apply text styles by id, not by hand-setting `fontName` / `fontSize`.
- **Multiline grows wrapper height by exactly `+46 px` over the single-line height** (`(minRows−1) × line-height = 2 × 23 px`). Wrapper padding (`Standard 4/5`, `Filled 25/8 Md / 21/4 Sm`, `Outlined 16.5/16.5 Md / 8.5/8.5 Sm`) and every paint / stroke / token are unchanged from single-line — the only delta is the inner `<textarea>` swap and the resulting `69 px` content height. Standard's `+16 px` outer-vs-wrapper offset (label sits above the input row) carries over: outer multiline height = wrapper multiline height + 16 px for Standard; outer = wrapper for Filled / Outlined.

### 4.2 Token bindings

One row per paint role. Bind the Figma fill / stroke / text-fill to the variable name in **bold**.

| Role                                       | Token                                                                     | Notes                                                                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Label text — resting (Enabled / Hovered)   | **`alias/colors/text-sub`** _(`#000000 0.6α`)_                            | MUI `text.secondary`.                                                                                                          |
| Label text — Focused (non-Error)           | **`seed/primary/main`** _(`#1976D2`)_                                     |                                                                                                                                |
| Label text — Disabled                      | **`alias/colors/text-disabled`** _(`#000000 0.38α`)_                      | MUI `text.disabled` — the Figma cells use `text-disabled`, **not** `fg-disabled` (`0.26α`). Matches runtime exactly.            |
| Label text — Error                         | **`seed/danger/main`** _(`#D32F2F`)_                                      |                                                                                                                                |
| Value text                                 | **`alias/colors/text-default`** _(`#000000 0.87α`)_                       | MUI `text.primary`.                                                                                                            |
| Value text — Disabled                      | **`alias/colors/text-disabled`** _(`#000000 0.38α`)_                      | Same `text.disabled` as label.                                                                                                  |
| Placeholder text node fill                 | **`text/disabled`** _(local variable, `#000000 0.38α`)_                   | Distinct local Figma variable name from `alias/colors/text-disabled` even though both resolve to the same hex (`text.disabled`). The placeholder is currently invisible in every published cell — see §4.3 — but the token binding stays so a future "no-label" variant can surface it. |
| Standard underline — Enabled               | **`component/input/standard/enabledBorder`** _(`#0000006B`, `0.42α`)_   |                                                                                                                                |
| Standard underline — Hovered               | **`component/input/standard/hoverBorder`** _(`#000000DE`, `0.87α`)_     | Standard darkens to `text.primary` on hover.                                                                                   |
| Standard underline — Focused (non-Error)   | **`seed/primary/main`** _(2 px)_                                          |                                                                                                                                |
| Standard underline — Disabled              | **`alias/colors/bg-disabled`** _(`#0000001F`, `0.12α`)_                   | `bg-disabled` is reused here as a **stroke** even though its name suggests a fill role; this is the same convention `<Button>` uses (`bg-disabled` for Outlined disabled border). The underline is rendered solid because Figma has no equivalent of MUI's `1 px dotted`. Track drift in §7. |
| Standard underline — Error                 | **`seed/danger/main`** _(1 px resting / 2 px focused-error)_              |                                                                                                                                |
| Filled wrapper — Enabled                   | **`component/input/filled/enabledFill`** _(`#0000000F`, `0.06α`)_       | Pre-alpha'd component-scoped token; do not stack `paint.opacity < 1`.                                                          |
| Filled wrapper — Hovered                   | **`component/input/filled/hoverFill`** _(`#00000017`, `0.09α`)_         | Slightly darker overlay.                                                                                                       |
| Filled wrapper — Focused                   | **`component/input/filled/hoverFill`** _(`#00000017`, `0.09α`)_         | The Figma cells reuse `hoverFill` on Focused. **Drift open** vs runtime which keeps `enabledFill` (`0.06α`) — see §7 issue 4. |
| Filled wrapper — Disabled                  | **`alias/colors/bg-disabled`** _(`#0000001F`, `0.12α`)_                   | MUI `action.disabledBackground`. Used in fill role here, in stroke role for Standard / Filled / Outlined disabled borders below — see `design-token.md` "no `disabledBorder` token" rationale. |
| Filled wrapper — Error                     | **`component/input/filled/enabledFill`**                                | Surface stays at the Enabled overlay; only underline retints to `seed/danger/main`.                                            |
| Filled underline — Enabled / Hovered       | **`component/input/standard/enabledBorder`** _(0.42α)_                  | Filled keeps the resting underline at `0.42α` even on Hovered (the wrapper darkens via `hoverFill`, not the underline).        |
| Filled underline — Focused                 | **`seed/primary/main`** _(2 px)_                                          |                                                                                                                                |
| Filled underline — Disabled / Error        | same as Standard rows                                                     | Disabled `bg-disabled`; Error `seed/danger/main`.                                                                              |
| Outlined notched outline — Enabled         | **`component/input/outlined/enabledBorder`** _(`#0000001F`, `0.12α`)_   | Drift open vs runtime `0.23α` — see §7 issue 1.                                                                                |
| Outlined notched outline — Hovered         | **`component/input/outlined/hoverBorder`** _(`#000000DE`, `0.87α`)_     | Matches MUI `text.primary` on hover.                                                                                           |
| Outlined notched outline — Focused         | **`seed/primary/main`** _(2 px)_                                          |                                                                                                                                |
| Outlined notched outline — Disabled        | **`alias/colors/bg-disabled`** _(`#0000001F`, `0.12α`)_                   | Drift open vs runtime `0.26α` — see §7 issue 2.                                                                                |
| Outlined notched outline — Error           | **`seed/danger/main`** _(1 px resting / 2 px focused-error)_              |                                                                                                                                |
| Outlined label-notch background            | **`background/paper-elevation-0`** _(`#FFFFFF`)_                          | Local variable. Required so the label-notch frame masks the outlined border at the label position.                             |
| Adornment glyph fill — resting             | **`alias/colors/text-sub`** _(`#000000 0.6α`)_                            | Drift open vs runtime `action.active` (`0.54α`) — see §7 issue 3.                                                              |
| Adornment glyph fill — Disabled            | **`alias/colors/text-disabled`**                                          |                                                                                                                                |
| Helper text — non-Error                    | **`alias/colors/text-sub`**                                               |                                                                                                                                |
| Helper text — Disabled                     | **`alias/colors/text-disabled`**                                          | Helper text retints to disabled tone alongside label / value.                                                                  |
| Helper text — Error                        | **`seed/danger/main`**                                                    |                                                                                                                                |

> The `component/input/*` tokens are component-scoped aliases that already carry alpha; never pair them with a paint `opacity < 1` — Figma flattens on instance creation. See [`figma-component-spec-guide`](../../figma-component-spec-guide/SKILL.md) §4 for the stacking rule.

### 4.3 State rules

One row per state, columns per Variant. Bindings reference §4.2.

| State        | Standard                                                                                                  | Filled                                                                                                                         | Outlined                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Enabled**  | label `text-sub` · value `text-default` · underline `standard/enabledBorder` _(1 px)_                     | label `text-sub` · value `text-default` · wrapper `filled/enabledFill` · underline `standard/enabledBorder` _(1 px)_           | label `text-sub` · value `text-default` · border `outlined/enabledBorder` _(1 px)_                      |
| **Hovered**  | underline → `standard/hoverBorder` _(1 px, 0.87α)_                                                        | wrapper → `filled/hoverFill` · underline unchanged at `standard/enabledBorder`                                                 | border → `outlined/hoverBorder` _(1 px, 0.87α)_                                                         |
| **Focused**  | label → `seed/primary/main` · underline → `seed/primary/main` _(2 px)_                                    | label → `seed/primary/main` · wrapper → `filled/hoverFill` · underline → `seed/primary/main` _(2 px)_                          | label → `seed/primary/main` · border → `seed/primary/main` _(2 px)_                                     |
| **Disabled** | label + value + helper `text-disabled` · underline `bg-disabled` _(1 px)_                                 | label + value + helper `text-disabled` · wrapper `bg-disabled` · underline `bg-disabled`                                       | label + value + helper `text-disabled` · border `bg-disabled` _(1 px)_                                  |
| **Error**    | label + helper `seed/danger/main` · value `text-default` · underline `seed/danger/main` _(1 px / 2 px focused)_ | label + helper `seed/danger/main` · value `text-default` · wrapper unchanged (`filled/enabledFill`) · underline `seed/danger/main` | label + helper `seed/danger/main` · value `text-default` · border `seed/danger/main` _(1 px / 2 px focused)_ |

Notes:

- **Disabled is color-family agnostic.** `text-disabled` (MUI `text.disabled`) and `bg-disabled` (MUI `action.disabledBackground`) replace every themed paint, so `State=Disabled` is visually identical across Variants other than the wrapper fill (Filled gets the `bg-disabled` overlay; Standard / Outlined keep transparent).
- **`Has Value=False` is label-only at runtime.** When the field is empty and not focused, MUI un-shrinks the label and renders it at the input position; the placeholder is suppressed (`::placeholder { opacity: 0 }`). The Figma cells follow this — every `Has Value=False` cell hides the floated `Label Container` and shows the un-floated label text inside `Content`. The `Placeholder` text node ships in every cell as a hidden node (bound to `text/disabled`) so a future "no-label" variant can switch its visibility on. When `State=Focused`, the label always shrinks-and-floats regardless of `Has Value`.
- **Adornment color does not retint with Error.** MUI keeps adornments neutral (`action.active`) on Error; only label / underline / helper retint. The Figma cells hold the same convention via `text-sub` for resting and `text-disabled` for Disabled.
- **The `Autocomplete` SLOT renders nothing on `<TextField>` itself.** It exists as a host point for a future `<Autocomplete>` / `<SearchInput>` wrapper.

## 5. Icons (adornment slots)

| Slot            | Visibility prop  | Content prop  | Default visibility | Frame dims | Node name      |
| --------------- | ---------------- | ------------- | ------------------ | ---------- | -------------- |
| Start adornment | `Adorn. Start`   | `Start Adorn` | `false`            | `24 × 24`  | `Start Adorn`  |
| End adornment   | `Adorn. End`     | `End Adorn`   | `false`            | `24 × 24`  | `End Adorn`    |

- **Slot type**: native Figma `SLOT` (not `INSTANCE_SWAP`). Designers drop any node into the slot at instance level — typically an instance of the shared `<Icon>` component set (`3:2722`). There is no shared default to maintain at the component-set level.
- **Glyph fill**: bind the inner Vector fill of the dropped instance to `alias/colors/text-sub` (resting) or `alias/colors/text-disabled` (Disabled). Do not paint with hex.
- **Slot dimensions**: `24 × 24 px` for both `Size=Small` and `Size=Medium`. Keeping the slot uniform avoids two adornment ramps; the host input shrinks vertically on Small but the adornment frame stays.
- **Runtime drift**: MUI renders adornment glyphs at `action.active` (`0.54α`); the spec binds `text-sub` (`0.6α`). The visual difference is small — track in §7 to either accept or close by minting a dedicated adornment-fill token.

## 6. Layout

The Component Set is laid out as a **6-column × 20-row grid** inside the `<TextField>` frame (`1:6266`):

- **Columns** (left → right) — `Variant × Size`: Standard·Medium, Standard·Small, Filled·Medium, Filled·Small, Outlined·Medium, Outlined·Small. Column origins x = `{24, 260, 496, 732, 968, 1204}`; column stride `236 px` (`220 px` cell + `16 px` gap).
- **Row bands** (top → bottom) — `State × Has Value × Multiline`. The grid is the single-line block (10 rows, identical to the previous publication) followed immediately by the multiline block (10 more rows in the same `State × Has Value` order):
  - Single-line block (`Multiline=False`):
    - Enabled · True
    - Enabled · False
    - Hovered · True
    - Hovered · False
    - Focused · True
    - Focused · False
    - Disabled · True
    - Disabled · False
    - Error · True
    - Error · False
  - Multiline block (`Multiline=True`, repeats the State × Has Value order):
    - Enabled · True · Multiline
    - Enabled · False · Multiline
    - Hovered · True · Multiline
    - Hovered · False · Multiline
    - Focused · True · Multiline
    - Focused · False · Multiline
    - Disabled · True · Multiline
    - Disabled · False · Multiline
    - Error · True · Multiline
    - Error · False · Multiline
- Row vertical strides reflect cell heights from §4.1; the `Has Value=False` rows collapse to the un-shrunk-label height (single-line block) or sit at the un-shrunk-label-at-first-row position (multiline block, see §6.1). Multiline rows are uniformly taller — the wrapper grows by `+46 px` regardless of `Has Value`.
- Frame dimensions grow proportionally — adding the multiline block doubles the row count; the frame's `height` becomes `≈ 1648 px` (single-line block ≈ 826 px + multiline block + Helper Text bands). The exact value is whatever the Auto Layout pack produces; do not hard-code.

The surrounding outer frame `TextField` (`1:6156`) houses both the variant grid and a `UseCase` documentation panel (`1:6157`) at `x=1575.96` — see §6.2 for the panel's section inventory.

### 6.2 `UseCase` documentation panel (`1:6157`)

Sibling panel to the variant grid, used by designers as a quick-reference catalog of the variant axes plus curated wrapper recipes. Renders nothing in production — it lives in the library file only. Each section pairs a Head (title + caption) with a Body of example instances dropped from the `<TextField>` component set.

| Section node | Name             | Caption (verbatim)                                                                                                                  | Examples (verbatim labels)                                                                                                  |
| ------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `1:6159`     | **Variants**     | `<TextField> variant — standard · filled · outlined`                                                                                | Standard · Filled · Outlined                                                                                                |
| `1:6173`     | **Sizes**        | `<TextField> size — medium (default) · small`                                                                                       | medium · small                                                                                                              |
| `1:6184`     | **States**       | `Interaction & validation states — Enabled · Hovered · Focused · Disabled · Error`                                                  | Enabled · Hovered · Focused · Disabled · Error                                                                              |
| `1:6204`     | **Has Value**    | `True floats label & shows Value · False keeps un-floated label inside input — placeholder stays suppressed`                        | Has Value=True · Has Value=False                                                                                            |
| `422:7056`   | **Multiline**    | `Multiline=true swaps <input> for <textarea> with fixed minRows=3 — wrapper height grows by +46 px; paint / tokens unchanged`       | Multiline=false · Multiline=true · Multiline=true · Empty                                                                   |
| `1:6215`     | **Helper Text**  | `Toggle the <FormHelperText> row — pairs with State=Error for inline validation`                                                    | Helper Text=false · Helper Text=true · Error + Helper Text                                                                  |
| `1:6229`     | **Adornments**   | `prefixNode / suffixNode slots — toggle Adorn. Start / Adorn. End`                                                                  | Adorn. Start · Adorn. End · Both adornments                                                                                 |
| `1:6243`     | **Common usage** | `Typical <TextField> recipes used across the Console app`                                                                           | SearchInput recipe (Outlined + leading `<SearchIcon>`) · PasswordInput recipe (Outlined + trailing `<EyeIcon>`) · Required field (Filled with helper) · Inline validation (Error with helper message) · Read-only / disabled (pre-filled identifier) · Compact filter (Standard Small) |

Notes:

- **The panel is informative, not normative.** Examples are instances of the component set with property overrides — they don't introduce new tokens, paint roles, or variants. If a recipe diverges visually from the equivalent `(Variant, Size, State, Has Value, Multiline)` cell in the grid, that's a spec bug.
- **The Common usage recipes are not yet wrapper components** (see §7.2). Each one is a hand-composed `<TextField>` instance plus an `<Icon>` instance dropped into a slot; promoting any of them to a wrapper component set is a §8 trigger.
- **The Multiline section node id sits in a different range (`422:*`)** because it was added in a later publish; treat the discontinuity as expected.

### 6.1 Cell composition

Every single-line cell follows the same nested structure (the Figma `Variant=Filled, Size=Medium, State=Enabled, Has Value=True, Multiline=False` cell `1:6299` is the canonical reference):

- `Input` (FRAME) — wrapper with the variant fill (Filled) or transparent (Standard / Outlined) and the notched outline (Outlined).
  - `Label` (FRAME) — sub-frame holding the un-floated label text node (visible when `Has Value=False`).
  - `Content` (FRAME) — row containing the start slot, value text, un-floated `Label` text, `Placeholder` text (currently hidden), end slot.
  - `Underline` (LINE) — the `1 px` / `2 px` underline element. Outlined cells keep the LINE node but mask it behind the notched outline.
- `Label Container` (FRAME) — overlay holding the floated label text (visible when `Has Value=True` or `State=Focused`). Painted with `background/paper-elevation-0` so it can sit on top of the Outlined border to create the notch effect.
- `Helper Text` (FRAME) — visible only when `Helper Text=true`.
- `Autocomplete` (SLOT) — empty bottom slot.

The dual-label pattern (un-floated `Label` text inside `Content` + floated `Label` text inside `Label Container`) is what lets variant overrides toggle which label is visible without rewriting the text node. Designers should override `Label` once on the instance — both copies are wired to the same component property.

#### Multiline cell composition (`Multiline=True`)

Multiline cells reuse the entire single-line structure verbatim — no new nodes, no new paint roles — but the `Content` row is replaced with a multi-row textarea content area:

- `Input` (FRAME) — same wrapper paint / stroke / corner radius as the single-line sibling at the same `(Variant, Size, State, Has Value)`. Wrapper height is the value listed in §4.1 "Wrapper height — Multiline" rows.
- `Content` (FRAME) — height grows from the single-line baseline (`23 px`) to `69 px` (`3 × 23 px`). The `Value` text node fills the height; the un-floated `Label` text node (visible when `Has Value=False`) sits at the **first-row baseline** with the same translate-Y the single-line `Has Value=False` cell uses. The remaining 2 rows of the textarea sit empty below.
- Adornment slots (`Start Adorn` / `End Adorn`), `Underline` / fieldset border, `Label Container`, `Helper Text`, `Autocomplete` SLOT — unchanged from single-line.

The single design choice is whether to encode the textarea as a static `69 px` content frame (chosen here, matches the Figma "fix `minRows=3`" rule) or as an Auto-Layout content frame that grows. Since runtime can grow past `minRows` but the Figma cell only encodes the minimum, the static frame is correct.

## 7. Usage Guidelines

### 7.1 Picking a variant

1. Match `variant` from MUI to the Figma `Variant` axis (`standard` → `Standard`, etc.).
2. Match `size` to the Figma `Size` axis.
3. Pick `State`:
   - `Enabled` for resting production screens.
   - `Hovered` / `Focused` only when illustrating interaction flows.
   - `Disabled` for `disabled={true}`.
   - `Error` for `error={true}` — do **not** stack with `Focused`.
4. Pick `Has Value`:
   - `True` when the field carries a value — override the `Value` text property; label floats.
   - `False` when the field is empty — label sits inside the input; the `Placeholder` property is currently inert (see §4.3).
5. Pick `Multiline`:
   - `False` (default) for single-line input.
   - `True` when the source passes `multiline={true}` — the cell renders a 3-row textarea (`69 px` content). If the source overrides `minRows` / `maxRows`, the runtime height will diverge from the Figma cell — that's a known omission, not a bug. Re-author with a different fixed `minRows` only if a host uses a non-3 default consistently (a §8 trigger).
6. Toggle `Adorn. Start` / `Adorn. End` only when the source passes `InputProps.startAdornment` / `endAdornment`. With the slot visible, drop a glyph into `Start Adorn` / `End Adorn` (instance of the shared `<Icon>` set is the convention).
7. Toggle `Helper Text` only when the source passes `helperText`; override `Helper Text Content` for the inner text.

### 7.2 Wrapper recipes (informative)

The Figma component set has no wrapper components today — every recipe below is a hand-composed instance of the set. The `UseCase` panel (§6.2) ships canonical examples; mirror those property overrides exactly when reusing a recipe on a screen.

| Recipe                  | Variant   | Size   | State          | Adornment                                                   | Helper Text                  | Notes                                                                                       |
| ----------------------- | --------- | ------ | -------------- | ----------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| **SearchInput**         | Outlined  | Medium | Enabled        | `Adorn. Start=true`, drop `<Search>` `<Icon>` instance      | off                          | Populate the `Autocomplete` slot with a popper child when wiring an actual autocomplete UI. |
| **PasswordInput**       | Outlined  | Medium | Enabled        | `Adorn. End=true`, drop `<Eye>` / `<EyeClose>` `<Icon>`     | on (e.g. password rules)     | Toggle the `<Eye>` ↔ `<EyeClose>` glyph at instance level for the show/hide affordance.     |
| **Required field**      | Filled    | Medium | Enabled        | none                                                        | on (instructional copy)      | Append `*` to the `Label` value to mark required at design time — no separate variant.      |
| **Inline validation**   | (any)     | Medium | Error          | none                                                        | on (error message)           | Use `State=Error`; do not stack with `Focused`. Helper text retints to `seed/danger/main`.  |
| **Read-only / disabled**| Outlined  | Medium | Disabled       | none                                                        | optional                     | Pre-fill `Value` with the identifier; the entire cell collapses to the disabled tone.       |
| **Compact filter**      | Standard  | Small  | Enabled        | none                                                        | off                          | Use the un-floated label pattern (`Has Value=False`) when the filter has no current value.  |

When a future component set ships these as proper wrappers, add a §3.N matrix per wrapper and update §6 to document the wrapper grid alongside the atom grid.

### 7.3 Don'ts

- ❌ Don't detach the instance to recolor the underline / outline — pick the matching `State` variant.
- ❌ Don't stack `paint.opacity < 1` on top of `component/input/*/{enabledFill, hoverFill, enabledBorder, hoverBorder}` — Figma flattens to `opacity = 1` on instance creation.
- ❌ Don't add another `Placeholder` text node — the cell already carries one and toggling its visibility is a §8 trigger, not an instance override.
- ❌ Don't combine `State=Error` with `State=Focused` — the `State=Error` variant already encodes the resting + focused-error paint at the 2 px stroke level.
- ❌ Don't paint the adornment glyph with a hex — rebind the Vector's fill variable.
- ❌ Don't rely on the source `color` prop for accent — there is no Color axis today; raise a §8 sync before introducing one.

### 7.4 Open issues (drift)

These are tracked here so the next runtime-truth pass has a punch list:

1. **Outlined enabled border** — Figma binds `component/input/outlined/enabledBorder` (`0.12α`); MUI runtime is `0.23α`. Repoint the local token or mint a `mui-outline` companion.
2. **Outlined disabled border** — Figma binds `alias/colors/bg-disabled` (`0.12α`); MUI runtime is `0.26α` (`action.disabled`).
3. **Adornment glyph fill** — Figma binds `alias/colors/text-sub` (`0.6α`); MUI runtime is `action.active` (`0.54α`).
4. **Filled Focused fill** — Figma binds `component/input/filled/hoverFill` (`0.09α`); MUI runtime keeps `enabledFill` (`0.06α`) on focus. The Figma cell adds extra darkening on focus that MUI does not.
5. **Disabled Standard underline stroke style** — runtime is `1 px dotted`; Figma renders solid because no equivalent stroke style exists in the published surface.

## 8. Source Sync Rule

This document and the source must move together. When **any** of the following changes:

1. `src/stories/TextField.stories.tsx` (variants, args, adornment / helper-text wiring)
2. The Figma `<TextField>` component set at `1:6266` (variants, properties, token bindings)
3. The local `component/input/*` tokens documented in [`design-token.md`](./design-token.md), or the local `text/disabled`, `background/paper-elevation-0`, `input/label` variables
4. The shared `merak/seed/*`, `merak/alias/*` tokens consumed in §4.2 — particularly `seed/primary/main`, `seed/danger/main`, `alias/colors/{text-sub,text-default,text-disabled,bg-disabled}`
5. `.storybook/preview.tsx` (theme overrides via `createTheme`) — today this is an empty `createTheme()`; introducing typography / palette / `MuiTextField.defaultProps` overrides forces a re-measure
6. The shared `<Icon>` component set (`3:2722`) — variants added/removed/renamed, or the size-to-pixel mapping changes
7. `package.json` `@mui/material` peer / dev version (currently `^7.3.10` / peer `>=7`)

…this spec **must be updated in the same change**. Specifically:

- Introducing a `Color` axis (e.g. `color="success"`) → add §2.X.1 Color value mapping, add the `Color` variant in Figma, multiply variant count in §3, add per-color rows in §4.2.
- Adding `Pressed` to the `State` axis → update §3, add a row to §4.3.
- Changing the fixed `minRows` for `Multiline=True` (today `3`, contributing the `+46 px` wrapper-height delta) → update §2 mapping note, §3 matrix note, §4.1 Multiline rows, §6 row bands, §6.1 Multiline cell composition, and re-measure via `MultilineMatrix` in `storybook.render.md` §7.
- Adding `maxRows` as a Figma axis (e.g. capped multiline) → introduce a new variant property, multiply variant count in §3, document the cap in §4.1.
- Token rename / removal in `merak/alias/*` or `merak/seed/*` → update every reference in §2, §4, §10 and rename the matching variable in the local Figma collection.
- Token value change in `component/input/*` → no edit to this spec is required (Figma resolves through the same name); `design-token.md` records the resolution chain.
- Renaming the slot keys (`Start Adorn` / `End Adorn` / `Autocomplete`) or changing the adornment frame size from `24 × 24` → update §3.1, §5, §6.
- Surfacing the `Placeholder` property visibly (e.g. by adding a "no-label" sub-variant) → update §4.3, §7, and add the new variant axis in §3.
- Adding / removing / renaming a section in the `UseCase` panel (`1:6157`) — including a new Common-usage recipe → update §6.2's section table and §7.2's wrapper-recipe table in lockstep. Promoting any Common-usage recipe to a proper wrapper component set → add the wrapper to §1, give it its own §3.N matrix and §6 grid entry.
- `@mui/material` major bump → re-run `storybook.render.md` §7 drift checks; bump the version row in §1; reconcile any new computed-style values against §4.

## 9. Quick Reference

```ts
// Source surface (from `@mui/material` TextField, used directly in src/stories/TextField.stories.tsx)
type TextFieldProps = {
  variant?: 'standard' | 'filled' | 'outlined';            // → Figma `Variant`
  size?: 'small' | 'medium';                               // → Figma `Size`
  disabled?: boolean;                                      // → Figma `State=Disabled`
  error?: boolean;                                         // → Figma `State=Error`
  focused?: boolean;                                       // → Figma `State=Focused` (statically)
  label?: React.ReactNode;                                 // → Figma `Label` (TEXT)
  placeholder?: string;                                    // → Figma `Placeholder` (TEXT) — currently inert in every cell
  defaultValue?: unknown;                                  // → Figma `Has Value=True` + `Value` (TEXT)
  helperText?: React.ReactNode;                            // → Figma `Helper Text` (BOOLEAN) + `Helper Text Content` (TEXT)
  InputProps?: {
    startAdornment?: React.ReactNode;                      // → Figma `Adorn. Start` (BOOLEAN) + `Start Adorn` (SLOT)
    endAdornment?: React.ReactNode;                        // → Figma `Adorn. End`   (BOOLEAN) + `End Adorn`   (SLOT)
  };
  color?: 'primary' | 'secondary' | 'error' | …;           // not represented in Figma (no Color axis today)
  multiline?: boolean;                                     // → Figma `Multiline` (VARIANT). True ⇒ 3-row textarea (69 px content), wrapper +46 px.
  minRows?: number;                                        // Figma fixes `minRows=3` for every `Multiline=True` cell.
  maxRows?: number;                                        // not represented in Figma today (textarea can still grow past 3 at runtime).
};
```

```
Figma Component Set: <TextField>  (1:6266)
  Variant axes : Variant × Size × State × Has Value × Multiline
  Properties   : Label (TEXT), Placeholder (TEXT), Value (TEXT),
                 Adorn. Start (BOOLEAN), Start Adorn (SLOT),
                 Adorn. End   (BOOLEAN), End Adorn   (SLOT),
                 Helper Text (BOOLEAN), Helper Text Content (TEXT),
                 Autocomplete (SLOT)
  Default      : Variant=Standard, Size=Medium, State=Enabled, Has Value=True, Multiline=False
  Total        : 120 variants
```

## 10. Token Glossary

The complete set of tokens consumed by `<TextField>`. Names are **Figma variable paths**; bind every paint / stroke / text-fill to one of these — never to a literal value.

### 10.1 Seed tokens (`merak/seed/*`, from 天璇 file)

`<TextField>` consumes `primary` and `danger` only — there is no Color axis.

| Token               | Used by                                                    | Role                              |
| ------------------- | ---------------------------------------------------------- | --------------------------------- |
| `seed/primary/main` | Label + underline + outline on `State=Focused` (non-Error) | Focus accent (`#1976D2`)          |
| `seed/danger/main`  | Label + helper text + underline + outline on `State=Error` | Error accent (`#D32F2F`)          |

### 10.2 Alias tokens (`merak/alias/colors/*`)

| Token                         | Used by                                                                  | Role                              |
| ----------------------------- | ------------------------------------------------------------------------ | --------------------------------- |
| `alias/colors/text-default`   | Value text (Enabled / Hovered / Focused / Error)                         | `text.primary`, `0.87α`           |
| `alias/colors/text-sub`       | Label resting, helper text resting, adornment glyph                      | `text.secondary`, `0.6α`          |
| `alias/colors/text-disabled`  | Label + value + helper + adornment on `State=Disabled`                   | `text.disabled`, `0.38α`          |
| `alias/colors/bg-disabled`    | Standard / Filled disabled underline, Filled disabled wrapper, Outlined disabled border | `action.disabledBackground`, `0.12α` |

### 10.3 Component-scoped tokens (`component/input/*` — local to MUI-Library file)

Documented in detail in [`design-token.md`](./design-token.md). Listed here for completeness:

| Token                                      | Used by                                                | Role                                |
| ------------------------------------------ | ------------------------------------------------------ | ----------------------------------- |
| `component/input/standard/enabledBorder` | Standard + Filled underline (Enabled, Filled-Hovered)  | `0.42α` hairline (`#0000006B`)      |
| `component/input/standard/hoverBorder`   | Standard underline (Hovered)                           | `text.primary` 0.87α (`#000000DE`)  |
| `component/input/filled/enabledFill`     | Filled wrapper (Enabled, Error)                        | `0.06α` fill (`#0000000F`)          |
| `component/input/filled/hoverFill`       | Filled wrapper (Hovered, Focused)                      | `0.09α` fill (`#00000017`)          |
| `component/input/outlined/enabledBorder` | Outlined notched outline (Enabled)                     | `0.12α` stroke (`#0000001F`)        |
| `component/input/outlined/hoverBorder`   | Outlined notched outline (Hovered)                     | `text.primary` 0.87α (`#000000DE`)  |

### 10.4 Other local variables

These live in the MUI-Library file's local collection (not in `merak/*`) and are referenced by the cells:

| Token                          | Used by                                          | Role                                                  |
| ------------------------------ | ------------------------------------------------ | ----------------------------------------------------- |
| `text/disabled`                | Placeholder text node fill                       | `0.38α` placeholder color (same hex as `alias/colors/text-disabled` but a separate variable). Surfaces only when a future "no-label" variant displays the Placeholder. |
| `background/paper-elevation-0` | Outlined label-notch background                  | `#FFFFFF` — required so the floated label notches the Outlined border. |

### 10.5 Text styles & shape

- **Floated label** uses the published text style **`input/label`** (`Roboto Regular 12 / 12 px`, ls `0.15 px`).
- **Value / un-floated label / placeholder** use ad-hoc Roboto Regular `16 / 24 px`, ls `0.15 px` (no published text style).
- **Helper text** uses ad-hoc Roboto Regular `12 / 16.6 px`, ls `0.4 px`.
- **Wrapper corner radius** — Standard `0`, Filled `4 4 0 0`, Outlined `4`. Matches MUI `theme.shape.borderRadius = 4`.
- **Stroke widths** — `1 px` resting, `2 px` Focused / Error+Focused. No drop shadow, no focus ring; the stroke thickening is the only focus cue.

### 10.6 Typography (resolved values)

`<TextField>` consumes MUI defaults with no project override:

- Family: `Roboto, Helvetica, Arial, sans-serif`
- Weight: `Regular (400)`
- Value: `16 / 23 px` runtime (`16 / 24 px` Figma cell), ls `0.15 px`
- Floated label: `12 px` (text style `input/label`), lh `12 px`, ls `0.15 px`
- Helper text: `12 px`, lh `19.92 px` runtime / `16.6 px` Figma, ls `0.4 px`

If the project introduces typography tokens (e.g. `merak/typography/input-*`), update §4.1 and §10.6 to bind to them.

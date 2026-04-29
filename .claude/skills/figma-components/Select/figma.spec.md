---
name: figma-component-select-spec
description: Figma component specification for `<Select>` — design counterpart of the MUI `<Select>` (typically composed via `<TextField select>`) consumed by `src/stories/Select.stories.tsx`. Documents the variant matrix (Variant × Size × State × Has Value × Multiple), component properties (Label / Placeholder / Value / Helper Text + chevron / start adornment / chips slot), source-to-Figma mapping, and the token bindings that pin every fill / stroke / chevron / underline to a named local variable. Composes the published `<AutocompleteMenu>` (`534:7976`) when designers want to show the popper next to the trigger. For runtime measurements see `storybook.render.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '587:8542'
figma_component_set_id: '593:7633'
figma_companion_menu_set_id: '534:7976'
---

# `<Select>` Figma Component Specification

## 1. Overview

`<Select>` is the Figma counterpart of the MUI `<Select>` consumed in `src/stories/Select.stories.tsx`. The story renders `<TextField select>` (the canonical MUI Select recipe), so the trigger geometry is `<TextField>`'s — every variant / size / state / has-value cell is laid out identically. The Select-specific deltas are:

1. A **chevron indicator** (`<SelectArrow>` icon) absolutely positioned at the trailing edge of the trigger. The trigger reserves `24 px` (Standard) or `32 px` (Filled / Outlined) of `padding-right` for it.
2. The `Multiple` axis hides the single-line value text and leaves the Combobox row empty; designers drop `<Chip size="small">` instances into the empty row at instance level (no formal `Chips` SLOT property today — track in §8).
3. The chevron rotates `180°` when the menu is open; designers stamp the published `<AutocompleteMenu>` (`534:7976`) below the trigger on screens where the menu should be visible.

The package re-exports MUI directly — there is no in-repo wrapper. The Figma component encodes the runtime-relevant prop surface (`variant`, `size`, `disabled`, `error`, `focused`, `value`, `multiple`, `label`, `helperText`, `InputProps.startAdornment`).

This component is **brand-new on 2026-04-29**. Authored in place at the editable node `587:8542` (empty frame placeholder before authoring); the variant grid itself is the COMPONENT_SET `<Select>` `593:7633`, cloned from the `<TextField>` set (`1:6266`) and adapted (axis rename `Multiline` → `Multiple`, drop TextField-only properties, add Chevron INSTANCE_SWAP, rebind disabled strokes to `fg-disabled`, collapse Multiple=True cells to single-line). The reference-only siblings `<TextField>` outer frame (`1:6156`) and component set (`1:6266`) govern the trigger geometry / paint surface — the cells in this set must visually agree with the TextField cells at the matching `(Variant, Size, State, Has Value)` coordinates.

| Aspect            | Value                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| Source story      | `src/stories/Select.stories.tsx`                                                        |
| Underlying source | `@mui/material@^7.3.10` `Select` consumed via `<TextField select>` (no wrapper)         |
| Underlying MUI    | `@mui/material` `7.3.10` (resolved from `package.json` on 2026-04-29)                  |
| Figma file        | [MUI-Library](https://www.figma.com/design/KQjP6W9Uw1PN0iipwQHyYn) (`KQjP6W9Uw1PN0iipwQHyYn`) |
| Figma frame       | `<Select>` (`587:8542`) on page **Foundation Components** (`0:1`) at absolute `(13007.08, 9543)`, frame size `2926.95 × 3910.91 px` (matches the `<TextField>` reference frame) |
| Component Set     | `<Select>` (`593:7633`) inside the editable `<Select>` frame (`587:8542`) — variant grid published 2026-04-29 |
| Composed sets     | `<SelectArrow>` icon (`3:2900`) for the chevron · `<Chip>` (`342:7102`) for Multiple chip stamping at instance level · `<AutocompleteMenu>` (`534:7976`) for the popper recipe (instance-level) |
| Reference         | `<TextField>` outer frame (`1:6156`) + component set (`1:6266`) — visual sibling cloned and adapted; trigger paint must agree at every `(Variant, Size, State, Has Value)` coordinate. |
| Total variants    | **120** (3 Variants × 2 Sizes × 5 States × 2 Has Value × 2 Multiple)                    |
| Typography        | Roboto Regular, value `16 / 24 px` ls `0.15 px`; floated label text style `input/label` (`12 / 12 px`, ls `0.15 px`); helper text Roboto Regular `12 / 16.6 px`, ls `0.4 px` |
| Local-only bindings | **Required.** Every paint / stroke / effect resolves to a variable in this file's local collection. No `VariableID:<sharedKey>/...` consumed-library bindings are permitted. |

## 2. Source-to-Figma Property Mapping

| MUI prop                                                  | Figma property         | Type             | Notes                                                                                                              |
| --------------------------------------------------------- | ---------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `variant`                                                 | `Variant`              | VARIANT          | `Standard` / `Filled` / `Outlined` — defaults to `Outlined` per MUI source.                                        |
| `size`                                                    | `Size`                 | VARIANT          | `Medium` / `Small`                                                                                                 |
| _(`disabled` / `error` / `focused` / interaction)_        | `State`                | VARIANT          | `Enabled` / `Hovered` / `Focused` / `Disabled` / `Error`                                                           |
| _(controlled `value` present and non-empty)_              | `Has Value`            | VARIANT          | `True` = label floated + value rendered (or chips when `Multiple=True`); `False` = label sits inside trigger.       |
| `multiple`                                                | `Multiple`             | VARIANT          | `False` shows the single-line `Value` text node; `True` hides the `Value` text and leaves the Combobox row empty so designers stamp `<Chip size="small">` instances at instance level. The cell wrapper height stays at the single-line baseline. |
| `label`                                                   | `Label`                | TEXT             | Default `Label`. Bound to the floated label text node's `characters`.                                              |
| `value` / `defaultValue`                                  | `Value`                | TEXT             | Default `Option`. Rendered only when `Has Value=True` and `Multiple=False`.                                        |
| `helperText`                                              | `Helper Text` + `Helper Text Content` | BOOLEAN + TEXT | `Helper Text` toggles visibility of the `<FormHelperText>` row; `Helper Text Content` overrides the inner text (default `Helper text`). |
| `InputProps.startAdornment`                               | `Adorn. Start` + `Start Adorn` | BOOLEAN + SLOT  | `Adorn. Start` (note the period — matches `<TextField>`) toggles the leading slot; `Start Adorn` is a native Figma SLOT — designers drop any node into it at instance level. |
| `IconComponent`                                           | _(via `Chevron` slot)_ | INSTANCE_SWAP    | Default target `<SelectArrow>` (`3:2900`). Designers swap to `<ChevronDown>` (`512:7501`) on instances that prefer the keyboard-arrow glyph; the swap default is shared across every variant. |
| `open` / `defaultOpen` / `onOpen` / `onClose`             | _(no axis)_            | —                | The chevron rotation (`180°`) is a designer-driven instance-level transform — see §7.2 "Open menu recipe". The popper itself is the published `<AutocompleteMenu>` (`534:7976`), stamped below the trigger; no `Open` axis multiplies the matrix.                            |
| `MenuProps`                                               | _(via composed menu)_  | —                | Customisations land on the `<AutocompleteMenu>` instance dropped beside / below the trigger.                       |
| `renderValue`                                             | _(instance-level Chip stamping when `Multiple=True`)_ | — | No formal SLOT property today — designers drop `<Chip size="small">` (`342:7102`) instances into the empty Combobox row at instance level. Promote to a `Chips` SLOT property if multi-row chip wrapping becomes the dominant pattern (§8 trigger). |
| `displayEmpty`                                            | _(via `Has Value=True` + `Value=` empty)_ | — | The `Has Value` axis already lets designers show the floated label without a value; `displayEmpty` semantics fall out of that pairing. No dedicated axis.                          |
| `autoWidth` / `native` / `MenuProps.PaperProps.style.maxHeight` / `SelectDisplayProps` | — | — | Behavior-only, no design representation.                                              |
| `color`                                                   | —                      | —                | Wrapper forwards to MUI; Figma ships only the neutral + primary-tint surface today. Adding a `Color` axis is a §8 trigger. |
| `onChange`, rest native props                             | —                      | —                | Behavior-only, no design representation.                                                                           |

> **Slots are native `SLOT`, not `INSTANCE_SWAP`.** `Start Adorn` is a native Figma SLOT — designers drop any node (an `<Icon>` instance) at instance level. The chevron `Chevron` is **`INSTANCE_SWAP`** because it has a deterministic default (`<SelectArrow>` `3:2900`); the shared-default caveat applies — every variant of the host set inherits the same default target, so the placeholder must be benign across all 120 cells. Multiple-select chips are **not** a formal SLOT property today: `Multiple=True` cells leave the Combobox row empty; designers drop `<Chip>` instances into the row at instance level. Promote to a `Chips` SLOT property if needed (§8 trigger).
>
> **No `Adorn. End`.** The chevron occupies the trailing position; a trailing adornment slot would collide with it. Hosts that need a trailing adornment (e.g. clear button) compose at instance level by overlaying a node above the chevron.
>
> **No Color axis.** The component set publishes only the neutral + MUI-primary-tint paint surface, mirroring `<TextField>`. Adding `color="success"` (or other palette keys) requires introducing a `Color` axis; track in §8.

## 3. Variant Property Matrix

```
Variant × Size × State × Has Value × Multiple   =   3 × 2 × 5 × 2 × 2   =   120 variants
```

| Property    | Default value | Options                                                         |
| ----------- | ------------- | --------------------------------------------------------------- |
| `Variant`   | `Outlined`    | `Standard`, `Filled`, `Outlined` _(Outlined matches MUI's Select default)_ |
| `Size`      | `Medium`      | `Medium`, `Small`                                               |
| `State`     | `Enabled`     | `Enabled`, `Hovered`, `Focused`, `Disabled`, `Error`            |
| `Has Value` | `True`        | `True`, `False`                                                 |
| `Multiple`  | `False`       | `False`, `True` — `True` hides the `Value` text and leaves the Combobox row empty for designer-stamped chip instances at instance level (no formal SLOT property today). Wrapper height stays unchanged when a 1-row chip stack fits inside the existing combobox padding (the +1 px sub-pixel rounding observed at runtime is not encoded). Multi-row wrapping is a runtime-only growth path — see §7. |

> **`Pressed` is omitted.** MUI treats `:active` identically to `:focus` for Select (the focus accent persists while the click is in flight). Adding a Pressed state would double the matrix to 240 with no visual delta. Re-add per §8 if a distinct pressed paint is introduced.
>
> **`Error` does not stack with `Focused`.** MUI repaints the focus underline / outline at 2 px when `error && focused` — the `State=Error` Figma variant already encodes the resting error paint. Designers should not stack `Focused + Error`.
>
> **`Open` is not a variant axis.** Doubling the matrix to 240 for a single chevron rotation is not worth the cost — designers rotate the chevron node at instance level and stamp `<AutocompleteMenu>` below the trigger when they need to show the open state. See §7.2.

### 3.1 Component (non-variant) properties

Property names below are the human-readable keys; Figma's internal property ids carry a `#NNNN:N` suffix that is not stable across re-publishes — never reference the suffix outside frontmatter.

| Property key          | Type           | Default                    | Purpose                                                                                                                                          |
| --------------------- | -------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Label`               | TEXT           | `Label`                    | Label string bound to the floated label text node.                                                                                               |
| `Value`               | TEXT           | `Option`                   | Selected value string. Rendered only when `Has Value=True` and `Multiple=False`.                                                                  |
| `Adorn. Start`        | BOOLEAN        | `false`                    | Toggle the leading adornment slot.                                                                                                               |
| `Start Adorn`         | SLOT           | empty                      | Native Figma slot for the leading adornment. Designers drop any node (`<Icon>` instance is the convention).                                       |
| `Chevron`             | INSTANCE_SWAP  | `<SelectArrow>` (`3:2900`) | Trailing chevron icon. Default target is the filled-triangle `<SelectArrow>` (matches MUI's `ArrowDropDownIcon`). Designers swap to `<ChevronDown>` (`512:7501`) for the keyboard-arrow glyph.                            |
| `Helper Text`         | BOOLEAN        | `false`                    | Toggle the `<FormHelperText>` row below the trigger.                                                                                              |
| `Helper Text Content` | TEXT           | `Helper text`              | Inner text of the helper-text row. Overridable per instance.                                                                                     |

## 4. Design Tokens

All paints, strokes, and surfaces bind to local variables in the MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`). Hex values appear in this document only as reference resolutions of the light theme — bind to the token, not the hex. **Local-only**: every binding resolves to a variable in this file's own collection — never a `VariableID:<sharedKey>/<id>` from a consumed library. Tokens cited by name from the published `merak/seed/*` and `merak/alias/*` catalogue must already be minted as locals (or get minted before authoring) per the figma-create-component pipeline §4.

### 4.1 Sizing

`<Select>` does not override MUI defaults; the Figma cell heights mirror the runtime `getBoundingClientRect()` of `src/stories/Select.stories.tsx` (see `storybook.render.md` §1, §3, §4 for single-line; §6 for Multiple).

| Property                              | Standard   | Filled      | Outlined    |
| ------------------------------------- | ---------- | ----------- | ----------- |
| Cell width (preview)                  | `220 px`   | `220 px`    | `220 px`    |
| Cell height — Small                   | `45 px`    | `48 px`     | `40 px`     |
| Cell height — Medium                  | `48 px`    | `56 px`     | `56 px`     |
| Wrapper height — Small                | `29 px`    | `48 px`     | `40 px`     |
| Wrapper height — Medium               | `32 px`    | `56 px`     | `56 px`     |
| Wrapper corner radius                 | `0`        | `4 4 0 0`   | `4`         |
| Resting underline / border thickness  | `1 px`     | `1 px`      | `1 px`      |
| Focused underline / border thickness  | `2 px`     | `2 px`      | `2 px`      |
| Combobox padding — Medium (T R B L)   | `4 24 5 0` | `25 32 8 12`| `16.5 32 16.5 14` |
| Combobox padding — Small (T R B L)    | `1 24 5 0` | `21 32 4 12`| `8.5 32 8.5 14`   |
| Chevron slot dimensions               | `24 × 24`  | `24 × 24`   | `24 × 24`   |
| Chevron `right` offset                | `0 px`     | `7 px`      | `7 px`      |
| Chevron `top` offset — Medium         | `4 px`     | `16 px`     | `16 px`     |
| Chevron `top` offset — Small          | `1 px`     | `12 px`     | `8 px`      |
| Adornment slot (Figma)                | `24 × 24`  | `24 × 24`   | `24 × 24`   |
| Adornment → input gap                 | `8 px`     | `8 px`      | `8 px`      |
| Helper text padding-top               | `3 px`     | `3 px`      | `3 px`      |
| Helper text font / line-ht / ls       | `12 / 16.6 px / 0.4 px` Figma cell · `12 / 19.92 px / 0.4 px` runtime | same | same |
| Floated label text style              | `input/label` (`12 / 12 px`, ls `0.15 px`) | same | same |
| Value font / line-ht / ls             | `16 / 24 px / 0.15 px` Figma cell · `16 / 23 px / 0.15 px` runtime | same | same |
| Chip box (`<Chip size="small">`)      | `auto × 24`, radius `16 px` | same | same |
| Chip stack — direction / gap          | horizontal Auto Layout, `gap 4 px`, `wrap=enabled` | same | same |

Notes:

- The Filled / Outlined chevron `right` offset is `7 px` — the `MuiSelect-icon` is positioned absolutely with `right: 7 px` rather than aligning to the wrapper's content edge. Standard's chevron sits flush to the wrapper edge (`right: 0`) because Standard has no horizontal padding.
- The combobox padding's `right` value (`24` or `32 px`) reserves the chevron strip — the chevron does **not** consume content layout space, it overlaps the reserved padding region.
- Filled rounds only the top corners (`4 4 0 0`); the bottom is the underline. Outlined rounds all four corners (`4`). Standard has no radius.
- Floated label uses the published `input/label` text style (Roboto Regular `12 / 12 px`, ls `0.15 px`); Value uses `16 / 24 px`. Apply text styles by id, not by hand-setting `fontName` / `fontSize`.
- **Multiple wrapper height is unchanged from single-line for a 1-row chip stack.** The runtime adds `+1 px` rounding when chips are present (see `storybook.render.md` §6); the Figma cell ignores the sub-pixel delta. Multi-row wrapping (`>2` chips that overflow the row) grows the wrapper by `+24 px` per additional chip row at runtime — Figma encodes only the single-row baseline; designers manually resize the instance for multi-row layouts.

### 4.2 Token bindings

One row per paint role. Bind the Figma fill / stroke / text-fill to the variable name in **bold**.

| Role                                       | Token                                                                     | Notes                                                                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Label text — resting (Enabled / Hovered)   | **`alias/colors/text-sub`** _(`#000000 0.6α`)_                            | MUI `text.secondary`.                                                                                                          |
| Label text — Focused (non-Error)           | **`seed/primary/main`** _(`#1976D2`)_                                     |                                                                                                                                |
| Label text — Disabled                      | **`alias/colors/text-disabled`** _(`#000000 0.38α`)_                      | MUI `text.disabled`. Matches runtime `0.38α` exactly.                                                                          |
| Label text — Error                         | **`seed/danger/main`** _(`#D32F2F`)_                                      |                                                                                                                                |
| Value text                                 | **`alias/colors/text-default`** _(`#000000 0.87α`)_                       | MUI `text.primary`.                                                                                                            |
| Value text — Disabled                      | **`alias/colors/text-disabled`** _(`#000000 0.38α`)_                      | Same `text.disabled` as label.                                                                                                  |
| **Chevron icon — resting (Enabled / Hovered / Focused / Error)** | **`alias/colors/bg-active`** _(`#0000008A`, `0.54α`)_       | MUI `action.active`. Matches runtime exactly. The chevron does **not** retint to `seed/primary/main` on Focused or `seed/danger/main` on Error — only to the disabled token below. |
| **Chevron icon — Disabled**                | **`alias/colors/fg-disabled`** _(`#00000042`, `0.26α`)_                    | MUI `action.disabled`. Matches runtime `0.26α` exactly — distinct from `text-disabled` (`0.38α`) used for label / value text.   |
| Standard underline — Enabled               | **`component/input/standard/enabledBorder`** _(`#0000006B`, `0.42α`)_   | Local-only, shared with `<TextField>`.                                                                                          |
| Standard underline — Hovered               | **`component/input/standard/hoverBorder`** _(`#000000DE`, `0.87α`)_     | Standard darkens to `text.primary` on hover.                                                                                   |
| Standard underline — Focused (non-Error)   | **`seed/primary/main`** _(2 px)_                                          |                                                                                                                                |
| Standard underline — Disabled              | **`alias/colors/fg-disabled`** _(`#00000042`, `0.26α`)_                   | Matches runtime exactly. Resolves the TextField drift (`bg-disabled` `0.12α`) at the Select level — see §7 issue 3.            |
| Standard underline — Error                 | **`seed/danger/main`** _(1 px resting / 2 px focused-error)_              |                                                                                                                                |
| Filled wrapper — Enabled                   | **`component/input/filled/enabledFill`** _(`#0000000F`, `0.06α`)_       | Pre-alpha'd component-scoped token; do not stack `paint.opacity < 1`. Reused from `<TextField>`.                                |
| Filled wrapper — Hovered                   | **`component/input/filled/hoverFill`** _(`#00000017`, `0.09α`)_         | Slightly darker overlay.                                                                                                       |
| Filled wrapper — Focused                   | **`component/input/filled/enabledFill`** _(`#0000000F`, `0.06α`)_       | Matches runtime — the wrapper does **not** darken on focus (only the underline thickens). Resolves TextField's open drift (`<TextField>` §7 issue 4) at the Select level — see §7 issue 6. |
| Filled wrapper — Disabled                  | **`alias/colors/bg-disabled`** _(`#0000001F`, `0.12α`)_                   | MUI `action.disabledBackground`. Matches runtime exactly.                                                                       |
| Filled wrapper — Error                     | **`component/input/filled/enabledFill`**                                | Surface stays at the Enabled overlay; only underline retints to `seed/danger/main`.                                            |
| Filled underline — Enabled / Hovered       | **`component/input/standard/enabledBorder`** _(0.42α)_                  | Filled keeps the resting underline at `0.42α` even on Hovered (the wrapper darkens via `hoverFill`, not the underline).        |
| Filled underline — Focused                 | **`seed/primary/main`** _(2 px)_                                          |                                                                                                                                |
| Filled underline — Disabled                | **`alias/colors/fg-disabled`** _(0.26α)_                                   | Matches runtime exactly.                                                                                                        |
| Filled underline — Error                   | **`seed/danger/main`** _(1 px resting / 2 px focused-error)_              |                                                                                                                                |
| Outlined notched outline — Enabled         | **`component/input/outlined/enabledBorder`** _(`#0000001F`, `0.12α`)_   | Drift open vs runtime `0.23α` — see §7 issue 1. Shared with `<TextField>`.                                                     |
| Outlined notched outline — Hovered         | **`component/input/outlined/hoverBorder`** _(`#000000DE`, `0.87α`)_     | Matches MUI `text.primary` on hover.                                                                                           |
| Outlined notched outline — Focused         | **`seed/primary/main`** _(2 px)_                                          |                                                                                                                                |
| Outlined notched outline — Disabled        | **`alias/colors/fg-disabled`** _(`#00000042`, `0.26α`)_                   | Matches runtime exactly. Resolves the TextField Outlined-disabled drift at the Select level — see §7 issue 4.                  |
| Outlined notched outline — Error           | **`seed/danger/main`** _(1 px resting / 2 px focused-error)_              |                                                                                                                                |
| Outlined label-notch background            | **`background/paper-elevation-0`** _(`#FFFFFF`)_                          | Local variable. Required so the label-notch frame masks the outlined border at the label position.                             |
| Adornment glyph fill — resting             | **`alias/colors/bg-active`** _(`#0000008A`, `0.54α`)_                     | Matches runtime `action.active` exactly. Selects the same paint as the chevron — see §7 issue 5 for the mismatch with TextField's `text-sub` (`0.6α`). |
| Adornment glyph fill — Disabled            | **`alias/colors/fg-disabled`** _(`#00000042`, `0.26α`)_                   | Matches runtime exactly.                                                                                                        |
| Helper text — non-Error (Enabled / Hovered / Focused) | **`alias/colors/text-sub`**                                    |                                                                                                                                |
| Helper text — Disabled                     | **`alias/colors/text-disabled`**                                          | Helper text retints to disabled tone alongside label / value.                                                                  |
| Helper text — Error                        | **`seed/danger/main`**                                                    |                                                                                                                                |
| Chip stack (`Multiple=True`)               | _(via `<Chip>` instance — `342:7102`, dropped at instance level)_         | When `Multiple=True`, the cell hides the `Value` text and leaves the Combobox row empty. Designers drop `<Chip size="small">` instances into the empty row at instance level; chip paint roles bind via the published Chip's own variant axis. The cell does not formally expose a Chips SLOT property today (track in §8). |

> The `component/input/*` tokens are component-scoped aliases that already carry alpha; never pair them with a paint `opacity < 1` — Figma flattens on instance creation. See [`figma-component-spec-guide`](../../figma-component-spec-guide/SKILL.md) §4 for the stacking rule.

### 4.3 State rules

One row per state, columns per Variant. Bindings reference §4.2.

| State        | Standard                                                                                                  | Filled                                                                                                                         | Outlined                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Enabled**  | label `text-sub` · value `text-default` · chevron `bg-active` · underline `standard/enabledBorder` _(1 px)_ | label `text-sub` · value `text-default` · chevron `bg-active` · wrapper `filled/enabledFill` · underline `standard/enabledBorder` _(1 px)_ | label `text-sub` · value `text-default` · chevron `bg-active` · border `outlined/enabledBorder` _(1 px)_ |
| **Hovered**  | underline → `standard/hoverBorder` _(1 px, 0.87α)_ · chevron unchanged                                    | wrapper → `filled/hoverFill` · underline unchanged at `standard/enabledBorder` · chevron unchanged                              | border → `outlined/hoverBorder` _(1 px, 0.87α)_ · chevron unchanged                                     |
| **Focused**  | label → `seed/primary/main` · underline → `seed/primary/main` _(2 px)_ · chevron unchanged                | label → `seed/primary/main` · wrapper unchanged at `filled/enabledFill` · underline → `seed/primary/main` _(2 px)_ · chevron unchanged | label → `seed/primary/main` · border → `seed/primary/main` _(2 px)_ · chevron unchanged                  |
| **Disabled** | label + value + helper `text-disabled` · chevron `fg-disabled` · underline `fg-disabled` _(1 px)_         | label + value + helper `text-disabled` · chevron `fg-disabled` · wrapper `bg-disabled` · underline `fg-disabled`                | label + value + helper `text-disabled` · chevron `fg-disabled` · border `fg-disabled` _(1 px)_           |
| **Error**    | label + helper `seed/danger/main` · value `text-default` · chevron `bg-active` · underline `seed/danger/main` _(1 px / 2 px focused)_ | label + helper `seed/danger/main` · value `text-default` · chevron `bg-active` · wrapper unchanged (`filled/enabledFill`) · underline `seed/danger/main` | label + helper `seed/danger/main` · value `text-default` · chevron `bg-active` · border `seed/danger/main` _(1 px / 2 px focused)_ |

Notes:

- **The chevron retints only on Disabled.** Focused / Error keep the chevron at `bg-active` (`0.54α`). MUI keeps adornments / chevrons neutral on themed states; only label / underline / helper retint. A Figma cell that rebrands the chevron to `seed/primary/main` or `seed/danger/main` is a spec bug.
- **Disabled is color-family agnostic.** `text-disabled` (label / value / helper), `fg-disabled` (chevron / Standard underline / Outlined border), and `bg-disabled` (Filled wrapper) replace every themed paint, so `State=Disabled` is visually identical across Variants other than the wrapper fill (Filled gets the `bg-disabled` overlay; Standard / Outlined keep transparent).
- **`Has Value=False` is label-only at runtime.** When the field is empty and not focused, MUI un-shrinks the label and renders it inside the trigger; `<TextField select>` does not render a placeholder. The Figma cells follow this — every `Has Value=False` cell hides the floated `Label Container` and shows the un-floated label text inside `Combobox`. When `State=Focused`, the label always shrinks-and-floats regardless of `Has Value`.
- **`Multiple=True` hides the Value text and leaves the Combobox row empty.** Designers stamp `<Chip size="small">` (`342:7102`) instances into the empty row at instance level — there is no formal Chips SLOT property today (§7 / §8). When `Has Value=False && Multiple=True`, the un-floated label fills the trigger and no chips render. Multi-row chip wrapping is a runtime growth path — see §3 / §7 for the documented limitation.
- **Standard / Filled disabled underline is rendered solid, not `1 px dotted`.** Figma has no equivalent stroke style at the published surface. Track in §7 issue 2.

## 5. Icons (chevron + adornment slots)

| Slot            | Visibility prop  | Content prop  | Default visibility / target          | Frame dims | Node name      |
| --------------- | ---------------- | ------------- | ------------------------------------ | ---------- | -------------- |
| Trailing chevron | _(always visible)_ | `Chevron`   | `<SelectArrow>` (`3:2900`)           | `24 × 24`  | `Chevron`      |
| Start adornment | `Adorn. Start`   | `Start Adorn` | `false` / empty                       | `24 × 24`  | `Start Adorn`  |

- **Chevron slot** is `INSTANCE_SWAP` with default target `<SelectArrow>` (`3:2900`) — MUI's `ArrowDropDownIcon`. Designers swap to `<ChevronDown>` (`512:7501`) for the keyboard-arrow glyph; the swap default is shared across every variant of the host set, so a benign `<SelectArrow>` is the right choice.
- **Chevron fill**: bind the inner Vector fill of the swapped instance to `alias/colors/bg-active` (resting) or `alias/colors/fg-disabled` (Disabled). Do not paint with hex.
- **Open-state rotation**: rotate the chevron node by `180°` at instance level when stamping with the menu open (see §7.2). The slot itself does not encode rotation — it stays a `0°` instance and designers transform per-cell.
- **Start adornment slot** is a native Figma `SLOT` (not `INSTANCE_SWAP`). Designers drop any node into the slot at instance level — typically an instance of the shared `<Icon>` component set (`3:2722`). There is no shared default to maintain at the component-set level.
- **Slot dimensions**: `24 × 24 px` for both `Size=Small` and `Size=Medium`. Keeping the slot uniform avoids two adornment ramps; the host trigger shrinks vertically on Small but the icon frame stays.

## 6. Layout

The Component Set `<Select>` (`593:7633`) inside the editable `<Select>` frame (`587:8542`) is laid out as a **6-column × 20-row grid**:

- **Columns** (left → right) — `Variant × Size`: Standard·Medium, Standard·Small, Filled·Medium, Filled·Small, Outlined·Medium, Outlined·Small. Column origins x = `{24, 260, 496, 732, 968, 1204}`; column stride `236 px` (`220 px` cell + `16 px` gap). Mirrors the `<TextField>` grid exactly.
- **Row bands** (top → bottom) — `State × Has Value × Multiple`. The grid is the `Multiple=False` block (10 rows, identical to the TextField publication) followed immediately by the `Multiple=True` block (10 more rows in the same `State × Has Value` order):
  - `Multiple=False` block:
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
  - `Multiple=True` block (repeats the State × Has Value order):
    - Enabled · True · Multiple
    - Enabled · False · Multiple
    - Hovered · True · Multiple
    - Hovered · False · Multiple
    - Focused · True · Multiple
    - Focused · False · Multiple
    - Disabled · True · Multiple
    - Disabled · False · Multiple
    - Error · True · Multiple
    - Error · False · Multiple
- Row vertical strides reflect cell heights from §4.1; the `Has Value=False` rows collapse to the un-shrunk-label height, identical to the `<TextField>` `Has Value=False` cells.
- Frame dimensions grow proportionally — adding the Multiple block doubles the row count; the frame's `height` matches the `<TextField>` frame (`≈ 3910 px` based on the editable node's published dimensions). The exact value is whatever the Auto Layout pack produces; do not hard-code.

The outer frame `<Select>` (`587:8542`) houses the variant grid (component set `593:7633`); the sibling `<TextField>` outer frame (`1:6156`) provides the visual reference and a `UseCase` documentation panel (`1:6157`) for the input surface. The Select frame deliberately does **not** ship its own UseCase panel today; recipes live in §7.2 instead. Promote to a UseCase panel once the wrapper recipes settle (§8 trigger).

### 6.1 Cell composition

Every single-line cell follows the same nested structure (the canonical reference is the `Variant=Outlined, Size=Medium, State=Enabled, Has Value=True, Multiple=False` cell):

- `Input` (FRAME) — wrapper with the variant fill (Filled) or transparent (Standard / Outlined) and the notched outline (Outlined).
  - `Label` (FRAME) — sub-frame holding the un-floated label text node (visible when `Has Value=False`).
  - `Combobox` (FRAME) — row containing the start slot, value text node (hidden when `Multiple=True`), un-floated `Label` text node, and the trailing reserved-padding region.
  - `Underline` (LINE) — the `1 px` / `2 px` underline element. Outlined cells keep the LINE node but mask it behind the notched outline.
- `Chevron` (INSTANCE) — absolute-positioned at the trailing edge of `Input`. Default target `<SelectArrow>` (`3:2900`); rotated `180°` at instance level for open-menu cells (§7.2).
- `Label Container` (FRAME) — overlay holding the floated label text (visible when `Has Value=True` or `State=Focused`). Painted with `background/paper-elevation-0` so it can sit on top of the Outlined border to create the notch effect.
- `Helper Text` (FRAME) — visible only when `Helper Text=true`.

The dual-label pattern (un-floated `Label` text inside `Combobox` + floated `Label` text inside `Label Container`) is what lets variant overrides toggle which label is visible without rewriting the text node. Designers should override `Label` once on the instance — both copies are wired to the same component property.

#### Multiple cell composition (`Multiple=True`)

`Multiple=True` cells reuse the entire `Multiple=False` structure verbatim — no new nodes, no new paint roles — but the `Combobox` row hides the `Value` text node so designers stamp `<Chip size="small">` instances at instance level:

- `Input` (FRAME) — same wrapper paint / stroke / corner radius as the `Multiple=False` sibling at the same `(Variant, Size, State, Has Value)`. Wrapper height matches the `Multiple=False` baseline (single-row chip stack).
- `Combobox` (FRAME) — same padding / typography. The `Value` text node is hidden; the row is left empty so designers stamp `<Chip size="small">` instances at instance level (no formal SLOT property — track in §8). When `Has Value=False`, the row stays empty and the un-floated `Label` text fills the trigger.
- Adornment / chevron / underline / fieldset border / `Label Container` / `Helper Text` — unchanged.

The single design choice was whether to encode the chip stack as part of the cell (default-stamped chip instances or a formal SLOT) or as instance-level designer composition. The current build chose the latter: `Multiple=True` cells leave the Combobox row empty, and designers stamp `<Chip size="small">` (`342:7102`) instances per host data. Promote to a formal SLOT property (or stamp a default 2-chip baseline) if it becomes the dominant pattern (§8 trigger).

## 7. Usage Guidelines

### 7.1 Picking a variant

1. Match `variant` from MUI to the Figma `Variant` axis (`standard` → `Standard`, etc.). Default is `Outlined` — matches MUI Select's default.
2. Match `size` to the Figma `Size` axis.
3. Pick `State`:
   - `Enabled` for resting production screens.
   - `Hovered` / `Focused` only when illustrating interaction flows.
   - `Disabled` for `disabled={true}`.
   - `Error` for `error={true}` — do **not** stack with `Focused`.
4. Pick `Has Value`:
   - `True` when the field carries a value — override the `Value` text property (or stamp chips for `Multiple=True`); label floats.
   - `False` when the field is empty — label sits inside the trigger.
5. Pick `Multiple`:
   - `False` (default) for single-select dropdowns.
   - `True` when the source passes `multiple={true}` — the cell hides the `Value` text and leaves the Combobox row empty. Drop `<Chip size="small">` (`342:7102`) instances into the empty row at instance level, one per selected option. Multi-row wrapping is a runtime-only growth path — for screens that show >2 chips per row, manually grow the instance height (a §8 trigger if it becomes the dominant pattern).
6. Toggle `Adorn. Start` only when the source passes `InputProps.startAdornment`. With the slot visible, drop a glyph into `Start Adorn` (instance of the shared `<Icon>` set is the convention).
7. Swap `Chevron` only when the design system mandates the `<ChevronDown>` keyboard-arrow glyph instead of MUI's `<SelectArrow>` (filled triangle).
8. Toggle `Helper Text` only when the source passes `helperText`; override `Helper Text Content` for the inner text.

### 7.2 Wrapper recipes (informative)

The Figma component set has no wrapper components today — every recipe below is a hand-composed instance of the set + adjacent published components.

| Recipe                  | Variant   | Size   | State          | Adornment / Chevron                                              | Helper Text                  | Notes                                                                                       |
| ----------------------- | --------- | ------ | -------------- | ----------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| **Filter dropdown**     | Outlined  | Medium | Enabled        | none                                                              | off                          | `Has Value=True`, override `Value` to the active filter label.                               |
| **Open menu**           | Outlined  | Medium | Focused        | rotate `Chevron` instance by `180°`                               | off                          | Below the trigger, stamp `<AutocompleteMenu>` (`534:7976`) with `gap: 0`. The popper carries its own paint surface. |
| **Multi-select chips**  | Outlined  | Medium | Enabled        | drop 2× `<Chip size="small">` into the empty Combobox row         | off                          | `Multiple=True`, `Has Value=True`. For `>2` chips per row, grow the instance manually.       |
| **Required field**      | Filled    | Medium | Enabled        | none                                                              | on (instructional copy)      | Append `*` to the `Label` value to mark required at design time — no separate variant.      |
| **Inline validation**   | (any)     | Medium | Error          | none                                                              | on (error message)           | Use `State=Error`; do not stack with `Focused`. Helper text retints to `seed/danger/main`.  |
| **Read-only / disabled**| Outlined  | Medium | Disabled       | none                                                              | optional                     | Pre-fill `Value`; entire cell collapses to the disabled tone.                               |
| **Compact dropdown**    | Standard  | Small  | Enabled        | none                                                              | off                          | Use the un-floated label pattern (`Has Value=False`) when the dropdown has no current value. |

When a future component set ships these as proper wrappers, add a §3.N matrix per wrapper and update §6 to document the wrapper grid alongside the atom grid.

### 7.3 Don'ts

- ❌ Don't detach the instance to recolor the chevron — pick the matching `State` variant or override the chevron's bound fill at instance level.
- ❌ Don't stack `paint.opacity < 1` on top of `component/input/*/{enabledFill, hoverFill, enabledBorder, hoverBorder}` — Figma flattens to `opacity = 1` on instance creation.
- ❌ Don't combine `State=Error` with `State=Focused` — the `State=Error` variant already encodes the resting + focused-error paint at the 2 px stroke level.
- ❌ Don't rebrand the chevron to `seed/primary/main` on Focused or `seed/danger/main` on Error — MUI keeps it neutral at `action.active`.
- ❌ Don't paint the chevron with a hex — rebind the Vector's fill variable.
- ❌ Don't add a focus ring on the wrapper — only the underline / outline thickens (1 → 2 px).
- ❌ Don't rely on the source `color` prop for accent — there is no Color axis today; raise a §8 sync before introducing one.
- ❌ Don't author your own popper — use the published `<AutocompleteMenu>` (`534:7976`). Hand-drawing a Paper + listbox loses the published shadow / option-row paints.
- ❌ Don't drop a trailing adornment — there is no `Adorn. End` slot; the chevron occupies the trailing position. Hosts that need a clear button overlay it manually at instance level (a §8 trigger if it becomes a recurring pattern).

### 7.4 Open issues (drift)

These are tracked here so the next runtime-truth pass has a punch list:

1. **Outlined enabled border** — Figma binds `component/input/outlined/enabledBorder` (`0.12α`); MUI runtime is `0.23α`. Inherited from `<TextField>` — repointing this token to `0.23α` (or minting a `mui-outline` companion) closes the drift for both components.
2. **Standard / Filled disabled underline stroke style** — runtime is `1 px dotted`; Figma renders solid because no equivalent stroke style exists in the published surface. Same drift as `<TextField>`.
3. **Standard disabled underline alpha** — Select binds `alias/colors/fg-disabled` (`0.26α`); `<TextField>` binds `alias/colors/bg-disabled` (`0.12α`). Select matches runtime exactly; TextField carries the drift. Resolving consistently means rebinding TextField too — track in `<TextField>` §7 issue 5 alongside.
4. **Outlined disabled border alpha** — Select binds `alias/colors/fg-disabled` (`0.26α`); `<TextField>` binds `alias/colors/bg-disabled` (`0.12α`). Same shape as issue 3.
5. **Adornment glyph fill** — Select binds `alias/colors/bg-active` (`0.54α`) for the `Start Adorn` glyph; `<TextField>` currently binds `alias/colors/text-sub` (`0.6α`). Select matches MUI runtime exactly; TextField carries the drift. The Start Adorn slot is shared semantics — rebind TextField to `bg-active` to close.
6. **Filled Focused fill** — Select binds `component/input/filled/enabledFill` (`0.06α`) on Focused (matches runtime); `<TextField>` binds `component/input/filled/hoverFill` (`0.09α`). Resolving consistently means rebinding TextField — track in `<TextField>` §7 issue 4.
7. **Composed `<AutocompleteMenu>` elevation mismatch** — MUI Select's Menu uses MD elevation `8`; the published `<AutocompleteMenu>` uses elevation `1`. When a screen stamps `<AutocompleteMenu>` below a Select trigger, the popper renders at the wrong elevation. Either mint a `<SelectMenu>` companion at `material-design/shadows/shadows-8`, or accept the visual divergence with `<AutocompleteMenu>` and document it on the screen.
8. **Composed `<AutocompleteMenu>` Selected MenuItem alpha mismatch** — runtime Select MenuItem `Mui-selected` is `primary × ≈0.16α`; `<AutocompleteOption>` Selected is `primary × 0.08α` (`+0.04α` Selected+Focused). Tied to issue 7 — either a dedicated `<SelectMenu>` companion or accept the divergence.
9. **Multiple multi-row growth** — Figma encodes the single-row chip baseline only; runtime grows the wrapper by `+24 + 4 px` per additional chip row. Designers manually resize instances for multi-row layouts. Promote to a `Chip Rows` BOOLEAN / VARIANT axis if it becomes the dominant pattern (§8 trigger).

## 8. Source Sync Rule

This document and the source must move together. When **any** of the following changes:

1. `src/stories/Select.stories.tsx` (variants, args, chip rendering, chevron / helper-text wiring)
2. The Figma `<Select>` component set at `587:8542` (variants, properties, token bindings, layout)
3. The local `component/input/*` tokens documented in `<TextField>`'s [`design-token.md`](../TextField/design-token.md), or the local `background/paper-elevation-0` variable / `input/label` text style
4. The shared `merak/seed/*`, `merak/alias/*` tokens consumed in §4.2 — particularly `seed/primary/main`, `seed/danger/main`, `alias/colors/{text-sub,text-default,text-disabled,bg-disabled,bg-active,fg-disabled}`
5. `.storybook/preview.tsx` (theme overrides via `createTheme`) — today this is an empty `createTheme()`; introducing typography / palette / `MuiSelect.defaultProps` overrides forces a re-measure
6. The published `<SelectArrow>` (`3:2900`), `<ChevronDown>` (`512:7501`), `<Chip>` (`342:7102`), `<Icon>` (`3:2722`), or `<AutocompleteMenu>` (`534:7976`) component sets — variants added/removed/renamed, or the size-to-pixel mapping changes
7. The reference-only `<TextField>` frame at `1:6156` / component set at `1:6266` — Select inherits its trigger geometry / state paint, so a TextField change must propagate here in lockstep
8. `package.json` `@mui/material` peer / dev version (currently `^7.3.10` / peer `>=7`)

…this spec **must be updated in the same change**. Specifically:

- Introducing a `Color` axis (e.g. `color="success"`) → add §2.X.1 Color value mapping, add the `Color` variant in Figma, multiply variant count in §3, add per-color rows in §4.2.
- Adding `Open` as a Figma axis → multiply the matrix in §3 by 2 (240 cells), add chevron-rotated bindings in §4.3, document the menu composition in §6 / §7.2.
- Adding `Pressed` to the `State` axis → update §3, add a row to §4.3.
- Promoting `Chip Rows` (single-row vs multi-row) to a Figma property → introduce a new variant property, multiply variant count in §3, document the per-row height growth in §4.1 / §6.
- Token rename / removal in `merak/alias/*` or `merak/seed/*` → update every reference in §2, §4, §10 and rename the matching variable in the local Figma collection.
- Token value change in `component/input/*` → no edit to this spec is required (Figma resolves through the same name); `<TextField>`'s `design-token.md` records the resolution chain.
- Renaming the slot key (`Start Adorn`) or the chevron INSTANCE_SWAP key (`Chevron`), or changing the chevron / adornment frame size from `24 × 24` → update §3.1, §5, §6. (Promoting Multiple chip stamping to a formal `Chips` SLOT property is its own listed trigger below.)
- Surfacing a `Placeholder` property visibly (e.g. by adding a "no-label" sub-variant) → update §4.3, §7, and add the new variant axis in §3.
- Adding a trailing adornment slot (`Adorn. End` + `End Adorn`) — collides with the chevron's reserved padding region → update §2, §3.1, §4.1, §6.1; reduce / re-arrange the chevron `right` offset.
- Promoting the open-menu recipe to a wrapper component set (e.g. `<SelectWithMenu>`) → add a §3.N matrix per wrapper and update §6 to document the wrapper grid.
- Closing drift issue 7 by minting `<SelectMenu>` (Paper at `shadows-8`, MenuItem with Select-specific Selected alpha) → add the new companion to §1 Aspect table, reference it in §7.2 instead of `<AutocompleteMenu>`.
- `@mui/material` major bump → re-run `storybook.render.md` drift checks; bump the version row in §1; reconcile any new computed-style values against §4.

## 9. Quick Reference

```ts
// Source surface (from `@mui/material` Select / TextField select, used directly in src/stories/Select.stories.tsx)
type SelectProps<Value = unknown> = {
  variant?: 'standard' | 'filled' | 'outlined';            // → Figma `Variant` (default 'outlined')
  size?: 'small' | 'medium';                               // → Figma `Size`
  disabled?: boolean;                                      // → Figma `State=Disabled`
  error?: boolean;                                         // → Figma `State=Error`
  focused?: boolean;                                       // → Figma `State=Focused` (statically)
  label?: React.ReactNode;                                 // → Figma `Label` (TEXT)
  defaultValue?: Value;                                    // → Figma `Has Value=True` + `Value` (TEXT) when not Multiple
  multiple?: boolean;                                      // → Figma `Multiple` (VARIANT). True ⇒ Value text hidden; designers stamp <Chip> at instance level.
  helperText?: React.ReactNode;                            // → Figma `Helper Text` (BOOLEAN) + `Helper Text Content` (TEXT)
  IconComponent?: React.ElementType;                       // → Figma `Chevron` (INSTANCE_SWAP, default <SelectArrow>)
  InputProps?: {
    startAdornment?: React.ReactNode;                      // → Figma `Adorn. Start` (BOOLEAN) + `Start Adorn` (SLOT)
  };
  open?: boolean;                                          // not a Figma axis — designers rotate the chevron + stamp <AutocompleteMenu> for open-state recipes (see §7.2)
  renderValue?: (value: Value) => React.ReactNode;         // → no formal Figma SLOT today — designers stamp <Chip> instances into the empty Combobox row at instance level
  color?: 'primary' | 'secondary' | 'error' | …;           // not represented in Figma (no Color axis today)
};
```

```
Figma Component Set: <Select>  (587:8542) — published 2026-04-29
  Variant axes : Variant × Size × State × Has Value × Multiple
  Properties   : Label (TEXT), Value (TEXT),
                 Adorn. Start (BOOLEAN), Start Adorn (SLOT),
                 Chevron (INSTANCE_SWAP, default <SelectArrow> 3:2900),
                 Helper Text (BOOLEAN), Helper Text Content (TEXT)
                 (Multiple=True cells leave the Combobox row empty — Chip instances dropped at instance level; no formal Chips SLOT property today)
  Default      : Variant=Outlined, Size=Medium, State=Enabled, Has Value=True, Multiple=False
  Total        : 120 variants
  Companions   : <AutocompleteMenu> (534:7976) — popper recipe; <Chip> (342:7102) — multi-select chips;
                 <SelectArrow> (3:2900) / <ChevronDown> (512:7501) — chevron glyphs
```

## 10. Token Glossary

The complete set of tokens consumed by `<Select>`. Names are **Figma variable paths**; bind every paint / stroke / text-fill to one of these — never to a literal value.

### 10.1 Seed tokens (`merak/seed/*`)

`<Select>` consumes `primary` and `danger` only — there is no Color axis.

| Token               | Used by                                                    | Role                              |
| ------------------- | ---------------------------------------------------------- | --------------------------------- |
| `seed/primary/main` | Label + underline + outline on `State=Focused` (non-Error) | Focus accent (`#1976D2`)          |
| `seed/danger/main`  | Label + helper text + underline + outline on `State=Error` | Error accent (`#D32F2F`)          |

### 10.2 Alias tokens (`merak/alias/colors/*`)

| Token                         | Used by                                                                  | Role                              |
| ----------------------------- | ------------------------------------------------------------------------ | --------------------------------- |
| `alias/colors/text-default`   | Value text (Enabled / Hovered / Focused / Error)                         | `text.primary`, `0.87α`           |
| `alias/colors/text-sub`       | Label resting, helper text resting                                        | `text.secondary`, `0.6α`          |
| `alias/colors/text-disabled`  | Label + value + helper on `State=Disabled`                               | `text.disabled`, `0.38α`          |
| `alias/colors/bg-active`      | Chevron resting (Enabled / Hovered / Focused / Error) · Start adornment glyph fill | `action.active`, `0.54α`          |
| `alias/colors/fg-disabled`    | Chevron Disabled · Start adornment Disabled · Standard / Filled disabled underline · Outlined disabled border | `action.disabled`, `0.26α` |
| `alias/colors/bg-disabled`    | Filled disabled wrapper                                                   | `action.disabledBackground`, `0.12α` |

### 10.3 Component-scoped tokens (`component/input/*` — local to MUI-Library file, shared with `<TextField>`)

Documented in detail in [`<TextField>`'s `design-token.md`](../TextField/design-token.md). `<Select>` does **not** mint any new component-scoped tokens — every paint role resolves through the catalogue alias / seed family or the existing `component/input/*` tokens.

| Token                                      | Used by                                                | Role                                |
| ------------------------------------------ | ------------------------------------------------------ | ----------------------------------- |
| `component/input/standard/enabledBorder` | Standard + Filled underline (Enabled, Filled-Hovered)  | `0.42α` hairline (`#0000006B`)      |
| `component/input/standard/hoverBorder`   | Standard underline (Hovered)                           | `text.primary` 0.87α (`#000000DE`)  |
| `component/input/filled/enabledFill`     | Filled wrapper (Enabled, Focused, Error)               | `0.06α` fill (`#0000000F`)          |
| `component/input/filled/hoverFill`       | Filled wrapper (Hovered)                               | `0.09α` fill (`#00000017`)          |
| `component/input/outlined/enabledBorder` | Outlined notched outline (Enabled)                     | `0.12α` stroke (`#0000001F`)        |
| `component/input/outlined/hoverBorder`   | Outlined notched outline (Hovered)                     | `text.primary` 0.87α (`#000000DE`)  |

### 10.4 Other local variables

These live in the MUI-Library file's local collection (not in `merak/*`) and are referenced by the cells:

| Token                          | Used by                                          | Role                                                  |
| ------------------------------ | ------------------------------------------------ | ----------------------------------------------------- |
| `background/paper-elevation-0` | Outlined label-notch background                  | `#FFFFFF` — required so the floated label notches the Outlined border. |

### 10.5 Text styles & shape

- **Floated label** uses the published text style **`input/label`** (`Roboto Regular 12 / 12 px`, ls `0.15 px`).
- **Value / un-floated label** use ad-hoc Roboto Regular `16 / 24 px`, ls `0.15 px` (no published text style).
- **Helper text** uses ad-hoc Roboto Regular `12 / 16.6 px`, ls `0.4 px`.
- **Chip text** uses Roboto Regular `13 / 19.5 px`, ls `0.16 px` — applied via the published `<Chip size="small">` component, not hand-set on the Select cell.
- **Wrapper corner radius** — Standard `0`, Filled `4 4 0 0`, Outlined `4`. Matches MUI `theme.shape.borderRadius = 4`.
- **Stroke widths** — `1 px` resting, `2 px` Focused / Error+Focused. No drop shadow, no focus ring; the stroke thickening is the only focus cue.

### 10.6 Typography (resolved values)

`<Select>` consumes MUI defaults with no project override:

- Family: `Roboto, Helvetica, Arial, sans-serif`
- Weight: `Regular (400)`
- Value: `16 / 23 px` runtime (`16 / 24 px` Figma cell), ls `0.15 px`
- Floated label: `12 px` (text style `input/label`), lh `12 px`, ls `0.15 px`
- Helper text: `12 px`, lh `19.92 px` runtime / `16.6 px` Figma, ls `0.4 px`
- Chip text (`size=small`): `13 / 19.5 px`, ls `0.16 px` (via published `<Chip>` component)

If the project introduces typography tokens (e.g. `merak/typography/input-*`), update §4.1 and §10.6 to bind to them.

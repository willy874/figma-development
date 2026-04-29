---
name: figma-component-autocomplete-spec
description: Figma component specification for `<Autocomplete>` — design counterpart of the MUI `<Autocomplete>` consumed by `src/stories/Autocomplete.stories.tsx`. Composes the published `<TextField>` (`1:6266`) for the input row, then layers Autocomplete-specific surfaces (popup-arrow + clear icons in the end-adornment slot, tag chips inside the wrapper for `multiple`, and a sibling popper / listbox / option set when `open=true`). Documents the variant matrix (Variant × Size × State × Multiple), the source-to-Figma mapping, layout, and token bindings. For component-scoped tokens see `design-token.md` in this directory; for runtime measurements see `storybook.render.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '450:7671'
figma_component_set_id: '450:7671'
figma_companion_option_set_id: '439:7109'
---

# `<Autocomplete>` Figma Component Specification

## 1. Overview

`<Autocomplete>` is the Figma counterpart of the MUI `<Autocomplete>` consumed in `src/stories/Autocomplete.stories.tsx`. The package re-exports MUI directly — there is no in-repo wrapper — so the Figma component encodes the MUI prop surface (`disabled`, `error` via the input's `<TextField>`, `multiple`, `open`, `disableClearable`, `loading`) plus three composed surfaces that MUI builds on top of `<TextField>`:

1. **Input row** — a published instance of `<TextField>` (`1:6266`) wired so its `Variant`, `Size`, and `State` axes are exposed at the Autocomplete instance level. Every paint / stroke / typography on the input row is inherited verbatim from the `<TextField>` component set; no paint duplication.
2. **End-adornment buttons** — two `<IconButton>`-shaped slots (popup arrow + clear icon) dropped into the `<TextField>` `End Adorn` SLOT. Glyphs come from the shared `<Icon>` set (`SelectArrow` `3:2900`, `Close` `3:2759`).
3. **Tag chips** — when `Multiple=True`, instances of `<Chip>` (`342:7102`) sized `small` (default) or `medium` flow inside the input wrapper between the start-adornment slot and the end-adornment buttons. Pixel-perfect dimensions come from the `<Chip>` component set; Autocomplete only owns the wrapping flex and per-chip margins (`2 px` for small, `3 px` for medium).
4. **Popper / listbox / option** — when `Open=True`, a sibling Auto-Layout frame sits below the input rendering the dropdown listbox. Background paint = `background/paper-elevation-0`; effect style = `material-design/shadows/shadows-1`; option rows are a separate `<AutocompleteOption>` companion component documented in §5.

The component lives in the same MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`) as `<TextField>` / `<Chip>`. Frontmatter `figma_node_id` and `figma_component_set_id` are blank until step 5 of `figma-create-component` publishes the set; update them in the same change.

| Aspect            | Value                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| Source story      | `src/stories/Autocomplete.stories.tsx`                                                 |
| Underlying source | `@mui/material@^7.3.10` `Autocomplete` (re-exported by this package, no wrapper)       |
| Underlying MUI    | `@mui/material` `7.3.10` (resolved from `package.json` on 2026-04-29)                  |
| Figma file        | [MUI-Library](https://www.figma.com/design/KQjP6W9Uw1PN0iipwQHyYn) (`KQjP6W9Uw1PN0iipwQHyYn`) |
| Figma frame       | `<Autocomplete>` (`450:7671`) on page **Foundation Components** (`0:1`), positioned to the right of the `<TextField>` frame (`1:6156`) at `x=12745, y=9545`. |
| Component Set     | `<Autocomplete>` (`450:7671`)                                                           |
| Composed sets     | `<TextField>` (`1:6266`), `<Chip>` (`342:7102`), `<Icon>` (`3:2722`)                    |
| Companion sets    | `<AutocompleteOption>` (`439:7109`) — separate component for each option row (§5)       |
| Total variants    | **12 published today** (3 Variants × 4 States, Size=Medium, Has Value=True, Multiple=False). The full **48-variant target** (3 × 2 × 4 × 2) — adding Size=Small, Has Value=False, and Multiple=True — is tracked as a §8 expansion trigger; the spec describes the full surface so future authors land at the right matrix. `Open` / `Has Value` / `Loading` / `Clear Icon` are encoded as BOOLEAN component properties, not variant axes — see §3. |
| Typography        | Inherited from `<TextField>` (Roboto Regular, value `16 / 24 px`, ls `0.15 px`); Option text uses `body1` (`16 / 24 px`); chip label inherits from `<Chip>` (`13 / 19.5 px`) |
| Local-only bindings | **Required.** Every paint / stroke / effect resolves to a variable in this file's local collection. No `VariableID:<sharedKey>/...` consumed-library bindings are permitted (component must be self-contained). |

## 2. Source-to-Figma Property Mapping

| MUI prop                                                       | Figma property         | Type             | Notes                                                                                                              |
| -------------------------------------------------------------- | ---------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `renderInput` → `<TextField variant>`                          | `Variant`              | VARIANT          | `Standard` / `Filled` / `Outlined` — forwarded to the nested `<TextField>` instance via instance property.         |
| `size` (forwarded to TextField + chip sizing)                  | `Size`                 | VARIANT          | `Medium` / `Small`. Drives both the nested `<TextField>` `Size` and the tag chip sizing — see §3 / §6.             |
| _(`disabled` / `error` / `focused` on the TextField)_          | `State`                | VARIANT          | `Enabled` / `Focused` / `Disabled` / `Error`. Drops Hovered: TextField's spec already documents the hover paint and Autocomplete adds no new hover surface; designers can pick `<TextField>` Hovered directly when needed. |
| `multiple`                                                     | `Multiple`             | VARIANT          | `False` = single value (text node inside input); `True` = chip row (`<Chip>` instances) inside input.              |
| `open`                                                         | `Open`                 | BOOLEAN          | Toggles visibility of the popper sub-frame below the input. Default `False`. The popper is part of the same instance — designers don't need to attach a sibling component. |
| _(controlled `value` present on input)_                        | `Has Value`            | BOOLEAN          | Toggles between the un-shrunk label (False) and the value text / chip row (True). Mirrors the TextField axis but is a BOOLEAN here so it stays orthogonal to the 4 main variant axes (`Variant × Size × State × Multiple`). |
| `value` / `defaultValue` (single)                              | `Value`                | TEXT             | Default `Value`. Bound to the value text node when `Multiple=False && Has Value=True`.                             |
| `value` / `defaultValue` (multiple)                            | _(slot via chip override)_ | —            | Designers override each `<Chip>` instance's `Label` per-chip; chip count is drawn from the rendered chip slot (no `Chip Count` property today — track in §8).                       |
| `disableClearable`                                              | `Clear Icon`           | BOOLEAN          | Toggles the clear icon's visibility inside the end-adornment slot. Default `True` (matches MUI: clear icon visible when has-value, hidden when empty). Designers turn this off to model `disableClearable={true}`. |
| `loading`                                                      | `Loading`              | BOOLEAN          | Toggles a `<Loading>` icon (file-local `<Icon>/Loading` `3:2801`) in the popup-arrow slot's place. The popper still toggles open via `Open`; loading state inside the listbox is rendered by replacing options with a centered "Loading…" text node — see §5.4. |
| `loadingText`                                                  | `Loading Text`         | TEXT             | Default `Loading…`. Bound to the loading state text node when `Loading=True`.                                       |
| `noOptionsText`                                                | `No Options Text`      | TEXT             | Default `No options`. Bound to the empty-listbox text node when `Open=True && options.length === 0` — see §5.4.    |
| `freeSolo`                                                     | —                      | —                | Behavior-only (allows arbitrary input that isn't an option). Visually identical to a normal `Autocomplete` — no Figma property.                                    |
| `multiple` × tag-limit (`limitTags`)                            | —                      | —                | Behavior-only. Designers compose tag-limit visually by adding a `+N` Chip at the end (no dedicated property today — track in §8).                                  |
| `getOptionLabel` / `groupBy` / `filterOptions`                  | —                      | —                | Behavior-only.                                                                                                     |
| `disablePortal`                                                | —                      | —                | Behavior-only — affects DOM placement only. Figma always renders the popper inline (sibling Auto-Layout below the input).                                          |
| `slotProps.popper.sx`                                           | —                      | —                | Customisations land outside the variant matrix; treat as instance-level overrides.                                  |
| `popupIcon`, `clearIcon`                                        | —                      | —                | Behavior-only — designers swap the icon glyph via the shared `<Icon>` set's instance picker (`SelectArrow` / `Close` / any other glyph).                            |
| `componentsProps`                                               | —                      | —                | Deprecated MUI alias for `slotProps`; same as above.                                                               |

> **Slot composition.** The `End Adorn` SLOT on the nested `<TextField>` instance is populated with a horizontal Auto-Layout frame holding (clear-icon button) + (popup-arrow / loading button). Designers do not interact with this slot directly — toggling `Loading` / `Has Value` on the Autocomplete instance flips visibility on the relevant child.
>
> **No Color axis.** Same as `<TextField>` — Autocomplete inherits the neutral + primary-tint surface only. `color="success"` (etc.) is a §8 trigger.

## 3. Variant Property Matrix

```
Target  : Variant × Size × State × Multiple   =   3 × 2 × 4 × 2   =   48 variants
Today   : Variant × State                     =   3 × 4           =   12 variants
```

The published component set ships **12 variants today** along the `Variant × State` axes (`Size=Medium`, `Multiple=False`, `Has Value=True`). The remaining `Size=Small`, `Multiple=True`, and `Has Value=False` rows are tracked in §8 as future expansion triggers — extending the matrix is mechanical (clone the existing 12 cells, swap nested `<TextField>` instance to `Size=Small` / change wrapper content to chip flow / hide the value text node) and does not change the spec sections that follow.

| Property    | Default value | Today (published)                              | Future (target) |
| ----------- | ------------- | ----------------------------------------------- | --------------- |
| `Variant`   | `Standard`    | `Standard`, `Filled`, `Outlined`                | unchanged       |
| `Size`      | `Medium`      | `Medium` only                                   | + `Small`       |
| `State`     | `Enabled`     | `Enabled`, `Focused`, `Disabled`, `Error`       | unchanged       |
| `Multiple`  | `False`       | `False` only                                    | + `True`        |

> **Variant default is `Outlined`**, not `Standard`. The Autocomplete stories default to Outlined (matches MUI's most-common usage in app shells); the component default mirrors that to reduce overrides.
>
> **`Hovered` is omitted.** Autocomplete adds no hover paint over the `<TextField>` baseline. Designers needing the hovered input row pick the `<TextField>` `State=Hovered` directly. Re-add per §8 if Autocomplete introduces a distinct hover surface (e.g. listbox-anchor highlight).
>
> **`Pressed` is omitted.** Same logic as `<TextField>` §3 — MUI treats `:active` as `:focus` for inputs.
>
> **`Open` and `Has Value` are component-property BOOLEANs, not variants.** Including them as variant axes would multiply the matrix to `48 × 2 × 2 = 192`. The popper sub-frame and value/label visibility are orthogonal to the variant matrix, so the BOOLEAN encoding lets a single instance cover both states without duplication.

### 3.1 Component (non-variant) properties

| Property key      | Type    | Default              | Purpose                                                                                                                                          |
| ----------------- | ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Label`           | TEXT    | `Movie`              | Forwarded to the nested `<TextField>` instance's `Label` text property.                                                                          |
| `Placeholder`     | TEXT    | `Pick one`           | Forwarded to the nested `<TextField>` instance's `Placeholder` text property. Inert in cells where the un-shrunk label is showing — see TextField spec §4.3. |
| `Value`           | TEXT    | `The Shawshank Redemption` | Single-value text shown when `Multiple=False && Has Value=True`. Binds to the value text node inside `Content`.                            |
| `Has Value`       | BOOLEAN | `False`              | Toggles between un-shrunk label and value text / chip row. The nested `<TextField>` instance's `Has Value` is set to match.                       |
| `Open`            | BOOLEAN | `False`              | Toggles popper sub-frame visibility.                                                                                                              |
| `Clear Icon`      | BOOLEAN | `True`               | Toggles clear icon visibility within the end-adornment Auto-Layout. The clear icon is also auto-suppressed at runtime when `Has Value=False` or `State=Disabled`. |
| `Loading`         | BOOLEAN | `False`              | Replaces the popup-arrow icon with the loading icon and substitutes the listbox content for a centered "Loading…" message (when `Open=True`).     |
| `Loading Text`    | TEXT    | `Loading…`           | Inner text of the loading message inside the popper.                                                                                              |
| `No Options Text` | TEXT    | `No options`         | Inner text of the empty-listbox message when `Open=True` with zero options.                                                                       |

## 4. Design Tokens

All paints, strokes, surfaces, and effects bind to local variables / styles in the MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`). Hex values appear here only as reference resolutions of the light theme — bind to the token, not the hex.

### 4.1 Sizing

The input row's box geometry is inherited from `<TextField>`. The deltas Autocomplete adds:

| Property                                    | Standard      | Filled        | Outlined      |
| ------------------------------------------- | ------------- | ------------- | ------------- |
| Wrapper height — Single (Md / Sm)           | `32 / 29 px`  | `56 / 48 px`  | `56 / 40 px`  |
| Wrapper height — Multiple, 1 chip-row (Md / Sm) | `40 / 36 px` | `56 / 48 px`  | `56 / 40 px`  |
| Wrapper padding-right — Single (Md / Sm)    | `30 px`       | `39 px`       | `39 px`       |
| Wrapper padding-right — Multiple (Md / Sm)  | `56 px`       | `65 px`       | `65 px`       |
| End-adornment column width — Single         | `26 px`       | same          | same          |
| End-adornment column width — Multiple       | `52 px`       | same          | same          |
| End-adornment button (popup / clear)        | `28 × 28 px`  | same          | same          |
| End-adornment button padding                | `2 px` (popup) / `4 px` (clear) | same | same |
| Popup-arrow icon glyph (effective)          | `24 × 24 px`  | same          | same          |
| Tag chip height — Size=Medium               | `32 px`       | same          | same          |
| Tag chip height — Size=Small                | `24 px`       | same          | same          |
| Tag chip per-chip margin — Size=Medium      | `3 px`        | same          | same          |
| Tag chip per-chip margin — Size=Small       | `2 px`        | same          | same          |
| Popper width                                | matches input wrapper width | same | same          |
| Popper offset above / below input           | `0 px` (no margin between input bottom and Paper top) | same | same |
| Paper corner radius                         | `4 px`        | same          | same          |
| Paper effect                                | `material-design/shadows/shadows-1` | same | same      |
| Listbox padding (T / B)                     | `8 / 8 px`    | same          | same          |
| Listbox max-height                          | `196 px`      | same          | same          |
| Option min-height                           | `36 px`       | same          | same          |
| Option padding (T R B L)                    | `6 16 6 16 px`| same          | same          |

Notes:

- The chip row inside the wrapper grows the wrapper height by `~34 px` per overflowed chip row (chip height `32 px` + `2 × 1 px` vertical margin). Auto Layout on the wrapper frame lets the height grow; designers don't hard-set wrapper height for `Multiple=True`.
- Listbox `max-height: 196 px` rounds to roughly 5 option rows. Cells published in Figma should size the popper frame to fit `min(options.length, 5) × 36 px + 16 px padding`; designers can overflow the height for taller listboxes via instance override.
- Outlined wrapper padding stays `9 / 9 / 9 / 9 px` even with the absolute-positioned end-adornment; the right padding `9 px` clears the fieldset stroke.

### 4.2 Token bindings

One row per paint role unique to Autocomplete. Bind the Figma fill / stroke / text-fill / effect to the variable / style in **bold**.

| Role                                                | Token                                                                  | Notes                                                                                                                          |
| --------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Input row (every paint)                             | _(inherited from `<TextField>`)_                                       | The nested `<TextField>` instance carries its own bindings; do not override fills / strokes on the instance.                   |
| End-adornment button background                     | transparent                                                            | The button slot itself is a frame with no fill.                                                                                |
| End-adornment glyph fill (resting)                  | **`alias/colors/text-sub`** _(`#000000 0.6α`)_                         | Shared with `<TextField>` adornments. Drift open vs runtime `action.active` (`0.54α`) — see §7 issue 1 (mirrors TextField §7 issue 3). |
| End-adornment glyph fill (Disabled)                 | **`alias/colors/fg-disabled`** _(`#00000042`, `0.26α`)_                | `palette.action.disabled` — matches runtime `0.26α` adornment-disabled. Note: TextField uses `text-disabled` (`0.38α`) for disabled adornments; Autocomplete adopts `fg-disabled` to match runtime `0.26α` (small visual delta; documented as a deliberate divergence). See §7.4 issue 2. |
| End-adornment glyph fill (popup arrow, Open=True)   | same as resting (`alias/colors/text-sub`)                              | Only the glyph orientation changes (180° rotation) — colour stays at the resting binding.                                       |
| Popper Paper background                             | **`background/paper-elevation-0`** _(`#FFFFFF`)_                       | Local variable shared with the `<TextField>` Outlined label-notch.                                                              |
| Popper Paper effect                                 | **`material-design/shadows/shadows-1`** _(effect style)_               | Apply by style id; do not hand-author the three drop-shadow stack.                                                              |
| Popper Paper corner radius                          | `4 px`                                                                 | Bind via local variable `material-design/shape/borderRadius` if present, else hard-set.                                          |
| Listbox background                                  | transparent                                                            | Paper carries the white background — listbox is invisible when not focused.                                                     |
| Option text — resting                               | **`alias/colors/text-default`** _(`#000000 0.87α`)_                    | `text.primary`.                                                                                                                  |
| Option text — Disabled                              | **`alias/colors/text-disabled`** _(`#000000 0.61α`)_                   | `text.disabled`. Used when an option is disabled via `getOptionDisabled` (rare).                                                 |
| Option background — resting                         | transparent                                                            |                                                                                                                                  |
| Option background — Hovered / Focused               | **`alias/colors/bg-outline-hover`** _(`#0000000A`, `0.04α`)_           | `palette.action.hover`. The `Mui-focused` class on the option (mouse-hover or arrow-key highlight) renders this.                  |
| Option background — Selected (not focused)          | **`component/autocomplete/option-selected-bg`** _(`#1976D214`, `0.08α`)_ | Pre-alpha'd component-scoped local. See `design-token.md`. Do not stack `paint.opacity < 1`.                                  |
| Option background — Selected + Focused              | **`component/autocomplete/option-selected-focused-bg`** _(`#1976D21F`, `0.12α`)_ | Pre-alpha'd component-scoped local. The "selected option auto-receives focus on open" behaviour means this is the most-rendered selected paint. |
| Option text — Selected                              | same as resting (`alias/colors/text-default`)                          | MUI does not bold the selected option text; the bg tint is the only cue.                                                         |
| Tag chip                                            | _(inherited from `<Chip>`)_                                            | Tag chips are `<Chip>` instances at `Variant=Filled, Color=Default, State=Enabled`. Designers do not override the chip's paint.   |
| Loading icon glyph                                  | same as resting end-adornment (`alias/colors/text-sub`)                | Loading icon replaces popup-arrow when `Loading=True`; same fill.                                                                |
| Loading-state listbox text                          | **`alias/colors/text-sub`** _(`#000000 0.6α`)_                         | "Loading…" / "No options" message inside the popper. Centered, single line, body2 (`14 / 20 px`).                                |

> The `component/autocomplete/option-*` tokens are **component-scoped pre-alpha'd locals** that already carry alpha; never pair them with a paint `opacity < 1`. See `design-token.md` for the resolution chain.

### 4.3 State rules

One row per state, columns per Variant. Token names reference §4.2; rows mirror `<TextField>` §4.3 with Autocomplete-specific deltas marked **bold**.

| State        | Standard                                                                                                  | Filled                                                                                                                         | Outlined                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Enabled**  | input row inherited from `<TextField>` Enabled · **end-adornment glyph `text-sub` · clear icon visible iff Has Value=True** | same input + end-adornment | same input + end-adornment |
| **Focused**  | input row inherited from `<TextField>` Focused · **popup arrow rotated 180° when `Open=True`**            | same                                                                                                                            | same                                                                                                    |
| **Disabled** | input row inherited from `<TextField>` Disabled · **end-adornment glyph `fg-disabled` · clear icon force-hidden · popper hidden** | same                                                                                                | same                                                                                                    |
| **Error**    | input row inherited from `<TextField>` Error · **end-adornment glyph `text-sub` (no Error retint)**       | same                                                                                                                            | same                                                                                                    |

Notes:

- **End-adornment glyph does not retint with Error.** Same convention as `<TextField>` adornments — Autocomplete keeps the popup-arrow / clear-icon at the neutral `text-sub` even when `Error=true`.
- **`Open=True && State=Disabled` is forbidden.** Disabled inputs cannot open the popper at runtime; designers picking this combination will see an empty popper that is not reachable in production. Treat as a §7 don't.
- **`Open=True && State=Error`** is allowed — the input row keeps the danger-tinted underline / fieldset; the popper itself is paint-neutral.
- **`Multiple=True && Has Value=False`** renders an un-shrunk label inside the wrapper (no chip row). The wrapper height collapses to single-line.

## 5. Companion sub-component: `<AutocompleteOption>`

The popper's option rows are a separate component published next to `<Autocomplete>`. They sit inside the listbox frame at instance level so designers can stamp option counts without authoring each row.

| Property      | Type    | Default                  | Purpose                                                                                  |
| ------------- | ------- | ------------------------ | ---------------------------------------------------------------------------------------- |
| `State`       | VARIANT | `Enabled`                | `Enabled`, `Focused`, `Selected`, `Selected + Focused`, `Disabled`. 5 variants.          |
| `Label`       | TEXT    | `Option`                 | Option text. Single line, truncates via Auto Layout.                                     |

Total variants: **5** (`State` axis only). One size — small/medium Autocomplete instances both render `36 px` option rows.

### 5.1 Sizing & paint per state

| State              | Background                                                                | Text fill                       |
| ------------------ | ------------------------------------------------------------------------- | ------------------------------- |
| Enabled            | transparent                                                               | `alias/colors/text-default`     |
| Focused            | `alias/colors/bg-outline-hover` _(`0.04α`)_                                | `alias/colors/text-default`     |
| Selected           | `component/autocomplete/option-selected-bg` _(primary `0.08α`)_            | `alias/colors/text-default`     |
| Selected + Focused | `component/autocomplete/option-selected-focused-bg` _(primary `0.12α`)_    | `alias/colors/text-default`     |
| Disabled           | transparent                                                               | `alias/colors/text-disabled`    |

### 5.2 Layout

- Auto Layout horizontal frame, `padding: 6 16 6 16 px`, `min-height: 36 px`, `width: hug` (fills parent listbox width).
- Single text node, `body1` typography (Roboto Regular `16 / 24 px`, ls `0.15 px` — bind via local typography variable if present, else hand-set).

### 5.3 Wiring inside `<Autocomplete>`

The `Open=True` popper sub-frame holds an Auto Layout vertical stack of `<AutocompleteOption>` instances. Designers stamp the rows manually; there is no `Option Count` property today (track as a §8 trigger). The selected option's `State=Selected + Focused` matches MUI's runtime behaviour where opening the popper auto-focuses the selected row.

### 5.4 Loading / no-options / empty states

- `Loading=True && Open=True` — replace the option stack with a single centered text node ("Loading…", `Loading Text` property). Text uses `alias/colors/text-sub`, `body2` typography.
- `Open=True && options.length === 0` — replace the option stack with a single centered text node ("No options", `No Options Text` property). Same paint as Loading.
- These two cases live inside `<Autocomplete>` itself, not `<AutocompleteOption>`. The companion component is the option row only.

## 6. Layout

> **v1 published layout (12 cells).** The current `<Autocomplete>` set (`450:7671`) ships as a **3-column × 4-row grid** (`Variant × State`, Size=Medium, Multiple=False, Has Value=True). The full target layout below describes the 48-variant matrix the next expansion pass should land. Until then, the published cells use the simpler grid: each row is one State (Enabled / Focused / Disabled / Error), each column is one Variant (Standard / Filled / Outlined). Cell width is `320 px` (chosen to fit the value text + 52 px end-adornment cleanly without truncation).

### 6.1 Target layout (48 variants — future expansion)

The Component Set, once expanded to 48 variants, is laid out as a **6-column × 16-row grid** inside the `<Autocomplete>` frame (node id assigned at publish time):

- **Columns** (left → right) — `Variant × Size`: Standard·Medium, Standard·Small, Filled·Medium, Filled·Small, Outlined·Medium, Outlined·Small. Column stride matches `<TextField>`'s `236 px` (`220 px` cell + `16 px` gap), but cells are `280 px` wide here (Autocomplete defaults to `width: 280` in stories) — column origins shift to `{24, 320, 616, 912, 1208, 1504}`; column stride `296 px`.
- **Row bands** (top → bottom) — `State × Multiple`. Two blocks of 8 rows:
  - Single block (`Multiple=False`):
    - Enabled · Has Value=True
    - Enabled · Has Value=False
    - Focused · Has Value=True
    - Focused · Has Value=False
    - Disabled · Has Value=True
    - Error · Has Value=True
  - Multiple block (`Multiple=True`):
    - Enabled · Has Value=True (2 chips)
    - Enabled · Has Value=False
    - Focused · Has Value=True (2 chips)
    - Focused · Has Value=False
    - Disabled · Has Value=True (2 chips)
    - Error · Has Value=True (2 chips)

> `Disabled · Has Value=False` and `Error · Has Value=False` are omitted to keep the grid at 12 visible cells per multiple-axis (×2 = 24). The remaining 24 variants live behind the `Open` and `Loading` BOOLEAN component properties — pick them on a single instance to view.

- Frame dimensions grow proportionally — total frame width ≈ `1800 px`, height grows to fit the multiple-block (chip rows add ~34 px per cell; default 1 chip per cell). Auto Layout determines the actual height.
- A standalone "Open popper" preview band sits below the variant grid, showing one cell per Variant × Size with `Open=True` and 5 visible options (covers the popper geometry without entering the variant matrix).

### 6.1 Cell composition

Every cell follows the same nested structure (the Outlined · Medium · Enabled · Single · Has Value=True cell is the canonical reference):

- `Frame` (FRAME) — outer Auto Layout, `direction: vertical`, `gap: 0`, `width: 280`.
  - `<TextField>` (INSTANCE) — the published `<TextField>` component instance with axes wired as in §2.
    - End-adornment slot (override): horizontal Auto Layout, `gap: 0`, holding:
      - `<IconButton>`-shaped frame with `<Icon>/Close` glyph (clear icon, visible per `Clear Icon`).
      - `<IconButton>`-shaped frame with `<Icon>/SelectArrow` glyph (popup arrow, rotated 180° when `Open=True`) **OR** `<Icon>/Loading` glyph (when `Loading=True`).
    - Wrapper inner content (override): for `Multiple=True && Has Value=True`, replaces the value text with a horizontal-wrapping Auto Layout flow of `<Chip>` instances at `Size=Small` (Autocomplete `Size=Small`) or `Size=Medium` (Autocomplete `Size=Medium`).
  - `Popper` (FRAME) — sibling Auto Layout, visible iff `Open=True`. Holds the Paper (`background/paper-elevation-0`, `shadows-1`, `radius: 4`) which holds the listbox (vertical Auto Layout, `padding: 8 0 8 0`) which holds either:
    - a stack of `<AutocompleteOption>` instances (default), or
    - a centered "Loading…" / "No options" text node (when `Loading=True` or zero options).

The `<TextField>` instance is the canonical source of every input-row paint. Paint duplication on the cell itself is forbidden — designers should never repaint the underline, fieldset, wrapper, or label.

## 7. Usage Guidelines

### 7.1 Picking a variant

1. Match `variant` from the input's TextField to the `Variant` axis (`outlined` → `Outlined`, etc.). Default is `Outlined`.
2. Match `size` to the `Size` axis. The chip row also resizes (24 px on Small, 32 px on Medium).
3. Pick `State`:
   - `Enabled` for resting production screens.
   - `Focused` only when illustrating a focused-but-unopened input. For "open + focused", set `State=Focused` and `Open=True`.
   - `Disabled` for `disabled={true}`. **Do not** combine with `Open=True`.
   - `Error` for the input's `error={true}`. The popper paint is unaffected.
4. Pick `Multiple`:
   - `False` (default) for single-value Autocomplete. The value text node renders inside the input.
   - `True` for multi-value. Stamp `<Chip>` instances inside the wrapper override (one per chip).
5. Toggle `Has Value` to switch between un-shrunk label (False) and value text / chip row (True).
6. Toggle `Open` to render the popper sub-frame. Stamp `<AutocompleteOption>` instances into the listbox frame.
7. Toggle `Loading` for the loading state — replaces popup arrow with `<Icon>/Loading` and the listbox content with the loading message.
8. Toggle `Clear Icon` off to model `disableClearable={true}`.

### 7.2 Wrapper recipes (informative)

- **Async load** — `Loading=True`, `Open=True`. The popper renders the loading message; designers can also drop a progress glyph into the listbox if the host application uses one.
- **Combobox-style (free solo)** — no Figma property; visually identical to a normal Autocomplete. Annotate via the instance's name.
- **Tag-input (`limitTags`)** — stamp the chip count + `+N` chip manually. `+N` is a regular `<Chip>` instance with `Label="+N"`.

### 7.3 Don'ts

- ❌ Don't repaint the input row — every fill / stroke / underline / label should remain bound to the nested `<TextField>` instance. Adjust by picking different `Variant` / `Size` / `State` axes.
- ❌ Don't stack `paint.opacity < 1` on top of `component/autocomplete/option-selected-bg` or `component/autocomplete/option-selected-focused-bg` — the alpha is pre-baked.
- ❌ Don't combine `Open=True` with `State=Disabled` — disabled inputs cannot open the popper.
- ❌ Don't tint the option text on Selected — MUI does not bold or recolor the text; the bg tint is the only cue.
- ❌ Don't paint the popper Paper with hex — bind via `background/paper-elevation-0` and apply `material-design/shadows/shadows-1` by style id.
- ❌ Don't add a focus ring on the popper Paper — MUI does not render one.

### 7.4 Open issues (drift)

These are tracked here so the next runtime-truth pass has a punch list. Most carry over from `<TextField>`'s drift list because Autocomplete reuses the input row.

1. **End-adornment glyph fill (resting)** — Figma binds `alias/colors/text-sub` (`0.6α`); MUI runtime is `action.active` (`0.54α`). Mirrors `<TextField>` §7 issue 3.
2. **End-adornment glyph fill (Disabled) — token divergence vs `<TextField>`.** Autocomplete binds `alias/colors/fg-disabled` (`0.26α`, `palette.action.disabled`) to match MUI runtime exactly. `<TextField>` binds `alias/colors/text-disabled` (`0.38α`, `palette.text.disabled`) for the same role — a deliberate sibling-spec divergence. If a future maintainer unifies the two, repoint Autocomplete to `text-disabled` and accept the `+0.12α` darkening, or repoint TextField to `fg-disabled` and accept the `−0.12α` lightening. Track which way the unification goes here.
3. **Listbox max-height** — Figma fixes `196 px` based on the MUI default. If a host overrides `slotProps.listbox.style.maxHeight`, the Figma cell will diverge. Re-author with a different fixed max-height only if a host uses a non-196 default consistently.
4. **Selected option paint stack** — runtime uses MUI's `palette.primary.main × (action.selectedOpacity + action.focusOpacity) = 0.08 + 0.04`. Custom themes that retune `selectedOpacity` / `focusOpacity` will diverge. Mint per-theme variants of the option-selected tokens if this becomes load-bearing.
5. **Inherited TextField drift** — issues 1, 2, 4, 5 from `<TextField>` §7 carry over (Outlined enabled border `0.12α` vs runtime `0.23α`, Outlined disabled border, Filled focused fill, Standard disabled dotted underline). Not duplicated here; the `<TextField>` spec is authoritative.

## 8. Source Sync Rule

This document and the source must move together. When **any** of the following changes:

1. `src/stories/Autocomplete.stories.tsx` (variants, args, popper / chip wiring, loading / no-options handling)
2. The Figma `<Autocomplete>` component set at the published node id (variants, properties, token bindings)
3. The Figma `<TextField>` component set at `1:6266` — Autocomplete embeds it by reference, so any change to its variant axes / token bindings cascades here
4. The Figma `<Chip>` component set at `342:7102` — Autocomplete embeds it for tags
5. The shared `<Icon>` component set (`3:2722`) — particularly `SelectArrow`, `Close`, `Loading`
6. The local `component/autocomplete/option-*` tokens documented in `design-token.md`, or the local `text/disabled`, `background/paper-elevation-0`, `material-design/shadows/shadows-1` styles
7. The shared `merak/seed/*`, `merak/alias/*` tokens consumed in §4.2 — particularly `seed/primary/main`, `alias/colors/{text-sub,text-default,text-disabled,fg-disabled,bg-outline-hover}`
8. `.storybook/preview.tsx` (theme overrides) — today this is an empty `createTheme()`; introducing typography / palette / `MuiAutocomplete.defaultProps` overrides forces a re-measure
9. `package.json` `@mui/material` peer / dev version (currently `^7.3.10` / peer `>=7`)

…this spec **must be updated in the same change**. Specifically:

- **Expanding from the v1 12-variant set to the 48-variant target.** Today only `Variant × State` is published (Size=Medium, Multiple=False, Has Value=True). Adding the missing axes is mechanical: clone the existing 12 cells, swap the nested `<TextField>` instance to `Size=Small`, repeat → 24 cells. Then for each, swap the wrapper content from value text to a chip flow (`<Chip>` instances at the matching `Size=Small` / `Size=Medium`) → 48 cells. Update §3 default to declare all 4 axes shipped, drop the "Today" column, and update §6 layout to the 48-cell grid. Re-run the subagent review on the expanded set.
- Introducing a `Color` axis (e.g. `color="success"`) → add §2.X.1 Color value mapping, add the `Color` variant in Figma, multiply variant count in §3, add per-color rows in §4.2.
- Adding a `Hovered` state (e.g. listbox-anchor highlight) → re-add to §3, add a row to §4.3.
- Adding `Tag Count` as a Figma property (rather than per-instance chip stamping) → §3.1, §6.1.
- Adding `Group By` headings → introduce a `<AutocompleteGroupHeader>` companion in §5.
- Token rename / removal in `merak/alias/*` or `merak/seed/*` → update every reference in §2, §4, §10 and rename the matching variable in the local Figma collection.
- Token value change in `component/autocomplete/option-*` → no edit to this spec is required (Figma resolves through the same name); `design-token.md` records the resolution chain.
- Surfacing a `loading` axis — currently a BOOLEAN; promoting to an axis would multiply variants and require row rebuilds.
- `@mui/material` major bump → re-run `storybook.render.md` drift checks; bump the version row in §1; reconcile any new computed-style values against §4.

## 9. Quick Reference

```ts
// Source surface (from `@mui/material` Autocomplete, used directly in src/stories/Autocomplete.stories.tsx)
type AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> = {
  options: T[];                                            // Figma: stamp <AutocompleteOption> instances
  renderInput: (params) => React.ReactNode;                // Figma: nested <TextField> instance (Variant / Size / State / Has Value)
  multiple?: boolean;                                      // → Figma `Multiple`
  size?: 'small' | 'medium';                               // → Figma `Size` (forwarded to TextField + chip)
  disabled?: boolean;                                      // → Figma `State=Disabled` on the nested TextField
  open?: boolean;                                          // → Figma `Open` (BOOLEAN)
  loading?: boolean;                                       // → Figma `Loading` (BOOLEAN)
  loadingText?: React.ReactNode;                           // → Figma `Loading Text` (TEXT)
  noOptionsText?: React.ReactNode;                         // → Figma `No Options Text` (TEXT)
  disableClearable?: boolean;                              // → Figma `Clear Icon = false` (BOOLEAN)
  defaultValue?: T | T[];                                  // → Figma `Has Value=True` + `Value` (TEXT) / chip stamps
  freeSolo?: boolean;                                      // not represented in Figma (no visual delta)
  popupIcon?: React.ReactNode;                             // not represented (designers swap via <Icon> set)
  clearIcon?: React.ReactNode;                             // not represented (designers swap via <Icon> set)
};
```

```
Figma Component Set: <Autocomplete>  (450:7671)
  Variant axes (today)  : Variant × State                           (3 × 4 = 12)
  Variant axes (target) : Variant × Size × State × Multiple         (3 × 2 × 4 × 2 = 48)
  Properties            : Label (TEXT), Placeholder (TEXT), Value (TEXT),
                          Has Value (BOOLEAN), Open (BOOLEAN), Clear Icon (BOOLEAN),
                          Loading (BOOLEAN), Loading Text (TEXT), No Options Text (TEXT)
  Composes              : <TextField> (1:6266), <Chip> (342:7102), <Icon> (3:2722),
                          <AutocompleteOption> (439:7109, 5 variants)
  Default               : Variant=Standard, Size=Medium, State=Enabled, Multiple=False
  Total                 : 12 published / 48 target
```

## 10. Token Glossary

The complete set of tokens consumed by `<Autocomplete>` directly. Tokens consumed via the nested `<TextField>` / `<Chip>` instances are documented in those specs; not duplicated here.

### 10.1 Seed tokens (`merak/seed/*`)

| Token               | Used by                                                                  | Role                              |
| ------------------- | ------------------------------------------------------------------------ | --------------------------------- |
| `seed/primary/main` | Resolution chain for `component/autocomplete/option-selected-*` tokens   | Primary accent (`#1976D2`)        |

### 10.2 Alias tokens (`merak/alias/colors/*`)

| Token                          | Used by                                                                  | Role                              |
| ------------------------------ | ------------------------------------------------------------------------ | --------------------------------- |
| `alias/colors/text-default`    | Option text (Enabled / Focused / Selected / Selected+Focused)            | `text.primary`, `0.87α`           |
| `alias/colors/text-sub`        | End-adornment glyph (resting), loading / no-options message text         | `text.secondary`, `0.6α`          |
| `alias/colors/text-disabled`   | Option text (Disabled)                                                   | `text.disabled`, `0.61α`          |
| `alias/colors/fg-disabled`     | End-adornment glyph (Disabled)                                           | `action.disabled`, `0.26α` (`#00000042`) |
| `alias/colors/bg-outline-hover`| Option background (Hovered / Focused)                                    | `action.hover`, `0.04α`           |

### 10.3 Component-scoped tokens (`component/autocomplete/*` — local to MUI-Library file)

Documented in `design-token.md`. Listed here for completeness:

| Token                                              | Used by                                  | Role                                      |
| -------------------------------------------------- | ---------------------------------------- | ----------------------------------------- |
| `component/autocomplete/option-selected-bg`        | Option background (Selected)             | Pre-alpha'd `primary × 0.08α`             |
| `component/autocomplete/option-selected-focused-bg`| Option background (Selected + Focused)   | Pre-alpha'd `primary × 0.12α`             |

### 10.4 Other local variables / styles

| Token                                | Used by                                  | Role                                      |
| ------------------------------------ | ---------------------------------------- | ----------------------------------------- |
| `background/paper-elevation-0`       | Popper Paper background                  | `#FFFFFF` (shared with TextField label-notch). |
| `material-design/shadows/shadows-1`  | Popper Paper effect                      | MD elevation 1 (3-layer drop-shadow stack). |
| `material-design/shape/borderRadius` (or hard-set `4`) | Popper Paper corner radius   | `theme.shape.borderRadius`. Bind if available. |

### 10.5 Text styles & shape

- **Option text** — `body1` typography (Roboto Regular `16 / 24 px`, ls `0.15 px`). Apply by style id; bind via `material-design/typography/body1` if published, else hand-set Roboto Regular.
- **Loading / no-options message** — `body2` typography (`14 / 20 px`).
- **Tag chip label** — inherited from `<Chip>` component (Noto Sans TC Regular `12 / 18 px` per `material-design/components/chip`, despite runtime Roboto `13 / 19.5 px` — see `<Chip>` spec drift §7).
- **Popper Paper corner radius** — `4 px`, matches MUI `theme.shape.borderRadius = 4`.
- **No focus ring** on listbox / option / popper. The `Mui-focused` bg tint is the only visual cue.

### 10.6 Typography (resolved values)

`<Autocomplete>` consumes MUI defaults with no project override:

- Family: `Roboto, Helvetica, Arial, sans-serif`
- Weight: `Regular (400)`
- Option text: `16 / 24 px`, ls `0.15 px`
- Loading / no-options message: `14 / 19.92 px`, ls `0.15 px`
- Input value / label / helper: inherited from `<TextField>` §10.6
- Tag chip label: inherited from `<Chip>` §3 (`13 / 19.5 px` runtime; spec binds `12 / 18 px` Figma text style)

If the project introduces typography tokens (e.g. `merak/typography/option-*`), update §4.1 and §10.6 to bind to them.

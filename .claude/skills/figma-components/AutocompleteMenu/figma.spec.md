---
name: figma-component-autocomplete-menu-spec
description: Figma component specification for `<AutocompleteMenu>` — design counterpart of the **popper / listbox** of the MUI `<Autocomplete>` consumed by `src/stories/Autocomplete.stories.tsx`. Owns the Paper + listbox frame and its three content modes (Default with options, Loading, NoOptions). Composes the published `<AutocompleteOption>` (`439:7109`) for option rows. Documents the variant matrix (State), the source-to-Figma mapping, layout, and token bindings. For component-scoped tokens see `design-token.md` in this directory; for runtime measurements see `storybook.render.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '534:7976'
figma_component_set_id: '534:7976'
figma_companion_option_set_id: '439:7109'
---

# `<AutocompleteMenu>` Figma Component Specification

## 1. Overview

`<AutocompleteMenu>` is the Figma counterpart of the **popper / listbox surface** of the MUI `<Autocomplete>` consumed in `src/stories/Autocomplete.stories.tsx`. It owns:

1. **Paper frame** — the white surface with shadow + radius that holds the listbox. Paint = `background/paper-elevation-0` (`#FFFFFF`); effect = `material-design/shadows/shadows-1`; radius = `4 px`.
2. **Listbox frame** — vertical Auto Layout, `padding: 8 0 8 0`, `gap: 0`. Holds the option stack (Default state) or the centered loading / no-options message.
3. **Option rows** — instances of the published `<AutocompleteOption>` companion (`439:7109`). Designers stamp 1-N instances inside the listbox frame; there is no `Option Count` property today (track in §7).
4. **Loading / no-options message** — single centered text node that replaces the option stack when `State=Loading` or `State=NoOptions`. `body1` typography (`16 / 24 px`, matches MUI runtime); fill = `alias/colors/text-sub`. The published cell is `52 px` tall (`24 + 14 + 14`).

This component is **brand-new on 2026-04-29**. Published as node `534:7976` on the Foundation Components page at `(12745, 11000)`.

| Aspect            | Value                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| Source story      | `src/stories/Autocomplete.stories.tsx` — `MenuMatrix`, `Open`, `OpenWithValue`, `OpenMatrix`, `Loading` |
| Underlying source | `@mui/material@^7.3.10` `Autocomplete` (re-exported by this package, no wrapper) — `Popper`, `Paper`, `MuiAutocomplete-listbox`, `MuiAutocomplete-loading`, `MuiAutocomplete-noOptions` slots |
| Underlying MUI    | `@mui/material` `7.3.10` (resolved from `package.json` on 2026-04-29)                  |
| Figma file        | [MUI-Library](https://www.figma.com/design/KQjP6W9Uw1PN0iipwQHyYn) (`KQjP6W9Uw1PN0iipwQHyYn`) |
| Figma frame       | `<AutocompleteMenu>` (`534:7976`) on page **Foundation Components** (`0:1`) at absolute `(12864, 10847)`, size `984 × 276 px`. The companion `<AutocompleteOption>` (`439:7109`) sits at absolute `(12864, 11213)`, size `360 × 356 px`. |
| Component Set     | `<AutocompleteMenu>` (`534:7976`) — published 2026-04-29                                |
| Composed sets     | `<AutocompleteOption>` (`439:7109`) — 5 variants                                        |
| Total variants    | **3** (`State`: Default, Loading, NoOptions). One width — `280 px` (matches the default Autocomplete wrapper width in the stories). |
| Typography        | Option rows inherit from `<AutocompleteOption>` — `body1` (Roboto Regular, `16 / 24 px`, ls `0.15 px`). Loading / no-options message uses `body1` (matches MUI runtime). |
| Local-only bindings | **Required.** Every paint / stroke / effect resolves to a variable in this file's local collection. No `VariableID:<sharedKey>/...` consumed-library bindings are permitted. |

## 2. Source-to-Figma Property Mapping

| MUI prop / runtime element                                     | Figma property         | Type             | Notes                                                                                                              |
| -------------------------------------------------------------- | ---------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `open` (Autocomplete)                                          | _(implicit)_           | —                | Visibility of `<AutocompleteMenu>` is the designer's choice — the component is only stamped when the menu should be open. There is no `Open` BOOLEAN here. |
| `loading` + `options.length === 0` running                     | `State=Loading`        | VARIANT          | Replaces the option stack with a centered "Loading…" message.                                                      |
| `options.length === 0 && !loading`                             | `State=NoOptions`      | VARIANT          | Replaces the option stack with a centered "No options" message.                                                     |
| `options.length > 0 && !loading`                               | `State=Default`        | VARIANT          | Renders the listbox with stamped `<AutocompleteOption>` instances.                                                  |
| `loadingText`                                                  | `Loading Text`         | TEXT             | Default `Loading…`. Bound to the loading state text node (only renders when `State=Loading`).                        |
| `noOptionsText`                                                | `No Options Text`      | TEXT             | Default `No options`. Bound to the no-options state text node (only renders when `State=NoOptions`).                 |
| _(per-option `selected` / `Mui-focused` / `getOptionDisabled`)_| _(via `<AutocompleteOption>` instance state)_ | — | Designers stamp `<AutocompleteOption>` instances and set their `State` axis directly (`Enabled` / `Focused` / `Selected` / `Selected + Focused` / `Disabled`).                                                            |
| `slotProps.popper.sx`                                          | —                      | —                | Customisations land outside the variant matrix; treat as instance-level overrides.                                  |
| `slotProps.paper.sx`                                           | —                      | —                | Same as above — designers override the Paper paint at instance level when needed (non-default Paper background, custom shadow). |
| `slotProps.listbox.style.maxHeight`                            | —                      | —                | The Figma frame fits its option stack; designers showing a scrolling listbox set a frame height manually.            |
| `groupBy` / `renderGroup`                                      | —                      | —                | Behavior-only — group headers are not modelled today (track as a §7 trigger to add `<AutocompleteGroupHeader>`).      |
| `disablePortal`                                                | —                      | —                | Behavior-only — affects DOM placement only. Figma always renders the menu inline.                                    |

> **No `Width` axis.** The component ships at a fixed `280 px` width (matches the default Autocomplete wrapper width in `src/stories/Autocomplete.stories.tsx`). Hosts at non-default widths resize the instance manually.
>
> **No `Color` axis.** AutocompleteMenu inherits the neutral surface only; the only chromatic paints are inside the option-Selected states which bind to component-scoped pre-alpha'd primary tints.

## 3. Variant Property Matrix

```
Today : State                              =   3 variants
```

The published component set ships **3 variants** along the `State` axis. There is no `Variant` / `Size` / `Width` axis — Paper paint, Paper effect, listbox padding, option-row min-height, and frame width are all constants across the matrix.

| Property    | Default value | Today                      |
| ----------- | ------------- | --------------------------- |
| `State`     | `Default`     | `Default`, `Loading`, `NoOptions` |

> **`State=Default` is the canonical "menu is open with options" cell.** The cell ships with 5 stamped `<AutocompleteOption>` instances (one Selected + Focused, four Enabled) so designers see what a real listbox looks like. Designers replace / add / remove option instances per their data.
>
> **`State=Loading` and `State=NoOptions` swap the listbox content** for a single centered `body2` text node. The `Loading Text` / `No Options Text` properties feed the text content; the listbox padding / Paper paint stay identical to `State=Default`.
>
> **Disabled / Error states are not modelled.** AutocompleteMenu does not retint Paper or option rows for `disabled` / `error` Autocomplete inputs — disabled inputs cannot open the menu, and errored inputs render the menu with neutral paint (the input's `<TextField>` carries the danger tint).

### 3.1 Component (non-variant) properties

| Property key      | Type    | Default              | Purpose                                                                                                                                          |
| ----------------- | ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Loading Text`    | TEXT    | `Loading…`           | Inner text of the loading message. Only renders when `State=Loading`.                                                                            |
| `No Options Text` | TEXT    | `No options`         | Inner text of the no-options message. Only renders when `State=NoOptions`.                                                                       |

## 4. Design Tokens

All paints, strokes, surfaces, and effects bind to local variables / styles in the MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`). Hex values appear here only as reference resolutions of the light theme — bind to the token, not the hex.

### 4.1 Sizing

| Property                                    | Value         | Notes                                                                                          |
| ------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| Paper width                                 | `280 px`      | Matches default Autocomplete wrapper width. Hosts override at instance level.                   |
| Paper corner radius                         | `4 px`        | Bind via local variable `material-design/shape/borderRadius` if present, else hard-set.        |
| Paper effect                                | `material-design/shadows/shadows-1` | Apply by style id; do not hand-author the three drop-shadow stack.       |
| Listbox padding (T / R / B / L)             | `8 / 0 / 8 / 0 px` | Symmetric T/B; horizontal padding lives on the option rows.                              |
| Listbox max-height (Default state)          | `200 px` (Figma published cell) | The published Default cell measures `280 × 200 px`. MUI runtime caps at `196 px` (`5 × 36 + 16`); the extra `4 px` in the Figma cell is the Auto Layout's bottom rounding from the `36 px` option rows + listbox padding. Designers override the frame height for taller listboxes via instance override. |
| Loading / NoOptions content padding         | `14 16 14 16 px` | Published Loading / NoOptions cells measure `280 × 52 px` total (`24 px` body1 line-height + `14 + 14` vertical padding). Earlier drafts assumed body2 (`14 + 20 + 14 = 48 px`); the published cell uses body1 to match runtime. |
| Option row min-height                       | `36 px`       | Inherited from `<AutocompleteOption>`. The Default state's listbox height ≈ `option-count × 36 + 16 px` (8 px top + 8 px bottom), with a few px Auto-Layout rounding to reach the published `200 px`. |

### 4.2 Token bindings

One row per paint role. Bind the Figma fill / stroke / text-fill / effect to the variable / style in **bold**.

| Role                                                | Token                                                                  | Notes                                                                                                                          |
| --------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Paper background                                    | **`background/paper-elevation-0`** _(`#FFFFFF`)_                       | Local variable shared with the `<TextField>` Outlined label-notch.                                                              |
| Paper effect                                        | **`material-design/shadows/shadows-1`** _(effect style)_               | Apply by style id.                                                                                                              |
| Paper corner radius                                 | `4 px`                                                                 | Bind via local variable `material-design/shape/borderRadius` if present, else hard-set.                                          |
| Listbox background                                  | transparent                                                            | Paper carries the white background — listbox is invisible.                                                                       |
| Option row paint                                    | _(inherited from `<AutocompleteOption>`)_                              | Each option instance carries its own background + text fill bindings; do not override at the menu level.                         |
| Loading-state text fill                             | **`alias/colors/text-sub`** _(`#000000 0.6α`)_                         | "Loading…" message. Centered, single-line, body2 (`14 / 20 px`).                                                                |
| NoOptions-state text fill                           | **`alias/colors/text-sub`** _(`#000000 0.6α`)_                         | "No options" message. Same paint as Loading.                                                                                    |

> The `component/autocomplete/option-*` pre-alpha'd component-scoped tokens consumed by `<AutocompleteOption>` are documented in `design-token.md`. They do not surface at the AutocompleteMenu level — only via the option instances stamped inside.

### 4.3 State rules

One row per state. Token names reference §4.2.

| State        | Listbox content                                              | Listbox geometry                                                          |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **Default**  | Vertical stack of `<AutocompleteOption>` instances           | Frame height grows with stamped options (`n × 36 + 16 px`); max `196 px`. |
| **Loading**  | Single centered text node bound to `Loading Text`            | Frame height collapses to fit the single-line message (`52 px` total — `14 + 24 + 14`, body1). |
| **NoOptions**| Single centered text node bound to `No Options Text`         | Same as Loading.                                                          |

Notes:

- **Vertical anchor.** The menu is anchored directly below the input wrapper with no gap. Designers using Auto Layout to stack the menu under an input should set `gap: 0` between them.
- **Disabled / Error pairing.** Pairing with a disabled input is forbidden (disabled inputs cannot open the menu). Errored inputs pair freely — the menu paint is unaffected.

## 5. Layout

### 5.1 Variant grid (3 cells)

The Component Set is laid out as a **3-column × 1-row grid** (or 1-column × 3-row, depending on the screen orientation chosen at publish time):

- **Cells**: `Default`, `Loading`, `NoOptions` — columns left to right.
- **Cell width**: `280 px` (Paper width). The published Component Set frame is `984 × 276 px`, with cells at relative x `40 / 352 / 664` and y `40` — i.e. `32 px` cell gap and `40 px` frame padding around them.
- **Cell heights** vary by state:
  - `Default`: `200 px` — 5 stamped `<AutocompleteOption>` instances at `36 px` each + `16 px` listbox padding (Auto-Layout rounding adds the trailing `4 px` to reach the published cell height).
  - `Loading` / `NoOptions`: `52 px` — single-line `body1` (`24 px` line-height) + `14 / 14 px` vertical padding.
- **Frame**: published at absolute `(12864, 10847)` on the Foundation Components page; the companion `<AutocompleteOption>` frame sits below at absolute `(12864, 11213)`, size `360 × 356 px`.

### 5.2 Cell composition

#### Default state

- `Frame` (FRAME) — outer Auto Layout, `direction: vertical`, `gap: 0`, `width: 280`, `padding: 0`.
  - `Paper` (FRAME) — Auto Layout, `direction: vertical`, `width: 280`, `corner-radius: 4`, `effect: shadows-1`, `fill: paper-elevation-0`.
    - `Listbox` (FRAME) — Auto Layout, `direction: vertical`, `gap: 0`, `padding: 8 0 8 0`.
      - 5 × `<AutocompleteOption>` (INSTANCE) — first instance set to `State=Selected + Focused` (matches MUI's "selected option auto-receives focus on open" behaviour); remaining four set to `State=Enabled`. Designers replace / add / remove instances per their data; the Selected+Focused pin stays on the most-relevant option.

#### Loading state

- Same outer/Paper structure.
  - `Listbox` (FRAME) — Auto Layout, `direction: vertical`, `gap: 0`, `padding: 14 16 14 16`, `align-items: center`.
    - `LoadingText` (TEXT) — single text node, body2, fill = `alias/colors/text-sub`, content bound to `Loading Text` property, default `Loading…`. Centered horizontally via `align-self: center`.

#### NoOptions state

- Identical to Loading except the text node is bound to `No Options Text` (default `No options`).

The shared `<AutocompleteOption>` companion (`439:7109`) is the canonical source of every option-row paint. Paint duplication on the menu's option rows is forbidden — designers should never repaint option backgrounds / text directly; they pick the right `<AutocompleteOption>` `State` axis instead.

## 6. Usage Guidelines

### 6.1 Picking a state

1. `Default` for the standard listbox-with-options state. Stamp the appropriate option instances.
2. `Loading` for `loading={true}` while options are still being fetched.
3. `NoOptions` for `loading={false} && options.length === 0`. The input may show no value (label un-shrunk) or be filtered down to zero matches.

### 6.2 Wrapper recipes (informative)

- **Open + has selection** — Default state with the matched option set to `State=Selected + Focused`; rest set to `Enabled`.
- **Open + no selection** — Default state with all options at `Enabled`; first option at `Focused` (keyboard arrow lands here when the user navigates from the input).
- **Hovered option** — Default state with one option at `Focused` (mouse-hover or arrow-key share the same paint).
- **Mixed disabled options** — Default state with selected disabled options at `State=Disabled` (rare, set via `getOptionDisabled` at runtime).

### 6.3 Don'ts

- ❌ Don't paint the Paper with hex — bind via `background/paper-elevation-0` and apply `material-design/shadows/shadows-1` by style id.
- ❌ Don't stack `paint.opacity < 1` on the option Selected backgrounds — the alpha is pre-baked into the `component/autocomplete/option-*` tokens.
- ❌ Don't add a focus ring on the Paper or listbox — MUI does not render one. The option's `Focused` background is the only focus cue.
- ❌ Don't tint the option text on Selected — MUI does not bold or recolor; the bg tint is the only cue.
- ❌ Don't pair with a disabled input — disabled inputs cannot open the menu.
- ❌ Don't hand-author option rows. Always use `<AutocompleteOption>` instances; the menu's option-row paints / typography / radii live in that companion.

### 6.4 Open issues (drift)

These are tracked here so the next runtime-truth pass has a punch list.

1. **Listbox max-height** — Figma fixes `196 px` based on the MUI default. If a host overrides `slotProps.listbox.style.maxHeight`, the Figma cell will diverge. Re-author with a different fixed max-height only if a host uses a non-196 default consistently.
2. **Selected option paint stack** — runtime uses MUI's `palette.primary.main × (action.selectedOpacity + action.focusOpacity) = 0.08 + 0.04`. Custom themes that retune `selectedOpacity` / `focusOpacity` will diverge. Mint per-theme variants of the option-selected tokens if this becomes load-bearing. Documented in `design-token.md`.
3. **Loading message vertical alignment** — Figma uses `padding: 14 16 14 16` to hit a `48 px` total height. MUI runtime uses `padding: 14 16` on the `MuiAutocomplete-loading` slot, no fixed height — tall message text would grow the slot. Acceptable for single-line messages; multi-line would diverge.
4. **Group headers** — `groupBy` / `renderGroup` create sticky group-header rows in MUI runtime. Not modelled here; track as §7 trigger to add `<AutocompleteGroupHeader>`.

## 7. Source Sync Rule

This document and the source must move together. When **any** of the following changes:

1. `src/stories/Autocomplete.stories.tsx` (matrices, args, popper / loading / no-options handling)
2. The Figma `<AutocompleteMenu>` component set at `534:7976` (variants, properties, token bindings)
3. The Figma `<AutocompleteOption>` component set at `439:7109` — AutocompleteMenu stamps it inside the Default-state listbox; any change to its variant axes / token bindings cascades here
4. The shared `merak/seed/*`, `merak/alias/*` tokens consumed in §4.2 — particularly `seed/primary/main`, `alias/colors/text-sub`
5. The local `component/autocomplete/option-*` tokens documented in `design-token.md`, or the local `background/paper-elevation-0`, `material-design/shadows/shadows-1` styles
6. `.storybook/preview.tsx` (theme overrides) — today this is an empty `createTheme()`; introducing typography / palette / `MuiAutocomplete.defaultProps` overrides forces a re-measure
7. `package.json` `@mui/material` peer / dev version (currently `^7.3.10` / peer `>=7`)

…this spec **must be updated in the same change**. Specifically:

- **Adding `<AutocompleteGroupHeader>`** for `groupBy` support — introduce a new companion component, add `Group Header Count` semantics, update §3 / §5 / §7.
- **Promoting `Width` to a Figma property** — currently the cell is fixed at `280 px`. Hosts at non-default widths resize manually; if a host uses a consistently different width (e.g. `360 px` for compact toolbars), promote to a property and document.
- **Adding `Has Group Header` BOOLEAN** when group headers are stamped at the top of the listbox.
- **Adding `Option Count` as a Figma property** — currently designers stamp instances manually. Promoting to a property would automate the cell height math but would require nested instance overrides.
- **Token rename / removal in `merak/alias/*` or `merak/seed/*`** → update every reference in §2, §4, §10 and rename the matching variable in the local Figma collection.
- **Token value change in `component/autocomplete/option-*`** → no edit to this spec is required (Figma resolves through the same name); `design-token.md` records the resolution chain.
- **`@mui/material` major bump** → re-run `storybook.render.md` drift checks; bump the version row in §1; reconcile any new computed-style values against §4.

## 8. Quick Reference

```ts
// Source surface (from `@mui/material` Autocomplete, used directly in src/stories/Autocomplete.stories.tsx)
type AutocompleteMenuRuntime = {
  open: boolean;                                           // Figma: stamp <AutocompleteMenu> when true
  loading?: boolean;                                       // → Figma `State=Loading`
  loadingText?: React.ReactNode;                           // → Figma `Loading Text` (TEXT)
  noOptionsText?: React.ReactNode;                         // → Figma `No Options Text` (TEXT)
  options: T[];                                            // empty → Figma `State=NoOptions` (when !loading), else stamp <AutocompleteOption> instances
};
```

```
Figma Component Set: <AutocompleteMenu>  (534:7976) — published 2026-04-29
  Variant axes : State                              (3 cells: Default / Loading / NoOptions)
  Properties   : Loading Text (TEXT), No Options Text (TEXT)
  Composes     : <AutocompleteOption> (439:7109, 5 variants)
  Default      : State=Default
  Total        : 3 variants
```

## 9. Companion: `<AutocompleteOption>` (`439:7109`)

The popper's option rows are a separate component published next to `<AutocompleteMenu>`. They sit inside the listbox frame at instance level so designers can stamp option counts without authoring each row.

| Property      | Type    | Default                  | Purpose                                                                                  |
| ------------- | ------- | ------------------------ | ---------------------------------------------------------------------------------------- |
| `State`       | VARIANT | `Enabled`                | `Enabled`, `Focused`, `Selected`, `Selected + Focused`, `Disabled`. 5 variants.          |
| `Label`       | TEXT    | `Option`                 | Option text. Single line, truncates via Auto Layout.                                     |

Total variants: **5** (`State` axis only). One size — small/medium Autocomplete instances both render `36 px` option rows at runtime; Figma matches that.

### 9.1 Sizing & paint per state

| State              | Background                                                                | Text fill                       |
| ------------------ | ------------------------------------------------------------------------- | ------------------------------- |
| Enabled            | transparent                                                               | `alias/colors/text-default`     |
| Focused            | `alias/colors/bg-outline-hover` _(`0.04α`)_                                | `alias/colors/text-default`     |
| Selected           | `component/autocomplete/option-selected-bg` _(primary `0.08α`)_            | `alias/colors/text-default`     |
| Selected + Focused | `component/autocomplete/option-selected-focused-bg` _(primary `0.12α`)_    | `alias/colors/text-default`     |
| Disabled           | transparent                                                               | `alias/colors/text-disabled`    |

### 9.2 Layout

- Auto Layout horizontal frame, `padding: 6 16 6 16 px`, `min-height: 36 px`, `width: hug` (fills parent listbox width).
- Single text node, `body1` typography (Roboto Regular `16 / 24 px`, ls `0.15 px` — bind via local typography variable if present, else hand-set).

### 9.3 Wiring inside `<AutocompleteMenu>`

The Default-state listbox holds a vertical Auto Layout stack of `<AutocompleteOption>` instances. Designers stamp the rows manually. The selected option's `State=Selected + Focused` matches MUI's runtime behaviour where opening the popper auto-focuses the selected row.

## 10. Token Glossary

The complete set of tokens consumed by `<AutocompleteMenu>` directly. Tokens consumed via the nested `<AutocompleteOption>` instances are documented in §9.1 and the design-token.md.

### 10.1 Seed tokens (`merak/seed/*`)

| Token               | Used by                                                                  | Role                              |
| ------------------- | ------------------------------------------------------------------------ | --------------------------------- |
| `seed/primary/main` | Resolution chain for `component/autocomplete/option-selected-*` tokens (consumed via `<AutocompleteOption>`)   | Primary accent (`#1976D2`)        |

### 10.2 Alias tokens (`merak/alias/colors/*`)

| Token                          | Used by                                                                  | Role                              |
| ------------------------------ | ------------------------------------------------------------------------ | --------------------------------- |
| `alias/colors/text-default`    | Option text (Enabled / Focused / Selected / Selected+Focused) — via `<AutocompleteOption>` | `text.primary`, `0.87α`           |
| `alias/colors/text-sub`        | Loading / no-options message text                                         | `text.secondary`, `0.6α`          |
| `alias/colors/text-disabled`   | Option text (Disabled) — via `<AutocompleteOption>`                       | `text.disabled`, `0.61α`          |
| `alias/colors/bg-outline-hover`| Option background (Hovered / Focused) — via `<AutocompleteOption>`        | `action.hover`, `0.04α`           |

### 10.3 Component-scoped tokens (`component/autocomplete/*` — local to MUI-Library file)

Documented in `design-token.md`. Listed here for completeness:

| Token                                              | Used by                                  | Role                                      |
| -------------------------------------------------- | ---------------------------------------- | ----------------------------------------- |
| `component/autocomplete/option-selected-bg`        | `<AutocompleteOption>` background (Selected) | Pre-alpha'd `primary × 0.08α`             |
| `component/autocomplete/option-selected-focused-bg`| `<AutocompleteOption>` background (Selected + Focused) | Pre-alpha'd `primary × 0.12α`             |

### 10.4 Other local variables / styles

| Token                                | Used by                                  | Role                                      |
| ------------------------------------ | ---------------------------------------- | ----------------------------------------- |
| `background/paper-elevation-0`       | Paper background                         | `#FFFFFF` (shared with TextField label-notch). |
| `material-design/shadows/shadows-1`  | Paper effect                             | MD elevation 1 (3-layer drop-shadow stack). |
| `material-design/shape/borderRadius` (or hard-set `4`) | Paper corner radius          | `theme.shape.borderRadius`. Bind if available. |

### 10.5 Text styles & shape

- **Option text** — `body1` typography (Roboto Regular `16 / 24 px`, ls `0.15 px`). Apply by style id; bind via `material-design/typography/body1` if published, else hand-set Roboto Regular. Comes from `<AutocompleteOption>` companion.
- **Loading / no-options message** — `body2` typography (`14 / 20 px`).
- **Paper corner radius** — `4 px`, matches MUI `theme.shape.borderRadius = 4`.
- **No focus ring** on listbox / option / Paper. The option's `Focused` bg tint is the only visual cue.

### 10.6 Typography (resolved values)

`<AutocompleteMenu>` consumes MUI defaults with no project override:

- Family: `Roboto, Helvetica, Arial, sans-serif`
- Weight: `Regular (400)`
- Option text: `16 / 24 px`, ls `0.15 px` — via `<AutocompleteOption>`
- Loading / no-options message: `14 / 20 px`, ls `0.15 px`

If the project introduces typography tokens (e.g. `merak/typography/option-*`), update §4.1 and §10.6 to bind to them.

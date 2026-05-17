---
name: figma-component-pin-input-spec
description: Figma component specification for `<PinInput>` — design counterpart of the project-local PinInput composer in `src/stories/PinInput.stories.tsx` (assembled from MUI primitives because `@mui/material` ships no `<PinInput>`). Documents the variant matrix (Character × Label × Helper = 2 × 2 × 2 = 8), the per-cell `<TextField variant="outlined" size="small">` composition, source-to-Figma mapping, layout / token bindings, and the divergence from MUI runtime + reference Figma. For runtime measurements see `storybook.render.md`; component-scoped tokens are documented in `design-token.md`.
parent_skill: figma-components
figma_file_key: <FIGMA_FILE_KEY>
figma_node_id: '<NODE_ID>'
figma_component_set_id: '<NODE_ID>'
figma_item_component_set_id: '<NODE_ID>'
---

# `<PinInput>` Figma Component Specification

## 1. Overview

`<PinInput>` is the Figma counterpart of the project-local PinInput composer defined inline in `src/stories/PinInput.stories.tsx`. **`@mui/material` does not ship a `<PinInput>` runtime** (MUI X PinField is a separate library and not consumed by this project), so the runtime contract is the in-story composer that assembles MUI primitives:

- one `<FormControl error disabled component="fieldset">` shell;
- (optional) one `<FormLabel component="legend">` "Label";
- one `<Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ py: 0.5 }}>` row of N `<TextField variant="outlined" size="small">` cells (each `width: 40 px`, `inputProps.maxLength: 1`, `inputProps.style: { textAlign: 'center', padding: '8px 0' }`) separated by inline `<span>-</span>` glyphs;
- (optional) one `<FormHelperText>` "Helper text" line.

State (`error` / `disabled` / `focusedIndex`) is **per-cell**, not row-level — the composer forwards the props onto each `<TextField>` instance. The Figma component therefore models 2 × 2 × 2 = 8 variants — `Character ∈ {4, 6}` × `Label ∈ {True, False}` × `Helper ∈ {True, False}` — and **does not introduce a row-level `State` axis**. Designers paint per-cell focus / error / disabled by overriding the nested `<TextField>` instance state inside a `<PinInput>` instance.

The editable Figma node `<NODE_ID>` on the **Foundation Components** page was an empty 1122 × 858 white frame at the start of this pipeline; the published COMPONENT_SET (`<NODE_ID>`) was authored inside it during step 5 (2026-05-08). Frontmatter `figma_node_id` pins the parent frame; `figma_component_set_id` pins the published set. The reference-only **documentation page** at `<NODE_ID>` in the 天璇 file (`<FIGMA_FILE_KEY>`) hosts a published `<PinInput>` whose two variants are `<NODE_ID>` (`Character=4`) and `<NODE_ID>` (`Character=6`); the aspect table below cites those inner Components. We mirrored its **shape** (variant axes, property API, cell composition, separator glyph, layout) and its **FormLabel paint** (`text-default`, `87 % α`), which matches the local design system (the project does not ship a `text-secondary` token — see §7 #5). The MUI runtime resolves FormLabel + resting FormHelperText to `text.secondary` (`60 % α`); the published Figma cell follows the project convention. See §7 for the full divergence list.

| Aspect              | Value                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- |
| Source story        | `src/stories/PinInput.stories.tsx`                                                     |
| Underlying source   | Project-local composer assembling `@mui/material` `FormControl` + `FormLabel` + `Stack` + N × `TextField variant="outlined" size="small"` + `FormHelperText`. **No MUI `<PinInput>` runtime exists** — composition is the runtime. |
| Underlying MUI      | `@mui/material` 7.3.10 (resolved from `package.json` on 2026-05-08)                    |
| Figma file          | `<FIGMA_FILE_KEY>` (MUI-Library)                                                 |
| Figma frame         | `Pin Input` (`<NODE_ID>`) — 1122 × 858, page **Foundation Components**                 |
| Component Set       | `<PinInput>` (`<NODE_ID>`) — published 2026-05-08, 8 variants, inside `<NODE_ID>`      |
| Reference-only set  | `<PinInput>` `<NODE_ID>` / `<NODE_ID>` in 天璇 (`<FIGMA_FILE_KEY>`) — visual source |
| Sibling primitive   | `<TextField>` (`<NODE_ID>`) — published in this file; PinInput cells are **nested INSTANCE** references to the `Variant=Outlined, Size=Small` cell of this set |
| Total variants      | **8** (2 Characters × 2 Label × 2 Helper)                                              |
| Typography          | `material-design/typography/body1` text style applied by id to FormLabel + Separator (Noto Sans TC Regular 16 / 24 in this file's local catalogue; MUI runtime resolves to Roboto Regular 16 / 23 — see `render.md §3 / §4` for the runtime values). `material-design/typography/caption` applied to FormHelperText (Noto Sans TC Regular 12 / 20 locally; runtime Roboto 12 / 19.92). All sourced from local `material-design/typography/*` text styles applied by id (no hand-set TEXT). The runtime / Figma font-family divergence is project-wide — Button, Tooltip, Chip, Snackbar all hand-author MUI fonts identically. See §7 #8 for the divergence. |
| Local-only bindings | **Required.** Every paint resolves to a variable in this file's local collection. The cells reuse `<TextField>`'s already-local bindings; only the `paint.label.*`, `paint.helper.*`, and `paint.separator.text` paints on the wrapper are bound here, and they all map to existing `mui/alias/*` and `mui/seed/*` tokens. No component-scoped tokens are needed — see [`design-token.md`](./design-token.md) for the declared-empty audit. |

## 2. Source-to-Figma Property Mapping

| Source surface                                                      | Figma property | Type    | Notes                                                                                                                |
| ------------------------------------------------------------------- | -------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| Composer prop `length` (`4 | 6`)                                    | `Character`    | VARIANT | `4` / `6`. The two published cell counts. The number of inner `<TextField>` instances + `(N − 1)` separators flexes per Variant. |
| Composer prop `label` (truthy)                                      | `Label`        | BOOLEAN | `True` / `False`. Toggles the visibility of the top FormLabel TEXT row. Default `True` mirroring the reference Figma. |
| Composer prop `helperText` (truthy)                                 | `Helper`       | BOOLEAN | `True` / `False`. Toggles the visibility of the bottom FormHelperText TEXT row. Default `False` (matches MUI runtime — helper only renders when `helperText` is provided). |
| Composer prop `label` (string content)                              | `Label Text`   | TEXT    | Default `Label`. Bound to the FormLabel TEXT node's `characters`. Visible only when `Label=True`.                    |
| Composer prop `helperText` (string content)                         | `Helper Text`  | TEXT    | Default `Helper text`. Bound to the FormHelperText TEXT node's `characters`. Visible only when `Helper=True`.        |
| Composer prop `error`                                               | —              | —       | **Not modeled as a row-level VARIANT.** The published Figma cell is the resting (Enabled) row. Designers paint Error by overriding each nested `<TextField>` instance's `State` to `Error`. The FormLabel + FormHelperText paint shifts (label → `seed/danger/main`, helper → `seed/danger/main`) are not auto-applied — designers also rebind those TEXT fills by overriding the wrapper's `Label Text Color` / `Helper Text Color` if needed (see §7 #2 for the trade-off). |
| Composer prop `disabled`                                            | —              | —       | Not modeled as a VARIANT. Designers paint Disabled by setting every nested `<TextField>` cell to `State=Disabled`; the FormLabel / FormHelperText paint shifts are an opt-in override per §7 #2. |
| Composer prop `focusedIndex`                                        | —              | —       | Not modeled as a VARIANT. Designers paint focus by setting **one** nested `<TextField>` cell to `State=Focused`; the rest stay at `Enabled`. Mirrors real keyboard interaction (one cell focused at a time). |
| Composer prop `values: ReadonlyArray<string>`                       | —              | —       | Not modeled as a per-cell TEXT property on the wrapper because Figma cannot bridge a single TEXT property to N indexed children. Designers fill character values by overriding each nested `<TextField>` cell's `Value` TEXT individually. See §7 #3. |
| Composer prop `cellOverrides: ReadonlyArray<Partial<TextFieldProps>>` | —            | —       | Not modeled — the override surface is purely a runtime Storybook convenience for the `PartialEntry` story. The Figma counterpart is the standard "override nested instance" workflow. |
| Composer prop `separator`                                           | `Separator Text` | TEXT  | Default `-`. Bound to **every** separator TEXT node's `characters`. Replacing the separator (e.g. ` ` for spaces, `·` for a middle-dot) shifts every separator glyph in lock-step. |
| Composer prop `cellWidth`                                           | —              | —       | Behavior-only knob exposed for runtime experimentation; the Figma cell is fixed at `box.cell.width = 40 px` (see `storybook.render.md` §9). Re-add as a `Cell Width` axis only if the design system grows a different cell size. |

### 2.1 No row-level State axis

`<PinInput>` does **not** publish a `State` Variant axis (Enabled / Hovered / Focused / Disabled / Error). Three reasons:

1. **Per-cell semantics.** State is per-cell at runtime — only one cell can hold the keyboard caret, and Disabled cells coexist with focused / empty cells (the canonical "Use Case > Example 01" row in the reference Figma is `1 | 2 | 3 | [focused empty] | empty | empty`). Modeling row-level state would force every cell into the same paint, which falsifies the partial-entry case.
2. **Variant-matrix economy.** A row-level State axis with 5 values would multiply the matrix to 40 cells (8 × 5) for zero structural delta — every "row-level Error" cell is just 6 nested `<TextField>` instances overridden to `State=Error`. The override path is already the canonical pattern for the inner primitive.
3. **Source contract.** The composer accepts row-level `error` / `disabled` props as a convenience, but they only forward to each cell's `error` / `disabled`. The Figma "override the nested instance" workflow expresses the same intent without a published axis.

The trade-off: FormLabel and FormHelperText paint shifts (`text-secondary → seed/danger/main`, `→ text-disabled`) are not driven automatically by the inner-cell state. Designers needing the Error label / helper paints flip the wrapper's `Label Text Color` / `Helper Text Color` overrides by hand, or detach. See §7 #2.

### 2.2 No Variant axis (single visual variant)

The reference Figma's `<PinInput>` has only the `Character` axis — there is no `Filled` / `Standard` axis. We mirror that. Adding a `Variant` axis (e.g. supporting `<TextField variant="filled">` or `variant="standard">` cells) would multiply the matrix to 24 cells (8 × 3) — track in §8 if the design system grows that requirement.

## 3. Variant Property Matrix

```
Character × Label × Helper   =   2 × 2 × 2   =   8 variants
```

| Property    | Default value | Options                   |
| ----------- | ------------- | ------------------------- |
| `Character` | `4`           | `4`, `6`                  |
| `Label`     | `True`        | `True`, `False`           |
| `Helper`    | `False`       | `True`, `False`           |

The **`Character` default of `4`** mirrors the most-common one-time-code length (TOTP, SMS-MFA short code) and matches the reference Figma's authored default. The **`Label` default of `True`** mirrors the reference Figma; it diverges from the composer's TypeScript default (`label: 'Label'` is set in the Storybook `meta.args`, so the runtime always defaults to *with* label). The **`Helper` default of `False`** mirrors MUI runtime — `<FormHelperText>` only renders when `helperText` is set.

### 3.1 Component (non-variant) properties

Property names below are the human-readable keys; Figma's internal property ids carry a `#NNNN:N` suffix (e.g. `Label Text#3025:0`) that is not stable across re-publishes — never reference the suffix outside frontmatter.

| Property key      | Type    | Default        | Purpose                                                                                                                                          |
| ----------------- | ------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Label Text`      | TEXT    | `Label`        | FormLabel text content. Bound to the top label TEXT node's `characters`. Visible only when `Label=True`.                                         |
| `Helper Text`     | TEXT    | `Helper text`  | FormHelperText text content. Bound to the bottom helper TEXT node's `characters`. Visible only when `Helper=True`.                               |
| `Separator Text`  | TEXT    | `-`            | Separator glyph between cells. Bound to **every** separator TEXT node's `characters` (per-variant: 3 separators in `Character=4`, 5 in `Character=6`). |

No `INSTANCE_SWAP` properties — the inner `<TextField>` cells are nested INSTANCE references to the `<TextField>` set's `Variant=Outlined, Size=Small, State=Enabled, Has Value=False, Multiline=False` variant (the COMPONENT_SET id is `<NODE_ID>`; the specific variant Component this PinInput build instances is `<NODE_ID>`, a child of that set). Designers override per-cell state / value by entering the published instance and changing its `State` / `Has Value` / `Value` properties.

No `BOOLEAN` properties beyond `Label` / `Helper` — those two visibility toggles are sufficient because every other variation is per-cell.

No `SLOT` properties — the composer doesn't take a `children` prop; the cells are fixed-shape `<TextField>` instances, not arbitrary content. Slot-first (`figma-operator-guide` component-rules.md §3) does **not** apply here because (a) the cells are enumerable and homogeneous, and (b) the inner content (a single character) has no future need for composition. If a future PR introduces a "show icon + character" hybrid cell, revisit and SLOT-ify each cell.

## 4. Design Tokens

For the canonical numeric / hex constants this section binds against, see [`storybook.render.md` §9 Canonical Constants](./storybook.render.md#9-canonical-constants). Every value below cites a constant by name.

### 4.1 Sizing

| Region                                | Property                          | Value                                                                                  |
| ------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| Wrapper FormControl                   | `layoutMode`                      | VERTICAL                                                                               |
| Wrapper FormControl                   | `itemSpacing`                     | `0` (FormLabel + Row + FormHelperText sit at their own resting margins)                |
| Wrapper FormControl                   | padding                           | `0`                                                                                    |
| Wrapper FormControl                   | width                             | HUG                                                                                    |
| Row container (`Stack`)               | `layoutMode`                      | HORIZONTAL                                                                             |
| Row container                         | `itemSpacing`                     | `box.row.gap` (`= 8 px`, see render.md §9)                                             |
| Row container                         | `paddingTop` / `paddingBottom`    | `box.row.padding-y` (`= 4 px`)                                                         |
| Row container                         | `paddingLeft` / `paddingRight`    | `box.row.padding-x` (`= 0 px`)                                                         |
| Row container                         | counter-axis alignment            | CENTER (Stack `alignItems="center"`)                                                   |
| Row container                         | primary-axis alignment            | CENTER (Stack `justifyContent="center"`)                                               |
| Per-cell `<TextField>` instance       | width                             | `box.cell.width` (`= 40 px`)                                                           |
| Per-cell `<TextField>` instance       | height                            | `box.cell.height` (`= 40 px`)                                                          |
| Separator TEXT                        | width / height                    | HUG (`~9.84 × 24 px` natural for `-` glyph at `type.separator.*`)                      |
| FormLabel TEXT                        | width                             | HUG                                                                                    |
| FormLabel TEXT                        | margin-bottom (Auto Layout itemSpacing on the wrapper) | `box.label.margin-bottom` (`= 0 px`)                              |
| FormHelperText TEXT                   | margin-top                        | `box.helper.margin-top` (`= 3 px` — encoded as `paddingTop: 3 px` on a wrapper Auto Layout that hosts the helper TEXT, since FormControl is HUG vertically with `itemSpacing: 0`) |
| FormHelperText TEXT                   | margin-left / margin-right        | `box.helper.margin-x` (`= 14 px` — encoded as `paddingLeft: 14 px` / `paddingRight: 14 px` on the same helper-host wrapper) |
| Per-cell input padding (informational — owned by the nested `<TextField>` instance) | `paddingTop` / `paddingBottom` / `paddingLeft` / `paddingRight` | `box.input.padding-y` / `box.input.padding-x` — **not re-applied here**; the published `<TextField>` cell encodes its own padding (see [`<TextField>` spec §4 / §6](../TextField/figma.spec.md)). The composer's `inputProps.style.padding: '8px 0'` shifts the runtime input to `box.input.padding-x` (`= 0 px`, text-aligned center); the Figma cell preserves the published `<TextField>` padding for visual parity. See §7 #4 for the runtime-vs-Figma divergence. |

### 4.2 Color token bindings

Every paint is bound by name. Constants cite `storybook.render.md` §9 verbatim.

| Layer                                        | Figma property                | Token / constant                                                              | Source                                          |
| -------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------- |
| `<PinInput> / FormControl` background        | `fills`                       | _none_ (transparent — wrapper paints nothing)                                 | `render.md §1`                                  |
| `<PinInput> / FormLabel` TEXT fill (resting) | `fills[0]` (text-fill)        | `mui/alias/colors/text-default` ⇒ `paint.label.enabled` (project convention — see §7 #5) | `render.md §4` (Enabled column)     |
| `<PinInput> / FormHelperText` TEXT fill (resting) | `fills[0]` (text-fill)   | `mui/alias/colors/text-default` ⇒ `paint.helper.enabled` (project convention — see §7 #5) | `render.md §5` (Enabled column)     |
| `<PinInput> / Row / Separator` TEXT fill     | `fills[0]` (text-fill)        | `mui/alias/colors/text-default` ⇒ `paint.separator.text`                    | `render.md §3`                                  |
| `<PinInput> / Row / <TextField>` instance    | _(every paint)_               | inherited from the published `<TextField>` cell — no additional binding here  | `render.md §2` + `<TextField>` spec §4 / §6     |

Per-cell paint bindings (border, fill, text) are owned by the nested `<TextField>` instance — the PinInput wrapper does not re-bind them. This is the "Wrapper + atom" archetype's local-only contract: every paint reaches a local variable, but the wrapper only owns the paints that are *not* already covered by the inner primitive.

#### 4.2.1 Optional Error / Disabled label & helper paints

These are **not** auto-driven by inner-cell state (per §2.1). Designers who want the row-level paint shift override the wrapper's TEXT fills by hand — keep the override list short:

| Layer                        | Default                                       | Error override                                  | Disabled override                                  |
| ---------------------------- | --------------------------------------------- | ----------------------------------------------- | -------------------------------------------------- |
| FormLabel `fills[0]`         | `mui/alias/colors/text-default`             | `mui/seed/danger/main` ⇒ `paint.label.error`  | `mui/alias/colors/text-disabled` ⇒ `paint.label.disabled` |
| FormHelperText `fills[0]`    | `mui/alias/colors/text-default`             | `mui/seed/danger/main` ⇒ `paint.helper.error` | `mui/alias/colors/text-disabled` ⇒ `paint.helper.disabled` |

If this override pattern proves load-bearing in real screens, promote it to a `Label State` enum component property in a follow-up PR (see §8).

### 4.3 State rules

The published cells are all `Enabled` resting state. State painting happens at the **nested `<TextField>` instance** layer. The cookbook is:

1. **Empty resting** — every cell `State=Enabled, Has Value=False`. Outline at `border.cell.width-resting` and `paint.cell.border.enabled` (see `render.md §9`). Default for every variant the day it's published.
2. **Filled resting** — every cell `Has Value=True, Value=<digit>`. Outline unchanged from Empty (Outlined-Filled doesn't shift the resting border). Input `<text>` color `paint.input.text.enabled`.
3. **Focused single cell** — exactly one cell (the next-empty index) `State=Focused`. Border at `border.cell.width-focused` and `paint.cell.border.focused`. The other cells stay at resting `Enabled` paint.
4. **Disabled whole row** — every cell `State=Disabled, Has Value=True/False`. Border at `border.cell.width-resting` and `paint.cell.border.disabled`. Input `<text>` color `paint.input.text.disabled`. Optionally rebind FormLabel + FormHelperText fills per §4.2.1.
5. **Error whole row** — every cell `State=Error`. Border at `border.cell.width-resting` and `paint.cell.border.error`. Input `<text>` color `paint.input.text.enabled` (unchanged). Helper visible (`Helper=True`) with content "Helper text" (or the actual error copy). Optionally rebind FormLabel + FormHelperText fills per §4.2.1.
6. **Partial entry (the canonical use case)** — first M cells `State=Disabled, Has Value=True, Value=<digit>`, the (M+1)th cell `State=Focused, Has Value=False`, the remaining (N − M − 1) cells `State=Enabled, Has Value=False`. See `render.md §7 (PartialEntry)` for the runtime contract.

State stacking — MUI's `<TextField>` ships `Error + Focused` as a single `State=Error` paint (the focused border-width at `border.cell.width-focused` is preserved if both flags are active, but the color stays `paint.cell.border.error`). The published `<TextField>` set in this file does **not** model `State=Error+Focused` separately — designers picking `Error` already get the Error border-color; they cannot also stack focus on a single cell within an Error row. If this combination is needed (visualizing focus while the row is in error), file a §8 trigger and add the dedicated cell to `<TextField>`.

## 5. Icons

`<PinInput>` has no icon slots of its own. The nested `<TextField>` cells own their own `Adorn. Start` / `Adorn. End` SLOTs (per the `<TextField>` spec §6.5), but PinInput doesn't expose them — designers entering a `<TextField>` instance can opt into adornments per cell, but the published `<PinInput>` cells are authored without adornments because (a) a PIN cell is too narrow for an adornment + character, and (b) MFA UX does not pair adornments with PIN cells at runtime.

If a design need arises (e.g. a leading lock icon on the first cell, a trailing checkmark on the last cell when all values are correct), it lives at the consumer level — designers detach a `<PinInput>` instance and recompose. Do **not** add an `Adornment` axis to `<PinInput>`; the override path on the inner `<TextField>` is the canonical surface.

## 6. Layout

### 6.1 Component set grid

The 8 variants are laid out as 8 sibling Components inside the published COMPONENT_SET. Variant naming follows Figma's `Property=Value` convention with `, ` separators — e.g. `Character=4, Label=True, Helper=False`. Conceptually the surface is a `4 × 2` grid keyed by `(Character × Label)` columns and `Helper` rows:

```
                                Character=4                  Character=6
                          Label=T       Label=F        Label=T       Label=F
Helper=F  (no helper)     L+row4        row4           L+row6        row6
Helper=T  (with helper)   L+row4+H      row4+H         L+row6+H      row6+H

  L  = FormLabel "Label" (top)
  H  = Helper Container ("Helper text", bottom)
  rowN = HORIZONTAL row of N <TextField> cells alternating with (N - 1) "-" separators
```

The published cell heights per variant differ because adding the FormLabel adds `header.label.height` of vertical space and adding the Helper Container adds `header.helper.height` (both defined in `render.md §9`). Row widths differ by Character: 4-cell variants resolve to `row4.width`, 6-cell variants to `row6.width` — see `render.md §9` for the formulas and `render.md §1` for the runtime-measured totals.

### 6.2 Surrounding documentation frame

The `Pin Input` frame (`<NODE_ID>`) is the documentation wrapper that hosts the published COMPONENT_SET (`<NODE_ID>`) at `(x=32, y=32)` and the **Use Case** panel (`<NODE_ID>`) at `(x=480, y=32)` side-by-side. The frame currently measures `1152 × 1103 px` — sized to fit both children with `32 px` right / bottom padding.

The Use Case panel is a `640 px`-wide VERTICAL Auto Layout with `32 px` padding and `32 px` itemSpacing, hosting one Title + three Sections. Each Section is a Heading (body1-bold) + Caption (caption, `text-sub`) + Content frame (Auto Layout with light grey bg `alias/colors/bg-disabled`, 16 px inset padding) populated by published `<PinInput>` instances and per-cell overrides.

| Section            | Node id     | Content                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **States**         | `<NODE_ID>` | Three example rows mirroring the reference 天璇 file (`<NODE_ID>`)'s `Example 01` block — every row uses `Character=6`, `Label=True`. Row 1 (`<NODE_ID>`) — Default (every cell `State=Enabled, Has Value=False`). Row 2 (`<NODE_ID>`) — Error (every cell `State=Error`; FormLabel + Helper Text fills rebound to `seed/danger/main` per §4.2.1). Row 3 (`<NODE_ID>`) — Partial entry (cells 0..2 `State=Disabled, Has Value=True, Value=1/2/3`; cell 3 `State=Focused`; cells 4..5 default). |
| **Character lengths** | `<NODE_ID>` | Two side-by-side `Label=True, Helper=False` instances — `Character=4` (`<NODE_ID>`) and `Character=6` (`<NODE_ID>`). The two wrap vertically because their combined width exceeds the panel's `576 px` content area; this is intentional and uses Auto Layout `wrap`. |
| **Custom separator** | `<NODE_ID>` | Two `Character=6, Label=False, Helper=False` instances overriding `Separator Text` to `·` (`<NODE_ID>`) and ` ` (whitespace, `<NODE_ID>`).                                                                                                                                                                                                                                                       |

### 6.2.1 Use Case sync rule

Whenever §3 / §4 / §7 of this spec changes such that the on-canvas examples no longer reflect the contract, also update the Use Case panel:

- New / removed Variant axis value → add or remove the corresponding **Character lengths** row.
- New §4.2.1 paint override pattern (e.g. row-level Hovered) → add a row to **States**.
- New §4.3 cookbook entry → add a row to **States** demonstrating the cookbook combination.
- Spec-level rename of a TEXT property → enter the affected example instances and override the new property key.
- Reviewer feedback that an example is misleading → fix the override on the named instance node id from §6.2 above; do not detach.

### 6.3 Per-cell layout

Each published variant's row is a HORIZONTAL Auto Layout with:

- `itemSpacing = box.row.gap` (`= 8 px`)
- `paddingTop = paddingBottom = box.row.padding-y` (`= 4 px`)
- `paddingLeft = paddingRight = box.row.padding-x` (`= 0 px`)
- `counterAxisAlignItems = CENTER`
- `primaryAxisAlignItems = CENTER`

Children alternate `<TextField>` instance — separator TEXT — `<TextField>` instance — separator TEXT — … — `<TextField>` instance. For `Character=4`: 4 TextFields + 3 separators = 7 children. For `Character=6`: 6 TextFields + 5 separators = 11 children.

When `Label=True` is added, a single FormLabel TEXT sits above the row inside the wrapper VERTICAL Auto Layout. When `Helper=True` is added, a single FormHelperText TEXT (wrapped in a HORIZONTAL Auto Layout that supplies the `box.helper.margin-x` left/right padding and `box.helper.margin-top` top padding) sits below the row.

## 7. Usage Guidelines & Divergences

### 7.1 Picking a variant

1. **Pick `Character`** — `4` for short codes (TOTP, MFA SMS short variants), `6` for full TOTP / RSA / longer codes. If you need a different cell count, use the longer Variant and hide cells via opacity overrides (a hack — file a §8 trigger to mint a new `Character` value).
2. **Pick `Label`** — `True` when the input is in a form with sibling labeled controls; `False` when it sits on a dedicated MFA / OTP screen with a screen-level heading.
3. **Pick `Helper`** — `True` when accompanying the input with a hint (`"Enter the 6-digit code we sent to …"`) or an error message; `False` otherwise.
4. **Override `Label Text` / `Helper Text` / `Separator Text`** — type the actual copy. Keep separator to a single character; replacing with `·` / ` ` / `–` is fine; multi-character separators (`. .`) break Auto Layout because separator TEXT is HUG-width.
5. **For non-resting state** — enter the variant instance, override each nested `<TextField>` cell's `State` / `Has Value` / `Value` per the §4.3 cookbook. Optionally rebind `Label Text` / `Helper Text` fills per §4.2.1.

### 7.2 Don'ts

- ❌ Don't detach a `<PinInput>` instance to swap the inner `<TextField>` for a different-style input. The cells are tied to the published `<TextField>` set and will inherit any future spec change there.
- ❌ Don't paint a PinInput cell with raw hex values. Every paint must bind to a token from §4 / `<TextField>` spec §4.
- ❌ Don't model row-level Error / Disabled / Focused as a Variant axis on this component (per §2.1). If the design requires it, propose a `<PinFormControl>` wrapper that handles the row-level paint shifts via a dedicated axis — but only after the override pattern in §4.2.1 has shipped to production and proven insufficient.
- ❌ Don't introduce a `Variant` axis (e.g. `Filled` / `Standard`) for the inner cells. The reference Figma never exposed it; the runtime composer pins `variant="outlined"`. Adding it is a §8 trigger.
- ❌ Don't expose `cellWidth` as a Figma axis. The `box.cell.width` cell is the design-system convention; `<PinInput Character=*>` instances are visually predictable only at one cell size.
- ❌ Don't apply node-level `opacity < 1` on a PinInput cell. The disabled / error paints are bound at the inner `<TextField>` level; pairing them with a wrapper `paint.opacity` would re-flatten on instance creation (per `figma-operator-guide` tokens.md).

### 7.3 Documented divergences from MUI runtime / reference Figma

1. **Notch overhang (visible vs Figma).** MUI Outlined `<input>` reserves `box.cell.notch-overhang` above the input row for a floated-label notch; runtime cells render `box.cell.width × 39 px` visible (per `render.md §2`) with the fieldset's outer box `5 px` taller. The Figma cell flattens this — the published `<TextField Variant=Outlined>` cell is `box.cell.width × box.cell.height` visible with no overhang. Captured because PinInput cells never float a label, so the overhang is dead space the runtime accepts but the Figma model hides for visual cleanliness. Re-validate if MUI 8.x removes the notch reservation.
2. **Row-level paint shifts not auto-driven.** The composer's `error` / `disabled` props auto-shift FormLabel + FormHelperText paints at runtime (`text-secondary → seed/danger/main` / `text-disabled`). The Figma component does **not** auto-shift these — designers rebind `Label Text Color` / `Helper Text Color` by hand (§4.2.1). Trade-off: a row-level `State` axis would force every nested cell into the same paint, which falsifies the partial-entry case (§2.1). Promote to a `Label State` enum property if the override pattern proves load-bearing.
3. **No row-level `Value` / `values` property.** Figma cannot bridge a single TEXT property to N indexed children (without an array-shaped property type that doesn't exist in the API). Designers fill character values by overriding each nested `<TextField>` cell's `Value` TEXT individually. Workaround: type the value once in the first cell, then duplicate-paste — slow but reliable. If a design tool gains array-shaped properties, revisit.
4. **Cell horizontal padding (Figma vs runtime composer).** The published `<TextField Variant=Outlined, Size=Small>` cell encodes its own `paddingLeft / paddingRight` (defined in [`<TextField>` spec §4 / §6](../TextField/figma.spec.md) — currently a non-zero outlined-small horizontal padding). The runtime composer's `inputProps.style.padding: '8px 0'` overrides the input element to `box.input.padding-x` (`= 0 px`, see `render.md §9`) so the single character sits centered in a `box.cell.width` cell. The Figma cell preserves the published `<TextField>` cell's horizontal padding (the underlying TEXT is HUG-width with `textAlign: CENTER`, so a single-character value still appears centered). The visible glyph position is identical between Figma and runtime when the value is a single character. Diverges only if a consumer raises `inputProps.maxLength` past `1` — runtime then renders the value flush-left; Figma still indents by the inner `<TextField>`'s padding. Acceptable because the composer pins `maxLength=1`.
5. **FormLabel + FormHelperText paint (project convention vs MUI runtime).** MUI runtime resolves FormLabel + resting FormHelperText to `text.secondary` (`60 % α`). The local design system (`mui` collection) does **not** ship a `text-secondary` token — its closest semantic neighbour is `alias/colors/text-default` (`87 % α`), which the reference Figma's `<PinInput>` and the existing TextField cells already use. The published `<PinInput>` here follows the project convention (`text-default`) over the MUI runtime. If the design system grows a `text-secondary` token in a future PR, rebind the FormLabel + FormHelperText fills here in §4.2 and update `render.md §4` / §5 / §9.
6. **No published `<PinInput>` runtime in `@mui/material`.** The composer is project-local. If the team upgrades to MUI X PinField (which does ship a real `<PinInput>` with row-level state and per-cell value props), revisit the entire spec — most divergences above will dissolve and the row-level State axis becomes feasible.
7. **Helper text indentation matches MUI default, not the cell row.** FormHelperText sits with `box.helper.margin-x` left / right (MUI default). The cell row is `box.row.padding-x` left / right padded (`= 0 px`). Visually the helper is indented `box.helper.margin-x` from the left edge of the FormControl, which sits flush-left with the leftmost cell — so the helper text appears to start that many pixels inside the leftmost cell's left edge. This is the runtime contract; mirror it in Figma rather than tightening to the cell edge.
8. **Font family (Figma vs MUI runtime).** The local `material-design/typography/body1` and `material-design/typography/caption` text styles use `Noto Sans TC` (the project's design-system primary face), while MUI runtime resolves `typography.fontFamily` to `Roboto, Helvetica, Arial, sans-serif`. The published `<PinInput>` cells apply the local text styles by id (so they get Noto Sans TC); the runtime measurement in `render.md §3 / §4 / §5` captures the Roboto resolution. This is a project-wide divergence — every other MUI re-export (`<Button>`, `<TextField>`, `<Tooltip>`, `<Chip>`, `<Snackbar>`) accepts the same trade-off. Re-evaluate only if the project ships a dedicated Roboto text-style family.

## 8. Source Sync Rule

Whenever any of the following inputs change, the spec, Storybook story, and Figma cells must move together:

| Trigger                                                                                                  | Required edits                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Composer prop surface changes in `src/stories/PinInput.stories.tsx` (e.g. new `length=8` value, new `cellWidth` default) | (1) Update §2 / §3 / §4 / §6 in this spec. (2) Re-run Chrome DevTools MCP measurements + update `render.md` §1 / §6 / §9. (3) Add the new variant cell to the Figma COMPONENT_SET via `use_figma`. (4) Update §1's `Total variants` count.                                                                                                              |
| `<TextField>` spec changes (new state, new size, new Variant) — `.claude/skills/figma-components/TextField/figma.spec.md` | (1) Re-validate the nested instance reference still resolves (cell layer paths in §6.3 / §4.1 still match). (2) If `<TextField>`'s default `Variant=Outlined, Size=Small` cell is renamed or removed, repoint the nested instance and bump the `figma_textfield_component_set_id` in frontmatter if the set was re-published. (3) Bump §1's `Underlying MUI` row if MUI version moved. |
| MUI palette / typography override added to `mui-theme.ts` (project-level theme)                          | (1) Re-run `render.md` measurements. (2) Update `paint.label.*` / `paint.helper.*` / `paint.separator.text` / `paint.input.text.*` constants in `render.md §9`. (3) Rebind the wrapper TEXT fills here in §4.2 if the constant name changed. (4) If a new role (e.g. `palette.text.tertiary`) appeared, propose a wrapper-property override per §4.2.1.    |
| Reference Figma (天璇 `<PinInput>`) redesigns its variant axes                                            | Revisit only when the team explicitly chooses to mirror it again. Default position: this Figma component is the source of truth, not the reference.                                                                                                                                                                                                     |
| MUI X PinField is added to `package.json` and adopted as the runtime                                     | Replace the inline composer in `src/stories/PinInput.stories.tsx` with the MUI X import; revisit every §7 divergence (most will close); model the new runtime's `length` / `value` / `state` props as proper Figma axes; bump §1.                                                                                                                       |
| Runtime `paint.cell.border.*` changes (e.g. MUI repaints Outlined border-color)                          | (1) Update `render.md §6` + `§9 Constants`. (2) Re-publish `<TextField>` set with the new tokens. (3) Re-validate every PinInput cell's nested instance — they should pick up the change automatically because PinInput uses INSTANCE references. (4) If automatic propagation fails, re-author per §6.3.                                              |

## 9. Quick Reference

### TS surface

```ts
type PinInputProps = {
  length?: 4 | 6;                              // Figma `Character`
  values?: ReadonlyArray<string>;              // not modeled (per-cell override)
  label?: React.ReactNode;                     // Figma `Label` (BOOLEAN) + `Label Text` (TEXT)
  helperText?: React.ReactNode;                // Figma `Helper` (BOOLEAN) + `Helper Text` (TEXT)
  error?: boolean;                             // not modeled (override per-cell `<TextField>`)
  disabled?: boolean;                          // not modeled (override per-cell `<TextField>`)
  focusedIndex?: number;                       // not modeled (override one cell's `<TextField>` State=Focused)
  separator?: React.ReactNode;                 // Figma `Separator Text` (TEXT)
  cellWidth?: number;                          // not modeled (Figma fixes box.cell.width = 40)
  cellOverrides?: ReadonlyArray<Partial<TextFieldProps>>;  // not modeled (runtime escape hatch)
};
```

### Figma summary

- **COMPONENT_SET** name: `<PinInput>`
- **Frame**: `Pin Input` (`<NODE_ID>`), page **Foundation Components**
- **Variants**: 8 = `Character ∈ {4, 6}` × `Label ∈ {True, False}` × `Helper ∈ {True, False}`
- **Component properties**: `Label Text` (TEXT, `Label`), `Helper Text` (TEXT, `Helper text`), `Separator Text` (TEXT, `-`)
- **Nested INSTANCE**: every cell is `<TextField Variant=Outlined, Size=Small>` (`<NODE_ID>`)
- **Defaults**: `Character=4, Label=True, Helper=False`
- **Total variants**: 8
- **Local-only bindings**: required (see §1 + [`design-token.md`](./design-token.md))

## 10. Token Glossary

Every token consumed by `<PinInput>` (excluding tokens that flow through the nested `<TextField>` cells, which are documented in `<TextField>`'s spec). All bindings resolve to variables in this file's local collection — no consumed-library references.

### 10.1 Seed (themable)

- `mui/seed/danger/main` — `paint.label.error` / `paint.helper.error`. Used as the optional Error-state TEXT fill on FormLabel / FormHelperText (per §4.2.1). Resolves to `#D32F2F` in the light theme.
- `mui/seed/primary/main` — referenced indirectly via the nested `<TextField>` cell's Focused border (`paint.cell.border.focused`). Not bound directly on the wrapper.

### 10.2 Alias (semantic)

- `mui/alias/colors/text-default` — `paint.separator.text` + `paint.label.enabled` + `paint.helper.enabled`. Used as the separator `-` glyph fill **and** the resting FormLabel + FormHelperText TEXT fill (project convention — the local collection has no `text-secondary` token; see §7 #5). Resolves to `rgba(0, 0, 0, 0.87)` in the light theme.
- `mui/alias/colors/text-disabled` — `paint.label.disabled` / `paint.helper.disabled`. Used as the optional Disabled-state TEXT fill on FormLabel / FormHelperText (per §4.2.1). Resolves to `rgba(0, 0, 0, 0.38)` in the light theme.

### 10.3 Component-scoped

None — `<PinInput>` does not mint any component-scoped tokens of its own. Every paint reaches a token in the shared `mui/*` family. See [`design-token.md`](./design-token.md) for the audit (declared-empty file kept so future reviewers can confirm the absence is intentional).

### 10.4 Typography

Every TEXT node applies one of the project's existing `material-design/typography/*` text styles by id (no hand-set `fontName` / `fontSize` / `lineHeight`):

- FormLabel — `material-design/typography/body1` text style applied by id. Local resolution: Noto Sans TC Regular `type.label.font-size` / `24 px`, `0 %` letter-spacing. Runtime resolution per `render.md §4`: Roboto Regular `type.label.font-size` / `type.label.line-height`, `type.label.letter-spacing`. Project does not ship a dedicated `input/label` style.
- FormHelperText — `material-design/typography/caption` text style applied by id. Local resolution: Noto Sans TC Regular `type.helper.font-size` / `20 px`, `0 %` letter-spacing. Runtime resolution per `render.md §5`: Roboto Regular `type.helper.font-size` / `type.helper.line-height`, `type.helper.letter-spacing`. Project does not ship a dedicated `input/helper` style.
- Separator `-` glyph — `material-design/typography/body1` text style applied by id (same resolution as FormLabel above). Source: `render.md §3`.

Per-cell input text typography is owned by the nested `<TextField>` instance (`material-design/typography/input/value` per the `<TextField>` spec). Not re-bound here.

### 10.5 Shape & elevation

- `radius.cell` — `4 px` (`shape.borderRadius` from MUI default theme). Owned by the nested `<TextField>` cell.
- `shadow.cell` — `none` (Outlined ships flat). Owned by the nested `<TextField>` cell.

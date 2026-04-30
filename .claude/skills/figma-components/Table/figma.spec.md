---
name: figma-component-table-spec
description: Figma component specification for `<Table>` — design counterpart of MUI `<Table>` / `<TableHead>` / `<TableBody>` / `<TableRow>` / `<TableCell>` consumed by `src/stories/Table.stories.tsx`. Documents the two published component sets (`<TableCell>` — 108 variants of Variant × Padding × Align × Size × State; `<TableRow>` — 8 variants of Type × Hover × Selected), the static composed `<Table>` reference frame, the local-only token bindings, and the source-to-Figma sync rules. For runtime measurements see `storybook.render.md`; for component-scoped tokens see `design-token.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '674:12705'
figma_cell_component_set_id: '679:11463'
figma_row_component_set_id: '681:11303'
figma_composed_sample_id: '681:11304'
---

# `<Table>` Figma Component Specification

## 1. Overview

`<Table>` is the Figma counterpart of MUI's compositional Table system consumed in `src/stories/Table.stories.tsx`. The package re-exports `Table`, `TableHead`, `TableBody`, `TableContainer`, `TableFooter`, `TableRow`, `TableCell`, `TableSortLabel`, and `TablePagination` directly from `@mui/material` — there is no source-side wrapper. The Storybook story uses these re-exports verbatim.

The variant-bearing surfaces in the Figma library are:

- **`<TableCell>`** — atomic cell published as a `COMPONENT_SET` with the full Variant × Padding × Align × Size × State surface (108 variants).
- **`<TableRow>`** — row container published as a `COMPONENT_SET` carrying Type (head/body) × Hover × Selected (8 variants). Cells get instanced into rows; the row's own paint covers hover / selected overlays.
- **`<Table>` (composed reference)** — a single static frame on the page demonstrating how cells + rows compose inside `<TableContainer>` (a `<Paper>`). Not a component set; designers drop instances of `<TableRow>` (containing instances of `<TableCell>`) into their own auto-layout when assembling tables on screens.

| Aspect                    | Value                                                                                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source story              | `src/stories/Table.stories.tsx`                                                                                                                                 |
| Underlying source         | `@mui/material` `Table` / `TableHead` / `TableBody` / `TableContainer` / `TableRow` / `TableCell` / `TableSortLabel` (re-exported by this package, no wrapper)  |
| Figma file                | `KQjP6W9Uw1PN0iipwQHyYn` (MUI Library)                                                                                                                          |
| Figma frame               | `Table` (`674:12705`) on page **Foundation Components**                                                                                                         |
| Cell component set        | `<TableCell>` — populated when authored (id recorded in frontmatter)                                                                                            |
| Row component set         | `<TableRow>` — populated when authored (id recorded in frontmatter)                                                                                             |
| Composed reference        | `<Table> Sample` static frame — composed from cell + row instances inside a `<Paper>` container                                                                  |
| Cell variants             | **108** (2 Variant × 3 Padding × 3 Align × 2 Size × 3 State) — see §3.1                                                                                         |
| Row variants              | **8** (2 Type × 2 Hover × 2 Selected) — see §3.2                                                                                                                |
| Underlying MUI version    | `@mui/material@^7.3.10` (per `package.json` peer-dep `>=7`, current pnpm-lock resolution `7.3.10`)                                                              |
| Typography                | Roboto, no `text-transform`, letter-spacing `0.14994 px`. Head weight 500, body weight 400. See §4.1.                                                           |

**MUI native vs Figma extension.** This Table set covers the most common Figma authoring surface — single-line cells with the standard MUI props. The compositional layout (rows-in-table, table-in-container, sort labels, pagination footers) is left to the consumer. Out of the published Figma library scope: `<TableSortLabel>` (rendered inline inside head cell content; see §5), `<TablePagination>` (separate composed reference, not yet authored), `<TableContainer>` (delegates to the published `<Paper>` set).

**Local-only token bindings.** Per the project directive, every paint / stroke / text-fill in the Table component sets binds to the **MUI Library Figma file's local `merak` collection** — never to the published library copy. Component-scoped tokens (the primary-themed selected-row overlays) live in the file's local collection and are documented in [`./design-token.md`](./design-token.md). If the published library renames or removes a token, the local file does not break automatically; track the divergence in §8.

## 2. Source-to-Figma Property Mapping

### 2.1 `<TableCell>` props

| MUI prop                                                                                | Figma property         | Type    | Notes                                                                                                                                                                              |
| --------------------------------------------------------------------------------------- | ---------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant: 'head' \| 'body' \| 'footer'`                                                 | `Variant`              | VARIANT | Head ↔ body covered. `footer` is **not** authored as a Figma variant — it inherits body styling at runtime; documented divergence in §8. Default in Figma matches the runtime context (head when nested in `<TableHead>`, body otherwise). |
| `padding: 'normal' \| 'checkbox' \| 'none'`                                             | `Padding`              | VARIANT | Direct map. Default `normal`.                                                                                                                                                      |
| `align: 'inherit' \| 'left' \| 'center' \| 'right' \| 'justify'`                        | `Align`                | VARIANT | Figma authors `Left` / `Center` / `Right` only. `inherit` resolves to `Left` in LTR — designers pick `Left` explicitly. `justify` is omitted (uncommon for cells; tracked in §8).  |
| `size: 'small' \| 'medium'`                                                             | `Size`                 | VARIANT | Direct map. Default `Medium`.                                                                                                                                                      |
| `sortDirection`                                                                         | —                      | —       | Behavior-only (drives ARIA on the cell + drives `TableSortLabel.direction`). No design representation on the cell itself.                                                          |
| `scope`                                                                                 | —                      | —       | ARIA-only.                                                                                                                                                                         |
| `component`                                                                             | —                      | —       | Render-only. The `<th>` / `<td>` distinction is invisible in Figma.                                                                                                                |
| `sx` / `classes` / `className`                                                          | —                      | —       | Runtime style escape hatch. Not exposed as Figma surface.                                                                                                                          |
| `children`                                                                              | `Label` (TEXT) + slot  | TEXT    | The cell exposes a `Label` text override for plain text content, plus a hidden `<Slot>` for richer content (a `<Checkbox>`, a `<TableSortLabel>`, etc.). See §3.1.1.               |
| Pseudo / state classes (`:hover`, `Mui-selected`)                                       | `State`                | VARIANT | Mirrored as the cell `State` axis (`Default` / `Hover` / `Selected`) — paint cascades from the parent row in MUI but is authored on the cell in Figma so designers can preview a single cell in isolation. |

### 2.2 `<TableRow>` props

| MUI prop                          | Figma property | Type    | Notes                                                                                                  |
| --------------------------------- | -------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `hover: boolean`                  | `Hover`        | VARIANT | When `true` + `:hover` runtime, applies `theme.palette.action.hover` (`rgba(0,0,0,0.04)`).             |
| `selected: boolean`               | `Selected`     | VARIANT | Applies `alpha(theme.palette.primary.main, 0.08)`.                                                     |
| Context (head vs body)            | `Type`         | VARIANT | Not a runtime prop — derived from the parent (`<TableHead>` ⇒ `head`, `<TableBody>` ⇒ `body`). Authored as a Figma axis so the row's own paint can preview without nested cell context. |
| `component`                       | —              | —       | Render-only.                                                                                           |
| `sx` / `classes` / `className`    | —              | —       | Runtime escape hatches.                                                                                |
| `children`                        | `Cells` (SLOT) | SLOT    | Rows accept any number of cell instances. The slot is unconstrained — designers drop in `<TableCell>` instances directly. |

### 2.3 Color value mapping

Table does not expose a runtime `color` prop. The single themed paint is the **selected row overlay** — hard-coded inside MUI to `alpha(theme.palette.primary.main, 0.08)` (and `0.12` when combined with `:hover`). Figma binds it through component-scoped tokens documented in [`./design-token.md`](./design-token.md):

| Role                               | MUI runtime value                | Figma local token (MUI Library file)                                                |
| ---------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| Row `Selected` background          | `rgba(25, 118, 210, 0.08)` (light) | **`component/table/selected-bg`** → resolves to `seed/primary/main` × 8 %-α       |
| Row `Selected + Hover` background  | `rgba(25, 118, 210, 0.12)`       | **`component/table/selected-hover-bg`** → resolves to `seed/primary/main` × 12 %-α  |
| Row `Hover` (non-selected) background | `rgba(0, 0, 0, 0.04)`         | **`alias/colors/bg-outline-hover`** (existing alias; same value used by Pagination Hover) |

Pre-α'd component-scoped tokens are required because Figma flattens `paint.opacity < 1` to `1` when bound to a variable on instance creation (`figma-component-spec-guide` §4.4–§4.5). The selected-bg tokens carry the alpha in their resolved value, so the cell's paint stays at `opacity: 1`.

## 3. Variant Property Matrix

### 3.1 `<TableCell>`

```
Variant × Padding × Align × Size × State = 2 × 3 × 3 × 2 × 3 = 108 variants
```

| Property  | Default value | Options                              |
| --------- | ------------- | ------------------------------------ |
| `Variant` | `Body`        | `Head`, `Body`                       |
| `Padding` | `Normal`      | `Normal`, `Checkbox`, `None`         |
| `Align`   | `Left`        | `Left`, `Center`, `Right`            |
| `Size`    | `Medium`      | `Medium`, `Small`                    |
| `State`   | `Default`     | `Default`, `Hover`, `Selected`       |

Many combinations are visually similar across `Align` (the only delta is text-align). They are kept as separate variants because Figma requires uniform axes across a component set — same convention as `<PaginationItem>` (288 variants with many cross-axis duplicates).

The `State` axis is authored on the cell even though the runtime paint comes from the parent row. This lets a designer inspect `<TableCell variant=Body, state=Selected>` in isolation; in real compositions the row's `Selected` variant should drive every nested cell's `State` in lockstep (designers do not mix selected rows containing default cells, etc.).

#### 3.1.1 Component (non-variant) properties

| Property key  | Type           | Default                  | Purpose                                                                                              |
| ------------- | -------------- | ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `Label`       | TEXT           | `"Cell text"` / `"Header"` per Variant default | Plain-text content for the cell. Hidden when `Slot` is filled with non-text content.        |
| `Show Label`  | BOOLEAN        | `true`                   | Toggles the inner `Label` text node visibility. Designers turn it off when dropping a `<Checkbox>` or `<TableSortLabel>` instance into the slot. |
| `Slot`        | SLOT           | empty                    | Native Figma `SLOT` accepting any instance — `<Checkbox>` for `Padding=Checkbox`, `<TableSortLabel>` for sortable head cells, an `<Icon>` instance for icon-only cells, etc. |

### 3.2 `<TableRow>`

```
Type × Hover × Selected = 2 × 2 × 2 = 8 variants
```

| Property   | Default value | Options          |
| ---------- | ------------- | ---------------- |
| `Type`     | `Body`        | `Head`, `Body`   |
| `Hover`    | `Off`         | `Off`, `On`      |
| `Selected` | `Off`         | `Off`, `On`      |

`Hover=On + Selected=On` corresponds to the MUI `&.Mui-selected:hover` state (12 %-α primary overlay). `Hover=On + Selected=Off` is the standalone `:hover` overlay (4 %-α neutral). `Hover=Off + Selected=On` is the resting selected state (8 %-α primary). `Hover=Off + Selected=Off` is the default.

`Type=Head + Selected=On` is published for symmetry with body even though MUI's default UX never selects a head row — a theme override could flip it; keeping the variant means the axis stays uniform.

#### 3.2.1 Component (non-variant) properties

| Property key | Type | Default | Purpose                                                                                                  |
| ------------ | ---- | ------- | -------------------------------------------------------------------------------------------------------- |
| `Cells`      | SLOT | empty   | Native Figma `SLOT` accepting any number of `<TableCell>` instances. Designers fill with cells in column order. |

### 3.3 `<Table>` composed reference (not a component set)

A single static auto-layout frame on the `Table` page demonstrates the standard composition: `<Paper>` (the published Paper component set) wrapping a vertical Auto Layout column — one `<TableRow>` instance with `Type=Head` followed by N `<TableRow>` instances with `Type=Body`. Each row contains 5 `<TableCell>` instances (1 left-aligned name column + 4 right-aligned numeric columns). The composition is illustrative — it is **not** a publishable component (designers compose tables themselves from the cell + row sets per their own column model).

## 4. Design Tokens

Source-of-truth files any token claim below must reconcile against:

- `src/stories/Table.stories.tsx` — runtime story.
- `node_modules/@mui/material/TableCell/TableCell.js` — MUI cell paint defaults (border colour, padding ramp, font weight).
- `node_modules/@mui/material/TableRow/TableRow.js` — MUI row paint defaults (selected overlay).
- `src/lib/mui-theme.ts` — project theme overrides (none registered for Table at the time of writing).
- `figma-design-guide/design-token.md` — published variable catalogue (the source of every `merak/*` / `material-design/*` token name).

Every paint **must** be bound to a Variable in the file's local `merak` collection; hex values are never pasted. Hex values appear inline only as **reference resolutions of the light theme**.

### 4.1 Sizing

Mirror MUI defaults verbatim (the project does not override). Numbers come from `storybook.render.md` §1.1.

| Size     | `padding` (Normal)         | `padding` (Checkbox)       | `padding` (None) | Outer height (Head / Body — single-line content) | Font size / line-height (Head)   | Font size / line-height (Body)   | Border bottom        |
| -------- | -------------------------- | -------------------------- | ---------------- | ------------------------------------------------ | -------------------------------- | -------------------------------- | -------------------- |
| Medium   | `16 px` (all sides)        | `2 px` (all sides), fixed `36 × 36` | `0`     | `≈ 56.5 / 53.0 px`                               | `14 / 24 px Roboto 500`          | `14 / 20.02 px Roboto 400`       | none (cell stroke removed; see §4.2) |
| Small    | `16 px` (all sides)        | `2 px` (all sides), fixed `36 × 36` | `0`     | `≈ 36.5 / 33.0 px`                               | `14 / 24 px Roboto 500`          | `14 / 20.02 px Roboto 400`       | none (cell stroke removed; see §4.2) |

> **Divergence from MUI runtime.** MUI's runtime padding ramp is `Medium Normal: 16` / `Small Normal: 6 16` / `Checkbox: 0 0 0 4`. The Figma component set was simplified on 2026-04-30 to flat values (`Normal: 16`, `Checkbox: 2`) for visual consistency across sizes. Runtime measurements in `storybook.render.md` still reflect MUI's ramp; consumers wanting pixel parity with code should mind this gap. Tracked in §8.

**Letter-spacing**: `0.14994 px` (`0.01071em` at 14 px) for both head and body cells in both sizes. **Text-transform**: `none`. **Vertical-align**: `middle`.

### 4.2 Color token bindings

Bind every Figma fill / stroke to the listed token path — never paste raw hex.

| Role                           | Token (Figma local)                   | Reference resolution (light theme) | Used by                                           |
| ------------------------------ | ------------------------------------- | ---------------------------------- | ------------------------------------------------- |
| Cell foreground (label text)   | **`alias/colors/text-default`**       | `rgba(0, 0, 0, 0.87)` (`#000000DE`) | Every cell `State ∈ {Default, Hover, Selected}`. Head and body share the same fg paint — only weight differs. |
| Cell border-bottom             | **none** (stroke removed at cell level on 2026-04-30) | n/a                          | Previously bound to `alias/colors/border-defalt` _(sic)_ on every cell. Now omitted on the cell variants — divider rendering, if needed, is delegated to row composition or a wrapping container. Runtime MUI still paints a `1 px solid` border-bottom; this is a documented divergence, tracked in §8. |
| Cell background                | none — paint omitted (transparent)    | `rgba(0, 0, 0, 0)`                 | Every cell across every State. The cell itself never paints a background; the row provides the overlay (see below). |
| Row background — Default       | none — paint omitted                  | `rgba(0, 0, 0, 0)`                 | `Hover=Off, Selected=Off`                         |
| Row background — Hover         | **`alias/colors/bg-outline-hover`**   | `rgba(0, 0, 0, 0.04)` (`#0000000A`) | `Hover=On, Selected=Off`. Same alias used by Pagination Hover. |
| Row background — Selected      | **`component/table/selected-bg`**     | `rgba(25, 118, 210, 0.08)`         | `Hover=Off, Selected=On`. Pre-α'd; see [`./design-token.md`](./design-token.md). |
| Row background — Selected+Hover | **`component/table/selected-hover-bg`** | `rgba(25, 118, 210, 0.12)`       | `Hover=On, Selected=On`. Pre-α'd; see [`./design-token.md`](./design-token.md). |
| Sort label icon (inactive)     | **`alias/colors/text-sub`** ⁷         | `rgba(0, 0, 0, 0.6)` (`#00000099`) | `<TableSortLabel>` arrow, inactive. Authored only inside the composed sortable head sample, not a separate component-set axis. |
| Sort label icon (active)       | **`alias/colors/text-default`** ⁸     | _runtime_ `rgba(0, 0, 0, 0.54)` / _Figma_ `rgba(0, 0, 0, 0.87)` | `<TableSortLabel>` arrow, active. Figma-binding alpha (87 %) **diverges** from runtime (54 %) because no published 0.54-α neutral alias exists. Documented divergence (§7 issue 7). |
| Container background (Paper)   | **`alias/colors/bg-default`**         | `#FFFFFF`                          | The composed reference frame paints its container with `bg-default` + a `material-design/shadows/shadows-1` effect style. The project does not publish a `<Paper>` component set — the container is hand-authored. |

⁷ The catalogue does not ship dedicated `icon-*` aliases. Sort-label arrow paints reuse the closest neutral text alias (`text-sub` for inactive, `text-default` for active) — accept the alpha mismatch and revisit if a future audit adds an `icon-*` family.
⁸ See §7 currently-open issue 7. Re-bind to a future `alias/colors/icon-active` (54 %-α) when one ships.

### 4.3 State rules

Cells never paint their own background. Selected / Hover overlays live on the row.

| State                | Cell paint changes              | Row paint                                                               |
| -------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| Default              | none (no fill, no stroke)       | none (transparent)                                                      |
| Hover                | none (no fill, no stroke)       | `alias/colors/bg-outline-hover` (4 %-α neutral)                         |
| Selected             | none (no fill, no stroke)       | `component/table/selected-bg` (8 %-α primary, pre-α'd)                  |
| Selected + Hover     | none (no fill, no stroke)       | `component/table/selected-hover-bg` (12 %-α primary, pre-α'd)           |
| Disabled (cell-level) | _Not authored as a State_ — MUI does not dim disabled cells; consumers handle disabled state at the row / page level. Tracked in §8. | n/a |

**Border-bottom collapse on the last row** is **not** authored (every cell paints the border). The composed reference `<Table>` frame manually hides the last row's border for a cleaner look; consumers reproduce this in their own compositions when desired.

## 5. Icons

The Table component sets do not own a dedicated icon slot. Two related icon usages appear inside cells:

- **Sort arrow** (`<TableSortLabel>` slot inside head cells) — rendered inline as an instance of the published `<Icon>` set at `Size=sm` (20 px container, 18×18 glyph). Glyph default: material-symbols `arrow-downward` (`512:7517` in `figma-design-guide`). Visibility / direction toggled via the consumer's own variant logic; authored statically in the composed reference frame.
- **Checkbox glyph** (`Padding=Checkbox` cells) — slot accepts an instance of the published `<Checkbox>` set. Default: `<Checkbox>` `State=Default, Checked=Off`. The cell's `Padding=Checkbox` is `2 px` on all sides inside a fixed `36 × 36` frame (updated 2026-04-30; superseded the earlier `0 0 0 4 px` ramp).

Neither slot is exposed as `INSTANCE_SWAP` on the cell set itself — they are dropped into the cell's generic `Slot` (§3.1.1). Designers right-click → Swap Instance to change the icon glyph or checkbox state.

## 6. Layout

### 6.1 Component set grids

- **`<TableCell>`** — `Variant × Padding × Align × Size × State` published as 108 variants. Authored as a single horizontal-wrap COMPONENT_SET grouped by `Variant → Size → State → Padding → Align` so siblings of the same Variant / Size sit together visually.
- **`<TableRow>`** — `Type × Hover × Selected` published as 8 variants. Recommended layout: **4 columns × 2 rows** (`Hover × Selected` per row, `Type` per column).

Both sets sit on the `Table` page (parent frame `674:12705`) inside the parent placeholder. The composed `<Table>` reference frame sits below them.

### 6.2 Documentation frame

The parent `Table` frame (6826 × 6414 px) hosts:

- A header strip with the component name + version (top-left).
- The `<TableCell>` component set (top zone).
- The `<TableRow>` component set (mid zone).
- The composed `<Table>` reference frame (bottom zone) — a `<Paper>` instance wrapping a 6-row × 5-column composition (1 head + 5 body), demonstrating: `padding="checkbox"` first column with a `<Checkbox>` slot, `padding="normal"` content column, three right-aligned numeric columns, and one body row carrying `Selected=On` for visual reference.

## 7. Usage Guidelines

### 7.1 Picking a variant

1. Identify the cell context: a `<TableHead>` cell ⇒ `Variant=Head`; otherwise `Variant=Body`.
2. Pick `Padding` from the runtime prop: `normal` (default) ⇒ `Padding=Normal`; selectable rows' first column ⇒ `Padding=Checkbox`; dense layouts that strip padding ⇒ `Padding=None`.
3. Pick `Align` from the runtime prop: numeric / monetary columns ⇒ `Align=Right`; everything else ⇒ `Align=Left` (or `Center` for explicitly centered headers like a status icon column).
4. Pick `Size`: dense tables ⇒ `Size=Small`; everything else ⇒ `Size=Medium` (default).
5. Pick `State`: leave at `Default` for static comps. Use `Hover` / `Selected` only when illustrating an interactive state — and propagate the row's `Hover` / `Selected` axis in lockstep so every cell in the row matches.

### 7.2 Composing rows

Drop `<TableRow>` instances into your screen's auto-layout vertical column. Inside each row's `Cells` slot, drop one `<TableCell>` per visible column. Set the row's `Type` to match the cells' `Variant` (`Head` ↔ `Head`, `Body` ↔ `Body`); mismatched contexts render correctly but read as authoring mistakes during review.

For selectable tables: set `Selected=On` on the chosen row(s); the row's overlay shows through every cell. Do not set `State=Selected` on the cells individually — the row owns the paint.

### 7.3 Don'ts

- ❌ Painting a cell background directly to fake a row hover / selected overlay — the row owns this paint. Re-use the row's `Hover` / `Selected` axis instead.
- ❌ Re-introducing a cell-level stroke to fake a row divider — the cell border was intentionally removed on 2026-04-30 (see §4.2). If a divider is needed, paint it on the row or the wrapping container, not per-cell.
- ❌ Mixing `Variant=Head` cells inside a `Type=Body` row (or vice versa). The render is technically valid but confuses downstream code-gen and visual reviews.
- ❌ Using a `<TableSortLabel>` instance inside `Variant=Body` cells — the sort label is a head-only affordance.
- ❌ Hand-drawing the sort arrow as a Vector — drop in an `<Icon>` instance instead so glyph / size stay tracked.

## 8. Source Sync Rule

This document and the source must move together. When any of these change, update both sides in the same PR:

1. `src/stories/Table.stories.tsx` — story file driving the runtime measurements in `storybook.render.md`.
2. `node_modules/@mui/material` — the MUI version pinned in `package.json` (currently `^7.3.10`). A major bump may move the cell padding ramp, the head font weight, the selected overlay alpha, or the divider colour resolution.
3. `src/lib/mui-theme.ts` — currently registers no `MuiTable` / `MuiTableRow` / `MuiTableCell` block. Adding one (e.g. a `defaultProps.size` or `styleOverrides.root`) requires updating §4.
4. The Figma component sets `<TableCell>` and `<TableRow>` themselves — adding a Variant value, renaming a property, or changing a default forces an edit to §3.
5. `figma-design-guide/design-token.md` — the canonical token catalogue. Token renames / removals propagate into §4.2, [`./design-token.md`](./design-token.md), and (if needed) the file's local variable collection.

Specifically:

- A theme override adding `MuiTableCell.styleOverrides.head.fontWeight` ⇒ update §4.1 and re-derive `storybook.render.md` §1.1.
- An MUI bump that changes `theme.palette.action.selectedOpacity` from `0.08` to a new value ⇒ update §4.2 + [`./design-token.md`](./design-token.md) `component/table/selected-bg` resolution + re-mint the local variable.
- Adding a `Variant=Footer` to the Figma cell set ⇒ extend §3.1 + update §2.1 to map `variant: 'footer'`.
- Adding `Align=Justify` ⇒ extend §3.1 (108 ⇒ 144 variants) and remove the omission note in §2.1.
- Adding a runtime `Disabled` cell affordance ⇒ extend §3.1 `State` (108 ⇒ 144 variants) and add a §4.3 row.
- The `<TableSortLabel>` graduating to its own component set ⇒ add §3.3 + §5 axis tables for it; demote the inline mention.
- The `<TablePagination>` graduating to its own component set ⇒ add a separate spec under `.claude/skills/figma-components/TablePagination/`.

A token **value** change in the local `merak` collection (e.g. `seed/primary/main` shifts) needs **no** spec edit — variables resolve by name, paints follow. A token **name** change (e.g. `border-defalt` typo finally fixed) requires updating every reference in §2.3, §4.2, §4.3, §10.

## 9. Quick Reference

```ts
// src/stories/Table.stories.tsx — relevant prop surface
type TableCellProps = {
  variant?: 'head' | 'body' | 'footer';     // → Figma Variant (footer not authored)
  padding?: 'normal' | 'checkbox' | 'none'; // → Figma Padding
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'; // → Figma Align (justify omitted)
  size?: 'small' | 'medium';                // → Figma Size
  sortDirection?: 'asc' | 'desc' | false;   // behavior-only
  children?: React.ReactNode;               // → Figma Label TEXT + Slot
};
type TableRowProps = {
  hover?: boolean;                          // → Figma Hover
  selected?: boolean;                       // → Figma Selected
  // Type axis derived from parent context (TableHead / TableBody)
};
```

```
Figma library (file KQjP6W9Uw1PN0iipwQHyYn, page Foundation Components, frame 674:12705):
  <TableCell> COMPONENT_SET — 108 variants (Variant × Padding × Align × Size × State)
    properties: Variant ∈ {Head, Body}, Padding ∈ {Normal, Checkbox, None}, Align ∈ {Left, Center, Right},
                Size ∈ {Medium, Small}, State ∈ {Default, Hover, Selected}
    component properties: Label (TEXT), Show Label (BOOLEAN), Slot (SLOT)
    default: Body / Normal / Left / Medium / Default

  <TableRow> COMPONENT_SET — 8 variants (Type × Hover × Selected)
    properties: Type ∈ {Head, Body}, Hover ∈ {Off, On}, Selected ∈ {Off, On}
    component properties: Cells (SLOT)
    default: Body / Off / Off

  <Table> static composed reference frame
    composition: <Paper> > Auto Layout column > 1 head TableRow + 5 body TableRows;
                 cells: 1 left-aligned name + 4 right-aligned numeric per row
```

## 10. Token Glossary

### Seed tokens (`seed/*`)

- `seed/primary/main` — resolved into `component/table/selected-bg` (× 8 %-α) and `component/table/selected-hover-bg` (× 12 %-α).

No other seed family is consumed directly by Table.

### Alias tokens (`alias/colors/*`)

| Token name                                      | Resolved (light) | Used by                                                  |
| ----------------------------------------------- | ---------------- | -------------------------------------------------------- |
| `alias/colors/text-default`                     | `#000000` 87 %-α | Cell foreground (head + body) and active sort-label arrow. |
| `alias/colors/text-sub`                         | `#000000` 60 %-α | Inactive sort-label arrow.                               |
| `alias/colors/border-defalt` _(sic)_            | `#000000` 12 %-α | **No longer consumed by `<TableCell>`** as of 2026-04-30 (cell strokes removed). Kept in this glossary because the typo'd alias still exists in the file and other component sets reference it. |
| `alias/colors/bg-outline-hover`                 | `#000000` 4 %-α  | Row hover overlay (non-selected).                        |
| `alias/colors/bg-default`                       | `#ffffff`        | Composed reference container background.                 |

### Component-scoped tokens (`component/table/*`)

Documented in [`./design-token.md`](./design-token.md):

| Token name                          | Resolved (light)              | Used by                                           |
| ----------------------------------- | ----------------------------- | ------------------------------------------------- |
| `component/table/selected-bg`       | `rgba(25, 118, 210, 0.08)`    | Row `Selected=On, Hover=Off` background.          |
| `component/table/selected-hover-bg` | `rgba(25, 118, 210, 0.12)`    | Row `Selected=On, Hover=On` background.           |

### Effects / shape & elevation

- `material-design/shadows/shadows-1` — applied by the consumed `<Paper>` container (not the cell / row sets).
- Corner radius — Cells: `0` (square edges; the Paper container clips corners). Rows: `0`.

### Typography

The MUI Library file owns **no local text styles** (`figma.getLocalTextStylesAsync()` returns empty), so cell text is **hand-set** to match MUI runtime exactly — no `material-design/typography/*` binding is applied (binding to a consumed-library style would violate the local-only rule). See [`./design-token.md`](./design-token.md) §3 for the resolution chain and the future-rebinding plan.

- **Head cell**: `Roboto Medium 14 / 24 px`, letter-spacing `0.14994 px`, no `text-transform`.
- **Body cell**: `Roboto Regular 14 / 20.02 px`, letter-spacing `0.14994 px`, no `text-transform`.

---

### Currently-open issues (resolved in §8 sync rule when closed)

1. **Border colour divergence** — runtime `rgb(224,224,224)` vs Figma `alias/colors/border-defalt` (`rgba(0,0,0,0.12)`). Intentional for dark-mode parity; matches the convention set by Pagination and Button. Re-evaluate when MUI moves cells to `theme.palette.divider` token.
2. **Last-row border** — runtime drops the bottom border on the final body row. Figma authors every cell with the border; the composed reference frame masks the last row's border manually. Cell-set authoring stays uniform.
3. **`Variant=Footer`** — not authored; runtime resolves to body styling. Add only when the project's stories exercise a `<TableFooter>` cell.
4. **`Align=Justify`** — not authored; uncommon for cells. Add when first consumer needs it.
5. **`State=Disabled` on cells** — not authored; MUI has no built-in disabled cell affordance. Add when a project pattern emerges.
6. **`<TableSortLabel>` / `<TablePagination>` as standalone sets** — currently inline in the composed reference. Promote to their own component sets when a usage justifies the matrix.
7. **Active sort-label arrow alpha** — runtime `0.54`-α vs Figma binding `text-default` (`0.87`-α). No 0.54-α neutral alias is published; rebind once one ships.
8. **Local text styles** — MUI Library file owns no local text styles; cell typography is hand-set. Mint `merak/typography/table-head` + `merak/typography/table-body` and rebind cells when an audit takes this on.
9. **`CellSizeMatrix` does not exercise `Padding=Checkbox` at `Size=Small`** — the storybook story currently uses `Padding=Normal` for the size axis. Extend the matrix when measuring the Small/Checkbox cell becomes load-bearing.

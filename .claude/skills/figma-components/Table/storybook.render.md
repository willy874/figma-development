---
name: figma-component-table-storybook-render
description: Computed-style snapshot for `<TableCell>` and `<TableRow>` measured against `src/stories/Table.stories.tsx` via Chrome DevTools MCP. Documents per-axis box / paint / typography numbers across the Variant × Padding × Align × Size × State surface for cells, plus Type × Hover × Selected for rows, and the composed `<Table>` reference layout. Companion to `figma.spec.md` (the contract).
parent_skill: figma-components
---

# `<Table>` Storybook Render Measurements (v1)

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/Table.stories.tsx`. Stories sampled: `Default` (composed Table, size=medium), `SmallSize` (size=small), `SelectableRows` (`padding="checkbox"` + selected row + `<Checkbox>`), `SortableHeader` (`<TableSortLabel>` slot), `CellPaddingAlignMatrix`, `CellSizeMatrix`, `CellStateMatrix`, `RowStateMatrix`. Stories use the package's MUI re-exports verbatim — no theme override is applied (`mui-theme.ts` does not register a `MuiTable` / `MuiTableCell` / `MuiTableRow` block at the time of this snapshot).

The Table system is compositional — `<TableContainer>` (`<Paper>` slot) wraps `<Table>` which wraps `<TableHead>` / `<TableBody>` / `<TableRow>` / `<TableCell>`. The variant-bearing surfaces are `<TableCell>` and `<TableRow>`; the others are layout glue without their own paint. Numbers below split by surface.

## 1. TableCell — per-axis invariants

### 1.1 Variant × Size (Padding=Normal, Align=Left/Inherit, no theme override)

| Property                | Head / Medium                        | Body / Medium                        | Head / Small                         | Body / Small                         |
| ----------------------- | ------------------------------------ | ------------------------------------ | ------------------------------------ | ------------------------------------ |
| outer height            | `≈ 56.5 px` ¹                        | `≈ 53.0 px` ¹                        | `≈ 36.5 px` ¹                        | `≈ 33.0 px` ¹                        |
| `padding`               | `16 px` (all sides)                  | `16 px`                              | `6 px 16 px`                         | `6 px 16 px`                         |
| `border-bottom`         | `1 px solid rgb(224, 224, 224)`      | same                                 | same                                 | same                                 |
| `border-top` / `-left` / `-right` | `0 none`                   | `0 none`                             | `0 none`                             | `0 none`                             |
| `background`            | `rgba(0, 0, 0, 0)` (transparent)     | same                                 | same                                 | same                                 |
| `color` (foreground)    | `rgba(0, 0, 0, 0.87)`                | `rgba(0, 0, 0, 0.87)`                | same                                 | same                                 |
| `font-family`           | `Roboto, Helvetica, Arial, sans-serif` | same                               | same                                 | same                                 |
| `font-size`             | `14 px`                              | `14 px`                              | `14 px`                              | `14 px`                              |
| `font-weight`           | `500`                                | `400`                                | `500`                                | `400`                                |
| `line-height`           | `24 px`                              | `20.02 px` (`1.43em`)                | `24 px`                              | `20.02 px`                           |
| `letter-spacing`        | `0.14994 px` (`0.01071em`)           | same                                 | same                                 | same                                 |
| `text-transform`        | `none`                               | `none`                               | `none`                               | `none`                               |
| `vertical-align`        | `middle`                             | `middle`                             | `middle`                             | `middle`                             |

¹ Heights are content-driven (`<td>` / `<th>` have `height: auto`); the values listed are the rendered cell heights for the harness's single-row sample (one line of label text). Multi-line content grows the cell — Figma authors a fixed-height variant matched to the single-line case and lets `Hug` resize the parent row in compositions.

### 1.2 Padding axis (Variant=Body, Size=Medium)

| `padding` mode | `padding`                  | rendered cell width (single-line "Cell text" / `<Checkbox>`) | Notes                                                                                                       |
| -------------- | -------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `normal`       | `16 px`                    | grows with content + 32 px horizontal padding                | The MUI default. Used for every cell unless explicitly overridden.                                          |
| `checkbox`     | `0 0 0 4 px`               | `48 px` total ²                                              | Hosts a single `<Checkbox>` (42 × 42 with internal `9 px` padding around a 24×24 SVG). The `4 px` left padding centers the checkbox visually inside the cell. |
| `none`         | `0 px`                     | tracks content                                               | No padding. Used for compact dense tables; not exercised in the project's stories beyond the matrix.        |

² The `checkbox` cell width is dominated by the inner `<Checkbox>` button — the cell collapses to the content's intrinsic size. Figma authors a fixed `48 × 48 px` cell to match.

### 1.3 Align axis (Variant=Body, Size=Medium, Padding=Normal)

| `align`   | `text-align` | Notes                                                                                                                                  |
| --------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `inherit` | `start` (= left in LTR) | Default when no `align` prop is set. Picks up parent table direction.                                                       |
| `left`    | `left`       | Identical paint to `inherit` in LTR. Authored as a separate Figma variant for explicitness.                                            |
| `center`  | `center`     | Centered text only. No padding shift.                                                                                                  |
| `right`   | `right`      | Right-aligned text. No padding shift. Used in the `Default` story for the numeric columns (Calories / Fat / Carbs / Protein).         |
| `justify` | `justify`    | Not authored as a Figma variant (uncommon for table cells; would require multi-line content to differ visually). Tracked in spec §8.   |

### 1.4 State axis (Variant=Body, Size=Medium, Padding=Normal — bg only)

The cell's own paint never changes by state — `background` is always transparent. Hover / Selected paint comes from the parent `<tr>` (see §2). The `Mui-selected` class on the row applies `background-color: rgba(25, 118, 210, 0.08)` to the `<tr>`; cells inherit visually because they have no opaque background of their own.

The lone exception: when a cell carries `Mui-selected` directly (e.g. `<TableCell selected>` — not a documented MUI prop, but possible via className), it picks up the same overlay. Figma does not author this case.

## 2. TableRow — state axis

Probed via `RowStateMatrix` (Type × State) and `SelectableRows` (`hover` + `selected` combined).

| State            | row `background-color`                | `cursor` (with `hover` prop) | Notes                                                                                                              |
| ---------------- | ------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Default          | `rgba(0, 0, 0, 0)` (transparent)      | `default`                    | Baseline. No row paint.                                                                                            |
| Hover            | `rgba(0, 0, 0, 0.04)` ³               | `default` (MUI does not add `pointer`) | MUI applies `theme.palette.action.hover` (`rgba(0,0,0,0.04)`) on `&:hover` when the `hover` prop is true.          |
| Selected         | `rgba(25, 118, 210, 0.08)` ⁴          | `default`                    | MUI applies `alpha(theme.palette.primary.main, 0.08)` on `.Mui-selected`. The 8 % is `theme.palette.action.selectedOpacity`. |
| Hover + Selected | `rgba(25, 118, 210, 0.12)` ⁵          | `default`                    | MUI combines selected + hover overlays for `.Mui-selected:hover`.                                                  |

³ The `hover` value is MUI's default action overlay — same value used by Button hover, ListItem hover, etc. Cannot be probed statically (`:hover` requires interaction); the matrix uses the `Mui-hover` className stand-in to render the Selected+hover combined state. The pure-Hover overlay is authored from MUI source.

⁴ Hard-coded inside `TableRow.js` as `&.${tableRowClasses.selected}: { backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity) }`. Note this differs from many other MUI components which use a neutral-black 8 % overlay for selected — Table specifically themes the row selection to primary.

⁵ Combined overlay rendered by `&.Mui-selected:hover`. Resolves to the same `primary.main` × 12 %-α as the cell selected + hover stack.

## 3. TableContainer / Paper — wrapper paint

Probed via `Default` story.

| Property         | Value                                                               |
| ---------------- | ------------------------------------------------------------------- |
| `background`     | `rgb(255, 255, 255)` (Paper default)                                |
| `border-radius`  | `4 px`                                                              |
| `box-shadow`     | `0 2 1 -1 rgba(0,0,0,0.2), 0 1 1 0 rgba(0,0,0,0.14), 0 1 3 0 rgba(0,0,0,0.12)` (MUI elevation 1) |
| `padding`        | `0`                                                                 |
| `overflow-x`     | `auto` (TableContainer-specific)                                    |
| `color` (text default) | `rgba(0, 0, 0, 0.87)`                                         |

## 4. Table — root element

| Property           | Value                          |
| ------------------ | ------------------------------ |
| `display`          | `table`                        |
| `border-collapse`  | `collapse`                     |
| `border-spacing`   | `0`                            |
| `padding`          | `0`                            |
| `border`           | `0 none`                       |
| `width`            | `100%` (MUI default)           |

The `<table>` itself contributes no paint — every visible line / shading lives on the cells (border-bottom) or rows (background overlays).

## 5. TableSortLabel — head-cell slot (informational; not a separate Figma component set)

Probed via `SortableHeader` story. Authored inside the Head TableCell as a child INSTANCE / static slot in Figma — not a standalone variant.

| Property              | Inactive                               | Active (`direction="asc"`)              |
| --------------------- | -------------------------------------- | --------------------------------------- |
| label `font`          | `14 / 24 px Roboto 500`, ls `0.14994 px` | same                                  |
| label `color`         | `rgba(0, 0, 0, 0.87)`                  | `rgba(0, 0, 0, 0.87)` (unchanged) ⁶     |
| arrow icon size       | `18 × 18 px`                           | `18 × 18 px`                            |
| arrow icon `color`    | `rgba(0, 0, 0, 0.6)` (visible only on hover by default) | `rgba(0, 0, 0, 0.54)` (always visible) |
| arrow icon `margin`   | `0 4 px` (left + right)                | same                                    |
| arrow icon `opacity`  | `0` until hover (then `0.5`)           | `1`                                     |

⁶ MUI does not bold or color-shift the active label — only the arrow visibility / opacity changes. Figma matches.

## 6. Composed `<Table>` reference layout (`Default` story)

For end-to-end visual reference the spec ships a static composed Table on the page. Sample numbers (size=medium, 1168 px container width, 5 rows × 5 columns):

| Region          | Computed                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Container `w x h` | `1168 × 322 px` (paper)                                                                                                       |
| Head row height | `56.5 px`                                                                                                                      |
| Body row height | `53.0 px` × 5 = `265 px`                                                                                                       |
| Last body row   | `border-bottom: 0` (MUI's `tr:last-child td { border-bottom: 0 }` rule via Table) — paint identical to other body rows otherwise |
| Column widths   | content-driven; first column hugs the longest dessert name, numeric columns share remaining space evenly                       |
| First/last cell padding | unchanged (`16 px`); no row-edge inset                                                                                |

## 7. Drift checks

If a re-measure produces values that disagree with the tables above, treat the difference as one of these cases — do not silently update the spec:

1. **MUI upgrade** — `@mui/material` major bumps may change the hard-coded selected overlay (currently `primary.main × 0.08`), the action.hover (`rgba(0,0,0,0.04)`), the cell padding ramp (`16 / 6` for medium / small normal), the head font weight (`500`), or the border colour (`rgb(224,224,224)` ≈ `theme.palette.divider` resolved to light theme). Update `figma.spec.md` §1 MUI version row alongside this file.
2. **Theme override** — if `mui-theme.ts` introduces a `MuiTable` / `MuiTableRow` / `MuiTableCell` / `MuiTableHead` `defaultProps` / `styleOverrides` block (the project has none today), document it in §1 and re-derive every table above.
3. **Selected bg theming** — the `0.08` selected overlay is keyed off **primary**, not a neutral. If `theme.palette.primary.main` changes, the rendered colour shifts even though no Table-specific change was made. Figma binds the selected fill to `component/table/selected-bg` (a component-scoped pre-α'd token; see `design-token.md`) — ensure that token tracks `primary.main × 0.08`.
4. **Border color** — runtime `rgb(224,224,224)` resolves from MUI's `theme.palette.divider` for light mode. Figma binds cell `border-bottom` to `alias/colors/border-defalt` _(sic)_ (`rgba(0,0,0,0.12)`) for dark-mode parity. Acceptable design divergence, tracked in `figma.spec.md` §7.
5. **Last-row border** — runtime drops `border-bottom` on the final body row via the `&:last-child td` selector. Figma authors every body cell with the border and lets the consumer hide the last row's border manually (or accepts the visual seam) — tracked in `figma.spec.md` §7.

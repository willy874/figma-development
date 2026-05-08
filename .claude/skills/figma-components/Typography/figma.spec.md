---
name: figma-component-typography-spec
description: Figma component specification for `<Typography>` — design counterpart of MUI `<Typography>` consumed by `src/stories/Typography.stories.tsx`. Documents the Variant × Bold matrix (the synthetic `Bold` axis is a Figma-only extension; MUI Typography has no `bold` prop), the single non-variant component property (`Label`), source-to-Figma mapping, project text-style bindings, and the source-sync rule. `color` / `align` / `gutterBottom` / `noWrap` are intentionally not modeled as Figma properties — they are instance-level overrides on the inner TEXT (or surrounding Auto Layout). Companion to `storybook.render.md` (runtime computed-style snapshot) and `design-token.md` (component-scoped tokens — the local `component/typography/button[-bold]` and `component/typography/overline[-bold]` styles).
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '821:11807'
figma_component_set_id: '844:16739'
---

# `<Typography>` Figma Component Specification

## 1. Overview

`<Typography>` is the Figma counterpart of the MUI `<Typography>` consumed in `src/stories/Typography.stories.tsx`. The package re-exports MUI Typography directly — there is no wrapper — so the Figma component encodes the one visually-multiplying MUI prop (`variant`) as a variant axis, adds a synthetic Figma-only `Bold` axis (MUI Typography has no `bold` prop today; the axis exists so designers can flip a variant to its bold companion without detaching), and exposes a single `Label` TEXT property. Utility flags (`color`, `align`, `gutterBottom`, `noWrap`) are intentionally not modeled as Figma component properties — see §2 for the rationale and §3.1 for the override pattern designers use instead.

Typography is **non-interactive**: there is no `:hover`, `:active`, `:focus`, or `disabled` state surface, so the Figma matrix has no `State` axis (compare to `<Button>`, which expands to five states). MUI's `disabled` color value (`palette.text.disabled`) is just one of the colors a designer may set on an instance; it is not a state.

The design system pre-ships almost every MUI Typography variant as a published text style (`material-design/typography/h1` … `typography/overline`; see `figma-design-guide/design-token.md` §3). The Figma cells therefore bind via `textStyleId` rather than hand-setting font / size / line-height. To support the new `Bold` axis, this spec adds **13 bold-weight companion text styles** to the Figma file's Styles namespace — 11 live under `material-design/typography/<v>-bold` (the design-system convention path; minted locally because the design-system file does not yet ship them) and 2 live under `component/typography/<v>-bold` (the component-scoped path used by `Variant=Button` and `Variant=Overline`, both of which already need component-scoped local styles to bake `textCase: UPPER`). See `design-token.md` next to this file for the complete list and resolution chain. **Local-only is the project default**: every paint and every text style the cell uses must resolve to a variable / style in this Figma file's own collection — never a `VariableID:<sharedKey>/...` consumed-library binding (the component must be self-contained).

| Aspect                | Value                                                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Source story          | `src/stories/Typography.stories.tsx`                                                                                             |
| Underlying source     | `@mui/material` `Typography` (re-exported by this package — no wrapper)                                                          |
| Underlying MUI        | `@mui/material` 7.3.10 (resolved from `package.json` on 2026-05-08)                                                              |
| Figma frame           | `<Typography>` (`821:11807`) on page **Foundation Components**                                                                   |
| Component Set         | `<Typography>` (`844:16739`) inside frame `821:11807`                                                                            |
| Total variants        | **26** (13 Variants × 2 Bold values)                                                                                             |
| Synthetic axes        | `Bold` is a Figma-only extension — it has no MUI counterpart at runtime. Designers use it to flip a TEXT to the bold companion of its current Variant in one click. See `storybook.render.md` §5 for the rationale and the one-MUI-prop-out caveat. |
| Typography            | 26 distinct text styles bound by `textStyleId`. 11 base Variants bind to published `material-design/typography/<v>` styles; their bold companions bind to local `material-design/typography/<v>-bold` styles minted in this file. `Variant=Button` and `Variant=Overline` (both base and bold) bind to component-scoped local styles under `component/typography/*` so `textCase: UPPER` can be baked in. Project text styles use Noto Sans TC (Inter for `h2` / `h5`), letter-spacing 0% — see `storybook.render.md` §6 for the documented divergences from MUI runtime. |
| State axis            | **None.** `<Typography>` is non-interactive; the Figma component has only Variant × Bold.                                        |
| Color axis            | **None.** Removed from the Figma component on 2026-05-08 — see §2 and §10. Designers override the cell's text fill at the instance level using the variables listed in §2.1. |
| Local-only bindings   | **Required.** Every text fill resolves to a variable in this file's local collection. All 26 cell text styles (13 base + 13 bold) live as local styles in this file. No consumed-library bindings are permitted. |

## 2. Source-to-Figma Property Mapping

| MUI prop             | Figma property  | Type    | Notes                                                                                                                                                 |
| -------------------- | --------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`            | `Variant`       | VARIANT | One of 13 — see §3. MUI also accepts `inherit` at runtime (passes through to parent typography); `inherit` is not exposed as a Figma variant value.   |
| _(synthetic)_        | `Bold`          | VARIANT | `Off` / `On`. **No MUI counterpart** — Figma-only extension. Picks between the base text style for the chosen Variant (`Off`, default) and its bold-weight companion (`On`). At handoff, `Bold=On` translates to either `<strong>` / `font-weight: 700` styling or a different MUI variant — designers note the intent in dev annotations. See §4.1. |
| `children`           | `Label`         | TEXT    | Master default `Sample` — short placeholder so the 13 × 2 grid stays compact on canvas. The story file (`Typography.stories.tsx`) still uses the pangram `The quick brown fox jumps over the lazy dog` for individual variant demos and matrix renders; the Figma master picks a one-word default that designers replace per instance. |
| `color`              | —               | —       | **Not a Figma axis** (removed on 2026-05-08 — older revisions of this spec exposed a 9-value `Color` axis multiplying the matrix to 117 cells). Designers override the cell's inner TEXT fill on the instance, picking from the merak variables listed in §2.1. Rationale: the Color axis added 9× cells with no per-color geometry / typography differences — the same paint rebind on the inner TEXT does the job at the instance level without exploding the variant set. |
| `align`              | —               | —       | Instance-level override on the cell's inner TEXT — designers set `textAlignHorizontal` directly on the instance (Figma allows this without detaching). Not a Figma Variant axis. |
| `gutterBottom`       | —               | —       | Auto Layout `itemSpacing` on the surrounding column — not a Figma property. Per-Variant resolved px values are recorded in `storybook.render.md` §4.1 for reference.                |
| `noWrap`             | —               | —       | Instance-level override on the cell's inner TEXT — designers set `textTruncation: ENDING` directly on the instance and constrain the host frame's max-width. |
| `paragraph`          | —               | —       | MUI sugar for `component="p"` + `gutterBottom=true`. Behavior-only at the DOM level; covered by `gutterBottom` above.                                  |
| `component` / `as`   | —               | —       | Behavior-only — picks the rendered HTML tag (`<h1>` / `<p>` / `<span>` / etc.). Has no Figma representation — designers note the intended tag in handoff. |
| `variantMapping`     | —               | —       | Behavior-only — overrides the default tag-per-variant table. No design representation.                                                                |
| `classes`, `sx`, `style`, `className` | — | —     | Behavior-only — runtime style overrides. Not modeled in Figma.                                                                                        |

### 2.1 Color value mapping (instance-level overrides)

The story exposes nine `MERAK_COLORS` entries that map Merak design-system color keys to MUI Typography color tokens. The Figma master no longer exposes Color as a Variant axis — but designers still need to know which token to bind on the inner TEXT when overriding. Pick the merak variable that corresponds to the source `color` prop and rebind the cell's TEXT fill on the instance; never paste raw hex.

| Merak key (story)   | MUI prop value (`color=…`) | Figma token to bind on inner TEXT fill |
| ------------------- | -------------------------- | -------------------------------------- |
| `default`           | `textPrimary`              | `alias/colors/text-default`            |
| `secondary-text`    | `textSecondary`            | `alias/colors/text-sub`                |
| `disabled-text`     | `textDisabled`             | `alias/colors/text-disabled`           |
| `primary`           | `primary`                  | `seed/primary/main`                    |
| `secondary`         | `secondary`                | `seed/secondary/main`                  |
| `danger`            | `error`                    | `seed/danger/main`                     |
| `warning`           | `warning`                  | `seed/warning/main`                    |
| `info`              | `info`                     | `seed/info/main`                       |
| `success`           | `success`                  | `seed/success/main`                    |

¹ The merak `danger` key targets `seed/danger/*` (the project's Merak-named token family for MUI `palette.error.*`). Story uses `color="error"` directly — same convention as `<Button>` / `<Chip>`.

## 3. Variant Property Matrix

```
Variant × Bold   =   13 × 2   =   26 variants
```

Clean Cartesian product — no sparse exclusions. Each cell is a single TEXT node bound to its `(Variant, Bold)`-keyed text style (§4.1) with its fill bound to `alias/colors/text-default` (§4.2). `Bold=On` cells use the bold-weight companion of the base style.

| Property  | Default value     | Options                                                                                                                |
| --------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Variant` | `Body 1`          | `H1`, `H2`, `H3`, `H4`, `H5`, `H6`, `Subtitle 1`, `Subtitle 2`, `Body 1`, `Body 2`, `Button`, `Caption`, `Overline`    |
| `Bold`    | `Off`             | `Off`, `On`                                                                                                            |

### 3.1 Component (non-variant) properties

| Property key | Type | Default                                       | Purpose                              |
| ------------ | ---- | --------------------------------------------- | ------------------------------------ |
| `Label`      | TEXT | `Sample`                                      | Body text. Mirrors MUI's `children`. Short master placeholder — designers replace per instance. |

`color`, `align`, `gutterBottom`, and `noWrap` are intentionally **not** exposed as Figma component properties — see §2 for the rationale (each would either explode the matrix, require a screen-level layout decision the master can't honestly model, or duplicate work the inner TEXT can do directly). Designers override them on the instance's inner TEXT directly:

- **Color** — select the inner TEXT inside the instance and rebind its single SOLID fill to one of the merak variables in §2.1 (or any other token from `figma-design-guide/design-token.md`). Figma allows the rebind without detaching.
- **Alignment** — select the inner TEXT and set `textAlignHorizontal` (`LEFT` / `CENTER` / `RIGHT` / `JUSTIFIED`).
- **No-wrap / truncation** — select the inner TEXT and toggle `textTruncation: ENDING`. The host frame must constrain `width` for the ellipsis to engage.
- **Gutter bottom** — use Auto Layout `itemSpacing` on the surrounding column, picking the Variant-appropriate value from `storybook.render.md` §4.1 (e.g. `5.6 px` for `body1`).

## 4. Design Tokens

Source-of-truth files for any token claim:

- `src/stories/Typography.stories.tsx` — the story file (variant + color enumerations).
- `node_modules/@mui/material/styles/createTypography.js` — the MUI default theme's Typography object (resolved from `@mui/material 7.3.10`).
- `.storybook/preview.tsx` — the Storybook decorator wraps every story in `ThemeProvider theme={createTheme()}` (no project-level overrides — see `storybook.render.md` runtime-context paragraph).
- `figma-design-guide/design-token.md` §3 — the published `material-design/typography/*` text styles in the design-system file (`stse2CgIzOugynEdDSexS4`).
- `design-token.md` (next to this file) — the local component-scoped text styles minted to (a) fill the missing `material-design/typography/button` slot, (b) bake `textCase: UPPER` for `overline`, and (c) provide bold-weight companions for every Variant.

Every text fill **must** be bound to a Figma variable in this file's local collection; every typography rule **must** be applied via `textStyleId`. Hex / numeric values appear in this section only as **reference resolutions of the light theme** — bind the actual Figma paint / text node to the named token.

### 4.1 Typography — text style bindings

One `textStyleId` per `(Variant, Bold)` pair. The 11 base-weight cells whose Variants have a published design-system text style (`H1`..`Body 2` plus `Caption`) bind to those published styles. The 2 base-weight cells for `Button` and `Overline` bind to component-scoped local styles (UPPER baked in — see `design-token.md`). Every bold companion binds to a local style minted in this file under either `material-design/typography/<v>-bold` (for the 11 standard Variants) or `component/typography/<v>-bold` (for `Button` and `Overline`).

#### Base text styles (`Bold=Off`)

| Variant     | Figma text style                           | Resolves to (project)                          | Resolves to (MUI runtime — for reference)                    |
| ----------- | ------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------ |
| `H1`        | `material-design/typography/h1`            | Noto Sans TC Light, 96 / 112, ls 0%, ORIGINAL  | Roboto Light 96 / 112.032, ls -1.5 px, none                  |
| `H2`        | `material-design/typography/h2`            | Inter Light, 60 / 72, ls 0%, ORIGINAL          | Roboto Light 60 / 72, ls -0.5 px, none                       |
| `H3`        | `material-design/typography/h3`            | Noto Sans TC Regular, 48 / 60, ls 0%, ORIGINAL | Roboto 400, 48 / 56.016, ls normal, none                     |
| `H4`        | `material-design/typography/h4`            | Noto Sans TC Regular, 34 / 42, ls 0%, ORIGINAL | Roboto 400, 34 / 41.99, ls 0.25 px, none                     |
| `H5`        | `material-design/typography/h5`            | Inter Regular, 24 / 32, ls 0%, ORIGINAL        | Roboto 400, 24 / 32.016, ls normal, none                     |
| `H6`        | `material-design/typography/h6`            | Noto Sans TC Medium, 20 / 32, ls 0%, ORIGINAL  | Roboto 500, 20 / 32, ls 0.15 px, none                        |
| `Subtitle 1`| `material-design/typography/subtitle1`     | Noto Sans TC Regular, 16 / 28, ls 0%, ORIGINAL | Roboto 400, 16 / 28, ls 0.15 px, none                        |
| `Subtitle 2`| `material-design/typography/subtitle2`     | Noto Sans TC Regular, 14 / 20, ls 0%, ORIGINAL | Roboto 500, 14 / 21.98, ls 0.1 px, none                      |
| `Body 1`    | `material-design/typography/body1`         | Noto Sans TC Regular, 16 / 24, ls 0%, ORIGINAL | Roboto 400, 16 / 24, ls 0.15 px, none                        |
| `Body 2`    | `material-design/typography/body2`         | Noto Sans TC Regular, 14 / 20, ls 0%, ORIGINAL | Roboto 400, 14 / 20.02, ls 0.15 px, none                     |
| `Button`    | `component/typography/button` _(local — see `design-token.md`)_  | Noto Sans TC Medium, 14 / 24, ls 0%, **UPPER** | Roboto 500, 14 / 24.5, ls 0.4 px, uppercase                  |
| `Caption`   | `material-design/typography/caption`       | Noto Sans TC Regular, 12 / 20, ls 0%, ORIGINAL | Roboto 400, 12 / 19.92, ls 0.4 px, none                      |
| `Overline`  | `component/typography/overline` _(local — see `design-token.md`)_ | Noto Sans TC Regular, 12 / 32, ls 0%, **UPPER** | Roboto 400, 12 / 31.92, ls 1 px, uppercase                   |

#### Bold companions (`Bold=On`)

Every bold companion uses **Noto Sans TC Bold** (or **Inter Bold** for `H2` / `H5`). The size, line-height, letter-spacing, and `textCase` match the base style — only the font weight changes. Naming follows the convention `<base-style-name>-bold`. All 13 bold styles are minted as local styles in this file (the design system does not ship bold Typography styles today; promotion to the shared design-system file is a future enhancement).

| Variant     | Figma text style (local)                              | Resolves to                                       |
| ----------- | ----------------------------------------------------- | ------------------------------------------------- |
| `H1`        | `material-design/typography/h1-bold`                  | Noto Sans TC Bold, 96 / 112, ls 0%, ORIGINAL      |
| `H2`        | `material-design/typography/h2-bold`                  | Inter Bold, 60 / 72, ls 0%, ORIGINAL              |
| `H3`        | `material-design/typography/h3-bold`                  | Noto Sans TC Bold, 48 / 60, ls 0%, ORIGINAL       |
| `H4`        | `material-design/typography/h4-bold`                  | Noto Sans TC Bold, 34 / 42, ls 0%, ORIGINAL       |
| `H5`        | `material-design/typography/h5-bold`                  | Inter Bold, 24 / 32, ls 0%, ORIGINAL              |
| `H6`        | `material-design/typography/h6-bold`                  | Noto Sans TC Bold, 20 / 32, ls 0%, ORIGINAL       |
| `Subtitle 1`| `material-design/typography/subtitle1-bold`           | Noto Sans TC Bold, 16 / 28, ls 0%, ORIGINAL       |
| `Subtitle 2`| `material-design/typography/subtitle2-bold`           | Noto Sans TC Bold, 14 / 20, ls 0%, ORIGINAL       |
| `Body 1`    | `material-design/typography/body1-bold`               | Noto Sans TC Bold, 16 / 24, ls 0%, ORIGINAL       |
| `Body 2`    | `material-design/typography/body2-bold`               | Noto Sans TC Bold, 14 / 20, ls 0%, ORIGINAL       |
| `Button`    | `component/typography/button-bold`                    | Noto Sans TC Bold, 14 / 24, ls 0%, **UPPER**      |
| `Caption`   | `material-design/typography/caption-bold`             | Noto Sans TC Bold, 12 / 20, ls 0%, ORIGINAL       |
| `Overline`  | `component/typography/overline-bold`                  | Noto Sans TC Bold, 12 / 32, ls 0%, **UPPER**      |

### 4.2 Color token bindings — text fill

The master cell binds its single SOLID fill to **`alias/colors/text-default`** (`#000000DE` reference resolution). All 26 cells share the binding. Designers override the inner TEXT fill at the instance level when a different color is needed — see §2.1 for the variable-to-merak-key crosswalk and §3.1 for the override mechanic.

### 4.3 Cell-level rules

Typography has no `State` axis, so there are no per-state rules. Each cell is uniquely defined by its `(Variant, Bold)` pair:

- **Geometry** — single TEXT node wrapped in a hugging auto-layout COMPONENT (vertical, padding 0, item spacing 0, transparent fill). No padding, no border, no background, no shadow.
- **Typography** — `textStyleId` from the `(Variant, Bold)`-keyed binding in §4.1. No node-level case overrides (all UPPER-cased variants use UPPER-baked local styles instead).
- **Fill** — single SOLID paint with `boundVariables.color` set to `alias/colors/text-default` (§4.2).

Utility flags (`color`, `align`, `gutterBottom`, `noWrap`) are not encoded in any cell — they are designer-side instance overrides per §3.1.

## 5. Icons

n/a — `<Typography>` has no icon slots.

## 6. Layout

The component set is a **13 × 2 grid** of cells:

- **Rows** — one per `Variant` (13 rows: H1 → Overline).
- **Columns** — one per `Bold` value (`Off` left, `On` right).
- **Cell** — a single TEXT node bound to the row's text style (§4.1) and `alias/colors/text-default` for the fill. No padding, no border, no background, no shadow.

Documentation frame (`<Typography>`, `821:11807`) on page **Foundation Components**:

- **Header** at the top — set name + variant count (`13 × 2 = 26`).
- **Component Set** placed below the header. The grid is small enough (max H1 cell ~330 px wide, 2 columns) that the whole set fits in roughly `<frame width> ≤ 800 px`.

## 7. Usage Guidelines

### 7.1 Picking a variant / configuration

1. **Pick the `Variant`** matching the source `variant` prop. `subtitle1` / `subtitle2` are heading-adjacent — they share `<h6>` semantically with `H6` but differ visually.
2. **Pick the `Bold`** value. `Off` is the runtime weight (Light / Regular / Medium per `storybook.render.md` §1). `On` is the bold-weight companion. Use `Bold=On` for emphasis runs (`<strong>`, `<b>`, or a different MUI variant) — note the intent in handoff so the developer picks the right HTML / `font-weight` value.
3. **Override the `Label`** to the actual screen text. Long Latin labels behave well; CJK labels rely on Noto Sans TC's CJK glyphs (already bundled in the project text style).
4. **Override the inner TEXT fill** when the source `color` prop is anything other than `textPrimary`. Pick from the merak variable list in §2.1 — never paste raw hex.
5. **For non-default alignment**, select the inner TEXT node inside the instance and set `textAlignHorizontal` (`LEFT` / `CENTER` / `RIGHT` / `JUSTIFIED`). Figma allows this override without detaching the instance.
6. **For truncation**, select the inner TEXT and toggle `textTruncation: ENDING`; constrain the host frame's max-width so the ellipsis engages.
7. **For paragraph spacing** (the `gutterBottom` flag in source), set Auto Layout `itemSpacing` on the surrounding column to the per-Variant value in `storybook.render.md` §4.1 (e.g. `5.6 px` for `body1`).

### 7.2 Variant / semantics guidance

- Use `H1` … `H6` for visual hierarchy. Default tags (per MUI) follow the same numerical order, but the `component` prop can re-tag — pick `Variant` for the **visual** weight and let the developer choose the tag.
- Use `Subtitle 1` for sub-section leads; `Subtitle 2` for in-card lead lines.
- Use `Body 1` for primary copy; `Body 2` for dense / table-cell copy.
- Use `Button` only inside `<Button>` / `<IconButton>` / `<Chip>` instances — the variant exists for parity with MUI's typography table. Standalone `Variant=Button` cells are rare on real screens.
- Use `Caption` for image captions, footnotes, and timestamps.
- Use `Overline` for tag labels above a section heading (uppercase, wide tracking).
- `Bold=On` adds emphasis without changing the variant rhythm — useful for list-bullet leads ("**Note:** …"), table-cell highlights, and inline emphasis. At handoff, indicate whether the runtime should render `<strong>` / `<b>` / a different `variant`.

### 7.3 Don'ts

- ❌ Don't detach the Typography instance to recolor it — rebind the inner TEXT fill to a different merak variable (§2.1) on the instance instead. Detached instances drift from `seed/*` / `alias/*` values when the theme is re-keyed.
- ❌ Don't paint a Typography cell with a raw hex value. Every text fill must resolve to a local variable (see §4.2 / §1 local-only rule).
- ❌ Don't hand-set `fontName` / `fontSize` / `lineHeight` on a cell — apply the `textStyleId` from §4.1 instead. The local component-scoped styles for `Button` / `Overline` / every bold companion are minted exactly so this rule holds across the 26 cells.
- ❌ Don't rebind `Variant=Button` from `component/typography/button` to `material-design/typography/subtitle2` "because it's the same size" — the local style bakes `textCase: UPPER`, the design-system style does not.
- ❌ Don't expect inner-TEXT `textTruncation: ENDING` to truncate inside an auto-layout frame whose `layoutSizingHorizontal=HUG` — the parent must be `FIXED` or `FILL` for the ellipsis to engage.
- ❌ Don't add a `State` axis "for parity with `<Button>`". Typography is non-interactive; adding states would explode the matrix to `13 × 2 × 5 = 130` cells with no semantic meaning.
- ❌ Don't read `Bold=On` as "set CSS `font-weight: 700`" without checking the surrounding context — many MUI consumers translate `Bold=On` into a different `variant` (e.g. `Body 1, Bold=On` → `subtitle1`-like emphasis) rather than overriding `font-weight` at the runtime level.

## 8. Source Sync Rule

This document and the source must move together. Files that, when changed, force a spec update:

1. `src/stories/Typography.stories.tsx` — the story file (variant or color enumerations).
2. The published Figma component set inside frame `821:11807` (`figma_node_id` in frontmatter) — variant axes / property defaults / text-style bindings.
3. `node_modules/@mui/material/styles/createTypography.js` — MUI's default Typography object. A version bump in `package.json` (`@mui/material`) requires re-running `storybook.render.md` §1 measurements.
4. `.storybook/preview.tsx` — adding a `createTheme({ typography: ... })` override in the Storybook decorator means the runtime measurements no longer reflect the design system; both this spec and `storybook.render.md` need to be re-probed.
5. `figma-design-guide/design-token.md` §3 (`material-design/typography/*` text styles) — a renamed / removed text style needs every `textStyleId` reference in §4.1 updated.
6. `figma-design-guide/design-token.md` §1 (`merak/alias/colors/*` and `merak/seed/*/main`) — a renamed / removed color variable needs every reference in §2.1 / §4.2 updated.
7. `design-token.md` (next to this file) — the local component-scoped text styles. A change to any local style's font / weight / size / line-height is a spec-affecting edit.

Specifically:

- **Add a Typography variant to MUI** (e.g. MUI 8 ships `display1`): add the variant to `Typography.stories.tsx` (export + matrix arrays), append a row to `storybook.render.md` §1, append rows to §4.1 here (both base + bold), and add the variant to the Figma component set's `Variant` axis options. Mint the corresponding bold-companion local style.
- **Drop a Typography variant**: remove from the story, the matrix arrays, §3 / §4.1, and de-publish the corresponding cells from the Figma set. Remove the bold-companion local style.
- **Promote a bold style to the design system**: when `figma-design-guide/design-token.md` §3 starts shipping `material-design/typography/<v>-bold` as a real published style, delete the local copy in this file and re-bind the `Bold=On` cell to the shared style. Update §4.1 and `design-token.md` accordingly.
- **Change the project's text-style sizes / weights / line-heights** (e.g. design-system bumps `typography/h6` from 20 / 32 to 22 / 32): the Figma cell still resolves correctly because it binds by `textStyleId`. Only update §4.1's "Resolves to (project)" column. Mint a matching update in the bold companion if the change should apply there too.
- **Rename a text style** (e.g. `material-design/typography/h6` → `material-design/typography/heading-6`): every `textStyleId` reference in §4.1 needs the new name, and every Figma cell needs to be re-bound. This is a token-name change, not a token-value change.
- **MUI changes the default-tag mapping** (`subtitle1` → no longer `<h6>`): purely a runtime concern — update `storybook.render.md` §1 "Default tag" column and §7.2 of this spec.

The token-value vs. token-name distinction matters: a value change in `figma-design-guide/design-token.md` (e.g. `seed/danger/main` re-resolves from `#D32F2F` to `#C62828`) needs **no** spec edit (variables resolve by name). A rename or removal forces an update to every reference in §2.1, §4.1, §4.2.

## 9. Quick Reference

```ts
// src/stories/Typography.stories.tsx — surface re-exported from @mui/material
export type Props = {
  variant?:
    | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    | 'subtitle1' | 'subtitle2'
    | 'body1' | 'body2'
    | 'button' | 'caption' | 'overline'
    | 'inherit';                              // → Figma `Variant` axis (13 values; `inherit` not exposed)
  color?:
    | 'textPrimary' | 'textSecondary' | 'textDisabled'
    | 'primary' | 'secondary'
    | 'error' | 'warning' | 'info' | 'success'; // (instance override on inner TEXT.fills — not a Figma property; see §2.1 for variable mapping)
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'; // (instance override on inner TEXT.textAlignHorizontal — not a Figma property)
  gutterBottom?: boolean;                     // (Auto Layout itemSpacing on the surrounding column — not a Figma property)
  noWrap?: boolean;                           // (instance override on inner TEXT.textTruncation — not a Figma property)
  paragraph?: boolean;                        // (behavior-only — sets component=p + gutterBottom)
  component?: React.ElementType;              // (behavior-only — picks the rendered tag)
  variantMapping?: Partial<Record<Variant, string>>; // (behavior-only)
  children?: React.ReactNode;                 // → Figma `Label` TEXT property
};

// Figma-only synthetic axis — no MUI counterpart at runtime
type FigmaBold = 'Off' | 'On';                // → Figma `Bold` axis (2 values)
```

```
Figma component set: <Typography> (frame 821:11807, page Foundation Components)
- Variant axes        : Variant × Bold  (13 × 2 = 26)
- TEXT property       : Label  (default "Sample")
- Default cell        : Variant=Body 1, Bold=Off
- Text-style bindings : 11 base Variants → material-design/typography/<variant>; Variant=Button (base) → component/typography/button (local, UPPER); Variant=Overline (base) → component/typography/overline (local, UPPER); 11 Bold companions → material-design/typography/<variant>-bold (local); Variant=Button (bold) → component/typography/button-bold (local, UPPER); Variant=Overline (bold) → component/typography/overline-bold (local, UPPER) — see design-token.md
- Per-cell text-fill  : alias/colors/text-default (single token; designers override per instance — see §2.1)
- State axis          : NONE — Typography is non-interactive
- Color axis          : NONE — instance-level inner-TEXT fill override (see §2.1)
- Utility flags       : color / align / gutterBottom / noWrap are NOT Figma properties — instance-level overrides on the inner TEXT (or Auto Layout itemSpacing for gutterBottom)
- Synthetic axes      : Bold (Off/On) — no MUI prop counterpart; Figma-only emphasis toggle
```

## 10. Token Glossary

### Seed tokens (`seed/*`)

Six families consumed at the **instance level** for color overrides; the master cell does not bind any `seed/*` token (the master uses `alias/colors/text-default`). Each family is consumed via the `main` suffix only (Typography never reads `hover` / `focusVisible` / etc. since there are no states):

- `seed/primary/main` (`#1976D2`) — designer-overrideable text fill for `color="primary"`.
- `seed/secondary/main` (`#9C27B0`) — designer-overrideable text fill for `color="secondary"`.
- `seed/danger/main` (`#D32F2F`) — designer-overrideable text fill for `color="error"`.
- `seed/warning/main` (`#ED6C02`) — designer-overrideable text fill for `color="warning"`.
- `seed/info/main` (`#0288D1`) — designer-overrideable text fill for `color="info"`.
- `seed/success/main` (`#2E7D32`) — designer-overrideable text fill for `color="success"`.

### Alias tokens (`alias/colors/*`)

| Token                          | Used by                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------- |
| `alias/colors/text-default`    | **Master cell text fill** (single binding shared across all 26 cells)           |
| `alias/colors/text-sub`        | Designer-overrideable for `color="textSecondary"` (instance level)              |
| `alias/colors/text-disabled`   | Designer-overrideable for `color="textDisabled"` (instance level)               |

No `alias/colors/border-defalt` _(sic)_ usage — Typography has no border.

### Component-scoped tokens (`component/typography/*`)

| Token                               | What it is                                               | Used by                            |
| ----------------------------------- | -------------------------------------------------------- | ---------------------------------- |
| `component/typography/button`       | Local text style — Noto Sans TC Medium 14 / 24, ls 0%, **textCase UPPER**. Resolves the missing `material-design/typography/button` style; UPPER baked into the style so the cell can bind cleanly. Minted local-only. See `design-token.md` next to this spec. | `Variant=Button, Bold=Off` cell    |
| `component/typography/button-bold`  | Local text style — Noto Sans TC Bold 14 / 24, ls 0%, **textCase UPPER**. Bold companion of `component/typography/button`. Minted local-only.                              | `Variant=Button, Bold=On` cell     |
| `component/typography/overline`     | Local text style — Noto Sans TC Regular 12 / 32, ls 0%, **textCase UPPER**. Mirrors the published `material-design/typography/overline` shape but bakes UPPER directly so the cell can bind without losing its `textStyleId`. Minted local-only. | `Variant=Overline, Bold=Off` cell  |
| `component/typography/overline-bold`| Local text style — Noto Sans TC Bold 12 / 32, ls 0%, **textCase UPPER**. Bold companion of `component/typography/overline`. Minted local-only.                            | `Variant=Overline, Bold=On` cell   |

### Effect / shape & elevation

n/a — Typography has no shadow, no border, no border-radius surface.

### Typography text styles consumed

11 published styles from `material-design/typography/*` (base weight):

`typography/h1`, `typography/h2`, `typography/h3`, `typography/h4`, `typography/h5`, `typography/h6`, `typography/subtitle1`, `typography/subtitle2`, `typography/body1`, `typography/body2`, `typography/caption`.

11 local bold-companion styles minted in this file under the same namespace:

`typography/h1-bold`, `typography/h2-bold`, `typography/h3-bold`, `typography/h4-bold`, `typography/h5-bold`, `typography/h6-bold`, `typography/subtitle1-bold`, `typography/subtitle2-bold`, `typography/body1-bold`, `typography/body2-bold`, `typography/caption-bold`.

4 component-scoped local styles:

`component/typography/button`, `component/typography/button-bold`, `component/typography/overline`, `component/typography/overline-bold` (see `design-token.md`).

Project text styles use Noto Sans TC (Inter for `h2` / `h5`), letter-spacing 0% — see `figma-design-guide/design-token.md` §3 for the full per-style definition. Documented divergences from MUI runtime (font-family swap, zeroed letter-spacing, `subtitle2` weight / line-height rounding, the `button` / `overline` UPPER baking, the synthetic `Bold` axis) are listed in `storybook.render.md` §5–§6 and `design-token.md`.

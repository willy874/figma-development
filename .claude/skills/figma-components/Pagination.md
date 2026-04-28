---
name: figma-component-pagination
description: Figma component specification for `<Pagination>` — the design counterpart of `apps/console/src/components/Pagination/Pagination.tsx`. Documents the composite pagination surface, its internal `<PaginationItem>` variants, component properties, design tokens, state behavior, and source-to-Figma mapping rules.
parent_skill: figma-components
---

# `<Pagination>` Figma Component Specification

## 1. Overview

`<Pagination>` is the Figma counterpart of the `Pagination` foundation component in `apps/console/src/components/Pagination/Pagination.tsx`. The source is a thin wrapper around MUI `<Pagination>` that **hard-codes `variant="outlined"` and `shape="rounded"`**, exposes only page-count + change-handler props, and forwards `disabled` to MUI.

Because the wrapper deliberately narrows MUI's surface, the Figma component mirrors that narrow surface — no `Variant` / `Shape` axes. The Figma component **does** expose a `Color` axis (6 Merak theme colors), even though the current `Pagination.tsx` source does not yet accept a `color` prop — see §2.1 for the source-extension path and §8 for the sync rule.

The specification covers two related design entities:

- **`<PaginationItem>`** — the atomic button / arrow / ellipsis used inside the pagination bar. It carries all of the variant logic.
- **`<Pagination>`** — the composite frame that arranges item instances, owns layout, and exposes text / boolean instance properties.

| Aspect                 | Value                                                                            |
| ---------------------- | -------------------------------------------------------------------------------- |
| Source file            | `apps/console/src/components/Pagination/Pagination.tsx`                          |
| Figma frame            | `Pagination` on page **Foundation Components**                                   |
| Item Component Set     | `<MerakPaginationItem>`                                                          |
| Wrapper Component Set  | `<MerakPagination>`                                                              |
| Item variants          | **288** (6 colors × 4 types × 3 sizes × 4 states) — see §3                       |
| Wrapper variants       | **36** (6 colors × 3 sizes × 2 states) — see §3.3                                |
| Color axis             | `Default`, `Primary`, `Danger`, `Warning`, `Info`, `Success` (`MerakColorTheme`) |
| Underlying MUI version | `@mui/material@5+`                                                               |
| Hard-coded MUI props   | `variant="outlined"`, `shape="rounded"`                                          |
| Typography             | Roboto Regular, no case transform, letter-spacing `0.01071em`                    |

## 2. Source-to-Figma Property Mapping

### 2.1 Wrapper props (`Pagination.tsx`)

| Source prop                                                     | Figma surface                                         | Type              | Notes                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------- | ----------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `currentPage: number`                                           | `Current Page` property on wrapper instance           | TEXT              | Drives which child item carries `State=Selected`                                                                                                                                                                                                                                                     |
| `totalPage: number`                                             | `Total Pages` property on wrapper instance            | TEXT              | Drives how many page items render + ellipsis placement                                                                                                                                                                                                                                               |
| `onPageChange: (page) => void`                                  | —                                                     | —                 | Behavior-only, no design representation                                                                                                                                                                                                                                                              |
| `disabled: boolean`                                             | `State=Disabled` wrapper variant + `Disabled` BOOLEAN | BOOLEAN + VARIANT | Propagates `State=Disabled` to every child item                                                                                                                                                                                                                                                      |
| _(fixed in source)_ `variant="outlined"`                        | Rendered as the only Figma style                      | —                 | Not a variant axis — there is no `text` pagination in Merak                                                                                                                                                                                                                                          |
| _(fixed in source)_ `shape="rounded"`                           | Rendered as the only Figma style                      | —                 | Not a variant axis — rounded rectangle only, no circular                                                                                                                                                                                                                                             |
| _(not exposed by wrapper)_ `size`                               | `Size` wrapper variant                                | VARIANT           | Exposed in Figma for screen-level layout work even though Merak fixes `medium` at runtime — see §8 Sync Rule for how to keep this honest                                                                                                                                                             |
| _(not exposed by wrapper today)_ `color`                        | `Color` wrapper + item variant                        | VARIANT           | Figma exposes 6 Merak theme colors. Source `Pagination.tsx` doesn't yet accept `color?: MerakColorTheme` — extending it requires wiring a `renderItem`/`sx` override for `danger/warning/info/success` since MUI `Pagination` natively only supports `standard/primary/secondary`. See §8 Sync Rule. |
| _(not exposed by wrapper)_ `siblingCount` / `boundaryCount`     | Implicit via the composite layout                     | —                 | Figma examples use MUI defaults (`siblingCount=1`, `boundaryCount=1`)                                                                                                                                                                                                                                |
| _(not exposed by wrapper)_ `showFirstButton` / `showLastButton` | Not provided                                          | —                 | Merak never renders first/last jump buttons; omitted from item types                                                                                                                                                                                                                                 |

### 2.2 Item properties (`<PaginationItem>`)

Each child rendered inside `<Pagination>` is an instance of `<PaginationItem>`. The source does not expose these directly — MUI constructs them — but the Figma component must enumerate every type they can take.

| Figma property | Type    | Options                                                      | Maps to MUI `PaginationItem` prop                                                                                                                                      |
| -------------- | ------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Color`        | VARIANT | `Default`, `Primary`, `Danger`, `Warning`, `Info`, `Success` | `color: 'standard' \| 'primary' \| …` — Merak's 6 colors; only `Page/Hovered` and `Page/Selected` change visually per Color, all other combinations render identically |
| `Type`         | VARIANT | `Page`, `Previous`, `Next`, `Ellipsis`                       | `type: 'page' \| 'previous' \| 'next' \| 'start-ellipsis' \| 'end-ellipsis'` (start / end ellipsis collapsed into one design)                                          |
| `Size`         | VARIANT | `Small`, `Medium`, `Large`                                   | `size`                                                                                                                                                                 |
| `State`        | VARIANT | `Enabled`, `Hovered`, `Selected`, `Disabled`                 | Runtime state: `selected`, `disabled`, `:hover`                                                                                                                        |
| `Label`        | TEXT    | default `1`                                                  | Used only when `Type=Page`; the rendered page number                                                                                                                   |

> `Selected` is only meaningful when `Type=Page`. The `Previous`, `Next`, and `Ellipsis` types ignore it — if an engineer picks `Type=Previous, State=Selected` in Figma, render it identically to `Type=Previous, State=Enabled`.

## 3. Variant Property Matrix

### 3.1 `<PaginationItem>`

```
Color × Type × Size × State = 6 × 4 × 3 × 4 = 288 variants
```

| Property | Default value | Options                                                      |
| -------- | ------------- | ------------------------------------------------------------ |
| `Color`  | `Default`     | `Default`, `Primary`, `Danger`, `Warning`, `Info`, `Success` |
| `Type`   | `Page`        | `Page`, `Previous`, `Next`, `Ellipsis`                       |
| `Size`   | `Medium`      | `Small`, `Medium`, `Large`                                   |
| `State`  | `Enabled`     | `Enabled`, `Hovered`, `Selected`, `Disabled`                 |

> Many combinations are visually identical across `Color` (e.g. `Previous/Enabled` / `Ellipsis/Disabled` — every state except `Page/Selected` and `Page/Hovered` render the same regardless of color). They're kept as duplicates because Figma requires uniform axes across a component set — same pattern as `<MerakButton>` (162 variants with most colors looking the same per non-contained state).

### 3.2 Component (non-variant) properties on the item

| Property key | Type | Default | Purpose                                                                                               |
| ------------ | ---- | ------- | ----------------------------------------------------------------------------------------------------- |
| `Label`      | TEXT | `1`     | Page number shown when `Type=Page`. Ignored (rendered as glyph) for `Previous` / `Next` / `Ellipsis`. |

### 3.3 `<Pagination>` wrapper

```
Color × Size × State = 6 × 3 × 2 = 36 variants
```

| Property | Default value | Options                                                      |
| -------- | ------------- | ------------------------------------------------------------ |
| `Color`  | `Default`     | `Default`, `Primary`, `Danger`, `Warning`, `Info`, `Success` |
| `Size`   | `Medium`      | `Small`, `Medium`, `Large`                                   |
| `State`  | `Enabled`     | `Enabled`, `Disabled`                                        |

> Each wrapper variant pre-wires its 9 nested item instances to the matching `Color` variant so a full-width pagination bar reads consistently when dropped onto a screen. The wrapper's `Color` variant drives all nested item `Color` values in lockstep.

### 3.4 Component (non-variant) properties on the wrapper

| Property key   | Type    | Default | Purpose                                                                                                                                                                          |
| -------------- | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Current Page` | TEXT    | `1`     | Instance-level current page. The designer updates this + `Total Pages` and the correct child item is manually set to `State=Selected`.                                           |
| `Total Pages`  | TEXT    | `10`    | Instance-level total page count. Drives the documentation label shown beneath the bar; does **not** auto-render extra page items — the wrapper is a static composition (see §6). |
| `Disabled`     | BOOLEAN | `false` | Convenience mirror of `State=Disabled`. Linked to every child's `State` via component-property exposure.                                                                         |

## 4. Design Tokens

All surfaces, borders, and text are bound to Merak design tokens declared in:

- `apps/console/src/themes/seed.css` — `--merak-seed-{family}-{token}` (palette by color family)
- `apps/console/src/themes/alias.css` — `--merak-alias-{group}-{token}` (semantic, color-agnostic)
- `apps/console/src/themes/light.ts` / `dark.ts` — JS values that produce the CSS variables above
- `apps/console/src/themes/constants.tsx` — JS-side mapping (`CssVarByThemeColors`, `ClassNameByThemeColors`)
- `apps/console/src/themes/mui-theme.ts` — `shape.borderRadius`, palette, typography overrides

In Figma, every paint **must** be bound to a Variable that mirrors one of these tokens. Hex values shown below are reference resolutions of the light theme — do not paste them directly; bind to the token instead.

### 4.1 Sizing

`Pagination.tsx` does not override MUI's default Pagination metrics; the Figma component therefore mirrors MUI's defaults. The project does not yet expose pagination-specific spacing / radius / typography tokens, so these values are the source of truth until such tokens are added (see §8 Sync Rule).

| Size   | Item Height | Min Width | Horizontal Padding | Font Size | Icon Size | Corner Radius | Item Spacing |
| ------ | ----------- | --------- | ------------------ | --------- | --------- | ------------- | ------------ |
| Small  | `26`        | `26`      | `4`                | `13`      | `18`      | `4`           | `4`          |
| Medium | `32`        | `32`      | `6`                | `14`      | `22`      | `4`           | `4`          |
| Large  | `40`        | `40`      | `8`                | `15`      | `26`      | `4`           | `4`          |

- Corner radius matches `theme.shape.borderRadius = 4` from `apps/console/src/themes/mui-theme.ts` (this is what `shape="rounded"` maps to).
- Outlined border: `strokeAlign = INSIDE`, `strokeWeight = 1`.
- Typography: `Roboto Regular`, letter-spacing `0.01071em`, **no** `textCase` override — numbers render as-is.
- Item spacing (`Auto Layout gap`) is fixed at `4 px` across all sizes per MUI defaults.

### 4.2 Color token bindings

Color family resolution is split between the **Default** (neutral) family and each of the 5 theme seed families. Only `Page/Selected` and `Page/Hovered` differ per `Color`; all other combinations render identically across the axis.

#### Default color (neutral) — same as stock MUI `color="standard"`

Token names below are Figma variable paths (`merak` collection), not CSS variables. See `.claude/skills/figma-design-guide/design-token.md`.

| Figma paint slot                                          | Token binding                            | Notes                                                                                   |
| --------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------- |
| Item background (`Enabled`, `Disabled`)                   | **`alias/colors/bg-default`**            | Transparent against card surface; bind to variable, don't set to `transparent` literal. |
| Item background (`Hovered`)                               | **`alias/colors/bg-outline-hover`**      | 4% black overlay.                                                                       |
| Item background (`Selected`, `Type=Page`)                 | **`alias/colors/bg-selected`**           | 8% black overlay.                                                                       |
| Item border (`Enabled`, `Hovered`, `Selected`)            | **`alias/colors/border-defalt`** _(sic)_ | Outlined stroke, neutral.                                                               |
| Item border (`Disabled`)                                  | **`alias/colors/bg-disabled`**           | 12% black — desaturates the stroke.                                                     |
| Item foreground / icon (`Enabled`, `Hovered`, `Selected`) | **`alias/colors/text-default`**          | 87% black.                                                                              |
| Item foreground / icon (`Disabled`)                       | **`alias/colors/text-disabled`**         | 38% black.                                                                              |

#### Theme colors (`Primary` / `Danger` / `Warning` / `Info` / `Success`) — per MUI outlined `color="{X}"`

All tint fills bind to **pre-alpha'd** variables so the 4 %/8 % opacity survives Figma's instance flattening (a known quirk where `paint.opacity < 1` + `boundVariables.color` collapses to opacity 1 on instance creation). Each color family has a 4 %-alpha "hover-bg" token; Selected stacks two of them to produce ~7.8 %, visually indistinguishable from MUI's 8 %.

| Figma paint slot                        | Token binding                                                                                   | Notes                                                                                                                               |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `Page/Hovered` background               | **`seed/{color}/hover-bg`** _(α = 0.04)_ — or `seed/{color}/outline-hover` for Danger / Warning | Single fill layer, baked 4% tint of the color main.                                                                                 |
| `Page/Selected` background              | **Two stacked fills** of the same `hover-bg` token                                              | Composite 1 − (1 − 0.04)² ≈ 0.078 ≈ 8% tint. Matches MUI's outlined selected fill within ~0.2%.                                     |
| `Page/Selected` border                  | **`seed/{color}/outlineBorder`** _(α = 0.5)_                                                    | 50% tint of color main, baked in the token.                                                                                         |
| `Page/Selected` foreground (Label text) | **`seed/{color}/main`** _(α = 1)_                                                               | Solid color main.                                                                                                                   |
| All other slots                         | _(same as Default row above)_                                                                   | Borders, non-Page hovers, disabled, and icon fills inherit the neutral treatment — color only stylizes the Selected + Hovered Page. |

Variable name per color (4 %-alpha hover token used for both `Hovered` and `Selected` layering):

| Color   | 4 %-alpha token              | 50 %-alpha token (outlineBorder) | 100 %-alpha token (main) |
| ------- | ---------------------------- | -------------------------------- | ------------------------ |
| Primary | `seed/primary/hover-bg`      | `seed/primary/outlineBorder`     | `seed/primary/main`      |
| Danger  | `seed/danger/outline-hover`  | `seed/danger/outlineBorder`      | `seed/danger/main`       |
| Warning | `seed/warning/outline-hover` | `seed/warning/outlineBorder`     | `seed/warning/main`      |
| Info    | `seed/info/hover-bg`         | `seed/info/outlineBorder`        | `seed/info/main`         |
| Success | `seed/success/hover-bg`      | `seed/success/outlineBorder`     | `seed/success/main`      |

> **Why stacked fills, not paint opacity?** Figma stores a fill's opacity on the variant correctly, but when a top-level instance of the wrapper set is created on a screen, any `paint.opacity < 1` combined with a bound variable is flattened back to `opacity = 1` in the instance. Binding to a variable whose **resolved value already carries alpha** avoids that flattening — the instance reads the variable's alpha directly at render time. Stacking the 4 % layer twice for Selected is the only way to reach ~8 % without introducing a new `seed/{color}/selected-bg @ α=0.08` token per color.

> The visible border radius is `4 px` on every corner. If a future design adds `shape="circular"`, add a `Shape` variant axis to both component sets and update §2.1, §3, and §4.1 per §8.

### 4.3 State rules

All non-color paints use semantic alias tokens so dark mode works automatically. Token names below are **the binding** — opacity columns are kept only because some paints originate from rgba-based MUI alias tokens.

For `Color=Default` (neutral):

| State                           | Background                       | Border                       | Foreground / Icon              |
| ------------------------------- | -------------------------------- | ---------------------------- | ------------------------------ |
| **Enabled**                     | `bg-default` _(transparent)_     | `border-default`             | `text-default`                 |
| **Hovered**                     | `bg-outline-hover` _(4 % black)_ | `border-default`             | `text-default`                 |
| **Selected** (`Type=Page` only) | `bg-selected` _(8 % black)_      | `border-default`             | `text-default`                 |
| **Disabled**                    | `bg-default` _(transparent)_     | `bg-disabled` _(12 % black)_ | `text-disabled` _(38 % black)_ |

For `Color ∈ {Primary, Danger, Warning, Info, Success}` — only `Page/Hovered` and `Page/Selected` differ; other states inherit the Default row above:

| State (Page type only) | Background                                                                | Border                                   | Foreground (Label text) |
| ---------------------- | ------------------------------------------------------------------------- | ---------------------------------------- | ----------------------- |
| **Hovered**            | 1× `seed/{color}/hover-bg` (or `-outline-hover`) — 4 % tint               | `border-default`                         | `text-default`          |
| **Selected**           | 2× stacked `seed/{color}/hover-bg` (or `-outline-hover`) — ~8 % composite | `seed/{color}/outlineBorder` — 50 % tint | `seed/{color}/main`     |

Notes:

- `Hovered + Selected` is represented by the `Selected` variant alone. MUI resolves the hover delta at runtime; Figma freezes the selected treatment.
- `Focused` and `Pressed` are intentionally omitted to keep the matrix at 288 item variants. MUI's focus ring uses `seed/{color}/focusVisible` which is already declared in the `merak` variable collection — adding `State=Focused` would add 72 variants.
- `Previous` / `Next` / `Ellipsis` types reuse the Default `Enabled` / `Hovered` / `Disabled` columns exactly across every `Color`. They have no `Selected` treatment; see §2.2.

## 5. Icons

Icons are **instances** of the existing icon components on the Figma **Icon** page — not inline Vectors. Each non-Page variant nests an icon instance inside a non-auto-layout `Icon` wrapper frame so it can be rotated reliably.

| Item `Type` | Source Figma component                                                                 | Size mapping                                               | Transform                                                 |
| ----------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------- |
| `Previous`  | `<Icon>` component set — chevron-right, variants `Size=sm` / `md` / `lg`               | `Small → sm (20)` · `Medium → md (24)` · `Large → lg (28)` | Rotated 180° (center pivot) to become chevron-left        |
| `Next`      | `<Icon>` component set (same as above)                                                 | same                                                       | None                                                      |
| `Ellipsis`  | `More` component — vertical three-dot (`more-vert`), resized from 48 to `20 / 24 / 28` | `Small/Medium/Large`                                       | Rotated 90° (center pivot) to become horizontal three-dot |

- Color: the inner `Vector` fill of the icon instance is overridden per variant, bound to the matching Merak alias token — `alias/colors/text-default` for `Enabled / Hovered / Selected`, `alias/colors/text-disabled` for `Disabled`. Because the source icons don't ship with variable-bound fills, this override is required.
- Rotation is applied via `relativeTransform` on the icon instance inside a non-auto-layout wrapper frame — the wrapper itself is the auto-layout child, so the parent item can lay out normally while the icon rotates cleanly around its own center.
- The icons are **not** exposed via an `INSTANCE_SWAP` component property. Figma's INSTANCE_SWAP property shares a single default across every variant of a set, which is incompatible with this component — each `Type` variant needs a different baseline icon (chevron vs. three-dot). Swapping the icon per-variant inside the set is fine; exposing it as a property forces every linked variant to the same default and breaks the matrix.
- Designers who want to replace an icon on an instance can still use Figma's standard **right-click → Swap Instance** (or the icon picker in the right panel) — this works out-of-the-box without a dedicated property.
- If a screen needs first/last jump chevrons (`«` / `»`), extend the component per §8 by adding `First` / `Last` to the `Type` axis instead of swapping icons ad-hoc, so the behavior is encoded in the type system rather than as an override.

## 6. Layout

### 6.1 Item component set layout

`<PaginationItem>` is laid out as **16 rows × 3 columns** inside its frame:

- **Rows** = `Type` (4) × `State` (4), interleaved (`Page/Enabled`, `Page/Hovered`, `Page/Selected`, `Page/Disabled`, `Previous/Enabled`, …).
- **Columns** = `Size` (3), left-to-right (`Small`, `Medium`, `Large`).
- Cell size: `64 × 56` px (item hugs content; cell provides grid spacing).

### 6.2 Wrapper composition

`<Pagination>` is an **Auto Layout** horizontal frame containing a **static** sequence of 9 `<PaginationItem>` instances in this order, matching MUI's default output for `count ≥ 7` with `siblingCount=1, boundaryCount=1`:

```
[ Previous ] [ 1 ] [ Ellipsis ] [ currentPage-1 ] [ currentPage ]* [ currentPage+1 ] [ Ellipsis ] [ Total Pages ] [ Next ]
```

- Gap: `4` px (matches §4.1 Item Spacing).
- Padding: `0`. The surrounding surface — table footer, drawer — owns page-level padding.
- The middle `currentPage` item has `State=Selected`. Designers must manually update this when they change the `Current Page` property.
- Because the wrapper is a **static composition** (not a variant explosion), the frame cannot dynamically collapse ellipses. For small `Total Pages` values (≤ 7) where MUI would render without ellipses, use a dedicated variant frame (see §7.3) or author the simpler composition as a separate override instance.
- Surrounding documentation in the same frame:
  - **Header** — title, source path, behavior summary, hard-coded `variant="outlined"` + `shape="rounded"` callout.
  - **Showcase** panel — curated examples: Sizes, States, Common usage (table footer at 10 rows × 23 pages, drawer footer at 5 rows × 3 pages, first-page edge case, last-page edge case).

## 7. Usage Guidelines

### 7.1 Picking a configuration

1. Choose the wrapper `Size` to match the density of the surrounding surface: `Small` for dense tables, `Medium` for standard data grids, `Large` for hero layouts. Merak code fixes `Size=Medium` at runtime, so override in Figma only when you are proposing a layout that requires a different size.
2. Set `Current Page` + `Total Pages` on the instance to document the scenario.
3. Use `State=Disabled` only to demonstrate a disabled snapshot (e.g. while data is loading). Production screens should use `Enabled`.
4. For edge cases (current page = 1, current page = total), detach the wrapper or use a screen-specific composition — the static wrapper assumes a middle-page layout.

### 7.2 When NOT to use `<Pagination>`

- Infinite scroll or cursor-paginated lists → use a load-more pattern, not a page bar.
- Single-page surfaces (`Total Pages = 1`) → omit the pagination bar entirely; the source still renders one item but product convention is to hide it.
- Sub-page navigation (e.g. "page 1 of a wizard") → use `<Stepper>` or dedicated breadcrumb, not pagination.

### 7.3 Don'ts

- ❌ Don't detach instances to recolor items — Merak pagination has no color axis. If you need color, the design system needs a new axis (see §8).
- ❌ Don't switch `variant` to "text" or `shape` to "circular" by overriding styles — those options aren't available in `Pagination.tsx`. If the design needs them, the source must be extended first.
- ❌ Don't add first/last jump buttons by hand-drawing glyphs. Extend the `Type` axis with `First` / `Last` options, then republish.
- ❌ Don't rely on the static wrapper for small `Total Pages`. Its geometry assumes `Total Pages ≥ 7` and a middle current page.
- ❌ Don't use `State=Selected` on `Previous` / `Next` / `Ellipsis` — the treatment isn't defined (see §2.2).

## 8. Source Sync Rule

This document and the source must move together (per the project's **Features Sync Rule** spirit, applied here to design-system components):

When **any** of the following changes:

1. `apps/console/src/components/Pagination/Pagination.tsx` (props, hard-coded MUI options, default values)
2. The Figma `<PaginationItem>` or `<Pagination>` component sets (variants, properties, token bindings)
3. `apps/console/src/themes/constants.tsx` (theme color mappings — only relevant if a color axis is later added)
4. `apps/console/src/themes/seed.css` / `alias.css` / `component.css` (CSS variable surface)
5. `apps/console/src/themes/light.ts` / `dark.ts` (alias token JS values feeding the CSS vars)
6. `apps/console/src/themes/mui-theme.ts` (`shape.borderRadius`, palette, typography overrides)

…this spec **must be updated in the same change**. Specifically:

- New prop exposed by the wrapper (e.g. re-adding `size`, adding `color`) → add the corresponding axis to §2.1, §3 and regenerate the affected variants.
- Hard-coded `variant` / `shape` removed from the source → add `Variant` / `Shape` axes to both component sets, expand §3, and update §4 token bindings for each new combination.
- New MUI item type added (e.g. `First`, `Last`) → append to `Type` in §2.2, §3.1, §5, and add 12 item variants (3 sizes × 4 states) per new type.
- Token rename / removal in `seed.css` or `alias.css` → update every Figma token reference (`seed/…`, `alias/colors/…`) in §4.2, §4.3 and §10 to the new name, and rename the matching variable in the `merak` Figma collection.
- Token value change in `light.ts` / `dark.ts` → no edit to this spec needed (Figma variables resolve through the same token name); only re-publish the Figma library.
- New component property (e.g. loading skeleton) → add to §3.2 / §3.4 with key, type, default, and linkage.

## 9. Quick Reference

```ts
// Source prop surface (Pagination.tsx)
interface PaginationProps {
  currentPage?: number; // → Figma wrapper `Current Page` (TEXT)
  totalPage?: number; // → Figma wrapper `Total Pages` (TEXT)
  onPageChange?: (page: number) => void; // behavior-only
  disabled?: boolean; // → Figma wrapper `State=Disabled` / `Disabled` (BOOLEAN)
}

// Hard-coded in Merak source:
//   variant="outlined"  → fixed in Figma, no Variant axis
//   shape="rounded"     → fixed in Figma, no Shape axis
```

```
Figma Item Component Set: <PaginationItem>
  Variant axes : Color × Type × Size × State
  Properties   : Label (TEXT)
  Default      : Color=Default, Type=Page, Size=Medium, State=Enabled
  Total        : 288 variants (6 × 4 × 3 × 4)

Figma Wrapper Component Set: <Pagination>
  Variant axes : Color × Size × State
  Properties   : (none at wrapper level — edit nested item Labels directly)
  Default      : Color=Default, Size=Medium, State=Enabled
  Total        : 36 variants (6 × 3 × 2)
  Composition  : 9 <PaginationItem> instances in Auto Layout (see §6.2),
                 each pre-wired to the wrapper's Color so a full bar stays in sync
```

## 10. Token Glossary

The complete set of Merak design tokens consumed by `<Pagination>`. Names below are **Figma variable paths** in the `merak` collection (see `.claude/skills/figma-design-guide/design-token.md`). Bind every Figma paint / stroke / variable to one of these — never to a literal value.

### 10.1 Seed color tokens (`seed/*`)

Theme-color hovered / selected treatments use the 4%-alpha hover token of each family (named `hover-bg` for Primary / Info / Success, `outline-hover` for Danger / Warning), the 50%-alpha `outlineBorder`, and the solid `main`:

| Token                                          | Used by                                                  |
| ---------------------------------------------- | -------------------------------------------------------- |
| `seed/{color}/hover-bg` _(or `outline-hover`)_ | `Page/Hovered` bg (×1) + `Page/Selected` bg (×2 stacked) |
| `seed/{color}/outlineBorder`                   | `Page/Selected` border (50% tint)                        |
| `seed/{color}/main`                            | `Page/Selected` foreground (Label)                       |
| `seed/{color}/focusVisible` _(reserved)_       | Future `State=Focused` ring                              |

Where `{color} ∈ {primary, danger, warning, info, success}`.

### 10.2 Alias tokens (`alias/colors/*`)

| Token                                | Used by                                                        | Role                                       |
| ------------------------------------ | -------------------------------------------------------------- | ------------------------------------------ |
| `alias/colors/bg-default`            | Item background, `State ∈ {Enabled, Disabled}`                 | Transparent surface behind the item.       |
| `alias/colors/bg-outline-hover`      | Item background, `State=Hovered` (Default color)               | 4% black overlay for hover.                |
| `alias/colors/bg-selected`           | Item background, `State=Selected`, `Type=Page` (Default color) | 8% black overlay for selected page.        |
| `alias/colors/bg-disabled`           | Item border, `State=Disabled`                                  | 12% black for desaturated outlined stroke. |
| `alias/colors/border-defalt` _(sic)_ | Item border, `State ∈ {Enabled, Hovered, Selected}`            | Default outlined stroke.                   |
| `alias/colors/text-default`          | Item foreground + icon, `State ∈ {Enabled, Hovered, Selected}` | 87% black.                                 |
| `alias/colors/text-disabled`         | Item foreground + icon, `State=Disabled`                       | 38% black.                                 |

### 10.3 Shape & elevation

- Corner radius: `theme.shape.borderRadius = 4` (from `mui-theme.ts`), applied to all four corners of every item regardless of position. The Figma component hard-codes `cornerRadius = 4` until a dedicated pagination-radius token exists.
- Elevation: not used by `<Pagination>`. Pagination bars sit flush on the card / table footer surface. The Figma `shadows/shadows-{1..24}` effect styles are available if a future floating pagination dock is introduced.

### 10.4 Typography

`Pagination.tsx` does not override MUI typography, so the following resolved values are used (from `theme.typography` defaults — the `body2` variant that MUI `PaginationItem` consumes):

- Font family: `Roboto, Helvetica, Arial, sans-serif`
- Font weight: `Regular (400)`
- `text-transform`: **none** (page numbers render in the character set supplied by `Label`)
- `letter-spacing`: `0.01071em`
- Font size per `Size`: see §4.1

These constants live in MUI's defaults; if the project later introduces typography tokens (e.g. `--merak-typography-pagination-*`), update §4.1 and §10.4 to bind to them.

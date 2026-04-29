---
name: figma-component-pagination-spec
description: Figma component specification for `<Pagination>` and its child `<PaginationItem>` — design counterpart of MUI `<Pagination>` / `<PaginationItem>` consumed by `src/stories/Pagination.stories.tsx`. Documents the item-set Render Binding Matrix (Color × Type × Size × State, 288 variants), the wrapper-set static composition (Color × Size × State, 36 variants), source-to-Figma mapping with the hard-coded `variant="outlined"` + `shape="rounded"` rendering, and the divergences between MUI's stock paint values and the Merak token bindings. For component-scoped tokens see `design-token.md`; for runtime measurements see `storybook.render.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '1:5098'
figma_component_set_id: '1:5098'
figma_wrapper_component_set_id: '1:5675'
---

# `<Pagination>` Figma Component Specification

## 1. Overview

`<Pagination>` is the Figma counterpart of MUI's `<Pagination>` + `<PaginationItem>` consumed in `src/stories/Pagination.stories.tsx`. The package re-exports MUI directly — there is no source-side wrapper. Instead, the Storybook story applies a `MerakPagination` wrapper that hard-codes `variant="outlined"` + `shape="rounded"` (the only treatment Merak ships in Figma) and routes the 4 themed colors not natively supported by MUI Pagination (`danger / warning / info / success`) through PaginationItem `sx` so every Figma cell has a runtime equivalent.

The specification covers two related design entities:

- **`<PaginationItem>`** (`1:5098`) — atomic button / icon / ellipsis used inside the pagination bar; carries every variant axis.
- **`<Pagination>`** (`1:5675`) — composite frame that arranges 9 item instances in Auto Layout, pre-wired per Color so a full-width bar reads consistently.

| Aspect                  | Value                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Source story            | `src/stories/Pagination.stories.tsx`                                                 |
| Underlying source       | `@mui/material` `Pagination` + `PaginationItem` (re-exported by this package, wrapped as `MerakPagination` in the story to inject Merak themed colors via `sx`) |
| Figma file              | `KQjP6W9Uw1PN0iipwQHyYn` (MUI Library)                                               |
| Figma item set          | `<PaginationItem>` (`1:5098`) on page **MUI Library**                                |
| Figma wrapper set       | `<Pagination>` (`1:5675`) on page **MUI Library**                                    |
| Item variants           | **288** (6 Colors × 4 Types × 3 Sizes × 4 States) — see §3.1                         |
| Wrapper variants        | **36** (6 Colors × 3 Sizes × 2 States) — see §3.3                                    |
| Hard-coded MUI props    | `variant="outlined"`, `shape="rounded"` — applied in the `MerakPagination` story wrapper, not in a source-side wrapper. Not exposed as Figma axes. |
| Underlying MUI version  | `@mui/material@^7.3.10` (per `package.json` peer-dep `>=7`, current pnpm-lock resolution `7.3.10`) |
| Typography              | Roboto Regular, no `text-transform`, letter-spacing `0.01071em` (resolves to ~`0.14994 px` at 14 px) |

**MUI native vs Merak extension.** MUI Pagination only natively supports `color: 'standard' | 'primary' | 'secondary'`. The Merak Color axis (Default / Primary / Danger / Warning / Info / Success) is a design-system extension authored in Figma; the runtime story maps `default → standard`, `primary → primary` and applies `danger / warning / info / success` via PaginationItem `sx`. When this spec changes, `src/stories/Pagination.stories.tsx` `paginationItemSx` must change in the same PR (§8).

**Local-only token bindings.** Per the project directive, every paint / stroke / text-fill in the Pagination component sets binds to the **MUI Library Figma file's local `merak` collection** — never to the published library copy. The local collection holds 50 variables (45 shared aliases + seed colors + 5 Pagination-scoped `component/pagination/selected-bg-*`). Five of those are documented in [`./design-token.md`](./design-token.md). If the published library renames or removes a token, the local file does not break automatically; track the divergence in §8.

## 2. Source-to-Figma Property Mapping

### 2.1 Wrapper props (`<Pagination>`)

| MUI prop                                                  | Figma surface                                | Type              | Notes                                                                                                                                                                                          |
| --------------------------------------------------------- | -------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `count: number`                                           | wrapper composition (static)                 | —                 | The published wrapper bakes `count = 10`. Drives how many items render at runtime; the Figma wrapper is a static 9-item composition (see §6.2) and does not auto-collapse for small `count`.   |
| `page: number`                                            | wrapper composition (static)                 | —                 | The published wrapper bakes `page = 5`. Drives which child item carries `State=Selected` at runtime.                                                                                           |
| `onChange: (e, page) => void`                             | —                                            | —                 | Behavior-only, no design representation                                                                                                                                                        |
| `disabled: boolean`                                       | `State=Disabled` wrapper variant + `Disabled` BOOLEAN | BOOLEAN + VARIANT | Propagates `State=Disabled` to every child item                                                                                                                                                |
| `color: 'standard' \| 'primary' \| 'secondary'` _(extended in story to 6 Merak colors)_ | `Color` wrapper + item variant | VARIANT | `default` → MUI `standard`; `primary` → MUI `primary`; `danger / warning / info / success` → MUI `primary` + `sx` overrides (story side). See §2.3.                                            |
| `size: 'small' \| 'medium' \| 'large'`                    | `Size` wrapper + item variant                | VARIANT           | Direct map. Default `medium`.                                                                                                                                                                  |
| `variant: 'text' \| 'outlined'` _(hard-coded `outlined`)_ | rendered as the only Figma style             | —                 | Not a variant axis — Merak only ships `outlined`. Hard-coded in `MerakPagination` story wrapper.                                                                                                |
| `shape: 'circular' \| 'rounded'` _(hard-coded `rounded`)_ | rendered as the only Figma style             | —                 | Not a variant axis — Merak only ships `rounded`. Hard-coded in `MerakPagination` story wrapper.                                                                                                |
| `siblingCount` / `boundaryCount`                          | implicit via the composite layout            | —                 | Wrapper bakes MUI defaults (`siblingCount=1`, `boundaryCount=1`) — yields the 9-item layout in §6.2.                                                                                           |
| `showFirstButton` / `showLastButton`                      | not provided                                 | —                 | Merak never renders First / Last jump buttons; omitted from the `Type` axis. Adding them requires extending §3.1 per §8.                                                                       |
| `renderItem`                                              | —                                            | —                 | Behavior-only. The story uses `renderItem` to inject the per-color `sx`; Figma authoring is unaffected.                                                                                        |

### 2.2 Item properties (`<PaginationItem>`)

Each child rendered inside `<Pagination>` is an instance of `<PaginationItem>`. The source does not expose these directly — MUI constructs them via `usePagination` — but the Figma item set must enumerate every type they can take.

| Figma property | Type    | Options                                                      | Maps to MUI `PaginationItem` prop                                                                                                                  |
| -------------- | ------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Color`        | VARIANT | `Default`, `Primary`, `Danger`, `Warning`, `Info`, `Success` | `color` (MUI native: `standard / primary`; story extension: `danger / warning / info / success` via `sx`). Only `Page/Selected` and `Page/Hovered` differ visually per Color; every other combination renders identically. |
| `Type`         | VARIANT | `Page`, `Previous`, `Next`, `Ellipsis`                       | `type: 'page' \| 'previous' \| 'next' \| 'start-ellipsis' \| 'end-ellipsis'` (start / end ellipsis collapsed into one design)                      |
| `Size`         | VARIANT | `Small`, `Medium`, `Large`                                   | `size`                                                                                                                                             |
| `State`        | VARIANT | `Enabled`, `Hovered`, `Selected`, `Disabled`                 | Runtime state: `selected`, `disabled`, `:hover` / `.Mui-focusVisible`                                                                              |
| `Label`        | TEXT    | default `1`                                                  | Used only when `Type=Page`; the rendered page number                                                                                               |

> `Selected` is only meaningful when `Type=Page`. The `Previous`, `Next`, and `Ellipsis` types ignore it — if an engineer picks `Type=Previous, State=Selected` in Figma, render it identically to `Type=Previous, State=Enabled`.

### 2.3 Color value mapping

Designers pick the Merak name in Figma. Bind every Figma fill / stroke to the listed token family — never paste raw hex.

| Merak key (story prop) | MUI native `color` (story → MUI) | Figma token family for `Page/Selected` + `Page/Hovered` | Figma `Color` value |
| ---------------------- | -------------------------------- | ------------------------------------------------------- | ------------------- |
| `default`              | `standard`                       | `alias/colors/*` (neutral) — see §6.2                   | **Default**         |
| `primary`              | `primary`                        | `seed/primary/*`                                        | **Primary**         |
| `danger`               | `primary` + `sx` (palette: `error`) | `seed/danger/*`                                      | **Danger**          |
| `warning`              | `primary` + `sx` (palette: `warning`) | `seed/warning/*`                                   | **Warning**         |
| `info`                 | `primary` + `sx` (palette: `info`) | `seed/info/*`                                         | **Info**            |
| `success`              | `primary` + `sx` (palette: `success`) | `seed/success/*`                                   | **Success**         |

## 3. Variant Property Matrix

### 3.1 `<PaginationItem>` (`1:5098`)

```
Color × Type × Size × State = 6 × 4 × 3 × 4 = 288 variants
```

| Property | Default value | Options                                                      |
| -------- | ------------- | ------------------------------------------------------------ |
| `Color`  | `Default`     | `Default`, `Primary`, `Danger`, `Warning`, `Info`, `Success` |
| `Type`   | `Page`        | `Page`, `Previous`, `Next`, `Ellipsis`                       |
| `Size`   | `Medium`      | `Small`, `Medium`, `Large`                                   |
| `State`  | `Enabled`     | `Enabled`, `Hovered`, `Selected`, `Disabled`                 |

Many combinations are visually identical across `Color` (every state except `Page/Selected` and `Page/Hovered` renders the same regardless of color). They are kept as duplicates because Figma requires uniform axes across a component set — same pattern as `<Button>` (90 variants, several visually identical per state).

### 3.2 Component (non-variant) properties on the item

| Property key | Type | Default | Purpose                                                                                               |
| ------------ | ---- | ------- | ----------------------------------------------------------------------------------------------------- |
| `Label`      | TEXT | `1`     | Page number shown when `Type=Page`. Ignored (rendered as glyph) for `Previous` / `Next` / `Ellipsis`. |

### 3.3 `<Pagination>` wrapper (`1:5675`)

```
Color × Size × State = 6 × 3 × 2 = 36 variants
```

| Property | Default value | Options                                                      |
| -------- | ------------- | ------------------------------------------------------------ |
| `Color`  | `Default`     | `Default`, `Primary`, `Danger`, `Warning`, `Info`, `Success` |
| `Size`   | `Medium`      | `Small`, `Medium`, `Large`                                   |
| `State`  | `Enabled`     | `Enabled`, `Disabled`                                        |

Each wrapper variant pre-wires its 9 nested item instances to the matching `Color` so a full bar reads consistently when dropped onto a screen. The wrapper's `Color` variant drives every nested item `Color` value in lockstep.

### 3.4 Component (non-variant) properties on the wrapper

The wrapper currently exposes none. To document a scenario, a designer either:

1. Edits the nested item instances' `Label` text directly, or
2. Detaches the wrapper for a one-off composition (acceptable for screen demos; do not check detached wrappers back into the library).

A `Current Page` / `Total Pages` TEXT property pair is intentionally omitted — see §7.3.

## 4. Usage Guidelines

### 4.1 Picking a configuration

1. Choose the wrapper `Color` to match the source `color` prop via §2.3 (Merak name, not MUI palette name).
2. Choose the wrapper `Size` to match surface density: `Small` for dense tables, `Medium` for standard data grids, `Large` for hero layouts.
3. Drop the wrapper instance onto the screen. The 9-item composition assumes `Total Pages ≥ 7` and a middle-page Selected item. For other scenarios, see §4.4.
4. Use `State=Disabled` only to demonstrate a disabled snapshot (e.g. while data is loading). Production screens should use `Enabled`.

### 4.2 When NOT to use `<Pagination>`

- Infinite scroll or cursor-paginated lists → use a load-more pattern, not a page bar.
- Single-page surfaces (`Total Pages = 1`) → omit the pagination bar entirely; product convention is to hide it.
- Sub-page navigation (e.g. "page 1 of a wizard") → use `<Stepper>` or breadcrumbs, not pagination.

### 4.3 Action semantics

| Surface intent                                    | Color     |
| ------------------------------------------------- | --------- |
| Default neutral data tables / dialogs             | `Default` |
| Brand-themed lists (e.g. featured content)        | `Primary` |
| Destructive-context lists (e.g. error log paging) | `Danger`  |
| Cautionary-context lists                          | `Warning` |
| Informational-context lists                       | `Info`    |
| Success / approval-context lists                  | `Success` |

### 4.4 Don'ts

- ❌ Don't detach instances to recolor items — every supported color exists as a variant.
- ❌ Don't switch `variant` to `text` or `shape` to `circular` by overriding styles — those options aren't shipped. Extend the source story (`MerakPagination`) first per §8.
- ❌ Don't add first / last jump chevrons by hand-drawing glyphs. Extend the `Type` axis with `First` / `Last` per §8.
- ❌ Don't rely on the static wrapper for small `Total Pages`. Geometry assumes `Total Pages ≥ 7` and a middle-page Selected.
- ❌ Don't use `State=Selected` on `Previous` / `Next` / `Ellipsis` — the treatment isn't defined (see §2.2).

## 5. Token Glossary

Token names below are **Figma variable paths** in the `merak` collection — see [`.claude/skills/figma-design-guide/design-token.md`](../../figma-design-guide/design-token.md). Bind every Figma paint / stroke to one of these — never to a literal hex.

### 5.1 Seed color tokens (`seed/<C>/*`)

`<C>` stands for any of `primary | danger | warning | info | success`. `Default` is excluded — it routes through `alias/*` (§5.2). Theme-color hovered / selected treatments use the 4 %-α `hover-bg` token of each family (named `outline-hover` for Danger / Warning), the 50 %-α `outlineBorder`, and the solid `main`:

| Suffix                                     | Used by                                                  | Role                                                        |
| ------------------------------------------ | -------------------------------------------------------- | ----------------------------------------------------------- |
| `/hover-bg` _(or `outline-hover`)_         | `Page/Hovered` bg (×1) + `Page/Selected` bg (×2 stacked) | 4 %-α tint of `<C>/main`. Stacked twice for ~8 % composite. |
| `/outlineBorder`                           | `Page/Selected` border                                   | 50 %-α tint of `<C>/main`.                                  |
| `/main`                                    | `Page/Selected` foreground (Label)                       | Solid `<C>/main` (e.g. `#1976d2` for primary).              |
| `/focusVisible` _(reserved)_               | future `State=Focused` ring                              | Not currently a variant; tracked in §8.                     |

Per-family token names (4 %-α hover token used for both `Hovered` and `Selected` layering):

| Color   | 4 %-α token                  | 50 %-α token (outlineBorder) | 100 %-α token (main) |
| ------- | ---------------------------- | ---------------------------- | -------------------- |
| Primary | `seed/primary/hover-bg`      | `seed/primary/outlineBorder` | `seed/primary/main`  |
| Danger  | `seed/danger/outline-hover`  | `seed/danger/outlineBorder`  | `seed/danger/main`   |
| Warning | `seed/warning/outline-hover` | `seed/warning/outlineBorder` | `seed/warning/main`  |
| Info    | `seed/info/hover-bg`         | `seed/info/outlineBorder`    | `seed/info/main`     |
| Success | `seed/success/hover-bg`      | `seed/success/outlineBorder` | `seed/success/main`  |

### 5.2 Alias tokens (`alias/colors/*`)

| Token                                | Used by                                                                | Role                                       |
| ------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------ |
| `alias/colors/bg-default`            | Item background, `State ∈ {Enabled, Disabled}`                         | Transparent / surface paint behind the item. |
| `alias/colors/bg-outline-hover`      | Item background, `State=Hovered` (Default color, all Types)            | 4 %-α black overlay for hover.             |
| `alias/colors/bg-selected`           | Item background, `State=Selected, Type=Page` (Default color)           | 8 %-α black overlay for selected page.     |
| `alias/colors/bg-disabled`           | Item border, `State=Disabled` (all Colors)                             | 12 %-α black for desaturated stroke. The token's `bg-` prefix reflects its source role (`palette/action/disabledBackground`), but Merak (and `<Button>` / `<IconButton>`) repurpose the same surface paint as the disabled outline border because MUI uses `theme.palette.action.disabledBackground` for that exact role. Convention is intentional — see `<Button>` spec §5.2 / `<IconButton>` spec §5.2 note. |
| `alias/colors/border-defalt` _(sic)_ | Item border, `State ∈ {Enabled, Hovered, Selected}` (all Colors except `Page/Selected` themed border, which uses `seed/<C>/outlineBorder`) | Default outlined stroke (12 %-α black). Preserve typo as published — see `figma-design-guide`. |
| `alias/colors/text-default`          | Item foreground + glyph, `State ∈ {Enabled, Hovered, Selected}` (all Colors except `Page/Selected` themed Label, which uses `seed/<C>/main`) | 87 %-α black.                              |
| `alias/colors/text-disabled`         | Item foreground + glyph, `State=Disabled`                              | 38 %-α black.                              |

### 5.3 Component-scoped tokens

Defined in [`./design-token.md`](./design-token.md). Five 12 %-α themed Selected-bg tokens minted in the local `merak` collection so themed `Page/<C>/Selected` cells can match MUI's runtime `alpha(palette.<color>.main, 0.12)`:

| Token                                       | Used by                                                |
| ------------------------------------------- | ------------------------------------------------------ |
| `component/pagination/selected-bg-primary`  | `Color=Primary, Type=Page, State=Selected` fill        |
| `component/pagination/selected-bg-danger`   | `Color=Danger, Type=Page, State=Selected` fill         |
| `component/pagination/selected-bg-warning`  | `Color=Warning, Type=Page, State=Selected` fill        |
| `component/pagination/selected-bg-info`     | `Color=Info, Type=Page, State=Selected` fill           |
| `component/pagination/selected-bg-success`  | `Color=Success, Type=Page, State=Selected` fill        |

The shared `merak/seed/<C>/hover-bg` family stays at 4 %-α — see `design-token.md` for the rationale.

### 5.4 Shape & elevation

- **Corner radius**: `4 px` (`theme.shape.borderRadius`), all four corners of every item, all sizes. Hard-coded in Figma until a dedicated Pagination radius token exists.
- **Outline border width**: `1 px` (`strokeAlign: INSIDE`).
- **Item spacing (Auto Layout gap)**: currently `4 px` flat in the wrapper; runtime resolves to `2 / 6 / 6 px` per Size — see `storybook.render.md` §6.3 (drift check).
- **Elevation**: not used. Pagination bars sit flush on the table footer / dialog surface.

### 5.5 Typography

`Pagination.tsx` does not override MUI typography (and no project-level `MuiPagination` override exists). Resolved values:

- Font family: `Roboto, Helvetica, Arial, sans-serif`
- Font weight: `Regular (400)`
- `text-transform`: **none** (page numbers render in the character set supplied by `Label`)
- `letter-spacing`: `0.01071em` (~`0.14994 px` at 14 px / `0.16065 px` at 15 px)
- Font size per `Size`: see §6.1
- Line-height: `20.02 px` (Small / Medium) / `21.45 px` (Large) — runtime computed values

If the project later introduces typography tokens (`material-design/typography/pagination-*`), bind via `textStyleId` and update §6.1 + §5.5 to point at them.

## 6. Render Binding Matrix

The cell-by-cell paint / stroke / effect bindings for every variant. `<C>` denotes the seed family for themed colors `{primary | danger | warning | info | success}`.

- **Fill** — node fill (background paint). For `Page/Selected` themed colors, this is **two stacked fills** of the same `seed/<C>/hover-bg` (or `outline-hover`) variable so the ~8 % composite survives Figma's instance flattening. See "Why stacked fills" note below the matrix.
- **Stroke** — node stroke. `1 px` outlined; `strokeAlign: INSIDE`; no focus ring (Pagination has no `Focused` state today — see §8).
- **Foreground** — Label TEXT node fill (Page) or glyph TEXT fill (Previous / Next / Ellipsis).
- **Effect** — drop-shadow on the node. **None** for every Pagination cell.

### 6.1 Constants (all cells)

Numbers below are the **Figma-authored values** in the published item set (`1:5098`) — runtime-aligned. Every MUI-runtime value was reproduced verbatim in the 2026-04-28 runtime-truth pass; the divergences previously listed in §7 issues 1 / 2 / 4 / 6 / 7 / 8 are now resolved.

| Property                            | Small         | Medium        | Large         |
| ----------------------------------- | ------------- | ------------- | ------------- |
| Outer width × height (square cells) | `26 × 26 px`  | `32 × 32 px`  | `40 × 40 px`  |
| Min width                           | `26 px`       | `32 px`       | `40 px`       |
| Padding (T R B L)                   | `0 4 0 4`     | `0 6 0 6`     | `0 10 0 10`   |
| Corner radius                       | `4 px`        | `4 px`        | `4 px`        |
| Outline border width / alignment    | `1 px` / INSIDE | same        | same          |
| Icon glyph (`Type ∈ {Previous, Next}`) | `<Icon>` `Size=sm` instance, `Glyph Source` preset to `ChevronLeft` (`512:7505`) / `ChevronRight` (`512:7509`) — see §6.7 | same | same |
| Icon size (Previous / Next)         | `20 × 20 px`  | `20 × 20 px`  | `20 × 20 px`  |
| Label font size (`Type=Page`)       | `14 px`       | `14 px`       | `15 px`       |
| Glyph font size (`Type=Ellipsis`)   | `14 px`       | `14 px`       | `15 px`       |
| Letter-spacing (Page / Ellipsis)    | `0.1499 px`   | `0.1499 px`   | `0.1606 px`   |
| Label / glyph line-height           | `normal` (Figma) — runtime resolves to `20.02 / 21.45 px` per `theme.typography` | same | same |
| Wrapper auto-layout gap             | `2 px`        | `6 px`        | `6 px`        |

### 6.2 `State=Enabled`

| Type                        | Color   | Fill                          | Stroke                                       | Foreground                              | Effect |
| --------------------------- | ------- | ----------------------------- | -------------------------------------------- | --------------------------------------- | ------ |
| `Page`                      | Default | `alias/colors/bg-default`     | `alias/colors/border-defalt` _(sic)_         | `alias/colors/text-default`             | —      |
| `Page`                      | `<C>`   | `alias/colors/bg-default`     | `alias/colors/border-defalt` _(sic)_         | `alias/colors/text-default`             | —      |
| `Previous` / `Next`         | Default | `alias/colors/bg-default`     | `alias/colors/border-defalt` _(sic)_         | `alias/colors/text-default` (`‹` / `›` glyph) | —      |
| `Previous` / `Next`         | `<C>`   | _(same as Default)_           | _(same as Default)_                          | _(same as Default)_                     | —      |
| `Ellipsis`                  | Default | `alias/colors/bg-default`     | `alias/colors/border-defalt` _(sic)_         | `alias/colors/text-default` (`…` glyph) | —      |
| `Ellipsis`                  | `<C>`   | _(same as Default)_           | _(same as Default)_                          | _(same as Default)_                     | —      |

### 6.3 `State=Hovered`

Only `Type=Page, Color=<C>` carries a themed hover tint. Every other (Type × Color) combination uses the neutral `alias/colors/bg-outline-hover` overlay, matching the published Figma cells (verified against `1:5205`, `1:5229`, `1:5269`).

| Type                        | Color   | Fill                                                                | Stroke                               | Foreground                          | Effect |
| --------------------------- | ------- | ------------------------------------------------------------------- | ------------------------------------ | ----------------------------------- | ------ |
| `Page`                      | Default | `alias/colors/bg-outline-hover`                                     | `alias/colors/border-defalt` _(sic)_ | `alias/colors/text-default`         | —      |
| `Page`                      | `<C>`   | `seed/<C>/hover-bg` _(or `outline-hover`)_ — single fill, 4 % tint  | `alias/colors/border-defalt` _(sic)_ | `alias/colors/text-default`         | —      |
| `Previous` / `Next`         | Default & `<C>` | `alias/colors/bg-outline-hover` _(neutral, no themed variant)_ | `alias/colors/border-defalt` _(sic)_ | `alias/colors/text-default` (glyph) | —      |
| `Ellipsis`                  | Default & `<C>` | `alias/colors/bg-outline-hover` _(neutral, no themed variant)_ | `alias/colors/border-defalt` _(sic)_ | `alias/colors/text-default` (glyph) | —      |

> Hovered does **not** tint the border or foreground for any Color — only the background overlay changes, and even then only `Page/<C>` swaps to the themed 4 %-α token. This matches MUI runtime exactly for outlined PaginationItem (`storybook.render.md` §2) and is the deliberate Merak rule: "only `Page/Hovered` and `Page/Selected` differ across Color; every other (Type × State) combination renders identically across the Color axis."

### 6.4 `State=Selected`

`Selected` is meaningful only on `Type=Page`. `Previous` / `Next` / `Ellipsis` cells with `State=Selected` render identically to their `State=Enabled` counterparts (per §2.2).

| Type                        | Color   | Fill                                                          | Stroke                                       | Foreground                              | Effect |
| --------------------------- | ------- | ------------------------------------------------------------- | -------------------------------------------- | --------------------------------------- | ------ |
| `Page`                      | Default | `alias/colors/bg-selected` (8 %-α black, single fill)         | `alias/colors/border-defalt` _(sic)_         | `alias/colors/text-default`             | —      |
| `Page`                      | `<C>`   | `component/pagination/selected-bg-<c>` (12 %-α themed, single fill) | `seed/<C>/outlineBorder` (50 %-α tint) | `seed/<C>/main` (solid)                 | —      |
| `Previous` / `Next` / `Ellipsis` | any | _(same paint as State=Enabled — see §6.2)_                    | _(same)_                                     | _(same)_                                | —      |

> **Why pre-alpha'd `component/pagination/selected-bg-*` tokens.** MUI runtime renders outlined `<PaginationItem>` Selected bg as `alpha(palette.<color>.main, 0.12)` — a **12 %-α** themed tint — for every themed color (`primary` natively, plus `danger / warning / info / success` via the story's `paginationItemSx`). The shared `merak/seed/*` family only ships a 4 %-α `hover-bg` token per color, and stacking two layers tops out at `~7.84 %`. To hit MUI's 12 % without breaking the shared seed family's 4 % standard, Pagination owns five 12 %-α tokens locally — see [`./design-token.md`](./design-token.md). `Color=Default` keeps the shared 8 %-α `alias/colors/bg-selected` because MUI's `colorStandard` Selected bg is also 8 %-α (matches).

> **Why not paint opacity?** Figma stores a fill's `paint.opacity` correctly on the variant, but when a top-level instance of the wrapper set is created on a screen, any `paint.opacity < 1` combined with a bound variable is flattened back to `opacity = 1` in the instance. Binding to a variable whose **resolved value already carries alpha** (12 % in the `component/pagination/selected-bg-*` tokens) avoids that flattening — the instance reads the variable's alpha directly at render time.

### 6.5 `State=Disabled`

Themed colors collapse to greyscale alias tokens — `Color=Primary, State=Disabled` is visually identical to `Color=Danger, State=Disabled`. The variant exists only so an `Enabled ↔ Disabled` toggle keeps the `Color` slot stable.

| Type                        | Fill                          | Stroke                          | Foreground                            | Effect |
| --------------------------- | ----------------------------- | ------------------------------- | ------------------------------------- | ------ |
| `Page`                      | `alias/colors/bg-default`     | `alias/colors/bg-disabled` (12 %-α) | `alias/colors/text-disabled` (38 %-α) | —      |
| `Previous` / `Next`         | `alias/colors/bg-default`     | `alias/colors/bg-disabled` (12 %-α) | `alias/colors/text-disabled` (glyph) | —      |
| `Ellipsis`                  | `alias/colors/bg-default`     | `alias/colors/bg-disabled` (12 %-α) | `alias/colors/text-disabled` (glyph) | —      |

> Disabled at runtime keeps `color: rgba(0,0,0,0.87)` (MUI doesn't dim text on outlined-disabled, only border), but Figma deliberately routes Disabled foreground through `text-disabled` for readability. Documented divergence — `storybook.render.md` §2 / §6.4.

### 6.6 Wrapper composition (`<Pagination>` static layout)

`<Pagination>` (`1:5675`) is an **Auto Layout** horizontal frame containing a static sequence of 9 `<PaginationItem>` instances in this order, matching MUI's default output for `count ≥ 7` with `siblingCount=1, boundaryCount=1`:

```
[ Previous ] [ 1 ] [ Ellipsis ] [ currentPage-1 ] [ currentPage ]* [ currentPage+1 ] [ Ellipsis ] [ Total Pages ] [ Next ]
```

The published wrapper bakes `currentPage = 5, totalPages = 10`, so labels are `1 · 4 · 5* · 6 · 10`.

- Auto Layout gap: per `Size` — `Small=2`, `Medium=6`, `Large=6` (matches the runtime visible inter-item gap from item `margin: 0 (1|3|3) px`).
- Padding: `0`. The surrounding surface (table footer, drawer) owns page-level padding.
- The middle `currentPage` item carries `State=Selected`; every other nested item is `State=Enabled` (or `Disabled` when the wrapper variant is `State=Disabled`).
- Wrapper variant axes flow into nested item axes in lockstep — `Color=Primary, Size=Medium, State=Enabled` on the wrapper sets every nested item to `Color=Primary, Size=Medium, State=Enabled` (with the middle one promoted to `State=Selected`).
- Because the wrapper is a **static composition**, it cannot dynamically collapse ellipses for small `Total Pages`. Consumers needing `Total Pages ≤ 6` should detach for a one-off composition (see §4.4).

### 6.7 Glyph treatment (Previous / Next / Ellipsis)

`Previous` / `Next` cells render an **INSTANCE** of the shared `<Icon>` set at `Size=sm`, with the inner `Glyph Source` `INSTANCE_SWAP` property preset per direction; `Ellipsis` cells render the literal `…` character as a TEXT node.

| Item `Type` | Glyph source                                                                                              | Size                                                          | Color override                                                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `Previous`  | `<Icon>` (`3:2722`) `Size=sm` (`3:2731`); `Glyph Source` (`INSTANCE_SWAP`) → `ChevronLeft` (`512:7505`)   | Fixed `20 × 20 px` for every Pagination `Size`                | Glyph Vector fills bound to `alias/colors/text-default` (default); `State=Disabled` cells override to `alias/colors/text-disabled`. |
| `Next`      | `<Icon>` (`3:2722`) `Size=sm` (`3:2731`); `Glyph Source` (`INSTANCE_SWAP`) → `ChevronRight` (`512:7509`)  | Same as Previous.                                              | Same as Previous.                                                                                                                    |
| `Ellipsis`  | TEXT node, character `…` (U+2026)                                                                         | Roboto Regular `14 / 14 / 15 px` per Size (matches `Type=Page` font ramp) | TEXT fill bound to `alias/colors/text-default` (or `text-disabled` for `State=Disabled`).                                            |

**Why one shared `<Icon>` set, not dedicated chevron sets.** Pagination chevrons used to live in two dedicated component sets — `<NavigateBefore>` (`224:4189`) and `<NavigateNext>` (`224:4199`) — each with three `Size=Small/Medium/Large` variants at 18/20/22 px. The 2026-04-29 unification pass replaced them with one `<Icon>` `Size=sm` instance per cell, plus `Glyph Source` preset to `ChevronLeft` / `ChevronRight` (both published as standalone components in the shared Icon library — see `figma-design-guide/components.md` §Icon library). One shared set + one swap property is structurally simpler than two dedicated sets, and it lets future direction-aware revisions (RTL chevron, custom glyph) reuse the same Icon library entries instead of minting new component sets.

**Why fixed `20 × 20 px` for every Pagination `Size`.** Storybook hard-codes `width: 20, height: 20` on the icon slot wrapper (`MerakIconSm` in `src/stories/Pagination.stories.tsx`) regardless of the underlying MUI `Pagination` `size` prop. Figma now matches: every `Type ∈ {Previous, Next}` cell, across all three Pagination `Size` values, contains an `<Icon> Size=sm` instance at 20 × 20. The earlier 18/20/22 ramp came from the dedicated `<NavigateBefore>` Size variants and was a Figma-only divergence — MUI runtime never scaled the chevron either.

**Icon swap on consumer instances.** Because the chevron lives inside an `<Icon>` instance with an exposed `Glyph Source` `INSTANCE_SWAP` property, designers can swap the glyph (e.g. for a localized RTL chevron) directly from the `<PaginationItem>` instance via Figma's nested-property panel — no detach required. Note the **shared-default caveat**: `Glyph Source` defaults are shared across every cell in the Pagination set; the per-direction defaults (ChevronLeft for Previous, ChevronRight for Next) live on the variants themselves, not at the set level.

## 7. Open issues

The runtime-truth pass on **2026-04-28** resolved most of the issues that previously lived here. The remaining open items are listed first; the resolved historical entries are kept below for traceability.

### Currently open

1. **`State=Focused`.** Not represented in either set — MUI emits a focus cue inside the ripple subtree, not on the box, and `outlinedPrimary` already paints the same overlay as `:hover` for `.Mui-focusVisible`. Adding `State=Focused` would cost 72 item variants (3 sizes × 4 types × 6 colors). Tracked per §8.
2. **`First` / `Last` jump buttons.** Not in the `Type` axis — Merak never renders them. Adding requires §8 trigger (12 new item variants per added type per Size, and re-baking the wrapper composition).
3. **Disabled foreground / outlined-border ↔ runtime divergence.** Figma uses `alias/colors/text-disabled` (38 %-α) for Disabled foreground and `alias/colors/bg-disabled` (12 %-α) for Disabled stroke; MUI runtime keeps `text.primary` (87 %-α) and `0.23 black` respectively (no dim on outlined-disabled). Figma values were intentionally **not** re-aligned in the 2026-04-28 pass — the dimmer Figma rendering offers better disabled-state legibility, and the difference is small. Documented in §6.5 / `storybook.render.md` §2.

### Resolved (2026-04-28 runtime-truth pass)

1. ~~**Inter-item gap.**~~ **Resolved 2026-04-28.** Wrapper auto-layout `itemSpacing` is now per-Size (`Small=2`, `Medium=6`, `Large=6`) — matches MUI runtime visible gap derived from item `margin: 0 (1|3|3) px`. See §6.6.
2. ~~**`Page/Selected` bg % (themed).**~~ **Resolved 2026-04-28.** Themed `Page/<C>/Selected` now binds to a single solid `component/pagination/selected-bg-<c>` at 12 %-α (matching MUI's `alpha(palette.<color>.main, 0.12)`). The 5 new tokens are minted in the local `merak` collection; see [`./design-token.md`](./design-token.md). Default-color stays on `alias/colors/bg-selected` (8 %-α black) — already matched MUI's `colorStandard`.
4. ~~**Glyph identity for Previous / Next.**~~ **Resolved 2026-04-28.** Replaced unicode `‹` / `›` text nodes with INSTANCE of dedicated chevron component sets (`<NavigateBefore>` / `<NavigateNext>`) at `Size=Small/Medium/Large = 18/20/22`. See §6.7.
6. ~~**Padding Large divergence.**~~ **Resolved 2026-04-28.** All `Size=Large` cells re-authored to `paddingLeft = paddingRight = 10` (matches MUI's `MuiPaginationItem-sizeLarge`).
7. ~~**Page font-size Small divergence.**~~ **Resolved 2026-04-28.** All `Color=*, Type=Page, Size=Small` cells re-authored to font-size `14 px`, letter-spacing `0.1499 px` (matches MUI's `pxToRem(14)`).
8. ~~**Ellipsis font-size divergence.**~~ **Resolved 2026-04-28.** All `Type=Ellipsis` cells re-authored to runtime font-size (`Small=14`, `Medium=14`, `Large=15`) — the `…` text now matches the cell's Page font ramp instead of the previous `14/16/18`.

### Resolved (2026-04-29 icon-source unification pass)

9. **Icon source for Previous / Next.** Replaced the dedicated `<NavigateBefore>` (`224:4189`) / `<NavigateNext>` (`224:4199`) component sets — three `Size` variants at 18 / 20 / 22 px each — with a single `<Icon>` (`3:2722`) `Size=sm` (`3:2731`) instance per cell, plus the `Glyph Source` `INSTANCE_SWAP` property preset to `ChevronLeft` (`512:7505`) for Previous or `ChevronRight` (`512:7509`) for Next. All 144 `Type ∈ {Previous, Next}` variants in `1:5098` were swapped in place; the legacy `<NavigateBefore>` / `<NavigateNext>` sets are no longer referenced by Pagination. Icon dims are now uniform `20 × 20 px` for every Pagination `Size`, matching the runtime story's `MerakIconSm` slot wrapper. See §6.7.

## 8. Source Sync Rule

This document and the source must move together. When **any** of the following changes, update this spec **and** the named files in the same PR:

| Trigger                                                                                          | Files to update                                                                                                            |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `node_modules/@mui/material/Pagination/Pagination.js` or `…/PaginationItem/PaginationItem.js` changes (MUI bump) | `figma.spec.md` §1 MUI version row, `storybook.render.md` §1–§4 + §6                                                     |
| `src/stories/Pagination.stories.tsx` `paginationItemSx` changes (e.g. `0.08 → 0.12` on Selected bg) | `figma.spec.md` §6.4, `storybook.render.md` §3                                                                          |
| `src/stories/Pagination.stories.tsx` `MerakPagination` adds / removes a hard-coded MUI prop (e.g. unlocks `variant`) | `figma.spec.md` §1 hard-coded MUI props row, §2.1, §3 (+ axis if exposed), §6 (+ rows for new combinations)            |
| `src/stories/Pagination.stories.tsx` story matrices change (e.g. add `FirstButton` / `LastButton` cases) | `figma.spec.md` §3.1 `Type` options + 12 new item variants per added type per Size, §6.1–§6.5 + §6.6 wrapper composition, `storybook.render.md` §1 |
| Figma item set `1:5098` variant axes / cell count change                                        | `figma.spec.md` §3.1, re-run `figma-component-upload` to refresh the snapshot                                              |
| Figma wrapper set `1:5675` variant axes / cell count or composition change                      | `figma.spec.md` §3.3, §6.6, re-run `figma-component-upload`                                                                |
| Local `merak/*` tokens used by Pagination are renamed in this Figma file                        | `figma.spec.md` §5 + §6, `./design-token.md`. **Do not** auto-pull from the published library — the Pagination cells bind to the local collection only. |
| Published library `seed/*` / `alias/*` tokens drift from the local copies                       | `./design-token.md` (record divergence), `figma.spec.md` §1 local-only note. Re-sync values manually if needed.            |
| `<Icon>` set (`3:2722`) variant axes change (e.g. `Size=sm` renamed) or its `Glyph Source` `INSTANCE_SWAP` property is renamed | `figma.spec.md` §6.1 / §6.7 icon mapping table (Size=sm `3:2731` ID + property name `Glyph Source`)                       |
| `ChevronLeft` (`512:7505`) / `ChevronRight` (`512:7509`) glyph components are renamed, moved, or replaced in the Icon library | `figma.spec.md` §6.7 (Glyph Source preset IDs), `../../figma-design-guide/components.md` §Icon library                    |
| Local `component/pagination/selected-bg-*` tokens are promoted to `seed/<C>/selected-bg @ α=0.12` | `figma.spec.md` §5.3 / §6.4 (rebind), `./design-token.md` (delete promoted tokens, point at new shared family)            |
| `mui-theme.ts` adds a `MuiPagination` / `MuiPaginationItem` override (this project has none today) | `figma.spec.md` §1, `storybook.render.md` §1–§4                                                                          |

## 9. Quick Reference

```ts
// Story prop surface (src/stories/Pagination.stories.tsx :: MerakPagination)
interface MerakPaginationProps extends Omit<PaginationProps, 'color'> {
  color?: 'default' | 'primary' | 'danger' | 'warning' | 'info' | 'success';
  // PaginationProps from @mui/material:
  //   count?: number;       // → wrapper composition (static, baked count=10)
  //   page?: number;        // → wrapper composition (static, baked page=5)
  //   onChange?, renderItem?: behavior-only
  //   disabled?: boolean;   // → Figma wrapper `State=Disabled`
  //   size?: 'small' | 'medium' | 'large';   // → Figma wrapper `Size`
  //   siblingCount?, boundaryCount?: implicit (MUI defaults)
}

// Hard-coded inside MerakPagination:
//   variant="outlined"  → fixed in Figma, no Variant axis
//   shape="rounded"     → fixed in Figma, no Shape axis
```

```
Figma Item Component Set: <PaginationItem> (1:5098)
  Variant axes : Color × Type × Size × State
  Properties   : Label (TEXT)
  Default      : Color=Default, Type=Page, Size=Medium, State=Enabled
  Total        : 288 variants (6 × 4 × 3 × 4)

Figma Wrapper Component Set: <Pagination> (1:5675)
  Variant axes : Color × Size × State
  Properties   : (none at wrapper level — edit nested item Labels directly)
  Default      : Color=Default, Size=Medium, State=Enabled
  Total        : 36 variants (6 × 3 × 2)
  Composition  : 9 <PaginationItem> instances in Auto Layout (see §6.6),
                 each pre-wired to the wrapper's Color so a full bar stays in sync
```

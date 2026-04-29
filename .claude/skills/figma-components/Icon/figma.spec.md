---
name: figma-component-icon-spec
description: Figma component specification for `<Icon>` — design counterpart of the `MerakIcon` sizing wrapper consumed by `src/stories/Icon.stories.tsx`. Documents the single-axis Size matrix (xs/sm/md/lg/xl/xxl), the `Glyph Source` INSTANCE_SWAP slot whose default is the file-local `ArrowSolid` component (`3:2740`), the source-to-Figma mapping, and the inheritance contract that lets the host component (`<IconButton>`, `<Button>`, `<Chip>`, …) drive the glyph's paint via `currentColor`. Companion runtime measurements live in `storybook.render.md`. The shared `<Icon>` set is the wrapper consumers reach for; the 62 named glyph components in the same file (`3:2740` ArrowSolid through `3:2908` Add — see `figma-design-guide/components.md` §Icon library) are the swap targets.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '3:2722'
figma_component_set_id: '3:2722'
---

# `<Icon>` Figma Component Specification

## 1. Overview

`<Icon>` is the Figma counterpart of the `MerakIcon` sizing wrapper defined in `src/stories/Icon.stories.tsx`. The wrapper is a six-step square box whose only varying axis is `Size`; the actual glyph is supplied via the `Glyph Source` INSTANCE_SWAP slot and inherits its paint from the host through `currentColor`. This is **the** wrapper consumers compose into `<IconButton>`, `<Button>`, `<Chip>`, navigation rows, and form adornments — every other Figma component that exposes an icon slot defaults its slot to one of the six `<Icon>/Size=*` variants (e.g. `<Chip>` defaults `Icon Source` to `3:2731 = Size=sm`).

The wrapper deliberately does **not** ship a `Color` axis. The runtime `<Box>` has `color: 'inherit'` and the inline SVG uses `fill="currentColor"`, so the host paint cascade drives the glyph color end-to-end (see `storybook.render.md` §3 for the verified inheritance chain). Authoring an explicit fill on an `<Icon>` cell breaks this contract and forces every consumer to detach.

The icon library backing the swap targets is sourced from Google **`material-design-icons`** (the `material-symbols` outlined / filled set, 24 px authoring grid). The 62 published glyph components — 40 sequentially-numbered (`3:2740` ArrowSolid … `3:2908` Add); 10 appended on 2026-04-29 in row 5 (`475:7459` Home, `477:7463` Settings, `479:7463` Filter, `479:7466` Notifications, `479:7469` Calendar, `479:7472` Refresh, `481:7463` Star, `481:7466` Help, `481:7469` Folder, `481:7472` Share); 10 more on the same day in row 6 (`512:7497` ChevronUp, `512:7501` ChevronDown, `512:7505` ChevronLeft, `512:7509` ChevronRight, `512:7513` ArrowUp, `513:7497` ArrowDown, `513:7501` Save, `513:7505` Print, `513:7509` Bookmark, `513:7513` Phone); plus 2 more on the same day opening row 7 (`590:7638` CloseCircleSolid `material-symbols:cancel-outline`, `665:11127` CloseCircleFilled `material-symbols:cancel`) — each wrap a single `material-symbols:*` raster; the runtime story mirrors them inline as 24×24 `<svg>`s authored against the same MD grid. Swapping the icon source library (e.g. to `@mui/icons-material` or `@iconify/react`) is a structural change tracked in §8.

| Aspect              | Value                                                                                |
| ------------------- | ------------------------------------------------------------------------------------ |
| Source story        | `src/stories/Icon.stories.tsx`                                                       |
| Underlying source   | `MerakIcon` — local sizing wrapper around `<Box>` from `@mui/material`. Not a re-export of `@mui/material/Icon` (whose `fontSize` only exposes 3 sizes and depends on the Material Icons font; see §7 #1). |
| Underlying MUI      | `@mui/material` 7.3.10 (resolved from `package.json` on 2026-04-29)                  |
| Icon source library | Google **`material-design-icons`** (`material-symbols` outlined / filled, 24 px grid). `@mui/icons-material` is intentionally not a dependency of this package — host apps swap to real icons at consumption. |
| Figma frame         | `<Icon>` (`3:2722`) on page **Foundation Components**                                |
| Component Set       | `<Icon>` (`3:2722`) — six `Size=*` variants, no other axis                           |
| Total variants      | **6** (Size only — xs / sm / md / lg / xl / xxl)                                     |
| Re-probe stories    | `SizeMatrix` (Storybook id `components-icon--size-matrix`) — the canonical 6 × 8 grid for `storybook.render.md` §1 numbers. `ColorInheritance` (`components-icon--color-inheritance`) — the verification harness for `currentColor` propagation in §3 of `storybook.render.md`. |
| Glyph slot default  | `<ArrowSolid>` (`3:2740`) — file-local component inside the same page's Icon library |
| Companion sets      | 62 named glyph components on the same page (`3:2740` ArrowSolid … `3:2908` Add — see `figma-design-guide/components.md` §Icon library) plus the visual catalogue Row at `3:2738`. These are the swap targets, not part of this set. |
| Local-only bindings | **Required.** The wrapper has no paints of its own; the only "binding" is the `Glyph Source` instance default (a file-local component id), so the local-only contract is satisfied trivially. No `VariableID:<sharedKey>/...` consumed-library references are permitted in any cell. |

## 2. Source-to-Figma Property Mapping

| Source prop / token        | Figma property | Type           | Notes                                                                                          |
| -------------------------- | -------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| `size`                     | `Size`         | VARIANT        | Six options matching `SIZE_PX` in the story: `xs` / `sm` / `md` / `lg` / `xl` / `xxl`. Figma defaults to `xs` (the smallest cell, top of the published variant grid); the story's `args.size = 'md'` is the runtime default. The two diverge intentionally — Figma's default surfaces the smallest "swatch" when an instance is dropped without a size override; runtime mirrors MUI's 24-px convention. |
| _(implicit slot)_ children | `Glyph Source` | INSTANCE_SWAP  | The actual icon. Default = `<ArrowSolid>` (`3:2740`). **Shared-default caveat**: the default is shared across every Size variant — picking a different default would propagate to every cell. The benign placeholder lets a freshly-dropped `<Icon>` render visibly while the designer swaps to the intended glyph. |
| `color`                    | —              | —              | The wrapper has `color: 'inherit'` at runtime; the SVG `fill = currentColor`. **No Figma paint binding.** Consumers drive the icon color via the host component's foreground token. Adding a `Color` axis here would force an explosion to `6 × 7 = 42` variants and break the inheritance contract. |
| `sx`                       | —              | —              | Prop-side override (e.g. `sx={{ color: 'primary.main' }}`). Behavior-only on the Figma side — the same effect is reached by placing the `<Icon>` instance inside a host whose foreground token resolves to `seed/primary/main`. |
| `aria-label`               | —              | —              | Accessibility-only; surfaced when the consumer marks the icon as meaningful. No Figma representation; flag in handoff annotations when the icon stands alone (icon-only buttons, status indicators). |
| `children` (inline SVG)    | —              | —              | The wrapper's only required content. In Figma this is the `Glyph Source` slot (above) — never inline raw VECTORs into the `<Icon>` cell. |

### 2.1 Color value mapping

n/a — `<Icon>` does not own its paint. The glyph picks up its color from the nearest ancestor with a non-`inherit` `color` rule, typically a host component's foreground token (`seed/<C>/main`, `seed/<C>/on`, `alias/colors/text-default`, `alias/colors/fg-disabled`, …). See the host components' specs for the exact bindings (`<IconButton>` `figma.spec.md` §6, `<Button>` `figma.spec.md` §6, `<Chip>` `figma.spec.md` §6).

## 3. Variant Property Matrix

```
Size (only axis)   =   1 × 6   =   6 variants
```

| Property | Default value | Options                                          |
| -------- | ------------- | ------------------------------------------------ |
| `Size`   | `xs`¹         | `xs`, `sm`, `md`, `lg`, `xl`, `xxl`              |

¹ Figma default = `xs` (top of the variant grid). Runtime story default (`args.size`) = `md` (24 px, MUI canonical icon size). The Figma `defaultVariant` is determined by the variant grid's stacking order at publish time and is not directly settable via the Plugin API (`editComponentProperty('Size', { defaultValue: ... })` throws "Cannot change defaultValue of a variant property"). Changing the Figma default requires re-laying-out the variant grid so a different cell sits at the top — track in §8 if needed.

`Size` is the **only** axis. Adding a `Color` or `State` axis would inflate the matrix and break the `currentColor` inheritance contract documented in §1 (see also §7.4 Don'ts).

### 3.1 Component (non-variant) properties

| Property key   | Type           | Default                  | Purpose                                                                                                                                                                                                                                            |
| -------------- | -------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Glyph Source` | INSTANCE_SWAP  | `<ArrowSolid>` (`3:2740`) | The 24×24 glyph that fills the wrapper. Picks which named icon component renders. Default is `ArrowSolid` (the alphabetically- and source-order-first entry in the Icon library). **Shared-default caveat applies** — every Size variant resolves to the same default, so consumers should swap per-instance, not edit the wrapper. |

The slot's leaf VECTOR fill is left **unbound** so the host component's foreground binding propagates via `currentColor`. Authoring an explicit token on the slot defeats the inheritance contract.

## 4. Design Tokens

### 4.1 Sizing

The runtime contract is `width = height = SIZE_PX[size]`; padding, border, and margin are zero on every Size. Numbers verified against `storybook.render.md` §1 on 2026-04-29.

| Size  | Outer (W × H) | Glyph slot (W × H) | Padding | Corner radius | Notes                                              |
| ----- | ------------- | ------------------ | ------- | ------------- | -------------------------------------------------- |
| `xs`  | `16 × 16 px`  | `16 × 16 px`       | `0`     | `0`           | Smallest cell — used inside dense list rows / tags |
| `sm`  | `20 × 20 px`  | `20 × 20 px`       | `0`     | `0`           | Default for `<Chip>` `Icon Source` slot            |
| `md`  | `24 × 24 px`  | `24 × 24 px`       | `0`     | `0`           | MUI / IconButton default; story `args.size`        |
| `lg`  | `28 × 28 px`  | `28 × 28 px`       | `0`     | `0`           |                                                    |
| `xl`  | `32 × 32 px`  | `32 × 32 px`       | `0`     | `0`           |                                                    |
| `xxl` | `48 × 48 px`  | `48 × 48 px`       | `0`     | `0`           | Largest cell — toolbar headers / empty-state hero  |

The size step is **not** geometric. xs→xl moves in 4 px increments; `xxl` jumps by 16 px to match the largest pre-existing Figma cell (`3:2723 = 48 × 48`). Auto Layout properties on every cell: `layoutMode = VERTICAL`, `counterAxisAlignItems = CENTER`, `primaryAxisAlignItems = CENTER`, `clipsContent = true`.

### 4.2 Color token bindings

n/a — `<Icon>` has no paint of its own (see §1 inheritance contract). The glyph child's `Vector` fill is intentionally unbound so `currentColor` can propagate. If a future variant needs a tinted background (e.g. an "alert" filled circle behind the glyph), introduce it as a sibling component (`<IconBadge>` or `<StatusIcon>`), **not** as a `Color` axis on this set.

### 4.3 State rules

n/a — `<Icon>` has no interactive state. Disabled / hover / focus / pressed paints are owned by the host (`<IconButton>` overrides `color: rgba(0, 0, 0, 0.26)` on `.Mui-disabled`, etc.) and propagate via `currentColor`. The wrapper has no transition (`storybook.render.md` §4); state-bound color changes ride entirely on the host's transition.

## 5. Icons

`<Icon>` **is** the icon slot, so this section documents the slot itself rather than icons inside it.

| Slot           | Visibility prop | Swap prop      | Default visibility | Frame dims                                  | Node name                       |
| -------------- | --------------- | -------------- | ------------------ | ------------------------------------------- | ------------------------------- |
| Glyph          | _(always on)_   | `Glyph Source` | always visible     | matches `Size` (16/20/24/28/32/48 square)   | `Glyph Source` (instance child) |

Conventions:

- **Glyph source**: file-local instance of one of the 62 named icon components in the Icon library (`3:2740` ArrowSolid … `665:11127` CloseCircleFilled). Each named component wraps a single `material-symbols:*` 24×24 raster. **Do not inline VECTORs** into the `<Icon>` cell — always use the named component instance so the swap dropdown stays populated.
- **Authoring grid**: the underlying `material-symbols` glyph is authored at `24 × 24 px`. Cells smaller than `md` downsample; `xxl` upsamples 2× (verified against the runtime SVG `viewBox="0 0 24 24"` rendering at the wrapper size).
- **Fill**: leave the slot's leaf VECTOR fill unbound — `currentColor` inheritance from the host paints it. Binding `seed/<C>/main` here defeats the inheritance contract (§7.4).
- **Rotation / mirroring**: any per-cell rotation lives on the slot instance, not the wrapper. ArrowSolid (`3:2740`), for instance, applies `rotation: -180°` on its child to convert the upstream `material-symbols:arrow-back-ios-new-rounded` glyph into a forward-facing chevron — that transform is owned by the named component, not by `<Icon>`.

## 6. Layout

### 6.1 Component set grid

The `<Icon>` set lives at the top-left of the **Foundation Components** page (`0:1`) at canvas position `(0, 0)`, encompassing the 6 Size variants stacked vertically inside a `140 × 298 px` frame:

| Cell  | Position (x, y) | Size       |
| ----- | --------------- | ---------- |
| `xs`  | `(62, 24)`      | `16 × 16`  |
| `sm`  | `(60, 56)`      | `20 × 20`  |
| `md`  | `(57.97, 92)`   | `24 × 24`  |
| `lg`  | `(56, 132)`     | `28 × 28`  |
| `xl`  | `(53.30, 176)`  | `32 × 32`  |
| `xxl` | `(46, 224)`     | `48 × 48`  |

Cells are horizontally centered inside the parent frame (each cell's `x` recenters as the cell width grows). The vertical gap between consecutive cells widens with size; this is documented as authored intent — Figma's variant grid is laid out manually rather than via Auto Layout because variant-set frames cannot themselves use Auto Layout.

### 6.2 Surrounding documentation frame

The 61 named glyph components live in the **same page** but a separate documentation frame: the visual catalogue **Row** at `3:2738`. The Row is **read-only** for `<Icon>` authoring — modifying the Row does not affect the `<Icon>` set's variants. When adding a new glyph to the library, publish a new top-level `COMPONENT` and append it to the Row (and to `figma-design-guide/components.md` §Icon library).

## 7. Usage Guidelines

### 7.1 Picking a variant

1. **Pick the Size** matching the host's icon slot:
   - Inside `<Chip>` → `sm` (20 px)
   - Inside `<IconButton>` / `<Button>` / list rows → `md` (24 px)
   - Inside dense badges / tag sub-rows → `xs` (16 px)
   - Toolbar / hero / empty-state → `xl` or `xxl`
2. **Drop the instance** into the host's icon slot. The host's variant binds the foreground token; the `<Icon>` glyph paint follows.
3. **Swap the glyph** via the property panel `Glyph Source` dropdown or right-click → Swap Instance. Pick from the 61 named glyph components in the Icon library; do not detach to recolor.
4. **Do not override the wrapper's `color`** — leave it cascading from the host. If you need a one-off color that the host doesn't drive, fix the host's foreground token instead.

### 7.2 Composition with other components

`<Icon>` is consumed via `INSTANCE_SWAP` slot properties on host components. The defaults:

| Host          | Slot property      | Default `<Icon>/Size` | Notes                                                                          |
| ------------- | ------------------ | --------------------- | ------------------------------------------------------------------------------ |
| `<Chip>`      | `Icon Source`      | `Size=sm` (`3:2731`)  | Leading 20 × 20 slot, hidden by default                                        |
| `<IconButton>`| (instance child)   | `Size=md` (`3:2729`)  | Sole child, always visible                                                     |
| `<Button>`    | `Start Icon Source` / `End Icon Source` (when present) | `Size=md` (`3:2729`)                  | Optional adornments; mirror MUI's `startIcon` / `endIcon` slots                |

(See each host's `figma.spec.md` for the exact slot key names and per-cell foreground bindings.)

### 7.3 When NOT to use

- The container needs a **specific, immutable** glyph (e.g. a logo). Drop the named glyph component directly — `<Icon>` is overhead when nothing will swap.
- The icon needs **multiple paints** (two-tone, gradient). The `currentColor` cascade can only drive a single fill; author a dedicated multi-fill component instead.
- The icon needs a **background** (badge fill, status pill). Compose `<Icon>` with a separate background frame, or build a sibling `<StatusIcon>` set.

### 7.4 Don'ts

- ❌ Add a `Color` axis to this set — the inheritance cascade already drives every paint, and adding the axis breaks consumers that rely on `currentColor`.
- ❌ Add a `State` axis — `<Icon>` has no interactive state; the host owns it.
- ❌ Bind a paint variable to the `Glyph Source` slot's leaf VECTOR — `currentColor` will be replaced and consumers can't recolor.
- ❌ Inline a raw VECTOR into the cell instead of an instance of a named glyph component — the swap dropdown will go empty and consumers will detach.
- ❌ Re-author the cell padding to "balance" the glyph — the wrapper is `padding: 0`; balance happens via `align: center` + `line-height: 0`.
- ❌ Detach an `<Icon>` instance to recolor — fix the host's foreground binding instead.
- ❌ Use `@mui/material/Icon` as the runtime source — its `fontSize` axis only ships 3 sizes (`small | medium | large`) and depends on the Material Icons font being loaded.

## 8. Source Sync Rule

This document and the source must move together.

When **any** of the following changes, update this spec **and** the named files in the same PR:

| Trigger                                                                              | Files to update                                                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `src/stories/Icon.stories.tsx` `SIZE_PX` table changes                               | `figma.spec.md` §3 + §4.1, `storybook.render.md` §1, Figma component set `3:2722` (re-author cells via `use_figma`)       |
| The story replaces inline SVGs with a real icon library (`@mui/icons-material`, `@iconify/react`, etc.) | `figma.spec.md` §1 (icon source library) + §5 (slot conventions), `storybook.render.md` §2 + §5 (drift)         |
| `@mui/material` major bump                                                           | Re-probe `storybook.render.md` §1–§3 (run `SizeMatrix` + `ColorInheritance`); if `<Box>` defaults shift, document the delta in §4 and surface a TODO in §9. Cross-check `package.json` to confirm the version field in §1. |
| Figma node `3:2722` variant axes change (e.g. someone adds a `Color` or `State` axis) | `figma.spec.md` §3, then update every host spec's `Icon Source` default and re-run `figma-component-upload` to refresh per-variant JSON |
| The `Glyph Source` default is rebound from `<ArrowSolid>` to a different glyph       | `figma.spec.md` §1 + §3.1, every host spec that references the default chain (`<Chip>` `figma.spec.md` §3.1 `Icon Source` row, etc.) |
| The Figma `Glyph Source` property is renamed (e.g. back to `Instance`, or to `Icon Source` for cross-component naming parity) | `figma.spec.md` §2, §3.1, §5, §7.1, §9 — every reference. Use `editComponentProperty(oldName, { name: newName })` to keep the property id stable so inbound references survive. |

### Token-value vs. token-name distinction

A value change in a host's foreground token (e.g. `seed/primary/main` shifts from `#1976d2` to `#1565c0`) cascades through `currentColor` and needs **no** spec edit on `<Icon>`. A rename (e.g. `seed/primary/main` → `seed/primary/foreground`) breaks the host's binding, not `<Icon>`'s — but the host's spec needs an update.

## 9. Quick Reference

```ts
// src/stories/Icon.stories.tsx — MerakIcon prop surface
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';   // → Figma `Size`

interface MerakIconProps {
  size?: IconSize;            // → Figma `Size`         (default md)
  color?: string;             // → not modeled in Figma (use host's foreground token)
  sx?: SxProps<Theme>;        // → behavior-only
  children?: React.ReactNode; // → Figma `Glyph Source` (INSTANCE_SWAP, default ArrowSolid)
  'aria-label'?: string;      // → not modeled in Figma; flag in handoff
}

const SIZE_PX: Record<IconSize, number> = {
  xs: 16, sm: 20, md: 24, lg: 28, xl: 32, xxl: 48,
};
```

```
<Icon>  COMPONENT_SET (3:2722) — Foundation Components
├─ Size=xs   (3:2733, 16 × 16)
├─ Size=sm   (3:2731, 20 × 20)
├─ Size=md   (3:2729, 24 × 24, default)
├─ Size=lg   (3:2727, 28 × 28)
├─ Size=xl   (3:2725, 32 × 32)
└─ Size=xxl  (3:2723, 48 × 48)

Component (non-variant) properties:
  Glyph Source : INSTANCE_SWAP, default <ArrowSolid> (3:2740)

Total variants: 6
```

## 10. Token Glossary

`<Icon>` consumes **zero** runtime paint tokens — the wrapper has no fills, strokes, effects, or typography of its own. The only Figma "binding" is the `Glyph Source` instance default (`3:2740`), which is a component reference, not a variable.

For completeness, the tokens consumed by `<Icon>`'s **glyph children** (the 40 named icon components and any future additions) are:

- **Vector fill on the glyph's leaf path**: intentionally unbound. `currentColor` inheritance is the contract; see §1 + §5.
- **No alias / seed / component-scoped tokens** are referenced anywhere in this set.

The host components (`<IconButton>`, `<Button>`, `<Chip>`, …) own the foreground token bindings that `<Icon>` inherits from. Reach for those specs when chasing a paint mismatch — `<Icon>` itself has nothing to bind.

There is no companion `design-token.md` in this directory — `<Icon>` mints no component-scoped tokens. If a future revision introduces a paintable axis (badge background, alert ring), promote this section into a `design-token.md` at that time.

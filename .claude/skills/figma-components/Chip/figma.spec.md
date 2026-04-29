---
name: figma-component-chip-spec
description: Figma component specification for `<Chip>` — design counterpart of the MUI `<Chip>` consumed by `src/stories/Chip.stories.tsx`. Documents the variant matrix (Color × Variant × State, Size=Medium), component properties (Icon / Avatar / Delete / Label), source-to-Figma mapping, and the per-cell Render Binding Matrix (§6) that pins every fill / stroke / foreground / effect to a named token. For component-scoped tokens see `design-token.md` in this directory; for runtime measurements see `storybook.render.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '301:6271'
figma_component_set_id: '342:7102'
---

# `<Chip>` Figma Component Specification

## 1. Overview

`<Chip>` is the Figma counterpart of the MUI `<Chip>` consumed in `src/stories/Chip.stories.tsx`. The package re-exports MUI Chip directly — there is no wrapper — so the Figma component encodes the MUI prop surface (`color`, `variant`, plus interaction state) as variant axes, and exposes `icon` / `avatar` / `onDelete` / `label` as component properties.

The design system already pre-shipped Chip-scoped tokens in the shared `merak` collection (`component/chip/fill`, `component/chip/outline`, `component/chip/focus-fill`, `component/chip/disabled-opacity`) and the Chip-specific text style (`material-design/components/chip` — Noto Sans TC Regular 12/18). This spec binds against those wherever they exist; new component-scoped tokens are minted as **local-only** in this file's collection (§4 of `design-token.md`).

| Aspect              | Value                                                                                |
| ------------------- | ------------------------------------------------------------------------------------ |
| Source story        | `src/stories/Chip.stories.tsx`                                                       |
| Underlying source   | `@mui/material` `Chip` (re-exported by this package)                                 |
| Underlying MUI      | `@mui/material` 7.3.10 (resolved from `package.json` on 2026-04-29)                  |
| Figma frame         | `<Chip>` (`301:6271`) on page **Foundation Components**                              |
| Component Set       | `<Chip>` (`342:7102`) inside frame `301:6271`                                        |
| Companion components| `<Avatar>` (`394:7033`) — minimal 24 × 24 circle with `Initial` TEXT property; default for the `Avatar Source` slot. Lives at the same page (`Foundation Components`), positioned outside the `<Chip>` frame. |
| Slot defaults       | `Icon Source` → `<Icon>/Size=sm` (`3:2731`); `Avatar Source` → `<Avatar>` (`394:7033`). Shared across every variant of the set. |
| Total variants      | **60** (6 Colors × 2 Variants × 5 States, Size=Medium only)                          |
| Typography          | Noto Sans TC Regular, `12 / 18 px` (hand-set, matches the design-system's `material-design/components/chip` style spec) — diverges from MUI runtime (Roboto 13/19.5 px); see §7 |
| Local-only bindings | **Required.** Every paint / stroke / effect resolves to a variable in this file's local collection. No `VariableID:<sharedKey>/...` consumed-library bindings are permitted (component must be self-contained). |

## 2. Source-to-Figma Property Mapping

| MUI prop                | Figma property | Type    | Notes                                                                                                                |
| ----------------------- | -------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| `color`                 | `Color`        | VARIANT | Merak design-system key; mapping in §2.1                                                                             |
| `variant`               | `Variant`      | VARIANT | `Filled` / `Outlined` (MUI default `filled`)                                                                         |
| _(interaction state)_   | `State`        | VARIANT | `Enabled` / `Hovered` / `Focused` / `Pressed` / `Disabled`                                                           |
| `size`                  | `Size`         | VARIANT | Only `Medium` is shipped on canvas; Small is runtime-only (see `storybook.render.md` §5)                             |
| `icon`                  | `Icon` + `Icon Source` | BOOLEAN + INSTANCE_SWAP | Two cooperating slot properties: `Icon` BOOLEAN toggles visibility; `Icon Source` INSTANCE_SWAP picks which component renders in the leading 20 × 20 slot. Default = `<Icon>/Size=sm` (`3:2731`, file-local component inside the `<Icon>` SET `3:2722`). The dropdown in the property panel surfaces the default; designers can also right-click → Swap Instance to pick any other component. |
| `avatar`                | `Avatar` + `Avatar Source` | BOOLEAN + INSTANCE_SWAP | Two cooperating slot properties: `Avatar` BOOLEAN toggles visibility; `Avatar Source` INSTANCE_SWAP picks which component renders in the leading 24 × 24 slot. Default = `<Avatar>` (`394:7033`, file-local), a minimal circle with a single-character `Initial` TEXT property — designers either change `Initial` per instance, or swap to a different avatar component (photo, richer Avatar) via the property panel dropdown / right-click. Mutually exclusive with `Icon` (Avatar wins when both `true`, mirroring MUI runtime). |
| `onDelete`              | `Delete`       | BOOLEAN | Toggle trailing delete icon visibility (18 × 18 slot, MUI's `<CancelIcon>` at `font-size: 22 px` runtime)            |
| `label`                 | `Label`        | TEXT    | Default `Chip`                                                                                                       |
| `disabled`              | —              | —       | Encoded as `State=Disabled`                                                                                          |
| `clickable`             | —              | —       | Behavior-only — visually identical to non-clickable in `Enabled`. The hover/focus paints in §6.3 / §6.4 only fire on a real DOM `:hover` / `Mui-focusVisible` and Figma can't model that distinction without a `Clickable` axis (omitted to keep the matrix at 60). |
| `deleteIcon`            | —              | —       | Behavior-only — designer can swap the trailing icon by right-click → Swap Instance after dropping the component       |
| `skipFocusWhenDisabled` | —              | —       | Behavior-only, no design representation                                                                              |
| `onClick`, `tabIndex`, `slots`, `slotProps` | — | —    | Behavior-only, no design representation                                                                              |

### 2.1 Color value mapping

The Merak design-system color keys map to MUI palette names; in Figma, designers pick the Merak name. Bind the Figma fill / stroke to the listed token family — never paste raw hex.

| Merak key (source) | MUI palette key | Figma token family                                                          | Figma `Color` value |
| ------------------ | --------------- | --------------------------------------------------------------------------- | ------------------- |
| `default`          | `default`       | `alias/colors/text-default` _(text)_ + Chip-scoped tokens (§4 in `design-token.md`) | **Default**  |
| `primary`          | `primary`       | `seed/primary/*`                                                            | **Primary**         |
| `danger`           | `error`         | `seed/danger/*`                                                             | **Error**¹          |
| `warning`          | `warning`       | `seed/warning/*`                                                            | **Warning**         |
| `info`             | `info`          | `seed/info/*`                                                               | **Info**            |
| `success`          | `success`       | `seed/success/*`                                                            | **Success**         |

¹ The Figma `Color=Error` value targets `seed/danger/*` (the project's Merak-named token family for MUI `palette.error.*`). Stories and runtime use `color="error"` directly; `danger` is the Merak alias the design system applies internally.

## 3. Variant Property Matrix

```
Color × Variant × State (Size=Medium)   =   6 × 2 × 5   =   60 variants
```

| Property  | Default value | Options                                                |
| --------- | ------------- | ------------------------------------------------------ |
| `Color`   | `Default`     | `Default`, `Primary`, `Error`, `Warning`, `Info`, `Success` |
| `Variant` | `Filled`      | `Filled`, `Outlined`                                   |
| `State`   | `Enabled`     | `Enabled`, `Hovered`, `Focused`, `Pressed`, `Disabled` |

`Size` is fixed at `Medium`. MUI exposes `small`, but the project ships only one Figma size; if `Small` becomes load-bearing, add it as a 7th axis (per §8) for `60 + 60 = 120` variants.

### 3.1 Component (non-variant) properties

| Property key     | Type           | Default                                  | Purpose                                                                                                |
| ---------------- | -------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `Icon`           | BOOLEAN        | `false`                                  | Leading icon slot **visibility**. Hidden by default; toggle on per-instance.                           |
| `Icon Source`    | INSTANCE_SWAP  | `<Icon>/Size=sm` (`3:2731`)              | Leading icon slot **content**. Picks which 20 × 20 component renders when `Icon = true`. Default is the project's generic icon wrapper (which itself nests an `ArrowSolid` glyph by default). The leaf VECTOR fill of whatever component is dropped here gets overridden per-cell to track the chip's Foreground binding (§6 column convention) — so any component whose paint follows the standard `tdesign:loading` FRAME-wrapper + leaf VECTOR pattern will tint correctly. Components with deeper nesting may need manual fill override. **Shared-default caveat**: this default is shared across every variant of the host set; choose a benign placeholder (we use the Icon set's default ArrowSolid). |
| `Avatar`         | BOOLEAN        | `false`                                  | Leading avatar slot **visibility**. Hidden by default; mutually exclusive with `Icon` — when both are `true`, the `Avatar` slot is rendered and the `Icon` slot is suppressed (mirrors MUI runtime). |
| `Avatar Source`  | INSTANCE_SWAP  | `<Avatar>` (`394:7033`)                  | Leading avatar slot **content**. Picks which 24 × 24 component renders when `Avatar = true`. Default is `<Avatar>` — a minimal local circle with a single-character `Initial` TEXT property. Designers can either change `Initial` per-instance to render a different letter, or swap the instance to a richer Avatar component (photo, multi-letter, badge) via the property panel dropdown / right-click → Swap Instance. The avatar's bg + initial text are overridden per-cell to track the chip's Color (§6.7). **Shared-default caveat** applies. |
| `Delete`         | BOOLEAN        | `false`                                  | Trailing delete icon visibility. Hidden by default; toggle on for chips that should expose `onDelete`. (Currently a TEXT `×` placeholder — see §6.8 / §7 #6.) |
| `Label`          | TEXT           | `Chip`                                   | Chip label text. Hand-set Noto Sans TC Regular 12/18 (matches `material-design/components/chip` style spec).                                |

`Icon` / `Avatar` / `Delete` are kept as BOOLEANs (not variant axes) to avoid an explosion to `60 × 2 × 2 × 2 = 480` variants. Designers compose slot combos at the instance level. The Figma component itself models the **slot precedence** (Avatar wins over Icon) by making the Avatar layer paint over the Icon layer when both are visible — see §6.1.

## 4. Usage Guidelines

### 4.1 Picking a variant

1. **Pick the Color** that matches the source `color` prop — Merak `danger` → Figma `Error`, etc. (§2.1).
2. **Pick the Variant** — `Filled` for the default chip; `Outlined` for low-emphasis status tags or low-density UI.
3. **Pick the State** — `Enabled` is the resting cell; `Hovered`, `Focused`, `Pressed` mirror runtime interactive states (only fire when `clickable` or `onDelete` is set at runtime — see §2 note); `Disabled` is the dimmed read-only cell.
4. **Toggle slots** — turn on `Icon` for a 18×18 leading glyph, `Avatar` for a 24×24 circular avatar, `Delete` for a trailing delete affordance. `Avatar` overrides `Icon` when both are on.
5. **Override the `Label`** — type the actual chip content. Long labels truncate via `text-overflow: ellipsis` at runtime; Figma's text node should keep `Truncate text` on with a max-width matching the desired chip width.

### 4.2 Action / status semantics

Use `Color=Error` for destructive or alert-state chips (e.g. "Removed", "Failed"). `Color=Warning` for review states. `Color=Info` for neutral metadata tags. `Color=Default` for chips that should not draw the eye (counts, neutral tags).

`Avatar` chips are the canonical "person tag" / "contact tag" pattern. `Icon` chips read as category tags. `Delete` chips imply user-removable selections (filter chips, recipient chips).

### 4.3 Don'ts

- ❌ Don't detach the Chip instance to recolor it — bind to a different `Color` variant instead. Detached instances drift from `seed/*` values when the theme is re-keyed.
- ❌ Don't paint a Chip with raw hex values. Every fill / stroke / text-fill / shadow must resolve to a local variable (see §6 / §1 local-only rule).
- ❌ Don't enable both `Icon` and `Avatar` and expect them to render side-by-side — `Avatar` overrides `Icon` to mirror MUI runtime.
- ❌ Don't apply node-level `opacity < 1` to a fill that is bound to a variable — Figma flattens it on instance creation. For Disabled, use the `component/chip/disabled-opacity` token applied at the **root** node opacity (the entire chip is dimmed uniformly), not per-paint.
- ❌ Don't add a focus ring stroke to `State=Focused`. MUI's runtime relies on the variant's `background` shift for focus indication — there is no border-color delta on focus. Keep stroke identical to `Enabled`.

## 5. Token Glossary

This section names every token consumed. For component-scoped tokens, `design-token.md` (next to this file) carries the resolution chain and rationale.

### 5.1 Seed (themable)

Per family `<C>` ∈ {`primary`, `danger`, `warning`, `info`, `success`} (no `secondary` — MUI exposes it but Merak does not):

- `seed/<C>/main` — themed Filled background, themed Outlined foreground.
- `seed/<C>/hover` — themed hover/focus background for Filled (resolves to `palette.<color>.dark`).
- `seed/<C>/hover-bg` (when present) / `seed/<C>/outline-hover` (warning/danger/secondary) — 4 % α tint for themed Outlined hover background.
- `seed/<C>/focusVisible` — 30 % α tint for themed Outlined focus background. **Diverges from MUI runtime's `alpha(main, 0.12)`; see §7**.
- `seed/<C>/outlineBorder` — 50 % α stroke for themed Outlined border. **Diverges from MUI runtime's `alpha(main, 0.7)`; see §7**.
- `seed/<C>/on` — themed Filled foreground (label text + icon when `iconColor === color`).

### 5.2 Alias

- `alias/colors/text-default` — `palette.text.primary` (`#000000DE`); used for Chip fg when `Color=Default`.
- `alias/colors/text-disabled` — `palette.text.disabled` (`#00000061`); reference resolution for the disabled-state foreground (consumed indirectly via root opacity).
- `alias/colors/bg-filled-hover` — `palette.action.focus` (`#0000001F`, 12 % α); used for `Color=Default` Filled `:hover` background, matches MUI `alpha(action.selected, 0.12)`.
- `alias/colors/bg-outline-hover` — `palette.action.hover` (`#0000000A`, 4 % α); used for `Color=Default` Outlined `:hover` background.
- `alias/colors/bg-focus` — `palette.action.focus` (`#0000001F`, 12 % α); used for `Color=Default` Outlined `Mui-focusVisible` background.
- `alias/colors/border-defalt` _(sic)_ — preserved typo; not used directly by Chip but listed for visibility (Chip uses `component/chip/outline` for the `Color=Default` Outlined stroke).
- `alias/colors/fg-disabled` — `palette.action.disabled` (`#00000042`, 26 % α); reference for delete-icon enabled tint when `Color=Default` (matches MUI `alpha(text.primary, 0.26)`).

### 5.3 Component-scoped (Chip)

- `component/chip/fill` (mirrored from the shared catalogue into this file's local collection on 2026-04-29) — `#00000014` (8 % α); `Color=Default` Filled background. Matches MUI `palette.action.selected`.
- `component/chip/outline` (mirrored from the shared catalogue) — `#BDBDBD`; `Color=Default` Outlined border. Matches MUI `Chip.defaultBorder` fallback (`grey[400]`).
- `component/chip/focus-fill` (mirrored from the shared catalogue) — `#00000033` (20 % α); `Color=Default` Filled `Mui-focusVisible` background. Matches MUI `alpha(action.selected, 0.20)`.
- `component/chip/disabled-opacity` (mirrored from the shared catalogue, FLOAT, scopes `OPACITY`) — `38` (percent); applied as root-node opacity for `State=Disabled`. Matches MUI `palette.action.disabledOpacity`.

No additional Chip-scoped tokens are required — every §7 divergence is absorbed by reusing existing seed / alias tokens (alpha-mismatched but consistent with the design system's cross-component conventions). If a future PR closes any divergence by minting a per-color `component/chip/...` token, document it in a sibling `design-token.md` and update §5.3 here.

### 5.4 Effect / shape & elevation

- `material-design/shadows/shadows-1` — Pressed-state drop shadow on `clickable` Chips. Matches MUI `theme.shadows[1]`.
- Corner radius — `16 px` on every cell (`height / 2`, MUI default). Not bound to a variable; baked into the auto-layout container.

### 5.5 Typography

- Hand-set values matching the design system's `material-design/components/chip` style spec — Noto Sans TC Regular, `fontSize: 12`, `lineHeight: { unit: 'PIXELS', value: 18 }`, `letter-spacing: 0%`. The MUI Library file currently has zero local text styles (sibling components like `<Button>` also hand-set typography), so Chip applies the values directly on the Label TEXT node rather than via `textStyleId`. If a future PR mints `material-design/components/chip` as a local text style, switch the Label node to bind that style id and update §6.1 accordingly.
- **Divergence from MUI runtime** — the design system overrides chip typography to Noto Sans TC 12/18, where MUI runtime uses Roboto 13/19.5 (`pxToRem(13)`, line-height `1.5`). This is an intentional design-system decision, not a bug; documented in §7.

## 6. Render Binding Matrix

Single denormalized matrix that subsumes "Design Tokens" (§4 of Skeleton A) and "Layout" (§6 of Skeleton A). Use the **§6.1 Constants** table for everything that holds across all 60 cells; §6.2–§6.6 carry the per-state paint deltas.

Column conventions (defined once, used in every state subsection):

- **Fill** — node fill on the Chip root. `transparent` means no fill paint.
- **Stroke** — node stroke on the Chip root. `none` means no stroke. `1 px solid <token>` means a single bound stroke paint with `strokeWeight = 1`.
- **Foreground** — Label TEXT fill **and** the leading Icon fill when `iconColor === color` (MUI's `Chip.js:186-199` resolves `& .icon { color: 'inherit' }` for themed colors). Avatar slot fg is handled separately in §6.7.
- **Effect** — drop shadow on the Chip root (i.e. `effects` array). `none` means no effects.
- **Delete-icon fill** — only varies on `Color`; documented once in §6.1 and not repeated per-state because MUI doesn't shift it on hover/focus (only on the delete icon's own `:hover`).

`<C>` is the seed family (`primary | danger | warning | info | success`). `Default` rows are listed separately whenever the binding diverges from the themed pattern.

### 6.1 Constants (every cell, Size=Medium)

| Property                  | Value                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Auto Layout direction     | `HORIZONTAL`, `primaryAxisAlignItems: CENTER`, `counterAxisAlignItems: CENTER`                         |
| Outer height              | `32 px` (fixed) — Auto Layout `counterAxisSizingMode: FIXED, height: 32`                              |
| Width                     | `HUG` (Auto Layout `primaryAxisSizingMode: AUTO`); minimum is the leading-pad + label + trailing-pad   |
| Padding (Filled)          | `0 12 0 12` (root horizontal padding; vertical 0 because the 32 px height matches the cell box)        |
| Padding (Outlined)        | `0 11 0 11` (1 px absorbed by the 1-px stroke)                                                         |
| Item spacing              | `6` — root Auto Layout gap. Matches MUI runtime's measured 6 px visible gap between leading slot (avatar / icon) and label-text, and between label-text and trailing delete (Chrome DevTools probe of `src/stories/Chip.stories.tsx`'s `SlotMatrix`, 2026-04-29). Single-child cells (label-only) ignore `itemSpacing`, so unslotted chips remain at `padL + label + padR` widths matching MUI exactly. |
| Avatar slot               | 24 × 24 INSTANCE bound to `Avatar Source` INSTANCE_SWAP property (default `<Avatar>` `394:7033`, leading). Visible when `Avatar = true`. The default `<Avatar>` exposes its own `Initial` TEXT property (single-character) and is paint-overridden per-cell with bg + fg per §6.7. Hidden by default. Designers swap the source component via the property panel dropdown or right-click → Swap Instance. |
| Icon slot                 | 20 × 20 INSTANCE bound to `Icon Source` INSTANCE_SWAP property (default `<Icon>/Size=sm` `3:2731`, leading). Visible when `Icon = true`. The instance's leaf VECTOR fill is overridden per-cell to track the chip's Foreground binding (§6 column convention). Wrapper FRAME inside the Icon instance has `fills = []` so only the glyph path paints. Hidden by default. Designers swap the source component via the property panel dropdown or right-click → Swap Instance, mirroring `<Button>`'s `Icon Left`. |
| Delete slot               | 18 × 18 FRAME with a centered TEXT `×` (Noto Sans TC Bold 14 / 18), trailing. Visible when `Delete = true`. Hidden by default. (Will swap to an `<Icon>/Cancel` instance once the icon set ships a `Cancel` glyph — see §7 #6.) |
| Corner radius             | `16 px` (`height / 2`)                                                                                 |
| Label text style          | `material-design/components/chip` (Noto Sans TC Regular 12/18)                                         |
| Label `text-overflow`     | TEXT_AUTO_RESIZE = `WIDTH_AND_HEIGHT` for the design canvas; runtime truncates to ellipsis (no Figma analogue) |
| Delete-icon Fill (`Default`) | bound to `alias/colors/fg-disabled` (`#00000042`, 26 % α) — matches MUI `alpha(text.primary, 0.26)` |
| Delete-icon Fill (themed Filled) | bound to `seed/<C>/on` — full opacity. **Diverges** from MUI's `alpha(contrastText, 0.7)`; the design system trades the 30 % alpha softening for a single bound token. See §7. |
| Delete-icon Fill (themed Outlined) | bound to `seed/<C>/main` — full opacity. **Diverges** from MUI's `alpha(main, 0.7)` for the same reason. |

### 6.2 State = Enabled

| Variant   | Color    | Fill                            | Stroke                                | Foreground                        | Effect |
| --------- | -------- | ------------------------------- | ------------------------------------- | --------------------------------- | ------ |
| Filled    | Default  | `component/chip/fill`           | `none`                                | `alias/colors/text-default`       | none   |
| Filled    | `<C>`    | `seed/<C>/main`                 | `none`                                | `seed/<C>/on`                     | none   |
| Outlined  | Default  | `transparent`                   | `1 px solid component/chip/outline`   | `alias/colors/text-default`       | none   |
| Outlined  | `<C>`    | `transparent`                   | `1 px solid seed/<C>/outlineBorder`   | `seed/<C>/main`                   | none   |

### 6.3 State = Hovered (`:hover` of clickable Chips)

| Variant   | Color    | Fill                                                          | Stroke                                | Foreground                        | Effect |
| --------- | -------- | ------------------------------------------------------------- | ------------------------------------- | --------------------------------- | ------ |
| Filled    | Default  | `alias/colors/bg-filled-hover` (`palette.action.focus` 12 % α — matches MUI `alpha(action.selected, selectedOpacity + hoverOpacity)`) | `none` | `alias/colors/text-default`       | none   |
| Filled    | `<C>`    | `seed/<C>/hover` (`palette.<color>.dark`)                     | `none`                                | `seed/<C>/on`                     | none   |
| Outlined  | Default  | `alias/colors/bg-outline-hover` (`palette.action.hover` 4 % α) | `1 px solid component/chip/outline`   | `alias/colors/text-default`       | none   |
| Outlined  | `<C>`    | `seed/<C>/hover-bg` (4 % α themed) when present, else `seed/<C>/outline-hover` (same 4 % α, family-specific naming) | `1 px solid seed/<C>/outlineBorder` | `seed/<C>/main` | none |

> Token name footnote: `seed/primary/hover-bg`, `seed/info/hover-bg`, `seed/success/hover-bg` exist with that suffix. `seed/secondary/outline-hover`, `seed/warning/outline-hover`, `seed/danger/outline-hover` use the `outline-hover` suffix instead — same hex pattern (4 % α main), different naming. This Chip spec binds whichever name ships per family. Renaming silently breaks bindings.

### 6.4 State = Focused (`Mui-focusVisible`)

| Variant   | Color    | Fill                                                          | Stroke                                | Foreground                        | Effect |
| --------- | -------- | ------------------------------------------------------------- | ------------------------------------- | --------------------------------- | ------ |
| Filled    | Default  | `component/chip/focus-fill` (`#00000033`, 20 % α — matches MUI `alpha(action.selected, selectedOpacity + focusOpacity)`) | `none` | `alias/colors/text-default`       | none   |
| Filled    | `<C>`    | `seed/<C>/hover` (`palette.<color>.dark` — MUI shares the same hex for filled hover and focus on themed colors) | `none` | `seed/<C>/on`                     | none   |
| Outlined  | Default  | `alias/colors/bg-focus` (`palette.action.focus` 12 % α — matches MUI exactly) | `1 px solid component/chip/outline`   | `alias/colors/text-default`       | none   |
| Outlined  | `<C>`    | `seed/<C>/focusVisible` (30 % α themed). **Diverges** from MUI's `alpha(main, 0.12)`; see §7. | `1 px solid seed/<C>/outlineBorder` | `seed/<C>/main` | none |

### 6.5 State = Pressed (`:active` of clickable Chips)

Pressed adds an elevation shadow and otherwise keeps the Hovered paint. MUI `Chip.js:235-237` only fires `boxShadow: shadows[1]` on `:active` of `clickable: true` chips.

| Variant   | Color    | Fill (= Hovered)                | Stroke (= Enabled)                    | Foreground (= Hovered)            | Effect                                          |
| --------- | -------- | ------------------------------- | ------------------------------------- | --------------------------------- | ----------------------------------------------- |
| Filled    | Default  | `alias/colors/bg-filled-hover`  | `none`                                | `alias/colors/text-default`       | `material-design/shadows/shadows-1`             |
| Filled    | `<C>`    | `seed/<C>/hover`                | `none`                                | `seed/<C>/on`                     | `material-design/shadows/shadows-1`             |
| Outlined  | Default  | `alias/colors/bg-outline-hover` | `1 px solid component/chip/outline`   | `alias/colors/text-default`       | `material-design/shadows/shadows-1`             |
| Outlined  | `<C>`    | `seed/<C>/hover-bg` / `outline-hover` (per family) | `1 px solid seed/<C>/outlineBorder` | `seed/<C>/main` | `material-design/shadows/shadows-1`             |

### 6.6 State = Disabled

Disabled is uniform across every (Color × Variant) cell — every paint binds to its `Enabled` token, then the **root node** carries `opacity = component/chip/disabled-opacity` (`0.38`). No per-color disabled palette swap, matching MUI's `&.Mui-disabled { opacity: action.disabledOpacity }`.

| Variant   | Color    | Fill (= Enabled)                | Stroke (= Enabled)                    | Foreground (= Enabled)            | Effect | Root opacity                         |
| --------- | -------- | ------------------------------- | ------------------------------------- | --------------------------------- | ------ | ------------------------------------ |
| Filled    | Default  | `component/chip/fill`           | `none`                                | `alias/colors/text-default`       | none   | `component/chip/disabled-opacity`    |
| Filled    | `<C>`    | `seed/<C>/main`                 | `none`                                | `seed/<C>/on`                     | none   | `component/chip/disabled-opacity`    |
| Outlined  | Default  | `transparent`                   | `1 px solid component/chip/outline`   | `alias/colors/text-default`       | none   | `component/chip/disabled-opacity`    |
| Outlined  | `<C>`    | `transparent`                   | `1 px solid seed/<C>/outlineBorder`   | `seed/<C>/main`                   | none   | `component/chip/disabled-opacity`    |

> The `Color` axis is preserved on Disabled — even though every disabled chip looks "muted into greyscale" perceptually, the underlying paint bindings keep referencing the colored token so an `Enabled ↔ Disabled` toggle on a single instance keeps `Color` stable. Designers can flip a disabled chip to `Enabled` and watch the color return without a re-pick.

### 6.7 Avatar slot bindings (when `Avatar = true`)

The Avatar circle inside the Chip uses these bindings when shown. The leading rectangle of the chip auto-layout reserves a 24 × 24 frame; toggling `Avatar = false` hides it.

| Color    | Avatar Fill                  | Avatar Foreground (text/initials)  | Notes                                                                          |
| -------- | ---------------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| Default  | `seed/neutral/main` (`#9E9E9E`) | `seed/neutral/white` (`#FFFFFF`) | Matches MUI fallback (Avatar's own bg = `palette.bgcolor` = grey/400; we approximate with neutral/main for visual closeness) |
| `<C>`    | `seed/<C>/hover` (`palette.<color>.dark`) | `seed/<C>/on`              | Matches MUI `avatarColor<C>` rules                                             |

**Avatar text typography** — the placeholder initial uses Noto Sans TC **Bold** 12 / 18 (centered, single character "A" in the published canvas placeholder). MUI runtime uses `theme.typography.pxToRem(12)` (`12 px`) without a weight override, so the regular weight wins at runtime. The Figma placeholder picks Bold for visibility on small (24 × 24) circles; designers swapping in a real avatar (photo or text-initials Avatar instance) override per their brand guidance.

### 6.7a Documentation frame: `UseCase`

Inside the same parent frame `301:6271` ("Chip" on **Foundation Components**), to the right of the COMPONENT_SET, sits a `UseCase` documentation frame (id `391:6777`, `1100 × ~1116`, bg `#FAFAFA`, padding 32, vertical gap 32) mirroring `<Button>`'s `1:4473` pattern. Sections (in render order):

1. **Title** — "Use Case" (Roboto Bold 28 / 36).
2. **Color × Variant** — 6-row × 2-col grid (Default / Primary / Error / Warning / Info / Success × Filled / Outlined), `Medium / Enabled — with leading icon` caption. Each cell is a Chip instance with `Icon = true`.
3. **States** — single row of 5 Primary Filled instances, one per State (Enabled / Hovered / Focused / Pressed / Disabled), `Icon = true`.
4. **Icon** — `Icon` BOOLEAN visibility + `Icon Source` INSTANCE_SWAP demo: 4 chips (`Default` Primary Filled, `No icon` Primary Filled, `Outlined` Primary Outlined, `Default chip` Default Filled) showing the leading-icon visibility toggle. The caption explains both properties together.
5. **Avatar** — `Avatar` BOOLEAN visibility + `Avatar Source` INSTANCE_SWAP demo: 4 chips with different `Initial` values on the inner `<Avatar>` instance — `Alice → A` (Default Filled), `Mark → M` (Primary Filled), `Jane → J` (Success Outlined), `Bryan → B` (Warning Filled). Demonstrates per-instance customization of the Avatar slot without touching chip variants.
6. **Delete** — BOOLEAN demo: 5 chips combining Delete with no slots, with Avatar, and with Icon (`Tag`, `Filter`, `Removed`, `John Doe`, `category`).
7. **Common usage** — practical mix: filter (`All` outlined-default with Icon), status (`Active` primary with Delete, `Approved` success with Icon, `Pending` warning outlined, `Failed` error with Delete), contact (`Jane Smith` default with Avatar + Delete).

Section headers use **Noto Sans TC Medium 18 / 26**, captions **Noto Sans TC Regular 12 / 20**, row / column labels **Noto Sans TC Regular 14 / 20** — same typography as `<Button>`'s `1:4473`. All chips are instances of the published COMPONENT_SET (`342:7102`); none are detached. The UseCase frame is a **showcase** — no design tokens or component definitions live here, so it is not part of the source-sync contract beyond requiring re-instantiation when variant axes / property keys change.

### 6.8 Glyph table (icon / delete glyphs)

| Slot         | Visibility prop | Default visibility | Frame dims | Source glyph | Token mapping for fill                                             |
| ------------ | --------------- | ------------------ | ---------- | ------------ | ------------------------------------------------------------------ |
| Leading icon | `Icon`          | `false`            | 20 × 20    | INSTANCE of `<Icon>/Size=sm` (`3:2731`, file-local). Default glyph: the icon set's nested `ArrowSolid` instance (`3:2732`); designers right-click → Swap Instance to pick a different glyph. The wrapper FRAME inside the Icon instance has `fills = []` so only the leaf VECTOR's bound paint shows. | leaf VECTOR fill is overridden per-cell to track the chip's Foreground binding (Default → `alias/colors/text-default`; themed Filled → `seed/<C>/on`; themed Outlined → `seed/<C>/main`) |
| Avatar       | `Avatar`        | `false`            | 24 × 24    | Designer-supplied (text initials or photo); the placeholder is a circle filled with §6.7 bindings | see §6.7 |
| Trailing delete | `Delete`     | `false`            | 18 × 18    | **Placeholder**: a centered TEXT node `×` (multiplication sign U+00D7), Noto Sans TC Bold 14 / 18, fill bound to the per-Color delete-icon Fill in §6.1. The MUI runtime uses a `<CancelIcon>` SVG; the text-glyph placeholder ships today because the project's `<Icon>` set does not yet publish a `Cancel` variant. **TODO (spec §8 trigger)**: when the project's `<Icon>` set adds a `Cancel` variant, swap the placeholder for an `INSTANCE` of that icon and update this row. | per §6.1 (`alias/colors/fg-disabled` for Default; `seed/<C>/on` or `seed/<C>/main` for themed) |

## 7. Documented divergences from MUI runtime

These are intentional trade-offs that this spec adopts; do **not** silently re-align them to MUI without ownership review. Every entry here ships in `storybook.render.md` §7 as a drift check too.

1. **Typography** — Figma uses `material-design/components/chip` (Noto Sans TC Regular 12/18). MUI runtime uses Roboto 13/19.5 (`pxToRem(13)`, line-height `1.5`). The design system standardized chip typography on the project's primary CJK font; recovering MUI's 13/19.5 would force every chip to subtly grow.
2. **Outlined themed border alpha** — Figma binds `seed/<C>/outlineBorder` (50 % α). MUI runtime uses `alpha(palette[color].main, 0.7)` (70 % α). The design system uses the same alpha as Button's outlined border for cross-component consistency. Resolving to MUI runtime would need 5 minted `component/chip/outline-<C>` tokens.
3. **Outlined themed focus background alpha** — Figma binds `seed/<C>/focusVisible` (30 % α). MUI runtime uses `alpha(palette[color].main, 0.12)` (12 % α). Same rationale — design system standardized focus tints across components.
4. **Delete icon foreground on themed chips** — Figma binds `seed/<C>/on` (themed Filled) / `seed/<C>/main` (themed Outlined) at full alpha. MUI runtime uses the same hex but at 70 % α (`alpha(contrastText, 0.7)` / `alpha(main, 0.7)`). Honouring the alpha would require minting per-color `component/chip/delete-on-<C>` / `component/chip/delete-main-<C>` tokens; the design system's call is to keep the delete icon at full chroma. The hover-state full-alpha is reached by MUI by removing the alpha — both Figma and MUI converge on full-alpha-on-hover, so the Hovered state agrees.
5. **Pressed-shadow alpha drift (`material-design/shadows/shadows-1`)** — The shared effect style stacks three shadows with alphas `0.02 / 0.14 / 0.12`. MUI runtime's `theme.shadows[1]` uses `0.20 / 0.14 / 0.12` (the first shadow's alpha is 10× higher than the project's library style). Pressed Chips bind to the project's shared style as-is, so the rendered drop-shadow umbra on Pressed is much softer than MUI runtime. This is a library-wide style decision — **not** a Chip-specific divergence — but consumers of the Pressed state need to know. Resolving requires editing the shared `shadows-1` effect style (which would re-paint every other component using it).
6. **Delete-icon glyph: TEXT placeholder vs MUI's `<CancelIcon>` SVG** — The trailing delete slot ships a centered TEXT node `×` (Noto Sans TC Bold 14 / 18) bound to the per-Color delete-icon Fill. MUI runtime renders an SVG `<CancelIcon>` at `font-size: 22 px` (medium) / `16 px` (small). The text-glyph stand-in is intentional: the project's `<Icon>` set does not yet publish a `Cancel` glyph, so an SVG vector would either (a) embed a one-off vector inside the Chip (detached from the icon set, drift-prone) or (b) leave the slot empty. The TEXT placeholder lets designers see the affordance. **Swap to an `<Icon>` instance once the icon set ships `Cancel`** (recorded as a §8 sync trigger).
7. **Bound-paint convention vs. spec-guide §4 rule 5** — Every paint in the Render Binding Matrix carries `paint.opacity` set to its variable's alpha (e.g. `component/chip/fill` = 8 % α paired with `paint.opacity = 0.08`; `seed/<C>/hover-bg` = 4 % α paired with `paint.opacity = 0.04`). The `figma-component-spec-guide` §4 rule 5 ("Stacked fills for theme-color 8 % tints. A paint with `opacity < 1` plus a bound variable gets flattened on instance creation.") cautions against this pattern. **Empirical test on this file (2026-04-29)** — created an instance of Color=Default,Variant=Filled,State=Enabled, queried its fill: `paint.opacity` was preserved at `0.08`, NOT flattened to `1`. The cells render correctly on canvas and on instance creation in this file; the spec-guide rule's flattening behaviour does not reproduce in current Figma. The Chip ships with this convention because the alternative (stacked-fill compositing) would mean two paints per cell × 60 cells = 120 paints when one suffices, plus the math drift (`1 − (1 − 0.04)² ≈ 7.84 %` instead of an exact 8 %). If a future Figma update reintroduces the flattening behaviour, the §6 matrix needs to be re-authored as stacked-fills; that's a TODO at the §8 trigger level.
8. **Leading-icon slot size: 20 × 20 vs MUI 18 × 18** — The Figma Icon slot uses an INSTANCE of `<Icon>/Size=sm` (`3:2731`, 20 × 20) to match `<Button>`'s `Icon Left` pattern in this file. MUI Chip's runtime icon renders at 18 × 18 for both medium and small chips (the SVG inherits its intrinsic dimensions; `Chip.js` only sets `font-size: 18` on small variant). The closest icon-set size for 18 px would be `Size=xs` (16 × 16), which is 2 px smaller than runtime. Choosing `Size=sm` (20 × 20) keeps Chip aligned with Button's icon convention at the cost of a 2 px visible-size delta vs MUI runtime. If a future PR mints `<Icon>/Size=18` (or similar), swap the placeholder instance and mark resolved.
9. **Slot ↔ label spacing: simplified `itemSpacing` instead of MUI's negative-margin trick** — Figma Auto Layout uses a uniform `itemSpacing` between siblings (no per-child margin). To reproduce MUI's `marginLeft: 5, marginRight: -6` overlap pattern (which yields a 6 px visible gap between leading slot and label-text inside a label with `padding-left: 12`), the spec uses **`itemSpacing: 6`** at the root with `paddingLeft: 12 / paddingRight: 12`. Result: the visible gap matches MUI exactly (6 px), but slotted chips are ~7 px wider than MUI runtime because Figma's leading edge offsets to the slot's left side don't match MUI's `marginLeft: 5` baked into the slot. Trade-off: identical visible spacing, slightly wider total chip. Acceptable for component-library use because MUI's exact runtime width depends on text rendering anyway.

If a future PR closes any of these divergences, append a `Resolved YYYY-MM-DD` line to the affected entry rather than deleting it (see `figma-create-component` "Runtime-truth pass" guidance).

## 8. Source Sync Rule

This document and the source must move together. A change in any of the following files **forces** an update here, in `storybook.render.md`, and in `design-token.md` (when component-scoped tokens are touched):

1. `src/stories/Chip.stories.tsx` — story file. New stories, removed args, or renamed exports update §2 / §3 / §4.1 in this spec.
2. `node_modules/@mui/material/Chip/Chip.js` — MUI source. A MUI minor/major bump that changes paddings, heights, alpha multipliers, or palette resolution updates §6 (Render Binding Matrix) and `storybook.render.md` §1–§6.
3. `package.json` (and `pnpm-lock.yaml` / `package-lock.json`) — pin of `@mui/material`. Bump §1's `Underlying MUI` row whenever the resolved version changes.
4. `.storybook/preview.tsx` — global theme decorator. If the project introduces a custom MUI theme override (palette / typography / shape / shadows), update §1, §5, §6 and re-derive `storybook.render.md` paint values.
5. The published Figma `<Chip>` component set (file `KQjP6W9Uw1PN0iipwQHyYn`, frame `301:6271`) — once published, set the `figma_component_set_id` frontmatter and reflect any axis additions / component-property additions in §3.
6. The Merak variable collection (`material-design` + `merak` collections in this Figma file) — if a token is renamed, removed, or its `resolvedType` changes, update every reference in §2.1, §5, §6. **Token-value changes alone do not require a spec edit** — variables resolve by name.
7. `material-design/components/chip` text style — if the design system retires it or changes its font / size / line-height, update §1, §5.5, and §6.1's Label row.
8. `.claude/skills/figma-design-guide/design-token.md` — the project token catalogue. If a Chip-relevant `seed/*` family adds a `hover-bg` / `outline-hover` token, audit §6 to see if Chip should consume it.
9. This file's neighbouring `design-token.md` — if Chip-scoped tokens are minted to close the §7 divergences, update §5.3 and the Render Binding Matrix accordingly.

Specifically:

- **A new MUI Chip prop** → add a row to §2 (and a story export to `src/stories/Chip.stories.tsx`). If the prop is design-relevant, decide if it gets a `BOOLEAN` / `VARIANT` and update §3.
- **Renamed seed token** (e.g. `seed/danger/outline-hover` → `seed/danger/hover-bg`) → grep §6 for the old name, update every cell, refresh §5.1, update `storybook.render.md` §6 if it referenced the alias chain.
- **Theme-override introduces a custom palette hex for `error`** → §6 bindings stay (they're tokens, not hex), but `storybook.render.md` §2 needs a new resolved-hex row.
- **MUI raises Chip default font-size to 14 px** → update §1 typography row, §6.1 Label row, divergence note in §7. Decide whether the design system's 12 px stays (likely yes — it's a deliberate override).
- **`component/chip/disabled-opacity` retires from the shared collection** → mint a local replacement, update §5.3 and `design-token.md` §1.
- **The shared `<Icon>` set ships a `Cancel` glyph** → swap the Delete slot's TEXT placeholder for an `INSTANCE` of the new icon variant (Phase B structural rewrite per `figma-create-component`'s "Phase the writes by op-type"). Update §6.8 row, §1 typography note, divergence #6 → mark resolved with date.
- **The shared `material-design/shadows/shadows-1` effect style is corrected to `0.20 / 0.14 / 0.12`** → no Chip-side edit is needed (Pressed cells already bind the style by id), but mark divergence #5 in §7 as resolved with date.
- **`figma-component-spec-guide` §4 rule 5 ("paint.opacity < 1 + bound variable flattens on instance creation") is rewritten or removed** → update §7 divergence #7 here. If the rule's flattening behaviour ever does reproduce in Figma, re-author §6 as stacked-fill compositing (`1 − (1 − 0.04)² ≈ 7.84 %` for ~8 %).
- **The `<Icon>` component set (`3:2722`) is restructured (renamed sizes, new variants, the inner `ArrowSolid` instance is swapped or removed)** → re-validate the per-cell leaf-VECTOR fill override (the override path assumes the instance has exactly one VECTOR descendant under a single FRAME wrapper). Update §6.1 Icon-slot row + §6.8 Leading-icon row.
- **A 18-px icon size is minted in `<Icon>`** → swap the placeholder INSTANCE from `Size=sm` to the new variant; mark §7 divergence #8 resolved with date; update §6.1 Icon-slot dims.
- **`<Avatar>` (`394:7033`) is renamed, removed, or restructured** → the `Avatar Source` INSTANCE_SWAP default points at `394:7033`. If the node id changes (rename + remove + recreate), update the property's defaultValue via `editComponentProperty`. If `<Avatar>`'s `Initial` TEXT property is renamed, refresh the per-instance `setProperties({ "Initial#…": "…" })` calls in the UseCase frame's Avatar / Common usage / Delete sections. Update §1 aspect table and §6.7 + §6.8 if the avatar's frame dims or default initial change.
- **A new richer Avatar component is published (e.g. `<Avatar>` with multi-letter / photo / size variants)** → optionally promote it to be the new default for `Avatar Source`, or list it in `preferredValues` so designers see it in the property panel dropdown. Mention in §3.1 + §6.7.
- **`Icon Source` or `Avatar Source` property is renamed (e.g. `Icon Source` → `Icon Component`)** → grep §2 / §3.1 / §6.1 / §6.7 / §6.8 / §6.7a (UseCase) for the old name and update everywhere; the property key changes when renamed, so any code referencing `'Icon Source#397:0'` / `'Avatar Source#397:61'` (incl. the UseCase build script) needs the new key.

## 9. Quick Reference

### 9.1 Source TypeScript surface

```ts
// `src/stories/Chip.stories.tsx` re-exports MUI Chip directly.
// MUI ChipOwnProps (excerpt):
type ChipOwnProps = {
  avatar?: ReactElement;          // → Figma BOOLEAN `Avatar`
  clickable?: boolean;            // (behavior-only, no Figma representation)
  color?:                         // → Figma VARIANT `Color`
    | 'default' | 'primary' | 'secondary'
    | 'error'   | 'info'    | 'success'   | 'warning';
  deleteIcon?: ReactElement;      // (designer swap-instance, no Figma property)
  disabled?: boolean;             // → Figma VARIANT `State=Disabled`
  icon?: ReactElement;            // → Figma BOOLEAN `Icon`
  label?: ReactNode;              // → Figma TEXT `Label`
  onDelete?: EventHandler;        // → Figma BOOLEAN `Delete` (visibility); handler is behavior-only
  size?: 'small' | 'medium';      // → Figma VARIANT `Size` (Medium-only published)
  skipFocusWhenDisabled?: boolean;// (behavior-only)
  variant?: 'filled' | 'outlined';// → Figma VARIANT `Variant`
};
```

### 9.2 Figma component summary

```
Component: <Chip>
File:      KQjP6W9Uw1PN0iipwQHyYn (MUI Library)
Frame:     Foundation Components / Chip (301:6271)

Variant axes (60 cells):
  Color    : Default | Primary | Error | Warning | Info | Success
  Variant  : Filled | Outlined
  State    : Enabled | Hovered | Focused | Pressed | Disabled
  (Size    : Medium-only published; Small lives in MUI runtime only)

Component properties:
  Icon          BOOLEAN        default false             Show 20×20 leading icon
  Icon Source   INSTANCE_SWAP  default <Icon>/Size=sm    Pick the icon component (property panel dropdown)
  Avatar        BOOLEAN        default false             Show 24×24 leading avatar (overrides Icon when both true)
  Avatar Source INSTANCE_SWAP  default <Avatar>          Pick the avatar component (property panel dropdown)
  Delete        BOOLEAN        default false             Show 18×18 trailing delete icon (TEXT × placeholder until Cancel glyph ships)
  Label         TEXT           default "Chip"            Hand-set Noto Sans TC Regular 12/18

Layout: root Auto Layout HORIZONTAL, height=32, padding=0/12/0/12 Filled (0/11/0/11 Outlined),
        itemSpacing=6 (matches MUI's measured 6 px slot↔label visible gap).

Default variant: Color=Default, Variant=Filled, State=Enabled, Size=Medium
Local-only bindings: every paint, stroke, effect, text style resolves to this file's local collection.
```

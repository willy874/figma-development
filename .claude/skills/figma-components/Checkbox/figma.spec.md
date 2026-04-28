---
name: figma-component-checkbox-spec
description: Figma component specification for `<Checkbox>` — design counterpart of the MUI `<Checkbox>` consumed by `src/stories/Checkbox.stories.tsx`. Documents the Color × Checked × Indeterminate × Size × State variant matrix, source-to-Figma mapping, and the token bindings that pin every glyph fill / halo paint to a named token. For runtime measurements see `storybook.render.md`; the design system catalogue lives at `figma-design-guide/design-token.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '1:7228'
figma_component_set_id: '1:7228'
---

# `<Checkbox>` Figma Component Specification

## 1. Overview

`<Checkbox>` is the Figma counterpart of the MUI `<Checkbox>` consumed in `src/stories/Checkbox.stories.tsx`. The package re-exports MUI directly — there is no in-repo wrapper — so the Figma component encodes the MUI prop surface (`color`, `size`, `checked`, `indeterminate`, `disabled`) plus the four interaction states MUI paints via the ripple subtree (`Enabled / Hovered / Focused / Pressed`).

The Figma cells already match this contract — every glyph fill and halo overlay is bound to a named variable in the MUI-Library file's local collection (`KQjP6W9Uw1PN0iipwQHyYn`). All seven MUI palette colors are encoded as the `Color` axis; the runtime equivalents come from the published `merak/seed/*` and `merak/alias/*` namespaces (see [`figma-design-guide`](../../figma-design-guide/design-token.md)). The component is **self-contained** — every binding resolves to a variable in this file's local collection so the library can be consumed without the 天璇 design-system file loaded next to it. _(Local-only sweep completed 2026-04-29 — see §7 issue 9.)_

| Aspect            | Value                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| Source story      | `src/stories/Checkbox.stories.tsx`                                                     |
| Underlying source | `@mui/material@^7.3.10` `Checkbox` (re-exported by this package, no wrapper)          |
| Figma file        | [MUI-Library](https://www.figma.com/design/KQjP6W9Uw1PN0iipwQHyYn) (`KQjP6W9Uw1PN0iipwQHyYn`) |
| Figma frame       | `<Checkbox>` (`1:7228`, `704 × 1104 px`) on the same page as `<CheckboxFormControl>`   |
| Component Set     | `<Checkbox>` (`1:7228`)                                                                |
| Total variants    | **258** (7 Color × 3 Checked/Indeterminate combos × 3 Sizes × 4 interaction States, plus a 6-cell Disabled coverage limited to `Color=Default × {Checked=False, True} × 3 Sizes`) |
| Glyph geometry    | `CheckBoxOutlineBlankIcon` / `CheckBoxIcon` / `IndeterminateCheckBoxIcon` (Material icon paths in `viewBox 0 0 24 24`) |

## 2. Source-to-Figma Property Mapping

| MUI prop                                    | Figma property      | Type    | Notes                                                                                                              |
| ------------------------------------------- | ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| `color`                                     | `Color`             | VARIANT | `Default` / `Primary` / `Secondary` / `Error` / `Warning` / `Info` / `Success`. Maps 1:1 to the MUI palette key (Merak `danger ↔ Error`). |
| `checked` _(true)_                          | `Checked`           | VARIANT | `true` → `Checked=True, Indeterminate=False`.                                                                      |
| `checked` _(false)_                         | `Checked`           | VARIANT | `false` → `Checked=False, Indeterminate=False` (or paired with `Indeterminate=True`).                              |
| `indeterminate`                             | `Indeterminate`     | VARIANT | `true` → `Indeterminate=True, Checked=False`. MUI suppresses the check glyph whenever `indeterminate` is set, so `Checked=True, Indeterminate=True` is **not** a published combo. |
| `size`                                      | `Size`              | VARIANT | `Small` / `Medium` (MUI native) / `Large` (Figma-only — see §7 issue 1).                                           |
| `disabled` / interaction-state class names  | `State`             | VARIANT | `Enabled` / `Hovered` / `Focused` / `Pressed` / `Disabled`. `Hovered` / `Focused` / `Pressed` are pseudo-class states encoded statically in Figma; runtime renders them via the ripple subtree on real interaction. |

> **No Code Connect mapping today.** Code Connect templates can be added later to wire the cell variant axes to MUI's prop names automatically (see `figma-code-connect` skill).
>
> **Figma property ids** (the `#NNNN:N` suffix Figma assigns) are not stable across re-publishes — never reference them outside this file's frontmatter.

### 2.1 Color value mapping

The Figma `Color` axis publishes the same seven values MUI's `<Checkbox>` accepts. Token names below are **Figma variable paths** in the local `merak` collection inside the MUI-Library file (mirrored from the published 天璇 catalogue). The `Hovered / Pressed` halo uses the seed catalogue's `4 %` overlay (`hover-bg` / `outline-hover`); the `Focused` halo uses the seed catalogue's `30 %` overlay (`focusVisible`) — the two states intentionally diverge so designers can visually distinguish a focus ring from a plain hover tint. MUI runtime paints both at the same `4 %`; see §7 issue 3 for the divergence.

| MUI `color` | Merak palette | Brand fill (checked / indeterminate) | Halo Hovered / Pressed (`4 %` α)  | Halo Focused (`30 %` α)              | Hex          |
| ----------- | ------------- | ------------------------------------ | --------------------------------- | ------------------------------------ | ------------ |
| `default`   | `default`     | `alias/colors/bg-active`             | `alias/colors/bg-outline-hover`   | `seed/neutral/focusVisible`          | `#000000 0.54α` / `#0000000A` / `#0000004D` |
| `primary`   | `primary`     | `seed/primary/main`                  | `seed/primary/hover-bg`           | `seed/primary/focusVisible`          | `#1976D2`    |
| `secondary` | `secondary`   | `seed/secondary/main`                | `seed/secondary/outline-hover`    | `seed/secondary/focusVisible`        | `#9C27B0`    |
| `error`     | `danger`      | `seed/danger/main`                   | `seed/danger/outline-hover`       | `seed/danger/focusVisible`           | `#D32F2F`    |
| `warning`   | `warning`     | `seed/warning/main`                  | `seed/warning/outline-hover`      | `seed/warning/focusVisible`          | `#ED6C02`    |
| `info`      | `info`        | `seed/info/main`                     | `seed/info/hover-bg`              | `seed/info/focusVisible`             | `#0288D1`    |
| `success`   | `success`     | `seed/success/main`                  | `seed/success/hover-bg`           | `seed/success/focusVisible`          | `#2E7D32` _(local token currently `#4CAF50` — see §7 issue 6)_ |

> **`Color=Default` does not tint the checked glyph.** Per MUI runtime (`storybook.render.md` §2), the default fill stays at `text.secondary` regardless of `Checked`. The Figma cells bind `Color=Default` checked / indeterminate to `alias/colors/bg-active` (`#000000 0.54α`, MUI `palette.action.active`) — slightly darker than runtime's `text.secondary` (`0.6α`) but visually indistinguishable. Drift in §7 issue 7.
>
> **Hovered / Pressed halo (4 %) ≠ Focused halo (30 %) in Figma.** The two states intentionally use different alphas so a designer hovering a focused checkbox can read which state is active. MUI runtime paints both at the same 4 %; see §7 issue 3.

## 3. Variant Property Matrix

```
Color × (Checked × Indeterminate, 3 published combos) × Size × State
Theoretical: 7 × 4 × 3 × 5  =  420 variants
Published  : 258 variants (sparse — see exclusions)
```

Per `Color × Size`:

- **Enabled / Hovered / Focused / Pressed** — three Checked/Indeterminate combos (`F/F`, `T/F`, `F/T`) × four states. `Color (7) × Combo (3) × Size (3) × State (4) = 252 cells`.
- **Disabled** — limited to `Color=Default × {Checked=False, True} × 3 sizes × State (1)`. `1 × 2 × 3 × 1 = 6 cells`.

Total `252 + 6 = 258` published variants.

| Property         | Default value | Options                                                                  |
| ---------------- | ------------- | ------------------------------------------------------------------------ |
| `Color`          | `Primary`     | `Default`, `Primary`, `Secondary`, `Error`, `Warning`, `Info`, `Success` |
| `Checked`        | `False`       | `False`, `True`                                                          |
| `Indeterminate`  | `False`       | `False`, `True`                                                          |
| `Size`           | `Medium`      | `Small`, `Medium`, `Large`                                               |
| `State`          | `Enabled`     | `Enabled`, `Hovered`, `Focused`, `Pressed`, `Disabled`                    |

Published-set exclusions (intentional — keep them in mind when picking instances):

- **`Indeterminate=True` is published only with `Checked=False`.** MUI suppresses the check glyph whenever `indeterminate` is set; the four-cell theoretical (`Checked×Indeterminate`) collapses to three published combos.
- **`State=Disabled` is published only with `Color=Default`.** MUI's `palette.action.disabled` is color-agnostic, so every other Color row would render identically. The Figma set keeps a single Default coverage for hygiene; designers should always pick `Color=Default, State=Disabled` regardless of the surrounding flow's brand color.
- **`Indeterminate=True, State=Disabled` is not published.** MUI runtime supports it, but the prior visual review elected to skip it until a feature explicitly asks. Track via §8 if needed.
- **`Color ≠ Default × State=Disabled` is not published** — same reason as the row above.

### 3.1 Component (non-variant) properties

`<Checkbox>` exposes no non-variant Figma properties. The check / dash glyph is part of the cell geometry and is not swappable; the click-target / label flow is owned by `<CheckboxFormControl>` (the wrapper component set). If a future revision exposes an `INSTANCE_SWAP` slot for the glyph, document it here.

## 4. Design Tokens

All paints, strokes, and surfaces bind to local variables in the MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`). Hex values appear in this document only as reference resolutions of the light theme — bind to the token, not the hex.

### 4.1 Sizing

`<Checkbox>` does not override MUI defaults; the Figma cell sizes mirror the runtime `getBoundingClientRect()` of `src/stories/Checkbox.stories.tsx` (see `storybook.render.md` §1, §4).

| Property                          | Small                  | Medium                 | Large _(Figma-only)_   |
| --------------------------------- | ---------------------- | ---------------------- | ---------------------- |
| Hit-target (Figma cell)           | `33 × 33 px`           | `36 × 36 px`           | `39 × 39 px`           |
| Hit-target (MUI runtime)          | `38 × 38 px`           | `42 × 42 px`           | `42 × 42 px` (fallback) |
| Internal glyph                    | `20 × 20 px`           | `24 × 24 px`           | `28 × 28 px` (extrapolated) |
| Glyph corner-radius (geometry)    | baked into the SVG path | same                  | same                   |
| Halo overlay diameter             | matches hit-target     | same                   | same                   |
| Halo overlay corner-radius        | `50 %` (circular)      | same                   | same                   |

Notes:

- The Figma hit-target uses tighter padding (`~6 px` instead of MUI's `9 px`) — a layout-convenience choice, not a runtime divergence. The visible glyph (`20 / 24 / 28 px`) is what designers compare against.
- **`Size=Large` is Figma-only.** MUI's `<Checkbox>` accepts only `small | medium`; passing `size="large"` falls back silently to `medium`. The Figma `Large` row is reference-only until a `size="large"` prop ships in MUI or a custom `sx` override is added.
- The halo is a same-size circle painted **behind** the SVG glyph on Hovered / Focused / Pressed. It is part of the Figma cell geometry; runtime paints it via `.MuiTouchRipple-root` only on real interaction.

### 4.2 Token bindings

One row per paint role. Bind the Figma fill / stroke to the variable name in **bold**.

| Role                                    | Token                                              | Notes                                                                                                                          |
| --------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Glyph fill — unchecked, all colors      | **`alias/colors/bg-active`** _(`#000000 0.54α`)_   | MUI `palette.action.active`. Color-agnostic — every `Checked=False, Indeterminate=False` cell paints this regardless of `Color`. Drift `+0.06α` vs runtime `text-sub` (`0.6α`) — see §7 issue 7. |
| Glyph fill — checked / indet., Default  | **`alias/colors/bg-active`**                       | Default does not tint.                                                                                                         |
| Glyph fill — checked / indet., Primary  | **`seed/primary/main`** _(`#1976D2`)_              | MUI `palette.primary.main`.                                                                                                    |
| Glyph fill — checked / indet., Secondary | **`seed/secondary/main`** _(`#9C27B0`)_           |                                                                                                                                |
| Glyph fill — checked / indet., Error    | **`seed/danger/main`** _(`#D32F2F`)_               | Merak `danger ↔ MUI error`.                                                                                                    |
| Glyph fill — checked / indet., Warning  | **`seed/warning/main`** _(`#ED6C02`)_              |                                                                                                                                |
| Glyph fill — checked / indet., Info     | **`seed/info/main`** _(`#0288D1`)_                 |                                                                                                                                |
| Glyph fill — checked / indet., Success  | **`seed/success/main`** _(canonical `#2E7D32`; local `#4CAF50` — see §7 issue 6)_ |                                                                                                |
| Glyph fill — Disabled (any color)       | **`alias/colors/text-disabled`** _(`#000000 0.38α`)_ | The Figma cells bind disabled glyphs to `text-disabled`, **not** `fg-disabled`. The Disabled row is published only at `Color=Default`, but the binding is color-agnostic. Drift vs runtime `palette.action.disabled` (`0.26α`) — see §7 issue 8. |
| Halo overlay — Hovered / Pressed, Default | **`alias/colors/bg-outline-hover`** _(`#000000 0.04α`)_ | MUI `palette.action.hover`. Same `4 %` overlay Standard / Filled buttons use.                                       |
| Halo overlay — Focused, Default         | **`seed/neutral/focusVisible`** _(`#000000 0.30α`)_ | Larger `30 %` overlay drawn behind the indicator on Focused.                                                                  |
| Halo overlay — Hovered / Pressed, Primary  | **`seed/primary/hover-bg`** _(`#1976D2 0.04α`)_ | The seed catalogue calls the `4 %` overlay `hover-bg` for primary / info / success.                                            |
| Halo overlay — Focused, Primary         | **`seed/primary/focusVisible`** _(`#1976D2 0.30α`)_ |                                                                                                                              |
| Halo overlay — Hovered / Pressed, Secondary  | **`seed/secondary/outline-hover`** _(`#9C27B0 0.04α`)_ | Same `4 %` overlay; the catalogue calls it `outline-hover` for secondary / danger / warning.                          |
| Halo overlay — Focused, Secondary       | **`seed/secondary/focusVisible`** _(`#9C27B0 0.30α`)_ |                                                                                                                            |
| Halo overlay — Hovered / Pressed, Error    | **`seed/danger/outline-hover`** _(`#D32F2F 0.04α`)_ |                                                                                                                              |
| Halo overlay — Focused, Error           | **`seed/danger/focusVisible`** _(`#D32F2F 0.30α`)_ |                                                                                                                                |
| Halo overlay — Hovered / Pressed, Warning  | **`seed/warning/outline-hover`** _(`#ED6C02 0.04α`)_ |                                                                                                                             |
| Halo overlay — Focused, Warning         | **`seed/warning/focusVisible`** _(`#ED6C02 0.30α`)_ |                                                                                                                              |
| Halo overlay — Hovered / Pressed, Info  | **`seed/info/hover-bg`** _(`#0288D1 0.04α`)_       |                                                                                                                                |
| Halo overlay — Focused, Info            | **`seed/info/focusVisible`** _(`#0288D1 0.30α`)_   |                                                                                                                                |
| Halo overlay — Hovered / Pressed, Success  | **`seed/success/hover-bg`** _(`#2E7D32 0.04α`)_ |                                                                                                                                |
| Halo overlay — Focused, Success         | **`seed/success/focusVisible`** _(`#2E7D32 0.30α`)_ |                                                                                                                              |
| Halo overlay — Disabled                 | _(transparent)_                                    | Disabled does not paint the halo.                                                                                              |

> **Pre-alpha'd seed tokens — do not stack `paint.opacity < 1`.** Every `seed/*/hover-bg`, `seed/*/outline-hover`, and `seed/*/focusVisible` already carries its alpha; pairing them with a Figma `paint.opacity < 1` flattens to `opacity = 1` on instance creation (see `figma-component-spec-guide` §4.4) and silently destroys the alpha. Bind directly; never re-alpha.
>
> **Hovered / Pressed (4 %) ≠ Focused (30 %) in Figma.** The Figma cells deliberately split the two halos at different alphas so a designer hovering a focused checkbox can read which state is active. MUI runtime paints both at the same 4 % overlay; see §7 issue 3.

### 4.3 State rules

One row per state, columns per `Checked / Indeterminate` combo. Bindings reference §4.2.

| State        | Unchecked                                    | Checked / Indeterminate                                              | Halo overlay                                                |
| ------------ | -------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Enabled**  | glyph `bg-active` _(`0.54α`)_                 | glyph `seed/<color>/main` (or `bg-active` for Default)              | transparent                                                 |
| **Hovered**  | unchanged from Enabled                       | unchanged from Enabled                                               | `4 %` overlay — `seed/<color>/{hover-bg, outline-hover}` (or `bg-outline-hover` for Default) |
| **Pressed**  | unchanged from Enabled                       | unchanged from Enabled                                               | same as Hovered _(`4 %` overlay)_                            |
| **Focused**  | unchanged from Enabled                       | unchanged from Enabled                                               | `30 %` overlay — `seed/<color>/focusVisible` (or `seed/neutral/focusVisible` for Default) |
| **Disabled** | glyph `text-disabled` _(`0.38α`)_            | glyph `text-disabled`                                                | transparent                                                 |

Notes:

- **Pressed = Hovered visually** in MUI 7.3.10 (no separate `:active` paint). The Figma cells inherit this — both states paint the same `4 %` overlay. Kept as a separate variant entry so a future tighter pressed binding (e.g. a darker `seed/<color>/hover`) can land without a variant explosion.
- **Focused diverges from Hovered/Pressed in Figma but not in runtime.** Figma uses `30 %` (`focusVisible` family); MUI runtime paints `4 %` (`hover` family) on `&.Mui-focusVisible`. See §7 issue 3.
- **Disabled is color-agnostic.** `text-disabled` (`0.38α`) replaces every themed paint. The published set covers Disabled only under `Color=Default` (see §3 exclusions), but the token binding is color-agnostic so future expansion does not require new tokens. The token is named `text-disabled` (catalogue role: typography) but is reused as the glyph fill here — same convention `<Button>` uses (`bg-disabled` for Outlined disabled border). The convention is: when a disabled paint role doesn't have its own token, reach for the matching `text-` / `bg-` member of the disabled family rather than minting a `fg-disabled` companion.
- **The halo is unconditional in Figma; runtime paints it only on real interaction.** A static Storybook cell with `.Mui-focusVisible` className alone does not show the halo because MUI's ripple subtree mounts only on real focus / hover. The Figma cell encodes the halo so designers can preview the interaction state without scripting; runtime users see the halo only when they actually focus / hover the field.

## 5. Icons

`<Checkbox>` does **not** consume the shared `<Icon>` component set — the three indicator glyphs are inlined as Material icon `<svg>` paths inside the cell:

| Glyph                     | Rendered when                          | Token (fill)                            | testid                       |
| ------------------------- | -------------------------------------- | --------------------------------------- | ---------------------------- |
| Unchecked rounded square  | `Checked=False, Indeterminate=False`   | `text-sub` (Enabled) / `fg-disabled` (Disabled) | `CheckBoxOutlineBlankIcon` |
| Checked filled square + ✓ | `Checked=True, Indeterminate=False`    | per-`Color` brand fill (see §4.2)       | `CheckBoxIcon`               |
| Indeterminate filled square + dash | `Checked=False, Indeterminate=True` | per-`Color` brand fill                | `IndeterminateCheckBoxIcon`  |

- **No `INSTANCE_SWAP` slot** for the glyph — designers must not detach to swap to a custom mark. If a feature needs a different mark (e.g. partial-success ✓), extend `<Checkbox>` upstream first and add a new `Indeterminate` axis option.
- **Visibility coupling** — `Checked=False, Indeterminate=False` shows the unchecked square; `Checked=True` shows the check; `Indeterminate=True` shows the dash. The Figma variants pre-bake this; there is no separate `Glyph` BOOLEAN property.
- **Runtime path data**: Material icon `viewBox 0 0 24 24` filled paths. Re-coloring the glyph means re-binding `fill` only — the path is a single shape with no stroke.

## 6. Layout

The Component Set is laid out as a flat grid inside the `<Checkbox>` frame (`1:7228`, `704 × 1104 px`):

- **Top band** — `Color × (Checked/Indeterminate 3-combos) × State (Hovered, Focused, Pressed)` at `Size=Medium` (`36 × 36` cells), 7 rows × 21 columns. Disabled cells (Default only) sit in a separate column block.
- **Mid band** — Same layout at `Size=Small` (`33 × 33` cells).
- **Bottom band** — Same layout at `Size=Large` (`39 × 39` cells).
- **Default Disabled** sits in its own block with `Color=Default × {Checked=False, True} × 3 sizes = 6` cells.

Cell composition:

- `Halo` (FRAME, circular) — same-size circle behind the glyph. Painted on Hovered / Focused / Pressed, transparent on Enabled / Disabled.
- `Glyph` (VECTOR — Material icon path) — the visible indicator. Fill rebinds per `Color × State` per §4.2.

Surrounding documentation in the outer frame:

- **Header** — title `<Checkbox>`, source story path, behavior summary.
- **Sibling frames** — `<CheckboxFormControl>` (`1:7367`) lives below in the same page, wrapping a nested `<Checkbox>` instance.

## 7. Usage Guidelines

### 7.1 Picking a variant

1. Map `color` from MUI to the Figma `Color` axis (`color="primary"` → `Color=Primary`; `color="error"` → `Color=Error`, etc.).
2. Map the runtime value: `checked === true` → `Checked=True, Indeterminate=False`; `checked === false` → `Checked=False, Indeterminate=False`; `indeterminate === true` → `Checked=False, Indeterminate=True`.
3. Pick `Size=Medium` to match the source's `1.5rem` indicator. `Small` for a `size="small"` field. `Large` only when a forthcoming `size="large"` prop ships (track via §8); today it falls back to Medium.
4. Pick `State`:
   - `Enabled` for resting production screens.
   - `Hovered` / `Focused` / `Pressed` only when illustrating interaction flows.
   - `Disabled` only with `Color=Default` (see §3).
5. **Don't compose the label here.** Use `<CheckboxFormControl>` (`1:7367`) for label + checkbox composition; this set ships the indicator only.

### 7.2 Don'ts

- ❌ Don't paint with hex — bind the Vector fill / Halo fill to the `seed/*` or `alias/*` token from §4.2.
- ❌ Don't pair `Checked=True` with `Indeterminate=True`. MUI suppresses the check glyph whenever `indeterminate` is set; the combo is **not** published.
- ❌ Don't combine `Color ≠ Default` with `State=Disabled`. Disabled is color-agnostic in MUI — pick `Color=Default, State=Disabled`.
- ❌ Don't stack `paint.opacity < 1` on top of `seed/*/hover-bg` / `seed/*/outline-hover` — they are pre-alpha'd at `0.04 α`.
- ❌ Don't detach the instance to recolor the indicator — pick the matching `Color` variant.
- ❌ Don't add a separate "label" text node inside this cell. The `<CheckboxFormControl>` wrapper owns label composition.

### 7.3 Open issues (drift)

Tracked here so the next runtime-truth pass has a punch list:

1. **`Size=Large` is synthetic.** MUI Checkbox supports `small | medium` only; `size="large"` falls back to `medium` silently. The Figma `Size=Large` row is reference-only until a real `size="large"` prop ships. Resolve by either (a) marking Large as design-only and noting it does not exist in runtime, or (b) introducing a custom `sx` override or upstream MUI patch.
2. **Hit-target box differs (Figma 33/36/39 vs. runtime 38/42/—).** The Figma cells use a tighter `~6 px` padding around the glyph compared to MUI's `9 px`. Layout-convenience choice; the visible glyph dimensions match. Accept-as-is unless a tighter pixel match is required.
3. **Focused halo (30 %) ≠ Hovered/Pressed halo (4 %) in Figma; runtime uses 4 % for both.** MUI 7.3.10 paints `palette.[color].main × 0.04` on both `:hover` and `&.Mui-focusVisible`. The Figma cells deliberately split the two (4 % for hover/pressed, 30 % for focused) so a designer hovering a focused checkbox can read which state is active. Resolve by either (a) keeping the Figma split and accepting the runtime divergence (current decision) or (b) repointing Focused to `seed/<color>/{hover-bg, outline-hover}` to match MUI. Tracked as a runtime-truth pass candidate.
4. **`Mui-focusVisible` className does not paint the halo statically.** Visual verification of the focus halo requires real keyboard focus; the Figma cell encodes the halo unconditionally. Expected difference between the two surfaces — accept-as-is.
5. **`Color=Default` checked uses `bg-active` (`0.54α`).** The default checked glyph is the same neutral as unchecked, not a primary tint. Confirmed against runtime — MUI paints `palette.text.secondary` (`0.6α`) for the default unchecked / checked glyph; the Figma cells bind `alias/colors/bg-active` (`palette.action.active`, `0.54α`) instead. Six-percent-α-darker than runtime; visually indistinguishable. Resolve by either (a) accepting the alpha difference (current decision) or (b) repointing `bg-active` → `text-sub` for this use site.
6. **~~Local `seed/success/main` resolves to `#4CAF50`, not the catalogue's `#2E7D32`.~~ Resolved 2026-04-29.** Pre-flight on 2026-04-29 found the *external* (consumed-library) `seed/success/main` at `#4CAF50`, but the *local* copy in `merak` was already canonical `#2E7D32`. The local-only sweep (issue 9) rebound every Success cell from external → local, so the renders now resolve to `#2E7D32` per runtime. Closed.
7. **Default unchecked glyph drift.** Same `bg-active` (`0.54α`) vs. runtime `text-sub` (`0.6α`) divergence as item 5. Resolve together.
8. **Disabled glyph uses `text-disabled` (`0.38α`); runtime uses `palette.action.disabled` (`0.26α`).** The Figma cells reach for the typography-family disabled token instead of the icon-family disabled token. Same convention `<Button>` uses (`bg-disabled` for Outlined disabled border). Twelve-percent-α-darker than runtime; visually distinguishable but acceptable since the design intent is "clearly greyed out." Resolve by either (a) accepting the alpha difference (current decision) or (b) minting a local `alias/colors/fg-disabled` (`#00000042`) and rebinding.
9. **~~Indicator paints (glyphs + unchecked rectangle fill / stroke) bind to external library variables, violating the local-only rule.~~ Resolved 2026-04-29.** Pre-flight on 2026-04-29 found **11** external `VariableID:<sharedKey>/...` references across both Checkbox + CheckboxFormControl: `alias/colors/{bg-default, bg-active, border-defalt(sic), text-default, text-disabled}` and `seed/{primary, secondary, danger, warning, info, success}/main`. The halo tokens were already fully local. The remediation `use_figma` pass:
    - Phase 0: minted 2 missing locals (`alias/colors/bg-active`, `seed/secondary/main`); the other 9 already existed in the local `merak` collection.
    - Phase 1: built an external→local id remap by name match.
    - Phase 2: rebound the Checkbox set — 258 fill rebinds + 87 stroke rebinds across 258 mutated cells.
    - Phase 3: rebound the CheckboxFormControl wrapper — 276 fill rebinds across 276 mutated cells.
    - Phase 4: verified — 0 external bindings remain (Checkbox 534 paints local + 2 unbound; CheckboxFormControl 648 paints local + 2 unbound).

    The MUI-Library file is now self-contained for `<Checkbox>` and `<CheckboxFormControl>`. Closed.

10. **~~Local `merak` collection is missing `seed/<color>/main`, `bg-active`, `bg-default`, `border-defalt`, `text-disabled`.~~ Resolved 2026-04-29.** Phase 0 of issue 9's resolution minted the 2 genuinely missing locals (`alias/colors/bg-active` `#0000008A`, `seed/secondary/main` `#9C27B0`). The other names listed earlier already existed in the collection — the original audit conflated *consumed-library bindings* with *local-collection membership*. The corrected reading is in issue 9's Phase 0/1 summary. Closed.

## 8. Source Sync Rule

This document and the source must move together. When **any** of the following changes:

1. `src/stories/Checkbox.stories.tsx` (variants, args, `color`/`size`/`disabled`/`indeterminate` wiring)
2. The Figma `<Checkbox>` component set at `1:7228` (variants, properties, token bindings)
3. The Figma `<CheckboxFormControl>` set at `1:7367` — any change to the nested instance contract here must mirror; see [`../CheckboxFormControl/figma.spec.md`](../CheckboxFormControl/figma.spec.md) §3
4. The shared `merak/seed/*`, `merak/alias/*` tokens consumed in §4.2 — particularly `seed/{primary,secondary,danger,warning,info,success}/{main,hover-bg,outline-hover}`, `alias/colors/{text-sub,fg-disabled,bg-outline-hover}`
5. `.storybook/preview.tsx` (theme overrides via `createTheme`) — today this is an empty `createTheme()`; introducing typography / palette / `MuiCheckbox.defaultProps` overrides forces a re-measure
6. `package.json` `@mui/material` peer / dev version (currently `^7.3.10` / peer `>=7`)

…this spec **must be updated in the same change**. Specifically:

- Adding a real `size="large"` prop in MUI (or a project-side `sx` override) → drop the Drift §7 issue 1 footnote, add per-size rows to `storybook.render.md` §4, validate the Figma `Size=Large` cells against new runtime numbers.
- Introducing a new `Color` value (e.g. `tertiary`) → add the row to §2.1 + §3 + §4.2, mint the local `seed/tertiary/{main,hover-bg}` variables (or alias them from the catalogue) before authoring.
- Adding `Indeterminate=True, State=Disabled` cells → expand §3 exclusions list and §4.3 row, regenerate the published variants.
- Token rename / removal in `merak/alias/*` or `merak/seed/*` → update every reference in §2, §4 and rename the matching variable in the local Figma collection.
- Token value change in any consumed token → no edit to this spec is required (Figma resolves through the same name); update the resolution chain in `../../figma-design-guide/design-token.md` if the catalogue moved.
- `@mui/material` major bump → re-run `storybook.render.md` §3 / §4 / §5 measurements; bump the version row in §1; reconcile any new computed-style values against §4.2.

## 9. Quick Reference

```ts
// Source surface (from `@mui/material` Checkbox, used directly in src/stories/Checkbox.stories.tsx)
type CheckboxProps = {
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
                                                            // → Figma `Color`
  size?: 'small' | 'medium';                                // → Figma `Size` (Small / Medium; Large is Figma-only)
  checked?: boolean;                                        // → Figma `Checked`
  indeterminate?: boolean;                                  // → Figma `Indeterminate` (suppresses check glyph)
  disabled?: boolean;                                       // → Figma `State=Disabled`
  // interaction state classes (.Mui-focusVisible, :hover, :active)
                                                            // → Figma `State ∈ {Hovered, Focused, Pressed}`
};
```

```
Figma Component Set: <Checkbox>  (1:7228)
  Variant axes : Color × Checked × Indeterminate × Size × State
  Properties   : (none — glyph is geometry, label is composed by <CheckboxFormControl>)
  Default      : Color=Primary, Checked=False, Indeterminate=False, Size=Medium, State=Enabled
  Total        : 258 published variants
                 (252 across Enabled/Hovered/Focused/Pressed at 7 colors × 3 value combos × 3 sizes;
                  + 6 Disabled cells at Color=Default × {Checked=False, True} × 3 sizes)
  Sparse rules : Indeterminate=True paired only with Checked=False;
                 Disabled limited to Color=Default;
                 Indeterminate=True+Disabled not published
```

## 10. Token Glossary

The complete set of tokens consumed by `<Checkbox>`. Names are **Figma variable paths**; bind every paint to one of these — never to a literal value.

### 10.1 Seed tokens (`merak/seed/*`, mirrored locally)

For each of the six themable color families (`primary | secondary | danger | warning | info | success`):

| Token suffix      | Used by                                       | Role                                                                       |
| ----------------- | --------------------------------------------- | -------------------------------------------------------------------------- |
| `/main`           | Glyph fill on `Checked=True` / `Indeterminate=True` | Brand color filling the indicator                                    |
| `/hover-bg`       | Halo overlay on Hovered / Pressed _(primary, info, success)_ | `4 %` tint behind the glyph                                  |
| `/outline-hover`  | Halo overlay on Hovered / Pressed _(secondary, danger, warning)_ | `4 %` tint — catalogue uses `outline-hover` for these families  |
| `/focusVisible`   | Halo overlay on Focused (all colors)          | `30 %` tint — visually distinguishes focus from hover                     |

Full names: `seed/primary/main`, `seed/primary/hover-bg`, `seed/primary/focusVisible`, `seed/secondary/main`, `seed/secondary/outline-hover`, `seed/secondary/focusVisible`, `seed/danger/main`, `seed/danger/outline-hover`, `seed/danger/focusVisible`, `seed/warning/main`, `seed/warning/outline-hover`, `seed/warning/focusVisible`, `seed/info/main`, `seed/info/hover-bg`, `seed/info/focusVisible`, `seed/success/main`, `seed/success/hover-bg`, `seed/success/focusVisible`. The `Color=Default` axis does not consume any seed family for the brand fill / 4% halo (see §10.2) — the Default Focused 30% halo uses `seed/neutral/focusVisible`.

### 10.2 Alias and neutral tokens (`merak/alias/colors/*` + `merak/seed/neutral/*`)

| Token                            | Used by                                                | Role                                                                  |
| -------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------- |
| `alias/colors/bg-active`         | Unchecked glyph (all colors) + checked Default glyph   | MUI `palette.action.active` (`#000000 0.54α`). Drift `+0.06α` darker than runtime `text.secondary`. |
| `alias/colors/text-disabled`     | Disabled glyph (any color, any value)                  | MUI `palette.text.disabled` (`#000000 0.38α`). Drift `+0.12α` darker than runtime `palette.action.disabled` (`0.26α`). |
| `alias/colors/bg-outline-hover`  | Halo overlay on `Color=Default` Hovered / Pressed      | MUI `palette.action.hover` (`#000000 0.04α`).                         |
| `seed/neutral/focusVisible`      | Halo overlay on `Color=Default` Focused                | `#000000 0.30α` — `30 %` neutral focus tint.                          |

> Preserve the typo `border-defalt` _(sic)_ in any reference; Checkbox does not consume it but other components in this file do.

### 10.3 Component-scoped tokens

`<Checkbox>` does **not** mint any component-scoped tokens — every paint resolves to a shared `seed/*` or `alias/*` token. If a future MUI revision diverges (e.g. introduces a `palette.[color].light × 0.20` halo on Pressed), mint the new value as a `component/checkbox/*` local in the MUI-Library file and document it in `design-token.md`.

### 10.4 Typography

`<Checkbox>` carries no text — typography lives on `<CheckboxFormControl>` (the wrapping component set). See [`../CheckboxFormControl/figma.spec.md`](../CheckboxFormControl/figma.spec.md) §4.2.

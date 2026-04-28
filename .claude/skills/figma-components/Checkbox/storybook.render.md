---
name: figma-component-checkbox-storybook-render
description: Computed-style matrix for `<Checkbox>` measured against `src/stories/Checkbox.stories.tsx` via Chrome DevTools MCP. Documents the runtime per-variant box / paint / glyph numbers across the Color × Checked/Indeterminate × Size × State surface. Companion to `figma.spec.md` (the contract) and `design-token.md` (component-scoped tokens).
parent_skill: figma-components
---

# `<Checkbox>` Storybook Render Measurements

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/Checkbox.stories.tsx`. Stories used: `ColorMatrix` (7 colors × 3 value combos at Size=Medium, State=Enabled), `StateMatrix` (3 states × 3 value combos at Color=Primary, Size=Medium), `SizeMatrix` (2 sizes × 3 value combos at Color=Primary, Enabled), `DisabledMatrix` (7 colors × 3 value combos all `disabled`). These are the runtime numbers a Figma authoring pass should reproduce; if Storybook output diverges from the Figma cells, treat it as a drift check (see §7) rather than silently rebinding.

## 1. Box invariants (all colors / all states)

`<Checkbox>` paints nothing on the wrapper itself — every visible pixel is the inner `<svg>` glyph plus the (interaction-only) ripple overlay. The wrapper's `42 × 42` (Medium) / `38 × 38` (Small) box is the **hit-target**, not the visible indicator.

| Property                    | Small                  | Medium                 |
| --------------------------- | ---------------------- | ---------------------- |
| Hit-target (`MuiCheckbox-root`) | `38 × 38 px`       | `42 × 42 px`           |
| Hit-target padding          | `9 px` on every side   | `9 px` on every side   |
| Hit-target border-radius    | `50 %` (circular ripple) | `50 %`               |
| Hit-target background       | `transparent` (resting) | `transparent`         |
| Inner glyph (`<svg>`)       | `20 × 20 px`           | `24 × 24 px`           |
| `font-size` on `<svg>`      | `20 px`                | `24 px`                |

Notes:

- The `42 × 42` box is the same width MUI gives `<IconButton>` at Medium; the `9 px` padding centers a `24 × 24` glyph and reserves room for the ripple's 50 % radius. The padding is **constant** across sizes, so Small's `38 × 38` box equals `20 + 2×9` exactly.
- The wrapper's `border-radius: 50 %` is what produces the circular ripple/halo — **not** an indicator outline. The visible "rounded square" comes from the SVG path geometry.
- No `box-shadow`, no `outline`, no `before` / `after` overlays at rest. Hover / focus halos are painted by the ripple subtree (`.MuiTouchRipple-root`) which mounts only on real interaction.

## 2. Color axis (Medium, Enabled, Color × Checked / Indeterminate)

`ColorMatrix` covers all seven `Color` values × three value combos (`unchecked`, `checked`, `indeterminate`). The unchecked glyph paint is **color-agnostic** — every row resolves to `text.secondary`. Only the checked / indeterminate glyph picks up the brand fill.

| Color (MUI) | Unchecked glyph fill   | Checked / Indeterminate glyph fill | Glyph testid (checked → indeterminate)               |
| ----------- | ---------------------- | ---------------------------------- | ---------------------------------------------------- |
| `default`   | `rgba(0, 0, 0, 0.6)`   | `rgba(0, 0, 0, 0.6)`               | `CheckBoxIcon` → `IndeterminateCheckBoxIcon`         |
| `primary`   | `rgba(0, 0, 0, 0.6)`   | `rgb(25, 118, 210)` (`#1976D2`)    | same                                                 |
| `secondary` | `rgba(0, 0, 0, 0.6)`   | `rgb(156, 39, 176)` (`#9C27B0`)    | same                                                 |
| `error`     | `rgba(0, 0, 0, 0.6)`   | `rgb(211, 47, 47)` (`#D32F2F`)     | same                                                 |
| `warning`   | `rgba(0, 0, 0, 0.6)`   | `rgb(237, 108, 2)` (`#ED6C02`)     | same                                                 |
| `info`      | `rgba(0, 0, 0, 0.6)`   | `rgb(2, 136, 209)` (`#0288D1`)     | same                                                 |
| `success`   | `rgba(0, 0, 0, 0.6)`   | `rgb(46, 125, 50)` (`#2E7D32`)     | same                                                 |

The unchecked glyph is `CheckBoxOutlineBlankIcon` for every color × every state. SVG `fill` always equals computed `color` — MUI uses `currentColor` for the path.

Notes:

- **`Color=Default` does not tint the checked glyph.** The default fill stays at `text.secondary` (`#000000` / `0.6α`) instead of resolving to a primary / grey hue. The Figma `Color=Default, Checked=True` cell should mirror this (a dark-neutral checked indicator), not a primary-blue checked indicator.
- The seven palette `*.main` values match the project's `merak/seed/{primary | secondary | danger | warning | info | success}/main` exactly (cross-reference `figma-design-guide/design-token.md` §1). MUI `error` ↔ Merak `seed/danger`.
- `secondary` (purple) has no Merak `seed/secondary/hover-bg` token in the catalogue — it uses `outline-hover` instead. This is a tokenizing convention, not a runtime difference.

## 3. State axis (Medium, Color=Primary, value combos)

`StateMatrix` covers `Enabled / Focused / Disabled` × three value combos. `Hovered` / `Pressed` are `:hover` / `:active` pseudo-class states; static `Mui-focusVisible` className applies the focus class but the ripple subtree only mounts under real keyboard focus (so the static cell renders identically to Enabled paint-wise).

| Property                         | Enabled              | Focused (static class)                 | Disabled                |
| -------------------------------- | -------------------- | -------------------------------------- | ----------------------- |
| Wrapper background (resting)     | transparent          | transparent                            | transparent             |
| Glyph fill — unchecked           | `rgba(0, 0, 0, 0.6)` | `rgba(0, 0, 0, 0.6)`                   | `rgba(0, 0, 0, 0.26)`   |
| Glyph fill — checked / indet.    | `rgb(25, 118, 210)`  | `rgb(25, 118, 210)`                    | `rgba(0, 0, 0, 0.26)`   |
| Halo overlay (real `:focus-visible` only) | n/a              | `palette.[color].main × 0.04` (per MUI source) | n/a                |
| Halo overlay (real `:hover` only)| n/a                  | n/a                                    | n/a                     |

Halo paint rules — measured from `Checkbox` styles in MUI 7.3.10 (`@mui/material/Checkbox/Checkbox.js`):

```
// Unchecked
&:hover, &.Mui-focusVisible { backgroundColor: palette.action.active × hoverOpacity = #0000000A }

// Checked or indeterminate, color !== 'default'
&.Mui-checked:hover, &.MuiCheckbox-indeterminate:hover, ...&.Mui-focusVisible { backgroundColor: palette.[color].main × hoverOpacity }
```

Per-color resolutions:

| Color       | Resting halo fill                    | Hover / Focus halo fill (`× 0.04`)             |
| ----------- | ------------------------------------ | ---------------------------------------------- |
| Unchecked, all | transparent                       | `#0000000A` (= `palette.action.hover`)         |
| `default` checked / indet. | transparent             | `#0000000A`                                    |
| `primary` checked / indet. | transparent             | `#1976D20A`                                    |
| `secondary` checked / indet. | transparent           | `#9C27B00A`                                    |
| `error` checked / indet.   | transparent             | `#D32F2F0A`                                    |
| `warning` checked / indet. | transparent             | `#ED6C020A`                                    |
| `info` checked / indet.    | transparent             | `#0288D10A`                                    |
| `success` checked / indet. | transparent             | `#2E7D320A`                                    |

Notes:

- **Disabled is color-agnostic.** Glyph fill resolves to `palette.action.disabled` (`#00000042`) regardless of the `color` prop — this is why the Figma set publishes Disabled only under `Color=Default` (every other color row would render identically). Spec §3 records this exclusion.
- **Focused never paints inside the indicator.** Only the ripple/halo behind the box changes; the SVG glyph keeps its Enabled color. A Figma cell that recolors the indicator on `State=Focused` is a spec bug.
- **`Mui-focusVisible` className alone does not paint the halo in static Storybook.** MUI's focus halo lives on the ripple element which only mounts under real keyboard focus. Visual verification of the halo requires real interaction or `storybook-addon-pseudo-states`.
- **Pressed = Hovered visually** in MUI (no separate `:active` paint). The Figma `State=Pressed` cell carries the same halo as `State=Hovered`; if a future version introduces a darker pressed bg, sync the spec §4 state table.

## 4. Size axis (Color=Primary, Enabled, value combos)

`SizeMatrix` confirms small / medium across all three value combos. Glyph testid + path geometry stay constant; only the box / SVG dimensions change.

| Property                        | Small             | Medium             |
| ------------------------------- | ----------------- | ------------------ |
| Hit-target (`MuiCheckbox-root`) | `38 × 38 px`      | `42 × 42 px`       |
| Hit-target padding              | `9 px`            | `9 px`             |
| Inner glyph (`<svg>`)           | `20 × 20 px`      | `24 × 24 px`       |
| `font-size` on `<svg>`          | `20 px`           | `24 px`            |

The Figma cells publish three sizes (`Small`, `Medium`, `Large`); MUI runtime publishes only `small` and `medium`. The Figma `Size=Large` cell **falls back to Medium** when `size="large"` is passed — MUI silently accepts unknown size values as `medium`. Drift logged in `figma.spec.md` §7 issue 1.

Figma cell sizes for context:

| Figma `Size` | Figma cell (px) | Runtime equivalent | Drift           |
| ------------ | --------------- | ------------------ | --------------- |
| Small        | `33 × 33`       | `38 × 38`          | -5 px (smaller hit-target, same glyph) |
| Medium       | `36 × 36`       | `42 × 42`          | -6 px           |
| Large        | `39 × 39`       | `42 × 42` (fallback) | reference-only |

The Figma cells render a tighter hit-target (~6 px less padding on each side) than runtime — this is a layout-convenience choice in Figma, not a runtime divergence. The visible glyph (the part designers care about) is `20 / 24` px in both worlds at Small / Medium.

## 5. Disabled coverage (DisabledMatrix)

`DisabledMatrix` renders all 7 × 3 value combos with `disabled`. Every cell — regardless of `color` — paints the glyph at `rgba(0, 0, 0, 0.26)` (`palette.action.disabled`). The wrapper background, the SVG geometry, and the testid are all unchanged; only the fill darkens / lightens. This validates the Figma set's "Disabled limited to `Color=Default`" exclusion (spec §3).

## 6. Glyph references

Glyphs are MUI Material icon paths embedded in `<svg viewBox="0 0 24 24">`. MUI selects which glyph to render based on `checked` / `indeterminate`:

| Value combo                             | Glyph testid                  | Path D snippet                            |
| --------------------------------------- | ----------------------------- | ----------------------------------------- |
| `unchecked` (`{checked:false, indeterminate:false}`) | `CheckBoxOutlineBlankIcon` | `M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2…` |
| `checked` (`{checked:true, indeterminate:false}`)    | `CheckBoxIcon`             | `M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2…` |
| `indeterminate` (`{checked:_, indeterminate:true}`)  | `IndeterminateCheckBoxIcon`| `M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2…` |

When `indeterminate=true`, MUI suppresses the check glyph regardless of `checked` — the Figma `Indeterminate=True, Checked=True` combo is intentionally not published (spec §3). The path is a single filled shape; there is no separate stroke + fill. Re-coloring the glyph means re-binding `fill` only.

## 7. Drift checks (Storybook ↔ Figma)

Open divergences flagged for the `figma.spec.md` §7 list:

1. **`Size=Large` is a synthetic axis.** MUI Checkbox does not ship a Large size; passing `size="large"` falls back to `medium` (no warning, no error). The Figma `Size=Large` cell publishes a `39 × 39` hit-target with a glyph slightly larger than Medium's `24 × 24`. Resolve by either (a) marking Large as design-only and noting it does not exist in runtime, or (b) introducing a custom `sx` override + new `Size` axis in `<Checkbox>`.
2. **Hit-target box differs (Figma 33/36/39 vs. runtime 38/42/—).** The Figma cells use a tighter `~6 px` padding around the glyph compared to MUI's `9 px`. This is a layout-convenience choice and does not affect the visible indicator. Document the Figma values in spec §4.1 with a "Figma cell padding ≠ runtime padding" note.
3. **Halo overlay paint.** The hover / focus halo paints `palette.[color].main × 0.04` at runtime (e.g. `#1976D20A` for Primary). The Figma cells encode this as a same-size circular fill behind the SVG. If the Figma cell uses a token whose hex resolves differently (e.g. `seed/primary/hover-bg`), confirm it equals `#1976D20A`; if not, re-bind to `palette.[color].main × 0.04` directly.
4. **Default checked stays neutral.** MUI's `color="default"` paints `text.secondary` (`rgba(0,0,0,0.6)`) in both unchecked and checked states. Confirm the Figma `Color=Default, Checked=True` cell does not accidentally tint the indicator — a stray bind to `seed/primary/main` would be a regression.
5. **`Mui-focusVisible` className does not paint the halo statically.** Visual verification of the focus halo requires real keyboard focus (or `storybook-addon-pseudo-states`); the static Storybook cell looks identical to Enabled. The Figma cell encodes the halo unconditionally, so this is an expected difference between the two surfaces.

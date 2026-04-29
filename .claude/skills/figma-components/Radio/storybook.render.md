---
name: figma-component-radio-storybook-render
description: Computed-style matrix for `<Radio>` measured against `src/stories/Radio.stories.tsx` via Chrome DevTools MCP. Documents the runtime per-variant box / paint / glyph numbers across the Color × Checked × Size × State surface. Companion to `figma.spec.md` (the contract); `<Radio>` introduces no component-scoped tokens.
parent_skill: figma-components
---

# `<Radio>` Storybook Render Measurements

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/Radio.stories.tsx`. Stories used: `ColorMatrix` (7 colors × 2 value combos at Size=Medium, State=Enabled), `StateMatrix` (3 states × 2 value combos at Color=Primary, Size=Medium), `SizeMatrix` (2 sizes × 2 value combos at Color=Primary, Enabled), `DisabledMatrix` (7 colors × 2 value combos all `disabled`). These are the runtime numbers a Figma authoring pass should reproduce; if Storybook output diverges from the Figma cells, treat it as a drift check (see §7) rather than silently rebinding.

## 1. Box invariants (all colors / all states)

`<Radio>` paints nothing on the wrapper itself — every visible pixel is the inner `<svg>` glyph stack plus the (interaction-only) ripple overlay. The wrapper's `42 × 42` (Medium) / `38 × 38` (Small) box is the **hit-target**, not the visible indicator.

| Property                    | Small                  | Medium                 |
| --------------------------- | ---------------------- | ---------------------- |
| Hit-target (`MuiRadio-root`) | `38 × 38 px`          | `42 × 42 px`           |
| Hit-target padding          | `9 px` on every side   | `9 px` on every side   |
| Hit-target border-radius    | `50 %` (circular ripple) | `50 %`               |
| Hit-target background       | `transparent` (resting) | `transparent`         |
| Inner glyph (`<svg>`)       | `20 × 20 px`           | `24 × 24 px`           |
| `font-size` on `<svg>`      | `20 px`                | `24 px`                |

Notes:

- `<Radio>` renders **two** stacked `<svg>` icons inside a `position: relative` indicator span — `RadioButtonUncheckedIcon` (outer ring) and `RadioButtonCheckedIcon` (inner filled dot). MUI animates `transform: scale()` on the inner icon: `matrix(0,0,0,0,0,0)` (scale 0) when unchecked, `matrix(1,0,0,1,0,0)` (scale 1) when checked. The outer ring is always at scale 1.
- The `42 × 42` box is the same width MUI gives `<Checkbox>` / `<IconButton>` at Medium; the `9 px` padding centers a `24 × 24` glyph and reserves room for the ripple's 50 % radius. The padding is **constant** across sizes, so Small's `38 × 38` box equals `20 + 2×9` exactly.
- The wrapper's `border-radius: 50 %` is what produces the circular ripple/halo — **not** an indicator outline. The visible "ring + dot" comes from the SVG path geometry.
- No `box-shadow`, no `outline`, no `before` / `after` overlays at rest. Hover / focus halos are painted by the ripple subtree (`.MuiTouchRipple-root`) which mounts only on real interaction.

## 2. Color axis (Medium, Enabled, Color × Checked)

`ColorMatrix` covers all seven `Color` values × two value combos (`unchecked`, `checked`). The unchecked glyph paint is **color-agnostic** — every row resolves to `text.secondary`. Only the checked glyph picks up the brand fill.

| Color (MUI) | Unchecked glyph fill   | Checked glyph fill              | Glyph testid (unchecked / checked overlay)              |
| ----------- | ---------------------- | ------------------------------- | ------------------------------------------------------- |
| `default`   | `rgba(0, 0, 0, 0.6)`   | `rgba(0, 0, 0, 0.6)`            | `RadioButtonUncheckedIcon` / `RadioButtonCheckedIcon`   |
| `primary`   | `rgba(0, 0, 0, 0.6)`   | `rgb(25, 118, 210)` (`#1976D2`) | same                                                    |
| `secondary` | `rgba(0, 0, 0, 0.6)`   | `rgb(156, 39, 176)` (`#9C27B0`) | same                                                    |
| `error`     | `rgba(0, 0, 0, 0.6)`   | `rgb(211, 47, 47)` (`#D32F2F`)  | same                                                    |
| `warning`   | `rgba(0, 0, 0, 0.6)`   | `rgb(237, 108, 2)` (`#ED6C02`)  | same                                                    |
| `info`      | `rgba(0, 0, 0, 0.6)`   | `rgb(2, 136, 209)` (`#0288D1`)  | same                                                    |
| `success`   | `rgba(0, 0, 0, 0.6)`   | `rgb(46, 125, 50)` (`#2E7D32`)  | same                                                    |

The unchecked outer ring uses `currentColor` for the SVG `fill`; the inner checked dot is the same `currentColor` on the second SVG. Both SVGs always render at full opacity — the inner dot's `transform: scale(0|1)` is what produces the visual on/off.

Notes:

- **`Color=Default` does not tint the checked glyph.** The default fill stays at `text.secondary` (`#000000` / `0.6α`) instead of resolving to a primary / grey hue. The Figma `Color=Default, Checked=True` cell should mirror this (a dark-neutral checked indicator), not a primary-blue checked indicator.
- The seven palette `*.main` values match the project's `merak/seed/{primary | secondary | danger | warning | info | success}/main` exactly (cross-reference `figma-design-guide/design-token.md`). MUI `error` ↔ Merak `seed/danger`.
- `secondary` (purple) has no Merak `seed/secondary/hover-bg` token in the catalogue — it uses `outline-hover` instead. This is a tokenizing convention, not a runtime difference.

## 3. State axis (Medium, Color=Primary, value combos)

`StateMatrix` covers `Enabled / Focused / Disabled` × two value combos. `Hovered` / `Pressed` are `:hover` / `:active` pseudo-class states; static `Mui-focusVisible` className applies the focus class but the ripple subtree only mounts under real keyboard focus (so the static cell renders identically to Enabled paint-wise).

| Property                         | Enabled              | Focused (static class)                 | Disabled                |
| -------------------------------- | -------------------- | -------------------------------------- | ----------------------- |
| Wrapper background (resting)     | transparent          | transparent                            | transparent             |
| Glyph fill — unchecked           | `rgba(0, 0, 0, 0.6)` | `rgba(0, 0, 0, 0.6)`                   | `rgba(0, 0, 0, 0.26)`   |
| Glyph fill — checked             | `rgb(25, 118, 210)`  | `rgb(25, 118, 210)`                    | `rgba(0, 0, 0, 0.26)`   |
| Halo overlay (real `:focus-visible` only) | n/a       | `palette.[color].main × 0.04` (per MUI source) | n/a              |
| Halo overlay (real `:hover` only)| n/a                  | n/a                                    | n/a                     |

Halo paint rules — measured from `Radio` styles in MUI 7.3.10 (`@mui/material/Radio/Radio.js`, identical pattern to Checkbox):

```
// Unchecked
&:hover, &.Mui-focusVisible { backgroundColor: palette.action.active × hoverOpacity = #0000000A }

// Checked, color !== 'default'
&.Mui-checked:hover, ...&.Mui-focusVisible { backgroundColor: palette.[color].main × hoverOpacity }
```

Per-color resolutions:

| Color       | Resting halo fill                    | Hover / Focus halo fill (`× 0.04`)             |
| ----------- | ------------------------------------ | ---------------------------------------------- |
| Unchecked, all | transparent                       | `#0000000A` (= `palette.action.hover`)         |
| `default` checked  | transparent                     | `#0000000A`                                    |
| `primary` checked  | transparent                     | `#1976D20A`                                    |
| `secondary` checked | transparent                    | `#9C27B00A`                                    |
| `error` checked    | transparent                     | `#D32F2F0A`                                    |
| `warning` checked  | transparent                     | `#ED6C020A`                                    |
| `info` checked     | transparent                     | `#0288D10A`                                    |
| `success` checked  | transparent                     | `#2E7D320A`                                    |

Notes:

- **Disabled is color-agnostic.** Glyph fill resolves to `palette.action.disabled` (`#00000042`) regardless of the `color` prop — this is why the Figma set publishes Disabled only under `Color=Default` (every other color row would render identically). Spec §3 records this exclusion.
- **Focused never paints inside the indicator.** Only the ripple/halo behind the box changes; the inner SVG stack keeps its Enabled color.
- **`Mui-focusVisible` className alone does not paint the halo in static Storybook.** MUI's focus halo lives on the ripple element which only mounts under real keyboard focus. Visual verification of the halo requires real interaction or `storybook-addon-pseudo-states`.
- **Pressed = Hovered visually** in MUI 7.3.10 (no separate `:active` paint). The Figma `State=Pressed` cell carries the same halo as `State=Hovered`.

## 4. Size axis (Color=Primary, Enabled, value combos)

`SizeMatrix` confirms small / medium across both value combos. Glyph testid + path geometry stay constant; only the box / SVG dimensions change.

| Property                        | Small             | Medium             |
| ------------------------------- | ----------------- | ------------------ |
| Hit-target (`MuiRadio-root`)    | `38 × 38 px`      | `42 × 42 px`       |
| Hit-target padding              | `9 px`            | `9 px`             |
| Inner glyph (`<svg>`)           | `20 × 20 px`      | `24 × 24 px`       |
| `font-size` on `<svg>`          | `20 px`           | `24 px`            |

The Figma cells publish three sizes (`Small`, `Medium`, `Large`); MUI runtime publishes only `small` and `medium`. The Figma `Size=Large` cell **falls back to Medium** when `size="large"` is passed — MUI silently accepts unknown size values as `medium`. Drift logged in `figma.spec.md` §7 issue 1.

Figma cell sizes for context (mirror Checkbox conventions):

| Figma `Size` | Figma cell (px) | Runtime equivalent | Drift           |
| ------------ | --------------- | ------------------ | --------------- |
| Small        | `33 × 33`       | `38 × 38`          | -5 px (smaller hit-target, same glyph) |
| Medium       | `36 × 36`       | `42 × 42`          | -6 px           |
| Large        | `39 × 39`       | `42 × 42` (fallback) | reference-only |

The Figma cells render a tighter hit-target (~6 px less padding on each side) than runtime — this is a layout-convenience choice in Figma, not a runtime divergence. The visible glyph (the part designers care about) is `20 / 24` px in both worlds at Small / Medium.

## 5. Disabled coverage (DisabledMatrix)

`DisabledMatrix` renders all 7 × 2 value combos with `disabled`. Every cell — regardless of `color` — paints the glyph at `rgba(0, 0, 0, 0.26)` (`palette.action.disabled`). The wrapper background, the SVG geometry, and the testid are all unchanged; only the fill darkens / lightens. This validates the Figma set's "Disabled limited to `Color=Default`" exclusion (spec §3).

## 6. Glyph references

Glyphs are MUI Material icon paths embedded in `<svg viewBox="0 0 24 24">`. MUI stacks two SVGs inside the indicator span and animates the inner one's `transform: scale()`:

| Slot                               | Glyph testid                | Path D snippet                            |
| ---------------------------------- | --------------------------- | ----------------------------------------- |
| Outer ring (always rendered)       | `RadioButtonUncheckedIcon`  | `M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z` |
| Inner dot (visible when checked)   | `RadioButtonCheckedIcon`    | `M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z` |

The path is a single filled shape per SVG; there is no separate stroke + fill. Re-coloring the glyph means re-binding `fill` (or, equivalently, the inherited `color`) only.

## 7. Drift checks (Storybook ↔ Figma)

Open divergences flagged for the `figma.spec.md` §7 list:

1. **`Size=Large` is a synthetic axis.** MUI Radio does not ship a Large size; passing `size="large"` falls back to `medium` (no warning, no error). The Figma `Size=Large` cell publishes a `39 × 39` hit-target with a glyph slightly larger than Medium's `24 × 24`. Resolve by either (a) marking Large as design-only and noting it does not exist in runtime, or (b) introducing a custom `sx` override + new `Size` axis in `<Radio>`.
2. **Hit-target box differs (Figma 33/36/39 vs. runtime 38/42/—).** The Figma cells use a tighter `~6 px` padding around the glyph compared to MUI's `9 px`. This is a layout-convenience choice and does not affect the visible indicator. Document the Figma values in spec §4.1 with a "Figma cell padding ≠ runtime padding" note.
3. **Halo overlay paint.** The hover / focus halo paints `palette.[color].main × 0.04` at runtime (e.g. `#1976D20A` for Primary). The Figma cells encode this as a same-size circular fill behind the SVG stack. If the Figma cell uses a token whose hex resolves differently (e.g. `seed/primary/hover-bg`), confirm it equals `#1976D20A`; if not, re-bind to `palette.[color].main × 0.04` directly. (Mirrors the Checkbox decision to use a 30 %-α `focusVisible` halo for the Focused row — see Checkbox spec §7 issue 3.)
4. **Default checked stays neutral.** MUI's `color="default"` paints `text.secondary` (`rgba(0,0,0,0.6)`) in both unchecked and checked states. Confirm the Figma `Color=Default, Checked=True` cell does not accidentally tint the indicator — a stray bind to `seed/primary/main` would be a regression.
5. **`Mui-focusVisible` className does not paint the halo statically.** Visual verification of the focus halo requires real keyboard focus (or `storybook-addon-pseudo-states`); the static Storybook cell looks identical to Enabled. The Figma cell encodes the halo unconditionally, so this is an expected difference between the two surfaces.
6. **Disabled glyph alpha.** MUI runtime paints disabled at `0.26α` (`palette.action.disabled`). The Figma cells follow the Checkbox convention and bind disabled to `alias/colors/text-disabled` (`0.38α`) — twelve-percent-α-darker than runtime; visually distinguishable but acceptable as "clearly greyed out." Resolve together with Checkbox §7 issue 8.

---
name: figma-component-checkbox-form-control-storybook-render
description: Computed-style matrix for `<CheckboxFormControl>` (the `<FormControlLabel>` + `<Checkbox>` composition) measured against `src/stories/CheckboxFormControl.stories.tsx` via Chrome DevTools MCP. Documents the per-LabelPlacement layout, label typography, and disabled coloring on top of the inner `<Checkbox>` numbers (which are recorded in `../Checkbox/storybook.render.md`). Companion to `figma.spec.md`.
parent_skill: figma-components
---

# `<CheckboxFormControl>` Storybook Render Measurements

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/CheckboxFormControl.stories.tsx`. Stories used: `PlacementMatrix` (4 placements × 3 value combos at Color=Primary, Size=Medium, Enabled), `ColorMatrix` (7 colors × 3 value combos at LabelPlacement=End, Medium, Enabled), `SizeMatrix` (2 sizes × 3 value combos at LabelPlacement=End, Color=Primary, Enabled), `StateMatrix` (Enabled / Disabled × 3 value combos at LabelPlacement=End, Color=Primary, Medium). The inner indicator's box / paint / glyph numbers come from `../Checkbox/storybook.render.md` — this document only records the **wrapper layer** (`<FormControlLabel>` + label text).

## 1. Wrapper layout invariants (Medium, Enabled)

`FormControlLabel` is a `<label>` with `display: inline-flex`, `align-items: center`, and an asymmetric outer margin that compensates for the inner Checkbox's `9 px` padding so the visible indicator aligns with the label baseline. There is **no `gap`** — the visual spacing between indicator and text is the Checkbox's right padding (9 px) bleeding through.

| Property                               | LabelPlacement=End          | LabelPlacement=Start          | LabelPlacement=Top                  | LabelPlacement=Bottom               |
| -------------------------------------- | --------------------------- | ----------------------------- | ----------------------------------- | ----------------------------------- |
| `flex-direction`                       | `row`                       | `row-reverse`                 | `column-reverse`                    | `column`                            |
| `align-items`                          | `center`                    | `center`                      | `center`                            | `center`                            |
| `gap`                                  | `normal` (no flex gap)      | same                          | same                                | same                                |
| Outer margin (T R B L)                 | `0 16 0 -11 px`             | `0 -11 0 16 px`               | `0 16 0 16 px`                      | `0 16 0 16 px`                      |
| Wrapper width  (label="Label", Medium) | `81.9 px`                   | `81.9 px`                     | `42 px` (matches indicator)         | `42 px`                             |
| Wrapper height (label="Label", Medium) | `42 px`                     | `42 px`                       | `66 px` (24 indicator + 24 line)    | `66 px`                             |
| Visible indicator-to-label gap         | `9 px` (Checkbox padding)   | `9 px`                        | `0 px` (vertical stack)             | `0 px`                              |

Notes:

- **The outer `-11 px` margin is intentional** — it pulls the wrapper's leading edge back so the indicator (`24 × 24` glyph centred in a `42 × 42` hit-target with `9 px` padding) lines up with the start of the surrounding text column. Without it, every checkbox row in a form would visually inset by `~11 px`. Drop the negative margin only when the wrapping layout already leaves room (e.g. inside an `<FormGroup>` that handles its own indentation).
- **`+16 px` on the trailing edge** is MUI's default for "give the next form control air to breathe." It is part of `FormControlLabel`, not the indicator — Figma cells should encode it on the wrapper component set, not on the inner `<Checkbox>`.
- **`Top` / `Bottom` use balanced `±16 px` left/right margins.** No leading negative margin because the indicator is centred horizontally within the column instead of starting it.
- **No `gap`.** The visual ~9 px breathing room between indicator and label text comes from the inner Checkbox's `padding-right` (Medium) / `padding-bottom` (Top); it is **not** an `itemSpacing` value Figma can copy verbatim. The Figma cells encode this as a real auto-layout `itemSpacing` — recommend `gap=4 px` (matches the project's `gap-1`) and absorb the runtime drift in spec §7.

## 2. Label typography (all placements / colors)

Label text uses MUI's `body1` Typography. Drift between MUI runtime and the design-guide `material-design/typography/body1` text style is sub-pixel (`24 px` line-height in both; Roboto vs. Noto Sans TC depending on locale).

| Property                         | Value (Enabled)                       | Value (Disabled)                  |
| -------------------------------- | ------------------------------------- | --------------------------------- |
| `font-family`                    | `Roboto, Helvetica, Arial, sans-serif` | same                              |
| `font-weight`                    | `400`                                 | same                              |
| `font-size`                      | `16 px`                               | same                              |
| `line-height`                    | `24 px`                               | same                              |
| `letter-spacing`                 | `0.15008 px` (≈ `0.15 px`)            | same                              |
| `text-transform`                 | none                                  | none                              |
| `color`                          | `rgba(0, 0, 0, 0.87)` (`text.primary`) | `rgba(0, 0, 0, 0.38)` (`text.disabled`) |
| `opacity`                        | `1`                                   | `1` (color encodes the disabled fade) |
| Margins (T R B L)                | `0 px` on every side                  | same                              |

Notes:

- **Disabled is a `color` swap, not an `opacity` swap.** `palette.text.disabled` (`#00000061`) is already alpha-baked. The Figma cell should bind label text to a token resolving to `#00000061` for `State=Disabled` and `#000000DE` (= `text.primary`, **not** `text.secondary`) for `State=Enabled`.
- **`letter-spacing: 0.15008 px`** is MUI's float-converted `0.00938em × 16 px`. Figma should use `0.15 px` — the sub-pixel delta is invisible.
- The label color is **`text.primary`** (87 % black), not `text.secondary` (60 %) or any seed color. Color-axis variants do not retint the label — only the indicator picks up the brand color.

## 3. Color axis on the wrapper (LabelPlacement=End, Medium, Enabled)

Confirms the wrapper layer is **color-agnostic**: every label across the seven colors paints `rgba(0, 0, 0, 0.87)`. Only the inner `<Checkbox>` glyph picks up `palette.[color].main` (see `../Checkbox/storybook.render.md` §2). A Figma cell that retints the label per `Color` axis is a spec bug.

## 4. Size axis on the wrapper (LabelPlacement=End, Color=Primary, Enabled)

Confirms the wrapper height tracks the inner Checkbox hit-target:

| Size   | Wrapper height | Inner Checkbox hit-target | Label font (unchanged) |
| ------ | -------------- | ------------------------- | ---------------------- |
| Small  | `38 px`        | `38 × 38 px`              | `16 / 24 px`           |
| Medium | `42 px`        | `42 × 42 px`              | `16 / 24 px`           |

Label font does **not** scale with `Size`. Only the indicator + the wrapper's height shrink. The Figma `Size=Small` cell should keep `body1` text but render the inner `<Checkbox>` instance at `Size=Small`.

## 5. State axis on the wrapper (LabelPlacement=End, Color=Primary, Medium)

| Property                      | Enabled                       | Disabled                          |
| ----------------------------- | ----------------------------- | --------------------------------- |
| Wrapper layout / margins      | unchanged                     | unchanged                         |
| Label color                   | `rgba(0, 0, 0, 0.87)`         | `rgba(0, 0, 0, 0.38)`             |
| Inner Checkbox glyph fill     | `rgb(25, 118, 210)` (Primary checked) | `rgba(0, 0, 0, 0.26)` (action.disabled) |
| Cursor (label)                | `pointer` (inherited)         | `default` / `not-allowed`         |

The wrapper itself never paints a hover / focus halo — only the inner Checkbox does. `Hovered / Focused / Pressed` therefore have **no wrapper-level** runtime delta. The Figma `<CheckboxFormControl>` set publishes only `Enabled / Disabled` (spec §3); reach for the bare `<Checkbox>` set + a manually-composed label when those interaction states are needed.

## 6. Drift checks (Storybook ↔ Figma)

Open divergences flagged for the `figma.spec.md` §7 list:

1. **No flex `gap` at runtime; Figma uses an `itemSpacing`.** MUI relies on the inner Checkbox's `9 px` padding to space the indicator from the label. Figma cells use auto-layout `itemSpacing` (recommend `4 px`, matching `gap-1`). The visual delta is ~5 px less spacing in Figma than runtime — accept as design choice unless a tighter pixel match is needed.
2. **Outer margin `-11 px / 16 px` is wrapper-level.** The Figma cells should encode these margins on the auto-layout frame containing the indicator + label, **not** on the inner `<Checkbox>` instance. Otherwise dropping a `<Checkbox>` instance into a different layout will inherit unwanted offsets.
3. **Disabled is a label-color swap, not a label `opacity` swap.** Confirm the Figma cell binds the disabled label to `palette/text/disabled` (`#00000061`) rather than applying `paint.opacity = 0.38` on a `text.primary` paint. The pre-alpha'd-binding rule (`figma-component-spec-guide` §4.4) makes opacity-on-bound-variable unsafe.
4. **`Size=Large` falls back to Medium at runtime.** Same caveat as the inner `<Checkbox>` — recorded once in `../Checkbox/storybook.render.md` §7 issue 1, do not duplicate the resolution here.
5. **`Hovered / Focused / Pressed` are reachable on the inner `<Checkbox>` set but the wrapper does not republish them.** A flow that needs an interaction-state checkbox-with-label should drop a bare `<Checkbox>` and compose the label manually until those variants are added here.

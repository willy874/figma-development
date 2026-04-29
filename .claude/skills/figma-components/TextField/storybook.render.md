---
name: figma-component-text-field-storybook-render
description: Computed-style matrix for `<TextField>` measured against `src/stories/TextField.stories.tsx` via Chrome DevTools MCP. Documents the runtime per-variant box / paint / typography numbers across the Variant × Size × State × Has Value × Multiline surface, including adornment slots and helper-text. Companion to `figma.spec.md` (the contract) and `design-token.md` (component-scoped tokens).
parent_skill: figma-components
---

# `<TextField>` Storybook Render Measurements

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/TextField.stories.tsx`. Stories used: `StateMatrix` (4 states × 3 variants, Size=Medium, Has Value=True; Error row also carries `Helper Text`), `SizeMatrix` (2 sizes × 3 variants), `AdornmentMatrix` (3 slot configurations × 3 variants), `Empty` (Has Value=False, no focus), `MultilineMatrix` and `MultilineHasValueMatrix` (multiline=true, minRows=3, Variant × Size × State × Has Value). These are the runtime numbers a Figma authoring pass should reproduce; if Storybook output diverges, treat it as a drift check (see §7) rather than silently rebinding.

## 1. Variant-axis invariants (Medium, Enabled, Has Value=True)

Cells differ on padding / underline / outline / fill. Everything else is shared.

| Property                                   | Standard                                      | Filled                                        | Outlined                                      |
| ------------------------------------------ | --------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| Outer height (label floated + helper-less) | `48 px`                                       | `56 px`                                       | `56 px`                                       |
| Wrapper height (input cell only)           | `32 px`                                       | `56 px`                                       | `56 px`                                       |
| Wrapper background                         | transparent                                   | `rgba(0, 0, 0, 0.06)`                         | transparent                                   |
| Wrapper corner radius                      | `0 px`                                        | `4 4 0 0 px`                                  | `4 px`                                        |
| Underline / border (resting)               | `:before 1 px solid rgba(0,0,0,0.42)`         | `:before 1 px solid rgba(0,0,0,0.42)`         | notched `1 px solid rgba(0,0,0,0.23)`         |
| Underline / border (focus)                 | `:after 2 px solid rgb(25,118,210)` scaleX(1) | `:after 2 px solid rgb(25,118,210)` scaleX(1) | notched `2 px solid rgb(25,118,210)`          |
| Input padding (T R B L)                    | `4 0 5 0`                                     | `25 12 8 12`                                  | `16.5 14 16.5 14`                             |
| Input font                                 | Roboto 400, `16 / 23 px`, ls `0.15 px`        | same                                          | same                                          |
| Input color                                | `rgba(0, 0, 0, 0.87)`                         | same                                          | same                                          |
| Label font (rendered)                      | `16 px → scale(0.75) ⇒ 12 px effective`       | same                                          | same                                          |
| Label color (resting)                      | `rgba(0, 0, 0, 0.6)`                          | same                                          | same                                          |
| Label translate (floated)                  | `(0, -1.5 px)`                                | `(12, 7 px)`                                  | `(14, -9 px)`                                 |

Notes:

- The `:before` / `:after` underline pseudo-elements are how MUI paints the resting and focused underline on Standard / Filled. Outlined uses a real `<fieldset class="MuiOutlinedInput-notchedOutline">` so the focus thickening is a `border-width: 1 px → 2 px` swap on the fieldset.
- The Filled wrapper height equals outer height because the floated label sits **inside** the wrapper (translate Y=7 px); Standard's floated label sits **above** the wrapper (translate Y=-1.5 px), which is why Standard's outer height (`48 px`) exceeds its wrapper height (`32 px`).
- Outlined's notched outline carves a gap at the label position via the `<legend>` element; nothing about the legend appears in computed style.
- `line-height: 23 px` (not `24 px` as the prior spec claimed) is MUI default for Body1; the discrepancy is sub-pixel float math and stable across Chrome.

## 2. State axis (Medium, Has Value=True)

`StateMatrix` covers `Enabled / Focused / Disabled / Error`. Hovered is `:hover` and only renders under interaction; Focused is faked statically via the `focused` prop.

| Property              | Variant   | Enabled                       | Focused                       | Disabled                                      | Error                                |
| --------------------- | --------- | ----------------------------- | ----------------------------- | --------------------------------------------- | ------------------------------------ |
| Label color           | all       | `rgba(0, 0, 0, 0.6)`          | `rgb(25, 118, 210)`           | `rgba(0, 0, 0, 0.38)`                         | `rgb(211, 47, 47)`                   |
| Input color           | all       | `rgba(0, 0, 0, 0.87)`         | `rgba(0, 0, 0, 0.87)`         | `rgba(0, 0, 0, 0.38)`                         | `rgba(0, 0, 0, 0.87)`                |
| Underline `:before`   | Standard  | `1 px solid rgba(0,0,0,0.42)` | `1 px solid rgba(0,0,0,0.42)` | `1 px dotted rgba(0,0,0,0.42)`                | `1 px solid rgb(211, 47, 47)`        |
|                       | Filled    | same as Standard              | same                          | same                                          | same                                 |
| Underline `:after`    | Standard  | `2 px solid rgb(25,118,210)` scaleX(0) | scaleX(1)             | scaleX(0)                                     | `2 px solid rgb(211, 47, 47)`        |
|                       | Filled    | same                          | same                          | same                                          | same                                 |
| Notched outline       | Outlined  | `1 px solid rgba(0,0,0,0.23)` | `2 px solid rgb(25,118,210)`  | `1 px solid rgba(0,0,0,0.26)`                 | `1 px solid rgb(211, 47, 47)`        |
| Wrapper background    | Filled    | `rgba(0, 0, 0, 0.06)`         | `rgba(0, 0, 0, 0.06)`         | `rgba(0, 0, 0, 0.12)`                         | `rgba(0, 0, 0, 0.06)`                |
| Wrapper background    | Standard / Outlined | transparent          | transparent                   | transparent                                   | transparent                          |
| Helper text color     | all       | n/a (helperText empty)        | n/a                           | n/a                                           | `rgb(211, 47, 47)`                   |
| Helper text font      | all       | n/a                           | n/a                           | n/a                                           | `12 / 19.92 px`, ls `0.4 px`         |

Notes:

- **Disabled Standard underline is dotted (1 px), not solid.** This is the only variant where the stroke shape changes per state; Outlined / Filled keep solid strokes throughout. The Figma cells render this as solid because Figma has no equivalent stroke style — file the divergence in §7.
- **Focused does not stack a focus ring on the wrapper or the helper-text — only the underline / outline thickens (1 → 2 px) and the label / underline retint.** No drop shadow, no outer outline. A Figma cell that paints an extra focus ring is a spec bug.
- **Focused-error is not its own state.** MUI rebroadcasts `Error` paint over a 2 px-thick stroke when `error && focused`; the `State=Error` Figma variant already encodes the resting paint and does not need to stack with `Focused`.
- The Mui-disabled Outlined notch uses `0.26 α` (`palette.action.disabled`), **not** `0.38 α` (`text.disabled`). This is MUI's deliberate distinction — disabled foreground vs. disabled overlay.

## 3. Size axis (Variant × Size, Enabled, Has Value=True)

`SizeMatrix` confirms small / medium across all three variants; small differs only on outer / wrapper height and input vertical padding.

| Variant   | Size   | Outer height | Wrapper height | Input padding (T R B L) | Label translate (floated) |
| --------- | ------ | ------------ | -------------- | ----------------------- | ------------------------- |
| Standard  | Small  | `45 px`      | `29 px`        | `1 0 5 0`               | `(0, -1.5 px)`            |
| Standard  | Medium | `48 px`      | `32 px`        | `4 0 5 0`               | `(0, -1.5 px)`            |
| Filled    | Small  | `48 px`      | `48 px`        | `21 12 4 12`            | `(12, 4 px)`              |
| Filled    | Medium | `56 px`      | `56 px`        | `25 12 8 12`            | `(12, 7 px)`              |
| Outlined  | Small  | `40 px`      | `40 px`        | `8.5 14 8.5 14`         | `(14, -9 px)`             |
| Outlined  | Medium | `56 px`      | `56 px`        | `16.5 14 16.5 14`       | `(14, -9 px)`             |

These match the Figma frame heights at `1:6266` to within ±0.3 px (Figma cells: Std-Sm `45.26`, Std-Md `48.26`, Fld-Sm `48.27`, Fld-Md `56.27`, Out-Sm `40.24`, Out-Md `56.24`). Font size / weight stays at `16 / 23 px` regardless of size — MUI shrinks padding, not type.

## 4. Has Value axis (Outlined Medium, Enabled)

`Empty` story (no `defaultValue`) plus `Outlined / Filled / Standard` per-variant stories with a value confirm:

| Property               | Has Value=True (defaultValue="Value") | Has Value=False (placeholder only) |
| ---------------------- | ------------------------------------- | ---------------------------------- |
| Label transform        | `scale(0.75) translate(14, -9 px)` (floated above border) | `translate(14, 16 px)` (un-scaled, sits inside input) |
| Label font (rendered)  | `12 px effective`                     | `16 px effective`                  |
| Input value visible    | yes                                   | no — empty                         |
| Placeholder visible    | n/a                                   | **no** — `::placeholder { opacity: 0 }` while label is un-shrunk |

**The placeholder is invisible whenever a label exists and is not shrunk.** MUI deliberately suppresses placeholder under those conditions so the un-floated label acts as the placeholder text. This is why the Figma cells with `Has Value=False` render label-only — there is no separate `Placeholder` text node to encode. (The prior spec's "at least one of Value/Placeholder must render" rule was a misread of MUI's behaviour and does not apply.)

In `State=Focused`, the label always shrinks-and-floats regardless of `Has Value` — the input area ends up empty until the user types.

## 5. Adornment axis (Variant × {start, end, both}, Medium, Enabled, Has Value=True)

`AdornmentMatrix` uses 20 × 20 inline SVGs in `<InputAdornment>`.

| Property                         | Standard            | Filled              | Outlined            |
| -------------------------------- | ------------------- | ------------------- | ------------------- |
| Adornment glyph fill (resting)   | `rgba(0, 0, 0, 0.54)` | same              | same                |
| Adornment glyph fill (Disabled, inferred) | `rgba(0, 0, 0, 0.38)` | same              | same                |
| Start adornment margin-right     | `8 px`              | `8 px`             | `8 px`              |
| Start adornment margin-left      | `0 px`              | n/a (consumed by wrapper padding) | n/a |
| Wrapper padding when adornment present (T R B L) | `0 0 0 0`           | `0 12 0 12` (start: `0 0 0 12`, end: `0 12 0 0`) | `0 14 0 14` (start: `0 0 0 14`, end: `0 14 0 0`) |
| Glyph dimensions (this story)    | `20 × 20`           | `20 × 20`          | `20 × 20`           |

Notes:

- **Adornment fill `0.54 α` is `palette.action.active`, not `text.secondary` (`0.6 α`)** — the same rgba value is also used for the un-shrunk label, but the alpha differs.
- **Glyph is sized by the consumer**, not MUI. The Figma cells use `24 × 24` adornment frames (per `figma.spec.md` §3.1), but a 20 × 20 SVG also works at runtime — both renders are valid; pick `24 × 24` in Figma so the adornment slot is large enough to host any icon from the shared `<Icon>` set.
- When an adornment is present on Filled / Outlined, MUI moves the horizontal padding from the input to the wrapper (`12 / 14 px`) so the adornment sits inside the inset.

## 6. Helper text & autocomplete slot

`WithHelperText` and the `Error` row of `StateMatrix` populate the helper-text node:

| Property         | Value                                  |
| ---------------- | -------------------------------------- |
| Font             | Roboto 400, `12 / 19.92 px`, ls `0.4 px` |
| Color (resting)  | `rgba(0, 0, 0, 0.6)` (text.secondary)  |
| Color (Error)    | `rgb(211, 47, 47)` (`seed/danger/main`) |
| margin-top       | `3 px`                                 |
| margin-left / right | `14 px` (matches Outlined input-pad-x; see MUI default `FormHelperText`) |

The Figma component also exposes an `autocomplete` slot (a child slot for SearchInput-style autocomplete dropdowns); it is a plain `SLOT` with no inherent paint and renders nothing at runtime in `<TextField>` itself.

## 7. Multiline (`multiline=true`, `minRows=3`)

`MultilineMatrix` (Variant × Size × State, Has Value=True) and `MultilineHasValueMatrix` (Variant × Size × Has Value) probe the multiline surface. Multiline swaps `<input>` for a `<textarea>` (via `TextareaAutosize`) but reuses every other paint / padding / token from the single-line cell — only the wrapper height grows.

### 7.1 Multiline-axis invariants (Enabled, Has Value=True, minRows=3)

| Variant   | Size   | Outer height | Wrapper height | Wrapper padding (T R B L) | Textarea content height |
| --------- | ------ | ------------ | -------------- | ------------------------- | ----------------------- |
| Standard  | Small  | `91 px`      | `75 px`        | `1 0 5 0`                 | `69 px`                 |
| Standard  | Medium | `94 px`      | `78 px`        | `4 0 5 0`                 | `69 px`                 |
| Filled    | Small  | `94 px`      | `94 px`        | `21 12 4 12`              | `69 px`                 |
| Filled    | Medium | `102 px`     | `102 px`       | `25 12 8 12`              | `69 px`                 |
| Outlined  | Small  | `86 px`      | `86 px`        | `8.5 14 8.5 14`           | `69 px`                 |
| Outlined  | Medium | `102 px`     | `102 px`       | `16.5 14 16.5 14`         | `69 px`                 |

Notes:

- **Wrapper-height delta is uniform.** Multiline grows the wrapper by exactly `(minRows − 1) × 23 px = 46 px` over the single-line height for every Variant × Size cell. The textarea content area is `3 × 23 = 69 px` (3 rows × Body1 line-height) regardless of variant.
- **Padding does not change.** The wrapper retains the same `padding` it uses single-line — Filled keeps the `25 / 8` top/bottom inset that holds the floated label, Outlined keeps the symmetric `16.5 / 14` inset, Standard keeps the asymmetric `4 / 5`. The textarea has `padding: 0` in every cell; the wrapper's padding is what offsets it.
- **Standard outer-vs-wrapper offset is preserved.** Standard's outer height still exceeds wrapper height by 16 px (label-overhang above the input row); Filled / Outlined's outer equals wrapper.
- **State paints / fills / outlines are byte-identical to single-line.** Multiline cells do not introduce any new paint role — `enabledFill`, `hoverBorder`, `seed/primary/main` (Focused), `bg-disabled` (Disabled wrapper), `seed/danger/main` (Error stroke + label + helper) all carry over. The `MultilineMatrix` Disabled / Focused / Error rows confirm: wrapper bg `0 / 0.06 / 0.12` for Standard / Filled / Outlined Enabled vs Disabled, fieldset border `0.23 / 0.26 / 2px primary / 1px danger` for Outlined across states — every value matches the single-line tables in §1–§3.

### 7.2 Has Value axis under multiline (Enabled)

`MultilineHasValueMatrix` confirms the un-shrunk-label behaviour carries over:

| Variant   | Size   | Has Value=True label transform              | Has Value=False label transform        |
| --------- | ------ | ------------------------------------------- | -------------------------------------- |
| Standard  | Small  | `scale(0.75) translate(0, -1.5 px)` floated | `translate(0, 17 px)` un-shrunk        |
| Standard  | Medium | `scale(0.75) translate(0, -1.5 px)` floated | `translate(0, 20 px)` un-shrunk        |
| Filled    | Small  | `scale(0.75) translate(12, 4 px)` floated   | `translate(12, 13 px)` un-shrunk       |
| Filled    | Medium | `scale(0.75) translate(12, 7 px)` floated   | `translate(12, 16 px)` un-shrunk       |
| Outlined  | Small  | `scale(0.75) translate(14, -9 px)` floated  | `translate(14, 9 px)` un-shrunk        |
| Outlined  | Medium | `scale(0.75) translate(14, -9 px)` floated  | `translate(14, 16 px)` un-shrunk       |

The un-shrunk label sits at the **first-row baseline** of the textarea — identical translate-Y to the single-line `Has Value=False` row. The remaining 2 rows of the textarea sit empty below the un-shrunk label. Wrapper / outer heights are identical to the `Has Value=True` rows above.

### 7.3 Multiline drift / divergence vs Figma

- **Figma fixes `minRows=3`.** Runtime keeps `maxRows` unset so users can grow the textarea past 3 rows; the Figma cell only encodes the minimum. If a host application bumps `minRows` or sets `maxRows`, the resulting computed heights will differ from the Figma cell — treat as a known omission, not a drift.
- **Textarea is uniform-width.** The textarea inherits `box-sizing: border-box` from MUI; its width equals `wrapper width − wrapper padding-x`. Filled / Outlined narrow by `24 / 28 px` respectively (matches single-line). Standard textarea fills the wrapper width.
- **No multiline-specific paint changes.** If a cell renders a different fill / stroke / text color from its single-line sibling at the same `(Variant, Size, State, Has Value)` coordinate, that is a spec bug — multiline is a layout-only axis.

## 8. Drift checks

If a Storybook re-measure produces values that disagree with the tables above, treat the difference as one of these cases — do not silently update the spec:

The five open issues mirror `figma.spec.md` §7:

1. **Outlined-resting border** — runtime `rgba(0, 0, 0, 0.23)` vs Figma `component/input/outlined/enabledBorder` (`0.12α`). Figma renders lighter by ≈10 percentage points. Resolve by repointing the local token to `0.23α` or minting a `mui-outline` companion.
2. **Outlined-disabled border** — runtime `rgba(0, 0, 0, 0.26)` (`action.disabled`) vs Figma `alias/colors/bg-disabled` (`0.12α`). Same fix shape as issue 1.
3. **Adornment glyph fill** — runtime `rgba(0, 0, 0, 0.54)` (`action.active`) vs Figma `alias/colors/text-sub` (`0.6α`). Visual difference small but measurable; if a designer files an "icon looks too dark" bug, this is the cause.
4. **Filled-Focused wrapper fill** — runtime keeps `rgba(0, 0, 0, 0.06)` (`enabledFill`) on `:focus-visible`, but Figma rebinds `component/input/filled/hoverFill` (`0.09α`) on Focused. The Figma cell adds extra darkening that MUI does not render.
5. **Disabled-Standard underline stroke style** — runtime `1 px dotted` vs Figma `1 px solid` (no equivalent stroke style published).

Other change vectors that force a re-measure:

- **MUI upgrade** — `@mui/material` major bumps may change padding (`16.5 px` outlined V-pad, `25 px` filled top-pad), the `0.42α` resting underline, helper-text margin, or any of the alphas above. Update §1 / §2 here in the same PR and bump `figma.spec.md` §1's MUI version row.
- **Theme override** — `.storybook/preview.tsx` currently uses `createTheme()` (no overrides). If the project introduces a custom theme (typography token, `MuiTextField` `defaultProps`, palette retint), capture the overrides in §1 and decide which Figma variants need re-binding.
- **Disabled label / value foreground** — runtime is `rgba(0, 0, 0, 0.38)` (`text.disabled`); Figma cells bind `alias/colors/text-disabled` (`0.38α`). Match — re-measure only if MUI changes `palette.text.disabled`.
- **Browser-level rounding** — `0.15008 px` letter-spacing and `19.92 px` helper line-height come from float math; stable across Chrome versions, may differ slightly on Firefox / Safari. Acceptable.

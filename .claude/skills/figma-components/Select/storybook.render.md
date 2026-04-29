---
name: figma-component-select-storybook-render
description: Computed-style matrix for `<Select>` measured against `src/stories/Select.stories.tsx` via Chrome DevTools MCP. Documents the runtime per-variant box / paint / typography numbers across the Variant × Size × State × Has Value × Multiple surface, plus the chevron indicator and the open-menu (MenuItem) stack. Companion to `figma.spec.md` (the contract) and `design-token.md` (component-scoped tokens).
parent_skill: figma-components
---

# `<Select>` Storybook Render Measurements

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/Select.stories.tsx`. The story renders `<TextField select>` (the canonical MUI Select recipe) so the trigger paint is reused from `<TextField>`; only the chevron, the value rendering (Multiple chip stack vs single line) and the open-menu (MenuItem listbox) belong exclusively to this spec. Stories used: `VariantMatrix` (3 variants × 2 has-value, Size=Medium, State=Enabled), `StateMatrix` (4 statically-renderable states × 3 variants, Size=Medium, Has Value=True), `MultipleMatrix` (4 states × 3 variants × 2 sizes, Multiple=True), `Open` (Outlined Medium, menu open). These are the runtime numbers a Figma authoring pass should reproduce; if Storybook output diverges, treat it as a drift check (see §7).

## 1. Variant-axis invariants (Medium, Enabled, Has Value=True, Multiple=False)

Trigger geometry mirrors `<TextField>` exactly — Select reuses the underlying `MuiInput-root` / `MuiFilledInput-root` / `MuiOutlinedInput-root` wrapper. The only Select-specific delta is the `padding-right` reservation for the chevron (`24 px` Standard, `32 px` Filled / Outlined) and the absolutely-positioned `MuiSelect-icon`.

| Property                                   | Standard                                      | Filled                                        | Outlined                                      |
| ------------------------------------------ | --------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| Outer height (label floated, no helper)    | `48 px`                                       | `56 px`                                       | `56 px`                                       |
| Wrapper height (input cell only)           | `32 px`                                       | `56 px`                                       | `56 px`                                       |
| Wrapper background                         | transparent                                   | `rgba(0, 0, 0, 0.06)`                         | transparent                                   |
| Wrapper corner radius                      | `0 px`                                        | `4 4 0 0 px`                                  | `4 px`                                        |
| Underline / border (resting)               | `:before 1 px solid rgba(0,0,0,0.42)`         | `:before 1 px solid rgba(0,0,0,0.42)`         | notched `1 px solid rgba(0,0,0,0.23)`         |
| Underline / border (focus)                 | `:after 2 px solid rgb(25,118,210)` scaleX(1) | `:after 2 px solid rgb(25,118,210)` scaleX(1) | notched `2 px solid rgb(25,118,210)`          |
| `[role=combobox]` padding (T R B L)        | `4 24 5 0`                                    | `25 32 8 12`                                  | `16.5 32 16.5 14`                             |
| Value font / line-height / letter-spacing  | `16 / 23 px / 0.15 px` (Roboto 400)           | same                                          | same                                          |
| Value color (Enabled)                      | `rgba(0, 0, 0, 0.87)`                         | same                                          | same                                          |
| Label color (resting)                      | `rgba(0, 0, 0, 0.6)`                          | same                                          | same                                          |
| Label translate (Has Value=True, floated)  | `(0, -1.5 px)`                                | `(12, 7 px)`                                  | `(14, -9 px)`                                 |

Notes:

- **Padding-right is `24 / 32 px`, vs `0 / 12 / 14 px` on plain TextField.** That extra slot is reserved for the chevron — the `MuiSelect-icon` is positioned absolutely (`right: 0` on Standard, `right: 7 px` on Filled / Outlined) and overlaps the reserved padding region.
- The remaining trigger geometry — wrapper bg / radius / underline / outline — is identical to `<TextField>`; if it diverges in Figma, that's a TextField bug not a Select bug.

## 2. Chevron (`MuiSelect-icon`)

The chevron is rendered as an SVG inside the trigger; in MUI 7 it is the `ArrowDropDownIcon` (a 24×24 down-arrow at `viewBox 0 0 24 24`). Position is `position: absolute` relative to the wrapper.

| Property                          | Standard                              | Filled                                | Outlined                              |
| --------------------------------- | ------------------------------------- | ------------------------------------- | ------------------------------------- |
| SVG box                           | `24 × 24 px`                          | `24 × 24 px`                          | `24 × 24 px`                          |
| `right` offset (closed)           | `0 px`                                | `7 px`                                | `7 px`                                |
| `top` offset (closed, Medium)     | `4 px`                                | `16 px`                               | `16 px`                               |
| Fill (Enabled / Hovered)          | `rgba(0, 0, 0, 0.54)`                 | same                                  | same                                  |
| Fill (Focused, non-Error)         | `rgba(0, 0, 0, 0.54)` _(unchanged)_   | same                                  | same                                  |
| Fill (Error)                      | `rgba(0, 0, 0, 0.54)` _(unchanged)_   | same                                  | same                                  |
| Fill (Disabled)                   | `rgba(0, 0, 0, 0.26)`                 | same                                  | same                                  |
| Open transform                    | `rotate(180deg)` (`matrix(-1,0,0,-1,0,0)`) | same                              | same                                  |

Notes:

- **The chevron does not retint on Focused or Error** — only on Disabled (`action.disabled`, `0.26α`). This is different from the floated label and underline, which both retint to `primary.main` / `danger.main`. Designers should keep the chevron on the resting paint regardless of `State` other than Disabled.
- **The chevron uses `action.active` (`0.54α`), not `text.secondary` (`0.6α`).** This matches MUI's `<InputAdornment>` glyph color; the `<TextField>` Figma cells currently bind `text-sub` (`0.6α`) for adornments and carry an open drift on that — Select inherits the same drift unless we mint a dedicated adornment-fill token. Track in §7 issue 1.
- **Disabled chevron uses `action.disabled` (`0.26α`), not `text.disabled` (`0.38α`).** This is MUI's deliberate split — disabled foreground vs. disabled overlay. The Outlined disabled border also uses `0.26α`; reuse the same token if present.

## 3. State axis (Medium, Has Value=True, Multiple=False)

`StateMatrix` covers `Enabled / Focused / Disabled / Error`. Hovered is `:hover` and only renders under interaction; Focused is faked statically via the `focused` prop.

| Property            | Variant   | Enabled                       | Focused                       | Disabled                                      | Error                                |
| ------------------- | --------- | ----------------------------- | ----------------------------- | --------------------------------------------- | ------------------------------------ |
| Label color         | all       | `rgba(0, 0, 0, 0.6)`          | `rgb(25, 118, 210)`           | `rgba(0, 0, 0, 0.38)`                         | `rgb(211, 47, 47)`                   |
| Value color         | all       | `rgba(0, 0, 0, 0.87)`         | `rgba(0, 0, 0, 0.87)`         | `rgba(0, 0, 0, 0.38)`                         | `rgba(0, 0, 0, 0.87)`                |
| Chevron fill        | all       | `rgba(0, 0, 0, 0.54)`         | `rgba(0, 0, 0, 0.54)`         | `rgba(0, 0, 0, 0.26)`                         | `rgba(0, 0, 0, 0.54)`                |
| Underline `:before` | Standard  | `1 px solid rgba(0,0,0,0.42)` | `1 px solid rgba(0,0,0,0.42)` | `1 px dotted rgba(0,0,0,0.42)`                | `1 px solid rgb(211, 47, 47)`        |
|                     | Filled    | same                          | same                          | `1 px dotted rgba(0,0,0,0.42)`                | same                                 |
| Underline `:after`  | Standard  | `2 px solid primary` scaleX(0)| scaleX(1)                     | scaleX(0)                                     | `2 px solid danger` scaleX(0)        |
|                     | Filled    | same                          | same                          | scaleX(0)                                     | same                                 |
| Notched outline     | Outlined  | `1 px solid rgba(0,0,0,0.23)` | `2 px solid rgb(25,118,210)`  | `1 px solid rgba(0,0,0,0.26)`                 | `1 px solid rgb(211, 47, 47)`        |
| Wrapper background  | Filled    | `rgba(0, 0, 0, 0.06)`         | `rgba(0, 0, 0, 0.06)`         | `rgba(0, 0, 0, 0.12)`                         | `rgba(0, 0, 0, 0.06)`                |
| Wrapper background  | Standard / Outlined | transparent          | transparent                   | transparent                                   | transparent                          |
| Helper text color   | all       | n/a                           | n/a                           | n/a                                           | `rgb(211, 47, 47)`                   |
| Helper text font    | all       | n/a                           | n/a                           | n/a                                           | `12 / 19.92 px`, ls `0.4 px`         |

Notes:

- Trigger paint exactly mirrors `<TextField>` — the only Select delta is that the **chevron stays at `0.54α` on Focused and Error** (TextField's adornment glyph behaves the same way; this is consistent with MUI's "neutral adornment, themed border / label" rule).
- **Disabled Standard / Filled underline is `1 px dotted`, not solid.** Figma cannot encode a dotted stroke at the published surface; the Figma cells render solid (the same drift TextField carries). Track in §7.
- Mui-disabled Outlined notch uses `0.26 α` (`palette.action.disabled`), **not** `0.38 α` (`text.disabled`). Same chevron-disabled paint.

## 4. Size axis (Variant × Size, Enabled, Has Value=True, Multiple=False)

Size axis is identical to `<TextField>` — Select inherits MUI's `size: small | medium` padding ramp without overriding it.

| Variant   | Size   | Outer height | Wrapper height | Combobox padding (T R B L)           | Chevron `top` |
| --------- | ------ | ------------ | -------------- | ------------------------------------ | ------------- |
| Standard  | Small  | `45 px`      | `29 px`        | `1 24 5 0`                           | `1 px`        |
| Standard  | Medium | `48 px`      | `32 px`        | `4 24 5 0`                           | `4 px`        |
| Filled    | Small  | `48 px`      | `48 px`        | `21 32 4 12`                         | `12 px`       |
| Filled    | Medium | `56 px`      | `56 px`        | `25 32 8 12`                         | `16 px`       |
| Outlined  | Small  | `40 px`      | `40 px`        | `8.5 32 8.5 14`                      | `8 px`        |
| Outlined  | Medium | `56 px`      | `56 px`        | `16.5 32 16.5 14`                    | `16 px`       |

(Chevron `top` matches `((wrapperHeight - 24) / 2)` for Filled / Outlined and the wrapper top-padding for Standard. Sub-pixel rounding on the Filled-Medium / Outlined-Medium cells is `±0.3 px`; use the integer `top` values above when authoring.)

## 5. Has Value axis (Outlined Medium, Enabled)

| Property                | Has Value=True (defaultValue=`option-1`)            | Has Value=False (`defaultValue=''`)              |
| ----------------------- | --------------------------------------------------- | ------------------------------------------------ |
| Label transform         | `scale(0.75) translate(14, -9 px)` (floated above border) | `translate(14, 16 px)` (un-scaled, sits inside input) |
| Label font (rendered)   | `12 px effective`                                   | `16 px effective`                                |
| Value rendered          | yes (`Option`)                                      | no — combobox shows ` ` (zero-width whitespace placeholder) |
| Chevron position        | unchanged                                           | unchanged                                        |

`Has Value=False` is identical to TextField's empty label-only state — MUI does not show a placeholder for Select; the un-floated label *is* the placeholder. There is no `placeholder` prop wired through `<TextField select>`. Cells with `Has Value=False` render the un-shrunk label only.

## 6. Multiple axis (Variant × Size, Enabled, Multiple=True, with 2 chips)

`MultipleMatrix` renders `<Select multiple>` with a `renderValue` that maps the selected value array to `<Chip>` instances inside a horizontal `Stack`. With `<TextField select>` the chips fit inside the existing `[role=combobox]` padding region — wrapper height is unchanged when chips fit on one row.

| Variant   | Size   | Outer height (2 chips, 1 row) | Wrapper height | Combobox padding (T R B L)  | Notes                                                                 |
| --------- | ------ | ----------------------------- | -------------- | --------------------------- | --------------------------------------------------------------------- |
| Standard  | Small  | `46 px`                       | `30 px`        | `1 24 5 0`                  | `+1 px` over single-line — chip top edge sits on the baseline.        |
| Standard  | Medium | `49 px`                       | `33 px`        | `4 24 5 0`                  | `+1 px` over single-line — same baseline rounding.                    |
| Filled    | Small  | `49 px`                       | `49 px`        | `21 32 4 12`                | `+1 px` rounding; chip center matches Filled label baseline.          |
| Filled    | Medium | `57 px`                       | `57 px`        | `25 32 8 12`                | `+1 px` rounding; chip stack inside the floated-label band.           |
| Outlined  | Small  | `41 px`                       | `41 px`        | `8.5 32 8.5 14`             | `+1 px` rounding.                                                     |
| Outlined  | Medium | `57 px`                       | `57 px`        | `16.5 32 16.5 14`           | `+1 px` rounding.                                                     |

Per-chip metrics (size=`small`, the chip variant rendered by the matrix):

| Property            | Value                                  |
| ------------------- | -------------------------------------- |
| Box                 | `auto × 24 px`                         |
| Background          | `rgba(0, 0, 0, 0.08)`                  |
| Corner radius       | `16 px`                                |
| Font / line-height  | `13 / 19.5 px`                         |
| Letter-spacing      | `0.16 px` _(Roboto 400)_               |
| Inner padding (L R) | `8 px` _(MUI default for `size=small`)_ |

Notes:

- **Wrapper height is unchanged from single-line as long as chips fit on one row** (`+1 px` is sub-pixel rounding on the chip box). When chips wrap to a second row, the wrapper grows by `+24 + 4 px` (chip height + flex-wrap gap). The Figma cell encodes the **single-row** baseline; multi-row wrapping is a runtime-only growth path that Figma documents as "instance overrides only" (a §8 trigger if it becomes the dominant pattern).
- **`renderValue` is the host-supplied function**, not a built-in Select feature. The Figma cell models the canonical chip stack (`<Chip size="small">` per selected option) but designers can drop any nodes into the `Chips` SLOT at instance level.
- **The chip's text uses `13 px` (Roboto 400, lh `19.5 px`)**, not `body1` (`16/24`). This is `<Chip size="small">`'s typography — apply the published `material-design/typography/body2` text style if minted, else hand-set Roboto 400 13 / 19.5.

## 7. Open menu (Outlined Medium, Has Value=True, Open=true)

`Open` story renders the trigger with `SelectProps={{ open: true }}` so the menu is captured next to the trigger.

| Property                      | Value                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| Chevron transform             | `rotate(180deg)` _(`matrix(-1, 0, 0, -1, 0, 0)`)_                                      |
| Paper background              | `rgb(255, 255, 255)`                                                                   |
| Paper corner radius           | `4 px`                                                                                  |
| Paper effect (drop-shadow)    | `0 5px 5px -3px rgba(0,0,0,0.2), 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12)` _(MD elevation 8 — MUI Menu default)_ |
| Listbox padding (T R B L)     | `8 0 8 0 px`                                                                            |
| MenuItem min-height           | `0 px` _(MUI default — content + padding determines height)_                            |
| MenuItem rendered height      | `36 px`                                                                                 |
| MenuItem padding (T R B L)    | `6 16 6 16 px`                                                                          |
| MenuItem font / line-height   | `16 / 24 px`, ls `0.15 px` _(Roboto 400, body1)_                                        |
| MenuItem color                | `rgba(0, 0, 0, 0.87)`                                                                   |
| MenuItem `Mui-selected` bg    | `rgba(25, 118, 210, 0.2)` _(primary × `selectedOpacity 0.16` rounded)_                  |

Notes:

- **The Select Menu uses MD elevation `8`**, not elevation `1`. This differs from `<AutocompleteMenu>` which uses elevation `1`. MUI's choice — Menu is a "raised" surface, popper / listbox is "near-flat." When stamping `<AutocompleteMenu>` underneath a Select instance, the elevation is wrong; Figma should either bind a separate `material-design/shadows/shadows-8` to the Select-menu cell or accept the visual divergence with `<AutocompleteMenu>` and document it. Track in §7 issue 2.
- **Selected MenuItem bg is `primary × 0.16α` here** (`rgba(25,118,210,0.2)` resolves to ~`0.16` because Storybook's preview theme has not retuned `selectedOpacity`). MUI 7 default `palette.action.selectedOpacity = 0.08`; the runtime here resolves higher because the `Mui-selected` style stacks both the selected and the focus-visible alphas. AutocompleteOption uses `0.08` (Selected) / `0.12` (Selected + Focused) — the gap is real and documented in §7 issue 3.
- **No focus-visible ring on MenuItem.** Keyboard focus is signalled by the same `Mui-selected` background tint; do not add a focus stroke in Figma.

## 8. Helper text

When `helperText` is supplied (or `error: true` plus `helperText`):

| Property                        | Value                            |
| ------------------------------- | -------------------------------- |
| Helper text font / line-height  | `12 / 19.92 px`, ls `0.4 px`     |
| Helper text color (Enabled)     | `rgba(0, 0, 0, 0.6)`             |
| Helper text color (Disabled)    | `rgba(0, 0, 0, 0.38)`            |
| Helper text color (Error)       | `rgb(211, 47, 47)`                |
| Helper text margin-top          | `3 px`                           |
| Helper text padding (L R)       | `14 px / 14 px` (Outlined / Filled), `0 / 0` (Standard) |

Identical to `<TextField>`'s helper text — no Select-specific delta.

## 9. Drift checks (open vs `figma.spec.md`)

Items below are surface differences between this runtime snapshot and the `<Select>` Figma cell at `587:8542`. They are recorded here so the next runtime-truth pass has a punch list; resolution lives in `figma.spec.md` §7 (issues) and §8 (sync rule).

1. **Chevron resting fill** — runtime is `action.active` (`0.54α`); the `<TextField>`-style adornment-glyph spec binds `alias/colors/text-sub` (`0.6α`). The visual delta is small. Either accept or mint a dedicated adornment-fill token.
2. **Disabled chevron fill** — runtime is `action.disabled` (`0.26α`); commonly bound as `alias/colors/text-disabled` (`0.38α`) by analogy with the label / value text. Mint or rebind a `0.26α` companion to close.
3. **Standard / Filled disabled underline** — runtime is `1 px dotted`; Figma renders solid (no equivalent stroke style at the published surface). Same drift as TextField.
4. **Outlined enabled border** — runtime is `0.23α`; the `component/input/outlined/enabledBorder` token binds `0.12α`. Inherited from TextField.
5. **Outlined disabled border** — runtime is `0.26α`; `alias/colors/bg-disabled` binds `0.12α`. Inherited from TextField.
6. **Select-Menu Paper elevation** — runtime is MD elevation `8`; the spec composes `<AutocompleteMenu>` which carries elevation `1`. Either mint a separate `<SelectMenu>` companion at elevation `8`, or document the divergence as accepted.
7. **Select-Menu Selected MenuItem bg** — runtime is `primary × ≈0.16α`; the adjacent `<AutocompleteOption>` Selected paint is `primary × 0.08α`. The `+0.08α` gap is MUI's deliberate "Select-menu is louder than Autocomplete-option" choice. Mint a `component/select/menuitem-selected-bg` if Select needs its own popper, or accept the visual divergence with AutocompleteMenu.
8. **Multiple wrapping growth** — runtime grows the wrapper by `+24 + 4 px` per additional chip row; the Figma cell encodes the single-row baseline only. Designers re-size instances manually for multi-row wrapping.

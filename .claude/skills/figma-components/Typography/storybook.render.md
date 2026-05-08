---
name: figma-component-typography-storybook-render
description: Computed-style snapshot for `<Typography>` measured against `src/stories/Typography.stories.tsx` via Chrome DevTools MCP. Documents the runtime per-variant typography numbers (font, weight, size, line-height, letter-spacing, text-transform, default tag), the color × value resolution table, the `gutterBottom` / `noWrap` utility behaviour, and the drift-check protocol that decides whether a divergence is a spec bug, a MUI upgrade, or browser rounding. Companion to `figma.spec.md` (the contract).
parent_skill: figma-components
---

# `<Typography>` Storybook Render Measurements

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/Typography.stories.tsx`. Stories used: `FullMatrix` (13 variants × 9 colors, all `Enabled` since `<Typography>` has no interaction states), `GutterBottom` (margin-bottom delta), and `NoWrap` (overflow / ellipsis). These are the runtime numbers a Figma authoring pass should reproduce; if Storybook output diverges, the spec — not the runtime — is the source-of-truth, but the divergence is a red flag worth filing.

Runtime context: `@mui/material 7.3.10` (resolved from `package.json` on 2026-05-08). Storybook preview wraps every story in `ThemeProvider theme={createTheme()}` — i.e. the **default MUI theme** with no project-level typography overrides (see `.storybook/preview.tsx`). All numbers below are MUI defaults.

## 1. Variant axis — typography (color = `default`)

13 variants, all rendered Roboto by default (MUI ships Roboto via the default theme). Column conventions: `LH` = computed `line-height` in `px`; `LS` = computed `letter-spacing` in `px` (browser-resolved from MUI's em values); `Case` = `text-transform`; `Tag` = the HTML element MUI emits when no `component` override is passed.

| Variant     | Font  | Weight | Size  | LH        | LS         | Case      | Default tag |
| ----------- | ----- | ------ | ----- | --------- | ---------- | --------- | ----------- |
| `h1`        | Roboto | 300   | 96 px | 112.032 px (`7em`)    | -1.49952 px (`-0.01562em`) | `none`      | `<h1>`      |
| `h2`        | Roboto | 300   | 60 px | 72 px (`1.2em`)       | -0.4998 px (`-0.00833em`)  | `none`      | `<h2>`      |
| `h3`        | Roboto | 400   | 48 px | 56.016 px (`1.167em`) | normal                     | `none`      | `<h3>`      |
| `h4`        | Roboto | 400   | 34 px | 41.99 px (`1.235em`)  | 0.2499 px (`0.00735em`)    | `none`      | `<h4>`      |
| `h5`        | Roboto | 400   | 24 px | 32.016 px (`1.334em`) | normal                     | `none`      | `<h5>`      |
| `h6`        | Roboto | 500   | 20 px | 32 px (`1.6em`)       | 0.15 px (`0.0075em`)       | `none`      | `<h6>`      |
| `subtitle1` | Roboto | 400   | 16 px | 28 px (`1.75em`)      | 0.15008 px (`0.00938em`)   | `none`      | `<h6>`¹     |
| `subtitle2` | Roboto | 500   | 14 px | 21.98 px (`1.57em`)   | 0.09996 px (`0.00714em`)   | `none`      | `<h6>`¹     |
| `body1`     | Roboto | 400   | 16 px | 24 px (`1.5em`)       | 0.15008 px (`0.00938em`)   | `none`      | `<p>`       |
| `body2`     | Roboto | 400   | 14 px | 20.02 px (`1.43em`)   | 0.14994 px (`0.01071em`)   | `none`      | `<p>`       |
| `button`    | Roboto | 500   | 14 px | 24.5 px (`1.75em`)    | 0.39998 px (`0.02857em`)   | `uppercase` | `<span>`²   |
| `caption`   | Roboto | 400   | 12 px | 19.92 px (`1.66em`)   | 0.39996 px (`0.03333em`)   | `none`      | `<span>`²   |
| `overline`  | Roboto | 400   | 12 px | 31.92 px (`2.66em`)   | 0.99996 px (`0.08333em`)   | `uppercase` | `<span>`²   |

¹ `subtitle1` / `subtitle2` default to `<h6>` per MUI's `defaultVariantMapping` — they share the heading semantic with `h6` but differ in size / weight / line-height.

² `button` / `caption` / `overline` default to `<span>` (`display: inline`); the rest default to a block-level element. The Figma `<Typography>` set encodes only the visual properties — the host application picks the actual HTML element via the source `component` / `as` prop.

`fontFamily` resolves to the literal stack `Roboto, Helvetica, Arial, sans-serif` for every variant. The browser-resolved `font-size` for variants whose MUI source uses `rem` units (e.g. `body1: 1rem`) is `1rem × 16px` since the project does not override `html { font-size }`.

## 2. Color axis — palette resolution (variant = `body1`)

`color` is the **only** paint Typography exposes — there is no background, border, or shadow. The runtime resolves each Merak color label (story-side mapping) to a single hex via `palette.text.*` (the three "text" colors) or `palette.<role>.main` (the six themed colors).

| Merak label (story) | MUI prop value (`color=…`)          | Computed `color`        | MUI palette source         |
| ------------------- | ----------------------------------- | ----------------------- | -------------------------- |
| `default`           | `textPrimary`                       | `rgba(0, 0, 0, 0.87)`   | `palette.text.primary`     |
| `secondary-text`    | `textSecondary`                     | `rgba(0, 0, 0, 0.6)`    | `palette.text.secondary`   |
| `disabled-text`     | `textDisabled`                      | `rgba(0, 0, 0, 0.38)`   | `palette.text.disabled`    |
| `primary`           | `primary`                           | `rgb(25, 118, 210)`     | `palette.primary.main`     |
| `secondary`         | `secondary`                         | `rgb(156, 39, 176)`     | `palette.secondary.main`   |
| `danger`            | `error`                             | `rgb(211, 47, 47)`      | `palette.error.main`       |
| `warning`           | `warning`                           | `rgb(237, 108, 2)`      | `palette.warning.main`     |
| `info`              | `info`                              | `rgb(2, 136, 209)`      | `palette.info.main`        |
| `success`           | `success`                           | `rgb(46, 125, 50)`      | `palette.success.main`     |

The same color resolves identically across every variant — i.e. the per-variant probe in §1 used `default` (`rgba(0,0,0,0.87)`) and would reproduce that exact hex on every other variant. The `Color` axis is therefore a pure text-fill rebind in Figma.

## 3. Defaults — margin / box behaviour

Every cell in `FullMatrix` (no `gutterBottom`, no `noWrap`, no `align`) renders with:

- `margin: 0 0 0 0` — MUI Typography removes the user-agent heading margins by default.
- `display: block` for headings + body; `display: inline` for `button` / `caption` / `overline`.
- No `padding`, no `border`, no `background`, no `box-shadow`.

This means the Figma cell needs only a single TEXT node bound to a text style + a fill — no auto-layout frame, no stroke, no effect.

## 4. Utility flags — `gutterBottom`, `noWrap`, `align`

These are runtime CSS rules. None of them are Figma component properties — designers either override them on the instance's inner TEXT (`align` / `noWrap`) or use Auto Layout `itemSpacing` on the surrounding column (`gutterBottom`). See `figma.spec.md` §2 and §3.1 for the rationale and the override pattern. The runtime numbers below let designers pick the right `itemSpacing` per Variant when reproducing `gutterBottom` outside the component.

### 4.1 `gutterBottom`

Adds `margin-bottom: 0.35em`. On `body1` (16 px), that resolves to `5.6 px`. The em ratio is constant across variants — Figma's BOOLEAN toggle just adds the same `0.35em` rule, so the effective px depends on the variant the instance is set to.

| Variant   | `0.35em` resolves to |
| --------- | -------------------- |
| `h1`      | 33.6 px              |
| `h2`      | 21 px                |
| `h3`      | 16.8 px              |
| `h4`      | 11.9 px              |
| `h5`      | 8.4 px               |
| `h6`      | 7 px                 |
| `subtitle1` / `body1` | 5.6 px   |
| `subtitle2` / `body2` / `button` | 4.9 px |
| `caption` / `overline` | 4.2 px      |

### 4.2 `noWrap`

Adds three CSS rules: `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`. In Figma terms, the TEXT node is set to `textTruncation: ENDING` (Figma's "truncate text" toggle) and the parent frame must constrain the max-width. There is no native Figma equivalent for `min-width: 0` (MUI also sets that to make `text-overflow` work inside flex parents) — Figma layers don't need it.

### 4.3 `align`

Sets `text-align: <left|center|right|justify|inherit>`. Mirrors directly to Figma's `textAlignHorizontal` (`LEFT` / `CENTER` / `RIGHT` / `JUSTIFIED`); `inherit` has no Figma equivalent — Figma always picks an explicit alignment.

## 5. State surface + synthetic axes

`<Typography>` is **non-interactive**. There is no `:hover`, `:active`, `:focus`, or `disabled` state surface on the component itself — `disabled-text` is just a color choice, not a state. The Figma component therefore has **no `State` axis** (compare to `<Button>`, which expands to 5 states).

### 5.1 Synthetic `Bold` axis (Figma-only)

The Figma component carries a `Bold` Variant axis (`Off` / `On`) that has **no MUI runtime counterpart**. MUI Typography exposes weight only via the `variant` prop's text style — there is no `bold` boolean. Designers use the axis to flip a TEXT to its bold-weight companion in one click without detaching the instance.

Because there's no MUI prop to reproduce at runtime, every `Bold=On` instance translates to **one of three** developer choices at handoff (the Figma master cannot disambiguate):

1. Wrap the run in `<strong>` / `<b>` (or apply `font-weight: 700` via `sx`) — keeps the same MUI variant, just adds emphasis. **Default** for inline emphasis runs.
2. Pick a different MUI variant whose runtime weight is heavier (`body1` → `subtitle1`, `subtitle2` → `h6`, etc.) — only when the visual hierarchy intent matches.
3. Override the rendered MUI variant via `slotProps`/`sx` to set `font-weight` for that one slot — rare; only when neither (1) nor (2) reads cleanly.

Designers should annotate the intent in dev mode so the right path is picked. See `figma.spec.md` §7.2 for variant-by-variant guidance.

The `Bold=On` cells bind to local text styles minted in this Figma file (under `material-design/typography/<v>-bold` for the 11 standard Variants and `component/typography/<v>-bold` for `Button` / `Overline`). Promotion to the shared design-system file is a future enhancement; until then, the bold companions are local-only — see `design-token.md`.

## 6. Project text style ↔ MUI runtime divergence

The project ships its own `material-design/typography/*` text-style namespace (see `figma-design-guide/design-token.md` §3) that the Figma component will bind via `textStyleId`. The styles match MUI's runtime sizes / weights / line-heights for the headings + body variants, but diverge in three places worth recording so the Figma render is not mistaken for a runtime regression.

| Field          | MUI runtime                                                                 | Project text style                                                          | Verdict                                                                                                                       |
| -------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `font-family`  | `Roboto, Helvetica, Arial, sans-serif`                                      | `Noto Sans TC` (and `Inter` for `h2` / `h5`)                                | Intentional — the project's primary writing system is Traditional Chinese; Noto Sans TC is the design-system font.            |
| `letter-spacing` | per-variant em values (range `-0.01562em` for `h1` to `0.08333em` for `overline`) | `0%` on every text style                                                | Intentional — the design system zeroes letter-spacing for the Noto Sans TC stack. Figma cells inherit `0%` from the text style. |
| `text-transform` (`button`) | `uppercase`                                                       | _no published `typography/button` style; design system never published one_  | Resolved: minted local `component/typography/button` (Noto Sans TC Medium 14/24, ls 0%) with `textCase: UPPER` baked in. Cell binds to it cleanly — no per-cell case override. See `design-token.md` and `figma.spec.md` §4.1. |
| `text-transform` (`overline`) | `uppercase`                                                     | `textCase: ORIGINAL` on `material-design/typography/overline`                | Resolved: minted local `component/typography/overline` (Noto Sans TC Regular 12/32, ls 0%) with `textCase: UPPER` baked in. Cell rebinds to the local sibling. The published `material-design/typography/overline` stays ORIGINAL per the design-system convention. See `design-token.md` and `figma.spec.md` §4.1. |
| `subtitle2` line-height | `21.98 px` (`1.57em`)                                              | `20 px`                                                                     | Project rounded down. Visual delta ≤ 2 px; accept-as-is.                                                                       |
| `subtitle2` weight | `500`                                                                   | `400` (Noto Sans TC Regular)                                                | Project chose Regular for subtitle2 (Noto Sans TC's Medium reads visibly heavier than Roboto Medium at 14 px). Accept-as-is.   |
| `h3` line-height | `56.016 px` (`1.167em`)                                                   | `60 px`                                                                     | Project rounded up to a 4-px-grid line. Visual delta ≤ 4 px; accept-as-is.                                                     |
| `h4` line-height   | `41.99 px` (`1.235em`)                                                  | `42 px`                                                                     | ≤ 0.01 px browser rounding; accept-as-is.                                                                                       |
| `body2` line-height | `20.02 px` (`1.43em`)                                                  | `20 px`                                                                     | ≤ 0.02 px browser rounding; accept-as-is.                                                                                       |
| `caption` line-height | `19.92 px` (`1.66em`)                                                | `20 px`                                                                     | ≤ 0.08 px browser rounding; accept-as-is.                                                                                       |
| `button` line-height | `24.5 px` (`1.75em`)                                                  | `24 px`                                                                     | Project rounded down to 4-px-grid line in the local `component/typography/button` style. Visual delta ≤ 0.5 px; accept-as-is.   |
| `overline` line-height | `31.92 px` (`2.66em`)                                               | `32 px`                                                                     | ≤ 0.08 px browser rounding; accept-as-is.                                                                                       |
| `button` typography | Roboto 500, 14 / 24.5 px, `0.4 px` ls, UPPERCASE                       | _no published text style; minted `component/typography/button` locally_     | Resolved — see the `text-transform (button)` row above.                                                                          |

## 7. Drift-check protocol

When MUI is upgraded (`package.json` `@mui/material`) or `.storybook/preview.tsx` adds a typography override:

1. Re-run `FullMatrix` against this document. Compare each cell of §1 / §2.
2. For each delta:
   - **Numeric (size / line-height / letter-spacing / margin-bottom)**: if MUI changed, edit `figma.spec.md` §3 / §6 and (when needed) re-bind the Figma text style. Then update §1 of this doc.
   - **Family / weight / textCase**: re-author the cell's text-style binding in `figma.spec.md` §4 and re-run `use_figma` against the affected variant slice.
   - **New variant** (e.g. MUI 8 adds `display1`): add a row to `Typography.stories.tsx`, append to §1 / §3 here, and add to the Figma component set's `Variant` axis options.
3. Sanity-check `gutterBottom` (§4.1) — if MUI changed the `0.35em` ratio, recompute every row.
4. If the divergence is a project decision (we override MUI), document it under §6 and leave the runtime number as-is. Do not silently re-bind the Figma cell.
5. Update the date in the runtime-context paragraph at the top of this file.

## 8. Open drift checks

None as of 2026-05-08. The §6 divergences are intentional design-system choices (Noto Sans TC / zeroed letter-spacing) or accept-as-is rounding deltas — not regressions.

---
name: figma-component-snackbar-storybook-render
description: Computed-style matrix for `<Snackbar>` (MUI 7.3.10) derived from `node_modules/@mui/material/Snackbar/Snackbar.js`, `SnackbarContent/SnackbarContent.js`, and `Alert/Alert.js` against the Storybook preview's default `createTheme()` (no overrides). Documents the SnackbarContent (Default) and Alert-filled (Success / Info / Warning / Error) bodies, the optional Action slot (Button / Close), the screen-level anchorOrigin offsets, and the drift-check protocol. Companion to `figma.spec.md` (the contract). Source-derived rather than browser-measured because Chrome DevTools MCP could not attach to the running Storybook profile during authoring (see §0).
parent_skill: figma-components
---

# `<Snackbar>` Storybook Render Measurements

Computed-style snapshot derived from MUI source resolved against the runtime palette / typography / shape (`.storybook/preview.tsx` calls `createTheme()` with no overrides). Stories used as the contract: `Default` / `DefaultWithClose` / `Success` / `Info` / `Warning` / `Error` / `WithTitle` (single-variant), `LongMessage` (wrap), `VariantMatrix` (5 Variants × 3 Actions = 15 cells), `AnchorOriginMatrix` (6 anchor positions, illustrative). These are the runtime numbers a Figma authoring pass should reproduce; if Storybook output diverges, the spec — not the runtime — is the source-of-truth, but the divergence is a red flag worth filing.

## 0. Methodology note

Chrome DevTools MCP could not attach to the local Storybook (port 6006) during authoring on 2026-05-08 — the same profile-lock condition recorded in `<Tooltip>` / `<Chip>` `storybook.render.md` §0. The values below were derived from MUI source files (`Snackbar.js`, `SnackbarContent.js`, `Alert.js`) resolved against the runtime theme (extracted with `node -e "const { createTheme, emphasize } = require('@mui/material'); const t = createTheme(); …"`); paints, paddings, fonts, and shadows in the default-theme path are deterministic, so the source-derived values match what the browser would compute. **Re-measure with Chrome DevTools MCP when the lock is cleared** and update §7 drift checks if any divergence appears (sub-pixel widths from `Roboto` text rendering, exact `transition` strings, Grow's `transform` keyframes).

Storybook compile sanity-check — story IDs `components-snackbar--{docs,default,default-with-close,success,info,warning,error,with-title,variant-matrix,anchor-origin-matrix,long-message}` resolved against `http://localhost:6006/index.json` on 2026-05-08.

## 1. Snackbar root (positioning wrapper) — every cell, every variant

Source: `Snackbar.js:34-107` (`SnackbarRoot` styled `<div>`). The Snackbar root is the `position: fixed` viewport anchor — it has **no body visuals** (no fill, no stroke, no shadow). Its only job is to push the inner content (SnackbarContent / Alert) to one of 6 screen-level positions.

| Property              | Value                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------- |
| `position`            | `fixed`                                                                                |
| `z-index`             | `1400` (`theme.zIndex.snackbar`)                                                       |
| `display`             | `flex`                                                                                 |
| `justify-content`     | per `anchorOrigin.horizontal` — see §1.1                                               |
| `align-items`         | `center`                                                                               |
| `left` / `right`      | `8 px` (mobile) / `24 px` (sm breakpoint, `≥ 600 px` viewport) — per anchor — see §1.1 |
| `top` / `bottom`      | `8 px` (mobile) / `24 px` (sm) — per `anchorOrigin.vertical` — see §1.1                |
| `transform`           | `translateX(-50%)` only when `anchorOrigin.horizontal === 'center'` (sm breakpoint)    |
| `background-color`    | n/a — root is transparent                                                              |
| `border-radius`       | n/a                                                                                    |
| `box-shadow`          | n/a                                                                                    |

The Figma component does **not** model the `position: fixed` wrapper. The published cell is the SnackbarContent / Alert body — designers compose the screen-level placement by hand on the consuming frame. See `figma.spec.md` §7 #2.

### 1.1 anchorOrigin offsets (illustrative, screen-level only)

The 6 `anchorOrigin` permutations resolve to these CSS rules. None of them affects the SnackbarContent / Alert body's bounding box, fill, padding, typography, or any other visual on the cell itself.

| `vertical` | `horizontal` | Mobile (< 600 px)                       | sm breakpoint (≥ 600 px)                                              |
| ---------- | ------------ | --------------------------------------- | --------------------------------------------------------------------- |
| `top`      | `left`       | `top: 8; left: 8; right: 8`             | `top: 24; left: 24; right: auto; justify-content: flex-start`         |
| `top`      | `center`     | `top: 8; left: 8; right: 8`             | `top: 24; left: 50%; right: auto; transform: translateX(-50%)`        |
| `top`      | `right`      | `top: 8; left: 8; right: 8`             | `top: 24; left: auto; right: 24; justify-content: flex-end`           |
| `bottom`   | `left`       | `bottom: 8; left: 8; right: 8`          | `bottom: 24; left: 24; right: auto; justify-content: flex-start`      |
| `bottom`   | `center`     | `bottom: 8; left: 8; right: 8`          | `bottom: 24; left: 50%; right: auto; transform: translateX(-50%)`     |
| `bottom`   | `right`      | `bottom: 8; left: 8; right: 8`          | `bottom: 24; left: auto; right: 24; justify-content: flex-end`        |

Default `anchorOrigin = { vertical: 'bottom', horizontal: 'left' }` per `Snackbar.js:120-126`.

## 2. SnackbarContent (Default Variant) — every cell where Variant=Default

Source: `SnackbarContent.js:32-69`. The `Default` Variant uses MUI's grey emphasized SnackbarContent — a `Paper elevation={6}` surface with high-contrast white text against a near-black bg. Every numeric below is constant across (Action × Default).

| Property              | Value                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| `display`             | `flex`                                                                                         |
| `align-items`         | `center`                                                                                       |
| `flex-wrap`           | `wrap` (action wraps to next line when message + action exceed `min-width: 288 px`)            |
| `padding`             | `6 px 16 px` (`6` top / bottom, `16` left / right)                                             |
| `flex-grow`           | `1` (mobile, occupies viewport width); `initial` at sm breakpoint (`≥ 600 px`)                 |
| `min-width`           | `288 px` (sm breakpoint; mobile is full-width)                                                 |
| `border-radius`       | `4 px` (`shape.borderRadius`)                                                                  |
| `background-color`    | `rgb(50, 50, 50) = #323232` (`emphasize(palette.background.default, 0.8)` light-mode → `darken('#fff', 0.8)`) |
| `color`               | `#FFFFFF` (`getContrastText(#323232)` resolves to white)                                       |
| `font-family`         | `"Roboto", "Helvetica", "Arial", sans-serif` (`typography.body2`)                              |
| `font-size`           | `0.875 rem = 14 px` (`typography.body2.fontSize`)                                              |
| `font-weight`         | `400` (`typography.body2.fontWeight`)                                                          |
| `line-height`         | `1.43` (resolves to `~20 px` at 14 px font)                                                    |
| `letter-spacing`      | `0.01071em` (≈ `0.15 px` at 14 px)                                                             |
| `box-shadow`          | `0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)` (`shadows[6]`, MUI elevation 6) |
| `box-sizing`          | `border-box` (Paper inherits)                                                                  |

### 2.1 SnackbarContent.message slot

Source: `SnackbarContent.js:54-59`. The `<div className="MuiSnackbarContent-message">` wrapper around the message content.

| Property        | Value         |
| --------------- | ------------- |
| `padding`       | `8 px 0`      |

### 2.2 SnackbarContent.action slot

Source: `SnackbarContent.js:60-69`. The `<div className="MuiSnackbarContent-action">` wrapper around the action node (Button / IconButton).

| Property           | Value                              |
| ------------------ | ---------------------------------- |
| `display`          | `flex`                             |
| `align-items`      | `center`                           |
| `margin-left`      | `auto`                             |
| `padding-left`     | `16 px`                            |
| `margin-right`     | `-8 px` (negative — pulls the action visually flush with the right edge of the content's `16 px` padding) |

The negative `margin-right: -8` cancels the SnackbarContent's `padding-right: 16` for the trailing action: net trailing whitespace becomes `16 - 8 = 8 px` from the action's right edge to the content's right edge. This is intentional per MUI source — actions read closer to the edge than the message.

## 3. Alert (filled variant) — Variants Success / Info / Warning / Error

Source: `Alert.js:44-108` (root + filled variant rule), `Alert.js:109-136` (icon / message / action slots), `Alert.js:138-150` (default icon mapping). The 4 Severity Variants share every numeric below; only the bg / color resolve per severity (see §3.1). MUI's filled-variant root sets `fontWeight: 500` (medium) and `color = getContrastText(palette[color].main)` — for all 4 default-theme severities this is `#FFFFFF`.

| Property              | Value                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| `display`             | `flex`                                                                                         |
| `padding`             | `6 px 16 px`                                                                                   |
| `background-color`    | per Severity — see §3.1                                                                        |
| `color`               | `#FFFFFF` (per `getContrastText(palette[severity].main)` → all 4 severities resolve to white)  |
| `font-family`         | `"Roboto", "Helvetica", "Arial", sans-serif` (`typography.body2`)                              |
| `font-size`           | `0.875 rem = 14 px` (`typography.body2.fontSize`)                                              |
| `font-weight`         | `500` (`typography.fontWeightMedium` — overrides body2's `400` per `Alert.js:97`)              |
| `line-height`         | `1.43` (`~20 px`)                                                                              |
| `letter-spacing`      | `0.01071em` (`~0.15 px`)                                                                       |
| `border-radius`       | `4 px` (Paper / `shape.borderRadius`)                                                          |
| `box-shadow`          | `none` — `Alert.js:206` passes `elevation: 0` to Paper                                         |

### 3.1 Per-Severity bg

| Severity  | `palette.<severity>.main` | bg (filled, light theme)  | color (contrast)  |
| --------- | ------------------------- | ------------------------- | ----------------- |
| `success` | `#2e7d32`                 | `#2e7d32`                 | `#FFFFFF`         |
| `info`    | `#0288d1`                 | `#0288d1`                 | `#FFFFFF`         |
| `warning` | `#ed6c02`                 | `#ed6c02`                 | `#FFFFFF`         |
| `error`   | `#d32f2f`                 | `#d32f2f`                 | `#FFFFFF`         |

The standard / outlined variants compute bg / color via `lighten` / `darken` with a 0.6 / 0.9 ratio — they're **not** modeled in this spec (filled is the canonical Snackbar-with-Alert visual). If a future PR adds standard / outlined Alert support to the Snackbar Variant axis, derive their values from `Alert.js:63-90` and update §3.

### 3.2 Alert.icon slot

Source: `Alert.js:109-118`.

| Property           | Value                              |
| ------------------ | ---------------------------------- |
| `display`          | `flex`                             |
| `margin-right`     | `12 px`                            |
| `padding`          | `7 px 0`                           |
| `font-size`        | `22 px`                            |
| `opacity`          | `0.9`                              |
| `color`            | inherits parent (`#FFFFFF` for filled) — the per-icon override at `Alert.js:71-75` only applies to `standard` / `outlined` |

The default icon mapping (`Alert.js:138-150`) wires:

| Severity  | Icon component                                         | SVG glyph                  |
| --------- | ------------------------------------------------------ | -------------------------- |
| `success` | `internal/svg-icons/SuccessOutlined`                   | check-circle outlined      |
| `info`    | `internal/svg-icons/InfoOutlined`                      | info circle outlined       |
| `warning` | `internal/svg-icons/ReportProblemOutlined`             | warning triangle outlined  |
| `error`   | `internal/svg-icons/ErrorOutline`                      | exclamation circle outlined |

All 4 icons render at `font-size: 22 px` (Alert.icon's font-size) inside a `flex` container with `7 0` padding — total icon column width is `12 + 22 = 34 px` (margin-right + icon glyph) plus the parent's `6 16` padding-left.

### 3.3 Alert.message slot

Source: `Alert.js:119-126`.

| Property        | Value           |
| --------------- | --------------- |
| `padding`       | `8 px 0`        |
| `min-width`     | `0`             |
| `overflow`      | `auto`          |

Same vertical padding as `SnackbarContent.message` (§2.1). The vertical centering between icon (`7 0` padding) and message (`8 0` padding) leaves a 1 px asymmetry MUI accepts as part of the Alert visual rhythm.

### 3.4 Alert.action slot

Source: `Alert.js:127-136`.

| Property           | Value                              |
| ------------------ | ---------------------------------- |
| `display`          | `flex`                             |
| `align-items`      | `flex-start` (differs from SnackbarContent's `center` per §2.2) |
| `padding`          | `4 px 0 0 16 px` (`4` top, `0` right / bottom, `16` left)        |
| `margin-left`      | `auto`                             |
| `margin-right`     | `-8 px`                            |

The `align-items: flex-start` pins the action's top edge to the Alert's top — when the message wraps to multiple lines, the action stays at the top instead of vertically centering (which is what SnackbarContent does — see §2.2). This is an intentional Alert UX choice: the action's affordance is most discoverable at the leading edge of the message.

When the action is `null` and `onClose` is set, MUI auto-renders an `IconButton[size="small"][color="inherit"]` containing an `internal/svg-icons/Close` glyph (`Alert.js:247-261`). The button uses MUI IconButton's `size="small"` defaults: `padding: 5 px`, `font-size: 18 px`. Net: the close glyph occupies `5 + 18 + 5 = 28 px` square.

## 4. SnackbarContent vs Alert action geometry — side-by-side

Same axis, different vertical alignment. Useful for visualizing the cross-content delta when authoring.

| Property            | SnackbarContent (Default Variant) | Alert filled (Severity Variants) |
| ------------------- | --------------------------------- | -------------------------------- |
| Action `align-items` | `center`                         | `flex-start`                     |
| Action `padding`    | `0 0 0 16` (left only)            | `4 0 0 16` (top + left)          |
| Action `margin-right` | `-8`                            | `-8`                             |

## 5. Action button visuals

The action slot's contents are unconstrained — MUI accepts any ReactNode. The Storybook stories pin two patterns (`button` and `close`) so step-3 / step-5 can encode them as the `Action` variant axis:

### 5.1 Button (text-style action — e.g. "UNDO")

`<Button color="inherit" size="small">UNDO</Button>` — small variant of MUI Button.

| Property        | Value                                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| `padding`       | `4 px 5 px` (text-variant small)                                               |
| `font-size`     | `0.8125 rem = 13 px` (Button small)                                            |
| `font-weight`   | `500` (`typography.button.fontWeight`)                                         |
| `line-height`   | `1.75` (Button)                                                                |
| `letter-spacing`| `0.02857em`                                                                    |
| `text-transform`| `uppercase`                                                                    |
| `color`         | `inherit` from Snackbar / Alert root — `#FFFFFF` for both Default and Severity |
| `min-width`     | `64 px` (`buttonClasses.sizeSmall.minWidth = 64`)                              |
| `border-radius` | `4 px`                                                                         |
| `background-color` | `transparent` (text variant)                                                |

For the **Default** Variant (grey SnackbarContent, `color === 'default'` in stories), the story passes `color="primary"` instead of `color="inherit"` so the action reads as MUI's signature primary blue (`#1976d2` text on grey bg). MUI Snackbar docs use this pattern for the canonical "UNDO" CTA. See divergence #4 in §7.

### 5.2 Close (icon-style action — `<IconButton><CloseIcon/></IconButton>`)

`<IconButton size="small" color="inherit"><CloseIcon /></IconButton>` — close glyph inside a small icon button.

| Property        | Value                                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| Outer width × height | `28 × 28 px` runtime (`5 + 18 + 5`) — see "glyph size resolution" below       |
| `padding`       | `5 px` (IconButton small)                                                      |
| `border-radius` | `50%` (IconButton)                                                             |
| `color`         | `inherit` from Snackbar / Alert root — `#FFFFFF` for Default and Severity      |
| Glyph `fill`    | `currentColor` (inherits from IconButton)                                      |
| Background hover | `rgba(255, 255, 255, 0.08)` for `color="inherit"` — n/a for the static cell   |

**Glyph size resolution (canonical = `18 × 18 px`, story = `20 × 20 px`):**

The close glyph has two competing size sources, both honest:

| Source                       | Size        | Reason                                                                                              |
| ---------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| MUI runtime (Figma canonical) | `18 × 18 px` | `IconButton[size="small"]` styled rule sets `fontSize: pxToRem(18)`. The inner SvgIcon's `fontSize="small"` (which would normally be `1.25 rem = 20 px`) is overridden by IconButton's small-size rule because the SvgIcon renders at `1em` and inherits `font-size` from the IconButton. Net visible glyph = 18 px. |
| Storybook story              | `20 × 20 px` | `<CloseGlyph size={20}/>` passes `width={20} height={20}` directly to the inline `<svg>`. SVG width/height attributes ignore the parent's `font-size` cascade — the SVG renders at its declared 20 × 20 regardless of IconButton's `fontSize: 18`. The story renders 2 px larger than MUI runtime by an oversight; visual delta is barely perceptible. |
| Figma cell (`figma.spec.md` §6.4.2) | `18 × 18 px` | Mirrors MUI runtime — the canonical authoritative number. |

The Figma cell is the source-of-truth. If you re-measure with Chrome DevTools MCP and observe a 20 px glyph, that's the story's 20 px width attribute showing through, not MUI's IconButton size="small" runtime — fix the story (`size={18}`) rather than the cell. Tracked in `figma.spec.md` §7 if you'd like to add it as a divergence; otherwise treat it as a story-only oversight.

Storybook stories render the close icon as a 20 × 20 inline SVG (matching MUI's CloseIcon viewBox `0 0 24 24`); the visible glyph occupies ~16 × 16 within the 20 × 20 SVG box.

## 6. MUI tokens that drive every paint above

Anyone re-deriving the values can plug a different theme into the same source paths and get a new resolution table.

| MUI token                                              | Default-theme value                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| `palette.background.default`                           | `#FFFFFF`                                                          |
| `palette.background.paper`                             | `#FFFFFF`                                                          |
| `emphasize(palette.background.default, 0.8)` (light)   | `rgb(50, 50, 50)` = `#323232` (SnackbarContent body bg)            |
| `palette.getContrastText(#323232)`                     | `#FFFFFF`                                                          |
| `palette.success.main`                                 | `#2e7d32` (Alert filled Success bg)                                |
| `palette.info.main`                                    | `#0288d1` (Alert filled Info bg)                                   |
| `palette.warning.main`                                 | `#ed6c02` (Alert filled Warning bg)                                |
| `palette.error.main`                                   | `#d32f2f` (Alert filled Error bg)                                  |
| `palette.getContrastText(palette.<severity>.main)`     | `#FFFFFF` (all 4)                                                  |
| `palette.primary.main`                                 | `#1976d2` (Default-Variant Action button text)                     |
| `shape.borderRadius`                                   | `4` (px) — both SnackbarContent and Alert                          |
| `shadows[6]`                                           | `0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)` (SnackbarContent only; Alert is flat) |
| `typography.body2.fontFamily`                          | `"Roboto", "Helvetica", "Arial", sans-serif`                       |
| `typography.body2.fontSize`                            | `0.875 rem = 14 px`                                                |
| `typography.body2.fontWeight`                          | `400` (Default Variant); `500` (Alert filled per `Alert.js:97`)    |
| `typography.body2.lineHeight`                          | `1.43`                                                             |
| `typography.body2.letterSpacing`                       | `0.01071em`                                                        |
| `typography.fontWeightMedium`                          | `500`                                                              |
| `typography.button.fontSize` (Button small)            | `0.8125 rem = 13 px`                                               |
| `typography.button.fontWeight`                         | `500`                                                              |
| `typography.button.letterSpacing`                      | `0.02857em`                                                        |
| `typography.button.textTransform`                      | `uppercase`                                                        |
| `zIndex.snackbar`                                      | `1400`                                                             |
| `transitions.duration.enteringScreen`                  | `225 ms`                                                           |
| `transitions.duration.leavingScreen`                   | `195 ms`                                                           |

`theme.vars` is **off** in this project's `createTheme()` call, so the Alert filled variant uses the `palette[color].main` + `getContrastText(...)` path (`Alert.js:101-104`); the `theme.vars.palette.Alert[<color>FilledBg / FilledColor]` branch is not exercised.

## 7. Drift checks

Re-derive these values whenever the cited source changes; if a measurement diverges, file an issue or accept the divergence in `figma.spec.md` §7 with a one-line rationale.

1. **`@mui/material` minor / major bump.** Re-run `node -e "const { createTheme, emphasize } = require('@mui/material'); …"` to confirm `emphasize(background.default, 0.8) === rgb(50, 50, 50)` and the 4 severity `main` values haven't shifted. MUI 6 → 7 already tweaked the default Snackbar bg from `#000000DE` (`alpha(black, 0.87)`) to today's `emphasize(...)` — a future bump could shift it again.
2. **Custom theme override** (`.storybook/preview.tsx`). If the project introduces a custom `palette.background.default` or `palette.<severity>.main`, every §2 / §3 bg / color value re-resolves. Specifically, a dark-mode preview decorator (`mode: 'dark'`) flips the SnackbarContent emphasize ratio from `0.8` to `0.98` and sources `lighten` instead of `darken` — net Snackbar bg becomes near-white (`emphasize('#121212', 0.98) ≈ #FAFAFA`) with `getContrastText` flipping to `rgba(0,0,0,0.87)`.
3. **`theme.vars` opt-in** (`createTheme({ cssVariables: true })`). Switches Alert filled bg from `palette[color].main` to `vars.palette.Alert.<color>FilledBg` and the SnackbarContent bg to `vars.palette.SnackbarContent.bg` — both can shift hex values and require a fresh §2 / §3 derivation.
4. **MUI Alert variant default**. The story currently pins `variant="filled"` for severity cells. If MUI flips the default to `standard` and the project follows, every §3 bg / color collapses to a `lighten` / `darken` pair instead of `palette[color].main`.
5. **MUI close-icon swap.** `Alert.js:23-27` imports 4 internal SVG icons; if MUI swaps `internal/svg-icons/SuccessOutlined` for a different icon set (e.g. fluent / outline-rounded), the §3.2 glyph table needs to be re-resolved. Currently the spec ships `check-circle outlined` for success — if MUI moves to `check-rounded`, update both `figma.spec.md` and the published Figma cells.
6. **Paper elevation default.** SnackbarContent uses Paper at `elevation={6}` (`SnackbarContent.js:86`). Alert uses Paper at `elevation={0}` (`Alert.js:206`). If MUI changes the default Paper elevation API (e.g. moves from numeric levels to a `tone` enum), §2 box-shadow needs re-derivation against the new mapping.
7. **MUI Button small min-width.** Button small variant currently has `minWidth: 64`. If the design system overrides Button with a smaller min-width (the project ships its own `<Button>` spec at `.claude/skills/figma-components/Button/figma.spec.md`), §5.1 needs to align with the project's overridden Button — currently the Snackbar action button is the **MUI** Button, not the project's overridden one, because the package re-exports MUI Button directly. ~~This row is open until the project's Button override is merged into the Snackbar action.~~

## 8. Storybook story → measurement targets

| Story ID                                  | What to measure                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `components-snackbar--default`            | SnackbarContent bg (`#323232`), text fill, action Button color (primary blue), padding `6 16`     |
| `components-snackbar--default-with-close` | SnackbarContent + IconButton close — 28 px button, 20 px glyph, action `margin-right: -8`        |
| `components-snackbar--success`            | Alert filled Success bg (`#2e7d32`), icon (check-circle 22 px @ 0.9 α), text white               |
| `components-snackbar--info`               | Alert filled Info bg (`#0288d1`), icon (info-circle 22 px), text white                           |
| `components-snackbar--warning`            | Alert filled Warning bg (`#ed6c02`), icon (warning-triangle 22 px), text white                   |
| `components-snackbar--error`              | Alert filled Error bg (`#d32f2f`), icon (exclamation-circle 22 px), close button visible         |
| `components-snackbar--with-title`         | AlertTitle delta — Roboto Medium 16 px / 1.5 line-height; not modeled as a Variant axis (§7 #2 of `figma.spec.md`) |
| `components-snackbar--variant-matrix`     | All 15 Variant × Action cells side-by-side — verify per-Severity bg / text                        |
| `components-snackbar--anchor-origin-matrix` | 6 anchor positions — verify positioning offsets (§1.1) but body visuals identical               |
| `components-snackbar--long-message`       | Message wraps inside `min-width: 288` body; action stays at top-right (Alert) vs. center-right (SnackbarContent) |

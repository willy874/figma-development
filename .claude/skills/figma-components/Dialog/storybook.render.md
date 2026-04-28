---
name: figma-component-dialog-storybook-render
description: Computed-style snapshot for `<Dialog>`, `<DialogTitle>`, `<DialogContent>`, and `<DialogActions>` measured against `src/stories/Dialog.stories.tsx` via Chrome DevTools MCP. Documents shell metrics per `Size`, slot paddings, divider strokes, typography (h6 title, body1 description), and the actions-row spacing mechanism. Companion to `figma.spec.md` (the contract).
parent_skill: figma-components
---

# `<Dialog>` Storybook Render Measurements

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/Dialog.stories.tsx` running on `http://localhost:6006`. Stories used: `SizeXs / SizeSm / SizeMd / SizeLg / SizeXl` (one shell per `Size`), `ContentDividersFalse`, `ContentDividersTrue`. The story file renders every Dialog inline (`disablePortal hideBackdrop disablePortal …`) so multiple shells can share the page; the inline-positioning `sx` only neutralises the fixed-position container — paint, padding, and typography numbers come straight from MUI's stock styles and are unaffected.

The Storybook does not wrap MUI's Dialog with a project-side `Dialog.tsx` — the package re-exports `@mui/material` directly. Every measurement below is therefore the MUI 7 default treatment for the listed `maxWidth` value.

## 1. Shell `<Dialog>` (`MuiDialog-paper`)

Measured on `SizeXs` cell (representative; only `width` / `max-width` change across `Size`). Theme is light.

| Property                          | Value                                                                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `background-color`                | `rgb(255, 255, 255)` — `theme.palette.background.paper` (light)                                                                                         |
| `color` (default text colour)     | `rgba(0, 0, 0, 0.87)` — `theme.palette.text.primary` (light)                                                                                            |
| `border-radius`                   | `4 px` — `theme.shape.borderRadius`                                                                                                                     |
| `padding`                         | `0` (children own their padding)                                                                                                                        |
| `box-shadow` (`Paper elevation={24}`) | composite of three drop shadows: `0 11px 15px -7px rgba(0,0,0,0.2)`, `0 24px 38px 3px rgba(0,0,0,0.14)`, `0 9px 46px 8px rgba(0,0,0,0.12)`           |
| `margin`                          | `32 px` (overridden to `0` in the story so multiple shells stack inline; production callers keep MUI's default 32 px gutter to the viewport edge)        |
| layout                            | `display: flex; flex-direction: column;` — vertical Auto Layout, hugs slot stack height                                                                  |

### 1.1 Width per `Size`

`Size` maps directly to MUI's `Dialog.maxWidth`. Empty cells in the Storybook iframe were measured at **viewport width 1168 px**, so `lg` and `xl` are clamped by the viewport but their `max-width` value is the canonical spec target.

| Story / Size             | `max-width` | `width` (rendered, viewport=1168) |
| ------------------------ | ----------- | --------------------------------- |
| `SizeXs` (`maxWidth=xs`) | `444 px`    | `444 px`                          |
| `SizeSm` (`maxWidth=sm`) | `600 px`    | `600 px`                          |
| `SizeMd` (`maxWidth=md`) | `900 px`    | `900 px`                          |
| `SizeLg` (`maxWidth=lg`) | `1200 px`   | `1168 px` (clamped by viewport)   |
| `SizeXl` (`maxWidth=xl`) | `1536 px`   | `1168 px` (clamped by viewport)   |

> Figma should author the **canonical `max-width` value** for every `Size` (`444 / 600 / 900 / 1200 / 1536`); the runtime clamp is an expected artefact of narrow viewports, not a Figma value to encode.

## 2. `<DialogTitle>` (`MuiDialogTitle-root`)

| Property         | Value                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| `padding`        | `16 px 24 px` (T/B = 16, L/R = 24)                                                                     |
| `font-family`    | `Roboto, Helvetica, Arial, sans-serif` — MUI 7 `theme.typography.h6.fontFamily` (default Roboto stack) |
| `font-size`      | `20 px`                                                                                                |
| `font-weight`    | `500` (Medium)                                                                                         |
| `line-height`    | `32 px`                                                                                                |
| `letter-spacing` | `0.15 px` (`theme.typography.h6.letterSpacing = 0.0075em` × 20 px)                                     |
| `color`          | inherits from Paper (`rgba(0, 0, 0, 0.87)`)                                                            |
| `text-transform` | `none`                                                                                                 |

> The title's role is `theme.typography.h6` — Roboto Medium, **not** Noto Sans TC. Earlier revisions of the spec listed Noto Sans TC; that was wrong for MUI 7's default theme.

## 3. `<DialogContent>` (`MuiDialogContent-root`)

| Property      | `Dividers=false` (default)         | `Dividers=true`                                                                                                                  |
| ------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `padding`     | `0 24 px 20 px 24 px` (T R B L)    | `16 px 24 px` (T/B = 16, L/R = 24)                                                                                                |
| `border-top`  | `0` (none)                         | `1 px solid rgba(0, 0, 0, 0.12)` — `theme.palette.divider` (light)                                                                |
| `border-bottom` | `0` (none)                       | `1 px solid rgba(0, 0, 0, 0.12)` — `theme.palette.divider` (light)                                                                |
| layout        | hugs body content                  | hugs body content + 1 px stroke each end                                                                                          |
| `overflow-y`  | `auto`                             | `auto` (scrollable; the strokes render at the visible viewport edges)                                                              |

> MUI 7 reduced the dividers padding from the legacy `20 24` to `16 24`. The vertical 16 px keeps the body away from the strokes by the same margin as the title's bottom padding.

## 4. `<DialogContentText>` (description body — `MuiDialogContentText-root`)

Default rendering for the `<DialogContentText>` helper used inside the body slot. Without the `variant` prop MUI 7 renders this as **`body1`**, not `body2`.

| Property         | Value                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| `font-family`    | `Roboto, Helvetica, Arial, sans-serif`                                                                 |
| `font-size`      | `16 px`                                                                                                |
| `font-weight`    | `400` (Regular)                                                                                        |
| `line-height`    | `24 px`                                                                                                |
| `letter-spacing` | `0.15008 px` (≈ `0.00938em` × 16 px — MUI 7 `body1.letterSpacing`)                                     |
| `color`          | `rgba(0, 0, 0, 0.6)` — `theme.palette.text.secondary` (light)                                          |
| `text-transform` | `none`                                                                                                 |

> If the description is meant to use `body2` (Roboto 14 / 20), the caller must pass `variant="body2"` explicitly. The Figma spec previously assumed `body2` — that was wrong for MUI 7's default. Author the description text style to match `body1` unless the project introduces a project-level MUI override.

## 5. `<DialogActions>` (`MuiDialogActions-root`)

| Property          | Value                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `padding`         | `8 px` (all sides) — MUI's `MuiDialogActions-root` default                                                                        |
| `display`         | `flex`                                                                                                                           |
| `justify-content` | `flex-end`                                                                                                                       |
| `align-items`     | `center`                                                                                                                         |
| inter-button gap  | **margin-based**: `& > :not(style) ~ :not(style) { margin-left: 8 px }` — there is no `gap` declaration; siblings carry the 8 px |
| `flex` (no wrap)  | `flex-wrap: nowrap` — actions row never wraps                                                                                    |

> **Padding is `8 px`, not `16 px`.** The legacy spec quoted `16 / 16` on all sides; that was wrong. MUI ships `padding: 8` as the actions row default. The 8 px-margin between siblings means a 1-button row leaves the button flush right with `8 px` on every side; multi-button rows separate by 8 px.
>
> For Figma, model the actions row as **horizontal Auto Layout, padding `8 px`, item gap `8 px`** — semantically identical to MUI's runtime even though the implementation uses sibling margins instead of `gap`.

## 6. Drift checks (Figma ↔ runtime)

The Figma component sets ship cells whose paint values diverge from MUI 7 runtime in a few places. Each divergence below was verified at the live-runtime numbers in this file; whether to align Figma to runtime is tracked in `figma.spec.md` §7.

1. **Title font family.** Runtime `Roboto`. Catalogue `material-design/typography/h6` ships as `Noto Sans TC Medium`. — **Open**: align catalogue h6 to Roboto, or document Noto-Sans-TC as the canonical h6 family. Surfaces only when designers type into the title slot.
2. **Title letter-spacing.** Runtime `0.15 px`. Catalogue h6 ships at `letter-spacing: 0%`. — **Open**: update the catalogue h6 text style.
3. **Description typography (`<DialogContentText>` default).** Runtime `body1` (16 / 24 / 0.15008). Earlier spec assumed `body2` (14 / 20 / 0.17). — **Open**: designers dropping description text into `<DialogContent>` apply `material-design/typography/body1`; revisit if the project unifies on Roboto.
4. ~~**`<DialogContent Dividers=true>` padding.**~~ **Resolved 2026-04-29.** Figma cell `1:4764` re-authored to `padding: 16 24` (was `20 24`).
5. ~~**`<DialogActions>` padding.**~~ **Resolved 2026-04-29.** Component `1:4757` re-authored to HORIZONTAL Auto Layout, `padding: 8`, `itemSpacing: 8`, `primaryAxisAlignItems: MAX (flex-end)`, `counterAxisAlignItems: CENTER` (was VERTICAL `padding: 16` `align-items: center`).
6. **Shell elevation.** **Resolved 2026-04-29 — with intentional alpha divergence.** All 5 Size cells re-bound from `shadows-8` to the file's published `material-design/shadows/shadows-24` effect style (id `S:69f1ad5e…`), which uses the design-system MD ramp triplet `α 0.02 / 0.14 / 0.12` — **softer than MUI's runtime `α 0.2 / 0.14 / 0.12`**. The whole `shadows-1…24` ramp uses the same 0.02 key-light alpha; matching MUI 1:1 would diverge from every other elevated surface in the library (Card, Menu, Drawer, etc.). Treat the alpha drift as design-system intent, not a bug. Shell `bg-default` fill also re-bound from a consumed-library copy to local `VariableID:223:4180`.
7. **`<DialogContent Dividers=false>` top padding `0`.** Confirmed — title's bottom padding (16 px) supplies the gap above the body.
8. **Actions inter-button spacing implementation.** Runtime uses `margin-left` between siblings; Figma now uses Auto Layout `gap: 8 px`. Visually identical; treated as an implementation detail, **not** a divergence.
9. ~~**Local-only stroke on `<DialogContent Dividers=true>`.**~~ **Resolved 2026-04-29.** Cell `1:4764` divider stroke re-bound from a consumed-library copy to local `merak/alias/colors/border-defalt` (`VariableID:223:4183`) at α 0.12.

## 7. Static-render limitations

The Storybook stories cannot probe the following pseudo-class states without `storybook-addon-pseudo-states`:

- `:hover` on action `<Button>` instances inside `<DialogActions>` (the buttons follow `<Button>` spec rules, not the Dialog spec).
- Backdrop `:hover` / focus chain — production Dialogs always render the backdrop, but the stories suppress it via `hideBackdrop`. Backdrop colour (`alias/layout/mask-bg = rgba(0,0,0,0.5)`) is documented in `figma.spec.md` §4 and not measured here.
- Transition timing (`onAfterClose`, MUI fade/grow) — runtime-only, no design representation.

## 8. Probe commands

For reproducibility the following Chrome DevTools MCP scripts produced the numbers above. All scripts were run after `await new Promise(r => setTimeout(r, 1500))` to let MUI mount the Paper.

```js
// Shell + slot computed styles (used for §1, §2, §3 dividers=false, §4, §5):
const paper = document.querySelector('.MuiDialog-paper');
const title = document.querySelector('.MuiDialogTitle-root');
const content = document.querySelector('.MuiDialogContent-root');
const actions = document.querySelector('.MuiDialogActions-root');
const desc = document.querySelector('.MuiDialogContentText-root');
return { paper: getComputedStyle(paper), title: getComputedStyle(title), … };

// Dividers=true (§3 / §6.4):
location.href = 'http://localhost:6006/iframe.html?id=components-dialog--content-dividers-true&viewMode=story';
// then re-probe MuiDialogContent-root padding + border-top/bottom

// Per-Size width (§1.1):
for (const id of ['size-xs', 'size-sm', 'size-md', 'size-lg', 'size-xl']) {
  location.href = `http://localhost:6006/iframe.html?id=components-dialog--${id}&viewMode=story`;
  // probe getComputedStyle(MuiDialog-paper).width / max-width
}
```

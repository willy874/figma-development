---
name: figma-component-snackbar-design-token
description: Component-scoped design tokens for `<Snackbar>`. Defined here because they're either MUI-Snackbar-specific runtime constants (the SnackbarContent emphasized-grey bg, computed via `emphasize(palette.background.default, 0.8)`) or pre-alpha'd tokens needed to dodge Figma's `paint.opacity < 1 + bound variable` flattening rule (the leading severity icon's 90 % α white). Bind Snackbar paints / strokes / effects to these names rather than literal values; for shared tokens used by Snackbar (seed colors, alias colors, MD shadows), see `.claude/skills/figma-design-guide/design-token.md`.
parent_skill: figma-components
---

# `<Snackbar>` Component Tokens

Tokens scoped to `<Snackbar>` and the sibling `<SnackbarSeverityIcon>` component set on the MUI Library file. Reach for these only inside those two component sets; for everything else (semantic colors, severity bgs, MD elevations, typography), bind to the shared `merak/*` and `material-design/*` tokens documented in [`design-token.md`](../../figma-design-guide/design-token.md).

## Why these are component-scoped

These values are either:

1. **MUI-Snackbar-specific runtime constants** that don't reuse a shared semantic — the SnackbarContent body bg comes from `emphasize(theme.palette.background.default, 0.8)`, which resolves at light theme to `darken('#fff', 0.8) = #323232`. There is no themable color role that maps to this — the value is fixed-luminosity emphasized-greyscale used only by the Snackbar surface.
2. **Pre-alpha'd alpha-bearing tokens** that exist to dodge Figma's `paint.opacity < 1 + boundVariable` flattening rule. MUI's `<Alert>` AlertIcon styled rule applies `opacity: 0.9` while inheriting `color: #FFFFFF` from the Alert root. In Figma, pairing a `seed/neutral/white` binding with `paint.opacity: 0.9` would flatten on instance creation; pre-alpha'ing into a single `#FFFFFFE6` token keeps the binding stable. The trailing close icon is **not** dimmed and continues to bind to `seed/neutral/white` at 1.0 α.

Anything that turns out to be reused by another component should be promoted to `merak/*` and removed from this file.

## Tokens

| Token                                  | Type  | Resolves to                                                                          | Used by                                                                          |
| -------------------------------------- | ----- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `component/snackbar/default-bg`        | COLOR | `#323232` — `emphasize(palette.background.default, 0.8)` light-mode → `darken('#fff', 0.8)` | `<Snackbar>` body fill, `Variant=Default` (every Action value)                   |
| `component/snackbar/alert-icon-fg`     | COLOR | `#FFFFFFE6` — white at `0.9 α` (RGB 255 / 255 / 255, A 230 / 255 ≈ 0.902)            | `<SnackbarSeverityIcon>` glyph fills (every Severity cell); also the leading severity-icon INSTANCE inside `<Snackbar Variant=Severity>` cells |

## Resolution chain

### `component/snackbar/default-bg`

```
MUI:  emphasize(palette.background.default, 0.8)
       └─ palette.background.default = '#FFFFFF' (light theme)
       └─ emphasize → getLuminance('#FFFFFF') = 1.0 (light) → calls darken
       └─ darken('#FFFFFF', 0.8) = rgb(50, 50, 50) = '#323232'

Verified by:  node -e "const { createTheme, emphasize } = require('@mui/material'); const t = createTheme(); console.log(emphasize(t.palette.background.default, 0.8))"  →  rgb(50, 50, 50)

Why component-scoped, not seed:
  - There is no `seed/neutral/dark`-style token in the catalogue that resolves to #323232. The closest neutrals are `material-design/palette/grey/800 = #424242` and `grey/900 = #212121` — both off by ~10 luminance units. Minting a global token for a single-use value is over-specific.
  - The token name `default-bg` makes the contract obvious: this is the bg of the `Variant=Default` cell. If a future PR introduces a `Variant=Inverse` (light Snackbar on dark page), mint a sibling `component/snackbar/inverse-bg` rather than re-purposing this token.

If MUI changes the formula (e.g. `emphasize(...)` → fixed `palette.grey.800`) or the project introduces a custom `palette.background.default` (e.g. a paper-tinted page), re-resolve and update this row.
```

### `component/snackbar/alert-icon-fg`

```
MUI:  color: getContrastText(palette[severity].main)  →  '#FFFFFF' (every default-theme severity)
      opacity: 0.9   (applied on the AlertIcon styled rule, Alert.js:117)
      effective fill ≈ rgba(255, 255, 255, 0.9)

Figma binding-safe alpha:  255 / 255 / 255 / 0.902
       └─ 0.9 × 255 ≈ 229.5 → round to 230 → 0xE6
       └─ stored hex: #FFFFFFE6 (alpha channel 230 / 255 = 0.902)

Why pre-alpha'd, not paint.opacity:
  - Figma's runtime flattens `paint.opacity < 1 + boundVariable` on instance creation
    (the bound variable's color resolves first, then opacity multiplies post-resolution,
    erasing the binding). Pre-alpha'ing into a single token keeps the binding stable
    across instance creation.
  - The trailing close icon (Action=Close) is NOT dimmed (Alert.js applies opacity: 0.9
    only on the leading severity icon, not the close button) — so the close icon binds
    to `seed/neutral/white` (#FFFFFF, 1.0 α) instead of this token.

Why component-scoped, not seed:
  - Pre-alpha'd whites at specific α values are component-specific design choices.
    `seed/neutral/white` ships at 1.0 α as the project's canonical white binding.
    A 0.9 α variant would be unique to AlertIcon's runtime — promoting it to seed
    would clutter the family with a single-use alpha.

If MUI removes the AlertIcon `opacity: 0.9` rule (e.g. unifies to `currentColor` at 1.0 α),
mark the divergence resolved in `figma.spec.md` §7 #8 and re-bind to `seed/neutral/white`.
```

## Notes

- **Why two tokens, not one** — the SnackbarContent body bg and the Alert severity icon fill are conceptually unrelated (different surfaces, different colors, different opacities). Naming them with a shared prefix (`component/snackbar/*`) anchors them to the component without conflating roles.
- **Why no `component/snackbar/severity-bg-{success,info,warning,error}` tokens** — those values map 1:1 to `seed/<severity>/main` (verified by the `node -e "createTheme(); console.log(t.palette.<severity>.main)"` script in `storybook.render.md` §6). Minting per-severity component-scoped duplicates would just shadow the seed family. Bind directly to `seed/<severity>/main` instead.
- **Why no `component/snackbar/foreground` token** — every text / close-icon fill resolves to `#FFFFFF`, which already exists in the catalogue as `seed/neutral/white`. Bind to that.
- **Why no `component/snackbar/elevation` alias** — the `Variant=Default` body uses MD elevation 6 directly via `material-design/shadows/shadows-6`. Aliasing it as `component/snackbar/elevation` would add an indirection layer for a single consumer; bind to the MD shadow style id directly per `figma.spec.md` §5.4.
- **Pre-flight check** — before authoring any cell in step 5, confirm both tokens exist in the file's local `merak` collection. If missing, mint via `use_figma`:

  ```js
  // pseudo-code; actual call uses figma.variables.createVariable + setValueForMode
  const merak = collectionsByName['merak'];
  if (!variableExists('component/snackbar/default-bg')) {
    const v = figma.variables.createVariable('component/snackbar/default-bg', merak, 'COLOR');
    v.scopes = ['FRAME_FILL', 'SHAPE_FILL'];
    v.setValueForMode(merak.modes[0].modeId, { r: 50/255, g: 50/255, b: 50/255, a: 1 });
  }
  if (!variableExists('component/snackbar/alert-icon-fg')) {
    const v = figma.variables.createVariable('component/snackbar/alert-icon-fg', merak, 'COLOR');
    v.scopes = ['FRAME_FILL', 'SHAPE_FILL'];
    v.setValueForMode(merak.modes[0].modeId, { r: 1, g: 1, b: 1, a: 0.902 });
  }
  ```

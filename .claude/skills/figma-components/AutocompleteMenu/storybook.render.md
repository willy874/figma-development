---
name: figma-component-autocomplete-menu-storybook-render
description: Computed-style matrix for the **popper / listbox surface** of `<Autocomplete>` (the surface owned by the Figma `<AutocompleteMenu>` component) measured against `src/stories/Autocomplete.stories.tsx` via Chrome DevTools MCP. Documents runtime per-state Paper / listbox / option / loading / no-options geometry. Companion to `figma.spec.md` (the contract) and `design-token.md` for the component-scoped option-Selected tokens.
parent_skill: figma-components
---

# `<AutocompleteMenu>` Storybook Render Measurements

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/Autocomplete.stories.tsx`. Stories used: `MenuMatrix` (Default / Loading / NoOptions, Outlined input), `Open`, `OpenWithValue`, `OpenMatrix` (3 variants × {single, multiple}, Size=Medium, popper rendered inline via `disablePortal`), `Loading` (loading + no-options text).

`<AutocompleteMenu>` covers the popper / listbox / option-row surface only.

If a Storybook re-measure produces values that disagree with the tables below, treat the difference as one of the cases in §4.

## 1. Popper / Paper / Listbox

Captured from `OpenMatrix` (medium · single, all three variants) with `disablePortal` so the popper renders as a sibling of the AutocompleteValue input row. Every field is invariant across the 3 input variants — the popper is paint-neutral.

| Property                          | Value                                   | Notes                                                         |
| --------------------------------- | --------------------------------------- | ------------------------------------------------------------- |
| Popper position                   | `absolute`                              | Anchors below the input wrapper.                              |
| Popper width                      | matches input wrapper width (`242 px` for `width=240` autocomplete; +2 px for the border) | Auto-sized via Popper.js. Figma cell is fixed at `280 px`. |
| Popper z-index                    | `1300`                                  | MUI default `theme.zIndex.modal` — Figma: paint above sibling content. |
| Paper background                  | `rgb(255, 255, 255)`                    | `palette.background.paper`.                                   |
| Paper border-radius               | `4 px`                                  | `theme.shape.borderRadius`.                                   |
| Paper box-shadow                  | `0 2 1 -1 rgba(0,0,0,0.2), 0 1 1 0 rgba(0,0,0,0.14), 0 1 3 0 rgba(0,0,0,0.12)` | MUI `shadows[1]` (Material Design elevation 1). |
| Listbox padding (T / B)           | `8 / 8 px`                              | Top / bottom inset on the `<ul>`.                             |
| Listbox max-height                | `196 px`                                | Hard-coded by MUI; scrolls past 5–6 options at default 36 px row. |
| Listbox overflow                  | `auto`                                  | Vertical scroll when options exceed max-height.               |

Notes:

- The popper is anchored to the input wrapper's bottom edge with `0 px` margin. Figma matches this by stacking the input and `<AutocompleteMenu>` instances at `gap: 0`.
- Listbox `max-height: 196 px` rounds to roughly 5 option rows. Cells published in Figma should size the popper frame to fit `min(options.length, 5) × 36 px + 16 px padding`; designers can overflow the height for taller listboxes via instance override.

## 2. Option rows (inside Default state)

| Property                          | Value                                   | Notes                                                         |
| --------------------------------- | --------------------------------------- | ------------------------------------------------------------- |
| Option min-height                 | `0 px` (intrinsic; height = `36 px` from line-height + padding) | |
| Option padding                    | `6 16 6 16 px`                          | T R B L. The `16 px` left padding aligns with `palette.divider` MUI defaults. |
| Option font                       | Roboto 400, `16 / 24 px`, ls `0.15 px`  | `body1` typography — same family/size as input value.         |
| Option color (resting)            | `rgba(0, 0, 0, 0.87)`                   | `text.primary`.                                               |
| Option background (resting)       | transparent                             |                                                               |
| Option background (hover / focused) | `rgba(0, 0, 0, 0.04)`                 | `action.hover`. Applied via `.Mui-focused` class on the option (Autocomplete only highlights one option at a time — `:hover` and keyboard arrow share the same class). |
| Option background (selected, not focused) | `rgba(25, 118, 210, 0.08)`        | `primary.main × selectedOpacity (0.08)`. (`palette.action.selectedOpacity`.) |
| Option background (selected + focused)    | `rgba(25, 118, 210, 0.12)`        | `primary.main × (selectedOpacity 0.08 + focusOpacity 0.04) = 0.12`. |
| Option font-weight (selected)     | `400`                                   | MUI does **not** bold the selected option text — the bg tint is the only selected cue. |
| Option color (disabled)           | `rgba(0, 0, 0, 0.38)`                   | `text.disabled` — only renders when `getOptionDisabled` flags the option (rare). |

Notes:

- **`Mui-focused` ≠ `:focus`.** Autocomplete maintains a "highlighted option" via the `Mui-focused` class on the `<li role="option">` — keyboard arrow keys move it, mouse hover sets it. The class shares paint with hover. There is no separate `:hover` selector for options.
- **Selected vs focused stack.** `aria-selected="true" + Mui-focused` paints `0.12α` of `primary.main`; `OpenWithValue` story renders the matched option with both classes (the selected option auto-receives `Mui-focused` on open).
- **No focus ring.** Options have `outline: none` in MUI; the bg tint is the only visual cue for keyboard navigation.

## 3. Loading / NoOptions states

| Property                          | Loading                                 | NoOptions                                | Notes                                                        |
| --------------------------------- | --------------------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| Slot class                        | `MuiAutocomplete-loading`               | `MuiAutocomplete-noOptions`              | Distinct DOM nodes — both render in place of the option list. |
| Padding                           | `14 16 14 16 px`                        | same                                     | `14 px` vertical, `16 px` horizontal.                         |
| Font                              | Roboto 400, `16 / 24 px`, ls `0.15 px`  | same                                     | `body1` runtime — spec now also binds `body1` (matches the published `52 px` cell height: `24 + 14 + 14`). |
| Text fill                         | `rgba(0, 0, 0, 0.6)`                    | same                                     | `text.secondary`.                                            |
| Text alignment                    | left (default `<li>` text alignment)    | same                                     | Spec centers the message — see drift §4 issue 6.             |
| Default `Loading Text`            | `Loading…`                              | —                                        | MUI default; controlled via `loadingText` prop.              |
| Default `No Options Text`         | —                                       | `No options`                             | MUI default; controlled via `noOptionsText` prop.            |

Notes:

- The runtime renders the message as a single `<li>` inside the listbox `<ul>`. The Figma cell renders it as a centered single-line text node — visual intent is the same, but the runtime DOM is more flexible (text can wrap if the host overrides `loadingText` to a long string).

## 4. Drift checks

If a re-measure disagrees with the tables above, treat the difference as one of:

1. **MUI upgrade** — major bumps to `@mui/material` (`^7.3.10` resolved 2026-04-29) often retune `popper.zIndex`, `Mui-focused` opacity (currently `0.04`), or the `selectedOpacity` (`0.08`). Update §2 / §3 in the same PR and bump the version row in `figma.spec.md` §1.
2. **Theme override** — `.storybook/preview.tsx` currently uses `createTheme()` with no overrides. Adding `MuiAutocomplete.defaultProps` / palette retints / a custom `shadows[1]` forces a re-measure of every column above.
3. **Listbox max-height bump** — MUI's hard-coded `196 px` matches roughly 5 option rows at the default 36 px height. If a host overrides `slotProps.listbox.style.maxHeight`, the popper height changes but option geometry stays.
4. **Selected paint stack** — `0.08α + 0.04α = 0.12α` for selected+focused is the MUI primary tint × `palette.action.selectedOpacity + palette.action.focusOpacity`. Custom palettes (`primary` set to a non-blue) only change the hue, not the alpha math.
5. **Loading / NoOptions typography** — runtime and spec both use `body1` (`16 / 24 px`); the published Figma cell measures `52 px` (`24 + 14 + 14`). Earlier drafts assumed `body2` for visual hierarchy; resolved on 2026-04-29.
6. **Loading / NoOptions alignment** — runtime renders left-aligned (default `<li>` flow); spec centers the message. Designers prefer the centered look for empty / loading states; if a host project flips to left-aligned, retune §3 of the spec.
7. **Disabled option** — disabled options (rare, set via `getOptionDisabled`) inherit `Mui-disabled` paint: `pointer-events: none`, `opacity: 0.38`. Not measured here because the stories don't exercise it; if a host needs it, add a `getOptionDisabled` row to `OpenMatrix` and re-measure.


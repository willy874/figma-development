---
name: figma-component-autocomplete-design-token
description: Component-scoped design tokens for `<Autocomplete>`. Defined here because they're MUI-Autocomplete-specific pre-alpha'd primary tints (option Selected / Selected+Focused) that don't fit the shared `merak/seed/*` or `merak/alias/*` namespaces and live as **local** variables inside the MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`). Bind option Selected backgrounds to these names rather than literal values; for shared tokens used by Autocomplete (alias text colors, alias bg-outline-hover, paper-elevation-0, shadows-1) see `.claude/skills/figma-design-guide/design-token.md`.
parent_skill: figma-components
---

# `<Autocomplete>` Component Tokens

Tokens scoped to `<Autocomplete>` and its companion `<AutocompleteOption>`. Reach for these only inside the Autocomplete component set; for everything else (semantic colors, shadows, typography, paper background), bind to the shared `merak/*` and `material-design/*` tokens documented in [`design-token.md`](../../figma-design-guide/design-token.md).

## Why these are component-scoped

These values are **MUI-Autocomplete-specific pre-alpha'd primary tints** that don't reuse a shared semantic token. MUI sources them at runtime from a stack of opacities (`palette.primary.main × palette.action.selectedOpacity`, optionally + `palette.action.focusOpacity` when both classes apply), but Figma cannot stack `paint.opacity < 1` on a bound variable without flattening on instance creation (see `figma-component-spec-guide` §4.4). The only honest way to render the `0.08α` and `0.12α` tints is a pre-alpha'd local variable per stack.

The closest shared token is `seed/primary/hover-bg` (`#1976D20A`, `0.04α`) — exactly half of the option-selected alpha and a third of the option-selected-focused alpha. Stacking two / three copies of `hover-bg` in Figma would composite to `0.08` / `0.12`, but the visual result depends on Figma's blend math (it composites in sRGB, not linear), so the rendered hex would diverge from MUI's flat-alpha runtime. Pre-alpha'd locals avoid the discrepancy.

These tokens share the same `component/*` prefix as the shared `merak/component/*` namespace, but they live in the **local** `merak` collection inside the MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`) — not the published 天璇 collection. Treat them as local-only; promoting one to the shared collection still requires copying it into the 天璇 file's `merak` collection (and rebinding may be needed if IDs change).

Anything that turns out to be reused by another listbox-bearing component (Select, Menu, Popper-based DatePicker) should be promoted to the shared `merak/component/listbox/*` namespace in the 天璇 file and removed from here.

## Tokens

| Token                                              | Type  | Resolves to                            | Used by                                                                                |
| -------------------------------------------------- | ----- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| `component/autocomplete/option-selected-bg`        | COLOR | `#1976D214` (`0.08α` of `seed/primary/main`) | `<AutocompleteOption>` background `State=Selected`                              |
| `component/autocomplete/option-selected-focused-bg`| COLOR | `#1976D21F` (`0.12α` of `seed/primary/main`) | `<AutocompleteOption>` background `State=Selected + Focused` (the most-rendered selected paint, since opening the popper auto-focuses the selected row) |

## Resolution chain

Both tokens are derived from `seed/primary/main` (`#1976D2` = `palette.primary.main`):

- `option-selected-bg` = `seed/primary/main × 0.08` = `#1976D2 × 0.08` = `#1976D214` (alpha hex `14`).
- `option-selected-focused-bg` = `seed/primary/main × (0.08 + 0.04)` = `#1976D2 × 0.12` = `#1976D21F` (alpha hex `1F`). The `0.08 + 0.04 = 0.12` math comes from MUI applying both `palette.action.selectedOpacity` (`0.08`) and `palette.action.focusOpacity` (`0.04`) to the option when it carries both `aria-selected="true"` and `Mui-focused`.

## Notes

- **Pre-alpha'd, never stack opacity.** Both tokens already resolve to alpha-baked hex. Pairing them with a Figma `paint.opacity < 1` flattens to `opacity = 1` on instance creation (see `figma-component-spec-guide` §4.4) and silently destroys the alpha. Bind directly; never re-alpha.
- **No `option-hover-bg` token.** Hovered (un-selected) options bind to the shared `alias/colors/bg-outline-hover` (`#0000000A`, `0.04α` = `palette.action.hover`). MUI does not retint hover with the primary color — it uses the same neutral hover paint as buttons / list items. No need for a local token.
- **No `option-disabled-bg` token.** Disabled options keep the resting transparent background and only retint the text via `alias/colors/text-disabled`. No bg-fill needed.
- **Theme retunes change these tokens.** A custom `palette.primary.main` (red branding, dark mode) or custom `action.selectedOpacity` / `action.focusOpacity` requires re-resolving these tokens. The two values are independent; a project bumping `selectedOpacity` to `0.12` would set `option-selected-bg` to `0.12α` and `option-selected-focused-bg` to `0.16α`, etc.
- **No `option-selected-text` token.** MUI does not bold or recolor the selected option text — the bg tint is the only visual cue. The text fill for every option state binds to `alias/colors/text-default` (or `alias/colors/text-disabled` for disabled).

## Layout / typography tokens (informative)

These are not Figma variables but design constants worth recording in one place:

| Constant                                         | Value             | Used by                                                  |
| ------------------------------------------------ | ----------------- | -------------------------------------------------------- |
| Popper Paper corner radius                       | `4 px`            | The Paper frame holding the listbox                      |
| Popper Paper effect                              | `material-design/shadows/shadows-1` | Apply by style id; Material Design elevation 1 |
| Listbox padding (T / B)                          | `8 px / 8 px`     | Top / bottom inset on the `<ul>`                          |
| Listbox max-height                               | `196 px`          | Hard-coded; overflow scrolls vertically                   |
| Option min-height                                | `36 px`           | Resolves from line-height + padding                       |
| Option padding (T R B L)                         | `6 16 6 16 px`    | Symmetric T/B; horizontal `16 px` aligns with MUI list-item defaults |
| End-adornment button size                        | `28 × 28 px`      | Popup-arrow button + clear-icon button                    |
| End-adornment button padding                     | `2 px` (popup) / `4 px` (clear) | Inner padding around the glyph              |
| Popup-arrow rotation (Open=True)                 | `180°`            | The arrow flips when the popper is open                   |
| Tag chip per-chip margin — Size=Medium / Small   | `3 px / 2 px`     | Spacing between consecutive `<Chip>` instances inside the wrapper |

Anything in this table that gains a project-level token (e.g. `merak/component/listbox/popper-radius`) should be lifted out of this file into the shared collection and removed here.

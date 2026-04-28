---
name: figma-component-text-field-design-token
description: Component-scoped design tokens for `<TextField>`. Defined here because they're MUI-TextField-specific resting-state alphas that don't fit the shared `merak/seed/*` or `merak/alias/*` namespaces and live as **local** variables inside the MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`) rather than the published 天璇 collection. Bind TextField paints / strokes to these names rather than literal values; for shared tokens used by TextField (seed primary / danger, alias text colors, alias bg-disabled, paper-elevation-0), see `.claude/skills/figma-design-guide/design-token.md`.
parent_skill: figma-components
---

# `<TextField>` Component Tokens

Tokens scoped to `<TextField>` and its variants. Reach for these only inside the TextField component set; for everything else (semantic colors, MD elevations, typography), bind to the shared `merak/*` and `material-design/*` tokens documented in [`design-token.md`](../../figma-design-guide/design-token.md).

## Why these are component-scoped

These values are **MUI-TextField-specific resting alphas** that don't reuse a shared semantic token. The MUI runtime sources them from a mix of `palette.text.primary × α` (with `α` drawn from MUI's `inputAdornedRootStyles` and the `MuiInput-underline` `:before` rules) and `palette.action.disabledBackground` for disabled wrappers. None of these resolve to a single named slot in `palette.*`, so the token surface lives in the local `component/input/*` namespace inside the MUI-Library file rather than the published `merak/seed/*` or `merak/alias/*`.

These tokens share the same `component/*` prefix as the shared `merak/component/*` namespace documented in `figma-design-guide/design-token.md`, but they live in the **local** `merak` collection inside the MUI-Library file (`KQjP6W9Uw1PN0iipwQHyYn`) — not the published 天璇 collection. Treat them as local-only; promoting one to the shared collection still requires copying it into the 天璇 file's `merak` collection (and rebinding may be needed if IDs change).

Anything that turns out to be reused by another input component (Select, Autocomplete, PinInput) should be promoted to the shared `merak/component/input/*` namespace in the 天璇 file and removed from here.

## Tokens

| Token                                       | Type   | Resolves to                            | Used by                                                                                |
| ------------------------------------------- | ------ | -------------------------------------- | -------------------------------------------------------------------------------------- |
| `component/input/standard/enabledBorder` | COLOR  | `#0000006B` (`0.42α` black)            | Standard underline `State=Enabled` · Filled underline `State ∈ {Enabled, Hovered}`     |
| `component/input/standard/hoverBorder`   | COLOR  | `#000000DE` (`0.87α` black, `text.primary`) | Standard underline `State=Hovered`                                                |
| `component/input/filled/enabledFill`     | COLOR  | `#0000000F` (`0.06α` black)            | Filled wrapper `State ∈ {Enabled, Error}`                                              |
| `component/input/filled/hoverFill`       | COLOR  | `#00000017` (`0.09α` black)            | Filled wrapper `State ∈ {Hovered, Focused}` _(see drift note 4 below)_                 |
| `component/input/outlined/enabledBorder` | COLOR  | `#0000001F` (`0.12α` black)            | Outlined notched outline `State=Enabled` _(see drift note 1 below)_                    |
| `component/input/outlined/hoverBorder`   | COLOR  | `#000000DE` (`0.87α` black, `text.primary`) | Outlined notched outline `State=Hovered`                                          |

## Notes

- **Pre-alpha'd, never stack opacity.** Every token in this file already resolves to an alpha-baked hex. Pairing them with a Figma `paint.opacity < 1` flattens to `opacity = 1` on instance creation (see `figma-component-spec-guide` §4.4) and silently destroys the alpha. Bind directly; never re-alpha.
- **The two `hoverBorder` tokens converge on `text.primary` (0.87 α).** Both Standard and Outlined hover-state strokes paint at `text.primary` per MUI default. They are kept as separate names so a future per-variant divergence (e.g. Outlined retinting to `seed/primary/hover-bg` on hover) can be expressed without renaming.
- **`outlined/enabledBorder` drift open** — the runtime computed style is `rgba(0, 0, 0, 0.23)` per `MuiOutlinedInput-notchedOutline`, but this token resolves to `0.12α`. The Figma cells therefore render lighter than runtime by ~10 percentage points of black. Tracked in `figma.spec.md` §7 issue 1; resolve by either repointing this token to `0.23α` or minting a `mui-outline` companion.
- **`filled/hoverFill` drift open** — runtime keeps the wrapper at `enabledFill` (`0.06α`) on `:focus-visible`, but the Figma cells reuse `hoverFill` (`0.09α`) for both `Hovered` and `Focused`. The Figma cell adds extra darkening on focus that MUI does not render. Tracked in `figma.spec.md` §7 issue 4.
- **No `disabledFill` token** — Filled disabled wrappers bind directly to the shared `alias/colors/bg-disabled` (`0.12α`), since that paint is the same value MUI's `palette.action.disabledBackground` resolves to. Adding a local copy would duplicate without justification.
- **No `disabledBorder` token** — Standard / Filled disabled underlines and Outlined disabled border all bind to the shared `alias/colors/bg-disabled` (`0.12α`). The runtime values diverge slightly (`0.26α` for the Outlined notched outline; `1 px dotted` for Standard) but the Figma cells keep a single `bg-disabled` for hygiene. See `figma.spec.md` §7 issues 2 and 5.
- **No `errorBorder` / `errorFill` tokens** — Error-state strokes bind to the shared `seed/danger/main`. Filled wrapper paint is unchanged on Error (only the underline retints), so no error-fill token is needed.
- **No `focusBorder` token** — Focused-state strokes bind to the shared `seed/primary/main` (2 px). Adding a local copy would lose the symmetric pairing with the focus accent used elsewhere (`<Button>`, `<IconButton>`).

## Layout / typography tokens (informative)

These are not Figma variables but design constants worth recording in one place:

| Constant                                         | Value             | Used by                                                  |
| ------------------------------------------------ | ----------------- | -------------------------------------------------------- |
| Wrapper corner radius — Filled                   | `4 4 0 0 px`      | All Filled variants                                      |
| Wrapper corner radius — Outlined                 | `4 px`            | All Outlined variants                                    |
| Resting underline / outline thickness            | `1 px`            | All Variants, `State ∈ {Enabled, Hovered, Disabled, Error}` |
| Focused underline / outline thickness            | `2 px`            | All Variants, `State=Focused` and `State=Error+Focused`  |
| Adornment slot dimensions (Figma-side)           | `24 × 24 px`      | `Start Adorn` / `End Adorn` slot frames                  |
| Adornment → input gap                            | `8 px`            | All Variants                                             |
| Helper text padding-top                          | `3 px`            | All Variants                                             |
| Floated label scale                              | `0.75`            | MUI `Mui-shrunk` label transform                         |

Anything in this table that gains a project-level token (e.g. `merak/typography/input-*`) should be lifted out of this file into the shared collection and removed here.

---
name: figma-component-pin-input-design-token
description: Component-scoped design-token audit for `<PinInput>`. No component-scoped tokens are minted — the spec records this absence here so future reviewers can confirm it is intentional rather than missing. Companion to `figma.spec.md` (the contract) and `storybook.render.md` (the runtime measurements).
parent_skill: figma-components
---

# `<PinInput>` Component-Scoped Design Tokens

**Status: declared-empty.** `<PinInput>` does not mint any tokens of its own. Every paint reaches a token in the shared `mui/*` family (see `figma.spec.md` §10 Token Glossary). This file exists so the spec's `figma.spec.md` link resolves and so a future reviewer can confirm the absence is intentional.

## Why no component-scoped tokens?

`<PinInput>` is a **Wrapper + atom** archetype — every per-cell paint (border, fill, input text) is owned by the nested `<TextField>` instance, which already binds to `mui/seed/*` and `mui/alias/*` plus a small `_components/input/outlined/*` family minted in [`<TextField>`'s design-token.md](../TextField/design-token.md). The wrapper itself only paints three TEXT regions:

- **FormLabel TEXT fill** → `mui/alias/colors/text-default` (resting — project convention; local collection has no `text-secondary` token), `mui/seed/danger/main` (Error override), `mui/alias/colors/text-disabled` (Disabled override). All three already exist in the shared catalogue (`figma-create-component/library-tokens.md`).
- **FormHelperText TEXT fill** → same as FormLabel.
- **Separator `-` glyph TEXT fill** → `mui/alias/colors/text-default`. Already in the shared catalogue.

No paint, stroke, effect, or typography rule on the wrapper requires a value the shared catalogue doesn't cover. There is no per-component pre-alpha'd surface, no themed-Selected stacked-fill, no shadow needing a custom diffusion, no glyph color the alias family doesn't already ship.

## Pre-flight checklist for step 5

When step 5 runs `figma.variables.getLocalVariableCollections()`, confirm the following local variables exist in the `KQjP6W9Uw1PN0iipwQHyYn` file before authoring any cell. None of them should require minting — they are already used by `<TextField>`, `<Button>`, `<Snackbar>`, and most other published components in this file:

| Token path                                  | Type    | Resolved value (light theme)        | Used as                                                        |
| ------------------------------------------- | ------- | ----------------------------------- | -------------------------------------------------------------- |
| `mui/alias/colors/text-default`           | COLOR   | `rgba(0, 0, 0, 0.87)`               | Separator `-` glyph fill **+** FormLabel / FormHelperText resting fill (project convention — the local collection has no `text-secondary` token; see `figma.spec.md` §7 #5) |
| `mui/alias/colors/text-disabled`          | COLOR   | `rgba(0, 0, 0, 0.38)`               | FormLabel + FormHelperText optional Disabled-state fill (§4.2.1) |
| `mui/seed/danger/main`                    | COLOR   | `#D32F2F`                           | FormLabel + FormHelperText optional Error-state fill (§4.2.1) |

If any of these is missing, mint it locally with the resolved value and the standard COLOR scopes (`ALL_FILLS`, `TEXT_FILL`) — but the expectation is that all three already exist because they're shared across the design system. Missing entries indicate a regression in the file's local catalogue, not a PinInput-specific need.

## Re-evaluation triggers

Add a component-scoped token to this file (and update `figma.spec.md` §10.3 + §4.2 + this audit) only if a future spec change requires:

1. **A pre-alpha'd token** for a paint the shared family can't express — e.g. a 12 % α themed fill (the seed family ships 4 % α via `paint.opacity` only) or a stacked-fill composite that the seed family doesn't alias.
2. **A PinInput-specific shape value** — e.g. a wider cell, a different border radius for cells that diverge from `<TextField>`'s `radius.cell` (`= 4 px`).
3. **A row-level State axis** (per `figma.spec.md` §2.1's deferred trigger) that needs its own paint chain — e.g. row-level Error helper text shifts to a deeper red than `seed/danger/main` to compensate for stacked-cell visual saturation.

Until any of these triggers fire, `<PinInput>` stays component-scoped-empty.

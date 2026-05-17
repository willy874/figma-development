---
name: figma-component-typography-design-token
description: Component-scoped design tokens for `<Typography>`. Two pairs of UPPER-baked local text styles (`component/typography/button[-bold]`, `component/typography/overline[-bold]`) so the corresponding cells can bind without losing `textStyleId`, plus 11 bold-weight companion styles minted under `material-design/typography/<v>-bold` to support the synthetic `Bold` axis. Every other cell binds to a published `material-design/typography/*` style (see `figma-create-component/library-tokens.md` §3); the master cell text fill binds to `mui/alias/colors/text-default` (designer-overrideable per instance).
parent_skill: figma-components
---

# `<Typography>` Component Tokens

Tokens scoped to the `<Typography>` Figma component set published inside frame `<NODE_ID>` of `<FIGMA_FILE_KEY>`. For shared tokens (semantic color variables, the 11 base-weight `material-design/typography/*` styles), bind to the shared definitions in [`figma-create-component/library-tokens.md`](../../figma-create-component/library-tokens.md).

## Why these are component-scoped

Three motivations converge on minting local text styles for this component:

1. **`material-design/typography/button` doesn't exist.** The design system ships text styles for 12 of MUI's 13 Typography variants (`h1`–`h6`, `subtitle1`–`subtitle2`, `body1`–`body2`, `caption`, `overline`); `button` was never published. The runtime value (Roboto Medium 14 / 24.5 px, `0.4 px` letter-spacing, uppercase) is documented in `storybook.render.md` §1 and falls outside the design system's "all letter-spacing 0%, all textCase ORIGINAL" rule.
2. **`material-design/typography/overline` ships `textCase: ORIGINAL`** per the design-system convention, but the MUI runtime renders `text-transform: uppercase`. Setting the cell's TEXT `textCase = 'UPPER'` (or applying `setRangeTextCase`) detaches the `textStyleId` binding entirely — Figma drops the binding the moment any case property is overridden at the node level. To keep the cell genuinely bound to a published-by-name style, we mint a UPPER-baked local sibling.
3. **Bold-weight companions don't exist** in the published `material-design/typography/*` family — the design system ships only one weight per variant (Light / Regular / Medium per the variant). The synthetic `Bold` Figma axis (see `figma.spec.md` §1 and `storybook.render.md` §5) needs a second style per Variant; we mint 13 local companions to fill the gap.

The trade-off: 13 local typography styles in this MUI Library file. Two of them (`component/typography/button`, `component/typography/overline`) sit under the component-scoped namespace; eleven sit under `material-design/typography/<v>-bold` so the bold companions stay visible to other components that may want to consume them later (a list-item bold lead, a card title in bold, etc.). All 13 are local-only — no consumed-library bindings.

If `<Button>` / `<IconButton>` / `<Chip>` later promote a shared button-typography style, or the design system mints UPPER-baked or bold companions, these tokens migrate by name and the corresponding cells rebind — no other change needed.

## Tokens

### Component-scoped (UPPER-baked + their bold companions)

| Token                                  | Type       | Resolves to                                                                                  | Used by                              |
| -------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- | ------------------------------------ |
| `component/typography/button`          | TEXT_STYLE | Noto Sans TC Medium, `14 / 24 px`, ls `0%`, **textCase `UPPER`**, paragraph-spacing `0`, textDecoration `NONE` | `Variant=Button, Bold=Off`           |
| `component/typography/button-bold`     | TEXT_STYLE | Noto Sans TC **Bold**, `14 / 24 px`, ls `0%`, **textCase `UPPER`**, paragraph-spacing `0`, textDecoration `NONE` | `Variant=Button, Bold=On`            |
| `component/typography/overline`        | TEXT_STYLE | Noto Sans TC Regular, `12 / 32 px`, ls `0%`, **textCase `UPPER`**, paragraph-spacing `0`, textDecoration `NONE` | `Variant=Overline, Bold=Off`         |
| `component/typography/overline-bold`   | TEXT_STYLE | Noto Sans TC **Bold**, `12 / 32 px`, ls `0%`, **textCase `UPPER`**, paragraph-spacing `0`, textDecoration `NONE` | `Variant=Overline, Bold=On`          |

### Bold companions under `material-design/typography/*` (local — minted to fill the design-system gap)

These 11 styles live under the same namespace as the published base styles for discoverability, but they are **local** to this file. The design-system file (`<FIGMA_FILE_KEY>`) does not ship them today; promote upstream when ready.

| Token                                            | Resolves to                                                |
| ------------------------------------------------ | ---------------------------------------------------------- |
| `material-design/typography/h1-bold`             | Noto Sans TC Bold, `96 / 112 px`, ls `0%`, ORIGINAL        |
| `material-design/typography/h2-bold`             | Inter Bold, `60 / 72 px`, ls `0%`, ORIGINAL                |
| `material-design/typography/h3-bold`             | Noto Sans TC Bold, `48 / 60 px`, ls `0%`, ORIGINAL         |
| `material-design/typography/h4-bold`             | Noto Sans TC Bold, `34 / 42 px`, ls `0%`, ORIGINAL         |
| `material-design/typography/h5-bold`             | Inter Bold, `24 / 32 px`, ls `0%`, ORIGINAL                |
| `material-design/typography/h6-bold`             | Noto Sans TC Bold, `20 / 32 px`, ls `0%`, ORIGINAL         |
| `material-design/typography/subtitle1-bold`      | Noto Sans TC Bold, `16 / 28 px`, ls `0%`, ORIGINAL         |
| `material-design/typography/subtitle2-bold`      | Noto Sans TC Bold, `14 / 20 px`, ls `0%`, ORIGINAL         |
| `material-design/typography/body1-bold`          | Noto Sans TC Bold, `16 / 24 px`, ls `0%`, ORIGINAL         |
| `material-design/typography/body2-bold`          | Noto Sans TC Bold, `14 / 20 px`, ls `0%`, ORIGINAL         |
| `material-design/typography/caption-bold`        | Noto Sans TC Bold, `12 / 20 px`, ls `0%`, ORIGINAL         |

## Resolution chains (representative)

```
component/typography/button (local TEXT_STYLE)
  family       = Noto Sans TC          ← matches the project's primary writing system
  weight       = Medium                ← MUI's button variant weight (500); Noto Sans TC Medium reads roughly Roboto Medium at 14 px
  size         = 14 px                 ← MUI default 0.875rem at the project's 16 px html base
  line-height  = 24 px                 ← rounded down from MUI's 24.5 px (`1.75em`) to a 4-px-grid value
  letter-spacing = 0%                  ← matches the design-system rule; MUI runtime ships 0.4 px (divergence in storybook.render.md §6)
  textCase     = UPPER                 ← MUI runtime ships uppercase; UPPER baked so the cell binds cleanly without a node-level override

component/typography/button-bold (local TEXT_STYLE)
  family / size / line-height / letter-spacing / textCase = same as component/typography/button
  weight       = Bold                  ← bold companion for the synthetic Figma `Bold=On` axis

material-design/typography/body1-bold (local TEXT_STYLE)
  family       = Noto Sans TC          ← matches material-design/typography/body1
  weight       = Bold                  ← bold companion (base is Regular)
  size         = 16 px                 ← matches material-design/typography/body1
  line-height  = 24 px                 ← matches material-design/typography/body1
  letter-spacing = 0%                  ← matches material-design/typography/body1
  textCase     = ORIGINAL              ← matches material-design/typography/body1
```

## Why these aren't Variables

Figma text styles and Figma variables are different objects: `textStyleId` is set per-TEXT and carries every typography rule (font / size / weight / line-height / letter-spacing / textCase) as a single bundle. The component-scoped Variable namespace (`component/chip/fill`, `component/tooltip/fill`, etc.) is for COLOR / FLOAT atoms — typography rules don't fit. Hence every entry above is a local **text style**, not a variable. They are published with the conventional path (`material-design/typography/*` for the bold companions, `component/typography/*` for the UPPER-baked ones) so the binding path mirrors the design-system / variable namespace conventions.

## Why we don't override `textCase` at the node level

Figma's text-style binding model: the moment a node-level `textCase` (or `setRangeTextCase`) override is applied, Figma sets the node's `textStyleId` to the empty string. `component-spec-guide` §4 reinforces the rule: "apply text styles, don't set fontName / fontSize / lineHeight manually" — and `textCase` belongs to the same bundle. The two ways to keep the binding intact are (a) mint a style with the desired case baked in, or (b) accept the detachment. We pick (a). The cost is one extra style per UPPER-cased Variant per Bold value (four total: button, button-bold, overline, overline-bold); the win is a clean `boundVariables` / `textStyleId` audit trail across all 26 cells.

## Why the bold companions live under `material-design/typography/*`

Two options:

1. **Component-scoped path**: `component/typography/<v>-bold`. Keeps everything Typography-flavoured under one prefix.
2. **Design-system path (locally minted)**: `material-design/typography/<v>-bold`. Same path the published base styles use; signals "future-shared" intent.

We picked option 2 for the 11 standard Variants because: (a) other components may want to consume "body1 bold" or "h6 bold" — they read better as a sibling of the published base styles; (b) when the design system promotes them, the rename is zero-touch (they already use the right path); (c) they're distinct enough (different weights, separate `textStyleId`) that the local-vs-shared distinction is invisible in day-to-day use.

For `Button` and `Overline`, we keep the `component/typography/*` prefix because both are already component-scoped (the base styles were minted there to bake UPPER) and the bold companions inherit that namespace for consistency.

## Sync rule

These tokens must move together with:

1. `figma.spec.md` §4.1 — every text-style row references one of these names.
2. `storybook.render.md` §1 — the runtime numbers for the `button` and `overline` variants. A MUI version bump that changes either runtime typography requires re-resolving the corresponding rounded values here.
3. The published `<Typography>` component set in Figma — every cell's `textStyleId` binding.
4. `figma-create-component/library-tokens.md` §3 — if a future design-system pass mints `material-design/components/button` (or any of the bold companions, or a UPPER-baked `material-design/typography/overline`), promote the corresponding local style by deleting it and re-binding the affected cells to the shared style. Update §4.1 of `figma.spec.md` and the §10 token glossary entries accordingly.

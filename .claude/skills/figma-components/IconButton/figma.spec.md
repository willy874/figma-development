---
name: figma-component-iconbutton-spec
description: Figma component specification for `<IconButton>` — design counterpart of MUI `<IconButton>` consumed by `src/stories/IconButton.stories.tsx`. Documents the variant matrix (Color × Variant × State, Size=Medium), source-to-Figma mapping, the per-cell Render Binding Matrix (§6) that pins every fill / stroke / shadow / foreground to a named token, and the divergence between MUI's native `IconButton` (no `variant` prop) and the Merak Figma extension that adds Text / Outlined / Contained. For component-scoped tokens see `design-token.md`; for runtime measurements see `storybook.render.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '1:4571'
figma_component_set_id: '1:4571'
---

# `<IconButton>` Figma Component Specification

## 1. Overview

`<IconButton>` is the Figma counterpart of MUI's `IconButton` consumed in `src/stories/IconButton.stories.tsx`. The package re-exports MUI IconButton; the Storybook story wraps it as `MerakIconButton` so the Merak `Variant` axis (Text / Outlined / Contained) — which has no equivalent on MUI's native IconButton — can be rendered via `sx` overrides for parity with Figma. The Figma encodes the prop surface (`color`, plus Merak `variant`, plus interaction state) as variant axes.

| Aspect            | Value                                                                                |
| ----------------- | ------------------------------------------------------------------------------------ |
| Source story      | `src/stories/IconButton.stories.tsx`                                                 |
| Underlying source | `@mui/material` `IconButton` (re-exported by this package, wrapped as `MerakIconButton` in the story) |
| Figma frame       | `<IconButton>` (`1:4571`) on page **Components**                                     |
| Total variants    | **90** (6 Colors × 3 Variants × 5 States, Size=Medium only)                          |
| Icon slot         | `24 × 24 px` (MUI default; Figma cells currently authored at 20 px — see §7 sizing)  |
| Borrowed behaviors | Variant paint model, hover/pressed background ramp, focus ring, and elevation steps mirror `<Button>` (`figma.spec.md`) — `<IconButton>` is the icon-only sibling of `<Button>` in the Merak system |

**MUI native vs Merak extension.** MUI's `IconButton` has only `color`, `size`, `edge`, `disabled`, `loading`. It does not expose a `variant` prop and renders as a transparent circular button (visually equivalent to Merak's `Variant=Text`). The Merak `Variant` axis (`Contained`, `Outlined`, `Text`) is a design-system extension authored in Figma; the runtime story applies it via `sx`. When this spec changes, the story `sx` must change in the same PR (§8).

## 2. Source-to-Figma Property Mapping

| MUI prop / source     | Figma property | Type    | Notes                                                                       |
| --------------------- | -------------- | ------- | --------------------------------------------------------------------------- |
| `color`               | `Color`        | VARIANT | Merak design-system key; mapping in §2.1                                    |
| _(Merak extension)_   | `Variant`      | VARIANT | `Text` / `Outlined` / `Contained` — applied via `sx` at runtime             |
| _(interaction state)_ | `State`        | VARIANT | `Enabled` / `Hovered` / `Focused` / `Pressed` / `Disabled`                  |
| `size`                | `Size`         | VARIANT | Only `Medium` is shipped on canvas; Small / Large are runtime-only (`storybook.render.md` §5) |
| `disabled`            | —              | —       | Encoded as `State=Disabled`                                                 |
| `edge`                | —              | —       | Layout-only negative margin; not represented in Figma (apply at consumer)   |
| `loading`             | —              | —       | Shows a `CircularProgress` overlay; tracked under a separate Loading state (out of scope this revision) |
| `onClick`, `type`     | —              | —       | Behavior-only, no design representation                                     |

### 2.1 Color value mapping

The Merak design-system color keys map to MUI palette names; designers pick the Merak name in Figma. Bind every Figma fill / stroke to the listed token family — never paste raw hex.

| Merak key (source) | MUI palette key | Figma token family                                                              | Figma `Color` value |
| ------------------ | --------------- | ------------------------------------------------------------------------------- | ------------------- |
| `default`          | `inherit` / `default` | `alias/colors/text-default` _(non-contained)_ + IconButton-scoped tokens (§5.5) | **Default**         |
| `primary`          | `primary`       | `seed/primary/*`                                                                | **Primary**         |
| `danger`           | `error`         | `seed/danger/*`                                                                 | **Danger**          |
| `warning`          | `warning`       | `seed/warning/*`                                                                | **Warning**         |
| `info`             | `info`          | `seed/info/*`                                                                   | **Info**            |
| `success`          | `success`       | `seed/success/*`                                                                | **Success**         |

## 3. Variant Property Matrix

```
Color × Variant × State (Size=Medium)   =   6 × 3 × 5   =   90 variants
```

| Property  | Default value | Options                                                      |
| --------- | ------------- | ------------------------------------------------------------ |
| `Color`   | `Primary`     | `Primary`, `Default`, `Danger`, `Warning`, `Info`, `Success` (matches the existing frame's authoring order, see metadata) |
| `Variant` | `Contained`   | `Contained`, `Text`, `Outlined`                              |
| `State`   | `Enabled`     | `Enabled`, `Hovered`, `Focused`, `Pressed`, `Disabled`       |
| `Size`    | `Medium`      | `Medium` _(single option; axis kept for prop parity)_        |

The published frame `1:4571` already enumerates every cell; verify the count after Step 5 with `count(component_set.children) === 90`.

### 3.1 Component (non-variant) properties

| Property key | Type   | Default | Purpose                                                                                          |
| ------------ | ------ | ------- | ------------------------------------------------------------------------------------------------ |
| `Icon`       | INSTANCE_SWAP | placeholder `User` glyph | The icon to display. Always `24 × 24 px`; bind `color` to the variant's foreground token via the icon component's `color` slot. |

(IconButton has a single icon slot — there is no Label, no Start/End icon distinction. The instance-swap exposes the icon to consumers without detaching.)

## 4. Usage Guidelines

### 4.1 Picking a variant

1. Pick `Color` matching the source `color` prop via §2.1 (Merak name, not MUI palette name).
2. Pick `Variant` by emphasis: `Contained` for high-emphasis icon actions (e.g. floating "Add" on a list header), `Outlined` for medium-emphasis, `Text` for inline / table-row actions.
3. Pick `State` only for flow / state demos — production screens stay on `Enabled`. `Disabled` for `disabled={true}`.
4. Swap the `Icon` instance to the host glyph (`@mui/icons-material` or the project icon set). Do not detach to recolor — the variant's foreground token already drives icon `color` via `currentColor`.

### 4.2 When to choose `<IconButton>` over `<Button>`

| Choose `<IconButton>` when…                                | Choose `<Button>` when…                                                |
| ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| The control is icon-only and the meaning is unambiguous (close, back, more) | The action needs a label for accessibility or scanability     |
| Space is tight (toolbar, list-row trailing slot, dialog header) | The action is the primary CTA or sits in a form footer            |
| You'd otherwise pair an icon with a 1-word label           | The icon is decorative and a label carries the meaning                 |

`<IconButton>` requires an `aria-label` at the consumer site — Figma cannot enforce this; flag it in handoff annotations.

### 4.3 Accessibility

- **Touch target.** Outer cell is `40 × 40 px` (Outlined `42 × 42`). This is **below WCAG 2.5.5 (44 × 44)**, by design — it matches the MUI default. Consumers placing IconButtons in touch-first contexts should either (a) increase the surrounding tap target via padding/spacing, or (b) substitute a larger control. Flag this in handoff annotations whenever the IconButton sits in a touch surface.
- **Accessible name.** IconButton is icon-only — every consumer instance must supply an `aria-label`. Figma cannot enforce this; flag in handoff.

### 4.4 Don'ts

- ❌ Detach the instance to recolor — every supported color exists as a variant.
- ❌ Use `Color=Default, Variant=Contained` for a primary action — its grey fill is MUI's `inherit` button.
- ❌ Stack a custom focus outline on top of `State=Focused` — the variant already paints the 3 px ring (Figma enhancement; runtime renders no ring on the box, see `storybook.render.md` §3).
- ❌ Assume `Color=Primary, State=Disabled` differs visually from `Color=Danger, State=Disabled` — Disabled collapses to greyscale alias tokens.
- ❌ Use `<IconButton>` with a label adjacent on the canvas — that's `<Button>` with `startIcon` / `endIcon`.

## 5. Token Glossary

Token names below are **Figma variable paths** in the `merak` collection — see [`.claude/skills/figma-design-guide/design-token.md`](../../figma-design-guide/design-token.md). Bind every Figma paint / stroke to one of these — never to a literal hex.

### 5.1 Seed color tokens (`seed/<C>/*`)

`<C>` stands for any of `primary | danger | warning | info | success`. `Default` is excluded — it routes through `alias/*` + IconButton-scoped tokens (§5.2 / §5.5). `seed/neutral/focusVisible` is the focus-ring color when `Color=Default`.

| Suffix           | Used by                                                              | Role                                                                                                       |
| ---------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `/main`          | All variants `State ∈ {Enabled, Focused}`                            | Brand color — `Text`/`Outlined` foreground (label + icon), `Contained` background                          |
| `/hover`         | `Variant=Contained, State ∈ {Hovered, Pressed}`                      | Darker shade for Contained hover/pressed background                                                        |
| `/hover-bg`      | `Variant ∈ {Text, Outlined}, State ∈ {Hovered, Pressed}`             | 4 % tinted overlay — named `/outline-hover` for Danger / Warning families                                  |
| `/on`            | `Variant=Contained` foreground                                       | Icon color rendered on top of `/main` / `/hover`                                                           |
| `/outlineBorder` | `Variant=Outlined, State ∈ {Enabled, Focused}`                       | 50 %-α border color                                                                                        |
| `/focusVisible`  | `State=Focused` 3 px ring (`seed/neutral/focusVisible` for Default)  | Focus ring color                                                                                           |

### 5.2 Alias tokens (`alias/colors/*`)

| Token                           | Used by                                                                     | Role                                                                                |
| ------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `alias/colors/text-default`     | `Color=Default`, all variants                                               | Default foreground (icon) — `palette/text/primary` (87 % black)                     |
| `alias/colors/fg-disabled`      | `State=Disabled`, all variants                                              | 26 % black foreground (`palette/action/disabled`)                                   |
| `alias/colors/bg-outline-hover` | `Color=Default, Variant ∈ {Text, Outlined}, State ∈ {Hovered, Pressed}`     | 4 % black overlay                                                                   |
| `alias/colors/bg-disabled`      | `State=Disabled` (Outlined border, Contained background)                    | 12 % black surface (resolves to `#000` at full α; the 12 % is applied via paint `opacity` to mirror `<Button>`'s convention — see note below) |

**Note on disabled-paint α.** `alias/colors/bg-disabled` and `alias/colors/fg-disabled` resolve to a black variable (`#000`); the runtime `0.12` / `0.26` α is applied as `paint.opacity` rather than baked into the token. This deliberately mirrors `<Button>`'s convention so a single alias drives both. Spec-guide §4.4 prefers pre-alpha'd tokens; if/when the alias collection grows pre-alpha'd siblings (`bg-disabled-12`, `fg-disabled-26`), promote both Button and IconButton in the same PR.

### 5.3 Shape & elevation

- **Outer box**: `40 × 40 px` (Text / Contained), `42 × 42 px` (Outlined; 1 px border on each side). Padding `8 px`.
- **Border radius**: `50 %` (full circle).
- **Outline border width**: `1 px` (Outlined variants).
- **Focus ring**: `3 px` solid border using `seed/<C>/focusVisible` (Default uses `seed/neutral/focusVisible`).
- **Contained shadow** mirrors `<Button>`'s MD elevation ramp: `shadows-2` rest, `shadows-4` hovered, `shadows-6` focused, `shadows-8` pressed, `none` disabled. `Text` and `Outlined` never carry a shadow.

### 5.4 Typography

n/a — `<IconButton>` has no text. The icon is a vector glyph whose `color` inherits from the variant's foreground token via `currentColor`.

### 5.5 Component tokens

`<IconButton>` borrows `<Button>`'s `Default`-color resolver tokens directly (the values are byte-identical and the resolver path is the same MUI `inherit` branch):

| Token                                       | Used by                                                |
| ------------------------------------------- | ------------------------------------------------------ |
| `component/button/contained-default-bg`     | `Color=Default, Variant=Contained, State=Enabled` fill |
| `component/button/outlined-default-border`  | `Color=Default, Variant=Outlined` border (87 % black, **not** the 50 %-α `outlineBorder` pattern) |

See [`../Button/design-token.md`](../Button/design-token.md) for resolver notes. If/when a third consumer needs them, promote both to `merak/alias/colors/*` (e.g. `bg-default-strong`, `border-default-strong`) and update both component dirs in the same PR. `<IconButton>`'s own [`./design-token.md`](./design-token.md) covers only IconButton-specific layout values (focus-ring width, elevation aliases).

## 6. Render Binding Matrix

The cell-by-cell paint / stroke / effect bindings for every variant. `<C>` denotes the seed family for themed colors `{primary | danger | warning | info | success}`.

- **Fill** — node fill (background paint).
- **Stroke** — node stroke. Outlined uses `1 px`; Focused stacks a `3 px` ring as an additional border (see §5.3).
- **Foreground** — icon paint (the icon component's `color` slot, which the SVG inherits via `currentColor`).
- **Effect** — drop-shadow on the node.

### 6.1 Constants (all cells, Size=Medium)

| Property                                | Value                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------- |
| Outer width × height (Text / Contained) | `40 × 40 px`                                                           |
| Outer width × height (Outlined)         | `42 × 42 px` (1 px border on each side)                                |
| Padding                                 | `8 px` (all sides, all variants)                                       |
| Corner radius                           | `50 %` (full circle)                                                   |
| Icon slot                               | `24 × 24 px`, centered, `currentColor`                                 |
| Focus ring (when `State=Focused`)       | `3 px` solid border using `seed/<C>/focusVisible` / `seed/neutral/focusVisible` |

### 6.2 `State=Enabled`

| Variant   | Color   | Fill                                          | Stroke                                          | Foreground                  | Effect          |
| --------- | ------- | --------------------------------------------- | ----------------------------------------------- | --------------------------- | --------------- |
| Text      | Default | —                                             | —                                               | `alias/colors/text-default` | —               |
| Text      | `<C>`   | —                                             | —                                               | `seed/<C>/main`             | —               |
| Outlined  | Default | —                                             | `component/button/outlined-default-border`      | `alias/colors/text-default` | —               |
| Outlined  | `<C>`   | —                                             | `seed/<C>/outlineBorder`                        | `seed/<C>/main`             | —               |
| Contained | Default | `component/button/contained-default-bg`       | —                                               | `alias/colors/text-default` | MD `shadows-2`  |
| Contained | `<C>`   | `seed/<C>/main`                               | —                                               | `seed/<C>/on`               | MD `shadows-2`  |

### 6.3 `State=Hovered`

The themed hover-overlay token is `seed/<C>/hover-bg` for `primary | info | success` and `seed/<C>/outline-hover` for `danger | warning`.

| Variant   | Color   | Fill                            | Stroke                                                   | Foreground                  | Effect          |
| --------- | ------- | ------------------------------- | -------------------------------------------------------- | --------------------------- | --------------- |
| Text      | Default | `alias/colors/bg-outline-hover` | —                                                        | `alias/colors/text-default` | —               |
| Text      | `<C>`   | `seed/<C>/hover-bg`             | —                                                        | `seed/<C>/main`             | —               |
| Outlined  | Default | `alias/colors/bg-outline-hover` | `component/button/outlined-default-border`               | `alias/colors/text-default` | —               |
| Outlined  | `<C>`   | `seed/<C>/hover-bg`             | `seed/<C>/main` (full α — drops the 50 %-α `outlineBorder`) | `seed/<C>/main`          | —               |
| Contained | Default | `component/button/contained-default-bg` | —                                                | `alias/colors/text-default` | MD `shadows-4`  |
| Contained | `<C>`   | `seed/<C>/hover`                | —                                                        | `seed/<C>/on`               | MD `shadows-4`  |

### 6.4 `State=Focused`

Every cell stacks a `3 px` solid border using `seed/<C>/focusVisible` (or `seed/neutral/focusVisible` for Default). Contained additionally raises the elevation to `shadows-6`. Outer box grows by `6 px` (3 px on each side) when the ring is rendered as an outset border; if Figma uses an inset border, account for the icon slot offset.

| Variant   | Color   | Fill                                          | Stroke (1 px outline + 3 px focus ring)                                          | Foreground                  | Effect          |
| --------- | ------- | --------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------- | --------------- |
| Text      | Default | —                                             | `seed/neutral/focusVisible` ring                                                 | `alias/colors/text-default` | —               |
| Text      | `<C>`   | —                                             | `seed/<C>/focusVisible` ring                                                     | `seed/<C>/main`             | —               |
| Outlined  | Default | —                                             | `component/button/outlined-default-border` + `seed/neutral/focusVisible` ring    | `alias/colors/text-default` | —             |
| Outlined  | `<C>`   | —                                             | `seed/<C>/outlineBorder` + `seed/<C>/focusVisible` ring                          | `seed/<C>/main`             | —               |
| Contained | Default | `component/button/contained-default-bg`       | `seed/neutral/focusVisible` ring                                                 | `alias/colors/text-default` | MD `shadows-6`  |
| Contained | `<C>`   | `seed/<C>/main`                               | `seed/<C>/focusVisible` ring                                                     | `seed/<C>/on`               | MD `shadows-6`  |

### 6.5 `State=Pressed`

Pressed shares Hovered's color bindings but raises Contained elevation to `shadows-8`. `Text` and `Outlined` are visually identical to Hovered.

| Variant   | Color   | Fill                            | Stroke                                                   | Foreground                  | Effect          |
| --------- | ------- | ------------------------------- | -------------------------------------------------------- | --------------------------- | --------------- |
| Text      | Default | `alias/colors/bg-outline-hover` | —                                                        | `alias/colors/text-default` | —               |
| Text      | `<C>`   | `seed/<C>/hover-bg`             | —                                                        | `seed/<C>/main`             | —               |
| Outlined  | Default | `alias/colors/bg-outline-hover` | `component/button/outlined-default-border`               | `alias/colors/text-default` | —               |
| Outlined  | `<C>`   | `seed/<C>/hover-bg`             | `seed/<C>/main` (full α)                                 | `seed/<C>/main`             | —               |
| Contained | Default | `component/button/contained-default-bg` | —                                                | `alias/colors/text-default` | MD `shadows-8`  |
| Contained | `<C>`   | `seed/<C>/hover`                | —                                                        | `seed/<C>/on`               | MD `shadows-8`  |

### 6.6 `State=Disabled`

Themed colors collapse to greyscale alias tokens — `Color=Primary, State=Disabled` is visually identical to `Color=Danger, State=Disabled`. The variant exists only so an `Enabled ↔ Disabled` toggle keeps the `Color` slot stable.

| Variant   | Fill                          | Stroke                        | Foreground                 | Effect |
| --------- | ----------------------------- | ----------------------------- | -------------------------- | ------ |
| Text      | —                             | —                             | `alias/colors/fg-disabled` | —      |
| Outlined  | —                             | `alias/colors/bg-disabled`    | `alias/colors/fg-disabled` | —      |
| Contained | `alias/colors/bg-disabled`    | —                             | `alias/colors/fg-disabled` | none   |

## 7. Open issues

1. ~~Figma cell sizing.~~ **Resolved 2026-04-28** — Figma cells resized from `36 × 36` to runtime-matching `40 × 40` (Outlined `42 × 42` via `strokesIncludedInLayout: true`), with a `24 × 24` icon slot. Existing `1:4571` instances in consumer files will reflow.
2. ~~Story `sx` Contained hover.~~ **Resolved 2026-04-28** — Story `sx` left as-is by design (deferred / not needed for the spec contract). Figma authoring follows §6.3 Button-parity bindings; runtime divergence documented in `storybook.render.md` §4.
3. **MD elevation effect styles missing in this file.** No local effect styles named `material-design/shadows/*` exist (verified via `figma.getLocalEffectStylesAsync()` 2026-04-28). The 30 Contained cells therefore carry **zero shadow effects** today. Spec §6 still pins them to `shadows-2/4/6/8` as the design contract — the gap is in the file's effect-style library, not the spec. `<Button>`'s Contained cells likely have the same gap. Resolution path: create the four shared effect styles in this file (or its upstream library) and bind every Contained cell + Button's Contained cells in a single PR. Until then, Contained variants render visually flat.
4. **`loading` axis** is not represented in Figma. If/when a Loading variant is needed, add a 4th value to the `State` axis and document the `CircularProgress` overlay paint.
5. **`edge` prop** (negative-margin alignment) is layout-only and not represented as a variant.

## 8. Sync rules

When any of the following changes, update this spec **and** the named files in the same PR:

| Trigger                                                                    | Files to update                                                                                            |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `node_modules/@mui/material/IconButton/IconButton.js` changes (MUI bump)   | `figma.spec.md` §1 MUI version row, `storybook.render.md` §1 + §6                                          |
| `mui-theme.ts` adds/changes a `MuiIconButton` override                     | `figma.spec.md` §1, `storybook.render.md` §1 + §3                                                          |
| `src/stories/IconButton.stories.tsx` `variantSx` changes                   | `figma.spec.md` §6, `storybook.render.md` §4 (if Hovered/Pressed alters)                                   |
| Figma frame `1:4571` variant axes / cell count change                      | `figma.spec.md` §3, re-run figma-component-upload to refresh `figma-init` snapshot                         |
| `seed/*` or `alias/*` tokens used by IconButton are renamed in Figma       | `figma.spec.md` §5 + §6, `figma-design-guide/design-token.md`                                              |
| Default-color `contained-bg` / `outlined-default-border` are promoted from `component/button/*` to a shared `merak/*` token | `figma.spec.md` §5.5 + §6, `design-token.md` (this dir), and Button's `design-token.md` |

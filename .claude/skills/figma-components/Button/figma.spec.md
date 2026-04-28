---
name: figma-component-button-spec
description: Figma component specification for `<Button>` — design counterpart of the MUI `<Button>` consumed by `src/stories/Button.stories.tsx`. Documents the variant matrix (Color × Variant × State, Size=Medium), component properties (Start Icon / End Icon / Label), source-to-Figma mapping, and the per-cell Render Binding Matrix (§6) that pins every fill / stroke / shadow / foreground to a named token. For component-scoped tokens see `design-token.md` in this directory; for runtime measurements see `storybook.render.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '1:4109'
---

# `<Button>` Figma Component Specification

## 1. Overview

`<Button>` is the Figma counterpart of the MUI `<Button>` consumed in `src/stories/Button.stories.tsx`. The package re-exports MUI Button directly — there is no wrapper — so the Figma component encodes the MUI prop surface (`color`, `variant`, `size`, `startIcon`, `endIcon`, plus interaction state) as variant axes and component properties.

| Aspect            | Value                                                                             |
| ----------------- | --------------------------------------------------------------------------------- |
| Source story      | `src/stories/Button.stories.tsx`                                                  |
| Underlying source | `@mui/material` `Button` (re-exported by this package)                            |
| Figma frame       | `<Button>` (`1:4109`) on page **Components**                                      |
| Total variants    | **90** (6 Colors × 3 Variants × 5 States, Size=Medium only)                       |
| Typography        | Roboto Medium, `14 / 24.5 px`, letter-spacing `0.4 px`, `text-transform: uppercase` |

## 2. Source-to-Figma Property Mapping

| MUI prop                  | Figma property | Type    | Notes                                                                                    |
| ------------------------- | -------------- | ------- | ---------------------------------------------------------------------------------------- |
| `color`                   | `Color`        | VARIANT | Merak design-system key; mapping in §2.1                                                 |
| `variant`                 | `Variant`      | VARIANT | `Text` / `Outlined` / `Contained`                                                        |
| _(interaction state)_     | `State`        | VARIANT | `Enabled` / `Hovered` / `Focused` / `Pressed` / `Disabled`                               |
| `size`                    | `Size`         | VARIANT | Only `Medium` is shipped on canvas; Small / Large are runtime-only (see `storybook.render.md` §5) |
| `startIcon`               | `Start Icon`   | BOOLEAN | Toggle leading icon visibility (20 × 20 slot)                                            |
| `endIcon`                 | `End Icon`     | BOOLEAN | Toggle trailing icon visibility (20 × 20 slot)                                           |
| `children`                | `Label`        | TEXT    | Default `Button`; rendered uppercase via `textCase=UPPER`                                |
| `disabled`                | —              | —       | Encoded as `State=Disabled`                                                              |
| `onClick`, `type`, etc.   | —              | —       | Behavior-only, no design representation                                                  |

### 2.1 Color value mapping

The Merak design-system color keys map to MUI palette names; in Figma, designers pick the Merak name. Bind the Figma fill / stroke to the listed token family — never paste raw hex.

| Merak key (source) | MUI palette key | Figma token family                                                          | Figma `Color` value |
| ------------------ | --------------- | --------------------------------------------------------------------------- | ------------------- |
| `default`          | `inherit`       | `alias/colors/text-default` _(non-contained)_ + Button-scoped tokens (§5.5) | **Default**         |
| `primary`          | `primary`       | `seed/primary/*`                                                            | **Primary**         |
| `danger`           | `error`         | `seed/danger/*`                                                             | **Danger**          |
| `warning`          | `warning`       | `seed/warning/*`                                                            | **Warning**         |
| `info`             | `info`          | `seed/info/*`                                                               | **Info**            |
| `success`          | `success`       | `seed/success/*`                                                            | **Success**         |

## 3. Variant Property Matrix

```
Color × Variant × State (Size=Medium)   =   6 × 3 × 5   =   90 variants
```

| Property  | Default value | Options                                                      |
| --------- | ------------- | ------------------------------------------------------------ |
| `Color`   | `Default`     | `Default`, `Primary`, `Danger`, `Warning`, `Info`, `Success` |
| `Variant` | `Text`        | `Text`, `Outlined`, `Contained`                              |
| `State`   | `Enabled`     | `Enabled`, `Hovered`, `Focused`, `Pressed`, `Disabled`       |
| `Size`    | `Medium`      | `Medium` _(single option; axis kept for prop parity)_        |

### 3.1 Component (non-variant) properties

| Property key | Type    | Default  | Purpose                                                          |
| ------------ | ------- | -------- | ---------------------------------------------------------------- |
| `Start Icon` | BOOLEAN | `false`  | Show / hide the leading icon (`Icon Left` slot, 20 × 20 px)      |
| `End Icon`   | BOOLEAN | `false`  | Show / hide the trailing icon (`Icon Right` slot, 20 × 20 px)    |
| `Label`      | TEXT    | `Button` | Label string; rendered uppercase via `textCase=UPPER`            |

## 4. Usage Guidelines

### 4.1 Picking a variant

1. Pick `Color` matching the source `color` prop via §2.1 (Merak name, not MUI palette name).
2. Pick `Variant` by emphasis: `Contained` for primary action, `Outlined` for secondary, `Text` for tertiary / inline.
3. Pick `State` only for flow / state demos — production screens stay on `Enabled`. `Disabled` for `disabled={true}`.
4. Toggle `Start Icon` / `End Icon` to match the source props. Don't leave the default loading glyph on when the source passes no icon.

### 4.2 Action semantics

| Action intent                          | Color                  | Variant     |
| -------------------------------------- | ---------------------- | ----------- |
| Primary CTA (save, submit, confirm)    | `Primary`              | `Contained` |
| Secondary action (cancel, dismiss)     | `Default` or `Primary` | `Outlined`  |
| Destructive (delete, revoke)           | `Danger`               | `Contained` |
| Approval                               | `Success`              | `Contained` |
| Cautionary (downgrade, archive)        | `Warning`              | `Outlined`  |
| Tertiary / inline link-like            | any                    | `Text`      |

### 4.3 Don'ts

- ❌ Detach the instance to recolor — every supported color exists as a variant.
- ❌ Override `Label` to lowercase hoping it stays — `textCase=UPPER` will uppercase it.
- ❌ Use `Color=Default, Variant=Contained` for a "primary" action — its grey fill is MUI's `inherit` button.
- ❌ Stack a custom focus outline on top of `State=Focused` — the variant already paints the 3 px ring.
- ❌ Assume `Color=Primary, State=Disabled` differs visually from `Color=Danger, State=Disabled` — Disabled collapses to greyscale alias tokens.

## 5. Token Glossary

Token names below are **Figma variable paths** in the `merak` collection — see [`.claude/skills/figma-design-guide/design-token.md`](../../figma-design-guide/design-token.md). Bind every Figma paint / stroke / variable to one of these — never to a literal hex.

### 5.1 Seed color tokens (`seed/<C>/*`)

`<C>` stands for any of `primary | danger | warning | info | success`. `Default` is excluded — it routes through `alias/*` + Button-scoped tokens (§5.2 / §5.5). `seed/neutral/focusVisible` is the focus-ring color when `Color=Default`.

| Suffix           | Used by                                            | Role                                                                                                       |
| ---------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `/main`          | All variants `State ∈ {Enabled, Focused}`          | Brand color — `Text`/`Outlined` foreground, `Contained` background                                         |
| `/hover`         | `Variant=Contained, State ∈ {Hovered, Pressed}`    | Darker shade for Contained hover/pressed background                                                        |
| `/hover-bg`      | `Variant ∈ {Text, Outlined}, State ∈ {Hovered, Pressed}` | 4 % tinted overlay — named `/outline-hover` for Danger / Warning families                            |
| `/on`            | `Variant=Contained` foreground                     | Text + icon color rendered on top of `/main` / `/hover`                                                    |
| `/outlineBorder` | `Variant=Outlined, State ∈ {Enabled, Focused}`     | 50 %-α border color                                                                                        |
| `/focusVisible`  | `State=Focused` 3 px ring (`seed/neutral/focusVisible` for Default) | Focus ring color                                                                          |

### 5.2 Alias tokens (`alias/colors/*`)

| Token                           | Used by                                                                     | Role                                                            |
| ------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `alias/colors/text-default`     | `Color=Default`, all variants                                               | Default foreground (label + icon) — `palette/text/primary` (87 % black) |
| `alias/colors/fg-disabled`      | `State=Disabled`, all variants                                              | 26 % black foreground (`palette/action/disabled`)               |
| `alias/colors/bg-outline-hover` | `Color=Default, Variant ∈ {Text, Outlined}, State ∈ {Hovered, Pressed}`     | 4 % black overlay                                               |
| `alias/colors/bg-disabled`      | `State=Disabled` (Outlined border, Contained background)                    | 12 % black surface                                              |

### 5.3 Shape & elevation

- **Corner radius**: `4 px` (`theme.shape.borderRadius`).
- **Outline border width**: `1 px` (Outlined variants).
- **Focus ring**: implemented as a `3 px` solid border using `seed/<C>/focusVisible` (Default uses `seed/neutral/focusVisible`).
- **Contained shadow** follows MUI's MD elevation ramp: `shadows-2` rest, `shadows-4` hovered, `shadows-6` focused, `shadows-8` pressed, `none` disabled. `Text` and `Outlined` never carry a shadow.

### 5.4 Typography

MUI default Button typography (no project override):

- Font: Roboto Medium 500
- Size / line-height: `14 px / 24.5 px` (line-height ratio `1.75`)
- `letter-spacing: 0.4 px`, `text-transform: uppercase`

### 5.5 Component tokens

Defined in [`./design-token.md`](./design-token.md). The two values consumed by Figma today are:

| Token                                       | Used by                                                |
| ------------------------------------------- | ------------------------------------------------------ |
| `component/button/contained-default-bg`     | `Color=Default, Variant=Contained, State=Enabled` fill |
| `component/button/outlined-default-border`  | `Color=Default, Variant=Outlined` border (87 % black, **not** the 50 %-α `outlineBorder` pattern) |

`design-token.md` also lists conceptual layout tokens (`icon-gap`, `icon-edge-offset`, `focus-ring-width`, elevation aliases). They are part of the contract even when Figma stores their values inline rather than as published variables.

## 6. Render Binding Matrix

The cell-by-cell paint / stroke / effect bindings for every variant. `<C>` denotes the seed family for themed colors `{primary | danger | warning | info | success}`.

- **Fill** — node fill (background paint).
- **Stroke** — node stroke. Outlined uses `1 px`; Focused stacks a `3 px` ring as an additional border (see §5.3).
- **Foreground** — both the label TEXT node fill and any icon paint inside `Icon Left` / `Icon Right`.
- **Effect** — drop-shadow on the node.

### 6.1 Constants (all cells, Size=Medium)

| Property                                | Value                                                                              |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Min width                               | `64 px`                                                                            |
| Outer height                            | `36 px` Auto Layout HUG (runtime measures `36.5 px` due to `24.5 px` line-height)  |
| Corner radius                           | `4 px`                                                                             |
| Padding (T R B L) — `Variant=Text`      | `6 8 6 8`                                                                          |
| Padding (T R B L) — `Variant=Outlined`  | `5 15 5 15` (1 px absorbed by border)                                              |
| Padding (T R B L) — `Variant=Contained` | `6 16 6 16`                                                                        |
| Icon slot — gap to label                | `8 px`                                                                             |
| Icon slot — outer-edge offset           | `-4 px` (visual side-padding becomes `12 px` on the icon side)                     |
| Typography                              | Roboto Medium, `14 / 24.5 px`, `letter-spacing: 0.4 px`, `text-transform: uppercase` |

### 6.2 `State=Enabled`

| Variant   | Color   | Fill                                       | Stroke                                       | Foreground                  | Effect          |
| --------- | ------- | ------------------------------------------ | -------------------------------------------- | --------------------------- | --------------- |
| Text      | Default | —                                          | —                                            | `alias/colors/text-default` | —               |
| Text      | `<C>`   | —                                          | —                                            | `seed/<C>/main`             | —               |
| Outlined  | Default | —                                          | `component/button/outlined-default-border`   | `alias/colors/text-default` | —               |
| Outlined  | `<C>`   | —                                          | `seed/<C>/outlineBorder`                     | `seed/<C>/main`             | —               |
| Contained | Default | `component/button/contained-default-bg`    | —                                            | `alias/colors/text-default` | MD `shadows-2`  |
| Contained | `<C>`   | `seed/<C>/main`                            | —                                            | `seed/<C>/on`               | MD `shadows-2`  |

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

Every cell stacks a `3 px` solid border using `seed/<C>/focusVisible` (or `seed/neutral/focusVisible` for Default). Contained additionally raises the elevation to `shadows-6`.

| Variant   | Color   | Fill                                       | Stroke (1 px outline + 3 px focus ring)                                          | Foreground                  | Effect          |
| --------- | ------- | ------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------- | --------------- |
| Text      | Default | —                                          | `seed/neutral/focusVisible` ring                                                 | `alias/colors/text-default` | —               |
| Text      | `<C>`   | —                                          | `seed/<C>/focusVisible` ring                                                     | `seed/<C>/main`             | —               |
| Outlined  | Default | —                                          | `component/button/outlined-default-border` + `seed/neutral/focusVisible` ring    | `alias/colors/text-default` | —               |
| Outlined  | `<C>`   | —                                          | `seed/<C>/outlineBorder` + `seed/<C>/focusVisible` ring                          | `seed/<C>/main`             | —               |
| Contained | Default | `component/button/contained-default-bg`    | `seed/neutral/focusVisible` ring                                                 | `alias/colors/text-default` | MD `shadows-6`  |
| Contained | `<C>`   | `seed/<C>/main`                            | `seed/<C>/focusVisible` ring                                                     | `seed/<C>/on`               | MD `shadows-6`  |

### 6.5 `State=Pressed`

Pressed shares Hovered's color bindings (overlay / `<C>/hover` background) but raises Contained elevation to `shadows-8`. `Text` and `Outlined` are visually identical to Hovered.

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

---
name: figma-component-button
description: Figma component specification for `<Button>` (MerakButton v2) — the design counterpart of `apps/console/src/components/Button/Button.tsx`. Documents variant matrix (Color × Variant × State, Size=Medium only), component properties (Start Icon / End Icon / Label), design tokens, Focused / Pressed state behavior, and source-to-Figma mapping rules.
parent_skill: figma-components
---

# `<Button>` Figma Component Specification (v2)

## 1. Overview

`<Button>` is the Figma counterpart of the `Button` foundation component in `apps/console/src/components/Button/Button.tsx`. The source is a thin wrapper around MUI `<Button>` that maps `MerakColorTheme` semantic colors onto MUI palette colors and forwards MUI's `variant`, `size`, `startIcon`, `endIcon`, plus all native `<button>` props.

This is the **second-generation** MerakButton. Relative to v1 it:

- **Drops the Size axis** — only `Medium` is shipped as a canvas variant (Small / Large are produced at runtime by MUI from the same props, but are no longer represented in Figma).
- **Adds `End Icon`** as a BOOLEAN component property (mirrors the existing `Start Icon`).
- **Adds `Focused` and `Pressed` states** to the `State` variant axis.
- Rebinds every paint / stroke to Merak `seed/*` and `alias/colors/*` tokens so light / dark themes resolve through Figma variables.

The Figma component encodes that surface as a single Component Set with three variant axes and three component properties so designers can reproduce every meaningful state of the React component without detaching.

| Aspect                 | Value                                                                             |
| ---------------------- | --------------------------------------------------------------------------------- |
| Source file            | `apps/console/src/components/Button/Button.tsx`                                   |
| Figma frame            | `Button` on page **Utils Component**                                              |
| Component Set          | `<Button>`                                                                        |
| Total variants         | **90** (6 colors × 3 variants × 5 states)                                         |
| Underlying MUI version | `@mui/material@5+`                                                                |
| Typography             | Roboto Medium, `14 / 24 px`, letter-spacing `0.4 px`, `text-transform: uppercase` |

## 2. Source-to-Figma Property Mapping

| Source prop (`Button.tsx`)               | Figma property                  | Type    | Notes                                                                                 |
| ---------------------------------------- | ------------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `color: MerakColorTheme`                 | `Color`                         | VARIANT | `MerakThemeColors` keys → Figma options below                                         |
| `variant: MuiButtonProps['variant']`     | `Variant`                       | VARIANT | `text` / `outlined` / `contained`                                                     |
| (interaction state)                      | `State`                         | VARIANT | `Enabled` / `Hovered` / `Focused` / `Pressed` / `Disabled`                            |
| `size: MuiButtonProps['size']`           | `Size`                          | VARIANT | Axis retained for back-compat — only `Medium` is shipped; non-Medium is behavior-only |
| `startIcon: MuiButtonProps['startIcon']` | `Start Icon`                    | BOOLEAN | Toggle leading icon visibility                                                        |
| `endIcon: MuiButtonProps['endIcon']`     | `End Icon`                      | BOOLEAN | Toggle trailing icon visibility (**new in v2**)                                       |
| `children`                               | `Label`                         | TEXT    | Default `Button`; rendered uppercase                                                  |
| `disabled` (native)                      | encoded inside `State=Disabled` | —       | Use the `Disabled` state variant                                                      |
| `onClick`, `type`, etc.                  | —                               | —       | Behavior-only, no design representation                                               |

### 2.1 Color value mapping

The source uses `MuiThemeByThemeColors` to translate Merak theme keys to MUI color names, and `CssVarByThemeColors` / `ClassNameByThemeColors` (`apps/console/src/themes/constants.tsx`) to expose the matching CSS custom property. The Figma component drops the MUI indirection and exposes Merak names directly — every option is backed by a Merak design token. Token names below use **Figma variable paths** (as declared in the `merak` collection), not the underlying CSS variables.

| `MerakColorTheme` (source) | MUI palette (`MuiThemeByThemeColors`) | Figma token family                                                              | Figma `Color` value |
| -------------------------- | ------------------------------------- | ------------------------------------------------------------------------------- | ------------------- |
| `default`                  | `inherit`                             | `alias/colors/text-default` _(non-contained)_ / `seed/tertiary/*` _(contained)_ | **Default**         |
| `primary`                  | `primary`                             | `seed/primary/*`                                                                | **Primary**         |
| `danger`                   | `error`                               | `seed/danger/*`                                                                 | **Danger**          |
| `warning`                  | `warning`                             | `seed/warning/*`                                                                | **Warning**         |
| `info`                     | `info`                                | `seed/info/*`                                                                   | **Info**            |
| `success`                  | `success`                             | `seed/success/*`                                                                | **Success**         |

> When pulling an instance into a screen, pick the Figma **Color** value matching the `MerakColorTheme` key — never the MUI palette name. Bind the Figma fill / stroke to the listed token family; never paste raw hex.

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

| Property key | Type    | Default  | Purpose                                                                                        |
| ------------ | ------- | -------- | ---------------------------------------------------------------------------------------------- |
| `Start Icon` | BOOLEAN | `false`  | Show / hide the leading icon (`Icon Left` slot, 20 × 20 px).                                   |
| `End Icon`   | BOOLEAN | `false`  | Show / hide the trailing icon (`Icon Right` slot, 20 × 20 px). **New in v2.**                  |
| `Label`      | TEXT    | `Button` | Label string. Linked to the text node's `characters`; rendered uppercase via `textCase=UPPER`. |

> Figma property ids (the `#1234:5` suffix) are assigned by the editor and are not guaranteed stable across re-publishes — always reference by the human-readable key when authoring.

## 4. Design Tokens

All colors, borders, and surfaces are bound to Merak design tokens declared in:

- `apps/console/src/themes/seed.css` — `--merak-seed-{family}-{token}` (palette by color family)
- `apps/console/src/themes/alias.css` — `--merak-alias-{group}-{token}` (semantic, color-agnostic)
- `apps/console/src/themes/light.ts` / `dark.ts` — JS values that produce the CSS variables above
- `apps/console/src/themes/constants.tsx` — JS-side mapping (`CssVarByThemeColors`, `ClassNameByThemeColors`)

In Figma, every paint **must** be bound to a Variable that mirrors one of these tokens. Hex values are never pasted — bind to the token so light / dark / theme variants resolve correctly.

### 4.1 Sizing (Medium)

`Button.tsx` does not override MUI's default Button metrics; the Figma component therefore mirrors MUI's `Medium` defaults verbatim. The project does not yet expose spacing / radius / typography size tokens, so these values are the source of truth until such tokens are added (see §8 Sync Rule).

| Property        | Value                                     |
| --------------- | ----------------------------------------- |
| Padding Y / X   | `6 / 16 px`                               |
| Item spacing    | `8 px` (between icon and label)           |
| Font size       | `14 px` / line-height `24 px`             |
| Icon slot       | `20 × 20 px` (both Start Icon / End Icon) |
| Corner radius   | `4 px`                                    |
| Focused ring    | `3 px` solid border (Text + Contained)    |
| Outlined stroke | `1 px`, `strokeAlign = INSIDE`            |

- Corner radius matches `theme.shape.borderRadius = 4` from `apps/console/src/themes/mui-theme.ts`.
- Typography: `Roboto Medium`, letter-spacing `0.4 px`, `text-transform: uppercase` (rendered in Figma via `textCase = UPPER`).

### 4.2 Color token bindings

For every color family, `main` / `hover` / `hover-bg` / `outlineBorder` / `focusVisible` / `on` map directly to one Merak seed token. Bind the Figma paint to the variable name in **bold**. Names below are Figma variable paths (`merak` collection).

| Figma `Color` | `main`                                               | `hover`                  | `hover-bg` _(4% tint)_              | `outlineBorder`                          | `focusVisible`                  | `on` (contained fg)    |
| ------------- | ---------------------------------------------------- | ------------------------ | ----------------------------------- | ---------------------------------------- | ------------------------------- | ---------------------- |
| Default       | **`alias/colors/text-default`** _(text/outlined fg)_ | n/a                      | **`alias/colors/bg-outline-hover`** | **`alias/colors/border-defalt`** _(sic)_ | **`seed/neutral/focusVisible`** | **`seed/tertiary/on`** |
| Primary       | **`seed/primary/main`**                              | **`seed/primary/hover`** | **`seed/primary/hover-bg`**         | **`seed/primary/outlineBorder`**         | **`seed/primary/focusVisible`** | **`seed/primary/on`**  |
| Danger        | **`seed/danger/main`**                               | **`seed/danger/hover`**  | **`seed/danger/outline-hover`**     | **`seed/danger/outlineBorder`**          | **`seed/danger/focusVisible`**  | **`seed/danger/on`**   |
| Warning       | **`seed/warning/main`**                              | **`seed/warning/hover`** | **`seed/warning/outline-hover`**    | **`seed/warning/outlineBorder`**         | **`seed/warning/focusVisible`** | **`seed/warning/on`**  |
| Info          | **`seed/info/main`**                                 | **`seed/info/hover`**    | **`seed/info/hover-bg`**            | **`seed/info/outlineBorder`**            | **`seed/info/focusVisible`**    | **`seed/info/on`**     |
| Success       | **`seed/success/main`**                              | **`seed/success/hover`** | **`seed/success/hover-bg`**         | **`seed/success/outlineBorder`**         | **`seed/success/focusVisible`** | **`seed/success/on`**  |

> The Default `Contained` variant maps onto the **tertiary** seed family (`seed/tertiary/main` / `…/hover` / `…/on`), matching the `MuiThemeByThemeColors[DEFAULT] = inherit` semantic — a neutral grey filled button.
>
> Danger & Warning use `outline-hover` (not `hover-bg`) for their 4% tint — this matches how the `merak` variable collection names the token for those two color families.
>
> The Default color's focus ring uses **`seed/neutral/focusVisible`** rather than a color-family ring, since `Default` has no seed color family of its own.

### 4.3 State rules

All non-color paints use semantic alias tokens so dark mode works automatically. Token names below are **the binding** — no raw hex anywhere.

| State        | Text                                                                                           | Outlined                                                                                                              | Contained                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Enabled**  | bg `transparent` · fg `main` · icon `main`                                                     | bg `transparent` · border `outlineBorder` _(1 px)_ · fg `main` · icon `main`                                          | bg `main` · fg `on` · icon `on`                                                                                 |
| **Hovered**  | bg `hover-bg` · fg `main` · icon `main`                                                        | bg `hover-bg` · border `main` _(1 px)_ · fg `main` · icon `main`                                                      | bg `hover` · fg `on` · icon `on`                                                                                |
| **Focused**  | bg `transparent` · **ring `focusVisible` (3 px border)** · fg `main` · icon `main`             | bg `transparent` · border `outlineBorder` _(1 px, unchanged)_ · fg `main` · icon `main`                               | bg `main` · **ring `focusVisible` (3 px border)** · fg `on` · icon `on`                                         |
| **Pressed**  | bg `hover-bg` · fg `main` · icon `main`                                                        | bg `hover-bg` · border `main` _(1 px)_ · fg `main` · icon `main`                                                      | bg `hover` · fg `on` · icon `on`                                                                                |
| **Disabled** | bg `transparent` · fg **`alias/colors/text-disabled`** · icon **`alias/colors/text-disabled`** | bg `transparent` · border **`alias/colors/bg-disabled`** · fg **`alias/colors/text-disabled`** · icon `text-disabled` | bg **`alias/colors/bg-disabled`** · fg **`alias/colors/text-disabled`** · icon **`alias/colors/text-disabled`** |

Notes:

- `alias/colors/bg-disabled`, `alias/colors/text-disabled`, and `alias/colors/bg-outline-hover` are color-family agnostic — they apply across all 6 colors. This is why disabled rows look identical regardless of `Color`.
- **Focused state** adds a 3 px ring bound to `seed/{color}/focusVisible` on `Text` and `Contained` variants. `Outlined / Focused` does **not** thicken the stroke — it keeps its 1 px `outlineBorder` and relies on the MUI runtime focus outline.
- **Pressed state** is visually identical to `Hovered` (same `hover` / `hover-bg` tokens) in v2. It exists as a separate state entry so consumers can wire `:active` styling independently if the token semantics diverge later.
- `Outlined / Hovered` and `Outlined / Pressed` upgrade the border binding from `outlineBorder` (semi-transparent) to `main` (full color); same token family, different stop.

## 5. Icons

`<Button>` v2 exposes two independent icon slots, both `20 × 20 px` auto-layout frames:

| Slot       | Property     | Default visibility | Frame dims | Node name    |
| ---------- | ------------ | ------------------ | ---------- | ------------ |
| Start Icon | `Start Icon` | `false`            | `20 × 20`  | `Icon Left`  |
| End Icon   | `End Icon`   | `false`            | `20 × 20`  | `Icon Right` |

- **Glyph source**: every slot hosts an **Instance** of the shared `<Icon>` component set on page **Utils Component**. The placeholder variant is `tdesign:loading` (a benign "unspecified" glyph) so the slot visibly renders while un-overridden.
- **Size mapping**: the instance is pinned to `Size=sm` to match the `20 × 20` slot. There is no per-button-size switch in v2 (Medium only).
- **Color**: the inner Vector's fill is overridden per variant to match the computed `fg` paint for `Variant` × `Color` × `State` — icon color tracks the label color exactly.
- **Visibility**: controlled by the `Start Icon` / `End Icon` BOOLEAN properties (both default `false`).
- **Swapping the glyph**: prefer Figma's instance-swap to a different `<Icon>` variant rather than detaching. If a feature needs a glyph not yet in the `<Icon>` set, extend that set first — do not add ad-hoc Vectors back into the Button.

## 6. Layout

The Component Set is laid out as **6 rows × 15 columns** inside the `<Button>` frame (`2860 × 400` px):

- **Rows** = `Color` (6).
- **Columns** = `Variant` (3) × `State` (5), interleaved (`Text/Enabled`, `Text/Hovered`, `Text/Focused`, `Text/Pressed`, `Text/Disabled`, `Outlined/Enabled`, …).
- Cell size: ~`180 × 60` px (component itself hugs content; cell provides grid spacing).

Surrounding documentation in the outer frame (`4203 × 1472`):

- **Header** — title, source path, behavior summary.
- **Use Case** panel — curated examples: Color × Variant matrix (`Primary/Contained` hover, etc.), States row, Start Icon toggle, End Icon toggle, Common usage (Save changes / Cancel / Delete / Learn more / Approve).
- **IconButton** — the sibling `<IconButton>` component set lives in the same frame; see its own skill for details (not covered by this spec).

## 7. Usage Guidelines

### 7.1 Picking a variant

1. Identify the `MerakColorTheme` value the engineer would pass to `<Button color={...}>` and choose the matching Figma **Color** (see §2.1).
2. Choose `Variant` based on emphasis: `Contained` for primary actions, `Outlined` for secondary, `Text` for tertiary or inline actions.
3. `Size` is `Medium` — the only option. If the engineering implementation uses `size="small"` or `size="large"`, document that in the spec rather than in Figma; v2 intentionally represents only Medium.
4. Use `State` only to demonstrate runtime behavior in flows or specs. Production screens should use `Enabled`. Use `Focused` when showcasing keyboard-navigation flows and `Pressed` when illustrating an active press.
5. Toggle `Start Icon` / `End Icon` **off** when the source code does not pass the matching prop. Don't leave the default loading glyph in mockups when the implementation has no icon.

### 7.2 Action semantics (recommended pairing)

| Action intent                          | Color                  | Variant     |
| -------------------------------------- | ---------------------- | ----------- |
| Primary CTA (save, submit, confirm)    | `Primary`              | `Contained` |
| Secondary action (cancel, dismiss)     | `Default` or `Primary` | `Outlined`  |
| Destructive action (delete, revoke)    | `Danger`               | `Contained` |
| Tertiary / inline link-like action     | any                    | `Text`      |
| Approval flow                          | `Success`              | `Contained` |
| Cautionary action (downgrade, archive) | `Warning`              | `Outlined`  |

### 7.3 Don'ts

- ❌ Don't detach the instance to recolor — every supported color exists as a variant.
- ❌ Don't override `Label` to lowercase strings hoping it stays lowercase. The text node uses `textCase=UPPER`; type the label in any casing, it will render uppercase.
- ❌ Don't use the Figma `Color=Default` + `Variant=Contained` combo for a "primary" action — its grey fill is the equivalent of MUI's `inherit` button.
- ❌ Don't add custom focus rings by stacking outlines on top — the `Focused` variant already binds the correct 3 px `focusVisible` ring.
- ❌ Don't assume `Pressed` renders differently from `Hovered` in v2 — if the visual needs to diverge, update §4.3 and the Figma bindings first.

## 8. Source Sync Rule

This document and the source must move together (per the project's **Features Sync Rule** spirit, applied here to design-system components):

When **any** of the following changes:

1. `apps/console/src/components/Button/Button.tsx` (props, color mapping, default values, `endIcon` wiring)
2. The Figma `<Button>` component set (variants, properties, token bindings)
3. `apps/console/src/themes/constants.tsx` (`MerakThemeColors`, `MuiThemeByThemeColors`, `CssVarByThemeColors`, `ClassNameByThemeColors`)
4. `apps/console/src/themes/seed.css` / `alias.css` / `component.css` (CSS variable surface)
5. `apps/console/src/themes/light.ts` / `dark.ts` (alias token JS values feeding the CSS vars)
6. `apps/console/src/themes/mui-theme.ts` (`shape.borderRadius`, palette, typography overrides)
7. The shared `<Icon>` component set — variants added/removed/renamed, or the size-to-pixel mapping changes

…this spec **must be updated in the same change**. Specifically:

- New / removed `MerakColorTheme` value → update §2.1 mapping **and** add/remove the corresponding `Color` variant in Figma **and** the corresponding token row in §4.2.
- New MUI variant → update §3 matrix, regenerate affected variants, and update §4.1 metric table.
- Re-introducing `Small` / `Large` sizes → add the `Size` options back to §3, update §4.1 per size, and multiply the variant count accordingly.
- Token rename / removal in `seed.css` or `alias.css` → update every Figma token reference (`seed/…`, `alias/colors/…`) in §2.1, §4.2, §4.3 and §10 to the new name, and rename the matching variable in the `merak` Figma collection.
- Token value change in `light.ts` / `dark.ts` → no edit to this spec needed (Figma variables resolve through the same token name); only re-publish the Figma library.
- New component property (e.g., loading) → add to §3.1 with key, type, default, and linkage.
- Divergent behavior between `Pressed` and `Hovered` → replace the §4.3 "Pressed = Hovered" rule with the new binding.

## 9. Quick Reference

```ts
// Source prop surface (Button.tsx)
interface ButtonProps extends NativeButtonProps {
  color?: MerakColorTheme; // → Figma `Color`
  variant?: MuiButtonProps['variant']; // → Figma `Variant`
  size?: MuiButtonProps['size']; // Figma: Medium only
  startIcon?: MuiButtonProps['startIcon']; // → Figma `Start Icon` (BOOLEAN)
  endIcon?: MuiButtonProps['endIcon']; // → Figma `End Icon` (BOOLEAN)
}
```

```
Figma Component Set: <Button>
  Variant axes : Color × Variant × State   (Size=Medium locked)
  Properties   : Start Icon (BOOLEAN), End Icon (BOOLEAN), Label (TEXT)
  Default      : Color=Default, Variant=Text, State=Enabled, Size=Medium
  Total        : 90 variants
```

## 10. Token Glossary

The complete set of Merak design tokens consumed by `<Button>`. Names below are **Figma variable paths** in the `merak` collection (see `.claude/skills/figma-operator-guide/design-deken.md`). Bind every Figma paint / stroke / variable to one of these — never to a literal value.

### 10.1 Seed color tokens (`seed/*`)

For each color family `{primary | danger | warning | info | success | tertiary | neutral}` the following tokens are available:

| Token suffix     | Used by                                      | Role                                                                                                             |
| ---------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/main`          | All variants enabled / focused               | Primary brand color: `Text`/`Outlined` foreground, `Contained` background                                        |
| `/hover`         | Contained hovered / pressed                  | Darker shade for `Contained` hover & pressed background                                                          |
| `/hover-bg`      | Text / Outlined hovered / pressed            | 4% tinted overlay for `Text` & `Outlined` hover/pressed background — named `/outline-hover` for Danger / Warning |
| `/on`            | Contained foreground                         | Text + icon color rendered on top of `/main` / `/hover`                                                          |
| `/outlineBorder` | Outlined enabled / focused                   | Semi-transparent border color (~50% main)                                                                        |
| `/focusVisible`  | `State=Focused` (Text + Contained 3 px ring) | Focus ring color (`seed/neutral/focusVisible` for Default)                                                       |

Full names: `seed/primary/main`, `seed/primary/hover`, `seed/primary/hover-bg`, `seed/primary/on`, `seed/primary/outlineBorder`, `seed/primary/focusVisible` — and analogously for `danger`, `warning`, `info`, `success`, `tertiary`. Danger & Warning use `outline-hover` in place of `hover-bg`. Default's focus ring uses `seed/neutral/focusVisible`.

### 10.2 Alias tokens (`alias/colors/*`)

| Token                                | Used by                                                                     | Role                                                            |
| ------------------------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `alias/colors/text-default`          | `Color=Default`, `Variant ∈ {Text, Outlined}`                               | Default foreground for non-contained default buttons            |
| `alias/colors/text-disabled`         | `State=Disabled` (all variants)                                             | Foreground + icon color for any disabled button                 |
| `alias/colors/bg-outline-hover`      | `Color=Default`, `Variant ∈ {Text, Outlined}`, `State ∈ {Hovered, Pressed}` | 4% black overlay for default-color hover / pressed background   |
| `alias/colors/bg-disabled`           | `State=Disabled` (Outlined border, Contained background)                    | 12% black surface for disabled outlined border / contained fill |
| `alias/colors/border-defalt` _(sic)_ | `Color=Default`, `Variant=Outlined`, `State ∈ {Enabled, Focused}`           | Border color for the default outlined button                    |

### 10.3 Shape & elevation

- Corner radius: `theme.shape.borderRadius = 4` (from `mui-theme.ts`). The Figma component hard-codes `cornerRadius = 4` until a dedicated radius token exists.
- Elevation: not used by `<Button>` (`disableElevation` is the de-facto default; the contained variant uses no shadow). The Figma `shadows/shadows-{1..24}` effect styles are available if a future raised variant is introduced.
- Focus ring thickness: 3 px, hard-coded until a dedicated focus-ring token exists.

### 10.4 Typography

`Button.tsx` does not override MUI typography, so the following resolved values are used (from `theme.typography` defaults):

- Font family: `Roboto, Helvetica, Arial, sans-serif`
- Font weight: `Medium (500)`
- Size / line-height: `14 / 24 px`
- `text-transform: uppercase`
- `letter-spacing: 0.4 px`

These constants live in MUI's defaults; if the project later introduces typography tokens (e.g. `--merak-typography-button-*`), update §4.1 and §10.4 to bind to them.

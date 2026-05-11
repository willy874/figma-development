---
name: figma-component-navmenu-storybook-render
description: Computed-style matrix for `<NavMenu>` and `<NavMenuItem>` (MUINavMenu v1) measured against `src/stories/NavMenu.stories.tsx` via Chrome DevTools MCP. Documents per-cell box / paint / typography numbers across the State surface and the wrapper IsOpen=False/True composition. Companion to `figma.spec.md` (the contract).
parent_skill: figma-components
---

# `<NavMenu>` Storybook Render Measurements (v1)

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/NavMenu.stories.tsx`. Stories used: `StateMatrix` (5-state column for the leaf `<NavMenuItem>` at width 280 with leading + trailing icons + secondary text) and `NavMenuOpenStateMatrix` (the wrapper `<NavMenu>` at IsOpen=False / True with 4 nested children, the third Selected).

The package re-exports MUI's `<List>`, `<ListItemButton>`, `<ListItemAvatar>`, `<ListItemText>`, `<ListItemIcon>`, and `<Collapse>` directly — there is no source-side wrapper component. The stories declare `MUINavMenuItem` / `MUINavMenu` story-local components that compose those primitives with project-specific layout (8 px gutters, 24 × 24 avatar / chevron, 40 px nested indent). Every measurement below is for that fixed composition.

## 1. Item-axis invariants (single NavMenuItem, Default state, leading + trailing icon, with secondary text)

The 5 `State` values share these geometry / typography invariants. Numbers come from the leaf `<MUINavMenuItem>` cell rendered inside `StateMatrix`.

| Property                        | Value                                                                                                                |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| outer box (W × H)               | `280 × 64 px` (cell width is set by the `<List>` wrapper; height grows with secondary text — see §4)                 |
| `padding`                       | `8 px` (top / right / bottom / left)                                                                                 |
| `gap` (Auto Layout equivalent)  | `8 px` (between leading icon, label block, trailing icon)                                                            |
| `border-radius`                 | `4 px`                                                                                                               |
| `border`                        | `none` (ListItemButton is borderless; selected / hover paint goes on the background)                                 |
| `box-shadow`                    | `none`                                                                                                               |
| Leading avatar slot             | `24 × 24 px`, transparent background, glyph fill `rgba(0, 0, 0, 0.54)` (MUI's `text.secondary`-equivalent action tint) |
| Trailing icon slot              | `24 × 24 px`, color inherits from text — at runtime resolves to `rgba(0, 0, 0, 0.54)` for the chevron                |
| Primary label font              | `14 / 20 px Roboto Regular`, `letter-spacing: 0.13132 px` (MUI's `body2`-derived ramp), color `rgba(0, 0, 0, 0.87)` (`text.primary`) |
| Secondary label font            | `12 / 16 px Roboto Regular`, color `rgba(0, 0, 0, 0.6)` (`text.secondary`)                                            |
| Cursor (Default / Hover / Selected / Active) | `pointer`                                                                                               |
| Cursor (Disabled)               | `default`                                                                                                            |
| Pointer-events (Disabled)       | `none`                                                                                                               |

> The leading icon is rendered through `<ListItemAvatar>` + `<Avatar>` so the visual treatment matches the reference Figma `<ListItem>` (765:12320) — a 24 × 24 circular slot. The Avatar's background is forced transparent in the story so the glyph reads on every state's background.

## 2. State axis (NavMenuItem, leading + trailing icon, with secondary)

Probed via `StateMatrix`. `Hovered` cannot render statically without `storybook-addon-pseudo-states`; the matrix uses `Mui-focusVisible` as a visual stand-in. **Note the divergence**: `Mui-focusVisible` paints `palette.action.focus` (`rgba(0, 0, 0, 0.12)`) which is a **different** runtime paint from MUI's true `:hover` rule on `<ListItemButton>` (`palette.action.hover` = `rgba(0, 0, 0, 0.04)`). The Figma `State=Hover` cell binds to the **4 % black** `alias/colors/bg-outline-hover` per spec §6.3 — matching the MUI runtime `:hover` paint, **not** the focus-stand-in.

| Property         | Default                          | Hover (Mui-focusVisible stand-in) | Hover (true `:hover` runtime)       | Active (`:active`)            | Selected                                          | Disabled                          |
| ---------------- | -------------------------------- | --------------------------------- | ----------------------------------- | ----------------------------- | ------------------------------------------------- | --------------------------------- |
| `background`     | `rgba(0, 0, 0, 0)` (transparent) | `rgba(0, 0, 0, 0.12)` ¹           | `rgba(0, 0, 0, 0.04)` ²             | `rgba(0, 0, 0, 0)` ³          | `rgba(25, 118, 210, 0.08)` (`alpha(primary.main, 0.08)`) ⁴ | `rgba(0, 0, 0, 0)` (transparent)  |
| `color` (label)  | `rgba(0, 0, 0, 0.87)`            | `rgba(0, 0, 0, 0.87)` (unchanged) | `rgba(0, 0, 0, 0.87)` (unchanged)   | `rgba(0, 0, 0, 0.87)`         | `rgba(0, 0, 0, 0.87)` (MUI does **not** theme the label on Selected for `<ListItemButton>`; only the bg gets the primary tint) | `rgba(0, 0, 0, 0.87)` (paint unchanged — fade comes from `opacity: 0.38`) |
| `opacity`        | `1`                              | `1`                               | `1`                                 | `1`                           | `1`                                               | `0.38` (`palette.action.disabledOpacity`) |
| `box-shadow`     | `none`                           | `none`                            | `none`                              | `none`                        | `none`                                            | `none`                            |
| `cursor`         | `pointer`                        | `pointer`                         | `pointer`                           | `pointer`                     | `pointer`                                         | `default`                         |
| `pointer-events` | `auto`                           | `auto`                            | `auto`                              | `auto`                        | `auto`                                            | `none`                            |

¹ **Mui-focusVisible stand-in.** This is what the StateMatrix actually renders for the "Hover" row because `:hover` is pseudo-class. The 12 % overlay is `palette.action.focus`, not `palette.action.hover`. **Do not** copy this number into the Figma cell — bind the Hover variant to the 4 % `alias/colors/bg-outline-hover` token instead. `Mui-focusVisible` would correspond to a separate `State=Focused` axis if MUI ever ships one (tracked in §6 drift checks).

² **True `:hover` runtime.** Sourced from `node_modules/@mui/material/ListItemButton/ListItemButton.js`: `'&:hover': { backgroundColor: theme.palette.action.hover }`. The `palette.action.hover` token resolves to `rgba(0, 0, 0, 0.04)` in the default light theme — the **4 %** value the Figma cell must bind to.

³ **Active runtime.** MUI `<ListItemButton>` (via `<ButtonBase>`) emits a Touch Ripple on `:active`; there is no static `:active` background paint. The Figma `State=Active` cell deliberately bakes a **12 % black** overlay (`alias/colors/bg-filled-hover` = `palette.action.focus`) so designers can mock a "pressed" snapshot — see spec §6.3 / §7. This is a runtime-divergent design decision, not a measurement bug.

⁴ **Selected.** Sourced from `ListItemButton.js`: `'&.Mui-selected': { backgroundColor: theme.alpha(palette.primary.main, palette.action.selectedOpacity) }` where `selectedOpacity = 0.08`. Resolves to `rgba(25, 118, 210, 0.08)`. The label and trailing icon stay at their Default paints — MUI does not theme them on Selected (a single-color highlight only).

> **Selected + Hover (combined)**: MUI runtime composes `alpha(primary.main, selectedOpacity + hoverOpacity) = alpha(primary.main, 0.08 + 0.04) = alpha(primary.main, 0.12)` for the simultaneous Selected-and-hovered state. Not a discrete Figma variant — designers compose this by hand if they need to mock the pressed-on-selected snapshot.

## 3. Slot axis (NavMenuItem, Default state)

Probed via `Default`, `NoLeadingIcon`, `NoTrailingIcon`, `SinglelineNoSecondary`, and the nested rows inside `NavMenuOpen`.

| Story / configuration                 | outer (W × H) | padding (T R B L) | leading slot | trailing slot | label block (primary / secondary)             |
| ------------------------------------- | ------------- | ----------------- | ------------ | ------------- | --------------------------------------------- |
| `Default` (leading + trailing + secondary) | `280 × 64`   | `8 8 8 8`         | `24 × 24`    | `24 × 24`     | `List Item` 14/20 + `Secondary` 12/16         |
| `NoLeadingIcon`                       | `280 × 64`    | `8 8 8 8`         | —            | `24 × 24`     | same                                          |
| `NoTrailingIcon`                      | `280 × 64`    | `8 8 8 8`         | `24 × 24`    | —             | same                                          |
| `SinglelineNoSecondary`               | `280 × 44`    | `8 8 8 8`         | `24 × 24`    | `24 × 24`     | `List Item` 14/20 only (no secondary)         |
| Nested child (`nested=true`)          | `280 × 44`    | `8 8 8 40`        | `24 × 24`    | _(typically off — children rarely show chevrons)_ | `List Item` 14/20 only |

> Height collapses from 64 → 44 px when secondary text is absent (`<ListItemText>` only renders the primary line, dropping the second text node's `16 px`-line block + `4 px` flex gap = 20 px taken from total). Padding stays `8 px` top/bottom in both cases — the height delta is purely the second line.

> Nested children use `padding-left: 40 px` (= 8 px outer gutter + 24 px avatar slot + 8 px gap) so child labels align with parent labels. Trailing chevron is conventionally omitted on nested children (matches the reference `<Navbar>` `isOpen=True` rows in 765:12320).

## 4. Wrapper layout (`<NavMenu>` root, IsOpen=False / True)

Probed via `NavMenuOpenStateMatrix`.

| Property                       | IsOpen=False                                        | IsOpen=True                                                                                     |
| ------------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Outer `<List>` (W × H)         | `280 × 64 px` (header only)                         | `280 × 240 px` (header `64` + collapse `176` = 4 × `44`)                                         |
| Outer `<List>` padding / gap   | `padding: 0`, `gap: 0` (vertical stacking, items abut) | same                                                                                          |
| Header NavMenuItem             | `280 × 64`, `padding: 8`, `border-radius: 4`        | same — header geometry does not change when expanded                                             |
| Collapse container             | `display: none` (`MuiCollapse-hidden`), height `0`  | `MuiCollapse-entered`, height `176 px` (= 4 nested × 44)                                         |
| Nested child item              | n/a                                                 | `280 × 44`, `padding: 8 8 8 40` (40 px left indent), `gap: 8`, `border-radius: 4`                |
| Nested children spacing        | n/a                                                 | `0 px` (rows abut — no inter-item gap)                                                           |
| Selected nested child         | n/a                                                 | bg `rgba(25, 118, 210, 0.08)` (same Selected paint as the leaf — see §2)                          |
| Chevron rotation              | _(none)_                                             | _(none)_ — the trailing chevron does **not** rotate when IsOpen flips. Designers can swap glyph manually if they want a "v" expanded indicator (tracked in §6). |

> **No expand-collapse animation captured.** `<Collapse>` uses MUI's `transitions.duration.standard` (300 ms) `height` ease. Figma is a static snapshot — the IsOpen=False cell shows the collapsed end-state (children removed from layout, height = header), the IsOpen=True cell shows the expanded end-state (children at full height). No interpolation.

> **Chevron behavior**: the reference `<Navbar>` (765:12320) shows the trailing chevron pointing **right** in both isOpen=False and isOpen=True. The runtime story matches — there is no rotation. Some apps rotate the chevron 90° when expanded; that is **not** part of this Figma component's surface today.

## 5. Drift checks

If a Storybook re-measure produces values that disagree with the tables above, treat the difference as one of these cases — do not silently update the spec:

1. **MUI upgrade** — `@mui/material` major bumps may change the hard-coded `palette.action.{hover, focus, selected, disabledOpacity}` values, the default `selectedOpacity` (currently `0.08`), or the default `padding` ramp on `<ListItemButton>` (currently `8 px` vertical, `16 px` horizontal with default gutters — note we override `padding` in the story to `8 px` flat). Update `figma.spec.md` §1 MUI version row alongside this file.
2. **Theme override** — if `mui-theme.ts` introduces a `MuiListItemButton` / `MuiListItem` `defaultProps` / `styleOverrides` block (this project has none today), document it in §1 and re-derive §1–§4 values.
3. **Hover stand-in vs. true hover** — the Figma `State=Hover` cell binds to **4 % black** (`alias/colors/bg-outline-hover`, matching `palette.action.hover`), not the **12 %** the StateMatrix renders for its `Mui-focusVisible` row. If MUI adds a separate `State=Focused` axis later, that one would bind to the 12 % `palette.action.focus` token. Tracked in `figma.spec.md` §7.
4. **Active runtime divergence** — runtime renders no static `:active` paint (Touch Ripple instead). The Figma `State=Active` cell bakes a 12 % black overlay for design-mockup parity. Documented divergence — see `figma.spec.md` §7.
5. **Selected label tint** — the Figma cell currently keeps the label / icon at neutral defaults (matches MUI runtime). If the design ever wants a primary-tinted label on Selected (e.g. `seed/primary/main` foreground), that's a §8 sync trigger and would need a paint rebind in both Figma and a story-level `sx` override.
6. **Chevron rotation on expand** — if a future redesign rotates the trailing chevron 90° when `IsOpen=True`, both `figma.spec.md` §6 and a story-level `transform: rotate(90deg)` on `IsOpen=True` would need to be added in lockstep.

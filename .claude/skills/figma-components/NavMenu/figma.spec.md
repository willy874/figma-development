---
name: figma-component-navmenu-spec
description: Figma component specification for `<NavMenu>` and its child `<NavMenuItem>` — design counterpart of the MUI `<List>` + `<ListItemButton>` + `<Collapse>` composition consumed by `src/stories/NavMenu.stories.tsx`. Documents the leaf 5-state surface (`<NavMenuItem>`, 5 variants), the wrapper 2-state collapsible surface (`<NavMenu>`, 2 variants), source-to-Figma mapping for the `MerakNavMenuItem` / `MerakNavMenu` story-local components, and the divergences between MUI's stock `<ListItemButton>` paint values and the Merak token bindings. For component-scoped tokens (one 8 %-α primary `Selected` fill) see `design-token.md`; for runtime measurements see `storybook.render.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_parent_frame_id: '779:11816'
figma_node_id: '790:11848'
figma_component_set_id: '790:11848'
figma_wrapper_component_set_id: '793:11949'
---

# `<NavMenu>` Figma Component Specification

## 1. Overview

`<NavMenu>` is the Figma counterpart of the MUI `<List>` + `<ListItemButton>` + `<Collapse>` composition consumed in `src/stories/NavMenu.stories.tsx`. The package re-exports MUI directly — there is no source-side `NavMenu.tsx` / `NavMenuItem.tsx` wrapper. Instead, the Storybook story declares two story-local components — `MerakNavMenuItem` and `MerakNavMenu` — that pin a project-specific layout (8 px gutters, 24 × 24 avatar / chevron, 40 px nested indent, no `disableGutters` override) on top of the MUI primitives so every Figma cell has a runtime equivalent.

The specification covers two related design entities:

- **`<NavMenuItem>`** — the leaf row used inside any `<List>` or `<NavMenu>`; carries the State variant axis and the slot boolean / TEXT properties.
- **`<NavMenu>`** — the collapsible wrapper that pairs a header `<NavMenuItem>` instance with a Collapse-style children stack; carries the IsOpen variant axis and exposes the header's text + nested children for inline editing.

| Aspect                  | Value                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Source story            | `src/stories/NavMenu.stories.tsx`                                                                                                                      |
| Underlying source       | `@mui/material` `List` + `ListItemButton` + `ListItemAvatar` + `ListItemText` + `ListItemIcon` + `Collapse` (re-exported by this package, composed as `MerakNavMenuItem` / `MerakNavMenu` in the story) |
| Figma file              | `KQjP6W9Uw1PN0iipwQHyYn` (MUI Library)                                                                                                                  |
| Parent frame (authoring target) | `779:11816` (currently the empty `Menu` frame at `x=11912, y=0, w=1688, h=1531`)                                                                  |
| Figma item set          | `<NavMenuItem>` (`790:11848`) on page **Foundation Components**, inside the parent `Menu` frame (`779:11816`)                                          |
| Figma wrapper set       | `<NavMenu>` (`793:11949`) on page **Foundation Components**, inside the parent `Menu` frame (`779:11816`)                                              |
| Item variants           | **5** (1 State axis × 5 values) — see §3.1                                                                                                              |
| Wrapper variants        | **2** (1 IsOpen axis × 2 values) — see §3.3                                                                                                             |
| Underlying MUI version  | `@mui/material@^7.3.10` (per `package.json` peer-dep `>=7`, current devDep resolution `^7.3.10`)                                                        |
| Typography              | Roboto Regular, no `text-transform`, letter-spacing `0.13132 px` (Roboto's intrinsic `body2`-ramp resolution at 14 px, ≈`0.00938em`) — primary `14 / 20 px` (`body2`), secondary `12 / 16 px` |

**Reference nodes** (read-only, not the authoring target):

- `765:12320` "Navs: custom components" — the structural pattern source. Mirrored its 5-state `<ListItem>` axis (`Default / Hover / Active / Selected / Disabled`) and the `<Navbar>` `isOpen=False/True` wrapper composition verbatim. NavMenu published in this file is a fresh authoring of the same idea, bound to the local `merak` collection.
- `1:4108` "Button" — the naming-convention / token-binding exemplar. Mirrored the Merak axis-naming style and the local-only token rule.

**Variant axes are deliberately small.** Unlike Button / Pagination / Chip, `<NavMenuItem>` does **not** expose a `Color` axis — MUI's `<ListItemButton>` has no `color` prop, and the reference `<ListItem>` (765:12320) carried only State. The Selected paint is themed implicitly via `palette.primary.main × 0.08α` (see §6.4); designers needing a non-primary theme override the Selected bg via `sx` at the consuming app, not at the Figma component-set level. If a future product requirement adds a Color axis (e.g. a Danger-themed "destructive nav highlight"), that is a §8 sync trigger and would explode the matrix to 5 × 6 = 30 leaf variants.

**Local-only token bindings.** Per the project directive, every paint / stroke / text-fill in the NavMenu component sets binds to the **MUI Library Figma file's local `merak` collection** — never to the published library copy. The component is built to be self-contained; consumers dropping a `<NavMenuItem>` instance into a different file should not require the published `merak` library to be loaded. If the published library renames or removes a token, the local file does not break automatically; track the divergence in §8.

## 2. Source-to-Figma Property Mapping

### 2.1 Leaf item props (`<NavMenuItem>`)

Every prop on `MerakNavMenuItem` (from `src/stories/NavMenu.stories.tsx`) maps to a Figma surface — either the variant axis, a component property, or a layout invariant.

| Story prop                                   | Figma surface                                            | Type              | Notes                                                                                                                                                                                                                                                       |
| -------------------------------------------- | -------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `selected: boolean`                          | `State=Selected` variant                                 | VARIANT           | The `Mui-selected` runtime class. Figma promotes this to a discrete `State` value rather than a boolean property so designers can pick it from the same dropdown as Default / Hover / Active / Disabled.                                                    |
| `disabled: boolean`                          | `State=Disabled` variant                                 | VARIANT           | The `Mui-disabled` runtime class. Same rationale as Selected.                                                                                                                                                                                                |
| `className='Mui-focusVisible'` _(StateMatrix's Hover row stand-in)_ | _(no direct Figma surface)_                  | —                 | The story uses `Mui-focusVisible` as a static stand-in for `:hover`, but it actually renders the runtime focus paint (12 % black). The Figma `State=Hover` cell binds to the **4 % black** `:hover` paint instead — see §6.3 / §7.                          |
| `label: string`                              | `Label` TEXT component property                          | TEXT              | Default `List Item`. Drives the primary `<ListItemText>` line.                                                                                                                                                                                              |
| `secondary?: string` _(undefined when omitted)_ | `Secondary` TEXT + `Show Secondary` BOOLEAN          | TEXT + BOOLEAN    | Default `Secondary` text; `Show Secondary` BOOLEAN toggles the second line on / off. When the BOOLEAN is `false`, the cell collapses from `64 → 44 px` height (see `storybook.render.md` §3).                                                                |
| `leadingIcon: boolean`                       | `Leading Icon` BOOLEAN                                    | BOOLEAN           | Default `true`. Toggles the `<ListItemAvatar>` slot. The slot is a `<Icon>` instance (`3:2722`) `Size=md` (24 × 24), `Glyph Source` preset to `Person` (default; designers swap via the nested-property panel — see §6.6).                                  |
| `trailingIcon: boolean`                      | `Trailing Icon` BOOLEAN                                   | BOOLEAN           | Default `true`. Toggles the `<ListItemIcon>` slot. The slot is a `<Icon>` instance (`3:2722`) `Size=md` (24 × 24), `Glyph Source` preset to `ChevronRight` (`512:7509`).                                                                                     |
| `nested: boolean`                            | `Nested` BOOLEAN                                          | BOOLEAN           | Default `false`. When `true`, padding-left jumps from `8 → 40 px` (`8 outer + 24 avatar slot + 8 gap`) so child labels align under parent labels. Trailing icon is conventionally hidden on nested children — designers must also flip `Trailing Icon = false` when setting `Nested = true`. |
| `onClick: (e) => void`                       | —                                                         | —                 | Behavior-only, no design representation.                                                                                                                                                                                                                    |
| `sx={{ pl, pr, py, borderRadius, gap, … }}`  | Hard-coded Figma layout invariants (see §4)               | —                 | The story bakes `pl: 8px` / `pl: 40px` (nested), `pr: 8px`, `py: 8px`, `borderRadius: 4px`, `gap: 8px`. These are not exposed as Figma variant axes — they are invariants of the Merak design.                                                              |

### 2.2 Wrapper props (`<NavMenu>`)

| Story prop                       | Figma surface                          | Type                  | Notes                                                                                                                                              |
| -------------------------------- | -------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isOpen: boolean`                | `IsOpen` variant                       | VARIANT               | Drives the Collapse container's `in` prop. `IsOpen=False` hides the children (height 0); `IsOpen=True` reveals the 4-child stack (height 176 px). |
| `header: string`                 | nested header instance's `Label` TEXT  | nested override       | Default `List Item`. The wrapper does not expose a top-level `Header Label` property — designers click into the nested header instance to edit `Label`. Mirrors the Pagination pattern. |
| `headerSecondary?: string`       | nested header instance's `Secondary` TEXT + `Show Secondary` BOOLEAN | nested override | Default `Secondary`. Same nested-instance editing model as `header`.                                                                                |
| `disabled: boolean`              | _(no wrapper-level surface today)_     | —                     | Tracked in §7 issue 4 as a future enhancement. Currently designers compose `IsOpen=False` + a header instance with `State=Disabled` to mock a disabled nav block.                  |
| `onToggle: () => void`           | —                                      | —                     | Behavior-only, no design representation.                                                                                                           |
| `children: ReactNode`            | 4 nested NavMenuItem instances pre-wired inside the Collapse container (only when `IsOpen=True`) | —     | The IsOpen=True variant bakes 4 child rows (one Selected) so a full menu reads consistently when dropped onto a screen — same pattern as `<Pagination>` baking 9 PaginationItem instances. |

## 3. Variant Property Matrix

### 3.1 `<NavMenuItem>` (item set)

```
State = 5 variants
```

| Property | Default value | Options                                                  |
| -------- | ------------- | -------------------------------------------------------- |
| `State`  | `Default`     | `Default`, `Hover`, `Active`, `Selected`, `Disabled`     |

`Hover` and `Active` are not statically renderable in MUI runtime (`:hover` and `:active` are pseudo-classes with no inline class equivalent on `<ListItemButton>`). The Figma cells exist so designers can mock the visual states; the story matrix uses `Mui-focusVisible` as a stand-in for Hover and leaves Active visually identical to Default (no static paint at runtime — see §6.3).

### 3.2 Component (non-variant) properties on the item

| Property key      | Type     | Default         | Purpose                                                                                                                                |
| ----------------- | -------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `Label`           | TEXT     | `List Item`     | Primary text (`<ListItemText primary>`).                                                                                                |
| `Secondary`       | TEXT     | `Secondary`     | Secondary text (`<ListItemText secondary>`). Hidden when `Show Secondary = false`.                                                       |
| `Show Secondary`  | BOOLEAN  | `true`          | Toggles the secondary text line. Cell height collapses from `64 → 44 px` when `false`.                                                  |
| `Leading Icon`    | BOOLEAN  | `true`          | Toggles the `<ListItemAvatar>` slot (24 × 24 `<Icon> Size=md`).                                                                          |
| `Trailing Icon`   | BOOLEAN  | `true`          | Toggles the `<ListItemIcon>` slot (24 × 24 `<Icon> Size=md`).                                                                            |
| `Nested`          | BOOLEAN  | `false`         | Indents `padding-left` from `8 → 40 px`. Designers should also set `Trailing Icon = false` when `Nested = true` (matches reference `<Navbar>` rows). |

### 3.3 `<NavMenu>` wrapper set

```
IsOpen = 2 variants
```

| Property | Default value | Options              |
| -------- | ------------- | -------------------- |
| `IsOpen` | `False`       | `False`, `True`      |

### 3.4 Component (non-variant) properties on the wrapper

The wrapper currently exposes **none**. To document a scenario, a designer either:

1. Edits the nested header / child instances' `Label` and `Secondary` text directly via Figma's nested-property panel, or
2. Detaches the wrapper for a one-off composition (acceptable for screen demos; do not check detached wrappers back into the library).

This mirrors the Pagination pattern (`<Pagination>` `1:5675` § 3.4) — the wrapper is a static composition, and nested instances carry the per-cell text. A future iteration could surface top-level `Header Label` / `Header Secondary` TEXT properties via instance-property propagation, but that is a §8 sync trigger, not a current axis.

## 4. Layout & Sizing

### 4.1 NavMenuItem geometry (per `Nested` × `Show Secondary` combination)

| `Nested` | `Show Secondary` | outer (W × H)   | padding (T R B L)   | gap                                  |
| -------- | ---------------- | --------------- | ------------------- | ------------------------------------ |
| `false`  | `true`           | `auto × 64 px`  | `8 8 8 8`           | `8 px` (between leading / label / trailing) |
| `false`  | `false`          | `auto × 44 px`  | `8 8 8 8`           | `8 px`                               |
| `true`   | `false` _(typical)_ | `auto × 44 px` | `8 8 8 40`          | `8 px`                               |
| `true`   | `true` _(rare)_  | `auto × 64 px`  | `8 8 8 40`          | `8 px`                               |

> Width is driven by the consuming `<List>` (or wrapper) — the runtime story renders at `280 px` outer; the Figma component set authors `Hug content` width so a single instance can stretch from 240 to 360 px without re-authoring.

### 4.2 NavMenu wrapper geometry

| `IsOpen` | outer (W × H)        | header height | collapse height                         |
| -------- | -------------------- | ------------- | --------------------------------------- |
| `False`  | `auto × 64 px`       | `64 px`       | `0 px` (children removed from layout)   |
| `True`   | `auto × 240 px` _(with 4 nested children at 44 px each)_ | `64 px` | `176 px` (= 4 × 44)         |

> The IsOpen=True variant bakes `4` nested child instances. Authors needing more or fewer children detach the wrapper for a one-off composition.

### 4.3 Auto Layout invariants

- **NavMenuItem**: Auto Layout `direction: HORIZONTAL`, `primaryAxisAlign: MIN`, `counterAxisAlign: CENTER`, `padding: 8 8 8 8` (or `8 8 8 40` when `Nested=true`), `gap: 8`.
- **NavMenuItem label block** (between leading and trailing): Auto Layout `direction: VERTICAL`, `padding: 0`, `gap: 0` (the secondary text's own line-height handles the visual offset), `primaryAxisSizingMode: AUTO`, `layoutGrow: 1` (takes remaining horizontal space).
- **NavMenu wrapper**: Auto Layout `direction: VERTICAL`, `padding: 0`, `gap: 0`, `primaryAxisSizingMode: AUTO`. Children stack flush — no inter-row gap.

## 5. Token Glossary

Token names below are **Figma variable paths** in the local `merak` collection — see [`.claude/skills/figma-create-component/library-tokens.md`](../../figma-create-component/library-tokens.md). Bind every Figma paint / stroke to one of these — never to a literal hex. NavMenu does not mint any component-scoped tokens; the existing alias / seed family covers every paint it needs.

### 5.1 Alias tokens (`alias/colors/*`)

| Token                                | Used by                                                                          | Role                                                                                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `alias/colors/bg-default`            | NavMenuItem background, `State ∈ {Default, Active, Disabled}`                    | Transparent / surface paint behind the row.                                                                                             |
| `alias/colors/bg-outline-hover`      | NavMenuItem background, `State=Hover`                                             | 4 %-α black overlay matching MUI runtime `palette.action.hover`.                                                                         |
| `alias/colors/bg-filled-hover`       | NavMenuItem background, `State=Active` _(design-only — MUI emits no static `:active` paint)_ | 12 %-α black overlay so designers can mock a "pressed" snapshot. See §6.3 note.                                                |
| `alias/colors/bg-selected`           | _(reserved)_ — not used today (Selected is themed primary — see §5.2)            | 8 %-α black. Kept here for parity with Pagination / IconButton; an unthemed Selected would bind here.                                    |
| `alias/colors/text-default`          | NavMenuItem primary label, every State                                            | 87 %-α black (`palette.text.primary`). MUI does **not** theme the label on Selected, so the same token serves all 5 cells.              |
| `alias/colors/text-sub`              | NavMenuItem secondary label, every State                                          | 60 %-α black (`palette.text.secondary`).                                                                                                 |
| `alias/colors/text-disabled`         | _(reserved)_ — not used today                                                     | 38 %-α black. The Disabled state is rendered via `opacity: 0.38` on the entire Auto Layout (matches MUI runtime), not via a per-fill token swap. |
| `alias/colors/bg-active`             | _(reserved)_ — not used today                                                     | 54 %-α black (`palette.action.active`). Could drive the leading-avatar / trailing-icon glyph fills if the design ever wants higher-contrast glyphs. |

### 5.2 Seed tokens (`seed/<C>/*`)

Only `seed/primary/*` is consumed today — the Selected paint is themed implicitly by MUI's `<ListItemButton>`.

| Token                        | Used by                                                                                                | Role                                                                                                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `seed/primary/main`          | _(reserved)_ — referenced as the source of the Selected paint, but the cell binds to the resolved 8 %-α composite below |                                                                                                                                                                                                       |
| `seed/primary/selected`      | _(reserved)_ — does not match the runtime 8 %-α value (`#42A5F5` solid, vs. `#1976D214` resolved)                                       | Documented divergence: the shared `seed/primary/selected` token aliases `palette.primary.light` (`#42A5F5`), not the 8 %-α `palette.primary.main` overlay MUI actually paints. Do **not** bind here. |
| `seed/primary/hover-bg`      | _(considered, not used)_ — 4 %-α tint of `#1976D2`. Stacking two layers tops out at ~7.84 %.            | If the design ever needs a "more saturated" Selected highlight, layering two `seed/primary/hover-bg` fills mimics the 8 % composite without minting a component-scoped token.                          |

> **The Selected paint is currently bound to a literal 8 %-α primary value because there is no shared token at that exact alpha.** See §6.4 / §7 issue 1 for the resolution path. NavMenu deliberately does not mint a component-scoped token here — the value is reused from MUI's standard `selectedOpacity = 0.08`, and a future shared `seed/primary/selected-bg @ α=0.08` would unify Pagination / NavMenu / Chip selected states in one place.

### 5.3 Component-scoped tokens

Defined in [`./design-token.md`](./design-token.md). One 8 %-α primary token minted in the local `merak` collection so the NavMenuItem `State=Selected` cell can match MUI's runtime `alpha(palette.primary.main, 0.08)`:

| Token                              | Used by                                                          |
| ---------------------------------- | ---------------------------------------------------------------- |
| `component/navmenu/selected-bg`    | `<NavMenuItem>` `State=Selected` fill (top-level + nested rows) |

The shared `alias/colors/bg-selected` is 8 %-α **black** (wrong hue), `seed/primary/selected` is solid `palette.primary.light` (wrong alpha), and `seed/primary/hover-bg` is 4 %-α (stacking falls short of 8 %). Hence one component-scoped local. If `Color` is later added as a NavMenu axis (§8 sync trigger), this token expands into `component/navmenu/selected-bg-{primary,danger,warning,info,success}` mirroring Pagination's pattern. See [`./design-token.md`](./design-token.md) for the full rationale.

### 5.4 Shape & elevation

- **Corner radius**: `4 px` (`theme.shape.borderRadius`), all four corners of every NavMenuItem cell, all states.
- **Border**: none. `<ListItemButton>` is borderless; selection / hover paint goes on the background.
- **Elevation**: not used. NavMenu sits flush on the surrounding surface (drawer, side-panel, dialog).
- **Item spacing (Auto Layout gap)**: `0 px` between rows in the wrapper; `8 px` between leading / label / trailing inside a row.

### 5.5 Typography

`MerakNavMenuItem` does not override MUI typography (and no project-level `MuiListItemButton` / `MuiListItemText` override exists). Resolved values:

- **Primary label**: `material-design/typography/body2` — Roboto Regular, 14 px, line-height 20 px, `letter-spacing: 0.13132 px` (~`0.01em`), no `text-transform`. Apply via `textStyleId`.
- **Secondary label**: Roboto Regular, 12 px, line-height 16 px, color `alias/colors/text-sub`. Closest catalogue style is `material-design/typography/caption` (Noto Sans TC Regular 12 / 20) — **but** the line-height does not match (16 vs 20). Until a `material-design/typography/list-item-secondary` style is minted, author the secondary text with `fontName: Roboto Regular, fontSize: 12, lineHeight: { value: 16, unit: 'PIXELS' }` and bind the fill to `alias/colors/text-sub`. Tracked in §8.

If the project later introduces dedicated typography tokens (`material-design/typography/list-item-primary` / `list-item-secondary`), bind via `textStyleId` and update §6.1 + §5.5 to point at them.

## 6. Render Bindings

The cell-by-cell paint / stroke / effect bindings for every variant.

### 6.1 Constants (all NavMenuItem cells)

Numbers below are the **Figma-authored values** — runtime-aligned per `storybook.render.md` §1.

| Property                            | Value                                                                                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Outer height (`Show Secondary=true`) | `64 px`                                                                                                                                       |
| Outer height (`Show Secondary=false`) | `44 px`                                                                                                                                       |
| Padding (T R B L)                   | `8 8 8 8` (or `8 8 8 40` when `Nested=true`)                                                                                                   |
| Gap (between leading / label / trailing) | `8 px`                                                                                                                                     |
| Corner radius                       | `4 px`                                                                                                                                          |
| Border                              | none                                                                                                                                            |
| Box-shadow                          | none                                                                                                                                            |
| Leading slot                        | `<Icon>` (`3:2722`) `Size=md` instance (24 × 24); `Glyph Source` `INSTANCE_SWAP` preset to `Person` (default; designers swap per nav entry) — see §6.6 |
| Trailing slot                       | `<Icon>` (`3:2722`) `Size=md` instance (24 × 24); `Glyph Source` `INSTANCE_SWAP` preset to `ChevronRight` (`512:7509`)                          |
| Primary label                       | Roboto Regular, 14 px, line-height 20 px, fill bound to `alias/colors/text-default`                                                             |
| Secondary label                     | Roboto Regular, 12 px, line-height 16 px, fill bound to `alias/colors/text-sub`                                                                 |

### 6.2 Constants (NavMenu wrapper)

| Property                           | Value                                                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Outer Auto Layout                  | `direction: VERTICAL`, `padding: 0`, `gap: 0`, `primaryAxisSizingMode: AUTO`                                   |
| Header NavMenuItem instance        | `Nested=false`, `Show Secondary=true`, `Leading Icon=true`, `Trailing Icon=true`, `State=Default` (designers can override the nested instance's State per scenario) |
| Collapse container                 | Present only on the `IsOpen=True` variant — a vertical Auto Layout child of the wrapper, holding the 4 nested item instances. The `IsOpen=False` variant has just the header (no Collapse container at all). Height = sum of nested child heights (`4 × 44 = 176 px` baked) |
| Nested children (`IsOpen=True`)    | 4 NavMenuItem instances, each `Nested=true`, `Show Secondary=false`, `Leading Icon=true`, `Trailing Icon=false`. Default labels `Item 1` / `Item 2` / `Item 3` / `Item 4` with `Item 3` set to `State=Selected` (mirrors the reference `<Navbar>` 765:12320 selected row). |

### 6.3 NavMenuItem — `State` axis

| State      | Background (fill)                                       | Foreground (label fill)              | Glyph fill (leading / trailing)         | Effect / opacity                                   |
| ---------- | ------------------------------------------------------- | ------------------------------------ | --------------------------------------- | -------------------------------------------------- |
| `Default`  | `alias/colors/bg-default` (transparent)                 | `alias/colors/text-default` (primary), `alias/colors/text-sub` (secondary) | inherits label fill (24 × 24 Icon instance with default Vector binds) | none / `1`                                         |
| `Hover`    | `alias/colors/bg-outline-hover` (4 %-α black) ¹         | _(same as Default)_                  | _(same as Default)_                     | none / `1`                                         |
| `Active`   | `alias/colors/bg-filled-hover` (12 %-α black) ²         | _(same as Default)_                  | _(same as Default)_                     | none / `1`                                         |
| `Selected` | `component/navmenu/selected-bg` (resolves to `rgba(25, 118, 210, 0.08)` — `alpha(seed/primary/main, 0.08)`) ³ | _(same as Default)_           | _(same as Default)_                     | none / `1`                                         |
| `Disabled` | `alias/colors/bg-default` (transparent)                 | _(same as Default — paint unchanged)_ | _(same as Default — paint unchanged)_  | none / `0.38` on the entire Auto Layout ⁴          |

¹ **Hover binds to 4 %-α**, matching MUI runtime `palette.action.hover`. The StateMatrix story renders the Hover row with `Mui-focusVisible` as a static stand-in, which paints **12 %-α** (`palette.action.focus`) — that is a different runtime value, not the one Figma must reproduce. See §7 issue 2.

² **Active is design-only**. MUI runtime emits a Touch Ripple on `:active`; there is no static `:active` background paint. The Figma cell deliberately bakes a 12 %-α black overlay so designers can mock a "pressed" snapshot — the `bg-filled-hover` token (which is `palette.action.focus`) is reused because no shared `palette.action.active-bg` token exists. Documented runtime-divergent design decision; tracked in §7 issue 3.

³ **Selected is themed implicitly via primary 8 %-α**. MUI runtime computes `theme.alpha(palette.primary.main, palette.action.selectedOpacity = 0.08)` inside `ListItemButton.js`. The shared `merak` family does **not** ship a token at this exact alpha + hue, so the Figma cell binds to the locally minted `component/navmenu/selected-bg` token (resolved value `#1976D214` — see [`./design-token.md`](./design-token.md)). **Do not bind to `seed/primary/selected`** — that token aliases `palette.primary.light` (`#42A5F5`), a fully solid color. Promoting `component/navmenu/selected-bg` to a shared `seed/primary/selected-bg @ α=0.08` token is the long-term path; tracked in §7 issue 1.

⁴ **Disabled is rendered via wrapper opacity**, not per-fill token swaps. MUI's `<ListItemButton>` runtime applies `opacity: palette.action.disabledOpacity = 0.38` on the root element. Figma reproduces this by setting `opacity = 0.38` on the entire Auto Layout cell — the label / glyph / background fills retain their normal token bindings. This matches the runtime behavior exactly (the cell fades uniformly) and avoids the per-cell paint rebind that Disabled requires for outlined components like Pagination.

### 6.4 NavMenu wrapper — `IsOpen` axis

| `IsOpen` | Header                              | Collapse container                | Nested children                      | Total height                                        |
| -------- | ----------------------------------- | --------------------------------- | ------------------------------------ | --------------------------------------------------- |
| `False`  | NavMenuItem instance, `State=Default` | Hidden — height 0                | _(hidden)_                           | `64 px`                                             |
| `True`   | _(same)_                              | Visible — height 176 px           | 4 nested NavMenuItem instances, child #3 `State=Selected` | `240 px` (`64 + 176`)                              |

> **Chevron rotation is not part of the wrapper variant.** The reference `<Navbar>` (765:12320) shows the trailing chevron pointing right in both isOpen states; runtime matches. If a future redesign rotates the chevron 90° on expand, that becomes a §8 sync trigger requiring both Figma and a story-side `transform: rotate(90deg)`.

### 6.5 Layout slots (NavMenuItem internal Auto Layout)

```
[ Leading slot (24×24, optional) ]  [ Label block (vertical, layoutGrow=1) ]  [ Trailing slot (24×24, optional) ]
                                  ↑ gap: 8 px              ↑ gap: 8 px
```

- The label block is itself a vertical Auto Layout containing the primary `<ListItemText primary>` line and the optional secondary `<ListItemText secondary>` line. It uses `layoutGrow: 1` so it absorbs the remaining horizontal space — slot widths are fixed at 24 px each.
- When `Show Secondary = false`, the label block collapses to a single text node and the cell height drops from 64 → 44 px.
- When `Leading Icon = false`, the leading slot is removed entirely (the label block slides left, picking up the freed 32 px).
- When `Trailing Icon = false`, the trailing slot is removed entirely (the label block extends right).

### 6.6 Glyph treatment (leading + trailing slots)

Both slots render an **INSTANCE** of the shared `<Icon>` set (`3:2722`) at `Size=md` (which the design-guide publishes at `24 × 24 px`). The `Glyph Source` `INSTANCE_SWAP` property is preset per slot:

| Slot          | Default glyph                                      | Notes                                                                                                     |
| ------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Leading       | `Person` (or another nav-domain glyph — designers swap per entry via the nested-property panel) | The reference `<ListItem>` (765:12320) used a circular avatar with a person glyph; we mirror that as the default. |
| Trailing      | `ChevronRight` (`512:7509`)                        | Mirrors the reference `<ListItem>` trailing chevron. Hidden on nested children (set `Trailing Icon = false`). |

> **Why one shared `<Icon>` set, not dedicated NavMenu icon sets.** Same rationale as Pagination's 2026-04-29 unification pass — one shared icon library is structurally simpler than per-component icon sets, and `Glyph Source` lets designers swap icons without detaching. See `figma.spec.md` (Pagination) §6.7.

> **Vector fill binding.** The `<Icon> Size=md` instance's vector fill is bound to `alias/colors/text-default` by default (matches the surrounding label color via `currentColor` inheritance). For Disabled cells, the wrapper `opacity = 0.38` fades the icon along with the label — no per-cell vector rebind needed.

## 7. Open issues

### Currently open

1. **Selected paint binds to a component-scoped `component/navmenu/selected-bg` (8 %-α primary) instead of a shared token.** No `seed/primary/selected-bg @ α=0.08` exists in the catalogue today. The component-scoped path mirrors Pagination's `component/pagination/selected-bg-*` family. The long-term unification is to promote a shared `seed/primary/selected-bg @ α=0.08` and rebind Pagination's Default-color Selected (currently `alias/colors/bg-selected` 8 %-α **black**) + every other component that wants a themed Selected. Tracked here so the next design-system audit can collapse the divergence.
2. **`State=Hover` Figma cell vs. `Mui-focusVisible` story stand-in (4 % vs 12 %).** The Figma cell binds to `alias/colors/bg-outline-hover` (4 %-α black, matching MUI runtime `palette.action.hover`). The StateMatrix story renders the Hover row with the `Mui-focusVisible` className, which actually paints 12 %-α (`palette.action.focus`). Reviewers comparing the rendered Storybook screenshot to the Figma cell will see a brightness difference — this is **expected** and documented in `storybook.render.md` §2 / §5. If Merak ever ships a separate `State=Focused` variant, that one would bind to `alias/colors/bg-focus` (12 %-α). Adding it costs `5 → 6` item variants.
3. **`State=Active` is design-only.** MUI runtime emits a Touch Ripple, not a static paint. The Figma cell bakes `alias/colors/bg-filled-hover` (12 %-α black) so the visual state is mockable. Documented divergence — `storybook.render.md` §2 / §5.
4. **Wrapper-level `Disabled` is not exposed.** Designers needing a fully disabled NavMenu compose `IsOpen=False` + a header instance with `State=Disabled` by hand. Adding a wrapper `State=Disabled` axis would propagate `opacity: 0.38` to the entire wrapper (including the Collapse container) and cost `2 → 4` wrapper variants.
5. **Secondary-text typography lacks a dedicated text style.** The runtime uses Roboto Regular 12 / 16 px; the closest catalogue style (`material-design/typography/caption`) is Noto Sans TC Regular 12 / **20** px. Until a `material-design/typography/list-item-secondary` style is minted, the secondary text node is authored with hand-set font properties bound to `alias/colors/text-sub`. Tracked in §8 below.
6. **Chevron rotation on expand is not represented.** The runtime does not rotate the trailing chevron when `IsOpen=True` (matches reference `<Navbar>` 765:12320). If a future redesign adds rotation, that's a §8 trigger.

## 8. Source Sync Rule

This document and the source must move together. When **any** of the following changes, update this spec **and** the named files in the same PR:

| Trigger                                                                                                                              | Files to update                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node_modules/@mui/material/ListItemButton/ListItemButton.js` or `…/Collapse/Collapse.js` changes (MUI bump)                          | `figma.spec.md` §1 MUI version row, `storybook.render.md` §1–§4                                                                                                            |
| `src/stories/NavMenu.stories.tsx` `MerakNavMenuItem` `sx` changes (e.g. `pl: 8 → 12`, `borderRadius: 4 → 6`)                            | `figma.spec.md` §4 / §6.1, `storybook.render.md` §1                                                                                                                         |
| `src/stories/NavMenu.stories.tsx` `MerakNavMenu` baked nested-child count changes (currently 4)                                        | `figma.spec.md` §3.4 / §4.2 / §6.2 / §6.4, `storybook.render.md` §4                                                                                                          |
| `src/stories/NavMenu.stories.tsx` adds a Color axis (e.g. story-side `sx` for Selected bg per Merak color)                             | `figma.spec.md` §1 (variant axis count), §3.1 (add `Color` to options), §6.3 (add per-color rows), `storybook.render.md` §3 (add Color axis section). Mint per-color `component/navmenu/selected-bg-<c>` tokens in `design-token.md` (new file). |
| `src/stories/NavMenu.stories.tsx` adds a `State=Focused` axis                                                                         | `figma.spec.md` §3.1 (add `Focused`), §6.3 (add row binding to `alias/colors/bg-focus`), `storybook.render.md` §2 (add column)                                              |
| Figma item set variant axes / cell count change                                                                                       | `figma.spec.md` §3.1, refresh `figma.config.json` via `figma-init/config-init.md`                                                                                            |
| Figma wrapper set variant axes / cell count or composition change                                                                     | `figma.spec.md` §3.3, §6.4, refresh `figma.config.json` via `figma-init/config-init.md`                                                                                      |
| Local `merak/*` tokens used by NavMenu are renamed in this Figma file                                                                | `figma.spec.md` §5 + §6. **Do not** auto-pull from the published library — the NavMenu cells bind to the local collection only.                                              |
| Published library `seed/*` / `alias/*` tokens drift from the local copies                                                            | Track divergence in `figma.spec.md` §1 local-only note. Re-sync values manually if needed.                                                                                  |
| `<Icon>` set (`3:2722`) variant axes change (e.g. `Size=md` renamed) or its `Glyph Source` `INSTANCE_SWAP` property is renamed       | `figma.spec.md` §6.1 / §6.6 icon mapping (Size=md ID + property name `Glyph Source`)                                                                                        |
| `ChevronRight` (`512:7509`) glyph component is renamed, moved, or replaced in the Icon library                                       | `figma.spec.md` §6.6 (Glyph Source preset IDs), `../../figma-create-component/library-components.md` §Icon library                                                                       |
| `mui-theme.ts` adds a `MuiListItemButton` / `MuiListItemText` / `MuiList` override (this project has none today)                     | `figma.spec.md` §1, `storybook.render.md` §1–§4                                                                                                                            |
| A `material-design/typography/list-item-secondary` text style is minted in the design-guide                                          | `figma.spec.md` §5.5 / §6.1 (rebind secondary text to the new `textStyleId`), `../../figma-create-component/library-tokens.md`                                                     |
| A shared `seed/primary/selected-bg @ α=0.08` token is minted (resolves §7 issue 1)                                                   | `figma.spec.md` §5.2 / §5.3 / §6.3 (rebind Selected fill from `component/navmenu/selected-bg` to the new shared token); `./design-token.md` (delete the promoted token, point at new shared family); `../../figma-create-component/library-tokens.md` |

## 9. Quick Reference

```ts
// Story prop surface (src/stories/NavMenu.stories.tsx :: MerakNavMenuItem)
interface MerakNavMenuItemProps extends Omit<ListItemButtonProps, 'children'> {
  label?: string;          // → Figma `Label` TEXT
  secondary?: string;      // → Figma `Secondary` TEXT (+ `Show Secondary` BOOLEAN flips on/off)
  leadingIcon?: boolean;   // → Figma `Leading Icon` BOOLEAN
  trailingIcon?: boolean;  // → Figma `Trailing Icon` BOOLEAN
  nested?: boolean;        // → Figma `Nested` BOOLEAN
  selected?: boolean;      // → Figma `State=Selected`
  disabled?: boolean;      // → Figma `State=Disabled`
  className?: 'Mui-focusVisible'; // story stand-in for hover; not a Figma surface
}

// Story prop surface (src/stories/NavMenu.stories.tsx :: MerakNavMenu)
interface MerakNavMenuProps {
  header: string;            // → nested header instance's `Label` TEXT (no wrapper-level prop)
  headerSecondary?: string;  // → nested header instance's `Secondary` TEXT + `Show Secondary` BOOLEAN
  isOpen?: boolean;          // → Figma `IsOpen` variant
  onToggle?: () => void;     // behavior-only
  disabled?: boolean;        // not yet a Figma surface — see §7 issue 4
  children?: ReactNode;      // baked as 4 nested NavMenuItem instances on IsOpen=True only
}
```

```
Figma Item Component Set: <NavMenuItem> (790:11848)
  Variant axes : State
  Properties   : Label (TEXT), Secondary (TEXT), Show Secondary (BOOLEAN),
                 Leading Icon (BOOLEAN), Trailing Icon (BOOLEAN), Nested (BOOLEAN)
  Default      : State=Default
  Total        : 5 variants

Figma Wrapper Component Set: <NavMenu> (793:11949)
  Variant axes : IsOpen
  Properties   : (none at wrapper level — designers click into nested instances
                 to edit text, mirroring the Pagination pattern)
  Default      : IsOpen=False
  Total        : 2 variants
  Composition  : IsOpen=False — 1 header NavMenuItem instance (default state).
                 IsOpen=True — 1 header + 1 vertical Collapse container with 4
                 nested NavMenuItem instances (Show Secondary=false, Trailing
                 Icon=false, Nested=true, child #3 State=Selected).
```

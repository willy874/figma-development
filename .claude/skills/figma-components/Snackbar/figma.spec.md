---
name: figma-component-snackbar-spec
description: Figma component specification for `<Snackbar>` — design counterpart of the MUI `<Snackbar>` consumed by `src/stories/Snackbar.stories.tsx`. Documents the variant matrix (Variant × Action = 5 × 3 = 15), the `Message` / `Action Label` TEXT properties, the dual-content model (Default → SnackbarContent grey body, Severity → Alert filled body), source-to-Figma mapping, layout / token bindings, and the divergences from MUI runtime (anchorOrigin not modeled, AlertTitle not modeled, Roboto over Noto Sans TC, MUI primary blue for Default-variant action). For runtime measurements see `storybook.render.md`; component-scoped tokens are documented in `design-token.md`.
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '846:11794'
figma_component_set_id: '860:11925'
figma_severity_icon_set_id: '855:11806'
---

# `<Snackbar>` Figma Component Specification

## 1. Overview

`<Snackbar>` is the Figma counterpart of the MUI `<Snackbar>` consumed in `src/stories/Snackbar.stories.tsx`. The package re-exports MUI Snackbar directly — there is no wrapper — so the Figma component encodes the visible content patterns, not the screen-level positioning wrapper. MUI Snackbar is structurally a `position: fixed` lifecycle wrapper that renders one of two content shapes:

- **Default Variant** → MUI `<SnackbarContent>` — grey emphasized surface (`emphasize(background.default, 0.8) = #323232`) with white text and Paper elevation 6. The canonical "neutral notification" appearance.
- **Severity Variants (Success / Info / Warning / Error)** → MUI `<Alert variant="filled">` rendered inside the Snackbar. Saturated colored bg with white foreground, leading severity icon at 90 % α, and (optionally) a trailing action / close icon. This is the "status feedback" appearance used by every MUI Snackbar example in the official docs.

The Figma component therefore models 5 × 3 = 15 variants — 5 Variants × 3 Action modes (`None`, `Button` for text-style actions like UNDO, `Close` for the X icon-button). The screen-level `anchorOrigin` axis is **not** part of the variant matrix because it has no body delta (only changes the wrapper's `top / bottom / left / right` offsets) — see §7 #2.

The editable Figma node `846:11794` on the **Foundation Components** page was an empty white frame at the start of this pipeline; the **first published version** of the COMPONENT_SET (`860:11925`) plus the sibling `<SnackbarSeverityIcon>` set (`855:11806`) now live inside it (the frame currently measures 1293 × 1299 — sized to fit both sets side-by-side). Frontmatter `figma_node_id` pins the parent frame; `figma_component_set_id` pins the published Snackbar set; `figma_severity_icon_set_id` pins the severity-icon set.

**Runtime-aligned reconciliation — 2026-05-08.** The published cells were re-validated against `storybook.render.md` on 2026-05-08 and four Figma-side drifts were corrected: (a) all 12 Severity cells' root `counterAxisAlignItems` was switched from `CENTER` to `MIN` so the icon, message, and action slots top-align like MUI's `<Alert align-items: flex-start>` (was previously vertically-centering against the message); (b) the 4 vectors inside `<SnackbarSeverityIcon>` had their paint-level `opacity: 0.902` cleared to `1` so the bound `component/snackbar/alert-icon-fg` token (already 0.9 α) is the sole α source — pre-fix the icons were doubly attenuated to ≈0.81 α; (c) the `Variant=Default, Action=Button` cell's `Action Label` TEXT was rebound from `seed/neutral/white` to `seed/primary/main` per §6.4.1; (d) cell padding was reverted from `14/16` back to MUI's `6/16` and the message wrapper's `8 0` padding was relocated to a new `Message Container` Auto Layout VERTICAL frame that wraps the `Message Slot` (the inner SLOT keeps `padding: 0` per `figma-operator-guide` component-rules.md §4). The previous "absorb 8/0 into the cell" encoding inflated every Severity and Default×Action≠None cell by 11–16 px because the message column's missing 8/0 stopped contributing to the row's max height; the wrapper restores the 36 px message column so all 15 cells now resolve to 48 px tall, matching MUI runtime exactly. No variant axes, property surface, axis names, defaults, or token bindings changed.

| Aspect              | Value                                                                                |
| ------------------- | ------------------------------------------------------------------------------------ |
| Source story        | `src/stories/Snackbar.stories.tsx`                                                   |
| Underlying source   | `@mui/material` `Snackbar` + `SnackbarContent` + `Alert` (re-exported by this package) |
| Underlying MUI      | `@mui/material` 7.3.10 (resolved from `package.json` on 2026-05-08)                  |
| Figma file          | `KQjP6W9Uw1PN0iipwQHyYn` (MUI-Library)                                               |
| Figma frame         | `Snackbar` (`846:11794`) — 1293 × 1299, page **Foundation Components**               |
| Component Set       | `<Snackbar>` (`860:11925`) — published 2026-05-08, 15 variants                       |
| Sibling set         | `<SnackbarSeverityIcon>` (`855:11806`) — 4 variants (Severity), 22 × 22 cells        |
| Total variants      | **15** (5 Variants × 3 Actions); plus 4 sibling severity-icon cells                  |
| Typography          | Roboto Regular 14 / 20 px (Message body, all 5 Variants — see §7 #7 for the Severity-Medium divergence resolution), Roboto Medium 13 / 22.75 px uppercase (Action Button label). Hand-set on TEXT nodes — the design system has no `material-design/components/snackbar` text style and the project's other MUI re-exports (Button / Tooltip / Chip) also hand-set Roboto for variant-label parity. See §7 #3 for the design-system divergence (Noto Sans TC vs Roboto). |
| Local-only bindings | **Required.** Every paint / stroke / effect / shadow resolves to a variable in this file's local collection. Two component-scoped tokens are minted (`component/snackbar/default-bg = #323232`, `component/snackbar/alert-icon-fg = #FFFFFFE6`) — see `.claude/skills/figma-components/Snackbar/design-token.md` for the resolution chain. No `VariableID:<sharedKey>/...` consumed-library bindings are permitted. |

## 2. Source-to-Figma Property Mapping

| MUI prop                | Figma property | Type    | Notes                                                                                                                |
| ----------------------- | -------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| `severity` (on inner `<Alert>`) + Variant=Default for SnackbarContent | `Variant` | VARIANT | `Default` (renders SnackbarContent grey body) / `Success` / `Info` / `Warning` / `Error` (renders `<Alert variant="filled" severity={...}>`). MUI default is the SnackbarContent path (no inner Alert). The Figma cell freezes the rendered content type per Variant value. |
| `action` slot kind      | `Action`       | VARIANT | `None` / `Button` / `Close`. `None` omits the trailing slot. `Button` renders a small text Button labeled by `Action Label`. `Close` renders a 28 × 28 IconButton with the MUI close glyph. MUI default is `None`. Modeled as a VARIANT (not BOOLEAN + INSTANCE_SWAP) because `Button` and `Close` have different inner geometry (text vs icon) and different action-slot vertical alignment for Alert (per `storybook.render.md` §3.4). |
| `message`               | `Message Slot` | SLOT    | Real Figma SLOT (`node.type === 'SLOT'`) registered once at the COMPONENT_SET level (canonical id `Message Slot#873:0`); all 15 variants reuse the same SLOT property via `slot.componentPropertyReferences.slotContentId`. The slot's default content is a Roboto Regular 14 / 20 TEXT (`This is a snackbar message`). Designers can drop **any** content into the slot — text, icon + text, AlertTitle + body, a custom rich-content component, etc. The SLOT itself follows `figma-operator-guide` component-rules.md §4 defaults (VERTICAL Auto Layout, HUG, gap 0, padding 0). |
| `action`'s Button label | `Action Label` | TEXT    | Default `UNDO`. Used only when `Action=Button`. Hand-set Roboto Medium 13 / 22.75 px, `letterSpacing: 0.02857em ≈ 0.37 px`, uppercase. |
| `anchorOrigin`          | —              | —       | Behavior-only (screen-level positioning). The Snackbar root (`position: fixed; top/bottom/left/right`) sits outside the published cell — designers compose the screen-level placement by hand on the consuming frame. See §7 #2. |
| `open`                  | —              | —       | Behavior-only. The Figma component represents the **open** state (closed has no visual). Stories pin `open={true}` for capture. |
| `autoHideDuration` / `resumeHideDuration` | — | —    | Behavior-only — the timing of `onClose` invocation. No design representation.                                        |
| `disableWindowBlurListener` | —          | —       | Behavior-only.                                                                                                       |
| `onClose` / `onBlur` / `onFocus` / `onMouseEnter` / `onMouseLeave` | — | — | Behavior-only.                                                                                                       |
| `ClickAwayListenerProps`, `ContentProps` (deprecated) → `slotProps.{clickAwayListener, content, root, transition}` | — | — | Behavior-only — designer-side overrides reach for instance overrides + Figma's `Detach` if needed; the published component does not pre-model these. |
| `TransitionComponent` (deprecated) → `slots.transition` | — | — | Defaults to `<Grow>`. The Figma cell freezes the open frame, not the Grow keyframes. |
| `transitionDuration` / `TransitionProps` | — | — | Animation-only.                                                                                                      |
| `key`                   | —              | —       | React reconciliation hint — no visual.                                                                               |
| `sx`, `classes`, `className` | —         | —       | Style override entry-points; not part of the variant surface.                                                         |
| `<AlertTitle>` (an inner `<Alert>` child)             | — | —       | When the consumer wraps the Alert message in `<AlertTitle>`, MUI renders a Roboto Medium 16 / 24 px heading above the body text. The Figma component does **not** model this — designers wanting an Alert with title detach the Severity cell and hand-add the title TEXT. See §7 #4. |

### 2.1 No anchorOrigin axis

`<Snackbar>` has no `Anchor Origin` axis on the published Figma component. The 6 `anchorOrigin` permutations (vertical: top / bottom × horizontal: left / center / right) only change the wrapper's `position: fixed` offsets — every cell would render the **identical** SnackbarContent / Alert body. Modeling Anchor as a VARIANT axis would multiply the matrix to 90 cells (15 × 6) for zero visual delta. If a future PR introduces an anchor-aware visual treatment (e.g. an arrow / pointer tying the Snackbar to a screen-level region), add an `Anchor Origin` axis here, refresh §3 / §6, and split per-anchor cells out.

`storybook.render.md` §1.1 documents the 6 anchorOrigin offset rules for screen-level layout, and the `AnchorOriginMatrix` story renders all 6 in a single illustrative frame so designers can verify positioning by hand.

### 2.2 No standard / outlined Alert variant axis

MUI Alert ships 3 visual variants — `standard` (default), `outlined`, `filled`. The Storybook story pins `variant="filled"` for every Severity cell because (a) the filled variant is the canonical Snackbar+Alert documented usage (high contrast against the page), (b) modeling all 3 Alert variants would multiply the matrix to 45 cells (15 × 3) and most cells would be redundant against the design-system's existing standalone Alert spec. If a future PR adds standalone `<Alert>` to this Figma library (without the Snackbar wrapper), put the standard / outlined axes there, not on Snackbar. See `storybook.render.md` §3.1 for the unmodeled `lighten` / `darken` resolutions.

## 3. Variant Property Matrix

```
Variant × Action   =   5 × 3   =   15 variants
```

| Property  | Default value (intent) | Default value (Figma actual) | Options                                          |
| --------- | ---------------------- | ---------------------------- | ------------------------------------------------ |
| `Variant` | `Default`              | `Default` ✓                  | `Default`, `Success`, `Info`, `Warning`, `Error` |
| `Action`  | `None`                 | `None` ✓                     | `None`, `Button`, `Close`                        |

**Intent column** documents MUI runtime defaults — `<Snackbar>` with no inner `<Alert>` and no `action` prop renders the bare SnackbarContent body. **Figma actual column** documents what Figma's `defaultVariant` resolves to in practice — and on this set both axes happen to default to the MUI-intent value: Figma resolved `Variant=Default` first (alphabetical order: `Default` < `Error` < `Info` < `Success` < `Warning`) and `Action=None` first (creation order — the very first variant the pipeline created was `Variant=Default, Action=None`, so it became Figma's default). No `Plugin API` workaround was needed. See §7 #5 for the (now-resolved) divergence note.

### 3.1 Component (non-variant) properties

| Property key   | Type | Default                          | Purpose                                                                                  |
| -------------- | ---- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| `Message Slot` | SLOT | Roboto Regular 14 / 20 TEXT child `This is a snackbar message`, fill bound to `seed/neutral/white` | Snackbar body content surface. **Single canonical SLOT property** registered at the SET level (id `Message Slot#873:0`); all 15 variants' inner SLOT nodes reuse it via `componentPropertyReferences.slotContentId` — designers see exactly one "Message Slot" control in the instance right panel. The slot is a pass-through container per `figma-operator-guide` component-rules.md §4: VERTICAL Auto Layout, HUG height, gap 0, padding 0. Consumers fill it with any content (default TEXT, an `<AlertTitle>` + body composition, custom rich content). |
| `Action Label` | TEXT | `UNDO`                           | Action button label. Hand-set Roboto Medium 13 / 22.75 px uppercase, `letterSpacing: 0.02857em`. Visible only when `Action=Button`. When `Action=None` or `Action=Close`, this property still exists on the COMPONENT_SET (axis economy — Figma doesn't support per-variant property visibility); designers ignore it for those cells. |

No `INSTANCE_SWAP` properties — the Severity icon and the Close icon are authored as nested INSTANCE references to the project's icon component sets (mounted from `<Icon>` for the close glyph; the 4 severity glyphs are minted as a dedicated `<SnackbarSeverityIcon>` set during step 5 because none of them currently exist in the published `<Icon>` set — see §6.5). The `Message Slot` above is a real Figma SLOT (not INSTANCE_SWAP) per the `figma-operator-guide` "Slot-first" rule. Future PRs may add `Icon` SLOT overrides if the design needs to re-skin the severity glyph per consumer.

No `BOOLEAN` properties — `Action` is a VARIANT, not a BOOLEAN, because `Button` and `Close` have structurally different inner geometry (per the §2 reasoning).

## 4. Usage Guidelines

### 4.1 Picking a variant

1. **Pick the Variant** that matches the source content shape:
   - `Default` — neutral grey notification (e.g. "Note archived"), the canonical MUI Snackbar appearance.
   - `Success` / `Info` / `Warning` / `Error` — status feedback with severity icon. Match the runtime `<Alert severity>` value.
2. **Pick the Action**:
   - `None` — message-only.
   - `Button` — text-style trailing CTA (e.g. "UNDO" / "DETAILS"). Override `Action Label` with the actual copy.
   - `Close` — trailing X close icon. Use when the Snackbar requires explicit dismissal (e.g. error states without auto-hide).
3. **Override `Message`** — type the actual notification copy.
4. (When `Action=Button`) Override `Action Label` — keep it short (≤ 12 chars) per MUI docs; longer labels wrap onto a second line and break the SnackbarContent's `min-width: 288 px` invariant.

### 4.2 When NOT to use

- ❌ Don't use Snackbar for permanent messaging — Snackbar is dismiss-on-action / dismiss-on-timer. Use `<Banner>` (n/a — not yet specced) or an inline `<Alert>` instead.
- ❌ Don't stack 3+ Snackbars at once — MUI fires one Snackbar per parent at a time. Multi-Snackbar queues are a runtime pattern (e.g. `notistack` or a custom queue manager) — the Figma cell does not pre-model the stacking.
- ❌ Don't use Snackbar for full-screen blocking errors — that's `<Dialog>` territory.
- ❌ Don't model the `position: fixed` wrapper inside the cell — the cell renders the SnackbarContent / Alert body only. Compose anchorOrigin offsets on the screen frame.

### 4.3 Don'ts

- ❌ Don't detach the Snackbar instance to change a fill — bind to a different token at the file level instead. Severity bg / fg map 1:1 to `seed/<severity>/main` and `seed/<severity>/on`; the Default-Variant bg uses `component/snackbar/default-bg`.
- ❌ Don't paint a Snackbar with raw hex values. Every paint must bind to a token from §5.
- ❌ Don't apply node-level `opacity < 1` on a Snackbar cell. The Severity icon's 90 % α is pre-baked into `component/snackbar/alert-icon-fg = #FFFFFFE6` (a binding-safe alpha) — pairing that with an extra `paint.opacity` would re-flatten on instance creation.
- ❌ Don't apply Paper elevation to the Severity Variants — MUI Alert is flat (`elevation: 0` per `Alert.js:206`). Only `Variant=Default` carries `material-design/shadows/shadows-6`.
- ❌ Don't model AlertTitle as a state of `Message` — AlertTitle is a separate Roboto Medium 16 px heading element. If a designer needs an Alert-with-title Snackbar, they detach the Severity cell and hand-add the title TEXT (see §7 #4).
- ❌ Don't add an arrow / pointer — Snackbar is not a Tooltip. The screen-level anchor relationship is implied by the wrapper's edge-anchored placement, not a visual pointer.
- ❌ Don't re-use the `seed/danger/main` (`#D32F2F`) token to paint the Error Variant under a different name. The token's `seed/*` namespace already encodes "danger" as the project's preferred name for MUI's `error` palette key — preserve the `seed/danger/main` reference even though MUI calls it `severity="error"`.

## 5. Token Glossary

This section names every token consumed. The component-scoped tokens are minted in `.claude/skills/figma-components/Snackbar/design-token.md` because the shared catalogue does not cover the SnackbarContent's emphasized-grey bg or the pre-alpha'd Alert icon white.

### 5.1 Seed (themable)

- `seed/primary/main` — `#1976D2`. MUI primary blue. Used as the **Action Button** text fill when `Variant=Default` (mirrors MUI's Snackbar+SnackbarContent default action color — see `storybook.render.md` §5.1).
- `seed/success/main` — `#2E7D32`. **Variant=Success** Alert filled bg.
- `seed/info/main` — `#0288D1`. **Variant=Info** Alert filled bg.
- `seed/warning/main` — `#ED6C02`. **Variant=Warning** Alert filled bg.
- `seed/danger/main` — `#D32F2F`. **Variant=Error** Alert filled bg. (The project's `seed/*` namespace names MUI's `error` palette as `danger`; preserve this convention. See §4.3 don't.)

### 5.2 Alias / Seed

- `seed/neutral/white` — `#FFFFFF`. Snackbar foreground (every Variant's text fill, the Default-Variant Close-icon fill, and the Severity-Variant Close-icon fill). The local `mui` collection ships this token; mirrored into the file's local collection on first authoring (Step 5 pre-flight).

### 5.3 Component-scoped (Snackbar)

Both tokens below are minted in the local `mui` collection during Step 5 pre-flight; their full resolution chain is in `design-token.md`.

- `component/snackbar/default-bg` — `#323232` (resolves to `darken('#fff', 0.8)`, MUI's `emphasize(palette.background.default, 0.8)` for light mode). Used as the SnackbarContent body bg for `Variant=Default`. Diverges from any `seed/*` token because the value is not a themable color role — it's a fixed-luminosity emphasized-greyscale that MUI hard-codes for the Snackbar surface. See `design-token.md` for the alpha / hex math.
- `component/snackbar/alert-icon-fg` — `#FFFFFFE6` (white at 0.9 α). Used as the leading **severity icon** fill for `Variant=Success / Info / Warning / Error`. Pre-alpha'd because MUI applies `opacity: 0.9` on the AlertIcon styled rule (`Alert.js:117`); pairing a bound `seed/neutral/white` with `paint.opacity: 0.9` would flatten on instance creation. The trailing close icon is **not** dimmed — it uses `seed/neutral/white` at 1.0 α (per `storybook.render.md` §3.2 vs §5.2).

No other Snackbar-scoped tokens are required. The action button's bg is transparent (no token needed) and the Severity variants' borders / shadows are nil.

### 5.4 Effect / shape & elevation

- Corner radius — `4 px` on the SnackbarContent / Alert body (matches MUI `shape.borderRadius`). Not bound to a variable; baked into the auto-layout container. The shared `material-design` collection does not currently expose `shape.borderRadius` as a `FLOAT` variable bound to component metrics — minting one for a single component is rejected as over-specific (mirrors `<Tooltip>`'s and `<Chip>`'s 4 / 16 px corner-radius decisions).
- Elevation — `material-design/shadows/shadows-6` applied as an effect style on the SnackbarContent body (`Variant=Default` only). MUI's `Paper elevation={6}` resolves to the 3-layer drop shadow stack — apply via `effects` referencing the local `shadows-6` style id. The Severity Variants are flat (`Alert` `elevation: 0`).

### 5.5 Typography

Hand-set values matching MUI runtime — Roboto, sizes per slot. The MUI Library file currently has zero local text styles for body2 / button (sibling components hand-set typography), so Snackbar applies the values directly on the TEXT nodes rather than via `textStyleId`.

| Slot                                | Font          | Weight       | Size  | Line-height (PIXELS) | Letter-spacing | Case      |
| ----------------------------------- | ------------- | ------------ | ----- | -------------------- | -------------- | --------- |
| Message slot default content (every Variant) | Roboto | 400 Regular | 14 px | 20 px                | `0.01071em` (≈ `0.15 px` at 14 px) | original  |
| `Action Label` (Action=Button)      | Roboto        | 500 Medium   | 13 px | 22.75 px (1.75 × 13) | `0.02857em` (≈ `0.37 px` at 13 px) | uppercase |

The design system standardizes on Noto Sans TC for body / heading typography (`material-design/typography/*`). Snackbar uses Roboto to mirror MUI runtime exactly, which is the established convention in this library (`<Button>` / `<Chip>` / `<Tooltip>` also keep Roboto for variant labels). See §7 #3.

If a future PR mints `material-design/components/snackbar` (Roboto Regular 14 / 20) and `material-design/components/alert-filled` (Roboto Medium 14 / 20) as local text styles, switch the Message TEXT nodes to bind those style ids and update §6.

## 6. Layout & Render Bindings

Snackbar's variant surface is small (15 cells) and the per-Variant paint matrix is regular (each Variant binds one bg + one fg + one icon-color trio). The binding details below are presented inline rather than as a per-cell Skeleton-B matrix — Skeleton A's "constants per slot" approach fits better.

### 6.1 Outer body — every cell

Auto Layout root. Every numeric is constant across the 15 cells; only the bg / shadow / typography weight / icon visibility differ per Variant + Action.

| Property                 | Value                                                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Auto Layout direction    | `HORIZONTAL`                                                                                                           |
| Sizing modes             | `primaryAxisSizingMode: AUTO` (HUG width up to inner content), `counterAxisSizingMode: AUTO` (HUG height)              |
| `primaryAxisAlignItems`  | `MIN` — message + action lay out left-to-right                                                                         |
| `counterAxisAlignItems`  | `CENTER` for `Variant=Default`, `MIN` (top) for Severity Variants — mirrors MUI's SnackbarContent (`align-items: center`) vs Alert (`align-items: flex-start`) split. See `storybook.render.md` §2 vs §3. |
| Min width                | `288 px` (matches `min-width: 288` for the sm breakpoint)                                                              |
| Padding                  | `6 px 16 px` — matches MUI's SnackbarContent / Alert root padding directly. The `Message Slot`'s required `padding: 0` is still honored; MUI's `MuiSnackbarContent-message` / `MuiAlert-message` `8 0` padding is relocated onto a sibling `Message Container` wrapper (see §6.3) so the message column still measures `8 + 20 + 8 = 36 px` and the cell resolves to `6 + max(36, 36) + 6 = 48 px` like MUI. See §7 #16 (resolved). |
| Item spacing (gap)       | `0` — internal slots own their own padding (Message Container: `8 0`, Icon Slot: `12` margin-right via Auto Layout, Action Slot: `16` padding-left, `−8` margin-right not modeled per §7 #14) |
| Corner radius            | `4 px`                                                                                                                 |
| Body fill                | bound to `component/snackbar/default-bg` (`Variant=Default`) or `seed/<severity>/main` (Severity)                       |
| Body stroke              | `none`                                                                                                                 |
| Body effect              | `material-design/shadows/shadows-6` (Variant=Default only) / `none` (Severity)                                          |

### 6.2 Severity icon slot — `Variant ≠ Default`

The leading severity icon. Renders MUI's default icon mapping per severity (check-circle outlined / info-circle outlined / warning-triangle outlined / exclamation-circle outlined). Authored as a nested INSTANCE of the dedicated `<SnackbarSeverityIcon>` component set minted in step 5 (see §6.5).

| Property                  | Value                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Width × Height            | `22 × 22 px` (matches MUI's `font-size: 22 px` on the AlertIcon styled rule)                           |
| Layout-spacing context    | inside an Auto Layout HORIZONTAL parent ("Icon Slot") with `padding: 7 0`, `marginRight: 12` between the slot and the Message slot — net horizontal advance = `7 + 22 + 12 + 0 = 41 px` from the Auto Layout's leading edge to the Message's leading edge minus the body's `paddingLeft: 16` |
| Icon fill                 | bound to `component/snackbar/alert-icon-fg` (`#FFFFFFE6`, 0.9 α white) on every vector path of the glyph |
| Icon stroke               | `none`                                                                                                 |

The 4 glyphs share the geometry of the dedicated severity component set — see §6.5.

### 6.3 Message column — every cell

The message column is a two-node composition: a `Message Container` Auto Layout wrapper that owns MUI's `8 0` message-wrapper padding, and a real Figma `SLOT` (`node.type === 'SLOT'`) inside it that designers fill. Splitting the wrapper from the slot lets the slot stay a `padding: 0` pass-through (per `figma-operator-guide` component-rules.md §4) while still preserving the 36 px message-column height MUI's `MuiSnackbarContent-message` / `MuiAlert-message` produce at runtime.

#### 6.3.1 `Message Container` (outer wrapper)

| Property                  | Value                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Layer name                | `Message Container`                                                                                    |
| Type                      | `FRAME` (Auto Layout)                                                                                  |
| Auto Layout               | `VERTICAL`, `primaryAxisSizingMode: AUTO`, `counterAxisSizingMode: AUTO`, `itemSpacing: 0`             |
| Padding                   | `8 px 0` (`paddingTop / paddingBottom: 8`, `paddingLeft / paddingRight: 0`) — encodes MUI's message-wrapper padding so the message column measures `8 + 20 + 8 = 36 px` |
| Fills                     | `[]` (transparent)                                                                                     |
| Horizontal sizing         | `FILL` when `Action ≠ None` (pushes the trailing Action slot to the cell's right edge), `HUG` when `Action = None` |
| Vertical sizing           | `HUG`                                                                                                  |

#### 6.3.2 `Message Slot` (real Figma SLOT, inside the Container)

| Property                  | Value                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Slot type                 | `SLOT` (created via `variant.createSlot()` per component-rules.md §3 — bundled `.d.ts` lacks the type but the runtime supports it) |
| Slot Auto Layout          | `VERTICAL`, `primaryAxisSizingMode: AUTO`, `counterAxisSizingMode: AUTO`, `itemSpacing: 0`             |
| Slot `padding`            | `0` (per component-rules.md §4 — slots are pass-through containers; never impose layout opinions)      |
| Slot fills                | `[]` (transparent)                                                                                     |
| Slot horizontal sizing    | `HUG` (the `Message Container` wrapper drives the column's external sizing — see §6.3.1)               |
| Slot vertical sizing      | `HUG`                                                                                                  |
| Slot SET-level binding    | `componentPropertyReferences.slotContentId = 'Message Slot#873:0'` on every variant's slot node — the canonical SET-level property is reused, not duplicated per variant |
| Default content           | one TEXT child — Roboto Regular 14 / 20, fill bound to `seed/neutral/white`, `TEXT_AUTO_RESIZE = WIDTH_AND_HEIGHT`, characters `This is a snackbar message` |
| Override path             | designers drop arbitrary children into the slot via Figma's instance right panel — text, icon + text, `<AlertTitle>` + body, a custom message component, etc. The `8 px` vertical breathing room above and below the slot's content is contributed by the outer `Message Container`, not the slot itself, so consumer overrides see the same MUI rhythm as the default TEXT. |

### 6.4 Action slot — `Action ≠ None`

Auto Layout HORIZONTAL trailing slot. Two structurally different inner contents per `Action` value. Both are authored as **custom Auto Layout shapes** (not INSTANCE references to the project's published `<Button>` / `<IconButton>` sets) so the Snackbar cell can rebind text / glyph fills per Variant without fighting the inner instance's bound paints. See §7 #14 for the divergence note.

#### 6.4.1 `Action=Button`

| Property                 | Value                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| Outer button width       | HUG — `min-width: 64 px` per MUI Button small                                                          |
| Outer button height      | `30 px` (Button small `padding: 4 5` + `lineHeight ~22.75`)                                             |
| Outer button padding     | `4 px 5 px`                                                                                            |
| Outer button bg          | `transparent` (no fills)                                                                               |
| Outer button radius      | `4 px`                                                                                                 |
| Action Label fill        | bound to `seed/primary/main` (`#1976D2`, Variant=Default) or `seed/neutral/white` (`#FFFFFF`, Severity Variants — inherits from MUI Alert's `color="inherit"`) |
| Action slot context (`Variant=Default`) | parent Auto Layout sets `paddingLeft: 16`, `paddingRight: 0`, `align-self: center` (matches `MuiSnackbarContent-action` minus the `margin-right: -8` — see §7 #14) |
| Action slot context (Severity) | parent Auto Layout sets `paddingTop: 4`, `paddingLeft: 16`, `paddingRight: 0`, `align-self: flex-start` (matches `MuiAlert-action` `padding: '4 0 0 16'` minus the `margin-right: -8`) |

#### 6.4.2 `Action=Close`

A 28 × 28 frame wrapping the close glyph. The outer ring is transparent until hover/pressed (no design representation in the open Snackbar cell).

| Property                 | Value                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| Outer button width × height | `28 × 28 px`                                                                                        |
| Outer button padding     | `5 px` (uniform — matches MUI IconButton small)                                                        |
| Outer button radius      | `999 px` (`50%` per MUI — full circle)                                                                 |
| Outer button bg          | `transparent` (no fills)                                                                               |
| Glyph dimensions         | `18 × 18 px` (matches `fontSize: 18` of MUI close icon at `fontSize="small"`)                          |
| Glyph                    | MUI internal `Close` SVG path (`M19 6.41L17.59 5 …`) authored as a single VECTOR child                  |
| Glyph fill               | bound to `seed/neutral/white` (`#FFFFFF`) — close icon is **not** dimmed (per §5.3)                    |
| Action slot context (Default) | parent Auto Layout sets `paddingLeft: 16`, `paddingRight: 0`, `align-self: center`                |
| Action slot context (Severity) | parent Auto Layout sets `paddingTop: 4`, `paddingLeft: 16`, `paddingRight: 0`, `align-self: flex-start` |

### 6.5 Severity icon component set — `<SnackbarSeverityIcon>`

The 4 severity icons (check-circle outlined / info-circle outlined / warning-triangle outlined / exclamation-circle outlined) do **not** exist in the existing project `<Icon>` component set, which is structured around generic glyph axes (`Size=xs..xxl` × `Glyph=...`) and does not ship Material's outlined severity glyphs at v1. Per `figma-create-component` §5 ("Don't extend pre-existing icon sets when their axis structure is incompatible"), step 5 mints a **dedicated** `<SnackbarSeverityIcon>` component set adjacent to the Snackbar component set (same page, sibling frame).

| Aspect              | Value                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- |
| Variant axis        | `Severity` — `Success`, `Info`, `Warning`, `Error` (4 cells)                           |
| Cell size           | `22 × 22 px` (matches MUI `font-size: 22`)                                             |
| Glyph paths         | derived from MUI's `internal/svg-icons/{SuccessOutlined, InfoOutlined, ReportProblemOutlined, ErrorOutline}` — copy the `<path>` data verbatim or use the MUI source as visual reference |
| Glyph fill          | bound to `component/snackbar/alert-icon-fg` (default; consumers can rebind via instance override) |

Storage: published as a sibling COMPONENT_SET inside the `846:11794` frame (or in a sibling frame on the same page if space allows). The Snackbar's Severity cells reference it via nested INSTANCE, with the `Severity` axis driven by an `Instance Swap`-equivalent override per cell. (Concretely, since Figma can't INSTANCE_SWAP across variant axes of a sibling SET via the Snackbar's variant-property surface, the spec authorizes 4 independent INSTANCE references — one per Severity Variant cell — each pointing at the matching `<SnackbarSeverityIcon Severity=…>` cell. See step 5's "structural replacements" phase.)

If a future PR adds the 4 severity glyphs into the existing `<Icon>` component set with a compatible axis (`Glyph=success-outlined / info-outlined / warning-outlined / error-outlined`), retire `<SnackbarSeverityIcon>` and re-bind the Snackbar cells to the existing `<Icon>` set.

### 6.6 Cell composition summary

```
Snackbar cell (Auto Layout HORIZONTAL, padding 6/16, gap 0, min-width 288, radius 4)
├── [Severity Variants only] Icon Slot (Auto Layout HORIZONTAL, padding: 7 / 12 / 7 / 0)
│   └── INSTANCE → <SnackbarSeverityIcon Severity={current variant}>  // 22 × 22, vector fill=alert-icon-fg (paint.opacity=1)
├── Message Container (Auto Layout VERTICAL, padding 8 0, gap 0; FILL when Action≠None, HUG when Action=None)
│   └── Message Slot (real Figma SLOT, VERTICAL Auto Layout, padding 0, gap 0, HUG/HUG)
│       └── default content: TEXT "This is a snackbar message" Roboto Regular 14/20, fill=neutral/white
│                            // designers swap the slot content for icon+text, AlertTitle+body, etc.
└── [Action ≠ None] Action Slot (Auto Layout HORIZONTAL, padding-left 16, padding-right 0 — see §7 #14)
    └── { Action=Button: custom Auto Layout HORIZONTAL min-width 64, padding 4/5, radius 4, transparent — wraps a TEXT "Action Label" (Roboto Medium 13/22.75 uppercase, fill=primary/main for Default | neutral/white for Severity)
         | Action=Close:  custom 28×28 frame, padding 5, radius 999, transparent — wraps an 18×18 VECTOR (MUI Close path, fill=neutral/white) }
                          // Authored as custom shapes, NOT <Button> / <IconButton> instance references — see §7 #15.
```

For Severity Variants, the Auto Layout root's `counterAxisAlignItems = MIN` plus the Action slot's `align-self: flex-start` (or row-level `marginTop: 4`) reproduces MUI's `align-items: flex-start` for `MuiAlert-action`. For Default Variant, `counterAxisAlignItems = CENTER` reproduces MUI's `align-items: center` for `MuiSnackbarContent-action`.

## 7. Documented divergences from MUI runtime

These are intentional trade-offs that this spec adopts; do **not** silently re-align them to MUI without ownership review. Every entry here ships in `storybook.render.md` §7 as a drift check too.

1. **Touch / mobile breakpoint metrics are not modeled** — MUI's Snackbar root has a `theme.breakpoints.up('sm')` rule that grows offset distance from `8 px` to `24 px` and switches `flex-grow: 1` (full-width mobile body) to `flex-grow: initial` + `min-width: 288`. The Figma cell models the **sm breakpoint** body (HUG width with `min-width: 288`); the mobile full-width state is not modeled. Designers needing a mobile mockup should clone the cell and stretch it to viewport width by hand. Modeling Mobile as a third axis would multiply the matrix to 30 cells for a low-fidelity edge case.
2. **`anchorOrigin` is not a variant axis** — see §2.1. The 6 anchor positions only change the wrapper's `position: fixed` offsets, not the body. `storybook.render.md` §1.1 documents the offsets so designers can compose screen-level placement by hand.
3. **Typography uses Roboto, not Noto Sans TC** — the design system's catalogue centres CJK typography on Noto Sans TC (`material-design/typography/*`). Snackbar mirrors MUI runtime exactly (Roboto Regular / Medium 14 / 20) because (a) this library's other MUI re-exports keep Roboto for variant-label parity, and (b) Snackbar text is typically short (< 100 chars) and CJK fallback at 14 px doesn't require a CJK-tuned glyph. If a future PR introduces a CJK-first design-system override, mint `material-design/components/snackbar` and `material-design/components/alert-filled` (Noto Sans TC 14 / 20) and re-bind the Message TEXT nodes.
4. **AlertTitle is not modeled as a variant or property** — MUI's `<AlertTitle>` renders a Roboto Medium 16 / 24 px heading above the Alert's body. Modeling it as a `Has Title` BOOLEAN would inflate the matrix to 30 cells and most Snackbar usages don't ship a title (Snackbars are typically short, single-line). The `WithTitle` story exists to demo the layout but the Figma cell does not commit to it. Designers needing an Alert-with-title Snackbar detach the Severity cell and hand-add the title TEXT.
5. **~~Figma `defaultVariant` cannot be re-defaulted~~ — Resolved 2026-05-08.** The 2026-05-08 publish landed with `Variant=Default, Action=None` as Figma's auto-derived default — matching the MUI intent exactly (no axis-renaming workaround needed). `Default` sorts alphabetical-first on the Variant axis (`Default` < `Error` < `Info` < `Success` < `Warning`); `None` won the Action axis because the pipeline created `Variant=Default, Action=None` as the very first component child (Figma's secondary tiebreaker is creation order). The §3 "Figma actual" column now agrees with the "intent" column. If a future PR reorders construction or renames axis values such that the auto-derived default drifts away from MUI intent, restore this divergence note rather than silently letting designers receive the wrong default.
6. **Default-Variant Action Button uses MUI primary blue, not theme-driven** — MUI's Snackbar+SnackbarContent docs canonicalize the action as a `color="primary"` Button. The Figma cell binds the Default-Variant Action Button text to `seed/primary/main`. If a future host app overrides `palette.primary.main` to a non-blue, the Figma cell would render the wrong color until the file's `seed/primary/main` re-resolves. Acceptable — the binding intentionally tracks the project palette.
7. **~~Alert filled fontWeight is `500` (Medium), Default Variant is `400` (Regular)~~ — Resolved 2026-05-08.** When the Message wrapper was promoted to a Figma SLOT (`Message Slot`), the slot's default content became a single Roboto Regular 14 TEXT shared by all 5 Variants — the per-Variant fontWeight differentiation was dropped to keep the slot's default content uniform. MUI runtime still emits `fontWeight: 500` for filled-Alert messages, so designers wanting Medium for Severity messages either (a) override the slot content with their own Roboto Medium TEXT, or (b) drop a custom component into the slot whose typography they fully control. The trade-off is documented in §3.1; the design-system call was that slot uniformity beats per-Variant weight fidelity. Tracked in `storybook.render.md` §3 as a remaining runtime delta.
8. **Severity icon at 90 % α is pre-alpha'd into a single token** — MUI emits `opacity: 0.9` on the AlertIcon styled rule and inherits `color: #FFFFFF` from the Alert root. Figma's binding-safe alpha rule (don't pair `paint.opacity < 1` with a bound variable) forces the 0.9 α into a pre-alpha'd `component/snackbar/alert-icon-fg = #FFFFFFE6`. The trailing close icon is **not** dimmed (no MUI `opacity` override) and binds to `seed/neutral/white` at 1.0 α. If a future PR unifies the 2 paths (e.g. dimming the close icon too), collapse the trailing close-icon binding to `component/snackbar/alert-icon-fg`.
9. **Snackbar root `position: fixed` wrapper is not part of the cell** — see §6 ("the Figma component does not model the wrapper"). The cell renders the SnackbarContent / Alert body only; designers compose anchorOrigin offsets on the consuming screen frame.
10. **Severity icons are a dedicated `<SnackbarSeverityIcon>` set, not nested in the existing `<Icon>` set** — see §6.5. The 4 outlined severity glyphs do not fit the existing Icon set's `Size × Glyph` axis without a 2D variant explosion. If a future PR adds the 4 glyphs to the existing Icon set with a compatible axis, retire the dedicated set and re-bind the Snackbar cells.
11. **No `box-shadow` ring on focus** — Snackbar itself is never the focus target (the **action button** receives focus and dispatches keyboard interactions). MUI doesn't apply `Mui-focusVisible` to the Snackbar body, and the Figma cell follows. The action Button / IconButton inner instance would carry its own focus state per the `<Button>` / `<IconButton>` specs.
12. **Body `min-width: 288` is enforced via Auto Layout** — MUI's runtime `min-width: 288` lives on the SnackbarContent / Alert root; the Figma cell sets `minWidth: 288` on the Auto Layout root. Long messages (`LongMessage` story) wrap inside the body; the parent Snackbar root's mobile full-width path (`flex-grow: 1`) is not modeled (see §7 #1).
13. **AlertIcon's `padding: 7 0` is folded into the Auto Layout** — MUI's AlertIcon styled rule sets `padding: 7px 0` on the icon container, which combines with the icon's 22 px font-size to produce a 36 px-tall column. The Figma Auto Layout uses `paddingTop / paddingBottom: 7` on the icon slot; visually identical, but the Figma slot's bounds are tied to Auto Layout's child frame rather than CSS padding semantics.
14. **Action `margin-right: -8` is not modeled** — MUI's `MuiSnackbarContent-action` and `MuiAlert-action` both apply `margin-right: -8` so the action visually pokes 8 px past the cell's `padding-right: 16` boundary (effective trailing whitespace from the action's right edge to the cell's right edge becomes `8 px`). Figma Auto Layout has no native negative-margin primitive. The published cell keeps `padding-right: 16` constant and accepts that the action sits at `16 px` from the cell's right edge instead of `8 px`; the visual delta is barely perceptible on the ≥ 288 px-wide cell. To close the divergence, either (a) reduce the cell's `paddingRight` to `8` whenever `Action ≠ None` (small inner-area shift on the message), or (b) `layoutPositioning: ABSOLUTE` the action slot with `constraints.horizontal: 'MAX'` and an `8 px` right offset (more authoring overhead per cell). Either approach is reversible — pick one when MUI fidelity becomes load-bearing.
15. **Action contents are custom Auto Layout shapes, not INSTANCE references to `<Button>` / `<IconButton>`** — the published `<Button>` set encodes `Color × Variant × State` (90 cells) and the `<IconButton>` set does the same. Reusing them as nested INSTANCE inside the Snackbar would require per-Variant overrides for the inner Label TEXT fill (Default → primary blue, Severity → white) — Figma's instance overrides can rebind text fills, but doing it across 5 Severity Variants for each of the 5 Action=Button cells turns into 5+ override calls per cell with brittle `boundVariables` semantics. The v1 implementation authors the Action shape inline (transparent 64×30 frame for Button, transparent 28×28 frame for Close) so the text / glyph fills bind directly per-cell. If a future PR exposes the action's hover / pressed / focus states (e.g. Button-instance ripple visuals on hover), promote the custom shape back to a `<Button>` / `<IconButton>` INSTANCE and accept the override-per-cell complexity. Tracked as resolution path for §11 ("No focus ring") above.
16. **~~MUI's `MuiSnackbarContent-message` / `MuiAlert-message` `padding: '8 0'` is folded into the cell's outer padding~~ — Resolved 2026-05-08.** The original encoding bumped cell `paddingTop / paddingBottom` from `6` to `14` to absorb the lost message-wrapper padding when the Message became a SLOT. That worked for `Variant=Default, Action=None` (where the message column is the only content) but **inflated every other cell** because the cell's effective height became `14 + max(icon col 36, message col 20, action col …) + 14` instead of MUI's `6 + max(36, 36, …) + 6` — Severity cells came out 16 px tall too, and Default×Action≠None came out 11 px too tall. The fix relocates the `8 0` padding onto a dedicated `Message Container` Auto Layout VERTICAL wrapper that sits between the cell and the SLOT (see §6.3). The wrapper carries the padding; the inner SLOT keeps `padding: 0` and stays a clean pass-through. With cell padding back at MUI-native `6 / 16`, the message column measures `8 + 20 + 8 = 36 px` and every cell resolves to `48 px` tall, matching MUI runtime exactly. Slot consumers dropping custom content into the Message Slot still get `8 px` of breathing room above / below their content (contributed by the wrapper, identical to MUI's behavior with `MuiAlert-message`). If a future PR ships content that needs to override that breathing room, override the wrapper's `paddingTop / paddingBottom` at the instance level rather than re-folding into the cell.

If a future PR closes any of these divergences, append a `Resolved YYYY-MM-DD` line to the affected entry rather than deleting it.

## 8. Source Sync Rule

This document and the source must move together. A change in any of the following files **forces** an update here and in `storybook.render.md`:

1. `src/stories/Snackbar.stories.tsx` — story file. New stories, removed args, or renamed exports update §2 / §3 / §4.1 in this spec.
2. `node_modules/@mui/material/Snackbar/Snackbar.js` — MUI Snackbar source. A bump that changes anchorOrigin offsets, breakpoints, or the slot composition updates §1.1 / §6 in `storybook.render.md` and §2 / §3 here.
3. `node_modules/@mui/material/SnackbarContent/SnackbarContent.js` — Default Variant body source. A bump that changes paddings, `min-width: 288`, or the `emphasize(background.default, 0.8)` formula updates §2 / §6.1 / §6.3 here and `storybook.render.md` §2.
4. `node_modules/@mui/material/Alert/Alert.js` — Severity Variant body source. A bump that changes paddings, the icon's `font-size: 22` or `opacity: 0.9`, or the filled-variant's `fontWeight: 500` rule updates §3 / §6.2 / §6.3 here and `storybook.render.md` §3.
5. `package.json` (and `pnpm-lock.yaml`) — pin of `@mui/material`. Bump §1's `Underlying MUI` row whenever the resolved version changes.
6. `.storybook/preview.tsx` — global theme decorator. If the project introduces a custom MUI theme override (`palette.background.default`, `palette.<severity>.main`, `cssVariables: true`, or a dark-mode preview), update §1, §5, §6 and re-derive `storybook.render.md` paint values. Specifically, turning on `theme.vars` switches the SnackbarContent bg from `emphasize(...)` to `vars.palette.SnackbarContent.bg`, and the Alert filled bg from `palette[color].main` to `vars.palette.Alert[<color>FilledBg]` — both alter the divergence resolution.
7. The published Figma `<Snackbar>` component set (file `KQjP6W9Uw1PN0iipwQHyYn`, frame `846:11794`) — once published, set the `figma_component_set_id` frontmatter and reflect any axis additions / component-property additions in §3.
8. The published Figma `<SnackbarSeverityIcon>` component set (sibling of `<Snackbar>` in the same file, see §6.5) — once published, document its node id in §6.5 and update Snackbar's Severity cell INSTANCE references.
9. The MUI variable collection (`material-design` + `mui` collections in this Figma file) — if a token is renamed, removed, or its `resolvedType` changes, update every reference in §5, §6.1, §6.2, §6.4. **Token-value changes alone do not require a spec edit** — variables resolve by name.
10. `.claude/skills/figma-create-component/library-tokens.md` — the project token catalogue. If `seed/<severity>/main`, `seed/primary/main`, or `seed/neutral/white` change, propagate to §5.1–§5.2.
11. `.claude/skills/figma-components/Snackbar/design-token.md` — component-scoped tokens. Any addition / removal there requires a §5.3 update here.

Specifically:

- **A new MUI Snackbar prop with visual representation** (e.g. a future `tone` or `shape` prop) → add a row to §2, decide whether it gets a `VARIANT` / `BOOLEAN`, update §3, refresh §6, add color value mapping to §2.X if applicable.
- **MUI flips the SnackbarContent bg formula** (e.g. `emphasize(...)` → fixed `palette.grey[800]`) → re-resolve `component/snackbar/default-bg`'s value in `design-token.md`, then propagate to §6.1.
- **Renamed token** (e.g. `seed/danger/main` → `seed/error/main`) → grep §5 / §6 for the old name, update every reference, refresh `storybook.render.md` if it referenced the token.
- **MUI lowers Alert filled fontWeight to `400`** (closing the §7 #7 divergence) → update §5.5 and §6.3 row, mark §7 #7 resolved with date.
- **Add `Mobile` axis** → refresh §3 axis tables, multiply variant math, re-derive §6.1 padding / sizing per breakpoint, mark §7 #1 resolved with date.
- **Add `Has Title` BOOLEAN** → add a row to §3.1, update §6 to author the AlertTitle TEXT, mark §7 #4 resolved with date.
- **Severity glyphs land in the existing `<Icon>` set** → re-bind Snackbar Severity cells, retire `<SnackbarSeverityIcon>`, mark §7 #10 resolved with date.

## 9. Quick Reference

### 9.1 Source TypeScript surface

```ts
// `src/stories/Snackbar.stories.tsx` re-exports MUI Snackbar directly.
// MUI SnackbarProps (excerpt):
type SnackbarProps = {
  action?: ReactNode;                      // → Figma VARIANT `Action` + TEXT `Action Label`
  anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' }; // (no Figma axis — see §2.1)
  autoHideDuration?: number;               // (behavior-only)
  children?: ReactElement;                 // (replaces SnackbarContent — used for <Alert> Severity Variants)
  ContentProps?: Partial<SnackbarContentProps>; // (deprecated)
  ClickAwayListenerProps?: object;         // (deprecated)
  disableWindowBlurListener?: boolean;     // (behavior-only)
  message?: ReactNode;                     // → Figma TEXT `Message`
  onBlur?: FocusEventHandler;              // (behavior-only)
  onClose?: (event, reason) => void;       // (behavior-only)
  onFocus?: FocusEventHandler;             // (behavior-only)
  onMouseEnter?: MouseEventHandler;        // (behavior-only)
  onMouseLeave?: MouseEventHandler;        // (behavior-only)
  open?: boolean;                          // (behavior-only — Figma cell is always open=true)
  resumeHideDuration?: number;             // (behavior-only)
  slots?: SnackbarSlots;                   // (designer-side overrides; not part of variant surface)
  slotProps?: SnackbarSlotProps;           // (same)
  sx?: SxProps<Theme>;                     // (style-override; not modeled)
  TransitionComponent?: ElementType;       // (deprecated)
  transitionDuration?: number | { appear?, enter?, exit? }; // (behavior-only)
  TransitionProps?: TransitionProps;       // (deprecated)
};

// MUI AlertProps (excerpt — used as the Severity Variants' inner content):
type AlertProps = {
  action?: ReactNode;                      // → Figma VARIANT `Action` + TEXT `Action Label`
  children?: ReactNode;                    // → Figma TEXT `Message`
  closeText?: string;                      // (behavior-only)
  color?: AlertColor;                      // (overrides severity for theming)
  icon?: ReactNode | false;                // (behavior-only override; Figma uses default mapping)
  iconMapping?: Record<AlertColor, ReactNode>; // (behavior-only override)
  onClose?: (event) => void;               // → triggers Action=Close auto-render
  role?: string;                           // (a11y plumbing)
  severity?: AlertColor;                   // → Figma VARIANT `Variant` (Success / Info / Warning / Error)
  variant?: 'standard' | 'outlined' | 'filled'; // (Figma cells pin filled — see §2.2)
};
```

### 9.2 Figma component summary

```
Component: <Snackbar>
File:      KQjP6W9Uw1PN0iipwQHyYn (MUI Library)
Frame:     Snackbar / `<Snackbar>` (846:11794)

Variant axes (15 cells):
  Variant : Default | Success | Info | Warning | Error
  Action  : None | Button | Close

Component properties (single canonical, shared by all 15 variants):
  Message Slot  SLOT  default child: TEXT "This is a snackbar message" Roboto Regular 14/20, fill=neutral/white
                       per component-rules.md §4 — slot Auto Layout VERTICAL, padding 0, gap 0, HUG
                       canonical id `Message Slot#873:0`; variants reuse via componentPropertyReferences.slotContentId
  Action Label  TEXT  default "UNDO"                         Roboto Medium 13/22.75 uppercase

Layout: root Auto Layout HORIZONTAL, min-width 288, padding 6/16 (matches MUI), corner radius 4, gap 0
  - Variant=Default  →  bg=component/snackbar/default-bg (#323232), shadow=shadows-6,
                        counterAxisAlignItems: CENTER
  - Variant=Severity →  bg=seed/<severity>/main, no shadow, counterAxisAlignItems: MIN
                        leading 22×22 icon Instance (severity glyph, fill=alert-icon-fg pre-α'd)
  Message Container (FRAME): VERTICAL Auto Layout, padding 8/0, gap 0; HUG when Action=None, FILL when Action≠None.
                             Owns MUI's MuiSnackbarContent-message / MuiAlert-message 8/0 padding (see §7 #16 resolved).
    └─ Message Slot (real Figma SLOT): VERTICAL Auto Layout, padding 0, gap 0, HUG/HUG.
                                       Default content: TEXT "This is a snackbar message", Roboto Regular 14/20, fill=seed/neutral/white
  Action Slot (when Action≠None): paddingLeft 16, paddingRight 0 (margin-right: -8 NOT modeled — see §7 #14)
    - Action=Button: custom transparent 64×30 frame (radius 4, padding 4/5), wraps TEXT "Action Label"
                     Roboto Medium 13/22.75 uppercase, fill=seed/primary/main (Default) | seed/neutral/white (Severity).
                     NOT an INSTANCE of the project <Button> set — see §7 #15.
    - Action=Close:  custom transparent 28×28 frame (radius 999, padding 5), wraps 18×18 VECTOR
                     (MUI Close glyph), fill=seed/neutral/white. NOT an INSTANCE of <IconButton>.

Cell heights: every cell resolves to 48 px (6 + 36 + 6) — uniform across the matrix and matches MUI runtime.

Sibling: <SnackbarSeverityIcon> COMPONENT_SET (4 cells: Success / Info / Warning / Error)
  - 22×22 vector glyphs (check-circle outlined / info-circle outlined / warning-triangle outlined / exclamation-circle outlined)
  - fill=component/snackbar/alert-icon-fg

Default variant (intent):  Variant=Default, Action=None (MUI runtime default)
Default variant (Figma):   Variant=Default, Action=None (matches intent — see §7 #5)
Local-only bindings: every paint resolves to this file's local collection.
```

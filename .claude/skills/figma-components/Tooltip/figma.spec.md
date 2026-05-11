---
name: figma-component-tooltip-spec
description: Figma component specification for `<Tooltip>` — design counterpart of the MUI `<Tooltip>` consumed by `src/stories/Tooltip.stories.tsx`. Documents the variant matrix (Placement × Arrow), the `Title` TEXT property, source-to-Figma mapping, the Tooltip body + Arrow paint bindings, and the MUI runtime divergences (`grey[700] × 0.92` body vs `0.9` arrow alpha pair vs the design system's single `component/tooltip/fill = #616161E5` token). For runtime measurements see `storybook.render.md`; component-scoped tokens reuse the existing shared catalogue (no new `design-token.md` required).
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '804:11975'
figma_component_set_id: '810:16739'
---

# `<Tooltip>` Figma Component Specification

## 1. Overview

`<Tooltip>` is the Figma counterpart of the MUI `<Tooltip>` consumed in `src/stories/Tooltip.stories.tsx`. The package re-exports MUI Tooltip directly — there is no wrapper — so the Figma component encodes the visible MUI prop surface (`placement`, `arrow`) as variant axes and exposes `title` as a TEXT component property. The other `<Tooltip>` props (`enterDelay`, `disableHoverListener`, `followCursor`, etc.) are behavior-only and have no design representation.

Tooltip is the simplest published primitive in this library — no `Color` axis (Tooltip is monochrome greyscale by default), no `State` axis (visibility is binary — open vs closed; closed has no visual to author), and no `Size` axis on the public prop surface (the `touch` mode is set internally via touch-event handlers, not via a public prop — see §7 #1). The variant explosion is therefore driven entirely by **Placement × Arrow = 12 × 2 = 24 cells**.

The editable Figma node `804:11975` (1028 × 657 frame on the **MUI Library** file's Tooltip page) was empty at the start of this pipeline; this spec describes what the **first published version** must look like once Step 5 completes. Frontmatter `figma_node_id` pins the parent frame; `figma_component_set_id` is left blank until the COMPONENT_SET is created.

| Aspect              | Value                                                                                |
| ------------------- | ------------------------------------------------------------------------------------ |
| Source story        | `src/stories/Tooltip.stories.tsx`                                                    |
| Underlying source   | `@mui/material` `Tooltip` (re-exported by this package)                              |
| Underlying MUI      | `@mui/material` 7.3.10 (resolved from `package.json` on 2026-05-07)                  |
| Figma file          | `KQjP6W9Uw1PN0iipwQHyYn` (MUI-Library)                                               |
| Figma frame         | `Tooltip` (`804:11975`) — 1028 × 657, page **Tooltip** (or whichever page hosts `804:11975`; verify in step 5) |
| Component Set       | _to be created_ — node id pinned in `figma_component_set_id` once published          |
| Total variants      | **24** (12 Placements × 2 Arrow)                                                     |
| Typography          | Roboto Medium `11 / 16.5 px` (line-height 1.5 inherited from CssBaseline body1) for the Tooltip body. **Hand-set on the TEXT node** — the design system has no `material-design/components/tooltip` text style, so the spec applies fontName / size / line-height directly. (See §7 #2 for the design-system divergence: Noto Sans TC, the project's primary CJK font, is _not_ used for Tooltip — runtime is Roboto-only and the spec keeps that to mirror MUI fidelity.) |
| Local-only bindings | **Required.** Every paint / stroke / effect resolves to a variable in this file's local collection. The component-scoped `component/tooltip/fill` token already exists in the shared catalogue (`#616161E5`) and is mirrored into this file's local collection on first authoring (Step 5 pre-flight). No `VariableID:<sharedKey>/...` consumed-library bindings are permitted. |

## 2. Source-to-Figma Property Mapping

| MUI prop                | Figma property | Type    | Notes                                                                                                                |
| ----------------------- | -------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| `placement`             | `Placement`    | VARIANT | All 12 Popper placements: `Top Start` / `Top` / `Top End` / `Bottom Start` / `Bottom` / `Bottom End` / `Left Start` / `Left` / `Left End` / `Right Start` / `Right` / `Right End`. MUI default is `bottom`. |
| `arrow`                 | `Arrow`        | VARIANT | `False` / `True`. Modeled as a VARIANT (not a BOOLEAN) because the arrow's **position** changes per `Placement` — a BOOLEAN would force every Placement cell to author both with-arrow and without-arrow geometry, doubling the per-cell maintenance cost. With a 2nd VARIANT axis, each cell is committed to a single arrow state and the cross-product (24) maps cleanly to designer intent. MUI default is `false`. |
| `title`                 | `Title`        | TEXT    | Default `Tooltip`. Hand-set Roboto Medium 11/16.5 px.                                                                |
| `open`                  | —              | —       | Behavior-only. The Figma component represents the **open** state (closed has no visual). Story uses `open={true}` for capture. |
| `arrow` interactions    | —              | —       | Behavior-only — Popper repositions the arrow at runtime via `popperOptions.modifiers`; Figma cells freeze a single position per `Placement` value. |
| `enterDelay`, `enterNextDelay`, `enterTouchDelay`, `leaveDelay`, `leaveTouchDelay` | — | — | Behavior-only, no design representation. |
| `disableFocusListener`, `disableHoverListener`, `disableInteractive`, `disableTouchListener` | — | — | Behavior-only. |
| `describeChild`         | —              | —       | A11y-only (toggles `aria-describedby` vs `aria-labelledby`); no visual.                                              |
| `followCursor`          | —              | —       | Behavior-only — popper anchor changes at runtime; Figma cells freeze around a static anchor.                         |
| `id`                    | —              | —       | A11y plumbing.                                                                                                       |
| `onOpen` / `onClose`    | —              | —       | Behavior-only.                                                                                                       |
| `placement`-controlled `transformOrigin` | — | — | Set by source per primary direction (`Tooltip.js:177-189`); Figma cells reproduce the visual outcome (where the arrow attaches), not the transform-origin metadata. |
| `slots`, `slotProps`, `components`, `componentsProps`, `PopperProps`, `PopperComponent`, `TransitionComponent`, `TransitionProps` | — | — | Behavior-only — designer-side overrides reach for instance overrides + Figma's `Detach` if needed; the published component does not pre-model these. |
| `sx`, `classes`         | —              | —       | Style override entry-points; not part of the variant surface.                                                        |

### 2.1 No color value mapping

`<Tooltip>` has no `Color` axis on the published Figma component. MUI's runtime Tooltip is monochrome (single greyscale fill / arrow + white foreground). If a future PR introduces themed Tooltips (per-color fill bound to `seed/<C>/main`), add a `Color` axis here, refresh §3 / §6, and split §6's "constants" tables into per-Color rows. The current spec ships **only** the default greyscale variant.

## 3. Variant Property Matrix

```
Placement × Arrow   =   12 × 2   =   24 variants
```

| Property    | Default value (intent) | Default value (Figma actual) | Options                                                                                                                            |
| ----------- | ---------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Placement` | `Bottom`               | `Top Start` — see §7 #9      | `Top Start`, `Top`, `Top End`, `Bottom Start`, `Bottom`, `Bottom End`, `Left Start`, `Left`, `Left End`, `Right Start`, `Right`, `Right End` |
| `Arrow`     | `False`                | `False`                      | `False`, `True`                                                                                                                    |

**Intent column** documents the MUI runtime defaults (`placement="bottom"`, `arrow={false}` per `Tooltip.js:325`) — these are what designers should pick when matching MUI parity. **Figma actual column** documents what Figma's `defaultVariant` resolves to in practice; the `Placement` axis can't be re-defaulted via the Plugin API (`editComponentProperty` rejects `defaultValue` updates on VARIANT properties). See §7 #9 for the trade-off.

### 3.1 Component (non-variant) properties

| Property key | Type | Default     | Purpose                                                                                  |
| ------------ | ---- | ----------- | ---------------------------------------------------------------------------------------- |
| `Title`      | TEXT | `Tooltip`   | Tooltip body content. Hand-set Roboto Medium 11/16.5 px on the inner Title TEXT node. Long titles wrap at the `300 px` `max-width` on the Tooltip body's `WIDTH_AND_HEIGHT` autoresize text node. Designers override the value per-instance to type the actual tooltip copy. |

No `INSTANCE_SWAP` properties — Tooltip's only swappable surface is the underlying Popper / Transition / Tooltip / Arrow slots, which MUI exposes via `slots` (behavior-only, see §2). No `BOOLEAN` properties either — `Arrow` is a VARIANT not a BOOLEAN (per §2 reasoning).

## 4. Usage Guidelines

### 4.1 Picking a variant

1. **Pick the Placement** that matches the source `placement` prop. The 12 options reproduce Popper's full surface; the most common picks are `Bottom` (default), `Top` (when the anchor sits near a screen-bottom edge), `Right` / `Left` (for inline form-field hints).
2. **Pick the Arrow** — `False` is the canonical Material Tooltip; `True` matches MUI's `arrow` prop and is preferred when the tooltip's owning anchor is small (icons, badges) so the visual association is unambiguous.
3. **Override the `Title`** — type the actual tooltip text. Long titles wrap at `300 px` per MUI runtime; the Figma TEXT node uses `TEXT_AUTO_RESIZE = WIDTH_AND_HEIGHT` with a max-width of 284 px (300 px tooltip body − 16 px horizontal padding) so the wrap point matches.

### 4.2 When NOT to use

- ❌ Don't use Tooltip as a permanent label — Tooltips are dismissed on focus/hover-out. Use `<Chip>` (label / metadata) or `<Typography>` (inline copy) instead.
- ❌ Don't stack two Tooltips on the same anchor — MUI fires only one Popper per anchor, and the Figma component ships a single open instance per cell.
- ❌ Don't model "long-press touch" Tooltips with this component — MUI sets `ownerState.touch = true` via internal touch handlers, which renders a different padding / font (`8 16` / 14 px / regular weight). The Figma spec ships only the default-mode metrics; for touch mock-ups, build a one-off detached cell and document it next to the screen frame, not in this set.

### 4.3 Don'ts

- ❌ Don't detach the Tooltip instance to change its color — bind to a different token at the file level instead. There is currently no `Color` axis (§2.1); detaching breaks the source-sync contract.
- ❌ Don't paint a Tooltip with raw hex values. Both the body fill and the arrow fill must bind to `component/tooltip/fill`. The 0.92 vs 0.9 alpha delta from MUI runtime is absorbed into a single token (§7 #4).
- ❌ Don't apply node-level `opacity < 1` on a Tooltip cell. The `component/tooltip/fill` token already carries its alpha at `0xE5/0xFF ≈ 0.898`; pairing it with a `paint.opacity < 1` flattens the variable binding on instance creation.
- ❌ Don't add a drop shadow / elevation. MUI Tooltip is intentionally flat (`box-shadow: none` per source). If a future PR wants an elevated Tooltip, mint a new variant axis (`Elevation`) rather than overriding the existing cells.
- ❌ Don't try to model the popper-to-anchor margin (`14 px` no-arrow, `0` with-arrow) as part of the Tooltip cell's bounding box — the gap is owned by the consuming screen layout, not the Tooltip itself. The Figma cell renders only the Tooltip body (and Arrow when on); when designers compose a Tooltip on a screen, they hand-place the cell relative to the anchor.

## 5. Token Glossary

This section names every token consumed. No component-scoped `design-token.md` is required — the existing shared catalogue covers every binding the component emits.

### 5.1 Seed (themable)

None — Tooltip has no `Color` axis (§2.1). If a future PR adds themed Tooltips, this section enumerates the consumed seed families.

### 5.2 Alias / Seed

- `seed/neutral/white` — `#FFFFFF`. Tooltip body foreground (`color`). The local `merak` collection already ships this token (`VariableID:329:6515`); it's the same value MUI uses (`palette.common.white`) and is the canonical neutral-white binding across this library (`<Chip>` Avatar fg also reaches for `seed/neutral/white` per `Chip/figma.spec.md` §6.7). No raw-palette read is required.

### 5.3 Component-scoped (Tooltip)

- `component/tooltip/fill` — `#616161E5` (≈ `0.898 α`). The shared design-token catalogue (`figma-create-component/library-tokens.md` §1 "component/*") documents this token, but it is **not yet present in this file's local collection** — Step 5's pre-flight (2026-05-07) confirmed only Chip / Pagination / Table / NavMenu / Autocomplete / Button / Input have component-scoped tokens minted locally. The pipeline therefore mints `component/tooltip/fill` in the local `merak` collection (`VariableCollectionId:37:2603`) with `resolvedType: COLOR`, `scopes: ['FRAME_FILL', 'SHAPE_FILL']`, and value `r=97/255, g=97/255, b=97/255, a=0.898` before any cell is authored. Used as the **single** fill source for both the Tooltip body and the Arrow paint. Diverges from MUI runtime's `alpha(grey[700], 0.92)` body fill / `alpha(grey[700], 0.9)` arrow fill pair — see §7 #4.

No other Tooltip-scoped tokens are required. Re-using `component/tooltip/fill` for the arrow keeps the binding count at exactly one component-scoped color.

### 5.4 Effect / shape & elevation

- Corner radius — `4 px` on the Tooltip body (matches MUI `shape.borderRadius`). Not bound to a variable; baked into the auto-layout container. The shared `material-design` collection does not currently expose `shape.borderRadius` as a `FLOAT` variable bound to component metrics — minting one for a single component is rejected as over-specific (mirrors `<Chip>`'s `16 px` corner-radius decision in `Chip/figma.spec.md` §5.4).
- No drop shadow — MUI Tooltip is flat (`box-shadow: none`).

### 5.5 Typography

- Hand-set values matching MUI runtime — Roboto Medium, `fontSize: 11`, `lineHeight: { unit: 'PIXELS', value: 16.5 }`, `letterSpacing: 0%`. The MUI Library file currently has zero local text styles (sibling components like `<Button>` / `<Chip>` also hand-set typography), so Tooltip applies the values directly on the Title TEXT node rather than via `textStyleId`. If a future PR mints `material-design/components/tooltip` (Roboto Medium 11/16.5) as a local text style, switch the Title node to bind that style id and update §6.1.
- **Divergence from the design system's CJK-first typography** — the design system standardizes on Noto Sans TC for body / heading typography (`material-design/typography/*`). Tooltip uses Roboto to mirror MUI runtime exactly, which is the established convention in this library (`<Button>` / `<Chip>` also keep Roboto for the variant labels). See §7 #2.

## 6. Layout & Render Bindings

Tooltip's variant surface is small (24 cells) and entirely paint-stable across `Placement` (Placement only changes the arrow's attachment edge, not the body's fill / typography). The binding details below are presented inline rather than as a per-state Skeleton-B matrix.

### 6.1 Constants (every cell)

| Property                  | Value                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Auto Layout direction     | `HORIZONTAL`, `primaryAxisAlignItems: CENTER`, `counterAxisAlignItems: CENTER`                         |
| Width                     | `HUG` (Auto Layout `primaryAxisSizingMode: AUTO`); minimum is `8 + label-width + 8`; maximum is `300 px` |
| Sizing modes              | `primaryAxisSizingMode: AUTO`, `counterAxisSizingMode: AUTO`                                           |
| Outer height              | `HUG` — typically `~24.5 px` for one-line titles, grows with line wrap (max width 300 px → 3 lines × 16.5 px line-height + 8 px padding ≈ `57.5 px`) |
| Padding                   | `4 8 4 8`                                                                                              |
| Item spacing (gap)        | n/a — single TEXT child                                                                                |
| Corner radius             | `4 px`                                                                                                 |
| Body fill                 | bound to `component/tooltip/fill` (`#616161E5`)                                                        |
| Body stroke               | `none`                                                                                                 |
| Body effect               | `none` (no drop shadow)                                                                                |
| Title text style          | hand-set Roboto Medium `11 / 16.5 px`, `letterSpacing: 0%`, `text-align: left` (MUI doesn't center)    |
| Title text fill           | bound to `seed/neutral/white` (`#FFFFFF`)                                                              |
| Title `text-overflow`     | TEXT_AUTO_RESIZE = `WIDTH_AND_HEIGHT`, max-width `284 px` (300 − 16) — wraps to multi-line when content exceeds |

### 6.2 Arrow slot (when `Arrow=True`)

The Arrow is a 11 × 7.81 px (rounded to `11 × 8 px` on the Figma canvas — Figma can't render 0.81-px geometry) absolutely-positioned shape attached to the Tooltip body's edge per §6.3. The shape is a **rotated-square triangle** — author it as a 4-pt POLYGON (or as an 8 × 8 square rotated 45° with `overflow: hidden` on a clipping FRAME, mirroring MUI's `::before` trick). Either approach lands on the same visual.

| Property                  | Value                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Width × Height            | `11 × 8 px` (rounded from MUI's `1em × 0.71em` at 11 px font-size; visible triangle shows the half that pokes out of the body's edge) |
| Fill                      | bound to `component/tooltip/fill` (`#616161E5`) — **same token as the body** (single-token model; MUI runtime uses a 0.9 / 0.92 alpha pair that we collapse to ~0.9, see §7 #4) |
| Stroke                    | `none`                                                                                                 |
| Position                  | absolute on the Tooltip body, attached per §6.3                                                        |

### 6.3 Per-Placement arrow attachment

Arrow attaches to whichever edge of the Tooltip body **points at** the anchor. The cross-axis suffix (`-start`, no suffix, `-end`) shifts the arrow's parallel-axis position so the arrow's tip aligns with the anchor's leading / center / trailing edge.

| Placement       | Arrow edge | Arrow parallel-axis position (along its edge)                                                    |
| --------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `Top Start`     | bottom     | left-most — the arrow tip aligns with the **anchor's left edge** + a small inset                 |
| `Top`           | bottom     | center — the arrow tip is at the body's horizontal midpoint                                      |
| `Top End`       | bottom     | right-most — arrow tip aligns with anchor's right edge                                            |
| `Bottom Start`  | top        | left-most                                                                                        |
| `Bottom`        | top        | center                                                                                           |
| `Bottom End`    | top        | right-most                                                                                       |
| `Left Start`    | right      | top-most — arrow tip aligns with anchor's top edge                                                |
| `Left`          | right      | center                                                                                           |
| `Left End`      | right      | bottom-most                                                                                      |
| `Right Start`   | left       | top-most                                                                                         |
| `Right`         | left       | center                                                                                           |
| `Right End`     | left       | bottom-most                                                                                      |

The exact pixel offset for `-start` / `-end` is computed by Popper at runtime against the anchor's bounding box; the Figma cell freezes a representative offset (`8 px` from the body's leading / trailing edge, matching MUI's typical render against a 30–40 px anchor). Designers tweaking the offset on a screen mock should hand-place the cell, not detach.

### 6.4 No-arrow placement (`Arrow=False`)

When `Arrow=False`, no arrow shape exists. The 14 px popper-margin gap from §5.5 of `storybook.render.md` is **not** part of the Tooltip cell — designers compose the Tooltip + anchor in a screen frame with a 14 px spacing between them by hand. Modeling the gap inside the cell would push the cell's bounding box off-center relative to the body's content, breaking the cell's `HUG` autosize.

## 7. Documented divergences from MUI runtime

These are intentional trade-offs that this spec adopts; do **not** silently re-align them to MUI without ownership review. Every entry here ships in `storybook.render.md` §7 as a drift check too.

1. **Touch-mode metrics are not modeled** — MUI's `ownerState.touch = true` switches padding (`8 16`), font-size (14 px), font-weight (400), line-height (`round(16/14)em`), and popper margin (`24 px`). The Figma cell ships only the cursor-default mode. Designers needing a touch Tooltip clone the published cell and override per the §2 "touch mode" row of `storybook.render.md`. Modeling Touch as a third VARIANT axis would double the matrix to 48 cells for a use-case that mock-ups rarely exercise.
2. **Typography uses Roboto, not Noto Sans TC** — the design system's catalogue centres CJK typography on Noto Sans TC (`material-design/typography/*` and `material-design/components/chip`). Tooltip mirrors MUI runtime exactly (Roboto Medium 11 / 16.5) because (a) this library's other MUI re-exports keep Roboto for variant-label parity, and (b) Tooltip text is typically short (< 60 chars) and CJK fallback at 11 px doesn't require a CJK-tuned glyph. If a future PR introduces a CJK-first design-system override, mint `material-design/components/tooltip` (Noto Sans TC Regular 11/16) and re-bind the Title TEXT.
3. **No drop shadow** — Material's elevated-popper convention would normally apply `material-design/shadows/shadows-8` (Menus / Popovers) to a tooltip-sized element. MUI Tooltip explicitly opts out (`box-shadow: none`) so this spec follows. A future PR wanting an elevated Tooltip should add a new variant rather than override this default.
4. **Single `component/tooltip/fill` token absorbs MUI's body / arrow alpha pair** — MUI runtime emits `alpha(grey[700], 0.92)` for the Tooltip body fill (`#616161EB`) and `alpha(grey[700], 0.9)` for the arrow color (`#616161E5`). The 2 % alpha delta is barely perceptible and the design system pre-shipped a single `component/tooltip/fill = #616161E5` token (matching the arrow alpha). This spec uses that single token for **both** the body and the arrow paint. Resolving the divergence would mint a second `component/tooltip/body-fill = #616161EB` (0.92 α) and split the bindings; the design system's call is to keep the single token. Trade-off: the rendered Tooltip body is ~2 % more transparent than MUI runtime, which becomes visible only when the Tooltip overlays a saturated surface.
5. **Arrow geometry rounded from 11 × 7.81 px to 11 × 8 px** — MUI's runtime arrow is `1em × 0.71em` at the slot's font-size (11 px default), so `11 × 7.81 px`. Figma canvas snaps to integer pixels for clean handoff; the 0.19 px delta is invisible. If a future PR exposes the Tooltip slot's `font-size` as a prop (and rounds to a different em ratio), revisit.
6. **`-start` / `-end` arrow offsets are frozen, not Popper-computed** — Popper's runtime measures the anchor's bounding box and shifts the arrow along the parallel axis so its tip lands at the anchor's leading / center / trailing edge. The Figma cell freezes an 8 px inset from the Tooltip body's leading / trailing edge as a "representative" offset. When the screen-mock anchor is unusually wide / narrow, designers eyeball a hand-place adjustment.
7. **No `box-shadow` ring on focus** — Tooltip itself is never the focus target (the **anchor** receives focus and the Tooltip opens as a side-effect). MUI doesn't apply `Mui-focusVisible` to the Tooltip slot, and the Figma cell follows. A future a11y review wanting a tooltip-side focus ring would add a new state variant; until then, the Tooltip cell has no focus-visible delta.
8. **Body `max-width: 300 px` uses `WIDTH_AND_HEIGHT` autoresize** — MUI's runtime `max-width: 300px` creates an implicit wrap point that depends on text rendering (Roboto's per-character width). Figma's `WIDTH_AND_HEIGHT` autoresize text node honours a hard max-width, which produces near-identical wrap points but may shift by 1–2 chars across browsers / Figma versions. Acceptable.
9. **Figma `defaultVariant` is `Placement=Top Start, Arrow=False`, not the MUI default `Bottom`** — Figma's COMPONENT_SET picks the default variant by an internal rule (alphabetical-first variant property combination, not the first-created COMPONENT child). Plugin API calls (`editComponentProperty(...)`) explicitly reject `defaultValue` updates on VARIANT properties — the only escape hatch is to rename axes / variants so the desired default sorts first. The spec keeps the human-readable `Placement` axis values (`Top Start`, `Top`, `Top End`, `Bottom`, …) over a sortable encoding (`01-Bottom`, `02-Top Start`, …) because the human form matches MUI's prop strings 1:1. Designers dragging an instance onto a screen receive `Top Start` first; explicit Bottom selection is one click in the right panel. If a future PR adds a sortable prefix to the Placement values, mark this resolved.
10. **Title `letterSpacing` is hand-set to `0%`, not MUI's inherited `0.00938em`** — MUI's runtime Tooltip slot inherits `letter-spacing` from CssBaseline body styles (`typography.body1.letterSpacing = 0.00938em`). At 11 px font-size that resolves to `~0.103 px` — sub-pixel, visually indistinguishable from `0%`. The Figma TEXT node hand-sets `letterSpacing: 0%` because (a) Figma can't bind `letterSpacing` to inherited CssBaseline-derived values, and (b) the visible delta at 11 px is below the rendering threshold for both Roboto and Noto Sans CJK fallback. If a future PR introduces a `material-design/typography/tooltip` text style that itself encodes letter-spacing, switch the Title node to bind that style id and revisit this.
11. **Title `lineHeight` is hand-set to `16.5 px PIXELS`, not MUI's inherited `1.5` ratio** — MUI's runtime Tooltip slot does not declare its own `line-height`; it inherits `1.5` from CssBaseline `body1`, which resolves to `11 × 1.5 = 16.5 px` at the Tooltip's 11 px font-size. The numeric value matches the Figma cell exactly, but the source-of-truth differs (inherited ratio vs. hard-set pixels). If MUI later moves Tooltip to its own line-height (e.g. `1.43` per body2 to tighten the slot), the Figma cell needs to be re-derived (`11 × 1.43 = 15.73 px`). The hand-set pixel value is documented here so the spec sync rule (§8) can detect the mismatch even when the MUI default emits the same rendered height.

If a future PR closes any of these divergences, append a `Resolved YYYY-MM-DD` line to the affected entry rather than deleting it (see `figma-create-component` "Runtime-truth pass" guidance).

## 8. Source Sync Rule

This document and the source must move together. A change in any of the following files **forces** an update here and in `storybook.render.md`:

1. `src/stories/Tooltip.stories.tsx` — story file. New stories, removed args, or renamed exports update §2 / §3 / §4.1 in this spec.
2. `node_modules/@mui/material/Tooltip/Tooltip.js` — MUI source. A MUI minor/major bump that changes paddings, font-size, line-height, arrow geometry, or palette resolution updates §6 (Constants) and `storybook.render.md` §1–§5.
3. `package.json` (and `pnpm-lock.yaml` / `package-lock.json`) — pin of `@mui/material`. Bump §1's `Underlying MUI` row whenever the resolved version changes.
4. `.storybook/preview.tsx` — global theme decorator. If the project introduces a custom MUI theme override (palette / typography / shape / `cssVariables`), update §1, §5, §6 and re-derive `storybook.render.md` paint values. Specifically, turning on `theme.vars` (`createTheme({ cssVariables: true })`) changes the Tooltip body / arrow fill source from `alpha(grey[700], 0.92)` / `alpha(grey[700], 0.9)` to a single `vars.palette.Tooltip.bg` token, which alters the §7 #4 divergence resolution.
5. The published Figma `<Tooltip>` component set (file `KQjP6W9Uw1PN0iipwQHyYn`, frame `804:11975`) — once published, set the `figma_component_set_id` frontmatter and reflect any axis additions / component-property additions in §3.
6. The Merak variable collection (`material-design` + `merak` collections in this Figma file) — if a token is renamed, removed, or its `resolvedType` changes, update every reference in §5, §6.1, §6.2. **Token-value changes alone do not require a spec edit** — variables resolve by name.
7. `.claude/skills/figma-create-component/library-tokens.md` — the project token catalogue. If `component/tooltip/fill`'s alpha or hex changes, propagate to §5.3 + §6.1 + §6.2 and re-evaluate divergence #4 in §7.

Specifically:

- **A new MUI Tooltip prop with visual representation** (e.g. a future `color` or `size` prop) → add a row to §2, decide whether it gets a `VARIANT` / `BOOLEAN`, update §3, refresh §6, add color value mapping to §2.X if applicable.
- **Renamed token** (e.g. `component/tooltip/fill` → `component/tooltip/bg`) → grep §5.3 / §6.1 / §6.2 for the old name, update every reference, refresh `storybook.render.md` §5 if it referenced the alias chain.
- **Theme-override introduces a custom Tooltip palette** (e.g. `palette.Tooltip.bg = "#000"`) → §6 bindings stay (they're tokens, not hex), but `storybook.render.md` §1 / §5 needs new resolved-hex rows. Reconcile §7 #4 — if the theme provides a single bg token, the divergence may resolve.
- **MUI raises Tooltip default font-size to 12 px** → update §1 typography row, §6.1 Title row, divergence note in §7. Decide whether the 11 px stays (probably yes — design system's call); otherwise re-derive `storybook.render.md` typography values.
- **The shared `material-design/typography/*` adds `components/tooltip`** → switch the Title TEXT node to `textStyleId = "material-design/components/tooltip"`, update §5.6 and §6.1; mark §7 #2 resolved with date.
- **`component/tooltip/fill` is split into `body-fill` (0.92 α) + `arrow-fill` (0.9 α)** → update §5.3 + §6.1 + §6.2 to reference both tokens; mark §7 #4 resolved with date.
- **Touch mode becomes part of the Figma surface** (third VARIANT axis or instance-level toggle) → expand §3 axis tables, double the variant math to 48, fold in the §2 "touch mode" rules from `storybook.render.md`, mark §7 #1 resolved with date.

## 9. Quick Reference

### 9.1 Source TypeScript surface

```ts
// `src/stories/Tooltip.stories.tsx` re-exports MUI Tooltip directly.
// MUI TooltipProps (excerpt):
type TooltipProps = {
  arrow?: boolean;                    // → Figma VARIANT `Arrow`
  children: ReactElement;             // (anchor — story uses <Button> placeholder)
  describeChild?: boolean;            // (a11y-only)
  disableFocusListener?: boolean;     // (behavior-only)
  disableHoverListener?: boolean;     // (behavior-only)
  disableInteractive?: boolean;       // (behavior-only)
  disableTouchListener?: boolean;     // (behavior-only)
  enterDelay?: number;                // (behavior-only)
  enterNextDelay?: number;            // (behavior-only)
  enterTouchDelay?: number;           // (behavior-only)
  followCursor?: boolean;             // (behavior-only)
  id?: string;                        // (a11y-only)
  leaveDelay?: number;                // (behavior-only)
  leaveTouchDelay?: number;           // (behavior-only)
  onClose?: (event) => void;          // (behavior-only)
  onOpen?: (event) => void;           // (behavior-only)
  open?: boolean;                     // (behavior-only — Figma cell represents open=true)
  placement?:                         // → Figma VARIANT `Placement`
    | 'top'    | 'top-start'    | 'top-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left'   | 'left-start'   | 'left-end'
    | 'right'  | 'right-start'  | 'right-end';
  PopperComponent?: ElementType;      // (deprecated; behavior-only)
  PopperProps?: Partial<PopperProps>; // (deprecated; behavior-only)
  slots?: TooltipSlots;               // (designer-side overrides; not part of variant surface)
  slotProps?: TooltipSlotsAndSlotProps['slotProps']; // (same)
  sx?: SxProps<Theme>;                // (style-override; not modeled)
  title: ReactNode;                   // → Figma TEXT `Title`
  TransitionComponent?: ElementType;  // (deprecated; behavior-only)
  TransitionProps?: TransitionProps;  // (deprecated; behavior-only)
};
```

### 9.2 Figma component summary

```
Component: <Tooltip>
File:      KQjP6W9Uw1PN0iipwQHyYn (MUI Library)
Frame:     Tooltip / `<Tooltip>` (804:11975)

Variant axes (24 cells):
  Placement : Top Start | Top | Top End | Bottom Start | Bottom | Bottom End
            | Left Start | Left | Left End | Right Start | Right | Right End
  Arrow     : False | True

Component properties:
  Title  TEXT  default "Tooltip"  Hand-set Roboto Medium 11/16.5 px

Layout: root Auto Layout HORIZONTAL, height=HUG (~24.5 px for one-line),
        padding=4/8/4/8, corner radius=4, body fill bound to
        `component/tooltip/fill` (#616161E5).
        Arrow (when Arrow=True): 11 × 8 px shape, fill bound to the same
        `component/tooltip/fill`, attached to the body edge per §6.3.

Default variant (intent):  Placement=Bottom, Arrow=False (MUI runtime default)
Default variant (Figma):   Placement=Top Start, Arrow=False (Figma's defaultVariant
                           is internally derived; cannot be set via Plugin API — see §7 #9)
Local-only bindings: every paint resolves to this file's local collection.
```

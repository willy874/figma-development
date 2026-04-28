---
name: figma-component-dialog
description: Figma component specification for the `<Dialog>` family — design counterpart of MUI's `<Dialog>` / `<DialogTitle>` / `<DialogContent>` / `<DialogActions>` re-exported via `src/stories/Dialog.stories.tsx`. Documents the modal shell (`<Dialog>` 5 `Size` variants), slot components, source-to-Figma mapping, design tokens (light theme), divider behavior, action-row geometry, and source sync rules. For runtime measurements see `storybook.render.md`; for component-scoped tokens see `design-token.md` (only if minted).
parent_skill: figma-components
figma_file_key: KQjP6W9Uw1PN0iipwQHyYn
figma_node_id: '1:4772'
figma_component_set_id: '1:4772'
figma_dialog_title_component_id: '1:4768'
figma_dialog_content_component_set_id: '1:4761'
figma_dialog_actions_component_id: '1:4757'
figma_dialog_doc_frame_id: '1:4771'
figma_dialog_title_doc_frame_id: '1:4767'
figma_dialog_content_doc_frame_id: '1:4760'
figma_dialog_actions_doc_frame_id: '1:4756'
---

# `<Dialog>` Figma Component Specification

## 1. Overview

The `Dialog` family in Figma is the design counterpart of MUI's `Dialog` primitives, consumed in this package via `src/stories/Dialog.stories.tsx`. The package re-exports `@mui/material` directly — there is **no** project-side wrapper component (no `Dialog.tsx`). The story file demonstrates static composition of the four MUI symbols:

- `<Dialog>` — modal shell.
- `<DialogTitle>` — title slot.
- `<DialogContent>` — body slot, with a `dividers` boolean.
- `<DialogActions>` — actions slot.

`<DialogContentText>` (description body) is also referenced in §4.4; it has no dedicated Figma component because it renders inline inside `<DialogContent>` using the standard `body1` text style.

> **Terminology:** The Figma authoring target lives on the **MUI Library** Figma file (`KQjP6W9Uw1PN0iipwQHyYn`). The frames sit on a single page that already holds the four editable nodes pinned in the frontmatter. The Figma component sets and the MUI source both use the canonical names.

The Figma surface is split into four published nodes. Each node has two ids: the **doc frame** (the labeled wrapper visible on the page) and the actual **Component / Component Set** that lives inside it. The Component / Component Set is the published artifact that screens consume; the doc frame is documentation chrome only.

| `<Component>`           | Doc frame id    | Component id    | Kind          | Role                                                                                              |
| ----------------------- | --------------- | --------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| `<Dialog>`              | `1:4771`        | `1:4772`        | Component Set | Modal shell — background, radius, shadow; **5** `Size` variants (xs / sm / md / lg / xl).         |
| `<DialogTitle>`         | `1:4767`        | `1:4768`        | Component     | Title slot — no variant axis. Symbol size `444 × 68`.                                             |
| `<DialogContent>`       | `1:4760`        | `1:4761`        | Component Set | Body slot — **2** `Dividers` variants (`false` / `true`); cell ids `1:4762` (false) / `1:4764` (true). |
| `<DialogActions>`       | `1:4756`        | `1:4757`        | Component     | Actions slot — no variant axis; whole-row Slot. Symbol size `484 × 84`.                           |

A Storybook documentation matrix (`SizeMatrix`, `ActionCountMatrix`, `TitleWithCloseButton`) demonstrates the most common compositions; production screens compose modals the same way by nesting slot instances inside the `<Dialog>` shell's `slot` Slot.

| Aspect                 | Value                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Source story           | `src/stories/Dialog.stories.tsx`                                                                                                 |
| Underlying source      | `@mui/material` `Dialog` + `DialogTitle` + `DialogContent` + `DialogActions` (re-exported by this package; no project wrapper)   |
| Figma file             | `KQjP6W9Uw1PN0iipwQHyYn` (MUI Library)                                                                                           |
| Underlying MUI version | `@mui/material@^7.3.10` (per `package.json` peer-dep `>=7`, current pnpm-lock resolution `7.3.10`)                              |
| Title typography       | Roboto Medium 500, `20 / 32 px`, letter-spacing `0.15 px` — MUI `h6`                                                            |
| Body typography (default `<DialogContentText>`) | Roboto Regular 400, `16 / 24 px`, letter-spacing `0.15008 px` — MUI `body1`                                |
| Shell elevation        | `material-design/shadows/shadows-24` — design-system MD ramp's dialog tier (3-layer drop shadow, see §4.2)                       |
| Shell radius           | `theme.shape.borderRadius = 4` (`4 px`)                                                                                          |

**Local-only token bindings.** Per the project directive (also followed by `<Pagination>`, `<Button>`, `<TextField>`), every paint / stroke / effect / text style on the four Dialog nodes binds to the **MUI Library Figma file's local `merak` collection** (and locally-minted styles) — never to the published library copy. If the published library renames or removes a token, the local file does not break automatically; track the divergence in §8.

**Runtime-truth pass — 2026-04-29.** The four nodes were reconciled against MUI 7 runtime measurements (see [`./storybook.render.md`](./storybook.render.md)) on 2026-04-29. Reconciled in this pass:

- Shell shadow rebound from `material-design/shadows/shadows-8` (consumed-library) to the local published `material-design/shadows/shadows-24` — the design-system MD elevation ramp's dialog tier (matches `figma-design-guide/design-token.md` §4: "shadows-24 — dialogs").
- Shell `bg-default` fill rebound from consumed-library `VariableID:0ac39446.../742:2677` to local `VariableID:223:4180`.
- `<DialogContent Dividers=true>` border rebound from consumed-library `VariableID:900cc3a1.../742:2673` to local `VariableID:223:4183`; padding tightened from `20 / 24` to `16 / 24` (MUI 7 default).
- `<DialogActions>` flipped from VERTICAL `padding 16` `align-items: center` to HORIZONTAL `padding 8` `gap 8` `justify-content: flex-end`.

Items deferred (still open) live in §7.

## 2. Source-to-Figma Property Mapping

### 2.1 `<Dialog>` (shell) — re-exported `@mui/material/Dialog`

| MUI prop                            | Figma surface                                | Type    | Notes                                                                                                                                                |
| ----------------------------------- | -------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open: boolean`                     | —                                            | —       | Runtime-only; the Figma shell is always rendered as if open (no closed frame).                                                                       |
| `children: ReactNode`               | `slot` SLOT — native Figma Slot, shared across all 5 `Size` variants | SLOT    | Designers drop any content (`<DialogTitle>` / `<DialogContent>` / `<DialogActions>` instances are typical, but the Slot accepts arbitrary frames).   |
| `onClose?` / `onAfterClose?`        | —                                            | —       | Runtime handlers.                                                                                                                                    |
| `maxWidth: 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `Size`                          | VARIANT | Direct map — drives shell width. Default MUI value is `'sm'`; Figma default is `xs` to match the matrix-row order. See §2.1.1 for px values.         |
| `fullWidth: boolean`                | _(not represented)_                          | —       | Figma always renders at the `Size`-fixed width. If a project wrapper later exposes `fullWidth`, add a BOOLEAN property per §8.                       |
| `fullScreen: boolean`               | _(not represented)_                          | —       | Document full-screen modals as a screen-level composition if/when needed.                                                                            |
| `disableBackdropClick` / `disableEscapeKeyDown` | _(not represented)_              | —       | Behavior-only; no Figma variant. The story does not enable these — production callers decide per modal.                                              |
| `hideBackdrop` / `disablePortal` (story-side overrides) | —                        | —       | Used in the story to render shells inline for the matrix views — production callers leave them at their defaults.                                    |

#### 2.1.1 `Size` value mapping

The `Size` axis mirrors MUI `Dialog.maxWidth` and uses MUI's default pixel widths verbatim.

| Figma `Size` | Width (px) | Equivalent MUI `maxWidth` |
| ------------ | ---------- | ------------------------- |
| `xs`         | `444`      | `"xs"`                    |
| `sm`         | `600`      | `"sm"`                    |
| `md`         | `900`      | `"md"`                    |
| `lg`         | `1200`     | `"lg"`                    |
| `xl`         | `1536`     | `"xl"`                    |

> MUI defaults `Dialog.maxWidth` to `"sm"` when the prop is omitted. Story instances pick the `Size` variant that matches the design intent directly; if a project wrapper later defaults this differently, update §2.1.

### 2.2 `<DialogTitle>` — re-exported `@mui/material/DialogTitle`

| MUI prop              | Figma surface                      | Type | Notes                                                                                                                                                   |
| --------------------- | ---------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children: ReactNode` | `slot` SLOT inside the title frame | SLOT | Designer drops any content into the slot (typically a single h6 `Text`). The Slot replaces the previous raw text node so titles can hold custom markup. |
| native `'div'` props  | —                                  | —    | Forwarded to MUI; no design representation.                                                                                                             |

`<DialogTitle>` has **no variant axis** — titles render identically across dialog sizes and contexts.

### 2.3 `<DialogContent>` — re-exported `@mui/material/DialogContent`

| MUI prop              | Figma surface                           | Type    | Notes                                                                                                                                                                 |
| --------------------- | --------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children: ReactNode` | `slot` SLOT shared across both variants | SLOT    | Designers drop arbitrary content (forms, text, `<DialogContentText>`, etc.) into the slot. The Slot is one property shared between `Dividers=false` / `Dividers=true`. |
| `dividers?: boolean`  | `Dividers`                              | VARIANT | `false` (default) / `true`. When `true`, MUI draws a 1 px top + 1 px bottom border bound to `alias/colors/border-defalt` _(sic)_.                                       |
| native `'div'` props  | —                                       | —       | Forwarded to MUI; no design representation.                                                                                                                            |

### 2.4 `<DialogActions>` — re-exported `@mui/material/DialogActions`

| MUI prop                   | Figma surface           | Type | Notes                                                                                                                                                                                                                                                                                                |
| -------------------------- | ----------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children: ReactNode`      | `Slot` SLOT (whole row) | SLOT | A single whole-row native Slot. Designers drop 1–n `<Button>` instances (or any other content) into the slot. The horizontal Auto Layout, `8 px` gap, and right-alignment live on the parent frame — the slot inherits those rules, so dropped buttons automatically line up.                       |
| `disableSpacing?: boolean` | —                       | —    | Figma always shows the standard `8 px` inter-button gap. If a screen needs `disableSpacing`, detach the instance or document the override inline rather than adding a variant.                                                                                                                       |
| native `'div'` props       | —                       | —    | Forwarded to MUI; no design representation.                                                                                                                                                                                                                                                          |

`<DialogActions>` has **no variant axis** — it is a single Component (not a Component Set). The source imposes no cap on the child count; drop as many `<Button>` instances into the slot as the screen requires.

### 2.5 `<DialogContentText>` (description text — no dedicated Figma component)

`<DialogContentText>` is MUI's helper for descriptive paragraphs inside `<DialogContent>`. The package re-exports it, but it has **no dedicated Figma component** — designers render description text inline inside `<DialogContent>` using the project's `body1` text style. If recurring patterns emerge (e.g. a confirmation-dialog description style), add the component per §8.

| MUI prop                                      | Figma surface                       | Type | Notes                                                                                                                                                                                       |
| --------------------------------------------- | ----------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children: ReactNode`                         | Body1 text inside `<DialogContent>` | TEXT | Typed directly on a body1 text node. Apply `material-design/typography/body1`.                                                                                                              |
| `color?` (defaults to `text.secondary`)       | Text fill binding                   | —    | Default `text.secondary` → bind to `alias/colors/text-sub`. Pass `color="text.primary"` to bind to `alias/colors/text-default` instead.                                                     |
| `variant?` (defaults to `body1` in MUI 7)     | Text style                          | —    | **Default `body1` (16 / 24).** Earlier revisions of this spec assumed `body2` — that was wrong for MUI 7. To use `body2`, the caller must pass `variant="body2"` explicitly.                |

## 3. Variant Property Matrix

```
<Dialog>           : Size                 = 5       = 5 variants
<DialogTitle>      : —                    =         = 1 component (no axis)
<DialogContent>    : Dividers             = 2       = 2 variants
<DialogActions>    : —                    =         = 1 component (no axis)

Total published nodes: 4
Total variants across all four sets: 5 + 1 + 2 + 1 = 9
```

### 3.1 `<Dialog>` (shell)

| Property | Default value | Options                      |
| -------- | ------------- | ---------------------------- |
| `Size`   | `xs`          | `xs`, `sm`, `md`, `lg`, `xl` |

### 3.2 `<DialogContent>`

| Property   | Default value | Options         |
| ---------- | ------------- | --------------- |
| `Dividers` | `false`       | `false`, `true` |

### 3.3 `<DialogActions>`

`<DialogActions>` has **no variant axis** — it is a single Component. The source has no cap on the number of children; for 4+ action layouts, drop extra `<Button>` instances directly into the slot.

### 3.4 Component (non-variant) properties

| Component         | Property key | Type | Default | Purpose                                                                                    |
| ----------------- | ------------ | ---- | ------- | ------------------------------------------------------------------------------------------ |
| `<Dialog>`        | `slot`       | SLOT | empty   | Native Figma Slot covering the interior of the shell. Shared across all 5 `Size` variants. |
| `<DialogTitle>`   | `slot`       | SLOT | empty   | Native Figma Slot inside the title frame, replacing the former raw text node.              |
| `<DialogContent>` | `slot`       | SLOT | empty   | Native Figma Slot covering the body area. Shared across both `Dividers` variants.          |
| `<DialogActions>` | `Slot`       | SLOT | empty   | Native Figma Slot covering the whole actions row. Drop 1–n `<Button>` instances inside.    |

> **Slots everywhere.** All four sub-components expose their inner content via **native Figma Slots** — not Instance Swap. There is no separate "showcase composite"; every example modal in `src/stories/Dialog.stories.tsx` (and on screens) is assembled by dropping a `<Dialog>` shell and nesting slot instances inside.

## 4. Design Tokens

All paints, strokes, and effects on the four Dialog nodes **must** be bound to a Variable or published Style in the local `merak` collection. The hex / shadow literals below are reference resolutions of the **light** theme — do not paste them; bind to the token. Dark theme is resolved automatically through the same alias path.

### 4.1 Sizing

`<Dialog>` and its slots do not override MUI's default Dialog metrics; the Figma components therefore mirror MUI's defaults verbatim. Empty rows in the `<Dialog>` component set are drawn at a fixed **120 px** placeholder height — once content is dropped into the `slot`, the shell hugs its children vertically.

#### Shell (`<Dialog>`)

| `Size` | Width (px) | Empty placeholder height            | Corner radius | Elevation                            |
| ------ | ---------- | ----------------------------------- | ------------- | ------------------------------------ |
| `xs`   | `444`      | `120` (hugs content when populated) | `4`           | `material-design/shadows/shadows-24` |
| `sm`   | `600`      | `120` (hugs content when populated) | `4`           | `material-design/shadows/shadows-24` |
| `md`   | `900`      | `120` (hugs content when populated) | `4`           | `material-design/shadows/shadows-24` |
| `lg`   | `1200`     | `120` (hugs content when populated) | `4`           | `material-design/shadows/shadows-24` |
| `xl`   | `1536`     | `120` (hugs content when populated) | `4`           | `material-design/shadows/shadows-24` |

- Corner radius matches `theme.shape.borderRadius = 4`. Figma hard-codes `cornerRadius = 4` until a dedicated modal-radius token exists.
- Elevation binds to the published effect style **`material-design/shadows/shadows-24`** — the design system's MD elevation ramp dialog tier per `figma-design-guide/design-token.md` §4. Three-layer drop shadow: `0 11 15 -7 α0.02` + `0 24 38 3 α0.14` + `0 8 46 8 α0.12`. (The whole `shadows-1…24` ramp uses the same `α0.02 / 0.14 / 0.12` triplet — this is the design-system convention, **not** MUI's runtime `α0.2 / 0.14 / 0.12`. The visual softness is intentional and matches every other elevated surface — Card, Menu, Drawer — across the library.)
- Height hugs the stacked slots (title + content + actions) via vertical Auto Layout once the `slot` is populated.

#### Slots — runtime-aligned

| Slot              | Component symbol size                                          | Padding (T R B L)                                                                          | Item gap                  | Font size / line-height | Font family    | Weight  | Notes                                                                                                                                              |
| ----------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------- | ----------------------- | -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<DialogTitle>`   | `444 × 68`                                                     | `16 / 24 / 16 / 24`                                                                        | —                         | `20 / 32` (h6)          | Roboto         | Medium  | Once embedded in a shell, the row hugs its content. The 444 × 68 symbol size is the published `<DialogTitle>` cell at id `1:4768`.                  |
| `<DialogContent>` | `444 × 44` (`Dividers=false`) / `444 × 56` (`Dividers=true`)   | `0 / 24 / 20 / 24` (`Dividers=false`) ; `16 / 24 / 16 / 24` (`Dividers=true`)              | `8` (between text blocks) | `16 / 24` (body1)       | Roboto         | Regular | Width inherits from the shell. `Dividers=true` is taller because MUI re-introduces `16 px` top + bottom padding so text doesn't clip the strokes. |
| `<DialogActions>` | `484 × 84`                                                     | `8 / 8 / 8 / 8` (all sides)                                                                | `8`                       | inherits from `<Button>` | —             | —       | Once embedded in a shell, the row hugs its content. Horizontal Auto Layout, `justify-content: flex-end`. **Padding is `8`, not `16`.**             |

- Typography: Title uses `material-design/typography/h6` (Roboto Medium); body uses `material-design/typography/body1` (Roboto Regular). Both are published Figma text styles — apply via `textStyleId`, never ad-hoc.
- `<DialogContent>` top padding of `0` (when `Dividers=false`) is intentional: the title's bottom padding supplies the gap.
- For `Dividers=true`, the 1 px strokes sit **inside** the padding, and MUI switches the content padding from `0 24 20 24` to `16 24` so the text doesn't clip the divider — represent the same change in Figma.
- For `<DialogActions>`, the Figma frame uses **Auto Layout `gap = 8 px`**; MUI's runtime implementation uses sibling `margin-left: 8px`. The visual result is identical — see `storybook.render.md` §5.

### 4.2 Color & effect token bindings

| Figma paint slot                                             | Token binding                                       | Notes                                                                                                                                                                                                           |
| ------------------------------------------------------------ | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shell background (`<Dialog>`)                                | **`alias/colors/bg-default`**                       | `#ffffff` light / theme-resolved dark. Resolves to MUI `background.paper`.                                                                                                                                      |
| Shell shadow (`<Dialog>`)                                    | **`material-design/shadows/shadows-24`** _(effect)_ | Published effect style — design-system MD ramp dialog tier (3-layer composite: `0 11 15 -7 α0.02`, `0 24 38 3 α0.14`, `0 8 46 8 α0.12`). Note the L1 alpha is `0.02`, not MUI's runtime `0.2` — the whole `shadows-1…24` ramp uses the same `0.02 / 0.14 / 0.12` triplet. Do not recreate as a custom drop shadow.                                                                    |
| Title text (`<DialogTitle>`)                                 | **`alias/colors/text-default`**                     | 87% black. h6 typography.                                                                                                                                                                                       |
| Content text — default body inside `<DialogContent>`         | **`alias/colors/text-default`**                     | 87% black. body1 typography (when caller sets `color="text.primary"` on `<DialogContentText>`).                                                                                                                 |
| Content text — description (`<DialogContentText>` default)   | **`alias/colors/text-sub`**                         | 60% black. body1 typography. This is the MUI 7 default for `<DialogContentText>` when no `color` prop is passed.                                                                                                |
| Content divider (`<DialogContent Dividers=true>`)            | **`alias/colors/border-defalt`** _(sic)_            | Top + bottom 1 px strokes. `strokeAlign = INSIDE`. _Note: token name in the Figma variable collection is misspelled `border-defalt` (missing `u`) — bind to the name as published; see §8 for the rename path._ |
| Backdrop (MUI `Backdrop`)                                    | _(no catalogue token today — see §10.1 note)_       | `rgba(0, 0, 0, 0.5)` — runtime-only, not a child of the Figma component sets. Add a per-screen overlay rectangle bound to a future `alias/layout/mask-bg` once it ships; until then, document the backdrop inline with a raw paint in the screen mock and flag it for follow-up via §8. |

### 4.3 Slot-composition rules

MUI's `DialogTitle` + `DialogContent` + `DialogActions` exchange padding to avoid double-spacing. Mirror these rules in Figma exactly:

| Composition                                                         | Padding adjustment                                                                                          |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `<DialogTitle>` followed by `<DialogContent>`                       | `<DialogContent>` uses `padding-top: 0` (title's bottom padding supplies the gap).                          |
| `<DialogContent Dividers=true>` followed by `<DialogActions>`       | Divider below content is flush; actions sit at `padding: 8 px`.                                             |
| `<DialogContent Dividers=false>` followed by `<DialogActions>`      | Actions sit at `padding: 8 px`; no divider.                                                                 |
| `<DialogTitle>` directly followed by `<DialogActions>` (no content) | Only used for simple confirm dialogs — title keeps `16 / 24` padding, actions keep `8` padding.             |

### 4.4 Typography ramp summary

| Slot / role                                            | Figma text style                       | Family | Weight  | Size / LH | Letter-spacing |
| ------------------------------------------------------ | -------------------------------------- | ------ | ------- | --------- | -------------- |
| `<DialogTitle>` text                                   | `material-design/typography/h6`        | Roboto | Medium  | `20 / 32` | `0.15 px`      |
| `<DialogContentText>` (default)                        | `material-design/typography/body1`     | Roboto | Regular | `16 / 24` | `0.15008 px`   |
| `<Button>` label inside actions                        | `material-design/typography/button-medium` (per `<Button>` spec) | Roboto | Medium  | `14 / 24` | `0.4 px` (`textCase: UPPER`) |

## 5. Icons

`<Dialog>` and its slots do **not** render icons directly. Icons appear only:

- Through child `<Button>` instances inside `<DialogActions>` (for destructive or confirming CTAs) — see [`../Button/figma.spec.md`](../Button/figma.spec.md) §5 for the icon contract those instances honor.
- Optionally inside `<DialogTitle>` via a top-right close affordance — see the `TitleWithCloseButton` story. Currently the Figma `<DialogTitle>` has no dedicated `Close Button` BOOLEAN; designers add it per-screen by dropping an `<IconButton>` next to the title text inside the title's Slot. If recurring patterns emerge, extend the title component per §8.

## 6. Layout

### 6.1 Shell component set layout

`<Dialog>` (`1:4771`) is laid out as **5 vertically stacked rows**, one per `Size`, each at the placeholder 120 px height:

| Row | `Size` | Width | Left x (px) | Top y (px) |
| --- | ------ | ----- | ----------- | ---------- |
| 1   | `xs`   | 444   | 20          | 20         |
| 2   | `sm`   | 600   | 20          | 160        |
| 3   | `md`   | 900   | 20          | 300        |
| 4   | `lg`   | 1200  | 20          | 440        |
| 5   | `xl`   | 1536  | 20          | 580        |

Row pitch is `120 (row height) + 20 (gap) = 140 px`. Each row is an empty shell (`<Paper>` + internal slot frame) — designers compose the modal by nesting `<DialogTitle>` / `<DialogContent>` / `<DialogActions>` inside the `slot` child.

### 6.2 Composing a modal on a screen

```
<Dialog Size={xs | sm | md | lg | xl}>
  <DialogTitle>                                  ← optional
  <DialogContent Dividers={false | true}>        ← optional
    … arbitrary form / description content …
  <DialogActions>                                ← optional, usually present
```

- Outer shell uses **vertical Auto Layout**, `align-items: stretch`, `gap: 0` (slots contribute their own padding).
- Shell hugs its contents vertically; width is fixed by the `Size` variant.
- Backdrop is a separate full-screen rectangle placed **behind** the shell at `α = 0.5` black. Not part of the component set — add it per-screen when mocking. The catalogue does not yet ship a `mask-bg` alias; track the gap in §8 (mint `alias/layout/mask-bg` upstream, then rebind).

### 6.3 Story documentation matrix

`src/stories/Dialog.stories.tsx` provides three matrix stories that double as the "use case" reference:

- **`SizeMatrix`** — one example per Size (`xs / sm / md / lg / xl`), each composed of `<Dialog>` + `<DialogTitle>` + `<DialogContent>` + 2-button actions row.
- **`ActionCountMatrix`** — seven examples exercising the most common shapes:
  1. **Acknowledge** (`xs`, 1 button — `OK`).
  2. **Confirm** (`xs`, Cancel + Primary — canonical two-button shape).
  3. **Destructive confirm** (`xs`, Cancel + Danger — irreversible actions).
  4. **Three-button footer** (`xs`, Tertiary + Cancel + Primary — `Save as draft / Discard / Publish`, tertiary left of cancel).
  5. **Title-only confirmation** (`xs`, no `<DialogContent>` — content-free composition).
  6. **Scrollable content** (`xs`, `Dividers=true` — long body).
  7. **Form dialog** (`sm`, 2 buttons — `Invite member` form-style example).
- **`ContentDividersFalse` / `ContentDividersTrue`** — side-by-side comparison of the `Dividers` axis.
- **`TitleWithCloseButton`** — documents the per-screen close-affordance pattern (no dedicated component yet).

These stories are **documentation-only assemblies** — they are not Figma components and cannot be instanced. They are reference compositions for screen authors when picking Size / Dividers / action count combinations.

## 7. Open / resolved issues (Figma ↔ runtime)

The **2026-04-29 runtime-truth pass** reconciled the four nodes against Chrome DevTools MCP measurements of `src/stories/Dialog.stories.tsx`. Items resolved in that pass moved to the §7.2 history; items still open live in §7.1.

### 7.1 Currently open

1. **Title font family — Roboto, not Noto Sans TC.** Runtime `Roboto Medium 500 / 20 / 32 / 0.15 px`. The catalogue's `material-design/typography/h6` text style is published as `Noto Sans TC Medium`. The four Dialog Slots are empty so no text style is applied at the Figma node level today; the gap will surface as soon as a designer drops a `<DialogTitle>` text into the slot. **Resolution path:** either align the project's published `h6` text style to Roboto, or document the Noto-Sans-TC override at the consumption site. Defer until a project-wide typography decision is made.
2. **Title letter-spacing — `0.15 px`, not `0`.** Runtime resolves `theme.typography.h6.letterSpacing = 0.0075em × 20 px = 0.15 px`. The catalogue's `h6` text style ships at `letterSpacing = 0%`. Same gap as item 1 — surfaces only when designers type into the title slot. **Resolution path:** update the published `h6` text style.
3. **Description typography — `body1`, not `body2`.** Runtime `<DialogContentText>` defaults to `body1` (16 / 24 / 0.15008). Earlier spec quoted `body2`. The catalogue's `body1` text style is published as Noto Sans TC Regular 16/24 — geometry matches MUI's `body1` but family stays Noto Sans TC. **Resolution path:** designers dropping description text into `<DialogContent>` should apply `material-design/typography/body1`; revisit if the project unifies on Roboto.
4. **Backdrop is runtime-only (no Figma node).** Backdrop is documented as a per-screen overlay (§4.2) and not part of the component set. The catalogue does not yet ship `alias/layout/mask-bg`; until then, document the backdrop with a raw paint in screen mocks. Tracked in §8 as a follow-up.
5. **`<Dialog Size=lg | xl>` viewport clamping.** Runtime `lg` / `xl` shells render at the viewport width when the viewport is narrower than the spec'd `max-width` (e.g. `lg` clamps to 1168 px in a 1168-wide iframe). Figma authors the canonical `1200 / 1536` widths; the runtime clamp is an expected artefact, not a Figma value to encode. Documented as a no-op divergence.

### 7.2 Resolved in the 2026-04-29 runtime-truth pass

1. ~~**`<DialogContent Dividers=true>` padding — `16 / 24`, not `20 / 24`.**~~ **Resolved 2026-04-29.** Cell `1:4764` re-authored to `paddingTop = paddingBottom = 16`. Symbol size now `444 × 56` (was `444 × 64`).
2. ~~**`<DialogActions>` padding — `8 px` all sides, not `16 px`.**~~ **Resolved 2026-04-29.** Component `1:4757` re-authored: `layoutMode = HORIZONTAL`, `padding = 8`, `itemSpacing = 8`, `primaryAxisAlignItems = MAX (flex-end)`, `counterAxisAlignItems = CENTER`. Slot child set to FILL both axes. Symbol size remains `484 × 84` (slot `468 × 68` + 8 padding).
3. ~~**Shell elevation — `shadows[24]`, not `shadows[8]`.**~~ **Resolved 2026-04-29.** Re-bound to the file's published `material-design/shadows/shadows-24` effect style (3-layer composite: `0 11 15 -7 α0.02`, `0 24 38 3 α0.14`, `0 8 46 8 α0.12` — the design-system MD ramp dialog tier, not MUI's runtime alpha values) and applied to all 5 Size cells.
4. ~~**Local-only fill on shell — `bg-default` was bound to a consumed-library copy.**~~ **Resolved 2026-04-29.** All 5 shell cells re-bound to local `merak/alias/colors/bg-default` (`VariableID:223:4180`).
5. ~~**Local-only stroke on `<DialogContent Dividers=true>` — `border-defalt` was bound to a consumed-library copy.**~~ **Resolved 2026-04-29.** Cell `1:4764` re-bound to local `merak/alias/colors/border-defalt` (`VariableID:223:4183`) at α 0.12.

## 8. Source Sync Rule

This document and the source must move together. When **any** of the following changes, update this spec **and** the named files in the same PR:

| Trigger                                                                                         | Files to update                                                                                                           |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `node_modules/@mui/material/Dialog/Dialog.js` (or `DialogTitle.js` / `DialogContent.js` / `DialogActions.js` / `DialogContentText.js`) changes (MUI bump) | `figma.spec.md` §1 MUI version row, `storybook.render.md` §1–§5 + §6                                                     |
| `src/stories/Dialog.stories.tsx` adds/removes a Size variant or composition pattern             | `figma.spec.md` §3.1 + §6.3, `storybook.render.md` §1.1                                                                   |
| `src/stories/Dialog.stories.tsx` introduces a project wrapper (e.g. `Dialog.tsx` defaulting `disableBackdropClick=true`) | `figma.spec.md` §1 (terminology), §2.1 (props), §3 if new axes/booleans, §4 if new tokens; `storybook.render.md` re-probe |
| Figma shell set `1:4771` variant axes / cell count change                                       | `figma.spec.md` §3.1 + §6.1, re-run `figma-component-upload` to refresh the snapshot                                       |
| Figma `<DialogTitle>` (`1:4767`) gains a `Close Button` BOOLEAN (or any property)               | `figma.spec.md` §2.2, §3.4, §5; add the supporting token if any                                                            |
| Figma `<DialogContent>` set (`1:4760`) variant axes / cell count change                         | `figma.spec.md` §3.2 + §4.1 + §4.2 (border binding)                                                                        |
| Figma `<DialogActions>` (`1:4756`) gains a variant axis (e.g. `Layout=Compact \| Standard`)     | `figma.spec.md` §2.4, §3.3, §3.4                                                                                           |
| Local `merak/*` tokens used by Dialog are renamed in this Figma file                            | `figma.spec.md` §4.2 + §4.4. **Do not** auto-pull from the published library — Dialog cells bind to the local collection only. |
| Published library `seed/*` / `alias/*` tokens drift from the local copies                       | `./design-token.md` (record divergence; create the file if it doesn't exist), `figma.spec.md` §1 local-only note. Re-sync values manually if needed. |
| `material-design/shadows/shadows-24` is renamed or removed from the local effect-style collection | `figma.spec.md` §4.1 + §4.2 + §7.6, `./design-token.md` if a Dialog-scoped replacement is minted                          |
| Project introduces a `Dialog.tsx` wrapper that defaults `disableBackdropClick=true` (or other behavior) | `figma.spec.md` §1, §2.1; add a §7 callout with an updated `disableBackdropClick` default; mirror in any Dialog usage docs |
| MUI 7 `<DialogContentText>` default variant changes (e.g. back to `body2`)                      | `figma.spec.md` §1, §2.5, §4.4, §7.3; `storybook.render.md` §4 re-probe                                                   |
| `alias/layout/mask-bg` is minted in the local `merak` collection (currently absent)             | `figma.spec.md` §4.2 (rebind), §6.2 (rebind), §10.1 (drop "(not yet in catalogue)"), `figma-design-guide/design-token.md` (add to alias table) |

## 9. Quick Reference

```ts
// Re-exported MUI props (no project wrapper today):
//   Dialog        — open, children, maxWidth ('xs'|'sm'|'md'|'lg'|'xl'), fullWidth, fullScreen,
//                   onClose, onAfterClose (transition slot), hideBackdrop, disablePortal, …
//   DialogTitle   — children, native div props
//   DialogContent — children, dividers (boolean)
//   DialogActions — children, disableSpacing
//   DialogContentText — children, color (default text.secondary), variant (default body1 in MUI 7)
```

```
Figma file: KQjP6W9Uw1PN0iipwQHyYn (MUI Library), page "Foundation Components"

<Dialog>  doc frame 1:4771 — component set 1:4772
  Variant axes : Size
  Options      : xs | sm | md | lg | xl
  Default      : xs (444 px)
  Slot props   : slot (SLOT, shared across all 5 variants)
  Total        : 5 variants
  Empty height : 120 px placeholder; hugs content once slot is populated

<DialogTitle>  doc frame 1:4767 — component 1:4768
  Variant axes : (none)
  Slot props   : slot (SLOT)
  Symbol size  : 444 × 68

<DialogContent>  doc frame 1:4760 — component set 1:4761
  Variant axes : Dividers
  Options      : false | true
  Default      : false
  Slot props   : slot (SLOT, shared across both variants)
  Symbol size  : 444 × 44 (Dividers=false, cell 1:4762)
                 444 × 56 (Dividers=true, cell 1:4764 — padding 16/24/16/24, top + bottom strokes)
  Total        : 2 variants

<DialogActions>  doc frame 1:4756 — component 1:4757
  Variant axes : (none)
  Slot props   : Slot (SLOT, whole row)
  Symbol size  : 484 × 84 (padding 8 + slot 468 × 68)
  Default      : empty — drop 1–n <Button> instances inside
```

## 10. Token Glossary

The complete set of Merak design tokens consumed by `<Dialog>`. Names below are **Figma variable / style paths** in the local `merak` collection. Bind every Figma paint / stroke / effect / text style to one of these — never to a literal value.

### 10.1 Alias tokens (`alias/*`)

| Token                        | Used by                                                | Role                                                                                 |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `alias/colors/bg-default`    | `<Dialog>` shell background                            | `#ffffff` light / theme-resolved dark — MUI `background.paper`.                      |
| `alias/colors/text-default`  | `<DialogTitle>` text; `<DialogContent>` text (when caller passes `color="text.primary"`) | 87 % black.                                                       |
| `alias/colors/text-sub`      | `<DialogContentText>` default text fill                | 60 % black — MUI's `text.secondary`.                                                 |
| `alias/colors/text-disabled` | Disabled body content (rare; usually inherited from caller's component) | 38 % black.                                                          |
| `alias/colors/border-defalt` _(sic)_ | `<DialogContent Dividers=true>` top + bottom borders | 1 px strokes around the content region. Preserve the typo as published — see `figma-design-guide`.    |

### 10.2 Effect / shadow tokens

| Token                                | Used by          | Role                                                                                                                                                            |
| ------------------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `material-design/shadows/shadows-24` | `<Dialog>` shell | Composite drop shadow — design-system MD elevation ramp's dialog tier. Three layers: `0 11 15 -7 α0.02` + `0 24 38 3 α0.14` + `0 8 46 8 α0.12`. Apply as a published effect style; do **not** rebuild as a custom drop shadow. |

### 10.3 Shape & elevation

- Corner radius: `theme.shape.borderRadius = 4`. Figma hard-codes `cornerRadius = 4` until a dedicated modal-radius token exists.
- Elevation: `material-design/shadows/shadows-24` — design-system MD ramp dialog tier; all five `Size` variants share the same effect style.
- Backdrop opacity: `0.5` hard-coded in MUI; bind via a future `alias/layout/mask-bg` once the alias is minted in `figma-design-guide` (currently absent — see §7.1 #4 and §8). Until then, use a raw paint on the per-screen overlay and flag for follow-up.

### 10.4 Typography

`<Dialog>` and its slots do not override MUI typography. Resolved values come from `theme.typography` and are exposed as published Figma text styles:

- **Title** — `material-design/typography/h6`:
  - Family: `Roboto, Helvetica, Arial, sans-serif`
  - Weight: `Medium (500)`
  - Size / line-height: `20 / 32`
  - Letter-spacing: `0.15 px` (`0.0075em` × 20 px)
- **Description body** — `material-design/typography/body1` (default `<DialogContentText>` variant):
  - Family: `Roboto, Helvetica, Arial, sans-serif`
  - Weight: `Regular (400)`
  - Size / line-height: `16 / 24`
  - Letter-spacing: `0.15008 px` (`0.00938em` × 16 px)
- **Button label inside actions** — `material-design/typography/button-medium`:
  - Family: `Roboto`
  - Weight: `Medium (500)`
  - Size / line-height: `14 / 24`
  - Letter-spacing: `0.4 px`
  - `textCase: UPPER`

If the project later introduces modal-specific typography tokens (e.g. `material-design/typography/dialog-title-*`), bind via `textStyleId` and update §4.4 + §10.4.

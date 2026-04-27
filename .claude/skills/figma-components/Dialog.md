---
name: figma-component-modal
description: Figma component specification for `<Dialog>` — the design counterpart of `apps/console/src/components/Dialog/*`. Documents the modal shell (`<Dialog>` Size variants), slot components (`<DialogTitle>`, `<DialogContent>`, `<DialogActions>`), source-to-Figma mapping, design tokens, dividers / action-count behavior, and source sync rules.
parent_skill: figma-components
---

# `<Dialog>` Figma Component Specification

## 1. Overview

The `Dialog` family in Figma is the design counterpart of the `Dialog` foundation package in `apps/console/src/components/Dialog/`. The source is a family of thin wrappers around MUI's Dialog primitives — `<Dialog>`, `<DialogTitle>`, `<DialogContent>`, `<DialogActions>`, `<DialogContentText>` — that:

- Inject a shared `DialogContext` which wires **`aria-labelledby`** and **`aria-describedby`** between `Dialog` / `DialogTitle` / `DialogDescription` via `useId()`.
- Default **`disableBackdropClick = true`** and **`disableEscapeKeyDown` follows the same flag**, so modals are dismissed only through explicit actions unless the caller opts out.
- Expose **`onAfterClose`** by wiring MUI's `slotProps.transition.onExited` (so cleanup runs after the exit animation finishes, not when `open` flips).
- Expose a **`meta`** escape hatch for passing arbitrary state through the context (`useDialogMeta<T>()`) so nested title/content/actions can read request-scoped data without prop drilling.

> **Terminology:** The Figma **page** is named **Dialog**. The Figma **component sets** and the React **source** both use the MUI-aligned names — `<Dialog>` (shell), `<DialogTitle>`, `<DialogContent>`, `<DialogActions>`, `<DialogDescription>`. The Figma `<Dialog>` component set is the modal shell with 5 `Size` variants — a 1:1 counterpart of the React `<Dialog>` symbol in `apps/console/src/components/Dialog/Dialog.tsx`. Earlier revisions of this spec split the shell into `<DialogRoot>` and a separate showcase composite `<Dialog>`; that split has been removed to match the actual Figma file.

The Figma surface is split into four nodes that together cover the source:

| Figma node              | Kind          | Role                                                                                              |
| ----------------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| Top-level `Dialog` page | Frame         | Page / documentation container                                                                    |
| `<Dialog>`              | Component Set | Modal shell — background, radius, shadow; 5 `Size` variants. 1:1 counterpart of React `<Dialog>`. |
| `<DialogTitle>`         | Component     | Title slot — no variant axis                                                                      |
| `<DialogContent>`       | Component Set | Content slot — 2 `Dividers` variants                                                              |
| `<DialogActions>`       | Component     | Actions slot — no variant axis; whole-row Slot                                                    |

A `UseCase` frame on the same page hosts hand-assembled example modals (Sizes, Content Dividers, Common usage) by nesting instances of the slot components inside an empty `<Dialog>` shell. The use-case examples are documentation-only; production screens compose modals the same way.

| Aspect                 | Value                                                  |
| ---------------------- | ------------------------------------------------------ |
| Source directory       | `apps/console/src/components/Dialog/`                  |
| Figma frame            | `Dialog`                                               |
| Underlying MUI version | `@mui/material@5+`                                     |
| Title typography       | Noto Sans TC Medium, `20 / 32 px` — MUI `h6`           |
| Body typography        | Roboto Regular, `14 / 20 px` — MUI `body2`             |
| Shell elevation        | MUI `shadows[8]` (`material-design/shadows/shadows-8`) |
| Shell radius           | `theme.shape.borderRadius = 4`                         |

## 2. Source-to-Figma Property Mapping

### 2.1 `<Dialog>` (shell) — `apps/console/src/components/Dialog/Dialog.tsx`

| Source prop                                      | Figma surface                                                  | Type    | Notes                                                                                                                                                                                                                                    |
| ------------------------------------------------ | -------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open: boolean`                                  | —                                                              | —       | Runtime-only; Figma shell is always in "open" state (there is no closed frame to document).                                                                                                                                              |
| `children: ReactNode`                            | `slot` SLOT — native Figma Slot spanning all 5 `Size` variants | SLOT    | The shell exposes a single native Slot (not an Instance Swap). Designers drop any content into the slot — typically `<DialogTitle>` / `<DialogContent>` / `<DialogActions>` instances, but the slot accepts arbitrary frames/components. |
| `onClose?: () => void`                           | —                                                              | —       | Behavior-only, no design representation.                                                                                                                                                                                                 |
| `onAfterClose?: () => void`                      | —                                                              | —       | Wired through MUI's transition `onExited`; behavior-only.                                                                                                                                                                                |
| `disableBackdropClick?: bool` _(default `true`)_ | —                                                              | —       | Documented in the page copy as a callout. No Figma variant — Merak modals are non-dismissable by default.                                                                                                                                |
| `meta?: unknown`                                 | —                                                              | —       | Context pass-through consumed via `useDialogMeta<T>()`. No design representation.                                                                                                                                                        |
| _(implicit MUI prop)_ `maxWidth`                 | `Size`                                                         | VARIANT | Axis drives the shell's fixed width. See §2.1.1 for exact pixel mapping.                                                                                                                                                                 |
| _(not exposed by wrapper)_ `fullWidth`           | —                                                              | —       | The Figma shell always renders at its `Size`'s fixed width. If the source later exposes `fullWidth`, add a corresponding boolean property per §8.                                                                                        |
| _(not exposed by wrapper)_ `fullScreen`          | —                                                              | —       | Not represented in the component set. Document full-screen modals as a separate screen-level composition if/when needed.                                                                                                                 |

#### 2.1.1 `Size` value mapping

The `Size` axis mirrors MUI `Dialog.maxWidth` and uses MUI's default pixel widths verbatim.

| Figma `Size` | Width (px) | Equivalent MUI `maxWidth` |
| ------------ | ---------- | ------------------------- |
| `xs`         | `444`      | `"xs"`                    |
| `sm`         | `600`      | `"sm"`                    |
| `md`         | `900`      | `"md"`                    |
| `lg`         | `1200`     | `"lg"`                    |
| `xl`         | `1536`     | `"xl"`                    |

> MUI defaults `Dialog.maxWidth` to `"sm"` when the prop is omitted. Until `Dialog.tsx` exposes a typed `size` / `maxWidth` prop, screen instances should pick the `Size` variant that matches the design intent directly (see §8 Sync Rule for the source-extension path).

### 2.2 `<DialogTitle>` — `apps/console/src/components/Dialog/DialogTitle.tsx`

| Source prop                  | Figma surface                      | Type | Notes                                                                                                                                                                           |
| ---------------------------- | ---------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children: ReactNode`        | `slot` SLOT inside the title frame | SLOT | Designer drops any content into the slot (typically an h6 `<Typography>`). The slot replaces the previous raw text node so the title can hold custom markup (e.g. icon + text). |
| _(DOM)_ native `'div'` props | —                                  | —    | Forwarded to MUI; no design representation.                                                                                                                                     |
| _(DOM)_ `id`                 | Set at runtime to `useId()` value  | —    | Wired by `Dialog.tsx` via `DialogContext.ariaLabelledby`. Behavior-only.                                                                                                        |

`<DialogTitle>` has **no variant axis** — Merak titles render identically across dialog sizes and contexts.

### 2.3 `<DialogContent>` — `apps/console/src/components/Dialog/DialogContent.tsx`

| Source prop                  | Figma surface                           | Type    | Notes                                                                                                                                                                             |
| ---------------------------- | --------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children: ReactNode`        | `slot` SLOT shared across both variants | SLOT    | Designers drop arbitrary content (forms, text, `<DialogDescription>`, etc.) into the slot. The slot is one property shared between `Dividers=false` and `Dividers=true` variants. |
| `dividers?: boolean`         | `Dividers`                              | VARIANT | `false` (default) / `true`. When `true`, MUI draws a 1 px top + 1 px bottom border bound to `alias/colors/border-defalt`.                                                         |
| _(DOM)_ native `'div'` props | —                                       | —       | Forwarded to MUI; no design representation.                                                                                                                                       |

### 2.4 `<DialogActions>` — `apps/console/src/components/Dialog/DialogActions.tsx`

| Source prop                  | Figma surface           | Type | Notes                                                                                                                                                                                                                                                                                                |
| ---------------------------- | ----------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children: ReactNode`        | `Slot` SLOT (whole-row) | SLOT | A single whole-row native Slot covering the actions row. Designers drop 1–n `<Button>` instances (or any other content) into the slot. The horizontal auto-layout, 8 px gap, and right-alignment live on the parent frame — the slot inherits those rules, so dropped buttons automatically line up. |
| `disableSpacing?: boolean`   | —                       | —    | Figma always shows the standard `8 px` gap (MUI default). If a screen needs `disableSpacing`, detach the instance or document the override inline rather than adding a variant.                                                                                                                      |
| _(DOM)_ native `'div'` props | —                       | —    | Forwarded to MUI; no design representation.                                                                                                                                                                                                                                                          |

`<DialogActions>` has **no variant axis** — it is a single Component (not a Component Set). The source imposes no cap on the child count; drop as many `<Button>` instances into the slot as the screen requires.

### 2.5 `<DialogDescription>` — `apps/console/src/components/Dialog/DialogDescription.tsx`

`<DialogDescription>` is a thin wrapper around MUI `<DialogContentText>` that wires `aria-describedby` through `DialogContext`.

It has **no dedicated Figma component** — designers render description text inline inside `<DialogContent>` using body2 typography. If recurring patterns emerge (e.g. a confirmation-dialog description style) the component should be added per §8.

| Source prop                                   | Figma surface                       | Type | Notes                                                                     |
| --------------------------------------------- | ----------------------------------- | ---- | ------------------------------------------------------------------------- |
| `children: ReactNode`                         | Body2 text inside `<DialogContent>` | TEXT | Typed directly on a `<Typography variant="body2">` node.                  |
| `color?: DialogContentTextProps['color']`     | Text fill binding                   | —    | Default `text/secondary` → bind to `alias/colors/text-sub`.               |
| `variant?: DialogContentTextProps['variant']` | Text style                          | —    | Default `body2`.                                                          |
| _(DOM)_ `id`                                  | Set at runtime to `useId()`         | —    | Wired by `Dialog.tsx` via `DialogContext.ariaDescribedby`. Behavior-only. |

## 3. Variant Property Matrix

```
<Dialog>           : Size                 = 5       = 5 variants
<DialogTitle>      : —                    =         = 1 component (no axis)
<DialogContent>    : Dividers             = 2       = 2 variants
<DialogActions>    : —                    =         = 1 component (no axis)
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

`<DialogActions>` has **no variant axis** — it is a single Component. Source has no cap on the number of children; for 4+ action layouts, drop extra `<Button>` instances directly into the slot.

### 3.4 Component (non-variant) properties

| Component         | Property key | Type | Default | Purpose                                                                                    |
| ----------------- | ------------ | ---- | ------- | ------------------------------------------------------------------------------------------ |
| `<Dialog>`        | `slot`       | SLOT | empty   | Native Figma Slot covering the interior of the shell. Shared across all 5 `Size` variants. |
| `<DialogTitle>`   | `slot`       | SLOT | empty   | Native Figma Slot inside the title frame, replacing the former raw text node.              |
| `<DialogContent>` | `slot`       | SLOT | empty   | Native Figma Slot covering the body area. Shared across both `Dividers` variants.          |
| `<DialogActions>` | `Slot`       | SLOT | empty   | Native Figma Slot covering the whole actions row. Drop 1–n `<Button>` instances inside.    |

> **Slots everywhere.** All four sub-components (`<Dialog>`, `<DialogTitle>`, `<DialogContent>`, `<DialogActions>`) expose their inner content via **native Figma Slots** — not Instance Swap. There is no separate "showcase composite"; every example modal (including those in the `UseCase` documentation frame) is assembled by dropping a `<Dialog>` shell and nesting slot instances inside.

## 4. Design Tokens

All surfaces, borders, and text are bound to Merak design tokens declared in:

- `apps/console/src/themes/seed.css` — `--merak-seed-{family}-{token}` (palette + elevations)
- `apps/console/src/themes/alias.css` — `--merak-alias-{group}-{token}` (semantic, color-agnostic)
- `apps/console/src/themes/light.ts` / `dark.ts` — JS values that produce the CSS variables above
- `apps/console/src/themes/mui-theme.ts` — `shape.borderRadius`, palette, typography overrides

In Figma, every paint / stroke / effect **must** be bound to a Variable or published Style that mirrors one of these tokens. The hex / shadow literals in §4.2 are reference resolutions of the light theme — do not paste them; bind to the token.

### 4.1 Sizing

`Dialog.tsx` and its slots do not override MUI's default Dialog metrics; the Figma components therefore mirror MUI's defaults. Empty shell rows in the `<Dialog>` component set are drawn at a fixed **120 px** placeholder height — once content is dropped into the `slot`, the shell hugs its children vertically.

#### Shell (`<Dialog>`)

| `Size` | Width (px) | Empty placeholder height            | Corner radius | Elevation                           |
| ------ | ---------- | ----------------------------------- | ------------- | ----------------------------------- |
| `xs`   | `444`      | `120` (hugs content when populated) | `4`           | `material-design/shadows/shadows-8` |
| `sm`   | `600`      | `120` (hugs content when populated) | `4`           | `material-design/shadows/shadows-8` |
| `md`   | `900`      | `120` (hugs content when populated) | `4`           | `material-design/shadows/shadows-8` |
| `lg`   | `1200`     | `120` (hugs content when populated) | `4`           | `material-design/shadows/shadows-8` |
| `xl`   | `1536`     | `120` (hugs content when populated) | `4`           | `material-design/shadows/shadows-8` |

- Corner radius matches `theme.shape.borderRadius = 4` from `apps/console/src/themes/mui-theme.ts`.
- Elevation is MUI `shadows[8]` — bind to the published effect style **`material-design/shadows/shadows-8`** (composite of three drop shadows: `0 5 5 -3 #00000005`, `0 8 10 1 #00000024`, `0 3 14 2 #0000001F`). The Merak-namespaced alias `seed/elevation-8` is reserved but not yet published; until it ships, use the `material-design/*` path exactly as it appears in the Figma variable collection.
- Height hugs the stacked slots (title + content + actions) via vertical auto layout once the `slot` is populated.

#### Slots

| Slot              | Component symbol size (xs)                                   | Padding                                                                                    | Item gap                  | Font size / line-height  | Font family  | Weight  | Notes                                                                                                                                         |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------- | ------------------------ | ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `<DialogTitle>`   | `444 × 68`                                                   | `16 / 24` (Y / X)                                                                          | —                         | `20 / 32` (h6)           | Noto Sans TC | Medium  | Once embedded in a shell the row collapses to `444 × 56` (use-case examples render the title at this height).                                 |
| `<DialogContent>` | `444 × 44` (`Dividers=false`) / `444 × 64` (`Dividers=true`) | `0 / 24 / 20 / 24` (T R B L) for `Dividers=false`; `20 / 24 / 20 / 24` for `Dividers=true` | `8` (between text blocks) | `14 / 20` (body2)        | Roboto       | Regular | Width inherits from the shell. `Dividers=true` is taller because MUI re-introduces top padding so text does not clip the stroke.              |
| `<DialogActions>` | `484 × 84`                                                   | `16` (all sides)                                                                           | `8`                       | Inherits from `<Button>` | —            | —       | When embedded in a shell the row collapses to `444 × 68` (`16 + 36 button height + 16`). Horizontal auto-layout, `justify-content: flex-end`. |

- Typography: Title uses `material-design/typography/h6`; body uses `typography/body2`. Both are published Figma text styles — apply via `textStyleId`, never ad-hoc.
- The `<DialogContent>` top padding of `0` (when `Dividers=false`) is intentional: the title supplies the gap. In the Figma showcase the slot's bounding box ignores the gap and the painted content sits flush to the title's bottom padding.
- For `Dividers=true`, the 1 px strokes sit **above** the padding, and MUI switches the content padding from `0 24 20 24` to `20 24 20 24` so the text doesn't clip the divider — represent the same change in Figma.

### 4.2 Color token bindings

| Figma paint slot                                   | Token binding                                      | Notes                                                                                                                                                                                                           |
| -------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shell background (`<Dialog>`)                      | **`alias/colors/bg-default`**                      | `#ffffff` light / theme-resolved dark. Resolves to MUI `background.paper`.                                                                                                                                      |
| Shell shadow (`<Dialog>`)                          | **`material-design/shadows/shadows-8`** _(effect)_ | Published effect style; do not recreate as a custom drop shadow.                                                                                                                                                |
| Title text (`<DialogTitle>`)                       | **`alias/colors/text-default`**                    | 87% black. h6 typography.                                                                                                                                                                                       |
| Content text — default (`<DialogContent>`)         | **`alias/colors/text-default`**                    | 87% black. body2 typography.                                                                                                                                                                                    |
| Content text — description (`<DialogDescription>`) | **`alias/colors/text-sub`**                        | 60% black. body2 typography.                                                                                                                                                                                    |
| Content divider (`<DialogContent Dividers=true>`)  | **`alias/colors/border-defalt`**                   | Top + bottom 1 px strokes. `strokeAlign = INSIDE`. _Note: token name in the Figma variable collection is misspelled `border-defalt` (missing `u`) — bind to the name as published; see §8 for the rename path._ |
| Backdrop (MUI `Backdrop`)                          | **`alias/layout/mask-bg`**                         | `rgba(0, 0, 0, 0.5)` — runtime-only, not a child of the Figma component set. Document as a static overlay when mocking a screen.                                                                                |

> The `<Dialog>` shell is bound to `alias/colors/bg-default` in the published Figma variable collection. The shadow is bound to the published effect style `material-design/shadows/shadows-8`. If `seed/elevation-8` is later published as the Merak-namespaced alias, migrate the effect bindings per §8 and update §4.1 / §10.2.

### 4.3 Slot-composition rules

MUI's `DialogTitle` + `DialogContent` + `DialogActions` exchange padding to avoid double-spacing. Mirror these rules in Figma exactly:

| Composition                                                         | Padding adjustment                                                                               |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `<DialogTitle>` followed by `<DialogContent>`                       | `<DialogContent>` uses `padding-top: 0` (title's bottom padding supplies the gap).               |
| `<DialogContent Dividers=true>` followed by `<DialogActions>`       | Divider below content is flush; actions sit at `padding: 16`.                                    |
| `<DialogContent Dividers=false>` followed by `<DialogActions>`      | Actions sit at `padding: 16`; no divider.                                                        |
| `<DialogTitle>` directly followed by `<DialogActions>` (no content) | Only used for simple confirm dialogs — title keeps `16 / 24` padding, actions keep `16` padding. |

## 5. Icons

`<Dialog>` and its slots do **not** render icons directly. Icons appear only through child `<Button>` instances inside `<DialogActions>` (for destructive or confirming CTAs) or inline inside `<DialogContent>` via the shared `<Icon>` component set — see [`.claude/skills/figma-components/Button.md`](Button.md) §5 for the icon contract those instances must honor.

If a future close-button glyph is added to `<DialogTitle>` (e.g. a top-right `✕` affordance), extend the title component per §8 with a dedicated `Close Button` BOOLEAN property and a nested `<IconButton>` instance — do not hand-draw Vectors inside the title.

## 6. Layout

### 6.1 Shell component set layout

`<Dialog>` is laid out as **5 vertically stacked rows**, one per `Size`, each at the placeholder 120 px height (see §4.1):

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

- Outer shell uses **vertical auto-layout**, `align-items: stretch`, `gap: 0` (slots contribute their own padding).
- Shell hugs its contents vertically; width is fixed by the `Size` variant.
- Backdrop is a separate full-screen rectangle bound to `alias/layout/mask-bg` (α = 0.5) placed **behind** the shell. Not part of the component set — add it per-screen when mocking.

### 6.3 `UseCase` documentation frame

The Figma page includes a `UseCase` frame with three sub-sections that exercise the slot composition:

- **Sizes** — one example per Size variant (`xs` / `sm` / `md` / `lg` / `xl`), each composed of `<Dialog>` + `<DialogTitle>` + `<DialogContent>` + an actions row with two `<Button>` instances.
- **Content Dividers** — side-by-side `Dividers=false` vs `Dividers=true` examples at `xs`.
- **Common usage** — seven examples exercising the most common action shapes:
  1. **Acknowledge — single Primary action** (`xs`, 1 button) — `OK` dismiss.
  2. **Confirm — Cancel + Primary** (`xs`, 2 buttons) — the canonical two-button shape.
  3. **Destructive confirm — Cancel + Danger** (`xs`, 2 buttons) — Danger variant for irreversible actions.
  4. **Three-button footer — Tertiary + Cancel + Primary** (`xs`, 3 buttons) — `Save as draft / Discard / Publish`, tertiary left of cancel per §7.1.
  5. **Title-only confirmation — no `<DialogContent>`** (`xs`, title + actions only) — the content-free composition of §4.3.
  6. **Scrollable content — `Dividers=true`** (`xs`, long body) — demonstrates the scroll signal rendered by the top/bottom 1 px strokes.
  7. **Form dialog — `sm` with body + actions** (`sm`, 2 buttons) — `Invite member` form-style example.

These are **documentation-only assemblies** — they are not components and cannot be instanced. Treat them as references for screen authors when picking Size / Dividers / action count combinations.

## 7. Usage Guidelines

### 7.1 Picking a configuration

1. Choose the shell `Size`:
   - `xs` (444) — confirm / acknowledge dialogs (single question, ≤ 3 actions).
   - `sm` (600) — short forms (login, simple edit).
   - `md` (900) — standard forms and detail dialogs.
   - `lg` (1200) — complex multi-column forms, wide data previews.
   - `xl` (1536) — near-page-width modals (only when full-page navigation isn't appropriate).
2. Decide which slots the modal uses:
   - **Title + content + actions** — the canonical shape. Use for every destructive or data-changing modal.
   - **Title + actions** (no content) — pure confirmations. Keep the content-free composition per §4.3.
   - **Content + actions** (no title) — very rare. Prefer adding a title so the aria-labelledby wiring works out-of-the-box.
3. `<DialogContent Dividers>` — use `true` when the content is scrollable or visually dense (tables, long forms, stacked cards). Use `false` (default) for short prose.
4. `<DialogActions>` — drop the required number of `<Button>` instances into the slot. Conventional arrangements:
   - **1 button** — acknowledge-only ("OK").
   - **2 buttons** — cancel + primary (most common).
   - **3 buttons** — tertiary + cancel + primary (e.g. "Save as draft / Discard / Publish"). Keep tertiary left of cancel per Merak convention.
   - **4+ buttons** — reconsider the dialog shape or move overflow into a menu.

### 7.2 Accessibility & interaction

- **Aria wiring is automatic**: `Dialog.tsx` generates the `aria-labelledby` / `aria-describedby` IDs and `<DialogTitle>` / `<DialogDescription>` consume them via `DialogContext`. Designers never need to wire IDs manually.
- **Non-dismissable by default**: `disableBackdropClick = true` is the default. Every Merak modal must provide an explicit cancel / close path inside `<DialogActions>`. Do not design a modal whose only exit is the backdrop.
- **Escape key** mirrors the backdrop rule — if `disableBackdropClick = true`, Escape is also disabled. Document the same exit constraint in the flow spec.
- **`onAfterClose`** runs **after** the exit transition. Use it for request-cancellation, form-reset, and context-teardown side effects that must not race the animation.
- **`meta` / `useDialogMeta`** — when a dialog needs request-scoped data (e.g. the row being deleted), pass it via `meta` on `<Dialog>` and read it in the title / content / actions via `useDialogMeta<T>()`. Avoid prop-drilling through the slot tree.

### 7.3 When NOT to use `<Dialog>`

- **Transient feedback** (toasts, snackbars, confirmations that auto-dismiss) → use `<Snackbar>` / `<Toast>`, not a modal.
- **Full-page navigation** (wizards, detail views that own the viewport) → use a page route, not an `xl` modal.
- **Inline forms** that don't interrupt flow (quick edits on a table row) → use a `<Popover>` / `<Drawer>`, not a modal.
- **Non-blocking progress** (background uploads) → use a `<Drawer>` or inline progress, not a modal.

### 7.4 Don'ts

- ❌ Don't detach the shell to change its width — every supported size exists as a `Size` variant.
- ❌ Don't paint a custom shadow on the shell. `material-design/shadows/shadows-8` is the only elevation allowed for modals.
- ❌ Don't draw a close `✕` glyph inside `<DialogTitle>` ad-hoc — extend the component per §8 if a close affordance is required.
- ❌ Don't rely on backdrop-click dismissal in flow specs. `disableBackdropClick = true` is the Merak default.
- ❌ Don't stack two `<Dialog>` instances in the same screen mock — nested modals are not supported in the source and should not be designed.
- ❌ Don't invent a new description style by overriding `<Typography>` color. Use `<DialogDescription>` and bind to `alias/colors/text-sub`.

## 8. Source Sync Rule

This document and the source must move together (per the project's **Features Sync Rule** spirit, applied here to design-system components):

When **any** of the following changes:

1. `apps/console/src/components/Dialog/Dialog.tsx` (props, default values, `disableBackdropClick` behavior, `onAfterClose` wiring, `meta` signature)
2. `apps/console/src/components/Dialog/DialogTitle.tsx` / `DialogContent.tsx` / `DialogActions.tsx` / `DialogDescription.tsx` (props, forwarded attributes)
3. `apps/console/src/components/Dialog/DialogContext.ts` (`ariaLabelledby` / `ariaDescribedby` / `meta` context shape, `useDialogMeta` contract)
4. The Figma `<Dialog>` / `<DialogTitle>` / `<DialogContent>` / `<DialogActions>` component sets (variants, properties, token bindings)
5. `apps/console/src/themes/seed.css` / `alias.css` / `component.css` (CSS variable surface) — especially `--merak-seed-elevation-8`, `--merak-alias-bg-default`, `--merak-alias-text-*`, `--merak-alias-border-default`, `--merak-alias-layout-mask-bg`
6. `apps/console/src/themes/mui-theme.ts` (`shape.borderRadius`, palette, typography overrides — especially the `h6` and `body2` variants)

…this spec **must be updated in the same change**. Specifically:

- New prop exposed by `Dialog.tsx` (e.g. typed `size` / `maxWidth`, `fullWidth`, `fullScreen`) → add the matching axis / boolean to §2.1 / §3.1 and regenerate the shell variants.
- New slot component (e.g. `<DialogCloseButton>`, `<DialogIcon>`) → add a new section under §2, a row in §3, and new tokens in §4.2.
- `disableBackdropClick` default flipping to `false` → update §2.1, §7.2, and §7.4 accordingly and add a dedicated page-level callout in the Figma doc frame.
- New `Actions` count (e.g. 4-button footer) → append to §2.4 / §3.3 and add a new use-case example in the `UseCase` frame.
- Removing `<DialogDescription>` (or adding a dedicated Figma component for it) → update §2.5 and add / remove the matching tokens in §4.2.
- Token rename / removal in `seed.css` or `alias.css` — e.g. `alias/colors/bg-default` → `alias/surface/paper` — update every reference in §4.2, §4.3, and §10 and rename the matching variable in the `merak` Figma collection.
- Token value change in `light.ts` / `dark.ts` → no edit to this spec needed (Figma variables resolve through the same token name); only re-publish the Figma library.
- Elevation change (e.g. `shadows[8]` → a custom modal elevation token) → update §4.1, §4.2, and §10.3 to point at the new token and rebind the Figma effect.

## 9. Quick Reference

```ts
// Source prop surface (Dialog.tsx + slots)
interface DialogProps {
  open: boolean; // runtime-only
  children: React.ReactNode; // → nested <DialogTitle> / <DialogContent> / <DialogActions>
  disableBackdropClick?: boolean; // default true — Merak modals are non-dismissable
  onAfterClose?: () => void; // runs after exit transition
  onClose?: () => void; // runtime handler
  meta?: unknown; // context pass-through (read via useDialogMeta)
  // MUI-forwarded: maxWidth  → Figma `Size` (xs | sm | md | lg | xl)
}

interface DialogContentProps extends React.ComponentProps<'div'> {
  dividers?: boolean; // → Figma `Dividers` (false | true)
}

interface DialogActionsProps extends React.ComponentProps<'div'> {
  disableSpacing?: boolean; // not represented in Figma
}

interface DialogDescriptionProps {
  color?: MuiDialogContentTextProps['color'];
  variant?: MuiDialogContentTextProps['variant'];
}

export function useDialogMeta<T>(): T; // read Dialog.meta from descendant components
```

```
Figma page  : Dialog frame

<Dialog> Component Set
  Variant axes : Size
  Options      : xs | sm | md | lg | xl
  Default      : xs (444 px)
  Slot props   : slot (SLOT, shared across all 5 variants)
  Total        : 5 variants
  Empty height : 120 px placeholder; hugs content once slot is populated

<DialogTitle> Component
  Variant axes : (none)
  Slot props   : slot (SLOT)
  Symbol size  : 444 × 68 (collapses to 444 × 56 when embedded in a shell)

<DialogContent> Component Set
  Variant axes : Dividers
  Options      : false | true
  Default      : false
  Slot props   : slot (SLOT, shared across both variants)
  Symbol size  : 444 × 44 (Dividers=false) / 444 × 64 (Dividers=true)
  Total        : 2 variants

<DialogActions> Component
  Variant axes : (none)
  Slot props   : Slot (SLOT, whole row)
  Symbol size  : 484 × 84 (collapses to 444 × 68 when embedded in a shell)
  Default      : empty — drop 1–n <Button> instances inside
```

## 10. Token Glossary

The complete set of Merak design tokens consumed by `<Dialog>`. Names below are **Figma variable paths** in the `merak` collection (see `.claude/skills/figma-operator-guide/references/tokens.md`). Bind every Figma paint / stroke / effect to one of these — never to a literal value.

### 10.1 Alias tokens (`alias/*`)

| Token                        | Used by                                                | Role                                                                                 |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `alias/colors/bg-default`    | `<Dialog>` shell background                            | `#ffffff` light / theme-resolved dark — MUI `background.paper`.                      |
| `alias/colors/text-default`  | `<DialogTitle>` text; `<DialogContent>` text (default) | 87 % black.                                                                          |
| `alias/colors/text-sub`      | `<DialogDescription>` text                             | 60 % black — secondary body copy.                                                    |
| `alias/colors/text-disabled` | `<DialogContent>` text inside disabled sections        | 38 % black.                                                                          |
| `alias/colors/border-defalt` | `<DialogContent Dividers=true>` top + bottom borders   | 1 px strokes around the content region.                                              |
| `alias/layout/mask-bg`       | Modal backdrop (runtime-only, per-screen overlay)      | `rgba(0, 0, 0, 0.5)` — document as a full-screen rect behind the shell when mocking. |

### 10.2 Effect / seed tokens

| Token                               | Used by          | Role                                                                                                                                           |
| ----------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `material-design/shadows/shadows-8` | `<Dialog>` shell | Composite drop shadow — MUI `shadows[8]`. Applied as a published effect style. Currently the only shadow token bound by these components.      |
| `seed/elevation-8`                  | _(reserved)_     | Merak-namespaced alias of `material-design/shadows/shadows-8`; not yet published. Bind to the `material-design/*` path until migration per §8. |
| `seed/drop-elevation-8`             | _(reserved)_     | Flat drop-shadow variant; reserved for future platforms that can't composite MUI's 3-layer shadow.                                             |

### 10.3 Shape & elevation

- Corner radius: `theme.shape.borderRadius = 4` (from `mui-theme.ts`). The Figma shell hard-codes `cornerRadius = 4` until a dedicated modal-radius token exists.
- Elevation: `material-design/shadows/shadows-8` (MUI shadows index 8) — all modal sizes use the same elevation.
- Backdrop opacity: `0.5` hard-coded in MUI; bind via `alias/layout/mask-bg` rather than a custom rgba paint.

### 10.4 Typography

`Dialog.tsx` and its slots do not override MUI typography. The resolved values come from `theme.typography` and are exposed as published Figma text styles:

- **Title** — `material-design/typography/h6`:
  - Family: `Noto Sans TC`
  - Weight: `Medium (500)`
  - Size / line-height: `20 / 32`
  - Letter-spacing: `0`
- **Body** — `typography/body2`:
  - Family: `Roboto, Helvetica, Arial, sans-serif`
  - Weight: `Regular (400)`
  - Size / line-height: `14 / 20` (with `letterSpacing: 0.17`, `lineHeight: 1.43` in design units)
- **Button label inside actions** — `button/medium`:
  - Family: `Roboto`
  - Weight: `Medium (500)`
  - Size / line-height: `14 / 24`
  - Letter-spacing: `0.4`
  - `textCase: UPPER`

If the project later introduces modal-specific typography tokens (e.g. `--merak-typography-dialog-title-*`), update §4.1, §4.3, and §10.4 to bind to them and re-publish the affected Figma text styles.
